import duracoes from './duracoes.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "Por que um gato cai do 20º andar e sobrevive?" (versão videogame).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string};

export const ROTEIRO: Trecho[] = [
	{cena: 'gancho', texto: 'Um gato que cai do vigésimo andar pode se machucar menos do que um que cai do sétimo. Parece bug no jogo, mas a ciência tem uma explicação.', destaque: ['vigésimo', 'sétimo', 'bug']},
	{cena: 'estudo', texto: 'Em mil novecentos e oitenta e sete, veterinários de Nova York analisaram cento e trinta e dois gatos que caíram de prédios. Noventa por cento sobreviveram.', destaque: ['veterinários', 'cento', 'trinta', 'dois', 'noventa', 'sobreviveram']},
	{cena: 'grafico', texto: 'E o mais estranho: os ferimentos pioravam até o sétimo andar. Depois disso, começavam a diminuir. Pra entender esse bug, vamos passar de fase.', destaque: ['pioravam', 'sétimo', 'diminuir', 'fase']},
	{cena: 'giro', texto: 'Fase um: o giro. No meio da queda, o gato dobra o corpo ao meio, gira a parte da frente, depois a de trás, e pronto: patas pra baixo.', destaque: ['giro', 'dobra', 'frente', 'trás', 'patas']},
	{cena: 'coluna', texto: 'Ele consegue isso porque tem uma coluna super flexível e uma clavícula solta, que não fica presa nos outros ossos. É como se o corpo dele viesse com um botão de girar.', destaque: ['coluna', 'flexível', 'clavícula', 'solta', 'botão']},
	{cena: 'velocidade', texto: 'Fase dois: a velocidade máxima. Por ser leve e peludo, um gato para de acelerar em uns cem quilômetros por hora. Uma pessoa chega a quase o dobro.', destaque: ['velocidade', 'máxima', 'leve', 'peludo', 'cem', 'dobro']},
	{cena: 'andares', texto: 'E ele chega nessa velocidade depois de uns cinco andares de queda. Daqui pra frente, a queda não fica mais rápida.', destaque: ['cinco', 'andares', 'rápida']},
	{cena: 'paraquedas', texto: 'Fase três: o paraquedas. Quando para de acelerar, o gato relaxa e abre as patas, como um esquilo voador. Isso freia o corpo e espalha o impacto.', destaque: ['paraquedas', 'relaxa', 'esquilo', 'voador', 'freia', 'impacto']},
	{cena: 'comparacao', texto: 'Ou seja: numa queda curta, ele chega no chão ainda tenso. Numa queda longa, dá tempo de virar, relaxar e planar.', destaque: ['curta', 'tenso', 'longa', 'virar', 'relaxar', 'planar']},
	{cena: 'chefao', texto: 'Mas essa história tem um chefão. Os gatos que morriam na queda quase nunca eram levados ao veterinário. Então o estudo só enxergava quem sobreviveu.', destaque: ['chefão', 'morriam', 'nunca', 'sobreviveu']},
	{cena: 'vidas', texto: 'Gato não tem sete vidas. Se você mora em apartamento, tela na janela é o item mais importante desse jogo.', destaque: ['sete', 'vidas', 'tela', 'janela', 'item']},
	{cena: 'cta', texto: 'E aí, o seu gato já caiu de algum lugar e saiu andando como se nada tivesse acontecido? Conta aqui nos comentários.', destaque: ['nada', 'comentários']},
];

/** Rótulo de fase mostrado no HUD para cada trecho. */
export const FASES = ['INTRO', 'INTRO', 'INTRO', 'FASE 1', 'FASE 1', 'FASE 2', 'FASE 2', 'FASE 3', 'FASE 3', 'CHEFÃO', 'FINAL', 'FINAL'];

// ---------- tempo ----------
const PAUSA = 0.35; // respiro entre trechos (s)
const MEDIDAS = duracoes as Record<string, number>;

/** Duração estimada da fala quando o MP3 ainda não foi medido (~2,6 palavras/s). */
const estimar = (t: string) => t.split(/\s+/).length / 2.6 + 0.3;

export type Palavra = {txt: string; ini: number; fim: number};
export type Bloco = Trecho & {
	n: number;
	arquivo: string;
	temVoz: boolean;
	inicio: number; // frame global
	fala: number; // frames de fala
	total: number; // frames da cena (fala + pausa)
	palavras: Palavra[];
};

/** Divide a fala entre as palavras pelo tamanho (pontuação ganha pausa). */
const distribuir = (texto: string, frames: number): Palavra[] => {
	const ps = texto.split(/\s+/);
	const peso = ps.map((p) => p.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (/[.?!:]$/.test(p) ? 7 : /,$/.test(p) ? 4 : 0));
	const soma = peso.reduce((a, b) => a + b, 0);
	let acc = 0;
	return ps.map((txt, i) => {
		const ini = (acc / soma) * frames;
		acc += peso[i];
		return {txt, ini: Math.round(ini), fim: Math.round((acc / soma) * frames)};
	});
};

let cursor = Math.round(0.4 * FPS);
export const BLOCOS: Bloco[] = ROTEIRO.map((t, n) => {
	const id = String(n).padStart(2, '0');
	const seg = MEDIDAS[id] ?? estimar(t.texto);
	const fala = Math.round(seg * FPS);
	const total = fala + Math.round(PAUSA * FPS);
	const b: Bloco = {...t, n, arquivo: `voz/${id}.mp3`, temVoz: id in MEDIDAS, inicio: cursor, fala, total, palavras: distribuir(t.texto, fala)};
	cursor += total;
	return b;
});

export const DURACAO_TOTAL = cursor + Math.round(1.5 * FPS);

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** Frame (relativo à cena) em que a palavra é dita. `n` = ocorrência (0 = primeira). */
export const em = (b: Bloco, palavra: string, n = 0): number => {
	const alvo = norm(palavra);
	const achadas = b.palavras.filter((p) => norm(p.txt).startsWith(alvo));
	const p = achadas[Math.min(n, achadas.length - 1)];
	if (!p) throw new Error(`Palavra "${palavra}" não está no trecho ${b.n}`);
	return p.ini;
};
