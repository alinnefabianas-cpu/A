# Carrossel – la película · apresentação dos personagens

- Vídeo final: `exportados/carrossel-apresentacao-personagens.mp4` (1920x1080, 30 fps, 28 s, com o áudio original)
- Vídeo original: `public/onibus.mp4`
- Tempos e lado (esquerda/direita) de cada nome: lista `PERSONAGENS` em `src/Apresentacao.tsx`

Para gerar de novo: `npm install` e `npm run render`.

## Versão pausada
- `exportados/carrossel-apresentacao-pausada.mp4` (50 s): o vídeo congela 1,2 s em cada pessoa com o nome.
- Momentos de cada pausa: `MOMENTOS` em `src/Pausada.tsx`. Para gerar: `npx remotion render src/index.ts Pausada exportados/carrossel-apresentacao-pausada.mp4`
