import React from 'react';
import '@fontsource/baloo-2/800.css';
import '@fontsource/permanent-marker/400.css';
import {
  AbsoluteFill,
  Audio,
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

const NOME = "'Baloo 2', sans-serif";
const MAO = "'Permanent Marker', cursive";
const FUNDO = '#1B1033';
const CORES = ['#FF3B5C', '#FFC83D', '#2F80FF', '#22C17A', '#B14DFF', '#FF8A1F', '#FF4F9A'];

type Credito = [personagem: string, ator: string];
type Pagina = {
  cena: string;
  ate: number; // segundos do clipe usados
  vel: number; // velocidade (câmera lenta < 1)
  vertical?: boolean;
  creditos: Credito[];
};

const PAGINAS: Pagina[] = [
  {cena: 'cena1.mp4', ate: 2.44, vel: 1, creditos: [['Maria Joaquina', 'Flavia'], ['Cirilo', 'Enrico'], ['Kokimoto', 'Pang']]},
  {cena: 'cena2.mp4', ate: 2.38, vel: 1, creditos: [['Paulo', 'Frassi'], ['Carmen', 'Manu E.'], ['Professora Helena', 'Julia']]},
  {cena: 'cena3.mp4', ate: 2.29, vel: 1, creditos: [['Davi', 'Pietro'], ['Adriano', 'Pietro']]},
  {
    cena: 'cena4.mp4', ate: 5.0, vel: 1, vertical: true,
    creditos: [['Valeria', 'Nunuka'], ['Daniel', 'Kevin'], ['Jaime', 'Brito'], ['Alicia', 'Cata']],
  },
  {cena: 'cena5.mp4', ate: 3.04, vel: 1, creditos: [['Mario', 'Mendes'], ['Laura', 'Velem'], ['Marcelina', 'Yasmin']]},
  {cena: 'cena6.mp4', ate: 3.07, vel: 1, creditos: [['Jorge', 'Kawa (primeiro ano)'], ['Graça', 'Ana Luisa'], ['Didi Ma / Margarida', 'Gabi L.']]},
  {cena: 'cena7.mp4', ate: 2.25, vel: 1, creditos: [['Bibi', 'Gabi Porf'], ['Bandido 1', 'Marcio'], ['Bandido 2', 'Kadu']]},
  {
    cena: 'cena8.mp4', ate: 4.5, vel: 1,
    creditos: [['Dono do sítio', 'Tio Ronaldo'], ['Diretora', 'Luca Nass'], ['Galã', 'Enzo Gaby'], ['Sumô', 'Brito']],
  },
];

const ABERTURA = 75;
const FECHAMENTO = 150;
const durPagina = (p: Pagina) => Math.round((p.ate / p.vel) * 30);
const INICIOS: number[] = [];
{
  let t = ABERTURA;
  for (const p of PAGINAS) {
    INICIOS.push(t);
    t += durPagina(p);
  }
}
const FIM_PAGINAS = INICIOS[INICIOS.length - 1] + durPagina(PAGINAS[PAGINAS.length - 1]);
export const DURACAO_CREDITOS = FIM_PAGINAS + FECHAMENTO;

/* ---------- Elementos ---------- */

const Estrela: React.FC<{size: number; cor: string; style?: React.CSSProperties}> = ({size, cor, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14l-5.3-5 7.2-.9z"
      fill={cor}
      stroke="#fff"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

/* Fundo: raios girando como um carrossel + estrelinhas flutuando */
const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const raios = 24;
  const fatias = new Array(raios).fill(0).map((_, i) => {
    const a0 = (i / raios) * 360;
    const a1 = a0 + 360 / raios / 2;
    return `rgba(255,255,255,0.045) ${a0}deg ${a1}deg, transparent ${a1}deg ${a0 + 360 / raios}deg`;
  });
  return (
    <AbsoluteFill style={{background: FUNDO, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 30% 50%, #3B1E6E 0%, #1B1033 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 600 - 1800,
          top: 540 - 1800,
          width: 3600,
          height: 3600,
          background: `conic-gradient(${fatias.join(',')})`,
          transform: `rotate(${frame * 0.25}deg)`,
        }}
      />
      {new Array(26).fill(0).map((_, i) => {
        const x = random(`fx${i}`) * 1920;
        const y = ((random(`fy${i}`) * 1200 - frame * (0.4 + random(`fv${i}`) * 0.8)) % 1200 + 1200) % 1200 - 60;
        const tam = 10 + random(`fs${i}`) * 22;
        const pisca = 0.35 + 0.45 * Math.sin(frame / 12 + i);
        return (
          <Estrela
            key={i}
            size={tam}
            cor={CORES[i % CORES.length]}
            style={{position: 'absolute', left: x, top: y, opacity: pisca, transform: `rotate(${frame * 2 + i * 30}deg)`}}
          />
        );
      })}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}}
      />
    </AbsoluteFill>
  );
};

