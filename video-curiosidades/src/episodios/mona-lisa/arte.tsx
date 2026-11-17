import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

// ---------- "Mona" (versão em desenho própria do retrato) dentro da moldura; centro em 0,0 ----------
export const Mona: React.FC<{s?: number; moldura?: boolean; brilho?: number}> = ({s = 1, moldura = true, brilho = 0}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			{brilho > 0 && <ellipse cx={0} cy={0} rx={300} ry={380} fill="rgba(255,230,140,0.35)" opacity={brilho * (0.7 + 0.3 * Math.sin(f / 5))} />}
			{moldura && <rect x={-200} y={-270} width={400} height={540} rx={10} fill="#c9a227" stroke={CONTORNO} strokeWidth={10} />}
			{moldura && <rect x={-176} y={-246} width={352} height={492} fill="#8a6a2a" stroke={CONTORNO} strokeWidth={6} />}
			<g>
				<rect x={-160} y={-230} width={320} height={460} fill="#7f8f5a" />
				{/* paisagem ao fundo */}
				<path d="M-160 -60 Q-100 -120 -40 -80 L-40 230 H-160Z" fill="#6b7a4a" />
				<path d="M40 -90 Q110 -140 160 -80 V230 H40Z" fill="#6b7a4a" />
				<path d="M-160 -140 Q-80 -170 0 -150 Q80 -170 160 -140 V-100 H-160Z" fill="#a8b88a" opacity={0.6} />
				<path d="M-120 -40 Q-60 -70 -40 -20" stroke="#4f6a7a" strokeWidth={8} fill="none" />
				{/* corpo */}
				<path d="M-150 230 C-150 110 -110 40 0 30 C110 40 150 110 150 230Z" fill="#3a2a1e" stroke={CONTORNO} strokeWidth={6} />
				<path d="M-60 60 Q0 100 60 60 L50 90 Q0 120 -50 90Z" fill="#c9a07a" stroke={CONTORNO} strokeWidth={4} />
				{/* mãos cruzadas */}
				<ellipse cx={-30} cy={180} rx={56} ry={26} fill="#e2b98e" stroke={CONTORNO} strokeWidth={5} />
				<ellipse cx={34} cy={170} rx={56} ry={26} fill="#e2b98e" stroke={CONTORNO} strokeWidth={5} />
				{/* cabelo e rosto */}
				<path d="M-78 -40 C-96 -150 -60 -200 0 -200 C60 -200 96 -150 78 -40 L92 60 L50 40 L44 -60 L-44 -60 L-50 40 L-92 60Z" fill="#2a1d14" stroke={CONTORNO} strokeWidth={6} />
				<ellipse cx={0} cy={-90} rx={50} ry={66} fill="#e2b98e" stroke={CONTORNO} strokeWidth={5} />
				<path d="M-24 -100 q 8 -6 16 0 M8 -100 q 8 -6 16 0" stroke={CONTORNO} strokeWidth={4} fill="none" />
				<circle cx={-16} cy={-96} r={4} fill={CONTORNO} />
				<circle cx={16} cy={-96} r={4} fill={CONTORNO} />
				<path d="M-14 -58 Q0 -50 14 -58" stroke={CONTORNO} strokeWidth={4} fill="none" strokeLinecap="round" />
				<path d="M-44 -150 Q0 -172 44 -150" stroke="rgba(0,0,0,0.25)" strokeWidth={6} fill="none" />
			</g>
		</g>
	);
};

// quadros genéricos para a parede da galeria
export const QuadroGenerico: React.FC<{tipo: number; s?: number}> = ({tipo, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-170} y={-130} width={340} height={260} rx={8} fill="#c9a227" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-148} y={-108} width={296} height={216} fill={['#9fc3e0', '#e9d8a6', '#c9e0b0', '#d9a07a'][tipo % 4]} />
		{tipo % 4 === 0 && <path d="M-148 60 L-60 -30 L20 40 L80 -10 L148 50 V108 H-148Z" fill="#6b8a5a" />}
		{tipo % 4 === 1 && <g><circle cx={-40} cy={20} r={40} fill="#e8463f" /><circle cx={30} cy={30} r={34} fill="#f2c14e" /><ellipse cx={0} cy={70} rx={110} ry={20} fill="#8a6a44" /></g>}
		{tipo % 4 === 2 && <g><circle cx={0} cy={-10} r={44} fill="#e2b98e" /><path d="M-80 108 C-80 40 80 40 80 108Z" fill="#4a5a8a" /></g>}
		{tipo % 4 === 3 && <path d="M-148 108 L-148 20 Q0 -80 148 20 V108Z" fill="#2f5f8a" />}
	</g>
);

