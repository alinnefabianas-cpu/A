import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Skyline, Svg, W, H} from './lib';
import {NoahStandBack} from './noah';
import {Pedestrian} from './sets/sequel';
import {rng} from './lib';

/** Episode 005 thumbnail: the crowd reappearing as ghosts around Noah. */
export const Thumbnail5: React.FC<{variant?: number}> = ({variant = 1}) => {
  const people = Array.from({length: 26}, (_, i) => { const r = rng(i * 7 + 3); return {i, x: r() * W, y: 760 + r() * 300, s: 0.35 + r() * 0.5, o: 0.25 + r() * 0.45}; }).sort((a, b) => a.y - b.y);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <defs><linearGradient id="t5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2a4a" /><stop offset="0.6" stopColor="#c46f40" /><stop offset="1" stopColor="#f2b86e" /></linearGradient></defs>
        <rect width={W} height={H} fill="url(#t5)" />
        <Glow id="t5g" cx={variant === 1 ? 1300 : 960} cy={620} r={900} color="#ffd59a" opacity={0.6} />
        <Skyline seed={77} baseY={760} minH={260} maxH={640} color="#1a2530" minW={100} maxW={220} edge={{color: '#f2b66d', opacity: 0.6, side: 'left'}} windows={{color: '#f2c27d', prob: 0.08, opacity: 0.6}} />
        <rect x={0} y={760} width={W} height={320} fill="#2a2a30" />
        {people.map((p) => <g key={p.i} opacity={p.o} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}><Pedestrian seed={p.i + 50} phase={p.i} flip={p.i % 2 === 0} /></g>)}
        {people.map((p) => <ellipse key={`g${p.i}`} cx={p.x} cy={p.y - 200 * p.s} rx={60 * p.s} ry={260 * p.s} fill="#ffffff" opacity={0.08} />)}
        <g transform={`translate(${variant === 1 ? 1300 : 960} 1060) scale(0.95)`}><NoahStandBack /></g>
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)'}} />
      <div style={{position: 'absolute', left: variant === 1 ? 80 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: variant === 1 ? 140 : 80,
        fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.85)'}}>
        <div style={{fontSize: 190, color: '#f4f1ea'}}>THEY</div>
        <div style={{fontSize: 190, color: '#ffb366'}}>CAME BACK</div>
      </div>
      <div style={{position: 'absolute', right: 40, top: 40, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 48, letterSpacing: 6, color: '#7fd0e0', textShadow: '0 4px 20px #000'}}>PHASE TWO</div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
