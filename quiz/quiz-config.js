/*
 * Dopamine Rewire — configuração da apresentação e da oferta do quiz.
 *
 * Edite somente este arquivo para publicar preço, checkout, funcionalidades e
 * condições de cobrança. Enquanto um campo estiver vazio, nada fictício é
 * mostrado ao visitante; em ambiente de desenvolvimento (localhost) aparece um
 * aviso dizendo o que falta configurar.
 *
 * A logo oficial é lida de quiz/assets/logo.png (veja quiz/assets/LEIA-ME.md).
 *
 * Nunca coloque chaves secretas aqui: este arquivo é público.
 */
window.DR_QUIZ_CONFIG = {
  productName: 'Dopamine Rewire',

  // Nome do plano exibido no cartão de assinatura.
  planName: 'Assinatura mensal',

  // Preço mensal. Ex.: { amount: 29.9, currency: 'BRL', period: 'mês' }
  // null = preço ainda não definido (não é exibido para visitantes).
  price: null,

  // Condições REAIS de cobrança e cancelamento, exatamente como no checkout.
  // Ex.: 'Cobrança mensal recorrente. Cancele quando quiser pelo app.'
  billingNote: null,

  // Nome do provedor de pagamento (ex.: 'Stripe'), mostrado como item de confiança.
  paymentProvider: null,

  // URL do checkout já existente (ex.: link de pagamento do provedor).
  // A confirmação da assinatura deve vir do provedor/backend, nunca deste clique.
  checkoutUrl: null,

  // Página do produto, usada se não houver checkout.
  productUrl: null,

  // Funcionalidades REAIS do miniapp, para os cartões da apresentação.
  // icon: 'focus' | 'list' | 'calendar' | 'check' | 'timer' | 'chart' | 'bell'
  // Ex.: [{ icon: 'list', title: 'Prioridade do dia', text: 'Escolha uma tarefa por vez.' }]
  features: [],

  // Benefícios REAIS listados no cartão de assinatura.
  benefits: [],

  // Capturas de tela reais do miniapp (caminhos de imagem, retrato 9:19,5).
  // Vazio = o celular mostra uma prévia montada com o resultado do próprio visitante.
  screenshots: [],

  // Se true, o perfil do resultado (ex.: "distracoes") vai junto dos eventos
  // de analytics. As respostas individuais nunca são enviadas.
  analyticsIncludeProfile: true,
};
