import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Camera, clamp, Dust, Fog, Glow, H, lerp, Rays, rng, Sky, Svg, useProgress, W} from '../lib';
import {NoahSitting, NoahStandBack, NoahWalk} from '../noah';
import {camFor, mouth, SetProps, Stars} from './common';

type T = 'day' | 'twilight' | 'night' | 'storm';
const ASKY: Record<T, [number, string][]> = {
  day: [[0, '#5d8396'], [0.5, '#a9c3cc'], [0.8, '#e6d8c4'], [1, '#f2e2c8']],
  twilight: [[0, '#14203a'], [0.4, '#3a4a6a'], [0.65, '#a0788a'], [0.8, '#e0a07a'], [1, '#f0c090']],
  night: [[0, '#02050a'], [0.6, '#08121c'], [1, '#12222e']],
  storm: [[0, '#8a98a0'], [0.5, '#b8c4c8'], [1, '#d8e0e2']],
};
const SNOW: Record<T, [string, string]> = {
  day: ['#e8f0f2', '#b8ccd4'], twilight: ['#b8b8d0', '#7a7a9a'], night: ['#2a3a4a', '#16222c'], storm: ['#d8e0e2', '#b0bcc0'],
};

const useShake = (amt: number) => {
  const frame = useCurrentFrame();
  const r = rng(frame * 13 + 5);
  return amt ? [(r() - 0.5) * 36 * amt, (r() - 0.5) * 26 * amt] : [0, 0];
};

/** blowing snow / blizzard streaks */
const Blizzard: React.FC<{amt?: number; seed?: number}> = ({amt = 1, seed = 3}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <g opacity={0.85 * amt}>
      {Array.from({length: Math.round(260 * amt)}, (_, i) => {
        const y0 = r() * H, sp = 30 + r() * 40, len = 20 + r() * 60, ph = r() * W;
        const x = W - ((ph + frame * sp) % (W + 200));
        const y = y0 + Math.sin(frame / 10 + i) * 10;
        return <line key={i} x1={x} y1={y} x2={x + len} y2={y - len * 0.12} stroke="#f4f8fa" strokeWidth={1.5 + r() * 2} opacity={0.4 + r() * 0.5} />;
      })}
    </g>
  );
};

/** flat sea ice with pressure lines */
export const IceField: React.FC<{t: T; y?: number; seed?: number}> = ({t, y = 720, seed = 1}) => {
  const r = rng(seed + 300);
  const [a, b] = SNOW[t];
  return (
    <g>
      <rect x={-200} y={y} width={W + 400} height={H - y + 200} fill={a} />
      <rect x={-200} y={y} width={W + 400} height={40} fill={b} opacity={0.5} />
      {Array.from({length: 18}, (_, i) => {
        const yy = y + 20 + Math.pow(r(), 1.6) * (H - y), x = r() * W, w = 100 + r() * 500;
        return <path key={i} d={`M ${x} ${yy} q ${w / 2} ${-6 - r() * 10} ${w} 0`} stroke={b} strokeWidth={2 + (yy - y) / 60} fill="none" opacity={0.6} />;
      })}
    </g>
  );
};

