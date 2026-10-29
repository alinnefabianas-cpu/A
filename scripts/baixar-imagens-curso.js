/*
 * Baixa as imagens do curso (geradas e hospedadas no Higgsfield) para
 * curso/img/, para o app não depender do endereço externo. Uso:
 *   node scripts/baixar-imagens-curso.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { COURSE, HERO } = require('../curso/js/conteudo.js');

const items = COURSE.map((m) => m).concat([HERO]).filter((o) => o.img && o.imgRemote);

(async () => {
  for (const o of items) {
    const dest = path.join(__dirname, '..', 'curso', o.img);
    const res = await fetch(o.imgRemote);
    if (!res.ok) throw new Error('Falha ao baixar ' + o.imgRemote + ': HTTP ' + res.status);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log('ok', path.relative(process.cwd(), dest));
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
