import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Video} from './Video';
import {ALTURA, DURACAO_TOTAL, FPS, LARGURA} from './roteiro';

const ComFontes: React.FC = () => {
	const [handle] = useState(() => delayRender('Carregando fontes'));
	useEffect(() => {
		const fontes = ['800 40px "Baloo 2"', '600 20px Inter'];
		Promise.all(fontes.map((f) => document.fonts.load(f, 'ÁÇãõê'))).then(() => continueRender(handle));
	}, [handle]);
	return <Video />;
};

export const Root: React.FC = () => (
	<Composition id="Video" component={ComFontes} durationInFrames={DURACAO_TOTAL} fps={FPS} width={LARGURA} height={ALTURA} />
);
