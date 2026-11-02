// Renderiza um quadro do meio de cada bloco e junta numa folha de contato (revisão rápida)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.join(raiz, 'src/index.ts')});
const browserExecutable = execSync(`ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell`).toString().trim().split('\n')[0];
const composition = await selectComposition({serveUrl, id: 'Video', browserExecutable});
mkdirSync(path.join(raiz, 'out/contato'), {recursive: true});
let i = 0;
for (const frame of frames) {
	const out = path.join(raiz, `out/contato/${String(i++).padStart(3, '0')}.jpg`);
	await renderStill({serveUrl, composition, frame, output: out, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.25, browserExecutable});
}
console.log('ok', frames.length);
