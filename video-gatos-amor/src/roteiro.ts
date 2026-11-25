import duracoes from './duracoes.json';
import tempos from './palavras.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

/**
 * Roteiro "Do cats actually love you?" (~10 min) (estilo caderno rabiscado, em inglês).
 * Cada trecho = um arquivo de voz em public/voz/NN.mp3 + uma cena.
 * `destaque`: palavras que ficam azuis na legenda.
 */
export type Trecho = {texto: string; destaque: string[]; cena: string; cap: number};

export const ROTEIRO: Trecho[] = [
	{cena: 's00', cap: 0, texto: "Does your cat actually love you? Or are you just the person who opens the food? It is one of the oldest questions every cat owner asks.", destaque: ["love", "food", "questions"]},
	{cena: 's01', cap: 0, texto: "Dogs make it obvious. They jump, they wag, they lick your face. Cats are quieter, and that makes people think they are cold.", destaque: ["obvious", "quieter", "cold"]},
	{cena: 's02', cap: 0, texto: "But scientists have been studying the bond between cats and humans, and the answer is a lot sweeter than the stereotype.", destaque: ["scientists", "bond", "sweeter"]},
	{cena: 's03', cap: 1, texto: "Chapter one: the cold cat myth. The idea that cats are aloof comes partly from their history.", destaque: ["cold", "myth", "aloof", "history"]},
	{cena: 's04', cap: 1, texto: "The wild ancestor of the house cat, the African wildcat, lives and hunts mostly alone. No pack, no team, no boss.", destaque: ["ancestor", "wildcat", "alone", "pack"]},
	{cena: 's05', cap: 1, texto: "Dogs come from wolves, which live in families and read each other constantly. So dogs show feelings in big, loud ways.", destaque: ["wolves", "families", "loud"]},
	{cena: 's06', cap: 1, texto: "Cats show affection in small, quiet signals. If you don't know the signals, it looks like nothing is happening.", destaque: ["affection", "small", "signals", "nothing"]},
	{cena: 's07', cap: 1, texto: "And here is the surprising part: domestic cats are far more social than their wild ancestors. Living with people changed them.", destaque: ["surprising", "social", "changed"]},
	{cena: 's08', cap: 1, texto: "Many house cats form close friendships with other cats, and with the humans they live with. They just do it on their own terms.", destaque: ["friendships", "humans", "terms"]},
	{cena: 's09', cap: 1, texto: "Cats also recognize their owner's voice. In one study, cats reacted more to a recording of their owner calling their name than to strangers. They may not run over, but their ears and head turn toward you.", destaque: ["recognize", "voice", "owner", "ears"]},
	{cena: 's10', cap: 2, texto: "Chapter two: the attachment test. In 2019, researchers at Oregon State University ran a famous experiment.", destaque: ["attachment", "2019", "Oregon", "experiment"]},
	{cena: 's11', cap: 2, texto: "They used a test originally designed for human babies. The owner and the cat sit together in a strange room for a few minutes.", destaque: ["babies", "strange", "room"]},
	{cena: 's12', cap: 2, texto: "Then the owner leaves for two minutes, and comes back. The scientists watch what the cat does at the reunion.", destaque: ["leaves", "two", "reunion"]},
	{cena: 's13', cap: 2, texto: "A securely attached cat greets the owner, then relaxes and goes back to exploring. The owner is its safe base.", destaque: ["securely", "greets", "relaxes", "safe"]},
	{cena: 's14', cap: 2, texto: "An insecure cat either clings too much, or avoids the owner completely, even after being alone in a strange place.", destaque: ["insecure", "clings", "avoids"]},
	{cena: 's15', cap: 2, texto: "The result? About sixty four percent of the cats were securely attached to their owners.", destaque: ["sixty", "percent", "securely"]},
	{cena: 's16', cap: 2, texto: "That is almost exactly the same percentage found in human babies, and very close to dogs.", destaque: ["babies", "dogs"]},
	{cena: 's17', cap: 2, texto: "So most cats don't just tolerate us. They use us as a source of comfort and security, just like a child uses a parent.", destaque: ["tolerate", "comfort", "security", "parent"]},
	{cena: 's18', cap: 3, texto: "Chapter three: the slow blink. If you have ever seen your cat look at you and slowly close its eyes, you have received a compliment.", destaque: ["slow", "blink", "eyes", "compliment"]},
	{cena: 's19', cap: 3, texto: "In the wild, staring is a threat. Closing your eyes in front of someone means: I trust you. I don't feel in danger.", destaque: ["staring", "threat", "trust", "danger"]},
	{cena: 's20', cap: 3, texto: "In 2020, psychologists in the United Kingdom tested this. Owners slow blinked at their cats, and the cats slow blinked back.", destaque: ["2020", "psychologists", "back"]},
	{cena: 's21', cap: 3, texto: "Then a stranger tried it. Cats were more likely to approach a stranger who slow blinked at them than one who kept a neutral face.", destaque: ["stranger", "approach", "neutral"]},
	{cena: 's22', cap: 3, texto: "Scientists sometimes call the slow blink the cat smile. And yes, you can do it too: look at your cat, narrow your eyes, and blink slowly.", destaque: ["smile", "narrow", "slowly"]},
	{cena: 's23', cap: 3, texto: "If your cat blinks back, congratulations. You just had a real conversation in cat language.", destaque: ["congratulations", "conversation", "language"]},
	{cena: 's24', cap: 4, texto: "Chapter four: headbutts and rubbing. When your cat bumps its head into you, it has a name: bunting.", destaque: ["headbutts", "rubbing", "bunting"]},
	{cena: 's25', cap: 4, texto: "Cats have scent glands on their cheeks, chin and forehead. When they rub against you, they leave their scent on you.", destaque: ["scent", "glands", "cheeks", "rub"]},
	{cena: 's26', cap: 4, texto: "Cats that live together do the same thing to each other. It creates a shared group smell that says: we are family.", destaque: ["together", "group", "family"]},
	{cena: 's27', cap: 4, texto: "So when your cat rubs on your legs, it is basically marking you as part of its group. You belong to the cat.", destaque: ["marking", "group", "belong"]},
	{cena: 's28', cap: 4, texto: "Licking works the same way. Friendly cats groom each other, mostly on the head and neck. It is called allogrooming.", destaque: ["licking", "groom", "allogrooming"]},
	{cena: 's29', cap: 4, texto: "If your cat licks your hand or your hair, it is treating you like a close friend. A slightly rough, sandpaper kind of friend.", destaque: ["licks", "friend", "sandpaper"]},
	{cena: 's30', cap: 5, texto: "Chapter five: kneading and purring. Kneading is when your cat pushes its paws in and out on a soft blanket, or on you.", destaque: ["kneading", "purring", "paws", "blanket"]},
	{cena: 's31', cap: 5, texto: "Kittens knead their mother's belly to get milk flowing. Many adult cats keep doing it when they feel safe and happy.", destaque: ["kittens", "milk", "safe", "happy"]},
	{cena: 's32', cap: 5, texto: "So when your cat kneads your lap, it is going back to the most comfortable feeling it has ever known.", destaque: ["lap", "comfortable"]},
	{cena: 's33', cap: 5, texto: "Purring also starts in kittenhood. Kittens purr while nursing, and the mother purrs back. It is a signal of closeness.", destaque: ["kittenhood", "nursing", "closeness"]},
	{cena: 's34', cap: 5, texto: "Adult cats mostly purr around the people they trust. But purring can also happen when a cat is stressed or in pain, so watch the rest of the body.", destaque: ["trust", "stressed", "pain", "body"]},
	{cena: 's35', cap: 5, texto: "A purr with relaxed eyes, soft paws and a slow tail is one of the clearest signs of a happy, bonded cat.", destaque: ["relaxed", "soft", "slow", "bonded"]},
	{cena: 's36', cap: 6, texto: "Chapter six: tail up and the welcome home. A cat walking toward you with its tail straight up is saying hello.", destaque: ["tail", "welcome", "hello"]},
	{cena: 's37', cap: 6, texto: "Researchers found that cats raise their tails when greeting friends, and they rarely do it with cats they don't like.", destaque: ["greeting", "friends", "rarely"]},
	{cena: 's38', cap: 6, texto: "A tail up with a little hook at the tip is extra friendly. It is the cat version of waving at you from across the room.", destaque: ["hook", "friendly", "waving"]},
	{cena: 's39', cap: 6, texto: "In a Swedish study, cats left alone for four hours greeted their owners with more purring and more stretching than cats left alone for just half an hour.", destaque: ["Swedish", "four", "purring", "stretching"]},
	{cena: 's40', cap: 6, texto: "In other words, cats do notice when you are gone, and many of them are happy when you come back.", destaque: ["notice", "gone", "happy"]},
	{cena: 's41', cap: 6, texto: "Some cats even wait by the door, because they have learned the sound of your car or your keys. That is not a coincidence.", destaque: ["wait", "door", "car", "coincidence"]},
	{cena: 's42', cap: 7, texto: "Chapter seven: gifts and following you everywhere. Cats that go outside sometimes bring home a gift: a mouse, a bird, a leaf.", destaque: ["gifts", "following", "mouse", "bird"]},
	{cena: 's43', cap: 7, texto: "Nobody knows for sure why they do this. They might be bringing prey to a safe place, or sharing with their group.", destaque: ["sure", "prey", "sharing"]},
	{cena: 's44', cap: 7, texto: "Either way, you are included in that group. Gross, but kind of sweet.", destaque: ["included", "group", "sweet"]},
	{cena: 's45', cap: 7, texto: "Then there is the bathroom. Many cats follow their owners from room to room, and absolutely insist on joining them in the bathroom.", destaque: ["follow", "room", "bathroom"]},
	{cena: 's46', cap: 7, texto: "Part of it is curiosity: a closed door is a mystery. But part of it is simply wanting to be where you are.", destaque: ["curiosity", "mystery", "where"]},
	{cena: 's47', cap: 7, texto: "Sleeping on you is another big one. A sleeping cat is at its most vulnerable, and it chose to do that on top of you.", destaque: ["sleeping", "vulnerable", "chose"]},
	{cena: 's48', cap: 7, texto: "Showing the belly is similar. It is a sign of deep trust, but usually not an invitation for a belly rub. Look, don't touch.", destaque: ["belly", "trust", "invitation", "touch"]},
	{cena: 's49', cap: 7, texto: "Some cats also bring you their favorite toy, drop it at your feet, and stare. That is usually an invitation to play, and a sign they see you as a real playmate.", destaque: ["toy", "feet", "invitation", "playmate"]},
	{cena: 's50', cap: 8, texto: "Chapter eight: the love hormone. Oxytocin is a hormone linked to bonding in humans and many other animals.", destaque: ["love", "hormone", "oxytocin", "bonding"]},
	{cena: 's51', cap: 8, texto: "In a 2016 experiment for a TV documentary, dog owners' dogs showed a big rise in oxytocin after playing with them. Cats showed a much smaller rise.", destaque: ["2016", "dogs", "rise", "smaller"]},
	{cena: 's52', cap: 8, texto: "Headlines said dogs love us five times more than cats. But it was a tiny study, and cats were tested in a stressful, unfamiliar place.", destaque: ["headlines", "five", "tiny", "stressful"]},
	{cena: 's53', cap: 8, texto: "Newer research from Japan suggests something interesting: a cat's oxytocin goes up when contact happens on the cat's terms.", destaque: ["Japan", "oxytocin", "terms"]},
	{cena: 's54', cap: 8, texto: "When the cat chooses to come to you, the bond hormone rises. When it is grabbed and held against its will, it doesn't.", destaque: ["chooses", "rises", "grabbed"]},
	{cena: 's55', cap: 8, texto: "So cat love is real. It is just consent based. The cat wants to decide when the cuddle happens.", destaque: ["real", "consent", "decide"]},
	{cena: 's56', cap: 9, texto: "Chapter nine: how to get more love from your cat. First, let the cat come to you. Offer a hand and wait.", destaque: ["love", "come", "wait"]},
	{cena: 's57', cap: 9, texto: "Cats who are allowed to choose, and to leave whenever they want, actually stay longer and come back more often.", destaque: ["choose", "leave", "longer"]},
	{cena: 's58', cap: 9, texto: "Second, pet the right places: the cheeks, the chin, and the base of the ears. Most cats are less keen on the belly and the tail.", destaque: ["cheeks", "chin", "ears", "belly"]},
	{cena: 's59', cap: 9, texto: "Third, play every day. A short hunting game with a wand toy builds trust, burns energy, and makes you the most fun thing in the house.", destaque: ["play", "wand", "trust", "fun"]},
	{cena: 's60', cap: 9, texto: "Fourth, keep a routine. Cats love predictability. Meals, play and quiet time at the same hours make them feel safe.", destaque: ["routine", "predictability", "safe"]},
	{cena: 's61', cap: 9, texto: "Fifth, give your cat high places and hiding spots. A cat that feels safe in its home has a lot more energy left for affection.", destaque: ["high", "hiding", "safe", "affection"]},
	{cena: 's62', cap: 9, texto: "And finally, talk to your cat and slow blink at it. They recognize your voice, and they really are listening.", destaque: ["talk", "blink", "voice", "listening"]},
	{cena: 's63', cap: 0, texto: "So, does your cat love you? Science says most cats form real, secure bonds with their humans, just like babies and dogs do.", destaque: ["love", "science", "secure", "bonds"]},
	{cena: 's64', cap: 0, texto: "They just say it differently: with a slow blink, a head bump, a raised tail, a purr on your lap, or a dead mouse on your doormat.", destaque: ["blink", "bump", "tail", "purr", "mouse"]},
	{cena: 's65', cap: 0, texto: "How does your cat show you love? Tell me in the comments, and I'll see you in the next video.", destaque: ["love", "comments"]},
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
