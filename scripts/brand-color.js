/*
 * Extrai a cor predominante da logo oficial e atualiza as variáveis de marca
 * do quiz (bloco entre "brand:start" e "brand:end" em quiz/quiz.css).
 *
 * Uso: node scripts/brand-color.js [quiz/assets/logo.png] [--dry]
 *
 * Lê PNG de 8 bits (RGB/RGBA, sem entrelaçamento) sem dependências externas.
 * Ignora pixels transparentes e quase brancos (os círculos da logo) e escolhe
 * a cor mais frequente; as demais variáveis são derivadas dela com contraste
 * verificado (texto e botões ≥ 4,5:1 sobre branco).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.join(__dirname, '..');

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('O arquivo não é um PNG.');
  let pos = 8;
  let width, height, bitDepth, colorType, interlace;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const channels = { 2: 3, 6: 4 }[colorType];
  if (bitDepth !== 8 || !channels || interlace) {
    throw new Error('Use um PNG de 8 bits, RGB ou RGBA, sem entrelaçamento (exporte novamente a logo).');
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? px[y * stride + x - channels] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= channels && y > 0 ? px[(y - 1) * stride + x - channels] : 0;
      let v = line[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + x] = v & 255;
    }
  }
  return { width, height, channels, px };
}

function dominantColor({ width, height, channels, px }) {
  const buckets = new Map();
  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = px[o], g = px[o + 1], b = px[o + 2];
    const alpha = channels === 4 ? px[o + 3] : 255;
    if (alpha < 200) continue;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max > 235 && max - min < 25) continue; // branco/quase branco
    const key = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
    const e = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += r; e.g += g; e.b += b;
    buckets.set(key, e);
  }
  let best = null;
  for (const e of buckets.values()) if (!best || e.n > best.n) best = e;
  if (!best) throw new Error('Não encontrei uma cor predominante (a imagem é só branca ou transparente?).');
  return [best.r / best.n, best.g / best.n, best.b / best.n].map(Math.round);
}

/* ------------------------------ cores ------------------------------ */
const hex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}
function hslToRgb([h, s, l]) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => v * 255);
}
const lum = (rgb) => {
  const c = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

function deriveTokens(brand) {
  const [h, s] = rgbToHsl(brand);
  const white = [255, 255, 255];
  const hs = (sat, l, hue = h) => hslToRgb([(hue + 360) % 360, sat, l]);
  // Escurece até o texto/botão atingir 4,5:1 sobre branco.
  const legible = (rgb, sat, hue) => {
    let l = rgbToHsl(rgb)[2];
    while (contrast(rgb, white) < 4.6 && l > 5) rgb = hs(sat, (l -= 1), hue);
    return rgb;
  };
  const strong = legible(brand, Math.min(s, 85), h);
  // Azul de apoio dos gradientes: mesma família, puxado para o azul.
  const blueHue = Math.min(Math.max(h + 22, 200), 225);
  const blue = legible(hs(Math.min(s, 70), 42, blueHue), Math.min(s, 70), blueHue);
  return {
    '--brand': hex(brand),
    '--brand-strong': hex(strong),
    '--blue': hex(blue),
    '--deep': hex(hs(Math.min(s, 70), 17, h + 8)),
    '--ink-2': hex(hs(22, 38, h + 6)),
    '--line': hex(hs(40, 88)),
    '--tint': hex(hs(Math.min(s, 70), 94.5)),
    '--wash': hex(hs(Math.min(s, 60), 98)),
  };
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const file = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(root, 'quiz/assets/logo.png'));
  if (!fs.existsSync(file)) {
    console.error('Logo não encontrada em', file, '— veja quiz/assets/LEIA-ME.md');
    process.exit(1);
  }
  const brand = dominantColor(decodePng(fs.readFileSync(file)));
  const tokens = deriveTokens(brand);
  console.log('Cor predominante da logo:', hex(brand));
  Object.entries(tokens).forEach(([k, v]) => console.log(' ', k.padEnd(15), v));
  if (dry) return;
  const cssFile = path.join(root, 'quiz/quiz.css');
  const css = fs.readFileSync(cssFile, 'utf8');
  const block =
    '/* brand:start — gerado por scripts/brand-color.js a partir de ' + path.relative(root, file) + ' */\n' +
    Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n  /* brand:end */';
  const next = css.replace(/\/\* brand:start[\s\S]*?\/\* brand:end \*\//, block);
  if (next === css) throw new Error('Bloco brand:start/brand:end não encontrado em quiz/quiz.css');
  fs.writeFileSync(cssFile, next);
  console.log('Variáveis atualizadas em quiz/quiz.css');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error(e.message); process.exit(1); }
}
module.exports = { decodePng, dominantColor, deriveTokens, contrast };
