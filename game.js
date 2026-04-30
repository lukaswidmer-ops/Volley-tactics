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

    pos_outside: 'Aussenangreifer', pos_outside2: 'Aussenangreifer 2', pos_middle: 'Mittelblocker', pos_middle2: 'Mittelblocker 2', pos_setter: 'Setter',
    pos_diagonal: 'Diagonal', pos_libero: 'Libero',
    pos_short_outside: 'OH', pos_short_outside2: 'OH2', pos_short_middle: 'MB', pos_short_middle2: 'MB2', pos_short_setter: 'S',
    pos_short_diagonal: 'OPP', pos_short_libero: 'L',

    week: 'Woche', of: 'von',
    phase_event: 'Event', phase_match: 'Liga', phase_buy: 'Markt', phase_weekend: 'Wochenende', phase_done: 'Ende',
    weekend_match: 'Wochenend-Spiel', weekend_match1: 'Spiel 1', weekend_match2: 'Spiel 2',
    weekend_win: 'Sieg! +3\'000', weekend_loss: 'Niederlage',
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
    sub_in: 'Ersatz',
    sub_label: 'SUB',
    sub_tooltip: 'Ersatz auf dem Feld – Stamm gesperrt/verletzt',
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

    pos_outside: 'Outside', pos_outside2: 'Outside 2', pos_middle: 'Middle', pos_middle2: 'Middle 2', pos_setter: 'Setter',
    pos_diagonal: 'Diagonal', pos_libero: 'Libero',
    pos_short_outside: 'OH', pos_short_outside2: 'OH2', pos_short_middle: 'MB', pos_short_middle2: 'MB2', pos_short_setter: 'S',
    pos_short_diagonal: 'OPP', pos_short_libero: 'L',

    week: 'Week', of: 'of',
    phase_event: 'Event', phase_match: 'League', phase_buy: 'Market', phase_weekend: 'Weekend', phase_done: 'Done',
    weekend_match: 'Weekend Match', weekend_match1: 'Match 1', weekend_match2: 'Match 2',
    weekend_win: 'Win! +3\'000', weekend_loss: 'Defeat',
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
    sub_in: 'Substitute',
    sub_label: 'SUB',
    sub_tooltip: 'Substitute on court – starter suspended/injured',
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
const sleep = ms => new Promise(r => setTimeout(r, (state.skipping ? 0 : ms)));
const range = n => Array.from({length:n}, (_,i)=>i);
function speedMs(ms) {
  if (state.speed === 'fast') return Math.max(40, ms*0.3);
  if (state.speed === 'auto') return Math.max(15, ms*0.08);
  return ms;
}
function uid(){ return Math.random().toString(36).slice(2,10); }
function escapeHTML(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function cardPrice(stars) { return [0,5000,10000,20000,35000,55000][stars] || 5000; }

// Dice roll utilities
function roll(n) { return 1 + Math.floor(Math.random()*n); }

// Build flat card pool — delegates to cards.js (window.VV_CARDS_DB)
function buildAllCards() {
  const db = (typeof window !== 'undefined' && Array.isArray(window.VV_CARDS_DB))
    ? window.VV_CARDS_DB : [];
  if (!db.length) console.error('[VV] VV_CARDS_DB ist leer – cards.js nicht geladen?');
  return db.map(c => Object.assign({}, c, { price: cardPrice(c.stars) }));
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
  skipping: false,
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
  refreshPhaseLog();
}

function refreshPhaseLog() {
  const strip = document.getElementById('phase-log-strip');
  if (!strip || !state.game) return;
  const entries = state.game.log.slice(-6).reverse();
  strip.innerHTML = entries.map((e, i) =>
    `<span class="pls-entry ${e.kind||''}" style="opacity:${Math.max(0.25, 1 - i * 0.16)}">${e.text}</span>`
  ).join('<span class="pls-sep">›</span>');
}

function ensureFloatingLog() {
  // Log is now in the fixed #log element in gbot — no floating panel needed
  let lp = document.getElementById('log-panel');
  if (lp) lp.style.display = 'none';
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
function setSpeed(s) { state.speed = s; localStorage.setItem('vv_speed', s); } // no render() — would destroy waitFor listeners mid-game

// Wait/fire helpers
const _waiters = {};
const _pendingFires = {}; // catches fire() calls when no waiter is set up yet
function waitFor(name, autoMs) {
  return new Promise(resolve => {
    if (state.skipping) { setTimeout(resolve, 0); return; }
    if (!name) { setTimeout(resolve, autoMs||1); return; }
    // If user already clicked before we got here, resolve immediately
    if (_pendingFires[name]) {
      const val = _pendingFires[name];
      delete _pendingFires[name];
      setTimeout(() => resolve(val === true ? undefined : val), 0);
      return;
    }
    _waiters[name] = resolve;
    const done = () => { if (_waiters[name]) { delete _waiters[name]; resolve(); } };
    if (autoMs) setTimeout(done, autoMs);
    setTimeout(done, 15000); // 15s safety timeout – verhindert permanentes Hängen
  });
}
function fire(name, val) {
  const r = _waiters[name];
  if (r) { delete _waiters[name]; r(val); return; }
  // No waiter yet — remember the fire so the next waitFor with this name resolves instantly
  _pendingFires[name] = val !== undefined ? val : true;
  // Keep pending clicks longer so early "Continue" presses during animations/events
  // are not lost before waitFor(...) is reached.
  setTimeout(() => { delete _pendingFires[name]; }, 30000);
}
function skipAll() {
  state.skipping = true;
  ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(fire);
  document.querySelectorAll('.modal-popup, .event-popup-banner, .game-popup').forEach(m => m.remove());
  setTimeout(() => { state.skipping = false; }, 3000);
}

// ── Generic full-screen game popup ──
// Registry for custom close-actions per popup (e.g. endMarket, pass-bid)
const _popupCloseCallbacks = {};
function registerPopupClose(id, fn) { _popupCloseCallbacks[id] = fn; }

function openGamePopup(id, title, bodyHtml) {
  let pop = document.getElementById(id);
  if (!pop) {
    pop = document.createElement('div');
    pop.id = id;
    pop.className = 'game-popup';
    document.body.appendChild(pop);
    // Backdrop click → run close callback (if any) then close
    pop.addEventListener('click', e => {
      if (e.target === pop) {
        if (_popupCloseCallbacks[id]) _popupCloseCallbacks[id]();
        closeGamePopup(id);
      }
    });
  }
  pop.innerHTML = `
    <div class="game-popup-inner">
      <div class="game-popup-head">
        <span class="game-popup-title">${title}</span>
        <button class="game-popup-close" id="${id}-close-btn">✕</button>
      </div>
      <div class="game-popup-body" id="${id}-body">${bodyHtml}</div>
    </div>`;
  requestAnimationFrame(() => {
    pop.classList.add('open');
    const closeBtn = document.getElementById(`${id}-close-btn`);
    if (closeBtn) closeBtn.onclick = () => {
      if (_popupCloseCallbacks[id]) _popupCloseCallbacks[id]();
      closeGamePopup(id);
    };
  });
}
function closeGamePopup(id) {
  const pop = document.getElementById(id);
  if (pop) { pop.classList.remove('open'); setTimeout(() => { pop.remove(); delete _popupCloseCallbacks[id]; }, 200); }
}
function updateGamePopupBody(id, bodyHtml) {
  const body = document.getElementById(id + '-body');
  if (body) body.innerHTML = bodyHtml;
}

function setActionsHtml(html) {
  const el = $('#actions');
  if (!el) return;
  el.innerHTML = html;
}

// ────────────────────────────────────────────────────────────────
//  Position helpers
// ────────────────────────────────────────────────────────────────
const POSITIONS = ['outside','outside2','middle','middle2','setter','diagonal','libero'];
const POS_COLORS = { outside:'#e84317', outside2:'#c2410c', middle:'#16a34a', middle2:'#166534', setter:'#0ea5e9', diagonal:'#4f46e5', libero:'#ca8a04' };
function posShort(p) { return T('pos_short_'+p); }
function posLabel(p) { return T('pos_'+p); }
function posColor(p) { return POS_COLORS[p]; }

function teamStrength(p) {
  return POSITIONS.reduce((s,k) => s + ((p.team[k] && !p.team[k].disabled ? p.team[k].stars : 0)), 0);
}
function teamFront(p) { return ['outside','middle','setter'].reduce((s,k) => s + ((p.team[k]&&!p.team[k].disabled?p.team[k].stars:0)),0); }
function teamBack(p)  {
  return ((p.team.libero&&!p.team.libero.disabled?p.team.libero.stars:0))
       + ((p.team.diagonal&&!p.team.diagonal.disabled?p.team.diagonal.stars:0))
       + ((p.team.outside&&!p.team.outside.disabled?p.team.outside.stars:0)/2)
       + ((p.team.outside2&&!p.team.outside2.disabled?p.team.outside2.stars:0)/2);
}
function teamBlock(p) { return ['outside','outside2','middle','middle2'].reduce((s,k) => s + ((p.team[k]&&!p.team[k].disabled?p.team[k].stars:0)),0); }


function performDiceRoll(type) {
  const value = roll(type);
  return animateDicePanel(type, value).then(() => value);
}

function animateDicePanel(type, finalValue) {
  // Update label
  const lbl = document.getElementById('dice-panel-label');
  if (lbl) lbl.textContent = '🎲 D' + type;
  const res = document.getElementById('dice-panel-result');
  const btn = document.getElementById('dice-panel-btn');
  if (btn) btn.disabled = true;
  if (!res) return Promise.resolve();
  return new Promise(resolve => {
    res.className = 'dice-panel-result shuffling';
    const dur = speedMs(900);
    const start = performance.now();
    const interval = setInterval(() => {
      res.textContent = Math.floor(Math.random() * type) + 1;
    }, 80);
    setTimeout(() => {
      clearInterval(interval);
      res.textContent = finalValue;
      res.className = 'dice-panel-result landed';
      // Also update old dice-num if present
      const numEl = document.getElementById('dice-num');
      if (numEl) { numEl.textContent = finalValue; }
      beep(680 + finalValue * 15, 90);
      resolve();
    }, dur);
  });
}

// dicePanel_roll: called by the dice panel button — fires the current waiter
function dicePanel_roll() {
  const btn = document.getElementById('dice-panel-btn');
  if (btn && btn.disabled) return;
  // Multi-purpose: also acts as "Continue" if that's what the game is waiting for
  if (_waiters['coneContinue']) { fire('coneContinue'); return; }
  if (_waiters['continueAfterMatch']) { fire('continueAfterMatch'); return; }
  if (_waiters['serveOnce']) { fire('serveOnce'); return; }
  fire('coneRollNow');
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
    team: { outside:null, outside2:null, middle:null, middle2:null, setter:null, diagonal:null, libero:null },
    bench: [],
    suspended: [], // [{ card, pos, reason }] — players sidelined by Red Card / Injury / VNL until next league match
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
    marketPile: [],    // unsold auction cards — appear on the market for direct purchase
    auctionDeck: [],   // shuffled 2-5 star cards for in-game auctions/transfers
    coneDay: 1,        // black cone position on the timeline (day 1 → 50)
    over: false, winner: null,
    leagueMatchesPlayed: 0,
    season: 1,
  };
  // Build auction deck: all 2-5 star cards (1-star are fixed-price separate)
  const aDeck = ALL_CARDS.filter(c => c.stars >= 2).slice().sort(()=>Math.random()-0.5);
  state.game.auctionDeck = aDeck;
}

// ────────────────────────────────────────────────────────────────
//  BLIND DRAFT (Setup Step 2 from rulebook)
// ────────────────────────────────────────────────────────────────
function setupTeamPanelHtml(p) {
  const s = p.team;
  const bench = p.bench || [];
  const positions = ['outside','middle','setter','diagonal','libero'];
  return `
    <div style="font-size:0.68rem; letter-spacing:3px; text-transform:uppercase; color:var(--silver); margin-bottom:0.6rem; display:flex; justify-content:space-between;">
      <span>🏐 ${state.lang==='de'?'Mein Team':'My Team'}</span>
      <span style="color:var(--gold)">★ ${teamStrength(p)} · ${fmtMoney(p.money)}'</span>
    </div>
    <div class="vb-formation" style="margin-bottom:0.5rem;">
      <div class="vb-net-line"></div>
      <div class="vb-row-label">${state.lang==='de'?'Vorne':'Front'}</div>
      <div class="vb-row vb-row-3">
        ${setupSlotHtml(s.middle,   'middle')}
        ${setupSlotHtml(s.outside,  'outside')}
        ${setupSlotHtml(s.setter,   'setter')}
      </div>
      <div class="vb-row-label" style="margin-top:0.4rem">${state.lang==='de'?'Hinten':'Back'}</div>
      <div class="vb-row vb-row-3">
        ${setupSlotHtml(s.diagonal, 'diagonal')}
        ${setupSlotHtml(s.outside2, 'outside2')}
        ${setupSlotHtml(s.libero,   'libero')}
      </div>
    </div>
    ${bench.length ? `<div style="font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:0.3rem">Bench (${bench.length})</div>
    <div style="display:flex; flex-wrap:wrap; gap:0.25rem;">
      ${bench.map(c=>`<div class="slot" style="width:40px;" data-tip="${escapeHTML(c.name)}·${c.stars}★">
        <span class="pos-tag" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
        <img src="${c.url}" alt=""><div class="stars">${'★'.repeat(c.stars)}</div>
      </div>`).join('')}
    </div>` : ''}`;
}

function setupSlotHtml(card, pos) {
  if (!card) return `<div class="slot empty vb-team-slot" data-tip="${posLabel(pos)}"><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
  return `<div class="slot vb-team-slot" data-tip="${escapeHTML(card.name)} · ${card.stars}★">
    <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
    <img src="${card.url}" alt=""><div class="stars">${'★'.repeat(card.stars)}</div>
  </div>`;
}

function refreshSetupTeamPanel() {
  const tp = document.getElementById('setup-team-panel');
  if (!tp || !state.game) return;
  tp.innerHTML = setupTeamPanelHtml(state.game.players[0]);
}

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
    <div style="padding:1.5rem; display:grid; grid-template-columns:1fr 280px; gap:1.5rem; max-width:1200px; margin:0 auto;">
      <div>
        <h2 class="h-cond" style="font-size:2rem; margin-bottom:0.3rem;">${T('draft_h')}</h2>
        <div style="color:var(--silver); margin-bottom:1.4rem;">${T('draft_p')}</div>
        <div class="draft-progress">${draftProgressHtml(me)}</div>
        <div class="draft-actions" id="draft-actions" style="margin-top:1.4rem;">${draftActionsHtml(stage, me)}</div>
        <div style="margin-top:2rem;">
          <h3 class="h-cond" style="font-size:1.1rem; margin-bottom:0.6rem;">${T('your')} · ${escapeHTML(me.name)} · ${fmtMoney(me.money)}</h3>
          <div class="draft-cards" id="draft-cards">${draftHandHtml(me)}</div>
        </div>
      </div>
      <div class="setup-team-panel" id="setup-team-panel">${setupTeamPanelHtml(me)}</div>
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

// Maps primary positions to their secondary slot (two-OH / two-MB rule)
const POS_SECONDARY = { outside: 'outside2', middle: 'middle2' };

function placeIntoTeamOrBench(p, card) {
  const primary = card.pos;
  const secondary = POS_SECONDARY[primary];

  if (!p.team[primary]) {
    p.team[primary] = card;
  } else if (secondary && !p.team[secondary]) {
    // Primary slot taken → fill secondary slot (same position type)
    p.team[secondary] = card;
  } else if (p.team[primary].stars < card.stars) {
    p.bench.push(p.team[primary]);
    p.team[primary] = card;
  } else if (secondary && p.team[secondary] && p.team[secondary].stars < card.stars) {
    p.bench.push(p.team[secondary]);
    p.team[secondary] = card;
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
  me.team = { outside:null, outside2:null, middle:null, middle2:null, setter:null, diagonal:null, libero:null };
  me.bench = [];
  renderDraft();
}

function draftPick1(pos) {
  const me = state.game.players[0];
  const counts = countByStars([...me.bench, ...Object.values(me.team).filter(Boolean)]);
  if (counts[1] >= 3) { toast('Already 3× 1★', 'bad'); return; }
  // outside2/middle2 share the same card pool as outside/middle
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
  const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === poolPos);
  if (!opts.length) { toast(T('no_card_for_pos')||'No card', 'bad'); return; }
  const c = choice(opts);
  // Force placement into the correct target slot
  if (!me.team[pos]) {
    me.team[pos] = c;
  } else {
    placeIntoTeamOrBench(me, c);
  }
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
    const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
    const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === poolPos);
    if (opts.length) {
      const c = choice(opts);
      if (!bot.team[pos]) bot.team[pos] = c; else placeIntoTeamOrBench(bot, c);
    }
  }
  ensureFiveStarter(bot);
}

function ensureFiveStarter(p) {
  // Move bench cards into empty starter slots for any unfilled position
  for (const pos of POSITIONS) {
    if (!p.team[pos]) {
      const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
      const idx = p.bench.findIndex(c => c.pos === poolPos);
      if (idx >= 0) {
        p.team[pos] = p.bench.splice(idx, 1)[0];
      }
    }
  }
  // If still empty, pick any 1-star card from the pool
  for (const pos of POSITIONS) {
    if (!p.team[pos]) {
      const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
      const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === poolPos);
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
    <div style="padding:1.5rem; display:grid; grid-template-columns:1fr 280px; gap:1.5rem; max-width:1200px; margin:0 auto;">
      <div>
        <h2 class="h-cond" style="font-size:2rem; margin-bottom:0.3rem;">${T('auction_h')}</h2>
        <div style="color:var(--silver); margin-bottom:1.4rem;">${T('auction_sub')}</div>
        <div class="topbar" id="topbar">${state.game.players.map((p,i)=>playerCardHtml(p,i,false)).join('')}</div>
        <div id="auction-stage" class="stage" style="margin-top:1rem;"></div>
      </div>
      <div class="setup-team-panel" id="setup-team-panel">${setupTeamPanelHtml(state.game.players[0])}</div>
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
        await sleep(speedMs(300));
        const opps = order.filter(o => o !== p);
        const decision = window.VV_BOTS.shouldBid(p, card, currentBid, minNext, opps);
        if (decision.pass || decision.bid > p.money || decision.bid < minNext) {
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
    refreshSetupTeamPanel();
    appendAuctionFeed(`<b style="color:var(--gold)">${fmt(T('auction_won'), escapeHTML(currentHigh.name), fmtMoney(currentBid))}</b>`);
    beep(900, 120);
  } else {
    appendAuctionFeed(`<b style="color:var(--silver)">${T('auction_no_one')}</b>`);
    state.game.marketPile.push(card); // unsold → available in market phase
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

// Fixed event per day-in-week (per spec): Day 4=tournament, Day 8=league handled separately
const DAY_EVENT = { 1:'red', 2:'transfer', 3:'action', 5:'vnl', 6:'action', 7:'injury' };
function eventTypeForDay(d) { return DAY_EVENT[d] || 'action'; }

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
      <div class="topbar" id="topbar">
        <div class="topbar-bots">${g.players.filter(p=>!p.isHuman).map((p)=>playerCardHtml(p,g.players.indexOf(p),true)).join('')}</div>
        <div class="topbar-sep"></div>
        <div class="topbar-log-area"><div class="log" id="log"></div></div>
        <div class="topbar-sep"></div>
        ${playerYouHtml(g.players[0], g)}
      </div>
      <div class="phase-bar" id="phase-bar"></div>
      <div class="gmid">
        <div class="gpanel-board" id="board-panel">
          <div class="gpanel-board-header">
            <span>🗺️ ${state.lang==='de'?'Spielbrett':'Game Board'}</span>
            <span id="board-week-label" style="color:var(--gold)"></span>
          </div>
          <div class="gpanel-board-inner" id="board">${boardHtml(g)}</div>
        </div>
        <div class="gpanel-team">
          <div class="gpanel-team-header">
            <span>🏐 ${state.lang==='de'?'Mein Team':'My Team'}</span>
            <span class="team-strength" id="team-strength-label">★ ${teamStrength(g.players[0])}</span>
          </div>
          <div class="gpanel-team-inner" id="team-panel">${teamPanelHtml(g.players[0])}</div>
        </div>
      </div>
      <div class="gbot">
        <div class="actions" id="actions"></div>
        <div class="dice-panel" id="dice-panel">
          <div class="dice-panel-label" id="dice-panel-label">🎲 D3</div>
          <div class="dice-panel-result" id="dice-panel-result">—</div>
          <button class="dice-panel-btn" id="dice-panel-btn" disabled onclick="VV.dicePanel_roll()">Würfeln</button>
          <button class="skip-btn" onclick="VV.skipAll()" title="Alles überspringen">⏭</button>
        </div>
        <div class="stage-panel" id="stage-panel">
          <div class="stage" id="stage"></div>
        </div>
        <div class="week-strip" id="week-strip">${weekStripHtml(g)}</div>
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
  return `<div class="player-card ${isActive?'active':''} ${isYou?'you':''}" data-pidx="${idx}" style="border-left:3px solid ${p.color};">
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

function playerYouHtml(p, g) {
  const isActive = g && g.players[g.activeIdx] === p;
  const str = teamStrength(p);
  return `<div class="you-card ${isActive?'active':''}" data-pidx="0" style="border-left:4px solid ${p.color};">
    <div class="yc-label">${state.lang==='de'?'DU':'YOU'}</div>
    <div class="yc-name">${p.emoji} ${escapeHTML(p.name)}</div>
    <div class="yc-stats">
      <div class="yc-stat"><span class="yc-key">${T('money')}</span><span class="yc-val">${fmtMoney(p.money)}'</span></div>
      <div class="yc-stat"><span class="yc-key">${T('vp')}</span><span class="yc-val">${p.vp}/8</span></div>
      <div class="yc-stat"><span class="yc-key">${T('str')}</span><span class="yc-val">★ ${str}</span></div>
      <div class="yc-stat"><span class="yc-key">L-Pts</span><span class="yc-val">${p.leaguePoints||0}</span></div>
    </div>
  </div>`;
}

function weekStripHtml(g) {
  const w = Math.floor((g.coneDay - 1) / 8) + 1;
  const dInW = ((g.coneDay - 1) % 8) + 1;
  const tourney = weekEventByWeek(w);
  const EV_ICON = { red:'🟥', transfer:'🔁', action:'🎴', vnl:'🚩', injury:'🩹',
    supercup:'🏆', cup:'🥈', cupfinal:'🥇', cl:'🌍', clfinal:'🌟' };
  const days = range(8).map(i => {
    const day = i + 1;
    let icon;
    if (day === 4 && tourney)   icon = EV_ICON[tourney.type] || '🏆';
    else if (day === 8)         icon = '🤝';
    else                        icon = EV_ICON[DAY_EVENT[day]] || '·';
    const isCur = day === dInW, isPast = day < dInW;
    return `<div class="ws-day${isCur?' ws-cur':''}${isPast?' ws-past':''}">
      <span class="ws-ico">${icon}</span>
      <span class="ws-num">${day}</span>
    </div>`;
  }).join('');
  const evLabel = dInW === 4 && tourney
    ? (EV_ICON[tourney.type]||'🏆') + ' ' + tourney.type.toUpperCase()
    : dInW === 8 ? '🤝 Liga'
    : EV_ICON[DAY_EVENT[dInW]] + ' ' + (T('cone_event_' + (DAY_EVENT[dInW]||'action')) || '');
  return `<div class="ws-head">
      <span class="ws-wlabel">${T('week')} ${w}<span style="color:var(--silver)">/6</span></span>
      <span class="ws-dlabel">${state.lang==='de'?'Tag':'Day'} ${dInW}</span>
    </div>
    <div class="ws-days">${days}</div>
    <div class="ws-ev">${evLabel}</div>`;
}
function refreshWeekStrip() {
  const el = $('#week-strip');
  if (!el || !state.game) return;
  el.innerHTML = weekStripHtml(state.game);
}

// Board grid coordinates measured on perfektes-spielbrett.png (1254×1254).
// Empirically calibrated via saturation profiling — the playable 6×8 grid
// (48 stops) sits within these % bounds; the bottom endgame row is part of
// the image but not part of the gameplay path.
const BOARD_GRID = {
  leftPct: 19.1, rightPct: 80.5,
  topPct: 21.5,  bottomPct: 64.6,
  cols: 8, rows: 6,
};
function coneDayToPct(day) {
  const d = Math.max(1, Math.min(48, day || 1));
  const row = Math.floor((d - 1) / BOARD_GRID.cols);
  const col = (d - 1) % BOARD_GRID.cols;
  const cellW = (BOARD_GRID.rightPct  - BOARD_GRID.leftPct) / BOARD_GRID.cols;
  const cellH = (BOARD_GRID.bottomPct - BOARD_GRID.topPct)  / BOARD_GRID.rows;
  return {
    leftPct: BOARD_GRID.leftPct + (col + 0.5) * cellW,
    topPct:  BOARD_GRID.topPct  + (row + 0.5) * cellH,
  };
}

function boardHtml(g) {
  // Visual board: real arena image as background, the black cone moves
  // smoothly across the 48 stops. The cone is the only interactive marker;
  // event icons (red card, trophy, league shirts, …) are baked into the
  // background art.
  const { leftPct, topPct } = coneDayToPct(g.coneDay);
  const w = Math.floor((g.coneDay - 1) / 8) + 1;
  const dInW = ((g.coneDay - 1) % 8) + 1;
  const ev = weekEventByWeek(w);
  return `<div class="vv-board" data-day="${g.coneDay}" data-week="${w}">
    <img class="vv-board-img" src="perfektes-spielbrett.jpg" alt="" draggable="false">
    <div class="board-cone" style="left:${leftPct}%; top:${topPct}%;" data-tip="${T('week')} ${w} · ${state.lang==='de'?'Tag':'Day'} ${dInW}">
      <svg viewBox="0 0 50 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="25" cy="58" rx="14" ry="3.4" fill="rgba(0,0,0,0.55)"/>
        <path d="M25 4 L41 50 L9 50 Z" fill="#0a0a0a" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M25 4 L33 22 L17 22 Z" fill="#222" opacity="0.8"/>
        <circle cx="20" cy="26" r="2" fill="rgba(255,255,255,0.35)"/>
      </svg>
    </div>
    <div class="vv-board-info">
      <span class="vbi-week">${T('week')} ${w}/6</span>
      <span class="vbi-day">${state.lang==='de'?'Tag':'Day'} ${dInW}/8</span>
      ${ev ? `<span class="vbi-ev">${T('week_event_'+ev.type)}</span>` : ''}
    </div>
  </div>`;
}

function teamPanelHtml(p, opts) {
  // Volleyball rotation: 6 positions in court order
  // Front row (left→right): pos4=OH, pos3=MB, pos2=OPP
  // Back row  (left→right): pos5=OH2(empty slot), pos6=Libero, pos1=Setter
  // In our 5-player setup: Front: [outside, middle, diagonal], Back: [setter, libero]
  // Standard rotation: OH ↔ OH (opposite sides), MB ↔ Libero (sub), OPP ↔ S (opposite)
  const s = p.team;
  const bench = p.bench || [];
  const readOnly = !!(opts && opts.readOnly);
  const sellMode = !readOnly && !!state.sellMode;
  
  function teamSlotHtml(card, pos) {
    if (!card) return `<div class="slot empty vb-team-slot" data-tip="${posLabel(pos)}"><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
    const dis = card.disabled ? 'disabled' : '';
    const sub = card._isSub ? 'is-sub' : '';
    const click = readOnly ? '' : `onclick="VV.handleFloatingClick('${pos}')"`;
    return `<div class="slot vb-team-slot ${dis} ${sub} ${sellMode?'sellable':''}" 
      data-tip="${escapeHTML(card.name)} · ${card.stars}★${card.disabled?' · '+(card.disabledReason||''):''}${sub?' · '+T('sub_tooltip'):''}"
      ${click}>
      <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
      <img src="${card.url}" alt="">
      <div class="stars">${'★'.repeat(card.stars)}</div>
      ${card.disabled?'<div class="dis-overlay">⛔</div>':''}
      ${card._isSub?`<div class="sub-badge">${T('sub_label')}</div>`:''}
    </div>`;
  }
  
  function benchSlotHtml(c) {
    const click = readOnly ? '' : `onclick="VV.handleFloatingBenchClick('${c.id}')"`;
    return `<div class="slot vb-bench-slot ${sellMode?'sellable':''}" 
      data-tip="${escapeHTML(c.name)} · ${c.stars}★ · ${posLabel(c.pos)}${c.disabled?' · ⛔':''}"
      ${click}>
      <span class="pos-tag" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <img src="${c.url}" alt="">
      <div class="stars">${'★'.repeat(c.stars)}</div>
      ${c.disabled?'<div class="dis-overlay">⛔</div>':''}
    </div>`;
  }

  const lang = state.lang === 'de';
  return `
    ${readOnly ? '' : `<div class="vb-sell-bar">
      <span style="font-size:0.7rem;color:var(--silver)">${lang?'Klicke Karte zum Verkaufen':'Click card to sell'}</span>
      <button class="vb-sell-toggle ${sellMode?'on':''}" onclick="VV.toggleSellMode()">
        🔴 ${sellMode?(lang?'Verkauf AN':'Sell ON'):(lang?'Verkaufen':'Sell')}
      </button>
    </div>`}
    <div class="vb-formation-wrap">
      <div class="vb-formation">
        <div class="vb-net-line"></div>
        <div class="vb-pos-labels">
          <span>4</span><span>3</span><span>2</span>
        </div>
        <div class="vb-row-label">${lang?'Vorne (netznahe)':'Front (near net)'}</div>
        <div class="vb-row vb-row-3">
          ${teamSlotHtml(s.middle,   'middle')}
          ${teamSlotHtml(s.outside,  'outside')}
          ${teamSlotHtml(s.setter,   'setter')}
        </div>
        <div class="vb-pos-labels" style="margin-top:0.5rem">
          <span>5</span><span>6</span><span>1</span>
        </div>
        <div class="vb-row-label">${lang?'Hinten':'Back'}</div>
        <div class="vb-row vb-row-3">
          ${teamSlotHtml(s.diagonal, 'diagonal')}
          ${teamSlotHtml(s.outside2, 'outside2')}
          ${teamSlotHtml(s.libero,   'libero')}
        </div>
      </div>
      <div class="vb-mb2-panel">
        <div class="vb-mb2-label">
          <span style="background:${POS_COLORS.middle2}" class="pos-tag">MB2</span>
          ${lang?'Ersatzmitte':'Bench Middle'}
        </div>
        <div class="vb-mb2-icon">🔄</div>
        ${teamSlotHtml(s.middle2, 'middle2')}
        <div class="vb-mb2-hint">${lang?'Im Hinten-Bereich durch Libero ersetzt':'Subbed by Libero in back row'}</div>
      </div>
    </div>
    <div class="vb-bench">
      <div class="vb-bench-label">⬇ ${lang?'Ersatz':'Bench'} (${bench.length})</div>
      <div class="vb-bench-row">
        ${bench.map(c => benchSlotHtml(c)).join('') || `<span style="font-size:0.7rem;color:rgba(255,255,255,0.3)">${lang?'Keine Ersatzspieler':'No bench players'}</span>`}
      </div>
    </div>`;
}
function slotHtml(card, pos) {
  if (!card) return `<div class="slot empty" data-tip="${posLabel(pos)}"><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
  const dis = card.disabled ? 'disabled' : '';
  const sub = card._isSub ? 'is-sub' : '';
  const subTip = card._isSub ? ` · ${T('sub_tooltip')}${card._subReason?' ('+card._subReason+')':''}` : '';
  return `<div class="slot ${dis} ${sub}" data-tip="${escapeHTML(card.name)} · ${card.stars}★${card.disabled?' · ' + (card.disabledReason||'-'):''}${subTip}">
    <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
    <img src="${card.url}" alt="">
    <div class="stars">${'★'.repeat(card.stars)}</div>
    ${card.disabled?'<div class="dis-overlay">⛔</div>':''}
    ${card._isSub?`<div class="sub-badge" data-tip="${T('sub_tooltip')}">${T('sub_label')}</div>`:''}
  </div>`;
}

function refreshTopbar() {
  const tb = $('#topbar'); if (!tb || !state.game) return;
  const g = state.game;
  // Update only bot-cards and YOU card — preserve topbar-log-area and #log
  const botsEl = tb.querySelector('.topbar-bots');
  if (botsEl) botsEl.innerHTML = g.players.filter(p=>!p.isHuman).map(p=>playerCardHtml(p,g.players.indexOf(p),true)).join('');
  const youEl = tb.querySelector('.you-card');
  if (youEl) {
    const newYou = document.createElement('div');
    newYou.innerHTML = playerYouHtml(g.players[0], g);
    const yc = newYou.firstElementChild;
    if (yc) youEl.replaceWith(yc);
  }
  refreshFloatingPanel();
}
function refreshBoard() {
  const b = $('#board'); if (!b || !state.game) return;
  // Smart update: if the board exists already, only nudge the cone position
  // and the info-pill so the CSS transition can play smoothly between stops.
  // Full re-render only when the board element is missing.
  const existingBoard = b.querySelector('.vv-board');
  const cone = b.querySelector('.board-cone');
  if (existingBoard && cone) {
    const g = state.game;
    const { leftPct, topPct } = coneDayToPct(g.coneDay);
    cone.style.left = leftPct + '%';
    cone.style.top  = topPct  + '%';
    existingBoard.dataset.day  = g.coneDay;
    const w = Math.floor((g.coneDay - 1) / 8) + 1;
    const dInW = ((g.coneDay - 1) % 8) + 1;
    existingBoard.dataset.week = w;
    cone.setAttribute('data-tip', `${T('week')} ${w} · ${state.lang==='de'?'Tag':'Day'} ${dInW}`);
    const info = b.querySelector('.vv-board-info');
    if (info) {
      const ev = weekEventByWeek(w);
      info.innerHTML =
        `<span class="vbi-week">${T('week')} ${w}/6</span>` +
        `<span class="vbi-day">${state.lang==='de'?'Tag':'Day'} ${dInW}/8</span>` +
        (ev ? `<span class="vbi-ev">${T('week_event_'+ev.type)}</span>` : '');
    }
    refreshWeekStrip();
    return;
  }
  b.innerHTML = boardHtml(state.game);
  refreshWeekStrip();
}
function refreshTeamPanel() {
  const tp = $('#team-panel'); if (!tp || !state.game) return;
  tp.innerHTML = teamPanelHtml(state.game.players[0]);
  const sl = $('#team-strength-label');
  if (sl) sl.textContent = '★ ' + teamStrength(state.game.players[0]);
}
function showOpponentBoard(opponent) {
  const boardInner = $('#board');
  if (!boardInner) return;
  boardInner.innerHTML = `
    <div class="opp-panel">
      <div class="opp-panel-header">
        <span class="opp-panel-title">⚔️ ${escapeHTML(opponent.name)}</span>
        <span class="opp-panel-stats">${opponent.emoji || ''} ★ ${teamStrength(opponent)} &nbsp;·&nbsp; ${fmtMoney(opponent.money)}'</span>
      </div>
      <div class="opp-team-wrap">
        ${teamPanelHtml(opponent, { readOnly: true })}
      </div>
    </div>`;
}
function restoreBoardPanel() {
  const boardInner = $('#board');
  if (!boardInner || !state.game) return;
  boardInner.innerHTML = boardHtml(state.game);
}
function setPhase(active) {
  const phases = [
    { id:'event',   label:T('phase_event'),   icon:'🎲' },
    { id:'match',   label:T('phase_match'),   icon:'🏐' },
    { id:'buy',     label:T('phase_buy'),     icon:'🛒' },
    { id:'weekend', label:T('phase_weekend'), icon:'🏅' },
    { id:'done',    label:T('phase_done'),    icon:'✅' },
  ];
  const order = ['event','match','buy','weekend','done'];
  const bar = $('#phase-bar'); if (!bar) return;
  bar.innerHTML = phases.map(p => {
    const cls = p.id === active ? 'active' : (order.indexOf(p.id) < order.indexOf(active) ? 'done' : '');
    return `<span class="phase ${cls}">${p.icon} ${p.label}</span>`;
  }).join('') + `<div class="phase-log-strip" id="phase-log-strip"></div><span class="phase">${T('week')} ${state.game.week}/6</span>`;
  refreshPhaseLog();
}

// ────────────────────────────────────────────────────────────────
//  SEASON LOOP — using the cone movement
// ────────────────────────────────────────────────────────────────
async function runSeason() {
  const g = state.game;
  while (g.week <= 6 && !g.over) {
    refreshBoard();
    // For each week: simulate cone advancement until cone reaches day 8 (league match)
    // Strict < so the loop exits the moment coneDay hits the league-match boundary (day 8, 16, 24…)
    const targetEndOfWeek = g.week * 8;
    while (g.coneDay < targetEndOfWeek && !g.over) {
      const active = g.players[g.activeIdx];
      // Active player rolls 3-die (or auto in fast mode)
      setPhase('event');
      try {
        await runConeRoll(active);
      } catch (err) {
        console.error('[VV] runConeRoll crashed:', err);
        // Fire any pending waiters so the game can try to continue
        ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(fire);
        toast(`⚠️ Fehler: ${err.message || err} — Spiel versucht fortzufahren`, 'bad', 5000);
        await sleep(1500);
      }
      if (g.over) return;
      // Move to next active player (clockwise)
      g.activeIdx = (g.activeIdx + 1) % g.players.length;
      refreshTopbar();
    }
    // Week complete — market phase
    setPhase('buy');
    await runMarketPhase();
    if (g.over) return;
    // Weekend matches
    setPhase('weekend');
    await runWeekendMatches(g.week);
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
  setActionsHtml(`<h3>${T('phase_event')}</h3>
    ${speedToggleHtml()}
    <button id="cone-roll-btn" class="action-btn pulse" data-tip="${T('cone_roll')}" onclick="VV.coneRollNow()">🎲 ${T('cone_roll')}</button>`);
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="stage-h">${T('week')} ${g.week} · Tag ${dayInWeekOf(g.coneDay)}</div>
    <div class="stage-sub">${escapeHTML(player.name)} ${player.isHuman?T('yourturn'):T('bot_thinking')+' …'}</div>
    <div class="dice-area" style="margin-top:1rem;">
      <div class="dice-num" id="dice-num">—</div>
    </div>
    <div id="cone-log" style="margin-top:1rem;"></div>`;
  // Update dice panel
  const dpBtn = document.getElementById('dice-panel-btn');
  const dpLbl = document.getElementById('dice-panel-label');
  if (dpLbl) dpLbl.textContent = '🎲 D3';
  if (state.speed !== 'auto') {
    if (dpBtn) {
      dpBtn.disabled = false;
      dpBtn.classList.add('pulse');
      dpBtn.textContent = player.isHuman ? '🎲 Würfeln' : ('▶ ' + (state.lang === 'de' ? 'Weiter (Bot würfelt)' : 'Continue (bot rolls)'));
    }
    await waitFor('coneRollNow');
    if (dpBtn) {
      dpBtn.disabled = true;
      dpBtn.classList.remove('pulse');
      dpBtn.textContent = '🎲 Würfeln';
    }
  } else {
    if (dpBtn) dpBtn.disabled = true;
    await sleep(speedMs(3000)); // bot thinking pause before roll
  }
  const v = await performDiceRoll(3);
  const advance = v >= 3 ? 2 : 1;     // rule: 1=+1, 2=+1, 3=+2
  const start = g.coneDay;
  const end = start + advance;
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🎲 ${v} (${state.lang==='de'?'+':'+'}${advance})`);
  // Advance day-by-day — triggers for every day passed OR landed on (spec §2.8)
  // Stop at day 8 (end of week / league match): cone must not cross into next week's events
  for (let d = start + 1; d <= end; d++) {
    g.coneDay = d;
    refreshBoard();
    await sleep(speedMs(350));
    await resolveDay(g.coneDay, player);
    if (g.over) return;
    if (dayInWeekOf(d) === 8) break; // league match day = end of week, stop here
  }
  if (!g.over) {
    // If the cone landed on/passed the league match day (8), auto-continue after a
    // short pause — the match summary already served as the "end of turn" confirmation.
    const lastDayWasLeague = dayInWeekOf(g.coneDay) === 8;
    setActionsHtml(`<h3>${T('phase_event')}</h3>
      ${speedToggleHtml()}
      <button class="action-btn pulse" onclick="VV.coneContinue()">${T('cone_continue')}</button>`);
    const dpBtn2 = document.getElementById('dice-panel-btn');
    if (dpBtn2) { dpBtn2.disabled = false; dpBtn2.classList.add('pulse'); dpBtn2.textContent = '▶ ' + T('cone_continue'); }
    if (state.speed === 'auto' || lastDayWasLeague) {
      setTimeout(()=>fire('coneContinue'), lastDayWasLeague ? speedMs(2000) : speedMs(3000));
    }
    // Manual flow for normal speed (also for bots): user confirms each step.
    const continueAutoMs = state.speed === 'auto' ? speedMs(4000) : speedMs(10000);
    await waitFor('coneContinue', continueAutoMs);
    if (dpBtn2) { dpBtn2.disabled = true; dpBtn2.classList.remove('pulse'); dpBtn2.textContent = '🎲 Würfeln'; }
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
  try {
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
  // Fixed event per day-in-week (spec §2.7)
  const evType = eventTypeForDay(dInW);
  await runEventSpace(evType, triggerPlayer);
  } catch (err) {
    console.error('[VV] resolveDay crashed (day=' + day + '):', err);
    ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(fire);
    toast(`⚠️ Event-Fehler (Tag ${day}): ${err.message || err}`, 'bad', 4000);
  }
}

// ────────────────────────────────────────────────────────────────
//  EVENT SPACES
// ────────────────────────────────────────────────────────────────
async function runEventSpace(type, player) {
  const stage = $('#stage');
  if (!stage) return;
  const map = {
    red:      { h:T('cone_event_red'),      p:T('cone_event_red_p'),      icon:'🟥' },
    transfer: { h:T('cone_event_transfer'), p:T('cone_event_transfer_p'), icon:'🔁' },
    action:   { h:T('cone_event_action'),   p:T('cone_event_action_p'),   icon:'🎴' },
    vnl:      { h:T('cone_event_vnl'),      p:T('cone_event_vnl_p'),      icon:'🚩' },
    injury:   { h:T('cone_event_injury'),   p:T('cone_event_injury_p'),   icon:'🩹' },
  };
  const e = map[type];
  if (!e) { console.warn('[VV] Unknown event type:', type); return; }
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
  await sleep(speedMs(1500));
}

function diePositionFor(roll6) {
  // Map 1..6 to a starter position (deterministic abstraction)
  return ['libero','outside','middle','setter','diagonal','outside'][roll6-1];
}

async function applyRedCard(player) {
  const detail = $('#event-detail');
  if (!detail) return;
  detail.innerHTML = `<div class="dice-area"><div class="dice-num" id="dice-num">—</div></div>`;
  const v = await performDiceRoll(6);
  const pos = diePositionFor(v);
  const subbed = disablePlayerOnTeam(player, pos, T('cone_event_red'));
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🟥 ${posLabel(pos)} ${T('injury_out')}${subbed?` · ${T('sub_in')}: ${escapeHTML(subbed.name)}`:''}`);
  refreshTeamPanel();
  refreshFloatingPanel();
}

async function applyTransfer(player) {
  const card = state.game.auctionDeck.shift();
  if (!card) { appendConeLog(T('auction_no_one')); return; }
  let high = 0, highP = null;
  const order = state.game.players.slice();
  while (order[0] !== player) order.push(order.shift());
  const minBid = card.stars * 10000;
  for (const p of order) {
    if (p.money < minBid) continue;
    if (p.isHuman) {
      const r = await humanBidPopup(p, card, Math.max(minBid, high + 1000));
      if (r && !r.pass && r.bid > high && r.bid <= p.money) { high = r.bid; highP = p; }
    } else {
      const dec = window.VV_BOTS.shouldBid(p, card, high, Math.max(minBid, high + 1000), order);
      if (!dec.pass && dec.bid > high) { high = dec.bid; highP = p; }
    }
  }
  if (highP) {
    highP.money -= high;
    placeIntoTeamOrBench(highP, card);
    appendConeLog(`${highP.emoji} ${escapeHTML(highP.name)} \u2192 ${escapeHTML(card.name)} (${fmtMoney(high)}')`);
  } else {
    // Nobody bid — card goes to market pile for direct purchase next market phase
    state.game.marketPile.push(card);
    appendConeLog(T('auction_no_one'));
  }
  refreshTopbar(); refreshTeamPanel();
}

function humanBidPopup(p, card, minNext) {
  return new Promise(resolve => {
    let settled = false;
    const finish = (val) => { if (settled) return; settled = true; resolve(val); };
    const sugg = Math.min(p.money, minNext);
    const id = 'transfer-bid-popup';
    const body = `
      <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1rem;">
        <img src="${card.url}" style="width:80px;border-radius:4px;" alt="">
        <div>
          <div style="font-weight:700;font-size:1rem;">${escapeHTML(card.name)}</div>
          <div style="color:var(--silver);font-size:0.8rem;">${'\u2605'.repeat(card.stars)} \u00b7 ${posLabel(card.pos)}</div>
          <div style="color:var(--silver);font-size:0.8rem;margin-top:0.3rem;">${T('auction_minbid')}: <b>${fmtMoney(minNext)}'</b> \u00b7 ${T('money')}: <b>${fmtMoney(p.money)}'</b></div>
        </div>
      </div>
      <div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;">
        <input type="number" id="bid-popup-input" min="${minNext}" max="${p.money}" step="1000" value="${sugg}"
          style="width:130px;padding:0.4rem 0.6rem;background:#111;border:1px solid var(--line);color:#fff;border-radius:4px;font-size:0.9rem;">
        <button class="btn btn-primary" id="bid-popup-do">${T('auction_bid')}</button>
        <button class="btn btn-secondary" id="bid-popup-pass">${T('auction_pass')}</button>
      </div>`;
    const passAndClose = () => { closeGamePopup(id); finish({ pass: true }); };
    // ✕ and backdrop close = same as "pass"
    registerPopupClose(id, () => finish({ pass: true }));
    openGamePopup(id, `\ud83d\udd01 ${T('cone_event_transfer')} \u2014 ${escapeHTML(p.name)}`, body);
    setTimeout(() => {
      const doBtn = document.getElementById('bid-popup-do');
      const passBtn = document.getElementById('bid-popup-pass');
      const input = document.getElementById('bid-popup-input');
      if (doBtn) doBtn.onclick = () => {
        const v = parseInt((input && input.value) || '0', 10);
        closeGamePopup(id);
        finish({ bid: v });
      };
      if (passBtn) passBtn.onclick = passAndClose;
      if (input) {
        input.focus();
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && doBtn) doBtn.click(); });
      }
    }, 50);
    // Safety timeout: auto-pass if popup is left open.
    setTimeout(() => {
      if (!settled) { closeGamePopup(id); finish({ pass: true }); }
    }, 12000);
  });
}

async function applyActionCard(player) {
  player.money += 5000;
  player.totalEarned += 5000;
  animateMoneyChange(player, 5000);
  // Non-blocking in digital version: no modal interaction, only info.
  toast(`🎴 ${T('cone_event_action')} · +${fmtMoney(5000)}'`, '', 2200);
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🎴 ${T('cone_event_action')} +5'`);
  refreshTopbar();
}

function showActionCardPopup() {
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
  // Backdrop click closes as well (prevents blocked UI if user misses OK button).
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  setTimeout(() => div.classList.add('open'), 10);
  // Safety auto-close to avoid hard-stuck overlays during event flow.
  setTimeout(() => { if (document.body.contains(div)) div.remove(); }, 3500);
}

async function applyVnlEvent(player) {
  // VNL/Nationalteam: kein Spieleffekt in dieser Version — nur Infotext
  const msg = state.lang === 'de'
    ? 'In Zukunft fallen hier Spieler mit der Nationalität vom Spielbrett aus.'
    : 'In the future, players with the nationality shown on the board will be unavailable here.';
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🚩 ${state.lang==='de'?'VNL':'VNL'} · <i style="color:var(--silver)">${msg}</i>`);
  toast(`🚩 VNL — ${msg}`, '', 3500);
}

async function applyInjury(player) {
  const detail = $('#event-detail');
  detail.innerHTML = `<div class="dice-area"><div class="dice-num" id="dice-num">—</div></div>`;
  const v = await performDiceRoll(6);
  const pos = diePositionFor(v);
  const subbed = disablePlayerOnTeam(player, pos, T('cone_event_injury'));
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🩹 ${posLabel(pos)} ${T('injury_out')}${subbed?` · ${T('sub_in')}: ${escapeHTML(subbed.name)}`:''}`);
  refreshTeamPanel();
  refreshFloatingPanel();
}

