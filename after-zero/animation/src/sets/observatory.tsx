import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Camera, clamp, Glow, H, lerp, rng, Sky, Skyline, Svg, useProgress, W} from '../lib';
import {NoahProfile, NoahStandBack} from '../noah';
import {camFor, mouth, SetProps, SKY} from './common';

/* ------------------------------------------------------------ profile */
const PROFILE_BG: Record<string, {sky: [number, string][]; win: string; city: string; rim: string; glow: string; wall?: boolean; dunes?: boolean}> = {
  dawn: {sky: [[0, '#121b21'], [0.5, '#25363c'], [1, '#3b4a4a']], win: '#d9a46a', city: '#8a6a4f', rim: C.amber, glow: C.gold},
  day: {sky: [[0, '#1c262b'], [1, '#34444a']], win: '#c9d3cc', city: '#7d8f8f', rim: '#e8e2d0', glow: '#f2f0e4'},
  dusk: {sky: [[0, '#14151c'], [1, '#2e2a33']], win: '#d98a55', city: '#6b4a40', rim: '#e2914f', glow: '#e2914f'},
  night: {sky: [[0, '#05080b'], [1, '#0c141a']], win: '#16232c', city: '#070b0e', rim: '#9fc0d0', glow: '#9fc0d0'},
  tv: {sky: [[0, '#05080b'], [1, '#0b1216']], win: '#0e161b', city: '#05080a', rim: '#bcd4e6', glow: '#bcd4e6'},
  monitor: {sky: [[0, '#060a0d'], [1, '#0d1519']], win: '#0b1a20', city: '#06090b', rim: '#7fd0e0', glow: '#7fd0e0'},
  store: {sky: [[0, '#07090b'], [1, '#101417']], win: '#1a1416', city: '#0a0c0e', rim: '#ff6a50', glow: '#ff4a3a'},
  bunker: {sky: [[0, '#14110e'], [1, '#26221c']], win: '#3a3228', city: '#2a241e', rim: '#f2c27d', glow: '#f2c27d', wall: true},
  flash: {sky: [[0, '#050607'], [1, '#0d1012']], win: '#1a1e20', city: '#0d1012', rim: '#dfe8ec', glow: '#dfe8ec', wall: true},
  dark: {sky: [[0, '#020303'], [1, '#060708']], win: '#08090a', city: '#050606', rim: '#9fb0b8', glow: '#9fb0b8', wall: true},
  arctic: {sky: [[0, '#5d8396'], [1, '#a9c3cc']], win: '#e8f0f2', city: '#b8ccd4', rim: '#ffffff', glow: '#fff6e0', wall: true},
  plane: {sky: [[0, '#2a3033'], [1, '#3a4246']], win: '#dce8ec', city: '#b8ccd4', rim: '#ffffff', glow: '#e8f4ff', wall: true},
  storm: {sky: [[0, '#8a98a0'], [1, '#c8d0d2']], win: '#eef2f4', city: '#d8e0e2', rim: '#ffffff', glow: '#ffffff', wall: true},
  stove: {sky: [[0, '#0c0a08'], [1, '#1a1410']], win: '#2a1e14', city: '#1a1410', rim: '#f29a4a', glow: '#f29a4a', wall: true},
  aurora: {sky: [[0, '#02050a'], [1, '#08121c']], win: '#0a2a1e', city: '#06120e', rim: '#5af0a0', glow: '#3ad08a', wall: true},
  flare: {sky: [[0, '#140806'], [1, '#2a100c']], win: '#3a1410', city: '#2a0e0a', rim: '#ff6a50', glow: '#ff4a3a', wall: true},
  station: {sky: [[0, '#0e1620'], [1, '#1c2630']], win: '#1c2630', city: '#141c22', rim: '#dfe8ec', glow: '#cfe6f2', wall: true},
  heli: {sky: [[0, '#05080a'], [1, '#0c1014']], win: '#0a1820', city: '#06090b', rim: '#9fe0ff', glow: '#9fe0ff', wall: true},
  river: {sky: [[0, '#6aa0b0'], [1, '#b8d0c8']], win: '#8a6a44', city: '#265a2a', rim: '#fff6d0', glow: '#fff6d0'},
  jungle: {sky: [[0, '#163a1a'], [1, '#265a2a']], win: '#3f7a3e', city: '#163a1a', rim: '#e8f0a0', glow: '#d8f080', wall: true},
  jungleNight: {sky: [[0, '#020604'], [1, '#06120a']], win: '#0a1a10', city: '#030806', rim: '#a0d0a0', glow: '#80c080', wall: true},
  canopy: {sky: [[0, '#6aa0b0'], [1, '#e0e8d8']], win: '#6a9a5a', city: '#3f7a3e', rim: '#ffffff', glow: '#fff6e0'},
  fever: {sky: [[0, '#2a0e08'], [1, '#4a1a10']], win: '#6a2a14', city: '#3a1408', rim: '#ff8a50', glow: '#ff6a30', wall: true},
  village: {sky: [[0, '#1a2030'], [1, '#5a4050']], win: '#e8a050', city: '#3a442a', rim: '#f0a050', glow: '#f0a050'},
  raft: {sky: [[0, '#e0703a'], [1, '#c85a2a']], win: '#7ab8e0', city: '#1a6aa0', rim: '#fff6e0', glow: '#fff6e0', wall: true},
  boatNight: {sky: [[0, '#01030a'], [1, '#06101e']], win: '#0a1828', city: '#06121e', rim: '#cfe0f0', glow: '#f2c27d'},
  biolum: {sky: [[0, '#01030a'], [1, '#02080c']], win: '#04201e', city: '#010608', rim: '#5af0e0', glow: '#5af0e0', wall: true},
  lagoon: {sky: [[0, '#2a6ab0'], [1, '#d0ecf8']], win: '#30c0c8', city: '#2a8a3a', rim: '#ffffff', glow: '#fff6e0'},
  desert: {sky: [[0, '#e8b070'], [1, '#c88a50']], win: '#f4dcae', city: '#d8a868', rim: '#fff6e0', glow: '#fff6e0', dunes: true},
  heat: {sky: [[0, '#f0d8a8'], [1, '#e0b474']], win: '#fff4dc', city: '#ecca92', rim: '#ffffff', glow: '#fff8e8', dunes: true},
  desertNight: {sky: [[0, '#02040c'], [1, '#0a1424']], win: '#141e30', city: '#191e2a', rim: '#9fb4e0', glow: '#9fb4e0', dunes: true},
  sandstorm: {sky: [[0, '#2a1a0e'], [1, '#4a3018']], win: '#7a5a3a', city: '#3a2614', rim: '#e0b080', glow: '#c08a52', wall: true},
  surface: {sky: [[0, '#6a8486'], [1, '#d2925a']], win: '#ffd59a', city: '#2c4a3a', rim: '#fff1d6', glow: '#ffd59a'},
};

