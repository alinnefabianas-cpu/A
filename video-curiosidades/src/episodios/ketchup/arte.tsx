import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

const Rosto: React.FC<{y?: number; feliz?: boolean; s?: number}> = ({y = 0, feliz = true, s = 1}) => (
	<g transform={`translate(0, ${y}) scale(${s})`}>
		<circle cx={-24} cy={-6} r={9} fill={CONTORNO} />
		<circle cx={24} cy={-6} r={9} fill={CONTORNO} />
		<circle cx={-21} cy={-9} r={3} fill="#fff" />
		<circle cx={27} cy={-9} r={3} fill="#fff" />
		{feliz ? <path d="M-18 14 Q0 30 18 14" stroke={CONTORNO} strokeWidth={6} fill="none" strokeLinecap="round" /> : <path d="M-16 22 Q0 10 16 22" stroke={CONTORNO} strokeWidth={6} fill="none" strokeLinecap="round" />}
	</g>
);

// frasco de ketchup genérico (sem marca)
export const Frasco: React.FC<{s?: number; rosto?: boolean}> = ({s = 1, rosto = true}) => (
	<g transform={`scale(${s})`}>
		<rect x={-34} y={-300} width={68} height={60} rx={10} fill="#f4f4f4" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-40 -240 L-90 -160 L-100 140 Q-100 180 -60 180 H60 Q100 180 100 140 L90 -160 L40 -240Z" fill="#d6262f" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
		<rect x={-80} y={-60} width={160} height={120} rx={14} fill="#f6ead0" stroke={CONTORNO} strokeWidth={6} />
		<text x={0} y={18} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="#d6262f">KETCHUP</text>
		<path d="M-70 -140 Q-60 -40 -66 100" stroke="rgba(255,255,255,0.35)" strokeWidth={16} fill="none" strokeLinecap="round" />
		{rosto && <Rosto y={-120} />}
	</g>
);

export const Tomate: React.FC<{s?: number; feliz?: boolean}> = ({s = 1, feliz = true}) => (
	<g transform={`scale(${s})`}>
		<circle r={110} fill="#e8392f" stroke={CONTORNO} strokeWidth={10} />
		<path d="M-60 -60 Q-40 -86 -10 -90" stroke="rgba(255,255,255,0.5)" strokeWidth={16} fill="none" strokeLinecap="round" />
		<path d="M0 -110 L-30 -140 L-6 -120 L0 -150 L6 -120 L30 -140Z" fill="#3c8a4a" stroke={CONTORNO} strokeWidth={6} strokeLinejoin="round" />
		<Rosto y={10} feliz={feliz} s={1.3} />
	</g>
);

export const Cogumelo: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-40} y={-20} width={80} height={120} rx={20} fill="#f1ead8" stroke={CONTORNO} strokeWidth={8} />
		<path d="M-130 0 Q-130 -140 0 -150 Q130 -140 130 0Z" fill="#8a5a3a" stroke={CONTORNO} strokeWidth={9} />
		{[-70, 0, 60].map((x, i) => <circle key={i} cx={x} cy={-80 + (i % 2) * 30} r={16} fill="#f1ead8" />)}
		<Rosto y={40} s={0.9} />
	</g>
);

export const PeixeK: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M80 0 L150 -60 L150 60Z" fill="#4aa3d8" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
		<ellipse cx={0} cy={0} rx={110} ry={64} fill="#7cc7ef" stroke={CONTORNO} strokeWidth={8} />
		<g transform="translate(-50, -6)"><Rosto s={0.8} /></g>
	</g>
);

