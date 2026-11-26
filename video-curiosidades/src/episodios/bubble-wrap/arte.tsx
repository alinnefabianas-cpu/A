import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

// folha de plástico-bolha; estouradas: lista de índices já estourados
export const FolhaBolhas: React.FC<{cols: number; lins: number; r?: number; cor?: string; estouradas?: number[]; brilho?: boolean}> = ({cols, lins, r = 34, cor = 'rgba(210,240,255,0.55)', estouradas = [], brilho = true}) => {
	const passo = r * 2.3;
	return (
		<g>
			<rect x={-r * 1.4} y={-r * 1.4} width={(cols - 1) * passo + r * 2.8} height={(lins - 1) * passo + r * 2.8} rx={14} fill="rgba(220,245,255,0.35)" stroke="rgba(120,170,200,0.8)" strokeWidth={5} />
			{Array.from({length: cols * lins}).map((_, i) => {
				const x = (i % cols) * passo + (Math.floor(i / cols) % 2) * (passo / 2) * 0, y = Math.floor(i / cols) * passo;
				const pop = estouradas.includes(i);
				return pop ? (
					<path key={i} d={`M${x - r * 0.7} ${y} q ${r * 0.35} ${-r * 0.3} ${r * 0.7} 0 q ${r * 0.35} ${r * 0.3} ${r * 0.7} 0`} stroke="rgba(120,170,200,0.9)" strokeWidth={4} fill="none" />
				) : (
					<g key={i}>
						<circle cx={x} cy={y} r={r} fill={cor} stroke="rgba(120,170,200,0.9)" strokeWidth={4} />
						{brilho && <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.28} ry={r * 0.16} fill="#fff" opacity={0.9} transform={`rotate(-30 ${x - r * 0.35} ${y - r * 0.4})`} />}
					</g>
				);
			})}
		</g>
	);
};

// oficina dos anos 1950
export const Oficina: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#cdbf9e" />
		<rect x={120} y={260} width={360} height={260} fill="#9fc3e0" stroke={CONTORNO} strokeWidth={10} />
		<line x1={300} y1={260} x2={300} y2={520} stroke={CONTORNO} strokeWidth={8} />
		{/* quadro de ferramentas */}
		<rect x={600} y={240} width={380} height={300} fill="#a8794a" stroke={CONTORNO} strokeWidth={8} />
		{[[660, 320, 'M0 0 l0 90 M-20 0 h40'], [760, 310, 'M0 0 l0 110'], [860, 320, 'M-24 0 h48 M0 0 l0 90']].map(([x, y, d], i) => <path key={i} d={d as string} transform={`translate(${x}, ${y})`} stroke="#3a3f4a" strokeWidth={14} strokeLinecap="round" fill="none" />)}
		<rect y={1250} width={W} height={670} fill="#8a7a62" />
		<rect x={60} y={1150} width={960} height={120} fill="#7a5230" stroke={CONTORNO} strokeWidth={9} />
		{children}
	</g>
);

// cortina de chuveiro (estampada); bolhas: 0..1
export const Cortina: React.FC<{x: number; cor: string; ang?: number}> = ({x, cor, ang = 0}) => (
	<g transform={`translate(${x}, 0) rotate(${ang})`}>
		<line x1={-180} y1={-10} x2={180} y2={-10} stroke="#9aa1ad" strokeWidth={14} strokeLinecap="round" />
		{[-150, -90, -30, 30, 90, 150].map((cx) => <circle key={cx} cx={cx} cy={-10} r={10} fill="none" stroke={CONTORNO} strokeWidth={4} />)}
		<path d="M-170 0 Q-150 300 -175 560 L175 560 Q150 300 170 0Z" fill={cor} stroke={CONTORNO} strokeWidth={8} opacity={0.9} />
		{Array.from({length: 12}).map((_, i) => <circle key={i} cx={-120 + (i % 4) * 80} cy={80 + Math.floor(i / 4) * 160} r={22} fill="rgba(255,255,255,0.45)" />)}
	</g>
);

// sala com papel de parede de bolhas
export const SalaBolhas: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#e9d3b6" />
		<g transform="translate(60, 120)" opacity={0.9}><FolhaBolhas cols={12} lins={14} r={36} cor="rgba(255,255,255,0.4)" /></g>
		<rect y={1250} width={W} height={670} fill="#a8794a" />
		<rect y={1240} width={W} height={24} fill="#6b4a36" />
		{/* sofá e quadro */}
		<g transform="translate(540, 1300)">
			<rect x={-300} y={-120} width={600} height={160} rx={40} fill="#c8623a" stroke={CONTORNO} strokeWidth={9} />
			<rect x={-340} y={-60} width={80} height={140} rx={30} fill="#b5532e" stroke={CONTORNO} strokeWidth={8} />
			<rect x={260} y={-60} width={80} height={140} rx={30} fill="#b5532e" stroke={CONTORNO} strokeWidth={8} />
		</g>
		<rect x={400} y={420} width={280} height={200} fill="#f6ead0" stroke="#c9a227" strokeWidth={14} />
		<path d="M420 600 L500 500 L560 560 L620 480 L660 600Z" fill="#6b8a5a" />
		{children}
	</g>
);

