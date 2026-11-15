import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

// ---------- rua medieval com casas enxaimel ----------
export const RuaMedieval: React.FC<{noite?: number; tinta?: string; children?: React.ReactNode}> = ({noite = 0, tinta, children}) => {
	const casas = [
		{x: -40, w: 300, h: 760, c: '#efe1c0', t: '#7a3a2a'},
		{x: 250, w: 260, h: 880, c: '#f4d9a8', t: '#5b3f2c'},
		{x: 500, w: 300, h: 720, c: '#e9cdb0', t: '#7a3a2a'},
		{x: 790, w: 330, h: 840, c: '#f1e6cf', t: '#5b3f2c'},
	];
	return (
		<g>
			<defs>
				<linearGradient id="ceuMed" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={noite > 0.5 ? '#141e45' : '#8fc4ea'} />
					<stop offset="1" stopColor={noite > 0.5 ? '#3b4c95' : '#f3e6c8'} />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuMed)" />
			{noite > 0.5 ? <circle cx={820} cy={240} r={70} fill="#fff4cc" /> : <circle cx={820} cy={240} r={90} fill="#fff1a8" />}
			{/* torre da catedral ao fundo */}
			<path d="M500 900 L500 300 L540 120 L580 300 L580 900Z" fill="#c98a8a" stroke={CONTORNO} strokeWidth={6} opacity={0.6} />
			{casas.map((k, i) => {
				const topo = 1300 - k.h;
				return (
					<g key={i}>
						<path d={`M${k.x} ${topo + 120} L${k.x + k.w / 2} ${topo - 60} L${k.x + k.w} ${topo + 120}Z`} fill={k.t} stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
						<rect x={k.x} y={topo + 120} width={k.w} height={k.h - 120} fill={k.c} stroke={CONTORNO} strokeWidth={8} />
						{/* vigas */}
						{[0.33, 0.66].map((p) => <line key={p} x1={k.x} y1={topo + 120 + (k.h - 120) * p} x2={k.x + k.w} y2={topo + 120 + (k.h - 120) * p} stroke="#5b3f2c" strokeWidth={12} />)}
						<line x1={k.x + k.w / 2} y1={topo + 120} x2={k.x + k.w / 2} y2={1300} stroke="#5b3f2c" strokeWidth={12} />
						<line x1={k.x} y1={topo + 120} x2={k.x + k.w / 2} y2={topo + 120 + (k.h - 120) * 0.33} stroke="#5b3f2c" strokeWidth={10} />
						<line x1={k.x + k.w} y1={topo + 120} x2={k.x + k.w / 2} y2={topo + 120 + (k.h - 120) * 0.33} stroke="#5b3f2c" strokeWidth={10} />
						{[0.25, 0.75].map((p) => <rect key={p} x={k.x + k.w * p - 30} y={topo + 120 + (k.h - 120) * 0.42} width={60} height={70} fill={noite > 0.5 ? '#ffd76a' : '#7fb7e8'} stroke={CONTORNO} strokeWidth={6} />)}
						<path d={`M${k.x + k.w / 2 - 40} 1300 V${1300 - 140} Q${k.x + k.w / 2} ${1300 - 190} ${k.x + k.w / 2 + 40} ${1300 - 140} V1300Z`} fill="#6b4a36" stroke={CONTORNO} strokeWidth={6} />
					</g>
				);
			})}
			{/* calçamento */}
			<rect y={1300} width={W} height={620} fill="#a89a86" />
			{Array.from({length: 40}).map((_, i) => (
				<ellipse key={i} cx={(i % 8) * 140 + (Math.floor(i / 8) % 2) * 70} cy={1340 + Math.floor(i / 8) * 120} rx={60} ry={24} fill="#988a76" stroke="rgba(0,0,0,0.15)" strokeWidth={3} />
			))}
			{noite > 0.5 && <rect width={W} height={H} fill="rgba(20,30,80,0.3)" />}
			{tinta && <rect width={W} height={H} fill={tinta} />}
			{children}
		</g>
	);
};

// props de "dançando" para o Personagem (braços pra cima, balanço)
export const danca = (f: number, i = 0, forca = 1) => ({
	bracoD: 130 + Math.sin(f * 0.5 + i) * 40 * forca,
	bracoE: 130 + Math.cos(f * 0.5 + i) * 40 * forca,
	cotoveloD: 20 + Math.sin(f * 0.7 + i) * 30,
	cotoveloE: 20 + Math.cos(f * 0.7 + i) * 30,
	inclinar: Math.sin(f * 0.35 + i) * 14 * forca,
});

export const Palco: React.FC<{k: number}> = ({k}) =>
	k > 0 ? (
		<g transform={`translate(540, 1500) scale(1, ${k})`}>
			<rect x={-460} y={-120} width={920} height={120} fill="#a8794a" stroke={CONTORNO} strokeWidth={10} />
			{Array.from({length: 8}).map((_, i) => <line key={i} x1={-460 + i * 115} y1={-120} x2={-460 + i * 115} y2={0} stroke="#7a5230" strokeWidth={6} />)}
			<rect x={-480} y={-140} width={960} height={30} fill="#c8935a" stroke={CONTORNO} strokeWidth={8} />
			{[-420, 0, 420].map((x) => <rect key={x} x={x - 20} y={0} width={40} height={140} fill="#7a5230" stroke={CONTORNO} strokeWidth={6} />)}
		</g>
	) : null;

