import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Camera, clamp, Dust, Glow, H, lerp, rng, Skyline, Svg, useProgress, W} from '../lib';
import {ChairWithGear, NoahLying, NoahSitting, NoahWalk} from '../noah';
import {camFor, SetProps} from './common';

const night = (p: any) => p.time === 'night';

/* -------------------------------------------------------------- bedroom */
const Room: React.FC<{dark?: boolean}> = ({dark}) => {
  const frame = useCurrentFrame();
  const flick = 0.92 + 0.08 * Math.sin(frame / 20);
  const light = dark ? 0 : 1;
  return (
    <>
      <rect x={0} y={0} width={W} height={H} fill={dark ? '#0a1015' : '#141d23'} />
      <rect x={0} y={820} width={W} height={260} fill={dark ? '#0e0c0a' : '#1d1813'} />
      <rect x={1340} y={170} width={420} height={420} fill={dark ? '#18242e' : '#e7b073'} />
      {dark && <circle cx={1650} cy={260} r={20} fill="#dfe8ec" opacity={0.8} />}
      {!dark && <Glow id="bw" cx={1550} cy={380} r={520} color={C.gold} opacity={0.45} />}
      {Array.from({length: 13}, (_, i) => <rect key={i} x={1340} y={176 + i * 32} width={420} height={18} fill="#2a2620" opacity={0.92} />)}
      <rect x={1330} y={160} width={440} height={440} fill="none" stroke="#0f1418" strokeWidth={20} />
      {!dark && <g style={{mixBlendMode: 'screen'}} opacity={0.55 * flick}>
        {Array.from({length: 9}, (_, i) => (
          <polygon key={i} points={`${1340},${190 + i * 32} ${1340},${204 + i * 32} ${380},${620 + i * 46} ${380},${596 + i * 46}`} fill={C.amber} opacity={0.35} />
        ))}
      </g>}
      <rect x={260} y={250} width={300} height={14} fill="#2a2420" />
      <rect x={280} y={190} width={40} height={60} fill="#33302b" /><rect x={330} y={200} width={30} height={50} fill="#3d3a34" />
      <path d="M 470 250 C 450 200 470 170 500 190 C 520 160 550 190 530 220 C 560 220 560 250 530 250 Z" fill="#22382f" />
      <rect x={660} y={200} width={220} height={150} fill="#1b2328" stroke="#2b241e" strokeWidth={10} />
      <Skyline seed={5} baseY={340} minH={20} maxH={110} color="#2c3a40" minW={10} maxW={30} x0={666} x1={874} />
      {light > 0 && <Dust area={[600, 250, 900, 600]} count={70} opacity={0.65} />}
    </>
  );
};

