"""Renderiza todos os planos (em paralelo), concatena e mixa o audio final."""
import sys, os, subprocess
from concurrent.futures import ProcessPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
import render

BR = "/tmp/claude-0/br/"

def job(i):
    p = f"{render.OUT}{i:03d}.mp4"
    if os.path.exists(p) and "--force" not in sys.argv: return i
    render.render_shot(i); return i

if __name__ == "__main__":
    os.makedirs(render.OUT, exist_ok=True)
    todo = [i for i in range(len(render.SHOTS))]
    heavy = [i for i in todo if render.SHOTS[i].get("title")]
    light = [i for i in todo if i not in heavy]
    with ProcessPoolExecutor(int(os.environ.get("JOBS", "3"))) as ex:
        for i in ex.map(job, light): print("ok", i, flush=True)
    for i in heavy: job(i); print("ok", i, flush=True)
    with open(BR + "concat.txt", "w") as f:
        for i in todo: f.write(f"file '{render.OUT}{i:03d}.mp4'\n")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", BR + "concat.txt", "-c", "copy", BR + "video_only.mp4"], check=True)
    # audio: normalizacao em 2 passos para -14 LUFS / -1 dBTP (padrao Instagram/Facebook)
    import json, re
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", BR + "audio_premix.wav", "-af", "loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
    ln = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    out = BR + "final/Banda_Racional_Trailer_9x16.mp4"
    os.makedirs(BR + "final", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", BR + "video_only.mp4", "-i", BR + "audio_premix.wav",
                    "-filter:a", ln + ",aresample=48000", "-map", "0:v", "-map", "1:a",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-profile:v", "high", "-pix_fmt", "yuv420p",
                    "-x264-params", "keyint=60:min-keyint=30", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart",
                    "-shortest", out], check=True)
    print("FINAL", out)
