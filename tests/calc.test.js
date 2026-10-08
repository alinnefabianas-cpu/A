'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/calc.js');

const subj = (id, attendance, total) => ({ id, name: id, total: total === undefined ? 200 : total, attendance });
const cert = (id, startDate, endDate, opts) =>
  Object.assign({ id, startDate, endDate, allSubjects: true, subjectIds: [], confirmed: true }, opts || {});
const confirmWithDetected = (c, schedule, subjects) => Object.assign(c, { coveredLessons: C.detectLessons(c, schedule, subjects) });

// Grade do exemplo do enunciado
const MAT = 'mat';
const FIS = 'fis';
const POR = 'por';
const HIS = 'his';
const SUBJECTS = [{ id: MAT }, { id: FIS }, { id: POR }, { id: HIS }];
const SCHEDULE = [
  { id: 'q1', day: 4, subjectId: MAT, start: '08:00', end: '08:50' }, // quinta
  { id: 'q2', day: 4, subjectId: FIS, start: '09:00', end: '09:50' },
  { id: 's1', day: 5, subjectId: POR, start: '08:00', end: '08:50' }, // sexta
  { id: 's2', day: 5, subjectId: MAT, start: '09:00', end: '09:50' },
  { id: 'm1', day: 1, subjectId: HIS, start: '10:00', end: '10:50' }, // segunda
];

/* ----------------------------- Teste 1 ----------------------------- */
test('Teste 1: 100 aulas, 82 presenças, 18 faltas, 4 abonadas → 85,42%', () => {
  const r = C.computeSubject(subj(MAT, { counted: 100, presences: 82, absences: 18 }), 4);
  assert.equal(r.P, 82);
  assert.equal(r.F, 18);
  assert.equal(r.C, 4);
  assert.equal(r.Fv, 14);
  assert.equal(r.Tv, 96);
  assert.equal(C.fmtPct(r.freqOrig), '82,00%');
  assert.equal(C.fmtPct(r.freqReal), '85,42%');
  assert.equal(r.status, 'safe');
  assert.equal(r.estimate, false);
});

test('Teste 1 (variações): mesmos números a partir de dados parciais', () => {
  // faltas + total
  let r = C.computeSubject(subj(MAT, { counted: 100, absences: 18 }), 4);
  assert.equal(C.fmtPct(r.freqReal), '85,42%');
  // presenças + faltas
  r = C.computeSubject(subj(MAT, { presences: 82, absences: 18 }), 4);
  assert.equal(r.T, 100);
  assert.equal(C.fmtPct(r.freqReal), '85,42%');
  // total + percentual (exato)
  r = C.computeSubject(subj(MAT, { counted: 100, presencePct: 82 }), 4);
  assert.equal(r.P, 82);
  assert.equal(r.estimate, false);
  assert.equal(C.fmtPct(r.freqReal), '85,42%');
  // total + % de faltas
  r = C.computeSubject(subj(MAT, { counted: 100, absencePct: 18 }), 4);
  assert.equal(r.P, 82);
  assert.equal(C.fmtPct(r.freqReal), '85,42%');
});

/* ----------------------------- Teste 2 ----------------------------- */
test('Teste 2: dois atestados cobrindo a mesma aula → abonada uma vez', () => {
  const a = confirmWithDetected(cert('a', '2026-10-01', '2026-10-01'), SCHEDULE, SUBJECTS);
  const b = confirmWithDetected(cert('b', '2026-10-01', '2026-10-02'), SCHEDULE, SUBJECTS);
  const cov = C.computeCoverage([a, b]);
  // 01/10 (qui): Mat, Fís — 02/10 (sex): Port, Mat  → sem duplicar 01/10
  assert.equal(cov.bySubject[MAT], 2);
  assert.equal(cov.bySubject[FIS], 1);
  assert.equal(cov.bySubject[POR], 1);
  assert.equal(cov.lessons.length, 4);
  const overlaps = C.certificateOverlaps([a, b]);
  assert.equal(overlaps.a, 0);
  assert.equal(overlaps.b, 2);

  // Atestado idêntico duplicado também não soma
  const c = confirmWithDetected(cert('c', '2026-10-01', '2026-10-01'), SCHEDULE, SUBJECTS);
  assert.equal(C.computeCoverage([a, c]).bySubject[MAT], 1);

  // Efeito no cálculo
  const state = {
    subjects: [subj(MAT, { counted: 100, presences: 82, absences: 18 })],
    schedule: SCHEDULE,
    certificates: [a, c],
    settings: {},
  };
  const out = C.computeAll(state, '2026-10-08');
  assert.equal(out.results[0].C, 1);
  assert.equal(out.results[0].Fv, 17);
});

