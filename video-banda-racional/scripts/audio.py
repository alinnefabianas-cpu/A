"""Trilha do trailer Banda Racional: musica real da banda + camada cinematografica sintetizada (sem samples de terceiros)."""
import numpy as np, librosa, soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt, sosfiltfilt

SR = 48000
DUR = 119.5
N = int(DUR * SR)
rng = np.random.default_rng(7)

def T(t): return int(round(t * SR))
def env_exp(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def lp(x, f, order=2): return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x, axis=0)
def hp(x, f, order=2): return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x, axis=0)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)
def st(x, w=0.0):  # mono -> stereo
    return np.stack([x, x], 1) if x.ndim == 1 else x

def make_ir(sec=3.5, damp=6000):
    n = T(sec); e = env_exp(n, sec / 6.5)
    ir = rng.standard_normal((n, 2)) * e[:, None]
    ir = lp(ir, damp); ir[:T(0.01)] *= np.linspace(0, 1, T(0.01))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0))
IR_BIG = make_ir(4.5, 5000)
IR_MED = make_ir(2.2, 7000)
def reverb(x, ir=IR_BIG, wet=0.5):
    x = st(x); y = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + y * wet

def add(buf, x, t, g=1.0):
    x = st(x); i = T(t)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * g

def saw(f, n, phase=0):
    ph = np.cumsum(np.full(n, f) if np.isscalar(f) else f) / SR + phase
    return 2 * (ph % 1) - 1
def sine(f, n):
    ph = np.cumsum(np.full(n, f) if np.isscalar(f) else f) / SR
    return np.sin(2 * np.pi * ph)

F1 = 43.65; C2 = 65.41; F2 = 87.31; A2 = 110.0; C3 = 130.81; F3 = 174.61; A3 = 220.0; C4 = 261.63

# ---------------- elementos ----------------
def impact(big=1.0, tail=4.0):
    n = T(tail)
    f = 32 + 70 * np.exp(-np.arange(n) / (0.06 * SR))
    body = sine(f, n) * env_exp(n, 0.9 * big)
    sub = sine(np.full(n, 30.0), n) * env_exp(n, 1.6) * 0.7
    nz = rng.standard_normal(n) * env_exp(n, 0.12)
    crack = hp(nz, 1500) * 0.5 + lp(nz, 900) * 0.9
    x = np.tanh((body * 1.3 + sub + crack) * 1.6) * 0.9
    return reverb(x, IR_BIG, 0.35)

def braam(notes=(F1, F2, C3), dur=3.2, bright=1800):
    n = T(dur); x = np.zeros(n)
    for f in notes:
        for d in (-0.12, 0, 0.11):
            x += saw(f * (1 + d / 100 * 6), n, rng.random())
    a = np.minimum(1, np.arange(n) / (0.04 * SR)) * env_exp(n, dur / 3)
    cut = 300 + bright * np.exp(-np.arange(n) / (0.5 * SR))
    # filtro variavel aproximado: duas bandas mixadas
    y = lp(x, 350, 4) * 0.6 + lp(x, bright, 4) * np.exp(-np.arange(n) / (0.45 * SR)) * 0.8
    y = np.tanh(y * a * 0.5) * 0.9
    return reverb(y, IR_BIG, 0.4)

def taiko(f0=70, dec=0.5):
    n = T(2.5)
    f = f0 * (1 + 0.8 * np.exp(-np.arange(n) / (0.015 * SR)))
    x = sine(f, n) * env_exp(n, dec) + lp(rng.standard_normal(n), 400) * env_exp(n, 0.05) * 0.8
    return reverb(np.tanh(x * 1.5), IR_BIG, 0.45)

def riser(dur, f0=200, f1=6000, tone=True):
    n = T(dur); k = np.linspace(0, 1, n)
    nz = rng.standard_normal(n)
    out = np.zeros(n); seg = T(0.05)
    for s in range(0, n, seg):
        fc = f0 * (f1 / f0) ** (k[s] ** 1.6)
        out[s:s + seg] = bp(nz[max(0, s - 2000):s + seg], max(30, fc * 0.6), min(SR / 2 - 100, fc * 1.4))[-len(out[s:s + seg]):]
    x = out * (k ** 2.2)
    if tone:
        fq = F2 * (2 ** (k * 2.0))
        x += (saw(fq, n) * 0.25 + saw(fq * 1.5, n) * 0.15) * (k ** 3) * 0.6
        x = x  # shepard-ish
    return reverb(x * 0.8, IR_MED, 0.3)