/** generic high-wing bush plane, side view, red & white */
export const Plane: React.FC<{broken?: boolean; s?: number}> = ({broken, s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -300 0 C -300 -40 -260 -70 -200 -74 L 220 -80 C 270 -80 300 -60 310 -30 L 300 10 C 200 20 -200 24 -280 18 Z" fill="#e8e6e0" />
    <path d="M -290 -10 L 300 -18 L 300 4 L -284 10 Z" fill="#c0392b" />
    <path d="M 210 -78 L 300 -170 L 340 -170 L 300 -60 Z" fill="#e8e6e0" /><path d="M 300 -170 L 340 -170 L 330 -140 L 300 -140 Z" fill="#c0392b" />
    {[-160, -80, 0, 80].map((x) => <rect key={x} x={x} y={-60} width={50} height={34} rx={8} fill="#5a7a8a" />)}
    <path d="M -200 -74 C -240 -70 -270 -50 -280 -30 L -230 -30 Z" fill="#7aa0b0" />
    {!broken && <rect x={-200} y={-96} width={420} height={18} rx={6} fill="#d8d6d0" />}
    {broken && <><rect x={-200} y={-96} width={200} height={18} rx={6} fill="#d8d6d0" /><path d="M 0 -96 L 20 -88 L 6 -82 L 24 -78 L 0 -78 Z" fill="#6a6a64" /></>}
    <rect x={-330} y={-40} width={30} height={40} rx={8} fill="#3a3f40" />
    <rect x={-336} y={-80} width={8} height={120} fill="#2a2f31" opacity={broken ? 0.9 : 0.4} transform={broken ? 'rotate(30 -332 -20)' : ''} />
    <line x1={-120} y1={20} x2={-150} y2={70} stroke="#3a3f40" strokeWidth={8} /><line x1={-60} y1={20} x2={-30} y2={70} stroke="#3a3f40" strokeWidth={8} />
    <rect x={-200} y={66} width={220} height={12} rx={6} fill="#5a5f60" />
  </g>
);

/* ---------------------------------------------------------- plane in the sky */
export const PlaneSky: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time === 'storm' ? 'storm' : 'day';
  const frame = useCurrentFrame();
  const [sx, sy] = useShake(p.shake ?? (t === 'storm' ? 0.3 : 0));
  const seed = p.seed ?? 1;
  const r = rng(seed + 9);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={1.0} to={1.06}>
          <Svg>
            <Sky id="ps" stops={t === 'storm' ? [[0, '#5a6870'], [1, '#a8b4b8']] : ASKY.day} />
            {t === 'day' && <><Glow id="psg" cx={1600} cy={260} r={800} color="#fff6e0" opacity={0.5} /><circle cx={1600} cy={260} r={50} fill="#fffaf0" /></>}
            {/* ground far below */}
            {(p.ice || t === 'day') && <g opacity={t === 'storm' ? 0.2 : 1}>
              <rect x={0} y={760} width={W} height={320} fill="#dce8ec" />
              {Array.from({length: 40}, (_, i) => { const x = ((r() * W * 1.5) - frame * 2) % (W + 300); const y = 770 + r() * 300; return <polygon key={i} points={`${x},${y} ${x + 60 + r() * 120},${y + 6} ${x + 40},${y + 30 + r() * 30} ${x - 30},${y + 20}`} fill="#b8ccd4" opacity={0.7} />; })}
              {p.ice && Array.from({length: 14}, (_, i) => <path key={`c${i}`} d={`M ${(i * 170 - frame * 2) % (W + 200)} 760 l ${-40 + r() * 80} 320`} stroke="#3a5a6a" strokeWidth={3} opacity={0.6} />)}
            </g>}
            {/* clouds */}
            {Array.from({length: 7}, (_, i) => { const x = (W + 400) - ((i * 380 + frame * (t === 'storm' ? 14 : 4)) % (W + 800)); return <ellipse key={i} cx={x} cy={300 + (i % 3) * 140} rx={260} ry={60} fill={t === 'storm' ? '#7a868c' : '#ffffff'} opacity={t === 'storm' ? 0.7 : 0.6} />; })}
            <g transform={`translate(${900} ${460 + Math.sin(frame / 20) * 10}) rotate(${t === 'storm' ? Math.sin(frame / 6) * 4 : 0})`}><Plane s={1.1} /></g>
            {t === 'storm' && <Blizzard amt={1} seed={seed} />}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- inside the plane */
export const PlaneInterior: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const shake = p.shake ?? 0;
  const [sx, sy] = useShake(shake);
  const storm = shake > 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px) rotate(${storm ? Math.sin(frame / 5) * 2 : 0}deg)`}}>
        <Camera dur={dur} from={1.0} to={1.05}>
          <Svg>
            <rect width={W} height={H} fill="#2a3033" />
            <path d="M 0 0 L 600 300 L 1320 300 L 1920 0 Z" fill="#3a4246" />
            <path d="M 0 1080 L 600 760 L 1320 760 L 1920 1080 Z" fill="#1f2426" />
            {/* cockpit windows */}
            <rect x={600} y={300} width={720} height={460} fill="#14181a" />
            <path d="M 640 340 L 940 340 L 940 560 L 620 600 Z" fill={storm ? '#b8c4c8' : '#a9c3cc'} />
            <path d="M 980 340 L 1280 340 L 1300 600 L 980 560 Z" fill={storm ? '#b8c4c8' : '#a9c3cc'} />
            {storm && <g opacity={0.8}>{Array.from({length: 60}, (_, i) => { const r = rng(i + Math.floor(frame / 2)); return <circle key={i} cx={640 + r() * 660} cy={340 + r() * 260} r={2 + r() * 4} fill="#fff" />; })}</g>}
            <rect x={640} y={600} width={640} height={160} fill="#1a1e20" />
            {Array.from({length: 8}, (_, i) => <circle key={i} cx={700 + i * 76} cy={660} r={22} fill="#0f1214" stroke="#4a5458" strokeWidth={4} />)}
            {storm && Array.from({length: 8}, (_, i) => <circle key={`l${i}`} cx={700 + i * 76} cy={710} r={6} fill={(frame + i * 5) % 14 < 7 ? '#ff4a3a' : '#3a1a16'} />)}
            {/* pilot seat silhouette (Ingrid) */}
            <path d="M 760 760 L 760 560 C 760 520 880 520 880 560 L 880 760 Z" fill="#14181a" />
            <circle cx={820} cy={530} r={42} fill="#2a2420" /><path d="M 780 520 C 780 480 860 480 860 520 Z" fill="#8a2a22" />
            {/* cargo boxes */}
            {[[120, 760], [260, 800], [1560, 780], [1700, 820]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={150} height={120} fill="#6a5a3a" /><rect x={x} y={y + 50} width={150} height={10} fill="#4a3a2a" /></g>)}
            <rect x={1500} y={640} width={110} height={150} rx={20} fill="#8a4a30" />
            {/* side window with Noah */}
            <rect x={220} y={380} width={180} height={140} rx={50} fill={storm ? '#b8c4c8' : '#dce8ec'} />
            {p.noah && <g transform="translate(360 880) scale(1.1)"><NoahSitting outfit="parka" phone={!storm} head={storm ? 0.9 : 0.2} /></g>}
            {storm && <rect width={W} height={H} fill="#ff4a3a" opacity={(frame % 20 < 10 ? 0.06 : 0)} />}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Ingrid portrait */
const IngridFace: React.FC<{talk: number; blink: number; worried?: boolean; hurt?: boolean; smile?: boolean}> = ({talk, blink, worried, hurt, smile}) => (
  <g>
    {/* parka with fur hood ring */}
    <ellipse cx={0} cy={-20} rx={210} ry={240} fill="#d8d0c0" />
    {Array.from({length: 26}, (_, i) => { const a = (i / 26) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 200} cy={-20 + Math.sin(a) * 228} rx={26} ry={18} fill="#c9bfa8" transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 200} ${-20 + Math.sin(a) * 228})`} />; })}
    <ellipse cx={0} cy={-20} rx={170} ry={198} fill="#3a2a22" />
    <path d="M -260 360 C -250 220 -140 170 0 170 C 140 170 250 220 260 360 Z" fill="#b8352a" />
    <path d="M -30 170 L -30 360 M 30 170 L 30 360" stroke="#8a2a20" strokeWidth={6} />
    {/* face */}
    <path d="M -36 150 L -36 100 L 36 100 L 36 150 Z" fill="#c08a70" />
    <ellipse cx={0} cy={-10} rx={112} ry={132} fill="#d4a088" />
    {/* grey-blond hair under beanie + braid */}
    <path d="M -116 -30 C -120 -120 -60 -150 0 -150 C 60 -150 120 -120 116 -30 C 100 -80 60 -100 0 -100 C -60 -100 -100 -80 -116 -30 Z" fill="#c9bfa0" />
    <path d="M 126 30 C 168 90 176 170 150 236" stroke="#c9bfa0" strokeWidth={30} fill="none" strokeLinecap="round" />
    {[70, 120, 170, 210].map((y, i) => <line key={i} x1={146 + (i % 2) * 6} y1={y} x2={172 - (i % 2) * 6} y2={y + 14} stroke="#a89f80" strokeWidth={4} />)}
    <path d="M -124 -60 C -124 -170 124 -170 124 -60 C 90 -90 -90 -90 -124 -60 Z" fill="#1f3a5a" />
    <rect x={-128} y={-74} width={256} height={30} rx={14} fill="#16304a" />
    {/* brows */}
    <path d={worried || hurt ? 'M -80 -40 C -60 -54 -36 -50 -22 -38 M 22 -38 C 36 -50 60 -54 80 -40' : 'M -80 -44 C -60 -52 -36 -52 -22 -46 M 22 -46 C 36 -52 60 -52 80 -44'} stroke="#8a7a60" strokeWidth={7} fill="none" strokeLinecap="round" />
    {/* eyes */}
    <g transform={`translate(0 -14) scale(1 ${Math.max(0.1, 1 - blink)})`}>
      <ellipse cx={-50} cy={0} rx={14} ry={smile ? 6 : 9} fill="#f1ece4" /><circle cx={-48} cy={0} r={6.5} fill="#4a6a7a" />
      <ellipse cx={50} cy={0} rx={14} ry={smile ? 6 : 9} fill="#f1ece4" /><circle cx={52} cy={0} r={6.5} fill="#4a6a7a" />
    </g>
    {/* weathered lines */}
    <path d="M -84 -4 l -16 -6 M -84 6 l -16 2 M 84 -4 l 16 -6 M 84 6 l 16 2" stroke="#a87458" strokeWidth={3} />
    <path d="M -40 60 C -30 74 -20 80 -10 82 M 40 60 C 30 74 20 80 10 82" stroke="#b07a60" strokeWidth={3} fill="none" opacity={0.6} />
    <path d="M -6 0 L -14 40 L 6 42" stroke="#a87458" strokeWidth={4} fill="none" />
    {talk > 0.05 ? <ellipse cx={0} cy={70} rx={22} ry={3 + talk * 12} fill="#5a2a24" />
      : smile ? <path d="M -30 64 C -10 82 10 82 30 64" stroke="#8a4a3a" strokeWidth={6} fill="none" strokeLinecap="round" />
        : <path d={hurt ? 'M -24 74 C -8 66 8 66 24 74' : 'M -24 70 C -8 74 8 74 24 70'} stroke="#8a4a3a" strokeWidth={5} fill="none" strokeLinecap="round" />}
    {/* rosy cold cheeks */}
    <ellipse cx={-62} cy={30} rx={22} ry={12} fill="#d06a5a" opacity={0.35} /><ellipse cx={62} cy={30} rx={22} ry={12} fill="#d06a5a" opacity={0.35} />
  </g>
);

