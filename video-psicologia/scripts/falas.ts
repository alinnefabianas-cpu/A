// Lista o texto falado de cada bloco do episódio (índice do bloco -> fala)
import {ROTEIRO_NARCISISTA} from '../src/episodios/narcisista';
import {falaDoBloco} from '../src/narracao';
import {SINAIS} from '../src/episodios/narcisista';
const out: Record<number, string> = {};
ROTEIRO_NARCISISTA.forEach((b, i) => {
	const t = falaDoBloco(b, SINAIS);
	if (t) out[i] = t;
});
console.log(JSON.stringify(out));
