import React from 'react';
import {AbsoluteFill, Composition, Sequence} from 'remotion';
import {Letterbox} from './lib';
import * as S from './scenes';
import {f, FPS, SHOTS, TOTAL_SECONDS} from './timeline';
import {EPISODES, EpisodeFull} from './Episode';
import {Thumbnail} from './Thumbnail';
import {Thumbnail2} from './Thumbnail2';
import {Thumbnail3} from './Thumbnail3';
import {Thumbnail4} from './Thumbnail4';
import {Thumbnail5} from './Thumbnail5';
import {Thumbnail6} from './Thumbnail6';
import {Thumbnail7} from './Thumbnail7';
import {Banner, ProfileA, ProfileB, ProfileC, ProfilePic} from './Branding';

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
    <Composition id="ProfileA" component={ProfileA} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="ProfileB" component={ProfileB} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="ProfileC" component={ProfileC} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="Ep7Thumb1" component={() => <Thumbnail7 variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep7Thumb2" component={() => <Thumbnail7 variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep6Thumb1" component={() => <Thumbnail6 variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep6Thumb2" component={() => <Thumbnail6 variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep5Thumb1" component={() => <Thumbnail5 variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep5Thumb2" component={() => <Thumbnail5 variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep4Thumb1" component={() => <Thumbnail4 variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep4Thumb2" component={() => <Thumbnail4 variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep3Thumb1" component={() => <Thumbnail3 variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep3Thumb2" component={() => <Thumbnail3 variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep2Thumb1" component={() => <Thumbnail2 variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Ep2Thumb2" component={() => <Thumbnail2 variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Thumb1" component={() => <Thumbnail variant={1} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Thumb2" component={() => <Thumbnail variant={2} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    {Object.entries(EPISODES).map(([id, e]) => (
      <Composition key={id} id={id} component={() => <EpisodeFull id={id} />} durationInFrames={Math.max(1, e.totalFrames)} fps={e.fps} width={1920} height={1080} />
    ))}
    <Composition id="Ep001Scene01" component={Episode} durationInFrames={f(TOTAL_SECONDS)} fps={FPS} width={1920} height={1080} />
    {SHOTS.map((s) => (
      <Composition key={s.id} id={`Shot-${s.id}`} component={() => <Single id={s.id} />}
        durationInFrames={f(s.start + s.dur) - f(s.start)} fps={FPS} width={1920} height={1080} />
    ))}
  </>
);
