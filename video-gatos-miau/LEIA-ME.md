# "Cats only meow at humans" (estilo caderno rabiscado, em inglês, 16:9)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Visual de caderno: papel pautado com margem e espiral, desenhos à caneta azul que "tremem"
(filtro de deslocamento que muda a cada 4 frames, como animação feita à mão), traços que se
desenham sozinhos, marca-texto amarelo, post-its, setas e círculos à mão. Fontes Caveat e Patrick Hand.
Trilha lo-fi + sons de caneta riscando e página virando, tudo sintetizado.

## Como usar
```bash
cd video-gatos-miau
npm install
npm run audio
pip install edge-tts
python3 scripts/gerar-voz.py   # narração (voz grátis Andrew) + tempo de cada palavra; retoma se falhar
node scripts/medir-voz.mjs
npm run render                 # out/video.mp4
```
`src/roteiro.ts` = texto · `src/cenas.tsx` = cenas · `src/componentes.tsx` = papel, traço, gato e pessoa rabiscados, post-it, balão, legenda.
O que vai para o YouTube está em `exportados/`.
