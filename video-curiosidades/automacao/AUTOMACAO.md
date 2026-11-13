# Automação diária: 3 Shorts por dia no YouTube

Este é o manual que a tarefa agendada segue todo dia. Ela roda numa sessão nova do Claude Code
(sem memória das anteriores), então tudo o que é preciso saber está aqui.

**Decisão da dona do canal:** publicar **sozinho e público**, às **12:00, 17:00 e 21:00 (America/Sao_Paulo, UTC−03:00)**.
Como não há revisão humana, o controle de qualidade abaixo é obrigatório: na dúvida, **não publique** aquele vídeo.

## 0. Preparar o ambiente
```bash
cd <raiz do repositório>
git fetch origin claude/upbeat-ramanujan-vz6qmr
git checkout -B claude/upbeat-ramanujan-vz6qmr origin/claude/upbeat-ramanujan-vz6qmr
cd video-curiosidades
npm install --no-audit --no-fund
ls public/audio/trilha.wav || node scripts/gerar-trilha.mjs
```
Antes de criar qualquer coisa, leia como foram feitos os episódios prontos, que são o padrão de qualidade:
`src/Video.tsx` (pilotos), `src/elevador/Elevador.tsx` e `src/elevador/cenarios.tsx` (elevador),
`src/Personagem.tsx`, `src/Cenarios.tsx`, `src/Episodio.tsx` e `src/episodios/_modelo/Episodio.tsx`.

## 1. Escolher os 3 temas
- Abra `automacao/temas.md` e pegue os 3 primeiros itens com `[ ]`.
- Para cada um, confirme o fato com WebSearch em pelo menos 2 fontes confiáveis (enciclopédias, museus,
  órgãos oficiais, imprensa séria). Se não confirmar, marque `[!] não verificado` e pegue o próximo.
- Se sobrarem menos de 9 temas livres, pesquise e acrescente 15 novos no fim do arquivo, no mesmo formato
  e respeitando as regras do topo do arquivo.
- Defina um `slug` curto em kebab-case (ex.: `round-plane-windows`) e um `Id` de composição em PascalCase
  sem hífens (ex.: `RoundPlaneWindows`).

## 2. Roteiro (inglês)
- 9 a 11 falas, uma por cena; 110 a 140 palavras no total (45–55 s; **o vídeo final precisa ter menos de 60 s**).
- Fala 0 = gancho em forma de pergunta ou afirmação surpreendente (o tema inteiro em uma frase).
- Contar como história curta com personagens (alguém passando pela situação), depois a explicação,
  uma virada/curiosidade extra e um fecho forte. Tom leve e coloquial, frases curtas.
- Só afirmar o que foi verificado; quando algo for "muitas vezes" ou "em muitos lugares", diga isso.
- Sem nomes de marcas, sem pessoas vivas, sem números inventados.

## 3. Narração (Higgsfield)
- `mcp__Higgsfield__generate_audio_batch`, **no máximo 5 falas por chamada** (acima disso dá erro 429), cada item:
  `{"model": "text2speech_v2", "variant": "elevenlabs", "voice_type": "preset", "voice_id": "c2acff45-84b2-4974-892d-89fa2d4e5598", "prompt": "<fala>"}` (voz "Brooks").
- Espere com `mcp__Higgsfield__jobs_wait`; se algum item falhar por limite, reenvie só ele.
- Baixe cada `result_url` para `public/voz-<slug>/NN.mp3` (00, 01, …, na ordem das falas).

## 4. Cenas (Remotion)
```bash
cp -r src/episodios/_modelo src/episodios/<slug>
python3 scripts/medir-voz.py <slug>     # grava src/episodios/<slug>/voz.json
```
Edite `src/episodios/<slug>/Episodio.tsx`: `FALAS`, `id`, `pastaVoz: 'voz-<slug>'`, `destaques` e **um componente por fala**.
Depois adicione o episódio em `src/episodios/registro.ts` (import + item na lista).

Padrão visual obrigatório (o mesmo dos episódios prontos):
- 1080x1920. Toda cena tem movimento de câmera (`Camera` com `de`/`para`, `soco` nos impactos, `tremor` em sustos).
- Bonecos com `Personagem` (roupas: comandante, copiloto, comissaria, passageiro, executivo, bombeiro;
  dá para criar roupas novas no mesmo arquivo). Cenários ricos com gradiente, luz e profundidade, desenhados em SVG.
- Cada ação acontece na palavra certa da fala: `m('word')` ou `m('word', 2)` para a 2ª ocorrência
  (as palavras são comparadas só pelas letras e números, em minúsculas: "doesn't" vira `doesnt`).