const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 10;
  return (
    <AbsoluteFill style={{opacity: 0.1, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`gc${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gc${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/* Moldura tipo polaroid com a cena */
const PW = 1000;
const PH = 562;

const Cena: React.FC<{p: Pagina; indice: number; dur: number}> = ({p, indice, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame, fps, config: {damping: 13, stiffness: 120, mass: 0.8}});
  const sai = interpolate(frame, [dur - 8, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const giroBase = indice % 2 ? 2.5 : -2.5;
  const giro = giroBase * entra + (1 - entra) * (indice % 2 ? 14 : -14) - sai * giroBase * 4;
  const y = (1 - entra) * 700 + sai * -60;
  const x = sai * -900;
  const escala = 0.85 + 0.15 * entra;
  const flutua = Math.sin(frame / 25) * 6;
  const fonte = staticFile(`creditos/${p.cena}`);
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top: 170,
        width: PW + 40,
        height: PH + 120,
        background: '#FFFDF6',
        borderRadius: 10,
        padding: '20px 20px 100px',
        boxSizing: 'border-box',
        boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
        transform: `translate(${x}px, ${y + flutua}px) rotate(${giro}deg) scale(${escala})`,
        opacity: 1 - sai * 0.4,
      }}
    >
      <div style={{position: 'relative', width: PW, height: PH, overflow: 'hidden', background: '#000', borderRadius: 4}}>
        {p.vertical ? (
          <>
            <OffthreadVideo
              src={fonte}
              muted
              playbackRate={p.vel}
              style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(28px) brightness(0.6)', transform: 'scale(1.15)'}}
            />
            <OffthreadVideo
              src={fonte}
              playbackRate={p.vel}
              style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'contain'}}
            />
          </>
        ) : (
          <OffthreadVideo
            src={fonte}
            playbackRate={p.vel}
            style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.12) contrast(1.05)'}}
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 22,
          textAlign: 'center',
          fontFamily: MAO,
          fontSize: 44,
          color: '#2A1A4A',
        }}
      >
        cena {String(indice + 1).padStart(2, '0')} ★
      </div>
      {/* fita adesiva */}
      <div
        style={{
          position: 'absolute',
          top: -26,
          left: '50%',
          width: 220,
          height: 56,
          marginLeft: -110,
          background: CORES[indice % CORES.length],
          opacity: 0.85,
          transform: `rotate(${indice % 2 ? 4 : -4}deg)`,
          borderRadius: 4,
        }}
      />
    </div>
  );
};

/* Lista de créditos da página */
const ListaCreditos: React.FC<{p: Pagina; indice: number; dur: number}> = ({p, indice, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = p.creditos.length;
  const passo = n === 4 ? 205 : 250;
  const topo = 540 - ((n - 1) * passo) / 2 - 70;
  return (
    <div style={{position: 'absolute', left: 1210, top: 0, width: 660, height: 1080}}>
      {p.creditos.map(([pers, ator], i) => {
        const d = 2 + i * 4;
        const entra = spring({frame: frame - d, fps, config: {damping: 14, stiffness: 150}});
        const sai = interpolate(frame, [dur - 10 + i * 2, dur - 2 + i * 2], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });
        const cor = CORES[(indice * 4 + i) % CORES.length];
        const longo = ator.length > 12;
        return (
          <div
            key={pers + i}
            style={{
              position: 'absolute',
              top: topo + i * passo,
              left: 0,
              transform: `translateX(${(1 - entra) * 160 - sai * 120}px)`,
              opacity: entra * (1 - sai),
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Estrela size={34} cor={cor} style={{transform: `rotate(${frame * 3 + i * 40}deg)`}} />
              <span style={{fontFamily: MAO, fontSize: 40, color: cor, letterSpacing: 1}}>{pers}</span>
            </div>
            <div
              style={{
                fontFamily: NOME,
                fontWeight: 800,
                fontSize: ator.length > 14 ? 66 : longo ? 84 : 100,
                lineHeight: 1.05,
                color: '#FFFFFF',
                marginLeft: 48,
                textShadow: `0 6px 0 ${cor}99, 0 10px 30px rgba(0,0,0,0.5)`,
                whiteSpace: 'nowrap',
              }}
            >
              {ator}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Cabecalho: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 70,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: op,
        background: 'rgba(255,255,255,0.1)',
        border: '3px solid rgba(255,255,255,0.6)',
        borderRadius: 999,
        padding: '6px 26px 8px 14px',
      }}
    >
      <Estrela size={40} cor="#FF3B5C" style={{transform: `rotate(${frame * 3}deg)`}} />
      <span style={{fontFamily: NOME, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: 4}}>ELENCO</span>
    </div>
  );
};

/* Título "CARROSSEL la película" */
const Titulo: React.FC<{escala?: number}> = ({escala = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 10, stiffness: 140}});
  const b = spring({frame: frame - 12, fps, config: {damping: 10, stiffness: 150}});
  const letras = 'CARROSSEL'.split('');
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${escala})`}}>
      <div style={{display: 'flex', transform: `scale(${a})`}}>
        {letras.map((l, i) => (
          <span
            key={i}
            style={{
              fontFamily: NOME,
              fontWeight: 800,
              fontSize: 210,
              lineHeight: 1,
              color: CORES[i % CORES.length],
              WebkitTextStroke: '10px #FFFFFF',
              paintOrder: 'stroke fill',
              textShadow: '0 14px 0 rgba(0,0,0,0.5)',
              transform: `translateY(${Math.sin(frame / 5 - i * 0.6) * 9}px)`,
            }}
          >
            {l}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: 24,
          transform: `scale(${b}) rotate(-3deg)`,
          background: '#fff',
          borderRadius: 999,
          padding: '4px 44px 12px',
          boxShadow: '0 10px 0 rgba(0,0,0,0.35)',
          fontFamily: MAO,
          fontSize: 84,
          color: FUNDO,
        }}
      >
        la película
      </div>
    </div>
  );
};