def whoosh(dur=0.9, up=True):
    n = T(dur); k = np.linspace(0, 1, n)
    e = np.sin(np.pi * k) ** 2 if up else (1 - k) ** 2
    x = bp(rng.standard_normal(n), 300, 5000) * e
    return reverb(st(x) * np.array([0.8, 1.0]), IR_MED, 0.25) * 0.6

def reverse_swell(dur=1.6):
    x = impact(1.0, dur)[::-1].copy()
    k = np.linspace(0, 1, len(x)) ** 3
    return x * k[:, None] * 0.7

def drone(dur, notes=(F1, C2, F2), lfo=0.07):
    n = T(dur); x = np.zeros(n); t = np.arange(n) / SR
    for f in notes:
        x += sine(f, n) * 0.6 + lp(saw(f * 1.002, n), 400) * 0.25
    x *= 0.6 + 0.4 * np.sin(2 * np.pi * lfo * t)
    air = bp(rng.standard_normal(n), 2000, 7000) * 0.03 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t + 1))
    return reverb(x * 0.35 + air, IR_BIG, 0.5)

def pad(dur, notes, att=1.5, cutoff=1400):
    n = T(dur); x = np.zeros(n)
    for f in notes:
        for d in (-0.08, 0.08):
            x += saw(f * (1 + d / 100), n, rng.random())
    x = lp(x, cutoff, 4)
    k = np.arange(n) / SR
    e = np.minimum(1, k / att) * np.minimum(1, (dur - k) / 1.0).clip(0)
    return reverb(x * e * 0.12, IR_BIG, 0.55)

def shimmer(dur, notes=(698.5, 880, 1046.5, 1396.9)):
    n = T(dur); x = np.zeros(n); k = np.arange(n) / SR
    for i, f in enumerate(notes):
        x += sine(f, n) * (0.5 + 0.5 * np.sin(2 * np.pi * (0.3 + i * 0.13) * k)) * 0.25
    e = np.minimum(1, k / 2.0) * np.minimum(1, (dur - k) / 1.5).clip(0)
    return reverb(x * e * 0.5, IR_BIG, 0.7)

def pluck(f, dur=0.22):
    n = T(dur); x = saw(f, n) * 0.6 + saw(f * 2.003, n) * 0.25
    x = lp(x, 2600, 2) * env_exp(n, 0.07)
    return x

def bell(f, dur=4.0):
    n = T(dur); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (dur * d)) for r, a, d in
            [(1, 1, .5), (2.01, .5, .3), (3.0, .3, .2), (4.2, .2, .12), (5.4, .12, .08)])
    return reverb(x * 0.3, IR_BIG, 0.5)

# ---------------- musica da banda ----------------
band, _ = librosa.load("raw/4º Encontro.mp3", sr=SR, mono=False)
band = band.T.astype(np.float64)
band /= np.abs(band).max()
bt = np.load("beats.npy")
D = -0.56
i0 = np.argmin(abs(bt - 100.56)); down_tr = bt[i0 % 4::4] + D
beats_tr = bt + D

out = np.zeros((N, 2)); synth = np.zeros((N, 2))
bandbus = np.zeros((N, 2))

