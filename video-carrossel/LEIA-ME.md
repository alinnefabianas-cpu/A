# Carrossel – la película · apresentação dos personagens

- Vídeo final: `exportados/carrossel-apresentacao-personagens.mp4` (1920x1080, 30 fps, 28 s, com o áudio original)
- Vídeo original: `public/onibus.mp4`
- Tempos e lado (esquerda/direita) de cada nome: lista `PERSONAGENS` em `src/Apresentacao.tsx`

Para gerar de novo: `npm install` e `npm run render`.

## Versão pausada
- `exportados/carrossel-apresentacao-pausada.mp4` (50 s): o vídeo congela 1,2 s em cada pessoa com o nome.
- Momentos de cada pausa: `MOMENTOS` em `src/Pausada.tsx`. Para gerar: `npx remotion render src/index.ts Pausada exportados/carrossel-apresentacao-pausada.mp4`

## Edição "apaixonadas pelo galã"
- `exportados/apaixonadas-pelo-gala.mp4` (15 s), feita a partir de `public/apaixonadas.mp4` (IMG_9025 convertido para H.264).
- Zooms da câmera: `CAMERA` em `src/Apaixonadas.tsx`; sons sintetizados em `public/sons/`.
- Para gerar: `npx remotion render src/index.ts Apaixonadas exportados/apaixonadas-pelo-gala.mp4`

## Créditos finais
- `exportados/creditos-carrossel-la-pelicula.mp4` (88 s), estilo cinema: título, os 9 vídeos da pasta do Drive em `public/creditos2/` (com o áudio original, nivelado) e os nomes subindo à direita, depois "Fim".
- Nomes e ordem dos vídeos: `ELENCO`, `EQUIPE` e `CLIPES` em `src/Creditos.tsx`.
- Para gerar: `npx remotion render src/index.ts Creditos exportados/creditos-carrossel-la-pelicula.mp4`
