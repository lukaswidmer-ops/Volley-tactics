'use strict';
const fs = require('fs');
let src = fs.readFileSync('game.js', 'utf8');

function rep(oldStr, newStr) {
  if (!src.includes(oldStr)) {
    // Show context around where it might be
    const firstLine = oldStr.split('\n')[0].trim().slice(0, 60);
    console.error('NOT FOUND: ' + firstLine);
    process.exit(1);
  }
  src = src.split(oldStr).join(newStr);
}

// ════════════════════════════════════════════════════════════════════════════
// 1. showActionPopup universal function (inserted before showActionPopupAsync)
// ════════════════════════════════════════════════════════════════════════════
const SHOW_ACTION_POPUP = `/**
 * Universal blocking action popup with optional card/player highlights.
 * Apply state changes BEFORE calling. Resolves on OK click or timeout.
 *
 * @param {object}   opts
 * @param {string}   opts.title             - Header (may include emoji)
 * @param {string}   opts.description       - Body; literal \\n becomes <br>
 * @param {object[]} [opts.affectedCards]   - Cards highlighted red (suspended etc.)
 * @param {object[]} [opts.positiveCards]   - Cards highlighted green (gained etc.)
 * @param {object[]} [opts.affectedPlayers] - Player panels to glow
 * @param {number}   [opts.autoMs]          - Auto-close ms (default EVENT_POPUP_MS)
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

    const pid = 'upop-' + Date.now();
    const div = document.createElement('div');
    div.className = 'modal-popup';
    div.innerHTML = \`
      <div class="modal-card action-upop">
        <div class="action-upop-title">\${title}</div>
        <hr class="action-upop-divider">
        <div class="action-upop-desc">\${description.replace(/\\\\n/g, '<br>')}</div>
        <div class="action-upop-footer">
          <button class="btn btn-primary" id="\${pid}-ok">OK</button>
          <div class="action-upop-track">
            <div class="action-upop-bar" id="\${pid}-bar"></div>
          </div>
        </div>
      </div>\`;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add('open'), 10);

    const bar = document.getElementById(pid + '-bar');
    if (bar) requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.transition = 'width ' + autoMs + 'ms linear';
      bar.style.width = '0%';
    }));

    let done = false;
    const finish = () => {
      if (done) return; done = true;
      if (document.body.contains(div)) div.remove();
      for (const fn of cleanups) { try { fn(); } catch (_) {} }
      resolve();
    };
    const okBtn = document.getElementById(pid + '-ok');
    if (okBtn) okBtn.addEventListener('click', finish);
    div.addEventListener('click', e => { if (e.target === div) finish(); });
    setTimeout(finish, autoMs);
  });
}

`;
rep(
  'function showActionPopupAsync(icon, title, bodyHtml, autoMs = EVENT_POPUP_MS) {',
  SHOW_ACTION_POPUP + 'function showActionPopupAsync(icon, title, bodyHtml, autoMs = EVENT_POPUP_MS) {'
);

// ════════════════════════════════════════════════════════════════════════════
// 2. Add data-player-id to playerCardHtml / playerYouHtml
// ════════════════════════════════════════════════════════════════════════════
src = src.replace(
  "data-pidx=\"${idx}\" style=\"border-left:3px solid ${p.color};\">",
  "data-pidx=\"${idx}\" data-player-id=\"${p.id}\" style=\"border-left:3px solid ${p.color};\">"
);
src = src.replace(
  "data-pidx=\"0\" style=\"border-left:4px solid ${p.color};\">",
  "data-pidx=\"0\" data-player-id=\"${p.id}\" style=\"border-left:4px solid ${p.color};\">"
);

