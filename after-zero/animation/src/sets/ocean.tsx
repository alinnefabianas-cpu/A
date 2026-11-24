import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Birds, C, Camera, clamp, Dust, Fog, Glow, H, lerp, Rays, rng, Sky, Svg, useProgress, W} from '../lib';
import {NoahLying, NoahSitting, NoahStandBack} from '../noah';
import {camFor, mouth, Rain, SetProps, Stars} from './common';
import {Face, Person} from './jungle';

type T = 'dawn' | 'day' | 'dusk' | 'night' | 'storm' | 'rain';
const OSKY: Record<T, [number, string][]> = {
  dawn: [[0, '#2a3a5a'], [0.55, '#c08a8a'], [0.8, '#f0b888'], [1, '#f6d0a0']],
  day: [[0, '#2a6ab0'], [0.6, '#7ab8e0'], [1, '#d0ecf8']],
  dusk: [[0, '#1a2040'], [0.45, '#6a3a5a'], [0.7, '#e0703a'], [1, '#f0a050']],
  night: [[0, '#01030a'], [0.7, '#06101e'], [1, '#0a1828']],
  storm: [[0, '#1a2228'], [0.6, '#3a464c'], [1, '#5a666a']],
  rain: [[0, '#3a4a58'], [0.6, '#6a7a86'], [1, '#8a98a0']],
};
const SEA: Record<T, [string, string]> = {
  dawn: ['#3a5a7a', '#1a3050'], day: ['#1a6aa0', '#0a3a6a'], dusk: ['#4a3a5a', '#1a1a3a'],
  night: ['#06121e', '#020810'], storm: ['#2a3a44', '#141e24'], rain: ['#3a5a6a', '#1a3040'],
};

const useShake = (amt: number) => {
  const frame = useCurrentFrame();
  const r = rng(frame * 19 + 7);
  return amt ? [(r() - 0.5) * 30 * amt, (r() - 0.5) * 22 * amt] : [0, 0];
};

