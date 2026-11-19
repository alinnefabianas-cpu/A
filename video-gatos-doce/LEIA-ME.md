# "Your cat has never tasted sugar" (versão videogame, em inglês, 16:9)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Mesmo motor do `video-gatos-game` (pixel art, HUD com vidas e pontos, fases, chefão, caixa de diálogo de RPG,
chiptune sintetizado). Tema: gatos não sentem gosto doce (gene Tas1r2 quebrado), umami, papilas, sorvete e lactose.

## Como usar
```bash
cd video-gatos-doce
npm install
npm run audio                 # trilha chiptune + efeitos
pip install edge-tts
python3 scripts/gerar-voz.py  # narração (voz grátis Andrew) + tempo exato de cada palavra; retoma se falhar
node scripts/medir-voz.mjs
npm run render                # out/video.mp4
```
`src/roteiro.ts` = texto, `src/cenas.tsx` = as 12 cenas, `src/sprites.ts` = desenhos em pixel.
O que vai para o YouTube está em `exportados/` (vídeo, 2 thumbnails, legenda .srt e SEO).