test('Aula dupla (mesma matéria, horários diferentes) conta como 2 aulas', () => {
  const sched = [
    { id: 'x1', day: 4, subjectId: MAT, start: '08:00' },
    { id: 'x2', day: 4, subjectId: MAT, start: '08:50' },
    { id: 'x3', day: 4, subjectId: MAT, start: '08:00' }, // duplicata na grade
  ];
  const lessons = C.detectLessons({ startDate: '2026-10-01', endDate: '2026-10-01', allSubjects: true }, sched, SUBJECTS);
  assert.equal(lessons.length, 2);
});

/* ----------------------------- Teste 3 ----------------------------- */
test('Teste 3: atestado de 01/10/2026 a 03/10/2026 com dias e matérias diferentes', () => {
  assert.equal(C.weekdayOf('2026-10-01'), 4); // quinta
  assert.equal(C.weekdayOf('2026-10-02'), 5); // sexta
  assert.equal(C.weekdayOf('2026-10-03'), 6); // sábado
  const lessons = C.detectLessons({ startDate: '2026-10-01', endDate: '2026-10-03', allSubjects: true }, SCHEDULE, SUBJECTS);
  const by = C.countBySubject(lessons);
  assert.deepEqual(by, { [MAT]: 2, [FIS]: 1, [POR]: 1 });
  assert.equal(by[HIS], undefined); // segunda não está no período
});

test('Teste 3b: atestado só para matérias selecionadas e período cruzando fim de semana', () => {
  const lessons = C.detectLessons({ startDate: '2026-10-02', endDate: '2026-10-05', allSubjects: false, subjectIds: [MAT, HIS] }, SCHEDULE, SUBJECTS);
  // sex 02: Mat (Port ignorada) · sáb/dom: nada · seg 05: História
  assert.deepEqual(
    lessons.map((l) => l.date + ' ' + l.subjectId),
    ['2026-10-02 ' + MAT, '2026-10-05 ' + HIS]
  );
});

test('Datas inválidas ou invertidas não detectam aulas', () => {
  assert.equal(C.detectLessons({ startDate: '2026-10-03', endDate: '2026-10-01', allSubjects: true }, SCHEDULE, SUBJECTS).length, 0);
  assert.equal(C.detectLessons({ startDate: '2026-02-30', endDate: '2026-03-01', allSubjects: true }, SCHEDULE, SUBJECTS).length, 0);
});

/* ----------------------------- Teste 4 ----------------------------- */
test('Teste 4: frequência abaixo de 75% → vermelho (danger)', () => {
  const r = C.computeSubject(subj(HIS, { counted: 100, absences: 30 }, 80), 0);
  assert.equal(C.fmtPct(r.freqReal), '70,00%');
  assert.equal(r.status, 'danger');
  assert.equal(r.presencesNeeded, 20); // (70+20)/(100+20) = 75%
  assert.equal(C.statusFromPct(74.99), 'danger');
});

