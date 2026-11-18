"""AFTER ZERO - episode assembler.

Reads an episode config (config/*.json), renders every shot to a normalised
1920x1080 segment, concatenates them, mixes voiceover + music + SFX with
ducking, attaches English subtitles and exports H.264/AAC MP4.

Segments are cached in renders/_segments, so regenerating one shot only
requires deleting its segment (or passing --shot S08) and re-running.

usage: python3 tools/assemble.py config/episode_001_poc.json [--shot S08 ...]
"""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
FONT_BOLD = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FONT_REG = "/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf"
FONT_LIGHT = "/usr/share/fonts/opentype/inter/InterDisplay-Light.otf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

# Shared "look": gentle teal/amber grade, vignette and fine grain.
GRADE = ("eq=contrast=1.06:saturation=0.95:gamma=0.98,"
         "colorbalance=rs=-0.03:bs=0.04:rh=0.04:bh=-0.03,"
         "vignette=PI/5,noise=alls=5:allf=t")


def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(ROOT / "logs" / "assemble.log", "a") as f:
        f.write(line + "\n")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        log("FFMPEG ERROR: " + " ".join(map(str, cmd)))
        log(r.stderr[-2000:])
        sys.exit(1)


def enc(fps):
    return ["-r", str(fps), "-c:v", "libx264", "-preset", "medium", "-crf", "17",
            "-pix_fmt", "yuv420p", "-an"]


def seg_video(s, ep, out, W, H, fps):
    speed = s.get("speed", 1.0)
    vf = (f"setpts=PTS/{speed},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={W}:{H},fps={fps},tpad=stop_mode=clone:stop_duration=3,{GRADE},"
          f"trim=duration={s['dur']}")
    run(["ffmpeg", "-y", "-i", str(ep / s["src"]), "-vf", vf, *enc(fps), str(out)])


MOVES = {
    # (zoom start, zoom end, x drift, y drift)  drift in fraction of free space
    "push_in": (1.00, 1.12, 0.0, 0.0),
    "push_in_slow": (1.02, 1.10, 0.0, 0.0),
    "pull_out": (1.14, 1.02, 0.0, 0.0),
    "pan_right": (1.12, 1.12, -0.5, 0.0),
    "pan_left": (1.12, 1.12, 0.5, 0.0),
    "tilt_up": (1.12, 1.12, 0.0, 0.5),
}


def seg_still(s, ep, out, W, H, fps, src=None):
    z0, z1, dx, dy = MOVES[s.get("move", "push_in")]
    n = max(1, int(round(s["dur"] * fps)))
    # Upscale 2x first so zoompan sub-pixel motion stays smooth.
    pw, ph = W * 2, H * 2
    p = f"(on/{n - 1 if n > 1 else 1})"
    ease = f"(0.5-0.5*cos(PI*{p}))"
    z = f"({z0}+({z1}-{z0})*{ease})"
    x = f"(iw-iw/zoom)/2*(1+{dx}*(2*{ease}-1))"
    y = f"(ih-ih/zoom)/2*(1+{dy}*(2*{ease}-1))"
    vf = (f"scale={pw}:{ph}:force_original_aspect_ratio=increase:flags=lanczos,crop={pw}:{ph},"
          f"zoompan=z='{z}':x='{x}':y='{y}':d={n}:s={W}x{H}:fps={fps},{GRADE}")
    run(["ffmpeg", "-y", "-loop", "1", "-i", str(src or ep / s["src"]), "-vf", vf,
         "-frames:v", str(n), *enc(fps), str(out)])


def darkened_bg(path, W, H, blur=6, dim=0.35):
    im = Image.open(path).convert("RGB").resize((W, H), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(blur))
    return ImageEnhance.Brightness(im).enhance(dim)


def seg_clock(s, ep, out, W, H, fps, tmp):
    frames = []
    for label in (s["from"], s["to"]):
        im = darkened_bg(ep / s["bg"], W, H, blur=10, dim=0.22)
        d = ImageDraw.Draw(im)
        f = ImageFont.truetype(FONT_MONO, 300)
        txt = f"{label} AM"
        bb = d.textbbox((0, 0), txt, font=f)
        x, y = (W - (bb[2] - bb[0])) // 2, (H - (bb[3] - bb[1])) // 2 - 40
        glow = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(glow).text((x, y), txt, font=f, fill=(213, 139, 73, 255))
        glow = glow.filter(ImageFilter.GaussianBlur(18))
        im.paste(glow, (0, 0), glow)
        d.text((x, y), txt, font=f, fill=(240, 170, 100))
        p = tmp / f"clock_{label.replace(':', '')}.png"
        im.save(p)
        frames.append(p)
    a = tmp / "clock_a.mp4"
    b = tmp / "clock_b.mp4"
    seg_still({"dur": s["flip_at"], "move": "push_in_slow"}, ep, a, W, H, fps, src=frames[0])
    seg_still({"dur": s["dur"] - s["flip_at"], "move": "push_in_slow"}, ep, b, W, H, fps, src=frames[1])
    concat([a, b], out, tmp)