- Um corte ou mudança visual forte a cada 2–3 s; objetos entram com `usePop`; placas curtas em caixa alta ("NO!", "PASSED").
- Efeitos sonoros com `Sfx`: pop, whoosh, ding, buzz, boom, uhoh, barriga, alarme, aviao (em `public/audio/`).
- A legenda fica em y≈1250–1400: não coloque texto importante nessa faixa.
- A câmera nunca pode mostrar além da arte (faixa preta): com zoom z e foco (x, y), garanta y + 960/z ≤ 1920 e y − 960/z ≥ 0.
- Nada de logotipos, marcas, rostos de pessoas reais ou emojis (a fonte não tem os glifos).

## 5. Controle de qualidade (obrigatório)
```bash
npx tsc -p .
npx remotion bundle src/index.ts --out-dir out/bundle
# 10 a 14 quadros espalhados pelo vídeo, um pouco depois do início de cada cena:
npx remotion still out/bundle <Id> out/qc/<slug>-<frame>.jpeg --frame=<frame> --scale=0.4 --image-format=jpeg
```
Junte os quadros numa folha (`ffmpeg ... hstack`) e **olhe a imagem**. Corrija e repita até não haver:
faixa preta, personagem cortado ou fora da tela, objetos sobrepostos de forma estranha, texto ilegível,
cena vazia, legenda tapada, erro de digitação.

Render final:
```bash
npx remotion render src/index.ts <Id> exportados/auto/<AAAA-MM-DD>-<slug>.mp4 --crf=22 --log=error
ffprobe -v error -show_entries format=duration -of csv=p=0 exportados/auto/<arquivo>.mp4   # 20 < duração < 59.5
```
Confira também que o arquivo tem áudio (`ffprobe -show_streams` com `codec_type=audio`).
Se um vídeo não passar depois de 2 tentativas de correção, **não publique**: registre o motivo e siga com os outros.

## 6. Hospedar o vídeo (link público)
1. `mcp__Higgsfield__media_upload` com `filename: "<slug>.mp4"`, `content_type: "video/mp4"`.
2. `curl -sS -o /dev/null -w "%{http_code}" -X PUT -H "Content-Type: video/mp4" --data-binary @<arquivo> '<upload_url>'` → precisa dar 200.
3. `mcp__Higgsfield__media_confirm` com `type: "video"` e o `media_id`.
4. `curl -s -o /dev/null -w "%{http_code} %{content_type}" '<url>'` → precisa dar `200 video/mp4`.

## 7. Agendar no YouTube (Metricool)
`mcp__Metricool_Social_Media_Management__createScheduledPost` com `blogId: "7807907"` e
`date` = hoje às 12:00, 17:00 e 21:00 com `-03:00` (1º, 2º e 3º vídeo). Se um horário já passou, use o mesmo horário de amanhã.
`info` (JSON em texto):
```json
{
  "autoPublish": true,
  "draft": false,
  "text": "<descrição: 2–3 frases que contam o gancho sem entregar tudo + pergunta para comentários + 3–5 hashtags, sempre com #shorts>",
  "firstCommentText": "",
  "media": ["<url do Higgsfield>"],
  "mediaAltText": [],
  "descendants": [],
  "hasNotReadNotes": false,
  "shortener": false,
  "smartLinkData": {"ids": []},
  "providers": [{"network": "youtube"}],
  "publicationDate": {"dateTime": "AAAA-MM-DDTHH:00:00", "timezone": "America/Sao_Paulo"},
  "youtubeData": {
    "title": "<título até 60 caracteres, padrão 'Why …' / 'The … That …', uma palavra em CAIXA ALTA no máximo>",
    "type": "short",
    "privacy": "public",
    "tags": ["<8 a 15 tags em inglês>"],
    "category": "EDUCATION",
    "madeForKids": false,
    "isAiGeneratedContent": false
  }
}
```
(`isAiGeneratedContent` fica `false` porque é animação em desenho, não conteúdo realista; a narração é uma voz sintética
contando fatos. Se algum dia o vídeo tiver imagens realistas geradas por IA, mude para `true`.)

Guarde o `plannerUrl` da resposta. Se o Metricool der erro, não tente outra forma de publicar: registre o erro.

## 8. Registrar e salvar
- `automacao/temas.md`: marque `[x] AAAA-MM-DD · <slug> · <título>`.
- `automacao/postados.md`: uma linha por vídeo (data, horário, slug, título, link do Higgsfield, plannerUrl ou o erro).
- Commit (o código das cenas e os MP3 da voz; os MP4 ficam fora do git pelo `.gitignore`) e push para
  `claude/upbeat-ramanujan-vz6qmr`, a branch desta automação.

## 9. Resumo final
Termine com um resumo curto em português: os 3 títulos, horários agendados, links do Metricool,
e qualquer tema pulado ou vídeo não publicado (com o motivo).