// ────────────────────────────────────────────────────────────────
//  SUSPENSION / INJURY HELPERS
//  When an event (Red Card / Injury / VNL / dice criterion 11) sidelines
//  a starter, we keep the disabled flag (so legacy paths still work) AND
//  swap in a same-position bench card if available. The original goes
//  into player.suspended and gets restored on the next league match.
// ────────────────────────────────────────────────────────────────
function disablePlayerOnTeam(player, pos, reason) {
  const card = player.team[pos];
  if (!card) return null;
  if (card._isSub) {
    // Already a sub filling this slot — disable it, try to find a new replacement below
    card.disabled = true;
    card.disabledReason = reason;
    // Fall through: treat this slot as now empty and find another sub/emergency card
  } else {
    if (card.disabled) { card.disabledReason = reason; return null; }
    card.disabled = true;
    card.disabledReason = reason;
  }
  if (!Array.isArray(player.suspended)) player.suspended = [];
  if (!Array.isArray(player.bench)) player.bench = [];

  // Pool mapping: outside2 accepts 'outside' bench cards, middle2 accepts 'middle'
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;

  // Look for a bench card matching the position (exact or pool)
  const benchIdx = player.bench.findIndex(b => !b.disabled && (b.pos === pos || b.pos === poolPos));
  if (benchIdx >= 0) {
    const sub = player.bench.splice(benchIdx, 1)[0];
    sub._isSub = true;
    sub._subReason = reason;
    player.team[pos] = sub;
    player.suspended.push({ card, pos, reason });
    return sub;
  }

  // No bench replacement — buy an emergency 1★ card for 10'000
  const cost = 10000;
  player.money = Math.max(0, player.money - cost);
  animateMoneyChange(player, -cost);
  toast(`⚠️ ${state.lang === 'de' ? 'Kein Ersatz — Notfallkauf' : 'No sub — emergency buy'} -${fmtMoney(cost)}'`, 'bad', 2500);

  const opts = (ALL_CARDS || []).filter(c => c.stars === 1 && c.pos === poolPos);
  if (opts.length) {
    const emergency = choice(opts);
    const em = Object.assign({}, emergency, {
      _isSub: true,
      _subReason: (state.lang === 'de' ? 'Notfall-Einwechslung' : 'Emergency sub'),
    });
    player.team[pos] = em;
    player.suspended.push({ card, pos, reason });
    return em;
  }

  // Absolute fallback: disabled card stays in the slot (should rarely happen)
  return null;
}

