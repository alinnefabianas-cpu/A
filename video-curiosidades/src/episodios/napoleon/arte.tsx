import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

// ---------- salão do palácio ----------
export const Salao: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<defs>
			<linearGradient id="paredeSalao" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#7a2f3a" />
				<stop offset="1" stopColor="#4e1c26" />
			</linearGradient>
			<linearGradient id="pisoSalao" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#c9a26a" />
				<stop offset="1" stopColor="#8a6a44" />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="url(#paredeSalao)" />
		{/* colunas e molduras douradas */}
		{[60, 1020].map((x) => (
			<g key={x}>
				<rect x={x - 50} y={200} width={100} height={1300} fill="#e9d8a6" stroke={CONTORNO} strokeWidth={8} />
				{[0, 1, 2].map((i) => <line key={i} x1={x - 30 + i * 30} y1={230} x2={x - 30 + i * 30} y2={1470} stroke="#c9b27a" strokeWidth={6} />)}
				<rect x={x - 70} y={170} width={140} height={50} fill="#d8c48a" stroke={CONTORNO} strokeWidth={8} />
			</g>
		))}
		{[[300, 360], [780, 360]].map(([x, y]) => (
			<rect key={x} x={x - 120} y={y} width={240} height={300} rx={10} fill="none" stroke="#c9a227" strokeWidth={12} />
		))}
		{/* lustre */}
		<g transform="translate(540, 120)">
			<line x1={0} y1={-120} x2={0} y2={0} stroke="#c9a227" strokeWidth={6} />
			<path d="M-140 0 Q0 90 140 0" stroke="#c9a227" strokeWidth={10} fill="none" />
			{[-140, -70, 0, 70, 140].map((x) => (
				<g key={x}>
					<rect x={x - 8} y={x === 0 ? 40 : 10} width={16} height={36} fill="#fff8e0" />
					<ellipse cx={x} cy={x === 0 ? 30 : 0} rx={10} ry={16} fill="#ffd23f" />
				</g>
			))}
		</g>
		<rect y={1500} width={W} height={420} fill="url(#pisoSalao)" />
		{Array.from({length: 8}).map((_, i) => <line key={i} x1={i * 160} y1={1500} x2={i * 160 - 200} y2={1920} stroke="rgba(0,0,0,0.12)" strokeWidth={6} />)}
		<rect x={340} y={1500} width={400} height={420} fill="#a5262f" opacity={0.85} />
		{children}
	</g>
);

// ---------- régua de altura na parede ----------
export const ReguaAltura: React.FC<{x: number; marca: string; yMarca: number}> = ({x, marca, yMarca}) => (
	<g>
		<rect x={x - 60} y={500} width={120} height={1000} fill="#f6ead0" stroke={CONTORNO} strokeWidth={8} />
		{Array.from({length: 21}).map((_, i) => (
			<line key={i} x1={x - 60} y1={520 + i * 47} x2={x - (i % 2 ? 30 : 10)} y2={520 + i * 47} stroke={CONTORNO} strokeWidth={i % 2 ? 4 : 7} />
		))}
		<g transform={`translate(${x - 60}, ${yMarca})`}>
			<path d="M0 0 L40 -22 L40 22Z" fill="#e8262f" stroke={CONTORNO} strokeWidth={5} />
			<rect x={-204} y={-46} width={200} height={92} rx={16} fill="#e8262f" stroke="#000" strokeWidth={8} />
			<text x={-104} y={20} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#fff">{marca}</text>
		</g>
	</g>
);

// ---------- pergaminho com pena escrevendo ----------
export const Pergaminho: React.FC<{texto: string; prog: number}> = ({texto, prog}) => {
	const f = useCurrentFrame();
	const n = Math.floor(texto.length * prog);
	return (
		<g>
			<path d="M-340 -420 H340 V420 H-340Z" fill="#f6ead0" stroke={CONTORNO} strokeWidth={12} />
			<rect x={-380} y={-460} width={760} height={70} rx={35} fill="#d9c49a" stroke={CONTORNO} strokeWidth={10} />
			<rect x={-380} y={390} width={760} height={70} rx={35} fill="#d9c49a" stroke={CONTORNO} strokeWidth={10} />
			{Array.from({length: 4}).map((_, i) => <rect key={i} x={-260} y={-300 + i * 60} width={i % 2 ? 380 : 520} height={18} rx={9} fill="#cbb98f" />)}
			<text x={-260} y={-40} fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#6b5a44">HEIGHT:</text>
			<text x={0} y={180} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={200} fill="#22397a">{texto.slice(0, n)}</text>
			<g transform={`translate(${-120 + n * 70}, ${110 + Math.sin(f) * 6}) rotate(-35)`}>
				<path d="M0 0 L20 -40 Q60 -200 20 -320 Q-30 -200 -10 -40Z" fill="#fff" stroke={CONTORNO} strokeWidth={6} />
				<line x1={5} y1={0} x2={10} y2={-300} stroke={CONTORNO} strokeWidth={4} />
			</g>
		</g>
	);
};

