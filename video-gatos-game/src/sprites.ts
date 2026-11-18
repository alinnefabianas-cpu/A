// Sprites em pixel art: cada letra é uma cor da paleta, "." é transparente.
import {COR} from './tema';

export type Paleta = Record<string, string>;

export const PALETA_GATO: Paleta = {k: '#24357a', c: '#cfe0ff', w: '#ffffff', e: COR.azul, p: COR.rosa};
export const PALETA_FANTASMA: Paleta = {k: '#2a3150', c: '#5d6684', w: '#7a83a1', e: '#2a3150', p: '#2a3150'};
export const PALETA_RAIOX: Paleta = {k: COR.ciano, c: '#0e2a5c', w: '#123570', e: COR.ciano, p: COR.ciano};
export const PALETA_TENSO: Paleta = {k: COR.vermelho, c: '#ffd0d8', w: '#ffffff', e: COR.vermelho, p: COR.rosa};

/** Gato de lado, olhando para a direita (20 x 13). */
export const GATO = [
	'...............k..k.',
	'..............kckkck',
	'..............kcccck',
	'k.............kcecek',
	'ck...........kccpcck',
	'.ck..kkkkkkkkkcccck.',
	'..ckkcccccccccccck..',
	'...kccccccccccccck..',
	'...kcwwwwwwwccccck..',
	'...kccccckkkkcccck..',
	'...kcck..kck..kcck..',
	'...kcck..kck..kcck..',
	'...kkk...kkk..kkk...',
];

/** Segundo quadro da caminhada (pernas trocadas). */
export const GATO_ANDA = [
	...GATO.slice(0, 10),
	'....kck.kcck.kck....',
	'...kck..kck...kck...',
	'...kk...kk.....kk...',
];

/** Gato morto (olhos em X) para o estudo. */
export const GATO_X = GATO.map((l, i) => (i === 3 ? 'k.............kckckk' : l));

/** Gato "esquilo voador": visto de cima, patas abertas (22 x 13). */
export const GATO_PARA = [
	'........k....k........',
	'........kkkkkk........',
	'.kk.....kcccck.....kk.',
	'.kck....kcecek....kck.',
	'..kck...kcpcck...kck..',
	'...kckkkcccccckkkck...',
	'....kccccccccccccck...',
	'.....kccwwwwwwcck.....',
	'....kcccwwwwwwccck....',
	'...kckkkcccccckkkck...',
	'..kck...kcccck...kck..',
	'.kk.......kk.......kk.',
	'..........ck..........',
];

export const HUMANO = [
	'...kkkk...',
	'..kssssk..',
	'..kksskk..',
	'..kssssk..',
	'...kkkk...',
	'..kbbbbk..',
	'.kbbbbbbk.',
	'kbkbbbbkbk',
	'kbkbbbbkbk',
	'kskbbbbksk',
	'...kbbk...',
	'...kllk...',
	'..kl..lk..',
	'..kl..lk..',
	'..kk..kk..',
];
export const PALETA_HUMANO: Paleta = {k: '#24357a', s: '#ffcf9e', b: COR.vermelho, l: '#3b4a8a'};

export const CORACAO = ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'];
export const PALETA_CORACAO: Paleta = {r: COR.vermelho};
export const PALETA_CORACAO_VAZIO: Paleta = {r: COR.cinzaEscuro};

export const MOEDA = ['.yyyy.', 'yywyyy', 'yywyyy', 'yywyyy', 'yyyyyy', '.yyyy.'];
export const PALETA_MOEDA: Paleta = {y: COR.amarelo, w: '#fff6c2'};

export const CHEFAO = [
	'.....kkkkkk.....',
	'...kkggggggkk...',
	'..kggggggggggk..',
	'.kggggggggggggk.',
	'.kggrrggggrrggk.',
	'kgggrrggggrrgggk',
	'kggggggggggggggk',
	'kgggggkkkkgggggk',
	'kggggkwkwkkggggk',
	'kgggggkkkkgggggk',
	'kggggggggggggggk',
	'kggggggggggggggk',
	'kggggggggggggggk',
	'kgkggkgggkggkggk',
	'kk.kk.kkk.kk.kkk',
];
export const PALETA_CHEFAO: Paleta = {k: '#1a0f2e', g: '#4b2a7a', r: COR.vermelho, w: '#ffffff'};

export const TROFEU = ['yyyyyyyy', 'yywyyyyy', '.ywyyyy.', '..yyyy..', '...yy...', '..yyyy..', '.kkkkkk.'];
export const PALETA_TROFEU: Paleta = {y: COR.amarelo, w: '#fff6c2', k: '#8a6a10'};
