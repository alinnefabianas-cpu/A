# "Por que os gatos dormem tanto?" (Remotion, 16:9)

Vídeo de curiosidades sobre gatos no estilo "editado em código": fundo azul-noite,
destaque azul neon, gato-palito como personagem, **cada frase com um objeto que se mexe**
e legenda palavra por palavra. Trilha lo-fi e efeitos são sintetizados do zero
(sem samples, sem direitos autorais).

## Como usar

```bash
cd video-gatos
npm install
npm run audio                 # gera trilha lo-fi + pop + whoosh em public/audio
node scripts/medir-voz.mjs    # mede os MP3 da narração (veja abaixo)
npm run studio                # abre o editor no navegador
npm run render                # exporta out/video.mp4 (1920x1080, 30fps)
```

## Narração
A narração foi gerada no Higgsfield (voz "Andre", ElevenLabs), em 12 trechos, um por cena.
1. Baixe os 12 áudios da sua biblioteca do Higgsfield, na ordem do roteiro.
2. Salve como `public/voz/00.mp3`, `01.mp3` … `11.mp3`.
3. Rode `node scripts/medir-voz.mjs`. Isso grava `src/duracoes.json`, e o vídeo inteiro
   (cenas, legenda e animações) se ajusta ao tempo real da fala. A trilha abaixa sozinha.
4. `npm run render`.

Sem os MP3, o vídeo usa um tempo estimado (~2,6 palavras/s) e sai sem voz.
Se preferir gravar a sua própria voz, faça o mesmo: um arquivo por trecho, com o texto de `src/roteiro.ts`.

## Onde mexer
| Arquivo | O que controla |
|---|---|
| `src/roteiro.ts` | Texto de cada trecho, palavras em azul (`destaque`) e qual cena usa. |
| `src/cenas.tsx` | As 12 cenas. Cada animação é presa a uma palavra com `em(b, 'palavra')`: quando a palavra é dita, o objeto entra. |
| `src/componentes.tsx` | Gato-palito (poses: em-pe, andando, correndo, agachado, deitado, barriga), legenda, texto grande, rótulo com seta, bateria, rato, pássaro, ícones. |
| `src/tema.ts` | Cores do canal (azul) e fontes. |
| `scripts/gerar-audio.mjs` | Trilha lo-fi e efeitos. |

## Regras do canal (vão crescendo a cada vídeo aprovado/rejeitado)
- Fundo azul-noite `#050a18`, destaque único azul `#3da5ff`. Vermelho só para alerta/erro.
- Toda frase tem um objeto que se mexe. Nada de tela parada.
- Animação entra no segundo exato da palavra-chave.
- Personagem fixo: gato-palito com olhos azuis brilhando.
- Gancho com número forte nos primeiros 5s, e o gancho volta no final.
- Termina com pergunta para os comentários.
