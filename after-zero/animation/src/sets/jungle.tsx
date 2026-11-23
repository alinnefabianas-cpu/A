import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Birds, C, Camera, clamp, Dust, Fog, Glow, H, lerp, Rays, rng, Sky, Svg, useProgress, W} from '../lib';
import {NoahLying, NoahSitting, NoahStandBack, NoahWalk} from '../noah';
import {camFor, mouth, Rain, SetProps, Stars} from './common';

type T = 'dawn' | 'day' | 'dusk' | 'night' | 'storm';
const JSKY: Record<T, [number, string][]> = {
  dawn: [[0, '#2a3a4a'], [0.5, '#9a8a7a'], [0.8, '#e8b080'], [1, '#f0c890']],
  day: [[0, '#6aa0b0'], [0.6, '#b8d0c8'], [1, '#e0e8d8']],
  dusk: [[0, '#1a2030'], [0.4, '#5a4050'], [0.7, '#d07040'], [1, '#e8a050']],
  night: [[0, '#02060a'], [0.7, '#06120e'], [1, '#0a1a14']],
  storm: [[0, '#2a3430'], [0.6, '#4a5a52'], [1, '#6a7a70']],
};
const GREEN: Record<T, string[]> = {
  dawn: ['#5a7a5a', '#3a5a3e', '#24402a', '#14281a'],
  day: ['#6a9a5a', '#3f7a3e', '#265a2a', '#163a1a'],
  dusk: ['#5a5a40', '#3a442a', '#24301c', '#141c10'],
  night: ['#0e1e16', '#0a1610', '#06100a', '#030806'],
  storm: ['#4a5e4a', '#33483a', '#22342a', '#14221a'],
};

const useShake = (amt: number) => {
  const frame = useCurrentFrame();
  const r = rng(frame * 17 + 3);
  return amt ? [(r() - 0.5) * 34 * amt, (r() - 0.5) * 24 * amt] : [0, 0];
};

