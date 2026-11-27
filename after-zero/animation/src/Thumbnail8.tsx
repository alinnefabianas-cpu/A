import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Svg, W, H} from './lib';
import {Stars} from './sets/common';
import {Astronaut, Planet, StationShape} from './sets/space';

/** Episode 008 thumbnail: a lone astronaut drifting away from the station, broken tether, Earth below. */
export const Thumbnail8: React.FC<{variant?: number}> = ({variant = 1}) => {
  const ax = variant === 1 ? 1380 : 1500;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <rect width={W} height={H} fill="#01030a" />
        <Stars count={500} maxY={H} seed={8} />
        <Planet view="sunrise" seed={3} cx={960} cy={2900} R={2300} id="t8" />
        <Glow id="t8s" cx={variant === 1 ? 1700 : 300} cy={640} r={900} color="#ffb060" opacity={0.55} />
        <circle cx={variant === 1 ? 1700 : 300} cy={620} r={34} fill="#fffaf0" />
        <g transform={`translate(${variant === 1 ? 560 : 420} 260) rotate(-12) scale(0.55)`}><StationShape frame={0} damaged /></g>
        <path d={`M ${variant === 1 ? 700 : 560} 300 C 900 380 1100 300 ${ax - 160} 520`} stroke="#f2f2ee" strokeWidth={6} fill="none" />
        <circle cx={ax - 160} cy={520} r={10} fill="#ff4a3a" />
        <g transform={`translate(${ax} 640) rotate(28) scale(0.95)`}><Astronaut frame={0} reach={0.9} light /></g>
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)'}} />
      <div style={{position: 'absolute', left: variant === 1 ? 80 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: variant === 1 ? 470 : 40,
        fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>
        <div style={{fontSize: 170, color: '#9fe0ff'}}>3 DAYS</div>
        <div style={{fontSize: 150, color: '#f4f1ea'}}>OF AIR</div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
