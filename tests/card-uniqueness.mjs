/**
 * Karten-Eindeutigkeit: Unit-Checks (Node, ohne vollständiges game.js).
 *
 * Ausführen: npm test   oder   node tests/card-uniqueness.mjs
 */
import { createRequire } from 'module';
import {
  scanGameForDuplicateIds,
  collectAllCardRefs,
  findDuplicateObjectRefs,
} from './lib/card-uniqueness-scan.mjs';

const require = createRequire(import.meta.url);

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function makePlayer(team = {}, bench = []) {
  return { team: { ...team }, bench: [...bench], suspended: [] };
}

function emptyGame(extra = {}) {
  return {
    players: [],
    marketPile: [],
    auctionDeck: [],
    _draftDeck: [],
    ...extra,
  };
}

// --- 1) Leerer State
{
  const d = scanGameForDuplicateIds(emptyGame({ players: [makePlayer()] }));
  assert(d.length === 0, 'Leerer Kader darf keine Duplikate melden');
}

// --- 2) Gleiche id, zwei Objekte (Team + Auktionsdeck) → Duplikat (wie assertNoDuplicates)
{
  const c1 = { id: 'x1', name: 'Test', stars: 3, pos: 'setter' };
  const c2 = { id: 'x1', name: 'Test-Kopie', stars: 3, pos: 'setter' };
  const g = emptyGame({
    players: [makePlayer({ setter: c1 })],
    auctionDeck: [c2],
  });
  const d = scanGameForDuplicateIds(g);
  assert(d.includes('x1'), 'Gleiche id in Team und auctionDeck muss erkannt werden');
}

// --- 2b) Dieselbe Referenz zweimal in collect → Hilfsfunktion findDuplicateObjectRefs
{
  const c = { id: 'r1', name: 'Ref', stars: 2, pos: 'middle' };
  const refs = collectAllCardRefs(
    emptyGame({ players: [makePlayer({ middle: c })], auctionDeck: [c] })
  );
  const bad = findDuplicateObjectRefs(refs);
  assert(bad.length >= 1, 'Gleiche Referenz in Team und Deck muss in der Ref-Liste vorkommen');
}

// --- 3) Zwei Objekte, gleiche id → Duplikat
{
  const a = { id: 'y1', name: 'A', stars: 2, pos: 'libero' };
  const b = { id: 'y1', name: 'B', stars: 2, pos: 'libero' };
  const g = emptyGame({
    players: [
      makePlayer({ libero: a }),
      makePlayer({ libero: b }),
    ],
  });
  const d = scanGameForDuplicateIds(g);
  assert(d.includes('y1'), 'Gleiche id auf zwei Teams muss erkannt werden');
}

// --- 4) Echte Roster-Karten: disjunkte Hälften → keine Überschneidung der ids
{
  const { buildAllCards } = require('../cards.js');
  const all = buildAllCards();
  assert(all.length > 10, 'Roster sollte Karten liefern');
  const mid = Math.floor(all.length / 2);
  const left = all.slice(0, mid);
  const right = all.slice(mid);
  const idsLeft = new Set(left.map((c) => c.id));
  for (const c of right) assert(!idsLeft.has(c.id), 'Split darf keine id doppeln');

  const g = emptyGame({
    players: [
      makePlayer({}, left),
      makePlayer({}, right),
    ],
  });
  const d = scanGameForDuplicateIds(g);
  assert(d.length === 0, `Disjunkte Bänke: erwartet 0 Duplikate, bekam ${JSON.stringify(d)}`);
}

// --- 5) Simulierter Draft-Pool + Auktionsdeck nach Draft-Logik (kein Überlapp mit Besitz)
{
  const { buildAllCards } = require('../cards.js');
  const all = buildAllCards();
  const owned = new Set();
  const drafted = [];
  for (const c of all) {
    if (c.stars >= 2 && c.stars <= 4 && drafted.length < 12) {
      drafted.push(c);
      owned.add(c.id);
    }
  }
  const auctionDeck = all.filter((c) => c.stars >= 2 && !owned.has(c.id));
  const g = emptyGame({
    players: [makePlayer({}, drafted)],
    auctionDeck,
    _draftDeck: [],
  });
  const d = scanGameForDuplicateIds(g);
  assert(d.length === 0, `Nach simuliertem Draft+Auktionsliste: 0 Duplikate, bekam ${JSON.stringify(d)}`);
  assert(
    collectAllCardRefs(g).length === drafted.length + auctionDeck.length,
    'Alle Referenzen müssen im Scan vorkommen'
  );
}

console.log('OK: tests/card-uniqueness.mjs — alle Eindeutigkeits-Checks bestanden.');
