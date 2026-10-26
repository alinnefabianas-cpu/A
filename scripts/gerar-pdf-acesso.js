/*
 * Gera o PDF entregue ao comprador pelo Shopify Digital Products, com o link
 * do curso, o código de acesso e o passo a passo para criar a conta.
 * Lê curso/js/config.js. Uso:
 *   node scripts/gerar-pdf-acesso.js [saída.pdf]
 * Precisa do Playwright (Chromium) instalado.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'curso/js/config.js'), 'utf8'), sandbox);
const CFG = sandbox.window.CURSO_CONFIG;
const out = process.argv[2] || path.join(root, 'dist', 'do-corte-ao-pix-acesso.pdf');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

if (!CFG.siteUrl) console.warn('Aviso: siteUrl está vazio em curso/js/config.js; o PDF sai com um espaço para preencher.');
const url = CFG.siteUrl || '[endereço do curso]';
const cloud = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}
body{margin:0;font-family:Helvetica,Arial,sans-serif;color:#151726}
.top{background:#151726;color:#F2F3F8;padding:48px 56px}
.bar{display:flex;gap:6px;height:16px;margin-bottom:28px}.bar i{border-radius:4px}
h1{font-size:40px;margin:0 0 8px}p{font-size:15px;line-height:1.55;margin:0}
.main{padding:40px 56px}
.box{border:2px solid #151726;border-radius:16px;padding:22px 24px;margin-bottom:26px}
.k{font-family:monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#5B6078;margin-bottom:6px}
.v{font-size:22px;font-weight:700;word-break:break-all}a{color:#2F4BFF}
ol{padding-left:22px;margin:0}li{font-size:15px;line-height:1.55;margin-bottom:10px}
.foot{position:absolute;bottom:36px;left:56px;right:56px;font-size:12px;color:#5B6078}
</style></head><body>
<div class="top"><div class="bar"><i style="flex:3;background:#0E9A88"></i><i style="flex:1.2;background:#2F4BFF"></i><i style="flex:2;background:#D98B17"></i></div>
<h1>Do Corte ao Pix</h1><p>Obrigado pela compra! Aqui está tudo para você começar hoje.</p></div>
<div class="main">
<div class="box"><div class="k">Endereço do curso</div><div class="v"><a href="${esc(url)}">${esc(url)}</a></div></div>
${CFG.codigoAcesso ? `<div class="box"><div class="k">Seu código de acesso</div><div class="v">${esc(CFG.codigoAcesso)}</div></div>` : ''}
<div class="k">Como começar</div>
<ol>
<li>Abra o endereço acima no celular.</li>
<li>Toque em <b>Criar conta</b> e preencha ${cloud ? 'seu nome, e-mail e uma senha' : 'seu nome e uma senha'}${CFG.codigoAcesso ? ', junto com o código de acesso' : ''}.${cloud ? ' Depois confirme pelo link enviado ao seu e-mail.' : ''}</li>
<li>Responda às 4 perguntas para montar seu plano e faça a primeira aula.</li>
<li>Instale na tela inicial: no iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início. No Android, toque em Instalar quando o aviso aparecer.</li>
<li>Faça uma aula por dia. Seu progresso fica salvo ${cloud ? 'na sua conta, em qualquer aparelho' : 'na sua conta neste aparelho'}.</li>
</ol>
</div>
<div class="foot">Garantia de ${CFG.garantiaDias || 7} dias: se não gostar, responda o e-mail da compra pedindo o reembolso.</div>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.setContent(html);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await p.pdf({ path: out, format: 'A4', printBackground: true });
  await b.close();
  console.log('PDF gerado em', out);
})();
