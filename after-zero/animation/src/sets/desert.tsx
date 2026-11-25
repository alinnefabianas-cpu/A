import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Birds, Camera, clamp, Dust, Glow, H, lerp, Rays, rng, Sky, Svg, W} from '../lib';
import {NoahSitting, NoahStandBack, NoahWalk} from '../noah';
import {camFor, mouth, SetProps, Stars} from './common';
import {Face, Person} from './jungle';

type T = 'day' | 'heat' | 'dusk' | 'dawn' | 'night' | 'storm';
const DSKY: Record<T, [number, string][]> = {
  day: [[0, '#1e5a9a'], [0.6, '#6aa6d0'], [1, '#e8e0c8']],
  heat: [[0, '#7aa0c0'], [0.6, '#d8dcd8'], [1, '#fff4dc']],
  dusk: [[0, '#1a1c3a'], [0.4, '#5a3a5a'], [0.7, '#e07a40'], [1, '#f8b060']],
  dawn: [[0, '#2a3050'], [0.5, '#a07a80'], [0.8, '#f0b080'], [1, '#f8d8a0']],
  night: [[0, '#02040c'], [0.7, '#0a1424'], [1, '#141e30']],
  storm: [[0, '#3a2a1a'], [0.6, '#7a5a3a'], [1, '#a07a50']],
};
const SAND: Record<T, string[]> = {
  day: ['#ecc896', '#dfae6e', '#cf9456', '#b87a44'],
  heat: ['#f4dcae', '#ecca92', '#e0b474', '#cc9a5a'],
  dusk: ['#c87850', '#a85a3a', '#7a4030', '#4a2820'],
  dawn: ['#d8a070', '#c08058', '#9a6040', '#6a4030'],
  night: ['#2c3244', '#222838', '#191e2a', '#10141c'],
  storm: ['#8a6a4a', '#6a503a', '#4a3828', '#2a2018'],
};

const useShake = (amt: number) => {
  const frame = useCurrentFrame();
  const r = rng(frame * 23 + 3);
  return amt ? [(r() - 0.5) * 30 * amt, (r() - 0.5) * 22 * amt] : [0, 0];
};

/** a ridge of dunes: gentle windward slope, steep shaded slip face */
const DuneRow: React.FC<{seed: number; base: number; amp: number; period: number; col: string; shade: number; dx?: number; crest?: string}> = ({seed, base, amp, period, col, shade, dx = 0, crest}) => {
  const r = rng(seed);
  const ph = r();
  const amps = Array.from({length: 40}, () => 0.55 + r() * 0.6);
  const pts: [number, number][] = [];
  const crests: number[] = [];
  for (let x = -300; x <= W + 300; x += 12) {
    const k = (x + dx) / period + ph;
    const i = Math.floor(k), u = k - i;
    const a = amp * amps[((i % 40) + 40) % 40];
    const h = u < 0.72 ? Math.sin((u / 0.72) * Math.PI / 2) : Math.cos(((u - 0.72) / 0.28) * Math.PI / 2);
    pts.push([x, base - a * Math.pow(h, 1.2)]);
    if (u < 0.72 && (u + 12 / period) >= 0.72) crests.push(pts.length - 1);
  }
  const d = `M -300 ${H + 50} ` + pts.map(([x, y]) => `L ${x} ${y}`).join(' ') + ` L ${W + 300} ${H + 50} Z`;
  return (
    <g>
      <path d={d} fill={col} />
      {crests.map((ci, j) => {
        const seg = pts.slice(ci, Math.min(pts.length, ci + Math.ceil(period * 0.3 / 12) + 1));
        if (seg.length < 2) return null;
        const [xc, yc] = seg[0], [xv, yv] = seg[seg.length - 1];
        return <g key={j}>
          <path d={`M ${xc} ${yc} ` + seg.map(([x, y]) => `L ${x} ${y}`).join(' ') + ` L ${xv - 10} ${yv + 30} L ${xc + 20} ${yc + (yv - yc) * 0.9 + 60} Z`} fill="#000" opacity={shade} />
          {crest && <path d={`M ${xc - period * 0.25} ${yc + amp * 0.25} Q ${xc - period * 0.08} ${yc + 2} ${xc} ${yc}`} stroke={crest} strokeWidth={3} fill="none" opacity={0.5} />}
        </g>;
      })}
    </g>
  );
};

export const Dunescape: React.FC<{t: T; seed: number; hz: number; scale?: number; dx?: number}> = ({t, seed, hz, scale = 1, dx = 0}) => {
  const s = SAND[t];
  const night = t === 'night';
  const crest = t === 'dusk' || t === 'dawn' ? '#f8c080' : t === 'night' ? '#5a6a8a' : '#fff4dc';
  return (
    <g>
      <DuneRow seed={seed} base={hz + 10} amp={60 * scale} period={420 * scale} col={s[0]} shade={night ? 0.15 : 0.12} dx={dx * 0.2} />
      <DuneRow seed={seed + 1} base={hz + 120 * scale} amp={110 * scale} period={620 * scale} col={s[1]} shade={0.16} dx={dx * 0.45} crest={crest} />
      <DuneRow seed={seed + 2} base={hz + 280 * scale} amp={170 * scale} period={900 * scale} col={s[2]} shade={0.2} dx={dx * 0.75} crest={crest} />
      <DuneRow seed={seed + 3} base={H + 120} amp={220 * scale} period={1300 * scale} col={s[3]} shade={0.22} dx={dx} crest={crest} />
    </g>
  );
};

/* ---------------------------------------------------------- props */
export const Jeep: React.FC<{frame: number; buried?: number; tarp?: boolean; dust?: boolean; lights?: boolean}> = ({frame, buried = 0, tarp, dust, lights}) => {
  const wob = dust ? Math.sin(frame / 3) * 2 : 0;
  return (
    <g transform={`translate(0 ${wob})`}>
      {tarp && <><path d="M -40 -250 L 520 -120 L 520 0" stroke="#5a4a3a" strokeWidth={6} fill="none" /><path d="M -40 -250 L 520 -120 L 420 -110 L -60 -200 Z" fill="#c8b48a" /><path d="M -40 -250 L 520 -120 L 420 -110 L -60 -200 Z" fill="#000" opacity={0.1} /></>}
      <rect x={-300} y={-250} width={360} height={14} rx={4} fill="#3a3a3a" />
      {[-280, -200].map((x) => <rect key={x} x={x} y={-300} width={60} height={50} rx={6} fill="#c84a2a" />)}
      <rect x={-130} y={-296} width={60} height={46} rx={6} fill="#3a6a4a" />
      <path d="M -320 -60 L -320 -150 L -260 -240 L 60 -240 L 120 -150 L 320 -140 L 330 -60 Z" fill="#f2f0ea" />
      <path d="M -300 -150 L -250 -224 L -110 -224 L -110 -150 Z" fill="#4a6a7a" />
      <path d="M -90 -150 L -90 -224 L 50 -224 L 100 -150 Z" fill="#4a6a7a" />
      <path d="M -300 -150 L -250 -224 L -200 -224 L -260 -150 Z" fill="#ffffff" opacity={0.25} />
      <rect x={-330} y={-80} width={670} height={26} fill="#3a3a3a" />
      <line x1={-100} y1={-140} x2={-100} y2={-70} stroke="#c8c6c0" strokeWidth={3} />
      <rect x={300} y={-130} width={30} height={20} rx={4} fill={lights ? '#fff6d0' : '#e8e0c8'} />
      {lights && <polygon points="330,-120 900,-220 900,0" fill="#fff6d0" opacity={0.12} />}
      {[-200, 200].map((x) => <g key={x} transform={`translate(${x} -40) rotate(${dust ? frame * 12 : 0})`}><circle r={62} fill="#1a1a1a" /><circle r={30} fill="#8a8a88" /><rect x={-4} y={-30} width={8} height={60} fill="#5a5a58" /></g>)}
      {buried > 0 && <path d={`M -420 20 C -300 ${-60 - buried * 120} -100 ${-30 - buried * 140} 60 ${-20 - buried * 90} C 200 ${-10 - buried * 70} 340 ${-buried * 60} 440 20 Z`} fill="#d8aa6a" />}
      {dust && Array.from({length: 14}, (_, i) => { const k = ((frame * 2 + i * 13) % 60) / 60; return <circle key={i} cx={-360 - k * 400} cy={-30 - k * 80 + (i % 3) * 20} r={30 + k * 90} fill="#e0c090" opacity={(1 - k) * 0.5} />; })}
    </g>
  );
};

