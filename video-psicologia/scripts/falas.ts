// Lista o texto falado de cada bloco de um episódio (índice do bloco -> fala)
// Uso: npx tsx scripts/falas.ts [narcisista|taticas]
import {ROTEIRO_NARCISISTA, SINAIS} from '../src/episodios/narcisista';
import {ROTEIRO, TATICAS} from '../src/roteiro';
import {ROTEIRO_LIBERDADE, PASSOS, FALA_TITULO} from '../src/episodios/liberdade';
import {falaDoBloco} from '../src/narracao';

const ep = process.argv[2] || 'narcisista';
const [roteiro, nomes, op] =
	ep === 'taticas'
		? [ROTEIRO, TATICAS, {rotulo: 'Tática', titulo: 'Sete táticas de manipulação… que você nem percebe.'}]
		: ep === 'liberdade'
			? [ROTEIRO_LIBERDADE, PASSOS, {rotulo: 'Passo', titulo: FALA_TITULO}]
			: [ROTEIRO_NARCISISTA, SINAIS, undefined];
const out: Record<number, string> = {};
roteiro.forEach((b, i) => {
	const t = falaDoBloco(b, nomes, op);
	if (t) out[i] = t;
});
console.log(JSON.stringify(out));
