import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Sky, Svg} from './lib';
import {NoahWalk} from './noah';
import {AuroraBands, IceField, Plane} from './sets/arctic';
import {Stars} from './sets/common';

/** Episode 003 thumbnail: Noah, tiny, walking away from the wreck under the aurora. */
export const Thumbnail3: React.FC<{variant?: number}> = ({variant = 1}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Svg>
      <Sky id="t3" stops={[[0, '#02050a'], [0.6, '#08121c'], [1, '#12222e']]} />
      <Stars count={420} seed={4} />
      <AuroraBands seed={3} amp={1.4} />
      <AuroraBands seed={5} amp={0.8} />
      <IceField t="night" y={760} seed={3} />
      <rect x={0} y={760} width={1920} height={320} fill="#3ad08a" opacity={0.08} />
      <g transform="translate(330 820) rotate(-8) scale(0.38)"><Plane broken /></g>
      <Glow id="t3w" cx={300} cy={810} r={120} color="#f29a4a" opacity={0.45} />
      {Array.from({length: 22}, (_, i) => <ellipse key={i} cx={460 + i * 40} cy={880 + i * 3.2} rx={7} ry={3} fill="#16222c" />)}
      <g transform={`translate(${variant === 1 ? 1380 : 1360} 960) scale(0.55)`}><NoahWalk phase={0.9} outfit="parka" rim="#5af0a0" /></g>
      <ellipse cx={1390} cy={962} rx={50} ry={8} fill="#000" opacity={0.4} />
    </Svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
    <div style={{position: 'absolute', left: variant === 1 ? 90 : 0, right: variant === 1 ? undefined : 0, textAlign: variant === 1 ? 'left' : 'center', top: variant === 1 ? 120 : 90,
      fontFamily: 'Inter Display, Inter', fontWeight: 900, lineHeight: 0.9, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.85)'}}>
      <div style={{fontSize: 250, color: '#cfefff'}}>−40°C</div>
      <div style={{fontSize: 130, color: '#f4f1ea', marginTop: 10}}>STRANDED</div>
    </div>
    <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34, letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
  </AbsoluteFill>
);
