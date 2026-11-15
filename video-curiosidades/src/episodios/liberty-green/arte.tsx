import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

// cor do cobre ao longo do tempo: 0 = novo (brilhante), 0.33 = marrom escuro, 0.66 = fosco, 1 = verde
const PARADAS = [
	[0, [214, 128, 72]],
	[0.33, [110, 64, 42]],
	[0.66, [96, 104, 84]],
	[1, [118, 188, 160]],
] as const;
export const corCobre = (t: number, claro = 0) => {
	const v = Math.max(0, Math.min(1, t));
	let i = 0;
	while (i < PARADAS.length - 2 && v > PARADAS[i + 1][0]) i++;
	const [a, ca] = PARADAS[i];
	const [b, cb] = PARADAS[i + 1];
	const k = (v - a) / (b - a);
	const c = ca.map((x, j) => Math.round(x + (cb[j] - x) * k + claro * 255 * 0.25));
	return `rgb(${c.map((x) => Math.min(255, x)).join(',')})`;
};

// ---------- a estátua (desenho próprio, simplificado) ----------
export const Estatua: React.FC<{idade: number; brilho?: number; escudo?: number}> = ({idade, brilho = 0, escudo = 0}) => {
	const f = useCurrentFrame();
	const c = corCobre(idade), cl = corCobre(idade, 1), cs = corCobre(idade, -0.6);
	return (
		<g>
			{escudo > 0 && <ellipse cx={0} cy={-520} rx={380 * escudo} ry={720 * escudo} fill="rgba(120,220,255,0.18)" stroke="#9fe6ff" strokeWidth={10} opacity={0.6 + 0.4 * Math.sin(f / 5)} />}
			{/* túnica */}
			<path d="M-150 0 C-170 -300 -150 -600 -60 -760 L60 -760 C150 -600 170 -300 150 0Z" fill={c} stroke={CONTORNO} strokeWidth={10} />
			{[-100, -40, 30, 95].map((x, i) => <path key={i} d={`M${x} -20 C${x - 10} -250 ${x + 15} -450 ${x * 0.5} -700`} stroke={cs} strokeWidth={10} fill="none" />)}
			<path d="M-150 -380 C-60 -420 60 -420 150 -360" stroke={cs} strokeWidth={14} fill="none" />
			{/* braço erguido com a tocha */}
			<path d="M50 -720 L110 -1000" stroke={CONTORNO} strokeWidth={70} strokeLinecap="round" />
			<path d="M50 -720 L110 -1000" stroke={c} strokeWidth={52} strokeLinecap="round" />
			<rect x={88} y={-1110} width={48} height={110} rx={10} fill={c} stroke={CONTORNO} strokeWidth={8} />
			<path d="M70 -1110 H154 L140 -1140 H84Z" fill={c} stroke={CONTORNO} strokeWidth={7} />
			<path d={`M112 -1140 C80 -1190 90 -1240 112 -${1290 + Math.sin(f / 3) * 10} C134 -1240 144 -1190 112 -1140Z`} fill="#ffd23f" stroke={CONTORNO} strokeWidth={7} />
			{/* tábua */}
			<path d="M-140 -560 L-60 -540 L-80 -380 L-160 -400Z" fill={cl} stroke={CONTORNO} strokeWidth={8} />
			<text x={-112} y={-460} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={22} fill={CONTORNO} transform="rotate(12 -112 -460)">JULY IV</text>
			{/* cabeça e coroa */}
			<ellipse cx={0} cy={-830} rx={70} ry={80} fill={c} stroke={CONTORNO} strokeWidth={9} />
			<path d="M-20 -820 Q0 -800 20 -820" stroke={cs} strokeWidth={6} fill="none" />
			<circle cx={-24} cy={-845} r={6} fill={cs} />
			<circle cx={24} cy={-845} r={6} fill={cs} />
			<path d="M-74 -880 Q0 -920 74 -880 L70 -860 Q0 -896 -70 -860Z" fill={c} stroke={CONTORNO} strokeWidth={7} />
			{[-60, -30, 0, 30, 60].map((a, i) => (
				<path key={i} d={`M${a * 0.9} -895 L${a * 2.4} -1010 L${a * 0.9 + 14} -895Z`} fill={c} stroke={CONTORNO} strokeWidth={6} strokeLinejoin="round" />
			))}
			{/* brilho de "moeda nova" */}
			{brilho > 0 &&
				[[-80, -600], [60, -300], [110, -1060], [-20, -880], [120, -500]].map(([x, y], i) => (
					<g key={i} transform={`translate(${x}, ${y}) scale(${brilho * (0.7 + 0.4 * Math.abs(Math.sin(f / 4 + i)))})`}>
						<path d="M0 -40 L10 -10 L40 0 L10 10 L0 40 L-10 10 L-40 0 L-10 -10Z" fill="#fff" />
					</g>
				))}
		</g>
	);
};

