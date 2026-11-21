import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Birds, C, Camera, CarSide, clamp, Dust, Fog, Glow, H, lerp, Rays, rng, Sky, Skyline, Svg, useProgress, W} from '../lib';
import {NoahLying, NoahSitting, NoahStandBack, NoahWalk} from '../noah';
import {camFor, SetProps, SKY, TONES} from './common';

const CON = {wall: '#2c3133', wall2: '#363b3c', floor: '#1d2123', ceil: '#232829', pipe: '#4a4f50', rust: '#6b4a35', lamp: '#f2c27d', cold: '#dfe8ec'};

/** darkness overlay with a soft flashlight hole */
const Flash: React.FC<{cx: number; cy: number; r?: number; dark?: number; id: string}> = ({cx, cy, r = 360, dark = 0.97, id}) => (
  <>
    <defs>
      <radialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#000" stopOpacity={0} />
        <stop offset="0.45" stopColor="#000" stopOpacity={0.15} />
        <stop offset="1" stopColor="#000" stopOpacity={dark} />
      </radialGradient>
    </defs>
    <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id})`} />
  </>
);

const useShake = (amt: number) => {
  const frame = useCurrentFrame();
  const r = rng(frame * 7 + 1);
  return amt ? [(r() - 0.5) * 40 * amt, (r() - 0.5) * 30 * amt] : [0, 0];
};

/* ---------------------------------------------------------- bunker entrance */
export const BunkerEntrance: React.FC<SetProps> = ({dur, p}) => {
  const t = p.time ?? 'day';
  const tone = TONES[t as 'day'];
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 70, 0.8);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="be" stops={SKY[t as 'day']} />
          {t === 'dusk' && <Glow id="beg" cx={1500} cy={560} r={800} color="#e2914f" opacity={0.5} />}
          <polygon points={`0,700 400,520 800,600 1200,440 1600,560 1920,500 1920,${H} 0,${H}`} fill={t === 'dusk' ? '#4a3d3a' : '#6f8277'} />
          <Fog id="bef" y={520} h={200} opacity={0.3} color={tone.fog} />
          {/* hillside */}
          <path d={`M -100 ${H} L -100 640 C 300 560 700 520 1100 600 C 1400 660 1700 760 2100 800 L 2100 ${H} Z`} fill={t === 'dusk' ? '#2a2a26' : '#3c5a3c'} />
          {Array.from({length: 22}, (_, i) => { const r = rng(i + seed); const x = r() * W, y = 600 + r() * 200, h = 60 + r() * 90; return <polygon key={i} points={`${x},${y - h} ${x - 26},${y} ${x + 26},${y}`} fill={t === 'dusk' ? '#1c1d1a' : '#24402c'} />; })}
          {/* concrete portal */}
          <g transform="translate(860 760)">
            <path d="M -260 120 L -220 -160 L 220 -160 L 260 120 Z" fill="#8a8f88" />
            <path d="M -220 -160 L 220 -160 L 200 -130 L -200 -130 Z" fill="#a9ada5" />
            <rect x={-110} y={-110} width={220} height={230} fill="#2a2420" />
            {!p.collapsed && <rect x={-100} y={-100} width={p.door ? 60 : 200} height={220} fill={CON.rust} />}
            {!p.collapsed && !p.door && <><rect x={-80} y={-60} width={160} height={14} fill="#4a3324" /><circle cx={60} cy={10} r={10} fill="#3a2a20" /></>}
            <text x={0} y={-140} textAnchor="middle" fill="#3a3f3c" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={22}>CD-7</text>
            <rect x={-150} y={-60} width={30} height={30} fill="#d5b23a" /><path d="M -135 -56 L -122 -34 L -148 -34 Z" fill="#1a1a1a" />
          </g>
          {p.collapsed && <g>
            {Array.from({length: 40}, (_, i) => { const r = rng(i * 3 + 5); const x = 560 + r() * 620, y = 640 + r() * 260, s = 20 + r() * 60; return <polygon key={i} points={`${x},${y - s} ${x + s},${y - s * 0.3} ${x + s * 0.6},${y + s * 0.5} ${x - s * 0.5},${y + s * 0.3}`} fill={['#6a6258', '#57504a', '#7a7064'][i % 3]} />; })}
            <path d="M 300 1080 C 500 760 900 600 1500 700 L 1920 1080 Z" fill="#5a5048" opacity={0.85} />
          </g>}
          {/* parked car on the gravel road */}
          {!p.collapsed && <CarSide x={1450} y={930} s={1.1} color="#3a4a52" glint="#e8e2d0" />}
          {p.noah && !p.collapsed && <g transform={`translate(${p.door ? 860 : lerp(1300, 1000, Math.min(1, frame / dur))} 880) scale(0.42)`}>
            {p.door ? <NoahStandBack /> : <g transform="scale(-1 1)"><NoahWalk phase={frame / 5.5} outfit="out" /></g>}
          </g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- stairs going down */
export const BunkerStairs: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.25} origin="50% 70%">
        <Svg>
          <rect width={W} height={H} fill="#050607" />
          {Array.from({length: 20}, (_, i) => {
            const k = i / 20;
            const w = lerp(1400, 120, Math.pow(k, 0.7)), y = lerp(H + 40, 420, Math.pow(k, 0.7));
            const h = lerp(70, 6, Math.pow(k, 0.7));
            return <rect key={i} x={960 - w / 2} y={y - h} width={w} height={h} fill={i % 2 ? '#3a3f40' : '#2e3334'} />;
          })}
          <polygon points="200,0 900,410 900,1080 0,1080" fill="#1a1d1e" />
          <polygon points="1720,0 1020,410 1020,1080 1920,1080" fill="#16191a" />
          {[0.15, 0.4, 0.65].map((k, i) => <g key={i}><rect x={lerp(240, 880, k)} y={lerp(100, 400, k)} width={lerp(30, 6, k)} height={lerp(20, 4, k)} fill={CON.lamp} opacity={0.4} /></g>)}
          <Flash cx={960} cy={lerp(700, 560, pr)} r={420} id="bsf" />
          {/* flashlight beam flicker */}
          <polygon points={`960,1080 ${900 + Math.sin(frame / 9) * 20},460 ${1020 + Math.sin(frame / 9) * 20},460`} fill={CON.cold} opacity={0.05} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- main corridor */
export const Corridor: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const light = p.light ?? 'on';
  const quake = p.quake ? p.quake * interpolate(frame, [0, 10, dur - 20, dur], [0.3, 1, 1, 0.4], clamp) : (p.rumble ? interpolate(frame, [dur * 0.6, dur], [0, 0.25], clamp) : 0);
  const [sx, sy] = useShake(quake);
  const seed = p.seed ?? 1;
  const vx = 960, vy = 480;
  const on = light === 'on' ? (p.lightsOn ? (frame > 20 ? 1 : (frame % 6 < 3 ? 0.3 : 0)) : 1) : 0;
  const beamX = 960 + Math.sin(frame / 30 + seed) * 220;
  const pr = useProgress(dur);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={1.0} to={1.1} origin="50% 46%">
          <Svg>
            <rect width={W} height={H} fill={CON.wall} />
            <path d={`M 0 0 L ${vx - 120} ${vy - 90} L ${vx + 120} ${vy - 90} L ${W} 0 Z`} fill={CON.ceil} />
            <path d={`M 0 ${H} L ${vx - 120} ${vy + 90} L ${vx + 120} ${vy + 90} L ${W} ${H} Z`} fill={CON.floor} />
            <path d={`M 0 0 L ${vx - 120} ${vy - 90} L ${vx - 120} ${vy + 90} L 0 ${H} Z`} fill={CON.wall2} />
            <path d={`M ${W} 0 L ${vx + 120} ${vy - 90} L ${vx + 120} ${vy + 90} L ${W} ${H} Z`} fill={CON.wall} />
            <rect x={vx - 120} y={vy - 90} width={240} height={180} fill="#161a1b" />
            <rect x={vx - 70} y={vy - 70} width={140} height={160} fill="#3a2e28" />
            {/* pipes */}
            {[0.12, 0.2].map((h, i) => <path key={i} d={`M 0 ${H * h} L ${vx - 120} ${vy - 90 + 30 * (i + 1)}`} stroke={CON.pipe} strokeWidth={lerp(22, 14, i)} />)}
            <path d={`M ${W} ${H * 0.16} L ${vx + 120} ${vy - 60}`} stroke={CON.rust} strokeWidth={20} />
            {/* yellow stripe + arrows */}
            <path d={`M 0 ${H * 0.66} L ${vx - 120} ${vy + 40}`} stroke="#c9a23a" strokeWidth={14} opacity={0.8} />
            <path d={`M ${W} ${H * 0.66} L ${vx + 120} ${vy + 40}`} stroke="#c9a23a" strokeWidth={14} opacity={0.8} />
            <text x={300} y={560} fill="#c9a23a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={40} transform="skewY(-20) translate(0 200)">SUPPLY →</text>
            {/* caged lamps */}
            {[0.1, 0.35, 0.6].map((k, i) => {
              const x = vx, y = lerp(40, vy - 90, k), s = lerp(1.4, 0.4, k);
              const swing = quake ? Math.sin(frame / 4 + i) * 20 * quake : 0;
              return <g key={i} transform={`translate(${x} ${y}) rotate(${swing}) scale(${s})`}>
                <line x1={0} y1={-40} x2={0} y2={0} stroke="#111" strokeWidth={4} />
                <ellipse cx={0} cy={18} rx={26} ry={22} fill={on ? CON.lamp : '#3a3a34'} />
                <path d="M -26 18 L 26 18 M 0 -4 L 0 40 M -18 4 L 18 34 M 18 4 L -18 34" stroke="#111" strokeWidth={4} />
                {on > 0 && <Glow id={`cl${i}`} cx={0} cy={18} r={220} color={CON.lamp} opacity={0.45 * on} />}
              </g>;
            })}
            {p.noah && <g transform={`translate(${lerp(900, 980, pr)} 930) scale(0.62)`}><NoahStandBack /></g>}
            {quake > 0 && Array.from({length: 60}, (_, i) => { const r = rng(i * 11); const x = r() * W, y = (r() * H + frame * (6 + r() * 8)) % H; return <rect key={i} x={x} y={y} width={2 + r() * 5} height={2 + r() * 5} fill="#9a958a" opacity={0.7} />; })}
            {quake > 0.5 && <rect width={W} height={H} fill="#b8b2a4" opacity={0.08 + 0.06 * Math.sin(frame)} />}
            {light === 'on' && <Dust area={[400, 100, 1100, 700]} count={50} opacity={0.4} color={CON.lamp} />}
            {light === 'flash' && <Flash cx={beamX} cy={520} r={460} id="cf1" />}
            {light === 'dark' && (p.flashOn ? <Flash cx={beamX} cy={560} r={300} dark={0.99} id="cf2" /> : <rect width={W} height={H} fill="#000" opacity={0.97} />)}
          </Svg>
        </Camera>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- collapsed stairs */
export const Rubble: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const r = rng(77 + (p.seed ?? 0));
  const fall = p.falling ? frame : 999;
  const dustO = p.dust || p.falling ? interpolate(frame, [0, dur], [0.7, 0.25], clamp) : 0.12;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="50% 55%">
        <Svg>
          <rect width={W} height={H} fill="#1d2123" />
          <polygon points="0,0 1920,0 1500,300 420,300" fill="#232829" />
          <polygon points="0,1080 1920,1080 1500,860 420,860" fill="#1a1d1f" />
          <polygon points="0,0 420,300 420,860 0,1080" fill="#2a2f31" />
          <polygon points="1920,0 1500,300 1500,860 1920,1080" fill="#272b2d" />
          {/* rock wall */}
          {Array.from({length: 70}, (_, i) => {
            const x = 420 + r() * 1080, yEnd = 300 + r() * 560, s = 30 + r() * 90;
            const y = p.falling ? Math.min(yEnd, -200 + (fall - i * 0.6) * 40) : yEnd;
            return <polygon key={i} points={`${x},${y - s} ${x + s},${y - s * 0.2} ${x + s * 0.7},${y + s * 0.6} ${x - s * 0.4},${y + s * 0.4}`} fill={['#5e5850', '#4c4740', '#6f685e', '#3e3a35'][i % 4]} />;
          })}
          {p.noah && <g transform={`translate(${p.seed === 2 ? 1000 : 900} 1040) scale(0.8)`}><NoahStandBack /></g>}
          <rect width={W} height={H} fill="#a9a396" opacity={dustO} />
          <Dust area={[300, 100, 1300, 900]} count={140} opacity={0.6} color="#d8d2c4" seed={p.seed ?? 3} />
          <Flash cx={960 + Math.sin(frame / 25) * 160} cy={560} r={520} dark={0.95} id="rbf" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- generator room */
export const Generator: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const st = p.state ?? 'off';
  const running = st === 'running' || (st === 'failing' && frame < dur * 0.5);
  const vib = running ? Math.sin(frame * 2.2) * 2 : 0;
  const lit = running ? 1 : st === 'failing' ? (frame % 8 < 4 ? 0.6 : 0.1) : 0;
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 80, 0.7);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#24292b" />
          <rect x={0} y={820} width={W} height={260} fill="#1a1d1f" />
          {[300, 900, 1500].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={80} stroke="#111" strokeWidth={4} /><ellipse cx={x} cy={96} rx={30} ry={24} fill={lit ? CON.lamp : '#333'} />{lit > 0 && <Glow id={`gl${i}`} cx={x} cy={110} r={420} color={CON.lamp} opacity={0.4 * lit} />}</g>)}
          {/* generator */}
          <g transform={`translate(${880 + vib} 600)`}>
            <rect x={-420} y={180} width={840} height={60} fill="#151819" />
            <rect x={-380} y={-120} width={560} height={300} rx={20} fill="#4a6a5a" />
            <rect x={-380} y={-120} width={560} height={40} rx={14} fill="#5a7a6a" />
            {Array.from({length: 8}, (_, i) => <rect key={i} x={-340 + i * 60} y={-60} width={30} height={200} rx={6} fill="#3a5446" />)}
            <rect x={180} y={-60} width={220} height={240} rx={14} fill="#3a3f40" />
            <circle cx={240} cy={20} r={40} fill="#d8d2c4" /><line x1={240} y1={20} x2={240 + Math.cos(running ? -0.6 + Math.sin(frame / 3) * 0.1 : 2.6) * 32} y2={20 + Math.sin(running ? -0.6 : 2.6) * 32} stroke="#c0553f" strokeWidth={5} />
            <circle cx={340} cy={20} r={40} fill="#d8d2c4" /><line x1={340} y1={20} x2={340 + Math.cos(running ? -1.2 : 2.8) * 32} y2={20 + Math.sin(running ? -1.2 : 2.8) * 32} stroke="#c0553f" strokeWidth={5} />
            <circle cx={290} cy={120} r={16} fill={running ? '#39e08a' : st === 'failing' ? '#ff4a3a' : '#2a2a2a'} />
            <text x={-100} y={-90} textAnchor="middle" fill="#e8e2d0" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={26}>DIESEL GEN · 1961</text>
            <path d="M -200 -120 L -200 -400" stroke="#3a3f40" strokeWidth={50} />
            {running && [0, 1, 2].map((i) => { const k = ((frame / 30 + i / 3) % 1); return <circle key={i} cx={-200 + Math.sin(k * 6) * 10} cy={-420 - k * 120} r={20 + k * 40} fill="#8a8a84" opacity={(1 - k) * 0.3} />; })}
            {p.leak && <ellipse cx={120} cy={250} rx={60 + (frame % 200) * 0.6} ry={14} fill="#2a2418" opacity={0.85} />}
            {p.leak && <circle cx={120} cy={190 + (frame * 6) % 60} r={4} fill="#4a3a20" />}
          </g>
          {/* fuel drums */}
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1500 + i * 120} 690)`}><rect x={-50} y={0} width={100} height={150} rx={10} fill={i === 2 ? '#7a3a2a' : '#8a4a30'} /><rect x={-50} y={40} width={100} height={8} fill="#5a2a1a" /><rect x={-50} y={100} width={100} height={8} fill="#5a2a1a" /></g>)}
          {p.noah && <g transform="translate(560 900) scale(0.8)"><NoahWalk phase={0.6} outfit="out" /></g>}
          {!running && <Flash cx={700 + Math.sin(frame / 30) * 120} cy={620} r={520} dark={0.93} id="gnf" />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- storage room */
export const Storage: React.FC<SetProps> = ({dur, p}) => {
  const level = p.level ?? 1;
  const r = rng(55);
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 90, 0.8);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#262b2d" />
          <Glow id="stg" cx={960} cy={120} r={900} color={CON.lamp} opacity={0.35} />
          <rect x={0} y={880} width={W} height={200} fill="#1c1f21" />
          {[0, 1, 2].map((col) => (
            <g key={col} transform={`translate(${160 + col * 560} 160)`}>
              <rect x={0} y={0} width={20} height={720} fill="#4a4f50" /><rect x={460} y={0} width={20} height={720} fill="#4a4f50" />
              {Array.from({length: 5}, (_, row) => (
                <g key={row}>
                  <rect x={0} y={row * 150 + 130} width={480} height={14} fill="#5a5f60" />
                  {Array.from({length: 10}, (_, k) => (r() < level ? <g key={k}>
                    <rect x={30 + k * 44} y={row * 150 + 70} width={36} height={60} rx={4} fill={['#8a7a4a', '#6b5a3a', '#7a6a5a', '#4a6a5a'][(k + row) % 4]} />
                    <rect x={30 + k * 44} y={row * 150 + 88} width={36} height={14} fill="#c9b07a" opacity={0.7} />
                  </g> : null))}
                </g>
              ))}
            </g>
          ))}
          <text x={960} y={140} textAnchor="middle" fill="#c9a23a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={36}>RATIONS · LOT 1962 · CIVIL DEFENSE</text>
          {p.tools && <g transform="translate(1500 900)"><line x1={-200} y1={0} x2={-60} y2={-300} stroke="#6b4a35" strokeWidth={12} /><rect x={-230} y={-10} width={70} height={50} fill="#7d8a8a" />
            <line x1={0} y1={0} x2={60} y2={-300} stroke="#6b4a35" strokeWidth={12} /><path d="M 20 -320 Q 60 -360 110 -300" stroke="#7d8a8a" strokeWidth={14} fill="none" />
            <path d="M 120 -40 L 300 -40 L 270 30 L 140 30 Z" fill="#4a6a5a" /><circle cx={160} cy={50} r={22} fill="#1a1a1a" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- water tank */
export const WaterTank: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const level = p.level ?? 0.5;
  const drip = (frame % 40) / 40;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="50% 50%">
        <Svg>
          <rect width={W} height={H} fill="#22272a" />
          <Glow id="wtg" cx={1400} cy={100} r={900} color={CON.lamp} opacity={0.3} />
          <rect x={0} y={900} width={W} height={180} fill="#1a1d1f" />
          <g transform="translate(960 520)">
            <rect x={-300} y={-380} width={600} height={760} rx={60} fill="#5a6466" />
            <rect x={-300} y={-380} width={600} height={760} rx={60} fill="none" stroke="#3a4244" strokeWidth={10} />
            {Array.from({length: 6}, (_, i) => <rect key={i} x={-300} y={-330 + i * 130} width={600} height={8} fill="#4a5254" />)}
            {/* sight glass */}
            <rect x={-40} y={-320} width={80} height={640} rx={20} fill="#0f1416" />
            <rect x={-30} y={-310 + 620 * (1 - level)} width={60} height={620 * level} rx={14} fill="#5aa0c0" opacity={0.85} />
            {[0.25, 0.5, 0.75].map((k) => <g key={k}><line x1={50} y1={310 - 620 * k} x2={80} y2={310 - 620 * k} stroke="#d8d2c4" strokeWidth={4} /><text x={90} y={318 - 620 * k} fill="#d8d2c4" fontFamily="DejaVu Sans Mono" fontSize={24}>{k * 2000} L</text></g>)}
            <text x={0} y={-400} textAnchor="middle" fill="#c9a23a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={34}>POTABLE WATER</text>
            <rect x={260} y={300} width={140} height={30} fill="#4a4f50" /><rect x={380} y={300} width={20} height={60} fill="#4a4f50" />
            <ellipse cx={390} cy={370 + drip * 120} rx={6} ry={9} fill="#7ab8d0" opacity={1 - drip} />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- air filter machine */
export const AirFilter: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const a = frame / 6;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.04} to={1.0}>
        <Svg>
          <rect width={W} height={H} fill="#262b2d" />
          <Glow id="afg" cx={900} cy={120} r={800} color={CON.lamp} opacity={0.3} />
          <rect x={0} y={880} width={W} height={200} fill="#1a1d1f" />
          <g transform="translate(900 560)">
            <rect x={-360} y={-260} width={720} height={540} rx={20} fill="#6a7a6a" />
            <circle cx={-120} cy={0} r={190} fill="#3a4a3a" />
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M -120 0 L ${-120 + Math.cos(a + i * 1.256) * 170} ${Math.sin(a + i * 1.256) * 170} L ${-120 + Math.cos(a + i * 1.256 + 0.4) * 170} ${Math.sin(a + i * 1.256 + 0.4) * 170} Z`} fill="#8a9a8a" />)}
            <circle cx={-120} cy={0} r={190} fill="none" stroke="#2a3a2a" strokeWidth={14} />
            {Array.from({length: 7}, (_, i) => <line key={i} x1={-310} y1={-190 + i * 63} x2={70} y2={-190 + i * 63} stroke="#2a3a2a" strokeWidth={4} opacity={0.6} />)}
            <circle cx={230} cy={60} r={70} fill="#4a5a4a" />
            <line x1={230} y1={60} x2={230 + Math.cos(a) * 120} y2={60 + Math.sin(a) * 120} stroke="#3a3f40" strokeWidth={18} strokeLinecap="round" />
            <circle cx={230 + Math.cos(a) * 120} cy={60 + Math.sin(a) * 120} r={22} fill="#6b4a35" />
            <text x={0} y={-210} textAnchor="middle" fill="#1a1d1a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={30}>AIR FILTRATION · MANUAL</text>
          </g>
          {p.noah && <g transform={`translate(${1260 + Math.cos(a) * 20} 900) scale(0.8)`}><g transform="scale(-1 1)"><NoahWalk phase={0.3} outfit="out" /></g></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- bunk room */
export const Bunk: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const light = p.light ?? 'lamp';
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 100, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#262b2d" />
          <rect x={0} y={860} width={W} height={220} fill="#1a1d1f" />
          {[300, 1300].map((x, i) => (
            <g key={i} transform={`translate(${x} 0)`}>
              <rect x={0} y={320} width={20} height={560} fill="#4a4f50" /><rect x={460} y={320} width={20} height={560} fill="#4a4f50" />
              <rect x={0} y={460} width={480} height={50} fill="#5a6466" /><rect x={10} y={430} width={460} height={40} rx={10} fill="#6b7a6a" />
              <rect x={0} y={760} width={480} height={50} fill="#5a6466" /><rect x={10} y={730} width={460} height={40} rx={10} fill="#6b7a6a" />
            </g>
          ))}
          {p.noah && <g transform="translate(560 712) scale(0.55)"><NoahLying breath={(Math.sin(frame / 22) + 1) / 2} eye={light === 'dark' ? 0 : 1} /></g>}
          {/* lamp */}
          <rect x={940} y={700} width={60} height={160} fill="#3a3f40" />
          <path d="M 920 700 L 1020 700 L 1000 640 L 940 640 Z" fill="#2a3a30" />
          {light === 'lamp' && <Glow id="bkl" cx={970} cy={690} r={700} color={CON.lamp} opacity={0.5} />}
          {light === 'dark' && <rect width={W} height={H} fill="#000" opacity={0.88} />}
          {light === 'dark' && <Glow id="bkd" cx={760} cy={720} r={300} color={CON.cold} opacity={0.12} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- desk (command room) */
export const Desk: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const book = p.book ?? 'walter';
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 110, 0.7);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#1f2426" />
          <rect x={1250} y={160} width={520} height={360} fill="#2a3033" />
          <rect x={1280} y={190} width={460} height={300} fill="#384046" />
          <text x={1510} y={260} textAnchor="middle" fill="#c9a23a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={28}>COMMAND</text>
          {Array.from({length: 6}, (_, i) => <circle key={i} cx={1330 + i * 70} cy={380} r={18} fill={i === 2 ? '#7a3a2a' : '#4a4f50'} />)}
          <Glow id="dkl" cx={760} cy={620} r={760} color={CON.lamp} opacity={0.5} />
          <rect x={300} y={700} width={1100} height={34} fill="#5a5040" />
          <rect x={340} y={734} width={24} height={300} fill="#3a3428" /><rect x={1340} y={734} width={24} height={300} fill="#3a3428" />
          <rect x={980} y={540} width={50} height={160} fill="#3a3f40" /><path d="M 950 540 L 1070 540 L 1040 480 L 980 480 Z" fill="#2a3a30" />
          {book === 'box' && <g><rect x={600} y={620} width={240} height={90} fill="#5a6466" /><rect x={600} y={610} width={240} height={20} fill="#6b7577" /></g>}
          {book === 'report' && <g transform="rotate(-6 700 690)"><rect x={560} y={640} width={300} height={70} fill="#e8e2cc" />{Array.from({length: 4}, (_, i) => <line key={i} x1={580} y1={656 + i * 14} x2={820 - i * 30} y2={656 + i * 14} stroke="#5a5a5a" strokeWidth={3} />)}<text x={700} y={706} fill="#c0553f" fontFamily="DejaVu Sans Mono" fontSize={18}>FUEL 60d · H2O 90d</text></g>}
          {(book === 'walter' || book === 'noah') && <g transform="rotate(-4 700 690)">
            <rect x={540} y={640} width={360} height={70} fill={book === 'walter' ? '#e0d6b8' : '#e8e2cc'} />
            <line x1={720} y1={640} x2={720} y2={710} stroke="#8a7a5a" strokeWidth={3} />
            {Array.from({length: 4}, (_, i) => <line key={i} x1={560} y1={656 + i * 14} x2={700} y2={656 + i * 14} stroke="#3a3a6a" strokeWidth={2.5} />)}
            {Array.from({length: 4}, (_, i) => <line key={i} x1={740} y1={656 + i * 14} x2={880 - (frame % 60 > i * 15 ? 0 : 100)} y2={656 + i * 14} stroke="#3a3a6a" strokeWidth={2.5} />)}
          </g>}
          {p.noah && <g transform="translate(460 760) scale(1.0)"><NoahSitting outfit="out" phone={false} head={0.2} breath={(Math.sin(frame / 24) + 1) / 2} /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- Walter's journal page */
const PAGES: Record<string, {date: string; lines: string[]}> = {
  cover: {date: '', lines: []},
  p1: {date: 'Day 1 — Oct. 2, 1962', lines: ['The drill began at 0600. They sealed', 'the doors behind me. One hundred days', 'alone, to prove a man can survive', 'down here if the worst ever happens.', 'I volunteered. Margaret thinks', 'I am crazy.']},
  p2: {date: 'Day 19', lines: ['Lost track of whether it is day or', 'night. Slept badly. Heard footsteps', 'in the corridor again.', 'There was no one.', 'There is never anyone.']},
  p3: {date: 'Day 31', lines: ['Talked to the generator today.', 'I have named her Bertha.', 'If anyone ever reads this,', 'I am not ashamed.']},
  p4: {date: 'Day 60', lines: ['Opened the lower level today, as', 'instructed, to inspect the emergency', 'tunnel. Partially collapsed.', 'Engineers say it will not be needed.', 'Let us hope they are right.']},
  p5: {date: 'Day 99', lines: ['Tomorrow they open the doors.', 'I am afraid the world up there has', 'gone on without me. That nothing', 'waited. But I will go up anyway.', '', 'Tomorrow, I go up.']},
  back: {date: '', lines: ['', '', '', '', 'Day 100.', 'The sky is still there.']},
  final: {date: '', lines: ['Day 100.', 'The sky is still there.', '', '— W.H. 1963', '', 'Day 100. It still is.  — N.']},
};

export const Journal: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const pg = PAGES[p.page ?? 'p1'] ?? PAGES.p1;
  const seed = p.seed ?? 1;
  const reveal = (i: number) => interpolate(frame, [8 + i * 10, 20 + i * 10], [0, 1], clamp);
  const isCover = p.page === 'cover';
  const beamX = 960 + Math.sin(frame / 40 + seed) * 120;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0 + (seed - 1) * 0.06} to={1.08 + (seed - 1) * 0.06} origin="50% 50%">
        <Svg>
          <rect width={W} height={H} fill="#141210" />
          {isCover ? <g transform="translate(960 540) rotate(-3)">
            <rect x={-360} y={-440} width={720} height={880} rx={14} fill="#3a4a3a" />
            <rect x={-330} y={-410} width={660} height={820} rx={10} fill="none" stroke="#2a3a2a" strokeWidth={6} />
            <text x={0} y={-160} textAnchor="middle" fill="#d8cfa8" fontFamily="Liberation Serif" fontWeight={700} fontSize={54}>STATION LOG</text>
            <text x={0} y={-80} textAnchor="middle" fill="#d8cfa8" fontFamily="Liberation Serif" fontSize={36}>Civil Defense Shelter CD-7</text>
            <rect x={-200} y={20} width={400} height={4} fill="#d8cfa8" />
            <text x={0} y={110} textAnchor="middle" fill="#e8dfb8" fontFamily="Liberation Serif" fontStyle="italic" fontSize={44}>Officer Walter Hale</text>
            <text x={0} y={180} textAnchor="middle" fill="#d8cfa8" fontFamily="Liberation Serif" fontSize={40}>1962</text>
          </g> : <g transform="translate(960 560) rotate(-2)">
            <rect x={-600} y={-430} width={1200} height={860} fill="#e0d6b8" />
            <line x1={0} y1={-430} x2={0} y2={430} stroke="#b8ab88" strokeWidth={6} />
            {Array.from({length: 18}, (_, i) => <line key={i} x1={-580} y1={-360 + i * 46} x2={580} y2={-360 + i * 46} stroke="#c9bfa0" strokeWidth={2} />)}
            <text x={-560} y={-380} fill="#3a2a1a" fontFamily="Liberation Serif" fontStyle="italic" fontWeight={700} fontSize={38}>{pg.date}</text>
            {pg.lines.map((l, i) => {
              const col = p.page === 'final' && i >= 5 ? '#1a3a6a' : '#2a2a4a';
              const x = p.page === 'back' || p.page === 'final' ? 40 : -560;
              const y = p.page === 'back' || p.page === 'final' ? -300 + i * 92 : -300 + i * 92;
              return <text key={i} x={x} y={y} fill={col} opacity={reveal(i)} fontFamily="Liberation Serif" fontStyle="italic" fontSize={p.page === 'back' ? 46 : 42}>{l}</text>;
            })}
            {(p.page === 'p1' || p.page === 'p2' || p.page === 'p3') && Array.from({length: 7}, (_, i) => <line key={i} x1={40} y1={-300 + i * 92} x2={520 - (i * 47) % 200} y2={-300 + i * 92} stroke="#5a5a7a" strokeWidth={3} opacity={0.35} />)}
          </g>}
          <Flash cx={beamX} cy={540} r={760} dark={0.9} id="jnf" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- tally wall */
export const TallyWall: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const n = p.n ?? 1;
  const prevMap: Record<number, number> = {1: 0, 2: 1, 7: 2, 71: 60};
  const prev = p.reveal ? 0 : prevMap[n] ?? Math.max(0, n - 3);
  const marks: React.ReactNode[] = [];
  const per = 10; // groups per row
  for (let i = 0; i < n; i++) {
    const grp = Math.floor(i / 5), k = i % 5;
    const row = Math.floor(grp / per), col = grp % per;
    const x0 = 230 + col * 150, y0 = 230 + row * 150;
    const show = p.reveal ? interpolate(frame, [i * 0.9, i * 0.9 + 3], [0, 1], clamp) : i < prev ? 1 : interpolate(frame, [10 + (i - prev) * 8, 18 + (i - prev) * 8], [0, 1], clamp);
    marks.push(k === 4
      ? <line key={i} x1={x0 - 10} y1={y0 + 90} x2={x0 + 110} y2={y0 + 10} stroke="#d5d2c7" strokeWidth={6} strokeLinecap="round" strokeDasharray="150" strokeDashoffset={150 * (1 - show)} />
      : <line key={i} x1={x0 + k * 24} y1={y0} x2={x0 + k * 24 - 3} y2={y0 + 100} stroke="#d5d2c7" strokeWidth={6} strokeLinecap="round" strokeDasharray="110" strokeDashoffset={110 * (1 - show)} />);
  }
  const big = n > 25;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={big ? 1.0 : 1.6} to={big ? 1.06 : 1.5} origin={big ? '50% 50%' : '22% 25%'}>
        <Svg>
          <rect width={W} height={H} fill="#2c3133" />
          {Array.from({length: 40}, (_, i) => { const r = rng(i + 140); return <rect key={i} x={r() * W} y={r() * H} width={r() * 260} height={2} fill="#363b3c" />; })}
          <Glow id="twg" cx={500} cy={300} r={900} color={CON.lamp} opacity={0.2} />
          {marks}
        </Svg>
      </Camera>
      <div style={{position: 'absolute', right: 120, bottom: 120, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 90, letterSpacing: 10, color: C.amber,
        opacity: interpolate(frame, [20, 34], [0, 1], clamp), textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>DAY {n}</div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- watch face */
export const Watch: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const sub = p.drift ? ['06:12', '19:40', '03:05', '14:51', '23:17'][Math.floor(frame / 18) % 5] : p.sub ?? '';
  return (
    <AbsoluteFill style={{background: '#030405', justifyContent: 'center', alignItems: 'center'}}>
      <Svg>
        <Glow id="wtc" cx={960} cy={540} r={520} color="#7fd0a0" opacity={0.12} />
        <rect x={660} y={300} width={600} height={480} rx={90} fill="#15191b" stroke="#2a3033" strokeWidth={16} />
        <rect x={720} y={360} width={480} height={360} rx={40} fill="#1d2a24" />
      </Svg>
      <div style={{position: 'relative', textAlign: 'center', fontFamily: 'DejaVu Sans Mono, monospace', color: '#9ff0c0', textShadow: '0 0 30px rgba(127,208,160,0.6)'}}>
        <div style={{fontSize: 110, fontWeight: 700}}>{p.text}</div>
        <div style={{fontSize: 56, opacity: 0.8, marginTop: 10}}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- ventilation shaft */
export const VentShaft: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.15} origin="50% 45%">
        <Svg>
          <rect width={W} height={H} fill="#070809" />
          {Array.from({length: 14}, (_, i) => {
            const k = i / 14, s = lerp(1100, 70, Math.pow(k, 0.6));
            return <rect key={i} x={960 - s / 2} y={480 - s / 2} width={s} height={s} fill="none" stroke={i % 2 ? '#2a2f31' : '#202426'} strokeWidth={lerp(60, 4, k)} />;
          })}
          <rect x={925} y={445} width={70} height={70} fill="#9aa4a4" />
          <Glow id="vsg" cx={960} cy={480} r={260} color="#dfe8ec" opacity={0.35} />
          {Array.from({length: 5}, (_, i) => <line key={i} x1={925 + i * 17} y1={445} x2={925 + i * 17} y2={515} stroke="#2a2f31" strokeWidth={4} />)}
          {p.noah && [0, 1, 2].map((i) => { const k = ((frame / 30 + i / 3) % 1); return <rect key={i} x={960 - (1 - k) * 500} y={480 - (1 - k) * 500} width={(1 - k) * 1000} height={(1 - k) * 1000} fill="none" stroke="#d5d2c7" strokeWidth={3} opacity={k * 0.3} />; })}
          <Dust area={[600, 200, 720, 600]} count={50} opacity={0.4} color="#dfe8ec" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- blast door */
export const BlastDoor: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const open = p.open ? interpolate(frame, [10, dur - 10], [0, 1], clamp) : 0;
  const wheel = p.turning ? frame * 0.8 : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="50% 50%">
        <Svg>
          <rect width={W} height={H} fill="#22272a" />
          <rect x={0} y={880} width={W} height={200} fill="#1a1d1f" />
          <rect x={560} y={140} width={800} height={760} fill="#060708" />
          {open > 0 && <Glow id="bdg" cx={960} cy={520} r={500} color="#7a9aa0" opacity={0.15 * open} />}
          <g transform={`translate(${560 + open * 760} 0)`}>
            <rect x={0} y={140} width={800} height={760} fill="#6a6a5a" />
            {Array.from({length: 10}, (_, i) => <polygon key={i} points={`${i * 80},140 ${i * 80 + 40},140 ${i * 80 - 40},900 ${i * 80 - 80},900`} fill={i % 2 ? '#d5b23a' : '#1a1a1a'} opacity={0.55} />)}
            <rect x={60} y={200} width={680} height={640} fill="#5a5a4a" />
            <g transform={`translate(400 520) rotate(${wheel})`}>
              <circle r={150} fill="none" stroke="#3a3f40" strokeWidth={26} />
              {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * Math.PI / 2) * 150} y2={Math.sin(i * Math.PI / 2) * 150} stroke="#3a3f40" strokeWidth={20} />)}
              <circle r={30} fill="#2a2f31" />
            </g>
            <rect x={160} y={260} width={480} height={90} fill="#c0553f" />
            <text x={400} y={318} textAnchor="middle" fill="#fff" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={40}>LEVEL 2</text>
            <text x={400} y={760} textAnchor="middle" fill="#1a1a1a" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={26}>AUTHORIZED PERSONNEL ONLY</text>
          </g>
          {p.noah && <g transform="translate(1500 920) scale(0.85)"><g transform="scale(-1 1)"><NoahWalk phase={Math.sin(frame / 8) * 0.4} outfit="out" /></g></g>}
          <Flash cx={960 + Math.sin(frame / 30) * 100} cy={520} r={620} dark={0.9} id="bdf" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- blueprint */
export const Blueprint: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const draw = p.route ? interpolate(frame, [10, dur - 15], [0, 1], clamp) : 0;
  const ln = '#cfe6f2';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.route && p.seed === 2 ? 1.2 : 1.0} to={p.route && p.seed === 2 ? 1.4 : 1.12} origin={p.route && p.seed === 2 ? '75% 70%' : '50% 50%'}>
        <Svg>
          <rect width={W} height={H} fill="#16324a" />
          {Array.from({length: 40}, (_, i) => <line key={i} x1={0} y1={i * 30} x2={W} y2={i * 30} stroke="#1f4060" strokeWidth={1} />)}
          {Array.from({length: 66}, (_, i) => <line key={i} x1={i * 30} y1={0} x2={i * 30} y2={H} stroke="#1f4060" strokeWidth={1} />)}
          <text x={120} y={130} fill={ln} fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={36}>CIVIL DEFENSE SHELTER CD-7 · 1961 · SHEET 2/4</text>
          {/* surface line + mountain */}
          <path d="M 80 300 L 600 300 C 800 200 1100 160 1300 260 C 1500 340 1700 380 1860 380" stroke={ln} strokeWidth={3} fill="none" strokeDasharray="14 10" />
          <text x={120} y={285} fill={ln} fontFamily="DejaVu Sans Mono" fontSize={22}>SURFACE</text>
          {/* stairs */}
          <path d="M 520 300 L 520 600" stroke={ln} strokeWidth={6} /><text x={540} y={460} fill={ln} fontFamily="DejaVu Sans Mono" fontSize={22}>STAIRS · 92</text>
          {/* rooms */}
          {[['CMD', 420, 600], ['SUPPLY', 640, 600], ['BUNKS', 860, 600], ['WATER', 1080, 600], ['GEN', 1300, 600]].map(([n, x, y]) => (
            <g key={n as string}><rect x={x as number} y={y as number} width={200} height={130} fill="none" stroke={ln} strokeWidth={4} /><text x={(x as number) + 100} y={(y as number) + 74} textAnchor="middle" fill={ln} fontFamily="DejaVu Sans Mono" fontSize={24}>{n}</text></g>
          ))}
          <path d="M 420 665 L 1500 665" stroke={ln} strokeWidth={2} strokeDasharray="6 6" />
          <rect x={1300} y={770} width={200} height={110} fill="none" stroke={ln} strokeWidth={4} />
          <text x={1400} y={835} textAnchor="middle" fill={ln} fontFamily="DejaVu Sans Mono" fontSize={22}>LEVEL 2</text>
          {/* emergency tunnel */}
          <path d="M 1500 830 L 1640 830 C 1720 830 1760 700 1800 560 L 1840 400" stroke="#ff6a50" strokeWidth={10} fill="none" strokeDasharray="900" strokeDashoffset={900 * (1 - draw)} strokeLinecap="round" />
          {draw > 0.6 && <text x={1560} y={900} fill="#ff8a70" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={26}>EMERGENCY EXIT · 140 m</text>}
          {draw > 0.95 && <circle cx={1840} cy={400} r={14} fill="#ff6a50" />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- tunnel dig */
export const Tunnel: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const prog = p.progress ?? 0;
  const dark = !!p.dark;
  const dig = Math.sin(frame / 5);
  const cave = p.cavein ? interpolate(frame, [dur * 0.3, dur * 0.45], [0, 1], clamp) : 0;
  const [sx, sy] = useShake(p.cavein ? (frame > dur * 0.3 && frame < dur * 0.55 ? 0.8 : 0) : 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sx}px, ${sy}px)`}}>
        <Camera dur={dur} from={1.0} to={1.06}>
          <Svg>
            <rect width={W} height={H} fill="#2a2420" />
            {Array.from({length: 120}, (_, i) => { const r = rng(i * 5 + 3); return <ellipse key={i} cx={r() * W} cy={r() * H} rx={6 + r() * 30} ry={4 + r() * 20} fill={['#3a3028', '#241e1a', '#4a3e34'][i % 3]} />; })}
            {/* tunnel cross section (side view) */}
            <rect x={0} y={420} width={W} height={340} fill="#15110e" />
            {Array.from({length: 9}, (_, i) => <g key={i}><rect x={80 + i * 220} y={420} width={24} height={340} fill="#6b4a35" /><rect x={60 + i * 220} y={410} width={180} height={22} fill="#7a5a40" /></g>)}
            <rect x={0} y={740} width={W} height={20} fill="#3a3028" />
            {/* dirt face on the right */}
            <path d={`M 1700 420 C 1660 500 1690 620 1650 760 L 1920 760 L 1920 420 Z`} fill="#3a3028" />
            {p.blocked && <path d="M 1300 420 C 1200 500 1260 640 1180 760 L 1920 760 L 1920 420 Z" fill="#4a3e34" />}
            {/* Noah digging */}
            {p.noah !== false && (p.noah || !p.blocked) && p.progress > 0 && <g transform="translate(1440 760) scale(0.62)">
              <NoahWalk phase={0.4 + dig * 0.2} outfit="out" />
              <g transform={`translate(60 -330) rotate(${-40 + dig * 30})`}><line x1={0} y1={0} x2={240} y2={0} stroke="#6b4a35" strokeWidth={14} /><rect x={230} y={-30} width={60} height={60} fill="#7d8a8a" /></g>
            </g>}
            {cave > 0 && Array.from({length: 30}, (_, i) => { const r = rng(i + 9); const x = 400 + r() * 700, y = Math.min(420 + r() * 300 + cave * 300, 740); return <circle key={i} cx={x} cy={y} r={14 + r() * 30} fill="#4a3e34" />; })}
            {dig > 0.9 && <circle cx={1680} cy={560} r={30} fill="#6a5a4a" opacity={0.5} />}
            <Flash cx={1500} cy={590} r={dark ? 380 : 700} dark={dark ? 0.985 : 0.88} id="tnf" />
          </Svg>
        </Camera>
      </div>
      {/* progress meter */}
      <div style={{position: 'absolute', left: 120, bottom: 110, width: 600, fontFamily: 'DejaVu Sans Mono', color: '#d5d2c7', fontSize: 30, textShadow: '0 2px 10px #000'}}>
        <div>{Math.round(prog * 140)} m / 140 m</div>
        <div style={{height: 10, background: '#333', marginTop: 10}}><div style={{width: `${prog * 100}%`, height: 10, background: C.amber}} /></div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- breakthrough */
