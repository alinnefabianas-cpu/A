import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "How cats see, hear and smell the world" (~10 min) (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string; cap: number};

export const ROTEIRO: Trecho[] = [
	{cena: 's00', cap: 0, texto: "Your cat lives in the same house as you, but it experiences a completely different world. It sees, hears and smells things you can't even imagine.", destaque: ["different", "sees", "hears", "smells"]},
	{cena: 's01', cap: 0, texto: "Some of its senses are real superpowers. Others are surprisingly weak. And understanding them explains a lot of your cat's strange behavior.", destaque: ["superpowers", "weak", "strange"]},
	{cena: 's02', cap: 0, texto: "So today, let's step into your cat's head and find out how cats really see, hear, smell and feel the world.", destaque: ["head", "see", "hear", "smell", "feel"]},
	{cena: 's03', cap: 1, texto: "Chapter one: vision. Let's start with the eyes, because they're probably the most impressive thing about your cat.", destaque: ["vision", "eyes", "impressive"]},
	{cena: 's04', cap: 1, texto: "Cats can see in light about six times dimmer than what we need. That's why your cat moves through a dark house without bumping into anything.", destaque: ["six", "dimmer", "dark"]},
	{cena: 's05', cap: 1, texto: "Part of the secret is a mirror-like layer at the back of the eye, called the tapetum lucidum. It bounces light back through the eye a second time.", destaque: ["mirror", "tapetum", "lucidum", "bounces", "second"]},
	{cena: 's06', cap: 1, texto: "That layer is also why cat eyes glow in the dark when a light hits them. It's not magic, it's a built-in light booster.", destaque: ["glow", "magic", "booster"]},
	{cena: 's07', cap: 1, texto: "But that night vision has a price: colors. Cats see blues and greens well, but reds probably look dull and grayish to them.", destaque: ["price", "colors", "blues", "greens", "reds"]},
	{cena: 's08', cap: 1, texto: "So that bright red toy you bought? To your cat, it might look a lot more boring than it does to you.", destaque: ["red", "boring"]},
	{cena: 's09', cap: 1, texto: "Cats also don't see details as sharply as we do. Something you see clearly from far away looks blurry to a cat, until it gets much closer.", destaque: ["details", "sharply", "blurry", "closer"]},
	{cena: 's10', cap: 1, texto: "And up close, it's even stranger. Cats have trouble focusing on things right under their nose. That's one reason they sniff and touch before they look.", destaque: ["stranger", "focusing", "nose", "sniff"]},
	{cena: 's11', cap: 1, texto: "Where cats really win is motion. Their eyes are built to catch the tiniest movement, like a mouse tail twitching in the grass.", destaque: ["win", "motion", "tiniest", "mouse"]},
	{cena: 's12', cap: 1, texto: "That's why a toy that sits still is boring, and the exact same toy is irresistible the moment it moves.", destaque: ["still", "boring", "irresistible", "moves"]},
	{cena: 's13', cap: 1, texto: "And cats have a wider field of view than we do, about two hundred degrees, compared with roughly one hundred eighty for us. Sneaking up on a cat is harder than you think.", destaque: ["wider", "field", "two", "sneaking"]},
	{cena: 's14', cap: 2, texto: "Chapter two: hearing. If the eyes are impressive, the ears are on another level.", destaque: ["hearing", "ears", "level"]},
	{cena: 's15', cap: 2, texto: "Humans hear sounds up to about twenty thousand hertz. Cats can hear up to around sixty-four thousand hertz, far into what we call ultrasound.", destaque: ["humans", "twenty", "sixty-four", "ultrasound"]},
	{cena: 's16', cap: 2, texto: "That means your cat can hear the high-pitched squeaks of mice and other small animals that are completely silent to you.", destaque: ["squeaks", "mice", "silent"]},
	{cena: 's17', cap: 2, texto: "Each ear can rotate independently, almost one hundred eighty degrees, like two satellite dishes pointing at different sounds at the same time.", destaque: ["rotate", "independently", "satellite"]},
	{cena: 's18', cap: 2, texto: "Cats can also figure out where a sound is coming from with amazing precision. Useful when your dinner is hiding under a pile of leaves.", destaque: ["where", "precision", "dinner", "leaves"]},
	{cena: 's19', cap: 2, texto: "And here's a fun one: a study in Japan found that cats can tell their owner's voice apart from a stranger's. They just don't always come when you call.", destaque: ["study", "japan", "voice", "stranger", "call"]},
	{cena: 's20', cap: 2, texto: "Because their hearing is so sensitive, loud sounds like vacuum cleaners, fireworks or shouting can be really stressful for cats.", destaque: ["sensitive", "vacuum", "fireworks", "stressful"]},
	{cena: 's21', cap: 3, texto: "Chapter three: smell. For a cat, the nose is like a newspaper. It's how it finds out who passed by and what happened while it was asleep.", destaque: ["smell", "nose", "newspaper", "asleep"]},
	{cena: 's22', cap: 3, texto: "Cats have far more scent-detecting cells than we do. Some estimates go up to two hundred million, compared with about five million in humans.", destaque: ["scent-detecting", "two", "five"]},
	{cena: 's23', cap: 3, texto: "And they have a second smelling system: a special organ on the roof of the mouth, called the vomeronasal organ.", destaque: ["second", "roof", "vomeronasal"]},
	{cena: 's24', cap: 3, texto: "When your cat sniffs something interesting and then freezes with its mouth slightly open, it's not disgusted. It's pushing the scent into that organ to analyze it.", destaque: ["sniffs", "mouth", "disgusted", "analyze"]},
	{cena: 's25', cap: 3, texto: "That funny face even has a name: the flehmen response. Big cats like lions and tigers do it too.", destaque: ["funny", "flehmen", "lions", "tigers"]},
	{cena: 's26', cap: 3, texto: "Smell is also how cats leave messages. They have scent glands on their cheeks, their paws and around the tail.", destaque: ["messages", "cheeks", "paws", "tail"]},
	{cena: 's27', cap: 3, texto: "When your cat scratches the sofa, it's not just sharpening its claws. It's also leaving a scent mark that says: I live here.", destaque: ["scratches", "sharpening", "mark", "live"]},
	{cena: 's28', cap: 3, texto: "Strong smells we find pleasant, like perfume, air fresheners or citrus, can be overwhelming for that powerful nose.", destaque: ["perfume", "fresheners", "citrus", "overwhelming"]},
	{cena: 's29', cap: 4, texto: "Chapter four: the whiskers. They're not just cute decorations. Whiskers are super sensitive touch sensors, packed with nerves at the root.", destaque: ["whiskers", "decorations", "sensors", "nerves"]},
	{cena: 's30', cap: 4, texto: "They help your cat judge if it can fit through a gap, because the whiskers on its face are roughly as wide as its body.", destaque: ["fit", "gap", "wide"]},
	{cena: 's31', cap: 4, texto: "Whiskers also feel tiny changes in the air, which helps a cat move in the dark and notice things around it without seeing them.", destaque: ["air", "dark", "without"]},
	{cena: 's32', cap: 4, texto: "Cats even have whiskers on the back of their front legs. They help them feel prey they're holding, right under their nose, where their eyes can't focus well.", destaque: ["legs", "prey", "nose", "focus"]},
	{cena: 's33', cap: 4, texto: "Some vets think deep, narrow bowls that brush against the whiskers can bother some cats. A wide, shallow bowl is an easy thing to try.", destaque: ["vets", "narrow", "bother", "shallow"]},
	{cena: 's34', cap: 4, texto: "And one important rule: never trim your cat's whiskers. It's like taking away part of its map of the world.", destaque: ["never", "trim", "map"]},
	{cena: 's35', cap: 5, texto: "Chapter five: taste. As we saw in another video on this channel, your cat can't taste sugar at all.", destaque: ["taste", "sugar"]},
	{cena: 's36', cap: 5, texto: "Cats have only about four hundred and seventy taste buds, compared with around nine thousand in humans.", destaque: ["seventy", "buds", "nine"]},
	{cena: 's37', cap: 5, texto: "Instead, their taste is tuned to meat. They're very sensitive to savory flavors, and they can also detect bitter tastes, which helps them avoid bad food.", destaque: ["meat", "savory", "bitter", "avoid"]},
	{cena: 's38', cap: 5, texto: "Many cats also seem to prefer fresh, moving water. That's why so many cats love drinking from the tap, or from a water fountain.", destaque: ["fresh", "moving", "tap", "fountain"]},
	{cena: 's39', cap: 6, texto: "Chapter six: touch and paws. Your cat's paw pads are full of nerve endings. They can feel textures, temperature and even vibrations through the ground.", destaque: ["touch", "pads", "textures", "temperature", "vibrations"]},
	{cena: 's40', cap: 6, texto: "Cats also sweat through their paws. That's why you can sometimes see wet paw prints on the table at the vet. Your cat is nervous.", destaque: ["sweat", "wet", "vet", "nervous"]},
	{cena: 's41', cap: 6, texto: "That sensitivity is one reason many cats don't like having their paws touched. For them, it's a very personal spot.", destaque: ["sensitivity", "touched", "personal"]},
	{cena: 's42', cap: 6, texto: "Their skin is sensitive too. Gentle, short strokes on the head and cheeks usually feel great, while long rubs along the back can get overwhelming.", destaque: ["skin", "gentle", "cheeks", "overwhelming"]},
	{cena: 's43', cap: 6, texto: "And when your cat taps something with its paw before touching it with its face, it's gathering information first. Paws are its hands and its sensors.", destaque: ["taps", "information", "hands", "sensors"]},
	{cena: 's44', cap: 7, texto: "Chapter seven: balance. Inside each ear, cats have a balance system that works like a super-precise level.", destaque: ["balance", "ear", "level"]},
	{cena: 's45', cap: 7, texto: "Combined with a flexible spine, it lets them walk on narrow fences and land on their feet after a fall.", destaque: ["flexible", "fences", "feet"]},
	{cena: 's46', cap: 7, texto: "The tail helps too. It works like the pole a tightrope walker uses, shifting weight to keep the body steady.", destaque: ["tail", "pole", "tightrope", "steady"]},
	{cena: 's47', cap: 7, texto: "That's why cats love high, narrow places like shelves and the backs of sofas. What looks risky to us is easy for them.", destaque: ["high", "shelves", "risky", "easy"]},
	{cena: 's48', cap: 7, texto: "But even with great balance, falls from windows and balconies are dangerous. Good balance is not the same as being able to fly.", destaque: ["windows", "balconies", "dangerous", "fly"]},
	{cena: 's49', cap: 8, texto: "Chapter eight: the internal clock. Cats are amazing at learning routines. Many know exactly when it's dinner time, sometimes to the minute.", destaque: ["clock", "routines", "dinner", "minute"]},
	{cena: 's50', cap: 8, texto: "They also notice when something in the routine changes, like a new piece of furniture, a new smell, or you coming home late.", destaque: ["notice", "furniture", "smell", "late"]},
	{cena: 's51', cap: 8, texto: "That's why changes like moving house or a new pet can stress a cat out. A predictable routine makes cats feel safe.", destaque: ["moving", "pet", "stress", "predictable", "safe"]},
	{cena: 's52', cap: 8, texto: "So when your cat wakes you up at the same time every morning, it's not being dramatic. It just knows the schedule better than you do.", destaque: ["wakes", "morning", "dramatic", "schedule"]},
	{cena: 's53', cap: 9, texto: "Chapter nine: how to use all of this at home. Let's turn these senses into simple tips.", destaque: ["home", "senses", "tips"]},
	{cena: 's54', cap: 9, texto: "For the eyes: choose toys that move in short, quick bursts, like a mouse running for cover. Movement is what turns on the hunter.", destaque: ["eyes", "bursts", "mouse", "hunter"]},
	{cena: 's55', cap: 9, texto: "And don't worry too much about color. A blue or green toy might actually stand out more to your cat than a red one.", destaque: ["color", "blue", "green", "red"]},
	{cena: 's56', cap: 9, texto: "For the ears: give your cat a quiet place to hide during loud events, and keep music and TV at a comfortable volume.", destaque: ["ears", "quiet", "hide", "volume"]},
	{cena: 's57', cap: 9, texto: "For the nose: keep the litter box away from the food bowl, avoid strong scented products, and let your cat sniff new things before they enter its space.", destaque: ["nose", "litter", "scented", "sniff"]},
	{cena: 's58', cap: 9, texto: "For the whiskers: try wide, shallow food bowls, and never trim them.", destaque: ["whiskers", "shallow", "never"]},
	{cena: 's59', cap: 9, texto: "For the paws and balance: give your cat scratching posts and high places to climb, so it can mark its territory and watch the world from above.", destaque: ["paws", "scratching", "high", "above"]},
	{cena: 's60', cap: 9, texto: "And for the internal clock: feed and play at about the same times every day. Routine is comfort.", destaque: ["clock", "feed", "play", "comfort"]},
	{cena: 's61', cap: 0, texto: "So the next time your cat stares at an empty corner, freezes with its mouth open, or ignores you when you call, remember: it's living in a world full of sounds, smells and movements you can't sense.", destaque: ["corner", "mouth", "ignores", "sounds", "smells", "movements"]},
	{cena: 's62', cap: 0, texto: "Your cat isn't weird. It's just running on a completely different set of senses.", destaque: ["weird", "different", "senses"]},
	{cena: 's63', cap: 0, texto: "Which of these cat superpowers surprised you the most? Tell me in the comments, and I'll see you in the next video.", destaque: ["superpowers", "surprised", "comments"]},
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
