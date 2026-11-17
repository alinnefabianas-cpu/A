#!/usr/bin/env python3
"""Monta "O Acampamento" a partir dos proxies 1080x1920, seguindo o roteiro de 16 cenas.

Uso:  python3 -I render.py PROXY_DIR WORK_DIR SAIDA.mp4   (REUSE=1 reaproveita segmentos ja cortados)

- Corta os takes da EDL (edl.py), aplica recorte/camera lenta e a cor da cena
  (dia, fim de tarde, noite, amanhecer), concatena,
- mixa as trilhas (cues com entrada/saida e pausas dramaticas) + ambiente + efeitos.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from edl import EDL  # noqa: E402

PROXY, WORK, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ROOT = os.path.dirname(HERE)
AUD = os.path.join(ROOT, "audio")
FPS = "24000/1001"
TAIL = 2.0  # preto no final
os.makedirs(WORK, exist_ok=True)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd)[:3000]); print(r.stderr[-3000:]); sys.exit(1)
    return r


# ---------------- COR ----------------
# Base: rolloff suave nas altas, pretos levemente levantados, verdes/amarelos menos "neon".
BASE = ("curves=all='0/0.035 0.25/0.24 0.5/0.5 0.8/0.78 1/0.945',"
        "huesaturation=saturation=-0.26:colors=g+y:strength=1")
DIA = "eq=saturation=0.96,colortemperature=temperature=5800:mix=0.4"
DIA_DOCE = "eq=saturation=0.93:contrast=0.97,colortemperature=temperature=5600:mix=0.45"       # menina docil / cha
TARDE = "eq=saturation=0.95,colorbalance=rm=0.03:bm=-0.03,colortemperature=temperature=4800:mix=0.6"  # fim de tarde
# "Noite americana": escurece, tira saturacao, puxa para azul e esmaga as altas (ceu estourado vira luar)
NOITE = ("curves=all='0/0 0.5/0.30 1/0.62',eq=saturation=0.45:gamma=0.95,"
         "colorbalance=rs=-0.08:gs=-0.02:bs=0.14:rm=-0.06:bm=0.10:rh=-0.04:bh=0.06,"
         "vignette=angle=PI/4.5")
AMANHECER = ("eq=saturation=1.0:brightness=0.02,colorbalance=rh=0.05:gh=0.02:bh=-0.04:rm=0.03,"
             "colortemperature=temperature=4600:mix=0.55")
FAROESTE = "eq=saturation=0.97:contrast=1.04,colortemperature=temperature=5000:mix=0.6"
COR_CENA = {1: DIA_DOCE, 2: DIA, 3: TARDE, 4: TARDE, 5: TARDE, 6: TARDE, 7: TARDE,
            8: NOITE, 9: NOITE, 10: AMANHECER, 11: DIA, 12: FAROESTE, 13: FAROESTE,
            14: DIA_DOCE, 15: DIA_DOCE, 16: DIA_DOCE}
AJUSTE_TAKE = {
    "C1716": "eq=brightness=-0.05:gamma=0.92",
    "C1724": "eq=gamma=1.04", "C1725": "eq=gamma=1.04",
}
VINHETA = "vignette=angle=PI/7"


def grade(clip, cena):
    f = [BASE, COR_CENA[cena]]
    if clip in AJUSTE_TAKE:
        f.append(AJUSTE_TAKE[clip])
    f.append(VINHETA)
    return ",".join(f)


# ---------------- VIDEO ----------------
starts, durs, t = [], [], 0.0
lista = os.path.join(WORK, "lista.txt")
with open(lista, "w") as L:
    for i, (clip, a, b, cena, op) in enumerate(EDL):
        vel = op.get("vel", 1.0)
        hold = op.get("hold", 0.0)
        dur = (b - a) / vel + hold
        nfr = round(dur * 24000 / 1001)
        starts.append(t)
        seg = os.path.join(WORK, f"seg{i:02d}.mp4")
        vf = []
        if "crop" in op:
            vf.append(op["crop"] + ",scale=1080:1920:flags=lanczos")
        if vel != 1.0:
            vf.append(f"setpts=PTS/{vel}")
        if hold:
            vf.append(f"tpad=stop_mode=clone:stop_duration={hold}")
        vf.append(grade(clip, cena))
        if i == 0:
            vf.append("fade=t=in:st=0:d=1.0")
        if i == len(EDL) - 1:
            vf.append(f"fade=t=out:st={dur-0.8:.3f}:d=0.8")
        if not (os.environ.get("REUSE") and os.path.exists(seg)):
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-i", os.path.join(PROXY, clip + ".mp4"),
                 "-an", "-vf", ",".join(vf) + f",fps={FPS},format=yuv420p", "-frames:v", str(nfr),
                 "-c:v", "libx264", "-crf", "12", "-preset", "fast", seg])
        L.write(f"file '{seg}'\n")
        d = nfr * 1001 / 24000
        durs.append(d)
        t += d
        print(f"{i:02d} cena{cena:2d} {clip} {starts[-1]:7.2f}s +{d:.2f} {op.get('k','')}")
TOTAL_V = t
preto = os.path.join(WORK, "preto.mp4")
run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s=1080x1920:r={FPS}:d={TAIL}",
     "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", preto])
with open(lista, "a") as L:
    L.write(f"file '{preto}'\n")
TOTAL = TOTAL_V + TAIL
video = os.path.join(WORK, "video.mp4")
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", video])

# ---------------- MARCAS DE TEMPO ----------------
def S(cena):  # inicio da cena
    return min(starts[i] for i, e in enumerate(EDL) if e[3] == cena)


def E(cena):  # fim da cena
    i = max(i for i, e in enumerate(EDL) if e[3] == cena)
    return starts[i] + durs[i]


def K(rotulo, off=0.0):  # inicio do take rotulado
    i = next(i for i, e in enumerate(EDL) if e[4].get("k") == rotulo)
    return starts[i] + off


def P(cena, n, off=0.0):  # n-esimo take (0..) da cena
    idx = [i for i, e in enumerate(EDL) if e[3] == cena]
    return starts[idx[n]] + off


# ---------------- TRILHA ----------------
# (arquivo, inicio, fim, offset no arquivo, fade in, fade out, ganho dB)
MUSICA = [
    ("1-jardim",            S(1),            S(2) + 0.6,        0.0, 1.0, 0.8, 0),    # 1 delicada
    ("2-brincar",           S(2) + 0.2,      K("ideia", 0.15),  0.0, 0.3, 0.15, 2),   # 2 ritmo dos pulos... para na ideia
    ("3-trilha",            K("ideia", 1.0), E(2) + 0.5,        0.0, 0.2, 0.6, 0),    #   ...e vira marotinha
    ("8-acampamento",       S(3),            K("chegada", 0.1), 0.0, 1.5, 0.15, 0),   # 3-4 calmo
    ("3-trilha",            K("chegada", 0.3), E(5) + 0.4,      8.0, 0.1, 0.8, 1),    # 5 travessura, rapido
    ("8-acampamento",       S(6),            S(7) + 0.4,        14.0, 0.8, 0.6, 0),   # 6 volta o calmo
    ("4-tesouro",           S(7),            E(7) + 0.3,        12.0, 0.5, 0.8, 3),   # 7 mala/lanterna
    ("9-ninar",             S(8),            S(9) + 0.3,        0.0, 1.0, 0.6, 3),   # 8 noite
    ("10-travessura-noite", S(9),            E(9) + 0.3,        0.0, 0.2, 0.6, 0),    # 9 travessura noturna
    ("2-brincar",           S(10) + 0.4,     K("descoberta", 0.05), 6.0, 0.8, 0.1, 3),  # 10 bom dia... corte seco
    ("5-cowboy",            S(12),           K("batom", 0.45),   0.0, 0.2, 0.05, 1),   # 12 faroeste ate o batom
    ("6-cha",               S(14),           K("plano", 0.4),   0.0, 0.8, 0.5, 1),    # 14-15 cha com a coelhinha
    ("11-plano-vinganca",   K("plano", 0.0), K("cookie", 0.9),  0.0, 0.2, 0.4, 1),    # plano secreto... pausa no cookie
    ("3-trilha",            K("aranha", 0.9), K("satisfeito", 0.3), 20.0, 0.05, 0.4, 2),  # 16 susto: cortes rapidos
    ("7-final",             K("satisfeito", 0.0), TOTAL,        0.0, 0.3, 2.0, 1),    # 16 vinganca cumprida
]

# Ambiente: passarinhos de dia, grilos a noite
AMBIENTE = [
    ("passaros", 0.0, S(8) + 0.5, -24),
    ("grilos", S(8) - 0.3, E(9) + 0.3, -20),
    ("passaros", E(9), TOTAL_V, -22),
]

# (momento, efeito, ganho dB)
EFEITOS = [
    (P(1, 0, 0.6), "balanco", -12), (P(1, 1, 0.3), "balanco", -14),
    (P(2, 0, 0.0), "corda-pular", -6), (P(2, 1, 0.3), "corda-pular", -8),
    (K("ideia", 0.8), "ideia", -6),
    (K("lupa", 1.4), "brilho", -12),
    (K("chegada", 0.0), "surpresa", -4),
    (P(5, 1, 0.5), "amarrar", -5), (P(5, 2, 0.8), "post-it", -6), (P(5, 3, 0.5), "post-it", -7),
    (P(5, 4, 0.6), "post-it", -6), (P(5, 4, 1.4), "post-it", -9),
    (K("ganchos", 1.2), "bau", -6), (K("lanterna", 0.7), "bau", -10),
    (K("lanterna", 1.6), "lanterna-clique", -4), (K("lanterna", 1.8), "brilho", -10),
    (P(8, 1, 0.3), "ziper", -8),
    (P(9, 0, 0.2), "passos-cascalho", -14), (P(9, 1, 0.8), "post-it", -14), (P(9, 3, 0.4), "brilho", -12),
    (S(10) + 0.1, "galo", -10), (S(10) + 0.5, "ziper", -10),
    (K("triste", 0.1), "trombone-triste", -5),
    (P(12, 1, 0.3), "espora", -9), (P(12, 2, 0.3), "whoosh", -13),
    (P(12, 3, 0.2), "passos-cascalho", -9),
    (K("saca", 0.6), "espora", -11),
    (K("batom", 0.4), "disco-arranhando", -3),
    (K("joga", 0.5), "whoosh", -8), (K("joga", 0.9), "pop", -8),
    (P(14, 0, 1.5), "xicara", -8), (P(14, 1, 0.4), "coelho", -12), (P(15, 0, 1.4), "xicara", -10),
    (K("plano", 0.3), "brilho", -16),
    (K("aranha", 1.1), "whoosh", -10),
    (K("grito", 0.0), "susto", -3),
    (K("satisfeito", 0.2), "brilho", -12),
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


for n, (nome, st, en, off, fi, fo, g) in enumerate(MUSICA):
    k = add_input("-i", os.path.join(AUD, "musica", nome + ".mp3"))
    length = en - st
    chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-17:TP=-2:LRA=9,"
                  f"volume={g}dB,atrim={off:.3f}:{off+length:.3f},asetpts=PTS-STARTPTS,"
                  f"afade=t=in:d={fi},afade=t=out:st={max(0, length-fo):.3f}:d={fo},"
                  f"adelay={int(st*1000)}:all=1[m{n}]")
    mix.append(f"[m{n}]")
for n, (nome, st, en, g) in enumerate(AMBIENTE):
    p = os.path.join(AUD, "efeitos", nome + ".mp3")
    k = add_input("-stream_loop", "-1", "-i", p)
    chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={-peak_db(p)+g:.1f}dB,"
                  f"atrim=0:{en-st:.3f},afade=t=in:d=1.0,afade=t=out:st={en-st-1.0:.3f}:d=1.0,"
                  f"adelay={int(st*1000)}:all=1[a{n}]")
    mix.append(f"[a{n}]")
cache = {}
for n, (when, nome, g) in enumerate(EFEITOS):
    p = os.path.join(AUD, "efeitos", nome + ".mp3")
    if p not in cache:
        cache[p] = peak_db(p)
    k = add_input("-i", p)
    gain = min(-cache[p] - 2, 14) + g
    chains.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={gain:.1f}dB,"
                  f"adelay={int(max(0, when)*1000)}:all=1[e{n}]")
    mix.append(f"[e{n}]")

fc = ";".join(chains) + ";" + "".join(mix) + \
    f"amix=inputs={len(mix)}:normalize=0:dropout_transition=0,apad,atrim=0:{TOTAL:.3f}," \
    f"alimiter=limit=0.89:level=false,loudnorm=I=-15:TP=-1.5:LRA=11[out]"
mixwav = os.path.join(WORK, "mix.wav")
run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[out]", "-ar", "48000", mixwav])

# ---------------- EXPORT ----------------
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
log = os.path.join(WORK, "x264")
enc = ["-c:v", "libx264", "-preset", "slow", "-b:v", "4400k", "-maxrate", "9000k",
       "-bufsize", "12000k", "-pix_fmt", "yuv420p", "-profile:v", "high", "-passlogfile", log]
run(["ffmpeg", "-v", "error", "-y", "-i", video, *enc, "-pass", "1", "-an", "-f", "mp4", os.devnull])
run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", mixwav, *enc, "-pass", "2",
     "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", OUT])
json.dump({"starts": starts, "durs": durs, "total": TOTAL}, open(os.path.join(WORK, "tempos.json"), "w"), indent=1)
print(f"OK {OUT}  {TOTAL:.1f}s")
