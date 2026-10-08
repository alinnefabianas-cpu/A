# Controle de Frequência Escolar

Miniapp web para o aluno acompanhar a frequência durante o ano letivo: grade de horários, total de aulas por matéria, frequência atual e **atestados médicos**. O app calcula a frequência real, considerando que as aulas cobertas por atestado deixam de contar como falta.

Feito para funcionar bem no celular, especialmente no iPhone (pode ser adicionado à Tela de Início e funciona offline).

> Este aplicativo é apenas uma ferramenta de organização e cálculo. Os resultados devem ser conferidos com o sistema oficial da escola.

## Como usar

1. **Grade**: cadastre as aulas da semana (dia, matéria, início, término, professor opcional). Aulas duplas são cadastradas como duas aulas com horários diferentes.
2. **Matérias → Lançar frequência**: copie do sistema da escola as faltas e as aulas dadas (ou o percentual). Abrindo uma matéria, também dá para informar presenças e % de faltas.
3. **Atestados**: informe o período e as matérias (ou “todas”). O app mostra as aulas da grade que caem no período; você desmarca o que não se aplica (feriado, aula cancelada) e confirma.
4. **Início**: cards com a frequência de cada matéria, status em relação a 75% e resumo geral. Tocando numa matéria: “Como o cálculo foi feito”, simulador de faltas e quantas aulas ainda pode faltar.

## Regras de cálculo

| Item | Fórmula |
| --- | --- |
| Faltas válidas | faltas registradas − faltas cobertas por atestado |
| Aulas válidas | presenças + faltas válidas |
| Frequência | presenças ÷ aulas válidas × 100 |
| Pode faltar agora | maior x com presenças ÷ (aulas válidas + x) ≥ 75% |
| Pode faltar até o fim | maior x com (presenças + restantes − x) ÷ (aulas válidas + restantes) ≥ 75% |
| Aulas restantes | total de aulas do período − aulas contabilizadas |

- **75% é o mínimo e está dentro do limite.** A comparação é feita com números inteiros (100·P ≥ 75·Tv), sem erro de arredondamento. Um valor como 74,996% é exibido como 74,99%, nunca como 75,00%.
- 🟢 Seguro: acima da faixa de atenção · 🟡 Atenção: de 75% até 80% (configurável) · 🔴 Abaixo de 75%.
- Uma aula é identificada por **data + matéria + horário**. Se dois atestados cobrirem a mesma aula, ela é abonada uma vez só.
- Os abonos nunca passam do número de faltas registradas (o app avisa quando isso acontece).
- Com dados parciais, o app deduz o restante (ex.: total + faltas → presenças). Quando só há percentual, ou quando o total precisa ser deduzido de um percentual, os resultados aparecem como **ESTIMATIVA**. O app nunca inventa dados.

### Totais padrão por matéria

Ao criar o perfil, as 21 matérias são carregadas com estes totais (editáveis):

Língua Portuguesa 80 · Produção de Texto 80 · Literatura 80 · Artes 40 · Língua Inglesa 40 · Educação Física 40 · Matemática 200 · Biologia 120 · Física 120 · Geografia 80 · Química 120 · Filosofia 40 · História 80 · Sociologia 40 · ELA 80 · Orientação 40 · Political Science 120 · Nutrition 120 · GGG 40 · Espanhol 40 · Itinerário 80.

## Importação de imagens (OCR)

Na aba **Mais** (ou nas abas Grade/Atestados) dá para enviar print da frequência, foto da grade ou foto do atestado. O texto é reconhecido **no próprio aparelho** com [Tesseract.js](https://github.com/naptha/tesseract.js); a imagem não é enviada a nenhum servidor. Na primeira vez o navegador baixa o motor de OCR da CDN jsDelivr.

O texto reconhecido aparece num campo editável (dá para corrigir), e os dados detectados só entram no cálculo depois que você confere e confirma. Números que o app não sabe a que se referem são mostrados como “não identificados”, nunca adivinhados. No iPhone também dá para usar o Texto ao Vivo: tocar e segurar o texto na foto, copiar e colar.

## Privacidade e armazenamento

- Os dados ficam salvos só no aparelho (localStorage); fotos e PDFs dos atestados ficam no IndexedDB do navegador.
- Não há conta, servidor nem rastreamento.
- Em **Mais** há opções para exportar e importar backup (JSON, com ou sem anexos) e para apagar todos os dados. Anexos podem ser excluídos individualmente.
- No iPhone, o Safari pode apagar dados de sites pouco usados. Adicionar o app à Tela de Início e exportar backups de vez em quando evita perdas.

## Executar

É um site estático, sem etapa de build. Sirva a pasta por HTTP:

```bash
npm start        # npx serve na porta 5173
```

Para usar no iPhone, publique a pasta em qualquer hospedagem estática com HTTPS (GitHub Pages, Netlify, Vercel…), abra no Safari e toque em Compartilhar → Adicionar à Tela de Início.

## Testes

```bash
npm test
```

Os testes unitários (`tests/`) cobrem os cenários obrigatórios:

1. 100 aulas, 82 presenças, 18 faltas, 4 abonadas → 14 faltas válidas, 96 aulas válidas, **85,42%**
2. Dois atestados cobrindo a mesma aula → abonada uma vez só
3. Atestado de 01/10/2026 a 03/10/2026 → Matemática 2, Física 1, Português 1 aulas cobertas
4. Frequência abaixo de 75% → vermelho
5. Exatamente 75% → dentro do limite
6. Somente percentual → marcado como estimativa

Além disso: limites de faltas, simulador, abono maior que as faltas, dados inconsistentes e os analisadores de texto do OCR.

## Estrutura

```
index.html            página única
css/styles.css        estilos (mobile-first, modo escuro, safe areas do iPhone)
js/calc.js            núcleo de cálculo (puro, testável em Node)
js/parsers.js         análise de texto de OCR/colado (frequência, grade, atestado)
js/storage.js         localStorage + IndexedDB (anexos)
js/ocr.js             carregamento sob demanda do Tesseract.js
js/app.js             interface
sw.js                 service worker (funciona offline)
tests/                testes com node:test
```
