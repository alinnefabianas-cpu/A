// Trilha e efeitos do Reels de apresentação (Gabi Lima): clima leve e moderno,
// 120 BPM (1 batida = 15 frames), Dó maior. Gera trilha-gabi.wav, pop.wav e swoosh.wav.
// Uso: node scripts/gerar-trilha-gabi.mjs
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});
const TAU = Math.PI * 2;
let seed = 13579;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

function wav(name, x) {
	let m = 0;
	for (const v of x) m = Math.max(m, Math.abs(v));
	const pcm = Buffer.alloc(x.length * 2);
	for (let i = 0; i < x.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, (x[i] / (m || 1)) * 0.89)) * 32767), i * 2);
	const h = Buffer.alloc(44);
	h.write('RIFF', 0);
	h.writeUInt32LE(36 + pcm.length, 4);
	h.write('WAVEfmt ', 8);
	h.writeUInt32LE(16, 16);
	h.writeUInt16LE(1, 20);
	h.writeUInt16LE(1, 22);
	h.writeUInt32LE(SR, 24);
	h.writeUInt32LE(SR * 2, 28);
	h.writeUInt16LE(2, 32);
	h.writeUInt16LE(16, 34);
	h.write('data', 36);
	h.writeUInt32LE(pcm.length, 40);
	writeFileSync(join(OUT, name), Buffer.concat([h, pcm]));
	console.log('✔', name, (x.length / SR).toFixed(1) + 's');
}

// Marcos (segundos) — iguais aos de src/reels/Apresentacao.tsx
const DUR = 30;
const BAT = 0.5;
const BEAT_ON = 3; // frame 90: entra a batida
const BREAK = 22; // frame 660: só arpejo
const VOLTA = 24; // frame 720: CTA, batida volta
const FIM = 28.5;

const n = Math.ceil(DUR * SR);
const x = new Float32Array(n);
const add = (t0, fn, len) => {
	const s = Math.floor(t0 * SR);
	for (let i = 0; i < len * SR && s + i < n; i++) x[s + i] += fn(i / SR);
};

// C – G – Am – F (um acorde por 4 batidas)
const ACORDES = [
	[60, 64, 67, 72],
	[55, 59, 62, 67],
	[57, 60, 64, 69],
	[53, 57, 60, 65],
];
const acorde = (t) => ACORDES[Math.floor(t / (BAT * 4)) % 4];

// Pad suave
for (let i = 0; i < n; i++) {
	const t = i / SR;
	let v = 0;
	for (const m of acorde(t).slice(0, 3)) for (const d of [-0.004, 0.004]) v += Math.sin(TAU * midi(m - 12) * (1 + d) * t) + 0.3 * Math.sin(TAU * midi(m) * (1 + d) * t);
	x[i] += v * 0.012;
}
{
	let p = 0;
	for (let i = 0; i < n; i++) {
		p += 0.08 * (x[i] - p);
		x[i] = p;
	}
}

const pluck = (f, vel) => (t) => {
	let v = 0;
	for (let h = 1; h <= 4; h++) v += Math.sin(TAU * f * h * t) * Math.exp(-t * (6 + h * 4)) / h;
	return v * vel * Math.min(1, t / 0.002);
};
const kick = (t) => Math.sin(TAU * (50 + 110 * Math.exp(-t * 35)) * t) * Math.exp(-t * 8) * 0.8;
const clap = (t) => noise() * (Math.exp(-t * 30) + 0.6 * Math.exp(-Math.abs(t - 0.01) * 400)) * 0.28;
const hat = (t) => (noise() - noise()) * Math.exp(-t * 110) * 0.09;
const baixo = (f) => (t) => Math.sin(TAU * f * t) * Math.min(1, t / 0.01) * Math.exp(-t * 2.2) * 0.35;

// Arpejo em semicolcheias-ish (colcheias), o tempo todo
for (let t = 0; t < FIM; t += BAT / 2) {
	const c = acorde(t);
	const k = Math.round(t / (BAT / 2));
	const nota = c[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12;
	const vel = t < BEAT_ON ? 0.12 : 0.16;
	add(t, pluck(midi(nota), vel), 0.6);
}
// Batida
for (let t = BEAT_ON; t < FIM - 0.01; t += BAT) {
	if (t >= BREAK && t < VOLTA) continue;
	const b = Math.round((t - BEAT_ON) / BAT);
	add(t, kick, 0.5);
	if (b % 2 === 1) add(t, clap, 0.3);
	add(t + BAT / 2, hat, 0.06);
	if (b % 4 === 0) add(t, baixo(midi(acorde(t)[0] - 24)), BAT * 4);
}
// Fade
for (let i = 0; i < n; i++) {
	const t = i / SR;
	x[i] = Math.tanh(x[i] * 1.4) * Math.max(0, Math.min(1, t / 0.3, (DUR - t) / 2));
}
wav('trilha-gabi.wav', x);

// Pop: bolha curta e brilhante (entrada de elementos)
{
	const p = new Float32Array(Math.ceil(0.18 * SR));
	for (let i = 0; i < p.length; i++) {
		const t = i / SR;
		p[i] = Math.sin(TAU * (500 + 900 * (1 - Math.exp(-t * 60))) * t) * Math.exp(-t * 28);
	}
	wav('pop.wav', p);
}
// Swoosh: ruído filtrado com varredura (transições)
{
	const s = new Float32Array(Math.ceil(0.6 * SR));
	let lp = 0;
	for (let i = 0; i < s.length; i++) {
		const t = i / SR;
		const env = Math.sin(Math.PI * Math.min(1, t / 0.6)) ** 2;
		const a = 0.02 + 0.25 * env;
		lp += a * (noise() - lp);
		s[i] = lp * env;
	}
	wav('swoosh.wav', s);
}
