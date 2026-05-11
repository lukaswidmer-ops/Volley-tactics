/**
 * Read-only Spiegelung der Sammellogik aus game.js → assertNoDuplicates()
 * (Reihenfolge der Quellen identisch halten.)
 */
import { POSITIONS } from './constants.mjs';

export function collectAllCardRefs(game) {
  const collect = [];
  const push = (c) => {
    if (c && c.id) collect.push(c);
  };
  if (!game || !Array.isArray(game.players)) return collect;
  for (const p of game.players) {
    for (const pos of POSITIONS) push(p.team && p.team[pos]);
    for (const c of (p.bench || [])) push(c);
    for (const e of (p.suspended || [])) if (e && e.card) push(e.card);
  }
  for (const c of (game.marketPile || [])) push(c);
  for (const c of (game.auctionDeck || [])) push(c);
  for (const c of (game._draftDeck || [])) push(c);
  return collect;
}

/**
 * Wie game.js assertNoDuplicates: gleiche id mit unterschiedlichen Objekten → Duplikat.
 * (Zwei Mal dieselbe Referenz in collect würde dort ebenfalls nicht als zweites Objekt gemeldet —
 * dafür ist findDuplicateObjectRefs.)
 */
export function findDuplicateIds(collect) {
  const firstById = new Map();
  const dup = [];
  for (const card of collect) {
    if (firstById.has(card.id) && firstById.get(card.id) !== card) {
      if (!dup.includes(card.id)) dup.push(card.id);
    } else if (!firstById.has(card.id)) {
      firstById.set(card.id, card);
    }
  }
  return dup;
}

/** Dieselbe Objektreferenz kommt mehrfach in der flachen Liste vor (z. B. eine Karte in zwei Pools). */
export function findDuplicateObjectRefs(collect) {
  const seen = new Set();
  const dupRefs = [];
  for (const card of collect) {
    if (seen.has(card)) dupRefs.push(card);
    else seen.add(card);
  }
  return dupRefs;
}

export function scanGameForDuplicateIds(game) {
  return findDuplicateIds(collectAllCardRefs(game));
}