export const Bedroom: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const dark = night(p);
  const breath = (Math.sin(frame / 22) + 1) / 2;
  if (p.noah === 'lying') {
    const wake = p.wake ? interpolate(frame, [dur - 60, dur - 20], [0, 1], clamp) : 0;
    return (
      <AbsoluteFill>
        <Camera dur={dur} from={1.08} to={1.0} origin="45% 60%">
          <Svg>
            <Room dark={dark} />
            <rect x={340} y={640} width={980} height={120} rx={18} fill="#2b3a42" />
            <rect x={320} y={500} width={40} height={300} rx={8} fill="#2a2018" />
            <rect x={340} y={740} width={980} height={60} fill="#1c252b" />
            <ellipse cx={470} cy={624} rx={120} ry={40} fill="#c9c3b6" />
            <g transform="translate(500 600)"><NoahLying breath={breath} lift={wake * 0.6} eye={wake} /></g>
            <rect x={170} y={640} width={140} height={180} fill="#2e2219" />
            <rect x={200} y={626} width={70} height={14} rx={4} fill="#0b0f12" />
            <g transform="translate(1480 668)"><ChairWithGear /></g>
            {!dark && <g style={{mixBlendMode: 'screen'}} opacity={0.35}>
              {Array.from({length: 5}, (_, i) => <polygon key={i} points={`${700 + i * 120},640 ${760 + i * 120},640 ${700 + i * 120},760 ${640 + i * 120},760`} fill={C.amber} />)}
            </g>}
          </Svg>
        </Camera>
      </AbsoluteFill>
    );
  }
  const look = interpolate(frame, [dur - 50, dur - 25], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1} origin="46% 55%">
        <Svg>
          <Room dark={dark} />
          <rect x={300} y={700} width={900} height={110} rx={16} fill="#2b3a42" />
          <rect x={300} y={790} width={900} height={50} fill="#1c252b" />
          <ellipse cx={420} cy={690} rx={110} ry={34} fill="#c9c3b6" />
          <g transform="translate(1480 668)"><ChairWithGear /></g>
          <g transform="translate(800 700) scale(1.35)"><NoahSitting breath={breath} head={look} /></g>
          <Glow id="ph" cx={1000} cy={530} r={dark ? 380 : 260} color="#bfe0ff" opacity={dark ? 0.4 : 0.28} />
          {p.call && <g transform="translate(1180 280)" opacity={interpolate(frame, [10, 22], [0, 1], clamp)}>
            <rect x={0} y={0} width={360} height={110} rx={26} fill="#16232c" opacity={0.92} />
            <circle cx={54} cy={55} r={28} fill={frame >= 70 ? '#c0553f' : '#4f8f6a'} />
            <text x={100} y={50} fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={28}>{frame < 70 ? 'Calling Sis…' : 'Call failed'}</text>
            <text x={100} y={84} fill="#93a3ab" fontFamily="Inter" fontSize={22}>{frame < 70 ? 'mobile' : 'No connection'}</text>
          </g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------- kitchen table */
export const TableSit: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const day = p.time === 'day';
  const seed = p.seed ?? 1;
  const cam = camFor(seed, 0.8);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill={day ? '#1a2328' : '#0b1014'} />
          <rect x={1250} y={160} width={420} height={460} fill={day ? '#cfd6d0' : '#111c24'} />
          {day ? <Glow id="tw" cx={1460} cy={390} r={700} color="#f2f0e4" opacity={0.25} /> : <Skyline seed={8} baseY={620} minH={60} maxH={300} color="#070b0e" minW={30} maxW={80} x0={1250} x1={1670} />}
          <rect x={1240} y={150} width={440} height={480} fill="none" stroke="#0a0e11" strokeWidth={18} />
          {/* hanging lamp */}
          {!day && <><line x1={820} y1={0} x2={820} y2={330} stroke="#111" strokeWidth={4} />
            <path d="M 740 380 L 900 380 L 860 320 L 780 320 Z" fill="#2a2a26" />
            <Glow id="lamp" cx={820} cy={560} r={620} color="#f2b66d" opacity={0.5} />
            <polygon points="760,380 880,380 1180,1080 460,1080" fill="#f2b66d" opacity={0.06} /></>}
          <rect x={0} y={880} width={W} height={200} fill={day ? '#211b15' : '#120e0b'} />
          {/* table */}
          <rect x={540} y={700} width={640} height={26} fill="#4a3322" />
          <rect x={580} y={726} width={22} height={240} fill="#2e2016" /><rect x={1120} y={726} width={22} height={240} fill="#2e2016" />
          <ellipse cx={980} cy={696} rx={60} ry={10} fill="#d5d2c7" />
          <rect x={1060} y={650} width={34} height={48} fill="#c9b79c" />
          <g transform="translate(560 770) scale(1.2)"><NoahSitting breath={(Math.sin(frame / 24) + 1) / 2} head={0.3} phone={!!p.phone} /></g>
          {p.phone && <Glow id="tsp" cx={760} cy={620} r={200} color="#bfe0ff" opacity={0.3} />}
          {p.phone && <g transform="translate(1260 700)">
            <rect x={0} y={0} width={360} height={90} rx={24} fill="#16232c" opacity={0.92} />
            <circle cx={46} cy={45} r={14} fill="#c0553f" opacity={0.5 + 0.5 * Math.sin(frame / 6)} />
            <text x={80} y={56} fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={26}>Recording…</text>
            {Array.from({length: 18}, (_, i) => <rect key={i} x={240 + i * 6} y={45 - (4 + Math.abs(Math.sin(frame / 3 + i)) * 18) / 2} width={3} height={4 + Math.abs(Math.sin(frame / 3 + i)) * 18} fill="#78969A" />)}
          </g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- phone */
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

const Post: React.FC<{y: number; who: string; txt: string; col: string; time: string}> = ({y, who, txt, col, time}) => (
  <g>
    <rect x={-210} y={y} width={420} height={150} rx={18} fill="#1c2630" />
    <circle cx={-170} cy={y + 34} r={20} fill={col} />
    <text x={-140} y={y + 30} fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={20}>{who}</text>
    <text x={-140} y={y + 52} fill="#6f8189" fontFamily="Inter" fontSize={16}>{time}</text>
    <rect x={-190} y={y + 66} width={380} height={66} rx={10} fill={col} opacity={0.35} />
    <text x={-176} y={y + 106} fill="#d5d2c7" fontFamily="Inter" fontSize={18}>{txt}</text>
  </g>
);

export const Phone: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [p.screen === 'lock' ? 26 : 0, p.screen === 'lock' ? 34 : 6], [0, 1], clamp);
  const dark = !!p.night;
  const scr = p.screen ?? 'lock';
  const scroll = scr === 'social' ? interpolate(frame, [0, dur], [0, p.end ? 380 : 260], clamp) : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={p.zoom ? 1.3 : 1.12} origin="50% 52%">
        <Svg>
          <rect width={W} height={H} fill={dark ? '#05080a' : '#110c09'} />
          {!dark && <Glow id="pw" cx={1700} cy={200} r={900} color={C.amber} opacity={0.35} />}
          <path d={`M 0 520 L ${W} 470 L ${W} ${H} L 0 ${H} Z`} fill={dark ? '#1a120c' : '#4a3020'} />
          {Array.from({length: 7}, (_, i) => <path key={i} d={`M 0 ${560 + i * 80} L ${W} ${510 + i * 82}`} stroke={dark ? '#120c08' : '#3c2618'} strokeWidth={3} opacity={0.6} />)}
          {!dark && <g style={{mixBlendMode: 'screen'}} opacity={0.4}>
            {Array.from({length: 6}, (_, i) => <polygon key={i} points={`${1100 + i * 140},470 ${1180 + i * 140},470 ${700 + i * 160},${H} ${560 + i * 160},${H}`} fill={C.amber} opacity={0.5} />)}
          </g>}
          <rect x={250} y={250} width={30} height={260} fill="#2e2a24" />
          <path d="M 120 260 C 140 160 390 160 410 260 Z" fill="#25352f" />
          <g transform="translate(960 640) rotate(-8)">
            <ellipse cx={0} cy={-30} rx={420} ry={300} fill="#9ed1ff" opacity={on * (dark ? 0.12 : 0.06)} />
            <g transform="scale(1 0.62)">
              <rect x={-250} y={-330} width={500} height={760} rx={56} fill="#07090b" />
              <rect x={-232} y={-312} width={464} height={724} rx={44} fill="#0d141a" />
              <defs><clipPath id="scr"><rect x={-232} y={-312} width={464} height={724} rx={44} /></clipPath></defs>
              <g opacity={on} clipPath="url(#scr)">
                <rect x={-232} y={-312} width={464} height={724} fill="#16232c" />
                {scr === 'lock' && <>
                  <text x={0} y={-150} textAnchor="middle" fill="#e9eef1" fontFamily="Inter Display" fontWeight={300} fontSize={130}>8:17</text>
                  <text x={0} y={-96} textAnchor="middle" fill="#9fb1b8" fontFamily="Inter" fontSize={28}>Tuesday</text>
                  <text x={0} y={-30} textAnchor="middle" fill="#6f8189" fontFamily="Inter" fontSize={24}>No new notifications</text>
                  <Toast at={62} y={10} title="Call failed" sub="Sis · No connection" icon="#c0553f" />
                  <Toast at={102} y={124} title="No service" sub="Network unavailable" icon="#78969A" />
                </>}
                {scr === 'msg' && <>
                  <rect x={-232} y={-312} width={464} height={90} fill="#1c2a34" />
                  <circle cx={-170} cy={-266} r={26} fill="#b0675a" />
                  <text x={-130} y={-258} fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={28}>Sis</text>
                  <rect x={-200} y={-170} width={300} height={70} rx={24} fill="#2c3a44" />
                  <text x={-180} y={-126} fill="#d5d2c7" fontFamily="Inter" fontSize={22}>you home this weekend?</text>
                  <rect x={-40} y={-80} width={250} height={60} rx={24} fill="#3e6a6f" />
                  <text x={-20} y={-42} fill="#eef3f3" fontFamily="Inter" fontSize={22}>yeah, why?</text>
                  <rect x={-200} y={0} width={360} height={100} rx={24} fill="#2c3a44" />
                  <text x={-180} y={40} fill="#d5d2c7" fontFamily="Inter" fontSize={22}>Call me tomorrow, okay?</text>
                  <text x={-180} y={74} fill="#d5d2c7" fontFamily="Inter" fontSize={22}>I have news :)</text>
                  <text x={-190} y={124} fill="#6f8189" fontFamily="Inter" fontSize={16}>11:40 PM</text>
                  <text x={0} y={330} textAnchor="middle" fill="#6f8189" fontFamily="Inter" fontSize={18}>Message not delivered</text>
                </>}
                {scr === 'calls' && <>
                  <text x={0} y={-200} textAnchor="middle" fill="#e9eef1" fontFamily="Inter" fontWeight={600} fontSize={40}>Sis</text>
                  <text x={0} y={-150} textAnchor="middle" fill={frame > 45 ? '#c0553f' : '#9fb1b8'} fontFamily="Inter" fontSize={26}>{frame > 45 ? 'Call failed' : 'Calling…'}</text>
                  <circle cx={0} cy={-20} r={70} fill="#b0675a" opacity={0.8} />
                  {frame <= 45 && [0, 1].map((i) => { const k = ((frame / 30 + i / 2) % 1); return <circle key={i} cx={0} cy={-20} r={70 + k * 80} fill="none" stroke="#b0675a" strokeWidth={3} opacity={1 - k} />; })}
                  <circle cx={0} cy={250} r={46} fill="#c0553f" />
                  {['Mom', 'Dad', 'Work', '911'].map((n, i) => <text key={n} x={-180 + i * 120} y={150} fill="#6f8189" fontFamily="Inter" fontSize={20}>{n} ✕</text>)}
                </>}
                {scr === 'social' && <g transform={`translate(0 ${-scroll})`}>
                  <Post y={-280} who="dani.k" time="11:58 PM" txt="best pasta in town 🍝" col="#d58b49" />
                  <Post y={-110} who="marco_v" time="11:21 PM" txt="when the dog chases its own tail" col="#78969A" />
                  <Post y={60} who="lena.p" time="10:47 PM" txt="can't sleep. anyone up?" col="#263C40" />
                  <Post y={230} who="theo" time="10:02 PM" txt="tomorrow is a big day" col="#6b3b35" />
                  {p.end && <text x={0} y={440} textAnchor="middle" fill="#93a3ab" fontFamily="Inter" fontSize={22}>No new posts since 8:17 AM</text>}
                </g>}
                {scr === 'memo' && <>
                  <text x={0} y={-220} textAnchor="middle" fill="#e9eef1" fontFamily="Inter" fontWeight={600} fontSize={34}>Voice Memos</text>
                  {['Day 1', 'Day 2', 'Day 3', 'Day 5', 'Day 7'].map((d, i) => (
                    <g key={d}><rect x={-200} y={-170 + i * 80} width={400} height={64} rx={14} fill="#1c2a34" />
                      <text x={-180} y={-130 + i * 80} fill="#d5d2c7" fontFamily="Inter" fontSize={22}>{d}</text>
                      <text x={170} y={-130 + i * 80} textAnchor="end" fill="#6f8189" fontFamily="Inter" fontSize={18}>{['0:48', '1:12', '2:03', '0:31', '1:40'][i]}</text></g>
                  ))}
                  <circle cx={0} cy={300} r={42} fill="#c0553f" opacity={0.7 + 0.3 * Math.sin(frame / 6)} />
                </>}
              </g>
            </g>
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- stairs */
export const Stairs: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.05} y={[0, 40]}>
        <Svg>
          <rect width={W} height={H} fill="#151d22" />
          <Glow id="sg" cx={1500} cy={150} r={700} color="#d5d2c7" opacity={0.18} />
          {Array.from({length: 14}, (_, i) => (
            <g key={i}>
              <rect x={300 + i * 90} y={900 - i * 60} width={900} height={62} fill={i % 2 ? '#222c31' : '#263137'} />
              <rect x={300 + i * 90} y={900 - i * 60} width={900} height={6} fill="#3a464b" />
            </g>
          ))}
          <path d="M 260 860 L 1520 20" stroke="#0c1114" strokeWidth={12} />
          {Array.from({length: 14}, (_, i) => <line key={i} x1={300 + i * 90} y1={860 - i * 60} x2={300 + i * 90} y2={900 - i * 60} stroke="#0c1114" strokeWidth={6} />)}
          <rect x={60} y={120} width={140} height={90} fill="#263C40" />
          <text x={130} y={186} textAnchor="middle" fill={C.mist} fontFamily="Inter" fontWeight={800} fontSize={64}>{Math.max(1, 9 - Math.floor(frame / (dur / 8)))}</text>
          <g transform={`translate(${lerp(1300, 600, frame / dur)} ${lerp(300, 820, frame / dur)}) scale(0.8)`}><g transform="scale(-1 1)"><NoahWalk phase={frame / 4.5} outfit="out" /></g></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ TV */
