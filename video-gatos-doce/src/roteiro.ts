import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "Your cat has never tasted sugar" (versão videogame, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string};

export const ROTEIRO: Trecho[] = [
	{cena: 'gancho', texto: "Your cat has never tasted sugar. Not once in its whole life. And it's not because you never shared your dessert. Its body simply can't detect sweet.", destaque: ['never', 'sugar', 'sweet']},
	{cena: 'receptor', texto: 'To taste something sweet, your tongue needs a special receptor built from two genes. Cats have both genes, but one of them is broken.', destaque: ['receptor', 'two', 'genes', 'broken']},
	{cena: 'bug', texto: "In two thousand five, scientists found the bug: a small piece of that gene is missing, so the receptor never gets built. For a cat, sugar tastes like nothing. Let's level up.", destaque: ['bug', 'missing', 'nothing', 'level']},
	{cena: 'carne', texto: "Level one: why it doesn't matter. Cats are pure carnivores, and meat has almost no sugar. So when the sweet gene broke, cats lost nothing.", destaque: ['carnivores', 'meat', 'sugar', 'lost']},
	{cena: 'familia', texto: "And it's not just your cat. Tigers and cheetahs have the exact same broken gene. The whole family lost its sweet tooth.", destaque: ['tigers', 'cheetahs', 'same', 'tooth']},
	{cena: 'umami', texto: 'Level two: the meat detector. Instead of sweet, cats are experts at umami, the savory taste of meat. And tuna is packed with the exact molecules that trigger it.', destaque: ['detector', 'umami', 'savory', 'tuna', 'molecules']},
	{cena: 'missil', texto: "That's why the sound of a can opening turns your cat into a heat-seeking missile.", destaque: ['can', 'missile']},
	{cena: 'papilas', texto: 'Level three: the poison shield. Cats have only about four hundred and seventy taste buds. We have around nine thousand. But they can still detect bitter, which helps them avoid spoiled food and some poisons.', destaque: ['shield', 'seventy', 'thousand', 'bitter', 'poisons']},
	{cena: 'chefao', texto: "Now, the final boss: but my cat loves ice cream! Here's the twist. It's not the sugar. It's most likely the fat and the milk proteins.", destaque: ['boss', 'ice', 'cream', 'fat', 'proteins']},
	{cena: 'lactose', texto: 'And many adult cats are lactose intolerant. So that scoop of ice cream can end with a very unhappy stomach.', destaque: ['lactose', 'intolerant', 'unhappy']},
	{cena: 'biscoito', texto: "So next time your cat stares at your cookie, it's not craving sugar. It just wants to know if there's any meat in it.", destaque: ['cookie', 'sugar', 'meat']},
	{cena: 'cta', texto: 'Would your cat trade a cake for a can of tuna? Tell me in the comments.', destaque: ['cake', 'tuna', 'comments']},
];

/** Rótulo de fase mostrado no HUD para cada trecho. */
export const FASES = ['INTRO', 'INTRO', 'INTRO', 'LEVEL 1', 'LEVEL 1', 'LEVEL 2', 'LEVEL 2', 'LEVEL 3', 'BOSS', 'BOSS', 'FINAL', 'FINAL'];

// ---------- tempo ----------
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const PAUSA = 0.35; // respiro entre trechos (s)
const MEDIDAS = duracoes as Record<string, number>;
/** Tempo real de cada palavra (s), vindo do sintetizador de voz. */
const TEMPOS = tempos as Record<string, {t: string; ini: number; fim: number}[]>;

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
/** Casa as palavras do texto com os tempos reais da voz (pelo texto normalizado). */
const alinhar = (texto: string, ts: {t: string; ini: number; fim: number}[]): Palavra[] | null => {
	const ps = texto.split(/\s+/);
	let j = 0;
	const out: Palavra[] = [];
	for (const txt of ps) {
		const alvo = norm(txt);
		if (!alvo) continue;
		let acc = '';
		let ini = -1;
		let fim = 0;
		while (j < ts.length && acc.length < alvo.length) {
			if (ini < 0) ini = ts[j].ini;
			acc += norm(ts[j].t);
			fim = ts[j].fim;
			j++;
		}
		if (ini < 0 || acc !== alvo) return null;
		out.push({txt, ini: Math.round(ini * FPS), fim: Math.round(fim * FPS)});
	}
	return out;
};

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
	const b: Bloco = {...t, n, arquivo: `voz/${id}.mp3`, temVoz: id in MEDIDAS, inicio: cursor, fala, total, palavras: (TEMPOS[id] && alinhar(t.texto, TEMPOS[id])) || distribuir(t.texto, fala)};
	cursor += total;
	return b;
});

export const DURACAO_TOTAL = cursor + Math.round(1.5 * FPS);


/** Frame (relativo à cena) em que a palavra é dita. `n` = ocorrência (0 = primeira). */
export const em = (b: Bloco, palavra: string, n = 0): number => {
	const alvo = norm(palavra);
	const exatas = b.palavras.filter((p) => norm(p.txt) === alvo);
	const achadas = exatas.length ? exatas : b.palavras.filter((p) => norm(p.txt).startsWith(alvo));
	const p = achadas[Math.min(n, achadas.length - 1)];
	if (!p) throw new Error(`Palavra "${palavra}" não está no trecho ${b.n}`);
	return p.ini;
};
