/* ================================================================
   VOLLEY VENDETTA — Online Game (Classic Mode, single season)
   Rule-faithful build per official rulebook (April 2026 edition).
   Pure vanilla JS, no build step.
   ================================================================ */
(function () {
'use strict';

// ────────────────────────────────────────────────────────────────
//  i18n
// ────────────────────────────────────────────────────────────────
const i18n = {
  de: {
    loading: 'Lädt…',
    intro1_h: 'Baue dein Team',
    intro1_p: 'Starte mit 80’000 und drafte Spieler über fünf Positionen. Bessere Sterne = stärkeres Team.',
    intro2_h: 'Spiele Turniere',
    intro2_p: 'Sechs Wochen, fünf Turniere. Liga-Punkte → Saison-Platzierung. Cup, SuperCup und Champions League bringen Siegpunkte.',
    intro3_h: 'Werde Champion',
    intro3_p: 'Wer als Erster 8 Siegpunkte sammelt, gewinnt sofort. Sonst entscheidet das Saison-Ende.',
    intro_skip: 'Überspringen', intro_next: 'Weiter ▸', intro_start: "Los geht's ▸",

    menu_title_l1: 'Volley', menu_title_l2: 'Vendetta',
    menu_sub: 'Online · 3–4 Spieler · 6 Wochen Saison',
    menu_name_label: 'Dein Name', menu_name_ph: 'z.B. Lukas',
    menu_solo: 'Solo gegen Bots', menu_solo_t: 'Spiele gegen 2 smarte KI-Gegner',
    menu_mp: 'Multiplayer', menu_mp_t: 'Mit Freunden via Raum-Code spielen',
    menu_back: 'Zurück',
    mp_create: 'Raum erstellen', mp_create_t: 'Erzeuge einen Raum-Code',
    mp_join: 'Raum beitreten',  mp_join_t: 'Tritt einem Raum bei',
    mp_join_label: 'Raum-Code (6 Zeichen)', mp_join_btn: 'Beitreten ▸',
    mp_unavailable: 'Multiplayer noch nicht aktiviert (Firebase-Config fehlt). Spiele Solo gegen Bots.',

    lobby_h: 'Lobby', lobby_code: 'Raum-Code', lobby_copy: 'Kopieren', lobby_copied: 'Kopiert!',
    lobby_waiting: 'Warte auf weitere Spieler…', lobby_start: 'Spiel starten ▸',
    lobby_min: 'Min. 2 Spieler', lobby_leave: 'Lobby verlassen', lobby_host: 'Host',

    setup_h: 'Aufbau',
    draft_h: 'Blind-Draft',
    draft_p: 'Reihum zieht jeder vom verdeckten Stapel. Sterne werden erst beim Aufdecken sichtbar.',
    draft_step_4: 'Ziehe 1× 4★ Karte',
    draft_step_3: 'Ziehe 2× 3★ Karten',
    draft_step_2: 'Ziehe 3× 2★ Karten',
    draft_step_1: 'Wähle 3× 1★ Karten nach Position',
    draft_pick: 'Karte ziehen',
    draft_redraw: 'Neu ziehen (mehr als 3 gleiche Position)',
    draft_continue: 'Auktion starten ▸',
    draft_pick_pos: 'Position wählen',
    auction_h: 'Eröffnungs-Auktion',
    auction_sub: '6 Karten werden versteigert. Mindestgebot = Sterne × 10’000.',
    auction_card: 'Karte %d von %d',
    auction_minbid: 'Mindestgebot',
    auction_currentbid: 'Höchstgebot',
    auction_yourbid: 'Dein Gebot',
    auction_bid: 'Bieten',
    auction_pass: 'Passen',
    auction_won: '%s gewinnt für %s ’',
    auction_passed: '%s passt',
    auction_no_one: 'Niemand bietet — Karte zurück auf den Stapel',
    auction_timer: 'Sekunden',
    starting_h: 'Wer beginnt?',
    starting_p: 'Alle würfeln den 12er. Höchste Zahl beginnt.',
    starting_roll: 'Würfeln',
    starting_winner: '%s beginnt!',

    pos_outside: 'Aussenangreifer', pos_middle: 'Mittelblocker', pos_setter: 'Setter',
    pos_diagonal: 'Diagonal', pos_libero: 'Libero',
    pos_short_outside: 'OH', pos_short_middle: 'MB', pos_short_setter: 'S',
    pos_short_diagonal: 'OPP', pos_short_libero: 'L',

    week: 'Woche', of: 'von',
    phase_event: 'Event', phase_match: 'Liga', phase_buy: 'Markt', phase_done: 'Wochenende',
    week_event_supercup: 'SuperCup', week_event_cl: 'Champions League',
    week_event_cup: 'Cup', week_event_cupfinal: 'Cup-Final', week_event_clfinal: 'CL-Final',
    week_event_league: 'Liga',

    yourturn: 'DU BIST AM ZUG', bot_thinking: 'denkt nach',

    cone_roll: '3er werfen ▸', cone_advance: 'Hütchen bewegt sich',
    cone_lands: '%s landet auf Tag %d',
    cone_passes: 'Hütchen überfährt Tag-%d-Linie',
    cone_event_red: 'Rote Karte',
    cone_event_red_p: 'Mit dem 6er bestimmen wir, welcher Stammspieler gesperrt wird. Sperre dauert bis nach dem nächsten Liga-Spiel.',
    cone_event_transfer: 'Spielertransfer',
    cone_event_transfer_p: 'Eine neue Karte vom Auktionsstapel wird sofort versteigert.',
    cone_event_action: 'Aktionskarte',
    cone_event_action_p: 'Diese Mechanik gibt es nur im echten Brettspiel — etwas muss schließlich Überraschung bleiben! 🎁',
    cone_event_vnl: 'VNL-Nationalspiele',
    cone_event_vnl_p: 'Spieler dieser Flagge fehlen für die ganze Woche. Nach dem Liga-Spiel sind sie wieder dabei.',
    cone_event_injury: 'Verletzung',
    cone_event_injury_p: 'Der 6er bestimmt, welcher Stammspieler verletzt ist. Genesung nach dem nächsten Liga-Spiel.',
    cone_continue: 'Weiter ▸',
    cone_pos_disabled: 'Position bis nach dem Liga-Spiel deaktiviert: %s',

    serve: 'Aufschlag', serve_t: 'Würfle den 12er und beginne den Ballwechsel',
    next_match: 'Weiter ▸', next_week: 'Nächste Woche ▸',
    finish_buying: 'Markt schliessen ▸',
    speed: 'Tempo', speed_normal: 'Normal', speed_fast: 'Schnell', speed_auto: 'Auto',
    market_h: 'Spielermarkt', market_budget: 'Budget',
    market_team_strength: 'Team-Stärke', market_buy: 'Kaufen', market_sold: 'Vergriffen',
    market_suggest: 'Schwächste Position', market_sell: 'Verkaufen',
    market_sell_t: 'Hälfte des Sternenwerts',

    money: 'Geld', vp: 'Siegpunkte', str: 'Stärke', pos: 'Pos', you: 'Du',
    homeaway_home: 'Heim', homeaway_away: 'Auswärts',
    set: 'Satz', sets: 'Sätze',
    serve_keeps: 'Aufschlag bleibt', sideout: 'Sideout!', rotation: 'Rotation!',
    set_won: 'Satz %s geht an %s: %d–%d 🏆',
    match_won: '%s gewinnt %d:%d!',
    prize: 'Preisgeld',
    log_match: '%s vs %s — %s gewinnt %d:%d',

    crit_total: 'Gesamtteam',
    crit_front: 'Angreifer vorne',
    crit_back: 'Verteidiger hinten',
    crit_dice: 'Würfelvergleich',
    crit_middle: 'Mittelblocker',
    crit_service: 'Service',
    crit_dia_set: 'Diagonal + Setter',
    crit_out_dia: 'Aussen hinten vs. Diagonal',
    crit_block: 'Block-Überwurf',
    crit_crunch: 'Crunchtime',
    crit_injury: 'Verletzung',
    crit_money: 'Geld-Regen',

    crit_total_d: 'Mehr Sterne gesamt gewinnt',
    crit_front_d: 'Stärkere 3 Karten in der Vorderreihe',
    crit_back_d: 'Stärkere 3 Karten in der Hinterreihe',
    crit_dice_d: 'Beide werfen den 12er. Höhere Zahl gewinnt',
    crit_middle_d: 'Besserer vorderer Mittelblocker gewinnt',
    crit_service_d: 'Heim hinten-rechts vs. Auswärts-Libero',
    crit_dia_set_d: 'Diagonal + Setter Sternsumme vergleichen',
    crit_out_dia_d: 'Aussenangreifer hinten gegen Diagonal',
    crit_block_d: 'Auswärts würfelt 12er gegen Heim-Block (Aussen+Mitte vorne)',
    crit_crunch_d: 'Heimteam erhält +2 zusätzliche Würfe in diesem Spiel',
    crit_injury_d: 'Würfel entscheidet welcher Spieler verletzt ausscheidet',
    crit_money_d: 'Beide Teams erhalten 5’000 von der Bank',

    end_h_winner: '%s gewinnt!',
    end_play_again: 'Nochmal spielen', end_back_menu: 'Hauptmenü',
    end_stats_money: 'Verdient', end_stats_won: 'Matches', end_stats_str: 'Endstärke',
    end_remarks_8vp: 'erreicht 8 Siegpunkte und gewinnt sofort!',
    end_remarks_season: 'Saisonende — meiste Siegpunkte gewinnen.',
    bot_buys: '%s hat %s gekauft (%d★, %s’)',
    bot_skips: '%s passt diesen Markt',
    bot_bid: '%s bietet %s ’',
    bot_pass: '%s passt',
    standings_title: 'Liga-Tabelle',
    coming: 'als Nächstes',
    block_holds: 'Block hält!',
    block_overshot: 'Block überspielt!',
    crunch_extra: '+2 zusätzliche Würfe',
    injury_out: 'verletzt – fällt aus',
    money_rain: 'Geld-Regen — beide bekommen 5’000',

    season_end_h: 'Saisonende',
    season_end_protect: 'Wähle einen Spieler zum Schützen',
    season_end_protect_p: 'Der ungeschützte Spieler auf der gewürfelten Position muss zurück auf den Stapel.',
    season_end_drop: '%s verliert %s (Position %s)',
    season_end_steal: 'Klau-Phase',
    season_end_steal_p: '4. darf von 1. + 2. klauen, 3. darf von 4. klauen — nur als Upgrade.',
    season_end_payout: 'Saison-Auszahlung',
    season_end_continue: 'Weiter ▸',
    cup_h: 'Cup',
    cup_roll: 'Alle würfeln den 12er — die zwei Höchsten spielen gegeneinander.',
    cup_pair: '%s vs. %s',
    cup_byes: '%s ist nicht qualifiziert — warten',
    supercup_h: 'SuperCup',
    cl_h: 'Champions League',
    cl_first_season: 'CL-Felder werden in Saison 1 übersprungen',
    cl_no_qual: 'Niemand qualifiziert für CL in dieser Saison',

    confetti_msg: '🎉 SIEGER! 🎉',
  },
  en: {
    loading: 'Loading…',
    intro1_h: 'Build your team',
    intro1_p: 'Start with 80,000 and draft players across five positions. More stars = stronger team.',
    intro2_h: 'Play tournaments',
    intro2_p: 'Six weeks, five tournaments. League points decide season ranking. Cup, Super Cup and the Champions League hand out victory points.',
    intro3_h: 'Become champion',
    intro3_p: 'First to 8 victory points wins instantly. Otherwise the season end decides.',
    intro_skip: 'Skip', intro_next: 'Next ▸', intro_start: "Let's go ▸",

    menu_title_l1: 'Volley', menu_title_l2: 'Vendetta',
    menu_sub: 'Online · 3–4 players · 6-week season',
    menu_name_label: 'Your Name', menu_name_ph: 'e.g. Alex',
    menu_solo: 'Solo vs Bots', menu_solo_t: 'Play 2 smart AI opponents',
    menu_mp: 'Multiplayer', menu_mp_t: 'Play with friends via room code',
    menu_back: 'Back',
    mp_create: 'Create Room', mp_create_t: 'Generate a room code',
    mp_join: 'Join Room', mp_join_t: 'Join an existing room',
    mp_join_label: 'Room code (6 characters)', mp_join_btn: 'Join ▸',
    mp_unavailable: 'Multiplayer not enabled (Firebase config missing). Play solo.',

    lobby_h: 'Lobby', lobby_code: 'Room code', lobby_copy: 'Copy', lobby_copied: 'Copied!',
    lobby_waiting: 'Waiting for more players…', lobby_start: 'Start game ▸',
    lobby_min: 'Min. 2 players', lobby_leave: 'Leave lobby', lobby_host: 'Host',

    setup_h: 'Setup',
    draft_h: 'Blind Draft',
    draft_p: 'Each player draws from the face-down deck. Stars are revealed on draw.',
    draft_step_4: 'Draw 1× 4★ card',
    draft_step_3: 'Draw 2× 3★ cards',
    draft_step_2: 'Draw 3× 2★ cards',
    draft_step_1: 'Pick 3× 1★ cards by position',
    draft_pick: 'Draw card',
    draft_redraw: 'Redraw (more than 3 of the same position)',
    draft_continue: 'Start auction ▸',
    draft_pick_pos: 'Pick position',
    auction_h: 'Opening Auction',
    auction_sub: '6 cards are auctioned. Min bid = stars × 10,000.',
    auction_card: 'Card %d of %d',
    auction_minbid: 'Min bid',
    auction_currentbid: 'High bid',
    auction_yourbid: 'Your bid',
    auction_bid: 'Bid',
    auction_pass: 'Pass',
    auction_won: '%s wins for %s',
    auction_passed: '%s passes',
    auction_no_one: 'No bids — card returns to the pile',
    auction_timer: 'seconds',
    starting_h: 'Who starts?',
    starting_p: 'Everyone rolls the 12-sided die. Highest goes first.',
    starting_roll: 'Roll',
    starting_winner: '%s starts!',

    pos_outside: 'Outside', pos_middle: 'Middle', pos_setter: 'Setter',
    pos_diagonal: 'Diagonal', pos_libero: 'Libero',
    pos_short_outside: 'OH', pos_short_middle: 'MB', pos_short_setter: 'S',
    pos_short_diagonal: 'OPP', pos_short_libero: 'L',

    week: 'Week', of: 'of',
    phase_event: 'Event', phase_match: 'League', phase_buy: 'Market', phase_done: 'Weekend',
    week_event_supercup: 'Super Cup', week_event_cl: 'Champions League',
    week_event_cup: 'Cup', week_event_cupfinal: 'Cup Final', week_event_clfinal: 'CL Final',
    week_event_league: 'League',

    yourturn: 'YOUR TURN', bot_thinking: 'thinking',

    cone_roll: 'Roll the 3-die ▸', cone_advance: 'Cone advances',
    cone_lands: '%s lands on day %d',
    cone_passes: 'Cone passes the day-%d line',
    cone_event_red: 'Red Card',
    cone_event_red_p: 'A 6-die roll determines which starter is suspended until after the next league match.',
    cone_event_transfer: 'Player Transfer',
    cone_event_transfer_p: 'A new card from the auction deck is auctioned immediately.',
    cone_event_action: 'Action Card',
    cone_event_action_p: 'This mechanic only exists in the physical game — some surprise has to remain! 🎁',
    cone_event_vnl: 'National Team (VNL)',
    cone_event_vnl_p: 'Players of that flag are missing for the whole week and return after the league match.',
    cone_event_injury: 'Injury',
    cone_event_injury_p: 'The 6-die determines which starter is injured; recovers after the next league match.',
    cone_continue: 'Continue ▸',
    cone_pos_disabled: 'Position disabled until after the league match: %s',

    serve: 'Serve', serve_t: 'Roll the 12-sided die and start the rally',
    next_match: 'Continue ▸', next_week: 'Next week ▸',
    finish_buying: 'Close market ▸',
    speed: 'Speed', speed_normal: 'Normal', speed_fast: 'Fast', speed_auto: 'Auto',
    market_h: 'Player Market', market_budget: 'Budget',
    market_team_strength: 'Team strength', market_buy: 'Buy', market_sold: 'Sold',
    market_suggest: 'Weakest position', market_sell: 'Sell',
    market_sell_t: 'Half of star value',

    money: 'Money', vp: 'Victory pts', str: 'Strength', pos: 'Pos', you: 'You',
    homeaway_home: 'Home', homeaway_away: 'Away',
    set: 'Set', sets: 'Sets',
    serve_keeps: 'Serve stays', sideout: 'Sideout!', rotation: 'Rotation!',
    set_won: 'Set %s goes to %s: %d–%d 🏆',
    match_won: '%s wins %d:%d!',
    prize: 'Prize',
    log_match: '%s vs %s — %s wins %d:%d',

    crit_total: 'Total team',
    crit_front: 'Front-row attackers',
    crit_back: 'Back-row defenders',
    crit_dice: 'Dice duel',
    crit_middle: 'Middle blocker',
    crit_service: 'Service',
    crit_dia_set: 'Diagonal + Setter',
    crit_out_dia: 'Outside back vs Diagonal',
    crit_block: 'Block challenge',
    crit_crunch: 'Crunchtime',
    crit_injury: 'Injury',
    crit_money: 'Money rain',

    crit_total_d: 'More total stars wins',
    crit_front_d: 'Stronger 3 cards in the front row',
    crit_back_d: 'Stronger 3 cards in the back row',
    crit_dice_d: 'Both roll the 12-die. Higher number wins',
    crit_middle_d: 'Better front-row middle blocker wins',
    crit_service_d: 'Home back-right vs away libero',
    crit_dia_set_d: 'Compare diagonal + setter star sum',
    crit_out_dia_d: 'Outside back-row vs diagonal',
    crit_block_d: 'Away rolls 12-die against home block (front outside + middle)',
    crit_crunch_d: 'Home team gets +2 extra rolls this match',
    crit_injury_d: 'Dice decides which player is out injured',
    crit_money_d: 'Both teams receive 5,000 from the bank',

    end_h_winner: '%s wins!',
    end_play_again: 'Play again', end_back_menu: 'Main menu',
    end_stats_money: 'Earned', end_stats_won: 'Matches', end_stats_str: 'Final strength',
    end_remarks_8vp: 'reaches 8 victory points and wins instantly!',
    end_remarks_season: 'Season end — most victory points wins.',
    bot_buys: '%s bought %s (%d★, %s)',
    bot_skips: '%s skips this market',
    bot_bid: '%s bids %s',
    bot_pass: '%s passes',
    standings_title: 'League standings',
    coming: 'next',
    block_holds: 'Block holds!',
    block_overshot: 'Block beaten!',
    crunch_extra: '+2 extra rolls',
    injury_out: 'injured – out',
    money_rain: 'Money rain — both teams +5,000',

    season_end_h: 'Season end',
    season_end_protect: 'Pick a player to protect',
    season_end_protect_p: 'The unprotected starter on the rolled position returns to the auction deck.',
    season_end_drop: '%s loses %s (position %s)',
    season_end_steal: 'Steal phase',
    season_end_steal_p: '4th may steal from 1st & 2nd, 3rd may steal from 4th — upgrades only.',
    season_end_payout: 'Season payout',
    season_end_continue: 'Continue ▸',
    cup_h: 'Cup',
    cup_roll: 'All players roll the 12-die — the two highest play each other.',
    cup_pair: '%s vs %s',
    cup_byes: '%s is not qualified — waiting',
    supercup_h: 'Super Cup',
    cl_h: 'Champions League',
    cl_first_season: 'CL spaces are skipped in season 1',
    cl_no_qual: 'No one qualified for CL this season',

    confetti_msg: '🎉 WINNER! 🎉',
  }
};

// ────────────────────────────────────────────────────────────────
//  Commentary pools (20+ per outcome)
// ────────────────────────────────────────────────────────────────
const COMMENTARY = {
  de: {
    home_score: [
      'Starker Aufschlag! Der Libero kommt nicht ran — Punkt für %team%! 🏐',
      'Perfektes Zuspiel, explosiver Angriff — %player% schlägt durch den Block! 💥',
      'Ass! Der Aufschlag landet unhaltbar in der Ecke! 🎯',
      '%player% mit einem Monster-Block — Punkt bleibt im Haus! 🧱',
      '%team% setzt den Quick durch die Mitte — kein Halten mehr! ⚡',
      'Pipe-Angriff! %player% knallt den Ball auf den Boden! 🔨',
      'Tooling am Block — Ball geht raus, Punkt %team%! 🎨',
      'Super-Annahme, perfekter Aufbau, harter Angriff — Punkt %team%!',
      'Float-Aufschlag tanzt ins Feld — der Annehmer ist machtlos! 🪁',
      '%player% mit dem Kill diagonal — der Diagonal-Angreifer schlägt zu! 💢',
      'Cobra! %player% spielt mit den Fingern den Ball auf den Boden! 🐍',
      'Slide hinter dem Setter — %player% fängt sie eiskalt! 🔒',
      'Joust am Netz, %team% drückt durch! 🤜',
      'Sprung-Aufschlag mit Topspin — der Annehmer fasst nur Luft! 🌪️',
      'Schnellangriff über die Drei — %player% trifft den Boden punktgenau!',
      'Block-out clever provoziert — %team% bekommt den Punkt geschenkt! 🪤',
      'Reservespieler reingebracht und sofort den Punkt gemacht! 🔄',
      '%player% mit einem Lob in die Lücke — die Verteidigung steht falsch! 🎯',
      'Zweite Welle! Nach dem Block schlägt %player% noch ein zweites Mal zu! 🌊',
      'Set perfectly placed — %player% spikes it into the joint zone! 🎯',
    ],
    away_score: [
      'Fehler im Aufbau — %team% nutzt die Chance sofort aus! ⚡',
      'Der Angriff geht ins Aus — Seitenball für %team%! 😬',
      'Starke Annahme, schneller Konter — %team% punktet! 🔥',
      'Aufschlagfehler! %team% bekommt den Punkt geschenkt. 😤',
      '%player% verteidigt brillant — %team% nutzt den Konter! 🛡️',
      'Block-Out! Der Block lenkt den Ball nach hinten ab — %team% punktet.',
      'Netzberührung im Angriff — %team% bedankt sich. 🙄',
      '%team% mit einem cleveren Tip in die Lücke — Punkt!',
      'Joust am Netz, der Ball fällt drüben rüber — %team% jubelt!',
      'Doppelkontakt im Aufbau — Punkt geht an %team%. 😳',
      'Pancake! %player% rettet den unmöglichen Ball — %team% kontert! 🥞',
      'Sprungservice im Aus — %team% übernimmt. 📐',
      'Rotationsfehler! Punkt für %team%, ohne dass der Ball über das Netz musste. 🔁',
      'Zaitsev-mässiger Sprung — %player% spickt den Ball über den Block! ⛳',
      'Verschickter Block — Ball fliegt direkt ins Feld der Heimmannschaft. 🪃',
      'Aufschlag direkt in die Mitte zwischen drei Annehmer — niemand übernimmt! 😬',
      'Ball runter, ohne dass jemand reagiert — kollektive Verwirrung! 🤷',
      '%team% spielt einen perfekten Quick — der Block kommt zu spät! 🚀',
      'Risikoreicher Sprungaufschlag, perfektes Ass! 🎯',
      'Der Heim-Setter zögert — %team% zieht den Punkt! ⏱️',
    ],
    set_won: [
      '%team% holt den Satz mit einem starken Endspurt!',
      'Was für ein Set-Finale! %team% nimmt den Satz!',
      '%team% beendet den Satz mit einem Aufschlag-Lauf!',
      'Sieg-Punkt für %team% — Halbzeit-Atmosphäre in der Halle!',
      '%team% drückt den Satz nach Hause — die Tribüne tobt!',
    ],
    match_won: [
      '%team% gewinnt das Match — verdient!',
      '%team% holt sich die drei Sätze — Showtime!',
      'Großer Auftritt von %team% — Match gewonnen!',
      'Match-Ball verwandelt — %team% feiert!',
    ],
  },
  en: {
    home_score: [
      'Powerful serve! The libero can’t handle it — point for %team%! 🏐',
      'Perfect set, explosive spike — %player% hammers through the block! 💥',
      'Ace! The serve lands untouched in the corner! 🎯',
      '%player% with a monster block — point stays home! 🧱',
      '%team% runs the quick through the middle — unstoppable! ⚡',
      'Pipe attack! %player% pounds it down! 🔨',
      'Tooling the block — ball flies out, point %team%! 🎨',
      'Solid pass, clean set, big attack — point %team%!',
      'Float serve dances into the court — receiver beaten! 🪁',
      '%player% with a cross-court kill from the diagonal! 💢',
      'Cobra! %player% finger-tips the ball straight down! 🐍',
      'Slide behind the setter — %player% drills it home! 🔒',
      'Joust at the net, %team% wins the push! 🤜',
      'Jump-serve with topspin — receiver waves at it! 🌪️',
      'Quick attack — %player% finds the seam!',
      'Block-out drawn cleverly — gift point for %team%! 🪤',
      'Substitute steps in and scores immediately! 🔄',
      '%player% lobs into the gap — defense out of position! 🎯',
      'Second wave — %player% scores after a deflection! 🌊',
      'Perfectly-placed set — %player% drives it home! 🎯',
    ],
    away_score: [
      'Error in the system — %team% pounces! ⚡',
      'The attack goes wide — sideout for %team%! 😬',
      'Great dig, fast counter — %team% scores! 🔥',
      'Service error! %team% gets the point for free. 😤',
      '%player% defends brilliantly — %team% closes the counter! 🛡️',
      'Block-out! The block deflects long — point %team%.',
      'Net touch on attack — %team% says thanks. 🙄',
      '%team% tips into the gap — point!',
      'Joust at the net, ball drops on their side — %team% celebrates!',
      'Double contact on the set — point %team%. 😳',
      'Pancake save by %player% — %team% counter-attacks! 🥞',
      'Jump-serve sails wide — %team% takes over. 📐',
      'Rotation fault! Free point for %team%. 🔁',
      'Massive jump from %player% — bypasses the block! ⛳',
      'Botched block sends the ball back home — %team% capitalizes! 🪃',
      'Serve splits three receivers — chaos! 😬',
      'Ball drops untouched — communication breakdown! 🤷',
      '%team% runs a perfect quick — the block is late! 🚀',
      'Risky jump-serve, perfect ace! 🎯',
      'Home setter hesitates — %team% takes the point! ⏱️',
    ],
    set_won: [
      '%team% takes the set with a strong finish!',
      'What a finale! %team% takes the set!',
      '%team% closes the set on a service run!',
      'Set point converted — buzz around the arena!',
      '%team% drives the set home — crowd erupts!',
    ],
    match_won: [
      '%team% wins the match — well deserved!',
      '%team% takes three sets — showtime!',
      'Huge performance by %team% — match won!',
      'Match point converted — %team% celebrates!',
    ],
  }
};

// ────────────────────────────────────────────────────────────────
//  Helpers
// ────────────────────────────────────────────────────────────────
const $ = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const T = (k) => (i18n[state.lang] && i18n[state.lang][k]) || k;
const fmt = (str, ...args) => { let i=0; return str.replace(/%[ds]|%(\d+)/g, () => args[i++]); };
const fmtMoney = n => (n||0).toLocaleString('de-CH').replace(/,/g,'’');
const choice = arr => arr[Math.floor(Math.random()*arr.length)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const range = n => Array.from({length:n}, (_,i)=>i);
function hash(str) { let h=0; for (let i=0;i<str.length;i++) h=((h<<5)-h)+str.charCodeAt(i); return Math.abs(h); }
function speedMs(ms) {
  if (state.speed === 'fast') return Math.max(40, ms*0.3);
  if (state.speed === 'auto') return Math.max(15, ms*0.08);
  return ms;
}
function uid(){ return Math.random().toString(36).slice(2,10); }
function escapeHTML(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function cardStars(file) {
  const r = hash(file) % 100;
  if (r < 30) return 1;
  if (r < 58) return 2;
  if (r < 82) return 3;
  if (r < 95) return 4;
  return 5;
}
function cardPrice(stars) { return [0,5000,10000,20000,35000,55000][stars] || 5000; }

// Dice roll utilities
function roll(n) { return 1 + Math.floor(Math.random()*n); }

// Build flat card pool with stable IDs
function buildAllCards() {
  if (typeof CARDS === 'undefined') return [];
  const all = [];
  for (const pos of Object.keys(CARDS)) {
    const def = CARDS[pos];
    for (const f of def.files) {
      const id = pos + '/' + f;
      const url = (def.folder ? def.folder + '/' : '') + f;
      const stars = cardStars(f);
      const num = (f.match(/(\d+)/) || ['','00'])[1];
      const name = (def.label_en || pos).replace(/\s+/g,'') + ' #' + num;
      all.push({ id, pos, file:f, url, stars, name, price: cardPrice(stars) });
    }
  }
  return all;
}
let ALL_CARDS = [];

// ────────────────────────────────────────────────────────────────
//  State
// ────────────────────────────────────────────────────────────────
const state = {
  lang: localStorage.getItem('vv_lang') || 'de',
  soundOn: localStorage.getItem('vv_sound') === '1',
  view: 'splash',
  introIdx: 0,
  playerName: localStorage.getItem('vv_name') || '',
  mode: null,
  speed: localStorage.getItem('vv_speed') || 'normal',
  game: null,
};

// ────────────────────────────────────────────────────────────────
//  Toast / log / flash / beep
// ────────────────────────────────────────────────────────────────
function toast(msg, kind='', ms=2500) {
  const layer = $('#toast-layer'); if (!layer) return;
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' '+kind : '');
  el.textContent = msg;
  layer.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity 0.3s'; setTimeout(()=>el.remove(),300); }, ms);
}
function flash(kind='win') {
  let f = $('#flash');
  if (!f) { f = document.createElement('div'); f.id='flash'; f.className='flash'; document.body.appendChild(f); }
  f.className = 'flash ' + kind;
  requestAnimationFrame(() => { f.classList.add('show'); setTimeout(()=>f.classList.remove('show'), 700); });
}
function logEntry(text, kind='') {
  state.game && state.game.log.push({ text, kind });
  // Try the floating log first, fall back to inline
  const containers = [$('#log-feed'), $('#log')].filter(Boolean);
  if (!containers.length) return;
  for (const log of containers) {
    const e = document.createElement('div');
    e.className = 'log-entry' + (kind ? ' ' + kind : '');
    e.innerHTML = `<span class="ts">${new Date().toLocaleTimeString('de-CH', {hour:'2-digit',minute:'2-digit'})}</span>${text}`;
    log.appendChild(e);
    log.scrollTop = log.scrollHeight;
    while (log.children.length > 100) log.removeChild(log.firstChild);
  }
}

function ensureFloatingLog() {
  let lp = document.getElementById('log-panel');
  if (!lp) {
    lp = document.createElement('div');
    lp.id = 'log-panel';
    lp.className = 'lp ' + (window.innerWidth < 800 ? 'collapsed' : 'expanded');
    document.body.appendChild(lp);
  }
  if (!state.game || state.view !== 'game') { lp.style.display = 'none'; return; }
  lp.style.display = '';
  const expanded = lp.classList.contains('expanded');
  lp.innerHTML = `
    <div class="lp-head" onclick="VV.toggleLog()">
      <span class="lp-title">📜 ${state.lang==='de'?'Live-Log':'Live log'}</span>
      <span class="lp-toggle">${expanded?'▼':'▲'}</span>
    </div>
    <div class="lp-body" id="log-feed"></div>`;
}
function toggleLog() {
  const lp = document.getElementById('log-panel'); if (!lp) return;
  lp.classList.toggle('expanded');
  lp.classList.toggle('collapsed');
  ensureFloatingLog();
  // restore scrollback after re-render
  if (state.game) for (const e of state.game.log.slice(-30)) {
    const f = document.getElementById('log-feed');
    if (!f) break;
    const el = document.createElement('div');
    el.className = 'log-entry' + (e.kind?' '+e.kind:'');
    el.innerHTML = `<span class="ts">·</span>${e.text}`;
    f.appendChild(el);
  }
}
let audioCtx = null;
function beep(freq=440, dur=80, type='square', vol=0.05) {
  if (!state.soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g).connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur/1000);
  } catch (e) {}
}

// ────────────────────────────────────────────────────────────────
//  View switching
// ────────────────────────────────────────────────────────────────
function setView(v) {
  state.view = v;
  document.getElementById('app').dataset.view = v;
  render();
  window.scrollTo(0, 0);
  // Hide floating log + panel outside game
  const lp = document.getElementById('log-panel'); if (lp) lp.style.display = (v === 'game') ? '' : 'none';
  const fp = document.getElementById('floating-panel'); if (fp) fp.style.display = (v === 'game') ? '' : 'none';
}
function setLang(l) {
  state.lang = l;
  localStorage.setItem('vv_lang', l);
  document.documentElement.lang = l;
  render();
}
function setSpeed(s) { state.speed = s; localStorage.setItem('vv_speed', s); render(); }

// Wait/fire helpers
const _waiters = {};
function waitFor(name, autoMs) {
  return new Promise(resolve => {
    if (!name) { setTimeout(resolve, autoMs||1); return; }
    _waiters[name] = resolve;
    if (autoMs) setTimeout(() => { if (_waiters[name]) { delete _waiters[name]; resolve(); } }, autoMs);
  });
}
function fire(name, val) {
  const r = _waiters[name];
  if (r) { delete _waiters[name]; r(val); }
}

// ────────────────────────────────────────────────────────────────
//  Position helpers
// ────────────────────────────────────────────────────────────────
const POSITIONS = ['outside','middle','setter','diagonal','libero'];
const POS_COLORS = { outside:'#e84317', middle:'#16a34a', setter:'#0ea5e9', diagonal:'#4f46e5', libero:'#ca8a04' };
function posShort(p) { return T('pos_short_'+p); }
function posLabel(p) { return T('pos_'+p); }
function posColor(p) { return POS_COLORS[p]; }

function teamStrength(p) {
  return POSITIONS.reduce((s,k) => s + ((p.team[k] && !p.team[k].disabled ? p.team[k].stars : 0)), 0);
}
function teamFront(p) { return ['outside','middle','setter'].reduce((s,k) => s + ((p.team[k]&&!p.team[k].disabled?p.team[k].stars:0)),0); }
function teamBack(p)  { return ((p.team.libero&&!p.team.libero.disabled?p.team.libero.stars:0)) + ((p.team.diagonal&&!p.team.diagonal.disabled?p.team.diagonal.stars:0)) + ((p.team.outside&&!p.team.outside.disabled?p.team.outside.stars:0)/2); }
function teamBlock(p) { return ['outside','middle'].reduce((s,k) => s + ((p.team[k]&&!p.team[k].disabled?p.team[k].stars:0)),0); }


// ────────────────────────────────────────────────────────────────
//  3D DICE — improved (multi-type, animated, pretty)
// ────────────────────────────────────────────────────────────────
const DICE = {
  three: null,
  cur: null,
};

function ensureDiceArea() {
  let area = $('.dice-area');
  if (!area) return null;
  let holder = $('.dice-3d', area);
  if (!holder) {
    holder = document.createElement('div'); holder.className='dice-3d';
    area.insertBefore(holder, area.firstChild);
  }
  return holder;
}

// Build dice mesh of type d3 / d6 / d12.  Faces have a number texture.
function buildDiceMesh(type) {
  const THREE_ = window.THREE;
  if (!THREE_) return null;
  let mesh, faces;
  const matBase = { roughness: 0.35, metalness: 0.4, emissive: 0x331400, emissiveIntensity: 0.18 };
  if (type === 6) {
    const mats = [];
    for (let i = 1; i <= 6; i++) mats.push(new THREE_.MeshStandardMaterial({ ...matBase, color: 0xe84317, map: faceTexture(i, '#e84317', '#fff8e6') }));
    const g = new THREE_.BoxGeometry(1.4, 1.4, 1.4);
    mesh = new THREE_.Mesh(g, mats);
    // Box face indexing: 0:+x, 1:-x, 2:+y, 3:-y, 4:+z, 5:-z. We label 1..6 in that order.
    faces = [
      { value: 1, dir: [ 1, 0, 0] }, // +x
      { value: 2, dir: [-1, 0, 0] }, // -x
      { value: 3, dir: [ 0, 1, 0] }, // +y
      { value: 4, dir: [ 0,-1, 0] }, // -y
      { value: 5, dir: [ 0, 0, 1] }, // +z
      { value: 6, dir: [ 0, 0,-1] }, // -z
    ];
    return { mesh, faces };
  }
  if (type === 3) {
    // Tetrahedron — 4 faces. We pretend it's a d3 by mapping only 3 of them; 4th re-rolls.
    const g = new THREE_.TetrahedronGeometry(1.3, 0);
    const mat = new THREE_.MeshStandardMaterial({ ...matBase, color: 0xfacc15, flatShading: true });
    mesh = new THREE_.Mesh(g, mat);
    // Tet face normals (manually derived)
    faces = [
      { value: 1, dir: [ 1, 1, 1] },
      { value: 2, dir: [-1,-1, 1] },
      { value: 3, dir: [-1, 1,-1] },
      { value: 1, dir: [ 1,-1,-1] }, // 4th face also shows 1 (we re-roll on 4)
    ];
    // Add edge highlight
    const edges = new THREE_.LineSegments(new THREE_.EdgesGeometry(g), new THREE_.LineBasicMaterial({ color: 0xfff8e6, transparent: true, opacity: 0.7 }));
    mesh.add(edges);
    return { mesh, faces };
  }
  // d12 — Dodecahedron with 12 face-colored pentagons.
  const g = new THREE_.DodecahedronGeometry(1.3, 0);
  const mat = new THREE_.MeshStandardMaterial({ ...matBase, color: 0xe84317, flatShading: true });
  mesh = new THREE_.Mesh(g, mat);
  // Add edges and small "facet number" sprite that we manually orient post-roll
  const edges = new THREE_.LineSegments(new THREE_.EdgesGeometry(g), new THREE_.LineBasicMaterial({ color: 0xfacc15 }));
  mesh.add(edges);
  // Compute face centers / normals
  const pos = g.getAttribute('position');
  const seen = new Set(); const centers = [];
  for (let i = 0; i < pos.count; i += 3) {
    // each triangle's normal — but pentagons share normal, so dedupe by rounded normal
    const v0 = [pos.getX(i),  pos.getY(i),  pos.getZ(i)];
    const v1 = [pos.getX(i+1),pos.getY(i+1),pos.getZ(i+1)];
    const v2 = [pos.getX(i+2),pos.getY(i+2),pos.getZ(i+2)];
    const nx = (v0[0]+v1[0]+v2[0])/3, ny = (v0[1]+v1[1]+v2[1])/3, nz = (v0[2]+v1[2]+v2[2])/3;
    const len = Math.sqrt(nx*nx+ny*ny+nz*nz);
    const dir = [nx/len, ny/len, nz/len];
    const key = dir.map(v => v.toFixed(2)).join(',');
    if (!seen.has(key)) { seen.add(key); centers.push(dir); }
  }
  faces = centers.slice(0, 12).map((d, idx) => ({ value: idx+1, dir: d }));
  return { mesh, faces };
}

// Tiny canvas-based face texture (a number on a circle)
function faceTexture(num, fg, bg) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = fg; ctx.fillRect(0,0,128,128);
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.arc(64, 64, 50, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = fg;
  ctx.font = 'bold 70px "Barlow Condensed", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(num), 64, 70);
  const tex = new window.THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function setupDiceScene(holder, type) {
  const THREE_ = window.THREE;
  if (!THREE_) return null;
  while (holder.firstChild) holder.removeChild(holder.firstChild);
  const w = holder.clientWidth || 200, h = holder.clientHeight || 200;
  const scene = new THREE_.Scene();
  const camera = new THREE_.PerspectiveCamera(40, w/h, 0.1, 100);
  camera.position.set(0, 0, 5);
  const renderer = new THREE_.WebGLRenderer({ alpha:true, antialias:true });
  renderer.setSize(w, h); renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  holder.appendChild(renderer.domElement);
  // Lights
  scene.add(new THREE_.AmbientLight(0xffffff, 0.55));
  const dl = new THREE_.DirectionalLight(0xffffff, 0.95); dl.position.set(2,3,4); scene.add(dl);
  const rim = new THREE_.DirectionalLight(0xfacc15, 0.4); rim.position.set(-3,-2,2); scene.add(rim);
  const built = buildDiceMesh(type);
  if (!built) return null;
  scene.add(built.mesh);
  return { scene, camera, renderer, holder, mesh: built.mesh, faces: built.faces, type };
}

// Compute a quaternion rotating face direction `dir` to (0,0,1) (pointing camera)
function rotationToFace(dir) {
  const THREE_ = window.THREE;
  const v = new THREE_.Vector3(...dir).normalize();
  const target = new THREE_.Vector3(0, 0, 1);
  const q = new THREE_.Quaternion().setFromUnitVectors(v, target);
  return q;
}

async function rollDice(type, value) {
  const THREE_ = window.THREE;
  const numEl = $('#dice-num');
  if (numEl) { numEl.textContent = '…'; numEl.style.color = ''; }
  const holder = ensureDiceArea();
  if (!holder || !THREE_) {
    // Fallback — animate the number only
    const dur = speedMs(700);
    const start = performance.now();
    return new Promise(r => {
      function tick(t) {
        const k = (t - start)/dur;
        if (numEl) numEl.textContent = roll(type);
        if (k < 1) requestAnimationFrame(tick);
        else { if (numEl) numEl.textContent = value; r(); }
      }
      requestAnimationFrame(tick);
    });
  }
  // Build/refresh scene if needed
  if (!DICE.cur || DICE.cur.holder !== holder || DICE.cur.type !== type) {
    DICE.cur = setupDiceScene(holder, type);
  }
  const D = DICE.cur;
  if (!D) return;
  // Find a face with the desired value
  const targetFace = (type === 3
    ? D.faces.filter(f => f.value === value)[Math.floor(Math.random()*D.faces.filter(f=>f.value===value).length)]
    : D.faces.find(f => f.value === value)) || D.faces[0];
  const targetQ = rotationToFace(targetFace.dir);
  const startQ = D.mesh.quaternion.clone();
  // Wild random spin axes
  const spinAxis1 = new THREE_.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
  const spinAxis2 = new THREE_.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
  return new Promise(resolve => {
    const dur = speedMs(1100);
    const t0 = performance.now();
    function frame(t) {
      const k = Math.min(1, (t - t0)/dur);
      // Phase A: chaotic spin
      const eased = 1 - Math.pow(1 - k, 3);    // ease-out cubic
      // intensity decays
      const spinIntensity = (1 - k) * 6.5 + 0.4;
      // Mix two axis rotations smoothly
      const angle1 = (1 - k) * Math.PI * 4 * spinIntensity;
      const angle2 = (1 - k) * Math.PI * 3 * spinIntensity;
      const q1 = new THREE_.Quaternion().setFromAxisAngle(spinAxis1, angle1);
      const q2 = new THREE_.Quaternion().setFromAxisAngle(spinAxis2, angle2);
      const spinQ = q1.multiply(q2);
      // Slerp to target quaternion as k → 1
      D.mesh.quaternion.slerpQuaternions(spinQ, targetQ, eased);
      // Bounce position (subtle vertical bob)
      const bobY = Math.sin(k*Math.PI*4) * (1-k) * 0.18;
      D.mesh.position.y = bobY;
      D.renderer.render(D.scene, D.camera);
      if (k < 1) requestAnimationFrame(frame);
      else {
        D.mesh.quaternion.copy(targetQ);
        D.mesh.position.set(0, 0, 0);
        D.renderer.render(D.scene, D.camera);
        if (numEl) {
          numEl.textContent = value;
          numEl.style.transform = 'scale(1.4)'; numEl.style.color = '#facc15';
          setTimeout(() => { numEl.style.transform = 'scale(1)'; }, 180);
        }
        beep(680 + value*15, 90);
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

function performDiceRoll(type) {
  const value = roll(type);
  // For our pseudo-d3 (tetrahedron with 4 faces), if rolled 4 (which we mapped to dup of 1), reroll once
  return rollDice(type, value).then(() => value);
}


// ────────────────────────────────────────────────────────────────
//  CONFETTI (canvas)
// ────────────────────────────────────────────────────────────────
let confettiAnim = null;
function startConfetti(durationMs = 8000) {
  const c = $('#confetti'); if (!c) return;
  const ctx = c.getContext('2d');
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const colors = ['#e84317','#f97316','#f59e0b','#facc15','#fff','#0ea5e9','#16a34a'];
  const N = 180;
  const parts = Array.from({length:N}, () => ({
    x: Math.random()*c.width, y: -20 - Math.random()*c.height*0.5,
    vx: -2 + Math.random()*4, vy: 2 + Math.random()*5,
    r: 4 + Math.random()*7, color: choice(colors), rot: Math.random()*Math.PI*2, vrot: -0.2 + Math.random()*0.4,
    shape: Math.random() < 0.5 ? 'rect' : 'circle',
  }));
  const start = performance.now();
  function frame(t) {
    ctx.clearRect(0,0,c.width,c.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.rot += p.vrot;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') ctx.fillRect(-p.r/2, -p.r/4, p.r, p.r/2);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r/2, 0, Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
    if (t - start < durationMs) confettiAnim = requestAnimationFrame(frame);
    else { ctx.clearRect(0,0,c.width,c.height); confettiAnim = null; }
  }
  cancelAnimationFrame(confettiAnim);
  confettiAnim = requestAnimationFrame(frame);
}

// ────────────────────────────────────────────────────────────────
//  BOOT, INTRO, MENU
// ────────────────────────────────────────────────────────────────
function boot() {
  ALL_CARDS = buildAllCards();
  const stBtn = $('#sound-toggle');
  if (stBtn) {
    stBtn.hidden = false;
    stBtn.textContent = state.soundOn ? '🔊' : '🔇';
    stBtn.addEventListener('click', () => {
      state.soundOn = !state.soundOn;
      localStorage.setItem('vv_sound', state.soundOn?'1':'0');
      stBtn.textContent = state.soundOn ? '🔊' : '🔇';
      if (state.soundOn) beep(660, 80);
    });
  }
  const seenIntro = localStorage.getItem('vv_seenIntro') === '1';
  setView(seenIntro ? 'menu' : 'intro');
}

function renderIntro() {
  const app = $('#app');
  const slides = [
    { icon:'🏗️', h:T('intro1_h'), p:T('intro1_p') },
    { icon:'🏆', h:T('intro2_h'), p:T('intro2_p') },
    { icon:'🎯', h:T('intro3_h'), p:T('intro3_p') },
  ];
  const idx = state.introIdx;
  app.innerHTML = `
    <div class="intro">
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
      <div class="intro-slides">
        ${slides.map((s,i)=>`
          <div class="intro-slide ${i===idx?'active':''}">
            <div class="intro-icon">${s.icon}</div>
            <div class="intro-h ${i===1?'accent':''}">${s.h}</div>
            <div class="intro-p">${s.p}</div>
          </div>`).join('')}
      </div>
      <div class="intro-dots">${slides.map((_,i)=>`<span class="intro-dot ${i===idx?'active':''}"></span>`).join('')}</div>
      <div class="intro-actions">
        <button class="btn btn-secondary" onclick="VV.skipIntro()">${T('intro_skip')}</button>
        <button class="btn btn-primary" onclick="VV.advanceIntro()">${idx===slides.length-1?T('intro_start'):T('intro_next')}</button>
      </div>
    </div>`;
}
function advanceIntro() {
  if (state.introIdx >= 2) { localStorage.setItem('vv_seenIntro','1'); setView('menu'); return; }
  state.introIdx += 1; renderIntro();
}
function skipIntro() { localStorage.setItem('vv_seenIntro','1'); setView('menu'); }

function renderMenu() {
  const app = $('#app');
  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.4rem;">
          <div class="menu-title"><span>${T('menu_title_l1')}</span> <span class="accent">${T('menu_title_l2')}</span></div>
          <div style="display:flex; gap:0.4rem;">
            <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
            <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
          </div>
        </div>
        <div class="menu-sub">${T('menu_sub')}</div>
        <div class="menu-row">
          <label class="label">${T('menu_name_label')}</label>
          <input class="input" id="player-name" placeholder="${T('menu_name_ph')}" value="${escapeHTML(state.playerName)}" maxlength="20"/>
        </div>
        <div class="menu-actions">
          <button class="btn btn-primary btn-large" data-tip="${T('menu_solo_t')}" onclick="VV.startSolo()">${T('menu_solo')} ▸</button>
          <button class="btn btn-secondary btn-large" data-tip="${T('menu_mp_t')}" onclick="VV.openMultiplayer()">${T('menu_mp')} ▸</button>
        </div>
      </div>
    </div>`;
}

function startSolo() {
  const name = ($('#player-name')||{}).value || state.playerName || (state.lang==='de'?'Spieler':'Player');
  state.playerName = name.trim().slice(0,20) || (state.lang==='de'?'Spieler':'Player');
  localStorage.setItem('vv_name', state.playerName);
  state.mode = 'solo';
  initSoloGame();
  setView('draft');
}
function openMultiplayer() {
  const name = ($('#player-name')||{}).value || state.playerName || '';
  state.playerName = name.trim().slice(0,20);
  localStorage.setItem('vv_name', state.playerName);
  if (!state.playerName) { toast(state.lang==='de'?'Bitte zuerst einen Namen eingeben.':'Please enter a name first.', 'bad'); return; }
  setView('mp_submenu');
}

function renderMpSubmenu() {
  const app = $('#app');
  const mpAvail = window.VV_FIREBASE && window.VV_FIREBASE.isAvailable();
  app.innerHTML = `
    <div class="menu-wrap">
      <div class="menu-card">
        <button class="menu-back" onclick="VV.setView('menu')">‹ ${T('menu_back')}</button>
        <div class="menu-title"><span class="accent">${T('menu_mp')}</span></div>
        <div class="menu-sub">${escapeHTML(state.playerName)}</div>
        ${!mpAvail ? `<div class="toast bad" style="margin-bottom:1rem; pointer-events:auto;">${T('mp_unavailable')}</div>` : ''}
        <div class="menu-actions">
          <button class="btn btn-primary btn-large" ${!mpAvail?'disabled':''} data-tip="${T('mp_create_t')}" onclick="VV.createRoom()">${T('mp_create')} ▸</button>
          <button class="btn btn-secondary btn-large" ${!mpAvail?'disabled':''} data-tip="${T('mp_join_t')}" onclick="VV.showJoinForm()">${T('mp_join')} ▸</button>
        </div>
      </div>
    </div>`;
}
function createRoom() { toast(T('mp_unavailable'), 'bad', 4000); }
function showJoinForm() { toast(T('mp_unavailable'), 'bad', 4000); }


// ────────────────────────────────────────────────────────────────
//  GAME INIT
// ────────────────────────────────────────────────────────────────
function makePlayer(name, color, emoji, isHuman, personality, biasPos) {
  return {
    id: uid(), name, color, emoji, isHuman: !!isHuman, personality: personality || 'balanced', biasPos: biasPos || 'outside',
    money: 80000, vp: 0,
    team: { outside:null, middle:null, setter:null, diagonal:null, libero:null },
    bench: [],
    matchesWon: 0, totalEarned: 0,
    leaguePoints: 0,
    flag: choice(['IT','BR','PL','FR','USA','RU','JP','SLO']),
    starterIdx: 0,  // who the starting player is (set after starting roll)
  };
}

function initSoloGame() {
  ALL_CARDS = buildAllCards();
  const human = makePlayer(state.playerName, '#facc15', '🟡', true, 'balanced', 'outside');
  const bots = window.VV_BOTS.pickPersonas(3);
  const bot1 = makePlayer('Bot ' + bots[0].name, bots[0].color, bots[0].emoji, false, bots[0].personality, bots[0].biasPos);
  const bot2 = makePlayer('Bot ' + bots[1].name, bots[1].color, bots[1].emoji, false, bots[1].personality, bots[1].biasPos);
  const bot3 = makePlayer('Bot ' + bots[2].name, bots[2].color, bots[2].emoji, false, bots[2].personality, bots[2].biasPos);
  state.game = {
    players: [human, bot1, bot2, bot3],
    activeIdx: 0,
    week: 0,
    phase: 'draft',
    log: [],
    market: [],
    auctionDeck: [],   // shuffled 2-5 star cards for in-game auctions/transfers
    drafted: 0,        // how many players completed their draft
    coneDay: 1,        // black cone position on the timeline (day 1 → 50)
    weekResults: [],
    over: false, winner: null,
    leagueMatchesPlayed: 0,
  };
  // Build auction deck: all 2-5 star cards (1-star are fixed-price separate)
  const aDeck = ALL_CARDS.filter(c => c.stars >= 2).slice().sort(()=>Math.random()-0.5);
  state.game.auctionDeck = aDeck;
}

// ────────────────────────────────────────────────────────────────
//  BLIND DRAFT (Setup Step 2 from rulebook)
// ────────────────────────────────────────────────────────────────
function renderDraft() {
  const app = $('#app');
  const g = state.game;
  const me = g.players[0];
  const haveCount = me.bench.length + Object.values(me.team).filter(Boolean).length;
  const stage = computeDraftStage(me);
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('setup_h')} · ${T('draft_h')}</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    <div style="padding:1.5rem; max-width:1000px; margin:0 auto;">
      <h2 class="h-cond" style="font-size:2rem; margin-bottom:0.3rem;">${T('draft_h')}</h2>
      <div style="color:var(--silver); margin-bottom:1.4rem;">${T('draft_p')}</div>
      <div class="draft-progress">${draftProgressHtml(me)}</div>
      <div class="draft-actions" id="draft-actions" style="margin-top:1.4rem;">${draftActionsHtml(stage, me)}</div>
      <div style="margin-top:2rem;">
        <h3 class="h-cond" style="font-size:1.1rem; margin-bottom:0.6rem;">${T('your')} · ${escapeHTML(me.name)} · ${fmtMoney(me.money)}</h3>
        <div class="draft-cards" id="draft-cards">${draftHandHtml(me)}</div>
      </div>
    </div>`;
}

function computeDraftStage(p) {
  const counts = countByStars([...p.bench, ...Object.values(p.team).filter(Boolean)]);
  if (counts[4] < 1) return 'draw_4';
  if (counts[3] < 2) return 'draw_3';
  if (counts[2] < 3) return 'draw_2';
  if (counts[1] < 3) return 'pick_1';
  return 'done';
}

function countByStars(cards) {
  const c = {1:0,2:0,3:0,4:0,5:0};
  for (const x of cards) if (x) c[x.stars] = (c[x.stars]||0)+1;
  return c;
}

function draftProgressHtml(p) {
  const c = countByStars([...p.bench, ...Object.values(p.team).filter(Boolean)]);
  const stage = computeDraftStage(p);
  const items = [
    { label:'1× 4★', got:c[4], target:1, key:'draw_4' },
    { label:'2× 3★', got:c[3], target:2, key:'draw_3' },
    { label:'3× 2★', got:c[2], target:3, key:'draw_2' },
    { label:'3× 1★', got:c[1], target:3, key:'pick_1' },
  ];
  return `<div class="draft-steps">${items.map(i => `
    <div class="draft-step ${i.got>=i.target?'done':''} ${i.key===stage?'active':''}">
      <span class="step-num">${i.label}</span>
      <span class="step-check">${i.got}/${i.target}</span>
    </div>`).join('')}</div>`;
}

function draftActionsHtml(stage, p) {
  if (stage === 'draw_4' || stage === 'draw_3' || stage === 'draw_2') {
    const stars = stage === 'draw_4' ? 4 : stage === 'draw_3' ? 3 : 2;
    const stepLabel = T('draft_step_' + stars);
    // can redraw if there are >3 cards of any single position
    const counts = {};
    [...p.bench, ...Object.values(p.team).filter(Boolean)].forEach(c => { counts[c.pos] = (counts[c.pos]||0)+1; });
    const canRedraw = Object.values(counts).some(v => v > 3);
    return `<div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
      <span class="label" style="margin-bottom:0;">${stepLabel}</span>
      <button class="btn btn-primary" onclick="VV.draftDraw(${stars})">${T('draft_pick')} (${stars}★)</button>
      ${canRedraw ? `<button class="btn btn-secondary" onclick="VV.draftRedraw()">${T('draft_redraw')}</button>` : ''}
    </div>`;
  }
  if (stage === 'pick_1') {
    return `<div>
      <div class="label">${T('draft_step_1')}</div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.4rem;">
        ${POSITIONS.map(pos => `<button class="btn btn-ghost" onclick="VV.draftPick1('${pos}')" style="border-left:3px solid ${posColor(pos)};">${posLabel(pos)} ${posShort(pos)}</button>`).join('')}
      </div>
    </div>`;
  }
  // done
  return `<button class="btn btn-primary btn-large" onclick="VV.draftFinish()">${T('draft_continue')}</button>`;
}

function draftHandHtml(p) {
  const all = [...Object.values(p.team).filter(Boolean), ...p.bench];
  if (!all.length) return `<div style="color:var(--silver); font-style:italic;">—</div>`;
  return all.map(c => `
    <div class="draft-card" data-tip="${c.name} · ${c.stars}★">
      <span class="pos-tag" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <img src="${c.url}" alt="" loading="lazy">
      <div class="draft-stars">${'★'.repeat(c.stars)}</div>
    </div>`).join('');
}

function deckPoolForStars(stars) {
  // Pool of 2-4 stars from auctionDeck-like pool. The blind draft draws from a simulated deck
  // that includes ALL cards of that star count (so the human and bots all share the same source pool).
  const g = state.game;
  if (!g._draftDeck) {
    // Build a master draft deck from all 2-4 star cards (1-star are picked, not drawn)
    g._draftDeck = ALL_CARDS.filter(c => c.stars >= 2 && c.stars <= 4).slice().sort(()=>Math.random()-0.5);
  }
  const idx = g._draftDeck.findIndex(c => c.stars === stars);
  if (idx < 0) return null;
  const card = g._draftDeck.splice(idx, 1)[0];
  return card;
}

function placeIntoTeamOrBench(p, card) {
  if (!p.team[card.pos]) {
    p.team[card.pos] = card;
  } else if (p.team[card.pos].stars < card.stars) {
    // upgrade — old goes to bench
    p.bench.push(p.team[card.pos]);
    p.team[card.pos] = card;
  } else {
    p.bench.push(card);
  }
}

function draftDraw(stars) {
  const me = state.game.players[0];
  const c = deckPoolForStars(stars);
  if (!c) { toast('No cards left', 'bad'); return; }
  placeIntoTeamOrBench(me, c);
  beep(740, 60);
  renderDraft();
  // Animate: brief flash
  toast(`+ ${c.name} (${c.stars}★)`, 'good', 1200);
}

function draftRedraw() {
  const me = state.game.players[0];
  // Return all current draft cards to the deck and start over
  const all = [...Object.values(me.team).filter(Boolean), ...me.bench];
  for (const c of all) state.game._draftDeck.push(c);
  state.game._draftDeck.sort(()=>Math.random()-0.5);
  me.team = { outside:null, middle:null, setter:null, diagonal:null, libero:null };
  me.bench = [];
  renderDraft();
}

function draftPick1(pos) {
  const me = state.game.players[0];
  const counts = countByStars([...me.bench, ...Object.values(me.team).filter(Boolean)]);
  if (counts[1] >= 3) { toast('Already 3× 1★', 'bad'); return; }
  // Pick a 1-star card of the given position from the pool
  const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === pos);
  if (!opts.length) { toast(T('no_card_for_pos')||'No card', 'bad'); return; }
  const c = choice(opts);
  placeIntoTeamOrBench(me, c);
  beep(640, 60);
  renderDraft();
}

function draftFinish() {
  // Now do bot drafts (auto)
  const g = state.game;
  for (let i = 1; i < g.players.length; i++) {
    const bot = g.players[i];
    autoDraftBot(bot);
  }
  // Check that the human has all 5 positions filled (otherwise bench cards fill in)
  ensureFiveStarter(g.players[0]);
  state.game.phase = 'auction';
  setView('auction');
}

function autoDraftBot(bot) {
  // Bots receive: 1×4, 2×3, 3×2, 3×1 by position bias
  const draws = [
    { stars: 4, n: 1 },
    { stars: 3, n: 2 },
    { stars: 2, n: 3 },
  ];
  for (const d of draws) for (let i=0; i<d.n; i++) {
    const c = deckPoolForStars(d.stars);
    if (c) placeIntoTeamOrBench(bot, c);
  }
  // Pick 3× 1★ — prefer positions still empty, then bias position
  for (let i = 0; i < 3; i++) {
    const empties = POSITIONS.filter(p => !bot.team[p]);
    let pos = empties.length ? choice(empties) : (bot.biasPos || choice(POSITIONS));
    const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === pos);
    if (opts.length) placeIntoTeamOrBench(bot, choice(opts));
  }
  ensureFiveStarter(bot);
}

function ensureFiveStarter(p) {
  // Move bench cards into empty starter slots for any unfilled position
  for (const pos of POSITIONS) {
    if (!p.team[pos]) {
      const idx = p.bench.findIndex(c => c.pos === pos);
      if (idx >= 0) {
        p.team[pos] = p.bench.splice(idx, 1)[0];
      }
    }
  }
  // If still empty (rare), pick any 1-star card from the pool
  for (const pos of POSITIONS) {
    if (!p.team[pos]) {
      const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === pos);
      if (opts.length) p.team[pos] = choice(opts);
    }
  }
}


// ────────────────────────────────────────────────────────────────
//  OPENING AUCTION  (Setup Step 3)
// ────────────────────────────────────────────────────────────────
async function renderAuction() {
  const app = $('#app');
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('setup_h')} · ${T('auction_h')}</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    <div style="padding:1.5rem; max-width:1000px; margin:0 auto;">
      <h2 class="h-cond" style="font-size:2rem; margin-bottom:0.3rem;">${T('auction_h')}</h2>
      <div style="color:var(--silver); margin-bottom:1.4rem;">${T('auction_sub')}</div>
      <div class="topbar" id="topbar">${state.game.players.map((p,i)=>playerCardHtml(p,i,false)).join('')}</div>
      <div id="auction-stage" class="stage" style="margin-top:1rem;"></div>
    </div>`;
  // Run the 6-card auction
  await runOpeningAuction();
  // Then proceed to starting roll
  setView('starting');
}

async function runOpeningAuction() {
  const g = state.game;
  const cards = g.auctionDeck.splice(0, 6);
  for (let i = 0; i < cards.length; i++) {
    await runAuctionForCard(cards[i], i+1, cards.length);
    refreshTopbar();
    await sleep(speedMs(400));
  }
}

async function runAuctionForCard(card, idx, total) {
  const stage = $('#auction-stage');
  const minBid = card.stars * 10000;
  let high = 0; let highBidder = null;
  // Auction rounds: youngest first (we treat human as youngest), then clockwise
  let currentBid = 0;
  let currentHigh = null;
  // Each round, every player who hasn't passed gets a chance.
  const order = state.game.players.slice(); // human first (index 0)
  let active = order.slice();
  // Keep going until only one player remains willing to bid OR everyone passes
  let lastBidder = null;
  let passes = new Set();

  function paint() {
    stage.innerHTML = `
      <div class="auction-card">
        <div class="auction-meta">
          <div>${fmt(T('auction_card'), idx, total)}</div>
          <div>${T('auction_minbid')}: <b>${fmtMoney(minBid)}</b></div>
        </div>
        <div class="auction-card-row">
          <img class="ac-img" src="${card.url}" alt="">
          <div class="ac-info">
            <div class="ac-pos" style="background:${posColor(card.pos)}">${posShort(card.pos)} · ${posLabel(card.pos)}</div>
            <div class="ac-stars">${'★'.repeat(card.stars)} <span style="color:var(--silver)">${card.name}</span></div>
            <div class="ac-bid">
              <div>${T('auction_currentbid')}: <b style="color:var(--gold)">${currentBid?fmtMoney(currentBid):'—'}</b>${currentHigh?` <span style="color:var(--silver)">(${escapeHTML(currentHigh.name)})</span>`:''}</div>
            </div>
          </div>
        </div>
        <div id="auction-input"></div>
        <div id="auction-feed" class="auction-feed"></div>
      </div>`;
  }
  paint();

  // Loop rounds
  while (true) {
    let bidThisRound = false;
    for (const p of order) {
      if (passes.has(p.id)) continue;
      if (p.id === lastBidder) continue; // don't bid against yourself when you're already high
      paint();
      const minNext = currentBid > 0 ? currentBid + 1000 : minBid;
      if (p.isHuman) {
        // Human input
        const result = await humanBidPrompt(p, card, minNext);
        if (result.pass) {
          passes.add(p.id);
          appendAuctionFeed(`${p.emoji} ${escapeHTML(p.name)} → ${T('auction_pass')}`);
        } else {
          if (result.bid > p.money) { toast(state.lang==='de'?'Nicht genug Geld':'Not enough money', 'bad'); passes.add(p.id); continue; }
          if (result.bid < minNext) { toast(state.lang==='de'?'Gebot zu niedrig':'Bid too low', 'bad'); passes.add(p.id); continue; }
          currentBid = result.bid; currentHigh = p; lastBidder = p.id; bidThisRound = true;
          appendAuctionFeed(`<b>${p.emoji} ${escapeHTML(p.name)}</b> → ${fmtMoney(currentBid)}’`);
          beep(820, 50);
        }
      } else {
        await sleep(speedMs(700));
        const opps = order.filter(o => o !== p);
        const decision = window.VV_BOTS.shouldBid(p, card, currentBid, minNext, opps);
        if (decision.pass) {
          passes.add(p.id);
          appendAuctionFeed(`${p.emoji} ${escapeHTML(p.name)} → ${T('auction_pass')}`);
        } else {
          currentBid = decision.bid; currentHigh = p; lastBidder = p.id; bidThisRound = true;
          appendAuctionFeed(`<b>${p.emoji} ${escapeHTML(p.name)}</b> → ${fmtMoney(currentBid)}’`);
          beep(740, 50);
        }
      }
      // If only one active bidder remains and they're high → win
      const remaining = order.filter(o => !passes.has(o.id));
      if (remaining.length <= 1) break;
    }
    paint();
    // End condition: nobody bid this round, or only the high bidder remains
    const remaining = order.filter(o => !passes.has(o.id));
    if (!bidThisRound || remaining.length <= 1) break;
  }

  // Resolve
  if (currentHigh) {
    currentHigh.money -= currentBid;
    placeIntoTeamOrBench(currentHigh, card);
    appendAuctionFeed(`<b style="color:var(--gold)">${fmt(T('auction_won'), escapeHTML(currentHigh.name), fmtMoney(currentBid))}</b>`);
    beep(900, 120);
  } else {
    appendAuctionFeed(`<b style="color:var(--silver)">${T('auction_no_one')}</b>`);
    state.game.auctionDeck.push(card);  // back on the pile
  }
  refreshTopbar();
  await sleep(speedMs(800));
}

function appendAuctionFeed(html) {
  const feed = $('#auction-feed'); if (!feed) return;
  const el = document.createElement('div');
  el.className = 'af-line';
  el.innerHTML = html;
  feed.appendChild(el);
  feed.scrollTop = feed.scrollHeight;
}

function humanBidPrompt(p, card, minNext) {
  return new Promise(resolve => {
    const inputDiv = $('#auction-input');
    const sugg = Math.min(p.money, minNext);
    inputDiv.innerHTML = `
      <div class="auction-input-row">
        <span class="label" style="margin-bottom:0;">${T('auction_yourbid')}</span>
        <input type="number" class="input" id="bid-input" min="${minNext}" max="${p.money}" step="1000" value="${sugg}" style="max-width:160px;"/>
        <button class="btn btn-primary" id="bid-do">${T('auction_bid')}</button>
        <button class="btn btn-secondary" id="bid-pass">${T('auction_pass')}</button>
      </div>
      <div style="margin-top:0.4rem; font-size:0.75rem; color:var(--silver);">${T('auction_minbid')}: ${fmtMoney(minNext)}’ · ${T('money')}: ${fmtMoney(p.money)}’</div>`;
    $('#bid-do').onclick = () => {
      const v = parseInt($('#bid-input').value || '0', 10);
      inputDiv.innerHTML = '';
      resolve({ bid: v });
    };
    $('#bid-pass').onclick = () => { inputDiv.innerHTML = ''; resolve({ pass: true }); };
    $('#bid-input').focus();
    $('#bid-input').addEventListener('keydown', e => { if (e.key === 'Enter') $('#bid-do').click(); });
  });
}

// ────────────────────────────────────────────────────────────────
//  STARTING-PLAYER ROLL
// ────────────────────────────────────────────────────────────────
function renderStarting() {
  const app = $('#app');
  const g = state.game;
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('setup_h')} · ${T('starting_h')}</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    <div style="padding:1.5rem; max-width:900px; margin:0 auto; text-align:center;">
      <h2 class="h-cond" style="font-size:2rem; margin-bottom:0.3rem;">${T('starting_h')}</h2>
      <div style="color:var(--silver); margin-bottom:1.4rem;">${T('starting_p')}</div>
      <div class="dice-area" style="margin:0 auto;">
        <div class="dice-num" id="dice-num">—</div>
      </div>
      <div id="starting-result" style="margin-top:1.2rem;"></div>
      <button class="btn btn-primary btn-large" id="start-roll-btn" onclick="VV.rollStartingDice()" style="margin-top:1.2rem;">🎲 ${T('starting_roll')}</button>
    </div>`;
}

async function rollStartingDice() {
  const btn = $('#start-roll-btn'); if (btn) btn.disabled = true;
  const g = state.game;
  const result = $('#starting-result');
  const rolls = [];
  for (const p of g.players) {
    const v = await performDiceRoll(12);
    rolls.push({ player: p, roll: v });
    result.innerHTML += `<div style="margin:0.3rem;"><b>${p.emoji} ${escapeHTML(p.name)}</b>: 🎲 <span style="color:var(--gold); font-weight:800;">${v}</span></div>`;
    await sleep(speedMs(400));
  }
  rolls.sort((a,b) => b.roll - a.roll);
  const winner = rolls[0].player;
  g.activeIdx = g.players.indexOf(winner);
  result.innerHTML += `<div style="margin-top:1rem; font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:1.6rem; letter-spacing:2px; text-transform:uppercase; color:var(--gold);">${fmt(T('starting_winner'), escapeHTML(winner.name))}</div>`;
  beep(900, 200);
  await sleep(speedMs(1200));
  // Begin season
  g.phase = 'season';
  g.week = 1; g.coneDay = 1;
  setView('game');
  setTimeout(runSeason, speedMs(400));
}


// ────────────────────────────────────────────────────────────────
//  GAME BOARD / SEASON LOOP
// ────────────────────────────────────────────────────────────────
// Timeline: 6 weeks × 8 days = 48 days, day 1..48 (+ optional 49+ for week 7)
// Day 4 of each week: tournament (varies)
// Day 8 of each week: league match
// Other days: random event spaces (we'll mark days 2, 3, 5, 6, 7 as event days probabilistically)

function weekEventByWeek(w) {
  return [null,
    { type: 'supercup',  day: 4, prize: 15000, weekIdx: 1 },
    { type: 'cl',        day: 4, prize: 20000, weekIdx: 2 },
    { type: 'cup',       day: 4, prize: 20000, weekIdx: 3 },
    { type: 'cl',        day: 4, prize: 20000, weekIdx: 4 },
    { type: 'cupfinal',  day: 4, prize: 20000, weekIdx: 5 },
    { type: 'clfinal',   day: 4, prize: 35000, weekIdx: 6 },
  ][w] || null;
}

// Get global day number (1..48) from week/day
function dayOf(week, dayInWeek) { return (week - 1)*8 + dayInWeek; }
function weekOfDay(day) { return Math.floor((day - 1) / 8) + 1; }
function dayInWeekOf(day) { return ((day - 1) % 8) + 1; }

// Random event for non-special days
const EVENT_TYPES = ['red', 'transfer', 'action', 'vnl', 'injury'];
function randomEventType() { return choice(EVENT_TYPES); }

function renderGame() {
  const app = $('#app');
  const g = state.game;
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('week')} ${g.week} ${T('of')} 6</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    <div class="game">
      <div class="topbar" id="topbar">${g.players.map((p,i)=>playerCardHtml(p,i,true)).join('')}</div>
      <div class="board-row">
        <div class="board" id="board">${boardHtml(g)}</div>
      </div>
      <div class="phase-bar" id="phase-bar"></div>
      <div class="gmain">
        <div class="gleft">
          <div class="stage" id="stage"></div>
        </div>
        <div class="gright">
          <div class="team" id="team-panel">${teamPanelHtml(g.players[0])}</div>
          <div class="actions" id="actions"></div>
        </div>
      </div>
    </div>`;
  ensureFloatingLog();
  for (const e of state.game.log.slice(-30)) logEntry(e.text, e.kind);
  refreshFloatingPanel();
}

function playerCardHtml(p, idx, withBars) {
  const g = state.game;
  const isYou = p.isHuman;
  const isActive = idx === (g && g.activeIdx);
  return `<div class="player-card ${isActive?'active':''} ${isYou?'you':''}" style="border-left:3px solid ${p.color};">
    <div class="pc-name"><span class="pc-emoji">${p.emoji}</span>${escapeHTML(p.name)}</div>
    <div class="pc-stats">
      <div>${T('money')}</div><b>${fmtMoney(p.money)}</b>
      <div>${T('vp')}</div><b>${p.vp}/8</b>
      <div>${T('str')}</div><b>★ ${teamStrength(p)}</b>
      <div>L-Pts</div><b>${p.leaguePoints||0}</b>
    </div>
    ${withBars ? `<div class="pc-vp">${range(8).map(i=>`<span class="${i<p.vp?'fill':''}"></span>`).join('')}</div>` : ''}
  </div>`;
}

function boardHtml(g) {
  // 6 weeks, each week 8 days. Show as horizontal timeline with the cone position marked.
  const weeks = range(6).map(wi => {
    const w = wi + 1;
    const ev = weekEventByWeek(w);
    const days = range(8).map(di => {
      const day = wi*8 + di + 1;
      const isCone = day === g.coneDay;
      const isLeague = di + 1 === 8;
      const isTournament = ev && ev.day === di + 1;
      let cls = 'tile';
      if (isLeague) cls += ' league';
      if (isTournament) cls += ' tournament';
      if (isCone) cls += ' cone';
      const passed = day < g.coneDay;
      if (passed) cls += ' passed';
      let label = '';
      if (isLeague) label = '🏐';
      else if (isTournament) label = ev.type === 'supercup' ? '🏆' : ev.type.startsWith('cl') ? '⭐' : '🏅';
      return `<div class="${cls}" data-tip="${T('week')} ${w}, Tag ${di+1}">${isCone ? '<span class="cone-marker">⛳</span>' : label || (di+1)}</div>`;
    }).join('');
    return `<div class="week-block ${w===g.week?'current':''}">
      <div class="week-head">W${w}${ev?` <span class="we-ev">${T('week_event_'+ev.type)}</span>`:''}</div>
      <div class="week-tiles">${days}</div>
    </div>`;
  }).join('');
  return weeks;
}

function teamPanelHtml(p) {
  return `
    <div class="team-h">
      <span>${escapeHTML(p.name)} · ${fmtMoney(p.money)}’</span>
      <span class="team-strength">★ ${teamStrength(p)}</span>
    </div>
    <div class="team-grid">
      ${POSITIONS.map(pos => slotHtml(p.team[pos], pos)).join('')}
    </div>`;
}

function slotHtml(card, pos) {
  if (!card) return `<div class="slot empty" data-tip="${posLabel(pos)}"><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
  const dis = card.disabled ? 'disabled' : '';
  return `<div class="slot ${dis}" data-tip="${escapeHTML(card.name)} · ${card.stars}★${card.disabled?' · ' + (card.disabledReason||'-'):''}">
    <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
    <img src="${card.url}" alt="">
    <div class="stars">${'★'.repeat(card.stars)}</div>
    ${card.disabled?'<div class="dis-overlay">⛔</div>':''}
  </div>`;
}

function refreshTopbar() {
  const tb = $('#topbar'); if (!tb || !state.game) return;
  tb.innerHTML = state.game.players.map((p,i)=>playerCardHtml(p,i,true)).join('');
  refreshFloatingPanel();
}
function refreshBoard() {
  const b = $('#board'); if (!b || !state.game) return;
  b.innerHTML = boardHtml(state.game);
}
function refreshTeamPanel() {
  const tp = $('#team-panel'); if (!tp || !state.game) return;
  tp.innerHTML = teamPanelHtml(state.game.players[0]);
}
function setPhase(active) {
  const phases = [
    { id:'event', label:T('phase_event'), icon:'🏆' },
    { id:'match', label:T('phase_match'), icon:'🏐' },
    { id:'buy',   label:T('phase_buy'),   icon:'🛒' },
    { id:'done',  label:T('phase_done'),  icon:'✅' },
  ];
  const order = ['event','match','buy','done'];
  const bar = $('#phase-bar'); if (!bar) return;
  bar.innerHTML = phases.map(p => {
    const cls = p.id === active ? 'active' : (order.indexOf(p.id) < order.indexOf(active) ? 'done' : '');
    return `<span class="phase ${cls}">${p.icon} ${p.label}</span>`;
  }).join('') + `<span class="gh-spacer" style="flex:1"></span><span class="phase">${T('week')} ${state.game.week}/6</span>`;
}

// ────────────────────────────────────────────────────────────────
//  SEASON LOOP — using the cone movement
// ────────────────────────────────────────────────────────────────
async function runSeason() {
  const g = state.game;
  while (g.week <= 6 && !g.over) {
    refreshBoard();
    // For each week: simulate cone advancement until past day 8
    const targetEndOfWeek = g.week * 8;
    while (g.coneDay <= targetEndOfWeek && !g.over) {
      const active = g.players[g.activeIdx];
      // Active player rolls 3-die (or auto in fast mode)
      setPhase('event');
      await runConeRoll(active);
      if (g.over) return;
      // Move to next active player (clockwise)
      g.activeIdx = (g.activeIdx + 1) % g.players.length;
      refreshTopbar();
    }
    // Week complete — market phase
    setPhase('buy');
    await runMarketPhase();
    if (g.over) return;
    g.week += 1;
  }
  // Season end
  setPhase('done');
  if (!g.over) await runSeasonEnd();
  endGame();
}

// One cone-roll turn for a player
async function runConeRoll(player) {
  const g = state.game;
  setActiveBanner(player);
  const stage = $('#stage');
  const actions = $('#actions');
  stage.innerHTML = `
    <div class="stage-h">${T('week')} ${g.week} · Tag ${dayInWeekOf(g.coneDay)}</div>
    <div class="stage-sub">${escapeHTML(player.name)} ${player.isHuman?T('yourturn'):T('bot_thinking')+' …'}</div>
    <div class="dice-area" style="margin-top:1rem;">
      <div class="dice-num" id="dice-num">—</div>
    </div>
    <div id="cone-log" style="margin-top:1rem;"></div>`;
  actions.innerHTML = `<h3>${T('phase_event')}</h3>
    ${speedToggleHtml()}
    <button id="cone-roll-btn" class="action-btn pulse" data-tip="${T('cone_roll')}" onclick="VV.coneRollNow()">🎲 ${T('cone_roll')}</button>`;
  if (player.isHuman && state.speed !== 'auto') {
    await waitFor('coneRollNow');
  } else {
    await sleep(speedMs(700));
  }
  const v = await performDiceRoll(3);
  const advance = v >= 3 ? 2 : 1;     // rule: 1=+1, 2=+1, 3=+2
  const start = g.coneDay;
  const end = start + advance;
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🎲 ${v} (${state.lang==='de'?'+':'+'}${advance})`);
  // Advance day-by-day, resolve any landings/passes
  for (let d = start + 1; d <= end; d++) {
    g.coneDay = d;
    refreshBoard();
    await sleep(speedMs(220));
    await resolveDay(g.coneDay, player);
    if (g.over) return;
  }
  if (!g.over) {
    actions.innerHTML = `<h3>${T('phase_event')}</h3>
      ${speedToggleHtml()}
      <button class="action-btn pulse" onclick="VV.coneContinue()">${T('cone_continue')}</button>`;
    if (state.speed === 'auto') setTimeout(()=>fire('coneContinue'), speedMs(400));
    await waitFor('coneContinue');
  }
}

function coneRollNow() { fire('coneRollNow'); }
function coneContinue() { fire('coneContinue'); }
function setActiveBanner(p) {
  // Big floating banner
  let banner = $('#turn-banner');
  if (!banner) { banner = document.createElement('div'); banner.id='turn-banner'; document.body.appendChild(banner); }
  banner.className = 'turn-banner-floating ' + (p.isHuman ? 'human' : 'bot');
  banner.innerHTML = p.isHuman
    ? `<span class="tb-emoji">${p.emoji}</span> <span>${T('yourturn')}</span>`
    : `<span class="tb-emoji">${p.emoji}</span> <span>${escapeHTML(p.name)}</span> <span class="thinking"><span></span><span></span><span></span></span>`;
  banner.style.display = 'flex';
  setTimeout(() => { banner.style.display = 'none'; }, p.isHuman ? 1600 : 1200);
}

function appendConeLog(html) {
  const cl = $('#cone-log'); if (!cl) return;
  const e = document.createElement('div');
  e.className = 'cone-log-line';
  e.innerHTML = html;
  cl.appendChild(e);
  cl.scrollTop = cl.scrollHeight;
}

// Resolve what happens on landing on `day` for `triggerPlayer`
async function resolveDay(day, triggerPlayer) {
  const g = state.game;
  const w = weekOfDay(day);
  const dInW = dayInWeekOf(day);
  const ev = weekEventByWeek(w);
  if (dInW === ev?.day) {
    // Tournament
    appendConeLog(`<b>${T('week_event_'+ev.type)}</b>`);
    await runTournament(ev);
    return;
  }
  if (dInW === 8) {
    // League match line — auto trigger as cone passes
    appendConeLog(`<b>${T('phase_match')}</b> · ${T('week')} ${w}`);
    await runLeagueMatch();
    // After league match, restore disabled cards (suspensions/injuries/VNL)
    restoreDisabledCards(true);
    return;
  }
  // Otherwise: random event for the trigger player only
  const evType = randomEventType();
  await runEventSpace(evType, triggerPlayer);
}

// ────────────────────────────────────────────────────────────────
//  EVENT SPACES
// ────────────────────────────────────────────────────────────────
async function runEventSpace(type, player) {
  const stage = $('#stage');
  const map = {
    red:      { h:T('cone_event_red'),      p:T('cone_event_red_p'),      icon:'🟥' },
    transfer: { h:T('cone_event_transfer'), p:T('cone_event_transfer_p'), icon:'🔁' },
    action:   { h:T('cone_event_action'),   p:T('cone_event_action_p'),   icon:'🎴' },
    vnl:      { h:T('cone_event_vnl'),      p:T('cone_event_vnl_p'),      icon:'🚩' },
    injury:   { h:T('cone_event_injury'),   p:T('cone_event_injury_p'),   icon:'🩹' },
  };
  const e = map[type];
  // Render event modal-ish
  stage.innerHTML += `
    <div class="event-card">
      <div class="event-icon">${e.icon}</div>
      <div class="event-h">${e.h}</div>
      <div class="event-p">${e.p} · <span style="color:var(--silver);">${escapeHTML(player.name)}</span></div>
      <div id="event-detail"></div>
    </div>`;
  flash(type === 'action' ? 'win' : 'loss');
  beep(type === 'action' ? 760 : 320, 120);
  if (type === 'red')      await applyRedCard(player);
  if (type === 'transfer') await applyTransfer(player);
  if (type === 'action')   await applyActionCard(player);
  if (type === 'vnl')      await applyVnlEvent(player);
  if (type === 'injury')   await applyInjury(player);
  await sleep(speedMs(800));
}

const POS_ORDER_BY_DICE = ['outside','middle','setter','diagonal','libero']; // pos by 6-die roll: 1=back-right=libero traditionally; we map 1..5 to our 5 starters and 6=back-mid (diagonal if alone)
function diePositionFor(roll6) {
  // Map 1..6 to a starter position (deterministic abstraction)
  return ['libero','outside','middle','setter','diagonal','outside'][roll6-1];
}

async function applyRedCard(player) {
  const detail = $('#event-detail');
  detail.innerHTML = `<div class="dice-area"><div class="dice-num" id="dice-num">—</div></div>`;
  const v = await performDiceRoll(6);
  const pos = diePositionFor(v);
  if (player.team[pos]) {
    player.team[pos].disabled = true;
    player.team[pos].disabledReason = T('cone_event_red');
  }
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🟥 ${posLabel(pos)} ${T('injury_out')}`);
  refreshTeamPanel();
}

async function applyTransfer(player) {
  // Pull a card from auctionDeck and run a quick auction
  const card = state.game.auctionDeck.shift();
  if (!card) { appendConeLog(`${T('auction_no_one')}`); return; }
  // Quick auction: triggering player bids first, others can join
  // For simplicity: auto-resolve where bots bid via shouldBid; human gets prompt
  const detail = $('#event-detail');
  detail.innerHTML = `<div style="margin-top:0.6rem;"><b>${escapeHTML(card.name)}</b> · ${'★'.repeat(card.stars)} · ${T('auction_minbid')}: ${fmtMoney(card.stars*10000)}’</div>`;
  // simple flow — single round of bids in player order starting with trigger
  let high = 0, highP = null;
  const order = state.game.players.slice();
  // rotate so triggerPlayer is first
  while (order[0] !== player) order.push(order.shift());
  const minBid = card.stars * 10000;
  for (const p of order) {
    if (p.money < minBid) continue;
    if (p.isHuman) {
      const r = await humanBidPrompt(p, card, Math.max(minBid, high+1000));
      if (r && !r.pass && r.bid > high && r.bid <= p.money) { high = r.bid; highP = p; }
    } else {
      const dec = window.VV_BOTS.shouldBid(p, card, high, Math.max(minBid, high+1000), order);
      if (!dec.pass && dec.bid > high) { high = dec.bid; highP = p; }
    }
  }
  if (highP) {
    highP.money -= high;
    placeIntoTeamOrBench(highP, card);
    appendConeLog(`${highP.emoji} ${escapeHTML(highP.name)} → ${escapeHTML(card.name)} (${fmtMoney(high)}’)`);
  } else {
    state.game.auctionDeck.push(card);
    appendConeLog(T('auction_no_one'));
  }
  refreshTopbar(); refreshTeamPanel();
}

async function applyActionCard(player) {
  // Surprise — show a popup that says it only exists in the physical game
  showActionCardPopup();
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🎴 ${T('cone_event_action')}`);
}

function showActionCardPopup() {
  const layer = $('#toast-layer');
  const div = document.createElement('div');
  div.className = 'modal-popup';
  div.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon">🎁</div>
      <div class="modal-h">${T('cone_event_action')}</div>
      <div class="modal-p">${T('cone_event_action_p')}</div>
      <button class="btn btn-primary" onclick="this.closest('.modal-popup').remove()">OK</button>
    </div>`;
  document.body.appendChild(div);
  setTimeout(() => div.classList.add('open'), 10);
}

async function applyVnlEvent(player) {
  // Disable cards that match the player's flag (we don't have flags per card, so simulate ~30% chance per starter)
  let count = 0;
  for (const pos of POSITIONS) {
    const c = player.team[pos];
    if (c && Math.random() < 0.30) { c.disabled = true; c.disabledReason = T('cone_event_vnl'); count++; }
  }
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🚩 ${count} ${state.lang==='de'?'Spieler verfügbar erst nach Liga':'players unavailable until league match'}`);
  refreshTeamPanel();
}

async function applyInjury(player) {
  const detail = $('#event-detail');
  detail.innerHTML = `<div class="dice-area"><div class="dice-num" id="dice-num">—</div></div>`;
  const v = await performDiceRoll(6);
  const pos = diePositionFor(v);
  if (player.team[pos]) {
    player.team[pos].disabled = true;
    player.team[pos].disabledReason = T('cone_event_injury');
  }
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🩹 ${posLabel(pos)} ${T('injury_out')}`);
  refreshTeamPanel();
}

function restoreDisabledCards(afterLeague) {
  const g = state.game;
  for (const p of g.players) {
    for (const pos of POSITIONS) {
      const c = p.team[pos];
      if (c && c.disabled) { c.disabled = false; c.disabledReason = null; }
    }
  }
  refreshTopbar(); refreshTeamPanel();
}


// ────────────────────────────────────────────────────────────────
//  TOURNAMENTS (Cup, Cup-Final, SuperCup, CL group, CL final)
// ────────────────────────────────────────────────────────────────
async function runTournament(ev) {
  const g = state.game;
  if (ev.type === 'cup')      return runCupSemis(ev);
  if (ev.type === 'cupfinal') return runCupFinal(ev);
  if (ev.type === 'supercup') return runSuperCup(ev);
  if (ev.type === 'cl')       return runCLGroup(ev);
  if (ev.type === 'clfinal')  return runCLFinal(ev);
}

// CUP — every player rolls 12-sided die. Top 2 play in the semi (with home advantage to higher roll). Winners progress.
async function runCupSemis(ev) {
  const g = state.game;
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="stage-h">${T('cup_h')} · ${T('week')} ${g.week}</div>
    <div class="stage-sub">${T('cup_roll')}</div>
    <div id="cup-rolls" style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem;"></div>
    <div class="dice-area" style="margin:0 auto;"><div class="dice-num" id="dice-num">—</div></div>`;
  const rolls = [];
  for (const p of g.players) {
    const v = await performDiceRoll(12);
    rolls.push({ p, v });
    const d = document.createElement('div'); d.className = 'cup-roll';
    d.innerHTML = `<b>${p.emoji} ${escapeHTML(p.name)}</b> · 🎲 <span style="color:var(--gold); font-weight:800;">${v}</span>`;
    $('#cup-rolls').appendChild(d);
    await sleep(speedMs(280));
  }
  rolls.sort((a,b) => b.v - a.v);
  // First semi: rolls[0] vs rolls[1]; second semi (if 4 players): rolls[2] vs rolls[3]
  const semis = [];
  if (rolls.length >= 2) semis.push({ home: rolls[0], away: rolls[1] });
  if (rolls.length >= 4) semis.push({ home: rolls[2], away: rolls[3] });
  // Winners
  g._cupWinners = [];
  for (const m of semis) {
    appendConeLog(`${T('cup_h')}: ${escapeHTML(m.home.p.name)} vs ${escapeHTML(m.away.p.name)} · ${T('homeaway_home')} = ${escapeHTML(m.home.p.name)}`);
    const winner = await runMatchClassic(m.home.p, m.away.p, true);
    if (winner === m.home.p) {
      m.home.p.money += ev.prize;
      m.home.p.totalEarned += ev.prize;
      logEntry(`${T('week_event_cup')} → ${escapeHTML(m.home.p.name)} +${fmtMoney(ev.prize)}’`, 'tournament');
    } else {
      m.away.p.money += ev.prize;
      m.away.p.totalEarned += ev.prize;
      logEntry(`${T('week_event_cup')} → ${escapeHTML(m.away.p.name)} +${fmtMoney(ev.prize)}’`, 'tournament');
    }
    g._cupWinners.push(winner);
  }
  if (rolls.length === 3) {
    // 3 players: just one semi happens; the third is bye → pick the loser of semi as the second cup-final participant by rule? Per simplified rules, two semis for 4p; for 3p we use one semi + the byes player.
    // Simplest: the bye player also advances to final to keep fairness
    g._cupWinners.push(rolls[2].p);
  }
  refreshTopbar();
}

// CUP-FINAL — two cup winners face off. Winner: 2VP + 20k, runner-up: 1VP.
async function runCupFinal(ev) {
  const g = state.game;
  if (!g._cupWinners || g._cupWinners.length < 2) {
    appendConeLog(`<i style="color:var(--silver)">${state.lang==='de'?'Cup-Final übersprungen — keine Halbfinal-Sieger':'Cup final skipped — no semi winners'}</i>`);
    return;
  }
  const home = g._cupWinners[0];
  const away = g._cupWinners[1];
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="stage-h">${T('week_event_cupfinal')}</div>
    <div class="stage-sub">${escapeHTML(home.name)} vs ${escapeHTML(away.name)}</div>`;
  const winner = await runMatchClassic(home, away, true);
  const loser = winner === home ? away : home;
  winner.money += ev.prize;
  winner.totalEarned += ev.prize;
  winner.vp += 2; animateVpChange(winner, 2);
  loser.vp += 1; animateVpChange(loser, 1);
  logEntry(`<b>${T('week_event_cupfinal')}</b> → ${escapeHTML(winner.name)} +2 VP, +${fmtMoney(ev.prize)}’ · ${escapeHTML(loser.name)} +1 VP`, 'tournament');
  flash('win');
  beep(900, 200);
  refreshTopbar();
  if (checkWin()) return;
}

// SUPERCUP — last season's league winner vs cup winner.  In single-season build, we treat it as
// "current best two by team strength" (placeholder until multi-season).
async function runSuperCup(ev) {
  const g = state.game;
  const sorted = g.players.slice().sort((a,b) => teamStrength(b) - teamStrength(a));
  const home = sorted[0]; const away = sorted[1];
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="stage-h">${T('week_event_supercup')} · ${T('week')} ${g.week}</div>
    <div class="stage-sub">${escapeHTML(home.name)} vs ${escapeHTML(away.name)} · ${state.lang==='de'?'(Saison 1: gewählt nach Teamstärke)':'(Season 1: chosen by team strength)'}</div>`;
  const winner = await runMatchClassic(home, away, true);
  winner.money += ev.prize; winner.totalEarned += ev.prize;
  logEntry(`${T('week_event_supercup')} → ${escapeHTML(winner.name)} +${fmtMoney(ev.prize)}’`, 'tournament');
  refreshTopbar();
}

// CHAMPIONS LEAGUE — Mechanik in dieser Version noch nicht freigeschaltet.
// Wenn das Hütchen ein CL-Feld erreicht: Popup zeigen, kein Match starten.
async function runCLGroup(ev) {
  await showLockedFeaturePopup(T('week_event_cl'));
  appendConeLog(`<i style="color:var(--silver)">${T('week_event_cl')} — ${state.lang==='de'?'noch nicht freigeschaltet':'not yet unlocked'}</i>`);
}
async function runCLFinal(ev) {
  await showLockedFeaturePopup(T('week_event_clfinal'));
  appendConeLog(`<i style="color:var(--silver)">${T('week_event_clfinal')} — ${state.lang==='de'?'noch nicht freigeschaltet':'not yet unlocked'}</i>`);
}

function showLockedFeaturePopup(title) {
  return new Promise(resolve => {
    const div = document.createElement('div');
    div.className = 'modal-popup';
    div.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon">🔒</div>
        <div class="modal-h">${title}</div>
        <div class="modal-p">${state.lang==='de'
          ? 'Diese Funktion ist noch nicht freigeschaltet — schau später nochmal vorbei. 🛠️'
          : 'This feature is not yet unlocked — check back later. 🛠️'}</div>
        <button class="btn btn-primary" id="locked-ok">OK</button>
      </div>`;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('open'), 10);
    div.querySelector('#locked-ok').addEventListener('click', () => {
      div.remove();
      resolve();
    });
    if (state.speed === 'auto') setTimeout(() => { if (document.body.contains(div)) { div.remove(); resolve(); } }, 1200);
  });
}

