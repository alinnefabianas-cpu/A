import React from 'react';
import {Composition, Still} from 'remotion';
import {Banner, BannerGuia, FotoPerfil} from './Marca';
import '@fontsource/nunito/900.css';
import '@fontsource/nunito/800.css';
import {Pilotos} from './Video';
import {Elevador, CENAS_ELEVADOR} from './elevador/Elevador';
import {EPISODIOS} from './episodios/registro';
import {PlayerEpisodio} from './Episodio';
import {FPS, duracaoTotal, duracaoDe} from './roteiro';

// as props de uma composição viram JSON, então cada episódio ganha seu próprio componente
const AUTO = EPISODIOS.map((ep) => ({ep, C: () => <PlayerEpisodio ep={ep} />}));

export const Root: React.FC = () => (
	<>
		<Composition id="Pilotos" component={Pilotos} defaultProps={{lingua: 'pt' as const}} durationInFrames={duracaoTotal('pt')} fps={FPS} width={1080} height={1920} />
		<Composition id="PilotosEN" component={Pilotos} defaultProps={{lingua: 'en' as const}} durationInFrames={duracaoTotal('en')} fps={FPS} width={1080} height={1920} />
		<Composition id="Elevador" component={Elevador} durationInFrames={duracaoDe(CENAS_ELEVADOR)} fps={FPS} width={1080} height={1920} />
		{AUTO.map(({ep, C}) => (
			<Composition key={ep.id} id={ep.id} component={C} durationInFrames={duracaoDe(ep.cenas)} fps={FPS} width={1080} height={1920} />
		))}
		<Still id="FotoPerfil" component={FotoPerfil} width={800} height={800} />
		<Still id="Banner" component={Banner} width={2560} height={1440} />
		<Still id="BannerGuia" component={BannerGuia} width={2560} height={1440} />
	</>
);
