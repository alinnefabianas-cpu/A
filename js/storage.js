/*
 * Armazenamento local. Nada sai do aparelho.
 *   - Dados (matérias, grade, frequência, atestados): localStorage
 *   - Anexos (fotos/PDFs de atestados): IndexedDB
 */
(function (root) {
  'use strict';

  const DATA_KEY = 'cfe:data:v1';
  const DB_NAME = 'cfe-files';
  const STORE = 'files';

  function load() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Falha ao ler dados locais', e);
      return null;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Falha ao salvar dados locais', e);
      return false;
    }
  }

  function clearData() {
    try {
      localStorage.removeItem(DATA_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  let dbPromise = null;
  function db() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in root)) {
        reject(new Error('IndexedDB indisponível'));
        return;
      }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    dbPromise.catch(() => {
      dbPromise = null;
    });
    return dbPromise;
  }

  function tx(mode, fn) {
    return db().then(
      (d) =>
        new Promise((resolve, reject) => {
          const t = d.transaction(STORE, mode);
          const store = t.objectStore(STORE);
          let result;
          const r = fn(store);
          if (r) r.onsuccess = () => (result = r.result);
          t.oncomplete = () => resolve(result);
          t.onerror = () => reject(t.error);
          t.onabort = () => reject(t.error);
        })
    );
  }

  const files = {
    put: (rec) => tx('readwrite', (s) => s.put(rec)),
    get: (id) => tx('readonly', (s) => s.get(id)),
    remove: (id) => tx('readwrite', (s) => s.delete(id)),
    all: () => tx('readonly', (s) => s.getAll()),
    clear: () => tx('readwrite', (s) => s.clear()),
  };

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  function dataURLToBlob(url) {
    const m = /^data:([^;,]*)(;base64)?,(.*)$/.exec(url || '');
    if (!m) return null;
    const type = m[1] || 'application/octet-stream';
    if (!m[2]) return new Blob([decodeURIComponent(m[3])], { type });
    const bin = atob(m[3]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type });
  }

  function requestPersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }

  root.Store = { load, save, clearData, files, blobToDataURL, dataURLToBlob, requestPersistence, DATA_KEY };
})(typeof self !== 'undefined' ? self : this);
