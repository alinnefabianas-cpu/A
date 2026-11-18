// Sintetiza do zero a trilha chiptune e os efeitos 8-bit (sem samples, sem direitos autorais).
// Uso: node scripts/gerar-audio.mjs [duracaoTrilhaEmSegundos]
import {writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});
const TAU = Math.PI * 2;
let seed = 99;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0), seed / 4294967296);
const buf = (s) => new Float32Array(Math.ceil(s * SR));
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const quadrada = (ph, duty = 0.5) => ((ph / TAU) % 1 < duty ? 1 : -1);
const triangular = (ph) => {
	const x = (ph / TAU) % 1;
	return 4 * Math.abs(x - 0.5) - 1;
};

function nota(x, ini, dur, freq, vol, tipo = 'q', duty = 0.5) {
	const s = Math.floor(ini * SR);
	const n = Math.floor(dur * SR);
	let ph = 0;
	for (let i = 0; i < n && s + i < x.length; i++) {
		const t = i / SR;
		ph += (TAU * freq) / SR;
		const env = Math.min(1, t / 0.005) * Math.min(1, (dur - t) / 0.02) * (tipo === 't' ? 1 : Math.exp(-t * 2.5));
		const v = tipo === 't' ? triangular(ph) : quadrada(ph, duty);
		x[s + i] += v * vol * env;
	}
}
function ruido(x, ini, dur, vol, decai = 40) {
	const s = Math.floor(ini * SR);
	for (let i = 0; i < dur * SR && s + i < x.length; i++) x[s + i] += (rnd() * 2 - 1) * vol * Math.exp(-(i / SR) * decai);
}
function normalize(x, peak = 0.85) {
	let m = 0;
	for (const v of x) m = Math.max(m, Math.abs(v));
	return m ? x.map((v) => (v * peak) / m) : x;
}
function wav(nome, data) {
	const pcm = Buffer.alloc(data.length * 2);
	for (let i = 0; i < data.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i])) * 32767), i * 2);
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
	writeFileSync(join(OUT, nome), Buffer.concat([h, pcm]));
	console.log('✔', nome, (data.length / SR).toFixed(1) + 's');
}

// ---------- trilha: chiptune curioso em Ré menor, 112 bpm ----------
function trilha(sec) {
	const x = buf(sec);
	const beat = 60 / 112;
	const semi = beat / 2;
	const prog = [
		[50, 53, 57], // Dm
		[46, 50, 53], // Bb
		[48, 52, 55], // C
		[45, 49, 52], // A
	];
	const melodia = [74, 77, 76, 74, 72, 74, 69, null, 70, 72, 74, 77, 76, null, 73, null];
	for (let c = 0; c * beat * 4 < sec; c++) {
		const t0 = c * beat * 4;
		const ac = prog[c % 4];
		// arpejo (pulso 25%)
		for (let i = 0; i < 8; i++) nota(x, t0 + i * semi, semi * 0.9, midi(ac[i % 3] + 12), 0.05, 'q', 0.25);
		// baixo triangular
		for (let i = 0; i < 4; i++) nota(x, t0 + i * beat, beat * 0.8, midi(ac[0] - 12), 0.16, 't');
		// melodia a cada 2 compassos, entrando depois do 4º
		if (c >= 4 && c % 8 < 4) {
			const m = melodia[((c % 4) * 4) % 16];
			for (let i = 0; i < 4; i++) {
				const nn = melodia[(c % 4) * 4 + i];
				if (nn) nota(x, t0 + i * beat, beat * 0.85, midi(nn), 0.05, 'q', 0.5);
			}
			void m;
		}
		// bateria de ruído
		for (let i = 0; i < 8; i++) ruido(x, t0 + i * semi, 0.05, i % 4 === 2 ? 0.06 : 0.02, i % 4 === 2 ? 25 : 80);
	}
	return normalize(x, 0.7);
}

// ---------- efeitos ----------
const moeda = () => {
	const x = buf(0.35);
	nota(x, 0, 0.07, midi(83), 0.5, 'q');
	nota(x, 0.07, 0.25, midi(88), 0.5, 'q');
	return normalize(x, 0.6);
};
const blip = () => {
	const x = buf(0.1);
	nota(x, 0, 0.06, midi(84), 0.5, 'q', 0.25);
	return normalize(x, 0.5);
};
const fase = () => {
	const x = buf(1.2);
	[67, 71, 74, 79, 83].forEach((m, i) => nota(x, i * 0.09, 0.12, midi(m), 0.4, 'q', 0.5));
	nota(x, 0.5, 0.6, midi(86), 0.4, 'q', 0.5);
	return normalize(x, 0.7);
};
const powerup = () => {
	const x = buf(0.9);
	for (let i = 0; i < 12; i++) nota(x, i * 0.05, 0.06, midi(60 + i * 2 + (i % 2) * 5), 0.4, 'q', 0.25);
	return normalize(x, 0.6);
};
const pulo = () => {
	const x = buf(0.35);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		ph += (TAU * (300 + 900 * (t / 0.35))) / SR;
		x[i] = quadrada(ph) * 0.4 * (1 - t / 0.35);
	}
	return normalize(x, 0.6);
};
const queda = () => {
	const x = buf(1.6);
	let ph = 0;
	for (let i = 0; i < x.length; i++) {
		const t = i / SR;
		ph += (TAU * (1400 - 1000 * (t / 1.6))) / SR;
		x[i] = quadrada(ph, 0.5) * 0.3 * Math.min(1, (1.6 - t) / 0.1);
	}
	return normalize(x, 0.5);
};
const glitch = () => {
	const x = buf(0.6);
	for (let k = 0; k < 14; k++) nota(x, k * 0.04, 0.035, 100 + rnd() * 1800, 0.4, 'q', rnd());
	ruido(x, 0.2, 0.3, 0.3, 10);
	return normalize(x, 0.6);
};
const pancada = () => {
	const x = buf(0.5);
	ruido(x, 0, 0.4, 0.8, 14);
	nota(x, 0, 0.2, 70, 0.6, 't');
	return normalize(x, 0.7);
};
const alarme = () => {
	const x = buf(1.3);
	for (let k = 0; k < 4; k++) {
		nota(x, k * 0.32, 0.15, midi(81), 0.4, 'q');
		nota(x, k * 0.32 + 0.16, 0.15, midi(76), 0.4, 'q');
	}
	return normalize(x, 0.6);
};
const dano = () => {
	const x = buf(0.8);
	[64, 60, 57, 52].forEach((m, i) => nota(x, i * 0.12, 0.14, midi(m), 0.4, 'q', 0.5));
	ruido(x, 0, 0.2, 0.2, 20);
	return normalize(x, 0.6);
};

wav('trilha.wav', trilha(Number(process.argv[2] || 130)));
wav('moeda.wav', moeda());
wav('blip.wav', blip());
wav('fase.wav', fase());
wav('powerup.wav', powerup());
wav('pulo.wav', pulo());
wav('queda.wav', queda());
wav('glitch.wav', glitch());
wav('pancada.wav', pancada());
wav('alarme.wav', alarme());
wav('dano.wav', dano());
