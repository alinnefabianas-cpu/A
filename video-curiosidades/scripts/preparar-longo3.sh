#!/usr/bin/env bash
# Copia os 6 Shorts do vídeo longo 3 para public/longo3/clipes (na ordem da contagem) e mede as durações.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/longo3/clipes
i=1
for f in jeans-tiny-pocket-EN pen-cap-hole-EN golf-ball-dimples-EN flamingos-not-born-pink-EN fingers-wrinkle-water-EN honey-never-spoils-EN; do
  cp "exportados/$f.mp4" "public/longo3/clipes/$(printf %02d $i).mp4"; i=$((i+1))
done
python3 - <<'PY'
import json, subprocess, pathlib
r = pathlib.Path('public/longo3')
d = lambda p: round(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]).strip()),3)
out = {'voz': {p.stem: d(p) for p in sorted((r/'voz').glob('*.mp3'))}, 'clipes': {p.stem: d(p) for p in sorted((r/'clipes').glob('*.mp4'))}}
pathlib.Path('src/longo/duracoes3.json').write_text(json.dumps(out, indent=1))
print('ok', sum(out['clipes'].values()))
PY
