import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

// ---------- estrada de terra em perspectiva, sol forte ----------
export const Estrada: React.FC<{calor?: number; poeira?: number; children?: React.ReactNode}> = ({calor = 0, poeira = 0, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceuQuente" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={calor > 0.5 ? '#f2a65a' : '#7fc0ea'} />
					<stop offset="1" stopColor="#fbe3b0" />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuQuente)" />
			<circle cx={820} cy={330} r={130 + calor * 40} fill="#fff1a8" />
			<circle cx={820} cy={330} r={210 + calor * 80} fill="rgba(255,236,150,0.35)" />
			{calor > 0 &&
				[0, 1, 2, 3, 4].map((i) => (
					<path key={i} d={`M${120 + i * 200} ${760 - ((f * 2 + i * 30) % 120)} q 20 -20 0 -40 q -20 -20 0 -40`} stroke="rgba(255,255,255,0.6)" strokeWidth={8} fill="none" opacity={calor} />
				))}
			<path d="M0 830 Q300 760 540 800 T1080 780 V900 H0Z" fill="#b9a46a" />
			<rect y={880} width={W} height={1040} fill="#c9b27a" />
			{/* estrada */}
			<path d="M470 880 L610 880 L1080 1920 L0 1920Z" fill="#d9b98a" />
			<path d="M470 880 L610 880 L1080 1920 L0 1920Z" fill="none" stroke="#a88a5a" strokeWidth={6} />
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const t = ((f * 0.02 + i / 6) % 1);
				const y = 900 + t * t * 1000;
				return <ellipse key={i} cx={540 + (i % 2 ? 1 : -1) * t * 200} cy={y} rx={10 + t * 40} ry={4 + t * 12} fill="#b89a6a" />;
			})}
			{/* cercas / árvores secas */}
			{[[120, 900, 0.8], [960, 890, 0.7], [60, 1100, 1.2]].map(([x, y, s], i) => (
				<g key={i} transform={`translate(${x}, ${y}) scale(${s})`}>
					<path d="M0 0 L0 -150 M0 -90 L-40 -130 M0 -110 L36 -150" stroke="#6b4a36" strokeWidth={12} strokeLinecap="round" />
				</g>
			))}
			{children}
			{poeira > 0 && (
				<g opacity={poeira}>
					{Array.from({length: 14}).map((_, i) => (
						<circle key={i} cx={(i * 97 + f * 4) % 1180 - 50} cy={1200 + ((i * 131) % 600) + Math.sin(f / 6 + i) * 30} r={90 + (i % 4) * 40} fill="#e6d0a4" />
					))}
				</g>
			)}
		</g>
	);
};

// ---------- estádio com linha de chegada ----------
export const Chegada: React.FC<{fita?: boolean; torcendo?: boolean; children?: React.ReactNode}> = ({fita = true, torcendo = true, children}) => {
	const f = useCurrentFrame();
	const cores = ['#e8463f', '#2f5bd3', '#f2c14e', '#5a8f6a', '#8a63c2', '#e8833a'];
	return (
		<g>
			<rect width={W} height={H} fill="#8fc9ee" />
			{/* arquibancada */}
			<path d="M0 260 L1080 260 L1080 900 L0 900Z" fill="#9a8a72" />
			{Array.from({length: 6}).map((_, r) => (
				<g key={r}>
					<rect x={0} y={300 + r * 100} width={W} height={14} fill="#7a6a54" />
					{Array.from({length: 16}).map((__, c) => {
						const x = 30 + c * 68 + (r % 2) * 30;
						const pula = torcendo ? Math.abs(Math.sin(f / 4 + c + r)) * 14 : 0;
						return (
							<g key={c} transform={`translate(${x}, ${380 + r * 100 - pula})`}>
								<rect x={-20} y={-10} width={40} height={40} rx={10} fill={cores[(c + r) % cores.length]} stroke={CONTORNO} strokeWidth={4} />
								<circle cx={0} cy={-30} r={22} fill="#fff" stroke={CONTORNO} strokeWidth={4} />
								{torcendo && (c + r) % 3 === 0 && <line x1={-20} y1={0} x2={-34} y2={-50 + pula} stroke={CONTORNO} strokeWidth={5} />}
							</g>
						);
					})}
				</g>
			))}
			<rect y={900} width={W} height={40} fill="#5b4a3c" />
			{/* pista */}
			<rect y={940} width={W} height={980} fill="#c86a44" />
			{[1100, 1300, 1550, 1850].map((y) => (
				<rect key={y} y={y} width={W} height={10} fill="rgba(255,255,255,0.6)" />
			))}
			{/* faixa FINISH */}
			<rect x={40} y={560} width={20} height={1100} fill="#e9e9e9" stroke={CONTORNO} strokeWidth={6} />
			<rect x={1020} y={560} width={20} height={1100} fill="#e9e9e9" stroke={CONTORNO} strokeWidth={6} />
			<rect x={60} y={560} width={960} height={110} fill="#1d2a66" stroke={CONTORNO} strokeWidth={8} />
			<text x={540} y={640} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill="#ffd23f">FINISH</text>
			{fita && <path d="M60 1300 Q540 1330 1020 1300" stroke="#e8262f" strokeWidth={14} fill="none" />}
			{children}
		</g>
	);
};

