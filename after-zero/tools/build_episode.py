"""Build the full-episode timeline from the shooting script + synthesized voice lines.

Outputs
  animation/src/episode.json                    shots for Remotion (frame-accurate)
  project/<ep>/voiceover/full_vo.wav            dialogue/narration track (48 kHz stereo)
  project/<ep>/subtitles/<ep>_full.en.srt       English subtitles
  project/<ep>/storyboard/<ep>_full_shotlist.md human-readable shot list with timecodes
  project/<ep>/renders/_cues.json               shot list with times for the sound design

usage: python3 tools/build_episode.py project/episode_001/script/episode_001_full.py
"""
import json
import runpy
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SR = 48000
LEAD, TAIL = 0.45, 0.8          # breathing room around each spoken line (s)
CHAPTER_DUR = 4.0


def read_wav(path):
    with wave.open(str(path)) as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    a = np.frombuffer(raw, dtype="<i2" if sw == 2 else "<i4").astype(np.float32)
    a /= 32768.0 if sw == 2 else 2147483648.0
    if ch > 1:
        a = a.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        x = np.arange(int(len(a) * SR / sr)) * (sr / SR)
        a = np.interp(x, np.arange(len(a)), a).astype(np.float32)
    return a


def read_any(path):
    # Kokoro writes float WAV via soundfile; read with soundfile when available
    try:
        import soundfile as sf
        a, sr = sf.read(str(path), dtype="float32")
        if a.ndim > 1:
            a = a.mean(axis=1)
        if sr != SR:
            x = np.arange(int(len(a) * SR / sr)) * (sr / SR)
            a = np.interp(x, np.arange(len(a)), a).astype(np.float32)
        return a
    except ImportError:
        return read_wav(path)


def fft_band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (f / hi) ** 6)) * (1 / (1 + (lo / np.maximum(f, 1)) ** 6))
    return np.fft.irfft(X, len(x)).astype(np.float32)


rng = np.random.default_rng(3)


def radio_fx(a):
    """walkie-talkie: band-limit, saturate, crackle, slight warble"""
    y = fft_band(a, 350, 3200) * 2.2
    y = np.tanh(y * 1.8) * 0.6
    t = np.arange(len(y)) / SR
    y *= 0.85 + 0.15 * np.sin(2 * np.pi * 5.3 * t)
    hiss = fft_band(rng.standard_normal(len(y)).astype(np.float32), 1000, 6000) * 0.035
    crack = (rng.random(len(y)) > 0.9993) * rng.standard_normal(len(y)) * 0.25
    return (y + hiss + crack).astype(np.float32)


def monitor_fx(a):
    y = fft_band(a, 180, 6500) * 1.3
    return (np.tanh(y * 1.2) * 0.8).astype(np.float32)


