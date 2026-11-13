import voz from './voz.json';

export const FPS = 30;
const PAD = 0.14; // respiro entre falas (s)

// Uma fala por cena. O áudio está em public/voz/NN.mp3 (voz "Leo", MiniMax, PT-BR).
export const FALAS = [
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
];

// palavras que aparecem em amarelo na legenda
export const DESTAQUES = new Set(['piloto', 'copiloto', 'mesma', 'trezentas', 'frango', 'não', 'peixe', 'estragado', 'avião', 'diferentes', 'amendoim', 'barriga', 'motivo', 'noturno']);

type Voz = {dur: number; regioes: number[][]};
const V = voz as unknown as Record<string, Voz>;

export type Palavra = {texto: string; inicio: number; fim: number}; // em frames, relativos à cena

export type Cena = {indice: number; texto: string; inicio: number; duracao: number; palavras: Palavra[]; regioes: number[][]};

// distribui as palavras pelo tempo em que há voz (pula as pausas), proporcional ao tamanho
function tempoDasPalavras(texto: string, v: Voz): Palavra[] {
	const palavras = texto.split(/\s+/).filter(Boolean);
	const peso = palavras.map((p) => p.replace(/[^\p{L}\p{N}]/gu, '').length + 1.6);
	const total = peso.reduce((a, b) => a + b, 0);
	const falado = v.regioes.reduce((a, [s, e]) => a + (e - s), 0);
	const real = (x: number) => {
		// x em segundos de "fala contínua" -> segundos reais do arquivo
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

export const CENAS: Cena[] = (() => {
	let t = 0;
	return FALAS.map((texto, i) => {
		const v = V[String(i)];
		const duracao = Math.ceil((v.dur + PAD) * FPS);
		const c = {indice: i, texto, inicio: t, duracao, palavras: tempoDasPalavras(texto, v), regioes: v.regioes};
		t += duracao;
		return c;
	});
})();

export const FIM_EXTRA = 18; // frames de respiro no final
export const DURACAO_TOTAL = CENAS.reduce((a, c) => a + c.duracao, 0) + FIM_EXTRA;