// ════════════════════════════════════════════════════════════════════════════
// 3. Add data-player-id to #team-panel in refreshTeamPanel
// ════════════════════════════════════════════════════════════════════════════
rep(
`function refreshTeamPanel() {
  const tp = $('#team-panel'); if (!tp || !state.game) return;
  tp.innerHTML = teamPanelHtml(state.game.players[0]);
  const sl = $('#team-strength-label');
  if (sl) sl.textContent = '★ ' + teamStrength(state.game.players[0]);
}`,
`function refreshTeamPanel() {
  const tp = $('#team-panel'); if (!tp || !state.game) return;
  const _human = state.game.players[0];
  tp.dataset.playerId = _human.id; // for showActionPopup highlights
  tp.innerHTML = teamPanelHtml(_human);
  const sl = $('#team-strength-label');
  if (sl) sl.textContent = '★ ' + teamStrength(_human);
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 4. AC 1 — Muskelfaserriss  (no-card early exit)
// ════════════════════════════════════════════════════════════════════════════
rep(
`  if (!bestCard) {
    const msg = de ? 'Kein Spieler im Team — keine Auswirkung.' : 'No player in team — no effect.';
    appendConeLog(\`🩻 Muskelfaserriss · \${player.emoji} \${escapeHTML(player.name)} · \${msg}\`);
    return;
  }`,
`  if (!bestCard) {
    const msg = de ? 'Kein Spieler im Team — keine Auswirkung.' : 'No player in team — no effect.';
    appendConeLog(\`🩻 Muskelfaserriss · \${player.emoji} \${escapeHTML(player.name)} · \${msg}\`);
    await showActionPopup({ title: '🏥 Muskelfaserriss', description: \`\${player.emoji} \${escapeHTML(player.name)}\\n\${msg}\`, affectedPlayers: [player] });
    return;
  }`
);

// ════════════════════════════════════════════════════════════════════════════
// 5. AC 1 — Muskelfaserriss (main block)
// ════════════════════════════════════════════════════════════════════════════
rep(
`  disablePlayerOnTeam(player, bestPos, de ? 'Muskelfaserriss' : 'Muscle Tear');
  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  const detail = $('#event-detail');
  if (detail) detail.innerHTML =
    \`<div style="margin-top:.8em;font-size:.9em">
      \${de ? \`Dein stärkster Spieler <b>\${escapeHTML(bestCard.name)}</b> fällt diese Woche aus!\`
           : \`Your best player <b>\${escapeHTML(bestCard.name)}</b> is out this week!\`}
    </div>\`;
  appendConeLog(\`🩻 Muskelfaserriss · \${player.emoji} \${escapeHTML(player.name)}: \${escapeHTML(bestCard.name)} out\`);
  await sleep(speedMs(2500));
}`,
`  disablePlayerOnTeam(player, bestPos, de ? 'Muskelfaserriss' : 'Muscle Tear');
  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  appendConeLog(\`🩻 Muskelfaserriss · \${player.emoji} \${escapeHTML(player.name)}: \${escapeHTML(bestCard.name)} out\`);
  await showActionPopup({
    title: '🏥 Muskelfaserriss',
    description: de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> zieht Muskelfaserriss!\\n\${escapeHTML(bestCard.name)} (\${posLabel(bestPos)} \${'★'.repeat(bestCard.stars)}) fällt diese Woche aus.\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> draws Muscle Tear!\\n\${escapeHTML(bestCard.name)} (\${posLabel(bestPos)} \${'★'.repeat(bestCard.stars)}) is out this week.\`,
    affectedCards: [bestCard],
    affectedPlayers: [player],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 6. AC 2 — Trikotsponsor
// ════════════════════════════════════════════════════════════════════════════
rep(
`  animateMoneyChange(player, amount); refreshTopbar();
  const detail = $('#event-detail');
  if (detail) detail.innerHTML =
    \`<div style="margin-top:.8em;color:var(--gold);font-size:1.1em">💰 +\${fmtMoney(amount)}'</div>\`;
  appendConeLog(\`👕 Trikotsponsor · \${player.emoji} \${escapeHTML(player.name)} +\${fmtMoney(amount)}'\`);
  toast(\`👕 \${de ? 'Neuer Sponsor' : 'New sponsor'}! +\${fmtMoney(amount)}'\`, 'gold', 2500);
  await sleep(speedMs(2000));
}`,
`  animateMoneyChange(player, amount); refreshTopbar();
  appendConeLog(\`👕 Trikotsponsor · \${player.emoji} \${escapeHTML(player.name)} +\${fmtMoney(amount)}'\`);
  await showActionPopup({
    title: '💰 Trikotsponsor',
    description: de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> erhält einen neuen Trikotsponsor!\\n+\${fmtMoney(amount)}' sofort ausgezahlt.\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> receives a new shirt sponsor!\\n+\${fmtMoney(amount)}' paid immediately.\`,
    affectedPlayers: [player],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 7. AC 3 — Transfergerücht
// ════════════════════════════════════════════════════════════════════════════
rep(
`  if (!worstCard) {
    const msg = de ? \`\${escapeHTML(opp.name)} hat kein Team — keine Auswirkung.\`
                   : \`\${escapeHTML(opp.name)} has no team — no effect.\`;
    appendConeLog(\`📰 Transfergerücht · \${msg}\`); return;
  }
  worstCard.forcedSale = true;
  const detail = $('#event-detail');
  const msg = de
    ? \`<b>\${escapeHTML(opp.name)}</b>s günstigster Spieler <b>\${escapeHTML(worstCard.name)}</b> muss zum Mindestpreis verkauft werden.\`
    : \`<b>\${escapeHTML(opp.name)}</b>'s cheapest player <b>\${escapeHTML(worstCard.name)}</b> must be sold at minimum price.\`;
  if (detail) detail.innerHTML = \`<div style="margin-top:.8em;font-size:.85em">\${msg}</div>\`;
  appendConeLog(\`📰 Transfergerücht · \${player.emoji} \${escapeHTML(player.name)} → \${escapeHTML(opp.name)}: \${escapeHTML(worstCard.name)}\`);
  await sleep(speedMs(2500));
}`,
`  if (!worstCard) {
    const msg = de ? \`\${escapeHTML(opp.name)} hat kein Team — keine Auswirkung.\`
                   : \`\${escapeHTML(opp.name)} has no team — no effect.\`;
    appendConeLog(\`📰 Transfergerücht · \${msg}\`);
    await showActionPopup({ title: '📰 Transfergerücht', description: msg, affectedPlayers: [opp] });
    return;
  }
  worstCard.forcedSale = true;
  appendConeLog(\`📰 Transfergerücht · \${player.emoji} \${escapeHTML(player.name)} → \${escapeHTML(opp.name)}: \${escapeHTML(worstCard.name)}\`);
  await showActionPopup({
    title: '📰 Transfergerücht',
    description: de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> startet ein Transfergerücht!\\n\${opp.emoji} <b>\${escapeHTML(opp.name)}</b>: \${escapeHTML(worstCard.name)} (\${'★'.repeat(worstCard.stars)}) muss zum Mindestpreis verkauft werden.\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> starts a transfer rumour!\\n\${opp.emoji} <b>\${escapeHTML(opp.name)}</b>: \${escapeHTML(worstCard.name)} (\${'★'.repeat(worstCard.stars)}) must be sold at minimum price.\`,
    affectedCards: [worstCard],
    affectedPlayers: [player, opp],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 8. AC 4 — Positionstausch
// ════════════════════════════════════════════════════════════════════════════
rep(
`  const detail = $('#event-detail');
  if (detail) detail.innerHTML = \`
    <div style="margin-top:.8em;font-size:.82em;text-align:left">
      <div style="color:var(--gold);margin-bottom:.4em">🔄 \${de ? 'Position' : 'Position'}: <b>\${posName}</b></div>
      \${logLines.map(l => \`<div style="margin:.2em 0">\${l}</div>\`).join('')}
    </div>\`;
  appendConeLog(\`🔄 Positionstausch (\${posName}) · \${participants.map(e => escapeHTML(e.card.name)).join(' → ')}\`);
  await sleep(speedMs(3000));
}`,
`  appendConeLog(\`🔄 Positionstausch (\${posName}) · \${participants.map(e => escapeHTML(e.card.name)).join(' → ')}\`);
  await showActionPopup({
    title: '🔄 Positionstausch',
    description: 'Position: <b>' + posName + '</b>\\n' + logLines.join('\\n'),
    affectedCards: participants.map(e => e.card),
    affectedPlayers: participants.map(e => e.p),
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 9. AC 5 — Talentförderung
// ════════════════════════════════════════════════════════════════════════════
rep(
`  placeIntoTeamOrBench(player, chosen);
  refreshTeamPanel(); refreshTopbar();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  const detail = $('#event-detail');
  if (detail) detail.innerHTML =
    \`<div style="margin-top:.8em;font-size:.88em">
      <b>\${escapeHTML(chosen.name)}</b> \${'★'.repeat(chosen.stars)} — \${de ? 'zu deinem Team hinzugefügt.' : 'added to your team.'}
    </div>\`;
  appendConeLog(\`🌟 Talentförderung · \${player.emoji} \${escapeHTML(player.name)} → \${escapeHTML(chosen.name)}\`);
  await sleep(speedMs(2000));
}`,
`  placeIntoTeamOrBench(player, chosen);
  autoSelectLineup(player);
  refreshTeamPanel(); refreshTopbar();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  appendConeLog(\`🌟 Talentförderung · \${player.emoji} \${escapeHTML(player.name)} → \${escapeHTML(chosen.name)}\`);
  await showActionPopup({
    title: '🌟 Talentförderung',
    description: de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> zieht Talentförderung!\\n\${escapeHTML(chosen.name)} \${'★'.repeat(chosen.stars)} wurde zum Team hinzugefügt.\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> draws Talent Development!\\n\${escapeHTML(chosen.name)} \${'★'.repeat(chosen.stars)} was added to the team.\`,
    positiveCards: [chosen],
    affectedPlayers: [player],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 10. AC 6 — Busunfall
// ════════════════════════════════════════════════════════════════════════════
rep(
`  const suspStr = suspended.length
    ? \`<div style="margin-top:.4em;color:var(--silver)">\${de ? 'Betroffen' : 'Affected'}: \${suspended.map(c => \`<b>\${escapeHTML(c.name)}</b>\`).join(', ')}</div>\`
    : '';
  if (detail) detail.innerHTML =
    \`<div style="margin-top:.8em;font-size:.88em">🚌 \${resultDesc}\${suspStr}</div>\`;
  appendConeLog(\`🚌 Busunfall · \${player.emoji} \${escapeHTML(player.name)} · \${resultDesc}\${suspended.length ? ' — ' + suspended.map(c => escapeHTML(c.name)).join(', ') : ''}\`);
  await sleep(speedMs(2500));
}`,
`  const suspNames = suspended.map(c => \`\${escapeHTML(c.name)} (\${'★'.repeat(c.stars)})\`).join(', ');
  appendConeLog(\`🚌 Busunfall · \${player.emoji} \${escapeHTML(player.name)} · \${resultDesc}\${suspended.length ? ' — ' + suspended.map(c => escapeHTML(c.name)).join(', ') : ''}\`);
  await showActionPopup({
    title: '🚌 Busunfall',
    description: (de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> zieht Busunfall!\\nWürfel: \${resultDesc}\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> draws Bus Accident!\\nDie: \${resultDesc}\`)
      + (suspended.length ? '\\n' + (de ? 'Betroffen: ' : 'Affected: ') + suspNames : ''),
    affectedCards: suspended,
    affectedPlayers: [player],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 11. AC 7 — Transfersperre
// ════════════════════════════════════════════════════════════════════════════
rep(
`  player.auctionBanned = true;
  const msg = de ? 'Du darfst in der nächsten Auktion nicht mitbieten.'
                 : 'You cannot bid in the next auction.';
  const detail = $('#event-detail');
  if (detail) detail.innerHTML = \`<div style="margin-top:.8em;color:var(--silver);font-size:.88em">\${msg}</div>\`;
  appendConeLog(\`🚫 Transfersperre · \${player.emoji} \${escapeHTML(player.name)} gesperrt für nächste Auktion\`);
  toast(\`🚫 \${de ? 'Transfersperre' : 'Transfer Ban'} — \${escapeHTML(player.name)}\`, 'bad', 2500);
  await sleep(speedMs(2000));
}`,
`  player.auctionBanned = true;
  appendConeLog(\`🚫 Transfersperre · \${player.emoji} \${escapeHTML(player.name)} gesperrt für nächste Auktion\`);
  await showActionPopup({
    title: '🚫 Transfersperre',
    description: de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> erhält Transfersperre!\\nDarf in der nächsten Auktion nicht mitbieten.\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> receives a transfer ban!\\nCannot place bids in the next auction.\`,
    affectedPlayers: [player],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 12. AC 8 — Ehemaligentreffen
// ════════════════════════════════════════════════════════════════════════════
rep(
`  if (count === 0) {
    const msg = de ? 'Keine Ehemaligen im Team — keine Ausschüttung.' : 'No 1★ players in team — no payout.';
    if (detail) detail.innerHTML = \`<div style="color:var(--silver);margin-top:.8em">\${msg}</div>\`;
    appendConeLog(\`🏅 Ehemaligentreffen · \${player.emoji} \${escapeHTML(player.name)} · keine\`);
    await sleep(speedMs(1500)); return;
  }
  player.money += earned; player.totalEarned += earned;
  animateMoneyChange(player, earned); refreshTopbar();
  const msg = de ? \`\${count} × 1★-Spieler = +\${fmtMoney(earned)}'\`
                 : \`\${count} × 1★ player = +\${fmtMoney(earned)}'\`;
  if (detail) detail.innerHTML =
    \`<div style="margin-top:.8em;color:var(--gold);font-size:1.05em">🏅 +\${fmtMoney(earned)}'</div>
     <div style="color:var(--silver);font-size:.82em;margin-top:.3em">\${msg}</div>\`;
  appendConeLog(\`🏅 Ehemaligentreffen · \${player.emoji} \${escapeHTML(player.name)} +\${fmtMoney(earned)}'\`);
  toast(\`🏅 +\${fmtMoney(earned)}'\`, 'gold', 2000);
  await sleep(speedMs(2000));
}`,
`  if (count === 0) {
    const noEhMsg = de ? 'Keine Ehemaligen im Team — keine Ausschüttung.' : 'No 1★ players in team — no payout.';
    appendConeLog(\`🏅 Ehemaligentreffen · \${player.emoji} \${escapeHTML(player.name)} · keine\`);
    await showActionPopup({ title: '🏅 Ehemaligentreffen', description: \`\${player.emoji} <b>\${escapeHTML(player.name)}</b>\\n\${noEhMsg}\`, affectedPlayers: [player] });
    return;
  }
  player.money += earned; player.totalEarned += earned;
  animateMoneyChange(player, earned); refreshTopbar();
  appendConeLog(\`🏅 Ehemaligentreffen · \${player.emoji} \${escapeHTML(player.name)} +\${fmtMoney(earned)}'\`);
  await showActionPopup({
    title: '🏅 Ehemaligentreffen',
    description: de
      ? \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> besucht das Ehemaligentreffen!\\n\${count} × 1★-Spieler = <b>+\${fmtMoney(earned)}'</b>\`
      : \`\${player.emoji} <b>\${escapeHTML(player.name)}</b> attends the alumni gathering!\\n\${count} × 1★ player = <b>+\${fmtMoney(earned)}'</b>\`,
    affectedPlayers: [player],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 13. AC 9 — Leihgeschäft (final confirmation block only)
// ════════════════════════════════════════════════════════════════════════════
rep(
`  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  const detail = $('#event-detail');
  const msg = de ? \`<b>\${escapeHTML(loanCard.name)}</b> spielt diese Woche für <b>\${escapeHTML(player.name)}</b>.\`
                 : \`<b>\${escapeHTML(loanCard.name)}</b> plays for <b>\${escapeHTML(player.name)}</b> this week.\`;
  if (detail) detail.innerHTML = \`<div style="margin-top:.8em;font-size:.88em">\${msg}</div>\`;
  appendConeLog(\`🤝 Leihgeschäft · \${escapeHTML(loanCard.name)}: \${escapeHTML(opp.name)} → \${escapeHTML(player.name)}\`);
  await sleep(speedMs(2500));
}`,
`  refreshTeamPanel();
  if (typeof refreshFloatingPanel === 'function') refreshFloatingPanel();
  appendConeLog(\`🤝 Leihgeschäft · \${escapeHTML(loanCard.name)}: \${escapeHTML(opp.name)} → \${escapeHTML(player.name)}\`);
  await showActionPopup({
    title: '🤝 Leihgeschäft',
    description: de
      ? \`\${opp.emoji} <b>\${escapeHTML(opp.name)}</b> verleiht <b>\${escapeHTML(loanCard.name)}</b> (\${'★'.repeat(loanCard.stars)})\\nan \${player.emoji} <b>\${escapeHTML(player.name)}</b> für diese Woche.\`
      : \`\${opp.emoji} <b>\${escapeHTML(opp.name)}</b> loans <b>\${escapeHTML(loanCard.name)}</b> (\${'★'.repeat(loanCard.stars)})\\nto \${player.emoji} <b>\${escapeHTML(player.name)}</b> for this week.\`,
    positiveCards: [loanCard],
    affectedPlayers: [player, opp],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 14. AC 10 — Zuschauerrückgang
// ════════════════════════════════════════════════════════════════════════════
rep(
`  refreshTopbar();
  const detail = $('#event-detail');
  if (detail) detail.innerHTML =
    \`<div style="margin-top:.8em;color:var(--silver)">\${de ? \`Alle Vereine verlieren \${fmtMoney(loss)}'.\` : \`All clubs lose \${fmtMoney(loss)}'.\`}</div>\`;
  appendConeLog(\`📉 Zuschauerrückgang · Alle −\${fmtMoney(loss)}'\`);
  toast(\`📉 \${de ? 'Zuschauerrückgang' : 'Attendance Drop'} — −\${fmtMoney(loss)}'\`, 'bad', 2500);
  await sleep(speedMs(2000));
}`,
`  refreshTopbar();
  appendConeLog(\`📉 Zuschauerrückgang · Alle −\${fmtMoney(loss)}'\`);
  await showActionPopup({
    title: '📉 Zuschauerrückgang',
    description: de
      ? \`Alle Vereine verlieren <b>\${fmtMoney(loss)}'</b>.\`
      : \`All clubs lose <b>\${fmtMoney(loss)}'</b>.\`,
    affectedPlayers: state.game ? [...state.game.players] : [],
  });
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 15. VNL Event — replace log & notify block
// ════════════════════════════════════════════════════════════════════════════
rep(
`  // Log & notify
  if (!suspensionsByTeam.length) {
    const msg = de
      ? \`Woche \${week} · Aktive Nationen: \${nationsLabel} — Kein Spieler betroffen.\`
      : \`Week \${week} · Active nations: \${nationsLabel} — No players affected.\`;
    appendConeLog(\`\${player.emoji} \${escapeHTML(player.name)} → 🚩 VNL · <i style="color:var(--silver)">\${msg}</i>\`);
    toast(\`🚩 VNL — \${de ? 'Kein Spieler betroffen' : 'No players affected'}\`, '', 3000);
  } else {
    for (const { p: tp, hits } of suspensionsByTeam) {
      const names = hits.map(c => escapeHTML(c.name)).join(', ');
      appendConeLog(\`🚩 VNL Wk\${week} · \${tp.emoji} \${escapeHTML(tp.name)}: \${names} \${de ? 'gesperrt' : 'suspended'}\`);
    }

    // Show suspension list inside the existing event-detail slot
    const detail = $('#event-detail');
    if (detail) {
      const rows = suspensionsByTeam.map(({ p: tp, hits }) => {
        const cards = hits.map(c =>
          \`<b>\${escapeHTML(c.name)}</b> <span style="color:var(--silver)">(\${escapeHTML(c.nation)})</span>\`
        ).join(', ');
        return \`<div style="margin:.25em 0">
          <span style="color:\${tp.color}">\${tp.emoji} \${escapeHTML(tp.name)}</span>: \${cards}
        </div>\`;
      }).join('');

      detail.innerHTML = \`
        <div style="margin-top:.8em;font-size:.82em;text-align:left">
          <div style="color:var(--gold);margin-bottom:.4em">
            🌍 \${de ? 'Woche' : 'Week'} \${week} — \${escapeHTML(nationsLabel)}
          </div>
          \${rows}
          <div style="color:var(--silver);margin-top:.5em;font-style:italic">
            \${de ? 'Gesperrt bis nach dem Liga-Spiel.' : 'Suspended until after the league match.'}
          </div>
        </div>\`;
    }

    await sleep(speedMs(3000));
  }
}`,
`  // Log & notify
  if (!suspensionsByTeam.length) {
    const noHitMsg = de
      ? \`Woche \${week} · Aktive Nationen: \${nationsLabel} — Kein Spieler betroffen.\`
      : \`Week \${week} · Active nations: \${nationsLabel} — No players affected.\`;
    appendConeLog(\`\${player.emoji} \${escapeHTML(player.name)} → 🚩 VNL · <i style="color:var(--silver)">\${noHitMsg}</i>\`);
    await showActionPopup({ title: '🚩 VNL — Länderspiel', description: noHitMsg });
  } else {
    const allHitCards   = suspensionsByTeam.flatMap(({ hits }) => hits);
    const allHitPlayers = suspensionsByTeam.map(({ p }) => p);
    for (const { p: tp, hits } of suspensionsByTeam) {
      appendConeLog(\`🚩 VNL Wk\${week} · \${tp.emoji} \${escapeHTML(tp.name)}: \${hits.map(c => escapeHTML(c.name)).join(', ')} \${de ? 'gesperrt' : 'suspended'}\`);
    }
    const vnlRows = suspensionsByTeam.map(({ p: tp, hits }) =>
      \`\${tp.emoji} <b>\${escapeHTML(tp.name)}</b>: \${hits.map(c => \`\${escapeHTML(c.name)} (\${escapeHTML(c.nation)})\`).join(', ')}\`
    ).join('\\n');
    await showActionPopup({
      title: '🚩 VNL — Länderspiel',
      description: (de ? \`🌍 Woche \${week} — \${escapeHTML(nationsLabel)}\` : \`🌍 Week \${week} — \${escapeHTML(nationsLabel)}\`)
        + '\\n' + vnlRows
        + '\\n' + (de ? '<i>Gesperrt bis nach dem Liga-Spiel.</i>' : '<i>Suspended until after the league match.</i>'),
      affectedCards: allHitCards,
      affectedPlayers: allHitPlayers,
    });
  }
}`
);

// ════════════════════════════════════════════════════════════════════════════
// 16. applyInjury — replace body without nested-backtick issues
// ════════════════════════════════════════════════════════════════════════════
// Use String.replace with a regex-safe literal search for the unique body portion
src = src.replace(
  "  const detail = $('#event-detail');\n" +
  "  if (detail) detail.innerHTML = `<div class=\"dice-area\"><div class=\"dice-num\" id=\"dice-num\">\u2014</div></div>`;\n" +
  "  const v = await performDiceRoll(6);\n" +
  "  const pos = diePositionFor(v);\n" +
  "  const subbed = disablePlayerOnTeam(player, pos, T('cone_event_injury'));\n" +
  "  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} \u2192 \uD83E\uDE79 ${posLabel(pos)} ${T('injury_out')}${subbed?` + '`' + ` \u00B7 ${T('sub_in')}: ${escapeHTML(subbed.name)}` + '`' + `:''}`);\n" +
  "  refreshTeamPanel();\n" +
  "  refreshFloatingPanel();\n" +
  "}",

  "  const de = state.lang === 'de';\n" +
  "  const v = await performDiceRoll(6);\n" +
  "  const pos = diePositionFor(v);\n" +
  "  const injuredCard = player.team[pos];\n" +
  "  const subbed = disablePlayerOnTeam(player, pos, T('cone_event_injury'));\n" +
  "  appendConeLog(`${player.emoji} ${escapeHTML(player.name)} \u2192 \uD83E\uDE79 ${posLabel(pos)} ${T('injury_out')}${subbed ? ` + '`' + ` \u00B7 ${T('sub_in')}: ${escapeHTML(subbed.name)}` + '`' + ` : ''}`);\n" +
  "  refreshTeamPanel();\n" +
  "  refreshFloatingPanel();\n" +
  "  const injDesc = (de\n" +
  "    ? `${player.emoji} <b>${escapeHTML(player.name)}</b> erleidet eine Verletzung!\\n${posLabel(pos)}`\n" +
  "    : `${player.emoji} <b>${escapeHTML(player.name)}</b> suffers an injury!\\n${posLabel(pos)}`)\n" +
  "    + (injuredCard ? ` \u2014 <b>${escapeHTML(injuredCard.name)}</b>` : '') + (de ? ' f\u00e4llt aus.' : ' is out.')\n" +
  "    + (subbed ? '\\n' + (de ? 'Ersatz: <b>' : 'Sub: <b>') + escapeHTML(subbed.name) + '</b>' : '');\n" +
  "  await showActionPopup({\n" +
  "    title: '\uD83E\uDE79 ' + T('cone_event_injury'),\n" +
  "    description: injDesc,\n" +
  "    affectedCards: injuredCard ? [injuredCard] : [],\n" +
  "    positiveCards: subbed ? [subbed] : [],\n" +
  "    affectedPlayers: [player],\n" +
  "  });\n" +
  "}"
);

// ════════════════════════════════════════════════════════════════════════════
// Write
// ════════════════════════════════════════════════════════════════════════════
fs.writeFileSync('game.js', src);
console.log('Done. Lines: ' + src.split('\n').length);