export const Pedestal: React.FC = () => (
	<g>
		<path d="M-200 0 L-160 -60 H160 L200 0Z" fill="#c9b99a" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-180} y={0} width={360} height={420} fill="#d9cbb0" stroke={CONTORNO} strokeWidth={8} />
		{[80, 200, 320].map((y) => <line key={y} x1={-180} y1={y} x2={180} y2={y} stroke="#b8a888" strokeWidth={6} />)}
		<rect x={-60} y={120} width={120} height={160} fill="#b8a888" stroke={CONTORNO} strokeWidth={6} />
		<path d="M-320 420 L-180 360 H180 L320 420Z" fill="#a89a7c" stroke={CONTORNO} strokeWidth={8} />
	</g>
);

// ---------- porto (com chuva opcional) ----------
export const Porto: React.FC<{chuva?: number; sal?: number; tempestade?: boolean; children?: React.ReactNode}> = ({chuva = 0, sal = 0, tempestade, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceuPorto" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={tempestade ? '#4a5568' : '#7fc0ea'} />
					<stop offset="1" stopColor={tempestade ? '#9aa6b8' : '#e6f3fb'} />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuPorto)" />
			{/* skyline genérico ao fundo */}
			{[[0, 260], [90, 340], [170, 220], [250, 420], [340, 300], [430, 380], [700, 280], [790, 460], [880, 320], [960, 380]].map(([x, h], i) => (
				<rect key={i} x={x} y={1320 - h} width={80} height={h} fill={tempestade ? '#6b7486' : '#a9b8cc'} />
			))}
			<rect y={1320} width={W} height={600} fill={tempestade ? '#3a5a74' : '#3f7fb3'} />
			{Array.from({length: 7}).map((_, i) => (
				<path key={i} d={`M${-100 + ((i * 190 + f * 4) % 1300)} ${1400 + (i % 3) * 140} q 40 -24 80 0 q 40 24 80 0`} stroke="#cfe8ff" strokeWidth={7} fill="none" opacity={0.7} />
			))}
			{children}
			{chuva > 0 &&
				Array.from({length: 60}).map((_, i) => {
					const x = (i * 73) % 1100;
					const y = (((i * 131) % 1920) + f * 40) % 1920;
					return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 46} stroke="#dbeeff" strokeWidth={5} opacity={chuva * 0.8} />;
				})}
			{sal > 0 &&
				Array.from({length: 26}).map((_, i) => {
					const x = (((i * 97) % 1080) + f * 3) % 1080;
					const y = 700 + ((i * 211) % 900) + Math.sin(f / 6 + i) * 30;
					return <rect key={i} x={x} y={y} width={14} height={14} fill="#fff" stroke="#9fb6c9" strokeWidth={2} transform={`rotate(45 ${x} ${y})`} opacity={sal} />;
				})}
		</g>
	);
};

export const Moeda: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<circle r={110} fill="#d98a52" stroke={CONTORNO} strokeWidth={10} />
		<circle r={88} fill="none" stroke="#b86a3a" strokeWidth={6} />
		<text x={0} y={36} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={100} fill="#8a4a22">1</text>
		<path d="M-60 -60 Q-40 -86 -10 -90" stroke="rgba(255,255,255,0.7)" strokeWidth={12} fill="none" strokeLinecap="round" />
	</g>
);

