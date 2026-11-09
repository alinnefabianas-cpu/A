// Episódio 3: "Como se libertar de uma relação tóxica"
// (o vídeo prometido no final do episódio 2)
import {type Bloco, type Voz, montarLinha, duracaoTotal} from '../roteiro';
import type {ConfigEpisodio} from '../componentes';
import vozes from './liberdade-voz.json';

export const PASSOS = [
	'Dê nome ao que acontece',
	'Entenda a corrente invisível',
	'Pare de se explicar',
	'Reconstrua sua rede',
	'Planeje a saída',
	'Resista ao chamado de volta',
];

export const CONFIG_LIBERDADE: ConfigEpisodio = {
	rotulo: 'PASSO',
	nomes: PASSOS,
	titulo: {destaque: 'LIBERTE-SE', linha2: 'DE UMA RELAÇÃO TÓXICA', sub: '6 passos para sair e não voltar', visual: 'gaiola'},
};

export const FALA_TITULO = 'Como se libertar… de uma relação tóxica.';

export const ROTEIRO_LIBERDADE: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Você já percebeu.', visual: 'olho', estilo: 'grande', sons: ['coracao']},
	{tipo: 'texto', texto: 'Já viu os sinais. Já reconheceu as táticas.', destaque: ['sinais.', 'táticas.'], visual: 'marionete'},
	{tipo: 'texto', texto: 'E mesmo assim… continua lá.', destaque: ['continua', 'lá.'], visual: 'gaiola', sons: ['boom']},
	{tipo: 'texto', texto: 'Não porque você é fraco. Mas porque ninguém te ensinou a sair.', destaque: ['ninguém', 'te', 'ensinou'], visual: 'gaiola'},
	{tipo: 'texto', texto: 'Muitas pessoas tentam ir embora várias vezes… antes de conseguir de verdade.', destaque: ['várias', 'vezes…'], visual: 'escada', sons: ['riser']},
	{tipo: 'texto', texto: 'Hoje você vai aprender seis passos para que a próxima vez… seja a última.', destaque: ['última.'], visual: 'porta', sons: ['hit']},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},
	{tipo: 'texto', texto: 'Antes: se existe violência física ou ameaça, ligue cento e oitenta ou cento e noventa.', destaque: ['violência', 'física'], visual: 'vazio'},
	{tipo: 'texto', texto: 'Sua segurança vem antes de qualquer conselho deste vídeo.', destaque: ['segurança'], visual: 'luz'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: PASSOS[0], visual: 'caderno'},
	{tipo: 'texto', texto: 'Quem está dentro de uma relação tóxica raramente usa essa palavra.', destaque: ['raramente'], visual: 'espelho-quebrado'},
	{tipo: 'texto', texto: 'Diz que é “uma fase”. Que “todo casal briga”. Que “ele não é sempre assim”.', visual: 'sussurros', sons: ['sussurro']},
	{tipo: 'texto', texto: 'Enquanto o problema não tem nome… ele não pode ser enfrentado.', destaque: ['nome…'], visual: 'caderno', sons: ['boom']},
	{tipo: 'texto', texto: 'Escreva o que aconteceu. Com datas. Sem suavizar.', destaque: ['Sem', 'suavizar.'], visual: 'caderno'},
	{tipo: 'texto', texto: 'Ler a própria história no papel quebra o efeito do gaslighting.', destaque: ['quebra'], visual: 'caderno', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: PASSOS[1], visual: 'correntes'},
	{tipo: 'texto', texto: 'Em 1981, os psicólogos Donald Dutton e Susan Painter descreveram o vínculo traumático.', destaque: ['1981,', 'vínculo', 'traumático.'], visual: 'correntes', sons: ['relogio']},
	{tipo: 'texto', texto: 'Quando dor e carinho se alternam, o cérebro se prende a quem causa os dois.', destaque: ['dor', 'carinho'], visual: 'grafico'},
	{tipo: 'texto', texto: 'É o mesmo reforço intermitente da máquina caça-níquel.', destaque: ['caça-níquel.'], visual: 'caca-niquel', sons: ['caca-niquel']},
	{tipo: 'texto', texto: 'Por isso você sente falta de quem te machuca.', destaque: ['falta'], visual: 'coracao', estilo: 'grande', sons: ['boom']},
	{tipo: 'texto', texto: 'Isso não é amor verdadeiro. É abstinência.', destaque: ['abstinência.'], visual: 'cerebro', sons: ['hit']},
	{tipo: 'texto', texto: 'Quando a saudade vier, diga a si mesmo: isso é o vínculo falando, não a verdade.', destaque: ['vínculo', 'falando,'], visual: 'correntes', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: PASSOS[2], visual: 'pedra'},
	{tipo: 'texto', texto: 'Justificar. Argumentar. Defender. Explicar.', destaque: ['Justificar.', 'Argumentar.', 'Defender.', 'Explicar.'], visual: 'onda'},
	{tipo: 'texto', texto: 'Toda explicação vira munição para a próxima discussão.', destaque: ['munição'], visual: 'sussurros', sons: ['glitch']},
	{tipo: 'texto', texto: 'Existe uma técnica chamada pedra cinza.', destaque: ['pedra', 'cinza.'], visual: 'pedra', sons: ['boom']},
	{tipo: 'texto', texto: 'Respostas curtas. Neutras. Sem emoção.', visual: 'pedra'},
	{tipo: 'texto', texto: 'Quem se alimenta da sua reação… morre de fome diante de uma pedra.', destaque: ['morre', 'de', 'fome'], visual: 'pedra', estilo: 'grande'},
	{tipo: 'texto', texto: '“Entendi.” “Vou pensar.” “Não vou discutir isso.” Frases curtas protegem.', destaque: ['protegem.'], visual: 'pedra', estilo: 'defesa'},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: PASSOS[3], visual: 'rede'},
	{tipo: 'texto', texto: 'O isolamento quase nunca acontece de uma vez.', destaque: ['isolamento'], visual: 'mesa'},
	{tipo: 'texto', texto: 'Primeiro um amigo “que não presta”. Depois a família “que se mete demais”.', visual: 'triangulo'},
	{tipo: 'texto', texto: 'Até que só sobra uma voz na sua vida… a dele.', destaque: ['a', 'dele.'], visual: 'vazio', sons: ['boom']},
	{tipo: 'texto', texto: 'Mande uma mensagem hoje. Para uma pessoa só.', destaque: ['hoje.'], visual: 'celular'},
	{tipo: 'texto', texto: 'Cada pessoa que volta para a sua vida é um fio a menos da corrente.', destaque: ['um', 'fio', 'a', 'menos'], visual: 'rede', sons: ['riser']},
	{tipo: 'texto', texto: 'Não precisa contar tudo. Só precisa não estar sozinho.', destaque: ['sozinho.'], visual: 'rede', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: PASSOS[4], visual: 'porta'},
	{tipo: 'texto', texto: 'Sair no meio de uma briga quase sempre termina em volta.', destaque: ['volta.'], visual: 'escada'},
	{tipo: 'texto', texto: 'Sair com um plano… é diferente.', destaque: ['plano…'], visual: 'porta', sons: ['porta']},
	{tipo: 'texto', texto: 'Documentos. Um pouco de dinheiro guardado. Um lugar para ficar. Uma pessoa de confiança que sabe.', destaque: ['Documentos.', 'confiança'], visual: 'caderno'},
	{tipo: 'texto', texto: 'E depois de sair: contato zero. Ou o mínimo possível, se houver filhos.', destaque: ['contato', 'zero.'], visual: 'tesoura', sons: ['tesoura']},
	{tipo: 'texto', texto: 'Bloqueie onde for preciso. Isso não é infantil. É cirurgia.', destaque: ['cirurgia.'], visual: 'tesoura', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Se houver risco, procure a Central de Atendimento à Mulher no cento e oitenta. É gratuito e sigiloso.', destaque: ['gratuito', 'sigiloso.'], visual: 'luz', estilo: 'defesa'},

	// ───────── 6 ─────────
	{tipo: 'tatica', numero: 6, nome: PASSOS[5], visual: 'celular'},
	{tipo: 'texto', texto: 'Semanas depois, quando você começa a respirar… o celular vibra.', destaque: ['vibra.'], visual: 'celular', sons: ['riser']},
	{tipo: 'texto', texto: '“Sinto sua falta.” “Eu mudei.” “Ninguém nunca vai te amar como eu.”', visual: 'sussurros', estilo: 'fala', sons: ['sussurro']},
	{tipo: 'texto', texto: 'Em inglês, isso tem nome: hoovering. Como um aspirador… tentando te sugar de volta.', destaque: ['sugar', 'de', 'volta.'], visual: 'onda', sons: ['boom']},
	{tipo: 'texto', texto: 'Não é saudade. É o medo de perder o controle.', destaque: ['controle.'], visual: 'marionete'},
	{tipo: 'texto', texto: 'Mudança verdadeira não aparece em mensagens. Aparece em anos de atitude.', destaque: ['anos'], visual: 'grafico'},
	{tipo: 'texto', texto: 'Releia o que você escreveu no passo um. O papel lembra o que a saudade esquece.', destaque: ['O', 'papel', 'lembra'], visual: 'caderno', estilo: 'defesa'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Recapitulando.', visual: 'vazio'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Vai doer. Vai ter dia em que voltar vai parecer mais fácil.', destaque: ['doer.'], visual: 'chuva'},
	{tipo: 'texto', texto: 'Mas a dor de sair passa. A dor de ficar… só aumenta.', destaque: ['passa.', 'aumenta.'], visual: 'amanhecer', estilo: 'grande', sons: ['hit']},
	{tipo: 'citacao', texto: 'A ferida é o lugar por onde a luz entra em você.', autor: 'Rumi'},
	{tipo: 'texto', texto: 'Sair não é o fim da história.', visual: 'gaiola', sons: ['porta']},
	{
		tipo: 'final',
		texto: 'É o primeiro dia… da sua.',
		cta: {chamada: 'Próximo vídeo', linha1: 'O CÉREBRO DE QUEM', linha2: 'AMA UM NARCISISTA', botao: 'INSCREVA-SE'},
	},
];

export const LINHA_LIBERDADE = montarLinha(ROTEIRO_LIBERDADE, 1, vozes as Record<string, Voz>);
export const DURACAO_LIBERDADE = duracaoTotal(LINHA_LIBERDADE);
