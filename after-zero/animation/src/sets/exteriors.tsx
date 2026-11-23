import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Birds, C, Camera, CarSide, clamp, Dust, Fog, Glow, H, lerp, Rays, rng, Sky, Skyline, Svg, useProgress, W} from '../lib';
import {NoahBack, NoahSitting, NoahStandBack, NoahWalk} from '../noah';
import {camFor, Rain, SetProps, SKY, Stars, Time, TONES} from './common';

const SunDisc: React.FC<{t: Time; x: number; y: number; id: string}> = ({t, x, y, id}) => {
  const tone = TONES[t];
  if (t === 'night') return <><circle cx={x} cy={y - 200} r={34} fill="#e9eef0" opacity={0.9} /><Glow id={id} cx={x} cy={y - 200} r={260} color="#9fc0d0" opacity={0.25} /></>;
  if (t === 'rain') return null;
  return (
    <>
      <Glow id={`${id}a`} cx={x} cy={y} r={900} color={tone.sun} opacity={tone.sunO} />
      <Glow id={`${id}b`} cx={x} cy={y} r={240} color={t === 'day' ? '#ffffff' : C.sun} opacity={0.9} />
      <circle cx={x} cy={y} r={t === 'day' ? 50 : 62} fill={t === 'day' ? '#fffaf0' : '#fff4dc'} />
    </>
  );
};

