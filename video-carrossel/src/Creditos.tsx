import React from 'react';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const FPS = 30;
const SERIFA = "'Playfair Display', serif";
const SANS = "'Montserrat', sans-serif";
const OURO = '#D9B77A';
const CINZA = 'rgba(255,255,255,0.62)';

/* ---------- Vídeos (todos da pasta, com o áudio original) ---------- */

type Clipe = {arquivo: string; seg: number; vertical?: boolean};
const CLIPES: Clipe[] = [
  {arquivo: 'clip1.mp4', seg: 22.7},
  {arquivo: 'clip2.mp4', seg: 8.3},
  {arquivo: 'clip3.mp4', seg: 11.9},
  {arquivo: 'clip4.mp4', seg: 4.9},
  {arquivo: 'clip5.mp4', seg: 9.2},
  {arquivo: 'clip6.mp4', seg: 12.2},
  {arquivo: 'clip7.mp4', seg: 6.5, vertical: true},
  {arquivo: 'clip8.mp4', seg: 2.28},
  {arquivo: 'clip9.mp4', seg: 2.37},
];

/* ---------- Créditos ---------- */

type Credito = [papel: string, nome: string];
const ELENCO: Credito[] = [
  ['Maria Joaquina', 'Flavia'],
  ['Cirilo', 'Enrico'],
  ['Kokimoto', 'Pang'],
  ['Paulo', 'Frassi'],
  ['Carmen', 'Manu E.'],
  ['Professora Helena', 'Julia'],
  ['Davi', 'Pietro'],
  ['Adriano', 'Pietro'],
  ['Valeria', 'Nunuka'],
  ['Daniel', 'Kevin'],
  ['Jaime', 'Brito'],
  ['Alicia', 'Cata'],
  ['Mario', 'Mendes'],
  ['Laura', 'Velem'],
  ['Marcelina', 'Yasmin'],
  ['Jorge', 'Kawa (primeiro ano)'],
  ['Graça', 'Ana Luisa'],
  ['Didi Ma / Margarida', 'Gabi L.'],
  ['Bibi', 'Gabi Porf'],
  ['Bandido 1', 'Marcio'],
  ['Bandido 2', 'Kadu'],
  ['Dono do sítio', 'Tio Ronaldo'],
  ['Diretora', 'Luca Nass'],
  ['Galã', 'Enzo Gaby'],
  ['Sumô', 'Brito'],
];
const EQUIPE: Credito[] = [
  ['Câmera', 'Bia Mendes'],
  ['Edição', 'Gabi Lima'],
];

const ABERTURA = 4 * FPS;
const FINAL = 4 * FPS;
const INICIOS: number[] = [];
let _t = ABERTURA;
for (const c of CLIPES) {
  INICIOS.push(_t);
  _t += Math.round(c.seg * FPS);
}
const FIM_CLIPES = _t;
export const DURACAO_CREDITOS = FIM_CLIPES + FINAL;

/* Alturas fixas para calcular a rolagem */
const ALT_TITULO = 170;
const ALT_ITEM = 128;
const ESPACO = 150;
const ALTURA_LISTA = ALT_TITULO + ELENCO.length * ALT_ITEM + ESPACO + ALT_TITULO + EQUIPE.length * ALT_ITEM;

/* ---------- Peças ---------- */

const Grao: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Linha: React.FC<{largura: number; style?: React.CSSProperties}> = ({largura, style}) => (
  <div style={{width: largura, height: 1, background: `linear-gradient(90deg, transparent, ${OURO}, transparent)`, ...style}} />
);