export const Ingrid: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? 'cabin';
  const seed = p.seed ?? 1;
  const [sx, sy] = useShake(p.shake ?? 0);
  const blink = interpolate((frame + seed * 31) % 130, [90, 94, 98], [0, 1, 0], clamp);
  const cam = camFor(seed + 200, 0.5);
  const flick = 0.85 + 0.15 * Math.sin(frame / 3) * Math.sin(frame / 7);
  const BG: Record<string, React.ReactNode> = {
    cockpit: <><rect width={W} height={H} fill="#2a3033" /><path d="M 1100 120 L 1900 120 L 1900 700 L 1060 760 Z" fill={p.worried ? '#9aa8ae' : '#a9c3cc'} /><rect x={1060} y={760} width={860} height={320} fill="#1a1e20" />
      {Array.from({length: 5}, (_, i) => <circle key={i} cx={1160 + i * 140} cy={880} r={36} fill="#0f1214" stroke="#4a5458" strokeWidth={5} />)}</>,
    cabin: <><rect width={W} height={H} fill="#1a1410" /><Glow id="igs" cx={1400} cy={900} r={900} color="#f29a4a" opacity={0.5 * flick} /><rect x={1200} y={100} width={600} height={30} fill="#2a2420" /></>,
    aurora: <><Sky id="iga" stops={ASKY.night} /><Stars count={200} /><AuroraBands seed={seed + 1} /></>,
    ice: <><Sky id="igi" stops={ASKY.night} /><Stars count={160} /><rect x={0} y={760} width={W} height={320} fill="#2a3a4a" /><Glow id="igf" cx={1500} cy={820} r={700} color="#ff4a3a" opacity={0.55 * flick} /></>,
  };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
          <Svg>
            {BG[mode] ?? BG.cabin}
            <g transform={`translate(${mode === 'cockpit' ? 760 : 800} ${640 + Math.sin(frame / 26) * 3}) scale(1.35)`}>
              <IngridFace talk={mouth(frame, talk, 'INGRID')} blink={blink} worried={p.worried} hurt={p.hurt} smile={p.smile && !(talk && frame >= talk.from && frame <= talk.to)} />
            </g>
            {mode === 'cabin' && <path d="M 0 0 L 600 0 L 400 1080 L 0 1080 Z" fill="#000" opacity={0.35} />}
            {mode === 'ice' && p.flareLit && <g transform="translate(1500 820)"><rect x={-6} y={-60} width={12} height={60} fill="#3a3a3a" /><circle cx={0} cy={-70} r={14 * flick} fill="#ffb0a0" /><Glow id="igfl" cx={0} cy={-70} r={200} color="#ff4a3a" opacity={0.8} /></g>}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- aurora bands */
export const AuroraBands: React.FC<{seed?: number; amp?: number}> = ({seed = 1, amp = 1}) => {
  const frame = useCurrentFrame();
  return (
    <g style={{mixBlendMode: 'screen'}}>
      <defs>
        <linearGradient id={`au${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4aa0" stopOpacity={0} />
          <stop offset="0.35" stopColor="#5af0a0" stopOpacity={0.55} />
          <stop offset="1" stopColor="#3ad08a" stopOpacity={0} />
        </linearGradient>
        <filter id={`aub${seed}`}><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      {[0, 1, 2].map((k) => {
        const pts: string[] = [];
        const top: string[] = [];
        for (let x = -200; x <= W + 200; x += 60) {
          const y = 260 + k * 70 + Math.sin(x / 240 + frame / (40 + k * 12) + seed + k) * 70 * amp + Math.sin(x / 90 + frame / 25) * 18;
          top.push(`${x},${y - 200 - k * 30}`);
          pts.push(`${x},${y}`);
        }
        return <polygon key={k} points={`${top.join(' ')} ${pts.reverse().join(' ')}`} fill={`url(#au${seed})`} filter={`url(#aub${seed})`} opacity={0.8 - k * 0.15} />;
      })}
    </g>
  );
};

/* ---------------------------------------------------------- crash landing */
export const Crash: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pr = frame / dur;
  const x = lerp(-200, 1100, Math.min(1, pr * 1.3));
  const y = lerp(500, 760, Math.min(1, pr * 1.6));
  const impact = pr > 0.72;
  const [sx, sy] = useShake(pr > 0.4 ? 1 : 0.3);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Svg>
          <Sky id="cr" stops={[[0, '#6a787e'], [1, '#c8d0d2']]} />
          <IceField t="storm" y={760} />
          <g transform={`translate(${x} ${y}) rotate(${impact ? -14 : Math.sin(frame / 3) * 5})`}><Plane s={0.9} broken={impact} /></g>
          {pr > 0.5 && Array.from({length: 40}, (_, i) => { const r = rng(i); return <circle key={i} cx={x - r() * 400} cy={y + 40 - r() * 120} r={10 + r() * 40} fill="#f4f8fa" opacity={0.6} />; })}
          <Blizzard amt={1.2} />
          {impact && <rect width={W} height={H} fill="#ffffff" opacity={interpolate(frame, [dur * 0.72, dur * 0.76, dur], [0, 0.95, 1], clamp)} />}
        </Svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the wreck on the ice */
