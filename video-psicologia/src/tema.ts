import {Easing, interpolate} from 'remotion';

export const COR = {
	preto: '#050505',
	fundo: '#0a0909',
	creme: '#e9e2d4',
	cinza: '#8a847a',
	escuro: '#2a2623',
	vermelho: '#d01f2a',
	vermelhoEscuro: '#5c0b10',
	ouro: '#c9a227',
};

export const FONTE = {
	titulo: '"Cinzel", serif',
	texto: '"Playfair Display", serif',
	ui: '"Inter", sans-serif',
};

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 entre os frames a e b, com easing suave. */
export const prog = (f: number, a: number, b: number, e = ease) =>
	interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Entrada e saída com fade (0→1→0). */
export const fadeIO = (f: number, dur: number, entra = 10, sai = 10) =>
	Math.min(prog(f, 0, entra), 1 - prog(f, dur - sai, dur));
