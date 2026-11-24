import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Sky, Svg, W, H} from './lib';
import {RaftShape} from './sets/ocean';

/** Episode 006 thumbnail: tiny orange raft on an endless sunset ocean, albatross overhead. */
export const Thumbnail6: React.FC<{variant?: number}> = ({variant = 1}) => {
  const rx = variant === 1 ? 1280 : 960;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <Sky id="t6" stops={[[0, '#0e1430'], [0.45, '#5a3050'], [0.7, '#e0703a'], [1, '#f0a050']]} />
        <Glow id="t6g" cx={rx} cy={640} r={1000} color="#f0a050" opacity={0.6} />
        <circle cx={rx} cy={640} r={80} fill="#fff0d0" />
        <rect x={0} y={660} width={W} height={420} fill="#2a2040" />
        <path d={`M ${rx - 70} 660 L ${rx + 70} 660 L ${rx + 300} ${H} L ${rx - 300} ${H} Z`} fill="#f0b070" opacity={0.35} />
        {Array.from({length: 30}, (_, i) => <path key={i} d={`M ${(i * 137) % W} ${690 + (i * 53) % 380} q 40 -6 80 0`} stroke="#f0b070" strokeWidth={2 + (i % 3)} opacity={0.35} fill="none" />)}
        <g transform={`translate(${rx} 840) scale(0.55)`}><RaftShape frame={0} /></g>
        <g transform={`translate(${variant === 1 ? 1500 : 1560} ${variant === 1 ? 300 : 520}) scale(0.3)`}>
          <path d="M 0 0 C -120 -20 -300 -10 -420 20 C -300 0 -150 16 0 20 Z M 0 0 C 120 -20 300 -10 420 20 C 300 0 150 16 0 20 Z" fill="#1a1a1a" />
          <ellipse cx={0} cy={10} rx={70} ry={26} fill="#f4f4f0" />
        </g>
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', left: variant === 1 ? 80 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: variant === 1 ? 140 : 70,
        fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.85)'}}>
        <div style={{fontSize: 230, color: '#ffb366'}}>38 DAYS</div>
        <div style={{fontSize: 130, color: '#f4f1ea'}}>ADRIFT</div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
