"""Original score + sound effects for a full episode, driven by renders/_cues.json.

Everything is synthesized here (no samples, no third-party audio).
usage: python3 tools/audio_full.py project/episode_001
-> music/music_full.wav, sound_effects/sfx_full.wav (48 kHz stereo)
"""
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import audio_design as A  # noqa: E402  (reuses the POC synth building blocks)

SR = A.SR
rng = np.random.default_rng(23)

# chord progressions (MIDI) and colour per scene/chapter
D_MIN = [[50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]]
MOODS = {
    0: dict(prog=D_MIN, bright=750, piano=True, level=1.0),
    1: dict(prog=[[50, 57, 62, 65], [46, 53, 58, 62], [41, 48, 53, 57], [48, 55, 60, 64]], bright=800, piano=True, level=0.9),
    2: dict(prog=[[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]], bright=950, piano=False, level=0.85),
    3: dict(prog=[[38, 50, 57, 62], [43, 50, 55, 58], [38, 50, 57, 62], [39, 51, 58, 63]], bright=520, piano=False, level=0.8, pulse=True),
    4: dict(prog=[[41, 48, 53, 57], [48, 55, 60, 64], [50, 57, 62, 65], [46, 53, 58, 62]], bright=1000, piano=True, level=0.9),
    5: dict(prog=[[50, 57, 62, 65], [51, 58, 63, 66], [50, 57, 62, 65], [49, 56, 61, 64]], bright=650, piano=False, level=0.85, pulse=True),
    6: dict(prog=[[50, 57, 62, 66], [45, 52, 57, 61], [47, 54, 59, 62], [43, 50, 55, 59]], bright=1300, piano=True, level=0.95),
    7: dict(prog=[[48, 55, 60, 63], [44, 51, 56, 60], [41, 48, 53, 56], [43, 50, 55, 59]], bright=600, piano=False, level=0.85),
    8: dict(prog=[[48, 55, 60, 63], [44, 51, 56, 60], [46, 53, 58, 61], [43, 50, 55, 59]], bright=650, piano=False, level=0.85, pulse=True),
    9: dict(prog=[[46, 53, 58, 62], [41, 48, 53, 57], [43, 50, 55, 58], [39, 46, 51, 55]], bright=850, piano=True, level=0.95),
    10: dict(prog=[[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]], bright=1200, piano=False, level=1.0, shimmer=True),
    11: dict(prog=[[50, 57, 62, 66], [45, 52, 57, 61], [47, 54, 59, 62], [43, 50, 55, 59]], bright=1300, piano=True, level=1.0),
}


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(sig) <= 0:
        return
    j = min(len(buf), i + len(sig))
    buf[max(0, i):j] += (sig[max(0, -i): j - i] * gain).astype(np.float32)


def noise(d):
    return rng.standard_normal(int(d * SR)).astype(np.float32)


def env(n, a, r):
    return A.env(n, a, r).astype(np.float32)


def static(d, level=0.25):
    n = noise(d)
    y = A.bandpass(n, 400, 7000) * level
    crack = (rng.random(len(n)) > 0.9985) * rng.standard_normal(len(n)) * level * 3
    return (y + crack).astype(np.float32)


def rain(d, level=0.3):
    n = noise(d)
    y = A.bandpass(n, 600, 9000) * level
    drops = (rng.random(len(n)) > 0.997) * rng.standard_normal(len(n)) * level * 2
    return (y + A.fast_lowpass(drops, 3000)).astype(np.float32)


def hum(d, f=60, level=0.05):
    t = np.arange(int(d * SR)) / SR
    return ((np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) + 0.2 * np.sin(2 * np.pi * 3 * f * t)) * level).astype(np.float32)


def beep(f=1000, d=0.09, level=0.12):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * t) * env(len(t), 0.003, d * 0.6) * level).astype(np.float32)


def ring_tone(d, level=0.08):
    t = np.arange(int(d * SR)) / SR
    tone = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * level
    gate = ((t % 3.0) < 1.6).astype(np.float32)
    return (tone * gate).astype(np.float32)


def crackle(d, level=0.25):
    out = A.fast_lowpass(noise(d), 500) * 0.15 * level
    pops = (rng.random(int(d * SR)) > 0.9992) * rng.standard_normal(int(d * SR)) * level * 1.5
    return (out + A.bandpass(pops, 800, 6000)).astype(np.float32)


