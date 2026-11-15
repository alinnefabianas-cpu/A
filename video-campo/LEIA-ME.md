# "Um dia no campo" — curta sem narração (9:16, 1080x1920, 2min35s)

Montado a partir dos 101 takes brutos (Sony 4K vertical, C1683–C1789) da pasta do Drive.
Arquivo final: `exportados/um-dia-no-campo.mp4`.

## A história (7 blocos, cada um com sua trilha)

| # | Bloco | Takes | Trilha | Cor |
|---|-------|-------|--------|-----|
| 1 | **Jardim** – flores, a menina rega o canteiro e gira com o regador | C1695 C1699 C1702 C1704 C1701 C1705 C1706 | violão dedilhado + glockenspiel, manhã | dourado suave |
| 2 | **Brincar** – pula corda na casa amarela, balanço entre as araucárias | C1711 C1713 C1712 C1690 C1687 C1688 C1694 | ukulele, palmas e assobio | claro, arejado |
| 3 | **A trilha e a pegadinha** – o explorador com a lupa é amarrado na árvore e coberto de bilhetinhos | C1724 C1722 C1723 C1725 C1730 C1729 C1731 C1733 | pizzicato "sorrateiro", fagote e clarinete | sombras frias |
| 4 | **O tesouro** – barraca, baú, fotos, mapa e lanterna | C1752 C1755 C1762 C1739 C1743 C1767 C1747 | orquestral misterioso que cresce até a descoberta | âmbar |
| 5 | **O cowboy** – chapéu, coldre… e um pirulito no lugar do revólver | C1768 C1769 C1774 C1776 C1775 | faroeste cômico, assobio e castanholas | dourado/contraste |
| 6 | **O chá** – pelúcias enfeitadas, chá com o coelho, chuva de pétalas do balcão | C1761 C1759 C1777 C1780 C1789 C1786 | valsa de caixinha de música e harpa | pastel |
| 7 | **Final** – o cowboy segue pela estrada, o balanço de braços abertos | C1772 C1689 | violão e piano nostálgicos, acorde final | entardecer |

Os cortes exatos (entrada/saída de cada take) estão em `scripts/edl.py`.
Descrição de todos os takes: `notas-dos-takes.md`.

## Som
- Sem narração e sem o som direto (tinha conversa da equipe).
- Trilhas: ElevenLabs Music v2.5 (via Higgsfield), instrumentais, geradas para a duração de cada bloco — `audio/musica/`.
- Efeitos: Mirelo SFX (via Higgsfield) — `audio/efeitos/`: pássaros (ambiente o filme todo), regador, corda,
  balanço, passos no cascalho, lupa (brilho), corda amarrando, post-it, zíper da barraca, baú, mapa,
  esporas, "pop" do pirulito, xícaras, coelho, pétalas, sininhos, whoosh.
- Mix: cada trilha normalizada (−17 LUFS) com crossfade de 1,2 s entre blocos; master −15 LUFS, pico −1,5 dBTP.

## Cor
Correção em `scripts/render.py` (`BASE`, `SECAO_COR`, `AJUSTE_TAKE`): a câmera entregou tudo muito saturado e
contrastado, então a base suaviza as altas, levanta levemente os pretos, tira o "neon" dos verdes/amarelos e
aquece; cada bloco tem um tom próprio; vinheta leve. C1772 (céu estourado) recebeu ajuste extra.

## Refazer
```bash
# 1) proxies 1080x1920 dos originais 4K (os clipes têm rotação de 90° nos metadados)
ffmpeg -i C1683.MP4 -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 16 -preset veryfast -an proxy/C1683.mp4
# 2) montagem + cor + mix + export
python3 -I scripts/render.py proxy/ work/ exportados/um-dia-no-campo.mp4
```
