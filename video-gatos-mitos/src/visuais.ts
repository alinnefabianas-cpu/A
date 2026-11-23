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

export const CAPITULOS = ['', '"Cats need milk"', '"Cats always land on their feet"', '"Purring = happy"', '"Cats don\'t love us"', '"Cats are nocturnal"', '"Cats see in total darkness"', '"All cats hate water"', '"Cats can\'t be trained"', '"Black cats are bad luck"', '"Indoor cats don\'t need play"', '"Pregnant? Give up your cat"', '"Tuna is the best food"', '"Cats must live alone"'];

const MITO = {x: 1600, y: 230};

export const VIS: Vis[] = [
	// 0
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'advice', txt: 'so much cat advice...'},
			{w: 'great', txt: 'some is great', cor: 'verde'},
			{w: 'wrong', txt: 'some is WRONG', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: '12 cat myths, debunked', tam: 84, marca: true}],
	},
	// 1
	{
		gato: {olhos: 'dilatado'},
		textos: [
			{w: 'millions', txt: 'millions still believe them'},
			{w: 'false', txt: 'science says: FALSE'},
			{w: 'hurt', txt: 'some can hurt your cat', cor: 'vermelho', marca: true},
		],
	},
	// 2
	{
		textos: [
			{w: 'busting', txt: 'busting 12 myths', x: 260, y: 400, marca: true, tam: 84},
			{w: 'true', txt: "...and what's really true", x: 260, y: 520},
		],
		extras: [
			{tipo: 'carimbo', w: 'myths', x: 1450, y: 450},
			{tipo: 'verdade', w: 'true', x: 1450, y: 650},
		],
	},
	// 3
	{
		abre: true,
		gato: {x: 420, escala: 0.9},
		colX: 1250,
		textos: [{w: 'cartoon', txt: 'the classic cartoon...'}],
		extras: [
			{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y},
			{tipo: 'leite', w: 'milk', x: 780, y: 840, s: 0.9},
		],
	},
	// 4
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'lactose', txt: 'most adult cats:'},
			{w: 'intolerant', txt: 'lactose intolerant', marca: true},
			{w: 'digest', txt: "can't digest milk sugar"},
		],
		extras: [{tipo: 'verdade', w: 'truth', x: MITO.x, y: MITO.y}],
	},
	// 5
	{
		gato: {orelhas: 'lado', olhos: 'fenda'},
		textos: [
			{w: 'upset', txt: 'upset stomach'},
			{w: 'diarrhea', txt: 'gas, diarrhea...'},
			{w: 'treat', txt: 'not a treat!', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}],
	},
	// 6
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'kittens', txt: "kittens: mom's milk"},
			{w: 'weaning', txt: 'after weaning:'},
			{w: 'water', txt: 'fresh, clean WATER', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}, {tipo: 'fonte', w: 'water', x: 1550, y: 840, s: 0.8}],
	},
	// 7
	{
		gato: {boca: 'lingua'},
		textos: [
			{w: 'lactose-free', txt: 'lactose-free cat milk exists'},
			{w: 'occasional', txt: '...as an occasional treat', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}, {tipo: 'leite', w: 'special', x: 1300, y: 840, s: 0.7}],
	},
	// 8
	{
		abre: true,
		gato: {olhos: 'dilatado'},
		textos: [
			{w: 'feet', txt: 'always lands on its feet?'},
			{w: 'righting', txt: 'righting reflex = real', cor: 'verde'},
			{w: 'twist', txt: 'twists in mid-air'},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}],
	},
	// 9
	{
		gato: {olhos: 'dilatado', orelhas: 'lado'},
		textos: [
			{w: 'time', txt: 'needs time + height'},
			{w: 'short', txt: 'short fall = no time to turn', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'time', x: MITO.x, y: MITO.y}],
	},
	// 10
	{
		gato: {rabo: 'baixo', x: 560, y: 470, escala: 0.75},
		textos: [
			{w: 'injuries', txt: 'high falls = injuries'},
			{w: 'vets', txt: 'vets see it every year'},
			{w: 'windows', txt: 'windows & balconies', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}, {tipo: 'geladeira', x: 560, topo: 470}],
	},
	// 11
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'nine', txt: 'no nine lives!', cor: 'vermelho'},
			{w: 'screens', txt: 'window screens', marca: true},
			{w: 'gifts', txt: '= the best gift', cor: 'verde'},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}],
		postit: {w: 'screens', linhas: ['screens', 'save lives'], x: 1450, y: 720},
	},
	// 12
	{
		gato: {olhos: 'lento'},
		textos: [
			{w: 'fun', txt: 'fun fact:'},
			{w: 'seven', txt: 'Spanish-speaking: 7 lives'},
			{w: 'six', txt: 'some places: only 6!', marca: true},
		],
		extras: [{tipo: 'texto', w: 'six', x: 1350, y: 760, txt: '9? 7? 6?', tam: 90, cor: 'vermelho'}],
	},
	// 13
	{
		abre: true,
		gato: {olhos: 'meio', rabo: 'enrolado'},
		textos: [{w: 'contentment', txt: 'usually = content', cor: 'verde'}],
		extras: [
			{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y},
			{tipo: 'balao', w: 'purring', x: 800, y: 450, txt: 'prrrr~', cauda: {x: 650, y: 560}},
		],
	},
	// 14
	{
		gato: {olhos: 'meio', orelhas: 'lado', rabo: 'entre'},
		textos: [
			{w: 'stressed', txt: 'stressed'},
			{w: 'injured', txt: 'injured'},
			{w: 'sick', txt: 'sick'},
			{w: 'calm', txt: 'purring to calm down', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'stressed', x: MITO.x, y: MITO.y}],
	},
	// 15
	{
		gato: {olhos: 'meio', rabo: 'entre'},
		textos: [
			{w: 'whole', txt: 'look at the WHOLE cat'},
			{w: 'hiding', txt: 'hiding? not eating?'},
			{w: 'vet', txt: '-> call the vet', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}],
	},
	// 16
	{
		gato: {olhos: 'meio', rabo: 'enrolado'},
		textos: [
			{w: 'frequencies', txt: 'low purr frequencies'},
			{w: 'heal', txt: 'might help healing?'},
			{w: 'research', txt: '(needs more research)', cor: 'grafite'},
		],
		extras: [{tipo: 'onda', w: 'frequencies', x: 690, y: 620, largura: 220}],
	},
	// 17
	{
		abre: true,
		gato: {orelhas: 'lado', olhos: 'fenda'},
		textos: [
			{w: 'cold', txt: '"cold" & distant?'},
			{w: 'unfair', txt: 'the most unfair myth', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}],
	},
	// 18
	{
		gato: {x: 470, escala: 0.9},
		colX: 1100,
		textos: [
			{w: 'study', txt: 'a 2019 study'},
			{w: 'attachment', txt: 'the attachment test'},
			{w: 'babies', txt: '(used for babies & dogs)', cor: 'grafite'},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'verdade', w: 'study', x: MITO.x, y: MITO.y}],
	},
	// 19
	{
		textos: [
			{w: 'secure', txt: 'secure attachment', x: 300, y: 640, marca: true},
			{w: 'confident', txt: 'safer & more confident with their person', x: 300, y: 740, tam: 56},
		],
		extras: [
			{tipo: 'verdade', x: MITO.x, y: MITO.y},
			{tipo: 'barras', w: 'secure', x: 300, y: 400, largura: 1250, itens: [{rotulo: 'secure', valor: 0.64, txt: '~64% of cats', cor: '#2e9e5b'}]},
		],
	},
	// 20
	{
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'blinks', txt: 'slow blinks'},
			{w: 'bumps', txt: 'head bumps'},
			{w: 'following', txt: 'following you'},
			{w: 'near', txt: 'choosing to be near you', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'near', x: 740, y: 450}],
	},
	// 21
	{
		gato: {boca: 'aberta'},
		textos: [
			{w: 'rarely', txt: 'rarely meow at cats...'},
			{w: 'made', txt: 'the meow = made for you', marca: true},
		],
		extras: [{tipo: 'balao', w: 'meow', x: 800, y: 450, txt: 'meow!', cauda: {x: 650, y: 560}}, {tipo: 'coracao', w: 'made', x: 400, y: 520, s: 0.8}],
	},
	// 22
	{
		gato: {rabo: 'alto', olhos: 'lento'},
		textos: [
			{w: 'greets', txt: 'greets you at the door'},
			{w: 'clothes', txt: 'sleeps on your clothes'},
			{w: 'gift', txt: 'brings you gifts'},
			{w: 'love', txt: '= love, cat style', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'love', x: 740, y: 450}],
	},

	// 23
	{
		abre: true,
		gato: {olhos: 'normal'},
		textos: [
			{w: 'crepuscular', txt: 'crepuscular!', marca: true},
			{w: 'dawn', txt: 'dawn'},
			{w: 'dusk', txt: 'dusk'},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}, {tipo: 'lua', w: 'nocturnal', x: 1650, y: 720}],
	},
	// 24
	{
		gato: {pose: 'correndo', x: 560},
		textos: [
			{w: 'ancestors', txt: 'ancestors hunted then'},
			{w: 'zoomies', txt: 'the zoomies!', cor: 'vermelho'},
			{w: 'evening', txt: 'at sunrise & evening', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}],
	},
	// 25
	{
		gato: {x: 480, olhos: 'dilatado'},
		colX: 1100,
		textos: [
			{w: 'play', txt: 'evening play session'},
			{w: 'energy', txt: 'burns the energy'},
			{w: 'five', txt: 'not at 5 a.m.!', marca: true},
		],
		extras: [{tipo: 'varinha', w: 'play', x: 760, y: 840}],
	},
	// 26
	{
		gato: {boca: 'lingua'},
		textos: [
			{w: 'meal', txt: 'meal after play'},
			{w: 'hunt', txt: 'hunt -> eat'},
			{w: 'groom', txt: '-> groom -> sleep', marca: true},
		],
		extras: [{tipo: 'tigela', w: 'meal', x: 1550, y: 840, s: 0.7}],
	},

	// 27
	{
		abre: true,
		textos: [
			{w: 'darkness', txt: 'complete darkness?', x: 1050, y: 400},
			{w: 'vision', txt: 'amazing night vision', x: 1050, y: 495, cor: 'verde'},
			{w: 'six', txt: '~6x less light needed', x: 1050, y: 590},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}, {tipo: 'olho', x: 560, y: 580}],
	},
	// 28
	{
		gato: {olhos: 'dilatado', bigodes: 'frente'},
		textos: [
			{w: 'total', txt: "total dark = can't see", cor: 'vermelho'},
			{w: 'whiskers', txt: 'whiskers'},
			{w: 'ears', txt: 'ears'},
			{w: 'nose', txt: 'nose', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'total', x: MITO.x, y: MITO.y}],
	},
	// 29
	{
		gato: {olhos: 'meio', x: 460, escala: 0.85},
		colX: 1150,
		textos: [
			{w: 'light', txt: 'a tiny night light'},
			{w: 'older', txt: 'helps older cats'},
			{w: 'litter', txt: 'find the litter box', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}, {tipo: 'caixaAreia', w: 'litter', x: 860, y: 840, s: 0.7}],
	},
	// 30
	{
		textos: [
			{w: 'glow', txt: 'eyes glow', x: 1050, y: 400},
			{w: 'mirror-like', txt: 'a mirror-like layer', x: 1050, y: 495},
			{w: 'magic', txt: '"magic" night vision?', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'olho', x: 560, y: 580, brilho: 'glow'}],
	},
	// 31
	{
		abre: true,
		gato: {orelhas: 'tras', olhos: 'fenda'},
		textos: [
			{w: 'soaked', txt: 'hate getting soaked?'},
			{w: 'heavy', txt: 'wet fur = heavy'},
			{w: 'dry', txt: 'slow to dry'},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}],
	},
	// 32
	{
		gato: {boca: 'lingua'},
		textos: [
			{w: 'love', txt: 'some cats LOVE water', cor: 'verde', marca: true},
			{w: 'turkish', txt: 'the Turkish Van'},
			{w: 'swimming', txt: 'famous swimmers'},
			{w: 'tap', txt: 'dripping taps!'},
		],
		extras: [{tipo: 'verdade', w: 'love', x: MITO.x, y: MITO.y}, {tipo: 'torneira', w: 'tap', x: 1640, y: 880, s: 0.8}],
	},
	// 33
	{
		gato: {orelhas: 'lado'},
		textos: [
			{w: 'hate', txt: "they don't hate water..."},
			{w: 'forced', txt: '...they hate being FORCED', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}],
	},
	// 34
	{
		gato: {olhos: 'meio', x: 420, escala: 0.8},
		textos: [
			{w: 'lukewarm', txt: 'lukewarm water'},
			{w: 'calm', txt: 'short & calm'},
			{w: 'towel', txt: 'dry well with a towel', marca: true},
		],
		extras: [{tipo: 'banheira', w: 'bathe', x: 1300, y: 840, s: 0.8}],
	},
	// 35
	{
		abre: true,
		gato: {rabo: 'alto'},
		textos: [
			{w: 'trained', txt: "can't be trained?"},
			{w: 'actually', txt: 'actually... they can!', cor: 'verde', marca: true},
			{w: 'praise', txt: '(just not for praise)', cor: 'grafite'},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}, {tipo: 'verdade', w: 'actually', x: MITO.x, y: MITO.y + 160}],
	},
	// 36
	{
		gato: {x: 470, bigodes: 'frente'},
		colX: 1100,
		textos: [
			{w: 'treats', txt: 'treats + patience'},
			{w: 'sit', txt: 'sit'},
			{w: 'high-five', txt: 'high-five'},
			{w: 'harness', txt: 'even a harness!', marca: true},
		],
		extras: [{tipo: 'mao', w: 'treats', x: 830, y: 660, rot: 180}],
	},
	// 37
	{
		gato: {orelhas: 'gira', x: 470, escala: 0.9},
		colX: 1100,
		textos: [
			{w: 'japan', txt: 'a study in Japan:'},
			{w: 'names', txt: 'they know their names', cor: 'verde'},
			{w: 'choose', txt: '...and choose when to answer', marca: true, tam: 56},
		],
		extras: [
			{tipo: 'pessoa', x: 800, escala: 1},
			{tipo: 'balao', w: 'names', x: 920, y: 380, txt: 'Luna!', cauda: {x: 830, y: 460}},
		],
	},
	// 38
	{
		gato: {rabo: 'gancho'},
		textos: [
			{w: 'positive', txt: 'positive reinforcement', marca: true},
			{w: 'reward', txt: 'reward the good', cor: 'verde'},
			{w: 'punish', txt: 'never punish', cor: 'vermelho'},
			{w: 'short', txt: 'short, fun sessions'},
		],
	},
	// 39
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'brain', txt: 'keeps the brain busy'},
			{w: 'vet', txt: 'easier vet visits'},
			{w: 'carrier', txt: '& carrier trips'},
			{w: 'stressful', txt: 'less stress!', cor: 'verde', marca: true},
		],
	},
	// 40
	{
		gato: {x: 470, orelhas: 'frente'},
		colX: 1100,
		textos: [
			{w: 'easy', txt: 'start easy:'},
			{w: 'shake', txt: 'shake the treat bag...'},
			{w: 'treat', txt: '...reward when it comes'},
			{w: 'quickly', txt: 'learned in no time', marca: true},
		],
		extras: [{tipo: 'mao', w: 'shake', x: 830, y: 660, rot: 180}],
	},

	// 41
	{
		abre: true,
		gato: {pelagem: 'preto'},
		textos: [
			{w: 'superstition', txt: 'a medieval superstition'},
			{w: 'witchcraft', txt: 'wrongly linked to witches', marca: true},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}, {tipo: 'chapeu', w: 'witchcraft', x: 1550, y: 760, s: 0.7}],
	},
	// 42
	{
		gato: {pelagem: 'preto', olhos: 'lento'},
		textos: [
			{w: 'opposite', txt: 'the opposite!'},
			{w: 'britain', txt: 'Britain'},
			{w: 'japan', txt: 'Japan'},
			{w: 'good', txt: '= GOOD luck', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'opposite', x: MITO.x, y: MITO.y}],
	},
	// 43
	{
		gato: {pelagem: 'preto', olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'personality', txt: 'same personality'},
			{w: 'love', txt: 'same love'},
			{w: 'senses', txt: 'same senses', marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}, {tipo: 'coracao', w: 'love', x: 740, y: 450}],
	},
	// 44
	{
		gato: {pelagem: 'preto', x: 480},
		colX: 1100,
		textos: [
			{w: 'shelters', txt: 'some shelters say:'},
			{w: 'adopted', txt: 'black cats wait longer'},
			{w: 'photograph', txt: '(hard to photograph)', cor: 'grafite'},
			{w: 'chance', txt: 'give them a chance!', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'chance', x: 660, y: 450}],
	},
	// 45
	{
		abre: true,
		gato: {olhos: 'meio'},
		textos: [
			{w: 'longer', txt: 'indoor = longer, safer life', cor: 'verde'},
			{w: 'hunter', txt: '...but still a hunter', marca: true},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}],
	},
	// 46
	{
		gato: {olhos: 'meio', escala: 1.25},
		textos: [
			{w: 'bored', txt: 'bored'},
			{w: 'stressed', txt: 'stressed'},
			{w: 'overweight', txt: 'overweight', cor: 'vermelho'},
			{w: 'half', txt: '> half of pet cats!', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'bored', x: MITO.x, y: MITO.y}, {tipo: 'balanca', w: 'overweight', x: 1550, y: 860, s: 0.8, peso: 'oops'}],
	},
	// 47
	{
		gato: {x: 470, olhos: 'dilatado'},
		colX: 1100,
		textos: [
			{w: 'ten', txt: '10 to 15 minutes'},
			{w: 'couple', txt: 'a couple of times a day'},
			{w: 'difference', txt: '= a big difference', marca: true},
		],
		extras: [{tipo: 'varinha', w: 'ten', x: 760, y: 840}],
	},
	// 48
	{
		gato: {pose: 'agachado', x: 480},
		colX: 1100,
		textos: [
			{w: 'toys', txt: 'toys that move like prey'},
			{w: 'catch', txt: 'let it catch at the end'},
			{w: 'climb', txt: 'shelves & cat trees', marca: true},
		],
		extras: [{tipo: 'rato', w: 'prey', x: 840, y: 840}, {tipo: 'arranhador', w: 'climb', x: 1720, y: 860, s: 0.8}],
	},
	// 49
	{
		gato: {x: 470, bigodes: 'frente'},
		colX: 1100,
		textos: [
			{w: 'puzzle', txt: 'puzzle feeders'},
			{w: 'work', txt: 'work for the food'},
			{w: 'hunting', txt: '= just like hunting', marca: true},
		],
		extras: [{tipo: 'tigela', w: 'puzzle', x: 850, y: 840, s: 0.7}],
	},
	// 50
	{
		gato: {x: 560, escala: 0.62},
		textos: [
			{w: 'cardboard', txt: 'a cardboard box'},
			{w: 'paper', txt: 'a paper bag'},
			{w: 'adventure', txt: '= a new adventure'},
			{w: 'expensive', txt: "fun doesn't have to cost much", marca: true, tam: 56},
		],
		extras: [{tipo: 'fresta', w: 'cardboard', x: 560, y: 840}],
	},

	// 51
	{
		abre: true,
		gato: {olhos: 'meio'},
		textos: [
			{w: 'pregnant', txt: 'pregnant?'},
			{w: 'toxoplasmosis', txt: 'the worry: toxoplasmosis'},
			{w: 'dangerous', txt: 'risky during pregnancy', marca: true},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}],
	},
	// 52
	{
		gato: {olhos: 'normal'},
		textos: [
			{w: 'feces', txt: 'cats: through feces...'},
			{w: 'likely', txt: 'more common sources:'},
			{w: 'undercooked', txt: 'undercooked meat'},
			{w: 'soil', txt: 'garden soil', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'feces', x: MITO.x, y: MITO.y}],
	},
	// 53
	{
		textos: [
			{w: 'precautions', txt: 'simple precautions:', x: 1050, y: 400},
			{w: 'litter', txt: 'someone else cleans the litter', x: 1050, y: 495, tam: 56},
			{w: 'gloves', txt: 'or gloves + wash hands', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}, {tipo: 'caixaAreia', x: 520, y: 840, luvas: true}],
	},
	// 54
	{
		gato: {rabo: 'alto', x: 470},
		colX: 1100,
		textos: [
			{w: 'indoors', txt: 'keep your cat indoors'},
			{w: 'vegetables', txt: 'wash fruit & veggies'},
			{w: 'give', txt: 'no need to give up your cat', cor: 'verde', marca: true, tam: 56},
			{w: 'doctor', txt: 'talk to your doctor'},
		],
		extras: [{tipo: 'pessoa', x: 800, escala: 1}, {tipo: 'coracao', w: 'give', x: 640, y: 420}],
	},
	// 55
	{
		abre: true,
		gato: {x: 400, escala: 0.75},
		colX: 1100,
		textos: [
			{w: 'tuna', txt: 'tuna = the best?'},
			{w: 'smell', txt: 'cats love the smell...'},
			{w: 'desert', txt: '...but desert cats rarely ate fish', tam: 54},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}, {tipo: 'lata', w: 'tuna', x: 760, y: 840}],
	},
	// 56
	{
		textos: [
			{w: 'balanced', txt: 'not a balanced diet', x: 1050, y: 440},
			{w: 'health', txt: 'too much = health problems', x: 1050, y: 540, cor: 'vermelho', marca: true},
		],
		extras: [
			{tipo: 'verdade', w: 'tuna', x: MITO.x, y: MITO.y},
			{tipo: 'lata', x: 560, y: 800, s: 1.3},
			{tipo: 'xis', w: 'balanced', x: 560, y: 600, s: 1.6},
		],
	},
	// 57
	{
		gato: {boca: 'lingua'},
		textos: [
			{w: 'complete', txt: 'complete cat food', cor: 'verde', marca: true},
			{w: 'treat', txt: 'tuna = a tiny treat'},
			{w: 'meal', txt: 'not a meal'},
		],
		extras: [{tipo: 'verdade', x: MITO.x, y: MITO.y}],
	},
	// 58
	{
		gato: {orelhas: 'lado'},
		textos: [
			{w: 'onions', txt: 'onions & garlic'},
			{w: 'chocolate', txt: 'chocolate & alcohol'},
			{w: 'toxic', txt: '= toxic!', cor: 'vermelho'},
			{w: 'lilies', txt: 'lilies: VERY dangerous', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'lirio', w: 'lilies', x: 1650, y: 860, s: 0.8}],
	},
	// 59
	{
		abre: true,
		gatos: [{x: 420, escala: 0.65}, {x: 720, escala: 0.65, w: 'groups', rabo: 'alto'}],
		colX: 1100,
		textos: [
			{w: 'solitary', txt: 'solitary loners?'},
			{w: 'groups', txt: 'many live in friendly groups', cor: 'verde', marca: true, tam: 56},
		],
		extras: [{tipo: 'carimbo', w: 'myth', x: MITO.x, y: MITO.y}],
	},
	// 60
	{
		gatos: [{x: 360, escala: 0.6}, {x: 600, escala: 0.6, pelagem: 'selvagem'}, {x: 830, escala: 0.38, w: 'kittens'}],
		colX: 1100,
		textos: [
			{w: 'colonies', txt: 'feral colonies'},
			{w: 'share', txt: 'share food'},
			{w: 'kittens', txt: 'help raise kittens'},
			{w: 'different', txt: 'every cat is different', marca: true},
		],
		extras: [{tipo: 'verdade', w: 'colonies', x: MITO.x, y: MITO.y}],
	},
	// 61
	{
		gato: {olhos: 'lento'},
		textos: [
			{w: 'milk', txt: 'no milk'},
			{w: 'screens', txt: 'window screens'},
			{w: 'whole', txt: 'read the whole cat'},
			{w: 'love', txt: 'your cat loves you', marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'Recap', tam: 86, marca: true}],
	},
	// 62
	{
		gato: {pelagem: 'preto', olhos: 'lento'},
		textos: [
			{w: 'play', txt: 'play every day'},
			{w: 'train', txt: 'train with treats'},
			{w: 'tuna', txt: 'tuna = a snack'},
			{w: 'black', txt: 'black cats = lucky', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'Recap', tam: 86, marca: true}],
	},
	// 63
	{
		gato: {olhos: 'lento', x: 1560},
		textos: [
			{w: 'believe', txt: 'Which myth did YOU believe?', x: 260, y: 300, tam: 72},
			{w: 'comments', txt: 'be honest in the comments!', x: 380, y: 600, marca: true, tam: 76},
		],
		extras: [{tipo: 'seta', w: 'comments', de: {x: 330, y: 400}, para: {x: 330, y: 580}, cor: 'vermelho'}],
	},
];