export const Breakthrough: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'crack';
  const w = phase === 'crack' ? interpolate(frame, [dur * 0.6, dur], [0, 10], clamp) : phase === 'beam' ? 18 + frame * 0.1 : interpolate(frame, [0, dur], [30, 320], clamp);
  const bright = phase === 'open' ? interpolate(frame, [0, dur], [0.3, 1], clamp) : 0.3;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <rect width={W} height={H} fill="#0a0806" />
        {w > 0 && <>
          <polygon points={`${960 - w},0 ${960 + w},0 ${960 + w * 6},${H} ${960 - w * 6},${H}`} fill="#ffe2a8" opacity={0.35 * (0.6 + bright)} />
          <Glow id="btg" cx={960} cy={60} r={200 + w * 4} color="#ffe2a8" opacity={0.8} />
          <rect x={960 - w} y={0} width={w * 2} height={70} fill="#fff6e0" />
          <Dust area={[960 - w * 4, 0, w * 8, H]} count={80} opacity={0.9} color="#ffe2a8" />
          <ellipse cx={960} cy={H - 100} rx={w * 7} ry={w} fill="#ffe2a8" opacity={0.25} />
        </>}
        {phase === 'open' && <g transform="translate(960 1180) scale(1.2)"><NoahStandBack /></g>}
        {phase === 'open' && <rect width={W} height={H} fill="#fff6e0" opacity={interpolate(frame, [dur - 20, dur], [0, 0.9], clamp)} />}
      </Svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- forest at dawn */
