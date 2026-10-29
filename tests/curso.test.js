'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../curso/js/progresso.js');
const { COURSE, ONB } = require('../curso/js/conteudo.js');
const A = require('../js/accounts.js');

const ALL = P.flatten(COURSE);
const d = (s) => new Date(s + 'T12:00:00');

test('Conteúdo: 7 módulos, 21 aulas, ids únicos e quizzes válidos', () => {
  assert.equal(COURSE.length, 7);
  assert.equal(ALL.length, 21);
  assert.equal(new Set(ALL.map((l) => l.id)).size, 21);
  for (const l of ALL) {
    for (const c of l.cards.filter((c) => c.t === 'quiz')) {
      assert.ok(c.a >= 0 && c.a < c.opts.length, l.id + ': resposta fora das opções');
      assert.ok(c.why, l.id + ': quiz sem explicação');
    }
  }
  assert.equal(ONB.length, 4);
});

test('Só a primeira aula começa liberada; a seguinte abre ao concluir', () => {
  let s = P.blank();
  assert.ok(P.isOpen(ALL, s, ALL[0].id));
  assert.ok(!P.isOpen(ALL, s, ALL[1].id));
  s = P.completeLesson(s, ALL[0], 1, d('2026-10-26')).state;
  assert.ok(P.isOpen(ALL, s, ALL[1].id));
  assert.ok(!P.isOpen(ALL, s, ALL[2].id));
  assert.equal(P.nextLesson(ALL, s).id, ALL[1].id);
  assert.equal(P.percent(ALL, s), 5);
});

test('XP por cartões e quizzes; refazer aula não soma de novo', () => {
  let r = P.completeLesson(P.blank(), ALL[0], 1, d('2026-10-26'));
  assert.equal(r.gained, ALL[0].cards.length * 10 + 20);
  const again = P.completeLesson(r.state, ALL[0], 1, d('2026-10-26'));
  assert.equal(again.gained, 0);
  assert.equal(again.state.xp, r.state.xp);
});

test('Sequência de dias: soma em dias seguidos, reinicia após pular um dia', () => {
  let s = P.completeLesson(P.blank(), ALL[0], 0, d('2026-10-26')).state;
  s = P.completeLesson(s, ALL[1], 0, d('2026-10-26')).state;
  assert.equal(s.streak, 1);
  s = P.completeLesson(s, ALL[2], 0, d('2026-10-27')).state;
  assert.equal(s.streak, 2);
  assert.equal(P.currentStreak(s, d('2026-10-28')), 2);
  assert.equal(P.currentStreak(s, d('2026-10-29')), 0);
  s = P.completeLesson(s, ALL[3], 0, d('2026-10-30')).state;
  assert.equal(s.streak, 1);
});

test('Virada de mês conta como dia seguido', () => {
  let s = P.completeLesson(P.blank(), ALL[0], 0, d('2026-10-31')).state;
  s = P.completeLesson(s, ALL[1], 0, d('2026-11-01')).state;
  assert.equal(s.streak, 2);
});

test('Juntar progresso de dois aparelhos não perde aulas', () => {
  const a = P.completeLesson(P.blank(), ALL[0], 1, d('2026-10-26')).state;
  let b = P.completeLesson(P.blank(), ALL[0], 0, d('2026-10-26')).state;
  b = P.completeLesson(b, ALL[1], 0, d('2026-10-27')).state;
  const m = P.merge(a, b);
  assert.ok(m.done[ALL[0].id] && m.done[ALL[1].id]);
  assert.equal(m.xp, Math.max(a.xp, b.xp));
  assert.equal(m.lastDay, '2026-10-27');
  assert.deepEqual(P.merge(null, undefined).done, {});
});

test('Contas do curso ficam separadas das do app de frequência', async () => {
  const m = new Map();
  const store = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
  const freq = A.create(store);
  const curso = A.create(store, { prefix: 'dcp' });
  await curso.createAccount('Ana', 'senha123', P.blank());
  assert.equal(freq.list().length, 0);
  assert.equal(curso.list().length, 1);
  assert.ok([...m.keys()].every((k) => k.startsWith('dcp:')));
});
