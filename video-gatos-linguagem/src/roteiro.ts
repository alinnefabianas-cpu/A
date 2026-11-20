import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "How to read your cat: the complete body language guide" (~10 min) (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string; cap: number};

export const ROTEIRO: Trecho[] = [
	{cena: 's00', cap: 0, texto: "Your cat is talking to you all day long. Not with words, but with its tail, its ears, its eyes and its whole body.", destaque: ["talking", "tail", "ears", "eyes", "body"]},
	{cena: 's01', cap: 0, texto: "Most people miss almost all of it. So in this video, we're going to learn to read your cat like a book, one signal at a time.", destaque: ["miss", "read", "signal"]},
	{cena: 's02', cap: 0, texto: "By the end, you'll know when your cat loves you, when it's scared, and exactly when to stop petting before you get bitten.", destaque: ["loves", "scared", "stop", "bitten"]},
	{cena: 's03', cap: 1, texto: "Chapter one: the tail. The tail is like your cat's mood antenna, and it's the easiest signal to read from across the room.", destaque: ["tail", "mood", "antenna", "easiest"]},
	{cena: 's04', cap: 1, texto: "A tail held straight up is a friendly hello. Cats greet each other this way, and when your cat walks toward you like this, it's happy to see you.", destaque: ["straight", "hello", "greet", "happy"]},
	{cena: 's05', cap: 1, texto: "If the tip curls over like a question mark, even better. That usually means your cat is in a friendly, curious, playful mood.", destaque: ["question", "friendly", "curious", "playful"]},
	{cena: 's06', cap: 1, texto: "And if that upright tail starts to quiver, your cat is really excited. It's often what you see when you come home or open the treat bag.", destaque: ["quiver", "excited", "home", "treat"]},
	{cena: 's07', cap: 1, texto: "Now, the warning signs. A puffed-up tail, like a bottle brush, means your cat is startled or scared, and it's trying to look bigger.", destaque: ["warning", "bottle", "scared", "bigger"]},
	{cena: 's08', cap: 1, texto: "A tail held low, or tucked between the legs, means your cat feels nervous or unsure. Give it some space and let it come to you.", destaque: ["low", "tucked", "nervous", "space"]},
	{cena: 's09', cap: 1, texto: "Here's the one people get wrong the most. A tail swishing hard from side to side is not a happy wag, like in dogs. In cats, it usually means irritation.", destaque: ["wrong", "swishing", "dogs", "irritation"]},
	{cena: 's10', cap: 1, texto: "A slow swish, or just the tip twitching, means your cat is focused, maybe watching prey, or getting a little annoyed. Pay attention to what comes next.", destaque: ["slow", "twitching", "focused", "annoyed"]},
	{cena: 's11', cap: 1, texto: "And when your cat wraps its tail around your leg or your arm, that's the cat version of a hug. It's a sign of affection.", destaque: ["wraps", "hug", "affection"]},
	{cena: 's12', cap: 2, texto: "Chapter two: the ears. Cats have more than thirty muscles in each ear, so they can point them almost anywhere.", destaque: ["ears", "thirty", "muscles"]},
	{cena: 's13', cap: 2, texto: "Ears facing forward mean your cat is relaxed, alert or interested. It's the default position of a calm, confident cat.", destaque: ["forward", "relaxed", "interested", "confident"]},
	{cena: 's14', cap: 2, texto: "Ears that keep turning like little radars mean your cat is listening carefully, trying to figure out what's going on around it.", destaque: ["turning", "radars", "listening"]},
	{cena: 's15', cap: 2, texto: "When the ears turn sideways and flatten a bit, like airplane wings, your cat is irritated or anxious. This is a good moment to back off.", destaque: ["sideways", "airplane", "irritated", "anxious"]},
	{cena: 's16', cap: 2, texto: "And ears pressed flat against the head mean real fear, or a cat ready to defend itself. Don't reach for a cat with ears like this.", destaque: ["flat", "fear", "defend"]},
	{cena: 's17', cap: 3, texto: "Chapter three: the eyes. Pupils change size with the light, but they also change with emotion.", destaque: ["eyes", "pupils", "light", "emotion"]},
	{cena: 's18', cap: 3, texto: "Big, round pupils can mean excitement, playfulness or fear. You need to look at the rest of the body to know which one it is.", destaque: ["round", "excitement", "playfulness", "fear"]},
	{cena: 's19', cap: 3, texto: "Narrow, slit pupils in normal light can mean a tense or irritated cat, especially if the ears and tail agree.", destaque: ["narrow", "slit", "tense", "irritated"]},
	{cena: 's20', cap: 3, texto: "A long, hard stare is a challenge in the cat world. That's why cats often walk straight to the one person in the room who ignores them.", destaque: ["stare", "challenge", "ignores"]},
	{cena: 's21', cap: 3, texto: "And then there's the slow blink. When your cat looks at you and slowly closes and opens its eyes, it's a sign that it feels relaxed and safe with you.", destaque: ["slow", "blink", "relaxed", "safe"]},
	{cena: 's22', cap: 3, texto: "In one study, cats were more likely to approach a stranger who slow blinked at them. So you can blink back. It actually works.", destaque: ["study", "approach", "blink", "works"]},
	{cena: 's23', cap: 4, texto: "Chapter four: the whiskers. Relaxed whiskers stick out to the sides. Whiskers pushed forward mean your cat is curious, or focused on something it wants to catch.", destaque: ["whiskers", "relaxed", "forward", "curious"]},
	{cena: 's24', cap: 4, texto: "Whiskers pulled back flat against the face mean your cat is scared or defensive. Combined with flat ears, it's a clear stop sign.", destaque: ["back", "scared", "defensive", "stop"]},
	{cena: 's25', cap: 5, texto: "Chapter five: the body. A cat sitting like a loaf of bread, with its paws tucked under, is comfortable and calm.", destaque: ["body", "loaf", "bread", "calm"]},
	{cena: 's26', cap: 5, texto: "A cat lying on its back and showing its belly is showing huge trust, because the belly is its most vulnerable spot.", destaque: ["belly", "trust", "vulnerable"]},
	{cena: 's27', cap: 5, texto: "But careful. A belly up is not always an invitation to rub. Many cats love showing the belly and hate having it touched. It's the famous belly trap.", destaque: ["careful", "invitation", "hate", "trap"]},
	{cena: 's28', cap: 5, texto: "An arched back with all the fur standing up, the classic Halloween cat, means your cat is frightened and trying to look as big as possible.", destaque: ["arched", "fur", "halloween", "frightened"]},
	{cena: 's29', cap: 5, texto: "An arched back without puffed fur is totally different. That's just a stretch, or a cat rubbing against you to say hello.", destaque: ["without", "different", "stretch", "hello"]},
	{cena: 's30', cap: 5, texto: "A cat crouched low to the ground with a tense body is either scared, or hunting. Look at the eyes and the tail to tell the difference.", destaque: ["crouched", "scared", "hunting", "difference"]},
	{cena: 's31', cap: 5, texto: "And that little butt wiggle right before a pounce? That's pure hunting instinct, getting the back legs ready to launch.", destaque: ["wiggle", "pounce", "instinct", "launch"]},
	{cena: 's32', cap: 5, texto: "Finally, when your cat sleeps right next to you, or on you, it's choosing you as a safe place to be at its most defenseless.", destaque: ["sleeps", "safe", "defenseless"]},
	{cena: 's33', cap: 6, texto: "Chapter six: the sounds. As we saw on this channel, adult cats mostly meow for us humans, and each cat builds its own set of meows.", destaque: ["sounds", "meow", "humans", "own"]},
	{cena: 's34', cap: 6, texto: "A short, cheerful meow is usually a greeting. A long, drawn-out meow is usually a demand, often for food or for a door to be opened.", destaque: ["short", "greeting", "long", "demand"]},
	{cena: 's35', cap: 6, texto: "The trill is that cute rolling sound, like a mix between a meow and a purr. Mother cats use it to call their kittens, and your cat uses it to say hi, or follow me.", destaque: ["trill", "rolling", "kittens", "follow"]},
	{cena: 's36', cap: 6, texto: "Purring usually means contentment. But cats also purr when they're stressed, sick or in pain, probably to calm themselves down.", destaque: ["purring", "contentment", "stressed", "pain"]},
	{cena: 's37', cap: 6, texto: "So a purring cat that's hiding, not eating, or acting strange might actually need a vet, not a cuddle.", destaque: ["hiding", "eating", "vet"]},
	{cena: 's38', cap: 6, texto: "Chattering is that clicking sound at birds through the window. It shows excitement, and maybe a little frustration.", destaque: ["chattering", "birds", "excitement", "frustration"]},
	{cena: 's39', cap: 6, texto: "A hiss is a clear warning: back off. Most hissing cats aren't aggressive, they're scared and asking for space.", destaque: ["hiss", "warning", "scared", "space"]},
	{cena: 's40', cap: 6, texto: "A growl is a stronger warning. If your cat growls, stop what you're doing and give it room.", destaque: ["growl", "stronger", "stop", "room"]},
	{cena: 's41', cap: 6, texto: "And a loud yowl can mean a cat looking for a mate, a cat in distress, or in older cats, confusion. If it's new, it's worth a vet visit.", destaque: ["yowl", "mate", "distress", "confusion", "vet"]},
	{cena: 's42', cap: 7, texto: "Chapter seven: how cats say I love you. Cats rarely make it obvious, but they show it all the time.", destaque: ["love", "obvious", "time"]},
	{cena: 's43', cap: 7, texto: "Head bumps and cheek rubs leave their scent on you. You're being marked as family.", destaque: ["head", "cheek", "scent", "family"]},
	{cena: 's44', cap: 7, texto: "Kneading on your lap is a leftover from kittenhood. It means your cat feels safe and happy, like it did with its mother.", destaque: ["kneading", "kittenhood", "safe", "mother"]},
	{cena: 's45', cap: 7, texto: "Licking you, or grooming your hair, is called allogrooming. Cats do it with the cats they're bonded to. You're part of the group.", destaque: ["licking", "allogrooming", "bonded", "group"]},
	{cena: 's46', cap: 7, texto: "And yes, turning around and showing you its butt is a compliment. Cats greet each other by sniffing there, so your cat is basically saying hello.", destaque: ["butt", "compliment", "sniffing", "hello"]},
	{cena: 's47', cap: 7, texto: "Following you from room to room, even to the bathroom, means your cat wants to be where you are. You're its favorite company.", destaque: ["following", "bathroom", "favorite"]},
	{cena: 's48', cap: 7, texto: "Bringing you prey, sleeping on your clothes, and greeting you at the door are all signs of a strong bond.", destaque: ["prey", "clothes", "door", "bond"]},
	{cena: 's49', cap: 7, texto: "And the slow blink, again, is maybe the purest one of all. It's your cat saying: I trust you.", destaque: ["blink", "purest", "trust"]},
	{cena: 's50', cap: 8, texto: "Chapter eight: reading the whole cat. One signal alone can trick you. The secret is to read the tail, ears, eyes and body together.", destaque: ["whole", "trick", "secret", "together"]},
	{cena: 's51', cap: 8, texto: "For example, a purring cat with a lashing tail and ears turning back is not happy. It's telling you it has had enough.", destaque: ["purring", "lashing", "back", "enough"]},
	{cena: 's52', cap: 8, texto: "Some cats get overstimulated when you pet them for too long. It can go from purring to biting in seconds.", destaque: ["overstimulated", "long", "biting", "seconds"]},
	{cena: 's53', cap: 8, texto: "Watch for the warning signs: the tail starts twitching, the skin on the back ripples, the ears turn sideways, and the cat stops purring.", destaque: ["warning", "twitching", "ripples", "sideways", "stops"]},
	{cena: 's54', cap: 8, texto: "When you see those signs, stop petting and let your cat go. If you respect the warning, you'll almost never get bitten.", destaque: ["stop", "respect", "never"]},
	{cena: 's55', cap: 9, texto: "Chapter nine: how to speak cat. First, let the cat come to you. Offer a finger or a knuckle at nose height, and let it sniff.", destaque: ["speak", "come", "knuckle", "sniff"]},
	{cena: 's56', cap: 9, texto: "Pet the places cats like most: the cheeks, under the chin, and the base of the ears. Most cats prefer short, gentle strokes there.", destaque: ["cheeks", "chin", "ears", "gentle"]},
	{cena: 's57', cap: 9, texto: "Avoid staring, avoid sudden moves, and don't grab a cat that's trying to leave. Cats love having the choice.", destaque: ["staring", "sudden", "grab", "choice"]},
	{cena: 's58', cap: 9, texto: "And use the slow blink. Look at your cat, soften your eyes, and slowly blink. Many cats will blink back.", destaque: ["slow", "soften", "blink", "back"]},
	{cena: 's59', cap: 0, texto: "Now you can read the tail, the ears, the eyes, the whiskers, the body and the sounds. Your cat has been talking this whole time, and now you can listen.", destaque: ["tail", "ears", "eyes", "whiskers", "body", "sounds", "listen"]},
	{cena: 's60', cap: 0, texto: "Which signal does your cat use the most? Tell me in the comments, and try a slow blink with your cat today.", destaque: ["signal", "comments", "blink"]},
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
