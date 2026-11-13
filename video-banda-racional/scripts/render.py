"""Renderizador do trailer Banda Racional (1080x1920, 30 fps)."""
import sys, os, subprocess, json, math, numpy as np, cv2
sys.path.insert(0, os.path.dirname(__file__))
import fx, text3d
from fx import W, H, smoothstep, ease_out, ease_inout

FPS = 30
RAW = "/tmp/claude-0/br/raw/"
WA = RAW + "WhatsApp Video 2026-11-06 at "
SRC = {
    "U": RAW + "USAR-001.mp4", "C06": WA + "14.25.47.mp4", "C07": WA + "14.26.13.mp4", "C08": WA + "14.26.44.mp4",
    "C09": WA + "14.27.15.mp4", "C10": WA + "14.27.46.mp4", "C11": WA + "14.34.21.mp4", "C12": WA + "14.38.18.mp4",
    "D13": WA + "14.38.59.mp4", "D14": WA + "14.39.48.mp4", "D15": WA + "14.40.13.mp4", "D16": WA + "14.40.33.mp4",
    "V03": WA + "14.23.12.mp4", "V05": WA + "14.23.23.mp4", "V21": WA + "15.01.51.mp4",
    "V24": RAW + "WhatsApp Video 2026-11-10 at 13.37.04.mp4", "V25": RAW + "WhatsApp Video 2026-11-10 at 13.37.06.mp4",
}
OUT = "/tmp/claude-0/br/shots/"

# ------------------------------------------------------------------ roteiro
# (inicio, fim, fonte, t_fonte, velocidade, cx0, cx1, zoom0, zoom1, look, extras)
def S(t0, t1, src, ts, sp=1.0, cx=0.5, cx1=None, z0=1.0, z1=1.06, look="epic", **kw):
    return dict(t0=t0, t1=t1, src=src, ts=ts, sp=sp, cx0=cx, cx1=cx if cx1 is None else cx1, z0=z0, z1=z1, look=look, **kw)

