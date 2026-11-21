import React from 'react';
import {AbsoluteFill, Composition, Sequence} from 'remotion';
import {Letterbox} from './lib';
import * as S from './scenes';
import {f, FPS, SHOTS, TOTAL_SECONDS} from './timeline';
import {EPISODE, EpisodeFull} from './Episode';
import {Thumbnail} from './Thumbnail';
import {Banner, ProfilePic} from './Branding';

const TITLE = 'WHAT IF YOU WERE THE LAST HUMAN ON EARTH?';

const Episode: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SHOTS.map((s) => {
      const from = f(s.start);
      const dur = f(s.start + s.dur) - from;
      const Comp = (S as Record<string, React.FC<any>>)[s.id];
      return (
        <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
          <Comp dur={dur} title={TITLE} />
        </Sequence>
      );
    })}
    <Letterbox h={60} />
  </AbsoluteFill>
);

/** Single shot preview: <id>-only composition for quick review */
const Single: React.FC<{id: string}> = ({id}) => {
  const s = SHOTS.find((x) => x.id === id)!;
  const dur = f(s.start + s.dur) - f(s.start);
  const Comp = (S as Record<string, React.FC<any>>)[id];
  return <AbsoluteFill style={{background: '#000'}}><Comp dur={dur} title={TITLE} /><Letterbox h={60} /></AbsoluteFill>;
};

export const Root: React.FC = () => (
  <>
    <Composition id="ProfilePic" component={ProfilePic} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="Thumb1" component={() => <Thumbnail variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Thumb2" component={() => <Thumbnail variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep001Full" component={EpisodeFull} durationInFrames={EPISODE.totalFrames} fps={EPISODE.fps} width={1920} height={1080} />
    <Composition id="Ep001Scene01" component={Episode} durationInFrames={f(TOTAL_SECONDS)} fps={FPS} width={1920} height={1080} />
    {SHOTS.map((s) => (
      <Composition key={s.id} id={`Shot-${s.id}`} component={() => <Single id={s.id} />}
        durationInFrames={f(s.start + s.dur) - f(s.start)} fps={FPS} width={1920} height={1080} />
    ))}
  </>
);
