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
  const TOTAL = L.QUESTIONS.length;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.getElementById('quiz-root');
  const page = document.body.dataset.page;

  /* ----------------------------- utilidades ----------------------------- */

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const profileProp = (key) => (CFG.analyticsIncludeProfile && key ? L.PROFILES[key].id : undefined);

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

  /** Só aceita links http(s); evita javascript: e afins vindos da configuração. */
  function safeUrl(u) {
    if (!u || typeof u !== 'string') return null;
    try {
      const url = new URL(u, location.href);
      if (url.protocol === 'https:' || (url.protocol === 'http:' && A.isDev())) return url.href;
    } catch (e) {
      /* URL inválida */
    }
    return null;
  }

  function render(html, focusSelector) {
    root.innerHTML = html;
    if (!reducedMotion) {
      root.classList.remove('enter');
      void root.offsetWidth; // reinicia a animação de entrada
      root.classList.add('enter');
    }
    const target = root.querySelector(focusSelector || '[data-focus]');
    if (target) target.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  const ICON_CHECK =
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_BACK =
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_NEXT =
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
    render(`
      <section class="card intro" aria-labelledby="intro-title">
        <p class="eyebrow">Quiz gratuito · ${TOTAL} perguntas</p>
        <h1 id="intro-title" tabindex="-1" data-focus>Descubra o que está atrapalhando seu foco</h1>
        <p class="lead">Responda a algumas perguntas rápidas e descubra qual dificuldade pode estar dificultando sua rotina — além de receber um próximo passo para começar a melhorar.</p>
        <button type="button" class="btn btn-primary btn-lg" data-action="start">Descobrir meu perfil ${ICON_NEXT}</button>
        <p class="meta">Leva aproximadamente 2 minutos.</p>
      </section>
      <p class="disclaimer">${DISCLAIMER}</p>
    `);
  }

  function progressBar(step, label) {
    const pct = Math.round((step / TOTAL) * 100);
    return `
      <div class="progress-wrap">
        <div class="progress-label"><span>${esc(label)}</span><span aria-hidden="true">${pct}%</span></div>
        <div class="progress" role="progressbar" aria-label="Progresso do quiz" aria-valuemin="0" aria-valuemax="${TOTAL}" aria-valuenow="${step}" aria-valuetext="${esc(label)}">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
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
          <input type="radio" name="q${i}" value="${k}" ${selected === k ? 'checked' : ''}>
          <span class="opt-box">
            <span class="opt-key" aria-hidden="true">${k}</span>
            <span class="opt-text">${esc(q.options[k])}</span>
            <span class="opt-check" aria-hidden="true">${ICON_CHECK}</span>
          </span>
        </label>`
    ).join('');

    render(`
      ${progressBar(answered, `Pergunta ${i + 1} de ${TOTAL}`)}
      <form class="card question" data-form novalidate>
        <fieldset>
          <legend><h1 class="q-title" tabindex="-1" data-focus>${esc(q.text)}</h1></legend>
          <p class="sr-only">Escolha uma alternativa.</p>
          <div class="options">${opts}</div>
        </fieldset>
        <p class="form-error" role="alert" data-error hidden>Escolha uma alternativa para continuar.</p>
        <div class="q-actions">
          <button type="button" class="btn btn-ghost" data-action="back">${ICON_BACK} Voltar</button>
          <button type="submit" class="btn btn-primary" data-next ${selected ? '' : 'aria-disabled="true"'}>
            ${isLast ? 'Ver meu resultado' : 'Continuar'} ${ICON_NEXT}
          </button>
        </div>
      </form>
      <div class="sub-actions">
        <button type="button" class="link-btn" data-action="restart">Reiniciar o quiz</button>
      </div>
    `);
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
    const fill = root.querySelector('.progress-fill');
    const answered = state.answers.filter(Boolean).length;
    if (fill) {
      fill.style.width = Math.round((answered / TOTAL) * 100) + '%';
      fill.parentElement.setAttribute('aria-valuenow', String(answered));
      fill.parentElement.previousElementSibling.lastElementChild.textContent =
        Math.round((answered / TOTAL) * 100) + '%';
    }

    if (pointerSelect && i < TOTAL - 1) {
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(goNext, reducedMotion ? 120 : 380);
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
      // Voltar da primeira pergunta leva à introdução, sem apagar respostas.
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

    render(`
      <section class="card loading" aria-live="polite" aria-busy="true">
        <span class="spinner" aria-hidden="true"></span>
        <p class="loading-text" tabindex="-1" data-focus>Analisando suas respostas…</p>
      </section>
    `);
    setTimeout(() => {
      if (storageOk) location.assign(RESULT_URL);
      else renderResult(state.answers, true); // sem sessionStorage: mostra aqui mesmo
    }, reducedMotion ? 400 : 1300);
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
      : '<p class="form-error" role="alert">Seu navegador bloqueou o armazenamento da sessão. Responda ao quiz sem fechar a página para ver o resultado.</p>';
    render(`
      <section class="card empty" aria-labelledby="empty-title">
        <p class="eyebrow">Resultado</p>
        <h1 id="empty-title" tabindex="-1" data-focus>Ainda não há um resultado para mostrar</h1>
        <p class="lead">O resultado é montado a partir das suas respostas nesta sessão. ${
          hasProgress ? 'Você parou no meio do quiz — dá para continuar de onde estava.' : 'Responda às perguntas para descobrir seu perfil.'
        }</p>
        ${storageMsg}
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="${QUIZ_URL}">${hasProgress ? 'Continuar o quiz' : 'Começar o quiz'} ${ICON_NEXT}</a>
          ${hasProgress ? '<button type="button" class="btn btn-ghost" data-action="restart">Começar do zero</button>' : ''}
        </div>
      </section>
    `);
  }

  function breakdown(counts, winner) {
    return L.OPTION_KEYS.map((k) => {
      const pct = Math.round((counts[k] / TOTAL) * 100);
      return `
        <li class="bar-row${k === winner ? ' is-winner' : ''}">
          <span class="bar-name">${esc(L.PROFILES[k].name)}</span>
          <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${pct}%"></span></span>
          <span class="bar-val">${counts[k]} de ${TOTAL}</span>
        </li>`;
    }).join('');
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

  function offerSection() {
    const dev = A.isDev();
    const price = formatPrice(CFG.price);
    const checkout = safeUrl(CFG.checkoutUrl);
    const product = safeUrl(CFG.productUrl);
    const href = checkout || product;
    const benefits = Array.isArray(CFG.benefits) ? CFG.benefits.filter((b) => typeof b === 'string' && b.trim()) : [];
    const name = esc(CFG.productName || 'Dopamine Rewire');

    const missing = [];
    if (!price) missing.push('<code>price</code> (preço mensal)');
    if (!href) missing.push('<code>checkoutUrl</code> ou <code>productUrl</code>');
    if (!benefits.length) missing.push('<code>benefits</code> (funcionalidades reais do miniapp)');
    const devNotice =
      dev && missing.length
        ? `<div class="dev-notice" role="note"><strong>Configuração pendente (visível só em desenvolvimento):</strong> defina ${missing.join(', ')} em <code>quiz/quiz-config.js</code>. Visitantes não veem valores fictícios.</div>`
        : '';

    const cta = href
      ? `<a class="btn btn-primary btn-lg btn-block" href="${esc(href)}" data-offer-cta data-dest="${checkout ? 'checkout' : 'product'}" rel="noopener">Quero conhecer o Dopamine Rewire ${ICON_NEXT}</a>`
      : `<button type="button" class="btn btn-primary btn-lg btn-block" aria-disabled="true" aria-describedby="cta-soon">Quero conhecer o Dopamine Rewire</button>
         <p class="meta" id="cta-soon">Disponível em breve.</p>`;

    return `
      <section class="card offer" id="oferta" aria-labelledby="offer-title" data-offer>
        ${devNotice}
        <div class="brand brand-lg">
          ${LOGO}
          <span class="brand-name">${name}</span>
        </div>
        <h2 id="offer-title">Agora, transforme seu resultado em um plano de ação.</h2>
        <p class="lead">Conhecer sua principal dificuldade é um primeiro passo. O próximo é criar uma rotina que ajude você a agir com mais clareza e consistência.</p>
        <p>O ${name} é uma ferramenta para apoiar a organização da sua rotina e a construção de hábitos, um passo de cada vez.</p>
        ${benefits.length ? `<ul class="benefits">${benefits.map((b) => `<li>${ICON_CHECK}<span>${esc(b)}</span></li>`).join('')}</ul>` : ''}
        ${price ? `<p class="price"><span class="price-value">${esc(price.value)}</span><span class="price-period">/${esc(price.period)}</span></p>` : ''}
        ${cta}
      </section>`;
  }

  function renderResult(answers, inline) {
    const r = L.classify(answers);
    if (!r) return renderEmptyResult();
    const p = r.profile;

    render(`
      <section class="card result" aria-labelledby="result-title">
        <p class="profile-chip"><span class="dot" aria-hidden="true"></span>Seu perfil: <strong>${esc(p.name)}</strong></p>
        <h1 id="result-title" tabindex="-1" data-focus>${esc(p.title)}</h1>
        <p class="lead">${esc(p.description)}</p>
        <div class="next-step">
          <h2>Seu próximo passo</h2>
          <p>${esc(p.nextStep)}</p>
        </div>
        <details class="breakdown">
          <summary>Como suas respostas se distribuíram</summary>
          <ul class="bars">${breakdown(r.counts, r.key)}</ul>
          ${r.tie ? '<p class="meta">Houve empate; prevaleceu o perfil da sua resposta mais recente entre os empatados.</p>' : ''}
        </details>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#oferta" data-action="to-offer">Transformar em plano de ação ${ICON_NEXT}</a>
          <button type="button" class="btn btn-ghost" data-action="restart">Refazer o quiz</button>
        </div>
      </section>
      ${offerSection()}
      <p class="disclaimer">${DISCLAIMER}</p>
    `);

    // Evita contar a mesma visualização ao atualizar a página.
    const sig = answers.join('');
    let seen = null;
    try {
      seen = sessionStorage.getItem(VIEWED_KEY);
      sessionStorage.setItem(VIEWED_KEY, sig);
    } catch (e) {
      /* sem armazenamento */
    }
    if (seen !== sig || inline) A.track('quiz_result_viewed', { profile: profileProp(r.key) });
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
      { threshold: 0.35 }
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
      const s = loadState();
      const r = L.classify(s.answers);
      const profile = profileProp(r && r.key);
      const dest = cta.dataset.dest;
      trackOfferViewed(r && r.key);
      A.track('offer_clicked', { profile, destination: dest });
      // Só inicia checkout; a assinatura é confirmada pelo provedor/backend.
      if (dest === 'checkout') A.track('checkout_started', { profile });
      return;
    }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'start') startQuiz();
    else if (action === 'back') goBack();
    else if (action === 'restart') restart();
    else if (action === 'to-offer') {
      const offer = document.getElementById('oferta');
      if (offer) {
        e.preventDefault();
        offer.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        const h = offer.querySelector('h2');
        if (h) {
          h.setAttribute('tabindex', '-1');
          h.focus({ preventScroll: true });
        }
      }
    }
  });

  /* ================================ início ================================ */

  const LOGO =
    '<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#2563EB"/><path d="M6 17h5l2.5-6 4 11 2.5-5H26" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function init() {
    if (!L || !root) return;
    try {
      if (page === 'result') {
        const s = loadState();
        if (L.isComplete(s.answers)) renderResult(s.answers);
        else renderEmptyResult();
      } else {
        state = loadState();
        if (state.started) renderQuestion();
        else renderIntro();
      }
    } catch (err) {
      console.error(err);
      root.innerHTML = `
        <section class="card empty" role="alert">
          <h1>Algo deu errado ao carregar o quiz</h1>
          <p class="lead">Atualize a página para tentar novamente.</p>
          <button type="button" class="btn btn-primary" onclick="location.reload()">Atualizar</button>
        </section>`;
    }
  }

  init();
})();
