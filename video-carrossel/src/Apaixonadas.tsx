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

export const DURACAO_APAIXONADAS = 456; // 15,2 s
const W = 1920;
const H = 1080;
const NOME = "'Baloo 2', sans-serif";
const MAO = "'Permanent Marker', cursive";
const ROSA = '#FF4F9A';
const VERMELHO = '#FF2D55';

/* Posições aproximadas das cabeças no quadro original (1920x1080) */
const MENINA_A = {x: 520, y: 610}; // sentada à esquerda, tranças
const MENINA_B = {x: 615, y: 300}; // em pé, lenço vermelho
const MENINA_C = {x: 1175, y: 250}; // faixa na cabeça
const MENINA_D = {x: 1470, y: 240}; // em pé, à direita
const GALA = {x: 985, y: 505}; // menino no centro
const MENINAS = [MENINA_A, MENINA_B, MENINA_C, MENINA_D];

/* ---------- Câmera virtual ---------- */

type Chave = {f: number; s: number; x: number; y: number};
const CAMERA: Chave[] = [
  {f: 0, s: 1, x: 960, y: 540},
  {f: 40, s: 1.04, x: 960, y: 540},
  {f: 50, s: 1.9, x: 560, y: 600}, // menina A
  {f: 104, s: 2.0, x: 560, y: 600},
  {f: 114, s: 2.0, x: 615, y: 330}, // menina B
  {f: 166, s: 2.1, x: 615, y: 320},
  {f: 176, s: 2.0, x: 1175, y: 300}, // menina C
  {f: 220, s: 2.1, x: 1175, y: 290},
  {f: 230, s: 2.0, x: 1460, y: 320}, // menina D
  {f: 274, s: 2.1, x: 1460, y: 310},
  {f: 286, s: 1.8, x: 975, y: 470}, // o galã
  {f: 346, s: 2.05, x: 975, y: 480},
  {f: 356, s: 1, x: 960, y: 540}, // todo mundo
  {f: 402, s: 1.04, x: 960, y: 540},
  {f: 456, s: 1.18, x: 760, y: 560},
];

