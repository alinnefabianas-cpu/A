#!/usr/bin/env bash
# Copia os 13 Shorts exportados para public/longo/clipes (na ordem da contagem) e mede as durações.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/longo/clipes
i=1
for f in elevator-close-button-EN round-plane-windows-EN stop-sign-octagon-EN yellow-school-bus-EN pilots-same-meal-EN bluetooth-viking-king-EN statue-of-liberty-green-EN ketchup-medicine-EN napoleon-not-short-EN mona-lisa-stolen-EN dancing-plague-1518-EN marathon-1904-EN great-emu-war-EN; do
  cp "exportados/$f.mp4" "public/longo/clipes/$(printf %02d $i).mp4"; i=$((i+1))
done
python3 - <<'PY'
import json, subprocess, pathlib
r = pathlib.Path('public/longo')
d = lambda p: round(float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]).strip()),3)
out = {'voz': {p.stem: d(p) for p in sorted((r/'voz').glob('*.mp3'))}, 'clipes': {p.stem: d(p) for p in sorted((r/'clipes').glob('*.mp4'))}}
pathlib.Path('src/longo/duracoes.json').write_text(json.dumps(out, indent=1))
print('ok', sum(out['clipes'].values()))
PY
