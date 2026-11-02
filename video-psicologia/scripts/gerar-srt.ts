// Gera legendas .srt do episódio a partir da linha do tempo sincronizada com a voz
import {writeFileSync} from 'node:fs';
import {LINHA_NARCISISTA, SINAIS} from '../src/episodios/narcisista';
import {ATRASO_VOZ, FPS} from '../src/roteiro';
import {falaDoBloco} from '../src/narracao';

const ts = (f: number) => {
	const ms = Math.round((f / FPS) * 1000);
	const h = Math.floor(ms / 3600000);
	const m = Math.floor((ms % 3600000) / 60000);
	const s = Math.floor((ms % 60000) / 1000);
	const r = ms % 1000;
	const p = (n: number, l = 2) => String(n).padStart(l, '0');
	return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};
let n = 0;
const linhas: string[] = [];
for (const it of LINHA_NARCISISTA) {
	if (!it.voz) continue;
	const bruto = it.tipo === 'texto' ? it.texto.replace(/[“”"]/g, '') : falaDoBloco(it, SINAIS);
	if (!bruto) continue;
	const ini = it.inicio + ATRASO_VOZ + Math.round(it.voz.inicio * FPS);
	const fim = it.inicio + ATRASO_VOZ + Math.round(it.voz.fim * FPS) + 6;
	linhas.push(`${++n}\n${ts(ini)} --> ${ts(fim)}\n${bruto}\n`);
}
writeFileSync('exportados/narcisista-legendas-pt-BR.srt', linhas.join('\n'));
console.log(n, 'legendas');
