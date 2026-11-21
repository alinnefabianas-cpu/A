// Render one mid-frame still per shot index given on the command line (single bundle).
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const compId = process.env.COMP || 'Ep001Full';
const epFile = {Ep001Full: 'episode_001', Ep002Full: 'episode_002', Ep003Full: 'episode_003'}[compId];
const ep = JSON.parse(fs.readFileSync(`src/episodes/${epFile}.json`, 'utf8'));
const idx = process.argv.slice(2).map(Number);
const browserExecutable = process.env.CHROME;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: compId, browserExecutable});
fs.mkdirSync('out/review', {recursive: true});
for (const i of idx) {
  const s = ep.shots[i];
  const frame = s.from + Math.floor(s.dur * 0.6);
  await renderStill({serveUrl, composition: comp, frame, output: `out/review/${epFile}_${String(i).padStart(3, '0')}.png`, scale: 0.4, browserExecutable});
  console.log('ok', i, s.visual);
}
