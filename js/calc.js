/*
 * Controle de Frequência Escolar — núcleo de cálculo.
 *
 * Funções puras, sem dependência do DOM, para que possam ser testadas em Node
 * (tests/calc.test.js) e usadas no navegador (window.Calc).
 *
 * Regras principais:
 *   faltas válidas  = faltas registradas − faltas cobertas por atestado
 *   aulas válidas   = presenças + faltas válidas
 *   frequência real = presenças / aulas válidas × 100
 *   limite mínimo   = 75% (exatamente 75% está DENTRO do limite)
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Calc = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const THRESHOLD = 75;
  const DEFAULT_ATTENTION_MARGIN = 5;
  const EPS = 1e-9;
  const MAX_CERT_DAYS = 400;

  const DEFAULT_SUBJECTS = [
    ['Língua Portuguesa', 80],
    ['Produção de Texto', 80],
    ['Literatura', 80],
    ['Artes', 40],
    ['Língua Inglesa', 40],
    ['Educação Física', 40],
    ['Matemática', 200],
    ['Biologia', 120],
    ['Física', 120],
    ['Geografia', 80],
    ['Química', 120],
    ['Filosofia', 40],
    ['História', 80],
    ['Sociologia', 40],
    ['ELA', 80],
    ['Orientação', 40],
    ['Political Science', 120],
    ['Nutrition', 120],
    ['GGG', 40],
    ['Espanhol', 40],
    ['Itinerário', 80],
  ];

  const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /* ------------------------------------------------------------------ */
  /* Utilidades numéricas                                                */
  /* ------------------------------------------------------------------ */

  function toNum(v) {
    if (v === '' || v === null || v === undefined) return null;
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const s = String(v).trim().replace('%', '').replace(',', '.');
    if (s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function isInt(n) {
    return typeof n === 'number' && Number.isInteger(n);
  }

  /**
   * Formata um percentual em pt-BR com 2 casas ("85,42%").
   * Se o arredondamento fizer um valor abaixo do limite parecer igual ao
   * limite (ex.: 74,996% → "75,00%"), trunca para não mostrar um número
   * enganoso ("74,99%").
   */
  function fmtPct(value, threshold) {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    const thr = threshold === undefined ? THRESHOLD : threshold;
    let rounded = Math.round(value * 100) / 100;
    if (value < thr - EPS && rounded >= thr) rounded = Math.floor(value * 100) / 100;
    return rounded.toFixed(2).replace('.', ',') + '%';
  }

  /* ------------------------------------------------------------------ */
  /* Frequência informada pelo usuário                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Valida os campos de frequência. Retorna { field: mensagem }.
   */
  function validateAttendance(input) {
    const errors = {};
    const a = input || {};
    ['presences', 'absences', 'counted'].forEach((k) => {
      if (a[k] === '' || a[k] === null || a[k] === undefined) return;
      const n = toNum(a[k]);
      if (n === null) errors[k] = 'Número inválido';
      else if (n < 0) errors[k] = 'Não pode ser negativo';
      else if (!isInt(n)) errors[k] = 'Use um número inteiro';
    });
    ['presencePct', 'absencePct'].forEach((k) => {
      if (a[k] === '' || a[k] === null || a[k] === undefined) return;
      const n = toNum(a[k]);
      if (n === null) errors[k] = 'Percentual inválido';
      else if (n < 0 || n > 100) errors[k] = 'Use um valor entre 0 e 100';
    });
    const P = toNum(a.presences);
    const F = toNum(a.absences);
    const T = toNum(a.counted);
    if (!errors.presences && !errors.counted && P !== null && T !== null && P > T) errors.presences = 'Presenças maiores que o total';
    if (!errors.absences && !errors.counted && F !== null && T !== null && F > T) errors.absences = 'Faltas maiores que o total';
    return errors;
  }

  /**
   * A partir dos dados que o usuário tiver (qualquer combinação), deduz
   * presenças (P), faltas (F) e total contabilizado (T).
   *
   * mode:
   *   'exact'   — quantidades exatas (informadas ou deduzidas sem ambiguidade)
   *   'derived' — quantidades deduzidas de percentual, mas que não são exatas → estimativa
   *   'percent' — só há percentual; nenhuma quantidade
   *   'insufficient' — há dados, mas não dá para calcular nada
   *   'empty'   — nada informado
   */
  function deriveAttendance(input) {
    const a = input || {};
    const notes = [];
    const warnings = [];
    let P = toNum(a.presences);
    let F = toNum(a.absences);
    let T = toNum(a.counted);
    const givenPct = toNum(a.presencePct);
    const givenAbsPct = toNum(a.absencePct);
    let pct = givenPct;
    let estimate = false;

    if (pct === null && givenAbsPct !== null) {
      pct = 100 - givenAbsPct;
      notes.push('Percentual de presença = 100% − ' + fmtPct(givenAbsPct) + ' de faltas = ' + fmtPct(pct) + '.');
    } else if (pct !== null && givenAbsPct !== null && Math.abs(pct + givenAbsPct - 100) > 0.11) {
      warnings.push('Os percentuais de presença (' + fmtPct(pct) + ') e de falta (' + fmtPct(givenAbsPct) + ') não somam 100%. Usando o de presença.');
    }

    if (P === null && F === null && T === null && pct === null) {
      return { mode: 'empty', P: null, F: null, T: null, pct: null, estimate: false, notes, warnings };
    }

    if (P !== null && F !== null) {
      const t = P + F;
      if (T !== null && T !== t) {
        warnings.push('O total informado (' + T + ') é diferente de presenças + faltas (' + P + ' + ' + F + ' = ' + t + '). Usando ' + t + '.');
      }
      if (T === null) notes.push('Total de aulas = presenças + faltas = ' + P + ' + ' + F + ' = ' + t + '.');
      T = t;
    } else if (T !== null && P !== null) {
      F = T - P;
      notes.push('Faltas = total − presenças = ' + T + ' − ' + P + ' = ' + F + '.');
    } else if (T !== null && F !== null) {
      P = T - F;
      notes.push('Presenças = total − faltas = ' + T + ' − ' + F + ' = ' + P + '.');
    } else if (T !== null && pct !== null) {
      const raw = (T * pct) / 100;
      P = Math.round(raw);
      F = T - P;
      // Percentual normalmente vem arredondado; tolera o erro de arredondamento.
      const tolerance = T * 0.005 + 0.01;
      if (Math.abs(raw - P) > tolerance) {
        estimate = true;
        warnings.push('O percentual não corresponde a um número inteiro de presenças em ' + T + ' aulas. Valores aproximados.');
      }
      notes.push('Presenças = ' + T + ' × ' + fmtPct(pct) + ' = ' + raw.toFixed(2).replace('.', ',') + ' → ' + P + '. Faltas = ' + T + ' − ' + P + ' = ' + F + '.');
    } else if (F !== null && pct !== null) {
      if (pct >= 100) {
        if (F > 0) warnings.push('Percentual de 100% é incompatível com ' + F + ' falta(s).');
        return { mode: 'percent', P: null, F: null, T: null, pct, estimate: true, notes, warnings };
      }
      const rawT = F / (1 - pct / 100);
      T = Math.round(rawT);
      P = T - F;
      estimate = true;
      notes.push('Total estimado = faltas ÷ (1 − ' + fmtPct(pct) + ') = ' + rawT.toFixed(2).replace('.', ',') + ' → ' + T + '. Presenças = ' + T + ' − ' + F + ' = ' + P + '.');
    } else if (P !== null && pct !== null) {
      if (pct <= 0) {
        warnings.push('Percentual de 0% é incompatível com presenças registradas.');
        return { mode: 'percent', P: null, F: null, T: null, pct, estimate: true, notes, warnings };
      }
      const rawT = P / (pct / 100);
      T = Math.round(rawT);
      F = T - P;
      estimate = true;
      notes.push('Total estimado = presenças ÷ ' + fmtPct(pct) + ' = ' + rawT.toFixed(2).replace('.', ',') + ' → ' + T + '. Faltas = ' + T + ' − ' + P + ' = ' + F + '.');
    } else if (pct !== null) {
      return { mode: 'percent', P: null, F: null, T: null, pct, estimate: true, notes, warnings };
    } else {
      return { mode: 'insufficient', P: null, F: null, T: null, pct: null, estimate: false, notes, warnings };
    }

    if (P < 0 || F < 0) {
      warnings.push('Os dados informados são inconsistentes (resultado negativo).');
      return { mode: 'insufficient', P: null, F: null, T: null, pct: givenPct, estimate: false, notes, warnings };
    }

    const computedPct = T > 0 ? (P / T) * 100 : null;
    if (!estimate && pct !== null && computedPct !== null && Math.abs(computedPct - pct) > 0.6) {
      warnings.push('O percentual informado (' + fmtPct(pct) + ') não bate com as quantidades (' + P + '/' + T + ' = ' + fmtPct(computedPct) + '). Usando as quantidades.');
    }

    return {
      mode: estimate ? 'derived' : 'exact',
      P,
      F,
      T,
      pct: estimate && pct !== null ? pct : computedPct,
      estimate,
      notes,
      warnings,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Status em relação ao limite de 75%                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Status por comparação exata (sem erro de ponto flutuante) quando há
   * quantidades: P/Tv ≥ 75%  ⇔  100·P ≥ 75·Tv.
   */
  function statusFromCounts(P, Tv, margin, threshold) {
    const thr = threshold === undefined ? THRESHOLD : threshold;
    const m = margin === undefined ? DEFAULT_ATTENTION_MARGIN : margin;
    if (P === null || Tv === null || Tv <= 0) return 'unknown';
    if (100 * P < thr * Tv - EPS) return 'danger';
    if (100 * P < (thr + m) * Tv - EPS) return 'warning';
    return 'safe';
  }

  function statusFromPct(pct, margin, threshold) {
    const thr = threshold === undefined ? THRESHOLD : threshold;
    const m = margin === undefined ? DEFAULT_ATTENTION_MARGIN : margin;
    if (pct === null || pct === undefined || !Number.isFinite(pct)) return 'unknown';
    if (pct < thr - EPS) return 'danger';
    if (pct < thr + m - EPS) return 'warning';
    return 'safe';
  }

  /** Maior x tal que P / (Tv + x) ≥ 75%  →  x = ⌊100·P/75 − Tv⌋. */
  function allowedAbsencesNow(P, Tv, threshold) {
    const thr = threshold === undefined ? THRESHOLD : threshold;
    if (P === null || Tv === null) return null;
    const x = Math.floor((100 * P) / thr - Tv + EPS);
    return Math.max(0, x);
  }

  /**
   * Considerando R aulas restantes no período, maior x (faltas futuras) tal que
   * (P + R − x) / (Tv + R) ≥ 75%. Retorna null se não for possível calcular,
   * ou um número negativo se nem comparecendo a todas atingirá o limite.
   */
  function allowedAbsencesInPeriod(P, Tv, R, threshold) {
    const thr = threshold === undefined ? THRESHOLD : threshold;
    if (P === null || Tv === null || R === null || R < 0) return null;
    const x = Math.floor((100 * (P + R) - thr * (Tv + R)) / 100 + EPS);
    return Math.min(x, R);
  }

  /** Menor k (presenças seguidas) tal que (P + k) / (Tv + k) ≥ 75%. */
  function presencesNeeded(P, Tv, threshold) {
    const thr = threshold === undefined ? THRESHOLD : threshold;
    if (P === null || Tv === null) return null;
    if (100 * P >= thr * Tv - EPS) return 0;
    if (thr >= 100) return null;
    return Math.ceil((thr * Tv - 100 * P) / (100 - thr) - EPS);
  }

  /** Frequência se faltar mais x aulas (sem novas presenças). */
  function simulate(P, Tv, extraAbsences) {
    const x = Math.max(0, Math.floor(toNum(extraAbsences) || 0));
    if (P === null || Tv === null || Tv + x <= 0) return null;
    return (P / (Tv + x)) * 100;
  }

  /** Frequência ao fim do período se faltar x das R aulas restantes e comparecer às demais. */
  function simulateEndOfPeriod(P, Tv, R, extraAbsences) {
    const x = Math.max(0, Math.floor(toNum(extraAbsences) || 0));
    if (P === null || Tv === null || R === null || R < 0 || x > R) return null;
    const total = Tv + R;
    if (total <= 0) return null;
    return ((P + R - x) / total) * 100;
  }

  /* ------------------------------------------------------------------ */
  /* Datas e grade                                                       */
  /* ------------------------------------------------------------------ */

  function parseISO(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return null;
    const y = +m[1];
    const mo = +m[2];
    const d = +m[3];
    const t = Date.UTC(y, mo - 1, d);
    const dt = new Date(t);
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return t;
  }

  function toISO(t) {
    const d = new Date(t);
    const p = (n) => String(n).padStart(2, '0');
    return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate());
  }

  function weekdayOf(iso) {
    const t = parseISO(iso);
    return t === null ? null : new Date(t).getUTCDay();
  }

  function fmtDateBR(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }

  function addDays(iso, n) {
    const t = parseISO(iso);
    return t === null ? null : toISO(t + n * 86400000);
  }

  function daysBetweenInclusive(startISO, endISO) {
    const a = parseISO(startISO);
    const b = parseISO(endISO);
    if (a === null || b === null) return null;
    return Math.round((b - a) / 86400000) + 1;
  }

  function timeToMinutes(hhmm) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
    return m ? +m[1] * 60 + +m[2] : null;
  }

  /** Chave única de uma aula: mesma data + mesma matéria + mesmo horário = mesma aula. */
  function lessonKey(date, subjectId, start) {
    return date + '|' + subjectId + '|' + (start || '');
  }

  /**
   * Lista as aulas da grade que acontecem entre startISO e endISO (inclusive),
   * filtrando pelas matérias afetadas (subjectIds, ou todas se allSubjects).
   * Cada aula é identificada por data + matéria + horário; duplicatas na
   * grade são ignoradas.
   */
  function detectLessons(params, schedule, subjects) {
    const p = params || {};
    const a = parseISO(p.startDate);
    const b = parseISO(p.endDate);
    if (a === null || b === null || b < a) return [];
    const days = Math.round((b - a) / 86400000) + 1;
    if (days > MAX_CERT_DAYS) return [];
    const validSubjects = new Set((subjects || []).map((s) => s.id));
    const affected = p.allSubjects ? validSubjects : new Set((p.subjectIds || []).filter((id) => validSubjects.has(id)));
    const byWeekday = {};
    (schedule || []).forEach((e) => {
      if (!affected.has(e.subjectId)) return;
      (byWeekday[e.day] = byWeekday[e.day] || []).push(e);
    });
    const out = [];
    const seen = new Set();
    for (let i = 0; i < days; i++) {
      const t = a + i * 86400000;
      const date = toISO(t);
      const wd = new Date(t).getUTCDay();
      const entries = (byWeekday[wd] || []).slice().sort((x, y) => (timeToMinutes(x.start) || 0) - (timeToMinutes(y.start) || 0));
      entries.forEach((e) => {
        const key = lessonKey(date, e.subjectId, e.start);
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ key, date, weekday: wd, subjectId: e.subjectId, scheduleId: e.id, start: e.start || '', end: e.end || '' });
      });
    }
    return out;
  }

  /** Conta aulas por matéria em uma lista de aulas. */
  function countBySubject(lessons) {
    const out = {};
    (lessons || []).forEach((l) => {
      out[l.subjectId] = (out[l.subjectId] || 0) + 1;
    });
    return out;
  }

  /**
   * União das aulas abonadas por todos os atestados confirmados.
   * Uma mesma aula (mesma chave) coberta por dois atestados conta uma vez.
   * Retorna { bySubject: {id: n}, keys: Set, lessons: [...] }.
   */
  function computeCoverage(certificates) {
    const keys = new Set();
    const lessons = [];
    (certificates || []).forEach((c) => {
      if (!c || !c.confirmed) return;
      (c.coveredLessons || []).forEach((l) => {
        const key = l.key || lessonKey(l.date, l.subjectId, l.start);
        if (keys.has(key)) return;
        keys.add(key);
        lessons.push(Object.assign({}, l, { key }));
      });
    });
    return { bySubject: countBySubject(lessons), keys, lessons };
  }

  /** Para cada atestado: quantas das suas aulas também estão em outro atestado confirmado anterior na lista. */
  function certificateOverlaps(certificates) {
    const owner = {};
    const out = {};
    (certificates || []).forEach((c) => {
      if (!c || !c.confirmed) return;
      let dup = 0;
      (c.coveredLessons || []).forEach((l) => {
        const key = l.key || lessonKey(l.date, l.subjectId, l.start);
        if (owner[key] && owner[key] !== c.id) dup++;
        else owner[key] = c.id;
      });
      out[c.id] = dup;
    });
    return out;
  }

  /**
   * Estima quantas aulas de uma matéria já aconteceram desde o início do
   * período até a data de referência, a partir da grade. Usado apenas quando
   * o usuário informou só o percentual (resultado marcado como ESTIMATIVA).
   */
  function estimateCountedFromSchedule(subjectId, schedule, periodStart, refDate) {
    if (!periodStart || !refDate) return null;
    if (!(schedule || []).some((e) => e.subjectId === subjectId)) return null;
    const lessons = detectLessons({ startDate: periodStart, endDate: refDate, subjectIds: [subjectId] }, schedule, [{ id: subjectId }]);
    return lessons.length || null;
  }

  /* ------------------------------------------------------------------ */
  /* Cálculo completo de uma matéria                                     */
  /* ------------------------------------------------------------------ */

  /**
   * subject: { id, name, total, attendance }
   * covered: número de aulas desta matéria cobertas por atestados (sem duplicatas)
   * opts: { margin, threshold, estimatedCounted }
   */
  function computeSubject(subject, covered, opts) {
    const o = opts || {};
    const thr = o.threshold === undefined ? THRESHOLD : o.threshold;
    const margin = o.margin === undefined ? DEFAULT_ATTENTION_MARGIN : o.margin;
    const totalPeriod = toNum(subject && subject.total);
    const cov = Math.max(0, covered || 0);
    const d = deriveAttendance(subject && subject.attendance);
    const notes = d.notes.slice();
    const warnings = d.warnings.slice();

    const r = {
      id: subject && subject.id,
      name: subject && subject.name,
      totalPeriod,
      mode: d.mode,
      estimate: d.estimate,
      hasCounts: false,
      P: d.P,
      F: d.F,
      T: d.T,
      covered: cov,
      C: null,
      coveredExcess: 0,
      Fv: null,
      Tv: null,
      freqOrig: null,
      freqReal: null,
      status: 'unknown',
      remaining: null,
      allowedNow: null,
      allowedPeriod: null,
      presencesNeeded: null,
      notes,
      warnings,
    };

    let P = d.P;
    let F = d.F;
    let T = d.T;

    if (d.mode === 'percent') {
      r.freqOrig = d.pct;
      const estT = o.estimatedCounted;
      if (estT && estT > 0 && d.pct !== null) {
        P = Math.round((estT * d.pct) / 100);
        T = estT;
        F = T - P;
        r.P = P;
        r.F = F;
        r.T = T;
        notes.push(
          'Somente o percentual foi informado. Total de aulas estimado pela grade desde o início do período: ' + estT +
            '. Presenças ≈ ' + estT + ' × ' + fmtPct(d.pct) + ' ≈ ' + P + '; faltas ≈ ' + F + '.'
        );
      } else {
        r.freqReal = cov === 0 ? d.pct : null;
        r.status = statusFromPct(d.pct, margin, thr);
        if (cov > 0) {
          warnings.push('Há ' + cov + ' aula(s) cobertas por atestado, mas sem o número de faltas ou de aulas não é possível recalcular a frequência. Informe faltas ou total de aulas.');
        }
        return r;
      }
    }

    if (P === null || F === null || T === null) return r;

    r.hasCounts = true;
    const C = Math.min(cov, F);
    r.C = C;
    if (cov > F) {
      r.coveredExcess = cov - F;
      warnings.push(
        'Os atestados cobrem ' + cov + ' aula(s), mas só há ' + F + ' falta(s) registrada(s). Foram abonadas apenas ' + C +
          '. Confira se a frequência informada está atualizada.'
      );
    }
    const Fv = F - C;
    const Tv = P + Fv;
    r.Fv = Fv;
    r.Tv = Tv;
    r.freqOrig = d.mode === 'percent' ? d.pct : T > 0 ? (P / T) * 100 : null;
    r.freqReal = Tv > 0 ? (P / Tv) * 100 : null;
    if (d.mode === 'percent' && cov === 0) r.freqReal = d.pct;

    r.status = statusFromCounts(P, Tv, margin, thr);
    if (d.mode === 'percent' && cov === 0) r.status = statusFromPct(d.pct, margin, thr);
    r.allowedNow = allowedAbsencesNow(P, Tv, thr);
    r.presencesNeeded = presencesNeeded(P, Tv, thr);

    if (totalPeriod !== null && totalPeriod > 0) {
      const R = totalPeriod - T;
      if (R < 0) {
        warnings.push('O total de aulas contabilizadas (' + T + ') é maior que o total de aulas do período (' + totalPeriod + '). Confira o total da matéria.');
      } else {
        r.remaining = R;
        r.allowedPeriod = allowedAbsencesInPeriod(P, Tv, R, thr);
      }
    }
    return r;
  }

  /** Calcula todas as matérias e o resumo geral. */
  function computeAll(state, refDate) {
    const s = state || {};
    const settings = s.settings || {};
    const margin = toNum(settings.attentionMargin);
    const coverage = computeCoverage(s.certificates);
    const results = (s.subjects || []).map((sub) => {
      const est = estimateCountedFromSchedule(sub.id, s.schedule, settings.periodStart, refDate);
      return computeSubject(sub, coverage.bySubject[sub.id] || 0, {
        margin: margin === null ? DEFAULT_ATTENTION_MARGIN : margin,
        estimatedCounted: est,
      });
    });
    const summary = { safe: 0, warning: 0, danger: 0, unknown: 0, covered: 0, validAbsences: 0, estimate: false };
    results.forEach((r) => {
      summary[r.status]++;
      if (r.C !== null) summary.covered += r.C;
      if (r.Fv !== null) summary.validAbsences += r.Fv;
      if (r.estimate && r.mode !== 'empty') summary.estimate = true;
    });
    return { results, summary, coverage };
  }

  return {
    THRESHOLD,
    DEFAULT_ATTENTION_MARGIN,
    DEFAULT_SUBJECTS,
    WEEKDAYS,
    WEEKDAYS_SHORT,
    MAX_CERT_DAYS,
    toNum,
    fmtPct,
    validateAttendance,
    deriveAttendance,
    statusFromCounts,
    statusFromPct,
    allowedAbsencesNow,
    allowedAbsencesInPeriod,
    presencesNeeded,
    simulate,
    simulateEndOfPeriod,
    parseISO,
    toISO,
    weekdayOf,
    fmtDateBR,
    addDays,
    daysBetweenInclusive,
    timeToMinutes,
    lessonKey,
    detectLessons,
    countBySubject,
    computeCoverage,
    certificateOverlaps,
    estimateCountedFromSchedule,
    computeSubject,
    computeAll,
  };
});