export const SurfaceDawn: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 120, 0.6);
  const flashIn = p.emerge ? interpolate(frame, [0, 20], [1, 0], clamp) : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="sd" stops={SKY.dawn} />
          <Glow id="sdg" cx={1300} cy={560} r={1000} color="#ffd59a" opacity={0.7} />
          <circle cx={1300} cy={lerp(600, 560, pr)} r={70} fill="#fff6e0" />
          <Rays cx={1300} cy={580} count={22} opacity={0.12} spin={1} />
          {Array.from({length: 30}, (_, i) => { const r = rng(i + seed * 3); const x = r() * W, h = 300 + r() * 500, y = 760 + r() * 60; return <polygon key={i} points={`${x},${y - h} ${x - 50},${y} ${x + 50},${y}`} fill={i % 3 ? '#2c4a3a' : '#3a5a46'} opacity={0.8} />; })}
          <Fog id="sdf" y={560} h={300} opacity={0.5} color="#f1d2a8" />
          {Array.from({length: 16}, (_, i) => { const r = rng(i + 40 + seed); const x = r() * W, h = 500 + r() * 400, y = 900 + r() * 80; return <g key={i}><rect x={x - 18} y={y - h * 0.5} width={36} height={h * 0.5} fill="#1a1410" /><polygon points={`${x},${y - h} ${x - 110},${y - h * 0.35} ${x + 110},${y - h * 0.35}`} fill="#14261c" /></g>; })}
          <rect x={0} y={900} width={W} height={180} fill="#1f3326" />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 330 + 60} y={600} width={14} height={300} fill="#ffe2a8" opacity={0.08} />)}
          {/* hole in the ground */}
          <ellipse cx={760} cy={930} rx={90} ry={22} fill="#0a0806" />
          {p.emerge && <g transform={`translate(760 ${lerp(1100, 930, Math.min(1, frame / (dur * 0.6)))}) scale(0.5)`}><NoahStandBack /></g>}
          {p.lying && <g transform="translate(900 960) scale(0.6)"><NoahLying eye={1} lift={0} breath={(Math.sin(frame / 20) + 1) / 2} /></g>}
          {!p.emerge && !p.lying && <g transform="translate(1000 930) scale(0.5)"><NoahStandBack /></g>}
          <Birds x={300} y={300} count={12} vx={1.4} vy={-0.2} seed={seed + 5} />
        </Svg>
      </Camera>
      {flashIn > 0 && <AbsoluteFill style={{background: '#fff6e0', opacity: flashIn}} />}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- rescue on the logging road */
