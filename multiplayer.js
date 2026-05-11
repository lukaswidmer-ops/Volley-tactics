/* ================================================================
   VOLLEY VENDETTA — Multiplayer module
   ----------------------------------------------------------------
   Loaded as ES module (<script type="module" src="multiplayer.js">).
   Imports firebase.js for the Realtime DB handle.
   Exposes window.VV_MP and overrides window.VV_FIREBASE so the
   existing isAvailable()-gate in game.js unlocks the MP submenu.

   ----------------------------------------------------------------
   ARCHITECTURE NOTES (read once before changing anything)
   ----------------------------------------------------------------
   How the solo game flows (game.js):
     boot() → setView('intro' | 'menu')
       intro  → renderIntro()
       menu   → renderMenu()  (Solo / Multiplayer buttons)
                Solo  → startSolo() → initSoloGame() → setView('draft')
                MP    → openMultiplayer() → setView('mp_submenu')
       draft  → renderDraft()  → draftFinish() → setView('auction')
       auction→ renderAuction()→ runOpeningAuction() → setView('starting')
       starting→ renderStarting() → rollStartingDice() → setView('game')
       game   → renderGame() → runSeason()  (week loop, market, end)
       end    → renderEnd()

   Central globals:
     window.VV           — public API (setView, startSolo, …)
     window.VV_BOTS      — bot AI module (shouldBid, pickMarketBuy,
                           pickProtect, pickSteal, pickPersonas …)
     window.VV_FIREBASE  — stub from game-firebase.js; this module
                           replaces it with a real wrapper
     window.VV_CARDS_DB  — full card pool, built on game start
     ALL_CARDS           — same pool, IIFE-internal in game.js
     state               — IIFE-internal in game.js. Holds lang,
                           view, playerName, mode, game (=null
                           until a game starts) and speed.
     state.game.players  — array of 4 players. In solo, index 0 is
                           always the human.

   How bots decide (game-bots.js):
     shouldBid(bot, card, currentBid, minBid, opponents)
        → { pass:true } | { bid:Number }
     pickMarketBuy(bot, market)   → card | null
     pickProtect(bot)             → position | null
     pickSteal(bot, fromPlayer)   → position | null
     pickPersonas(n)              → n persona seeds
     Personas: aggressive / balanced / defensive (price bias).

   How field actions fire (game.js):
     runSeason() → runConeRoll() → resolveDay(day, player)
                                 → runEventSpace(type, player)
                                 → ac_*() action-card handlers
                                 → applyVnlEvent / applyInjury /
                                   applyRedCard / applyTransfer
     Tournaments / weekend matches: runTournament(),
     runWeekendMatches(week), runLeagueMatch().
     Match resolution: runMatchClassic(home, away, isTournament)
                       → resolveCriterion(dice, M).

   Where player decisions are awaited (game.js):
     waitFor(name, autoMs)  / fire(name, val)
       names used:
         coneRollNow, coneContinue, continueAfterMatch, serveOnce,
         endMarket
     Bid / opponent / protect / steal popups resolve through
     ad-hoc Promises inside their handler (humanBidPopup,
     pickOpponent, ac_talentfoerderung …).
     Bots are routed through the same code paths but their
     "click" is fired immediately by the host.

   ----------------------------------------------------------------
   This module owns the lobby UI, room creation/join, rejoin via
   localStorage, the pause mechanic and state-sync plumbing.
   It does NOT modify any solo game logic — solo runs untouched.
   The host runs the existing engine locally. Once a real multiplayer
   match begins, syncState() pushes the host's state to Firebase
   and non-host clients re-render from the snapshot.
   ================================================================ */

import {
  db, ref, set, get, update, onValue, remove
} from './firebase.js';

// ---------------------------------------------------------------
// Constants
// ---------------------------------------------------------------
const ROOM_TTL_MS         = 30 * 60 * 1000;   // 30 min
const HEARTBEAT_MS        = 15 * 1000;        // lastSeen ping
const DISCONNECT_AFTER_MS = 20 * 1000;        // host promotion / bot takeover
const PAUSE_MAX_MS        = 60 * 1000;        // 60 s
const FINISHED_CLEANUP_MS = 5 * 60 * 1000;    // 5 min after finish
const ROOM_CODE_CHARS     = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const MAX_HUMANS_PER_ROOM = 4;

