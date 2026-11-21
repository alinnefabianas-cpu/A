# "The Secret History of Cats" (estilo caderno, em inglês, 10:56)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Mesmo motor dos vídeos longos (cenas montadas a partir de dados em `src/visuais.ts`).
Novidades: desenhos de história em `src/desenhos.tsx` (linha do tempo, mapa com rota, pirâmide, múmia, Bastet,
trigo, barco e barco viking, maneki-neko, ilha, foguete, porta nº 10, roseta, chapéu de bruxa, pergaminho, túmulo),
pelagens do gato (selvagem listrado, siamês, preto) e alinhamento da voz **letra por letra** (resolve trechos como "In 2007").

```bash
npm install && npm run audio
pip install edge-tts
python3 scripts/gerar-voz.py en-US-AndrewMultilingualNeural -12%
node scripts/medir-voz.mjs
npm run render   # ~35 min; comprima para < 100 MB antes de salvar no GitHub
```