/** layered sea surface with moving wave lines */
const Sea: React.FC<{t: T; y: number; seed?: number; amp?: number}> = ({t, y, seed = 1, amp = 1}) => {
  const frame = useCurrentFrame();
  const [a, b] = SEA[t];
  const r = rng(seed + 900);
  const lines = Array.from({length: 26}, () => ({y: Math.pow(r(), 1.5), x: r() * W, w: 40 + r() * 160, ph: r() * 6}));
  return (
    <g>
      <defs><linearGradient id={`sea${t}${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <rect x={-200} y={y} width={W + 400} height={H - y + 200} fill={`url(#sea${t}${seed})`} />
      {lines.map((l, i) => {
        const yy = y + 6 + l.y * (H - y);
        const x = (l.x + frame * (0.4 + l.y) * 0.8) % (W + 300) - 150;
        const w = l.w * (0.3 + l.y);
        return <path key={i} d={`M ${x} ${yy + Math.sin(frame / 20 + l.ph) * 4 * amp} q ${w / 2} ${-6 * amp * (0.4 + l.y)} ${w} 0`} stroke={t === 'night' ? '#1a2a3a' : '#ffffff'} strokeWidth={1.5 + l.y * 3} fill="none" opacity={t === 'night' ? 0.4 : 0.35} />;
      })}
    </g>
  );
};

/** orange canopy life raft */
export const RaftShape: React.FC<{frame: number; sail?: boolean; noahOut?: boolean; waving?: boolean}> = ({frame, sail, noahOut, waving}) => {
  const bob = Math.sin(frame / 18) * 6;
  return (
    <g transform={`translate(0 ${bob}) rotate(${Math.sin(frame / 24) * 3})`}>
      <ellipse cx={0} cy={0} rx={150} ry={40} fill="#e0602a" />
      <ellipse cx={0} cy={-8} rx={134} ry={28} fill="#c84e22" />
      {!sail && <path d="M -120 -10 C -110 -150 110 -150 120 -10 Z" fill="#f07a3a" />}
      {!sail && <path d="M -40 -20 C -36 -90 36 -90 40 -20 Z" fill="#1a1a1a" opacity={0.6} />}
      {!sail && <rect x={-6} y={-150} width={12} height={20} fill="#2a2a2a" />}
      {sail && <><line x1={-60} y1={-10} x2={-30} y2={-260} stroke="#c9b08a" strokeWidth={8} /><line x1={60} y1={-10} x2={30} y2={-260} stroke="#c9b08a" strokeWidth={8} />
        <path d={`M -30 -258 C ${10 + Math.sin(frame / 10) * 20} -200 ${10 + Math.sin(frame / 10) * 20} -80 -50 -40 L 50 -40 C 70 -100 70 -200 30 -258 Z`} fill="#f07a3a" />
        <g transform="translate(-10 -16) scale(0.32)"><NoahSitting outfit="trek" phone={false} head={0.4} /></g></>}
      {noahOut && <g transform={`translate(10 -30) scale(0.32)`}><NoahStandBack outfit="trek" /></g>}
      {waving && <line x1={20} y1={-150} x2={60 + Math.sin(frame / 3) * 30} y2={-220} stroke="#c88d69" strokeWidth={8} strokeLinecap="round" />}
      <path d="M -150 0 C -100 30 100 30 150 0" stroke="#ffffff" strokeWidth={3} opacity={0.4} fill="none" />
    </g>
  );
};

/** yacht side view */
const Yacht: React.FC<{frame: number; sinking?: number}> = ({frame, sinking = 0}) => (
  <g transform={`rotate(${sinking * 24} 0 0) translate(0 ${sinking * 120})`}>
    <path d="M -300 0 C -280 40 260 40 320 0 L 300 -40 L -290 -40 Z" fill="#f4f4f0" />
    <path d="M -296 -10 L 312 -14" stroke="#1f4a7a" strokeWidth={8} />
    <rect x={-120} y={-80} width={180} height={40} rx={10} fill="#e8e8e0" /><rect x={-100} y={-70} width={30} height={16} rx={4} fill="#3a5a7a" /><rect x={-50} y={-70} width={30} height={16} rx={4} fill="#3a5a7a" />
    <rect x={-6} y={-460} width={10} height={420} fill="#c9c9c0" />
    <path d={`M 4 -450 C ${120 + Math.sin(frame / 20) * 10} -300 ${150 + Math.sin(frame / 20) * 10} -150 4 -60 Z`} fill="#3a7ab8" />
    <path d={`M -6 -430 C -90 -300 -140 -160 -150 -60 L -6 -60 Z`} fill="#5a9ad0" />
  </g>
);

/* ---------------------------------------------------------- open ocean */
export const Ocean: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const hz = p.aerial ? 260 : 560;
  const cam = camFor(seed + 500, 0.6);
  const night = t === 'night';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.aerial ? 1.0 : cam.from} to={p.aerial ? 0.92 : cam.to} x={p.aerial ? [0, 0] : cam.x}>
        <Svg>
          <Sky id="oc" stops={OSKY[t]} />
          {night && <Stars count={500} maxY={hz} />}
          {(t === 'day') && <><Glow id="ocs" cx={1400} cy={hz - 340} r={700} color="#fff6e0" opacity={0.5} /><circle cx={1400} cy={hz - 340} r={50} fill="#fffaf0" /></>}
          {(t === 'dusk' || t === 'dawn') && <><Glow id="ocd" cx={1300} cy={hz} r={900} color={t === 'dusk' ? '#f0a050' : '#f6d0a0'} opacity={0.6} /><circle cx={1300} cy={hz - 20} r={70} fill="#fff0d0" /><Rays cx={1300} cy={hz} count={16} opacity={0.08} /></>}
          {t === 'day' && Array.from({length: 6}, (_, i) => <ellipse key={i} cx={((i * 380 + frame * 0.4) % (W + 500)) - 250} cy={hz - 160 - (i % 3) * 60} rx={160} ry={36} fill="#ffffff" opacity={0.7} />)}
          {p.cloudStack && <g><ellipse cx={600} cy={hz - 120} rx={180} ry={120} fill="#ffffff" /><ellipse cx={560} cy={hz - 200} rx={120} ry={90} fill="#ffffff" /><ellipse cx={660} cy={hz - 220} rx={100} ry={80} fill="#f4f8fa" /><rect x={420} y={hz - 6} width={360} height={6} fill="#3a6a8a" opacity={0.3} /></g>}
          <Sea t={t} y={hz} seed={seed} amp={t === 'storm' ? 3 : 1} />
          {(t === 'dusk' || t === 'dawn') && <path d={`M 1240 ${hz} L 1360 ${hz} L 1500 ${H} L 1100 ${H} Z`} fill="#f0b070" opacity={0.25} />}
          {night && <path d={`M 1180 ${hz} L 1220 ${hz} L 1320 ${H} L 1080 ${H} Z`} fill="#cfe0f0" opacity={0.06} />}
          {p.raft && <g transform={`translate(${p.far ? 1100 : 960} ${p.aerial ? 640 : hz + 140}) scale(${p.far || p.aerial ? 0.28 : 0.6})`}><RaftShape frame={frame} /></g>}
          {p.yachtFar && <g transform={`translate(900 ${hz + 20}) scale(0.18)`}><Yacht frame={frame} /></g>}
          {p.light && <circle cx={lerp(1500, 1800, frame / dur)} cy={hz + 4} r={3} fill="#fff6d0" opacity={interpolate(frame, [0, dur], [1, 0], clamp)} />}
          {p.bird && <g transform={`translate(${lerp(900, 300, frame / dur)} ${hz - 120 - Math.sin(frame / 20) * 10})`}><path d="M -50 0 C -20 -12 20 -12 50 0 M 0 -4 L 0 4" stroke="#1a1a1a" strokeWidth={4} fill="none" /></g>}
          {t === 'storm' && <Rain count={260} opacity={0.4} angle={14} />}
          {t === 'rain' && <Rain count={300} opacity={0.5} angle={4} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- raft close exterior */
export const Raft: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 510, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="rf" stops={OSKY[t]} />
          {t === 'day' && <circle cx={1500} cy={160} r={50} fill="#fffaf0" />}
          {(t === 'dusk' || t === 'dawn') && <><Glow id="rfg" cx={1400} cy={520} r={900} color="#f0a050" opacity={0.5} /><circle cx={1400} cy={520} r={60} fill="#fff0d0" /></>}
          <Sea t={t} y={520} seed={seed} amp={1.5} />
          <g transform="translate(960 760) scale(1.6)"><RaftShape frame={frame} waving={p.waving} noahOut={p.waving} /></g>
          {p.fins && [0, 1].map((i) => <path key={i} d={`M ${(300 + i * 900 + frame * (i ? -1.2 : 1.4) + 2000) % 2000} ${820 + i * 60} l 30 -70 l 26 70 Z`} fill="#3a4a54" />)}
          {t === 'rain' && <Rain count={320} opacity={0.5} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- inside the raft */
export const RaftInside: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const [sx, sy] = useShake(p.shake ?? 0);
  const night = t === 'night' || t === 'storm';
  const sway = Math.sin(frame / 20) * 3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px) rotate(${sway}deg)`}}>
        <Camera dur={dur} from={1.04} to={1.08}>
          <Svg>
            <rect width={W} height={H} fill={night ? '#2a120a' : '#e0703a'} />
            <path d="M 0 0 C 400 -100 1520 -100 1920 0 L 1920 300 C 1500 200 420 200 0 300 Z" fill={night ? '#1a0a06' : '#c85a2a'} />
            {/* opening to the sea */}
            <path d="M 1240 200 C 1260 420 1640 420 1680 200 L 1680 760 L 1240 760 Z" fill={night ? '#06121e' : '#2a6ab0'} />
            <rect x={1240} y={520} width={440} height={240} fill={night ? '#06121e' : '#1a5a90'} />
            <rect x={0} y={800} width={W} height={280} fill={night ? '#1a0a06' : '#a84a22'} />
            <ellipse cx={960} cy={1000} rx={900} ry={200} fill={night ? '#140804' : '#904020'} />
            {!night && <Glow id="rig" cx={1460} cy={400} r={600} color="#fff6e0" opacity={0.4} />}
            <g transform="translate(700 960) scale(1.15)"><NoahSitting outfit="trek" phone={false} head={p.shout ? 0 : 0.6} breath={(Math.sin(frame / 22) + 1) / 2} /></g>
            {p.fish && <g transform="translate(1000 900)"><path d="M -80 0 C -40 -40 60 -40 90 0 C 60 40 -40 40 -80 0 Z M 90 0 L 130 -30 L 130 30 Z" fill="#c9d040" /></g>}
            <g transform="translate(1100 900)"><rect x={0} y={0} width={110} height={70} rx={14} fill="#e8a020" /><rect x={130} y={20} width={50} height={60} rx={8} fill="#cfe8f0" opacity={0.7} /></g>
            {t === 'storm' && <rect width={W} height={H} fill="#000" opacity={0.3 + 0.2 * Math.sin(frame)} />}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- grab-bag inventory flat-lay */
export const Inventory: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const lost = !!p.lost;
  const items = [
    {k: 'water', x: 300, y: 300, show: true}, {k: 'water', x: 420, y: 300, show: !lost}, {k: 'water', x: 540, y: 300, show: !lost},
    {k: 'bisc', x: 300, y: 560, show: true}, {k: 'bisc', x: 440, y: 560, show: !lost},
    {k: 'fishing', x: 760, y: 320, show: !lost}, {k: 'mirror', x: 780, y: 600, show: true}, {k: 'flare', x: 1060, y: 300, show: true}, {k: 'flare', x: 1130, y: 300, show: true},
    {k: 'knife', x: 1060, y: 620, show: true}, {k: 'still', x: 1440, y: 400, show: !lost}, {k: 'bailer', x: 1460, y: 720, show: true},
  ];
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <rect width={W} height={H} fill="#c85a2a" />
          {Array.from({length: 10}, (_, i) => <ellipse key={i} cx={960} cy={540} rx={900 - i * 70} ry={500 - i * 40} fill="none" stroke="#b04a20" strokeWidth={3} />)}
          {items.map((it, i) => {
            const a = interpolate(frame, [i * 4, i * 4 + 8], [0, 1], clamp);
            if (!it.show) return <g key={i} opacity={0.35}><rect x={it.x - 40} y={it.y - 40} width={100} height={100} rx={12} fill="none" stroke="#8a3010" strokeWidth={4} strokeDasharray="10 8" /></g>;
            return <g key={i} opacity={a} transform={`translate(${it.x} ${it.y})`}>
              {it.k === 'water' && <><rect x={-40} y={-60} width={90} height={130} rx={14} fill="#cfe8f0" /><rect x={-40} y={-20} width={90} height={90} rx={14} fill="#8ac0d8" opacity={0.8} /></>}
              {it.k === 'bisc' && <><rect x={-60} y={-40} width={120} height={80} rx={6} fill="#d8c890" /><rect x={-60} y={-10} width={120} height={20} fill="#c0392b" /></>}
              {it.k === 'fishing' && <><rect x={-70} y={-50} width={140} height={100} rx={10} fill="#3a6a4a" /><circle cx={0} cy={0} r={30} fill="none" stroke="#e8e8e0" strokeWidth={6} /></>}
              {it.k === 'mirror' && <><rect x={-60} y={-60} width={120} height={120} rx={8} fill="#d8e8f0" /><circle cx={0} cy={0} r={10} fill="#1a1a1a" /></>}
              {it.k === 'flare' && <><rect x={-16} y={-80} width={32} height={160} rx={8} fill="#e83a2a" /><rect x={-16} y={-80} width={32} height={30} fill="#1a1a1a" /></>}
              {it.k === 'knife' && <><rect x={-80} y={-10} width={90} height={20} rx={6} fill="#2a2a2a" /><path d="M 10 -10 L 100 0 L 10 10 Z" fill="#c9c9c0" /></>}
              {it.k === 'still' && <><ellipse cx={0} cy={40} rx={120} ry={30} fill="#e8a020" /><path d="M -100 40 L 0 -100 L 100 40 Z" fill="#cfe8f0" opacity={0.7} /></>}
              {it.k === 'bailer' && <path d="M -60 -40 L 60 -40 L 40 40 L -40 40 Z" fill="#e8e8e0" />}
            </g>;
          })}
          {lost && <text x={960} y={980} textAnchor="middle" fill="#fff0e0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={40}>LOST IN THE STORM</text>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the skipper and the researcher */
const LEON: Face = {skin: '#d8a888', hair: '#c9c9c0', shirt: '#1f4a7a', grey: true};
const HANA: Face = {skin: '#c8906a', hair: '#1a1410', shirt: '#4a7a6a', female: true, young: true};

const Portrait: React.FC<SetProps & {face: Face; who: string; bg: Record<string, React.ReactNode>}> = ({dur, p, talk, face, who, bg}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? Object.keys(bg)[0];
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 31) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const cam = camFor(seed + 520, 0.5);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          {bg[mode] ?? Object.values(bg)[0]}
          <g transform={`translate(820 ${650 + Math.sin(frame / 24) * 3}) scale(1.35)`}>
            <Person f={face} talk={mouth(frame, talk, who)} blink={blink} worried={p.worried} smile={p.smile && !(talk && frame >= talk.from && frame <= talk.to)} />
            {who === 'LEON' && <><path d="M -112 -40 C -112 -130 112 -130 112 -40 C 70 -70 -70 -70 -112 -40 Z" fill="#e8e6e0" /><rect x={-30} y={-134} width={140} height={22} rx={10} fill="#1f3a5a" transform="rotate(-8)" />
              <path d="M -64 86 C -56 140 56 140 64 86 C 40 112 -40 112 -64 86 Z" fill="#e8e6e0" opacity={0.9} /><path d="M -40 58 C -20 50 20 50 40 58" stroke="#e8e6e0" strokeWidth={10} fill="none" strokeLinecap="round" /></>}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Leon: React.FC<SetProps> = (props) => {
  const frame = useCurrentFrame();
  return <Portrait {...props} face={LEON} who="LEON" bg={{
    dock: <><Sky id="ld" stops={OSKY.day} /><rect x={0} y={640} width={W} height={440} fill="#1a6aa0" />{Array.from({length: 5}, (_, i) => <rect key={i} x={200 + i * 380} y={260} width={8} height={400} fill="#e8e8e0" />)}<rect x={0} y={860} width={W} height={220} fill="#8a6a4a" /></>,
    night: <><Sky id="ln" stops={OSKY.night} /><Stars count={300} maxY={700} /><rect x={0} y={700} width={W} height={380} fill="#06121e" /><Glow id="lng" cx={1500} cy={800} r={500} color="#f2c27d" opacity={0.25} /></>,
    phone: <><rect width={W} height={H} fill="#e8dcc4" /><rect x={1250} y={180} width={500} height={400} fill="#a9d0e8" /><Glow id="lpg" cx={1500} cy={380} r={800} color="#fff6e0" opacity={0.5} /><rect x={1180} y={520} width={60} height={110} rx={14} fill="#1a1a1a" transform={`rotate(${Math.sin(frame / 30) * 2} 1210 575)`} /></>,
  }} />;
};

export const Hana: React.FC<SetProps> = (props) => <Portrait {...props} face={HANA} who="HANA" bg={{
  beach: <><Sky id="hb" stops={OSKY.day} /><rect x={0} y={600} width={W} height={200} fill="#40c0c8" /><rect x={0} y={760} width={W} height={320} fill="#f0e0b8" />
    {[200, 1600].map((x) => <g key={x}><path d={`M ${x} 760 C ${x + 20} 600 ${x - 10} 400 ${x + 30} 260`} stroke="#8a6a4a" strokeWidth={22} fill="none" />{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M ${x + 30} 260 q ${-120 + k * 60} 40 ${-180 + k * 90} 140`} stroke="#3a8a4a" strokeWidth={16} fill="none" />)}</g>)}</>,
  station: <><rect width={W} height={H} fill="#e8ecee" /><rect x={1200} y={180} width={560} height={380} fill="#9fd8e8" /><Glow id="hsg" cx={1480} cy={370} r={800} color="#fff6e0" opacity={0.5} />
    {Array.from({length: 6}, (_, i) => <rect key={i} x={140 + i * 150} y={200} width={110} height={150} fill="#d8dcde" stroke="#a8acae" strokeWidth={4} />)}</>,
}} />;

