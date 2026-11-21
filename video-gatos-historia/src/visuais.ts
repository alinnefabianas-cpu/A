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

export const CAPITULOS = ['', 'The wild ancestor', 'The farmers & the mice', 'Ancient Egypt', 'Cats at sea', 'The dark times', 'Cats in Japan', 'Famous cats in history', 'The modern cat', 'Still a little wild'];

const TEMPO = [
	{pos: 0.03, txt: '10,000 years ago'},
	{pos: 0.3, txt: 'Egypt'},
	{pos: 0.6, txt: 'Vikings'},
	{pos: 0.82, txt: '1871'},
	{pos: 1, txt: 'today'},
];
const LUGARES = [
	{x: 170, y: 10, txt: 'Europe'},
	{x: 430, y: 70, txt: 'Near East'},
	{x: 350, y: 200, txt: 'Egypt'},
	{x: 650, y: 100, txt: 'Asia'},
];

export const VIS: Vis[] = [
	// 0
	{
		gato: {rabo: 'alto', x: 1500},
		textos: [
			{w: 'hundreds', txt: 'hundreds of millions of cats', x: 260, y: 400},
			{w: 'sofas', txt: "...weren't always on our sofas", x: 260, y: 520, marca: true},
		],
		extras: [{tipo: 'texto', x: 260, y: 215, txt: 'The secret history of cats', tam: 84, marca: true}],
	},
	// 1
	{
		gato: {pelagem: 'selvagem', olhos: 'fenda', x: 560},
		textos: [
			{w: 'ten', txt: '10,000 years ago'},
			{w: 'wild', txt: 'wild desert hunters'},
			{w: 'ruling', txt: 'now ruling our homes?', marca: true},
		],
	},
	// 2
	{
		textos: [{w: 'secret', txt: 'the journey:', x: 260, y: 240, marca: true}],
		extras: [{tipo: 'linhaTempo', w: 'history', x: 260, y: 560, largura: 1500, marcas: TEMPO}],
	},
	// 3 — CAP 1
	{
		abre: true,
		gato: {pelagem: 'selvagem', olhos: 'fenda'},
		textos: [
			{w: 'every', txt: 'EVERY pet cat descends from...'},
			{w: 'african', txt: 'the African wildcat', marca: true},
		],
	},
	// 4
	{
		gato: {pelagem: 'selvagem', x: 480, escala: 0.85},
		colX: 1080,
		textos: [
			{w: 'dna', txt: '2007: a DNA study'},
			{w: 'thousand', txt: '~1,000 cats worldwide'},
			{w: 'same', txt: 'all lead back to the', marca: true},
			{w: 'desert', txt: 'same desert wildcat', marca: true},
		],
	},
	// 5
	{
		gato: {pelagem: 'selvagem'},
		textos: [
			{w: 'sandy-colored', txt: 'sandy color'},
			{w: 'stripes', txt: 'faint stripes'},
			{w: 'tabby', txt: 'like a skinny tabby', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'stripes', x: 560, y: 720, rx: 120, ry: 90}],
	},
	// 6
	{
		gato: {pose: 'agachado', x: 520},
		colX: 1150,
		textos: [
			{w: 'solitary', txt: 'solitary & shy'},
			{w: 'hunters', txt: 'amazing hunters'},
			{w: 'everything', txt: 'about to change everything', marca: true},
		],
		extras: [{tipo: 'rato', w: 'hunters', x: 880, y: 840}],
	},
	// 7
	{
		textos: [
			{w: 'ten', txt: '10,000 years ago...', x: 1050, y: 420},
			{w: 'farming', txt: 'humans start FARMING', x: 1050, y: 520, marca: true},
		],
		extras: [{tipo: 'trigo', w: 'farming', x: 560, y: 840, s: 1.2}],
	},
	// 8
	{
		gato: {pelagem: 'selvagem', olhos: 'lento'},
		textos: [
			{w: 'twist', txt: 'the twist:'},
			{w: 'capture', txt: 'humans did NOT capture them', cor: 'vermelho'},
			{w: 'chose', txt: 'cats chose us', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'chose', x: 740, y: 450}],
	},
	// 9 — CAP 2
	{
		abre: true,
		textos: [
			{w: 'fertile', txt: 'the Fertile Crescent', x: 1050, y: 400},
			{w: 'grain', txt: 'growing grain', x: 1050, y: 495},
			{w: 'granaries', txt: 'stored in granaries', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'trigo', x: 560, y: 840, s: 1.2}],
	},
	// 10
	{
		textos: [
			{w: 'attracted', txt: 'grain -> mice', x: 1050, y: 400},
			{w: 'lots', txt: 'LOTS of mice', x: 1050, y: 495},
			{w: 'wildcats', txt: 'mice -> wildcats!', x: 1050, y: 590, marca: true},
		],
		extras: [
			{tipo: 'trigo', x: 480, y: 840},
			{tipo: 'rato', w: 'attracted', x: 700, y: 840},
			{tipo: 'rato', w: 'lots', x: 820, y: 840, },
		],
		gato: {pelagem: 'selvagem', x: 300, escala: 0.6, w: 'wildcats'},
	},
	// 11
	{
		gato: {pelagem: 'selvagem', boca: 'lingua'},
		textos: [
			{w: 'afraid', txt: 'the less afraid ones...'},
			{w: 'buffet', txt: 'got an easy buffet'},
			{w: 'villages', txt: 'stayed near villages'},
			{w: 'kittens', txt: 'had more kittens', marca: true},
		],
	},
	// 12
	{
		gato: {pelagem: 'selvagem', x: 470, escala: 0.85},
		colX: 1100,
		textos: [
			{w: 'free', txt: 'free pest control'},
			{w: 'train', txt: 'no training needed'},
			{w: 'won', txt: 'both sides won', cor: 'verde', marca: true},
		],
		extras: [
			{tipo: 'pessoa', x: 800, escala: 1},
			{tipo: 'check', w: 'won', x: 640, y: 420},
		],
	},
	// 13
	{
		gatos: [{pelagem: 'selvagem', x: 380, escala: 0.6, olhos: 'fenda'}, {x: 700, escala: 0.75, w: 'calmer', olhos: 'meio', rabo: 'alto'}],
		colX: 1100,
		textos: [
			{w: 'generations', txt: 'many generations later...'},
			{w: 'bolder', txt: 'bolder, calmer cats'},
			{w: 'side', txt: 'living side by side with us', marca: true, tam: 58},
		],
		extras: [{tipo: 'seta', w: 'calmer', de: {x: 460, y: 560}, para: {x: 620, y: 560}}],
	},
	// 14
	{
		textos: [
			{w: 'oldest', txt: 'oldest evidence:', x: 1050, y: 400},
			{w: 'cyprus', txt: 'Cyprus', x: 1050, y: 495, marca: true},
			{w: 'buried', txt: 'a person buried with a cat', x: 1050, y: 590},
		],
		extras: [{tipo: 'tumulo', w: 'grave', x: 560, y: 840, s: 1.3}],
	},
	// 15
	{
		textos: [
			{w: 'native', txt: 'no native wildcats there...', x: 260, y: 360},
			{w: 'carried', txt: 'so someone carried it', x: 260, y: 455},
			{w: 'traveling', txt: 'cats already traveled with us', x: 260, y: 550, marca: true},
		],
		extras: [{tipo: 'barco', w: 'sea', x: 1400, y: 780, s: 0.8}],
	},
	// 16 — CAP 3
	{
		abre: true,
		textos: [
			{w: 'love', txt: 'you think people love cats?', x: 1050, y: 420},
			{w: 'egyptians', txt: 'meet the Egyptians', x: 1050, y: 520, marca: true},
		],
		extras: [{tipo: 'piramide', x: 560, y: 840, s: 1.2}],
	},
	// 17
	{
		gato: {rabo: 'alto', x: 520},
		colX: 1080,
		textos: [
			{w: 'protected', txt: 'protected homes & grain'},
			{w: 'paintings', txt: 'in paintings'},
			{w: 'collars', txt: 'wearing collars'},
			{w: 'hunting', txt: 'joining hunting trips', marca: true},
		],
		extras: [{tipo: 'texto', w: 'snakes', x: 760, y: 820, txt: '~ snake ~', tam: 50, cor: 'verde'}],
	},
	// 18
	{
		textos: [
			{w: 'goddess', txt: 'the goddess Bastet', x: 1050, y: 400, marca: true},
			{w: 'protector', txt: 'protector of homes,', x: 1050, y: 495},
			{w: 'head', txt: 'mothers & children', x: 1050, y: 590},
		],
		extras: [{tipo: 'bastet', w: 'bastet', x: 560, y: 840, s: 1.2}],
	},
	// 19
	{
		textos: [
			{w: 'bubastis', txt: 'city of Bubastis', x: 1050, y: 400},
			{w: 'festivals', txt: 'huge festivals', x: 1050, y: 495},
			{w: 'sacred', txt: 'cats = sacred animals', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'bastet', x: 450, y: 840, s: 1}, {tipo: 'piramide', x: 760, y: 840, s: 0.6}],
	},
	// 20
	{
		gato: {olhos: 'fechados', x: 500, escala: 0.85},
		colX: 1080,
		textos: [
			{w: 'herodotus', txt: 'Herodotus wrote:'},
			{w: 'died', txt: 'when the cat died...'},
			{w: 'eyebrows', txt: 'families shaved their eyebrows', marca: true, tam: 58},
		],
		extras: [{tipo: 'pessoa', x: 820, escala: 1}],
	},
	// 21
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'names', txt: 'cats had names!'},
			{w: 'oldest', txt: 'one of the oldest:'},
			{w: 'nedjem', txt: 'NEDJEM', marca: true, tam: 80},
			{w: 'sweet', txt: '= sweet, pleasant', cor: 'verde'},
		],
		extras: [{tipo: 'pergaminho', w: 'tomb', x: 1500, y: 760, s: 0.7}],
	},
	// 22
	{
		textos: [
			{w: 'mummified', txt: 'mummified with care', x: 1050, y: 420},
			{w: 'hundreds', txt: 'hundreds of thousands found', x: 1050, y: 520, marca: true},
		],
		extras: [
			{tipo: 'mumia', x: 420, y: 840},
			{tipo: 'mumia', w: 'archaeologists', x: 600, y: 840, s: 0.85},
			{tipo: 'mumia', w: 'hundreds', x: 760, y: 840, s: 0.75},
		],
	},
	// 23
	{
		gato: {rabo: 'alto', olhos: 'meio'},
		textos: [
			{w: 'writers', txt: 'ancient writers said:'},
			{w: 'harming', txt: 'harming a cat ='},
			{w: 'trouble', txt: 'SERIOUS trouble', cor: 'vermelho', marca: true},
		],
	},
	// 24
	{
		textos: [
			{w: 'golden', txt: 'the golden age', x: 1250, y: 400, marca: true},
			{w: 'spread', txt: 'cats spread out', x: 1250, y: 495},
			{w: 'world', txt: 'to the world', x: 1250, y: 590},
		],
		extras: [{tipo: 'mapa', w: 'golden', x: 300, y: 560, lugares: LUGARES, rota: 'spread'}],
	},
	// 25 — CAP 4
	{
		abre: true,
		textos: [
			{w: 'rats', txt: 'grain -> rats', x: 1150, y: 400},
			{w: 'sailors', txt: 'sailors brought...', x: 1150, y: 495},
			{w: 'pest', txt: 'the best pest control: cats', x: 1150, y: 590, marca: true, tam: 56},
		],
		extras: [{tipo: 'barco', x: 600, y: 780}],
	},
	// 26
	{
		textos: [
			{w: 'trading', txt: 'trade routes', x: 1250, y: 400, marca: true},
			{w: 'europe', txt: 'Europe, Asia...', x: 1250, y: 495},
			{w: 'beyond', txt: '...and beyond', x: 1250, y: 590},
		],
		extras: [{tipo: 'mapa', x: 300, y: 560, lugares: [LUGARES[2], LUGARES[1], LUGARES[0], LUGARES[3]], rota: 'mediterranean'}],
	},
	// 27
	{
		textos: [
			{w: 'genetic', txt: '2017 genetic study', x: 1150, y: 400},
			{w: 'routes', txt: 'cat remains along the routes', x: 1150, y: 495, tam: 56},
			{w: 'viking', txt: 'even a Viking port!', x: 1150, y: 590, marca: true},
		],
		extras: [{tipo: 'barco', w: 'viking', x: 600, y: 780, viking: true}],
	},
	// 28
	{
		gato: {rabo: 'alto', x: 560, y: 640, escala: 0.55},
		colX: 1150,
		textos: [
			{w: 'vikings', txt: 'Vikings had cats!', marca: true},
			{w: 'board', txt: 'on board & at home'},
			{w: 'rodents', txt: 'protecting food & furs'},
		],
		extras: [{tipo: 'barco', x: 600, y: 780, viking: true}],
	},
	// 29
	{
		gato: {rabo: 'alto', x: 560, y: 640, escala: 0.55},
		colX: 1150,
		textos: [
			{w: 'centuries', txt: "every ship: a ship's cat"},
			{w: 'luck', txt: '= good luck', cor: 'verde', marca: true},
		],
		extras: [{tipo: 'barco', x: 600, y: 780}],
	},
	// 30
	{
		gato: {rabo: 'alto', x: 560, y: 640, escala: 0.55},
		colX: 1150,
		textos: [
			{w: 'royal', txt: 'British Royal Navy'},
			{w: 'centuries', txt: 'cats on board for centuries'},
			{w: 'banned', txt: 'until 1975!', marca: true},
		],
		extras: [{tipo: 'barco', x: 600, y: 780}],
	},
	// 31
	{
		textos: [
			{w: 'desert', txt: 'from one desert cat...', x: 260, y: 400},
			{w: 'continent', txt: 'to every continent', x: 260, y: 495, marca: true},
			{w: 'antarctica', txt: '(except Antarctica)', x: 260, y: 590, cor: 'grafite'},
		],
		gato: {rabo: 'alto', x: 1500, olhos: 'lento'},
	},
	// 32 — CAP 5
	{
		abre: true,
		gato: {pelagem: 'preto', olhos: 'dilatado'},
		textos: [
			{w: 'kind', txt: 'not every era was kind'},
			{w: 'reputation', txt: 'a bad reputation', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'lua', w: 'dark', x: 1650, y: 720}],
	},
	// 33
	{
		gato: {pelagem: 'preto', olhos: 'dilatado'},
		textos: [
			{w: 'independence', txt: 'independent'},
			{w: 'glowing', txt: 'glowing eyes'},
			{w: 'night', txt: 'out at night'},
			{w: 'witchcraft', txt: '-> "witchcraft"', cor: 'vermelho', marca: true},
		],
		extras: [{tipo: 'chapeu', w: 'witchcraft', x: 1550, y: 760, s: 0.8}],
	},
	// 34
	{
		gato: {pelagem: 'preto', rabo: 'entre', orelhas: 'lado'},
		textos: [
			{w: 'persecuted', txt: 'persecuted'},
			{w: 'hard', txt: 'a hard time to be a cat', marca: true},
		],
	},
	// 35
	{
		textos: [
			{w: 'plague', txt: 'the plague story:', x: 260, y: 360},
			{w: 'rats', txt: 'fewer cats -> more rats?', x: 260, y: 455},
			{w: 'debate', txt: 'historians still debate it', x: 260, y: 550, marca: true},
		],
		postit: {w: 'salt', linhas: ['grain of', 'salt!'], x: 1450, y: 600},
	},
	// 36
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'superstition', txt: 'superstition never won'},
			{w: 'farmers', txt: 'farmers & millers'},
			{w: 'sailors', txt: 'sailors'},
			{w: 'rodents', txt: 'needed rodent catchers', marca: true},
		],
		extras: [{tipo: 'rato', w: 'rodents', x: 820, y: 840}],
	},
	// 37 — CAP 6
	{
		abre: true,
		textos: [
			{w: 'thousand', txt: '1,000+ years ago', x: 1050, y: 420},
			{w: 'scrolls', txt: 'protecting books & scrolls', x: 1050, y: 520, marca: true},
		],
		extras: [{tipo: 'pergaminho', x: 560, y: 600, s: 1.1}],
	},
	// 38
	{
		gato: {rabo: 'alto', x: 500},
		colX: 1080,
		textos: [
			{w: 'silk', txt: 'silk farmers'},
			{w: 'silkworms', txt: 'mice vs silkworms'},
			{w: 'charms', txt: 'cat charms & statues', marca: true},
		],
		extras: [{tipo: 'rato', w: 'silkworms', x: 800, y: 840}],
	},
	// 39
	{
		textos: [
			{w: 'maneki-neko', txt: 'the maneki-neko', x: 1050, y: 400, marca: true},
			{w: 'beckoning', txt: '= the beckoning cat', x: 1050, y: 495},
			{w: 'shops', txt: 'in shops & restaurants', x: 1050, y: 590},
		],
		extras: [{tipo: 'maneki', x: 560, y: 840, s: 1.15}],
	},
	// 40
	{
		textos: [
			{w: 'luck', txt: 'luck & customers', x: 1050, y: 400},
			{w: 'left', txt: 'left paw = people', x: 1050, y: 495},
			{w: 'money', txt: 'right paw = money', x: 1050, y: 590, marca: true},
		],
		extras: [{tipo: 'maneki', x: 560, y: 840, s: 1.15}],
	},
	// 41
	{
		textos: [
			{w: 'islands', txt: 'cat islands!', x: 260, y: 400, marca: true},
			{w: 'tashirojima', txt: 'Tashirojima', x: 260, y: 495},
			{w: 'outnumber', txt: 'cats outnumber people', x: 260, y: 590},
		],
		extras: [{tipo: 'ilha', w: 'islands', x: 1350, y: 780}],
	},
	// 42
	{
		gato: {pelagem: 'preto', olhos: 'fenda', rabo: 'swish'},
		textos: [
			{w: 'folklore', txt: 'darker legends:'},
			{w: 'bakeneko', txt: 'bakeneko'},
			{w: 'nekomata', txt: 'nekomata'},
			{w: 'powers', txt: 'magical cats', marca: true},
		],
	},
	// 43 — CAP 7
	{
		abre: true,
		gato: {rabo: 'alto', olhos: 'lento'},
		textos: [{w: 'celebrities', txt: 'true celebrities', marca: true}],
		extras: [{tipo: 'roseta', w: 'celebrities', x: 1450, y: 640, txt: 'STAR'}],
	},
	// 44
	{
		textos: [
			{w: 'felicette', txt: '1963: Felicette', x: 1050, y: 400, marca: true},
			{w: 'safely', txt: 'came back safely', x: 1050, y: 495, cor: 'verde'},
			{w: 'only', txt: 'the only cat in space', x: 1050, y: 590},
		],
		extras: [{tipo: 'foguete', w: 'rocket', x: 560, y: 840}],
	},
	// 45
	{
		gato: {rabo: 'alto', olhos: 'meio'},
		textos: [
			{w: 'talkeetna', txt: 'Talkeetna, Alaska'},
			{w: 'stubbs', txt: 'Stubbs the cat'},
			{w: 'mayor', txt: 'honorary MAYOR', marca: true},
			{w: 'twenty', txt: 'for ~20 years!'},
		],
		extras: [{tipo: 'roseta', w: 'mayor', x: 720, y: 520, s: 0.6, txt: 'MAYOR'}],
	},
	// 46
	{
		gato: {rabo: 'alto', x: 760, escala: 0.75},
		colX: 1100,
		textos: [
			{w: 'larry', txt: 'Larry'},
			{w: 'chief', txt: 'Chief Mouser', marca: true},
			{w: 'downing', txt: '10 Downing Street'},
		],
		extras: [{tipo: 'porta10', x: 450, y: 840}],
	},
	// 47
	{
		gato: {rabo: 'alto', x: 760, escala: 0.75, olhos: 'lento'},
		colX: 1100,
		textos: [
			{w: 'outlasted', txt: 'outlasted several PMs'},
			{w: 'stays', txt: 'PMs go, the cat stays', marca: true},
		],
		extras: [{tipo: 'porta10', x: 450, y: 840}],
	},
	// 48
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'writers', txt: 'writers who loved cats:'},
			{w: 'twain', txt: 'Mark Twain'},
			{w: 'hemingway', txt: 'Ernest Hemingway'},
			{w: 'florida', txt: 'his home: still full of cats', marca: true, tam: 56},
		],
	},
	// 49
	{
		gato: {olhos: 'meio'},
		textos: [
			{w: 'newton', txt: 'Isaac Newton...'},
			{w: 'flap', txt: '...invented the cat flap?'},
			{w: 'proof', txt: 'no real proof!', cor: 'vermelho', marca: true},
		],
	},
	// 50 — CAP 8
	{
		abre: true,
		gato: {pelagem: 'selvagem', pose: 'agachado', x: 520},
		colX: 1150,
		textos: [
			{w: 'looks', txt: 'not bred for looks'},
			{w: 'nature', txt: 'shaped by nature', marca: true},
		],
	},
	// 51
	{
		gato: {rabo: 'alto', x: 500},
		colX: 1080,
		textos: [
			{w: 'show', txt: '1871: the first cat show'},
			{w: 'crystal', txt: 'Crystal Palace, London'},
			{w: 'fur', txt: 'fur, color, shape...', marca: true},
		],
		extras: [{tipo: 'roseta', w: 'show', x: 780, y: 500, s: 0.7, txt: '1st'}],
	},
	// 52
	{
		gatos: [{pelagem: 'siames', x: 380, escala: 0.6}, {pelagem: 'selvagem', x: 640, escala: 0.6, w: 'breeds'}, {pelagem: 'preto', x: 900, escala: 0.6, w: 'created'}],
		colX: 1150,
		textos: [
			{w: 'breeds', txt: 'most breeds:'},
			{w: 'fifty', txt: 'only ~150 years old', marca: true},
		],
	},
	// 53
	{
		gato: {pelagem: 'siames'},
		textos: [
			{w: 'siamese', txt: 'the Siamese (hi!)'},
			{w: 'thailand', txt: 'from Thailand'},
			{w: 'siam', txt: 'the old kingdom of Siam'},
			{w: 'manuscripts', txt: 'in old Thai manuscripts', marca: true},
		],
		extras: [{tipo: 'pergaminho', w: 'manuscripts', x: 1550, y: 780, s: 0.6}],
	},
	// 54
	{
		gato: {pelagem: 'siames', olhos: 'normal'},
		textos: [
			{w: 'britain', txt: 'arrived in Britain'},
			{w: 'eighteen', txt: 'late 1800s'},
			{w: 'blue', txt: 'blue eyes & dark points', marca: true},
		],
		extras: [{tipo: 'circulo', w: 'blue', x: 560, y: 617, rx: 90, ry: 40}],
	},
	// 55
	{
		gato: {pelagem: 'selvagem', escala: 1.25, rabo: 'alto'},
		textos: [
			{w: 'maine', txt: 'the Maine Coon'},
			{w: 'biggest', txt: 'one of the biggest breeds'},
			{w: 'official', txt: 'official state cat of Maine', marca: true, tam: 56},
		],
	},
	// 56
	{
		gatos: [{x: 360, escala: 0.55}, {pelagem: 'siames', x: 560, escala: 0.55}, {pelagem: 'preto', x: 760, escala: 0.55}, {pelagem: 'selvagem', x: 960, escala: 0.55}],
		colX: 1150,
		textos: [
			{w: 'hundreds', txt: 'hundreds of millions today'},
			{w: 'popular', txt: 'the most popular pet', marca: true},
		],
	},
	// 57 — CAP 9
	{
		abre: true,
		gatos: [{pelagem: 'selvagem', x: 420, escala: 0.75}, {x: 760, escala: 0.75, w: 'genetically'}],
		colX: 1100,
		textos: [
			{w: 'genetically', txt: 'genetically...'},
			{w: 'ancestors', txt: 'still very close!', marca: true},
		],
	},
	// 58
	{
		gato: {rabo: 'alto'},
		textos: [
			{w: 'dogs', txt: 'dogs: changed a LOT'},
			{w: 'less', txt: 'cats: much less'},
			{w: 'tolerant', txt: 'more tolerant of us'},
			{w: 'sociable', txt: 'a bit more sociable', marca: true},
		],
	},
	// 59
	{
		gatos: [{pelagem: 'selvagem', x: 420, escala: 0.75}, {x: 760, escala: 0.75}],
		colX: 1100,
		textos: [
			{w: 'smaller', txt: 'slightly smaller brains'},
			{w: 'tame', txt: '(common in tame animals)', cor: 'grafite'},
			{w: 'same', txt: 'outside: almost the same', marca: true},
		],
	},
	// 60
	{
		gato: {olhos: 'lento', muda: [{w: 'fierce', olhos: 'fenda', orelhas: 'lado', boca: 'chiado'}]},
		textos: [
			{w: 'cuddly', txt: 'cuddly couch potato...', cor: 'verde'},
			{w: 'fierce', txt: '...fierce hunter', cor: 'vermelho', marca: true},
		],
	},
	// 61
	{
		gato: {pelagem: 'selvagem', pose: 'agachado', x: 520},
		colX: 1150,
		textos: [
			{w: 'semi-domesticated', txt: 'semi-domesticated', marca: true},
			{w: 'outside', txt: 'back outside...'},
			{w: 'survive', txt: 'can often survive alone'},
		],
	},
	// 62
	{
		gato: {rabo: 'alto', olhos: 'lento'},
		textos: [
			{w: 'independence', txt: 'never gave up independence'},
			{w: 'want', txt: 'they live with us by CHOICE', marca: true},
		],
		extras: [{tipo: 'coracao', w: 'want', x: 740, y: 450}],
	},
	// 63
	{
		textos: [{w: 'keyboard', txt: 'your cat = 10,000 years of history', x: 260, y: 260, marca: true, tam: 70}],
		extras: [{tipo: 'linhaTempo', w: 'ten', x: 260, y: 600, largura: 1500, marcas: TEMPO, destaque: 4}],
	},
	// 64
	{
		gato: {rabo: 'alto', olhos: 'lento'},
		textos: [
			{w: 'choose', txt: "we didn't choose cats..."},
			{w: 'chose', txt: 'cats chose us', marca: true},
			{w: 'running', txt: "(and they're in charge)", cor: 'grafite'},
		],
		extras: [{tipo: 'roseta', w: 'running', x: 740, y: 470, s: 0.55, txt: 'BOSS'}],
	},
	// 65
	{
		gato: {pelagem: 'siames', olhos: 'lento', x: 1560},
		textos: [
			{w: 'history', txt: 'Which part surprised you most?', x: 260, y: 300, tam: 72},
			{w: 'comments', txt: 'tell me in the comments!', x: 380, y: 600, marca: true, tam: 76},
		],
		extras: [{tipo: 'seta', w: 'comments', de: {x: 330, y: 400}, para: {x: 330, y: 580}, cor: 'vermelho'}],
	},
];