/* ------------------------------------------------------------------ CITY */
export const City: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'dawn';
  const seed = p.seed ?? 1;
  const tone = TONES[t];
  const pr = useProgress(dur);
  const frame = useCurrentFrame();
  const sunY = t === 'day' ? lerp(260, 230, pr) : t === 'dusk' ? lerp(470, 540, pr) : lerp(520, 455, pr);
  const night = t === 'night';
  return (
    <AbsoluteFill style={{background: C.midnight}}>
      <Camera dur={dur} from={1.0} to={1.09} origin="58% 60%">
        <Svg>
          <Sky id="city" stops={SKY[t]} />
          {night && <Stars />}
          <SunDisc t={t} x={1140} y={sunY} id="citysun" />
          {(t === 'dawn' || t === 'dusk') && <Rays cx={1140} cy={sunY} count={18} opacity={0.07} spin={1} />}
          <g transform={`translate(${-pr * 20} 0)`}>
            <Skyline seed={11 + seed * 7} baseY={720} minH={120} maxH={420} color={tone.far} minW={40} maxW={110} />
          </g>
          <Fog id="cityf1" y={560} h={220} opacity={night ? 0.15 : 0.35} speed={0.3} color={tone.fog} />
          <g transform={`translate(${-pr * 45} 0)`}>
            <Skyline seed={23 + seed * 7} baseY={770} minH={120} maxH={360} color={tone.mid} minW={60} maxW={150}
              edge={{color: tone.edge, opacity: tone.edgeO * 0.9, side: 'left'}} windows={{color: tone.win, prob: night ? 0.01 : tone.winP + 0.02, opacity: 0.6}} />
          </g>
          <Fog id="cityf2" y={660} h={200} opacity={night ? 0.12 : 0.3} speed={0.6} color={tone.fog} />
          <g transform={`translate(${-pr * 90} 0)`}>
            <Skyline seed={37 + seed * 7} baseY={820} minH={180} maxH={520} color={tone.near} minW={90} maxW={210} x0={-400} x1={760}
              edge={{color: tone.edge, opacity: tone.edgeO, side: 'right'}} windows={{color: tone.win, prob: night ? 0.012 : tone.winP, opacity: 0.55}} spires={0.5} />
            <Skyline seed={38 + seed * 7} baseY={820} minH={180} maxH={520} color={tone.near} minW={90} maxW={210} x0={1240} x1={2400}
              edge={{color: tone.edge, opacity: tone.edgeO, side: 'left'}} windows={{color: tone.win, prob: night ? 0.012 : tone.winP, opacity: 0.55}} spires={0.5} />
          </g>
          <path d={`M 0 ${H} L 860 800 L 1060 800 L ${W} ${H} Z`} fill="#12191e" />
          <path d={`M 0 ${H} L 860 800 L 0 800 Z`} fill="#0c1216" />
          <path d={`M ${W} ${H} L 1060 800 L ${W} 800 Z`} fill="#0c1216" />
          {!night && <path d={`M 940 805 L 980 805 L 1010 ${H} L 900 ${H} Z`} fill={tone.sun} opacity={0.15} />}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const tt = i / 6, y = 806 + Math.pow(tt, 2) * 280;
            return <rect key={i} x={958 - tt * 12} y={y} width={4 + tt * 24} height={6 + tt * 40} fill={C.mist} opacity={0.3} />;
          })}
          {[0, 1, 2, 3].map((i) => {
            const tt = (i + 1) / 5, s = 0.25 + tt * 1.1;
            return (
              <g key={i}>
                <CarSide x={860 - tt * 760} y={800 + tt * tt * 260} s={s} glint={tone.edge} />
                <CarSide x={1060 + tt * 760} y={800 + tt * tt * 260} s={s} flip glint={tone.edge} />
              </g>
            );
          })}
          {[0, 1, 2].map((i) => {
            const tt = (i + 1) / 4;
            const x = 840 - tt * 900, y = 800 + tt * tt * 290, hgt = 120 + tt * 520;
            return <g key={i}><rect x={x} y={y - hgt} width={4 + tt * 10} height={hgt} fill="#0a0f13" />
              <rect x={x} y={y - hgt} width={40 + tt * 80} height={4 + tt * 8} fill="#0a0f13" />
              {night && <Glow id={`lamp${i}`} cx={x + 40 + tt * 70} cy={y - hgt + 10} r={60 + tt * 120} color="#f2c27d" opacity={0.35} />}</g>;
          })}
          {!night && <Birds x={600} y={360} count={t === 'dawn' && seed === 9 ? 18 : 11} vx={2.4} vy={-0.5} scale={1.1} seed={seed} />}
          {p.traffic && [0, 1, 2, 3, 4].map((i) => {
            const k = ((frame / 90 + i / 5) % 1);
            const y = 800 + k * k * 280, s2 = 0.2 + k * 1.2;
            return <g key={`tr${i}`}><CarSide x={lerp(930, 600, k)} y={y} s={s2} color={['#8a3a2a', '#2a4a6a', '#c9a04a', '#5a7a8a', '#3a3a3a'][i]} glint={tone.edge} />
              {[0.3, 0.7].includes(Math.round(k * 10) / 10) ? null : null}</g>;
          })}
          {p.traffic && [0, 1, 2, 3].map((i) => <g key={`ped${i}`} transform={`translate(${(200 + i * 460 + frame * (i % 2 ? 1.2 : -1.2) + 2000) % 2000} ${900 + (i % 2) * 40}) scale(0.35)`}><rect x={-30} y={-380} width={60} height={200} rx={20} fill={['#8a3a2a', '#2a4a6a', '#c9a04a', '#4a6a4a'][i]} /><circle cx={0} cy={-430} r={40} fill="#c88d69" /><rect x={-26} y={-190} width={22} height={190} fill="#2a2a30" /><rect x={4} y={-190} width={22} height={190} fill="#2a2a30" /></g>)}
          {t === 'rain' && <Rain />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* -------------------------------------------- empty city through window */
export const WindowBack: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'dawn';
  const tone = TONES[t];
  const pr = useProgress(dur);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.12} origin="55% 45%">
        <Svg>
          <Sky id="wb" stops={SKY[t]} />
          {t === 'night' && <Stars />}
          <SunDisc t={t} x={1140} y={t === 'day' ? 200 : lerp(430, 400, pr)} id="wbsun" />
          {t !== 'day' && t !== 'night' && <Rays cx={1140} cy={415} count={16} opacity={0.06} spin={1} />}
          <Skyline seed={51} baseY={600} minH={100} maxH={380} color={tone.far} minW={40} maxW={100} />
          <Fog id="wbf" y={480} h={200} opacity={0.35} color={tone.fog} />
          <Skyline seed={52} baseY={700} minH={150} maxH={520} color={tone.mid} minW={60} maxW={140} edge={{color: tone.edge, opacity: tone.edgeO * 0.8, side: 'left'}} />
          <path d={`M 700 ${H} L 1060 640 L 1180 640 L 1500 ${H} Z`} fill="#1a2328" />
          {Array.from({length: 14}, (_, i) => {
            const r = rng(200 + i);
            const tt = i / 14, y = 650 + tt * tt * 430, s = 0.2 + tt * 1.1;
            const x = lerp(1090, 1000, tt) + (r() - 0.5) * 300 * tt + (i % 2 ? 60 : -40) * tt;
            return <rect key={i} x={x} y={y} width={36 * s} height={18 * s} rx={4 * s} fill={['#2c3a40', '#5a3a30', '#1b2328', '#6b6e70'][i % 4]}
              transform={`rotate(${(r() - 0.5) * 30} ${x} ${y})`} />;
          })}
          <Skyline seed={53} baseY={1100} minH={300} maxH={700} color={tone.near} minW={120} maxW={260} x0={-300} x1={700}
            edge={{color: tone.edge, opacity: tone.edgeO, side: 'right'}} windows={{color: '#2a3a40', prob: 0.4, opacity: 0.8}} />
          <Skyline seed={54} baseY={1100} minH={300} maxH={760} color={tone.near} minW={120} maxW={260} x0={1500} x1={2300}
            edge={{color: tone.edge, opacity: tone.edgeO, side: 'left'}} windows={{color: '#2a3a40', prob: 0.4, opacity: 0.8}} />
          {t !== 'night' && <Birds x={500} y={300} count={6} vx={1.6} vy={-0.2} />}
          <rect x={-20} y={-20} width={W + 40} height={H + 40} fill="none" stroke="#0d1216" strokeWidth={140} />
          <path d={`M 1720 0 C ${1700 + Math.sin(frame / 18) * 20} 300 ${1760 + Math.sin(frame / 15) * 25} 700 1730 ${H} L ${W} ${H} L ${W} 0 Z`} fill="#c9b79c" opacity={0.85} />
          <g transform={`translate(${lerp(560, 580, pr)} ${H + 150})`}>
            <NoahBack armRaise={0} lean={lerp(0, 3, pr)} />
          </g>
          {p.echo && [0, 1, 2].map((i) => {
            const k = ((frame / 40 + i / 3) % 1);
            return <circle key={i} cx={560} cy={330} r={80 + k * 900} fill="none" stroke={C.mist} strokeWidth={3} opacity={(1 - k) * 0.25} />;
          })}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------- abandoned street */