export const TV: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const st = p.state ?? 'on';
  const r = rng(frame);
  const flicker = st === 'static' ? 0.6 + r() * 0.4 : 0.9 + 0.1 * Math.sin(frame / 3);
  const glowCol = st === 'broadcast' ? '#c0553f' : '#bcd4e6';
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="62% 45%">
        <Svg>
          <rect width={W} height={H} fill="#06090b" />
          <Glow id="tvg" cx={1200} cy={460} r={900} color={glowCol} opacity={0.22 * flicker} />
          <rect x={0} y={760} width={W} height={320} fill="#0b0d0f" />
          <rect x={880} y={720} width={640} height={50} fill="#151719" />
          <rect x={900} y={240} width={600} height={360} rx={10} fill="#020304" />
          <g>
            <defs><clipPath id="tvc"><rect x={920} y={260} width={560} height={320} /></clipPath></defs>
            <g clipPath="url(#tvc)">
              {st === 'on' && <rect x={920} y={260} width={560} height={320} fill="#203038" opacity={interpolate(frame, [0, 8], [0, 1], clamp)} />}
              {st === 'broadcast' && <>
                <rect x={920} y={260} width={560} height={320} fill="#1b2a33" />
                <rect x={920} y={260} width={560} height={70} fill="#a33a2c" />
                <text x={1200} y={308} textAnchor="middle" fill="#fff" fontFamily="Inter" fontWeight={800} fontSize={34}>EMERGENCY ALERT</text>
                <text x={1200} y={400} textAnchor="middle" fill="#e8edf0" fontFamily="Inter" fontWeight={600} fontSize={28}>THIS IS NOT A TEST</text>
                <text x={1200} y={450} textAnchor="middle" fill="#c9d4d8" fontFamily="Inter" fontSize={22}>REMAIN INDOORS. AWAIT FURTHER</text>
                <text x={1200} y={482} textAnchor="middle" fill="#c9d4d8" fontFamily="Inter" fontSize={22}>INSTRUCTIONS FROM LOCAL AUTHOR—</text>
                <rect x={920} y={540} width={560} height={40} fill="#0e161b" />
                <text x={1480 - ((frame * 4) % 1200)} y={568} fill="#f2b66d" fontFamily="Inter" fontSize={20}>BROADCAST INTERRUPTED · 08:17 · SIGNAL LOST · BROADCAST INTERRUPTED</text>
                {frame % 40 < 3 && <rect x={920} y={260 + (frame * 37) % 300} width={560} height={14} fill="#fff" opacity={0.3} />}
              </>}
              {st === 'static' && Array.from({length: 900}, (_, i) => <rect key={i} x={920 + r() * 560} y={260 + r() * 320} width={2 + r() * 8} height={2 + r() * 3} fill={r() > 0.5 ? '#e6eef2' : '#5a6468'} />)}
            </g>
          </g>
          <rect x={900} y={240} width={600} height={360} rx={10} fill="none" stroke="#1a1d20" strokeWidth={16} />
          {/* Noah on the sofa, silhouette */}
          <g transform="translate(560 900)">
            <path d="M -260 0 L -260 -170 C -260 -200 -240 -210 -210 -210 L 210 -210 C 240 -210 260 -200 260 -170 L 260 0 Z" fill="#101315" />
            <ellipse cx={20} cy={-330} rx={56} ry={62} fill="#0c0f11" />
            <path d="M -60 -210 C -60 -260 -20 -280 20 -280 C 60 -280 100 -260 100 -210 Z" fill="#0c0f11" />
            <path d="M 70 -360 C 80 -330 80 -300 70 -280" stroke={glowCol} strokeWidth={4} opacity={0.6 * flicker} fill="none" />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------- supermarket */
