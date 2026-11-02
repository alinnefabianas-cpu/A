#!/usr/bin/env python3
"""Mede a narração (public/voz-<ep>/NN.mp3) e grava src/episodios/<ep>-voz.json.

Para cada bloco: duração, início/fim da fala e os trechos falados entre pausas.
O vídeo usa isso para durar exatamente o tempo da voz e fazer cada frase da
legenda aparecer quando é dita.
Uso: python3 scripts/medir-voz.py narcisista
"""
import json, re, subprocess, sys, pathlib

ep = sys.argv[1] if len(sys.argv) > 1 else 'narcisista'
raiz = pathlib.Path(__file__).resolve().parent.parent
pasta = raiz / 'public' / f'voz-{ep}'
saida = {}
for mp3 in sorted(pasta.glob('*.mp3')):
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)]).strip())
    log = subprocess.run(['ffmpeg', '-i', str(mp3), '-af', 'silencedetect=n=-38dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    silencios = list(zip(starts, ends + [dur] * (len(starts) - len(ends))))
    # trechos com voz = complemento dos silêncios
    regioes, t = [], 0.0
    for a, b in silencios:
        if a - t > 0.12:
            regioes.append([round(t, 3), round(a, 3)])
        t = b
    if dur - t > 0.12:
        regioes.append([round(t, 3), round(dur, 3)])
    saida[int(mp3.stem)] = {
        'arquivo': f'voz-{ep}/{mp3.name}',
        'dur': round(dur, 3),
        'inicio': regioes[0][0] if regioes else 0,
        'fim': regioes[-1][1] if regioes else dur,
        'regioes': regioes,
    }
destino = raiz / 'src' / 'episodios' / f'{ep}-voz.json'
destino.write_text(json.dumps(saida, indent=1))
print(f'{len(saida)} falas -> {destino.relative_to(raiz)}  total {sum(v["dur"] for v in saida.values()):.1f}s')
