import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

export const AMARELO_BUS = '#f7b500';

// ---------- ônibus escolar moderno (de lado, para a direita) ----------
export const Onibus: React.FC<{s?: number; cor?: string; texto?: string; anda?: boolean}> = ({s = 1, cor = AMARELO_BUS, texto = 'SCHOOL BUS', anda = true}) => {
	const f = useCurrentFrame();
	const roda = anda ? f * 12 : 0;
	return (
		<g transform={`scale(${s}) translate(0, ${anda ? Math.sin(f * 0.9) * 3 : 0})`}>
			<path d="M-440 -320 Q-440 -360 -400 -360 L300 -360 Q350 -360 360 -320 L380 -200 L440 -180 Q460 -175 460 -150 L460 -40 L-440 -40Z" fill={cor} stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
			{Array.from({length: 7}).map((_, i) => <rect key={i} x={-410 + i * 96} y={-320} width={78} height={88} rx={8} fill="#bfe3ff" stroke={CONTORNO} strokeWidth={6} />)}
			<path d="M280 -320 L340 -320 L356 -210 L280 -210Z" fill="#bfe3ff" stroke={CONTORNO} strokeWidth={6} />
			<rect x={-440} y={-200} width={880} height={18} fill="#1a1a1a" />
			<rect x={-440} y={-150} width={880} height={14} fill="#1a1a1a" />
			<text x={-60} y={-108} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={50} fill="#1a1a1a">{texto}</text>
			<rect x={440} y={-120} width={30} height={60} fill="#1a1a1a" />
			<circle cx={450} cy={-160} r={14} fill="#fff4a8" stroke={CONTORNO} strokeWidth={5} />
			{/* braço de PARE */}
			<g transform="translate(-120, -260)">
				<polygon points="-34,-80 34,-80 80,-34 80,34 34,80 -34,80 -80,34 -80,-34" transform="scale(0.55)" fill="#d6262f" stroke="#fff" strokeWidth={8} />
			</g>
			{[-290, 300].map((x) => (
				<g key={x} transform={`translate(${x}, -40) rotate(${roda})`}>
					<circle r={62} fill="#222" stroke={CONTORNO} strokeWidth={8} />
					<circle r={26} fill="#9aa1ad" />
					<line x1={-26} y1={0} x2={26} y2={0} stroke={CONTORNO} strokeWidth={6} />
				</g>
			))}
		</g>
	);
};