export const Supermarket: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const vx = 960, vy = 470;
  const r = rng(808);
  const shelves: React.ReactNode[] = [];
  const cols = ['#d58b49', '#b0675a', '#7a9a5a', '#78969A', '#e0c070', '#c9c3b6', '#6b3b35'];
  [-1, 1].forEach((side) => {
    for (let k = 0; k < 7; k++) {
      const t0 = k / 7, t1 = (k + 0.92) / 7;
      const x0 = lerp(side < 0 ? -100 : W + 100, vx + side * 140, t0), x1 = lerp(side < 0 ? -100 : W + 100, vx + side * 140, t1);
      const top0 = lerp(80, vy - 120, t0), top1 = lerp(80, vy - 120, t1), bot0 = lerp(H, vy + 110, t0), bot1 = lerp(H, vy + 110, t1);
      shelves.push(<polygon key={`s${side}${k}`} points={`${x0},${top0} ${x1},${top1} ${x1},${bot1} ${x0},${bot0}`} fill="#2a3236" />);
      for (let row = 0; row < 5; row++) {
        const f = (row + 0.15) / 5.3, g = (row + 0.85) / 5.3;
        const ya0 = lerp(top0, bot0, f), yb0 = lerp(top0, bot0, g), ya1 = lerp(top1, bot1, f), yb1 = lerp(top1, bot1, g);
        shelves.push(<polygon key={`p${side}${k}${row}`} points={`${x0},${ya0} ${x1},${ya1} ${x1},${yb1} ${x0},${yb0}`} fill={cols[Math.floor(r() * cols.length)]} opacity={0.85} />);
      }
    }
  });
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="50% 45%">
        <Svg>
          <rect width={W} height={H} fill="#dfe3dc" />
          <rect width={W} height={vy - 120} fill="#c9cfc8" />
          {Array.from({length: 6}, (_, i) => <rect key={i} x={lerp(300, 880, i / 6)} y={lerp(40, vy - 140, i / 6)} width={lerp(1320, 160, i / 6)} height={lerp(14, 3, i / 6)} fill="#ffffff" opacity={0.9} />)}
          <path d={`M -100 ${H} L ${vx - 140} ${vy + 110} L ${vx + 140} ${vy + 110} L ${W + 100} ${H} Z`} fill="#b7beb6" />
          <path d={`M ${vx - 20} ${vy + 110} L ${vx + 20} ${vy + 110} L ${vx + 260} ${H} L ${vx - 260} ${H} Z`} fill="#fff" opacity={0.25} />
          {shelves}
          {p.cart && <g transform="translate(980 760)">
            <path d="M -110 -120 L 120 -120 L 90 0 L -80 0 Z" fill="none" stroke="#5d6165" strokeWidth={8} />
            {Array.from({length: 6}, (_, i) => <line key={i} x1={-100 + i * 40} y1={-118} x2={-74 + i * 32} y2={-2} stroke="#5d6165" strokeWidth={4} />)}
            <rect x={-70} y={-150} width={50} height={40} fill="#d58b49" /><rect x={-10} y={-160} width={40} height={50} fill="#7a9a5a" /><rect x={40} y={-140} width={46} height={30} fill="#b0675a" />
            <circle cx={-60} cy={20} r={14} fill="#222" /><circle cx={70} cy={20} r={14} fill="#222" />
          </g>}
          {p.noah && <g transform="translate(1180 1000) scale(0.75)"><NoahWalk phase={frame / 5.5} outfit="out" rim="#ffffff" /></g>}
          {/* music notes from the ceiling speaker */}
          <rect x={vx - 30} y={60} width={60} height={20} rx={6} fill="#9aa2a0" />
          {[0, 1].map((i) => { const k = ((frame / 60 + i / 2) % 1); return <text key={i} x={vx + 40 + k * 60} y={110 + k * 60} fill="#78969A" opacity={1 - k} fontSize={30}>♪</text>; })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- hospital */
export const Hospital: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const vx = 960, vy = 480;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.14} origin="50% 45%">
        <Svg>
          <rect width={W} height={H} fill="#cfdad8" />
          <path d={`M 0 0 L ${vx - 150} ${vy - 100} L ${vx + 150} ${vy - 100} L ${W} 0 Z`} fill="#e9efee" />
          <path d={`M 0 ${H} L ${vx - 150} ${vy + 100} L ${vx + 150} ${vy + 100} L ${W} ${H} Z`} fill="#9fb4b0" />
          <path d={`M 0 0 L ${vx - 150} ${vy - 100} L ${vx - 150} ${vy + 100} L 0 ${H} Z`} fill="#bccbc8" />
          <path d={`M ${W} 0 L ${vx + 150} ${vy - 100} L ${vx + 150} ${vy + 100} L ${W} ${H} Z`} fill="#b3c3c0" />
          <rect x={vx - 150} y={vy - 100} width={300} height={200} fill="#e4ecea" />
          <path d={`M 0 ${H * 0.62} L ${vx - 150} ${vy + 30} M ${W} ${H * 0.62} L ${vx + 150} ${vy + 30}`} stroke="#263C40" strokeWidth={10} />
          {Array.from({length: 5}, (_, i) => <rect key={i} x={lerp(500, 900, i / 5)} y={lerp(30, vy - 110, i / 5)} width={lerp(920, 120, i / 5)} height={lerp(16, 4, i / 5)} fill="#ffffff" />)}
          {/* empty beds */}
          {[0.15, 0.42].map((k, i) => {
            const x = lerp(-40, vx - 150, k), y = lerp(H - 120, vy + 60, k), s = lerp(1.2, 0.4, k);
            return <g key={i} transform={`translate(${x + 120 * s} ${y}) scale(${s})`}>
              <rect x={0} y={-40} width={380} height={50} rx={10} fill="#eef3f2" /><rect x={0} y={10} width={380} height={20} fill="#7d8f8f" />
              <rect x={10} y={30} width={10} height={80} fill="#5d6165" /><rect x={360} y={30} width={10} height={80} fill="#5d6165" />
              <ellipse cx={60} cy={-50} rx={50} ry={18} fill="#fff" />
              {/* monitor */}
              <rect x={-120} y={-300} width={110} height={80} rx={6} fill="#0f1a1d" />
              <polyline points={Array.from({length: 22}, (_, j) => `${-112 + j * 4.5},${-260 + (((j + Math.floor(frame / 2)) % 22) === 10 ? -24 : 0)}`).join(' ')} stroke="#39e08a" strokeWidth={2} fill="none" />
              <rect x={-70} y={-220} width={8} height={230} fill="#5d6165" />
            </g>;
          })}
          {[0.1, 0.35, 0.6].map((k, i) => {
            const x = lerp(W, vx + 150, k), top = lerp(220, vy - 50, k), bot = lerp(H - 80, vy + 95, k), w = lerp(160, 30, k);
            return <polygon key={i} points={`${x},${top} ${x - w},${top + 10} ${x - w},${bot - 5} ${x},${bot}`} fill="#7aa0a0" />;
          })}
          {p.noah && <g transform="translate(980 860) scale(0.62)"><NoahWalk phase={frame / 6} outfit="out" rim="#ffffff" /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- subway */
export const Subway: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 20) % 2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.06} to={1.06} x={[60, -60]}>
        <Svg>
          <rect width={W} height={H} fill="#141b1f" />
          <rect x={0} y={0} width={W} height={160} fill="#0d1215" />
          {Array.from({length: 8}, (_, i) => <rect key={i} x={i * 260 + 40} y={150} width={180} height={10} fill="#e9f0ee" opacity={0.85} />)}
          <rect x={0} y={160} width={W} height={60} fill="#263C40" />
          <text x={240} y={202} fill={C.mist} fontFamily="Inter" fontWeight={700} fontSize={30}>CENTRAL ↔ NORTH LINE</text>
          {/* train */}
          <rect x={-40} y={260} width={W + 80} height={420} rx={30} fill="#9aa6a6" />
          <rect x={-40} y={600} width={W + 80} height={30} fill="#d58b49" />
          {Array.from({length: 6}, (_, i) => (
            <g key={i}>
              <rect x={60 + i * 320} y={320} width={200} height={140} rx={10} fill="#d9e4e2" opacity={0.85} />
              <rect x={70 + i * 320} y={400} width={180} height={50} fill="#5d6f72" opacity={0.6} />
            </g>
          ))}
          {[1, 3].map((i) => (
            <g key={i}>
              <rect x={i * 320 - 70} y={300} width={120} height={380} fill="#e9efe8" />
              <rect x={i * 320 - 60} y={480} width={100} height={60} fill="#6b7e80" opacity={0.6} />
              <rect x={i * 320 - 140} y={300} width={60} height={380} fill="#7d8a8a" />
              <rect x={i * 320 + 60} y={300} width={60} height={380} fill="#7d8a8a" />
              <circle cx={i * 320 - 10} cy={290} r={8} fill={blink ? '#f2b66d' : '#5a4630'} />
            </g>
          ))}
          <rect x={0} y={680} width={W} height={20} fill="#e0c070" />
          <rect x={0} y={700} width={W} height={380} fill="#2a3134" />
          {Array.from({length: 10}, (_, i) => <line key={i} x1={i * 220} y1={700} x2={i * 260 - 400} y2={H} stroke="#20272a" strokeWidth={4} />)}
          <rect x={1400} y={760} width={300} height={30} fill="#1b2125" /><rect x={1420} y={790} width={10} height={60} fill="#1b2125" /><rect x={1670} y={790} width={10} height={60} fill="#1b2125" />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- police */