function restoreDisabledCards(afterLeague) {
  const g = state.game;
  for (const p of g.players) {
    if (!Array.isArray(p.suspended)) p.suspended = [];
    if (!Array.isArray(p.bench)) p.bench = [];
    // 1) For each suspended entry: original returns to the team slot,
    //    the temporary sub goes back to the bench.
    while (p.suspended.length) {
      const entry = p.suspended.shift();
      const cur = p.team[entry.pos];
      if (cur && cur._isSub) {
        delete cur._isSub;
        delete cur._subReason;
        p.bench.push(cur);
        entry.card.disabled = false;
        entry.card.disabledReason = null;
        p.team[entry.pos] = entry.card;
      } else {
        // Slot was changed in the meantime (e.g. market buy or re-sub);
        // keep the suspended player on the bench as a safe fallback.
        entry.card.disabled = false;
        entry.card.disabledReason = null;
        p.bench.push(entry.card);
      }
    }
    // 2) Any remaining disabled cards on team had no sub at the time —
    //    just clear their flags now.
    for (const pos of POSITIONS) {
      const c = p.team[pos];
      if (c && c.disabled) { c.disabled = false; c.disabledReason = null; }
    }
  }
  refreshTopbar(); refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
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
  logEntry(`<b>${T('week_event_cupfinal')}</b> → ${escapeHTML(winner.name)} +2 VP +${fmtMoney(ev.prize)}' · ${escapeHTML(loser.name)} +1 VP`, 'tournament');
  flash('win');
  beep(900, 200);
  refreshTopbar();
  if (checkWin()) return;
}

