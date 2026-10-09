/*
 * Dopamine Rewire — configuração da oferta do quiz.
 *
 * Edite somente este arquivo para publicar preço, checkout e benefícios.
 * Enquanto um campo estiver vazio, nada fictício é mostrado ao visitante;
 * em ambiente de desenvolvimento (localhost) aparece um aviso de configuração.
 *
 * Nunca coloque chaves secretas aqui: este arquivo é público.
 */
window.DR_QUIZ_CONFIG = {
  productName: 'Dopamine Rewire',

  // Preço mensal. Ex.: { amount: 29.9, currency: 'BRL', period: 'mês' }
  // null = preço ainda não definido (não é exibido para visitantes).
  price: null,

  // URL do checkout já existente (ex.: link de pagamento do provedor).
  // A confirmação da assinatura deve vir do provedor/backend, nunca deste clique.
  checkoutUrl: null,

  // Página do produto, usada se não houver checkout.
  productUrl: null,

  // Benefícios REAIS, correspondentes a funcionalidades que já existem no
  // miniapp. Ex.: ['Plano diário com uma prioridade por vez', ...]
  benefits: [],

  // Se true, o perfil do resultado (ex.: "distracoes") vai junto dos eventos
  // de analytics. As respostas individuais nunca são enviadas.
  analyticsIncludeProfile: true,
};