export const Police: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const ring = Math.floor(frame / 8) % 4 < 2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1} origin="45% 60%">
        <Svg>
          <rect width={W} height={H} fill="#1a2328" />
          <rect x={0} y={0} width={W} height={120} fill="#141b1f" />
          {Array.from({length: 4}, (_, i) => <rect key={i} x={200 + i * 420} y={110} width={260} height={10} fill="#e9f0ee" opacity={0.7} />)}
          <rect x={1300} y={200} width={500} height={300} fill="#263C40" />
          <text x={1550} y={300} textAnchor="middle" fill={C.mist} fontFamily="Inter" fontWeight={800} fontSize={44}>PRECINCT 9</text>
          <rect x={1340} y={340} width={420} height={120} fill="#1a2a2e" />
          {Array.from({length: 6}, (_, i) => <rect key={i} x={1360 + (i % 3) * 136} y={356 + Math.floor(i / 3) * 52} width={120} height={40} fill="#b9c6c0" opacity={0.5} />)}
          <rect x={0} y={760} width={W} height={320} fill="#232b2f" />
          {/* desks */}
          {[0, 1].map((d) => (
            <g key={d} transform={`translate(${260 + d * 700} 620)`}>
              <rect x={0} y={60} width={520} height={30} fill="#4a3322" />
              <rect x={20} y={90} width={20} height={200} fill="#2e2016" /><rect x={480} y={90} width={20} height={200} fill="#2e2016" />
              <rect x={60} y={-90} width={200} height={140} rx={8} fill="#0f1518" />
              <rect x={70} y={-80} width={180} height={110} fill="#2f5560" />
              {Array.from({length: 5}, (_, i) => <rect key={i} x={84} y={-66 + i * 18} width={60 + ((i * 37) % 90)} height={6} fill="#9fc0c8" opacity={0.7} />)}
              <rect x={140} y={50} width={40} height={10} fill="#0f1518" />
              <rect x={300} y={34} width={90} height={30} rx={6} fill="#151a1d" />
              {d === 0 && ring && <text x={345} y={20} textAnchor="middle" fill="#f2b66d" fontFamily="Inter" fontWeight={700} fontSize={22}>((( )))</text>}
              {d === 1 && <><ellipse cx={420} cy={56} rx={44} ry={10} fill="#d5d2c7" /><path d="M 390 50 Q 420 30 450 50 Z" fill="#c9a06a" /></>}
              <path d="M 160 160 L 160 100 C 160 80 260 80 260 100 L 260 160 Z" fill="#14181b" transform="translate(60 150)" />
            </g>
          ))}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- electronics store */
