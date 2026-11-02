import {Easing, interpolate, spring} from 'remotion';

// Identidade do canal: fundo azul-noite, destaque azul neon. Nada de roxo.
export const COR = {
	fundo: '#050a18',
	fundo2: '#0a1530',
	linha: '#14244a',
	azul: '#3da5ff',
	azulClaro: '#8fd3ff',
	azulEscuro: '#1b4f99',
	branco: '#eaf4ff',
	cinza: '#7d8fb3',
	alerta: '#ff6b6b',
};

export const FONTE = {
	titulo: '"Baloo 2", sans-serif',
	ui: '"Inter", sans-serif',
};

export const BRILHO = `drop-shadow(0 0 14px ${COR.azul}) drop-shadow(0 0 4px ${COR.azul})`;

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 entre os frames a e b. */
export const prog = (f: number, a: number, b: number, e = ease) =>
	interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Entrada com "pulo" (mola) a partir do frame t. */
export const pop = (f: number, t: number, fps = 30, damping = 11) =>
	f < t ? 0 : spring({frame: f - t, fps, config: {damping, stiffness: 160, mass: 0.7}});

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
