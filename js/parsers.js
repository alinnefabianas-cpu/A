/*
 * Analisadores de texto extraído por OCR (ou colado pelo usuário).
 *
 * Princípio: NUNCA inventar dados. Os analisadores só devolvem valores que
 * aparecem literalmente no texto; tudo o que for ambíguo vai para
 * "unassigned" para o usuário decidir. O app sempre pede confirmação.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Parsers = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /** Remove acentos e passa para minúsculas, preservando o comprimento da string. */
  function fold(s) {
    return String(s || '')
      .split('')
      .map((c) => {
        const n = c.normalize('NFD').replace(/[̀-ͯ]/g, '');
        return n.length === 1 ? n.toLowerCase() : c.toLowerCase().slice(0, 1) || ' ';
      })
      .join('');
  }

  // Apelidos comuns (chave = nome padrão "dobrado").
  const ALIASES = {
    'lingua portuguesa': ['portugues', 'port.', 'l. portuguesa', 'lingua port'],
    'producao de texto': ['redacao', 'prod. texto', 'prod texto', 'producao textual'],
    'lingua inglesa': ['ingles', 'l. inglesa'],
    'educacao fisica': ['ed. fisica', 'ed fisica', 'educ. fisica', 'educ fisica'],
    matematica: ['mat.'],
    'political science': ['pol. science', 'political sci'],
    itinerario: ['itinerario formativo'],
    orientacao: ['orientacao educacional'],
  };

  /** Monta a lista de padrões de busca para as matérias cadastradas. */
  function buildMatchers(subjects) {
    const list = [];
    (subjects || []).forEach((s) => {
      const name = String(s.name || '').trim();
      if (!name) return;
      const f = fold(name);
      // Siglas curtas em maiúsculas (ELA, GGG) só batem com a mesma grafia,
      // para não confundir com o pronome "ela".
      const caseSensitive = name.length <= 4 && name === name.toUpperCase();
      list.push({ id: s.id, name, pattern: caseSensitive ? name : f, caseSensitive });
      (ALIASES[f] || []).forEach((al) => list.push({ id: s.id, name, pattern: al, caseSensitive: false }));
    });
    return list;
  }

  function isWordChar(c) {
    return !!c && /[a-z0-9]/i.test(fold(c));
  }

  /** Todas as ocorrências de matérias numa linha, sem sobreposição, em ordem. */
  function findSubjects(line, matchers) {
    const folded = fold(line);
    const hits = [];
    matchers.forEach((m) => {
      const hay = m.caseSensitive ? line : folded;
      let from = 0;
      for (;;) {
        const i = hay.indexOf(m.pattern, from);
        if (i < 0) break;
        const end = i + m.pattern.length;
        const before = hay[i - 1];
        const after = hay[end];
        const lastIsDot = m.pattern.endsWith('.');
        if (!isWordChar(before) && (lastIsDot || !isWordChar(after))) {
          hits.push({ id: m.id, name: m.name, start: i, end });
        }
        from = i + 1;
      }
    });
    hits.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
    const out = [];
    let lastEnd = -1;
    hits.forEach((h) => {
      if (h.start >= lastEnd) {
        out.push(h);
        lastEnd = h.end;
      } else if (out.length && h.start === out[out.length - 1].start && h.end > out[out.length - 1].end) {
        out[out.length - 1] = h;
        lastEnd = h.end;
      }
    });
    return out;
  }

  /** Extrai números de um trecho, ignorando horários e datas. */
  function extractNumbers(text) {
    const cleaned = String(text || '')
      .replace(/\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/g, ' ')
      .replace(/\b\d{1,2}\s*[:hH]\s*\d{2}\b/g, ' ');
    const out = [];
    const re = /(\d{1,3}(?:[.,]\d{1,2})?)\s*(%?)/g;
    let m;
    while ((m = re.exec(cleaned))) {
      const prev = cleaned[m.index - 1];
      if (prev && /[A-Za-zÀ-ÿ]/.test(prev)) continue; // parte de palavra, ex. "1A"
      const value = Number(m[1].replace(',', '.'));
      if (!Number.isFinite(value)) continue;
      out.push({ value, pct: m[2] === '%', decimal: /[.,]/.test(m[1]), index: m.index, before: fold(cleaned.slice(Math.max(0, m.index - 16), m.index)) });
    }
    return out;
  }

  const HEADER_RULES = [
    { type: 'absencePct', re: /(%\s*(de\s*)?faltas?|faltas?\s*\(?%\)?|percentual de faltas?)/ },
    { type: 'presencePct', re: /(frequencia|freq\.?|%\s*(de\s*)?presenca|presenca\s*\(?%\)?|percentual)/ },
    { type: 'counted', re: /(aulas dadas|aulas ministradas|total de aulas|aulas|total|dadas|ministradas)/ },
    { type: 'presences', re: /(presencas?|pres\.)/ },
    { type: 'absences', re: /(faltas?)/ },
  ];

  /** Tenta reconhecer uma linha de cabeçalho de tabela e a ordem das colunas. */
  function parseHeader(line) {
    const f = fold(line);
    const cols = [];
    let rest = f;
    HEADER_RULES.forEach((rule) => {
      const m = rule.re.exec(rest);
      if (m) {
        cols.push({ type: rule.type, index: m.index });
        rest = rest.slice(0, m.index) + ' '.repeat(m[0].length) + rest.slice(m.index + m[0].length);
      }
    });
    if (cols.length < 2) return null;
    cols.sort((a, b) => a.index - b.index);
    return cols.map((c) => c.type);
  }

  /**
   * Frequência: devolve linhas { subjectId, subjectName, values, unassigned, raw }.
   */
  function parseAttendanceText(text, subjects) {
    const matchers = buildMatchers(subjects);
    const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let header = null;
    const blocks = [];
    lines.forEach((line) => {
      const subs = findSubjects(line, matchers);
      if (!subs.length) {
        const h = parseHeader(line);
        if (h && extractNumbers(line).length === 0) {
          header = h;
          return;
        }
        const last = blocks[blocks.length - 1];
        if (last && last.extra < 3) {
          last.text += ' \n' + line;
          last.extra++;
        }
        return;
      }
      const s = subs[0];
      blocks.push({ id: s.id, name: s.name, text: line.slice(s.end), raw: line, extra: 0, header });
    });

    const rows = [];
    const seen = {};
    blocks.forEach((b) => {
      const values = {};
      const nums = extractNumbers(b.text);
      const unassigned = [];
      const folded = fold(b.text);
      const kw = {
        absences: /faltas?\s*[:=\-]?\s*(\d{1,3})\b/.exec(folded),
        presences: /presencas?\s*[:=\-]?\s*(\d{1,3})\b/.exec(folded),
        counted: /(?:aulas(?: dadas)?|total)\s*[:=\-]?\s*(\d{1,3})\b/.exec(folded),
      };
      const hasKeywords = kw.absences || kw.presences || kw.counted || /(freq|presenca|falta)/.test(folded);

      if (b.header && !hasKeywords && nums.length === b.header.length) {
        nums.forEach((n, i) => {
          const type = b.header[i];
          if ((type === 'presencePct' || type === 'absencePct') && n.value <= 100) values[type] = n.value;
          else if ((type === 'presences' || type === 'absences' || type === 'counted') && !n.pct && !n.decimal) values[type] = n.value;
          else unassigned.push(n.value);
        });
      } else {
        const used = new Set();
        ['absences', 'presences', 'counted'].forEach((k) => {
          const m = kw[k];
          if (!m) return;
          const v = Number(m[1]);
          const n = nums.find((x) => !used.has(x) && !x.pct && x.value === v);
          if (n) used.add(n);
          values[k] = v;
        });
        nums.forEach((n) => {
          if (used.has(n)) return;
          if (n.pct && n.value <= 100) {
            if (/falta/.test(n.before)) {
              if (values.absencePct === undefined) values.absencePct = n.value;
              else unassigned.push(n.value);
            } else if (values.presencePct === undefined) values.presencePct = n.value;
            else unassigned.push(n.value);
          } else {
            unassigned.push(n.value);
          }
        });
      }
      if (!Object.keys(values).length && !unassigned.length) return;
      const row = { subjectId: b.id, subjectName: b.name, values, unassigned, raw: b.raw };
      if (seen[b.id] !== undefined) rows[seen[b.id]].duplicate = true;
      else seen[b.id] = rows.length;
      rows.push(row);
    });
    return rows;
  }

  const DAY_PATTERNS = [
    { day: 1, re: /\b(segunda(-feira)?|seg)\b/ },
    { day: 2, re: /\b(terca(-feira)?|ter)\b/ },
    { day: 3, re: /\b(quarta(-feira)?|qua)\b/ },
    { day: 4, re: /\b(quinta(-feira)?|qui)\b/ },
    { day: 5, re: /\b(sexta(-feira)?|sex)\b/ },
    { day: 6, re: /\b(sabado|sab)\b/ },
  ];

  function findDays(line) {
    const f = fold(line);
    const out = [];
    DAY_PATTERNS.forEach((d) => {
      const m = d.re.exec(f);
      if (m) out.push({ day: d.day, index: m.index });
    });
    return out.sort((a, b) => a.index - b.index);
  }

  function findTimes(line) {
    const out = [];
    const re = /\b([01]?\d|2[0-3])\s*[:hH]\s*([0-5]\d)\b/g;
    let m;
    while ((m = re.exec(line))) out.push(String(m[1]).padStart(2, '0') + ':' + m[2]);
    return out;
  }

  /**
   * Grade: devolve linhas { day|null, start, end, subjectId, subjectName, inferredDay, raw }.
   * Formatos suportados:
   *   - listas por dia ("Segunda" seguido de "08:00 Matemática")
   *   - linha com dia + horário + matéria
   *   - tabela com horários nas linhas e dias nas colunas (dia inferido pela
   *     ordem da coluna — marcado como "inferido" para conferência)
   */
  function parseScheduleText(text, subjects) {
    const matchers = buildMatchers(subjects);
    const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let currentDay = null;
    let columnDays = null;
    const rows = [];
    lines.forEach((line) => {
      const days = findDays(line);
      const subs = findSubjects(line, matchers);
      const times = findTimes(line);
      if (days.length >= 3 && !subs.length) {
        columnDays = days.map((d) => d.day);
        return;
      }
      if (days.length && !subs.length) {
        currentDay = days[0].day;
        return;
      }
      if (!subs.length) return;
      if (subs.length >= 2 && !days.length) {
        const order = columnDays || [1, 2, 3, 4, 5, 6];
        subs.forEach((s, i) => {
          rows.push({
            day: order[i] || null,
            start: times[0] || '',
            end: times[1] || '',
            subjectId: s.id,
            subjectName: s.name,
            inferredDay: true,
            raw: line,
          });
        });
        return;
      }
      const day = days.length ? days[0].day : currentDay;
      subs.forEach((s) => {
        rows.push({ day, start: times[0] || '', end: times[1] || '', subjectId: s.id, subjectName: s.name, inferredDay: false, raw: line });
      });
    });
    return rows;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  const NUMBER_WORDS = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, quinze: 15 };

  /**
   * Atestado: devolve { dates: [iso], days: n|null, suggestedStart, suggestedEnd }.
   * Não lê nem guarda informações médicas (CID, diagnóstico etc.).
   */
  function parseCertificateText(text) {
    const t = String(text || '');
    const dates = [];
    const re = /\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/g;
    let m;
    while ((m = re.exec(t))) {
      let y = +m[3];
      if (y < 100) y += 2000;
      const d = +m[1];
      const mo = +m[2];
      if (mo < 1 || mo > 12 || d < 1 || d > 31) continue;
      const iso = y + '-' + pad(mo) + '-' + pad(d);
      const check = new Date(Date.UTC(y, mo - 1, d));
      if (check.getUTCMonth() !== mo - 1) continue;
      if (!dates.includes(iso)) dates.push(iso);
    }
    const f = fold(t);
    let days = null;
    const dm = /(\d{1,3})\s*(?:\([a-z\s]+\)\s*)?dias?\b/.exec(f);
    if (dm) days = +dm[1];
    else {
      const wm = /\b(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|quinze)\s+dias?\b/.exec(f);
      if (wm) days = NUMBER_WORDS[wm[1]];
    }
    if (days !== null && (days < 1 || days > 365)) days = null;

    const sorted = dates.slice().sort();
    let suggestedStart = sorted[0] || '';
    let suggestedEnd = '';
    if (suggestedStart && days) {
      const s = Date.parse(suggestedStart + 'T00:00:00Z');
      const e = new Date(s + (days - 1) * 86400000);
      suggestedEnd = e.getUTCFullYear() + '-' + pad(e.getUTCMonth() + 1) + '-' + pad(e.getUTCDate());
    } else if (sorted.length >= 2) {
      suggestedEnd = sorted[sorted.length - 1];
    } else if (suggestedStart) {
      suggestedEnd = suggestedStart;
    }
    return { dates, days, suggestedStart, suggestedEnd };
  }

  return { fold, buildMatchers, findSubjects, extractNumbers, parseHeader, parseAttendanceText, parseScheduleText, parseCertificateText, findTimes, findDays };
});
