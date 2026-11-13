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
npm run voz      # mede public/voz/NN.mp3 e grava src/voz.json (tempo de cada fala)
npm run studio   # editor visual
npm run render   # exporta exportados/pilotos-comida.mp4
```

## Onde mexer
| Arquivo | O que controla |
|---|---|
| `src/roteiro.ts` | Texto das falas e palavras em amarelo. A duração de cada cena vem da fala. |
| `src/Video.tsx` | As 10 cenas (câmera, poses, objetos, efeitos sonoros) e a mixagem. |
| `src/Personagem.tsx` | O boneco: roupas (comandante, copiloto, comissária, passageiro), expressões, braços. |
| `src/Cenarios.tsx` | Cockpit, céu noturno com avião, cabine, cozinha e objetos (frango, peixe, amendoim, relógio, balão). |
| `src/Legenda.tsx` | Legenda palavra por palavra. |

## Narração
Voz **"Leo" (MiniMax) no Higgsfield**, uma fala por cena em `public/voz/NN.mp3`.
Para trocar o texto: gere de novo o MP3 da fala, rode `npm run voz` e renderize.
A legenda distribui as palavras só pelos trechos com voz (pula as pausas), então fica sincronizada sozinha.

## Para fazer o próximo episódio
Copie a pasta, troque `FALAS` em `src/roteiro.ts`, gere as falas e reescreva as cenas em `src/Video.tsx`
reaproveitando `Personagem` e os cenários.
