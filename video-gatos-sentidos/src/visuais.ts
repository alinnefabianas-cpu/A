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

export const CAPITULOS = ['', 'Vision', 'Hearing', 'Smell', 'Whiskers', 'Taste', 'Touch & paws', 'Balance', 'The internal clock', 'Use it at home'];

export const VIS: Vis[] = [
	// 0
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'different', txt: 'a different world'},
			{w: 'sees', txt: 'sees...'},
			{w: 'hears', txt: 'hears...'},
			{w: 'smells', txt: 'smells...', marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'How cats sense the world', tam: 84, marca: true}],
	},
	// 1
	{
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'superpowers', txt: 'some senses = superpowers', cor: 'verde'},
			{w: 'weak', txt: 'others = surprisingly weak', cor: 'vermelho'},
			{w: 'strange', txt: 'explains strange behavior', marca: true},
		],
	},
	// 2
	{
		gato: {olhos: 'lento', rabo: 'enrolado'},
		textos: [
			{w: 'see', txt: 'see'},
			{w: 'hear', txt: 'hear'},
			{w: 'smell', txt: 'smell'},
			{w: 'feel', txt: 'feel', marca: true},
		],
		postit: {w: 'head', linhas: ["inside your", "cat's head"], x: 1450, y: 700},
	},
	// 3 — CAP 1
	{
		abre: true,
		textos: [
			{w: 'eyes', txt: 'the eyes', x: 1050, y: 450},
			{w: 'impressive', txt: 'the most impressive part', x: 1050, y: 550, marca: true},
		],
		extras: [{tipo: 'olho', x: 560, y: 580}],
	},
	// 4
	{
		gato: {olhos: 'dilatado'},
		textos: [
			{w: 'six', txt: 'needs ~6x less light'},
			{w: 'dimmer', txt: 'than we do'},
			{w: 'dark', txt: 'walks in the dark', marca: true},
		],
		extras: [{tipo: 'lua', w: 'dark', x: 1650, y: 720}],
	},
	// 5
	{
		textos: [
			{w: 'mirror', txt: 'a mirror layer', x: 1050, y: 360},
			{w: 'tapetum', txt: 'tapetum lucidum', x: 1050, y: 455, marca: true},
			{w: 'bounces', txt: 'bounces light back', x: 1050, y: 550},
			{w: 'second', txt: '= a second chance to see', x: 1050, y: 645, cor: 'verde'},
		],
		extras: [{tipo: 'olho', x: 560, y: 580, brilho: 'bounces'}],
	},
	// 6
	{
		textos: [
			{w: 'glow', txt: 'eyes glow in the dark', x: 1050, y: 400},
			{w: 'magic', txt: 'not magic...', x: 1050, y: 495},
			{w: 'booster', txt: 'a built-in light booster', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'olho', x: 560, y: 580, brilho: 'glow'}],
	},
	// 7
	{
		colX: 1250,
		textos: [
			{w: 'price', txt: 'the price: colors', cor: 'vermelho'},
			{w: 'blues', txt: 'blues & greens: OK', cor: 'verde'},
			{w: 'reds', txt: 'reds: dull & grayish', marca: true},
		],
		extras: [{tipo: 'cores', w: 'colors', x: 400, y: 380}],
	},
	// 8
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'red', txt: 'your bright red toy...'},
			{w: 'boring', txt: '...might look boring', marca: true},
		],
		extras: [{tipo: 'balao', w: 'boring', x: 800, y: 450, txt: 'meh.', cauda: {x: 650, y: 560}}],
	},
	// 9
	{
		colX: 1150,
		textos: [
			{w: 'details', txt: 'fewer details'},
			{w: 'blurry', txt: 'far away = blurry'},
			{w: 'closer', txt: 'sharper up close', marca: true},
		],
		extras: [{tipo: 'nitidez', w: 'sharply', x: 300, y: 360}],
	},
	// 10
	{
		gato: {olhos: 'normal', bigodes: 'frente'},
		textos: [
			{w: 'focusing', txt: 'trouble focusing...'},
			{w: 'nose', txt: '...right under its nose'},
			{w: 'sniff', txt: 'so it sniffs & touches first', marca: true, tam: 58},
		],
		extras: [{tipo: 'circulo', w: 'nose', x: 560, y: 655, rx: 70, ry: 40}],
	},
	// 11
	{
		gato: {olhos: 'dilatado', bigodes: 'frente'},
		textos: [
			{w: 'win', txt: 'where cats win:'},
			{w: 'motion', txt: 'MOTION', marca: true},
			{w: 'tiniest', txt: 'the tiniest movement'},
		],
		extras: [{tipo: 'folhas', w: 'mouse', x: 1400, y: 800}],
	},
	// 12
	{
		gato: {olhos: 'meio', muda: [{w: 'irresistible', olhos: 'dilatado', bigodes: 'frente'}]},
		textos: [
			{w: 'still', txt: 'toy sits still = boring'},
			{w: 'irresistible', txt: 'toy moves = irresistible!', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'rato', w: 'moves', x: 900, y: 840}],
	},
	// 13
	{
		colX: 1250,
		textos: [
			{w: 'wider', txt: 'wider field of view'},
			{w: 'two', txt: 'about 200 degrees', marca: true},
			{w: 'sneaking', txt: 'hard to sneak up on!'},
		],
		extras: [{tipo: 'campo', w: 'field', x: 430, y: 640}],
	},
	// 14 — CAP 2
	{
		abre: true,
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'ears', txt: 'the ears'},
			{w: 'level', txt: 'on another level', marca: true},
		],
		extras: [
			{tipo: 'som', w: 'ears', x: 400, y: 520, dir: -1},
			{tipo: 'som', w: 'ears', x: 720, y: 520},
		],
	},
	// 15
	{
		textos: [{w: 'ultrasound', txt: 'far into ULTRASOUND', x: 300, y: 720, marca: true}],
		extras: [
			{
				tipo: 'barras',
				w: 'humans',
				x: 300,
				y: 380,
				largura: 1250,
				itens: [
					{rotulo: 'you', valor: 20 / 64, txt: '20,000 Hz'},
					{rotulo: 'cat', valor: 1, txt: '64,000 Hz', cor: '#ffe45c'},
				],
			},
		],
	},
	// 16
	{
		gato: {orelhas: 'frente', bigodes: 'frente'},
		textos: [
			{w: 'squeaks', txt: 'hears ultrasonic squeaks'},
			{w: 'mice', txt: 'of mice...'},
			{w: 'silent', txt: '...silent to you', marca: true},
		],
		extras: [
			{tipo: 'rato', w: 'squeaks', x: 900, y: 840},
			{tipo: 'onda', w: 'squeaks', x: 690, y: 700, largura: 120, alta: true, cor: 'vermelho'},
		],
	},
	// 17
	{
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'rotate', txt: 'each ear turns ~180 degrees', tam: 58},
			{w: 'independently', txt: 'independently'},
			{w: 'satellite', txt: '= 2 satellite dishes', marca: true},
		],
		extras: [
			{tipo: 'som', w: 'satellite', x: 400, y: 520, dir: -1},
			{tipo: 'som', w: 'satellite', x: 720, y: 520},
		],
	},
	// 18
	{
		gato: {pose: 'agachado', x: 520},
		colX: 1150,
		textos: [
			{w: 'where', txt: 'knows WHERE the sound is'},
			{w: 'precision', txt: 'amazing precision'},
			{w: 'leaves', txt: 'dinner under the leaves', marca: true},
		],
		extras: [{tipo: 'folhas', w: 'dinner', x: 900, y: 840, s: 0.8}],
	},
	// 19
	{
		gato: {rabo: 'alto', orelhas: 'gira', x: 470, escala: 0.9},
		colX: 1150,
		textos: [
			{w: 'study', txt: 'a study in Japan:'},
			{w: 'voice', txt: 'they know YOUR voice', cor: 'verde'},
			{w: 'call', txt: "...but don't always come", marca: true},
		],
		extras: [
			{tipo: 'pessoa', x: 800, escala: 1},
			{tipo: 'balao', w: 'call', x: 920, y: 380, txt: 'kitty!', cauda: {x: 830, y: 460}},
		],
	},
	// 20
	{
		gato: {orelhas: 'tras', olhos: 'dilatado', erizado: true},
		textos: [
			{w: 'sensitive', txt: 'super sensitive ears'},
			{w: 'vacuum', txt: 'vacuum, fireworks...'},
			{w: 'stressful', txt: '= very stressful', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'aspirador', w: 'vacuum', x: 1550, y: 840, s: 0.9}],
	},
	// 21 — CAP 3
	{
		abre: true,
		gato: {bigodes: 'frente'},
		textos: [{w: 'newspaper', txt: 'the nose = a newspaper', marca: true}],
		extras: [{tipo: 'jornal', w: 'newspaper', x: 1350, y: 620}],
	},
	// 22
	{
		textos: [{w: 'two', txt: '(some estimates)', x: 300, y: 720, cor: 'grafite'}],
		extras: [
			{
				tipo: 'barras',
				w: 'cells',
				x: 300,
				y: 380,
				largura: 1250,
				itens: [
					{rotulo: 'you', valor: 5 / 200, txt: '~5 million'},
					{rotulo: 'cat', valor: 1, txt: 'up to ~200 million', cor: '#ffe45c'},
				],
			},
		],
	},
	// 23
	{
		gato: {boca: 'aberta'},
		textos: [
			{w: 'second', txt: 'a 2nd smelling system'},
			{w: 'roof', txt: 'on the roof of the mouth'},
			{w: 'vomeronasal', txt: 'vomeronasal organ', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'roof', x: 560, y: 670, rx: 55, ry: 35}],
	},
	// 24
	{
		gato: {boca: 'w', olhos: 'normal', muda: [{w: 'mouth', boca: 'flehmen', olhos: 'meio'}]},
		textos: [
			{w: 'sniffs', txt: 'sniffs...'},
			{w: 'mouth', txt: '...mouth slightly open'},
			{w: 'disgusted', txt: 'NOT disgusted!', cor: 'vermelho'},
			{w: 'analyze', txt: 'analyzing the scent', marca: true},
		],
	},
	// 25
	{
		gato: {boca: 'flehmen', olhos: 'meio'},
		textos: [
			{w: 'flehmen', txt: 'the flehmen response', marca: true},
			{w: 'lions', txt: 'lions & tigers too'},
		],
	},
	// 26
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'messages', txt: 'scent messages:'},
			{w: 'cheeks', txt: 'cheeks'},
			{w: 'paws', txt: 'paws'},
			{w: 'tail', txt: 'base of the tail', marca: true},
		],
		extras: [
			{tipo: 'circulo', w: 'cheeks', x: 490, y: 660, rx: 35, ry: 30},
			{tipo: 'circulo', w: 'cheeks', x: 630, y: 660, rx: 35, ry: 30},
			{tipo: 'circulo', w: 'paws', x: 520, y: 830, rx: 30, ry: 22},
			{tipo: 'circulo', w: 'paws', x: 600, y: 830, rx: 30, ry: 22},
			{tipo: 'circulo', w: 'tail', x: 615, y: 790, rx: 35, ry: 35},
		],
	},
	// 27
	{
		gato: {pose: 'lado', x: 330, escala: 0.8},
		colX: 1150,
		textos: [
			{w: 'scratches', txt: 'scratching ='},
			{w: 'sharpening', txt: 'sharpening claws +'},
			{w: 'mark', txt: 'a scent mark', marca: true},
			{w: 'live', txt: '"I live here"', cor: 'verde'},
		],
		extras: [{tipo: 'sofa', x: 760, y: 840, s: 0.75, arranha: 'scratches'}],
	},
	// 28
	{
		gato: {orelhas: 'tras', olhos: 'fenda'},
		textos: [
			{w: 'perfume', txt: 'perfume'},
			{w: 'fresheners', txt: 'air fresheners'},
			{w: 'citrus', txt: 'citrus'},
			{w: 'overwhelming', txt: '= too much for that nose', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'laranja', w: 'citrus', x: 1560, y: 470}],
	},
	// 29 — CAP 4
	{
		abre: true,
		gato: {bigodes: 'frente'},
		textos: [
			{w: 'sensors', txt: 'touch sensors'},
			{w: 'nerves', txt: 'packed with nerves', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'whiskers', x: 560, y: 650, rx: 160, ry: 45}],
	},
	// 30
	{
		gato: {bigodes: 'frente', escala: 0.62},
		textos: [
			{w: 'fit', txt: 'can I fit?'},
			{w: 'wide', txt: 'whiskers ~ body width', marca: true},
		],
		extras: [{tipo: 'fresta', w: 'gap', x: 560, y: 840}],
	},
	// 31
	{
		gato: {olhos: 'fechados', bigodes: 'frente'},
		textos: [
			{w: 'air', txt: 'feel the air move'},
			{w: 'dark', txt: 'navigate in the dark'},
			{w: 'without', txt: 'without seeing', marca: true},
		],
		extras: [
			{tipo: 'onda', w: 'air', x: 700, y: 610, largura: 220},
			{tipo: 'lua', w: 'dark', x: 1650, y: 760},
		],
	},
	// 32
	{
		gato: {bigodes: 'frente'},
		textos: [
			{w: 'legs', txt: 'whiskers on the front legs!'},
			{w: 'prey', txt: 'feel the prey'},
			{w: 'focus', txt: "where eyes can't focus", marca: true},
		],
		extras: [
			{tipo: 'circulo', w: 'legs', x: 515, y: 790, rx: 30, ry: 40},
			{tipo: 'circulo', w: 'legs', x: 605, y: 790, rx: 30, ry: 40},
			{tipo: 'rato', w: 'prey', x: 760, y: 840},
		],
	},
	// 33
	{
		gato: {x: 420, escala: 0.8},
		colX: 1050,
		textos: [
			{w: 'vets', txt: 'some vets think:'},
			{w: 'narrow', txt: 'deep, narrow bowls = bother'},
			{w: 'shallow', txt: 'try wide, shallow ones', marca: true},
		],
		extras: [
			{tipo: 'tigela', w: 'narrow', x: 820, y: 840, funda: true},
			{tipo: 'xis', w: 'bother', x: 820, y: 620},
			{tipo: 'tigela', w: 'shallow', x: 1450, y: 840},
			{tipo: 'check', w: 'shallow', x: 1450, y: 700},
		],
	},
	// 34
	{
		gato: {bigodes: 'frente'},
		textos: [
			{w: 'never', txt: 'NEVER trim them', cor: 'vermelho', marca: true},
			{w: 'map', txt: '= part of its map'},
		],
		postit: {w: 'map', linhas: ['whiskers =', 'a map'], x: 1450, y: 700},
	},
	// 35 — CAP 5
	{
		abre: true,
		gato: {boca: 'lingua'},
		textos: [
			{w: 'sugar', txt: "can't taste sugar", cor: 'vermelho', marca: true},
			{w: 'sugar', txt: '(we made a whole video!)', cor: 'grafite'},
		],
	},
	// 36
	{
		textos: [{w: 'buds', txt: 'taste buds', x: 300, y: 720, marca: true}],
		extras: [
			{
				tipo: 'barras',
				w: 'seventy',
				x: 300,
				y: 380,
				largura: 1250,
				itens: [
					{rotulo: 'cat', valor: 470 / 9000, txt: '~470'},
					{rotulo: 'you', valor: 1, txt: '~9,000'},
				],
			},
		],
	},
	// 37
	{
		gato: {boca: 'lingua'},
		textos: [
			{w: 'meat', txt: 'tuned to meat', marca: true},
			{w: 'savory', txt: 'savory = YES', cor: 'verde'},
			{w: 'bitter', txt: 'bitter = detected'},
			{w: 'avoid', txt: 'helps avoid bad food'},
		],
	},
	// 38
	{
		gato: {boca: 'lingua'},
		textos: [
			{w: 'fresh', txt: 'fresh, moving water'},
			{w: 'tap', txt: 'the tap!'},
			{w: 'fountain', txt: 'water fountains', marca: true},
		],
		extras: [{tipo: 'fonte', w: 'fountain', x: 1450, y: 840}],
	},
	// 39 — CAP 6
	{
		abre: true,
		textos: [
			{w: 'pads', txt: 'full of nerve endings', x: 1050, y: 360},
			{w: 'textures', txt: 'textures', x: 1050, y: 455},
			{w: 'temperature', txt: 'temperature', x: 1050, y: 550},
			{w: 'vibrations', txt: 'vibrations!', x: 1050, y: 645, marca: true},
		],
		extras: [{tipo: 'pata', x: 560, y: 600, s: 1.2}],
	},
	// 40
	{
		textos: [
			{w: 'sweat', txt: 'cats sweat through paws!', x: 1050, y: 400},
			{w: 'wet', txt: 'wet paw prints', x: 1050, y: 495},
			{w: 'nervous', txt: 'at the vet = nervous', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'pata', x: 560, y: 560, s: 1.2, suor: 'sweat'}],
	},
	// 41
	{
		textos: [
			{w: 'sensitivity', txt: 'super sensitive', x: 1050, y: 400},
			{w: 'touched', txt: 'many hate paw touches', x: 1050, y: 495},
			{w: 'personal', txt: 'a personal spot', x: 1050, y: 590, marca: true},
		],
		extras: [
			{tipo: 'pata', x: 600, y: 600, s: 1.1},
			{tipo: 'mao', w: 'touched', x: 260, y: 600, rot: -10},
			{tipo: 'xis', w: 'personal', x: 430, y: 560, s: 1.2},
		],
	},
	// 42
	{
		gato: {olhos: 'fechados'},
		textos: [
			{w: 'skin', txt: 'sensitive skin too'},
			{w: 'gentle', txt: 'short strokes: head & cheeks', cor: 'verde', tam: 56},
			{w: 'overwhelming', txt: 'long back rubs: too much', cor: 'vermelho', tam: 56},
		],
		extras: [{tipo: 'mao', w: 'gentle', x: 380, y: 590, rot: 18, acariciar: true}],
	},
	// 43
	{
		gato: {bigodes: 'frente'},
		textos: [
			{w: 'taps', txt: 'taps first...'},
			{w: 'information', txt: '...gathering info'},
			{w: 'hands', txt: 'paws = hands'},
			{w: 'sensors', txt: '+ sensors', marca: true},
		],
	},
	// 44 — CAP 7
	{
		abre: true,
		gato: {orelhas: 'frente'},
		textos: [
			{w: 'ear', txt: 'balance system in the ear'},
			{w: 'level', txt: '= a super-precise level', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'ear', x: 560, y: 535, rx: 130, ry: 60}],
	},
	// 45
	{
		gato: {pose: 'lado', x: 560, y: 700, escala: 0.8},
		colX: 1250,
		textos: [
			{w: 'flexible', txt: 'flexible spine'},
			{w: 'fences', txt: 'narrow fences'},
			{w: 'feet', txt: 'lands on its feet', marca: true},
		],
		extras: [{tipo: 'cerca', x: 200, y: 700, largura: 900}],
	},
	// 46
	{
		gato: {pose: 'lado', x: 560, y: 700, escala: 0.8},
		colX: 1250,
		textos: [
			{w: 'tail', txt: 'the tail ='},
			{w: 'tightrope', txt: 'a tightrope pole', marca: true},
			{w: 'steady', txt: 'keeps it steady'},
		],
		extras: [
			{tipo: 'cerca', x: 200, y: 700, largura: 900},
			{tipo: 'circulo', w: 'tail', x: 450, y: 590, rx: 70, ry: 80},
		],
	},
	// 47
	{
		gato: {rabo: 'baixo', olhos: 'meio', x: 560, y: 470, escala: 0.75},
		textos: [
			{w: 'high', txt: 'high, narrow places'},
			{w: 'shelves', txt: 'shelves, sofa backs'},
			{w: 'risky', txt: 'risky for us...'},
			{w: 'easy', txt: '...easy for them', marca: true},
		],
		extras: [{tipo: 'geladeira', x: 560, topo: 470}],
	},
	// 48
	{
		gato: {rabo: 'baixo'},
		textos: [
			{w: 'windows', txt: 'windows & balconies'},
			{w: 'dangerous', txt: '= DANGEROUS', cor: 'vermelho', marca: true},
			{w: 'fly', txt: "balance isn't flying"},
		],
		postit: {w: 'fly', linhas: ['use window', 'screens!'], x: 1450, y: 720},
	},
	// 49 — CAP 8
	{
		abre: true,
		textos: [
			{w: 'routines', txt: 'learns routines', x: 1050, y: 400},
			{w: 'dinner', txt: 'knows dinner time', x: 1050, y: 495},
			{w: 'minute', txt: '...to the minute!', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'relogio', x: 560, y: 560, txt: '6:00'}],
	},
	// 50
	{
		gato: {orelhas: 'gira', olhos: 'dilatado'},
		textos: [
			{w: 'notice', txt: 'notices every change:'},
			{w: 'furniture', txt: 'new furniture'},
			{w: 'smell', txt: 'new smell'},
			{w: 'late', txt: 'you, home late', marca: true},
		],
	},
	// 51
	{
		gato: {rabo: 'entre', orelhas: 'lado'},
		textos: [
			{w: 'moving', txt: 'moving house'},
			{w: 'pet', txt: 'a new pet'},
			{w: 'stress', txt: '= stress', cor: 'vermelho'},
			{w: 'predictable', txt: 'routine = safe', cor: 'verde', marca: true},
		],
	},
	// 52
	{
		gato: {boca: 'aberta'},
		textos: [
			{w: 'wakes', txt: 'same wake-up time'},
			{w: 'dramatic', txt: 'not dramatic...'},
			{w: 'schedule', txt: '...just on schedule', marca: true},
		],
		extras: [{tipo: 'relogio', w: 'wakes', x: 1500, y: 720, txt: '5:00'}],
	},
	// 53 — CAP 9
	{
		abre: true,
		gato: {rabo: 'alto'},
		textos: [{w: 'senses', txt: 'senses -> simple tips', marca: true}],
		postit: {w: 'tips', linhas: ['7 easy', 'tips'], x: 1450, y: 650},
	},
	// 54
	{
		gato: {pose: 'agachado', x: 520},
		colX: 1150,
		textos: [
			{w: 'eyes', txt: 'EYES:', marca: true},
			{w: 'bursts', txt: 'toys in quick bursts'},
			{w: 'hunter', txt: 'hunter mode: ON', cor: 'verde'},
		],
		extras: [{tipo: 'rato', w: 'mouse', x: 900, y: 840}],
	},
	// 55
	{
		colX: 1250,
		textos: [
			{w: 'color', txt: "color? don't worry"},
			{w: 'blue', txt: 'blue / green toys'},
			{w: 'red', txt: 'may stand out more', marca: true},
		],
		extras: [{tipo: 'cores', w: 'color', x: 400, y: 380}],
	},
	// 56
	{
		gato: {orelhas: 'frente'},
		textos: [
			{w: 'ears', txt: 'EARS:', marca: true},
			{w: 'quiet', txt: 'a quiet place to hide'},
			{w: 'volume', txt: 'comfortable volume'},
		],
	},
	// 57
	{
		textos: [
			{w: 'nose', txt: 'NOSE:', x: 1050, y: 360, marca: true},
			{w: 'litter', txt: 'litter box away from food', x: 1050, y: 455},
			{w: 'scented', txt: 'no strong scents', x: 1050, y: 550},
			{w: 'sniff', txt: 'let it sniff new things', x: 1050, y: 645},
		],
		extras: [{tipo: 'nariz', x: 560, y: 560, s: 1.3}],
	},
	// 58
	{
		textos: [
			{w: 'whiskers', txt: 'WHISKERS:', x: 1050, y: 400, marca: true},
			{w: 'shallow', txt: 'wide, shallow bowls', x: 1050, y: 495},
			{w: 'never', txt: 'never trim them', x: 1050, y: 590, cor: 'vermelho'},
		],
		extras: [{tipo: 'tigela', x: 560, y: 760, s: 1.2}],
	},
	// 59
	{
		gato: {rabo: 'baixo', olhos: 'meio', x: 560, y: 470, escala: 0.75},
		textos: [
			{w: 'paws', txt: 'PAWS & BALANCE:', marca: true},
			{w: 'scratching', txt: 'scratching posts'},
			{w: 'high', txt: 'high places to climb'},
			{w: 'above', txt: 'watch from above'},
		],
		extras: [{tipo: 'geladeira', x: 560, topo: 470}],
	},
	// 60
	{
		textos: [
			{w: 'clock', txt: 'CLOCK:', x: 1050, y: 400, marca: true},
			{w: 'feed', txt: 'feed & play on time', x: 1050, y: 495},
			{w: 'comfort', txt: 'routine = comfort', x: 1050, y: 590, cor: 'verde'},
		],
		extras: [{tipo: 'relogio', x: 560, y: 560, txt: '8:00'}],
	},
	// 61
	{
		gato: {olhos: 'dilatado'},
		textos: [
			{w: 'corner', txt: 'stares at a corner?'},
			{w: 'mouth', txt: 'mouth open?'},
			{w: 'ignores', txt: 'ignores you?'},
			{w: 'sounds', txt: 'a world of sounds & smells', marca: true, tam: 56},
		],
	},
	// 62
	{
		gato: {olhos: 'lento', rabo: 'enrolado'},
		textos: [
			{w: 'weird', txt: 'not weird...'},
			{w: 'senses', txt: '...different senses', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'senses', x: 730, y: 450}],
	},
	// 63
	{
		gato: {olhos: 'lento', x: 1560},
		textos: [
			{w: 'superpowers', txt: 'Which cat superpower surprised you most?', x: 260, y: 300, tam: 70},
			{w: 'comments', txt: 'tell me in the comments!', x: 380, y: 600, marca: true, tam: 76},
		],
		extras: [{tipo: 'seta', w: 'comments', de: {x: 330, y: 400}, para: {x: 330, y: 580}, cor: 'vermelho'}],
	},
];