// ---------------------------------------------------------------
// Local session state
// ---------------------------------------------------------------
const session = {
  playerId: null,        // persisted in localStorage as vv_playerId
  roomCode: null,
  isHost:   false,
  unsubscribers: [],     // onValue() return values
  heartbeatTimer: null,
  pauseTimer: null,
  lastRoomSnapshot: null,
};

function ensurePlayerId() {
  let id = localStorage.getItem('vv_playerId');
  if (!id) {
    id = 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem('vv_playerId', id);
  }
  session.playerId = id;
  return id;
}

// ---------------------------------------------------------------
// Tiny helpers (kept independent of game.js internals)
// ---------------------------------------------------------------
const L = () => (localStorage.getItem('vv_lang') || 'de');
const DE = (de, en) => (L() === 'de' ? de : en);
function $(sel) { return document.querySelector(sel); }
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}
function showToast(msg, kind = '') {
  try {
    if (window.VV && typeof window.VV.toast === 'function') {
      window.VV.toast(msg, kind, 3500);
      return;
    }
  } catch (_) {}
  // Fallback: build our own toast on the existing layer
  const layer = $('#toast-layer');
  if (!layer) { alert(msg); return; }
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  layer.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}
function setAppView(view) {
  const app = $('#app');
  if (app) app.dataset.view = view;
}

// Friendly error wrapper for Firebase calls.
async function fb(label, fn) {
  try { return await fn(); }
  catch (err) {
    console.error('[VV_MP] ' + label + ':', err);
    showToast(DE(
      'Verbindungsfehler: ' + (err && err.message ? err.message : label),
      'Connection error: ' + (err && err.message ? err.message : label)
    ), 'bad');
    throw err;
  }
}

// ---------------------------------------------------------------
// Room code generation
// ---------------------------------------------------------------
function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

async function generateUniqueRoomCode() {
  for (let tries = 0; tries < 20; tries++) {
    const code = generateRoomCode();
    const snap = await get(ref(db, 'rooms/' + code));
    if (!snap.exists()) return code;
    // Opportunistic cleanup: if the existing room is expired, evict it.
    const meta = snap.val() && snap.val().meta;
    if (meta && typeof meta.expiresAt === 'number' && meta.expiresAt < Date.now()) {
      try { await remove(ref(db, 'rooms/' + code)); } catch (_) {}
      return code;
    }
  }
  throw new Error(DE('Konnte keinen freien Raum-Code finden.', 'Could not allocate a free room code.'));
}

// ---------------------------------------------------------------
// Public entry points (called from game.js menu buttons)
// ---------------------------------------------------------------
async function createRoom() {
  try {
    ensurePlayerId();
    const name = currentPlayerName();
    if (!name) {
      showToast(DE('Bitte zuerst einen Namen eingeben.', 'Please enter a name first.'), 'bad');
      return;
    }
    const code = await fb('createRoom/allocate', generateUniqueRoomCode);
    const now = Date.now();
    const roomData = {
      meta: {
        createdAt: now,
        expiresAt: now + ROOM_TTL_MS,
        hostId:    session.playerId,
        status:    'lobby',
      },
      players: {
        [session.playerId]: {
          name,
          isBot:        false,
          isConnected:  true,
          lastSeen:     now,
          pauseUntil:   null,
          slotIndex:    0,
        }
      }
    };
    await fb('createRoom/write', () => set(ref(db, 'rooms/' + code), roomData));
    session.roomCode = code;
    session.isHost   = true;
    startHeartbeat();
    listenToRoom();
    renderLobby();
  } catch (_) { /* toast already shown */ }
}