// ---------- ônibus antigos de formatos variados ----------
export const OnibusAntigo: React.FC<{cor: string; tipo: number; s?: number}> = ({cor, tipo, s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) translate(0, ${Math.sin(f * 0.8 + tipo) * 4})`}>
			{tipo === 0 && (
				// caminhão com caixa de madeira
				<g>
					<rect x={-260} y={-300} width={340} height={230} fill={cor} stroke={CONTORNO} strokeWidth={9} />
					{[0, 1, 2].map((i) => <rect key={i} x={-240 + i * 105} y={-280} width={80} height={70} fill="#bfe3ff" stroke={CONTORNO} strokeWidth={5} />)}
					<path d="M80 -70 L80 -220 L170 -220 L210 -140 L230 -70Z" fill="#555" stroke={CONTORNO} strokeWidth={9} />
				</g>
			)}
			{tipo === 1 && (
				// "carroça" de crianças
				<g>
					<path d="M-250 -80 L-250 -260 Q0 -340 250 -260 L250 -80Z" fill={cor} stroke={CONTORNO} strokeWidth={9} />
					{[0, 1, 2, 3].map((i) => <circle key={i} cx={-170 + i * 115} cy={-200} r={32} fill="#bfe3ff" stroke={CONTORNO} strokeWidth={5} />)}
				</g>
			)}
			{tipo === 2 && (
				// ônibus arredondado
				<g>
					<path d="M-260 -70 L-260 -230 Q-260 -300 -180 -300 L160 -300 Q260 -300 260 -200 L260 -70Z" fill={cor} stroke={CONTORNO} strokeWidth={9} />
					{[0, 1, 2, 3].map((i) => <rect key={i} x={-220 + i * 110} y={-270} width={80} height={70} rx={14} fill="#bfe3ff" stroke={CONTORNO} strokeWidth={5} />)}
				</g>
			)}
			{[-170, 170].map((x) => (
				<g key={x} transform={`translate(${x}, -60) rotate(${f * 10})`}>
					<circle r={48} fill="#222" stroke={CONTORNO} strokeWidth={7} />
					<line x1={-30} y1={0} x2={30} y2={0} stroke="#9aa1ad" strokeWidth={6} />
					<line x1={0} y1={-30} x2={0} y2={30} stroke="#9aa1ad" strokeWidth={6} />
				</g>
			))}
		</g>
	);
};

// ---------- rua com céu ajustável (dia / amanhecer) ----------
export const RuaEscola: React.FC<{amanhecer?: number; children?: React.ReactNode}> = ({amanhecer = 0, children}) => (
	<g>
		<defs>
			<linearGradient id="ceuEscola" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={amanhecer > 0.5 ? '#2b2f6b' : '#86c5f0'} />
				<stop offset="1" stopColor={amanhecer > 0.5 ? '#f29a5a' : '#e6f4fc'} />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="url(#ceuEscola)" />
		{/* escola ao fundo */}
		<g transform="translate(540, 1150)">
			<rect x={-380} y={-420} width={760} height={420} fill={amanhecer > 0.5 ? '#8a5a4a' : '#c96a4a'} stroke={CONTORNO} strokeWidth={8} />
			<path d="M-420 -420 L0 -560 L420 -420Z" fill="#6b3a2a" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
			{[-280, -140, 140, 280].map((x) => <rect key={x} x={x - 45} y={-330} width={90} height={110} fill={amanhecer > 0.5 ? '#ffd76a' : '#bfe3ff'} stroke={CONTORNO} strokeWidth={6} />)}
			<rect x={-60} y={-180} width={120} height={180} fill="#6b4a36" stroke={CONTORNO} strokeWidth={6} />
			<line x1={300} y1={-560} x2={300} y2={-760} stroke={CONTORNO} strokeWidth={8} />
			<rect x={300} y={-760} width={120} height={70} fill="#2f5bd3" stroke={CONTORNO} strokeWidth={6} />
		</g>
		<rect y={1150} width={W} height={90} fill="#c9c9c9" stroke={CONTORNO} strokeWidth={6} />
		<rect y={1240} width={W} height={680} fill="#4a4d55" />
		{Array.from({length: 6}).map((_, i) => <rect key={i} x={20 + i * 190} y={1560} width={110} height={18} fill="#f2c14e" />)}
		{amanhecer > 0.5 && <rect width={W} height={H} fill="rgba(30,20,60,0.35)" />}
		{children}
	</g>
);

// ---------- parede de amostras de tinta ----------
export const ParedeTintas: React.FC<{n: number; destaque?: number}> = ({n, destaque = -1}) => {
	const f = useCurrentFrame();
	const cor = (i: number) => {
		const t = i / 49;
		// do amarelo-limão (#f5f04a) ao laranja-avermelhado (#e8461f)
		const a = [245, 240, 74], b = [232, 70, 31];
		return `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * t)).join(',')})`;
	};
	return (
		<g>
			<rect width={W} height={H} fill="#efe6d4" />
			<rect y={1500} width={W} height={420} fill="#a8794a" />
			{Array.from({length: Math.min(50, n)}).map((_, i) => {
				const col = i % 10, row = Math.floor(i / 10);
				const sel = i === destaque;
				return (
					<g key={i} transform={`translate(${70 + col * 96}, ${380 + row * 200})`}>
						<rect x={0} y={sel ? -10 + Math.sin(f / 4) * 4 : 0} width={80} height={170} rx={8} fill={cor(i)} stroke={sel ? '#000' : CONTORNO} strokeWidth={sel ? 12 : 5} />
					</g>
				);
			})}
		</g>
	);
};
export const CORAMOSTRA = (i: number) => {
	const t = i / 49;
	const a = [245, 240, 74], b = [232, 70, 31];
	return `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * t)).join(',')})`;
};

// ---------- visão do motorista (para-brisa) com ônibus no canto ----------
export const VisaoMotorista: React.FC<{destaque: number}> = ({destaque}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#86c5f0" />
			<rect y={900} width={W} height={1020} fill="#4a4d55" />
			<path d="M440 900 L640 900 L1080 1920 L0 1920Z" fill="#5a5d66" />
			{Array.from({length: 5}).map((_, i) => {
				const t = ((f * 0.03 + i / 5) % 1);
				return <rect key={i} x={530 - t * 20} y={920 + t * t * 900} width={20 + t * 40} height={30 + t * 80} fill="#f2c14e" />;
			})}
			{/* painel do carro */}
			<path d="M0 1500 Q540 1380 1080 1500 V1920 H0Z" fill="#2a2e3a" stroke={CONTORNO} strokeWidth={10} />
			<circle cx={540} cy={1760} r={230} fill="none" stroke="#1a1a1a" strokeWidth={36} />
			{/* moldura do para-brisa */}
			<rect x={0} y={0} width={W} height={H} fill="none" stroke="#1a1a1a" strokeWidth={60} />
			{/* foco suave no centro, borrado nas bordas (visão periférica) */}
			<defs>
				<radialGradient id="periferia" cx="0.5" cy="0.5" r="0.7">
					<stop offset="0.45" stopColor="rgba(0,0,0,0)" />
					<stop offset="1" stopColor="rgba(0,0,0,0.55)" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#periferia)" />
			{destaque > 0 && <circle cx={150} cy={1040} r={200 + 10 * Math.sin(f / 3)} fill="none" stroke="#ffd23f" strokeWidth={12} strokeDasharray="24 14" opacity={destaque} />}
		</g>
	);
};

export const LivroLei: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-200} y={-260} width={400} height={520} rx={12} fill="#22397a" stroke={CONTORNO} strokeWidth={10} />
		<rect x={-200} y={-260} width={40} height={520} fill="#1a2c5c" stroke={CONTORNO} strokeWidth={6} />
		<text x={20} y={-150} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill="#f2c14e">FEDERAL</text>
		<text x={20} y={-90} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill="#f2c14e">LAW</text>
		<path d="M-60 40 L20 -20 L100 40 M-40 60 H80 M20 -20 V90" stroke="#f2c14e" strokeWidth={8} fill="none" />
	</g>
);

export const Lupa: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<circle r={90} fill="rgba(200,235,255,0.4)" stroke={CONTORNO} strokeWidth={14} />
		<line x1={64} y1={64} x2={160} y2={160} stroke={CONTORNO} strokeWidth={26} strokeLinecap="round" />
	</g>
);
