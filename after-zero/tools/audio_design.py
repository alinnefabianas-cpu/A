"""Original procedural sound design for AFTER ZERO (no third-party audio).

Builds two stems for a cut: music (dark ambient score) and sfx/ambience.
Cue times come from the episode config ("audio_cues"), so the same code is
reused for every scene. Output: 48 kHz stereo WAV.
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
rng = np.random.default_rng(17)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def fast_lowpass(x, cutoff):
    # FFT brick-ish low-pass with soft roll-off (fast for long buffers)
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, n)


def bandpass(x, lo, hi):
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= (1 / (1 + (f / hi) ** 4)) * (1 / (1 + (lo / np.maximum(f, 1)) ** 4))
    return np.fft.irfft(X, n)


def env(n, a, r):
    e = np.ones(n)
    ai, ri = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    if ai:
        e[:ai] = np.linspace(0, 1, ai)
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def place(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if i < len(buf):
        buf[i:j] += sig[: j - i]


def note(freq):
    return 440.0 * 2 ** ((freq - 69) / 12)


def pad_chord(midi_notes, dur, bright=900):
    t = t_axis(dur)
    out = np.zeros_like(t)
    for m in midi_notes:
        f = note(m)
        for det in (-0.12, 0.0, 0.13):  # detuned voices
            ff = f * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            # soft saw approximation (few harmonics)
            for h in range(1, 6):
                out += np.sin(2 * np.pi * ff * h * t + ph * h) / (h ** 1.6)
    out = fast_lowpass(out, bright)
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.11 * t)
    return out * lfo / (len(midi_notes) * 3)


def city_ambience(dur):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    rumble = fast_lowpass(noise, 220) * 1.6           # distant traffic
    hiss = bandpass(rng.standard_normal(n), 800, 4000) * 0.08
    out = rumble + hiss
    # occasional car pass-bys
    for at in (0.6, 2.4, 4.1):
        d = 2.2
        tt = t_axis(d)
        car = bandpass(rng.standard_normal(len(tt)), 120, 900) * np.sin(np.pi * tt / d) ** 2 * 0.9
        place(out, car, at)
    return out * 0.35


def bird_chirps(dur, count=9):
    out = np.zeros(int(dur * SR))
    for _ in range(count):
        at = rng.uniform(0.1, dur - 0.4)
        d = rng.uniform(0.06, 0.14)
        tt = t_axis(d)
        f0 = rng.uniform(2800, 4200)
        sweep = f0 + rng.uniform(600, 1500) * np.sin(np.pi * tt / d)
        sig = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * tt / d) ** 2
        for k in range(rng.integers(1, 4)):
            place(out, sig * 0.12, at + k * (d + 0.04))
    return out


def wind(dur, level=0.18):
    n = int(dur * SR)
    t = t_axis(dur)
    w = bandpass(rng.standard_normal(n), 150, 1200)
    gust = 0.6 + 0.4 * np.sin(2 * np.pi * 0.17 * t + 1) * np.sin(2 * np.pi * 0.05 * t)
    return w * gust * level


def room_tone(dur):
    return fast_lowpass(rng.standard_normal(int(dur * SR)), 300) * 0.02


def clock_beep():
    tt = t_axis(0.12)
    return np.sin(2 * np.pi * 1975 * tt) * env(len(tt), 0.002, 0.06) * 0.18


def impact(dur=4.0):
    tt = t_axis(dur)
    f = 55 * np.exp(-tt * 1.4) + 28
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.1)
    thud = fast_lowpass(rng.standard_normal(len(tt)), 140) * np.exp(-tt * 6) * 1.5
    return (boom + thud) * 0.75


def riser(dur):
    tt = t_axis(dur)
    n = bandpass(rng.standard_normal(len(tt)), 300, 6000)
    return n * (tt / dur) ** 2.2 * 0.25


def heartbeat_pulse(dur, bpm=58):
    out = np.zeros(int(dur * SR))
    beat = 60 / bpm
    tt = t_axis(0.25)
    thump = np.sin(2 * np.pi * 48 * tt) * np.exp(-tt * 22)
    t = 0.0
    while t < dur - 0.3:
        place(out, thump * 0.5, t)
        place(out, thump * 0.3, t + 0.22)
        t += beat
    return out


def piano_note(m, dur=3.5, vel=0.25):
    tt = t_axis(dur)
    f = note(m)
    sig = sum(np.sin(2 * np.pi * f * h * tt) * (0.6 ** (h - 1)) for h in range(1, 5))
    return sig * np.exp(-tt * 1.3) * env(len(tt), 0.004, 0.3) * vel


def build(cfg, total, out_dir):
    cues = cfg["audio_cues"]
    music = np.zeros(int(total * SR))
    sfx = np.zeros(int(total * SR))

    # --- ambience ---------------------------------------------------------
    cut = cues["silence_at"]
    amb = city_ambience(cut) + bird_chirps(cut)
    amb *= env(len(amb), 1.0, 0.03)  # snaps off -> sudden silence
    place(sfx, amb, 0)
    place(sfx, clock_beep(), cut)
    place(sfx, room_tone(total - cut), cut)
    for a, b, lvl in cues.get("wind", []):
        w = wind(b - a, lvl) * env(int((b - a) * SR), 0.6, 0.6)
        place(sfx, w, a)
    for at in cues.get("impacts", []):
        place(sfx, impact(), at)
    for a, b in cues.get("risers", []):
        place(sfx, riser(b - a), a)

    # --- score: D minor ambient ------------------------------------------
    start = cues["music_start"]
    prog = [[50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]]  # Dm Bb Gm A
    seg = cues.get("chord_len", 6.0)
    t = start
    i = 0
    while t < total:
        d = min(seg + 1.5, total - t)
        chord = pad_chord(prog[i % 4], d, bright=700 + 120 * (i % 3))
        chord *= env(len(chord), 1.2, 1.4)
        place(music, chord, t)
        t += seg
        i += 1
    # low drone under everything after music start
    dr = t_axis(total - start)
    drone = (np.sin(2 * np.pi * note(38) * dr) + 0.5 * np.sin(2 * np.pi * note(26) * dr)) * 0.18
    drone *= env(len(drone), 3.0, 2.0)
    place(music, drone, start)
    # sparse piano motif (the "loneliness" theme)
    motif = [(74, 0.0), (72, 1.6), (69, 3.2), (65, 5.6)]
    for at in cues.get("piano_at", []):
        for m, dt in motif:
            place(music, piano_note(m), at + dt)
    for a, b in cues.get("heartbeat", []):
        place(music, heartbeat_pulse(b - a), a)

    # fades
    fo = cues.get("fade_out", 2.5)
    music[-int(fo * SR):] *= np.linspace(1, 0, int(fo * SR))
    sfx[-int(fo * SR):] *= np.linspace(1, 0, int(fo * SR))

    write_wav(out_dir / "music" / "music_poc.wav", music)
    write_wav(out_dir / "sound_effects" / "sfx_poc.wav", sfx)


def write_wav(path, mono, width=0.35):
    peak = np.max(np.abs(mono)) or 1.0
    mono = mono / peak * 0.89
    # pseudo-stereo: tiny delay on one side for width
    d = int(0.011 * SR)
    left = mono
    right = np.concatenate([np.zeros(d), mono[:-d]]) * width + mono * (1 - width)
    st = np.stack([left, right], axis=1)
    pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    cfg_path = Path(sys.argv[1])
    cfg = json.loads(cfg_path.read_text())
    ep = Path(sys.argv[2])
    total = max(s["start"] + s["dur"] for s in cfg["shots"])
    build(cfg, total, ep)
    print("audio stems written")