const Camel: React.FC<{phase: number; rider?: string; load?: boolean; col?: string}> = ({phase, rider, load = true, col = '#a8804e'}) => {
  const s = Math.sin(phase), c = Math.cos(phase);
  const leg = (x: number, a: number, k: number) => <path key={k} d={`M ${x} -150 L ${x + a * 26} -80 L ${x + a * 10} 0`} stroke={col} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <g transform={`translate(0 ${Math.abs(c) * -4})`}>
      {leg(-70, s, 1)}{leg(60, -s, 2)}
      <path d="M -110 -150 C -120 -230 -60 -270 0 -280 C 60 -270 100 -220 110 -160 C 90 -140 -80 -130 -110 -150 Z" fill={col} />
      <path d="M 100 -190 C 140 -200 150 -260 170 -300 C 180 -320 220 -322 240 -306 L 236 -290 C 214 -296 200 -290 196 -276 C 186 -230 170 -160 110 -150 Z" fill={col} />
      <path d="M -110 -170 C -126 -150 -130 -120 -124 -96" stroke={col} strokeWidth={6} fill="none" />
      {leg(-50, -s, 3)}{leg(80, s, 4)}
      {load && <><rect x={-90} y={-268} width={130} height={56} rx={14} fill="#c8b48a" /><rect x={-80} y={-262} width={110} height={10} fill="#8a3a2a" /></>}
      {rider && <g><path d="M -20 -276 L -26 -380 C -10 -400 30 -400 36 -380 L 30 -276 Z" fill={rider} /><circle cx={6} cy={-410} r={26} fill="#8a5a3e" /><path d="M -22 -414 C -24 -450 36 -450 34 -414 L 34 -398 L -22 -398 Z" fill={rider === '#e8e0d0' ? '#c8b48a' : '#1a2a5a'} /><path d="M 20 -330 L 70 -300" stroke={rider} strokeWidth={14} strokeLinecap="round" /></g>}
    </g>
  );
};