export const Electronics: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const seed = p.seed ?? 1;
  const cam = camFor(seed + 3, 0.8);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <rect width={W} height={H} fill="#0c1114" />
          <polygon points="1500,0 1800,0 1300,1080 700,1080" fill="#d5d2c7" opacity={0.07} />
          {Array.from({length: 3}, (_, row) => Array.from({length: 7}, (_, c) => (
            <g key={`${row}${c}`}>
              <rect x={100 + c * 250} y={120 + row * 190} width={220} height={140} rx={6} fill="#050708" stroke="#1d2428" strokeWidth={6} />
              <rect x={110 + c * 250} y={130 + row * 190} width={200} height={120} fill="#121a1e" />
              <path d={`M ${130 + c * 250} ${150 + row * 190} L ${180 + c * 250} ${150 + row * 190}`} stroke="#2a3a40" strokeWidth={4} opacity={0.6} />
            </g>
          )))}
          <rect x={0} y={720} width={W} height={40} fill="#2a2420" />
          <rect x={0} y={760} width={W} height={320} fill="#151a1d" />
          {Array.from({length: 9}, (_, i) => <rect key={i} x={120 + i * 200} y={660} width={120 + (i % 3) * 20} height={60} rx={8} fill={['#2a3236', '#3a2e2a', '#263C40'][i % 3]} />)}
          {Array.from({length: 60}, (_, i) => { const r = rng(i * 7); return <circle key={i} cx={(r() * W + frame * 0.3) % W} cy={r() * 700} r={1.5} fill="#d5d2c7" opacity={0.25} />; })}
          {p.noah && <g transform="translate(1100 860) scale(0.9)"><NoahSitting outfit="out" phone={false} head={0.2} /></g>}
          {p.noah && <circle cx={1240} cy={760} r={6} fill="#ff4a3a" opacity={0.5 + 0.5 * Math.sin(frame / 4)} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------- radio close-up */
export const RadioClose: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const st = p.state ?? 'search';
  const dial = st === 'search' ? 300 + Math.sin(frame / 40) * 200 + frame * 0.8 : 560;
  const led = st === 'led' || st === 'voice' ? (st === 'voice' ? 1 : 0.4 + 0.6 * (Math.floor(frame / 12) % 2)) : 0;
  const r = rng(frame);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={st === 'voice' ? 1.12 : 1.05} origin="50% 50%">
        <Svg>
          <rect width={W} height={H} fill="#07090b" />
          <Glow id="rg" cx={960} cy={540} r={900} color={led ? '#ff4a3a' : '#5a6468'} opacity={0.12 + led * 0.12} />
          <g transform="translate(960 560)">
            <rect x={-620} y={-300} width={1240} height={600} rx={60} fill="#2b2f33" />
            <rect x={-600} y={-280} width={1200} height={560} rx={48} fill="#33383d" />
            {/* speaker grill */}
            {Array.from({length: 10}, (_, row) => Array.from({length: 14}, (_, c) => <circle key={`${row}${c}`} cx={-540 + c * 34} cy={-200 + row * 40} r={9} fill="#1a1d20" />))}
            {/* frequency window */}
            <rect x={-20} y={-220} width={560} height={150} rx={14} fill="#c9b07a" opacity={0.95} />
            {Array.from({length: 28}, (_, i) => <line key={i} x1={i * 20} y1={-200} x2={i * 20} y2={i % 5 === 0 ? -150 : -170} stroke="#3a2a18" strokeWidth={3} />)}
            {['88', '92', '96', '100', '104', '108'].map((t, i) => <text key={t} x={4 + i * 100} y={-100} fill="#3a2a18" fontFamily="Inter" fontWeight={700} fontSize={22}>{t}</text>)}
            <rect x={-20 + (dial % 560)} y={-225} width={6} height={160} fill="#c0553f" />
            {/* waveform display */}
            <rect x={-20} y={-40} width={560} height={160} rx={14} fill="#0b1214" />
            {st === 'voice' ? (
              <polyline points={Array.from({length: 80}, (_, i) => `${-10 + i * 7},${40 + Math.sin(i / 3 + frame / 2) * (20 + r() * 40) * Math.sin(i / 25 * Math.PI)}`).join(' ')} stroke="#ff7a5a" strokeWidth={3} fill="none" />
            ) : st === 'dead' ? (
              <line x1={-10} y1={40} x2={530} y2={40} stroke="#3a4a4e" strokeWidth={3} />
            ) : (
              <polyline points={Array.from({length: 80}, (_, i) => `${-10 + i * 7},${40 + (r() - 0.5) * 50}`).join(' ')} stroke="#78969A" strokeWidth={2} fill="none" />
            )}
            {/* knobs + LED */}
            <circle cx={-380} cy={200} r={60} fill="#1f2326" /><line x1={-380} y1={200} x2={-380 + Math.cos(frame / 20) * 50} y2={200 + Math.sin(frame / 20) * 50} stroke="#c9b07a" strokeWidth={6} />
            <circle cx={-200} cy={200} r={44} fill="#1f2326" />
            <circle cx={480} cy={200} r={22} fill={led ? '#ff4a3a' : '#3a1a16'} />
            {led > 0 && <Glow id="led" cx={480} cy={200} r={120} color="#ff4a3a" opacity={0.6 * led} />}
            <text x={300} y={210} fill="#9aa2a0" fontFamily="Inter" fontWeight={700} fontSize={22}>SIGNAL</text>
            <rect x={-620} y={-360} width={20} height={80} fill="#6b6e70" transform="rotate(-20 -610 -320)" />
          </g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ tally marks */
export const Tally: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const n = p.n ?? 3;
  const prev = n === 3 ? 0 : n === 5 ? 3 : 5;
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const show = i < prev ? 1 : interpolate(frame, [10 + (i - prev) * 8, 18 + (i - prev) * 8], [0, 1], clamp);
    const grp = Math.floor(i / 5), k = i % 5;
    const x = 700 + grp * 260 + k * 40;
    marks.push(k === 4
      ? <line key={i} x1={x - 175} y1={560} x2={x + 10} y2={420} stroke="#d5d2c7" strokeWidth={10} strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - show)} />
      : <line key={i} x1={x} y1={400} x2={x - 6} y2={580} stroke="#d5d2c7" strokeWidth={10} strokeLinecap="round" strokeDasharray="190" strokeDashoffset={190 * (1 - show)} />);
  }
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.05} to={1.0}>
        <Svg>
          <rect width={W} height={H} fill="#1d2529" />
          {Array.from({length: 30}, (_, i) => { const r = rng(i + 40); return <rect key={i} x={r() * W} y={r() * H} width={r() * 200} height={2} fill="#263035" />; })}
          <Glow id="tg" cx={1500} cy={200} r={900} color={C.gold} opacity={0.18} />
          {marks}
          <text x={960} y={760} textAnchor="middle" fill={C.amber} fontFamily="Inter Display" fontWeight={800} fontSize={90} letterSpacing={12}
            opacity={interpolate(frame, [20, 34], [0, 1], clamp)}>DAY {n}</text>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- map */
