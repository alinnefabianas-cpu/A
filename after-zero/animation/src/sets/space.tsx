import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Camera, clamp, Glow, H, lerp, rng, Sky, Svg, W} from '../lib';
import {NoahStandBack, NoahWalk} from '../noah';
import {camFor, mouth, SetProps, Stars} from './common';
import {Face, Person} from './jungle';

/* =========================================================== shared pieces */
const MONO = 'DejaVu Sans Mono';
const SPACE_BG = '#01030a';

const useShake = (amt: number) => {
  const frame = useCurrentFrame();
  const r = rng(frame * 31 + 7);
  return amt ? [(r() - 0.5) * 30 * amt, (r() - 0.5) * 22 * amt] : [0, 0];
};

type View = 'day' | 'night' | 'sunrise';

/** a huge planet seen from low orbit: centre far below the frame, only the curved limb visible */
export const Planet: React.FC<{view: View; seed?: number; cx?: number; cy?: number; R?: number; spin?: number; id: string}> = ({view, seed = 1, cx = 960, cy = 3300, R = 2700, spin = 0, id}) => {
  const frame = useCurrentFrame();
  const r = rng(seed * 13 + 5);
  const night = view === 'night';
  const span = Math.min(R, 1700);
  const depth = R < 1000 ? R * 1.9 : 1000;
  const k = R < 1000 ? 0.45 : 1;
  const land = Array.from({length: 14}, () => ({x: (r() - 0.5) * 2 * span, y: -R + r() * depth, rx: (120 + r() * 420) * k, ry: (60 + r() * 200) * k, a: r() * 180}));
  const clouds = Array.from({length: 40}, () => ({x: (r() - 0.5) * 2 * span, y: -R + r() * depth, rx: (60 + r() * 260) * k, ry: (10 + r() * 34) * k, a: (r() - 0.5) * 30}));
  const cities = Array.from({length: 700}, (_, i) => { const l = land[i % land.length]; return {x: l.x + (r() - 0.5) * l.rx * 1.6, y: l.y + (r() - 0.5) * l.ry * 1.6, s: 1.6 + Math.pow(r(), 3) * 5}; });
  const drift = frame * 0.6 + spin;
  return (
    <g>
      <defs>
        <clipPath id={`pc${id}`}><circle cx={cx} cy={cy} r={R} /></clipPath>
        <radialGradient id={`po${id}`} cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor={night ? '#0c1830' : '#3a8ad0'} />
          <stop offset="60%" stopColor={night ? '#050c1a' : '#1a5aa0'} />
          <stop offset="100%" stopColor={night ? '#02060e' : '#0e3a70'} />
        </radialGradient>
        <filter id={`pb${id}`}><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <circle cx={cx} cy={cy} r={R + 70} fill={night ? '#1a3a6a' : '#7ac0ff'} opacity={night ? 0.25 : 0.35} filter={`url(#pb${id})`} />
      <circle cx={cx} cy={cy} r={R} fill={`url(#po${id})`} />
      <g clipPath={`url(#pc${id})`}>
        <g transform={`translate(${cx + (drift % (span * 2))} ${cy})`}>
          {[0, -2 * span].map((off) => <g key={off} transform={`translate(${off} 0)`}>
            {land.map((l, i) => <ellipse key={i} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} transform={`rotate(${l.a} ${l.x} ${l.y})`} fill={night ? '#101c30' : i % 3 ? '#4a7a44' : '#a88a5a'} opacity={0.95} />)}
            {!night && clouds.map((c, i) => <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} transform={`rotate(${c.a} ${c.x} ${c.y})`} fill="#ffffff" opacity={0.75} />)}
            {night && cities.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.s} fill="#ffcf7a" opacity={0.5 + 0.5 * Math.abs(Math.sin(i + frame / 50))} />)}
          </g>)}
        </g>
        {view === 'sunrise' && <rect x={0} y={0} width={W} height={H} fill="#000" opacity={0.45} />}
      </g>
      {/* atmosphere line */}
      <circle cx={cx} cy={cy} r={R + 6} fill="none" stroke={night ? '#3a6aa0' : '#bfe6ff'} strokeWidth={10} opacity={night ? 0.35 : 0.8} />
      <circle cx={cx} cy={cy} r={R + 22} fill="none" stroke={night ? '#1a3a6a' : '#5aa8f0'} strokeWidth={26} opacity={0.3} filter={`url(#pb${id})`} />
      {view === 'sunrise' && <>
        <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke="#ff9a40" strokeWidth={24} opacity={0.85} filter={`url(#pb${id})`} />
        <circle cx={cx} cy={cy} r={R + 4} fill="none" stroke="#ffe0a0" strokeWidth={6} />
      </>}
    </g>
  );
};

export const StationShape: React.FC<{frame: number; damaged?: boolean; vent?: boolean; capsule?: boolean; night?: boolean}> = ({frame, damaged, vent, capsule = true, night}) => {
  const hull = night ? '#5a6470' : '#e8ecf0';
  const shade = night ? '#2a323a' : '#a8b0b8';
  const wing = (x: number, y: number, flip: number, broken?: boolean) => (
    <g transform={`translate(${x} ${y}) scale(1 ${flip})`}>
      <rect x={-8} y={0} width={16} height={60} fill={shade} />
      <path d={broken ? 'M -90 60 L 90 60 L 90 340 L 30 290 L -20 330 L -90 300 Z' : 'M -90 60 L 90 60 L 90 480 L -90 480 Z'} fill={night ? '#3a3020' : '#c8a040'} stroke="#5a4418" strokeWidth={4} />
      {Array.from({length: broken ? 6 : 9}, (_, i) => <line key={i} x1={-90} y1={60 + i * 47} x2={90} y2={60 + i * 47} stroke="#5a4418" strokeWidth={3} />)}
      <line x1={0} y1={60} x2={0} y2={broken ? 310 : 480} stroke="#5a4418" strokeWidth={3} />
      {!night && <rect x={-90} y={60} width={60} height={broken ? 240 : 420} fill="#fff" opacity={0.12} />}

    </g>
  );
  return (
    <g>
      {/* truss */}
      <rect x={-560} y={-14} width={1120} height={28} fill={shade} />
      {Array.from({length: 22}, (_, i) => <line key={i} x1={-560 + i * 52} y1={-14} x2={-534 + i * 52} y2={14} stroke={hull} strokeWidth={3} />)}
      {wing(-470, 14, 1)}{wing(-470, -14, -1)}{wing(470, 14, 1, damaged)}{wing(470, -14, -1)}
      {/* modules */}
      <rect x={-300} y={-70} width={260} height={140} rx={60} fill={hull} />
      <rect x={-50} y={-80} width={220} height={160} rx={70} fill={hull} />
      <rect x={160} y={-64} width={200} height={128} rx={56} fill={damaged ? '#b8bcc0' : hull} />
      {[-240, -160, 0, 80, 220, 300].map((x) => <rect key={x} x={x} y={-80} width={10} height={160} fill={shade} opacity={0.6} />)}
      <rect x={-300} y={20} width={660} height={60} fill="#000" opacity={0.12} />
      {/* cupola */}
      <path d="M 30 80 L 10 130 L 110 130 L 90 80 Z" fill={hull} /><rect x={22} y={110} width={76} height={14} fill="#1a3a5a" />
      {/* radiators */}
      <rect x={-20} y={-220} width={60} height={140} fill="#f4f4f4" opacity={night ? 0.4 : 1} /><rect x={-20} y={80} width={60} height={0} />
      {/* antenna */}
      {!damaged ? <g transform="translate(260 -64)"><line x1={0} y1={0} x2={0} y2={-90} stroke={shade} strokeWidth={8} /><path d="M -60 -110 Q 0 -60 60 -110 Z" fill={hull} stroke={shade} strokeWidth={4} /></g>
        : <g transform="translate(260 -64)"><line x1={0} y1={0} x2={0} y2={-40} stroke={shade} strokeWidth={8} /><path d="M -40 -42 L 10 -60 L 4 -40 Z" fill="#7a7a7a" /></g>}
      {damaged && <><circle cx={250} cy={10} r={12} fill="#1a1a1a" /><path d="M 238 2 l -14 -10 M 262 2 l 14 -12 M 250 22 l 2 16" stroke="#3a3a3a" strokeWidth={4} /></>}
      {vent && Array.from({length: 18}, (_, i) => { const k = ((frame * 3 + i * 11) % 80) / 80; return <circle key={i} cx={250 + k * 40 * Math.cos(i)} cy={10 + k * 300} r={6 + k * 40} fill="#e8f0ff" opacity={(1 - k) * 0.5} />; })}
      {/* docked capsule */}
      {capsule && <g transform="translate(-300 0)"><path d="M 0 -50 L -40 -50 L -150 -80 L -150 80 L -40 50 L 0 50 Z" fill={hull} /><rect x={-170} y={-84} width={22} height={168} rx={6} fill="#3a3028" /><rect x={-120} y={-20} width={30} height={20} rx={4} fill="#1a3a5a" /></g>}
      {/* nav lights */}
      <circle cx={-560} cy={0} r={6} fill="#ff4a3a" opacity={Math.floor(frame / 20) % 2 ? 1 : 0.2} />
      <circle cx={560} cy={0} r={6} fill="#4aff7a" opacity={Math.floor(frame / 20) % 2 ? 0.2 : 1} />
    </g>
  );
};

const Capsule: React.FC<{lights?: boolean; frame?: number}> = ({lights, frame = 0}) => (
  <g>
    <path d="M -50 -90 L 50 -90 L 140 110 L -140 110 Z" fill="#eef0f2" />
    <path d="M -50 -90 L 0 -90 L -60 110 L -140 110 Z" fill="#ffffff" opacity={0.4} />
    <rect x={-150} y={104} width={300} height={22} rx={8} fill="#2a2420" />
    <rect x={-30} y={-110} width={60} height={22} rx={4} fill="#b8bcc0" />
    <rect x={-70} y={-10} width={36} height={30} rx={6} fill="#1a3a5a" /><rect x={34} y={-10} width={36} height={30} rx={6} fill="#1a3a5a" />
    {lights && <><circle cx={0} cy={-120} r={8} fill="#fff" opacity={Math.floor(frame / 15) % 2 ? 1 : 0.2} /><Glow id="cpl" cx={0} cy={-120} r={60} color="#ffffff" opacity={0.5} /></>}
  </g>
);