// SUPERCUP — last season's league winner vs cup winner.  In single-season build, we treat it as
// "current best two by team strength" (placeholder until multi-season).
async function runSuperCup(ev) {
  const g = state.game;
  if (g.season <= 1) {
    appendConeLog(`<i style="color:var(--silver)">${state.lang==='de'?'Super Cup — startet ab Saison 2':'Super Cup — starts from Season 2'}</i>`);
    return;
  }
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
    // Auto-close: fast for auto-speed, 2.5s otherwise (so bots never block)
    const autoCloseMs = state.speed === 'auto' ? 1200 : speedMs(2500);
    setTimeout(() => { if (document.body.contains(div)) { div.remove(); resolve(); } }, autoCloseMs);
  });
}

// ────────────────────────────────────────────────────────────────
//  CLASSIC LEAGUE MATCH — 12 criteria (rule-faithful)
//  Used for both Liga-Spiele AND tournament resolutions.
//  Returns the winning player.
// ────────────────────────────────────────────────────────────────
async function runMatchClassic(home, away, isTournament) {
  // Show the opponent (non-human) in the board panel
  const me = state.game.players[0];
  const opp = home === me ? away : home;
  if (opp !== me) showOpponentBoard(opp);
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
  function paint() {
    const stage = $('#stage');
    if (!stage) return;
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
    const total = M.totalRolls + M.crunchExtra;
    const rollLabel = `${Math.min(M.iRoll + 1, total)}/${total}`;
    setActionsHtml(`<h3>${T('phase_match')} · ${rollLabel}</h3>
      ${speedToggleHtml()}
      <button id="serve-btn" class="action-btn pulse" data-tip="${T('serve_t')}" onclick="VV.serveOnce()">🏐 ${T('serve')}</button>`);
  }
  setActionUI(); paint();

  const humanInMatch = (home === me || away === me);
  const totalRolls = () => M.totalRolls + M.crunchExtra;
  while (M.iRoll < totalRolls() && !M.ended) {
    if (humanInMatch && state.speed !== 'auto') {
      // Backup trigger: if the action button is obscured, dice-panel can still start the next rally.
      const dpBtn = document.getElementById('dice-panel-btn');
      if (dpBtn) {
        dpBtn.disabled = false;
        dpBtn.classList.add('pulse');
        dpBtn.textContent = '🏐 ' + T('serve');
      }
      await waitFor('serveOnce');
      if (dpBtn) {
        dpBtn.disabled = true;
        dpBtn.classList.remove('pulse');
        dpBtn.textContent = '🎲 Würfeln';
      }
    } else await sleep(speedMs(1000)); // bot serve delay (shorter than 2s so matches don't drag)
    const dice = await performDiceRoll(12);
    M.rolls.push(dice);
    const result = await resolveCriterion(dice, M);
    M.events.push(result);
    if (result.winner === 'home') M.homePoints++;
    else if (result.winner === 'away') M.awayPoints++;
    // Show the criterion in the topbar log area for 3 seconds
    showMatchCriterionInTopbar(result, M);
    // rotation: winning team rotates
    if (result.winner === 'home') M.rotationHome = (M.rotationHome + 1) % 6;
    else if (result.winner === 'away') M.rotationAway = (M.rotationAway + 1) % 6;
    M.iRoll++;
    paint(); setActionUI();
    refreshTopbar();
    beep(result.winner === 'home' ? 740 : result.winner === 'away' ? 480 : 540, 60);
  }

  // Determine winner; for tournament ties use coin flip, league ties return null (draw)
  let winner;
  const tied = M.homePoints === M.awayPoints;
  if (M.homePoints > M.awayPoints) winner = home;
  else if (M.awayPoints > M.homePoints) winner = away;
  else winner = isTournament ? (Math.random() < 0.5 ? home : away) : null; // draw in league

  // Show summary
  await showMatchSummary(M, winner);
  if (winner) flash(winner === home ? 'win' : 'loss');
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
      const sub = disablePlayerOnTeam(team, pos, T('cone_event_injury'));
      M._injuryWho = team; M._injuryPos = pos; M._injurySub = sub;
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
  else if (kind === 'injury') text = `${escapeHTML(M._injuryWho.name)} · ${posLabel(M._injuryPos)} ${T('injury_out')}${M._injurySub?` · ${T('sub_in')}: ${escapeHTML(M._injurySub.name)}`:''}`;
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

// Show the resolved match-criterion in the topbar log area for ~3 seconds.
// Replaces the log overlay with a big colored banner showing dice number,
// criterion name, who scored and a short reason.
let _matchCritTimeout = null;
function showMatchCriterionInTopbar(result, M) {
  const area = document.querySelector('.topbar-log-area');
  if (!area) return;
  const home = M.home, away = M.away;
  const w = result.winner; // 'home' | 'away' | 'tie'
  const winnerName = w === 'home' ? escapeHTML(home.name)
                  : w === 'away' ? escapeHTML(away.name)
                  : (state.lang === 'de' ? 'Unentschieden' : 'Tie');
  const cls = w === 'home' ? 'home-win' : w === 'away' ? 'away-win' : 'tie';
  const dot = w === 'home' ? '🟢' : w === 'away' ? '🔴' : '⚪';
  let banner = area.querySelector('.match-crit-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'match-crit-banner';
    area.appendChild(banner);
  }
  banner.className = 'match-crit-banner ' + cls;
  banner.innerHTML = `
    <div class="mcb-row1">
      <span class="mcb-dice">#${result.dice}</span>
      <span class="mcb-kind">${T('crit_'+result.kind)}</span>
      <span class="mcb-score">${dot} ${winnerName}${w!=='tie'?' +1':''}</span>
    </div>
    <div class="mcb-row2">${result.text || ''}</div>
    <div class="mcb-row3">${escapeHTML(home.name)} ${M.homePoints} : ${M.awayPoints} ${escapeHTML(away.name)}</div>`;
  banner.classList.add('show');
  if (_matchCritTimeout) clearTimeout(_matchCritTimeout);
  _matchCritTimeout = setTimeout(() => {
    if (banner) banner.classList.remove('show');
  }, 3000);
}

async function showMatchSummary(M, winner) {
  const stage = $('#stage');
  if (!stage) return;
  const summary = `${escapeHTML(M.home.name)} ${M.homePoints}:${M.awayPoints} ${escapeHTML(M.away.name)}`;
  const headLine = winner
    ? `${winner === M.home ? '🏆 ' : ''}${escapeHTML(winner.name)} ${state.lang==='de'?'gewinnt':'wins'}`
    : (state.lang==='de' ? '🤝 Unentschieden' : '🤝 Draw');
  stage.innerHTML = `
    <div class="stage-h">${headLine}</div>
    <div class="stage-sub">${summary}</div>
    <div style="margin-top:0.5rem; display:flex; gap:0.3rem; flex-wrap:wrap;">
      ${M.events.map(e => `<span class="crit-pill ${e.winner}">#${e.dice} ${T('crit_'+e.kind)}</span>`).join('')}
    </div>`;
  const me = state.game ? state.game.players[0] : null;
  const humanInMatch = me && (M.home === me || M.away === me);
  const autoMs = (!humanInMatch || state.speed === 'auto') ? speedMs(2000) : 0;
  // Button always in actions panel — never buried in the stage scroll area
  setActionsHtml(`<h3>${T('phase_match')}</h3>
    ${speedToggleHtml()}
    <button class="action-btn pulse" onclick="VV.continueAfterMatch()">${T('next_match')}</button>`);
  // Dice-panel button acts as backup "Continue" trigger during match summary
  const matchDpBtn = document.getElementById('dice-panel-btn');
  if (humanInMatch && state.speed !== 'auto' && matchDpBtn) {
    matchDpBtn.disabled = false; matchDpBtn.classList.add('pulse');
    matchDpBtn.textContent = '▶ ' + T('next_match');
  }
  if (!humanInMatch || state.speed === 'auto') setTimeout(() => fire('continueAfterMatch'), speedMs(3000));
  await waitFor('continueAfterMatch', autoMs);
  if (matchDpBtn) { matchDpBtn.disabled = true; matchDpBtn.classList.remove('pulse'); matchDpBtn.textContent = '🎲 Würfeln'; }
  restoreBoardPanel();
}

// Mini court diagram (6 positions in a 3×2 grid representing front + back rows)
function courtMiniHtml(player, rotation) {
  // Court slot numbering (matches volleyball positions 1–6):
  //   slot 0 = pos1 (back-right, server)
  //   slot 1 = pos6 (back-middle)
  //   slot 2 = pos5 (back-left)
  //   slot 3 = pos4 (front-left)
  //   slot 4 = pos3 (front-middle)
  //   slot 5 = pos2 (front-right)
  //
  // ROT 1 (r=0, S at pos 2 front-right):  Front: MB | OH | S   Back: D | OH | L  (server = back-right)
  // ROT 2 (r=1, S at pos 1 back-right):   Front: D  | MB | OH  Back: OH| L  | S
  // ROT 3 (r=2, S at pos 6 back-mid):     Front: OH | D  | MB  Back: L | S  | OH
  // ROT 4 (r=3, S at pos 5 back-left):    Front: MB | OH | D   Back: S | OH | L
  // ROT 5 (r=4, S at pos 4 front-left):   Front: S  | MB | OH  Back: OH| L  | D
  // ROT 6 (r=5, S at pos 3 front-mid):    Front: OH | S  | MB  Back: L | D  | OH
  // OH2/MB2 share the same label as OH/MB on the court but keep distinct colors.
  const basePositions = ['middle2', 'outside2', 'diagonal', 'middle', 'outside', 'setter'];

  const r = ((rotation || 0) % 6 + 6) % 6;

  // Clockwise rotation: slot i gets the player that started at slot (i - r + 6k) % 6
  function getPos(slotIdx) {
    return basePositions[((slotIdx - r) % 6 + 6) % 6];
  }

  // Collect all back-row slots where a middle (MB1 or MB2) ends up → Libero subs in
  const liberoSwapSlots = new Set();
  for (const s of [0, 1, 2]) {
    const p = getPos(s);
    if (p === 'middle' || p === 'middle2') liberoSwapSlots.add(s);
  }

  const swapTip = state.lang === 'de'
    ? 'Libero ersetzt MB in der Hinterreihe'
    : 'Libero subs in for MB in back row';

  function cell(slotIdx, kInRow, isBackRow) {
    let pos = getPos(slotIdx);
    // MB in back row → Libero swap
    const isSwap = isBackRow && liberoSwapSlots.has(slotIdx);
    if (isSwap) pos = 'libero';

    // Keep distinct colors (outside vs outside2, middle vs middle2) but unify labels
    // so the court display matches the spec: both OHs = "OH", both MBs in front = "MB"
    const color = posColor(pos);
    let labelPos = pos;
    if (pos === 'outside2') labelPos = 'outside';
    if (pos === 'middle2')  labelPos = 'middle';
    const label = posShort(labelPos);
    const cls   = isSwap ? 'is-libero-sub' : '';
    const tip   = isSwap ? `${label} · ${swapTip}` : label;
    const srv   = isBackRow && kInRow === 2 ? ' 🏐' : '';
    return `<span class="court-cell ${cls}" style="background:${color}" data-tip="${tip}${srv}">${label}${srv}</span>`;
  }

  return `<div class="court-mini">
    <div class="court-row top">
      ${[3,4,5].map((slot, k) => cell(slot, k, false)).join('')}
    </div>
    <div class="court-row bot">
      ${[2,1,0].map((slot, k) => cell(slot, k, true)).join('')}
    </div>
  </div>`;
}

async function runLeagueMatch() {
  const g = state.game;
  setPhase('match');
  // Pair human (home this week) vs strongest bot
  const me = g.players[0];
  const opp = g.players.filter(p => p !== me).sort((a,b)=>teamStrength(b)-teamStrength(a))[0];
  const home = me; const away = opp;
  showOpponentBoard(away);
  const winner = await runMatchClassic(home, away, false);
  restoreBoardPanel();
  // Award league points and money per rulebook (spec §2.9)
  if (winner === null) {
    // Draw: both +5k bank, both +1 LP
    home.money += 5000; home.totalEarned += 5000; animateMoneyChange(home, 5000);
    away.money += 5000; away.totalEarned += 5000; animateMoneyChange(away, 5000);
    home.leaguePoints = (home.leaguePoints||0) + 1;
    away.leaguePoints = (away.leaguePoints||0) + 1;
    logEntry(`🏐 ${T('phase_match')}: 🤝 ${state.lang==='de'?'Unentschieden':'Draw'} — ${escapeHTML(home.name)} & ${escapeHTML(away.name)} je +5'`);
  } else if (winner === home) {
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
  // Market only shows unsold auction cards (from marketPile) + 1-star section (always-available)
  // No random cards from the full deck — only what actually went through auction and wasn't bought
  return state.game.marketPile.slice();
}

async function runMarketPhase() {
  const g = state.game;
  g.market = regenMarket();
  renderMarket();
  // Bots act first, then human's turn (to give clear "your turn" feel)
  for (const bot of g.players.filter(p => !p.isHuman)) {
    await sleep(speedMs(200)); // bot market buy thinking delay
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

// ────────────────────────────────────────────────────────────────
//  WEEKEND MATCHES — Round-Robin schedule, 2 matches per week
//  Players: index 0 = human (Lukas), 1 = BotA, 2 = BotB, 3 = BotC
//  Each week: human always plays in Match 1; bot-vs-bot in Match 2
// ────────────────────────────────────────────────────────────────
const WEEKEND_SCHEDULE = [
  // [match1: [homeIdx, awayIdx], match2: [homeIdx, awayIdx]]
  [[0, 1], [2, 3]],  // Week 1
  [[0, 2], [3, 1]],  // Week 2
  [[0, 3], [1, 2]],  // Week 3
  [[0, 1], [2, 3]],  // Week 4
  [[0, 2], [3, 1]],  // Week 5
  [[0, 3], [1, 2]],  // Week 6
];

async function runWeekendMatches(week) {
  const g = state.game;
  const schedule = WEEKEND_SCHEDULE[week - 1];
  if (!schedule) return;
  const me = g.players[0];
  // User request: only one weekend match should be played (the human match).
  const humanPair = schedule.find(([hi, ai]) => g.players[hi] === me || g.players[ai] === me);
  if (!humanPair) return;
  const [hi, ai] = humanPair;
  const home = g.players[hi];
  const away = g.players[ai];
  if (!home || !away) return;

  const opp = home === me ? away : home;
  showOpponentBoard(opp);

  const stage = $('#stage');
  if (stage) {
    stage.innerHTML = `
      <div class="stage-h">🏅 ${T('weekend_match')} · ${T('week')} ${week}</div>
      <div class="stage-sub">${escapeHTML(home.name)} vs ${escapeHTML(away.name)}</div>`;
  }

  const winner = await runMatchClassic(home, away, true);
  if (winner) {
    winner.money += 3000;
    winner.totalEarned += 3000;
    animateMoneyChange(winner, 3000);
    const loser = winner === home ? away : home;
    logEntry(`🏅 ${T('weekend_match')} W${week}: <b>${escapeHTML(winner.name)}</b> +3' · ${escapeHTML(loser.name)}`, 'tournament');
  } else {
    logEntry(`🏅 ${T('weekend_match')} W${week}: 🤝 ${escapeHTML(home.name)} — ${escapeHTML(away.name)}`);
  }

  restoreBoardPanel();
  refreshTopbar();
  if (checkWin()) return;
}

function marketBodyHtml(me, weakPos) {
  const de = state.lang === 'de';
  const unsoldCards = state.game.market; // already filtered unsold auction cards
  return `
    <div class="gp-market-info">
      <span>${T('market_budget')}: <b id="budget-num">${fmtMoney(me.money)}'</b></span>
      <span>${T('market_team_strength')}: <b>&#9733; ${teamStrength(me)}</b></span>
      <span>${T('market_suggest')}: <b style="color:var(--gold)">${posLabel(weakPos)}</b></span>
    </div>
    <div class="gp-section-h">${de?'1-Stern-Karten (fester Preis)':'1-Star Cards (fixed price)'}</div>
    <div class="market market-1star">${oneStarMarketHtml(me, weakPos)}</div>
    ${unsoldCards.length ? `
      <div class="gp-section-h" style="margin-top:0.8rem;">${de?'Unverkaufte Auktionskarten':'Unsold Auction Cards'} (${unsoldCards.length})</div>
      <div class="market" id="market-grid">${unsoldCards.map(c => marketCardHtml(c, me, { suggestedPos: weakPos })).join('')}</div>
    ` : `<div style="color:var(--silver);font-size:0.72rem;margin-top:0.6rem;font-style:italic;">${de?'Noch keine unverkauften Auktionskarten':'No unsold auction cards yet'}</div>`}
    ${me.bench.length ? `<div class="gp-section-h" style="margin-top:0.8rem;">${de?'Meine Bank':'My Bench'}</div><div class="bench-grid">${me.bench.map(c => benchCardHtml(c, me)).join('')}</div>` : ''}
    <div class="gp-footer">
      <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>
    </div>`;
}

function renderMarket() {
  if (!state.game) return;
  const me = state.game.players[0];
  const weakPos = weakestPosition(me);
  const title = state.lang === 'de' ? 'MARKT' : 'MARKET';
  const body = marketBodyHtml(me, weakPos);
  const existing = document.getElementById('market-popup');
  if (existing && existing.classList.contains('open')) {
    updateGamePopupBody('market-popup', body);
  } else {
    // ✕ / backdrop close = same as "Fertig kaufen" (run full endMarket logic)
    registerPopupClose('market-popup', () => { if (_waiters['endMarket']) endMarket(); });
    openGamePopup('market-popup', title, body);
  }
  // Also expose "Fertig" in the actions panel so the user can always find it
  setActionsHtml(`<h3>${T('phase_buy')}</h3>${speedToggleHtml()}
    <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>`);
}

function oneStarMarketHtml(me, weakPos) {
  return POSITIONS.map(pos => {
    const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
    const c = (ALL_CARDS.filter(x => x.stars === 1 && x.pos === poolPos)[0]) || null;
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
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
  const opts = ALL_CARDS.filter(c => c.stars === 1 && c.pos === poolPos);
  if (!opts.length) return;
  const c = choice(opts);
  const cur = me.team[pos];
  if (cur) me.bench.push(cur); // always move existing card to bench
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
  // outside2/middle2 slots accept cards of the primary position type
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
  const replIdx = me.bench.findIndex(b => b.pos === poolPos || b.pos === pos);
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
  // weakestPosition can return outside2/middle2; cards only have outside/middle — map both directions
  const _poolPos = { outside2: 'outside', middle2: 'middle' };
  const _sp = opts && opts.suggestedPos;
  const suggested = _sp && (c.pos === _sp || c.pos === (_poolPos[_sp] || _sp));
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
  // Remove from both market display list and marketPile
  state.game.market = state.game.market.filter(x => x.id !== c.id);
  state.game.marketPile = state.game.marketPile.filter(x => x.id !== c.id);
  toast(state.lang==='de' ? `Gekauft: ${c.name}` : `Bought: ${c.name}`, 'good');
  beep(880, 60);
  refreshTopbar(); refreshTeamPanel();
  renderMarket();
}
function endMarket() {
  closeGamePopup('market-popup');
  const g = state.game;
  if (g) {
    // Unsold market cards stay in marketPile for next week
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
  const moneyAward = [50000, 30000, 20000, 0];
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
  g.over = true; // ensure consistent state regardless of how game ended
  if (!g.winner) g.winner = g.players.slice().sort((a,b) => b.vp - a.vp)[0];
  setView('end');
}

function renderEnd() {
  const app = $('#app');
  const g = state.game;
  if (!g) { app.innerHTML = `<div class="end-wrap"><h2>Spiel beendet</h2><button class="btn btn-primary" onclick="VV.toMenu()">Menü</button></div>`; return; }
  const ranked = g.players.slice().sort((a,b) => b.vp - a.vp);
  if (!g.winner) g.winner = ranked[0];
  const winner = g.winner;
  if (!winner) { app.innerHTML = `<div class="end-wrap"><h2>Spiel beendet</h2><button class="btn btn-primary" onclick="VV.toMenu()">Menü</button></div>`; return; }
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

function speedToggleHtml() { return ''; } // speed buttons removed — clicking them during a match caused render() to rebuild the DOM and lose all waitFor listeners

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
  const topbar = $('#topbar'); if (!topbar) return;
  const idx = state.game.players.indexOf(player);
  const card = topbar.querySelector(`[data-pidx="${idx}"]`);
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
  const card = topbar.querySelector(`[data-pidx="${idx}"]`);
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
  const fp = $('#floating-panel'); if (fp) fp.style.display = 'none';
}
function toggleFloatingPanel() {
  const fp = ensureFloatingPanel();
  fp.classList.toggle('expanded');
  fp.classList.toggle('collapsed');
}
function toggleSellMode() {
  state.sellMode = !state.sellMode;
  refreshTeamPanel(); refreshFloatingPanel();
  toast(state.sellMode ? (state.lang==='de'?'Verkaufs-Modus aktiv — klicke auf eine Karte':'Sell mode active — click a card') : (state.lang==='de'?'Verkaufs-Modus aus':'Sell mode off'), state.sellMode?'gold':'good', 1800);
}
function handleFloatingClick(pos) {
  if (state.sellMode) { sellStarter(pos); refreshTeamPanel(); }
}
function handleFloatingBenchClick(id) {
  if (state.sellMode) { sellBenchCard(id); refreshTeamPanel(); }
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
  coneRollNow, coneContinue, dicePanel_roll, skipAll,
  buyCard, endMarket, buyOneStar, sellBenchCard, sellStarter,
  serveOnce, continueAfterMatch,
  playAgain, toMenu,
  toggleFloatingPanel, toggleSellMode, toggleLog,
  handleFloatingClick, handleFloatingBenchClick,
  exportLog, showFullHistory,
};

// ────────────────────────────────────────────────────────────────
//  KEYBOARD SHORTCUTS — Space / Enter advances any pending waiter
// ────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (e.key === ' ' || e.key === 'Enter') {
    if (_waiters['coneContinue'])     { e.preventDefault(); fire('coneContinue');      return; }
    if (_waiters['continueAfterMatch']){ e.preventDefault(); fire('continueAfterMatch'); return; }
    if (_waiters['serveOnce'])        { e.preventDefault(); fire('serveOnce');         return; }
    if (_waiters['coneRollNow'])      { e.preventDefault(); fire('coneRollNow');       return; }
    if (_waiters['endMarket'])        { e.preventDefault(); fire('endMarket');         return; }
  }
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