// ---------- carro de 1904 (de lado, virado para a direita) ----------
export const CarroAntigo: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) translate(0, ${Math.sin(f * 1.1) * 5})`}>
			{[-170, 170].map((x) => (
				<g key={x} transform={`translate(${x}, -95) rotate(${f * 14})`}>
					<circle r={95} fill="#2a2a2a" stroke={CONTORNO} strokeWidth={9} />
					<circle r={78} fill="#e9d8a6" />
					{[0, 30, 60, 90, 120, 150].map((a) => <line key={a} x1={-78 * Math.cos((a * Math.PI) / 180)} y1={-78 * Math.sin((a * Math.PI) / 180)} x2={78 * Math.cos((a * Math.PI) / 180)} y2={78 * Math.sin((a * Math.PI) / 180)} stroke="#8a6a44" strokeWidth={6} />)}
					<circle r={16} fill="#8a6a44" stroke={CONTORNO} strokeWidth={5} />
				</g>
			))}
			<path d="M-260 -150 L-260 -250 Q-260 -290 -210 -290 L-60 -290 L-40 -210 L120 -210 L150 -260 L250 -260 L260 -150Z" fill="#b8322a" stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
			<rect x={-250} y={-340} width={150} height={60} rx={16} fill="#3a2a1e" stroke={CONTORNO} strokeWidth={8} />
			<line x1={60} y1={-210} x2={30} y2={-320} stroke={CONTORNO} strokeWidth={10} />
			<ellipse cx={30} cy={-325} rx={40} ry={12} fill="none" stroke={CONTORNO} strokeWidth={9} />
			<circle cx={260} cy={-230} r={24} fill="#f2c14e" stroke={CONTORNO} strokeWidth={7} />
			<path d="M-250 -150 Q-170 -230 -90 -150 M90 -150 Q170 -230 250 -150" stroke={CONTORNO} strokeWidth={9} fill="#7a1f1a" />
			<g opacity={0.6}>
				{[0, 1, 2].map((i) => <circle key={i} cx={-300 - i * 60 - ((f * 6) % 60)} cy={-120 - i * 20} r={30 + i * 14} fill="#bbb" />)}
			</g>
		</g>
	);
};

// ---------- cachorro correndo (de lado, para a direita) ----------
export const Cachorro: React.FC<{x: number; y: number; s?: number; cor?: string; fase?: number}> = ({x, y, s = 1, cor = '#8a5a2b', fase = 0}) => {
	const f = useCurrentFrame() + fase * 5;
	const p = Math.sin(f * 0.9);
	return (
		<g transform={`translate(${x}, ${y + Math.abs(p) * -10}) scale(${s})`}>
			<g stroke={CONTORNO} strokeWidth={14} strokeLinecap="round">
				<line x1={-70} y1={-60} x2={-90 - p * 40} y2={0} />
				<line x1={-50} y1={-60} x2={-30 + p * 40} y2={0} />
				<line x1={60} y1={-60} x2={40 - p * 40} y2={0} />
				<line x1={80} y1={-60} x2={100 + p * 40} y2={0} />
			</g>
			<path d={`M-110 -110 Q-160 ${-150 + p * 20} -170 -170`} stroke={CONTORNO} strokeWidth={14} fill="none" strokeLinecap="round" />
			<ellipse cx={0} cy={-100} rx={120} ry={52} fill={cor} stroke={CONTORNO} strokeWidth={9} />
			<g transform="translate(120, -150)">
				<ellipse cx={0} cy={0} rx={56} ry={46} fill={cor} stroke={CONTORNO} strokeWidth={9} />
				<path d="M-30 -30 L-50 -80 L0 -40Z" fill={cor} stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
				<ellipse cx={50} cy={10} rx={30} ry={22} fill="#c8935a" stroke={CONTORNO} strokeWidth={6} />
				<circle cx={76} cy={4} r={10} fill={CONTORNO} />
				<circle cx={10} cy={-10} r={9} fill={CONTORNO} />
				<path d="M-20 -24 L22 -16" stroke={CONTORNO} strokeWidth={7} strokeLinecap="round" />
				<path d="M40 30 L70 30 L60 46Z" fill="#fff" stroke={CONTORNO} strokeWidth={4} />
			</g>
		</g>
	);
};

export const FrascoVeneno: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-30} y={-190} width={60} height={50} fill="#5a3a22" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-30 -140 L-80 -80 L-80 80 Q-80 110 -50 110 L50 110 Q80 110 80 80 L80 -80 L30 -140Z" fill="#3c8a4a" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
		<rect x={-60} y={-40} width={120} height={110} rx={10} fill="#f6ead0" stroke={CONTORNO} strokeWidth={6} />
		<circle cx={0} cy={0} r={24} fill={CONTORNO} />
		<rect x={-14} y={16} width={28} height={16} fill={CONTORNO} />
		<circle cx={-9} cy={-2} r={7} fill="#f6ead0" />
		<circle cx={9} cy={-2} r={7} fill="#f6ead0" />
		<path d="M-40 40 L40 60 M40 40 L-40 60" stroke={CONTORNO} strokeWidth={8} strokeLinecap="round" />
	</g>
);

export const GarrafaConhaque: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-18} y={-230} width={36} height={90} fill="#8a5a2b" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-18 -150 Q-80 -120 -80 -40 L-80 100 Q-80 120 -60 120 L60 120 Q80 120 80 100 L80 -40 Q80 -120 18 -150Z" fill="#b5651d" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
		<rect x={-56} y={-20} width={112} height={80} rx={8} fill="#f2c14e" stroke={CONTORNO} strokeWidth={6} />
		<text x={0} y={34} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill={CONTORNO}>XXX</text>
		<path d="M-60 -60 Q-50 -100 -20 -110" stroke="rgba(255,255,255,0.5)" strokeWidth={10} fill="none" strokeLinecap="round" />
	</g>
);

export const Farmacia: React.FC = () => (
	<g>
		<rect width={W} height={H} fill="#5b3f2c" />
		{[420, 760, 1100].map((y) => (
			<g key={y}>
				<rect x={0} y={y} width={W} height={34} fill="#3e2a1d" />
				{Array.from({length: 7}).map((_, i) => {
					const x = 90 + i * 150;
					const h = 110 + (i * 37) % 60;
					const c = ['#3c8a4a', '#2f5bd3', '#b5651d', '#8a63c2', '#c8323f', '#e8c46a', '#3a9c9c'][(i + y) % 7];
					return (
						<g key={i}>
							<rect x={x - 34} y={y - h} width={68} height={h} rx={14} fill={c} stroke={CONTORNO} strokeWidth={6} opacity={0.95} />
							<rect x={x - 26} y={y - h * 0.6} width={52} height={36} fill="#f6ead0" stroke={CONTORNO} strokeWidth={3} />
							<rect x={x - 14} y={y - h - 24} width={28} height={26} fill="#3e2a1d" stroke={CONTORNO} strokeWidth={4} />
						</g>
					);
				})}
			</g>
		))}
		<rect y={1250} width={W} height={670} fill="#7a5238" />
		<rect y={1250} width={W} height={30} fill="#3e2a1d" />
	</g>
);

export const Tesoura: React.FC<{s?: number; abre?: number}> = ({s = 1, abre = 0.5}) => (
	<g transform={`scale(${s})`}>
		<g transform={`rotate(${-abre * 20})`}>
			<path d="M0 0 L200 -14 L200 4Z" fill="#c7ccd6" stroke={CONTORNO} strokeWidth={6} />
			<circle cx={-60} cy={-30} r={34} fill="none" stroke="#e8463f" strokeWidth={16} />
		</g>
		<g transform={`rotate(${abre * 20})`}>
			<path d="M0 0 L200 14 L200 -4Z" fill="#c7ccd6" stroke={CONTORNO} strokeWidth={6} />
			<circle cx={-60} cy={30} r={34} fill="none" stroke="#e8463f" strokeWidth={16} />
		</g>
		<circle r={10} fill={CONTORNO} />
	</g>
);

export const Medalha: React.FC<{s?: number; texto?: string; cor?: string}> = ({s = 1, texto = '1', cor = '#f2c14e'}) => (
	<g transform={`scale(${s})`}>
		<path d="M-70 -220 L-20 -40 L20 -40 L70 -220 L30 -220 L0 -110 L-30 -220Z" fill="#2f5bd3" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
		<circle cx={0} cy={40} r={110} fill={cor} stroke={CONTORNO} strokeWidth={12} />
		<circle cx={0} cy={40} r={84} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={8} />
		<text x={0} y={80} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={texto.length > 2 ? 80 : 120} fill={CONTORNO}>{texto}</text>
	</g>
);

export const Termometro: React.FC<{nivel: number; s?: number}> = ({nivel, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-34} y={-300} width={68} height={300} rx={34} fill="#fff" stroke={CONTORNO} strokeWidth={9} />
		<rect x={-16} y={-280 + 260 * (1 - nivel)} width={32} height={260 * nivel + 20} rx={16} fill="#e8262f" />
		<circle cx={0} cy={30} r={60} fill="#e8262f" stroke={CONTORNO} strokeWidth={9} />
		{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={34} y1={-250 + i * 50} x2={60} y2={-250 + i * 50} stroke={CONTORNO} strokeWidth={6} />)}
	</g>
);
