/**
 * Lädt cards.js in einer Browser-ähnlichen Umgebung.
 * Nutzt jsdom falls installiert (`npm install`), sonst minimales window-Stub.
 *
 * Ausführen: npm run test:jsdom
 */
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let teardown = () => {};

try {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.navigator = dom.window.navigator;
  teardown = () => {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.navigator;
  };
  console.log('(jsdom geladen)');
} catch {
  globalThis.window = {};
  globalThis.document = { createElement: () => ({}) };
  teardown = () => {
    delete globalThis.window;
    delete globalThis.document;
  };
  console.log('(jsdom nicht installiert — minimales window-Stub, `npm install` für vollen jsdom-Test)');
}

require('../cards.js');
const { buildAllCards } = require('../cards.js');
const cards = buildAllCards();

if (!Array.isArray(cards) || cards.length < 50) {
  throw new Error(`Erwartet großen Roster, erhalten: ${cards && cards.length}`);
}
if (!cards[0].id || !cards[0].pos) {
  throw new Error('Kartenobjekt fehlt id/pos');
}

teardown();
console.log('OK: tests/jsdom-smoke.mjs — cards.js (' + cards.length + ' Karten).');