export const Profile: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const bg = PROFILE_BG[p.time ?? 'dawn'] ?? PROFILE_BG.dawn;
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 23) % 110, [70, 74, 78], [0, 1, 0], clamp);
  const look = interpolate(frame, [30, 70], [0, seed % 2 ? 1 : -0.5], clamp);
  const breath = Math.sin(frame / 26) * 3;
  const smile = p.smile ? interpolate(frame, [dur * 0.4, dur * 0.8], [0, 1], clamp) : 0;
  const cam = camFor(seed + 20, 0.7);
  const flick = p.time === 'tv' ? 0.75 + 0.25 * Math.sin(frame / 2.3) : p.time === 'store' ? 0.6 + 0.4 * (Math.floor(frame / 12) % 2) : 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x} origin="40% 45%">
        <Svg>
          <Sky id="pf" stops={bg.sky} />
          <g opacity={0.9} filter="url(#pfb)">
            <defs><filter id="pfb"><feGaussianBlur stdDeviation="10" /></filter></defs>
            <rect x={1050} y={0} width={900} height={H} fill={bg.win} />
            {bg.wall ? <>{Array.from({length: 6}, (_, i) => <rect key={i} x={1050} y={i * 190} width={900} height={8} fill={bg.city} />)}</>
              : bg.dunes ? <>{[0, 1, 2].map((k) => <path key={k} d={`M 1050 ${H} L 1050 ${520 + k * 150} ${Array.from({length: 12}, (_, i) => `Q ${1090 + i * 80} ${470 + k * 150 - (i % 2) * 70} ${1130 + i * 80} ${520 + k * 150}`).join(' ')} L 2000 ${H} Z`} fill={bg.city} opacity={0.6 + k * 0.2} />)}</>
              : <Skyline seed={88 + seed} baseY={1000} minH={200} maxH={700} color={bg.city} minW={60} maxW={140} x0={1050} x1={2000} />}
          </g>
          <Glow id="pfg" cx={1500} cy={400} r={900} color={bg.glow} opacity={0.35 * flick} />
          <rect x={1030} y={0} width={30} height={H} fill="#0e1418" />
          <g transform={`translate(600 ${150 + breath}) scale(1.25)`}>
            <NoahProfile blink={blink} look={look} outfit={p.outfit ?? 'home'} smile={smile} rim={bg.rim} rimOpacity={0.9 * flick} talk={mouth(frame, talk, 'NOAH')} beard={p.beard ?? 0} frost={p.frost ?? 0} />
          </g>
          <polygon points="1100,0 1180,0 980,1080 900,1080" fill="#fff" opacity={0.04} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ aerial city */
