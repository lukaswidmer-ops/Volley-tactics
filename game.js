/* ================================================================
   VOLLEY VENDETTA – Online Game
   Pure-JS, no build step. Loaded as <script defer src="game.js">.
   ================================================================ */
(function () {
'use strict';

// ──────────────────────────── i18n ────────────────────────────
const i18n = {
  de: {
    loading: 'Lädt…',
    intro1_h: 'Baue dein Team',
    intro1_p: 'Starte mit 80’000 und drafte fünf Spieler – einen pro Position. Sterne entscheiden die Stärke deines Teams.',
    intro2_h: 'Spiele Turniere',
    intro2_p: 'Sechs Wochen, fünf Turniere und wöchentliche Liga-Spiele. Mehr Sterne, bessere Würfel, mehr Preisgeld.',
    intro3_h: 'Werde Champion',
    intro3_p: 'Erster mit 8 Siegpunkten gewinnt. Liga-Platzierung, Cup-Titel und Champions League bringen dich ans Ziel.',
    intro_skip: 'Überspringen',
    intro_next: 'Weiter ▸',
    intro_start: "Los geht's ▸",
    menu_title_l1: 'Volley',
    menu_title_l2: 'Vendetta',
    menu_sub: 'Online · 3–4 Spieler · 6 Wochen Saison',
    menu_name_label: 'Dein Name',
    menu_name_ph: 'z.B. Lukas',
    menu_solo: 'Solo gegen Bots',
    menu_solo_t: 'Spiele gegen 2 smarte KI-Gegner',
    menu_mp: 'Multiplayer',
    menu_mp_t: 'Mit Freunden via Raum-Code spielen',
    menu_back: 'Zurück',
    mp_create: 'Raum erstellen',
    mp_create_t: 'Erzeuge einen Raum-Code für deine Freunde',
    mp_join: 'Raum beitreten',
    mp_join_t: 'Tritt einem Raum bei',
    mp_join_label: 'Raum-Code (6 Zeichen)',
    mp_join_btn: 'Beitreten ▸',
    mp_unavailable: 'Multiplayer noch nicht aktiviert (Firebase-Config fehlt). Spiele Solo gegen Bots oder warte auf das Update.',
    lobby_h: 'Lobby',
    lobby_code: 'Raum-Code',
    lobby_copy: 'Kopieren',
    lobby_copied: 'Kopiert!',
    lobby_waiting: 'Warte auf weitere Spieler…',
    lobby_start: 'Spiel starten ▸',
    lobby_min: 'Min. 2 Spieler',
    lobby_leave: 'Lobby verlassen',
    lobby_host: 'Host',
    setup_h: 'Team-Aufstellung',
    setup_sub: 'Wähle für jede Position eine Karte. Du beginnst mit %d ’.',
    setup_continue: 'Spiel beginnen ▸',
    setup_skip_pos: 'Position überspringen',
    pos_outside: 'Aussenangreifer',
    pos_middle: 'Mittelblocker',
    pos_setter: 'Setter',
    pos_diagonal: 'Diagonal',
    pos_libero: 'Libero',
    week: 'Woche',
    of: 'von',
    phase_event: 'Event',
    phase_match: 'Liga-Spiel',
    phase_buy: 'Markt',
    phase_done: 'Wochenende',
    week_event_supercup: 'SuperCup',
    week_event_cl: 'Champions League',
    week_event_cup: 'Cup',
    week_event_cupfinal: 'Cup-Final',
    week_event_clfinal: 'CL-Final',
    week_event_league: 'Liga',
    yourturn: 'DU BIST AM ZUG',
    bot_thinking: 'denkt nach',
    serve: 'Aufschlag',
    serve_t: 'Würfle den 12er und beginne den Ballwechsel',
    next_match: 'Nächste Aktion ▸',
    next_week: 'Nächste Woche ▸',
    finish_buying: 'Markt schliessen ▸',
    speed: 'Tempo',
    speed_normal: 'Normal',
    speed_fast: 'Schnell',
    speed_auto: 'Auto',
    market_h: 'Spielermarkt',
    market_budget: 'Budget',
    market_team_strength: 'Team-Stärke',
    market_buy: 'Kaufen',
    market_sold: 'Vergriffen',
    market_suggest: 'Schwächste Position',
    money: 'Geld',
    vp: 'Siegpunkte',
    str: 'Stärke',
    pos: 'Pos',
    you: 'Du',
    homeaway_home: 'Heim',
    homeaway_away: 'Auswärts',
    set: 'Satz',
    sets: 'Sätze',
    serve_keeps: 'Aufschlag bleibt',
    sideout: 'Sideout!',
    rotation: 'Rotation!',
    set_won: 'Satz %s geht an %s: %d–%d 🏆',
    match_won: '%s gewinnt das Match %d:%d!',
    prize: 'Preisgeld',
    log_match: '%s vs %s — %s gewinnt %d:%d',
    end_h_winner: '%s gewinnt!',
    end_play_again: 'Nochmal spielen',
    end_back_menu: 'Hauptmenü',
    end_stats_money: 'Verdient',
    end_stats_won: 'Matches',
    end_stats_str: 'Endstärke',
    bot_buys: '%s hat %s gekauft (%d★, %s’)',
    bot_skips: '%s passt diesen Markt',
    no_card_for_pos: 'Kein Spieler für diese Position',
    leagueWin: 'Liga-Sieg',
    leagueDraw: 'Unentschieden',
    cupWin: 'Cup-Halbfinale gewonnen',
    cupFinalWin: 'Cup-Final gewonnen!',
    cupFinalLose: 'Cup-Final verloren',
    superCupWin: 'SuperCup gewonnen!',
    clWin: 'CL-Vorrunde gewonnen',
    clFinalWin: 'Champions League Sieg!',
    standings_title: 'Liga-Tabelle (Wochen-Ende)',
    coming: 'als Nächstes',
  },
  en: {
    loading: 'Loading…',
    intro1_h: 'Build your team',
    intro1_p: 'Start with 80,000 and draft five players – one per position. Stars decide your team strength.',
    intro2_h: 'Play tournaments',
    intro2_p: 'Six weeks, five tournaments and weekly league matches. More stars, better dice, more prize money.',
    intro3_h: 'Become champion',
    intro3_p: 'First to 8 victory points wins. League placement, cup titles and the Champions League get you there.',
    intro_skip: 'Skip',
    intro_next: 'Next ▸',
    intro_start: "Let's go ▸",
    menu_title_l1: 'Volley',
    menu_title_l2: 'Vendetta',
    menu_sub: 'Online · 3–4 players · 6-week season',
    menu_name_label: 'Your Name',
    menu_name_ph: 'e.g. Alex',
    menu_solo: 'Solo vs Bots',
    menu_solo_t: 'Play against 2 smart AI opponents',
    menu_mp: 'Multiplayer',
    menu_mp_t: 'Play with friends via room code',
    menu_back: 'Back',
    mp_create: 'Create Room',
    mp_create_t: 'Generate a room code for your friends',
    mp_join: 'Join Room',
    mp_join_t: 'Join an existing room',
    mp_join_label: 'Room code (6 characters)',
    mp_join_btn: 'Join ▸',
    mp_unavailable: 'Multiplayer not enabled yet (Firebase config missing). Play solo or wait for the update.',
    lobby_h: 'Lobby',
    lobby_code: 'Room code',
    lobby_copy: 'Copy',
    lobby_copied: 'Copied!',
    lobby_waiting: 'Waiting for more players…',
    lobby_start: 'Start game ▸',
    lobby_min: 'Min. 2 players',
    lobby_leave: 'Leave lobby',
    lobby_host: 'Host',
    setup_h: 'Team Setup',
    setup_sub: 'Pick a card for each position. You start with %d.',
    setup_continue: 'Start match ▸',
    setup_skip_pos: 'Skip position',
    pos_outside: 'Outside Hitter',
    pos_middle: 'Middle Blocker',
    pos_setter: 'Setter',
    pos_diagonal: 'Diagonal',
    pos_libero: 'Libero',
    week: 'Week',
    of: 'of',
    phase_event: 'Event',
    phase_match: 'League Match',
    phase_buy: 'Market',
    phase_done: 'Weekend',
    week_event_supercup: 'Super Cup',
    week_event_cl: 'Champions League',
    week_event_cup: 'Cup',
    week_event_cupfinal: 'Cup Final',
    week_event_clfinal: 'CL Final',
    week_event_league: 'League',
    yourturn: 'YOUR TURN',
    bot_thinking: 'thinking',
    serve: 'Serve',
    serve_t: 'Roll the 12-sided die and start the rally',
    next_match: 'Continue ▸',
    next_week: 'Next week ▸',
    finish_buying: 'Close market ▸',
    speed: 'Speed',
    speed_normal: 'Normal',
    speed_fast: 'Fast',
    speed_auto: 'Auto',
    market_h: 'Player Market',
    market_budget: 'Budget',
    market_team_strength: 'Team strength',
    market_buy: 'Buy',
    market_sold: 'Sold',
    market_suggest: 'Weakest position',
    money: 'Money',
    vp: 'Victory pts',
    str: 'Strength',
    pos: 'Pos',
    you: 'You',
    homeaway_home: 'Home',
    homeaway_away: 'Away',
    set: 'Set',
    sets: 'Sets',
    serve_keeps: 'Serve stays',
    sideout: 'Sideout!',
    rotation: 'Rotation!',
    set_won: 'Set %s goes to %s: %d–%d 🏆',
    match_won: '%s wins the match %d:%d!',
    prize: 'Prize',
    log_match: '%s vs %s — %s wins %d:%d',
    end_h_winner: '%s wins!',
    end_play_again: 'Play again',
    end_back_menu: 'Main menu',
    end_stats_money: 'Earned',
    end_stats_won: 'Matches',
    end_stats_str: 'Final strength',
    bot_buys: '%s bought %s (%d★, %s)',
    bot_skips: '%s skips this market',
    no_card_for_pos: 'No card for this position',
    leagueWin: 'League win',
    leagueDraw: 'Draw',
    cupWin: 'Cup semi-final win',
    cupFinalWin: 'Cup-Final win!',
    cupFinalLose: 'Cup-Final loss',
    superCupWin: 'Super Cup win!',
    clWin: 'CL group-stage win',
    clFinalWin: 'Champions League trophy!',
    standings_title: 'League standings (week end)',
    coming: 'next',
  }
};

// ──────────────────────────── COMMENTARY POOLS ────────────────────────────
const COMMENTARY = {
  de: {
    home_score: [
      'Starker Aufschlag! Der Libero kommt nicht ran — Punkt für %team%! 🏐',
      'Perfektes Zuspiel, explosiver Angriff — %player% schlägt durch den Block! 💥',
      'Ass! Der Aufschlag landet unhaltbar in der Ecke! 🎯',
      '%player% mit einem Monster-Block — Punkt bleibt im Haus! 🧱',
      '%team% setzt den Quick durch die Mitte — kein Halten mehr! ⚡',
      'Pipe-Angriff! %player% knallt den Ball auf den Boden! 🔨',
      'Tooling am Block — Ball geht raus, Punkt %team%! 🎨',
      'Super-Annahme, perfekter Aufbau, harter Angriff — Punkt %team%!',
      'Float-Aufschlag tanzt ins Feld — der Annehmer ist machtlos! 🪁',
      '%player% mit dem Kill diagonal — der Diagonal-Angreifer schlägt zu! 💢',
    ],
    away_score: [
      'Fehler im Aufbau — %team% nutzt die Chance sofort aus! ⚡',
      'Der Angriff geht ins Aus — Seitenball für %team%! 😬',
      'Starke Annahme, schneller Konter — %team% punktet! 🔥',
      'Aufschlagfehler! %team% bekommt den Punkt geschenkt. 😤',
      '%player% verteidigt brillant — %team% nutzt den Konter! 🛡️',
      'Block-Out! Der Block lenkt den Ball nach hinten ab — %team% punktet.',
      'Netzberührung im Angriff — %team% bedankt sich. 🙄',
      '%team% mit einem cleveren Tip in die Lücke — Punkt!',
      'Joust am Netz, der Ball fällt drüben rüber — %team% jubelt!',
      'Doppelkontakt im Aufbau — Punkt geht an %team%. 😳',
    ],
    set_won: [
      '%team% holt den Satz mit einem starken Endspurt!',
      'Was für ein Set-Finale! %team% nimmt den Satz!',
      '%team% beendet den Satz mit einem Aufschlag-Lauf!',
    ],
    match_won: [
      '%team% gewinnt das Match — verdient!',
      '%team% holt sich die drei Sätze — Showtime!',
      'Großer Auftritt von %team% — Match gewonnen!',
    ],
  },
  en: {
    home_score: [
      'Powerful serve! The libero can’t handle it — point for %team%! 🏐',
      'Perfect set, explosive spike — %player% hammers through the block! 💥',
      'Ace! The serve lands untouched in the corner! 🎯',
      '%player% with a monster block — point stays home! 🧱',
      '%team% runs the quick through the middle — unstoppable! ⚡',
      'Pipe attack! %player% pounds it down! 🔨',
      'Tooling the block — ball flies out, point %team%! 🎨',
      'Solid pass, clean set, big attack — point %team%!',
      'Float serve dances into the court — receiver beaten! 🪁',
      '%player% with a cross-court kill from the diagonal! 💢',
    ],
    away_score: [
      'Error in the system — %team% pounces on it! ⚡',
      'The attack goes wide — sideout for %team%! 😬',
      'Great dig, fast counter — %team% scores! 🔥',
      'Service error! %team% gets the point for free. 😤',
      '%player% defends brilliantly — %team% finishes the counter! 🛡️',
      'Block-out! The block deflects long — point %team%.',
      'Net touch in the attack — %team% thanks them. 🙄',
      '%team% with a clever tip into the gap — point!',
      'Joust at the net, ball drops on their side — %team% celebrates!',
      'Double contact on the set — point goes to %team%. 😳',
    ],
    set_won: [
      '%team% takes the set with a strong finish!',
      'What a finale! %team% takes the set!',
      '%team% closes the set on a service run!',
    ],
    match_won: [
      '%team% wins the match — well deserved!',
      '%team% takes three sets — showtime!',
      'Huge performance by %team% — match won!',
    ],
  }
};

// ──────────────────────────── BOT PERSONAS ────────────────────────────
const BOTS = [
  { name: 'Karch',    color: '#0ea5e9', emoji: '🔵', personality: 'aggressive' },
  { name: 'Giba',     color: '#16a34a', emoji: '🟢', personality: 'balanced' },
  { name: 'Zaitsev',  color: '#a855f7', emoji: '🟣', personality: 'defensive' },
  { name: 'Earvin',   color: '#e84317', emoji: '🔴', personality: 'aggressive' },
];

// ──────────────────────────── STATE ────────────────────────────
const state = {
  lang: localStorage.getItem('vv_lang') || 'de',
  soundOn: localStorage.getItem('vv_sound') === '1',
  view: 'splash',
  introIdx: 0,
  playerName: localStorage.getItem('vv_name') || '',
  mode: null, // 'solo' | 'multi'
  speed: localStorage.getItem('vv_speed') || 'normal', // 'normal' | 'fast' | 'auto'
  game: null, // game state
};

// ──────────────────────────── HELPERS ────────────────────────────
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const T = key => (i18n[state.lang] && i18n[state.lang][key]) || key;
const fmt = (str, ...args) => { let i = 0; return str.replace(/%[ds]|%(\d+)/g, () => args[i++]); };
const fmtMoney = n => (n || 0).toLocaleString('de-CH').replace(/,/g, '’');
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const speedMs = ms => (state.speed === 'fast' ? Math.max(50, ms * 0.3) : state.speed === 'auto' ? Math.max(20, ms * 0.1) : ms);
const range = n => Array.from({ length: n }, (_, i) => i);
function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i); return Math.abs(h); }
function cardStars(file) {
  const r = hash(file) % 100;
  if (r < 30) return 1;
  if (r < 58) return 2;
  if (r < 82) return 3;
  if (r < 95) return 4;
  return 5;
}
function cardPrice(stars) { return [0, 5000, 10000, 20000, 35000, 55000][stars] || 5000; }
function uid() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

