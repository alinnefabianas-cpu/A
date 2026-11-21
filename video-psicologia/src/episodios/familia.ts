// Episódio 7 (longo): "Quando o manipulador é da sua família"
// (o vídeo prometido no final do episódio 6)
import {type Bloco, type Voz, montarLinha, duracaoTotal} from '../roteiro';
import type {ConfigEpisodio} from '../componentes';
import vozes from './familia-voz.json';

export const DINAMICAS = [
	'O amor condicional',
	'A culpa como herança',
	'O bode expiatório',
	'O filho de ouro',
	'A triangulação familiar',
	'A criança que virou adulto',
	'O pacto do silêncio',
];

export const CONFIG_FAMILIA: ConfigEpisodio = {
	rotulo: 'DINÂMICA',
	nomes: DINAMICAS,
	titulo: {destaque: 'FAMÍLIA', linha2: 'O MANIPULADOR EM CASA', sub: '7 dinâmicas e como se proteger sem se perder', visual: 'casa'},
};

export const FALA_TITULO = 'Quando o manipulador… é da sua família.';

export const ROTEIRO_FAMILIA: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Você pode bloquear um ex. Pode mudar de emprego. Pode se afastar de um amigo.', visual: 'tesoura', sons: ['tesoura']},
	{tipo: 'texto', texto: 'Mas e quando o manipulador… é a sua mãe? O seu pai? O seu irmão?', destaque: ['mãe?', 'pai?', 'irmão?'], visual: 'casa', sons: ['boom']},
	{tipo: 'texto', texto: 'Ninguém escolhe a família em que nasce.', visual: 'arvore', estilo: 'grande'},
	{tipo: 'texto', texto: 'E é justamente por isso que essa é a manipulação mais difícil de enxergar.', destaque: ['mais', 'difícil'], visual: 'olho', sons: ['riser']},
	{tipo: 'texto', texto: 'Ela começou antes de você saber falar. Antes de você poder comparar.', destaque: ['antes'], visual: 'fardo'},
	{tipo: 'texto', texto: 'Para uma criança, o jeito como a família funciona… é o jeito como o mundo funciona.', destaque: ['o', 'mundo', 'funciona.'], visual: 'arvore', sons: ['hit']},
	{tipo: 'texto', texto: 'Neste vídeo, você vai conhecer sete dinâmicas de manipulação familiar. E o que fazer quando não dá simplesmente para ir embora.', destaque: ['sete', 'dinâmicas'], visual: 'casa'},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},
	{tipo: 'texto', texto: 'Antes: nenhuma família é perfeita. Conflito e erro fazem parte de qualquer casa.', destaque: ['perfeita.'], visual: 'mesa'},
	{tipo: 'texto', texto: 'O que vamos falar aqui não é sobre erros. É sobre padrões que se repetem… e machucam.', destaque: ['padrões'], visual: 'grafico'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: DINAMICAS[0], visual: 'coracao'},
	{tipo: 'texto', texto: '“Eu tenho orgulho de você… quando você tira nota boa.”', visual: 'sussurros', estilo: 'fala', sons: ['sussurro']},
	{tipo: 'texto', texto: '“Quando você obedece.” “Quando você não me dá trabalho.”', visual: 'sussurros', estilo: 'fala'},
	{tipo: 'texto', texto: 'A criança aprende uma regra silenciosa: eu só sou amado quando sou útil.', destaque: ['quando', 'sou', 'útil.'], visual: 'balanca', sons: ['boom']},
	{tipo: 'texto', texto: 'E leva essa regra para a vida adulta. No trabalho. Nas amizades. No amor.', destaque: ['vida', 'adulta.'], visual: 'escada'},
	{tipo: 'texto', texto: 'Por isso tanta gente não consegue dizer não. Parece que o amor vai embora junto.', destaque: ['não.'], visual: 'coracao', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Afeto que precisa ser conquistado o tempo todo não é afeto. É salário.', destaque: ['salário.'], visual: 'recibo'},
	{tipo: 'texto', texto: 'Comece a separar o seu valor do seu desempenho. Você merece amor nos dias em que não produz nada.', destaque: ['não', 'produz', 'nada.'], visual: 'luz', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: DINAMICAS[1], visual: 'correntes'},
	{tipo: 'texto', texto: '“Eu sacrifiquei a minha vida por você.”', visual: 'sussurros', estilo: 'fala', sons: ['sussurro']},
	{tipo: 'texto', texto: '“Depois de tudo que eu passei para te criar…”', visual: 'sussurros', estilo: 'fala'},
	{tipo: 'texto', texto: 'Na década de setenta, o psiquiatra Ivan Boszormenyi-Nagy chamou isso de lealdades invisíveis.', destaque: ['lealdades', 'invisíveis.'], visual: 'estudo', sons: ['relogio']},
	{tipo: 'texto', texto: 'Uma dívida que você nunca contraiu… mas que passa a vida tentando pagar.', destaque: ['dívida'], visual: 'recibo', sons: ['boom']},
	{tipo: 'texto', texto: 'Cuidar de um filho não é um empréstimo. É a escolha de quem decidiu ter esse filho.', destaque: ['não', 'é', 'um', 'empréstimo.'], visual: 'balanca', estilo: 'grande'},
	{tipo: 'texto', texto: 'Gratidão é bonita quando é livre. Quando é cobrada, vira controle.', destaque: ['controle.'], visual: 'correntes'},
	{tipo: 'texto', texto: 'Você pode ser grato e, ainda assim, dizer não. As duas coisas cabem no mesmo coração.', destaque: ['grato', 'não.'], visual: 'coracao', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: DINAMICAS[2], visual: 'triangulo'},
	{tipo: 'texto', texto: 'Em muitas famílias disfuncionais, alguém é escolhido para carregar a culpa de tudo.', destaque: ['a', 'culpa', 'de', 'tudo.'], visual: 'arvore', sons: ['boom']},
	{tipo: 'texto', texto: 'Se a casa está tensa, é por causa dele. Se o casamento vai mal, é culpa dela.', destaque: ['culpa'], visual: 'casa'},
	{tipo: 'texto', texto: 'Geralmente, o bode expiatório é o filho mais sensível. O que percebe que algo está errado… e fala.', destaque: ['e', 'fala.'], visual: 'olho'},
	{tipo: 'texto', texto: 'Ao culpar uma pessoa, a família evita olhar para o problema real.', destaque: ['problema', 'real.'], visual: 'espelho-quebrado', sons: ['glitch']},
	{tipo: 'texto', texto: 'Se você foi o bode expiatório, entenda: você não era o problema. Você era o alarme.', destaque: ['o', 'alarme.'], visual: 'luz', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Pare de tentar provar à sua família que você é bom. Prove para você mesmo.', destaque: ['você', 'mesmo.'], visual: 'espelho', estilo: 'defesa'},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: DINAMICAS[3], visual: 'coroa'},
	{tipo: 'texto', texto: 'Do outro lado, existe o filho de ouro. O favorito. O que nunca erra.', destaque: ['nunca', 'erra.'], visual: 'coroa'},
	{tipo: 'texto', texto: 'Parece um privilégio. Mas o filho de ouro também é uma peça no jogo.', destaque: ['peça', 'no', 'jogo.'], visual: 'xadrez', sons: ['boom']},
	{tipo: 'texto', texto: 'Ele é amado pelo que representa… não por quem é.', destaque: ['não', 'por', 'quem', 'é.'], visual: 'mascara'},
	{tipo: 'texto', texto: 'E a comparação entre irmãos cria rivais onde deveriam existir aliados.', destaque: ['rivais', 'aliados.'], visual: 'triangulo'},
	{tipo: 'texto', texto: 'Muitos irmãos só se reaproximam quando percebem que os dois foram usados no mesmo tabuleiro.', destaque: ['mesmo', 'tabuleiro.'], visual: 'xadrez', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: DINAMICAS[4], visual: 'triangulo'},
	{tipo: 'texto', texto: '“Fala para o seu pai que eu não vou fazer janta.” “Sua mãe anda dizendo coisas de você.”', visual: 'sussurros', estilo: 'fala', sons: ['sussurro']},
	{tipo: 'texto', texto: 'O psiquiatra Murray Bowen chamou isso de triângulo: quando dois não resolvem um conflito… puxam um terceiro.', destaque: ['Murray', 'Bowen', 'triângulo:'], visual: 'triangulo', sons: ['relogio']},
	{tipo: 'texto', texto: 'O filho vira mensageiro. Confidente. Juiz da briga dos pais.', destaque: ['mensageiro.', 'Juiz'], visual: 'balanca'},
	{tipo: 'texto', texto: 'Um papel que nenhuma criança deveria ter.', visual: 'fardo', estilo: 'grande', sons: ['boom']},
	{tipo: 'texto', texto: 'Hoje, você pode se recusar: “Isso é entre vocês dois. Eu não vou levar recado.”', destaque: ['Eu', 'não', 'vou', 'levar', 'recado.'], visual: 'tesoura', estilo: 'defesa'},

	// ───────── 6 ─────────
	{tipo: 'tatica', numero: 6, nome: DINAMICAS[5], visual: 'fardo'},
	{tipo: 'texto', texto: 'Você cuidava dos irmãos menores. Acalmava a mãe depois das brigas. Escondia os problemas do pai.', destaque: ['cuidava'], visual: 'fardo'},
	{tipo: 'texto', texto: 'Isso tem nome: parentificação. Quando a criança passa a cuidar dos adultos.', destaque: ['parentificação.'], visual: 'fardo', sons: ['boom']},
	{tipo: 'texto', texto: 'Por fora, parecia maturidade. Por dentro, era uma infância que nunca aconteceu.', destaque: ['nunca', 'aconteceu.'], visual: 'chuva'},
	{tipo: 'texto', texto: 'Esses adultos costumam ser os mais responsáveis da sala… e os mais cansados.', destaque: ['mais', 'cansados.'], visual: 'ecg'},
	{tipo: 'texto', texto: 'E muitas vezes se atraem por parceiros que também precisam ser cuidados.', destaque: ['cuidados.'], visual: 'casal', sons: ['riser']},
	{tipo: 'texto', texto: 'Você não precisa salvar todo mundo. Às vezes, a primeira pessoa a ser cuidada… é você.', destaque: ['é', 'você.'], visual: 'luz', estilo: 'defesa'},

	// ───────── 7 ─────────
	{tipo: 'tatica', numero: 7, nome: DINAMICAS[6], visual: 'onda'},
	{tipo: 'texto', texto: '“Roupa suja se lava em casa.” “Não fala disso com ninguém.”', visual: 'sussurros', estilo: 'fala', sons: ['sussurro']},
	{tipo: 'texto', texto: 'Toda família manipuladora tem uma regra principal: o que acontece aqui… não sai daqui.', destaque: ['não', 'sai', 'daqui.'], visual: 'casa', sons: ['boom']},
	{tipo: 'texto', texto: 'E quem quebra o silêncio vira o traidor. O exagerado. O ingrato.', destaque: ['traidor.'], visual: 'espelho-quebrado'},
	{tipo: 'texto', texto: 'O silêncio protege o padrão. E o padrão passa para a próxima geração.', destaque: ['próxima', 'geração.'], visual: 'arvore', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Falar não é trair a família. É interromper a corrente para que ela não chegue aos seus filhos.', destaque: ['interromper', 'a', 'corrente'], visual: 'tesoura', estilo: 'defesa', sons: ['tesoura']},

	// ───────── COMO SE PROTEGER ─────────
	{tipo: 'texto', texto: 'Mas e se você não pode simplesmente ir embora?', visual: 'porta', estilo: 'grande', sons: ['riser']},
	{tipo: 'texto', texto: 'Primeiro: troque a expectativa pela realidade. Pare de esperar a mãe ou o pai que você merecia.', destaque: ['realidade.'], visual: 'espelho'},
	{tipo: 'texto', texto: 'Cada visita com esperança de ser compreendido termina em decepção. Vá sabendo quem vai encontrar.', destaque: ['quem', 'vai', 'encontrar.'], visual: 'porta'},
	{tipo: 'texto', texto: 'Segundo: limites curtos e repetidos. Sem discurso. Sem justificativa.', destaque: ['curtos', 'repetidos.'], visual: 'pedra', sons: ['boom']},
	{tipo: 'texto', texto: '“Não vou falar sobre isso.” “Se a conversa continuar assim, eu vou embora.” E vá.', destaque: ['E', 'vá.'], visual: 'pedra'},
	{tipo: 'texto', texto: 'Terceiro: controle a dose. Visitas mais curtas. Lugares neutros. Hora para chegar e hora para sair.', destaque: ['controle', 'a', 'dose.'], visual: 'porta', sons: ['relogio']},
	{tipo: 'texto', texto: 'Quarto: construa a família que você escolhe. Amigos, mentores, terapia. Gente que te vê.', destaque: ['família', 'que', 'você', 'escolhe.'], visual: 'rede'},
	{tipo: 'texto', texto: 'E quinto: você não deve reconciliação a ninguém. Perdoar, se quiser, é para você. Não é uma obrigação.', destaque: ['não', 'deve'], visual: 'luz', sons: ['hit']},
	{tipo: 'texto', texto: 'Se a convivência ficar insustentável, se afastar é legítimo. Às vezes, é a única forma de se proteger.', destaque: ['legítimo.'], visual: 'gaiola', estilo: 'defesa'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Recapitulando.', visual: 'vazio'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Você não escolheu a família em que nasceu.', visual: 'arvore'},
	{tipo: 'texto', texto: 'Mas pode escolher o que vai continuar… e o que termina em você.', destaque: ['termina', 'em', 'você.'], visual: 'amanhecer', estilo: 'grande', sons: ['hit']},
	{tipo: 'citacao', texto: 'Nada influencia mais os filhos do que a vida não vivida dos pais.', autor: 'Carl Jung'},
	{tipo: 'texto', texto: 'Viva a sua vida. Inteira.', visual: 'luz', sons: ['riser']},
	{
		tipo: 'final',
		texto: 'Você pode ser… o fim da corrente.',
		cta: {chamada: 'Próximo vídeo', linha1: 'COMO SE CURAR DE', linha2: 'UMA INFÂNCIA DIFÍCIL', botao: 'INSCREVA-SE'},
	},
];

export const LINHA_FAMILIA = montarLinha(ROTEIRO_FAMILIA, 1, vozes as Record<string, Voz>);
export const DURACAO_FAMILIA = duracaoTotal(LINHA_FAMILIA);
