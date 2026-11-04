# Reels "Intercâmbio linguístico em Vichy – 2027" (Remotion)

Vídeo 9:16 (1080x1920, 28s) para a Aliança Francesa de João Pessoa, feito em código.
Trilha sintetizada do zero (sem direitos autorais).

```bash
cd video-vichy
npm install
npm run audio    # gera public/audio/trilha.wav
npm run studio   # editor visual
npm run render   # exporta exportados/reels-intercambio-vichy-2027.mp4 (qualidade máxima)
```

- `src/Vichy.tsx`: cenas, textos, cores (`C`) e linha do tempo (`CENAS`).
- `scripts/gerar-trilha.mjs`: trilha (120 BPM); os cortes em `CORTES` devem bater com `CENAS`.
- `public/logos/`: logos recortadas dos arquivos enviados.
- Versão leve (commitada): `exportados/reels-intercambio-vichy-2027-leve.mp4`.
