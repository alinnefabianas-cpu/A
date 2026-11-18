import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COR, FONTE} from './tema';
import {BUSTO} from './visuais/Visuais';

// Thumbnail 1280x720: silhueta controlada por fios + frase curta de alto contraste
type Linha = [string, string, number?];
export type PropsThumb = {tag?: string; linhas?: Linha[]; figura?: 'marionete' | 'coroa' | 'gaiola' | 'cerebro' | 'mascaras'};
const PADRAO: Linha[] = [
	['ELE', COR.creme],
	['SABE', COR.vermelho, 150],
	['O QUE', COR.creme],
	['FAZ.', COR.creme],
];

export const Thumbnail: React.FC<PropsThumb> = ({tag = '7 TÁTICAS', linhas = PADRAO, figura = 'marionete'}) => {
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
				{figura === 'marionete' && (<>
				{/* barra da marionete */}
				<rect x={hx - 300} y={barraY - 10} width={600} height={20} rx={5} fill="#120d0d" stroke={COR.creme} strokeWidth={2} transform={`rotate(-5 ${hx} ${barraY})`} />
				{alvos.map((a, i) => (
					<line key={i} x1={origens[i].x} y1={origens[i].y} x2={a.x} y2={a.y} stroke={COR.vermelho} strokeWidth={2.5} filter="url(#g)" />
				))}
				</>)}
				{figura === 'coroa' && (
					<g transform={`translate(${hx + 10} ${hy - 200}) rotate(-8) scale(0.52)`} filter="url(#g)">
						<path d="M-170 60 L-200 -90 L-100 -10 L0 -130 L100 -10 L200 -90 L170 60 Z" fill="#1a1205" stroke={COR.ouro} strokeWidth={6} />
						<rect x={-170} y={60} width={340} height={40} fill="#1a1205" stroke={COR.ouro} strokeWidth={6} />
						<circle cx={0} cy={-140} r={18} fill={COR.vermelho} />
						<circle cx={-200} cy={-100} r={14} fill={COR.vermelho} />
						<circle cx={200} cy={-100} r={14} fill={COR.vermelho} />
					</g>
				)}
				{figura === 'gaiola' && <circle cx={hx + 380} cy={hy} r={330} fill="#fff1d6" opacity={0.22} filter="url(#g)" />}
				{/* silhueta */}
				<g transform={`translate(${hx} ${hy}) scale(${s}) translate(-100 -75)`}>
					<path d={BUSTO} fill="#030202" stroke={figura === "gaiola" ? COR.creme : figura === "cerebro" ? COR.cinza : COR.vermelho} strokeWidth={1.4} filter="url(#g)" />
				</g>
				{figura === 'gaiola' && (
					<g>
						{/* grades (com vão onde ficava a porta) */}
						{Array.from({length: 5}).map((_, i) => {
							const x = hx - 250 + i * 70;
							return <line key={i} x1={x} y1={hy - 300 + Math.abs(i - 3) * 14} x2={x} y2={720} stroke={COR.creme} strokeOpacity={0.85} strokeWidth={6} />;
						})}
						<path d={`M${hx - 270} ${hy - 255} Q${hx} ${hy - 400} ${hx + 270} ${hy - 255}`} fill="none" stroke={COR.creme} strokeOpacity={0.85} strokeWidth={6} />
						{/* porta aberta para fora, presa na dobradiça */}
						<path
							d={`M${hx + 110} ${hy - 300} L${hx + 300} ${hy - 360} L${hx + 300} 760 L${hx + 110} 720 Z M${hx + 173} ${hy - 320} L${hx + 173} 733 M${hx + 236} ${hy - 340} L${hx + 236} 746`}
							fill="none"
							stroke={COR.vermelho}
							strokeWidth={6}
							strokeLinejoin="round"
							filter="url(#g)"
						/>
					</g>
				)}
				{figura === 'cerebro' && (
					<g>
						{/* cérebro brilhando dentro da cabeça, com uma região vermelha "viciada" */}
						<g transform={`translate(${hx} ${hy - 25}) scale(0.78)`}>
							{[[-40, -10, 62], [30, -22, 66], [62, 22, 46], [0, 30, 58], [-62, 26, 42]].map(([x, y, r], i) => (
								<circle key={i} cx={x} cy={y} r={r} fill="none" stroke={COR.creme} strokeOpacity={0.75} strokeWidth={3} />
							))}
							<circle cx={-10} cy={0} r={46} fill={COR.vermelho} opacity={0.75} filter="url(#g)" />
							<circle cx={-10} cy={0} r={20} fill="#ffb0b0" opacity={0.9} filter="url(#g)" />
						</g>
						{/* fios ligando a região a um celular */}
						<path d={`M${hx - 8} ${hy - 25} C${hx + 140} ${hy - 120} ${hx + 200} ${hy + 20} ${hx + 225} ${hy + 90}`} fill="none" stroke={COR.vermelho} strokeWidth={4} strokeDasharray="10 10" filter="url(#g)" />
						<rect x={hx + 190} y={hy + 90} width={90} height={160} rx={14} fill="#0a0808" stroke={COR.creme} strokeWidth={3} />
						<circle cx={hx + 265} cy={hy + 100} r={16} fill={COR.vermelho} filter="url(#g)" />
					</g>
				)}
				{figura === 'mascaras' && (
					<g>
						{[[-215, -110, 0.48, false], [-100, -205, 0.52, false], [115, -205, 0.52, true], [230, -110, 0.48, false]].map(([dx, dy, sc, red], i) => (
							<g key={i} transform={`translate(${hx + (dx as number)} ${hy + (dy as number)}) scale(${sc}) rotate(${(dx as number) / 18})`}>
								<path d="M0 -130 C 90 -130 115 -60 110 0 C 105 70 60 135 0 140 C -60 135 -105 70 -110 0 C -115 -60 -90 -130 0 -130 Z" fill={red ? '#2a0a0d' : '#d8d1c3'} stroke={red ? COR.vermelho : COR.creme} strokeWidth={5} filter={red ? 'url(#g)' : undefined} />
								<ellipse cx={-40} cy={-20} rx={22} ry={11} fill="#050505" />
								<ellipse cx={40} cy={-20} rx={22} ry={11} fill="#050505" />
								<path d={red ? 'M-40 40 Q0 75 40 40' : 'M-35 50 L35 50'} fill="none" stroke={red ? COR.vermelho : '#3a3430'} strokeWidth={7} strokeLinecap="round" />
							</g>
						))}
					</g>
				)}
				{/* olhos */}
				<g filter="url(#g)" opacity={figura === 'gaiola' || figura === 'cerebro' ? 0 : 1}>
					<ellipse cx={hx - 46} cy={hy - 5} rx={16} ry={6} fill="#ff3b3b" />
					<ellipse cx={hx + 46} cy={hy - 5} rx={16} ry={6} fill="#ff3b3b" />
				</g>
				{figura === 'marionete' && alvos.map((a, i) => (
					<circle key={'n' + i} cx={a.x} cy={a.y} r={5} fill={COR.vermelho} />
				))}
			</svg>
			{/* texto */}
			<div style={{position: 'absolute', left: 56, top: 120, display: 'flex', flexDirection: 'column'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}>
					<div style={{width: 46, height: 4, background: COR.vermelho}} />
					<span style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 24, letterSpacing: 6, color: COR.vermelho}}>{tag}</span>
				</div>
				{linhas.map(([t, c, tam]) => (
					<div
						key={t}
						style={{
							fontFamily: FONTE.titulo,
							fontWeight: 900,
							fontSize: tam ?? 108,
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