def srt_time(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    ms = int(round((s % 1) * 1000))
    if ms == 1000:
        ms = 999
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{ms:03d}"


def chunks(text, maxlen=84):
    """split a line into subtitle-sized chunks at sentence/comma boundaries"""
    import re
    parts = re.split(r"(?<=[.?!…])\s+", text.strip())
    out = []
    for prt in parts:
        while len(prt) > maxlen:
            cut = prt.rfind(", ", 0, maxlen)
            cut = cut + 1 if cut > 20 else prt.rfind(" ", 0, maxlen)
            out.append(prt[:cut].strip())
            prt = prt[cut:].strip()
        if prt:
            out.append(prt)
    merged = []
    for c in out:
        if merged and len(merged[-1]) + len(c) + 1 <= maxlen and len(c) < 28:
            merged[-1] += " " + c
        else:
            merged.append(c)
    return merged


def main():
    script = Path(sys.argv[1]).resolve()
    ep = script.parent.parent
    epname = ep.name
    mod = runpy.run_path(str(script))
    S, CH = mod["S"], mod["CHAPTERS"]
    manifest = json.loads((ep / "voiceover" / "full" / "manifest.json").read_text())

    shots, cues, subs, md = [], [], [], []
    vo_events = []  # (start_s, path, speaker)
    t = 0.0
    frame = 0

    def add(visual, p, dur_s, speaker="-", text="", talk=None, scene=0):
        nonlocal t, frame
        f0 = frame
        f1 = int(round((t + dur_s) * FPS))
        shot = {"from": f0, "dur": f1 - f0, "visual": visual, "p": p}
        if talk:
            shot["talk"] = talk
        shots.append(shot)
        cues.append({"start": t, "dur": dur_s, "visual": visual, "p": p, "speaker": speaker, "scene": scene})
        md.append(f"| {len(shots):03d} | {srt_time(t)[:8]} | {dur_s:4.1f}s | {visual} | {speaker if speaker != '-' else ''} {text[:90]} |")
        t += dur_s
        frame = f1

    for si, sc in enumerate(S):
        if si > 0:
            title = CH[si]
            add("chapter", {"num": si, "title": title}, CHAPTER_DUR, scene=si)
        for bi, (spk, text, visual, p) in enumerate(sc):
            p = dict(p)
            if spk == "-" or not text:
                add(visual, p, p.get("dur", 2.5), scene=si)
                continue
            info = manifest[f"{si}.{bi}"]
            d = info["dur"]
            dur = LEAD + d + TAIL + p.get("tail", 0.0)
            on_screen = {"CARTER": "monitor", "NOAH": "profile", "INGRID": "ingrid", "TOMAS": "tomas", "ROSA": "rosa"}.get(spk)
            talk = None
            if on_screen == visual:
                talk = {"from": int(LEAD * FPS), "to": int((LEAD + d) * FPS), "speaker": spk}
            vo_events.append((t + LEAD, ep / info["file"], spk))
            # subtitles
            parts = chunks(text)
            total_chars = sum(len(c) for c in parts)
            ts = t + LEAD
            for c in parts:
                cd = d * len(c) / total_chars
                label = c if spk in ("N",) else c
                subs.append((ts, ts + cd, label))
                ts += cd
            add(visual, p, dur, spk, text, talk, si)

    total = t
    # ---------- voice track
    vo = np.zeros(int((total + 1) * SR), dtype=np.float32)
    for start, path, spk in vo_events:
        a = read_any(path)
        if spk in ("RADIO", "SIS", "BASE", "HELI"):
            a = radio_fx(a)
        elif spk in ("CARTER", "WALTER"):
            a = monitor_fx(a)
        elif spk == "NOAH":
            a = a * 0.95
        i = int(start * SR)
        vo[i:i + len(a)] += a[: len(vo) - i]
    peak = np.max(np.abs(vo)) or 1
    vo = vo / peak * 0.9
    st = np.stack([vo, vo], axis=1)
    out_vo = ep / "voiceover" / "full_vo.wav"
    with wave.open(str(out_vo), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype("<i2").tobytes())

    # ---------- subtitles
    srt = ep / "subtitles" / f"{epname}_full.en.srt"
    fixed = []
    for i, (a, b, txt) in enumerate(subs):
        nxt = subs[i + 1][0] if i + 1 < len(subs) else b + 1
        fixed.append((a, min(b + 0.15, nxt - 0.04), txt))
    srt.write_text("\n".join(f"{i}\n{srt_time(a)} --> {srt_time(b)}\n{txt}\n" for i, (a, b, txt) in enumerate(fixed, 1)))

    # ---------- timeline for Remotion + cues
    (ROOT / "animation" / "src" / "episodes" / f"{epname}.json").write_text(json.dumps({"fps": FPS, "totalFrames": frame, "shots": shots}))
    (ep / "renders").mkdir(exist_ok=True)
    (ep / "renders" / "_cues.json").write_text(json.dumps({"total": total, "shots": cues, "moods": mod.get("MOOD_MAP")}, indent=0))
    (ep / "storyboard" / f"{epname}_full_shotlist.md").write_text(
        f"# {epname} — full shot list ({total/60:.1f} min, {len(shots)} shots)\n\n| # | TC | dur | set | line |\n|---|---|---|---|---|\n" + "\n".join(md) + "\n")
    print(f"timeline: {len(shots)} shots, {total/60:.2f} min ({frame} frames), {len(subs)} subtitle cues")


if __name__ == "__main__":
    main()
