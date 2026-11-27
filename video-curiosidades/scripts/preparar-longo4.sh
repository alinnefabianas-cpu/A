#!/usr/bin/env bash
# Copia os 6 Shorts do vídeo longo 4 para public/longo4/clipes e mede as durações.
# "cortes" = duração do clipe SEM a última fala (o CTA "comment one word"), para o longo ter um CTA só no final.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/longo4/clipes
python3 - <<'PY'
import json, subprocess, pathlib, shutil
ordem = [  # (arquivo exportado, pasta do episódio, tem CTA no fim?)
  ('lost-in-sahara-9-days-EN', 'mauro-prosperi', True),
  ('133-days-alone-at-sea-EN', 'poon-lim', True),
  ('frozen-13-7-degrees-EN', 'anna-bagenholm', True),
  ('miss-unsinkable-EN', 'violet-jessop', False),
  ('struck-by-lightning-7-times-EN', 'roy-sullivan', True),
  ('fell-2-miles-survived-EN', 'juliane-koepcke', True),
]
r = pathlib.Path('public/longo4')
d = lambda p: round(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]).strip()),3)
clipes, cortes = {}, {}
for i, (arq, slug, cta) in enumerate(ordem, 1):
    k = f'{i:02d}'
    shutil.copy(f'exportados/{arq}.mp4', r/'clipes'/f'{k}.mp4')
    clipes[k] = d(r/'clipes'/f'{k}.mp4')
    voz = json.load(open(f'src/episodios/{slug}/voz.json'))
    durs = [voz[x]['dur'] for x in sorted(voz, key=int)]
    cortes[k] = round(sum(durs[:-1]) + 0.4, 3) if cta else clipes[k]
out = {'voz': {p.stem: d(p) for p in sorted((r/'voz').glob('*.mp3'))}, 'clipes': clipes, 'cortes': cortes}
pathlib.Path('src/longo/duracoes4.json').write_text(json.dumps(out, indent=1))
print('ok', sum(cortes.values()))
PY