/** a spacesuited figure, origin at the hips */
export const Astronaut: React.FC<{frame: number; reach?: number; light?: boolean; night?: boolean}> = ({frame, reach = 0, light, night}) => {
  const suit = night ? '#9aa4b0' : '#f2f2ee';
  const sh = night ? '#5a6470' : '#c8c8c0';
  const sw = Math.sin(frame / 20) * 6;
  return (
    <g>
      {light && <polygon points="40,-210 900,-520 900,120" fill="#fff8e0" opacity={0.12} />}
      <path d={`M -30 0 L -50 ${120 + sw} L -40 230`} stroke={sh} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M 30 0 L 60 ${110 - sw} L 70 220`} stroke={suit} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x={-120} y={-250} width={90} height={190} rx={16} fill={sh} />
      <rect x={-70} y={-260} width={150} height={270} rx={50} fill={suit} />
      <rect x={-40} y={-170} width={80} height={50} rx={8} fill="#c8ccd0" /><circle cx={-20} cy={-145} r={7} fill="#e04a3a" /><circle cx={4} cy={-145} r={7} fill="#3a8ae0" />
      <path d={`M -50 -230 L -110 ${-140 + sw} L -90 -60`} stroke={sh} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M 50 -230 L ${120 + reach * 40} ${-170 - reach * 90} L ${180 + reach * 60} ${-120 - reach * 200}`} stroke={suit} strokeWidth={42} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={180 + reach * 60} cy={-120 - reach * 200} r={26} fill="#e8e8e0" />
      <circle cx={0} cy={-320} r={86} fill={suit} />
      <ellipse cx={20} cy={-320} rx={62} ry={56} fill="#c88a2a" />
      <ellipse cx={4} cy={-336} rx={22} ry={14} fill="#fff6d0" opacity={0.6} />
      {light && <><circle cx={-50} cy={-390} r={12} fill="#fff8e0" /><Glow id="asl" cx={-50} cy={-390} r={60} color="#fff8e0" opacity={0.6} /></>}
    </g>
  );
};

