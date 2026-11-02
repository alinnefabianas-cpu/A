# Vídeo "7 Táticas de Manipulação" (Remotion)

Vídeo de canal dark de psicologia feito 100% em código: motion graphics em SVG,
texto cinético, grão de filme, e trilha e efeitos sonoros sintetizados do zero
(sem imagens ou áudios de terceiros, ou seja, sem problema de direitos autorais).

## Como usar

```bash
cd video-psicologia
npm install
npm run audio -- 390      # gera trilha (segundos) + efeitos em public/audio
npm run studio            # abre o editor visual do Remotion no navegador
npm run render            # exporta out/video.mp4 (1080p, 30fps)
```

## Onde mexer

| Arquivo | O que controla |
|---|---|
| `src/roteiro.ts` | **Todo o roteiro.** Cada bloco tem o texto, as palavras em vermelho (`destaque`), a animação de fundo (`visual`), os efeitos sonoros (`sons`) e o estilo. A duração é calculada pelo número de palavras; para forçar, use `duracao` (em frames, 30 = 1s). |
| `src/visuais/Visuais.tsx` | As 27 animações (olho, marionete, caça-níquel, lampião, espelho quebrado, triângulo, porta, escada, cérebro…). |
| `src/componentes.tsx` | Texto cinético, cartões "TÁTICA Nº", citação, recapitulação, final/CTA, grão, vinheta, poeira, flicker. |
| `src/Video.tsx` | Montagem: câmera (zoom lento, tremor em impactos, flash), mixagem e volume da trilha (silêncio dramático). |
| `src/tema.ts` | Cores e fontes. |
| `scripts/gerar-audio.mjs` | Sintetizador da trilha (Lá menor, drone + piano) e dos efeitos (boom, hit, riser, whoosh, coração, relógio…). |

### Estilos de texto
- `normal`: legenda na parte de baixo, palavra por palavra.
- `grande`: frase de impacto no centro em Cinzel, com o fundo desfocado.
- `fala`: "vozes" do manipulador, em itálico com tremor RGB.
- `defesa`: tarja vermelha "COMO SE DEFENDER".

## Adicionar narração
1. Grave ou gere a narração e salve como `public/narracao.mp3`.
2. Em `src/Video.tsx`, adicione `<Audio src={staticFile('narracao.mp3')} />` junto da trilha.
3. Ajuste a `duracao` de cada bloco em `roteiro.ts` para casar com a fala (o Studio mostra a linha do tempo).
4. Baixe o volume da trilha em `volumeTrilha` (de 0.32 para ~0.15) para não brigar com a voz.

## Revisão rápida
`node scripts/folha-contato.mjs 100 500 900` renderiza quadros soltos em `out/contato/`.
