'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../js/accounts.js');

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    dump: () => m,
  };
}

const sample = (n) => ({ version: 1, subjects: [{ id: 's', name: 'Matemática', total: 200, attendance: { absences: n } }] });

test('Criar conta e entrar com a senha certa', async () => {
  const store = memoryStorage();
  const acc = A.create(store);
  const { account } = await acc.createAccount('Ana', 'senha123', sample(18));
  assert.equal(acc.list().length, 1);
  const r = await acc.unlock(account.id, 'senha123');
  assert.equal(r.state.subjects[0].attendance.absences, 18);
  assert.equal(acc.lastAccountId(), account.id);
});

test('Senha errada é recusada', async () => {
  const acc = A.create(memoryStorage());
  const { account } = await acc.createAccount('Ana', 'senha123', sample(1));
  await assert.rejects(() => acc.unlock(account.id, 'outra'), (e) => e.code === 'password');
});

test('Dados ficam criptografados (sem texto legível no armazenamento)', async () => {
  const store = memoryStorage();
  const acc = A.create(store);
  await acc.createAccount('Ana', 'senha123', sample(42));
  const all = Array.from(store.dump().values()).join(' ');
  assert.ok(!all.includes('Matemática'));
  assert.ok(!all.includes('senha123'));
});

test('Contas diferentes têm dados separados', async () => {
  const acc = A.create(memoryStorage());
  const a = await acc.createAccount('Ana', 'aaaa', sample(1));
  const b = await acc.createAccount('Bruno', 'bbbb', sample(2));
  assert.equal((await acc.unlock(a.account.id, 'aaaa')).state.subjects[0].attendance.absences, 1);
  assert.equal((await acc.unlock(b.account.id, 'bbbb')).state.subjects[0].attendance.absences, 2);
  await assert.rejects(() => acc.unlock(b.account.id, 'aaaa'));
  await acc.saveState(a.account.id, a.key, sample(5));
  assert.equal((await acc.unlock(a.account.id, 'aaaa')).state.subjects[0].attendance.absences, 5);
  assert.equal((await acc.unlock(b.account.id, 'bbbb')).state.subjects[0].attendance.absences, 2);
});

test('Validações de nome e senha', async () => {
  const acc = A.create(memoryStorage());
  await acc.createAccount('Ana', 'aaaa', sample(1));
  await assert.rejects(() => acc.createAccount('ana', 'bbbb', sample(1)), (e) => e.code === 'name');
  await assert.rejects(() => acc.createAccount('', 'bbbb', sample(1)), (e) => e.code === 'name');
  await assert.rejects(() => acc.createAccount('Bia', '123', sample(1)), (e) => e.code === 'password');
});

test('Lembrar neste aparelho e sair', async () => {
  const acc = A.create(memoryStorage());
  const { account, key } = await acc.createAccount('Ana', 'aaaa', sample(3));
  assert.equal(await acc.unlockRemembered(account.id), null);
  await acc.remember(account.id, key);
  const r = await acc.unlockRemembered(account.id);
  assert.equal(r.state.subjects[0].attendance.absences, 3);
  acc.forget(account.id);
  assert.equal(await acc.unlockRemembered(account.id), null);
});

test('Trocar senha recriptografa os dados', async () => {
  const acc = A.create(memoryStorage());
  const { account } = await acc.createAccount('Ana', 'velha', sample(7));
  const s = (await acc.unlock(account.id, 'velha')).state;
  await acc.changePassword(account.id, 'nova1', s);
  await assert.rejects(() => acc.unlock(account.id, 'velha'));
  assert.equal((await acc.unlock(account.id, 'nova1')).state.subjects[0].attendance.absences, 7);
});

test('Renomear e excluir conta', async () => {
  const store = memoryStorage();
  const acc = A.create(store);
  const a = await acc.createAccount('Ana', 'aaaa', sample(1));
  const b = await acc.createAccount('Bruno', 'bbbb', sample(1));
  assert.throws(() => acc.rename(a.account.id, 'bruno'), (e) => e.code === 'name');
  acc.rename(a.account.id, 'Ana Clara');
  assert.equal(acc.find(a.account.id).name, 'Ana Clara');
  acc.remove(a.account.id);
  assert.deepEqual(acc.list().map((x) => x.name), ['Bruno']);
  assert.ok(!Array.from(store.dump().keys()).some((k) => k.includes(a.account.id)));
  assert.equal((await acc.unlock(b.account.id, 'bbbb')).state.subjects.length, 1);
});

test('Anexos (bytes) criptografados e recuperados', async () => {
  const key = await A.deriveKey('aaaa', A.toB64(new Uint8Array(16)), 1000);
  const data = new Uint8Array([1, 2, 3, 250]);
  const { iv, ct } = await A.encryptBytes(key, data);
  assert.notDeepEqual(Array.from(ct.slice(0, 4)), [1, 2, 3, 250]);
  assert.deepEqual(Array.from(await A.decryptBytes(key, iv, ct)), [1, 2, 3, 250]);
});

test('Dados da versão sem contas são detectados para migração', () => {
  const store = memoryStorage();
  store.setItem('cfe:data:v1', JSON.stringify(sample(9)));
  const acc = A.create(store);
  assert.equal(acc.legacyState().subjects[0].attendance.absences, 9);
  acc.clearLegacy();
  assert.equal(acc.legacyState(), null);
});