SHOTS = [
    # ---- 0-16 misterio ----
    dict(t0=0.0, t1=0.40, black=True),
    S(0.40, 1.90, "C12", 6.6, 0.4, cx=0.12, z0=1.18, z1=1.10, look="dark", flash=0.40, fadeout=0.35),
    dict(t0=1.90, t1=2.10, black=True),
    S(2.10, 3.74, "C12", 39.6, 0.5, cx=0.16, z0=1.25, z1=1.15, look="dark", fadein=0.5, dipout=0.12),
    S(3.74, 5.87, "C12", 30.6, 0.5, cx=0.30, z0=1.30, z1=1.18, look="dark", flash=0.5, dipout=0.12),
    S(5.87, 8.00, "C09", 19.6, 0.5, cx=0.40, z0=1.05, z1=1.16, look="dark", flash=0.5, dipout=0.12),
    S(8.00, 10.13, "C11", 22.4, 0.5, cx=0.52, z0=1.15, z1=1.05, look="dark", flash=0.5, dipout=0.12),
    S(10.13, 12.26, "C12", 16.2, 0.5, cx=0.20, z0=1.30, z1=1.20, look="dark", flash=0.5, dipout=0.12),
    S(12.26, 14.44, "D13", 0.5, 1.0, cx=0.45, z0=1.0, z1=1.10, look="dark", flash=0.4, leak=1),
    S(14.44, 16.58, "U", 0.5, 1.0, cx=0.45, z0=1.12, z1=1.02, look="mid", whipin=True),
    # ---- 16.6-27 revelacao ----
    S(16.58, 18.55, "D13", 39.0, 1.0, cx=0.50, z0=1.0, z1=1.08, look="mid", punch=True),
    S(18.55, 20.57, "U", 12.0, 1.0, cx=0.42, z0=1.0, z1=1.08, look="mid", punch=True),
    S(20.57, 22.71, "D16", 23.0, 1.0, cx=0.50, z0=1.0, z1=1.08, look="epic", punch=True),
    S(22.71, 24.84, "D15", 193.0, 1.0, cx=0.50, z0=1.0, z1=1.08, look="epic", punch=True),
    S(24.84, 25.91, "C11", 71.4, 1.0, cx=0.28, z0=1.1, z1=1.2, look="epic", punch=True),
    S(25.91, 26.62, "U", 46.5, 1.0, cx=0.50, z0=1.0, z1=1.1, look="epic", punch=True, zoomout=True),
    dict(t0=26.62, t1=26.98, black=True),
    # ---- TITULO 1 ----
    S(26.98, 33.36, "C07", 2.4, 0.5, cx=0.50, z0=1.0, z1=1.07, look="epic", title=1, flash=0.6),
    # ---- 33-71 energia ----
    S(33.36, 35.45, "C12", 12.4, 1.0, cx=0.30, z0=1.05, z1=1.12, punch=True),
    S(35.45, 37.59, "D13", 182.4, 1.0, cx=0.50, z0=1.0, z1=1.08, punch=True),
    S(37.59, 38.65, "V03", 32.0, 1.0, z0=1.02, z1=1.08, punch=True),
    S(38.65, 39.70, "C12", 33.6, 1.0, cx=0.45, z0=1.05, z1=1.1, punch=True),
    S(39.70, 41.79, "C06", 14.4, 0.5, cx=0.45, z0=1.0, z1=1.08, leak=2),
    S(41.79, 43.88, "C11", 71.6, 1.0, cx=0.26, z0=1.06, z1=1.14, punch=True),
    S(43.88, 45.97, "U", 33.6, 1.0, cx=0.55, z0=1.0, z1=1.08, punch=True),
    S(45.97, 47.03, "V03", 83.0, 1.0, z0=1.05, z1=1.1, punch=True),
    S(47.03, 48.09, "C12", 31.0, 1.0, cx=0.26, z0=1.1, z1=1.15, punch=True),
    S(48.09, 50.18, "C08", 1.0, 0.5, cx=0.45, z0=1.0, z1=1.08, leak=3),
    S(50.18, 52.24, "D13", 192.0, 1.0, cx=0.50, z0=1.0, z1=1.08, punch=True),
    S(52.24, 54.36, "C10", 0.8, 0.5, cx=0.48, z0=1.05, z1=1.12),
    S(54.36, 56.40, "C11", 104.6, 1.0, cx=0.35, z0=1.05, z1=1.12, punch=True),
    S(56.40, 58.51, "D15", 3.0, 1.0, cx=0.50, z0=1.0, z1=1.08, punch=True),
    S(58.51, 60.58, "C09", 22.4, 0.5, cx=0.30, z0=1.0, z1=1.08, flash=0.35, leak=4),
    S(60.58, 62.67, "V24", 1.0, 1.0, z0=1.02, z1=1.1, punch=True),
    S(62.67, 64.71, "D16", 107.0, 1.0, cx=0.50, z0=1.0, z1=1.08, punch=True),
    S(64.71, 66.80, "C12", 41.4, 1.0, cx=0.50, z0=1.0, z1=1.08, punch=True),
    S(66.80, 68.89, "U", 36.0, 1.0, cx=0.50, z0=1.0, z1=1.12, punch=True),
    S(68.89, 69.92, "D13", 76.6, 1.0, cx=0.50, z0=1.05, z1=1.15, punch=True),
    S(69.92, 70.44, "C11", 116.0, 1.0, cx=0.40, z0=1.1, z1=1.2, punch=True),
    S(70.44, 70.96, "C12", 7.2, 1.0, cx=0.22, z0=1.1, z1=1.25, punch=True, whipout=True),
    # ---- TITULO 2 ----
    S(70.96, 77.23, "U", 48.8, 0.8, cx=0.52, z0=1.0, z1=1.04, look="epic", title=2, flash=0.6),
    # ---- 77-94 apoteose ----
    S(77.23, 79.29, "C09", 25.2, 0.5, cx=0.40, z0=1.0, z1=1.08, leak=5),
    S(79.29, 80.33, "D13", 201.6, 1.0, cx=0.50, z0=1.05, z1=1.12, punch=True),
    S(80.33, 81.36, "C06", 36.0, 1.0, cx=0.45, z0=1.05, z1=1.12, punch=True),
    S(81.36, 83.43, "U", 20.6, 1.0, cx=0.55, z0=1.0, z1=1.08, punch=True),
    S(83.43, 84.46, "V21", 21.0, 1.0, z0=1.05, z1=1.1, punch=True),
    S(84.46, 85.49, "C12", 8.0, 1.0, cx=0.22, z0=1.08, z1=1.15, punch=True),
    S(85.49, 87.61, "D16", 150.0, 1.0, cx=0.50, z0=1.0, z1=1.08, flash=0.3),
    S(87.61, 88.64, "C11", 27.4, 1.0, cx=0.55, z0=1.05, z1=1.12, punch=True),
    S(88.64, 89.67, "C10", 10.6, 1.0, cx=0.50, z0=1.05, z1=1.12, punch=True),
    S(89.67, 91.76, "D13", 134.0, 1.0, cx=0.50, z0=1.0, z1=1.08, punch=True),
    S(91.76, 93.85, "C07", 20.4, 0.5, cx=0.50, z0=1.0, z1=1.06, leak=6),
    # ---- 94-100 respiro ----
    S(93.85, 96.95, "C09", 30.6, 0.4, cx=0.55, z0=1.0, z1=1.10, look="soft", fadein=0.25),
    S(96.95, 99.45, "V03", 108.2, 0.5, z0=1.05, z1=1.14, look="soft", fadeout=0.3),
    dict(t0=99.45, t1=100.01, black=True),
    # ---- 100-106 impacto final ----
    S(100.01, 101.98, "U", 56.4, 1.2, cx=0.50, z0=1.12, z1=1.0, flash=0.9, shake=1.0),
    S(101.98, 102.96, "C12", 6.4, 1.0, cx=0.22, z0=1.08, z1=1.16, punch=True),
    S(102.96, 103.93, "D13", 186.0, 1.0, cx=0.50, z0=1.05, z1=1.12, punch=True),
    S(103.93, 104.93, "C06", 12.0, 1.0, cx=0.40, z0=1.05, z1=1.12, punch=True),
    S(104.93, 105.93, "U", 58.6, 1.0, cx=0.50, z0=1.0, z1=1.1, punch=True, whiteout=0.6),
    # ---- logo ----
    dict(t0=105.93, t1=119.5, logo=True),
]

