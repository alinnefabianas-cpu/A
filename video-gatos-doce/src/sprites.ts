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

// ---------- sprites do vídeo "gatos não sentem doce" ----------
export const ACUCAR = ['kkkkkkkk', 'kwwwwwwk', 'kwwswwwk', 'kwwwwswk', 'kwswwwwk', 'kwwwwwwk', 'kkkkkkkk'];
export const PALETA_ACUCAR: Paleta = {k: '#8fa0c8', w: '#ffffff', s: '#d6def0'};

export const BALA = ['r....rrrr....r', 'rr..rwrrrr..rr', 'rrrrrwrrrrrrrr', 'rrrrrrrrrrrrrr', 'rr..rrrrrr..rr', 'r....rrrr....r'];
export const PALETA_BALA: Paleta = {r: COR.rosa, w: '#ffffff'};

export const BIFE = ['...kkkkkk...', '..krrrrrrk..', '.krrwrrrrrk.', 'krrrwwrrrrrk', 'krrrrwrrrrrk', 'krrrrrrrrrk.', '.krrrrrrrk..', '..kkkkkkk...'];
export const PALETA_BIFE: Paleta = {k: '#5a1020', r: '#d9465f', w: '#ffe0e6'};

export const PEIXE = ['....kkkkk...k.', '..kkbbbbbk.kbk', '.kbbbbbbbbkbbk', 'kebbbbbbbbbbbk', '.kbbbbbbbbkbbk', '..kkbbbbbk.kbk', '....kkkkk...k.'];
export const PALETA_PEIXE: Paleta = {k: '#24357a', b: '#8fb8de', e: '#0a0f24'};

export const LATA = ['kbbbbbbbbbbk', 'kbwwwbbwwwbk', 'kbbbbbbbbbbk', 'kkkkkkkkkkkk', '.kssssssssk.'];
export const PALETA_LATA: Paleta = {k: '#24357a', b: COR.azul, w: '#ffffff', s: '#c9d3e6'};

export const SORVETE = [
	'.....kkkkkk.....',
	'...kkppppppkk...',
	'..kppwpppppppk..',
	'.kpppwppppppppk.',
	'.kppkkppppkkppk.',
	'kppprkppppkrpppk',
	'kppppppppppppppk',
	'kpppppkkkkpppppk',
	'kppppkwwwwkppppk',
	'.kkkkkkkkkkkkkk.',
	'..kyyyyyyyyyyk..',
	'..kyykyykyykyk..',
	'...kyyyyyyyyk...',
	'...kykyykyykk...',
	'....kyyyyyyk....',
	'.....kyyyyk.....',
	'......kyyk......',
	'.......kk.......',
];
export const PALETA_SORVETE: Paleta = {k: '#5a1030', p: COR.rosa, w: '#ffffff', r: COR.vermelho, y: '#e0a85a'};

export const BISCOITO = ['..kkkkkk..', '.kccccdck.', 'kcdcccccck', 'kcccccdcck', 'kccdccccck', 'kcccccccdk', '.kcdcccck.', '..kkkkkk..'];
export const PALETA_BISCOITO: Paleta = {k: '#5a3a10', c: '#d9a35a', d: '#4a2a0a'};

export const VENENO = ['..kkkk..', '..kggk..', '.kkggkk.', 'kggggggk', 'kgwggwgk', 'kggwwggk', 'kgwggwgk', 'kggggggk', '.kkkkkk.'];
export const PALETA_VENENO: Paleta = {k: '#0f3a1a', g: COR.verde, w: '#ffffff'};

export const BOLO = ['....r.r.r....', '....k.k.k....', '.kkkkkkkkkkk.', 'kpppppppppppk', 'kwwwwwwwwwwwk', 'kpppppppppppk', 'kccccccccccck', 'kkkkkkkkkkkkk'];
export const PALETA_BOLO: Paleta = {k: '#5a1030', p: COR.rosa, w: '#ffffff', c: '#d9a35a', r: COR.amarelo};

export const PALETA_TIGRE: Paleta = {k: '#3a1e05', c: '#ff9a3c', w: '#fff1d6', e: '#5dff8b', p: '#000000'};
export const PALETA_GUEPARDO: Paleta = {k: '#5a4210', c: '#ffd166', w: '#fff6dc', e: '#ffb000', p: '#000000'};
