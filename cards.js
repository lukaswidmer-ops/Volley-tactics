/* ===========================================================
   VOLLEY VENDETTA — Card Database
   -----------------------------------------------------------
   Each card: { id, name, pos, stars, url, nation }
   Positions: 'outside' | 'middle' | 'setter' | 'diagonal' | 'libero'
   URL pattern: cards/<slug>-<stars>star.jpg

   The image already shows name / stars / stats / position, so the
   game does NOT render any star overlay on top of the card art.
   =========================================================== */

(function () {
  'use strict';

  // Slugify a name into a safe filename component.
  function slug(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Master roster. Mix of real-ish volleyball player surnames spread across
  // positions and star bands, plus generic fillers so every position has
  // enough depth for a 4-player season-long economy.
  //
  // Format per row:  [name, position, stars, nation]
  const ROSTER = [
    // --- OUTSIDE HITTERS (red) ----------------------------------------
    ['Earvin Ngapeth',     'outside',  5, 'FR'],
    ['Wilfredo Leon',      'outside',  5, 'PL'],
    ['Yuji Nishida',       'outside',  4, 'JP'],
    ['Ricardo Lucarelli',  'outside',  4, 'BR'],
    ['Aaron Russell',      'outside',  4, 'US'],
    ['Tomas Kooy',         'outside',  3, 'NL'],
    ['Tine Urnaut',        'outside',  3, 'SI'],
    ['Klemen Cebulj',      'outside',  3, 'SI'],
    ['Mikhail Karpov',     'outside',  3, 'RU'],
    ['Oleh Plotnytskyi',   'outside',  2, 'UA'],
    ['Kamil Semeniuk',     'outside',  2, 'PL'],
    ['Yacine Louati',      'outside',  2, 'FR'],
    ['Trevor Clevenot',    'outside',  2, 'FR'],
    ['Petar Krsmanovic',   'outside',  2, 'RS'],
    ['Stefan Chrtiansky',  'outside',  2, 'SK'],
    ['Carlos Ramos',       'outside',  1, 'CU'],
    ['Lukas Berger',       'outside',  1, 'AT'],
    ['Dmitry Volkov',      'outside',  1, 'RU'],
    ['Marek Beer',         'outside',  1, 'CZ'],
    ['Adrien Rouzier',     'outside',  1, 'FR'],
    ['Sven Hoffmann',      'outside',  1, 'DE'],
    ['Jiri Sramek',        'outside',  1, 'CZ'],

    // --- MIDDLE BLOCKERS (green) ---------------------------------------
    ['Robertlandy Simon',  'middle',   5, 'CU'],
    ['Lucas Saatkamp',     'middle',   4, 'BR'],
    ['Srecko Lisinac',     'middle',   4, 'RS'],
    ['Max Holt',           'middle',   3, 'US'],
    ['Roberto Russo',      'middle',   3, 'IT'],
    ['Dmytro Pashytskyy',  'middle',   3, 'UA'],
    ['Jakub Kochanowski',  'middle',   2, 'PL'],
    ['Karol Klos',         'middle',   2, 'PL'],
    ['Mateusz Bieniek',    'middle',   2, 'PL'],
    ['Ali Ramazani',       'middle',   2, 'IR'],
    ['Marko Podrascanin',  'middle',   2, 'RS'],
    ['Erik Schöll',        'middle',   1, 'AT'],
    ['Sam Deroo',          'middle',   1, 'BE'],
    ['Pawel Maslowski',    'middle',   1, 'PL'],
    ['Tobias Krick',       'middle',   1, 'DE'],
    ['Filip Sestan',       'middle',   1, 'HR'],
    ['Anton Brehme',       'middle',   1, 'DE'],

    // --- SETTERS (light blue) ------------------------------------------
    ['Bruno Rezende',      'setter',   5, 'BR'],
    ['Micah Christenson',  'setter',   4, 'US'],
    ['Fabio De Cecco',     'setter',   4, 'IT'],
    ['Igor Kolakovic',     'setter',   3, 'RS'],
    ['Antoine Brizard',    'setter',   3, 'FR'],
    ['Salvador Hidalgo',   'setter',   3, 'AR'],
    ['Dragan Travica',     'setter',   2, 'IT'],
    ['Pierre Pujol',       'setter',   2, 'FR'],
    ['Marcin Janusz',      'setter',   2, 'PL'],
    ['Lukas Kampa',        'setter',   2, 'DE'],
    ['Konstantin Bakun',   'setter',   1, 'RU'],
    ['Roland Heyer',       'setter',   1, 'CH'],
    ['Marius Wlazly',      'setter',   1, 'PL'],
    ['Tomas Rousseaux',    'setter',   1, 'BE'],

    // --- DIAGONALS / OPPOSITES (dark blue) -----------------------------
    ['Ivan Zaytsev',       'diagonal', 5, 'IT'],
    ['Bartosz Kurek',      'diagonal', 4, 'PL'],
    ['Yoandy Leal',        'diagonal', 4, 'BR'],
    ['Aleksandar Atanasijevic','diagonal', 3, 'RS'],
    ['Renee Teppan',       'diagonal', 3, 'EE'],
    ['Tsvetan Sokolov',    'diagonal', 3, 'BG'],
    ['Maxwell Holt',       'diagonal', 2, 'US'],
    ['Pavel Pankov',       'diagonal', 2, 'RU'],
    ['Felix Fischer',      'diagonal', 2, 'DE'],
    ['Damiano Catania',    'diagonal', 2, 'IT'],
    ['Adrian Aciobanitei', 'diagonal', 2, 'RO'],
    ['Kasper Kraemer',     'diagonal', 1, 'DK'],
    ['Niels Klapwijk',     'diagonal', 1, 'NL'],
    ['Jure Okrosa',        'diagonal', 1, 'SI'],
    ['Andrija Geric',      'diagonal', 1, 'RS'],
    ['Lukas Maase',        'diagonal', 1, 'DE'],

    // --- LIBEROS (yellow) ----------------------------------------------
    ['Jenia Grebennikov',  'libero',   5, 'FR'],
    ['Erik Shoji',         'libero',   4, 'US'],
    ['Massimo Colaci',     'libero',   3, 'IT'],
    ['Pawel Zatorski',     'libero',   3, 'PL'],
    ['Salvador Saenz',     'libero',   2, 'CU'],
    ['Jose Massa',         'libero',   2, 'AR'],
    ['Dustin Watten',      'libero',   2, 'US'],
    ['Damir Petric',       'libero',   2, 'HR'],
    ['Ferdinand Tille',    'libero',   1, 'DE'],
    ['Markus Steuerwald',  'libero',   1, 'DE'],
    ['Tomas Hudacek',      'libero',   1, 'SK'],
    ['Yevhen Konovalov',   'libero',   1, 'UA'],
    ['Ola Holm',           'libero',   1, 'NO'],
    ['Petar Petric',       'libero',   1, 'BA']
  ];

  function buildAllCards() {
    const out = [];
    let id = 1;
    for (const row of ROSTER) {
      const [name, pos, stars, nation] = row;
      const url = 'cards/' + slug(name) + '-' + stars + 'star.jpg';
      out.push({
        id: 'c' + (id++),
        name: name,
        pos: pos,
        stars: stars,
        url: url,
        nation: nation
      });
    }
    return out;
  }

  // Expose for game.js (loaded later as a separate <script>).
  if (typeof window !== 'undefined') {
    window.buildAllCards = buildAllCards;
    // Keep a snapshot too — handy for debugging in the console.
    window.VV_CARDS_DB = buildAllCards();
  }
  // Node test harness compatibility.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildAllCards: buildAllCards };
  }
})();
