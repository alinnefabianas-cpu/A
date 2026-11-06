# Reels "Intercâmbio linguístico em Vichy – 2027" (Remotion)

Vídeo 9:16 (1080x1920, 33s) para a Aliança Francesa de João Pessoa, feito em código.
Trilha sintetizada do zero (sem direitos autorais).

```bash
cd video-vichy
npm install
npm run audio    # gera public/audio/efeitos.wav
npm run studio   # editor visual
npm run render   # exporta exportados/reels-intercambio-vichy-2027.mp4 (qualidade máxima)
```

- `src/Vichy.tsx`: cenas, textos, cores (`C`) e linha do tempo (`CENAS`).
- `public/audio/musica.mp3`: trilha instrumental (ElevenLabs Music v2.5 via Higgsfield), cortada em 33s com fade.
- `scripts/gerar-efeitos.mjs`: whoosh + ding das transições; `CORTES` devem bater com `CENAS`.
- `public/voz/0N.mp3`: narração (voz "Leo", MiniMax, PT-BR), uma fala por cena.
- `public/logos/`: logos recortadas dos arquivos enviados.
- Versão leve (commitada): `exportados/reels-intercambio-vichy-2027-leve.mp4`.
