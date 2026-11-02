import duracoes from './duracoes.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "Por que os gatos dormem tanto?".
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string};

export const ROTEIRO: Trecho[] = [
	{cena: 'gancho', texto: 'Se o seu gato tem quinze anos, ele já passou dez deles dormindo.', destaque: ['quinze', 'dez', 'dormindo']},
	{cena: 'relogio', texto: 'Gatos dormem, em média, de doze a dezesseis horas por dia. Filhotes e gatos idosos chegam a vinte.', destaque: ['doze', 'dezesseis', 'vinte']},
	{cena: 'estrategia', texto: 'Mas isso não é preguiça. É estratégia. E hoje eu te mostro os três motivos.', destaque: ['preguiça', 'estratégia', 'três']},
	{cena: 'cacador', texto: 'Primeiro motivo: o seu gato é um caçador. Na natureza, cada caçada é uma explosão. Espreitar, correr, saltar. Tudo em poucos segundos.', destaque: ['caçador', 'explosão', 'espreitar', 'correr', 'saltar']},
	{cena: 'bateria', texto: 'E isso gasta muita energia. Então o corpo do gato funciona como uma bateria. Dorme, carrega, e gasta tudo de uma vez.', destaque: ['energia', 'bateria', 'dorme', 'carrega', 'gasta']},
	{cena: 'horario', texto: 'Segundo motivo: o horário. Gatos são crepusculares. Eles ficam mais ativos ao amanhecer e ao anoitecer, que é justamente quando ratos e passarinhos saem.', destaque: ['crepusculares', 'amanhecer', 'anoitecer']},
	{cena: 'madrugada', texto: 'É por isso que ele dorme o dia inteiro, e às cinco da manhã resolve correr pela casa.', destaque: ['cinco', 'correr']},
	{cena: 'cochilo', texto: 'Terceiro motivo: a maior parte desse sono é de mentira. Cerca de três quartos é só um cochilo leve. Repara: o olho está fechado, mas a orelha continua girando atrás de cada barulho.', destaque: ['mentira', 'três', 'quartos', 'cochilo', 'orelha']},
	{cena: 'profundo', texto: 'Só um quarto é sono profundo. E é nele que o gato sonha. Se as patinhas tremerem, ele provavelmente está caçando no sonho.', destaque: ['profundo', 'sonha', 'patinhas', 'sonho']},
	{cena: 'barriga', texto: 'E um bônus: se o seu gato dorme de barriga pra cima perto de você, isso é confiança. A barriga é a parte mais frágil dele.', destaque: ['bônus', 'barriga', 'confiança', 'frágil']},
	{cena: 'retorno', texto: 'Então, lembra daqueles dez anos dormindo? Não é preguiça. É um caçador recarregando a bateria.', destaque: ['dez', 'preguiça', 'caçador', 'recarregando']},
	{cena: 'cta', texto: 'E agora me conta aqui nos comentários: quantas horas o seu gato dorme por dia?', destaque: ['comentários', 'quantas', 'horas']},
];

// ---------- tempo ----------
const PAUSA = 0.45; // respiro entre trechos (s)
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
