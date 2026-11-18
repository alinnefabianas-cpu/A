import React from 'react';
import {interpolate, Easing, useCurrentFrame} from 'remotion';

export const W = 1920;
export const H = 1080;

export const C = {
  midnight: '#101820',
  forest: '#263C40',
  amber: '#D58B49',
  mist: '#D5D2C7',
  ice: '#78969A',
  ink: '#0a1016',
  deep: '#162329',
  gold: '#F2B66D',
  sun: '#FFE2B0',
};

export const ease = Easing.bezier(0.45, 0, 0.55, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0..1 eased progress through the current sequence */
export const useProgress = (durFrames: number) => {
  const frame = useCurrentFrame();
  return ease(Math.min(1, Math.max(0, frame / Math.max(1, durFrames - 1))));
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, ...style}}>
    {children}
  </svg>
);

/** Camera move: scale + translate the whole stage */
export const Camera: React.FC<{
  children: React.ReactNode;
  from?: number; to?: number; x?: [number, number]; y?: [number, number]; dur: number; origin?: string;
}> = ({children, from = 1, to = 1.06, x = [0, 0], y = [0, 0], dur, origin = '50% 50%'}) => {
  const p = useProgress(dur);
  const s = lerp(from, to, p);
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: origin,
      transform: `translate(${lerp(x[0], x[1], p)}px, ${lerp(y[0], y[1], p)}px) scale(${s})`}}>
      {children}
    </div>
  );
};

export const Layer: React.FC<{children: React.ReactNode; dx?: number; dy?: number}> = ({children, dx = 0, dy = 0}) => (
  <g transform={`translate(${dx} ${dy})`}>{children}</g>
);

/** Vertical sky gradient with named stops */
export const Sky: React.FC<{id: string; stops: [number, string][]}> = ({id, stops}) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id})`} />
  </>
);

export const Glow: React.FC<{cx: number; cy: number; r: number; color: string; opacity?: number; id: string}> = ({cx, cy, r, color, opacity = 1, id}) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={opacity} />
        <stop offset="0.35" stopColor={color} stopOpacity={opacity * 0.45} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </>
);

/** God rays fanning out from a point */
export const Rays: React.FC<{cx: number; cy: number; count?: number; len?: number; color?: string; opacity?: number; seed?: number; spin?: number}> = ({
  cx, cy, count = 14, len = 1800, color = C.gold, opacity = 0.08, seed = 3, spin = 0,
}) => {
  const r = rng(seed);
  const frame = useCurrentFrame();
  const rays = Array.from({length: count}, () => ({a: r() * Math.PI * 2, w: 0.02 + r() * 0.05, o: 0.4 + r() * 0.6, ph: r() * 6}));
  return (
    <g style={{mixBlendMode: 'screen'}}>
      {rays.map((ray, i) => {
        const a = ray.a + spin * frame * 0.0006;
        const a1 = a - ray.w, a2 = a + ray.w;
        const flick = 0.75 + 0.25 * Math.sin(frame / 25 + ray.ph);
        return (
          <polygon key={i}
            points={`${cx},${cy} ${cx + Math.cos(a1) * len},${cy + Math.sin(a1) * len} ${cx + Math.cos(a2) * len},${cy + Math.sin(a2) * len}`}
            fill={color} opacity={opacity * ray.o * flick} />
        );
      })}
    </g>
  );
};

type SkylineProps = {
  seed: number; baseY: number; minH: number; maxH: number; color: string;
  minW?: number; maxW?: number; x0?: number; x1?: number;
  windows?: {color: string; prob: number; opacity?: number};
  edge?: {color: string; opacity: number; side: 'left' | 'right'};
  spires?: number;
};

/** Procedural skyline silhouette with optional windows and sun-side edge light */
export const Skyline: React.FC<SkylineProps> = ({
  seed, baseY, minH, maxH, color, minW = 50, maxW = 140, x0 = -300, x1 = W + 300, windows, edge, spires = 0.25,
}) => {
  const r = rng(seed);
  const items: React.ReactNode[] = [];
  let x = x0;
  let k = 0;
  while (x < x1) {
    const w = minW + r() * (maxW - minW);
    const h = minH + Math.pow(r(), 1.6) * (maxH - minH);
    const top = baseY - h;
    const setback = r() < 0.35;
    items.push(<rect key={`b${k}`} x={x} y={top} width={w + 1} height={h + 400} fill={color} />);
    if (setback) {
      const sw = w * (0.45 + r() * 0.3);
      const sh = h * (0.08 + r() * 0.12);
      items.push(<rect key={`s${k}`} x={x + (w - sw) / 2} y={top - sh} width={sw} height={sh + 2} fill={color} />);
      if (r() < spires) {
        items.push(<rect key={`a${k}`} x={x + w / 2 - 2} y={top - sh - 40 - r() * 60} width={4} height={120} fill={color} />);
      }
    }
    if (edge) {
      const ex = edge.side === 'left' ? x : x + w - 6;
      items.push(<rect key={`e${k}`} x={ex} y={top} width={6} height={h} fill={edge.color} opacity={edge.opacity} />);
    }
    if (windows) {
      const cols = Math.max(2, Math.floor(w / 18));
      const rows = Math.floor(h / 26);
      for (let row = 1; row < rows; row++) {
        for (let c = 0; c < cols; c++) {
          if (r() < windows.prob) {
            items.push(
              <rect key={`w${k}-${row}-${c}`} x={x + 6 + c * ((w - 12) / cols)} y={top + row * 26}
                width={Math.max(3, (w - 12) / cols - 6)} height={12} fill={windows.color} opacity={(windows.opacity ?? 0.8) * (0.4 + r() * 0.6)} />,
            );
          }
        }
      }
    }
    x += w + (r() < 0.2 ? r() * 30 : 0);
    k++;
  }
  return <g>{items}</g>;
};

/** Soft drifting fog band */
export const Fog: React.FC<{y: number; h: number; color?: string; opacity?: number; speed?: number; id: string}> = ({
  y, h, color = C.mist, opacity = 0.35, speed = 0.4, id,
}) => {
  const frame = useCurrentFrame();
  const dx = (frame * speed) % 600;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.5" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}-b`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="30" /></filter>
      </defs>
      <rect x={-200} y={y} width={W + 400} height={h} fill={`url(#${id})`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={-300 + i * 600 + dx} cy={y + h / 2 + Math.sin(i * 2.1) * h * 0.15} rx={420} ry={h * 0.35}
          fill={color} opacity={opacity * 0.55} filter={`url(#${id}-b)`} />
      ))}
    </g>
  );
};

