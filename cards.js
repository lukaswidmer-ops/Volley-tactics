/* ===========================================================
   VOLLEY VENDETTA — Card Database
   -----------------------------------------------------------
   Each card: { id, name, pos, stars, url, fileName, nation }
   Positions: 'outside' | 'middle' | 'setter' | 'diagonal' | 'libero'

   URLs point directly to the real card image files (.png).
   File naming pattern: <pos>.<NN>.<X>Stern.<Country>.<Name>.png
   =========================================================== */

(function () {
  'use strict';

  // ROSTER: [name, position, stars, nation, filename]
  // Filenames match the actual files in the position subfolders exactly.
  // NOTE: diagonal.04 does not exist (skipped).
  // Sorted by: position alphabetically, then stars ascending, then number ascending.
  // Position mapping: files named "middel.*" → 'middle'; files named "passeur.*" → 'setter'.
  const ROSTER = [

    // --- DIAGONAL / OPPOSITE (dark blue) — 18 cards ------------------
    // 1-star (5 — no diagonal.04)
    ['KevinNyffenegger',        'diagonal', 1, 'Schweiz',      'diagonal.01.1Stern.Schweiz.KevinNyffenegger.png'],
    ['SimonFluri',              'diagonal', 1, 'Schweiz',      'diagonal.02.1Stern.Schweiz.SimonFluri.png'],
    ['JesseOdermatt',           'diagonal', 1, 'Schweiz',      'diagonal.03.1Stern.Schweiz.JesseOdermatt.png'],
    ['FelixGruss',              'diagonal', 1, 'Schweiz',      'diagonal.05.1Stern.Schweiz.FelixGruss.png'],
    ['AdamWitzig',              'diagonal', 1, 'Schweiz',      'diagonal.06.1Stern.Schweiz.AdamWitzig.png'],
    // 2-star (4)
    ['NinoCaduff',              'diagonal', 2, 'Schweiz',      'diagonal.07.2Stern.Schweiz.NinoCaduff.png'],
    ['NicoFuchs',               'diagonal', 2, 'Schweiz',      'diagonal.08.2Stern.Schweiz.NicoFuchs.png'],
    ['YuriTomin',               'diagonal', 2, 'Ukraine',      'diagonal.09.2Stern.Ukraine.YuriTomin.png'],
    ['ColeKetrzynski',          'diagonal', 2, 'Kanada',       'diagonal.10.2Stern.Kanada.ColeKetrzynski.png'],
    // 3-star (3)
    ['EtienneSchalch',          'diagonal', 3, 'Schweiz',      'diagonal.11.3Stern.Schweiz.EtienneSchalch.png'],
    ['MahelaIndeewara',         'diagonal', 3, 'SriLanka',     'diagonal.12.3Stern.SriLanka.MahelaIndeewara.png'],
    ['PabloDenis',              'diagonal', 3, 'Argentinien',  'diagonal.13.3Stern.Argentinien.PabloDenis.png'],
    // 4-star (3)
    ['GeorgGrozer',             'diagonal', 4, 'Deutschland',  'diagonal.14.4Stern.Deutschland.GeorgGrozer.png'],
    ['DmitriyMuserskiy',        'diagonal', 4, 'Russland',     'diagonal.15.4Stern.Russland.DmitriyMuserskiy.png'],
    ['FerreReggers',            'diagonal', 4, 'Belgien',      'diagonal.16.4Stern.Belgien.FerreReggers.png'],
    // 5-star (3)
    ['YujiNishida',             'diagonal', 5, 'Japan',        'diagonal.17.5Stern.Japan.YujiNishida.png'],
    ['NimirAbdel',              'diagonal', 5, 'Niederlande',  'diagonal.18.5Stern.Niederlande.NimirAbdel.png'],
    ['DarlanSouza',             'diagonal', 5, 'Brasilien',    'diagonal.19.5Stern.Brasilien.DarlanSouza.png'],

    // --- LIBERO (yellow) — 18 cards ----------------------------------
    // 1-star (5)
    ['LinoKrucker',             'libero',   1, 'Schweiz',      'libero.01.1Stern.Schweiz.LinoKrucker.png'],
    ['FlorianSchulthess',       'libero',   1, 'Schweiz',      'libero.02.1Stern.Schweiz.FlorianSchulthess.png'],
    ['PascalMuller',            'libero',   1, 'Schweiz',      'libero.03.1Stern.Schweiz.PascalMuller.png'],
    ['RobinFah',                'libero',   1, 'Schweiz',      'libero.04.1Stern.Schweiz.RobinFah.png'],
    ['HansruediGrob',           'libero',   1, 'Schweiz',      'libero.05.1Stern.Schweiz.HansruediGrob.png'],
    // 2-star (4)
    ['AdiMoon',                 'libero',   2, 'Schweiz',      'libero.06.2Stern.Schweiz.AdiMoon.png'],
    ['MarvinSteiner',           'libero',   2, 'Schweiz',      'libero.07.2Stern.Schweiz.MarvinSteiner.png'],
    ['LeandroDiem',             'libero',   2, 'Schweiz',      'libero.08.2Stern.Schweiz.LeandroDiem.png'],
    ['LouisKrummacher',         'libero',   2, 'Schweiz',      'libero.09.2Stern.Schweiz.LouisKrummacher.png'],
    // 3-star (3)
    ['RamonDiem',               'libero',   3, 'Schweiz',      'libero.10.3Stern.Schweiz.RamonDiem.png'],
    ['JaniKovacic',             'libero',   3, 'Serbien',      'libero.11.3Stern.Serbien.JaniKovacic.png'],
    ['ArmanSalehi',             'libero',   3, 'Iran',         'libero.12.3Stern.Iran.ArmanSalehi.png'],
    // 4-star (3)
    ['JeniaGrebennikov',        'libero',   4, 'Frankreich',   'libero.13.4Stern.Frankreich.JeniaGrebennikov.png'],
    ['FabioBalaso',             'libero',   4, 'Italien',      'libero.14.4Stern.Italien.FabioBalaso.png'],
    ['JulianZenger',            'libero',   4, 'Deutschland',  'libero.15.4Stern.Deutschland.JulianZenger.png'],
    // 5-star (3)
    ['PawelZatorski',           'libero',   5, 'Polen',        'libero.16.5Stern.Polen.PawelZatorski.png'],
    ['TomohiroYamamoto',        'libero',   5, 'Japan',        'libero.17.5Stern.Japan.TomohiroYamamoto.png'],
    ['ErikShoji',               'libero',   5, 'USA',          'libero.18.5Stern.USA.ErikShoji.png'],

    // --- MIDDLE BLOCKER (green) — 25 cards ---------------------------
    // 1-star (7)
    ['PhilippWidmer',           'middle',   1, 'Schweiz',      'middel.01.1Stern.Schweiz.PhilippWidmer.png'],
    ['HannesBirker',            'middle',   1, 'Schweiz',      'middel.02.1Stern.Schweiz.HannesBirker.png'],
    ['FabianNussbaumer',        'middle',   1, 'Schweiz',      'middel.03.1Stern.Schweiz.FabianNussbaumer.png'],
    ['JulianLuterbach',         'middle',   1, 'Schweiz',      'middel.04.1Stern.Schweiz.JulianLuterbach.png'],
    ['SamuelFrei',              'middle',   1, 'Schweiz',      'middel.05.1Stern.Schweiz.SamuelFrei.png'],
    ['JoelDurr',                'middle',   1, 'Schweiz',      'middel.06.1Stern.Schweiz.JoelDurr.png'],
    ['JustinStaub',             'middle',   1, 'Schweiz',      'middel.07.1Stern.Schweiz.JustinStaub.png'],
    // 2-star (4)
    ['RomianRuegg',             'middle',   2, 'Schweiz',      'middel.08.2Stern.Schweiz.RomianRuegg.png'],
    ['DanielOsoko',             'middle',   2, 'Schweiz',      'middel.09.2Stern.Schweiz.DanielOsoko.png'],
    ['JoelHauck',               'middle',   2, 'Schweiz',      'middel.10.2Stern.Schweiz.JoelHauck.png'],
    ['AlexanderLengweiler',     'middle',   2, 'Schweiz',      'middel.11.2Stern.Schweiz.AlexanderLengweiler.png'],
    // 3-star (5)
    ['NoeMatthey',              'middle',   3, 'Schweiz',      'middel.12.3Stern.Schweiz.NoeMatthey.png'],
    ['TobyEzeonu',              'middle',   3, 'USA',          'middel.13.3Stern.USA.TobyEzeonu.png'],
    ['SeyedMousavi',            'middle',   3, 'Iran',         'middel.14.3Stern.Iran.SeyedMousavi.png'],
    ['MiaoRuantong',            'middle',   3, 'China',        'middel.15.3Stern.China.MiaoRuantong.png'],
    ['JanzKrzic',               'middle',   3, 'Serbien',      'middel.16.3Stern.Serbien.JanzKrzic.png'],
    // 4-star (5)
    ['MousseGueye',             'middle',   4, 'Frankreich',   'middel.17.4Stern.Frankreich.MousseGueye.png'],
    ['LucaTauletta',            'middle',   4, 'Italien',      'middel.18.4Stern.Italien.LucaTauletta.png'],
    ['AkihiroYamauchi',         'middle',   4, 'Japan',        'middel.19.4Stern.Japan.AkihiroYamauchi.png'],
    ['DmytroTeryomenko',        'middle',   4, 'Ukraine',      'middel.20.4Stern.Ukraine.DmytroTeryomenko.png'],
    ['ShaneHoldaway',           'middle',   4, 'USA',          'middel.21.4Stern.USA.ShaneHoldaway.png'],
    // 5-star (4)
    ['AgustinLoser',            'middle',   5, 'Argentinien',  'middel.22.5Stern.Argentinien.AgustinLoser.png'],
    ['MarkoPodrascanin',        'middle',   5, 'Kroatien',     'middel.23.5Stern.Kroatien.MarkoPodrascanin.png'],
    ['RobertlandySimon',        'middle',   5, 'Kuba',         'middel.24.5Stern.Kuba.RobertlandySimon.png'],
    ['TobiasKrick',             'middle',   5, 'Deutschland',  'middel.25.5Stern.Deutschland.TobiasKrick.png'],

    // --- OUTSIDE HITTER (red) — 29 cards -----------------------------
    // 1-star (7)
    ['LukasWidmer',             'outside',  1, 'Schweiz',      'outside.01.1Stern.Schweiz.LukasWidmer.png'],
    ['RaffaelNussbaumer',       'outside',  1, 'Schweiz',      'outside.02.1Stern.Schweiz.RaffaelNussbaumer.png'],
    ['MishaKovtum',             'outside',  1, 'Ukraine',      'outside.03.1Stern.Ukraine.MishaKovtum.png'],
    ['LevinSutter',             'outside',  1, 'Schweiz',      'outside.04.1Stern.Schweiz.LevinSutter.png'],
    ['AndrinMatz',              'outside',  1, 'Schweiz',      'outside.05.1Stern.Schweiz.AndrinMatz.png'],
    ['AidAndrej',               'outside',  1, 'Schweiz',      'outside.06.1Stern.Schweiz.AidAndrej.png'],
    ['SegoMakyta',              'outside',  1, 'Schweiz',      'outside.07.1Stern.Schweiz.SegoMakyta.png'],
    // 2-star (5)
    ['RaffaelZingg',            'outside',  2, 'Schweiz',      'outside.08.2Stern.Schweiz.RaffaelZingg.png'],
    ['PascalRofeler',           'outside',  2, 'Schweiz',      'outside.09.2Stern.Schweiz.PascalRofeler.png'],
    ['RomanBruhwiler',          'outside',  2, 'Schweiz',      'outside.10.2Stern.Schweiz.RomanBruhwiler.png'],
    ['TinkoSchnegg',            'outside',  2, 'Schweiz',      'outside.11.2Stern.Schweiz.TinkoSchnegg.png'],
    ['AndrinBroder',            'outside',  2, 'Liechtenstein','outside.12.2Stern.Liechtenstein.AndrinBroder.png'],
    // 3-star (8)
    ['LucianoPalonsky',         'outside',  3, 'Argentinien',  'outside.13.3Stern.Argentinien.LucianoPalonsky.png'],
    ['CyrilKolb',               'outside',  3, 'Schweiz',      'outside.14.3Stern.Schweiz.CyrilKolb.png'],
    ['MortezaSharifi',          'outside',  3, 'Iran',         'outside.15.3Stern.Iran.MortezaSharifi.png'],
    ['YuyuYuantai',             'outside',  3, 'China',        'outside.16.3Stern.China.YuyuYuantai.png'],
    ['DmytroYanchuk',           'outside',  3, 'Ukraine',      'outside.17.3Stern.Ukraine.DmytroYanchuk.png'],
    ['TomKoops',                'outside',  3, 'Niederlande',  'outside.18.3Stern.Niederlande.TomKoops.png'],
    ['JesseElser',              'outside',  3, 'Kanada',       'outside.19.3Stern.Kanada.JesseElser.png'],
    ['LarsMigge',               'outside',  3, 'Schweiz',      'outside.20.3Stern.Schweiz.LarsMigge.png'],
    // 4-star (5)
    ['MiguelLopez',             'outside',  4, 'Kuba',         'outside.21.4Stern.Kuba.MiguelLopez.png'],
    ['KamilSemeniuk',           'outside',  4, 'Polen',        'outside.22.4Stern.Polen.KamilSemeniuk.png'],
    ['MattiaBottolo',           'outside',  4, 'Italien',      'outside.23.4Stern.Italien.MattiaBottolo.png'],
    ['ZhangBinglong',           'outside',  4, 'China',        'outside.24.4Stern.China.ZhangBinglong.png'],
    ['EthanChamplin',           'outside',  4, 'USA',          'outside.25.4Stern.USA.EthanChamplin.png'],
    // 5-star (4)
    ['YukiIshikawa',            'outside',  5, 'Bulgarien',    'outside.26.5Stern.Bulgarien.YukiIshikawa.png'],
    ['WilfredoLeon',            'outside',  5, 'Bulgarien',    'outside.27.5Stern.Bulgarien.WilfredoLeon.png'],
    ['AlexNikolov',             'outside',  5, 'Bulgarien',    'outside.28.5Stern.Bulgarien.AlexNikolov.png'],
    ['TJDeFalco',               'outside',  5, 'USA',          'outside.29.5Stern.USA.TJDeFalco.png'],

    // --- SETTER / PASSEUR (light blue) — 19 cards --------------------
    // 1-star (5)
    ['GioelKuhn',               'setter',   1, 'Schweiz',      'passeur.01.1Stern.Schweiz.GioelKuhn.png'],
    ['FanfanErni',              'setter',   1, 'Schweiz',      'passeur.02.1Stern.Schweiz.FanfanErni.png'],
    ['PanhjaMorm',              'setter',   1, 'Schweiz',      'passeur.03.1Stern.Schweiz.PanhjaMorm.png'],
    ['RaphaelRiege',            'setter',   1, 'Schweiz',      'passeur.04.1Stern.Schweiz.RaphaelRiege.png'],
    ['EricFerreira',            'setter',   1, 'Schweiz',      'passeur.05.1Stern.Schweiz.EricFerreira.png'],
    // 2-star (4)
    ['AtakanYilmaz',            'setter',   2, 'Schweiz',      'passeur.06.2Stern.Schweiz.AtakanYilmaz.png'],
    ['LucaWeber',               'setter',   2, 'Schweiz',      'passeur.07.2Stern.Schweiz.LucaWeber.png'],
    ['PascalFrischmuth',        'setter',   2, 'Schweiz',      'passeur.08.2Stern.Schweiz.PascalFrischmuth.png'],
    ['LucaIneichen',            'setter',   2, 'Schweiz',      'passeur.09.2Stern.Schweiz.LucaIneichen.png'],
    // 3-star (4)
    ['FabriceEgger',            'setter',   3, 'Schweiz',      'passeur.10.3Stern.Schweiz.FabriceEgger.png'],
    ['ArshiaBehnezhad',         'setter',   3, 'Iran',         'passeur.11.3Stern.Iran.ArshiaBehnezhad.png'],
    ['YuYaochen',               'setter',   3, 'China',        'passeur.12.3Stern.China.YuYaochen.png'],
    ['DimaFilippov',            'setter',   3, 'Griechenland', 'passeur.13.3Stern.Griechenland.DimaFilippov.png'],
    // 4-star (3)
    ['MattiaBoninfante',        'setter',   4, 'Italien',      'passeur.14.4Stern.Italien.MattiaBoninfante.png'],
    ['LucianoDeCecco',          'setter',   4, 'Argentinien',  'passeur.15.4Stern.Argentinien.LucianoDeCecco.png'],
    ['JohannesTille',           'setter',   4, 'Deutschland',  'passeur.16.4Stern.Deutschland.JohannesTille.png'],
    // 5-star (3)
    ['SimoneGiannelli',         'setter',   5, 'Italien',      'passeur.17.5Stern.Italien.SimoneGiannelli.png'],
    ['SimoneNikolov',           'setter',   5, 'Bulgarien',    'passeur.18.5Stern.Bulgarien.SimoneNikolov.png'],
    ['MicahChristenson',        'setter',   5, 'USA',          'passeur.19.5Stern.USA.MicahChristenson.png'],

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
        id:       'c' + (id++),
        name:     name,
        pos:      pos,
        stars:    stars,
        url:      (POS_FOLDER[pos] || 'cards') + '/' + file,
        fileName: file,
        nation:   nation
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
