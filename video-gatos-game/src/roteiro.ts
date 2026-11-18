import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "Por que um gato cai do 20º andar e sobrevive?" (versão videogame, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string};

export const ROTEIRO: Trecho[] = [
	{cena: 'gancho', texto: 'A cat that falls from the twentieth floor can get hurt less than one that falls from the seventh. It sounds like a glitch in the game, but science has an explanation.', destaque: ['twentieth', 'seventh', 'glitch']},
	{cena: 'estudo', texto: 'In nineteen eighty-seven, vets in New York studied one hundred and thirty-two cats that had fallen from buildings. Ninety percent survived.', destaque: ['vets', 'hundred', 'thirty-two', 'ninety', 'survived']},
	{cena: 'grafico', texto: "And the strangest part: injuries got worse up to the seventh floor. After that, they started to drop. To understand this glitch, let's level up.", destaque: ['worse', 'seventh', 'drop', 'level']},
	{cena: 'giro', texto: 'Level one: the twist. In mid-air, the cat bends its body in half, turns the front end, then the back end, and boom: feet down.', destaque: ['twist', 'bends', 'front', 'back', 'feet']},
	{cena: 'coluna', texto: "It can do this because it has a super flexible spine and a floating collarbone that isn't locked to other bones. It's like its body came with a spin button.", destaque: ['flexible', 'spine', 'collarbone', 'floating', 'button']},
	{cena: 'velocidade', texto: "Level two: top speed. Because it's light and fluffy, a cat stops speeding up at around sixty miles per hour. A person reaches almost double that.", destaque: ['top', 'speed', 'light', 'fluffy', 'sixty', 'double']},
	{cena: 'andares', texto: "And it hits that speed after falling about five floors. From there on, the fall doesn't get any faster.", destaque: ['five', 'floors', 'faster']},
	{cena: 'paraquedas', texto: 'Level three: the parachute. Once it stops speeding up, the cat relaxes and spreads its legs like a flying squirrel. That slows it down and spreads out the impact.', destaque: ['parachute', 'relaxes', 'flying', 'squirrel', 'slows', 'impact']},
	{cena: 'comparacao', texto: "So: in a short fall, it hits the ground still tense. In a long fall, there's time to twist, relax and glide.", destaque: ['short', 'tense', 'long', 'twist', 'relax', 'glide']},
	{cena: 'chefao', texto: 'But this story has a final boss. Cats that died in the fall were almost never taken to the vet. So the study only saw the survivors.', destaque: ['boss', 'died', 'never', 'survivors']},
	{cena: 'vidas', texto: "Cats don't have nine lives. If you live in an apartment, window screens are the most important item in this game.", destaque: ['nine', 'lives', 'window', 'screens', 'item']},
	{cena: 'cta', texto: 'So, has your cat ever fallen off something and just walked away like nothing happened? Tell me in the comments.', destaque: ['nothing', 'comments']},
];

/** Rótulo de fase mostrado no HUD para cada trecho. */
export const FASES = ['INTRO', 'INTRO', 'INTRO', 'LEVEL 1', 'LEVEL 1', 'LEVEL 2', 'LEVEL 2', 'LEVEL 3', 'LEVEL 3', 'BOSS', 'FINAL', 'FINAL'];

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
