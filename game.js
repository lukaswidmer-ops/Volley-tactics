/* ================================================================
   VOLLEY VENDETTA — Online Game (Classic Mode, single season)
   Rule-faithful build per official rulebook (April 2026 edition).
   Pure vanilla JS, no build step.
   ================================================================ */
(function () {
'use strict';

// ============================================================
// MULTIPLAYER FLAG
// Owned by multiplayer.js. Defaults to false so all solo logic
// runs unchanged. Any new MP-specific branch must be guarded by
// `if (MULTIPLAYER)` or `if (!MULTIPLAYER)` — never mixed in.
// ============================================================
let MULTIPLAYER = false;

// ============================================================
// 1. CONSTANTS & CONFIGURATION
//    i18n strings, colour tokens, commentary, board layout
// ============================================================
// ── Game constants — named values used throughout game.js ─────────────────
const STARTING_GOLD      = 80000;  // money each player begins with
const WEEKS_PER_SEASON   = 6;      // total weeks per season
const EVENT_POPUP_MS     = 25000;  // auto-close delay for action-card popups (human turn) — 25 s
const BOT_POPUP_MS       = 5000;   // auto-close delay when a bot triggers the popup — 5 s
const SPONSOR_BONUS      = 15000;  // Trikotsponsor cash grant
const AUDIENCE_LOSS      = 8000;   // Zuschauerrückgang deduction per player
const VETERAN_BONUS      = 5000;   // Ehemaligentreffen bonus per 1-star card
const MATCH_DRAW_BONUS      = 5000;   // money awarded on draw / bye week
const MATCH_WIN_BONUS       = 10000;  // kept for backward compat — use LIGA_WIN_BANK in payout logic
const MATCH_DRAW_LP         = 1;      // league points for a draw
const MATCH_WIN_LP          = 3;      // league points for a win
const LIGA_WIN_BANK         = 10000;  // bank payout for league win
const LIGA_WIN_FROM_LOSER   = 5000;   // amount transferred from loser to winner in league match
const PRICE_PER_STAR        = 10000;  // base price per star for all cards (buy price = card.stars * PRICE_PER_STAR)
const CUP_WIN_BANK          = 20000;  // bank payout for any cup / tournament win (semi, final, supercup)
const WAITFOR_TIMEOUT_MS = 30000;  // safety timeout for waitFor()
// ─────────────────────────────────────────────────────────────────────────

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

    week: 'Woche', of: 'von', cal_day: 'Tag',
    rally_even: 'Keiner punktet — Ballwechsel ohne Ergebnis.',
    draft_deck_empty: 'Keine passende Karte mehr im Draft-Stapel.',
    draft_pick_limit: 'Bereits 3× 1★ gewählt.',
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

    money: 'Geld', vp: 'Siegpunkte', str: 'Stärke', pos: 'Pos', you: 'Du', stats_lp: 'Liga-P',
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

    week: 'Week', of: 'of', cal_day: 'Day',
    rally_even: 'No point — rally continues.',
    draft_deck_empty: 'No matching card left in the draft deck.',
    draft_pick_limit: 'You already picked 3× 1★ cards.',
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

    money: 'Money', vp: 'Victory pts', str: 'Strength', pos: 'Pos', you: 'You', stats_lp: 'LP',
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
      'Zuspiel sitzt perfekt — %player% hämmert in die Lücke! 🎯',
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

// ============================================================
// 3. UTILITY FUNCTIONS
// ============================================================
const $ = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const T = (k) => (i18n[state.lang] && i18n[state.lang][k]) || k;
const fmt = (str, ...args) => { let i=0; return str.replace(/%[ds]|%(\d+)/g, () => args[i++]); };
const fmtMoney = n => (n||0).toLocaleString('de-CH').replace(/,/g,'’');
/** Safe table points for UI + math (avoids NaN from += on undefined). */
function leaguePointsVal(p) {
  const n = Number(p && p.leaguePoints);
  return Number.isFinite(n) ? n : 0;
}
const choice = arr => arr[Math.floor(Math.random()*arr.length)];
const sleep = ms => new Promise(r => setTimeout(r, (state.skipping ? 0 : ms)));
const range = n => Array.from({length:n}, (_,i)=>i);
function speedMs(ms) {
  if (state.speed === 'fast') return Math.max(40, ms*0.3);
  if (state.speed === 'auto') return Math.max(15, ms*0.08);
  // Slightly slower when a human is playing, so events feel less rushed
  const humanPlaying = state.game && state.game.players.some(p => p.isHuman);
  return humanPlaying ? ms * 1.5 : ms;
}
function uid(){ return Math.random().toString(36).slice(2,10); }
function escapeHTML(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
/** @deprecated — use cardBasePrice(card) instead */
function cardPrice(stars) { return stars * PRICE_PER_STAR; }
function cardBasePrice(card) { return ((card && card.stars) || 1) * PRICE_PER_STAR; }
function cardImageBasename(card) {
  const raw = String((card && card.url) || '');
  if (!raw) return '';
  const clean = raw.split('?')[0].split('#')[0];
  const parts = clean.split('/');
  return parts[parts.length - 1] || clean;
}

// Dice roll utilities
function roll(n) { return 1 + Math.floor(Math.random()*n); }

// Single game card pool: clone roster from cards.js once per game and attach prices.
function buildGameCardPool() {
  let db = [];
  try {
    if (typeof window !== 'undefined' && typeof window.vvBuildRosterCards === 'function') {
      db = window.vvBuildRosterCards() || [];
    }
  } catch (err) {
    console.error('[VV] buildGameCardPool roster read failed:', err);
  }
  if (!Array.isArray(db) || !db.length) console.error('[VV] Kartenliste leer – cards.js nicht geladen?');
  return db.map(c => Object.assign({}, c, { price: cardBasePrice(c) }));
}
let ALL_CARDS = [];

/** Remove this card reference from shared piles (not from player rosters). */
function removeCardFromPools(card) {
  try {
    if (!card || !state.game) return;
    const g = state.game;
    g.auctionDeck = (g.auctionDeck || []).filter(c => c !== card);
    g._draftDeck = (g._draftDeck || []).filter(c => c !== card);
    g.market = (g.market || []).filter(c => c !== card);
    g.marketPile = (g.marketPile || []).filter(c => c !== card);
  } catch (err) {
    console.error('[VV] removeCardFromPools:', err);
  }
}

/** Evict one duplicate instance from pools / all rosters (keeps earlier occurrence elsewhere). */
function stripDuplicateCardInstance(card) {
  try {
    if (!card || !state.game) return;
    const g = state.game;
    removeCardFromPools(card);
    for (const p of g.players) {
      for (const pos of POSITIONS) {
        if (p.team[pos] === card) p.team[pos] = null;
      }
      p.bench = (p.bench || []).filter(c => c !== card);
      p.suspended = (p.suspended || []).filter(e => !e || e.card !== card);
    }
  } catch (err) {
    console.error('[VV] stripDuplicateCardInstance:', err);
  }
}

function assertNoDuplicates() {
  try {
    const g = state.game;
    if (!g || !Array.isArray(g.players)) return;
    const firstById = new Map();
    const collect = [];
    const push = (c) => { if (c && c.id) collect.push(c); };
    for (const p of g.players) {
      for (const pos of POSITIONS) push(p.team[pos]);
      for (const c of (p.bench || [])) push(c);
      for (const e of (p.suspended || [])) if (e && e.card) push(e.card);
    }
    for (const c of (g.marketPile || [])) push(c);
    for (const c of (g.auctionDeck || [])) push(c);
    for (const c of (g._draftDeck || [])) push(c);
    for (const card of collect) {
      if (firstById.has(card.id) && firstById.get(card.id) !== card) {
        console.error('[VV] DUPLICATE CARD:', card.id, card.name);
        stripDuplicateCardInstance(card);
      } else if (!firstById.has(card.id)) {
        firstById.set(card.id, card);
      }
    }
  } catch (err) {
    console.error('[VV] assertNoDuplicates:', err);
  }
}

function rebuildAuctionDeckAfterDraft() {
  try {
    const g = state.game;
    if (!g || !Array.isArray(ALL_CARDS)) return;
    const owned = ownedCardIds();
    g.auctionDeck = ALL_CARDS.filter(c => c && Number(c.stars) >= 2 && !owned.has(c.id))
      .slice()
      .sort(() => Math.random() - 0.5);
    g._draftDeck = [];
  } catch (err) {
    console.error('[VV] rebuildAuctionDeckAfterDraft:', err);
  }
}

function pickUnowned1Star(poolPos) {
  try {
    const owned = ownedCardIds();
    const opts = (ALL_CARDS || []).filter(c => c && c.stars === 1 && c.pos === poolPos && !owned.has(c.id));
    return opts.length ? choice(opts) : null;
  } catch (err) {
    console.error('[VV] pickUnowned1Star:', err);
    return null;
  }
}


// ── Card-lookup helpers ────────────────────────────────────────────────────
/**
 * Ensures the highest-star non-disabled card of each position is on the field.
 * Disabled (suspended) cards are never placed on the field.
 * Call after any team change: auction win, market buy/sell, loan, week start.
 */
function autoSelectLineup(player) {
  const POS_SEC = { outside: 'outside2', middle: 'middle2' };
  for (const pos of ['outside', 'middle', 'setter', 'diagonal', 'libero']) {
    const sec = POS_SEC[pos];
    // Collect all available (non-disabled) cards of this position from team + bench
    const avail = [];
    const pCard = player.team[pos];
    if (pCard && !pCard.disabled) { avail.push(pCard); player.team[pos] = null; }
    if (sec) {
      const sCard = player.team[sec];
      if (sCard && !sCard.disabled) { avail.push(sCard); player.team[sec] = null; }
    }
    const keptBench = [];
    for (const c of (player.bench || [])) {
      if (c && !c.disabled && c.pos === pos) avail.push(c);
      else if (c) keptBench.push(c);
    }
    player.bench = keptBench;
    avail.sort((a, b) => b.stars - a.stars);
    // Same physical card must never occupy primary + secondary (e.g. outside + outside2)
    const uniq = [];
    const seenId = new Set();
    for (const c of avail) {
      if (c && c.id && !seenId.has(c.id)) {
        seenId.add(c.id);
        uniq.push(c);
      }
    }
    let i = 0;
    if (i < uniq.length) player.team[pos] = uniq[i++];
    if (sec && i < uniq.length) player.team[sec] = uniq[i++];
    while (i < uniq.length) player.bench.push(uniq[i++]);
  }
}

/** Returns {card, pos} of the highest-star non-disabled team card, or null. */
function teamBestCard(player) {
  let bestCard = null, bestPos = null;
  for (const pos of Object.keys(player.team)) {
    const c = player.team[pos];
    if (c && !c.disabled && (!bestCard || c.stars > bestCard.stars)) { bestCard = c; bestPos = pos; }
  }
  return bestCard ? { card: bestCard, pos: bestPos } : null;
}
/** Returns {card, pos} of the lowest-star non-disabled team card, or null. */
function teamWorstCard(player) {
  let worstCard = null, worstPos = null;
  for (const pos of Object.keys(player.team)) {
    const c = player.team[pos];
    if (c && !c.disabled && (!worstCard || c.stars < worstCard.stars)) { worstCard = c; worstPos = pos; }
  }
  return worstCard ? { card: worstCard, pos: worstPos } : null;
}
// ─────────────────────────────────────────────────────────────────────────
// ============================================================
// 2. STATE
// ============================================================
const state = {
  lang: localStorage.getItem('vv_lang') || 'de',
  soundOn: localStorage.getItem('vv_sound') === '1',
  view: 'splash',
  introIdx: 0,
  playerName: localStorage.getItem('vv_name') || '',
  mode: null,
  // Always normal: speed UI was removed; old localStorage 'fast'/'auto' caused auto-advance without clicks.
  speed: 'normal',
  game: null,
  skipping: false,
  sellMode: false,
  selectedBenchCard: null, // id of bench card selected for manual swap
};

// ============================================================
// 4. UI HELPERS
//    Toast, flash, log, beep, popups, view switching
// ============================================================
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
//  4b. View switching
// ────────────────────────────────────────────────────────────────
function setView(v) {
  state.view = v;
  if (MULTIPLAYER && state.mpRoom && state.mpRoom.isHost && state.game) {
    try { state.game._mpUiView = v; } catch (_) {}
  }
  if (v !== 'draft') removeDraftRestartButton();
  document.getElementById('app').dataset.view = v;
  render();
  window.scrollTo(0, 0);
  // Hide floating log + panel outside game
  const lp = document.getElementById('log-panel'); if (lp) lp.style.display = (v === 'game') ? '' : 'none';
  const fp = document.getElementById('floating-panel'); if (fp) fp.style.display = (v === 'game') ? '' : 'none';
  refreshDebugHud();
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
let _expectedAdvance = 'coneRollNow';
let _lastAdvanceSource = '-';
let _lastFired = '-';
let _lastAdvanceClickAt = 0;
function refreshDebugHud() {
  const el = document.getElementById('vv-debug-hud');
  if (el) el.remove();
}
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
    refreshDebugHud();
    let tAuto = 0, tSafe = 0;
    const done = () => {
      if (_waiters[name] !== resolve) return;
      if (tAuto) clearTimeout(tAuto);
      if (tSafe) clearTimeout(tSafe);
      tAuto = tSafe = 0;
      delete _waiters[name];
      resolve();
      refreshDebugHud();
    };
    if (autoMs) {
      // autoMs > 0: an automatic trigger is expected — also set a safety net
      tAuto = setTimeout(done, autoMs);
      tSafe = setTimeout(done, Math.max(autoMs * 3, 15000));
    }
    // autoMs === 0 (or not passed): waiting for manual user click — NO safety timeout
  });
}
function fire(name, val) {
  _lastFired = name;
  const r = _waiters[name];
  if (r) { delete _waiters[name]; r(val); refreshDebugHud(); return; }
  // No waiter yet — remember the fire so the next waitFor with this name resolves instantly
  _pendingFires[name] = val !== undefined ? val : true;
  // Keep pending clicks longer so early "Continue" presses during animations/events
  // are not lost before waitFor(...) is reached.
  setTimeout(() => { delete _pendingFires[name]; }, WAITFOR_TIMEOUT_MS);
  refreshDebugHud();
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

// ─── Team Sidebar (shown beside auction / market popups) ──────────────────────

/**
 * Show (or refresh) the team sidebar.
 * @param {object|null} auctionCard  The card currently being auctioned; null for market.
 */
function showTeamSidebar(auctionCard) {
  try {
    const g = state.game;
    if (!g) return;
    const me = g.players[0];
    if (!me) return;
    const de = state.lang === 'de';

    // --- Build position groups ---
    const POS_ORDER = ['outside', 'middle', 'setter', 'diagonal', 'libero'];
    const POS_DOT   = { outside:'🔴', middle:'🟢', setter:'🔵', diagonal:'🔷', libero:'🟡' };
    const POS_SECONDARY = { outside:'outside2', middle:'middle2' };

    // Gather all non-null cards per canonical position
    const cardsByPos = {};
    for (const pos of POS_ORDER) {
      const sec = POS_SECONDARY[pos];
      const cards = [];
      for (const slot of [pos, sec].filter(Boolean)) {
        const c = me.team[slot];
        if (c) cards.push({ card: c, slot, onBench: false });
      }
      for (const c of (me.bench || [])) {
        if (c && c.pos === pos) cards.push({ card: c, slot: null, onBench: true });
      }
      cardsByPos[pos] = cards;
    }

    // --- Auction-card highlight class ---
    const acPos = auctionCard ? auctionCard.pos : null;

    const posGroupHtml = (pos) => {
      const items = cardsByPos[pos] || [];
      const count = items.length;

      // Determine highlight class + label for this auction card's position
      let hlCls = '', hlLabel = '';
      if (acPos === pos) {
        if (count === 0)       { hlCls = 'need';   hlLabel = de ? '✅ Brauche ich!'         : '✅ Need this!'; }
        else if (count === 1)  { hlCls = 'backup'; hlLabel = de ? '⚡ Backup möglich'        : '⚡ Backup possible'; }
        else                   { hlCls = 'full';   hlLabel = de ? '✓ Bereits gut besetzt'   : '✓ Already covered'; }
      }

      const labelClass = { need:'team-sidebar-need-label', backup:'team-sidebar-backup-label', full:'team-sidebar-full-label' }[hlCls] || '';

      const cardRows = items.length
        ? items.map(({ card: c, onBench }) => {
            const isSusp  = c.disabled;
            const nameClass = isSusp ? 'suspended' : (onBench ? 'bench' : '');
            const suffix    = isSusp ? ' ⛔' : (onBench ? ` <span style="color:#666">(${de?'Bank':'Bench'})</span>` : '');
            return `<div class="team-sidebar-card-row">
              <img src="${c.url}" alt="" loading="lazy">
              <span class="team-sidebar-card-name ${nameClass}">${escapeHTML(c.name)}${suffix}</span>
              <span style="color:var(--gold);font-size:.65rem;flex-shrink:0">${'★'.repeat(c.stars)}</span>
            </div>`;
          }).join('')
        : `<div class="team-sidebar-empty">— ${de ? 'leer' : 'empty'} —</div>`;

      return `<div class="team-sidebar-pos-group ${hlCls}">
        <div class="team-sidebar-pos-label" style="color:${posColor(pos)}">${POS_DOT[pos]} ${posLabel(pos)}</div>
        ${hlLabel ? `<div class="${labelClass}">${hlLabel}</div>` : ''}
        ${cardRows}
      </div>`;
    };

    const html = `
      <h4>📋 ${de ? 'MEIN KADER' : 'MY SQUAD'}</h4>
      <div class="team-sidebar-gold">💰 ${fmtMoney(me.money)}'</div>
      ${POS_ORDER.map(posGroupHtml).join('')}`;

    // Reuse existing panel or create new one
    let sidebar = document.getElementById('team-sidebar');
    if (!sidebar) {
      sidebar = document.createElement('div');
      sidebar.id        = 'team-sidebar';
      sidebar.className = 'team-sidebar';
      document.body.appendChild(sidebar);
    }
    sidebar.innerHTML = html;
    // Keep sidebar after other fixed layers (e.g. .game-popup) so z-index + paint order stay correct.
    document.body.appendChild(sidebar);
    sidebar.classList.remove('team-sidebar--pop');
    void sidebar.offsetWidth;
    sidebar.classList.add('team-sidebar--pop');
  } catch (err) {
    console.error('[VV] showTeamSidebar crashed:', err);
  }
}

function hideTeamSidebar() {
  try {
    teardownMarketSidebarHover();
    const el = document.getElementById('team-sidebar');
    if (el) el.remove();
  } catch (_) {}
}

let _marketSidebarHoverEl = null;
function _marketSidebarPointerOver(ev) {
  const mc = ev.target.closest('.mc[data-card-id]');
  if (!mc || !state.game) return;
  const id = mc.getAttribute('data-card-id');
  const c = (state.game.market || []).find(x => x && x.id === id);
  if (c) showTeamSidebar(c);
}
function _marketSidebarPointerOut(ev) {
  const mc = ev.target.closest('.mc[data-card-id]');
  if (!mc) return;
  const to = ev.relatedTarget;
  const body = document.getElementById('market-popup-body');
  if (to && body && body.contains(to)) {
    const toMc = to.closest && to.closest('.mc[data-card-id]');
    if (toMc) return;
  }
  showTeamSidebar(null);
}
function teardownMarketSidebarHover() {
  if (!_marketSidebarHoverEl) return;
  _marketSidebarHoverEl.removeEventListener('pointerover', _marketSidebarPointerOver, true);
  _marketSidebarHoverEl.removeEventListener('pointerout', _marketSidebarPointerOut, true);
  _marketSidebarHoverEl = null;
}
function wireMarketSidebarHover() {
  teardownMarketSidebarHover();
  const body = document.getElementById('market-popup-body');
  if (!body) return;
  _marketSidebarHoverEl = body;
  body.addEventListener('pointerover', _marketSidebarPointerOver, true);
  body.addEventListener('pointerout', _marketSidebarPointerOut, true);
}

function openGamePopup(id, title, bodyHtml) {
  state.selectedBenchCard = null; // cancel any pending swap when a popup opens
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

// ============================================================
// 5. CARD & DECK MANAGEMENT
//    Positions, team strength, deck draw, slot helpers
// ============================================================
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

// dicePanel_roll: fires the currently active waiter
// `force=true` lets non-dice buttons trigger even if dice button is disabled.
function dicePanel_roll(force, preferredWaiter) {
  const now = Date.now();
  if (now - _lastAdvanceClickAt < 140) return; // anti-spam guard
  _lastAdvanceClickAt = now;
  _lastAdvanceSource = force ? 'action-btn' : 'dice-btn';
  const btn = document.getElementById('dice-panel-btn');
  if (!force && btn && btn.disabled) return;
  // Prefer explicit intent from the clicked action button.
  if (preferredWaiter && _waiters[preferredWaiter]) { fire(preferredWaiter); return; }
  // Then prefer what the flow expects next.
  if (_expectedAdvance && _waiters[_expectedAdvance]) { fire(_expectedAdvance); return; }
  // Fallback: first active waiter wins.
  if (_waiters['serveOnce']) { fire('serveOnce'); return; }
  if (_waiters['continueAfterMatch']) { fire('continueAfterMatch'); return; }
  if (_waiters['coneContinue']) { fire('coneContinue'); return; }
  if (_waiters['coneRollNow']) { fire('coneRollNow'); return; }
  if (_waiters['endMarket']) { fire('endMarket'); return; }
  // No active waiter yet (e.g. short animation/event gap):
  // queue exactly ONE action — never fire two names; that leaves stale pendings
  // (e.g. coneRollNow) and the next bot turn can resolve waitFor('coneRollNow') instantly → chaos.
  fire(_expectedAdvance || 'coneRollNow');
  refreshDebugHud();
}


// ────────────────────────────────────────────────────────────────
//  CONFETTI animation (UI helper — defined here for scope reasons)
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

// ============================================================
// 11. SPLASH / DRAFT / OPENING
//     Boot, intro, menu, draft, auction, starting roll
// ============================================================
function boot() {
  state.speed = 'normal';
  localStorage.setItem('vv_speed', 'normal');
  // ALL_CARDS is built once when a game starts (initSoloGame), not here — avoids two masters.
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
function createRoom() {
  if (MULTIPLAYER || (window.VV_MP && typeof window.VV_MP.createRoom === 'function')) {
    return window.VV_MP.createRoom();
  }
  toast(T('mp_unavailable'), 'bad', 4000);
}
function showJoinForm() {
  if (MULTIPLAYER || (window.VV_MP && typeof window.VV_MP.showJoinForm === 'function')) {
    return window.VV_MP.showJoinForm();
  }
  // multiplayer.js installs its showJoinForm onto window.VV directly,
  // but if loaded late we still fall back to the toast.
  if (window.VV && window.VV.showJoinForm && window.VV.showJoinForm !== showJoinForm) {
    return window.VV.showJoinForm();
  }
  toast(T('mp_unavailable'), 'bad', 4000);
}

// ── Multiplayer hand-off (called by multiplayer.js when host starts game) ──
function startMultiplayer(opts) {
  if (!opts || !Array.isArray(opts.players)) return;
  MULTIPLAYER = true;
  state.mode = 'mp';
  state.mpRoom = {
    roomCode:      opts.roomCode,
    hostId:        opts.hostId,
    localPlayerId: opts.localPlayerId,
    players:       opts.players.slice(),
  };
  const isHost = (opts.hostId === opts.localPlayerId);
  state.mpRoom.isHost = isHost;

  if (isHost) {
    // Host runs the engine locally. Build a 4-seat roster from the lobby
    // and kick off the existing draft → auction → season pipeline.
    initMultiplayerGame(opts);
    setView('draft');
    try { mpHostRegisterDraftInputListeners(); } catch (_) {}
    try { mpHostStartParallelDraft(); } catch (_) {}
    if (state.mpSyncTimer) clearInterval(state.mpSyncTimer);
    state.mpSyncTimer = setInterval(() => {
      try { if (window.VV_MP && window.VV_MP.forceGameStateSync) window.VV_MP.forceGameStateSync(); }
      catch (_) {}
    }, 10000);
    try { if (window.VV_MP && window.VV_MP.forceGameStateSync) window.VV_MP.forceGameStateSync(); } catch (_) {}
    toast(state.lang === 'de' ? 'Spiel gestartet — du bist Host.' : 'Game started — you are host.', 'good', 2200);
  } else {
    // Non-host: show the connecting screen and wait for the host's first
    // gameState snapshot. They are NOT a passive spectator — they will
    // play their own seat via seat-prompt overlays once the auction
    // phase starts. applyRemoteState() decides when to flip to the
    // live board.
    state.game = null;
    setView('mp_viewer');
    try {
      if (window.VV_MP && typeof window.VV_MP.paintViewerWaiting === 'function') {
        window.VV_MP.paintViewerWaiting();
      }
    } catch (_) {}
    toast(state.lang === 'de'
      ? 'Verbinde mit Spiel — du spielst auf deinem Gerät.'
      : 'Connecting to the game — you play on your own device.', 'good', 3200);
  }
}

/** Spielerobjekt für den lokalen Sitz (mpId === localPlayerId). */
function mpLocalGamePlayer() {
  if (!MULTIPLAYER || !state.mpRoom || !state.game || !Array.isArray(state.game.players)) return null;
  const id = state.mpRoom.localPlayerId;
  return state.game.players.find(p => p && p.mpId === id) || null;
}

/** Sichtbare UI-Phase aus dem Host-Snapshot, falls _mpUiView fehlt (ältere Saves). */
function inferMpUiViewFromGame(g) {
  if (!g) return 'menu';
  if (g.phase === 'lobby') return 'mp_lobby';
  if (g.over && g.winner) return 'end';
  if (g.phase === 'season') return 'game';
  if (g.phase === 'auction') return 'auction';
  if (g.phase === 'draft') return 'draft';
  return 'game';
}

function applyRemoteState(remote) {
  if (!MULTIPLAYER) return;
  if (!remote) return;
  if (remote.phase === 'lobby') return;
  try {
    const targetView = remote._mpUiView || inferMpUiViewFromGame(remote);
    const prevView = state.view;
    state.game = remote;
    if (prevView !== targetView || prevView === 'mp_viewer') {
      setView(targetView);
    } else {
      render();
    }
  } catch (e) {
    console.warn('[VV] applyRemoteState failed:', e);
  }
}

/** Stops host→Firebase sync interval and clears local MP flags (lobby leave, menu, play-again). */
function resetLocalMultiplayerSession() {
  try { mpHostUnregisterDraftInputListeners(); } catch (_) {}
  try {
    if (window.VV_MP && typeof window.VV_MP.resetSyncScheduler === 'function') window.VV_MP.resetSyncScheduler();
  } catch (_) {}
  if (state.mpSyncTimer) {
    clearInterval(state.mpSyncTimer);
    state.mpSyncTimer = null;
  }
  if (MULTIPLAYER || state.mode === 'mp' || state.mpRoom) {
    MULTIPLAYER = false;
    state.mode = 'solo';
    state.mpRoom = null;
  }
}

function mpIsMultiplayerHost() {
  return !!(MULTIPLAYER && state.mpRoom && state.mpRoom.isHost && state.mpRoom.localPlayerId);
}
/** Schedule a state push to Firebase if we are the multiplayer host. No-op for solo. */
function mpSyncIfHost() {
  if (!mpIsMultiplayerHost()) return;
  try {
    if (window.VV_MP && typeof window.VV_MP.scheduleGameStateSync === 'function') {
      window.VV_MP.scheduleGameStateSync();
    }
  } catch (_) {}
}

/** Ab Auktion/Saison: `turns/currentTurn` für MP-Clients (Draft: nie). */
async function mpHostPublishSequentialTurn(player, phaseKey) {
  if (!MULTIPLAYER || !mpIsMultiplayerHost() || !player || !player.mpId) return;
  const mp = window.VV_MP;
  if (!mp || typeof mp.setCurrentTurn !== 'function') return;
  try {
    await mp.setCurrentTurn(player.mpId, phaseKey, null);
  } catch (_) {}
}

let _mpDraftInputUnsubs = [];

function mpHostUnregisterDraftInputListeners() {
  for (const u of _mpDraftInputUnsubs) {
    try { if (typeof u === 'function') u(); } catch (_) {}
  }
  _mpDraftInputUnsubs = [];
}

function mpHostRegisterDraftInputListeners() {
  mpHostUnregisterDraftInputListeners();
  if (!mpIsMultiplayerHost() || !state.game || !state.game.players) return;
  const mp = window.VV_MP;
  if (!mp || typeof mp.listenForInput !== 'function') return;
  for (const p of state.game.players) {
    if (!p || p.mpIsBot || !p.mpId) continue;
    const id = p.mpId;
    const unsub = mp.listenForInput(id, (payload) => {
      try { mpHostOnDraftInput(id, payload); } catch (e) { console.warn('[VV] mpHostOnDraftInput', e); }
    }, { registerInSession: false });
    _mpDraftInputUnsubs.push(unsub);
  }
}

function mpHostOnDraftInput(mpId, payload) {
  if (!mpIsMultiplayerHost() || !state.game || state.game.phase !== 'draft') return;
  if (!payload || !payload.action) return;
  const idx = state.game.players.findIndex(p => p && p.mpId === mpId);
  if (idx < 0) return;
  const subject = state.game.players[idx];
  if (subject.mpIsBot) return;
  const done = computeDraftStage(subject) === 'done';
  if (done && (payload.action === 'draftDraw' || payload.action === 'draftPick1')) return;

  if (payload.action === 'draftDraw') {
    const stars = parseInt(payload.stars, 10);
    const need = mpDraftExpectedStarsForStage(subject);
    if (stars !== need) return;
    const c = deckPoolForStars(stars);
    if (!c) return;
    placeIntoTeamOrBench(subject, c);
    beep(740, 60);
  } else if (payload.action === 'draftRedraw') {
    mpDraftClearPlayerRosterReturn234ToPool(subject);
    beep(520, 40);
    mpAfterHostDraftMutation();
    return;
  } else if (payload.action === 'draftPersonalReset') {
    const allCards = [...Object.values(subject.team).filter(Boolean), ...(subject.bench || [])];
    if (!draftOverloadedPositions(allCards).length) return;
    mpDraftClearPlayerRosterReturn234ToPool(subject);
    beep(520, 40);
    mpAfterHostDraftMutation();
    return;
  } else if (payload.action === 'draftPick1') {
    const pos = payload.pos;
    if (!pos || !POSITIONS.includes(pos)) return;
    const counts = countByStars([...subject.bench, ...Object.values(subject.team).filter(Boolean)]);
    if (counts[1] >= 3) return;
    const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
    const c = pickUnowned1Star(poolPos);
    if (!c) return;
    if (!subject.team[pos]) subject.team[pos] = c;
    else placeIntoTeamOrBench(subject, c);
    beep(640, 60);
  } else {
    return;
  }

  mpAfterHostDraftMutation();
}

/** Nach lokaler oder Remote-Draft-Aktion: ggf. Auktion, sonst UI + Sync. */
function mpAfterHostDraftMutation() {
  if (!MULTIPLAYER || !mpIsMultiplayerHost()) return;
  mpMaybeFinishDraftToAuction();
  if (state.game && state.game.phase === 'draft') {
    renderDraft();
    refreshDraftRestartButton();
  }
  mpSyncIfHost();
  try { if (window.VV_MP && typeof window.VV_MP.forceGameStateSync === 'function') void window.VV_MP.forceGameStateSync(); } catch (_) {}
}

/** Sobald alle Sitzplätze den Draft abgeschlossen haben → Eröffnungsauktion. */
function mpMaybeFinishDraftToAuction() {
  if (!MULTIPLAYER || !mpIsMultiplayerHost() || !state.game || state.game.phase !== 'draft') return;
  if (state.game.players.every(p => computeDraftStage(p) === 'done')) {
    mpTransitionDraftToAuction();
  }
}

/**
 * Paralleler Draft ab Lobby-Start: kein Firebase-Zug (`turns/`), jeder Mensch zieht für sich.
 * Runden-/Zuglogik (Bieter-Reihenfolge, Saison) beginnt erst mit der **Eröffnungsauktion**.
 */
function mpHostStartParallelDraft() {
  if (!mpIsMultiplayerHost() || !state.game || state.game.phase !== 'draft') return;
  try {
    if (window.VV_MP && typeof window.VV_MP.clearRoomTurnState === 'function') {
      void window.VV_MP.clearRoomTurnState();
    }
  } catch (_) {}
  for (const p of state.game.players) {
    if (p.mpIsBot) autoDraftBot(p);
  }
  mpMaybeFinishDraftToAuction();
  if (state.game && state.game.phase === 'draft') {
    renderDraft();
    refreshDraftRestartButton();
    mpSyncIfHost();
    try { if (window.VV_MP && typeof window.VV_MP.forceGameStateSync === 'function') void window.VV_MP.forceGameStateSync(); } catch (_) {}
  }
}

function mpDraftExpectedStarsForStage(p) {
  const st = computeDraftStage(p);
  if (st === 'draw_4') return 4;
  if (st === 'draw_3') return 3;
  if (st === 'draw_2') return 2;
  return null;
}

function mpTransitionDraftToAuction() {
  try { mpHostUnregisterDraftInputListeners(); } catch (_) {}
  try {
    if (window.VV_MP && typeof window.VV_MP.clearRoomTurnState === 'function') {
      void window.VV_MP.clearRoomTurnState();
    }
  } catch (_) {}
  const g = state.game;
  if (!g) return;
  for (const p of g.players) ensureFiveStarter(p);
  for (const p of g.players) autoSelectLineup(p);
  rebuildAuctionDeckAfterDraft();
  assertNoDuplicates();
  g.phase = 'auction';
  setView('auction');
  mpSyncIfHost();
}

function mpDraftGetSubjectForHostAction() {
  if (!state.game || !state.game.players || !state.game.players[0]) return null;
  if (!MULTIPLAYER || !state.mpRoom) return state.game.players[0];
  return mpLocalGamePlayer() || state.game.players[0];
}

function mpDraftClientSubmit(payload) {
  const mp = window.VV_MP;
  if (!mp || typeof mp.submitInput !== 'function') return;
  const g = state.game;
  if (!g || g.phase !== 'draft') return;
  const me = mpLocalGamePlayer();
  if (!me || me.mpIsBot) {
    toast(state.lang === 'de' ? 'Kein gültiger Spieler-Sitz.' : 'No valid player seat.', 'bad', 1800);
    return;
  }
  void mp.submitInput(payload);
}

/** True on host for a lobby human seat that is controlled from another device (Firebase seatPrompt). */
function mpSeatIsRemoteHumanOnHost(player) {
  if (!mpIsMultiplayerHost() || !player || player.mpIsBot) return false;
  if (!player.mpId) return false;
  return player.mpId !== state.mpRoom.localPlayerId;
}

async function humanBidPromptRemote(p, card, minNext) {
  const mp = window.VV_MP;
  if (!mp || typeof mp.waitForSeatInput !== 'function') return { pass: true };
  try {
    const cardLite = { id: card.id, name: card.name, url: card.url, stars: card.stars, pos: card.pos };
    const pr = { type: 'openingAuction', mpId: p.mpId, minNext, maxMoney: p.money, card: cardLite };
    const pWait = mp.waitForSeatInput(p.mpId, 120000, 'openingAuction');
    await mp.publishSeatPrompt(pr);
    const payload = await pWait;
    if (!payload || payload.type !== 'openingAuction') return { pass: true };
    if (payload.pass) return { pass: true };
    const bid = parseInt(payload.bid, 10);
    if (!Number.isFinite(bid)) return { pass: true };
    return { bid };
  } finally {
    try { await mp.clearSeatPrompt(); } catch (_) {}
  }
}

async function humanLiveAuctionBidRemote(p, card, minNext) {
  const mp = window.VV_MP;
  if (!mp || typeof mp.waitForSeatInput !== 'function') return { pass: true };
  try {
    const cardLite = { id: card.id, name: card.name, url: card.url, stars: card.stars, pos: card.pos };
    const pr = { type: 'liveAuction', mpId: p.mpId, minNext, maxMoney: p.money, card: cardLite };
    const pWait = mp.waitForSeatInput(p.mpId, 120000, 'liveAuction');
    await mp.publishSeatPrompt(pr);
    const payload = await pWait;
    if (!payload || payload.type !== 'liveAuction') return { pass: true };
    if (payload.pass) return { pass: true };
    const bid = parseInt(payload.bid, 10);
    if (!Number.isFinite(bid)) return { pass: true };
    return { bid };
  } finally {
    try { await mp.clearSeatPrompt(); } catch (_) {}
  }
}

async function mpWaitConeRemote(player, phase) {
  const mp = window.VV_MP;
  if (!mp || typeof mp.waitForSeatInput !== 'function') return;
  try {
    const pWait = mp.waitForSeatInput(player.mpId, 120000, phase);
    await mp.publishSeatPrompt({ type: phase, mpId: player.mpId });
    await pWait;
  } finally {
    try { await mp.clearSeatPrompt(); } catch (_) {}
  }
}

// Build a 4-player roster from the lobby data and seed state.game with the
// same shape solo uses. Local player goes to slot 0 so existing UI code
// that reads `g.players[0]` keeps working.
function initMultiplayerGame(opts) {
  ALL_CARDS = buildGameCardPool();
  try { if (typeof window !== 'undefined') window.VV_CARDS_DB = ALL_CARDS; } catch (_) {}

  const seats = (opts.players || []).slice()
    .sort((a, b) => (a.slotIndex || 0) - (b.slotIndex || 0));
  const localId = opts.localPlayerId;
  const localSeat = seats.find(s => s && s.id === localId);
  const otherSeats = seats.filter(s => s && s.id !== localId);
  const ordered = [localSeat, ...otherSeats].filter(Boolean);

  const personas = (window.VV_BOTS && window.VV_BOTS.pickPersonas)
    ? window.VV_BOTS.pickPersonas(4)
    : [{color:'#facc15',emoji:'🟡',personality:'balanced',biasPos:'outside'}];
  while (personas.length < ordered.length) personas.push(personas[0]);

  const players = ordered.map((s, i) => {
    const persona = personas[i] || personas[0];
    const isLocal = (s.id === localId);
    // Only the local player uses host-side popups; other humans keep isHuman false
    // on the host but are handled via mpSeatIsRemoteHumanOnHost + seatPrompt / inputs.
    const isHuman = isLocal;
    const name = s.name || ('P' + (i + 1));
    const p = makePlayer(name, persona.color, persona.emoji, isHuman, persona.personality, persona.biasPos);
    p.mpId = s.id;
    p.mpIsBot = !!s.isBot;
    p.mpSlotIndex = typeof s.slotIndex === 'number' ? s.slotIndex : i;
    return p;
  });

  state.game = {
    players,
    activeIdx: 0,
    week: 0,
    phase: 'draft',
    log: [],
    market: [],
    marketPile: [],
    auctionDeck: [],
    _draftDeck: [],
    coneDay: 1,
    over: false, winner: null,
    leagueMatchesPlayed: 0,
    season: 1,
  };
  state.game._draftDeck = ALL_CARDS
    .filter(c => c.stars >= 2 && c.stars <= 4)
    .slice()
    .sort(() => Math.random() - 0.5);
  state.game.auctionDeck = [];
}


// ────────────────────────────────────────────────────────────────
//  11b. GAME INIT
// ────────────────────────────────────────────────────────────────
function makePlayer(name, color, emoji, isHuman, personality, biasPos) {
  return {
    id: uid(), name, color, emoji, isHuman: !!isHuman, personality: personality || 'balanced', biasPos: biasPos || 'outside',
    money: STARTING_GOLD, vp: 0,
    team: { outside:null, outside2:null, middle:null, middle2:null, setter:null, diagonal:null, libero:null },
    bench: [],
    suspended: [], // [{ card, pos, reason }] — players sidelined by Red Card / Injury / VNL until next league match
    matchesWon: 0, totalEarned: 0,
    leaguePoints: 0,
    flag: choice(['IT','BR','PL','FR','USA','RU','JP','SLO']),
    starterIdx: 0,  // who the starting player is (set after starting roll)
    courtRotation: 0, // 0..5 — volleyball rotation on court (synced with match mini + team panel)
  };
}

function initSoloGame() {
  ALL_CARDS = buildGameCardPool();
  try {
    if (typeof window !== 'undefined') window.VV_CARDS_DB = ALL_CARDS;
  } catch (_) {}
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
    auctionDeck: [],   // filled after draft — all unowned 2–5★ (same object refs as ALL_CARDS)
    _draftDeck: [],    // draft only: 2–4★ unowned during blind draft (never overlap auctionDeck)
    coneDay: 1,        // black cone position on the timeline (day 1 → 50)
    over: false, winner: null,
    leagueMatchesPlayed: 0,
    season: 1,
  };
  // Draft draws only from _draftDeck; auction deck is built in rebuildAuctionDeckAfterDraft()
  state.game._draftDeck = ALL_CARDS
    .filter(c => c.stars >= 2 && c.stars <= 4)
    .slice()
    .sort(() => Math.random() - 0.5);
  state.game.auctionDeck = [];
}

// ────────────────────────────────────────────────────────────────
//  11c. BLIND DRAFT (Setup Step 2 from rulebook)
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
  const panelP = MULTIPLAYER ? (mpLocalGamePlayer() || state.game.players[0]) : state.game.players[0];
  tp.innerHTML = setupTeamPanelHtml(panelP);
}

function renderDraft() {
  const app = $('#app');
  const g = state.game;
  if (!g || !g.players || !g.players[0]) return;
  const mySeat = MULTIPLAYER ? (mpLocalGamePlayer() || g.players[0]) : g.players[0];
  const draftSubject = MULTIPLAYER ? mySeat : g.players[0];
  const stage = computeDraftStage(draftSubject);
  const de = state.lang === 'de';
  const mpDone = MULTIPLAYER && mySeat && computeDraftStage(mySeat) === 'done';
  const mpCanAct = MULTIPLAYER && mySeat && !mySeat.mpIsBot && !mpDone;
  const mpBanner = MULTIPLAYER
    ? `<div class="mp-sync-banner" style="margin-bottom:1rem;padding:0.75rem 1rem;border-radius:8px;background:rgba(250,204,21,0.12);border:1px solid rgba(250,204,21,0.35);font-size:0.95rem;">
        ${mpDone
          ? (de ? '<strong>Fertig.</strong> Warte, bis alle Spieler ihren Draft beendet haben — dann startet der Host die Auktion.' : '<strong>Done.</strong> Wait until every player has finished drafting — then the host opens the auction.')
          : (de
            ? '<strong>Parallel-Draft</strong> — sobald der Host das Spiel startet, baut jeder gleichzeitig sein Team. Bots werden sofort vom Host ausgefüllt.'
            : '<strong>Parallel draft</strong> — after the host starts, everyone drafts at once. Bots are filled by the host immediately.')}
      </div>`
    : '';
  const actionsDim = MULTIPLAYER && !mpCanAct && !mpDone;
  const actionsWrapClass = 'draft-actions' + (actionsDim ? ' mp-readonly-actions' : '');
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
        ${mpBanner}
        <div class="draft-progress">${draftProgressHtml(draftSubject)}</div>
        <div class="${actionsWrapClass}" id="draft-actions" style="margin-top:1.4rem;${actionsDim ? 'pointer-events:none;opacity:0.55;' : ''}">${draftActionsHtml(stage, draftSubject)}</div>
        <div style="margin-top:2rem;">
          <h3 class="h-cond" style="font-size:1.1rem; margin-bottom:0.6rem;">${T('your')} · ${escapeHTML(draftSubject.name)} · ${fmtMoney(draftSubject.money)}</h3>
          <div class="draft-cards" id="draft-cards">${draftHandHtml(draftSubject)}</div>
        </div>
      </div>
      <div class="setup-team-panel" id="setup-team-panel">${setupTeamPanelHtml(mySeat)}</div>
    </div>`;
  refreshDraftRestartButton();
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
  if (MULTIPLAYER && computeDraftStage(p) === 'done') {
    const de = state.lang === 'de';
    return `<p style="color:var(--silver);margin:0;">${de ? 'Dein Draft ist fertig. Warte auf die anderen …' : 'Your draft is complete. Waiting for others …'}</p>`;
  }
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
  if (MULTIPLAYER) {
    const de = state.lang === 'de';
    return `<p style="color:var(--silver);margin:0;">${de ? 'Warte auf andere Spieler …' : 'Waiting for other players …'}</p>`;
  }
  return `<button class="btn btn-primary btn-large" onclick="VV.draftFinish()">${T('draft_continue')}</button>`;
}

function draftHandHtml(p) {
  const all = [...Object.values(p.team).filter(Boolean), ...p.bench];
  if (!all.length) return `<div style="color:var(--silver); font-style:italic;">—</div>`;
  return all.map(c => `
    <div class="draft-card" data-tip="${escapeHTML(c.name)}·${c.stars}★">
      <span class="pos-tag" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <img src="${c.url}" alt="" loading="lazy">
      <div class="draft-stars">${'★'.repeat(c.stars)}</div>
    </div>`).join('');
}

function deckPoolForStars(stars) {
  const g = state.game;
  if (!Array.isArray(g._draftDeck) || g._draftDeck.length === 0) {
    const owned = ownedCardIds();
    g._draftDeck = ALL_CARDS.filter(c => c.stars >= 2 && c.stars <= 4 && !owned.has(c.id))
      .slice()
      .sort(() => Math.random() - 0.5);
  }
  const idx = g._draftDeck.findIndex(c => c.stars === stars);
  if (idx < 0) return null;
  return g._draftDeck.splice(idx, 1)[0];
}

// Maps primary positions to their secondary slot (two-OH / two-MB rule)
const POS_SECONDARY = { outside: 'outside2', middle: 'middle2' };

function placeIntoTeamOrBench(p, card) {
  removeCardFromPools(card);
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

// ─── Draft position-overload helpers ─────────────────────────────────────────

/** Returns array of overloaded position keys (those with >2 cards). Empty = no overload. */
function draftOverloadedPositions(cards) {
  const counts = {};
  for (const card of cards) counts[card.pos] = (counts[card.pos] || 0) + 1;
  return Object.entries(counts).filter(([, n]) => n > 2).map(([pos]) => pos);
}

/** Nur diesen Spieler: 2–4★ zurück in den Draft-Pool, Team+Bank leeren (persönlicher Redraw / Neustart). */
function mpDraftClearPlayerRosterReturn234ToPool(p) {
  const g = state.game;
  if (!g || !p) return;
  if (!Array.isArray(g._draftDeck)) g._draftDeck = [];
  const all = [...Object.values(p.team).filter(Boolean), ...(p.bench || [])];
  for (const c of all) {
    if (c && c.stars >= 2 && c.stars <= 4) g._draftDeck.push(c);
  }
  g._draftDeck.sort(() => Math.random() - 0.5);
  p.team = { outside: null, outside2: null, middle: null, middle2: null, setter: null, diagonal: null, libero: null };
  p.bench = [];
}

/** Spieler mit Positions-Overload (>3 gleiche Pos.): Solo = Mensch; MP = eigener Sitz. */
function mpDraftPlayerForPersonalOverloadReset() {
  const g = state.game;
  if (!g || !g.players) return null;
  const p = MULTIPLAYER ? mpLocalGamePlayer() : g.players[0];
  if (!p) return null;
  const allCards = [...Object.values(p.team).filter(Boolean), ...(p.bench || [])];
  if (!draftOverloadedPositions(allCards).length) return null;
  return p;
}

function removeDraftRestartButton() {
  try {
    const el = document.getElementById('draft-restart-btn');
    if (el) el.remove();
  } catch (_) {}
}

/**
 * Unaufdringlicher Neustart-Button (fix unten), nur im Draft wenn >2 Karten gleicher Position.
 * Blockiert keine Auktion — nur Anzeige/Entfernen per Zustand.
 */
function refreshDraftRestartButton() {
  try {
    if (state.view !== 'draft' || !state.game) {
      removeDraftRestartButton();
      return;
    }
    const me = mpDraftPlayerForPersonalOverloadReset();
    if (!me) {
      removeDraftRestartButton();
      return;
    }
    if (MULTIPLAYER && state.mpRoom) {
      const localId = state.mpRoom.localPlayerId;
      if (!localId || me.mpId !== localId) {
        removeDraftRestartButton();
        return;
      }
    }
    const de = state.lang === 'de';
    let btn = document.getElementById('draft-restart-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'draft-restart-btn';
      btn.type = 'button';
      btn.className = 'draft-restart-btn';
      btn.addEventListener('click', () => {
        try {
          draftResetAll();
          renderDraft();
        } catch (err) {
          console.error('[VV] draft restart button crashed:', err);
        }
      });
      document.body.appendChild(btn);
    }
    btn.textContent = de ? '🔄 Draft neu starten' : '🔄 Restart draft';
  } catch (err) {
    console.error('[VV] refreshDraftRestartButton crashed:', err);
  }
}

/** Solo: kompletter Draft-Reset aller Plätze. Multiplayer: nur eigener Sitz bei Positions-Overload. */
function draftResetAll() {
  if (MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost) {
    mpDraftClientSubmit({ action: 'draftPersonalReset' });
    return;
  }
  try {
    const g = state.game;
    if (!g._draftDeck) g._draftDeck = [];
    if (MULTIPLAYER) {
      const p = mpDraftPlayerForPersonalOverloadReset();
      if (!p) return;
      mpDraftClearPlayerRosterReturn234ToPool(p);
      assertNoDuplicates();
      if (mpIsMultiplayerHost()) {
        mpAfterHostDraftMutation();
      }
      return;
    }
    for (const p of g.players) {
      for (const c of [...Object.values(p.team).filter(Boolean), ...(p.bench || [])]) {
        if (c.stars >= 2 && c.stars <= 4) g._draftDeck.push(c);
      }
      p.team  = { outside: null, outside2: null, middle: null, middle2: null, setter: null, diagonal: null, libero: null };
      p.bench = [];
    }
    g._draftDeck.sort(() => Math.random() - 0.5);
    assertNoDuplicates();
  } catch (err) {
    console.error('[VV] draftResetAll crashed:', err);
  }
}

function draftDraw(stars) {
  if (MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost) {
    mpDraftClientSubmit({ action: 'draftDraw', stars });
    return;
  }
  const g = state.game;
  const subject = MULTIPLAYER ? mpDraftGetSubjectForHostAction() : g.players[0];
  if (MULTIPLAYER && !subject) return;
  if (MULTIPLAYER && computeDraftStage(subject) === 'done') return;
  const need = mpDraftExpectedStarsForStage(subject);
  if (need == null || stars !== need) {
    toast(state.lang === 'de' ? 'Ungültige Sternzahl für diese Draft-Stufe.' : 'Invalid star count for this draft step.', 'bad');
    return;
  }
  const c = deckPoolForStars(stars);
  if (!c) { toast(T('draft_deck_empty'), 'bad'); return; }
  placeIntoTeamOrBench(subject, c);
  beep(740, 60);
  toast(`+ ${c.name} (${c.stars}★)`, 'good', 1200);
  if (MULTIPLAYER && mpIsMultiplayerHost()) {
    mpAfterHostDraftMutation();
    return;
  }
  renderDraft();
  refreshDraftRestartButton();
  mpSyncIfHost();
}

function draftRedraw() {
  if (MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost) {
    mpDraftClientSubmit({ action: 'draftRedraw' });
    return;
  }
  const g = state.game;
  const me = MULTIPLAYER ? mpDraftGetSubjectForHostAction() : g.players[0];
  if (MULTIPLAYER && !me) return;
  if (MULTIPLAYER && computeDraftStage(me) === 'done') return;
  mpDraftClearPlayerRosterReturn234ToPool(me);
  if (MULTIPLAYER && mpIsMultiplayerHost()) {
    mpAfterHostDraftMutation();
    return;
  }
  renderDraft();
  refreshDraftRestartButton();
  mpSyncIfHost();
}

function draftPick1(pos) {
  if (MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost) {
    mpDraftClientSubmit({ action: 'draftPick1', pos });
    return;
  }
  const g = state.game;
  const me = MULTIPLAYER ? mpDraftGetSubjectForHostAction() : g.players[0];
  if (MULTIPLAYER && !me) return;
  if (MULTIPLAYER && computeDraftStage(me) === 'done') return;
  const counts = countByStars([...me.bench, ...Object.values(me.team).filter(Boolean)]);
  if (counts[1] >= 3) { toast(T('draft_pick_limit'), 'bad'); return; }
  // outside2/middle2 share the same card pool as outside/middle
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
  const c = pickUnowned1Star(poolPos);
  if (!c) { toast(T('no_card_for_pos')||'No card', 'bad'); return; }
  // Force placement into the correct target slot
  if (!me.team[pos]) {
    me.team[pos] = c;
  } else {
    placeIntoTeamOrBench(me, c);
  }
  beep(640, 60);
  if (MULTIPLAYER && mpIsMultiplayerHost()) {
    mpAfterHostDraftMutation();
    return;
  }
  renderDraft();
  refreshDraftRestartButton();
  mpSyncIfHost();
}

function draftFinish() {
  if (MULTIPLAYER) return;
  // Now do bot drafts (auto)
  const g = state.game;
  for (let i = 1; i < g.players.length; i++) {
    const bot = g.players[i];
    autoDraftBot(bot);
  }
  // Check that the human has all 5 positions filled (otherwise bench cards fill in)
  ensureFiveStarter(g.players[0]);
  // Optimize lineup for all players after draft
  for (const p of g.players) autoSelectLineup(p);
  rebuildAuctionDeckAfterDraft();
  assertNoDuplicates();
  state.game.phase = 'auction';
  setView('auction');
  mpSyncIfHost();
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
    const c = pickUnowned1Star(poolPos);
    if (c) {
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
      const c = pickUnowned1Star(poolPos);
      if (c) p.team[pos] = c;
    }
  }
}


// ────────────────────────────────────────────────────────────────
//  11d. OPENING AUCTION (Setup Step 3)
// ────────────────────────────────────────────────────────────────
async function renderAuction() {
  removeDraftRestartButton();
  const app = $('#app');
  const g = state.game;
  const panelP = MULTIPLAYER ? (mpLocalGamePlayer() || g.players[0]) : g.players[0];
  const isMpClient = MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost;
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
      <div class="setup-team-panel" id="setup-team-panel">${setupTeamPanelHtml(panelP)}</div>
    </div>`;
  if (isMpClient) {
    const stage = $('#auction-stage');
    const de = state.lang === 'de';
    if (stage) {
      stage.innerHTML = `<div class="event-card" style="max-width:560px;margin:0 auto;">
        <div class="event-h">${de ? 'Eröffnungsauktion' : 'Opening auction'}</div>
        <div class="event-p">${de
          ? 'Der Host führt die Runde aus. Wenn du dran bist, erscheint dein Gebot als Popover — dieselbe Datenbasis wie beim Host.'
          : 'The host runs this round. When it is your turn, your bid appears as an overlay — same state as the host.'}</div>
      </div>`;
    }
    hideTeamSidebar();
    return;
  }
  await runOpeningAuction();
  setView('starting');
}

async function runOpeningAuction() {
  const g = state.game;
  hideTeamSidebar();
  let cards = g.auctionDeck.splice(0, 6)
    .filter(c => c && Number.isFinite(Number(c.stars)));
  // Safety net: if the deck got short/corrupt, rebuild enough auction cards so setup never soft-locks.
  if (cards.length < 6) {
    const missing = 6 - cards.length;
    const owned = ownedCardIds();
    const inOpening = new Set(cards.map(c => c && c.id).filter(Boolean));
    const refill = ALL_CARDS
      .filter(c => c && Number(c.stars) >= 2 && !owned.has(c.id) && !inOpening.has(c.id))
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, missing);
    cards = cards.concat(refill);
  }
  const stage = $('#auction-stage');
  if (!cards.length) {
    if (stage) {
      stage.innerHTML = `<div class="event-card"><div class="event-h">${state.lang==='de'?'Auktion konnte nicht gestartet werden':'Auction could not start'}</div><div class="event-p">${state.lang==='de'?'Es wurden keine gültigen Auktionskarten gefunden. Starte bitte ein neues Spiel.':'No valid auction cards found. Please start a new game.'}</div></div>`;
    }
    hideTeamSidebar();
    return;
  }
  for (let i = 0; i < cards.length; i++) {
    await runAuctionForCard(cards[i], i+1, cards.length);
    refreshTopbar();
    await sleep(speedMs(400));
  }
  assertNoDuplicates();
}

async function runAuctionForCard(card, idx, total) {
  if (!card || !Number.isFinite(Number(card.stars))) return;
  try {
  const stage = $('#auction-stage');
  const cardStars = Math.max(1, Math.floor(Number(card.stars) || 1));
  const minBid = cardStars * PRICE_PER_STAR;
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
            <div class="ac-stars">${'★'.repeat(cardStars)} <span style="color:var(--silver)">${escapeHTML(card.name)}</span></div>
            <div class="ac-bid">
              <div>${T('auction_currentbid')}: <b style="color:var(--gold)">${currentBid?fmtMoney(currentBid):'—'}</b>${currentHigh?` <span style="color:var(--silver)">(${escapeHTML(currentHigh.name)})</span>`:''}</div>
            </div>
          </div>
        </div>
        <div id="auction-input"></div>
        <div id="auction-feed" class="auction-feed"></div>
      </div>`;
    showTeamSidebar(card);
  }
  paint();

  // Loop rounds
  while (true) {
    let bidThisRound = false;
    for (const p of order) {
      if (passes.has(p.id)) continue;
      if (p.id === lastBidder) continue; // don't bid against yourself when you're already high
      paint();
      await mpHostPublishSequentialTurn(p, 'openingAuction');
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
      } else if (mpSeatIsRemoteHumanOnHost(p)) {
        const result = await humanBidPromptRemote(p, card, minNext);
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
  showTeamSidebar(card);
  // Setup/auction view uses a flat playerCardHtml list in #topbar; refreshTopbar() targets
  // .topbar-bots/.you-card which only exist in the game view. Re-render directly here.
  const auctionTopbar = $('#topbar');
  if (auctionTopbar && !auctionTopbar.querySelector('.topbar-bots')) {
    auctionTopbar.innerHTML = state.game.players.map((p, i) => playerCardHtml(p, i, false)).join('');
  } else {
    refreshTopbar();
  }
  await sleep(speedMs(800));
  assertNoDuplicates();
  } finally {
    hideTeamSidebar();
  }
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
//  11e. STARTING-PLAYER ROLL
// ────────────────────────────────────────────────────────────────
function renderStarting() {
  const app = $('#app');
  const g = state.game;
  const mpWait = MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost;
  const de = state.lang === 'de';
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
      ${mpWait
        ? `<p id="mp-starting-wait" style="margin-top:1.2rem;color:var(--silver);">${de ? 'Der Host würfelt den Startspieler …' : 'The host is rolling for the first player …'}</p>`
        : `<button class="btn btn-primary btn-large" id="start-roll-btn" onclick="VV.rollStartingDice()" style="margin-top:1.2rem;">🎲 ${T('starting_roll')}</button>`}
    </div>`;
}

async function rollStartingDice() {
  if (MULTIPLAYER && state.mpRoom && !state.mpRoom.isHost) return;
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
  for (const pl of g.players) pl.courtRotation = 0;
  setView('game');
  setTimeout(runSeason, speedMs(400));
}


// ============================================================
// 6. BOARD & MOVEMENT
//    Week layout, cone roll, day resolution
// ============================================================

// ============================================================
// 10. SEASON LOOP & PHASE MANAGEMENT
// ============================================================
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
/** Calendar week 1–6 on the 6×8 board from absolute cone day (matches week strip / phase bar). */
function boardWeekDisplay(g) { return g && g.coneDay ? weekOfDay(g.coneDay) : 1; }

// Fixed event per day-in-week (per spec): Day 4=tournament, Day 8=league handled separately
const DAY_EVENT = { 1:'red', 2:'transfer', 3:'action', 5:'vnl', 6:'action', 7:'injury' };
function eventTypeForDay(d) { return DAY_EVENT[d] || 'action'; }

function renderGame() {
  const app = $('#app');
  const g = state.game;
  const me = MULTIPLAYER ? (mpLocalGamePlayer() || g.players[0]) : g.players[0];
  app.innerHTML = `
    <div class="gh">
      <div class="gh-logo">VOLLEY VENDETTA</div>
      <div class="gh-spacer"></div>
      <div class="gh-mini">${T('week')} ${boardWeekDisplay(g)} ${T('of')} 6</div>
      <div class="gh-lang">
        <span class="lang-pill ${state.lang==='de'?'active':''}" onclick="VV.setLang('de')">DE</span>
        <span class="lang-pill ${state.lang==='en'?'active':''}" onclick="VV.setLang('en')">EN</span>
      </div>
    </div>
    ${MULTIPLAYER && state.mpRoom ? `
    <div class="vvmp-game-bar" id="vvmp-game-bar">
      <button type="button" class="btn btn-secondary vvmp-pause-btn" onclick="if(window.VV&&VV.pauseSelf)VV.pauseSelf()">${state.lang==='de'?'Pause (60s)':'Pause (60s)'}</button>
      <button type="button" class="btn btn-secondary vvmp-resume-btn" onclick="if(window.VV&&VV.resumeSelf)VV.resumeSelf()">${state.lang==='de'?'Pause beenden':'End pause'}</button>
    </div>` : ''}
    <div class="game">
      <div class="topbar" id="topbar">
        <div class="topbar-bots">${g.players.filter(p=>!p.isHuman).map((p)=>playerCardHtml(p,g.players.indexOf(p),true)).join('')}</div>
        <div class="topbar-sep"></div>
        <div class="topbar-log-area"><div class="log" id="log"></div></div>
        <div class="topbar-sep"></div>
        ${playerYouHtml(me, g)}
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
            <span class="team-strength" id="team-strength-label">★ ${teamStrength(me)}</span>
          </div>
          <div class="gpanel-team-inner" id="team-panel">${teamPanelHtml(me)}</div>
        </div>
      </div>
      <div class="gbot">
        <div class="actions-wrap">
          <div class="actions" id="actions"></div>
          <button class="market-toggle-btn" id="market-toggle-btn" onclick="VV.toggleMarketPopup()">🛒 Markt</button>
        </div>
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
  refreshDebugHud();
}

function playerCardHtml(p, idx, withBars) {
  const g = state.game;
  const isYou = p.isHuman;
  const isActive = idx === (g && g.activeIdx);
  return `<div class="player-card ${isActive?'active':''} ${isYou?'you':''}" data-pidx="${idx}" data-player-id="${p.id}" style="border-left:3px solid ${p.color};">
    <div class="pc-name"><span class="pc-emoji">${p.emoji}</span>${escapeHTML(p.name)}</div>
    <div class="pc-stats">
      <div>${T('money')}</div><b>${fmtMoney(p.money)}</b>
      <div>${T('vp')}</div><b>${p.vp}/8</b>
      <div>${T('str')}</div><b>★ ${teamStrength(p)}</b>
      <div>${T('stats_lp')}</div><b>${leaguePointsVal(p)}</b>
    </div>
    ${withBars ? `<div class="pc-vp">${range(8).map(i=>`<span class="${i<p.vp?'fill':''}"></span>`).join('')}</div>` : ''}
  </div>`;
}

function playerYouHtml(p, g) {
  const isActive = g && g.players[g.activeIdx] === p;
  const str = teamStrength(p);
  const pidx = g && g.players ? Math.max(0, g.players.indexOf(p)) : 0;
  return `<div class="you-card ${isActive?'active':''}" data-pidx="${pidx}" data-player-id="${p.id}" style="border-left:4px solid ${p.color};">
    <div class="yc-label">${state.lang==='de'?'DU':'YOU'}</div>
    <div class="yc-name">${p.emoji} ${escapeHTML(p.name)}</div>
    <div class="yc-stats">
      <div class="yc-stat"><span class="yc-key">${T('money')}</span><span class="yc-val">${fmtMoney(p.money)}'</span></div>
      <div class="yc-stat"><span class="yc-key">${T('vp')}</span><span class="yc-val">${p.vp}/8</span></div>
      <div class="yc-stat"><span class="yc-key">${T('str')}</span><span class="yc-val">★ ${str}</span></div>
      <div class="yc-stat"><span class="yc-key">${T('stats_lp')}</span><span class="yc-val">${leaguePointsVal(p)}</span></div>
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
      <span class="ws-dlabel">${T('cal_day')} ${dInW}</span>
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

// Same 6-slot ring as match mini-court (setter starts front-right at rotation 0).
const COURT_ROTATION_RING = ['middle2', 'outside2', 'diagonal', 'middle', 'outside', 'setter'];
function courtRotationNorm(rotation) { return ((rotation || 0) % 6 + 6) % 6; }
function courtSlotRawPos(rotation, slotIdx) {
  const r = courtRotationNorm(rotation);
  return COURT_ROTATION_RING[((slotIdx - r) % 6 + 6) % 6];
}
/** Roster key shown in slot 0..5 (back row 0–2, front 3–5), including Libero-for-MB swap in back row */
function courtSlotDisplayPos(rotation, slotIdx) {
  const raw = courtSlotRawPos(rotation, slotIdx);
  const liberoSwapSlots = new Set();
  for (const s of [0, 1, 2]) {
    const pr = courtSlotRawPos(rotation, s);
    if (pr === 'middle' || pr === 'middle2') liberoSwapSlots.add(s);
  }
  if (slotIdx <= 2 && liberoSwapSlots.has(slotIdx) && (raw === 'middle' || raw === 'middle2')) return 'libero';
  return raw;
}

function teamPanelHtml(p, opts) {
  // Volleyball rotation: 6 slots on court (same model as match). Team panel + opponent mirror this.
  const s = p.team;
  const bench = p.bench || [];
  const suspended = Array.isArray(p.suspended) ? p.suspended : [];
  const readOnly = !!(opts && opts.readOnly);
  const sellMode = !readOnly && !!state.sellMode;
  
  // Resolve any active bench-card swap selection (only relevant for the human player)
  const selCardId = !readOnly ? state.selectedBenchCard : null;
  const selCard = selCardId
    ? (p.bench || []).find(c => c && c.id === selCardId)
    : null;
  const _primaryOf = { outside2: 'outside', middle2: 'middle' };

  function teamSlotHtml(card, pos) {
    if (!card) {
      // If a compatible bench card is selected, highlight the empty slot as a swap target
      const emptySwap = selCard && (selCard.pos === pos || selCard.pos === (_primaryOf[pos] || pos));
      return `<div class="slot empty vb-team-slot${emptySwap ? ' card-swap-target' : ''}" data-tip="${posLabel(pos)}" ${emptySwap ? `onclick="VV.handleFloatingClick('${pos}')"` : ''}><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
    }
    // Safety: a disabled non-sub card should never be in the formation — show as empty
    if (card.disabled && !card._isSub) return `<div class="slot empty vb-team-slot" data-tip="${posLabel(pos)} · ⛔"><span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span></div>`;
    const dis = card.disabled ? 'disabled' : '';
    const sub = card._isSub ? 'is-sub' : '';
    const slotBase = _primaryOf[pos] || pos;
    const isSwapTarget = !!(selCard && (selCard.pos === pos || selCard.pos === slotBase));
    const click = readOnly ? '' : `onclick="VV.handleFloatingClick('${pos}')"`;
    return `<div class="slot vb-team-slot ${dis} ${sub} ${sellMode?'sellable':''} ${isSwapTarget?'card-swap-target':''}" 
      data-tip="${escapeHTML(card.name)} · ${card.stars}★${card.disabled?' · '+(card.disabledReason||''):''}${sub?' · '+T('sub_tooltip'):''}"
      data-card-id="${card.id}"
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
    const isSelected = !readOnly && selCardId === c.id;
    const benchCls = (!readOnly && !c.disabled && !sellMode) ? 'card-bench' : '';
    return `<div class="slot vb-bench-slot ${benchCls} ${isSelected ? 'card-selected' : ''} ${sellMode?'sellable':''}" 
      data-tip="${escapeHTML(c.name)} · ${c.stars}★ · ${posLabel(c.pos)}${c.disabled?' · ⛔':''}"
      data-card-id="${c.id}"
      ${click}>
      <span class="pos-tag" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <img src="${c.url}" alt="">
      <div class="stars">${'★'.repeat(c.stars)}</div>
      ${c.disabled?'<div class="dis-overlay">⛔</div>':''}
    </div>`;
  }

  function suspendedSlotHtml(entry) {
    const c = entry && entry.card;
    const pos = (entry && entry.pos) || (c && c.pos) || 'outside';
    const reason = (entry && entry.reason) || (state.lang === 'de' ? 'Ausfall' : 'Unavailable');
    if (!c) {
      return `<div class="slot vb-bench-slot vb-suspended-slot empty"
        data-tip="${escapeHTML(reason)} · ${posLabel(pos)}">
        <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
        <div class="dis-overlay">⛔</div>
      </div>`;
    }
    return `<div class="slot vb-bench-slot vb-suspended-slot disabled"
      data-tip="${escapeHTML(c.name)} · ${c.stars}★ · ${posLabel(pos)} · ${escapeHTML(reason)}">
      <span class="pos-tag" style="background:${posColor(pos)}">${posShort(pos)}</span>
      <img src="${c.url}" alt="">
      <div class="stars">${'★'.repeat(c.stars)}</div>
      <div class="dis-overlay">⛔</div>
    </div>`;
  }

  const lang = state.lang === 'de';
  const rot = (opts && opts.rotation != null) ? courtRotationNorm(opts.rotation) : courtRotationNorm(p.courtRotation);
  const frontSlots = [3, 4, 5];
  const backSlots = [2, 1, 0];
  const shownKeys = new Set();
  const frontCells = frontSlots.map((sl) => {
    const rk = courtSlotDisplayPos(rot, sl);
    shownKeys.add(rk);
    return teamSlotHtml(s[rk], rk);
  }).join('');
  const backCells = backSlots.map((sl) => {
    const rk = courtSlotDisplayPos(rot, sl);
    shownKeys.add(rk);
    return teamSlotHtml(s[rk], rk);
  }).join('');
  // Off-court positions (the 7th slot not in the 3×2 rotation) → shown right of court
  const offCourtKeys = POSITIONS.filter(k => !shownKeys.has(k));
  const offCourtPanel = offCourtKeys.length
    ? `<div class="vb-mb2-panel">
        <div class="vb-mb2-label">
          <span class="vb-mb2-icon">↔</span>
          ${offCourtKeys.map(k => `<span>${posShort(k)}</span>`).join('')}
          <span style="font-size:0.48rem;opacity:0.45">${lang?'raus-rot.':'rotated'}</span>
        </div>
        ${offCourtKeys.map(k => teamSlotHtml(s[k] || null, k)).join('')}
      </div>`
    : '';

  return `
    ${readOnly ? '' : `<div class="vb-sell-bar">
      <button class="vb-sell-toggle ${sellMode?'on':''}" onclick="VV.toggleSellMode()">
        🔴 ${sellMode?(lang?'Verkauf AN':'Sell ON'):(lang?'Verkaufen':'Sell')}
      </button>
    </div>`}
    <div class="vb-formation-wrap">
      <div class="vb-formation">
        <div class="vb-net-line"></div>
        <div class="vb-row vb-row-3">${frontCells}</div>
        <div class="vb-row vb-row-3" style="margin-top:0.35rem">${backCells}</div>
      </div>
      ${offCourtPanel}
    </div>
    <div class="vb-bench">
      <div class="vb-bench-label">⬇ ${lang?'Bank':'Bench'} (${bench.length})</div>
      <div class="vb-bench-row">
        ${bench.map(c => benchSlotHtml(c)).join('') || `<span style="font-size:0.7rem;color:rgba(255,255,255,0.3)">${lang?'Leer':'Empty'}</span>`}
      </div>
      ${suspended.length ? `
      <div class="vb-bench-label vb-out-label">⛔ ${lang?'Ausfälle':'Out'} (${suspended.length})</div>
      <div class="vb-bench-row vb-out-row">
        ${suspended.map(e => suspendedSlotHtml(e)).join('')}
      </div>` : ''}
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
  const _human = state.game.players[0];
  tp.dataset.playerId = _human.id; // for showActionPopup highlights
  tp.innerHTML = teamPanelHtml(_human);
  const sl = $('#team-strength-label');
  if (sl) sl.textContent = '★ ' + teamStrength(_human);
}
/** During a match, keep human team panel + opponent board in sync with courtRotation */
function refreshMatchSidePanels(M) {
  const g = state.game;
  if (!g || !M) return;
  const me = g.players.find(p => p.isHuman) || g.players[0];
  if (M.home !== me && M.away !== me) return;
  refreshTeamPanel();
  const wrap = document.querySelector('.opp-team-wrap');
  if (wrap) {
    const opp = M.home === me ? M.away : M.home;
    wrap.innerHTML = teamPanelHtml(opp, { readOnly: true });
  }
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
  }).join('') + `<div class="phase-log-strip" id="phase-log-strip"></div><span class="phase">${T('week')} ${state.game ? boardWeekDisplay(state.game) : 1}/6</span>`;
  refreshPhaseLog();
}

// ────────────────────────────────────────────────────────────────
//  SEASON LOOP — using the cone movement
// ────────────────────────────────────────────────────────────────
async function runSeason() {
  const g = state.game;
  // `g.week` is the inner-loop index (1..6) for `targetEndOfWeek`; it increments right after
  // the weekend while `coneDay` may still sit on the league boundary (e.g. 8). UI week labels
  // use `boardWeekDisplay(g)` (= weekOfDay(coneDay)) so header, phase bar and week strip agree.
  while (g.week <= WEEKS_PER_SEASON && !g.over) {
    refreshBoard();
    // For each week: simulate cone advancement until cone reaches day 8 (league match)
    // Strict < so the loop exits the moment coneDay hits the league-match boundary (day 8, 16, 24…)
    const targetEndOfWeek = g.week * 8;
    // Week-start overview popup (Step 5): shows suspended players before first dice roll
    await showWeekStartSummary(g);
    while (g.coneDay < targetEndOfWeek && !g.over) {
      try {
        const active = g.players[g.activeIdx];
        // Active player rolls 3-die (or auto in fast mode)
        setPhase('event');
        await runConeRoll(active);
        if (g.over) return;
        // Move to next active player (clockwise)
        g.activeIdx = (g.activeIdx + 1) % g.players.length;
        _expectedAdvance = 'coneRollNow';
        refreshTopbar();
      } catch (err) {
        console.error('[VV] season-step crashed:', err);
        // Fire any pending waiters so the game can continue from a clean state
        ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(fire);
        _expectedAdvance = 'coneRollNow';
        toast(`⚠️ Fehler: ${err.message || err} — Spiel versucht fortzufahren`, 'bad', 5000);
        refreshTopbar();
        await sleep(1500);
      }
    }
    // Weekend matches first, then market
    setPhase('weekend');
    await runWeekendMatches(g.week);
    if (g.over) return;
    // After weekend, restore suspended/injured players for the next week
    restoreDisabledCards(true);
    // Market phase after the weekend matches
    setPhase('buy');
    // Ensure marketPile exists (safety for older saves)
    if (!Array.isArray(g.marketPile)) g.marketPile = [];
    try {
      await runMarketPhase();
    } catch (err) {
      console.error('[VV] runMarketPhase crashed:', err);
      toast(`⚠️ Markt-Fehler: ${err.message || err}`, 'bad', 5000);
      delete _pendingFires['endMarket'];
    }
    if (g.over) return;
    g.week += 1;
  }
  // Season end
  setPhase('done');
  if (!g.over) await runSeasonEnd();
  endGame();
}

// Returns the logical field type for a given absolute day.
// 'liga' = league match (day-in-week 8), 'cup' = any tournament day (day-in-week 4),
// otherwise the fixed event type ('red', 'transfer', 'action', 'vnl', 'injury').
function getFieldType(day) {
  const dInW = dayInWeekOf(day);
  if (dInW === 8) return 'liga';
  const weekEv = weekEventByWeek(weekOfDay(day));
  if (weekEv != null && weekEv.day === dInW) return 'cup';
  return eventTypeForDay(dInW);
}

// Only liga and cup fields trigger resolution when the cone passes through them.
// All other field types (red, transfer, action, vnl, injury) are silent on passthrough.
function shouldTriggerOnPassthrough(fieldType) {
  return fieldType === 'liga' || fieldType === 'cup';
}

// One cone-roll turn for a player
async function runConeRoll(player) {
  const g = state.game;
  const remoteH = mpSeatIsRemoteHumanOnHost(player);
  // New cone turn: clear stale pendings so a previous mistaken double-fire
  // cannot make the next waitFor(...) resolve instantly or out of order.
  delete _pendingFires['coneRollNow'];
  delete _pendingFires['coneContinue'];
  setActiveBanner(player, remoteH);
  setActionsHtml(`<h3>${T('phase_event')}</h3>${speedToggleHtml()}`);
  const stage = $('#stage');
  stage.innerHTML = `
    <div class="stage-h">${T('week')} ${boardWeekDisplay(g)} · ${T('cal_day')} ${dayInWeekOf(g.coneDay)}</div>
    <div class="stage-sub">${escapeHTML(player.name)} ${(player.isHuman || remoteH) ? T('yourturn') : T('bot_thinking') + ' …'}</div>
    <div class="dice-area" style="margin-top:1rem;">
      <div class="dice-num" id="dice-num">—</div>
    </div>
    <div id="cone-log" style="margin-top:1rem;"></div>`;
  // Update dice panel
  const dpBtn = document.getElementById('dice-panel-btn');
  const dpLbl = document.getElementById('dice-panel-label');
  if (dpLbl) dpLbl.textContent = '🎲 D3';
  _expectedAdvance = 'coneRollNow';
  if (state.speed !== 'auto') {
    if (dpBtn) {
      dpBtn.disabled = false;
      dpBtn.classList.add('pulse');
      if (remoteH) {
        dpBtn.disabled = true;
        dpBtn.textContent = (state.lang === 'de' ? '⏳ Entfernte/r Spieler…' : '⏳ Remote player…');
      } else {
        dpBtn.textContent = player.isHuman ? '🎲 Würfeln' : ('▶ ' + (state.lang === 'de' ? 'Weiter (Bot würfelt)' : 'Continue (bot rolls)'));
      }
    }
    if (remoteH) {
      await mpWaitConeRemote(player, 'coneRoll');
    } else {
      await waitFor('coneRollNow');
    }
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
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🎲 ${v} (${state.lang==='de'?'+':'+'}${advance})`);
  // Movement resolver: animate every step; resolve only on terminal or passthrough-eligible fields.
  // • Final landing (isLastStep) — always resolves, no exceptions.
  // • Liga (day 8) — always terminal; cone rests here (break). Resolves via isTerminal path.
  // • Cup/tournament (day 4) — resolves when passed through as an intermediate step.
  // • All other field types — animate only on intermediate steps, never resolve on passthrough.
  for (let i = 0; i < advance; i++) {
    const isLastStep  = (i === advance - 1);
    const d           = start + 1 + i;
    g.coneDay         = d;
    refreshBoard();
    await sleep(speedMs(350));

    const isLeagueDay = dayInWeekOf(d) === 8;
    const fieldType   = getFieldType(d);
    const isTerminal  = isLastStep || isLeagueDay;

    try {
      if (isTerminal) {
        // Final landing field OR league barrier — always resolve, no exceptions.
        await resolveDay(d, player);
        if (g.over) return;
      } else if (shouldTriggerOnPassthrough(fieldType)) {
        // Intermediate liga/cup field: fire and keep moving.
        await resolveDay(d, player);
        if (g.over) return;
      }
      // All other intermediate fields: animate only, no resolve.
    } catch (err) {
      console.error('[VV] executeMove crashed (day=' + d + '):', err);
      ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(fire);
      toast(`⚠️ Bewegungsfehler (Tag ${d}): ${err.message || err}`, 'bad', 4000);
    }

    if (isLeagueDay) break; // end-of-week boundary; cone rests here
  }
  if (g.over) return;
  if (!g.over) {
    _expectedAdvance = 'coneContinue';
    delete _pendingFires['coneRollNow']; // must not carry over into continue step
    const stageSub = document.querySelector('#stage .stage-sub');
    if (stageSub) stageSub.textContent = `${player.name} — ${T('cone_continue')}`;
    setActionsHtml(`<h3>${T('phase_event')}</h3>${speedToggleHtml()}`);
    const dpBtn2 = document.getElementById('dice-panel-btn');
    if (dpBtn2) {
      dpBtn2.disabled = false;
      dpBtn2.classList.add('pulse');
      if (remoteH) {
        dpBtn2.disabled = true;
        dpBtn2.textContent = (state.lang === 'de' ? '⏳ Entfernte/r Spieler…' : '⏳ Remote player…');
      } else {
        dpBtn2.textContent = '▶ ' + T('cone_continue');
      }
    }
    // Bots and auto-speed continue automatically; human (local or remote seat) waits
    if (state.speed === 'auto' || (!player.isHuman && !remoteH)) {
      setTimeout(()=>fire('coneContinue'), speedMs(3000));
    }
    const continueAutoMs = (state.speed === 'auto' || (!player.isHuman && !remoteH)) ? speedMs(4000) : 0;
    if (remoteH) {
      await mpWaitConeRemote(player, 'coneContinue');
    } else {
      await waitFor('coneContinue', continueAutoMs);
    }
    if (dpBtn2) { dpBtn2.disabled = true; dpBtn2.classList.remove('pulse'); dpBtn2.textContent = '🎲 Würfeln'; }
  }
}

// Route both action buttons through the same waiter-dispatch logic.
// This prevents dead clicks when UI labels and active waiter briefly desync.
function coneRollNow() { dicePanel_roll(true, 'coneRollNow'); }
function coneContinue() { dicePanel_roll(true, 'coneContinue'); }
function setActiveBanner(p, remoteHumanSeat) {
  // Big floating banner
  let banner = $('#turn-banner');
  if (!banner) { banner = document.createElement('div'); banner.id='turn-banner'; document.body.appendChild(banner); }
  const asHuman = p.isHuman || remoteHumanSeat;
  banner.className = 'turn-banner-floating ' + (asHuman ? 'human' : 'bot');
  banner.innerHTML = asHuman
    ? `<span class="tb-emoji">${p.emoji}</span> <span>${T('yourturn')}</span>`
    : `<span class="tb-emoji">${p.emoji}</span> <span>${escapeHTML(p.name)}</span> <span class="thinking"><span></span><span></span><span></span></span>`;
  banner.style.display = 'flex';
  setTimeout(() => { banner.style.display = 'none'; }, asHuman ? 1600 : 1200);
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
    // End of week — just log it; the weekly match is the weekend fixture
    appendConeLog(`<b>${T('week')} ${w} — ${state.lang === 'de' ? 'Wochenende' : 'Weekend'}</b>`);
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

// ============================================================
// 7. EVENT HANDLERS
// ============================================================

// ────────────────────────────────────────────────────────────────
//  7c. OTHER EVENTS (Red Card, Transfer, Injury)
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

function ownedCardIds() {
  // Returns a Set of card IDs currently in any player's team, bench, suspended, or marketPile.
  const g = state.game;
  if (!g) return new Set();
  const ids = new Set();
  for (const p of g.players) {
    for (const pos of POSITIONS) {
      const c = p.team[pos]; if (c && c.id) ids.add(c.id);
    }
    for (const c of (p.bench || [])) { if (c && c.id) ids.add(c.id); }
    for (const e of (p.suspended || [])) { if (e && e.card && e.card.id) ids.add(e.card.id); }
  }
  for (const c of (g.marketPile || [])) { if (c && c.id) ids.add(c.id); }
  for (const c of (g.market || []))     { if (c && c.id) ids.add(c.id); }
  return ids;
}

function drawAuctionCard() {
  const g = state.game;
  if (!Array.isArray(g.auctionDeck)) g.auctionDeck = [];
  // Remove cards already owned/in-market before drawing
  const owned = ownedCardIds();
  g.auctionDeck = g.auctionDeck.filter(c => c && !owned.has(c.id));
  if (g.auctionDeck.length === 0) {
    // Refill with only unowned 2-5★ cards
    g.auctionDeck = (ALL_CARDS || [])
      .filter(c => c && Number(c.stars) >= 2 && !owned.has(c.id))
      .sort(() => Math.random() - 0.5);
  }
  const card = g.auctionDeck.shift();
  if (!card) return null;
  return card;
}

async function applyTransfer(player) {
  const card = drawAuctionCard();
  if (!card) { appendConeLog(T('auction_no_one')); return; }
  const de = state.lang === 'de';
  // Use the shared visible auction UI; triggering player bids first
  await runAuctionUI(card, `🔁 ${T('cone_event_transfer')} — ${escapeHTML(player.name)}`, player);
  // Log result (winner/market already handled inside runAuctionUI)
  appendConeLog(`🔁 ${de ? 'Transfer-Auktion beendet' : 'Transfer auction done'}`);
}

function humanBidPopup(p, card, minNext) {
  return new Promise(resolve => {
    let settled = false;
    const finish = (val) => { if (settled) return; settled = true; resolve(val); };
    const sugg = Math.min(p.money, minNext);
    const id = 'transfer-bid-popup';
    const body = `
      <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1rem;">
        <div class="card-thumb card-thumb-narrow" style="width:80px;flex-shrink:0;">
          <img src="${card.url}" style="width:100%;border-radius:4px;display:block;" alt="">
        </div>
        <div>
          <div style="font-weight:700;font-size:1rem;">${escapeHTML(card.name)}</div>
          <div style="color:var(--silver);font-size:0.72rem;word-break:break-all;">${escapeHTML(cardImageBasename(card))}</div>
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

// ────────────────────────────────────────────────────────────────
//  7a. ACTION CARDS — 10 distinct effects
// ────────────────────────────────────────────────────────────────

// Show a modal popup that resolves when OK is clicked or auto-closes.
/**
 * Universal blocking action popup with optional card/player highlights.
 * Apply state changes BEFORE calling. Resolves on OK click or timeout.
 *
 * @param {object}   opts
 * @param {string}   opts.title             - Header (may include emoji)
 * @param {string}   opts.description       - Body; literal \n becomes <br>
 * @param {object[]} [opts.affectedCards]   - Cards highlighted red (suspended etc.)
 * @param {object[]} [opts.positiveCards]   - Cards highlighted green (gained etc.)
 * @param {object[]} [opts.affectedPlayers] - Player panels to glow
 * @param {number|null} [opts.autoMs] - Auto-close ms; null = no auto-close (OK only)
 */
function showActionPopup({ title, description, affectedCards = [], positiveCards = [], affectedPlayers = [], autoMs = EVENT_POPUP_MS }) {
  return new Promise(resolve => {
    const me = state.game ? state.game.players[0] : null;
    const cleanups = [];

    const hlCards = (cards, cls) => {
      for (const card of cards) {
        document.querySelectorAll('[data-card-id="' + card.id + '"]').forEach(el => {
          el.classList.add(cls);
          cleanups.push(() => el.classList.remove(cls));
        });
      }
    };
    hlCards(affectedCards, 'card-highlight-affected');
    hlCards(positiveCards, 'card-highlight-positive');

    for (const p of affectedPlayers) {
      const cls = (p === me) ? 'team-highlight-own' : 'team-highlight-opponent';
      document.querySelectorAll('[data-player-id="' + p.id + '"]').forEach(el => {
        el.classList.add(cls);
        cleanups.push(() => el.classList.remove(cls));
      });
    }

    // isBot: detect from duration (bot popups use BOT_POPUP_MS ≤ 5 s)
    const hasCountdown = autoMs != null;
    const isBot = hasCountdown && autoMs <= BOT_POPUP_MS + 500;
    const pid = 'upop-' + Date.now();
    const div = document.createElement('div');
    div.className = 'modal-popup';
    div.innerHTML = `
      <div class="modal-card action-upop">
        <div class="action-upop-title">${title}</div>
        <hr class="action-upop-divider">
        <div class="action-upop-desc">${description.replace(/\n/g, '<br>')}</div>
        <div class="action-upop-footer">
          <button class="btn btn-primary" id="${pid}-ok">OK</button>
          ${hasCountdown ? `
          <div class="popup-timer-wrap">
            <span class="popup-timer-seconds${isBot ? '' : ''}" id="${pid}-secs">${Math.ceil(autoMs / 1000)}s</span>
            <div class="popup-timer-bar-outer">
              <div class="popup-timer-bar-inner${isBot ? ' bot' : ''}" id="${pid}-bar"></div>
            </div>
          </div>` : ''}
        </div>
      </div>`;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('open'), 10);

    let cancelTimer = () => {};
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      cancelTimer();
      if (document.body.contains(div)) div.remove();
      for (const fn of cleanups) { try { fn(); } catch (_) {} }
      resolve();
    };

    if (hasCountdown) {
      // Start timer after the popup is visible
      setTimeout(() => {
        cancelTimer = startPopupTimer({
          durationMs: autoMs,
          isBot,
          onExpire: finish,
          secEl: document.getElementById(pid + '-secs'),
          barEl: document.getElementById(pid + '-bar'),
        });
      }, 50);
    }

    const okBtn = document.getElementById(pid + '-ok');
    if (okBtn) okBtn.addEventListener('click', finish);
    div.addEventListener('click', e => { if (e.target === div) finish(); });
  });
}

// ─── Reusable countdown timer for popups ──────────────────────────────────────
// Drives the .popup-timer-seconds label and .popup-timer-bar-inner bar.
// Returns a cancel() function; call it when the popup is dismissed early.
function startPopupTimer({ durationMs, isBot, onExpire, secEl, barEl }) {
  try {
    const TICK  = 500;
    const URGENT = 5000;
    let remaining = durationMs;

    const update = () => {
      try {
        const secs = Math.ceil(remaining / 1000);
        const urgent = remaining <= URGENT;
        if (secEl && document.body.contains(secEl)) {
          secEl.textContent = secs + 's';
          secEl.classList.toggle('urgent', urgent);
        }
        if (barEl && document.body.contains(barEl)) {
          barEl.style.width = Math.max(0, (remaining / durationMs) * 100) + '%';
          barEl.classList.toggle('urgent', urgent);
          barEl.classList.toggle('bot', !!isBot);
        }
      } catch (_) {}
    };

    // Render initial state immediately
    update();

    const id = setInterval(() => {
      try {
        remaining -= TICK;
        update();
        if (remaining <= 0) {
          clearInterval(id);
          try { onExpire(); } catch (_) {}
        }
      } catch (_) { clearInterval(id); }
    }, TICK);

    return () => clearInterval(id);
  } catch (err) {
    // Fail-safe: call onExpire after duration so game never gets stuck
    const fb = setTimeout(() => { try { onExpire(); } catch (_) {} }, durationMs);
    return () => clearTimeout(fb);
  }
}

function showActionPopupAsync(icon, title, bodyHtml, autoMs = EVENT_POPUP_MS) {
  return new Promise(resolve => {
    const pid = 'ac-pop-' + Date.now();
    const div = document.createElement('div');
    div.className = 'modal-popup';
    div.id = pid;
    div.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon">${icon}</div>
        <div class="modal-h">${title}</div>
        <div class="modal-p">${bodyHtml}</div>
        <button class="btn btn-primary" id="${pid}-ok">OK</button>
      </div>`;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('open'), 10);
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      if (document.body.contains(div)) div.remove();
      resolve();
    };
    const okBtn = div.querySelector(`#${pid}-ok`);
    if (okBtn) okBtn.addEventListener('click', finish);
    div.addEventListener('click', e => { if (e.target === div) finish(); });
    setTimeout(finish, autoMs);
  });
}

// Show opponent picker; bots auto-pick the wealthiest opponent.
function pickOpponent(player) {
  const g = state.game;
  const de = state.lang === 'de';
  const opponents = g.players.filter(p => p !== player);
  const botPick = () => opponents.reduce((a, b) => a.money >= b.money ? a : b);
  if (!player.isHuman || state.speed === 'auto') return Promise.resolve(botPick());
  return new Promise(resolve => {
    const pid = 'ac-opp-' + Date.now();
    const div = document.createElement('div');
    div.className = 'modal-popup';
    div.id = pid;
    const btns = opponents.map(o =>
      `<button class="btn btn-secondary" data-oid="${o.id}"
        style="margin:.3em .2em;min-width:140px">
        ${o.emoji} ${escapeHTML(o.name)}<br>
        <span style="font-size:.78em;color:var(--silver)">${fmtMoney(o.money)}'</span>
      </button>`
    ).join('');
    div.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon">🎯</div>
        <div class="modal-h">${de ? 'Gegner wählen' : 'Choose opponent'}</div>
        <div class="modal-p" style="display:flex;flex-wrap:wrap;justify-content:center">${btns}</div>
        <div class="popup-timer-wrap" style="padding:0 1em .5em">
          <span class="popup-timer-seconds" id="${pid}-secs">${Math.ceil(EVENT_POPUP_MS/1000)}s</span>
          <div class="popup-timer-bar-outer">
            <div class="popup-timer-bar-inner" id="${pid}-bar"></div>
          </div>
        </div>
        <div id="${pid}-note" style="font-size:.78em;color:var(--silver);text-align:center;padding-bottom:.5em;min-height:1.2em"></div>
      </div>`;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('open'), 10);
    let cancelTimer = () => {};
    let done = false;
    const finish = (opp, autoSelected = false) => {
      if (done) return; done = true;
      cancelTimer();
      if (autoSelected) {
        const note = document.getElementById(pid + '-note');
        if (note) note.textContent = de ? '⏱ Zeit abgelaufen — automatische Auswahl getroffen.' : '⏱ Time up — auto-selected.';
        setTimeout(() => { if (document.body.contains(div)) div.remove(); resolve(opp || botPick()); }, 800);
      } else {
        if (document.body.contains(div)) div.remove();
        resolve(opp || botPick());
      }
    };
    div.querySelectorAll('[data-oid]').forEach(btn =>
      btn.addEventListener('click', () => finish(opponents.find(o => o.id === btn.dataset.oid)))
    );
    setTimeout(() => {
      cancelTimer = startPopupTimer({
        durationMs: EVENT_POPUP_MS,
        isBot: false,
        onExpire: () => finish(botPick(), true),
        secEl: document.getElementById(pid + '-secs'),
        barEl: document.getElementById(pid + '-bar'),
      });
    }, 50);
  });
}

// AC 1 — Muskelfaserriss: best team card is suspended this week
async function ac_muskelfaserriss(player) {
  const de = state.lang === 'de';
  const _best = teamBestCard(player);
  let bestPos = _best ? _best.pos : null, bestCard = _best ? _best.card : null;
  if (!bestCard) {
    const msg = de ? 'Kein Spieler im Team — keine Auswirkung.' : 'No player in team — no effect.';
    appendConeLog(`🩻 Muskelfaserriss · ${player.emoji} ${escapeHTML(player.name)} · ${msg}`);
    await showActionPopup({ title: '🏥 Muskelfaserriss', description: `${player.emoji} ${escapeHTML(player.name)}\n${msg}`, affectedPlayers: [player], autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS });
    return;
  }
  disablePlayerOnTeam(player, bestPos, de ? 'Muskelfaserriss' : 'Muscle Tear');
  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  appendConeLog(`🩻 Muskelfaserriss · ${player.emoji} ${escapeHTML(player.name)}: ${escapeHTML(bestCard.name)} out`);
  await showActionPopup({
    title: '🏥 Muskelfaserriss',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> zieht Muskelfaserriss!\n${escapeHTML(bestCard.name)} (${posLabel(bestPos)} ${'★'.repeat(bestCard.stars)}) fällt diese Woche aus.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> draws Muscle Tear!\n${escapeHTML(bestCard.name)} (${posLabel(bestPos)} ${'★'.repeat(bestCard.stars)}) is out this week.`,
    affectedCards: [bestCard],
    affectedPlayers: [player],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// AC 2 — Trikotsponsor: +15 000 CHF
async function ac_trikotsponsor(player) {
  const de = state.lang === 'de';
  const amount = SPONSOR_BONUS;
  player.money += amount; player.totalEarned += amount;
  animateMoneyChange(player, amount); refreshTopbar();
  appendConeLog(`👕 Trikotsponsor · ${player.emoji} ${escapeHTML(player.name)} +${fmtMoney(amount)}'`);
  await showActionPopup({
    title: '💰 Trikotsponsor',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> erhält einen neuen Trikotsponsor!\n+${fmtMoney(amount)}' sofort ausgezahlt.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> receives a new shirt sponsor!\n+${fmtMoney(amount)}' paid immediately.`,
    affectedPlayers: [player],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// AC 3 — Transfergerücht: opponent's weakest team card gets forcedSale flag
async function ac_transfergeruecht(player) {
  const de = state.lang === 'de';
  const opp = await pickOpponent(player);
  const _worst = teamWorstCard(opp);
  let worstPos = _worst ? _worst.pos : null, worstCard = _worst ? _worst.card : null;
  if (!worstCard) {
    const msg = de ? `${escapeHTML(opp.name)} hat kein Team — keine Auswirkung.`
                   : `${escapeHTML(opp.name)} has no team — no effect.`;
    appendConeLog(`🕵️ Transfergerücht · ${msg}`);
    await showActionPopup({ title: '🕵️ Transfergerücht', description: msg, affectedPlayers: [opp], autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS });
    return;
  }
  worstCard.forcedSale = true;
  appendConeLog(`🕵️ Transfergerücht · ${player.emoji} ${escapeHTML(player.name)} → ${escapeHTML(opp.name)}: ${escapeHTML(worstCard.name)}`);
  await showActionPopup({
    title: '🕵️ Transfergerücht',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> streut Transfergerüchte über ${opp.emoji} <b>${escapeHTML(opp.name)}</b>!\n${escapeHTML(worstCard.name)} (${posLabel(worstPos)} ${'★'.repeat(worstCard.stars)}) muss in der nächsten Auktion\nzum Mindestpreis angeboten werden.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> starts a transfer rumour!\n${opp.emoji} <b>${escapeHTML(opp.name)}</b>: ${escapeHTML(worstCard.name)} (${'★'.repeat(worstCard.stars)}) must be sold at minimum price.`,
    affectedCards: [worstCard],
    affectedPlayers: [player, opp],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// AC 5 — Talentförderung: draw 3 cards, keep 1
async function ac_talentfoerderung(player) {
  const g = state.game;
  const de = state.lang === 'de';
  const drawn = [];
  for (let i = 0; i < 3; i++) { const c = drawAuctionCard(); if (c) drawn.push(c); }
  if (!drawn.length) {
    appendConeLog(`🎓 Talentförderung · ${de ? 'Keine Karten verfügbar.' : 'No cards available.'}`);
    return;
  }
  const botIdx = drawn.reduce((bi, c, i, a) => c.stars >= a[bi].stars ? i : bi, 0);
  let chosen;
  if (!player.isHuman || state.speed === 'auto') {
    chosen = drawn[botIdx];
  } else {
    chosen = await new Promise(resolve => {
      const pid = 'ac-talent-' + Date.now();
      const div = document.createElement('div');
      div.className = 'modal-popup'; div.id = pid;
      const cardBtns = drawn.map((c, i) => `
        <button class="btn btn-secondary" data-idx="${i}"
          style="display:flex;align-items:center;gap:.6em;margin:.4em auto;width:100%;max-width:310px;padding:.4em .7em;text-align:left">
          <img src="${c.url}" style="height:54px;border-radius:4px;flex-shrink:0" alt="">
          <div>
            <div style="font-weight:700">${escapeHTML(c.name)}</div>
            <div style="font-size:.78em;color:var(--silver)">${'★'.repeat(c.stars)} · ${posLabel(c.pos)}</div>
          </div>
        </button>`).join('');
      div.innerHTML = `
        <div class="modal-card" style="max-width:400px">
          <div class="modal-icon">🎓</div>
          <div class="modal-h">Talentförderung</div>
          <div class="modal-p">${de ? `Wähle einen von ${drawn.length} Spielern:` : `Pick one of ${drawn.length} players:`}</div>
          <div style="margin-top:.6em">${cardBtns}</div>
          <div class="popup-timer-wrap" style="padding:.4em 1em 0">
            <span class="popup-timer-seconds" id="${pid}-secs">${Math.ceil(EVENT_POPUP_MS/1000)}s</span>
            <div class="popup-timer-bar-outer">
              <div class="popup-timer-bar-inner" id="${pid}-bar"></div>
            </div>
          </div>
          <div id="${pid}-note" style="font-size:.78em;color:var(--silver);text-align:center;padding:.3em 0;min-height:1.2em"></div>
        </div>`;
      document.body.appendChild(div);
      setTimeout(() => div.classList.add('open'), 10);
      let cancelTimer = () => {};
      let done = false;
      const finish = (idx, autoSelected = false) => {
        if (done) return; done = true;
        cancelTimer();
        const chosen = drawn[idx] ?? drawn[botIdx];
        if (autoSelected) {
          const note = document.getElementById(pid + '-note');
          if (note) note.textContent = de ? '⏱ Zeit abgelaufen — automatische Auswahl getroffen.' : '⏱ Time up — auto-selected.';
          setTimeout(() => { if (document.body.contains(div)) div.remove(); resolve(chosen); }, 800);
        } else {
          if (document.body.contains(div)) div.remove();
          resolve(chosen);
        }
      };
      div.querySelectorAll('[data-idx]').forEach(btn =>
        btn.addEventListener('click', () => finish(parseInt(btn.dataset.idx, 10)))
      );
      setTimeout(() => {
        cancelTimer = startPopupTimer({
          durationMs: EVENT_POPUP_MS,
          isBot: false,
          onExpire: () => finish(botIdx, true),
          secEl: document.getElementById(pid + '-secs'),
          barEl: document.getElementById(pid + '-bar'),
        });
      }, 50);
    });
  }
  // Return unchosen cards to the bottom of the auction deck
  if (!Array.isArray(g.auctionDeck)) g.auctionDeck = [];
  for (const c of drawn) { if (c !== chosen) g.auctionDeck.push(c); }

  placeIntoTeamOrBench(player, chosen);
  autoSelectLineup(player);
  refreshTeamPanel(); refreshTopbar();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  appendConeLog(`🎓 Talentförderung · ${player.emoji} ${escapeHTML(player.name)} → ${escapeHTML(chosen.name)}`);
  await showActionPopup({
    title: '🎓 Talentförderung',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> wählt ein Talent!\nGewählt: <b>${escapeHTML(chosen.name)}</b> (${posLabel(chosen.pos)} ★${chosen.stars})\nZwei Spieler zurück in den Stapel.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> draws Talent Development!\nChosen: <b>${escapeHTML(chosen.name)}</b> (${posLabel(chosen.pos)} ★${chosen.stars})\nTwo players returned to the deck.`,
    positiveCards: [chosen],
    affectedPlayers: [player],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
  assertNoDuplicates();
}

// AC 6 — Busunfall: d6 → 1–2: suspend 1 card  3–4: suspend 2 cards  5–6: nothing
async function ac_busunfall(player) {
  const de = state.lang === 'de';
  const roll6 = await performDiceRoll(6);

  let count = 0, resultDesc;
  if      (roll6 <= 2) { count = 1; resultDesc = de ? `${roll6} → 1 Spieler fällt aus!`    : `${roll6} → 1 player out!`; }
  else if (roll6 <= 4) { count = 2; resultDesc = de ? `${roll6} → 2 Spieler fallen aus!`   : `${roll6} → 2 players out!`; }
  else                 {             resultDesc = de ? `${roll6} → Keine Ausfälle! 🍀`      : `${roll6} → No suspensions! 🍀`; }

  const pool = POSITIONS.map(pos => ({ pos, card: player.team[pos] }))
                        .filter(e => e.card && !e.card.disabled)
                        .sort(() => Math.random() - 0.5);
  const suspended = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    disablePlayerOnTeam(player, pool[i].pos, de ? 'Busunfall' : 'Bus Accident');
    suspended.push(pool[i].card);
  }
  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();

  appendConeLog(`🚌 Busunfall · ${player.emoji} ${escapeHTML(player.name)} · ${resultDesc}${suspended.length ? ' — ' + suspended.map(c => escapeHTML(c.name)).join(', ') : ''}`);
  const suspNames = suspended.map(c => `<b>${escapeHTML(c.name)}</b> (${posLabel(c.pos)} ★${c.stars})`).join(de ? ' und ' : ' and ');
  const busDesc = de
    ? suspended.length === 0
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> erleidet einen Busunfall!\nWürfelergebnis: ${resultDesc} — Zum Glück passiert nichts!`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> erleidet einen Busunfall!\nWürfelergebnis: ${resultDesc}\n${suspNames} ${suspended.length > 1 ? 'fallen' : 'fällt'} diese Woche aus.`
    : suspended.length === 0
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> has a bus accident!\nDie: ${resultDesc} — Luckily nothing happens!`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> has a bus accident!\nDie: ${resultDesc}\n${suspNames} ${suspended.length > 1 ? 'are' : 'is'} out this week.`;
  await showActionPopup({
    title: '🚌 Busunfall',
    description: busDesc,
    affectedCards: suspended,
    affectedPlayers: [player],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// AC 7 — Transfersperre: player cannot bid in next auction
async function ac_transfersperre(player) {
  const de = state.lang === 'de';
  player.auctionBanned = true;
  appendConeLog(`⚖️ Transfersperre · ${player.emoji} ${escapeHTML(player.name)} gesperrt für nächste Auktion`);
  await showActionPopup({
    title: '⚖️ Transfersperre',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> erhält eine Transfersperre!\nDarf in der nächsten Auktion nicht mitbieten.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> receives a transfer ban!\nCannot place bids in the next auction.`,
    affectedPlayers: [player],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// AC 8 — Ehemaligentreffen: +5 000 per 1★ card in team
async function ac_ehemaligentreffen(player) {
  const de = state.lang === 'de';
  const oneStarCards = POSITIONS.map(pos => player.team[pos]).filter(c => c && !c.disabled && c.stars === 1);
  const count = oneStarCards.length;
  const earned = count * VETERAN_BONUS;
  if (count === 0) {
    appendConeLog(`🏆 Ehemaligentreffen · ${player.emoji} ${escapeHTML(player.name)} · keine`);
    await showActionPopup({
      title: '🏆 Ehemaligentreffen',
      description: de
        ? `${player.emoji} <b>${escapeHTML(player.name)}</b> besucht das Ehemaligentreffen!\nKeine 1-Stern-Spieler im Team — keine Ausschüttung.`
        : `${player.emoji} <b>${escapeHTML(player.name)}</b> attends the alumni gathering!\nNo 1★ players in team — no payout.`,
      affectedPlayers: [player],
      autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
    });
    return;
  }
  player.money += earned; player.totalEarned += earned;
  animateMoneyChange(player, earned); refreshTopbar();
  const cardList = oneStarCards.map(c => `${escapeHTML(c.name)} (★1)`).join(', ');
  appendConeLog(`🏆 Ehemaligentreffen · ${player.emoji} ${escapeHTML(player.name)} +${fmtMoney(earned)}'`);
  await showActionPopup({
    title: '🏆 Ehemaligentreffen',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> hat ${count} Ehemalige im Kader!\n${cardList}\n<b>+${fmtMoney(earned)}'</b> ausgezahlt.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> has ${count} alumni in the squad!\n${cardList}\n<b>+${fmtMoney(earned)}'</b> paid out.`,
    positiveCards: oneStarCards,
    affectedPlayers: [player],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// AC 9 — Leihgeschäft: opponent loans one card for the current week
async function ac_leihgeschaeft(player) {
  const g = state.game;
  const de = state.lang === 'de';
  const opp = await pickOpponent(player);

  // All non-disabled cards from opponent's team + bench
  const loanable = [
    ...POSITIONS.map(pos => ({ source: 'team', slot: pos, card: opp.team[pos] }))
               .filter(e => e.card && !e.card.disabled),
    ...(opp.bench || []).filter(c => c && !c.disabled)
                        .map(c => ({ source: 'bench', slot: null, card: c })),
  ];
  if (!loanable.length) {
    const msg = de ? `${escapeHTML(opp.name)} hat keine verfügbaren Spieler.`
                   : `${escapeHTML(opp.name)} has no available players.`;
    appendConeLog(`🔄 Leihgeschäft · ${msg}`);
    await sleep(speedMs(1500)); return;
  }

  const botPickIdx = loanable.reduce((bi, e, i, a) => e.card.stars <= a[bi].card.stars ? i : bi, 0);
  let entry;
  if (opp.isHuman && state.speed !== 'auto') {
    // Human opponent picks which card to loan out
    entry = await new Promise(resolve => {
      const pid = 'ac-loan-' + Date.now();
      const div = document.createElement('div');
      div.className = 'modal-popup'; div.id = pid;
      const btns = loanable.map((e, i) => `
        <button class="btn btn-secondary" data-idx="${i}"
          style="display:flex;align-items:center;gap:.5em;margin:.3em auto;width:100%;max-width:310px;padding:.35em .7em;text-align:left">
          <img src="${e.card.url}" style="height:48px;border-radius:3px;flex-shrink:0" alt="">
          <div>
            <div style="font-weight:700;font-size:.9em">${escapeHTML(e.card.name)}</div>
            <div style="font-size:.75em;color:var(--silver)">${'★'.repeat(e.card.stars)} · ${posLabel(e.card.pos)}</div>
          </div>
        </button>`).join('');
      div.innerHTML = `
        <div class="modal-card" style="max-width:400px">
          <div class="modal-icon">🤝</div>
          <div class="modal-h">${de ? 'Leihe anbieten' : 'Offer loan'}</div>
          <div class="modal-p">${de ? `Welchen Spieler leihst du <b>${escapeHTML(player.name)}</b>?`
                                    : `Which player to loan to <b>${escapeHTML(player.name)}</b>?`}</div>
          <div style="margin-top:.6em">${btns}</div>
          <div class="popup-timer-wrap" style="padding:.4em 1em 0">
            <span class="popup-timer-seconds" id="${pid}-secs">${Math.ceil(EVENT_POPUP_MS/1000)}s</span>
            <div class="popup-timer-bar-outer">
              <div class="popup-timer-bar-inner" id="${pid}-bar"></div>
            </div>
          </div>
          <div id="${pid}-note" style="font-size:.78em;color:var(--silver);text-align:center;padding:.3em 0;min-height:1.2em"></div>
        </div>`;
      document.body.appendChild(div);
      setTimeout(() => div.classList.add('open'), 10);
      let cancelTimer = () => {};
      let done = false;
      const finish = (idx, autoSelected = false) => {
        if (done) return; done = true;
        cancelTimer();
        const chosen = loanable[idx] ?? loanable[botPickIdx];
        if (autoSelected) {
          const note = document.getElementById(pid + '-note');
          if (note) note.textContent = de ? '⏱ Zeit abgelaufen — automatische Auswahl getroffen.' : '⏱ Time up — auto-selected.';
          setTimeout(() => { if (document.body.contains(div)) div.remove(); resolve(chosen); }, 800);
        } else {
          if (document.body.contains(div)) div.remove();
          resolve(chosen);
        }
      };
      div.querySelectorAll('[data-idx]').forEach(btn =>
        btn.addEventListener('click', () => finish(parseInt(btn.dataset.idx, 10)))
      );
      setTimeout(() => {
        cancelTimer = startPopupTimer({
          durationMs: EVENT_POPUP_MS,
          isBot: false,
          onExpire: () => finish(botPickIdx, true),
          secEl: document.getElementById(pid + '-secs'),
          barEl: document.getElementById(pid + '-bar'),
        });
      }, 50);
    });
  } else {
    entry = loanable[botPickIdx];
  }

  const loanCard = entry.card;
  // Remove from owner's roster
  if (entry.source === 'team') opp.team[entry.slot] = null;
  else opp.bench = (opp.bench || []).filter(c => c !== loanCard);

  // Tag for return and add to drawing player's bench
  loanCard._loanOwner = opp.id;
  loanCard.loanedFrom = opp.id;
  loanCard._loanSlot  = entry.slot;   // null if from bench
  loanCard._loanReturn = true;
  if (!Array.isArray(player.bench)) player.bench = [];
  player.bench.push(loanCard);
  autoSelectLineup(player); // potentially fields the loaned card if it's strongest
  autoSelectLineup(opp);    // fill the gap left by the loaned card

  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  appendConeLog(`🔄 Leihgeschäft · ${escapeHTML(loanCard.name)}: ${escapeHTML(opp.name)} → ${escapeHTML(player.name)}`);
  await showActionPopup({
    title: '🔄 Leihgeschäft',
    description: de
      ? `${player.emoji} <b>${escapeHTML(player.name)}</b> leiht sich <b>${escapeHTML(loanCard.name)}</b> (${posLabel(loanCard.pos)} ★${loanCard.stars})\nvon ${opp.emoji} <b>${escapeHTML(opp.name)}</b> für diese Woche.\nRückgabe automatisch zu Beginn der nächsten Woche.`
      : `${player.emoji} <b>${escapeHTML(player.name)}</b> borrows <b>${escapeHTML(loanCard.name)}</b> (${posLabel(loanCard.pos)} ★${loanCard.stars})\nfrom ${opp.emoji} <b>${escapeHTML(opp.name)}</b> for this week.\nAutomatic return at the start of next week.`,
    positiveCards: [loanCard],
    affectedCards: [],
    affectedPlayers: [player, opp],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
  assertNoDuplicates();
}

// AC 10 — Zuschauerrückgang: all players lose 8 000 CHF
async function ac_zuschauerruckgang(player) {
  const g = state.game;
  const de = state.lang === 'de';
  const loss = AUDIENCE_LOSS;
  for (const p of g.players) {
    const actual = Math.min(p.money, loss);
    p.money = Math.max(0, p.money - loss);
    animateMoneyChange(p, -actual);
  }
  refreshTopbar();
  appendConeLog(`📉 Zuschauerrückgang · Alle −${fmtMoney(loss)}'`);
  const balanceLines = g.players.map(p => `${p.emoji} <b>${escapeHTML(p.name)}</b>: ${fmtMoney(p.money)}'`).join('\n');
  await showActionPopup({
    title: '📉 Zuschauerrückgang',
    description: de
      ? `Schlechte Saison für alle Vereine!\nJedes Team verliert <b>${fmtMoney(loss)}'</b>.\n\n${balanceLines}`
      : `Bad season for all clubs!\nEvery team loses <b>${fmtMoney(loss)}'</b>.\n\n${balanceLines}`,
    affectedPlayers: g.players ? [...g.players] : [],
    autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
  });
}

// Dispatcher — pick one of the 9 active action cards at random each time
async function applyActionCard(player) {
  const CARDS = [
    ac_muskelfaserriss, ac_trikotsponsor,  ac_transfergeruecht,
    ac_talentfoerderung, ac_busunfall,     ac_transfersperre,
    ac_ehemaligentreffen, ac_leihgeschaeft, ac_zuschauerruckgang,
  ];
  await choice(CARDS)(player);
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

// ────────────────────────────────────────────────────────────────
//  7b. LAENDERSPIEL / VNL
// ────────────────────────────────────────────────────────────────
// Active VNL nations per week (nation strings match the `nation` field in the ROSTER)
const VNL_NATIONS_BY_WEEK = {
  1: ['Argentinien', 'Kanada',      'Brasilien',  'Bulgarien'],
  2: ['Japan',       'Kuba',        'China',      'Deutschland'],
  3: ['Frankreich',  'Italien',     'Serbien',    'Iran'],
  4: ['Slowenien',   'Serbien',     'Russland',   'Niederlande'],
  5: ['Japan',       'USA',         'Kanada',     'Deutschland'],
  6: ['Polen',       'Italien',     'Argentinien','Deutschland'],
};

async function applyVnlEvent(player) {
  const g = state.game;
  const de = state.lang === 'de';
  const week = g.week || 1;
  const activeNations = VNL_NATIONS_BY_WEEK[week] || [];

  if (!activeNations.length) {
    const msg = de ? `Keine VNL-Daten für Woche ${week}.` : `No VNL data for week ${week}.`;
    appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🚩 VNL · <i style="color:var(--silver)">${msg}</i>`);
    toast(`🚩 VNL — ${msg}`, '', 3000);
    return;
  }

  const nationsLabel = activeNations.join(', ');
  const reason = T('cone_event_vnl');

  // Collect suspensions across ALL players (team slots + bench)
  const suspensionsByTeam = [];

  for (const p of g.players) {
    if (!Array.isArray(p.suspended)) p.suspended = [];
    if (!Array.isArray(p.bench))     p.bench     = [];
    const hits = [];

    // Team slots
    for (const pos of POSITIONS) {
      const card = p.team[pos];
      if (card && !card.disabled && activeNations.includes(card.nation)) {
        disablePlayerOnTeam(p, pos, reason);
        hits.push(card);
      }
    }

    // Bench cards
    for (const card of p.bench) {
      if (card && !card.disabled && activeNations.includes(card.nation)) {
        card.disabled = true;
        card.disabledReason = reason;
        p.suspended.push({ card, pos: null, reason, _fromBench: true });
        hits.push(card);
      }
    }

    if (hits.length) suspensionsByTeam.push({ p, hits });
  }

  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();

  // Log & notify
  const vnlTitle = de ? `🌍 Länderspiel — Woche ${week}` : `🌍 International Match — Week ${week}`;
  const nationsHeader = de
    ? `Aktive Nationen diese Woche: <b>${escapeHTML(nationsLabel)}</b>`
    : `Active nations this week: <b>${escapeHTML(nationsLabel)}</b>`;

  if (!suspensionsByTeam.length) {
    appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🌍 VNL Wk${week} · keine Spieler betroffen`);
    await showActionPopup({
      title: vnlTitle,
      description: nationsHeader + '\n\n' + (de ? 'Keine Spieler betroffen.' : 'No players affected.'),
      autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
    });
  } else {
    const allHitCards   = suspensionsByTeam.flatMap(({ hits }) => hits);
    const allHitPlayers = suspensionsByTeam.map(({ p }) => p);
    for (const { p: tp, hits } of suspensionsByTeam) {
      appendConeLog(`🌍 VNL Wk${week} · ${tp.emoji} ${escapeHTML(tp.name)}: ${hits.map(c => escapeHTML(c.name)).join(', ')} ${de ? 'gesperrt' : 'suspended'}`);
    }
    const vnlRows = suspensionsByTeam.map(({ p: tp, hits }) =>
      `${tp.emoji} <b>${escapeHTML(tp.name)}</b>: ${hits.map(c => `${escapeHTML(c.name)} (${escapeHTML(c.nation)} ${posLabel(c.pos)} ★${c.stars})`).join(', ')}`
    ).join('\n');
    await showActionPopup({
      title: vnlTitle,
      description: nationsHeader + '\n\n' + (de ? 'Gesperrte Spieler:\n' : 'Suspended players:\n') + vnlRows,
      affectedCards: allHitCards,
      affectedPlayers: allHitPlayers,
      autoMs: player.isHuman ? EVENT_POPUP_MS : BOT_POPUP_MS,
    });
  }
}

// ─── Week-start summary popup (Step 5) ───────────────────────────────────────
// Shows all suspended players and expiring loans at the start of each week.
// No countdown — only an OK button. autoMs = null means "wait for OK click".
async function showWeekStartSummary(g) {
  try {
    const de = state.lang === 'de';
    const week = g.week || 1;
    const title = de ? `📋 Woche ${week} — Kaderübersicht` : `📋 Week ${week} — Squad Overview`;

    const affectedCards   = [];
    const affectedPlayers = [];
    const teamLines = [];

    for (const p of g.players) {
      const lines = [];

      // Suspended team-slot cards
      for (const pos of POSITIONS) {
        const c = p.team[pos];
        if (c && c.disabled) {
          lines.push(`⛔ <b>${escapeHTML(c.name)}</b> (${posLabel(pos)} ★${c.stars}) — ${de ? 'gesperrt' : 'suspended'}`);
          affectedCards.push(c);
        }
      }

      // Suspended bench cards
      for (const c of (p.bench || [])) {
        if (c && c.disabled) {
          lines.push(`⛔ <b>${escapeHTML(c.name)}</b> (${posLabel(c.pos)} ★${c.stars}) — ${de ? 'gesperrt (Bank)' : 'suspended (bench)'}`);
          affectedCards.push(c);
        }
      }

      // Expiring loan cards this week
      for (const pos of POSITIONS) {
        const c = p.team[pos];
        if (c && c._loanReturn === week) {
          lines.push(`🔄 <b>${escapeHTML(c.name)}</b> (${posLabel(pos)} ★${c.stars}) — ${de ? 'Leihe läuft ab' : 'loan expires'}`);
          if (!affectedCards.includes(c)) affectedCards.push(c);
        }
      }

      if (lines.length) {
        teamLines.push(`${p.emoji} <b>${escapeHTML(p.name)}</b>:\n${lines.join('\n')}`);
        affectedPlayers.push(p);
      }
    }

    const description = teamLines.length
      ? teamLines.join('\n\n')
      : (de ? 'Alle Spieler einsatzbereit. Viel Erfolg!' : 'All players available. Good luck!');

    await showActionPopup({
      title,
      description,
      affectedCards,
      affectedPlayers,
      autoMs: EVENT_POPUP_MS,  // 25 s — human can always click OK early
    });
  } catch (err) {
    console.error('[VV] showWeekStartSummary crashed:', err);
  }
}

async function applyInjury(player) {
  const detail = $('#event-detail');
  if (detail) detail.innerHTML = `<div class="dice-area"><div class="dice-num" id="dice-num">—</div></div>`;
  const v = await performDiceRoll(6);
  const pos = diePositionFor(v);
  const subbed = disablePlayerOnTeam(player, pos, T('cone_event_injury'));
  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} → 🩹 ${posLabel(pos)} ${T('injury_out')}${subbed?` · ${T('sub_in')}: ${escapeHTML(subbed.name)}`:''}`);
  refreshTeamPanel();
  refreshFloatingPanel();
}

// ────────────────────────────────────────────────────────────────
//  7d. SUSPENSION HELPERS
//  Shared by all events that sideline a card (Red Card / Injury /
//  VNL / Busunfall / Muskelfaserriss / match criterion 11).
// ────────────────────────────────────────────────────────────────
function disablePlayerOnTeam(player, pos, reason) {
  const card = player.team[pos];
  if (!card) return null;

  if (!Array.isArray(player.suspended)) player.suspended = [];
  if (!Array.isArray(player.bench)) player.bench = [];

  // If the card was already processed (disabled + in suspended), just update reason and return.
  // IMPORTANT: only skip if the card is NOT currently in the team slot anymore.
  if (card.disabled && !card._isSub) {
    const alreadySuspended = player.suspended.some(e => e.card === card);
    if (alreadySuspended) {
      card.disabledReason = reason;
      return null; // already handled correctly before
    }
    // Card is disabled but still in the slot — force-remove it (should not normally happen)
  }

  // Mark the card as disabled and remove it from the team slot immediately
  card.disabled = true;
  card.disabledReason = reason;
  player.team[pos] = null;                    // slot is now empty
  player.suspended.push({ card, pos, reason });

  // Pool mapping: outside2 accepts 'outside' bench cards, middle2 accepts 'middle'
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;

  // 1) Look for a bench card matching the position (exact or pool match)
  const benchIdx = player.bench.findIndex(b => !b.disabled && (b.pos === pos || b.pos === poolPos));
  if (benchIdx >= 0) {
    const sub = player.bench.splice(benchIdx, 1)[0];
    sub._isSub = true;
    sub._subReason = reason;
    player.team[pos] = sub;
    return sub;
  }

  // 2) No bench match — emergency buy: 1★ card of the same position for PRICE_PER_STAR
  const cost = PRICE_PER_STAR;
  player.money = Math.max(0, player.money - cost);
  animateMoneyChange(player, -cost);
  toast(
    `⚠️ ${state.lang === 'de' ? 'Kein Ersatz auf Bank — Notfallkauf' : 'No bench sub — emergency buy'} (${fmtMoney(cost)})`,
    'bad', 3000
  );

  const pick = pickUnowned1Star(poolPos) || pickUnowned1Star(pos);
  if (pick) {
    removeCardFromPools(pick);
    pick._isSub = true;
    pick._subReason = state.lang === 'de' ? 'Notfall-Einwechslung' : 'Emergency sub';
    player.team[pos] = pick;
    return pick;
  }

  // Edge case: no 1★ card exists in the pool for this position — slot stays empty
  toast(`⚠️ ${state.lang === 'de' ? 'Kein 1★-Karte für Position gefunden!' : 'No 1★ card found for position!'}`, 'bad', 4000);
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
      entry.card.disabled = false;
      entry.card.disabledReason = null;

      // VNL bench suspension — card was never moved out of bench, just re-enable it
      if (entry._fromBench) continue;

      const cur = p.team[entry.pos];
      if (cur && cur._isSub) {
        // The sub goes back to bench, the original returns to the team slot
        delete cur._isSub;
        delete cur._subReason;
        p.bench.push(cur);
        p.team[entry.pos] = entry.card;
      } else if (!cur) {
        // Slot is empty (no sub was available) — original returns to team
        p.team[entry.pos] = entry.card;
      } else {
        // Slot was filled by something else (e.g. market buy) — original goes to bench
        p.bench.push(entry.card);
      }
    }
    // Clean up any remaining disabled flags (safety net)
    for (const pos of POSITIONS) {
      const c = p.team[pos];
      if (c && c.disabled) { c.disabled = false; c.disabledReason = null; }
    }
  }

  // Return loaned cards to their original owners
  for (const p of g.players) {
    if (!Array.isArray(p.bench)) continue;
    const toReturn = p.bench.filter(c => c && c._loanReturn);
    for (const card of toReturn) {
      p.bench = p.bench.filter(c => c !== card);
      const owner = g.players.find(pl => pl.id === card._loanOwner);
      const origSlot = card._loanSlot;
      delete card._loanReturn; delete card._loanOwner; delete card._loanSlot; delete card.loanedFrom;
      if (!owner) continue;
      if (!Array.isArray(owner.bench)) owner.bench = [];
      if (origSlot && !owner.team[origSlot]) {
        owner.team[origSlot] = card;
      } else {
        owner.bench.push(card);
      }
    }
  }

  // Re-optimize lineup for all players now that suspensions are cleared
  for (const p of g.players) autoSelectLineup(p);
  // Clear any pending manual swap selection (week boundary)
  state.selectedBenchCard = null;
  refreshTopbar(); refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  assertNoDuplicates();
}


// ============================================================
// 8. MATCH LOGIC
// ============================================================

// ────────────────────────────────────────────────────────────────
//  8b. CUP / SUPERCUP / CL
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
    <div class="stage-h">${T('cup_h')} · ${T('week')} ${boardWeekDisplay(g)}</div>
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
    try {
      const cupSemiWinner = (winner === m.home.p) ? m.home.p : m.away.p;
      cupSemiWinner.money += CUP_WIN_BANK;
      cupSemiWinner.totalEarned += CUP_WIN_BANK;
      logEntry(`${T('week_event_cup')} → ${escapeHTML(cupSemiWinner.name)} +${fmtMoney(CUP_WIN_BANK)}' (Bank)`, 'tournament');
    } catch (err) {
      console.error('[VV] Cup semi payout crashed:', err);
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
  try {
    winner.money += CUP_WIN_BANK;
    winner.totalEarned += CUP_WIN_BANK;
    winner.vp += 2; animateVpChange(winner, 2);
    loser.vp += 1; animateVpChange(loser, 1);
    logEntry(`<b>${T('week_event_cupfinal')}</b> → ${escapeHTML(winner.name)} +2 VP +${fmtMoney(CUP_WIN_BANK)}' (Bank) · ${escapeHTML(loser.name)} +1 VP`, 'tournament');
  } catch (err) {
    console.error('[VV] Cup final payout crashed:', err);
  }
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
    <div class="stage-h">${T('week_event_supercup')} · ${T('week')} ${boardWeekDisplay(g)}</div>
    <div class="stage-sub">${escapeHTML(home.name)} vs ${escapeHTML(away.name)} · ${state.lang==='de'?'(Saison 1: gewählt nach Teamstärke)':'(Season 1: chosen by team strength)'}</div>`;
  const winner = await runMatchClassic(home, away, true);
  try {
    winner.money += CUP_WIN_BANK; winner.totalEarned += CUP_WIN_BANK;
    logEntry(`${T('week_event_supercup')} → ${escapeHTML(winner.name)} +${fmtMoney(CUP_WIN_BANK)}' (Bank)`, 'tournament');
  } catch (err) {
    console.error('[VV] SuperCup payout crashed:', err);
  }
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
//  8a. CLASSIC MATCH — 12 criteria (rule-faithful)
//  Used for Liga matches and all tournament resolutions.
// ────────────────────────────────────────────────────────────────
async function runMatchClassic(home, away, isTournament) {
  // Only swap the board for the human's match — bot vs bot would wrongly call showOpponentBoard(home).
  const me = state.game.players.find(p => p.isHuman) || state.game.players[0];
  if (home === me || away === me) {
    const opp = home === me ? away : home;
    showOpponentBoard(opp);
  }
  const stage = $('#stage');
  const actions = $('#actions');
  // Match state
  const M = {
    home, away,
    homePoints: 0, awayPoints: 0,
    crunchExtra: 0,
    rolls: [], events: [],
    rotationHome: courtRotationNorm(home.courtRotation),
    rotationAway: courtRotationNorm(away.courtRotation),
    iRoll: 0, totalRolls: 4,
    ended: false,
  };
  // Stale pendings from cone/market would make waitFor('serveOnce') resolve instantly each rally.
  delete _pendingFires['serveOnce'];
  delete _pendingFires['continueAfterMatch'];
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
    setActionsHtml(`<h3>${T('phase_match')} · ${rollLabel}</h3>${speedToggleHtml()}`);
  }
  setActionUI(); paint();
  refreshMatchSidePanels(M);

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
      // No autoMs: each criterion waits for your click (15s safety in waitFor still prevents deadlocks).
      // speedMs(3500) here used to auto-fire — felt like the game "played itself", esp. on fast speed.
      _expectedAdvance = 'serveOnce';
      await waitFor('serveOnce', 0);
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
    // rotation: winning team rotates — persist on players so team panel / next match match the mini court
    if (result.winner === 'home') {
      M.rotationHome = (M.rotationHome + 1) % 6;
      home.courtRotation = M.rotationHome;
    } else if (result.winner === 'away') {
      M.rotationAway = (M.rotationAway + 1) % 6;
      away.courtRotation = M.rotationAway;
    }
    M.iRoll++;
    paint(); setActionUI();
    refreshTopbar();
    refreshMatchSidePanels(M);
    beep(result.winner === 'home' ? 740 : result.winner === 'away' ? 480 : 540, 60);
  }

  // Determine winner; for tournament ties use coin flip, league ties return null (draw)
  let winner;
  const tied = M.homePoints === M.awayPoints;
  if (M.homePoints > M.awayPoints) winner = home;
  else if (M.awayPoints > M.homePoints) winner = away;
  else winner = isTournament ? (Math.random() < 0.5 ? home : away) : null; // draw in league

  // Show summary
  await showMatchSummary(M, winner, { forceAutoContinue: !!isTournament });
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
      : T('rally_even')
    ).replace('%team%', escapeHTML(team === 'home' ? home.name : away.name))
     .replace('%player%', randomPlayerName(team === 'home' ? home : away));
  }

  const de = lang === 'de';
  // detail: filled per-case with the numeric comparison shown in the banner
  let detail = '';

  switch (dice) {
    case 1:  kind='total';  winner = homeStr > awayStr ? 'home' : homeStr < awayStr ? 'away' : 'tie';
      detail = `${escapeHTML(home.name)} ${homeStr}★ vs ${escapeHTML(away.name)} ${awayStr}★`;
      break;
    case 2:  kind='front';  winner = homeFront > awayFront ? 'home' : homeFront < awayFront ? 'away' : 'tie';
      detail = `${escapeHTML(home.name)} ${homeFront}★ vs ${escapeHTML(away.name)} ${awayFront}★`;
      break;
    case 3:  kind='back';   winner = homeBack > awayBack ? 'home' : homeBack < awayBack ? 'away' : 'tie';
      detail = `${escapeHTML(home.name)} ${Math.round(homeBack*10)/10}★ vs ${escapeHTML(away.name)} ${Math.round(awayBack*10)/10}★`;
      break;
    case 4: { kind='dice'; const r1 = roll(12), r2 = roll(12); winner = r1 > r2 ? 'home' : r1 < r2 ? 'away' : 'tie';
      detail = `${escapeHTML(home.name)} ${de?'würfelt':'rolls'} ${r1} — ${escapeHTML(away.name)} ${de?'würfelt':'rolls'} ${r2}`;
      break; }
    case 5:  kind='middle'; { const a = home.team.middle?.stars||0, b = away.team.middle?.stars||0; winner = a > b ? 'home' : a < b ? 'away' : 'tie';
      detail = `${de?'Mittelblocker':'Middle blocker'}: ${escapeHTML(home.name)} ${a}★ vs ${escapeHTML(away.name)} ${b}★`;
      break; }
    case 6:  kind='service'; {
      const homeServer = home.team.diagonal?.stars||0;
      const awayLibero = away.team.libero?.stars||0;
      winner = homeServer > awayLibero ? 'home' : homeServer < awayLibero ? 'away' : 'tie';
      detail = `${de?'Diagonal':'Diagonal'} ${escapeHTML(home.name)} ${homeServer}★ vs ${de?'Libero':'Libero'} ${escapeHTML(away.name)} ${awayLibero}★`;
      break;
    }
    case 7:  kind='dia_set'; {
      const a = (home.team.diagonal?.stars||0) + (home.team.setter?.stars||0);
      const b = (away.team.diagonal?.stars||0) + (away.team.setter?.stars||0);
      winner = a > b ? 'home' : a < b ? 'away' : 'tie';
      detail = `${escapeHTML(home.name)} ${a}★ vs ${escapeHTML(away.name)} ${b}★ (Dia+${de?'Set':'Set'})`;
      break;
    }
    case 8:  kind='out_dia'; {
      const a = home.team.outside?.stars||0;
      const b = away.team.diagonal?.stars||0;
      winner = a > b ? 'home' : a < b ? 'away' : 'tie';
      detail = `${de?'Außen':'Outside'} ${escapeHTML(home.name)} ${a}★ vs ${de?'Diagonal':'Diagonal'} ${escapeHTML(away.name)} ${b}★`;
      break;
    }
    case 9:  kind='block';  {
      const r = roll(12);
      if (r > homeBlock) winner = 'away';
      else if (r < homeBlock) winner = 'home';
      else winner = 'tie';
      M._blockRoll = r; M._blockTarget = homeBlock;
      break;
    }
    case 10: kind='crunch'; {
      M.crunchExtra += 2;
      winner = 'tie';
      break;
    }
    case 11: kind='injury'; {
      const r = roll(12);
      const team = r <= 6 ? home : away;
      const pos = diePositionFor(((r - 1) % 6) + 1);
      const sub = disablePlayerOnTeam(team, pos, T('cone_event_injury'));
      M._injuryWho = team; M._injuryPos = pos; M._injurySub = sub;
      winner = 'tie';
      break;
    }
    case 12: kind='money'; {
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
    text = `${de?'Auswärts wirft':'Away rolls'} ${r} vs ${de?'Block':'block'} ${t} → ${winner==='away'?T('block_overshot'):winner==='home'?T('block_holds'):(de?'Unentschieden':'Tie')}`;
  }
  else text = detail;
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
  const humanPlaying = state.game && state.game.players.some(p => p.isHuman);
  _matchCritTimeout = setTimeout(() => {
    if (banner) banner.classList.remove('show');
  }, humanPlaying ? 5000 : 3000);
}

async function showMatchSummary(M, winner, opts = {}) {
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
  const me = state.game ? (state.game.players.find(p => p.isHuman) || state.game.players[0]) : null;
  const humanInMatch = me && (M.home === me || M.away === me);
  const forceAutoContinue = !!opts.forceAutoContinue;

  // Bot-vs-bot summaries must never depend on waiter/click flows.
  if (!humanInMatch) {
    await sleep(speedMs(1800));
    restoreBoardPanel();
    refreshTeamPanel();
    return;
  }

  // Auto-continue only when: explicit auto-speed, OR forced (e.g. tournament) but human is NOT playing
  const shouldAutoContinue = (state.speed === 'auto') || (forceAutoContinue && !humanInMatch);
  const autoMs = shouldAutoContinue ? speedMs(4500) : 0;
  _expectedAdvance = 'continueAfterMatch';
  // Button always in actions panel — never buried in the stage scroll area
  setActionsHtml(`<h3>${T('phase_match')}</h3>${speedToggleHtml()}`);
  // Dice-panel button acts as backup "Continue" trigger during match summary
  const matchDpBtn = document.getElementById('dice-panel-btn');
  if (humanInMatch && state.speed !== 'auto' && matchDpBtn) {
    matchDpBtn.disabled = false; matchDpBtn.classList.add('pulse');
    matchDpBtn.textContent = '▶ ' + T('next_match');
  }
  if (shouldAutoContinue) setTimeout(() => fire('continueAfterMatch'), speedMs(2500));
  await waitFor('continueAfterMatch', autoMs);
  if (matchDpBtn) { matchDpBtn.disabled = true; matchDpBtn.classList.remove('pulse'); matchDpBtn.textContent = '🎲 Würfeln'; }
  restoreBoardPanel();
  refreshTeamPanel();
}

// Mini court diagram (6 positions in a 3×2 grid representing front + back rows)
function courtMiniHtml(player, rotation) {
  const rot = courtRotationNorm(rotation);
  const swapTip = state.lang === 'de'
    ? 'Libero ersetzt MB in der Hinterreihe'
    : 'Libero subs in for MB in back row';

  function cell(slotIdx, kInRow, isBackRow) {
    const raw = courtSlotRawPos(rot, slotIdx);
    let pos = courtSlotDisplayPos(rot, slotIdx);
    const isSwap = isBackRow && pos === 'libero' && (raw === 'middle' || raw === 'middle2');

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
  const me = g.players.find(p => p.isHuman) || g.players[0];
  const opp = g.players.filter(p => p !== me).sort((a,b)=>teamStrength(b)-teamStrength(a))[0];
  const home = me; const away = opp;
  showOpponentBoard(away);
  const winner = await runMatchClassic(home, away, false);
  restoreBoardPanel();
  refreshTeamPanel();
  // Award league points and money per rulebook
  if (winner === null) {
    // Draw: both sides +MATCH_DRAW_BONUS from bank, both +1 LP; no transfer between players
    home.money += MATCH_DRAW_BONUS; home.totalEarned += MATCH_DRAW_BONUS; animateMoneyChange(home, MATCH_DRAW_BONUS);
    away.money += MATCH_DRAW_BONUS; away.totalEarned += MATCH_DRAW_BONUS; animateMoneyChange(away, MATCH_DRAW_BONUS);
    home.leaguePoints = leaguePointsVal(home) + MATCH_DRAW_LP;
    away.leaguePoints = leaguePointsVal(away) + MATCH_DRAW_LP;
    logEntry(`🏐 ${T('phase_match')}: 🤝 ${state.lang==='de'?'Unentschieden':'Draw'} — ${escapeHTML(home.name)} & ${escapeHTML(away.name)} je +${fmtMoney(MATCH_DRAW_BONUS)}'`);
  } else {
    try {
      const w = winner; const l = (winner === home) ? away : home;
      // Winner: +LIGA_WIN_BANK from the bank
      w.money += LIGA_WIN_BANK; w.totalEarned += LIGA_WIN_BANK; animateMoneyChange(w, LIGA_WIN_BANK);
      // Winner: +LIGA_WIN_FROM_LOSER transferred from loser (loser floor = 0)
      const fromLoser = Math.min(LIGA_WIN_FROM_LOSER, l.money);
      l.money = Math.max(0, l.money - LIGA_WIN_FROM_LOSER); animateMoneyChange(l, -fromLoser);
      w.money += fromLoser; w.totalEarned += fromLoser; animateMoneyChange(w, fromLoser);
      w.matchesWon++; w.leaguePoints = leaguePointsVal(w) + MATCH_WIN_LP;
      logEntry(`🏐 ${T('phase_match')}: <b>${escapeHTML(w.name)}</b> +${fmtMoney(LIGA_WIN_BANK)}' (Bank), +${fmtMoney(fromLoser)}' (${escapeHTML(l.name)})`, winner === home ? 'win' : 'loss');
    } catch (err) {
      console.error('[VV] Liga win payout crashed:', err);
    }
  }
    // Other players: bye → +5'000
  for (const p of g.players) {
    if (p !== home && p !== away) {
      p.money += MATCH_DRAW_BONUS; p.totalEarned += MATCH_DRAW_BONUS; animateMoneyChange(p, MATCH_DRAW_BONUS);
      logEntry(`🏐 ${T('week_event_league')} ${state.lang==='de'?'Freilos':'Bye'} → ${escapeHTML(p.name)} +5’`);
    }
  }
  refreshTopbar();
  if (checkWin()) return;
}


// ============================================================
// 9. AUCTION & MARKET
// ============================================================
function regenMarket() {
  // Market only shows unsold auction cards (from marketPile) + 1-star section (always-available)
  // No random cards from the full deck — only what actually went through auction and wasn't bought
  return state.game.marketPile.slice();
}

// Shared multi-round popup auction used both for weekly market reveal and mid-week transfer events.
// firstPlayer: if set, they bid first (for the transfer event — the player who triggered it).
async function runAuctionUI(card, titleLabel, firstPlayer) {
  try {
  const g = state.game;
  const de = state.lang === 'de';
  const minBid = cardBasePrice(card);
  // Order: firstPlayer goes first, rest follow in player-index order
  let order = g.players.slice();
  if (firstPlayer) {
    while (order[0] !== firstPlayer) order.push(order.shift());
  }
  let currentBid = 0, winner = null;
  const popId = 'live-auction-popup';
  const renderPopup = (feedLines) => {
    showTeamSidebar(card);
    const feedHtml = feedLines.map(l => `<div style="font-size:0.78rem;color:var(--silver);margin-top:0.2rem;">${l}</div>`).join('');
    const body = `
      <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:0.8rem;">
        <div style="width:90px;flex-shrink:0;border-radius:6px;overflow:hidden;border:2px solid var(--gold);">
          <img src="${card.url}" style="width:100%;display:block;" alt="">
        </div>
        <div>
          <div style="font-weight:700;font-size:1rem;">${escapeHTML(card.name)}</div>
          <div style="color:var(--silver);font-size:0.78rem;">${'★'.repeat(card.stars || 1)} · ${posLabel(card.pos)}</div>
          <div style="margin-top:0.5rem;font-size:0.82rem;">${de?'Mindestgebot':'Min. bid'}: <b style="color:var(--gold)">${fmtMoney(minBid)}</b></div>
          <div class="wa-bid-line" style="font-size:0.82rem;">${de?'Aktuelles Gebot':'Current bid'}: <b style="color:var(--gold)">${currentBid ? fmtMoney(currentBid) : '—'}</b>${winner ? ` <span style="color:var(--silver)">(${escapeHTML(winner.name)})</span>` : ''}</div>
        </div>
      </div>
      <div id="wa-feed" style="max-height:100px;overflow:auto;margin-bottom:0.6rem;">${feedHtml}</div>
      <div id="wa-input"></div>`;
    openGamePopup(popId, titleLabel, body);
  };
  const feedLines = [];
  const addFeed = (line) => {
    feedLines.push(line);
    const feed = document.getElementById('wa-feed');
    if (feed) feed.innerHTML = feedLines.map(l => `<div style="font-size:0.78rem;color:var(--silver);margin-top:0.2rem;">${l}</div>`).join('');
  };
  renderPopup([]);

  // Multi-round bidding: everyone bids/passes; continues until only one unbid player remains
  let passes = new Set();
  let lastBidder = null;
  // Pre-pass any auctionBanned player so they sit out this entire auction
  for (const p of order) {
    if (p.auctionBanned) {
      passes.add(p.id);
      addFeed(`🚫 ${p.emoji} ${escapeHTML(p.name)} — ${de ? 'Transfersperre' : 'Transfer ban'}`);
    }
  }
  while (true) {
    let bidThisRound = false;
    for (const p of order) {
      if (passes.has(p.id)) continue;
      if (lastBidder === p.id && order.filter(x => !passes.has(x.id)).length <= 1) break;
      const minNext = currentBid > 0 ? currentBid + 1000 : minBid;
      if (p.money < minNext) { passes.add(p.id); continue; }
      await mpHostPublishSequentialTurn(p, 'liveAuction');
      if (p.isHuman) {
        renderPopup(feedLines);
        // Wait for DOM to settle after openGamePopup's requestAnimationFrame
        await sleep(80);
        const result = await new Promise(resolve => {
          let settled = false;
          const finish = (val) => { if (settled) return; settled = true; resolve(val); };
          // Close button / backdrop = pass
          registerPopupClose(popId, () => finish({ pass: true }));
          const inputDiv = document.getElementById('wa-input');
          if (!inputDiv) { finish({ pass: true }); return; }
          const sugg = Math.min(p.money, minNext);
          inputDiv.innerHTML = `
            <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-top:0.3rem;">
              <span style="font-size:0.82rem;">${de?'Dein Gebot':'Your bid'} (min ${fmtMoney(minNext)}):</span>
              <input type="number" id="wa-bid-inp" min="${minNext}" max="${p.money}" step="1000" value="${sugg}"
                style="width:110px;padding:0.3rem 0.5rem;background:#111;border:1px solid var(--line);color:#fff;border-radius:4px;font-size:0.88rem;">
              <button class="btn btn-primary" id="wa-bid-btn">${de?'Bieten':'Bid'}</button>
              <button class="btn btn-secondary" id="wa-pass-btn">${de?'Passen':'Pass'}</button>
            </div>`;
          const go = () => {
            const v = parseInt(document.getElementById('wa-bid-inp')?.value || '0', 10);
            if (!Number.isFinite(v) || v < minNext) { toast(de?'Gebot zu niedrig':'Bid too low','bad'); return; }
            if (v > p.money) { toast(de?'Nicht genug Geld':'Not enough money','bad'); return; }
            finish({ bid: v });
          };
          const bidBtn = document.getElementById('wa-bid-btn');
          const passBtn = document.getElementById('wa-pass-btn');
          const inp = document.getElementById('wa-bid-inp');
          if (!bidBtn) {
            console.error('[VV] runAuctionUI: wa-bid-btn not found after sleep(80)! inputDiv =', inputDiv);
            toast('⚠️ Auktions-UI Fehler — auto-pass', 'bad', 2000);
            finish({ pass: true }); return;
          }
          bidBtn.onclick = go;
          if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key === 'Enter') go(); }; }
          if (passBtn) passBtn.onclick = () => finish({ pass: true });
        });
        if (result.pass) {
          passes.add(p.id);
          addFeed(`${p.emoji} ${escapeHTML(p.name)} → ${de?'Passt':'Pass'}`);
        } else {
          currentBid = result.bid; winner = p; lastBidder = p.id; bidThisRound = true;
          addFeed(`<b>${p.emoji} ${escapeHTML(p.name)}</b> → ${fmtMoney(currentBid)}`);
          beep(820, 50);
        }
      } else if (mpSeatIsRemoteHumanOnHost(p)) {
        renderPopup(feedLines);
        await sleep(80);
        const result = await humanLiveAuctionBidRemote(p, card, minNext);
        if (result.pass) {
          passes.add(p.id);
          addFeed(`${p.emoji} ${escapeHTML(p.name)} → ${de?'Passt':'Pass'}`);
        } else {
          currentBid = result.bid; winner = p; lastBidder = p.id; bidThisRound = true;
          addFeed(`<b>${p.emoji} ${escapeHTML(p.name)}</b> → ${fmtMoney(currentBid)}`);
          beep(820, 50);
          const bidLine = document.querySelector(`#${popId}-body .wa-bid-line`);
          if (bidLine) bidLine.innerHTML = `${de?'Aktuelles Gebot':'Current bid'}: <b style="color:var(--gold)">${fmtMoney(currentBid)}</b> <span style="color:var(--silver)">(${escapeHTML(winner.name)})</span>`;
        }
      } else {
        await sleep(speedMs(400));
        const dec = window.VV_BOTS.shouldBid(p, card, currentBid, minNext, order);
        if (!dec || dec.pass || dec.bid < minNext || dec.bid > p.money) {
          passes.add(p.id);
          addFeed(`${p.emoji} ${escapeHTML(p.name)} → ${de?'Passt':'Pass'}`);
        } else {
          currentBid = dec.bid; winner = p; lastBidder = p.id; bidThisRound = true;
          addFeed(`<b>${p.emoji} ${escapeHTML(p.name)}</b> → ${fmtMoney(currentBid)}`);
          beep(740, 50);
          // Update the current-bid display in-place (don't rebuild the whole popup)
          const bidLine = document.querySelector(`#${popId}-body .wa-bid-line`);
          if (bidLine) bidLine.innerHTML = `${de?'Aktuelles Gebot':'Current bid'}: <b style="color:var(--gold)">${fmtMoney(currentBid)}</b> <span style="color:var(--silver)">(${escapeHTML(winner.name)})</span>`;
          showTeamSidebar(card);
        }
      }
      if (order.filter(x => !passes.has(x.id)).length <= 1) break;
    }
    const remaining = order.filter(x => !passes.has(x.id));
    if (!bidThisRound || remaining.length <= 1) break;
  }

  // Resolve
  if (winner) {
    winner.money -= currentBid;
    animateMoneyChange(winner, -currentBid);
    placeIntoTeamOrBench(winner, card);
    autoSelectLineup(winner);
    addFeed(`<b style="color:var(--gold)">🏆 ${escapeHTML(winner.name)} ${de?'gewinnt':'wins'} "${escapeHTML(card.name)}" ${de?'für':'for'} ${fmtMoney(currentBid)}!</b>`);
    beep(900, 120);
  } else {
    g.marketPile.push(card);
    addFeed(`<span style="color:var(--silver)">${de?'Niemand geboten — Karte kommt auf den Markt.':'No bids — card goes to market.'}</span>`);
  }
  refreshTopbar(); refreshTeamPanel();
  showTeamSidebar(card);
  // Wait for user to manually close the popup (click OK or ✕)
  await new Promise(resolve => {
    // Add an OK button to the feed area
    const feed = document.getElementById('wa-feed');
    if (feed) {
      const okBtn = document.createElement('button');
      okBtn.className = 'btn btn-primary';
      okBtn.style.cssText = 'margin-top:0.8rem;width:100%;';
      okBtn.textContent = de ? '✓ OK' : '✓ OK';
      okBtn.onclick = () => { closeGamePopup(popId); resolve(); };
      feed.appendChild(okBtn);
    }
    registerPopupClose(popId, () => resolve());
  });
  await sleep(200);
  assertNoDuplicates();
  } finally {
    hideTeamSidebar();
  }
}

async function runWeeklyAuction() {
  const card = drawAuctionCard();
  if (!card) { hideTeamSidebar(); return; }
  const de = state.lang === 'de';
  await runAuctionUI(card, `🔖 ${de ? 'Wöchentliche Auktion' : 'Weekly Auction'}`);
}

// Run forced-sale auctions triggered by the Transfergerücht action card.
async function runForcedSaleAuctions() {
  const g = state.game;
  const de = state.lang === 'de';
  for (const p of g.players) {
    // Collect all forcedSale cards from team + bench
    const forced = [];
    for (const pos of POSITIONS) {
      const c = p.team[pos];
      if (c && c.forcedSale) { forced.push({ source: 'team', slot: pos, card: c }); }
    }
    for (const c of (p.bench || [])) {
      if (c && c.forcedSale) { forced.push({ source: 'bench', slot: null, card: c }); }
    }
    for (const entry of forced) {
      const card = entry.card;
      card.forcedSale = false;
      // Remove from owner
      if (entry.source === 'team') p.team[entry.slot] = null;
      else p.bench = p.bench.filter(c => c !== card);
      refreshTeamPanel();
      toast(`📰 ${de ? 'Pflichtverkauf' : 'Forced Sale'}: ${escapeHTML(card.name)}`, 'bad', 2000);
      await runAuctionUI(card, `📰 ${de ? 'Pflichtverkauf' : 'Forced Sale'} — ${escapeHTML(card.name)}`);
    }
  }
  assertNoDuplicates();
}

async function runMarketPhase() {
  const g = state.game;
  hideTeamSidebar();
  // Clear ALL stale fires and waiters — a tournament/match in the same week can leave
  // pendingFires that would instantly resolve the market's waitFor
  ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(k => {
    delete _pendingFires[k];
    delete _waiters[k];
  });
  _expectedAdvance = 'endMarket';
  // Weekly auction: reveal one card from the deck before opening the market
  await runWeeklyAuction();
  // Forced sales from Transfergerücht action card (happen after weekly auction)
  await runForcedSaleAuctions();
  // Clear auction bans — they applied to the weekly auction above
  for (const p of g.players) p.auctionBanned = false;
  g.market = regenMarket();
  const safeRenderMarket = () => {
    try {
      renderMarket();
    } catch (err) {
      console.error('[VV] renderMarket crashed:', err);
      setActionsHtml(`<h3>${T('phase_buy')}</h3>${speedToggleHtml()}
        <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>`);
      toast(`⚠️ Markt-Fehler: ${err.message || err} — Schliessen-Button verfügbar`, 'bad', 5000);
    }
  };
  safeRenderMarket();
  // Bots act first, then human's turn (to give clear "your turn" feel)
  for (const bot of g.players.filter(p => !p.isHuman)) {
    try {
      await sleep(speedMs(200)); // bot market buy thinking delay
      const pick = window.VV_BOTS.pickMarketBuy(bot, g.market);
      if (pick) {
        removeCardFromPools(pick);
        const cur = bot.team[pick.pos];
        bot.team[pick.pos] = pick;
        if (cur) bot.bench.push(cur);
        autoSelectLineup(bot);
        bot.money -= pick.price;
        g.market = g.market.filter(c => c.id !== pick.id);
        g.marketPile = (g.marketPile || []).filter(c => c.id !== pick.id);
        logEntry(fmt(T('bot_buys'), `${bot.emoji} ${escapeHTML(bot.name)}`, T('pos_'+pick.pos), pick.stars, fmtMoney(pick.price)), 'tournament');
      } else {
        logEntry(fmt(T('bot_skips'), `${bot.emoji} ${escapeHTML(bot.name)}`));
      }
    } catch (err) {
      console.error('[VV] bot market step crashed:', err);
      logEntry(`⚠️ ${escapeHTML(bot.name)} ${state.lang==='de'?'Marktfehler — übersprungen':'market error — skipped'}`);
    }
    refreshTopbar();
    safeRenderMarket();
  }
  safeRenderMarket();
  assertNoDuplicates();
  const marketAutoCloseMs = state.speed === 'auto' ? speedMs(800) : 0; // 0 = no auto-close; human must click
  if (marketAutoCloseMs > 0) setTimeout(() => { if (_waiters['endMarket']) endMarket(); }, marketAutoCloseMs);
  await waitFor('endMarket', marketAutoCloseMs || undefined);
  hideTeamSidebar();
}

// ────────────────────────────────────────────────────────────────
//  9b. WEEKEND MATCHES (Liga) + MARKET UI
// ────────────────────────────────────────────────────────────────
const WEEKEND_SCHEDULE_FALLBACK = [
  [[0, 1], [2, 3]],
  [[0, 2], [3, 1]],
  [[0, 3], [1, 2]],
  [[0, 1], [2, 3]],
  [[0, 2], [3, 1]],
  [[0, 3], [1, 2]],
];

function buildWeekendPairings(g, week) {
  const humanIdx = g.players.findIndex(p => p.isHuman);
  const botIdx = g.players.map((p, i) => (p.isHuman ? -1 : i)).filter(i => i >= 0);
  if (humanIdx >= 0 && botIdx.length >= 1) {
    // Match 1: human vs rotating bot
    const r = ((week - 1) % botIdx.length + botIdx.length) % botIdx.length;
    const oppIdx = botIdx[r];
    const restBots = botIdx.filter(i => i !== oppIdx);
    const pairings = [];
    if (g.players[humanIdx] && g.players[oppIdx]) {
      pairings.push([g.players[humanIdx], g.players[oppIdx]]);
    }
    // Match 2: remaining bots play each other (bot vs bot, human watches)
    if (restBots.length >= 2 && g.players[restBots[0]] && g.players[restBots[1]]) {
      pairings.push([g.players[restBots[0]], g.players[restBots[1]]]);
    }
    return pairings;
  }
  // No human player found -> no weekend fixture in this mode.
  return [];
}

async function runWeekendMatches(week) {
  const g = state.game;
  // Clear ALL stale fires before weekend — tournament matches earlier in the week
  // (Cup, CL, etc.) can leave pendingFires that would skip the first waitFor instantly
  ['coneRollNow','coneContinue','continueAfterMatch','serveOnce','endMarket'].forEach(k => {
    delete _pendingFires[k];
    delete _waiters[k];
  });
  _expectedAdvance = 'continueAfterMatch';
  const pairings = buildWeekendPairings(g, week);
  if (!pairings.length) return;

  for (let mi = 0; mi < pairings.length; mi++) {
    const [home, away] = pairings[mi];
    if (!home || !away) continue;

    const isHumanMatch = !!(home.isHuman || away.isHuman);
    const matchLabel = mi === 0 ? T('weekend_match1') : T('weekend_match2');

    if (isHumanMatch) {
      const opp = home.isHuman ? away : home;
      showOpponentBoard(opp);
    }

    const stage = $('#stage');
    if (stage) {
      stage.innerHTML = `
        <div class="stage-h">🏅 ${T('weekend_match')} · ${T('week')} ${week} · ${matchLabel}</div>
        <div class="stage-sub">${escapeHTML(home.name)} vs ${escapeHTML(away.name)}</div>`;
    }

    const winner = await runMatchClassic(home, away, true);
    if (winner) {
      winner.money += 3000;
      winner.totalEarned += 3000;
      animateMoneyChange(winner, 3000);
      winner.matchesWon = (winner.matchesWon || 0) + 1;
      winner.leaguePoints = leaguePointsVal(winner) + 3;
      const loser = winner === home ? away : home;
      logEntry(`🏅 ${T('weekend_match')} W${week} ${matchLabel}: <b>${escapeHTML(winner.name)}</b> +3' · +3 LP · ${escapeHTML(loser.name)}`, 'tournament');
    } else {
      home.leaguePoints = leaguePointsVal(home) + 1;
      away.leaguePoints = leaguePointsVal(away) + 1;
      logEntry(`🏅 ${T('weekend_match')} W${week} ${matchLabel}: 🤝 ${escapeHTML(home.name)} — ${escapeHTML(away.name)}`);
    }

    // Always restore the map after each fixture — bot–bot used to leave the opp-team board stuck
    // (first weekend felt broken because match 2 follows your match with no other full refresh).
    restoreBoardPanel();
    refreshTeamPanel();
    refreshTopbar();
    if (checkWin()) return;
  }
}

function marketBodyHtml(me, weakPos) {
  const de = state.lang === 'de';
  const unsoldCards = (state.game.market || []).filter(Boolean); // already filtered unsold auction cards
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
    ${me.bench.filter(Boolean).length ? `<div class="gp-section-h" style="margin-top:0.8rem;">${de?'Meine Bank':'My Bench'}</div><div class="bench-grid">${me.bench.filter(Boolean).map(c => benchCardHtml(c, me)).join('')}</div>` : ''}
    <div class="gp-footer">
      <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>
    </div>`;
}

function renderMarket() {
  if (!state.game) return;
  const me = state.game.players[0];
  if (!me) return;
  // Ensure bench has no nulls (safety after injury/emergency-buy flows)
  if (Array.isArray(me.bench)) me.bench = me.bench.filter(Boolean);
  if (!Array.isArray(me.bench)) me.bench = [];
  if (!Array.isArray(state.game.market)) state.game.market = [];
  const weakPos = weakestPosition(me);
  const title = state.lang === 'de' ? 'MARKT' : 'MARKET';
  const body = marketBodyHtml(me, weakPos);
  const existing = document.getElementById('market-popup');
  const marketWasAlreadyOpen = !!(existing && existing.classList.contains('open'));
  if (marketWasAlreadyOpen) {
    updateGamePopupBody('market-popup', body);
  } else {
    registerPopupClose('market-popup', () => { if (_waiters['endMarket']) endMarket(); });
    openGamePopup('market-popup', title, body);
  }
  setActionsHtml(`<h3>${T('phase_buy')}</h3>${speedToggleHtml()}
    <button class="action-btn pulse" onclick="VV.endMarket()">${T('finish_buying')}</button>`);
  _setMarketBtnActive(true);
  const syncMarketSidebar = () => {
    showTeamSidebar(null);
    wireMarketSidebarHover();
  };
  if (marketWasAlreadyOpen) {
    syncMarketSidebar();
  } else {
    // After openGamePopup’s rAF adds .open, lift MY SQUAD above the dimmer so it pops in with the market.
    requestAnimationFrame(() => requestAnimationFrame(syncMarketSidebar));
  }
}

function oneStarMarketHtml(me, weakPos) {
  return POSITIONS.map(pos => {
    const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
    const owned = ownedCardIds();
    const c = (ALL_CARDS || []).find(x => x && x.stars === 1 && x.pos === poolPos && !owned.has(x.id)) || null;
    if (!c) return '';
    const canAfford = me.money >= PRICE_PER_STAR;
    const suggested = pos === weakPos;
    return `<div class="mc ${canAfford?'':'poor'} ${suggested?'suggested':''}" data-card-id="${escapeHTML(c.id)}" data-tip="1★ ${posLabel(pos)} · 10’000 · ${escapeHTML(cardImageBasename(c))}">
      <div class="card-thumb">
        <img class="mc-img" src="${c.url}" alt="${escapeHTML(c.name)}" loading="lazy">
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="mc-pos" style="background:${posColor(pos)}">${posShort(pos)}</span>
        <span class="mc-stars">★</span>
      </div>
      <div class="mc-price">${fmtMoney(PRICE_PER_STAR)}</div>
      <button class="mc-buy" onclick="VV.buyOneStar('${pos}')" ${canAfford?'':'disabled'}>${canAfford?T('market_buy'):T('market_sold')}</button>
    </div>`;
  }).join('');
}

function benchCardHtml(c, me) {
  if (!c) return '';
  const sellPrice = Math.floor(cardBasePrice(c) / 2);
  return `<div class="bc">
    <div class="card-thumb">
      <img src="${c.url}" alt="${escapeHTML(c.name)}" class="bc-img" loading="lazy">
    </div>
    <div class="bc-meta">
      <span class="mc-pos" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <span class="mc-stars">${'★'.repeat(c.stars)}</span>
    </div>
    <button class="bc-sell" onclick="VV.sellBenchCard('${c.id}')" data-tip="${T('market_sell_t')}">💰 ${T('market_sell')} ${fmtMoney(sellPrice)}’</button>
  </div>`;
}

function buyOneStar(pos) {
  const me = state.game.players[0];
  if (me.money < PRICE_PER_STAR) { toast(state.lang==='de'?'Zu teuer':'Too expensive', 'bad'); return; }
  const poolPos = { outside2: 'outside', middle2: 'middle' }[pos] || pos;
  const c = pickUnowned1Star(poolPos);
  if (!c) return;
  removeCardFromPools(c);
  const cur = me.team[pos];
  if (cur) me.bench.push(cur); // always move existing card to bench
  me.team[pos] = c;
  autoSelectLineup(me);
  me.money -= PRICE_PER_STAR;
  animateMoneyChange(me, -PRICE_PER_STAR);
  toast(state.lang==='de'?`Gekauft: ${c.name}`:`Bought: ${c.name}`, 'good');
  beep(880, 60);
  refreshTopbar(); refreshTeamPanel(); renderMarket(); refreshFloatingPanel();
  logEntry(`💰 ${state.lang==='de'?'Gekauft':'Bought'}: ${c.name} (1★) -${fmtMoney(PRICE_PER_STAR)}'`, 'win');
  assertNoDuplicates();
}

function sellBenchCard(id) {
  const me = state.game.players[0];
  const idx = me.bench.findIndex(c => c.id === id);
  if (idx < 0) return;
  const c = me.bench[idx];
  if (c.disabled) {
    toast(state.lang === 'de' ? '⛔ Gesperrt — Verkauf nicht möglich.' : '⛔ Suspended — cannot sell.', 'bad', 2500);
    return;
  }
  const price = Math.floor(cardBasePrice(c) / 2);
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
  const price = Math.floor(cardBasePrice(c) / 2);
  if (!confirm(state.lang==='de'?`${c.name} für ${fmtMoney(price)}’ verkaufen?`:`Sell ${c.name} for ${fmtMoney(price)}?`)) return;
  // Clear the slot first, then let autoSelectLineup pick the best available bench card
  me.team[pos] = null;
  autoSelectLineup(me);
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
  return `<div class="mc ${canAfford?'':'poor'} ${suggested?'suggested':''}" data-card-id="${escapeHTML(c.id)}" data-tip="${escapeHTML(c.name)} · ${escapeHTML(cardImageBasename(c))}">
    <div class="card-thumb">
      <img class="mc-img" src="${c.url}" alt="${escapeHTML(c.name)}" loading="lazy">
    </div>
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="mc-pos" style="background:${posColor(c.pos)}">${posShort(c.pos)}</span>
      <span class="mc-stars">${'★'.repeat(c.stars)}</span>
    </div>
    <div class="mc-price">${fmtMoney(c.price)}</div>
    <button class="mc-buy" onclick="VV.buyCard('${c.id}')" ${canAfford?'':'disabled'}>${canAfford?T('market_buy'):T('market_sold')}</button>
  </div>`;
}

function buyCard(id) {
  const g = state.game;
  const c = (g.market || []).find(x => x.id === id) || (g.marketPile || []).find(x => x.id === id);
  const me = g.players[0];
  if (!c) return;
  if (me.money < c.price) { toast(state.lang==='de'?'Zu teuer':'Too expensive', 'bad'); return; }
  removeCardFromPools(c);
  const cur = me.team[c.pos];
  if (cur && cur.stars >= c.stars) {
    if (!confirm(state.lang==='de'?'Aktuelle Karte ist gleichstark oder stärker — trotzdem kaufen?':'Current card has equal or higher stars — buy anyway?')) return;
  }
  if (cur) me.bench.push(cur);
  me.team[c.pos] = c;
  autoSelectLineup(me);
  me.money -= c.price;
  // Remove from both market display list and marketPile
  state.game.market = state.game.market.filter(x => x.id !== c.id);
  state.game.marketPile = state.game.marketPile.filter(x => x.id !== c.id);
  toast(state.lang==='de' ? `Gekauft: ${c.name}` : `Bought: ${c.name}`, 'good');
  beep(880, 60);
  refreshTopbar(); refreshTeamPanel();
  renderMarket();
  assertNoDuplicates();
}
function endMarket() {
  closeGamePopup('market-popup');
  _setMarketBtnActive(false);
  hideTeamSidebar();
  const g = state.game;
  if (g) {
    // Unsold market cards stay in marketPile for next week
    g.market = [];
  }
  fire('endMarket');
}
function toggleMarketPopup() {
  const pop = document.getElementById('market-popup');
  if (pop && pop.classList.contains('open')) {
    // Close popup silently — don't fire endMarket, phase stays active
    closeGamePopup('market-popup');
    _setMarketBtnActive(false);
    hideTeamSidebar();
  } else {
    if (state.game) {
      renderMarket();
      _setMarketBtnActive(true);
    }
  }
}
function _setMarketBtnActive(active) {
  const btn = document.getElementById('market-toggle-btn');
  if (btn) btn.classList.toggle('active', active);
}
function weakestPosition(p) {
  let min = POSITIONS[0], minS = Infinity;
  for (const k of POSITIONS) { const s = (p.team[k]&&p.team[k].stars)||0; if (s < minS) { minS = s; min = k; } }
  return min;
}

// ────────────────────────────────────────────────────────────────
//  10b. SEASON END
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
//  10c. END GAME
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

function playAgain() { resetLocalMultiplayerSession(); initSoloGame(); setView('draft'); }
function toMenu() { resetLocalMultiplayerSession(); state.game = null; setView('menu'); }

function speedToggleHtml() { return ''; } // speed buttons removed — clicking them during a match caused render() to rebuild the DOM and lose all waitFor listeners

function continueAfterMatch() { dicePanel_roll(true, 'continueAfterMatch'); }
function serveOnce() { dicePanel_roll(true, 'serveOnce'); }

// ────────────────────────────────────────────────────────────────
//  10d. RENDER DISPATCH
// ────────────────────────────────────────────────────────────────
/** Zentrale Phasen-Zeichnung (Host und Clients identisch, nur Interaktion unterscheidet sich). */
function renderCurrentPhase() {
  switch (state.view) {
    case 'splash': /* HTML default */ break;
    case 'intro':       renderIntro(); break;
    case 'menu':        renderMenu(); break;
    case 'mp_submenu':  renderMpSubmenu(); break;
    case 'mp_join':     /* painted by multiplayer.js */ break;
    case 'mp_lobby':    /* painted by multiplayer.js */ break;
    case 'mp_viewer':   /* painted by multiplayer.js */ break;
    case 'draft':       renderDraft(); break;
    case 'auction':     renderAuction(); break;
    case 'starting':    renderStarting(); break;
    case 'game':        renderGame(); break;
    case 'end':         renderEnd(); break;
  }
}

function render() {
  renderCurrentPhase();
  if (MULTIPLAYER && state.mpRoom && state.mpRoom.isHost && state.game
      && window.VV_MP && typeof window.VV_MP.scheduleGameStateSync === 'function') {
    try { window.VV_MP.scheduleGameStateSync(); } catch (_) {}
  }
}


// ────────────────────────────────────────────────────────────────
//  4d. ANIMATED MONEY / VP / COUNTERS
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
//  4e. FLOATING TEAM PANEL (always visible bottom-right)
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
  state.selectedBenchCard = null; // cancel any pending swap when entering/leaving sell mode
  refreshTeamPanel(); refreshFloatingPanel();
  toast(state.sellMode ? (state.lang==='de'?'Verkaufs-Modus aktiv — klicke auf eine Karte':'Sell mode active — click a card') : (state.lang==='de'?'Verkaufs-Modus aus':'Sell mode off'), state.sellMode?'gold':'good', 1800);
}
function handleFloatingClick(pos) {
  if (state.sellMode) { sellStarter(pos); refreshTeamPanel(); return; }
  // Manual bench-to-field swap: if a bench card is selected, try swapping it into this field slot
  if (state.selectedBenchCard) {
    try {
      const me = state.game && state.game.players[0];
      if (me) {
        const benchCard = (me.bench || []).find(c => c && c.id === state.selectedBenchCard);
        const primaryOf = { outside2: 'outside', middle2: 'middle' };
        const slotBase = primaryOf[pos] || pos;
        // Valid swap: bench card's position matches this slot (primary or secondary)
        const validSlot = benchCard && (benchCard.pos === pos || benchCard.pos === slotBase);
        if (benchCard && validSlot) {
          const fieldCard = me.team[pos];
          me.bench = (me.bench || []).filter(c => c.id !== benchCard.id);
          me.team[pos] = benchCard;
          if (fieldCard) me.bench.push(fieldCard);
          beep(660, 50);
          toast(
            state.lang === 'de'
              ? `${benchCard.name} → Aufstellung`
              : `${benchCard.name} → starting lineup`,
            'good', 1500
          );
        }
        // Clear selection whether swap happened or was cancelled
        state.selectedBenchCard = null;
        refreshTeamPanel();
        if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
      }
    } catch (e) {
      state.selectedBenchCard = null;
      refreshTeamPanel();
    }
  }
}
function handleFloatingBenchClick(id) {
  if (state.sellMode) { sellBenchCard(id); refreshTeamPanel(); return; }
  // Manual swap: toggle selection of this bench card
  try {
    const me = state.game && state.game.players[0];
    if (!me) return;
    const benchCard = (me.bench || []).find(c => c && c.id === id);
    if (!benchCard || benchCard.disabled) return; // can't swap suspended cards
    // Toggle: clicking the already-selected card deselects it
    state.selectedBenchCard = (state.selectedBenchCard === id) ? null : id;
    refreshTeamPanel();
    if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  } catch (e) {
    state.selectedBenchCard = null;
    refreshTeamPanel();
  }
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


// ============================================================
//  PUBLIC API
// ============================================================
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
  toggleFloatingPanel, toggleSellMode, toggleLog, toggleMarketPopup,
  handleFloatingClick, handleFloatingBenchClick,
  exportLog, showFullHistory,
  // ── Multiplayer interop (used by multiplayer.js) ──
  state, toast,
  startMultiplayer, applyRemoteState, resetLocalMultiplayerSession,
  render, renderCurrentPhase,
};

// ────────────────────────────────────────────────────────────────
//  BENCH SWAP: cancel selection on outside click
// ────────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  if (!state.selectedBenchCard) return;
  const insidePanel = e.target.closest('#team-panel') || e.target.closest('.fp') || e.target.closest('.fp-inner');
  if (!insidePanel) {
    state.selectedBenchCard = null;
    refreshTeamPanel();
    if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  }
}, true);

// ────────────────────────────────────────────────────────────────
//  KEYBOARD SHORTCUTS
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
