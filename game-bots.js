/* ================================================================
   VOLLEY VENDETTA — Bot AI module
   Loaded via <script src="game-bots.js"> before game.js.
   Exposes window.VV_BOTS.
   ================================================================ */
(function () {
'use strict';

const POSITIONS = ['outside','outside2','middle','setter','diagonal','libero'];

const PERSONAS = [
  { name: 'Karch',    color: '#0ea5e9', emoji: '🔵', personality: 'aggressive', biasPos: 'outside' },
  { name: 'Giba',     color: '#16a34a', emoji: '🟢', personality: 'balanced',   biasPos: 'middle'  },
  { name: 'Zaitsev',  color: '#a855f7', emoji: '🟣', personality: 'defensive',  biasPos: 'libero'  },
  { name: 'Earvin',   color: '#e84317', emoji: '🔴', personality: 'aggressive', biasPos: 'diagonal'},
  { name: 'Wilfredo', color: '#facc15', emoji: '🟡', personality: 'balanced',   biasPos: 'setter'  },
  { name: 'Saeid',    color: '#f97316', emoji: '🟠', personality: 'aggressive', biasPos: 'outside' },
];

function pickPersonas(n) {
  const pool = PERSONAS.slice().sort(()=>Math.random()-0.5);
  return pool.slice(0, n);
}

// Map a card's pos to the slot the bot would actually fill.
// For outside cards: try outside first, then outside2.
function targetSlotFor(bot, cardPos) {
  if (cardPos === 'outside') {
    if (!bot.team.outside) return 'outside';
    if (!bot.team.outside2) return 'outside2';
    // both filled — would replace weaker
    const s1 = bot.team.outside.stars || 0;
    const s2 = bot.team.outside2.stars || 0;
    return s1 <= s2 ? 'outside' : 'outside2';
  }
  return cardPos;
}

function shouldBid(bot, card, currentBid, minBid, opponents) {
  if (!bot || !card) return { pass: true };
  if (bot.money < minBid) return { pass: true };
  const stars = card.stars;
  const fairValue = stars * 11000;
  const cap = Math.min(bot.money * 0.8, fairValue + 5000);
  // Determine which slot this would target
  const slot = targetSlotFor(bot, card.pos);
  const weakStars = (bot.team[slot] && bot.team[slot].stars) || 0;
  let bias = 0;
  if (card.pos === bot.biasPos) bias += 8000;
  if (weakStars < stars) bias += (stars - weakStars) * 4000;
  if (bot.personality === 'aggressive') bias += 4000;
  if (bot.personality === 'defensive')  bias -= 4000;
  const willingness = cap + bias;
  if (minBid > willingness) return { pass: true };
  const inc = stars >= 4 ? 5000 : 2000;
  let bid = Math.max(minBid, currentBid + inc);
  bid = Math.min(bid, willingness, bot.money);
  bid = Math.round(bid / 1000) * 1000;
  if (bid <= currentBid) return { pass: true };
  return { bid };
}

function pickMarketBuy(bot, market) {
  if (!bot || !market || !market.length) return null;
  // Find weakest position (treat outside slots independently)
  let bestPos = 'outside', minStars = Infinity;
  for (const k of POSITIONS) {
    const s = (bot.team[k] && bot.team[k].stars) || 0;
    if (s < minStars) { minStars = s; bestPos = k; }
  }
  // Map slot back to card.pos for matching
  const cardPosNeeded = bestPos === 'outside2' ? 'outside' : bestPos;
  const candidates = market.filter(c => c.pos === cardPosNeeded && c.price <= bot.money && c.stars > minStars);
  candidates.sort((a,b) => b.stars - a.stars);
  if (candidates.length && Math.random() < 0.85) return candidates[0];
  return null;
}

function pickProtect(bot) {
  if (!bot) return null;
  const cards = POSITIONS
    .map(k => ({ pos:k, card: bot.team[k] }))
    .filter(x => x.card);
  cards.sort((a,b) => (b.card.stars||0) - (a.card.stars||0));
  return cards[0] ? cards[0].pos : null;
}

function pickSteal(bot, fromPlayer) {
  if (!bot || !fromPlayer) return null;
  let best = null, bestDelta = 0;
  for (const k of POSITIONS) {
    const myStars  = (bot.team[k] && bot.team[k].stars) || 0;
    const theirStars = (fromPlayer.team[k] && fromPlayer.team[k].stars) || 0;
    const delta = theirStars - myStars;
    if (delta > bestDelta) { bestDelta = delta; best = k; }
  }
  return best;
}

window.VV_BOTS = {
  PERSONAS,
  POSITIONS,
  pickPersonas,
  shouldBid,
  pickMarketBuy,
  pickProtect,
  pickSteal,
  targetSlotFor,
};
})();
