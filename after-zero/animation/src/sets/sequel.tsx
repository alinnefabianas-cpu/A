import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Camera, CarSide, clamp, Glow, H, lerp, Rays, rng, Sky, Skyline, Svg, useProgress, W} from '../lib';
import {NoahStandBack, NoahWalk} from '../noah';
import {camFor, mouth, SetProps, SKY, Stars, TONES} from './common';
import {Face, Person} from './jungle';
import {Carter} from './observatory';

/* ---------------------------------------------------------- countdown screen */
export const Countdown: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const [h, m, s] = (p.from ?? '23:59:41').split(':').map(Number);
  const total = h * 3600 + m * 60 + s - Math.floor(frame / 30);
  const fmt = (n: number) => String(n).padStart(2, '0');
  const txt = `${fmt(Math.floor(total / 3600))}:${fmt(Math.floor((total % 3600) / 60))}:${fmt(total % 60)}`;
  return (
    <AbsoluteFill style={{background: '#040608'}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill="#060a0e" />
          {Array.from({length: 40}, (_, i) => <line key={i} x1={0} y1={i * 28} x2={W} y2={i * 28} stroke="#0c161c" strokeWidth={1} />)}
          <Glow id="cdg" cx={960} cy={560} r={800} color="#ff7a5a" opacity={0.15} />
          <text x={960} y={380} textAnchor="middle" fill="#7fd0e0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={56} letterSpacing={12}>PHASE TWO</text>
          <text x={960} y={620} textAnchor="middle" fill="#ff7a5a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={220}>{txt}</text>
          <rect x={460} y={700} width={1000} height={10} fill="#2a1a16" /><rect x={460} y={700} width={1000 * (total / 86400)} height={10} fill="#ff7a5a" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- typing the password */
export const Keyboard: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const text: string = p.text ?? '';
  const n = Math.min(text.length, Math.floor(frame / 4));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <rect width={W} height={H} fill="#06090b" />
          <Glow id="kbg" cx={960} cy={300} r={800} color="#7fd0e0" opacity={0.15} />
          <rect x={460} y={140} width={1000} height={320} rx={16} fill="#0d1a20" stroke="#1d2529" strokeWidth={8} />
          <text x={520} y={240} fill="#5a8a96" fontFamily="DejaVu Sans Mono" fontSize={32}>PASSWORD:</text>
          <text x={520} y={330} fill="#7fd0e0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={48}>{text.slice(0, n)}{frame % 30 < 15 ? '█' : ''}</text>
          <g transform="translate(960 800) skewX(-10)">
            {Array.from({length: 4}, (_, r) => Array.from({length: 12}, (_, c) => {
              const lit = (frame / 4) % 1 < 0.5 && c === (Math.floor(frame / 4) * 7) % 12 && r === Math.floor(frame / 4) % 4;
              return <rect key={`${r}${c}`} x={-660 + c * 110} y={-140 + r * 80} width={96} height={66} rx={10} fill={lit ? '#7fd0e0' : '#1a2228'} />;
            }))}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Earth cross-section: the core */
export const EarthCore: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.12}>
        <Svg>
          <rect width={W} height={H} fill="#02040a" />
          <Stars count={300} maxY={H} />
          <g transform="translate(960 560)">
            <circle r={440} fill="#2a5a8a" />
            <path d="M 0 -440 A 440 440 0 0 1 440 0 L 0 0 Z" fill="#7a4a2a" />
            <path d="M 0 -380 A 380 380 0 0 1 380 0 L 0 0 Z" fill="#a8582a" />
            <path d="M 0 -250 A 250 250 0 0 1 250 0 L 0 0 Z" fill="#e0782a" />
            <path d="M 0 -130 A 130 130 0 0 1 130 0 L 0 0 Z" fill="#ffc060" />
            <circle r={60} fill="#e8f8ff" opacity={pulse} />
            <Glow id="ecg" cx={0} cy={0} r={300} color="#9fe0ff" opacity={0.5 * pulse} />
            {[0, 1, 2].map((i) => { const k = ((frame / 40 + i / 3) % 1); return <circle key={i} r={60 + k * 520} fill="none" stroke="#9fe0ff" strokeWidth={4} opacity={(1 - k) * 0.6} />; })}
            {Array.from({length: 12}, (_, i) => <path key={i} d={`M ${Math.cos(i) * 440} ${Math.sin(i) * 440} q 30 -10 60 4`} stroke="#3a7a4a" strokeWidth={14} fill="none" />)}
          </g>
          <text x={1500} y={300} fill="#9fe0ff" fontFamily="DejaVu Sans Mono" fontSize={30}>SIGNAL ORIGIN</text>
          <line x1={1490} y1={310} x2={1000} y2={540} stroke="#9fe0ff" strokeWidth={2} strokeDasharray="8 8" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Earth from orbit: flare + shield */
export const EarthOrbit: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const pr = frame / dur;
  const flareX = p.flare ? lerp(-400, 900, Math.min(1, pr * 1.2)) : -999;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill="#01030a" />
          <Stars count={500} maxY={H} />
          {/* the Sun at left edge */}
          <Glow id="eos" cx={-100} cy={540} r={700} color="#ffd080" opacity={0.7} />
          <circle cx={-260} cy={540} r={260} fill="#fff0c0" />
          {/* earth */}
          <g transform={`translate(1200 560) rotate(${frame * 0.05})`}>
            <circle r={300} fill="#1f4a7a" />
            {Array.from({length: 9}, (_, i) => { const r = rng(i + 4); return <ellipse key={i} cx={(r() - 0.5) * 400} cy={(r() - 0.5) * 400} rx={40 + r() * 90} ry={30 + r() * 60} fill="#3a7a4a" opacity={0.9} />; })}
            {Array.from({length: 6}, (_, i) => { const r = rng(i + 20); return <ellipse key={i} cx={(r() - 0.5) * 460} cy={(r() - 0.5) * 460} rx={80 + r() * 100} ry={14} fill="#ffffff" opacity={0.5} />; })}
          </g>
          <path d="M 1200 260 A 300 300 0 0 0 1200 860 A 220 300 0 0 1 1200 260 Z" fill="#000" opacity={0.55} />
          <circle cx={1200} cy={560} r={306} fill="none" stroke="#9fd0ff" strokeWidth={8} opacity={0.4} />
          {p.ring && !p.cocoon && <ellipse cx={1200} cy={560} rx={420} ry={110} fill="none" stroke="#bfe6f2" strokeWidth={6} opacity={0.6 + 0.3 * Math.sin(frame / 8)} />}
          {p.cocoon && Array.from({length: 14}, (_, i) => <ellipse key={i} cx={1200} cy={560} rx={360} ry={60 + i * 22} fill="none" stroke="#bfe6f2" strokeWidth={3} opacity={0.35 + 0.2 * Math.sin(frame / 6 + i)} transform={`rotate(${i * 13} 1200 560)`} />)}
          {p.cocoon && <Glow id="eoc" cx={1200} cy={560} r={520} color="#9fe0ff" opacity={0.25} />}
          {p.flare && <g>
            {Array.from({length: 40}, (_, i) => { const r = rng(i + 7); const y = 540 + (r() - 0.5) * 900; const x = flareX - r() * 500; const bent = p.cocoon && x > 840 ? (y < 560 ? -1 : 1) * Math.min(300, (x - 840) * 0.9) : 0; return <line key={i} x1={x - 200} y1={y} x2={Math.min(x, p.cocoon ? 840 + Math.abs(bent) * 0.4 : x)} y2={y + bent} stroke="#ffb060" strokeWidth={3 + r() * 6} opacity={0.5} />; })}
            <Glow id="eof" cx={flareX} cy={540} r={600} color="#ff9040" opacity={0.35} />
          </g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- solar storm in the sky */
export const SolarStorm: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'start';
  const calm = !!p.calm;
  const t = interpolate(frame, [0, dur], [0, 1], clamp);
  const skyStops: [number, string][] = phase === 'start' ? [[0, lerpColor('#3a5560', '#4a2a6a', t)], [1, lerpColor('#e9e3d2', '#f0d0ff', t)]] : [[0, '#1a0a2a'], [0.6, '#3a1a4a'], [1, '#6a3a5a']];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera dur={dur} from={1.0} to={1.08}>
        <Svg>
          <Sky id="ss" stops={calm ? SKY.night : skyStops} />
          {calm && <Stars count={300} />}
          {!calm && <><Glow id="sss" cx={1400} cy={240} r={700} color="#ffffff" opacity={phase === 'start' ? 0.4 + t * 0.5 : 0.6} /><circle cx={1400} cy={240} r={70} fill="#ffffff" /></>}
          {(phase !== 'start' || calm) && <g style={{mixBlendMode: 'screen'}}>
            {['#ff4a6a', '#5af0a0', '#a07aff'].map((col, k) => {
              const pts: string[] = [], top: string[] = [];
              for (let x = -200; x <= W + 200; x += 60) {
                const y = 200 + k * 120 + Math.sin(x / 220 + frame / (30 + k * 10) + k) * 90 + Math.sin(x / 80 + frame / 18) * 20;
                top.push(`${x},${y - 260}`); pts.push(`${x},${y}`);
              }
              return <polygon key={k} points={`${top.join(' ')} ${pts.reverse().join(' ')}`} fill={col} opacity={calm ? 0.35 : 0.45} filter="url(#ssb)" />;
            })}
            <defs><filter id="ssb"><feGaussianBlur stdDeviation="22" /></filter></defs>
          </g>}
          <polygon points={`0,${H} 0,820 400,700 760,760 1100,660 1500,740 1920,700 1920,${H}`} fill="#0e0a14" />
          <g transform="translate(960 700) scale(0.4)"><rect x={-220} y={-60} width={440} height={140} fill="#1a1620" /><path d="M -200 -60 A 200 200 0 0 1 200 -60 Z" fill="#241e2a" /></g>
          {phase === 'sparks' && Array.from({length: 30}, (_, i) => { const r = rng(i + Math.floor(frame / 2)); const x = r() * W, y = 700 + r() * 300; return <path key={i} d={`M ${x} ${y} l ${(r() - 0.5) * 40} -20 l ${(r() - 0.5) * 40} -20`} stroke="#d8f0ff" strokeWidth={3} opacity={r() > 0.5 ? 0.9 : 0} />; })}
          {phase === 'sparks' && <line x1={0} y1={760} x2={W} y2={690} stroke="#8af0ff" strokeWidth={3} opacity={0.4 + 0.4 * Math.sin(frame)} />}
          {calm && <g transform="translate(960 1010) scale(0.6)"><NoahStandBack /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
function lerpColor(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/* ---------------------------------------------------------- generic pedestrian (not Noah) */
const COATS = ['#8a3a2a', '#2a4a6a', '#c9a04a', '#4a6a4a', '#6a4a6a', '#3a3a3a', '#b0675a', '#5a7a8a', '#d0d0c0', '#7a5a3a'];
const HAIRS = ['#1a1410', '#4a3020', '#c9a060', '#2a2a2a', '#8a8a80', '#6a3a1a'];
const SKINS = ['#e0b090', '#c88d69', '#8a5a3e', '#f0c8a8', '#a8724e', '#5a3a2a'];
export const Pedestrian: React.FC<{seed: number; phase: number; flip?: boolean}> = ({seed, phase, flip}) => {
  const r = rng(seed * 31 + 7);
  const coat = COATS[Math.floor(r() * COATS.length)], hair = HAIRS[Math.floor(r() * HAIRS.length)], skin = SKINS[Math.floor(r() * SKINS.length)];
  const h = 0.85 + r() * 0.3;
  const s = Math.sin(phase);
  const leg = (dx: number, k: number) => <line x1={dx} y1={-200} x2={dx + s * k * 40} y2={0} stroke="#2a2a30" strokeWidth={34} strokeLinecap="round" />;
  return (
    <g transform={`scale(${flip ? -h : h} ${h})`}>
      {leg(-10, -1)}{leg(10, 1)}
      <path d="M -50 -190 L -46 -390 C -20 -410 40 -410 54 -390 L 50 -190 Z" fill={coat} />
      <line x1={0} y1={-380} x2={-s * 40} y2={-230} stroke={coat} strokeWidth={26} strokeLinecap="round" />
      <ellipse cx={8} cy={-450} rx={42} ry={48} fill={skin} />
      <path d="M -36 -440 C -44 -500 10 -520 46 -490 C 50 -470 40 -460 30 -470 C 10 -466 -10 -450 -36 -440 Z" fill={hair} />
    </g>
  );
};

/* ---------------------------------------------------------- the crowd returns */
export const Crowd: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'full';
  const seed = p.seed ?? 1;
  const tone = TONES.day;
  const appearAt = phase === 'appear' ? Math.round(dur * 0.35) : phase === 'shimmer' ? 1e9 : -1;
  const visible = frame >= appearAt;
  const flash = phase === 'appear' ? interpolate(frame, [appearAt - 2, appearAt, appearAt + 10], [0, 0.85, 0], clamp) : 0;
  const people = Array.from({length: 46}, (_, i) => {
    const r = rng(i * 13 + seed);
    const depth = r();
    return {i, x: r() * (W + 400) - 200, y: lerp(720, 1080, depth), s: lerp(0.28, 0.9, depth), dir: r() > 0.5, speed: 0.6 + r() * 0.8};
  }).sort((a, b) => a.y - b.y);
  const cam = camFor(seed + 400, 0.5);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="cw" stops={SKY.day} />
          <Glow id="cws" cx={1200} cy={220} r={700} color="#fff6e0" opacity={0.35} />
          <Skyline seed={601} baseY={700} minH={300} maxH={680} color={tone.mid} minW={120} maxW={260} edge={{color: tone.edge, opacity: 0.3, side: 'left'}} windows={{color: '#9fb4b8', prob: 0.15, opacity: 0.6}} />
          <rect x={0} y={700} width={W} height={380} fill="#5a5f60" />
          <rect x={0} y={700} width={W} height={20} fill="#7a7f80" />
          {visible && people.map((pp) => {
            const x = pp.x + (phase === 'full' ? (pp.dir ? -1 : 1) * frame * pp.speed * 1.5 : 0);
            return <g key={pp.i} transform={`translate(${x} ${pp.y}) scale(${pp.s})`}><Pedestrian seed={pp.i + seed * 100} phase={frame / 6 * pp.speed + pp.i} flip={pp.dir} /></g>;
          })}
          {p.noah && <g transform="translate(960 1060) scale(0.95)"><NoahStandBack /></g>}
          {!p.noah && phase !== 'full' && <g transform="translate(960 1060) scale(0.95)"><NoahStandBack /></g>}
          {phase === 'shimmer' && Array.from({length: 16}, (_, i) => { const r = rng(i + 3); const x = r() * W, y = 760 + r() * 280; return <ellipse key={i} cx={x} cy={y} rx={30 + Math.sin(frame / 5 + i) * 10} ry={120} fill="#ffffff" opacity={0.06 + 0.05 * Math.sin(frame / 4 + i)} />; })}
        </Svg>
      </Camera>
      {flash > 0 && <AbsoluteFill style={{background: '#ffffff', opacity: flash}} />}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Mia's red door */
export const Door: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.15} origin="50% 50%">
        <Svg>
          <rect width={W} height={H} fill="#c9bfa8" />
          {Array.from({length: 20}, (_, i) => <rect key={i} x={0} y={i * 56} width={W} height={4} fill="#b8ae96" />)}
          <rect x={760} y={180} width={400} height={760} fill="#4a3a2a" />
          <rect x={780} y={200} width={360} height={740} fill="#b0302a" />
          {[0, 1].map((i) => <rect key={i} x={820} y={250 + i * 340} width={280} height={280} fill="none" stroke="#8a2420" strokeWidth={10} />)}
          <circle cx={1100} cy={580} r={16} fill="#c9a04a" />
          <text x={960} y={160} textAnchor="middle" fill="#4a3a2a" fontFamily="Inter" fontWeight={700} fontSize={40}>4B</text>
          <rect x={0} y={940} width={W} height={140} fill="#6a5a48" />
          <g transform={`translate(${lerp(300, 620, Math.min(1, frame / (dur * 0.6)))} 1000) scale(0.85)`}><NoahWalk phase={frame / 4} outfit="out" /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

const MIA: Face = {skin: '#d4a088', hair: '#2a1b13', shirt: '#7a8ab0', female: true, young: true};

export const Sister: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const mode = p.mode ?? 'kitchen';
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 23) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const cam = camFor(seed + 410, 0.5);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          {mode === 'door' ? <><rect width={W} height={H} fill="#e8dcc4" /><rect x={0} y={0} width={420} height={H} fill="#b0302a" /><Glow id="sdg" cx={1500} cy={300} r={900} color="#fff6e0" opacity={0.5} /></>
            : <><rect width={W} height={H} fill="#e0d4bc" /><rect x={1200} y={160} width={520} height={420} fill="#f4ecd8" /><Glow id="skg" cx={1460} cy={370} r={800} color="#fff6e0" opacity={0.5} />
              <rect x={0} y={760} width={W} height={320} fill="#a88a6a" /><rect x={1300} y={640} width={60} height={90} rx={10} fill="#ffffff" /></>}
          <g transform={`translate(860 ${650 + Math.sin(frame / 24) * 3}) scale(1.35)`}>
            <Person f={MIA} talk={mouth(frame, talk, 'MIA')} blink={blink} smile={p.smile && !(talk && frame >= talk.from && frame <= talk.to)} />
          </g>
          {mode === 'door' && <rect x={1080} y={760} width={80} height={110} rx={12} fill="#ffffff" />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- the hug */
export const Hug: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 30) * 2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.05} to={1.0}>
        <Svg>
          <rect width={W} height={H} fill="#e8dcc4" />
          <rect x={700} y={120} width={520} height={860} fill="#3a2a20" />
          <Glow id="hgg" cx={960} cy={500} r={700} color="#fff0d0" opacity={0.6} />
          <g transform={`translate(960 1000) rotate(${sway})`}>
            <g transform="translate(-60 0) scale(1.4)"><NoahStandBack /></g>
            {/* Mia's arms around him */}
            <path d="M -140 -560 C -60 -600 60 -600 120 -540" stroke="#d4a088" strokeWidth={40} fill="none" strokeLinecap="round" />
            <ellipse cx={90} cy={-700} rx={60} ry={70} fill="#2a1b13" />
            <path d="M 60 -640 C 120 -600 140 -520 120 -460" stroke="#7a8ab0" strokeWidth={70} fill="none" strokeLinecap="round" />
          </g>
          <rect x={0} y={980} width={W} height={100} fill="#8a7a64" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Dr. Carter in person */
export const CarterRoom: React.FC<SetProps> = ({dur, p, talk}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const blink = interpolate((frame + seed * 17) % 120, [80, 84, 88], [0, 1, 0], clamp);
  const cam = camFor(seed + 420, 0.5);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#141c22" />
          {Array.from({length: 5}, (_, i) => <rect key={i} x={1180 + (i % 3) * 230} y={160 + Math.floor(i / 3) * 220} width={200} height={150} rx={8} fill="#0d1a20" stroke="#1d2529" strokeWidth={6} />)}
          {Array.from({length: 5}, (_, i) => <polyline key={i} points={Array.from({length: 20}, (_, k) => `${1195 + (i % 3) * 230 + k * 9},${235 + Math.floor(i / 3) * 220 + Math.sin(k / 2 + frame / 6 + i) * 20}`).join(' ')} stroke="#7fd0e0" strokeWidth={2} fill="none" />)}
          <Glow id="crg" cx={1500} cy={300} r={700} color="#7fd0e0" opacity={0.2} />
          <rect x={0} y={860} width={W} height={220} fill="#0e1418" />
          <g transform={`translate(${p.watching ? 760 : 820} ${560 + Math.sin(frame / 24) * 3}) scale(${p.watching ? 1.1 : 1.3})`}>
            <Carter talk={mouth(frame, talk, 'CARTER')} blink={blink} />
          </g>
          {p.watching && <><rect x={1140} y={500} width={520} height={320} rx={10} fill="#05080a" stroke="#1d2529" strokeWidth={8} /><rect x={1156} y={516} width={488} height={288} fill="#33454b" />
            <g transform="translate(1400 720) scale(0.45)"><Carter talk={Math.abs(Math.sin(frame / 3))} blink={0} /></g></>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
