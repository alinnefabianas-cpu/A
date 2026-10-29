'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Q = require('../quiz/quiz-logic.js');

const all = (k) => Array(7).fill(k);

test('7 perguntas, cada uma com 4 alternativas A–D', () => {
  assert.equal(Q.QUESTIONS.length, 7);
  Q.QUESTIONS.forEach((q) => {
    assert.ok(q.text.endsWith('?'));
    assert.deepEqual(Object.keys(q.options), ['A', 'B', 'C', 'D']);
  });
});

test('cada letra corresponde a um perfil', () => {
  assert.equal(Q.PROFILES.A.name, 'Distrações constantes');
  assert.equal(Q.PROFILES.B.name, 'Falta de prioridades');
  assert.equal(Q.PROFILES.C.name, 'Sobrecarga de tarefas');
  assert.equal(Q.PROFILES.D.name, 'Dificuldade para começar');
});

test('respostas unânimes levam a cada um dos quatro perfis', () => {
  for (const k of ['A', 'B', 'C', 'D']) {
    const r = Q.classify(all(k));
    assert.equal(r.key, k);
    assert.equal(r.counts[k], 7);
    assert.equal(r.tie, false);
  }
});

test('contagem dos quatro perfis', () => {
  const answers = ['A', 'B', 'C', 'D', 'A', 'C', 'C'];
  assert.deepEqual(Q.countAnswers(answers), { A: 2, B: 1, C: 3, D: 1 });
  const r = Q.classify(answers);
  assert.equal(r.key, 'C');
  assert.equal(r.tie, false);
});

test('maioria simples vence mesmo que a última resposta seja de outro perfil', () => {
  assert.equal(Q.classify(['D', 'D', 'D', 'A', 'B', 'C', 'A']).key, 'D');
});

test('empate: vence o perfil empatado da resposta mais recente', () => {
  // A=3, B=3 → última resposta entre os empatados é B
  let r = Q.classify(['A', 'A', 'A', 'B', 'B', 'C', 'B']);
  assert.equal(r.tie, true);
  assert.deepEqual(r.tied, ['A', 'B']);
  assert.equal(r.key, 'B');

  // A=3, B=3, última resposta é C (não empatado) → olha a anterior (A)
  r = Q.classify(['B', 'B', 'B', 'A', 'A', 'A', 'C']);
  assert.equal(r.key, 'A');

  // empate triplo 2-2-2-1, última é D (fora) → penúltima é C
  r = Q.classify(['A', 'B', 'A', 'B', 'C', 'C', 'D']);
  assert.deepEqual(r.tied, ['A', 'B', 'C']);
  assert.equal(r.key, 'C');

  // mesma contagem, ordem diferente → resultado diferente (determinístico)
  assert.equal(Q.classify(['C', 'C', 'A', 'B', 'A', 'B', 'D']).key, 'B');
});

test('classificação não altera as respostas', () => {
  const answers = ['A', 'B', 'A', 'B', 'C', 'C', 'D'];
  const copy = answers.slice();
  Q.classify(answers);
  assert.deepEqual(answers, copy);
});

test('respostas incompletas ou inválidas não geram resultado', () => {
  assert.equal(Q.classify(null), null);
  assert.equal(Q.classify([]), null);
  assert.equal(Q.classify(['A', 'B', 'C', 'D', 'A', 'B']), null);
  assert.equal(Q.classify(['A', 'B', 'C', 'D', 'A', 'B', null]), null);
  assert.equal(Q.classify(['A', 'B', 'C', 'D', 'A', 'B', 'E']), null);
  assert.equal(Q.classify(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D']), null);
});

test('sanitizeState: preserva respostas válidas e descarta lixo', () => {
  const s = Q.sanitizeState({ started: true, current: 2, answers: ['A', 'X', 'C', 5] });
  assert.equal(s.started, true);
  assert.deepEqual(s.answers, ['A', null, 'C', null, null, null, null]);
  // não deixa pular para depois da primeira pergunta sem resposta
  assert.equal(s.current, 1);
});

test('sanitizeState: limites de current e entrada inválida', () => {
  assert.deepEqual(Q.sanitizeState(null), Q.emptyState());
  assert.deepEqual(Q.sanitizeState('x'), Q.emptyState());
  const full = Q.sanitizeState({ started: true, current: 99, answers: all('B') });
  assert.equal(full.current, 6);
  assert.equal(Q.sanitizeState({ current: -3, answers: all('B') }).current, 0);
  assert.equal(Q.sanitizeState({ current: 1.5, answers: all('B') }).current, 0);
});

test('textos de resultado não usam linguagem clínica', () => {
  for (const k of ['A', 'B', 'C', 'D']) {
    const p = Q.PROFILES[k];
    const text = (p.title + p.description + p.nextStep).toLowerCase();
    for (const w of ['diagnóstico', 'tdah', 'transtorno', 'cura', 'dopamina']) assert.ok(!text.includes(w), w);
  }
});

test('Falta de prioridades: primeiro passo com exemplo separado', () => {
  const p = Q.PROFILES.B;
  assert.equal(p.description, 'Suas respostas indicam que decidir por onde começar pode estar consumindo tempo e energia.');
  assert.equal(p.nextStep, 'Escolha uma tarefa importante e escreva uma única ação concreta para iniciá-la.');
  assert.match(p.example, /resolver a primeira questão da lista/);
});
