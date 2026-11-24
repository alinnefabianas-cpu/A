"""Free, local neural TTS for every spoken beat of an episode script (Kokoro-82M, Apache-2.0).

usage: <venv>/bin/python tools/tts_kokoro.py project/episode_001/script/episode_001_full.py
Writes voiceover/full/<hash>.wav (cached: unchanged lines are not re-synthesised)
and voiceover/full/manifest.json  {beat_key: {file, dur}}.
"""
import hashlib
import json
import runpy
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SR = 24000
# speaker -> (pipeline lang, voice, speed)
VOICES = {
    "N": ("b", "bm_george", 0.9),      # narrator: calm British documentary voice
    "NOAH": ("a", "am_michael", 0.98),  # Noah, 27, American
    "CARTER": ("b", "bf_emma", 1.0),    # Dr. Elena Carter
    "SIS": ("a", "af_heart", 0.92),     # Noah's sister (through the radio)
    "RADIO": ("a", "am_fenrir", 0.88),  # unknown voice (through the radio)
    "WALTER": ("b", "bm_lewis", 0.88),   # Walter Hale, 1962 station officer (journal)
    "RESCUER": ("a", "am_eric", 1.0),    # forestry worker
    "INGRID": ("b", "bf_isabella", 0.92),  # Ingrid Halvorsen, bush pilot (ep 3)
    "BASE": ("a", "am_adam", 1.0),       # Nordhavn station radio
    "HELI": ("a", "am_eric", 1.0),       # rescue helicopter pilot (radio)
    "TOMAS": ("a", "am_liam", 0.95),     # Tomás, river guide (ep 4)
    "ROSA": ("a", "af_sarah", 0.9),      # Rosa, riverside fisherwoman (ep 4)
    "MIA": ("a", "af_heart", 0.95),      # Noah's sister, in person (ep 5)
    "LEON": ("b", "bm_daniel", 0.92),    # Leon Marchand, yacht skipper (ep 6)
    "HANA": ("a", "af_nova", 1.0),       # Hana, seabird researcher (ep 6)
}


def main():
    script = Path(sys.argv[1]).resolve()
    ep = script.parent.parent
    out = ep / "voiceover" / "full"
    out.mkdir(parents=True, exist_ok=True)
    S = runpy.run_path(str(script))["S"]
    pipes = {}
    manifest = {}
    total = 0.0
    for si, sc in enumerate(S):
        for bi, (spk, text, _vis, _p) in enumerate(sc):
            if spk == "-" or not text:
                continue
            lang, voice, speed = VOICES[spk]
            h = hashlib.sha1(f"{voice}|{speed}|{text}".encode()).hexdigest()[:12]
            f = out / f"{spk.lower()}_{h}.wav"
            if not f.exists():
                if lang not in pipes:
                    pipes[lang] = KPipeline(lang_code=lang)
                audio = np.concatenate([a.numpy() for _, _, a in pipes[lang](text, voice=voice, speed=speed)])
                # trim leading/trailing silence
                idx = np.where(np.abs(audio) > 0.01)[0]
                if len(idx):
                    audio = audio[max(0, idx[0] - 600): idx[-1] + 2400]
                sf.write(f, audio, SR)
                print(f"[{si:02d}.{bi:02d}] {spk:6s} {len(audio)/SR:5.2f}s  {text[:60]}", flush=True)
            d = sf.info(f).duration
            manifest[f"{si}.{bi}"] = {"file": str(f.relative_to(ep)), "dur": round(d, 3)}
            total += d
    (out / "manifest.json").write_text(json.dumps(manifest, indent=1))
    print(f"speech total: {total/60:.1f} min, {len(manifest)} lines")


if __name__ == "__main__":
    main()