export const Street: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'dawn';
  const tone = TONES[t];
  const seed = p.seed ?? 1;
  const frame = useCurrentFrame();
  const leaves = rng(91 + seed);
  const cam = camFor(seed);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x} origin="60% 55%">
        <Svg>
          <Sky id="st" stops={SKY[t]} />
          <SunDisc t={t} x={1300} y={t === 'day' ? 220 : 520} id="stsun" />
          <Skyline seed={61 + seed} baseY={560} minH={120} maxH={380} color={tone.far} minW={40} maxW={100} />
          <Fog id="stf" y={420} h={260} opacity={0.4} color={tone.fog} />
          <Skyline seed={62 + seed} baseY={600} minH={200} maxH={600} color={tone.mid} minW={100} maxW={220} x0={1300}
            edge={{color: tone.edge, opacity: tone.edgeO, side: 'left'}} windows={{color: '#1a2328', prob: 0.5, opacity: 0.6}} />
          <Skyline seed={63 + seed} baseY={600} minH={200} maxH={520} color={tone.mid} minW={100} maxW={220} x0={-300} x1={420}
            edge={{color: tone.edge, opacity: tone.edgeO, side: 'right'}} windows={{color: '#1a2328', prob: 0.5, opacity: 0.6}} />
          <path d={`M 0 640 L ${W} 600 L ${W} ${H} L 0 ${H} Z`} fill={t === 'rain' ? '#2a3337' : '#20272b'} />
          {t === 'rain' && <path d={`M 0 700 L ${W} 650 L ${W} 760 L 0 820 Z`} fill="#a9b8ba" opacity={0.08} />}
          <path d={`M 0 760 L ${W} 650`} stroke={C.mist} strokeWidth={5} strokeDasharray="60 50" opacity={0.3} />
          <g transform="rotate(-3 1100 660)"><CarSide x={1100} y={660} s={0.9} color="#2a353b" glint={tone.edge} /></g>
          <g transform="rotate(4 1450 640)"><CarSide x={1450} y={640} s={0.7} color="#4a3329" flip glint={tone.edge} /></g>
          <CarSide x={760} y={690} s={1.2} color="#1b2328" glint={tone.edge} />
          {seed % 2 === 1 && <g transform="translate(860 610) rotate(-14)"><rect x={-40} y={-50} width={60} height={50} fill="#1b2328" /></g>}
          <g transform="translate(560 860) rotate(-8)">
            <circle cx={-80} cy={0} r={56} stroke="#0e1316" strokeWidth={8} fill="none" />
            <circle cx={90} cy={0} r={56} stroke="#0e1316" strokeWidth={8} fill="none" />
            <path d="M -80 0 L -10 -70 L 60 -70 L 90 0 M -10 -70 L 10 0 L -80 0 M 10 0 L 60 -70 M 60 -70 L 50 -96 M -20 -80 L 0 -80" stroke="#6b3b35" strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
          <rect x={-40} y={830} width={560} height={26} fill="#1a1410" />
          <rect x={-40} y={880} width={560} height={26} fill="#221a14" />
          <rect x={60} y={900} width={20} height={200} fill="#0e0b09" /><rect x={400} y={900} width={20} height={200} fill="#0e0b09" />
          <path d="M 280 830 L 290 760 L 342 760 L 352 830 Z" fill="#c9b79c" />
          <rect x={284} y={750} width={64} height={14} rx={4} fill="#3a2a20" />
          <rect x={288} y={784} width={56} height={22} fill="#6b4630" />
          {t !== 'rain' && Array.from({length: 14}, (_, i) => {
            const bx = leaves() * W, by = leaves() * 400, sp = 1 + leaves() * 1.5, ph = leaves() * 6;
            const x = (bx + frame * sp * 2.2) % (W + 100) - 50;
            const y = by + 300 + frame * sp * 1.2 + Math.sin(frame / 10 + ph) * 20;
            return <ellipse key={i} cx={x} cy={y % H} rx={10} ry={5} fill={i % 2 ? '#b8622e' : '#d58b49'} transform={`rotate(${frame * 4 + ph * 50} ${x} ${y % H})`} opacity={0.85} />;
          })}
          {t === 'rain' && <>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const k = ((frame / 25 + i * 0.37) % 1);
              return <ellipse key={i} cx={200 + i * 290} cy={900 + (i % 3) * 50} rx={10 + k * 50} ry={3 + k * 12} fill="none" stroke="#cfd8da" strokeWidth={2} opacity={(1 - k) * 0.5} />;
            })}
            <Rain count={260} />
          </>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ------------------------------------------- Noah walking down a street */
