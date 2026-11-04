import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  CartaoNome,
  DURACAO,
  FINAL_INICIO,
  Final,
  Grao,
  PERSONAGENS,
  Vinheta,
} from './Apresentacao';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const PAUSA = 36; // 1,2 s parado em cada pessoa

// Segundo do vídeo original em que cada pessoa é congelada (mesma ordem de PERSONAGENS)
const MOMENTOS: Record<string, number> = {
  'Diretora Olivia': 0.5,
  Graça: 0.9,
  Alicia: 3.0,
  Carmem: 3.5,
  Margarida: 5.6,
  Cirilo: 7.0,
  Laura: 10.0,
  'Maria Joaquina': 10.8,
  Valeria: 12.6,
  Adriano: 13.0,
  Marcelina: 14.0,
  Mario: 16.0,
  Bibi: 17.0,
  Jaime: 18.0,
  Daniel: 19.75,
  Jorge: 20.0,
  Paulo: 22.5,
  Kokimoto: 23.0,
};

// Ajustes de posição da placa só nesta versão
const LADO_PAUSA: Record<string, {lado: 'esq' | 'dir'; recuo?: number}> = {
  Jaime: {lado: 'esq', recuo: 520},
};

type Bloco =
  | {tipo: 'toca'; de: number; src: number; dur: number}
  | {tipo: 'pausa'; de: number; src: number; dur: number; indice: number};

const blocos: Bloco[] = [];
{
  let saida = 0;
  let fonte = 0;
  PERSONAGENS.forEach((p, indice) => {
    const alvo = f(MOMENTOS[p.nome]);
    if (alvo > fonte) {
      blocos.push({tipo: 'toca', de: saida, src: fonte, dur: alvo - fonte});
      saida += alvo - fonte;
      fonte = alvo;
    }
    blocos.push({tipo: 'pausa', de: saida, src: fonte, dur: PAUSA, indice});
    saida += PAUSA;
  });
  blocos.push({tipo: 'toca', de: saida, src: fonte, dur: DURACAO - fonte});
}

const EXTRA = PERSONAGENS.length * PAUSA;
export const DURACAO_PAUSADA = DURACAO + EXTRA;
const FINAL_SAIDA = f(FINAL_INICIO) + EXTRA;

const video = staticFile('onibus.mp4');
const filtro = 'saturate(1.18) contrast(1.06) brightness(1.02)';

const Tocando: React.FC = () => {
  const frame = useCurrentFrame();
  const respira = 1 + Math.sin(frame / 40) * 0.006;
  return (
    <AbsoluteFill style={{transform: `scale(${respira})`, filter: filtro}}>
      <OffthreadVideo src={video} />
    </AbsoluteFill>
  );
};

const Congelado: React.FC<{src: number; dur: number}> = ({src, dur}) => {
  const frame = useCurrentFrame();
  // entra com um "soco" de zoom e vai aproximando devagar enquanto está parado
  const zoom = interpolate(frame, [0, 4, dur], [1.0, 1.09, 1.13], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const tremor = frame < 6 ? (random(`p${src}${frame}`) - 0.5) * 14 : 0;
  const flash = interpolate(frame, [0, 1, 7], [0, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const volta = interpolate(frame, [dur - 3, dur], [0, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${tremor}px)`, filter: filtro}}>
        <Freeze frame={src}>
          <OffthreadVideo src={video} muted />
        </Freeze>
      </AbsoluteFill>
      {/* moldura de "pausa" */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 0 18px rgba(255,255,255,0.9), inset 0 0 160px rgba(27,16,51,0.55)',
        }}
      />
      <AbsoluteFill style={{background: '#FFF6D6', opacity: flash + volta, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

export const ApresentacaoPausada: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    {blocos.map((b, i) =>
      b.tipo === 'toca' ? (
        <Sequence key={i} from={b.de} durationInFrames={b.dur}>
          <Sequence from={-b.src}>
            <Tocando />
          </Sequence>
        </Sequence>
      ) : (
        <Sequence key={i} from={b.de} durationInFrames={b.dur}>
          <Congelado src={b.src} dur={b.dur} />
        </Sequence>
      ),
    )}
    <Vinheta />
    <Grao />
    {blocos.map((b, i) => {
      if (b.tipo !== 'pausa') return null;
      const base = PERSONAGENS[b.indice];
      const p = {...base, ...(LADO_PAUSA[base.nome] ?? {})};
      return (
        <Sequence key={`n${i}`} from={b.de} durationInFrames={b.dur}>
          <CartaoNome p={p} indice={b.indice} dur={b.dur} />
        </Sequence>
      );
    })}
    <Sequence from={FINAL_SAIDA}>
      <Final />
    </Sequence>
  </AbsoluteFill>
);