/** big tropical leaf */
const Leaf: React.FC<{x: number; y: number; s: number; rot: number; col: string; sway?: number}> = ({x, y, s, rot, col, sway = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot + sway}) scale(${s})`}>
    <path d="M 0 0 C 40 -60 140 -80 220 -20 C 140 30 40 30 0 0 Z" fill={col} />
    <path d="M 0 0 L 210 -20" stroke="#000" strokeOpacity={0.18} strokeWidth={3} />
  </g>
);

/** one layer of jungle: trunks + vines + leaf clusters */
const JungleLayer: React.FC<{seed: number; col: string; trunkCol: string; y0: number; density: number; scale: number; dx: number; sway: number}> = ({seed, col, trunkCol, y0, density, scale, dx, sway}) => {
  const r = rng(seed);
  const items: React.ReactNode[] = [];
  const n = Math.round(8 * density);
  for (let i = 0; i < n; i++) {
    const x = r() * (W + 600) - 300 + dx;
    const w = (30 + r() * 70) * scale;
    items.push(<rect key={`t${i}`} x={x} y={-100} width={w} height={H + 200} fill={trunkCol} />);
    if (r() < 0.5) items.push(<path key={`v${i}`} d={`M ${x + w / 2} -100 C ${x + w / 2 + 60 * scale} ${300} ${x - 40 * scale} ${600} ${x + w} ${y0 + 200}`} stroke={trunkCol} strokeWidth={6 * scale} fill="none" />);
  }
  for (let i = 0; i < n * 9; i++) {
    const x = r() * (W + 600) - 300 + dx, y = r() < 0.5 ? r() * 360 : y0 + r() * (H - y0);
    items.push(<Leaf key={`l${i}`} x={x} y={y} s={(0.5 + r() * 0.9) * scale} rot={r() * 360} col={col} sway={Math.sin(sway + i) * 3} />);
  }
  return <g>{items}</g>;
};

/* ---------------------------------------------------------- jungle */
export const Jungle: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const g = GREEN[t];
  const cam = camFor(seed + 300, 0.7);
  const sway = frame / 30;
  const fall = p.treefall ? interpolate(frame, [dur * 0.2, dur * 0.45], [0, 1], clamp) : 0;
  const [sx, sy] = useShake(p.treefall && fall > 0.95 && fall <= 1 && frame < dur * 0.6 ? 0.8 : 0);
  const pr = useProgress(dur);
  const flash = t === 'storm' && rng(Math.floor(frame / 3) + seed)() > 0.97;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
          <Svg>
            <Sky id="jg" stops={JSKY[t]} />
            {t === 'day' && <Rays cx={1300} cy={-100} count={14} opacity={0.12} len={1600} color="#fff6d0" seed={seed} />}
            {t === 'dawn' && <Glow id="jgd" cx={1400} cy={400} r={900} color="#f0c890" opacity={0.4} />}
            {t === 'night' && <Stars count={60} maxY={300} />}
            <JungleLayer seed={seed * 11 + 1} col={g[0]} trunkCol={g[1]} y0={700} density={1.2} scale={0.6} dx={-pr * 30} sway={sway} />
            {(p.fog || t === 'dawn' || t === 'storm') && <Fog id="jgf" y={400} h={400} opacity={0.4} color={t === 'storm' ? '#8a9a90' : '#e8e0c8'} />}
            <JungleLayer seed={seed * 11 + 2} col={g[1]} trunkCol={g[2]} y0={760} density={p.dense ? 1.6 : 1.1} scale={0.9} dx={-pr * 60} sway={sway + 1} />
            <rect x={0} y={880} width={W} height={200} fill={t === 'night' ? '#050806' : '#2a2014'} />
            {p.trail && <path d={`M 700 ${H} C 820 980 980 920 1060 880 L 1120 880 C 1080 940 1000 1000 1000 ${H} Z`} fill="#5a4630" opacity={0.7} />}
            {(p.flood || t === 'storm') && <rect x={0} y={930} width={W} height={150} fill="#4a3a26" opacity={0.85} />}
            {p.fruit && Array.from({length: 18}, (_, i) => { const r = rng(i + 60); return <circle key={i} cx={1200 + r() * 300} cy={300 + r() * 260} r={10} fill="#e8c040" />; })}
            {p.noah && <g transform={`translate(${p.run ? lerp(400, 1400, pr) : 940} 950) scale(0.75)`}><NoahWalk phase={frame / (p.run ? 3.5 : 6)} outfit="trek" rim={t === 'day' ? '#fff6d0' : '#e8b080'} /></g>}
            <JungleLayer seed={seed * 11 + 3} col={g[2]} trunkCol={g[3]} y0={860} density={0.7} scale={1.6} dx={-pr * 120} sway={sway + 2} />
            {p.treefall && <g transform={`translate(1500 -100) rotate(${fall * 72} 0 0)`}><rect x={-60} y={0} width={120} height={1300} fill={g[3]} /><Leaf x={0} y={1250} s={3} rot={20} col={g[1]} /></g>}
            {t === 'day' && <Dust area={[800, 0, 900, 900]} count={50} opacity={0.5} color="#fff6d0" />}
            {t === 'storm' && <Rain count={360} opacity={0.5} angle={4} />}
            {flash && <rect width={W} height={H} fill="#e8f0ff" opacity={0.5} />}
            {t === 'night' && <><rect width={W} height={H} fill="#000" opacity={0.25} /><Glow id="jgm" cx={960} cy={200} r={900} color="#9fc0a0" opacity={0.12} /></>}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- canopy from above */
export const Canopy: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const r = rng(seed + 700);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.reveal ? 1.25 : 1.0} to={p.reveal ? 1.0 : 1.08} origin="50% 60%">
        <Svg>
          <Sky id="cn" stops={JSKY[t]} />
          <Glow id="cns" cx={1400} cy={t === 'dusk' ? 520 : 200} r={800} color={t === 'dusk' ? '#f0a050' : '#fff6e0'} opacity={0.5} />
          {[0, 1, 2, 3].map((k) => {
            const y = 480 + k * 140, col = GREEN[t][Math.min(3, k)];
            const pts: string[] = [];
            for (let x = -100; x <= W + 100; x += 40) pts.push(`${x},${y - 30 - Math.abs(Math.sin(x / (60 + k * 30) + k + seed)) * (40 + k * 20) - r() * 10}`);
            return <polygon key={k} points={`-100,${H} ${pts.join(' ')} ${W + 100},${H}`} fill={col} />;
          })}
          {Array.from({length: 6}, (_, i) => <ellipse key={i} cx={((i * 400 + frame * 0.6) % (W + 600)) - 300} cy={430 + (i % 2) * 70} rx={200} ry={30} fill="#ffffff" opacity={0.55} />)}
          {p.river && <path d="M 1100 520 C 1200 560 1400 540 1500 600 C 1580 650 1700 640 1920 660" stroke="#d8e8f0" strokeWidth={8} fill="none" opacity={0.6 + 0.4 * Math.sin(frame / 8)} />}
          <Birds x={300} y={260} count={6} vx={1.2} vy={-0.2} seed={seed} color="#2a2018" />
          {p.noah && <g transform="translate(520 1150) scale(1.2)"><NoahStandBack outfit="trek" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- research boat on the river */
const Boat: React.FC<{people?: number}> = ({people = 2}) => (
  <g>
    <path d="M -260 0 L 260 0 L 220 50 L -230 50 Z" fill="#e8e0c8" />
    <path d="M -260 0 L 260 0 L 254 14 L -256 14 Z" fill="#2a6a8a" />
    <rect x={-120} y={-90} width={200} height={90} fill="#2a6a8a" opacity={0.9} /><rect x={-130} y={-100} width={220} height={14} fill="#1f5a7a" />
    <rect x={200} y={-20} width={40} height={40} fill="#3a3f40" />
    {people >= 1 && <g transform="translate(-60 0) scale(0.32)"><NoahStandBack outfit="trek" /></g>}
    {people >= 2 && <g transform="translate(150 0) scale(0.32)"><NoahStandBack outfit="home" /><path d="M -50 -470 C -50 -520 50 -520 50 -470 L 70 -460 L -70 -460 Z" fill="#8a7a50" /></g>}
  </g>
);

export const RiverBoat: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const g = GREEN[t];
  const speed = p.racing ? 6 : 1.5;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.wide ? 1.0 : 1.05} to={p.wide ? 1.08 : 1.1}>
        <Svg>
          <Sky id="rb" stops={JSKY[t]} />
          <Glow id="rbs" cx={1400} cy={t === 'dusk' ? 560 : t === 'dawn' ? 580 : 200} r={900} color={t === 'dusk' ? '#f0a050' : '#fff6e0'} opacity={0.5} />
          {[0, 1].map((k) => {
            const y = 560 + k * 40;
            const pts: string[] = [];
            const off = (frame * speed * (0.2 + k * 0.2)) % 200;
            for (let x = -200; x <= W + 200; x += 50) pts.push(`${x - off},${y - 60 - Math.abs(Math.sin(x / 90 + k + seed)) * 90}`);
            return <polygon key={k} points={`-200,${y + 40} ${pts.join(' ')} ${W + 200},${y + 40}`} fill={g[k + 1]} />;
          })}
          <rect x={0} y={630} width={W} height={450} fill={t === 'dusk' ? '#8a6040' : t === 'dawn' ? '#9a8060' : '#8a6a44'} />
          {Array.from({length: 20}, (_, i) => { const r = rng(i + seed); const x = (r() * W - frame * speed * 2) % W; return <line key={i} x1={(x + W) % W} y1={660 + r() * 400} x2={(x + W) % W + 80} y2={660 + r() * 400} stroke="#e8d8b8" strokeWidth={2} opacity={0.3} />; })}
          <rect x={0} y={630} width={W} height={60} fill={g[2]} opacity={0.35} />
          <g transform={`translate(${p.racing ? lerp(1500, 600, frame / dur) : 900} ${840 + Math.sin(frame / 15) * 4})`}>
            <Boat people={p.searching || p.racing ? 1 : 2} />
            {(p.racing || p.searching) && <path d="M 240 30 C 320 20 420 40 520 30" stroke="#f0e8d8" strokeWidth={8} opacity={0.6} fill="none" />}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- portraits: Tomás and Rosa */
export type Face = {skin: string; hair: string; hat?: 'bucket' | null; shirt: string; female?: boolean; grey?: boolean; young?: boolean};
export const Person: React.FC<{f: Face; talk: number; blink: number; worried?: boolean; smile?: boolean}> = ({f, talk, blink, worried, smile}) => (
  <g>
    <path d="M -260 360 C -250 220 -140 170 0 170 C 140 170 250 220 260 360 Z" fill={f.shirt} />
    {f.female ? <path d="M -30 170 C -10 210 10 210 30 170" stroke="#ffffff" strokeOpacity={0.5} strokeWidth={6} fill="none" />
      : <path d="M -60 170 L 0 240 L 60 170" stroke="#000" strokeOpacity={0.2} strokeWidth={8} fill="none" />}
    {f.female && !f.young && Array.from({length: 10}, (_, i) => <circle key={i} cx={-200 + (i * 47) % 400} cy={240 + (i % 3) * 40} r={12} fill="#e8a040" opacity={0.7} />)}
    <path d="M -36 150 L -36 100 L 36 100 L 36 150 Z" fill={f.skin} filter="brightness(0.9)" />
    {/* hair back */}
    {f.female && <ellipse cx={0} cy={-70} rx={130} ry={110} fill={f.hair} />}
    {f.female && <circle cx={0} cy={-170} r={52} fill={f.hair} />}
    <ellipse cx={0} cy={-10} rx={112} ry={132} fill={f.skin} />
    {!f.female && <path d="M -112 -30 C -116 -120 -50 -150 0 -150 C 60 -150 116 -120 112 -30 C 100 -80 60 -96 0 -96 C -60 -96 -100 -80 -112 -30 Z" fill={f.hair} />}
    {f.female && <path d="M -112 -20 C -112 -110 -40 -140 0 -140 C 40 -140 112 -110 112 -20 C 90 -80 40 -100 0 -100 C -40 -100 -90 -80 -112 -20 Z" fill={f.hair} />}
    {f.grey && !f.female && <path d="M -110 -50 C -100 -80 -90 -90 -80 -96 M 110 -50 C 100 -80 90 -90 80 -96" stroke="#c9c9c0" strokeWidth={10} />}
    {f.hat === 'bucket' && <><path d="M -120 -60 C -120 -170 120 -170 120 -60 Z" fill="#8a7a50" /><ellipse cx={0} cy={-60} rx={170} ry={26} fill="#7a6a44" /></>}
    <path d={worried ? 'M -80 -36 C -60 -50 -36 -46 -22 -34 M 22 -34 C 36 -46 60 -50 80 -36' : 'M -80 -40 C -60 -48 -36 -48 -22 -42 M 22 -42 C 36 -48 60 -48 80 -40'} stroke={f.female ? '#6a6a64' : '#2a1d18'} strokeWidth={8} fill="none" strokeLinecap="round" />
    <g transform={`translate(0 -10) scale(1 ${Math.max(0.1, 1 - blink)})`}>
      <ellipse cx={-50} cy={0} rx={14} ry={smile ? 6 : 9} fill="#f1ece4" /><circle cx={-48} cy={0} r={6.5} fill="#2a1a10" />
      <ellipse cx={50} cy={0} rx={14} ry={smile ? 6 : 9} fill="#f1ece4" /><circle cx={52} cy={0} r={6.5} fill="#2a1a10" />
    </g>
    {(f.female || f.grey) && !f.young && <path d="M -84 0 l -16 -6 M -84 10 l -16 2 M 84 0 l 16 -6 M 84 10 l 16 2" stroke="#000" strokeOpacity={0.25} strokeWidth={3} />}
    <path d="M -6 4 L -16 44 L 8 46" stroke="#000" strokeOpacity={0.25} strokeWidth={4} fill="none" />
    {!f.female && <path d="M -96 30 C -90 120 -40 138 0 138 C 40 138 90 120 96 30 C 80 100 40 116 0 116 C -40 116 -80 100 -96 30 Z" fill={f.hair} opacity={0.22} />}
    {talk > 0.05 ? <ellipse cx={0} cy={74} rx={22} ry={3 + talk * 12} fill="#4a1a14" />
      : smile ? <path d="M -32 66 C -10 86 10 86 32 66" stroke="#6a2a1a" strokeWidth={6} fill="none" strokeLinecap="round" />
        : <path d="M -24 72 C -8 76 8 76 24 72" stroke="#6a2a1a" strokeWidth={5} fill="none" strokeLinecap="round" />}
    <ellipse cx={-112} cy={0} rx={16} ry={28} fill={f.skin} /><ellipse cx={112} cy={0} rx={16} ry={28} fill={f.skin} />
  </g>
);

const TOMAS: Face = {skin: '#a8724e', hair: '#1f1612', hat: 'bucket', shirt: '#8a8a5a', grey: true};
const ROSA: Face = {skin: '#8a5a3e', hair: '#d8d4cc', shirt: '#2a6a8a', female: true};

const PortraitSet: React.FC<SetProps & {face: Face; who: string}> = ({dur, p, talk, face, who}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? 'boat';
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 29) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const cam = camFor(seed + 310, 0.5);
  const night = mode === 'night';
  const g = GREEN[night ? 'night' : mode === 'village' ? 'dusk' : 'day'];
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id={`pp${who}`} stops={night ? JSKY.night : mode === 'village' ? JSKY.dusk : mode === 'canoe' ? JSKY.dawn : JSKY.day} />
          {[0, 1].map((k) => <polygon key={k} points={`-100,${640 + k * 30} ${Array.from({length: 50}, (_, i) => `${i * 45 - 100},${560 + k * 40 - Math.abs(Math.sin(i / 2 + k)) * 90}`).join(' ')} ${W + 100},${640 + k * 30}`} fill={g[k + 1]} />)}
          <rect x={0} y={660} width={W} height={420} fill={night ? '#0a120e' : mode === 'village' ? '#6a4a30' : '#8a6a44'} />
          {night && <Glow id={`ppf${who}`} cx={1400} cy={760} r={600} color="#f0a050" opacity={0.4} />}
          {night && <polygon points="1500,700 1900,620 1900,820" fill="#fff6d0" opacity={0.08} />}
          <g transform={`translate(${mode === 'boat' ? 760 : 820} ${640 + Math.sin(frame / 24) * 3}) scale(1.35)`}>
            <Person f={face} talk={mouth(frame, talk, who)} blink={blink} worried={p.worried} smile={p.smile && !(talk && frame >= talk.from && frame <= talk.to)} />
          </g>
          {night && <rect width={W} height={H} fill="#000" opacity={0.3} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
export const Tomas: React.FC<SetProps> = (props) => <PortraitSet {...props} face={TOMAS} who="TOMAS" />;
export const Rosa: React.FC<SetProps> = (props) => <PortraitSet {...props} face={ROSA} who="ROSA" />;

/* ---------------------------------------------------------- research camp */
export const Camp: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 320, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="cp" stops={JSKY.dusk} />
          <Glow id="cps" cx={1500} cy={560} r={900} color="#f0a050" opacity={0.45} />
          <JungleLayer seed={21} col={GREEN.dusk[1]} trunkCol={GREEN.dusk[2]} y0={700} density={1.2} scale={0.8} dx={0} sway={frame / 30} />
          <rect x={0} y={760} width={W} height={320} fill="#4a3a28" />
          {[[400, 760], [900, 780], [1400, 770]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M -200 0 L 0 -150 L 200 0 Z" fill={['#2a5a8a', '#3a6a3a', '#8a5a2a'][i]} />
            <path d="M -260 -120 L 0 -200 L 260 -120" stroke="#2a6a9a" strokeWidth={10} fill="none" />
          </g>)}
          <path d="M 1100 700 C 1180 760 1260 760 1340 700" stroke="#c9a060" strokeWidth={14} fill="none" />
          <rect x={700} y={820} width={80} height={50} fill="#3a3f40" />
          <Glow id="cpl" cx={900} cy={700} r={300} color="#f2c27d" opacity={0.4} />
          <g transform="translate(600 900) scale(0.55)"><NoahStandBack outfit="trek" /></g>
          <g transform="translate(1250 920) scale(0.5)"><NoahStandBack outfit="home" /><ellipse cx={0} cy={-470} rx={54} ry={40} fill="#2a1a10" /></g>
          <Dust area={[0, 400, W, 500]} count={60} opacity={0.6} color="#f0e080" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- jungle at night */
export const CampNight: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const r = rng(seed + 40);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <rect width={W} height={H} fill="#020604" />
          <JungleLayer seed={seed + 70} col="#0a1810" trunkCol="#06100a" y0={700} density={1.4} scale={1} dx={0} sway={frame / 40} />
          {p.camp && <><path d="M 700 820 L 960 640 L 1220 820 Z" fill="#14283a" /><Glow id="cng" cx={960} cy={760} r={300} color="#f2c27d" opacity={0.35} />
            <path d="M 600 560 C 800 640 1100 640 1300 560" stroke="#3a3f40" strokeWidth={6} fill="none" /></>}
          {p.eyes && [0, 1, 2].map((i) => { const x = 300 + i * 600 + Math.sin(frame / 50 + i) * 20, y = 600 + (i % 2) * 120; const on = (frame + i * 40) % 140 < 120; return on ? <g key={i}><circle cx={x} cy={y} r={6} fill="#e8f080" /><circle cx={x + 26} cy={y} r={6} fill="#e8f080" /><Glow id={`ey${i}`} cx={x + 13} cy={y} r={40} color="#e8f080" opacity={0.3} /></g> : null; })}
          {p.fireflies && Array.from({length: 140}, (_, i) => { const x = r() * W, y = 200 + r() * 700, ph = r() * 6; const wave = Math.max(0, Math.sin(frame / 20 - x / 300 + ph)); return <g key={i}><circle cx={x + Math.sin(frame / 30 + ph) * 20} cy={y + Math.cos(frame / 40 + ph) * 14} r={3} fill="#d8ff80" opacity={wave} /><circle cx={x + Math.sin(frame / 30 + ph) * 20} cy={y + Math.cos(frame / 40 + ph) * 14} r={12} fill="#d8ff80" opacity={wave * 0.2} /></g>; })}
          {p.fungus && Array.from({length: 24}, (_, i) => { const x = 100 + r() * 1700, y = 900 + r() * 150; return <g key={i}><ellipse cx={x} cy={y} rx={18} ry={8} fill="#80ffc0" opacity={0.7} /><Glow id={`fg${i}`} cx={x} cy={y} r={60} color="#80ffc0" opacity={0.25} /></g>; })}
          {!p.fireflies && !p.camp && <Glow id="cnm" cx={960} cy={300} r={500} color="#9fc0a0" opacity={0.06} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- macaws, kapok tree */
const Macaw: React.FC<{phase: number}> = ({phase}) => {
  const f = Math.sin(phase) * 40;
  return (
    <g>
      <path d={`M 0 0 L -120 ${-60 - f} L -40 -10 Z`} fill="#2a6ad0" />
      <path d={`M 0 0 L 120 ${-60 - f} L 40 -10 Z`} fill="#e0c030" />
      <ellipse cx={0} cy={0} rx={30} ry={70} fill="#d02a20" />
      <path d="M -10 60 L 0 180 L 10 60 Z" fill="#d02a20" /><path d="M -4 120 L 0 200 L 6 120 Z" fill="#2a6ad0" />
      <circle cx={0} cy={-60} r={22} fill="#d02a20" /><ellipse cx={0} cy={-56} rx={12} ry={8} fill="#f4f0e8" /><path d="M -6 -44 C 0 -30 10 -36 8 -46 Z" fill="#2a2a2a" />
    </g>
  );
};

export const MacawSet: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="mc" stops={JSKY.day} />
          <Rays cx={1200} cy={-100} count={14} opacity={0.15} len={1600} color="#fff6d0" />
          <JungleLayer seed={44} col={GREEN.day[1]} trunkCol={GREEN.day[2]} y0={800} density={1} scale={0.9} dx={0} sway={frame / 30} />
          <g transform={`translate(${lerp(300, 1500, pr)} ${lerp(500, 300, pr) + Math.sin(frame / 8) * 20}) rotate(80) scale(0.9)`}><Macaw phase={frame / 3} /></g>
          <g transform={`translate(${lerp(100, 1300, pr)} ${lerp(600, 400, pr) + Math.sin(frame / 8 + 1) * 20}) rotate(80) scale(0.7)`}><Macaw phase={frame / 3 + 1} /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Kapok: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const pr = useProgress(dur);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.climb ? 1.0 : 1.0} to={p.climb ? 1.1 : 1.06} y={p.climb ? [0, 160] : [0, 0]} origin="50% 40%">
        <Svg>
          <Sky id="kp" stops={JSKY.day} />
          <Rays cx={960} cy={-100} count={16} opacity={0.14} len={1600} color="#fff6d0" seed={seed} />
          <JungleLayer seed={55 + seed} col={GREEN.day[1]} trunkCol={GREEN.day[2]} y0={760} density={0.9} scale={0.8} dx={0} sway={frame / 30} />
          {/* giant trunk with buttress roots */}
          <rect x={860} y={-200} width={200} height={1200} fill="#7a6a58" />
          <rect x={860} y={-200} width={40} height={1200} fill="#9a8a74" opacity={0.6} />
          {[[-1, 300], [1, 300], [-1, 160], [1, 120]].map(([s, w], i) => <path key={i} d={`M ${960 + s * 80} ${600 - i * 30} C ${960 + s * 160} ${800} ${960 + s * w} ${960} ${960 + s * (w + 60)} 1000 L ${960 + s * 60} 1000 Z`} fill={i % 2 ? '#6a5a48' : '#7a6a58'} />)}
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M ${880 + i * 30} -200 C ${860 + i * 34} 300 ${900 + i * 20} 600 ${870 + i * 36} 1000`} stroke="#3a5a2a" strokeWidth={8} fill="none" />)}
          <rect x={0} y={960} width={W} height={120} fill="#2a2014" />
          {p.birds && <><g transform="translate(700 260) scale(0.45)"><Macaw phase={frame / 4} /></g><g transform="translate(1240 200) scale(0.4) rotate(-10)"><Macaw phase={frame / 4 + 2} /></g></>}
          {p.noah && !p.climb && !p.rest && <g transform="translate(600 980) scale(0.6)"><NoahStandBack outfit="trek" /></g>}
          {p.rest && <g transform="translate(700 990) scale(0.85)"><NoahSitting outfit="trek" phone={false} head={1} breath={(Math.sin(frame / 22) + 1) / 2} /></g>}
          {p.climb && p.noah && <g transform={`translate(950 ${p.high ? lerp(300, 120, pr) : lerp(900, 600, pr)}) scale(0.5)`}><NoahStandBack outfit="trek" /></g>}
          <Dust area={[600, 0, 800, 900]} count={50} opacity={0.5} color="#fff6d0" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- GPS device */
