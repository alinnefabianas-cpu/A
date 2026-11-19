import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "Cats only meow at humans" (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string};

export const ROTEIRO: Trecho[] = [
	{cena: 'gancho', texto: "Here's something weird: adult cats almost never meow at each other. The meow is a sound they save for one species. Us.", destaque: ['never', 'meow', 'species', 'us']},
	{cena: 'filhote', texto: 'Kittens meow to call their mother when they are cold or hungry. But as they grow up, most cats stop meowing to other cats completely.', destaque: ['kittens', 'mother', 'cold', 'hungry', 'stop']},
	{cena: 'idioma', texto: 'Between themselves, cats talk with scent, body language, hisses and growls. A tail held straight up says hello. A slow blink is a friendly signal.', destaque: ['scent', 'body', 'hisses', 'growls', 'tail', 'blink']},
	{cena: 'humano', texto: "So why do they meow at us? Because we're terrible at reading cat language. We miss the tail, we miss the ears. But we always notice noise.", destaque: ['terrible', 'tail', 'ears', 'noise']},
	{cena: 'mae', texto: 'So cats kept the kitten sound and turned it into a tool. Basically, your cat treats you like a big, slightly clueless mother cat.', destaque: ['kitten', 'tool', 'clueless', 'mother']},
	{cena: 'ronrom', texto: "And it gets smarter. In two thousand nine, researchers discovered the solicitation purr: a purr with a hidden cry inside, close to the pitch of a human baby's cry.", destaque: ['solicitation', 'purr', 'hidden', 'cry', 'baby']},
	{cena: 'comida', texto: 'Cats use it mostly when they want food. And it works, because our brains find that sound really hard to ignore.', destaque: ['food', 'works', 'brains', 'ignore']},
	{cena: 'vocabulario', texto: "Even better: each cat builds its own vocabulary with its human. Owners tend to understand their own cat's meows, but struggle with a stranger's cat.", destaque: ['vocabulary', 'own', 'stranger']},
	{cena: 'ferais', texto: 'Feral cats that live without people meow much less. A meow only makes sense when there is a human around to hear it.', destaque: ['feral', 'less', 'human']},
	{cena: 'madrugada', texto: 'So the next time your cat meows at you at five in the morning, remember: that sound was made just for you.', destaque: ['five', 'morning', 'you']},
	{cena: 'linguagem', texto: "It's not just noise. It's your cat speaking the only language it thinks you understand.", destaque: ['noise', 'language', 'understand']},
	{cena: 'cta', texto: "What does your cat's 'I want food' meow sound like? Write it in the comments.", destaque: ['food', 'comments']},
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