export const NoahStreet: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'day';
  const tone = TONES[t];
  const seed = p.seed ?? 1;
  const frame = useCurrentFrame();
  const scroll = frame * 2.2;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.03} to={1.07}>
        <Svg>
          <Sky id="ns" stops={SKY[t]} />
          <SunDisc t={t} x={1500} y={t === 'day' ? 200 : 560} id="nssun" />
          <g transform={`translate(${-scroll * 0.15} 0)`}><Skyline seed={70 + seed} baseY={560} minH={100} maxH={360} color={tone.far} x1={W + 600} /></g>
          <Fog id="nsf" y={420} h={240} opacity={0.35} color={tone.fog} />
          <g transform={`translate(${-scroll * 0.45} 0)`}>
            <Skyline seed={80 + seed} baseY={800} minH={360} maxH={700} color={tone.mid} minW={140} maxW={300} x1={W + 1800}
              edge={{color: tone.edge, opacity: tone.edgeO, side: 'left'}} windows={{color: t === 'dusk' ? tone.win : '#1a2328', prob: 0.45, opacity: 0.6}} />
            {/* shop fronts */}
            {Array.from({length: 12}, (_, i) => (
              <g key={i}>
                <rect x={i * 340 - 200} y={690} width={240} height={110} fill={t === 'dusk' ? '#3a2e2a' : '#1d272c'} />
                <rect x={i * 340 - 190} y={700} width={220} height={60} fill={t === 'dusk' ? '#e7a868' : '#7f9ea3'} opacity={0.35} />
                <path d={`M ${i * 340 - 210} 690 L ${i * 340 + 50} 690 L ${i * 340 + 30} 660 L ${i * 340 - 190} 660 Z`} fill={['#6b3b35', '#263C40', '#5a4a30'][i % 3]} />
              </g>
            ))}
          </g>
          <rect x={0} y={800} width={W} height={60} fill="#3a3f42" />
          <rect x={0} y={860} width={W} height={220} fill="#1f2629" />
          <g transform={`translate(${-(scroll * 1.0) % 400} 0)`}>
            {Array.from({length: 7}, (_, i) => <rect key={i} x={i * 400} y={800} width={4} height={60} fill="#2a2f32" />)}
          </g>
          <g transform={`translate(${-(scroll * 1.0) % 1400} 0)`}>
            {[0, 1, 2].map((i) => <CarSide key={i} x={300 + i * 1400} y={1010} s={1.4} color={['#2a353b', '#4a3329', '#1b2328'][i]} glint={tone.edge} />)}
          </g>
          <g transform="translate(900 830) scale(0.95)">
            <NoahWalk phase={frame / 5.2} outfit="out" rim={tone.edge} />
          </g>
          {t === 'rain' && <Rain />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* --------------------------------------- vast empty boulevard, Noah tiny */
export const StreetWide: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'day';
  const tone = TONES[t];
  const seed = p.seed ?? 1;
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  const vx = 960, vy = 560;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="50% 52%">
        <Svg>
          <Sky id="sw" stops={SKY[t]} />
          <SunDisc t={t} x={vx} y={t === 'day' ? 260 : 520} id="swsun" />
          {t !== 'day' && <Rays cx={vx} cy={520} count={14} opacity={0.08} />}
          <Skyline seed={100 + seed} baseY={vy} minH={60} maxH={240} color={tone.far} minW={30} maxW={80} x0={620} x1={1300} />
          <Fog id="swf" y={440} h={220} opacity={0.4} color={tone.fog} />
          {/* towers converging */}
          {Array.from({length: 6}, (_, i) => {
            const k = i / 6;
            const xl = lerp(-200, 700, k), xr = lerp(W + 200, 1220, k);
            const w = lerp(380, 70, k), top = lerp(-200, 260, k), bot = lerp(H + 100, vy + 10, k);
            const col = i % 2 ? tone.near : tone.mid;
            return (
              <g key={i}>
                <rect x={xl} y={top} width={w} height={bot - top} fill={col} />
                <rect x={xl + w - 5} y={top} width={5} height={bot - top} fill={tone.edge} opacity={tone.edgeO * 0.7} />
                <rect x={xr - w} y={top} width={w} height={bot - top} fill={col} />
                <rect x={xr - w} y={top} width={5} height={bot - top} fill={tone.edge} opacity={tone.edgeO * 0.7} />
              </g>
            );
          })}
          <path d={`M -400 ${H} L ${vx - 40} ${vy} L ${vx + 40} ${vy} L ${W + 400} ${H} Z`} fill="#20272b" />
          <path d={`M ${vx - 4} ${vy} L ${vx + 4} ${vy} L ${vx + 30} ${H} L ${vx - 30} ${H} Z`} fill={C.mist} opacity={0.25} />
          {t !== 'day' && <path d={`M ${vx - 30} ${vy} L ${vx + 30} ${vy} L ${vx + 420} ${H} L ${vx - 420} ${H} Z`} fill={tone.sun} opacity={0.1} />}
          {[0.25, 0.45, 0.7].map((k, i) => <CarSide key={i} x={lerp(vx - 60, vx - 520, k) + (i % 2) * lerp(60, 700, k)} y={lerp(vy + 10, H - 20, k)} s={lerp(0.1, 1.4, k)} color="#1b2328" glint={tone.edge} flip={i % 2 === 1} />)}
          <g transform={`translate(${vx + 40} ${lerp(800, 780, pr)}) scale(${p.tiny ? 0.22 : 0.4})`}>
            <NoahWalk phase={frame / 5.5} outfit="out" rim={tone.edge} />
          </g>
          {t !== 'night' && <Birds x={300} y={300} count={5} vx={1.4} vy={-0.2} seed={seed} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------- night: lights go out */
export const WindowNight: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase ?? 'hold';
  const r = rng(321);
  const zoom = phase === 'zoomout' ? interpolate(frame, [0, dur], [2.4, 1.0], clamp) : phase === 'hold' ? 1.0 : 1.25;
  const cells: React.ReactNode[] = [];
  for (let b = 0; b < 22; b++) {
    const x = b * 92 - 60, w = 80 + r() * 10, h = 300 + r() * 520, top = H - h;
    cells.push(<rect key={`b${b}`} x={x} y={top} width={w} height={h} fill={b % 2 ? '#111b22' : '#152129'} />);
    cells.push(<rect key={`e${b}`} x={x} y={top} width={3} height={h} fill="#2a3a44" />);
    for (let row = 0; row < h / 30; row++) {
      for (let c = 0; c < 4; c++) {
        const off = phase === 'dimming' ? r() * dur : -1;
        const lit = phase === 'dimming' ? frame < off : false;
        const keep = b === 11 && row === 8 && c === 1; // Noah's window
        const v = r();
        if (keep) {
          cells.push(<rect key={`k`} x={x + 8 + c * 18} y={top + 20 + row * 30} width={12} height={16} fill="#ffd28a" />);
          cells.push(<Glow key="kg" id="kg" cx={x + 14 + c * 18} cy={top + 28 + row * 30} r={phase === 'dimming' ? 60 : 150} color="#ffd28a" opacity={0.75} />);
        } else if (v < 0.35 && (lit || phase === 'dimming' && frame < 3)) {
          cells.push(<rect key={`w${b}-${row}-${c}`} x={x + 8 + c * 18} y={top + 20 + row * 30} width={12} height={16} fill="#f2c27d" opacity={0.75} />);
        }
      }
    }
  }
  const tx = 11 * 92 - 60 + 8 + 18 + 6, ty = 0; // focus x
  return (
    <AbsoluteFill style={{background: '#030508'}}>
      <Svg>
        <Sky id="wn" stops={SKY.night} />
        <Stars count={200} maxY={500} />
        <g transform={`translate(${tx} 560) scale(${zoom}) translate(${-tx} -560)`}>{cells}</g>
        <Fog id="wnf" y={760} h={300} opacity={0.15} color="#2a3a44" />
      </Svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- rooftop sunset, alone */
export const Rooftop: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'dusk';
  const tone = TONES[t];
  const seed = p.seed ?? 1;
  const frame = useCurrentFrame();
  const pr = useProgress(dur);
  const cam = camFor(seed, 0.8);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x}>
        <Svg>
          <Sky id="rt" stops={SKY.dusk} />
          <SunDisc t="dusk" x={1300} y={lerp(560, 610, pr)} id="rtsun" />
          <Rays cx={1300} cy={600} count={16} opacity={0.08} />
          <Skyline seed={140 + seed} baseY={700} minH={80} maxH={360} color={tone.far} />
          <Fog id="rtf" y={560} h={220} opacity={0.3} color={tone.fog} />
          <Skyline seed={150 + seed} baseY={800} minH={60} maxH={300} color={tone.mid} edge={{color: tone.edge, opacity: 0.5, side: 'left'}} windows={{color: tone.win, prob: 0.06}} />
          {/* roof */}
          <rect x={0} y={800} width={W} height={280} fill="#14171c" />
          <rect x={0} y={790} width={W} height={18} fill="#22262c" />
          <rect x={1500} y={640} width={160} height={160} fill="#1a1d22" />
          <rect x={1520} y={600} width={10} height={60} fill="#1a1d22" />
          {/* camping stove + mug */}
          <rect x={420} y={760} width={50} height={30} fill="#2e3236" />
          <rect x={485} y={770} width={20} height={22} fill="#c9b79c" />
          <g transform="translate(620 790) scale(1.1)"><NoahSitting outfit="out" phone={false} breath={(Math.sin(frame / 24) + 1) / 2} head={0.9} /></g>
          <Birds x={200} y={300} count={7} vx={1.3} vy={-0.15} seed={seed + 3} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- JOURNEY */
export const Journey: React.FC<SetProps> = ({dur, p}) => {
  const stage = p.stage ?? 'fields';
  const t: Time = p.time ?? (stage === 'cityEdge' ? 'dawn' : stage === 'forest' ? 'day' : stage === 'mountain' ? 'day' : 'day');
  const seed = p.seed ?? 1;
  const frame = useCurrentFrame();
  const scroll = frame * 1.6;
  const tone = TONES[t];
  const hillCol = stage === 'mountain' ? ['#8a9a9c', '#5b6f73', '#33474c'] : stage === 'forest' ? ['#6f8a7c', '#3c5a4c', '#1f3a30'] : ['#9aa88a', '#6f8a5c', '#46613c'];
  const hills = (seed2: number, base: number, amp: number, col: string, speed: number, peaks = false) => {
    const r = rng(seed2);
    const pts: string[] = [];
    const off = (scroll * speed) % 400;
    for (let x = -400; x <= W + 800; x += 100) {
      const y = base - (peaks ? Math.abs(Math.sin(x / 260 + seed2)) * amp + r() * amp * 0.3 : Math.sin(x / 380 + seed2) * amp * 0.5 + r() * amp * 0.15);
      pts.push(`${x - off},${y}`);
    }
    return <polygon points={`-400,${H} ${pts.join(' ')} ${W + 800},${H}`} fill={col} />;
  };
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.04} to={1.08}>
        <Svg>
          <Sky id="jy" stops={SKY[t]} />
          <SunDisc t={t} x={1400} y={t === 'dawn' ? 480 : 230} id="jysun" />
          {stage === 'cityEdge' && <g transform={`translate(${-scroll * 0.1} 0)`}><Skyline seed={9} baseY={640} minH={60} maxH={300} color="#6d7f82" minW={30} maxW={90} x0={1100} x1={2100} /></g>}
          {hills(seed + 1, stage === 'mountain' ? 560 : 620, stage === 'mountain' ? 380 : 120, hillCol[0], 0.15, stage === 'mountain')}
          <Fog id="jyf" y={stage === 'mountain' ? 480 : 560} h={220} opacity={stage === 'mountain' || p.fog ? 0.55 : 0.3} color={tone.fog} />
          {hills(seed + 2, 720, stage === 'mountain' ? 260 : 100, hillCol[1], 0.35, stage === 'mountain')}
          {(stage === 'forest' || stage === 'mountain') && (() => {
            const r = rng(seed + 50);
            const off = (scroll * 0.6) % 120;
            return Array.from({length: 26}, (_, i) => {
              const x = i * 90 - off, h = 120 + r() * 140, y = 760 + r() * 20;
              return <polygon key={i} points={`${x},${y - h} ${x - 34},${y} ${x + 34},${y}`} fill={stage === 'mountain' ? '#22363a' : '#1c3328'} />;
            });
          })()}
          {hills(seed + 3, 820, 40, hillCol[2], 0.7)}
          {/* road */}
          <rect x={0} y={850} width={W} height={90} fill={stage === 'fields' ? '#4a4e48' : '#3a3f42'} />
          <g transform={`translate(${-(scroll * 1.4) % 200} 0)`}>{Array.from({length: 12}, (_, i) => <rect key={i} x={i * 200} y={892} width={90} height={6} fill={C.mist} opacity={0.4} />)}</g>
          {stage === 'fields' && <g transform={`translate(${-(scroll * 1.4) % 160} 0)`}>{Array.from({length: 16}, (_, i) => <path key={i} d={`M ${i * 160} 860 q 8 -30 0 -50 M ${i * 160 + 30} 870 q -6 -24 4 -40`} stroke="#7a9a5a" strokeWidth={5} fill="none" />)}</g>}
          {stage === 'highway' && <g transform={`translate(${-(scroll * 1.4) % 1800} 0)`}>{Array.from({length: 12}, (_, i) => <CarSide key={i} x={i * 300} y={900 + (i % 2) * 30} s={0.9} color={['#2a353b', '#4a3329', '#1b2328', '#5d6165'][i % 4]} glint={tone.edge} flip={i % 3 === 0} />)}</g>}
          {stage === 'highway' && <rect x={0} y={950} width={W} height={130} fill="#1f2629" />}
          <rect x={0} y={940} width={W} height={140} fill={stage === 'fields' ? '#3c5a34' : stage === 'forest' ? '#1f3328' : '#2c3638'} />
          <g transform="translate(860 905) scale(0.6)"><NoahWalk phase={frame / 5.5} outfit="out" rim={tone.edge} /></g>
          {(p.birds || stage === 'fields') && <Birds x={200} y={260} count={p.birds ? 22 : 8} vx={1.8} vy={-0.3} seed={seed + 4} />}
          {stage === 'fields' && p.birds && <Birds x={-200} y={420} count={14} vx={2.4} vy={-0.5} seed={seed + 9} scale={0.8} />}
          {t === 'rain' && <Rain count={300} opacity={0.45} />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- campfire night */
export const Campfire: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const fl = (k: number) => 0.8 + 0.2 * Math.sin(frame / 3 + k) * Math.sin(frame / 7 + k * 2);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.stars ? 1.0 : 1.08} to={p.stars ? 1.08 : 1.0} y={p.stars ? [0, 60] : [0, 0]} origin="50% 70%">
        <Svg>
          <Sky id="cf" stops={SKY.night} />
          <Stars count={p.stars ? 520 : 280} maxY={760} />
          {p.stars && <path d="M -100 520 C 400 300 1200 160 2100 60" stroke="#c9d4e0" strokeWidth={140} opacity={0.06} fill="none" />}
          {p.roof ? <><Skyline seed={404} baseY={860} minH={80} maxH={360} color="#070c10" minW={60} maxW={140} windows={{color: '#f2c27d', prob: 0.05, opacity: 0.7}} />
            <rect x={0} y={860} width={W} height={220} fill="#101418" /><rect x={0} y={850} width={W} height={14} fill="#1c2228" /></>
            : <><polygon points={`0,780 300,640 700,720 1100,600 1500,700 1920,620 1920,${H} 0,${H}`} fill="#0b1216" />
          <rect x={0} y={860} width={W} height={220} fill="#0e1714" /></>}
          {!p.roof && <Glow id="cfg" cx={960} cy={880} r={520 * fl(1)} color="#f29a4a" opacity={0.55} />}
          {!p.roof && <g transform="translate(960 900)">
            <path d="M -60 10 L 60 -10 M -60 -10 L 60 10" stroke="#3a2418" strokeWidth={14} strokeLinecap="round" />
            {[0, 1, 2].map((i) => <path key={i} d={`M ${-30 + i * 30} 0 C ${-50 + i * 30} ${-40 * fl(i)} ${-10 + i * 30} ${-70 * fl(i + 2)} ${-20 + i * 30} ${-110 * fl(i)} C ${10 + i * 30} ${-70 * fl(i + 1)} ${20 + i * 30} -30 ${-30 + i * 30 + 40} 0 Z`} fill={i === 1 ? '#ffd27a' : '#f08a3a'} opacity={0.95} />)}
          </g>}
          <g transform="translate(700 900) scale(1.2)"><NoahSitting outfit="out" phone={false} breath={(Math.sin(frame / 26) + 1) / 2} head={p.stars ? 1 : 0.5} /></g>
          {!p.roof && <rect x={1160} y={850} width={80} height={60} rx={14} fill="#3e4245" />}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------- observatory exterior */
export const ObsExt: React.FC<SetProps> = ({dur, p}) => {
  const t: Time = p.time ?? 'dusk';
  const frame = useCurrentFrame();
  const night = t === 'night';
  const blackout = p.blackout ? interpolate(frame, [dur - 30, dur - 26], [1, 0], clamp) : 1;
  const reveal = p.reveal ? interpolate(frame, [0, dur], [0.2, 1], clamp) : 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={p.reveal ? 1.2 : 1.0} to={p.reveal ? 1.0 : 1.08} origin="55% 45%">
        <Svg>
          <Sky id="ox" stops={night ? SKY.night : [[0, '#2a3338'], [0.5, '#6d7a7c'], [0.8, '#b48a68'], [1, '#c99a70']]} />
          {night && <Stars count={360} />}
          {p.ring && <RingLights phase={1} cx={960} cy={300} r={360} />}
          <polygon points={`0,${H} 0,760 400,600 760,430 960,380 1180,440 1500,620 1920,700 1920,${H}`} fill={night ? '#0b1318' : '#3a464a'} />
          {/* observatory */}
          <g transform="translate(960 380)">
            <rect x={-220} y={-60} width={440} height={140} fill={night ? '#1a242a' : '#c9cfcc'} />
            <path d="M -200 -60 A 200 200 0 0 1 200 -60 Z" fill={night ? '#26343b' : '#e8ecea'} />
            <rect x={-26} y={-250} width={52} height={190} fill={night ? '#0b1116' : '#9aa4a4'} transform="rotate(12 0 -60)" opacity={0.9} />
            {[-1, 1].map((s) => <rect key={s} x={s * 140 - 20} y={-20} width={40} height={50} fill={(p.light || night) && blackout > 0.5 ? '#ffd28a' : '#2a3338'} />)}
            {(p.light || night) && blackout > 0.5 && <Glow id="oxg" cx={140} cy={5} r={120} color="#ffd28a" opacity={0.6} />}
            <rect x={-30} y={20} width={60} height={60} fill="#1a2024" />
          </g>
          <Fog id="oxf" y={440} h={260} opacity={(night ? 0.15 : 0.45) * (2 - reveal)} speed={0.6} color={night ? '#2a3a44' : '#c9cfcc'} />
          <polygon points={`0,${H} 0,900 500,820 900,860 1300,800 1920,880 1920,${H}`} fill={night ? '#060b0e' : '#22302f'} />
          {Array.from({length: 18}, (_, i) => <polygon key={i} points={`${i * 115 - 20},${860 + (i % 3) * 20 - 180} ${i * 115 - 60},${880 + (i % 3) * 20} ${i * 115 + 20},${880 + (i % 3) * 20}`} fill={night ? '#050a0c' : '#1a2a28'} />)}
          {p.noah && <g transform="translate(760 900) scale(0.5)"><NoahStandBack /></g>}
          {p.ring && <g transform="translate(960 960) scale(0.55)"><NoahStandBack /></g>}
        </Svg>
      </Camera>
      {p.blackout && <AbsoluteFill style={{background: '#000', opacity: 1 - blackout}} />}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- the ring of lights */
export const RingLights: React.FC<{phase: number; cx: number; cy: number; r: number}> = ({phase, cx, cy, r}) => {
  const frame = useCurrentFrame();
  const n = 48;
  const rr = rng(77);
  return (
    <g style={{mixBlendMode: 'screen'}}>
      <Glow id="ringg" cx={cx} cy={cy} r={r * 1.6} color="#9fd0e0" opacity={0.2 * phase} />
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + frame * 0.0015;
        const sx = rr() * W, sy = rr() * 600;
        const k = Math.min(1, Math.max(0, phase * 1.4 - (i / n) * 0.4));
        const x = lerp(sx, cx + Math.cos(a) * r, k), y = lerp(sy, cy + Math.sin(a) * r * 0.42, k);
        const tw = 0.6 + 0.4 * Math.sin(frame / 8 + i);
        return <g key={i}><circle cx={x} cy={y} r={3 + k * 3} fill="#e6f6ff" opacity={tw} /><circle cx={x} cy={y} r={14} fill="#9fd0e0" opacity={0.18 * tw} /></g>;
      })}
      {phase > 0.95 && <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.42} fill="none" stroke="#bfe6f2" strokeWidth={2} opacity={0.25 + 0.1 * Math.sin(frame / 10)} />}
    </g>
  );
};

