import type {Bloco} from './roteiro';

const NUM = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];

/** Texto que a narração lê em cada bloco (null = bloco sem voz). */
export function falaDoBloco(b: Bloco, nomes: string[] = []): string | null {
	switch (b.tipo) {
		case 'texto':
			return b.texto.replace(/[“”"]/g, '');
		case 'titulo':
			return 'Como reconhecer um narcisista… em cinco minutos.';
		case 'tatica':
			return `Sinal número ${NUM[b.numero]}. ${b.nome}.`;
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
