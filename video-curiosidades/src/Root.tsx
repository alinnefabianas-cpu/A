import React from 'react';
import {Composition, Still} from 'remotion';
import {Banner, BannerGuia, FotoPerfil} from './Marca';
import {Longo, LINHA, ThumbLongo, FPS as FPS_LONGO} from './longo/Longo';
import {Longo2, LINHA as LINHA2} from './longo/Longo2';
import {ThumbA, ThumbB, ThumbFake} from './longo/Thumbs';
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
		<Composition id="Longo" component={Longo} durationInFrames={LINHA.total} fps={FPS_LONGO} width={1920} height={1080} />
		<Still id="ThumbLongo" component={ThumbLongo} width={1280} height={720} />
		<Composition id="Longo2" component={Longo2} durationInFrames={LINHA2.total} fps={FPS_LONGO} width={1920} height={1080} />
		<Still id="ThumbA" component={ThumbA} width={1280} height={720} />
		<Still id="ThumbB" component={ThumbB} width={1280} height={720} />
		<Still id="ThumbFake" component={ThumbFake} width={1280} height={720} />
		<Still id="FotoPerfil" component={FotoPerfil} width={800} height={800} />
		<Still id="Banner" component={Banner} width={2560} height={1440} />
		<Still id="BannerGuia" component={BannerGuia} width={2560} height={1440} />
	</>
);
