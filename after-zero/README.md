# AFTER ZERO — production pipeline

*When everything ends, the story begins.*

Cinematic stylized-3D story channel (English). This folder holds the production
system and episode assets. Source of truth: *AFTER ZERO – Project Brief & Pilot Episode*.

## v2 — 100% free pipeline (current)

No paid image/video generation. Every shot is drawn and animated in code with
**Remotion** (React + SVG) in `animation/`: layered parallax skylines, fog, god
rays, dust, birds, and one vector Noah rig (lying, sitting, walking, back view,
profile close-up) so he looks identical in every shot.

```bash
cd animation && npm install
npx remotion studio src/index.ts              # live preview / edit
npx remotion render src/index.ts Ep001Scene01 out/picture.mp4 --muted \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-linux/chrome-headless-shell
cd .. && python3 tools/assemble.py config/episode_001_poc.json \
  --picture animation/out/picture.mp4 --out renders/after_zero_ep001_scene01_v2_animated.mp4
```

Each shot is also its own composition (`Shot-S01` … `Shot-S13`) for quick fixes.
Narration (already generated) and the synthesized score/SFX are reused, so v2 cost **0 credits**.
For future scenes the narration can be recorded by you or made with any TTS; the
pipeline only needs one MP3 and the subtitle timings in the config.

## Status (v1, AI-generated)

| Step | Status |
|---|---|
| Noah character reference (front/side/back) | ✅ `project/episode_001/character_refs/noah_turnaround_v1.png` |
| Proof of concept, Scene 01 "The First Morning" (62 s) | ✅ rendered — **waiting for approval** |
| Full pilot (≈22 min, 12 scenes) | ⏸ blocked on approval + credits (see costs) |

## Proof-of-concept deliverables (episode_001)

- `renders/after_zero_ep001_poc_scene01.mp4` — master, 1920×1080, 30 fps, H.264 + AAC, soft English subtitle track, −14 LUFS (not committed: >100 MB, rebuild with the command below)
- `renders/after_zero_ep001_poc_scene01_preview720.mp4` — light preview (committed)
- `subtitles/poc_scene01.en.srt` — subtitles for YouTube upload
- `storyboard/poc_scene01_storyboard.md` — shot list with timings
- `logs/generation_log.json` — every external job: model, params, job id, credits

## Pipeline

```
config/episode_001_poc.json   one file per cut: shots, timings, subtitles, audio cues, mix
tools/audio_design.py         original score + ambience + SFX, synthesized (no licensing risk)
tools/assemble.py             renders each shot → segments (cached) → concat → mix → MP4
```

```bash
python3 tools/audio_design.py config/episode_001_poc.json project/episode_001
python3 tools/assemble.py     config/episode_001_poc.json            # full build
python3 tools/assemble.py     config/episode_001_poc.json --shot S08 # redo one shot only
```

Shot types: `video` (AI clip, auto-scaled/graded, optional `speed`), `still`
(keyframe with eased Ken Burns: `push_in`, `pan_left`, `tilt_up`…), `clock`, `title`.
All shots share one grade (teal/amber, vignette, grain) so AI clips and stills match.

### Generation (external, via Higgsfield)

| Stage | Model | Unit cost (credits) |
|---|---|---|
| Character sheet / keyframes | `gpt_image_2_6` (medium, 1k), Noah sheet passed as reference | 0.5 per image |
| Animation (image → video) | `kling3_0` std, silent | 7.5 per 5 s · 4.5 per 3 s |
| Narration | `elevenlabs_v4_turbo`, voice "Arthur" | ≈ 2 per 50 s |
| Music / SFX | local synthesis | 0 |

Consistency workflow: approve the turnaround sheet first → every Noah keyframe
references it (plus the previous keyframe of the same location) → animate only
from approved keyframes.

## Cost estimate — full pilot (≈22 min)

POC spent **37.95 credits for 62 s** (4 animated clips + 11 stills + VO).
For the full episode (≈130 shots), with ~40% animated shots and the rest as
moving stills:

| Item | Qty | Credits |
|---|---|---|
| Keyframes | ~140 | ~70 |
| Animated clips (5 s std) | ~50 | ~375 |
| Narration + dialogue (Noah, radio voice, Dr. Carter, sister) | ~23 min | ~60 |
| Retries / fixes (~20%) | | ~100 |
| **Total** | | **≈ 600 (range 450–700)** |

Current balance after POC: **4.69 credits** → a top-up is needed before scaling.
Cheaper option: more stills / 3 s clips (≈ 400). Higher quality: Kling `pro` (~2×).

## Known limitations (POC)

- Kling std outputs 1280×716; upscaled to 1080p (slightly soft). `pro` mode or an upscaler would fix it.
- No lip-sync needed in Scene 01; dialogue scenes (radio, Dr. Carter) will need it.
- Music is procedural ambient — fine for atmosphere; a composed/licensed score is an option for the full episode.
- Every published title/description must state that the story is fictional.
