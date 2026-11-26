import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

export const MELACO = '#5a2c0c';
export const MELACO_CLARO = '#8f4f1e';

// prédio de tijolos simples
const Predio: React.FC<{x: number; w: number; h: number; cor: string; amassa?: number}> = ({x, w, h, cor, amassa = 0}) => (
	<g transform={`translate(${x}, 1300) scale(${1 + amassa * 0.25}, ${1 - amassa * 0.45}) skewX(${amassa * -14})`}>
		<rect x={0} y={-h} width={w} height={h} fill={cor} stroke={CONTORNO} strokeWidth={8} />
		<rect x={-10} y={-h - 24} width={w + 20} height={30} fill="#5c3a2a" stroke={CONTORNO} strokeWidth={6} />
		{Array.from({length: Math.floor((h - 120) / 150) * 2}).map((_, i) => (
			<rect key={i} x={w * (i % 2 ? 0.58 : 0.16)} y={-h + 50 + Math.floor(i / 2) * 150} width={w * 0.26} height={90} fill="#f6e3a8" stroke={CONTORNO} strokeWidth={5} />
		))}
	</g>
);

// rua de Boston em 1919 com trilho elevado; estrago 0..1 entorta a viga
export const Rua: React.FC<{estrago?: number; amassa?: number; ceu?: string; semTrilho?: boolean; children?: React.ReactNode}> = ({estrago = 0, amassa = 0, ceu = '#bcd8ec', semTrilho, children}) => (
	<g>
		<rect width={W} height={H} fill={ceu} />
		<Predio x={-40} w={300} h={760} cor="#b0563a" />
		<Predio x={280} w={260} h={620} cor="#9a4a34" amassa={amassa} />
		<Predio x={560} w={280} h={820} cor="#c0683f" />
		<Predio x={860} w={260} h={680} cor="#a8503a" />
		<rect y={1300} width={W} height={620} fill="#8d8a86" />
		{Array.from({length: 40}).map((_, i) => <rect key={i} x={(i % 8) * 140 + (Math.floor(i / 8) % 2) * 70} y={1330 + Math.floor(i / 8) * 120} width={120} height={90} rx={20} fill="#7c7975" />)}
		{!semTrilho && (
			<g>
				{[100, 540, 980].map((x) => <rect key={x} x={x - 22} y={760} width={44} height={540} fill="#4a4f5a" stroke={CONTORNO} strokeWidth={6} />)}
				<path d={`M-20 700 L${540 - 40} ${700 + estrago * 160} L${540 + 40} ${700 + estrago * 160} L1100 700 L1100 770 L${540 + 40} ${770 + estrago * 170} L${540 - 40} ${770 + estrago * 170} L-20 770Z`} fill="#5d6470" stroke={CONTORNO} strokeWidth={8} />
				{Array.from({length: 14}).map((_, i) => {
					const x = i * 80;
					const d = estrago * 160 * Math.max(0, 1 - Math.abs(x - 540) / 520);
					return <line key={i} x1={x} y1={705 + d} x2={x + 40} y2={765 + d} stroke="#3a3f4a" strokeWidth={6} />;
				})}
			</g>
		)}
		{children}
	</g>
);

// trem elevado
export const Trem: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-220} y={-170} width={440} height={170} rx={22} fill="#2f6b45" stroke={CONTORNO} strokeWidth={8} />
		{[-160, -60, 40, 140].map((x) => <rect key={x} x={x} y={-140} width={70} height={60} rx={8} fill="#f6e3a8" stroke={CONTORNO} strokeWidth={5} />)}
		{[-140, 140].map((x) => <circle key={x} cx={x} cy={8} r={26} fill="#2a2e38" stroke={CONTORNO} strokeWidth={6} />)}
	</g>
);

// tanque gigante de melaço; racha 0..1, vaza (pingos), tinta 0..1 (pintado de marrom)
export const Tanque: React.FC<{racha?: number; vaza?: boolean; tinta?: number; s?: number}> = ({racha = 0, vaza = false, tinta = 0, s = 1}) => {
	const f = useCurrentFrame();
	const fendas = ['M-140 -560 l40 90 l-30 70 l50 100', 'M120 -420 l-30 80 l40 60 l-20 110', 'M-40 -300 l30 70 l-40 60 l30 80'];
	return (
		<g transform={`scale(${s})`}>
			<rect x={-260} y={-700} width={520} height={700} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={10} />
			<rect x={-260} y={-700} width={520} height={700 * tinta} fill="#6b3b1c" />
			<ellipse cx={0} cy={-700} rx={260} ry={50} fill="#b8bfca" stroke={CONTORNO} strokeWidth={10} />
			{[-560, -420, -280, -140].map((y) => (
				<g key={y}>
					<line x1={-260} y1={y} x2={260} y2={y} stroke={CONTORNO} strokeWidth={5} opacity={0.5} />
					{Array.from({length: 9}).map((_, i) => <circle key={i} cx={-230 + i * 57} cy={y} r={5} fill={CONTORNO} opacity={0.5} />)}
				</g>
			))}
			<text x={0} y={-600} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={66} fill={tinta > 0.9 ? '#e9c79a' : '#3a3f4a'}>MOLASSES</text>
			{racha > 0 && fendas.map((d, i) => <path key={i} d={d} stroke={CONTORNO} strokeWidth={9} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - racha)} strokeLinecap="round" />)}
			{vaza && [[-140, -470], [110, -340], [-30, -220]].map(([x, y], i) => {
				const t = ((f + i * 11) % 30) / 30;
				return (
					<g key={i} opacity={1 - tinta}>
						<path d={`M${x - 10} ${y} Q${x} ${y + 30} ${x + 10} ${y}`} fill={MELACO} />
						<path d={`M${x} ${y + 20 + t * 180} m-12 0 a12 16 0 1 0 24 0 l-12 -22Z`} fill={MELACO} stroke={CONTORNO} strokeWidth={3} />
					</g>
				);
			})}
		</g>
	);
};

