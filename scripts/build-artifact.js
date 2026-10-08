/*
 * Gera uma versão de página única do app (CSS e JS embutidos) para publicar
 * como Artifact no claude.ai. Uso: node scripts/build-artifact.js <pasta-saída>
 * A pasta de saída recebe index.html. Nessa versão o OCR fica desligado
 * (o dicionário não pode ser publicado junto); a importação usa texto colado.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = process.argv[2] || path.join(root, 'dist');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const script = (f) => '<script>\n' + read(f).replace(/<\/script/gi, '<\\/script') + '\n</script>';

// No claude.ai a página já recebe o recuo da área segura no topo.
const override = `
.app-header { top: env(safe-area-inset-top, 0px); padding-top: 0; }
body { background: var(--bg); color: var(--text); }
`;

const body = read('index.html')
  .split('<body>')[1]
  .split('<script')[0]
  .replace(/<noscript>[\s\S]*?<\/noscript>/, '')
  .trim();

const html = [
  '<title>Controle de Frequência Escolar</title>',
  '<style>\n' + read('css/styles.css') + override + '</style>',
  body,
  // O claude.ai não serve o dicionário do OCR; a importação usa texto colado.
  '<script>window.__CFE_NO_OCR = true;</script>',
  ...['js/calc.js', 'js/parsers.js', 'js/storage.js', 'js/ocr.js', 'js/accounts.js', 'js/app.js'].map(script),
].join('\n');

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('Gerado em', out, '(' + Math.round(html.length / 1024) + ' KB)');
