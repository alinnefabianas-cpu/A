// Valsa original de caixinha de música para os créditos (gera public/sons/valsa.wav)
import fs from 'node:fs';
const SR = 44100, BPM = 138, BEAT = 60 / BPM, BAR = BEAT * 3, DUR = 36;
const buf = new Float32Array(Math.ceil(SR * DUR));
const N = {B3:59,C4:60,D4:62,E4:64,F4:65,G4:67,A4:69,B4:71,C5:72,D5:74,E5:76,F5:77,G5:79,A5:81,B5:83,C6:84,D6:86,E6:88};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
function nota(t0, midi, vol, dec = 1.6) {
  const f = hz(midi), s0 = Math.floor(t0 * SR), len = Math.floor(SR * dec * 2.2);
  for (let i = 0; i < len && s0 + i < buf.length; i++) {
    const t = i / SR, env = Math.min(1, t / 0.004) * Math.exp(-t / (dec * 0.45));
    const v = Math.sin(2*Math.PI*f*t) + 0.35*Math.sin(2*Math.PI*f*2*t)*Math.exp(-t*3) + 0.12*Math.sin(2*Math.PI*f*4.02*t)*Math.exp(-t*6);
    buf[s0 + i] += v * env * vol;
  }
}
// [melodia (beat, nota, duração em beats)] por compasso + acorde
const frase = [
  {m:[['E5',1],['G5',1],['E5',1]], c:['C4','E4','G4']},
  {m:[['A5',1],['C6',1],['A5',1]], c:['A4','C5','E5'], b:'A4'},
  {m:[['F5',1],['A5',1],['C6',1]], c:['F4','A4','C5']},
  {m:[['B5',2],['G5',1]], c:['G4','B4','D5']},
  {m:[['E5',1],['G5',1],['C6',1]], c:['C4','E4','G4']},
  {m:[['C6',1],['B5',1],['A5',1]], c:['A4','C5','E5'], b:'A4'},
  {m:[['F5',1],['D5',1],['B4',1]], c:['G4','B4','D5']},
  {m:[['C5',3]], c:['C4','E4','G4']},
];
const frase2 = [
  {m:[['G5',1],['E6',1],['D6',1]], c:['C4','E4','G4']},
  {m:[['C6',1],['A5',1],['E5',1]], c:['A4','C5','E5'], b:'A4'},
  {m:[['F5',1],['A5',1],['D6',1]], c:['F4','A4','C5']},
  {m:[['B5',1],['D6',1],['G5',1]], c:['G4','B4','D5']},
  {m:[['E6',1],['D6',1],['C6',1]], c:['C4','E4','G4']},
  {m:[['A5',1],['C6',1],['E5',1]], c:['F4','A4','C5']},
  {m:[['D5',1],['G5',1],['B5',1]], c:['G4','B4','D5']},
  {m:[['C6',3]], c:['C4','E4','G4']},
];
const musica = [...frase, ...frase2, ...frase, ...frase2];
let t = 0.15;
for (const cmp of musica) {
  if (t > DUR - 4) break;
  let b = 0;
  for (const [n, d] of cmp.m) { nota(t + b * BEAT, N[n], 0.30, 1.4 + d * 0.3); b += d; }
  const raiz = N[cmp.b ?? cmp.c[0]] - 12;
  nota(t, raiz, 0.22, 1.2);
  for (const k of [1, 2]) for (const n of cmp.c.slice(1)) nota(t + k * BEAT, N[n] - 12, 0.07, 0.6);
  t += BAR;
}
// acorde final
for (const n of ['C4','E4','G4','C5','E5','C6']) nota(t + 0.05, N[n], 0.16, 3.2);
// eco suave
const d = Math.floor(SR * 0.23), out = new Float32Array(buf.length);
for (let i = 0; i < buf.length; i++) out[i] = buf[i] + (i >= d ? out[i - d] * 0.32 : 0);
let pico = 0; for (const v of out) pico = Math.max(pico, Math.abs(v));
const pcm = Buffer.alloc(44 + out.length * 2);
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36);
pcm.writeUInt32LE(out.length * 2, 40);
for (let i = 0; i < out.length; i++) pcm.writeInt16LE(Math.round((out[i] / pico) * 0.85 * 32767), 44 + i * 2);
fs.writeFileSync(new URL('../public/sons/valsa.wav', import.meta.url), pcm);
console.log('ok', (t).toFixed(1), 's de música');
