// Efeitos sonoros das transições (whoosh + "ding" de glockenspiel em cada corte), sintetizados.
// A música (public/audio/musica.mp3) foi gerada à parte (ElevenLabs Music no Higgsfield).
// Os cortes devem bater com CENAS em src/Vichy.tsx (frame/30).
// Uso: node scripts/gerar-efeitos.mjs
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});
const TAU = Math.PI * 2;
let seed = 13579;
const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

const DUR = 33;
const CORTES = [3.5, 9, 13, 17.5, 24.5, 29.5];

const n = Math.ceil(DUR * SR);
const x = new Float32Array(n);
const add = (t0, fn, len) => {
	const s = Math.floor(t0 * SR);
	for (let i = 0; i < len * SR && s + i < n; i++) if (s + i >= 0) x[s + i] += fn(i / SR);
};
const glock = (f, amp) => (t) =>
	(Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t * 6)) * Math.exp(-t * 3.2) * Math.min(1, t / 0.002) * amp;
const whoosh = (len) => {
	let p = 0;
	return (t) => {
		const u = t / len;
		p += (0.02 + 0.25 * u * u) * (noise() - p);
		return p * Math.sin(Math.PI * u) ** 2 * 1.6;
	};
};
for (const c of CORTES) {
	add(c - 0.35, whoosh(0.55), 0.55);
	add(c, glock(midi(84), 0.12), 1.2);
}
let mx = 0;
for (const v of x) mx = Math.max(mx, Math.abs(v));
const pcm = Buffer.alloc(n * 2);
for (let i = 0; i < n; i++) pcm.writeInt16LE(Math.round((x[i] / mx) * 0.8 * 32767), i * 2);
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
writeFileSync(join(OUT, 'efeitos.wav'), Buffer.concat([h, pcm]));
console.log('✔ efeitos.wav', DUR + 's');
