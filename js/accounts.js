/*
 * Contas locais com senha.
 *
 * Cada conta guarda seus dados criptografados (AES-GCM de 256 bits) com uma
 * chave derivada da senha (PBKDF2-SHA-256). A senha nunca é guardada: ela é
 * conferida tentando abrir os dados da conta. Sem a senha, os dados não podem
 * ser lidos — e também não podem ser recuperados.
 *
 * Tudo fica no aparelho (localStorage). Funciona no navegador e em Node 20+
 * (testes), recebendo o armazenamento por parâmetro.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Accounts = api;
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';

  const ACCOUNTS_KEY = 'cfe:accounts:v1';
  const LAST_KEY = 'cfe:last-account';
  const LEGACY_DATA_KEY = 'cfe:data:v1';
  const dataKey = (id) => 'cfe:vault:' + id;
  const rememberKey = (id) => 'cfe:remember:' + id;
  const ITERATIONS = 310000;
  const MIN_PASSWORD = 4;

  const subtle = () => {
    const c = root.crypto || (typeof globalThis !== 'undefined' && globalThis.crypto);
    if (!c || !c.subtle) throw new AccountError('crypto', 'Este navegador não oferece criptografia segura. Abra o app por HTTPS.');
    return c.subtle;
  };
  const randomBytes = (n) => (root.crypto || globalThis.crypto).getRandomValues(new Uint8Array(n));

  class AccountError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  }

  /* --------------------------- base64 --------------------------- */

  function toB64(bytes) {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  }

  function fromB64(b64) {
    const s = atob(b64);
    const u8 = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
    return u8;
  }

  /* --------------------------- criptografia --------------------------- */

  async function deriveKey(password, saltB64, iterations) {
    const base = await subtle().importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return subtle().deriveKey(
      { name: 'PBKDF2', salt: fromB64(saltB64), iterations: iterations || ITERATIONS, hash: 'SHA-256' },
      base,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptBytes(key, bytes) {
    const iv = randomBytes(12);
    const ct = await subtle().encrypt({ name: 'AES-GCM', iv }, key, bytes);
    return { iv: toB64(iv), ct: new Uint8Array(ct) };
  }

  async function decryptBytes(key, ivB64, ct) {
    return new Uint8Array(await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(ivB64) }, key, ct));
  }

  async function encryptJSON(key, value) {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    const { iv, ct } = await encryptBytes(key, new TextEncoder().encode(text));
    return { v: 1, iv, ct: toB64(ct) };
  }

  async function decryptJSON(key, payload) {
    const bytes = await decryptBytes(key, payload.iv, fromB64(payload.ct));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  async function exportKey(key) {
    return toB64(await subtle().exportKey('raw', key));
  }

  function importKey(b64) {
    return subtle().importKey('raw', fromB64(b64), { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  }

  /* --------------------------- contas --------------------------- */

  function create(storage) {
    const st = storage || root.localStorage;

    const get = (k) => {
      try {
        return st.getItem(k);
      } catch (e) {
        return null;
      }
    };
    const set = (k, v) => {
      try {
        st.setItem(k, v);
      } catch (e) {
        throw new AccountError('storage', 'Não foi possível salvar neste aparelho (armazenamento cheio ou bloqueado).');
      }
    };
    const del = (k) => {
      try {
        st.removeItem(k);
      } catch (e) {
        /* ignore */
      }
    };

    function list() {
      try {
        const arr = JSON.parse(get(ACCOUNTS_KEY) || '[]');
        return Array.isArray(arr) ? arr.filter((a) => a && a.id && a.name && a.salt) : [];
      } catch (e) {
        return [];
      }
    }

    const writeList = (arr) => set(ACCOUNTS_KEY, JSON.stringify(arr));
    const find = (id) => list().find((a) => a.id === id) || null;

    function validateName(name, exceptId) {
      const n = String(name || '').trim();
      if (!n) throw new AccountError('name', 'Informe um nome para a conta.');
      if (n.length > 40) throw new AccountError('name', 'Use um nome com até 40 caracteres.');
      if (list().some((a) => a.id !== exceptId && a.name.toLowerCase() === n.toLowerCase())) {
        throw new AccountError('name', 'Já existe uma conta com esse nome neste aparelho.');
      }
      return n;
    }

    function validatePassword(pw) {
      if (String(pw || '').length < MIN_PASSWORD) {
        throw new AccountError('password', 'A senha precisa ter pelo menos ' + MIN_PASSWORD + ' caracteres.');
      }
    }

    async function saveState(id, key, state) {
      set(dataKey(id), JSON.stringify(await encryptJSON(key, state)));
    }

    async function loadState(id, key) {
      const raw = get(dataKey(id));
      if (!raw) return null;
      return decryptJSON(key, JSON.parse(raw));
    }

    async function createAccount(name, password, initialState) {
      const n = validateName(name);
      validatePassword(password);
      const account = {
        id: 'acc_' + toB64(randomBytes(9)).replace(/[+/=]/g, ''),
        name: n,
        salt: toB64(randomBytes(16)),
        iterations: ITERATIONS,
        createdAt: new Date().toISOString(),
      };
      const key = await deriveKey(password, account.salt, account.iterations);
      await saveState(account.id, key, initialState);
      writeList(list().concat(account));
      set(LAST_KEY, account.id);
      return { account, key };
    }

    async function unlock(id, password) {
      const account = find(id);
      if (!account) throw new AccountError('missing', 'Conta não encontrada.');
      const key = await deriveKey(password, account.salt, account.iterations);
      let state;
      try {
        state = await loadState(id, key);
      } catch (e) {
        throw new AccountError('password', 'Senha incorreta.');
      }
      set(LAST_KEY, id);
      return { account, key, state };
    }

    async function remember(id, key) {
      set(rememberKey(id), await exportKey(key));
    }

    function forget(id) {
      del(rememberKey(id));
    }

    function isRemembered(id) {
      return !!get(rememberKey(id));
    }

    /** Entra sem senha se o aparelho foi marcado como "lembrar". */
    async function unlockRemembered(id) {
      const account = find(id);
      const raw = get(rememberKey(id));
      if (!account || !raw) return null;
      try {
        const key = await importKey(raw);
        const state = await loadState(id, key);
        set(LAST_KEY, id);
        return { account, key, state };
      } catch (e) {
        forget(id);
        return null;
      }
    }

    function rename(id, name) {
      const n = validateName(name, id);
      writeList(list().map((a) => (a.id === id ? Object.assign({}, a, { name: n }) : a)));
      return n;
    }

    /**
     * Troca a senha: gera nova chave e recriptografa os dados.
     * Retorna { account, key } novos (o chamador recriptografa os anexos).
     */
    async function changePassword(id, newPassword, state) {
      validatePassword(newPassword);
      const old = find(id);
      if (!old) throw new AccountError('missing', 'Conta não encontrada.');
      const account = Object.assign({}, old, { salt: toB64(randomBytes(16)), iterations: ITERATIONS });
      const key = await deriveKey(newPassword, account.salt, account.iterations);
      const payload = JSON.stringify(await encryptJSON(key, state));
      set(dataKey(id), payload);
      writeList(list().map((a) => (a.id === id ? account : a)));
      if (isRemembered(id)) await remember(id, key);
      return { account, key };
    }

    function remove(id) {
      writeList(list().filter((a) => a.id !== id));
      del(dataKey(id));
      del(rememberKey(id));
      if (get(LAST_KEY) === id) del(LAST_KEY);
    }

    function lastAccountId() {
      const id = get(LAST_KEY);
      return id && find(id) ? id : null;
    }

    /* Dados da versão anterior do app (sem contas, sem criptografia). */
    function legacyState() {
      try {
        const raw = get(LEGACY_DATA_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function clearLegacy() {
      del(LEGACY_DATA_KEY);
    }

    function removeAll() {
      list().forEach((a) => remove(a.id));
      del(ACCOUNTS_KEY);
      del(LAST_KEY);
      clearLegacy();
    }

    return {
      list,
      find,
      createAccount,
      unlock,
      unlockRemembered,
      remember,
      forget,
      isRemembered,
      saveState,
      loadState,
      rename,
      changePassword,
      remove,
      removeAll,
      lastAccountId,
      legacyState,
      clearLegacy,
    };
  }

  return {
    create,
    AccountError,
    deriveKey,
    encryptBytes,
    decryptBytes,
    encryptJSON,
    decryptJSON,
    toB64,
    fromB64,
    MIN_PASSWORD,
    ITERATIONS,
  };
});
