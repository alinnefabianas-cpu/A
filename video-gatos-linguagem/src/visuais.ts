// Roteiro visual: um item por trecho do roteiro (mesma ordem de ROTEIRO).
// `w` = palavra da narração que faz o elemento aparecer (sem `w`, aparece logo no começo).
import type {GatoSpec} from './gato';

export type Pose = 'frente' | 'pao' | 'barriga' | 'arco' | 'arcoAssustado' | 'agachado' | 'rebola' | 'dorme' | 'lado';
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

export const CAPITULOS = ['', 'The tail', 'The ears', 'The eyes', 'The whiskers', 'The body', 'The sounds', 'How cats say "I love you"', 'Reading the whole cat', 'How to speak cat'];

// pontos do gato de frente padrão (x 560, base 840, escala 1.05)
const RABO = {x: 665, y: 525};
const ORELHAS = {x: 560, y: 535};
const OLHOS = {x: 560, y: 617};

export const VIS: Vis[] = [
	// 0
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'tail', txt: 'tail'},
			{w: 'ears', txt: 'ears'},
			{w: 'eyes', txt: 'eyes'},
			{w: 'body', txt: 'whole body'},
		],
		extras: [
			{tipo: 'texto', x: 260, y: 215, txt: 'How to read your cat', tam: 84, marca: true},
			{tipo: 'seta', w: 'tail', de: {x: 990, y: 320}, para: {x: RABO.x + 30, y: RABO.y}},
			{tipo: 'seta', w: 'ears', de: {x: 990, y: 415}, para: {x: ORELHAS.x + 70, y: ORELHAS.y}},
			{tipo: 'seta', w: 'eyes', de: {x: 990, y: 510}, para: {x: OLHOS.x + 50, y: OLHOS.y}},
			{tipo: 'seta', w: 'body', de: {x: 990, y: 605}, para: {x: 640, y: 760}},
		],
	},
	// 1
	{
		gato: {olhos: 'lento', rabo: 'enrolado'},
		textos: [
			{w: 'miss', txt: 'most people miss it'},
			{w: 'read', txt: 'read your cat like a book', marca: true},
			{w: 'signal', txt: 'one signal at a time'},
		],
		postit: {w: 'signal', linhas: ['tail . ears . eyes', 'body . sounds'], x: 1400, y: 700},
	},
	// 2
	{
		gato: {rabo: 'alto', olhos: 'meio'},
		textos: [
			{w: 'loves', txt: 'when it loves you'},
			{w: 'scared', txt: "when it's scared"},
			{w: 'stop', txt: 'when to STOP petting', cor: 'vermelho'},
			{w: 'bitten', txt: '(before the bite!)', cor: 'grafite'},
		],
		extras: [
			{tipo: 'coracao', w: 'loves', x: 1560, y: 320},
			{tipo: 'mao', w: 'stop', x: 380, y: 590, rot: 18, acariciar: true},
		],
	},
	// 3 — CAP 1: rabo
	{
		abre: true,
		gato: {rabo: 'alto'},
		textos: [
			{w: 'mood', txt: 'mood antenna'},
			{w: 'easiest', txt: 'easiest signal to read', marca: true},
		],
		extras: [
			{tipo: 'som', w: 'antenna', x: RABO.x + 40, y: RABO.y - 20},
			{tipo: 'circulo', w: 'tail', x: RABO.x, y: RABO.y + 80, rx: 80, ry: 170},
		],
	},
	// 4
	{
		gatos: [{rabo: 'alto'}, {rabo: 'alto', x: 830, escala: 0.6, w: 'greet'}],
		colX: 1080,
		textos: [
			{w: 'straight', txt: 'tail straight up'},
			{w: 'hello', txt: '= friendly hello!', cor: 'verde'},
			{w: 'greet', txt: 'cats greet like this'},
			{w: 'happy', txt: 'happy to see you', marca: true},
		],
	},
	// 5
	{
		gato: {rabo: 'gancho'},
		textos: [
			{w: 'question', txt: 'question-mark tip'},
			{w: 'friendly', txt: 'friendly'},
			{w: 'curious', txt: 'curious'},
			{w: 'playful', txt: 'playful', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'question', x: 650, y: 495, rx: 75, ry: 70}],
	},
	// 6
	{
		gato: {rabo: 'tremendo', olhos: 'dilatado'},
		textos: [
			{w: 'quiver', txt: 'quivering tail'},
			{w: 'excited', txt: '= really excited!', cor: 'verde'},
			{w: 'home', txt: 'you come home...'},
			{w: 'treat', txt: '...or open the treats', marca: true},
		],
		extras: [{tipo: 'texto', w: 'quiver', x: 700, y: 470, txt: '*shake shake*', tam: 48, cor: 'vermelho'}],
	},
	// 7
	{
		gato: {rabo: 'alto', muda: [{w: 'bottle', erizado: true, orelhas: 'tras', olhos: 'dilatado', boca: 'chiado'}]},
		textos: [
			{w: 'warning', txt: 'warning signs!', cor: 'vermelho'},
			{w: 'bottle', txt: 'bottle-brush tail'},
			{w: 'scared', txt: 'startled / scared'},
			{w: 'bigger', txt: 'trying to look BIGGER', marca: true},
		],
	},
	// 8
	{
		gato: {rabo: 'entre', orelhas: 'lado', olhos: 'dilatado'},
		textos: [
			{w: 'low', txt: 'tail low / tucked'},
			{w: 'nervous', txt: 'nervous, unsure'},
			{w: 'space', txt: 'give it space', marca: true},
		],
		postit: {w: 'space', linhas: ['let it come', 'to you'], x: 1450, y: 700, rot: 4},
	},
	// 9
	{
		gato: {rabo: 'chicote', orelhas: 'lado', olhos: 'fenda'},
		textos: [
			{w: 'wrong', txt: 'the #1 mistake:', cor: 'vermelho'},
			{w: 'swishing', txt: 'tail swishing hard'},
			{w: 'dogs', txt: 'dog wag = happy'},
			{w: 'irritation', txt: 'cat swish = IRRITATED', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'xis', w: 'irritation', x: 1620, y: 500, s: 0.8}],
	},
	// 10
	{
		gato: {rabo: 'swish', bigodes: 'frente'},
		textos: [
			{w: 'slow', txt: 'slow swish / tip twitch'},
			{w: 'focused', txt: 'focused (prey?)'},
			{w: 'annoyed', txt: 'or a little annoyed'},
		],
		extras: [{tipo: 'passaro', w: 'focused', x: 1500, y: 720}],
	},
	// 11
	{
		gato: {rabo: 'abraco', x: 500},
		colX: 1100,
		textos: [
			{w: 'wraps', txt: 'tail wrap'},
			{w: 'hug', txt: '= a cat hug', marca: true},
			{w: 'affection', txt: 'affection!', cor: 'verde'},
		],
		extras: [
			{tipo: 'pessoa', x: 800, escala: 1},
			{tipo: 'coracao', w: 'hug', x: 660, y: 430},
		],
	},
	// 12 recap rabo
	{
		gato: {rabo: 'alto', muda: [{w: 'puffed', erizado: true, orelhas: 'tras'}, {w: 'low', erizado: false, orelhas: 'lado', rabo: 'entre'}, {w: 'swishing', rabo: 'chicote'}]},
		textos: [
			{w: 'recap', txt: 'tail recap:'},
			{w: 'up', txt: 'up = hello', cor: 'verde'},
			{w: 'puffed', txt: 'puffed = scared'},
			{w: 'low', txt: 'low = nervous'},
			{w: 'swishing', txt: 'swishing = STOP', cor: 'vermelho', marca: true},
		],
	},
	// 13 — CAP 2: orelhas
	{
		abre: true,
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'thirty', txt: '30+ muscles'},
			{w: 'muscles', txt: 'in EACH ear', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'ears', x: ORELHAS.x, y: ORELHAS.y, rx: 130, ry: 70}],
	},
	// 14
	{
		gato: {orelhas: 'frente', rabo: 'enrolado'},
		textos: [
			{w: 'forward', txt: 'ears forward'},
			{w: 'relaxed', txt: 'relaxed / alert'},
			{w: 'interested', txt: 'interested'},
			{w: 'confident', txt: 'calm & confident', marca: true},
		],
		extras: [{tipo: 'check', w: 'confident', x: 1620, y: 600}],
	},
	// 15
	{
		gato: {orelhas: 'gira'},
		textos: [
			{w: 'turning', txt: 'turning ears'},
			{w: 'radars', txt: '= little radars'},
			{w: 'listening', txt: 'listening carefully', marca: true},
		],
		extras: [
			{tipo: 'som', w: 'radars', x: 400, y: 520, dir: -1},
			{tipo: 'som', w: 'radars', x: 720, y: 520},
		],
	},
	// 16
	{
		gato: {orelhas: 'lado', olhos: 'fenda', rabo: 'swish'},
		textos: [
			{w: 'sideways', txt: 'sideways ears'},
			{w: 'airplane', txt: '= airplane ears'},
			{w: 'irritated', txt: 'irritated / anxious'},
			{w: 'moment', txt: 'back off!', cor: 'vermelho', marca: true},
		],
	},
	// 17
	{
		gato: {orelhas: 'tras', olhos: 'dilatado', boca: 'chiado', bigodes: 'tras'},
		textos: [
			{w: 'flat', txt: 'ears flat back'},
			{w: 'fear', txt: 'real fear'},
			{w: 'defend', txt: 'ready to defend', cor: 'vermelho'},
		],
		extras: [
			{tipo: 'mao', w: 'reach', x: 960, y: 690, rot: 180},
			{tipo: 'xis', w: 'reach', x: 880, y: 690, s: 1.3},
		],
	},
	// 18 — CAP 3: olhos
	{
		abre: true,
		gato: {olhos: 'normal', muda: [{w: 'emotion', olhos: 'dilatado'}]},
		textos: [
			{w: 'pupils', txt: 'pupils change with...'},
			{w: 'light', txt: 'light'},
			{w: 'emotion', txt: '...and EMOTION', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'pupils', x: OLHOS.x, y: OLHOS.y, rx: 95, ry: 45}],
	},
	// 19
	{
		gato: {olhos: 'dilatado'},
		textos: [
			{w: 'round', txt: 'big round pupils'},
			{w: 'excitement', txt: 'excitement?'},
			{w: 'playfulness', txt: 'play?'},
			{w: 'fear', txt: 'fear?'},
		],
		postit: {w: 'rest', linhas: ['check the', 'whole body!'], x: 1450, y: 700},
	},
	// 20
	{
		gato: {olhos: 'fenda', orelhas: 'lado', rabo: 'swish'},
		textos: [
			{w: 'narrow', txt: 'narrow slit pupils'},
			{w: 'tense', txt: 'tense / irritated'},
			{w: 'agree', txt: '(if ears + tail agree)', cor: 'grafite'},
		],
	},
	// 21
	{
		gato: {olhos: 'encarando'},
		textos: [
			{w: 'stare', txt: 'long, hard stare'},
			{w: 'challenge', txt: '= a challenge', cor: 'vermelho'},
			{w: 'ignores', txt: 'they pick who ignores them', tam: 54},
		],
		extras: [{tipo: 'pessoa', w: 'ignores', x: 1700, escala: 0.8}],
	},
	// 22
	{
		gato: {olhos: 'lento', rabo: 'enrolado'},
		textos: [
			{w: 'slow', txt: 'the slow blink'},
			{w: 'relaxed', txt: '= relaxed'},
			{w: 'safe', txt: '& safe with you', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'safe', x: 730, y: 450}],
	},
	// 23
	{
		gato: {olhos: 'lento', x: 470, escala: 0.9},
		colX: 1100,
		textos: [
			{w: 'study', txt: 'a study found:'},
			{w: 'approach', txt: 'cats approach slow blinkers', tam: 54},
			{w: 'blink', txt: 'so blink back!', marca: true},
			{w: 'works', txt: 'it works', cor: 'verde'},
		],
		extras: [
			{tipo: 'pessoa', w: 'stranger', x: 800, escala: 0.9},
			{tipo: 'check', w: 'works', x: 1360, y: 600},
		],
	},
	// 24 olhos semiabertos
	{
		gato: {pose: 'dorme', x: 560},
		textos: [
			{w: 'half', txt: 'dozing near you'},
			{w: 'closed', txt: 'eyes closed while you are there', tam: 54},
			{w: 'guard', txt: '= guard down, feels safe', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 1650, escala: 0.8}, {tipo: 'coracao', w: 'safe', x: 720, y: 640}],
	},
	// 25 — CAP 4: bigodes
	{
		abre: true,
		gato: {bigodes: 'normal', muda: [{w: 'forward', bigodes: 'frente'}]},
		textos: [
			{w: 'relaxed', txt: 'relaxed: to the sides'},
			{w: 'forward', txt: 'forward: curious / focused', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'whiskers', x: 560, y: 650, rx: 150, ry: 45}],
	},
	// 26
	{
		gato: {bigodes: 'tras', orelhas: 'tras', olhos: 'dilatado'},
		textos: [
			{w: 'back', txt: 'whiskers pulled back'},
			{w: 'scared', txt: 'scared / defensive'},
			{w: 'stop', txt: '= STOP sign', cor: 'vermelho', marca: true},
		],
	},
	// 27 — CAP 5: corpo
	{
		abre: true,
		gato: {pose: 'pao'},
		textos: [
			{w: 'loaf', txt: 'the cat loaf'},
			{w: 'calm', txt: 'comfortable & calm', marca: true},
		],
	},
	// 28
	{
		gato: {pose: 'barriga', x: 600},
		textos: [
			{w: 'belly', txt: 'belly up'},
			{w: 'trust', txt: '= huge trust', cor: 'verde'},
			{w: 'vulnerable', txt: 'most vulnerable spot'},
		],
	},
	// 29
	{
		gato: {pose: 'barriga', x: 600},
		textos: [
			{w: 'invitation', txt: 'NOT an invitation'},
			{w: 'hate', txt: 'many hate belly rubs'},
			{w: 'trap', txt: 'the belly trap!', cor: 'vermelho', marca: true},
		],
		extras: [
			{tipo: 'mao', w: 'touched', x: 420, y: 740, acariciar: true},
			{tipo: 'xis', w: 'trap', x: 620, y: 580, s: 1.3},
		],
	},
	// 30
	{
		gato: {pose: 'arcoAssustado', x: 580},
		textos: [
			{w: 'arched', txt: 'arched back'},
			{w: 'fur', txt: 'fur standing up'},
			{w: 'halloween', txt: 'the Halloween cat', marca: true},
			{w: 'frightened', txt: '= frightened', cor: 'vermelho'},
		],
	},
	// 31
	{
		gato: {pose: 'arco', x: 580},
		textos: [
			{w: 'without', txt: 'no puffed fur...'},
			{w: 'different', txt: 'totally different!'},
			{w: 'stretch', txt: 'just a stretch', cor: 'verde'},
			{w: 'hello', txt: 'or a hello rub', marca: true},
		],
		extras: [{tipo: 'check', w: 'stretch', x: 1500, y: 500}],
	},
	// 32
	{
		gato: {pose: 'agachado', x: 560},
		textos: [
			{w: 'crouched', txt: 'crouched low'},
			{w: 'scared', txt: 'scared?'},
			{w: 'hunting', txt: '...or hunting?'},
			{w: 'difference', txt: 'check eyes + tail', marca: true},
		],
	},
	// 33
	{
		gato: {pose: 'rebola', x: 520},
		textos: [
			{w: 'wiggle', txt: 'the butt wiggle'},
			{w: 'pounce', txt: 'right before the pounce'},
			{w: 'instinct', txt: 'pure hunting instinct', marca: true},
		],
		extras: [{tipo: 'rato', w: 'pounce', x: 860, y: 840}],
	},
	// 34
	{
		gato: {pose: 'dorme', x: 560},
		textos: [
			{w: 'sleeps', txt: 'sleeps next to you'},
			{w: 'safe', txt: "= you're its safe place", marca: true},
			{w: 'defenseless', txt: '(its most defenseless moment)', cor: 'grafite', tam: 50},
		],
		extras: [
			{tipo: 'texto', x: 420, y: 660, txt: 'zzz', tam: 64, cor: 'grafite'},
			{tipo: 'coracao', w: 'safe', x: 720, y: 640},
		],
	},
	// 35 lugares altos
	{
		gato: {rabo: 'baixo', olhos: 'meio', x: 560, y: 470, escala: 0.75},
		textos: [
			{w: 'high', txt: 'cats love high places'},
			{w: 'fridge', txt: 'top of the fridge!'},
			{w: 'control', txt: 'watch everything = in control', marca: true, tam: 56},
		],
		extras: [{tipo: 'geladeira', x: 560, topo: 470}],
	},
	// 36 — CAP 6: sons
	{
		abre: true,
		gato: {boca: 'aberta'},
		textos: [
			{w: 'humans', txt: 'adult meows = for humans'},
			{w: 'own', txt: 'each cat: its own meows', marca: true},
		],
		extras: [{tipo: 'balao', w: 'meow', x: 800, y: 470, txt: 'meow!', cauda: {x: 650, y: 560}}],
	},
	// 37
	{
		gato: {boca: 'aberta'},
		textos: [
			{w: 'short', txt: 'short = hello'},
			{w: 'long', txt: 'long = a demand'},
			{w: 'demand', txt: '(food! door!)', cor: 'grafite'},
		],
		extras: [
			{tipo: 'balao', w: 'short', x: 780, y: 450, txt: 'mew!', cauda: {x: 650, y: 560}},
			{tipo: 'balao', w: 'long', x: 1300, y: 720, txt: 'MEEEOOOW', cauda: {x: 1100, y: 800}, largura: 380},
		],
	},
	// 38
	{
		gato: {boca: 'w', rabo: 'alto'},
		textos: [
			{w: 'trill', txt: 'the trill'},
			{w: 'rolling', txt: 'meow + purr'},
			{w: 'kittens', txt: 'moms call kittens'},
			{w: 'follow', txt: '= hi! / follow me', marca: true},
		],
		extras: [{tipo: 'balao', w: 'trill', x: 800, y: 450, txt: 'mrrrp?', cauda: {x: 650, y: 560}}],
	},
	// 39
	{
		gato: {olhos: 'meio', rabo: 'enrolado'},
		textos: [
			{w: 'purring', txt: 'purr = content...'},
			{w: 'stressed', txt: '...but also stressed'},
			{w: 'pain', txt: 'sick or in pain', cor: 'vermelho'},
		],
		extras: [{tipo: 'balao', w: 'purring', x: 800, y: 450, txt: 'prrrr~', cauda: {x: 650, y: 560}}],
	},
	// 40
	{
		gato: {olhos: 'meio', orelhas: 'lado', rabo: 'entre'},
		textos: [
			{w: 'hiding', txt: 'hiding?'},
			{w: 'eating', txt: 'not eating?'},
			{w: 'vet', txt: 'call the vet', cor: 'vermelho', marca: true},
		],
		postit: {w: 'cuddle', linhas: ['vet,', 'not a cuddle'], x: 1450, y: 720, rot: -4},
	},
	// 41
	{
		gato: {bigodes: 'frente', boca: 'aberta'},
		textos: [
			{w: 'chattering', txt: 'chattering: k-k-k'},
			{w: 'excitement', txt: 'excitement + frustration', tam: 56},
		],
		extras: [{tipo: 'janela', w: 'birds', x: 1400, y: 700}],
	},
	// 42
	{
		gato: {boca: 'chiado', orelhas: 'tras', erizado: true, olhos: 'dilatado'},
		textos: [
			{w: 'hiss', txt: 'HISSS!', cor: 'vermelho'},
			{w: 'warning', txt: '= back off'},
			{w: 'scared', txt: 'usually scared,'},
			{w: 'space', txt: 'asking for space', marca: true},
		],
	},
	// 43
	{
		gato: {boca: 'chiado', orelhas: 'tras', olhos: 'fenda'},
		textos: [
			{w: 'growl', txt: 'GRRRR', cor: 'vermelho'},
			{w: 'stronger', txt: 'a stronger warning'},
			{w: 'stop', txt: 'stop + give it room', marca: true},
		],
	},
	// 44
	{
		gato: {boca: 'aberta', olhos: 'dilatado'},
		textos: [
			{w: 'yowl', txt: 'YOWL', cor: 'vermelho'},
			{w: 'mate', txt: 'looking for a mate'},
			{w: 'distress', txt: 'distress'},
			{w: 'confusion', txt: 'older cats: confusion'},
			{w: 'vet', txt: 'new? see a vet', marca: true},
		],
	},
	// 45 silêncio
	{
		gato: {rabo: 'entre', olhos: 'meio', orelhas: 'lado'},
		textos: [
			{w: 'silence', txt: 'silence is a signal too'},
			{w: 'stops', txt: 'stops its usual sounds?'},
			{w: 'hiding', txt: 'starts hiding?'},
			{w: 'unwell', txt: 'might be stressed / unwell', cor: 'vermelho', marca: true},
		],
	},
	// 46 — CAP 7: amor
	{
		abre: true,
		gato: {olhos: 'lento', rabo: 'alto'},
		textos: [
			{w: 'obvious', txt: 'never obvious...'},
			{w: 'time', txt: '...but all the time', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'love', x: 730, y: 450}],
	},
	// 47
	{
		gato: {olhos: 'fechados', rot: 16, x: 600, escala: 0.85},
		colX: 1100,
		textos: [
			{w: 'head', txt: 'head bumps'},
			{w: 'scent', txt: 'leave their scent'},
			{w: 'family', txt: "= you're family", marca: true},
		],
		extras: [{tipo: 'pessoa', x: 820, escala: 1.1}],
	},
	// 48
	{
		gato: {amassar: true, olhos: 'meio'},
		textos: [
			{w: 'kneading', txt: 'kneading'},
			{w: 'kittenhood', txt: 'from kittenhood'},
			{w: 'safe', txt: 'safe & happy', marca: true},
		],
	},
	// 49
	{
		gato: {boca: 'lingua', olhos: 'meio'},
		textos: [
			{w: 'licking', txt: 'licking / grooming you'},
			{w: 'allogrooming', txt: '= allogrooming'},
			{w: 'group', txt: "you're part of the group", marca: true},
		],
	},
	// 50
	{
		gato: {pose: 'lado', virado: true, x: 600},
		textos: [
			{w: 'butt', txt: 'the butt presentation'},
			{w: 'compliment', txt: '= a compliment!', cor: 'verde'},
			{w: 'hello', txt: 'cat-style hello', marca: true},
		],
	},
	// 51
	{
		gato: {pose: 'lado', x: 480},
		colX: 1100,
		textos: [
			{w: 'following', txt: 'follows you around'},
			{w: 'bathroom', txt: 'even to the bathroom'},
			{w: 'favorite', txt: 'its favorite company', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 860, escala: 1}],
	},
	// 52
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'prey', txt: 'brings you prey'},
			{w: 'clothes', txt: 'sleeps on your clothes'},
			{w: 'door', txt: 'greets you at the door'},
			{w: 'bond', txt: '= a strong bond', marca: true},
		],
		extras: [{tipo: 'rato', w: 'prey', x: 790, y: 840}],
	},
	// 53
	{
		gato: {olhos: 'lento', rabo: 'enrolado'},
		textos: [
			{w: 'blink', txt: 'the slow blink'},
			{w: 'purest', txt: 'the purest sign'},
			{w: 'trust', txt: '"I trust you"', marca: true},
		],
		extras: [
			{tipo: 'coracao', w: 'trust', x: 730, y: 450},
			{tipo: 'coracao', w: 'trust', x: 400, y: 520, s: 0.7},
		],
	},
	// 54 sentar perto
	{
		gato: {pose: 'pao', x: 480, escala: 0.85},
		colX: 1100,
		textos: [
			{w: 'near', txt: 'just sitting near you'},
			{w: 'touching', txt: '(no touching needed)', cor: 'grafite'},
			{w: 'choice', txt: '= a choice. A big deal.', marca: true},
		],
		extras: [{tipo: 'pessoa', x: 820, escala: 1}],
	},
	// 55 — CAP 8: o gato inteiro
	{
		abre: true,
		gato: {rabo: 'alto'},
		textos: [
			{w: 'trick', txt: 'one signal can trick you'},
			{w: 'secret', txt: 'the secret:'},
			{w: 'together', txt: 'read them ALL together', marca: true},
		],
		extras: [
			{tipo: 'circulo', w: 'tail', x: RABO.x, y: RABO.y + 60, rx: 60, ry: 120},
			{tipo: 'circulo', w: 'ears', x: ORELHAS.x, y: ORELHAS.y, rx: 120, ry: 55},
			{tipo: 'circulo', w: 'eyes', x: OLHOS.x, y: OLHOS.y, rx: 80, ry: 38},
			{tipo: 'circulo', w: 'body', x: 560, y: 760, rx: 120, ry: 90},
		],
	},
	// 56
	{
		gato: {rabo: 'chicote', orelhas: 'lado'},
		textos: [
			{w: 'purring', txt: 'purring...'},
			{w: 'lashing', txt: '+ lashing tail'},
			{w: 'back', txt: '+ ears turning back'},
			{w: 'enough', txt: '= ENOUGH!', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'balao', w: 'purring', x: 800, y: 450, txt: 'prrr...', cauda: {x: 650, y: 560}}],
	},
	// 57
	{
		gato: {olhos: 'meio', muda: [{w: 'biting', boca: 'chiado', orelhas: 'tras', olhos: 'fenda'}]},
		textos: [
			{w: 'overstimulated', txt: 'overstimulation'},
			{w: 'long', txt: 'petting for too long'},
			{w: 'biting', txt: 'purr -> BITE', cor: 'vermelho'},
			{w: 'seconds', txt: 'in seconds!', marca: true},
		],
		extras: [{tipo: 'mao', x: 380, y: 590, rot: 18, acariciar: true, ate: 'biting'}],
	},
	// 58
	{
		gato: {olhos: 'meio', muda: [{w: 'twitching', rabo: 'swish'}, {w: 'ripples', pele: true}, {w: 'sideways', orelhas: 'lado'}]},
		textos: [
			{w: 'twitching', txt: '1. tail twitching'},
			{w: 'ripples', txt: '2. skin ripples'},
			{w: 'sideways', txt: '3. ears sideways'},
			{w: 'stops', txt: '4. purring stops', marca: true},
		],
		extras: [{tipo: 'mao', x: 380, y: 590, rot: 18, acariciar: true}],
	},
	// 59
	{
		gato: {rabo: 'alto', olhos: 'meio'},
		textos: [
			{w: 'stop', txt: 'STOP petting', cor: 'vermelho'},
			{w: 'respect', txt: 'respect the warning'},
			{w: 'never', txt: '= almost never bitten', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'check', w: 'never', x: 1700, y: 500}],
	},
	// 60 — CAP 9: falar gatês
	{
		abre: true,
		gato: {bigodes: 'frente', x: 500},
		colX: 1100,
		textos: [
			{w: 'come', txt: 'let it come to you'},
			{w: 'knuckle', txt: 'offer a knuckle'},
			{w: 'sniff', txt: 'let it sniff', marca: true},
		],
		extras: [{tipo: 'mao', w: 'knuckle', x: 830, y: 660, rot: 180}],
	},
	// 61
	{
		gato: {olhos: 'fechados', rabo: 'alto'},
		textos: [
			{w: 'cheeks', txt: 'cheeks'},
			{w: 'chin', txt: 'under the chin'},
			{w: 'ears', txt: 'base of the ears'},
			{w: 'gentle', txt: 'short, gentle strokes', marca: true},
		],
		extras: [
			{tipo: 'circulo', w: 'cheeks', x: 490, y: 660, rx: 35, ry: 30},
			{tipo: 'circulo', w: 'cheeks', x: 630, y: 660, rx: 35, ry: 30},
			{tipo: 'circulo', w: 'chin', x: 560, y: 700, rx: 40, ry: 25},
			{tipo: 'circulo', w: 'ears', x: 500, y: 570, rx: 32, ry: 28},
			{tipo: 'circulo', w: 'ears', x: 620, y: 570, rx: 32, ry: 28},
		],
	},
	// 62
	{
		gato: {rabo: 'gancho'},
		textos: [
			{w: 'staring', txt: 'no staring', cor: 'vermelho'},
			{w: 'sudden', txt: 'no sudden moves', cor: 'vermelho'},
			{w: 'grab', txt: 'no grabbing', cor: 'vermelho'},
			{w: 'choice', txt: 'give them the choice', cor: 'verde', marca: true},
		],
	},
	// 63
	{
		gato: {olhos: 'lento', x: 480},
		colX: 1100,
		textos: [
			{w: 'slow', txt: 'your turn:'},
			{w: 'soften', txt: 'soften your eyes'},
			{w: 'blink', txt: 'blink slowly...'},
			{w: 'back', txt: '...they blink back!', marca: true},
		],
		extras: [
			{tipo: 'pessoa', x: 820, escala: 1},
			{tipo: 'coracao', w: 'back', x: 650, y: 420},
		],
	},
	// 64 cada gato é diferente
	{
		gatos: [{pose: 'pao', x: 420, escala: 0.65}, {rabo: 'alto', x: 760, escala: 0.75, w: 'cuddles'}, {pose: 'dorme', x: 1500, escala: 0.6, w: 'next'}],
		colX: 1060,
		textos: [
			{w: 'different', txt: 'every cat is different'},
			{w: 'cuddles', txt: 'some love cuddles'},
			{w: 'next', txt: 'some just sit next to you'},
			{w: 'respect', txt: 'learn its language. respect it.', marca: true, tam: 56},
		],
	},
	// 65 — recapitulação
	{
		textos: [
			{w: 'tail', txt: 'tail', x: 320, y: 360},
			{w: 'ears', txt: 'ears', x: 320, y: 460},
			{w: 'eyes', txt: 'eyes', x: 320, y: 560},
			{w: 'whiskers', txt: 'whiskers', x: 760, y: 360},
			{w: 'body', txt: 'body', x: 760, y: 460},
			{w: 'sounds', txt: 'sounds', x: 760, y: 560},
			{w: 'listen', txt: 'now you can listen', x: 320, y: 720, marca: true, tam: 80},
		],
		gato: {olhos: 'lento', rabo: 'alto', x: 1550},
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'Recap', tam: 86, marca: true}],
	},
	// 66 — CTA
	{
		gato: {olhos: 'lento', x: 1560, w: 'blink'},
		textos: [
			{w: 'signal', txt: 'Which signal does YOUR cat use most?', x: 260, y: 300, tam: 72},
			{w: 'comments', txt: 'tell me in the comments!', x: 380, y: 600, marca: true, tam: 76},
			{w: 'blink', txt: '...and try a slow blink today', x: 380, y: 720, cor: 'grafite'},
		],
		extras: [{tipo: 'seta', w: 'comments', de: {x: 330, y: 400}, para: {x: 330, y: 580}, cor: 'vermelho'}],
	},
];
