# "O Acampamento" — curta sem narração (9:16, 1080x1920, 2min24s)

Montado a partir dos 101 takes brutos (Sony 4K vertical, C1683–C1789), seguindo o
`roteiro-o-acampamento.pdf` (16 cenas). Arquivo final: `exportados/o-acampamento.mp4`.

## Cenas
| # | Cena | Takes | Música / som | Luz |
|---|------|-------|--------------|-----|
| 1 | A menina no balanço | C1683 C1694 | delicada (violão + glockenspiel), rangido do balanço | dia suave |
| 2 | A ideia | C1711 C1713 C1714 (close) | ukulele no ritmo dos pulos → para na ideia, "ding" e vira marotinha | dia |
| 3 | O acampamento | C1716 C1734 | calma (violão + flauta), passarinhos | fim de tarde |
| 4 | A lupa | C1724 C1722 C1723 | calma, brilho na lupa | fim de tarde |
| 5 | A travessura da menina | C1725 C1730 C1731 C1733 C1732 | sting de surpresa, pizzicato rápido, corda, post-its; termina quando ela para de rir | fim de tarde |
| 6 | Conversa com os porquinhos | C1734 C1736 C1737 | volta a música calma | fim de tarde |
| 7 | A mala | C1739 (ganchos) C1746 C1748 (lanterna; sem mostrar o interior do baú) | mistério → descoberta, clique dos ganchos e da lanterna | fim de tarde |
| 8 | Hora de dormir | C1752 C1754 | canção de ninar, grilos, zíper | **noite** |
| 9 | A menina apronta de novo | C1757 C1758 C1761 C1760 (risada) | cue marota noturna, grilos | **noite** |
| 10 | Bom dia! | C1755 C1762 | galo, passarinhos, música alegre | **amanhecer** |
| 11 | A descoberta | C1761 (porquinhos maquiados) C1762 (close triste, congelado) | corte seco: música para, trombone triste | dia |
| 12 | Vira cowboy | C1764 C1768 C1771 | faroeste crescente, esporas, passos | dourado |
| 13 | A surpresa do batom | C1774 C1776 C1775 (close + ele joga o batom) | disco arranhando, música para, whoosh | dourado |
| 14 | A hora do chá com a coelhinha | C1777 C1780 | valsa delicada, xícaras, coelhinha | pastel |
| 15 | O plano de vingança (no balcão) | C1789 C1781 (close do menino) | suspense divertido | pastel |
| 16 | A vingança | C1783 (cookie em câmera lenta) C1786 C1783 C1786 | pausa no cookie, whoosh da aranha, susto, cortes rápidos, final com o menino satisfeito | pastel |

Cortes exatos: `scripts/edl.py`. Trilhas/efeitos e seus tempos: `scripts/render.py` (`MUSICA`, `AMBIENTE`, `EFEITOS`).

## Observações
- Não há take do menino pegando a aranha escondido (cena 14) nem close da aranha caindo; a cena 16 usa o
  plano do menino soltando a aranha do balcão + reação da menina.
- Os "closes" (ideia, reação triste, batom, menino no balcão, cookie) são recortes dos proxies 1080p.
- Trilhas: ElevenLabs Music v2.5; efeitos: Mirelo SFX (via Higgsfield). Som direto não usado (conversa da equipe).

## Refazer
```bash
ffmpeg -i C1683.MP4 -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 16 -preset veryfast -an proxy/C1683.mp4  # cada take
python3 -I scripts/render.py proxy/ work/ exportados/o-acampamento.mp4
```