# Faixa principal: trailer 12.26 -> 105.93  (trilha = trailer - D)
A0, A1 = 12.26, 105.93
seg = band[T(A0 - D):T(A1 - D) + T(0.05)].copy()
n = len(seg); tt = A0 + np.arange(n) / SR
# filtro "distante" abrindo de 12.26 ate 26.98
far = lp(seg, 500, 2); far2 = lp(seg, 1600, 2)
m1 = np.clip((tt - 12.26) / (22.0 - 12.26), 0, 1)[:, None]
m2 = np.clip((tt - 22.0) / (26.6 - 22.0), 0, 1)[:, None]
mix = far * (1 - m1) + far2 * m1 * (1 - m2) + 0  # ate 26.6
full = (tt >= 26.98)[:, None]
g = (np.clip((tt - 12.26) / 6, 0, 1) ** 2 * 0.55)[:, None] + 0.25 * m2
seg_out = np.where(full, seg, mix * g)
# respiro antes do primeiro titulo (gap 26.62-26.98)
gap = (tt > 26.62) & (tt < 26.98); seg_out[gap] *= 0.0
# respiro antes do impacto final: 93.85-100.01 abafa progressivamente, silencio 99.45-100.01
b = (tt > 95.0) & (tt < 100.01)
kk = np.clip((tt - 95.0) / (99.4 - 95.0), 0, 1)
low = lp(seg, 700, 2)
seg_out[b] = (seg[b] * (1 - kk[b, None]) + low[b] * kk[b, None]) * (1 - 0.5 * kk[b, None])
seg_out[(tt > 99.45) & (tt < 100.01)] = 0
# fades suaves de borda
fade = T(0.012)
for a in (26.98, 100.01):
    i = T(a - A0); seg_out[i:i + fade] *= np.linspace(0, 1, fade)[:, None]
for a in (26.62, 99.45):
    i = T(a - A0); seg_out[i - fade:i] *= np.linspace(1, 0, fade)[:, None]
e = T(0.03); seg_out[-e:] *= np.linspace(1, 0, e)[:, None]
add(bandbus, seg_out, A0)

# Final real da musica: trilha 142.38 -> fim, colocado em 105.93 (golpe final em 113.82)
E0 = 142.38; endseg = band[T(E0):].copy()
e2 = T(0.03); endseg[:e2] *= np.linspace(0, 1, e2)[:, None]
add(bandbus, endseg, 105.93)

# "Fantasma" da banda no intro: trecho lento, reverberado, distante
ghost = band[T(30.0):T(36.0), 0]
gs = librosa.effects.time_stretch(ghost.astype(np.float32), rate=0.45)
gs = lp(hp(gs.astype(np.float64), 250), 2500)
gk = np.arange(len(gs)) / SR
gs *= np.minimum(1, gk / 3) * np.clip((len(gs) / SR - gk) / 3, 0, 1)
add(synth, reverb(gs, IR_BIG, 0.8) * 0.5, 1.8)

# ---------------- camada cinematografica ----------------
# 0.0-0.35 silencio; 0.4 primeiro golpe com sucao reversa
add(synth, reverse_swell(0.6) * 0.6, -0.2)
add(synth, impact(1.2, 5) * 1.0, 0.4)
add(synth, braam((F1, F2, C3, F3), 4.0, 2400) * 0.8, 0.4)

# intro: drone grave + pulsos (taiko) a cada compasso, levando para a banda
add(synth, drone(15.5) * 0.9, 1.2)
for t in (3.74, 5.87, 8.0, 10.13):
    add(synth, taiko(62, 0.7) * 0.75, t)
add(synth, shimmer(9.0) * 0.5, 6.0)
add(synth, pad(16, (F2, C3, F3), 4, 900) * 0.8, 12.0)

# construcao 12.26 -> 26.98
add(synth, riser(8.3, 150, 7000) * 0.8, 18.68)
for t in down_tr[(down_tr > 12) & (down_tr < 26)]:
    add(synth, taiko(58, 0.6) * 0.8, t)
last = beats_tr[(beats_tr > 24.8) & (beats_tr < 26.9)]
for t in last:
    add(synth, taiko(80, 0.25) * 0.55, t)
add(synth, reverse_swell(1.4) * 0.8, 26.98 - 1.4)

# TITULO 1 26.98
add(synth, impact(1.3, 5) * 1.1, 26.98)
add(synth, braam((F1, F2, C3, F3), 4.5, 2600) * 1.0, 26.98)

# energia 27 -> 71: sub nas cabecas de compasso + pad em Fa
for t in down_tr[(down_tr > 28) & (down_tr < 70)]:
    add(synth, taiko(50, 0.45) * 0.45, t)
add(synth, pad(44, (F2, C3, A3), 3, 1200) * 0.55, 27.5)
for t in (37.59, 48.09, 58.51):
    add(synth, whoosh(1.0) * 0.9, t - 0.7)