// ────────────────────────────────────────────────────────────────
//  CLASSIC LEAGUE MATCH — 12 criteria (rule-faithful)
//  Used for both Liga-Spiele AND tournament resolutions.
//  Returns the winning player.
// ────────────────────────────────────────────────────────────────
async function runMatchClassic(home, away, isTournament) {
  const stage = $('#stage');
  const actions = $('#actions');
  // Match state
  const M = {
    home, away,
    homePoints: 0, awayPoints: 0,
    crunchExtra: 0,
    rolls: [], events: [],
    rotationHome: 0, rotationAway: 0,
    iRoll: 0, totalRolls: 4,
    ended: false,
  };
  state.game._classicMatch = M;
  function paint() {
    stage.innerHTML = `
      <div class="stage-h">${escapeHTML(home.name)} vs ${escapeHTML(away.name)}</div>
      <div class="match-screen">
        <div class="match-team home">
          <div class="flag">${T('homeaway_home')}</div>
          <h4>${escapeHTML(home.name)}</h4>
          <div class="strength">${M.homePoints}</div>
          <div style="font-size:0.7rem; color:var(--silver); margin-top:0.4rem;">★ ${teamStrength(home)}</div>
          <div style="margin-top:0.3rem;">${courtMiniHtml(home, M.rotationHome)}</div>
        </div>
        <div class="match-vs">VS</div>
        <div class="match-team away">
          <div class="flag">${T('homeaway_away')}</div>
          <h4>${escapeHTML(away.name)}</h4>
          <div class="strength">${M.awayPoints}</div>
          <div style="font-size:0.7rem; color:var(--silver); margin-top:0.4rem;">★ ${teamStrength(away)}</div>
          <div style="margin-top:0.3rem;">${courtMiniHtml(away, M.rotationAway)}</div>
        </div>
      </div>
      <div class="dice-area" style="margin-top:1rem;">
        <div class="dice-num" id="dice-num">—</div>
      </div>
      <div id="rally-feed" class="rally-feed"></div>`;
    M.events.slice(-6).forEach(r => {
      const d = document.createElement('div');
      d.className = 'crit show ' + (r.winner === 'home' ? 'win' : r.winner === 'away' ? 'loss' : 'tie');
      d.innerHTML = `<div class="crit-h">#${r.dice} · ${T('crit_'+r.kind)}</div><div class="crit-r">${r.text}</div>`;
      $('#rally-feed').appendChild(d);
    });
    $('#rally-feed').scrollTop = $('#rally-feed').scrollHeight;
  }
  function setActionUI() {
    actions.innerHTML = `<h3>${T('phase_match')}</h3>
      ${speedToggleHtml()}
      <button id="serve-btn" class="action-btn pulse" data-tip="${T('serve_t')}" onclick="VV.serveOnce()">🏐 ${T('serve')}</button>`;
  }
  paint(); setActionUI();

  const totalRolls = () => M.totalRolls + M.crunchExtra;
  while (M.iRoll < totalRolls() && !M.ended) {
    if (state.speed !== 'auto') await waitFor('serveOnce', speedMs(state.speed === 'auto' ? 240 : 0));
    else await sleep(speedMs(220));
    const dice = await performDiceRoll(12);
    M.rolls.push(dice);
    const result = await resolveCriterion(dice, M);
    M.events.push(result);
    if (result.winner === 'home') M.homePoints++;
    else if (result.winner === 'away') M.awayPoints++;
    // rotation: winning team rotates
    if (result.winner === 'home') M.rotationHome = (M.rotationHome + 1) % 6;
    else if (result.winner === 'away') M.rotationAway = (M.rotationAway + 1) % 6;
    M.iRoll++;
    paint(); setActionUI();
    refreshTopbar();
    beep(result.winner === 'home' ? 740 : result.winner === 'away' ? 480 : 540, 60);
  }

  // Determine winner by points; tie → coin flip
  let winner;
  if (M.homePoints > M.awayPoints) winner = home;
  else if (M.awayPoints > M.homePoints) winner = away;
  else winner = Math.random() < 0.5 ? home : away;

  // Show summary
  await showMatchSummary(M, winner);
  flash(winner === home ? 'win' : 'loss');
  return winner;
}

