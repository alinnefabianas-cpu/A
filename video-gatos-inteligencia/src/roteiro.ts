import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "How smart is your cat?" (~10 min) (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string; cap: number};

export const ROTEIRO: Trecho[] = [
	{cena: 's00', cap: 0, texto: "Is your cat secretly a genius? Some people say cats are too independent to be smart. But scientists have been testing cat brains, and the results are surprising.", destaque: ["genius", "independent", "scientists", "surprising"]},
	{cena: 's01', cap: 0, texto: "Cats remember, count, read our faces, follow where we point, and even learn each other's names.", destaque: ["remember", "count", "faces", "point", "names"]},
	{cena: 's02', cap: 0, texto: "So today, let's find out how smart your cat really is, and what's going on inside that little furry head.", destaque: ["smart", "inside", "head"]},
	{cena: 's03', cap: 1, texto: "Chapter one: the cat brain. A cat's brain weighs only about thirty grams, less than one percent of its body weight.", destaque: ["brain", "thirty", "grams", "percent"]},
	{cena: 's04', cap: 1, texto: "But size isn't everything. What matters most is the cortex, the thinking part of the brain, and how many neurons it has.", destaque: ["size", "cortex", "thinking", "neurons"]},
	{cena: 's05', cap: 1, texto: "Cats have about two hundred and fifty million neurons in their cortex. Dogs have about twice as many, and humans have around sixteen billion.", destaque: ["fifty", "million", "dogs", "twice", "sixteen", "billion"]},
	{cena: 's06', cap: 1, texto: "That might sound small, but cat brains are wired beautifully for what cats do best: hunting, problem solving and paying close attention.", destaque: ["wired", "hunting", "problem", "attention"]},
	{cena: 's07', cap: 1, texto: "In fact, the parts of the cat brain that handle vision and hearing are extremely developed. Your cat's brain is a precision hunting machine.", destaque: ["vision", "hearing", "developed", "precision", "machine"]},
	{cena: 's08', cap: 1, texto: "And cats sleep a lot. Scientists think sleep helps brains store what they learned during the day, so all those naps may be part of the plan.", destaque: ["sleep", "store", "learned", "naps"]},
	{cena: 's09', cap: 2, texto: "Chapter two: memory. Cats have good long-term memory. They remember people, places and routines for years.", destaque: ["memory", "long-term", "people", "places", "routines"]},
	{cena: 's10', cap: 2, texto: "Ever noticed how your cat knows exactly which cupboard has the treats? Or hides the moment it sees the cat carrier? That's memory at work.", destaque: ["cupboard", "treats", "hides", "carrier", "memory"]},
	{cena: 's11', cap: 2, texto: "Their short-term memory, or working memory, is shorter. In some experiments, cats remembered where an object was hidden for up to about a minute.", destaque: ["short-term", "working", "hidden", "minute"]},
	{cena: 's12', cap: 2, texto: "That's why distracting a cat works so well. Move the toy, and a few moments later, the old one may be forgotten.", destaque: ["distracting", "toy", "forgotten"]},
	{cena: 's13', cap: 2, texto: "Cats also seem to have episodic-like memory. In a 2020 study, cats remembered which bowls they had already eaten from, and which ones still had food.", destaque: ["episodic-like", "study", "bowls", "eaten", "food"]},
	{cena: 's14', cap: 2, texto: "So your cat doesn't just remember facts. It remembers what happened, where, and maybe even when.", destaque: ["facts", "what", "where", "when"]},
	{cena: 's15', cap: 2, texto: "Cats also remember bad experiences. That's why a cat that had a scary vet visit may hide the next time it hears the car keys.", destaque: ["bad", "scary", "vet", "keys"]},
	{cena: 's16', cap: 3, texto: "Chapter three: the cat physicist. If you hide a toy behind a pillow, your cat knows the toy still exists. This is called object permanence.", destaque: ["physicist", "pillow", "exists", "object", "permanence"]},
	{cena: 's17', cap: 3, texto: "Human babies develop it around eight months to a year. Cats master it as kittens, because hunters must track prey that disappears behind a bush.", destaque: ["babies", "eight", "kittens", "track", "bush"]},
	{cena: 's18', cap: 3, texto: "Cats also seem to understand a bit of physics. In one Japanese study, cats heard a rattling sound in a container, then watched it being tipped over.", destaque: ["physics", "japanese", "rattling", "container", "tipped"]},
	{cena: 's19', cap: 3, texto: "When nothing fell out, even though they had heard something inside, the cats stared longer. They expected an object to drop.", destaque: ["nothing", "stared", "expected", "drop"]},
	{cena: 's20', cap: 3, texto: "In other words, your cat uses sound to predict what's hidden inside things. That's very useful when your dinner is a mouse in the grass.", destaque: ["sound", "predict", "hidden", "mouse"]},
	{cena: 's21', cap: 3, texto: "And yes, this also explains why your cat knows exactly which bag has the treats, just from the sound.", destaque: ["bag", "treats", "sound"]},
	{cena: 's22', cap: 3, texto: "Many owners have also seen their cats learn to open doors by jumping on the handle. Cats learn a lot just by watching.", destaque: ["doors", "handle", "watching"]},
	{cena: 's23', cap: 4, texto: "Chapter four: can cats count? Not like we do. But they can tell small amounts apart.", destaque: ["count", "small", "amounts"]},
	{cena: 's24', cap: 4, texto: "In experiments, cats learned to choose a group of two dots or three dots, and kept choosing correctly, even when the dots changed size.", destaque: ["experiments", "two", "three", "correctly", "size"]},
	{cena: 's25', cap: 4, texto: "This ability probably helps in the wild, to choose the bigger group of prey, or to avoid the bigger group of rivals.", destaque: ["wild", "bigger", "prey", "rivals"]},
	{cena: 's26', cap: 4, texto: "So your cat may not notice if you give it two scoops of food instead of three. Actually, it probably does.", destaque: ["scoops", "two", "three", "actually"]},
	{cena: 's27', cap: 4, texto: "Scientists still don't know exactly how far this goes. Testing cats is hard, and most studies only use a small number of cats.", destaque: ["exactly", "hard", "small"]},
	{cena: 's28', cap: 5, texto: "Chapter five: reading people. Cats are much better at understanding humans than we give them credit for.", destaque: ["reading", "people", "understanding", "credit"]},
	{cena: 's29', cap: 5, texto: "In a 2005 study, cats were able to follow human pointing to find hidden food, almost as well as dogs.", destaque: ["study", "pointing", "hidden", "dogs"]},
	{cena: 's30', cap: 5, texto: "Cats also use social referencing. When they see something new and scary, many cats look at their owner first, to see how they react.", destaque: ["social", "referencing", "scary", "owner", "react"]},
	{cena: 's31', cap: 5, texto: "In one study, when owners sounded calm and positive about a strange object, cats tended to relax. When owners sounded scared, cats were more cautious.", destaque: ["calm", "positive", "relax", "scared", "cautious"]},
	{cena: 's32', cap: 5, texto: "Cats can also tell when we're smiling or frowning, and some research suggests they're a bit more affectionate when their owner looks happy.", destaque: ["smiling", "frowning", "affectionate", "happy"]},
	{cena: 's33', cap: 5, texto: "And when offered food, toys, scents and human attention, many cats in one study picked human attention first.", destaque: ["food", "toys", "scents", "attention"]},
	{cena: 's34', cap: 5, texto: "So your cat is paying attention to you, much more than it lets you see.", destaque: ["paying", "attention", "see"]},
	{cena: 's35', cap: 5, texto: "They also learn your schedule: when you wake up, when you come home, and when you usually feed them.", destaque: ["schedule", "wake", "home", "feed"]},
	{cena: 's36', cap: 6, texto: "Chapter six: words and names. Cats can recognize their own name, even when a stranger says it.", destaque: ["words", "names", "recognize", "stranger"]},
	{cena: 's37', cap: 6, texto: "A 2022 study went further. Cats that lived with other cats seemed to know the names of their feline housemates.", destaque: ["further", "feline", "housemates"]},
	{cena: 's38', cap: 6, texto: "When they heard one cat's name, and then saw a photo of a different cat, they looked at the screen longer, as if they were surprised.", destaque: ["heard", "photo", "different", "surprised"]},
	{cena: 's39', cap: 6, texto: "Cats also react more when we talk to them in that special high-pitched voice we use for pets.", destaque: ["react", "high-pitched", "voice", "pets"]},
	{cena: 's40', cap: 6, texto: "But only when it's their owner. When a stranger used the same cat voice, the cats didn't care much.", destaque: ["owner", "stranger", "care"]},
	{cena: 's41', cap: 6, texto: "So yes, that silly voice you use with your cat actually means something to it.", destaque: ["silly", "voice", "means"]},
	{cena: 's42', cap: 6, texto: "Many cats also learn words linked to their routine, like treat, dinner or vet. Some owners even have to spell those words out loud.", destaque: ["routine", "treat", "dinner", "spell"]},
	{cena: 's43', cap: 7, texto: "Chapter seven: the mental map. Cats keep track of where we are, even when they can't see us.", destaque: ["mental", "map", "track", "see"]},
	{cena: 's44', cap: 7, texto: "In a 2021 study, cats heard their owner's voice from one speaker, and then suddenly from another speaker far away.", destaque: ["study", "voice", "speaker", "suddenly", "far"]},
	{cena: 's45', cap: 7, texto: "The cats looked surprised, as if their owner had teleported. That suggests they were picturing where their owner was.", destaque: ["surprised", "teleported", "picturing"]},
	{cena: 's46', cap: 7, texto: "That's a skill once thought to be mostly human. Your cat is quietly keeping a map of your home, and of you.", destaque: ["skill", "human", "quietly", "map"]},
	{cena: 's47', cap: 7, texto: "This mental map also helps explain how cats move around the house so confidently, even in the dark.", destaque: ["mental", "map", "confidently", "dark"]},
	{cena: 's48', cap: 8, texto: "Chapter eight: so why do cats seem less smart than dogs? A big part of the answer is that cats are terrible test takers.", destaque: ["dogs", "answer", "terrible", "test"]},
	{cena: 's49', cap: 8, texto: "Researchers often joke that the hardest part of studying cats is getting them to show up. Many cats simply refuse to participate.", destaque: ["joke", "hardest", "show", "refuse"]},
	{cena: 's50', cap: 8, texto: "Dogs were bred for thousands of years to work with humans and follow instructions. Cats were mostly left to hunt on their own.", destaque: ["bred", "thousands", "instructions", "own"]},
	{cena: 's51', cap: 8, texto: "So a cat ignoring you doesn't mean it didn't understand. It often means it understood perfectly, and decided it had better things to do.", destaque: ["ignoring", "understand", "perfectly", "better"]},
	{cena: 's52', cap: 8, texto: "Cat intelligence is independent intelligence. It's built for solving problems alone, not for pleasing us.", destaque: ["independent", "intelligence", "alone", "pleasing"]},
	{cena: 's53', cap: 8, texto: "In fact, cats often do best when they're tested at home, in a place where they feel safe and relaxed.", destaque: ["home", "safe", "relaxed"]},
	{cena: 's54', cap: 9, texto: "Chapter nine: how to keep your cat's brain sharp. A bored brain can lead to stress, overeating and bad behavior.", destaque: ["sharp", "bored", "stress", "overeating", "behavior"]},
	{cena: 's55', cap: 9, texto: "Puzzle feeders make your cat think and work for its food, just like hunting does.", destaque: ["puzzle", "feeders", "think", "hunting"]},
	{cena: 's56', cap: 9, texto: "Rotate toys every few days. New things are exciting, and old toys feel new again after a short break.", destaque: ["rotate", "toys", "exciting", "break"]},
	{cena: 's57', cap: 9, texto: "Clicker training is great brain exercise. Cats can learn tricks like sit, high-five, spin, or even ringing a bell.", destaque: ["clicker", "training", "sit", "high-five", "spin", "bell"]},
	{cena: 's58', cap: 9, texto: "Window perches are great too. Watching birds and people outside is basically television for cats.", destaque: ["window", "perches", "birds", "television"]},
	{cena: 's59', cap: 9, texto: "Hide treats around the house and let your cat use its nose to find them. It turns snack time into a treasure hunt.", destaque: ["hide", "treats", "nose", "treasure"]},
	{cena: 's60', cap: 9, texto: "And keep talking to your cat. As we saw, cats really do listen, especially to your voice.", destaque: ["talking", "listen", "voice"]},
	{cena: 's61', cap: 9, texto: "Even five minutes of training or play a day can make a big difference for an indoor cat's happiness.", destaque: ["five", "training", "play", "happiness"]},
	{cena: 's62', cap: 0, texto: "So, is your cat smart? Science says yes. Just in a very cat way: independent, observant, and always one step ahead of the treat bag.", destaque: ["smart", "science", "independent", "observant", "treat"]},
	{cena: 's63', cap: 0, texto: "Your cat is reading your face, remembering your routine, and keeping track of where you are, all while pretending not to care.", destaque: ["face", "routine", "track", "pretending"]},
	{cena: 's64', cap: 0, texto: "How smart is your cat? Tell me the smartest thing your cat has ever done in the comments, and I'll see you in the next video.", destaque: ["smart", "smartest", "comments"]},
];

// ---------- tempo ----------
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const PAUSA = 0.6; // respiro entre trechos (s)
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
/** Casa as palavras do texto com os tempos reais da voz, letra por letra
 *  (funciona mesmo quando a voz junta várias palavras num só trecho, como "In 2007"). */
const alinhar = (texto: string, ts: {t: string; ini: number; fim: number}[]): Palavra[] | null => {
	// cada letra normalizada da voz ganha um tempo (interpolado dentro do trecho)
	const letras: number[] = [];
	let fluxo = '';
	for (const tk of ts) {
		const n = norm(tk.t);
		for (let i = 0; i < n.length; i++) {
			fluxo += n[i];
			letras.push(tk.ini + ((tk.fim - tk.ini) * (i + 0.5)) / n.length);
		}
	}
	const out: Palavra[] = [];
	let pos = 0;
	for (const txt of texto.split(/\s+/)) {
		const alvo = norm(txt);
		if (!alvo) continue;
		const achou = fluxo.indexOf(alvo, pos);
		if (achou < 0 || achou - pos > 12) return null;
		out.push({txt, ini: Math.round(letras[achou] * FPS), fim: Math.round(letras[achou + alvo.length - 1] * FPS)});
		pos = achou + alvo.length;
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
