'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/calc.js');
const PZ = require('../js/parsers.js');

const SUBJECTS = C.DEFAULT_SUBJECTS.map(([name], i) => ({ id: 's' + i, name }));
const id = (name) => SUBJECTS.find((s) => s.name === name).id;

test('Frequência: formato do enunciado ("Matemática: 78,5% de frequência / Faltas: 10")', () => {
  const rows = PZ.parseAttendanceText('Matemática: 78,5% de frequência\nFaltas: 10', SUBJECTS);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].subjectId, id('Matemática'));
  assert.deepEqual(rows[0].values, { presencePct: 78.5, absences: 10 });
});

test('Frequência: tabela com cabeçalho', () => {
  const text = [
    'Disciplina   Aulas  Presenças  Faltas  Frequência',
    'Matemática   100    82         18      82,00%',
    'Física       60     50         10      83,33%',
    'Educação Física 20 19 1 95%',
  ].join('\n');
  const rows = PZ.parseAttendanceText(text, SUBJECTS);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows[0].values, { counted: 100, presences: 82, absences: 18, presencePct: 82 });
  assert.equal(rows[1].subjectId, id('Física'));
  assert.equal(rows[2].subjectId, id('Educação Física'));
  assert.deepEqual(rows[2].values, { counted: 20, presences: 19, absences: 1, presencePct: 95 });
});

test('Frequência: números sem rótulo não são atribuídos (não inventa)', () => {
  const rows = PZ.parseAttendanceText('História 40 10', SUBJECTS);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].values, {});
  assert.deepEqual(rows[0].unassigned, [40, 10]);
});

test('Frequência: "ela" minúsculo não é a matéria ELA', () => {
  const rows = PZ.parseAttendanceText('ela faltou 3 vezes\nELA 90%', SUBJECTS);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].subjectId, id('ELA'));
  assert.equal(rows[0].values.presencePct, 90);
});

test('Frequência: apelidos (Português, Inglês, Redação)', () => {
  const rows = PZ.parseAttendanceText('Português 90%\nInglês 80%\nRedação 70%', SUBJECTS);
  assert.deepEqual(rows.map((r) => r.subjectId), [id('Língua Portuguesa'), id('Língua Inglesa'), id('Produção de Texto')]);
});

test('Grade: lista por dia', () => {
  const text = 'Segunda\n08:00 — Matemática\n09:00 - 09:50 Física\n10:00 História\nTerça-feira\n08:00 Português\n9h00 Matemática';
  const rows = PZ.parseScheduleText(text, SUBJECTS);
  assert.deepEqual(
    rows.map((r) => [r.day, r.start, r.end, r.subjectName]),
    [
      [1, '08:00', '', 'Matemática'],
      [1, '09:00', '09:50', 'Física'],
      [1, '10:00', '', 'História'],
      [2, '08:00', '', 'Língua Portuguesa'],
      [2, '09:00', '', 'Matemática'],
    ]
  );
});

test('Grade: tabela com dias nas colunas (dia marcado como inferido)', () => {
  const text = 'Horário Segunda Terça Quarta Quinta Sexta\n07:30 Matemática Física Química Biologia Geografia';
  const rows = PZ.parseScheduleText(text, SUBJECTS);
  assert.equal(rows.length, 5);
  assert.deepEqual(rows.map((r) => r.day), [1, 2, 3, 4, 5]);
  assert.ok(rows.every((r) => r.inferredDay && r.start === '07:30'));
});

test('Atestado: datas e quantidade de dias', () => {
  const r = PZ.parseCertificateText('Atesto para os devidos fins que o paciente necessita de 3 (três) dias de afastamento a partir de 01/10/2026. CID J11');
  assert.deepEqual(r.dates, ['2026-10-01']);
  assert.equal(r.days, 3);
  assert.equal(r.suggestedStart, '2026-10-01');
  assert.equal(r.suggestedEnd, '2026-10-03');
});

test('Atestado: período com duas datas e dias por extenso', () => {
  const r = PZ.parseCertificateText('Afastamento de 05/10/26 a 07/10/26, dois dias');
  assert.deepEqual(r.dates, ['2026-10-05', '2026-10-07']);
  assert.equal(r.days, 2);
  const r2 = PZ.parseCertificateText('Afastamento de 05/10/2026 a 07/10/2026');
  assert.equal(r2.suggestedEnd, '2026-10-07');
});

test('Atestado: texto sem datas não inventa nada', () => {
  const r = PZ.parseCertificateText('Documento ilegível');
  assert.deepEqual(r.dates, []);
  assert.equal(r.days, null);
  assert.equal(r.suggestedStart, '');
});
