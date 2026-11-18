// Shot timing (seconds) — mirrors config/episode_001_poc.json so the existing
// narration, subtitles and sound design line up 1:1.
export const FPS = 30;

export type ShotId =
  | 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06' | 'S07'
  | 'S08' | 'S09' | 'S10' | 'S11' | 'S12' | 'S13';

export const SHOTS: {id: ShotId; start: number; dur: number}[] = [
  {id: 'S01', start: 0.0, dur: 5.0},
  {id: 'S02', start: 5.0, dur: 2.5},
  {id: 'S03', start: 7.5, dur: 6.25},
  {id: 'S04', start: 13.75, dur: 4.65},
  {id: 'S05', start: 18.4, dur: 3.6},
  {id: 'S06', start: 22.0, dur: 5.6},
  {id: 'S07', start: 27.6, dur: 5.6},
  {id: 'S08', start: 33.2, dur: 5.0},
  {id: 'S09', start: 38.2, dur: 2.9},
  {id: 'S10', start: 41.1, dur: 2.2},
  {id: 'S11', start: 43.3, dur: 5.3},
  {id: 'S12', start: 48.6, dur: 5.0},
  {id: 'S13', start: 53.6, dur: 8.4},
];

export const TOTAL_SECONDS = 62.0;
export const f = (s: number) => Math.round(s * FPS);
