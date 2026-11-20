import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Letterbox} from './lib';
import {SETS} from './sets/registry';
import episode from './episode.json';

type Shot = {from: number; dur: number; visual: string; p: Record<string, any>; talk?: {from: number; to: number; speaker: string} | null};

export const EPISODE = episode as {fps: number; totalFrames: number; shots: Shot[]};

export const EpisodeFull: React.FC<{only?: number[]}> = ({only}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {EPISODE.shots.map((s, i) => {
      if (only && !only.includes(i)) return null;
      const Comp = SETS[s.visual];
      if (!Comp) throw new Error(`unknown visual ${s.visual}`);
      return (
        <Sequence key={i} from={s.from} durationInFrames={s.dur} name={`${i}:${s.visual}`}>
          <Comp dur={s.dur} p={s.p} talk={s.talk} />
        </Sequence>
      );
    })}
    <Letterbox h={60} />
  </AbsoluteFill>
);
