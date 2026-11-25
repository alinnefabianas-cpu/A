// Roteiro visual: um item por trecho do roteiro (mesma ordem de ROTEIRO).
// `w` = palavra da narração que faz o elemento aparecer (sem `w`, aparece logo no começo).
import type {GatoSpec} from './gato';

export type Pose = 'frente' | 'pao' | 'barriga' | 'arco' | 'arcoAssustado' | 'agachado' | 'rebola' | 'dorme' | 'lado' | 'correndo';
export type GatoVis = GatoSpec & {pose?: Pose; x?: number; y?: number; escala?: number; w?: string; rot?: number; virado?: boolean; muda?: ({w: string} & GatoSpec)[]};
export type TextoVis = {w?: string; txt: string; cor?: 'vermelho' | 'verde' | 'grafite'; marca?: boolean; tam?: number; x?: number; y?: number};
export type Extra =
	| {tipo: 'pessoa'; w?: string; x: number; escala?: number; bracos?: 'baixo' | 'cima'}
	| {tipo: 'coracao'; w?: string; x: number; y: number; s?: number}
	| {tipo: 'balao'; w?: string; x: number; y: number; txt: string; cauda: {x: number; y: number}; largura?: number}
	| {tipo: 'som'; w?: string; x: number; y: number; dir?: 1 | -1}
	| {tipo: 'passaro'; w?: string; x: number; y: number}
	| {tipo: 'rato'; w?: string; x: number; y: number}
	| {tipo: 'mao'; w?: string; x: number; y: number; rot?: number; acariciar?: boolean; ate?: string}
	| {tipo: 'check' | 'xis'; w?: string; x: number; y: number; s?: number}
	| {tipo: 'circulo'; w?: string; x: number; y: number; rx: number; ry: number}
	| {tipo: 'seta'; w?: string; de: {x: number; y: number}; para: {x: number; y: number}; cor?: 'vermelho'}
	| {tipo: 'janela'; w?: string; x: number; y: number}
	| {tipo: 'geladeira'; w?: string; x: number; topo: number}
	| {tipo: 'olho'; w?: string; x: number; y: number; s?: number; brilho?: string; dilata?: boolean}
	| {tipo: 'cores' | 'nitidez' | 'campo'; w?: string; x: number; y: number}
	| {tipo: 'barras'; w?: string; x: number; y: number; largura: number; itens: {rotulo: string; valor: number; txt?: string; cor?: string}[]}
	| {tipo: 'onda'; w?: string; x: number; y: number; largura: number; alta?: boolean; cor?: 'vermelho' | 'verde'}
	| {tipo: 'nariz' | 'fonte' | 'aspirador' | 'laranja' | 'jornal' | 'folhas' | 'lua'; w?: string; x: number; y: number; s?: number}
	| {tipo: 'pata'; w?: string; x: number; y: number; s?: number; suor?: string}
	| {tipo: 'cerca'; w?: string; x: number; y: number; largura: number}
	| {tipo: 'tigela'; w?: string; x: number; y: number; s?: number; funda?: boolean}
	| {tipo: 'fresta'; w?: string; x: number; y: number}
	| {tipo: 'sofa'; w?: string; x: number; y: number; s?: number; arranha?: string}
	| {tipo: 'relogio'; w?: string; x: number; y: number; txt: string}
	| {tipo: 'linhaTempo'; w?: string; x: number; y: number; largura: number; marcas: {pos: number; txt: string}[]; destaque?: number}
	| {tipo: 'mapa'; w?: string; x: number; y: number; lugares: {x: number; y: number; txt: string}[]; rota?: string}
	| {tipo: 'piramide' | 'mumia' | 'bastet' | 'trigo' | 'maneki' | 'ilha' | 'foguete' | 'porta10' | 'chapeu' | 'tumulo'; w?: string; x: number; y: number; s?: number}
	| {tipo: 'barco'; w?: string; x: number; y: number; s?: number; viking?: boolean}
	| {tipo: 'roseta' | 'pergaminho'; w?: string; x: number; y: number; s?: number; txt?: string}
	| {tipo: 'carimbo'; w?: string; x: number; y: number; s?: number; txt?: string}
	| {tipo: 'verdade' | 'leite' | 'lata' | 'banheira' | 'torneira' | 'varinha' | 'arranhador' | 'lirio'; w?: string; x: number; y: number; s?: number}
	| {tipo: 'balanca'; w?: string; x: number; y: number; s?: number; peso?: string}
	| {tipo: 'caixaAreia'; w?: string; x: number; y: number; s?: number; luvas?: boolean}
	| {tipo: 'cerebro'; w?: string; x: number; y: number; s?: number; brilha?: boolean}
	| {tipo: 'lampada' | 'capelo' | 'chaves' | 'transportadora' | 'portaMacaneta' | 'sino' | 'clicker'; w?: string; x: number; y: number; s?: number}
	| {tipo: 'travesseiro'; w?: string; x: number; y: number; s?: number; revela?: string}
	| {tipo: 'pote'; w?: string; x: number; y: number; s?: number; vira?: string}
	| {tipo: 'pontos'; w?: string; x: number; y: number; s?: number; n: number; grande?: boolean}
	| {tipo: 'tela'; w?: string; x: number; y: number; s?: number; preto?: boolean}
	| {tipo: 'altoFalante'; w?: string; x: number; y: number; s?: number; fala?: string}
	| {tipo: 'prova'; w?: string; x: number; y: number; s?: number; nota?: string}
	| {tipo: 'texto'; w?: string; x: number; y: number; txt: string; tam?: number; cor?: 'vermelho' | 'verde' | 'grafite'; marca?: boolean};

