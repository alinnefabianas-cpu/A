import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Video} from './Video';
import {ALTURA, DURACAO_SHORT, DURACAO_TOTAL, FPS, LARGURA, LINHA_SHORT} from './roteiro';
import {Thumbnail} from './Thumbnail';
import {CONFIG_NARCISISTA, DURACAO_NARCISISTA, LINHA_NARCISISTA} from './episodios/narcisista';
import {COR} from './tema';
import {DURACAO_REELS, Reels} from './reels/Reels';
import {DURACAO_REELS2, Reels2} from './reels/Reels2';

const ComFontes: React.FC<{short?: boolean; thumb?: boolean; ep?: 'narcisista'; reels?: boolean; reels2?: boolean}> = ({short, thumb, ep, reels, reels2}) => {
	const [handle] = useState(() => delayRender('Carregando fontes'));
	useEffect(() => {
		const fontes = ['700 40px Cinzel', '900 40px Cinzel', '400 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '700 40px "Playfair Display"', 'italic 700 40px "Playfair Display"', '600 20px Inter', '400 20px Inter'];
		Promise.all(fontes.map((f) => document.fonts.load(f, 'ÁÇãõê…'))).then(() => continueRender(handle));
	}, [handle]);
	if (reels) return <Reels />;
	if (reels2) return <Reels2 />;
	if (thumb && ep === 'narcisista')
		return (
			<Thumbnail
				tag="6 SINAIS EM 5 MINUTOS"
				figura="coroa"
				linhas={[
					['ELE', COR.creme],
					['SÓ AMA', COR.vermelho, 128],
					['A SI', COR.creme],
					['MESMO.', COR.creme],
				]}
			/>
		);
	if (thumb) return <Thumbnail />;
	if (ep === 'narcisista') return <Video linha={LINHA_NARCISISTA} episodio={CONFIG_NARCISISTA} />;
	return short ? <Video linha={LINHA_SHORT} /> : <Video />;
};

export const Root: React.FC = () => (
	<>
		<Composition id="Video" component={ComFontes} durationInFrames={DURACAO_TOTAL} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="Short" component={ComFontes} defaultProps={{short: true}} durationInFrames={DURACAO_SHORT} fps={FPS} width={1080} height={1920} />
		<Composition id="Thumbnail" component={ComFontes} defaultProps={{thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
		<Composition id="Narcisista" component={ComFontes} defaultProps={{ep: 'narcisista'}} durationInFrames={DURACAO_NARCISISTA} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="ThumbNarcisista" component={ComFontes} defaultProps={{ep: 'narcisista', thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
		<Composition id="ReelsEditora" component={ComFontes} defaultProps={{reels: true}} durationInFrames={DURACAO_REELS} fps={FPS} width={1080} height={1920} />
		<Composition id="ReelsServicos" component={ComFontes} defaultProps={{reels2: true}} durationInFrames={DURACAO_REELS2} fps={FPS} width={1080} height={1920} />
	</>
);