// onda de melaço: frente em x (tudo à esquerda fica coberto), topo em alt (px acima do chão)
export const Onda: React.FC<{frente: number; alt: number; chao?: number}> = ({frente, alt, chao = 1920}) => {
	const f = useCurrentFrame();
	const topo = chao - alt;
	const pts = Array.from({length: 13}).map((_, i) => {
		const x = -60 + (i / 12) * (frente + 60);
		const y = topo + Math.sin(i * 1.3 + f / 4) * 26 - (i / 12) * 60;
		return `${x} ${y}`;
	});
	const crista = `M${frente - 60} ${topo - 60} Q${frente + 120} ${topo - 140} ${frente + 140} ${topo + 60} Q${frente + 60} ${topo + 10} ${frente + 40} ${topo + 120} L${frente + 40} ${chao + 40} L${frente - 60} ${chao + 40}Z`;
	return (
		<g>
			<path d={`M-60 ${chao + 40} L${pts.join(' L')} L${frente} ${chao + 40}Z`} fill={MELACO} stroke={CONTORNO} strokeWidth={10} />
			<path d={crista} fill={MELACO} stroke={CONTORNO} strokeWidth={10} />
			<path d={`M${frente - 20} ${topo - 50} Q${frente + 90} ${topo - 100} ${frente + 110} ${topo + 20}`} stroke={MELACO_CLARO} strokeWidth={18} fill="none" strokeLinecap="round" />
			{Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={((i * 173 + f * 3) % Math.max(frente, 1))} cy={topo + 80 + (i % 3) * 120} rx={46} ry={14} fill={MELACO_CLARO} opacity={0.6} />)}
		</g>
	);
};

// poça de melaço no chão
export const Poca: React.FC<{y?: number; alt?: number}> = ({y = 1500, alt = 420}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<path d={`M-40 ${y} Q 270 ${y - 30 + Math.sin(f / 10) * 8} 540 ${y} T 1120 ${y} V ${y + alt} H -40Z`} fill={MELACO} stroke={CONTORNO} strokeWidth={8} />
			{[200, 620, 900].map((x, i) => <ellipse key={x} cx={x} cy={y + 60 + i * 50} rx={70} ry={14} fill={MELACO_CLARO} opacity={0.6} />)}
		</g>
	);
};

export const Pa: React.FC = () => (
	<g>
		<rect x={-6} y={-200} width={12} height={220} fill="#a8794a" stroke={CONTORNO} strokeWidth={4} />
		<path d="M-40 10 h80 l-10 70 h-60Z" fill="#8a8f99" stroke={CONTORNO} strokeWidth={5} />
		<path d="M-34 40 h68 l-6 34 h-56Z" fill={MELACO} />
	</g>
);

export const Pincel: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-14} y={-180} width={28} height={140} rx={10} fill="#c8623a" stroke={CONTORNO} strokeWidth={6} />
		<rect x={-30} y={-48} width={60} height={30} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={6} />
		<path d="M-30 -18 h60 l-6 60 h-48Z" fill="#6b3b1c" stroke={CONTORNO} strokeWidth={6} />
	</g>
);

export const Calendario: React.FC<{txt: string}> = ({txt}) => (
	<g>
		<rect x={-120} y={-130} width={240} height={260} rx={18} fill="#fff" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-120} y={-130} width={240} height={70} rx={18} fill="#e8392f" stroke={CONTORNO} strokeWidth={8} />
		<text x={0} y={-80} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={40} fill="#fff">1919</text>
		<text x={0} y={70} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={96} fill="#241820">{txt}</text>
	</g>
);

export const Sol: React.FC<{x: number; y: number}> = ({x, y}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x}, ${y}) rotate(${f})`}>
			{Array.from({length: 12}).map((_, i) => <rect key={i} x={-10} y={-200} width={20} height={60} rx={10} fill="#ffb000" transform={`rotate(${i * 30})`} />)}
			<circle r={120} fill="#ffd23f" stroke="#e89b00" strokeWidth={10} />
		</g>
	);
};

// linhas de cheiro doce subindo
export const Cheiro: React.FC<{x: number; y: number}> = ({x, y}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x}, ${y})`}>
			{[-80, 0, 80].map((dx, i) => {
				const t = ((f + i * 12) % 40) / 40;
				return <path key={i} d={`M${dx} ${-t * 300} q 30 -40 0 -80 q -30 -40 0 -80`} stroke="#b0703a" strokeWidth={14} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI)} />;
			})}
		</g>
	);
};