// estufa
export const Estufa: React.FC<{embrulhada?: number; children?: React.ReactNode}> = ({embrulhada = 0, children}) => (
	<g>
		<rect width={W} height={H} fill="#bfe3ff" />
		<circle cx={850} cy={260} r={100} fill="#fff1a8" />
		<rect y={1150} width={W} height={770} fill="#7fb35a" />
		<g transform="translate(540, 1200)">
			<path d="M-380 0 V-420 L0 -640 L380 -420 V0Z" fill="rgba(220,245,255,0.5)" stroke="#6f8a9a" strokeWidth={12} />
			{[-190, 0, 190].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={x === 0 ? -640 : -530} stroke="#6f8a9a" strokeWidth={8} />)}
			<line x1={-380} y1={-210} x2={380} y2={-210} stroke="#6f8a9a" strokeWidth={8} />
			{[-280, -120, 60, 220].map((x, i) => (
				<g key={x} transform={`translate(${x}, -30)`}>
					<path d="M-34 0 L-26 -60 H26 L34 0Z" fill="#c8623a" stroke={CONTORNO} strokeWidth={5} />
					<path d={`M0 -60 Q-30 -${130 + i * 10} 0 -${170 + i * 10} Q30 -${130 + i * 10} 0 -60`} fill="#3c8a4a" stroke={CONTORNO} strokeWidth={4} />
				</g>
			))}
			{embrulhada > 0 && (
				<g opacity={embrulhada}>
					<clipPath id="estufaClip"><path d="M-380 0 V-420 L0 -640 L380 -420 V0Z" /></clipPath>
					<g clipPath="url(#estufaClip)" transform="translate(-380, -640)"><FolhaBolhas cols={10} lins={9} r={34} brilho={false} /></g>
				</g>
			)}
		</g>
		{children}
	</g>
);

// computador antigo (mainframe genérico) dentro da caixa
export const Computador: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<rect x={-220} y={-440} width={440} height={440} rx={14} fill="#9aa6b8" stroke={CONTORNO} strokeWidth={10} />
			{[-110, 110].map((x) => (
				<g key={x} transform={`translate(${x}, -320)`}>
					<circle r={70} fill="#2a2e38" stroke={CONTORNO} strokeWidth={6} />
					<g transform={`rotate(${f * 6 * (x > 0 ? 1 : -1)})`}><circle r={46} fill="#4a4f5c" /><rect x={-6} y={-46} width={12} height={92} fill="#2a2e38" /></g>
				</g>
			))}
			<rect x={-180} y={-200} width={360} height={150} rx={10} fill="#2a2e38" stroke={CONTORNO} strokeWidth={6} />
			{Array.from({length: 18}).map((_, i) => <circle key={i} cx={-150 + (i % 9) * 37} cy={-160 + Math.floor(i / 9) * 60} r={10} fill={(i + Math.floor(f / 6)) % 4 === 0 ? '#ff4d3a' : (i % 3 ? '#ffd23f' : '#5aff7a')} />)}
		</g>
	);
};

export const Caixa: React.FC<{aberta?: boolean; children?: React.ReactNode}> = ({aberta = true, children}) => (
	<g>
		<rect x={-300} y={-260} width={600} height={300} fill="#c8935a" stroke={CONTORNO} strokeWidth={10} />
		{children}
		<rect x={-300} y={-120} width={600} height={160} fill="#c8935a" stroke={CONTORNO} strokeWidth={10} />
		<text x={0} y={-30} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#7a3a1a">FRAGILE</text>
		{aberta && (
			<g>
				<path d="M-300 -260 L-360 -380 L-60 -380 L0 -260Z" fill="#d9a46a" stroke={CONTORNO} strokeWidth={8} />
				<path d="M300 -260 L360 -380 L60 -380 L0 -260Z" fill="#d9a46a" stroke={CONTORNO} strokeWidth={8} />
			</g>
		)}
	</g>
);

export const Dedo: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-40 -260 Q-40 -300 0 -300 Q40 -300 40 -260 L40 0 L-40 0Z" fill="#f2c9a0" stroke={CONTORNO} strokeWidth={9} />
		<path d="M-24 -270 Q0 -282 24 -270" stroke="#e0a880" strokeWidth={6} fill="none" />
		<rect x={-70} y={0} width={140} height={200} rx={40} fill="#f2c9a0" stroke={CONTORNO} strokeWidth={9} />
	</g>
);
