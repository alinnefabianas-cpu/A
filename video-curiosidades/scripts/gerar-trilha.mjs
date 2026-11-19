// Sintetiza do zero a trilha (pizzicato leve, estilo "storytime") e os efeitos.
// Sem samples externos: nada de direitos autorais. Uso: node scripts/gerar-trilha.mjs
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});
const TAU = Math.PI * 2;
let seed = 99;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;
const buf = (s) => new Float32Array(Math.ceil(s * SR));
const lp = (x, c) => {const y = new Float32Array(x.length); let p = 0; for (let i = 0; i < x.length; i++) {const cc = typeof c === 'function' ? c(i / SR) : c; p += (1 - Math.exp(-TAU * cc / SR)) * (x[i] - p); y[i] = p;} return y;};
const hp = (x, c) => {const l = lp(x, c); return x.map((v, i) => v - l[i]);};
const norm = (x, pk = 0.9) => {let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); return m ? x.map((v) => v * pk / m) : x;};
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
function wav(name, ch) {
	const L = ch[0], R = ch[1] ?? ch[0], n = L.length;
	const b = Buffer.alloc(44 + n * 4);
	b.write('RIFF', 0); b.writeUInt32LE(36 + n * 4, 4); b.write('WAVE', 8); b.write('fmt ', 12);
	b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(SR, 24);
	b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 4, 40);
	for (let i = 0; i < n; i++) {
		b.writeInt16LE(Math.max(-1, Math.min(1, L[i])) * 32767, 44 + i * 4);
		b.writeInt16LE(Math.max(-1, Math.min(1, R[i])) * 32767, 46 + i * 4);
	}
	writeFileSync(join(OUT, name), b);
	console.log(name, (n / SR).toFixed(1) + 's');
}
const add = (dst, src, at, g = 1) => {const o = Math.floor(at * SR); for (let i = 0; i < src.length && o + i < dst.length; i++) if (o + i >= 0) dst[o + i] += src[i] * g;};

// ---------- instrumentos ----------
function pluck(f, dur = 0.5, bright = 1) { // Karplus-Strong (pizzicato)
	const n = Math.ceil(dur * SR), out = new Float32Array(n), p = Math.max(2, Math.round(SR / f));
	const line = new Float32Array(p).map(() => noise());
	let idx = 0, prev = 0;
	for (let i = 0; i < n; i++) {
		const v = line[idx];
		const nv = (v + prev) * 0.5 * (0.993 + 0.004 * bright);
		prev = v; line[idx] = nv; out[i] = v; idx = (idx + 1) % p;
	}
	const env = (i) => Math.min(1, i / 60) * Math.exp(-i / SR * 5);
	return lp(out.map((v, i) => v * env(i)), 3500 * bright);
}
function mallet(f, dur = 0.6) {
	const x = buf(dur);
	for (let i = 0; i < x.length; i++) {const t = i / SR; x[i] = (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * f * 4 * t) * Math.exp(-t * 30)) * Math.exp(-t * 7) * Math.min(1, t * 400);}
	return x;
}
function bassNote(f, dur) {
	const x = buf(dur);
	for (let i = 0; i < x.length; i++) {const t = i / SR; x[i] = (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * Math.exp(-t * 3.5) * Math.min(1, t * 200);}
	return x;
}
function hat() {return hp(buf(0.06).map((_, i) => noise() * Math.exp(-i / SR * 70)), 7000);}
function kick() {const x = buf(0.3); let ph = 0; for (let i = 0; i < x.length; i++) {const t = i / SR; ph += TAU * (45 + 90 * Math.exp(-t * 30)) / SR; x[i] = Math.sin(ph) * Math.exp(-t * 12);} return x;}
function snap() {return lp(hp(buf(0.15).map((_, i) => noise() * Math.exp(-i / SR * 35)), 1500), 6000);}

// ---------- trilha: 100 bpm, Dó maior, progressão I-vi-IV-V ----------
const BPM = 104, beat = 60 / BPM, DUR = 62;
const L = buf(DUR + 2), R = buf(DUR + 2);
const prog = [[48, 52, 55, 60], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]];
const mel = [72, 76, 79, 76, 77, 76, 74, 72, 69, 72, 76, 72, 74, 71, 67, 71]; // motivo em colcheias
const bars = Math.ceil(DUR / (beat * 4));
for (let b = 0; b < bars; b++) {
	const t0 = b * beat * 4, ch = prog[b % 4];
	const intensidade = b < 2 ? 0.6 : 1;
	add(L, bassNote(mtof(ch[0] - 12), beat * 1.8), t0, 0.5); add(R, bassNote(mtof(ch[0] - 12), beat * 1.8), t0, 0.5);
	add(L, bassNote(mtof(ch[0] - 12 + 7), beat * 1.8), t0 + beat * 2, 0.4); add(R, bassNote(mtof(ch[0] - 12 + 7), beat * 1.8), t0 + beat * 2, 0.4);
	for (let s = 0; s < 8; s++) { // pizzicato arpejado
		const n = ch[(s * 3) % 4] + (s % 4 === 3 ? 12 : 0);
		const p = pluck(mtof(n), 0.45, 0.8);
		const pan = (s % 2) ? 0.7 : 0.4;
		add(L, p, t0 + s * beat / 2, 0.32 * (1 - pan) * 2 * intensidade); add(R, p, t0 + s * beat / 2, 0.32 * pan * 2 * intensidade);
	}
	if (b >= 2) for (let s = 0; s < 8; s++) {
		if ((b + s) % 3 === 2) continue; // respiros na melodia
		const n = mel[(b % 2) * 8 + s] + (prog[b % 4][0] === 41 ? -2 : 0);
		const m = mallet(mtof(n), 0.5);
		add(L, m, t0 + s * beat / 2, 0.11); add(R, m, t0 + s * beat / 2 + 0.012, 0.11);
	}
	for (let k = 0; k < 4; k++) {
		if (b >= 1) {add(L, kick(), t0 + k * beat, k % 2 ? 0.0 : 0.35); add(R, kick(), t0 + k * beat, k % 2 ? 0.0 : 0.35);}
		if (b >= 1 && k % 2) {add(L, snap(), t0 + k * beat, 0.18); add(R, snap(), t0 + k * beat, 0.18);}
		for (let h = 0; h < 2; h++) {add(L, hat(), t0 + k * beat + h * beat / 2, 0.05); add(R, hat(), t0 + k * beat + h * beat / 2 + 0.005, 0.07);}
	}
}
const fade = (x) => x.map((v, i) => v * Math.min(1, i / SR / 0.5) * Math.min(1, (DUR - i / SR) / 2.5));
wav('trilha.wav', [fade(norm(L, 0.8)), fade(norm(R, 0.8))]);

