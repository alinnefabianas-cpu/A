import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Video} from './Video';
import {ALTURA, DURACAO_SHORT, DURACAO_TOTAL, FPS, LARGURA, LINHA_SHORT} from './roteiro';
import {Thumbnail} from './Thumbnail';

const ComFontes: React.FC<{short?: boolean; thumb?: boolean}> = ({short, thumb}) => {
	const [handle] = useState(() => delayRender('Carregando fontes'));
	useEffect(() => {
		const fontes = ['700 40px Cinzel', '900 40px Cinzel', '400 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '700 40px "Playfair Display"', 'italic 700 40px "Playfair Display"', '600 20px Inter', '400 20px Inter'];
		Promise.all(fontes.map((f) => document.fonts.load(f, 'ÁÇãõê…'))).then(() => continueRender(handle));
	}, [handle]);
	if (thumb) return <Thumbnail />;
	return short ? <Video linha={LINHA_SHORT} /> : <Video />;
};

export const Root: React.FC = () => (
	<>
		<Composition id="Video" component={ComFontes} durationInFrames={DURACAO_TOTAL} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="Short" component={ComFontes} defaultProps={{short: true}} durationInFrames={DURACAO_SHORT} fps={FPS} width={1080} height={1920} />
		<Composition id="Thumbnail" component={ComFontes} defaultProps={{thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
	</>
);
