import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

const AZUL_BT = '#1f6fd6';

// ---------- quarto moderno ----------
export const Quarto: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#e9e4f2" />
		<rect x={120} y={300} width={360} height={420} fill="#bfe3ff" stroke={CONTORNO} strokeWidth={10} />
		<line x1={300} y1={300} x2={300} y2={720} stroke={CONTORNO} strokeWidth={8} />
		<rect x={640} y={420} width={300} height={200} rx={16} fill="#f2c14e" stroke={CONTORNO} strokeWidth={8} />
		<rect y={1450} width={W} height={470} fill="#b9a6d9" />
		{children}
	</g>
);

// ---------- mar com barco viking ----------
export const MarViking: React.FC<{children?: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceuNorte" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#7aa3c9" />
					<stop offset="1" stopColor="#dbe7f0" />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuNorte)" />
			<path d="M0 900 L180 700 L320 860 L520 640 L700 880 L880 720 L1080 900Z" fill="#8a9aae" stroke={CONTORNO} strokeWidth={6} />
			<path d="M520 640 L580 710 L540 700 L470 700Z" fill="#fff" />
			<rect y={1050} width={W} height={870} fill="#2f5f8a" />
			{children}
			{Array.from({length: 6}).map((_, i) => (
				<path key={i} d={`M${-100 + ((i * 230 + f * 3) % 1300)} ${1500 + (i % 3) * 120} q 40 -30 80 0 q 40 30 80 0`} stroke="#bfe3ff" strokeWidth={8} fill="none" opacity={0.7} />
			))}
		</g>
	);
};

