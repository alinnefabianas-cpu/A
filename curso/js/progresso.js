/*
 * Regras de progresso do curso (puras, testáveis em Node):
 * aulas liberadas em sequência, XP, sequência de dias e junção de progresso
 * vindo de dois aparelhos.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Progresso = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const QUIZ_XP = 20;
  const CARD_XP = 10;

  const blank = () => ({
    version: 1,
    onb: null,
    done: {},
    xp: 0,
    streak: 0,
    lastDay: null,
    check: {},
    calc: { price: 150, videos: 12, clients: 4, hours: 1 },
    updatedAt: null,
  });

  /** Completa campos que faltam (estado salvo por versões anteriores). */
  function normalize(s) {
    const b = blank();
    if (!s || typeof s !== 'object') return b;
    return Object.assign(b, s, {
      done: Object.assign({}, s.done),
      check: Object.assign({}, s.check),
      calc: Object.assign(b.calc, s.calc),
    });
  }

  const flatten = (course) => course.flatMap((m) => m.lessons.map((l) => Object.assign({}, l, { mod: m })));
  const lessonXP = (l) => l.cards.length * CARD_XP;

  function isOpen(all, state, id) {
    const i = all.findIndex((l) => l.id === id);
    if (i < 0) return false;
    return i === 0 || !!state.done[id] || !!state.done[all[i - 1].id];
  }

  const nextLesson = (all, state) => all.find((l) => !state.done[l.id]) || null;
  const percent = (all, state) => Math.round((all.filter((l) => state.done[l.id]).length / all.length) * 100);

  /** Data local AAAA-MM-DD (o dia do aluno, não o de Greenwich). */
  function dayKey(date) {
    const d = date || new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function previousDay(key) {
    const [y, m, d] = key.split('-').map(Number);
    return dayKey(new Date(y, m - 1, d - 1));
  }

  /**
   * Registra a conclusão de uma aula. `quizRight` é o número de quizzes
   * acertados. Refazer uma aula concluída não dá XP de novo.
   * Retorna { state, gained }.
   */
  function completeLesson(state, lesson, quizRight, now) {
    const s = normalize(state);
    if (s.done[lesson.id]) return { state: s, gained: 0 };
    const gained = lessonXP(lesson) + (quizRight || 0) * QUIZ_XP;
    const today = dayKey(now);
    s.done[lesson.id] = true;
    s.xp += gained;
    if (s.lastDay !== today) s.streak = s.lastDay === previousDay(today) ? s.streak + 1 : 1;
    s.lastDay = today;
    s.updatedAt = (now || new Date()).toISOString();
    return { state: s, gained };
  }

  /** Sequência exibida: zera se o aluno passou mais de um dia sem estudar. */
  function currentStreak(state, now) {
    if (!state.lastDay) return 0;
    const today = dayKey(now);
    return state.lastDay === today || state.lastDay === previousDay(today) ? state.streak : 0;
  }

  /**
   * Junta o progresso de dois aparelhos sem perder aulas concluídas:
   * união das aulas, maior XP e a sequência do registro mais recente.
   */
  function merge(a, b) {
    const x = normalize(a);
    const y = normalize(b);
    const newer = (y.updatedAt || '') > (x.updatedAt || '') ? y : x;
    const out = normalize(newer);
    out.done = Object.assign({}, x.done, y.done);
    out.xp = Math.max(x.xp, y.xp);
    out.onb = newer.onb || x.onb || y.onb;
    if ((x.lastDay || '') > (y.lastDay || '')) {
      out.lastDay = x.lastDay;
      out.streak = x.streak;
    } else if ((y.lastDay || '') > (x.lastDay || '')) {
      out.lastDay = y.lastDay;
      out.streak = y.streak;
    } else {
      out.streak = Math.max(x.streak, y.streak);
    }
    return out;
  }

  return { blank, normalize, flatten, lessonXP, isOpen, nextLesson, percent, dayKey, completeLesson, currentStreak, merge, QUIZ_XP };
});
