import React from 'react';
import '@fontsource/baloo-2/800.css';
import '@fontsource/permanent-marker/400.css';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FPS = 30;
export const DURACAO = 851; // 28,37 s do vídeo original

type Lado = 'esq' | 'dir';
type Personagem = {nome: string; inicio: number; fim: number; lado: Lado};

// Tempos (em segundos) de quando cada pessoa passa pela câmera.
// Ajuste aqui se algum nome precisar adiantar/atrasar.
const PERSONAGENS: Personagem[] = [
  {nome: 'Diretora Olivia', inicio: 0.1, fim: 1.0, lado: 'esq'},
  {nome: 'Graça', inicio: 1.0, fim: 1.65, lado: 'dir'},
  {nome: 'Alicia', inicio: 1.75, fim: 3.1, lado: 'esq'},
  {nome: 'Carmem', inicio: 3.1, fim: 4.5, lado: 'dir'},
  {nome: 'Margarida', inicio: 4.55, fim: 5.45, lado: 'esq'},
  {nome: 'Cirilo', inicio: 5.5, fim: 7.3, lado: 'dir'},
  {nome: 'Laura', inicio: 7.3, fim: 9.1, lado: 'esq'},
  {nome: 'Maria Joaquina', inicio: 9.2, fim: 10.4, lado: 'esq'},
  {nome: 'Valeria', inicio: 10.4, fim: 11.6, lado: 'dir'},
  {nome: 'Adriano', inicio: 12.2, fim: 13.4, lado: 'esq'},
  {nome: 'Marcelina', inicio: 13.4, fim: 14.7, lado: 'dir'},
  {nome: 'Mario', inicio: 15.4, fim: 16.6, lado: 'dir'},
  {nome: 'Bibi', inicio: 16.6, fim: 17.6, lado: 'esq'},
  {nome: 'Jaime', inicio: 17.6, fim: 18.65, lado: 'esq'},
  {nome: 'Daniel', inicio: 18.7, fim: 19.8, lado: 'esq'},
  {nome: 'Jorge', inicio: 19.8, fim: 20.85, lado: 'dir'},
  {nome: 'Paulo', inicio: 21.0, fim: 22.4, lado: 'dir'},
  {nome: 'Kokimoto', inicio: 22.4, fim: 24.0, lado: 'esq'},
];

const FINAL_INICIO = 24.3;

const CORES = [
  {fundo: '#FF3B5C', tinta: '#FFFFFF'},
  {fundo: '#FFC83D', tinta: '#3A1C00'},
  {fundo: '#2F80FF', tinta: '#FFFFFF'},
  {fundo: '#22C17A', tinta: '#FFFFFF'},
  {fundo: '#B14DFF', tinta: '#FFFFFF'},
  {fundo: '#FF8A1F', tinta: '#FFFFFF'},
];

const f = (s: number) => Math.round(s * FPS);
const NOME = "'Baloo 2', sans-serif";
const MAO = "'Permanent Marker', cursive";

/* ---------- Efeitos de vídeo ---------- */

const pulsos = PERSONAGENS.map((p) => f(p.inicio)).concat(f(FINAL_INICIO));

function ultimoPulso(frame: number) {
  let ult = -999;
  for (const p of pulsos) if (p <= frame) ult = p;
  return frame - ult;
}