def steps(d, every=0.52, level=0.12):
    out = np.zeros(int(d * SR), dtype=np.float32)
    tt = np.arange(int(0.08 * SR)) / SR
    thump = (A.fast_lowpass(rng.standard_normal(len(tt)), 700) * np.exp(-tt * 60)).astype(np.float32)
    k = 0.1
    while k < d - 0.1:
        place(out, thump, k, level * (0.8 + 0.4 * rng.random()))
        k += every * (0.95 + 0.1 * rng.random())
    return out


def glitch(d, level=0.2):
    out = np.zeros(int(d * SR), dtype=np.float32)
    for _ in range(int(d * 8)):
        at = rng.random() * d
        g = A.bandpass(noise(0.03 + rng.random() * 0.08), 1000, 8000) * level
        place(out, g, at)
    return out


def shimmer(d, level=0.05):
    t = np.arange(int(d * SR)) / SR
    y = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) * (0.5 + 0.5 * np.sin(2 * np.pi * (0.1 + 0.07 * i) * t)) for i, f in enumerate([1760, 2217, 2637, 3322, 3520]))
    return (y * level * env(len(t), 1.0, 1.0)).astype(np.float32)


def eas_tone(d=1.2, level=0.06):
    t = np.arange(int(d * SR)) / SR
    return ((np.sin(2 * np.pi * 853 * t) + np.sin(2 * np.pi * 960 * t)) * level * env(len(t), 0.01, 0.1)).astype(np.float32)


def soft_boom(level=0.4):
    return (A.impact(3.0) * level).astype(np.float32)


