# "How to Read Your Cat: The Complete Body Language Guide" (estilo caderno, em inglês, 10:14)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Vídeo longo (67 trechos, 9 capítulos). As cenas são **montadas a partir de dados**:
- `src/roteiro.ts` — texto de cada trecho + capítulo.
- `src/visuais.ts` — o que aparece em cada trecho: gato (pose, rabo, orelhas, olhos, bigodes, boca), anotações, post-its e extras, cada um preso a uma palavra da narração.
- `src/gato.tsx` — o gato rabiscado com todos os sinais (9 rabos, 4 orelhas, pupilas, piscada lenta, pelo eriçado) e posturas (pão, barriga, Halloween, agachado, rebolando, dormindo) + mão.
- `src/cenas.tsx` — renderizador genérico.

```bash
npm install && npm run audio
pip install edge-tts
python3 scripts/gerar-voz.py en-US-AndrewMultilingualNeural -4%   # retoma de onde parou
node scripts/medir-voz.mjs
npm run render   # ~30 min; depois comprima para < 100 MB antes de salvar no GitHub
```