export const Rescue: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 130, 0.6);
  const blink = Math.floor(frame / 8) % 2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="rs" stops={SKY.day} />
          <Glow id="rsg" cx={1500} cy={300} r={900} color="#fff1d6" opacity={0.4} />
          {Array.from({length: 24}, (_, i) => { const r = rng(i + 60); const x = r() * W, h = 300 + r() * 300, y = 720; return <polygon key={i} points={`${x},${y - h} ${x - 60},${y} ${x + 60},${y}`} fill="#3a5a46" />; })}
          <rect x={0} y={720} width={W} height={360} fill="#6a6250" />
          <rect x={0} y={860} width={W} height={220} fill="#4a5a3a" />
          {/* forestry pickup */}
          <g transform="translate(1300 800)">
            <path d="M -260 0 L -260 -110 L -60 -110 L -20 -190 L 140 -190 L 200 -110 L 260 -100 L 260 0 Z" fill="#c9b04a" />
            <rect x={-30} y={-180} width={150} height={60} fill="#8ab0c0" opacity={0.7} />
            <circle cx={-170} cy={0} r={42} fill="#1a1a1a" /><circle cx={170} cy={0} r={42} fill="#1a1a1a" />
            <rect x={20} y={-206} width={80} height={16} fill={blink ? '#ffb340' : '#7a5020'} />
            {blink === 1 && <Glow id="rsl" cx={60} cy={-198} r={140} color="#ffb340" opacity={0.6} />}
            <text x={-160} y={-50} fill="#2a3a20" fontFamily="DejaVu Sans Mono" fontWeight={700} fontSize={26}>FORESTRY</text>
          </g>
          {/* Noah sitting wrapped in a blanket */}
          <g transform="translate(760 830) scale(1.05)"><NoahSitting outfit="out" phone={false} head={0.9} breath={(Math.sin(frame / 22) + 1) / 2} /></g>
          {/* worker */}
          <g transform="translate(1020 850) scale(0.95)"><g transform="scale(-1 1)"><NoahWalk phase={0} outfit="home" rim="#ffb340" /></g></g>
          {/* hi-vis vest + hard hat so the worker never reads as Noah */}
          <rect x={968} y={494} width={92} height={172} rx={10} fill="#e8a030" />
          <rect x={968} y={560} width={92} height={10} fill="#e8eef0" /><rect x={968} y={610} width={92} height={10} fill="#e8eef0" />
          <path d="M 950 404 C 952 360 1040 356 1044 404 Z" fill="#f2d03a" /><rect x={940} y={398} width={112} height={12} rx={6} fill="#e0bc2a" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- phone call from hospital */
