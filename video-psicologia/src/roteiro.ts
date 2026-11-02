// Roteiro do vídeo como dados. Edite os textos aqui: a duração de cada cena
// é calculada automaticamente pela quantidade de palavras.

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

export type Visual =
	| 'olho'
	| 'marionete'
	| 'casal'
	| 'vazio'
	| 'laboratorio'
	| 'alavanca'
	| 'caca-niquel'
	| 'celular'
	| 'grafico'
	| 'lampiao'
	| 'sussurros'
	| 'espelho-quebrado'
	| 'caderno'
	| 'petalas'
	| 'correntes'
	| 'coracao'
	| 'triangulo'
	| 'xadrez'
	| 'porta'
	| 'escada'
	| 'mesa'
	| 'cerebro'
	| 'onda'
	| 'espelho'
	| 'mascara'
	| 'tesoura'
	| 'luz'
	| 'lago'
	| 'coroa'
	| 'cronometro'
	| 'balanca';

export type Som =
	| 'boom'
	| 'hit'
	| 'riser'
	| 'whoosh'
	| 'coracao'
	| 'relogio'
	| 'caca-niquel'
	| 'glitch'
	| 'sussurro'
	| 'porta'
	| 'passo'
	| 'tesoura'
	| 'acorde-final';

export type Estilo = 'normal' | 'grande' | 'fala' | 'defesa';

export type Bloco =
	| {tipo: 'texto'; texto: string; destaque?: string[]; visual: Visual; sons?: Som[]; estilo?: Estilo; duracao?: number}
	| {tipo: 'titulo'; duracao?: number}
	| {tipo: 'tatica'; numero: number; nome: string; visual: Visual; duracao?: number}
	| {tipo: 'citacao'; texto: string; autor: string; duracao?: number}
	| {tipo: 'lista'; duracao?: number}
	| {tipo: 'silencio'; duracao: number}
	| {tipo: 'final'; texto: string; duracao?: number; cta?: {chamada: string; linha1: string; linha2: string; botao: string}};

export const TATICAS = [
	'Reforço intermitente',
	'Gaslighting',
	'Love bombing',
	'Triangulação',
	'Pé na porta',
	'Silêncio punitivo',
	'Espelhamento',
];