export const Tambor: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<ellipse cx={0} cy={-60} rx={80} ry={26} fill="#f1ead8" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-80 -60 V40 Q0 70 80 40 V-60" fill="#c8323f" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-80 -40 L-20 40 L40 -40 L80 20" stroke="#f2c14e" strokeWidth={6} fill="none" />
	</g>
);

export const Flauta: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s}) rotate(-30)`}>
		<rect x={-10} y={-180} width={22} height={200} rx={8} fill="#c8935a" stroke={CONTORNO} strokeWidth={5} />
		{[0, 1, 2, 3].map((i) => <circle key={i} cx={1} cy={-140 + i * 36} r={5} fill={CONTORNO} />)}
	</g>
);

export const Notas: React.FC<{x: number; y: number}> = ({x, y}) => {
	const f = useCurrentFrame();
	return (
		<g>
			{[0, 1, 2].map((i) => {
				const t = ((f + i * 18) % 54) / 54;
				return (
					<g key={i} transform={`translate(${x + Math.sin(t * 6 + i) * 40 + i * 40}, ${y - t * 260})`} opacity={1 - t}>
						<ellipse cx={0} cy={0} rx={18} ry={13} fill={CONTORNO} transform="rotate(-20)" />
						<line x1={16} y1={-4} x2={16} y2={-70} stroke={CONTORNO} strokeWidth={6} />
						<path d="M16 -70 Q40 -60 36 -36" stroke={CONTORNO} strokeWidth={6} fill="none" />
					</g>
				);
			})}
		</g>
	);
};

export const Rolo: React.FC<{texto: string; s?: number}> = ({texto, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-260} y={-160} width={520} height={320} fill="#f6ead0" stroke={CONTORNO} strokeWidth={10} />
		<rect x={-290} y={-190} width={580} height={50} rx={25} fill="#d9c49a" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-290} y={140} width={580} height={50} rx={25} fill="#d9c49a" stroke={CONTORNO} strokeWidth={8} />
		<text x={0} y={-60} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={46} fill="#6b5a44">Diagnosis:</text>
		<text x={0} y={60} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={90} fill="#c8323f">{texto}</text>
	</g>
);

export const Chama: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s * (1 + Math.sin(f / 3) * 0.05)})`}>
			<path d="M0 -150 C60 -80 90 -40 70 20 C55 70 -55 70 -70 20 C-90 -40 -40 -60 -20 -110 C-10 -60 10 -60 0 -150Z" fill="#ff6a2a" stroke={CONTORNO} strokeWidth={8} />
			<path d="M0 -60 C30 -20 40 0 30 30 C20 50 -20 50 -30 30 C-40 0 -10 -20 0 -60Z" fill="#ffd23f" />
		</g>
	);
};

export const Guildhall: React.FC<{k: number}> = ({k}) =>
	k > 0 ? (
		<g transform={`translate(540, 1300) scale(${k})`}>
			<rect x={-300} y={-560} width={600} height={560} fill="#e9d8a6" stroke={CONTORNO} strokeWidth={10} />
			<path d="M-340 -560 L0 -800 L340 -560Z" fill="#7a3a2a" stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
			<path d="M-80 0 V-220 Q0 -300 80 -220 V0Z" fill="#6b4a36" stroke={CONTORNO} strokeWidth={8} />
			<rect x={-90} y={-470} width={180} height={60} fill="#c8323f" stroke={CONTORNO} strokeWidth={6} />
			<text x={0} y={-428} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill="#fff">HALL</text>
		</g>
	) : null;

// ícones de causas: pão (fome), doença, estresse
export const CestaVazia: React.FC = () => (
	<g>
		<path d="M-120 0 L-90 110 H90 L120 0Z" fill="#c8935a" stroke={CONTORNO} strokeWidth={8} />
		<path d="M-120 0 Q0 -140 120 0" stroke={CONTORNO} strokeWidth={8} fill="none" />
		<path d="M-60 40 l20 30 M0 40 l0 36 M60 40 l-20 30" stroke="#7a5230" strokeWidth={6} />
		<circle cx={-20} cy={-10} r={8} fill="#e9d8a6" />
	</g>
);
export const Doente: React.FC = () => (
	<g>
		<circle r={90} fill="#bfe3a0" stroke={CONTORNO} strokeWidth={8} />
		<path d="M-40 -20 L-16 -8 L-40 4 M40 -20 L16 -8 L40 4" stroke={CONTORNO} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M-30 40 Q0 20 30 40" stroke={CONTORNO} strokeWidth={7} fill="none" />
		<path d="M60 -60 Q70 -40 62 -30 Q52 -38 60 -60Z" fill="#8fd3ff" stroke={CONTORNO} strokeWidth={3} />
	</g>
);
export const Raio: React.FC = () => <path d="M20 -110 L-50 10 L0 10 L-20 110 L60 -20 L10 -20Z" fill="#ffd23f" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />;
