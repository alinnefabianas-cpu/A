/*
 * Conteúdo do curso "Do Corte ao Pix": módulos, aulas, scripts e checklist.
 * Tipos de cartão: text, tip, list, table, quiz, task.
 * Em **negrito** vira destaque; "|" separa parágrafos.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Conteudo = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const COURSE = [
  { id:"m1", img:"img/m1.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_221826_9aab73b0-fc29-4b43-8f8a-c449e96aeeb7_min.webp", tag:"V1", kind:"v", title:"Fundamentos da edição", lessons:[
    { id:"m1l1", title:"O que um editor realmente vende", min:4, cards:[
      {t:"text", h:"Você não vende cortes. Vende atenção.", b:"Quem contrata um editor quer que **as pessoas assistam até o final**, sigam o perfil e comprem. A edição é a ferramenta; retenção e resultado são o produto.|Quando você entende isso, para de competir por preço e passa a competir por resultado."},
      {t:"list", h:"Quem paga por edição hoje", items:[
        ["Criadores de conteúdo","Reels, TikTok e Shorts toda semana. Demanda constante."],
        ["Negócios locais","Clínicas, restaurantes, imobiliárias e academias que precisam postar."],
        ["Infoprodutores","Aulas, anúncios, lançamentos e vídeos de vendas."],
        ["Podcasts","Cortes curtos de episódios longos. Muito volume."],
        ["Eventos","Casamentos, aniversários e eventos corporativos."]]},
      {t:"tip", b:"O mercado de vídeos curtos é o melhor ponto de partida: projetos rápidos, clientes recorrentes e você aprende rápido com cada entrega."},
      {t:"quiz", q:"Um cliente pede um Reels. O que ele mais valoriza?", opts:["Efeitos complexos e transições chamativas","Que as pessoas assistam até o final e engajem","Que você use o software mais caro","Um vídeo bem longo"], a:1, why:"Efeitos só importam se ajudam a reter. O cliente mede sucesso por visualizações completas, seguidores e vendas."},
      {t:"task", h:"Estude 3 vídeos que prenderam você", b:"Abra seu feed e salve 3 vídeos que você assistiu até o fim. Anote para cada um: o que aparece nos 3 primeiros segundos, a cada quantos segundos a imagem muda e se há legenda na tela."}
    ]},
    { id:"m1l2", title:"Escolhendo seu software", min:4, cards:[
      {t:"text", h:"Comece com o que você tem", b:"Você não precisa de um computador caro para começar. Muita gente fatura os primeiros R$ 1.000 editando **só no celular**.|O importante é dominar uma ferramenta, não conhecer todas."},
      {t:"table", h:"As ferramentas que o mercado usa", head:["App","Onde","Custo","Melhor para"], rows:[
        ["CapCut","Celular e PC","Grátis / Pro","Vídeos curtos, legendas automáticas"],
        ["DaVinci Resolve","PC / Mac","Grátis","Edição profissional e cor"],
        ["Premiere Pro","PC / Mac","Assinatura","Padrão de agências e YouTube"],
        ["After Effects","PC / Mac","Assinatura","Motion graphics e animação"]]},
      {t:"tip", b:"Caminho recomendado: CapCut para conseguir os primeiros clientes. Depois, DaVinci Resolve ou Premiere para cobrar mais em projetos longos."},
      {t:"quiz", q:"Você só tem celular. Qual é o melhor primeiro passo?", opts:["Esperar até comprar um computador","Aprender CapCut e começar com vídeos curtos","Baixar o After Effects no celular","Fazer um curso de cinema primeiro"], a:1, why:"O CapCut no celular é suficiente para Reels, TikTok e Shorts, que é exatamente o serviço com mais demanda para iniciantes."},
      {t:"task", h:"Instale e importe", b:"Instale o editor escolhido, crie um projeto em formato vertical 9:16 (1080×1920) e importe 3 clipes do seu rolo de câmera. Só isso. O objetivo é perder o medo da tela."}
    ]},
    { id:"m1l3", title:"Timeline, cortes e ritmo", min:5, cards:[
      {t:"text", h:"A timeline é sua mesa de trabalho", b:"Tudo acontece na linha do tempo: os **clipes de vídeo** ficam nas faixas de cima (V1, V2) e o **áudio** nas de baixo (A1, A2). Da esquerda para a direita é o tempo passando.|Editar é decidir o que fica, o que sai e em que ordem."},
      {t:"list", h:"Os 5 cortes que você vai usar todo dia", items:[
        ["Corte seco","Troca direta de um plano para outro. É 90% da edição."],
        ["Jump cut","Corta pausas dentro da mesma fala. Deixa o vídeo rápido."],
        ["J-cut","O áudio da próxima cena começa antes da imagem."],
        ["L-cut","O áudio da cena anterior continua sobre a nova imagem."],
        ["B-roll","Imagens de apoio que ilustram o que está sendo dito."]]},
      {t:"tip", b:"Regra de ouro do ritmo: corte todo silêncio, todo \"éééé\" e toda respiração longa. Um vídeo de 60 segundos bruto costuma virar 35 a 40 segundos editado."},
      {t:"quiz", q:"A pessoa termina de falar e a voz dela continua enquanto aparece uma imagem do produto. Que corte é esse?", opts:["Jump cut","J-cut","L-cut","Corte seco"], a:2, why:"No L-cut o áudio da cena anterior se estende sobre a nova imagem. O desenho do áudio na timeline forma um L."},
      {t:"task", h:"Seu primeiro corte de ritmo", b:"Grave 1 minuto falando sobre qualquer assunto. Na edição, remova todas as pausas e vícios de fala até o vídeo ficar com menos de 40 segundos. Compare o antes e o depois."}
    ]}
  ]},
  { id:"m2", img:"img/m2.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_221827_9c1fef8e-b4cd-4941-838f-495c7e1e5934_min.webp", tag:"V2", kind:"v", title:"Vídeos curtos que retêm", lessons:[
    { id:"m2l1", title:"O gancho dos 3 segundos", min:4, cards:[
      {t:"text", h:"Quem perde os 3 primeiros segundos perde o vídeo", b:"As plataformas mostram o vídeo para mais pessoas quando ele segura quem começou a assistir. Por isso o começo é a parte **mais importante** da edição.|Como editor, você pode reorganizar o material para que a melhor frase venha primeiro."},
      {t:"list", h:"4 ganchos que você monta na edição", items:[
        ["Resultado primeiro","Mostre o antes e depois ou o final logo no início."],
        ["Pergunta direta","\"Você sabia que está fazendo isso errado?\""],
        ["Contradição","\"Pare de beber água assim.\""],
        ["Movimento","Imagem que já começa em ação, nunca parada."]]},
      {t:"tip", b:"Coloque um texto grande na tela já no primeiro frame. Muita gente assiste sem som e decide em 1 segundo se fica."},
      {t:"quiz", q:"O cliente mandou um vídeo em que a melhor frase aparece no segundo 25. O que fazer?", opts:["Manter a ordem original","Trazer essa frase para o início como gancho","Cortar a frase para o vídeo ficar menor","Colocar uma música mais alta"], a:1, why:"Reorganizar o material para abrir com o trecho mais forte é uma das coisas que mais aumenta retenção."},
      {t:"task", h:"Reedite um gancho", b:"Pegue um vídeo seu ou de banco gratuito (Pexels, Mixkit). Faça duas versões: uma na ordem original e uma abrindo com o momento mais forte e um texto na tela. Mostre as duas para alguém e pergunte qual prende mais."}
    ]},
    { id:"m2l2", title:"Legendas, zooms e B-roll", min:5, cards:[
      {t:"text", h:"O trio que faz um vídeo parecer profissional", b:"Os vídeos curtos que performam bem quase sempre têm **legendas dinâmicas**, **zooms nas frases importantes** e **B-roll** ilustrando o que é dito.|Juntos, eles fazem a imagem mudar a cada poucos segundos, e é isso que prende o olho."},
      {t:"list", h:"Padrões que os clientes pedem", items:[
        ["Legenda","2 a 4 palavras por vez, palavra-chave em cor de destaque."],
        ["Zoom","Leve aproximação a cada 3 a 5 segundos ou nas frases de impacto."],
        ["B-roll","Cubra trechos longos de fala com imagens do que é dito."],
        ["Safe zone","Deixe textos fora dos 20% de baixo e da lateral direita, onde ficam botões do app."]]},
      {t:"tip", b:"Use a legenda automática para ganhar tempo, mas sempre revise. Um erro de português na legenda é o motivo número 1 de reclamação de cliente."},
      {t:"quiz", q:"Onde NÃO colocar a legenda num Reels?", opts:["No centro da tela","Logo acima do meio","Na parte de baixo, sobre a descrição do post","Um pouco abaixo do rosto"], a:2, why:"A parte de baixo é coberta pela descrição, nome do perfil e botões. Texto ali fica escondido."},
      {t:"task", h:"Monte o pacote completo", b:"Edite um vídeo de 30 a 45 segundos com legenda dinâmica revisada, pelo menos 3 zooms e 2 trechos de B-roll. Esse vídeo já pode entrar no seu portfólio."}
    ]},
    { id:"m2l3", title:"Som: a metade que ninguém vê", min:4, cards:[
      {t:"text", h:"Áudio ruim derruba vídeo bom", b:"As pessoas toleram imagem simples, mas abandonam um vídeo com **voz baixa, chiado ou música alta demais**.|Cuidar do som é um diferencial rápido de aprender e que poucos iniciantes fazem."},
      {t:"list", h:"Checklist de som", items:[
        ["Voz em primeiro lugar","A voz deve ser o som mais claro do vídeo."],
        ["Música de fundo baixa","Bem abaixo da voz. Se você precisa se esforçar para ouvir a fala, está alta."],
        ["Efeitos sonoros","Whoosh nas transições, pop nos textos, riser antes de uma revelação."],
        ["Limpeza","Use redução de ruído para tirar chiado e eco."]]},
      {t:"tip", b:"Use apenas músicas da biblioteca do app ou de bancos com licença. Música protegida pode tirar o som do vídeo do cliente ou derrubar o post."},
      {t:"quiz", q:"O cliente diz que o vídeo está \"cansativo\", mas a imagem está boa. Qual a causa mais provável?", opts:["Falta de filtro de cor","Áudio monótono, sem efeitos e com música alta","O vídeo está em 9:16","As legendas estão revisadas"], a:1, why:"Sound design dá ritmo. Efeitos sonoros pontuais e música no volume certo deixam o vídeo mais dinâmico."},
      {t:"task", h:"Refaça só o áudio", b:"Pegue o vídeo da aula anterior e mexa apenas no som: abaixe a música, adicione 4 efeitos sonoros e limpe ruídos. Assista de novo com fone. A diferença costuma surpreender."}
    ]}
  ]},
  { id:"m3", img:"img/m3.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_221829_6fff58a9-f46e-4e59-a167-da5a45800f1e_min.webp", tag:"V3", kind:"v", title:"Edição em nível profissional", lessons:[
    { id:"m3l1", title:"Correção e estilo de cor", min:5, cards:[
      {t:"text", h:"Primeiro corrigir, depois estilizar", b:"**Correção de cor** deixa a imagem natural: branco parece branco, nada estourado, nada escuro demais.|**Grading** é o estilo: mais quente, mais frio, mais cinematográfico. Fazer o grading antes de corrigir é o erro mais comum."},
      {t:"list", h:"Ordem de trabalho", items:[
        ["1. Balanço de branco","Ajuste a temperatura até o branco parecer neutro."],
        ["2. Exposição e contraste","Recupere áreas estouradas e sombras."],
        ["3. Tons de pele","Pele com aparência saudável é o que o cliente mais nota."],
        ["4. Estilo","Só agora aplique um LUT ou look, com intensidade moderada."]]},
      {t:"tip", b:"Use os escopos (forma de onda e vetorscópio) do DaVinci ou Premiere. Eles mostram a verdade mesmo quando a tela do seu monitor ou celular engana."},
      {t:"quiz", q:"Qual é a ordem correta?", opts:["Aplicar LUT, depois corrigir o branco","Corrigir branco e exposição, depois aplicar o estilo","Só aumentar a saturação","Escurecer tudo para parecer cinema"], a:1, why:"Um LUT espera uma imagem já corrigida. Aplicado sobre uma imagem errada, ele amplifica o erro."},
      {t:"task", h:"Corrija 3 clipes diferentes", b:"Escolha um clipe amarelado (luz de casa), um azulado (sombra) e um estourado (sol). Corrija os três até ficarem naturais e parecidos entre si."}
    ]},
    { id:"m3l2", title:"Motion graphics e templates", min:4, cards:[
      {t:"text", h:"Animação simples já vale mais", b:"Títulos animados, setas, contadores e barras de nome (lower thirds) **elevam o preço** do seu serviço. Você não precisa ser animador: dominar keyframes e easing resolve a maioria dos pedidos."},
      {t:"list", h:"O básico de animação", items:[
        ["Keyframe","Marca um valor (posição, escala) em um ponto do tempo."],
        ["Easing","Acelera e desacelera o movimento para ele parecer natural."],
        ["Lower third","Barra com nome e cargo de quem fala."],
        ["Templates","Elementos prontos que você reaproveita em todo projeto."]]},
      {t:"tip", b:"Crie um template por cliente: fontes, cores, posição da legenda e vinheta. Seu segundo vídeo para ele vai levar metade do tempo do primeiro."},
      {t:"quiz", q:"Por que um texto animado parece \"robótico\"?", opts:["Falta de easing no movimento","A fonte é pequena","O vídeo é vertical","Tem legenda demais"], a:0, why:"Sem easing o movimento tem velocidade constante, o que não acontece na vida real. Suavizar entrada e saída resolve."},
      {t:"task", h:"Monte seu kit de templates", b:"Crie e salve 3 elementos: um título de abertura, um lower third e um estilo de legenda. Use as mesmas cores e fontes nos três."}
    ]},
    { id:"m3l3", title:"Fluxo de trabalho rápido", min:4, cards:[
      {t:"text", h:"Velocidade é lucro", b:"Se você cobra R$ 100 por vídeo e leva 4 horas, ganha R$ 25 por hora. Se leva 1 hora, ganha R$ 100 por hora. **Ficar rápido é a forma mais simples de aumentar a renda** sem subir preço."},
      {t:"list", h:"Hábitos de editores rápidos", items:[
        ["Pastas padrão","Brutos, Áudio, Gráficos, Exportados, em todo projeto."],
        ["Atalhos","Aprenda os atalhos de corte, zoom e desfazer. Use até virar reflexo."],
        ["Proxies","Arquivos leves para editar 4K em computador mais fraco."],
        ["Preset de exportação","Reels: 1080×1920, H.264, 30 fps. Salve e reutilize."],
        ["Backup","Guarde o projeto até o cliente aprovar e pagar."]]},
      {t:"tip", b:"Antes de enviar, assista uma vez sem som e uma vez só ouvindo. Você vai achar erros de legenda e de áudio que passaram despercebidos."},
      {t:"quiz", q:"Qual é o maior ganho de renda sem aumentar o preço?", opts:["Usar mais efeitos","Reduzir o tempo de edição por vídeo","Exportar em 8K","Mandar mais versões para o cliente"], a:1, why:"Menos horas por vídeo significa mais vídeos por mês e um valor por hora muito maior."},
      {t:"task", h:"Cronometre-se", b:"Edite um vídeo curto cronometrando o tempo. Repita a mesma edição com outro material usando suas pastas, templates e preset. Anote quanto tempo economizou."}
    ]}
  ]},
  { id:"m4", img:"img/m4.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_222042_8a433c02-0a25-4979-be2d-abcb00d13046_min.webp", tag:"A1", kind:"a", title:"Portfólio que vende", lessons:[
    { id:"m4l1", title:"Portfólio sem ter clientes", min:4, cards:[
      {t:"text", h:"Ninguém precisa te contratar para você ter portfólio", b:"Use **projetos de demonstração**: vídeos que você edita por conta própria para mostrar do que é capaz. É assim que quase todo editor consegue o primeiro cliente."},
      {t:"list", h:"Fontes de material", items:[
        ["Seu próprio conteúdo","Grave você mesmo, amigos ou familiares."],
        ["Bancos gratuitos","Pexels, Pixabay e Mixkit têm vídeos livres para uso."],
        ["Negócios próximos","Ofereça 1 vídeo grátis para um comércio local em troca de usar no portfólio."],
        ["Antes e depois","Mostre o bruto e o editado lado a lado. É o que mais convence."]]},
      {t:"tip", b:"Não publique como seu trabalho vídeos de criadores que não autorizaram. Para reeditar material de terceiros, peça permissão antes."},
      {t:"quiz", q:"Qual peça de portfólio convence mais um cliente?", opts:["Um vídeo cheio de transições aleatórias","Um antes e depois no nicho do cliente","Um certificado de curso","Uma lista de softwares que você usa"], a:1, why:"O cliente quer imaginar o resultado no próprio conteúdo. Antes e depois no nicho dele mostra exatamente isso."},
      {t:"task", h:"Produza 3 peças", b:"Crie 3 vídeos de demonstração no estilo que você quer vender. Para pelo menos um deles, salve também a versão bruta para montar um antes e depois."}
    ]},
    { id:"m4l2", title:"Demo reel de 60 segundos", min:3, cards:[
      {t:"text", h:"Seu cartão de visitas em vídeo", b:"O demo reel junta os **melhores momentos** de vários trabalhos em até 60 segundos. Cliente ocupado não abre 10 links. Ele assiste um vídeo curto."},
      {t:"list", h:"Estrutura que funciona", items:[
        ["0 a 5 s","Seu melhor trecho. Comece forte."],
        ["5 a 50 s","Cortes de 2 a 4 segundos de projetos variados, no ritmo da música."],
        ["50 a 60 s","Seu nome, nicho e como te contratar."]]},
      {t:"tip", b:"Faça uma versão vertical do reel para mandar no WhatsApp e no Instagram. É lá que a maioria dos clientes de vídeos curtos vai assistir."},
      {t:"quiz", q:"Como deve começar um demo reel?", opts:["Com seu logo por 10 segundos","Com o trecho mais impressionante","Com uma explicação sobre você","Com tela preta e música"], a:1, why:"As mesmas regras de gancho valem para o seu reel. Abrir com o melhor trecho segura quem vai decidir se te contrata."},
      {t:"task", h:"Monte seu reel", b:"Com as peças da aula anterior, monte um reel de 30 a 60 segundos em formato vertical, terminando com seu @ e WhatsApp na tela."}
    ]},
    { id:"m4l3", title:"Onde mostrar seu trabalho", min:4, cards:[
      {t:"text", h:"Seu perfil precisa vender sozinho", b:"Quando alguém clica no seu perfil, deve entender em 3 segundos **o que você faz, para quem e como contratar**. Se precisar perguntar, você perdeu o cliente."},
      {t:"list", h:"Vitrines recomendadas", items:[
        ["Instagram profissional","Bio clara, reel fixado, destaque com antes e depois."],
        ["Pasta de portfólio","Google Drive organizado ou página simples com os vídeos."],
        ["Behance","Bom para clientes de agência e marcas maiores."],
        ["LinkedIn","Ótimo para empresas, advogados, médicos e B2B."]]},
      {t:"tip", b:"Exemplo de bio: \"Edito Reels para nutricionistas que querem mais pacientes. +40 vídeos entregues. Orçamento no link.\""},
      {t:"quiz", q:"Qual bio converte mais?", opts:["\"Apaixonado por vídeos 🎬\"","\"Editor de vídeo freelancer\"","\"Edito Reels para dentistas que querem mais agendamentos\"","\"Sou criativo e dedicado\""], a:2, why:"Ela diz o serviço, o público e o resultado. O cliente se reconhece e entende o valor."},
      {t:"task", h:"Arrume sua vitrine", b:"Reescreva sua bio no formato \"Edito [tipo de vídeo] para [nicho] que querem [resultado]\", fixe seu reel no topo e crie um destaque com antes e depois."}
    ]}
  ]},
  { id:"m5", img:"img/m5.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_222042_ea3905e4-e0a1-41a4-9c93-2c07610d8200_min.webp", tag:"A2", kind:"a", title:"Conseguindo clientes", lessons:[
    { id:"m5l1", title:"Escolha um nicho", min:4, cards:[
      {t:"text", h:"Especialista cobra mais", b:"\"Editor de vídeo\" compete com milhares de pessoas. \"Editor de vídeos para imobiliárias\" compete com poucas.|Com um nicho, seu portfólio fica mais convincente, você fica mais rápido e **um cliente indica outro do mesmo setor**."},
      {t:"list", h:"Nichos com boa demanda", items:[
        ["Saúde","Médicos, dentistas, nutricionistas, psicólogos."],
        ["Imobiliário","Corretores e imobiliárias com tour de imóveis."],
        ["Infoprodutos","Coaches, mentores e criadores de cursos."],
        ["Podcasts","Cortes de episódios para redes sociais."],
        ["Games e streamers","Cortes de lives para YouTube e TikTok."]]},
      {t:"tip", b:"Escolha um nicho que você entende ou que tem dinheiro para investir em marketing. Você pode mudar depois. Começar sem nicho é que atrasa."},
      {t:"quiz", q:"Por que ter um nicho ajuda a ganhar mais?", opts:["Porque você pode usar menos ferramentas","Porque o cliente percebe mais valor e as indicações vêm do mesmo setor","Porque é obrigatório nas plataformas","Porque não precisa de portfólio"], a:1, why:"Especialização aumenta a percepção de valor e cria um efeito de indicação dentro do mesmo mercado."},
      {t:"task", h:"Defina seu nicho", b:"Escreva 3 nichos possíveis. Para cada um, encontre 10 perfis no Instagram que postam vídeos com edição fraca. O nicho com mais perfis assim é um bom começo."}
    ]},
    { id:"m5l2", title:"Plataformas de freelance", min:5, cards:[
      {t:"text", h:"Clientes já procurando por você", b:"Nas plataformas o cliente publica o projeto e editores enviam propostas. A concorrência é alta, mas é o jeito mais rápido de conseguir **as primeiras avaliações**."},
      {t:"table", h:"Onde se cadastrar", head:["Plataforma","Moeda","Destaque"], rows:[
        ["Workana","Real e dólar","Maior da América Latina"],
        ["99Freelas","Real","Muitos projetos de clientes brasileiros"],
        ["Fiverr","Dólar","Você publica pacotes e o cliente compra"],
        ["Upwork","Dólar","Projetos maiores, exige inglês"]]},
      {t:"list", h:"Como se destacar na proposta", items:[
        ["Responda rápido","As primeiras propostas são as mais lidas."],
        ["Personalize","Cite algo específico do projeto na primeira linha."],
        ["Mostre um exemplo","Link de um vídeo parecido com o que ele pediu."],
        ["Seja curto","5 a 7 linhas. Ninguém lê textão."]]},
      {t:"quiz", q:"Qual início de proposta funciona melhor?", opts:["\"Olá, sou editor há 2 anos e sou muito dedicado...\"","\"Vi que você precisa de cortes do seu podcast de finanças. Aqui está um corte que fiz nesse estilo: [link]\"","\"Faço qualquer tipo de vídeo pelo menor preço\"","\"Tenho interesse no projeto\""], a:1, why:"Ela mostra que você leu o pedido e já prova capacidade com um exemplo do mesmo tipo."},
      {t:"task", h:"Crie seus perfis", b:"Crie perfil em 2 plataformas com foto, título com seu nicho e 3 vídeos do portfólio. Envie 5 propostas personalizadas ainda esta semana."}
    ]},
    { id:"m5l3", title:"Prospecção ativa por mensagem", min:5, cards:[
      {t:"text", h:"Não espere o cliente aparecer", b:"A forma mais rápida de fechar clientes no Brasil é **chamar diretamente** negócios e criadores que já postam vídeos, mas com edição fraca.|É um jogo de volume e consistência."},
      {t:"list", h:"Estrutura da mensagem", items:[
        ["Elogio específico","Algo real do conteúdo da pessoa."],
        ["Oportunidade","O que poderia melhorar, sem criticar."],
        ["Prova","Um vídeo seu parecido ou um teste com material dela."],
        ["Pergunta simples","Algo fácil de responder com sim ou não."]]},
      {t:"tip", b:"Meta prática: 20 mensagens personalizadas por dia. Faça um follow-up gentil depois de 3 dias. Com volume constante, as respostas aparecem. O script completo está na aba Ferramentas."},
      {t:"quiz", q:"Qual destes é um erro na prospecção?", opts:["Mencionar um vídeo específico da pessoa","Mandar a mesma mensagem genérica para todo mundo","Oferecer um teste","Fazer um follow-up depois de alguns dias"], a:1, why:"Mensagem genérica parece spam e é ignorada. Personalizar a primeira linha muda completamente a taxa de resposta."},
      {t:"task", h:"Envie suas primeiras 10 mensagens", b:"Escolha 10 perfis do seu nicho, adapte o script da aba Ferramentas e envie. Anote quem respondeu para fazer o follow-up."}
    ]}
  ]},
  { id:"m6", img:"img/m6.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_222042_9ee41d16-19ff-4934-a16b-679a0cf23d93_min.webp", tag:"A3", kind:"a", title:"Preço, proposta e contrato", lessons:[
    { id:"m6l1", title:"Quanto cobrar", min:5, cards:[
      {t:"text", h:"Preço baixo demais também afasta cliente", b:"Cobrar muito pouco passa insegurança e te prende a jornadas longas. Comece com um preço justo para o seu nível e **suba a cada 3 a 5 clientes novos**."},
      {t:"table", h:"Faixas de referência no Brasil", head:["Serviço","Iniciante","Experiente"], rows:[
        ["Reels / TikTok (até 60 s)","R$ 50–150","R$ 200–500"],
        ["Corte de podcast","R$ 30–80","R$ 100–250"],
        ["YouTube (10–15 min)","R$ 150–400","R$ 600–2.000"],
        ["Pacote 12 Reels / mês","R$ 600–1.500","R$ 2.000–5.000"]]},
      {t:"tip", b:"Os valores variam por cidade, nicho e complexidade. Use a tabela como ponto de partida e ajuste conforme o mercado responde."},
      {t:"quiz", q:"Quando faz sentido aumentar o preço?", opts:["Nunca, para não perder clientes","Quando a agenda está cheia e os clientes aprovam fácil","Só depois de 5 anos","Toda semana"], a:1, why:"Agenda cheia é sinal de que o preço está abaixo do valor percebido. Aumente para novos clientes primeiro."},
      {t:"task", h:"Calcule seu preço", b:"Abra a calculadora na aba Ferramentas. Defina quanto quer ganhar por mês e veja quantos clientes e vídeos você precisa. Escolha seu preço inicial."}
    ]},
    { id:"m6l2", title:"Pacotes mensais", min:4, cards:[
      {t:"text", h:"Recorrência é o segredo da renda estável", b:"Vender vídeo avulso obriga você a procurar cliente todo mês. Vender **pacote mensal** transforma um cliente em renda previsível."},
      {t:"table", h:"Exemplo de 3 pacotes", head:["Plano","Inclui","Preço/mês"], rows:[
        ["Essencial","8 Reels com legenda","R$ 800"],
        ["Crescimento","12 Reels + 4 stories","R$ 1.300"],
        ["Completo","20 Reels + capa + roteiro de ganchos","R$ 2.200"]]},
      {t:"tip", b:"Deixe o plano do meio como o mais atraente. A maioria dos clientes escolhe a opção do meio quando vê três."},
      {t:"quiz", q:"Qual a principal vantagem do pacote mensal?", opts:["Edições mais longas","Renda previsível e menos tempo procurando clientes","Não precisa entregar no prazo","Cliente não pede revisão"], a:1, why:"Com 4 ou 5 clientes recorrentes você já tem uma renda estável e pode focar em editar melhor."},
      {t:"task", h:"Monte seus 3 planos", b:"Defina nome, entregáveis e preço de 3 pacotes para o seu nicho. Use a calculadora para conferir se 5 clientes no plano do meio atingem sua meta."}
    ]},
    { id:"m6l3", title:"Proposta, contrato e revisões", min:5, cards:[
      {t:"text", h:"Combinado não sai caro", b:"Os maiores problemas com cliente vêm de coisas que não foram combinadas: número de revisões, prazo e pagamento. Deixe tudo **por escrito antes de começar**."},
      {t:"list", h:"O que sua proposta precisa ter", items:[
        ["Escopo","Quantos vídeos, duração e o que está incluso."],
        ["Prazo","Data de entrega de cada vídeo depois de receber o material."],
        ["Revisões","Até 2 rodadas inclusas. A partir daí, cobradas à parte."],
        ["Pagamento","50% para começar e 50% na entrega, ou mensal adiantado."],
        ["Uso","Onde o cliente pode publicar e se você pode usar no portfólio."]]},
      {t:"tip", b:"Para emitir nota fiscal e ter mais credibilidade com empresas, considere abrir um MEI. Confira no portal do Empreendedor se sua atividade se enquadra."},
      {t:"quiz", q:"O cliente pede a 5ª rodada de alterações e só 2 estavam inclusas. O que fazer?", opts:["Fazer de graça e ficar calado","Recusar e encerrar o trabalho","Lembrar do combinado com educação e informar o valor da revisão extra","Ignorar a mensagem"], a:2, why:"Com o combinado por escrito, a conversa é tranquila: você mantém o cliente e é pago pelo trabalho extra."},
      {t:"task", h:"Escreva sua proposta", b:"Use o modelo da aba Ferramentas e preencha com seu pacote do meio. Deixe salvo para enviar assim que um cliente pedir orçamento."}
    ]}
  ]},
  { id:"m7", img:"img/m7.webp", imgRemote:"https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_221828_efb417e9-6807-4d6b-914a-87d35ff8daa2_min.webp", tag:"A4", kind:"a", title:"Escalando a renda", lessons:[
    { id:"m7l1", title:"Clientes que ficam", min:4, cards:[
      {t:"text", h:"Manter é mais barato que conquistar", b:"Um cliente que fica 12 meses vale muito mais do que 12 clientes de um mês só. Quem mantém clientes **para de depender de prospecção**."},
      {t:"list", h:"Como manter clientes por anos", items:[
        ["Entregue antes do prazo","Nem que seja algumas horas."],
        ["Comunique","Avise quando recebeu o material e quando vai entregar."],
        ["Mostre resultados","Mande um print do vídeo que mais performou no mês."],
        ["Sugira ideias","Proponha ganchos e formatos novos. Vire parceiro."],
        ["Peça indicação","Depois de um resultado bom, pergunte quem mais poderia precisar."]]},
      {t:"quiz", q:"Qual atitude mais aumenta a chance do cliente renovar?", opts:["Entregar no último minuto","Mostrar os resultados dos vídeos e sugerir melhorias","Só responder quando ele cobrar","Mudar o estilo de edição sem avisar"], a:1, why:"Quando o cliente vê resultado e sente que você pensa no negócio dele, a renovação vira natural."},
      {t:"task", h:"Crie seu relatório mensal", b:"Monte um modelo simples: vídeos entregues, vídeo com mais visualizações e 2 ideias para o próximo mês. Envie para cada cliente no fim do mês."}
    ]},
    { id:"m7l2", title:"IA como acelerador", min:4, cards:[
      {t:"text", h:"A IA corta o trabalho repetitivo", b:"Ferramentas de IA já fazem legendas automáticas, remoção de silêncios, recorte de vídeos longos em cortes curtos e limpeza de áudio.|Use para ganhar tempo. **O gosto, o ritmo e a estratégia continuam sendo seus**, e é por isso que o cliente paga."},
      {t:"list", h:"Onde a IA mais ajuda", items:[
        ["Legendas","Gera o texto em segundos. Você só revisa."],
        ["Silêncios","Remove pausas automaticamente na fala."],
        ["Cortes de podcast","Sugere os trechos com mais potencial."],
        ["Áudio","Limpa ruído e melhora a voz gravada no celular."]]},
      {t:"tip", b:"Sempre assista ao resultado final. A IA erra nomes, gírias e às vezes escolhe o trecho errado. Revisar é o que separa você de quem só aperta botão."},
      {t:"quiz", q:"Como usar IA sem perder valor como editor?", opts:["Entregar o que a IA gerar sem revisar","Usar IA nas tarefas repetitivas e investir o tempo ganho em ganchos e ritmo","Evitar IA completamente","Cobrar mais caro por usar IA"], a:1, why:"A IA acelera o operacional. Seu valor está nas decisões criativas que fazem o vídeo performar."},
      {t:"task", h:"Teste uma automação", b:"Escolha uma tarefa repetitiva do seu processo (legenda ou silêncios) e faça com IA. Cronometre e compare com o tempo manual."}
    ]},
    { id:"m7l3", title:"De freelancer a negócio", min:5, cards:[
      {t:"text", h:"Seu tempo tem limite. Seu negócio não precisa ter.", b:"Quando a agenda lota, você tem três caminhos: **subir o preço**, **contratar outros editores** ou **vender produtos digitais**. Os três podem andar juntos."},
      {t:"list", h:"Caminhos para escalar", items:[
        ["Subir preço","Para novos clientes, a cada vez que a agenda lotar."],
        ["Montar equipe","Pague um editor júnior por vídeo e cuide da revisão e do cliente."],
        ["Produtos digitais","Venda templates, presets de legenda e pacotes de efeitos."],
        ["Ensinar","Mentorias e aulas para editores iniciantes."]]},
      {t:"table", h:"Exemplo de rotina semanal", head:["Dia","Foco"], rows:[
        ["Segunda","Planejar entregas e responder clientes"],
        ["Terça a quinta","Editar em blocos de 90 minutos"],
        ["Sexta","Prospectar 20 contatos e postar portfólio"],
        ["Sábado","Estudar uma técnica nova"]]},
      {t:"quiz", q:"Sua agenda está cheia com 8 clientes. Qual próximo passo faz mais sentido?", opts:["Aceitar mais clientes e trabalhar de madrugada","Subir o preço para novos clientes e testar um editor de apoio","Cancelar todos e recomeçar","Baixar o preço para atrair mais gente"], a:1, why:"Preço maior e uma pessoa de apoio aumentam a renda sem aumentar suas horas."},
      {t:"task", h:"Seu plano de 90 dias", b:"Escreva 3 metas: quantos clientes recorrentes, qual preço médio e qual será seu próximo passo para escalar. Revise esse plano todo mês."}
    ]}
  ]}
  ];

  const DM_SCRIPT = `Oi, [nome]! Vi seu vídeo sobre [assunto] e gostei muito de [detalhe específico].

Sou editor de vídeos para [nicho] e percebi que dá para aumentar a retenção dos seus Reels com um gancho mais forte no início e legendas dinâmicas.

Posso editar um dos seus vídeos como teste, sem compromisso, para você ver a diferença?`;

  const FOLLOW_SCRIPT = `Oi, [nome]! Passando para saber se você viu minha mensagem. Se quiser, já separo um vídeo seu para fazer o teste esta semana.`;

  const PROPOSAL = `PROPOSTA DE EDIÇÃO DE VÍDEO
Cliente: [nome]
Plano: [Crescimento]

ESCOPO
• [12] Reels por mês, até [60] segundos cada
• Legendas dinâmicas revisadas, zooms, B-roll e efeitos sonoros
• Formato 9:16, 1080×1920

PRAZO
• Entrega em até [48 horas] após o recebimento do material bruto

REVISÕES
• Até 2 rodadas de ajustes por vídeo inclusas
• Revisões extras: R$ [30] por rodada

PAGAMENTO
• R$ [1.300] por mês, pago até o dia [5] via Pix
• Primeiro mês pago antes do início

USO
• O cliente pode publicar em todas as suas redes
• O editor pode usar trechos no portfólio, salvo pedido contrário

Validade da proposta: 7 dias.`;

  const CHECKLIST = [
    "Gancho forte nos 3 primeiros segundos",
    "Legenda revisada, sem erros de português",
    "Textos dentro da safe zone",
    "Voz clara e música bem abaixo da fala",
    "Cor corrigida e consistente entre os clipes",
    "Assisti uma vez sem som e uma vez só ouvindo",
    "Exportado em 1080×1920, 30 fps",
    "Nome do arquivo com cliente e data"
  ];

  /* Quiz de personalização (primeiro acesso). */
  const ONB = [
    {k:"goal", q:"Qual é o seu objetivo com edição de vídeo?", opts:[
      ["extra","Renda extra","R$ 1.000 a 2.000 por mês"],
      ["main","Renda principal","R$ 3.000 a 5.000 por mês"],
      ["biz","Ter um negócio","Acima de R$ 8.000 com equipe"]]},
    {k:"level", q:"Quanto você já sabe de edição?", opts:[
      ["zero","Nunca editei","Vou começar do zero"],
      ["basic","Edito por diversão","Já mexi em CapCut ou similar"],
      ["pro","Já edito bem","Quero aprender a vender"]]},
    {k:"device", q:"Onde você vai editar?", opts:[
      ["phone","Celular","Android ou iPhone"],
      ["pc","Computador","Windows ou Mac"],
      ["both","Os dois","Celular e computador"]]},
    {k:"time", q:"Quanto tempo por dia você pode dedicar?", opts:[
      ["15","15 minutos","Uma aula por dia"],
      ["30","30 minutos","Aula e tarefa prática"],
      ["60","1 hora ou mais","Ritmo acelerado"]]}
  ];

  /* Imagem da página de vendas (gerada para o curso). */
  const HERO = { img: 'img/hero.webp', imgRemote: 'https://d8j0ntlcm91z4.cloudfront.net/user_3HBXR4YxvQD3bkuLAyZSUuBFiIa/hf_20261026_221827_62c86517-2967-4567-9004-447a1b11fc21_min.webp' };

  return { HERO, COURSE, DM_SCRIPT, FOLLOW_SCRIPT, PROPOSAL, CHECKLIST, ONB };
});
