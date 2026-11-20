import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "7 weird things cats do" (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string};

export const ROTEIRO: Trecho[] = [
	{cena: 'intro', texto: "Your cat does some pretty strange things. It kneads you like bread dough, it knocks your stuff off the table, and it goes completely crazy at three in the morning.", destaque: ['kneads', 'knocks', 'crazy']},
	{cena: 'intro2', texto: "But every one of those weird habits has a reason. Here are seven strange things cats do, and the science behind each one.", destaque: ['reason', 'seven', 'science']},
	{cena: 'amassa', texto: "Number one: making biscuits. When a cat pushes its paws in and out on a soft blanket, or on you, it's called kneading.", destaque: ['biscuits', 'paws', 'kneading']},
	{cena: 'amassa2', texto: "It starts when cats are tiny kittens. Kneading their mother's belly helps the milk flow. So when an adult cat kneads you, it usually means it feels safe and happy, like a kitten again.", destaque: ['kittens', 'milk', 'safe', 'happy']},
	{cena: 'cabeca', texto: "Number two: the head bump. When your cat rubs its cheeks and forehead on you, it's not just being cute.", destaque: ['head', 'bump', 'cheeks', 'cute']},
	{cena: 'cabeca2', texto: "Cats have scent glands on their face. Every rub leaves a tiny, invisible message on you that says: this human is part of my family.", destaque: ['scent', 'glands', 'invisible', 'family']},
	{cena: 'caixa', texto: "Number three: the box obsession. Give a cat an expensive bed, and it will sit in the box it came in.", destaque: ['box', 'expensive', 'sit']},
	{cena: 'caixa2', texto: "Small, closed spaces make cats feel protected. In fact, a study with shelter cats found that the ones who got a hiding box calmed down faster than the ones who didn't.", destaque: ['protected', 'study', 'hiding', 'faster']},
	{cena: 'mesa', texto: "Number four: knocking things off the table. Your cat looks right at you, and slowly pushes your cup off the edge.", destaque: ['knocking', 'table', 'cup', 'edge']},
	{cena: 'mesa2', texto: "Part of it is hunting instinct: tapping something to see if it moves, like testing prey. And part of it is pure strategy, because the second something falls, you look at your cat.", destaque: ['instinct', 'prey', 'strategy', 'look']},
	{cena: 'tagarela', texto: "Number five: the chattering. Your cat sees a bird through the window and starts making a weird clicking sound with its jaw.", destaque: ['chattering', 'bird', 'clicking']},
	{cena: 'tagarela2', texto: "Scientists aren't completely sure why. It might be excitement, or frustration at prey it can't reach. And in the Amazon, researchers once saw a wild cat imitating the calls of monkeys it was hunting.", destaque: ['excitement', 'frustration', 'amazon', 'imitating', 'monkeys']},
	{cena: 'presente', texto: "Number six: the gifts. Your cat proudly drops a mouse, a bug or a lizard right at your feet.", destaque: ['gifts', 'mouse', 'bug', 'lizard']},
	{cena: 'presente2', texto: "Cats are natural hunters, and they often bring prey back to a place where they feel safe. Your home is that place. One popular theory says your cat might even be trying to share, or teach you to hunt.", destaque: ['hunters', 'safe', 'home', 'share', 'teach']},
	{cena: 'presente3', texto: "So, as gross as it is, don't scold your cat. In its mind, it just did something great.", destaque: ['gross', 'scold', 'great']},
	{cena: 'zoomies', texto: "Number seven: the zoomies. Out of nowhere, your cat sprints across the house like it's being chased by a ghost.", destaque: ['zoomies', 'sprints', 'ghost']},
	{cena: 'zoomies2', texto: "Scientists even have a name for it: frenetic random activity periods. It's a burst of stored energy, and since cats are most active at dusk and dawn, it often hits at night.", destaque: ['frenetic', 'random', 'activity', 'periods', 'energy', 'night']},
	{cena: 'zoomies3', texto: "Indoor cats can get the zoomies even more, because they don't spend their energy hunting. A good play session before bed can help everyone sleep.", destaque: ['indoor', 'energy', 'play', 'sleep']},
	{cena: 'fim', texto: "So the next time your cat does something weird, remember: there's almost always a reason behind it.", destaque: ['weird', 'reason']},
	{cena: 'cta', texto: "Which of these seven does your cat do the most? Tell me the number in the comments.", destaque: ['seven', 'number', 'comments']},
];

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