# ------------------------------------------------------------------ leitura das fontes
def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "json", path], capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]; n, d = map(int, s["r_frame_rate"].split("/"))
    return s["width"], s["height"], n / d

def load_frames(path, ts, dur, maxw=None):
    w, h, fps = probe(path)
    vf = []
    if maxw and w > maxw: vf = ["-vf", f"scale={maxw}:-2"]
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{max(0, ts - 0.0):.3f}", "-i", path, "-t", f"{dur + 0.25:.3f}"] + vf + \
          ["-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    p = subprocess.run(cmd, capture_output=True)
    if maxw and w > maxw: h = int(round(h * maxw / w / 2) * 2); w = maxw
    buf = np.frombuffer(p.stdout, np.uint8)
    n = len(buf) // (w * h * 3)
    return buf[:n * w * h * 3].reshape(n, h, w, 3), fps

def sample(frames, fps, t):
    """t em segundos relativo ao inicio carregado; mistura de quadros para camera lenta."""
    f = t * fps; i = int(np.floor(f)); fr = f - i
    i = min(max(i, 0), len(frames) - 1); j = min(i + 1, len(frames) - 1)
    a = frames[i].astype(np.float32) / 255
    if fr < 0.12 or i == j: return a
    if fr > 0.88: return frames[j].astype(np.float32) / 255
    return a * (1 - fr) + frames[j].astype(np.float32) / 255 * fr