// Build flat card pool with stable IDs
function buildAllCards() {
  if (typeof CARDS === 'undefined') return [];
  const all = [];
  for (const pos of Object.keys(CARDS)) {
    const def = CARDS[pos];
    for (const f of def.files) {
      const file = f;
      const id = pos + '/' + f;
      const url = (def.folder ? def.folder + '/' : '') + file;
      const stars = cardStars(file);
      const num = (file.match(/(\d+)/) || ['', '00'])[1];
      const name = (def.label_en || pos).replace(/\s+/g, '') + '#' + num;
      all.push({ id, pos, file, url, stars, name, price: cardPrice(stars) });
    }
  }
  return all;
}
let ALL_CARDS = [];

// ──────────────────────────── TOAST / LOG / FLASH ────────────────────────────
function toast(msg, kind = '', ms = 2500) {
  const layer = $('#toast-layer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  layer.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, ms);
}
function flash(kind = 'win') {
  let f = $('#flash');
  if (!f) { f = document.createElement('div'); f.id = 'flash'; f.className = 'flash'; document.body.appendChild(f); }
  f.className = 'flash ' + kind;
  requestAnimationFrame(() => { f.classList.add('show'); setTimeout(() => f.classList.remove('show'), 700); });
}

function logEntry(text, kind = '') {
  const log = $('#log');
  if (!log) return;
  const e = document.createElement('div');
  e.className = 'log-entry' + (kind ? ' ' + kind : '');
  e.innerHTML = `<span class="ts">${new Date().toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}</span>${text}`;
  log.appendChild(e);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 60) log.removeChild(log.firstChild);
}