// ---------- galeria do museu ----------
export const Galeria: React.FC<{monaPresente?: boolean; ganchos?: boolean; children?: React.ReactNode}> = ({monaPresente = true, ganchos, children}) => (
	<g>
		<defs>
			<linearGradient id="paredeLouvre" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#8a3a3a" />
				<stop offset="1" stopColor="#5e2626" />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="url(#paredeLouvre)" />
		<rect y={0} width={W} height={120} fill="#e9d8a6" />
		<rect y={110} width={W} height={20} fill="#c9a227" />
		<g transform="translate(160, 420)"><QuadroGenerico tipo={0} s={0.7} /></g>
		<g transform="translate(920, 420)"><QuadroGenerico tipo={1} s={0.7} /></g>
		<g transform="translate(160, 760)"><QuadroGenerico tipo={2} s={0.7} /></g>
		<g transform="translate(920, 760)"><QuadroGenerico tipo={3} s={0.7} /></g>
		{monaPresente ? (
			<g transform="translate(540, 640)"><Mona s={0.9} /></g>
		) : (
			<g transform="translate(540, 640)">
				<rect x={-180} y={-243} width={360} height={486} fill="#6e2e2e" stroke="#4a1e1e" strokeWidth={6} strokeDasharray="20 12" />
				{ganchos && [-120, -40, 40, 120].map((x) => <path key={x} d={`M${x} -260 q 0 30 14 30`} stroke="#c9c9c9" strokeWidth={10} fill="none" />)}
			</g>
		)}
		<rect y={1300} width={W} height={620} fill="#a8794a" />
		{Array.from({length: 9}).map((_, i) => <line key={i} x1={i * 140} y1={1300} x2={i * 140 - 220} y2={1920} stroke="rgba(0,0,0,0.12)" strokeWidth={8} />)}
		<rect x={0} y={1290} width={W} height={20} fill="#5b3f2c" />
		{children}
	</g>
);

// câmera antiga de fole no tripé
export const CameraAntiga: React.FC<{s?: number; flash?: boolean}> = ({s = 1, flash}) => (
	<g transform={`scale(${s})`}>
		<path d="M0 0 L-80 260 M0 0 L80 260 M0 0 L0 270" stroke="#6b4a36" strokeWidth={14} strokeLinecap="round" />
		<rect x={-90} y={-120} width={120} height={120} fill="#4a3326" stroke={CONTORNO} strokeWidth={8} />
		<path d="M30 -110 L120 -90 L120 -30 L30 -10Z" fill="#2a2a2a" stroke={CONTORNO} strokeWidth={7} />
		{[50, 70, 90, 110].map((x) => <line key={x} x1={x} y1={-104 + (x - 30) * 0.2} x2={x} y2={-16 - (x - 30) * 0.2} stroke="#555" strokeWidth={4} />)}
		<circle cx={130} cy={-60} r={22} fill="#9fd3ff" stroke={CONTORNO} strokeWidth={6} />
		{flash && <circle cx={-30} cy={-160} r={70} fill="#fff8c0" opacity={0.9} />}
	</g>
);

