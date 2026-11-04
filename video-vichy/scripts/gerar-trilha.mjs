// Trilha do Reels "Intercâmbio em Vichy 2027": 120 BPM (1 batida = 15 frames a 30fps), Dó maior,
// clima leve e alegre (pluck tipo violão/ukulele + glockenspiel + batida suave).
// Whoosh em cada corte de cena (sincronizado com a transição tricolor). Tudo sintetizado, sem samples.
// Uso: node scripts/gerar-trilha.mjs
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

// Marcos em segundos — iguais a CENAS em src/Vichy.tsx (frame/30)
const DUR = 28;
const B = 0.5;
const CORTES = [3, 7.5, 11, 15.5, 20, 24.5];
const BATIDA_INI = 3; // batida entra junto com a cena "Vichy"
const BATIDA_FIM = 24.5; // some nos logos

const n = Math.ceil(DUR * SR);
const L = new Float32Array(n);
const R = new Float32Array(n);
const add = (t0, fn, len, pan = 0) => {
	const s = Math.floor(t0 * SR);
	const gl = Math.cos(((pan + 1) * Math.PI) / 4), gr = Math.sin(((pan + 1) * Math.PI) / 4);
	for (let i = 0; i < len * SR && s + i < n; i++) {
		if (s + i < 0) continue;
		const v = fn(i / SR);
		L[s + i] += v * gl;
		R[s + i] += v * gr;
	}
};

// Acordes (um por compasso de 4 batidas): C – Am – F – G
const ACORDES = [
	[48, 52, 55, 60, 64],
	[45, 52, 57, 60, 64],
	[41, 48, 53, 57, 60],
	[43, 50, 55, 59, 62],
];
const acorde = (t) => ACORDES[Math.floor(t / (B * 4)) % 4];

// Pluck Karplus-Strong
const pluck = (f, dur, amp) => {
	const N = Math.round(SR / f);
	const buf = new Float32Array(N);
	for (let i = 0; i < N; i++) buf[i] = noise();
	const out = new Float32Array(Math.floor(dur * SR));
	let idx = 0;
	for (let i = 0; i < out.length; i++) {
		const a = buf[idx], b = buf[(idx + 1) % N];
		buf[idx] = 0.4985 * (a + b);
		out[i] = a * amp;
		idx = (idx + 1) % N;
	}
	return (t) => out[Math.floor(t * SR)] ?? 0;
};

// Arpejo de pluck em colcheias o tempo todo
const PADRAO = [0, 2, 1, 3, 2, 4, 3, 2];
for (let t = 0; t < DUR - 1.5; t += B / 2) {
	const k = Math.round(t / (B / 2)) % 8;
	const ac = acorde(t);
	const nota = ac[PADRAO[k]] + 12;
	add(t, pluck(midi(nota), 1.2, k % 2 ? 0.16 : 0.22), 1.2, k % 2 ? 0.35 : -0.35);
}
// Baixo pluck na cabeça do compasso
for (let t = 0; t < DUR - 1.5; t += B * 2) add(t, pluck(midi(acorde(t)[0] - 12), 1.8, 0.35), 1.8);

// Glockenspiel: melodia
const glock = (f, amp) => (t) =>
	(Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t * 6) + 0.15 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t * 12)) *
	Math.exp(-t * 3.2) * Math.min(1, t / 0.002) * amp;
// frase de 2 compassos (16 colcheias), null = pausa
const MELODIA = [76, null, 79, 76, 74, null, 72, null, 76, null, 79, 81, 79, null, null, null, 81, null, 77, 76, 74, null, 72, 74, 74, null, 71, 74, 79, null, null, null];
for (let t = BATIDA_INI; t < BATIDA_FIM - 0.01; t += B / 2) {
	const k = Math.round((t - BATIDA_INI) / (B / 2)) % MELODIA.length;
	const m = MELODIA[k];
	if (m) add(t, glock(midi(m), 0.13), 1.5, 0.2);
}

// Batida suave
const kick = (t) => Math.sin(TAU * (50 + 90 * Math.exp(-t * 35)) * t) * Math.exp(-t * 9) * 0.75;
const snap = (t) => (noise() * Math.exp(-t * 40) * 0.22 + Math.sin(TAU * 1800 * t) * Math.exp(-t * 60) * 0.05);
const shaker = (t) => (noise() - noise()) * Math.exp(-t * 70) * Math.min(1, t / 0.004) * 0.06;
for (let t = BATIDA_INI; t < BATIDA_FIM - 0.01; t += B) {
	const b = Math.round((t - BATIDA_INI) / B);
	if (b % 2 === 0) add(t, kick, 0.5);
	if (b % 4 === 3) add(t + B / 2, kick, 0.4);
	if (b % 2 === 1) add(t, snap, 0.25, 0.1);
	for (const k of [0, 0.25, 0.5, 0.75]) add(t + k * B, (u) => shaker(u) * (k === 0.5 ? 1.4 : 1), 0.06, 0.4);
}

// Whoosh antes de cada corte + "ding" no corte
const whoosh = (len) => {
	let p = 0;
	return (t) => {
		const u = t / len;
		const c = 0.02 + 0.25 * u * u;
		p += c * (noise() - p);
		return p * Math.sin(Math.PI * u) ** 2 * 1.6;
	};
};
for (const c of CORTES) {
	add(c - 0.35, whoosh(0.55), 0.55, -0.2);
	add(c, glock(midi(84), 0.09), 1.2, 0.3);
}
// Acorde final sustentado nos logos
for (const m of [60, 64, 67, 72, 76]) add(24.5, glock(midi(m), 0.06), 3.4, (m - 66) / 20);

// Normaliza + fades
let mx = 0;
for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(L[i]), Math.abs(R[i]));
const pcm = Buffer.alloc(n * 4);
for (let i = 0; i < n; i++) {
	const t = i / SR;
	const fade = Math.max(0, Math.min(1, t / 0.15, (DUR - t) / 2));
	const l = Math.tanh((L[i] / mx) * 1.2) * 0.85 * fade;
	const r = Math.tanh((R[i] / mx) * 1.2) * 0.85 * fade;
	pcm.writeInt16LE(Math.round(l * 32767), i * 4);
	pcm.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0);
h.writeUInt32LE(36 + pcm.length, 4);
h.write('WAVEfmt ', 8);
h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20);
h.writeUInt16LE(2, 22);
h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 4, 28);
h.writeUInt16LE(4, 32);
h.writeUInt16LE(16, 34);
h.write('data', 36);
h.writeUInt32LE(pcm.length, 40);
writeFileSync(join(OUT, 'trilha.wav'), Buffer.concat([h, pcm]));
console.log('✔ trilha.wav', DUR + 's');
