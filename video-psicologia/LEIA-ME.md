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
npx remotion render src/index.ts Short out/short.mp4          # Short 9:16 (~46s)
npx remotion still src/index.ts Thumbnail out/thumbnail.png   # thumbnail 1280x720

# Episódio 2 — "Como reconhecer um narcisista em 5 minutos"
npx remotion render src/index.ts Narcisista out/narcisista.mp4
npx remotion still src/index.ts ThumbNarcisista out/thumbnail-narcisista.png
```

## Onde mexer

| Arquivo | O que controla |
|---|---|
| `src/roteiro.ts` | **Todo o roteiro.** Cada bloco tem o texto, as palavras em vermelho (`destaque`), a animação de fundo (`visual`), os efeitos sonoros (`sons`) e o estilo. A duração é calculada pelo número de palavras; para forçar, use `duracao` (em frames, 30 = 1s). |
| `src/visuais/Visuais.tsx` | As 27 animações (olho, marionete, caça-níquel, lampião, espelho quebrado, triângulo, porta, escada, cérebro…). |
| `src/componentes.tsx` | Texto cinético, cartões "TÁTICA Nº", citação, recapitulação, final/CTA, grão, vinheta, poeira, flicker. |
| `src/Video.tsx` | Montagem: câmera (zoom lento, tremor em impactos, flash), mixagem e volume da trilha (silêncio dramático). |
| `ROTEIRO_SHORT` em `src/roteiro.ts` | Roteiro do Short (3 táticas, ritmo 20% mais rápido). |
| `src/Thumbnail.tsx` | Thumbnail "ELE SABE O QUE FAZ". |
| `src/episodios/narcisista.ts` | Roteiro e configuração (rótulo "SINAL", título, nomes) do episódio 2. Copie este arquivo para criar novos episódios. |
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

## Narração (episódio 2)
A narração foi gerada no Higgsfield com a voz **"Leo" no motor MiniMax** (português do Brasil sem sotaque; a "Andre" do ElevenLabs soou com sotaque), uma fala por bloco do roteiro,
salva em `public/voz-narcisista/NN.mp3` (NN = índice do bloco em `ROTEIRO_NARCISISTA`).

1. `npx tsx scripts/falas.ts` lista o texto de cada fala (o que deve ser gravado/gerado em cada arquivo).
2. `python3 scripts/medir-voz.py narcisista` mede cada MP3 (duração e pausas) e grava `src/episodios/narcisista-voz.json`.
3. O vídeo se ajusta sozinho: cada cena dura o tempo da fala, cada frase da legenda entra quando é dita
   (os trechos entre pausas são casados com os trechos entre pontuações), a recapitulação acende cada sinal
   no momento em que é falado, e a trilha/efeitos abaixam para a voz.

Para regravar uma frase, substitua só aquele `NN.mp3` e rode o passo 2 de novo.

## Reels de divulgação — "Editora de vídeo" (9:16, 28,5s)
Arquivo pronto: `exportados/reels-editora-de-video.mp4`.

Estrutura: gancho ("Seu vídeo tem 3 segundos") → antes/depois → montagem com 7 cortes do portfólio
no beat (texto cinético, motion design, legenda sincronizada, sound design…) → flashes rápidos → serviços → CTA.

```bash
npm run audio -- 30                    # efeitos sonoros (public/audio)
node scripts/gerar-trilha-reels.mjs    # trilha 120 BPM sincronizada com os cortes
npx remotion render src/index.ts ReelsEditora out/reels.mp4
```

- `src/reels/Reels.tsx` → `PERFIL`: profissão, @ do Instagram (vazio = não aparece), texto do botão e lista de serviços.
- `public/reels/*.mp4`: trechos do portfólio (cortados dos vídeos exportados com ffmpeg). Troque por outros trabalhos mantendo os nomes.

## Reels 2 — "Você grava. Eu cuido do resto." (9:16, 29,5s)
Arquivo pronto: `exportados/reels-servicos.mp4`.

Gancho com "REC" → 5 passos (cortes, legendas, motion, trilha e efeitos, thumbnail), cada um com um trecho
do portfólio e uma linha do tempo de editor que ganha uma faixa por passo → "Edição para: criadores, marcas… você." → CTA "Agenda aberta".

```bash
node scripts/gerar-trilha-reels2.mjs   # trilha 120 BPM em Ré menor
npx remotion render src/index.ts ReelsServicos out/reels-servicos.mp4
```

Textos dos passos e do público: `PASSOS` e `PUBLICO` em `src/reels/Reels2.tsx`. Clipes e thumbnails em `public/reels2/`.
