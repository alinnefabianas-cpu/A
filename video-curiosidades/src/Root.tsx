import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/nunito/900.css';
import '@fontsource/nunito/800.css';
import {Pilotos} from './Video';
import {Elevador, CENAS_ELEVADOR} from './elevador/Elevador';
import {FPS, duracaoTotal, duracaoDe} from './roteiro';

export const Root: React.FC = () => (
	<>
		<Composition id="Pilotos" component={Pilotos} defaultProps={{lingua: 'pt' as const}} durationInFrames={duracaoTotal('pt')} fps={FPS} width={1080} height={1920} />
		<Composition id="PilotosEN" component={Pilotos} defaultProps={{lingua: 'en' as const}} durationInFrames={duracaoTotal('en')} fps={FPS} width={1080} height={1920} />
		<Composition id="Elevador" component={Elevador} durationInFrames={duracaoDe(CENAS_ELEVADOR)} fps={FPS} width={1080} height={1920} />
	</>
);
