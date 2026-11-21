import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "The secret history of cats" (~10 min) (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string; cap: number};

export const ROTEIRO: Trecho[] = [
	{cena: 's00', cap: 0, texto: "Right now, there are hundreds of millions of cats living with humans all over the planet. But cats weren't always on our sofas.", destaque: ["hundreds", "millions", "sofas"]},
	{cena: 's01', cap: 0, texto: "Ten thousand years ago, your cat's ancestors were wild hunters in the desert. So how did they end up ruling our homes?", destaque: ["ten", "wild", "desert", "ruling"]},
	{cena: 's02', cap: 0, texto: "Today, we travel through the secret history of cats: from wild deserts to ancient Egypt, Viking ships, Japanese temples, and even outer space.", destaque: ["secret", "history", "egypt", "viking", "japanese", "space"]},
	{cena: 's03', cap: 1, texto: "Chapter one: the wild ancestor. Every pet cat on Earth descends from one wild cat: the African wildcat, from the Near East and North Africa.", destaque: ["ancestor", "every", "african", "wildcat"]},
	{cena: 's04', cap: 1, texto: "In 2007, scientists compared the DNA of nearly a thousand cats from around the world. They all led back to this same desert wildcat.", destaque: ["dna", "thousand", "same", "desert"]},
	{cena: 's05', cap: 1, texto: "It's a small, sandy-colored cat with faint stripes. It looks a lot like a skinny house tabby, and that's no coincidence.", destaque: ["sandy-colored", "stripes", "tabby", "coincidence"]},
	{cena: 's06', cap: 1, texto: "African wildcats are solitary, shy, and amazing hunters of mice and small animals. And that hunting skill is about to change everything.", destaque: ["solitary", "shy", "hunters", "everything"]},
	{cena: 's07', cap: 1, texto: "Because around ten thousand years ago, humans started doing something new: farming.", destaque: ["ten", "new", "farming"]},
	{cena: 's08', cap: 1, texto: "And here's the twist. Humans didn't capture wild cats and tame them. In a way, cats chose us.", destaque: ["twist", "capture", "chose"]},
	{cena: 's09', cap: 2, texto: "Chapter two: the farmers and the mice. When people in the Fertile Crescent began growing grain, they stored it in big piles and granaries.", destaque: ["farmers", "mice", "fertile", "grain", "granaries"]},
	{cena: 's10', cap: 2, texto: "Stored grain attracted mice. Lots of mice. And where there are mice, hungry wildcats soon follow.", destaque: ["attracted", "lots", "wildcats", "follow"]},
	{cena: 's11', cap: 2, texto: "The cats that weren't too afraid of people got an easy buffet. They stayed close to villages, hunted, and had more kittens.", destaque: ["afraid", "buffet", "villages", "kittens"]},
	{cena: 's12', cap: 2, texto: "Farmers loved it, because the cats protected their food for free. Nobody needed to train them. Both sides simply won.", destaque: ["loved", "free", "train", "won"]},
	{cena: 's13', cap: 2, texto: "Over many generations, the bolder, calmer cats became a new kind of cat, one that could live side by side with humans.", destaque: ["generations", "bolder", "calmer", "side"]},
	{cena: 's14', cap: 2, texto: "The oldest evidence we have comes from Cyprus: a grave about nine thousand five hundred years old, where a person was buried with a cat.", destaque: ["oldest", "cyprus", "grave", "buried"]},
	{cena: 's15', cap: 2, texto: "And since Cyprus has no native wildcats, someone must have carried that cat across the sea. Cats were already traveling with us.", destaque: ["native", "carried", "sea", "traveling"]},
	{cena: 's16', cap: 3, texto: "Chapter three: ancient Egypt. If you think people love cats today, wait until you meet the ancient Egyptians.", destaque: ["egypt", "love", "egyptians"]},
	{cena: 's17', cap: 3, texto: "In Egypt, cats protected homes and grain from mice and snakes. Soon they appeared in paintings, sitting under chairs, wearing collars, and even joining hunting trips.", destaque: ["protected", "snakes", "paintings", "collars", "hunting"]},
	{cena: 's18', cap: 3, texto: "Cats became linked to the goddess Bastet, a protector of homes, mothers and children, often shown with the head of a cat.", destaque: ["goddess", "bastet", "protector", "head"]},
	{cena: 's19', cap: 3, texto: "The city of Bubastis held huge festivals for Bastet, and temples there kept cats as sacred animals.", destaque: ["bubastis", "festivals", "temples", "sacred"]},
	{cena: 's20', cap: 3, texto: "According to the Greek historian Herodotus, when a family cat died, Egyptians shaved off their eyebrows as a sign of mourning.", destaque: ["herodotus", "died", "eyebrows", "mourning"]},
	{cena: 's21', cap: 3, texto: "Egyptians even gave their cats names. One of the oldest cat names we know, found in an ancient tomb, is Nedjem, which means sweet or pleasant.", destaque: ["names", "oldest", "nedjem", "sweet"]},
	{cena: 's22', cap: 3, texto: "Many cats were mummified and buried with care. Archaeologists have found cat mummies by the hundreds of thousands.", destaque: ["mummified", "care", "mummies", "hundreds"]},
	{cena: 's23', cap: 3, texto: "Ancient writers even claimed that harming a cat in Egypt could get you into very serious trouble.", destaque: ["writers", "harming", "serious", "trouble"]},
	{cena: 's24', cap: 3, texto: "For many cats, ancient Egypt really was the golden age. It's also one of the main places cats spread out from, to the rest of the world.", destaque: ["golden", "spread", "world"]},
	{cena: 's25', cap: 4, texto: "Chapter four: cats at sea. Ships carried grain, and grain attracted rats. So sailors brought along the best pest control they knew: cats.", destaque: ["sea", "ships", "rats", "sailors", "pest"]},
	{cena: 's26', cap: 4, texto: "Cats traveled on trading ships across the Mediterranean, and from there, along trade routes to Europe, Asia and beyond.", destaque: ["trading", "mediterranean", "europe", "asia", "beyond"]},
	{cena: 's27', cap: 4, texto: "A big 2017 genetic study found ancient cat remains all along those routes, even at a Viking trading port in northern Germany.", destaque: ["genetic", "remains", "routes", "viking", "germany"]},
	{cena: 's28', cap: 4, texto: "Yes, Vikings had cats. They probably kept them on board and in their settlements to protect food and furs from rodents.", destaque: ["vikings", "board", "furs", "rodents"]},
	{cena: 's29', cap: 4, texto: "For centuries after that, almost every ship had its ship's cat. Many sailors believed a cat on board brought good luck.", destaque: ["centuries", "ship", "luck"]},
	{cena: 's30', cap: 4, texto: "Ship's cats were so useful that the British Royal Navy kept cats on board for centuries. They were only banned from its ships in 1975.", destaque: ["useful", "royal", "navy", "banned"]},
	{cena: 's31', cap: 4, texto: "And that's how a desert cat from the Near East ended up on every continent except Antarctica.", destaque: ["desert", "every", "continent", "antarctica"]},
	{cena: 's32', cap: 5, texto: "Chapter five: the dark times. Not every era was kind to cats. In parts of medieval Europe, cats got a bad reputation.", destaque: ["dark", "kind", "medieval", "reputation"]},
	{cena: 's33', cap: 5, texto: "Their independence, their glowing eyes and their night habits made some people link them, especially black cats, to witchcraft and bad luck.", destaque: ["independence", "glowing", "night", "black", "witchcraft"]},
	{cena: 's34', cap: 5, texto: "In some places, cats were persecuted during festivals and witch panics. It was a hard time to be a cat.", destaque: ["persecuted", "witch", "hard"]},
	{cena: 's35', cap: 5, texto: "You may have heard that killing cats made the plague worse, because there were more rats. Historians still debate how true that is, so take it with a grain of salt.", destaque: ["plague", "rats", "debate", "salt"]},
	{cena: 's36', cap: 5, texto: "But superstition never fully won. Farmers, millers and sailors kept cats, because nothing beat them at catching rodents.", destaque: ["superstition", "farmers", "sailors", "rodents"]},
	{cena: 's37', cap: 6, texto: "Chapter six: cats in Japan. Cats probably reached Japan more than a thousand years ago, likely protecting precious books and scrolls from mice.", destaque: ["japan", "thousand", "books", "scrolls"]},
	{cena: 's38', cap: 6, texto: "Later, silk farmers valued cats because mice threatened the silkworms. Some even kept cat charms and statues to keep the mice away.", destaque: ["silk", "silkworms", "charms", "statues"]},
	{cena: 's39', cap: 6, texto: "And then there's the famous maneki-neko, the beckoning cat, with one paw raised. You've probably seen it in shops and restaurants.", destaque: ["maneki-neko", "beckoning", "paw", "shops"]},
	{cena: 's40', cap: 6, texto: "It's believed to bring luck and customers. A raised left paw is said to invite people in, and a raised right paw is said to invite money.", destaque: ["luck", "customers", "left", "right", "money"]},
	{cena: 's41', cap: 6, texto: "Today, Japan even has cat islands, like Tashirojima, where cats outnumber people and are treated as local treasures.", destaque: ["islands", "tashirojima", "outnumber", "treasures"]},
	{cena: 's42', cap: 6, texto: "Japanese folklore also has darker cat legends, like the bakeneko and the nekomata, magical cats said to have strange powers.", destaque: ["folklore", "legends", "bakeneko", "nekomata", "powers"]},
	{cena: 's43', cap: 7, texto: "Chapter seven: famous cats in history. Some cats became true celebrities.", destaque: ["famous", "celebrities"]},
	{cena: 's44', cap: 7, texto: "In 1963, a French cat named Felicette flew to space on a rocket. She came back safely, and she's still the only cat to have flown to space.", destaque: ["french", "felicette", "space", "rocket", "safely", "only"]},
	{cena: 's45', cap: 7, texto: "In the small town of Talkeetna, Alaska, a cat named Stubbs was the honorary mayor for about twenty years. Tourists came just to meet him.", destaque: ["talkeetna", "stubbs", "mayor", "twenty", "tourists"]},
	{cena: 's46', cap: 7, texto: "In London, a cat named Larry has held the official title of Chief Mouser to the Cabinet Office, living at 10 Downing Street since 2011.", destaque: ["london", "larry", "chief", "mouser", "downing"]},
	{cena: 's47', cap: 7, texto: "He has outlasted several prime ministers. Prime ministers come and go, but the cat stays.", destaque: ["outlasted", "ministers", "stays"]},
	{cena: 's48', cap: 7, texto: "And many famous writers, from Mark Twain to Ernest Hemingway, were well-known cat lovers. Hemingway's home in Florida is still full of cats today.", destaque: ["writers", "twain", "hemingway", "florida"]},
	{cena: 's49', cap: 7, texto: "Even Isaac Newton is often credited with inventing the cat flap. It's a fun story, but there's no real proof that he did.", destaque: ["newton", "credited", "flap", "proof"]},
	{cena: 's50', cap: 8, texto: "Chapter eight: the modern cat. For most of history, cats weren't bred for looks. They were shaped by nature, for hunting.", destaque: ["modern", "looks", "nature", "hunting"]},
	{cena: 's51', cap: 8, texto: "That changed in 1871, at the first big cat show, held at the Crystal Palace in London. Suddenly, people cared about fur, color and shape.", destaque: ["show", "crystal", "palace", "fur", "color", "shape"]},
	{cena: 's52', cap: 8, texto: "Most of the cat breeds we know today were created in the last one hundred and fifty years.", destaque: ["breeds", "created", "fifty"]},
	{cena: 's53', cap: 8, texto: "Some breeds are much older, though. The Siamese, like the cat on this channel, comes from Thailand, the old kingdom of Siam, and appears in old Thai manuscripts.", destaque: ["older", "siamese", "thailand", "siam", "manuscripts"]},
	{cena: 's54', cap: 8, texto: "Siamese cats arrived in Britain in the late eighteen hundreds, and people were amazed by their blue eyes and dark points.", destaque: ["britain", "eighteen", "blue", "points"]},
	{cena: 's55', cap: 8, texto: "And the Maine Coon, one of the biggest domestic cat breeds, is the official state cat of Maine in the United States.", destaque: ["maine", "coon", "biggest", "official"]},
	{cena: 's56', cap: 8, texto: "Today, there are hundreds of millions of cats in the world, and in many countries, cats are the most popular pet.", destaque: ["hundreds", "millions", "popular"]},
	{cena: 's57', cap: 9, texto: "Chapter nine: still a little wild. Here's the fascinating part. Genetically, house cats are still very close to their wild ancestors.", destaque: ["wild", "fascinating", "genetically", "ancestors"]},
	{cena: 's58', cap: 9, texto: "Dogs changed a lot as they lived with humans. Cats changed much less. They mainly became more tolerant of us, and a bit more sociable.", destaque: ["dogs", "less", "tolerant", "sociable"]},
	{cena: 's59', cap: 9, texto: "Domestic cats even have slightly smaller brains than wildcats, which is common in tame animals. But on the outside, they look almost the same.", destaque: ["smaller", "brains", "tame", "outside", "same"]},
	{cena: 's60', cap: 9, texto: "That's why your cat can be a cuddly couch potato one minute, and a fierce hunter the next.", destaque: ["cuddly", "potato", "fierce", "hunter"]},
	{cena: 's61', cap: 9, texto: "Many scientists describe cats as only semi-domesticated. Put a house cat back outside, and it can often survive on its own.", destaque: ["semi-domesticated", "outside", "survive"]},
	{cena: 's62', cap: 9, texto: "In other words, cats never fully gave up their independence. They live with us because they want to.", destaque: ["independence", "want"]},
	{cena: 's63', cap: 0, texto: "So the next time your cat sleeps on your keyboard, remember: you're looking at ten thousand years of history, from desert hunter to sacred animal to sailor to space traveler.", destaque: ["keyboard", "ten", "desert", "sacred", "sailor", "space"]},
	{cena: 's64', cap: 0, texto: "We didn't really choose cats. Cats chose us, and they've been running the show ever since.", destaque: ["choose", "chose", "running"]},
	{cena: 's65', cap: 0, texto: "Which part of cat history surprised you the most? Tell me in the comments, and subscribe for more cat stories.", destaque: ["history", "surprised", "comments", "subscribe"]},
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
