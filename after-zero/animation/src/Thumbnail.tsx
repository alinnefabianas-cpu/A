import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CarSide, Glow, H, lerp, Rays, Skyline, Svg, W} from './lib';
import {NoahStandBack} from './noah';

/**
 * YouTube thumbnail: Noah, small, facing a gigantic empty city at sunrise.
 * Text: "EVERYONE IS GONE" (does not repeat the title). 1920x1080 → exported at 1280x720.
 */
export const Thumbnail: React.FC<{variant?: number}> = ({variant = 1}) => {
  const vx = variant === 1 ? 1260 : 960;
  const vy = 640;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Svg>
        <defs>
          <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1218" />
            <stop offset="0.35" stopColor="#24363d" />
            <stop offset="0.5" stopColor="#8a6a4f" />
            <stop offset="0.56" stopColor="#f2a65a" />
            <stop offset="0.62" stopColor="#ffd59a" />
            <stop offset="1" stopColor="#ffd59a" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#tsky)" />
        <Glow id="tg1" cx={vx} cy={vy - 80} r={1200} color="#ffb366" opacity={0.75} />
        <Glow id="tg2" cx={vx} cy={vy - 80} r={300} color="#fff1d6" opacity={1} />
        <circle cx={vx} cy={vy - 80} r={80} fill="#fff8ea" />
        <Rays cx={vx} cy={vy - 80} count={22} opacity={0.12} len={2200} seed={8} />
        <Skyline seed={301} baseY={vy + 10} minH={40} maxH={200} color="#9a7a62" minW={30} maxW={70} x0={vx - 420} x1={vx + 420} />
        {/* gigantic towers converging to the sun */}
        {Array.from({length: 7}, (_, i) => {
          const k = i / 7;
          const xl = lerp(-300, vx - 470, k), xr = lerp(W + 300, vx + 470, k);
          const w = lerp(300, 46, k), top = lerp(-300, 150, k), bot = lerp(H + 80, vy + 14, k);
          const col = i % 2 ? '#0e161c' : '#16232a';
          return (
            <g key={i}>
              <rect x={xl} y={top} width={w} height={bot - top} fill={col} />
              <rect x={xl + w - 7} y={top} width={7} height={bot - top} fill={C.amber} opacity={0.7} />
              <rect x={xr - w} y={top} width={w} height={bot - top} fill={col} />
              <rect x={xr - w} y={top} width={7} height={bot - top} fill={C.amber} opacity={0.7} />
            </g>
          );
        })}
        {/* empty avenue */}
        <path d={`M -400 ${H} L ${vx - 50} ${vy + 14} L ${vx + 50} ${vy + 14} L ${W + 400} ${H} Z`} fill="#1a2227" />
        <path d={`M ${vx - 40} ${vy + 14} L ${vx + 40} ${vy + 14} L ${vx + 520} ${H} L ${vx - 520} ${H} Z`} fill="#ffcf8a" opacity={0.22} />
        <path d={`M ${vx - 5} ${vy + 14} L ${vx + 5} ${vy + 14} L ${vx + 40} ${H} L ${vx - 40} ${H} Z`} fill={C.mist} opacity={0.35} />
        <CarSide x={vx - 330} y={vy + 160} s={0.6} color="#0b1115" glint={C.amber} />
        <CarSide x={vx + 420} y={vy + 250} s={0.9} color="#0b1115" glint={C.amber} flip />
        {/* Noah: small in frame but readable, long shadow toward camera */}
        <ellipse cx={vx} cy={H - 170} rx={44} ry={8} fill="#000" opacity={0.5} />
        <path d={`M ${vx - 18} ${H - 170} L ${vx + 18} ${H - 170} L ${vx + 160} ${H} L ${vx - 160} ${H} Z`} fill="#000" opacity={0.25} />
        <g transform={`translate(${vx} ${H - 170}) scale(0.58)`}><NoahStandBack /></g>
        <rect x={vx - 60} y={H - 590} width={120} height={480} fill="none" />
      </Svg>
      {/* vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)'}} />
      {/* text */}
      <div style={{position: 'absolute', left: 80, top: variant === 1 ? 150 : 70, fontFamily: 'Inter Display, Inter', fontWeight: 900,
        lineHeight: 0.92, letterSpacing: -2, textShadow: '0 8px 40px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.6)',
        ...(variant === 2 ? {left: 0, right: 0, textAlign: 'center' as const} : {})}}>
        <div style={{fontSize: variant === 1 ? 200 : 170, color: '#f4f1ea'}}>EVERYONE</div>
        <div style={{fontSize: variant === 1 ? 200 : 170, color: '#f4f1ea'}}>IS <span style={{color: '#ffb366'}}>GONE</span></div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 34, fontFamily: 'Inter Display, Inter', fontWeight: 800, fontSize: 34,
        letterSpacing: 10, color: 'rgba(244,241,234,0.85)'}}>AFTER ZERO</div>
    </AbsoluteFill>
  );
};
