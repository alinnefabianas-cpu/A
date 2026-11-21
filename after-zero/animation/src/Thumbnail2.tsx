import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Glow, Rays, rng, Svg, W, H} from './lib';
import {NoahStandBack} from './noah';

/** Episode 002 thumbnail: cross-section of the mountain — sky above, Noah alone in a lit bunker deep below. */
export const Thumbnail2: React.FC<{variant?: number}> = ({variant = 1}) => {
  const r = rng(9);
  const bx = variant === 1 ? 1320 : 960, by = 820;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <defs>
          <linearGradient id="t2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a5560" /><stop offset="0.6" stopColor="#d2925a" /><stop offset="1" stopColor="#ffd59a" />
          </linearGradient>
          <linearGradient id="t2rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3028" /><stop offset="1" stopColor="#120e0b" />
          </linearGradient>
        </defs>
        <rect width={W} height={260} fill="url(#t2sky)" />
        <Glow id="t2s" cx={1600} cy={200} r={420} color="#fff1d6" opacity={0.8} />
        <circle cx={1600} cy={200} r={50} fill="#fff8ea" />
        <Rays cx={1600} cy={200} count={16} opacity={0.12} len={900} seed={4} />
        {/* mountain surface + trees */}
        <path d={`M 0 300 C 300 240 600 140 960 120 C 1300 140 1600 240 1920 290 L 1920 ${H} L 0 ${H} Z`} fill="url(#t2rock)" />
        <path d="M 0 300 C 300 240 600 140 960 120 C 1300 140 1600 240 1920 290" stroke="#3c5a3c" strokeWidth={26} fill="none" />
        {Array.from({length: 26}, (_, i) => { const x = i * 76 + 10; const y = 300 - Math.sin((x / 1920) * Math.PI) * 170 - 10; return <polygon key={i} points={`${x},${y - 60} ${x - 18},${y} ${x + 18},${y}`} fill="#24402c" />; })}
        {/* rock texture + strata */}
        {Array.from({length: 90}, (_, i) => <ellipse key={i} cx={r() * W} cy={320 + r() * 760} rx={10 + r() * 50} ry={6 + r() * 20} fill={['#2a221c', '#1c1612', '#3a3028'][i % 3]} opacity={0.8} />)}
        {[460, 600, 980].map((y, i) => <path key={i} d={`M 0 ${y} C 600 ${y - 30} 1300 ${y + 30} 1920 ${y - 10}`} stroke="#2a221c" strokeWidth={6} fill="none" />)}
        {/* collapsed shaft from surface */}
        <path d={`M ${bx - 30} 180 L ${bx + 30} 180 L ${bx + 30} ${by - 140} L ${bx - 30} ${by - 140} Z`} fill="#0a0806" />
        {Array.from({length: 14}, (_, i) => <circle key={i} cx={bx - 26 + r() * 52} cy={300 + r() * 300} r={14 + r() * 16} fill="#4a3e34" />)}
        {/* the bunker room */}
        <rect x={bx - 300} y={by - 140} width={600} height={220} fill="#2c3133" />
        <Glow id="t2b" cx={bx} cy={by - 100} r={460} color={C.amber} opacity={0.55} />
        <rect x={bx - 300} y={by - 140} width={600} height={220} fill="none" stroke="#5a5f60" strokeWidth={10} />
        <ellipse cx={bx} cy={by - 120} rx={18} ry={14} fill="#fff1d6" />
        <polygon points={`${bx - 14},${by - 110} ${bx + 14},${by - 110} ${bx + 160},${by + 80} ${bx - 160},${by + 80}`} fill="#ffd59a" opacity={0.18} />
        <rect x={bx + 180} y={by - 40} width={90} height={120} fill="#4a6a5a" />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={bx - 280 + i * 14} y1={by - 120} x2={bx - 283 + i * 14} y2={by - 70} stroke="#d5d2c7" strokeWidth={3} opacity={i % 5 === 4 ? 0 : 0.8} />)}
        <g transform={`translate(${bx - 40} ${by + 80}) scale(0.32)`}><NoahStandBack /></g>
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 65% 70%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)'}} />
      <div style={{position: 'absolute', left: variant === 1 ? 80 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: 330,
        fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.85)'}}>
        <div style={{fontSize: 230, color: '#ffb366'}}>100 DAYS</div>
        <div style={{fontSize: 120, color: '#f4f1ea'}}>UNDERGROUND</div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
