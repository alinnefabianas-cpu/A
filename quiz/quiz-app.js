/*
 * Dopamine Rewire — interface do quiz (quiz-foco.html) e do resultado
 * (resultado.html). O progresso fica no sessionStorage (só as letras das
 * respostas; nada pessoal e nada na URL), então atualizar a página não perde
 * o contexto durante a sessão.
 */
(function () {
  'use strict';

  const L = window.QuizLogic;
  const CFG = window.DR_QUIZ_CONFIG || {};
  const A = window.DRAnalytics || { track() {}, isDev: () => false };
  const STORE_KEY = 'dr-quiz-v1';
  const VIEWED_KEY = 'dr-quiz-result-viewed';
  const QUIZ_URL = 'quiz-foco.html';
  const RESULT_URL = 'resultado.html';
  const LOGO_SRC = CFG.logoSrc || 'quiz/assets/logo.png';
  const TOTAL = L.QUESTIONS.length;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LOAD_MS = reducedMotion ? 500 : 1700;

  const root = document.getElementById('quiz-root');
  const page = document.body.dataset.page;
  // Versão de página única (scripts/build-quiz-artifact.js): o resultado aparece na mesma página.
  const SINGLE = window.__DR_SINGLE_PAGE === true;

  /* ----------------------------- utilidades ----------------------------- */

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pad2 = (n) => String(n).padStart(2, '0');
  const profileProp = (key) => (CFG.analyticsIncludeProfile && key ? L.PROFILES[key].id : undefined);
  const productName = esc(CFG.productName || 'Dopamine Rewire');

  let storageOk = true;
  let memoryState = null; // reserva quando o sessionStorage não está disponível

  function loadState() {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      return L.sanitizeState(raw ? JSON.parse(raw) : null);
    } catch (e) {
      storageOk = false;
      return L.sanitizeState(memoryState);
    }
  }

  function saveState(s) {
    memoryState = s;
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(s));
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
  }

  function clearState() {
    memoryState = null;
    try {
      sessionStorage.removeItem(STORE_KEY);
      sessionStorage.removeItem(VIEWED_KEY);
    } catch (e) {
      /* sem armazenamento: nada a limpar */
    }
  }

  function readViewed() {
    try {
      return sessionStorage.getItem(VIEWED_KEY);
    } catch (e) {
      return null;
    }
  }

  /** Só aceita links http(s); evita javascript: e afins vindos da configuração. */
  function safeUrl(u, allowRelative) {
    if (!u || typeof u !== 'string') return null;
    try {
      const url = new URL(u, location.href);
      if (url.protocol === 'https:' || (url.protocol === 'http:' && A.isDev())) return url.href;
      if (allowRelative && url.protocol === 'data:' && /^data:image\//.test(u)) return u;
    } catch (e) {
      /* URL inválida */
    }
    return null;
  }

  function render(html, view, focusSelector) {
    document.body.dataset.view = view;
    root.innerHTML = html;
    bindLogos(root);
    if (!reducedMotion) {
      root.classList.remove('enter');
      void root.offsetWidth; // reinicia a animação de entrada
      root.classList.add('enter');
    }
    const target = root.querySelector(focusSelector || '[data-focus]');
    if (target) target.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  /* ------------------------------- ícones ------------------------------- */
  // Ícones lineares (traço 1,8) desenhados para o quiz.
  const svg = (body, vb) =>
    `<svg viewBox="${vb || '0 0 24 24'}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const I = {
    next: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    back: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    check: svg('<path d="M5 12.5l4.2 4.2L19 7"/>'),
    chevron: svg('<path d="M9 6l6 6-6 6"/>'),
    restart: svg('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>'),
    clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    person: svg('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5"/>'),
    compass: svg('<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
    lock: svg('<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
    shield: svg('<path d="M12 3.5l7 2.8v5.4c0 4.3-2.9 7.7-7 8.8-4.1-1.1-7-4.5-7-8.8V6.3z"/><path d="M9 12l2.2 2.2L15.5 10"/>'),
    form: svg('<rect x="4.5" y="4" width="15" height="16" rx="2.5"/><path d="M8 9h8M8 13h5"/><path d="M4 4l16 16"/>'),
    target: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
    alert: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.8v5M12 16.2v.1"/>'),
    // perfis
    A: svg('<path d="M6.5 15.5V11a5.5 5.5 0 0 1 9.4-3.9"/><path d="M17.5 11v4.5l1.5 2H5"/><path d="M10 20h4"/><path d="M4 4l16 16"/>'),
    B: svg('<path d="M9 6.5h10M9 12h10M9 17.5h10"/><circle cx="5" cy="6.5" r="1.2" fill="currentColor"/><path d="M4.2 12h1.6M4.2 17.5h1.6"/>'),
    C: svg('<path d="M12 4l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 16l8 4 8-4"/>'),
    D: svg('<circle cx="12" cy="12" r="8.5"/><path d="M10 8.8l5 3.2-5 3.2z" fill="currentColor"/>'),
    // funcionalidades (configuráveis)
    focus: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
    list: svg('<path d="M9 6.5h10M9 12h10M9 17.5h10M4.5 6.5h.5M4.5 12h.5M4.5 17.5h.5"/>'),
    calendar: svg('<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
    timer: svg('<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2 1.5M10 3.5h4"/>'),
    chart: svg('<path d="M4.5 19.5h15"/><path d="M7.5 16v-4M12 16V8M16.5 16v-6"/>'),
    bell: svg('<path d="M6.5 16V11a5.5 5.5 0 0 1 11 0v5l1.5 2h-14z"/><path d="M10 20.5h4"/>'),
  };
  const FEATURE_ICONS = ['focus', 'list', 'calendar', 'check', 'timer', 'chart', 'bell'];

  /* -------------------------------- logo -------------------------------- */
  // A logo oficial é usada inteira (com o fundo turquesa embutido) como ícone de
  // cantos arredondados. Sem o arquivo, fica só o nome — o símbolo não é redesenhado.
  const logoMark = () =>
    logoState === 'missing'
      ? '<span class="logo-mark" data-logo></span>' // já se sabe que falta: não pede a imagem de novo
      : `<span class="logo-mark" data-logo><img src="${esc(LOGO_SRC)}" alt="" decoding="async"></span>`;
  const brandHTML = (cls) =>
    `<span class="brand ${cls || ''}">${logoMark()}<span class="wordmark">DOPAMINE REWIRE</span></span>`;

  let logoState = 'unknown'; // 'ok' | 'missing' | 'unknown'
  function applyLogoState(el) {
    if (logoState === 'missing') {
      el.classList.add(A.isDev() ? 'is-placeholder' : 'is-missing');
      if (A.isDev()) el.setAttribute('title', 'Adicione quiz/assets/logo.png');
      if (A.isDev() && !el.querySelector('.ph')) el.insertAdjacentHTML('beforeend', '<span class="ph" aria-hidden="true">logo</span>');
    }
  }
  function bindLogos(scope) {
    scope.querySelectorAll('[data-logo]').forEach((el) => {
      const img = el.querySelector('img');
      if (logoState !== 'unknown' || !img) return applyLogoState(el);
      const fail = () => {
        logoState = 'missing';
        document.querySelectorAll('[data-logo]').forEach(applyLogoState);
      };
      if (img.complete && img.naturalWidth === 0) fail();
      else if (img.complete) logoState = 'ok';
      else {
        img.addEventListener('error', fail, { once: true });
        img.addEventListener('load', () => (logoState = 'ok'), { once: true });
      }
    });
  }

  /* ------------------------------ ilustração ------------------------------ */
  function ringsSVG(cx, radii, cls, opacityFrom, extra) {
    return radii
      .map((r, i) => {
        const o = (opacityFrom - (i * opacityFrom) / (radii.length + 1)).toFixed(3);
        return `<circle class="${cls}" cx="${cx}" cy="${cx}" r="${r}" stroke-width="${i === 0 ? 2.2 : 1.4}" stroke-opacity="${o}" ${extra || ''}/>`;
      })
      .join('');
  }

  // Anéis concêntricos (o símbolo da marca) com quatro nós: as quatro áreas que o quiz observa.
  function focusArt() {
    const nodes = [
      [118, 132],
      [410, 178],
      [96, 372],
      [392, 414],
    ];
    const links = nodes
      .map(([x, y]) => `<path class="fa-link" d="M260 260 Q ${(x + 260) / 2 + (y > 260 ? -30 : 30)} ${(y + 260) / 2} ${x} ${y}"/>`)
      .join('');
    const dots = nodes
      .map(([x, y]) => `<circle class="fa-node" cx="${x}" cy="${y}" r="9"/><circle class="fa-node-core" cx="${x}" cy="${y}" r="3.5"/>`)
      .join('');
    return `
      <svg class="focus-art" viewBox="0 0 520 520" aria-hidden="true">
        <defs>
          <radialGradient id="fa-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="var(--brand)" stop-opacity="0.22"/>
            <stop offset="0.55" stop-color="var(--brand)" stop-opacity="0.07"/>
            <stop offset="1" stop-color="var(--brand)" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="260" cy="260" r="250" fill="url(#fa-glow)"/>
        <g class="fa-pulse">${ringsSVG(260, [70, 112, 154, 196, 238], 'fa-ring', 0.55)}</g>
        ${links}${dots}
        <circle cx="260" cy="260" r="52" fill="var(--white)" stroke="var(--brand)" stroke-opacity="0.35" stroke-width="1.5"/>
      </svg>
      <span class="art-center">${logoMark()}</span>`;
  }

  const DISCLAIMER =
    'Este quiz oferece uma orientação baseada nas suas respostas. Não é um diagnóstico nem uma avaliação médica ou psicológica.';

  /* ================================ QUIZ ================================ */

  let state = null;
  let pointerSelect = false; // seleção feita com toque/mouse → avança sozinho
  let advanceTimer = null;

  function startQuiz() {
    state = L.emptyState();
    state.started = true;
    saveState(state);
    A.track('quiz_started', { total_questions: TOTAL });
    renderQuestion();
  }

  function renderIntro() {
    const tags = L.OPTION_KEYS.map(
      (k, i) => `<span class="art-tag t${i + 1}" aria-hidden="true"><i>${k}</i>${esc(L.PROFILES[k].name)}</span>`
    ).join('');
    render(
      `
      <section class="intro" aria-labelledby="intro-title">
        <div class="intro-copy">
          <p class="eyebrow">Quiz de foco · ${TOTAL} perguntas</p>
          <h1 id="intro-title" tabindex="-1" data-focus>Descubra o que está atrapalhando seu <span class="hl">foco</span>.</h1>
          <p class="lead">Entenda o que pode estar dificultando sua rotina e descubra um próximo passo para organizar melhor sua atenção.</p>
          <ul class="intro-points" aria-label="Como funciona">
            <li><span class="ic">${I.clock}</span>Quiz rápido</li>
            <li><span class="ic">${I.person}</span>Resultado personalizado</li>
            <li><span class="ic">${I.compass}</span>Orientação prática</li>
          </ul>
          <div class="intro-cta">
            <button type="button" class="btn btn-primary btn-lg" data-action="start">Descobrir meu perfil ${I.next}</button>
          </div>
          <p class="intro-meta">
            <span>${I.clock}Cerca de 2 minutos</span>
            <span>${I.lock}Sem cadastro; as respostas ficam neste navegador</span>
          </p>
        </div>
        <div class="intro-visual">${focusArt()}${tags}</div>
      </section>
      ${footer()}
    `,
      'intro'
    );
  }

  function progressHTML(answered, i) {
    const pct = Math.round((answered / TOTAL) * 100);
    const steps = L.QUESTIONS.map((_, n) => `<span class="${n < answered ? 'done' : ''}"></span>`).join('');
    return `
      <div class="q-head">
        <div class="q-head-row">
          <p class="q-count" aria-hidden="true"><b>${pad2(i + 1)}</b><span>de ${pad2(TOTAL)}</span></p>
          <button type="button" class="link-btn" data-action="restart">${I.restart}Reiniciar</button>
        </div>
        <div class="progress" role="progressbar" aria-label="Progresso do quiz" aria-valuemin="0" aria-valuemax="${TOTAL}"
             aria-valuenow="${answered}" aria-valuetext="Pergunta ${i + 1} de ${TOTAL}, ${answered} respondidas">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-steps" aria-hidden="true">${steps}</div>
      </div>`;
  }

  function renderQuestion() {
    clearTimeout(advanceTimer);
    const i = state.current;
    const q = L.QUESTIONS[i];
    const selected = state.answers[i];
    const isLast = i === TOTAL - 1;
    const answered = state.answers.filter(Boolean).length;
    const opts = L.OPTION_KEYS.map(
      (k) => `
        <label class="opt">
          <input type="radio" name="q${i}" id="q${i}-${k}" value="${k}" ${selected === k ? 'checked' : ''}>
          <span class="opt-box">
            <span class="opt-key" aria-hidden="true">${k}</span>
            <span class="opt-text">${esc(q.options[k])}</span>
            <span class="opt-check" aria-hidden="true">${I.check}</span>
          </span>
        </label>`
    ).join('');

    render(
      `
      <div class="q-wrap">
        ${progressHTML(answered, i)}
        <form class="q-card" data-form novalidate>
          <fieldset>
            <legend><h1 class="q-title" tabindex="-1" data-focus><span class="sr-only">Pergunta ${i + 1} de ${TOTAL}: </span>${esc(q.text)}</h1></legend>
            <div class="options">${opts}</div>
          </fieldset>
          <p class="form-error" role="alert" data-error hidden>${I.alert}Escolha uma alternativa para continuar.</p>
          <div class="q-actions">
            <button type="button" class="btn btn-ghost" data-action="back">${I.back} Voltar</button>
            <button type="submit" class="btn btn-primary" data-next ${selected ? '' : 'aria-disabled="true"'}>
              ${isLast ? 'Ver meu resultado' : 'Continuar'} ${I.next}
            </button>
          </div>
        </form>
        <p class="q-note">Escolha a alternativa que mais se parece com você hoje.</p>
      </div>
    `,
      'question'
    );
  }

  function updateProgress() {
    const answered = state.answers.filter(Boolean).length;
    const bar = root.querySelector('.progress');
    if (!bar) return;
    bar.querySelector('.progress-fill').style.width = Math.round((answered / TOTAL) * 100) + '%';
    bar.setAttribute('aria-valuenow', String(answered));
    bar.setAttribute('aria-valuetext', `Pergunta ${state.current + 1} de ${TOTAL}, ${answered} respondidas`);
    root.querySelectorAll('.progress-steps span').forEach((s, n) => s.classList.toggle('done', n < answered));
  }

  function selectAnswer(key) {
    const i = state.current;
    const first = state.answers[i] === null;
    state.answers[i] = key;
    saveState(state);
    if (first) A.track('quiz_question_answered', { question: i + 1, total_questions: TOTAL });

    const next = root.querySelector('[data-next]');
    if (next) next.removeAttribute('aria-disabled');
    const err = root.querySelector('[data-error]');
    if (err) err.hidden = true;
    updateProgress();

    if (pointerSelect && i < TOTAL - 1) {
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(goNext, reducedMotion ? 150 : 480);
    }
  }

  function goNext() {
    const i = state.current;
    if (!state.answers[i]) {
      const err = root.querySelector('[data-error]');
      if (err) err.hidden = false;
      return;
    }
    if (i < TOTAL - 1) {
      state.current = i + 1;
      saveState(state);
      renderQuestion();
      return;
    }
    finishQuiz();
  }

  function goBack() {
    clearTimeout(advanceTimer);
    if (state.current === 0) {
      // Voltar da primeira pergunta leva à abertura, sem apagar respostas.
      state.started = false;
      saveState(state);
      renderIntro();
      return;
    }
    state.current -= 1;
    saveState(state);
    renderQuestion();
  }

  function finishQuiz() {
    if (!L.isComplete(state.answers)) {
      // Nunca envia respostas incompletas: volta para a primeira sem resposta.
      state.current = state.answers.indexOf(null);
      saveState(state);
      renderQuestion();
      return;
    }
    const result = L.classify(state.answers);
    A.track('quiz_completed', { total_questions: TOTAL, profile: profileProp(result.key) });

    render(
      `
      <section class="loading" aria-live="polite" aria-busy="true">
        <div class="pulse-logo" aria-hidden="true">
          <span class="ring"></span><span class="ring"></span><span class="ring"></span>
          <span class="halo"></span>
          ${logoMark()}
        </div>
        <span class="wordmark" aria-hidden="true">DOPAMINE REWIRE</span>
        <h1 tabindex="-1" data-focus>Preparando seu resultado…</h1>
        <p>Estamos organizando suas respostas para apresentar seu perfil.</p>
        <div class="load-line" aria-hidden="true" style="--load-ms:${LOAD_MS}ms"><span></span></div>
      </section>
    `,
      'loading'
    );
    setTimeout(() => {
      if (storageOk && !SINGLE) location.assign(RESULT_URL);
      else renderResult(state.answers, true); // página única ou sem sessionStorage: mostra aqui mesmo
    }, LOAD_MS + 150);
  }

  function restart() {
    clearTimeout(advanceTimer);
    clearState();
    if (page === 'quiz') {
      state = L.emptyState();
      renderIntro();
    } else {
      location.assign(QUIZ_URL);
    }
  }

  /* ============================== RESULTADO ============================== */

  function renderEmptyResult() {
    const s = loadState();
    const hasProgress = s.answers.some(Boolean);
    const storageMsg = storageOk
      ? ''
      : `<p class="form-error" role="alert">${I.alert}Seu navegador bloqueou o armazenamento da sessão. Responda ao quiz sem fechar a página para ver o resultado.</p>`;
    render(
      `
      <section class="empty" aria-labelledby="empty-title">
        <p class="eyebrow">Resultado</p>
        <h1 id="empty-title" tabindex="-1" data-focus>Ainda não há um resultado para mostrar</h1>
        <p class="lead">O resultado é montado a partir das suas respostas nesta sessão. ${
          hasProgress ? 'Você parou no meio do quiz; dá para continuar de onde estava.' : 'Responda às perguntas para descobrir seu perfil.'
        }</p>
        ${storageMsg}
        <div class="actions">
          <a class="btn btn-primary btn-lg" href="${QUIZ_URL}">${hasProgress ? 'Continuar o quiz' : 'Começar o quiz'} ${I.next}</a>
          ${hasProgress ? `<button type="button" class="btn btn-ghost" data-action="restart">${I.restart} Começar do zero</button>` : ''}
        </div>
      </section>
      ${footer()}
    `,
      'empty'
    );
  }

  function breakdown(counts, winner) {
    return L.OPTION_KEYS.map((k) => {
      const pct = Math.round((counts[k] / TOTAL) * 100);
      return `
        <li class="bar-row${k === winner ? ' is-winner' : ''}">
          <span class="bar-name">${esc(L.PROFILES[k].name)}</span>
          <span class="bar-val">${counts[k]} de ${TOTAL}</span>
          <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${pct}%"></span></span>
        </li>`;
    }).join('');
  }

  function emblem(key) {
    return `
      <div class="emblem" aria-hidden="true">
        <svg class="rings" viewBox="0 0 260 260">
          ${ringsSVG(130, [56, 78, 100, 122], 'r', 0.6)}
          <g class="spin"><circle cx="130" cy="130" r="111" stroke-width="2" stroke-dasharray="2 14" stroke-opacity="0.8"/></g>
        </svg>
        <div class="core">${I[key]}</div>
      </div>`;
  }

  function formatPrice(p) {
    if (!p || typeof p.amount !== 'number' || !isFinite(p.amount)) return null;
    try {
      const v = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: p.currency || 'BRL' }).format(p.amount);
      return { value: v, period: p.period || 'mês' };
    } catch (e) {
      return null;
    }
  }

  const strList = (v) => (Array.isArray(v) ? v.filter((b) => typeof b === 'string' && b.trim()) : []);
  const devNotice = (items) =>
    A.isDev() && items.length
      ? `<div class="dev-notice" role="note"><strong>Configuração pendente (visível só em desenvolvimento):</strong> defina ${items.join(
          ', '
        )} em <code>quiz/quiz-config.js</code>. Visitantes não veem valores fictícios.</div>`
      : '';

  function phoneScreen(r) {
    const shots = strList(CFG.screenshots).map((u) => safeUrl(u, true) || (/^[\w./-]+$/.test(u) ? u : null)).filter(Boolean);
    if (shots.length) {
      return {
        screen: `<img src="${esc(shots[0])}" alt="Tela do ${productName}">`,
        caption: `Tela do ${productName}`,
      };
    }
    const p = r.profile;
    return {
      screen: `
        <div class="s-brand">${logoMark()}<span class="wordmark">DOPAMINE REWIRE</span></div>
        <p class="s-label">Seu ponto de partida</p>
        <p class="s-title">${esc(p.name)}</p>
        <div class="s-card">
          <p class="s-label">Seu primeiro passo</p>
          <p>${esc(p.nextStep)}</p>
        </div>
        <svg class="s-rings" viewBox="0 0 120 120" aria-hidden="true">${ringsSVG(60, [14, 28, 42, 56], 'r', 0.7)}</svg>`,
      caption: 'Prévia montada com o seu resultado do quiz.',
    };
  }

  function showcaseSection(r) {
    const features = (Array.isArray(CFG.features) ? CFG.features : []).filter(
      (f) => f && typeof f.title === 'string' && f.title.trim()
    );
    const missing = [];
    if (!features.length) missing.push('<code>features</code> (funcionalidades reais do miniapp)');
    if (!strList(CFG.screenshots).length) missing.push('<code>screenshots</code> (capturas reais, opcional)');
    const phone = phoneScreen(r);
    const cards = features
      .map((f) => {
        const ic = FEATURE_ICONS.indexOf(f.icon) !== -1 ? I[f.icon] : I.focus;
        return `<li class="feature"><span class="ic">${ic}</span><h3>${esc(f.title)}</h3>${f.text ? `<p>${esc(f.text)}</p>` : ''}</li>`;
      })
      .join('');
    return `
      <section class="showcase" id="apresentacao" aria-labelledby="showcase-title">
        <div class="showcase-copy">
          ${devNotice(missing)}
          ${brandHTML()}
          <div class="section-head">
            <h2 id="showcase-title" tabindex="-1">Agora, transforme seu resultado em um plano de ação.</h2>
            <p class="lead">Conheça o ${productName} e descubra como suas ferramentas podem ajudar você a organizar sua rotina.</p>
          </div>
          ${cards ? `<ul class="features">${cards}</ul>` : ''}
          <div class="actions">
            <a class="btn btn-primary btn-lg" href="#assinatura" data-action="to-section" data-target="assinatura">Ver a assinatura ${I.down}</a>
          </div>
        </div>
        <div class="phone-stage">
          <div class="phone" role="img" aria-label="${esc(phone.caption)}"><div class="screen">${phone.screen}</div></div>
          <p class="phone-caption">${esc(phone.caption)}</p>
        </div>
      </section>`;
  }

  function pricingSection() {
    const price = formatPrice(CFG.price);
    const checkout = safeUrl(CFG.checkoutUrl);
    const product = safeUrl(CFG.productUrl);
    const href = checkout || product;
    const benefits = strList(CFG.benefits);
    const billing = typeof CFG.billingNote === 'string' && CFG.billingNote.trim() ? CFG.billingNote.trim() : '';
    const provider = typeof CFG.paymentProvider === 'string' && CFG.paymentProvider.trim() ? CFG.paymentProvider.trim() : '';

    const missing = [];
    if (!price) missing.push('<code>price</code> (preço mensal)');
    if (!billing) missing.push('<code>billingNote</code> (cobrança e cancelamento)');
    if (!href) missing.push('<code>checkoutUrl</code> ou <code>productUrl</code>');
    if (!benefits.length) missing.push('<code>benefits</code>');

    const cta = href
      ? `<a class="btn btn-primary btn-lg btn-block" href="${esc(href)}" data-offer-cta data-dest="${checkout ? 'checkout' : 'product'}" rel="noopener">Quero começar agora ${I.next}</a>`
      : `<button type="button" class="btn btn-primary btn-lg btn-block" aria-disabled="true" aria-describedby="cta-soon">Quero começar agora ${I.next}</button>
         <p class="meta" id="cta-soon">A assinatura estará disponível em breve.</p>`;

    const trust = [
      provider && checkout ? `<li>${I.lock}Pagamento processado por ${esc(provider)}</li>` : '',
      `<li>${I.shield}Suas respostas do quiz ficam apenas neste navegador</li>`,
      `<li>${I.form}O quiz não pede nome, e-mail nem telefone</li>`,
    ].join('');

    return `
      <section class="pricing" id="assinatura" aria-labelledby="pricing-title" data-offer>
        <div class="section-head">
          <p class="eyebrow">Assinatura</p>
          <h2 id="pricing-title" tabindex="-1">Tenha um plano mais claro para o seu dia.</h2>
        </div>
        <div class="plan">
          ${devNotice(missing)}
          ${brandHTML()}
          <div class="plan-top">
            <p class="plan-name">${esc(CFG.planName || 'Assinatura mensal')}</p>
            ${price ? `<p class="price"><span class="price-value">${esc(price.value)}</span><span class="price-period">/${esc(price.period)}</span></p>` : ''}
          </div>
          ${benefits.length ? `<ul class="benefits">${benefits.map((b) => `<li><span class="ck">${I.check}</span><span>${esc(b)}</span></li>`).join('')}</ul>` : ''}
          ${cta}
          ${billing ? `<p class="billing">${esc(billing)}</p>` : ''}
          <ul class="trust">${trust}</ul>
        </div>
      </section>`;
  }

  function footer() {
    return `
      <footer class="site-foot">
        ${brandHTML()}
        <p class="disclaimer">${DISCLAIMER}</p>
      </footer>`;
  }

  function renderResult(answers, inline) {
    const r = L.classify(answers);
    if (!r) return renderEmptyResult();
    const p = r.profile;

    render(
      `
      <section class="result-hero" aria-labelledby="result-title">
        <div class="result-copy">
          <div class="profile-seal"><span class="seal">Seu perfil</span><span class="profile-name">${esc(p.name)}</span></div>
          <h1 id="result-title" tabindex="-1" data-focus>${esc(p.title)}</h1>
          <p class="lead">${esc(p.description)}</p>
          <div class="step-card">
            <span class="step-icon" aria-hidden="true">${I.target}</span>
            <div class="step-body">
              <h2 class="step-label">Seu primeiro passo</h2>
              <p class="step-text">${esc(p.nextStep)}</p>
            </div>
            ${p.example ? `<p class="step-example"><b>Exemplo</b><span>${esc(p.example)}</span></p>` : ''}
          </div>
          <details class="breakdown">
            <summary>${I.chevron}Como suas respostas se distribuíram</summary>
            <ul class="bars">${breakdown(r.counts, r.key)}</ul>
            ${r.tie ? '<p class="meta">Houve empate; prevaleceu o perfil da sua resposta mais recente entre os empatados.</p>' : ''}
          </details>
          <div class="actions">
            <a class="btn btn-primary btn-lg" href="#apresentacao" data-action="to-section" data-target="apresentacao">Conhecer o ${productName} ${I.down}</a>
            <button type="button" class="btn btn-ghost" data-action="restart">${I.restart} Refazer o quiz</button>
          </div>
        </div>
        ${emblem(r.key)}
      </section>
      ${showcaseSection(r)}
      ${pricingSection()}
      ${footer()}
    `,
      'result'
    );

    // Evita contar a mesma visualização ao atualizar a página.
    const sig = answers.join('');
    const seen = readViewed();
    try {
      sessionStorage.setItem(VIEWED_KEY, sig);
    } catch (e) {
      /* sem armazenamento */
    }
    if (seen !== sig || inline) A.track('quiz_result_viewed', { profile: profileProp(r.key) });
    offerViewed = false;
    observeOffer(r.key);
  }

  let offerViewed = false;
  function trackOfferViewed(key) {
    if (offerViewed) return;
    offerViewed = true;
    A.track('offer_viewed', { profile: profileProp(key) });
  }

  function observeOffer(key) {
    const el = root.querySelector('[data-offer]');
    if (!el) return;
    const fire = () => trackOfferViewed(key);
    if (!('IntersectionObserver' in window)) return fire();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          fire();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
  }

  /* ================================ eventos ================================ */

  root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.opt')) pointerSelect = true;
  });
  root.addEventListener('keydown', (e) => {
    pointerSelect = false;
    // Enter numa alternativa confirma e avança.
    if (e.key === 'Enter' && e.target.matches('.opt input')) {
      e.preventDefault();
      goNext();
    }
  });

  root.addEventListener('change', (e) => {
    if (e.target.matches('.opt input') && state) selectAnswer(e.target.value);
    pointerSelect = false;
  });

  root.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-form]')) return;
    e.preventDefault();
    clearTimeout(advanceTimer);
    goNext();
  });

  root.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-offer-cta]');
    if (cta) {
      const r = L.classify(loadState().answers);
      const key = r && r.key;
      const dest = cta.dataset.dest;
      trackOfferViewed(key);
      A.track('offer_clicked', { profile: profileProp(key), destination: dest });
      // Só inicia checkout; a assinatura é confirmada pelo provedor/backend.
      if (dest === 'checkout') A.track('checkout_started', { profile: profileProp(key) });
      return;
    }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'start') startQuiz();
    else if (action === 'back') goBack();
    else if (action === 'restart') restart();
    else if (action === 'to-section') {
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        const h = target.querySelector('h2');
        if (h) h.focus({ preventScroll: true });
      }
    }
  });

  /* ================================ início ================================ */

  function init() {
    if (!L || !root) return;
    bindLogos(document);
    try {
      if (page === 'result') {
        const s = loadState();
        if (L.isComplete(s.answers)) renderResult(s.answers);
        else renderEmptyResult();
      } else {
        state = loadState();
        if (SINGLE && L.isComplete(state.answers) && readViewed() === state.answers.join('')) renderResult(state.answers);
        else if (state.started) renderQuestion();
        else renderIntro();
      }
    } catch (err) {
      console.error(err);
      root.innerHTML = `
        <section class="empty" role="alert">
          <h1>Algo deu errado ao carregar o quiz</h1>
          <p class="lead">Atualize a página para tentar novamente.</p>
          <button type="button" class="btn btn-primary" onclick="location.reload()">Atualizar</button>
        </section>`;
    }
  }

  init();
})();
