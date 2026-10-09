/*
 * Dopamine Rewire — camada mínima de analytics do quiz.
 *
 * O projeto não tem ferramenta de analytics. Esta camada só repassa eventos:
 *   - para window.dataLayer (Google Tag Manager), se existir;
 *   - como CustomEvent 'dr:analytics' em window, para qualquer integração;
 *   - para o console em ambiente de desenvolvimento.
 * Nenhuma resposta individual nem dado pessoal é enviado.
 *
 * 'subscription_confirmed' NÃO é disparado pelo quiz: deve ser registrado
 * somente após a confirmação real do pagamento (webhook do provedor/backend).
 */
(function (root) {
  'use strict';

  const EVENTS = [
    'quiz_started',
    'quiz_question_answered',
    'quiz_completed',
    'quiz_result_viewed',
    'offer_viewed',
    'offer_clicked',
    'checkout_started',
    'subscription_confirmed',
  ];
  // Campos permitidos nos eventos; qualquer outro é descartado.
  const ALLOWED_PROPS = ['question', 'total_questions', 'profile', 'destination'];

  const isDev = () => {
    const h = root.location ? root.location.hostname : '';
    return !h || h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.local');
  };

  function track(name, props) {
    if (EVENTS.indexOf(name) === -1) {
      if (isDev()) console.warn('[analytics] evento desconhecido:', name);
      return;
    }
    const clean = {};
    Object.keys(props || {}).forEach((k) => {
      if (ALLOWED_PROPS.indexOf(k) !== -1 && props[k] !== undefined && props[k] !== null) clean[k] = props[k];
    });
    try {
      if (Array.isArray(root.dataLayer)) root.dataLayer.push(Object.assign({ event: name }, clean));
      root.dispatchEvent(new CustomEvent('dr:analytics', { detail: { name, props: clean } }));
      if (isDev()) console.debug('[analytics]', name, clean);
    } catch (e) {
      /* analytics nunca pode quebrar o quiz */
    }
  }

  root.DRAnalytics = { track, EVENTS, isDev };
})(window);
