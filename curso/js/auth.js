/*
 * Login e salvamento do progresso.
 *
 * Dois modos, escolhidos por curso/js/config.js:
 * - "nuvem": Supabase (e-mail e senha). O progresso fica na tabela
 *   `progresso` e acompanha o aluno em qualquer aparelho.
 * - "local": contas do aparelho (js/accounts.js), com os dados
 *   criptografados pela senha. Não sincroniza entre aparelhos.
 *
 * Nos dois modos há uma cópia local do último progresso, para abrir
 * offline; ao voltar a conexão, as duas versões são juntadas.
 */
(function (root) {
  'use strict';

  const CFG = root.CURSO_CONFIG || {};
  const P = root.Progresso;
  const PREFIX = 'dcp';
  const cacheKey = (uid) => PREFIX + ':cache:' + uid;
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';

  const cloud = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);

  class AuthError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  }

  const readCache = (uid) => {
    try {
      return JSON.parse(localStorage.getItem(cacheKey(uid)) || 'null');
    } catch (e) {
      return null;
    }
  };
  const writeCache = (uid, state) => {
    try {
      localStorage.setItem(cacheKey(uid), JSON.stringify(state));
    } catch (e) {
      /* armazenamento cheio ou bloqueado: segue só com a nuvem */
    }
  };

  function checkCode(code) {
    if (!CFG.codigoAcesso) return;
    if (String(code || '').trim().toUpperCase() !== String(CFG.codigoAcesso).trim().toUpperCase()) {
      throw new AuthError('code', 'Código de acesso inválido. Ele está no arquivo que você recebeu após a compra.');
    }
  }

  /* ------------------------------ nuvem ------------------------------ */

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new AuthError('network', 'Sem conexão para entrar. Verifique a internet e tente de novo.'));
      document.head.appendChild(s);
    });
  }

  const SUPA_MSG = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail pelo link que enviamos antes de entrar.',
    'User already registered': 'Já existe uma conta com esse e-mail. Use "Entrar".',
  };
  const supaError = (e) => new AuthError('auth', SUPA_MSG[e.message] || e.message || 'Não foi possível entrar agora.');

  function cloudAdapter() {
    let sb = null;
    let user = null;

    async function client() {
      if (sb) return sb;
      if (!root.supabase) await loadScript(SUPABASE_JS);
      sb = root.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
      return sb;
    }

    const toUser = (u) => ({ id: u.id, email: u.email, name: (u.user_metadata && u.user_metadata.nome) || u.email.split('@')[0] });

    return {
      mode: 'nuvem',
      async init() {
        try {
          const { data } = await (await client()).auth.getSession();
          user = data.session ? toUser(data.session.user) : null;
        } catch (e) {
          user = null;
        }
        return user;
      },
      async signUp({ name, email, password, code }) {
        checkCode(code);
        if (String(password || '').length < 6) throw new AuthError('password', 'A senha precisa ter pelo menos 6 caracteres.');
        const { data, error } = await (await client()).auth.signUp({
          email: String(email || '').trim(),
          password,
          options: { data: { nome: String(name || '').trim() }, emailRedirectTo: location.href.split('#')[0] },
        });
        if (error) throw supaError(error);
        if (!data.session) return { pendingConfirmation: true };
        user = toUser(data.user);
        return { user };
      },
      async signIn({ email, password }) {
        const { data, error } = await (await client()).auth.signInWithPassword({ email: String(email || '').trim(), password });
        if (error) throw supaError(error);
        user = toUser(data.user);
        return { user };
      },
      async resetPassword(email) {
        const { error } = await (await client()).auth.resetPasswordForEmail(String(email || '').trim(), {
          redirectTo: location.href.split('#')[0],
        });
        if (error) throw supaError(error);
      },
      async signOut() {
        await (await client()).auth.signOut();
        user = null;
      },
      async load() {
        const local = readCache(user.id);
        try {
          const { data, error } = await sb.from('progresso').select('dados').eq('user_id', user.id).maybeSingle();
          if (error) throw error;
          const merged = P.merge(local, data && data.dados);
          writeCache(user.id, merged);
          return { state: merged, offline: false };
        } catch (e) {
          return { state: P.normalize(local), offline: true };
        }
      },
      async save(state) {
        writeCache(user.id, state);
        const { error } = await sb
          .from('progresso')
          .upsert({ user_id: user.id, dados: state, atualizado_em: new Date().toISOString() });
        if (error) throw new AuthError('sync', 'Progresso salvo no aparelho. Vamos sincronizar quando a conexão voltar.');
      },
      user: () => user,
    };
  }

  /* ------------------------------ local ------------------------------ */

  function localAdapter() {
    const AC = root.Accounts.create(root.localStorage, { prefix: PREFIX });
    let session = null; // { account, key }

    const toUser = (a) => ({ id: a.id, name: a.name, email: null });
    const findByName = (name) => AC.list().find((a) => a.name.toLowerCase() === String(name || '').trim().toLowerCase());

    return {
      mode: 'local',
      async init() {
        const id = AC.lastAccountId();
        if (!id || !AC.isRemembered(id)) return null;
        const r = await AC.unlockRemembered(id);
        if (!r) return null;
        session = r;
        return toUser(r.account);
      },
      async signUp({ name, password, code, remember }) {
        checkCode(code);
        try {
          session = await AC.createAccount(name, password, P.blank());
        } catch (e) {
          throw new AuthError(e.code || 'auth', e.message);
        }
        if (remember) await AC.remember(session.account.id, session.key);
        return { user: toUser(session.account) };
      },
      async signIn({ name, password, remember }) {
        const acc = findByName(name);
        if (!acc) throw new AuthError('missing', 'Não há conta com esse nome neste aparelho. Toque em "Criar conta".');
        try {
          const r = await AC.unlock(acc.id, password);
          session = { account: r.account, key: r.key };
        } catch (e) {
          throw new AuthError(e.code || 'auth', e.message);
        }
        if (remember) await AC.remember(acc.id, session.key);
        else AC.forget(acc.id);
        return { user: toUser(session.account) };
      },
      async resetPassword() {
        throw new AuthError('local', 'Nas contas deste aparelho a senha não pode ser recuperada.');
      },
      async signOut() {
        if (session) AC.forget(session.account.id);
        session = null;
      },
      async load() {
        const state = await AC.loadState(session.account.id, session.key);
        return { state: P.normalize(state), offline: false };
      },
      async save(state) {
        await AC.saveState(session.account.id, session.key, state);
      },
      user: () => (session ? toUser(session.account) : null),
    };
  }

  root.CursoAuth = Object.assign(cloud ? cloudAdapter() : localAdapter(), {
    AuthError,
    needsCode: !!CFG.codigoAcesso,
  });
})(typeof self !== 'undefined' ? self : this);
