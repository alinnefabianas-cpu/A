import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "12 cat myths debunked" (~10 min) (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string; cap: number};

export const ROTEIRO: Trecho[] = [
	{cena: 's00', cap: 0, texto: "There's a lot of advice out there about cats. Some of it is great. And some of it has been wrong for hundreds of years.", destaque: ["advice", "great", "wrong"]},
	{cena: 's01', cap: 0, texto: "Millions of people still believe things about cats that science has already proved false, and some of those myths can actually hurt your cat.", destaque: ["millions", "science", "false", "hurt"]},
	{cena: 's02', cap: 0, texto: "So today, we're busting twelve of the most common cat myths, one by one, and finding out what's really true.", destaque: ["busting", "twelve", "myths", "true"]},
	{cena: 's03', cap: 1, texto: "Myth number one: cats need milk. It's the classic cartoon image, a happy cat lapping up a bowl of milk.", destaque: ["milk", "cartoon", "bowl"]},
	{cena: 's04', cap: 1, texto: "The truth: most adult cats are lactose intolerant. As kittens grow up, many lose the ability to properly digest the sugar in milk.", destaque: ["truth", "lactose", "intolerant", "digest"]},
	{cena: 's05', cap: 1, texto: "So that bowl of milk can lead to an upset stomach, gas or diarrhea. Not exactly the treat we imagined.", destaque: ["upset", "stomach", "diarrhea", "treat"]},
	{cena: 's06', cap: 1, texto: "Kittens drink their mother's milk, of course, but after weaning, what cats really need is fresh, clean water.", destaque: ["kittens", "weaning", "fresh", "water"]},
	{cena: 's07', cap: 1, texto: "If your cat really loves milk, there are special lactose-free milks made for cats. But even those should only be an occasional treat.", destaque: ["lactose-free", "special", "occasional"]},
	{cena: 's08', cap: 2, texto: "Myth number two: cats always land on their feet, so falls can't hurt them. It's true that cats have an amazing righting reflex, and can twist in mid-air.", destaque: ["feet", "falls", "righting", "reflex", "twist"]},
	{cena: 's09', cap: 2, texto: "But they need time and height to turn around. From a very short fall, they may not have time to twist.", destaque: ["time", "height", "short"]},
	{cena: 's10', cap: 2, texto: "And from high places, landing on their feet doesn't stop injuries. Vets treat many cats every year after falls from windows and balconies.", destaque: ["high", "injuries", "vets", "windows", "balconies"]},
	{cena: 's11', cap: 2, texto: "Cats don't have nine lives. If you live in an apartment, window screens are one of the best gifts you can give your cat.", destaque: ["nine", "lives", "screens", "gifts"]},
	{cena: 's12', cap: 2, texto: "Fun fact: the nine lives idea changes around the world. In Spanish-speaking countries, cats are said to have seven lives, and in some places, only six.", destaque: ["fun", "seven", "six"]},
	{cena: 's13', cap: 3, texto: "Myth number three: a purring cat is always a happy cat. Most of the time, purring does mean contentment.", destaque: ["purring", "happy", "contentment"]},
	{cena: 's14', cap: 3, texto: "But cats also purr when they're stressed, injured, giving birth, or even very sick. Scientists think purring may help them calm down and feel better.", destaque: ["stressed", "injured", "sick", "calm"]},
	{cena: 's15', cap: 3, texto: "So always look at the whole picture. A purring cat that's hiding, not eating or breathing strangely needs a vet, not just a cuddle.", destaque: ["whole", "hiding", "eating", "vet"]},
	{cena: 's16', cap: 3, texto: "Some researchers even think the low frequencies of purring might help bones and tissues heal. It's a fascinating idea, but it still needs more research.", destaque: ["frequencies", "bones", "heal", "research"]},
	{cena: 's17', cap: 4, texto: "Myth number four: cats are cold and don't really love their owners. This might be the most unfair myth of all.", destaque: ["cold", "love", "unfair"]},
	{cena: 's18', cap: 4, texto: "In a 2019 study, researchers tested cats with a classic attachment test used for babies and dogs.", destaque: ["study", "attachment", "babies", "dogs"]},
	{cena: 's19', cap: 4, texto: "Most of the cats showed a secure attachment to their owners. They felt safer and more confident when their person was in the room.", destaque: ["secure", "safer", "confident", "room"]},
	{cena: 's20', cap: 4, texto: "Cats just show love in quieter ways: slow blinks, head bumps, following you around, and choosing to be near you.", destaque: ["quieter", "blinks", "bumps", "following", "near"]},
	{cena: 's21', cap: 4, texto: "And remember: adult cats rarely meow at other cats, but they meow at us all the time. That sound is basically made for you.", destaque: ["rarely", "meow", "made"]},
	{cena: 's22', cap: 5, texto: "Myth number five: cats are nocturnal. Not exactly. Cats are crepuscular, which means they're most active at dawn and dusk.", destaque: ["nocturnal", "crepuscular", "dawn", "dusk"]},
	{cena: 's23', cap: 5, texto: "That's when their wild ancestors hunted small prey. It's why your cat suddenly gets the zoomies at sunrise, or right when you want to relax in the evening.", destaque: ["ancestors", "prey", "zoomies", "sunrise", "evening"]},
	{cena: 's24', cap: 5, texto: "A good play session in the evening can help your cat use that energy before bedtime, instead of at five in the morning.", destaque: ["play", "energy", "bedtime", "five"]},
	{cena: 's25', cap: 6, texto: "Myth number six: cats can see in complete darkness. Cats do have amazing night vision. They can see in light about six times dimmer than we need.", destaque: ["darkness", "night", "vision", "six"]},
	{cena: 's26', cap: 6, texto: "But in total darkness, with no light at all, cats can't see either. They rely on their whiskers, ears and nose to get around.", destaque: ["total", "light", "whiskers", "ears", "nose"]},
	{cena: 's27', cap: 6, texto: "So a tiny night light can actually help an older cat find its way to the litter box at night.", destaque: ["night", "light", "older", "litter"]},
	{cena: 's28', cap: 6, texto: "Their eyes also glow in the dark, thanks to a mirror-like layer that reflects light. That glow is part of why people thought cats had magic night vision.", destaque: ["glow", "mirror-like", "reflects", "magic"]},
	{cena: 's29', cap: 7, texto: "Myth number seven: all cats hate water. Many cats don't like getting soaked, partly because wet fur gets heavy and takes a long time to dry.", destaque: ["water", "soaked", "heavy", "dry"]},
	{cena: 's30', cap: 7, texto: "But some cats love water. Breeds like the Turkish Van are famous for swimming, and many cats love playing with a dripping tap.", destaque: ["love", "turkish", "van", "swimming", "tap"]},
	{cena: 's31', cap: 7, texto: "So it's not that cats hate water. Most cats just hate being forced into it.", destaque: ["hate", "forced"]},
	{cena: 's32', cap: 7, texto: "If you ever need to bathe your cat, use lukewarm water, keep it short and calm, and dry your cat well with a towel afterwards.", destaque: ["bathe", "lukewarm", "calm", "towel"]},
	{cena: 's33', cap: 8, texto: "Myth number eight: cats can't be trained. Actually, they can. They just don't work for praise the way dogs do.", destaque: ["trained", "actually", "praise", "dogs"]},
	{cena: 's34', cap: 8, texto: "With treats and patience, cats can learn to come when called, sit, high-five, and even walk on a harness.", destaque: ["treats", "patience", "sit", "high-five", "harness"]},
	{cena: 's35', cap: 8, texto: "A 2019 study in Japan also found that cats can recognize their own names. They just choose when to answer.", destaque: ["study", "japan", "names", "choose"]},
	{cena: 's36', cap: 8, texto: "The secret is positive reinforcement: reward what you like, and never punish. Short, fun sessions work best.", destaque: ["positive", "reward", "punish", "short"]},
	{cena: 's37', cap: 8, texto: "Training also keeps your cat's brain busy, and it can make vet visits and carrier trips much less stressful.", destaque: ["brain", "busy", "vet", "carrier", "stressful"]},
	{cena: 's38', cap: 9, texto: "Myth number nine: black cats are bad luck. This superstition comes from the Middle Ages, when black cats were wrongly linked to witchcraft.", destaque: ["black", "luck", "superstition", "witchcraft"]},
	{cena: 's39', cap: 9, texto: "But in many places, it's the opposite. In Britain and Japan, a black cat is traditionally seen as a sign of good luck.", destaque: ["opposite", "britain", "japan", "good"]},
	{cena: 's40', cap: 9, texto: "And the truth is simple: a black cat is just a cat, with the same personality, the same love, and the same amazing senses.", destaque: ["simple", "personality", "love", "senses"]},
	{cena: 's41', cap: 9, texto: "Some shelters even say black cats can wait longer to be adopted, partly because they're harder to photograph. So if you're adopting, give the black cats a chance.", destaque: ["shelters", "adopted", "photograph", "chance"]},
	{cena: 's42', cap: 10, texto: "Myth number ten: indoor cats don't need exercise. Indoor cats live longer and safer lives, but they still have the body and brain of a hunter.", destaque: ["indoor", "exercise", "longer", "hunter"]},
	{cena: 's43', cap: 10, texto: "Without play, many indoor cats get bored, stressed or overweight. In some surveys, more than half of pet cats are overweight.", destaque: ["bored", "stressed", "overweight", "half"]},
	{cena: 's44', cap: 10, texto: "Just ten to fifteen minutes of play, a couple of times a day, can make a big difference.", destaque: ["ten", "fifteen", "difference"]},
	{cena: 's45', cap: 10, texto: "Use toys that move like prey, let your cat catch them at the end, and add shelves or cat trees so it can climb.", destaque: ["toys", "prey", "catch", "climb"]},
	{cena: 's46', cap: 10, texto: "Puzzle feeders are another great idea. They make your cat work for its food, just like it would if it were hunting.", destaque: ["puzzle", "feeders", "work", "hunting"]},
	{cena: 's47', cap: 11, texto: "Myth number eleven: if you're pregnant, you have to give up your cat. This myth is about toxoplasmosis, an infection that can be dangerous during pregnancy.", destaque: ["pregnant", "toxoplasmosis", "infection", "dangerous"]},
	{cena: 's48', cap: 11, texto: "Cats can spread it through their feces, but you're actually more likely to catch it from undercooked meat or soil from the garden.", destaque: ["feces", "likely", "undercooked", "soil"]},
	{cena: 's49', cap: 11, texto: "Doctors usually recommend simple precautions: let someone else clean the litter box every day, or use gloves and wash your hands well.", destaque: ["precautions", "litter", "gloves", "hands"]},
	{cena: 's50', cap: 11, texto: "Keep your cat indoors, and wash fruit and vegetables. You don't need to give up your cat. Just talk to your doctor.", destaque: ["indoors", "vegetables", "give", "doctor"]},
	{cena: 's51', cap: 12, texto: "Myth number twelve: fish, especially tuna, is the best food for cats. Cats love the smell, but their wild ancestors in the desert rarely ate fish.", destaque: ["tuna", "best", "smell", "desert"]},
	{cena: 's52', cap: 12, texto: "Tuna made for people isn't a balanced diet for cats, and eating too much of it can cause health problems.", destaque: ["balanced", "diet", "health"]},
	{cena: 's53', cap: 12, texto: "Cats need complete cat food made for their needs. Tuna is fine as a tiny treat, not as a meal.", destaque: ["complete", "treat", "meal"]},
	{cena: 's54', cap: 12, texto: "The same goes for other human foods. Onions, garlic, chocolate and alcohol can be toxic to cats, and lilies are extremely dangerous.", destaque: ["onions", "garlic", "chocolate", "toxic", "lilies"]},
	{cena: 's55', cap: 13, texto: "And a bonus myth: cats are solitary and always prefer to live alone. Many cats do enjoy their space, but cats can also live in friendly groups.", destaque: ["bonus", "solitary", "alone", "groups"]},
	{cena: 's56', cap: 13, texto: "Feral cats often form colonies, where related females share food and even help raise each other's kittens. Every cat is different.", destaque: ["colonies", "share", "kittens", "different"]},
	{cena: 's57', cap: 0, texto: "So, quick recap: no milk, use window screens, watch the whole cat, and remember that your cat really does love you.", destaque: ["recap", "milk", "screens", "love"]},
	{cena: 's58', cap: 0, texto: "Play with your cat, train it with treats, keep tuna as a snack, and never believe that a black cat is bad luck.", destaque: ["play", "train", "tuna", "black"]},
	{cena: 's59', cap: 0, texto: "Which of these myths did you believe? Be honest, and tell me in the comments. I'll see you in the next video.", destaque: ["believe", "honest", "comments"]},
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
