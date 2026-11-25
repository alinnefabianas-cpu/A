import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Seta} from './componentes';
import {Coracao} from './componentes';
import {GatoFrente} from './gato';

const fonte = `@font-face{font-family:Anton;src:url(${staticFile('fontes/Anton.woff2')}) format('woff2');}`;
const Brilho: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -40 Q6 -6 40 0 Q6 6 0 40 Q-6 6 -40 0 Q-6 -6 0 -40Z" fill="#ffd400" stroke="#1a1a1a" strokeWidth={4} />
);

export const Thumb: React.FC<{v: number}> = ({v}) => {
	const linhas = v === 1 ? ['DOES YOUR CAT', 'LOVE YOU?', 'SCIENCE ANSWERS'] : ['YOUR CAT', 'LOVES YOU', "HERE'S THE PROOF"];
	const L: React.CSSProperties = {fontFamily: 'Anton', fontSize: v === 1 ? 150 : 158, lineHeight: 1.08, color: '#111', letterSpacing: 1, whiteSpace: 'nowrap'};
	return (
		<AbsoluteFill style={{background: '#fff'}}>
			<style>{fonte}</style>
			<div style={{position: 'absolute', left: 70, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18}}>
				<div style={L}>{linhas[0]}</div>
				<div style={{...L, color: '#fff', background: '#e1262d', padding: '0 26px', transform: 'rotate(-2deg)'}}>{linhas[1]}</div>
				<div style={L}>{linhas[2]}</div>
			</div>
			<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
				<GatoFrente x={1480} y={1040} escala={1.75} pelagem="siames" olhos={v === 1 ? 'normal' : 'dilatado'} rabo="gancho" />
				<Coracao x={1760} y={330} t={-100} s={2.4} />
				<Coracao x={1200} y={420} t={-100} s={1.3} />
				{v === 2 && <Coracao x={1830} y={820} t={-100} s={1.2} />}
				<Seta de={{x: 1000, y: 880}} para={{x: 1200, y: 760}} t={-100} cor="#e1262d" w={16} curva={-60} />
				<Brilho x={1180} y={300} s={1.2} />
				<Brilho x={1850} y={620} />
				<Brilho x={1230} y={640} s={0.8} />
				<Brilho x={1690} y={110} s={0.7} />
			</svg>
		</AbsoluteFill>
	);
};