export const ROTEIRO: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Neste exato momento…', visual: 'olho', sons: ['coracao'], estilo: 'grande'},
	{tipo: 'texto', texto: 'alguém na sua vida está usando uma dessas táticas em você.', destaque: ['você'], visual: 'olho'},
	{tipo: 'texto', texto: 'Talvez um colega. Talvez um amigo.', visual: 'marionete', sons: ['whoosh']},
	{tipo: 'texto', texto: 'Talvez… a pessoa que dorme ao seu lado.', destaque: ['ao', 'seu', 'lado.'], visual: 'casal', sons: ['riser']},
	{tipo: 'texto', texto: 'A manipulação mais eficiente não parece manipulação.', destaque: ['manipulação.'], visual: 'marionete', sons: ['boom']},
	{tipo: 'texto', texto: 'Parece carinho. Parece preocupação.', destaque: ['carinho.', 'preocupação.'], visual: 'coracao'},
	{tipo: 'texto', texto: 'Parece… culpa sua.', destaque: ['culpa', 'sua.'], visual: 'espelho-quebrado', sons: ['glitch'], estilo: 'grande'},
	{tipo: 'texto', texto: 'Hoje você vai aprender a enxergar sete dessas táticas.', destaque: ['sete'], visual: 'olho', sons: ['riser']},
	{tipo: 'texto', texto: 'E depois deste vídeo… nunca mais vai conseguir deixar de vê-las.', destaque: ['nunca', 'mais'], visual: 'olho', sons: ['boom']},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: 'Reforço intermitente', visual: 'alavanca'},
	{tipo: 'texto', texto: 'Em 1950, o psicólogo B. F. Skinner descobriu algo perturbador.', destaque: ['1950,', 'Skinner'], visual: 'laboratorio', sons: ['relogio']},
	{tipo: 'texto', texto: 'Ratos que recebiam comida toda vez que apertavam uma alavanca… logo perdiam o interesse.', destaque: ['toda', 'vez'], visual: 'alavanca'},
	{tipo: 'texto', texto: 'Mas os que recebiam comida às vezes, de forma imprevisível…', destaque: ['às', 'vezes,', 'imprevisível…'], visual: 'grafico', sons: ['riser']},
	{tipo: 'texto', texto: 'ficavam viciados.', destaque: ['viciados.'], visual: 'grafico', sons: ['boom'], estilo: 'grande'},
	{tipo: 'texto', texto: 'Um dia são carinhosos, atentos, perfeitos. No outro… frios. Distantes.', destaque: ['frios.', 'Distantes.'], visual: 'celular'},
	{tipo: 'texto', texto: 'E você passa a viver tentando recuperar aquela versão boa.', destaque: ['versão', 'boa.'], visual: 'celular'},
	{tipo: 'texto', texto: 'Isso não é amor. É o mesmo mecanismo de uma máquina caça-níquel.', destaque: ['caça-níquel.'], visual: 'caca-niquel', sons: ['caca-niquel']},
	{tipo: 'texto', texto: 'Observe o padrão, não os momentos. Se a gentileza é imprevisível… ela é uma ferramenta.', destaque: ['padrão,', 'ferramenta.'], visual: 'grafico', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: 'Gaslighting', visual: 'lampiao'},
	{tipo: 'texto', texto: '“Isso nunca aconteceu.”', visual: 'sussurros', sons: ['sussurro'], estilo: 'fala'},
	{tipo: 'texto', texto: '“Você está exagerando.”', visual: 'sussurros', estilo: 'fala'},
	{tipo: 'texto', texto: '“Você é sensível demais.”', visual: 'sussurros', sons: ['glitch'], estilo: 'fala'},
	{tipo: 'texto', texto: 'O nome vem de um filme de 1944: um marido diminui as luzes da casa…', destaque: ['1944:'], visual: 'lampiao'},
	{tipo: 'texto', texto: 'e convence a esposa de que ela está imaginando coisas.', destaque: ['imaginando', 'coisas.'], visual: 'lampiao'},
	{tipo: 'texto', texto: 'O objetivo não é vencer uma discussão. É fazer você desconfiar da própria mente.', destaque: ['própria', 'mente.'], visual: 'espelho-quebrado', sons: ['boom']},
	{tipo: 'texto', texto: 'Quem não confia na própria memória… precisa confiar em alguém. E adivinha em quem?', destaque: ['alguém.'], visual: 'marionete', sons: ['riser']},
	{tipo: 'texto', texto: 'Anote. Datas, frases, fatos. A sua memória pode ser questionada. O papel… não.', destaque: ['Anote.', 'papel…'], visual: 'caderno', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: 'Love bombing', visual: 'petalas'},
	{tipo: 'texto', texto: 'No começo, é perfeito demais.', destaque: ['perfeito', 'demais.'], visual: 'petalas'},
	{tipo: 'texto', texto: 'Mensagens o dia inteiro. Presentes. Elogios. Planos de futuro… na segunda semana.', destaque: ['segunda', 'semana.'], visual: 'celular'},
	{tipo: 'texto', texto: 'Um bombardeio de afeto que cria uma dívida emocional.', destaque: ['dívida', 'emocional.'], visual: 'coracao', sons: ['boom']},
	{tipo: 'texto', texto: 'Depois de receber tanto… como você poderia questionar alguma coisa?', destaque: ['questionar'], visual: 'correntes'},
	{tipo: 'texto', texto: 'Quando as atitudes estranhas aparecem, você já está preso à lembrança do início.', destaque: ['preso'], visual: 'correntes', sons: ['riser']},
	{tipo: 'texto', texto: 'Intensidade não é intimidade. O que chega rápido demais… geralmente cobra caro.', destaque: ['Intensidade', 'intimidade.', 'cobra', 'caro.'], visual: 'correntes', estilo: 'defesa', sons: ['boom']},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: 'Triangulação', visual: 'triangulo'},
	{tipo: 'texto', texto: '“Fulano nunca reclama disso.”', visual: 'sussurros', sons: ['sussurro'], estilo: 'fala'},
	{tipo: 'texto', texto: '“Minha ex entendia isso melhor que você.”', visual: 'sussurros', estilo: 'fala'},
	{tipo: 'texto', texto: 'Uma terceira pessoa, real ou imaginária, para gerar comparação, ciúme e insegurança.', destaque: ['terceira', 'pessoa,'], visual: 'triangulo', sons: ['relogio']},
	{tipo: 'texto', texto: 'Você deixa de olhar para o comportamento dele… e passa a competir.', destaque: ['competir.'], visual: 'xadrez'},
	{tipo: 'texto', texto: 'E quem está competindo… não está questionando.', destaque: ['não', 'está', 'questionando.'], visual: 'xadrez', sons: ['boom'], estilo: 'grande'},
	{tipo: 'texto', texto: 'Recuse o jogo. Você não está numa disputa.', destaque: ['Recuse', 'o', 'jogo.'], visual: 'triangulo', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: 'Pé na porta', visual: 'porta'},
	{tipo: 'texto', texto: 'Em 1966, pesquisadores de Stanford pediram a moradores que colocassem uma pequena placa na janela.', destaque: ['1966,', 'pequena'], visual: 'porta', sons: ['porta']},
	{tipo: 'texto', texto: 'Semanas depois, pediram algo enorme: um outdoor no jardim.', destaque: ['enorme:'], visual: 'escada'},
	{tipo: 'texto', texto: 'Quem tinha aceitado a placa… aceitou o outdoor muito mais vezes.', destaque: ['muito', 'mais'], visual: 'escada', sons: ['passo']},
	{tipo: 'texto', texto: 'Primeiro um favor pequeno. Depois um maior. Depois um que você jamais aceitaria.', destaque: ['jamais'], visual: 'escada', sons: ['riser']},
	{tipo: 'texto', texto: 'Cada “sim” te torna coerente com o próximo.', destaque: ['“sim”'], visual: 'escada', sons: ['boom'], estilo: 'grande'},
	{tipo: 'texto', texto: 'Avalie cada pedido como se fosse o primeiro. Você pode mudar de ideia.', destaque: ['primeiro.'], visual: 'porta', estilo: 'defesa'},

	// ───────── 6 ─────────
	{tipo: 'tatica', numero: 6, nome: 'Silêncio punitivo', visual: 'onda'},
	{tipo: 'texto', texto: 'Às vezes… a arma mais cruel é não dizer nada.', destaque: ['nada.'], visual: 'mesa'},
	{tipo: 'texto', texto: 'Sem explicação. Sem discussão. Apenas…', visual: 'onda', estilo: 'grande'},
	{tipo: 'silencio', duracao: 100},
	{tipo: 'texto', texto: 'A exclusão social ativa as mesmas regiões do cérebro que a dor física.', destaque: ['dor', 'física.'], visual: 'cerebro', sons: ['boom']},
	{tipo: 'texto', texto: 'Ele retira a atenção até você pedir desculpas… mesmo sem saber pelo quê.', destaque: ['pedir', 'desculpas…'], visual: 'mesa'},
	{tipo: 'texto', texto: 'E toda vez que você cede, ele aprende que o silêncio funciona.', destaque: ['silêncio', 'funciona.'], visual: 'onda', sons: ['riser']},
	{tipo: 'texto', texto: 'Diga uma vez, com calma: “Quando quiser conversar, estou aqui.” E então… viva sua vida.', destaque: ['viva', 'sua', 'vida.'], visual: 'luz', estilo: 'defesa'},

	// ───────── 7 ─────────
	{tipo: 'tatica', numero: 7, nome: 'Espelhamento', visual: 'espelho'},
	{tipo: 'texto', texto: 'Já conheceu alguém que, em minutos, parecia te entender como ninguém?', destaque: ['ninguém?'], visual: 'espelho'},
	{tipo: 'texto', texto: 'Os mesmos gostos. As mesmas dores. As mesmas opiniões.', destaque: ['mesmos', 'mesmas'], visual: 'espelho', sons: ['whoosh']},
	{tipo: 'texto', texto: 'Talvez fosse conexão. Ou talvez… fosse um espelho.', destaque: ['espelho.'], visual: 'espelho', sons: ['boom']},
	{tipo: 'texto', texto: 'É muito difícil desconfiar de alguém… que parece ser você.', destaque: ['ser', 'você.'], visual: 'mascara', sons: ['riser']},
	{tipo: 'texto', texto: 'Quem é só reflexo… não tem rosto.', destaque: ['não', 'tem', 'rosto.'], visual: 'mascara', sons: ['hit'], estilo: 'grande'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Agora você conhece as sete.', destaque: ['sete.'], visual: 'olho'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Mas todas têm algo em comum…', visual: 'vazio', sons: ['riser']},
	{tipo: 'texto', texto: 'Nenhuma funciona em quem conhece o próprio valor.', destaque: ['próprio', 'valor.'], visual: 'luz', sons: ['hit'], estilo: 'grande'},
	{tipo: 'texto', texto: 'O manipulador não procura pessoas fracas. Procura pessoas que duvidam de si mesmas.', destaque: ['duvidam'], visual: 'marionete'},
	{tipo: 'citacao', texto: 'Conheça o inimigo e conheça a si mesmo, e não temerá o resultado de cem batalhas.', autor: 'Sun Tzu'},
	{tipo: 'texto', texto: 'Hoje você conheceu o inimigo.', visual: 'tesoura', sons: ['tesoura']},
	{tipo: 'final', texto: 'O resto… depende de você.'},
];