/* =========================================================== earth views */
export const EarthSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const view: string = p.view ?? 'limb';
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 800, 0.6);
  const night = view === 'night' || view === 'chile';
  const pv: View = view === 'sunrise' ? 'sunrise' : night ? 'night' : 'day';
  const sx = lerp(300, 1600, frame / dur);
  return (
    <AbsoluteFill style={{background: SPACE_BG}}>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill={SPACE_BG} />
          <Stars count={night ? 700 : 240} maxY={H} seed={seed + 40} opacity={night ? 1 : 0.6} />
          {view === 'full' ? <g>
            <Planet view="day" seed={seed} cx={1000} cy={560} R={400} id={`ef${seed}`} spin={seed * 300} />
            <path d="M 1000 160 A 400 400 0 0 1 1000 960 A 260 400 0 0 0 1000 160 Z" fill="#000" opacity={0.55} />
            <Glow id="efs" cx={-200} cy={300} r={700} color="#fff6e0" opacity={0.5} />
          </g> : view === 'chile' ? <g>
            <rect width={W} height={H} fill="#03060c" />
            <path d="M 0 1080 L 0 520 C 300 500 520 420 700 300 C 820 220 900 120 960 0 L 1300 0 C 1240 160 1140 320 1000 480 C 860 640 700 860 640 1080 Z" fill="#0a1220" />
            <path d="M 960 0 C 900 140 820 260 700 340 C 640 380 600 400 560 430" stroke="#3a4a6a" strokeWidth={10} fill="none" opacity={0.6} />
            {Array.from({length: 30}, (_, i) => { const r = rng(i + 3); return <circle key={i} cx={100 + r() * 500} cy={600 + r() * 450} r={1 + r() * 2.5} fill="#ffcf7a" opacity={0.6} />; })}
            <circle cx={1040} cy={560} r={4} fill="#fff0c0" />
            <Glow id="ech" cx={1040} cy={560} r={40} color="#ffcf7a" opacity={0.8} />
            <circle cx={1040} cy={560} r={30 + (frame % 60)} fill="none" stroke="#f2c27d" strokeWidth={3} opacity={interpolate(frame % 60, [0, 60], [0.8, 0])} />
            <text x={1090} y={540} fill="#f2c27d" fontFamily="Inter" fontWeight={700} fontSize={30} letterSpacing={4} opacity={interpolate(frame, [30, 60], [0, 1], clamp)}>SOFÍA'S VILLAGE</text>
          </g> : <Planet view={pv} seed={seed} id={`el${seed}`} />}
          {view === 'sunrise' && <>
            <Glow id="esr" cx={lerp(700, 900, frame / dur)} cy={600} r={700} color="#ffb060" opacity={interpolate(frame, [0, dur * 0.6], [0.2, 0.9], clamp)} />
            <circle cx={lerp(700, 900, frame / dur)} cy={interpolate(frame, [0, dur], [640, 560])} r={30} fill="#fffaf0" opacity={interpolate(frame, [0, dur * 0.4], [0, 1], clamp)} />
          </>}
          {p.station && <g transform={`translate(${sx} 280) scale(0.18)`}><StationShape frame={frame} night={night} /></g>}
          {p.debris && Array.from({length: 26}, (_, i) => { const r = rng(i * 7 + 1); const k = ((frame * (2 + r() * 3) + r() * 400) % 500) / 500; const x = lerp(-200, 2200, k), y = 100 + r() * 700 + k * 100; return <line key={i} x1={x} y1={y} x2={x - 60 - r() * 80} y2={y - 6} stroke="#d8dce0" strokeWidth={1.5 + r() * 3} opacity={0.7} />; })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* =========================================================== the station outside */
export const StationSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase: string = p.phase ?? 'orbit';
  const hit = phase === 'hit';
  const flash = hit ? interpolate(frame, [0, 4, 30], [1, 0.8, 0], clamp) : 0;
  const [sx, sy] = useShake(hit ? interpolate(frame, [0, 40], [1, 0.2], clamp) : 0);
  const pr = frame / dur;
  const sc = phase === 'approach' ? lerp(0.55, 0.8, pr) : phase === 'leave' ? lerp(0.7, 0.25, pr) : phase === 'damaged' ? 0.9 : 0.75;
  const rot = phase === 'leave' ? -8 + pr * 6 : Math.sin(frame / 120) * 2;
  const draw = interpolate(frame, [20, 60], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: SPACE_BG}}>
      <Camera dur={dur} from={1.0} to={1.06} x={[sx, sx]} y={[sy, sy]}>
        <Svg>
          <rect width={W} height={H} fill={SPACE_BG} />
          <Stars count={300} maxY={H} seed={61} opacity={0.7} />
          <Planet view={phase === 'debris' || phase === 'hit' ? 'night' : 'day'} seed={phase === 'leave' ? 5 : 3} cy={3500} R={2700} id={`ss${phase}`} />
          <g transform={`translate(${phase === 'approach' ? 1100 : 960} 470) rotate(${rot}) scale(${sc})`}>
            <StationShape frame={frame} damaged={phase === 'damaged' || phase === 'hit' || phase === 'leave'} vent={hit} capsule={phase !== 'approach'} night={phase === 'debris' || phase === 'hit'} />
          </g>
          {phase === 'approach' && <g transform={`translate(${lerp(200, 640, Math.min(1, pr * 1.1))} 470) rotate(90) scale(0.45)`}><Capsule lights frame={frame} /></g>}
          {phase === 'leave' && <g transform={`translate(${lerp(980, 1500, pr)} ${lerp(560, 900, pr)}) rotate(70) scale(${lerp(0.5, 1.1, pr)})`}><Capsule lights frame={frame} /></g>}
          {(phase === 'debris' || hit) && Array.from({length: 40}, (_, i) => { const r = rng(i * 5 + 9); const k = ((frame * (6 + r() * 6) + r() * 900) % 900) / 900; const x = lerp(-300, 2300, k), y = 150 + r() * 700; return <g key={i}><line x1={x} y1={y} x2={x - 120 - r() * 160} y2={y - 10} stroke="#fff2d0" strokeWidth={1 + r() * 3} opacity={0.6} /><circle cx={x} cy={y} r={2 + r() * 3} fill="#ffffff" /></g>; })}
          {phase === 'damaged' && <g fontFamily={MONO} fontWeight={700} fontSize={23} opacity={draw}>
            {[[1194, 330, 1510, 190, 'MAIN ANTENNA: DESTROYED'], [1200, 450, 1510, 420, 'LAB MODULE: SEALED, NO AIR'], [1250, 490, 1510, 620, 'O₂ GENERATOR: INSIDE LAB'], [1390, 760, 1510, 860, 'SOLAR WING: DAMAGED']].map(([x1, y1, x2, y2, t], i) => <g key={i} opacity={interpolate(frame, [20 + i * 25, 40 + i * 25], [0, 1], clamp)}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ff6a50" strokeWidth={3} /><circle cx={x1 as number} cy={y1 as number} r={8} fill="#ff6a50" /><text x={(x2 as number) + 12} y={(y2 as number) + 8} fill="#ff8a70">{t}</text></g>)}
          </g>}
          {flash > 0 && <rect width={W} height={H} fill="#fff6e0" opacity={flash} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* =========================================================== interior of the module */
const ModuleInterior: React.FC<{mode: string; frame: number; seed?: number}> = ({mode, frame, seed = 1}) => {
  const alarm = mode === 'alarm';
  const dim = mode === 'dim' || mode === 'dark';
  const wall = alarm ? '#5a3a3a' : dim ? '#1a2430' : '#d8dcd8';
  const wall2 = alarm ? '#3a2424' : dim ? '#121a24' : '#b8bcb8';
  const r = rng(seed * 11 + 3);
  return (
    <g>
      <rect width={W} height={H} fill={wall2} />
      {/* receding rings: tunnel perspective */}
      {Array.from({length: 7}, (_, i) => { const k = 1 - i / 7; const w = 300 + k * 1900, h = 200 + k * 1250; return <rect key={i} x={960 - w / 2} y={540 - h / 2} width={w} height={h} rx={80 * k + 20} fill="none" stroke={i % 2 ? wall : wall2} strokeWidth={40 * k + 6} opacity={0.9} />; })}
      <rect x={810} y={440} width={300} height={200} rx={30} fill={dim ? '#0a1018' : alarm ? '#2a1414' : '#8a9090'} />
      {/* wall panels with cargo bags */}
      {Array.from({length: 10}, (_, i) => { const left = i < 5; const j = i % 5; const x = left ? 60 + j * 70 : 1500 + j * 70; return <rect key={i} x={x} y={160 + (j % 2) * 30} width={60} height={760 - (j % 2) * 60} rx={10} fill={['#c8ccd0', '#f2f2ee', '#8a9a7a', '#d8c8a0'][j % 4]} opacity={dim ? 0.25 : alarm ? 0.5 : 0.9} />; })}
      {/* laptops / screens */}
      {[[420, 380], [1380, 420]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={150} height={100} rx={6} fill="#1a1e22" /><rect x={x + 8} y={y + 8} width={134} height={80} fill={alarm ? '#ff4a3a' : dim ? '#1a3a4a' : '#4a8ab0'} opacity={alarm ? 0.5 + 0.5 * Math.sin(frame / 4) : 0.8} /></g>)}
      {/* handrails */}
      {[300, 1620].map((x) => <rect key={x} x={x} y={260} width={14} height={560} rx={7} fill="#e0a040" opacity={dim ? 0.4 : 0.9} />)}
      {/* cables */}
      <path d="M 200 120 C 400 200 300 300 500 260" stroke="#3a3a3a" strokeWidth={6} fill="none" opacity={0.6} />
      {/* floating objects */}
      {Array.from({length: 7}, (_, i) => { const x0 = 300 + r() * 1300, y0 = 200 + r() * 600, a = r() * 360, kind = i % 4; const x = x0 + Math.sin(frame / 90 + i) * 30, y = y0 + Math.cos(frame / 110 + i) * 24; return <g key={i} transform={`translate(${x} ${y}) rotate(${a + frame * (0.2 + i * 0.05)})`} opacity={dim ? 0.6 : 1}>
        {kind === 0 && <rect x={-40} y={-4} width={80} height={8} rx={3} fill="#2a5aa0" />}
        {kind === 1 && <rect x={-22} y={-30} width={44} height={60} rx={8} fill="#c8c0a8" />}
        {kind === 2 && <circle r={22} fill="none" stroke="#b8b8b8" strokeWidth={12} />}
        {kind === 3 && <circle r={10} fill="#9fd0ff" opacity={0.8} />}
      </g>; })}
      {alarm && <><rect width={W} height={H} fill="#ff2a1a" opacity={0.18 + 0.14 * Math.sin(frame / 5)} />{[180, 1740].map((x) => <g key={x}><circle cx={x} cy={110} r={22} fill="#ff4a3a" opacity={0.6 + 0.4 * Math.sin(frame / 5)} /><Glow id={`al${x}`} cx={x} cy={110} r={200} color="#ff3a2a" opacity={0.5 + 0.4 * Math.sin(frame / 5)} /></g>)}</>}
      {dim && <rect width={W} height={H} fill="#000814" opacity={0.35} />}
    </g>
  );
};

export const ModuleSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? 'day';
  const cam = camFor((p.seed ?? 1) + 830, 0.6);
  const hatchClose = p.hatch ? interpolate(frame, [dur * 0.45, dur * 0.6], [0, 1], clamp) : 0;
  const lightOn = p.panel ? (frame < dur * 0.35 ? (Math.floor(frame / 8) % 2) : frame < dur * 0.5 ? 1 : 0) : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <ModuleInterior mode={mode} frame={frame} seed={p.seed ?? 1} />
          {p.hatch && <g transform="translate(960 540)">
            <circle r={210} fill="#2a2a2a" />
            <circle r={180} fill="#05070a" />
            <circle r={18} cx={60} cy={-40} fill="#e8f0ff" opacity={1 - hatchClose} />
            <g transform={`scale(${hatchClose} 1)`}><circle r={180} fill="#8a8c90" /><rect x={-90} y={-14} width={180} height={28} rx={8} fill="#3a3a3a" transform={`rotate(${hatchClose * 90})`} /></g>
            <text y={280} textAnchor="middle" fill="#ffb0a0" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={3}>{hatchClose < 1 ? 'CABIN PRESSURE  ' + (96 - Math.round(frame / dur * 22)) + ' kPa' : 'HATCH SEALED'}</text>
          </g>}
          {p.panel && <g transform="translate(960 560)">
            <rect x={-300} y={-180} width={600} height={360} rx={20} fill="#2a2e32" stroke="#4a4e52" strokeWidth={6} />
            <text x={-260} y={-120} fill="#9aa4b0" fontFamily={MONO} fontSize={28}>S-BAND TRANSMITTER</text>
            <circle cx={-200} cy={20} r={34} fill={lightOn ? '#5aff8a' : '#1a2a1e'} />{lightOn ? <Glow id="mpl" cx={-200} cy={20} r={120} color="#5aff8a" opacity={0.6} /> : null}
            <circle cx={0} cy={20} r={34} fill={frame > dur * 0.5 ? '#ff4a3a' : '#2a1a1a'} />
            <text x={-260} y={130} fill={frame > dur * 0.5 ? '#ff6a50' : '#9aa4b0'} fontFamily={MONO} fontWeight={700} fontSize={30}>{frame > dur * 0.5 ? 'AMPLIFIER FAULT' : 'POWER ON...'}</text>
          </g>}
          {p.box && <g transform={`translate(1100 ${560 + Math.sin(frame / 40) * 14}) rotate(${-8 + Math.sin(frame / 60) * 4})`}>
            <rect x={-170} y={-110} width={340} height={220} rx={16} fill="#e8c02a" /><rect x={-170} y={-110} width={340} height={40} rx={16} fill="#c8a020" />
            <rect x={-120} y={-30} width={240} height={70} fill="#f8f4e8" /><text y={16} textAnchor="middle" fill="#2a2a6a" fontFamily="Comic Sans MS, DejaVu Sans" fontSize={30} fontStyle="italic">School contacts</text>
            <Glow id="mbx" cx={0} cy={0} r={300} color="#ffe080" opacity={0.25} />
          </g>}
          {p.noah && <g transform={`translate(${lerp(760, 980, frame / dur)} ${600 + Math.sin(frame / 30) * 16}) rotate(${-72 + Math.sin(frame / 50) * 4}) scale(0.62)`}><NoahWalk phase={Math.sin(frame / 25) * 0.5} outfit="out" rim={mode === 'alarm' ? '#ff6a50' : '#cfe6f2'} /></g>}
          {p.rescue && <><Glow id="mrs" cx={960} cy={540} r={700} color="#ffffff" opacity={interpolate(frame, [0, dur * 0.5], [0.2, 0.7], clamp)} /><circle cx={960} cy={540} r={150} fill="#ffffff" opacity={0.8} /></>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* =========================================================== cupola window */
export const Cupola: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const view: View = p.view === 'night' ? 'night' : 'day';
  const seed = p.seed ?? 1;
  const frameCol = '#c8ccd0';
  const hex = (cx: number, cy: number, rr: number) => Array.from({length: 6}, (_, i) => `${cx + rr * Math.cos(Math.PI / 6 + i * Math.PI / 3)},${cy + rr * Math.sin(Math.PI / 6 + i * Math.PI / 3)}`).join(' ');
  return (
    <AbsoluteFill style={{background: SPACE_BG}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <rect width={W} height={H} fill={SPACE_BG} />
          <Stars count={300} maxY={H} seed={seed + 70} />
          <Planet view={view} seed={seed + 10} cy={2700} R={2500} id={`cu${seed}${view}`} />
          {/* window frame: thick wall with a central round pane and six trapezoids */}
          <path d={`M 0 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z M ${hex(960, 520, 640)}`} fillRule="evenodd" fill="#9aa0a6" />
          <polygon points={hex(960, 520, 640)} fill="none" stroke={frameCol} strokeWidth={30} />
          <circle cx={960} cy={520} r={300} fill="none" stroke={frameCol} strokeWidth={34} />
          {Array.from({length: 6}, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return <line key={i} x1={960 + 300 * Math.cos(a)} y1={520 + 300 * Math.sin(a)} x2={960 + 640 * Math.cos(a)} y2={520 + 640 * Math.sin(a)} stroke={frameCol} strokeWidth={30} />; })}
          <rect width={W} height={H} fill="#000" opacity={view === 'night' ? 0.2 : 0} />
          {p.note && <text x={960} y={1010} textAnchor="middle" fill="#1a1a4a" fontFamily="Comic Sans MS, DejaVu Sans" fontStyle="italic" fontSize={56} transform="rotate(-2 960 1010)" opacity={interpolate(frame, [20, 50], [0, 1], clamp)}>Keep listening.</text>}
          {!p.note && <g transform={`translate(1500 ${1240 + Math.sin(frame / 40) * 10}) scale(0.95)`}><NoahStandBack outfit="out" /></g>}
          <polygon points="400,0 520,0 300,1080 180,1080" fill="#fff" opacity={0.05} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* =========================================================== portraits: Vera, Sofía */
const VERA: Face = {skin: '#ecc8ac', hair: '#d8c8a0', shirt: '#2a3a5a', female: true, young: true};
const SOFIA: Face = {skin: '#b07a54', hair: '#1a1210', shirt: '#a83a2a', female: true, young: true};

const Portrait: React.FC<SetProps & {face: Face; who: string; bg: Record<string, React.ReactNode>; float?: boolean}> = ({dur, p, talk, face, who, bg, float}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? Object.keys(bg)[0];
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 41) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const cam = camFor(seed + 860, 0.5);
  const bob = float ? Math.sin(frame / 40) * 12 : Math.sin(frame / 24) * 3;
  const tilt = float ? Math.sin(frame / 70) * 2 : 0;
  const injured = who === 'VERA' && mode === 'dim';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          {bg[mode] ?? Object.values(bg)[0]}
          <g transform={`translate(820 ${650 + bob}) rotate(${tilt}) scale(1.35)`}>
            {who === 'SOFIA' && <><path d="M -100 -40 C -150 40 -150 160 -120 230" stroke={face.hair} strokeWidth={34} fill="none" strokeLinecap="round" /><path d="M 100 -40 C 150 40 150 160 120 230" stroke={face.hair} strokeWidth={34} fill="none" strokeLinecap="round" /></>}
            <Person f={face} talk={mouth(frame, talk, who)} blink={blink} worried={p.worried} smile={p.smile && !(talk && frame >= talk.from && frame <= talk.to)} />
            {who === 'VERA' && <>
              {/* short floating hair */}
              {mode !== 'training' && <path d={`M -110 -60 C -150 ${-150 + Math.sin(frame / 30) * 10} -60 -210 0 -200 C 70 -214 160 ${-150 + Math.cos(frame / 34) * 10} 110 -60`} fill={face.hair} />}
              <path d="M -100 -60 C -110 -100 -100 -130 -80 -140 M 100 -60 C 110 -100 100 -130 80 -140" stroke="#c8b890" strokeWidth={6} fill="none" />
              <path d="M -84 0 l -16 -6 M -84 10 l -16 2 M 84 0 l 16 -6 M 84 10 l 16 2" stroke="#000" strokeOpacity={0.2} strokeWidth={3} />
              <circle cx={-150} cy={250} r={34} fill="#1a2a4a" stroke="#e8c040" strokeWidth={6} /><path d="M -168 256 L -150 228 L -132 256" stroke="#e8c040" strokeWidth={5} fill="none" />
              <rect x={100} y={230} width={80} height={24} fill="#ffffff" /><rect x={100} y={230} width={80} height={8} fill="#0a5aa0" /><rect x={100} y={246} width={80} height={8} fill="#e8c020" />
              {injured && <><path d="M -250 360 L -60 200 L 60 200 L 250 360" stroke="#d8d8d0" strokeWidth={26} fill="none" opacity={0.85} /><rect x={-120} y={280} width={160} height={60} rx={14} fill="#c8c8c0" /><rect x={-110} y={292} width={140} height={10} fill="#8a8a88" /></>}
            </>}
            {who === 'SOFIA' && <>
              <path d="M -126 -20 C -130 -170 130 -170 126 -20" stroke="#2a2a2a" strokeWidth={14} fill="none" />
              <rect x={-150} y={-40} width={40} height={74} rx={16} fill="#2a2a2a" /><rect x={110} y={-40} width={40} height={74} rx={16} fill="#2a2a2a" />
              <path d="M -230 360 C -220 240 -140 200 0 200 C 140 200 220 240 230 360 Z" fill="#a83a2a" />
              {Array.from({length: 7}, (_, i) => <path key={i} d={`M ${-200 + i * 66} 290 l 22 -24 l 22 24`} stroke="#f2c27d" strokeWidth={6} fill="none" />)}
              <path d="M -200 320 L 200 320" stroke="#2a6a8a" strokeWidth={10} />
            </>}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

const AndesNight: React.FC<{seed?: number}> = ({seed = 1}) => (
  <g>
    <Sky id={`an${seed}`} stops={[[0, '#01030a'], [0.7, '#081428'], [1, '#14203a']]} />
    <Stars count={1200} maxY={H} seed={seed + 90} />
    <path d="M -100 900 C 500 500 1200 300 2100 -50" stroke="#c9d4e8" strokeWidth={300} opacity={0.08} fill="none" />
    <path d="M -100 900 C 500 500 1200 300 2100 -50" stroke="#f0e8f8" strokeWidth={100} opacity={0.08} fill="none" />
    <path d={`M 0 820 L 180 700 L 300 760 L 520 560 L 700 720 L 860 640 L 1100 760 L 1320 580 L 1500 700 L 1700 620 L 1920 740 L 1920 1080 L 0 1080 Z`} fill="#0e1424" />
    <path d={`M 520 560 L 560 600 L 540 620 L 500 590 Z M 1320 580 L 1360 620 L 1300 610 Z`} fill="#c8d0e0" opacity={0.6} />
    <path d="M 0 900 C 400 860 1400 880 1920 860 L 1920 1080 L 0 1080 Z" fill="#141a28" />
  </g>
);

export const Vera: React.FC<SetProps> = (props) => {
  const frame = useCurrentFrame();
  return <Portrait {...props} face={VERA} who="VERA" float={props.p.mode !== 'training'} bg={{
    training: <><rect width={W} height={H} fill="#cfd6da" /><rect x={0} y={760} width={W} height={320} fill="#9aa4aa" />
      <rect x={1180} y={120} width={600} height={520} fill="#2a6aa0" opacity={0.9} />{Array.from({length: 6}, (_, i) => <path key={i} d={`M 1180 ${200 + i * 80} Q 1330 ${180 + i * 80 + Math.sin(frame / 20 + i) * 10} 1480 ${200 + i * 80} T 1780 ${200 + i * 80}`} stroke="#8ac8f0" strokeWidth={4} fill="none" opacity={0.6} />)}
      <text x={1480} y={700} textAnchor="middle" fill="#3a4a5a" fontFamily="Inter" fontWeight={700} fontSize={30} letterSpacing={6}>NEUTRAL BUOYANCY LAB</text>
      <rect x={140} y={140} width={300} height={200} fill="#ffffff" /><text x={290} y={260} textAnchor="middle" fill="#2a3a5a" fontFamily="Inter" fontWeight={800} fontSize={44}>MERIDIAN</text></>,
    station: <ModuleInterior mode="day" frame={frame} seed={3} />,
    alarm: <ModuleInterior mode="alarm" frame={frame} seed={4} />,
    dim: <ModuleInterior mode="dim" frame={frame} seed={5} />,
    cupola: <><rect width={W} height={H} fill={SPACE_BG} /><Planet view="day" seed={21} cy={2500} R={2300} id="vcu" /><rect width={W} height={H} fill="none" stroke="#9aa0a6" strokeWidth={160} /></>,
  }} />;
};

export const Sofia: React.FC<SetProps> = (props) => {
  const frame = useCurrentFrame();
  return <Portrait {...props} face={SOFIA} who="SOFIA" bg={{
    roof: <><AndesNight seed={2} /><g transform="translate(1500 900)"><line x1={0} y1={0} x2={0} y2={-420} stroke="#3a3a3a" strokeWidth={8} />{[0, 1, 2, 3].map((i) => <line key={i} x1={-120 + i * 20} y1={-380 + i * 30} x2={120 - i * 20} y2={-380 + i * 30} stroke="#3a3a3a" strokeWidth={6} />)}</g>
      <rect x={1180} y={860} width={260} height={150} rx={14} fill="#3a2a1a" /><rect x={1200} y={880} width={120} height={50} fill="#5aff8a" opacity={0.5 + 0.2 * Math.sin(frame / 6)} /><Glow id="sfr" cx={1260} cy={900} r={260} color="#5aff8a" opacity={0.25} /><rect x={0} y={1000} width={W} height={80} fill="#5a3a2a" /></>,
    day: <><Sky id="sfd" stops={[[0, '#1a5aa0'], [0.7, '#7ab0d8'], [1, '#e8dcc0']]} /><path d="M 0 760 L 300 560 L 520 680 L 800 460 L 1100 640 L 1400 500 L 1700 640 L 1920 560 L 1920 1080 L 0 1080 Z" fill="#a8785a" /><path d="M 800 460 L 850 510 L 760 500 Z M 1400 500 L 1450 550 L 1360 540 Z" fill="#ffffff" />
      <rect x={0} y={900} width={W} height={180} fill="#c8a07a" /><rect x={1300} y={720} width={420} height={200} fill="#d8b08a" /><rect x={1460} y={800} width={80} height={120} fill="#5a3a2a" /><line x1={1650} y1={720} x2={1650} y2={420} stroke="#3a3a3a" strokeWidth={8} /></>,
  }} />;
};

/* =========================================================== mission control */
export const Control: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? 'launch';
  const red = mode === 'alarm' || mode === 'silent';
  const green = mode === 'cheer';
  const scr = red ? '#5a1a14' : green ? '#0e3a24' : '#0e2a3a';
  const blinkOn = Math.floor(frame / 18) % 2 === 0;
  const count = Math.max(0, 10 - Math.floor(frame / 30));
  return (
    <AbsoluteFill style={{background: '#06090c'}}>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <rect width={W} height={H} fill="#080c10" />
          <rect x={160} y={70} width={1600} height={520} rx={10} fill={scr} />
          {/* world map with orbit track */}
          <g transform="translate(260 120) scale(0.75)" opacity={0.85}>
            <WorldMap col={red ? '#8a3a2a' : green ? '#2a7a4a' : '#2a5a7a'} />
            <path d={`M 0 300 ${Array.from({length: 41}, (_, i) => `L ${i * 40} ${300 - Math.sin(i / 40 * Math.PI * 2 * 1.5) * 200}`).join(' ')}`} stroke={red ? '#ff8a70' : '#f2c27d'} strokeWidth={4} fill="none" strokeDasharray="14 10" />
          </g>
          {mode === 'launch' && <text x={1640} y={170} textAnchor="end" fill="#f2c27d" fontFamily={MONO} fontWeight={700} fontSize={90}>T-{String(count).padStart(2, '0')}</text>}
          {mode === 'alarm' && <text x={960} y={340} textAnchor="middle" fill="#ff6a50" fontFamily={MONO} fontWeight={700} fontSize={80} opacity={blinkOn ? 1 : 0.4}>DEBRIS WARNING</text>}
          {mode === 'silent' && <><text x={960} y={330} textAnchor="middle" fill="#ff6a50" fontFamily={MONO} fontWeight={700} fontSize={84} opacity={blinkOn ? 1 : 0.3}>SIGNAL LOST</text><text x={960} y={410} textAnchor="middle" fill="#ff9a80" fontFamily={MONO} fontSize={40}>MERIDIAN · NO TELEMETRY</text></>}
          {green && <><text x={960} y={330} textAnchor="middle" fill="#5aff8a" fontFamily={MONO} fontWeight={700} fontSize={84}>MERIDIAN · ALIVE</text><text x={960} y={410} textAnchor="middle" fill="#a0ffc0" fontFamily={MONO} fontSize={38}>SOURCE: AMATEUR RADIO · ATACAMA, CHILE</text></>}
          {mode === 'plan' && <g fontFamily={MONO} fontWeight={700}>
            <rect x={300} y={240} width={1320} height={60} fill="#1a2a3a" /><rect x={300} y={240} width={1320 * 0.83} height={60} fill="#3a8ae0" /><text x={310} y={226} fill="#9fd0ff" fontSize={32}>OXYGEN · 2.5 DAYS</text>
            <rect x={300} y={400} width={1320} height={60} fill="#1a2a3a" /><rect x={300} y={400} width={1320} height={60} fill="#f2a040" /><text x={310} y={386} fill="#f2c27d" fontSize={32}>RESCUE ARRIVAL · 3 DAYS</text>
            <line x1={300 + 1320 * 0.83} y1={220} x2={300 + 1320 * 0.83} y2={480} stroke="#ff4a3a" strokeWidth={5} strokeDasharray="10 8" />
            <text x={960} y={540} textAnchor="middle" fill="#ffffff" fontSize={34}>MOVE LESS · TALK LESS · SLEEP MORE</text>
          </g>}
          {/* consoles and people */}
          {[0, 1].map((row) => <g key={row}>
            <rect x={60 + row * 40} y={720 + row * 170} width={1800 - row * 80} height={60} fill={row ? '#141c22' : '#10161c'} />
            {Array.from({length: 7}, (_, i) => { const x = 200 + i * 250 + row * 60; const up = green ? Math.max(0, Math.sin(frame / 8 + i)) : 0; return <g key={i}>
              <rect x={x - 60} y={650 + row * 170} width={120} height={70} fill="#1a2228" /><rect x={x - 52} y={656 + row * 170} width={104} height={56} fill={scr} opacity={0.9} />
              <circle cx={x} cy={760 + row * 170 - up * 20} r={34} fill="#05080a" /><path d={`M ${x - 60} ${860 + row * 170} C ${x - 56} ${800 + row * 170} ${x + 56} ${800 + row * 170} ${x + 60} ${860 + row * 170} Z`} fill="#05080a" />
              {green && <><line x1={x - 40} y1={800 + row * 170} x2={x - 60 - up * 10} y2={720 + row * 170 - up * 40} stroke="#05080a" strokeWidth={20} strokeLinecap="round" /><line x1={x + 40} y1={800 + row * 170} x2={x + 60 + up * 10} y2={720 + row * 170 - up * 40} stroke="#05080a" strokeWidth={20} strokeLinecap="round" /></>}
            </g>; })}
          </g>)}
          {talk && frame >= talk.from && frame <= talk.to && <g transform="translate(1680 640)"><rect x={-130} y={-40} width={260} height={56} rx={10} fill="#000" opacity={0.6} />{Array.from({length: 12}, (_, i) => <rect key={i} x={-110 + i * 19} y={-12 - Math.abs(Math.sin(frame / 3 + i)) * 20} width={10} height={Math.abs(Math.sin(frame / 3 + i)) * 40 + 4} fill="#f2c27d" />)}</g>}
          <Glow id="ctg" cx={960} cy={330} r={900} color={red ? '#ff4a3a' : green ? '#5aff8a' : '#3a8ae0'} opacity={0.15} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/** very rough equirectangular world map, 1600×600 */
const WorldMap: React.FC<{col: string; hi?: boolean}> = ({col, hi}) => (
  <g fill={col}>
    <path d="M 120 80 L 380 60 L 470 120 L 430 200 L 360 260 L 300 300 L 260 280 L 200 200 L 130 160 Z" />
    <path d="M 330 320 L 400 330 L 450 390 L 430 470 L 390 560 L 360 580 L 350 500 L 320 400 Z" fill={hi ? '#f2c27d' : col} />
    <path d="M 720 90 L 840 70 L 860 130 L 800 170 L 740 160 Z" />
    <path d="M 740 200 L 860 190 L 920 260 L 900 380 L 840 470 L 800 420 L 770 320 L 720 260 Z" />
    <path d="M 860 70 L 1200 50 L 1420 90 L 1460 160 L 1360 230 L 1260 260 L 1180 300 L 1100 260 L 1000 220 L 900 160 Z" />
    <path d="M 1300 400 L 1440 380 L 1480 440 L 1420 500 L 1320 480 Z" />
    <path d="M 500 40 L 600 30 L 620 80 L 540 110 Z" />
  </g>
);

/* =========================================================== launch */
export const RocketSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase: string = p.phase ?? 'pad';
  const pr = frame / dur;
  const [sx, sy] = useShake(phase === 'launch' ? 0.7 : phase === 'ascent' ? 0.25 : 0);
  const lift = phase === 'launch' ? Math.pow(Math.max(0, pr - 0.15), 2) * 900 : 0;
  const skyStops: [number, string][] = phase === 'pad' || phase === 'launch' ? [[0, '#2a3050'], [0.5, '#a07a80'], [0.8, '#f0b080'], [1, '#f8d8a0']]
    : phase === 'ascent' ? [[0, '#0a0e2a'], [0.5, '#2a4a8a'], [1, '#6aa0d8']] : [[0, SPACE_BG], [1, '#050a18']];
  const Rocket = <g>
    <rect x={-40} y={-620} width={80} height={600} fill="#f2f2ee" />
    <rect x={-40} y={-620} width={26} height={600} fill="#ffffff" opacity={0.5} />
    <rect x={-40} y={-360} width={80} height={14} fill="#2a2a2a" />
    <path d="M -40 -620 L -40 -700 L 0 -760 L 40 -700 L 40 -620 Z" fill="#eef0f2" />
    <path d="M -40 -20 L -80 30 L -40 30 Z M 40 -20 L 80 30 L 40 30 Z" fill="#2a2a2a" />
    <text x={0} y={-460} textAnchor="middle" fill="#2a3a5a" fontFamily="Inter" fontWeight={800} fontSize={22} transform="rotate(-90 0 -460)">MERIDIAN</text>
  </g>;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={phase === 'pad' ? 1.08 : 1.02} x={[sx, sx]} y={[sy, sy]}>
        <Svg>
          <Sky id={`rk${phase}`} stops={skyStops} />
          {(phase === 'ascent' || phase === 'space') && <Stars count={phase === 'space' ? 600 : 200} maxY={H} seed={77} opacity={phase === 'space' ? 1 : 0.4} />}
          {(phase === 'pad' || phase === 'launch') && <>
            <Glow id="rks" cx={1500} cy={900} r={700} color="#f8a050" opacity={0.6} />
            <path d="M 0 920 L 1920 920 L 1920 1080 L 0 1080 Z" fill="#2a2a34" />
            <g transform="translate(1060 920)"><rect x={60} y={-720} width={60} height={720} fill="#3a3a44" />{Array.from({length: 14}, (_, i) => <line key={i} x1={60} y1={-i * 52} x2={120} y2={-i * 52 - 52} stroke="#5a5a64" strokeWidth={4} />)}<rect x={0} y={-560} width={60} height={12} fill="#5a5a64" /></g>
            <g transform={`translate(1000 ${920 - lift})`}>{Rocket}
              {phase === 'launch' && pr > 0.08 && <><path d={`M -60 30 Q 0 ${300 + Math.sin(frame) * 30} 60 30 Z`} fill="#ffd27a" /><path d={`M -30 30 Q 0 ${200 + Math.sin(frame * 1.3) * 20} 30 30 Z`} fill="#ffffff" /><Glow id="rkf" cx={0} cy={120} r={500} color="#ffb060" opacity={0.8} /></>}
            </g>
            {/* vapor / smoke */}
            {Array.from({length: phase === 'launch' ? 30 : 8}, (_, i) => { const r = rng(i + 5); const k = ((frame * (phase === 'launch' ? 2 : 0.4) + r() * 100) % 100) / 100; const side = r() > 0.5 ? 1 : -1; return <circle key={i} cx={1000 + side * (60 + k * (phase === 'launch' ? 900 : 200))} cy={900 - k * 80 + r() * 40} r={40 + k * (phase === 'launch' ? 200 : 80)} fill="#f0ece4" opacity={(1 - k) * 0.7} />; })}
          </>}
          {phase === 'ascent' && <g transform={`translate(${lerp(900, 1100, pr)} ${lerp(700, 400, pr)}) rotate(${lerp(5, 30, pr)}) scale(0.35)`}>
            <path d="M -30 30 L -200 1800 L 200 1800 L 30 30 Z" fill="#ffffff" opacity={0.35} />
            {Rocket}<path d={`M -50 30 Q 0 ${260 + Math.sin(frame) * 30} 50 30 Z`} fill="#ffd27a" /><Glow id="rka" cx={0} cy={80} r={240} color="#ffb060" opacity={0.9} />
          </g>}
          {phase === 'space' && <>
            <Planet view="day" seed={12} cy={3600} R={2900} id="rksp" />
            <g transform={`translate(${lerp(820, 900, pr)} 500) rotate(70) scale(0.5)`}><Capsule /></g>
            <g transform={`translate(${lerp(700, 300, pr)} ${lerp(560, 760, pr)}) rotate(${70 + pr * 60}) scale(0.4)`}><rect x={-40} y={-500} width={80} height={480} fill="#e8e8e4" /><rect x={-40} y={-500} width={80} height={14} fill="#2a2a2a" /></g>
          </>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* =========================================================== small sets */
export const WaterBlob: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const blob = (cx: number, cy: number, rr: number, ph: number, k: number) => {
    const pts = Array.from({length: 24}, (_, i) => { const a = (i / 24) * Math.PI * 2; const w = rr * (1 + 0.08 * Math.sin(a * 3 + frame / 8 + ph) + 0.05 * Math.sin(a * 2 - frame / 11)); return [cx + Math.cos(a) * w, cy + Math.sin(a) * w]; });
    return <g key={k}><path d={`M ${pts.map((q) => q.join(' ')).join(' L ')} Z`} fill="#9fd8ff" opacity={0.55} stroke="#e8f8ff" strokeWidth={3} />
      <ellipse cx={cx - rr * 0.35} cy={cy - rr * 0.35} rx={rr * 0.25} ry={rr * 0.15} fill="#ffffff" opacity={0.8} transform={`rotate(-30 ${cx} ${cy})`} />
      <ellipse cx={cx + rr * 0.2} cy={cy + rr * 0.3} rx={rr * 0.5} ry={rr * 0.3} fill="#2a6aa0" opacity={0.25} /></g>;
  };
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.05} to={1.15}>
        <Svg>
          <ModuleInterior mode="day" frame={frame} seed={7} />
          <rect width={W} height={H} fill="#000" opacity={0.25} />
          {blob(960 + Math.sin(frame / 60) * 40, 520 + Math.cos(frame / 70) * 30, 170, 0, 0)}
          {[[620, 360, 40], [1300, 420, 56], [1180, 760, 28], [700, 740, 34], [1450, 260, 20]].map(([x, y, rr], i) => blob(x + Math.sin(frame / 50 + i) * 30, y + Math.cos(frame / 60 + i) * 26, rr, i, i + 1))}
          <g transform={`translate(${lerp(1900, 1500, Math.min(1, frame / dur * 1.5))} 560)`}><path d="M 0 -120 L 300 -140 L 300 140 L 0 120 Z" fill="#e8e0c8" /><path d="M 0 -120 L -60 -60 L -40 60 L 0 120" fill="#d8ccb0" /></g>
          <text x={700} y={960} textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontWeight={700} fontSize={32} letterSpacing={6} opacity={0.8}>WATER, IN ZERO GRAVITY</text>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Gauge: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [0, dur * 0.8], [p.from ?? 0, p.to ?? 0], clamp);
  const max = p.max ?? 10;
  const isCO2 = p.label === 'CO2';
  const danger = p.danger;
  const bad = danger !== undefined ? (isCO2 ? v >= danger * 0.55 : v <= danger) : false;
  const txt = (p.to ?? 0) >= 100 ? Math.round(v).toLocaleString('en-US') : v.toFixed(1);
  const col = bad ? '#ff5a3a' : isCO2 ? '#f2c27d' : '#5ad0ff';
  return (
    <AbsoluteFill style={{background: '#06090c'}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <ModuleInterior mode="dim" frame={frame} seed={9} />
          <rect width={W} height={H} fill="#000" opacity={0.45} />
          <g transform="translate(960 540)">
            <rect x={-520} y={-260} width={1040} height={520} rx={30} fill="#0c1014" stroke="#3a4248" strokeWidth={8} />
            <text x={-460} y={-180} fill="#8a9aa8" fontFamily={MONO} fontWeight={700} fontSize={40} letterSpacing={6}>{isCO2 ? 'CO₂ LEVEL' : p.label}</text>
            <text x={0} y={60} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={700} fontSize={190}>{txt}</text>
            <text x={0} y={130} textAnchor="middle" fill="#8a9aa8" fontFamily={MONO} fontSize={38} letterSpacing={6}>{p.unit}</text>
            <rect x={-460} y={170} width={920} height={34} rx={10} fill="#1a2228" />
            <rect x={-460} y={170} width={920 * Math.min(1, v / max)} height={34} rx={10} fill={col} />
            {danger !== undefined && <line x1={-460 + 920 * danger / max} y1={156} x2={-460 + 920 * danger / max} y2={218} stroke="#ff4a3a" strokeWidth={6} />}
            {bad && <circle cx={440} cy={-190} r={18} fill="#ff4a3a" opacity={Math.floor(frame / 12) % 2 ? 1 : 0.2} />}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Scrubber: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const built = p.phase === 'built';
  const breath = 1 + 0.07 * Math.sin(frame / 18);
  const items: [number, number, string, React.ReactNode][] = [
    [380, 380, 'STORAGE BAGS', <g><rect x={-90} y={-70} width={180} height={140} rx={10} fill="#e8eef2" opacity={0.85} stroke="#b8c4cc" strokeWidth={4} /><rect x={-90} y={-70} width={180} height={18} fill="#4a8ab0" /></g>],
    [960, 360, 'VACUUM HOSE', <path d="M -150 30 C -80 -80 60 80 150 -30" stroke="#5a5a5a" strokeWidth={34} fill="none" strokeLinecap="round" strokeDasharray="6 4" />],
    [1540, 380, 'COMPUTER FAN', <g><rect x={-80} y={-80} width={160} height={160} rx={10} fill="#2a2a2a" /><circle r={64} fill="#1a1a1a" />{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} rx={50} ry={14} fill="#5a5a5a" transform={`rotate(${i * 72})`} />)}</g>],
    [600, 760, '2 SPARE FILTERS', <g>{[-50, 50].map((x) => <g key={x}><rect x={x - 40} y={-70} width={80} height={140} rx={8} fill="#d8d0b8" /><rect x={x - 40} y={-70} width={80} height={20} fill="#8a3a2a" /></g>)}</g>],
    [1320, 760, 'SILVER TAPE', <g><circle r={80} fill="#b8bcc0" /><circle r={40} fill="#2a2e32" /><path d="M 70 40 L 180 120 L 150 150 L 50 70 Z" fill="#c8ccd0" /></g>],
  ];
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <ModuleInterior mode="dim" frame={frame} seed={11} />
          <rect width={W} height={H} fill="#000" opacity={0.3} />
          {!built ? items.map(([x, y, label, node], i) => <g key={i} opacity={interpolate(frame, [i * 14, i * 14 + 16], [0, 1], clamp)}>
            <g transform={`translate(${x} ${y + Math.sin(frame / 40 + i) * 8}) rotate(${Math.sin(frame / 60 + i) * 6})`}>{node}</g>
            <text x={x} y={y + 150} textAnchor="middle" fill="#f2c27d" fontFamily={MONO} fontWeight={700} fontSize={28} letterSpacing={3}>{label}</text>
          </g>) : <g transform="translate(960 560)">
            <path d="M -700 -60 C -600 -200 -420 100 -300 -20" stroke="#5a5a5a" strokeWidth={40} fill="none" strokeDasharray="8 5" />
            <g transform={`scale(${breath})`}><path d="M -300 -200 C -100 -260 100 -260 300 -200 L 320 200 C 100 260 -100 260 -320 200 Z" fill="#e8eef2" opacity={0.8} stroke="#b8c4cc" strokeWidth={6} />
              {Array.from({length: 7}, (_, i) => <rect key={i} x={-310 + i * 90} y={-230} width={50} height={470} fill="#c8ccd0" opacity={0.85} />)}</g>
            <rect x={-90} y={-60} width={180} height={140} rx={8} fill="#d8d0b8" /><rect x={-90} y={-60} width={180} height={24} fill="#8a3a2a" />
            <g transform="translate(400 0)"><rect x={-80} y={-80} width={160} height={160} rx={10} fill="#2a2a2a" /><g transform={`rotate(${frame * 25})`}>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} rx={56} ry={14} fill="#6a6a6a" transform={`rotate(${i * 72})`} />)}</g></g>
            <text x={0} y={340} textAnchor="middle" fill="#f2c27d" fontFamily={MONO} fontWeight={700} fontSize={34} letterSpacing={4}>IMPROVISED CO₂ SCRUBBER</text>
          </g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Spacewalk: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase: string = p.phase ?? 'climb';
  const pr = frame / dur;
  const night = phase === 'night' || phase === 'drift' || phase === 'grab';
  if (phase === 'pool') {
    return (
      <AbsoluteFill>
        <Camera dur={dur} from={1.0} to={1.08}>
          <Svg>
            <Sky id="swp" stops={[[0, '#6ac0e8'], [0.5, '#2a7ab8'], [1, '#0a3a6a']]} />
            {Array.from({length: 8}, (_, i) => <polygon key={i} points={`${200 + i * 220},0 ${260 + i * 220},0 ${160 + i * 220 + Math.sin(frame / 40 + i) * 60},1080 ${80 + i * 220 + Math.sin(frame / 40 + i) * 60},1080`} fill="#ffffff" opacity={0.05} />)}
            <rect x={300} y={700} width={1300} height={160} rx={70} fill="#c8ccc8" opacity={0.85} /><rect x={300} y={680} width={1300} height={20} fill="#e0a040" />
            <g transform={`translate(${lerp(820, 900, pr)} 640) rotate(-20) scale(0.75)`}><Astronaut frame={frame} reach={0.6} /></g>
            {Array.from({length: 30}, (_, i) => { const r = rng(i + 3); const k = ((frame * (1 + r()) + r() * 300) % 300) / 300; return <circle key={i} cx={760 + r() * 120 + Math.sin(k * 20) * 10} cy={420 - k * 500} r={3 + r() * 8} fill="none" stroke="#e8f8ff" strokeWidth={2} opacity={1 - k} />; })}
            <rect x={1300} y={120} width={140} height={120} rx={20} fill="#1a2a3a" opacity={0.6} />
            <text x={960} y={950} textAnchor="middle" fill="#e8f8ff" fontFamily="Inter" fontWeight={700} fontSize={30} letterSpacing={6} opacity={0.8}>SPACEWALK TRAINING · 12 M UNDERWATER</text>
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  const drift = phase === 'drift' ? interpolate(frame, [dur * 0.3, dur], [0, 1], clamp) : 0;
  const tetherOpen = phase === 'drift' && frame > dur * 0.55;
  const astroX = phase === 'exit' ? 760 : phase === 'grab' ? 900 : phase === 'climb' ? lerp(600, 1000, pr) : 960 + drift * 160;
  const astroY = phase === 'exit' ? lerp(760, 560, Math.min(1, pr * 1.4)) : 520 + drift * -40;
  return (
    <AbsoluteFill style={{background: SPACE_BG}}>
      <Camera dur={dur} from={1.0} to={phase === 'grab' ? 1.25 : 1.06} origin={phase === 'grab' ? '55% 40%' : '50% 50%'}>
        <Svg>
          <rect width={W} height={H} fill={SPACE_BG} />
          <Stars count={night ? 600 : 200} maxY={H} seed={81} opacity={night ? 1 : 0.5} />
          <Planet view={night ? 'night' : 'day'} seed={14} cy={2400} R={1800} id={`sw${night ? 'n' : 'd'}`} />
          {phase === 'night' && <rect width={W} height={H} fill="#000" opacity={interpolate(frame, [0, 40], [0, 0.3], clamp)} />}
          {/* station hull section */}
          <g>
            <rect x={-100} y={700} width={1400} height={260} rx={120} fill={night ? '#3a424a' : '#e8ecf0'} />
            <rect x={-100} y={860} width={1400} height={100} fill="#000" opacity={0.15} />
            {Array.from({length: 8}, (_, i) => <rect key={i} x={i * 170} y={700} width={12} height={260} fill="#000" opacity={0.12} />)}
            <rect x={-100} y={680} width={1400} height={14} rx={7} fill="#e0a040" opacity={night ? 0.5 : 1} />
            {Array.from({length: 9}, (_, i) => <rect key={i} x={i * 160} y={680} width={10} height={30} fill="#c08030" />)}
            {phase === 'exit' && <><ellipse cx={760} cy={720} rx={140} ry={40} fill="#05070a" /><ellipse cx={760} cy={720} rx={140} ry={40} fill="none" stroke="#8a8c90" strokeWidth={10} /></>}
            <g transform="translate(1340 520)"><rect x={0} y={0} width={420} height={260} fill={night ? '#2a2418' : '#c8a040'} stroke="#5a4418" strokeWidth={4} />{Array.from({length: 6}, (_, i) => <line key={i} x1={0} y1={i * 44} x2={420} y2={i * 44} stroke="#5a4418" strokeWidth={3} />)}<path d="M 0 0 L 60 30 L 20 70 Z" fill="#8a8a8a" /></g>
          </g>
          {/* tether */}
          <path d={tetherOpen ? `M 120 690 C 500 600 ${lerp(1100, 1300, drift)} ${lerp(400, 300, drift)} ${lerp(1340, 1360, drift)} 520` : `M 120 690 C 400 560 ${astroX - 200} ${astroY + 60} ${astroX - 20} ${astroY - 60}`} stroke="#f2f2ee" strokeWidth={5} fill="none" opacity={0.9} />
          <g transform={`translate(${astroX} ${astroY}) rotate(${phase === 'climb' ? -30 + Math.sin(frame / 40) * 4 : phase === 'drift' ? -20 + drift * 40 : phase === 'grab' ? -10 : -5}) scale(${phase === 'grab' ? 0.9 : 0.62})`}>
            <Astronaut frame={frame} reach={phase === 'grab' ? 1 : phase === 'climb' ? 0.5 + 0.3 * Math.sin(frame / 20) : 0.2} light={night} night={night} />
          </g>
          {tetherOpen && <text x={1400} y={300} fill="#ff6a50" fontFamily={MONO} fontWeight={700} fontSize={34} opacity={Math.floor(frame / 10) % 2 ? 1 : 0.3}>TETHER HOOK OPEN</text>}
          {phase === 'climb' && <text x={960} y={960} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={700} fontSize={28} letterSpacing={5} opacity={0.7}>400 KM ABOVE THE EARTH · 28,000 KM/H</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Antenna: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const state: string = p.state ?? 'broken';
  return (
    <AbsoluteFill style={{background: SPACE_BG}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill={SPACE_BG} />
          <Stars count={300} maxY={H} seed={91} />
          <Planet view="day" seed={17} cx={400} cy={2600} R={2000} id="ant" />
          <rect x={-100} y={760} width={2200} height={400} fill="#d8dce0" /><rect x={-100} y={760} width={2200} height={20} fill="#b8bcc0" />
          {Array.from({length: 10}, (_, i) => <circle key={i} cx={100 + i * 200} cy={800} r={8} fill="#8a8c90" />)}
          <g transform="translate(1000 760)">
            <rect x={-60} y={-40} width={120} height={40} fill="#8a8c90" />
            <rect x={-12} y={-320} width={24} height={280} fill="#b8bcc0" />
            <g transform={`translate(0 -330) rotate(${state === 'broken' ? 35 : -10})`}>
              <path d="M -260 -40 Q 0 160 260 -40 Z" fill="#f2f2ee" stroke="#a8acb0" strokeWidth={6} />
              <line x1={0} y1={40} x2={0} y2={-120} stroke="#8a8c90" strokeWidth={8} /><circle cx={0} cy={-124} r={14} fill="#5a5a5a" />
              {state === 'broken' && <path d="M -100 30 L -60 -10 L -20 40 L 30 0" stroke="#3a3a3a" strokeWidth={6} fill="none" />}
            </g>
            {state === 'fixed' && <path d="M 0 -40 C 200 -20 300 60 600 40" stroke="#2a2a2a" strokeWidth={14} fill="none" />}
          </g>
          {state === 'broken' && <g transform="translate(1000 430)"><line x1={-400} y1={60} x2={-200} y2={60} stroke="#ff6a50" strokeWidth={3} /><text x={-700} y={70} fill="#ff8a70" fontFamily={MONO} fontWeight={700} fontSize={28}>BACKUP ANTENNA</text><text x={-700} y={110} fill="#ff8a70" fontFamily={MONO} fontSize={24}>ON THE SEALED LAB MODULE</text></g>}
          {state === 'work' && <g transform={`translate(${780 + Math.sin(frame / 16) * 20} ${560 + Math.cos(frame / 16) * 10})`}>
            <path d="M -400 300 L -40 30" stroke="#f2f2ee" strokeWidth={90} strokeLinecap="round" /><circle cx={-30} cy={20} r={60} fill="#e8e8e0" /><rect x={-60} y={-10} width={60} height={20} rx={6} fill="#2a2a2a" />
            <rect x={0} y={-20} width={180} height={30} rx={8} fill="#8a8c90" transform={`rotate(${Math.sin(frame / 8) * 20} 0 0)`} />
          </g>}
          {state === 'fixed' && <text x={960} y={950} textAnchor="middle" fill="#5aff8a" fontFamily={MONO} fontWeight={700} fontSize={34} letterSpacing={5}>ANTENNA CONNECTED</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const HamRadio: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const speaking = (talk && frame >= talk.from && frame <= talk.to) || p.rx;
  const st = p.static;
  const r = rng(frame * 7 + 3);
  return (
    <AbsoluteFill style={{background: '#06090c'}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <ModuleInterior mode="dim" frame={frame} seed={13} />
          <rect width={W} height={H} fill="#000" opacity={0.5} />
          <g transform={`translate(860 ${560 + Math.sin(frame / 40) * 10}) rotate(${-6 + Math.sin(frame / 70) * 2})`}>
            <rect x={-30} y={-560} width={40} height={300} rx={18} fill="#1a1a1a" />
            <rect x={-170} y={-280} width={340} height={640} rx={40} fill="#2a2a2e" />
            <rect x={-170} y={-280} width={60} height={640} rx={30} fill="#ffffff" opacity={0.05} />
            <rect x={-130} y={-230} width={260} height={130} rx={10} fill="#8aa080" />
            <text x={0} y={-140} textAnchor="middle" fill="#1a2a14" fontFamily={MONO} fontWeight={700} fontSize={58}>{p.freq ?? '145.800'}</text>
            <text x={-116} y={-206} fill="#1a2a14" fontFamily={MONO} fontSize={18}>FM  {speaking ? 'RX ▮▮▮' : 'TX'}</text>
            {Array.from({length: 12}, (_, i) => <rect key={i} x={-120 + (i % 3) * 90} y={-60 + Math.floor(i / 3) * 70} width={60} height={46} rx={10} fill="#3a3a40" />)}
            {Array.from({length: 6}, (_, i) => <rect key={i} x={-110} y={240 + i * 16} width={220} height={6} rx={3} fill="#1a1a1a" />)}
            <rect x={160} y={-200} width={30} height={100} rx={8} fill="#e8c02a" />
            <circle cx={-90} cy={-250} r={10} fill={speaking ? '#5aff8a' : '#ff4a3a'} />
          </g>
          <g transform="translate(1440 540)">
            <rect x={-320} y={-140} width={640} height={280} rx={20} fill="#0a0e12" stroke="#2a3238" strokeWidth={4} />
            {Array.from({length: 60}, (_, i) => { const a = speaking ? Math.abs(Math.sin(frame / 3 + i * 0.6)) * 90 * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.31 + frame / 9))) : 0; const n = st ? r() * 40 : 0; const hgt = Math.max(4, a + n); return <rect key={i} x={-290 + i * 9.7} y={-hgt / 2} width={6} height={hgt} fill={speaking ? '#5aff8a' : '#4a5a64'} opacity={0.9} />; })}
            <text x={-300} y={-100} fill="#8a9aa8" fontFamily={MONO} fontSize={22}>{speaking ? 'SIGNAL' : st ? 'STATIC' : 'NO SIGNAL'}</text>
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const GroundTrack: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const chile = p.phase === 'chile';
  const pr = interpolate(frame, [10, dur * 0.85], [0, 1], clamp);
  const track = (x: number) => 300 - Math.sin((x / 1600) * Math.PI * 2 * 1.5 + 0.9) * 230;
  const dotX = chile ? lerp(220, 520, pr) : lerp(0, 1600, pr);
  return (
    <AbsoluteFill style={{background: '#04070a'}}>
      <Camera dur={dur} from={1.0} to={chile ? 1.4 : 1.06} origin={chile ? '32% 66%' : '50% 50%'}>
        <Svg>
          <rect width={W} height={H} fill="#061018" />
          <g transform="translate(160 200)">
            <rect x={0} y={0} width={1600} height={600} fill="#0a2a44" />
            {Array.from({length: 9}, (_, i) => <line key={i} x1={i * 200} y1={0} x2={i * 200} y2={600} stroke="#1a4a6a" strokeWidth={1} />)}
            {Array.from({length: 4}, (_, i) => <line key={i} x1={0} y1={i * 150 + 75} x2={1600} y2={i * 150 + 75} stroke="#1a4a6a" strokeWidth={1} />)}
            <WorldMap col="#1e5a4a" hi={chile} />
            <path d={`M 0 ${track(0)} ${Array.from({length: 81}, (_, i) => `L ${i * 20} ${track(i * 20)}`).join(' ')}`} stroke="#f2c27d" strokeWidth={4} fill="none" strokeDasharray="12 10" opacity={0.8} />
            <circle cx={dotX} cy={track(dotX)} r={chile ? 70 : 140} fill="#f2c27d" opacity={0.12} />
            <circle cx={dotX} cy={track(dotX)} r={12} fill="#ffffff" /><Glow id="gtd" cx={dotX} cy={track(dotX)} r={40} color="#ffffff" opacity={0.6} />
            {chile && <><circle cx={370} cy={470} r={8} fill="#ff4a3a" /><line x1={370} y1={470} x2={480} y2={500} stroke="#ffffff" strokeWidth={2} /><text x={486} y={508} fill="#ffffff" fontFamily={MONO} fontWeight={700} fontSize={22}>ATACAMA</text><text x={dotX + 20} y={track(dotX) - 20} fill="#ffffff" fontFamily={MONO} fontSize={18}>MERIDIAN · 02:14</text></>}
          </g>
          {!chile && <text x={960} y={900} textAnchor="middle" fill="#8a9aa8" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={4}>RADIO RANGE: ONLY DIRECTLY BELOW · ~10 MIN PER PASS</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const CapsuleSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase: string = p.phase ?? 'approach';
  const pr = frame / dur;
  if (phase === 'crack') {
    const r = rng(frame * 3);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Camera dur={dur} from={1.0} to={1.25} origin="56% 60%">
          <Svg>
            <rect width={W} height={H} fill="#0a0a0a" />
            <ellipse cx={960} cy={600} rx={800} ry={360} fill="#3a3028" />
            {Array.from({length: 30}, (_, i) => <ellipse key={i} cx={300 + (i * 97) % 1300} cy={420 + (i * 53) % 360} rx={40} ry={18} fill="#2a2018" opacity={0.6} />)}
            <path d="M 820 520 L 900 560 L 880 610 L 980 660 L 1020 720 L 1100 740" stroke="#0a0806" strokeWidth={10} fill="none" />
            <path d="M 820 520 L 900 560 L 880 610 L 980 660 L 1020 720 L 1100 740" stroke="#c8a080" strokeWidth={2} fill="none" opacity={0.5} />
            <circle cx={960} cy={630} r={interpolate(frame, [30, 60], [400, 190], clamp)} fill="none" stroke="#ff4a3a" strokeWidth={6} opacity={interpolate(frame, [30, 50], [0, 1], clamp)} />
            {Array.from({length: 160}, (_, i) => <rect key={i} x={r() * W} y={r() * H} width={2} height={2} fill="#fff" opacity={0.2} />)}
            <text x={60} y={80} fill="#e8e8e8" fontFamily={MONO} fontSize={30}>CAM 4 · EMBER · HEAT SHIELD</text>
            <text x={60} y={1030} fill="#ff6a50" fontFamily={MONO} fontWeight={700} fontSize={34} opacity={interpolate(frame, [50, 70], [0, 1], clamp)}>CRACK DETECTED · RE-ENTRY NOT SAFE</text>
            <circle cx={1840} cy={70} r={12} fill="#ff3a2a" opacity={Math.floor(frame / 15) % 2 ? 1 : 0.2} />
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  if (phase === 'chutes' || phase === 'splash') {
    const splash = phase === 'splash';
    const y = splash ? 760 : lerp(640, 760, pr);
    return (
      <AbsoluteFill>
        <Camera dur={dur} from={1.0} to={1.06}>
          <Svg>
            <Sky id={`cs${phase}`} stops={splash ? [[0, '#2a3050'], [0.5, '#a07a80'], [0.8, '#f0b080'], [1, '#f8d8a0']] : [[0, '#1a5aa0'], [1, '#bfe0f8']]} />
            {splash && <Glow id="css" cx={1500} cy={720} r={700} color="#ffb060" opacity={0.6} />}
            <rect x={0} y={splash ? 720 : 960} width={W} height={400} fill={splash ? '#2a4a6a' : '#3a7ab0'} />
            {Array.from({length: 12}, (_, i) => <path key={i} d={`M ${(i * 170 + frame * 2) % 2100 - 100} ${(splash ? 760 : 990) + (i % 4) * 60} q 30 -10 60 0`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.3} />)}
            {!splash && [-1, -0.35, 0.35, 1].map((k, i) => <g key={i}>
              <line x1={960} y1={y - 90} x2={960 + k * 260} y2={y - 400} stroke="#e8e8e0" strokeWidth={3} />
              <path d={`M ${960 + k * 260 - 150} ${y - 400} Q ${960 + k * 260} ${y - 600} ${960 + k * 260 + 150} ${y - 400} Z`} fill={i % 2 ? '#ffffff' : '#f07a2a'} stroke="#c8c8c0" strokeWidth={3} />
            </g>)}
            <g transform={`translate(960 ${y + (splash ? Math.sin(frame / 20) * 6 : 0)}) scale(${splash ? 0.8 : 0.6}) rotate(${splash ? Math.sin(frame / 30) * 4 : 0})`}><g transform="scale(1 1)"><Capsule /></g></g>
            {splash && <>{[0, 1, 2].map((i) => <ellipse key={i} cx={960} cy={860} rx={150 + ((frame + i * 30) % 90) * 6} ry={20 + ((frame + i * 30) % 90)} fill="none" stroke="#ffffff" strokeWidth={3} opacity={1 - ((frame + i * 30) % 90) / 90} />)}
              <path d="M 1500 780 L 1800 780 L 1760 830 L 1540 830 Z" fill="#1a1a1a" /><rect x={1600} y={740} width={80} height={40} fill="#e8e8e0" /></>}
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  const reentry = phase === 'reentry';
  const dock = phase === 'dock';
  const sc = phase === 'approach' ? lerp(0.15, 0.6, pr) : dock ? lerp(0.9, 1.3, pr) : 0.7;
  const [sx, sy] = useShake(reentry ? 0.5 : 0);
  return (
    <AbsoluteFill style={{background: SPACE_BG}}>
      <Camera dur={dur} from={1.0} to={1.05} x={[sx, sx]} y={[sy, sy]}>
        <Svg>
          <rect width={W} height={H} fill={reentry ? '#1a0a06' : SPACE_BG} />
          {!reentry && <Stars count={400} maxY={H} seed={101} />}
          {!reentry && <Planet view="day" seed={23} cy={3200} R={2600} id={`cp${phase}`} />}
          {reentry && <>{Array.from({length: 30}, (_, i) => { const r = rng(i + 1); const k = ((frame * 4 + r() * 200) % 200) / 200; return <line key={i} x1={700 + r() * 500 - k * 600} y1={300 + r() * 400 - k * 500} x2={700 + r() * 500 - k * 600 - 300} y2={300 + r() * 400 - k * 500 - 300} stroke={i % 2 ? '#ffb060' : '#ff6a30'} strokeWidth={4 + r() * 10} opacity={0.6} />; })}
            <Glow id="cre" cx={1060} cy={640} r={600} color="#ff7a30" opacity={0.85} /><Glow id="cre2" cx={1060} cy={640} r={260} color="#fff0c0" opacity={0.9} /></>}
          {dock && <g transform="translate(960 -40)"><rect x={-260} y={0} width={520} height={300} fill="#d8dce0" /><rect x={-90} y={300} width={180} height={60} fill="#a8acb0" /><circle cx={0} cy={360} r={50} fill="#5a5c60" /></g>}
          <g transform={`translate(${reentry ? 1000 : 960} ${dock ? lerp(760, 560, pr) : reentry ? 600 : 520}) rotate(${reentry ? 140 : dock ? 180 : 0}) scale(${sc})`}>
            <Capsule lights={!reentry} frame={frame} />
            {phase === 'approach' && Math.floor(frame / 20) % 3 === 0 && <path d="M 60 -60 L 160 -100" stroke="#ffffff" strokeWidth={10} opacity={0.6} />}
          </g>
          {phase === 'approach' && <text x={960} y={950} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={5} opacity={0.75}>RESCUE CAPSULE "DAWN"</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Atacama: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const pr = frame / dur;
  const issX = lerp(-100, 2000, pr), issY = lerp(500, 120, pr);
  return (
    <AbsoluteFill style={{background: '#01030a'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <AndesNight seed={4} />
          {(p.iss) && <><line x1={issX} y1={issY} x2={issX - 300} y2={issY + 70} stroke="#ffffff" strokeWidth={2} opacity={0.3} /><circle cx={issX} cy={issY} r={6} fill="#ffffff" /><Glow id="aiss" cx={issX} cy={issY} r={40} color="#ffffff" opacity={0.7} /></>}
          {p.bike && <>
            <g transform="translate(1520 560)"><path d="M -60 0 A 60 60 0 0 1 60 0 Z" fill="#c8d0dc" /><rect x={-60} y={0} width={120} height={40} fill="#a8b0bc" /><path d="M 120 10 A 44 44 0 0 1 208 10 Z" fill="#c8d0dc" /><rect x={120} y={10} width={88} height={30} fill="#a8b0bc" /><rect x={-12} y={-56} width={24} height={50} fill="#1a2030" /></g>
            <path d="M 200 1060 C 500 980 400 900 800 860 C 1100 830 1000 720 1300 680 C 1400 660 1450 620 1500 600" stroke="#3a3a4a" strokeWidth={14} fill="none" />
            {(() => { const t = pr; const x = lerp(400, 1250, t), y = lerp(980, 700, t); return <g><circle cx={x} cy={y} r={5} fill="#fff8d0" /><Glow id="abk" cx={x} cy={y} r={60} color="#fff8d0" opacity={0.6} /><polygon points={`${x},${y} ${x + 120},${y - 50} ${x + 120},${y + 10}`} fill="#fff8d0" opacity={0.15} /></g>; })()}
            <text x={1520} y={480} textAnchor="middle" fill="#9fb4e0" fontFamily="Inter" fontWeight={700} fontSize={26} letterSpacing={4}>OBSERVATORY · 11 KM</text>
          </>}
          {(p.house || p.roof) && <g transform="translate(500 880)">
            <rect x={-200} y={-140} width={400} height={180} fill="#3a2a22" /><rect x={-210} y={-150} width={420} height={18} fill="#5a3a2a" />
            <rect x={-60} y={-90} width={60} height={60} fill="#f2b66d" opacity={0.8} /><Glow id="ahw" cx={-30} cy={-60} r={120} color="#f2b66d" opacity={0.4} />
            <line x1={150} y1={-150} x2={150} y2={-460} stroke="#1a1a1a" strokeWidth={6} />{[0, 1, 2].map((i) => <line key={i} x1={100 + i * 14} y1={-420 + i * 28} x2={200 - i * 14} y2={-420 + i * 28} stroke="#1a1a1a" strokeWidth={5} />)}
            <g transform="translate(-60 -150) scale(0.18)"><rect x={-60} y={-380} width={120} height={300} rx={40} fill="#5a1a14" /><circle cx={0} cy={-440} r={50} fill="#1a1210" /></g>
            <circle cx={-20} cy={-176} r={5} fill="#5aff8a" opacity={0.6 + 0.4 * Math.sin(frame / 5)} />
            {p.roof && <g transform="translate(40 -150) scale(0.22)"><NoahStandBack outfit="out" /></g>}
            {p.roof && <path d={`M -54 -210 L ${-80 + Math.sin(frame / 6) * 14} -260`} stroke="#5a1a14" strokeWidth={8} strokeLinecap="round" />}
          </g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