export const Wreck: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'storm';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 210, 0.7);
  if (p.inside) {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Svg>
          <g transform="rotate(-18 960 540)">
            <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#1a1e20" />
            <rect x={300} y={300} width={500} height={260} rx={60} fill="#d8e0e2" opacity={0.85} />
            <rect x={1000} y={300} width={500} height={260} rx={60} fill="#d8e0e2" opacity={0.6} />
            {Array.from({length: 8}, (_, i) => <rect key={i} x={200 + i * 180} y={700} width={140} height={110} fill="#4a3a2a" transform={`rotate(${i * 13} ${270 + i * 180} 755)`} />)}
          </g>
          <rect width={W} height={H} fill="#000" opacity={interpolate(frame, [0, 40], [1, 0.25], clamp)} />
          <Blizzard amt={0.25} />
        </Svg>
      </AbsoluteFill>
    );
  }
  const far = !!p.far;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={far ? 1.0 : cam.from} to={far ? 0.9 : cam.to} x={far ? [0, 0] : cam.x}>
        <Svg>
          <Sky id="wk" stops={ASKY[t]} />
          {t === 'night' && <Stars />}
          {t === 'twilight' && <Glow id="wkg" cx={1500} cy={700} r={800} color="#f0b080" opacity={0.4} />}
          <IceField t={t} y={700} seed={seed} />
          <path d="M 300 780 L 900 800" stroke={SNOW[t][1]} strokeWidth={8} opacity={0.6} />
          <g transform={`translate(${far ? 1100 : 960} ${far ? 760 : 820}) rotate(-11) scale(${far ? 0.22 : 1})`}>
            <Plane broken s={1.1} />
            <g transform="translate(-420 60) rotate(30)"><rect x={-200} y={-12} width={220} height={18} rx={6} fill="#d8d6d0" /></g>
            {p.light && <Glow id="wkl" cx={-60} cy={-40} r={200} color="#f29a4a" opacity={0.5} />}
            <path d="M -380 90 C -300 20 -120 40 0 60 C 140 40 260 30 340 90 Z" fill={SNOW[t][0]} />
            <path d="M -360 90 C -300 50 -200 50 -120 70" stroke={SNOW[t][1]} strokeWidth={6} fill="none" />
          </g>
          {t === 'storm' && <Blizzard amt={0.9} seed={seed} />}
          {far && <g transform="translate(700 1010) scale(0.6)"><NoahStandBack outfit="parka" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- thermometer */
export const Thermo: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const temp = p.temp ?? -40;
  const shown = Math.round(interpolate(frame, [0, Math.min(40, dur)], [-5, temp], clamp));
  const level = (shown + 50) / 90;
  return (
    <AbsoluteFill style={{background: '#0a1218'}}>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <rect width={W} height={H} fill="#0e1a22" />
          {Array.from({length: 30}, (_, i) => { const r = rng(i + 50); const x = r() * W, y = r() * H, s = 30 + r() * 80; return <g key={i} opacity={0.12} transform={`translate(${x} ${y}) rotate(${frame * 0.2 + i * 20})`}>{[0, 60, 120].map((a) => <line key={a} x1={-s} y1={0} x2={s} y2={0} stroke="#cfe6f2" strokeWidth={3} transform={`rotate(${a})`} />)}</g>; })}
          <g transform="translate(700 540)">
            <rect x={-40} y={-380} width={80} height={640} rx={40} fill="#1a2a34" stroke="#5a7a8a" strokeWidth={6} />
            <circle cx={0} cy={300} r={80} fill="#5ab0e0" />
            <rect x={-22} y={260 - 600 * level} width={44} height={600 * level + 40} rx={20} fill="#5ab0e0" />
            {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40].map((v) => { const y = 260 - ((v + 50) / 90) * 600; return <g key={v}><line x1={50} y1={y} x2={80} y2={y} stroke="#9ab8c8" strokeWidth={3} /><text x={92} y={y + 9} fill="#9ab8c8" fontFamily="DejaVu Sans Mono" fontSize={24}>{v}</text></g>; })}
          </g>
          <text x={1150} y={560} fill="#cfe6f2" fontFamily="Inter Display" fontWeight={900} fontSize={200}>{shown}°C</text>
          {p.wind && <text x={1160} y={660} fill="#78969A" fontFamily="DejaVu Sans Mono" fontSize={40}>WIND CHILL · 60 km/h</text>}
          {p.body && <text x={1160} y={660} fill="#78969A" fontFamily="DejaVu Sans Mono" fontSize={36}>BODY CORE: 37° → 35° → 33°</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- cabin at night */
export const CabinNight: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const fl = 0.8 + 0.2 * Math.sin(frame / 3) * Math.sin(frame / 7 + 1);
  const stove = p.stove !== false;
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 220, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.close ? 1.3 : cam.from} to={p.close ? 1.4 : cam.to} x={p.close ? [0, 0] : cam.x} origin={p.close ? '52% 72%' : '50% 50%'}>
        <Svg>
          <rect width={W} height={H} fill="#0c0e10" />
          <path d="M 0 120 C 600 40 1320 40 1920 120 L 1920 960 L 0 960 Z" fill="#1c2023" />
          {[300, 700, 1100, 1500].map((x) => <rect key={x} x={x} y={200} width={160} height={110} rx={40} fill="#0a1218" />)}
          <rect x={300} y={200} width={160} height={110} rx={40} fill="#6a5a3a" opacity={0.8} />
          <rect x={0} y={900} width={W} height={180} fill="#14181a" />
          {stove && <><Glow id="cns" cx={1000} cy={860} r={900 * fl} color="#f29a4a" opacity={0.55} />
            <g transform="translate(1000 880)"><rect x={-50} y={-10} width={100} height={30} fill="#3a3f40" /><ellipse cx={0} cy={-14} rx={36} ry={10} fill="#5ab0ff" opacity={0.9 * fl} />
              {p.pot && <><rect x={-46} y={-80} width={92} height={60} rx={8} fill="#7d8a8a" />{[0, 1, 2].map((i) => { const k = ((frame / 30 + i / 3) % 1); return <ellipse key={i} cx={-10 + i * 12} cy={-100 - k * 120} rx={14 + k * 20} ry={10} fill="#e8eef0" opacity={(1 - k) * 0.4} />; })}</>}
            </g></>}
          {!stove && <Glow id="cnm" cx={380} cy={250} r={500} color="#9fc0d0" opacity={0.15} />}
          {/* Ingrid lying in a sleeping bag */}
          <g transform="translate(560 860)">
            <path d="M -320 40 C -330 -40 -260 -70 -160 -70 L 220 -60 C 280 -56 300 -10 290 40 Z" fill="#b8352a" />
            <ellipse cx={-280} cy={-50} rx={60} ry={52} fill="#d4a088" />
            <path d="M -330 -40 C -340 -110 -230 -120 -220 -60 Z" fill="#1f3a5a" />
            <path d="M -110 -20 L 200 -20" stroke="#8a2a20" strokeWidth={6} />
          </g>
          <g transform="translate(1320 900) scale(1.1)"><g transform="scale(-1 1)"><NoahSitting outfit="parka" phone={false} head={0.4} breath={(Math.sin(frame / 24) + 1) / 2} /></g></g>
          {!stove && <rect width={W} height={H} fill="#000" opacity={0.55} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- building the snow wall */
export const SnowWall: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const blocks = Math.floor(interpolate(frame, [0, dur], [3, 14], clamp));
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="sw" stops={ASKY.twilight} />
          <IceField t="twilight" y={700} />
          <g transform="translate(1300 760) rotate(-6) scale(0.8)"><Plane broken /></g>
          {Array.from({length: blocks}, (_, i) => <rect key={i} x={360 + (i % 7) * 104} y={860 - Math.floor(i / 7) * 62} width={98} height={58} rx={6} fill="#e0e4ec" stroke="#a8b0c4" strokeWidth={3} />)}
          <g transform={`translate(${380 + (blocks % 7) * 104} 920) scale(0.85)`}><NoahWalk phase={Math.sin(frame / 10) * 0.5} outfit="parka" rim="#f0c090" /></g>
          <Blizzard amt={0.25} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- ice vista */
export const IceVista: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'twilight';
  const pr = useProgress(dur);
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 230, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="iv" stops={ASKY[t]} />
          {t === 'night' && <><Stars count={400} /><circle cx={1500} cy={260} r={40} fill="#e8eef0" /><Glow id="ivm" cx={1500} cy={260} r={300} color="#cfe6f2" opacity={0.25} /></>}
          {t === 'twilight' && <><Glow id="ivs" cx={lerp(700, 1300, pr)} cy={700} r={900} color="#f0b080" opacity={0.5} />
            {p.sunLow && <ellipse cx={lerp(700, 1300, pr)} cy={706} rx={70} ry={50} fill="#ffd0a0" />}</>}
          <IceField t={t} y={710} seed={seed} />
          {Array.from({length: 6}, (_, i) => { const r = rng(i + seed * 7); const x = r() * W, w = 120 + r() * 260; return <polygon key={i} points={`${x},716 ${x + w * 0.3},${690 - r() * 30} ${x + w * 0.6},${700} ${x + w},716`} fill={SNOW[t][1]} />; })}
          {t !== 'night' && <Fog id="ivf" y={640} h={160} opacity={0.3} color="#f0d8c8" />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- aurora */
export const Aurora: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.wide ? 1.0 : 1.04} to={p.wide ? 1.08 : 1.0} y={p.wide ? [0, 40] : [0, 0]}>
        <Svg>
          <Sky id="ar" stops={ASKY.night} />
          <Stars count={420} seed={seed + 3} />
          <AuroraBands seed={seed} amp={1.2} />
          <IceField t="night" y={780} seed={seed} />
          <rect x={0} y={780} width={W} height={300} fill="#3ad08a" opacity={0.06 + 0.03 * Math.sin(frame / 20)} />
          {p.walker ? <g transform={`translate(${lerp(400, 1400, frame / dur)} 960) scale(0.45)`}><NoahWalk phase={frame / 7} outfit="parka" rim="#5af0a0" /></g>
            : <g transform="translate(1300 860) rotate(-6) scale(0.55)"><Plane broken /></g>}
          {p.noah && <g transform="translate(900 960) scale(0.5)"><NoahStandBack outfit="parka" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- ice cracking */
export const IceCrack: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'twilight';
  const frame = useCurrentFrame();
  const open = p.calm ? 0.05 : interpolate(frame, [0, dur], [Math.max(0, (p.open ?? 0.2) - 0.25), p.open ?? 0.2], clamp);
  const seed = p.seed ?? 1;
  const r = rng(seed + 400);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 16; i++) pts.push([i * 130 - 100, 780 + (r() - 0.5) * 80 + i * 8]);
  const w = 4 + open * 160;
  const top = pts.map(([x, y]) => `${x},${y - w / 2}`).join(' ');
  const bot = pts.slice().reverse().map(([x, y]) => `${x},${y + w / 2}`).join(' ');
  const [sx, sy] = useShake(frame < 15 && !p.calm ? 0.6 : 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={1.0} to={1.08}>
          <Svg>
            <Sky id="ic" stops={ASKY[t]} />
            {t === 'night' && <Stars />}
            <IceField t={t} y={640} seed={seed} />
            <polygon points={`${top} ${bot}`} fill="#06121a" />
            {open > 0.1 && Array.from({length: 10}, (_, i) => { const k = ((frame / 50 + i / 10) % 1); const [x, y] = pts[1 + (i * 3) % 14]; return <ellipse key={i} cx={x} cy={y - k * 140} rx={60 + k * 60} ry={20} fill="#e8eef0" opacity={(1 - k) * 0.25} />; })}
            {pts.slice(1, -1).map(([x, y], i) => <path key={i} d={`M ${x} ${y} l ${(r() - 0.5) * 120} ${-30 - r() * 60}`} stroke="#5a6a7a" strokeWidth={3} opacity={0.6} />)}
            {t === 'storm' && <Blizzard amt={0.8} />}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- chart */
export const IceMap: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const draw = p.route ? interpolate(frame, [10, dur - 20], [0, 1], clamp) : 0;
  const drift = p.drift ? interpolate(frame, [0, dur], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="45% 50%">
        <Svg>
          <rect width={W} height={H} fill="#151a1d" />
          <rect x={200} y={90} width={1520} height={900} fill="#dcd6c0" />
          <path d="M 200 90 L 900 90 C 880 200 760 260 700 360 C 640 460 520 480 440 600 C 380 700 280 720 200 760 Z" fill="#c9bf9a" />
          <text x={330} y={230} fill="#6a5a3a" fontFamily="Liberation Serif" fontStyle="italic" fontSize={34}>coast</text>
          {Array.from({length: 12}, (_, i) => <path key={i} d={`M ${900 + i * 60} 90 C ${880 + i * 60} 400 ${960 + i * 60} 700 ${900 + i * 60} 990`} stroke="#b8c8d0" strokeWidth={2} fill="none" />)}
          <text x={1300} y={500} fill="#5a7a8a" fontFamily="Liberation Serif" fontStyle="italic" fontSize={40}>ARCTIC OCEAN — SEA ICE</text>
          {/* station */}
          <rect x={612} y={322} width={22} height={22} fill="#c0392b" />
          {(p.station || p.route) && <text x={650} y={340} fill="#3a2a18" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={26}>KAPP VARDE (wx stn)</text>}
          {/* plane position */}
          <g transform={`translate(${1100 + drift * 260} ${720 + drift * 40})`}><path d="M -18 0 L 18 0 M 0 -14 L 0 14" stroke="#c0392b" strokeWidth={6} /><circle r={26} fill="none" stroke="#c0392b" strokeWidth={3} /></g>
          {p.drift && <path d="M 1100 720 L 1360 760" stroke="#c0392b" strokeWidth={4} strokeDasharray="12 10" markerEnd="" />}
          {p.drift && <text x={1250} y={820} fill="#c0392b" fontFamily="DejaVu Sans Mono" fontSize={24}>drift → E</text>}
          {p.route && <><path d="M 1100 720 C 1000 600 820 460 625 335" stroke="#1f3a5a" strokeWidth={7} fill="none" strokeDasharray="1000" strokeDashoffset={1000 * (1 - draw)} />
            {draw > 0.7 && <text x={860} y={500} fill="#1f3a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={32}>31 km</text>}
            {draw > 0.85 && <text x={860} y={545} fill="#c0392b" fontFamily="Liberation Serif" fontStyle="italic" fontSize={28}>(not 15)</text>}</>}
          {!p.route && !p.station && <text x={860} y={560} fill="#1f3a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={32} opacity={interpolate(frame, [20, 40], [0, 1], clamp)}>30 km</text>}
          <g transform="translate(1580 220)"><circle r={70} fill="none" stroke="#3a2a18" strokeWidth={3} /><path d="M 0 -60 L 12 0 L 0 60 L -12 0 Z" fill="#3a2a18" /><text x={0} y={-80} textAnchor="middle" fill="#3a2a18" fontFamily="Liberation Serif" fontSize={30}>N</text></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- polar bear */
const BearShape: React.FC<{phase: number}> = ({phase}) => {
  const s = Math.sin(phase);
  const leg = (x: number, k: number) => <path d={`M ${x} 10 L ${x + s * k * 18} 110`} stroke="#d8d0b8" strokeWidth={34} strokeLinecap="round" />;
  return (
    <g>
      {leg(-120, 1)}{leg(90, -1)}
      <path d="M -220 20 C -230 -60 -150 -110 -40 -120 C 60 -126 150 -100 190 -60 C 230 -30 240 10 220 40 C 140 70 -140 70 -220 20 Z" fill="#ece6d2" />
      <path d="M 180 -60 C 220 -70 280 -40 310 -10 C 320 0 312 18 296 20 C 260 24 220 10 190 -10 Z" fill="#ece6d2" />
      <circle cx={300} cy={6} r={7} fill="#1a1a1a" /><circle cx={272} cy={-14} r={4} fill="#1a1a1a" />
      <ellipse cx={226} cy={-60} rx={12} ry={10} fill="#d8d0b8" />
      {leg(-90, -1)}{leg(120, 1)}
      <path d="M -40 -120 C 60 -126 150 -100 190 -60" stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.7} />
    </g>
  );
};

export const Bear: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const dist = p.dist ?? 'far';
  if (dist === 'close') {
    const breathe = Math.sin(frame / 14);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Camera dur={dur} from={1.0} to={1.1}>
          <Svg>
            <rect width={W} height={H} fill="#14181a" />
            <rect x={460} y={200} width={1000} height={620} rx={180} fill="#3a4a6a" />
            <g transform={`translate(${960 + Math.sin(frame / 20) * 30} 600)`}>
              <ellipse cx={0} cy={0} rx={300} ry={240} fill="#ece6d2" />
              <ellipse cx={0} cy={110} rx={150} ry={110} fill="#f4eee0" />
              <ellipse cx={0} cy={80} rx={46} ry={34} fill="#1a1a1a" />
              <circle cx={-110} cy={-50} r={16} fill="#1a1a1a" /><circle cx={110} cy={-50} r={16} fill="#1a1a1a" />
              <circle cx={-200} cy={-200} r={50} fill="#d8d0b8" /><circle cx={200} cy={-200} r={50} fill="#d8d0b8" />
              <ellipse cx={0} cy={150} rx={140} ry={30} fill="#d8e8f0" opacity={0.3 + breathe * 0.2} />
            </g>
            {/* window frame + condensation */}
            <path d={`M 0 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z M 460 380 C 460 280 540 200 640 200 L 1280 200 C 1380 200 1460 280 1460 380 L 1460 640 C 1460 740 1380 820 1280 820 L 640 820 C 540 820 460 740 460 640 Z`} fill="#1c2023" fillRule="evenodd" />
            <ellipse cx={960} cy={760} rx={300} ry={60} fill="#ffffff" opacity={0.08 + breathe * 0.04} />
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  const scale = dist === 'far' ? 0.25 : dist === 'mid' ? 0.55 : 0.5;
  const x = dist === 'leaving' ? lerp(900, 1900, frame / dur) : dist === 'far' ? lerp(300, 700, frame / dur) : lerp(500, 900, frame / dur);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="br" stops={ASKY.twilight} />
          <Glow id="brg" cx={1500} cy={700} r={800} color="#f0b080" opacity={0.35} />
          <IceField t="twilight" y={700} seed={7} />
          {dist !== 'far' && dist !== 'leaving' && <g transform="translate(1500 800) rotate(-6) scale(0.7)"><Plane broken /></g>}
          <g transform={`translate(${x} ${dist === 'far' ? 740 : 860}) scale(${dist === 'leaving' ? scale : scale})`}><BearShape phase={frame / 9} /></g>
          {dist === 'far' && <rect width={W} height={H} fill="none" />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Flare: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const t = frame / dur;
  const burst = interpolate(frame, [8, 14], [0, 1], clamp);
  const fl = 0.8 + 0.2 * Math.sin(frame / 2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <Sky id="fl" stops={ASKY.twilight} />
        <IceField t="twilight" y={700} seed={7} />
        <rect width={W} height={H} fill="#ff2a1a" opacity={burst * 0.25 * fl} />
        <Glow id="flg" cx={900} cy={860} r={900 * burst} color="#ff4a3a" opacity={0.75 * burst * fl} />
        <circle cx={900} cy={860} r={20 * burst} fill="#ffe0d0" />
        {Array.from({length: 12}, (_, i) => { const k = ((frame / 40 + i / 12) % 1); return <ellipse key={i} cx={900 + (i - 6) * 20 * k} cy={850 - k * 300} rx={40 + k * 80} ry={30 + k * 40} fill="#c9a0a0" opacity={(1 - k) * 0.35 * burst} />; })}
        <line x1={300} y1={980} x2={lerp(300, 900, Math.min(1, frame / 8))} y2={lerp(980, 860, Math.min(1, frame / 8))} stroke="#ffb0a0" strokeWidth={4} opacity={frame < 10 ? 1 : 0} />
        <g transform={`translate(${lerp(1400, 1550, t)} 840) scale(-0.5 0.5)`}><BearShape phase={frame / 6} /></g>
      </Svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- walking across the ice */
export const IceWalk: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'twilight';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const speed = p.slow ? 0.6 : 1;
  const scroll = frame * 1.6 * speed;
  const r = rng(seed + 500);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.04} to={1.08}>
        <Svg>
          <Sky id="iw" stops={ASKY[t]} />
          {t === 'twilight' && <Glow id="iwg" cx={1500} cy={690} r={800} color="#f0b080" opacity={0.45} />}
          <IceField t={t} y={700} seed={seed} />
          <g transform={`translate(${-(scroll * 0.3) % 600} 0)`}>
            {Array.from({length: 10}, (_, i) => { const x = i * 300, h = 30 + r() * 70; return <polygon key={i} points={`${x},720 ${x + 60},${720 - h} ${x + 140},${720 - h * 0.6} ${x + 220},720`} fill={SNOW[t][1]} />; })}
          </g>
          <g transform={`translate(${-(scroll * 1.2) % 500} 0)`}>
            {Array.from({length: 8}, (_, i) => <polygon key={i} points={`${i * 500},1000 ${i * 500 + 120},${930 - (i % 3) * 20} ${i * 500 + 260},1000`} fill={SNOW[t][1]} opacity={0.8} />)}
          </g>
          <g transform={`translate(${p.start ? lerp(1100, 900, Math.min(1, frame / dur)) : 900} 930) scale(0.7)`}>
            <NoahWalk phase={(frame / 6) * speed} outfit="parka" rim={t === 'storm' ? '#ffffff' : '#f0c090'} />
          </g>
          {p.fox && <g transform={`translate(1380 ${900 + Math.abs(Math.sin(frame / 4)) * -6}) scale(0.9)`}>
            <ellipse cx={0} cy={0} rx={46} ry={22} fill="#f4f6f8" />
            <path d="M -40 -4 C -80 -20 -110 -10 -120 10 C -100 4 -70 8 -44 10 Z" fill="#f4f6f8" />
            <path d="M 36 -10 C 54 -30 74 -30 84 -16 L 70 -2 Z" fill="#f4f6f8" /><path d="M 52 -30 L 58 -46 L 64 -28 Z" fill="#e8ecef" />
            <circle cx={76} cy={-18} r={3} fill="#1a1a1a" />
            {[-26, -10, 14, 30].map((x, i) => <line key={i} x1={x} y1={14} x2={x + Math.sin(frame / 4 + i) * 8} y2={40} stroke="#e8ecef" strokeWidth={8} strokeLinecap="round" />)}
          </g>}
          {/* footprints */}
          {Array.from({length: 10}, (_, i) => <ellipse key={i} cx={860 - i * 70 - (scroll % 70)} cy={936 + (i % 2) * 8} rx={14} ry={5} fill={SNOW[t][1]} />)}
          {t === 'storm' && <Blizzard amt={p.whiteout ? 1.6 : 1} seed={seed} />}
          {p.whiteout && <rect width={W} height={H} fill="#eef2f4" opacity={0.55 + 0.1 * Math.sin(frame / 15)} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const IceRidge: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="ir" stops={ASKY.storm} />
          <IceField t="storm" y={760} />
          {Array.from({length: 9}, (_, i) => { const r = rng(i + 70); const x = 500 + i * 110, h = 200 + r() * 260; return <polygon key={i} points={`${x - 120},880 ${x},${880 - h} ${x + 40},${880 - h * 0.8} ${x + 140},880`} fill={i % 2 ? '#c8d4d8' : '#dce4e8'} stroke="#a0b0b8" strokeWidth={3} />; })}
          <g transform={`translate(${lerp(560, 1240, pr)} ${880 - Math.sin(pr * Math.PI) * 360}) scale(0.55)`}><NoahWalk phase={frame / 6} outfit="parka" rim="#ffffff" /></g>
          <Blizzard amt={0.8} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- weather station */
export const Station: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const far = !!p.far;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={far ? 1.0 : 1.04} to={far ? 1.2 : 1.0} origin="60% 60%">
        <Svg>
          <Sky id="st3" stops={ASKY.night} />
          <Stars count={360} />
          <AuroraBands seed={7} />
          <path d={`M 0 ${H} L 0 760 C 600 700 1200 640 1920 720 L 1920 ${H} Z`} fill="#22323e" />
          <g transform={`translate(1200 690) scale(${far ? 0.35 : 1})`}>
            <rect x={-6} y={-520} width={12} height={520} fill="#0a1218" />
            {[-400, -260, -120].map((y) => <line key={y} x1={-60} y1={y} x2={60} y2={y} stroke="#0a1218" strokeWidth={6} />)}
            <circle cx={0} cy={-530} r={8} fill={frame % 30 < 15 ? '#ff4a3a' : '#3a1a16'} />
            {[[-460, 0], [-260, 20], [140, 10]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
              <rect x={0} y={-130} width={200} height={130} fill="#8a3a2a" />
              <path d="M -10 -130 L 100 -190 L 210 -130 Z" fill="#e8eef0" />
              <rect x={70} y={-80} width={50} height={80} fill={p.door && i === 0 ? '#ffd28a' : '#3a1a16'} />
              <path d="M -10 0 C 40 -40 160 -40 210 0" fill="#e8eef0" />
            </g>)}
          </g>
          {!far && <g transform="translate(820 820) scale(0.6)"><NoahStandBack outfit="parka" /></g>}
          {p.door && <Glow id="std" cx={835} cy={650} r={240} color="#ffd28a" opacity={0.4} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const StationInt: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 240, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#1c2630" />
          {Array.from({length: 40}, (_, i) => { const r = rng(i + 80); return <circle key={i} cx={r() * W} cy={r() * 400} r={2 + r() * 6} fill="#e8eef0" opacity={0.35} />; })}
          <rect x={0} y={860} width={W} height={220} fill="#141c22" />
          <rect x={300} y={520} width={700} height={22} fill="#4a5258" />
          <rect x={420} y={420} width={260} height={100} rx={8} fill="#2a3238" /><rect x={440} y={440} width={120} height={50} fill="#0f2a1a" />
          <text x={500} y={474} textAnchor="middle" fill="#7fd0a0" fontFamily="DejaVu Sans Mono" fontSize={22}>SAT</text>
          <circle cx={620} cy={470} r={22} fill="#1a1e22" /><circle cx={720} cy={480} r={10} fill={frame % 24 < 12 ? '#ff4a3a' : '#3a1a16'} />
          <rect x={760} y={430} width={160} height={90} fill="#3a4248" />
          <rect x={1250} y={240} width={460} height={300} fill="#dcd6c0" />
          <path d="M 1250 240 L 1600 240 C 1560 330 1420 380 1250 400 Z" fill="#c9bf9a" />
          <Glow id="sig" cx={600} cy={500} r={600} color="#dfe8ec" opacity={0.2} />
          {p.noah && <g transform="translate(560 900) scale(1.0)"><NoahSitting outfit="parka" phone={false} head={0.3} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- helicopter */
const HeliShape: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <path d="M -180 0 C -200 -70 -120 -110 -20 -110 L 120 -100 C 180 -96 200 -50 190 0 C 120 20 -100 20 -180 0 Z" fill="#c0392b" />
    <path d="M 120 -100 C 170 -96 190 -60 188 -20 L 110 -20 Z" fill="#8ab0c0" opacity={0.8} />
    <path d="M -180 -40 L -460 -60 L -470 -40 L -180 -10 Z" fill="#c0392b" />
    <rect x={-480} y={-110} width={20} height={80} fill="#a0302a" />
    <line x1={-80} y1={30} x2={140} y2={30} stroke="#2a2f31" strokeWidth={10} />
    <rect x={-30} y={-130} width={40} height={24} fill="#2a2f31" />
    <ellipse cx={-10} cy={-134} rx={340 * Math.abs(Math.cos(frame * 1.7))} ry={8} fill="#2a2f31" opacity={0.7} />
    <text x={-60} y={-40} fill="#fff" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={26}>RESCUE</text>
  </g>
);

export const Heli: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.05}>
        <Svg>
          <Sky id="hl" stops={ASKY.night} />
          <Stars />
          <path d={`M 0 ${H} L 0 820 C 600 760 1200 720 1920 780 L 1920 ${H} Z`} fill="#22323e" />
          <polygon points={`${lerp(1500, 1000, pr)},${lerp(260, 520, pr)} ${lerp(1500, 1000, pr) - 260},${H} ${lerp(1500, 1000, pr) + 260},${H}`} fill="#e8f4ff" opacity={0.12} />
          <g transform={`translate(${lerp(1500, 1000, pr)} ${lerp(260, 520, pr)}) scale(0.9)`}><HeliShape frame={frame} /></g>
          <Glow id="hlg" cx={lerp(1500, 1000, pr)} cy={lerp(280, 540, pr)} r={180} color="#ff4a3a" opacity={frame % 20 < 10 ? 0.5 : 0.1} />
          <g transform="translate(700 930) scale(0.55)"><NoahStandBack outfit="parka" /></g>
          <Blizzard amt={0.4 + pr * 0.5} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const HeliInt: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.05}>
        <Svg>
          <rect width={W} height={H} fill="#0c1014" />
          <path d="M 200 120 C 600 60 1320 60 1720 120 L 1800 700 L 120 700 Z" fill="#0a1820" />
          <IceField t="night" y={480} />
          <rect x={0} y={700} width={W} height={380} fill="#14181c" />
          <rect x={760} y={740} width={400} height={260} rx={10} fill="#05080a" stroke="#2a3238" strokeWidth={6} />
          <rect x={780} y={760} width={360} height={220} fill="#1a1428" />
          {Array.from({length: 30}, (_, i) => { const r = rng(i + Math.floor(frame / 4)); return <rect key={i} x={780 + r() * 360} y={760 + r() * 220} width={20} height={10} fill={['#3a1a6a', '#6a2a8a', '#2a1a4a'][i % 3]} />; })}
          <text x={790} y={790} fill="#9fe0ff" fontFamily="DejaVu Sans Mono" fontSize={20}>THERMAL · SCANNING</text>
          {Array.from({length: 6}, (_, i) => <circle key={i} cx={300 + i * 90} cy={820} r={26} fill="#0f1214" stroke="#4a5458" strokeWidth={4} />)}
          <Glow id="hig" cx={960} cy={860} r={400} color="#9fe0ff" opacity={0.15} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const HeliView: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const open = p.open ?? 0.8;
  const fl = 0.75 + 0.25 * Math.sin(frame / 2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={p.flare ? 1.35 : 1.12} origin="55% 55%">
        <Svg>
          <rect width={W} height={H} fill="#1c2a36" />
          {Array.from({length: 40}, (_, i) => { const r = rng(i + 90); return <polygon key={i} points={`${r() * W},${r() * H} ${r() * W},${r() * H} ${r() * W},${r() * H}`} fill="#22323e" opacity={0.5} />; })}
          {/* open water lead */}
          <path d={`M 0 ${300 - open * 80} C 600 ${320 - open * 100} 1300 ${260 - open * 60} 1920 ${300 - open * 80} L 1920 ${300 + open * 160} C 1300 ${320 + open * 180} 600 ${340 + open * 160} 0 ${330 + open * 140} Z`} fill="#03090e" />
          {/* floe with the plane */}
          <path d="M 700 600 C 820 520 1240 520 1320 620 C 1400 740 1300 880 1100 900 C 900 920 720 860 680 760 C 660 700 670 640 700 600 Z" fill="#2e4252" stroke="#5a7a8a" strokeWidth={6} />
          <path d="M 640 560 C 600 700 640 920 1100 960 C 1400 940 1460 700 1360 580" fill="none" stroke="#03090e" strokeWidth={30 + open * 40} />
          <g transform="translate(1000 720) rotate(-20) scale(0.25)"><Plane broken /></g>
          {p.flare && <><circle cx={1120} cy={760} r={10 * fl} fill="#ffd0c0" /><Glow id="hvf" cx={1120} cy={760} r={260} color="#ff4a3a" opacity={0.75 * fl} /></>}
          <circle cx={960} cy={540} r={480} fill="none" stroke="#e8f4ff" strokeWidth={2} opacity={0.08} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
