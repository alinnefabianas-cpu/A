# "How Cats See, Hear & Smell the World" (estilo caderno, em inglês, 10:07)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Mesmo motor do `video-gatos-linguagem` (cenas montadas a partir de dados), com desenhos novos em
`src/desenhos.tsx`: olho com tapetum que brilha, faixas de cor (você x gato), nítido x embaçado, campo de visão,
barras comparativas, ondas de ultrassom, nariz, almofadinhas (com suor), cerca, tigelas, fonte, fresta, aspirador,
laranja, jornal, sofá arranhado e folhas. O gato ganhou a "cara de flehmen".

```bash
npm install && npm run audio
pip install edge-tts
python3 scripts/gerar-voz.py en-US-AndrewMultilingualNeural -10%
node scripts/medir-voz.mjs
npm run render   # ~30 min; comprima para < 100 MB antes de salvar no GitHub
```