# ostinato preso a grade de tempos da banda (semicolcheias) a partir de 50.18
seq = [F3, C4, A3, C4, F3, C4, A3, F3 * 2]
def ostinato(t0, t1, gain):
    bb = beats_tr[(beats_tr >= t0) & (beats_tr < t1)]
    k = 0
    for i in range(len(bb) - 1):
        for s in range(4):
            tt_ = bb[i] + (bb[i + 1] - bb[i]) * s / 4
            add(synth, st(pluck(seq[k % 8])) * gain * (1.0 if s == 0 else 0.7), tt_)
            k += 1
ostinato(50.18, 70.6, 0.10)
ostinato(71.0, 93.85, 0.13)
ostinato(100.01, 105.9, 0.15)
for t in (58.51, 62.67, 66.80):
    add(synth, braam((F1, F2, C3), 2.2, 1500) * 0.55, t)
add(synth, riser(6.2, 180, 8000) * 0.9, 70.96 - 6.2)
add(synth, reverse_swell(1.2) * 0.8, 70.96 - 1.2)

# TITULO 2 70.96
add(synth, impact(1.3, 5) * 1.1, 70.96)
add(synth, braam((F1, F2, C3, A3), 4.5, 2800) * 1.0, 70.96)

# apoteose 71 -> 94: golpes a cada 2 compassos, pad maior
for t in down_tr[(down_tr > 72) & (down_tr < 93)][::2]:
    add(synth, impact(0.7, 3) * 0.5, t)
for t in down_tr[(down_tr > 72) & (down_tr < 93)]:
    add(synth, taiko(52, 0.45) * 0.55, t)
add(synth, pad(23, (F2, A2, C3, F3, A3), 2, 1800) * 0.6, 71.0)

# respiro 93.85 -> 100.01
add(synth, pad(6.5, (C3, F3, A3), 1.5, 900) * 0.8, 93.85)
add(synth, riser(5.4, 120, 9000) * 1.0, 94.05)
add(synth, reverse_swell(1.8) * 0.9, 100.01 - 1.8)

# IMPACTO FINAL 100.01
add(synth, impact(1.6, 6) * 1.3, 100.01)
add(synth, braam((F1, F2, C3, F3, A3), 5.0, 3200) * 1.1, 100.01)
for t in (101.98, 103.93):
    add(synth, impact(0.8, 3) * 0.55, t)
add(synth, whoosh(1.2) * 1.0, 105.93 - 0.9)

# logo: pad brilhante crescendo + golpe final + sinos
add(synth, pad(8.5, (F2, C3, F3, A3, C4), 3, 2200) * 0.9, 105.6)
add(synth, shimmer(13, (698.5, 880, 1046.5, 1396.9, 1760)) * 0.8, 106.5)
add(synth, riser(3.6, 300, 9000, tone=False) * 0.6, 113.82 - 3.6)
add(synth, impact(1.5, 6) * 1.2, 113.82)
add(synth, braam((F1, F2, C3, F3, A3), 5.5, 2600) * 0.9, 113.82)
for f, d in ((F3 * 4, 0), (A3 * 4, 0.03), (C4 * 4, 0.06)):
    add(synth, bell(f, 5) * 0.5, 113.82 + d)
add(synth, pad(5.5, (F2, C3, F3, A3), 0.3, 1500) * 0.7, 113.85)

# ---------------- mix ----------------
# sidechain leve da banda nos impactos (os golpes respiram)
kk_ = np.arange(N) / SR
def ramp(pts):
    xs, ys = zip(*pts); return np.interp(kk_, xs, ys)[:, None]
gs_ = ramp([(0, 1), (1.6, 1), (2.6, 0.55), (12, 0.6), (26.9, 0.9), (27, 1), (119.5, 1)])
gb_ = ramp([(0, 1), (27, 0.82), (70.9, 0.86), (71, 0.95), (93, 0.95), (100, 1), (119.5, 1)])
mix = bandbus * 0.92 * gb_ + synth * 0.55 * gs_
mix = hp(mix, 25)
# saturacao suave + limitador simples
peak = np.abs(mix).max(); mix /= peak
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
k = np.arange(N) / SR
mix[k > DUR - 2.5] *= np.clip((DUR - k[k > DUR - 2.5]) / 2.5, 0, 1)[:, None]
sf.write("audio_premix.wav", mix.astype(np.float32), SR, subtype='FLOAT')
print("ok", mix.shape)