const Acacia: React.FC<{x: number; y: number; s?: number; col?: string; frame?: number}> = ({x, y, s = 1, col = '#4a3a24', frame = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 0 C 6 -60 -10 -110 -40 -160 M 0 -40 C 20 -90 50 -120 90 -150 M -6 -80 C 0 -120 10 -150 20 -175" stroke={col} strokeWidth={14} fill="none" strokeLinecap="round" />
    <ellipse cx={20 + Math.sin(frame / 40) * 2} cy={-180} rx={170} ry={36} fill="#5a6a34" />
    <ellipse cx={-10} cy={-196} rx={110} ry={26} fill="#6a7a3e" />
  </g>
);

const Fire: React.FC<{frame: number; s?: number}> = ({frame, s = 1}) => (
  <g transform={`scale(${s})`}>
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-40 + i * 40} 0 Q ${-60 + i * 40 + Math.sin(frame / 3 + i) * 12} -70 ${-10 + i * 20} ${-120 - Math.sin(frame / 2 + i * 2) * 30} Q ${20 + i * 20} -60 ${40 + i * 10} 0 Z`} fill={i === 1 ? '#ffd27a' : '#f07a2a'} opacity={0.9} />)}
    <path d="M -70 10 L 70 -10 M -60 -10 L 70 14" stroke="#3a2416" strokeWidth={12} strokeLinecap="round" />
  </g>
);

const SunDisc: React.FC<{t: T; x: number; y: number}> = ({t, x, y}) => {
  if (t === 'night' || t === 'storm') return null;
  const low = t === 'dusk' || t === 'dawn';
  return <><Glow id={`sd${t}${x}`} cx={x} cy={y} r={low ? 900 : 700} color={low ? '#f8a050' : '#fff8e0'} opacity={t === 'heat' ? 0.9 : 0.6} /><circle cx={x} cy={y} r={low ? 70 : t === 'heat' ? 80 : 54} fill={low ? '#fff0d0' : '#fffcf2'} />{t === 'heat' && <Rays cx={x} cy={y} count={18} opacity={0.12} />}</>;
};

const Plane: React.FC<{frame: number; dur: number; y: number}> = ({frame, dur, y}) => {
  const x = lerp(300, 1700, frame / dur);
  return <g><line x1={x - 700} y1={y + 40} x2={x - 20} y2={y + 2} stroke="#ffffff" strokeWidth={5} opacity={0.6} /><line x1={x - 700} y1={y + 52} x2={x - 20} y2={y + 12} stroke="#ffffff" strokeWidth={4} opacity={0.4} /><path d={`M ${x - 22} ${y} l 30 0 l 8 4 l -38 4 Z M ${x - 8} ${y + 2} l -10 -12 l 6 0 l 14 12 Z`} fill="#e8eef2" /></g>;
};

/* ---------------------------------------------------------- the dunes */
export const Dunes: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const hz = p.aerial ? 380 : 600;
  const cam = camFor(seed + 700, 0.6);
  const night = t === 'night';
  const pr = frame / dur;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.aerial ? 1.0 : cam.from} to={p.aerial ? 0.92 : cam.to} x={p.aerial ? [0, 0] : cam.x}>
        <Svg>
          <Sky id={`dn${t}`} stops={DSKY[t]} />
          {night && <Stars count={700} maxY={hz + 40} />}
          {night && (p.milky || seed % 2) && <path d="M -100 520 C 400 300 1200 120 2100 -40" stroke="#c9d4e8" strokeWidth={180} opacity={0.08} fill="none" />}
          <SunDisc t={t} x={t === 'dusk' ? 1450 : t === 'dawn' ? 500 : 1450} y={t === 'dusk' || t === 'dawn' ? hz - 10 : 200} />
          {p.haze && <><rect x={-100} y={hz - 70} width={W + 200} height={90} fill="#8a5a34" opacity={0.55} /><rect x={-100} y={hz - 110} width={W + 200} height={60} fill="#a87a50" opacity={0.25} /></>}
          {p.plane && <Plane frame={frame} dur={dur} y={160} />}
          {p.smoke && Array.from({length: 18}, (_, i) => <ellipse key={i} cx={1300 + Math.sin(i / 2 + frame / 40) * 14 * i / 4} cy={hz + 10 - i * 34 - ((frame * 0.5) % 34)} rx={20 + i * 5} ry={18 + i * 3} fill="#9a9a94" opacity={0.6 - i * 0.03} />)}
          <Dunescape t={t} seed={seed * 7} hz={hz} scale={p.aerial ? 0.6 : 1} dx={frame * 0.4} />
          {p.well && <g transform={`translate(1240 ${hz + 70}) scale(0.35)`}><Acacia x={80} y={0} frame={frame} col="#2a1e14" /><ellipse cx={-80} cy={0} rx={70} ry={20} fill="#5a4030" /></g>}
          {p.caravan && Array.from({length: 4}, (_, i) => <g key={i} transform={`translate(${380 + i * 70} ${hz + 160}) scale(0.22)`}><Camel phase={0} rider={i === 1 ? '#e8e0d0' : '#1a2a6a'} /></g>)}
          {p.car && <g transform={`translate(${p.car === 'camp' ? 1150 : 1100} ${hz + 300}) scale(0.42)`}><Jeep frame={frame} buried={p.car === 'buried' ? 0.6 : 0.25} tarp={p.car === 'camp'} /></g>}
          {p.sos && <g transform={`translate(560 ${hz + 340})`}>{['S', 'O', 'S'].map((c, i) => <text key={i} x={i * 120} y={0} fontFamily="Inter" fontWeight={800} fontSize={120} fill="none" stroke="#c8c0b0" strokeWidth={8} strokeDasharray="6 14" transform="scale(1 0.45)">{c}</text>)}<path d="M -80 60 L 400 60 L 360 30 M 400 60 L 360 90" stroke="#c8c0b0" strokeWidth={8} strokeDasharray="6 14" fill="none" /></g>}
          {p.camp && <g transform={`translate(1200 ${hz + 260})`}><path d="M -120 0 L 0 -110 L 120 0 Z" fill="#c8783a" /><path d="M 0 -110 L 30 0 L -30 0 Z" fill="#3a2010" /><g transform="translate(220 0) scale(0.35)"><Fire frame={frame} /></g><Glow id="dcg" cx={220} cy={-20} r={260} color="#f0a050" opacity={0.4} /><g transform="translate(-520 40) scale(0.32)"><Jeep frame={frame} /></g></g>}
          {p.walker && <g transform={`translate(${p.far ? lerp(900, 1000, pr) : lerp(600, 1250, pr)} ${p.far ? hz + 120 : hz + 330}) scale(${p.far ? 0.12 : 0.3})`}>
            {p.tracks && Array.from({length: 22}, (_, i) => <ellipse key={i} cx={-60 - i * 70} cy={(i % 2) * 18} rx={16} ry={6} fill="#000" opacity={0.25 - i * 0.01} />)}
            <NoahWalk phase={frame / 6} outfit="trek" rim={night ? '#8aa0c8' : t === 'dusk' || t === 'dawn' ? '#f8c080' : '#fff6d0'} />
          </g>}
          {t === 'heat' && <rect x={0} y={hz - 40} width={W} height={80} fill="#fff8e8" opacity={0.25 + 0.1 * Math.sin(frame / 7)} />}
          {night && <rect width={W} height={H} fill="#06102a" opacity={0.25} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the car */
export const JeepSet: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'drive';
  const roll = phase === 'roll';
  const rot = roll ? interpolate(frame, [dur * 0.35, dur * 0.6], [0, 92], clamp) : 0;
  const [sx, sy] = useShake(roll && frame > dur * 0.35 && frame < dur * 0.7 ? 1 : t === 'storm' ? 0.2 : 0);
  const cam = camFor((p.seed ?? 1) + 710, 0.5);
  const night = t === 'night';
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={cam.from} to={cam.to} x={phase === 'drive' ? [0, 0] : cam.x}>
          <Svg>
            <Sky id={`jp${t}`} stops={DSKY[t]} />
            {night && <Stars count={500} maxY={600} />}
            <SunDisc t={t} x={1500} y={t === 'dusk' || t === 'dawn' ? 560 : 200} />
            <Dunescape t={t} seed={phase === 'drive' ? 41 : 43} hz={580} dx={phase === 'drive' ? frame * 6 : 0} />
            {phase === 'convoy' && [0, 1].map((i) => <g key={i} transform={`translate(${lerp(-300, 400, Math.min(1, frame / dur * 1.4)) - i * 360} ${780 - i * 40}) scale(${0.5 - i * 0.06})`}>
              <rect x={-320} y={-260} width={460} height={200} rx={10} fill="#6a6a4a" /><rect x={140} y={-200} width={170} height={140} rx={10} fill="#5a5a3e" /><rect x={180} y={-190} width={100} height={60} fill="#4a6a7a" />
              {[-220, 220].map((x) => <circle key={x} cx={x} cy={-50} r={60} fill="#1a1a1a" />)}{i === 0 && <><rect x={-100} y={-240} width={80} height={80} fill="#ffffff" /><rect x={-80} y={-210} width={40} height={20} fill="#c0392b" /><rect x={-70} y={-220} width={20} height={40} fill="#c0392b" /></>}</g>)}
            <g transform={`translate(${phase === 'convoy' ? 1350 : 960} ${phase === 'drive' ? 860 + Math.sin(frame / 4) * 3 : 880}) rotate(${phase === 'buried' || phase === 'camp' || phase === 'convoy' ? -3 : rot}) scale(${phase === 'convoy' ? 0.8 : 1})`}>
              <Jeep frame={frame} buried={phase === 'buried' ? (t === 'dawn' ? 0.7 : 0.45) : phase === 'camp' || phase === 'convoy' ? 0.3 : 0} tarp={phase === 'camp' || phase === 'convoy'} dust={phase === 'drive'} lights={t === 'storm'} />
            </g>
            {phase === 'camp' && <><g transform="translate(1320 940) scale(0.42)"><NoahSitting outfit="trek" phone={false} head={0.3} /></g>{p.laptop && <><rect x={1180} y={900} width={70} height={46} fill="#9fd0ff" opacity={0.9} /><Glow id="jlg" cx={1215} cy={920} r={200} color="#9fd0ff" opacity={0.5} /></>}</>}
            {p.noah && phase !== 'camp' && <g transform="translate(1450 960) scale(0.5)"><NoahStandBack outfit="trek" /></g>}
            {p.noah && phase === 'camp' && t === 'dawn' && <g transform={`translate(${lerp(1900, 1600, frame / dur)} 980) scale(0.5)`}><g transform="scale(-1 1)"><NoahWalk phase={frame / 3.5} outfit="trek" /></g></g>}
            {t === 'storm' && <><rect width={W} height={H} fill="#7a5a3a" opacity={0.55} />{Array.from({length: 120}, (_, i) => { const r = rng(i + 5); const x = (r() * W * 1.4 - frame * (30 + r() * 30)) % (W + 400); return <line key={i} x1={x + W} y1={r() * H} x2={x + W + 60} y2={r() * H + 6} stroke="#e0c090" strokeWidth={2} opacity={0.4} />; })}</>}
            {night && <rect width={W} height={H} fill="#06102a" opacity={0.35} />}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- inside the car, in the storm */
export const JeepInside: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const [sx, sy] = useShake(p.storm ? 0.15 : 0);
  const tilt = p.tilt ? -78 : 0;
  const dark = p.dark ? 0.55 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px) rotate(${p.tilt ? -12 : 0}deg) scale(${p.tilt ? 1.2 : 1})`}}>
        <Camera dur={dur} from={1.0} to={1.06}>
          <Svg>
            <rect width={W} height={H} fill="#6a4a2a" />
            {Array.from({length: 200}, (_, i) => { const r = rng(i + 11); const x = ((r() * W * 1.5 - frame * (40 + r() * 40)) % (W + 300) + W + 300) % (W + 300) - 150; const y = r() * 700 + 80; return <line key={i} x1={x} y1={y} x2={x + 50 + r() * 60} y2={y + 4 + tilt * 0.02} stroke="#e8c898" strokeWidth={1.5 + r() * 2} opacity={0.5} />; })}
            <rect width={W} height={H} fill="#5a3a20" opacity={0.25 + 0.15 * Math.sin(frame / 9)} />
            <path d={`M 0 0 L ${W} 0 L ${W} 120 C 1400 80 500 80 0 120 Z`} fill="#1a1612" />
            <rect x={0} y={0} width={110} height={H} fill="#1a1612" /><rect x={W - 110} y={0} width={110} height={H} fill="#1a1612" />
            <path d={`M 0 780 C 500 720 1400 720 ${W} 780 L ${W} ${H} L 0 ${H} Z`} fill="#2a2420" />
            <rect x={200} y={790} width={300} height={60} rx={10} fill="#1a1a1a" /><text x={350} y={832} textAnchor="middle" fill="#ff8a40" fontFamily="DejaVu Sans Mono" fontSize={30}>{p.tilt ? '-- : --' : '43°C'}</text>
            <g transform="translate(1300 900)"><circle r={200} fill="none" stroke="#1a1a1a" strokeWidth={36} /><rect x={-200} y={-14} width={400} height={28} fill="#1a1a1a" /><circle r={50} fill="#2a2a2a" /></g>
            <path d="M 900 120 L 900 260" stroke="#2a2420" strokeWidth={10} /><rect x={820} y={250} width={160} height={50} rx={10} fill="#2a2420" />
            {[0, 1, 2].map((i) => <path key={i} d={`M ${400 + i * 500} ${300 + i * 80} l 60 40 l -30 50 l 80 30`} stroke="#ffffff" strokeWidth={2} opacity={p.tilt ? 0.35 : 0} fill="none" />)}
            <rect width={W} height={H} fill="#000" opacity={dark} />
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the haboob */
export const Haboob: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'far';
  const pr = frame / dur;
  const wallH = phase === 'far' ? lerp(140, 260, pr) : phase === 'near' ? lerp(400, 900, pr) : 1200;
  const [sx, sy] = useShake(phase === 'hit' ? 0.6 : phase === 'near' ? 0.1 : 0);
  const hz = 640;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={1.0} to={phase === 'hit' ? 1.3 : 1.08}>
          <Svg>
            <Sky id="hb" stops={DSKY.day} />
            <SunDisc t="day" x={600} y={200} />
            {Array.from({length: 26}, (_, i) => { const r = rng(i * 3 + 1); const x = -200 + i * 90; const h = wallH * (0.75 + r() * 0.4) + Math.sin(frame / 14 + i) * 20; return <ellipse key={i} cx={x} cy={hz - h * 0.5} rx={120 + r() * 60} ry={h * 0.6} fill={i % 2 ? '#9a6a3e' : '#b07c48'} />; })}
            <rect x={-100} y={hz - wallH * 0.5} width={W + 200} height={wallH} fill="#8a5a32" opacity={0.85} />
            {Array.from({length: 18}, (_, i) => { const r = rng(i + 50); return <ellipse key={i} cx={-100 + i * 120 + Math.sin(frame / 20 + i) * 20} cy={hz - wallH * (0.9 + r() * 0.2)} rx={140} ry={80 + r() * 40} fill="#c08a52" opacity={0.7} />; })}
            <Dunescape t={phase === 'far' ? 'day' : 'storm'} seed={51} hz={hz} dx={frame * (phase === 'near' ? 8 : 0)} />
            {phase !== 'hit' && <g transform={`translate(${phase === 'near' ? lerp(1000, 1500, pr) : 1250} ${phase === 'near' ? 900 : 820}) scale(${phase === 'near' ? 0.6 : 0.2})`}><Jeep frame={frame} dust /></g>}
            {phase === 'hit' && <rect width={W} height={H} fill="#6a4424" opacity={interpolate(frame, [0, 20], [0.3, 1], clamp)} />}
            {phase === 'hit' && <Dust count={200} area={[0, 0, W, H]} color="#e0b080" opacity={0.7} />}
            {phase === 'near' && <rect width={W} height={H} fill="#8a5a32" opacity={pr * 0.35} />}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- portraits: Yara and Idris */