const IsoCity: React.FC<{seed: number; night?: boolean}> = ({seed, night}) => {
  const r = rng(seed);
  const tiles: React.ReactNode[] = [];
  const tw = 120, th = 60;
  for (let gy = 0; gy < 22; gy++) {
    for (let gx = 0; gx < 22; gx++) {
      if (gx % 3 === 2 || gy % 3 === 2) continue;
      const x = 960 + (gx - gy) * (tw / 2);
      const y = -80 + (gx + gy) * (th / 2);
      const hgt = 16 + Math.pow(r(), 3) * 200;
      const top = `${x},${y - hgt} ${x + tw / 2},${y - hgt + th / 2} ${x},${y - hgt + th} ${x - tw / 2},${y - hgt + th / 2}`;
      const left = `${x - tw / 2},${y - hgt + th / 2} ${x},${y - hgt + th} ${x},${y + th} ${x - tw / 2},${y + th / 2}`;
      const right = `${x + tw / 2},${y - hgt + th / 2} ${x},${y - hgt + th} ${x},${y + th} ${x + tw / 2},${y + th / 2}`;
      tiles.push(
        <g key={`${gx}-${gy}`}>
          <polygon points={left} fill={night ? '#0c151b' : '#1b2a33'} />
          <polygon points={right} fill={night ? '#16232b' : '#2f4650'} />
          <polygon points={top} fill={night ? '#22343d' : '#4d6a73'} />
          <polygon points={right} fill={C.amber} opacity={0.18} />
        </g>,
      );
    }
  }
  return <g transform="scale(1.2) translate(-160 -40)">{tiles}</g>;
};

export const Aerial: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const dawn = p.time === 'dawn';
  const dimAt = p.impact ? Math.round(dur * p.impact) : -999;
  const dim = p.impact ? interpolate(frame, [dimAt - 2, dimAt + 2, dimAt + 40], [0, 0.55, 0.25], clamp) : 0;
  const cam = camFor(seed + 40, 1);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#0c151a" />
          <IsoCity seed={404 + seed} />
          <Glow id="ag" cx={1700} cy={-50} r={1100} color={dawn ? '#f2b66d' : C.gold} opacity={dawn ? 0.65 : 0.45} />
          <Fog2 y={250} h={260} />
          <Fog2 y={700} h={300} />
        </Svg>
      </Camera>
      {dawn && <AbsoluteFill style={{background: 'linear-gradient(200deg, rgba(242,182,109,0.35), rgba(0,0,0,0) 60%)'}} />}
      <AbsoluteFill style={{background: '#000', opacity: dim}} />
    </AbsoluteFill>
  );
};

