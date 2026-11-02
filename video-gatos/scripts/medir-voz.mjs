// Mede a duração de cada public/voz/NN.mp3 e grava src/duracoes.json.
// O vídeo usa esses tempos para sincronizar cenas, legenda e animações com a fala.
import {execFileSync} from 'node:child_process';
import {readdirSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = join(raiz, 'public', 'voz');
const out = {};
for (const arq of readdirSync(pasta).filter((a) => /^\d\d\.mp3$/.test(a)).sort()) {
	const s = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', join(pasta, arq)]).toString().trim();
	out[arq.slice(0, 2)] = Number(Number(s).toFixed(3));
	console.log('✔', arq, s + 's');
}
writeFileSync(join(raiz, 'src', 'duracoes.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`${Object.keys(out).length} trechos medidos → src/duracoes.json`);
