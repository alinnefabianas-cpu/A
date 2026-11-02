// Sintetiza do zero a trilha e os efeitos sonoros do vídeo (sem samples externos).
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

// ---------- trilha principal ----------
function trilha(sec) {
	const x = buf(sec);
	// Lá menor → Fá → Ré menor → Mi (cadência sombria)
	const acordes = [
		[45, 52, 57, 60],
		[41, 48, 53, 57],
		[38, 45, 50, 53],
		[40, 47, 52, 56],
	];
	const dur = 16;
	const xf = 4;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const k = Math.floor(t / dur);
		const local = t - k * dur;
		let v = 0;
		for (const [ci, w] of [
			[k, local < xf ? local / xf : 1],
			[k - 1, local < xf ? 1 - local / xf : 0],
		]) {
			if (w <= 0 || ci < 0) continue;
			const notas = acordes[ci % acordes.length];
			for (const m of notas) {
				const f = midi(m);
				for (const det of [-0.12, 0.12]) {
					const ff = f * Math.pow(2, det / 12 / 4);
					for (let h = 1; h <= 4; h++) v += (Math.sin(TAU * ff * h * t + h) / (h * 1.6)) * w;
				}
			}
		}
		const lfo = 0.75 + 0.25 * Math.sin(TAU * 0.07 * t);
		const sub = Math.sin(TAU * 55 * t) * 0.9 * (0.7 + 0.3 * Math.sin(TAU * 0.03 * t));
		x[i] = v * 0.05 * lfo + sub * 0.22;
	}
	let y = lowpass(x, (t) => 700 + 400 * Math.sin(TAU * 0.02 * t));
	// ar/ruído de fita
	for (let i = 0; i < y.length; i++) y[i] += noise() * 0.004;
	// notas esparsas de piano
	for (let t = 6; t < sec - 6; t += 5.33) {
		const k = Math.floor(t / dur);
		const notas = acordes[k % acordes.length];
		const m = notas[Math.floor(rnd() * notas.length)] + 24;
		piano(y, t, midi(m), 0.12 + rnd() * 0.06, 5);
	}
	y = reverb(y, 0.45, 1.2, 4).subarray(0, x.length);
	return fadeEdges(normalize(y, 0.8), 2, 3);
}

// ---------- efeitos ----------
function boom() {
	const x = buf(3);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const f = 38 + 70 * Math.exp(-t * 6);
		x[i] = Math.sin(TAU * f * t) * Math.exp(-t * 1.6) + noise() * 0.5 * Math.exp(-t * 18);
	}
	return fadeEdges(normalize(reverb(lowpass(x, 400), 0.3, 1.4, 2.5)));
}

function hit() {
	const b = boom();
	const n = buf(0.6);
	for (let i = 0; i < n.length; i++) n[i] = noise() * Math.exp(-(i / SR) * 12);
	const metal = highpass(n, 2500);
	const x = new Float32Array(b.length);
	x.set(b);
	for (let i = 0; i < metal.length; i++) x[i] += metal[i] * 0.5;
	return fadeEdges(normalize(reverb(x, 0.4, 1.6, 3)));
}

function riser() {
	const d = 3;
	const x = buf(d);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const f = 120 + 900 * Math.pow(t / d, 2);
		ph += (TAU * f) / SR;
		const env = Math.pow(t / d, 2.2);
		x[i] = (Math.sin(ph) * 0.5 + Math.sin(ph * 1.5) * 0.25 + noise() * 0.6) * env;
	}
	const y = lowpass(x, (t) => 300 + 6000 * Math.pow(t / d, 2));
	return fadeEdges(normalize(reverb(y, 0.3, 1, 1.5)), 0.01, 0.02);
}

function whoosh() {
	const d = 1.1;
	const x = buf(d);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] = noise() * Math.pow(Math.sin((Math.PI * t) / d), 3);
	}
	const y = bandpass(x, 300, (t) => 600 + 3500 * Math.sin((Math.PI * t) / d));
	return fadeEdges(normalize(reverb(y, 0.25, 0.8, 1)));
}

function coracao() {
	const d = 4.8;
	const x = buf(d);
	const batidas = [];
	for (let t = 0.05; t < d - 0.6; t += 0.8) batidas.push(t, t + 0.22);
	batidas.forEach((bt, j) => {
		const s = Math.floor(bt * SR);
		const amp = j % 2 === 0 ? 1 : 0.7;
		for (let i = 0; i < 0.3 * SR; i++) {
			const t = i / SR;
			x[s + i] += Math.sin(TAU * (48 + 30 * Math.exp(-t * 30)) * t) * Math.exp(-t * 14) * amp;
		}
	});
	return fadeEdges(normalize(lowpass(x, 180)));
}

function relogio() {
	const d = 4;
	const x = buf(d);
	for (let k = 0; k < 4; k++) {
		const s = Math.floor((k + 0.02) * SR);
		const f = k % 2 === 0 ? 2600 : 2000;
		for (let i = 0; i < 0.05 * SR; i++) {
			const t = i / SR;
			x[s + i] += (Math.sin(TAU * f * t) * 0.6 + noise() * 0.4) * Math.exp(-t * 120);
		}
	}
	return fadeEdges(normalize(reverb(x, 0.35, 0.7, 0.8)));
}