const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const sai = interpolate(frame, [ABERTURA - 10, ABERTURA], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sub = interpolate(frame, [24, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: sai, transform: `scale(${1 + (1 - sai) * 0.2})`}}>
      <Titulo />
      <div style={{marginTop: 40, fontFamily: NOME, fontWeight: 800, fontSize: 46, letterSpacing: 14, color: '#FFC83D', opacity: sub}}>
        ELENCO
      </div>
    </AbsoluteFill>
  );
};

const Fechamento: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const parte2 = 72;
  const e1 = spring({frame, fps, config: {damping: 13, stiffness: 140}});
  const e2 = spring({frame: frame - 8, fps, config: {damping: 13, stiffness: 140}});
  const sai1 = interpolate(frame, [parte2 - 10, parte2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const escurece = interpolate(frame, [FECHAMENTO - 14, FECHAMENTO], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const equipe: Credito[] = [
    ['Câmera', 'Bia Mendes'],
    ['Edição', 'Gabi Lima'],
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 70, opacity: sai1}}>
        {equipe.map(([f, n], i) => {
          const e = i === 0 ? e1 : e2;
          return (
            <div key={f} style={{textAlign: 'center', transform: `translateY(${(1 - e) * 80}px)`, opacity: e}}>
              <div style={{fontFamily: MAO, fontSize: 54, color: CORES[i * 2 + 1]}}>{f}</div>
              <div style={{fontFamily: NOME, fontWeight: 800, fontSize: 130, lineHeight: 1, color: '#fff', textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>
                {n}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Sequence from={parte2}>
        <FimCard />
      </Sequence>
      <AbsoluteFill style={{background: '#000', opacity: escurece}} />
    </AbsoluteFill>
  );
};

const FimCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: frame - 18, fps, config: {damping: 9, stiffness: 130}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <Titulo escala={0.72} />
      <div
        style={{
          marginTop: 50,
          fontFamily: NOME,
          fontWeight: 800,
          fontSize: 110,
          letterSpacing: 20,
          color: '#FFC83D',
          transform: `scale(${e})`,
          textShadow: '0 8px 0 rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <Estrela size={70} cor="#FF3B5C" style={{transform: `rotate(${frame * 4}deg)`}} />
        FIM
        <Estrela size={70} cor="#2F80FF" style={{transform: `rotate(${-frame * 4}deg)`}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Composição ---------- */

export const Creditos: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 8, ABERTURA - 8, ABERTURA + 4, FIM_PAGINAS - 4, FIM_PAGINAS + 8, DURACAO_CREDITOS - 40, DURACAO_CREDITOS],
    [0, 0.9, 0.9, 0.16, 0.16, 0.9, 0.9, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{background: FUNDO}}>
      <Fundo />
      <Sequence durationInFrames={ABERTURA}>
        <Abertura />
      </Sequence>
      <Sequence from={ABERTURA} durationInFrames={FIM_PAGINAS - ABERTURA}>
        <Cabecalho />
      </Sequence>
      {PAGINAS.map((p, i) => {
        const dur = durPagina(p);
        return (
          <Sequence key={p.cena} from={INICIOS[i]} durationInFrames={dur}>
            <Cena p={p} indice={i} dur={dur} />
            <ListaCreditos p={p} indice={i} dur={dur} />
          </Sequence>
        );
      })}
      <Sequence from={FIM_PAGINAS}>
        <Fechamento />
      </Sequence>
      <Grao />
      <Audio src={staticFile('sons/valsa.wav')} volume={volume} />
    </AbsoluteFill>
  );
};