export const PhoneCall: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const sec = Math.floor(frame / 30);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1}>
        <Svg>
          <rect width={W} height={H} fill="#cfdad8" />
          <rect x={1200} y={140} width={560} height={480} fill="#e9f0ee" />
          <Glow id="pcg" cx={1480} cy={380} r={700} color="#fff6e0" opacity={0.4} />
          <rect x={1196} y={136} width={568} height={488} fill="none" stroke="#9fb4b0" strokeWidth={14} />
          <rect x={0} y={760} width={W} height={320} fill="#b3c3c0" />
          <rect x={200} y={640} width={900} height={140} rx={20} fill="#eef3f2" /><rect x={200} y={740} width={900} height={60} fill="#7d8f8f" />
          <g transform="translate(960 560) rotate(-6)">
            <rect x={-170} y={-300} width={340} height={600} rx={40} fill="#07090b" />
            <rect x={-156} y={-286} width={312} height={572} rx={30} fill="#16232c" />
            <text x={0} y={-160} textAnchor="middle" fill="#e9eef1" fontFamily="Inter" fontWeight={600} fontSize={44}>Sis</text>
            <text x={0} y={-110} textAnchor="middle" fill="#7fd0a0" fontFamily="Inter" fontSize={28}>{`0:${String(sec).padStart(2, '0')}`}</text>
            <circle cx={0} cy={20} r={80} fill="#b0675a" opacity={0.85} />
            {[0, 1].map((i) => { const k = ((frame / 30 + i / 2) % 1); return <circle key={i} cx={0} cy={20} r={80 + k * 70} fill="none" stroke="#7fd0a0" strokeWidth={3} opacity={1 - k} />; })}
            <circle cx={0} cy={210} r={44} fill="#c0553f" />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