function caçaNiquel() {
	const d = 2.4;
	const x = buf(d);
	let t = 0;
	let gap = 0.04;
	while (t < 1.6) {
		const s = Math.floor(t * SR);
		for (let i = 0; i < 0.012 * SR; i++) x[s + i] += noise() * Math.exp(-(i / SR) * 300);
		t += gap;
		gap *= 1.07;
	}
	piano(x, 1.7, midi(88), 0.5, 0.7);
	piano(x, 1.7, midi(84), 0.4, 0.7);
	return fadeEdges(normalize(reverb(highpass(x, 800), 0.3, 0.8, 1)));
}

function glitch() {
	const d = 0.7;
	const x = buf(d);
	let i = 0;
	while (i < x.length) {
		const len = Math.floor((0.01 + rnd() * 0.05) * SR);
		const tipo = rnd();
		const f = 200 + rnd() * 3000;
		for (let j = 0; j < len && i < x.length; j++, i++) {
			const t = j / SR;
			if (tipo < 0.4) x[i] = noise();
			else if (tipo < 0.75) x[i] = Math.sign(Math.sin(TAU * f * t)) * 0.6;
			else x[i] = 0;
		}
	}
	// bitcrush
	for (let k = 0; k < x.length; k++) x[k] = Math.round(x[k] * 6) / 6;
	return fadeEdges(normalize(x, 0.6));
}

function sussurro() {
	const d = 3.5;
	const x = buf(d);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const silabas = 0.5 + 0.5 * Math.sin(TAU * 4.3 * t + Math.sin(TAU * 1.1 * t) * 2);
		x[i] = noise() * Math.sin((Math.PI * t) / d) * silabas;
	}
	const y = bandpass(x, 1200, 4500);
	return fadeEdges(normalize(reverb(y, 0.5, 1.3, 2), 0.7));
}

function acordeFinal() {
	const x = buf(8);
	[33, 45, 52, 57, 60, 64].forEach((m, k) => piano(x, k * 0.02, midi(m), 0.5, 7.5));
	for (let i = 0; i < x.length; i++) x[i] += Math.sin(TAU * 55 * (i / SR)) * 0.3 * Math.exp(-(i / SR) * 0.5);
	return fadeEdges(normalize(reverb(x, 0.45, 1.5, 4)));
}

function porta() {
	const d = 2.2;
	const x = buf(d);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		const f = 180 + 120 * Math.sin(TAU * 0.6 * t) + 40 * noise();
		ph += (TAU * f) / SR;
		const pulso = Math.pow(Math.abs(Math.sin(TAU * 22 * t)), 4);
		x[i] = (Math.sin(ph) + Math.sin(ph * 2.7) * 0.4) * pulso * Math.sin((Math.PI * t) / d);
	}
	return fadeEdges(normalize(reverb(bandpass(x, 150, 2500), 0.35, 1.1, 1.5), 0.7));
}

function passo() {
	const x = buf(0.6);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] = Math.sin(TAU * (90 + 60 * Math.exp(-t * 40)) * t) * Math.exp(-t * 25) + noise() * 0.3 * Math.exp(-t * 60);
	}
	return fadeEdges(normalize(reverb(lowpass(x, 900), 0.5, 1.4, 1.5)));
}

function tesoura() {
	const x = buf(0.8);
	for (const s0 of [0.05, 0.28]) {
		const s = Math.floor(s0 * SR);
		for (let i = 0; i < 0.08 * SR; i++) {
			const t = i / SR;
			x[s + i] += (noise() * 0.7 + Math.sin(TAU * 4200 * t) * 0.3) * Math.exp(-t * 60);
		}
	}
	return fadeEdges(normalize(reverb(highpass(x, 1500), 0.3, 0.6, 0.8)));
}

function tecla() {
	const x = buf(0.12);
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		x[i] = (noise() * 0.6 + Math.sin(TAU * 1800 * t) * 0.4) * Math.exp(-t * 90);
	}
	return fadeEdges(normalize(highpass(x, 900), 0.5));
}

const duracao = Number(process.argv[2] || 600);
writeWav('trilha.wav', trilha(duracao));
writeWav('boom.wav', boom());
writeWav('hit.wav', hit());
writeWav('riser.wav', riser());
writeWav('whoosh.wav', whoosh());
writeWav('coracao.wav', coracao());
writeWav('relogio.wav', relogio());
writeWav('caca-niquel.wav', caçaNiquel());
writeWav('glitch.wav', glitch());
writeWav('sussurro.wav', sussurro());
writeWav('acorde-final.wav', acordeFinal());
writeWav('porta.wav', porta());
writeWav('passo.wav', passo());
writeWav('tesoura.wav', tesoura());
writeWav('tecla.wav', tecla());
