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

export const CAPITULOS = ['', 'The cat brain', 'Memory', 'The cat physicist', 'Can cats count?', 'Reading people', 'Words & names', 'The mental map', 'Why cats seem "dumb"', 'Keep the brain sharp'];

export const VIS: Vis[] = [
	// 0
	{
		gato: {olhos: 'meio', x: 560},
		textos: [
			{w: 'genius', txt: 'a secret genius?'},
			{w: 'independent', txt: '"too independent"?'},
			{w: 'surprising', txt: 'science says... surprise!', marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'How smart is your cat?', tam: 84, marca: true}, {tipo: 'capelo', w: 'genius', x: 560, y: 520, s: 0.8}],
	},
	// 1
	{
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'remember', txt: 'remember'},
			{w: 'count', txt: 'count'},
			{w: 'faces', txt: 'read faces'},
			{w: 'names', txt: "learn each other's names", marca: true},
		],
	},
	// 2
	{
		textos: [
			{w: 'smart', txt: 'how smart?', x: 1050, y: 420, marca: true, tam: 80},
			{w: 'head', txt: "inside that furry head", x: 1050, y: 530},
		],
		extras: [{tipo: 'cerebro', w: 'inside', x: 560, y: 560, brilha: true}],
	},
	// 3 — CAP 1
	{
		abre: true,
		textos: [
			{w: 'thirty', txt: '~30 grams', x: 1050, y: 420},
			{w: 'percent', txt: '< 1% of body weight', x: 1050, y: 520, marca: true},
		],
		extras: [{tipo: 'cerebro', x: 560, y: 560}],
	},
	// 4
	{
		textos: [
			{w: 'size', txt: "size isn't everything", x: 1050, y: 400},
			{w: 'cortex', txt: 'the cortex = thinking', x: 1050, y: 495},
			{w: 'neurons', txt: 'count the neurons', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'cerebro', x: 560, y: 560}, {tipo: 'circulo', w: 'cortex', x: 560, y: 520, rx: 190, ry: 110}],
	},
	// 5
	{
		extras: [
			{
				tipo: 'barras',
				w: 'fifty',
				x: 300,
				y: 380,
				largura: 1250,
				itens: [
					{rotulo: 'cat', valor: 0.25 / 16, txt: '~250 million'},
					{rotulo: 'dog', valor: 0.53 / 16, txt: '~530 million'},
					{rotulo: 'human', valor: 1, txt: '~16 billion', cor: '#ffe45c'},
				],
			},
		],
		textos: [{w: 'neurons', txt: 'neurons in the cortex', x: 300, y: 780, marca: true}],
	},
	// 6
	{
		gato: {pose: 'agachado', x: 520},
		colX: 1150,
		textos: [
			{w: 'wired', txt: 'wired for:'},
			{w: 'hunting', txt: 'hunting'},
			{w: 'problem', txt: 'problem solving'},
			{w: 'attention', txt: 'paying attention', marca: true},
		],
	},
	// 7
	{
		gato: {olhos: 'dilatado', orelhas: 'frente', bigodes: 'frente'},
		textos: [
			{w: 'vision', txt: 'vision'},
			{w: 'hearing', txt: 'hearing'},
			{w: 'developed', txt: 'super developed'},
			{w: 'machine', txt: 'a precision hunting machine', marca: true, tam: 56},
		],
	},
	// 8
	{
		gato: {pose: 'dorme', x: 560},
		textos: [
			{w: 'sleep', txt: 'lots of sleep...'},
			{w: 'store', txt: 'helps store memories'},
			{w: 'naps', txt: 'naps = part of the plan', marca: true},
		],
		extras: [{tipo: 'texto', x: 420, y: 660, txt: 'zzz', tam: 64, cor: 'grafite'}],
	},
	// 9 — CAP 2
	{
		abre: true,
		gato: {olhos: 'lento'},
		textos: [
			{w: 'long-term', txt: 'good long-term memory'},
			{w: 'people', txt: 'people'},
			{w: 'places', txt: 'places'},
			{w: 'routines', txt: 'routines, for years', marca: true},
		],
	},
	// 10
	{
		gato: {x: 460, escala: 0.85},
		colX: 1150,
		textos: [
			{w: 'cupboard', txt: 'the treat cupboard'},
			{w: 'carrier', txt: 'the carrier = hide!'},
			{w: 'memory', txt: 'memory at work', marca: true},
		],
		extras: [{tipo: 'transportadora', w: 'carrier', x: 860, y: 840, s: 0.8}],
	},
	// 11
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'working', txt: 'working memory: shorter'},
			{w: 'hidden', txt: 'where it was hidden...'},
			{w: 'minute', txt: '...up to ~1 minute', marca: true},
		],
		extras: [{tipo: 'relogio', w: 'minute', x: 1600, y: 720, txt: '1:00'}],
	},
	// 12
	{
		gato: {olhos: 'dilatado', muda: [{w: 'forgotten', olhos: 'meio'}]},
		textos: [
			{w: 'distracting', txt: 'distraction works!'},
			{w: 'toy', txt: 'new toy...'},
			{w: 'forgotten', txt: '...old one forgotten', marca: true},
		],
		extras: [{tipo: 'rato', w: 'toy', x: 880, y: 840}],
	},
	// 13
	{
		textos: [
			{w: 'episodic-like', txt: 'episodic-like memory', x: 300, y: 380, marca: true},
			{w: 'bowls', txt: 'which bowls were eaten from', x: 300, y: 475},
			{w: 'food', txt: 'which ones still had food', x: 300, y: 570},
		],
		extras: [
			{tipo: 'tigela', w: 'bowls', x: 1200, y: 800, s: 0.6},
			{tipo: 'tigela', w: 'bowls', x: 1500, y: 800, s: 0.6},
			{tipo: 'xis', w: 'eaten', x: 1200, y: 660, s: 0.8},
			{tipo: 'check', w: 'food', x: 1500, y: 660},
		],
	},
	// 14
	{
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'what', txt: 'WHAT happened'},
			{w: 'where', txt: 'WHERE'},
			{w: 'when', txt: 'and maybe WHEN', marca: true},
		],
	},
	// 15
	{
		gato: {rabo: 'entre', orelhas: 'lado', olhos: 'dilatado', x: 460, escala: 0.85},
		colX: 1150,
		textos: [
			{w: 'bad', txt: 'remembers bad things too'},
			{w: 'vet', txt: 'scary vet visit...'},
			{w: 'keys', txt: '...car keys = hide!', marca: true},
		],
		extras: [{tipo: 'chaves', w: 'keys', x: 860, y: 600}],
	},
	// 16 — CAP 3
	{
		abre: true,
		textos: [
			{w: 'pillow', txt: 'toy behind a pillow', x: 1050, y: 400},
			{w: 'exists', txt: 'it still exists!', x: 1050, y: 495},
			{w: 'permanence', txt: 'object permanence', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'travesseiro', x: 560, y: 760, s: 1.2, revela: 'exists'}],
	},
	// 17
	{
		gato: {pose: 'agachado', x: 500},
		colX: 1150,
		textos: [
			{w: 'babies', txt: 'babies: ~8-12 months'},
			{w: 'kittens', txt: 'cats: as kittens'},
			{w: 'track', txt: 'tracking hidden prey', marca: true},
		],
		extras: [{tipo: 'folhas', w: 'bush', x: 900, y: 840, s: 0.8}],
	},
	// 18
	{
		gato: {x: 460, escala: 0.85, orelhas: 'frente'},
		colX: 1150,
		textos: [
			{w: 'physics', txt: 'a bit of physics'},
			{w: 'japanese', txt: 'a Japanese study'},
			{w: 'rattling', txt: 'a rattling container...'},
			{w: 'tipped', txt: '...tipped over', marca: true},
		],
		extras: [{tipo: 'pote', w: 'container', x: 870, y: 840, s: 0.8, vira: 'tipped'}],
	},
	// 19
	{
		gato: {x: 460, escala: 0.85, olhos: 'dilatado'},
		colX: 1150,
		textos: [
			{w: 'nothing', txt: 'nothing fell out?!'},
			{w: 'stared', txt: 'cats stared longer'},
			{w: 'expected', txt: 'they EXPECTED a drop', marca: true},
		],
		extras: [{tipo: 'pote', x: 870, y: 840, s: 0.8, vira: 'nothing'}, {tipo: 'texto', w: 'stared', x: 560, y: 470, txt: '?!', tam: 90, cor: 'vermelho'}],
	},
	// 20
	{
		gato: {pose: 'agachado', x: 500},
		colX: 1150,
		textos: [
			{w: 'sound', txt: 'sound -> prediction'},
			{w: 'hidden', txt: "what's hidden inside"},
			{w: 'mouse', txt: 'a mouse in the grass', marca: true},
		],
		extras: [{tipo: 'folhas', w: 'mouse', x: 900, y: 840, s: 0.8}],
	},
	// 21
	{
		gato: {olhos: 'dilatado', boca: 'aberta'},
		textos: [
			{w: 'bag', txt: 'which bag has treats?'},
			{w: 'sound', txt: 'known by the sound!', marca: true},
		],
		extras: [{tipo: 'balao', w: 'treats', x: 800, y: 450, txt: 'shake shake', cauda: {x: 650, y: 560}, largura: 320}],
	},
	// 22
	{
		gato: {x: 900, y: 600, escala: 0.6},
		colX: 1150,
		textos: [
			{w: 'doors', txt: 'opening doors'},
			{w: 'handle', txt: 'jumping on the handle'},
			{w: 'watching', txt: 'learned by watching', marca: true},
		],
		extras: [{tipo: 'portaMacaneta', x: 560, y: 840}],
	},
	// 23
	{
		gato: {x: 470, olhos: 'dilatado', orelhas: 'frente'},
		colX: 1100,
		textos: [
			{w: 'taps', txt: 'turning on taps'},
			{w: 'drawers', txt: 'opening drawers'},
			{w: 'experiment', txt: 'watch -> experiment'},
			{w: 'remember', txt: '-> remember what worked', marca: true},
		],
		extras: [{tipo: 'torneira', w: 'taps', x: 880, y: 880, s: 0.9}, {tipo: 'texto', w: 'crows', x: 1100, y: 760, txt: 'like crows & monkeys!', tam: 56, cor: 'verde'}],
	},
	// 24 — CAP 4
	{
		abre: true,
		gato: {olhos: 'meio'},
		textos: [
			{w: 'count', txt: 'counting like us? no.'},
			{w: 'amounts', txt: 'small amounts? yes!', cor: 'verde', marca: true},
		],
	},
	// 25
	{
		textos: [
			{w: 'two', txt: 'two or three?', x: 1250, y: 420},
			{w: 'correctly', txt: 'chose correctly', x: 1250, y: 515, cor: 'verde'},
			{w: 'size', txt: 'even when dots changed size', x: 1250, y: 610, marca: true, tam: 52},
		],
		extras: [
			{tipo: 'pontos', w: 'two', x: 480, y: 560, n: 2},
			{tipo: 'pontos', w: 'three', x: 860, y: 560, n: 3, grande: true},
		],
	},
	// 26
	{
		gato: {pose: 'agachado', x: 500},
		colX: 1150,
		textos: [
			{w: 'wild', txt: 'useful in the wild:'},
			{w: 'prey', txt: 'the bigger group of prey'},
			{w: 'rivals', txt: 'avoid more rivals', marca: true},
		],
	},
	// 27
	{
		gato: {olhos: 'fenda', orelhas: 'lado', muda: [{w: 'actually', olhos: 'encarando'}]},
		textos: [
			{w: 'scoops', txt: '2 scoops instead of 3?'},
			{w: 'actually', txt: '...it notices.', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'tigela', w: 'scoops', x: 1550, y: 840, s: 0.7}],
	},
	// 28
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'exactly', txt: 'how far does it go?'},
			{w: 'hard', txt: 'testing cats is hard'},
			{w: 'small', txt: 'small studies', marca: true},
		],
	},
	// 29 — CAP 5
	{
		abre: true,
		gato: {x: 470, olhos: 'normal'},
		colX: 1100,
		textos: [
			{w: 'understanding', txt: 'cats understand humans'},
			{w: 'credit', txt: 'more than we think', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 30
	{
		gato: {x: 470, olhos: 'dilatado'},
		colX: 1150,
		textos: [
			{w: 'pointing', txt: 'follows pointing'},
			{w: 'hidden', txt: 'finds hidden food'},
			{w: 'dogs', txt: 'almost as well as dogs!', marca: true},
		],
		extras: [{tipo: 'mao', w: 'pointing', x: 960, y: 560, rot: 160}, {tipo: 'tigela', w: 'hidden', x: 850, y: 840, s: 0.6}],
	},
	// 31
	{
		gato: {x: 470, olhos: 'dilatado', orelhas: 'lado'},
		colX: 1100,
		textos: [
			{w: 'social', txt: 'social referencing'},
			{w: 'scary', txt: 'something new & scary...'},
			{w: 'owner', txt: '...look at the owner', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'seta', w: 'owner', de: {x: 560, y: 560}, para: {x: 740, y: 500}, cor: 'vermelho'}],
	},
	// 32
	{
		gato: {x: 470, muda: [{w: 'scared', orelhas: 'lado', olhos: 'dilatado', rabo: 'entre'}], olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'calm', txt: 'owner calm -> cat relaxes', cor: 'verde'},
			{w: 'scared', txt: 'owner scared -> cat cautious', cor: 'vermelho'},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 33
	{
		gato: {x: 470, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'smiling', txt: 'smiling vs frowning'},
			{w: 'affectionate', txt: 'more affectionate', marca: true},
			{w: 'happy', txt: 'when you look happy'},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'coracao', w: 'affectionate', x: 620, y: 440}],
	},
	// 34
	{
		textos: [
			{w: 'food', txt: 'food', x: 300, y: 400},
			{w: 'toys', txt: 'toys', x: 300, y: 495},
			{w: 'scents', txt: 'scents', x: 300, y: 590},
			{w: 'attention', txt: 'human attention', x: 300, y: 685, marca: true, cor: 'verde'},
		],
		extras: [
			{tipo: 'check', w: 'attention', x: 760, y: 665, s: 1.2},
			{tipo: 'texto', w: 'attention', x: 900, y: 690, txt: '<- picked first by many!', tam: 60, cor: 'verde'},
			{tipo: 'pessoa', w: 'attention', x: 1550, escala: 0.9},
		],
	},
	// 35
	{
		gato: {olhos: 'meio', rabo: 'enrolado'},
		textos: [
			{w: 'paying', txt: 'always paying attention...'},
			{w: 'see', txt: "...more than it shows", marca: true},
		],
	},
	// 36
	{
		gato: {olhos: 'normal', rabo: 'alto'},
		textos: [
			{w: 'schedule', txt: 'learns your schedule:'},
			{w: 'wake', txt: 'wake-up time'},
			{w: 'home', txt: 'coming home'},
			{w: 'feed', txt: 'dinner time!', marca: true},
		],
		extras: [{tipo: 'relogio', w: 'feed', x: 1650, y: 720, txt: '6:00'}],
	},
	// 37 — CAP 6
	{
		abre: true,
		gato: {orelhas: 'gira', x: 470},
		colX: 1100,
		textos: [
			{w: 'recognize', txt: 'knows its own name'},
			{w: 'stranger', txt: 'even from a stranger', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'balao', w: 'name', x: 920, y: 380, txt: 'Mochi!', cauda: {x: 830, y: 460}}],
	},
	// 38
	{
		gatos: [{x: 360, escala: 0.65}, {x: 650, escala: 0.65, pelagem: 'preto', w: 'feline'}],
		colX: 1050,
		textos: [
			{w: 'further', txt: '2022 study:'},
			{w: 'feline', txt: 'cats know the names...'},
			{w: 'housemates', txt: '...of their cat housemates', marca: true},
		],
	},
	// 39
	{
		gato: {x: 420, escala: 0.75, olhos: 'dilatado'},
		colX: 1250,
		textos: [
			{w: 'heard', txt: 'hears "Luna"...'},
			{w: 'photo', txt: '...sees a different cat'},
			{w: 'surprised', txt: 'stares: surprised!', marca: true},
		],
		extras: [{tipo: 'tela', w: 'photo', x: 860, y: 560, preto: true}, {tipo: 'texto', w: 'surprised', x: 420, y: 480, txt: '?!', tam: 90, cor: 'vermelho'}],
	},
	// 40
	{
		gato: {x: 470, orelhas: 'frente', olhos: 'dilatado'},
		colX: 1100,
		textos: [
			{w: 'react', txt: 'reacts more to...'},
			{w: 'high-pitched', txt: 'the high-pitched pet voice', marca: true, tam: 56},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'balao', w: 'voice', x: 920, y: 380, txt: 'who\'s a cutie?', cauda: {x: 830, y: 460}, largura: 360}],
	},
	// 41
	{
		gato: {x: 470, olhos: 'meio'},
		colX: 1100,
		textos: [
			{w: 'owner', txt: 'owner: YES', cor: 'verde'},
			{w: 'stranger', txt: 'stranger: meh', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}],
	},
	// 42
	{
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'silly', txt: 'that silly voice...'},
			{w: 'means', txt: '...means something!', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'means', x: 740, y: 450}],
	},
	// 43
	{
		gato: {orelhas: 'gira', olhos: 'dilatado'},
		textos: [
			{w: 'routine', txt: 'routine words:'},
			{w: 'treat', txt: '"treat", "dinner"...'},
			{w: 'spell', txt: 'owners spell: V-E-T', marca: true},
		],
	},
	// 44 — CAP 7
	{
		abre: true,
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'track', txt: 'tracks where you are'},
			{w: 'see', txt: "even when it can't see you", marca: true},
		],
	},
	// 45
	{
		gato: {x: 560, orelhas: 'gira', escala: 0.85},
		textos: [
			{w: 'speaker', txt: "owner's voice: speaker 1"},
			{w: 'suddenly', txt: 'suddenly: speaker 2!', marca: true},
		],
		extras: [
			{tipo: 'altoFalante', x: 260, y: 840, s: 0.8, fala: 'voice'},
			{tipo: 'altoFalante', w: 'another', x: 1700, y: 840, s: 0.8, fala: 'suddenly'},
		],
	},
	// 46
	{
		gato: {olhos: 'dilatado', orelhas: 'frente'},
		textos: [
			{w: 'surprised', txt: 'surprised!'},
			{w: 'teleported', txt: 'did my human teleport?!', marca: true},
			{w: 'picturing', txt: '= picturing where you are'},
		],
	},
	// 47
	{
		gato: {olhos: 'lento'},
		textos: [
			{w: 'human', txt: 'once thought: humans only'},
			{w: 'map', txt: 'a map of home... and you', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'map', x: 740, y: 450}],
	},
	// 48
	{
		gato: {olhos: 'dilatado', bigodes: 'frente'},
		textos: [
			{w: 'mental', txt: 'the mental map helps...'},
			{w: 'confidently', txt: 'move confidently'},
			{w: 'dark', txt: 'even in the dark', marca: true},
		],
		extras: [{tipo: 'lua', w: 'dark', x: 1650, y: 720}],
	},
	// 49
	{
		gato: {pose: 'dorme', x: 560},
		textos: [
			{w: 'time', txt: 'the map includes TIME'},
			{w: 'morning', txt: 'morning: sunny spot #1'},
			{w: 'afternoon', txt: 'afternoon: window #2'},
			{w: 'smart', txt: 'lazy? no: a smart schedule', marca: true},
		],
		extras: [{tipo: 'janela', w: 'window', x: 1700, y: 790}],
	},
	// 50 — CAP 8
	{
		abre: true,
		textos: [
			{w: 'dogs', txt: 'less smart than dogs?', x: 1050, y: 400},
			{w: 'terrible', txt: 'nope: terrible test takers', x: 1050, y: 495, marca: true},
		],
		extras: [{tipo: 'prova', w: 'test', x: 560, y: 650}],
	},
	// 51
	{
		gato: {pose: 'dorme', x: 560},
		textos: [
			{w: 'hardest', txt: 'hardest part of the study:'},
			{w: 'show', txt: 'getting the cat to show up', marca: true},
			{w: 'refuse', txt: 'many just refuse', cor: 'vermelho'},
		],
	},
	// 52
	{
		gatos: [{x: 700, escala: 0.7, pose: 'agachado'}],
		colX: 1150,
		textos: [
			{w: 'bred', txt: 'dogs: bred to work with us'},
			{w: 'own', txt: 'cats: hunted on their own', marca: true},
		],
	},
	// 53
	{
		gato: {olhos: 'meio', rabo: 'enrolado'},
		textos: [
			{w: 'ignoring', txt: 'ignoring you...'},
			{w: 'perfectly', txt: '...understood perfectly'},
			{w: 'better', txt: 'had better things to do', marca: true},
		],
	},
	// 54
	{
		gato: {pose: 'agachado', x: 500},
		colX: 1150,
		textos: [
			{w: 'independent', txt: 'independent intelligence', marca: true},
			{w: 'alone', txt: 'solving problems alone'},
			{w: 'pleasing', txt: 'not for pleasing us', cor: 'grafite'},
		],
	},
	// 55
	{
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'home', txt: 'tested at home'},
			{w: 'safe', txt: 'safe & relaxed'},
			{w: 'relaxed', txt: '= better results', cor: 'verde', marca: true},
		],
	},
	// 56 — CAP 9
	{
		abre: true,
		gato: {olhos: 'meio', orelhas: 'lado'},
		textos: [
			{w: 'bored', txt: 'a bored brain ->'},
			{w: 'stress', txt: 'stress'},
			{w: 'overeating', txt: 'overeating'},
			{w: 'behavior', txt: 'bad behavior', cor: 'vermelho', marca: true},
		],
	},
	// 57
	{
		gato: {x: 470, bigodes: 'frente'},
		colX: 1100,
		textos: [
			{w: 'puzzle', txt: 'puzzle feeders', marca: true},
			{w: 'think', txt: 'think + work for food'},
			{w: 'hunting', txt: '= like hunting'},
		],
		extras: [{tipo: 'tigela', w: 'puzzle', x: 850, y: 840, s: 0.7}],
	},
	// 58
	{
		gato: {olhos: 'dilatado'},
		textos: [
			{w: 'rotate', txt: 'rotate toys', marca: true},
			{w: 'exciting', txt: 'new = exciting'},
			{w: 'break', txt: 'old toys feel new again'},
		],
		extras: [{tipo: 'rato', w: 'rotate', x: 860, y: 840}, {tipo: 'varinha', w: 'exciting', x: 1550, y: 840}],
	},
	// 59
	{
		gato: {x: 470, rabo: 'gancho'},
		colX: 1100,
		textos: [
			{w: 'clicker', txt: 'clicker training', marca: true},
			{w: 'sit', txt: 'sit, high-five'},
			{w: 'spin', txt: 'spin'},
			{w: 'bell', txt: 'ring a bell!'},
		],
		extras: [{tipo: 'clicker', w: 'clicker', x: 820, y: 640, s: 0.8}, {tipo: 'sino', w: 'bell', x: 1650, y: 800, s: 0.6}],
	},
	// 60
	{
		gato: {x: 420, escala: 0.8, olhos: 'dilatado'},
		colX: 1250,
		textos: [
			{w: 'window', txt: 'window perches', marca: true},
			{w: 'birds', txt: 'birds & people'},
			{w: 'television', txt: '= cat TV'},
		],
		extras: [{tipo: 'janela', w: 'window', x: 880, y: 560}],
	},
	// 61
	{
		gato: {bigodes: 'frente'},
		textos: [
			{w: 'hide', txt: 'hide treats around'},
			{w: 'nose', txt: 'nose on!'},
			{w: 'treasure', txt: 'a treasure hunt', marca: true},
		],
		extras: [{tipo: 'texto', w: 'treasure', x: 1550, y: 760, txt: 'X', tam: 120, cor: 'vermelho'}],
	},
	// 62
	{
		gato: {x: 470, orelhas: 'frente', olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'talking', txt: 'keep talking to your cat'},
			{w: 'listen', txt: 'they really listen', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'coracao', w: 'listen', x: 620, y: 440}],
	},
	// 63
	{
		gato: {rabo: 'alto', olhos: 'lento'},
		textos: [
			{w: 'five', txt: 'just 5 minutes a day'},
			{w: 'training', txt: 'training or play'},
			{w: 'happiness', txt: '= a happier cat', cor: 'verde', marca: true},
		],
	},
	// 64
	{
		gato: {olhos: 'lento', rabo: 'gancho'},
		textos: [
			{w: 'science', txt: 'science says: YES', cor: 'verde', marca: true},
			{w: 'independent', txt: 'independent'},
			{w: 'observant', txt: 'observant'},
			{w: 'treat', txt: 'ahead of the treat bag'},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'Smart? ', tam: 86, marca: true}, {tipo: 'capelo', w: 'science', x: 560, y: 520, s: 0.8}],
	},
	// 65
	{
		gato: {olhos: 'meio', rabo: 'enrolado'},
		textos: [
			{w: 'face', txt: 'reading your face'},
			{w: 'routine', txt: 'remembering your routine'},
			{w: 'track', txt: 'tracking where you are'},
			{w: 'pretending', txt: '...pretending not to care', marca: true},
		],
	},
	// 66
	{
		gato: {olhos: 'lento', x: 1560},
		textos: [
			{w: 'smartest', txt: "Your cat's smartest moment?", x: 260, y: 300, tam: 72},
			{w: 'comments', txt: 'tell me in the comments!', x: 380, y: 600, marca: true, tam: 76},
		],
		extras: [{tipo: 'seta', w: 'comments', de: {x: 330, y: 400}, para: {x: 330, y: 580}, cor: 'vermelho'}, {tipo: 'capelo', x: 1560, y: 500, s: 0.6}],
	},
];
