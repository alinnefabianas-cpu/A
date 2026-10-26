/*
 * Exporta as peças do anúncio (anuncios/criativos.html) em PNG e o vídeo em MP4.
 * Precisa de um servidor local na raiz do repositório e do ffmpeg. Uso:
 *   npm start   (em outro terminal; serve na porta 5173)
 *   node scripts/exportar-anuncios.js [http://localhost:5173]
 */
'use strict';
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const base = (process.argv[2] || 'http://localhost:5173') + '/anuncios/criativos.html?p=';
const out = path.join(__dirname, '..', 'anuncios', 'exportados');
const SIZES = { feed: [1080, 1350], quadrado: [1080, 1080], stories: [1080, 1920] };

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [name, [w, h]] of Object.entries(SIZES)) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(base + name, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, 'anuncio-' + name + '.png') });
    await p.close();
    console.log('ok', 'anuncio-' + name + '.png');
  }

  // Vídeo: grava a animação de 15 s e converte para MP4 (H.264, 30 fps).
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dcp-video-'));
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, recordVideo: { dir: tmp, size: { width: 1080, height: 1920 } } });
  const p = await ctx.newPage();
  await p.goto(base + 'video', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.play());
  await p.waitForTimeout(15500);
  const video = await p.video().path();
  await ctx.close();
  // A gravação começa ao abrir a página; mantém só os últimos 15,5 s (a animação).
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString().trim());
  const start = Math.max(0, dur - 15.5);
  const mp4 = path.join(out, 'anuncio-video-15s.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', start.toFixed(2), '-i', video, '-t', '15',
    '-vf', 'fps=30,scale=1080:1920', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart', '-an', mp4]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('ok', 'anuncio-video-15s.mp4');
  await b.close();
})();
