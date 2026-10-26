/*
 * Configuração do curso — único arquivo a editar para publicar.
 */
window.CURSO_CONFIG = {
  /*
   * Login na nuvem (progresso sincronizado entre aparelhos) com Supabase.
   * Crie um projeto grátis em supabase.com, rode curso/supabase.sql no
   * SQL Editor e cole aqui a "Project URL" e a "anon public key"
   * (Project Settings → API). Vazio = contas locais, salvas só no aparelho.
   */
  supabaseUrl: '',
  supabaseAnonKey: '',

  /*
   * Código enviado ao comprador (no arquivo entregue pelo Shopify) e pedido
   * na criação da conta. É uma barreira simples: fica visível no código da
   * página, então não substitui um controle de acesso no servidor.
   * Vazio = qualquer pessoa pode criar conta.
   */
  codigoAcesso: '',

  /* Endereço público do curso (ex.: https://seusite.com/curso/). Vai no PDF entregue ao comprador. */
  siteUrl: '',

  /* Página de vendas */
  preco: 'R$ 97',
  precoDe: '', // preço "de" riscado; use só se o curso já foi vendido por esse valor
  parcelas: '', // ex.: 'ou 12x de R$ 9,70' (confira o valor no seu checkout)
  // Link do produto na sua loja Shopify (ex.: https://sualoja.com/products/do-corte-ao-pix)
  checkoutUrl: '',
  garantiaDias: 7,
};
