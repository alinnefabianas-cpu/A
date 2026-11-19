import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {Video} from './Video';
import {ALTURA, DURACAO_SHORT, DURACAO_TOTAL, FPS, LARGURA, LINHA_SHORT} from './roteiro';
import {Thumbnail} from './Thumbnail';
import {CONFIG_NARCISISTA, DURACAO_NARCISISTA, LINHA_NARCISISTA} from './episodios/narcisista';
import {CONFIG_LIBERDADE, DURACAO_LIBERDADE, LINHA_LIBERDADE} from './episodios/liberdade';
import {CONFIG_CEREBRO, DURACAO_CEREBRO, LINHA_CEREBRO} from './episodios/cerebro';
import {CONFIG_TIPOS, DURACAO_TIPOS, LINHA_TIPOS} from './episodios/tipos';
import {CONFIG_FRASES, DURACAO_FRASES, LINHA_FRASES} from './episodios/frases';
import {COR} from './tema';
import {DURACAO_REELS, Reels} from './reels/Reels';
import {DURACAO_REELS2, Reels2} from './reels/Reels2';
import {Apresentacao, DURACAO_APRESENTACAO} from './reels/Apresentacao';

const ComFontes: React.FC<{short?: boolean; thumb?: boolean; ep?: 'narcisista' | 'liberdade' | 'cerebro' | 'tipos' | 'frases'; reels?: boolean; reels2?: boolean; gabi?: boolean}> = ({short, thumb, ep, reels, reels2, gabi}) => {
	const [handle] = useState(() => delayRender('Carregando fontes'));
	useEffect(() => {
		const fontes = ['700 40px Cinzel', '900 40px Cinzel', '400 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '700 40px "Playfair Display"', 'italic 700 40px "Playfair Display"', '600 20px Inter', '400 20px Inter', '800 20px Inter', '900 20px Inter'];
		Promise.all(fontes.map((f) => document.fonts.load(f, 'ÁÇãõê…'))).then(() => continueRender(handle));
	}, [handle]);
	if (reels) return <Reels />;
	if (reels2) return <Reels2 />;
	if (gabi) return <Apresentacao />;
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
	if (thumb && ep === 'liberdade')
		return (
			<Thumbnail
				tag="6 PASSOS PARA SAIR"
				figura="gaiola"
				linhas={[
					['A PORTA', COR.creme],
					['SEMPRE', COR.creme],
					['ESTEVE', COR.creme],
					['ABERTA.', COR.vermelho, 128],
				]}
			/>
		);
	if (thumb && ep === 'cerebro')
		return (
			<Thumbnail
				tag="O QUE ACONTECE DENTRO DE VOCÊ"
				figura="cerebro"
				linhas={[
					['SEU', COR.creme],
					['CÉREBRO', COR.creme],
					['ESTÁ', COR.creme],
					['VICIADO.', COR.vermelho, 128],
				]}
			/>
		);
	if (thumb && ep === 'tipos')
		return (
			<Thumbnail
				tag="OS 5 TIPOS DE MANIPULADOR"
				figura="mascaras"
				linhas={[
					['QUAL', COR.creme],
					['DELES', COR.creme],
					['ESTÁ NA', COR.creme],
					['SUA VIDA?', COR.vermelho, 118],
				]}
			/>
		);
	if (thumb && ep === 'frases')
		return (
			<Thumbnail
				tag="10 FRASES DE MANIPULADOR"
				figura="balao"
				linhas={[
					['SE ELE', COR.creme],
					['DISSE', COR.creme],
					['ISSO…', COR.creme],
					['CORRA.', COR.vermelho, 140],
				]}
			/>
		);
	if (thumb) return <Thumbnail />;
	if (ep === 'frases') return <Video linha={LINHA_FRASES} episodio={CONFIG_FRASES} />;
	if (ep === 'tipos') return <Video linha={LINHA_TIPOS} episodio={CONFIG_TIPOS} />;
	if (ep === 'cerebro') return <Video linha={LINHA_CEREBRO} episodio={CONFIG_CEREBRO} />;
	if (ep === 'liberdade') return <Video linha={LINHA_LIBERDADE} episodio={CONFIG_LIBERDADE} />;
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
		<Composition id="Liberdade" component={ComFontes} defaultProps={{ep: 'liberdade'}} durationInFrames={DURACAO_LIBERDADE} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="ThumbLiberdade" component={ComFontes} defaultProps={{ep: 'liberdade', thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
		<Composition id="Cerebro" component={ComFontes} defaultProps={{ep: 'cerebro'}} durationInFrames={DURACAO_CEREBRO} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="ThumbCerebro" component={ComFontes} defaultProps={{ep: 'cerebro', thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
		<Composition id="Tipos" component={ComFontes} defaultProps={{ep: 'tipos'}} durationInFrames={DURACAO_TIPOS} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="ThumbTipos" component={ComFontes} defaultProps={{ep: 'tipos', thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
		<Composition id="Frases" component={ComFontes} defaultProps={{ep: 'frases'}} durationInFrames={DURACAO_FRASES} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="ThumbFrases" component={ComFontes} defaultProps={{ep: 'frases', thumb: true}} durationInFrames={1} fps={FPS} width={1280} height={720} />
		<Composition id="ReelsEditora" component={ComFontes} defaultProps={{reels: true}} durationInFrames={DURACAO_REELS} fps={FPS} width={1080} height={1920} />
		<Composition id="ReelsServicos" component={ComFontes} defaultProps={{reels2: true}} durationInFrames={DURACAO_REELS2} fps={FPS} width={1080} height={1920} />
		<Composition id="ApresentacaoGabi" component={ComFontes} defaultProps={{gabi: true}} durationInFrames={DURACAO_APRESENTACAO} fps={FPS} width={1080} height={1920} />
	</>
);