export const MapSet: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const draw = p.route ? interpolate(frame, [10, dur - 20], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.route ? 1.0 : 1.12} to={p.route ? 1.15 : 1.0} origin="58% 40%">
        <Svg>
          <rect width={W} height={H} fill="#151a1d" />
          <rect x={240} y={100} width={1440} height={880} fill="#d8cfb5" />
          <rect x={240} y={100} width={1440} height={880} fill="none" stroke="#3a2a18" strokeWidth={10} />
          {Array.from({length: 14}, (_, i) => <path key={i} d={`M 240 ${160 + i * 60} C 600 ${120 + i * 64} 1000 ${200 + i * 58} 1680 ${150 + i * 61}`} stroke="#c2b796" strokeWidth={2} fill="none" />)}
          <path d="M 1100 140 C 1200 260 1180 380 1260 460 C 1340 540 1300 640 1360 760" stroke="#7aa0b0" strokeWidth={14} fill="none" opacity={0.7} />
          {/* city block */}
          {Array.from({length: 36}, (_, i) => <rect key={i} x={500 + (i % 6) * 34} y={640 + Math.floor(i / 6) * 34} width={26} height={26} fill="#9a8f78" />)}
          <text x={600} y={900} textAnchor="middle" fill="#3a2a18" fontFamily="Inter" fontWeight={800} fontSize={30}>THE CITY</text>
          {/* mountains */}
          {[0, 1, 2, 3].map((i) => <polygon key={i} points={`${1180 + i * 70},${300 - (i % 2) * 30} ${1140 + i * 70},${380} ${1220 + i * 70},${380}`} fill="#8a7e64" />)}
          <circle cx={1290} cy={260} r={16} fill="#c0553f" />
          <text x={1290} y={220} textAnchor="middle" fill="#3a2a18" fontFamily="Inter" fontWeight={800} fontSize={26}>HOLLIS OBSERVATORY</text>
          <path d="M 620 700 C 760 600 820 520 980 480 C 1120 440 1180 360 1290 270" stroke="#c0553f" strokeWidth={8} fill="none" strokeDasharray="1200" strokeDashoffset={1200 * (1 - draw)} strokeLinecap="round" />
          <text x={980} y={560} fill="#6b3b35" fontFamily="Inter" fontWeight={700} fontSize={24} opacity={draw}>~ 60 MI</text>
          <rect x={940} y={84} width={40} height={40} fill="#c0553f" opacity={0.8} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