def build(ep):
    cues = json.loads((ep / "renders" / "_cues.json").read_text())
    total = cues["total"]
    shots = cues["shots"]
    N = int((total + 2) * SR)
    music = np.zeros(N, dtype=np.float32)
    sfx = np.zeros(N, dtype=np.float32)

    # ---------------- SFX per shot
    for s in shots:
        v, p, t0, d = s["visual"], s["p"], s["start"], s["dur"]
        n = int(d * SR)
        fade = lambda x: x * env(len(x), 0.25, 0.25)  # noqa: E731
        if v == "city" and p.get("sfx") == "city":
            amb = A.city_ambience(d) + A.bird_chirps(d)
            place(sfx, amb.astype(np.float32) * env(int(d * SR), 0.8, 0.0), t0)
        elif v == "clock":
            amb = (A.city_ambience(1.2) + A.bird_chirps(1.2)).astype(np.float32)
            place(sfx, amb * env(len(amb), 0.0, 0.02), t0)
            place(sfx, beep(1975, 0.12, 0.18), t0 + 1.2)
            place(sfx, A.room_tone(d - 1.2).astype(np.float32), t0 + 1.2)
        elif v in ("street", "noahStreet", "streetWide", "trafficLight", "obsExt", "skyRing", "sunriseEnding", "rooftop", "city", "journey"):
            if p.get("time") == "rain":
                place(sfx, fade(rain(d, 0.35)), t0)
            else:
                lvl = 0.22 if v in ("obsExt", "skyRing", "journey") else 0.14
                place(sfx, fade(A.wind(d, lvl).astype(np.float32)), t0)
            if v == "journey" and p.get("stage") == "fields":
                place(sfx, A.bird_chirps(d, count=int(d * 2)).astype(np.float32), t0)
            if v in ("noahStreet", "journey", "streetWide"):
                place(sfx, steps(d), t0)
            if v == "trafficLight":
                place(sfx, beep(1500, 0.05, 0.06), t0 + d * 0.55)
        elif v == "hospital":
            k = 0.3
            while k < d:
                place(sfx, beep(1000, 0.08, 0.08), t0 + k)
                k += 1.0
            if p.get("noah"):
                place(sfx, steps(d, 0.6, 0.1), t0)
        elif v == "police":
            place(sfx, ring_tone(d), t0)
        elif v == "subway":
            place(sfx, fade(hum(d, 50, 0.04) + A.fast_lowpass(noise(d), 200) * 0.05), t0)
            place(sfx, beep(660, 0.25, 0.05), t0 + 0.6)
            place(sfx, beep(523, 0.35, 0.05), t0 + 0.9)
        elif v == "supermarket":
            place(sfx, fade(hum(d, 120, 0.012) + A.room_tone(d).astype(np.float32)), t0)
        elif v == "tv":
            st = p.get("state")
            if st == "broadcast":
                place(sfx, eas_tone(1.4), t0 + 0.2)
                place(sfx, fade(hum(d, 60, 0.02)), t0)
            elif st == "static":
                place(sfx, static(d, 0.18) * env(n, 0.02, 0.2), t0)
            else:
                place(sfx, beep(15000, 0.3, 0.02) + 0, t0)
                place(sfx, fade(hum(d, 60, 0.02)), t0)
        elif v == "radioClose":
            st = p.get("state")
            lvl = {"search": 0.16, "voice": 0.05, "led": 0.07, "dead": 0.0}.get(st, 0.1)
            if lvl:
                place(sfx, static(d, lvl) * env(n, 0.05, 0.1), t0)
            if st == "dead":
                place(sfx, beep(300, 0.04, 0.1), t0 + 0.1)
        elif v == "campfire":
            place(sfx, fade(crackle(d)), t0)
            place(sfx, fade(A.wind(d, 0.06).astype(np.float32)), t0)
        elif v == "obsInt":
            place(sfx, fade(hum(d, 55, 0.025)), t0)
            if p.get("flicker"):
                place(sfx, glitch(d, 0.08), t0)
        elif v == "monitor":
            place(sfx, fade(hum(d, 60, 0.015)), t0)
            if p.get("press"):
                place(sfx, beep(2000, 0.02, 0.15), t0 + d * 0.6)
            if p.get("mode") == "glitch" or p.get("glitch"):
                place(sfx, glitch(min(d, 2.0), 0.2), t0 + max(0, d - 2.0))
        elif v == "dataScreen":
            if p.get("kind") == "text":
                k = 0.2
                for _ in range(len(p.get("text", "")) + len(p.get("text2", ""))):
                    place(sfx, beep(2400, 0.015, 0.04), t0 + k)
                    k += 1.6 / 30
            if p.get("kind") == "spike":
                place(sfx, soft_boom(0.35), t0 + d * 0.45)
        elif v == "screensAll":
            for i in range(24):
                place(sfx, beep(800 + (i % 5) * 120, 0.03, 0.05), t0 + 0.2 + (i % 7) * 0.07)
        elif v == "tally":
            place(sfx, A.bandpass(noise(0.25), 1500, 6000) * 0.06, t0 + 0.4)
        elif v == "chapter":
            place(sfx, soft_boom(0.22), t0 + 0.1)
        elif v == "phone" and p.get("screen") == "calls":
            place(sfx, beep(440, 1.0, 0.03), t0 + 0.2)
            place(sfx, beep(480, 0.2, 0.06), t0 + 1.6)
        # ---- episode 002 (bunker) sets
        if v in ("corridor", "rubble", "storage", "bunk", "desk", "journal", "tallyWall", "blastDoor", "waterTank", "ventShaft", "tunnel", "bunkerStairs"):
            place(sfx, fade(A.fast_lowpass(noise(d), 160) * 0.05 + hum(d, 50, 0.006)), t0)   # underground room tone
            k = 0.4 + rng.random()
            while k < d:   # water drips
                place(sfx, beep(1400 + rng.random() * 600, 0.03, 0.05), t0 + k)
                k += 1.5 + rng.random() * 2.5
        if v in ("generator",) or (v == "corridor" and p.get("light") == "on"):
            st = p.get("state", "running")
            if st in ("running", "failing") or v == "corridor":
                g = (hum(d, 30, 0.12) + A.fast_lowpass(noise(d), 300) * 0.12) * (0.4 if v == "corridor" else 1.0)
                if st == "failing":
                    g *= np.clip(1.2 - np.arange(len(g)) / len(g) * 2.2, 0, 1).astype(np.float32)
                place(sfx, fade(g.astype(np.float32)), t0)
            if p.get("noah") and st == "off":
                k = 0.5
                while k < d - 0.5:
                    place(sfx, A.bandpass(noise(0.35), 300, 3000) * 0.08, t0 + k)
                    k += 1.3
        if v == "corridor" and (p.get("quake") or p.get("rumble")):
            q = p.get("quake", 0.3)
            place(sfx, (A.fast_lowpass(noise(d), 90) * 0.9 * q * env(n, 0.5, 0.8)).astype(np.float32), t0)
        if v == "rubble" and p.get("falling"):
            place(sfx, A.impact(4.0).astype(np.float32), t0 + 0.1)
            place(sfx, (A.bandpass(noise(d), 200, 3000) * 0.3 * env(n, 0.05, d * 0.7)).astype(np.float32), t0)
        if v == "airFilter":
            t_ = np.arange(n) / SR
            place(sfx, fade((A.bandpass(noise(d), 300, 2500) * 0.12 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.8 * t_))).astype(np.float32)), t0)
        if v == "tunnel" and p.get("noah", True) and p.get("progress", 0) > 0:
            k = 0.3
            while k < d - 0.2:
                place(sfx, (A.fast_lowpass(noise(0.12), 900) * np.exp(-np.arange(int(0.12 * SR)) / SR * 30) * 0.5).astype(np.float32), t0 + k)
                k += 0.95
            if p.get("cavein"):
                place(sfx, A.impact(4.0).astype(np.float32), t0 + d * 0.3)
        if v == "blastDoor" and (p.get("turning") or p.get("open")):
            place(sfx, (A.bandpass(noise(min(d, 3.0)), 400, 1800) * 0.15).astype(np.float32), t0 + 0.4)
        if v == "ventShaft":
            place(sfx, fade(A.wind(d, 0.12).astype(np.float32)), t0)
        if v in ("surfaceDawn", "rescue", "bunkerEntrance"):
            place(sfx, fade(A.wind(d, 0.1).astype(np.float32)), t0)
            if v != "bunkerEntrance" or p.get("time") == "day":
                place(sfx, A.bird_chirps(d, count=int(d * 2.5)).astype(np.float32), t0)
        if v == "breakthrough":
            place(sfx, shimmer(d, 0.03), t0)
            if p.get("phase") == "crack":
                place(sfx, A.bandpass(noise(0.4), 300, 3000) * 0.2, t0 + d * 0.6)
        if v == "watch":
            k = 0.2
            while k < d:
                place(sfx, beep(4000, 0.01, 0.05), t0 + k)
                k += 1.0
        if v == "phoneCall":
            place(sfx, fade(hum(d, 120, 0.01)), t0)
        # ---- episode 003 (arctic) sets
        arctic_out = ("iceWalk", "iceVista", "iceCrack", "wreck", "snowWall", "bear", "iceRidge", "station", "aurora", "flare", "heli")
        if v in arctic_out:
            storm = p.get("time") == "storm" or v == "iceRidge"
            if storm:
                b = A.bandpass(noise(d), 200, 5000) * 0.45
                t_ = np.arange(n) / SR
                b *= (0.7 + 0.3 * np.sin(2 * np.pi * 0.13 * t_) * np.sin(2 * np.pi * 0.31 * t_)).astype(np.float32)
                place(sfx, fade(b.astype(np.float32)), t0)
            else:
                place(sfx, fade(A.wind(d, 0.12 if v != "aurora" else 0.05).astype(np.float32)), t0)
            if v in ("iceWalk", "iceRidge", "snowWall"):
                k = 0.2
                while k < d - 0.2:   # crunching snow steps
                    place(sfx, (A.bandpass(noise(0.14), 1500, 7000) * np.exp(-np.arange(int(0.14 * SR)) / SR * 25) * 0.18).astype(np.float32), t0 + k)
                    k += 0.6 if not p.get("slow") else 0.9
        if v == "iceCrack" and not p.get("calm"):
            place(sfx, A.impact(4.0).astype(np.float32) * 0.9, t0 + 0.15)
            place(sfx, (A.bandpass(noise(1.2), 80, 1500) * 0.4 * env(int(1.2 * SR), 0.01, 1.0)).astype(np.float32), t0 + 0.1)
        if v == "iceCrack" and p.get("calm"):
            for k in (1.0, 2.6):
                place(sfx, (A.fast_lowpass(noise(1.5), 120) * 0.25 * env(int(1.5 * SR), 0.3, 1.0)).astype(np.float32), t0 + k)
        if v in ("planeSky", "planeInterior", "ingrid") and (v != "ingrid" or p.get("mode") == "cockpit"):
            t_ = np.arange(n) / SR
            eng = (np.sin(2 * np.pi * 82 * t_) * 0.5 + np.sin(2 * np.pi * 164 * t_) * 0.25) * 0.12 + A.fast_lowpass(noise(d), 400) * 0.1
            place(sfx, fade(eng.astype(np.float32)), t0)
            if p.get("time") == "storm" or p.get("shake"):
                place(sfx, fade((A.bandpass(noise(d), 200, 4000) * 0.3).astype(np.float32)), t0)
        if v == "crash":
            place(sfx, (A.bandpass(noise(d), 100, 3000) * 0.5 * env(n, 0.3, 0.2)).astype(np.float32), t0)
            place(sfx, A.impact(4.0).astype(np.float32), t0 + d * 0.72)
        if v in ("cabinNight",) or (v == "ingrid" and p.get("mode") == "cabin"):
            if p.get("stove", True):
                place(sfx, fade((A.bandpass(noise(d), 300, 2500) * 0.05).astype(np.float32)), t0)   # stove hiss
            place(sfx, fade(A.wind(d, 0.05).astype(np.float32)), t0)
        if v == "flare":
            place(sfx, A.impact(2.0).astype(np.float32) * 0.6, t0 + 0.3)
            place(sfx, (A.bandpass(noise(d - 0.4), 1000, 8000) * 0.2 * env(int((d - 0.4) * SR), 0.05, 1.0)).astype(np.float32), t0 + 0.4)
        if v in ("heli", "heliInt", "heliView"):
            t_ = np.arange(n) / SR
            chop = (A.fast_lowpass(noise(d), 250) * (0.5 + 0.5 * (np.sin(2 * np.pi * 5.5 * t_) > 0.6))).astype(np.float32) * 0.5
            place(sfx, fade(chop), t0)
        if v == "thermo":
            place(sfx, fade(A.wind(d, 0.1).astype(np.float32)), t0)
        if v == "bear" and p.get("dist") == "close":
            place(sfx, (A.fast_lowpass(noise(d), 180) * 0.2 * env(n, 0.5, 0.5)).astype(np.float32), t0)
        # ---- episode 004 (amazon) sets
        jungle_vis = ("jungle", "kapok", "macaw", "monkeys", "shelter", "vine", "waterLeaf", "treeMark", "camp", "canopy", "igapo", "raft", "gps")
        if v in jungle_vis or (v in ("tomas", "rosa") and p.get("mode") in ("night", "village")):
            tt = p.get("time", "day")
            if tt == "storm" or v == "waterLeaf":
                place(sfx, fade(rain(d, 0.45 if tt == "storm" else 0.2)), t0)
                if tt == "storm":
                    for k in np.arange(0.8, d, 3.5 + rng.random() * 2):
                        place(sfx, A.impact(3.5).astype(np.float32) * 0.5, t0 + k)
            else:
                t_ = np.arange(n) / SR
                bug = A.bandpass(noise(d), 4000, 9000) * 0.05 * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t_))
                place(sfx, fade(bug.astype(np.float32)), t0)
                place(sfx, A.bird_chirps(d, count=int(d * 1.5)).astype(np.float32) * 0.8, t0)
            if p.get("treefall"):
                place(sfx, A.impact(4.0).astype(np.float32), t0 + d * 0.43)
                place(sfx, (A.bandpass(noise(1.6), 300, 4000) * 0.4 * env(int(1.6 * SR), 0.1, 1.2)).astype(np.float32), t0 + d * 0.25)
        if v in ("campNight", "caiman") or (v == "shelter" and p.get("night")) or (v == "igapo" and p.get("time") == "night") or (v == "riverWide" and p.get("time") == "night"):
            t_ = np.arange(n) / SR
            frogs = sum(np.sin(2 * np.pi * f * t_) * (np.sin(2 * np.pi * r_ * t_) > 0.7) for f, r_ in ((900, 3.1), (1400, 4.7), (620, 2.3))) * 0.025
            crick = A.bandpass(noise(d), 4500, 8000) * 0.05 * (np.sin(2 * np.pi * 18 * t_) > 0)
            place(sfx, fade((frogs + crick).astype(np.float32)), t0)
        if v in ("riverBoat",) or (v == "tomas" and p.get("mode") == "boat"):
            t_ = np.arange(n) / SR
            mot = (np.sin(2 * np.pi * 55 * t_) * 0.4 + np.sin(2 * np.pi * 110 * t_) * 0.2) * 0.1 + A.fast_lowpass(noise(d), 600) * 0.08
            place(sfx, fade(mot.astype(np.float32) * (1.6 if p.get("racing") else 1.0)), t0)
        if v in ("riverWide", "raft", "rosaCanoe", "village", "igapo", "riverBoat") or (v == "rosa"):
            place(sfx, fade((A.bandpass(noise(d), 150, 1200) * 0.06).astype(np.float32)), t0)   # water
            if v == "riverWide" and p.get("time") == "storm":
                place(sfx, fade(rain(d, 0.4)), t0)
            if v == "riverWide" and p.get("time") == "dawn":
                t_ = np.arange(int(3.0 * SR)) / SR
                howl = (A.fast_lowpass(noise(3.0), 400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.6 * t_)) * 0.5 * env(len(t_), 0.4, 1.0)).astype(np.float32)
                place(sfx, howl, t0 + 0.5)
        if v == "monkeys":
            t_ = np.arange(int(2.5 * SR)) / SR
            place(sfx, (A.fast_lowpass(noise(2.5), 500) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.8 * t_)) * 0.4 * env(len(t_), 0.3, 0.8)).astype(np.float32), t0 + 0.6)
        if v in ("macaw", "kapok") and (v == "macaw" or p.get("birds")):
            for k in (0.4, 1.4, 2.6):
                tt_ = np.arange(int(0.35 * SR)) / SR
                cry = np.sign(np.sin(2 * np.pi * (900 + 400 * np.sin(2 * np.pi * 6 * tt_)) * tt_)) * env(len(tt_), 0.01, 0.2) * 0.05
                place(sfx, A.bandpass(cry.astype(np.float32), 600, 4000), t0 + k)
        if v == "vine":
            place(sfx, (A.bandpass(noise(0.2), 1500, 6000) * 0.25).astype(np.float32), t0 + d * 0.35)
            place(sfx, fade((A.bandpass(noise(d * 0.6), 800, 5000) * 0.08).astype(np.float32)), t0 + d * 0.38)
        if v == "fever":
            t_ = np.arange(n) / SR
            place(sfx, fade((np.sin(2 * np.pi * 220 * t_ + 3 * np.sin(2 * np.pi * 0.3 * t_)) * 0.03 + A.fast_lowpass(noise(d), 200) * 0.08).astype(np.float32)), t0)
            place(sfx, A.heartbeat_pulse(d, 96).astype(np.float32) * 0.5, t0)
        # ---- episode 005 (phase two) sets
        if v == "countdown":
            k = 0.1
            while k < d:
                place(sfx, beep(1200, 0.02, 0.06), t0 + k)
                k += 1.0
        if v == "keyboard":
            k = 0.1
            for _ in range(len(p.get("text", ""))):
                place(sfx, (A.bandpass(noise(0.03), 2000, 7000) * 0.2).astype(np.float32), t0 + k)
                k += 4 / 30
        if v == "earthCore":
            t_ = np.arange(n) / SR
            place(sfx, fade((np.sin(2 * np.pi * 40 * t_) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.6 * t_)) * 0.2).astype(np.float32)), t0)
        if v == "earthOrbit":
            place(sfx, fade((A.fast_lowpass(noise(d), 120) * 0.25).astype(np.float32)), t0)
            if p.get("cocoon"):
                place(sfx, shimmer(d, 0.03), t0)
        if v == "solarStorm" and not p.get("calm"):
            t_ = np.arange(n) / SR
            hum_ = (np.sin(2 * np.pi * 60 * t_) * 0.1 * np.linspace(0.3, 1.0, n)).astype(np.float32)
            place(sfx, fade(hum_), t0)
            if p.get("phase") == "sparks":
                place(sfx, glitch(d, 0.25), t0)
        if v == "crowd" and p.get("phase") in ("appear", "full"):
            start = d * 0.35 if p.get("phase") == "appear" else 0
            dd = d - start
            murmur = (A.bandpass(noise(dd), 250, 2500) * 0.18 + A.fast_lowpass(noise(dd), 180) * 0.15).astype(np.float32)
            place(sfx, murmur * env(int(dd * SR), 0.05, 0.3), t0 + start)
            if p.get("phase") == "appear":
                place(sfx, A.impact(2.0).astype(np.float32) * 0.5, t0 + start)
        if v == "crowd" and p.get("phase") == "shimmer":
            place(sfx, shimmer(d, 0.04), t0)
        if v == "city" and p.get("traffic"):
            place(sfx, fade(A.city_ambience(d).astype(np.float32) * 1.4), t0)
            place(sfx, beep(420, 0.4, 0.04), t0 + d * 0.4)
        if v == "door":
            for k in (d * 0.7, d * 0.7 + 0.25, d * 0.7 + 0.5):
                place(sfx, (A.fast_lowpass(noise(0.08), 600) * np.exp(-np.arange(int(0.08 * SR)) / SR * 40) * 0.6).astype(np.float32), t0 + k)
        if v in ("sister", "hug", "carterRoom"):
            place(sfx, fade(A.room_tone(d).astype(np.float32) * 2), t0)
        if p.get("impact"):
            place(sfx, A.impact().astype(np.float32), t0 + d * p["impact"])
        if v == "skyRing":
            place(sfx, shimmer(d, 0.035), t0)

    # ---------------- music per scene
    scene_spans = {}
    for s in shots:
        sc = s["scene"]
        a, b = scene_spans.get(sc, (s["start"], s["start"] + s["dur"]))
        scene_spans[sc] = (min(a, s["start"]), max(b, s["start"] + s["dur"]))
    # intro: music starts after the clock (first voiced shot)
    first_vo = next(s["start"] for s in shots if s["speaker"] != "-")
    scene_spans[0] = (first_vo - 0.2, scene_spans[0][1])
    # silence the score during the blackout beats of the twist
    black = [(s["start"], s["start"] + s["dur"]) for s in shots if s["visual"] == "black"]

    mood_map = cues.get("moods")
    for sc, (a, b) in sorted(scene_spans.items()):
        m = MOODS.get(mood_map[sc] if mood_map else sc, MOODS[0])
        seg = 6.0
        t = a
        i = 0
        while t < b:
            d = min(seg + 1.5, b - t + 1.5)
            chord = A.pad_chord(m["prog"][i % 4], d, bright=m["bright"] + 100 * (i % 3)).astype(np.float32)
            chord *= env(len(chord), 1.4, 1.5) * m["level"]
            place(music, chord, t)
            t += seg
            i += 1
        dt = np.arange(int((b - a + 1.5) * SR)) / SR
        root = m["prog"][0][0]
        drone = (np.sin(2 * np.pi * A.note(root - 12) * dt) + 0.5 * np.sin(2 * np.pi * A.note(root - 24) * dt)) * 0.16
        place(music, (drone * env(len(dt), 2.5, 2.5)).astype(np.float32), a)
        if m.get("piano"):
            motif = [(74, 0.0), (72, 1.6), (69, 3.2), (65, 5.6)] if sc not in (6, 11) else [(74, 0.0), (76, 1.6), (78, 3.2), (81, 5.6)]
            k = a + 2.0
            while k < b - 8:
                for nn, dd in motif:
                    place(music, A.piano_note(nn).astype(np.float32), k + dd)
                k += 26.0
        if m.get("pulse"):
            place(music, A.heartbeat_pulse(b - a).astype(np.float32) * 0.7, a)
        if m.get("shimmer"):
            place(music, shimmer(b - a, 0.02), a)

    for a, b in black:
        i, j = int(a * SR), int(b * SR)
        ramp = int(0.08 * SR)
        music[i:i + ramp] *= np.linspace(1, 0, ramp)
        music[i + ramp:j] = 0
        music[j:j + ramp] *= np.linspace(0, 1, ramp)
    # gentle fade out
    fo = int(4 * SR)
    end = int(total * SR)
    music[end - fo:end] *= np.linspace(1, 0, fo)
    music[end:] = 0
    sfx[end - fo:end] *= np.linspace(1, 0, fo)
    sfx[end:] = 0

    A.write_wav(ep / "music" / "music_full.wav", music)
    A.write_wav(ep / "sound_effects" / "sfx_full.wav", sfx)
    print(f"audio stems written for {total/60:.1f} min")


if __name__ == "__main__":
    build(Path(sys.argv[1]).resolve())