// ---------- comparação de polegadas ----------
export const Polegadas: React.FC<{prog: number; destaque: number}> = ({prog, destaque}) => {
	const ing = 400, fr = ing * 1.066;
	const barra = (y: number, w: number, cor: string, rot: string, tricolor?: boolean) => (
		<g transform={`translate(-330, ${y})`}>
			{tricolor ? (
				<>
					<rect x={0} y={-50} width={(w * prog) / 3} height={100} fill="#2f5bd3" />
					<rect x={(w * prog) / 3} y={-50} width={(w * prog) / 3} height={100} fill="#fff" />
					<rect x={(2 * w * prog) / 3} y={-50} width={(w * prog) / 3} height={100} fill="#e8262f" />
				</>
			) : (
				<rect x={0} y={-50} width={w * prog} height={100} fill={cor} />
			)}
			<rect x={0} y={-50} width={w * prog} height={100} fill="none" stroke={CONTORNO} strokeWidth={9} />
			{Array.from({length: 9}).map((_, i) => <line key={i} x1={(w * prog * i) / 8} y1={-50} x2={(w * prog * i) / 8} y2={i % 2 ? -20 : 0} stroke={CONTORNO} strokeWidth={5} />)}
			<text x={0} y={-80} fontFamily="Nunito" fontWeight={900} fontSize={62} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">{rot}</text>
		</g>
	);
	return (
		<g>
			{barra(-160, fr * 1.5, '#fff', '1 FRENCH INCH', true)}
			{barra(170, ing * 1.5, '#f2c14e', '1 ENGLISH INCH')}
			{destaque > 0 && (
				<g opacity={destaque}>
					<rect x={-330 + ing * 1.5} y={-230} width={(fr - ing) * 1.5} height={460} fill="rgba(255,210,63,0.3)" stroke="#ffd23f" strokeWidth={8} strokeDasharray="18 10" />
					<text x={-330 + ing * 1.5 + (fr - ing) * 1.5} y={-330} textAnchor="end" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#ffd23f" stroke="#000" strokeWidth={12} paintOrder="stroke">LONGER</text>
				</g>
			)}
		</g>
	);
};

// ---------- cavalete com a caricatura ----------
export const Cavalete: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<path d="M-260 520 L-180 -420 M260 520 L180 -420 M0 520 L0 -300" stroke="#7a4a2a" strokeWidth={22} strokeLinecap="round" />
		<rect x={-300} y={-440} width={600} height={640} fill="#fdf7ea" stroke={CONTORNO} strokeWidth={12} />
		<rect x={-320} y={200} width={640} height={30} fill="#7a4a2a" stroke={CONTORNO} strokeWidth={6} />
		<clipPath id="tela"><rect x={-290} y={-430} width={580} height={620} /></clipPath>
		<g clipPath="url(#tela)">{children}</g>
	</g>
);

export const Faixa: React.FC<{texto: string; k: number}> = ({texto, k}) => (
	<g transform={`scale(${k})`}>
		<path d="M-480 -80 H480 L440 0 L480 80 H-480 L-440 0Z" fill="#c8323f" stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
		<text x={0} y={26} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={78} fill="#fff">{texto}</text>
	</g>
);

export const Jornal: React.FC<{titulo: string}> = ({titulo}) => (
	<g>
		<rect x={-280} y={-360} width={560} height={720} fill="#f1ede2" stroke={CONTORNO} strokeWidth={10} />
		<text x={0} y={-280} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill={CONTORNO}>THE DAILY SATIRE</text>
		<line x1={-250} y1={-250} x2={250} y2={-250} stroke={CONTORNO} strokeWidth={6} />
		<text x={0} y={-160} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill="#c8323f">{titulo}</text>
		{Array.from({length: 7}).map((_, i) => <rect key={i} x={-250} y={-90 + i * 56} width={i % 3 === 2 ? 300 : 500} height={20} fill="#bdb6a4" />)}
	</g>
);