// corte: duas moedas de lado x chapa de cobre
export const Espessura: React.FC<{k: number}> = ({k}) => (
	<g>
		{[0, 1].map((i) => (
			<g key={i} transform={`translate(-180, ${-i * 46})`} opacity={k}>
				<rect x={-220} y={-20} width={440} height={40} rx={20} fill="#d98a52" stroke={CONTORNO} strokeWidth={7} />
			</g>
		))}
		<text x={-180} y={110} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={52} fill="#fff" stroke="#000" strokeWidth={9} paintOrder="stroke">2 PENNIES</text>
		<g transform="translate(300, -23)">
			<rect x={-140} y={-46} width={280} height={92} fill="#d6804a" stroke={CONTORNO} strokeWidth={7} />
			<text x={0} y={133} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={52} fill="#fff" stroke="#000" strokeWidth={9} paintOrder="stroke">HER SKIN</text>
		</g>
		<line x1={-420} y1={-92} x2={460} y2={-92} stroke="#ffd23f" strokeWidth={5} strokeDasharray="16 10" />
		<line x1={-420} y1={46} x2={460} y2={46} stroke="#ffd23f" strokeWidth={5} strokeDasharray="16 10" />
		<text x={0} y={-130} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={64} fill="#ffd23f" stroke="#000" strokeWidth={10} paintOrder="stroke">≈ 2.4 mm</text>
	</g>
);

// placa de cobre com manchas verdes crescendo + bolhas de ar/água
export const PlacaCobre: React.FC<{reage: number}> = ({reage}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect x={-420} y={-300} width={840} height={600} rx={20} fill={corCobre(reage * 0.5)} stroke={CONTORNO} strokeWidth={12} />
			{Array.from({length: 14}).map((_, i) => {
				const x = -360 + ((i * 137) % 720), y = -240 + ((i * 89) % 480);
				return <circle key={i} cx={x} cy={y} r={Math.max(0, reage * (40 + (i % 4) * 25) - (i % 5) * 8)} fill={corCobre(1)} opacity={0.9} />;
			})}
			{['O2', 'H2O', 'CO2', 'O2', 'H2O'].map((t, i) => {
				const y = 380 - (((f * 3 + i * 70) % 420));
				return (
					<g key={i} transform={`translate(${-320 + i * 160}, ${y - 700})`}>
						<circle r={54} fill="rgba(200,235,255,0.6)" stroke="#fff" strokeWidth={5} />
						<text x={0} y={14} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="#1d2a66">{t}</text>
					</g>
				);
			})}
		</g>
	);
};

// corte da pele: cobre embaixo, pátina em cima, gotas quicando
export const CortePatina: React.FC<{patina: number; protege: number}> = ({patina, protege}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect x={-480} y={0} width={960} height={220} fill="#d6804a" stroke={CONTORNO} strokeWidth={10} />
			<text x={0} y={135} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#7a3a1a">COPPER</text>
			<rect x={-480} y={-90 * patina} width={960} height={90 * patina} fill={corCobre(1)} stroke={CONTORNO} strokeWidth={patina > 0 ? 10 : 0} />
			{patina > 0.6 && <text x={0} y={-24} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#1d4a3a">PATINA</text>}
			{protege > 0 &&
				Array.from({length: 7}).map((_, i) => {
					const t = ((f + i * 9) % 40) / 40;
					const y = t < 0.6 ? -700 + t / 0.6 * 600 : -100 - Math.sin(((t - 0.6) / 0.4) * Math.PI) * 120;
					return <path key={i} d={`M${-400 + i * 130} ${y} q 16 26 0 40 q -16 -14 0 -40Z`} fill="#8fd3ff" stroke={CONTORNO} strokeWidth={4} opacity={protege} />;
				})}
		</g>
	);
};

export const Balde: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-80 -100 L-70 60 H70 L80 -100Z" fill="#c9c9c9" stroke={CONTORNO} strokeWidth={8} />
		<ellipse cx={0} cy={-100} rx={80} ry={22} fill="#7a6a44" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-80 -100 Q0 -200 80 -100" stroke={CONTORNO} strokeWidth={6} fill="none" />
		<text x={0} y={10} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={32} fill={CONTORNO}>PAINT</text>
	</g>
);

export const Escudo: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M0 -150 L120 -100 C120 20 70 100 0 150 C-70 100 -120 20 -120 -100Z" fill={corCobre(1)} stroke={CONTORNO} strokeWidth={12} strokeLinejoin="round" />
		<path d="M-50 0 L-12 40 L56 -40" stroke="#fff" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</g>
);
