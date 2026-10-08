/*
 * Controle de Frequência Escolar — interface.
 * Depende de: Calc (calc.js), Parsers (parsers.js), Store (storage.js), OCR (ocr.js).
 */
(function () {
  'use strict';

  const C = window.Calc;
  const PZ = window.Parsers;
  const S = window.Store;

  /* ================================================================== */
  /* Utilidades                                                          */
  /* ================================================================== */

  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  function esc(s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function plural(n, one, many) {
    return n + ' ' + (n === 1 ? one : many);
  }

  function fmtBytes(n) {
    if (!n && n !== 0) return '';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
    return (n / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
  }

  const pct = (v) => C.fmtPct(v);
  const num = (v, est) => (v === null || v === undefined ? '—' : (est ? '≈' : '') + v);

  const STATUS = {
    safe: { emoji: '🟢', label: 'Seguro', long: 'Acima de 75% — Seguro' },
    warning: { emoji: '🟡', label: 'Atenção', long: 'Próximo de 75% — Atenção (dentro do limite)' },
    danger: { emoji: '🔴', label: 'Abaixo de 75%', long: 'Abaixo de 75% — Abaixo do limite' },
    unknown: { emoji: '⚪', label: 'Sem dados', long: 'Sem dados de frequência' },
  };

  const DISCLAIMER = 'Este aplicativo é apenas uma ferramenta de organização e cálculo. Os resultados devem ser conferidos com o sistema oficial da escola.';

  /* ================================================================== */
  /* Estado                                                              */
  /* ================================================================== */

  function defaultState() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      subjects: C.DEFAULT_SUBJECTS.map(([name, total]) => ({ id: uid(), name, total, attendance: {} })),
      schedule: [],
      certificates: [],
      settings: { attentionMargin: C.DEFAULT_ATTENTION_MARGIN, saturday: false, periodStart: '', sort: 'priority', tipDismissed: false },
    };
  }

  function normalizeState(s) {
    if (!s || typeof s !== 'object' || !Array.isArray(s.subjects)) return null;
    s.version = 1;
    s.subjects = s.subjects.filter((x) => x && x.id && typeof x.name === 'string').map((x) => Object.assign({ attendance: {} }, x, { attendance: x.attendance || {} }));
    s.schedule = Array.isArray(s.schedule) ? s.schedule.filter((x) => x && x.id && x.subjectId) : [];
    s.certificates = Array.isArray(s.certificates) ? s.certificates.filter((x) => x && x.id) : [];
    s.certificates.forEach((c) => {
      c.subjectIds = Array.isArray(c.subjectIds) ? c.subjectIds : [];
      c.coveredLessons = Array.isArray(c.coveredLessons) ? c.coveredLessons : [];
      c.excludedKeys = Array.isArray(c.excludedKeys) ? c.excludedKeys : [];
      c.attachments = Array.isArray(c.attachments) ? c.attachments : [];
    });
    s.settings = Object.assign({ attentionMargin: C.DEFAULT_ATTENTION_MARGIN, saturday: false, periodStart: '', sort: 'priority', tipDismissed: false }, s.settings || {});
    return s;
  }

  let state = normalizeState(S.load());
  const firstRun = !state;
  if (!state) state = defaultState();

  let calc = null;
  function recompute() {
    calc = C.computeAll(state, todayISO());
  }

  function persist() {
    if (!S.save(state)) toast('Não foi possível salvar no aparelho. Exporte um backup.', 'error');
  }

  /** Salva, recalcula e atualiza a tela. */
  function commit() {
    persist();
    recompute();
    render();
    refreshSheets();
  }

  const getSubject = (id) => state.subjects.find((s) => s.id === id);
  const subjectName = (id) => (getSubject(id) || { name: '(matéria excluída)' }).name;
  const resultFor = (id) => calc.results.find((r) => r.id === id);

  function sortedSubjects() {
    return state.subjects.slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  /* ================================================================== */
  /* Toast                                                               */
  /* ================================================================== */

  let toastTimer = null;
  function toast(msg, kind) {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show ' + (kind || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.className = 'toast'), 3200);
  }

  /* ================================================================== */
  /* Componentes reutilizáveis                                           */
  /* ================================================================== */

  function statusPill(status) {
    const s = STATUS[status] || STATUS.unknown;
    return '<span class="pill pill-' + status + '">' + s.emoji + ' ' + esc(s.label) + '</span>';
  }

  function estimateTag(r) {
    return r && r.estimate && r.mode !== 'empty' ? '<span class="tag tag-estimate" title="Valores aproximados">ESTIMATIVA</span>' : '';
  }

  function progressBar(value, status) {
    const w = value === null || value === undefined ? 0 : Math.max(0, Math.min(100, value));
    return (
      '<div class="bar bar-' + status + '" role="img" aria-label="Frequência ' + esc(pct(value)) + ', limite 75%">' +
      '<div class="bar-fill" style="width:' + w + '%"></div><div class="bar-mark" style="left:' + C.THRESHOLD + '%"><span>75%</span></div></div>'
    );
  }

  function displayFreq(r) {
    return r.freqReal !== null ? r.freqReal : r.freqOrig;
  }

  function subjectCard(r) {
    const f = displayFreq(r);
    const meta = [];
    if (r.hasCounts) {
      meta.push(plural(r.C, 'falta abonada', 'faltas abonadas'));
      meta.push(plural(r.Fv, 'falta válida', 'faltas válidas'));
    } else if (r.mode === 'percent') {
      meta.push(r.covered ? r.covered + ' aula(s) em atestado — informe as faltas para recalcular' : 'Somente percentual informado');
    } else {
      meta.push('Toque para informar a frequência');
    }
    return (
      '<button class="card card-' + r.status + '" data-action="open-subject" data-id="' + esc(r.id) + '">' +
      '<div class="card-top"><span class="card-name">' + esc(r.name) + '</span>' + estimateTag(r) + '</div>' +
      '<div class="card-pct">' + (r.estimate && r.hasCounts && r.covered > 0 ? '≈' : '') + esc(pct(f)) + '</div>' +
      progressBar(f, r.status) +
      '<div class="card-meta">' + meta.map(esc).join(' · ') + '</div>' +
      '<div class="card-foot">' + statusPill(r.status) + '</div>' +
      '</button>'
    );
  }

  function emptyState(icon, title, text, actionHtml) {
    return '<div class="empty"><div class="empty-icon" aria-hidden="true">' + icon + '</div><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p>' + (actionHtml || '') + '</div>';
  }

  function field(label, inputHtml, hint, errId) {
    return (
      '<label class="field"><span class="field-label">' + esc(label) + '</span>' + inputHtml +
      (hint ? '<span class="field-hint">' + esc(hint) + '</span>' : '') +
      (errId ? '<span class="field-error" id="' + errId + '"></span>' : '') +
      '</label>'
    );
  }

  function subjectOptions(selectedId, includeEmpty) {
    return (
      (includeEmpty ? '<option value="">Selecione…</option>' : '') +
      sortedSubjects()
        .map((s) => '<option value="' + esc(s.id) + '"' + (s.id === selectedId ? ' selected' : '') + '>' + esc(s.name) + '</option>')
        .join('')
    );
  }

  function dayOptions(selected, includeEmpty) {
    const days = [1, 2, 3, 4, 5, 6];
    return (
      (includeEmpty ? '<option value="">Dia?</option>' : '') +
      days.map((d) => '<option value="' + d + '"' + (+selected === d ? ' selected' : '') + '>' + C.WEEKDAYS[d] + '</option>').join('')
    );
  }

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 4v17M16 2v4M8 2v4"/></svg>',
    doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 14h6M13 11v6"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    clip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7"/></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  };

  /* ================================================================== */
  /* Navegação e telas                                                   */
  /* ================================================================== */

  const TABS = [
    { id: 'home', label: 'Início', icon: 'home', title: 'Frequência' },
    { id: 'subjects', label: 'Matérias', icon: 'book', title: 'Matérias' },
    { id: 'schedule', label: 'Grade', icon: 'grid', title: 'Grade semanal' },
    { id: 'certs', label: 'Atestados', icon: 'doc', title: 'Atestados' },
    { id: 'more', label: 'Mais', icon: 'more', title: 'Mais' },
  ];

  const ui = { tab: 'home', subjectsMode: 'list' };

  function renderNav() {
    $('#nav').innerHTML = TABS.map(
      (t) =>
        '<button class="nav-btn' + (ui.tab === t.id ? ' active' : '') + '" data-action="tab" data-tab="' + t.id + '"' + (ui.tab === t.id ? ' aria-current="page"' : '') + '>' +
        ICONS[t.icon] + '<span>' + t.label + '</span></button>'
    ).join('');
  }

  function render() {
    const tab = TABS.find((t) => t.id === ui.tab) || TABS[0];
    $('#page-title').textContent = tab.title;
    const views = { home: viewHome, subjects: viewSubjects, schedule: viewSchedule, certs: viewCerts, more: viewMore };
    $('#view').innerHTML = views[tab.id]();
    renderNav();
  }

  function goTab(id) {
    ui.tab = id;
    render();
    window.scrollTo(0, 0);
  }

  /* ----------------------------- Início ----------------------------- */

  function viewHome() {
    const sm = calc.summary;
    const anyData = calc.results.some((r) => r.mode !== 'empty');
    const order = { danger: 0, warning: 1, safe: 2, unknown: 3 };
    let results = calc.results.slice();
    if (state.settings.sort === 'priority') {
      results.sort((a, b) => order[a.status] - order[b.status] || (displayFreq(a) ?? 999) - (displayFreq(b) ?? 999) || a.name.localeCompare(b.name, 'pt-BR'));
    } else if (state.settings.sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

    let html = '';
    if (!state.settings.tipDismissed) {
      html +=
        '<div class="callout callout-info"><div><strong>Dica para iPhone:</strong> toque em Compartilhar → “Adicionar à Tela de Início” para usar como app. ' +
        'Os dados ficam só neste aparelho — exporte um backup de vez em quando (aba Mais).</div>' +
        '<button class="icon-btn small" data-action="dismiss-tip" aria-label="Fechar dica">×</button></div>';
    }

    html +=
      '<section class="summary" aria-label="Resumo geral">' +
      '<div class="tile tile-safe"><span class="tile-num">' + sm.safe + '</span><span class="tile-label">🟢 Acima de 75%</span></div>' +
      '<div class="tile tile-warning"><span class="tile-num">' + sm.warning + '</span><span class="tile-label">🟡 Em atenção</span></div>' +
      '<div class="tile tile-danger"><span class="tile-num">' + sm.danger + '</span><span class="tile-label">🔴 Abaixo de 75%</span></div>' +
      '<div class="summary-row"><span><strong>' + sm.covered + '</strong> faltas abonadas</span><span><strong>' + sm.validAbsences + '</strong> faltas válidas</span>' +
      (sm.unknown ? '<span class="muted">' + sm.unknown + ' sem dados</span>' : '') + '</div>' +
      '</section>';

    if (!anyData) {
      html +=
        '<section class="onboard"><h2>Comece por aqui</h2><ol class="steps">' +
        '<li><button class="step" data-action="tab" data-tab="schedule"><span class="step-n">1</span><span><strong>Monte sua grade</strong><small>Usada para descobrir quais aulas cada atestado cobre.</small></span>' + ICONS.chevron + '</button></li>' +
        '<li><button class="step" data-action="quick-entry"><span class="step-n">2</span><span><strong>Informe a frequência</strong><small>Copie do sistema da escola: faltas, aulas dadas ou %.</small></span>' + ICONS.chevron + '</button></li>' +
        '<li><button class="step" data-action="new-cert"><span class="step-n">3</span><span><strong>Adicione atestados</strong><small>As aulas cobertas deixam de contar como falta.</small></span>' + ICONS.chevron + '</button></li>' +
        '</ol></section>';
    }

    html +=
      '<div class="section-head"><h2>Matérias</h2><label class="select-inline"><span class="sr-only">Ordenar</span><select data-setting="sort">' +
      '<option value="priority"' + (state.settings.sort === 'priority' ? ' selected' : '') + '>Prioridade</option>' +
      '<option value="name"' + (state.settings.sort === 'name' ? ' selected' : '') + '>Nome</option>' +
      '<option value="custom"' + (state.settings.sort === 'custom' ? ' selected' : '') + '>Cadastro</option>' +
      '</select></label></div>';

    html += results.length ? '<div class="cards">' + results.map(subjectCard).join('') + '</div>' : emptyState('📚', 'Nenhuma matéria', 'Adicione matérias na aba Matérias.');
    html += '<p class="disclaimer">' + esc(DISCLAIMER) + '</p>';
    return html;
  }

  /* ----------------------------- Matérias ----------------------------- */

  function viewSubjects() {
    let html =
      '<div class="segmented" role="tablist">' +
      '<button role="tab" class="' + (ui.subjectsMode === 'list' ? 'active' : '') + '" data-action="subjects-mode" data-mode="list">Lista</button>' +
      '<button role="tab" class="' + (ui.subjectsMode === 'quick' ? 'active' : '') + '" data-action="subjects-mode" data-mode="quick">Lançar frequência</button>' +
      '</div>';

    if (ui.subjectsMode === 'quick') {
      html +=
        '<p class="hint">Copie do sistema da escola. Preencha o que tiver — faltas e aulas dadas dão o cálculo exato; só o percentual gera <strong>estimativa</strong>. Salva automaticamente.</p>' +
        '<div class="quick-list">' +
        state.subjects
          .map((s) => {
            const a = s.attendance || {};
            const r = resultFor(s.id);
            return (
              '<div class="quick-row" data-subject="' + esc(s.id) + '">' +
              '<div class="quick-head"><span class="quick-name">' + esc(s.name) + '</span><span class="quick-result" id="qr-' + esc(s.id) + '">' + quickResult(r) + '</span></div>' +
              '<div class="quick-fields">' +
              quickInput(s.id, 'absences', 'Faltas', a.absences, 'numeric') +
              quickInput(s.id, 'counted', 'Aulas dadas', a.counted, 'numeric') +
              quickInput(s.id, 'presencePct', 'Frequência %', a.presencePct, 'decimal') +
              '</div><div class="field-error" id="qe-' + esc(s.id) + '"></div></div>'
            );
          })
          .join('') +
        '</div><p class="hint">Para informar presenças ou % de faltas, abra a matéria na Lista.</p>';
      return html;
    }

    html +=
      '<div class="list">' +
      state.subjects
        .map((s) => {
          const r = resultFor(s.id);
          const f = displayFreq(r);
          const lessons = state.schedule.filter((e) => e.subjectId === s.id).length;
          return (
            '<button class="list-row" data-action="open-subject" data-id="' + esc(s.id) + '">' +
            '<span class="list-main"><span class="list-title">' + esc(s.name) + '</span>' +
            '<span class="list-sub">' + (s.total ? s.total + ' aulas no período' : 'Total do período não informado') + ' · ' + plural(lessons, 'aula', 'aulas') + '/semana</span></span>' +
            '<span class="list-value val-' + r.status + '">' + esc(pct(f)) + '</span>' + ICONS.chevron +
            '</button>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="actions-row"><button class="btn btn-primary" data-action="add-subject">' + ICONS.plus + ' Adicionar matéria</button>' +
      '<button class="btn btn-ghost" data-action="restore-subjects">Restaurar matérias padrão</button></div>';
    return html;
  }

  function quickInput(id, fieldName, label, value, mode) {
    return (
      '<label class="quick-field"><span>' + esc(label) + '</span><input type="text" inputmode="' + mode + '" autocomplete="off" ' +
      'data-quick="' + esc(id) + '" data-field="' + fieldName + '" value="' + esc(value === undefined || value === null ? '' : value) + '" placeholder="—"></label>'
    );
  }

  function quickResult(r) {
    if (!r || r.mode === 'empty') return '<span class="muted">—</span>';
    return '<span class="val-' + r.status + '">' + esc(pct(displayFreq(r))) + '</span> ' + estimateTag(r);
  }

  /* ----------------------------- Grade ----------------------------- */

  function viewSchedule() {
    const days = [1, 2, 3, 4, 5];
    if (state.settings.saturday || state.schedule.some((e) => +e.day === 6)) days.push(6);
    const perWeek = state.schedule.length;
    let html =
      '<p class="hint">A grade é usada para descobrir automaticamente quais aulas cada atestado cobre. ' +
      'Aulas seguidas da mesma matéria (aula dupla) devem ser cadastradas separadamente, com horários diferentes.</p>' +
      '<div class="actions-row"><button class="btn btn-primary" data-action="new-lesson">' + ICONS.plus + ' Adicionar aula</button>' +
      '<button class="btn btn-ghost" data-action="open-import" data-kind="schedule">' + ICONS.camera + ' Importar de imagem</button></div>' +
      '<p class="muted small">' + plural(perWeek, 'aula', 'aulas') + ' por semana</p>';

    html += days
      .map((d) => {
        const lessons = state.schedule.filter((e) => +e.day === d).sort((a, b) => (C.timeToMinutes(a.start) ?? 0) - (C.timeToMinutes(b.start) ?? 0));
        return (
          '<section class="day"><div class="day-head"><h2>' + C.WEEKDAYS[d] + '</h2><span class="muted small">' + plural(lessons.length, 'aula', 'aulas') + '</span>' +
          '<button class="icon-btn" data-action="new-lesson" data-day="' + d + '" aria-label="Adicionar aula na ' + C.WEEKDAYS[d] + '">' + ICONS.plus + '</button></div>' +
          (lessons.length
            ? '<div class="list">' +
              lessons
                .map(
                  (e) =>
                    '<button class="list-row lesson" data-action="edit-lesson" data-id="' + esc(e.id) + '">' +
                    '<span class="lesson-time">' + esc(e.start || '--:--') + (e.end ? '<small>' + esc(e.end) + '</small>' : '') + '</span>' +
                    '<span class="list-main"><span class="list-title">' + esc(subjectName(e.subjectId)) + '</span>' +
                    (e.teacher ? '<span class="list-sub">' + esc(e.teacher) + '</span>' : '') + '</span>' + ICONS.chevron +
                    '</button>'
                )
                .join('') +
              '</div>'
            : '<p class="day-empty">Nenhuma aula cadastrada</p>') +
          '</section>'
        );
      })
      .join('');
    return html;
  }

  /* ----------------------------- Atestados ----------------------------- */

  function viewCerts() {
    const overlaps = C.certificateOverlaps(state.certificates);
    const total = calc.coverage.lessons.length;
    let html =
      '<p class="hint">As aulas da grade que acontecem no período do atestado são detectadas automaticamente. Você revisa e confirma antes de abonar. ' +
      'Uma mesma aula coberta por dois atestados é abonada só uma vez.</p>' +
      '<div class="actions-row"><button class="btn btn-primary" data-action="new-cert">' + ICONS.plus + ' Novo atestado</button>' +
      '<button class="btn btn-ghost" data-action="open-import" data-kind="certificate">' + ICONS.camera + ' Ler de imagem</button></div>' +
      '<div class="summary-row standalone"><span><strong>' + total + '</strong> aulas cobertas por atestados (sem duplicidade)</span><span><strong>' + calc.summary.covered + '</strong> faltas abonadas</span></div>';

    if (!state.certificates.length) {
      return html + emptyState('🩺', 'Nenhum atestado', 'Adicione um atestado para abonar as faltas das aulas que ele cobre.');
    }

    const certs = state.certificates.slice().sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
    html +=
      '<div class="list">' +
      certs
        .map((c) => {
          const days = C.daysBetweenInclusive(c.startDate, c.endDate);
          const subj = c.allSubjects ? 'Todas as matérias' : c.subjectIds.map(subjectName).join(', ') || 'Nenhuma matéria';
          const n = c.coveredLessons.length;
          const dup = overlaps[c.id] || 0;
          const changed = c.confirmed && scheduleChangedFor(c);
          return (
            '<button class="list-row cert" data-action="edit-cert" data-id="' + esc(c.id) + '">' +
            '<span class="list-main"><span class="list-title">' + esc(C.fmtDateBR(c.startDate)) + (c.endDate && c.endDate !== c.startDate ? ' → ' + esc(C.fmtDateBR(c.endDate)) : '') +
            (days ? ' <small class="muted">(' + plural(days, 'dia', 'dias') + ')</small>' : '') + '</span>' +
            '<span class="list-sub">' + esc(subj) + '</span>' +
            '<span class="cert-tags">' +
            (c.confirmed ? '<span class="pill pill-safe">✓ ' + plural(n, 'aula abonada', 'aulas abonadas') + '</span>' : '<span class="pill pill-warning">Pendente de revisão</span>') +
            (dup ? '<span class="tag">' + dup + ' já coberta(s) por outro atestado</span>' : '') +
            (changed ? '<span class="tag tag-warn">Grade mudou — revisar</span>' : '') +
            (c.attachments.length ? '<span class="tag">' + ICONS.clip + ' ' + c.attachments.length + '</span>' : '') +
            '</span>' +
            (c.note ? '<span class="list-sub note">' + esc(c.note) + '</span>' : '') +
            '</span>' + ICONS.chevron + '</button>'
          );
        })
        .join('') +
      '</div>';
    return html;
  }

  function scheduleChangedFor(c) {
    const detected = C.detectLessons(c, state.schedule, state.subjects);
    const covered = new Set(c.coveredLessons.map((l) => l.key));
    const excluded = new Set(c.excludedKeys || []);
    const detectedKeys = new Set(detected.map((l) => l.key));
    if (detected.some((l) => !covered.has(l.key) && !excluded.has(l.key))) return true;
    return c.coveredLessons.some((l) => !detectedKeys.has(l.key) && getSubject(l.subjectId));
  }

  /* ----------------------------- Mais ----------------------------- */

  function viewMore() {
    const st = state.settings;
    return (
      '<section class="panel"><h2>Importar de imagem ou texto</h2>' +
      '<p class="hint">Envie uma foto ou print. O texto é reconhecido <strong>no próprio aparelho</strong> e você confere tudo antes de adicionar.</p>' +
      '<div class="stack">' +
      '<button class="list-row" data-action="open-import" data-kind="attendance"><span class="list-main"><span class="list-title">Frequência</span><span class="list-sub">Print do boletim/sistema da escola</span></span>' + ICONS.chevron + '</button>' +
      '<button class="list-row" data-action="open-import" data-kind="schedule"><span class="list-main"><span class="list-title">Grade de horários</span><span class="list-sub">Foto ou print da grade</span></span>' + ICONS.chevron + '</button>' +
      '<button class="list-row" data-action="open-import" data-kind="certificate"><span class="list-main"><span class="list-title">Atestado</span><span class="list-sub">Detecta datas e quantidade de dias</span></span>' + ICONS.chevron + '</button>' +
      '</div></section>' +

      '<section class="panel"><h2>Configurações</h2>' +
      field(
        'Faixa de “Atenção”',
        '<select data-setting="attentionMargin">' +
          [2, 3, 5, 10].map((m) => '<option value="' + m + '"' + (+st.attentionMargin === m ? ' selected' : '') + '>De 75% até ' + (75 + m) + '%</option>').join('') +
          '</select>',
        'O limite mínimo é sempre 75%. Exatamente 75% conta como dentro do limite.'
      ) +
      '<label class="switch-row"><span>Mostrar sábado na grade</span><input type="checkbox" class="switch" data-setting="saturday"' + (st.saturday ? ' checked' : '') + '></label>' +
      field(
        'Início do período letivo (opcional)',
        '<input type="date" data-setting="periodStart" value="' + esc(st.periodStart || '') + '">',
        'Usado apenas quando você informa só o percentual: o app estima pela grade quantas aulas já aconteceram (resultado marcado como ESTIMATIVA).'
      ) +
      '</section>' +

      '<section class="panel"><h2>Backup</h2>' +
      '<p class="hint">Seus dados ficam salvos só neste aparelho/navegador. Exporte um backup para não perder nada ao trocar de celular ou limpar o navegador.</p>' +
      '<label class="switch-row"><span>Incluir anexos dos atestados no backup</span><input type="checkbox" class="switch" id="export-files" checked></label>' +
      '<div class="actions-row"><button class="btn btn-primary" data-action="export">Exportar dados</button>' +
      '<label class="btn btn-ghost file-btn">Importar backup<input type="file" accept="application/json,.json" id="import-backup" hidden></label></div>' +
      '</section>' +

      '<section class="panel"><h2>Privacidade</h2>' +
      '<ul class="bullets">' +
      '<li>Tudo é salvo localmente, no seu aparelho. Não há conta, servidor nem rastreamento.</li>' +
      '<li>Fotos e PDFs de atestados nunca são enviados para fora do aparelho.</li>' +
      '<li>O reconhecimento de texto (OCR) roda no aparelho. Na primeira vez, o app baixa o motor de OCR de uma CDN pública (jsDelivr) — sua imagem não é enviada.</li>' +
      '<li>Você pode excluir anexos individualmente em cada atestado, ou apagar tudo abaixo.</li>' +
      '</ul>' +
      '<button class="btn btn-danger" data-action="wipe">Apagar todos os dados</button>' +
      '</section>' +

      '<section class="panel"><h2>Como os cálculos funcionam</h2>' +
      '<ul class="bullets formulas">' +
      '<li>Faltas válidas = faltas registradas − faltas cobertas por atestado</li>' +
      '<li>Aulas válidas = presenças + faltas válidas</li>' +
      '<li>Frequência = presenças ÷ aulas válidas × 100</li>' +
      '<li>🟢 Seguro: acima da faixa de atenção · 🟡 Atenção: de 75% até a faixa · 🔴 Abaixo: menos de 75%</li>' +
      '<li>Uma aula é identificada por data + matéria + horário; se dois atestados cobrirem a mesma aula, ela é abonada uma vez só.</li>' +
      '<li>Abonos nunca passam do número de faltas registradas.</li>' +
      '</ul></section>' +

      '<p class="disclaimer">' + esc(DISCLAIMER) + '</p>' +
      '<p class="muted small center">Controle de Frequência Escolar · funciona offline</p>'
    );
  }

  /* ================================================================== */
  /* Folhas (modais)                                                     */
  /* ================================================================== */

  const sheets = [];

  function openSheet(ctrl) {
    const el = document.createElement('div');
    el.className = 'sheet-overlay';
    el.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true">' +
      '<header class="sheet-head"><button class="icon-btn" data-action="close-sheet" aria-label="Fechar">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><h2></h2></header>' +
      '<div class="sheet-body"></div></div>';
    document.body.appendChild(el);
    const entry = { ctrl, el };
    sheets.push(entry);
    renderSheet(entry, false);
    document.body.classList.add('sheet-open');
    requestAnimationFrame(() => el.classList.add('open'));
    el.addEventListener('click', (e) => {
      if (e.target === el) closeSheet();
    });
    return entry;
  }

  function renderSheet(entry, keepScroll) {
    const body = $('.sheet-body', entry.el);
    const top = body.scrollTop;
    const title = entry.ctrl.title();
    $('.sheet-head h2', entry.el).textContent = title;
    $('.sheet', entry.el).setAttribute('aria-label', title);
    body.innerHTML = entry.ctrl.render();
    if (keepScroll !== false) body.scrollTop = top;
    if (entry.ctrl.mount) entry.ctrl.mount(body);
  }

  function closeSheet() {
    const e = sheets.pop();
    if (!e) return;
    if (e.ctrl.onClose) e.ctrl.onClose();
    e.el.classList.remove('open');
    setTimeout(() => e.el.remove(), 220);
    if (!sheets.length) document.body.classList.remove('sheet-open');
  }

  function refreshSheets() {
    sheets.slice().forEach((s) => {
      if (s.ctrl.alive && !s.ctrl.alive()) {
        const i = sheets.indexOf(s);
        sheets.splice(i, 1);
        s.el.remove();
        if (!sheets.length) document.body.classList.remove('sheet-open');
        return;
      }
      if (s.ctrl.live) renderSheet(s);
    });
  }

  function topSheet() {
    return sheets[sheets.length - 1];
  }

  /* ---------------------- Folha: detalhe da matéria ---------------------- */

  function subjectSheet(id) {
    const local = { sim: 1 };

    function formValues(body) {
      const v = {};
      $$('[data-att]', body).forEach((i) => (v[i.dataset.att] = i.value.trim()));
      return v;
    }

    function attPreview(body) {
      const v = formValues(body);
      const errors = C.validateAttendance(v);
      $$('[data-att]', body).forEach((i) => {
        const err = $('#err-' + i.dataset.att, body);
        if (err) err.textContent = errors[i.dataset.att] || '';
        i.classList.toggle('invalid', !!errors[i.dataset.att]);
      });
      const out = $('#att-preview', body);
      if (!out) return;
      if (Object.keys(errors).length) {
        out.innerHTML = '<span class="error">Corrija os campos destacados.</span>';
        return;
      }
      const d = C.deriveAttendance(v);
      const parts = [];
      if (d.mode === 'empty') parts.push('Preencha o que você tiver no sistema da escola.');
      else if (d.mode === 'insufficient') parts.push('Dados insuficientes: informe também faltas, presenças, total de aulas ou o percentual.');
      else if (d.mode === 'percent') parts.push('<strong>Somente percentual:</strong> a frequência da escola será exibida, mas os valores derivados serão <strong>ESTIMATIVA</strong>.');
      else {
        parts.push('Presenças <strong>' + num(d.P, d.estimate) + '</strong> · Faltas <strong>' + num(d.F, d.estimate) + '</strong> · Total <strong>' + num(d.T, d.estimate) + '</strong> · ' + esc(pct(d.pct)) + (d.estimate ? ' <span class="tag tag-estimate">ESTIMATIVA</span>' : ''));
      }
      d.notes.forEach((n) => parts.push('<span class="muted">' + esc(n) + '</span>'));
      d.warnings.forEach((w) => parts.push('<span class="warn-text">⚠️ ' + esc(w) + '</span>'));
      out.innerHTML = parts.join('<br>');
    }

    function simHtml(r) {
      const P = r.P;
      const Tv = r.Tv;
      const x = local.sim;
      if (!r.hasCounts) {
        return '<p class="muted">Para simular, informe o número de faltas ou de aulas (só o percentual não basta).</p>';
      }
      const now = r.freqReal;
      const next = C.simulate(P, Tv, x);
      const st = next === null ? 'unknown' : C.statusFromCounts(P, Tv + x, +state.settings.attentionMargin);
      const end = r.remaining !== null && x <= r.remaining ? C.simulateEndOfPeriod(P, Tv, r.remaining, x) : null;
      const endSt = end === null ? 'unknown' : C.statusFromCounts(P + r.remaining - x, Tv + r.remaining, +state.settings.attentionMargin);
      const e = r.estimate ? '≈' : '';
      return (
        '<div class="sim-grid">' +
        '<div><span class="k">Frequência atual</span><span class="v">' + e + esc(pct(now)) + '</span></div>' +
        '<div><span class="k">Novas faltas</span><span class="v">' + x + '</span></div>' +
        '<div class="sim-main val-' + st + '"><span class="k">Nova frequência</span><span class="v big">' + e + esc(pct(next)) + '</span>' + statusPill(st) + '</div>' +
        '</div>' +
        '<p class="small muted">Cálculo: ' + num(P, r.estimate) + ' ÷ (' + num(Tv, r.estimate) + ' + ' + x + ') × 100, considerando só as aulas já dadas.</p>' +
        (end !== null
          ? '<p class="small">Até o fim do período (' + r.remaining + ' aulas restantes), se faltar ' + x + ' e for a todas as outras: <strong class="val-' + endSt + '">' + e + esc(pct(end)) + '</strong></p>'
          : '')
      );
    }

    function allowanceHtml(r) {
      if (!r.hasCounts) {
        return '<p class="muted">Informe faltas ou total de aulas para calcular quantas aulas ainda pode faltar.</p>';
      }
      const e = r.estimate ? '≈' : '';
      let html = '';
      if (r.allowedPeriod !== null) {
        if (r.allowedPeriod >= 0) {
          html +=
            '<div class="answer' + (r.status === 'danger' ? ' warn' : '') + '"><span class="answer-num">' + e + r.allowedPeriod + '</span><span>aulas ainda podem ser faltadas até o fim do período, das <strong>' + r.remaining +
            '</strong> que restam, terminando com pelo menos 75% (desde que compareça às demais).</span></div>';
        } else {
          html += '<div class="answer danger"><span class="answer-num">0</span><span>Mesmo indo a todas as ' + r.remaining + ' aulas restantes, a frequência final ficará abaixo de 75%. Converse com a escola.</span></div>';
        }
      }
      if (r.presencesNeeded > 0) {
        html += '<div class="answer danger"><span class="answer-num">' + e + r.presencesNeeded + '</span><span>presenças seguidas (sem faltas) para voltar a 75%.</span></div>';
      } else {
        html += '<p class="small">Se faltar seguidas a partir de agora, pode faltar <strong>' + e + r.allowedNow + '</strong> aula(s) e continuar com pelo menos 75% (sem contar presenças futuras).</p>';
      }
      return html;
    }

    function calcRows(r) {
      const e = r.estimate;
      const rows = [];
      const row = (k, v, f) => rows.push('<tr><th scope="row">' + esc(k) + '</th><td>' + v + (f ? '<small>' + esc(f) + '</small>' : '') + '</td></tr>');
      row('Total de aulas no período', r.totalPeriod ? String(r.totalPeriod) : '—');
      if (r.hasCounts) {
        row('Aulas contabilizadas até agora', num(r.T, e));
        row('Presenças', num(r.P, e));
        row('Faltas registradas', num(r.F, e));
        row('Faltas cobertas por atestados', String(r.C), r.coveredExcess ? 'Atestados cobrem ' + r.covered + ' aula(s); limitado às faltas registradas' : r.covered ? 'Aulas confirmadas nos atestados, sem duplicidade' : '');
        row('Faltas válidas', num(r.Fv, e), num(r.F, e) + ' − ' + r.C);
        row('Aulas válidas', num(r.Tv, e), num(r.P, e) + ' + ' + num(r.Fv, e));
        row('Frequência original', esc(pct(r.freqOrig)), r.mode === 'percent' ? 'Informada (dado da escola)' : num(r.P, e) + ' ÷ ' + num(r.T, e) + ' × 100');
        row('Frequência após atestados', '<strong>' + (e && r.covered ? '≈' : '') + esc(pct(r.freqReal)) + '</strong>', r.Tv ? num(r.P, e) + ' ÷ ' + num(r.Tv, e) + ' × 100' : 'Sem aulas válidas');
        if (r.remaining !== null) row('Aulas restantes no período', num(r.remaining, e), r.totalPeriod + ' − ' + num(r.T, e));
        if (r.allowedPeriod !== null) row('Ainda pode faltar (até o fim)', num(Math.max(0, r.allowedPeriod), e), 'Maior x com (' + num(r.P, e) + ' + ' + r.remaining + ' − x) ÷ (' + num(r.Tv, e) + ' + ' + r.remaining + ') ≥ 75%');
      } else if (r.mode === 'percent') {
        row('Frequência informada', esc(pct(r.freqOrig)), 'Dado da escola');
        row('Faltas cobertas por atestados', String(r.covered), r.covered ? 'Não aplicadas: falta o número de faltas/aulas' : '');
        row('Frequência após atestados', r.freqReal !== null ? esc(pct(r.freqReal)) : '—', r.covered ? 'Não é possível recalcular' : 'Sem atestados: igual à original');
      } else {
        row('Frequência', '—', 'Informe os dados da escola');
      }
      return '<table class="calc-table"><tbody>' + rows.join('') + '</tbody></table>';
    }

    return {
      live: true,
      alive: () => !!getSubject(id),
      title: () => (getSubject(id) || {}).name || 'Matéria',
      render() {
        const s = getSubject(id);
        const r = resultFor(id);
        const a = s.attendance || {};
        const f = displayFreq(r);
        const lessons = state.schedule.filter((e) => e.subjectId === id);
        const coveredLessons = calc.coverage.lessons.filter((l) => l.subjectId === id).sort((x, y) => x.key.localeCompare(y.key));
        const attInput = (k, label, mode, hint) =>
          field(label, '<input type="text" inputmode="' + mode + '" autocomplete="off" data-att="' + k + '" value="' + esc(a[k] === undefined || a[k] === null ? '' : a[k]) + '" placeholder="—">', hint, 'err-' + k);

        let html =
          '<section class="hero hero-' + r.status + '">' +
          '<div class="hero-pct">' + (r.estimate && r.hasCounts && r.covered > 0 ? '≈' : '') + esc(pct(f)) + '</div>' +
          '<div class="hero-label">' + (r.freqReal !== null && r.hasCounts ? 'Frequência após atestados' : r.mode === 'empty' ? 'Sem dados' : 'Frequência informada') + ' ' + estimateTag(r) + '</div>' +
          progressBar(f, r.status) +
          '<div class="hero-status">' + statusPill(r.status) + '<span class="muted small">' + esc(STATUS[r.status].long) + '</span></div>' +
          (r.hasCounts && r.C > 0 ? '<div class="hero-compare">Original <strong>' + esc(pct(r.freqOrig)) + '</strong> → após atestados <strong>' + esc(pct(r.freqReal)) + '</strong></div>' : '') +
          '</section>';

        if (r.estimate && r.mode !== 'empty') {
          html += '<div class="callout callout-estimate"><strong>ESTIMATIVA.</strong> ' + (r.mode === 'percent'
            ? 'Você informou só o percentual. Sem o número exato de aulas/faltas, os valores derivados são aproximados.'
            : 'O número de aulas ou de presenças foi deduzido a partir de um percentual, então os resultados são aproximados.') + ' Informe faltas e aulas dadas para o cálculo exato.</div>';
        }
        r.warnings.forEach((w) => (html += '<div class="callout callout-warn">⚠️ ' + esc(w) + '</div>'));

        if (r.hasCounts) {
          const e = r.estimate ? '≈' : '';
          html +=
            '<div class="stats">' +
            '<div class="stat"><span class="stat-num">' + e + r.Fv + '</span><span class="stat-label">faltas válidas</span></div>' +
            '<div class="stat"><span class="stat-num">' + r.C + '</span><span class="stat-label">faltas abonadas</span></div>' +
            '<div class="stat"><span class="stat-num">' + (r.allowedPeriod !== null ? e + Math.max(0, r.allowedPeriod) : e + r.allowedNow) + '</span><span class="stat-label">' + (r.allowedPeriod !== null ? 'ainda pode faltar' : 'pode faltar agora') + '</span></div>' +
            '<div class="stat"><span class="stat-num">' + (r.remaining !== null ? e + r.remaining : '—') + '</span><span class="stat-label">aulas restantes</span></div>' +
            '</div>';
        }

        html +=
          '<section class="panel"><h3>Quantas aulas ainda posso faltar?</h3>' + allowanceHtml(r) + '</section>' +
          '<section class="panel"><h3>Simulador de faltas</h3><p class="small">Se eu faltar mais <strong>X</strong> aulas, minha frequência ficará em quanto?</p>' +
          '<div class="stepper"><button class="icon-btn" data-action="sim-dec" aria-label="Menos uma falta">−</button>' +
          '<label><span class="sr-only">Número de novas faltas</span><input type="number" inputmode="numeric" min="0" max="999" id="sim-x" value="' + local.sim + '"></label>' +
          '<button class="icon-btn" data-action="sim-inc" aria-label="Mais uma falta">+</button><span class="muted small">novas faltas</span></div>' +
          '<div id="sim-out">' + simHtml(r) + '</div></section>' +

          '<details class="panel" open><summary><h3>Como o cálculo foi feito</h3></summary>' + calcRows(r) +
          (r.notes.length ? '<ul class="notes">' + r.notes.map((n) => '<li>' + esc(n) + '</li>').join('') + '</ul>' : '') +
          '</details>' +

          '<section class="panel"><h3>Frequência no sistema da escola</h3>' +
          '<p class="hint">Preencha o que tiver. Com dados suficientes, o restante é calculado. Nada é inventado.</p>' +
          '<div class="form-grid">' +
          attInput('presences', 'Presenças', 'numeric') +
          attInput('absences', 'Faltas', 'numeric') +
          attInput('counted', 'Total de aulas contabilizadas', 'numeric', 'Aulas dadas até agora') +
          attInput('presencePct', '% de presença', 'decimal') +
          attInput('absencePct', '% de faltas', 'decimal') +
          '</div><div class="preview" id="att-preview" aria-live="polite"></div>' +
          '<div class="actions-row"><button class="btn btn-primary" data-action="save-att">Salvar frequência</button>' +
          '<button class="btn btn-ghost" data-action="clear-att">Limpar</button></div></section>' +

          '<section class="panel"><h3>Aulas abonadas por atestados</h3>' +
          (coveredLessons.length
            ? '<ul class="covered-list">' + coveredLessons.map((l) => '<li><span>' + C.WEEKDAYS_SHORT[C.weekdayOf(l.date)] + ', ' + esc(C.fmtDateBR(l.date)) + '</span><span class="muted">' + esc(l.start || '') + '</span></li>').join('') + '</ul>'
            : '<p class="muted">Nenhuma aula desta matéria está coberta por atestado confirmado.</p>') +
          '</section>' +

          '<section class="panel"><h3>Dados da matéria</h3>' +
          '<div class="form-grid">' +
          field('Nome', '<input type="text" id="sub-name" value="' + esc(s.name) + '" autocomplete="off">') +
          field('Total de aulas no período', '<input type="text" inputmode="numeric" id="sub-total" value="' + esc(s.total === null || s.total === undefined ? '' : s.total) + '">', defaultTotalHint(s), 'err-total') +
          '</div>' +
          '<p class="small muted">' + plural(lessons.length, 'aula', 'aulas') + ' por semana na grade.</p>' +
          '<div class="actions-row"><button class="btn btn-secondary" data-action="save-subject">Salvar dados</button>' +
          '<button class="btn btn-danger-ghost" data-action="delete-subject">Excluir matéria</button></div></section>';
        return html;
      },
      mount(body) {
        attPreview(body);
      },
      onInput(e) {
        const body = $('.sheet-body', topSheet().el);
        if (e.target.dataset.att) attPreview(body);
        if (e.target.id === 'sim-x') {
          const v = Math.max(0, Math.min(999, Math.floor(C.toNum(e.target.value) || 0)));
          local.sim = v;
          $('#sim-out', body).innerHTML = simHtml(resultFor(id));
        }
      },
      actions: {
        'sim-inc'() {
          local.sim = Math.min(999, local.sim + 1);
          const body = $('.sheet-body', topSheet().el);
          $('#sim-x', body).value = local.sim;
          $('#sim-out', body).innerHTML = simHtml(resultFor(id));
        },
        'sim-dec'() {
          local.sim = Math.max(0, local.sim - 1);
          const body = $('.sheet-body', topSheet().el);
          $('#sim-x', body).value = local.sim;
          $('#sim-out', body).innerHTML = simHtml(resultFor(id));
        },
        'save-att'() {
          const body = $('.sheet-body', topSheet().el);
          const v = formValues(body);
          const errors = C.validateAttendance(v);
          if (Object.keys(errors).length) {
            toast('Corrija os campos destacados.', 'error');
            return;
          }
          const att = {};
          Object.keys(v).forEach((k) => {
            const n = C.toNum(v[k]);
            if (n !== null) att[k] = n;
          });
          getSubject(id).attendance = att;
          commit();
          toast('Frequência salva');
        },
        'clear-att'() {
          if (!confirm('Limpar os dados de frequência desta matéria?')) return;
          getSubject(id).attendance = {};
          commit();
        },
        'save-subject'() {
          const body = $('.sheet-body', topSheet().el);
          const name = $('#sub-name', body).value.trim();
          const totalRaw = $('#sub-total', body).value.trim();
          const total = C.toNum(totalRaw);
          if (!name) return toast('Informe o nome da matéria.', 'error');
          if (totalRaw && (total === null || total < 0 || !Number.isInteger(total))) {
            $('#err-total', body).textContent = 'Use um número inteiro';
            return;
          }
          if (state.subjects.some((x) => x.id !== id && x.name.toLowerCase() === name.toLowerCase())) return toast('Já existe uma matéria com esse nome.', 'error');
          const s = getSubject(id);
          s.name = name;
          s.total = totalRaw ? total : null;
          commit();
          toast('Matéria atualizada');
        },
        'delete-subject'() {
          const n = state.schedule.filter((e) => e.subjectId === id).length;
          const msg = 'Excluir “' + subjectName(id) + '”?' + (n ? '\nAs ' + n + ' aula(s) desta matéria na grade também serão removidas.' : '') + '\nOs abonos de atestados desta matéria também serão removidos.';
          if (!confirm(msg)) return;
          deleteSubject(id);
          closeSheet();
          commit();
          toast('Matéria excluída');
        },
      },
    };
  }

  function defaultTotalHint(s) {
    const def = C.DEFAULT_SUBJECTS.find(([n]) => n === s.name);
    return def ? 'Padrão: ' + def[1] + ' aulas' : 'Total de aulas da matéria no período letivo';
  }

  function deleteSubject(id) {
    state.subjects = state.subjects.filter((s) => s.id !== id);
    state.schedule = state.schedule.filter((e) => e.subjectId !== id);
    state.certificates.forEach((c) => {
      c.subjectIds = c.subjectIds.filter((x) => x !== id);
      c.coveredLessons = c.coveredLessons.filter((l) => l.subjectId !== id);
    });
  }

  /* ---------------------- Folha: nova matéria ---------------------- */

  function addSubjectSheet() {
    return {
      title: () => 'Nova matéria',
      render: () =>
        '<div class="form-grid">' +
        field('Nome', '<input type="text" id="new-sub-name" autocomplete="off" placeholder="Ex.: Robótica">') +
        field('Total de aulas no período', '<input type="text" inputmode="numeric" id="new-sub-total" placeholder="Ex.: 40">', 'Você pode alterar depois.') +
        '</div><div class="sheet-actions"><button class="btn btn-primary block" data-action="create-subject">Adicionar</button></div>',
      mount(body) {
        const nameInput = $('#new-sub-name', body);
        nameInput.addEventListener('input', () => {
          const def = C.DEFAULT_SUBJECTS.find(([n]) => n.toLowerCase() === nameInput.value.trim().toLowerCase());
          const t = $('#new-sub-total', body);
          if (def && !t.value) t.value = def[1];
        });
      },
      actions: {
        'create-subject'() {
          const body = $('.sheet-body', topSheet().el);
          const name = $('#new-sub-name', body).value.trim();
          const total = C.toNum($('#new-sub-total', body).value);
          if (!name) return toast('Informe o nome.', 'error');
          if (total !== null && (total < 0 || !Number.isInteger(total))) return toast('Total de aulas deve ser um número inteiro.', 'error');
          if (state.subjects.some((x) => x.name.toLowerCase() === name.toLowerCase())) return toast('Já existe uma matéria com esse nome.', 'error');
          state.subjects.push({ id: uid(), name, total, attendance: {} });
          closeSheet();
          commit();
          toast('Matéria adicionada');
        },
      },
    };
  }

  /* ---------------------- Folha: aula da grade ---------------------- */

  function lessonSheet(lessonId, presetDay) {
    const existing = lessonId ? state.schedule.find((e) => e.id === lessonId) : null;
    const f = existing
      ? Object.assign({}, existing)
      : { id: null, day: presetDay || 1, subjectId: '', teacher: '', start: '', end: '' };

    function readForm(body) {
      f.day = +$('#ls-day', body).value;
      f.subjectId = $('#ls-subject', body).value;
      f.teacher = $('#ls-teacher', body).value.trim();
      f.start = $('#ls-start', body).value;
      f.end = $('#ls-end', body).value;
    }

    function save(again) {
      const body = $('.sheet-body', topSheet().el);
      readForm(body);
      if (!f.subjectId) return toast('Escolha a matéria.', 'error');
      if (!f.start) return toast('Informe o horário de início.', 'error');
      const s = C.timeToMinutes(f.start);
      const e = C.timeToMinutes(f.end);
      if (f.end && e <= s) return toast('O término deve ser depois do início.', 'error');
      const dup = state.schedule.find((x) => x.id !== f.id && +x.day === f.day && x.subjectId === f.subjectId && x.start === f.start);
      if (dup) return toast('Essa aula já está na grade.', 'error');
      const overlap = state.schedule.find((x) => {
        if (x.id === f.id || +x.day !== f.day) return false;
        const xs = C.timeToMinutes(x.start);
        const xe = C.timeToMinutes(x.end) ?? xs + 1;
        const fe = e ?? s + 1;
        return s < xe && xs < fe;
      });
      if (overlap && !confirm('Este horário se sobrepõe a ' + subjectName(overlap.subjectId) + ' (' + overlap.start + '). Salvar mesmo assim?')) return;
      const rec = { id: f.id || uid(), day: f.day, subjectId: f.subjectId, teacher: f.teacher, start: f.start, end: f.end };
      const i = state.schedule.findIndex((x) => x.id === rec.id);
      if (i >= 0) state.schedule[i] = rec;
      else state.schedule.push(rec);
      commit();
      if (again) {
        // Próxima aula: mesmo dia, começando no término desta.
        f.id = null;
        f.subjectId = '';
        f.teacher = '';
        const dur = e !== null ? e - s : 50;
        const ns = e !== null ? e : s + dur;
        const toHHMM = (m) => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
        f.start = toHHMM(ns);
        f.end = e !== null ? toHHMM(ns + dur) : '';
        renderSheet(topSheet(), false);
        toast('Aula salva. Adicione a próxima.');
      } else {
        closeSheet();
        toast('Aula salva');
      }
    }

    return {
      title: () => (f.id ? 'Editar aula' : 'Nova aula'),
      render: () =>
        '<div class="form-grid">' +
        field('Dia da semana', '<select id="ls-day">' + dayOptions(f.day) + '</select>') +
        field('Matéria', '<select id="ls-subject">' + subjectOptions(f.subjectId, true) + '</select>') +
        '<div class="two-cols">' +
        field('Início', '<input type="time" id="ls-start" value="' + esc(f.start) + '">') +
        field('Término', '<input type="time" id="ls-end" value="' + esc(f.end) + '">') +
        '</div>' +
        field('Professor (opcional)', '<input type="text" id="ls-teacher" value="' + esc(f.teacher) + '" autocomplete="off">') +
        '</div>' +
        '<div class="sheet-actions">' +
        '<button class="btn btn-primary block" data-action="save-lesson">Salvar</button>' +
        (f.id ? '' : '<button class="btn btn-secondary block" data-action="save-lesson-again">Salvar e adicionar a próxima</button>') +
        (f.id ? '<button class="btn btn-danger-ghost block" data-action="delete-lesson">Excluir aula</button>' : '') +
        '</div>',
      actions: {
        'save-lesson': () => save(false),
        'save-lesson-again': () => save(true),
        'delete-lesson'() {
          if (!confirm('Excluir esta aula da grade?\nAtestados já confirmados mantêm as aulas abonadas.')) return;
          state.schedule = state.schedule.filter((x) => x.id !== f.id);
          closeSheet();
          commit();
          toast('Aula excluída');
        },
      },
    };
  }

  /* ---------------------- Folha: atestado ---------------------- */

  const objectURLs = {};
  async function fileURL(id) {
    if (objectURLs[id]) return objectURLs[id];
    const rec = await S.files.get(id);
    if (!rec || !rec.blob) return null;
    objectURLs[id] = URL.createObjectURL(rec.blob);
    return objectURLs[id];
  }
  function revokeFileURL(id) {
    if (objectURLs[id]) {
      URL.revokeObjectURL(objectURLs[id]);
      delete objectURLs[id];
    }
  }

  function certSheet(certId, prefill) {
    const existing = certId ? state.certificates.find((c) => c.id === certId) : null;
    const p = prefill || {};
    const f = {
      id: existing ? existing.id : uid(),
      startDate: existing ? existing.startDate : p.startDate || todayISO(),
      endDate: existing ? existing.endDate : p.endDate || p.startDate || todayISO(),
      allSubjects: existing ? !!existing.allSubjects : true,
      subjectIds: existing ? existing.subjectIds.slice() : [],
      note: existing ? existing.note || '' : '',
      attachments: existing ? existing.attachments.slice() : [],
      newFiles: (p.files || []).map((file) => ({ id: uid(), file, url: URL.createObjectURL(file) })),
      removed: [],
      unchecked: new Set(existing ? existing.excludedKeys : []),
      prevCovered: existing ? existing.coveredLessons.slice() : [],
      // Num atestado novo, a data final acompanha a inicial até ser editada.
      endTouched: !!existing || !!p.endDate,
    };

    function lessons() {
      const detected = C.detectLessons(f, state.schedule, state.subjects);
      const keys = new Set(detected.map((l) => l.key));
      const start = C.parseISO(f.startDate);
      const end = C.parseISO(f.endDate);
      const stale = f.prevCovered.filter((l) => {
        if (keys.has(l.key) || !getSubject(l.subjectId)) return false;
        const t = C.parseISO(l.date);
        if (t === null || start === null || end === null || t < start || t > end) return false;
        return f.allSubjects || f.subjectIds.includes(l.subjectId);
      }).map((l) => Object.assign({}, l, { stale: true, weekday: C.weekdayOf(l.date) }));
      return detected.concat(stale).sort((a, b) => a.date.localeCompare(b.date) || (C.timeToMinutes(a.start) ?? 0) - (C.timeToMinutes(b.start) ?? 0));
    }

    function otherCoveredKeys() {
      return C.computeCoverage(state.certificates.filter((c) => c.id !== f.id)).keys;
    }

    function dateError() {
      if (!C.parseISO(f.startDate)) return 'Informe a data inicial.';
      if (!C.parseISO(f.endDate)) return 'Informe a data final.';
      if (f.endDate < f.startDate) return 'A data final deve ser igual ou posterior à inicial.';
      if (C.daysBetweenInclusive(f.startDate, f.endDate) > C.MAX_CERT_DAYS) return 'Período muito longo (máximo ' + C.MAX_CERT_DAYS + ' dias).';
      return '';
    }

    function detectedHtml() {
      const err = dateError();
      if (err) return '<p class="error">' + esc(err) + '</p>';
      if (!f.allSubjects && !f.subjectIds.length) return '<p class="muted">Selecione as matérias afetadas.</p>';
      if (!state.schedule.length) {
        return '<div class="callout callout-warn">Sua grade está vazia, então não há como detectar as aulas. <button class="link" data-action="goto-schedule">Cadastrar grade</button></div>';
      }
      const list = lessons();
      if (!list.length) return '<p class="muted">Nenhuma aula das matérias selecionadas acontece nesse período, segundo a grade.</p>';
      const others = otherCoveredKeys();
      const selected = list.filter((l) => !f.unchecked.has(l.key));
      const bySubject = C.countBySubject(selected);
      const groups = {};
      list.forEach((l) => (groups[l.date] = groups[l.date] || []).push(l));
      let html =
        '<div class="detect-summary"><strong>' + plural(selected.length, 'aula selecionada', 'aulas selecionadas') + '</strong>' +
        '<ul>' + Object.keys(bySubject).sort((a, b) => subjectName(a).localeCompare(subjectName(b), 'pt-BR')).map((sid) => '<li>' + esc(subjectName(sid)) + ' → ' + plural(bySubject[sid], 'aula coberta', 'aulas cobertas') + '</li>').join('') + '</ul></div>' +
        '<p class="small muted">Desmarque aulas que não aconteceram (feriado, aula cancelada) ou em que você estava presente.</p>';
      Object.keys(groups).forEach((date) => {
        const wd = C.weekdayOf(date);
        html += '<div class="detect-day"><div class="detect-date">' + C.WEEKDAYS[wd] + ', ' + esc(C.fmtDateBR(date)) + '</div>';
        groups[date].forEach((l) => {
          html +=
            '<label class="check-row"><input type="checkbox" data-lesson="' + esc(l.key) + '"' + (f.unchecked.has(l.key) ? '' : ' checked') + '>' +
            '<span class="check-main"><span>' + esc(l.start || '--:--') + ' · ' + esc(subjectName(l.subjectId)) + '</span>' +
            (others.has(l.key) ? '<span class="tag">já abonada por outro atestado — não conta duas vezes</span>' : '') +
            (l.stale ? '<span class="tag tag-warn">não está mais na grade</span>' : '') +
            '</span></label>';
        });
        html += '</div>';
      });
      return html;
    }

    function updateDetected() {
      const body = $('.sheet-body', topSheet().el);
      $('#cert-detected', body).innerHTML = detectedHtml();
      const n = dateError() || (!f.allSubjects && !f.subjectIds.length) ? 0 : lessons().filter((l) => !f.unchecked.has(l.key)).length;
      $('#cert-confirm', body).textContent = 'Confirmar e abonar ' + plural(n, 'aula', 'aulas');
    }

    function attachmentsHtml() {
      const items = f.attachments
        .filter((a) => !f.removed.includes(a.id))
        .map(
          (a) =>
            '<li class="attach"><a class="attach-link" data-file="' + esc(a.id) + '" target="_blank" rel="noopener">' +
            (a.type && a.type.startsWith('image/') ? '<img alt="" data-thumb="' + esc(a.id) + '">' : '<span class="attach-icon">PDF</span>') +
            '<span class="attach-name">' + esc(a.name) + '<small>' + esc(fmtBytes(a.size)) + '</small></span></a>' +
            '<button class="icon-btn small" data-action="remove-attachment" data-id="' + esc(a.id) + '" aria-label="Excluir anexo">×</button></li>'
        )
        .concat(
          f.newFiles.map(
            (n) =>
              '<li class="attach"><a class="attach-link" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
              (n.file.type && n.file.type.startsWith('image/') ? '<img alt="" src="' + esc(n.url) + '">' : '<span class="attach-icon">PDF</span>') +
              '<span class="attach-name">' + esc(n.file.name) + '<small>' + esc(fmtBytes(n.file.size)) + ' · novo</small></span></a>' +
              '<button class="icon-btn small" data-action="remove-new-file" data-id="' + esc(n.id) + '" aria-label="Remover anexo">×</button></li>'
          )
        );
      return items.length ? '<ul class="attach-list">' + items.join('') + '</ul>' : '<p class="muted small">Nenhum anexo.</p>';
    }

    async function save(confirmIt) {
      const err = dateError();
      if (err) return toast(err, 'error');
      if (!f.allSubjects && !f.subjectIds.length) return toast('Selecione as matérias afetadas.', 'error');
      const list = lessons();
      const covered = confirmIt ? list.filter((l) => !f.unchecked.has(l.key)) : [];
      if (confirmIt && !covered.length && !confirm('Nenhuma aula selecionada. Salvar o atestado sem abonar aulas?')) return;
      try {
        for (const n of f.newFiles) {
          await S.files.put({ id: n.id, name: n.file.name, type: n.file.type, size: n.file.size, blob: n.file, createdAt: Date.now() });
          f.attachments.push({ id: n.id, name: n.file.name, type: n.file.type, size: n.file.size });
        }
        for (const id of f.removed) {
          await S.files.remove(id);
          revokeFileURL(id);
        }
      } catch (e) {
        console.error(e);
        toast('Não foi possível salvar o anexo neste aparelho.', 'error');
        return;
      }
      f.newFiles.forEach((n) => URL.revokeObjectURL(n.url));
      f.newFiles = [];
      const cert = {
        id: f.id,
        startDate: f.startDate,
        endDate: f.endDate,
        allSubjects: f.allSubjects,
        subjectIds: f.allSubjects ? [] : f.subjectIds.slice(),
        note: f.note,
        attachments: f.attachments.filter((a) => !f.removed.includes(a.id)),
        confirmed: !!confirmIt,
        coveredLessons: covered.map((l) => ({ key: l.key, date: l.date, subjectId: l.subjectId, start: l.start, end: l.end })),
        excludedKeys: confirmIt ? list.filter((l) => f.unchecked.has(l.key)).map((l) => l.key) : [],
        updatedAt: new Date().toISOString(),
      };
      const i = state.certificates.findIndex((c) => c.id === cert.id);
      if (i >= 0) state.certificates[i] = cert;
      else state.certificates.push(cert);
      closeSheet();
      commit();
      toast(confirmIt ? 'Atestado confirmado: ' + plural(covered.length, 'aula abonada', 'aulas abonadas') : 'Atestado salvo como pendente (não abonado)');
    }

    return {
      title: () => (existing ? 'Editar atestado' : 'Novo atestado'),
      render() {
        const subs = sortedSubjects();
        return (
          '<div class="form-grid"><div class="two-cols">' +
          field('Data inicial', '<input type="date" id="ct-start" value="' + esc(f.startDate) + '">') +
          field('Data final', '<input type="date" id="ct-end" value="' + esc(f.endDate) + '">') +
          '</div>' +
          '<label class="switch-row"><span>Todas as matérias</span><input type="checkbox" class="switch" id="ct-all"' + (f.allSubjects ? ' checked' : '') + '></label>' +
          '<div class="chips" id="ct-subjects"' + (f.allSubjects ? ' hidden' : '') + '>' +
          subs.map((s) => '<label class="chip"><input type="checkbox" data-subj="' + esc(s.id) + '"' + (f.subjectIds.includes(s.id) ? ' checked' : '') + '><span>' + esc(s.name) + '</span></label>').join('') +
          '</div>' +
          field('Observação', '<textarea id="ct-note" rows="2" placeholder="Opcional">' + esc(f.note) + '</textarea>') +
          '<div class="field"><span class="field-label">Anexos (foto ou PDF, só para referência)</span><div id="ct-attach">' + attachmentsHtml() + '</div>' +
          '<label class="btn btn-ghost file-btn">' + ICONS.clip + ' Adicionar foto ou PDF<input type="file" id="ct-file" accept="image/*,application/pdf" multiple hidden></label>' +
          '<span class="field-hint">Os arquivos ficam guardados apenas neste aparelho.</span></div>' +
          '</div>' +
          '<section class="panel inset"><h3>Aulas detectadas</h3><div id="cert-detected">' + detectedHtml() + '</div></section>' +
          '<div class="sheet-actions">' +
          '<button class="btn btn-primary block" data-action="cert-confirm" id="cert-confirm">Confirmar e abonar</button>' +
          '<button class="btn btn-secondary block" data-action="cert-pending">Salvar sem abonar (pendente)</button>' +
          (existing ? '<button class="btn btn-danger-ghost block" data-action="cert-delete">Excluir atestado</button>' : '') +
          '</div>'
        );
      },
      mount(body) {
        updateDetected();
        $$('[data-thumb], [data-file]', body).forEach(async (el) => {
          const id = el.dataset.thumb || el.dataset.file;
          try {
            const url = await fileURL(id);
            if (!url) return;
            if (el.dataset.thumb) el.src = url;
            else el.href = url;
          } catch (e) {
            console.warn(e);
          }
        });
      },
      onInput(e) {
        const t = e.target;
        if (t.id === 'ct-note') f.note = t.value;
      },
      onChange(e) {
        const t = e.target;
        const body = $('.sheet-body', topSheet().el);
        if (t.id === 'ct-start') {
          f.startDate = t.value;
          if (!f.endTouched || !f.endDate || f.endDate < f.startDate) {
            f.endDate = f.startDate;
            $('#ct-end', body).value = f.endDate;
          }
          updateDetected();
        } else if (t.id === 'ct-end') {
          f.endDate = t.value;
          f.endTouched = true;
          updateDetected();
        } else if (t.id === 'ct-all') {
          f.allSubjects = t.checked;
          $('#ct-subjects', body).hidden = f.allSubjects;
          updateDetected();
        } else if (t.dataset.subj) {
          const id = t.dataset.subj;
          if (t.checked) {
            if (!f.subjectIds.includes(id)) f.subjectIds.push(id);
          } else f.subjectIds = f.subjectIds.filter((x) => x !== id);
          updateDetected();
        } else if (t.dataset.lesson) {
          if (t.checked) f.unchecked.delete(t.dataset.lesson);
          else f.unchecked.add(t.dataset.lesson);
          updateDetected();
        } else if (t.id === 'ct-file') {
          Array.from(t.files || []).forEach((file) => {
            if (!/^image\//.test(file.type) && file.type !== 'application/pdf') {
              toast('Formato não suportado: ' + file.name, 'error');
              return;
            }
            f.newFiles.push({ id: uid(), file, url: URL.createObjectURL(file) });
          });
          t.value = '';
          $('#ct-attach', body).innerHTML = attachmentsHtml();
          this.mount(body);
        }
      },
      onClose() {
        f.newFiles.forEach((n) => URL.revokeObjectURL(n.url));
      },
      actions: {
        'cert-confirm': () => save(true),
        'cert-pending': () => save(false),
        'goto-schedule'() {
          closeSheet();
          goTab('schedule');
        },
        'remove-attachment'(el) {
          if (!confirm('Excluir este anexo? Ele será apagado do aparelho ao salvar.')) return;
          f.removed.push(el.dataset.id);
          const body = $('.sheet-body', topSheet().el);
          $('#ct-attach', body).innerHTML = attachmentsHtml();
          this.mount(body);
        },
        'remove-new-file'(el) {
          const n = f.newFiles.find((x) => x.id === el.dataset.id);
          if (n) URL.revokeObjectURL(n.url);
          f.newFiles = f.newFiles.filter((x) => x.id !== el.dataset.id);
          $('#ct-attach', $('.sheet-body', topSheet().el)).innerHTML = attachmentsHtml();
        },
        async 'cert-delete'() {
          if (!confirm('Excluir este atestado? As aulas abonadas por ele voltarão a contar como falta, e os anexos serão apagados.')) return;
          const cert = state.certificates.find((c) => c.id === f.id);
          if (cert) {
            for (const a of cert.attachments) {
              try {
                await S.files.remove(a.id);
              } catch (e) {
                console.warn(e);
              }
              revokeFileURL(a.id);
            }
          }
          state.certificates = state.certificates.filter((c) => c.id !== f.id);
          closeSheet();
          commit();
          toast('Atestado excluído');
        },
      },
    };
  }

  /* ---------------------- Folha: importação (OCR / texto) ---------------------- */

  const IMPORT_TITLES = { attendance: 'Importar frequência', schedule: 'Importar grade', certificate: 'Ler atestado' };

  function importSheet(kind) {
    const st = { file: null, url: null, text: '', busy: false, status: '', progress: 0, rows: null, cert: null, error: '' };

    function resultsHtml() {
      if (st.rows === null && !st.cert) return '';
      if (kind === 'certificate') {
        const c = st.cert;
        if (!c.dates.length && !c.days) return '<div class="callout callout-warn">Não encontramos datas nem quantidade de dias no texto. Você pode criar o atestado e preencher as datas manualmente.</div>' + certButtons();
        return (
          '<div class="callout callout-info"><strong>Detectamos:</strong><ul>' +
          (c.dates.length ? '<li>Datas no documento: ' + c.dates.map((d) => esc(C.fmtDateBR(d))).join(', ') + '</li>' : '<li>Nenhuma data</li>') +
          (c.days ? '<li>Afastamento: ' + plural(c.days, 'dia', 'dias') + '</li>' : '<li>Quantidade de dias não encontrada</li>') +
          (c.suggestedStart ? '<li>Sugestão: de <strong>' + esc(C.fmtDateBR(c.suggestedStart)) + '</strong> até <strong>' + esc(C.fmtDateBR(c.suggestedEnd)) + '</strong></li>' : '') +
          '</ul>Confira com o documento — a data de emissão nem sempre é o início do afastamento.</div>' + certButtons()
        );
      }
      if (!st.rows.length) {
        return '<div class="callout callout-warn">Não encontramos ' + (kind === 'schedule' ? 'aulas' : 'matérias com dados de frequência') + ' no texto. Corrija o texto acima e analise de novo, ou cadastre manualmente.</div>';
      }
      if (kind === 'attendance') {
        return (
          '<p class="hint"><strong>Detectamos os dados abaixo. Confira e corrija antes de confirmar.</strong> Ao confirmar, os dados de frequência da matéria são substituídos.</p>' +
          st.rows
            .map((r, i) => {
              const v = r.values;
              const summary = [];
              if (v.presencePct !== undefined) summary.push(String(v.presencePct).replace('.', ',') + '% de frequência');
              if (v.absencePct !== undefined) summary.push(String(v.absencePct).replace('.', ',') + '% de faltas');
              if (v.absences !== undefined) summary.push('Faltas: ' + v.absences);
              if (v.presences !== undefined) summary.push('Presenças: ' + v.presences);
              if (v.counted !== undefined) summary.push('Aulas: ' + v.counted);
              const inp = (k, label, mode) =>
                '<label class="quick-field"><span>' + label + '</span><input type="text" inputmode="' + mode + '" data-row="' + i + '" data-k="' + k + '" value="' + esc(v[k] === undefined ? '' : v[k]) + '" placeholder="—"></label>';
              return (
                '<div class="import-row">' +
                '<label class="check-row"><input type="checkbox" data-row-check="' + i + '"' + (r.include ? ' checked' : '') + '><span class="check-main"><strong>' + esc(subjectName(r.subjectId)) + '</strong>' +
                '<span class="small">' + (summary.length ? esc(summary.join(' · ')) : 'Nenhum valor identificado') + '</span>' +
                (r.unassigned.length ? '<span class="tag tag-warn">Números não identificados: ' + esc(r.unassigned.join(', ')) + '</span>' : '') +
                (r.duplicate ? '<span class="tag tag-warn">Matéria aparece mais de uma vez</span>' : '') +
                '</span></label>' +
                '<div class="quick-fields five">' + inp('presences', 'Presenças', 'numeric') + inp('absences', 'Faltas', 'numeric') + inp('counted', 'Aulas', 'numeric') + inp('presencePct', '% pres.', 'decimal') + inp('absencePct', '% faltas', 'decimal') + '</div>' +
                '<div class="small muted raw">Texto: “' + esc(r.raw) + '”</div>' +
                '</div>'
              );
            })
            .join('') +
          '<div class="sheet-actions"><button class="btn btn-primary block" data-action="import-confirm">Confirmar e adicionar</button></div>'
        );
      }
      // schedule
      return (
        '<p class="hint"><strong>Detectamos as aulas abaixo. Confira dia, horário e matéria antes de confirmar.</strong></p>' +
        st.rows
          .map(
            (r, i) =>
              '<div class="import-row">' +
              '<label class="check-row"><input type="checkbox" data-row-check="' + i + '"' + (r.include ? ' checked' : '') + '><span class="check-main"><span class="small muted">“' + esc(r.raw) + '”</span>' +
              (r.inferredDay ? '<span class="tag tag-warn">dia deduzido pela coluna — confira</span>' : '') + '</span></label>' +
              '<div class="sched-fields">' +
              '<select data-row="' + i + '" data-k="day" aria-label="Dia">' + dayOptions(r.day, true) + '</select>' +
              '<input type="time" data-row="' + i + '" data-k="start" value="' + esc(r.start) + '" aria-label="Início">' +
              '<input type="time" data-row="' + i + '" data-k="end" value="' + esc(r.end) + '" aria-label="Término">' +
              '<select data-row="' + i + '" data-k="subjectId" aria-label="Matéria">' + subjectOptions(r.subjectId, true) + '</select>' +
              '</div></div>'
          )
          .join('') +
        '<div class="sheet-actions"><button class="btn btn-primary block" data-action="import-confirm">Confirmar e adicionar à grade</button></div>'
      );
    }

    function certButtons() {
      return '<div class="sheet-actions"><button class="btn btn-primary block" data-action="import-cert-create">Criar atestado com estas informações</button></div>';
    }

    function analyze() {
      const body = $('.sheet-body', topSheet().el);
      st.text = $('#imp-text', body).value;
      if (!st.text.trim()) return toast('Não há texto para analisar.', 'error');
      if (kind === 'attendance') {
        st.rows = PZ.parseAttendanceText(st.text, state.subjects).map((r) => Object.assign({}, r, { include: Object.keys(r.values).length > 0 && !r.duplicate }));
      } else if (kind === 'schedule') {
        st.rows = PZ.parseScheduleText(st.text, state.subjects).map((r) => Object.assign({}, r, { include: !!(r.day && r.start) }));
      } else {
        st.cert = PZ.parseCertificateText(st.text);
      }
      renderSheet(topSheet());
      const res = $('#imp-results', $('.sheet-body', topSheet().el));
      if (res) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function runOCR() {
      if (!st.file) return;
      if (!/^image\//.test(st.file.type)) {
        toast('Para PDF, cole o texto ou envie uma foto/print.', 'error');
        return;
      }
      if (!window.OCR) return toast('OCR indisponível.', 'error');
      st.busy = true;
      st.error = '';
      st.status = 'Iniciando…';
      st.progress = 0;
      renderSheet(topSheet());
      try {
        const text = await window.OCR.recognize(st.file, (m) => {
          st.status = m.status;
          st.progress = m.progress;
          const entry = sheets.find((s) => s.ctrl === ctrl);
          if (!entry) return;
          const bar = $('#ocr-progress', entry.el);
          if (bar) {
            $('.ocr-status', entry.el).textContent = st.status;
            bar.style.width = Math.round((st.progress || 0) * 100) + '%';
          }
        });
        st.text = text;
        st.busy = false;
        const entry = sheets.find((s) => s.ctrl === ctrl);
        if (entry) {
          renderSheet(entry);
          if (!text.trim()) toast('Nenhum texto reconhecido. Tente uma imagem mais nítida.', 'error');
          else analyze();
        }
      } catch (e) {
        console.error(e);
        st.busy = false;
        st.error = e && e.message ? e.message : 'Falha no reconhecimento.';
        const entry = sheets.find((s) => s.ctrl === ctrl);
        if (entry) renderSheet(entry);
      }
    }

    const ctrl = {
      title: () => IMPORT_TITLES[kind],
      render() {
        let html =
          '<p class="hint">Envie uma foto ou print. O texto é reconhecido no seu aparelho; a imagem não é enviada a ninguém. ' +
          'No iPhone, você também pode tocar e segurar o texto na foto (Texto ao Vivo), copiar e colar abaixo.</p>' +
          '<label class="btn btn-secondary file-btn block">' + ICONS.camera + ' ' + (st.file ? 'Trocar arquivo' : 'Escolher foto, print' + (kind === 'certificate' ? ' ou PDF' : '')) +
          '<input type="file" id="imp-file" accept="image/*' + (kind === 'certificate' ? ',application/pdf' : '') + '" hidden></label>';
        if (st.file) {
          html += '<div class="import-preview">' + (st.file.type.startsWith('image/') ? '<img src="' + esc(st.url) + '" alt="Imagem enviada">' : '<span class="attach-icon">PDF</span> ' + esc(st.file.name)) + '</div>';
          if (st.file.type.startsWith('image/')) {
            html += st.busy
              ? '<div class="ocr-box"><span class="ocr-status">' + esc(st.status) + '</span><div class="progress"><div id="ocr-progress" style="width:' + Math.round(st.progress * 100) + '%"></div></div></div>'
              : '<button class="btn btn-primary block" data-action="run-ocr">Reconhecer texto no aparelho</button>' +
                '<p class="small muted">Na primeira vez, o motor de OCR (~10 MB) é baixado de cdn.jsdelivr.net e fica em cache.</p>';
          } else {
            html += '<p class="small muted">PDFs não são lidos automaticamente. Cole o texto abaixo ou preencha as datas manualmente — o PDF será anexado ao atestado.</p>';
          }
        }
        if (st.error) html += '<div class="callout callout-warn">' + esc(st.error) + ' Você pode colar o texto manualmente.</div>';
        html +=
          field('Texto (reconhecido ou colado) — corrija se necessário', '<textarea id="imp-text" rows="6" placeholder="' + esc(placeholderFor(kind)) + '">' + esc(st.text) + '</textarea>') +
          '<button class="btn btn-secondary block" data-action="import-analyze">Analisar texto</button>' +
          '<div id="imp-results">' + resultsHtml() + '</div>';
        return html;
      },
      onChange(e) {
        const t = e.target;
        if (t.id === 'imp-file') {
          const file = t.files && t.files[0];
          if (!file) return;
          if (st.url) URL.revokeObjectURL(st.url);
          st.file = file;
          st.url = URL.createObjectURL(file);
          st.error = '';
          renderSheet(topSheet());
          return;
        }
        if (t.dataset.rowCheck !== undefined) {
          st.rows[+t.dataset.rowCheck].include = t.checked;
          return;
        }
        if (t.dataset.row !== undefined) updateRow(t);
      },
      onInput(e) {
        if (e.target.dataset.row !== undefined) updateRow(e.target);
      },
      onClose() {
        if (st.url && !st.keepFile) URL.revokeObjectURL(st.url);
      },
      actions: {
        'run-ocr': runOCR,
        'import-analyze': analyze,
        'import-confirm'() {
          if (kind === 'attendance') confirmAttendance();
          else confirmSchedule();
        },
        'import-cert-create'() {
          const c = st.cert || {};
          const files = st.file ? [st.file] : [];
          st.keepFile = true;
          closeSheet();
          openSheet(certSheet(null, { startDate: c.suggestedStart || '', endDate: c.suggestedEnd || '', files }));
        },
      },
    };

    function updateRow(t) {
      const r = st.rows[+t.dataset.row];
      const k = t.dataset.k;
      if (kind === 'attendance') {
        const v = t.value.trim();
        if (v === '') delete r.values[k];
        else r.values[k] = v;
      } else {
        r[k] = k === 'day' ? (t.value ? +t.value : null) : t.value;
      }
    }

    function confirmAttendance() {
      const chosen = st.rows.filter((r) => r.include);
      if (!chosen.length) return toast('Selecione ao menos uma matéria.', 'error');
      const seen = new Set();
      for (const r of chosen) {
        if (seen.has(r.subjectId)) return toast(subjectName(r.subjectId) + ' está selecionada mais de uma vez.', 'error');
        seen.add(r.subjectId);
        const errors = C.validateAttendance(r.values);
        if (Object.keys(errors).length) return toast(subjectName(r.subjectId) + ': ' + Object.values(errors)[0], 'error');
      }
      const names = chosen.map((r) => subjectName(r.subjectId));
      if (!confirm('Substituir a frequência de: ' + names.join(', ') + '?')) return;
      chosen.forEach((r) => {
        const att = {};
        Object.keys(r.values).forEach((k) => {
          const n = C.toNum(r.values[k]);
          if (n !== null) att[k] = n;
        });
        const s = getSubject(r.subjectId);
        if (s) s.attendance = att;
      });
      closeSheet();
      commit();
      toast('Frequência importada: ' + plural(chosen.length, 'matéria', 'matérias'));
    }

    function confirmSchedule() {
      const chosen = st.rows.filter((r) => r.include);
      if (!chosen.length) return toast('Selecione ao menos uma aula.', 'error');
      for (const r of chosen) {
        if (!r.day || !r.start || !r.subjectId) return toast('Preencha dia, início e matéria das aulas selecionadas.', 'error');
        if (r.end && C.timeToMinutes(r.end) <= C.timeToMinutes(r.start)) return toast('Há aula com término antes do início.', 'error');
      }
      let added = 0;
      let skipped = 0;
      chosen.forEach((r) => {
        const dup = state.schedule.some((x) => +x.day === +r.day && x.subjectId === r.subjectId && x.start === r.start);
        if (dup) {
          skipped++;
          return;
        }
        state.schedule.push({ id: uid(), day: +r.day, subjectId: r.subjectId, teacher: '', start: r.start, end: r.end || '' });
        added++;
      });
      closeSheet();
      commit();
      toast(plural(added, 'aula adicionada', 'aulas adicionadas') + (skipped ? ' · ' + skipped + ' já existia(m)' : ''));
    }

    return ctrl;
  }

  function placeholderFor(kind) {
    if (kind === 'attendance') return 'Ex.:\nMatemática  100  82  18  82%\nFísica: 78,5% Faltas: 10';
    if (kind === 'schedule') return 'Ex.:\nSegunda\n08:00 - 08:50 Matemática\n08:50 - 09:40 Física';
    return 'Ex.: Atesto que o paciente deverá permanecer afastado por 3 (três) dias a partir de 01/10/2026.';
  }

  /* ================================================================== */
  /* Backup                                                              */
  /* ================================================================== */

  async function exportData() {
    const includeFiles = !!($('#export-files') || {}).checked;
    const payload = { app: 'controle-frequencia-escolar', format: 1, exportedAt: new Date().toISOString(), data: state, files: [] };
    if (includeFiles) {
      try {
        const all = await S.files.all();
        for (const f of all || []) {
          payload.files.push({ id: f.id, name: f.name, type: f.type, size: f.size, dataURL: await S.blobToDataURL(f.blob) });
        }
      } catch (e) {
        console.warn(e);
        toast('Não foi possível incluir os anexos. Exportando sem eles.', 'error');
      }
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const name = 'frequencia-backup-' + todayISO() + '.json';
    const file = typeof File === 'function' ? new File([blob], name, { type: 'application/json' }) : null;
    // No iPhone, o menu de compartilhar permite salvar em Arquivos.
    if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      try {
        await navigator.share({ files: [file], title: name });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Backup exportado');
  }

  async function importData(file) {
    let payload;
    try {
      payload = JSON.parse(await file.text());
    } catch (e) {
      return toast('Arquivo inválido.', 'error');
    }
    const data = normalizeState(payload && payload.app === 'controle-frequencia-escolar' ? payload.data : null);
    if (!data) return toast('Este arquivo não é um backup deste app.', 'error');
    if (!confirm('Importar este backup? Todos os dados atuais serão substituídos.\n\n' + data.subjects.length + ' matérias · ' + data.schedule.length + ' aulas na grade · ' + data.certificates.length + ' atestados')) return;
    try {
      await S.files.clear();
      for (const f of payload.files || []) {
        const blob = S.dataURLToBlob(f.dataURL);
        if (blob) await S.files.put({ id: f.id, name: f.name, type: f.type, size: f.size, blob, createdAt: Date.now() });
      }
    } catch (e) {
      console.warn(e);
      toast('Os anexos não puderam ser restaurados.', 'error');
    }
    const ids = new Set((payload.files || []).map((f) => f.id));
    data.certificates.forEach((c) => (c.attachments = c.attachments.filter((a) => ids.has(a.id))));
    Object.keys(objectURLs).forEach(revokeFileURL);
    state = data;
    commit();
    toast('Backup importado');
  }

  async function wipeAll() {
    if (!confirm('Apagar TODOS os dados? Matérias, grade, frequência, atestados e anexos serão excluídos deste aparelho.')) return;
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita. Considere exportar um backup antes.')) return;
    S.clearData();
    try {
      await S.files.clear();
    } catch (e) {
      console.warn(e);
    }
    Object.keys(objectURLs).forEach(revokeFileURL);
    state = defaultState();
    while (sheets.length) closeSheet();
    ui.tab = 'home';
    commit();
    toast('Todos os dados foram apagados');
  }

  /* ================================================================== */
  /* Eventos                                                             */
  /* ================================================================== */

  const actions = {
    tab: (el) => goTab(el.dataset.tab),
    'close-sheet': () => closeSheet(),
    'open-subject': (el) => openSheet(subjectSheet(el.dataset.id)),
    'add-subject': () => openSheet(addSubjectSheet()),
    'restore-subjects'() {
      const existing = new Set(state.subjects.map((s) => s.name.toLowerCase()));
      const missing = C.DEFAULT_SUBJECTS.filter(([n]) => !existing.has(n.toLowerCase()));
      if (!missing.length) return toast('Todas as matérias padrão já estão cadastradas.');
      if (!confirm('Adicionar ' + missing.length + ' matéria(s) padrão que estão faltando?\n' + missing.map((m) => m[0]).join(', '))) return;
      missing.forEach(([name, total]) => state.subjects.push({ id: uid(), name, total, attendance: {} }));
      commit();
    },
    'subjects-mode'(el) {
      ui.subjectsMode = el.dataset.mode;
      render();
    },
    'quick-entry'() {
      ui.subjectsMode = 'quick';
      goTab('subjects');
    },
    'new-lesson': (el) => {
      if (!state.subjects.length) return toast('Cadastre matérias primeiro.', 'error');
      openSheet(lessonSheet(null, el.dataset.day ? +el.dataset.day : null));
    },
    'edit-lesson': (el) => openSheet(lessonSheet(el.dataset.id)),
    'new-cert': () => openSheet(certSheet(null)),
    'edit-cert': (el) => openSheet(certSheet(el.dataset.id)),
    'open-import': (el) => openSheet(importSheet(el.dataset.kind)),
    'dismiss-tip'() {
      state.settings.tipDismissed = true;
      commit();
    },
    export: () => exportData(),
    wipe: () => wipeAll(),
  };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const name = t.dataset.action;
    const top = topSheet();
    const inSheet = top && top.el.contains(t);
    const fn = (inSheet && top.ctrl.actions && top.ctrl.actions[name]) || actions[name];
    if (!fn) return;
    if (t.tagName === 'BUTTON' || t.tagName === 'A') e.preventDefault();
    Promise.resolve()
      .then(() => fn.call(inSheet ? top.ctrl : null, t, e))
      .catch((err) => {
        console.error(err);
        toast('Ocorreu um erro. Tente novamente.', 'error');
      });
  });

  function inTopSheet(target) {
    const top = topSheet();
    return top && top.el.contains(target) ? top : null;
  }

  document.addEventListener('input', (e) => {
    const top = inTopSheet(e.target);
    if (top) {
      if (top.ctrl.onInput) top.ctrl.onInput.call(top.ctrl, e);
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    const top = inTopSheet(t);
    if (top) {
      if (top.ctrl.onChange) top.ctrl.onChange.call(top.ctrl, e);
      return;
    }
    if (t.dataset.setting) {
      const k = t.dataset.setting;
      state.settings[k] = t.type === 'checkbox' ? t.checked : k === 'attentionMargin' ? +t.value : t.value;
      commit();
      return;
    }
    if (t.dataset.quick) {
      saveQuick(t);
      return;
    }
    if (t.id === 'import-backup' && t.files && t.files[0]) {
      importData(t.files[0]);
      t.value = '';
    }
  });

  /** Lançamento rápido: salva um campo sem redesenhar a lista (mantém o foco no iPhone). */
  function saveQuick(input) {
    const id = input.dataset.quick;
    const s = getSubject(id);
    if (!s) return;
    const k = input.dataset.field;
    const raw = input.value.trim();
    const att = Object.assign({}, s.attendance);
    if (raw === '') delete att[k];
    else att[k] = raw;
    const errors = C.validateAttendance(att);
    const errEl = $('#qe-' + CSS.escape(id));
    $$('[data-quick="' + CSS.escape(id) + '"]').forEach((i) => i.classList.toggle('invalid', !!errors[i.dataset.field]));
    if (Object.keys(errors).length) {
      errEl.textContent = Object.values(errors)[0];
      return;
    }
    errEl.textContent = '';
    const clean = {};
    Object.keys(att).forEach((key) => {
      const n = C.toNum(att[key]);
      if (n !== null) clean[key] = n;
    });
    s.attendance = clean;
    persist();
    recompute();
    const r = resultFor(id);
    $('#qr-' + CSS.escape(id)).innerHTML = quickResult(r);
    errEl.textContent = r.warnings[0] ? '⚠️ ' + r.warnings[0] : '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheets.length) closeSheet();
  });

  /* ================================================================== */
  /* Início                                                              */
  /* ================================================================== */

  recompute();
  if (firstRun) persist();
  render();
  S.requestPersistence();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW não registrado', e));
    });
  }

  // Exposto para testes automatizados.
  window.__app = { getState: () => state, getCalc: () => calc };
})();
