import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, H, rng, W} from '../lib';

export type Time = 'dawn' | 'day' | 'dusk' | 'night' | 'rain';

export type SetProps = {
  dur: number;
  p: Record<string, any>;
  /** frames (relative to shot) during which the on-screen character is speaking */
  talk?: {from: number; to: number; speaker: string} | null;
};

export const SKY: Record<Time, [number, string][]> = {
  dawn: [[0, '#0d151c'], [0.18, '#22343b'], [0.38, '#6a8486'], [0.52, '#d2925a'], [0.64, '#f2b86e'], [1, '#f6c98a']],
  day: [[0, '#3a5560'], [0.35, '#6f8e94'], [0.6, '#b9c6c0'], [0.8, '#dcd8c8'], [1, '#e9e3d2']],
  dusk: [[0, '#0f141d'], [0.25, '#262c3a'], [0.45, '#6b4747'], [0.58, '#c46f40'], [0.7, '#e2914f'], [1, '#e9a463']],
  night: [[0, '#04070a'], [0.5, '#0b141b'], [0.8, '#13212a'], [1, '#1a2b33']],
  rain: [[0, '#222c31'], [0.5, '#46545a'], [0.8, '#66757a'], [1, '#7c898b']],
};

/** colors for skyline layers far→near, edge light, window light */
export const TONES: Record<Time, {far: string; mid: string; near: string; edge: string; edgeO: number; win: string; winP: number; sun: string; sunO: number; fog: string}> = {
  dawn: {far: '#7d8f8f', mid: '#41545a', near: '#1a252b', edge: C.amber, edgeO: 0.55, win: '#f2b66d', winP: 0.05, sun: C.gold, sunO: 0.55, fog: '#f1d2a8'},
  day: {far: '#9fb0ae', mid: '#5f7479', near: '#2c3a40', edge: '#e8e2d0', edgeO: 0.35, win: '#9fb4b8', winP: 0.12, sun: '#fff6e0', sunO: 0.35, fog: '#e6e6dc'},
  dusk: {far: '#8a6c62', mid: '#3e3a44', near: '#16181f', edge: '#e2914f', edgeO: 0.6, win: '#f2b66d', winP: 0.14, sun: '#f0a060', sunO: 0.55, fog: '#d99a70'},
  night: {far: '#1c2a33', mid: '#121c23', near: '#080d11', edge: '#78969A', edgeO: 0.15, win: '#f2c27d', winP: 0.0, sun: '#9fc0d0', sunO: 0.15, fog: '#2a3a44'},
  rain: {far: '#6d7b7e', mid: '#3c494e', near: '#1c2529', edge: '#a9b8ba', edgeO: 0.2, win: '#c9b48c', winP: 0.03, sun: '#dfe6e4', sunO: 0.15, fog: '#9aa6a6'},
};

export const Rain: React.FC<{count?: number; seed?: number; opacity?: number; angle?: number}> = ({count = 220, seed = 5, opacity = 0.35, angle = 8}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <g opacity={opacity}>
      {Array.from({length: count}, (_, i) => {
        const x0 = r() * (W + 200) - 100, sp = 28 + r() * 22, len = 30 + r() * 40, ph = r() * H;
        const y = (ph + frame * sp) % (H + 100) - 80;
        const x = x0 + (y * angle) / 100;
        return <line key={i} x1={x} y1={y} x2={x + (len * angle) / 100} y2={y + len} stroke="#cfd8da" strokeWidth={1.6} />;
      })}
    </g>
  );
};

export const Stars: React.FC<{count?: number; seed?: number; maxY?: number; opacity?: number}> = ({count = 260, seed = 12, maxY = 700, opacity = 1}) => {
  const frame = useCurrentFrame();
  const r = rng(seed);
  return (
    <g opacity={opacity}>
      {Array.from({length: count}, (_, i) => {
        const x = r() * W, y = r() * maxY, s = 0.6 + Math.pow(r(), 3) * 2.4, ph = r() * 6;
        return <circle key={i} cx={x} cy={y} r={s} fill="#e8eef2" opacity={0.35 + 0.65 * Math.abs(Math.sin(frame / 40 + ph))} />;
      })}
    </g>
  );
};

/** a simple seeded camera move so repeated sets never look identical */
export const camFor = (seed = 1, strength = 1) => {
  const r = rng(seed * 97 + 13);
  const kind = Math.floor(r() * 4);
  const s = 0.07 * strength;
  if (kind === 0) return {from: 1.0, to: 1 + s, x: [0, 0] as [number, number]};
  if (kind === 1) return {from: 1 + s, to: 1.0, x: [0, 0] as [number, number]};
  if (kind === 2) return {from: 1.06, to: 1.06, x: [50 * strength, -50 * strength] as [number, number]};
  return {from: 1.06, to: 1.06, x: [-50 * strength, 50 * strength] as [number, number]};
};

/** mouth amplitude 0..1 for crude lip-sync while a speaker talks */
export const mouth = (frame: number, talk?: SetProps['talk'], who?: string) => {
  if (!talk || (who && talk.speaker !== who) || frame < talk.from || frame > talk.to) return 0;
  const v = Math.abs(Math.sin(frame * 0.9) * 0.6 + Math.sin(frame * 1.7 + 1) * 0.4);
  return v;
};
