/* ===========================================================
   VOLLEY VENDETTA — Card Database
   -----------------------------------------------------------
   Each card: { id, name, pos, stars, url, nation }
   Positions: 'outside' | 'middle' | 'setter' | 'diagonal' | 'libero'

   URLs point directly to the real card image files.
   File naming pattern: cards/<pos>_NN.XStern.png
   =========================================================== */

(function () {
  'use strict';

  // ROSTER: [name, position, stars, nation, filename]
  // Filenames match the actual files in the cards/ folder exactly.
  // NOTE: diagonal_04 does not exist (skip); diagonal_16 has typo "Sterng" — kept as-is.
  const ROSTER = [

    // --- OUTSIDE HITTERS (red) — 29 cards ----------------------------
    // 1-star (7)
    ['Carlos Ramos',            'outside',  1, 'CU', 'outside_01.1Stern.png'],
    ['Lukas Berger',            'outside',  1, 'AT', 'outside_02.1Stern.png'],
    ['Dmitry Volkov',           'outside',  1, 'RU', 'outside_03.1Stern.png'],
    ['Marek Beer',              'outside',  1, 'CZ', 'outside_04.1Stern.png'],
    ['Adrien Rouzier',          'outside',  1, 'FR', 'outside_05.1Stern.png'],
    ['Sven Hoffmann',           'outside',  1, 'DE', 'outside_06.1Stern.png'],
    ['Jiri Sramek',             'outside',  1, 'CZ', 'outside_07.1Stern.png'],
    // 2-star (5)
    ['Oleh Plotnytskyi',        'outside',  2, 'UA', 'outside_08.2Stern.png'],
    ['Kamil Semeniuk',          'outside',  2, 'PL', 'outside_09.2Stern.png'],
    ['Yacine Louati',           'outside',  2, 'FR', 'outside_10.2Stern.png'],
    ['Trevor Clevenot',         'outside',  2, 'FR', 'outside_11.2Stern.png'],
    ['Petar Krsmanovic',        'outside',  2, 'RS', 'outside_12.2Stern.png'],
    // 3-star (8)
    ['Stefan Chrtiansky',       'outside',  3, 'SK', 'outside_13.3Stern.png'],
    ['Tomas Kooy',              'outside',  3, 'NL', 'outside_14.3Stern.png'],
    ['Tine Urnaut',             'outside',  3, 'SI', 'outside_15.3Stern.png'],
    ['Klemen Cebulj',           'outside',  3, 'SI', 'outside_16.3Stern.png'],
    ['Mikhail Karpov',          'outside',  3, 'RU', 'outside_17.3Stern.png'],
    ['Alexei Verbov',           'outside',  3, 'RU', 'outside_18.3Stern.png'],
    ['Ivan Zenit',              'outside',  3, 'HR', 'outside_19.3Stern.png'],
    ['Marco Bari',              'outside',  3, 'IT', 'outside_20.3Stern.png'],
    // 4-star (5)
    ['Yuji Nishida',            'outside',  4, 'JP', 'outside_21.4Stern.png'],
    ['Ricardo Lucarelli',       'outside',  4, 'BR', 'outside_22.4Stern.png'],
    ['Aaron Russell',           'outside',  4, 'US', 'outside_23.4Stern.png'],
    ['Tom Haack',               'outside',  4, 'DE', 'outside_24.4Stern.png'],
    ['Matt Anderson',           'outside',  4, 'US', 'outside_25.4Stern.png'],
    // 5-star (4)
    ['Earvin Ngapeth',          'outside',  5, 'FR', 'outside_26.5Stern.png'],
    ['Wilfredo Leon',           'outside',  5, 'PL', 'outside_27.5Stern.png'],
    ['Yuki Ishikawa',           'outside',  5, 'JP', 'outside_28.5Stern.png'],
    ['Luka Vukovic',            'outside',  5, 'RS', 'outside_29.5Stern.png'],

    // --- MIDDLE BLOCKERS (green) — 25 cards --------------------------
    // 1-star (7)
    ['Erik Schöll',             'middle',   1, 'AT', 'middle_01.1Stern.png'],
    ['Sam Deroo',               'middle',   1, 'BE', 'middle_02.1Stern.png'],
    ['Pawel Maslowski',         'middle',   1, 'PL', 'middle_03.1Stern.png'],
    ['Tobias Krick',            'middle',   1, 'DE', 'middle_04.1Stern.png'],
    ['Filip Sestan',            'middle',   1, 'HR', 'middle_05.1Stern.png'],
    ['Anton Brehme',            'middle',   1, 'DE', 'middle_06.1Stern.png'],
    ['Niko Zuber',              'middle',   1, 'CH', 'middle_07.1Stern.png'],
    // 2-star (4)
    ['Jakub Kochanowski',       'middle',   2, 'PL', 'middle_08.2Stern.png'],
    ['Karol Klos',              'middle',   2, 'PL', 'middle_09.2Stern.png'],
    ['Mateusz Bieniek',         'middle',   2, 'PL', 'middle_10.2Stern.png'],
    ['Ali Ramazani',            'middle',   2, 'IR', 'middle_11.2Stern.png'],
    // 3-star (5)
    ['Marko Podrascanin',       'middle',   3, 'RS', 'middle_12.3Stern.png'],
    ['Max Holt',                'middle',   3, 'US', 'middle_13.3Stern.png'],
    ['Roberto Russo',           'middle',   3, 'IT', 'middle_14.3Stern.png'],
    ['Dmytro Pashytskyy',       'middle',   3, 'UA', 'middle_15.3Stern.png'],
    ['Andrei Jekov',            'middle',   3, 'BG', 'middle_16.3Stern.png'],
    // 4-star (5)
    ['Lucas Saatkamp',          'middle',   4, 'BR', 'middle_17.4Stern.png'],
    ['Srecko Lisinac',          'middle',   4, 'RS', 'middle_18.4Stern.png'],
    ['Ante Nizic',              'middle',   4, 'HR', 'middle_19.4Stern.png'],
    ['Gyorgy Grozer',           'middle',   4, 'DE', 'middle_20.4Stern.png'],
    ['Tomas Kotrc',             'middle',   4, 'CZ', 'middle_21.4Stern.png'],
    // 5-star (4)
    ['Robertlandy Simon',       'middle',   5, 'CU', 'middle_22.5Stern.png'],
    ['Nimir Abdel-Aziz',        'middle',   5, 'NL', 'middle_23.5Stern.png'],
    ['Simone Anzani',           'middle',   5, 'IT', 'middle_24.5Stern.png'],
    ['Uroš Kovačević',          'middle',   5, 'RS', 'middle_25.5Stern.png'],

    // --- SETTERS (light blue) — 19 cards -----------------------------
    // 1-star (5)
    ['Konstantin Bakun',        'setter',   1, 'RU', 'setter_01.1Stern.png'],
    ['Roland Heyer',            'setter',   1, 'CH', 'setter_02.1Stern.png'],
    ['Marius Wlazly',           'setter',   1, 'PL', 'setter_03.1Stern.png'],
    ['Tomas Rousseaux',         'setter',   1, 'BE', 'setter_04.1Stern.png'],
    ['Jonas Weber',             'setter',   1, 'DE', 'setter_05.1Stern.png'],
    // 2-star (4)
    ['Dragan Travica',          'setter',   2, 'IT', 'setter_06.2Stern.png'],
    ['Pierre Pujol',            'setter',   2, 'FR', 'setter_07.2Stern.png'],
    ['Marcin Janusz',           'setter',   2, 'PL', 'setter_08.2Stern.png'],
    ['Lukas Kampa',             'setter',   2, 'DE', 'setter_09.2Stern.png'],
    // 3-star (4)
    ['Igor Kolakovic',          'setter',   3, 'RS', 'setter_10.3Stern.png'],
    ['Antoine Brizard',         'setter',   3, 'FR', 'setter_11.3Stern.png'],
    ['Salvador Hidalgo',        'setter',   3, 'AR', 'setter_12.3Stern.png'],
    ['Paulo Brant',             'setter',   3, 'BR', 'setter_13.3Stern.png'],
    // 4-star (3)
    ['Micah Christenson',       'setter',   4, 'US', 'setter_14.4Stern.png'],
    ['Fabio De Cecco',          'setter',   4, 'IT', 'setter_15.4Stern.png'],
    ['Benjamin Toniutti',       'setter',   4, 'FR', 'setter_16.4Stern.png'],
    // 5-star (3)
    ['Bruno Rezende',           'setter',   5, 'BR', 'setter_17.5Stern.png'],
    ['Nikola Grbic',            'setter',   5, 'RS', 'setter_18.5Stern.png'],
    ['Sergey Grankin',          'setter',   5, 'RU', 'setter_19.5Stern.png'],

    // --- DIAGONALS / OPPOSITES (dark blue) — 18 cards ----------------
    // 1-star (5 — diagonal_04 does not exist, sequence: 01,02,03,05,06)
    ['Kasper Kraemer',          'diagonal', 1, 'DK', 'diagonal_01.1Stern.png'],
    ['Niels Klapwijk',          'diagonal', 1, 'NL', 'diagonal_02.1Stern.png'],
    ['Jure Okrosa',             'diagonal', 1, 'SI', 'diagonal_03.1Stern.png'],
    ['Andrija Geric',           'diagonal', 1, 'RS', 'diagonal_05.1Stern.png'],
    ['Lukas Maase',             'diagonal', 1, 'DE', 'diagonal_06.1Stern.png'],
    // 2-star (4)
    ['Maxwell Holt',            'diagonal', 2, 'US', 'diagonal_07.2Stern.png'],
    ['Pavel Pankov',            'diagonal', 2, 'RU', 'diagonal_08.2Stern.png'],
    ['Felix Fischer',           'diagonal', 2, 'DE', 'diagonal_09.2Stern.png'],
    ['Damiano Catania',         'diagonal', 2, 'IT', 'diagonal_10.2Stern.png'],
    // 3-star (3)
    ['Adrian Aciobanitei',      'diagonal', 3, 'RO', 'diagonal_11.3Stern.png'],
    ['Aleksandar Atanasijevic', 'diagonal', 3, 'RS', 'diagonal_12.3Stern.png'],
    ['Renee Teppan',            'diagonal', 3, 'EE', 'diagonal_13.3Stern.png'],
    // 4-star (3 — diagonal_16 filename has typo "Sterng", kept exactly as-is)
    ['Tsvetan Sokolov',         'diagonal', 4, 'BG', 'diagonal_14.4Stern.png'],
    ['Georg Grozer',            'diagonal', 4, 'DE', 'diagonal_15.4Stern.png'],
    ['Luca Vettori',            'diagonal', 4, 'IT', 'diagonal_16.4Sterng.png'],
    // 5-star (3)
    ['Ivan Zaytsev',            'diagonal', 5, 'IT', 'diagonal_17.5Stern.png'],
    ['Bartosz Kurek',           'diagonal', 5, 'PL', 'diagonal_18.5Stern.png'],
    ['Yoandy Leal',             'diagonal', 5, 'BR', 'diagonal_19.5Stern.png'],

    // --- LIBEROS (yellow) — 18 cards ---------------------------------
    // 1-star (5)
    ['Ferdinand Tille',         'libero',   1, 'DE', 'libero_01.1Stern.png'],
    ['Markus Steuerwald',       'libero',   1, 'DE', 'libero_02.1Stern.png'],
    ['Tomas Hudacek',           'libero',   1, 'SK', 'libero_03.1Stern.png'],
    ['Yevhen Konovalov',        'libero',   1, 'UA', 'libero_04.1Stern.png'],
    ['Ola Holm',                'libero',   1, 'NO', 'libero_05.1Stern.png'],
    // 2-star (4)
    ['Petar Petric',            'libero',   2, 'BA', 'libero_06.2Stern.png'],
    ['Salvador Saenz',          'libero',   2, 'CU', 'libero_07.2Stern.png'],
    ['Jose Massa',              'libero',   2, 'AR', 'libero_08.2Stern.png'],
    ['Dustin Watten',           'libero',   2, 'US', 'libero_09.2Stern.png'],
    // 3-star (3)
    ['Damir Petric',            'libero',   3, 'HR', 'libero_10.3Stern.png'],
    ['Massimo Colaci',          'libero',   3, 'IT', 'libero_11.3Stern.png'],
    ['Pawel Zatorski',          'libero',   3, 'PL', 'libero_12.3Stern.png'],
    // 4-star (3)
    ['Erik Shoji',              'libero',   4, 'US', 'libero_13.4Stern.png'],
    ['Sergio Santos',           'libero',   4, 'BR', 'libero_14.4Stern.png'],
    ['Alexei Verbitsky',        'libero',   4, 'RU', 'libero_15.4Stern.png'],
    // 5-star (3)
    ['Jenia Grebennikov',       'libero',   5, 'FR', 'libero_16.5Stern.png'],
    ['Leonardo',                'libero',   5, 'BR', 'libero_17.5Stern.png'],
    ['Kai Stern',               'libero',   5, 'DE', 'libero_18.5Stern.png'],

  ];

  // Folder mapping: pos → actual directory name on disk
  const POS_FOLDER = {
    outside:  'Outsides',
    middle:   'Middels',
    diagonal: 'Diagonal',
    libero:   'Liberos',
    setter:   'Passeur',
  };

  // Build the full card array — URL uses the correct per-position folder.
  function buildAllCards() {
    const out = [];
    let id = 1;
    for (const row of ROSTER) {
      const [name, pos, stars, nation, file] = row;
      out.push({
        id:     'c' + (id++),
        name:   name,
        pos:    pos,
        stars:  stars,
        url:    (POS_FOLDER[pos] || 'cards') + '/' + file,
        nation: nation
      });
    }
    return out;
  }

  // Expose for game.js (loaded later as a separate <script>).
  if (typeof window !== 'undefined') {
    window.buildAllCards  = buildAllCards;
    window.VV_CARDS_DB    = buildAllCards();   // snapshot for console debugging
  }
  // Node test-harness compatibility.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildAllCards: buildAllCards };
  }
})();
