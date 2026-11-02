// Sintetiza do zero a trilha lo-fi e os efeitos do vídeo de gatos (sem samples, sem direitos autorais).
// Uso: node scripts/gerar-audio.mjs [duracaoTrilhaEmSegundos]
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});

// ---------- utilitários ----------
let seed = 1234567;
const rnd = () => {
	seed = (seed * 1664525 + 1013904223) >>> 0;
	return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const TAU = Math.PI * 2;

function lowpass(x, cutoff) {
	const y = new Float32Array(x.length);
	let prev = 0;
	for (let i = 0; i < x.length; i++) {
		const c = typeof cutoff === 'function' ? cutoff(i / SR) : cutoff;
		const a = 1 - Math.exp((-TAU * c) / SR);
		prev += a * (x[i] - prev);
		y[i] = prev;
	}
	return y;
}
function highpass(x, cutoff) {
	const lp = lowpass(x, cutoff);
	return x.map((v, i) => v - lp[i]);
}
const bandpass = (x, lo, hi) => lowpass(highpass(x, lo), hi);

// Reverb de Schroeder (4 combs + 2 allpass)
function reverb(x, mix = 0.35, size = 1, tailSec = 3) {
	const n = x.length + Math.floor(tailSec * SR);
	const inp = new Float32Array(n);
	inp.set(x);
	const out = new Float32Array(n);
	const combs = [1557, 1617, 1491, 1422].map((d) => Math.floor(d * size * (SR / 25000)));
	for (const d of combs) {
		const line = new Float32Array(d);
		let idx = 0;
		let filt = 0;
		for (let i = 0; i < n; i++) {
			const o = line[idx];
			filt = o * 0.8 + filt * 0.2;
			line[idx] = inp[i] + filt * 0.84;
			out[i] += o * 0.25;
			idx = (idx + 1) % d;
		}
	}
	let sig = out;
	for (const d0 of [225, 556]) {
		const d = Math.floor(d0 * (SR / 25000));
		const line = new Float32Array(d);
		let idx = 0;
		const y = new Float32Array(n);
		for (let i = 0; i < n; i++) {
			const b = line[idx];
			const v = sig[i] + b * 0.5;
			line[idx] = v;
			y[i] = b - v * 0.5;
			idx = (idx + 1) % d;
		}
		sig = y;
	}
	const res = new Float32Array(n);
	for (let i = 0; i < n; i++) res[i] = inp[i] * (1 - mix) + sig[i] * mix;
	return res;
}

function normalize(x, peak = 0.9) {
	let m = 0;
	for (const v of x) m = Math.max(m, Math.abs(v));
	if (m === 0) return x;
	const k = peak / m;
	return x.map((v) => v * k);
}

function fadeEdges(x, inSec = 0.005, outSec = 0.05) {
	const a = Math.floor(inSec * SR);
	const b = Math.floor(outSec * SR);
	for (let i = 0; i < a && i < x.length; i++) x[i] *= i / a;
	for (let i = 0; i < b && i < x.length; i++) x[x.length - 1 - i] *= i / b;
	return x;
}

function writeWav(name, data) {
	const pcm = Buffer.alloc(data.length * 2);
	for (let i = 0; i < data.length; i++) {
		const v = Math.max(-1, Math.min(1, data[i]));
		pcm.writeInt16LE(Math.round(v * 32767), i * 2);
	}
	const h = Buffer.alloc(44);
	h.write('RIFF', 0);
	h.writeUInt32LE(36 + pcm.length, 4);
	h.write('WAVE', 8);
	h.write('fmt ', 12);
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
	console.log('✔', name, (data.length / SR).toFixed(1) + 's');
}

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Nota de "piano" sombrio: harmônicos com decaimento
function piano(x, start, freq, vel = 0.5, dur = 5) {
	const s = Math.floor(start * SR);
	const n = Math.floor(dur * SR);
	for (let i = 0; i < n && s + i < x.length; i++) {
		const t = i / SR;
		let v = 0;
		for (let h = 1; h <= 6; h++) {
			v += (Math.sin(TAU * freq * h * t * (1 + 0.0004 * h)) / (h * h)) * Math.exp(-t * (0.8 + h * 0.6));
		}
		const atk = Math.min(1, t / 0.004);
		x[s + i] += v * vel * atk;
	}
}


// ---------- trilha lo-fi calma (sono de gato) ----------
// Fmaj7 → Em7 → Dm7 → Cmaj7, 76 bpm, piano elétrico + baixo + bumbo/chimbal suaves + chiado de vinil
function piano_eletrico(x, start, freq, vel, dur) {
	const s = Math.floor(start * SR);
	const n = Math.floor(dur * SR);
	for (let i = 0; i < n && s + i < x.length; i++) {
		const t = i / SR;
		const trem = 0.85 + 0.15 * Math.sin(TAU * 4.5 * t);
		const v = Math.sin(TAU * freq * t + 0.6 * Math.sin(TAU * freq * 2 * t) * Math.exp(-t * 3)) * Math.exp(-t * 0.9);
		x[s + i] += v * vel * trem * Math.min(1, t / 0.01);
	}
}
function trilha(sec) {
	const x = buf(sec);
	const bpm = 76;
	const beat = 60 / bpm;
	const compasso = beat * 4;
	const acordes = [
		[53, 57, 60, 64],
		[52, 55, 59, 62],
		[50, 53, 57, 60],
		[48, 52, 55, 59],
	];
	const baixos = [41, 40, 38, 36];
	for (let c = 0; c * compasso < sec; c++) {
		const t0 = c * compasso;
		const k = c % 4;
		acordes[k].forEach((m, j) => piano_eletrico(x, t0 + j * 0.03, midi(m), 0.09, compasso + 0.5));
		acordes[k].forEach((m, j) => piano_eletrico(x, t0 + beat * 2.5 + j * 0.02, midi(m + 12), 0.03, beat * 1.4));
		// melodia esparsa
		if (c % 2 === 1) piano_eletrico(x, t0 + beat * 1.5, midi(acordes[k][3] + 12), 0.05, beat * 2);
		// baixo
		for (const b of [0, 2.5]) {
			const s = Math.floor((t0 + b * beat) * SR);
			for (let i = 0; i < beat * 1.4 * SR && s + i < x.length; i++) {
				const t = i / SR;
				x[s + i] += Math.sin(TAU * midi(baixos[k]) * t) * 0.18 * Math.exp(-t * 1.5);
			}
		}
		// bumbo nos tempos 1 e 3, chimbal em colcheias
		for (let bt = 0; bt < 4; bt++) {
			if (bt % 2 === 0) {
				const s = Math.floor((t0 + bt * beat) * SR);
				for (let i = 0; i < 0.3 * SR && s + i < x.length; i++) {
					const t = i / SR;
					x[s + i] += Math.sin(TAU * (50 + 60 * Math.exp(-t * 30)) * t) * 0.22 * Math.exp(-t * 9);
				}
			}
			for (const h of [0, 0.5]) {
				const s = Math.floor((t0 + (bt + h) * beat) * SR);
				for (let i = 0; i < 0.05 * SR && s + i < x.length; i++) x[s + i] += noise() * 0.018 * Math.exp(-(i / SR) * 90) * (h ? 0.6 : 1);
			}
		}
	}
	let y = lowpass(x, 2600);
	for (let i = 0; i < y.length; i++) y[i] += noise() * 0.003 + (rnd() < 0.0004 ? noise() * 0.05 : 0); // vinil
	y = reverb(y, 0.25, 0.9, 2).subarray(0, x.length);
	return fadeEdges(normalize(y, 0.75), 1.5, 3);
}

// ---------- efeitos ----------
function pop() {
	const x = buf(0.25);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] = Math.sin(TAU * (380 + 900 * Math.exp(-t * 40)) * t) * Math.exp(-t * 22);
	}
	return fadeEdges(normalize(x, 0.7));
}
function whoosh() {
	const d = 0.7;
	const x = buf(d);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] = noise() * Math.pow(Math.sin((Math.PI * t) / d), 3);
	}
	const y = bandpass(x, 400, (t) => 800 + 3000 * Math.sin((Math.PI * t) / d));
	return fadeEdges(normalize(reverb(y, 0.2, 0.7, 0.6), 0.6));
}

const duracao = Number(process.argv[2] || 150);
writeWav('trilha.wav', trilha(duracao));
writeWav('pop.wav', pop());
writeWav('whoosh.wav', whoosh());