function showJoinForm() {
  ensurePlayerId();
  const app = $('#app');
  if (!app) return;
  setAppView('mp_join');
  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card">
        <button class="menu-back" data-vvmp-back="menu">‹ ${esc(DE('Zurück', 'Back'))}</button>
        <div class="menu-title"><span class="accent">${esc(DE('Raum beitreten', 'Join Room'))}</span></div>
        <div class="menu-sub">${esc(DE('6-stelliger Code vom Host', 'Six-character code from the host'))}</div>
        <div class="menu-row">
          <label class="label">${esc(DE('Raum-Code', 'Room Code'))}</label>
          <input class="input" id="vvmp-code" maxlength="6"
                 style="text-transform:uppercase;letter-spacing:0.3em;font-family:'Barlow Condensed',sans-serif;font-weight:800;"
                 placeholder="A7KX2M"/>
        </div>
        <div class="menu-row">
          <label class="label">${esc(DE('Dein Name', 'Your Name'))}</label>
          <input class="input" id="vvmp-name" maxlength="20" value="${esc(currentPlayerName())}"/>
        </div>
        <div class="menu-actions">
          <button class="btn btn-primary btn-large" id="vvmp-join-go">${esc(DE('Beitreten', 'Join'))} ▸</button>
        </div>
      </div>
    </div>`;
  const codeInp = document.getElementById('vvmp-code');
  if (codeInp) {
    codeInp.addEventListener('input', () => {
      codeInp.value = codeInp.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    });
    codeInp.focus();
  }
  document.getElementById('vvmp-join-go').addEventListener('click', joinRoomFromForm);
  document.querySelectorAll('[data-vvmp-back]').forEach(b => {
    b.addEventListener('click', () => {
      if (window.VV && typeof window.VV.setView === 'function') window.VV.setView('menu');
    });
  });
}

async function joinRoomFromForm() {
  const code = (document.getElementById('vvmp-code') || {}).value || '';
  const name = ((document.getElementById('vvmp-name') || {}).value || '').trim().slice(0, 20);
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    showToast(DE('Ungültiger Raum-Code.', 'Invalid room code.'), 'bad'); return;
  }
  if (!name) {
    showToast(DE('Bitte gib einen Namen ein.', 'Please enter a name.'), 'bad'); return;
  }
  localStorage.setItem('vv_name', name);
  await joinRoom(code, name);
}

async function joinRoom(code, name) {
  try {
    ensurePlayerId();
    const snap = await fb('joinRoom/read', () => get(ref(db, 'rooms/' + code)));
    if (!snap.exists()) {
      showToast(DE('Raum nicht gefunden.', 'Room not found.'), 'bad'); return;
    }
    const room = snap.val();
    const meta = room.meta || {};
    if (typeof meta.expiresAt === 'number' && meta.expiresAt < Date.now()) {
      showToast(DE('Raumcode abgelaufen.', 'Room code expired.'), 'bad'); return;
    }
    const players = room.players || {};
    const existing = players[session.playerId];

    // Rejoin path: same device, same playerId.
    if (existing) {
      const now = Date.now();
      await fb('joinRoom/rejoin', () => update(ref(db, `rooms/${code}/players/${session.playerId}`), {
        name,
        isBot:       false,
        isConnected: true,
        lastSeen:    now,
        pauseUntil:  null,
      }));
      session.roomCode = code;
      session.isHost = (meta.hostId === session.playerId);
      startHeartbeat();
      listenToRoom();
      if (meta.status === 'running' || meta.status === 'finished') {
        // Live game: jump into the synced board (read-only viewer)
        showToast(DE('Wiederverbunden.', 'Reconnected.'), 'good');
        if (window.VV && typeof window.VV.setView === 'function') window.VV.setView('game');
      } else {
        renderLobby();
      }
      return;
    }

    // Fresh slot: must be lobby + open seat
    if (meta.status !== 'lobby') {
      // No slot for this device: per spec
      showToast(DE('Kein aktiver Slot gefunden für dieses Gerät.', 'No active slot found for this device.'), 'bad');
      return;
    }
    const humans = Object.values(players).filter(p => p && !p.isBot);
    if (humans.length >= MAX_HUMANS_PER_ROOM) {
      showToast(DE('Raum ist voll.', 'Room is full.'), 'bad'); return;
    }
    const slotIndex = nextFreeSlotIndex(players);
    const now = Date.now();
    await fb('joinRoom/insert', () => set(ref(db, `rooms/${code}/players/${session.playerId}`), {
      name, isBot: false, isConnected: true, lastSeen: now, pauseUntil: null, slotIndex
    }));
    session.roomCode = code;
    session.isHost = (meta.hostId === session.playerId);
    startHeartbeat();
    listenToRoom();
    renderLobby();
  } catch (_) { /* toast already shown */ }
}

function nextFreeSlotIndex(playersMap) {
  const taken = new Set();
  for (const p of Object.values(playersMap || {})) {
    if (p && typeof p.slotIndex === 'number') taken.add(p.slotIndex);
  }
  for (let i = 0; i < MAX_HUMANS_PER_ROOM; i++) {
    if (!taken.has(i)) return i;
  }
  return 0;
}

function currentPlayerName() {
  // game.js stores it on state.playerName + localStorage.vv_name
  try {
    if (window.VV && window.VV.state && window.VV.state.playerName) {
      return String(window.VV.state.playerName).trim();
    }
  } catch (_) {}
  return (localStorage.getItem('vv_name') || '').trim();
}

// ---------------------------------------------------------------
// Heartbeat (write lastSeen every 15s)
// ---------------------------------------------------------------
function startHeartbeat() {
  stopHeartbeat();
  const ping = () => {
    if (!session.roomCode || !session.playerId) return;
    update(ref(db, `rooms/${session.roomCode}/players/${session.playerId}`), {
      lastSeen: Date.now(), isConnected: true
    }).catch(err => console.warn('[VV_MP] heartbeat failed:', err));
  };
  ping();
  session.heartbeatTimer = setInterval(ping, HEARTBEAT_MS);
}
function stopHeartbeat() {
  if (session.heartbeatTimer) { clearInterval(session.heartbeatTimer); session.heartbeatTimer = null; }
}

// ---------------------------------------------------------------
// Room listener (lobby + in-game state mirror)
// ---------------------------------------------------------------
function listenToRoom() {
  stopListening();
  if (!session.roomCode) return;
  const roomRef = ref(db, 'rooms/' + session.roomCode);
  const unsub = onValue(roomRef, snap => {
    if (!snap.exists()) {
      // Room was deleted/expired
      showToast(DE('Raum wurde geschlossen.', 'Room was closed.'), 'bad');
      leaveRoom(/*silent*/ true);
      return;
    }
    const room = snap.val();
    session.lastRoomSnapshot = room;
    onRoomUpdate(room);
  }, err => {
    console.error('[VV_MP] room onValue err:', err);
    showToast(DE('Verbindungsabbruch zum Raum.', 'Room connection lost.'), 'bad');
  });
  session.unsubscribers.push(unsub);
}
function stopListening() {
  for (const u of session.unsubscribers) { try { u(); } catch (_) {} }
  session.unsubscribers = [];
}

function onRoomUpdate(room) {
  // Track host promotion if current host went stale.
  maybePromoteHost(room);

  const meta = room.meta || {};
  const view = ($('#app') || {}).dataset && $('#app').dataset.view;

  // Auto-transition non-hosts into spectator mode once the host clicks "Start".
  if (meta.status === 'running' && !session.gameLaunched) {
    session.gameLaunched = true;
    if (!session.isHost && window.VV && typeof window.VV.startMultiplayer === 'function') {
      const lobbyPlayers = Object.entries(room.players || {})
        .map(([id, p]) => ({ id, ...p }));
      window.VV.startMultiplayer({
        roomCode:      session.roomCode,
        hostId:        meta.hostId,
        localPlayerId: session.playerId,
        players:       lobbyPlayers,
      });
    }
  }

  // Refresh the lobby UI when we're in lobby view
  if (view === 'mp_lobby') {
    paintLobby(room);
  }

  // Spectators: mirror the host's game state whenever it changes.
  if (!session.isHost && room.gameState) {
    applyRemoteGameState(room.gameState);
  }
}

function paintViewerWaiting() {
  const app = $('#app');
  if (!app) return;
  setAppView('mp_viewer');
  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card" style="text-align:center;">
        <div class="menu-title"><span class="accent">${esc(DE('Spiel läuft', 'Game running'))}</span></div>
        <div class="menu-sub">${esc(DE('Warte auf erste Daten vom Host…', 'Waiting for first snapshot from host…'))}</div>
        <div class="splash-spinner" style="margin:1.5rem auto;"></div>
        <button class="btn btn-secondary" data-vvmp-leave>${esc(DE('Lobby verlassen', 'Leave lobby'))}</button>
      </div>
    </div>`;
  document.querySelectorAll('[data-vvmp-leave]').forEach(b => {
    b.addEventListener('click', () => leaveRoom());
  });
}

