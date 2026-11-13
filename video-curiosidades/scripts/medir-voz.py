#!/usr/bin/env python3
"""Mede cada fala em public/voz/NN.mp3 (duração e trechos com voz entre pausas)
e grava src/voz.json. O vídeo usa isso para durar o tempo exato da fala e
mostrar cada palavra da legenda no momento em que é dita.
Uso: python3 scripts/medir-voz.py [pt|en]
"""
import json, re, subprocess, pathlib, sys

lingua = sys.argv[1] if len(sys.argv) > 1 else 'pt'
pasta = 'voz' if lingua == 'pt' else f'voz-{lingua}'

raiz = pathlib.Path(__file__).resolve().parent.parent
saida = {}
for mp3 in sorted((raiz / 'public' / pasta).glob('*.mp3')):
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)]).strip())
    log = subprocess.run(['ffmpeg', '-i', str(mp3), '-af', 'silencedetect=n=-38dB:d=0.09', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    silencios = list(zip(starts, ends + [dur] * (len(starts) - len(ends))))
    regioes, t = [], 0.0
    for a, b in silencios:
        if a - t > 0.08:
            regioes.append([round(t, 3), round(a, 3)])
        t = b
    if dur - t > 0.08:
        regioes.append([round(t, 3), round(dur, 3)])
    saida[int(mp3.stem)] = {'dur': round(dur, 3), 'regioes': regioes}
(raiz / 'src' / ('voz.json' if lingua == 'pt' else f'voz-{lingua}.json')).write_text(json.dumps(saida, indent=1))
print(json.dumps(saida))
