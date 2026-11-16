# Lista de cortes conforme o "Roteiro para edição – O Acampamento" (16 cenas).
# (clipe, entrada_s, saida_s, cena, opcoes)
# opcoes: k=rotulo (usado pela trilha/efeitos), crop=recorte p/ "close", vel=velocidade (<1 = camera lenta),
#         hold=segundos congelando o ultimo quadro
CLOSE_MENINA_CORDA = "crop=720:1280:180:300"
EDL = [
  # 1. A menina no balanço — dócil, movimento lento
  ("C1683", 7.0, 10.2, 1, {}),
  ("C1694", 0.0, 2.4, 1, {}),
  # 2. A ideia — pula corda e tem a ideia de incomodar o cowboy
  ("C1711", 0.0, 2.2, 2, {}),
  ("C1713", 2.0, 3.8, 2, {}),
  ("C1714", 4.5, 9.0, 2, {"k": "ideia", "crop": CLOSE_MENINA_CORDA}),
  # 3. O acampamento — plano geral, ritmo calmo
  ("C1716", 1.0, 5.0, 3, {"crop": "crop=864:1536:108:120"}),
  ("C1734", 0.5, 3.5, 3, {}),
  # 4. A lupa
  ("C1724", 0.0, 2.6, 4, {}),
  ("C1722", 5.8, 9.4, 4, {}),
  ("C1723", 4.0, 8.0, 4, {"k": "lupa"}),
  # 5. A travessura da menina — cortes rápidos, termina quando ela para de rir
  ("C1725", 2.4, 4.6, 5, {"k": "chegada"}),
  ("C1730", 7.0, 9.6, 5, {}),
  ("C1731", 4.0, 6.0, 5, {}),
  ("C1733", 4.0, 5.8, 5, {}),
  ("C1732", 0.4, 2.2, 5, {}),
  ("C1733", 27.4, 29.4, 5, {}),
  ("C1732", 32.6, 34.7, 5, {"k": "sai"}),
  # 6. Conversa com os porquinhos
  ("C1734", 9.0, 11.8, 6, {}),
  ("C1736", 3.0, 5.8, 6, {}),
  ("C1737", 2.4, 5.0, 6, {}),
  # 7. A mala — ganchos e lanterna (sem mostrar o interior do baú, a pedido da familia)
  ("C1739", 1.0, 4.0, 7, {"k": "ganchos"}),
  ("C1746", 6.6, 9.95, 7, {"k": "lanterna"}),
  ("C1748", 8.0, 10.4, 7, {}),
  # 8. Hora de dormir (noite)
  ("C1752", 1.2, 5.2, 8, {}),
  ("C1754", 0.0, 2.6, 8, {}),
  # 9. A menina apronta de novo (noite)
  ("C1757", 0.4, 3.6, 9, {}),
  ("C1758", 12.0, 15.0, 9, {}),
  ("C1757", 20.0, 23.0, 9, {}),
  ("C1761", 9.0, 11.6, 9, {}),
  ("C1760", 2.0, 6.4, 9, {"k": "risada"}),
  # 10. Bom dia! (amanhecer)
  ("C1755", 0.0, 3.2, 10, {}),
  ("C1762", 3.0, 6.4, 10, {}),
  ("C1762", 9.4, 11.2, 10, {}),
  # 11. A descoberta — porquinhos maquiados, reação triste
  ("C1761", 13.0, 15.4, 11, {"k": "descoberta"}),
  ("C1762", 11.45, 12.45, 11, {"k": "triste", "crop": "crop=540:960:200:380", "hold": 1.2}),
  # 12. Vira cowboy — mexe no baú, cinta, chapéu, sai correndo
  ("C1764", 0.0, 1.9, 12, {}),
  ("C1768", 0.0, 2.2, 12, {}),
  ("C1768", 3.4, 6.4, 12, {}),
  ("C1769", 6.2, 9.2, 12, {}),
  ("C1771", 0.4, 3.6, 12, {}),
  # 13. A surpresa do batom
  ("C1774", 0.0, 1.4, 13, {}),
  ("C1776", 0.2, 2.4, 13, {"k": "saca"}),
  ("C1775", 5.1, 7.6, 13, {"k": "batom", "crop": "crop=720:1280:180:150"}),
  ("C1775", 7.6, 9.8, 13, {"k": "joga"}),
  # 14. A hora do chá com a coelhinha (primeiro a menina e a coelha)
  ("C1777", 12.0, 15.6, 14, {}),
  ("C1780", 6.0, 9.6, 14, {}),
  # 15. No balcão: a menina toma chá e o menino planeja a vingança lá de cima
  ("C1789", 3.6, 6.8, 15, {}),
  ("C1781", 0.0, 2.0, 15, {"k": "plano", "crop": "crop=720:1280:180:0"}),
  # 16. A vingança — cookie quase na boca, aranha, susto, menino satisfeito
  ("C1783", 0.6, 2.6, 16, {"k": "cookie", "crop": "crop=720:1280:180:560", "vel": 0.6}),
  ("C1786", 1.4, 3.0, 16, {"k": "aranha"}),
  ("C1786", 3.6, 6.0, 16, {"k": "grito"}),
  ("C1783", 3.7, 6.0, 16, {}),
  ("C1786", 4.6, 5.6, 16, {"k": "satisfeito", "crop": "crop=720:1280:180:0", "hold": 1.4}),
]