// Resolve a single criterion (rule-faithful for criterion 9: Block-Überwurf)
async function resolveCriterion(dice, M) {
  const home = M.home, away = M.away;
  const homeStr = teamStrength(home), awayStr = teamStrength(away);
  const homeFront = teamFront(home), awayFront = teamFront(away);
  const homeBack = teamBack(home), awayBack = teamBack(away);
  const homeBlock = teamBlock(home), awayBlock = teamBlock(away);
  let winner = 'home';
  let kind = 'total';
  const lang = state.lang;

  function pickComment(team) {
    return (team === 'home'
      ? choice(COMMENTARY[lang].home_score)
      : team === 'away' ? choice(COMMENTARY[lang].away_score)
      : 'Punktgleichstand'
    ).replace('%team%', escapeHTML(team === 'home' ? home.name : away.name))
     .replace('%player%', randomPlayerName(team === 'home' ? home : away));
  }

  switch (dice) {
    case 1:  kind='total';  winner = homeStr > awayStr ? 'home' : homeStr < awayStr ? 'away' : 'tie'; break;
    case 2:  kind='front';  winner = homeFront > awayFront ? 'home' : homeFront < awayFront ? 'away' : 'tie'; break;
    case 3:  kind='back';   winner = homeBack > awayBack ? 'home' : homeBack < awayBack ? 'away' : 'tie'; break;
    case 4: { kind='dice'; const r1 = roll(12), r2 = roll(12); winner = r1 > r2 ? 'home' : r1 < r2 ? 'away' : 'tie'; break; }
    case 5:  kind='middle'; { const a = home.team.middle?.stars||0, b = away.team.middle?.stars||0; winner = a > b ? 'home' : a < b ? 'away' : 'tie'; break; }
    case 6:  kind='service'; {
      // Heim hinten-rechts (= diagonal historisch) vs Auswärts-Libero. Falls Libero serviert: Mitte muss ran.
      const homeServer = home.team.diagonal?.stars||0;
      const awayLibero = away.team.libero?.stars||0;
      winner = homeServer > awayLibero ? 'home' : homeServer < awayLibero ? 'away' : 'tie';
      break;
    }
    case 7:  kind='dia_set'; {
      const a = (home.team.diagonal?.stars||0) + (home.team.setter?.stars||0);
      const b = (away.team.diagonal?.stars||0) + (away.team.setter?.stars||0);
      winner = a > b ? 'home' : a < b ? 'away' : 'tie'; break;
    }
    case 8:  kind='out_dia'; {
      const a = home.team.outside?.stars||0;
      const b = away.team.diagonal?.stars||0;
      winner = a > b ? 'home' : a < b ? 'away' : 'tie'; break;
    }
    case 9:  kind='block';  {
      // Block-Überwurf: Auswärts wirft 12er gegen Heim-Block
      const r = roll(12);
      if (r > homeBlock) winner = 'away';
      else if (r < homeBlock) winner = 'home';
      else winner = 'tie';
      M._blockRoll = r; M._blockTarget = homeBlock;
      break;
    }
    case 10: kind='crunch'; {
      // Heim erhält +2 zusätzliche Würfe in diesem Spiel
      M.crunchExtra += 2;
      winner = 'tie'; // no point on this roll itself
      break;
    }
    case 11: kind='injury'; {
      // 12er: 1-6 = Heimspieler, 7-12 = Auswärtsspieler. Position via roll.
      const r = roll(12);
      const team = r <= 6 ? home : away;
      const pos = diePositionFor(((r - 1) % 6) + 1);
      if (team.team[pos]) {
        team.team[pos].disabled = true;
        team.team[pos].disabledReason = T('cone_event_injury');
      }
      M._injuryWho = team; M._injuryPos = pos;
      winner = 'tie';
      break;
    }
    case 12: kind='money'; {
      // Geld-Regen
      home.money += 5000; away.money += 5000;
      home.totalEarned += 5000; away.totalEarned += 5000;
      winner = 'tie';
      break;
    }
  }
  // Build a textual description
  let text = '';
  if (kind === 'crunch')  text = `${escapeHTML(home.name)}: ${T('crunch_extra')}`;
  else if (kind === 'injury') text = `${escapeHTML(M._injuryWho.name)} · ${posLabel(M._injuryPos)} ${T('injury_out')}`;
  else if (kind === 'money')  text = T('money_rain');
  else if (kind === 'block') {
    const r = M._blockRoll, t = M._blockTarget;
    text = `${state.lang==='de'?'Auswärts wirft':'Away rolls'} ${r} vs ${state.lang==='de'?'Block':'block'} ${t} → ${winner==='away'?T('block_overshot'):winner==='home'?T('block_holds'):'tie'}`;
  }
  else text = pickComment(winner);
  return { dice, kind, winner, text };
}

