import React from 'react';
import {Composition} from 'remotion';
import {Apresentacao, DURACAO} from './Apresentacao';
import {ApresentacaoPausada, DURACAO_PAUSADA} from './Pausada';
import {Apaixonadas, DURACAO_APAIXONADAS} from './Apaixonadas';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Apresentacao" component={Apresentacao} durationInFrames={DURACAO} fps={30} width={1920} height={1080} />
    <Composition
      id="Pausada"
      component={ApresentacaoPausada}
      durationInFrames={DURACAO_PAUSADA}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition id="Apaixonadas" component={Apaixonadas} durationInFrames={DURACAO_APAIXONADAS} fps={30} width={1920} height={1080} />
  </>
);
