'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const zlib = require('zlib');
const { decodePng, dominantColor, deriveTokens, contrast } = require('../scripts/brand-color.js');

// PNG RGB 8 bits mínimo: fundo turquesa com uma faixa branca (os "círculos").
function makePng(w, h, pixel) {
  const raw = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = y % 2 ? 2 : 1; // alterna filtros Sub e Up
    for (let x = 0; x < w; x++) {
      const [r, g, b] = pixel(x, y);
      const o = y * (w * 3 + 1) + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  // aplica os filtros de verdade (o decodificador precisa revertê-los)
  const out = Buffer.from(raw);
  for (let y = h - 1; y >= 0; y--) {
    const f = raw[y * (w * 3 + 1)];
    for (let x = w * 3 - 1; x >= 0; x--) {
      const i = y * (w * 3 + 1) + 1 + x;
      const ref = f === 1 ? (x >= 3 ? raw[i - 3] : 0) : y > 0 ? raw[i - (w * 3 + 1)] : 0;
      out[i] = (raw[i] - ref) & 255;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    return Buffer.concat([len, Buffer.from(type), data, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(out)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

test('extrai a cor predominante ignorando o branco dos círculos', () => {
  const png = makePng(32, 32, (x) => (x % 8 < 3 ? [255, 255, 255] : [24, 170, 190]));
  const img = decodePng(png);
  assert.equal(img.width, 32);
  assert.deepEqual(dominantColor(img), [24, 170, 190]);
});

test('variáveis derivadas mantêm contraste legível sobre branco', () => {
  const white = [255, 255, 255];
  const h = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  for (const brand of [[24, 170, 190], [64, 224, 208], [0, 128, 128]]) {
    const t = deriveTokens(brand);
    for (const k of ['--brand-strong', '--deep', '--ink-2', '--blue']) {
      assert.ok(contrast(h(t[k]), white) >= 4.5, `${k} ${t[k]} para ${brand}`);
    }
  }
});

test('rejeita arquivos que não são PNG', () => {
  assert.throws(() => decodePng(Buffer.from('não é png, só texto')), /PNG/);
});