const Fog2: React.FC<{y: number; h: number}> = ({y, h}) => {
  const frame = useCurrentFrame();
  return <g opacity={0.3}>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 600 + frame * 0.8) % 2600) - 300} cy={y + h / 2} rx={500} ry={h * 0.35} fill="#c9d4d2" filter="url(#fgb)" />)}
    <defs><filter id="fgb" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="40" /></filter></defs></g>;
};

/* -------------------------------------------------- observatory interior */
export const ObsInt: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 60, 0.8);
  const fl = p.flicker ? (rng(Math.floor(frame / 3))() > 0.3 ? 1 : 0.25) : 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#0b1115" />
          {/* dome ribs */}
          {Array.from({length: 9}, (_, i) => <path key={i} d={`M ${-200 + i * 290} ${H} Q 960 -500 ${W + 200 - i * 290} ${H}`} stroke="#1a252b" strokeWidth={6} fill="none" opacity={0.7} />)}
          <path d="M 860 0 L 1060 0 L 1010 300 L 910 300 Z" fill="#0e1a22" />
          <Stars2 />
          {/* telescope */}
          <g transform="translate(1250 600) rotate(-35)"><rect x={-60} y={-420} width={120} height={520} rx={30} fill="#3a464b" /><rect x={-70} y={-440} width={140} height={60} rx={14} fill="#4d5a60" /></g>
          <rect x={1200} y={600} width={100} height={260} fill="#2a3338" />
          {/* desk with screens */}
          <rect x={120} y={720} width={1000} height={30} fill="#232b30" />
          {[0, 1, 2, 3].map((i) => {
            const on = i === 1 || (p.flicker && i === 2);
            return <g key={i}>
              <rect x={150 + i * 240} y={520} width={210} height={150} rx={8} fill="#05080a" stroke="#1d2529" strokeWidth={6} />
              {on && <rect x={160 + i * 240} y={530} width={190} height={130} fill="#123038" opacity={fl} />}
              {on && Array.from({length: 6}, (_, k) => <rect key={k} x={172 + i * 240} y={546 + k * 18} width={40 + ((k * 53) % 120)} height={6} fill="#7fd0e0" opacity={0.6 * fl} />)}
              <rect x={245 + i * 240} y={670} width={20} height={50} fill="#1d2529" />
            </g>;
          })}
          <Glow id="oig" cx={500} cy={600} r={500} color="#7fd0e0" opacity={0.18 * fl} />
          {/* chair with coat, cups, notes */}
          <path d="M 520 900 L 520 780 C 520 760 600 760 600 780 L 600 900 Z" fill="#14191c" />
          <path d="M 530 770 C 560 740 600 760 610 800 L 600 880 L 540 880 Z" fill="#c9c3b6" opacity={0.85} />
          <rect x={860} y={700} width={30} height={22} fill="#c9b79c" />
          {Array.from({length: 5}, (_, i) => <rect key={i} x={300 + i * 50} y={705} width={40} height={14} fill="#d8cfb5" transform={`rotate(${i * 7 - 10} ${320 + i * 50} 712)`} />)}
          <rect x={0} y={900} width={W} height={180} fill="#0e1418" />
          {p.noah && <g transform="translate(960 960) scale(0.75)"><NoahStandBack /></g>}
        </Svg>
      </Camera>
      {p.flicker && <AbsoluteFill style={{background: '#000', opacity: (1 - fl) * 0.6}} />}
    </AbsoluteFill>
  );
};

const Stars2: React.FC = () => {
  const r = rng(5);
  return <g>{Array.from({length: 30}, (_, i) => <circle key={i} cx={880 + r() * 160} cy={r() * 280} r={1 + r()} fill="#cfe0ea" opacity={0.6} />)}</g>;
};

