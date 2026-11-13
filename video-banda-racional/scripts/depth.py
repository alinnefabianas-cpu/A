import numpy as np, cv2, torch
from transformers import AutoImageProcessor, AutoModelForDepthEstimation
torch.set_num_threads(4)
_P = AutoImageProcessor.from_pretrained('depth-anything/Depth-Anything-V2-Small-hf')
_M = AutoModelForDepthEstimation.from_pretrained('depth-anything/Depth-Anything-V2-Small-hf').eval()
def depth(img, size=518):
    """img float RGB 0..1 (HxW). Retorna disparidade relativa normalizada 0..1 (1 = perto), mesmo tamanho."""
    h, w = img.shape[:2]
    x = cv2.resize(img, (size, int(round(size * h / w / 14)) * 14), interpolation=cv2.INTER_AREA)
    inp = _P(images=(x * 255).astype(np.uint8), return_tensors='pt', do_resize=False)
    with torch.no_grad():
        d = _M(**inp).predicted_depth[0].numpy()
    d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)
    lo, hi = np.percentile(d, 1), np.percentile(d, 99.5)
    return np.clip((d - lo) / (hi - lo + 1e-6), 0, 1).astype(np.float32)
def refine(mask, guide, r=8, eps=1e-3):
    g = (np.clip(guide, 0, 1) * 255).astype(np.uint8)
    return np.clip(cv2.ximgproc.guidedFilter(g, mask.astype(np.float32), r, eps * 255 * 255), 0, 1)
