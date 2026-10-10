/*
 * Gera uma versão de página única do quiz Dopamine Rewire (CSS e JS embutidos)
 * para publicar como Artifact no claude.ai. Uso:
 *   node scripts/build-quiz-artifact.js <pasta-saída>
 * Nessa versão o resultado aparece na mesma página (sem resultado.html) e a
 * logo (quiz/assets/logo.png, se existir) vai embutida como data URI.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = process.argv[2] || path.join(root, 'dist', 'quiz');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const script = (f) => '<script>\n' + read(f).replace(/<\/script/gi, '<\\/script') + '\n</script>';

const LOGO = 'quiz/assets/logo.png';
const logoFile = path.join(root, LOGO);
const logoData = fs.existsSync(logoFile) ? 'data:image/png;base64,' + fs.readFileSync(logoFile).toString('base64') : null;
const withLogo = (txt) => (logoData ? txt.split(LOGO).join(logoData) : txt);
const fonts = (read('quiz-foco.html').match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/) || [''])[0];

const body = read('quiz-foco.html')
  .split(/<body[^>]*>/)[1]
  .split('<script')[0]
  .replace(/<noscript>[\s\S]*?<\/noscript>/, '')
  .replace('href="quiz-foco.html"', 'href="#quiz-root"')
  .trim();

const html = [
  '<title>Dopamine Rewire Quiz</title>',
  fonts,
  '<style>\n' + read('quiz/quiz.css') + '</style>',
  withLogo(body),
  // O body da publicação não recebe data-page; o quiz roda em modo página única.
  '<script>document.body.dataset.page = "quiz"; window.__DR_SINGLE_PAGE = true;</script>',
  ...['quiz/quiz-config.js', 'quiz/analytics.js', 'quiz/quiz-logic.js', 'quiz/quiz-app.js'].map(script),
].join('\n');
const page = withLogo(html);

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), page);
console.log('Gerado em', out, '(' + Math.round(page.length / 1024) + ' KB)', logoData ? 'com a logo' : 'sem logo (quiz/assets/logo.png não existe)');
