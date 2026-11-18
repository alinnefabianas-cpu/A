import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {
  Birds, C, Camera, CarSide, clamp, Dust, Fog, Glow, H, lerp, Rays, rng, Sky, Skyline, Svg, useProgress, W,
} from './lib';
import {ChairWithGear, NoahBack, NoahLying, NoahProfile, NoahSitting, NoahWalk} from './noah';

type P = {dur: number};
const FPS = 30;

/* Shared: sunrise city backdrop (used by S01, S08, S11 variants) */
const SunriseSky: React.FC<{sunY: number; id: string}> = ({sunY, id}) => (
  <>
    <Sky id={id} stops={[[0, '#0d151c'], [0.18, '#22343b'], [0.38, '#6a8486'], [0.52, '#d2925a'], [0.64, '#f2b86e'], [1, '#f6c98a']]} />
    <Glow id={`${id}-g1`} cx={1140} cy={sunY} r={900} color={C.gold} opacity={0.55} />
    <Glow id={`${id}-g2`} cx={1140} cy={sunY} r={240} color={C.sun} opacity={0.95} />
    <circle cx={1140} cy={sunY} r={62} fill="#fff4dc" />
  </>
);

/* ------------------------------------------------------------ S01 city sunrise */
export const S01: React.FC<P> = ({dur}) => {
  const p = useProgress(dur);
  const frame = useCurrentFrame();
  const sunY = lerp(520, 455, p);
  return (
    <AbsoluteFill style={{background: C.midnight}}>
      <Camera dur={dur} from={1.0} to={1.09} origin="58% 60%">
        <Svg>
          <SunriseSky sunY={sunY} id="s01" />
          <Rays cx={1140} cy={sunY} count={18} opacity={0.07} spin={1} />
          <g transform={`translate(${-p * 20} 0)`}>
            <Skyline seed={11} baseY={720} minH={120} maxH={420} color="#7d8f8f" minW={40} maxW={110} />
          </g>
          <Fog id="s01f1" y={560} h={220} opacity={0.35} speed={0.3} color="#f1d2a8" />
          <g transform={`translate(${-p * 45} 0)`}>
            <Skyline seed={23} baseY={770} minH={120} maxH={360} color="#41545a" minW={60} maxW={150}
              edge={{color: C.gold, opacity: 0.5, side: 'left'}} windows={{color: C.gold, prob: 0.06, opacity: 0.6}} />
          </g>
          <Fog id="s01f2" y={660} h={200} opacity={0.3} speed={0.6} color="#e9c39a" />
          <g transform={`translate(${-p * 90} 0)`}>
            <Skyline seed={37} baseY={820} minH={180} maxH={520} color="#1a252b" minW={90} maxW={210} x0={-400} x1={760}
              edge={{color: C.amber, opacity: 0.55, side: 'right'}} windows={{color: '#f2b66d', prob: 0.05, opacity: 0.55}} spires={0.5} />
            <Skyline seed={38} baseY={820} minH={180} maxH={520} color="#1a252b" minW={90} maxW={210} x0={1240} x1={2400}
              edge={{color: C.amber, opacity: 0.55, side: 'left'}} windows={{color: '#f2b66d', prob: 0.05, opacity: 0.55}} spires={0.5} />
          </g>
          {/* avenue in perspective */}
          <path d={`M 0 ${H} L 860 800 L 1060 800 L ${W} ${H} Z`} fill="#12191e" />
          <path d={`M 0 ${H} L 860 800 L 0 800 Z`} fill="#0c1216" />
          <path d={`M ${W} ${H} L 1060 800 L ${W} 800 Z`} fill="#0c1216" />
          <path d={`M 940 805 L 980 805 L 1010 ${H} L 900 ${H} Z`} fill="#f0b46c" opacity={0.18} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = (i + ((frame * 0.0) % 1)) / 6;
            const y = 806 + Math.pow(t, 2) * 280;
            return <rect key={i} x={958 - t * 12} y={y} width={4 + t * 24} height={6 + t * 40} fill={C.mist} opacity={0.35} />;
          })}
          {/* parked cars + lamps both sides */}
          {[0, 1, 2, 3].map((i) => {
            const t = (i + 1) / 5, s = 0.25 + t * 1.1;
            return (
              <g key={i}>
                <CarSide x={860 - t * 760} y={800 + t * t * 260} s={s} glint={C.gold} />
                <CarSide x={1060 + t * 760} y={800 + t * t * 260} s={s} flip glint={C.gold} />
              </g>
            );
          })}
          {[0, 1, 2].map((i) => {
            const t = (i + 1) / 4;
            const x = 840 - t * 900, y = 800 + t * t * 290, hgt = 120 + t * 520;
            return <g key={i}><rect x={x} y={y - hgt} width={4 + t * 10} height={hgt} fill="#0a0f13" />
              <rect x={x} y={y - hgt} width={40 + t * 80} height={4 + t * 8} fill="#0a0f13" /></g>;
          })}
          <Birds x={600} y={360} count={11} vx={2.4} vy={-0.5} scale={1.1} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S02 clock */