// ──────────────────────────── SOUND (lightweight beeps) ────────────────────────────
let audioCtx = null;
function beep(freq = 440, dur = 80, type = 'square', vol = 0.06) {
  if (!state.soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur / 1000);
  } catch (e) { /* ignore */ }
}

// ──────────────────────────── VIEW SWITCHING ────────────────────────────
function setView(v) {
  state.view = v;
  document.getElementById('app').dataset.view = v;
  render();
  window.scrollTo(0, 0);
}
function setLang(l) {
  state.lang = l;
  localStorage.setItem('vv_lang', l);
  document.documentElement.lang = l;
  render();
}

// ──────────────────────────── INTRO ────────────────────────────
function renderIntro() {
  const app = $('#app');
  const slides = [
    { icon: '🏗️', h: T('intro1_h'), p: T('intro1_p') },
    { icon: '🏆', h: T('intro2_h'), p: T('intro2_p') },
    { icon: '🎯', h: T('intro3_h'), p: T('intro3_p') },
  ];
  const idx = state.introIdx;
  app.innerHTML = `
    <div class="intro">
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
      <div class="intro-slides">
        ${slides.map((s,i) => `
          <div class="intro-slide ${i===idx?'active':''}">
            <div class="intro-icon">${s.icon}</div>
            <div class="intro-h ${i===1?'accent':''}">${s.h}</div>
            <div class="intro-p">${s.p}</div>
          </div>`).join('')}
      </div>
      <div class="intro-dots">
        ${slides.map((_,i)=>`<span class="intro-dot ${i===idx?'active':''}"></span>`).join('')}
      </div>
      <div class="intro-actions">
        <button class="btn btn-secondary" onclick="VV.skipIntro()">${T('intro_skip')}</button>
        <button class="btn btn-primary" onclick="VV.advanceIntro()">${idx===slides.length-1?T('intro_start'):T('intro_next')}</button>
      </div>
    </div>`;
}
function advanceIntro() {
  if (state.introIdx >= 2) { localStorage.setItem('vv_seenIntro','1'); setView('menu'); return; }
  state.introIdx += 1;
  renderIntro();
}
function skipIntro() { localStorage.setItem('vv_seenIntro','1'); setView('menu'); }

// ──────────────────────────── MENU ────────────────────────────
function renderMenu() {
  const app = $('#app');
  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.4rem;">
          <div class="menu-title"><span>${T('menu_title_l1')}</span> <span class="accent">${T('menu_title_l2')}</span></div>
          <div style="display:flex; gap:0.4rem;">
            <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
            <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
          </div>
        </div>
        <div class="menu-sub">${T('menu_sub')}</div>
        <div class="menu-row">
          <label class="label">${T('menu_name_label')}</label>
          <input class="input" id="player-name" placeholder="${T('menu_name_ph')}" value="${escapeHTML(state.playerName)}" maxlength="20" />
        </div>
        <div class="menu-actions">
          <button class="btn btn-primary btn-large" data-tip="${T('menu_solo_t')}" onclick="VV.startSolo()">${T('menu_solo')} ▸</button>
          <button class="btn btn-secondary btn-large" data-tip="${T('menu_mp_t')}" onclick="VV.openMultiplayer()">${T('menu_mp')} ▸</button>
        </div>
      </div>
    </div>`;
}

function startSolo() {
  const name = ($('#player-name')||{}).value || state.playerName || (state.lang==='de'?'Spieler':'Player');
  state.playerName = name.trim().slice(0,20) || (state.lang==='de'?'Spieler':'Player');
  localStorage.setItem('vv_name', state.playerName);
  state.mode = 'solo';
  initSoloGame();
  setView('setup');
}

function openMultiplayer() {
  const name = ($('#player-name')||{}).value || state.playerName || '';
  state.playerName = name.trim().slice(0,20);
  localStorage.setItem('vv_name', state.playerName);
  if (!state.playerName) { toast(state.lang==='de'?'Bitte zuerst einen Namen eingeben.':'Please enter a name first.', 'bad'); return; }
  setView('mp_submenu');
}

function renderMpSubmenu() {
  const app = $('#app');
  const mpAvail = isMultiplayerAvailable();
  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card">
        <button class="menu-back" onclick="VV.setView('menu')">‹ ${T('menu_back')}</button>
        <div class="menu-title"><span class="accent">${T('menu_mp')}</span></div>
        <div class="menu-sub">${state.playerName}</div>
        ${!mpAvail ? `<div class="toast bad" style="margin-bottom:1rem; pointer-events:auto;">${T('mp_unavailable')}</div>` : ''}
        <div class="menu-actions">
          <button class="btn btn-primary btn-large" ${!mpAvail?'disabled':''} data-tip="${T('mp_create_t')}" onclick="VV.createRoom()">${T('mp_create')} ▸</button>
          <button class="btn btn-secondary btn-large" ${!mpAvail?'disabled':''} data-tip="${T('mp_join_t')}" onclick="VV.showJoinForm()">${T('mp_join')} ▸</button>
        </div>
      </div>
    </div>`;
}

function isMultiplayerAvailable() {
  // Multiplayer is available when Firebase is configured (real config injected separately)
  return typeof window.FIREBASE_CONFIG !== 'undefined' && window.FIREBASE_CONFIG.apiKey && !window.FIREBASE_CONFIG.apiKey.startsWith('YOUR_');
}

function createRoom() { toast(T('mp_unavailable'), 'bad', 4000); }
function showJoinForm() { toast(T('mp_unavailable'), 'bad', 4000); }

