import vozPt from './voz.json';
import vozEn from './voz-en.json';

export const FPS = 30;
const PAD = 0.14; // respiro entre falas (s)

export type Lingua = 'pt' | 'en';

// Uma fala por cena.
// PT: public/voz/NN.mp3 (voz "Leo", MiniMax). EN: public/voz-en/NN.mp3 (voz "Brooks", ElevenLabs).
export const FALAS: Record<Lingua, string[]> = {
	pt: [
		'Por que o piloto e o copiloto nunca podem comer a mesma comida?',
		'Imagine um voo noturno. Dez horas de viagem, e trezentas pessoas dormindo lá atrás.',
		'Na cabine, o comandante pede o frango. E o copiloto? Também quer o frango.',
		'Mas a comissária diz: não. Um de vocês vai de peixe.',
		'Parece frescura... até você entender o motivo.',
		'Se aquele frango estiver estragado, os dois passam mal ao mesmo tempo.',
		'E aí... quem pilota o avião?',
		'Por isso, muitas companhias aéreas exigem refeições diferentes, de cozinhas diferentes, e às vezes até em horários diferentes.',
		'Tem comandante que não divide nem um pacotinho de amendoim.',
		'Porque lá em cima, uma dor de barriga não é só uma dor de barriga. É um problema de trezentas pessoas.',
	],
	en: [
		"Why can't the pilot and the co-pilot ever eat the same meal?",
		'Picture a night flight. Ten hours in the air, and three hundred people asleep in the back.',
		'In the cockpit, the captain orders the chicken. And the co-pilot? Chicken too.',
		'But the flight attendant says: no. One of you is having fish.',
		'Sounds dramatic... until you realize why.',
		'If that chicken is bad, both of them get sick at the same time.',
		'And then... who flies the plane?',
		"That's why many airlines require different meals, from different kitchens, sometimes even at different times.",
		"Some captains won't even share a bag of peanuts.",
		"Because up there, a stomach ache isn't just a stomach ache. It's a problem for three hundred people.",
	],
};

// palavras que aparecem em amarelo na legenda (comparadas só pelas letras, em minúsculas)
export const DESTAQUES: Record<Lingua, Set<string>> = {
	pt: new Set(['piloto', 'copiloto', 'mesma', 'trezentas', 'frango', 'não', 'peixe', 'estragado', 'avião', 'diferentes', 'amendoim', 'barriga', 'motivo', 'noturno']),
	en: new Set(['pilot', 'copilot', 'same', 'hundred', 'chicken', 'no', 'fish', 'bad', 'plane', 'different', 'peanuts', 'stomach', 'why', 'night']),
};

// Momentos-chave de cada cena: a palavra (e qual ocorrência) em que a ação acontece.
export type Marca =
	| 'proibido' | 'relogio' | 'corte1' | 'contador'
	| 'cmd' | 'cop' | 'copFala'
	| 'nao' | 'peixe'
	| 'motivo' | 'corte5' | 'nega'
	| 'refeicoes' | 'cozinhas' | 'horarios'
	| 'barriga' | 'problema';

export const MARCAS: Record<Lingua, Partial<Record<Marca, [string, number?]>>> = {
	pt: {
		proibido: ['mesma'], relogio: ['dez'], corte1: ['e'], contador: ['dormindo'],
		cmd: ['o'], cop: ['e'], copFala: ['também'],
		nao: ['não'], peixe: ['um'],
		motivo: ['até'], corte5: ['os'], nega: ['divide'],
		refeicoes: ['refeições'], cozinhas: ['de'], horarios: ['em'],
		barriga: ['uma'], problema: ['é', 2],
	},
	en: {
		proibido: ['same'], relogio: ['ten'], corte1: ['and'], contador: ['asleep'],
		cmd: ['the', 2], cop: ['and'], copFala: ['chicken', 2],
		nao: ['no'], peixe: ['one'],
		motivo: ['until'], corte5: ['both'], nega: ['share'],
		refeicoes: ['different'], cozinhas: ['from'], horarios: ['at'],
		barriga: ['a'], problema: ['its'],
	},
};

// textos que aparecem desenhados nas cenas
export const TEXTOS: Record<Lingua, Record<string, string>> = {
	pt: {nao: 'NÃO!', eca: 'ECA!', meu: 'MEU!', cozinha1: 'COZINHA 1', cozinha2: 'COZINHA 2', horas: '10h'},
	en: {nao: 'NO!', eca: 'EW!', meu: 'MINE!', cozinha1: 'KITCHEN 1', cozinha2: 'KITCHEN 2', horas: '10 hrs'},
};

type Voz = {dur: number; regioes: number[][]};
const VOZES: Record<Lingua, Record<string, Voz>> = {pt: vozPt as never, en: vozEn as never};

export const pastaVoz = (l: Lingua) => (l === 'pt' ? 'voz' : `voz-${l}`);
export const soLetras = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

export type Palavra = {texto: string; inicio: number; fim: number}; // em frames, relativos à cena

export type Cena = {indice: number; texto: string; inicio: number; duracao: number; palavras: Palavra[]};

// distribui as palavras pelo tempo em que há voz (pula as pausas), proporcional ao tamanho
function tempoDasPalavras(texto: string, v: Voz): Palavra[] {
	const palavras = texto.split(/\s+/).filter(Boolean);
	const peso = palavras.map((p) => soLetras(p).length + 1.6);
	const total = peso.reduce((a, b) => a + b, 0);
	const falado = v.regioes.reduce((a, [s, e]) => a + (e - s), 0);
	const real = (x: number) => {
		let resto = x;
		for (const [s, e] of v.regioes) {
			if (resto <= e - s) return s + resto;
			resto -= e - s;
		}
		return v.regioes[v.regioes.length - 1][1];
	};
	let acc = 0;
	return palavras.map((p, i) => {
		const a = real((acc / total) * falado);
		acc += peso[i];
		const b = real((acc / total) * falado - 0.001);
		return {texto: p, inicio: Math.round(a * FPS), fim: Math.round(b * FPS)};
	});
}

// frame (relativo à cena) em que começa a n-ésima ocorrência da palavra
export function marcaEm(palavras: Palavra[], palavra: string, n = 1): number {
	let k = 0;
	for (const p of palavras) if (soLetras(p.texto) === palavra && ++k === n) return p.inicio;
	throw new Error(`Marca "${palavra}" (${n}ª) não encontrada em: ${palavras.map((p) => p.texto).join(' ')}`);
}

export const FIM_EXTRA = 18; // frames de respiro no final

export type VozJson = Record<string, Voz>;

// monta as cenas de qualquer episódio: uma fala por cena, duração = duração da fala
export function montarCenas(falas: string[], voz: VozJson): Cena[] {
	let t = 0;
	return falas.map((texto, i) => {
		const v = voz[String(i)];
		const duracao = Math.ceil((v.dur + PAD) * FPS);
		const c = {indice: i, texto, inicio: t, duracao, palavras: tempoDasPalavras(texto, v)};
		t += duracao;
		return c;
	});
}

export const cenas = (l: Lingua) => montarCenas(FALAS[l], VOZES[l]);
export const duracaoDe = (lista: Cena[]) => lista.reduce((a, c) => a + c.duracao, 0) + FIM_EXTRA;
export const duracaoTotal = (l: Lingua) => duracaoDe(cenas(l));