export const Gps: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const low = frame > dur * 0.55;
  return (
    <AbsoluteFill style={{background: '#0a140e', justifyContent: 'center', alignItems: 'center'}}>
      <Svg>
        <rect width={W} height={H} fill="#16281a" />
        <JungleLayer seed={88} col="#20381e" trunkCol="#162a14" y0={700} density={1} scale={1} dx={0} sway={frame / 30} />
        <rect width={W} height={H} fill="#000" opacity={0.5} />
        <g transform="translate(960 560) rotate(-6)">
          <rect x={-200} y={-320} width={400} height={640} rx={50} fill="#e0a020" />
          <rect x={-160} y={-260} width={320} height={380} rx={14} fill="#0a1410" />
          {!low ? <>
            <text x={0} y={-120} textAnchor="middle" fill="#7fd0a0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={32}>SEARCHING</text>
            <text x={0} y={-76} textAnchor="middle" fill="#7fd0a0" fontFamily="DejaVu Sans Mono" fontSize={26}>SATELLITES{'.'.repeat(1 + Math.floor(frame / 10) % 3)}</text>
            {[0, 1, 2, 3].map((i) => <rect key={i} x={-90 + i * 50} y={20 - i * 24} width={30} height={30 + i * 24} fill="#2a4a3a" />)}
          </> : <>
            <rect x={-80} y={-150} width={140} height={70} rx={8} fill="none" stroke="#ff4a3a" strokeWidth={6} /><rect x={60} y={-128} width={12} height={26} fill="#ff4a3a" />
            <rect x={-72} y={-142} width={18} height={54} fill="#ff4a3a" opacity={Math.floor(frame / 10) % 2} />
            <text x={0} y={-20} textAnchor="middle" fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={36}>BATTERY LOW</text>
            <text x={0} y={30} textAnchor="middle" fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontSize={26}>3%</text>
          </>}
          <circle cx={-80} cy={220} r={30} fill="#b07a10" /><circle cx={80} cy={220} r={30} fill="#b07a10" />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- raised shelter */
export const Shelter: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const night = !!p.night;
  const build = p.building ? interpolate(frame, [0, dur], [0.2, 1], clamp) : 1;
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 330, 0.6);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="sh" stops={night ? JSKY.night : JSKY.dusk} />
          <JungleLayer seed={seed + 90} col={night ? '#0a1810' : GREEN.dusk[1]} trunkCol={night ? '#06100a' : GREEN.dusk[2]} y0={700} density={1.1} scale={0.9} dx={0} sway={frame / 30} />
          <rect x={0} y={880} width={W} height={200} fill={night ? '#050806' : '#2a2014'} />
          <rect x={700} y={300} width={70} height={700} fill={night ? '#0a120c' : '#5a4a38'} /><rect x={1180} y={300} width={70} height={700} fill={night ? '#0a120c' : '#5a4a38'} />
          {Array.from({length: Math.round(9 * build)}, (_, i) => <rect key={i} x={720} y={780 - i * 3} width={520} height={14} fill={night ? '#14100c' : '#7a5a3a'} transform={`rotate(${(i % 2 ? 1 : -1)} 980 780)`} />)}
          {build > 0.6 && Array.from({length: 7}, (_, i) => <Leaf key={i} x={700 + i * 80} y={640} s={1.4} rot={-10 + i * 4} col={night ? '#0e2016' : '#4a7a3a'} />)}
          {!night && p.building && <g transform={`translate(${600 + Math.sin(frame / 15) * 30} 970) scale(0.7)`}><NoahWalk phase={Math.sin(frame / 10) * 0.6} outfit="trek" /></g>}
          {night && <g transform="translate(980 740) scale(0.45)"><NoahLying eye={0} breath={(Math.sin(frame / 22) + 1) / 2} /></g>}
          {night && Array.from({length: 40}, (_, i) => { const r = rng(i + 3); return <circle key={i} cx={r() * W} cy={200 + r() * 600} r={3} fill="#d8ff80" opacity={Math.max(0, Math.sin(frame / 18 + i))} />; })}
          {night && <rect width={W} height={H} fill="#000" opacity={0.35} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- water from leaves / vine */
export const WaterLeaf: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, dur], [0.2, p.drip ? 0.6 : 0.35], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill="#1c3020" />
          <JungleLayer seed={99} col="#2c4a2a" trunkCol="#1c3018" y0={700} density={1} scale={1} dx={0} sway={frame / 30} />
          <Rain count={200} opacity={0.35} angle={2} />
          <g transform="translate(960 380)"><path d="M -400 -100 C -200 -200 200 -200 400 -100 C 200 40 40 120 0 200 C -40 120 -200 40 -400 -100 Z" fill="#4a8a3a" /><path d="M 0 200 L 0 -140" stroke="#2a5a2a" strokeWidth={6} /></g>
          {[0, 1, 2].map((i) => { const k = ((frame / 12 + i / 3) % 1); return <ellipse key={i} cx={960} cy={600 + k * 200} rx={8} ry={12} fill="#cfe8f0" opacity={1 - k * 0.3} />; })}
          <g transform="translate(960 860)">
            <rect x={-70} y={-160} width={140} height={300} rx={30} fill="#cfe8f0" opacity={0.25} stroke="#e8f4f8" strokeWidth={6} />
            <rect x={-62} y={132 - 280 * fill} width={124} height={280 * fill} rx={22} fill="#8ac0d8" opacity={0.7} />
            <rect x={-40} y={-200} width={80} height={44} rx={10} fill="#2a6a8a" />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Vine: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const cut = frame > dur * 0.35;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="55% 45%">
        <Svg>
          <rect width={W} height={H} fill="#1c3020" />
          <JungleLayer seed={77} col="#2c4a2a" trunkCol="#1c3018" y0={700} density={1} scale={1} dx={0} sway={frame / 30} />
          <path d="M 1000 -100 C 1060 200 980 400 1040 560" stroke="#6a5a3a" strokeWidth={60} fill="none" />
          {!cut && <path d="M 1040 560 C 1080 700 1020 900 1060 1100" stroke="#6a5a3a" strokeWidth={60} fill="none" />}
          {cut && <ellipse cx={1040} cy={566} rx={30} ry={12} fill="#c9b07a" />}
          {cut && Array.from({length: 18}, (_, i) => { const k = ((frame / 6 + i / 18) % 1); return <ellipse key={i} cx={1040 + Math.sin(i) * 4} cy={580 + k * 300} rx={6} ry={12} fill="#cfe8f0" opacity={1 - k} />; })}
          <g transform="translate(820 1180) scale(1.1)"><NoahStandBack outfit="trek" /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- monkeys in the canopy */