export const Jornal: React.FC<{titulo: string; s?: number}> = ({titulo, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-300} y={-400} width={600} height={800} fill="#f1ede2" stroke={CONTORNO} strokeWidth={10} />
		<text x={0} y={-310} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={60} fill={CONTORNO}>EXTRA! EXTRA!</text>
		<line x1={-270} y1={-280} x2={270} y2={-280} stroke={CONTORNO} strokeWidth={6} />
		<text x={0} y={-190} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={100} fill="#c8323f">{titulo}</text>
		<g transform="translate(-130, 60) scale(0.42)"><Mona /></g>
		{Array.from({length: 6}).map((_, i) => <rect key={i} x={20} y={-100 + i * 50} width={i % 3 === 2 ? 180 : 250} height={18} fill="#bdb6a4" />)}
		{Array.from({length: 3}).map((_, i) => <rect key={i} x={-270} y={240 + i * 46} width={540} height={18} fill="#bdb6a4" />)}
	</g>
);

// Florença: ponte e cúpula
export const Florenca: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<defs>
			<linearGradient id="ceuFlor" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#f2a65a" />
				<stop offset="1" stopColor="#fbe3b0" />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="url(#ceuFlor)" />
		<g transform="translate(700, 820)">
			<rect x={-120} y={-60} width={240} height={60} fill="#e9d8a6" stroke={CONTORNO} strokeWidth={7} />
			<path d="M-110 -60 Q-110 -260 0 -280 Q110 -260 110 -60Z" fill="#c8623a" stroke={CONTORNO} strokeWidth={8} />
			{[-60, 0, 60].map((x) => <path key={x} d={`M${x} -270 Q${x * 1.4} -170 ${x * 1.6} -60`} stroke="#f1ead8" strokeWidth={6} fill="none" />)}
			<rect x={-20} y={-320} width={40} height={50} fill="#f1ead8" stroke={CONTORNO} strokeWidth={6} />
		</g>
		{[[60, 260], [200, 320], [340, 240], [880, 300], [980, 260]].map(([x, h], i) => <rect key={i} x={x} y={820 - h} width={120} height={h} fill={['#e9cdb0', '#d9b08a', '#f1e6cf'][i % 3]} stroke={CONTORNO} strokeWidth={6} />)}
		<rect y={820} width={W} height={300} fill="#5f8fa8" />
		<path d="M0 900 H1080 V1000 H0Z" fill="#d9b08a" stroke={CONTORNO} strokeWidth={7} />
		{[100, 330, 560, 790, 1020].map((x) => <path key={x} d={`M${x - 80} 1000 Q${x} 900 ${x + 80} 1000`} fill="#5f8fa8" stroke={CONTORNO} strokeWidth={6} />)}
		{Array.from({length: 10}).map((_, i) => <rect key={i} x={i * 110} y={840} width={90} height={60} fill="#e9cdb0" stroke={CONTORNO} strokeWidth={4} />)}
		<rect y={1120} width={W} height={800} fill="#b89a7a" />
		{children}
	</g>
);

export const Bau: React.FC<{aberto?: number; s?: number}> = ({aberto = 0, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-220} y={-120} width={440} height={240} fill="#8a5a2b" stroke={CONTORNO} strokeWidth={9} />
		<rect x={-220} y={-30} width={440} height={20} fill="#5b3f2c" />
		<g transform={`rotate(${-aberto * 70} -220 -120)`}>
			<path d="M-220 -120 Q0 -220 220 -120Z" fill="#9a6a3a" stroke={CONTORNO} strokeWidth={9} />
		</g>
		<rect x={-20} y={-60} width={40} height={50} fill="#c9a227" stroke={CONTORNO} strokeWidth={5} />
	</g>
);

export const TorreParis: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`} fill="none" stroke="#5b4a3c" strokeWidth={12} strokeLinejoin="round">
		<path d="M-160 0 Q-60 -160 -20 -600 L0 -720 L20 -600 Q60 -160 160 0" />
		<path d="M-90 -140 Q0 -200 90 -140" />
		<line x1={-60} y1={-330} x2={60} y2={-330} />
		<line x1={-40} y1={-480} x2={40} y2={-480} />
	</g>
);

export const Celular: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-40} y={-70} width={80} height={140} rx={14} fill="#222" stroke={CONTORNO} strokeWidth={5} />
		<rect x={-32} y={-60} width={64} height={110} rx={6} fill="#9fd3ff" />
	</g>
);
