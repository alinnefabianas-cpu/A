import {Easing, interpolate, spring} from 'remotion';

// Identidade "caderno rabiscado": papel creme, caneta azul, marca-texto amarelo.
export const COR = {
	papel: '#f7f2e4',
	pauta: '#c9d7ee',
	margem: '#f0a3a3',
	tinta: '#1d3f9e', // caneta azul (cor do canal)
	azul: '#3da5ff',
	azulClaro: '#bfe0ff',
	vermelho: '#d62f3a',
	verde: '#2e9e5b',
	marca: '#ffe45c', // marca-texto
	rosa: '#ff9ec7',
	postit: '#fff07a',
	grafite: '#4a4a4a',
	cinza: '#9a9a9a',
};

export const FONTE = {
	mao: '"Caveat", cursive',
	legenda: '"Patrick Hand", cursive',
};

const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (f: number, a: number, b: number, e = ease) =>
	interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const pop = (f: number, t: number, fps = 30, damping = 12) =>
	f < t ? 0 : spring({frame: f - t, fps, config: {damping, stiffness: 170, mass: 0.6}});
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const pisca = (f: number, n = 8) => Math.floor(f / n) % 2 === 0;
/** Muda a cada 4 frames: dá o "tremido" de animação feita à mão. */
export const passo = (f: number) => Math.floor(f / 4);