def seg_title(s, ep, out, W, H, fps, tmp, cfg):
    bg = darkened_bg(ep / s["bg"], W, H, blur=4, dim=0.30)
    im = bg.copy()
    d = ImageDraw.Draw(im)
    big = ImageFont.truetype(FONT_BOLD, 190)
    mid = ImageFont.truetype(FONT_REG, 46)
    small = ImageFont.truetype(FONT_LIGHT, 30)

    def center(txt, font, y, fill, spacing=0):
        if spacing:
            # manual letter spacing
            widths = [d.textlength(c, font=font) for c in txt]
            total = sum(widths) + spacing * (len(txt) - 1)
            x = (W - total) / 2
            for c, w in zip(txt, widths):
                d.text((x, y), c, font=font, fill=fill)
                x += w + spacing
        else:
            w = d.textlength(txt, font=font)
            d.text(((W - w) / 2, y), txt, font=font, fill=fill)

    center("AFTER ZERO", big, 330, (213, 210, 199), spacing=22)
    d.rectangle([(W / 2 - 160, 560), (W / 2 + 160, 563)], fill=(213, 139, 73))
    center("WHEN EVERYTHING ENDS, THE STORY BEGINS.", small, 595, (120, 150, 154), spacing=6)
    center(cfg["title"], mid, 690, (213, 139, 73))
    center("A fictional story. Any resemblance to real events is coincidental.", small, 960,
           (150, 150, 145))
    p = tmp / "title.png"
    im.save(p)
    # first part: plain darkened background (narration finishes), then title fades in
    lead = s.get("lead", 3.8)
    bgp = tmp / "title_bg.png"
    bg.save(bgp)
    a, b = tmp / "title_a.mp4", tmp / "title_b.mp4"
    seg_still({"dur": lead, "move": "push_in_slow"}, ep, a, W, H, fps, src=ep / s["bg"])
    n = int(round((s["dur"] - lead) * fps))
    vf = (f"zoompan=z='1.0+0.03*on/{n}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={n}:s={W}x{H}:fps={fps},"
          f"fade=in:st=0:d=0.8,noise=alls=4:allf=t")
    run(["ffmpeg", "-y", "-loop", "1", "-i", str(p), "-vf", vf, "-frames:v", str(n), *enc(fps), str(b)])
    concat([a, b], out, tmp)


def concat(parts, out, tmp):
    lst = tmp / f"{out.stem}_list.txt"
    lst.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out)])


def srt_time(t):
    h, rem = divmod(t, 3600)
    m, sec = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(sec):02d},{int(round((sec % 1) * 1000)):03d}"


def write_srt(cfg, path):
    off = cfg["voiceover"]["offset"] if cfg.get("subtitle_offset_from_voiceover") else 0
    lines = []
    for i, (a, b, txt) in enumerate(cfg["subtitles"], 1):
        lines.append(f"{i}\n{srt_time(a + off)} --> {srt_time(b + off + 0.25)}\n{txt}\n")
    path.write_text("\n".join(lines))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("config")
    ap.add_argument("--shot", action="append", default=[], help="force re-render of shot id")
    args = ap.parse_args()

    cfg = json.loads(Path(args.config).read_text())
    ep = ROOT / "project" / cfg["episode"]
    W, H, fps = cfg["output"]["width"], cfg["output"]["height"], cfg["output"]["fps"]
    segdir = ep / "renders" / "_segments" / cfg["cut"]
    tmp = segdir / "_tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    (ROOT / "logs").mkdir(exist_ok=True)
    log(f"assemble {cfg['episode']} / {cfg['cut']}")

    # sanity: shots must be contiguous
    t = 0.0
    for s in cfg["shots"]:
        if abs(s["start"] - t) > 0.01:
            log(f"WARNING timeline gap/overlap before {s['id']}: expected {t:.2f}, got {s['start']}")
        t = s["start"] + s["dur"]
    total = t

    parts = []
    for s in cfg["shots"]:
        out = segdir / f"{s['id']}.mp4"
        if out.exists() and s["id"] not in args.shot:
            log(f"{s['id']} cached")
        else:
            log(f"{s['id']} render ({s['type']}, {s['dur']}s)")
            kind = s["type"]
            if kind == "video":
                seg_video(s, ep, out, W, H, fps)
            elif kind == "still":
                seg_still(s, ep, out, W, H, fps)
            elif kind == "clock":
                seg_clock(s, ep, out, W, H, fps, tmp)
            elif kind == "title":
                seg_title(s, ep, out, W, H, fps, tmp, cfg)
        parts.append(out)

    picture = tmp / "picture.mp4"
    concat(parts, picture, tmp)

    srt = ep / "subtitles" / f"{cfg['cut']}.en.srt"
    write_srt(cfg, srt)

    mix = cfg["mix"]
    vo = cfg["voiceover"]
    off_ms = int(vo["offset"] * 1000)
    music = ep / "music" / "music_poc.wav"
    sfx = ep / "sound_effects" / "sfx_poc.wav"
    final = ep / cfg["output"]["file"]
    final.parent.mkdir(parents=True, exist_ok=True)
    fc = (
        f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={off_ms}|{off_ms},"
        f"volume={vo['gain_db']}dB,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,"
        f"apad,asplit=2[vo][vokey];"
        f"[2:a]volume={mix['music_db']}dB[mus];"
        f"[mus][vokey]sidechaincompress=threshold=0.04:ratio=4:attack=40:release=600[musd];"
        f"[3:a]volume={mix['sfx_db']}dB[fx];"
        f"[vo][musd][fx]amix=inputs=3:duration=longest:normalize=0,"
        f"loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:{total},afade=t=out:st={total - 1.5}:d=1.5[aout]"
    )
    vf = f"fade=in:st=0:d=1.0,fade=out:st={total - 1.2}:d=1.2"
    run(["ffmpeg", "-y", "-i", str(picture), "-i", str(ep / vo["file"]), "-i", str(music), "-i", str(sfx),
         "-i", str(srt), "-filter_complex", fc, "-map", "0:v", "-map", "[aout]", "-map", "4:s",
         "-vf", vf, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-maxrate", "16M", "-bufsize", "32M",
         "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
         "-c:s", "mov_text", "-metadata:s:s:0", "language=eng",
         "-t", str(total), "-movflags", "+faststart", str(final)])
    log(f"done -> {final.relative_to(ROOT)} ({total:.1f}s)")


if __name__ == "__main__":
    main()