/* ------------------------------------------------- monitor + Dr. Carter */
export const Carter: React.FC<{talk: number; blink: number}> = ({talk, blink}) => (
  <g>
    <path d="M -230 330 C -220 200 -120 150 0 150 C 120 150 220 200 230 330 Z" fill="#e8e6e0" />
    <path d="M -60 150 L 0 250 L 60 150 Z" fill="#5a6f78" />
    <path d="M -40 150 L -40 90 L 40 90 L 40 150 Z" fill="#b98a6e" />
    <path d="M -150 -40 C -170 -170 -80 -230 0 -228 C 90 -230 170 -170 150 -40 C 150 20 130 60 110 70 L -110 70 C -130 60 -150 20 -150 -40 Z" fill="#2a1d18" />
    <ellipse cx={0} cy={-30} rx={108} ry={128} fill="#d1a083" />
    <path d="M -110 -60 C -100 -170 100 -170 110 -60 C 80 -120 -40 -140 -110 -60 Z" fill="#2a1d18" />
    <circle cx={0} cy={-200} r={44} fill="#2a1d18" />
    {/* glasses */}
    <rect x={-84} y={-58} width={66} height={44} rx={12} fill="none" stroke="#1b1b1b" strokeWidth={5} />
    <rect x={18} y={-58} width={66} height={44} rx={12} fill="none" stroke="#1b1b1b" strokeWidth={5} />
    <line x1={-18} y1={-40} x2={18} y2={-40} stroke="#1b1b1b" strokeWidth={5} />
    <g transform={`translate(0 -36) scale(1 ${Math.max(0.1, 1 - blink)})`}>
      <ellipse cx={-50} cy={0} rx={12} ry={8} fill="#f1ece4" /><circle cx={-50} cy={0} r={6} fill="#3a2a20" />
      <ellipse cx={50} cy={0} rx={12} ry={8} fill="#f1ece4" /><circle cx={50} cy={0} r={6} fill="#3a2a20" />
    </g>
    <path d="M -76 -78 C -60 -86 -36 -86 -24 -80 M 24 -80 C 36 -86 60 -86 76 -78" stroke="#2a1d18" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M -6 -10 L -12 26 L 6 28" stroke="#a87458" strokeWidth={4} fill="none" />
    {talk > 0.05 ? <ellipse cx={0} cy={56} rx={20} ry={3 + talk * 12} fill="#5a2a24" /> : <path d="M -22 56 C -8 60 8 60 22 56" stroke="#8a4a3a" strokeWidth={5} fill="none" strokeLinecap="round" />}
    <path d="M -86 20 C -80 50 -60 70 -40 80" stroke="#b07a60" strokeWidth={3} fill="none" opacity={0.5} />
    {/* tired eyes */}
    <path d="M -76 -12 C -64 -4 -40 -4 -28 -12 M 28 -12 C 40 -4 64 -4 76 -12" stroke="#9a6a54" strokeWidth={3} fill="none" opacity={0.7} />
    <rect x={100} y={210} width={70} height={14} fill="#5a6f78" />
  </g>
);