// ───────── linha do tempo ─────────
export type Item = Bloco & {inicio: number; frames: number};

const palavras = (s: string) => s.trim().split(/\s+/).length;

export function duracaoDe(b: Bloco): number {
	if (b.duracao) return b.duracao;
	switch (b.tipo) {
		case 'texto': {
			const extra = b.estilo === 'grande' ? 30 : b.estilo === 'defesa' ? 45 : 0;
			return Math.max(80, Math.round(palavras(b.texto) * 11 + 50 + extra));
		}
		case 'titulo':
			return 150;
		case 'tatica':
			return 120;
		case 'citacao':
			return Math.round(palavras(b.texto) * 12 + 90);
		case 'lista':
			return 7 * 26 + 50;
		case 'final':
			return 300;
		case 'silencio':
			return b.duracao;
	}
}

export function montarLinha(roteiro: Bloco[], ritmo = 1): Item[] {
	let t = 0;
	return roteiro.map((b) => {
		const frames = b.duracao ? b.duracao : Math.round(duracaoDe(b) * ritmo);
		const item = {...b, inicio: t, frames} as Item;
		t += frames;
		return item;
	});
}

export const duracaoTotal = (linha: Item[]) => linha.reduce((s, i) => s + i.frames, 0);

export const LINHA_DO_TEMPO = montarLinha(ROTEIRO);
export const DURACAO_TOTAL = duracaoTotal(LINHA_DO_TEMPO);

