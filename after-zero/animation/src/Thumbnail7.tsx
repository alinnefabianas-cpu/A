import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Rays, Sky, Svg, W} from './lib';
import {NoahWalk} from './noah';
import {Dunescape, Jeep} from './sets/desert';

/** Episode 007 thumbnail: blazing sun over endless dunes, a lone walker leaving a half-buried car. */
export const Thumbnail7: React.FC<{variant?: number}> = ({variant = 1}) => {
  const sx = variant === 1 ? 1380 : 960;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <Sky id="t7" stops={[[0, '#3a1a20'], [0.4, '#a04a2a'], [0.7, '#f08a3a'], [1, '#f8c070']]} />
        <Glow id="t7g" cx={sx} cy={520} r={1100} color="#ffb060" opacity={0.75} />
        <circle cx={sx} cy={520} r={110} fill="#fff4d8" />
        <Rays cx={sx} cy={520} count={20} opacity={0.12} />
        <Dunescape t="dusk" seed={variant === 1 ? 14 : 21} hz={620} />
        <g transform={`translate(${variant === 1 ? 1650 : 1500} 900) scale(0.42)`}><Jeep frame={0} buried={0.65} /></g>
        <path d={`M ${variant === 1 ? 1500 : 1340} 905 ${Array.from({length: 9}, (_, i) => `L ${(variant === 1 ? 1500 : 1340) - i * 26} ${905 - i * 8 + (i % 2) * 6}`).join(' ')}`} stroke="#000" strokeOpacity={0.3} strokeWidth={8} strokeDasharray="6 18" fill="none" />
        <g transform={`translate(${variant === 1 ? 1220 : 1080} 840) scale(0.42)`}><NoahWalk phase={1} outfit="trek" rim="#ffd090" /></g>
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', left: variant === 1 ? 80 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: variant === 1 ? 130 : 60,
        fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.85)'}}>
        <div style={{fontSize: 210, color: '#ffe0a0'}}>50°C</div>
        <div style={{fontSize: 140, color: '#f4f1ea'}}>NO WATER</div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
