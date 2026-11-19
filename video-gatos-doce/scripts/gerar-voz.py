"""Gera a narração em inglês (voz neural grátis da Microsoft via edge-tts).

Lê os textos de src/roteiro.ts, grava public/voz/NN.mp3 e o tempo exato de cada
palavra em src/palavras.json (o vídeo usa isso para sincronizar legenda e animações).
Uso:  pip install edge-tts && python3 scripts/gerar-voz.py [voz] [velocidade]
Ex.:  python3 scripts/gerar-voz.py en-US-AndrewMultilingualNeural +5%
"""
import asyncio, json, os, re, sys
import edge_tts

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
VOZ = ARGS[0] if len(ARGS) > 0 else 'en-US-AndrewMultilingualNeural'
RATE = ARGS[1] if len(ARGS) > 1 else '+5%'
PROXY = os.environ.get('HTTPS_PROXY') or None

src = open(os.path.join(RAIZ, 'src', 'roteiro.ts'), encoding='utf-8').read()
textos = [m.group(2) for m in re.finditer(r"texto: (['\"])(.*?)\1, destaque", src)]

async def um(i, texto):
    com = edge_tts.Communicate(texto, VOZ, rate=RATE, boundary='WordBoundary', proxy=PROXY)
    audio = bytearray()
    palavras = []
    async for c in com.stream():
        if c['type'] == 'audio':
            audio.extend(c['data'])
        elif c['type'] == 'WordBoundary':
            ini = c['offset'] / 1e7
            palavras.append({'t': c['text'], 'ini': round(ini, 3), 'fim': round(ini + c['duration'] / 1e7, 3)})
    open(os.path.join(RAIZ, 'public', 'voz', f'{i:02d}.mp3'), 'wb').write(audio)
    print(f'✔ {i:02d} ({len(palavras)} palavras)')
    return palavras

async def main():
    os.makedirs(os.path.join(RAIZ, 'public', 'voz'), exist_ok=True)
    arq = os.path.join(RAIZ, 'src', 'palavras.json')
    refazer = '--tudo' in sys.argv
    try:
        tempos = {} if refazer else json.load(open(arq))
    except Exception:
        tempos = {}
    for i, t in enumerate(textos):
        k = f'{i:02d}'
        if k in tempos and os.path.exists(os.path.join(RAIZ, 'public', 'voz', f'{k}.mp3')):
            continue  # já gerado (use --tudo para refazer)
        for tentativa in range(10):
            try:
                tempos[k] = await um(i, t)
                break
            except Exception as e:
                print(f'  tentativa {tentativa + 1} falhou no {k}: {e}')
                await asyncio.sleep(4 + tentativa * 3)
        else:
            raise SystemExit(f'Falhou no trecho {k}')
        json.dump(tempos, open(arq, 'w'), ensure_ascii=False, indent=1)
    print(f'{len(textos)} trechos → public/voz + src/palavras.json')

asyncio.run(main())