export const Monitor: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? 'play';
  const close = !!p.close;
  const seed = p.seed ?? 1;
  const glitchMode = mode === 'glitch' || (p.glitch && frame > dur - 30);
  const blackAt = mode === 'glitch' ? Math.round(dur * 0.7) : 1e9;
  const r = rng(Math.floor(frame / 2) + seed);
  const blink = interpolate((frame + seed * 17) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const pressed = p.press ? frame > dur * 0.6 : false;
  const scan = (frame * 3) % 400;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={close ? 1.25 : 1.0} to={close ? 1.35 : 1.1} origin="50% 46%">
        <Svg>
          <rect width={W} height={H} fill="#06090b" />
          <Glow id="mg" cx={960} cy={480} r={900} color="#7fd0e0" opacity={frame < blackAt ? 0.18 : 0} />
          <rect x={360} y={120} width={1200} height={720} rx={24} fill="#020304" stroke="#1d2529" strokeWidth={14} />
          <rect x={900} y={840} width={120} height={80} fill="#1d2529" /><rect x={760} y={910} width={400} height={24} rx={8} fill="#1d2529" />
          <defs><clipPath id="mc"><rect x={380} y={140} width={1160} height={680} /></clipPath></defs>
          <g clipPath="url(#mc)">
            {frame < blackAt && <>
              <rect x={380} y={140} width={1160} height={680} fill={mode === 'carter' || mode === 'glitch' ? '#2b3a40' : '#0d1a20'} />
              {(mode === 'play') && <>
                <text x={960} y={420} textAnchor="middle" fill="#7fd0e0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={64} opacity={Math.floor(frame / 15) % 2 ? 1 : 0.3}>● RECORDING</text>
                <text x={960} y={500} textAnchor="middle" fill="#5a8a96" fontFamily="DejaVu Sans Mono" fontSize={30}>{seed === 2 ? 'LOG_0817_FINAL.MOV' : 'LOG_0814_CARTER.MOV'}</text>
                <polygon points="930,560 930,640 1000,600" fill={pressed ? '#ffffff' : '#7fd0e0'} />
              </>}
              {(mode === 'carter' || mode === 'glitch') && <>
                <rect x={380} y={140} width={1160} height={680} fill="#33454b" />
                <rect x={420} y={180} width={340} height={260} fill="#26363c" />
                {Array.from({length: 5}, (_, i) => <rect key={i} x={440} y={200 + i * 44} width={300} height={8} fill="#5a7880" />)}
                <rect x={1200} y={160} width={300} height={500} fill="#2a3a40" />
                <g transform="translate(960 520)"><Carter talk={mouth(frame, talk, 'CARTER')} blink={blink} /></g>
                <text x={410} y={790} fill="#c0553f" fontFamily="DejaVu Sans Mono" fontSize={28}>● REC</text>
                <text x={1510} y={790} textAnchor="end" fill="#cfe0ea" fontFamily="DejaVu Sans Mono" fontSize={28}>{seed >= 3 ? '08:14:52' : '06:02:11'} </text>
              </>}
              <rect x={380} y={140 + scan} width={1160} height={60} fill="#fff" opacity={0.03} />
              {Array.from({length: 120}, (_, i) => <rect key={i} x={380} y={140 + i * 6} width={1160} height={2} fill="#000" opacity={0.12} />)}
              {glitchMode && Array.from({length: 14}, (_, i) => <rect key={i} x={380 + r() * 900} y={140 + r() * 640} width={100 + r() * 400} height={6 + r() * 40} fill={r() > 0.5 ? '#7fd0e0' : '#c0553f'} opacity={0.6} transform={`translate(${(r() - 0.5) * 60} 0)`} />)}
            </>}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- data screens */
export const DataScreen: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const kind = p.kind ?? 'text';
  const r = rng(99);
  const typed = (s: string, start: number) => s.slice(0, Math.max(0, Math.floor((frame - start) / 1.6)));
  return (
    <AbsoluteFill style={{background: '#04080a'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <rect width={W} height={H} fill="#061015" />
          {Array.from({length: 40}, (_, i) => <line key={i} x1={0} y1={i * 28} x2={W} y2={i * 28} stroke="#0c1c22" strokeWidth={1} />)}
          {Array.from({length: 70}, (_, i) => <line key={i} x1={i * 28} y1={0} x2={i * 28} y2={H} stroke="#0c1c22" strokeWidth={1} />)}
          <text x={120} y={150} fill="#5a8a96" fontFamily="DejaVu Sans Mono" fontSize={28}>HOLLIS OBSERVATORY · RADIO ARRAY · ARCHIVE</text>
          {kind === 'spike' && <>
            <polyline points={Array.from({length: 300}, (_, i) => {
              const x = 120 + i * 5.6, sp = Math.abs(i - 200) < 3 ? -380 : 0;
              const vis = i < frame * 4;
              return vis ? `${x},${640 + (r() - 0.5) * 30 + sp}` : '';
            }).filter(Boolean).join(' ')} stroke="#7fd0e0" strokeWidth={3} fill="none" />
            {frame * 4 > 200 && <><line x1={1240} y1={200} x2={1240} y2={900} stroke="#c0553f" strokeWidth={2} strokeDasharray="10 8" />
              <text x={1260} y={240} fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={44}>08:17:00</text>
              <text x={1260} y={290} fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontSize={26}>GLOBAL EM DISTURBANCE</text></>}
          </>}
          {kind === 'world' && <>
            {Array.from({length: 520}, (_, i) => {
              const x = 160 + r() * 1600, y = 260 + r() * 640;
              const land = Math.sin(x / 140) + Math.cos(y / 90) + Math.sin((x + y) / 210) > 0.4;
              if (!land) return null;
              const off = r() * dur * 0.8;
              return <circle key={i} cx={x} cy={y} r={3} fill="#f2b66d" opacity={frame < off ? 0.9 : 0.06} />;
            })}
            <text x={120} y={980} fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontSize={32}>ACTIVE HUMAN SIGNALS: {Math.max(0, Math.round(8.1e9 * (1 - frame / (dur * 0.8)))).toLocaleString('en-US')}</text>
          </>}
          {kind === 'wave' && <>
            {[0, 1, 2].map((k) => <polyline key={k} points={Array.from({length: 320}, (_, i) => `${120 + i * 5.3},${420 + k * 180 + Math.sin(i / 6 + frame / 6 + k) * 30 * (i % 40 < 8 ? 2.4 : 0.6)}`).join(' ')} stroke={['#7fd0e0', '#5a8a96', '#f2b66d'][k]} strokeWidth={3} fill="none" />)}
            <text x={120} y={980} fill="#7fd0e0" fontFamily="DejaVu Sans Mono" fontSize={30}>REPEATING PATTERN · PERIOD 8.17 s · ORIGIN: ???</text>
          </>}
          {kind === 'text' && <>
            <text x={960} y={p.text2 ? 470 : 560} textAnchor="middle" fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={p.text && p.text.length > 26 ? 64 : 80}>{typed(p.text ?? '', 6)}{frame % 30 < 15 && !p.text2 ? '█' : ''}</text>
            {p.text2 && <text x={960} y={620} textAnchor="middle" fill="#7fd0e0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={72}>{p.seed === 2 ? p.text2 : typed(p.text2, 14)}{frame % 30 < 15 ? '█' : ''}</text>}
          </>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- pinboard */
export const Pinboard: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const r = rng(31);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.note ? 1.0 : 1.0} to={p.note ? 1.6 : 1.1} x={p.note ? [0, -260] : [40, -40]} y={p.note ? [0, -120] : [0, 0]} origin="60% 50%">
        <Svg>
          <rect width={W} height={H} fill="#3a2e24" />
          {Array.from({length: 16}, (_, i) => {
            const x = 140 + (i % 6) * 280 + r() * 40, y = 120 + Math.floor(i / 6) * 300 + r() * 40, rot = (r() - 0.5) * 10;
            return (
              <g key={i} transform={`rotate(${rot} ${x + 110} ${y + 80})`}>
                <rect x={x} y={y} width={220} height={160} fill="#0c1116" />
                {Array.from({length: 30}, (_, k) => <circle key={k} cx={x + r() * 220} cy={y + r() * 160} r={0.8 + r() * 1.6} fill="#e8eef2" opacity={0.8} />)}
                <circle cx={x + 110} cy={y + 80} r={30 + r() * 20} fill="none" stroke="#c0553f" strokeWidth={4} />
                <circle cx={x + 110} cy={y - 6} r={8} fill="#c0553f" />
              </g>
            );
          })}
          <g transform="translate(1180 640) rotate(3)">
            <rect x={0} y={0} width={480} height={260} fill="#e8e0c8" />
            <text x={30} y={70} fill="#2a2a2a" fontFamily="Liberation Serif" fontStyle="italic" fontSize={34}>{(p.lines ?? ['The pattern is not natural.'])[0]}</text>
            <text x={30} y={140} fill="#2a2a2a" fontFamily="Liberation Serif" fontStyle="italic" fontSize={34}>{(p.lines ?? ['', 'Someone is counting down.'])[1]}</text>
            {[0, 1, 2].map((k) => <line key={k} x1={30} y1={156 + k * 10} x2={30 + 420 * interpolate(frame, [30 + k * 10, 50 + k * 10], [0, 1], clamp)} y2={156 + k * 10} stroke="#c0553f" strokeWidth={3} />)}
            <text x={30} y={220} fill="#6b3b35" fontFamily="Liberation Serif" fontSize={24}>— E.C.</text>
          </g>
          <polyline points="420,240 700,520 980,300 1280,700" stroke="#c0553f" strokeWidth={3} fill="none" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------ all screens */
export const ScreensAll: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const on = (i: number) => frame > 6 + (i % 7) * 2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill="#030507" />
          <Glow id="sag" cx={960} cy={540} r={1000} color="#ff7a5a" opacity={p.text ? 0.2 : 0.1} />
          {Array.from({length: 4}, (_, row) => Array.from({length: 6}, (_, c) => {
            const i = row * 6 + c;
            const x = 90 + c * 300, y = 100 + row * 230;
            return <g key={i}>
              <rect x={x} y={y} width={260} height={180} rx={8} fill="#020304" stroke="#1d2529" strokeWidth={6} />
              {on(i) && <rect x={x + 8} y={y + 8} width={244} height={164} fill="#1a0e0c" />}
              {on(i) && p.text && <>
                <text x={x + 130} y={y + 82} textAnchor="middle" fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={19}>HUMANITY:</text>
                <text x={x + 130} y={y + 112} textAnchor="middle" fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={15}>TEMPORARILY DISCONNECTED</text>
              </>}
            </g>;
          }))}
          <g transform="translate(960 1180) scale(1.1)"><NoahStandBack /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- black */
export const Black: React.FC<SetProps> = ({p}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {p.led && <Svg><circle cx={960} cy={540} r={10} fill="#ff4a3a" opacity={0.6 + 0.4 * Math.sin(frame / 5)} /><Glow id="bl" cx={960} cy={540} r={140} color="#ff4a3a" opacity={0.35} /></Svg>}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- chapter cards */
export const Chapter: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 14, dur - 14, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#06090c', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'Inter Display, Inter', opacity: a}}>
      <div style={{color: C.ice, fontSize: 30, letterSpacing: 14, fontWeight: 400}}>CHAPTER {p.num}</div>
      <div style={{width: interpolate(frame, [6, 30], [0, 220], clamp), height: 3, background: C.amber, margin: '28px 0'}} />
      <div style={{color: C.mist, fontSize: 84, letterSpacing: 10, fontWeight: 800, transform: `translateY(${(1 - a) * 12}px)`}}>{p.title}</div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ end card */
export const EndCard: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const t = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#06090c'}}>
      <Svg>
        <Sky id="ec" stops={SKY.dawn} />
      </Svg>
      <AbsoluteFill style={{background: 'rgba(6,9,12,0.82)'}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'Inter Display, Inter'}}>
        <div style={{fontWeight: 900, fontSize: p.question ? 110 : 180, color: C.mist, letterSpacing: 22, opacity: p.question ? 1 : t(0, 24)}}>AFTER ZERO</div>
        <div style={{width: 300, height: 4, background: C.amber, margin: '24px 0 28px'}} />
        <div style={{color: C.ice, fontSize: 30, letterSpacing: 8, fontWeight: 300, opacity: p.question ? 1 : t(20, 40)}}>WHEN EVERYTHING ENDS, THE STORY BEGINS.</div>
        {p.question && <div style={{color: C.amber, fontSize: 54, fontWeight: 700, marginTop: 90, opacity: t(0, 20), textAlign: 'center', lineHeight: 1.3}}>
          {p.q ? <span dangerouslySetInnerHTML={{__html: p.q}} /> : <>What would <i>you</i> do<br />if you were the last human on Earth?</>}</div>}
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', color: '#8f9692', fontFamily: 'Inter', fontSize: 24}}>
        A fictional story. Any resemblance to real events is coincidental.</div>
    </AbsoluteFill>
  );
};
