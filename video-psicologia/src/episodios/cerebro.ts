// Episódio 4: "O cérebro de quem ama um narcisista"
// (o vídeo prometido no final do episódio 3)
import {type Bloco, type Voz, montarLinha, duracaoTotal} from '../roteiro';
import type {ConfigEpisodio} from '../componentes';
import vozes from './cerebro-voz.json';

export const MECANISMOS = [
	'Dopamina: o vício da espera',
	'Ocitocina: a cola química',
	'Cortisol: o corpo em alerta',
	'Dissonância: a mente que se engana',
	'Rejeição: dor que vicia',
	'Neuroplasticidade: a cura',
];

export const CONFIG_CEREBRO: ConfigEpisodio = {
	rotulo: 'MECANISMO',
	nomes: MECANISMOS,
	titulo: {destaque: 'SEU CÉREBRO', linha2: 'AMANDO UM NARCISISTA', sub: 'por que é tão difícil esquecer', visual: 'cerebro'},
};

export const FALA_TITULO = 'O cérebro… de quem ama um narcisista.';

export const ROTEIRO_CEREBRO: Bloco[] = [
	// ───────── GANCHO ─────────
	{tipo: 'texto', texto: 'Você sabe que ele te faz mal.', destaque: ['mal.'], visual: 'olho', sons: ['coracao']},
	{tipo: 'texto', texto: 'Você já viu os sinais. Já ouviu dos amigos.', visual: 'sussurros'},
	{tipo: 'texto', texto: 'E mesmo assim… pensa nele o dia inteiro.', destaque: ['o', 'dia', 'inteiro.'], visual: 'celular', sons: ['riser']},
	{tipo: 'texto', texto: 'Isso não é fraqueza.', visual: 'vazio', estilo: 'grande', sons: ['boom']},
	{tipo: 'texto', texto: 'É química.', destaque: ['química.'], visual: 'cerebro', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Hoje você vai ver o que acontece dentro do seu cérebro… e como desligar esse vício.', destaque: ['desligar'], visual: 'neuronios'},
	{tipo: 'silencio', duracao: 20},
	{tipo: 'titulo'},
	{tipo: 'texto', texto: 'Antes: isto é divulgação científica, não substitui terapia.', destaque: ['não', 'substitui'], visual: 'vazio'},

	// ───────── 1 ─────────
	{tipo: 'tatica', numero: 1, nome: MECANISMOS[0], visual: 'dopamina'},
	{tipo: 'texto', texto: 'Nos anos noventa, o neurocientista Wolfram Schultz estudou a dopamina em macacos.', destaque: ['Wolfram', 'Schultz'], visual: 'estudo', sons: ['relogio']},
	{tipo: 'texto', texto: 'Ele descobriu que ela dispara mais forte quando a recompensa é inesperada.', destaque: ['inesperada.'], visual: 'dopamina'},
	{tipo: 'texto', texto: 'Uma mensagem carinhosa depois de dias de frieza… é uma explosão de dopamina.', destaque: ['explosão'], visual: 'celular', sons: ['boom']},
	{tipo: 'texto', texto: 'O seu cérebro não fica viciado na pessoa. Fica viciado na espera.', destaque: ['espera.'], visual: 'grafico', estilo: 'grande'},
	{tipo: 'texto', texto: 'Quando a ansiedade apertar, lembre: é o cérebro pedindo dose. Não é destino.', destaque: ['dose.'], visual: 'dopamina', estilo: 'defesa'},

	// ───────── 2 ─────────
	{tipo: 'tatica', numero: 2, nome: MECANISMOS[1], visual: 'ocitocina'},
	{tipo: 'texto', texto: 'A ocitocina é liberada no toque, no abraço, na intimidade.', destaque: ['ocitocina'], visual: 'ocitocina'},
	{tipo: 'texto', texto: 'Ela cria confiança. Faz você baixar a guarda.', destaque: ['baixar', 'a', 'guarda.'], visual: 'coracao'},
	{tipo: 'texto', texto: 'O problema: ela não escolhe quem merece.', destaque: ['quem', 'merece.'], visual: 'ocitocina', sons: ['boom']},
	{tipo: 'texto', texto: 'Depois de cada briga vem a reconciliação… e a cola fica mais forte.', destaque: ['mais', 'forte.'], visual: 'correntes', sons: ['riser']},
	{tipo: 'texto', texto: 'Desconfie da paz que só existe depois da guerra.', destaque: ['depois', 'da', 'guerra.'], visual: 'correntes', estilo: 'defesa'},

	// ───────── 3 ─────────
	{tipo: 'tatica', numero: 3, nome: MECANISMOS[2], visual: 'ecg'},
	{tipo: 'texto', texto: 'Pisar em ovos. Medir cada palavra. Ler o humor dele pelo som da porta.', destaque: ['Pisar', 'em', 'ovos.'], visual: 'porta', sons: ['porta']},
	{tipo: 'texto', texto: 'O cortisol, hormônio do estresse, mantém o seu corpo em alerta máximo.', destaque: ['alerta', 'máximo.'], visual: 'ecg'},
	{tipo: 'texto', texto: 'Insônia. Cansaço. Esquecimento. Dor no estômago.', visual: 'ecg', sons: ['coracao']},
	{tipo: 'texto', texto: 'O corpo grita antes de a mente aceitar.', destaque: ['grita'], visual: 'onda', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Preste atenção em como seu corpo se sente perto dessa pessoa. Ele não mente.', destaque: ['não', 'mente.'], visual: 'ecg', estilo: 'defesa'},

	// ───────── 4 ─────────
	{tipo: 'tatica', numero: 4, nome: MECANISMOS[3], visual: 'balanca'},
	{tipo: 'texto', texto: 'Em 1957, o psicólogo Leon Festinger descreveu a dissonância cognitiva.', destaque: ['1957,', 'Festinger'], visual: 'estudo', sons: ['relogio']},
	{tipo: 'texto', texto: 'Quando o que você sente e o que você vê não combinam… a mente sofre.', destaque: ['sofre.'], visual: 'espelho-quebrado'},
	{tipo: 'texto', texto: 'E para parar de sofrer, ela inventa desculpas.', destaque: ['inventa', 'desculpas.'], visual: 'sussurros', sons: ['sussurro']},
	{tipo: 'texto', texto: '“Ele teve uma infância difícil.” “No fundo, ele me ama.”', visual: 'sussurros', estilo: 'fala'},
	{tipo: 'texto', texto: 'Quanto mais você investiu… mais difícil é admitir.', destaque: ['investiu…'], visual: 'balanca', sons: ['boom']},
	{tipo: 'texto', texto: 'Julgue pelas atitudes, não pelas explicações que você cria para elas.', destaque: ['atitudes,'], visual: 'balanca', estilo: 'defesa'},

	// ───────── 5 ─────────
	{tipo: 'tatica', numero: 5, nome: MECANISMOS[4], visual: 'cerebro'},
	{tipo: 'texto', texto: 'Em 2010, a antropóloga Helen Fisher colocou pessoas recém-rejeitadas numa máquina de ressonância.', destaque: ['2010,', 'Helen', 'Fisher'], visual: 'estudo', sons: ['relogio']},
	{tipo: 'texto', texto: 'Ao verem a foto de quem as deixou, acenderam áreas ligadas à recompensa e à fissura.', destaque: ['fissura.'], visual: 'cerebro', sons: ['boom']},
	{tipo: 'texto', texto: 'Regiões parecidas com as que se ativam no desejo por drogas.', destaque: ['drogas.'], visual: 'cerebro'},
	{tipo: 'texto', texto: 'Ser rejeitado não diminui o desejo. Aumenta.', destaque: ['Aumenta.'], visual: 'coracao', estilo: 'grande', sons: ['hit']},
	{tipo: 'texto', texto: 'Por isso ver fotos e stalkear redes piora tudo. Cada olhada é uma recaída.', destaque: ['recaída.'], visual: 'celular', estilo: 'defesa'},

	// ───────── 6 ─────────
	{tipo: 'tatica', numero: 6, nome: MECANISMOS[5], visual: 'neuronios'},
	{tipo: 'texto', texto: 'Agora a boa notícia.', visual: 'luz', estilo: 'grande', sons: ['riser']},
	{tipo: 'texto', texto: 'O cérebro muda a vida inteira. Isso se chama neuroplasticidade.', destaque: ['neuroplasticidade.'], visual: 'neuronios'},
	{tipo: 'texto', texto: 'Caminhos que não são usados… enfraquecem.', destaque: ['enfraquecem.'], visual: 'neuronios'},
	{tipo: 'texto', texto: 'Cada dia sem contato é um dia de desintoxicação.', destaque: ['desintoxicação.'], visual: 'grafico', sons: ['boom']},
	{tipo: 'texto', texto: 'No começo dói como abstinência. Depois… o silêncio vira paz.', destaque: ['paz.'], visual: 'amanhecer'},
	{tipo: 'texto', texto: 'Novos hábitos, novas pessoas, novos prazeres. É assim que se reconstrói o caminho.', destaque: ['reconstrói'], visual: 'rede', estilo: 'defesa'},

	// ───────── FECHAMENTO ─────────
	{tipo: 'texto', texto: 'Recapitulando.', visual: 'vazio'},
	{tipo: 'lista'},
	{tipo: 'texto', texto: 'Você não está louco. Não é fraco. Não é burro.', destaque: ['louco.', 'fraco.', 'burro.'], visual: 'espelho'},
	{tipo: 'texto', texto: 'Você está em abstinência. E abstinência… passa.', destaque: ['passa.'], visual: 'amanhecer', estilo: 'grande', sons: ['hit']},
	{tipo: 'citacao', texto: 'Quando já não somos capazes de mudar uma situação, somos desafiados a mudar a nós mesmos.', autor: 'Viktor Frankl'},
	{tipo: 'texto', texto: 'Seu cérebro aprendeu a amar quem te fere.', visual: 'cerebro', sons: ['boom']},
	{
		tipo: 'final',
		texto: 'Ele também pode… aprender a te proteger.',
		cta: {chamada: 'Próximo vídeo', linha1: 'OS 5 TIPOS DE', linha2: 'MANIPULADOR', botao: 'INSCREVA-SE'},
	},
];

export const LINHA_CEREBRO = montarLinha(ROTEIRO_CEREBRO, 1, vozes as Record<string, Voz>);
export const DURACAO_CEREBRO = duracaoTotal(LINHA_CEREBRO);