/** Floating dust motes in a light beam */
export const Dust: React.FC<{count?: number; seed?: number; area: [number, number, number, number]; color?: string; opacity?: number}> = ({
  count = 60, seed = 9, area, color = C.gold, opacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  const [ax, ay, aw, ah] = area;
  return (
    <g style={{mixBlendMode: 'screen'}}>
      {Array.from({length: count}, (_, i) => {
        const bx = r() * aw, by = r() * ah, s = 1 + r() * 2.6, sp = 0.15 + r() * 0.35, ph = r() * 10;
        const x = ax + ((bx + Math.sin(frame / 40 + ph) * 14 + frame * sp * 0.4) % aw);
        const y = ay + ((by - frame * sp * 0.6 + ah * 10) % ah);
        return <circle key={i} cx={x} cy={y} r={s} fill={color} opacity={opacity * (0.4 + 0.6 * Math.abs(Math.sin(frame / 30 + ph)))} />;
      })}
    </g>
  );
};

/** Flock of birds flapping across the frame */
export const Birds: React.FC<{count?: number; seed?: number; x: number; y: number; vx?: number; vy?: number; scale?: number; color?: string}> = ({
  count = 9, seed = 4, x, y, vx = 2.2, vy = -0.35, scale = 1, color = '#1b2328',
}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const ox = (r() - 0.5) * 260, oy = (r() - 0.5) * 120, s = (0.6 + r() * 0.6) * scale, ph = r() * 6.28;
        const bx = x + ox + frame * vx * (0.9 + r() * 0.2);
        const by = y + oy + frame * vy + Math.sin(frame / 18 + ph) * 6;
        const flap = Math.sin(frame / 3.2 + ph) * 10;
        return (
          <path key={i} transform={`translate(${bx} ${by}) scale(${s})`}
            d={`M -16 ${-flap} Q -8 ${-flap * 0.4 - 4} 0 2 Q 8 ${-flap * 0.4 - 4} 16 ${-flap}`}
            stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        );
      })}
    </g>
  );
};

/** Simple parked/abandoned car silhouette, side view */
export const CarSide: React.FC<{x: number; y: number; s?: number; color?: string; flip?: boolean; glint?: string}> = ({x, y, s = 1, color = '#0e151b', flip, glint}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -110 0 L -110 -28 Q -104 -40 -80 -42 L -52 -44 Q -32 -72 6 -72 L 40 -72 Q 66 -70 84 -46 L 104 -42 Q 114 -38 114 -26 L 114 0 Z" fill={color} />
    {glint && <path d="M -44 -46 Q -28 -66 4 -66 L 36 -66 Q 56 -64 72 -46 Z" fill={glint} opacity={0.22} />}
    <circle cx={-66} cy={0} r={18} fill="#06090c" />
    <circle cx={70} cy={0} r={18} fill="#06090c" />
  </g>
);

export const Letterbox: React.FC<{h?: number}> = ({h = 70}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h, background: '#000'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: '#000'}} />
  </>
);

/** fade helper in frames */
export const fadeIO = (frame: number, dur: number, fin = 8, fout = 8) =>
  interpolate(frame, [0, fin, dur - fout, dur], [0, 1, 1, 0], clamp);