/* ---------------------------------------------------------- the yacht */
export const YachtSet: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="yc" stops={OSKY[t]} />
          {t === 'night' && <><Stars count={600} maxY={560} /><path d="M -100 400 C 500 200 1300 120 2100 40" stroke="#c9d4e0" strokeWidth={150} opacity={0.07} fill="none" /></>}
          {t === 'day' && <circle cx={1500} cy={180} r={50} fill="#fffaf0" />}
          {t === 'dusk' && <><Glow id="ycg" cx={1400} cy={560} r={900} color="#f0a050" opacity={0.55} /><circle cx={1400} cy={560} r={60} fill="#fff0d0" /></>}
          <Sea t={t} y={560} seed={seed} />
          <g transform={`translate(900 ${700 + Math.sin(frame / 20) * 8}) rotate(${Math.sin(frame / 26) * 3}) scale(0.9)`}><Yacht frame={frame} />
            {t === 'night' && <><circle cx={-6} cy={-460} r={6} fill="#ffffff" /><Glow id="ycl" cx={-6} cy={-460} r={40} color="#ffffff" opacity={0.5} /><g transform="translate(-200 -40) scale(0.22)"><NoahStandBack outfit="trek" /></g></>}</g>
          {p.dolphins && [0, 1, 2].map((i) => { const k = ((frame / 50 + i / 3) % 1); const y = 760 - Math.sin(k * Math.PI) * 70; return k < 0.5 ? <path key={i} d={`M ${1200 + i * 120 + k * 200} ${y} q 60 -40 120 0 q -20 10 -60 14 Z`} fill="#8aa0b0" /> : null; })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const YachtCabin: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const flood = p.flooding ? interpolate(frame, [0, dur], [0.05, 0.55], clamp) : 0;
  const [sx, sy] = useShake(p.flooding ? 0.4 : 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px) rotate(${p.flooding ? 6 : 0}deg)`}}>
        <Camera dur={dur} from={1.0} to={1.06}>
          <Svg>
            <rect width={W} height={H} fill="#6a4a2e" />
            {Array.from({length: 14}, (_, i) => <rect key={i} x={0} y={i * 80} width={W} height={6} fill="#5a3a22" />)}
            <rect x={200} y={300} width={300} height={500} fill="#7a5a3a" />
            <rect x={1300} y={200} width={160} height={110} rx={50} fill={p.flooding ? '#06121e' : '#a9d0e8'} />
            <g transform="translate(860 560)"><rect x={-80} y={-120} width={160} height={240} rx={16} fill="#e8a020" /><text x={0} y={10} textAnchor="middle" fill="#1a1a1a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={30}>GRAB</text><text x={0} y={46} textAnchor="middle" fill="#1a1a1a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={30}>BAG</text></g>
            <Glow id="ycg2" cx={960} cy={200} r={700} color={p.flooding ? '#ff4a3a' : '#f2c27d'} opacity={p.flooding ? 0.3 + 0.2 * Math.sin(frame / 3) : 0.35} />
            {flood > 0 && <><rect x={-100} y={H - flood * H} width={W + 200} height={flood * H + 100} fill="#0a2a3a" opacity={0.85} />
              {Array.from({length: 8}, (_, i) => <path key={i} d={`M ${i * 260 + (frame * 4) % 260} ${H - flood * H} q 60 -14 120 0`} stroke="#cfe8f0" strokeWidth={4} fill="none" />)}</>}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the floating container */
export const Container: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const hit = p.phase === 'hit';
  const [sx, sy] = useShake(hit && frame < 20 ? 1.2 : 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={1.0} to={hit ? 1.0 : 1.12}>
          <Svg>
            <Sky id="ct" stops={OSKY.night} />
            <Stars count={300} maxY={500} />
            <Sea t="night" y={500} />
            <g transform={`translate(${hit ? 960 : lerp(1400, 1100, frame / dur)} 620) rotate(-6)`}>
              <rect x={-360} y={-40} width={720} height={110} fill="#6a2a20" />
              {Array.from({length: 18}, (_, i) => <rect key={i} x={-350 + i * 40} y={-40} width={6} height={110} fill="#4a1a14" />)}
              <rect x={-360} y={-40} width={720} height={14} fill="#06121e" opacity={0.7} />
              <rect x={-400} y={-10} width={800} height={120} fill="#06121e" opacity={0.7} />
            </g>
            {hit && <><g transform="translate(700 520) rotate(30) scale(0.55)"><Yacht frame={frame} /></g>
              <rect width={W} height={H} fill="#ffffff" opacity={interpolate(frame, [0, 3, 14], [0, 0.8, 0], clamp)} />
              {Array.from({length: 30}, (_, i) => { const r = rng(i); return <circle key={i} cx={900 + (r() - 0.5) * 300} cy={600 - r() * 200 * Math.min(1, frame / 10)} r={6 + r() * 10} fill="#cfe8f0" opacity={0.7} />; })}</>}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- sinking */
export const Sinking: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'raft';
  const sink = phase === 'raft' ? 0.15 : phase === 'sink' ? interpolate(frame, [0, dur], [0.2, 0.7], clamp) : 0.9;
  const inflate = phase === 'raft' ? interpolate(frame, [dur * 0.3, dur * 0.6], [0.2, 1], clamp) : 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="sk" stops={OSKY.night} />
          <Stars count={300} maxY={520} />
          <Sea t="night" y={520} amp={1.5} />
          <g transform={`translate(${phase === 'apart' ? 1500 : 1100} 640) scale(0.7)`}><Yacht frame={frame} sinking={sink} /></g>
          <g transform={`translate(${phase === 'apart' ? lerp(700, 400, frame / dur) : 700} 720) scale(${0.5 * inflate} ${0.5 * inflate})`}><RaftShape frame={frame} /></g>
          {phase === 'apart' && <><g transform={`translate(${lerp(1500, 1700, frame / dur)} 700)`}><path d="M -60 0 C -40 20 40 20 60 0 Z" fill="#c9c9c0" /><circle cx={0} cy={-30} r={5} fill="#fff6d0" /><Glow id="skl" cx={0} cy={-30} r={60} color="#fff6d0" opacity={0.5} /></g></>}
          <Rain count={60} opacity={0.15} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- sun, solar still, rain */
export const Sun: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#fff6e0'}}>
      <Camera dur={dur} from={1.0} to={1.15}>
        <Svg>
          <Sky id="sn" stops={[[0, '#7ab8e0'], [1, '#fff0d0']]} />
          <Glow id="sng" cx={960} cy={400} r={900} color="#ffffff" opacity={0.9} />
          <circle cx={960} cy={400} r={110} fill="#ffffff" />
          <Rays cx={960} cy={400} count={24} opacity={0.15} len={1400} color="#ffffff" />
          {[0, 1, 2].map((i) => <rect key={i} x={0} y={700 + i * 120} width={W} height={60} fill="#ffffff" opacity={0.08 + 0.04 * Math.sin(frame / 8 + i)} />)}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const SolarStill: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, dur], [0.1, p.drip ? 0.4 : 0.25], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <Sky id="sst" stops={OSKY.day} />
          <circle cx={1500} cy={160} r={50} fill="#fffaf0" />
          <Sea t="day" y={500} />
          <g transform={`translate(960 ${700 + Math.sin(frame / 18) * 8})`}>
            <ellipse cx={0} cy={60} rx={300} ry={60} fill="#e8a020" />
            <path d="M -260 60 L 0 -300 L 260 60 Z" fill="#cfe8f0" opacity={0.45} stroke="#ffffff" strokeWidth={4} />
            <ellipse cx={0} cy={40} rx={160} ry={30} fill="#1a1a1a" />
            {Array.from({length: 20}, (_, i) => { const r = rng(i); return <circle key={i} cx={(r() - 0.5) * 300 * (1 - r())} cy={-250 + r() * 280} r={3 + r() * 4} fill="#ffffff" opacity={0.8} />; })}
            {[0, 1].map((i) => { const k = ((frame / 20 + i / 2) % 1); return <ellipse key={i} cx={240} cy={60 + k * 80} rx={6} ry={9} fill="#cfe8f0" opacity={1 - k} />; })}
            <rect x={220} y={130} width={60} height={110} rx={10} fill="#cfe8f0" opacity={0.6} /><rect x={224} y={236 - 100 * fill} width={52} height={100 * fill} rx={8} fill="#8ac0d8" />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const RainCatch: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="rc" stops={OSKY.rain} />
          <Sea t="rain" y={560} amp={1.5} />
          <g transform="translate(960 780) scale(1.6)"><RaftShape frame={frame} noahOut /></g>
          <g transform={`translate(985 450)`}><circle cx={0} cy={0} r={30} fill="#c88d69" /><ellipse cx={8} cy={20} rx={10} ry={6 + Math.abs(Math.sin(frame / 4)) * 6} fill="#5a2a24" /></g>
          <Rain count={420} opacity={0.6} angle={2} />
          {[0, 1, 2, 3].map((i) => { const k = ((frame / 15 + i / 4) % 1); return <ellipse key={i} cx={600 + i * 250} cy={800 + (i % 2) * 60} rx={10 + k * 40} ry={3 + k * 10} fill="none" stroke="#e8f0f4" strokeWidth={2} opacity={1 - k} />; })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the passing ship */
export const Freighter: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const mid = p.dist === 'mid';
  const x = p.leaving ? lerp(1000, 1900, frame / dur) : lerp(500, 1200, frame / dur);
  const s = mid ? 0.9 : 0.35;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.05}>
        <Svg>
          <Sky id="fr" stops={OSKY.dawn} />
          <Glow id="frg" cx={1300} cy={560} r={900} color="#f6d0a0" opacity={0.5} />
          <Sea t="dawn" y={560} />
          <g transform={`translate(${x} 560) scale(${s})`}>
            <path d="M -600 0 L -560 -120 L 560 -120 L 600 0 Z" fill="#6a2a20" />
            {Array.from({length: 9}, (_, i) => <rect key={i} x={-520 + i * 110} y={-260 + (i % 3) * 20} width={100} height={140 - (i % 3) * 20} fill={['#2a5a8a', '#c9a040', '#3a6a4a', '#8a3a2a'][i % 4]} />)}
            <rect x={400} y={-340} width={120} height={220} fill="#e8e8e0" /><rect x={420} y={-320} width={80} height={20} fill="#2a3a4a" />
          </g>
          {!mid && <g transform={`translate(400 ${880 + Math.sin(frame / 18) * 6}) scale(0.9)`}><RaftShape frame={frame} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const FlareSea: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, frame / (dur * 0.6));
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.05}>
        <Svg>
          <Sky id="fs" stops={OSKY.dawn} />
          <Sea t="dawn" y={560} />
          <path d={`M 500 860 Q 800 ${lerp(860, 120, t)} ${lerp(500, 1000, t)} ${lerp(860, 200, t) + t * t * 100}`} stroke="#ffb0a0" strokeWidth={4} fill="none" opacity={0.6} />
          <circle cx={lerp(500, 1000, t)} cy={lerp(860, 200, t) + t * t * 100} r={14} fill="#ffe0d0" />
          <Glow id="fsg" cx={lerp(500, 1000, t)} cy={lerp(860, 200, t) + t * t * 100} r={200} color="#ff4a3a" opacity={0.45} />
          <g transform={`translate(460 ${900 + Math.sin(frame / 18) * 6})`}><RaftShape frame={frame} noahOut /></g>
          <g transform="translate(1600 560) scale(0.3)"><path d="M -600 0 L -560 -120 L 560 -120 L 600 0 Z" fill="#6a2a20" /><rect x={400} y={-340} width={120} height={220} fill="#e8e8e0" /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Mirror: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const flash = Math.floor(frame / 8) % 3 === 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="mr" stops={OSKY.day} />
          <circle cx={300} cy={160} r={50} fill="#fffaf0" />
          <Sea t="day" y={560} />
          <g transform="translate(1500 560) scale(0.32)"><path d="M -600 0 L -560 -120 L 560 -120 L 600 0 Z" fill="#6a2a20" /><rect x={400} y={-340} width={120} height={220} fill="#e8e8e0" /></g>
          <g transform={`translate(800 760) rotate(${Math.sin(frame / 6) * 10})`}><circle cx={0} cy={60} r={40} fill="#c88d69" /><rect x={-70} y={-70} width={140} height={140} rx={10} fill="#d8e8f0" /><circle cx={0} cy={0} r={14} fill="#1a1a1a" /></g>
          {flash && <><line x1={800} y1={760} x2={1640} y2={470} stroke="#ffffff" strokeWidth={6} opacity={0.7} /><Glow id="mrg" cx={800} cy={760} r={260} color="#ffffff" opacity={0.8} /></>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- underwater */
const Shark: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <path d={`M -220 0 C -160 -50 120 -50 200 0 C 120 50 -160 50 -220 0 Z`} fill="#5a6a74" />
    <path d={`M -200 0 L -300 ${-60 + Math.sin(frame / 6) * 20} L -280 0 L -300 ${60 + Math.sin(frame / 6) * 20} Z`} fill="#5a6a74" />
    <path d="M -20 -40 L 30 -130 L 60 -40 Z" fill="#5a6a74" /><path d="M -12 -112 L 30 -130 L 26 -100 Z" fill="#f4f4f0" />
    <path d="M 0 30 L 60 100 L 70 30 Z" fill="#5a6a74" /><path d="M 40 84 L 60 100 L 64 76 Z" fill="#f4f4f0" />
    <circle cx={160} cy={-8} r={6} fill="#0a0a0a" />
    <path d="M -200 6 C -100 30 100 30 200 6" stroke="#c9d4d8" strokeWidth={10} fill="none" opacity={0.5} />
  </g>
);

export const Underwater: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const r = rng(seed + 40);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <defs><linearGradient id="uw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a9ad0" /><stop offset="0.5" stopColor="#0a4a7a" /><stop offset="1" stopColor="#02142a" /></linearGradient></defs>
          <rect width={W} height={H} fill="url(#uw)" />
          {Array.from({length: 10}, (_, i) => <polygon key={i} points={`${i * 220 + Math.sin(frame / 30 + i) * 30},0 ${i * 220 + 80},0 ${i * 220 + 300},${H} ${i * 220 + 160},${H}`} fill="#ffffff" opacity={0.05} />)}
          <g transform={`translate(960 ${60 + Math.sin(frame / 18) * 8}) scale(1.6)`}><ellipse cx={0} cy={0} rx={150} ry={34} fill="#c84e22" /><ellipse cx={0} cy={10} rx={130} ry={20} fill="#a03a18" /></g>
          {Array.from({length: 24}, (_, i) => { const x = 800 + r() * 320 + Math.sin(frame / 20 + i) * 30, y = 140 + r() * 120; return <path key={i} d={`M ${x} ${y} q 12 -8 24 0 q -12 8 -24 0 M ${x + 24} ${y} l 8 -6 l 0 12 Z`} fill="#e8d040" />; })}
          {p.dorado && [0, 1, 2].map((i) => { const x = ((i * 600 + frame * (1.6 + i * 0.3)) % (W + 400)) - 200, y = 360 + i * 110; return <path key={i} d={`M ${x} ${y} C ${x + 60} ${y - 40} ${x + 180} ${y - 30} ${x + 220} ${y} C ${x + 180} ${y + 30} ${x + 60} ${y + 30} ${x} ${y} Z M ${x} ${y} L ${x - 40} ${y - 26} L ${x - 40} ${y + 26} Z`} fill={i % 2 ? '#a8c040' : '#c9d050'} />; })}
          {p.sharks && [0, 1].map((i) => { const a = frame / 120 + i * Math.PI; const x = 960 + Math.cos(a) * (p.close ? 420 : 600), y = (p.close ? 420 : 560) + Math.sin(a) * 120; return <g key={i} transform={`translate(${x} ${y}) scale(${(Math.sin(a) > 0 ? -1 : 1) * (p.close ? 1.4 : 0.9)} ${p.close ? 1.4 : 0.9})`}><Shark frame={frame} /></g>; })}
          {p.turtle && <g transform={`translate(${lerp(700, 1100, frame / dur)} ${lerp(260, 420, frame / dur)}) rotate(-8)`}>
            <ellipse cx={0} cy={0} rx={170} ry={110} fill="#5a6a3a" /><ellipse cx={0} cy={0} rx={140} ry={88} fill="#7a8a4a" />
            {Array.from({length: 6}, (_, i) => <polygon key={i} points={`${-80 + (i % 3) * 80},${-40 + Math.floor(i / 3) * 60} ${-50 + (i % 3) * 80},${-60 + Math.floor(i / 3) * 60} ${-20 + (i % 3) * 80},${-40 + Math.floor(i / 3) * 60} ${-50 + (i % 3) * 80},${-14 + Math.floor(i / 3) * 60}`} fill="#5a6a3a" />)}
            <ellipse cx={200} cy={-10} rx={50} ry={36} fill="#8a9a6a" /><circle cx={220} cy={-20} r={6} fill="#1a1a1a" />
            <path d={`M 80 -80 C 140 ${-160 + Math.sin(frame / 10) * 30} 220 ${-150 + Math.sin(frame / 10) * 30} 240 -110`} stroke="#8a9a6a" strokeWidth={36} fill="none" strokeLinecap="round" />
            <path d={`M 80 80 C 140 ${160 - Math.sin(frame / 10) * 30} 220 ${150 - Math.sin(frame / 10) * 30} 240 110`} stroke="#8a9a6a" strokeWidth={36} fill="none" strokeLinecap="round" />
          </g>}
          <Dust area={[0, 0, W, H]} count={80} opacity={0.4} color="#cfe8f0" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const UnderwaterDark: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <rect width={W} height={H} fill="#010408" />
        {Array.from({length: 40}, (_, i) => { const r = rng(i); const k = ((frame / 40 + r()) % 1); return <circle key={i} cx={400 + r() * 1100 + Math.sin(frame / 10 + i) * 10} cy={H - k * H} r={3 + r() * 8} fill="#9fc0d0" opacity={(1 - k) * 0.4} />; })}
        <path d={`M 300 ${500 + Math.sin(frame / 8) * 60} C 700 ${400 + Math.sin(frame / 9) * 80} 1200 ${600 + Math.sin(frame / 7) * 60} 1600 ${500}`} stroke="#d8c890" strokeWidth={6} fill="none" opacity={0.5} />
        <Glow id="udg" cx={960} cy={540} r={400} color="#1a3a5a" opacity={0.3} />
      </Svg>
    </AbsoluteFill>
  );
};

export const FlyingFish: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="ff" stops={OSKY.dawn} />
          <Glow id="ffg" cx={1300} cy={560} r={900} color="#f6d0a0" opacity={0.5} />
          <Sea t="dawn" y={560} />
          {Array.from({length: 7}, (_, i) => { const k = ((frame / 45 + i / 7) % 1); const x = lerp(-100, 2000, k) - i * 60, y = 600 - Math.sin(k * Math.PI) * (120 + i * 10) + i * 30; return <g key={i} transform={`translate(${x} ${y})`}><path d="M -30 0 C -10 -8 20 -8 34 0 C 20 8 -10 8 -30 0 Z" fill="#7a9ab0" /><path d={`M -4 -2 L 20 ${-30 - Math.sin(frame / 2) * 6} L 22 -2 Z`} fill="#a8c0d0" opacity={0.8} /></g>; })}
          <g transform={`translate(960 ${820 + Math.sin(frame / 18) * 6}) scale(1.3)`}><RaftShape frame={frame} /></g>
          <g transform="translate(900 780) rotate(20)"><path d="M -30 0 C -10 -8 20 -8 34 0 C 20 8 -10 8 -30 0 Z" fill="#7a9ab0" /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Biolum: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const r = rng(77);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="bl" stops={OSKY.night} />
          <Stars count={500} maxY={520} />
          <rect x={0} y={520} width={W} height={560} fill="#010608" />
          {Array.from({length: 260}, (_, i) => { const x = r() * W, y = 540 + Math.pow(r(), 0.8) * 540, ph = r() * 6; const glow = Math.max(0, Math.sin(frame / 14 + x / 200 + ph)); return <circle key={i} cx={x} cy={y} r={1.5 + r() * 3} fill="#5af0e0" opacity={glow * 0.9} />; })}
          <g transform={`translate(960 ${760 + Math.sin(frame / 18) * 6}) scale(1.3)`}><RaftShape frame={frame} /></g>
          <ellipse cx={960} cy={790} rx={260 + Math.sin(frame / 10) * 20} ry={40} fill="none" stroke="#5af0e0" strokeWidth={6} opacity={0.6} />
          <Glow id="blg" cx={960} cy={790} r={300} color="#5af0e0" opacity={0.3} />
          <path d={`M 1100 780 C 1300 ${790 + Math.sin(frame / 8) * 10} 1500 790 1700 800`} stroke="#5af0e0" strokeWidth={5} opacity={0.5} fill="none" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- storm at sea */
export const StormSea: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'swell';
  const pr = frame / dur;
  const flash = rng(Math.floor(frame / 3) + 5)() > 0.96;
  const swellY = 560 + Math.sin(frame / 20) * 160;
  const rot = phase === 'capsize' ? interpolate(pr, [0.3, 0.7], [0, 180], clamp) : phase === 'righting' ? interpolate(pr, [0.4, 0.8], [180, 360], clamp) : phase === 'outside' ? 180 : Math.sin(frame / 15) * 20;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.05}>
        <Svg>
          <Sky id="sts" stops={OSKY.storm} />
          <path d={`M -100 ${swellY + 200} C 300 ${swellY - 120} 700 ${swellY - 160} 960 ${swellY - 60} C 1200 ${swellY + 40} 1500 ${swellY + 200} 2100 ${swellY + 100} L 2100 ${H} L -100 ${H} Z`} fill="#2a3a44" />
          <path d={`M -100 ${swellY + 200} C 300 ${swellY - 120} 700 ${swellY - 160} 960 ${swellY - 60}`} stroke="#d8e4e8" strokeWidth={10} fill="none" opacity={0.6} />
          {phase === 'capsize' && <path d={`M 600 ${swellY - 100} C 800 ${swellY - 400} 1100 ${swellY - 300} 1200 ${swellY - 60}`} stroke="#e8f0f4" strokeWidth={40} fill="none" opacity={0.7} />}
          <g transform={`translate(960 ${swellY - 70}) rotate(${rot})`}><RaftShape frame={frame} /></g>
          {(phase === 'outside' || phase === 'righting') && <g transform={`translate(1020 ${swellY - 150}) scale(0.32)`}><NoahStandBack outfit="trek" /></g>}
          <Rain count={340} opacity={0.5} angle={18} />
          {flash && <rect width={W} height={H} fill="#e8f0ff" opacity={0.5} />}
          {phase === 'capsize' && pr > 0.7 && <rect width={W} height={H} fill="#000" opacity={interpolate(pr, [0.7, 1], [0, 1], clamp)} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- albatross */
const Albatross: React.FC<{frame: number; wings?: number}> = ({frame, wings = 1}) => {
  const f = Math.sin(frame / 30) * 6;
  return (
    <g>
      <path d={`M 0 0 C -120 ${-20 - f} -300 ${-10 - f} -420 ${20 - f} C -300 ${0 - f} -150 ${16} 0 20 Z`} fill="#2a2a2a" transform={`scale(${wings} 1)`} />
      <path d={`M 0 0 C 120 ${-20 - f} 300 ${-10 - f} 420 ${20 - f} C 300 ${0 - f} 150 ${16} 0 20 Z`} fill="#2a2a2a" transform={`scale(${wings} 1)`} />
      <ellipse cx={0} cy={10} rx={70} ry={26} fill="#f4f4f0" />
      <circle cx={70} cy={0} r={22} fill="#f4f4f0" /><circle cx={76} cy={-4} r={4} fill="#1a1a1a" />
      <path d="M 88 4 L 140 10 L 88 14 Z" fill="#e8c8a0" />
      <path d="M -70 10 L -110 0 L -110 20 Z" fill="#2a2a2a" />
    </g>
  );
};

export const AlbatrossSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'glide';
  const t: T = p.sunset ? 'dusk' : phase === 'leave' ? 'dusk' : 'day';
  if (phase === 'band') {
    return (
      <AbsoluteFill>
        <Camera dur={dur} from={1.0} to={1.25} origin="55% 70%">
          <Svg>
            <rect width={W} height={H} fill="#e0703a" />
            <ellipse cx={960} cy={400} rx={500} ry={300} fill="#f4f4f0" />
            <path d="M 960 700 L 940 1080 M 1080 700 L 1100 1080" stroke="#e8c8a0" strokeWidth={46} />
            <rect x={910} y={820} width={70} height={90} rx={10} fill="#c9c9c0" />
            <rect x={918} y={840} width={54} height={10} fill="#8a8a84" /><rect x={918} y={866} width={54} height={10} fill="#8a8a84" />
            <path d="M 300 300 C 600 200 800 300 960 400" stroke="#2a2a2a" strokeWidth={80} fill="none" />
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="ab" stops={OSKY[t]} />
          {t === 'dusk' ? <><Glow id="abg" cx={1300} cy={560} r={900} color="#f0a050" opacity={0.6} /><circle cx={1300} cy={540} r={60} fill="#fff0d0" /></> : <circle cx={1500} cy={160} r={50} fill="#fffaf0" />}
          <Sea t={t} y={560} />
          {phase !== 'glide' && <g transform={`translate(${phase === 'leave' ? 700 : 900} ${800 + Math.sin(frame / 18) * 6}) scale(1.2)`}><RaftShape frame={frame} /></g>}
          {phase === 'glide' && <g transform={`translate(${lerp(-200, 1200, frame / dur)} ${300 + Math.sin(frame / 30) * 40}) rotate(${Math.sin(frame / 40) * 8}) scale(0.9)`}><Albatross frame={frame} /></g>}
          {phase === 'water' && <g transform={`translate(1300 ${780 + Math.sin(frame / 18 + 1) * 6}) scale(0.7)`}><Albatross frame={0} wings={0.25} /></g>}
          {phase === 'raft' && <g transform={`translate(${900 + 120} ${800 - 70 + Math.sin(frame / 18) * 6}) scale(0.55)`}><Albatross frame={0} wings={0.22} /></g>}
          {phase === 'leave' && <g transform={`translate(${lerp(800, 100, frame / dur)} ${lerp(700, 480, Math.min(1, frame / (dur * 0.4)))}) scale(-0.6 0.6)`}><Albatross frame={frame} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const AlbatrossBand: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const show = (i: number) => interpolate(frame, [10 + i * 12, 22 + i * 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#1a1a1a'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <rect width={W} height={H} fill="#d07040" />
          <path d="M 600 0 L 620 1080 M 1300 0 L 1280 1080" stroke="#e8c8a0" strokeWidth={200} />
          <rect x={460} y={340} width={1000} height={400} rx={40} fill="#c9c9c0" />
          <rect x={460} y={340} width={1000} height={60} rx={20} fill="#e8e8e0" />
          <text x={960} y={490} textAnchor="middle" fill="#2a2a2a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={56} opacity={show(0)}>TAMARU ATOLL RESEARCH</text>
          <text x={960} y={580} textAnchor="middle" fill="#2a2a2a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={44} opacity={show(1)}>RETURN TO STATION</text>
          <text x={960} y={670} textAnchor="middle" fill="#2a2a2a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={50} opacity={show(2)}>No. 471</text>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const SkySet: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="sky6" stops={OSKY.day} />
          {Array.from({length: 7}, (_, i) => <ellipse key={i} cx={((i * 330 + frame * 0.6) % (W + 500)) - 250} cy={200 + (i % 3) * 140} rx={200} ry={46} fill="#ffffff" opacity={0.75} />)}
          <g transform={`translate(${lerp(1600, 900, frame / dur)} ${lerp(160, 380, frame / dur)}) scale(0.18)`}><Albatross frame={frame} /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the raft under sail */
export const SailRaft: React.FC<SetProps> = ({dur, p}) => {
  const t: T = p.time ?? 'day';
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="sr6" stops={OSKY[t]} />
          {t === 'dusk' ? <><Glow id="srg" cx={600} cy={560} r={900} color="#f0a050" opacity={0.6} /><circle cx={600} cy={540} r={60} fill="#fff0d0" /></> : <circle cx={1500} cy={160} r={50} fill="#fffaf0" />}
          <Sea t={t} y={560} />
          <g transform={`translate(1100 ${800 + Math.sin(frame / 18) * 6}) scale(1.3)`}><RaftShape frame={frame} sail /></g>
          <path d={`M 1300 840 C 1450 850 1600 860 1800 850`} stroke="#ffffff" strokeWidth={3} opacity={0.5} fill="none" />
          {p.bird && <g transform={`translate(${lerp(900, 400, frame / dur)} 420) scale(-0.25 0.25)`}><Albatross frame={frame} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- lagoon, reef, atoll */
export const LagoonWater: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="lg" stops={OSKY.day} />
          <circle cx={1500} cy={160} r={50} fill="#fffaf0" />
          <rect x={0} y={560} width={W} height={520} fill="#30c0c8" />
          <rect x={0} y={560} width={W} height={60} fill="#1a8ab0" />
          {Array.from({length: 30}, (_, i) => { const r = rng(i + 3); return <ellipse key={i} cx={r() * W} cy={640 + r() * 440} rx={20 + r() * 60} ry={6 + r() * 10} fill="#80e0e0" opacity={0.3 + 0.2 * Math.sin(frame / 10 + i)} />; })}
          {Array.from({length: 10}, (_, i) => { const r = rng(i + 30); return <ellipse key={`c${i}`} cx={r() * W} cy={800 + r() * 260} rx={60 + r() * 80} ry={20} fill="#d0a080" opacity={0.25} />; })}
          {p.raft && <g transform={`translate(960 ${800 + Math.sin(frame / 18) * 4}) scale(1.2)`}><RaftShape frame={frame} sail /></g>}
          {!p.raft && <rect x={0} y={560} width={W} height={10} fill="#f0e0b8" opacity={0.6} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

const Palm: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 0 C 20 -160 -10 -300 30 -440" stroke="#8a6a4a" strokeWidth={22} fill="none" />
    {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M 30 -440 q ${-140 + k * 56} ${30 + Math.sin(frame / 20 + k) * 8} ${-200 + k * 80} ${140 - Math.abs(k - 2.5) * 20}`} stroke="#2a8a3a" strokeWidth={16} fill="none" />)}
  </g>
);

