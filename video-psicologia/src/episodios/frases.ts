// Episódio 6: "10 frases que só um manipulador diz"
// (o vídeo prometido no final do episódio 5)
import {type Bloco, type Voz, montarLinha, duracaoTotal} from '../roteiro';
import type {ConfigEpisodio} from '../componentes';
import vozes from './frases-voz.json';

export const FRASES = [
	'Você está exagerando',
	'Eu só estava brincando',
	'Depois de tudo que eu fiz',
	'Ninguém vai te amar como eu',
	'Você está louca',
	'Se você me amasse…',
	'Olha o que você me fez fazer',
	'Seus amigos te envenenam',
	'Eu nunca disse isso',
	'Você vai se arrepender',
];

export const CONFIG_FRASES: ConfigEpisodio = {
	rotulo: 'FRASE',
	nomes: FRASES,
	titulo: {destaque: '10 FRASES', linha2: 'QUE SÓ UM MANIPULADOR DIZ', sub: 'e o que elas significam de verdade', visual: 'balao'},
};

export const FALA_TITULO = 'Dez frases… que só um manipulador diz.';

export const ROTEIRO_FRASES: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Manipuladores não precisam de armas.', visual: 'balao', estilo: 'grande', sons: ['coracao']},
	{tipo: 'texto', texto: 'Eles usam palavras. As mesmas palavras.', destaque: ['mesmas', 'palavras.'], visual: 'sussurros'},
	{tipo: 'texto', texto: 'Se você ouviu três dessas frases da mesma pessoa… preste atenção.', destaque: ['três'], visual: 'olho', sons: ['riser']},
	{tipo: 'texto', texto: 'Para cada uma, você vai ver o que ela significa de verdade… e como responder.', destaque: ['de', 'verdade…'], visual: 'balao', sons: ['boom']},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: FRASES[0], visual: 'sussurros'},
	{tipo: 'texto', texto: 'Tradução: o que você sente não importa.', destaque: ['não', 'importa.'], visual: 'balao', sons: ['boom']},
	{tipo: 'texto', texto: 'Responda: “Eu não pedi que você concordasse. Pedi que você ouvisse.”', destaque: ['ouvisse.'], visual: 'onda', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: FRASES[1], visual: 'mascara'},
	{tipo: 'texto', texto: 'Tradução: eu queria te ferir… sem ter que assumir.', destaque: ['ferir…'], visual: 'mascara', sons: ['boom']},
	{tipo: 'texto', texto: 'Responda: “Piada é quando os dois riem.”', destaque: ['os', 'dois', 'riem.'], visual: 'mascaras', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: FRASES[2], visual: 'recibo'},
	{tipo: 'texto', texto: 'Tradução: cada favor tinha um preço. E agora estou cobrando.', destaque: ['preço.', 'cobrando.'], visual: 'recibo', sons: ['caca-niquel']},
	{tipo: 'texto', texto: 'Responda: “Sou grato pelo que você fez. Mas isso não me obriga a nada.”', destaque: ['não', 'me', 'obriga'], visual: 'balanca', estilo: 'defesa'},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: FRASES[3], visual: 'gaiola'},
	{tipo: 'texto', texto: 'Tradução: tenho medo de que você descubra que merece mais.', destaque: ['merece', 'mais.'], visual: 'gaiola', sons: ['boom']},
	{tipo: 'texto', texto: 'Ninguém vai te amar assim. E é exatamente esse o ponto.', destaque: ['esse', 'o', 'ponto.'], visual: 'luz', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: FRASES[4], visual: 'espelho-quebrado'},
	{tipo: 'texto', texto: 'Tradução: se ninguém acreditar em você, eu nunca vou ser culpado.', destaque: ['nunca', 'vou', 'ser', 'culpado.'], visual: 'espelho-quebrado', sons: ['glitch']},
	{tipo: 'texto', texto: 'Responda: “Eu sei o que vi.” E anote. O papel não duvida de você.', destaque: ['Eu', 'sei', 'o', 'que', 'vi.'], visual: 'caderno', estilo: 'defesa'},

	// ───────── 6 ─────────
	{tipo: 'tatica', numero: 6, nome: FRASES[5], visual: 'coracao'},
	{tipo: 'texto', texto: 'Tradução: o seu amor só vale se você obedecer.', destaque: ['obedecer.'], visual: 'marionete', sons: ['boom']},
	{tipo: 'texto', texto: 'Responda: “Eu te amo. E a resposta continua sendo não.”', destaque: ['continua', 'sendo', 'não.'], visual: 'coracao', estilo: 'defesa'},

	// ───────── 7 ─────────
	{tipo: 'tatica', numero: 7, nome: FRASES[6], visual: 'marionete'},
	{tipo: 'texto', texto: 'Tradução: a culpa do que eu faço é sempre sua.', destaque: ['sempre', 'sua.'], visual: 'marionete', sons: ['hit']},
	{tipo: 'texto', texto: 'Ninguém faz um adulto perder o controle. Cada um responde pelas próprias mãos.', destaque: ['próprias', 'mãos.'], visual: 'espelho', estilo: 'defesa'},

	// ───────── 8 ─────────
	{tipo: 'tatica', numero: 8, nome: FRASES[7], visual: 'triangulo'},
	{tipo: 'texto', texto: 'Tradução: quanto mais sozinho você estiver, mais fácil é te controlar.', destaque: ['sozinho'], visual: 'mesa', sons: ['boom']},
	{tipo: 'texto', texto: 'Quem te ama quer você cercado de gente que também te ama.', destaque: ['cercado'], visual: 'rede', estilo: 'defesa'},

	// ───────── 9 ─────────
	{tipo: 'tatica', numero: 9, nome: FRASES[8], visual: 'lampiao'},
	{tipo: 'texto', texto: 'Tradução: vou reescrever o passado até você duvidar da própria memória.', destaque: ['reescrever', 'o', 'passado'], visual: 'lampiao', sons: ['glitch']},
	{tipo: 'texto', texto: 'Guarde mensagens. Anote datas. A memória pode ser questionada. A prova, não.', destaque: ['A', 'prova,', 'não.'], visual: 'caderno', estilo: 'defesa'},

	// ───────── 10 ─────────
	{tipo: 'tatica', numero: 10, nome: FRASES[9], visual: 'olho'},
	{tipo: 'texto', texto: 'Tradução: se você não ceder, eu vou te punir.', destaque: ['punir.'], visual: 'olho', sons: ['hit']},
	{tipo: 'texto', texto: 'Ameaça não é desabafo. Se você sentir medo, ligue cento e oitenta ou cento e noventa.', destaque: ['Ameaça'], visual: 'luz', estilo: 'defesa'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Recapitulando.', visual: 'vazio'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Uma frase dessas, uma vez, pode ser um dia ruim.', visual: 'vazio'},
	{tipo: 'texto', texto: 'Várias, sempre, da mesma pessoa… é um método.', destaque: ['método.'], visual: 'sussurros', estilo: 'grande', sons: ['hit']},
	{tipo: 'citacao', texto: 'Quem controla o passado controla o futuro. Quem controla o presente controla o passado.', autor: 'George Orwell'},
	{tipo: 'texto', texto: 'Agora você sabe o que essas palavras escondem.', visual: 'balao', sons: ['riser']},
	{
		tipo: 'final',
		texto: 'E nenhuma delas… vai funcionar de novo.',
		cta: {chamada: 'Próximo vídeo', linha1: 'QUANDO O MANIPULADOR', linha2: 'É DA SUA FAMÍLIA', botao: 'INSCREVA-SE'},
	},
];

export const LINHA_FRASES = montarLinha(ROTEIRO_FRASES, 1, vozes as Record<string, Voz>);
export const DURACAO_FRASES = duracaoTotal(LINHA_FRASES);
