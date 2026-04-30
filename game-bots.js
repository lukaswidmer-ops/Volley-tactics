/* =====================================================================
   VOLLEY VENDETTA — Bot AI module
   Loaded BEFORE game.js. Exposes window.VV_BOTS.
   Every function is defensive (null-safe) — a crash returns a "pass"
   result rather than throwing, so the main game loop never hangs.
   ===================================================================== */

(function () {
  'use strict';

  // outside2 is a first-class slot — must appear in every iteration.
  var POSITIONS = ['outside','outside2','middle','setter','diagonal','libero'];

  var PERSONAS = [
    { name: 'Giba',     style: 'aggressive', emoji: '🇧🇷' },
    { name: 'Karch',    style: 'balanced',   emoji: '🇺🇸' },
    { name: 'Stanley',  style: 'defensive',  emoji: '🇺🇸' },
    { name: 'Mikasa',   style: 'aggressive', emoji: '🇯🇵' },
    { name: 'Heynen',   style: 'tactical',   emoji: '🇧🇪' },
    { name: 'Berruto',  style: 'tactical',   emoji: '🇮🇹' },
    { name: 'Anastasi', style: 'aggressive', emoji: '🇮🇹' },
    { name: 'Velasco',  style: 'balanced',   emoji: '🇦🇷' }
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pickPersonas(n) {
    return shuffle(PERSONAS).slice(0, n);
  }

  // Map a card position to which slot on this bot's team it would land.
  // Outside cards prefer outside, then outside2.
  function targetSlotFor(bot, cardPos) {
    if (!bot || !bot.team || !cardPos) return cardPos || 'outside';
    if (cardPos === 'outside') {
      if (!bot.team.outside)  return 'outside';
      if (!bot.team.outside2) return 'outside2';
      // Both filled — still report 'outside' so caller can compare strength.
      return 'outside';
    }
    return cardPos;
  }

  function slotCard(bot, slot) {
    if (!bot || !bot.team) return null;
    return bot.team[slot] || null;
  }

  // Returns {bid: number} or {pass: true}.
  function shouldBid(bot, card, currentBid, minBid, opponents) {
    try {
      if (!bot || !card) return { pass: true };
      var money = (bot.money || 0);
      var stars = card.stars || 1;

      // Decide the slot this card would fill.
      var slot = targetSlotFor(bot, card.pos);
      var existing = slotCard(bot, slot);
      var bothOH = (card.pos === 'outside'
                    && bot.team && bot.team.outside && bot.team.outside2);

      // Need ratio: 0 = empty slot, 0.5 = upgrade by 1 star, 1+ = stronger.
      var need;
      if (!existing) need = 1.0;
      else if (bothOH) {
        // Both OH slots full — replace weaker one.
        var weaker = (bot.team.outside.stars <= bot.team.outside2.stars)
                     ? bot.team.outside : bot.team.outside2;
        need = stars > weaker.stars ? 0.6 : 0;
      } else {
        need = stars > existing.stars ? 0.5 : 0;
      }

      if (need <= 0) return { pass: true };

      var styleMul =
        bot.style === 'aggressive' ? 1.25 :
        bot.style === 'defensive'  ? 0.85 :
        bot.style === 'tactical'   ? 1.05 : 1.0;

      // Maximum we're willing to pay: roughly need * stars * 12k * style.
      var ceiling = Math.floor(need * stars * 12000 * styleMul);
      // Hard cap: keep at least 10k cushion for the rest of the season.
      ceiling = Math.min(ceiling, Math.max(0, money - 10000));

      var next = Math.max(minBid || 0, (currentBid || 0) + 1000);
      if (next > ceiling) return { pass: true };

      // Slight random raise so bots don't always bid identical amounts.
      var raise = Math.floor(Math.random() * 3) * 1000;
      var bid = Math.min(ceiling, next + raise);
      return { bid: bid };
    } catch (e) {
      return { pass: true };
    }
  }

  // Pick one card to buy from a market list, or null. Market = array of cards.
  function pickMarketBuy(bot, market) {
    try {
      if (!bot || !market || !market.length) return null;
      var money = bot.money || 0;
      // Sort candidates by perceived upgrade value.
      var ranked = market
        .map(function (c) {
          var slot = targetSlotFor(bot, c.pos);
          var ex = slotCard(bot, slot);
          var price = (c.stars || 1) === 1 ? 10000 : (c.stars * 10000);
          var gain = ex ? Math.max(0, c.stars - ex.stars) : c.stars;
          return { card: c, price: price, gain: gain };
        })
        .filter(function (r) { return r.gain > 0 && r.price <= money - 5000; })
        .sort(function (a, b) { return b.gain - a.gain; });
      return ranked.length ? ranked[0].card : null;
    } catch (e) {
      return null;
    }
  }

  // Which position to protect at season-end drop-off.
  function pickProtect(bot) {
    try {
      if (!bot || !bot.team) return 'outside';
      var best = null, bestStars = -1;
      for (var i = 0; i < POSITIONS.length; i++) {
        var p = POSITIONS[i];
        var c = bot.team[p];
        if (c && c.stars > bestStars) { bestStars = c.stars; best = p; }
      }
      return best || 'outside';
    } catch (e) { return 'outside'; }
  }

  // Pick which position to steal from another player. Largest gap = best.
  function pickSteal(bot, fromPlayer) {
    try {
      if (!bot || !bot.team || !fromPlayer || !fromPlayer.team) return null;
      var best = null, bestGain = 0;
      for (var i = 0; i < POSITIONS.length; i++) {
        var p = POSITIONS[i];
        var theirs = fromPlayer.team[p];
        var mine   = bot.team[p];
        if (!theirs) continue;
        var gain = (theirs.stars || 0) - (mine ? mine.stars : 0);
        if (gain > bestGain) { bestGain = gain; best = p; }
      }
      return best;
    } catch (e) { return null; }
  }

  window.VV_BOTS = {
    POSITIONS:      POSITIONS,
    pickPersonas:   pickPersonas,
    shouldBid:      shouldBid,
    pickMarketBuy:  pickMarketBuy,
    pickProtect:    pickProtect,
    pickSteal:      pickSteal,
    targetSlotFor:  targetSlotFor
  };
})();