export const Atoll: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const far = !!p.far;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={far ? 1.0 : 1.04} to={far ? 1.15 : 1.0} origin="50% 60%">
        <Svg>
          <Sky id="at" stops={OSKY.day} />
          <circle cx={1500} cy={160} r={50} fill="#fffaf0" />
          <ellipse cx={1000} cy={300} rx={280} ry={100} fill="#ffffff" />
          <rect x={0} y={far ? 600 : 520} width={W} height={H} fill={far ? '#1a6aa0' : '#30c0c8'} />
          <g transform={`translate(0 ${far ? 560 : 640}) scale(1 ${far ? 0.4 : 1})`}>
            <path d="M 300 40 C 600 -10 1300 -10 1700 40 L 1700 80 L 300 80 Z" fill="#f0e0b8" />
            {[500, 700, 1150, 1400].map((x, i) => <Palm key={i} x={x} y={40} s={far ? 0.5 : 0.8} frame={frame} />)}
            <g transform="translate(900 40)"><rect x={-80} y={-110} width={160} height={110} fill="#f4f4f0" /><rect x={-90} y={-120} width={180} height={14} fill="#c9c9c0" /><rect x={20} y={-240} width={6} height={130} fill="#8a8a84" /><circle cx={23} cy={-240} r={10} fill="none" stroke="#8a8a84" strokeWidth={4} /></g>
          </g>
          {!far && <rect x={0} y={680} width={W} height={400} fill="#f0e0b8" />}
          {p.beach && <><g transform="translate(860 920) scale(0.5)"><NoahLying eye={1} breath={(Math.sin(frame / 22) + 1) / 2} /></g>
            <g transform="translate(700 1000) scale(0.65)"><NoahStandBack outfit="home" /><ellipse cx={0} cy={-470} rx={56} ry={60} fill="#1a1410" /></g>
            <g transform={`translate(1200 ${880 + Math.sin(frame / 18) * 4}) scale(0.9)`}><RaftShape frame={frame} sail /></g></>}
          {p.ship && <><g transform="translate(1500 620) scale(0.4)"><path d="M -600 0 L -560 -120 L 560 -120 L 600 0 Z" fill="#e8e8e0" /><rect x={-200} y={-300} width={300} height={180} fill="#c0392b" /></g>
            <g transform={`translate(${lerp(1300, 1000, frame / dur)} 650)`}><circle r={16} fill="#d8a888" /><path d={`M -30 6 q 30 ${-10 + Math.sin(frame / 4) * 6} 60 0`} stroke="#ffffff" strokeWidth={4} fill="none" /></g></>}
          {far && <g transform={`translate(960 ${880 + Math.sin(frame / 18) * 6})`}><RaftShape frame={frame} sail /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

export const Reef: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const through = !!p.through;
  const x = through ? lerp(700, 1150, frame / dur) : 600;
  const y = through ? lerp(920, 700, frame / dur) : 920;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.06}>
        <Svg>
          <Sky id="rf6" stops={OSKY.day} />
          <rect x={0} y={520} width={W} height={160} fill="#30c0c8" />
          <path d="M 300 560 C 600 530 1300 530 1700 560 L 1700 580 L 300 580 Z" fill="#f0e0b8" />
          {[500, 1200, 1500].map((xx, i) => <Palm key={i} x={xx} y={560} s={0.35} frame={frame} />)}
          <rect x={0} y={680} width={W} height={400} fill="#1a6aa0" />
          {/* breaking surf on the reef, with one gap */}
          {Array.from({length: 12}, (_, i) => { const xx = i * 170; if (xx > 1000 && xx < 1250) return null; const k = ((frame / 30 + i * 0.13) % 1); return <g key={i}><ellipse cx={xx + 80} cy={690} rx={110} ry={30 + k * 40} fill="#f4f8fa" opacity={0.8 - k * 0.4} /><ellipse cx={xx + 80} cy={700} rx={140} ry={14} fill="#d0a080" opacity={0.3} /></g>; })}
          <g transform={`translate(${x} ${y + Math.sin(frame / 10) * 10}) rotate(${through ? Math.sin(frame / 6) * 10 : 0}) scale(0.8)`}><RaftShape frame={frame} sail /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