export type Vis = {
	abre?: boolean;
	gato?: GatoVis;
	gatos?: GatoVis[];
	textos?: TextoVis[];
	colX?: number;
	postit?: {w: string; linhas: string[]; x?: number; y?: number; rot?: number};
	extras?: Extra[];
};

export const CAPITULOS = ['', 'The "cold cat" myth', 'The attachment test', 'The slow blink', 'Headbutts & rubbing', 'Kneading & purring', 'Tail up & welcome home', 'Gifts & following you', 'The love hormone', 'How to get more love'];

export const VIS: Vis[] = [
	// 0
	{
		gato: {olhos: 'meio', x: 560},
		textos: [
			{w: 'love', txt: 'does your cat love you?'},
			{w: 'food', txt: '...or just the food?', cor: 'grafite'},
			{w: 'questions', txt: 'the oldest question', marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'Do cats love you?', tam: 84, marca: true}, {tipo: 'tigela', w: 'food', x: 860, y: 840, s: 0.6}],
	},
	// 1
	{
		gatos: [{x: 460, escala: 0.8, olhos: 'meio'}],
		colX: 1100,
		textos: [
			{w: 'dogs', txt: 'dogs: jump, wag, lick!'},
			{w: 'quieter', txt: 'cats: quieter...'},
			{w: 'cold', txt: '= "cold"?', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'texto', w: 'cold', x: 620, y: 470, txt: '?', tam: 90, cor: 'vermelho'}],
	},
	// 2
	{
		gato: {x: 470, olhos: 'lento', rabo: 'gancho'},
		colX: 1100,
		textos: [
			{w: 'scientists', txt: 'scientists studied the bond'},
			{w: 'sweeter', txt: 'the answer is sweeter', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'coracao', w: 'sweeter', x: 640, y: 430, s: 1.2}],
	},
	// 3 — CAP 1
	{
		abre: true,
		gato: {olhos: 'fenda', orelhas: 'lado'},
		textos: [
			{w: 'aloof', txt: '"cats are aloof"'},
			{w: 'history', txt: 'it starts with history', marca: true},
		],
	},
	// 4
	{
		gato: {pose: 'agachado', x: 560, pelagem: 'selvagem'},
		colX: 1150,
		textos: [
			{w: 'wildcat', txt: 'African wildcat'},
			{w: 'alone', txt: 'lives & hunts alone'},
			{w: 'pack', txt: 'no pack, no boss', marca: true},
		],
		extras: [{tipo: 'folhas', w: 'hunts', x: 920, y: 840, s: 0.8}],
	},
	// 5
	{
		textos: [
			{w: 'wolves', txt: 'dogs <- wolves', x: 300, y: 400},
			{w: 'families', txt: 'live in families', x: 300, y: 495},
			{w: 'loud', txt: 'feelings: BIG & LOUD', x: 300, y: 590, marca: true},
		],
		extras: [{tipo: 'som', w: 'loud', x: 1300, y: 560}, {tipo: 'som', w: 'loud', x: 1500, y: 560, dir: -1}],
	},
	// 6
	{
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'affection', txt: 'cat affection ='},
			{w: 'small', txt: 'small, quiet signals', marca: true},
			{w: 'nothing', txt: "easy to miss!", cor: 'vermelho'},
		],
		extras: [{tipo: 'circulo', w: 'signals', x: 560, y: 615, rx: 110, ry: 50}],
	},
	// 7
	{
		gatos: [{x: 380, escala: 0.75, pelagem: 'selvagem'}, {x: 700, escala: 0.75, w: 'domestic', rabo: 'alto'}],
		colX: 1050,
		textos: [
			{w: 'domestic', txt: 'house cats: more social'},
			{w: 'changed', txt: 'living with us changed them', marca: true},
		],
		extras: [{tipo: 'seta', w: 'domestic', de: {x: 470, y: 520}, para: {x: 620, y: 520}, cor: 'vermelho'}],
	},
	// 8
	{
		gatos: [{x: 360, escala: 0.7, olhos: 'lento'}, {x: 640, escala: 0.7, pelagem: 'preto', olhos: 'lento'}],
		colX: 1050,
		textos: [
			{w: 'friendships', txt: 'close friendships'},
			{w: 'humans', txt: 'with cats & humans'},
			{w: 'terms', txt: '...on their own terms', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'friendships', x: 500, y: 470}],
	},
	// 9
	{
		gato: {x: 470, orelhas: 'gira'},
		colX: 1100,
		textos: [
			{w: 'voice', txt: "knows its owner's voice"},
			{w: 'strangers', txt: 'more than strangers'},
			{w: 'ears', txt: 'ears + head turn', marca: true},
		],
		extras: [{tipo: 'altoFalante', w: 'recording', x: 860, y: 840, s: 0.8, fala: 'calling'}],
	},
	// 10 — CAP 2
	{
		abre: true,
		textos: [
			{w: '2019', txt: '2019', x: 1050, y: 400, tam: 80},
			{w: 'Oregon', txt: 'Oregon State University', x: 1050, y: 495},
			{w: 'experiment', txt: 'a famous experiment', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'prova', w: 'experiment', x: 560, y: 650, nota: 'A+'}],
	},
	// 11
	{
		gato: {x: 470, escala: 0.85, olhos: 'dilatado', orelhas: 'gira'},
		colX: 1150,
		textos: [
			{w: 'babies', txt: 'a test made for babies'},
			{w: 'strange', txt: 'a strange room', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'relogio', w: 'minutes', x: 1700, y: 760, txt: '2 min'}],
	},
	// 12
	{
		gato: {x: 470, escala: 0.85, olhos: 'dilatado', orelhas: 'lado', muda: [{w: 'back', orelhas: 'frente', olhos: 'normal', rabo: 'alto'}]},
		colX: 1150,
		textos: [
			{w: 'leaves', txt: 'owner leaves...'},
			{w: 'back', txt: '...and comes back'},
			{w: 'reunion', txt: 'watch the reunion', marca: true},
		],
		extras: [{tipo: 'portaMacaneta', x: 860, y: 840}, {tipo: 'pessoa', w: 'back', x: 1000, escala: 0.8}],
	},
	// 13
	{
		gato: {x: 470, rabo: 'alto', olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'securely', txt: 'SECURE:', cor: 'verde'},
			{w: 'greets', txt: 'greets the owner'},
			{w: 'relaxes', txt: 'relaxes & explores'},
			{w: 'safe', txt: 'owner = safe base', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 14
	{
		gato: {x: 470, rabo: 'entre', orelhas: 'lado', olhos: 'dilatado'},
		colX: 1100,
		textos: [
			{w: 'insecure', txt: 'INSECURE:', cor: 'vermelho'},
			{w: 'clings', txt: 'clings too much'},
			{w: 'avoids', txt: 'or avoids the owner', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 15
	{
		extras: [
			{
				tipo: 'barras',
				w: 'sixty',
				x: 300,
				y: 420,
				largura: 1250,
				itens: [
					{rotulo: 'secure', valor: 0.64, txt: '~64%', cor: '#7ed6a0'},
					{rotulo: 'insecure', valor: 0.36, txt: '~36%'},
				],
			},
		],
		textos: [{w: 'securely', txt: 'securely attached cats', x: 300, y: 760, marca: true}],
	},
	// 16
	{
		extras: [
			{
				tipo: 'barras',
				w: 'percentage',
				x: 300,
				y: 380,
				largura: 1250,
				itens: [
					{rotulo: 'cats', valor: 0.64, txt: '~64%', cor: '#7ed6a0'},
					{rotulo: 'babies', valor: 0.65, txt: '~65%'},
					{rotulo: 'dogs', valor: 0.6, txt: '~60%'},
				],
			},
		],
		textos: [{w: 'babies', txt: 'almost the same!', x: 300, y: 780, marca: true}],
	},
	// 17
	{
		gato: {x: 470, olhos: 'lento', rabo: 'gancho'},
		colX: 1100,
		textos: [
			{w: 'tolerate', txt: 'not just tolerating us'},
			{w: 'comfort', txt: 'comfort & security'},
			{w: 'parent', txt: 'like a child & a parent', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'coracao', w: 'comfort', x: 640, y: 430}],
	},
	// 18 — CAP 3
	{
		abre: true,
		gato: {olhos: 'lento'},
		textos: [
			{w: 'slowly', txt: 'eyes close slowly...'},
			{w: 'compliment', txt: '= a compliment!', marca: true},
		],
	},
	// 19
	{
		gato: {olhos: 'encarando', muda: [{w: 'Closing', olhos: 'lento'}]},
		textos: [
			{w: 'staring', txt: 'staring = threat', cor: 'vermelho'},
			{w: 'Closing', txt: 'closing eyes = "I trust you"', cor: 'verde', marca: true},
		],
	},
	// 20
	{
		gato: {x: 470, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: '2020', txt: '2020, United Kingdom'},
			{w: 'Owners', txt: 'owner blinks slowly...'},
			{w: 'back', txt: '...the cat blinks back!', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 21
	{
		gato: {x: 470, olhos: 'lento', rabo: 'alto'},
		colX: 1100,
		textos: [
			{w: 'stranger', txt: 'even with a stranger'},
			{w: 'approach', txt: 'more likely to approach', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'seta', w: 'approach', de: {x: 560, y: 760}, para: {x: 720, y: 760}, cor: 'vermelho'}],
	},
	// 22
	{
		gato: {olhos: 'lento', boca: 'w'},
		textos: [
			{w: 'smile', txt: '"the cat smile"', marca: true},
			{w: 'look', txt: '1. look at your cat'},
			{w: 'narrow', txt: '2. narrow your eyes'},
			{w: 'blink', txt: '3. blink slowly'},
		],
	},
	// 23
	{
		gato: {olhos: 'lento', rabo: 'gancho'},
		textos: [
			{w: 'back', txt: 'it blinks back?'},
			{w: 'conversation', txt: 'a real cat conversation!', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'congratulations', x: 740, y: 450}],
	},
	// 24 — CAP 4
	{
		abre: true,
		gato: {x: 470, rot: -12, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'bumps', txt: 'head bump ='},
			{w: 'bunting', txt: '"bunting"', marca: true, tam: 80},
		],
		extras: [{tipo: 'pessoa', x: 760, escala: 1}],
	},
	// 25
	{
		gato: {olhos: 'lento'},
		textos: [
			{w: 'glands', txt: 'scent glands:'},
			{w: 'cheeks', txt: 'cheeks, chin, forehead'},
			{w: 'leave', txt: 'leaves its scent on you', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'cheeks', x: 560, y: 650, rx: 130, ry: 70}],
	},
	// 26
	{
		gatos: [{x: 380, escala: 0.75, rot: 10, olhos: 'lento'}, {x: 620, escala: 0.75, rot: -10, pelagem: 'preto', olhos: 'lento'}],
		colX: 1050,
		textos: [
			{w: 'together', txt: 'cats that live together'},
			{w: 'group', txt: 'a shared group smell'},
			{w: 'family', txt: '"we are family"', marca: true},
		],
	},
	// 27
	{
		gato: {x: 470, olhos: 'lento', rabo: 'alto'},
		colX: 1100,
		textos: [
			{w: 'legs', txt: 'rubbing your legs ='},
			{w: 'marking', txt: 'marking you'},
			{w: 'belong', txt: 'you belong to the cat', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'carimbo', w: 'belong', x: 1550, y: 780, txt: 'MINE'}],
	},
	// 28
	{
		gatos: [{x: 380, escala: 0.75, olhos: 'fechados'}, {x: 620, escala: 0.75, pelagem: 'preto', boca: 'lingua'}],
		colX: 1050,
		textos: [
			{w: 'groom', txt: 'friends groom each other'},
			{w: 'head', txt: 'head & neck'},
			{w: 'allogrooming', txt: '"allogrooming"', marca: true},
		],
	},
	// 29
	{
		gato: {x: 470, boca: 'lingua', olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'licks', txt: 'licks your hand?'},
			{w: 'friend', txt: '= close friend', marca: true},
			{w: 'sandpaper', txt: '(sandpaper edition)', cor: 'grafite'},
		],
		extras: [{tipo: 'mao', w: 'hand', x: 760, y: 600, rot: 180}],
	},
	// 30 — CAP 5
	{
		abre: true,
		gato: {amassar: true, olhos: 'lento'},
		textos: [
			{w: 'kneading', txt: 'kneading = paws in & out', marca: true},
			{w: 'blanket', txt: 'on a soft blanket...'},
			{w: 'you', txt: '...or on you'},
		],
	},
	// 31
	{
		gato: {amassar: true, olhos: 'fechados', escala: 0.8},
		textos: [
			{w: 'kittens', txt: 'kittens knead mom'},
			{w: 'milk', txt: 'to get milk flowing'},
			{w: 'safe', txt: 'adults: when safe & happy', marca: true},
		],
		extras: [{tipo: 'leite', w: 'milk', x: 1600, y: 800, s: 0.7}],
	},
	// 32
	{
		gato: {amassar: true, olhos: 'lento'},
		textos: [
			{w: 'lap', txt: 'kneading your lap ='},
			{w: 'comfortable', txt: 'the most comfortable feeling', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'comfortable', x: 740, y: 450}],
	},
	// 33
	{
		gato: {olhos: 'fechados'},
		textos: [
			{w: 'kittenhood', txt: 'purring starts early'},
			{w: 'nursing', txt: 'kittens purr while nursing'},
			{w: 'closeness', txt: '= a signal of closeness', marca: true},
		],
		extras: [{tipo: 'onda', w: 'purr', x: 260, y: 470, largura: 220}],
	},
	// 34
	{
		gato: {olhos: 'lento', muda: [{w: 'stressed', olhos: 'dilatado', orelhas: 'lado', rabo: 'entre'}]},
		textos: [
			{w: 'trust', txt: 'purring = trust... mostly', cor: 'verde'},
			{w: 'stressed', txt: 'also: stress or pain!', cor: 'vermelho'},
			{w: 'body', txt: 'check the whole body', marca: true},
		],
	},
	// 35
	{
		gato: {olhos: 'lento', rabo: 'baixo'},
		textos: [
			{w: 'relaxed', txt: 'relaxed eyes'},
			{w: 'soft', txt: 'soft paws'},
			{w: 'slow', txt: 'slow tail'},
			{w: 'bonded', txt: '= a happy, bonded cat', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'check', w: 'bonded', x: 1700, y: 640}],
	},
	// 36 — CAP 6
	{
		abre: true,
		gato: {rabo: 'alto', olhos: 'normal'},
		textos: [
			{w: 'tail', txt: 'tail straight up ='},
			{w: 'hello', txt: '"hello!"', marca: true, tam: 80},
		],
		extras: [{tipo: 'circulo', w: 'straight', x: 665, y: 480, rx: 70, ry: 120}],
	},
	// 37
	{
		gatos: [{x: 360, escala: 0.7, rabo: 'alto'}, {x: 640, escala: 0.7, rabo: 'alto', pelagem: 'preto'}],
		colX: 1050,
		textos: [
			{w: 'greeting', txt: 'tails up for friends', cor: 'verde'},
			{w: 'rarely', txt: 'rarely for rivals', cor: 'vermelho', marca: true},
		],
	},
	// 38
	{
		gato: {rabo: 'gancho', olhos: 'lento'},
		textos: [
			{w: 'hook', txt: 'tail up + a hook'},
			{w: 'friendly', txt: '= extra friendly'},
			{w: 'waving', txt: 'a cat wave!', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'hook', x: 680, y: 450, rx: 60, ry: 50}],
	},
	// 39
	{
		textos: [
			{w: 'Swedish', txt: 'Swedish study', x: 300, y: 380, marca: true},
			{w: 'four', txt: 'alone 4 hours vs 30 min', x: 300, y: 475},
			{w: 'purring', txt: '4 hours: more purring & stretching', x: 300, y: 570, cor: 'verde'},
		],
		extras: [{tipo: 'relogio', w: 'four', x: 1500, y: 720, txt: '4h'}],
	},
	// 40
	{
		gato: {x: 470, rabo: 'alto', olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'notice', txt: 'they notice you were gone'},
			{w: 'happy', txt: 'happy you came back', marca: true},
		],
		extras: [{tipo: 'pessoa', w: 'back', x: 800, escala: 1, bracos: 'cima'}, {tipo: 'coracao', w: 'happy', x: 640, y: 430}],
	},
	// 41
	{
		gato: {x: 760, escala: 0.75, orelhas: 'frente'},
		colX: 1150,
		textos: [
			{w: 'wait', txt: 'waiting by the door'},
			{w: 'car', txt: 'knows your car & keys'},
			{w: 'coincidence', txt: 'not a coincidence!', marca: true},
		],
		extras: [{tipo: 'portaMacaneta', x: 450, y: 840}, {tipo: 'chaves', w: 'keys', x: 1650, y: 780}],
	},
	// 42 — CAP 7
	{
		abre: true,
		gato: {x: 470, olhos: 'lento', rabo: 'alto'},
		colX: 1100,
		textos: [
			{w: 'gift', txt: 'a "gift" for you:'},
			{w: 'mouse', txt: 'a mouse, a bird...'},
			{w: 'leaf', txt: '...a leaf', marca: true},
		],
		extras: [{tipo: 'rato', w: 'mouse', x: 820, y: 840}],
	},
	// 43
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'sure', txt: 'nobody knows for sure'},
			{w: 'safe', txt: 'prey to a safe place?'},
			{w: 'sharing', txt: 'sharing with the group?', marca: true},
		],
	},
	// 44
	{
		gato: {x: 470, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'included', txt: "you're in the group!"},
			{w: 'Gross', txt: 'gross...', cor: 'grafite'},
			{w: 'sweet', txt: '...but sweet', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'coracao', w: 'sweet', x: 640, y: 430}],
	},
	// 45
	{
		gato: {x: 1000, escala: 0.65, rabo: 'alto'},
		colX: 1150,
		textos: [
			{w: 'follow', txt: 'follows you room to room'},
			{w: 'bathroom', txt: 'ESPECIALLY the bathroom', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 700, escala: 1}, {tipo: 'banheira', w: 'bathroom', x: 1600, y: 840, s: 0.7}],
	},
	// 46
	{
		gato: {x: 800, escala: 0.75, orelhas: 'frente', olhos: 'dilatado'},
		colX: 1150,
		textos: [
			{w: 'curiosity', txt: 'closed door = mystery'},
			{w: 'where', txt: 'just wants to be with you', marca: true},
		],
		extras: [{tipo: 'portaMacaneta', x: 450, y: 840}],
	},
	// 47
	{
		gato: {pose: 'dorme', x: 560},
		textos: [
			{w: 'sleeping', txt: 'sleeping on you ='},
			{w: 'vulnerable', txt: 'most vulnerable moment'},
			{w: 'chose', txt: 'and it chose YOU', marca: true},
		],
		extras: [{tipo: 'texto', x: 420, y: 660, txt: 'zzz', tam: 64, cor: 'grafite'}],
	},
	// 48
	{
		gato: {pose: 'barriga', x: 560},
		textos: [
			{w: 'belly', txt: 'belly up = deep trust', cor: 'verde'},
			{w: 'invitation', txt: 'NOT an invitation!', cor: 'vermelho'},
			{w: 'touch', txt: "look, don't touch", marca: true},
		],
		extras: [{tipo: 'xis', w: 'touch', x: 560, y: 600, s: 1.3}],
	},
	// 49
	{
		gato: {x: 470, olhos: 'dilatado', rabo: 'alto'},
		colX: 1100,
		textos: [
			{w: 'toy', txt: 'drops a toy at your feet'},
			{w: 'invitation', txt: '= "play with me!"'},
			{w: 'playmate', txt: "you're its playmate", marca: true},
		],
		extras: [{tipo: 'rato', w: 'toy', x: 800, y: 840}, {tipo: 'varinha', w: 'play', x: 1600, y: 840}],
	},
	// 50 — CAP 8
	{
		abre: true,
		textos: [
			{w: 'Oxytocin', txt: 'oxytocin', x: 1050, y: 400, tam: 80, marca: true},
			{w: 'bonding', txt: 'the bonding hormone', x: 1050, y: 500},
		],
		extras: [{tipo: 'coracao', w: 'love', x: 560, y: 600, s: 2.2}],
	},
	// 51
	{
		extras: [
			{
				tipo: 'barras',
				w: 'rise',
				x: 300,
				y: 420,
				largura: 1250,
				itens: [
					{rotulo: 'dogs', valor: 0.57, txt: '+57%'},
					{rotulo: 'cats', valor: 0.12, txt: '+12%', cor: '#7ed6a0'},
				],
			},
		],
		textos: [
			{w: '2016', txt: '2016, a TV experiment', x: 300, y: 380 - 50},
			{w: 'smaller', txt: 'cats: a smaller rise', x: 300, y: 760, marca: true},
		],
	},
	// 52
	{
		gato: {olhos: 'fenda', orelhas: 'lado', x: 470},
		colX: 1100,
		textos: [
			{w: 'Headlines', txt: '"dogs love us 5x more!"'},
			{w: 'tiny', txt: 'a tiny study', cor: 'vermelho'},
			{w: 'stressful', txt: 'in a stressful place', marca: true},
		],
		extras: [{tipo: 'jornal', w: 'Headlines', x: 860, y: 800, s: 0.8}],
	},
	// 53
	{
		gato: {olhos: 'lento'},
		textos: [
			{w: 'Japan', txt: 'newer research: Japan'},
			{w: 'oxytocin', txt: 'oxytocin goes up...'},
			{w: 'terms', txt: "...on the cat's terms", marca: true},
		],
	},
	// 54
	{
		gato: {x: 470, olhos: 'lento', muda: [{w: 'grabbed', olhos: 'dilatado', orelhas: 'lado', rabo: 'chicote'}]},
		colX: 1100,
		textos: [
			{w: 'chooses', txt: 'cat comes to you: UP', cor: 'verde'},
			{w: 'grabbed', txt: 'grabbed & held: nope', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 55
	{
		gato: {olhos: 'lento', rabo: 'gancho'},
		textos: [
			{w: 'real', txt: 'cat love is real', cor: 'verde'},
			{w: 'consent', txt: 'consent-based love', marca: true},
			{w: 'decide', txt: 'the cat decides', cor: 'grafite'},
		],
		extras: [{tipo: 'coracao', w: 'real', x: 740, y: 450}],
	},
	// 56 — CAP 9
	{
		abre: true,
		gato: {x: 470, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'First', txt: '1. let the cat come to you', marca: true},
			{w: 'hand', txt: 'offer a hand & wait'},
		],
		extras: [{tipo: 'mao', w: 'hand', x: 800, y: 700, rot: 180}],
	},
	// 57
	{
		gato: {rabo: 'alto', olhos: 'lento'},
		textos: [
			{w: 'choose', txt: 'free to choose & leave'},
			{w: 'longer', txt: '= stays longer', cor: 'verde', marca: true},
		],
	},
	// 58
	{
		gato: {x: 470, olhos: 'fechados'},
		colX: 1100,
		textos: [
			{w: 'Second', txt: '2. pet the right places', marca: true},
			{w: 'cheeks', txt: 'cheeks, chin, ears', cor: 'verde'},
			{w: 'belly', txt: 'belly & tail: careful', cor: 'vermelho'},
		],
		extras: [{tipo: 'mao', w: 'cheeks', x: 600, y: 560, acariciar: true, ate: 'belly'}],
	},
	// 59
	{
		gato: {pose: 'agachado', x: 500},
		colX: 1150,
		textos: [
			{w: 'Third', txt: '3. play every day', marca: true},
			{w: 'wand', txt: 'a wand toy hunt'},
			{w: 'trust', txt: 'builds trust'},
		],
		extras: [{tipo: 'varinha', w: 'wand', x: 900, y: 840}],
	},
	// 60
	{
		gato: {olhos: 'lento'},
		textos: [
			{w: 'Fourth', txt: '4. keep a routine', marca: true},
			{w: 'Meals', txt: 'meals, play, quiet time'},
			{w: 'safe', txt: '= feels safe', cor: 'verde'},
		],
		extras: [{tipo: 'relogio', w: 'hours', x: 1650, y: 760, txt: '7:00'}],
	},
	// 61
	{
		gato: {x: 470, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'Fifth', txt: '5. high places & hiding spots', marca: true},
			{w: 'safe', txt: 'safe cat ->'},
			{w: 'affection', txt: 'more affection', cor: 'verde'},
		],
		extras: [{tipo: 'arranhador', w: 'high', x: 850, y: 840, s: 0.8}],
	},
	// 62
	{
		gato: {x: 470, orelhas: 'frente', olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'talk', txt: 'talk & slow blink'},
			{w: 'listening', txt: 'they really listen', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'balao', w: 'talk', x: 920, y: 380, txt: 'hi, buddy', cauda: {x: 830, y: 460}, largura: 300}],
	},
	// 63
	{
		gato: {olhos: 'lento', rabo: 'gancho'},
		textos: [
			{w: 'science', txt: 'science says: YES', cor: 'verde', marca: true},
			{w: 'secure', txt: 'real, secure bonds'},
			{w: 'babies', txt: 'like babies & dogs'},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'Love? ', tam: 86, marca: true}, {tipo: 'coracao', w: 'love', x: 740, y: 450, s: 1.2}],
	},
	// 64
	{
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'blink', txt: 'a slow blink'},
			{w: 'bump', txt: 'a head bump'},
			{w: 'tail', txt: 'a raised tail'},
			{w: 'purr', txt: 'a purr'},
			{w: 'mouse', txt: '...a dead mouse', cor: 'grafite', marca: true},
		],
		extras: [{tipo: 'rato', w: 'mouse', x: 1650, y: 840}],
	},
	// 65
	{
		gato: {olhos: 'lento', x: 1560},
		textos: [
			{w: 'show', txt: 'How does your cat show love?', x: 260, y: 300, tam: 72},
			{w: 'comments', txt: 'tell me in the comments!', x: 380, y: 600, marca: true, tam: 76},
		],
		extras: [{tipo: 'seta', w: 'comments', de: {x: 330, y: 400}, para: {x: 330, y: 580}, cor: 'vermelho'}, {tipo: 'coracao', x: 1560, y: 480}],
	},
];