def frame_crop(src, cx, zoom, dx=0.0, dy=0.0, rot=0.0):
    """Recorte 9:16 do quadro fonte, com zoom/deslocamento, direto para 1080x1920."""
    h, w = src.shape[:2]
    if w / h > 9 / 16 + 0.01:  # paisagem
        ch = h / zoom; cw = ch * 9 / 16
    else:
        cw = w / zoom; ch = cw * 16 / 9
        if ch > h: ch = h / zoom; cw = ch * 9 / 16
    x0 = cx * w - cw / 2; x0 = min(max(x0, 0), w - cw)
    y0 = (h - ch) / 2
    x0 += dx * cw; y0 += dy * ch
    s = W / cw
    M = np.float64([[s, 0, -x0 * s], [0, s, -y0 * s]])
    if rot:
        R = cv2.getRotationMatrix2D((W / 2, H / 2), rot, 1.0); M = np.vstack([R, [0, 0, 1]]) @ np.vstack([M, [0, 0, 1]]); M = M[:2]
    return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT), M

# ------------------------------------------------------------------ mascaras
def sky_mask(img):
    hsv = cv2.cvtColor((np.clip(img, 0, 1) * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    hh, s, v = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    sky = ((hh > 95) & (hh < 130) & (s > 0.18) & (v > 0.42) & (b > r + 0.12)).astype(np.float32)
    sky = cv2.morphologyEx(sky, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    sky = cv2.morphologyEx(sky, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    return cv2.GaussianBlur(sky, (0, 0), 1.0)

def white_mask(img):
    mx = img.max(2); mn = img.min(2)
    s = (mx - mn) / (mx + 1e-4)
    m = ((mx > 0.60) & (s < 0.28)).astype(np.float32)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    m = cv2.dilate(m, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 1.0)

# ------------------------------------------------------------------ rastreamento de camera
def track_masks(frames_out, masks):
    return track(frames_out, None, masks)

def track(frames_out, mask_fn=None, masks=None):
    """Similaridade acumulada quadro0 -> quadro k (para fixar as letras no cenario)."""
    Ms = [np.eye(3)]; prev = cv2.cvtColor((frames_out[0] * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    for k in range(1, len(frames_out)):
        cur = cv2.cvtColor((frames_out[k] * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
        msk = masks[k - 1] if masks is not None else (None if mask_fn is None else mask_fn(frames_out[k - 1]))
        p0 = cv2.goodFeaturesToTrack(prev, 600, 0.01, 12, mask=msk)
        A = np.eye(3)
        if p0 is not None and len(p0) > 12:
            p1, st, _ = cv2.calcOpticalFlowPyrLK(prev, cur, p0, None, winSize=(25, 25), maxLevel=3)
            g = st.ravel() == 1
            if g.sum() > 10:
                M, inl = cv2.estimateAffinePartial2D(p0[g], p1[g], method=cv2.RANSAC, ransacReprojThreshold=2.0)
                if M is not None: A = np.vstack([M, [0, 0, 1]])
        Ms.append(A @ Ms[-1]); prev = cur
    # suavizacao leve dos parametros
    P = np.array([[m[0, 0], m[0, 1], m[0, 2], m[1, 2]] for m in Ms])
    k = 2; Ps = P.copy()
    for i in range(len(P)):
        Ps[i] = P[max(0, i - k):i + k + 1].mean(0)
    return [np.array([[p[0], p[1], p[2]], [-p[1], p[0], p[3]], [0, 0, 1]]) for p in Ps]

# ------------------------------------------------------------------ titulos
_TL = {}
def title_layer(n):
    if n not in _TL:
        if n == 1:
            _TL[n] = text3d.make([("BANDA", 380, 26), ("RACIONAL", 300, 18), ("UNIVERSO EM DESENCANTO", 104, 14)],
                                 depth=42, extrude=(0, 1.0), gap=26)
        else:
            _TL[n] = text3d.make([("CULTURA RACIONAL", 200, 12), ("DO BRASIL", 310, 20), ("PARA O MUNDO", 250, 16)],
                                 depth=40, extrude=(0, -1.0), gap=24)
    return _TL[n]

def place_matrix(T, cx, cy, width, tilt=0.0):
    """Plano do texto -> quadro: escala p/ largura, centro (cx,cy), leve perspectiva (tilt>0 base maior)."""
    w, h = T["size"]; s = width / w
    hw, hh = w * s / 2, h * s / 2
    src = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    dst = np.float32([[cx - hw * (1 - tilt), cy - hh], [cx + hw * (1 - tilt), cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]])
    return cv2.getPerspectiveTransform(src, dst)

# ------------------------------------------------------------------ render de um plano
def render_shot(idx, preview=False):
    sh = SHOTS[idx]
    n = int(round(sh["t1"] * FPS)) - int(round(sh["t0"] * FPS))
    path = f"{OUT}{idx:03d}.mp4"
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                            "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "12", "-pix_fmt", "yuv420p", path],
                           stdin=subprocess.PIPE)
    def emit(img): enc.stdin.write((np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
    if sh.get("black"):
        z = np.zeros((H, W, 3), np.float32)
        for k in range(n): emit(fx.finish(z, 0.02, vig=False))
    elif sh.get("logo"):
        import logo
        for k in range(n): emit(logo.frame(k / FPS, sh["t1"] - sh["t0"]))
    else:
        dur = n / FPS
        frames, fps = load_frames(SRC[sh["src"]], sh["ts"], dur * sh["sp"] + 0.1, maxw=1920)
        def make(k):
            u = k / max(1, n - 1)
            t = k / FPS
            z = sh["z0"] + (sh["z1"] - sh["z0"]) * ease_inout(u)
            cx = sh["cx0"] + (sh["cx1"] - sh["cx0"]) * ease_inout(u)
            dx = dy = rot = 0.0
            if sh.get("punch") and t < 0.2: z *= 1 + 0.07 * (1 - t / 0.2) ** 2
            if sh.get("zoomout"): z *= 1 + 0.15 * u
            if sh.get("shake"):
                a = sh["shake"] * np.exp(-t / 0.35)
                dx = 0.012 * a * np.sin(t * 61); dy = 0.010 * a * np.sin(t * 47 + 1); rot = 0.6 * a * np.sin(t * 37)
            src = sample(frames, fps, t * sh["sp"])
            return frame_crop(src, cx, z, dx, dy, rot)[0]
        tctx = prepare_title(sh, make, n) if sh.get("title") else None
        for k in range(n):
            img = make(k)
            if tctx is not None: img = compose_title_frame(sh, tctx, k, img)
            t = k / FPS; tl = (n - k) / FPS
            look = sh["look"]
            if look == "dark": img = fx.grade(img, "dark")
            elif look == "mid":
                a = fx.grade(img, "dark"); b = fx.grade(img, "epic"); m = k / max(1, n - 1)
                img = a * (1 - m) * 0.5 + b * (0.5 + 0.5 * m)
            elif look == "soft":
                img = fx.grade(img, "epic"); lum = img.mean(2, keepdims=True); img = lum + (img - lum) * 0.75
            else: img = fx.grade(img, "epic")
            img = fx.sharpen(img, 0.35)
            img = fx.bloom(img, 0.30 if look in ("epic", "soft", "mid") else 0.18)
            if sh.get("leak"): img = img + fx.light_leak(t + sh["t0"], sh["leak"], 0.22) * smoothstep(0, 0.6, t)
            if sh.get("flash") and t < 0.5:
                f = sh["flash"] * np.exp(-t / 0.09)
                img = img + f; img = fx.anamorphic(img, 0.8 * f + 0.3, 0.6)
            if sh.get("punch") and t < 0.12: img = fx.anamorphic(img, 0.25, 0.8)
            if sh.get("whipin") and t < 0.25:
                img = fx.dir_blur(img, 0, 120 * (1 - t / 0.25))
            if sh.get("whipout") and tl < 0.3:
                img = fx.zoom_blur(img, 0.12 * (1 - tl / 0.3), 8)
            if sh.get("whiteout") and tl < sh["whiteout"]:
                img = img + (1 - tl / sh["whiteout"]) ** 2 * 1.4
            img = fx.finish(img, 0.03)
            if sh.get("fadein") and t < sh["fadein"]: img *= smoothstep(0, sh["fadein"], t)
            if sh.get("fadeout") and tl < sh["fadeout"]: img *= smoothstep(0, sh["fadeout"], tl)
            if sh.get("dipout") and tl < sh["dipout"]: img *= smoothstep(0, sh["dipout"], tl) ** 0.5
            emit(img)
    enc.stdin.close(); enc.wait()
    return path

def analyze(make, n, sky_only):
    """Passo 1: quadros em meia resolucao -> rastreamento de camera + mapas de profundidade."""
    import depth as DP
    S = np.diag([0.5, 0.5, 1.0]); Si = np.diag([2.0, 2.0, 1.0])
    smalls, deps = [], []
    prev = None
    for k in range(n):
        im = cv2.resize(make(k), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
        smalls.append(im)
        d = DP.depth(im)
        if prev is not None: d = 0.6 * d + 0.4 * prev   # estabiliza no tempo
        prev = d; deps.append(d.astype(np.float16))
    # rastreia so pontos do fundo distante (arvores, predios), ignorando banda e bandeiras em movimento
    Ms = track_masks(smalls, [(((d.astype(np.float32) < 0.33) if sky_only else ((d.astype(np.float32) > 0.22) & (d.astype(np.float32) < 0.62))) * 255).astype(np.uint8) for d in deps])
    del smalls
    return [Si @ M @ S for M in Ms], deps

def prepare_title(sh, make, n):
    T = title_layer(sh["title"])
    Ms, deps = analyze(make, n, sh["title"] == 1)
    if sh["title"] == 1:
        base = place_matrix(T, W / 2, 470, 900, tilt=0.06); clip = T["baseline"]
    else:
        base = place_matrix(T, W / 2, 640, 980, tilt=-0.05); clip = T["size"][1] - 30
    # centraliza o texto no meio da permanencia (compensa a deriva da camera)
    w, h = T["size"]; km = int(n * 0.5)
    tgt = np.array([W / 2, 470.0 if sh["title"] == 1 else 640.0])
    p = Ms[km] @ base @ np.array([w / 2, h / 2, 1.0]); p = p[:2] / p[2]
    Tm = np.eye(3); Tm[:2, 2] = tgt - p
    base = np.linalg.inv(Ms[km]) @ Tm @ Ms[km] @ base
    return dict(T=T, Ms=Ms, base=base, clip=clip, deps=deps, thr=None)

def compose_title_frame(sh, c, k, img):
    import depth as DP
    T, Ms, base, clip = c["T"], c["Ms"], c["base"], c["clip"]
    w, h = T["size"]; t = k / FPS
    rise = (1 - ease_out(t / 1.25)) * h * 0.95
    glint = smoothstep(1.4, 3.4, t) * 1.3 - 0.15
    d = cv2.resize(c["deps"][k].astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    Hm = Ms[k] @ base
    if sh["title"] == 1:
        thr = 0.50   # bandeiras, mastros e pessoas na frente; painel, arvores e ceu atras
        hz = (0.08, (0.62, 0.75, 0.92))
    else:
        yb = Hm @ np.array([w / 2, h - 60, 1.0]); yb = int(np.clip(yb[1] / yb[2], 0, H - 1))
        band = d[max(0, yb - 30):yb + 30, W // 4: 3 * W // 4]
        thr_now = float(np.percentile(band, 60)) + 0.04
        c["thr"] = thr_now if c["thr"] is None else 0.85 * c["thr"] + 0.15 * thr_now
        thr = c["thr"]
        hz = (0.05, (0.9, 0.85, 0.75))
    occ = smoothstep(thr - 0.025, thr + 0.025, d).astype(np.float32)
    if sh["title"] == 1:   # painel escuro de madeira fica atras: so bandeiras/pessoas (claras ou coloridas) ocultam
        bright = cv2.GaussianBlur((img.max(2) > 0.42).astype(np.float32), (0, 0), 1.5)
        occ = occ * bright
    if sh["title"] == 2:   # so os musicos (uniforme branco) passam na frente; arvores proximas nao
        occ = occ * cv2.dilate(white_mask(img), np.ones((5, 5), np.uint8))
    occ = DP.refine(occ, img, 6, 2e-3)
    out, _ = text3d.composite(img, T, Hm, occ=occ, clip_y=clip, rise=rise, alpha=smoothstep(0, 0.25, t),
                              haze=hz, glint=glint, blur=0.6)
    return out

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    ids = [int(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else range(len(SHOTS))
    for i in ids:
        print("shot", i, render_shot(i), flush=True)