function maybePromoteHost(room) {
  const meta = room.meta || {};
  const players = room.players || {};
  const host = players[meta.hostId];
  const now = Date.now();
  const hostStale = !host
    || host.isBot
    || (typeof host.lastSeen === 'number' && (now - host.lastSeen) > DISCONNECT_AFTER_MS);
  if (!hostStale) return;

  // Pick the lowest-slot human that is connected.
  const candidates = Object.entries(players)
    .filter(([, p]) => p && !p.isBot && p.isConnected !== false
      && typeof p.lastSeen === 'number' && (now - p.lastSeen) <= DISCONNECT_AFTER_MS)
    .sort((a, b) => (a[1].slotIndex || 0) - (b[1].slotIndex || 0));
  if (!candidates.length) return;
  const [newHostId] = candidates[0];
  if (newHostId === meta.hostId) return;

  // Only the candidate itself writes the promotion to avoid races.
  if (newHostId !== session.playerId) return;
  update(ref(db, `rooms/${session.roomCode}/meta`), { hostId: newHostId })
    .then(() => {
      session.isHost = true;
      showToast(DE('Du bist jetzt Host.', 'You are now host.'), 'good');
    })
    .catch(err => console.warn('[VV_MP] host promotion failed:', err));
}

// ---------------------------------------------------------------
// Lobby UI
// ---------------------------------------------------------------
function renderLobby() {
  setAppView('mp_lobby');
  const room = session.lastRoomSnapshot;
  paintLobby(room || { players: {}, meta: { hostId: session.playerId } });
}