export const BarcoViking: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) rotate(${Math.sin(f / 12) * 3})`}>
			<path d="M-460 -60 Q-500 -200 -420 -230 Q-430 -150 -380 -100 L380 -100 Q430 -150 420 -230 Q500 -200 460 -60 Q300 80 0 80 Q-300 80 -460 -60Z" fill="#8a5a2b" stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
			<path d="M-400 -60 Q0 0 400 -60" stroke="#6b4a36" strokeWidth={8} fill="none" />
			{[-300, -150, 0, 150, 300].map((x, i) => (
				<g key={x}>
					<circle cx={x} cy={-110} r={42} fill={i % 2 ? '#c8323f' : '#f2c14e'} stroke={CONTORNO} strokeWidth={7} />
					<circle cx={x} cy={-110} r={10} fill="#9aa1ad" />
				</g>
			))}
			<line x1={0} y1={-100} x2={0} y2={-700} stroke="#6b4a36" strokeWidth={18} />
			<path d="M-260 -660 H260 L230 -260 H-230Z" fill="#f4eee0" stroke={CONTORNO} strokeWidth={9} />
			{[-180, -60, 60, 180].map((x) => <rect key={x} x={x - 30} y={-650} width={60} height={386} fill="#c8323f" opacity={0.85} />)}
			<path d="M-420 -230 Q-470 -300 -420 -330 Q-400 -290 -440 -270" stroke={CONTORNO} strokeWidth={10} fill="#8a5a2b" />
		</g>
	);
};

// ---------- mapa: Dinamarca e Noruega se unindo ----------
export const MapaNordico: React.FC<{une: number}> = ({une}) => (
	<g>
		<g transform={`translate(${-120 * (1 - une)}, ${-80 * (1 - une)})`}>
			<path d="M-40 -420 C-120 -380 -180 -260 -200 -120 C-210 0 -150 60 -60 40 C-20 -40 40 -160 60 -300 C70 -380 30 -440 -40 -420Z" fill="#9fd3a0" stroke={CONTORNO} strokeWidth={10} />
			<text x={-110} y={-160} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={46} fill={CONTORNO} transform="rotate(-60 -110 -160)">NORWAY</text>
		</g>
		<g transform={`translate(${100 * (1 - une)}, ${120 * (1 - une)})`}>
			<path d="M-20 90 C40 70 90 110 80 180 C70 250 20 270 -20 250 C-50 220 -60 140 -20 90Z" fill="#f6b8a8" stroke={CONTORNO} strokeWidth={10} />
			<ellipse cx={130} cy={210} rx={36} ry={28} fill="#f6b8a8" stroke={CONTORNO} strokeWidth={8} />
			<text x={-50} y={190} textAnchor="end" fontFamily="Nunito" fontWeight={900} fontSize={46} fill={CONTORNO}>DENMARK</text>
		</g>
	</g>
);

// ---------- sorriso com dente azul ----------
export const SorrisoAzul: React.FC<{brilho: number}> = ({brilho}) => (
	<g>
		<path d="M-320 -80 Q0 260 320 -80 Q0 20 -320 -80Z" fill="#7a2331" stroke={CONTORNO} strokeWidth={14} strokeLinejoin="round" />
		{[-200, -110, -20, 70, 160].map((x, i) => (
			<path key={x} d={`M${x} ${-40 + Math.abs(x) * 0.06} h80 v70 q-40 20 -80 0Z`} fill={i === 3 ? '#3a5fa8' : '#fffdf5'} stroke={CONTORNO} strokeWidth={7} />
		))}
		{brilho > 0 && <circle cx={110} cy={0} r={90} fill="#5aa0ff" opacity={brilho * 0.35} />}
		<path d="M-420 -150 C-340 -60 -300 140 -200 220 C-100 300 100 300 200 220 C300 140 340 -60 420 -150" stroke="#c9762e" strokeWidth={70} fill="none" strokeLinecap="round" />
	</g>
);

// ---------- escritório anos 90 / bar ----------
export const Escritorio90: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#c8d1c2" />
		{[0, 1, 2].map((i) => <rect key={i} x={90 + i * 320} y={300} width={260} height={180} fill="#9fb6c9" stroke={CONTORNO} strokeWidth={8} />)}
		<rect y={1400} width={W} height={520} fill="#7a8a7a" />
		<rect x={0} y={1300} width={W} height={110} fill="#a58a6a" stroke={CONTORNO} strokeWidth={8} />
		{children}
	</g>
);

export const Bar: React.FC<{children?: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#3a2a22" />
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i}>
					<line x1={140 + i * 200} y1={0} x2={140 + i * 200} y2={220} stroke="#222" strokeWidth={4} />
					<ellipse cx={140 + i * 200} cy={240} rx={50} ry={22} fill="#ffcf6a" opacity={0.9 + 0.1 * Math.sin(f / 7 + i)} />
					<circle cx={140 + i * 200} cy={260} r={120} fill="rgba(255,200,100,0.12)" />
				</g>
			))}
			{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={80 + i * 140} y={500} width={50} height={140} rx={10} fill={['#3c8a4a', '#b5651d', '#2f5bd3', '#c8323f'][i % 4]} stroke={CONTORNO} strokeWidth={5} />)}
			<rect x={0} y={640} width={W} height={24} fill="#5b3f2c" />
			<rect y={1350} width={W} height={570} fill="#5b3f2c" />
			<rect y={1330} width={W} height={50} fill="#8a5a3a" stroke={CONTORNO} strokeWidth={8} />
			{children}
		</g>
	);
};

export const Caneca: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-50} y={-130} width={100} height={130} rx={10} fill="#f2c14e" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-56 -130 Q-60 -170 -20 -160 Q0 -190 30 -160 Q66 -170 56 -130Z" fill="#fff" stroke={CONTORNO} strokeWidth={6} />
		<path d="M50 -100 Q100 -100 100 -60 Q100 -20 50 -24" stroke={CONTORNO} strokeWidth={10} fill="none" />
	</g>
);

export const Livro: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-150} y={-200} width={300} height={400} rx={10} fill="#7a2f3a" stroke={CONTORNO} strokeWidth={10} />
		<rect x={-150} y={-200} width={36} height={400} fill="#5a1f2a" stroke={CONTORNO} strokeWidth={6} />
		<text x={20} y={-110} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={52} fill="#f2c14e">VIKINGS</text>
		<path d="M-60 60 Q20 -10 100 60 L80 90 L-40 90Z" fill="#f2c14e" stroke={CONTORNO} strokeWidth={5} />
		<line x1={20} y1={30} x2={20} y2={-60} stroke="#f2c14e" strokeWidth={6} />
		<path d="M20 -60 L70 -30 L20 0Z" fill="#f2c14e" />
	</g>
);

export const Lampada: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<circle r={120} fill="rgba(255,230,120,0.35)" />
		<path d="M-60 -10 C-90 -60 -60 -130 0 -130 C60 -130 90 -60 60 -10 C40 20 36 40 36 60 H-36 C-36 40 -40 20 -60 -10Z" fill="#ffe36a" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-36} y={60} width={72} height={40} rx={8} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={6} />
	</g>
);

// ---------- aparelhos ----------
export const Celular: React.FC<{s?: number; tela?: string}> = ({s = 1, tela = ''}) => (
	<g transform={`scale(${s})`}>
		<rect x={-90} y={-170} width={180} height={340} rx={30} fill="#222" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-76} y={-146} width={152} height={280} rx={12} fill="#9fd3ff" />
		{tela && <text x={0} y={0} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={CONTORNO}>{tela}</text>}
	</g>
);

export const Fone: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-120 40 C-120 -140 120 -140 120 40" stroke="#333" strokeWidth={26} fill="none" />
		<rect x={-160} y={10} width={70} height={120} rx={30} fill="#e8463f" stroke={CONTORNO} strokeWidth={8} />
		<rect x={90} y={10} width={70} height={120} rx={30} fill="#e8463f" stroke={CONTORNO} strokeWidth={8} />
	</g>
);

export const Notebook: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-170} y={-200} width={340} height={220} rx={14} fill="#3a3f4a" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-150} y={-182} width={300} height={184} fill="#bfe3ff" />
		<path d="M-210 20 H210 L180 60 H-180Z" fill="#9aa1ad" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
	</g>
);

export const Ondas: React.FC<{x: number; y: number; s?: number; cor?: string}> = ({x, y, s = 1, cor = AZUL_BT}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x}, ${y}) scale(${s})`}>
			{[0, 1, 2].map((i) => {
				const t = ((f / 12 + i / 3) % 1);
				return <path key={i} d={`M${-40 - t * 80} ${-40 - t * 80} A ${60 + t * 110} ${60 + t * 110} 0 0 1 ${40 + t * 80} ${-40 - t * 80}`} stroke={cor} strokeWidth={12} fill="none" opacity={1 - t} strokeLinecap="round" />;
			})}
		</g>
	);
};

