# Trailer cinematográfico — Banda Racional (9:16)

Trailer vertical de 1:59,5 para Instagram e Facebook (1080×1920, 30 fps, H.264 + AAC, −14 LUFS).

O arquivo `Banda_Racional_Trailer_9x16.mp4` (46 MB, versão para redes sociais) está nesta pasta. Os scripts geram o vídeo a partir das filmagens originais da pasta do Google Drive.

## Estrutura do trailer

| Tempo | Momento | O que acontece |
| --- | --- | --- |
| 0:00–0:02 | Gancho | Silêncio, impacto grave e clarão revelando o bumbo "BANDA RACIONAL" em câmera lenta |
| 0:02–0:16 | Mistério | Detalhes em câmera lenta (sax, pratos, bandeiras, fita, rostos) com cor escura e fria; pulsos graves e o tema da banda em versão lenta e distante |
| 0:16–0:27 | Revelação | Imagens de drone mostram o tamanho da banda; a música real entra abafada e vai abrindo |
| 0:27 | Título 1 | **BANDA RACIONAL / UNIVERSO EM DESENCANTO** em letras douradas 3D que sobem atrás das bandeiras e dos mastros (mapa de profundidade + rastreamento de câmera) |
| 0:33–1:11 | Energia | Cortes nas cabeças de compasso da música (~117 BPM), alternando aéreas e closes, com ostinato sincronizado ao andamento da banda |
| 1:11 | Título 2 | **CULTURA RACIONAL / DO BRASIL / PARA O MUNDO** em tomada aérea diante da igreja; as fileiras da banda passam na frente das letras |
| 1:17–1:34 | Apoteose | Montagem intensa: drone, bandeiras em câmera lenta, tambores, fitas |
| 1:34–1:40 | Respiro | A música abafa, câmera lenta, silêncio de meio segundo |
| 1:40 | Impacto final | Retorno do tema da banda + impacto; o drone sobe e revela a igreja e a cidade |
| 1:46–1:59 | Logotipo | Emblema oficial em 3D (espessura, luz varrendo, raios, partículas, reflexo), golpe final sincronizado ao último acorde da banda e **www.bandaracional.com.br** |

## Trilha

- Base: a gravação **"4º Encontro"** da própria banda, que continua reconhecível do 0:12 até o fim, inclusive o final original.
- Camada cinematográfica (graves, impactos, "braams", risers, pads, ostinato, sinos) **sintetizada do zero** em `scripts/audio.py`. Não usa samples nem músicas de terceiros, então não há licença a pagar para anúncios.

## Como gerar

Requisitos: Python 3, ffmpeg, `numpy scipy librosa soundfile opencv-contrib-python-headless pillow torch transformers`.

1. Baixe as filmagens do Drive em `/tmp/claude-0/br/raw/` e as fontes Cinzel e Montserrat (Google Fonts, OFL) em `/tmp/claude-0/br/fonts/`.
2. `python3 scripts/audio.py`: gera `audio_premix.wav`.
3. `python3 scripts/build.py`: renderiza os planos, concatena e mixa (normalização em 2 passos para −14 LUFS / −1 dBTP).

O roteiro de cortes (fonte, tempo, velocidade, enquadramento, efeitos) fica na lista `SHOTS` em `scripts/render.py`.
