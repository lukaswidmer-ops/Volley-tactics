/* ================================================================
   VOLLEY VENDETTA — Bot AI module
   Loaded via <script src="game-bots.js"> before game.js.
   Exposes window.VV_BOTS.
   ================================================================ */
(function () {
'use strict';

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

// Auction bidding logic.
// Inputs: bot (player object), card (the card up for auction),
//         currentBid (current highest bid number, may be 0 if none),
//         currentHigh (player object holding current high bid, or null),
//         minBid (current minimum bid)
// Returns: { bid: number, pass: boolean }
function shouldBid(bot, card, currentBid, minBid, opponents) {
  if (bot.money < minBid) return { pass: true };
  const stars = card.stars;
  const fairValue = stars * 11000;       // bot's fair-value estimate
  const cap = Math.min(bot.money * 0.8, fairValue + 5000); // never overbid
  // Bots prefer their bias position and weakest position
  const weakStars = (bot.team[card.pos] && bot.team[card.pos].stars) || 0;
  let bias = 0;
  if (card.pos === bot.biasPos) bias += 8000;
  if (weakStars < stars) bias += (stars - weakStars) * 4000; // upgrade incentive
  // Personality
  if (bot.personality === 'aggressive') bias += 4000;
  if (bot.personality === 'defensive')  bias -= 4000;
  const willingness = cap + bias;
  if (minBid > willingness) return { pass: true };
  // Bid a small increment over the min — bots don't snipe at the cap unless pushed
  const inc = stars >= 4 ? 5000 : 2000;
  let bid = Math.max(minBid, currentBid + inc);
  bid = Math.min(bid, willingness, bot.money);
  // round to nearest 1000
  bid = Math.round(bid / 1000) * 1000;
  if (bid <= currentBid) return { pass: true };
  return { bid };
}

// Market upgrade decision (between weeks)
function pickMarketBuy(bot, market) {
  const order = ['outside','middle','setter','diagonal','libero'];
  let bestPos = order[0], minStars = Infinity;
  for (const k of order) {
    const s = (bot.team[k] && bot.team[k].stars) || 0;
    if (s < minStars) { minStars = s; bestPos = k; }
  }
  const candidates = market.filter(c => c.pos === bestPos && c.price <= bot.money && c.stars > minStars);
  candidates.sort((a,b) => b.stars - a.stars);
  if (candidates.length && Math.random() < 0.85) return candidates[0];
  return null;
}

// At season end: pick the card to protect (always protect highest star value)
function pickProtect(bot) {
  const cards = ['outside','middle','setter','diagonal','libero']
    .map(k => ({ pos:k, card: bot.team[k] }))
    .filter(x => x.card);
  cards.sort((a,b) => b.card.stars - a.card.stars);
  return cards[0] ? cards[0].pos : null;
}

// Steal phase: pick the best upgrade
function pickSteal(bot, fromPlayer) {
  const order = ['outside','middle','setter','diagonal','libero'];
  let best = null, bestDelta = 0;
  for (const k of order) {
    const myStars  = (bot.team[k] && bot.team[k].stars) || 0;
    const theirStars = (fromPlayer.team[k] && fromPlayer.team[k].stars) || 0;
    const delta = theirStars - myStars;
    if (delta > bestDelta) { bestDelta = delta; best = k; }
  }
  return best;
}

window.VV_BOTS = {
  PERSONAS,
  pickPersonas,
  shouldBid,
  pickMarketBuy,
  pickProtect,
  pickSteal,
};
})();