export const Monkeys: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const t: T = p.time ?? 'day';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="mk" stops={JSKY[t]} />
          <JungleLayer seed={66} col={GREEN[t][1]} trunkCol={GREEN[t][2]} y0={900} density={1} scale={0.9} dx={0} sway={frame / 30} />
          <path d="M 0 420 C 500 380 1100 460 1920 400" stroke={GREEN[t][3]} strokeWidth={36} fill="none" />
          {[400, 900, 1400].map((x, i) => {
            const bob = Math.sin(frame / 10 + i) * 6;
            return <g key={i} transform={`translate(${x} ${400 + bob})`}>
              <ellipse cx={0} cy={-50} rx={46} ry={56} fill="#6a3a1a" /><circle cx={0} cy={-120} r={30} fill="#6a3a1a" />
              <ellipse cx={0} cy={-114} rx={18} ry={14} fill="#3a2010" />
              <path d={`M 30 -20 C 120 20 120 140 ${60 + Math.sin(frame / 15 + i) * 20} 200`} stroke="#6a3a1a" strokeWidth={10} fill="none" />
              {i === 1 && <circle cx={-40} cy={-90} r={12} fill="#e8c040" />}
            </g>;
          })}
          {Array.from({length: 12}, (_, i) => <circle key={i} cx={300 + i * 120} cy={700 + (i % 3) * 30} r={10} fill="#e8c040" />)}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- carved mark */
