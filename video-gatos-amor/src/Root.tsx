import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Video} from './Video';
import {Thumb} from './Thumb';
import {ALTURA, DURACAO_TOTAL, FPS, LARGURA} from './roteiro';

const ComFontes: React.FC = () => {
	const [handle] = useState(() => delayRender('Carregando fontes'));
	useEffect(() => {
		const fontes = ['700 40px Caveat', '40px "Patrick Hand"'];
		Promise.all(fontes.map((f) => document.fonts.load(f, 'Aa?!'))).then(() => continueRender(handle));
	}, [handle]);
	return <Video />;
};

export const Root: React.FC = () => (
	<>
	<Composition id="Video" component={ComFontes} durationInFrames={DURACAO_TOTAL} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={LARGURA} height={ALTURA} defaultProps={{v: 1}} />
	</>
);
