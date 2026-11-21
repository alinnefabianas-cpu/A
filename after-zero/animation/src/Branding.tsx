import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Glow, lerp, Rays, Skyline} from './lib';
import {NoahStandBack} from './noah';

/* ------------------------------------------------ profile picture 800x800 */
export const ProfilePic: React.FC = () => {
  const S = 800, cx = 400, cy = 400;
  return (
    <AbsoluteFill style={{background: C.midnight}}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
        <defs>
          <linearGradient id="pp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d151c" />
            <stop offset="0.45" stopColor="#24363d" />
            <stop offset="0.62" stopColor="#c4804a" />
            <stop offset="0.7" stopColor="#ffd59a" />
            <stop offset="1" stopColor="#ffd59a" />
          </linearGradient>
          <clipPath id="pp-in"><ellipse cx={cx} cy={cy} rx={262} ry={330} /></clipPath>
        </defs>
        <rect width={S} height={S} fill={C.midnight} />
        <Glow id="pp-out" cx={cx} cy={cy} r={420} color={C.amber} opacity={0.22} />
        {/* the "zero": a sunrise seen through it */}
        <g clipPath="url(#pp-in)">
          <rect x={0} y={0} width={S} height={S} fill="url(#pp-sky)" />
          <Glow id="pp-sun" cx={cx} cy={455} r={320} color="#fff1d6" opacity={0.95} />
          <circle cx={cx} cy={455} r={58} fill="#fff8ea" />
          <Rays cx={cx} cy={455} count={16} opacity={0.12} len={600} seed={3} />
          <Skyline seed={21} baseY={505} minH={30} maxH={150} color="#9a7a62" minW={16} maxW={40} x0={100} x1={700} />
          <Skyline seed={22} baseY={560} minH={40} maxH={190} color="#1a252b" minW={24} maxW={56} x0={100} x1={700} spires={0.6}
            edge={{color: C.amber, opacity: 0.6, side: 'left'}} />
          <rect x={0} y={556} width={S} height={300} fill="#101820" />
          <path d={`M ${cx - 6} 558 L ${cx + 6} 558 L ${cx + 70} 700 L ${cx - 70} 700 Z`} fill="#ffcf8a" opacity={0.25} />
          <g transform={`translate(${cx} 620) scale(0.26)`}><NoahStandBack /></g>
        </g>
        <ellipse cx={cx} cy={cy} rx={262} ry={330} fill="none" stroke={C.amber} strokeWidth={62} />
        <ellipse cx={cx} cy={cy} rx={262} ry={330} fill="none" stroke="#ffd59a" strokeWidth={6} opacity={0.6} transform={`translate(-18 -14)`} />
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------ channel banner 2560x1440 */
export const Banner: React.FC = () => {
  const W = 2560, H = 1440, cx = 1280, hz = 1040;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="bn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070c10" />
            <stop offset="0.35" stopColor="#1a2830" />
            <stop offset="0.5" stopColor="#5f5248" />
            <stop offset="0.66" stopColor="#d58b49" />
            <stop offset="0.74" stopColor="#ffd59a" />
            <stop offset="1" stopColor="#ffd59a" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#bn-sky)" />
        <Glow id="bn-g1" cx={cx} cy={hz - 60} r={1500} color="#ffb366" opacity={0.55} />
        <Glow id="bn-g2" cx={cx} cy={hz - 60} r={300} color="#fff1d6" opacity={1} />
        <circle cx={cx} cy={hz - 60} r={70} fill="#fff8ea" />
        <Rays cx={cx} cy={hz - 60} count={26} opacity={0.08} len={2600} seed={11} />
        <Skyline seed={501} baseY={hz} minH={30} maxH={140} color="#8a6c5a" minW={30} maxW={80} x0={0} x1={W} />
        <Skyline seed={502} baseY={hz + 70} minH={50} maxH={190} color="#2c3a40" minW={50} maxW={130} x0={0} x1={W}
          edge={{color: C.amber, opacity: 0.45, side: 'left'}} windows={{color: '#f2b66d', prob: 0.03, opacity: 0.5}} />
        <Skyline seed={503} baseY={hz + 200} minH={500} maxH={1000} color="#0d151a" minW={110} maxW={200} x0={-200} x1={430}
          edge={{color: C.amber, opacity: 0.6, side: 'right'}} spires={0.5} />
        <Skyline seed={504} baseY={hz + 200} minH={500} maxH={1000} color="#0d151a" minW={110} maxW={200} x0={2130} x1={W + 200}
          edge={{color: C.amber, opacity: 0.6, side: 'left'}} spires={0.5} />
        <rect x={0} y={hz + 200} width={W} height={H} fill="#0d151a" />
        <path d={`M ${cx - 420} ${hz + 70} L ${cx + 420} ${hz + 70} L ${cx + 900} ${H} L ${cx - 900} ${H} Z`} fill="#1a2227" />
        <path d={`M ${cx - 60} ${hz + 70} L ${cx + 60} ${hz + 70} L ${cx + 500} ${H} L ${cx - 500} ${H} Z`} fill="#ffcf8a" opacity={0.18} />
        {/* birds */}
        {Array.from({length: 9}, (_, i) => {
          const x = lerp(1640, 1980, i / 9) + (i % 3) * 30, y = 420 + (i % 4) * 26 - i * 6;
          return <path key={i} d={`M ${x - 14} ${y - 6} Q ${x - 6} ${y - 10} ${x} ${y} Q ${x + 6} ${y - 10} ${x + 14} ${y - 6}`} stroke="#1b2328" strokeWidth={3} fill="none" />;
        })}
        <g transform={`translate(${cx} ${hz + 330}) scale(0.4)`}><NoahStandBack /></g>
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
      {/* text kept inside YouTube's 1546x423 safe area (y 508–931) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', fontFamily: 'Inter Display, Inter',
        textShadow: '0 6px 40px rgba(0,0,0,0.7)'}}>
        <div style={{fontWeight: 900, fontSize: 190, letterSpacing: 34, color: '#f4f1ea', paddingLeft: 34}}>AFTER ZERO</div>
        <div style={{width: 380, height: 5, background: C.amber, margin: '18px auto 26px'}} />
        <div style={{fontWeight: 400, fontSize: 40, letterSpacing: 12, color: '#d5d2c7'}}>WHEN EVERYTHING ENDS, THE STORY BEGINS.</div>
      </div>
    </AbsoluteFill>
  );
};