function randomPlayerName(p) {
  const cards = POSITIONS.map(k => p.team[k]).filter(Boolean);
  const top = cards.sort((a,b)=>b.stars-a.stars)[0];
  return top ? top.name.replace('#','') : escapeHTML(p.name);
}

async function showMatchSummary(M, winner) {
  const stage = $('#stage');
  const lang = state.lang;
  const summary = `${escapeHTML(M.home.name)} ${M.homePoints}:${M.awayPoints} ${escapeHTML(M.away.name)}`;
  stage.innerHTML = `
    <div class="stage-h">${winner === M.home ? '🏆 ' : ''}${escapeHTML(winner.name)} ${state.lang==='de'?'gewinnt':'wins'}</div>
    <div class="stage-sub">${summary}</div>
    <div style="margin-top:1rem; display:flex; gap:0.4rem; flex-wrap:wrap; max-width:640px;">
      ${M.events.map(e => `<span class="crit-pill ${e.winner}">#${e.dice} ${T('crit_'+e.kind)}</span>`).join('')}
    </div>
    <div style="margin-top:1rem; text-align:center;">
      <button class="btn btn-primary" onclick="VV.continueAfterMatch()">${T('next_match')}</button>
    </div>`;
  await waitFor('continueAfterMatch', speedMs(state.speed === 'auto' ? 600 : 0));
}

// Mini court diagram (6 positions in a 3×2 grid representing front + back rows)
function courtMiniHtml(player, rotation) {
  // Slots in serving rotation order:
  // [0]=back-right (server), [1]=back-middle, [2]=back-left, [3]=front-left, [4]=front-middle, [5]=front-right
  const t = player.team;
  // Map our 5 positions to 6 court slots loosely:
  // Front: [outside (left), middle (center), setter (right)]
  // Back:  [diagonal (left), libero (middle), outside (right)] (outside plays both rows; diagonal is server)
  // Rotate the labels by 'rotation'
  const baseLabels = [
    posShort('diagonal'),
    posShort('libero'),
    posShort('outside'),
    posShort('outside'),
    posShort('middle'),
    posShort('setter'),
  ];
  const baseColors = [posColor('diagonal'), posColor('libero'), posColor('outside'), posColor('outside'), posColor('middle'), posColor('setter')];
  const r = ((rotation || 0) % 6 + 6) % 6;
  const order = range(6).map(i => (i + r) % 6);
  return `<div class="court-mini">
    <div class="court-row top">
      ${order.slice(3).map((i, k) => `<span class="court-cell" style="background:${baseColors[i]}" data-tip="${baseLabels[i]}${k===2?' ⛳':''}">${baseLabels[i]}</span>`).join('')}
    </div>
    <div class="court-row bot">
      ${order.slice(0,3).map((i, k) => `<span class="court-cell" style="background:${baseColors[i]}" data-tip="${baseLabels[i]}${k===2?' 🏐':''}">${baseLabels[i]}${k===2?' 🏐':''}</span>`).join('')}
    </div>
  </div>`;
}

async function runLeagueMatch() {
  const g = state.game;
  // Pair human (home this week) vs strongest bot
  const me = g.players[0];
  const opp = g.players.filter(p => p !== me).sort((a,b)=>teamStrength(b)-teamStrength(a))[0];
  const home = me; const away = opp;
  const winner = await runMatchClassic(home, away, false);
  // Award league points and money per rulebook
  if (winner === home) {
    home.money += 10000; home.totalEarned += 10000; animateMoneyChange(home, 10000);
    if (away.money >= 5000) { away.money -= 5000; animateMoneyChange(away, -5000); home.money += 5000; home.totalEarned += 5000; animateMoneyChange(home, 5000); } else { home.money += away.money; away.money = 0; }
    home.matchesWon++; home.leaguePoints += 3;
    logEntry(`🏐 ${T('phase_match')}: <b>${escapeHTML(home.name)}</b> +10’ (Bank), +5’ (${escapeHTML(away.name)})`, 'win');
  } else {
    away.money += 10000; away.totalEarned += 10000; animateMoneyChange(away, 10000);
    if (home.money >= 5000) { home.money -= 5000; animateMoneyChange(home, -5000); away.money += 5000; away.totalEarned += 5000; animateMoneyChange(away, 5000); } else { away.money += home.money; home.money = 0; }
    away.matchesWon++; away.leaguePoints += 3;
    logEntry(`🏐 ${T('phase_match')}: <b>${escapeHTML(away.name)}</b> +10’ (Bank), +5’ (${escapeHTML(home.name)})`, 'loss');
  }
  // Other players: bye → +5'000
  for (const p of g.players) {
    if (p !== home && p !== away) {
      p.money += 5000; p.totalEarned += 5000; animateMoneyChange(p, 5000);
      logEntry(`🏐 ${T('week_event_league')} ${state.lang==='de'?'Freilos':'Bye'} → ${escapeHTML(p.name)} +5’`);
    }
  }
  refreshTopbar();
  if (checkWin()) return;
}


// ────────────────────────────────────────────────────────────────
//  MARKET PHASE  (between weeks)
// ────────────────────────────────────────────────────────────────
function regenMarket() {
  // Pull from the auction deck (2-5 stars). 1-star cards have a separate always-available section.
  const out = [];
  const deck = state.game.auctionDeck.slice();
  while (out.length < 8 && deck.length) {
    out.push(deck.shift());
  }
  // Don't permanently remove from auctionDeck — refresh each week
  state.game.auctionDeck = state.game.auctionDeck.filter(c => !out.includes(c));
  // Put back unused at the end so they cycle
  return out;
}

async function runMarketPhase() {
  const g = state.game;
  g.market = regenMarket();
  renderMarket();
  // Bots act first, then human's turn (to give clear "your turn" feel)
  for (const bot of g.players.filter(p => !p.isHuman)) {
    await sleep(speedMs(450));
    const pick = window.VV_BOTS.pickMarketBuy(bot, g.market);
    if (pick) {
      const cur = bot.team[pick.pos];
      bot.team[pick.pos] = pick;
      if (cur) bot.bench.push(cur);
      bot.money -= pick.price;
      g.market = g.market.filter(c => c.id !== pick.id);
      logEntry(fmt(T('bot_buys'), `${bot.emoji} ${escapeHTML(bot.name)}`, T('pos_'+pick.pos), pick.stars, fmtMoney(pick.price)), 'tournament');
    } else {
      logEntry(fmt(T('bot_skips'), `${bot.emoji} ${escapeHTML(bot.name)}`));
    }
    refreshTopbar();
    renderMarket();
  }
  await waitFor('endMarket', speedMs(state.speed === 'auto' ? 600 : 0));
}

function renderMarket() {
  const stage = $('#stage'); if (!stage) return;
  const me = state.game.players[0];
  const weakPos = weakestPosition(me);
  stage.innerHTML = `
    <div class="stage-h">${T('market_h')}</div>
    <div class="stage-sub">${T('market_budget')}: <b id="budget-num">${fmtMoney(me.money)}</b>’ · ${T('market_team_strength')}: <b>★ ${teamStrength(me)}</b> · ${T('market_suggest')}: <b style="color:var(--gold)">${posLabel(weakPos)}</b></div>
    <h4 class="h-cond" style="font-size:1rem; letter-spacing:2px; margin-top:1rem; color:var(--silver);">${state.lang==='de'?'Markt — 2★ bis 5★':'Market — 2★ to 5★'}</h4>
    <div class="market" id="market-grid">${state.game.market.map(c => marketCardHtml(c, me, { suggestedPos: weakPos })).join('')}</div>
    <h4 class="h-cond" style="font-size:1rem; letter-spacing:2px; margin-top:1.4rem; color:var(--silver);">${state.lang==='de'?'1-Stern-Markt — immer kaufbar':'1-Star Market — always available'}</h4>
    <div class="market market-1star">${oneStarMarketHtml(me, weakPos)}</div>
    ${me.bench.length ? `<h4 class="h-cond" style="font-size:1rem; letter-spacing:2px; margin-top:1.4rem; color:var(--silver);">${state.lang==='de'?'Bench / Ersatz':'Bench / Substitutes'}</h4><div class="bench-grid">${me.bench.map(c => benchCardHtml(c, me)).join('')}</div>`:''}`;
  const actions = $('#actions'); if (!actions) return;
  actions.innerHTML = `<h3>${T('phase_buy')}</h3>
    ${speedToggleHtml()}
    <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>`;
}

function oneStarMarketHtml(me, weakPos) {
  return POSITIONS.map(pos => {
    const c = (ALL_CARDS.filter(x => x.stars === 1 && x.pos === pos)[0]) || null;
    if (!c) return '';
    const canAfford = me.money >= 10000;
    const suggested = pos === weakPos;
    return `<div class="mc ${canAfford?'':'poor'} ${suggested?'suggested':''}" data-tip="1★ ${posLabel(pos)} · 10’000">
      <img class="mc-img" src="${c.url}" alt="" loading="lazy">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="mc-pos" style="background:${posColor(pos)}">${posShort(pos)}</span>
        <span class="mc-stars">★</span>
      </div>
      <div class="mc-price">${fmtMoney(10000)}</div>
      <button class="mc-buy" onclick="VV.buyOneStar('${pos}')" ${canAfford?'':'disabled'}>${canAfford?T('market_buy'):T('market_sold')}</button>
    </div>`;
  }).join('');
}

function benchCardHtml(c, me) {
  const sellPrice = Math.floor(c.stars * 10000 / 2);
  return `<div class="bc">
    <img src="${c.url}" alt="" class="bc-img" loading="lazy">
    <div class="bc-meta">
      <span class="mc-pos" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <span class="mc-stars">${'★'.repeat(c.stars)}</span>
    </div>
    <button class="bc-sell" onclick="VV.sellBenchCard('${c.id}')" data-tip="${T('market_sell_t')}">💰 ${T('market_sell')} ${fmtMoney(sellPrice)}’</button>
  </div>`;
}

function buyOneStar(pos) {
  const me = state.game.players[0];
  if (me.money < 10000) { toast(state.lang==='de'?'Zu teuer':'Too expensive', 'bad'); return; }
  const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === pos);
  if (!opts.length) return;
  const c = choice(opts);
  const cur = me.team[pos];
  if (cur && cur.stars >= c.stars) {
    if (cur) me.bench.push(cur);
  }
  me.team[pos] = c;
  me.money -= 10000;
  animateMoneyChange(me, -10000);
  toast(state.lang==='de'?`Gekauft: ${c.name}`:`Bought: ${c.name}`, 'good');
  beep(880, 60);
  refreshTopbar(); refreshTeamPanel(); renderMarket(); refreshFloatingPanel();
  logEntry(`💰 ${state.lang==='de'?'Gekauft':'Bought'}: ${c.name} (1★) -10’000’`, 'win');
}

function sellBenchCard(id) {
  const me = state.game.players[0];
  const idx = me.bench.findIndex(c => c.id === id);
  if (idx < 0) return;
  const c = me.bench[idx];
  const price = Math.floor(c.stars * 10000 / 2);
  if (!confirm(state.lang==='de'?`${c.name} für ${fmtMoney(price)}’ verkaufen?`:`Sell ${c.name} for ${fmtMoney(price)}?`)) return;
  me.bench.splice(idx, 1);
  me.money += price;
  animateMoneyChange(me, +price);
  toast(`+${fmtMoney(price)}’`, 'gold');
  beep(820, 80);
  logEntry(`💰 ${state.lang==='de'?'Verkauft':'Sold'}: ${c.name} +${fmtMoney(price)}’`, 'win');
  refreshTopbar(); refreshTeamPanel(); renderMarket(); refreshFloatingPanel();
}

function sellStarter(pos) {
  const me = state.game.players[0];
  const c = me.team[pos]; if (!c) return;
  const price = Math.floor(c.stars * 10000 / 2);
  if (!confirm(state.lang==='de'?`${c.name} für ${fmtMoney(price)}’ verkaufen?`:`Sell ${c.name} for ${fmtMoney(price)}?`)) return;
  // Replace from bench if available, else clear
  const replIdx = me.bench.findIndex(b => b.pos === pos);
  if (replIdx >= 0) me.team[pos] = me.bench.splice(replIdx, 1)[0];
  else me.team[pos] = null;
  me.money += price;
  animateMoneyChange(me, +price);
  toast(`+${fmtMoney(price)}’`, 'gold');
  logEntry(`💰 ${state.lang==='de'?'Verkauft':'Sold'}: ${c.name} +${fmtMoney(price)}’`, 'win');
  state.sellMode = false;
  refreshTopbar(); refreshTeamPanel(); refreshFloatingPanel();
  if (state.view === 'game') renderMarket();
}

function marketCardHtml(c, player, opts) {
  const canAfford = player.money >= c.price;
  const suggested = opts && opts.suggestedPos === c.pos;
  return `<div class="mc ${canAfford?'':'poor'} ${suggested?'suggested':''}" data-tip="${escapeHTML(c.name)}">
    <img class="mc-img" src="${c.url}" alt="" loading="lazy">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="mc-pos" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <span class="mc-stars">${'★'.repeat(c.stars)}</span>
    </div>
    <div class="mc-price">${fmtMoney(c.price)}</div>
    <button class="mc-buy" onclick="VV.buyCard('${c.id}')" ${canAfford?'':'disabled'}>${canAfford?T('market_buy'):T('market_sold')}</button>
  </div>`;
}

function buyCard(id) {
  const c = ALL_CARDS.find(x => x.id === id);
  const me = state.game.players[0];
  if (!c) return;
  if (me.money < c.price) { toast(state.lang==='de'?'Zu teuer':'Too expensive', 'bad'); return; }
  const cur = me.team[c.pos];
  if (cur && cur.stars >= c.stars) {
    if (!confirm(state.lang==='de'?'Aktuelle Karte ist gleichstark oder stärker — trotzdem kaufen?':'Current card has equal or higher stars — buy anyway?')) return;
  }
  if (cur) me.bench.push(cur);
  me.team[c.pos] = c;
  me.money -= c.price;
  state.game.market = state.game.market.filter(x => x.id !== c.id);
  toast(state.lang==='de' ? `Gekauft: ${c.name}` : `Bought: ${c.name}`, 'good');
  beep(880, 60);
  refreshTopbar(); refreshTeamPanel();
  renderMarket();
}
function endMarket() {
  // Return unsold market cards to the auction deck (back of deck)
  const g = state.game;
  if (g && g.market && g.market.length) {
    for (const c of g.market) g.auctionDeck.push(c);
    g.market = [];
  }
  fire('endMarket');
}
function weakestPosition(p) {
  let min = POSITIONS[0], minS = Infinity;
  for (const k of POSITIONS) { const s = (p.team[k]&&p.team[k].stars)||0; if (s < minS) { minS = s; min = k; } }
  return min;
}

// ────────────────────────────────────────────────────────────────
//  SEASON END (single-season MVP variant)
//  Even in single-season we apply: standings VP, payouts.
//  We skip the protect/steal phase since the season ends here.
// ────────────────────────────────────────────────────────────────
async function runSeasonEnd() {
  const g = state.game;
  // Award season standings
  const ranked = g.players.slice().sort((a,b) => (b.leaguePoints||0) - (a.leaguePoints||0));
  const vpAward = [3, 2, 1, 0];
  const moneyAward = [0, 20000, 30000, 50000];
  for (let i = 0; i < ranked.length; i++) {
    const p = ranked[i];
    const _delta_vp = vpAward[i] || 0; p.vp += _delta_vp; if (_delta_vp) animateVpChange(p, _delta_vp);
    p.money += moneyAward[i] || 0;
    p.totalEarned += moneyAward[i] || 0;
    logEntry(`${T('standings_title')} ${i+1}. ${escapeHTML(p.name)} → +${vpAward[i]||0} VP, +${fmtMoney(moneyAward[i]||0)}’`, 'tournament');
  }
  refreshTopbar();
  await sleep(speedMs(800));
}

// ────────────────────────────────────────────────────────────────
//  END GAME
// ────────────────────────────────────────────────────────────────
function checkWin() {
  const g = state.game;
  const w = g.players.find(p => p.vp >= 8);
  if (w) { g.over = true; g.winner = w; setTimeout(endGame, speedMs(450)); return true; }
  return false;
}

function endGame() {
  const g = state.game;
  if (!g.winner) g.winner = g.players.slice().sort((a,b) => b.vp - a.vp)[0];
  setView('end');
}

function renderEnd() {
  const app = $('#app');
  const g = state.game;
  const ranked = g.players.slice().sort((a,b) => b.vp - a.vp);
  const winner = g.winner;
  const remark = winner.vp >= 8 ? T('end_remarks_8vp') : T('end_remarks_season');
  app.innerHTML = `
    <div class="end-wrap">
      <div class="end-h">${fmt(T('end_h_winner'), `<span class="winner">${escapeHTML(winner.name)}</span>`)}</div>
      <div style="color:var(--silver); letter-spacing:3px; text-transform:uppercase; font-size:0.8rem;">${winner.vp}/8 ${T('vp')} · ${remark}</div>
      <div class="end-board">
        ${ranked.map((p,i)=>`
          <div class="end-row ${i===0?'first':''}">
            <span class="rank">${i+1}.</span>
            <span style="font-size:1.4rem;">${p.emoji}</span>
            <b>${escapeHTML(p.name)}</b>
            <span class="stats">
              <span class="stat">${T('vp')}: <b>${p.vp}</b></span>
              <span class="stat">${T('end_stats_won')}: <b>${p.matchesWon}</b></span>
              <span class="stat">${T('end_stats_money')}: <b>${fmtMoney(p.totalEarned)}</b></span>
              <span class="stat">${T('end_stats_str')}: <b>★ ${teamStrength(p)}</b></span>
            </span>
          </div>`).join('')}
      </div>
      <div class="end-actions">
        <button class="btn btn-primary btn-large" onclick="VV.playAgain()">${T('end_play_again')}</button>
        <button class="btn btn-secondary btn-large" onclick="VV.toMenu()">${T('end_back_menu')}</button>
        <button class="btn btn-ghost" onclick="VV.showFullHistory()">📜 ${state.lang==='de'?'Komplette Historie':'Full history'}</button>
        <button class="btn btn-ghost" onclick="VV.exportLog()">📥 ${state.lang==='de'?'Log als .txt':'Log as .txt'}</button>
      </div>
    </div>`;
  startConfetti(8000);
  flash('win');
  beep(900, 350);
}

function playAgain() { initSoloGame(); setView('draft'); }
function toMenu() { state.game = null; setView('menu'); }

function speedToggleHtml() {
  const tags = [{ id:'normal', label:'🐢', t:T('speed_normal') }, { id:'fast', label:'⚡', t:T('speed_fast') }, { id:'auto', label:'🚀', t:T('speed_auto') }];
  return `<div style="display:flex; gap:0.3rem; margin-bottom:0.4rem;">
    <span style="font-size:0.65rem; letter-spacing:2px; color:var(--silver); text-transform:uppercase; align-self:center; margin-right:0.3rem;">${T('speed')}</span>
    ${tags.map(s => `<button class="lang-pill ${state.speed===s.id?'active':''}" data-tip="${s.t}" onclick="VV.setSpeed('${s.id}')">${s.label}</button>`).join('')}
  </div>`;
}

function continueAfterMatch() { fire('continueAfterMatch'); }
function serveOnce() { fire('serveOnce'); }

// ────────────────────────────────────────────────────────────────
//  RENDER DISPATCH
// ────────────────────────────────────────────────────────────────
function render() {
  switch (state.view) {
    case 'splash': /* HTML default */ break;
    case 'intro':       renderIntro(); break;
    case 'menu':        renderMenu(); break;
    case 'mp_submenu':  renderMpSubmenu(); break;
    case 'draft':       renderDraft(); break;
    case 'auction':     renderAuction(); break;
    case 'starting':    renderStarting(); break;
    case 'game':        renderGame(); break;
    case 'end':         renderEnd(); break;
  }
}


// ────────────────────────────────────────────────────────────────
//  ANIMATED MONEY / VP / COUNTERS
// ────────────────────────────────────────────────────────────────
function animateMoneyChange(player, delta) {
  // Add a small floating "+X" or "-X" near the topbar player card
  const topbar = $('#topbar'); if (!topbar) return;
  const idx = state.game.players.indexOf(player);
  const card = topbar.children[idx];
  if (!card) return;
  const fl = document.createElement('div');
  fl.className = 'money-float ' + (delta >= 0 ? 'pos' : 'neg');
  fl.textContent = (delta >= 0 ? '+' : '') + fmtMoney(delta) + '’';
  card.appendChild(fl);
  setTimeout(() => fl.remove(), 1600);
}
function animateVpChange(player, delta) {
  const topbar = $('#topbar'); if (!topbar) return;
  const idx = state.game.players.indexOf(player);
  const card = topbar.children[idx];
  if (!card) return;
  const fl = document.createElement('div');
  fl.className = 'vp-float';
  fl.textContent = (delta >= 0 ? '+' : '') + delta + ' VP';
  card.appendChild(fl);
  setTimeout(() => fl.remove(), 1800);
  beep(900, 120);
}

// ────────────────────────────────────────────────────────────────
//  FLOATING TEAM PANEL (always visible bottom-right)
// ────────────────────────────────────────────────────────────────
function ensureFloatingPanel() {
  let fp = $('#floating-panel');
  if (!fp) {
    fp = document.createElement('div');
    fp.id = 'floating-panel';
    fp.className = 'fp collapsed';
    document.body.appendChild(fp);
    fp.addEventListener('click', e => {
      if (e.target.closest('.fp-sell-btn') || e.target.closest('.fp-card')) return;
      // toggle expand
      fp.classList.toggle('expanded');
      fp.classList.toggle('collapsed');
    });
    document.addEventListener('click', e => {
      if (fp.classList.contains('expanded') && !fp.contains(e.target)) {
        fp.classList.add('collapsed'); fp.classList.remove('expanded');
      }
    });
  }
  return fp;
}
function refreshFloatingPanel() {
  if (!state.game || state.view !== 'game') {
    const fp = $('#floating-panel'); if (fp) fp.style.display = 'none';
    return;
  }
  const fp = ensureFloatingPanel();
  fp.style.display = '';
  const me = state.game.players[0];
  const expanded = fp.classList.contains('expanded');
  const sellMode = !!state.sellMode;
  fp.innerHTML = `
    <div class="fp-head">
      <div class="fp-title">${state.lang==='de'?'Mein Team':'My Team'} · <span style="color:var(--gold)">★ ${teamStrength(me)}</span></div>
      <div class="fp-controls">
        <button class="fp-sell-btn ${sellMode?'on':''}" data-tip="${state.lang==='de'?'Verkaufs-Modus':'Sell mode'}" onclick="event.stopPropagation(); VV.toggleSellMode()">🔴</button>
      </div>
    </div>
    <div class="fp-court">
      ${POSITIONS.map(pos => {
        const c = me.team[pos];
        return `<div class="fp-card pos-${pos} ${sellMode?'sellable':''}" style="border-color:${posColor(pos)};" data-pos="${pos}" onclick="event.stopPropagation(); VV.handleFloatingClick('${pos}')">
          ${c ? `<img src="${c.url}" alt="" loading="lazy"><div class="fp-stars">${'★'.repeat(c.stars)}</div>` : `<div class="fp-empty">?</div>`}
          <span class="fp-pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
        </div>`;
      }).join('')}
    </div>
    ${expanded ? `<div class="fp-bench">
      <div class="fp-bench-h">${state.lang==='de'?'Bench / Ersatz':'Bench / Substitutes'} (${me.bench.length})</div>
      <div class="fp-bench-grid">
        ${me.bench.map(c => `
          <div class="fp-card bench ${sellMode?'sellable':''}" data-id="${c.id}" onclick="event.stopPropagation(); VV.handleFloatingBenchClick('${c.id}')">
            <img src="${c.url}" alt="" loading="lazy">
            <div class="fp-stars">${'★'.repeat(c.stars)}</div>
            <span class="fp-pos-tag" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
          </div>`).join('') || `<span style="font-size:0.7rem; color:var(--silver);">—</span>`}
      </div>
    </div>` : ''}
    <div class="fp-foot">${state.lang==='de'?'Klick zum Erweitern':'Click to expand'}</div>`;
}
function toggleFloatingPanel() {
  const fp = ensureFloatingPanel();
  fp.classList.toggle('expanded');
  fp.classList.toggle('collapsed');
}
function toggleSellMode() {
  state.sellMode = !state.sellMode;
  refreshFloatingPanel();
  toast(state.sellMode ? (state.lang==='de'?'Verkaufs-Modus aktiv — klicke auf eine Karte':'Sell mode active — click a card') : (state.lang==='de'?'Verkaufs-Modus aus':'Sell mode off'), state.sellMode?'gold':'good', 1800);
}
function handleFloatingClick(pos) {
  if (state.sellMode) sellStarter(pos);
}
function handleFloatingBenchClick(id) {
  if (state.sellMode) sellBenchCard(id);
}

// ────────────────────────────────────────────────────────────────
//  EXPORT GAME LOG
// ────────────────────────────────────────────────────────────────
function exportLog() {
  if (!state.game) return;
  const lines = ['Volley Vendetta — Game Log', new Date().toISOString(), ''];
  for (const e of state.game.log) {
    // strip HTML
    const text = e.text.replace(/<[^>]+>/g, '');
    lines.push(text);
  }
  const blob = new Blob([lines.join('\n')], { type:'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `volley-vendetta-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
function showFullHistory() {
  if (!state.game) return;
  const div = document.createElement('div'); div.className = 'modal-popup';
  div.innerHTML = `
    <div class="modal-card" style="max-width:680px; max-height:85vh; display:flex; flex-direction:column;">
      <div class="modal-h">${state.lang==='de'?'Komplette Spiel-Historie':'Full game log'}</div>
      <div class="full-log" style="flex:1; overflow-y:auto; text-align:left; padding:0.6rem; background:rgba(0,0,0,0.4); border:1px solid var(--line); border-radius:3px; font-size:0.82rem;">
        ${state.game.log.map(e => `<div class="log-entry ${e.kind||''}"><span class="ts">·</span>${e.text}</div>`).join('')}
      </div>
      <div style="display:flex; gap:0.6rem; margin-top:0.8rem;">
        <button class="btn btn-secondary" onclick="VV.exportLog()">📥 ${state.lang==='de'?'Als .txt herunterladen':'Download as .txt'}</button>
        <button class="btn btn-primary" onclick="this.closest('.modal-popup').remove()">${state.lang==='de'?'Schliessen':'Close'}</button>
      </div>
    </div>`;
  document.body.appendChild(div);
  setTimeout(() => div.classList.add('open'), 10);
}


// ────────────────────────────────────────────────────────────────
//  PUBLIC API
// ────────────────────────────────────────────────────────────────
window.VV = {
  setView, setLang, setSpeed,
  advanceIntro, skipIntro,
  startSolo, openMultiplayer, createRoom, showJoinForm,
  draftDraw, draftRedraw, draftPick1, draftFinish,
  rollStartingDice,
  coneRollNow, coneContinue,
  buyCard, endMarket, buyOneStar, sellBenchCard, sellStarter,
  serveOnce, continueAfterMatch,
  playAgain, toMenu,
  toggleFloatingPanel, toggleSellMode, toggleLog,
  handleFloatingClick, handleFloatingBenchClick,
  exportLog, showFullHistory,
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