// ──────────────────────────── SOLO GAME INIT ────────────────────────────
function makePlayer(name, color, emoji, isHuman, personality) {
  return {
    id: uid(),
    name, color, emoji, isHuman: !!isHuman, personality: personality || 'balanced',
    money: 80000, vp: 0,
    team: { outside: null, middle: null, setter: null, diagonal: null, libero: null },
    bench: [],
    matchesWon: 0, totalEarned: 0,
  };
}
function teamStrength(p) {
  const t = p.team;
  return (t.outside?.stars||0) + (t.middle?.stars||0) + (t.setter?.stars||0) + (t.diagonal?.stars||0) + (t.libero?.stars||0);
}
function teamFront(p) { return (p.team.outside?.stars||0) + (p.team.middle?.stars||0) + (p.team.setter?.stars||0); }
function teamBack(p)  { return (p.team.libero?.stars||0) + (p.team.diagonal?.stars||0) + ((p.team.outside?.stars||0)/2); }
function teamBlock(p) { return (p.team.outside?.stars||0) + (p.team.middle?.stars||0); }

function initSoloGame() {
  ALL_CARDS = buildAllCards();
  const human = makePlayer(state.playerName, '#f59e0b', '🟡', true, 'balanced');
  const botPool = BOTS.slice().sort(()=>Math.random()-0.5);
  const bot1 = makePlayer('Bot ' + botPool[0].name, botPool[0].color, botPool[0].emoji, false, botPool[0].personality);
  const bot2 = makePlayer('Bot ' + botPool[1].name, botPool[1].color, botPool[1].emoji, false, botPool[1].personality);
  state.game = {
    players: [human, bot1, bot2],
    activeIdx: 0,
    week: 0,
    phase: 'setup',
    log: [],
    market: regenMarket(),
    leaguePoints: { [human.id]: 0, [bot1.id]: 0, [bot2.id]: 0 },
    matchesPlayed: 0,
    weekResults: [],
    over: false,
    winner: null,
  };
  // Bots auto-pick their setup teams
  for (const bot of [bot1, bot2]) autoDraftBot(bot);
}

function autoDraftBot(bot) {
  for (const pos of ['outside','middle','setter','diagonal','libero']) {
    const opts = ALL_CARDS.filter(c => c.pos === pos && c.stars <= 2);
    const pick = choice(opts);
    bot.team[pos] = pick;
    bot.money -= pick.price;
  }
}

function regenMarket() {
  // 12 cards, mix of positions and stars
  const out = [];
  const used = new Set();
  while (out.length < 12) {
    const c = choice(ALL_CARDS);
    if (used.has(c.id)) continue;
    used.add(c.id);
    out.push(c);
  }
  return out;
}

// ──────────────────────────── SETUP VIEW ────────────────────────────
function renderSetup() {
  const app = $('#app');
  const me = state.game.players[0];
  const positions = ['outside','middle','setter','diagonal','libero'];
  const remaining = positions.filter(p => !me.team[p]);
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('phase_buy')}</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    <div style="padding:1.5rem; max-width:1000px; margin:0 auto;">
      <h2 class="h-cond" style="font-size:2rem; margin-bottom:0.4rem;">${T('setup_h')}</h2>
      <div style="color:var(--silver); margin-bottom:1.4rem;">${fmt(T('setup_sub'), fmtMoney(me.money))}</div>
      <div class="team">
        <div class="team-h">
          <span>${T('your')||state.playerName} · ${fmtMoney(me.money)}</span>
          <span class="team-strength">★ ${teamStrength(me)}</span>
        </div>
        <div class="team-grid">
          ${positions.map(p => slotHtml(me.team[p], p)).join('')}
        </div>
      </div>
      ${remaining.length === 0 ? `
        <div style="text-align:center; margin-top:1.6rem;">
          <button class="btn btn-primary btn-large" onclick="VV.beginSeason()">${T('setup_continue')}</button>
        </div>
      ` : `
        <h3 class="h-cond" style="font-size:1.2rem; margin:1.4rem 0 0.4rem;">${T('pos_'+remaining[0])}</h3>
        <div class="market" id="setup-market">
          ${ALL_CARDS.filter(c=>c.pos===remaining[0]).slice(0,18).map(c => marketCardHtml(c, me)).join('')}
        </div>
      `}
    </div>`;
}

function slotHtml(card, pos) {
  if (!card) return `<div class="slot empty" data-tip="${T('pos_'+pos)}"><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
  return `<div class="slot" data-tip="${card.name} · ${card.stars}★">
    <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
    <img src="${card.url}" alt="">
    <div class="stars">${'★'.repeat(card.stars)}</div>
  </div>`;
}
function posColor(pos) { return ({outside:'var(--c-out)',middle:'var(--c-mid)',setter:'var(--c-set)',diagonal:'var(--c-dia)',libero:'var(--c-lib)'})[pos]; }
function posShort(pos) { return ({outside:'OH',middle:'MB',setter:'S',diagonal:'OPP',libero:'L'})[pos]; }

function marketCardHtml(c, player, opts) {
  const canAfford = player.money >= c.price;
  const suggested = opts && opts.suggestedPos === c.pos;
  return `<div class="mc ${canAfford?'':'poor'} ${suggested?'suggested':''}" data-tip="${c.name}">
    <img class="mc-img" src="${c.url}" alt="">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="mc-pos" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <span class="mc-stars">${'★'.repeat(c.stars)}</span>
    </div>
    <div class="mc-price">${fmtMoney(c.price)}</div>
    <button class="mc-buy" onclick="VV.buyCard('${c.id}')" ${canAfford?'':'disabled'}>${canAfford?T('market_buy'):T('market_sold')}</button>
  </div>`;
}

function buyCard(id) {
  const c = ALL_CARDS.find(x => x.id === id);
  const me = state.game.players[0];
  if (!c) return;
  if (me.money < c.price) { toast(state.lang==='de'?'Zu teuer':'Too expensive', 'bad'); return; }
  // setup phase: must place into the FIRST empty slot of that position
  if (state.view === 'setup') {
    if (me.team[c.pos]) { toast(state.lang==='de'?'Position bereits gefüllt':'Position already filled', 'bad'); return; }
    me.team[c.pos] = c;
    me.money -= c.price;
    beep(880, 60);
    renderSetup();
    return;
  }
  // market phase during the game (replace if better)
  const cur = me.team[c.pos];
  me.team[c.pos] = c;
  if (cur) me.bench.push(cur);
  me.money -= c.price;
  toast(state.lang==='de' ? `Gekauft: ${c.name}` : `Bought: ${c.name}`, 'good');
  beep(880, 60);
  renderMarket();
}

function beginSeason() {
  state.game.week = 1;
  state.game.phase = 'event';
  setView('game');
  setTimeout(() => runWeek(), 400);
}

