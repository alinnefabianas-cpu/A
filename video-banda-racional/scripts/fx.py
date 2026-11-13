"""Efeitos de imagem compartilhados (float32 RGB 0..1, 1080x1920)."""
import numpy as np, cv2

W, H = 1080, 1920
_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
_r = np.sqrt(((_xx - W / 2) / (W / 2)) ** 2 * 0.6 + ((_yy - H / 2) / (H / 2)) ** 2)
VIG = np.clip(1 - 0.55 * np.clip(_r - 0.35, 0, None) ** 1.6, 0, 1)[..., None].astype(np.float32)

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def ease_out(t): t = np.clip(t, 0, 1); return 1 - (1 - t) ** 3
def ease_inout(t): t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)

def grade(img, look="epic", amt=1.0):
    x = img
    if look == "dark":      # misterio: escuro, frio, dessaturado
        x = x * 0.78
        lum = x @ np.array([0.299, 0.587, 0.114], np.float32)
        x = lum[..., None] + (x - lum[..., None]) * 0.55
        x = np.clip(x, 0, 1)
        x = x ** 1.25
        sh = (1 - lum[..., None]) ** 2
        x = x + sh * np.array([-0.02, 0.01, 0.04], np.float32)
        x = x + (lum[..., None] ** 2) * np.array([0.05, 0.03, -0.01], np.float32)
    else:                   # epico: contraste, dourado nas luzes, teal nas sombras
        x = np.clip((x - 0.03) / 0.97, 0, 1)
        x = x * 1.02
        lum = x @ np.array([0.299, 0.587, 0.114], np.float32)
        x = lum[..., None] + (x - lum[..., None]) * 1.08
        x = np.clip(x, 0, 1)
        # curva S suave
        x = x + 0.6 * (x - 0.5) * x * (1 - x)
        sh = (1 - lum[..., None]) ** 3
        hi = lum[..., None] ** 2
        x = x + sh * np.array([-0.025, 0.005, 0.03], np.float32) + hi * np.array([0.035, 0.018, -0.03], np.float32)
        # roll-off das altas luzes (brancos nao estouram)
        x = np.where(x > 0.85, 0.85 + (x - 0.85) * 0.6, x)
    return np.clip(x, 0, 1)

def bloom(img, strength=0.22, thr=0.72, tint=(1.0, 0.92, 0.78)):
    small = cv2.resize(img, (W // 6, H // 6), interpolation=cv2.INTER_AREA)
    lum = small.max(2, keepdims=True)
    b = np.clip((small - thr) / (1 - thr), 0, 1) * (lum > thr)
    b = cv2.GaussianBlur(b, (0, 0), 9) + cv2.GaussianBlur(b, (0, 0), 3) * 0.5
    b = cv2.resize(b, (W, H), interpolation=cv2.INTER_LINEAR)
    return img + b * strength * np.array(tint, np.float32)

def anamorphic(img, strength=0.5, thr=0.85, color=(0.55, 0.75, 1.0)):
    small = cv2.resize(img, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    lum = small.max(2)
    m = np.clip((lum - thr) / (1 - thr), 0, 1) ** 2
    s = cv2.GaussianBlur(m, (0, 0), sigmaX=60, sigmaY=0.8)
    s = cv2.resize(s, (W, H))[..., None]
    return img + s * strength * np.array(color, np.float32)

def sharpen(img, amt=0.35):
    bl = cv2.GaussianBlur(img, (0, 0), 1.4)
    return img + (img - bl) * amt

_grain_rng = np.random.default_rng(3)
def grain(img, amt=0.03):
    g = _grain_rng.standard_normal((H // 2, W // 2)).astype(np.float32)
    g = cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)
    lum = img.mean(2, keepdims=True)
    return img + g[..., None] * amt * (0.4 + 0.6 * (1 - np.abs(lum - 0.5) * 2))

def light_leak(t, seed=0, strength=0.35):
    rng = np.random.default_rng(seed)
    cx = W * (0.2 + 0.6 * rng.random()) + np.sin(t * 0.9 + seed) * 260
    cy = H * (0.15 + 0.7 * rng.random()) + np.cos(t * 0.6 + seed) * 300
    rad = 900 + 200 * np.sin(t * 0.5)
    d = np.sqrt((_xx - cx) ** 2 + (_yy - cy) ** 2) / rad
    m = np.exp(-d ** 2 * 2.2)[..., None]
    col = np.array([1.0, 0.62, 0.25], np.float32) if seed % 2 == 0 else np.array([1.0, 0.82, 0.45], np.float32)
    return m * col * strength

def zoom_blur(img, amount=0.06, steps=6):
    acc = img.copy()
    for i in range(1, steps):
        s = 1 + amount * i / steps
        M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, s)
        acc += cv2.warpAffine(img, M, (W, H), borderMode=cv2.BORDER_REFLECT)
    return acc / steps

def dir_blur(img, dx, dy):
    k = int(max(abs(dx), abs(dy)))
    if k < 2: return img
    ker = np.zeros((2 * k + 1, 2 * k + 1), np.float32)
    cv2.line(ker, (k - int(dx), k - int(dy)), (k + int(dx), k + int(dy)), 1.0, 1)
    ker /= ker.sum()
    return cv2.filter2D(img, -1, ker, borderType=cv2.BORDER_REFLECT)

def finish(img, grain_amt=0.028, vig=True):
    x = img
    if vig: x = x * VIG
    x = grain(x, grain_amt)
    return np.clip(x, 0, 1)