export const TreeMark: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const found = !!p.found;
  const carve = found ? 1 : interpolate(frame, [10, dur * 0.7], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={found ? 1.0 : 1.05} to={found ? (p.seed === 2 ? 1.4 : 1.2) : 1.0} origin="50% 46%">
        <Svg>
          <rect width={W} height={H} fill="#5a4a38" />
          {Array.from({length: 30}, (_, i) => <path key={i} d={`M ${i * 70} 0 C ${i * 70 + 20} 300 ${i * 70 - 20} 700 ${i * 70 + 10} ${H}`} stroke="#4a3a2a" strokeWidth={6 + (i % 3) * 3} fill="none" />)}
          <g transform="translate(960 480)">
            <path d="M 0 -160 L 0 160 M -70 -80 L 0 -160 L 70 -80" stroke="#c9a878" strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - carve)} />
            <text x={0} y={300} textAnchor="middle" fill="#c9a878" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={140} opacity={carve}>{p.day ?? 1}</text>
          </g>
          {found && <rect width={W} height={H} fill="#000" opacity={interpolate(frame, [0, dur], [0, 0.25], clamp)} />}
          {!found && <g transform={`translate(1240 ${600 + Math.sin(frame / 4) * 20}) rotate(-30)`}><rect x={0} y={0} width={160} height={30} rx={8} fill="#a0a8a8" /><rect x={-80} y={-4} width={90} height={38} rx={10} fill="#c0392b" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- walking in circles (top-down) */
export const CirclePath: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pr = interpolate(frame, [10, dur - 10], [0, 1], clamp);
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2 * 0.98 - Math.PI / 2;
    pts.push(`${960 + Math.cos(a) * (380 + Math.sin(i / 6) * 20)},${540 + Math.sin(a) * (330 + Math.cos(i / 7) * 20)}`);
  }
  const len = 2400;
  return (
    <AbsoluteFill style={{background: '#16281a'}}>
      <Svg>
        {Array.from({length: 220}, (_, i) => { const r = rng(i + 5); return <circle key={i} cx={r() * W} cy={r() * H} r={20 + r() * 60} fill={['#1f3a20', '#2a4a2a', '#183018'][i % 3]} />; })}
        <polyline points={pts.join(' ')} fill="none" stroke="#e8c070" strokeWidth={8} strokeDasharray={`${len}`} strokeDashoffset={len * (1 - pr)} strokeLinecap="round" />
        <path d="M 960 210 L 960 120" stroke="#e8c070" strokeWidth={6} strokeDasharray="10 10" />
        <text x={980} y={130} fill="#e8c070" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={30}>"STRAIGHT AHEAD"</text>
        {[0.25, 0.5, 0.75].map((k, i) => <text key={i} x={k < 0.5 ? 1380 : k < 0.75 ? 920 : 500} y={k < 0.5 ? 540 : k < 0.75 ? 920 : 540} fill="#d5d2c7" fontFamily="DejaVu Sans Mono" fontSize={28} opacity={pr > k ? 1 : 0}>DAY {i + 2}</text>)}
        <circle cx={960} cy={210} r={16} fill="#c0392b" />
        <text x={990} y={250} fill="#d5d2c7" fontFamily="DejaVu Sans Mono" fontSize={26}>MARK "1"</text>
      </Svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- flooded forest (igapó) */
export const Igapo: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const r = rng(seed + 800);
  const trunks = Array.from({length: 14}, () => ({x: r() * W, w: 30 + r() * 70}));
  const night = t === 'night';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="ig" stops={JSKY[t]} />
          {night && <Stars count={140} maxY={400} />}
          {trunks.map((tr, i) => <g key={i}>
            <rect x={tr.x} y={-100} width={tr.w} height={720} fill={night ? '#06100a' : GREEN[t][3]} />
            {Array.from({length: 4}, (_, k) => <Leaf key={k} x={tr.x + tr.w / 2} y={100 + k * 60} s={1.2} rot={k * 90 + i * 20} col={night ? '#0a1810' : GREEN[t][1]} />)}
          </g>)}
          <rect x={0} y={620} width={W} height={460} fill={night ? '#020406' : '#0e1612'} />
          {/* reflections */}
          <g opacity={0.35} transform={`translate(0 1240) scale(1 -1)`}>{trunks.map((tr, i) => <rect key={i} x={tr.x + Math.sin(frame / 20 + i) * 4} y={620} width={tr.w} height={720} fill={night ? '#06100a' : GREEN[t][2]} />)}</g>
          {Array.from({length: 8}, (_, i) => { const k = ((frame / 80 + i / 8) % 1); return <ellipse key={i} cx={200 + i * 220} cy={700 + (i % 3) * 120} rx={20 + k * 80} ry={4 + k * 14} fill="none" stroke="#9ab0a0" strokeWidth={2} opacity={(1 - k) * 0.4} />; })}
          {p.noah && <g transform="translate(400 640) scale(0.5)"><NoahStandBack outfit="trek" /></g>}
          {p.wading && <g transform="translate(960 720) scale(0.8)"><g style={{clipPath: 'inset(0 0 0 0)'}}><NoahStandBack outfit="trek" /></g><rect x={-200} y={-200} width={400} height={400} fill="#0e1612" /></g>}
          {p.fish && [0, 1, 2].map((i) => <path key={i} d={`M ${700 + ((frame * 3 + i * 200) % 600)} ${780 + i * 40} q 20 -10 40 0 q -20 10 -40 0`} fill="#c0a080" opacity={0.4} />)}
          {p.perch && <g transform="translate(1100 380) scale(0.55)"><NoahSitting outfit="trek" phone={false} head={1} /></g>}
          {night && <rect width={W} height={H} fill="#000" opacity={0.35} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Caiman: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const close = !!p.close;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={close ? 1.25 : 1.1} origin="50% 60%">
        <Svg>
          <Sky id="cm" stops={JSKY.dusk} />
          {Array.from({length: 10}, (_, i) => { const r = rng(i + 30); return <rect key={i} x={r() * W} y={-100} width={30 + r() * 60} height={720} fill="#141c10" />; })}
          <rect x={0} y={620} width={W} height={460} fill="#1a1410" />
          <rect x={0} y={620} width={W} height={60} fill="#d07040" opacity={0.15} />
          {[[700, 760], [1150, 820], [1500, 700]].map(([x, y], i) => {
            const dx = Math.sin(frame / 40 + i) * 40 - frame * 0.6;
            return <g key={i} transform={`translate(${x + dx} ${y})`}>
              <ellipse cx={0} cy={6} rx={60} ry={8} fill="#2a2018" opacity={0.8} />
              <circle cx={-14} cy={0} r={7} fill="#ff6a30" /><circle cx={14} cy={0} r={7} fill="#ff6a30" />
              <Glow id={`cmg${i}`} cx={0} cy={0} r={40} color="#ff6a30" opacity={0.4} />
              <path d="M -60 10 q 60 -8 120 0" stroke="#d07040" strokeWidth={2} fill="none" opacity={0.4} />
            </g>;
          })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- balsa raft */
const RaftShape: React.FC<{noah?: 'sit' | 'lie' | null; frame: number}> = ({noah, frame}) => (
  <g>
    {[0, 1, 2].map((i) => <rect key={i} x={-220} y={-20 + i * 26} width={440} height={30} rx={14} fill={['#c9b08a', '#b8a07a', '#d0b890'][i]} />)}
    {[-140, 0, 140].map((x) => <rect key={x} x={x - 8} y={-26} width={16} height={86} fill="#5a4a2a" />)}
    {noah === 'sit' && <g transform="translate(-40 -20) scale(0.5)"><NoahSitting outfit="trek" phone={false} head={0.4} breath={(Math.sin(frame / 22) + 1) / 2} /></g>}
    {noah === 'lie' && <g transform="translate(-120 -24) scale(0.45)"><NoahLying eye={0} breath={(Math.sin(frame / 26) + 1) / 2} /></g>}
    {noah === 'sit' && <line x1={60} y1={-120} x2={160} y2={60} stroke="#6a4a2a" strokeWidth={10} />}
  </g>
);

export const Raft: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const n = p.building ? Math.ceil(interpolate(frame, [0, dur], [1, 3], clamp)) : 3;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="rf" stops={JSKY.day} />
          <JungleLayer seed={33} col={GREEN.day[1]} trunkCol={GREEN.day[2]} y0={800} density={1} scale={0.8} dx={p.floating ? -frame * 0.8 : 0} sway={frame / 30} />
          <rect x={0} y={680} width={W} height={400} fill="#14201a" />
          {p.building && <rect x={0} y={680} width={900} height={400} fill="#5a4630" />}
          <g transform={`translate(${p.floating ? 960 : 700} ${p.floating ? 800 + Math.sin(frame / 18) * 6 : 820})`}>
            {p.building ? Array.from({length: n}, (_, i) => <rect key={i} x={-220} y={-20 + i * 26} width={440} height={30} rx={14} fill={['#c9b08a', '#b8a07a', '#d0b890'][i]} />)
              : <RaftShape noah="sit" frame={frame} />}
          </g>
          {p.building && <g transform={`translate(${1000 + Math.sin(frame / 12) * 20} 960) scale(0.75)`}><g transform="scale(-1 1)"><NoahWalk phase={Math.sin(frame / 9) * 0.5} outfit="trek" /></g></g>}
          {p.floating && Array.from({length: 6}, (_, i) => { const k = ((frame / 60 + i / 6) % 1); return <ellipse key={i} cx={960} cy={830} rx={240 + k * 300} ry={20 + k * 30} fill="none" stroke="#7a9a8a" strokeWidth={2} opacity={(1 - k) * 0.4} />; })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the wide river */
export const RiverWide: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const night = t === 'night';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="rw" stops={JSKY[t]} />
          {night && <Stars count={500} maxY={560} />}
          {(t === 'dawn' || t === 'dusk') && <><Glow id="rws" cx={1300} cy={560} r={900} color={t === 'dawn' ? '#f0c890' : '#f0a050'} opacity={0.6} /><circle cx={1300} cy={580} r={60} fill="#fff0d0" /></>}
          <polygon points={`0,600 ${Array.from({length: 40}, (_, i) => `${i * 50},${560 - Math.abs(Math.sin(i / 3 + seed)) * 60}`).join(' ')} 1920,600`} fill={night ? '#040a06' : GREEN[t][2]} />
          <rect x={0} y={600} width={W} height={480} fill={night ? '#03070a' : t === 'storm' ? '#4a4a3a' : t === 'dusk' ? '#7a5034' : t === 'dawn' ? '#8a7058' : '#8a6a44'} />
          {(t === 'dawn' || t === 'dusk') && <path d="M 1200 600 L 1400 600 L 1600 1080 L 1000 1080 Z" fill={t === 'dawn' ? '#f0c890' : '#f0a050'} opacity={0.25} />}
          {Array.from({length: 24}, (_, i) => { const r = rng(i + seed); const x = ((r() * W + frame * 1.5) % (W + 200)) - 100; return <line key={i} x1={x} y1={630 + r() * 420} x2={x + 90} y2={630 + r() * 420} stroke={night ? '#2a3a4a' : '#e8d8b8'} strokeWidth={2} opacity={0.3} />; })}
          {p.raft && <g transform={`translate(${p.canoe ? 1100 : 900} ${820 + Math.sin(frame / 16) * 6}) scale(${p.canoe ? 0.7 : 1})`}><RaftShape noah={p.lying ? 'lie' : 'sit'} frame={frame} /></g>}
          {p.canoe && <g transform={`translate(${lerp(300, 700, frame / dur)} 840)`}><CanoeShape frame={frame} /></g>}
          {p.dolphins && [0, 1].map((i) => { const k = ((frame / 70 + i / 2) % 1); const y = 860 - Math.sin(k * Math.PI) * 60; return k < 0.5 ? <path key={i} d={`M ${600 + i * 700} ${y} q 60 -40 120 0 q -20 10 -60 14 Z`} fill="#d8a0a8" /> : null; })}
          {t === 'storm' && <Rain count={360} opacity={0.5} />}
          {night && <rect width={W} height={H} fill="#000" opacity={0.2} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- fever (distorted forest) */
export const Fever: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const strong = !!p.strong;
  const wob = Math.sin(frame / 12) * (strong ? 14 : 6);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, filter: `blur(${strong ? 3 : 1.5}px) saturate(1.4) hue-rotate(${Math.sin(frame / 30) * 20}deg)`, transform: `scale(1.08) rotate(${wob * 0.1}deg) skewX(${wob * 0.2}deg)`}}>
        <Svg>
          <Sky id="fv" stops={strong ? JSKY.night : JSKY.dusk} />
          {strong && <Stars count={300} />}
          <JungleLayer seed={13 + (p.seed ?? 1)} col={strong ? '#1a3a20' : '#5a5a30'} trunkCol={strong ? '#0a1a0e' : '#3a3a1a'} y0={700} density={1.2} scale={1} dx={wob * 4} sway={frame / 12} />
          {Array.from({length: 4}, (_, i) => <circle key={i} cx={960 + Math.sin(frame / 20 + i) * 300} cy={400 + Math.cos(frame / 24 + i) * 160} r={80 + i * 30} fill="#ff6a40" opacity={0.06} />)}
          <rect width={W} height={H} fill="#c04020" opacity={0.18} />
        </Svg>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Rosa's canoe */
const CanoeShape: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <path d="M -240 0 C -200 40 200 40 240 0 L 220 -10 L -220 -10 Z" fill="#6a3a1a" />
    <g transform="translate(-80 -10) scale(0.32)"><NoahStandBack outfit="home" /><ellipse cx={0} cy={-470} rx={56} ry={46} fill="#d8d4cc" /></g>
    <g transform="translate(120 -10) scale(0.22)"><NoahStandBack outfit="home" /></g>
    <line x1={-40} y1={-120} x2={20} y2={40} stroke="#4a2a10" strokeWidth={8} transform={`rotate(${Math.sin(frame / 10) * 15} -10 -40)`} />
  </g>
);

export const RosaCanoe: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="rc" stops={JSKY.dawn} />
          <Glow id="rcs" cx={1300} cy={560} r={900} color="#f0c890" opacity={0.6} />
          <circle cx={1300} cy={580} r={60} fill="#fff0d0" />
          <polygon points={`0,600 ${Array.from({length: 40}, (_, i) => `${i * 50},${560 - Math.abs(Math.sin(i / 3)) * 60}`).join(' ')} 1920,600`} fill={GREEN.dawn[2]} />
          <rect x={0} y={600} width={W} height={480} fill="#8a7058" />
          <path d="M 1200 600 L 1400 600 L 1600 1080 L 1000 1080 Z" fill="#f0c890" opacity={0.25} />
          <Fog id="rcf" y={540} h={200} opacity={0.5} color="#f0e0c8" />
          <g transform={`translate(900 ${840 + Math.sin(frame / 16) * 4})`}><CanoeShape frame={frame} /></g>
          {/* fishing net floats */}
          {Array.from({length: 8}, (_, i) => <circle key={i} cx={300 + i * 60} cy={880 + Math.sin(frame / 20 + i) * 4} r={8} fill="#e8a040" />)}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- riverside village on stilts */
export const Village: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'dusk';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 340, 0.6);
  if (p.inside) {
    return (
      <AbsoluteFill>
        <Camera dur={dur} from={1.0} to={1.06}>
          <Svg>
            <rect width={W} height={H} fill="#5a3a24" />
            {Array.from({length: 14}, (_, i) => <rect key={i} x={i * 140} y={0} width={130} height={H} fill={i % 2 ? '#6a4a2e' : '#5e4028'} />)}
            <rect x={1300} y={240} width={360} height={260} fill="#f0d0a0" /><Glow id="vig" cx={1480} cy={370} r={700} color="#fff0d0" opacity={0.4} />
            <path d="M 300 560 C 600 720 1000 720 1300 560" stroke="#c0392b" strokeWidth={30} fill="none" />
            <g transform="translate(800 700) scale(0.5)"><NoahLying eye={1} breath={(Math.sin(frame / 22) + 1) / 2} /></g>
            <g transform="translate(1180 1080) scale(0.9)"><NoahStandBack outfit="home" /><ellipse cx={0} cy={-470} rx={56} ry={46} fill="#d8d4cc" /></g>
            <path d="M 1000 760 C 1020 700 1060 700 1080 760 Z" fill="#7a9a5a" />
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="vl" stops={JSKY[t]} />
          <Glow id="vls" cx={1400} cy={t === 'dawn' ? 580 : 520} r={900} color={t === 'day' ? '#fff6e0' : '#f0a050'} opacity={0.55} />
          <polygon points={`0,560 ${Array.from({length: 40}, (_, i) => `${i * 50},${520 - Math.abs(Math.sin(i / 3 + 2)) * 80}`).join(' ')} 1920,560`} fill={GREEN[t][2]} />
          <rect x={0} y={680} width={W} height={400} fill={t === 'dusk' ? '#7a5034' : '#8a6a44'} />
          {[[300, 560], [700, 580], [1100, 560], [1500, 590]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
            {[-90, -30, 30, 90].map((sx) => <rect key={sx} x={sx - 5} y={0} width={10} height={200} fill="#4a3020" />)}
            <rect x={-130} y={-120} width={260} height={130} fill={['#c0784a', '#5a8aa0', '#d0b060', '#7aa07a'][i]} />
            <path d="M -160 -120 L 0 -200 L 160 -120 Z" fill="#7a5a3a" />
            <rect x={-30} y={-80} width={60} height={90} fill="#3a2414" />
            <rect x={60} y={-90} width={40} height={36} fill={t === 'dusk' ? '#ffd28a' : '#2a3a40'} />
          </g>)}
          <rect x={200} y={760} width={1500} height={14} fill="#5a3a24" />
          <g transform={`translate(${900 + Math.sin(frame / 30) * 10} 860)`}><CanoeShape frame={frame} /></g>
          {Array.from({length: 4}, (_, i) => <g key={i} transform={`translate(${500 + i * 160 + Math.sin(frame / 12 + i) * 20} 760) scale(0.22)`}><NoahStandBack outfit="home" /></g>)}
          <Dust area={[0, 300, W, 400]} count={40} opacity={0.5} color="#f0e080" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