// ──────────────────────────── GAME RENDER ────────────────────────────
function renderGame() {
  const app = $('#app');
  const g = state.game;
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('week')} ${g.week} ${T('of')} 6</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    <div class="game">
      <div class="topbar" id="topbar">${g.players.map((p,i)=>playerCardHtml(p,i)).join('')}</div>
      <div class="weeks" id="weeks">${range(6).map(i=>weekCellHtml(i+1, g)).join('')}</div>
      <div class="phase-bar" id="phase-bar"></div>
      <div class="gmain">
        <div class="gleft">
          <div class="stage" id="stage"></div>
          <div class="log" id="log"></div>
        </div>
        <div class="gright">
          <div class="team" id="team-panel">${teamPanelHtml(g.players[0])}</div>
          <div class="actions" id="actions"></div>
        </div>
      </div>
    </div>`;
  // restore log entries
  for (const e of state.game.log) logEntry(e.text, e.kind);
}

function playerCardHtml(p, idx) {
  const g = state.game;
  const isYou = p.isHuman;
  const isActive = idx === g.activeIdx;
  return `<div class="player-card ${isActive?'active':''} ${isYou?'you':''}" style="border-left-color:${p.color};">
    <div class="pc-name"><span class="pc-emoji">${p.emoji}</span>${escapeHTML(p.name)}</div>
    <div class="pc-stats">
      <div>${T('money')}</div><b>${fmtMoney(p.money)}</b>
      <div>${T('vp')}</div><b>${p.vp}/8</b>
      <div>${T('str')}</div><b>★ ${teamStrength(p)}</b>
      <div>L-Pts</div><b>${g.leaguePoints[p.id]||0}</b>
    </div>
    <div class="pc-vp">
      ${range(8).map(i=>`<span class="${i<p.vp?'fill':''}"></span>`).join('')}
    </div>
  </div>`;
}

function weekCellHtml(n, g) {
  const ev = weekEvent(n);
  const cls = n < g.week ? 'done' : n === g.week ? 'active' : '';
  return `<div class="week ${cls}">
    <div class="week-no">W${n}</div>
    <div class="week-ev">${ev.short[state.lang]}</div>
  </div>`;
}

function weekEvent(n) {
  // Week → event mapping per spec
  return [
    null,
    { type: 'supercup',  short: { de:'SuperCup', en:'SuperCup' }, prize: 15000 },
    { type: 'cl',        short: { de:'CL',       en:'CL'       }, prize: 20000 },
    { type: 'cup',       short: { de:'Cup',      en:'Cup'      }, prize: 20000 },
    { type: 'cl',        short: { de:'CL',       en:'CL'       }, prize: 20000 },
    { type: 'cupfinal',  short: { de:'Cup-Final',en:'Cup-Final'}, prize: 20000 },
    { type: 'clfinal',   short: { de:'CL-Final', en:'CL-Final' }, prize: 35000 },
  ][n] || null;
}

function teamPanelHtml(p) {
  return `
    <div class="team-h">
      <span>${T('your')||escapeHTML(p.name)} · ${fmtMoney(p.money)}</span>
      <span class="team-strength">★ ${teamStrength(p)}</span>
    </div>
    <div class="team-grid">
      ${['outside','middle','setter','diagonal','libero'].map(pos => slotHtml(p.team[pos], pos)).join('')}
    </div>`;
}

function refreshTopbar() {
  const tb = $('#topbar'); if (!tb) return;
  tb.innerHTML = state.game.players.map((p,i)=>playerCardHtml(p,i)).join('');
}
function refreshTeamPanel() {
  const tp = $('#team-panel'); if (!tp) return;
  tp.innerHTML = teamPanelHtml(state.game.players[0]);
}
function refreshWeeks() {
  const w = $('#weeks'); if (!w) return;
  w.innerHTML = range(6).map(i=>weekCellHtml(i+1, state.game)).join('');
}
function setPhase(active) {
  const phases = [
    { id:'event',  label:T('phase_event'),  icon:'🏆' },
    { id:'match',  label:T('phase_match'),  icon:'🏐' },
    { id:'buy',    label:T('phase_buy'),    icon:'🛒' },
    { id:'done',   label:T('phase_done'),   icon:'✅' },
  ];
  const bar = $('#phase-bar'); if (!bar) return;
  bar.innerHTML = phases.map(p => {
    const cls = p.id === active ? 'active' : (phaseDone(p.id, active) ? 'done' : '');
    return `<span class="phase ${cls}">${p.icon} ${p.label}</span>`;
  }).join('') + `<span class="gh-spacer" style="flex:1"></span><span class="phase">${T('week')} ${state.game.week}/6</span>`;
}
function phaseDone(id, active) {
  const order = ['event','match','buy','done'];
  return order.indexOf(id) < order.indexOf(active);
}

// ──────────────────────────── RUN A WEEK ────────────────────────────
async function runWeek() {
  const g = state.game;
  if (g.over) return;
  refreshTopbar(); refreshTeamPanel(); refreshWeeks();
  // 1) Tournament event for this week (if any)
  setPhase('event');
  const ev = weekEvent(g.week);
  if (ev) await runTournament(ev);
  if (g.over) return;
  // 2) League match (always)
  setPhase('match');
  await runLeagueMatch();
  if (g.over) return;
  // 3) Market / buy phase
  setPhase('buy');
  await runMarketPhase();
  if (g.over) return;
  // Award season-end bonus on final week
  if (g.week >= 6) {
    setPhase('done');
    awardSeasonStandings();
    return endGame();
  }
  g.week += 1;
  refreshWeeks();
  setTimeout(runWeek, speedMs(800));
}

// ──────────────────────────── TOURNAMENT (simplified) ────────────────────────────
async function runTournament(ev) {
  const g = state.game;
  const stage = $('#stage'); const actions = $('#actions');
  const titleMap = { supercup:T('week_event_supercup'), cl:T('week_event_cl'), cup:T('week_event_cup'), cupfinal:T('week_event_cupfinal'), clfinal:T('week_event_clfinal') };
  stage.innerHTML = `
    <div class="stage-h">${titleMap[ev.type]}</div>
    <div class="stage-sub">${state.lang==='de'?'Turnier in Woche':'Tournament in week'} ${g.week}</div>
    <div id="tournament-body" style="margin-top:1rem;"></div>`;
  const body = $('#tournament-body');

  // Determine participants — pick top 2 by team strength as a simplification
  const sorted = g.players.slice().sort((a,b) => teamStrength(b) - teamStrength(a));
  const home = sorted[0]; const away = sorted[1];
  body.innerHTML = `
    <div class="match-screen">
      <div class="match-team home">
        <h4>${escapeHTML(home.name)}</h4>
        <div class="strength">★ ${teamStrength(home)}</div>
        <div class="flag">${T('homeaway_home')}</div>
      </div>
      <div class="match-vs">VS</div>
      <div class="match-team away">
        <h4>${escapeHTML(away.name)}</h4>
        <div class="strength">★ ${teamStrength(away)}</div>
        <div class="flag">${T('homeaway_away')}</div>
      </div>
    </div>`;
  actions.innerHTML = `<h3>${state.lang==='de'?'Turnier':'Tournament'}</h3>
    ${speedToggleHtml()}
    <button class="action-btn pulse" onclick="VV.continueTournament()">${T('next_match')}</button>`;
  // Auto-resolve on speed=auto
  if (state.speed === 'auto') setTimeout(() => continueTournament(), speedMs(400));
  await waitFor('continueTournament');
  // Resolve via single dice + strength
  const homeStr = teamStrength(home), awayStr = teamStrength(away);
  const homeRoll = 1 + Math.floor(Math.random()*12), awayRoll = 1 + Math.floor(Math.random()*12);
  const homeScore = homeStr + homeRoll, awayScore = awayStr + awayRoll;
  const winner = homeScore >= awayScore ? home : away;
  const loser  = winner === home ? away : home;
  // Award
  if (ev.type === 'supercup') {
    winner.money += ev.prize; winner.totalEarned += ev.prize;
    logEntry(`${T('superCupWin')} — ${escapeHTML(winner.name)} +${fmtMoney(ev.prize)}`, 'tournament');
  } else if (ev.type === 'cup') {
    winner.money += ev.prize; winner.totalEarned += ev.prize;
    logEntry(`${T('cupWin')} — ${escapeHTML(winner.name)} +${fmtMoney(ev.prize)}`, 'tournament');
  } else if (ev.type === 'cupfinal') {
    winner.money += ev.prize; winner.totalEarned += ev.prize; winner.vp += 2; loser.vp += 1;
    logEntry(`${T('cupFinalWin')} — ${escapeHTML(winner.name)} +2 VP, +${fmtMoney(ev.prize)}`, 'tournament');
    logEntry(`${T('cupFinalLose')} — ${escapeHTML(loser.name)} +1 VP`, 'tournament');
  } else if (ev.type === 'cl') {
    winner.money += ev.prize; winner.totalEarned += ev.prize;
    logEntry(`${T('clWin')} — ${escapeHTML(winner.name)} +${fmtMoney(ev.prize)}`, 'tournament');
  } else if (ev.type === 'clfinal') {
    winner.money += ev.prize; winner.totalEarned += ev.prize; winner.vp += 3;
    logEntry(`${T('clFinalWin')} — ${escapeHTML(winner.name)} +3 VP, +${fmtMoney(ev.prize)}`, 'tournament');
  }
  refreshTopbar();
  if (checkWin()) return;
  // brief pause
  await sleep(speedMs(500));
}

// ──────────────────────────── LEAGUE MATCH (set-based) ────────────────────────────
async function runLeagueMatch() {
  const g = state.game;
  // Pair the human (home) vs strongest bot (away) for clarity
  const me = g.players[0];
  const opps = g.players.filter(p => p !== me).sort((a,b)=>teamStrength(b)-teamStrength(a));
  const home = me; const away = opps[0];
  const stage = $('#stage');
  const actions = $('#actions');
  // Match state
  const M = {
    home, away,
    setsHome: 0, setsAway: 0,
    setLog: [], // history of completed sets {h, a, winner}
    rallies: [],
    serving: 'home', // 'home' | 'away'
    rotationHome: 0, rotationAway: 0,
    setH: 0, setA: 0,
    setNo: 1, ended: false,
  };

  function rallyTarget() { return M.setNo === 5 ? 15 : 25; }

  function renderMatch() {
    stage.innerHTML = `
      <div class="stage-h">${T('phase_match')} · ${T('week')} ${g.week}</div>
      <div class="stage-sub">${escapeHTML(home.name)} <b>${M.setsHome}</b> : <b>${M.setsAway}</b> ${escapeHTML(away.name)} · ${T('set')} ${M.setNo}</div>
      <div class="match-screen" style="margin-top:1rem;">
        <div class="match-team home">
          <div class="flag">${T('homeaway_home')}</div>
          <h4>${escapeHTML(home.name)} ${M.serving==='home'?'<span style="color:var(--gold)">🏐</span>':''}</h4>
          <div class="strength">${M.setH}</div>
          <div style="font-size:0.7rem; color:var(--silver); margin-top:0.4rem;">★ ${teamStrength(home)}</div>
        </div>
        <div class="match-vs">VS</div>
        <div class="match-team away">
          <div class="flag">${T('homeaway_away')}</div>
          <h4>${escapeHTML(away.name)} ${M.serving==='away'?'<span style="color:var(--gold)">🏐</span>':''}</h4>
          <div class="strength">${M.setA}</div>
          <div style="font-size:0.7rem; color:var(--silver); margin-top:0.4rem;">★ ${teamStrength(away)}</div>
        </div>
      </div>
      <div class="dice-area">
        <div class="dice-num" id="dice-num">—</div>
      </div>
      <div id="rally-feed" style="display:flex; flex-direction:column; gap:0.4rem; max-height:160px; overflow-y:auto;"></div>`;
    // Repaint last 5 rally entries
    const feed = $('#rally-feed');
    M.rallies.slice(-5).forEach(r => {
      const d = document.createElement('div');
      d.className = 'crit show ' + (r.winner === 'home' ? 'win' : 'loss');
      d.innerHTML = `<div class="crit-h">${r.dice}</div><div class="crit-r">${r.text}</div>`;
      feed.appendChild(d);
    });
    feed.scrollTop = feed.scrollHeight;
    actions.innerHTML = `<h3>${T('phase_match')}</h3>
      ${speedToggleHtml()}
      <button id="serve-btn" class="action-btn pulse" data-tip="${T('serve_t')}" onclick="VV.serveOnce()">🏐 ${T('serve')}</button>`;
  }

  state.game._match = M;
  renderMatch();

  // Auto-loop
  while (!M.ended) {
    await waitFor(state.speed === 'auto' ? null : 'serveOnce', speedMs(state.speed === 'auto' ? 220 : 0));
    if (M.ended) break;
    await rally();
    refreshTopbar(); refreshTeamPanel();
  }

  // Match end summary
  await sleep(speedMs(400));
  await showMatchEnd(M);

  // Award league points
  awardLeagueMatch(home, away, M.setsHome > M.setsAway ? home : away);
  refreshTopbar();
  if (checkWin()) return;

  async function rally() {
    const dice = 1 + Math.floor(Math.random()*12);
    await rollDiceVisual(dice);
    const result = resolveCriterion(dice, home, away, M.serving);
    M.serving = result.winner === 'home' ? 'home' : 'away';
    if (result.winner === 'home') M.setH++;
    else M.setA++;
    const lang = state.lang;
    const text = (result.winner === 'home'
      ? choice(COMMENTARY[lang].home_score)
      : choice(COMMENTARY[lang].away_score)
    ).replace('%team%', escapeHTML(result.winner==='home'?home.name:away.name))
     .replace('%player%', randomPlayerName(result.winner==='home'?home:away));
    M.rallies.push({ dice, winner: result.winner, text });
    beep(result.winner === 'home' ? 740 : 480, 60);
    // Check set end
    if (setReached(M.setH, M.setA, rallyTarget())) {
      const setWinner = M.setH > M.setA ? 'home' : 'away';
      const wname = setWinner === 'home' ? home.name : away.name;
      const setNum = M.setNo;
      const sH = M.setH, sA = M.setA;
      M.setLog.push({ h: sH, a: sA, winner: setWinner });
      if (setWinner === 'home') M.setsHome++; else M.setsAway++;
      logEntry(fmt(T('set_won'), setNum, escapeHTML(wname), sH, sA), setWinner === 'home' ? 'win' : 'loss');
      flash(setWinner === 'home' ? 'win' : 'loss');
      M.setH = 0; M.setA = 0; M.setNo += 1;
      // Match end?
      if (M.setsHome === 3 || M.setsAway === 3) {
        M.ended = true;
        return;
      }
      await sleep(speedMs(900));
    }
    renderMatch();
  }
}

function setReached(h, a, target) {
  return (h >= target && h - a >= 2) || (a >= target && a - h >= 2);
}

function resolveCriterion(dice, home, away, serving) {
  // Map dice 1-12 to abstract criterion outcome
  const homeStr = teamStrength(home), awayStr = teamStrength(away);
  const homeFront = teamFront(home), awayFront = teamFront(away);
  const homeBack = teamBack(home), awayBack = teamBack(away);
  const homeBlock = teamBlock(home), awayBlock = teamBlock(away);
  let winner;
  switch (dice) {
    case 1: winner = homeStr >= awayStr ? 'home' : 'away'; break;
    case 2: winner = homeFront >= awayFront ? 'home' : 'away'; break;
    case 3: winner = homeBack >= awayBack ? 'home' : 'away'; break;
    case 4: { const r1=1+Math.floor(Math.random()*12), r2=1+Math.floor(Math.random()*12); winner = r1>=r2?'home':'away'; break; }
    case 5: winner = (home.team.middle?.stars||0) >= (away.team.middle?.stars||0) ? 'home' : 'away'; break;
    case 6: winner = serving === 'home' ? 'home' : 'away'; break; // Service advantage to server
    case 7: winner = ((home.team.diagonal?.stars||0)+(home.team.setter?.stars||0)) >= ((away.team.diagonal?.stars||0)+(away.team.setter?.stars||0)) ? 'home' : 'away'; break;
    case 8: winner = (home.team.outside?.stars||0) >= (away.team.diagonal?.stars||0) ? 'home' : 'away'; break;
    case 9: { // Block-Überwurf — away rolls vs home block
      const r = 1 + Math.floor(Math.random()*12);
      winner = r > homeBlock ? 'away' : (r < homeBlock ? 'home' : (Math.random()<0.5?'home':'away'));
      break;
    }
    case 10: winner = serving; break; // Crunchtime: server gets the rally
    case 11: { const r = 1 + Math.floor(Math.random()*12); winner = r <= 6 ? 'away' : 'home'; break; }
    case 12: winner = Math.random()<0.5 ? 'home' : 'away'; break; // Geld-Regen: coin flip
    default: winner = serving;
  }
  return { winner };
}

function randomPlayerName(p) {
  // Pick the highest-star card for narrative weight
  const cards = ['outside','middle','setter','diagonal','libero'].map(k=>p.team[k]).filter(Boolean);
  const top = cards.sort((a,b)=>b.stars-a.stars)[0];
  return top ? top.name.replace('#','') : escapeHTML(p.name);
}

async function showMatchEnd(M) {
  const home = M.home, away = M.away;
  const winner = M.setsHome > M.setsAway ? home : away;
  const sets = M.setLog.map(s => `${s.h}:${s.a}`).join(', ');
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="stage-h">${fmt(T('match_won'), escapeHTML(winner.name), Math.max(M.setsHome,M.setsAway), Math.min(M.setsHome,M.setsAway))}</div>
    <div class="stage-sub">${escapeHTML(home.name)} ${M.setsHome}:${M.setsAway} ${escapeHTML(away.name)} — ${sets}</div>
    <div style="display:flex; justify-content:center; margin-top:1rem;">
      <button class="btn btn-primary btn-large pulse" onclick="VV.continueAfterMatch()">${T('next_match')}</button>
    </div>`;
  flash(winner === home ? 'win' : 'loss');
  await waitFor('continueAfterMatch', speedMs(state.speed==='auto'?500:0));
}