// ---------- runas: Hagall (H) e Bjarkan (B), e a fusão ----------
export const RunaH: React.FC<{cor?: string}> = ({cor = CONTORNO}) => (
	<g stroke={cor} strokeWidth={26} strokeLinecap="round" fill="none">
		<line x1={0} y1={-160} x2={0} y2={160} />
		<line x1={-80} y1={-80} x2={80} y2={80} />
		<line x1={80} y1={-80} x2={-80} y2={80} />
	</g>
);
export const RunaB: React.FC<{cor?: string}> = ({cor = CONTORNO}) => (
	<g stroke={cor} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none">
		<line x1={-40} y1={-160} x2={-40} y2={160} />
		<path d="M-40 -160 L60 -80 L-40 0 L60 80 L-40 160" />
	</g>
);
export const Pedra: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<path d="M-380 300 C-420 0 -360 -320 -100 -380 C120 -420 360 -300 390 0 C410 200 380 300 380 300Z" fill="#9aa1ad" stroke={CONTORNO} strokeWidth={12} />
		<path d="M-300 200 C-320 0 -280 -200 -120 -280" stroke="rgba(255,255,255,0.2)" strokeWidth={20} fill="none" strokeLinecap="round" />
		{children}
	</g>
);

export const Nota: React.FC<{texto: string; s?: number}> = ({texto, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-260} y={-180} width={520} height={360} fill="#fff27a" stroke={CONTORNO} strokeWidth={10} />
		<rect x={-80} y={-210} width={160} height={50} fill="rgba(200,200,200,0.7)" />
		<text x={0} y={-70} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={44} fill="#6b5a44">CODE NAME:</text>
		<text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill={AZUL_BT}>{texto}</text>
	</g>
);
