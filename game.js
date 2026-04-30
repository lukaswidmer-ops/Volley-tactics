/* =====================================================================
   VOLLEY VENDETTA — game.js (main engine)
   ---------------------------------------------------------------------
   Loaded AFTER cards.js and game-bots.js.
   Architecture: single closure, vanilla JS, no framework.
   See spec §4 (architecture), §5 (bots), §6 (pitfalls) and §10 (checklist).
   ===================================================================== */

(function () {
  'use strict';

  // =================================================================
  // 1. CONSTANTS & DICTIONARIES
  // =================================================================

  // outside2 is a first-class slot — every iteration must include it.
  const POSITIONS = ['outside','outside2','middle','setter','diagonal','libero'];

  const POS_LABEL = {
    outside:'OH1', outside2:'OH2', middle:'MB',
    setter:'S',    diagonal:'OPP', libero:'L'
  };
  const POS_NAME = {
    outside:'Outside Hitter 1', outside2:'Outside Hitter 2',
    middle:'Middle Blocker',   setter:'Setter',
    diagonal:'Opposite',       libero:'Libero'
  };
  const POS_COLOR = {
    outside:'#e84317', outside2:'#e84317',
    middle:'#16a34a', setter:'#0ea5e9',
    diagonal:'#4f46e5', libero:'#ca8a04'
  };

  // Volleyball 5-1 formation positions (counterclockwise from back-right).
  // Pos 4 (front-left)  → MB        Pos 5 (back-left)  → OPP
  // Pos 3 (front-mid)   → OH1       Pos 6 (back-mid)   → OH2
  // Pos 2 (front-right) → S         Pos 1 (back-right) → L
  const FRONT_ROW = ['middle', 'outside', 'setter'];          // pos 4, 3, 2
  const BACK_ROW  = ['diagonal', 'outside2', 'libero'];       // pos 5, 6, 1
  const POS_SLOT_NUM = {
    outside:3, outside2:6, middle:4, setter:2, diagonal:5, libero:1
  };

  // Day-in-week → event type. (1-indexed.) Days 4 and 8 are intercepted
  // by resolveDay before this map applies.
  const DAY_EVENT = {
    1: 'redcard',
    2: 'transfer',
    3: 'action',
    4: 'tournament',     // intercepted
    5: 'vnl',
    6: 'action',
    7: 'injury',
    8: 'league'          // intercepted
  };

  // Speed timings (ms). See spec §4.5.
  const SPEED = {
    normal: { coneRoll:1500, continueAfter:1500, serveWait:2500, rallyView:1800,
              botBid:700,    eventAuto:8000 },
    fast:   { coneRoll:1000, continueAfter:1000, serveWait:1200, rallyView:800,
              botBid:200,    eventAuto:5000 },
    auto:   { coneRoll:100,  continueAfter:100,  serveWait:200,  rallyView:0,
              botBid:100,    eventAuto:1500 }
  };

  // Localization. (DE primary, EN fallback.)
  const I18N = {
    de: {
      week:'WOCHE', day:'Tag', of:'von', start:'SPIELEN', name:'Dein Name',
      yourTurn:'DU BIST DRAN', botTurn:'Bot ist dran',
      roll:'Würfeln', serve:'🏐 Aufschlag', continue:'▶ Weiter', done:'✅ Fertig',
      bid:'Bieten', pass:'Passen', skip:'⏭ Skip',
      redcard:'ROTE KARTE', transfer:'TRANSFER', action:'AKTIONSKARTE',
      vnl:'VNL', injury:'VERLETZUNG', league:'LIGASPIEL',
      cup:'POKAL', cl:'CHAMPIONS LEAGUE', supercup:'SUPER CUP',
      front:'Vorne', back:'Hinten', bench:'Bank',
      strength:'Stärke', money:'Geld', vp:'VP', lp:'LP',
      win:'SIEG!', loss:'NIEDERLAGE', draw:'UNENTSCHIEDEN',
      market:'Markt', sell:'Verkaufen', buy:'Kaufen', cancel:'Abbrechen',
      next:'Weiter', ok:'OK', confirm:'Bestätigen',
      seasonEnd:'Saisonende', protect:'Schützen', steal:'Klauen'
    },
    en: {
      week:'WEEK', day:'Day', of:'of', start:'PLAY', name:'Your name',
      yourTurn:'YOUR TURN', botTurn:'Bot is playing',
      roll:'Roll', serve:'🏐 Serve', continue:'▶ Continue', done:'✅ Done',
      bid:'Bid', pass:'Pass', skip:'⏭ Skip',
      redcard:'RED CARD', transfer:'TRANSFER', action:'ACTION CARD',
      vnl:'VNL', injury:'INJURY', league:'LEAGUE MATCH',
      cup:'CUP', cl:'CHAMPIONS LEAGUE', supercup:'SUPER CUP',
      front:'Front', back:'Back', bench:'Bench',
      strength:'Strength', money:'Money', vp:'VP', lp:'LP',
      win:'WIN!', loss:'LOSS', draw:'DRAW',
      market:'Market', sell:'Sell', buy:'Buy', cancel:'Cancel',
      next:'Next', ok:'OK', confirm:'Confirm',
      seasonEnd:'Season End', protect:'Protect', steal:'Steal'
    }
  };
  const T = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;

  // Board grid — percentage coordinates of the 48 spaces (6 weeks × 8 days).
  // The board image is 1254x1254. Numbering: snake by week, day 1 at the
  // start of each week. Week 1 top, week 6 bottom.
  const BOARD_GRID = (() => {
    const grid = [];
    const weeks = 6, days = 8;
    const xLeft = 8, xRight = 92;          // percent
    const yTop  = 12, yBottom = 88;        // percent
    const xStep = (xRight - xLeft) / (days - 1);
    const yStep = (yBottom - yTop) / (weeks - 1);
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const left = xLeft + d * xStep;
        const top  = yTop  + w * yStep;
        grid.push({ leftPct: left, topPct: top, week: w + 1, day: d + 1 });
      }
    }
    return grid;
  })();

  // =================================================================
  // 2. INLINE VV_BOTS FALLBACK
  // (game-bots.js may fail to load — keep a minimal substitute.)
  // =================================================================
  if (!window.VV_BOTS) {
    window.VV_BOTS = {
      POSITIONS: POSITIONS.slice(),
      pickPersonas: (n) => {
        const arr = [{name:'Bot A',style:'balanced',emoji:'🤖'},
                     {name:'Bot B',style:'aggressive',emoji:'🤖'},
                     {name:'Bot C',style:'defensive',emoji:'🤖'}];
        return arr.slice(0, n);
      },
      shouldBid: () => ({ pass: true }),
      pickMarketBuy: () => null,
      pickProtect: () => 'outside',
      pickSteal:   () => null,
      targetSlotFor: (bot, p) => p
    };
  }

  // =================================================================
  // 3. STATE
  // =================================================================
  const state = {
    lang: 'de',
    view: 'splash',           // splash | setup | draft | auction | game | result
    speed: 'normal',          // normal | fast | auto
    skipping: false,
    game: null                // populated by initSoloGame()
  };

  // Make state accessible from devtools.
  window.VV_STATE = state;

  // =================================================================
  // 4. UTILITIES & DOM HELPERS
  // =================================================================
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const fmtMoney = (n) => (n || 0).toLocaleString('de-CH').replace(/,/g, "'") + '';
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // skip-aware sleep — see spec §4.3
  const sleep = (ms) => new Promise(r => setTimeout(r, state.skipping ? 0 : ms));

  // Speed lookup
  const ms = (key) => SPEED[state.speed][key];

  // =================================================================
  // 5. WAIT / FIRE SYSTEM (Promise-based async game flow)
  // =================================================================
  const _waiters = {};
  function waitFor(name, autoMs) {
    return new Promise((resolve) => {
      // Skip-aware first: if skip is active, resolve immediately.
      if (state.skipping) { setTimeout(resolve, 0); return; }
      _waiters[name] = resolve;
      // Optional auto-fire (e.g. fast-mode timeout).
      if (autoMs && autoMs > 0) {
        setTimeout(() => {
          if (_waiters[name] === resolve) { delete _waiters[name]; resolve(); }
        }, autoMs);
      }
      // 30-second safety net — never let the loop hang permanently.
      setTimeout(() => {
        if (_waiters[name] === resolve) { delete _waiters[name]; resolve(); }
      }, 30000);
    });
  }
  function fire(name) {
    const r = _waiters[name];
    if (r) { delete _waiters[name]; r(); }
  }

  function skipAll() {
    state.skipping = true;
    ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket',
     'inlineBid','draftDone','auctionDone','seasonContinue','protectChosen',
     'stealChosen']
      .forEach(fire);
    // Force-close any modals/popups
    $$('.modal-popup, .event-popup-banner, .turn-banner, .market-modal-back, .result-overlay')
      .forEach(el => el.remove());
    setTimeout(() => { state.skipping = false; }, 3000);
    log('⏭ Übersprungen', 'system');
  }

  // =================================================================
  // 6. CARD & TEAM HELPERS
  // =================================================================
  function emptyTeam() {
    const t = {};
    POSITIONS.forEach(p => t[p] = null);
    return t;
  }

  function teamStarters(team) {
    return POSITIONS.map(p => team[p]).filter(Boolean);
  }

  function teamStrength(team) {
    return teamStarters(team).reduce((sum, c) => sum + (c.stars || 0), 0);
  }

  function teamFront(team) {
    return FRONT_ROW.map(p => team[p]).filter(Boolean);
  }
  function teamBack(team) {
    return BACK_ROW.map(p => team[p]).filter(Boolean);
  }

  // Where does an arriving card go on this player's team?
  function placeIntoTeamOrBench(player, card) {
    if (!player || !card) return;
    if (card.pos === 'outside') {
      if (!player.team.outside)  { player.team.outside  = card; return 'outside'; }
      if (!player.team.outside2) { player.team.outside2 = card; return 'outside2'; }
      // Both filled — replace weaker, bench old one.
      const a = player.team.outside, b = player.team.outside2;
      const weakerSlot = (a.stars <= b.stars) ? 'outside' : 'outside2';
      const ousted = player.team[weakerSlot];
      if (card.stars > ousted.stars) {
        player.team[weakerSlot] = card;
        player.bench.push(ousted);
        return weakerSlot;
      }
      player.bench.push(card);
      return 'bench';
    }
    const slot = card.pos;
    if (!player.team[slot]) { player.team[slot] = card; return slot; }
    const existing = player.team[slot];
    if (card.stars > existing.stars) {
      player.team[slot] = card;
      player.bench.push(existing);
      return slot;
    }
    player.bench.push(card);
    return 'bench';
  }

  // Replacement: when a starter is removed (red card / injury / VNL),
  // move them to bench and try to substitute from bench-same-position;
  // otherwise auto-buy a 1-star for 10k.
  function replaceStarter(player, slot, reason) {
    const removed = player.team[slot];
    if (!removed) return;
    player.team[slot] = null;
    if (reason === 'injury') player.injured = (player.injured || []).concat([{card:removed, slot:slot}]);
    else if (reason === 'redcard') player.redcards = (player.redcards || []).concat([{card:removed, slot:slot}]);
    else if (reason === 'vnl') player.vnl = (player.vnl || []).concat([{card:removed, slot:slot}]);
    else player.bench.push(removed);

    // Try a bench substitute (same logical position)
    const wantPos = (slot === 'outside2') ? 'outside' : slot;
    const idx = player.bench.findIndex(c => c.pos === wantPos);
    if (idx >= 0) {
      const sub = player.bench.splice(idx, 1)[0];
      player.team[slot] = sub;
      log(`🔄 ${esc(player.name)} ersetzt ${esc(removed.name)} mit ${esc(sub.name)}`, 'system');
    } else if (player.money >= 10000) {
      // Auto-buy a 1-star at the right position.
      const oneStar = state.game.cards.find(c =>
        c.stars === 1 && c.pos === wantPos && !cardOwned(c));
      if (oneStar) {
        player.money -= 10000;
        player.team[slot] = oneStar;
        log(`💰 ${esc(player.name)} kauft 1★ ${esc(oneStar.name)} für 10k`, 'event');
      }
    }
  }

  // Bring back red-card / injury / VNL players after the next league match.
  function restoreSidelined(player) {
    ['injured','redcards','vnl'].forEach(bucket => {
      const arr = player[bucket] || [];
      arr.forEach(({card, slot}) => {
        if (!player.team[slot]) player.team[slot] = card;
        else player.bench.push(card);
      });
      player[bucket] = [];
    });
  }

  function cardOwned(card) {
    if (!state.game) return false;
    for (const p of state.game.players) {
      if (Object.values(p.team).some(c => c && c.id === card.id)) return true;
      if (p.bench.some(c => c && c.id === card.id)) return true;
    }
    return false;
  }

  function deckHas(card) {
    return state.game.auctionDeck.some(c => c.id === card.id);
  }

  // =================================================================
  // 7. PLAYER FACTORY
  // =================================================================
  function makePlayer(name, isHuman, persona) {
    return {
      id: 'p' + Math.random().toString(36).slice(2, 8),
      name: name,
      isHuman: !!isHuman,
      style: (persona && persona.style) || 'balanced',
      emoji: (persona && persona.emoji) || (isHuman ? '🧑' : '🤖'),
      money: 80000,
      vp: 0,
      lp: 0,
      cupWins: 0,
      seasonsPlayed: 0,
      team: emptyTeam(),
      bench: [],
      injured: [],
      redcards: [],
      vnl: []
    };
  }

  // =================================================================
  // 8. LOGGING
  // =================================================================
  function log(msg, kind) {
    const list = $('#log-list');
    if (!list) {
      console.log('[VV]', msg); return;
    }
    const now = new Date();
    const ts = String(now.getHours()).padStart(2,'0') + ':' +
               String(now.getMinutes()).padStart(2,'0') + ':' +
               String(now.getSeconds()).padStart(2,'0');
    const div = document.createElement('div');
    div.className = 'log-entry ' + (kind || '');
    div.innerHTML = '<span class="log-time">' + ts + '</span>' + msg;
    list.insertBefore(div, list.firstChild);
    // Trim
    while (list.children.length > 80) list.removeChild(list.lastChild);
  }

  // =================================================================
  // 9. INITIAL RENDER (top-level dispatcher)
  // =================================================================
  function render() {
    const root = $('#vv-app');
    if (!root) return;
    if (state.view === 'splash')  return renderSplash(root);
    if (state.view === 'draft')   return renderDraft(root);
    if (state.view === 'auction') return renderAuction(root);
    if (state.view === 'game')    return renderGame(root);
    if (state.view === 'result')  return renderResult(root);
  }

  function setView(v) { state.view = v; render(); }

  // =================================================================
  // 10. SPLASH SCREEN
  // =================================================================
  function renderSplash(root) {
    root.innerHTML = `
      <div class="vv-splash">
        <h1>VOLLEY VENDETTA</h1>
        <p>${T('start')} — Dein Volleyball-Strategie-Kartenspiel.</p>
        <input id="splash-name" placeholder="${T('name')}" maxlength="18" value="Marcel">
        <button class="vv-btn primary" id="splash-start">${T('start')}</button>
        <div class="muted" style="margin-top:12px;font-size:12px">v1.0 — first to 8 VP wins</div>
      </div>`;
    $('#splash-start').addEventListener('click', () => {
      const name = ($('#splash-name').value || 'Du').trim();
      initSoloGame(name);
    });
    $('#splash-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('#splash-start').click();
    });
  }

  // =================================================================
  // 11. INIT SOLO GAME
  // =================================================================
  function initSoloGame(humanName) {
    const cards = (window.buildAllCards ? window.buildAllCards() : []);
    if (!cards.length) {
      alert('cards.js failed to load — no cards available.');
      return;
    }
    const personas = window.VV_BOTS.pickPersonas(3);
    const players = [
      makePlayer(humanName, true, null),
      makePlayer('Bot ' + personas[0].name, false, personas[0]),
      makePlayer('Bot ' + personas[1].name, false, personas[1]),
      makePlayer('Bot ' + personas[2].name, false, personas[2])
    ];

    // Blind draft pool: each player gets 1×4★, 2×3★, 3×2★ via random pull.
    // 1★ cards are "always available" — players pick 3 of them by position.
    const all = cards.slice();
    const oneStars = all.filter(c => c.stars === 1);
    const auctionable = all.filter(c => c.stars >= 2);

    state.game = {
      cards: cards,
      players: players,
      currentPlayerIdx: 0,
      week: 1, season: 1,
      coneDay: 0,                 // 0..47 (board space)
      coneTotal: 48,
      auctionDeck: shuffle(auctionable.slice()),
      oneStarPool: oneStars.slice(),
      unsoldMarket: [],           // 2★+ cards that didn't sell at auction
      eventLog: [],
      cupWinner: null,
      leagueWinner: null,
      clQualifiers: [],
      seasonEnded: false
    };

    // ---- BLIND DRAFT auto-deal -----------------------------------
    function drawByStars(starN, count) {
      const pool = state.game.auctionDeck.filter(c => c.stars === starN);
      const picked = [];
      for (let i = 0; i < count && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const c = pool.splice(idx, 1)[0];
        // remove from main auction deck
        const di = state.game.auctionDeck.indexOf(c);
        if (di >= 0) state.game.auctionDeck.splice(di, 1);
        picked.push(c);
      }
      return picked;
    }

    players.forEach(p => {
      const dealt = []
        .concat(drawByStars(4, 1))
        .concat(drawByStars(3, 2))
        .concat(drawByStars(2, 3));
      dealt.forEach(c => placeIntoTeamOrBench(p, c));
    });

    // Roll for starting player (D12).
    let high = -1, hi = 0;
    players.forEach((p, i) => { const r = rand(1,12); if (r > high) { high = r; hi = i; } });
    state.game.currentPlayerIdx = hi;
    state.game.startingPlayerIdx = hi;

    log('🎲 Blind Draft abgeschlossen — Startspieler: ' + esc(players[hi].name), 'system');

    // Move to draft (1-star pick by position).
    setView('draft');
    setTimeout(() => runDraftPhase().catch(err => console.error(err)), 200);
  }

  // =================================================================
  // 12. DRAFT (1-star pick by position)
  // =================================================================
  async function runDraftPhase() {
    const g = state.game;
    // Each player picks 3 one-stars by chosen position.
    for (let pi = 0; pi < g.players.length; pi++) {
      const p = g.players[pi];
      for (let pick = 0; pick < 3; pick++) {
        const pool = g.oneStarPool.filter(c => !cardOwned(c));
        if (!pool.length) break;
        let card = null;
        if (p.isHuman) {
          card = await humanPickOneStar(p, pool);
        } else {
          // Bot picks weakest position to fill.
          let weakest = null, weakestStars = Infinity;
          for (const pos of POSITIONS) {
            const c = p.team[pos];
            const s = c ? c.stars : 0;
            if (s < weakestStars) { weakestStars = s; weakest = pos; }
          }
          const wantPos = (weakest === 'outside2') ? 'outside' : weakest;
          card = pool.find(c => c.pos === wantPos) || pool[0];
          await sleep(ms('botBid'));
        }
        if (card) {
          placeIntoTeamOrBench(p, card);
          log(`📝 ${esc(p.name)} wählt 1★ ${esc(card.name)}`, 'system');
          renderDraft();
        }
      }
    }
    // Auction phase next.
    setView('auction');
    setTimeout(() => runOpeningAuction().catch(err => console.error(err)), 300);
  }

  function renderDraft(rootMaybe) {
    const root = rootMaybe || $('#vv-app');
    if (!root) return;
    if (state.view !== 'draft') return;
    const g = state.game;
    const human = g.players.find(p => p.isHuman);
    root.innerHTML = `
      <div class="draft-view">
        <div class="draft-main">
          <h2 style="font-family:var(--font-display);letter-spacing:4px;color:var(--gold);">DRAFT — 1★ Karten</h2>
          <p class="muted">Klicke eine Karte an um sie zu wählen. ${T('week')} 1.</p>
          <div id="draft-pool" class="draft-grid"></div>
        </div>
        <div class="draft-side">
          <h3>${esc(human.name)} — ★ ${teamStrength(human.team)}</h3>
          ${setupTeamPanelHtml(human)}
        </div>
      </div>`;
    refreshDraftPool();
  }

  function refreshDraftPool() {
    const cont = $('#draft-pool');
    if (!cont) return;
    const g = state.game;
    const pool = g.oneStarPool.filter(c => !cardOwned(c));
    cont.innerHTML = pool.map(c => cardHtml(c)).join('');
  }

  function humanPickOneStar(player, pool) {
    return new Promise((resolve) => {
      const cont = $('#draft-pool');
      if (!cont) { resolve(pool[0]); return; }
      cont.querySelectorAll('.vv-card').forEach((el) => {
        el.addEventListener('click', () => {
          const id = el.getAttribute('data-id');
          const c = pool.find(x => x.id === id);
          if (c) resolve(c);
        });
      });
      // Safety: 30s default click — auto-pick weakest position fill.
      setTimeout(() => {
        if (state.skipping) {
          let weakest = null, weakestStars = Infinity;
          for (const pos of POSITIONS) {
            const c = player.team[pos];
            const s = c ? c.stars : 0;
            if (s < weakestStars) { weakestStars = s; weakest = pos; }
          }
          const wantPos = (weakest === 'outside2') ? 'outside' : weakest;
          const c = pool.find(x => x.pos === wantPos) || pool[0];
          resolve(c);
        }
      }, 30000);
    });
  }

  function cardHtml(card, opts) {
    if (!card) return '';
    opts = opts || {};
    const cls = ['vv-card', opts.benched ? 'benched' : '', opts.injured ? 'injured' : '']
      .filter(Boolean).join(' ');
    return `
      <div class="${cls}" data-id="${esc(card.id)}" data-pos="${esc(card.pos)}">
        <img class="vc-img" src="${esc(card.url)}" alt="${esc(card.name)}"
             onerror="this.style.background='#222';this.removeAttribute('src')">
        <div class="vc-name">${esc(card.name)}</div>
        <div class="vc-pos">${esc(POS_LABEL[card.pos] || card.pos)}</div>
      </div>`;
  }

  // =================================================================
  // 13. OPENING AUCTION (6 cards)
  // =================================================================
  async function runOpeningAuction() {
    const g = state.game;
    const human = g.players.find(p => p.isHuman);
    // Reveal 6 cards from auction deck.
    const lot = [];
    while (lot.length < 6 && g.auctionDeck.length) {
      lot.push(g.auctionDeck.shift());
    }
    for (let i = 0; i < lot.length; i++) {
      const card = lot[i];
      renderAuctionCard(card, i + 1, lot.length);
      const result = await runAuctionRound(card, false);
      if (result.winner) {
        result.winner.money -= result.bid;
        placeIntoTeamOrBench(result.winner, card);
        log(`💰 ${esc(result.winner.name)} ersteigert ${esc(card.name)} für ${fmtMoney(result.bid)}`, 'event');
      } else {
        // Unsold: stays in market for shop access until sold.
        g.unsoldMarket.push(card);
        log(`⚠ ${esc(card.name)} nicht verkauft — geht in den Markt`, 'system');
      }
      await sleep(800);
    }
    // Move to game proper.
    setView('game');
    setTimeout(() => startSeason().catch(err => console.error(err)), 300);
  }

  function renderAuction(root) {
    if (!root) root = $('#vv-app');
    const human = state.game.players.find(p => p.isHuman);
    root.innerHTML = `
      <div class="draft-view">
        <div class="draft-main auction-view" id="auction-main">
          <h2 style="font-family:var(--font-display);letter-spacing:4px;color:var(--gold);">ERÖFFNUNGS-AUKTION</h2>
          <div id="auction-card-display" class="auction-card-display">— —</div>
          <div id="auction-bids" class="auction-bids"></div>
          <div id="auction-controls" class="bid-controls"></div>
        </div>
        <div class="draft-side">
          <h3>${esc(human.name)} — ★ ${teamStrength(human.team)} — ${fmtMoney(human.money)}</h3>
          <div id="setup-team-panel">${setupTeamPanelHtml(human)}</div>
        </div>
      </div>`;
  }

  function renderAuctionCard(card, idx, total) {
    const c = $('#auction-card-display');
    if (!c) return;
    c.innerHTML = `
      ${cardHtml(card)}
      <div class="auction-info">
        <div class="ai-name">${esc(card.name)}</div>
        <div class="ai-stars">${stars(card.stars)} (${card.stars}★)</div>
        <div class="muted">Mindestgebot: ${fmtMoney(card.stars * 10000)}</div>
        <div class="muted">Auktion ${idx}/${total}</div>
        <div class="ai-bid" id="auction-current-bid">— ${T('bid')}</div>
      </div>`;
  }

  // Run auction round across all players in turn order, repeatedly until
  // only one remains (or all pass on the first round).
  async function runAuctionRound(card, isInGameTransfer) {
    const g = state.game;
    const minBid = card.stars * 10000;
    let currentBid = 0;
    let leader = null;
    let active = g.players.slice();              // start with all players
    let order  = g.players.slice(g.startingPlayerIdx).concat(g.players.slice(0, g.startingPlayerIdx));
    const passed = new Set();
    const bidsList = $('#auction-bids') || (isInGameTransfer ? $('#event-detail') : null);
    // Helper to render bid
    function logBid(p, text, classes) {
      if (!bidsList) return;
      const div = document.createElement('div');
      div.className = 'bid-line ' + (classes || '');
      div.innerHTML = `${esc(p.emoji)} ${esc(p.name)} — ${esc(text)}`;
      bidsList.appendChild(div);
    }
    // Safety cap on rounds.
    let safety = 24;
    while (safety-- > 0) {
      let activeThisRound = order.filter(p => !passed.has(p.id));
      if (activeThisRound.length <= 1) break;
      let bidThisRound = false;
      for (const p of activeThisRound) {
        if (passed.has(p.id)) continue;
        const myMin = Math.max(minBid, currentBid + 1000);
        if (p.isHuman) {
          const r = await humanBidPrompt(card, currentBid, myMin, isInGameTransfer);
          if (r && r.pass) {
            passed.add(p.id);
            logBid(p, T('pass'), 'passed');
          } else if (r && r.bid > 0) {
            currentBid = r.bid; leader = p;
            updateCurrentBid(currentBid, leader);
            logBid(p, fmtMoney(r.bid), 'winning');
            bidThisRound = true;
          }
        } else {
          await sleep(ms('botBid'));
          let dec = { pass: true };
          try {
            dec = window.VV_BOTS.shouldBid(p, card, currentBid, myMin,
                                            g.players.filter(x => x !== p));
            if (!dec) dec = { pass: true };
          } catch (e) { dec = { pass: true }; }
          // Force pass if not enough money or below min.
          if (dec.bid && dec.bid < myMin) dec = { pass: true };
          if (dec.bid && dec.bid > p.money) dec = { pass: true };
          if (dec.pass) {
            passed.add(p.id);
            logBid(p, T('pass'), 'passed');
          } else {
            currentBid = dec.bid; leader = p;
            updateCurrentBid(currentBid, leader);
            logBid(p, fmtMoney(dec.bid), 'winning');
            bidThisRound = true;
          }
        }
        if (bidsList) bidsList.scrollTop = bidsList.scrollHeight;
      }
      if (!bidThisRound) break;
    }
    return { winner: leader, bid: currentBid };
  }

  function updateCurrentBid(amount, leader) {
    const c = $('#auction-current-bid');
    if (c) c.textContent = (leader ? leader.name + ' — ' : '') + fmtMoney(amount);
    const c2 = $('#event-current-bid');
    if (c2) c2.textContent = (leader ? leader.name + ' — ' : '') + fmtMoney(amount);
  }

  function humanBidPrompt(card, currentBid, minBid, isInGameTransfer) {
    return new Promise((resolve) => {
      const target = isInGameTransfer ? $('#event-detail') : $('#auction-controls');
      if (!target) { resolve({ pass: true }); return; }
      target.innerHTML = `
        <div class="bid-controls">
          <input type="number" id="${isInGameTransfer ? 'event-' : ''}auction-input"
                 min="${minBid}" step="1000" value="${minBid}">
          <button class="vv-btn primary" id="bid-yes-btn">${T('bid')}</button>
          <button class="vv-btn ghost"   id="bid-pass-btn">${T('pass')}</button>
        </div>`;
      const inp = target.querySelector('input');
      const yes = target.querySelector('#bid-yes-btn');
      const no  = target.querySelector('#bid-pass-btn');
      let resolved = false;
      function done(r) { if (resolved) return; resolved = true; target.innerHTML = ''; resolve(r); }
      yes.addEventListener('click', () => {
        const v = parseInt(inp.value || '0', 10) || 0;
        if (v < minBid) { inp.style.outline = '2px solid var(--red)'; return; }
        done({ bid: v });
      });
      no.addEventListener('click', () => done({ pass: true }));
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') yes.click(); });
      // Safety timeout 30s — pass.
      setTimeout(() => done({ pass: true }), 30000);
    });
  }

  // =================================================================
  // 14. MAIN GAME RENDER (5-zone fixed viewport)
  // =================================================================
  function renderGame(root) {
    if (!root) root = $('#vv-app');
    if (!state.game) return;
    root.innerHTML = `
      <div class="vv-game">
        <header class="gh">
          <div class="gh-logo">VOLLEY VENDETTA</div>
          <div class="gh-week" id="gh-week">${T('week')} ${state.game.week}/6 · S${state.game.season}</div>
          <div class="gh-right">
            <div class="gh-lang">
              <button data-lang="de" class="${state.lang==='de'?'active':''}">DE</button>
              <button data-lang="en" class="${state.lang==='en'?'active':''}">EN</button>
            </div>
          </div>
        </header>
        <section class="gtop">
          <div class="gtop-bots" id="gtop-bots"></div>
          <div id="gtop-you"></div>
        </section>
        <nav class="gphase" id="gphase">
          <button class="phase-tab active" data-phase="event"   id="ph-event">EVENT</button>
          <button class="phase-tab"        data-phase="league"  id="ph-league">LEAGUE</button>
          <button class="phase-tab"        data-phase="market"  id="ph-market">MARKET</button>
          <button class="phase-tab"        data-phase="weekend" id="ph-weekend">WEEKEND</button>
          <div class="phase-week">${T('week')} ${state.game.week}/6</div>
        </nav>
        <main class="gmid">
          <div class="gpanel gpanel-board" id="gpanel-board">
            <div class="gpanel-header">🗺️ GAME BOARD</div>
            <div class="gpanel-body" id="gpanel-board-body">
              <div class="vv-board-wrap" id="vv-board-wrap">
                <div class="vv-board-img"></div>
                <div class="vv-cone" id="vv-cone">
                  <svg viewBox="0 0 22 28">
                    <polygon class="cone-body" points="11,2 20,24 2,24"/>
                    <ellipse class="cone-base" cx="11" cy="24" rx="9" ry="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="gpanel gpanel-team" id="gpanel-team">
            <div class="gpanel-header">
              🏐 MY TEAM
              <span class="ph-strength" id="ph-strength">★ —</span>
            </div>
            <div class="gpanel-body" id="gpanel-team-body"></div>
          </div>
        </main>
        <footer class="gbot">
          <div class="gbot-cell actions-cell">
            <h3>ACTIONS</h3>
            <div class="speed-toggle" id="speed-toggle">
              <button data-speed="normal" class="active">Normal</button>
              <button data-speed="fast">Schnell</button>
              <button data-speed="auto">Auto</button>
            </div>
            <div class="action-buttons" id="action-buttons"></div>
            <button class="vv-btn skip-btn" id="skip-btn">${T('skip')}</button>
          </div>
          <div class="gbot-cell">
            <div class="dice-panel">
              <div class="dice-panel-label" id="dice-label">🎲 D3</div>
              <div class="dice-panel-result" id="dice-result">—</div>
              <button class="dice-panel-btn" id="dice-btn" disabled>${T('roll')}</button>
            </div>
          </div>
          <div class="gbot-cell log-cell">
            <h3>LOG</h3>
            <div class="log-list" id="log-list"></div>
          </div>
          <div class="gbot-cell stage-cell">
            <h3>STAGE</h3>
            <div class="stage-content" id="stage"></div>
          </div>
        </footer>
      </div>`;
    bindPhaseTabs();
    bindLangButtons();
    bindSpeedToggle();
    bindSkipButton();
    bindDiceButton();
    refreshTopbar();
    refreshTeamPanel();
    refreshConePosition();
    refreshStage();
  }

  // ---- Phase / language / speed bindings -----------------------------
  function bindPhaseTabs() {
    $$('#gphase .phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const ph = btn.getAttribute('data-phase');
        $$('#gphase .phase-tab').forEach(b => b.classList.toggle('active', b === btn));
        if (ph === 'market')  openMarketModal();
        if (ph === 'league')  openLeagueModal();
        if (ph === 'weekend') openWeekendModal();
        if (ph === 'event')   openEventInfoModal();
      });
    });
  }
  function bindLangButtons() {
    $$('.gh-lang button').forEach(b => {
      b.addEventListener('click', () => {
        state.lang = b.getAttribute('data-lang');
        render();
      });
    });
  }

  // CRITICAL — setSpeed MUST NOT call render(). See spec §4.6.
  function bindSpeedToggle() {
    $$('#speed-toggle button').forEach(b => {
      b.addEventListener('click', () => {
        state.speed = b.getAttribute('data-speed');
        $$('#speed-toggle button').forEach(x =>
          x.classList.toggle('active', x === b));
        if (state.speed === 'auto') {
          // Auto-fire any pending waiters so the bot speed flows.
          ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket']
            .forEach(fire);
        }
        log('⚡ Tempo: ' + state.speed, 'system');
      });
    });
  }
  function bindSkipButton() {
    $('#skip-btn').addEventListener('click', skipAll);
  }
  function bindDiceButton() {
    $('#dice-btn').addEventListener('click', dicePanelRoll);
  }

  // =================================================================
  // 15. TOPBAR / TEAM PANEL / CONE / STAGE refresh
  // =================================================================
  function refreshTopbar() {
    const g = state.game;
    const bots = g.players.filter(p => !p.isHuman);
    const human = g.players.find(p => p.isHuman);
    const cur = g.players[g.currentPlayerIdx];

    function pcHtml(p, isYou) {
      const active = (p === cur) ? 'active' : '';
      const cls = 'player-card ' + active + (isYou ? ' you' : '');
      return `
        <div class="${cls}">
          <div class="pc-name">${esc(p.emoji)} ${esc(p.name)}</div>
          <div class="pc-row"><span class="lbl">💰</span><span class="val">${fmtMoney(p.money)}</span></div>
          <div class="pc-row"><span class="lbl">★</span><span class="val">${teamStrength(p.team)}</span></div>
          <div class="pc-row"><span class="lbl">VP</span><span class="val">${p.vp}</span></div>
          <div class="pc-row"><span class="lbl">LP</span><span class="val">${p.lp}</span></div>
        </div>`;
    }
    $('#gtop-bots').innerHTML = bots.map(b => pcHtml(b, false)).join('');
    $('#gtop-you').innerHTML  = pcHtml(human, true);
    const w = $('#gh-week'); if (w) w.textContent = `${T('week')} ${g.week}/6 · S${g.season}`;
  }

  function refreshTeamPanel() {
    const human = state.game.players.find(p => p.isHuman);
    const body = $('#gpanel-team-body');
    if (!body) return;
    body.innerHTML = teamPanelHtml(human);
    $('#ph-strength').textContent = '★ ' + teamStrength(human.team);
    bindTeamCardClicks();
  }

  function teamPanelHtml(player) {
    function slotHtml(pos) {
      const c = player.team[pos];
      const num = POS_SLOT_NUM[pos];
      const slotClass = ['vv-slot', c ? '' : 'empty'].filter(Boolean).join(' ');
      return `<div class="${slotClass}" data-pos="${esc(pos)}">
                <span class="pos-num">${num}</span>
                ${c ? cardHtml(c) : esc(POS_LABEL[pos])}
              </div>`;
    }
    const benchHtml = (player.bench || []).map(c =>
      cardHtml(c, { benched: true })).join('');
    return `
      <div class="team-actions">
        <button class="vv-btn small" id="team-sell-toggle">🛒 Verkaufen</button>
        <button class="vv-btn small" id="team-market-btn">🏪 Markt</button>
      </div>
      <div class="vv-formation">
        <div class="vv-net"></div>
        <div class="vv-row">${FRONT_ROW.map(slotHtml).join('')}</div>
        <div class="vv-row-label">FRONT</div>
        <div class="vv-row">${BACK_ROW.map(slotHtml).join('')}</div>
        <div class="vv-row-label">BACK</div>
      </div>
      <div class="vv-bench">
        <h4>${T('bench')} (${(player.bench || []).length})</h4>
        <div class="vv-bench-row">${benchHtml || '<span class="muted">leer</span>'}</div>
      </div>`;
  }

  function setupTeamPanelHtml(player) {
    return teamPanelHtml(player);
  }

  function bindTeamCardClicks() {
    const sellToggle = $('#team-sell-toggle');
    if (sellToggle) {
      sellToggle.addEventListener('click', () => {
        document.body.classList.toggle('sell-mode');
        sellToggle.textContent = document.body.classList.contains('sell-mode')
          ? '✕ Abbrechen' : '🛒 Verkaufen';
      });
    }
    const marketBtn = $('#team-market-btn');
    if (marketBtn) marketBtn.addEventListener('click', openMarketModal);
    $$('#gpanel-team .vv-card').forEach(el => {
      el.addEventListener('click', () => {
        if (!document.body.classList.contains('sell-mode')) return;
        const id = el.getAttribute('data-id');
        sellCardById(id);
      });
    });
  }

  function sellCardById(cardId) {
    const human = state.game.players.find(p => p.isHuman);
    let card = null, slot = null;
    for (const p of POSITIONS) {
      if (human.team[p] && human.team[p].id === cardId) { card = human.team[p]; slot = p; break; }
    }
    if (!card) {
      const idx = human.bench.findIndex(c => c.id === cardId);
      if (idx >= 0) { card = human.bench[idx]; human.bench.splice(idx, 1); }
    } else {
      human.team[slot] = null;
    }
    if (card) {
      const price = card.stars * 5000;
      human.money += price;
      state.game.unsoldMarket.push(card);
      log(`💸 ${esc(human.name)} verkauft ${esc(card.name)} für ${fmtMoney(price)}`, 'event');
      // If we cleared a starter, try to substitute.
      if (slot && !human.team[slot]) replaceStarter(human, slot, 'sold');
      refreshTeamPanel();
      refreshTopbar();
    }
  }

  function refreshConePosition() {
    const cone = $('#vv-cone');
    if (!cone) return;
    const pos = BOARD_GRID[Math.min(state.game.coneDay, BOARD_GRID.length - 1)];
    cone.style.left = pos.leftPct + '%';
    cone.style.top  = pos.topPct + '%';
  }

  function refreshStage() {
    const s = $('#stage');
    if (!s) return;
    const g = state.game;
    const cur = g.players[g.currentPlayerIdx];
    const dayInWeek = (g.coneDay % 8) + 1;
    s.innerHTML = `
      <div class="stage-week">${T('week')} ${g.week}/6</div>
      <div class="stage-day">${T('day')} ${dayInWeek}/8 · Feld ${g.coneDay + 1}/48</div>
      <div class="stage-turn">${cur.isHuman ? T('yourTurn') : T('botTurn') + ' — ' + esc(cur.name)}</div>
      <div id="stage-event"></div>`;
  }

  // =================================================================
  // 16. DICE PANEL (CSS animation, no 3D)
  // =================================================================
  let _diceShuffleHandle = null;
  function diceSetLabel(text) {
    const l = $('#dice-label'); if (l) l.textContent = text;
  }
  function diceShuffle(faces) {
    const r = $('#dice-result');
    if (!r) return;
    if (_diceShuffleHandle) clearInterval(_diceShuffleHandle);
    r.classList.remove('landed');
    r.classList.add('shuffling');
    _diceShuffleHandle = setInterval(() => {
      r.textContent = String(rand(1, faces));
    }, 80);
  }
  function diceLand(value) {
    const r = $('#dice-result');
    if (!r) return;
    if (_diceShuffleHandle) { clearInterval(_diceShuffleHandle); _diceShuffleHandle = null; }
    r.classList.remove('shuffling');
    r.classList.add('landed');
    r.textContent = String(value);
  }

  // Roll a die (faces 3, 6, 12) with shuffle animation. Returns the result.
  async function rollDie(faces) {
    diceShuffle(faces);
    await sleep(state.skipping ? 0 : 700);
    const result = rand(1, faces);
    diceLand(result);
    await sleep(state.skipping ? 0 : 200);
    return result;
  }

  // The dice button is context-aware — it fires whichever waiter is active.
  function dicePanelRoll() {
    if (_waiters.coneRollNow)        return fire('coneRollNow');
    if (_waiters.serveOnce)          return fire('serveOnce');
    if (_waiters.coneContinue)       return fire('coneContinue');
    if (_waiters.continueAfterMatch) return fire('continueAfterMatch');
    if (_waiters.endMarket)          return fire('endMarket');
    if (_waiters.seasonContinue)     return fire('seasonContinue');
  }

  function setDiceButton(text, enabled) {
    const b = $('#dice-btn');
    if (!b) return;
    b.textContent = text;
    b.disabled = !enabled;
  }

  function setActions(html) {
    const c = $('#action-buttons');
    if (c) c.innerHTML = html;
  }

  // =================================================================
  // 17. SEASON / WEEK / TURN LOOP
  // =================================================================
  async function startSeason() {
    refreshTopbar();
    refreshTeamPanel();
    refreshStage();
    log('🏐 Saison ' + state.game.season + ' beginnt', 'event');
    try { await runSeason(); } catch (err) { console.error('runSeason crashed', err); }
  }

  async function runSeason() {
    const g = state.game;
    while (g.coneDay < g.coneTotal) {
      // Check for VP winner
      const winner = g.players.find(p => p.vp >= 8);
      if (winner) { showResultScreen(winner); return; }

      const cur = g.players[g.currentPlayerIdx];
      await runConeRoll(cur);

      // Move to next player.
      g.currentPlayerIdx = (g.currentPlayerIdx + 1) % g.players.length;
      refreshTopbar();
      refreshStage();
      await sleep(200);
    }
    // End of season — run season-end.
    await runSeasonEnd();
    // Next season.
    g.season++;
    g.week = 1;
    g.coneDay = 0;
    g.players.forEach(p => { p.lp = 0; });
    g.cupWinner = null;
    g.leagueWinner = null;
    refreshTopbar(); refreshConePosition(); refreshStage();
    await sleep(600);
    return runSeason();
  }

  // ----- Cone roll (wrapped) -----------------------------------------
  async function runConeRoll(player) {
    try { return await _runConeRollInner(player); }
    catch (err) {
      console.error('runConeRoll error', err);
      log('⚠ Fehler beim Würfeln — überspringe', 'error');
    }
  }

  async function _runConeRollInner(player) {
    const g = state.game;
    diceSetLabel('🎲 D3 — ' + player.name);
    if (player.isHuman) {
      setDiceButton(T('roll'), true);
      setActions(`<div class="muted">Klicke "${T('roll')}" um zu würfeln.</div>`);
      // No timeout for human roll — pure click required.
      await waitFor('coneRollNow', null);
    } else {
      setDiceButton('—', false);
      setActions(`<div class="muted">Bot ${esc(player.name)} ist dran…</div>`);
      await sleep(ms('coneRoll'));
    }
    const roll = await rollDie(3);
    log(`🎲 ${esc(player.name)} würfelt ${roll}`, 'event');

    const dayBefore = g.coneDay;
    let dayAfter = Math.min(g.coneTotal, dayBefore + roll);
    g.coneDay = dayAfter;
    refreshConePosition();
    await sleep(state.skipping ? 0 : 600);

    // Determine which day(s) get triggered. Per spec: tournament (day 4)
    // and league (day 8) trigger when cone PASSES or LANDS on them.
    const newWeek = Math.floor((dayAfter - 1) / 8) + 1;
    if (newWeek !== g.week) g.week = newWeek;

    // Walk through each day passed/landed for events.
    for (let d = dayBefore + 1; d <= dayAfter; d++) {
      try { await resolveDay(d, player); }
      catch (err) {
        console.error('resolveDay error', err);
        log('⚠ Event-Fehler übersprungen', 'error');
      }
      // Re-check VP winner (cup/league might have ended the season)
      const winner = g.players.find(p => p.vp >= 8);
      if (winner) { showResultScreen(winner); return; }
    }

    // After the cone roll resolves, prompt continue
    if (player.isHuman) {
      setDiceButton(T('continue'), true);
      await waitFor('coneContinue', null);
    } else {
      await sleep(ms('continueAfter'));
    }
    setDiceButton('—', false);
    setActions('');
  }

  // =================================================================
  // 18. RESOLVE DAY (event dispatcher)
  // =================================================================
  async function resolveDay(absDay, player) {
    const dayInWeek = ((absDay - 1) % 8) + 1;
    const week = Math.floor((absDay - 1) / 8) + 1;

    // Days 4 and 8 are intercepted before generic event mapping.
    if (dayInWeek === 8) {
      // League match always triggers when cone lands on or passes day 8.
      await runEventSpace('league', player, week);
      return;
    }
    if (dayInWeek === 4) {
      // Tournament — depends on week and season.
      await runTournamentByWeek(week, player);
      return;
    }
    // Generic event by day-in-week.
    const ev = DAY_EVENT[dayInWeek];
    if (!ev) return;
    await runEventSpace(ev, player, week);
  }

  // ----- Tournament dispatcher ---------------------------------------
  async function runTournamentByWeek(week, player) {
    const g = state.game;
    if (week === 1) {
      if (g.season >= 2 && g.cupWinner && g.leagueWinner) {
        await runSuperCup(player);
      } else {
        log('🏆 Super Cup — Saison 1 übersprungen', 'system');
      }
      return;
    }
    if (week === 3) { await runCupSemi(player); return; }
    if (week === 5) { await runCupFinal(player); return; }
    // Weeks 2, 4, 6 — Champions League (Season 2+)
    if (g.season >= 2) {
      await runCLGroupStage(player);
    } else {
      log('🏆 CL — Saison 1 übersprungen', 'system');
    }
  }

  // =================================================================
  // 19. EVENT SPACE HANDLERS
  // =================================================================
  async function runEventSpace(type, player, week) {
    try { return await _runEventSpaceInner(type, player, week); }
    catch (err) {
      console.error('runEventSpace error', err);
      log('⚠ Event-Fehler überspr.', 'error');
    }
  }
  async function _runEventSpaceInner(type, player, week) {
    if (type === 'redcard')  return runRedCard(player);
    if (type === 'transfer') return runTransfer(player);
    if (type === 'action')   return runActionCard(player);
    if (type === 'vnl')      return runVNL(player);
    if (type === 'injury')   return runInjury(player);
    if (type === 'league')   return runLeagueWeek(player, week);
  }

  // ---- Red Card -----------------------------------------------------
  async function runRedCard(player) {
    log(`🟥 ${esc(player.name)} — Rote Karte!`, 'event');
    const r = await rollD6Visual();
    const slot = POSITIONS[r - 1];
    const c = player.team[slot];
    if (c) {
      replaceStarter(player, slot, 'redcard');
      await showEventPopup({
        type: 'red', icon: '🟥', title: T('redcard'),
        player: player,
        detail: `${esc(c.name)} (${POS_LABEL[slot]}) gesperrt — kehrt nach nächstem Ligaspiel zurück.`
      });
    } else {
      await showEventPopup({
        type: 'red', icon: '🟥', title: T('redcard'),
        player: player,
        detail: `Keine Sperre — ${POS_LABEL[slot]} unbesetzt.`
      });
    }
    refreshTeamPanel();
  }

  // ---- Injury -------------------------------------------------------
  async function runInjury(player) {
    log(`🤕 ${esc(player.name)} — Verletzung`, 'event');
    const r = await rollD6Visual();
    const slot = POSITIONS[r - 1];
    const c = player.team[slot];
    if (c) {
      replaceStarter(player, slot, 'injury');
      await showEventPopup({
        type: 'red', icon: '🤕', title: T('injury'),
        player: player,
        detail: `${esc(c.name)} (${POS_LABEL[slot]}) verletzt — fällt bis zum nächsten Ligaspiel aus.`
      });
    } else {
      await showEventPopup({
        type: 'red', icon: '🤕', title: T('injury'),
        player: player,
        detail: `Keine Verletzung — ${POS_LABEL[slot]} unbesetzt.`
      });
    }
    refreshTeamPanel();
  }

  // ---- VNL / National Team -----------------------------------------
  async function runVNL(player) {
    log(`🏳️ ${esc(player.name)} — VNL Aufgebot`, 'event');
    // Pick best starter (highest stars) — they miss this week.
    const starters = teamStarters(player.team);
    if (!starters.length) {
      await showEventPopup({type:'blue', icon:'🏳️', title:T('vnl'), player:player,
        detail:'Kein Spieler einberufen.'});
      return;
    }
    const c = starters.reduce((a,b) => (a.stars >= b.stars ? a : b));
    let slot = null;
    for (const p of POSITIONS) if (player.team[p] === c) { slot = p; break; }
    replaceStarter(player, slot, 'vnl');
    await showEventPopup({
      type:'blue', icon:'🏳️', title:T('vnl'), player:player,
      detail:`${esc(c.name)} (${POS_LABEL[slot]}) im Nationalteam — fehlt diese Woche.`
    });
    refreshTeamPanel();
  }

  // ---- Action Card (digital: +5k payout) ---------------------------
  async function runActionCard(player) {
    player.money += 5000;
    log(`⚡ ${esc(player.name)} — Aktionskarte: +5'000`, 'event');
    await showEventPopup({
      type:'green', icon:'⚡', title:T('action'), player:player,
      detail:`+ 5'000 ${T('money')} (Aktion).`
    });
    refreshTopbar();
  }

  // ---- Transfer (in-game auction) ----------------------------------
  async function runTransfer(player) {
    const g = state.game;
    if (!g.auctionDeck.length) {
      log('🔄 Auktionsdeck leer — kein Transfer', 'system');
      return;
    }
    const card = g.auctionDeck.shift();
    log(`🔄 Transfer: ${esc(card.name)} (${stars(card.stars)})`, 'event');

    // Show popup with card visible, bids inside #event-detail.
    const popupP = showEventPopup({
      type:'orange', icon:'🔄', title:T('transfer'), player:player,
      detail: cardHtml(card),
      noAutoClose: true
    });

    // Tiny delay so DOM settles
    await sleep(200);
    // Run auction inside the popup. Use a custom flow tied to event-detail.
    const result = await runInGameAuction(card);
    // Apply result.
    if (result.winner) {
      result.winner.money -= result.bid;
      placeIntoTeamOrBench(result.winner, card);
      log(`💰 ${esc(result.winner.name)} ersteigert ${esc(card.name)} für ${fmtMoney(result.bid)}`, 'event');
    } else {
      g.unsoldMarket.push(card);
      log(`⚠ Transfer ${esc(card.name)} — kein Käufer`, 'system');
    }
    // Close popup if still open.
    closeEventPopup();
    await popupP;
    refreshTopbar();
    refreshTeamPanel();
  }

  // In-game auction inside event-detail.
  async function runInGameAuction(card) {
    const g = state.game;
    const minBid = card.stars * 10000;
    let currentBid = 0;
    let leader = null;
    const passed = new Set();
    // Show a bid container inside event-detail.
    const det = $('#event-detail');
    if (!det) return { winner: null, bid: 0 };
    det.innerHTML += `
      <div style="margin-top:6px;color:var(--silver-2)">Mindestgebot ${fmtMoney(minBid)}</div>
      <div id="event-bids" class="auction-bids" style="width:100%;max-width:420px"></div>
      <div id="event-current-bid" class="ai-bid">— ${T('bid')}</div>
      <div id="event-detail-controls"></div>`;

    function logBid(p, text, classes) {
      const list = $('#event-bids'); if (!list) return;
      const div = document.createElement('div');
      div.className = 'bid-line ' + (classes || '');
      div.innerHTML = `${esc(p.emoji)} ${esc(p.name)} — ${esc(text)}`;
      list.appendChild(div);
      list.scrollTop = list.scrollHeight;
    }
    let safety = 24;
    let order = g.players.slice(g.currentPlayerIdx).concat(g.players.slice(0, g.currentPlayerIdx));
    while (safety-- > 0) {
      const active = order.filter(p => !passed.has(p.id));
      if (active.length <= 1) break;
      let bidThisRound = false;
      for (const p of active) {
        if (passed.has(p.id)) continue;
        const myMin = Math.max(minBid, currentBid + 1000);
        if (p.isHuman) {
          const r = await humanBidPrompt(card, currentBid, myMin, true);
          if (r.pass) { passed.add(p.id); logBid(p, T('pass'), 'passed'); }
          else { currentBid = r.bid; leader = p;
                 logBid(p, fmtMoney(r.bid), 'winning');
                 updateCurrentBid(currentBid, leader);
                 bidThisRound = true; }
        } else {
          await sleep(ms('botBid'));
          let dec = { pass: true };
          try { dec = window.VV_BOTS.shouldBid(p, card, currentBid, myMin,
                  g.players.filter(x => x !== p)) || { pass: true }; }
          catch (e) { dec = { pass: true }; }
          if (dec.bid && (dec.bid < myMin || dec.bid > p.money)) dec = { pass: true };
          if (dec.pass) { passed.add(p.id); logBid(p, T('pass'), 'passed'); }
          else { currentBid = dec.bid; leader = p;
                 logBid(p, fmtMoney(dec.bid), 'winning');
                 updateCurrentBid(currentBid, leader);
                 bidThisRound = true; }
        }
      }
      if (!bidThisRound) break;
    }
    return { winner: leader, bid: currentBid };
  }

  // =================================================================
  // 20. EVENT POPUP (Promise + 8s auto-close + OK/X)
  // =================================================================
  function showEventPopup(opts) {
    return new Promise((resolve) => {
      // Don't show during skip.
      if (state.skipping) { setTimeout(resolve, 0); return; }
      // Remove any existing popup first.
      $$('.event-popup-banner').forEach(el => el.remove());
      const pop = document.createElement('div');
      pop.className = 'event-popup-banner ' + (opts.type || 'gold');
      pop.innerHTML = `
        <button class="epb-close" aria-label="close">✕</button>
        <div class="epb-icon">${opts.icon || '🏐'}</div>
        <div class="epb-text">
          <div class="epb-title">${esc(opts.title || '')}</div>
          ${opts.player ? `<div class="epb-player">${esc(opts.player.emoji||'')} ${esc(opts.player.name||'')}</div>` : ''}
        </div>
        <div id="event-detail" class="epb-detail">${opts.detail || ''}</div>
        ${opts.noAutoClose ? '' : `
          <button class="epb-ok">${T('ok')}</button>
          <div class="epb-progress"><div class="epb-progress-bar"></div></div>`}`;
      document.body.appendChild(pop);

      let resolved = false;
      function done() {
        if (resolved) return;
        resolved = true;
        if (pop.parentNode) pop.parentNode.removeChild(pop);
        resolve();
      }
      pop._eventClose = done;

      pop.querySelector('.epb-close').addEventListener('click', done);
      const ok = pop.querySelector('.epb-ok');
      if (ok) ok.addEventListener('click', done);

      if (!opts.noAutoClose) {
        setTimeout(done, ms('eventAuto'));
      }
      // 30s safety
      setTimeout(done, 30000);
    });
  }

  function closeEventPopup() {
    const pop = $('.event-popup-banner');
    if (pop && typeof pop._eventClose === 'function') pop._eventClose();
    else if (pop) pop.remove();
  }

  // ---- Visual D6 roll for events ------------------------------------
  async function rollD6Visual() {
    diceSetLabel('🎲 D6');
    return await rollDie(6);
  }

  // =================================================================
  // 21. LEAGUE — runLeagueWeek (pairs play classic 12-criteria)
  // =================================================================
  async function runLeagueWeek(triggerPlayer, week) {
    const g = state.game;
    log(`⚽ Ligaspieltag — Woche ${week}`, 'event');
    // Determine pairs. With 4 players, 2 home/away pairs.
    const players = g.players.slice();
    const shuffled = shuffle(players);
    const pairs = [];
    for (let i = 0; i + 1 < shuffled.length; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    }
    if (shuffled.length % 2 === 1) {
      // Bye player
      const bye = shuffled[shuffled.length - 1];
      bye.money += 5000;
      log(`💤 ${esc(bye.name)} hat Bye — +5'000`, 'system');
    }
    for (const pair of pairs) {
      await runMatchClassic(pair[0], pair[1], 'league');
    }
    // After league match, restore sidelined players.
    for (const p of g.players) restoreSidelined(p);
    // Track league-table leader (for super cup next season).
    let leader = g.players.slice().sort((a,b)=>b.lp-a.lp)[0];
    g.leagueWinner = leader;
    refreshTopbar();
    refreshTeamPanel();
  }

  // =================================================================
  // 22. CLASSIC LEAGUE MATCH — 12 criteria, 4 rolls (+2 if crunchtime)
  // =================================================================
  async function runMatchClassic(home, away, kind) {
    log(`⚔ ${esc(home.name)} vs ${esc(away.name)} — ${kind}`, 'match');
    showOpponentBoard(away, home);    // show opponent on board panel
    let homePts = 0, awayPts = 0;
    let extraRolls = 0;
    let crunchUsed = false;
    const used = new Set();

    // Helper: pick a fresh criterion (avoid repeats unless we run out).
    function nextCrit() {
      let attempts = 0;
      let n;
      do { n = rand(1, 12); attempts++; } while (used.has(n) && attempts < 50);
      if (used.has(n)) n = rand(1, 12);
      used.add(n);
      return n;
    }

    let totalRolls = 4;
    for (let r = 0; r < totalRolls; r++) {
      const crit = nextCrit();
      const result = applyCriterion(crit, home, away);
      if (crit === 10 && !crunchUsed) {
        crunchUsed = true;
        totalRolls += 2;
        log('🔥 Crunchtime — 2 weitere Würfe!', 'match');
      }
      if (result.winner === home) { homePts++; }
      else if (result.winner === away) { awayPts++; }
      // Money rain (criterion 12)
      if (crit === 12) { home.money += 5000; away.money += 5000; }
      log(`🏐 K${crit} ${esc(result.text)} → ${homePts}:${awayPts}`, 'match');
      await sleep(ms('rallyView'));
    }

    // Determine outcome.
    let winner = null, isDraw = false;
    if (homePts > awayPts) winner = home;
    else if (awayPts > homePts) winner = away;
    else { isDraw = true; }

    if (kind === 'league') {
      if (isDraw) {
        home.money += 5000; away.money += 5000;
        home.lp += 1; away.lp += 1;
        log(`🤝 Unentschieden ${homePts}:${awayPts} — beide +5'000, +1 LP`, 'match');
      } else {
        winner.money += 10000 + 5000;
        const loser = (winner === home) ? away : home;
        loser.money = Math.max(0, loser.money - 5000);
        winner.lp += 3;
        log(`🏆 ${esc(winner.name)} gewinnt ${homePts}:${awayPts} — +10k +5k`, 'match');
      }
    } else if (kind === 'cup-semi') {
      if (winner) winner.money += 20000;
    } else if (kind === 'cup-final') {
      if (winner) {
        winner.money += 20000;
        winner.vp += 2;
        const loser = winner === home ? away : home;
        loser.vp += 1;
        state.game.cupWinner = winner;
        log(`🏆 ${esc(winner.name)} gewinnt den Pokal! +2 VP`, 'match');
      }
    } else if (kind === 'supercup') {
      if (winner) { winner.money += 15000; log(`🏆 ${esc(winner.name)} — Super Cup!`, 'match'); }
    } else if (kind === 'cl-group') {
      if (winner) winner.money += 20000;
    } else if (kind === 'cl-final') {
      if (winner) { winner.money += 35000; winner.vp += 3;
                    log(`🏆 ${esc(winner.name)} — CL Champion! +3 VP`, 'match'); }
    }

    showMatchResultBanner(winner, isDraw, homePts, awayPts, home, away);
    await sleep(ms('rallyView') + 600);
    closeMatchResultBanner();
    restoreBoardPanel();
    refreshTopbar();
    refreshTeamPanel();
    return { winner, isDraw, homePts, awayPts };
  }

  // ---- Apply a single criterion -------------------------------------
  function applyCriterion(crit, home, away) {
    switch (crit) {
      case 1: { // Total team
        const h = teamStrength(home.team), a = teamStrength(away.team);
        return { winner: h>a?home:(a>h?away:null), text:`Total ${h} vs ${a}` };
      }
      case 2: { // Front-row attackers
        const h = teamFront(home.team).reduce((s,c)=>s+c.stars,0);
        const a = teamFront(away.team).reduce((s,c)=>s+c.stars,0);
        return { winner: h>a?home:(a>h?away:null), text:`Front ${h} vs ${a}` };
      }
      case 3: { // Back-row defenders
        const h = teamBack(home.team).reduce((s,c)=>s+c.stars,0);
        const a = teamBack(away.team).reduce((s,c)=>s+c.stars,0);
        return { winner: h>a?home:(a>h?away:null), text:`Back ${h} vs ${a}` };
      }
      case 4: { // Dice duel
        const h = rand(1,12), a = rand(1,12);
        return { winner: h>a?home:(a>h?away:null), text:`Würfelduell ${h} vs ${a}` };
      }
      case 5: { // Middle blocker
        const h = home.team.middle, a = away.team.middle;
        const hs = h?h.stars:0, as = a?a.stars:0;
        return { winner: hs>as?home:(as>hs?away:null), text:`MB ${hs} vs ${as}` };
      }
      case 6: { // Service: home back-right (libero) vs away libero
        const h = home.team.libero, a = away.team.libero;
        const hs = h?h.stars:0, as = a?a.stars:0;
        return { winner: hs>as?home:(as>hs?away:null), text:`Aufschlag ${hs} vs ${as}` };
      }
      case 7: { // Diagonal + Setter
        const h = (home.team.diagonal?home.team.diagonal.stars:0)+(home.team.setter?home.team.setter.stars:0);
        const a = (away.team.diagonal?away.team.diagonal.stars:0)+(away.team.setter?away.team.setter.stars:0);
        return { winner: h>a?home:(a>h?away:null), text:`OPP+S ${h} vs ${a}` };
      }
      case 8: { // Outside back vs Diagonal
        const h = (home.team.outside2?home.team.outside2.stars:0);
        const a = (away.team.diagonal?away.team.diagonal.stars:0);
        return { winner: h>a?home:(a>h?away:null), text:`OH-back vs OPP ${h} vs ${a}` };
      }
      case 9: { // Block challenge
        const block = (home.team.outside?home.team.outside.stars:0)+(home.team.middle?home.team.middle.stars:0);
        const r = rand(1,12);
        return { winner: block >= r ? home : away, text:`Block ${block} vs Würfel ${r}` };
      }
      case 10: { // Crunchtime — winner is whoever has more total stars now (also +2 rolls)
        const h = teamStrength(home.team), a = teamStrength(away.team);
        return { winner: h>a?home:(a>h?away:null), text:`Crunch ${h} vs ${a}` };
      }
      case 11: { // Injury during match
        const r = rand(1,12);
        const target = r <= 6 ? home : away;
        const starters = teamStarters(target.team);
        if (starters.length) {
          const c = choice(starters);
          let slot = null; for (const p of POSITIONS) if (target.team[p]===c) {slot=p;break;}
          target.team[slot] = null; target.injured.push({card:c, slot:slot});
          // Try to substitute from bench
          const wantPos = (slot==='outside2')?'outside':slot;
          const idx = target.bench.findIndex(b=>b.pos===wantPos);
          if (idx>=0) { target.team[slot] = target.bench.splice(idx,1)[0]; }
          return { winner: null, text:`Verletzung: ${esc(c.name)}` };
        }
        return { winner: null, text:'Keine Verletzung' };
      }
      case 12: { // Money rain
        return { winner: null, text:'Geldregen +5k beide' };
      }
    }
    return { winner: null, text:'??' };
  }

  // ---- Opponent display on the board panel --------------------------
  function showOpponentBoard(opponent, you) {
    const body = $('#gpanel-board-body');
    if (!body) return;
    body.innerHTML = `
      <div class="opponent-display">
        <div class="od-header">⚔ ${esc(opponent.emoji)} ${esc(opponent.name)}</div>
        <div class="od-meta">★ ${teamStrength(opponent.team)} · ${fmtMoney(opponent.money)}</div>
        ${teamPanelHtml(opponent).replace(/<div class="team-actions"[\s\S]*?<\/div>/, '')}
      </div>`;
  }

  function restoreBoardPanel() {
    const body = $('#gpanel-board-body');
    if (!body) return;
    body.innerHTML = `
      <div class="vv-board-wrap" id="vv-board-wrap">
        <div class="vv-board-img"></div>
        <div class="vv-cone" id="vv-cone">
          <svg viewBox="0 0 22 28">
            <polygon class="cone-body" points="11,2 20,24 2,24"/>
            <ellipse class="cone-base" cx="11" cy="24" rx="9" ry="2"/>
          </svg>
        </div>
      </div>`;
    refreshConePosition();
  }

  function showMatchResultBanner(winner, isDraw, h, a, home, away) {
    if (state.skipping) return;
    const human = state.game.players.find(p=>p.isHuman);
    const involved = home === human || away === human;
    let cls = '', title = '';
    if (isDraw) { title = T('draw'); cls = ''; }
    else if (winner === human) { title = T('win'); cls = 'win'; }
    else if (involved) { title = T('loss'); cls = 'loss'; }
    else { title = `${esc(winner.name)} gewinnt`; }
    const banner = document.createElement('div');
    banner.className = 'match-result-banner ' + cls;
    banner.innerHTML = `
      <div class="mrb-title">${title}</div>
      <div class="mrb-score">${h} : ${a}</div>
      <div class="muted">${esc(home.name)} vs ${esc(away.name)}</div>`;
    document.body.appendChild(banner);
  }
  function closeMatchResultBanner() {
    $$('.match-result-banner').forEach(b => b.remove());
  }

  // =================================================================
  // 23. CUP / SUPER CUP / CL
  // =================================================================
  async function runCupSemi(triggerPlayer) {
    const g = state.game;
    log('🏆 Pokal — Halbfinale', 'event');
    // Everyone rolls D12 once; two highest play each other.
    const rolls = g.players.map(p => ({ p, r: rand(1, 12) }));
    rolls.sort((a, b) => b.r - a.r);
    const top2 = rolls.slice(0, 2);
    const semiPlayers = [top2[0].p, top2[1].p];
    log(`Halbfinale: ${esc(semiPlayers[0].name)} vs ${esc(semiPlayers[1].name)}`, 'match');
    const result = await runMatchClassic(semiPlayers[0], semiPlayers[1], 'cup-semi');
    g.cupSemiWinner = result.winner || semiPlayers[0];
  }

  async function runCupFinal(triggerPlayer) {
    const g = state.game;
    if (!g.cupSemiWinner) {
      log('🏆 Pokalfinale — kein Halbfinalsieger', 'system');
      return;
    }
    log('🏆 Pokal — Finale', 'event');
    // Pair semi winner against highest-LP opponent.
    const others = g.players.filter(p => p !== g.cupSemiWinner);
    others.sort((a, b) => b.lp - a.lp);
    const opp = others[0];
    await runMatchClassic(g.cupSemiWinner, opp, 'cup-final');
  }

  async function runSuperCup(triggerPlayer) {
    const g = state.game;
    log('🏆 Super Cup', 'event');
    const a = g.leagueWinner, b = g.cupWinner;
    if (a && b && a !== b) {
      await runMatchClassic(a, b, 'supercup');
    } else if (a) {
      a.money += 15000;
      log(`🏆 ${esc(a.name)} — Super Cup ohne Gegner +15k`, 'match');
    }
  }

  async function runCLGroupStage(triggerPlayer) {
    const g = state.game;
    log('🏆 Champions League — Gruppenphase', 'event');
    // Pair top 2 LP with bottom 2.
    const sorted = g.players.slice().sort((x,y) => y.lp - x.lp);
    if (sorted.length < 4) return;
    await runMatchClassic(sorted[0], sorted[3], 'cl-group');
    await runMatchClassic(sorted[1], sorted[2], 'cl-group');
  }

  // =================================================================
  // 24. SEASON END
  // =================================================================
  async function runSeasonEnd() {
    const g = state.game;
    log('🏁 Saisonende', 'event');
    const ranked = g.players.slice().sort((a, b) =>
      (b.lp - a.lp) || (teamStrength(b.team) - teamStrength(a.team)));
    // VP awards: 1st 3, 2nd 2, 3rd 1, 4th 0
    if (ranked[0]) ranked[0].vp += 3;
    if (ranked[1]) { ranked[1].vp += 2; ranked[1].money += 20000; }
    if (ranked[2]) { ranked[2].vp += 1; ranked[2].money += 30000; }
    if (ranked[3]) { ranked[3].money += 50000; }
    log(`🥇 ${esc(ranked[0].name)} +3VP, 🥈 ${esc(ranked[1].name)} +2VP +20k, 🥉 ${esc(ranked[2].name)} +1VP +30k, 4. ${esc(ranked[3].name)} +50k`, 'event');
    refreshTopbar();

    // Check VP winner now (mid-season trigger handled elsewhere too)
    const winner = g.players.find(p => p.vp >= 8);
    if (winner) { showResultScreen(winner); return; }

    // Drop-off + steal phase
    await runDropOff(ranked);
    await runStealPhase(ranked);

    // New auction (6 cards). 4th place bids first.
    const lot = [];
    while (lot.length < 6 && g.auctionDeck.length) lot.push(g.auctionDeck.shift());
    if (lot.length) {
      log('🪙 Saison-Auktion: 6 neue Karten', 'event');
      const oldStart = g.startingPlayerIdx;
      g.startingPlayerIdx = g.players.indexOf(ranked[3]);
      // Run a round per card, similar to opening but inside an event popup.
      for (const c of lot) {
        const popupP = showEventPopup({
          type:'gold', icon:'🪙', title:'Saison-Auktion',
          player: ranked[3], detail: cardHtml(c), noAutoClose: true
        });
        await sleep(200);
        const result = await runInGameAuction(c);
        if (result.winner) {
          result.winner.money -= result.bid;
          placeIntoTeamOrBench(result.winner, c);
          log(`💰 ${esc(result.winner.name)} ersteigert ${esc(c.name)} für ${fmtMoney(result.bid)}`, 'event');
        } else {
          g.unsoldMarket.push(c);
        }
        closeEventPopup();
        await popupP;
      }
      g.startingPlayerIdx = oldStart;
    }
    // Reset bookkeeping for next season
    g.players.forEach(p => { p.lp = 0; p.injured = []; p.redcards = []; p.vnl = []; });
    g.cupWinner = null;
    g.leagueWinner = null;
  }

  async function runDropOff(ranked) {
    const g = state.game;
    log('📤 Drop-off Phase', 'event');
    for (const p of g.players) {
      // Pick protect
      let protectSlot;
      if (p.isHuman) protectSlot = await humanPickProtect(p);
      else { try { protectSlot = window.VV_BOTS.pickProtect(p) || 'outside'; } catch(e) { protectSlot = 'outside'; } }
      // Roll D6 — that position drops off (unless protected).
      const r = await rollD6Visual();
      const slot = POSITIONS[r - 1];
      if (slot === protectSlot) {
        log(`🛡 ${esc(p.name)} schützt ${POS_LABEL[slot]} — kein Verlust`, 'system');
      } else {
        const c = p.team[slot];
        if (c) {
          p.team[slot] = null;
          g.auctionDeck.push(c);
          log(`📤 ${esc(p.name)} verliert ${esc(c.name)} (${POS_LABEL[slot]})`, 'event');
        } else {
          log(`— ${esc(p.name)} ${POS_LABEL[slot]} unbesetzt`, 'system');
        }
      }
    }
    refreshTopbar(); refreshTeamPanel();
  }

  async function humanPickProtect(player) {
    return new Promise((resolve) => {
      const opts = POSITIONS.filter(p => player.team[p]).map(p => ({
        pos: p, name: player.team[p].name
      }));
      if (!opts.length) { resolve('outside'); return; }
      // Show in event popup with buttons
      const buttonsHtml = opts.map(o =>
        `<button class="vv-btn small" data-protect="${o.pos}">${POS_LABEL[o.pos]} — ${esc(o.name)}</button>`).join('');
      showEventPopup({
        type: 'gold', icon: '🛡', title: T('protect'),
        player: player,
        detail: `<div class="spaced">${buttonsHtml}</div>`,
        noAutoClose: true
      }).then(() => resolve('outside')); // safety
      setTimeout(() => {
        $$('.epb-detail [data-protect]').forEach(b => {
          b.addEventListener('click', () => {
            const slot = b.getAttribute('data-protect');
            closeEventPopup();
            resolve(slot);
          });
        });
      }, 100);
      setTimeout(() => resolve(opts[0].pos), 30000);
    });
  }

  async function runStealPhase(ranked) {
    log('📥 Trade & Steal', 'event');
    const fourth = ranked[3], third = ranked[2], second = ranked[1], first = ranked[0];
    // 4th can steal/swap from 1st OR 2nd
    if (fourth && first) {
      await runOneSteal(fourth, [first, second]);
    }
    // 3rd can steal/swap from 4th
    if (third && fourth) {
      await runOneSteal(third, [fourth]);
    }
    refreshTopbar(); refreshTeamPanel();
  }

  async function runOneSteal(thief, candidates) {
    if (!thief || !candidates.length) return;
    let target = candidates[0];
    let slot = null;
    if (thief.isHuman) {
      // Show event popup to pick target + slot.
      const buttonsHtml = candidates.flatMap(t =>
        POSITIONS.filter(p => t.team[p]).map(p =>
          `<button class="vv-btn small" data-target="${t.id}" data-slot="${p}">${esc(t.name)} → ${POS_LABEL[p]} ${esc(t.team[p].name)}</button>`
        )).join('');
      const det = `<div class="spaced">${buttonsHtml}<button class="vv-btn ghost small" id="steal-skip">${T('cancel')}</button></div>`;
      const popupP = showEventPopup({
        type:'gold', icon:'📥', title:T('steal'), player:thief,
        detail: det, noAutoClose: true
      });
      const choice = await new Promise((res) => {
        setTimeout(() => {
          $$('.epb-detail [data-target]').forEach(b => {
            b.addEventListener('click', () => {
              res({ target: state.game.players.find(p=>p.id===b.getAttribute('data-target')),
                    slot: b.getAttribute('data-slot') });
            });
          });
          const skip = $('#steal-skip');
          if (skip) skip.addEventListener('click', () => res(null));
        }, 100);
        setTimeout(() => res(null), 30000);
      });
      closeEventPopup();
      await popupP;
      if (!choice) return;
      target = choice.target; slot = choice.slot;
    } else {
      // Bot: pick best gain
      let best = null, bestGain = 0;
      for (const cand of candidates) {
        try {
          const sl = window.VV_BOTS.pickSteal(thief, cand);
          if (!sl) continue;
          const theirs = cand.team[sl];
          const mine   = thief.team[sl];
          const gain = (theirs ? theirs.stars : 0) - (mine ? mine.stars : 0);
          if (gain > bestGain) { bestGain = gain; best = { target: cand, slot: sl }; }
        } catch(e) {}
      }
      if (!best) return;
      target = best.target; slot = best.slot;
    }
    if (!target.team[slot]) return;
    // Swap (or steal — keep target's slot empty).
    const got = target.team[slot];
    const offered = thief.team[slot];
    target.team[slot] = offered;
    thief.team[slot] = got;
    log(`📥 ${esc(thief.name)} klaut ${POS_LABEL[slot]} ${esc(got.name)} von ${esc(target.name)}`, 'event');
  }

  // =================================================================
  // 25. MARKET MODAL
  // =================================================================
  function openMarketModal() {
    const g = state.game;
    if (!g) return;
    const human = g.players.find(p => p.isHuman);
    const oneStars = g.oneStarPool.filter(c => !cardOwned(c));
    const unsold = g.unsoldMarket.filter(c => !cardOwned(c));

    const back = document.createElement('div');
    back.className = 'market-modal-back';
    back.innerHTML = `
      <div class="market-modal">
        <h2>🏪 ${T('market')}</h2>
        <p class="muted">${esc(human.name)} — ${fmtMoney(human.money)}</p>
        <div class="market-section">
          <h3>1★ Karten — ${fmtMoney(10000)} pro Karte</h3>
          <div class="market-grid" id="market-1star">
            ${oneStars.map(c =>
              `<div class="market-item" data-id="${esc(c.id)}" data-price="10000">
                ${cardHtml(c)}<span class="price">${fmtMoney(10000)}</span>
              </div>`).join('') || '<span class="muted">leer</span>'}
          </div>
        </div>
        <div class="market-section">
          <h3>Markt — unverkaufte Auktionskarten</h3>
          <div class="market-grid" id="market-unsold">
            ${unsold.map(c =>
              `<div class="market-item" data-id="${esc(c.id)}" data-price="${c.stars*10000}">
                ${cardHtml(c)}<span class="price">${fmtMoney(c.stars*10000)}</span>
              </div>`).join('') || '<span class="muted">leer</span>'}
          </div>
        </div>
        <div class="row-flex" style="justify-content:flex-end;margin-top:10px">
          <button class="vv-btn" id="market-close">${T('cancel')}</button>
        </div>
      </div>`;
    document.body.appendChild(back);

    back.querySelector('#market-close').addEventListener('click', () => back.remove());
    back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
    $$('.market-item', back).forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        const price = parseInt(el.getAttribute('data-price'), 10) || 0;
        if (human.money < price) { log('❌ Zu wenig Geld', 'system'); return; }
        const all = oneStars.concat(unsold);
        const card = all.find(c => c.id === id);
        if (!card) return;
        human.money -= price;
        // Remove from pool
        if (card.stars === 1) g.oneStarPool = g.oneStarPool.filter(x => x.id !== id);
        else g.unsoldMarket = g.unsoldMarket.filter(x => x.id !== id);
        placeIntoTeamOrBench(human, card);
        log(`🏪 ${esc(human.name)} kauft ${esc(card.name)} für ${fmtMoney(price)}`, 'event');
        back.remove();
        refreshTopbar(); refreshTeamPanel();
      });
    });
  }

  // ---- League / Weekend / Event info modals -------------------------
  function openLeagueModal() {
    const g = state.game;
    const sorted = g.players.slice().sort((a,b) => b.lp - a.lp);
    const rows = sorted.map((p, i) => `
      <tr class="${i===0 ? 'gold-row' : ''}">
        <td>${i+1}.</td><td>${esc(p.emoji)} ${esc(p.name)}</td>
        <td>${p.lp}</td><td>${p.vp}</td><td>${fmtMoney(p.money)}</td>
      </tr>`).join('');
    const back = document.createElement('div');
    back.className = 'market-modal-back';
    back.innerHTML = `
      <div class="market-modal">
        <h2>🏆 LIGA — Saison ${g.season}</h2>
        <table class="result-table">
          <thead><tr><th>#</th><th>${T('name')}</th><th>${T('lp')}</th><th>${T('vp')}</th><th>${T('money')}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="row-flex" style="justify-content:flex-end;margin-top:10px">
          <button class="vv-btn" id="league-close">${T('cancel')}</button>
        </div>
      </div>`;
    document.body.appendChild(back);
    back.querySelector('#league-close').addEventListener('click', () => back.remove());
    back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
  }

  function openWeekendModal() {
    const g = state.game;
    const cur = g.players[g.currentPlayerIdx];
    const dayInWeek = (g.coneDay % 8) + 1;
    const back = document.createElement('div');
    back.className = 'market-modal-back';
    back.innerHTML = `
      <div class="market-modal">
        <h2>📅 ${T('week')} ${g.week}/6</h2>
        <p>${T('day')} ${dayInWeek}/8 · Feld ${g.coneDay+1}/48</p>
        <p>Aktiv: ${esc(cur.emoji)} ${esc(cur.name)}</p>
        <p class="muted">Nächster Spieltag wenn Kegel Tag 8 erreicht/passiert.</p>
        <div class="row-flex" style="justify-content:flex-end">
          <button class="vv-btn" id="we-close">${T('cancel')}</button>
        </div>
      </div>`;
    document.body.appendChild(back);
    back.querySelector('#we-close').addEventListener('click', () => back.remove());
    back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
  }

  function openEventInfoModal() {
    const back = document.createElement('div');
    back.className = 'market-modal-back';
    back.innerHTML = `
      <div class="market-modal">
        <h2>🎲 EVENTS</h2>
        <table class="result-table">
          <thead><tr><th>Tag</th><th>Event</th><th>Effekt</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>🟥 Rote Karte</td><td>D6 → Sperre bis nächstes Ligaspiel</td></tr>
            <tr><td>2</td><td>🔄 Transfer</td><td>Karte aus Auktionsdeck — alle bieten</td></tr>
            <tr><td>3</td><td>⚡ Aktion</td><td>+5k</td></tr>
            <tr><td>4</td><td>🏆 Turnier</td><td>Pokal/CL/SuperCup je Woche</td></tr>
            <tr><td>5</td><td>🏳️ VNL</td><td>Stärkster Spieler fehlt diese Woche</td></tr>
            <tr><td>6</td><td>⚡ Aktion</td><td>+5k</td></tr>
            <tr><td>7</td><td>🤕 Verletzung</td><td>D6 → Spieler verletzt</td></tr>
            <tr><td>8</td><td>⚽ Liga</td><td>Pairing & 12-Kriterien Match</td></tr>
          </tbody>
        </table>
        <div class="row-flex" style="justify-content:flex-end;margin-top:10px">
          <button class="vv-btn" id="ev-close">${T('cancel')}</button>
        </div>
      </div>`;
    document.body.appendChild(back);
    back.querySelector('#ev-close').addEventListener('click', () => back.remove());
    back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
  }

  // =================================================================
  // 26. RESULT SCREEN (game won)
  // =================================================================
  function showResultScreen(winner) {
    state.view = 'result';
    const root = $('#vv-app');
    if (!root) return;
    const g = state.game;
    const ranked = g.players.slice().sort((a, b) => b.vp - a.vp);
    root.innerHTML = `
      <div class="result-overlay">
        <div class="result-card">
          <h2>🏆 ${esc(winner.name)} GEWINNT!</h2>
          <p>Sieg mit ${winner.vp} Victory Points nach Saison ${g.season}.</p>
          <table class="result-table">
            <thead><tr><th>#</th><th>${T('name')}</th><th>${T('vp')}</th><th>${T('lp')}</th><th>${T('money')}</th><th>★</th></tr></thead>
            <tbody>
              ${ranked.map((p, i) => `
                <tr class="${i===0?'gold-row':''}">
                  <td>${i+1}.</td><td>${esc(p.emoji)} ${esc(p.name)}</td>
                  <td>${p.vp}</td><td>${p.lp}</td><td>${fmtMoney(p.money)}</td><td>${teamStrength(p.team)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          <div class="row-flex" style="justify-content:flex-end;margin-top:14px">
            <button class="vv-btn primary" id="result-restart">Neues Spiel</button>
          </div>
        </div>
      </div>`;
    $('#result-restart').addEventListener('click', () => {
      state.game = null; state.view = 'splash'; render();
    });
  }

  // =================================================================
  // 27. BOOTSTRAP
  // =================================================================
  document.addEventListener('DOMContentLoaded', () => {
    if (!$('#vv-app')) {
      const div = document.createElement('div');
      div.id = 'vv-app';
      document.body.appendChild(div);
    }
    render();
  });

  // If DOM already ready
  if (document.readyState !== 'loading') {
    if (!$('#vv-app')) {
      const div = document.createElement('div');
      div.id = 'vv-app';
      document.body.appendChild(div);
    }
    render();
  }

  // Expose for debugging.
  window.VV = {
    state, render, log, skipAll,
    POSITIONS, BOARD_GRID,
    rollDie
  };
})();