function awardLeagueMatch(home, away, winner) {
  const g = state.game;
  if (winner === home) {
    home.money += 10000; home.totalEarned += 10000;
    home.matchesWon += 1;
    if (away.money >= 5000) { away.money -= 5000; }
    else away.money = 0;
    home.money += 5000;
    g.leaguePoints[home.id] = (g.leaguePoints[home.id]||0) + 3;
    logEntry(`${T('leagueWin')}: ${escapeHTML(home.name)} +10’ (Bank) +5’ (${escapeHTML(away.name)})`, 'win');
  } else {
    away.money += 10000; away.totalEarned += 10000;
    away.matchesWon += 1;
    if (home.money >= 5000) { home.money -= 5000; } else home.money = 0;
    away.money += 5000;
    g.leaguePoints[away.id] = (g.leaguePoints[away.id]||0) + 3;
    logEntry(`${T('leagueWin')}: ${escapeHTML(away.name)} +10’ (Bank) +5’ (${escapeHTML(home.name)})`, 'loss');
  }
}

// ──────────────────────────── MARKET PHASE ────────────────────────────
async function runMarketPhase() {
  state.game.market = regenMarket();
  renderMarket();
  // Bots act first, then human
  for (const bot of state.game.players.filter(p => !p.isHuman)) {
    await sleep(speedMs(500));
    botMarketTurn(bot);
    refreshTopbar();
  }
  await waitFor('endMarket', speedMs(state.speed === 'auto' ? 600 : 0));
}