export const SkyRing: React.FC<SetProps> = ({dur, p}) => {
  const frame = useCurrentFrame();
  const phase = p.phase === 'start' ? interpolate(frame, [0, dur], [0, 0.35], clamp)
    : p.phase === 'form' ? interpolate(frame, [0, dur * 0.9], [0.3, 1], clamp) : 1;
  const clouds = p.phase === 'start' ? interpolate(frame, [0, dur], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.08} origin="50% 40%">
        <Svg>
          <Sky id="sr" stops={SKY.night} />
          <Stars count={400} />
          <RingLights phase={phase} cx={960} cy={360} r={520} />
          {/* parting clouds */}
          <ellipse cx={600 - clouds * 700} cy={300} rx={700} ry={200} fill="#1a2730" opacity={0.9} />
          <ellipse cx={1320 + clouds * 700} cy={340} rx={700} ry={210} fill="#1a2730" opacity={0.9} />
          <polygon points={`0,${H} 0,820 300,700 640,780 960,640 1300,760 1600,680 1920,760 1920,${H}`} fill="#070c10" />
          <g transform="translate(960 640) scale(0.35)">
            <rect x={-220} y={-60} width={440} height={140} fill="#141c21" />
            <path d="M -200 -60 A 200 200 0 0 1 200 -60 Z" fill="#1c272d" />
          </g>
          {p.noah && <g transform="translate(960 1010) scale(0.75)"><NoahStandBack /></g>}
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------- Noah at observatory window */
export const ObsWindow: React.FC<SetProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const part = interpolate(frame, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={1.0} to={1.1} origin="50% 40%">
        <Svg>
          <Sky id="ow" stops={SKY.night} />
          <Stars count={300} />
          <RingLights phase={part * 0.25} cx={960} cy={320} r={480} />
          <ellipse cx={700 - part * 600} cy={300} rx={700} ry={220} fill="#16222a" />
          <ellipse cx={1240 + part * 600} cy={320} rx={700} ry={220} fill="#16222a" />
          <rect x={0} y={0} width={W} height={H} fill="none" stroke="#0a0f12" strokeWidth={240} />
          <rect x={940} y={0} width={40} height={H} fill="#0a0f12" />
          <rect x={0} y={760} width={W} height={60} fill="#0a0f12" />
          <g transform="translate(700 1240)"><NoahBack armRaise={0} outfit="out" /></g>
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------- sunrise ending on the hill */
export const SunriseEnding: React.FC<SetProps> = ({dur, p}) => {
  const seed = p.seed ?? 1;
  const pr = useProgress(dur);
  const cam = camFor(seed, 0.6);
  return (
    <AbsoluteFill>
      <Camera dur={dur} from={cam.from} to={cam.to} x={cam.x} origin="50% 60%">
        <Svg>
          <Sky id="se" stops={SKY.dawn} />
          <SunDisc t="dawn" x={1180} y={lerp(640, 560, pr)} id="sesun" />
          <Rays cx={1180} cy={600} count={20} opacity={0.08} spin={1} />
          <polygon points={`0,700 300,560 600,640 900,520 1250,620 1600,540 1920,620 1920,${H} 0,${H}`} fill="#6d7f82" opacity={0.7} />
          <Fog id="sef" y={600} h={240} opacity={0.5} color="#f1d2a8" />
          <Skyline seed={9} baseY={790} minH={20} maxH={130} color="#5b6a6c" minW={10} maxW={30} x0={700} x1={1500} />
          <Fog id="sef2" y={720} h={160} opacity={0.4} color="#f1d2a8" />
          <polygon points={`0,${H} 0,900 400,840 700,870 960,820 1200,870 1920,900 1920,${H}`} fill="#1a2328" />
          <g transform="translate(980 1010) scale(0.85)"><NoahStandBack /></g>
          <Birds x={300} y={420} count={14} vx={1.6} vy={-0.3} seed={seed} />
        </Svg>
      </Camera>
    </AbsoluteFill>
  );
};
