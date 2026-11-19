#!/usr/bin/env bash
# Copia os 6 Shorts do vídeo longo 2 para public/longo2/clipes (na ordem da contagem) e mede as durações.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/longo2/clipes
i=1
for f in carrots-were-purple-EN eiffel-tower-grows-EN leaning-tower-pisa-EN bubble-wrap-wallpaper-EN sharks-older-than-trees-EN molasses-flood-EN; do
  cp "exportados/$f.mp4" "public/longo2/clipes/$(printf %02d $i).mp4"; i=$((i+1))
done
python3 - <<'PY'
import json, subprocess, pathlib
r = pathlib.Path('public/longo2')
d = lambda p: round(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]).strip()),3)
out = {'voz': {p.stem: d(p) for p in sorted((r/'voz').glob('*.mp3'))}, 'clipes': {p.stem: d(p) for p in sorted((r/'clipes').glob('*.mp4'))}}
pathlib.Path('src/longo/duracoes2.json').write_text(json.dumps(out, indent=1))
print('ok', sum(out['clipes'].values()))
PY
