"""Letras monumentais em 3D (extrusao + chanfro + ouro polido) e composicao com rastreamento/oclusao."""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

FONT = "/tmp/claude-0/br/fonts/Cinzel[wght].ttf"

def _line_mask(text, size, tracking):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_name("Black")
    except Exception: pass
    widths = [f.getlength(c) for c in text]
    tw = int(sum(widths) + tracking * (len(text) - 1)) + 4
    asc, desc = f.getmetrics()
    im = Image.new("L", (tw, asc + desc + 4), 0); d = ImageDraw.Draw(im); x = 2
    for c, w in zip(text, widths):
        d.text((x, 2), c, font=f, fill=255); x += w + tracking
    a = np.array(im, np.float32) / 255
    ys = np.where(a.max(1) > 0.05)[0]
    return a[ys[0]:ys[-1] + 1]

def make(lines, depth=46, extrude=(0.0, 1.0), gap=40, pad=80,
         face_top=(1.0, 0.90, 0.58), face_mid=(0.92, 0.66, 0.24), face_bot=(0.52, 0.32, 0.08),
         side_near=(0.42, 0.26, 0.07), side_far=(0.10, 0.06, 0.02)):
    masks = [_line_mask(*l) for l in lines]
    w = max(m.shape[1] for m in masks) + 2 * pad
    h = sum(m.shape[0] for m in masks) + gap * (len(masks) - 1) + 2 * pad + depth
    M = np.zeros((h, w), np.float32); y = pad + (depth if extrude[1] < 0 else 0)
    line_boxes = []
    for m in masks:
        x = (w - m.shape[1]) // 2; M[y:y + m.shape[0], x:x + m.shape[1]] = m
        line_boxes.append((y, y + m.shape[0])); y += m.shape[0] + gap
    # --- face: chanfro + iluminacao ---
    b = 9.0
    dist = cv2.distanceTransform((M > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    hgt = np.clip(dist / b, 0, 1); hgt = np.sin(hgt * np.pi / 2)
    hgt = cv2.GaussianBlur(hgt, (0, 0), 1.2)
    gx = cv2.Sobel(hgt, cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(hgt, cv2.CV_32F, 0, 1, ksize=3)
    nz = np.ones_like(gx) * 0.35
    nrm = np.sqrt(gx ** 2 + gy ** 2 + nz ** 2)
    nx, ny, nzz = -gx / nrm, -gy / nrm, nz / nrm
    L = np.array([-0.45, -0.65, 0.62]); L /= np.linalg.norm(L)
    diff = np.clip(nx * L[0] + ny * L[1] + nzz * L[2], 0, 1)
    Hh = L + np.array([0, 0, 1.0]); Hh /= np.linalg.norm(Hh)
    spec = np.clip(nx * Hh[0] + ny * Hh[1] + nzz * Hh[2], 0, 1) ** 40
    # gradiente de ouro por linha + faixa de reflexo ambiente
    col = np.zeros((h, w, 3), np.float32)
    yy = np.arange(h, dtype=np.float32)[:, None]
    ft, fm, fb = map(lambda c: np.array(c, np.float32), (face_top, face_mid, face_bot))
    for (y0, y1) in line_boxes:
        t = np.clip((yy - y0) / max(1, y1 - y0), 0, 1)[..., None]
        g = np.where(t < 0.45, ft + (fm - ft) * (t / 0.45), fm + (fb - fm) * ((t - 0.45) / 0.55))
        band = np.exp(-((t - 0.40) / 0.06) ** 2) * 0.35
        g = g + band
        sel = (yy >= y0 - 12) & (yy <= y1 + 12)
        col = np.where(sel[..., None], np.broadcast_to(g, (h, w, 3)) if g.shape[1] == 1 else g, col)
    face = col * (0.45 + 0.75 * diff[..., None]) + spec[..., None] * np.array([1.0, 0.95, 0.85]) * 0.9
    # --- extrusao (lados) ---
    side_rgb = np.zeros((h, w, 3), np.float32); side_a = np.zeros((h, w), np.float32)
    sn, sf_ = np.array(side_near, np.float32), np.array(side_far, np.float32)
    for i in range(depth, 0, -1):
        Mt = cv2.warpAffine(M, np.float32([[1, 0, extrude[0] * i], [0, 1, extrude[1] * i]]), (w, h))
        k = i / depth
        c = sn + (sf_ - sn) * k ** 0.8
        # leve variacao para parecer metal escovado
        side_rgb = side_rgb * (1 - Mt[..., None]) + c * Mt[..., None]
        side_a = np.maximum(side_a, Mt)
    # aresta clara na transicao face/lado
    edge = np.clip(cv2.dilate(M, np.ones((3, 3), np.uint8)) - M, 0, 1)
    rgb = side_rgb * (1 - M[..., None]) + face * M[..., None] + edge[..., None] * np.array([1.0, 0.85, 0.5]) * 0.6
    a = np.maximum(side_a, M)
    return dict(rgb=np.clip(rgb, 0, 1.4).astype(np.float32), a=a.astype(np.float32), face=M.astype(np.float32), size=(w, h),
                baseline=line_boxes[-1][1] + (depth if extrude[1] > 0 else 0), top=line_boxes[0][0])

def composite(bg, T, Hm, occ=None, clip_y=None, rise=0.0, alpha=1.0, haze=(0.0, (0.7, 0.8, 0.95)),
              glint=None, blur=0.0, shadow=0.0):
    """bg: frame float32; T: layer de make(); Hm: homografia plano->quadro.
    rise: deslocamento (px do plano) para baixo; clip_y: linha do chao no plano (some abaixo dela)."""
    w, h = T["size"]
    rgb, a, face = T["rgb"], T["a"], T["face"]
    if rise:
        Mr = np.float32([[1, 0, 0], [0, 1, rise]])
        rgb = cv2.warpAffine(rgb, Mr, (w, h)); a = cv2.warpAffine(a, Mr, (w, h)); face = cv2.warpAffine(face, Mr, (w, h))
    if clip_y is not None:
        a = a.copy(); yy = np.arange(h)[:, None]
        a *= np.clip((clip_y - yy) / 3.0, 0, 1)
    if glint is not None:  # faixa de brilho diagonal varrendo a face
        xx = np.arange(w)[None, :]; yy = np.arange(h)[:, None]
        d = (xx + yy * 0.6) - glint * (w + h * 0.6)
        band = np.exp(-(d / 70.0) ** 2) * 0.9 + np.exp(-(d / 260.0) ** 2) * 0.25
        rgb = rgb + (face * band)[..., None] * np.array([1.0, 0.95, 0.8], np.float32)
    Hh, Ww = bg.shape[:2]
    pre = rgb * a[..., None]
    wp = cv2.warpPerspective(pre, Hm, (Ww, Hh), flags=cv2.INTER_LINEAR)
    wa = cv2.warpPerspective(a, Hm, (Ww, Hh), flags=cv2.INTER_LINEAR)
    if blur > 0:
        wp = cv2.GaussianBlur(wp, (0, 0), blur); wa = cv2.GaussianBlur(wa, (0, 0), blur)
    hz, hc = haze
    if hz > 0:
        wp = wp * (1 - hz) + wa[..., None] * np.array(hc, np.float32) * hz
    wa = wa * alpha; wp = wp * alpha
    if occ is not None:
        keep = 1 - occ
        wa = wa * keep; wp = wp * keep[..., None]
    out = bg * (1 - wa[..., None]) + wp
    return out, wa
