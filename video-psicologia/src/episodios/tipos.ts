// Episódio 5: "Os 5 tipos de manipulador"
// (o vídeo prometido no final do episódio 4)
import {type Bloco, type Voz, montarLinha, duracaoTotal} from '../roteiro';
import type {ConfigEpisodio} from '../componentes';
import vozes from './tipos-voz.json';

export const TIPOS = ['O Encantador', 'A Eterna Vítima', 'O Controlador', 'O Mártir', 'O Camaleão'];

export const CONFIG_TIPOS: ConfigEpisodio = {
	rotulo: 'TIPO',
	nomes: TIPOS,
	titulo: {destaque: 'OS 5 TIPOS', linha2: 'DE MANIPULADOR', sub: 'e como reconhecer cada um', visual: 'mascaras'},
};

export const FALA_TITULO = 'Os cinco tipos… de manipulador.';

export const ROTEIRO_TIPOS: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Nem todo manipulador grita.', visual: 'mascaras', estilo: 'grande', sons: ['coracao']},
	{tipo: 'texto', texto: 'Alguns sorriem. Alguns choram. Alguns fazem favores.', destaque: ['sorriem.', 'choram.', 'favores.'], visual: 'mascaras'},
	{tipo: 'texto', texto: 'E é por isso que você não percebe.', destaque: ['não', 'percebe.'], visual: 'olho', sons: ['boom']},
	{tipo: 'texto', texto: 'Em 2002, os psicólogos Delroy Paulhus e Kevin Williams descreveram a Tríade Sombria.', destaque: ['2002,', 'Tríade', 'Sombria.'], visual: 'triade', sons: ['relogio']},
	{tipo: 'texto', texto: 'Narcisismo. Maquiavelismo. Psicopatia.', destaque: ['Narcisismo.', 'Maquiavelismo.', 'Psicopatia.'], visual: 'triade', sons: ['hit']},
	{tipo: 'texto', texto: 'Na vida real, esses traços aparecem com cinco rostos diferentes.', destaque: ['cinco', 'rostos'], visual: 'mascaras', sons: ['riser']},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},
	{tipo: 'texto', texto: 'Antes: todo mundo já manipulou alguém alguma vez. O problema é quando vira padrão.', destaque: ['padrão.'], visual: 'vazio'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: TIPOS[0], visual: 'petalas'},
	{tipo: 'texto', texto: 'Ele chega como um presente.', visual: 'petalas'},
	{tipo: 'texto', texto: 'Elogios na medida certa. Atenção total. Parece que te conhece há anos.', destaque: ['Atenção', 'total.'], visual: 'coracao'},
	{tipo: 'texto', texto: 'O charme é a arma. E a velocidade é o truque.', destaque: ['velocidade'], visual: 'petalas', sons: ['boom']},
	{tipo: 'texto', texto: 'Quando você percebe, já está devendo carinho a quem acabou de conhecer.', destaque: ['devendo'], visual: 'correntes'},
	{tipo: 'texto', texto: 'Vá devagar com quem vai rápido demais. Afeto verdadeiro aguenta esperar.', destaque: ['aguenta', 'esperar.'], visual: 'coracao', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: TIPOS[1], visual: 'chuva'},
	{tipo: 'texto', texto: '“Ninguém me entende.” “Todo mundo me abandona.” “Só você me resta.”', visual: 'sussurros', estilo: 'fala', sons: ['sussurro']},
	{tipo: 'texto', texto: 'Ela não te controla pela força. Controla pela culpa.', destaque: ['culpa.'], visual: 'chuva', sons: ['boom']},
	{tipo: 'texto', texto: 'Qualquer limite que você coloca vira mais uma prova de que o mundo é cruel com ela.', destaque: ['limite'], visual: 'chuva'},
	{tipo: 'texto', texto: 'E você fica. Não por amor. Por medo de ser o vilão.', destaque: ['vilão.'], visual: 'espelho-quebrado', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Você pode ter compaixão sem ter obrigação. Acolher não é se anular.', destaque: ['compaixão', 'obrigação.'], visual: 'luz', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: TIPOS[2], visual: 'rastreador'},
	{tipo: 'texto', texto: '“Com quem você estava?” “Por que demorou para responder?” “Me passa sua senha.”', visual: 'sussurros', estilo: 'fala', sons: ['glitch']},
	{tipo: 'texto', texto: 'Tudo começa parecendo cuidado.', destaque: ['cuidado.'], visual: 'rastreador'},
	{tipo: 'texto', texto: 'Depois vem a localização em tempo real. As regras sobre roupas. Os amigos “proibidos”.', destaque: ['regras'], visual: 'rastreador', sons: ['relogio']},
	{tipo: 'texto', texto: 'Ciúme não é prova de amor. É prova de posse.', destaque: ['posse.'], visual: 'correntes', estilo: 'grande', sons: ['boom']},
	{tipo: 'texto', texto: 'Quem confia em você não precisa vigiar você.', destaque: ['vigiar'], visual: 'olho', estilo: 'defesa'},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: TIPOS[3], visual: 'recibo'},
	{tipo: 'texto', texto: 'Ele te ajuda com tudo. Paga a conta. Resolve seus problemas.', destaque: ['tudo.'], visual: 'recibo'},
	{tipo: 'texto', texto: 'Até o dia em que você diz não.', destaque: ['não.'], visual: 'vazio', estilo: 'grande', sons: ['riser']},
	{tipo: 'texto', texto: '“Depois de tudo que eu fiz por você.”', visual: 'recibo', estilo: 'fala', sons: ['hit']},
	{tipo: 'texto', texto: 'Cada favor era, na verdade, um empréstimo. Com juros.', destaque: ['empréstimo.', 'juros.'], visual: 'recibo'},
	{tipo: 'texto', texto: 'Generosidade de verdade não manda a conta depois.', destaque: ['não', 'manda', 'a', 'conta'], visual: 'balanca', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: TIPOS[4], visual: 'mascaras'},
	{tipo: 'texto', texto: 'Com o chefe, ele é exemplar. Com os amigos, o mais divertido. Com você… outra pessoa.', destaque: ['outra', 'pessoa.'], visual: 'mascaras'},
	{tipo: 'texto', texto: 'Ele vira o que cada um quer ver.', visual: 'espelho', sons: ['whoosh']},
	{tipo: 'texto', texto: 'Por isso, quando você tenta contar o que vive… ninguém acredita.', destaque: ['ninguém', 'acredita.'], visual: 'sussurros', sons: ['boom']},
	{tipo: 'texto', texto: 'E muitas vezes ele chega antes, contando a versão dele da história.', destaque: ['versão', 'dele'], visual: 'triangulo'},
	{tipo: 'texto', texto: 'Não tente convencer todo mundo. Guarde provas e confie em quem conhece você de verdade.', destaque: ['Guarde', 'provas'], visual: 'caderno', estilo: 'defesa'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Recapitulando.', visual: 'vazio'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Rostos diferentes. O mesmo objetivo.', destaque: ['mesmo', 'objetivo.'], visual: 'mascaras', sons: ['riser']},
	{tipo: 'texto', texto: 'Fazer você duvidar de si mesmo… para depender deles.', destaque: ['depender'], visual: 'marionete', estilo: 'grande', sons: ['hit']},
	{tipo: 'citacao', texto: 'Quando alguém te mostrar quem é, acredite na primeira vez.', autor: 'Maya Angelou'},
	{tipo: 'texto', texto: 'Agora você conhece os cinco rostos.', visual: 'olho'},
	{
		tipo: 'final',
		texto: 'Nenhum deles… vai te enganar de novo.',
		cta: {chamada: 'Próximo vídeo', linha1: '10 FRASES QUE SÓ', linha2: 'UM MANIPULADOR DIZ', botao: 'INSCREVA-SE'},
	},
];

export const LINHA_TIPOS = montarLinha(ROTEIRO_TIPOS, 1, vozes as Record<string, Voz>);
export const DURACAO_TIPOS = duracaoTotal(LINHA_TIPOS);
