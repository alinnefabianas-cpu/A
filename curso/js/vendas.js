/* Página de vendas: preço, link de compra, garantia e módulos vêm da configuração e do conteúdo. */
(function () {
  'use strict';

  const CFG = window.CURSO_CONFIG || {};
  const { COURSE, HERO } = window.Conteudo;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Imagem local quando existe (curso/img/), senão a hospedada.
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t.tagName === 'IMG' && t.dataset.remote && t.src !== t.dataset.remote) t.src = t.dataset.remote;
  }, true);

  const hero = document.getElementById('hero-img');
  hero.dataset.remote = HERO.imgRemote;
  hero.src = HERO.img;

  document.querySelectorAll('[data-cfg]').forEach((el) => {
    const v = CFG[el.dataset.cfg];
    if (v) el.textContent = v;
    else el.hidden = true;
  });

  const days = CFG.garantiaDias || 7;
  document.getElementById('guarantee').textContent = 'Garantia de ' + days + ' dias: se não gostar, devolvemos seu dinheiro.';
  document.getElementById('faq-guarantee').textContent =
    'Você tem ' + days + ' dias de garantia. Peça o reembolso pelo e-mail da compra e devolvemos o valor integral.';

  if (CFG.checkoutUrl) {
    document.querySelectorAll('[data-checkout]').forEach((a) => {
      a.href = CFG.checkoutUrl;
      a.rel = 'noopener';
    });
  } else {
    document.getElementById('soon').hidden = false;
  }

  document.getElementById('mods').innerHTML = COURSE.map(
    (m, i) =>
      '<article class="s-mod ' + m.kind + '">' +
      '<img src="' + esc(m.img) + '" data-remote="' + esc(m.imgRemote || '') + '" alt="" loading="lazy" decoding="async" width="1344" height="768">' +
      '<div class="s-mod-txt"><span class="s-tag">' + m.tag + ' · Módulo ' + (i + 1) + '</span><h3>' + esc(m.title) + '</h3>' +
      '<ul>' + m.lessons.map((l) => '<li>' + esc(l.title) + '</li>').join('') + '</ul></div></article>'
  ).join('');
})();
