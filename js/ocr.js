/*
 * OCR local com Tesseract.js (WebAssembly), carregado somente quando o
 * usuário pede. O reconhecimento roda no próprio aparelho: a imagem NÃO é
 * enviada a nenhum servidor. Na primeira vez, o navegador baixa o motor e o
 * dicionário de português da CDN pública (jsDelivr).
 */
(function (root) {
  'use strict';

  const TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  let loading = null;

  function loadEngine() {
    if (root.Tesseract) return Promise.resolve(root.Tesseract);
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = TESSERACT_URL;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.onload = () => (root.Tesseract ? resolve(root.Tesseract) : reject(new Error('Motor de OCR não carregou')));
      s.onerror = () => reject(new Error('Não foi possível baixar o motor de OCR. Verifique sua conexão.'));
      document.head.appendChild(s);
    });
    loading.catch(() => {
      loading = null;
    });
    return loading;
  }

  /** Reduz fotos muito grandes (iPhone ~12 MP) para acelerar o OCR. */
  function downscale(file, maxSide) {
    const max = maxSide || 2200;
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => resolve(b || file), 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  }

  async function recognize(file, onProgress) {
    const report = typeof onProgress === 'function' ? onProgress : () => {};
    report({ status: 'Carregando motor de OCR…', progress: 0 });
    const T = await loadEngine();
    const image = await downscale(file);
    const worker = await T.createWorker('por', 1, {
      // Dicionário de português servido junto com o app (tessdata/).
      langPath: new URL('tessdata/', document.baseURI).href,
      logger: (m) => {
        if (!m) return;
        const labels = {
          'loading tesseract core': 'Carregando motor…',
          'initializing tesseract': 'Inicializando…',
          'loading language traineddata': 'Baixando dicionário de português…',
          'initializing api': 'Preparando…',
          'recognizing text': 'Reconhecendo texto…',
        };
        report({ status: labels[m.status] || m.status, progress: m.progress || 0 });
      },
    });
    try {
      const res = await worker.recognize(image);
      return (res && res.data && res.data.text) || '';
    } finally {
      worker.terminate();
    }
  }

  root.OCR = { recognize, TESSERACT_URL };
})(typeof self !== 'undefined' ? self : this);
