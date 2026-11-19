import {Easing, interpolate, spring} from 'remotion';

// Paleta "videogame azul": a cor da marca continua sendo o azul.
export const COR = {
	ceu: '#070b1f',
	ceu2: '#101a3d',
	painel: '#0d1533',
	linha: '#22336b',
	azul: '#3da5ff',
	ciano: '#7cf3ff',
	branco: '#f2f7ff',
	cinza: '#6b7799',
	cinzaEscuro: '#39425e',
	amarelo: '#ffd23f',
	vermelho: '#ff4d6d',
	verde: '#5dff8b',
	rosa: '#ff9ec7',
	predio: '#1a2550',
	janela: '#2c3f80',
	janelaAcesa: '#ffd23f',
};

export const FONTE = {
	pixel: '"Pixelify Sans", monospace',
	texto: '"VT323", monospace',
};

/** Tamanho do "pixel" do jogo: tudo se move em degraus deste tamanho. */
export const PX = 6;
export const grade = (v: number, p = PX) => Math.round(v / p) * p;

const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (f: number, a: number, b: number, e = ease) =>
	interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const pop = (f: number, t: number, fps = 30, damping = 10) =>
	f < t ? 0 : spring({frame: f - t, fps, config: {damping, stiffness: 180, mass: 0.6}});
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Piscar estilo arcade (liga/desliga a cada n frames). */
export const pisca = (f: number, n = 8) => Math.floor(f / n) % 2 === 0;
