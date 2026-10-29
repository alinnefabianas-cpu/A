/*
 * Interface do curso: login, quiz de personalização, trilha, player de aula,
 * ferramentas e progresso.
 */
(function () {
  'use strict';

  const { COURSE, DM_SCRIPT, FOLLOW_SCRIPT, PROPOSAL, CHECKLIST, ONB } = window.Conteudo;
  const P = window.Progresso;
  const Auth = window.CursoAuth;
  const ALL = P.flatten(COURSE);

  let S = P.blank();
  let user = null;
  let view = 'boot'; // boot | auth | intro | onb | plan | home
  let tab = 'trilha';
  let onbStep = 0;
  let onbDraft = {};
  let L = null; // player
  let authMode = 'entrar'; // entrar | criar | recuperar
  let authMsg = null; // { type: 'err'|'ok', text }
  let authDraft = {}; // mantém nome, e-mail e código quando o formulário é redesenhado
  let syncState = 'ok'; // ok | saving | offline
  let installEvt = null;

  const root = document.getElementById('root');

  /* ------------------------------ util ------------------------------ */

  const isDone = (id) => !!S.done[id];
  const isOpen = (id) => P.isOpen(ALL, S, id);
  const nextLesson = () => P.nextLesson(ALL, S);
  const pct = () => P.percent(ALL, S);
  const brl = (n) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const $ = (id) => document.getElementById(id);
  // Usa a cópia em curso/img/ quando existe; senão, a imagem hospedada.
  const img = (o, cls) => '<img class="' + cls + '" src="' + esc(o.img) + '" data-remote="' + esc(o.imgRemote || '') + '" alt="" loading="lazy" decoding="async">';
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t.tagName === 'IMG' && t.dataset.remote && t.src !== t.dataset.remote) t.src = t.dataset.remote;
  }, true);

  let saveTimer = null;
  function save(now) {
    S.updatedAt = new Date().toISOString();
    clearTimeout(saveTimer);
    const run = async () => {
      syncState = 'saving';
      paintSync();
      try {
        await Auth.save(S);
        syncState = 'ok';
      } catch (e) {
        syncState = 'offline';
      }
      paintSync();
    };
    if (now) return run();
    saveTimer = setTimeout(run, 600);
  }

  function paintSync() {
    const el = $('sync');
    if (!el) return;
    el.textContent = { ok: 'Progresso salvo', saving: 'Salvando…', offline: 'Salvo no aparelho · sincroniza depois' }[syncState];
  }

  let toastT;
  function toast(msg) {
    document.querySelectorAll('.toast').forEach((t) => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
    clearTimeout(toastT);
    toastT = setTimeout(() => t.remove(), 2400);
  }

  const ICON = {
    fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.6 1.2 2.5 2 2.5 0-3-1-5 1-8z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="8" height="5" rx="1.5"/><rect x="13" y="5" width="8" height="5" rx="1.5"/><rect x="3" y="14" width="12" height="5" rx="1.5"/><path d="M18 13v7"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  };
  const wave =
    '<svg class="wave" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 14V9l3-4 3 6 3-8 3 7 3-3 3 5 3-9 3 8 3-4 3 5 3-6 3 7 3-3 3 4 3-8 3 6 3-2 3 5 3-7 3 6 3-4 3 5 3-9 3 7 3-3 3 4 3-6 3 7 3-4 3 6 3-2V14z"/></svg>';

  /* ------------------------------ render ------------------------------ */

  function render() {
    if (view === 'boot') return;
    if (view === 'auth') return renderAuth();
    if (view === 'intro') return renderIntro();
    if (view === 'onb') return renderOnb();
    if (view === 'plan') return renderPlan();
    renderHome();
    if (L) renderPlayer();
  }

  /* ------------------------------ login ------------------------------ */

  function renderAuth() {
    const cloud = Auth.mode === 'nuvem';
    const idField = cloud
      ? '<div class="in"><label for="a-email">E-mail</label><input id="a-email" type="email" autocomplete="email" inputmode="email" required></div>'
      : '<div class="in"><label for="a-name">Nome</label><input id="a-name" type="text" autocomplete="username" maxlength="40" required></div>';
    const msg = authMsg ? '<div class="' + (authMsg.type === 'err' ? 'err' : 'ok-msg') + '" role="alert">' + esc(authMsg.text) + '</div>' : '';
    let form;
    if (authMode === 'recuperar') {
      form =
        '<form id="auth-form" novalidate><h2 style="font-size:22px">Recuperar senha</h2>' +
        '<p style="color:var(--muted)">Enviaremos um link para você criar uma nova senha.</p>' + idField + msg +
        '<button class="btn" type="submit">Enviar link</button>' +
        '<div class="links"><button type="button" class="link" data-auth="entrar">Voltar para entrar</button></div></form>';
    } else {
      const criar = authMode === 'criar';
      form =
        '<div class="seg" role="tablist"><button type="button" role="tab" class="' + (!criar ? 'on' : '') + '" data-auth="entrar">Entrar</button>' +
        '<button type="button" role="tab" class="' + (criar ? 'on' : '') + '" data-auth="criar">Criar conta</button></div>' +
        '<form id="auth-form" novalidate>' +
        (criar && cloud ? '<div class="in"><label for="a-name">Seu nome</label><input id="a-name" type="text" autocomplete="name" maxlength="40"></div>' : '') +
        idField +
        '<div class="in"><label for="a-pass">Senha</label><input id="a-pass" type="password" autocomplete="' + (criar ? 'new-password' : 'current-password') + '" required>' +
        (criar ? '<small>Pelo menos ' + (cloud ? 6 : 4) + ' caracteres.</small>' : '') + '</div>' +
        (criar && Auth.needsCode ? '<div class="in"><label for="a-code">Código de acesso</label><input id="a-code" type="text" autocapitalize="characters" required><small>Está no arquivo que você recebeu após a compra.</small></div>' : '') +
        (!cloud ? '<label class="remember"><input type="checkbox" id="a-remember" checked> Manter conectada neste aparelho</label>' : '') +
        msg +
        '<button class="btn" type="submit">' + (criar ? 'Criar conta e começar' : 'Entrar') + '</button>' +
        (cloud && !criar ? '<div class="links"><button type="button" class="link" data-auth="recuperar">Esqueci a senha</button></div>' : '') +
        '</form>';
    }
    root.innerHTML =
      '<main class="app"><div class="auth">' +
      '<div class="hero-clip" aria-hidden="true"><span style="flex:3;background:var(--clip-v)"></span><span style="flex:1.2;background:var(--accent)"></span><span style="flex:2;background:var(--clip-a)"></span><span style="flex:1;background:var(--clip-v-soft)"></span></div>' +
      '<div class="eyebrow">Do Corte ao Pix</div>' +
      '<h1>' + (authMode === 'criar' ? 'Crie sua conta para salvar seu progresso' : 'Entre para continuar de onde parou') + '</h1>' +
      form +
      '<p class="mode-note">' +
      (cloud
        ? 'Seu progresso fica salvo na sua conta e aparece em qualquer celular ou computador em que você entrar.'
        : 'Sua conta fica salva neste aparelho, com o progresso protegido pela sua senha. A senha não pode ser recuperada.') +
      ' <a href="vendas.html">Conheça o curso</a></p>' +
      '</div></main>';

    [['a-name', 'name'], ['a-email', 'email'], ['a-code', 'code']].forEach(([id, k]) => { if ($(id) && authDraft[k]) $(id).value = authDraft[k]; });
    root.querySelectorAll('[data-auth]').forEach((b) => (b.onclick = () => { authMode = b.dataset.auth; authMsg = null; render(); }));
    const f = $('auth-form');
    f.onsubmit = async (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type=submit]');
      btn.disabled = true;
      const v = (id) => ($(id) ? $(id).value : '');
      const data = { name: v('a-name'), email: v('a-email'), password: v('a-pass'), code: v('a-code'), remember: $('a-remember') ? $('a-remember').checked : true };
      authDraft = { name: data.name, email: data.email, code: data.code };
      try {
        if (authMode === 'recuperar') {
          await Auth.resetPassword(data.email);
          authMsg = { type: 'ok', text: 'Pronto. Se houver uma conta com esse e-mail, o link chega em alguns minutos.' };
          return render();
        }
        const r = authMode === 'criar' ? await Auth.signUp(data) : await Auth.signIn(data);
        if (r.pendingConfirmation) {
          authMode = 'entrar';
          authMsg = { type: 'ok', text: 'Conta criada. Abra o link que enviamos para ' + data.email + ' e depois entre aqui.' };
          return render();
        }
        authMsg = null;
        authDraft = {};
        await afterLogin(r.user);
      } catch (err) {
        authMsg = { type: 'err', text: err.message || 'Não foi possível entrar agora.' };
        render();
      }
    };
    const first = Array.from(f.querySelectorAll('input:not([type=checkbox])')).find((i) => !i.value);
    if (first) first.focus();
  }

  async function afterLogin(u) {
    user = u;
    const r = await Auth.load();
    S = r.state;
    if (r.offline) syncState = 'offline';
    view = S.onb ? 'home' : 'intro';
    render();
  }

  async function logout() {
    await Auth.signOut();
    user = null;
    S = P.blank();
    L = null;
    tab = 'trilha';
    authMode = 'entrar';
    view = 'auth';
    render();
  }

  /* ------------------------------ primeiro acesso ------------------------------ */

  function renderIntro() {
    root.innerHTML =
      '<main class="app"><div class="onb">' +
      img(COURSE[0], 'mod-cover') +
      '<div class="eyebrow">Curso prático · 7 módulos · 21 aulas</div>' +
      '<h1>Olá, ' + esc(user.name) + '. Vamos montar seu plano?</h1>' +
      '<p style="font-size:18px;color:var(--muted)">Responda 4 perguntas rápidas e o curso se ajusta ao seu objetivo, ao seu nível e ao tempo que você tem por dia.</p>' +
      '<button class="btn" id="go">Montar meu plano</button>' +
      '</div></main>';
    $('go').onclick = () => { view = 'onb'; onbStep = 0; onbDraft = {}; render(); };
  }

  function renderOnb() {
    const s = ONB[onbStep];
    root.innerHTML =
      '<main class="app"><div class="onb">' +
      '<div class="onb-top"><button class="x" id="back" aria-label="Voltar">' + ICON.x + '</button>' +
      '<div class="onb-bar"><i style="width:' + ((onbStep + 1) / ONB.length) * 100 + '%"></i></div>' +
      '<span class="tc">' + (onbStep + 1) + '/' + ONB.length + '</span></div>' +
      '<h1>' + esc(s.q) + '</h1>' +
      '<div class="opts">' +
      s.opts.map((o, i) => '<button class="opt ' + (onbDraft[s.k] === o[0] ? 'sel' : '') + '" data-v="' + o[0] + '"><span class="k">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o[1]) + '<small>' + esc(o[2]) + '</small></span></button>').join('') +
      '</div></div></main>';
    $('back').onclick = () => { if (onbStep === 0) view = 'intro'; else onbStep--; render(); };
    root.querySelectorAll('.opt').forEach((b) => (b.onclick = () => {
      onbDraft[s.k] = b.dataset.v;
      root.querySelectorAll('.opt').forEach((x) => x.classList.toggle('sel', x === b));
      setTimeout(() => { if (onbStep < ONB.length - 1) onbStep++; else view = 'plan'; render(); }, 220);
    }));
  }

  function planInfo(o) {
    const goal = { extra: ['R$ 1.500', '3 clientes de R$ 500/mês'], main: ['R$ 4.000', '4 clientes no pacote de R$ 1.000'], biz: ['R$ 8.000+', '6 clientes e 1 editor de apoio'] }[o.goal];
    const app = { phone: 'CapCut no celular', pc: 'DaVinci Resolve (grátis)', both: 'CapCut + DaVinci Resolve' }[o.device];
    const days = Math.ceil(ALL.length / { 15: 1, 30: 1.5, 60: 3 }[o.time]);
    const focus = { zero: 'Módulos 1 a 3 com calma', basic: 'Revisão rápida e foco nos módulos 2 e 3', pro: 'Pule para portfólio e clientes' }[o.level];
    return { goal, app, days, focus };
  }

  function renderPlan() {
    const p = planInfo(onbDraft);
    root.innerHTML =
      '<main class="app"><div class="onb">' +
      '<div class="eyebrow">Seu plano está pronto</div>' +
      '<h1>Meta: ' + p.goal[0] + ' por mês editando vídeos</h1>' +
      '<div class="plan">' +
      '<div class="plan-row"><span>Como chegar lá</span><b>' + p.goal[1] + '</b></div>' +
      '<div class="plan-row"><span>Seu editor</span><b>' + p.app + '</b></div>' +
      '<div class="plan-row"><span>Foco</span><b>' + p.focus + '</b></div>' +
      '<div class="plan-row"><span>Conclusão estimada</span><b class="mono">' + p.days + ' dias</b></div></div>' +
      '<p style="color:var(--muted)">Os valores são uma meta de referência. Seu resultado depende da prática, do nicho e de quantos clientes você abordar.</p>' +
      '<button class="btn" id="start">Começar a primeira aula</button></div></main>';
    $('start').onclick = () => { S.onb = onbDraft; save(true); view = 'home'; openLesson(ALL[0].id); };
  }

  /* ------------------------------ home ------------------------------ */

  function header() {
    const ini = (user.name || '?').trim().charAt(0).toUpperCase();
    return (
      '<header class="top"><div class="brand"><i aria-hidden="true"></i>Corte ao Pix</div><div class="stats">' +
      '<span class="chip" title="Dias seguidos" style="color:var(--clip-a)">' + ICON.fire + '<span style="color:var(--fg)">' + P.currentStreak(S) + '</span></span>' +
      '<span class="chip" title="Pontos de experiência" style="color:var(--accent)">' + ICON.bolt + '<span style="color:var(--fg)">' + S.xp + '</span></span>' +
      '<button class="who" data-tab="perfil" aria-label="Sua conta"><i>' + esc(ini) + '</i><span>' + esc(user.name) + '</span></button>' +
      '</div></header>'
    );
  }

  function renderHome() {
    let body = '';
    if (tab === 'trilha') body = trilha();
    if (tab === 'ferramentas') body = ferramentas();
    if (tab === 'perfil') body = perfil();
    root.innerHTML =
      '<main class="app">' + header() + body + '</main>' +
      '<nav class="tabs" aria-label="Navegação"><div class="tabs-in">' +
      [['trilha', 'Trilha', ICON.path], ['ferramentas', 'Ferramentas', ICON.tool], ['perfil', 'Progresso', ICON.user]]
        .map((t) => '<button class="tab ' + (tab === t[0] ? 'on' : '') + '" data-tab="' + t[0] + '">' + t[2] + t[1] + '</button>').join('') +
      '</div></nav>';
    root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { tab = b.dataset.tab; window.scrollTo(0, 0); render(); }));
    root.querySelectorAll('[data-lesson]').forEach((b) => (b.onclick = () => { if (isOpen(b.dataset.lesson)) openLesson(b.dataset.lesson); }));
    const inst = $('install');
    if (inst) inst.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; render(); };
    bindTools();
    paintSync();
  }

  function trilha() {
    const n = nextLesson();
    const doneCount = ALL.filter((l) => isDone(l.id)).length;
    const cont = n
      ? '<section class="continue"><div class="eyebrow">' + n.mod.tag + ' · Módulo ' + (COURSE.indexOf(n.mod) + 1) + ' · ' + n.min + ' min</div>' +
        '<h2>' + esc(n.title) + '</h2><div class="meter" aria-label="Progresso do curso"><i style="width:' + pct() + '%"></i></div>' +
        '<button class="btn" data-lesson="' + n.id + '">' + (doneCount ? 'Continuar' : 'Começar') + '</button></section>'
      : '<section class="continue"><div class="eyebrow">Curso concluído</div><h2>Você terminou as 21 aulas.</h2><p>Agora é execução: 20 mensagens por dia, portfólio atualizado e pacotes mensais. Revise qualquer aula quando quiser.</p></section>';
    const install = installEvt ? '<div class="install"><span>Instale o curso na tela inicial para abrir como app.</span><button class="btn small" id="install">Instalar</button></div>' : '';
    const mods = COURSE.map((m) => {
      const doneN = m.lessons.filter((l) => isDone(l.id)).length;
      const clips = m.lessons.map((l) => {
        const st = isDone(l.id) ? 'done' : isOpen(l.id) ? '' : 'locked';
        const nx = n && n.id === l.id ? 'next' : '';
        const sub = st === 'done' ? ICON.check + ' feito' : st === 'locked' ? ICON.lock + ' ' + l.min + ' min' : l.min + ' min · ' + P.lessonXP(l) + ' XP';
        return '<button class="clip ' + m.kind + ' ' + st + ' ' + nx + '" data-lesson="' + l.id + '"' + (st === 'locked' ? ' aria-disabled="true"' : '') + '><span>' + esc(l.title) + '</span><small>' + sub + '</small>' + (m.kind === 'a' ? wave : '') + '</button>';
      }).join('');
      return '<div class="mod"><div class="track"><b>' + m.tag + '</b></div><div class="mod-body"><div class="mod-title"><h3>' + esc(m.title) + '</h3><span>' + doneN + '/3</span></div><div class="clips">' + clips + '</div></div></div>';
    }).join('');
    const ruler = ['00:00', '00:30', '01:00', '01:30', '02:00'].map((x) => '<span>' + x + '</span>').join('');
    return (
      install + cont +
      '<div class="section-h"><h2>Sua trilha</h2><span class="sync" id="sync"></span></div>' +
      '<div class="legend"><span><i style="background:var(--clip-v)"></i>V · Edição</span><span><i style="background:var(--clip-a)"></i>A · Negócio e vendas</span><span class="mono">' + pct() + '% concluído</span></div>' +
      '<div class="ruler" aria-hidden="true">' + ruler + '</div>' + mods
    );
  }

  function ferramentas() {
    const c = S.calc;
    return (
      '<div class="section-h"><h2>Ferramentas</h2><span class="eyebrow">Use no dia a dia</span></div>' +
      '<section class="card"><div class="eyebrow">Calculadora de renda</div>' +
      '<div class="field"><label for="c-price">Preço por vídeo <b id="v-price">' + brl(c.price) + '</b></label><input type="range" id="c-price" min="30" max="800" step="10" value="' + c.price + '"></div>' +
      '<div class="field"><label for="c-videos">Vídeos por cliente / mês <b id="v-videos">' + c.videos + '</b></label><input type="range" id="c-videos" min="1" max="30" value="' + c.videos + '"></div>' +
      '<div class="field"><label for="c-clients">Clientes <b id="v-clients">' + c.clients + '</b></label><input type="range" id="c-clients" min="1" max="15" value="' + c.clients + '"></div>' +
      '<div class="field"><label for="c-hours">Horas por vídeo <b id="v-hours">' + c.hours + '</b></label><input type="range" id="c-hours" min="0.5" max="6" step="0.5" value="' + c.hours + '"></div>' +
      '<div><div class="eyebrow">Renda mensal estimada</div><div class="big mono" id="r-total"></div></div>' +
      '<div class="split"><div class="mini"><span>Horas por mês</span><b id="r-hours"></b></div><div class="mini"><span>Valor por hora</span><b id="r-rate"></b></div></div></section>' +
      '<section class="card"><div class="eyebrow">Script de prospecção</div><h3>Primeira mensagem</h3>' +
      '<div class="script" id="s-dm">' + esc(DM_SCRIPT) + '</div><button class="btn ghost small" data-copy="s-dm">Copiar mensagem</button>' +
      '<h3>Follow-up (3 dias depois)</h3><div class="script" id="s-fu">' + esc(FOLLOW_SCRIPT) + '</div><button class="btn ghost small" data-copy="s-fu">Copiar follow-up</button></section>' +
      '<section class="card"><div class="eyebrow">Modelo de proposta</div><h3>Troque o que está entre colchetes</h3>' +
      '<div class="script" id="s-prop">' + esc(PROPOSAL) + '</div><button class="btn ghost small" data-copy="s-prop">Copiar proposta</button></section>' +
      '<section class="card"><div class="eyebrow">Checklist antes de entregar</div><div>' +
      CHECKLIST.map((x, i) => '<label class="check ' + (S.check[i] ? 'on' : '') + '"><input type="checkbox" id="ck-' + i + '" data-ck="' + i + '"' + (S.check[i] ? ' checked' : '') + '><span>' + esc(x) + '</span></label>').join('') +
      '</div><button class="btn ghost small" id="ck-reset">Limpar para o próximo vídeo</button></section>'
    );
  }

  function perfil() {
    const o = S.onb;
    const p = o ? planInfo(o) : null;
    const doneN = ALL.filter((l) => isDone(l.id)).length;
    return (
      '<div class="section-h"><h2>Seu progresso</h2><span class="sync" id="sync"></span></div>' +
      '<div class="statgrid" style="margin-bottom:16px">' +
      '<div class="mini"><span>Aulas</span><b class="mono">' + doneN + '/' + ALL.length + '</b></div>' +
      '<div class="mini"><span>XP</span><b class="mono">' + S.xp + '</b></div>' +
      '<div class="mini"><span>Sequência</span><b class="mono">' + P.currentStreak(S) + 'd</b></div></div>' +
      (p
        ? '<section class="card"><div class="eyebrow">Seu plano</div>' +
          '<div class="plan-row"><span>Meta mensal</span><b>' + p.goal[0] + '</b></div>' +
          '<div class="plan-row"><span>Caminho</span><b>' + p.goal[1] + '</b></div>' +
          '<div class="plan-row"><span>Editor</span><b>' + p.app + '</b></div>' +
          '<div class="plan-row"><span>Ritmo</span><b>' + { 15: '15 min', 30: '30 min', 60: '1 hora' }[o.time] + ' por dia</b></div>' +
          '<button class="btn ghost small" id="redo-plan">Refazer o plano</button></section>'
        : '') +
      '<section class="card"><div class="eyebrow">Módulos</div>' +
      COURSE.map((m) => '<div class="plan-row"><span>' + m.tag + ' · ' + esc(m.title) + '</span><b class="mono">' + m.lessons.filter((l) => isDone(l.id)).length + '/3</b></div>').join('') +
      '</section>' +
      '<section class="card"><div class="eyebrow">Sua conta</div>' +
      '<div class="plan-row"><span>Nome</span><b>' + esc(user.name) + '</b></div>' +
      (user.email ? '<div class="plan-row"><span>E-mail</span><b>' + esc(user.email) + '</b></div>' : '') +
      '<div class="plan-row"><span>Onde fica salvo</span><b>' + (Auth.mode === 'nuvem' ? 'Na sua conta (todos os aparelhos)' : 'Neste aparelho') + '</b></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost small" id="logout">Sair da conta</button></div></section>' +
      '<section class="card"><div class="eyebrow">Recomeçar</div><p style="color:var(--muted);font-size:15px">Apaga seu progresso, XP e plano desta conta.</p>' +
      '<div id="reset-zone"><button class="btn ghost small" id="reset">Recomeçar o curso</button></div></section>'
    );
  }

  function bindTools() {
    const calc = () => {
      if (!$('r-total')) return;
      const c = S.calc;
      const total = c.price * c.videos * c.clients;
      const hrs = c.videos * c.clients * c.hours;
      $('r-total').textContent = brl(total);
      $('r-hours').textContent = Math.round(hrs) + ' h';
      $('r-rate').textContent = brl(total / hrs) + '/h';
    };
    ['price', 'videos', 'clients', 'hours'].forEach((k) => {
      const el = $('c-' + k);
      if (!el) return;
      el.oninput = () => {
        S.calc[k] = +el.value;
        $('v-' + k).textContent = k === 'price' ? brl(el.value) : el.value;
        calc();
        save();
      };
    });
    calc();
    root.querySelectorAll('[data-copy]').forEach((b) => (b.onclick = () => {
      const el = $(b.dataset.copy);
      const sel = () => {
        const r = document.createRange();
        r.selectNodeContents(el);
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(r);
        toast('Texto selecionado. Copie com o menu do aparelho.');
      };
      try {
        navigator.clipboard.writeText(el.textContent).then(() => toast('Copiado'), sel);
      } catch (e) {
        sel();
      }
    }));
    root.querySelectorAll('[data-ck]').forEach((cb) => (cb.onchange = () => {
      S.check[cb.dataset.ck] = cb.checked;
      cb.parentElement.classList.toggle('on', cb.checked);
      save();
    }));
    if ($('ck-reset')) $('ck-reset').onclick = () => { S.check = {}; save(); render(); };
    if ($('logout')) $('logout').onclick = logout;
    if ($('redo-plan')) $('redo-plan').onclick = () => { view = 'onb'; onbStep = 0; onbDraft = Object.assign({}, S.onb); render(); };
    if ($('reset')) $('reset').onclick = () => {
      $('reset-zone').innerHTML =
        '<p style="font-weight:600;margin-bottom:10px">Tem certeza? Isso não pode ser desfeito.</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" id="reset-yes" style="background:var(--bad)">Apagar progresso</button><button class="btn ghost small" id="reset-no">Cancelar</button></div>';
      $('reset-no').onclick = render;
      $('reset-yes').onclick = async () => { S = P.blank(); await save(true); view = 'intro'; tab = 'trilha'; render(); };
    };
  }

  /* ------------------------------ player ------------------------------ */

  function openLesson(id) {
    const l = ALL.find((x) => x.id === id);
    L = { l, i: 0, pick: null, answered: false, finished: false, right: 0, gained: 0, again: isDone(id) };
    render();
  }

  const tc = (i, n) => { const f = (s) => '00:' + String(s).padStart(2, '0'); return f(i) + ' / ' + f(n); };

  function cardHTML(c) {
    if (c.t === 'text') return (L.i === 0 && L.l.mod.img ? img(L.l.mod, 'lesson-cover') : '') + '<h2>' + esc(c.h) + '</h2>' + c.b.split('|').map((p) => '<p>' + md(p) + '</p>').join('');
    if (c.t === 'tip') return '<h2>Dica de quem já fatura</h2><div class="tip"><span class="eyebrow">Dica pro</span><p>' + md(c.b) + '</p></div>';
    if (c.t === 'list') return '<h2>' + esc(c.h) + '</h2><ul class="list">' + c.items.map((it, i) => '<li><b class="n">' + String(i + 1).padStart(2, '0') + '</b><span><b>' + esc(it[0]) + '</b>' + esc(it[1]) + '</span></li>').join('') + '</ul>';
    if (c.t === 'table')
      return '<h2>' + esc(c.h) + '</h2><div class="tbl-wrap"><table><thead><tr>' + c.head.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
        c.rows.map((r) => '<tr>' + r.map((v, j) => '<td class="' + (/R\$|^\d/.test(v) && j > 0 ? 'num' : '') + '">' + esc(v) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    if (c.t === 'quiz') {
      const st = (i) => (!L.answered ? (L.pick === i ? 'sel' : '') : i === c.a ? 'right' : L.pick === i ? 'wrong' : '');
      const ok = L.pick === c.a;
      const fb = L.answered ? '<div class="fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? (L.again ? 'Certo!' : 'Certo! +' + P.QUIZ_XP + ' XP') : 'Quase. A resposta certa está em verde.') + '</b>' + esc(c.why) + '</div>' : '';
      return '<div class="eyebrow">Teste rápido</div><h2>' + esc(c.q) + '</h2><div class="opts">' + c.opts.map((o, i) => '<button class="qopt ' + st(i) + '" data-q="' + i + '"' + (L.answered ? ' disabled' : '') + '>' + esc(o) + '</button>').join('') + '</div>' + fb;
    }
    if (c.t === 'task') return '<div class="eyebrow">Mão na massa</div><div class="task"><span class="eyebrow">Tarefa prática</span><h2 style="font-size:22px">' + esc(c.h) + '</h2><p>' + md(c.b) + '</p></div><p style="color:var(--muted);font-size:15px">Faça agora ou ainda hoje. É a prática que transforma aula em cliente.</p>';
    return '';
  }

  function renderPlayer() {
    const l = L.l;
    const n = l.cards.length;
    let el = document.querySelector('.player');
    if (!el) {
      el = document.createElement('div');
      el.className = 'player';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', l.title);
      document.body.appendChild(el);
      document.body.style.overflow = 'hidden';
    }
    if (L.finished) {
      const nx = nextLesson();
      el.innerHTML =
        '<div class="p-body done-screen"><div class="eyebrow">Render concluído · ' + esc(l.mod.tag) + '</div>' +
        '<div class="render" style="max-width:280px"><i></i></div>' +
        '<div class="xpburst mono">+' + L.gained + ' XP</div><h2>' + esc(l.title) + '</h2>' +
        '<p style="color:var(--muted)">Sequência: <b class="mono" style="color:var(--fg)">' + P.currentStreak(S) + ' ' + (P.currentStreak(S) === 1 ? 'dia' : 'dias') + '</b> · Curso <b class="mono" style="color:var(--fg)">' + pct() + '%</b></p></div>' +
        '<div class="p-foot" style="display:flex;flex-direction:column;gap:10px">' +
        (nx ? '<button class="btn" id="p-next">Próxima aula: ' + esc(nx.title) + '</button>' : '') +
        '<button class="btn ghost" id="p-close">Voltar para a trilha</button></div>';
      if ($('p-next')) $('p-next').onclick = () => openLesson(nx.id);
      $('p-close').onclick = closePlayer;
      return;
    }
    const c = l.cards[L.i];
    const isQuiz = c.t === 'quiz';
    const label = isQuiz && !L.answered ? 'Verificar' : L.i === n - 1 ? 'Concluir aula' : 'Continuar';
    const disabled = isQuiz && !L.answered && L.pick === null;
    el.innerHTML =
      '<div class="p-head"><button class="x" id="p-x" aria-label="Fechar aula">' + ICON.x + '</button>' +
      '<div class="segs" aria-hidden="true">' + l.cards.map((_, i) => '<i class="' + (i < L.i ? 'on' : i === L.i ? 'cur' : '') + '"></i>').join('') + '</div>' +
      '<span class="tc">' + tc(L.i + 1, n) + '</span></div>' +
      '<div class="p-body" id="p-body">' + cardHTML(c) + '</div>' +
      '<div class="p-foot"><button class="btn" id="p-go"' + (disabled ? ' disabled' : '') + '>' + label + '</button></div>';
    $('p-x').onclick = closePlayer;
    el.querySelectorAll('[data-q]').forEach((b) => (b.onclick = () => { L.pick = +b.dataset.q; renderPlayer(); }));
    $('p-go').onclick = () => {
      if (isQuiz && !L.answered) {
        L.answered = true;
        if (L.pick === c.a) L.right++;
        return renderPlayer();
      }
      if (L.i < n - 1) {
        L.i++;
        L.pick = null;
        L.answered = false;
        renderPlayer();
        $('p-body').scrollTop = 0;
        return;
      }
      finish();
    };
  }

  function finish() {
    const r = P.completeLesson(S, L.l, L.right);
    S = r.state;
    L.gained = r.gained;
    L.finished = true;
    save(true);
    renderHome();
    renderPlayer();
  }

  function closePlayer() {
    L = null;
    const el = document.querySelector('.player');
    if (el) el.remove();
    document.body.style.overflow = '';
    render();
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && L) closePlayer(); });

  /* ------------------------------ início ------------------------------ */

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvt = e;
    if (view === 'home' && tab === 'trilha') render();
  });
  window.addEventListener('online', () => { if (user && syncState === 'offline') save(true); });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  (async function boot() {
    try {
      const u = await Auth.init();
      if (u) return afterLogin(u);
    } catch (e) {
      /* segue para o login */
    }
    view = 'auth';
    render();
  })();
})();