// caixinha de pílulas de tomate
export const CaixaPilulas: React.FC<{s?: number; rotulo?: string; cor?: string}> = ({s = 1, rotulo = 'TOMATO PILLS', cor = '#c8323f'}) => (
	<g transform={`scale(${s})`}>
		<rect x={-160} y={-110} width={320} height={220} rx={16} fill="#f6ead0" stroke={CONTORNO} strokeWidth={9} />
		<rect x={-160} y={-110} width={320} height={60} rx={16} fill={cor} stroke={CONTORNO} strokeWidth={9} />
		<text x={0} y={-68} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={34} fill="#fff">{rotulo}</text>
		<text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={28} fill="#6b5a44">Cures Everything!*</text>
		<g transform="translate(-70, 55) scale(0.35)"><Tomate /></g>
		{[20, 70, 120].map((x) => <ellipse key={x} cx={x - 40} cy={60} rx={20} ry={14} fill="#e8392f" stroke={CONTORNO} strokeWidth={4} />)}
	</g>
);

export const Pilula: React.FC<{s?: number; aberta?: number; vazia?: boolean}> = ({s = 1, aberta = 0, vazia}) => (
	<g transform={`scale(${s})`}>
		<g transform={`translate(${-aberta * 70}, 0) rotate(${-aberta * 20})`}>
			<path d="M0 -60 H-80 A60 60 0 0 0 -80 60 H0Z" fill="#e8392f" stroke={CONTORNO} strokeWidth={9} />
		</g>
		<g transform={`translate(${aberta * 70}, 0) rotate(${aberta * 20})`}>
			<path d="M0 -60 H80 A60 60 0 0 1 80 60 H0Z" fill="#f6ead0" stroke={CONTORNO} strokeWidth={9} />
		</g>
		{aberta > 0.5 && (vazia ? <text x={0} y={18} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={40} fill="#9aa1ad">?</text> : <circle r={24} fill="#e8392f" />)}
	</g>
);

// loja / boticário dos anos 1830
export const Boticario: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#6b4a36" />
		{[420, 760].map((y) => (
			<g key={y}>
				<rect x={0} y={y} width={W} height={30} fill="#3e2a1d" />
				{Array.from({length: 7}).map((_, i) => {
					const x = 90 + i * 150, h = 110 + (i * 31) % 50;
					return (
						<g key={i}>
							<rect x={x - 34} y={y - h} width={68} height={h} rx={14} fill={['#3c8a4a', '#2f5bd3', '#b5651d', '#c8323f'][(i + y) % 4]} stroke={CONTORNO} strokeWidth={5} />
							<rect x={x - 26} y={y - h * 0.6} width={52} height={32} fill="#f6ead0" />
						</g>
					);
				})}
			</g>
		))}
		<rect y={1300} width={W} height={620} fill="#8a6a44" />
		<rect x={60} y={1180} width={960} height={140} fill="#5b3f2c" stroke={CONTORNO} strokeWidth={9} />
		{children}
	</g>
);

export const Cartaz: React.FC<{txt: string; s?: number; cor?: string}> = ({txt, s = 1, cor = '#f6ead0'}) => (
	<g transform={`scale(${s})`}>
		<line x1={0} y1={0} x2={0} y2={260} stroke="#6b4a36" strokeWidth={14} />
		<rect x={-180} y={-120} width={360} height={130} rx={10} fill={cor} stroke={CONTORNO} strokeWidth={8} />
		<text x={0} y={-38} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={44} fill="#c8323f">{txt}</text>
	</g>
);

export const Batatas: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			{Array.from({length: 7}).map((_, i) => (
				<rect key={i} x={-90 + i * 28} y={-200 - (i % 3) * 30 + Math.sin(f / 10 + i) * 3} width={22} height={200} rx={6} fill="#f2c14e" stroke={CONTORNO} strokeWidth={5} transform={`rotate(${(i - 3) * 5} ${-80 + i * 28} -100)`} />
			))}
			<path d="M-130 -80 L-100 120 H100 L130 -80Z" fill="#d6262f" stroke={CONTORNO} strokeWidth={9} />
			<path d="M-60 0 Q0 30 60 0" stroke="#fff" strokeWidth={10} fill="none" />
		</g>
	);
};