function camera(frame: number) {
  let i = 0;
  while (i < CAMERA.length - 2 && CAMERA[i + 1].f <= frame) i++;
  const a = CAMERA[i];
  const b = CAMERA[i + 1];
  const t = interpolate(frame, [a.f, b.f], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const s = a.s + (b.s - a.s) * t;
  let x = a.x + (b.x - a.x) * t;
  let y = a.y + (b.y - a.y) * t;
  x = Math.min(Math.max(x, W / 2 / s), W - W / 2 / s);
  y = Math.min(Math.max(y, H / 2 / s), H - H / 2 / s);
  return {s, x, y};
}

// "tum-tum" do coração: pequenos pulos de zoom em ritmo de batimento (0,8 s)
function batida(frame: number) {
  const fase = (frame % 24) / 24;
  const p1 = Math.exp(-(((fase - 0.02) / 0.05) ** 2));
  const p2 = Math.exp(-(((fase - 0.27) / 0.05) ** 2)) * 0.7;
  return p1 + p2;
}

const NA_BATIDA = (f: number) => (f >= 50 && f < 286) || (f >= 356 && f < 402);

/* ---------- Coração ---------- */

const CAMINHO =
  'M12 21.3s-7.6-4.6-10.1-9.4C.2 8.3 2.3 3.9 6.3 3.9c2.3 0 3.9 1.3 5.7 3.5 1.8-2.2 3.4-3.5 5.7-3.5 4 0 6.1 4.4 4.4 8C19.6 16.7 12 21.3 12 21.3z';

const Coracao: React.FC<{size: number; cor?: string; style?: React.CSSProperties; borda?: boolean}> = ({
  size,
  cor = VERMELHO,
  style,
  borda = true,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d={CAMINHO} fill={cor} stroke={borda ? '#fff' : 'none'} strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="7.4" cy="8.2" rx="1.9" ry="1.2" fill="#fff" opacity="0.55" transform="rotate(-35 7.4 8.2)" />
  </svg>
);

const CoracaoPartido: React.FC<{size: number; abre: number}> = ({size, abre}) => (
  <svg width={size * 1.4} height={size} viewBox="-6 0 36 24" style={{overflow: 'visible'}}>
    <g transform={`translate(${-abre * 4} ${abre * 2}) rotate(${-abre * 18} 12 21)`}>
      <path d="M12 21.3s-7.6-4.6-10.1-9.4C.2 8.3 2.3 3.9 6.3 3.9c2.3 0 3.9 1.3 5.7 3.5L10.5 11l2.5 3-2 3.5z" fill={VERMELHO} stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </g>
    <g transform={`translate(${abre * 4} ${abre * 2}) rotate(${abre * 18} 12 21)`}>
      <path d="M12 7.4c1.8-2.2 3.4-3.5 5.7-3.5 4 0 6.1 4.4 4.4 8C19.6 16.7 12 21.3 12 21.3L11 17.5l2-3.5-2.5-3z" fill={VERMELHO} stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </g>
  </svg>
);

const Brilho: React.FC<{size: number; cor?: string; style?: React.CSSProperties}> = ({size, cor = '#FFF3A8', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill={cor} />
  </svg>
);

/* Corações subindo de um ponto (coordenadas da imagem) */
const Bolhas: React.FC<{x: number; y: number; dur: number; seed: string; escala: number; n?: number}> = ({
  x,
  y,
  dur,
  seed,
  escala,
  n = 14,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const nasce = (i / n) * dur * 0.8;
        const vida = 34 + random(`${seed}v${i}`) * 18;
        const t = (frame - nasce) / vida;
        if (t < 0 || t > 1) return null;
        const lado = (random(`${seed}x${i}`) - 0.5) * 150;
        const sobe = t * (150 + random(`${seed}y${i}`) * 90);
        const balanca = Math.sin(t * 9 + i) * 16;
        const tam = (26 + random(`${seed}s${i}`) * 30) / escala;
        const op = interpolate(t, [0, 0.12, 0.75, 1], [0, 1, 1, 0]);
        const cores = [VERMELHO, ROSA, '#FF8CC6', '#E0115F'];
        return (
          <Coracao
            key={i}
            size={tam}
            cor={cores[i % cores.length]}
            style={{
              position: 'absolute',
              left: x + lado + balanca - tam / 2,
              top: y - sobe - tam / 2,
              opacity: op,
              transform: `scale(${interpolate(t, [0, 0.15], [0.2, 1], {extrapolateRight: 'clamp'})}) rotate(${balanca}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/* Coração grande que bate ao lado da cabeça */
const CoracaoBatendo: React.FC<{x: number; y: number; escala: number}> = ({x, y, escala}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame, fps, config: {damping: 9, stiffness: 170}});
  const tam = (92 / escala) * (1 + batida(frame) * 0.28) * entra;
  return (
    <Coracao
      size={tam}
      style={{
        position: 'absolute',
        left: x - tam / 2,
        top: y - tam / 2,
        filter: 'drop-shadow(0 0 12px rgba(255,45,85,0.8))',
      }}
    />
  );
};

/* Brilhos em volta do galã */
const BrilhosGala: React.FC<{escala: number}> = ({escala}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(12).fill(0).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2 + frame / 30;
        const r = 150 + Math.sin(frame / 8 + i) * 22;
        const pisca = 0.5 + 0.5 * Math.sin(frame / 3 + i * 1.7);
        const tam = ((34 + (i % 3) * 18) / escala) * (0.5 + pisca * 0.7);
        return (
          <Brilho
            key={i}
            size={tam}
            cor={i % 2 ? '#FFF3A8' : '#FFFFFF'}
            style={{
              position: 'absolute',
              left: GALA.x + Math.cos(ang) * r - tam / 2,
              top: GALA.y - 30 + Math.sin(ang) * r * 0.85 - tam / 2,
              opacity: pisca,
              filter: 'drop-shadow(0 0 8px #FFD84D)',
            }}
          />
        );
      })}
    </>
  );
};

/* Corações voando de cada menina até o galã */
const Flechas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {MENINAS.flatMap((m, mi) =>
        new Array(6).fill(0).map((_, k) => {
          const nasce = k * 7 + mi * 3;
          const t = (frame - nasce) / 22;
          if (t < 0 || t > 1) return null;
          const e = Easing.inOut(Easing.quad)(t);
          const cx = (m.x + GALA.x) / 2;
          const cy = Math.min(m.y, GALA.y) - 180;
          const x = (1 - e) ** 2 * m.x + 2 * (1 - e) * e * cx + e ** 2 * GALA.x;
          const y = (1 - e) ** 2 * m.y + 2 * (1 - e) * e * cy + e ** 2 * GALA.y;
          const tam = 46 * (1 - e * 0.45);
          return (
            <Coracao
              key={`${mi}-${k}`}
              size={tam}
              cor={[VERMELHO, ROSA, '#E0115F', '#FF8CC6'][mi]}
              style={{
                position: 'absolute',
                left: x - tam / 2,
                top: y - tam / 2,
                opacity: interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
                filter: 'drop-shadow(0 0 8px rgba(255,79,154,0.9))',
              }}
            />
          );
        }),
      )}
    </>
  );
};

/* Explosão de corações quando eles chegam no galã */
const Explosao: React.FC<{x: number; y: number; seed: string}> = ({x, y, seed}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(12).fill(0).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2 + random(`${seed}${i}`) * 0.4;
        const p = Easing.out(Easing.quad)(Math.min(frame / 18, 1));
        const d = 170 * p * (0.7 + random(`${seed}d${i}`) * 0.5);
        const tam = 34;
        return (
          <Coracao
            key={i}
            size={tam}
            cor={i % 2 ? ROSA : VERMELHO}
            style={{
              position: 'absolute',
              left: x + Math.cos(ang) * d - tam / 2,
              top: y + Math.sin(ang) * d - tam / 2,
              opacity: interpolate(frame, [0, 2, 14, 22], [0, 1, 1, 0], {extrapolateRight: 'clamp'}),
            }}
          />
        );
      })}
    </>
  );
};

/* ---------- Textos (fora da câmera) ---------- */

const Etiqueta: React.FC<{
  titulo: string;
  sub?: string;
  lado: 'esq' | 'dir';
  cor?: string;
  dur: number;
}> = ({titulo, sub, lado, cor = ROSA, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame, fps, config: {damping: 10, stiffness: 190, mass: 0.6}});
  const sai = interpolate(frame, [dur - 5, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const esq = lado === 'esq';
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        [esq ? 'left' : 'right']: 90,
        transform: `translateX(${(1 - entra) * (esq ? -400 : 400)}px) rotate(${esq ? -4 : 4}deg) scale(${entra * (0.7 + 0.3 * sai)})`,
        opacity: sai,
        display: 'flex',
        flexDirection: 'column',
        alignItems: esq ? 'flex-start' : 'flex-end',
      }}
    >
      {sub ? (
        <div
          style={{
            fontFamily: MAO,
            fontSize: 42,
            color: cor,
            background: '#fff',
            padding: '4px 22px 8px',
            borderRadius: 14,
            marginBottom: -12,
            zIndex: 2,
            boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
            [esq ? 'marginLeft' : 'marginRight']: 26,
          }}
        >
          {sub}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: NOME,
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1,
          color: '#fff',
          background: cor,
          border: '8px solid #fff',
          borderRadius: 32,
          padding: '26px 48px 16px',
          boxShadow: '0 14px 0 rgba(120,0,50,0.75), 0 26px 50px rgba(0,0,0,0.35)',
          whiteSpace: 'nowrap',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 3px, transparent 3.5px)',
          backgroundSize: '26px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        {titulo}
        <Coracao size={86} cor="#fff" borda={false} style={{transform: `scale(${1 + batida(frame) * 0.25})`}} />
      </div>
    </div>
  );
};

/* Medidor de paixão que vai escalando */
const Medidor: React.FC<{de: number; ate: number; dur: number; lado: 'esq' | 'dir'}> = ({de, ate, dur, lado}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame: frame - 3, fps, config: {damping: 12, stiffness: 200}});
  const sai = interpolate(frame, [dur - 5, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const v = interpolate(frame, [4, dur * 0.7], [de, ate], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const cheio = Math.min(v / 100, 1);
  const estoura = v > 100;
  const tremor = estoura ? Math.sin(frame * 2.7) * 4 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        [lado === 'esq' ? 'left' : 'right']: 80,
        width: 520,
        transform: `scale(${entra}) translateX(${tremor}px)`,
        opacity: sai,
        background: 'rgba(255,255,255,0.94)',
        borderRadius: 26,
        padding: '16px 24px 20px',
        boxShadow: '0 10px 0 rgba(120,0,50,0.5)',
        fontFamily: NOME,
        fontWeight: 800,
        color: '#7A0034',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontSize: 34, letterSpacing: 1}}>NÍVEL DE PAIXÃO</span>
        <span style={{fontSize: 52, color: estoura ? VERMELHO : '#7A0034'}}>{Math.round(v)}%</span>
      </div>
      <div style={{height: 30, background: '#FFD6E7', borderRadius: 99, overflow: 'hidden', marginTop: 6}}>
        <div
          style={{
            width: `${cheio * 100}%`,
            height: '100%',
            borderRadius: 99,
            background: `linear-gradient(90deg, #FF8CC6, ${VERMELHO})`,
            boxShadow: estoura ? `0 0 ${10 + batida(frame) * 20}px ${VERMELHO}` : undefined,
          }}
        />
      </div>
    </div>
  );
};

const Titulo: React.FC<{linha1: string; linha2: string; dur: number; topo?: boolean}> = ({linha1, linha2, dur, topo}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 10, stiffness: 160}});
  const b = spring({frame: frame - 7, fps, config: {damping: 9, stiffness: 150}});
  const sai = interpolate(frame, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: topo ? 'flex-start' : 'center',
        paddingTop: topo ? 60 : 0,
        opacity: sai,
      }}
    >
      <div
        style={{
          fontFamily: MAO,
          fontSize: 64,
          color: '#fff',
          transform: `scale(${a}) rotate(-3deg)`,
          textShadow: '0 5px 0 rgba(120,0,50,0.7), 0 0 30px rgba(255,79,154,0.9)',
        }}
      >
        {linha1}
      </div>
      <div
        style={{
          fontFamily: NOME,
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          color: ROSA,
          WebkitTextStroke: '10px #fff',
          paintOrder: 'stroke fill',
          textShadow: '0 12px 0 rgba(120,0,50,0.85)',
          transform: `scale(${b}) rotate(${Math.sin(frame / 7) * 2}deg)`,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Coracao size={110} style={{transform: `scale(${1 + batida(frame) * 0.25})`}} />
        {linha2}
        <Coracao size={110} style={{transform: `scale(${1 + batida(frame) * 0.25})`}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Clima: cor, brilho, chuva de corações ---------- */

const ChuvaCoracoes: React.FC<{dur: number; n?: number}> = ({dur, n = 40}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const nasce = random(`c${i}`) * dur * 0.6;
        const vida = 45 + random(`cv${i}`) * 30;
        const t = (frame - nasce) / vida;
        if (t < 0 || t > 1) return null;
        const tam = 30 + random(`cs${i}`) * 50;
        const x = random(`cx${i}`) * W + Math.sin(t * 6 + i) * 40;
        const y = -80 + t * (H + 160);
        return (
          <Coracao
            key={i}
            size={tam}
            cor={[VERMELHO, ROSA, '#FF8CC6', '#E0115F'][i % 4]}
            style={{position: 'absolute', left: x, top: y, opacity: 0.9, transform: `rotate(${Math.sin(t * 8 + i) * 25}deg)`}}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Composição ---------- */

export const Apaixonadas: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camera(frame);
  const anterior = camera(Math.max(frame - 1, 0));
  const vel = Math.hypot((cam.x - anterior.x) * cam.s, (cam.y - anterior.y) * cam.s) + Math.abs(cam.s - anterior.s) * 900;
  const borrao = Math.min(vel / 14, 9);
  const pulso = NA_BATIDA(frame) ? 1 + batida(frame) * 0.025 : 1;
  const s = cam.s * pulso;
  const tx = W / 2 - cam.x * s;
  const ty = H / 2 - cam.y * s;

  const rosaForca = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const flash = NA_BATIDA(frame) ? batida(frame) * 0.12 : 0;

  // elementos presos às pessoas (andam junto com o zoom)
  const preso = (
    <>
      <Sequence from={50} durationInFrames={60}>
        <Bolhas x={MENINA_A.x} y={MENINA_A.y - 110} dur={60} seed="a" escala={2} />
        <CoracaoBatendo x={MENINA_A.x - 120} y={MENINA_A.y - 140} escala={2} />
      </Sequence>
      <Sequence from={114} durationInFrames={58}>
        <Bolhas x={MENINA_B.x} y={MENINA_B.y - 100} dur={58} seed="b" escala={2} />
        <CoracaoBatendo x={MENINA_B.x - 130} y={MENINA_B.y - 40} escala={2} />
      </Sequence>
      <Sequence from={176} durationInFrames={54}>
        <Bolhas x={MENINA_C.x} y={MENINA_C.y - 90} dur={54} seed="c" escala={2} />
        <CoracaoBatendo x={MENINA_C.x - 120} y={MENINA_C.y - 40} escala={2} />
      </Sequence>
      <Sequence from={230} durationInFrames={52}>
        <Bolhas x={MENINA_D.x} y={MENINA_D.y - 90} dur={52} seed="d" escala={2} />
        <CoracaoBatendo x={MENINA_D.x + 130} y={MENINA_D.y - 30} escala={2} />
      </Sequence>
      <Sequence from={286} durationInFrames={70}>
        <BrilhosGala escala={1.9} />
      </Sequence>
      <Sequence from={356} durationInFrames={46}>
        <Flechas />
      </Sequence>
      {[0, 1, 2].map((k) => (
        <Sequence key={k} from={375 + k * 9} durationInFrames={24}>
          <Explosao x={GALA.x} y={GALA.y} seed={`e${k}`} />
        </Sequence>
      ))}
    </>
  );

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* câmera */}
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          filter: `blur(${borrao}px)`,
        }}
      >
        <AbsoluteFill style={{filter: 'saturate(1.12) contrast(1.04)'}}>
          <OffthreadVideo src={staticFile('apaixonadas.mp4')} muted />
        </AbsoluteFill>
        {preso}
      </AbsoluteFill>

      {/* tom rosado de novela romântica */}
      <AbsoluteFill style={{background: '#FF6FAE', mixBlendMode: 'soft-light', opacity: 0.55 * rosaForca}} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,120,180,0) 50%, rgba(255,40,120,0.5) 100%)',
          opacity: rosaForca,
        }}
      />
      <AbsoluteFill style={{background: '#FFD1E6', opacity: flash, mixBlendMode: 'screen'}} />

      {/* textos */}
      <Sequence from={4} durationInFrames={42}>
        <Titulo linha1="alerta de" linha2="PAIXÃO!" dur={42} />
      </Sequence>

      <Sequence from={52} durationInFrames={56}>
        <Etiqueta titulo="Suspirando..." sub="apaixonada nº 1" lado="dir" dur={56} />
        <Medidor de={0} ate={100} dur={56} lado="dir" />
      </Sequence>
      <Sequence from={116} durationInFrames={54}>
        <Etiqueta titulo="Ai, ai..." sub="apaixonada nº 2" lado="dir" cor="#E0115F" dur={54} />
        <Medidor de={100} ate={250} dur={54} lado="dir" />
      </Sequence>
      <Sequence from={178} durationInFrames={48}>
        <Etiqueta titulo="Que lindo!" sub="apaixonada nº 3" lado="esq" cor="#C2187A" dur={48} />
        <Medidor de={250} ate={500} dur={48} lado="esq" />
      </Sequence>
      <Sequence from={232} durationInFrames={48}>
        <Etiqueta titulo="Meu crush" sub="apaixonada nº 4" lado="esq" cor={VERMELHO} dur={48} />
        <Medidor de={500} ate={1000} dur={48} lado="esq" />
      </Sequence>
      <Sequence from={290} durationInFrames={62}>
        <Etiqueta titulo="O GALÃ" sub="...e ele nem percebe" lado="esq" cor="#F2A100" dur={62} />
      </Sequence>

      <Sequence from={356} durationInFrames={50}>
        <ChuvaCoracoes dur={50} n={34} />
        <Titulo linha1="todas de olho no" linha2="MESMO CRUSH" dur={46} topo />
      </Sequence>

      {/* uma desiste */}
      <Sequence from={402} durationInFrames={54}>
        <Desistiu />
      </Sequence>

      {/* sons */}
      <Audio src={staticFile('apaixonadas.mp4')} volume={0.85} />
      <Sequence from={50} durationInFrames={236}>
        <Audio src={staticFile('sons/coracao.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={286} durationInFrames={50}>
        <Audio src={staticFile('sons/brilho.wav')} volume={0.55} />
      </Sequence>
      <Sequence from={356} durationInFrames={46}>
        <Audio src={staticFile('sons/coracao.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={408} durationInFrames={40}>
        <Audio src={staticFile('sons/triste.wav')} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Desistiu: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = spring({frame, fps, config: {damping: 9, stiffness: 170}});
  const abre = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(2)),
  });
  const cai = interpolate(frame, [20, 54], [0, 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fundo = interpolate(frame, [0, 12], [0, 0.35], {extrapolateRight: 'clamp'});
  const txt = spring({frame: frame - 10, fps, config: {damping: 10, stiffness: 170}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#3A3A5A', mixBlendMode: 'multiply', opacity: fundo}} />
      <div style={{position: 'absolute', left: 150, top: 300 + cai, transform: `scale(${entra})`}}>
        <CoracaoPartido size={230} abre={abre} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 110,
          bottom: 110,
          transform: `scale(${txt}) rotate(-4deg)`,
          fontFamily: NOME,
          fontWeight: 800,
          fontSize: 96,
          color: '#fff',
          background: '#5B5B7A',
          border: '8px solid #fff',
          borderRadius: 30,
          padding: '22px 44px 12px',
          boxShadow: '0 14px 0 rgba(0,0,0,0.45)',
        }}
      >
        uma desistiu...
      </div>
    </AbsoluteFill>
  );
};