export const S02: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const flip = Math.round(1.2 * FPS);
  const label = frame < flip ? '8:16' : '8:17';
  const pulse = interpolate(frame, [flip, flip + 4, flip + 20], [1, 1.12, 1], clamp);
  const colon = Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25;
  const dim = interpolate(frame, [flip, flip + 3], [1, 0.75], clamp);
  return (
    <AbsoluteFill style={{background: '#06090c', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, rgba(213,139,73,0.18), rgba(0,0,0,0) 60%)', opacity: dim}} />
      <div style={{fontFamily: 'DejaVu Sans Mono, monospace', fontWeight: 700, fontSize: 280, color: '#f0aa64', letterSpacing: 8,
        textShadow: '0 0 40px rgba(213,139,73,0.75), 0 0 120px rgba(213,139,73,0.35)', transform: `scale(${pulse})`, opacity: dim}}>
        {label.split('').map((ch, i) => <span key={i} style={{opacity: ch === ':' ? colon : 1}}>{ch}</span>)}
        <span style={{fontSize: 90, marginLeft: 30, letterSpacing: 4}}>AM</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- bedroom set */
const Bedroom: React.FC<{light?: number}> = ({light = 1}) => {
  const frame = useCurrentFrame();
  const flick = 0.92 + 0.08 * Math.sin(frame / 20);
  return (
    <>
      <rect x={0} y={0} width={W} height={H} fill="#141d23" />
      <rect x={0} y={820} width={W} height={260} fill="#1d1813" />
      {/* window with blinds (right) */}
      <rect x={1340} y={170} width={420} height={420} fill="#e7b073" />
      <Glow id="bw" cx={1550} cy={380} r={520} color={C.gold} opacity={0.45 * light} />
      {Array.from({length: 13}, (_, i) => <rect key={i} x={1340} y={176 + i * 32} width={420} height={18} fill="#2a2620" opacity={0.92} />)}
      <rect x={1330} y={160} width={440} height={440} fill="none" stroke="#0f1418" strokeWidth={20} />
      {/* light stripes cast across wall/bed */}
      <g style={{mixBlendMode: 'screen'}} opacity={0.55 * light * flick}>
        {Array.from({length: 9}, (_, i) => (
          <polygon key={i} points={`${1340},${190 + i * 32} ${1340},${204 + i * 32} ${380},${620 + i * 46} ${380},${596 + i * 46}`} fill={C.amber} opacity={0.35} />
        ))}
      </g>
      {/* shelf + plant + frame */}
      <rect x={260} y={250} width={300} height={14} fill="#2a2420" />
      <rect x={280} y={190} width={40} height={60} fill="#33302b" /><rect x={330} y={200} width={30} height={50} fill="#3d3a34" />
      <path d="M 470 250 C 450 200 470 170 500 190 C 520 160 550 190 530 220 C 560 220 560 250 530 250 Z" fill="#22382f" />
      <rect x={660} y={200} width={220} height={150} fill="#1b2328" stroke="#2b241e" strokeWidth={10} />
      <Skyline seed={5} baseY={340} minH={20} maxH={110} color="#2c3a40" minW={10} maxW={30} x0={666} x1={874} />
      <Dust area={[600, 250, 900, 600]} count={70} opacity={0.65 * light} />
    </>
  );
};

/* -------------------------------------------------------- S03 Noah sleeping */
export const S03: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const breath = (Math.sin(frame / 22) + 1) / 2;
  const wake = interpolate(frame, [dur - 60, dur - 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.08} to={1.0} origin="45% 60%">
        <Svg>
          <Bedroom />
          {/* bed */}
          <rect x={340} y={640} width={980} height={120} rx={18} fill="#2b3a42" />
          <rect x={320} y={500} width={40} height={300} rx={8} fill="#2a2018" />
          <rect x={340} y={740} width={980} height={60} fill="#1c252b" />
          <ellipse cx={470} cy={624} rx={120} ry={40} fill="#c9c3b6" />
          <g transform="translate(500 600)">
            <NoahLying breath={breath} lift={wake * 0.6} eye={wake} />
          </g>
          {/* nightstand + phone */}
          <rect x={170} y={640} width={140} height={180} fill="#2e2219" />
          <rect x={200} y={626} width={70} height={14} rx={4} fill="#0b0f12" />
          {/* chair with Noah's jacket and backpack */}
          <g transform="translate(1480 668)"><ChairWithGear /></g>
          {/* light stripes over blanket */}
          <g style={{mixBlendMode: 'screen'}} opacity={0.35}>
            {Array.from({length: 5}, (_, i) => <polygon key={i} points={`${700 + i * 120},640 ${760 + i * 120},640 ${700 + i * 120},760 ${640 + i * 120},760`} fill={C.amber} />)}
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- S04 phone UI */
const Toast: React.FC<{at: number; title: string; sub: string; y: number; icon: string}> = ({at, title, sub, y, icon}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <g opacity={t} transform={`translate(0 ${(1 - t) * 20})`}>
      <rect x={-210} y={y} width={420} height={96} rx={22} fill="#1c2630" opacity={0.92} />
      <circle cx={-160} cy={y + 48} r={24} fill={icon} />
      <text x={-120} y={y + 42} fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={26}>{title}</text>
      <text x={-120} y={y + 74} fill="#93a3ab" fontFamily="Inter" fontSize={22}>{sub}</text>
    </g>
  );
};

export const S04: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [26, 34], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="50% 52%">
        <Svg>
          <rect width={W} height={H} fill="#110c09" />
          <Glow id="s04w" cx={1700} cy={200} r={900} color={C.amber} opacity={0.35} />
          {/* wooden nightstand top */}
          <path d={`M 0 520 L ${W} 470 L ${W} ${H} L 0 ${H} Z`} fill="#4a3020" />
          {Array.from({length: 7}, (_, i) => <path key={i} d={`M 0 ${560 + i * 80} L ${W} ${510 + i * 82}`} stroke="#3c2618" strokeWidth={3} opacity={0.6} />)}
          <g style={{mixBlendMode: 'screen'}} opacity={0.4}>
            {Array.from({length: 6}, (_, i) => <polygon key={i} points={`${1100 + i * 140},470 ${1180 + i * 140},470 ${700 + i * 160},${H} ${560 + i * 160},${H}`} fill={C.amber} opacity={0.5} />)}
          </g>
          {/* lamp + glass */}
          <rect x={250} y={250} width={30} height={260} fill="#2e2a24" />
          <path d="M 120 260 C 140 160 390 160 410 260 Z" fill="#25352f" />
          <ellipse cx={265} cy={515} rx={90} ry={18} fill="#1d150f" />
          <rect x={1460} y={300} width={120} height={200} rx={10} fill="#a9c3c9" opacity={0.25} />
          <rect x={1460} y={400} width={120} height={100} fill="#a9c3c9" opacity={0.2} />
          {/* phone */}
          <g transform="translate(960 640) rotate(-8)">
            <rect x={-250} y={-330} width={500} height={760} rx={56} fill="#07090b" transform="scale(1 0.62)" />
            <g transform="scale(1 0.62)">
              <rect x={-232} y={-312} width={464} height={724} rx={44} fill="#0d141a" />
              <g opacity={on}>
                <rect x={-232} y={-312} width={464} height={724} rx={44} fill="#16232c" />
                <text x={0} y={-150} textAnchor="middle" fill="#e9eef1" fontFamily="Inter Display" fontWeight={300} fontSize={130}>8:17</text>
                <text x={0} y={-96} textAnchor="middle" fill="#9fb1b8" fontFamily="Inter" fontSize={28}>Tuesday</text>
                <text x={0} y={-30} textAnchor="middle" fill="#6f8189" fontFamily="Inter" fontSize={24}>No new notifications</text>
                <Toast at={62} y={10} title="Call failed" sub="Sis · No connection" icon="#c0553f" />
                <Toast at={102} y={124} title="No service" sub="Network unavailable" icon="#78969A" />
              </g>
            </g>
            <ellipse cx={0} cy={-30} rx={340} ry={240} fill="#9ed1ff" opacity={on * 0.06} />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ S05 hallway */
export const S05: React.FC<P> = ({dur}) => {
  const vx = 960, vy = 500;
  const doors = [0.18, 0.4, 0.58, 0.72];
  const along = (t: number, side: -1 | 1, top: boolean) => {
    // point along wall edge from frame edge (t=0) to vanishing area (t=1)
    const x0 = side < 0 ? 0 : W, y0 = top ? 0 : H;
    const xe = vx + side * 160, ye = vy + (top ? -110 : 110);
    return [lerp(x0, xe, t), lerp(y0, ye, t)] as const;
  };
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.14} origin="50% 46%">
        <Svg>
          <rect width={W} height={H} fill="#161f25" />
          {/* end window */}
          <rect x={vx - 160} y={vy - 110} width={320} height={220} fill="#e8b678" />
          <Glow id="hw" cx={vx} cy={vy} r={700} color={C.gold} opacity={0.5} />
          <rect x={vx - 40} y={vy - 110} width={10} height={220} fill="#2a2620" opacity={0.6} />
          <path d={`M 0 0 L ${vx - 160} ${vy - 110} L ${vx + 160} ${vy - 110} L ${W} 0 Z`} fill="#11181d" />
          <path d={`M 0 ${H} L ${vx - 160} ${vy + 110} L ${vx + 160} ${vy + 110} L ${W} ${H} Z`} fill="#2a241d" />
          <path d={`M 700 ${H} L ${vx - 30} ${vy + 110} L ${vx + 30} ${vy + 110} L 1220 ${H} Z`} fill="#f0b46c" opacity={0.14} />
          <path d={`M 0 0 L ${vx - 160} ${vy - 110} L ${vx - 160} ${vy + 110} L 0 ${H} Z`} fill="#1f2b30" />
          <path d={`M ${W} 0 L ${vx + 160} ${vy - 110} L ${vx + 160} ${vy + 110} L ${W} ${H} Z`} fill="#1b262b" />
          {/* wainscot line */}
          <path d={`M 0 ${H * 0.68} L ${vx - 160} ${vy + 40}`} stroke="#263C40" strokeWidth={6} />
          <path d={`M ${W} ${H * 0.68} L ${vx + 160} ${vy + 40}`} stroke="#263C40" strokeWidth={6} />
          {doors.map((t, i) => [-1, 1].map((side) => {
            const s = side as -1 | 1;
            const a1 = along(t, s, true), b1 = along(t, s, false);
            const a2 = along(t + 0.09, s, true), b2 = along(t + 0.09, s, false);
            const tt = (y0: number, y1: number, k: number) => lerp(y0, y1, k);
            const pts = [
              [a1[0], tt(a1[1], b1[1], 0.22)], [a2[0], tt(a2[1], b2[1], 0.22)],
              [b2[0], tt(a2[1], b2[1], 0.98)], [b1[0], tt(a1[1], b1[1], 0.98)],
            ];
            return (
              <g key={`${i}${side}`}>
                <polygon points={pts.map((q) => q.join(',')).join(' ')} fill={i % 2 ? '#1d3036' : '#22282c'} stroke="#0e1417" strokeWidth={4} />
                <circle cx={lerp(pts[0][0], pts[1][0], side < 0 ? 0.82 : 0.18)} cy={lerp(pts[0][1], pts[3][1], 0.55)} r={6 - t * 4} fill={C.amber} opacity={0.7} />
              </g>
            );
          }))}
          {/* scooter + shoes left by a door */}
          <g transform="translate(330 900) scale(0.9)">
            <line x1={0} y1={0} x2={80} y2={-200} stroke="#6b3b35" strokeWidth={10} />
            <line x1={-60} y1={-4} x2={150} y2={-4} stroke="#6b3b35" strokeWidth={12} />
            <circle cx={-50} cy={8} r={18} fill="#111" /><circle cx={140} cy={8} r={18} fill="#111" />
            <line x1={50} y1={-200} x2={110} y2={-200} stroke="#6b3b35" strokeWidth={10} strokeLinecap="round" />
          </g>
          <g transform="translate(1530 930)"><ellipse cx={0} cy={0} rx={40} ry={14} fill="#c9c3b6" /><ellipse cx={60} cy={6} rx={40} ry={14} fill="#c9c3b6" /></g>
          <Dust area={[600, 300, 720, 600]} count={80} opacity={0.6} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------- S06 sitting w/ phone */
export const S06: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const breath = (Math.sin(frame / 24) + 1) / 2;
  const look = interpolate(frame, [dur - 50, dur - 25], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1} origin="46% 55%">
        <Svg>
          <Bedroom light={0.85} />
          <rect x={300} y={700} width={900} height={110} rx={16} fill="#2b3a42" />
          <rect x={300} y={790} width={900} height={50} fill="#1c252b" />
          <ellipse cx={420} cy={690} rx={110} ry={34} fill="#c9c3b6" />
          <g transform="translate(1480 668)"><ChairWithGear /></g>
          <g transform="translate(800 700) scale(1.35)">
            <NoahSitting breath={breath} head={look} />
          </g>
          {/* phone light on his face */}
          <Glow id="ph" cx={1000} cy={530} r={260} color="#bfe0ff" opacity={0.28} />
          <g transform="translate(1180 280)" opacity={interpolate(frame, [10, 22], [0, 1], clamp)}>
            <rect x={0} y={0} width={360} height={110} rx={26} fill="#16232c" opacity={0.92} />
            <circle cx={54} cy={55} r={28} fill={interpolate(frame, [70, 72], [0, 1], clamp) > 0.5 ? '#c0553f' : '#4f8f6a'} />
            <text x={100} y={50} fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={28}>
              {frame < 70 ? 'Calling Sis…' : 'Call failed'}
            </text>
            <text x={100} y={84} fill="#93a3ab" fontFamily="Inter" fontSize={22}>{frame < 70 ? 'mobile' : 'No connection'}</text>
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- S07 walking to window */
export const S07: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const p = useProgress(dur);
  const x = lerp(380, 1180, p);
  const phase = frame / 5.2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.04} to={1.04} x={[60, -80]}>
        <Svg>
          <rect width={W} height={H} fill="#151d22" />
          <rect x={0} y={880} width={W} height={200} fill="#231c15" />
          {/* big window, right */}
          <rect x={1300} y={120} width={560} height={720} fill="#e7b073" />
          <Glow id="lw" cx={1580} cy={420} r={900} color={C.gold} opacity={0.5} />
          <svg x={1300} y={120} width={560} height={720} viewBox="1300 120 560 720">
            <Skyline seed={77} baseY={840} minH={120} maxH={520} color="#b98a5f" minW={40} maxW={90} x0={1300} x1={1860} />
            <Skyline seed={78} baseY={860} minH={80} maxH={380} color="#8b6a4d" minW={50} maxW={120} x0={1300} x1={1860} />
          </svg>
          <rect x={1290} y={110} width={580} height={740} fill="none" stroke="#0f1418" strokeWidth={22} />
          <rect x={1572} y={120} width={14} height={720} fill="#0f1418" />
          <polygon points={`1300,840 1860,840 1500,1080 700,1080`} fill={C.gold} opacity={0.16} />
          {/* kitchen counter + stools (left) */}
          <rect x={60} y={560} width={520} height={320} fill="#1b2328" />
          <rect x={40} y={540} width={560} height={26} fill="#2e3a40" />
          <rect x={90} y={300} width={460} height={14} fill="#2a2420" />
          <rect x={120} y={250} width={34} height={50} fill="#3d3a34" /><rect x={170} y={240} width={26} height={60} fill="#33302b" />
          <path d="M 420 300 C 400 250 420 220 450 240 C 470 210 500 240 480 270 C 510 270 510 300 480 300 Z" fill="#22382f" />
          {/* sofa */}
          <path d="M 760 880 L 760 720 C 760 690 790 680 820 680 L 1120 680 C 1150 680 1170 700 1170 720 L 1170 880 Z" fill="#2c3438" />
          <g transform={`translate(${x} 880) scale(1.25)`}>
            <NoahWalk phase={phase} />
          </g>
          <Dust area={[900, 200, 900, 700]} count={60} opacity={0.5} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* Shared: empty city seen from the apartment (S08) */
const EmptyCityView: React.FC<{p: number}> = ({p}) => (
  <>
    <SunriseSky sunY={lerp(430, 400, p)} id="s08" />
    <Rays cx={1140} cy={415} count={16} opacity={0.06} spin={1} />
    <Skyline seed={51} baseY={600} minH={100} maxH={380} color="#8a9a98" minW={40} maxW={100} />
    <Fog id="s08f" y={480} h={200} opacity={0.35} color="#f1d2a8" />
    <Skyline seed={52} baseY={700} minH={150} maxH={520} color="#3e5157" minW={60} maxW={140}
      edge={{color: C.gold, opacity: 0.45, side: 'left'}} />
    {/* street far below with stopped cars */}
    <path d={`M 700 ${H} L 1060 640 L 1180 640 L 1500 ${H} Z`} fill="#1a2328" />
    {Array.from({length: 14}, (_, i) => {
      const r = rng(200 + i);
      const t = i / 14, y = 650 + t * t * 430, s = 0.2 + t * 1.1;
      const x = lerp(1090, 1000, t) + (r() - 0.5) * 300 * t + (i % 2 ? 60 : -40) * t;
      return <rect key={i} x={x} y={y} width={36 * s} height={18 * s} rx={4 * s} fill={['#2c3a40', '#5a3a30', '#1b2328', '#6b6e70'][i % 4]}
        transform={`rotate(${(r() - 0.5) * 30} ${x} ${y})`} />;
    })}
    <Skyline seed={53} baseY={1100} minH={300} maxH={700} color="#141c21" minW={120} maxW={260} x0={-300} x1={700}
      edge={{color: C.amber, opacity: 0.5, side: 'right'}} windows={{color: '#2a3a40', prob: 0.4, opacity: 0.8}} />
    <Skyline seed={54} baseY={1100} minH={300} maxH={760} color="#141c21" minW={120} maxW={260} x0={1500} x1={2300}
      edge={{color: C.amber, opacity: 0.5, side: 'left'}} windows={{color: '#2a3a40', prob: 0.4, opacity: 0.8}} />
    <Birds x={500} y={300} count={6} vx={1.6} vy={-0.2} />
  </>
);

/* ---------------------------------------------- S08 over-shoulder window */
export const S08: React.FC<P> = ({dur}) => {
  const p = useProgress(dur);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="55% 45%">
        <Svg>
          <EmptyCityView p={p} />
          {/* window frame + curtain */}
          <rect x={-20} y={-20} width={W + 40} height={H + 40} fill="none" stroke="#0d1216" strokeWidth={140} />
          <path d={`M 1720 0 C ${1700 + Math.sin(frame / 18) * 20} 300 ${1760 + Math.sin(frame / 15) * 25} 700 1730 ${H} L ${W} ${H} L ${W} 0 Z`} fill="#c9b79c" opacity={0.85} />
          <path d={`M 1760 0 C ${1750 + Math.sin(frame / 18) * 20} 300 ${1800 + Math.sin(frame / 15) * 25} 700 1780 ${H}`} stroke="#a8977e" strokeWidth={10} fill="none" />
          <g transform={`translate(${lerp(560, 580, p)} ${H + 150}) scale(1.0)`}>
            <NoahBack armRaise={0} lean={lerp(0, 3, p)} />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------- S09 abandoned street */
export const S09: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const leaves = rng(91);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="60% 55%">
        <Svg>
          <Sky id="s09" stops={[[0, '#2a3a40'], [0.5, '#9c9a8c'], [0.8, '#e1b27a'], [1, '#f0c48c']]} />
          <Glow id="s09g" cx={1300} cy={520} r={700} color={C.gold} opacity={0.5} />
          <Skyline seed={61} baseY={560} minH={120} maxH={380} color="#8d9590" minW={40} maxW={100} />
          <Fog id="s09f" y={420} h={260} opacity={0.4} color="#eed4b0" />
          <Skyline seed={62} baseY={600} minH={200} maxH={600} color="#2d3c42" minW={100} maxW={220} x0={1300}
            edge={{color: C.gold, opacity: 0.5, side: 'left'}} windows={{color: '#1a2328', prob: 0.5, opacity: 0.6}} />
          {/* road */}
          <path d={`M 0 640 L ${W} 600 L ${W} ${H} L 0 ${H} Z`} fill="#20272b" />
          <path d={`M 0 760 L ${W} 650`} stroke={C.mist} strokeWidth={5} strokeDasharray="60 50" opacity={0.3} />
          {/* stopped cars at odd angles */}
          <g transform="rotate(-3 1100 660)"><CarSide x={1100} y={660} s={0.9} color="#2a353b" glint={C.gold} /></g>
          <g transform="rotate(4 1450 640)"><CarSide x={1450} y={640} s={0.7} color="#4a3329" flip glint={C.gold} /></g>
          <CarSide x={760} y={690} s={1.2} color="#1b2328" glint={C.gold} />
          {/* fallen bicycle */}
          <g transform="translate(560 860) rotate(-8)">
            <circle cx={-80} cy={0} r={56} stroke="#0e1316" strokeWidth={8} fill="none" />
            <circle cx={90} cy={0} r={56} stroke="#0e1316" strokeWidth={8} fill="none" />
            <path d="M -80 0 L -10 -70 L 60 -70 L 90 0 M -10 -70 L 10 0 L -80 0 M 10 0 L 60 -70 M 60 -70 L 50 -96 M -20 -80 L 0 -80" stroke="#6b3b35" strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
          {/* bench + coffee cup in foreground */}
          <rect x={-40} y={830} width={560} height={26} fill="#1a1410" />
          <rect x={-40} y={880} width={560} height={26} fill="#221a14" />
          <rect x={60} y={900} width={20} height={200} fill="#0e0b09" /><rect x={400} y={900} width={20} height={200} fill="#0e0b09" />
          <path d="M 280 830 L 290 760 L 342 760 L 352 830 Z" fill="#c9b79c" />
          <rect x={284} y={750} width={64} height={14} rx={4} fill="#3a2a20" />
          <rect x={288} y={784} width={56} height={22} fill="#6b4630" />
          <path d="M 352 830 L 342 760" stroke={C.gold} strokeWidth={3} opacity={0.7} />
          {/* drifting leaves */}
          {Array.from({length: 14}, (_, i) => {
            const bx = leaves() * W, by = leaves() * 400, sp = 1 + leaves() * 1.5, ph = leaves() * 6;
            const x = (bx + frame * sp * 2.2) % (W + 100) - 50;
            const y = by + 300 + frame * sp * 1.2 + Math.sin(frame / 10 + ph) * 20;
            return <ellipse key={i} cx={x} cy={y % H} rx={10} ry={5} fill={i % 2 ? '#b8622e' : '#d58b49'} transform={`rotate(${frame * 4 + ph * 50} ${x} ${y % H})`} opacity={0.85} />;
          })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------- S10 traffic light */
export const S10: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const green = frame > dur * 0.55;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.06} to={1.06} y={[-60, 60]}>
        <Svg>
          <Sky id="s10" stops={[[0, '#22343b'], [0.6, '#7d9497'], [1, '#e9b678']]} />
          <Glow id="s10g" cx={1200} cy={900} r={700} color={C.gold} opacity={0.4} />
          {/* converging towers (low angle) */}
          <polygon points={`0,0 700,0 560,${H} 0,${H}`} fill="#1d2a30" />
          <polygon points={`620,0 700,0 560,${H} 520,${H}`} fill={C.amber} opacity={0.35} />
          <polygon points={`${W},0 1300,0 1420,${H} ${W},${H}`} fill="#18242a" />
          {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={i * 95} x2={lerp(700, 560, i / 11)} y2={i * 95} stroke="#2a3a40" strokeWidth={4} />)}
          {Array.from({length: 12}, (_, i) => <line key={i} x1={W} y1={i * 95} x2={lerp(1300, 1420, i / 11)} y2={i * 95} stroke="#22323a" strokeWidth={4} />)}
          {/* pole + arm + light */}
          <rect x={360} y={360} width={30} height={900} fill="#0b1013" />
          <rect x={360} y={360} width={760} height={24} fill="#0b1013" />
          <rect x={1060} y={384} width={110} height={300} rx={20} fill="#0f1518" />
          {[0, 1, 2].map((i) => {
            const isRed = i === 0, isGreen = i === 2;
            const lit = (isRed && !green) || (isGreen && green);
            const col = isRed ? '#ff4a3a' : i === 1 ? '#ffb340' : '#39e08a';
            return <g key={i}>
              <circle cx={1115} cy={440 + i * 92} r={34} fill={lit ? col : '#1e2528'} />
              {lit && <Glow id={`tl${i}`} cx={1115} cy={440 + i * 92} r={220} color={col} opacity={0.5} />}
            </g>;
          })}
          {/* pigeons */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${700 + i * 180} ${1000 + i * 12}) scale(${i % 2 ? -1 : 1} 1)`}>
              <ellipse cx={0} cy={0} rx={30} ry={18} fill="#54606a" />
              <circle cx={26} cy={-14 + Math.sin(frame / 6 + i) * 4} r={11} fill="#4a555e" />
            </g>
          ))}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ S11 aerial empty city */
const IsoCity: React.FC<{seed: number}> = ({seed}) => {
  const r = rng(seed);
  const tiles: React.ReactNode[] = [];
  const tw = 120, th = 60;
  for (let gy = 0; gy < 22; gy++) {
    for (let gx = 0; gx < 22; gx++) {
      if (gx % 3 === 2 || gy % 3 === 2) continue; // streets
      const x = 960 + (gx - gy) * (tw / 2);
      const y = -80 + (gx + gy) * (th / 2);
      const hgt = 16 + Math.pow(r(), 3) * 200;
      const top = `${x},${y - hgt} ${x + tw / 2},${y - hgt + th / 2} ${x},${y - hgt + th} ${x - tw / 2},${y - hgt + th / 2}`;
      const left = `${x - tw / 2},${y - hgt + th / 2} ${x},${y - hgt + th} ${x},${y + th} ${x - tw / 2},${y + th / 2}`;
      const right = `${x + tw / 2},${y - hgt + th / 2} ${x},${y - hgt + th} ${x},${y + th} ${x + tw / 2},${y + th / 2}`;
      const depth = (gx + gy) / 44;
      tiles.push(
        <g key={`${gx}-${gy}`} opacity={1 - depth * 0.15}>
          <polygon points={left} fill="#1b2a33" />
          <polygon points={right} fill="#2f4650" />
          <polygon points={top} fill="#4d6a73" />
          <polygon points={right} fill={C.amber} opacity={0.18} />
        </g>,
      );
    }
  }
  return <g transform="scale(1.2) translate(-160 -40)">{tiles}</g>;
};

export const S11: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const dimAt = Math.round(3.0 * FPS);
  const dim = interpolate(frame, [dimAt - 2, dimAt + 2, dimAt + 40], [0, 0.55, 0.25], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1} origin="50% 50%">
        <Svg>
          <rect width={W} height={H} fill="#0c151a" />
          <IsoCity seed={404} />
          <Glow id="s11g" cx={1700} cy={-50} r={1100} color={C.gold} opacity={0.45} />
          <Rays cx={1750} cy={-80} count={12} opacity={0.07} />
          <Fog id="s11f1" y={250} h={260} opacity={0.35} speed={0.8} color="#c9d4d2" />
          <Fog id="s11f2" y={700} h={300} opacity={0.3} speed={0.5} color="#c9d4d2" />
          <Birds x={300} y={500} count={5} vx={1.8} vy={-0.4} scale={0.8} color="#0d1418" />
        </Svg>
      </Camera>
      <AbsoluteFill style={{background: '#000', opacity: dim}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------- S12 Noah profile close-up */
export const S12: React.FC<P> = ({dur}) => {
  const frame = useCurrentFrame();
  const blink = interpolate(frame % 96, [60, 64, 68], [0, 1, 0], clamp);
  const look = interpolate(frame, [30, 70], [0, 1], clamp);
  const breath = Math.sin(frame / 26) * 3;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="40% 45%">
        <Svg>
          <Sky id="s12" stops={[[0, '#121b21'], [0.5, '#25363c'], [1, '#3b4a4a']]} />
          {/* window to the right: blurred empty city */}
          <g opacity={0.9} filter="url(#s12b)">
            <defs><filter id="s12b"><feGaussianBlur stdDeviation="10" /></filter></defs>
            <rect x={1050} y={0} width={900} height={H} fill="#d9a46a" />
            <Skyline seed={88} baseY={1000} minH={200} maxH={700} color="#8a6a4f" minW={60} maxW={140} x0={1050} x1={2000} />
          </g>
          <Glow id="s12g" cx={1500} cy={400} r={900} color={C.gold} opacity={0.4} />
          <rect x={1030} y={0} width={30} height={H} fill="#0e1418" />
          <g transform={`translate(600 ${150 + breath}) scale(1.25)`}>
            <NoahProfile blink={blink} look={look} />
          </g>
          {/* glass reflection streak */}
          <polygon points="1100,0 1180,0 980,1080 900,1080" fill="#fff" opacity={0.04} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- S13 title */
export const S13: React.FC<P & {title: string}> = ({dur, title}) => {
  const frame = useCurrentFrame();
  const lead = Math.round(3.8 * FPS);
  const t = (a: number, b: number) => interpolate(frame, [lead + a, lead + b], [0, 1], clamp);
  const word = 'AFTER ZERO';
  return (
    <AbsoluteFill style={{background: '#0b1216'}}>
      <Camera dur={dur} from={1.04} to={1.0}>
        <Svg>
          <rect width={W} height={H} fill="#16252d" />
          <IsoCity seed={404} />
          <Fog id="s13f" y={300} h={500} opacity={0.4} speed={0.4} color="#c9d4d2" />
        </Svg>
      </Camera>
      <AbsoluteFill style={{background: 'rgba(5,9,12,1)', opacity: interpolate(frame, [0, lead], [0.45, 0.82], clamp)}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'Inter Display, Inter'}}>
        <div style={{display: 'flex', gap: 26, fontWeight: 900, fontSize: 190, color: C.mist}}>
          {word.split('').map((ch, i) => (
            <span key={i} style={{opacity: t(i * 2, i * 2 + 14), transform: `translateY(${(1 - t(i * 2, i * 2 + 14)) * 30}px)`, filter: `blur(${(1 - t(i * 2, i * 2 + 14)) * 8}px)`,
              width: ch === ' ' ? 50 : undefined}}>{ch}</span>
          ))}
        </div>
        <div style={{width: 320 * t(24, 44), height: 4, background: C.amber, margin: '26px 0 30px'}} />
        <div style={{color: C.ice, fontSize: 30, letterSpacing: 8, fontWeight: 300, opacity: t(36, 54)}}>WHEN EVERYTHING ENDS, THE STORY BEGINS.</div>
        <div style={{color: C.amber, fontSize: 46, fontWeight: 600, marginTop: 70, opacity: t(54, 72)}}>{title}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', color: '#8f9692', fontFamily: 'Inter', fontSize: 26,
        opacity: t(60, 80)}}>A fictional story. Any resemblance to real events is coincidental.</div>
    </AbsoluteFill>
  );
};
