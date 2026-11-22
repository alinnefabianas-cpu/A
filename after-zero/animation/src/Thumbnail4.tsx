import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Rays, Svg, W, H} from './lib';
import {NoahStandBack} from './noah';

/** Episode 004 thumbnail: Noah tiny at the foot of a colossal rainforest, light shafts, macaw. */
export const Thumbnail4: React.FC<{variant?: number}> = ({variant = 1}) => {
  const trunks = [[-60, 260], [260, 160], [520, 120], [1500, 140], [1720, 280]];
  const nx = variant === 1 ? 1180 : 960;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <rect width={W} height={H} fill="#163a1a" />
        <Glow id="t4g" cx={nx} cy={300} r={900} color="#e8f0a0" opacity={0.55} />
        <Rays cx={nx} cy={-200} count={18} opacity={0.22} len={1800} color="#fff6d0" seed={6} />
        {Array.from({length: 60}, (_, i) => { const x = (i * 97) % W, y = (i * 53) % 400; return <path key={i} d={`M ${x} ${y} c 40 -60 140 -80 220 -20 c -80 50 -180 50 -220 20 Z`} fill={['#265a2a', '#3f7a3e', '#1a4a20'][i % 3]} transform={`rotate(${i * 37} ${x} ${y})`} />; })}
        {trunks.map(([x, w], i) => <g key={i}><rect x={x} y={-100} width={w} height={1300} fill={i % 2 ? '#0e2410' : '#122a14'} /><path d={`M ${x + w / 2} -100 C ${x + w} 400 ${x} 700 ${x + w / 2} 1100`} stroke="#0a1a0c" strokeWidth={10} fill="none" /></g>)}
        {Array.from({length: 26}, (_, i) => { const x = (i * 131) % W, y = 820 + (i * 37) % 260; return <path key={i} d={`M ${x} ${y} c 40 -60 140 -80 220 -20 c -80 50 -180 50 -220 20 Z`} fill={['#0e2410', '#14301a'][i % 2]} transform={`rotate(${-20 + (i * 23) % 60} ${x} ${y})`} />; })}
        <rect x={0} y={960} width={W} height={120} fill="#1a1408" />
        <g transform={`translate(${nx} 990) scale(0.42)`}><NoahStandBack outfit="trek" /></g>
        {/* macaw */}
        <g transform={`translate(${variant === 1 ? 1540 : 1560} 330) rotate(70) scale(0.7)`}>
          <path d="M 0 0 L -120 -90 L -40 -10 Z" fill="#2a6ad0" /><path d="M 0 0 L 120 -90 L 40 -10 Z" fill="#e0c030" />
          <ellipse cx={0} cy={0} rx={30} ry={70} fill="#d02a20" /><path d="M -10 60 L 0 180 L 10 60 Z" fill="#d02a20" /><circle cx={0} cy={-60} r={22} fill="#d02a20" />
        </g>
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)'}} />
      <div style={{position: 'absolute', left: variant === 1 ? 80 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: variant === 1 ? 300 : 110,
        fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.85)'}}>
        <div style={{fontSize: 210, color: '#e8f0a0'}}>16 DAYS</div>
        <div style={{fontSize: 150, color: '#f4f1ea'}}>LOST</div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