/* ----------------------------- Teste 5 ----------------------------- */
test('Teste 5: exatamente 75% está dentro do limite (não é "abaixo")', () => {
  const r = C.computeSubject(subj(MAT, { counted: 100, absences: 25 }), 0);
  assert.equal(C.fmtPct(r.freqReal), '75,00%');
  assert.notEqual(r.status, 'danger');
  assert.equal(r.status, 'warning');
  assert.equal(r.allowedNow, 0);
  assert.equal(r.presencesNeeded, 0);
  // 3/4 também é exatamente 75%
  assert.equal(C.statusFromCounts(3, 4), 'warning');
  assert.equal(C.statusFromPct(75), 'warning');
  // Após abono chegando a 75% exatos: 75 presenças, 30 faltas, 5 abonadas → 75/100
  const r2 = C.computeSubject(subj(MAT, { presences: 75, absences: 30 }), 5);
  assert.equal(r2.Tv, 100);
  assert.notEqual(r2.status, 'danger');
});

test('Valor logo abaixo de 75% nunca é exibido como 75,00%', () => {
  assert.equal(C.fmtPct(74.996), '74,99%');
  assert.equal(C.fmtPct(75.004), '75,00%');
  assert.equal(C.fmtPct(85.416666), '85,42%');
});

/* ----------------------------- Teste 6 ----------------------------- */
test('Teste 6: somente percentual → marcado como estimativa', () => {
  const r = C.computeSubject(subj(MAT, { presencePct: 82.5 }), 0);
  assert.equal(r.mode, 'percent');
  assert.equal(r.estimate, true);
  assert.equal(r.hasCounts, false);
  assert.equal(C.fmtPct(r.freqOrig), '82,50%');
  assert.equal(r.allowedNow, null); // não inventa quantidade
  assert.equal(r.Fv, null);

  // Com atestado mas sem quantidades: não recalcula (não inventa)
  const r2 = C.computeSubject(subj(MAT, { presencePct: 82.5 }), 3);
  assert.equal(r2.freqReal, null);
  assert.ok(r2.warnings.some((w) => /não é possível recalcular/.test(w)));

  // Percentual + faltas → total deduzido = estimativa
  const r3 = C.computeSubject(subj(MAT, { presencePct: 78.5, absences: 10 }), 0);
  assert.equal(r3.estimate, true);
  assert.equal(r3.mode, 'derived');
});

test('Somente percentual + início do período: estimativa pela grade', () => {
  const state = {
    subjects: [subj(MAT, { presencePct: 80 }, 200)],
    schedule: [{ id: 'a', day: 1, subjectId: MAT, start: '08:00' }],
    certificates: [],
    settings: { periodStart: '2026-09-07' }, // segunda
  };
  // segundas de 07/09 a 05/10: 07, 14, 21, 28/09, 05/10 → 5 aulas
  const out = C.computeAll(state, '2026-10-05');
  const r = out.results[0];
  assert.equal(r.T, 5);
  assert.equal(r.P, 4);
  assert.equal(r.estimate, true);
  assert.equal(C.fmtPct(r.freqReal), '80,00%');
});

/* ----------------------------- Limites ----------------------------- */
test('Quantas faltas ainda pode ter (agora e até o fim do período)', () => {
  // Matemática: 200 no período, 100 dadas, 82 presenças, 14 faltas válidas (Tv 96)
  const r = C.computeSubject(subj(MAT, { counted: 100, presences: 82, absences: 18 }, 200), 4);
  // agora: maior x com 82/(96+x) ≥ 0,75 → x ≤ 13,33 → 13
  assert.equal(r.allowedNow, 13);
  assert.ok(82 / (96 + 13) >= 0.75);
  assert.ok(82 / (96 + 14) < 0.75);
  // período: R = 100; (82+100−x)/(96+100) ≥ 0,75 → x ≤ 35
  assert.equal(r.remaining, 100);
  assert.equal(r.allowedPeriod, 35);
  assert.ok((82 + 100 - 35) / 196 >= 0.75);
  assert.ok((82 + 100 - 36) / 196 < 0.75);
});

