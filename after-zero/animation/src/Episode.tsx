import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Letterbox} from './lib';
import {SETS} from './sets/registry';
import ep1 from './episodes/episode_001.json';
import ep2 from './episodes/episode_002.json';
import ep3 from './episodes/episode_003.json';
import ep4 from './episodes/episode_004.json';

type Shot = {from: number; dur: number; visual: string; p: Record<string, any>; talk?: {from: number; to: number; speaker: string} | null};
export type EpisodeData = {fps: number; totalFrames: number; shots: Shot[]};

export const EPISODES: Record<string, EpisodeData> = {
  Ep001Full: ep1 as EpisodeData,
  Ep002Full: ep2 as EpisodeData,
  Ep003Full: ep3 as EpisodeData,
  Ep004Full: ep4 as EpisodeData,
};
/** kept for stills.mjs / older code */
export const EPISODE = EPISODES.Ep001Full;

export const EpisodeFull: React.FC<{id?: string; only?: number[]}> = ({id = 'Ep001Full', only}) => {
  const data = EPISODES[id];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {data.shots.map((s, i) => {
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
};