function renderMarket() {
  const stage = $('#stage'); const actions = $('#actions');
  const me = state.game.players[0];
  const weakPos = weakestPosition(me);
  stage.innerHTML = `
    <div class="stage-h">${T('market_h')}</div>
    <div class="stage-sub">${T('market_budget')}: <b>${fmtMoney(me.money)}</b> · ${T('market_team_strength')}: <b>★ ${teamStrength(me)}</b> · ${T('market_suggest')}: <b style="color:var(--gold)">${T('pos_'+weakPos)}</b></div>
    <div class="market" id="market-grid">${state.game.market.map(c => marketCardHtml(c, me, { suggestedPos: weakPos })).join('')}</div>`;
  actions.innerHTML = `<h3>${T('phase_buy')}</h3>
    ${speedToggleHtml()}
    <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>`;
}

function weakestPosition(p) {
  const order = ['outside','middle','setter','diagonal','libero'];
  let min = order[0], minStars = Infinity;
  for (const k of order) {
    const s = p.team[k]?.stars || 0;
    if (s < minStars) { minStars = s; min = k; }
  }
  return min;
}

function botMarketTurn(bot) {
  // Bot tries to upgrade weakest position
  const weak = weakestPosition(bot);
  const opts = state.game.market.filter(c => c.pos === weak && c.price <= bot.money && c.stars > (bot.team[weak]?.stars||0));
  opts.sort((a,b)=>b.stars-a.stars);
  if (opts.length && Math.random() < 0.85) {
    const c = opts[0];
    const cur = bot.team[c.pos];
    bot.team[c.pos] = c;
    if (cur) bot.bench.push(cur);
    bot.money -= c.price;
    state.game.market = state.game.market.filter(x => x.id !== c.id);
    logEntry(fmt(T('bot_buys'), `${bot.emoji} ${escapeHTML(bot.name)}`, T('pos_'+c.pos), c.stars, fmtMoney(c.price)), 'tournament');
    if ($('#market-grid')) renderMarket();
  } else {
    logEntry(fmt(T('bot_skips'), `${bot.emoji} ${escapeHTML(bot.name)}`));
  }
}

// ──────────────────────────── SEASON-END / GAME-END ────────────────────────────
function awardSeasonStandings() {
  const g = state.game;
  const ranked = g.players.slice().sort((a,b) => (g.leaguePoints[b.id]||0) - (g.leaguePoints[a.id]||0));
  const pts = [3, 2, 1, 0];
  ranked.forEach((p, i) => { p.vp += pts[i] || 0; });
  ranked.forEach((p, i) => {
    const bonus = [0,20000,30000,50000][i] || 0;
    p.money += bonus;
    if (bonus) logEntry(`${escapeHTML(p.name)} → +${pts[i]||0} VP, +${fmtMoney(bonus)} (${i+1}.)`, 'tournament');
    else logEntry(`${escapeHTML(p.name)} → +${pts[i]||0} VP (${i+1}.)`, 'tournament');
  });
}

function checkWin() {
  const g = state.game;
  const w = g.players.find(p => p.vp >= 8);
  if (w) { g.over = true; g.winner = w; setTimeout(endGame, speedMs(400)); return true; }
  return false;
}

function endGame() {
  const g = state.game;
  if (!g.winner) {
    // Highest VP wins on time-out
    g.winner = g.players.slice().sort((a,b)=>b.vp-a.vp)[0];
  }
  setView('end');
}

function renderEnd() {
  const app = $('#app');
  const g = state.game;
  const ranked = g.players.slice().sort((a,b)=>b.vp-a.vp);
  const winner = g.winner;
  app.innerHTML = `
    <div class="end-wrap">
      <div class="end-h">${fmt(T('end_h_winner'), `<span class="winner">${escapeHTML(winner.name)}</span>`)}</div>
      <div style="color:var(--silver); letter-spacing:3px; text-transform:uppercase; font-size:0.8rem;">${winner.vp}/8 ${T('vp')}</div>
      <div class="end-board">
        ${ranked.map((p,i)=>`
          <div class="end-row ${i===0?'first':''}">
            <span class="rank">${i+1}.</span>
            <span style="font-size:1.4rem;">${p.emoji}</span>
            <b>${escapeHTML(p.name)}</b>
            <span class="stats">
              <span class="stat">${T('vp')}: <b>${p.vp}</b></span>
              <span class="stat">${T('end_stats_won')}: <b>${p.matchesWon}</b></span>
              <span class="stat">${T('end_stats_money')}: <b>${fmtMoney(p.totalEarned)}</b></span>
              <span class="stat">${T('end_stats_str')}: <b>★ ${teamStrength(p)}</b></span>
            </span>
          </div>`).join('')}
      </div>
      <div class="end-actions">
        <button class="btn btn-primary btn-large" onclick="VV.playAgain()">${T('end_play_again')}</button>
        <button class="btn btn-secondary btn-large" onclick="VV.toMenu()">${T('end_back_menu')}</button>
      </div>
    </div>`;
  startConfetti(8000);
  flash('win');
}
function playAgain() { initSoloGame(); setView('setup'); }
function toMenu() { state.game = null; setView('menu'); }