const YARA: Face = {skin: '#c89070', hair: '#2a1a14', shirt: '#a89870', female: true, young: true};
const IDRIS: Face = {skin: '#7a4e34', hair: '#d8d4cc', shirt: '#1a2a6a', grey: true};

const Portrait: React.FC<SetProps & {face: Face; who: string; bg: Record<string, React.ReactNode>}> = ({dur, p, talk, face, who, bg}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? Object.keys(bg)[0];
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 37) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const cam = camFor(seed + 720, 0.5);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          {bg[mode] ?? Object.values(bg)[0]}
          <g transform={`translate(820 ${650 + Math.sin(frame / 24) * 3}) scale(1.35)`}>
            <Person f={face} talk={mouth(frame, talk, who)} blink={blink} worried={p.worried} smile={p.smile && !(talk && frame >= talk.from && frame <= talk.to)} />
            {who === 'YARA' && <><path d="M -150 300 C -120 200 -60 180 0 180 C 60 180 120 200 150 300" stroke="#e8dcc0" strokeWidth={34} fill="none" opacity={0.85} />
              <path d="M 112 -60 C 150 -20 150 60 120 110" stroke={face.hair} strokeWidth={30} fill="none" strokeLinecap="round" />
              <rect x={-90} y={-24} width={70} height={44} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={5} /><rect x={20} y={-24} width={70} height={44} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={5} /><line x1={-20} y1={-6} x2={20} y2={-6} stroke="#2a2a2a" strokeWidth={5} /></>}
            {who === 'IDRIS' && <><path d="M -124 -40 C -136 -170 136 -170 124 -40 C 100 -90 -100 -90 -124 -40 Z" fill="#1a2a6a" /><path d="M -124 -40 C -100 -70 100 -70 124 -40 L 124 -60 C 100 -96 -100 -96 -124 -60 Z" fill="#2a3a8a" />
              <path d="M -116 -100 C -60 -130 60 -130 116 -100" stroke="#2a3a8a" strokeWidth={10} fill="none" />
              <path d="M -150 190 C -110 140 110 140 150 190 L 120 240 C 60 200 -60 200 -120 240 Z" fill="#2a3a8a" />
              <path d="M -60 92 C -50 136 50 136 60 92 C 36 112 -36 112 -60 92 Z" fill="#d8d4cc" opacity={0.85} /></>}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Yara: React.FC<SetProps> = (props) => {
  const frame = useCurrentFrame();
  return <Portrait {...props} face={YARA} who="YARA" bg={{
    office: <><rect width={W} height={H} fill="#d8cdb8" /><rect x={1200} y={160} width={560} height={420} fill="#e8d8b0" stroke="#8a7a5a" strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${1240 + i * 30} ${560 - i * 20} C ${1340 + i * 40} ${440 - i * 30} ${1420} ${360 + i * 10} ${1700 - i * 40} ${200 + i * 30}`} stroke="#5a8ab0" strokeWidth={4} fill="none" />)}
      {Array.from({length: 8}, (_, i) => <rect key={i} x={120 + i * 60} y={180 + (i % 3) * 8} width={44} height={180 - (i % 3) * 8} fill={['#8a3a2a', '#3a5a6a', '#c8a050', '#4a6a3a'][i % 4]} />)}<rect x={100} y={360} width={520} height={14} fill="#6a5040" /></>,
    jeep: <><Sky id="yj" stops={DSKY.day} /><Dunescape t="day" seed={61} hz={600} dx={frame * 3} /><rect x={1100} y={0} width={40} height={H} fill="#2a2420" /><rect x={0} y={0} width={W} height={60} fill="#2a2420" /></>,
    storm: <><rect width={W} height={H} fill="#3a2614" /><rect width={W} height={H} fill="#7a5a3a" opacity={0.3 + 0.1 * Math.sin(frame / 6)} /></>,
    car: <><Sky id="yc" stops={DSKY.heat} /><Dunescape t="heat" seed={63} hz={620} /><path d="M 0 0 L 1300 0 L 1700 260 L 0 300 Z" fill="#c8b48a" /><path d="M 0 0 L 1300 0 L 1700 260 L 0 300 Z" fill="#000" opacity={0.15} /><rect width={W} height={H} fill="#5a3a20" opacity={0.15} /></>,
    night: <><Sky id="yn" stops={DSKY.night} /><Stars count={500} maxY={700} /><Dunescape t="night" seed={65} hz={680} /><Glow id="ynl" cx={1300} cy={760} r={500} color="#9fd0ff" opacity={0.35} /></>,
  }} />;
};

export const Idris: React.FC<SetProps> = (props) => {
  const frame = useCurrentFrame();
  return <Portrait {...props} face={IDRIS} who="IDRIS" bg={{
    dunes: <><Sky id="id" stops={DSKY.dusk} /><SunDisc t="dusk" x={1500} y={600} /><Dunescape t="dusk" seed={71} hz={620} />{[0, 1, 2].map((i) => <g key={i} transform={`translate(${1350 + i * 160} ${760 + i * 10}) scale(0.35)`}><Camel phase={0} /></g>)}</>,
    fire: <><Sky id="if" stops={DSKY.night} /><Stars count={500} maxY={700} /><Dunescape t="night" seed={73} hz={700} /><Glow id="ifg" cx={1400} cy={900} r={800} color="#f0a050" opacity={0.45} /><g transform="translate(1450 1000) scale(0.8)"><Fire frame={frame} /></g></>,
  }} />;
};

/* ---------------------------------------------------------- satellite map on the laptop */
export const SatMap: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'rivers';
  const draw = interpolate(frame, [10, dur * 0.7], [0, 1], clamp);
  const r = rng(77);
  const branches = Array.from({length: 9}, (_, i) => ({x: 300 + r() * 1100, y: 140 + r() * 560, dx: (r() - 0.5) * 400, dy: 100 + r() * 200}));
  return (
    <AbsoluteFill style={{background: '#0e1216'}}>
      <Camera dur={dur} from={1.0} to={phase === 'well' ? 1.15 : 1.06}>
        <Svg>
          <rect x={160} y={70} width={1600} height={900} rx={28} fill="#1a1e22" />
          <g transform="translate(200 100)">
            <rect width={1520} height={820} fill="#d8b47e" />
            {Array.from({length: 60}, (_, i) => { const rr = rng(i + 300); return <path key={i} d={`M ${rr() * 1520} ${rr() * 820} q 40 -10 80 0`} stroke="#c49a62" strokeWidth={6 + rr() * 10} fill="none" opacity={0.6} />; })}
            <path d="M 760 820 C 700 640 820 520 740 380 C 680 260 760 140 720 0" stroke={phase === 'named' ? '#3a7ab8' : '#f0e2c4'} strokeWidth={22} fill="none" strokeDasharray="2400" strokeDashoffset={phase === 'rivers' ? 2400 * (1 - draw) : 0} opacity={0.9} />
            {(phase === 'rivers' || phase === 'named') && branches.map((b, i) => <path key={i} d={`M ${b.x} ${b.y} q ${b.dx / 2} ${b.dy / 3} ${b.dx} ${b.dy}`} stroke={phase === 'named' ? '#5a9ad0' : '#f0e2c4'} strokeWidth={8} fill="none" strokeDasharray="500" strokeDashoffset={phase === 'rivers' ? 500 * (1 - draw) : 0} opacity={0.8} />)}
            {(phase === 'here' || phase === 'well') && <g transform="translate(720 640)"><circle r={18 + Math.sin(frame / 5) * 4} fill="#e83a2a" /><circle r={40 + (frame % 30)} fill="none" stroke="#e83a2a" strokeWidth={3} opacity={1 - (frame % 30) / 30} /><text x={40} y={10} fill="#1a1a1a" fontFamily="Inter" fontWeight={700} fontSize={30}>YOU ARE HERE</text></g>}
            {phase === 'well' && <><path d="M 720 620 C 760 450 700 300 730 120" stroke="#e83a2a" strokeWidth={6} strokeDasharray="14 12" fill="none" strokeDashoffset={-frame} /><g transform="translate(730 110)"><circle r={22} fill="none" stroke="#1a1a1a" strokeWidth={6} /><circle r={8} fill="#1a1a1a" /><text x={40} y={10} fill="#1a1a1a" fontFamily="Inter" fontWeight={700} fontSize={30}>PUITS · 40 km</text></g></>}
            {phase === 'named' && <g transform="translate(730 110)"><circle r={16} fill="#3a7ab8" /><circle r={30 + (frame % 40)} fill="none" stroke="#3a7ab8" strokeWidth={3} opacity={1 - (frame % 40) / 40} /><text x={40} y={12} fill="#1a2a4a" fontFamily="Inter" fontWeight={800} fontSize={38}>Bir Idris</text></g>}
          </g>
          {(phase === 'here' || phase === 'well') && <g transform="translate(1560 130)"><rect width={120} height={50} rx={8} fill="none" stroke="#e8e8e0" strokeWidth={4} /><rect x={6} y={6} width={14} height={38} fill="#e83a2a" opacity={frame % 30 < 15 ? 1 : 0.4} /><text x={60} y={36} textAnchor="middle" fill="#e8e8e0" fontFamily="Inter" fontWeight={700} fontSize={24}>9%</text></g>}
          {phase === 'named' && <text x={960} y={1030} textAnchor="middle" fill="#d5d2c7" fontFamily="Inter" fontWeight={600} fontSize={30} letterSpacing={4}>PALEO-RIVER SURVEY · HADDAD et al.</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- supplies flat-lay */
export const DesertInventory: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const lost = !!p.lost, split = !!p.split;
  const items = split ? [
    {k: 'bottle', x: 560, y: 420}, {k: 'bottle', x: 680, y: 420}, {k: 'bottle', x: 800, y: 420}, {k: 'dates', x: 680, y: 700},
    {k: 'bottle', x: 1140, y: 420}, {k: 'bottle', x: 1260, y: 420}, {k: 'bottle', x: 1380, y: 420}, {k: 'bottle', x: 1200, y: 640}, {k: 'bottle', x: 1320, y: 640},
  ] : [
    {k: 'can', x: 320, y: 340, gone: false}, {k: 'can', x: 520, y: 340, gone: lost}, {k: 'can', x: 720, y: 340, gone: lost}, {k: 'can', x: 920, y: 340, gone: false},
    {k: 'dates', x: 340, y: 720}, {k: 'bread', x: 560, y: 740}, {k: 'tin', x: 760, y: 720}, {k: 'mirror', x: 1180, y: 320}, {k: 'torch', x: 1180, y: 600},
    {k: 'tarp', x: 1480, y: 340}, {k: 'aid', x: 1480, y: 700}, {k: 'laptop', x: 1000, y: 700},
  ];
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <rect width={W} height={H} fill="#d8b47e" />
          {Array.from({length: 40}, (_, i) => { const r = rng(i + 90); return <path key={i} d={`M ${r() * W} ${r() * H} q 60 -14 120 0`} stroke="#c49a62" strokeWidth={5} fill="none" opacity={0.6} />; })}
          {items.map((it: any, i) => {
            const a = interpolate(frame, [i * 4, i * 4 + 8], [0, 1], clamp);
            if (it.gone) return <g key={i} opacity={0.5}><rect x={it.x - 70} y={it.y - 100} width={140} height={200} rx={14} fill="none" stroke="#8a5a2a" strokeWidth={4} strokeDasharray="10 8" /><path d={`M ${it.x - 50} ${it.y - 80} L ${it.x + 50} ${it.y + 80} M ${it.x + 50} ${it.y - 80} L ${it.x - 50} ${it.y + 80}`} stroke="#a83a2a" strokeWidth={6} /></g>;
            return <g key={i} opacity={a} transform={`translate(${it.x} ${it.y})`}>
              {it.k === 'can' && <><rect x={-70} y={-100} width={140} height={200} rx={14} fill="#2a5a8a" /><rect x={-20} y={-120} width={40} height={30} fill="#1a1a1a" /><rect x={-50} y={-60} width={100} height={8} fill="#1a3a5a" /></>}
              {it.k === 'bottle' && <><rect x={-36} y={-90} width={72} height={180} rx={18} fill="#cfe8f0" /><rect x={-36} y={-20} width={72} height={110} rx={18} fill="#8ac0d8" /><rect x={-14} y={-110} width={28} height={24} fill="#2a6aa0" /></>}
              {it.k === 'dates' && <>{Array.from({length: 7}, (_, j) => <ellipse key={j} cx={-60 + (j % 4) * 40} cy={-20 + Math.floor(j / 4) * 40} rx={22} ry={14} fill="#6a3a1a" />)}</>}
              {it.k === 'bread' && <ellipse cx={0} cy={0} rx={90} ry={50} fill="#d8a860" />}
              {it.k === 'tin' && <><rect x={-70} y={-40} width={140} height={80} rx={20} fill="#c8c6c0" /><rect x={-70} y={-10} width={140} height={20} fill="#3a7ab8" /></>}
              {it.k === 'mirror' && <><rect x={-60} y={-60} width={120} height={120} rx={8} fill="#d8e8f0" /><circle r={10} fill="#1a1a1a" /></>}
              {it.k === 'torch' && <><rect x={-80} y={-18} width={130} height={36} rx={8} fill="#2a2a2a" /><rect x={50} y={-26} width={40} height={52} rx={6} fill="#e8a020" /></>}
              {it.k === 'tarp' && <><rect x={-110} y={-80} width={220} height={160} rx={6} fill="#c8b48a" /><path d="M -110 -20 L 110 -20 M -110 30 L 110 30" stroke="#a8946a" strokeWidth={4} /></>}
              {it.k === 'aid' && <><rect x={-80} y={-60} width={160} height={120} rx={12} fill="#e8e8e0" /><rect x={-14} y={-40} width={28} height={80} fill="#c0392b" /><rect x={-40} y={-14} width={80} height={28} fill="#c0392b" /></>}
              {it.k === 'laptop' && <><rect x={-100} y={-70} width={200} height={130} rx={8} fill="#3a3e42" /><rect x={-90} y={-60} width={180} height={110} fill="#9fd0ff" opacity={0.7} /></>}
            </g>;
          })}
          {split && <><text x={680} y={900} textAnchor="middle" fill="#3a2414" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={48}>NOAH · 5 L</text><text x={1260} y={900} textAnchor="middle" fill="#3a2414" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={48}>YARA · 7 L</text><line x1={960} y1={260} x2={960} y2={860} stroke="#3a2414" strokeWidth={4} strokeDasharray="12 12" /></>}
          {lost && <text x={960} y={1000} textAnchor="middle" fill="#3a2414" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={44}>WATER LEFT: 22 L</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- dashboard thermometer */
export const HeatGauge: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const temp = Math.round(interpolate(frame, [0, dur * 0.6], [p.temp - 6, p.temp], clamp));
  const blur = p.blur ? 3 + 3 * Math.sin(frame / 8) : 0;
  return (
    <AbsoluteFill style={{background: '#1a1612', filter: blur ? `blur(${blur}px)` : undefined}}>
      <Camera dur={dur} from={1.0} to={1.12}>
        <Svg>
          <Sky id="hgs" stops={DSKY.heat} />
          <Dunescape t="heat" seed={81} hz={540} />
          <SunDisc t="heat" x={1500} y={160} />
          <rect x={0} y={0} width={W} height={H} fill="#fff4dc" opacity={0.15 + 0.05 * Math.sin(frame / 5)} />
          <path d={`M 0 640 C 500 600 1400 600 ${W} 640 L ${W} ${H} L 0 ${H} Z`} fill="#2a2420" />
          <g transform="translate(960 820)"><rect x={-320} y={-110} width={640} height={220} rx={24} fill="#0e0e0e" stroke="#3a3a3a" strokeWidth={6} />
            <text x={0} y={60} textAnchor="middle" fill={temp >= 50 ? '#ff5a3a' : '#ff9a40'} fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={150}>{temp}°C</text>
            <text x={-290} y={-70} fill="#8a8a88" fontFamily="DejaVu Sans Mono" fontSize={24}>OUTSIDE</text></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- mirror signal from the dune top */
export const MirrorDesert: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const flash = (frame % 40) < 6;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="md" stops={DSKY.dusk} />
          <SunDisc t="dusk" x={1500} y={640} />
          <Dunescape t="dusk" seed={85} hz={660} />
          <g transform="translate(760 940) scale(0.75)"><NoahStandBack outfit="trek" /><line x1={60} y1={-360} x2={160} y2={-470} stroke="#c88d69" strokeWidth={22} strokeLinecap="round" /><rect x={140} y={-500} width={40} height={40} fill="#e8f0f4" /></g>
          {flash && <><Glow id="mdf" cx={880} cy={590} r={260} color="#ffffff" opacity={0.9} /><Rays cx={880} cy={590} count={12} opacity={0.4} /></>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- jet high above */
export const PlaneHigh: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.2}>
        <Svg>
          <Sky id="ph" stops={[[0, '#123a7a'], [1, '#6aa6d0']]} />
          <Plane frame={frame} dur={dur} y={480} />
          <text x={lerp(300, 1700, frame / dur)} y={440} textAnchor="middle" fill="#ffffff" fontFamily="Inter" fontWeight={600} fontSize={30} opacity={interpolate(frame, [dur * 0.2, dur * 0.35], [0, 0.85], clamp)}>11,000 m</text>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- star navigation */
export const StarNav: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const show = p.phase === 'polaris';
  const dipper: [number, number][] = [[1240, 640], [1380, 600], [1500, 620], [1600, 680], [1640, 820], [1820, 840], [1840, 700]];
  const pol: [number, number] = [1560, 220];
  const draw = interpolate(frame, [20, dur * 0.5], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <Sky id="sn" stops={DSKY.night} />
          <Stars count={1400} maxY={H} seed={31} />
          <path d="M -100 900 C 500 600 1200 300 2100 0" stroke="#c9d4e8" strokeWidth={260} opacity={0.1} fill="none" />
          <path d="M -100 900 C 500 600 1200 300 2100 0" stroke="#e8eef8" strokeWidth={90} opacity={0.08} fill="none" />
          {show && <><path d={`M ${dipper.map((d) => d.join(' ')).join(' L ')}`} stroke="#9fc0e0" strokeWidth={3} fill="none" opacity={0.7 * draw} />
            <line x1={dipper[6][0]} y1={dipper[6][1]} x2={lerp(dipper[6][0], pol[0], draw)} y2={lerp(dipper[6][1], pol[1], draw)} stroke="#f2c27d" strokeWidth={4} strokeDasharray="12 10" />
            {dipper.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#ffffff" />)}
            <circle cx={pol[0]} cy={pol[1]} r={12} fill="#fff6e0" opacity={draw} /><Glow id="snp" cx={pol[0]} cy={pol[1]} r={80} color="#fff6e0" opacity={draw * 0.6} />
            <text x={pol[0]} y={pol[1] - 40} textAnchor="middle" fill="#f2c27d" fontFamily="Inter" fontWeight={700} fontSize={34} letterSpacing={4} opacity={draw}>POLARIS · NORTH</text></>}
          <Dunescape t="night" seed={91} hz={900} />
          <g transform={`translate(700 1010) scale(0.32)`}><NoahStandBack outfit="trek" /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- fennec / scorpion in torchlight */
export const Critter: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const fox = p.kind !== 'scorpion';
  return (
    <AbsoluteFill style={{background: '#05070c'}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          {fox ? <><Sky id="cf" stops={DSKY.night} /><Stars count={400} maxY={600} /><Dunescape t="night" seed={95} hz={640} />
            <g transform={`translate(1100 ${700 + Math.max(0, Math.sin(frame / 30)) * -6})`}>
              <ellipse cx={0} cy={60} rx={90} ry={50} fill="#d8b890" /><path d="M 70 60 C 160 40 200 100 160 130 C 120 110 100 90 70 80 Z" fill="#c8a880" /><path d="M 166 120 C 180 130 190 140 170 140" fill="#fff" />
              <circle cx={-80} cy={0} r={46} fill="#e0c098" /><path d="M -110 -20 L -150 -150 L -86 -40 Z M -70 -30 L -40 -160 L -50 -30 Z" fill="#e0c098" /><path d="M -112 -34 L -140 -130 L -96 -44 Z M -66 -40 L -46 -140 L -56 -40 Z" fill="#f0b0a0" opacity={0.6} />
              <path d="M -120 10 L -160 20 L -118 26 Z" fill="#e0c098" /><circle cx={-160} cy={20} r={6} fill="#1a1a1a" />
              <circle cx={-96} cy={-6} r={7} fill="#1a1a1a" /><circle cx={-66} cy={-6} r={7} fill="#1a1a1a" /><circle cx={-94} cy={-8} r={2} fill="#fff" />
              {[-60, -20, 30, 60].map((x) => <rect key={x} x={x} y={90} width={14} height={50} fill="#d0b088" />)}</g>
            <Glow id="cft" cx={1060} cy={720} r={420} color="#fff6d0" opacity={0.2} /></>
            : <><rect width={W} height={H} fill="#1a1410" />
              <circle cx={960} cy={560} r={520} fill="#c8a070" /><Glow id="cst" cx={960} cy={560} r={560} color="#fff0c8" opacity={0.35} />
              {Array.from({length: 30}, (_, i) => { const r = rng(i + 120); return <ellipse key={i} cx={500 + r() * 900} cy={200 + r() * 700} rx={6 + r() * 10} ry={4} fill="#a88050" opacity={0.6} />; })}
              <g transform={`translate(${lerp(900, 1200, Math.max(0, (frame - dur * 0.6) / (dur * 0.4)))} 600)`}>
                <ellipse cx={0} cy={0} rx={110} ry={46} fill="#d8b040" />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-70 + i * 45} cy={0} rx={22} ry={44} fill="none" stroke="#b08a20" strokeWidth={3} />)}
                <path d={`M 100 0 C 170 -10 200 -80 180 -150 C 170 -190 130 -200 ${120 + Math.sin(frame / 6) * 6} -170`} stroke="#d8b040" strokeWidth={30} fill="none" strokeLinecap="round" /><path d="M 120 -172 l -16 -24 l 26 6 Z" fill="#3a2a10" />
                <path d="M -100 -10 C -160 -40 -200 -60 -230 -40 M -100 10 C -160 40 -200 60 -230 40" stroke="#d8b040" strokeWidth={16} fill="none" /><ellipse cx={-250} cy={-46} rx={34} ry={18} fill="#d8b040" /><ellipse cx={-250} cy={46} rx={34} ry={18} fill="#d8b040" />
                {[-60, -20, 20, 60].map((x) => <path key={x} d={`M ${x} 30 l ${-20 + Math.sin(frame / 3 + x) * 6} 50 M ${x} -30 l ${-20 + Math.sin(frame / 3 + x) * 6} -50`} stroke="#c8a030" strokeWidth={8} />)}</g>
              <g transform="translate(560 860) rotate(-20)"><path d="M -200 80 C -100 0 0 -20 80 -20 L 120 30 C 60 40 -60 80 -160 160 Z" fill="#c88d69" /><path d="M 80 -20 C 120 -30 140 -10 120 30" stroke="#a87050" strokeWidth={6} fill="none" /></g></>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the mirage */
export const Mirage: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const hz = 560;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <Sky id="mr" stops={DSKY.heat} />
          <SunDisc t="heat" x={1450} y={170} />
          <DuneRow seed={101} base={hz} amp={70} period={480} col={SAND.heat[0]} shade={0.1} />
          <g transform={`translate(0 ${hz * 2 + 40}) scale(1 -1)`} opacity={0.35}><DuneRow seed={101} base={hz} amp={70} period={480} col="#9ab8c8" shade={0} /></g>
          {Array.from({length: 7}, (_, i) => <rect key={i} x={-100} y={hz + 10 + i * 12} width={W + 200} height={8} fill="#a8c8e0" opacity={0.45 + 0.3 * Math.sin(frame / 6 + i)} transform={`translate(${Math.sin(frame / 9 + i) * 20} 0)`} />)}
          <rect x={-100} y={hz + 6} width={W + 200} height={90} fill="#b8d4e8" opacity={0.35 + 0.1 * Math.sin(frame / 10)} />
          <DuneRow seed={103} base={hz + 260} amp={140} period={800} col={SAND.heat[2]} shade={0.18} crest="#fff4dc" />
          <DuneRow seed={104} base={H + 120} amp={200} period={1200} col={SAND.heat[3]} shade={0.2} crest="#fff4dc" />
          {p.walker && <g transform={`translate(${lerp(500, 900, frame / dur)} 900) scale(0.38)`}><NoahWalk phase={frame / 9} outfit="trek" rim="#fff6d0" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the well */
const WellRing: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={0} rx={200} ry={60} fill="#7a6048" />
    <ellipse cx={0} cy={-10} rx={150} ry={40} fill="#0e0a08" />
    {Array.from({length: 14}, (_, i) => { const a = (i / 14) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 176} cy={Math.sin(a) * 50 - 10} rx={40} ry={22} fill={i % 2 ? '#a88a68' : '#98785a'} />; })}
    <path d="M -200 0 L -200 60 C -100 110 100 110 200 60 L 200 0 C 100 60 -100 60 -200 0 Z" fill="#8a6c50" />
  </g>
);

export const Well: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'arrive';
  const t: T = phase === 'arrive' ? 'dawn' : 'day';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={phase === 'carvings' ? 1.0 : 1.0} to={phase === 'carvings' ? 1.25 : 1.08} origin={phase === 'carvings' ? '30% 75%' : undefined}>
        <Svg>
          <Sky id={`wl${t}`} stops={DSKY[t]} />
          <SunDisc t={t} x={phase === 'arrive' ? 500 : 1500} y={phase === 'arrive' ? 600 : 200} />
          <Dunescape t={t} seed={111} hz={620} />
          <path d="M 0 900 C 500 860 1400 860 1920 900 L 1920 1080 L 0 1080 Z" fill="#a07848" opacity={0.6} />
          <Acacia x={1380} y={880} s={1.6} frame={frame} />
          <g transform="translate(860 860)"><WellRing /></g>
          <g transform="translate(420 960)"><path d="M -200 40 C -180 -60 160 -80 220 20 L 200 80 L -200 80 Z" fill="#b8946a" />{phase === 'carvings' && <g stroke="#6a4a2a" strokeWidth={5} fill="none" opacity={0.8}><path d="M -120 20 l 10 -40 l 4 -30 M -110 -20 l 30 0 l 0 30 M -40 0 l 60 0 l -20 -20" /><path d="M 60 10 q 20 -16 40 0 q -20 16 -40 0 M 120 10 q 20 -16 40 0 q -20 16 -40 0" /></g>}</g>
          {phase === 'arrive' && <g transform={`translate(${lerp(200, 520, frame / dur)} 960) scale(0.55)`}><NoahWalk phase={frame / 8} outfit="trek" rim="#f8c080" /></g>}
          {phase === 'look' && <g transform="translate(640 940) scale(0.6)"><NoahSitting outfit="trek" phone={false} head={0.6} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const WellDown: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const fall = interpolate(frame, [dur * 0.3, dur * 0.55], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.18}>
        <Svg>
          <rect width={W} height={H} fill="#c8a070" />
          {Array.from({length: 9}, (_, i) => <circle key={i} cx={960} cy={540} r={620 - i * 64} fill={`rgb(${120 - i * 13},${92 - i * 10},${66 - i * 7})`} />)}
          {Array.from({length: 9}, (_, i) => Array.from({length: 16}, (_, j) => { const a = (j / 16) * Math.PI * 2 + i * 0.2; const rr = 620 - i * 64; return <ellipse key={`${i}-${j}`} cx={960 + Math.cos(a) * (rr - 20)} cy={540 + Math.sin(a) * (rr - 20)} rx={30 - i * 2} ry={16 - i} fill="#000" opacity={0.15} />; }))}
          <circle cx={960} cy={540} r={70} fill="#4a3424" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${960 + (i - 1.5) * 30} ${500} l ${10 - i * 6} 40 l ${-8 + i * 4} 30`} stroke="#2a1a10" strokeWidth={3} fill="none" />)}
          {fall < 1 && <circle cx={960 + fall * 10} cy={lerp(200, 540, fall)} r={lerp(30, 6, fall)} fill="#8a7a6a" />}
          {fall >= 1 && <circle cx={970} cy={540} r={8 + (frame % 10)} fill="none" stroke="#c8a070" strokeWidth={2} opacity={0.5} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- rock art */
export const RockArt: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, dur * 0.4], [0.4, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.zoom ? 1.1 : 1.0} to={p.zoom ? 1.6 : 1.08} origin={p.zoom ? '72% 70%' : undefined}>
        <Svg>
          <rect width={W} height={H} fill="#a8784a" />
          {Array.from({length: 50}, (_, i) => { const r = rng(i + 140); return <ellipse key={i} cx={r() * W} cy={r() * H} rx={40 + r() * 160} ry={20 + r() * 60} fill={r() > 0.5 ? '#b88858' : '#986a40'} opacity={0.5} />; })}
          <g stroke="#f0d8b0" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={glow}>
            <g transform="translate(380 560)"><path d="M -80 60 L -60 -10 L 60 -10 L 80 60 M -50 -10 L -40 60 M 50 -10 L 40 60 M 60 -10 L 110 -200 L 140 -210 M -60 -10 C -80 -20 -100 -10 -110 10" /><path d="M -40 -30 l 10 6 M 0 -30 l 10 6 M 40 -30 l 10 6" /></g>
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${780 + i * 150} ${420 + (i % 2) * 40})`}><path d="M -50 0 C -40 -30 40 -30 50 0 L 50 40 M -40 0 L -40 40 M 30 0 L 30 40 M 50 0 C 70 -10 80 -20 80 -40 M 74 -40 l -14 -16 M 84 -40 l 14 -16" /></g>)}
            <g transform="translate(900 760)"><path d="M -160 0 C -80 40 80 40 160 0" /><path d="M -20 0 L -10 -80 M -40 -50 L 20 -50 M -10 -80 m -14 -20 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" /><path d="M 30 -40 L 120 60" /></g>
            {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1360 + i * 120} ${760 + (i % 2) * 30})`}><path d="M -40 0 C -20 -30 30 -30 40 0 C 30 30 -20 30 -40 0 Z M 40 0 L 70 -24 L 70 24 Z" /><circle cx={-16} cy={-4} r={3} /></g>)}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the Sahara, six thousand years ago */