function paintLobby(room) {
  const app = $('#app');
  if (!app) return;
  setAppView('mp_lobby');
  const meta = (room && room.meta) || {};
  const playersMap = (room && room.players) || {};
  const isHost = meta.hostId === session.playerId;
  session.isHost = isHost;

  // Sort by slotIndex 0..3
  const slots = [];
  for (let i = 0; i < MAX_HUMANS_PER_ROOM; i++) slots.push(null);
  for (const [id, p] of Object.entries(playersMap)) {
    if (!p) continue;
    const idx = typeof p.slotIndex === 'number'
      ? Math.max(0, Math.min(MAX_HUMANS_PER_ROOM - 1, p.slotIndex))
      : 0;
    if (!slots[idx]) slots[idx] = { id, ...p };
  }

  const filled = slots.filter(Boolean).length;
  const canStart = isHost && filled >= 2 && filled === MAX_HUMANS_PER_ROOM;

  const slotRows = slots.map((p, i) => {
    if (!p) {
      return `
        <div class="vvmp-slot empty">
          <span class="vvmp-num">${i + 1}.</span>
          <span class="vvmp-empty">— ${esc(DE('wartet…', 'waiting…'))}</span>
          ${isHost ? `<button class="btn btn-secondary vvmp-bot-btn" data-vvmp-addbot="${i}">${esc(DE('Bot hinzufügen', 'Add bot'))}</button>` : ''}
        </div>`;
    }
    const me = p.id === session.playerId;
    const hostTag = (meta.hostId === p.id) ? ` <span class="vvmp-tag host">${esc(DE('Host', 'Host'))}</span>` : '';
    const meTag   = me ? ` <span class="vvmp-tag me">${esc(DE('Du', 'You'))}</span>` : '';
    const botTag  = p.isBot ? ` <span class="vvmp-tag bot">${esc(DE('Bot', 'Bot'))}</span>` : '';
    const onlineDot = p.isBot
      ? '🤖'
      : (p.isConnected ? '🟢' : '⚪');
    const kickBtn = (isHost && !me && p.isBot)
      ? `<button class="btn btn-secondary vvmp-kick" data-vvmp-rm="${p.id}">×</button>` : '';
    return `
      <div class="vvmp-slot">
        <span class="vvmp-num">${i + 1}.</span>
        <span class="vvmp-dot">${onlineDot}</span>
        <span class="vvmp-name">${esc(p.name || (DE('Spieler', 'Player')))}</span>
        ${hostTag}${meTag}${botTag}
        ${kickBtn}
      </div>`;
  }).join('');

  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card vvmp-lobby">
        <button class="menu-back" data-vvmp-leave>‹ ${esc(DE('Lobby verlassen', 'Leave lobby'))}</button>
        <div class="menu-title"><span class="accent">${esc(DE('Lobby', 'Lobby'))}</span></div>
        <div class="vvmp-codebar">
          <div>
            <div class="vvmp-codelabel">${esc(DE('Raum-Code', 'Room code'))}</div>
            <div class="vvmp-code" id="vvmp-code-val">${esc(session.roomCode || '')}</div>
          </div>
          <button class="btn btn-secondary" id="vvmp-copy">${esc(DE('Kopieren', 'Copy'))}</button>
        </div>
        <div class="vvmp-slots">${slotRows}</div>
        ${isHost ? `
          <div class="menu-actions" style="margin-top:1.4rem;">
            <button class="btn btn-primary btn-large" id="vvmp-start" ${canStart ? '' : 'disabled'}>
              ${esc(DE('Spiel starten', 'Start game'))} ▸
            </button>
            <div class="menu-sub" style="text-align:center; margin-top:0.4rem;">
              ${esc(DE('Alle 4 Plätze müssen gefüllt sein (Mensch oder Bot).', 'All 4 seats must be filled (human or bot).'))}
            </div>
          </div>
        ` : `
          <div class="menu-sub" style="text-align:center; margin-top:1.4rem;">
            ${esc(DE('Warte auf Host…', 'Waiting for host…'))}
          </div>
        `}
      </div>
    </div>`;

  // Wire up controls
  const copyBtn = document.getElementById('vvmp-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(session.roomCode || '');
        copyBtn.textContent = DE('Kopiert!', 'Copied!');
        setTimeout(() => { copyBtn.textContent = DE('Kopieren', 'Copy'); }, 1500);
      } catch (_) {
        showToast(DE('Konnte nicht kopieren.', 'Could not copy.'), 'bad');
      }
    });
  }
  document.querySelectorAll('[data-vvmp-addbot]').forEach(b => {
    b.addEventListener('click', () => {
      const slotIdx = parseInt(b.getAttribute('data-vvmp-addbot'), 10) || 0;
      addBotToSlot(slotIdx);
    });
  });
  document.querySelectorAll('[data-vvmp-rm]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-vvmp-rm');
      if (id) removePlayer(id);
    });
  });
  document.querySelectorAll('[data-vvmp-leave]').forEach(b => {
    b.addEventListener('click', () => leaveRoom());
  });
  const startBtn = document.getElementById('vvmp-start');
  if (startBtn) startBtn.addEventListener('click', startGameFromLobby);
}

async function addBotToSlot(slotIdx) {
  if (!session.isHost || !session.roomCode) return;
  const room = session.lastRoomSnapshot || {};
  const players = room.players || {};
  // If slot is taken, bail
  for (const p of Object.values(players)) {
    if (p && p.slotIndex === slotIdx) {
      showToast(DE('Platz ist bereits belegt.', 'Slot is already occupied.'), 'bad');
      return;
    }
  }
  const botId = 'bot_' + Math.random().toString(36).slice(2, 10);
  let botName = 'Bot ' + (slotIdx + 1);
  try {
    const personas = (window.VV_BOTS && window.VV_BOTS.PERSONAS) || [];
    const pick = personas[Math.floor(Math.random() * personas.length)];
    if (pick) botName = 'Bot ' + pick.name;
  } catch (_) {}
  await fb('addBot', () => set(ref(db, `rooms/${session.roomCode}/players/${botId}`), {
    name: botName,
    isBot: true,
    isConnected: true,
    lastSeen: Date.now(),
    pauseUntil: null,
    slotIndex: slotIdx,
  }));
}

async function removePlayer(playerId) {
  if (!session.isHost || !session.roomCode) return;
  if (playerId === session.playerId) return;
  await fb('removePlayer', () => remove(ref(db, `rooms/${session.roomCode}/players/${playerId}`)));
}

async function leaveRoom(silent) {
  stopHeartbeat();
  stopListening();
  const code = session.roomCode;
  const pid  = session.playerId;
  session.roomCode = null;
  session.isHost = false;
  session.lastRoomSnapshot = null;
  if (code && pid) {
    try { await remove(ref(db, `rooms/${code}/players/${pid}`)); } catch (_) {}
  }
  if (!silent) showToast(DE('Lobby verlassen.', 'Left lobby.'), '');
  // Return to MP submenu or main menu
  if (window.VV && typeof window.VV.setView === 'function') {
    window.VV.setView('menu');
  }
}

async function startGameFromLobby() {
  if (!session.isHost || !session.roomCode) return;
  const room = session.lastRoomSnapshot;
  const players = (room && room.players) || {};
  const filled = Object.values(players).filter(Boolean);
  if (filled.length < 2) {
    showToast(DE('Min. 2 Spieler benötigt.', 'Need at least 2 players.'), 'bad'); return;
  }
  if (filled.length < MAX_HUMANS_PER_ROOM) {
    showToast(DE('Bitte alle 4 Plätze füllen (Mensch oder Bot).',
                 'Fill all 4 seats (human or bot).'), 'bad');
    return;
  }
  await fb('startGame', () => update(ref(db, `rooms/${session.roomCode}/meta`), { status: 'running' }));
  // Host kicks off the local game flow. Solo init is reused; once integrated,
  // we will swap into a real multiplayer engine. For now, the host runs the
  // existing engine locally and writes state snapshots to Firebase.
  showToast(DE('Spiel gestartet — Host führt die Runde aus.',
               'Game started — host is running the round.'), 'good');
  // The actual deep game-state sync is wired through window.VV when the
  // host triggers state mutations. See state-sync helpers below.
  if (window.VV && typeof window.VV.startMultiplayer === 'function') {
    window.VV.startMultiplayer({
      roomCode:    session.roomCode,
      players:     Object.entries(players).map(([id, p]) => ({ id, ...p })),
      hostId:      session.playerId,
      localPlayerId: session.playerId,
    });
  } else {
    showToast(DE('Spielstart-Brücke fehlt. Bitte Solo verwenden.',
                 'Game-start bridge missing. Please use Solo for now.'), 'bad');
  }
}

// ---------------------------------------------------------------
// State sync (host writes / non-host reads)
// ---------------------------------------------------------------
async function syncState(gameState) {
  if (!session.isHost || !session.roomCode) return;
  try {
    // Deep-clone via JSON to drop functions / circular refs.
    const safe = JSON.parse(JSON.stringify(gameState || null));
    await set(ref(db, `rooms/${session.roomCode}/gameState`), safe);
  } catch (err) {
    console.warn('[VV_MP] syncState failed:', err);
  }
}

function applyRemoteGameState(remote) {
  try {
    if (window.VV && typeof window.VV.applyRemoteState === 'function') {
      window.VV.applyRemoteState(remote);
    }
  } catch (err) {
    console.warn('[VV_MP] applyRemoteState failed:', err);
  }
}

// ---------------------------------------------------------------
// Per-turn input bridge
// ---------------------------------------------------------------
async function submitInput(payload) {
  if (!session.roomCode || !session.playerId) return;
  await fb('submitInput', () => set(ref(db, `rooms/${session.roomCode}/inputs/${session.playerId}`), {
    at: Date.now(),
    payload,
  }));
}

function listenForInput(playerId, cb) {
  if (!session.roomCode || !playerId) return () => {};
  const r = ref(db, `rooms/${session.roomCode}/inputs/${playerId}`);
  const unsub = onValue(r, snap => {
    if (!snap.exists()) return;
    const v = snap.val();
    try { cb(v && v.payload); } catch (_) {}
    // Host clears after handling
    if (session.isHost) {
      remove(r).catch(() => {});
    }
  });
  session.unsubscribers.push(unsub);
  return unsub;
}

async function setCurrentTurn(playerId, phase, action) {
  if (!session.isHost || !session.roomCode) return;
  await fb('setCurrentTurn', () => set(ref(db, `rooms/${session.roomCode}/turns/currentTurn`), {
    playerId, phase: phase || null, action: action || null, timestamp: Date.now()
  }));
}

// ---------------------------------------------------------------
// Pause mechanic
// ---------------------------------------------------------------
async function pauseSelf() {
  if (!session.roomCode || !session.playerId) return;
  const until = Date.now() + PAUSE_MAX_MS;
  await fb('pauseSelf', () => update(ref(db, `rooms/${session.roomCode}/players/${session.playerId}`), {
    pauseUntil: until
  }));
  if (session.pauseTimer) clearTimeout(session.pauseTimer);
  session.pauseTimer = setTimeout(resumeSelf, PAUSE_MAX_MS + 250);
}
async function resumeSelf() {
  if (!session.roomCode || !session.playerId) return;
  if (session.pauseTimer) { clearTimeout(session.pauseTimer); session.pauseTimer = null; }
  await fb('resumeSelf', () => update(ref(db, `rooms/${session.roomCode}/players/${session.playerId}`), {
    pauseUntil: null
  }));
}

// ---------------------------------------------------------------
// Disconnect / cleanup
// ---------------------------------------------------------------
function handleDisconnect() {
  // Browsers fire pagehide on tab close. We do not promote to bot here —
  // the heartbeat will simply stop, and other clients will see the slot
  // as stale (> DISCONNECT_AFTER_MS) and let the host bot it.
  stopHeartbeat();
  stopListening();
}
window.addEventListener('pagehide', handleDisconnect);
window.addEventListener('beforeunload', handleDisconnect);

// ---------------------------------------------------------------
// Bridge: replace game.js stubs and expose public surface
// ---------------------------------------------------------------
function installBridge() {
  // Override the Firebase availability gate that game.js checks.
  window.VV_FIREBASE = {
    isAvailable: () => true,
    db, ref, set, get, update, onValue, remove,
  };

  // Replace stub multiplayer entry points on window.VV (if game.js loaded already)
  const installOn = (target) => {
    if (!target) return;
    target.createRoom   = createRoom;
    target.showJoinForm = showJoinForm;
    target.joinRoom     = joinRoom;
    target.leaveRoom    = leaveRoom;
    target.pauseSelf    = pauseSelf;
    target.resumeSelf   = resumeSelf;
  };
  if (window.VV) installOn(window.VV);
  // If game.js initialises VV later (it does once the IIFE runs), poll briefly.
  let tries = 0;
  const t = setInterval(() => {
    tries++;
    if (window.VV) { installOn(window.VV); clearInterval(t); }
    if (tries > 50) clearInterval(t);
  }, 80);

  // Public surface for advanced integration / future hooks
  window.VV_MP = {
    generateRoomCode, createRoom, joinRoom, leaveRoom,
    syncState, submitInput, listenForInput, setCurrentTurn,
    pauseSelf, resumeSelf, handleDisconnect,
    paintViewerWaiting,
    get roomCode() { return session.roomCode; },
    get playerId() { return session.playerId; },
    get isHost()   { return session.isHost; },
    get snapshot() { return session.lastRoomSnapshot; },
  };
}

installBridge();
ensurePlayerId();
