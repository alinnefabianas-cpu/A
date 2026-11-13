import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/nunito/900.css';
import '@fontsource/nunito/800.css';
import {Pilotos} from './Video';
import {DURACAO_TOTAL, FPS} from './roteiro';

export const Root: React.FC = () => (
	<Composition id="Pilotos" component={Pilotos} durationInFrames={DURACAO_TOTAL} fps={FPS} width={1080} height={1920} />
);