const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = ultimoPulso(frame);
  // "Punch-in": zoom rápido a cada personagem que relaxa logo depois
  const punch = interpolate(desde, [0, 4, 18], [1.0, 1.07, 1.03], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const respira = 1 + Math.sin(frame / 40) * 0.006;
  const tremor = desde < 6 ? (random(`t${frame}`) - 0.5) * 10 : 0;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${punch * respira}) translateX(${tremor}px)`,
        filter: 'saturate(1.18) contrast(1.06) brightness(1.02)',
      }}
    >
      <OffthreadVideo src={staticFile('onibus.mp4')} />
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = ultimoPulso(frame);
  const op = interpolate(desde, [0, 1, 6], [0, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{background: '#FFF6D6', opacity: op, mixBlendMode: 'screen'}} />;
};

const Vinheta: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,0,30,0.55) 100%)',
    }}
  />
);

const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{opacity: 0.12, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- Estrelinhas ---------- */

const Estrela: React.FC<{size: number; cor: string; style?: React.CSSProperties}> = ({
  size,
  cor,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14l-5.3-5 7.2-.9z"
      fill={cor}
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Explosao: React.FC<{seed: string; cores: string[]; n?: number; raio?: number}> = ({
  seed,
  cores,
  n = 9,
  raio = 260,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + random(`${seed}a${i}`) * 0.6;
        const dist = raio * (0.6 + random(`${seed}d${i}`) * 0.6);
        const p = interpolate(frame, [0, 16], [0, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.quad),
        });
        const op = interpolate(frame, [0, 3, 14, 22], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const size = 26 + random(`${seed}s${i}`) * 26;
        return (
          <Estrela
            key={i}
            size={size}
            cor={cores[i % cores.length]}
            style={{
              position: 'absolute',
              left: Math.cos(ang) * dist * p - size / 2,
              top: Math.sin(ang) * dist * p - size / 2,
              opacity: op,
              transform: `rotate(${frame * 12 + i * 40}deg) scale(${1 - p * 0.3})`,
            }}
          />
        );
      })}
    </>
  );
};

/* ---------- Cartão de nome ---------- */

const CartaoNome: React.FC<{p: Personagem; indice: number; dur: number}> = ({p, indice, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cor = CORES[indice % CORES.length];
  const esq = p.lado === 'esq';

  const entra = spring({frame, fps, config: {damping: 11, stiffness: 180, mass: 0.6}});
  const sai = interpolate(frame, [dur - 5, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const escala = entra * (0.6 + 0.4 * sai);
  const desliza = (1 - entra) * (esq ? -380 : 380) + (1 - sai) * (esq ? -120 : 120);
  const giro = (esq ? -4 : 4) + Math.sin(frame / 6) * 1.2;
  const sublinhado = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const tagEntra = spring({frame: frame - 4, fps, config: {damping: 10, stiffness: 200}});

  const tamanho = p.nome.length > 11 ? 112 : 136;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          [esq ? 'left' : 'right']: 110,
          transform: `translateX(${desliza}px) rotate(${giro}deg) scale(${escala})`,
          transformOrigin: esq ? 'left bottom' : 'right bottom',
          opacity: sai,
          display: 'flex',
          flexDirection: 'column',
          alignItems: esq ? 'flex-start' : 'flex-end',
        }}
      >
        <div style={{position: 'absolute', [esq ? 'left' : 'right']: 160, top: 70}}>
          <Explosao seed={p.nome} cores={['#FFC83D', '#FF3B5C', '#2F80FF', '#22C17A']} />
        </div>

        {/* etiqueta "apresentando" */}
        <div
          style={{
            fontFamily: MAO,
            fontSize: 44,
            color: '#1B1033',
            background: '#FFFFFF',
            padding: '4px 22px 8px',
            borderRadius: 14,
            marginBottom: -14,
            [esq ? 'marginLeft' : 'marginRight']: 28,
            transform: `rotate(${esq ? -3 : 3}deg) scale(${tagEntra})`,
            boxShadow: '0 6px 0 rgba(0,0,0,0.25)',
            zIndex: 2,
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <span>{indice === 1 ? 'a professora' : 'apresentando'}</span>
          <span style={{color: cor.fundo === '#FFC83D' ? '#FF8A1F' : cor.fundo}}>
            {String(indice + 1).padStart(2, '0')}
          </span>
        </div>

        {/* placa do nome */}
        <div
          style={{
            position: 'relative',
            background: cor.fundo,
            color: cor.tinta,
            fontFamily: NOME,
            fontWeight: 800,
            fontSize: tamanho,
            lineHeight: 1,
            padding: '30px 56px 18px',
            borderRadius: 34,
            border: '9px solid #FFFFFF',
            boxShadow: '0 16px 0 rgba(27,16,51,0.85), 0 30px 60px rgba(0,0,0,0.45)',
            whiteSpace: 'nowrap',
            letterSpacing: 1,
            textShadow: '0 5px 0 rgba(0,0,0,0.18)',
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.22) 3px, transparent 3.5px)',
            backgroundSize: '26px 26px',
          }}
        >
          {p.nome}
          <svg
            width="100%"
            height="28"
            viewBox="0 0 300 28"
            preserveAspectRatio="none"
            style={{display: 'block', marginTop: 4}}
          >
            <path
              d="M4 18 C 60 4, 110 26, 160 14 S 260 6, 296 16"
              fill="none"
              stroke={cor.tinta}
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - sublinhado}
              opacity={0.85}
            />
          </svg>
          <Estrela
            size={74}
            cor="#FFC83D"
            style={{
              position: 'absolute',
              top: -40,
              [esq ? 'right' : 'left']: -36,
              transform: `rotate(${frame * 6}deg) scale(${tagEntra})`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Selo fixo ---------- */

const Selo: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10, f(FINAL_INICIO) - 8, f(FINAL_INICIO)], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 54,
        left: 64,
        opacity: op,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(27,16,51,0.72)',
        padding: '10px 28px 10px 16px',
        borderRadius: 999,
        border: '4px solid rgba(255,255,255,0.9)',
      }}
    >
      <Estrela size={50} cor="#FF3B5C" style={{transform: `rotate(${frame * 3}deg)`}} />
      <span style={{fontFamily: NOME, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 2}}>
        CARROSSEL
      </span>
      <span style={{fontFamily: MAO, fontSize: 32, color: '#FFC83D'}}>a paródia</span>
    </div>
  );
};

/* ---------- Encerramento ---------- */

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fundo = interpolate(frame, [0, 12], [0, 0.45], {extrapolateRight: 'clamp'});
  const linha1 = spring({frame, fps, config: {damping: 10, stiffness: 160}});
  const linha2 = spring({frame: frame - 10, fps, config: {damping: 9, stiffness: 140}});
  const linha3 = spring({frame: frame - 24, fps, config: {damping: 12, stiffness: 160}});
  const balanca = Math.sin(frame / 7) * 2.5;
  const letras = 'NOSSA TURMA!'.split('');
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: '#1B1033', opacity: fundo}} />
      <div style={{position: 'absolute', left: '50%', top: '50%'}}>
        <Explosao seed="final" cores={['#FFC83D', '#FF3B5C', '#2F80FF', '#22C17A', '#B14DFF']} n={16} raio={720} />
      </div>
      <div
        style={{
          fontFamily: MAO,
          fontSize: 76,
          color: '#FFFFFF',
          transform: `scale(${linha1}) rotate(-3deg)`,
          textShadow: '0 6px 0 rgba(0,0,0,0.4)',
        }}
      >
        e essa é a
      </div>
      <div style={{display: 'flex', transform: `scale(${linha2}) rotate(${balanca}deg)`, margin: '6px 0 18px'}}>
        {letras.map((l, i) => {
          const pula = Math.sin(frame / 4 - i * 0.6) * 10;
          return (
            <span
              key={i}
              style={{
                fontFamily: NOME,
                fontWeight: 800,
                fontSize: 200,
                lineHeight: 1,
                color: CORES[i % CORES.length].fundo,
                WebkitTextStroke: '10px #FFFFFF',
                paintOrder: 'stroke fill',
                textShadow: '0 14px 0 rgba(27,16,51,0.9)',
                transform: `translateY(${pula}px)`,
                width: l === ' ' ? 60 : undefined,
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
      <div
        style={{
          transform: `scale(${linha3})`,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: '#FFFFFF',
          borderRadius: 999,
          padding: '10px 40px',
          boxShadow: '0 10px 0 rgba(0,0,0,0.3)',
        }}
      >
        <Estrela size={56} cor="#FF3B5C" style={{transform: `rotate(${frame * 4}deg)`}} />
        <span style={{fontFamily: NOME, fontWeight: 800, fontSize: 64, color: '#1B1033', letterSpacing: 3}}>
          CARROSSEL
        </span>
        <span style={{fontFamily: MAO, fontSize: 48, color: '#FF3B5C'}}>a paródia</span>
        <Estrela size={56} cor="#2F80FF" style={{transform: `rotate(${-frame * 4}deg)`}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Composição ---------- */

export const Apresentacao: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Video />
    <Vinheta />
    <Grao />
    <Flash />
    <Selo />
    {PERSONAGENS.map((p, i) => {
      const dur = f(p.fim) - f(p.inicio);
      return (
        <Sequence key={p.nome} from={f(p.inicio)} durationInFrames={dur}>
          <CartaoNome p={p} indice={i} dur={dur} />
        </Sequence>
      );
    })}
    <Sequence from={f(FINAL_INICIO)}>
      <Final />
    </Sequence>
  </AbsoluteFill>
);