// ──────────────────────────── SPEED TOGGLE ────────────────────────────
function speedToggleHtml() {
  const tags = [{ id:'normal', label:'🐢', t:T('speed_normal') }, { id:'fast', label:'⚡', t:T('speed_fast') }, { id:'auto', label:'🚀', t:T('speed_auto') }];
  return `<div style="display:flex; gap:0.3rem; margin-bottom:0.4rem;">
    <span style="font-size:0.65rem; letter-spacing:2px; color:var(--silver); text-transform:uppercase; align-self:center; margin-right:0.3rem;">${T('speed')}</span>
    ${tags.map(s => `<button class="lang-pill ${state.speed===s.id?'active':''}" data-tip="${s.t}" onclick="VV.setSpeed('${s.id}')">${s.label}</button>`).join('')}
  </div>`;
}
function setSpeed(s) { state.speed = s; localStorage.setItem('vv_speed', s); render(); }

// ──────────────────────────── DICE VISUAL (3D via Three.js with 2D fallback) ────────────────────────────
let dice3D = null; // { renderer, scene, camera, mesh, anim }
function ensureDice3DContainer() {
  let area = $('.dice-area');
  if (!area) return null;
  let canvasHolder = $('.dice-3d', area);
  if (!canvasHolder) {
    canvasHolder = document.createElement('div'); canvasHolder.className = 'dice-3d';
    area.insertBefore(canvasHolder, area.firstChild);
  }
  return canvasHolder;
}
function initDice3D(holder) {
  if (typeof THREE === 'undefined') return null;
  if (dice3D && dice3D.holder === holder) return dice3D;
  while (holder.firstChild) holder.removeChild(holder.firstChild);
  const w = holder.clientWidth || 160, h = holder.clientHeight || 160;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
  camera.position.set(0, 0, 5);
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
  renderer.setSize(w, h); renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  holder.appendChild(renderer.domElement);
  // Dodecahedron — 12 faces
  const geom = new THREE.DodecahedronGeometry(1.4, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0xe84317, roughness: 0.35, metalness: 0.5, emissive:0x331400, emissiveIntensity:0.3 });
  const mesh = new THREE.Mesh(geom, mat); scene.add(mesh);
  // Edges for definition
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0xfacc15 }));
  mesh.add(edges);
  const amb = new THREE.AmbientLight(0xffffff, 0.55); scene.add(amb);
  const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(2, 3, 4); scene.add(dl);
  dice3D = { renderer, scene, camera, mesh, holder, edges, anim:null };
  return dice3D;
}
async function rollDiceVisual(num) {
  const numEl = $('#dice-num');
  if (numEl) numEl.textContent = '…';
  const holder = ensureDice3DContainer();
  const d = holder ? initDice3D(holder) : null;
  if (d) {
    cancelAnimationFrame(d.anim);
    const start = performance.now();
    const dur = speedMs(900);
    return new Promise(resolve => {
      const tick = (t) => {
        const k = Math.min(1, (t - start)/dur);
        const speedFactor = 1 - Math.pow(k, 2.4);
        d.mesh.rotation.x += 0.18 * speedFactor + 0.012;
        d.mesh.rotation.y += 0.22 * speedFactor + 0.008;
        d.mesh.rotation.z += 0.06 * speedFactor;
        d.renderer.render(d.scene, d.camera);
        if (k < 1) d.anim = requestAnimationFrame(tick);
        else { if (numEl) { numEl.textContent = num; numEl.style.transform = 'scale(1.3)'; setTimeout(()=>numEl.style.transform='scale(1)', 150); } resolve(); }
      };
      d.anim = requestAnimationFrame(tick);
    });
  }
  // Fallback — animate the number
  return new Promise(resolve => {
    const dur = speedMs(800);
    const start = performance.now();
    function tick(t) {
      const k = (t - start)/dur;
      if (numEl) numEl.textContent = (1 + Math.floor(Math.random()*12));
      if (k < 1) requestAnimationFrame(tick); else { if (numEl) numEl.textContent = num; resolve(); }
    }
    requestAnimationFrame(tick);
  });
}

// ──────────────────────────── CONFETTI ────────────────────────────
let confettiAnim = null;
function startConfetti(durationMs = 6000) {
  const c = $('#confetti'); if (!c) return;
  const ctx = c.getContext('2d');
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const colors = ['#e84317','#f97316','#f59e0b','#facc15','#fff'];
  const N = 140;
  const parts = Array.from({length:N}, () => ({
    x: Math.random()*c.width, y: -20 - Math.random()*c.height*0.5,
    vx: -2 + Math.random()*4, vy: 2 + Math.random()*5,
    r: 4 + Math.random()*6, color: choice(colors), rot: Math.random()*Math.PI*2, vrot: -0.2 + Math.random()*0.4
  }));
  const start = performance.now();
  function frame(t) {
    ctx.clearRect(0,0,c.width,c.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.rot += p.vrot;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.fillRect(-p.r/2, -p.r/4, p.r, p.r/2);
      ctx.restore();
    }
    if (t - start < durationMs) confettiAnim = requestAnimationFrame(frame);
    else { ctx.clearRect(0,0,c.width,c.height); confettiAnim = null; }
  }
  cancelAnimationFrame(confettiAnim);
  confettiAnim = requestAnimationFrame(frame);
}

// ──────────────────────────── WAIT / RESOLVE ────────────────────────────
const _waiters = {};
function waitFor(name, autoMs) {
  return new Promise(resolve => {
    if (!name) { setTimeout(resolve, autoMs || 1); return; }
    _waiters[name] = resolve;
    if (autoMs) setTimeout(() => { if (_waiters[name]) { delete _waiters[name]; resolve(); } }, autoMs);
  });
}
function fire(name) {
  const r = _waiters[name];
  if (r) { delete _waiters[name]; r(); }
}

// User-action wrappers
function continueTournament() { fire('continueTournament'); }
function continueAfterMatch() { fire('continueAfterMatch'); }
function serveOnce() { fire('serveOnce'); }
function endMarket() { fire('endMarket'); }

// ──────────────────────────── RENDER DISPATCH ────────────────────────────
function render() {
  switch (state.view) {
    case 'splash': /* shown by HTML */ break;
    case 'intro': renderIntro(); break;
    case 'menu':  renderMenu(); break;
    case 'mp_submenu': renderMpSubmenu(); break;
    case 'setup': renderSetup(); break;
    case 'game':  renderGame(); break;
    case 'end':   renderEnd(); break;
  }
}

// ──────────────────────────── ESCAPING ────────────────────────────
function escapeHTML(s) { return String(s||'').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[m])); }

// ──────────────────────────── BOOT ────────────────────────────
function boot() {
  ALL_CARDS = buildAllCards();
  // Sound toggle
  const stBtn = $('#sound-toggle');
  if (stBtn) {
    stBtn.hidden = false;
    stBtn.textContent = state.soundOn ? '🔊' : '🔇';
    stBtn.addEventListener('click', () => {
      state.soundOn = !state.soundOn;
      localStorage.setItem('vv_sound', state.soundOn?'1':'0');
      stBtn.textContent = state.soundOn ? '🔊' : '🔇';
      if (state.soundOn) beep(660, 80);
    });
  }
  const seenIntro = localStorage.getItem('vv_seenIntro') === '1';
  setView(seenIntro ? 'menu' : 'intro');
}

// Public API
window.VV = {
  setView, setLang, setSpeed,
  advanceIntro, skipIntro,
  startSolo, openMultiplayer, createRoom, showJoinForm,
  buyCard, beginSeason,
  serveOnce, continueTournament, continueAfterMatch, endMarket,
  playAgain, toMenu,
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
