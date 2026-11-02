// Episódio 2: "Como reconhecer um narcisista em 5 minutos"
// (o vídeo prometido no final do episódio 1)
import {type Bloco, montarLinha, duracaoTotal} from '../roteiro';
import type {ConfigEpisodio} from '../componentes';

export const SINAIS = [
	'Ele domina a conversa',
	'Charme demais, cedo demais',
	'Ele é sempre o herói',
	'Todos os ex são loucos',
	'O teste do garçom',
	'Não suporta a menor crítica',
	'Ele admite',
];

export const CONFIG_NARCISISTA: ConfigEpisodio = {
	rotulo: 'SINAL',
	nomes: SINAIS,
	titulo: {destaque: 'NARCISISTA', linha2: 'EM 5 MINUTOS', sub: '7 sinais para reconhecer antes que seja tarde', visual: 'lago'},
};

export const ROTEIRO_NARCISISTA: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Na mitologia grega, Narciso viu o próprio reflexo na água…', destaque: ['próprio', 'reflexo'], visual: 'lago', sons: ['sussurro']},
	{tipo: 'texto', texto: 'e se apaixonou por ele.', destaque: ['apaixonou'], visual: 'lago', estilo: 'grande', sons: ['boom']},
	{tipo: 'texto', texto: 'Ficou ali, olhando para si mesmo… até morrer.', destaque: ['até', 'morrer.'], visual: 'lago', sons: ['riser']},
	{tipo: 'texto', texto: 'Hoje, os Narcisos não olham para lagos.', visual: 'espelho', sons: ['hit']},
	{tipo: 'texto', texto: 'Eles olham para você. E usam você como espelho.', destaque: ['você.', 'espelho.'], visual: 'espelho'},
	{tipo: 'texto', texto: 'O problema é que, no começo… eles são encantadores.', destaque: ['encantadores.'], visual: 'mascara'},
	{tipo: 'texto', texto: 'Mas existem sinais. E eles aparecem nos primeiros cinco minutos.', destaque: ['cinco', 'minutos.'], visual: 'cronometro', sons: ['relogio']},
	{tipo: 'texto', texto: 'Se você souber onde olhar.', visual: 'olho', estilo: 'grande', sons: ['boom']},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},
	{tipo: 'texto', texto: 'Antes: só um profissional pode diagnosticar o Transtorno de Personalidade Narcisista.', destaque: ['profissional'], visual: 'vazio'},
	{tipo: 'texto', texto: 'Mas estes sinais servem como alerta. E alerta… já é proteção.', destaque: ['alerta…', 'proteção.'], visual: 'vazio'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: SINAIS[0], visual: 'balanca'},
	{tipo: 'texto', texto: 'Em 1979, o sociólogo Charles Derber estudou como as pessoas conversam.', destaque: ['1979,', 'Derber'], visual: 'balanca', sons: ['relogio']},
	{tipo: 'texto', texto: 'Ele percebeu dois tipos de resposta.', visual: 'balanca'},
	{tipo: 'texto', texto: 'Você diz: “Estou exausta.” A resposta de apoio é: “O que aconteceu?”', destaque: ['apoio'], visual: 'balanca'},
	{tipo: 'texto', texto: 'A resposta de desvio é: “Exausto estou eu, você não imagina minha semana.”', destaque: ['desvio'], visual: 'balanca', sons: ['glitch']},
	{tipo: 'texto', texto: 'O narcisista desvia. Sempre. Toda conversa volta para ele.', destaque: ['Sempre.'], visual: 'balanca', sons: ['boom']},
	{tipo: 'texto', texto: 'Conte quantas perguntas ele faz sobre você. Se for zero… você já tem a resposta.', destaque: ['zero…'], visual: 'balanca', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: SINAIS[1], visual: 'mascara'},
	{tipo: 'texto', texto: 'Em 2010, pesquisadores alemães colocaram desconhecidos frente a frente.', destaque: ['2010,'], visual: 'casal', sons: ['relogio']},
	{tipo: 'texto', texto: 'Quem eles acharam mais simpático no primeiro encontro?', visual: 'casal', sons: ['riser']},
	{tipo: 'texto', texto: 'Os narcisistas.', destaque: ['narcisistas.'], visual: 'mascara', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Roupas impecáveis. Sorriso seguro. Piadas no momento certo.', visual: 'mascara'},
	{tipo: 'texto', texto: 'O charme não é falso por ser charme. É falso quando chega rápido demais… e intenso demais.', destaque: ['rápido', 'demais…'], visual: 'petalas'},
	{tipo: 'texto', texto: 'Desconfie de quem parece perfeito antes mesmo de conhecer você.', destaque: ['perfeito'], visual: 'mascara', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: SINAIS[2], visual: 'coroa'},
	{tipo: 'texto', texto: 'Preste atenção nas histórias que ele conta.', visual: 'coroa'},
	{tipo: 'texto', texto: 'Ele salvou a empresa. Ele foi injustiçado. Ele viu o que ninguém viu.', destaque: ['Ele'], visual: 'coroa'},
	{tipo: 'texto', texto: 'Em todas, ele é o herói. Ou a vítima. Nunca um coadjuvante.', destaque: ['herói.', 'vítima.'], visual: 'coroa', sons: ['boom']},
	{tipo: 'texto', texto: 'Isso se chama grandiosidade: a necessidade de ser especial… o tempo todo.', destaque: ['grandiosidade:'], visual: 'luz'},
	{tipo: 'texto', texto: 'Pessoas seguras não precisam de plateia. Narcisistas não vivem sem uma.', destaque: ['plateia.'], visual: 'coroa', estilo: 'defesa'},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: SINAIS[3], visual: 'sussurros'},
	{tipo: 'texto', texto: '“Minha ex era louca.”', visual: 'sussurros', sons: ['sussurro'], estilo: 'fala'},
	{tipo: 'texto', texto: '“Meu antigo chefe tinha inveja de mim.”', visual: 'sussurros', estilo: 'fala'},
	{tipo: 'texto', texto: '“Meus amigos me traíram.”', visual: 'sussurros', sons: ['glitch'], estilo: 'fala'},
	{tipo: 'texto', texto: 'Se todas as pessoas do passado dele são vilãs…', destaque: ['vilãs…'], visual: 'triangulo', sons: ['riser']},
	{tipo: 'texto', texto: 'adivinhe qual vai ser o seu papel na próxima história.', destaque: ['seu', 'papel'], visual: 'triangulo', estilo: 'grande', sons: ['boom']},
	{tipo: 'texto', texto: 'Observe como ele fala de quem já foi embora. É assim que vai falar de você.', destaque: ['de', 'você.'], visual: 'triangulo', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: SINAIS[4], visual: 'mesa'},
	{tipo: 'texto', texto: 'Existe uma regra antiga: preste atenção em como alguém trata o garçom.', destaque: ['garçom.'], visual: 'mesa'},
	{tipo: 'texto', texto: 'Com você, ele é gentil. Você ainda é útil.', destaque: ['útil.'], visual: 'mesa'},
	{tipo: 'texto', texto: 'Mas com quem não pode oferecer nada… a máscara escorrega.', destaque: ['máscara', 'escorrega.'], visual: 'mascara', sons: ['boom']},
	{tipo: 'texto', texto: 'Impaciência. Desprezo. Estalar de dedos. Pequenas humilhações.', destaque: ['Desprezo.'], visual: 'mascara'},
	{tipo: 'texto', texto: 'A empatia não é o que alguém mostra a você. É o que mostra a quem não importa para ele.', destaque: ['quem', 'não', 'importa'], visual: 'luz', estilo: 'defesa'},

	// ───────── 6 ─────────
	{tipo: 'tatica', numero: 6, nome: SINAIS[5], visual: 'espelho-quebrado'},
	{tipo: 'texto', texto: 'Faça um comentário pequeno. Uma discordância leve. Uma brincadeira.', visual: 'espelho'},
	{tipo: 'texto', texto: 'E observe o rosto dele.', visual: 'olho', estilo: 'grande', sons: ['riser']},
	{tipo: 'texto', texto: 'Por trás da confiança existe uma autoestima frágil como vidro.', destaque: ['frágil'], visual: 'espelho-quebrado', sons: ['boom']},
	{tipo: 'texto', texto: 'O psicanalista Heinz Kohut chamou isso de ferida narcísica.', destaque: ['ferida', 'narcísica.'], visual: 'espelho-quebrado'},
	{tipo: 'texto', texto: 'A reação vem desproporcional: frieza, sarcasmo… ou raiva.', destaque: ['raiva.'], visual: 'cerebro', sons: ['glitch']},
	{tipo: 'texto', texto: 'Quem não aguenta um arranhão no ego… vai cobrar esse arranhão de você.', destaque: ['cobrar'], visual: 'espelho-quebrado', estilo: 'defesa'},

	// ───────── 7 ─────────
	{tipo: 'tatica', numero: 7, nome: SINAIS[6], visual: 'olho'},
	{tipo: 'texto', texto: 'O último sinal é o mais estranho de todos.', visual: 'olho', sons: ['riser']},
	{tipo: 'texto', texto: 'Em 2014, pesquisadores testaram uma única pergunta:', destaque: ['2014,'], visual: 'grafico', sons: ['relogio']},
	{tipo: 'texto', texto: '“Você se considera narcisista?”', visual: 'sussurros', estilo: 'fala', sons: ['boom']},
	{tipo: 'texto', texto: 'E os narcisistas… respondiam que sim. Com orgulho.', destaque: ['sim.', 'orgulho.'], visual: 'coroa', sons: ['hit']},
	{tipo: 'texto', texto: 'Para eles, não é defeito. É prova de que são superiores.', destaque: ['superiores.'], visual: 'coroa'},
	{tipo: 'texto', texto: 'Às vezes, a forma mais fácil de descobrir… é perguntar. E acreditar na resposta.', destaque: ['acreditar'], visual: 'luz', estilo: 'defesa'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Recapitulando.', visual: 'cronometro'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Um sinal sozinho não prova nada. Mas três ou quatro juntos…', destaque: ['três', 'ou', 'quatro'], visual: 'vazio', sons: ['riser']},
	{tipo: 'texto', texto: 'formam um padrão.', destaque: ['padrão.'], visual: 'vazio', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Narciso não precisava de ninguém. Só de um reflexo.', destaque: ['reflexo.'], visual: 'lago'},
	{tipo: 'citacao', texto: 'Quem olha para fora, sonha. Quem olha para dentro, desperta.', autor: 'Carl Jung'},
	{tipo: 'texto', texto: 'Não seja o espelho de ninguém.', visual: 'tesoura', sons: ['tesoura']},
	{
		tipo: 'final',
		texto: 'Seja… o seu próprio reflexo.',
		cta: {chamada: 'Próximo vídeo', linha1: 'COMO SE LIBERTAR DE', linha2: 'UMA RELAÇÃO TÓXICA', botao: 'INSCREVA-SE'},
	},
];

export const LINHA_NARCISISTA = montarLinha(ROTEIRO_NARCISISTA);
export const DURACAO_NARCISISTA = duracaoTotal(LINHA_NARCISISTA);
