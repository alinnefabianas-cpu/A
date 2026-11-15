#!/usr/bin/env python3
"""Monta o filme "Um dia no campo" a partir dos proxies 1080x1920.

Uso:  python3 -I render.py PROXY_DIR WORK_DIR SAIDA.mp4

- Corta os takes da EDL (edl.py), aplica a correcao de cor da secao,
- concatena, e mixa trilha (1 musica por secao, com crossfade) + efeitos sonoros.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from edl import EDL  # noqa: E402

PROXY, WORK, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ROOT = os.path.dirname(HERE)
AUD = os.path.join(ROOT, "audio")
FPS = "24000/1001"
TAIL = 2.0  # segundos de preto no final para a musica fechar
os.makedirs(WORK, exist_ok=True)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd)); print(r.stderr[-3000:]); sys.exit(1)
    return r


# ---------------- COR ----------------
# Base: rolloff suave nas altas, pretos levemente levantados, verdes/amarelos
# menos "neon" (a camera entregou tudo muito saturado), leve calor e vinheta.
BASE = ("curves=all='0/0.035 0.25/0.24 0.5/0.5 0.8/0.78 1/0.945',"
        "huesaturation=saturation=-0.26:colors=g+y:strength=1")
SECAO_COR = {
    1: "eq=saturation=0.95:contrast=0.98,colortemperature=temperature=5600:mix=0.45",            # jardim: dourado suave
    2: "eq=saturation=0.97,colortemperature=temperature=5900:mix=0.35",                          # brincar: claro e arejado
    3: "eq=saturation=0.92,colorbalance=rs=-0.03:bs=0.035:rh=0.025:bh=-0.01,colortemperature=temperature=6000:mix=0.3",  # trilha: sombra fria
    4: "eq=saturation=0.95,colorbalance=rm=0.03:bm=-0.03,colortemperature=temperature=5400:mix=0.5",  # tesouro: ambar
    5: "eq=saturation=0.97:contrast=1.03,colortemperature=temperature=5200:mix=0.55",              # cowboy: faroeste dourado
    6: "curves=all='0/0.03 1/0.98',eq=saturation=0.88:contrast=0.96,colorbalance=rh=0.03:bh=0.012:gh=-0.01,colortemperature=temperature=6000:mix=0.3",  # cha: pastel
    7: "eq=saturation=0.95,colortemperature=temperature=5000:mix=0.6",                             # final: entardecer
}
AJUSTE_TAKE = {  # correcoes pontuais por take
    "C1772": "eq=brightness=-0.05:gamma=0.92:contrast=1.04",  # ceu estourado
    "C1716": "eq=brightness=-0.04:gamma=0.94",
    "C1701": "eq=gamma=1.06",                                  # take escuro
    "C1724": "eq=gamma=1.04",
    "C1725": "eq=gamma=1.04",
}
VINHETA = "vignette=angle=PI/7"


def grade(clip, sec):
    f = [BASE, SECAO_COR[sec]]
    if clip in AJUSTE_TAKE:
        f.append(AJUSTE_TAKE[clip])
    f.append(VINHETA)
    return ",".join(f)


# ---------------- VIDEO ----------------
starts, t = [], 0.0
lista = os.path.join(WORK, "lista.txt")
with open(lista, "w") as L:
    for i, (clip, a, b, sec) in enumerate(EDL):
        dur = b - a
        starts.append(t)
        seg = os.path.join(WORK, f"seg{i:02d}.mp4")
        vf = grade(clip, sec)
        if i == 0:
            vf += ",fade=t=in:st=0:d=1.0"
        if i == len(EDL) - 1:
            vf += f",fade=t=out:st={dur-1.6:.3f}:d=1.6"
        nfr = round(dur * 24000 / 1001)
        if not (os.environ.get("REUSE") and os.path.exists(seg)):
          run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-i", os.path.join(PROXY, clip + ".mp4"),
             "-an", "-vf", vf + f",fps={FPS},format=yuv420p", "-frames:v", str(nfr),
             "-c:v", "libx264", "-crf", "12", "-preset", "fast", seg])
        L.write(f"file '{seg}'\n")
        t += nfr * 1001 / 24000
        print(f"{i:02d} {clip} sec{sec} {starts[-1]:7.2f}s +{dur:.2f}")
TOTAL_V = t
# preto no final
preto = os.path.join(WORK, "preto.mp4")
run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s=1080x1920:r={FPS}:d={TAIL}",
     "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", preto])
with open(lista, "a") as L:
    L.write(f"file '{preto}'\n")
TOTAL = TOTAL_V + TAIL
video = os.path.join(WORK, "video.mp4")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", video])

# inicio de cada secao
sec_start = {}
for i, (_, _, _, sec) in enumerate(EDL):
    sec_start.setdefault(sec, starts[i])
secs = sorted(sec_start)
sec_end = {s: (sec_start[secs[k + 1]] if k + 1 < len(secs) else TOTAL) for k, s in enumerate(secs)}

# ---------------- AUDIO ----------------
MUSICA = {1: "1-jardim", 2: "2-brincar", 3: "3-trilha", 4: "4-tesouro", 5: "5-cowboy", 6: "6-cha", 7: "7-final"}
MUS_GAIN = {1: 0, 2: 2.5, 3: 0, 4: 2, 5: 1.5, 6: 1.5, 7: 0.5}  # ajuste fino apos normalizacao

# (indice do take, deslocamento s, efeito, ganho dB)
EFEITOS = [
    (0, 0.0, "sinos", -14),
    (2, 0.3, "regador", -6), (3, 0.0, "regador", -12),
    (6, 0.6, "whoosh", -14),
    (7, 0.0, "corda-pular", -6), (8, 0.4, "corda-pular", -9),
    (10, 1.8, "balanco", -9), (11, 0.4, "whoosh", -10), (11, 0.0, "balanco", -12), (12, 0.0, "balanco", -10),
    (14, 0.0, "passos-cascalho", -8),
    (16, 1.6, "brilho", -12),
    (17, 1.1, "amarrar", -5), (18, 0.6, "amarrar", -9),
    (20, 1.0, "post-it", -7), (20, 2.9, "post-it", -9), (21, 0.8, "post-it", -7),
    (22, 0.4, "pop", -10),
    (23, 2.2, "ziper", -8), (24, 0.0, "ziper", -10),
    (25, 2.8, "passos-cascalho", -10),
    (26, 1.6, "bau", -8), (27, 0.2, "bau", -6), (27, 1.4, "brilho", -10),
    (28, 0.0, "mapa", -6),
    (30, 0.2, "espora", -9), (30, 0.9, "whoosh", -14), (31, 0.4, "espora", -10),
    (33, 0.4, "espora", -11), (34, 1.5, "pop", -6),
    (35, 0.0, "sinos", -15),
    (36, 0.9, "brilho", -13),
    (37, 1.5, "xicara", -8), (37, 3.0, "xicara", -11),
    (38, 0.4, "coelho", -12),
    (39, 2.4, "xicara", -10),
    (40, 1.2, "petalas", -8), (40, 1.4, "brilho", -10),
    (41, 0.0, "passos-cascalho", -12), (41, 2.6, "passos-cascalho", -16),
    (42, 0.6, "balanco", -12), (42, 3.5, "sinos", -14),
]


def peak_db(path):
    r = subprocess.run(["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True)
    for line in r.stderr.splitlines():
        if "max_volume" in line:
            return float(line.split(":")[1].split()[0])
    return 0.0


inputs, chains, mix = [], [], []
nin = [0]
def add_input(*args):
    inputs.extend(args); nin[0] += 1
    return nin[0] - 1

# musicas: normaliza loudness, recorta na secao com fade-out cruzado
for s in secs:
    p = os.path.join(AUD, "musica", MUSICA[s] + ".mp3")
    k = add_input("-i", p)
    st, en = sec_start[s], sec_end[s]
    xf = 1.2
    length = en - st + (xf if s != secs[-1] else 0)
    fin = 0.25 if s != secs[0] else 0.8
    fout_st = max(0.0, length - (xf if s != secs[-1] else 2.2))
    fout_d = xf if s != secs[-1] else 2.2
    chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-17:TP=-2:LRA=9,"
                  f"volume={MUS_GAIN[s]}dB,atrim=0:{length:.3f},afade=t=in:d={fin},"
                  f"afade=t=out:st={fout_st:.3f}:d={fout_d},adelay={int(st*1000)}:all=1[m{s}]")
    mix.append(f"[m{s}]")
# ambiente de passaros em loop, baixinho, durante o filme todo
p = os.path.join(AUD, "efeitos", "passaros.mp3")
k = add_input("-stream_loop", "-1", "-i", p)
pk = peak_db(p)
chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={-pk-24:.1f}dB,"
              f"atrim=0:{TOTAL_V:.3f},afade=t=in:d=1.5,afade=t=out:st={TOTAL_V-2:.3f}:d=2[amb]")
mix.append("[amb]")
cache = {}
for n, (idx, off, nome, g) in enumerate(EFEITOS):
    p = os.path.join(AUD, "efeitos", nome + ".mp3")
    if p not in cache:
        cache[p] = peak_db(p)
    k = add_input("-i", p)
    when = starts[idx] + off
    gain = min(-cache[p] - 2, 14) + g  # normaliza pico para -2 dBFS (max +14 dB) e aplica ganho do evento
    chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={gain:.1f}dB,"
                  f"adelay={int(when*1000)}:all=1[e{n}]")
    mix.append(f"[e{n}]")

fc = ";".join(chains) + ";" + "".join(mix) + \
    f"amix=inputs={len(mix)}:normalize=0:dropout_transition=0,atrim=0:{TOTAL:.3f}," \
    f"alimiter=limit=0.89:level=false,loudnorm=I=-15:TP=-1.5:LRA=11[out]"
mixwav = os.path.join(WORK, "mix.wav")
run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[out]", "-ar", "48000", mixwav])

# ---------------- EXPORT ----------------
# 2 passes ~5 Mbps: boa qualidade em 1080x1920 e arquivo < 100 MB.
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
log = os.path.join(WORK, "x264")
common = ["-i", video, "-c:v", "libx264", "-preset", "slow", "-b:v", "4600k", "-maxrate", "9000k",
          "-bufsize", "12000k", "-pix_fmt", "yuv420p", "-profile:v", "high", "-passlogfile", log]
run(["ffmpeg", "-v", "error", "-y", *common, "-pass", "1", "-an", "-f", "mp4", os.devnull])
run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", mixwav, *common[2:], "-pass", "2",
     "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", OUT])
json.dump({"starts": starts, "total": TOTAL}, open(os.path.join(WORK, "tempos.json"), "w"), indent=1)
print(f"OK {OUT}  {TOTAL:.1f}s")
