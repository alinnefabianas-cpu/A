# "Why can a cat survive a fall from the 20th floor?" (versão videogame, em inglês, 16:9)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Curiosidade sobre gatos (em inglês) editada como um jogo em pixel art: HUD com vidas e pontos,
"+100" a cada palavra-chave, cartões de FASE, conquistas, um chefão (viés de
sobrevivência) e caixa de diálogo de RPG no lugar da legenda. Trilha chiptune e
efeitos 8-bit sintetizados do zero (sem direitos autorais). Azul continua sendo a cor da marca.

## Como usar
```bash
cd video-gatos-game
npm install
npm run audio                 # trilha chiptune + efeitos em public/audio
pip install edge-tts
python3 scripts/gerar-voz.py  # narração em inglês (voz grátis Andrew) + tempo exato de cada palavra
node scripts/medir-voz.mjs    # mede public/voz/NN.mp3
npm run studio                # editor no navegador
npm run render                # out/video.mp4 (1920x1080, 30fps)
```

## Onde mexer
| Arquivo | O que controla |
|---|---|
| `scripts/gerar-voz.py` | Gera a voz (padrão `en-US-AndrewMultilingualNeural`, +5%) e `src/palavras.json` com o tempo real de cada palavra: legenda e animações entram na palavra exata. |
| `src/roteiro.ts` | Texto de cada trecho (igual à narração), palavras-chave e o rótulo de fase do HUD. |
| `src/cenas.tsx` | As 12 cenas. Cada animação é presa a uma palavra com `em(b, 'palavra')`. |
| `src/sprites.ts` | Os desenhos em pixel (gato, gato "esquilo voador", humano, chefão, coração, moeda, troféu) e as paletas. |
| `src/componentes.tsx` | Sprite, texto pixel, HUD, caixa de diálogo, cartão de fase, conquista, barra, prédio, vento, CRT. |
| `scripts/gerar-audio.mjs` | Trilha chiptune e efeitos (moeda, fase, power-up, alarme, dano...). |

## Fontes do roteiro
Estudo de 1987 (Whitney & Mehlhaff, Animal Medical Center, Nova York): 132 gatos que caíram
de prédios, ~90% sobreviveram; ferimentos aumentavam até ~7 andares e depois diminuíam.
O vídeo explica o viés de sobrevivência (gatos que morriam não eram levados à clínica).
