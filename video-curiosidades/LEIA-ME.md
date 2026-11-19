# Short "Por que pilotos não comem a mesma comida?" (Remotion)

Short vertical (1080x1920, 51s) no formato dos canais de curiosidades animadas:
narração contando uma história, bonecos cartunescos de cabeça redonda, cenários com
luz e profundidade, cortes a cada 2–3s, zoom de câmera e **legenda de uma palavra por vez**
(branca com contorno preto, palavras-chave em amarelo).

Os personagens, cenários, trilha e efeitos são originais, feitos em código (SVG + síntese de áudio):
sem material de terceiros.

## Comandos
```bash
npm install
npm run audio    # sintetiza a trilha e os efeitos em public/audio
npm run voz -- pt   # mede public/voz/NN.mp3 e grava src/voz.json (tempo de cada fala)
npm run voz -- en   # idem para public/voz-en -> src/voz-en.json
npm run studio      # editor visual
npm run render      # versão PT: exportados/pilotos-comida.mp4
npm run render:en   # versão EN: exportados/pilots-same-meal-EN.mp4
```

## Onde mexer
| Arquivo | O que controla |
|---|---|
| `src/roteiro.ts` | Falas em PT e EN, palavras em amarelo, textos desenhados (NÃO!/NO!…) e `MARCAS`: a palavra da fala em que cada ação da cena acontece. A duração de cada cena vem da fala. |
| `src/Video.tsx` | As 10 cenas (câmera, poses, objetos, efeitos sonoros) e a mixagem. |
| `src/Personagem.tsx` | O boneco: roupas (comandante, copiloto, comissária, passageiro), expressões, braços. |
| `src/Cenarios.tsx` | Cockpit, céu noturno com avião, cabine, cozinha e objetos (frango, peixe, amendoim, relógio, balão). |
| `src/Legenda.tsx` | Legenda palavra por palavra. |

## Narração
- PT: voz **"Leo" (MiniMax)** no Higgsfield, em `public/voz/NN.mp3`.
- EN: voz **"Brooks" (ElevenLabs)** no Higgsfield, em `public/voz-en/NN.mp3`.

Uma fala por cena.
Para trocar o texto: gere de novo o MP3 da fala, rode `npm run voz -- <pt|en>` e renderize. Se mudar uma palavra usada em `MARCAS`, ajuste a marca também (o render avisa se ela sumir).
A legenda distribui as palavras só pelos trechos com voz (pula as pausas), então fica sincronizada sozinha.

## Para fazer o próximo episódio
Copie a pasta, troque `FALAS` em `src/roteiro.ts`, gere as falas e reescreva as cenas em `src/Video.tsx`
reaproveitando `Personagem` e os cenários.

## Episódio 2 (EN): "The Elevator Button That Does NOTHING"
- Composição `Elevador`: `npm run render:elevador` -> `exportados/elevator-close-button-EN.mp4` (50s).
- Roteiro e cenas: `src/elevador/Elevador.tsx`; cenários (interior do elevador, painel, lei de 1990, faixa de pedestre): `src/elevador/cenarios.tsx`.
- Voz "Brooks" (ElevenLabs) em `public/voz-elevador/NN.mp3`; medir com `npm run voz -- elevador`.
- Novas roupas do boneco: `executivo` e `bombeiro`.
- As ações de cada cena são presas a palavras da fala com `m('palavra')`.