export const GreenSahara: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const fade = p.fade ? interpolate(frame, [dur * 0.45, dur * 0.85], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <Sky id="gs" stops={[[0, '#2a6ab0'], [0.6, '#8ac0e0'], [1, '#e8f0e0']]} />
          <SunDisc t="day" x={1500} y={180} />
          <path d={`M -100 600 ${Array.from({length: 30}, (_, i) => `L ${i * 75} ${600 - Math.abs(Math.sin(i / 3)) * 60}`).join(' ')} L 2100 600 L 2100 1100 L -100 1100 Z`} fill="#7a9a4a" />
          <path d="M -100 680 C 300 640 700 700 1100 660 C 1500 620 1800 680 2100 650 L 2100 1100 L -100 1100 Z" fill="#6a8a3a" />
          <path d="M -100 760 C 400 720 900 820 1300 760 C 1600 720 1900 760 2100 740 L 2100 900 C 1700 860 1200 940 700 880 C 300 840 0 880 -100 880 Z" fill="#3a8ac0" />
          {Array.from({length: 10}, (_, i) => <path key={i} d={`M ${(i * 220 + frame) % 2100 - 100} ${800 + (i % 3) * 25} q 30 -6 60 0`} stroke="#ffffff" strokeWidth={3} opacity={0.5} fill="none" />)}
          <path d="M -100 920 C 500 880 1400 900 2100 900 L 2100 1100 L -100 1100 Z" fill="#5a7a2e" />
          <Acacia x={300} y={700} s={1.2} frame={frame} col="#3a2a18" /><Acacia x={1650} y={690} s={0.9} frame={frame} col="#3a2a18" />
          {[0, 1].map((i) => <g key={i} transform={`translate(${1100 + i * 170 + Math.sin(frame / 50 + i) * 10} 690)`}><path d="M -40 0 L -36 -60 L 40 -60 L 44 0 M 30 -60 L 90 -230 L 112 -236" stroke="#d8a050" strokeWidth={16} fill="none" strokeLinecap="round" /><ellipse cx={0} cy={-66} rx={50} ry={26} fill="#d8a050" /></g>)}
          {[0, 1, 2].map((i) => <ellipse key={i} cx={700 + i * 90} cy={830} rx={50} ry={18} fill="#5a5a6a" />)}
          {Array.from({length: 4}, (_, i) => <path key={i} d={`M ${560 + i * 60} ${670 - (i % 2) * 8} c 20 -6 40 -6 60 0 l 0 30 m -50 -30 l 0 30`} stroke="#5a3a24" strokeWidth={7} fill="none" />)}
          <Birds count={8} x={600} y={300} vx={1.2} vy={-0.2} scale={1.2} color="#2a2a2a" />
          {fade > 0 && <g opacity={fade}><Sky id="gsd" stops={DSKY.heat} /><SunDisc t="heat" x={1500} y={180} /><Dunescape t="heat" seed={121} hz={600} /><Acacia x={1380} y={860} s={1.2} frame={frame} /><path d="M 760 1100 C 700 980 820 900 760 800 C 720 720 780 660 760 600" stroke="#e8d0a0" strokeWidth={40} fill="none" opacity={0.6} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- digging for water (cross-section) */
export const Dig: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const depth = p.depth ?? 0;
  const prog = interpolate(frame, [0, dur * 0.8], [0, 1], clamp);
  const holeY = 520 + (depth + prog) * 110;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="dg" stops={DSKY.heat} />
          <rect x={0} y={420} width={W} height={H} fill="#d8b47e" />
          <rect x={0} y={760} width={W} height={H} fill="#b8925e" />
          <rect x={0} y={860} width={W} height={H} fill="#8a6a44" />
          <rect x={0} y={860} width={W} height={12} fill="#6a5034" opacity={0.6} />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${1300 + i * 30} 440 C ${1260 + i * 50} 600 ${1200 + i * 20} 760 ${1100 + i * 40} ${900 + i * 20}`} stroke="#6a4a2a" strokeWidth={6 - i * 0.6} fill="none" opacity={0.7} />)}
          <Acacia x={1360} y={440} s={1.1} frame={frame} />
          <path d={`M 860 420 L 880 ${holeY} L 1040 ${holeY} L 1060 420 Z`} fill="#4a3424" />
          <path d={`M 860 420 L 880 ${holeY} L 1040 ${holeY} L 1060 420 Z`} fill="#000" opacity={0.25} />
          <path d={`M 740 420 C 760 ${400 - depth * 20} 840 ${390 - depth * 30} 860 420 Z`} fill="#c8a06a" />
          {p.water && <rect x={884} y={holeY - interpolate(frame, [dur * 0.2, dur], [0, 34], clamp)} width={152} height={interpolate(frame, [dur * 0.2, dur], [0, 34], clamp)} fill="#7a6a4a" opacity={0.9} />}
          {p.water && <rect x={890} y={holeY - interpolate(frame, [dur * 0.2, dur], [0, 34], clamp)} width={140} height={4} fill="#c8d8e0" opacity={0.6} />}
          <g transform={`translate(960 ${Math.min(holeY - 60, 520 + Math.sin(frame / 6) * 30)}) rotate(${Math.sin(frame / 6) * 15})`}><rect x={-6} y={-200} width={12} height={180} fill="#5a4030" /><path d="M -30 -30 L 30 -30 L 24 30 L 0 46 L -24 30 Z" fill="#8a8a88" /></g>
          <text x={240} y={depth >= 2 ? 840 : 600} fill="#3a2414" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={40}>{['DRY', 'DRY', 'DAMP', 'WATER'][depth]}</text>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- signal fire by the well */
export const SignalFire: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="sf" stops={DSKY.day} />
          <SunDisc t="day" x={1600} y={160} />
          <Dunescape t="day" seed={131} hz={620} />
          {Array.from({length: 22}, (_, i) => <ellipse key={i} cx={1000 + Math.sin(i / 2 + frame / 30) * 10 * i / 3} cy={820 - i * 40 - ((frame * 0.8) % 40)} rx={30 + i * 6} ry={26 + i * 4} fill="#9a9a94" opacity={0.75 - i * 0.03} />)}
          <g transform="translate(1000 880) scale(1.1)"><Fire frame={frame} /></g>
          <g transform="translate(560 900)"><WellRing s={0.7} /></g>
          <Acacia x={300} y={880} s={1.3} frame={frame} />
          <g transform="translate(1300 960) scale(0.6)"><g transform="scale(-1 1)"><NoahSitting outfit="trek" phone={false} head={0.2} /></g></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the caravan */
export const Caravan: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'dusk';
  const frame = useCurrentFrame();
  const night = t === 'night';
  const n = 7;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} x={[30, -30]}>
        <Svg>
          <Sky id={`cv${t}`} stops={DSKY[t]} />
          {night && <><Stars count={900} maxY={700} /><path d="M -100 700 C 500 400 1300 200 2100 0" stroke="#c9d4e8" strokeWidth={200} opacity={0.08} fill="none" /></>}
          <SunDisc t={t} x={1500} y={600} />
          <DuneRow seed={141} base={640} amp={60} period={500} col={SAND[t][0]} shade={0.12} />
          <DuneRow seed={142} base={780} amp={120} period={1400} col={SAND[t][1]} shade={0.1} />
          {Array.from({length: n}, (_, i) => {
            const x = ((i * 240 + frame * 1.6) % (n * 240 + 400)) - 300;
            const y = 690 - Math.sin((x / W) * Math.PI) * 30;
            const rider = p.noah && i === 3 ? '#e8e0d0' : i % 3 === 0 ? '#1a2a6a' : undefined;
            return <g key={i} transform={`translate(${x} ${y}) scale(0.42)`}><Camel phase={frame / 9 + i} rider={rider} col={night ? '#1a1a22' : t === 'dusk' ? '#2a1a14' : '#a8804e'} load={!rider} /></g>;
          })}
          <DuneRow seed={143} base={H + 100} amp={180} period={1100} col={SAND[t][3]} shade={0.2} />
          {night && <rect width={W} height={H} fill="#06102a" opacity={0.3} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- three glasses of tea */
export const Tea: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pour = interpolate(frame, [dur * 0.15, dur * 0.7], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0a0806'}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill="#140e0a" />
          <Glow id="tg" cx={960} cy={1000} r={1000} color="#f0a050" opacity={0.45} />
          <ellipse cx={960} cy={860} rx={620} ry={120} fill="#c8a050" /><ellipse cx={960} cy={850} rx={580} ry={100} fill="#d8b060" />
          {[0, 1, 2].map((i) => { const fill = Math.min(1, Math.max(0, pour * 3 - i)); return <g key={i} transform={`translate(${720 + i * 240} 800)`}>
            <path d="M -50 -130 L 50 -130 L 40 40 L -40 40 Z" fill="#e8f0e8" opacity={0.35} />
            <path d={`M ${-50 + 10 * (1 - fill)} ${40 - 170 * fill} L ${50 - 10 * (1 - fill)} ${40 - 170 * fill} L 40 40 L -40 40 Z`} fill="#a8501a" opacity={0.9} />
            {fill > 0.9 && <ellipse cx={0} cy={-128} rx={46} ry={8} fill="#f0e0c0" opacity={0.8} />}
            <path d="M -50 -130 L -40 40 M 50 -130 L 40 40" stroke="#ffffff" strokeWidth={3} opacity={0.5} /></g>; })}
          {(() => { const gi = Math.min(2, Math.floor(pour * 3)); const gx = 720 + gi * 240; return <g>
            <g transform={`translate(${gx + 260} 210)`}><ellipse cx={0} cy={0} rx={90} ry={70} fill="#c8c6c0" /><ellipse cx={0} cy={-64} rx={40} ry={14} fill="#b8b6b0" /><circle cx={0} cy={-84} r={12} fill="#a8a6a0" />
              <path d="M 86 -20 C 140 -20 140 40 84 30" stroke="#a8a6a0" strokeWidth={14} fill="none" /><path d="M -80 10 C -110 10 -120 30 -112 40" stroke="#c8c6c0" strokeWidth={18} fill="none" strokeLinecap="round" /></g>
            {pour < 1 && <path d={`M ${gx + 148} 252 C ${gx + 40} 400 ${gx + 10} 560 ${gx} 680`} stroke="#b8601e" strokeWidth={8} fill="none" opacity={0.85} />}</g>; })()}
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M ${720 + (i % 3) * 240} ${640 - ((frame * 1.2 + i * 30) % 120)} q 14 -20 0 -40`} stroke="#ffffff" strokeWidth={3} opacity={0.2} fill="none" />)}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