test('Limite exato: ao atingir o máximo fica exatamente em 75%', () => {
  // 30 presenças, 10 faltas = 75% → pode faltar 0 agora
  assert.equal(C.allowedAbsencesNow(30, 40), 0);
  // 45 presenças, 10 faltas: 45/(55+x) ≥ .75 → x ≤ 5
  assert.equal(C.allowedAbsencesNow(45, 55), 5);
  assert.equal(C.simulate(45, 55, 5), 75);
});

test('Simulador de faltas', () => {
  // Frequência atual 82,50% (33/40); +3 faltas → 33/43
  assert.equal(C.fmtPct(C.simulate(33, 40, 0)), '82,50%');
  assert.equal(C.fmtPct(C.simulate(33, 40, 3)), '76,74%');
  assert.equal(C.simulateEndOfPeriod(33, 40, 10, 3), (33 + 7) / 50 * 100);
  assert.equal(C.simulateEndOfPeriod(33, 40, 10, 11), null);
});

test('Abono nunca ultrapassa as faltas registradas', () => {
  const r = C.computeSubject(subj(MAT, { presences: 50, absences: 2 }), 5);
  assert.equal(r.C, 2);
  assert.equal(r.Fv, 0);
  assert.equal(r.coveredExcess, 3);
  assert.equal(C.fmtPct(r.freqReal), '100,00%');
  assert.ok(r.warnings.length > 0);
});

test('Dados inconsistentes geram aviso, sem inventar', () => {
  const r = C.computeSubject(subj(MAT, { presences: 82, absences: 18, counted: 120 }), 0);
  assert.equal(r.T, 100);
  assert.ok(r.warnings.some((w) => /diferente/.test(w)));
  const v = C.validateAttendance({ presences: '-1', counted: '10', absences: '20', presencePct: '120' });
  assert.ok(v.presences && v.absences && v.presencePct);
  assert.deepEqual(C.validateAttendance({ presences: '1.5' }), { presences: 'Use um número inteiro' });
  assert.equal(C.computeSubject(subj(MAT, {}), 0).status, 'unknown');
  assert.equal(C.computeSubject(subj(MAT, { absences: 3 }), 0).mode, 'insufficient');
});

test('Resumo geral', () => {
  const state = {
    subjects: [
      subj('a', { counted: 100, presences: 82, absences: 18 }),
      subj('b', { counted: 100, absences: 22 }),
      subj('c', { counted: 100, absences: 30 }),
      subj('d', {}),
    ],
    schedule: [],
    certificates: [{ id: 'x', confirmed: true, coveredLessons: [{ key: 'k1', date: '2026-10-01', subjectId: 'a', start: '08:00' }] }],
    settings: { attentionMargin: 5 },
  };
  const { summary } = C.computeAll(state, '2026-10-08');
  assert.equal(summary.safe, 1);
  assert.equal(summary.warning, 1);
  assert.equal(summary.danger, 1);
  assert.equal(summary.unknown, 1);
  assert.equal(summary.covered, 1);
  assert.equal(summary.validAbsences, 17 + 22 + 30);
});

test('Atestado pendente (não confirmado) não abona nada', () => {
  const c = confirmWithDetected(cert('p', '2026-10-01', '2026-10-02', { confirmed: false }), SCHEDULE, SUBJECTS);
  assert.equal(C.computeCoverage([c]).lessons.length, 0);
});

test('21 matérias padrão com os totais corretos', () => {
  assert.equal(C.DEFAULT_SUBJECTS.length, 21);
  const map = Object.fromEntries(C.DEFAULT_SUBJECTS);
  assert.equal(map['Matemática'], 200);
  assert.equal(map['Língua Portuguesa'], 80);
  assert.equal(map['Political Science'], 120);
  assert.equal(map['GGG'], 40);
  assert.equal(C.DEFAULT_SUBJECTS.reduce((s, [, n]) => s + n, 0), 1680);
});
