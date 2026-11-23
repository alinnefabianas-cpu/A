# "12 Cat Myths You Still Believe" (estilo caderno, em inglês, 10:08)

> Padrão do canal de gatos: **todos os vídeos em inglês** (narração, legenda e textos na tela).

Mesmo motor dos vídeos longos (cenas a partir de dados em `src/visuais.ts`), com cabeçalho "Myth #N".
Desenhos novos em `src/desenhos.tsx`: carimbo "MYTH", etiqueta "TRUTH", leite, lata de atum, balança,
caixa de areia com luvas, banheira, torneira pingando, varinha, arranhador e lírio.

```bash
npm install && npm run audio
pip install edge-tts
python3 scripts/gerar-voz.py en-US-AndrewMultilingualNeural -10%
node scripts/medir-voz.mjs
npm run render   # ~35 min; comprima para < 100 MB antes de salvar no GitHub
```
Dica: se algum trecho da voz vier cortado, apague a chave dele em `src/palavras.json` e o mp3, e rode `gerar-voz.py` de novo (só refaz o que falta).
