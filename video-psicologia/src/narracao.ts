import type {Bloco} from './roteiro';

const NUM = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];

// Anos por extenso soam mais naturais na voz sintética
const POR_EXTENSO: Record<string, string> = {
	'1944': 'mil novecentos e quarenta e quatro',
	'1950': 'mil novecentos e cinquenta',
	'1966': 'mil novecentos e sessenta e seis',
	'1979': 'mil novecentos e setenta e nove',
	'2010': 'dois mil e dez',
	'2014': 'dois mil e catorze',
};
const extenso = (t: string) => t.replace(/\b(1944|1950|1966|1979|2010|2014)\b/g, (m) => POR_EXTENSO[m]);

// Ajustes de pronúncia para a voz sintética
const pronuncia = (t: string) => extenso(t).replace(/\bB\. F\. Skinner\b/g, 'Skinner');

export type OpcoesFala = {rotulo: string; titulo: string};
const PADRAO: OpcoesFala = {rotulo: 'Sinal', titulo: 'Como reconhecer um narcisista… em cinco minutos.'};

/** Texto que a narração lê em cada bloco (null = bloco sem voz). */
export function falaDoBloco(b: Bloco, nomes: string[] = [], op: OpcoesFala = PADRAO): string | null {
	const t = falaBruta(b, nomes, op);
	return t ? pronuncia(t) : null;
}

function falaBruta(b: Bloco, nomes: string[], op: OpcoesFala): string | null {
	switch (b.tipo) {
		case 'texto':
			return b.texto.replace(/[“”"]/g, '');
		case 'titulo':
			return op.titulo;
		case 'tatica':
			return `${op.rotulo} número ${NUM[b.numero]}. ${b.nome}.`;
		case 'citacao':
			return `${b.texto} ${b.autor}.`;
		case 'lista':
			return nomes.length ? nomes.join('. ') + '.' : null;
		case 'final':
			return b.texto;
		default:
			return null;
	}
}
