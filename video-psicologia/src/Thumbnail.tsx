import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COR, FONTE} from './tema';
import {BUSTO} from './visuais/Visuais';

// Thumbnail 1280x720: silhueta controlada por fios + frase curta de alto contraste
export const Thumbnail: React.FC = () => {
	const hx = 930; // centro da cabeça
	const hy = 330;
	const s = 2.6;
	const barraY = 60;
	const ponto = (x: number, y: number) => ({x: hx + (x - 100) * s, y: hy + (y - 75) * s});
	const alvos = [ponto(25, 205), ponto(78, 26), ponto(122, 26), ponto(175, 205)];
	const ang = (-5 * Math.PI) / 180;
	const naBarra = (x: number) => ({x, y: barraY + (x - hx) * Math.tan(ang)});
	const origens = [naBarra(hx - 250), naBarra(hx - 70), naBarra(hx + 70), naBarra(hx + 250)];
		return (
		<AbsoluteFill style={{background: '#060505', overflow: 'hidden'}}>
			<AbsoluteFill style={{background: `radial-gradient(circle at ${hx}px ${hy}px, rgba(208,31,42,0.55) 0%, rgba(92,11,16,0.35) 25%, rgba(0,0,0,0) 55%)`}} />
			<svg width={1280} height={720} style={{position: 'absolute'}}>
				<defs>
					<filter id="g" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="4" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				{/* barra da marionete */}
				<rect x={hx - 300} y={barraY - 10} width={600} height={20} rx={5} fill="#120d0d" stroke={COR.creme} strokeWidth={2} transform={`rotate(-5 ${hx} ${barraY})`} />
				{alvos.map((a, i) => (
					<line key={i} x1={origens[i].x} y1={origens[i].y} x2={a.x} y2={a.y} stroke={COR.vermelho} strokeWidth={2.5} filter="url(#g)" />
				))}
				{/* silhueta */}
				<g transform={`translate(${hx} ${hy}) scale(${s}) translate(-100 -75)`}>
					<path d={BUSTO} fill="#030202" stroke={COR.vermelho} strokeWidth={1.4} filter="url(#g)" />
				</g>
				{/* olhos */}
				<g filter="url(#g)">
					<ellipse cx={hx - 46} cy={hy - 5} rx={16} ry={6} fill="#ff3b3b" />
					<ellipse cx={hx + 46} cy={hy - 5} rx={16} ry={6} fill="#ff3b3b" />
				</g>
				{alvos.map((a, i) => (
					<circle key={'n' + i} cx={a.x} cy={a.y} r={5} fill={COR.vermelho} />
				))}
			</svg>
			{/* texto */}
			<div style={{position: 'absolute', left: 56, top: 120, display: 'flex', flexDirection: 'column'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
					<div style={{width: 46, height: 4, background: COR.vermelho}} />
					<span style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 24, letterSpacing: 6, color: COR.vermelho}}>7 TÁTICAS</span>
				</div>
				{[
					['ELE', COR.creme],
					['SABE', COR.vermelho],
					['O QUE', COR.creme],
					['FAZ.', COR.creme],
				].map(([t, c]) => (
					<div
						key={t}
						style={{
							fontFamily: FONTE.titulo,
							fontWeight: 900,
							fontSize: t === 'SABE' ? 150 : 108,
							lineHeight: 0.98,
							color: c,
							letterSpacing: 2,
							textShadow: c === COR.vermelho ? '0 0 40px rgba(208,31,42,0.8), 0 6px 0 #000' : '0 6px 0 #000, 0 0 30px rgba(0,0,0,0.9)',
						}}
					>
						{t}
					</div>
				))}
			</div>
			{/* grão + vinheta */}
			<Img src={staticFile('grao.png')} style={{display: 'none'}} />
			<AbsoluteFill style={{backgroundImage: `url(${staticFile('grao.png')})`, opacity: 0.08, mixBlendMode: 'screen'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)'}} />
		</AbsoluteFill>
	);
};
