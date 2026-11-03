// Trilha do Reels de divulgação: 120 BPM (1 batida = 15 frames a 30fps), Lá menor.
// Intro só com drone e pulso, "drop" com batida no início da montagem, e o beat
// some no CTA (fica o drone + acorde). Tudo sintetizado, sem samples.
// Uso: node scripts/gerar-trilha-reels.mjs
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});
const TAU = Math.PI * 2;
let seed = 98765;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Marcos (em segundos) — iguais aos de src/reels/Reels.tsx
const DUR = 28.5;
const BATIDA = 0.5;
const DROP = 8.5; // frame 255
const SERVICOS = 17.5; // frame 525
const CTA = 23; // frame 690

const n = Math.ceil(DUR * SR);
const x = new Float32Array(n);
const add = (t0, fn, len) => {
	const s = Math.floor(t0 * SR);
	for (let i = 0; i < len * SR && s + i < n; i++) x[s + i] += fn(i / SR);
};

// Acordes: Am – F – Dm – E (um por 4 batidas)
const ACORDES = [45, 41, 38, 40];
const raiz = (t) => ACORDES[Math.floor(t / (BATIDA * 4)) % 4];

// Drone (o tempo todo)
for (let i = 0; i < n; i++) {
	const t = i / SR;
	const r = midi(raiz(t) + 12);
	let v = 0;
	for (const m of [0, 7, 12, 15]) for (const d of [-0.003, 0.003]) v += Math.sin(TAU * r * Math.pow(2, m / 12) * (1 + d) * t);
	x[i] += v * 0.018;
}
// filtro passa-baixa simples no drone
{
	let p = 0;
	for (let i = 0; i < n; i++) {
		p += 0.06 * (x[i] - p);
		x[i] = p;
	}
}

const kick = (t) => Math.sin(TAU * (45 + 120 * Math.exp(-t * 30)) * t) * Math.exp(-t * 7) * 0.9;
const clap = (t) => noise() * (Math.exp(-t * 25) + 0.5 * Math.exp(-Math.abs(t - 0.012) * 300)) * 0.35;
const hat = (t) => (noise() - noise()) * Math.exp(-t * 90) * 0.12;
const sub = (f) => (t) => Math.tanh(Math.sin(TAU * f * t) * 1.6) * Math.min(1, t / 0.01) * Math.exp(-t * 1.2) * 0.32;
const pulso = (t) => Math.sin(TAU * 52 * t) * Math.exp(-t * 9) * 0.5;

// Intro: pulso grave tipo batimento a cada batida (antes do drop)
for (let t = 0; t < DROP - 0.01; t += BATIDA * 2) {
	if (t >= 5.5 && t < DROP) continue; // durante o "depois" o clipe tem som próprio
	add(t, pulso, 0.5);
	add(t + 0.22, (u) => pulso(u) * 0.6, 0.5);
}

// Beat: do drop até o CTA
for (let t = DROP; t < CTA - 0.01; t += BATIDA) {
	const b = Math.round((t - DROP) / BATIDA);
	const meio = t >= SERVICOS; // nos serviços: half-time (menos denso)
	if (!meio || b % 2 === 0) add(t, kick, 0.6);
	if (b % 4 === 3 && !meio) add(t + BATIDA / 2, kick, 0.4); // kick extra no contratempo
	if ((meio && b % 4 === 2) || (!meio && b % 2 === 1)) add(t, clap, 0.3);
	for (const k of meio ? [0] : [0, 0.5]) add(t + k * BATIDA, hat, 0.08);
	if (b % 4 === 0) add(t, sub(midi(raiz(t) - 12 + 24)), BATIDA * 4);
}

// Normaliza
let m = 0;
for (const v of x) m = Math.max(m, Math.abs(v));
for (let i = 0; i < n; i++) {
	const t = i / SR;
	const fade = Math.min(1, t / 0.5, (DUR - t) / 1.5);
	x[i] = Math.tanh((x[i] / m) * 1.1) * 0.85 * Math.max(0, fade);
}

const pcm = Buffer.alloc(n * 2);
for (let i = 0; i < n; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, x[i])) * 32767), i * 2);
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
writeFileSync(join(OUT, 'trilha-reels.wav'), Buffer.concat([h, pcm]));
console.log('✔ trilha-reels.wav', DUR + 's');
