"""Encerramento: logotipo oficial em 3D (espessura, luz, raios volumetricos, particulas) + site."""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
import fx
from fx import W, H, smoothstep, ease_out, ease_inout

LOGO = "/tmp/claude-0/br/raw/Emblema 3D Brasil Dourado e Verde (1).png"
FONT_URL = "/tmp/claude-0/br/fonts/Montserrat[wght].ttf"
LOCK = 113.82 - 105.93       # golpe final
URL_T = LOCK + 0.55
CX, CY = W / 2, 860
LW = 940                      # largura final do logo

_im = np.array(Image.open(LOGO).convert("RGBA")).astype(np.float32) / 255
_im = cv2.resize(_im, (LW, LW), interpolation=cv2.INTER_AREA)
_a = np.clip(_im[..., 3] / 0.985, 0, 1)
_rgb = _im[..., :3]
_pre = _rgb * _a[..., None]
_solid = (_a > 0.9).astype(np.float32)          # corpo do emblema (sem o brilho difuso)
_dark = np.array([0.20, 0.13, 0.03], np.float32)  # cor da espessura (ouro escuro)

# raios volumetricos: silhueta brilhante borrada radialmente (pre-calculado em baixa res)
def _rays():
    sw, shh = W // 3, H // 3
    m = np.zeros((shh, sw), np.float32)
    s = cv2.resize(_solid, (LW // 3, LW // 3))
    y0 = int(CY / 3 - LW / 6); x0 = int(CX / 3 - LW / 6)
    m[y0:y0 + s.shape[0], x0:x0 + s.shape[1]] = s
    acc = np.zeros_like(m)
    for i in range(48):
        sc = 1 + i * 0.035
        M = cv2.getRotationMatrix2D((CX / 3, CY / 3), 0, sc)
        acc += cv2.warpAffine(m, M, (sw, shh)) * (1 - i / 48)
    acc /= acc.max()
    return cv2.resize(cv2.GaussianBlur(acc, (0, 0), 2), (W, H))[..., None] * np.array([1.0, 0.78, 0.38], np.float32)
RAYS = _rays()

_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
_glow = np.exp(-(((_xx - CX) / 620) ** 2 + ((_yy - CY) / 760) ** 2))[..., None].astype(np.float32)

# particulas douradas
_rng = np.random.default_rng(11)
NP = 220
P = dict(x=_rng.random(NP) * W, y=_rng.random(NP) * H, z=_rng.random(NP), ph=_rng.random(NP) * 6.28,
         vx=(_rng.random(NP) - 0.5) * 14, vy=-(10 + _rng.random(NP) * 35))

def particles(t, bright):
    c = np.zeros((H // 2, W // 2), np.float32)
    for i in range(NP):
        x = (P["x"][i] + P["vx"][i] * t) % W; y = (P["y"][i] + P["vy"][i] * t * (0.5 + P["z"][i])) % H
        r = 1 + P["z"][i] * 3.5
        a = (0.35 + 0.65 * (0.5 + 0.5 * np.sin(t * 2.3 + P["ph"][i]))) * (0.3 + P["z"][i])
        cv2.circle(c, (int(x / 2), int(y / 2)), int(r), float(a), -1, lineType=cv2.LINE_AA)
    c = cv2.GaussianBlur(c, (0, 0), 1.3) + cv2.GaussianBlur(c, (0, 0), 6) * 0.8
    c = cv2.resize(c, (W, H))[..., None]
    return c * np.array([1.0, 0.8, 0.45], np.float32) * bright

def _proj(scale, ry, rx, z=0.0, f=2200.0):
    w = LW / 2
    pts = np.array([[-w, -w, 0], [w, -w, 0], [w, w, 0], [-w, w, 0]], np.float64) * scale
    cy_, sy = np.cos(ry), np.sin(ry); cx_, sx = np.cos(rx), np.sin(rx)
    Ry = np.array([[cy_, 0, sy], [0, 1, 0], [-sy, 0, cy_]]); Rx = np.array([[1, 0, 0], [0, cx_, -sx], [0, sx, cx_]])
    p = pts @ (Rx @ Ry).T
    # espessura: desloca ao longo da normal rotacionada
    nrm = np.array([0, 0, 1.0]) @ (Rx @ Ry).T
    p = p + nrm * z
    X = CX + p[:, 0] * f / (f + p[:, 2]); Y = CY + p[:, 1] * f / (f + p[:, 2])
    src = np.float32([[0, 0], [LW, 0], [LW, LW], [0, LW]])
    return cv2.getPerspectiveTransform(src, np.float32(np.stack([X, Y], 1)))

def _url_layer():
    f = ImageFont.truetype(FONT_URL, 70)
    try: f.set_variation_by_name("SemiBold")
    except Exception: pass
    txt = "www.bandaracional.com.br"
    return txt, f
_URL = _url_layer()

def url_img(tracking, alpha):
    txt, f = _URL
    im = Image.new("L", (W, 120), 0); d = ImageDraw.Draw(im)
    widths = [f.getlength(c) for c in txt]; tw = sum(widths) + tracking * (len(txt) - 1)
    x = (W - tw) / 2
    for c, w_ in zip(txt, widths): d.text((x, 20), c, font=f, fill=255); x += w_ + tracking
    m = np.array(im, np.float32) / 255 * alpha
    g = np.linspace(0, 1, 120, dtype=np.float32)[:, None, None]
    col = np.array([1.0, 0.97, 0.9], np.float32) * (1 - g * 0.25) + np.array([0.95, 0.75, 0.35], np.float32) * g * 0.25
    return m, col

def frame(t, total):
    # fundo
    bg = np.zeros((H, W, 3), np.float32) + np.array([0.012, 0.016, 0.03], np.float32)
    build = smoothstep(0.3, LOCK, t)
    burst = np.exp(-max(0, t - LOCK) / 0.6) * (t >= LOCK)
    bg += _glow * np.array([0.30, 0.20, 0.08], np.float32) * (0.25 + 0.55 * build + 0.6 * burst)
    # logo: aproximacao 3D
    u = smoothstep(0.2, LOCK, t)
    sc = 0.50 + 0.50 * ease_out(u ** 0.8)
    if t > LOCK: sc = 1.0 + 0.035 * np.exp(-(t - LOCK) / 0.25) * np.sin((t - LOCK) * 18) * 0.5 + 0.012 * (t - LOCK) / (total - LOCK)
    ry = np.radians(32) * (1 - ease_inout(u)) ; rx = np.radians(10) * (1 - ease_inout(u))
    op = smoothstep(0.5, 2.4, t)
    focus = 6.0 * (1 - smoothstep(0.8, 3.4, t))
    img = bg.copy()
    # raios por tras
    img += RAYS * (0.12 + 0.35 * build + 0.7 * burst) * op
    img += particles(t, 0.25 + 0.35 * build + 0.4 * burst)
    # espessura (camadas de tras para frente)
    layers = 14 if abs(ry) > np.radians(1.5) else 0
    for k in range(layers, 0, -1):
        Hm = _proj(sc, ry, rx, z=k * 2.2)
        a = cv2.warpPerspective(_solid, Hm, (W, H), flags=cv2.INTER_LINEAR) * op
        shade = _dark * (0.6 + 0.8 * (1 - k / layers))
        img = img * (1 - a[..., None]) + shade * a[..., None]
    Hm = _proj(sc, ry, rx, 0)
    pre = cv2.warpPerspective(_pre, Hm, (W, H), flags=cv2.INTER_CUBIC)
    a = cv2.warpPerspective(_a, Hm, (W, H), flags=cv2.INTER_CUBIC)
    so = cv2.warpPerspective(_solid, Hm, (W, H), flags=cv2.INTER_LINEAR)
    if focus > 0.3:
        pre = cv2.GaussianBlur(pre, (0, 0), focus); a = cv2.GaussianBlur(a, (0, 0), focus)
    # varredura de luz (especular) sobre o emblema
    sweep = 0.0
    for t0, t1 in ((3.6, 5.4), (LOCK, LOCK + 1.4)):
        if t0 <= t <= t1:
            p = (t - t0) / (t1 - t0)
            d = (_xx - CX + (_yy - CY) * 0.55) / (LW * 1.4) - (p * 2.2 - 1.1)
            sweep = np.exp(-(d / 0.045) ** 2) * 0.6 + np.exp(-(d / 0.16) ** 2) * 0.15
    lit = pre + (so * sweep)[..., None] * np.array([1.0, 0.95, 0.82], np.float32) if np.ndim(sweep) else pre
    img = img * (1 - a[..., None] * op) + lit * op
    # reflexo suave no "chao"
    refl = cv2.flip(lit, 0); ra = cv2.flip(a, 0)
    shift = int(2 * (CY + LW / 2 * sc) - H) + 8
    M = np.float32([[1, 0, 0], [0, 1, shift]])
    refl = cv2.warpAffine(refl, M, (W, H)); ra = cv2.warpAffine(ra, M, (W, H))
    fade = np.clip(1 - (_yy - (CY + LW / 2 * sc)) / 260, 0, 1)[..., None] * (_yy > CY + LW / 2 * sc)[..., None]
    refl = cv2.GaussianBlur(refl, (0, 0), 3) * fade * 0.16 * op
    img = img + refl
    # flash e anamorfico no golpe
    img = fx.bloom(img, 0.35 + 0.25 * burst, thr=0.6)
    if t >= LOCK: img = fx.anamorphic(img, 0.9 * burst, 0.7, (1.0, 0.82, 0.5))
    img = img + burst ** 3 * 0.35
    # site
    if t > URL_T - 0.4:
        p = smoothstep(URL_T - 0.4, URL_T + 0.9, t)
        trk = 22 * (1 - ease_out(p)) + 3
        m, col = url_img(trk, p)
        yu = 1450
        if p < 0.6: m = cv2.GaussianBlur(m, (0, 0), 3 * (1 - p / 0.6) + 0.01)
        reg = img[yu:yu + 120]
        img[yu:yu + 120] = reg * (1 - m[..., None]) + col[0] * m[..., None]
        # filete dourado acima do site
        lw_ = int(260 * ease_out(smoothstep(URL_T - 0.3, URL_T + 0.6, t)))
        if lw_ > 2:
            img[yu - 6:yu - 3, int(W / 2 - lw_):int(W / 2 + lw_)] += np.array([0.85, 0.65, 0.3], np.float32) * p
    # saida do branco do plano anterior
    if t < 0.6: img = img + (1 - t / 0.6) ** 2 * 1.4
    img = fx.finish(img, 0.022)
    if t > total - 1.1: img *= smoothstep(0, 1.1, total - t)
    return img