// ───────── SHORT (9:16, ~55s) ─────────
export const ROTEIRO_SHORT: Bloco[] = [
	{tipo: 'texto', texto: 'Se alguém faz isso com você…', destaque: ['você…'], visual: 'olho', sons: ['coracao'], estilo: 'grande'},
	{tipo: 'texto', texto: 'você está sendo manipulado.', destaque: ['manipulado.'], visual: 'marionete', sons: ['hit'], estilo: 'grande'},
	{tipo: 'tatica', numero: 1, nome: 'Gaslighting', visual: 'lampiao', duracao: 70},
	{tipo: 'texto', texto: '“Isso nunca aconteceu.”', visual: 'sussurros', sons: ['sussurro'], estilo: 'fala'},
	{tipo: 'texto', texto: 'O objetivo é fazer você duvidar da própria mente.', destaque: ['própria', 'mente.'], visual: 'espelho-quebrado', sons: ['boom']},
	{tipo: 'tatica', numero: 2, nome: 'Reforço intermitente', visual: 'alavanca', duracao: 70},
	{tipo: 'texto', texto: 'Um dia, carinho. No outro… frieza.', destaque: ['frieza.'], visual: 'celular'},
	{tipo: 'texto', texto: 'É o mesmo mecanismo de um caça-níquel. Vicia.', destaque: ['caça-níquel.', 'Vicia.'], visual: 'caca-niquel', sons: ['caca-niquel']},
	{tipo: 'tatica', numero: 3, nome: 'Silêncio punitivo', visual: 'onda', duracao: 70},
	{tipo: 'texto', texto: 'Sem explicação. Apenas…', visual: 'onda', estilo: 'grande'},
	{tipo: 'silencio', duracao: 45},
	{tipo: 'texto', texto: 'A rejeição ativa no cérebro a mesma área da dor física.', destaque: ['dor', 'física.'], visual: 'cerebro', sons: ['boom']},
	{tipo: 'texto', texto: 'Nenhuma funciona em quem conhece o próprio valor.', destaque: ['próprio', 'valor.'], visual: 'luz', sons: ['riser']},
	{
		tipo: 'final',
		texto: 'Faltam 4 táticas… no vídeo completo.',
		duracao: 190,
		cta: {chamada: 'Vídeo completo no canal', linha1: 'AS 7 TÁTICAS', linha2: 'DE MANIPULAÇÃO', botao: 'SIGA ➜'},
	},
];

export const LINHA_SHORT = montarLinha(ROTEIRO_SHORT, 0.8);
export const DURACAO_SHORT = duracaoTotal(LINHA_SHORT);