const Titulo: React.FC<{tamanho?: number}> = ({tamanho = 1}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${tamanho})`}}>
    <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: 12, color: OURO, marginBottom: 26}}>
      UM FILME DA TURMA
    </div>
    <div style={{fontFamily: SERIFA, fontWeight: 400, fontSize: 150, letterSpacing: 34, color: '#fff', lineHeight: 1, marginRight: -34}}>
      CARROSSEL
    </div>
    <Linha largura={620} style={{margin: '30px 0 18px'}} />
    <div style={{fontFamily: SERIFA, fontStyle: 'italic', fontSize: 64, color: OURO}}>la película</div>
  </div>
);

const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 25, ABERTURA - 20, ABERTURA], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const zoom = interpolate(frame, [0, ABERTURA], [1.04, 1], {easing: Easing.out(Easing.quad)});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: op, transform: `scale(${zoom})`}}>
      <Titulo />
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 22, FINAL - 25, FINAL], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: op}}>
      <Titulo tamanho={0.62} />
      <div style={{fontFamily: SERIFA, fontStyle: 'italic', fontSize: 92, color: '#fff', marginTop: 50}}>Fim</div>
    </AbsoluteFill>
  );
};

/* Moldura com o vídeo */
const VX = 100;
const VW = 1120;
const VH = 630;
const VY = (1080 - VH) / 2;

const Tela: React.FC<{c: Clipe; dur: number}> = ({c, dur}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const zoom = interpolate(frame, [0, dur], [1, 1.035]);
  const src = staticFile(`creditos2/${c.arquivo}`);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: op, overflow: 'hidden'}}>
      {c.vertical ? (
        <>
          <OffthreadVideo
            src={src}
            muted
            style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(30px) brightness(0.45)', transform: 'scale(1.2)'}}
          />
          <OffthreadVideo src={src} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'contain'}} />
        </>
      ) : (
        <OffthreadVideo
          src={src}
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, filter: 'contrast(1.05) saturate(0.95)'}}
        />
      )}
    </div>
  );
};

const Moldura: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [ABERTURA - 10, ABERTURA + 15, FIM_CLIPES - 10, FIM_CLIPES + 10], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: VX,
        top: VY,
        width: VW,
        height: VH,
        opacity: op,
        background: '#000',
        boxShadow: '0 40px 90px rgba(0,0,0,0.8)',
        outline: '1px solid rgba(217,183,122,0.35)',
        outlineOffset: 14,
      }}
    >
      {CLIPES.map((c, i) => {
        const dur = Math.round(c.seg * FPS);
        return (
          <Sequence key={c.arquivo} from={INICIOS[i]} durationInFrames={dur} layout="none">
            <Tela c={c} dur={dur} />
          </Sequence>
        );
      })}
      {/* leve vinheta na imagem */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
};

/* Coluna de créditos subindo */
const CX = 1310;
const CW = 520;

const Item: React.FC<{c: Credito}> = ({c}) => (
  <div style={{height: ALT_ITEM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 5, color: CINZA, textTransform: 'uppercase'}}>
      {c[0]}
    </div>
    <div
      style={{
        fontFamily: SERIFA,
        fontSize: c[1].length > 14 ? 42 : 52,
        color: '#fff',
        marginTop: 8,
        whiteSpace: 'nowrap',
      }}
    >
      {c[1]}
    </div>
  </div>
);

const Secao: React.FC<{nome: string}> = ({nome}) => (
  <div style={{height: ALT_TITULO, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: SERIFA, fontStyle: 'italic', fontSize: 54, color: OURO}}>{nome}</div>
    <Linha largura={260} style={{marginTop: 16}} />
  </div>
);

const Rolagem: React.FC = () => {
  const frame = useCurrentFrame();
  const inicio = ABERTURA + 10;
  const fim = FIM_CLIPES - 10;
  // começa abaixo da tela e termina com a equipe passando pelo centro
  const y = interpolate(frame, [inicio, fim], [1080, 540 - ALTURA_LISTA + 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = interpolate(frame, [fim - 5, fim + 15], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: CX,
        top: 0,
        width: CW,
        height: 1080,
        overflow: 'hidden',
        opacity: op,
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)',
      }}
    >
      <div style={{position: 'absolute', left: 0, width: CW, top: 0, transform: `translateY(${y}px)`}}>
        <Secao nome="Elenco" />
        {ELENCO.map((c, i) => (
          <Item key={i} c={c} />
        ))}
        <div style={{height: ESPACO}} />
        <Secao nome="Equipe" />
        {EQUIPE.map((c, i) => (
          <Item key={i} c={c} />
        ))}
      </div>
    </div>
  );
};

/* ---------- Composição ---------- */

export const Creditos: React.FC = () => (
  <AbsoluteFill style={{background: '#08070A'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 35% 50%, #1D1A22 0%, #08070A 75%)'}} />
    <Moldura />
    <Rolagem />
    <Sequence durationInFrames={ABERTURA}>
      <Abertura />
    </Sequence>
    <Sequence from={FIM_CLIPES}>
      <Final />
    </Sequence>
    {/* faixas de cinema */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: '#000'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 60, background: '#000'}} />
    <Grao />
  </AbsoluteFill>
);