// ---------- efeitos ----------
{ // whoosh
	const d = 0.45, x = buf(d).map(() => noise());
	const y = lp(x, (t) => 400 + 5000 * Math.sin(Math.PI * t / d));
	wav('whoosh.wav', [norm(y.map((v, i) => v * Math.sin(Math.PI * i / y.length) ** 2), 0.7)]);
}
{ // pop
	const x = buf(0.12); let ph = 0;
	for (let i = 0; i < x.length; i++) {const t = i / SR; ph += TAU * (300 + 900 * Math.exp(-t * 40)) / SR; x[i] = Math.sin(ph) * Math.exp(-t * 35);}
	wav('pop.wav', [norm(x, 0.8)]);
}
{ // ding (sininho de avião)
	const x = buf(1.6);
	for (const [f, at, g] of [[880, 0, 1], [698.5, 0.45, 1]]) for (let i = 0; i < x.length; i++) {const t = i / SR - at; if (t < 0) continue; x[i] += g * (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2.01 * t)) * Math.exp(-t * 3);}
	wav('ding.wav', [norm(x, 0.6)]);
}
{ // buzzer "não"
	const x = buf(0.45);
	for (let i = 0; i < x.length; i++) {const t = i / SR; x[i] = Math.sign(Math.sin(TAU * 140 * t)) * 0.5 * Math.min(1, (0.45 - t) * 20);}
	wav('buzz.wav', [norm(lp(x, 1800), 0.5)]);
}
{ // ronco de barriga
	const d = 1.4, x = buf(d);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {const t = i / SR; const f = 70 + 40 * Math.sin(TAU * 3 * t) + 25 * Math.sin(TAU * 7.3 * t); ph += TAU * f / SR; x[i] = (Math.sin(ph) + 0.4 * noise()) * Math.sin(Math.PI * t / d) * (0.6 + 0.4 * Math.sin(TAU * 5 * t));}
	wav('barriga.wav', [norm(lp(x, 500), 0.9)]);
}
{ // alarme de cabine
	const x = buf(1.5);
	for (let i = 0; i < x.length; i++) {const t = i / SR; const on = (t % 0.5) < 0.3; x[i] = on ? (Math.sin(TAU * 960 * t) * 0.6 + Math.sin(TAU * 1440 * t) * 0.3) : 0;}
	wav('alarme.wav', [norm(x, 0.45)]);
}
{ // "uh-oh" descendente (vibrafone)
	const x = buf(1.2);
	for (const [f, at] of [[523, 0], [392, 0.22], [311, 0.44]]) add(x, mallet(f, 0.7), at, 1);
	wav('uhoh.wav', [norm(x, 0.6)]);
}
{ // ronco do avião
	const d = 6, x = lp(buf(d).map(() => noise()), 260);
	wav('aviao.wav', [norm(x.map((v, i) => v * Math.min(1, i / SR) * Math.min(1, (d - i / SR))), 0.7)]);
}
{ // boom grave para o final
	const x = buf(1.5); let ph = 0;
	for (let i = 0; i < x.length; i++) {const t = i / SR; ph += TAU * (38 + 60 * Math.exp(-t * 8)) / SR; x[i] = Math.sin(ph) * Math.exp(-t * 2.5) + noise() * 0.2 * Math.exp(-t * 10);}
	wav('boom.wav', [norm(lp(x, 900), 0.9)]);
}
