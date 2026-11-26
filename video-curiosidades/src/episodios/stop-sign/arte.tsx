import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

const octogono = (r: number) =>
	Array.from({length: 8})
		.map((_, i) => {
			const a = (Math.PI / 8) * (2 * i + 1);
			return `${Math.cos(a) * r},${Math.sin(a) * r}`;
		})
		.join(' ');

// placa de PARE (cor e texto variáveis), centro em 0,0
export const PlacaPare: React.FC<{cor?: string; corTexto?: string; s?: number; texto?: string; costas?: boolean; borda?: string}> = ({cor = '#d6262f', corTexto = '#fff', s = 1, texto = 'STOP', costas, borda = '#fff'}) => (
	<g transform={`scale(${s})`}>
		<polygon points={octogono(200)} fill={costas ? '#9aa1ad' : cor} stroke={CONTORNO} strokeWidth={12} />
		{!costas && <polygon points={octogono(176)} fill="none" stroke={borda} strokeWidth={12} />}
		{!costas && (
			<text x={0} y={44} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={128} fill={corTexto} letterSpacing={2}>
				{texto}
			</text>
		)}
		{costas && (
			<g stroke="#6f7686" strokeWidth={8}>
				<rect x={-26} y={-160} width={52} height={320} fill="#7a808c" />
				<circle cx={0} cy={-100} r={12} fill="#555" />
				<circle cx={0} cy={100} r={12} fill="#555" />
			</g>
		)}
	</g>
);

// placa antiga: quadrada branca com letras pretas
export const PlacaAntiga: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-170} y={-170} width={340} height={340} fill="#f4f1e8" stroke={CONTORNO} strokeWidth={12} />
		<text x={0} y={40} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={110} fill="#1a1a1a">STOP</text>
	</g>
);

export const Poste: React.FC<{altura?: number}> = ({altura = 700}) => <rect x={-16} y={0} width={32} height={altura} fill="#8a9099" stroke={CONTORNO} strokeWidth={6} />;

// formas da regra "mais lados = mais perigo"
export const Forma: React.FC<{tipo: 'circulo' | 'octogono' | 'losango' | 'retangulo'; s?: number; cor?: string; rotulo?: string}> = ({tipo, s = 1, cor = '#f2c14e', rotulo}) => (
	<g transform={`scale(${s})`}>
		{tipo === 'circulo' && (
			<g>
				<circle r={150} fill={cor} stroke={CONTORNO} strokeWidth={12} />
				<path d="M-106 -106 L106 106 M106 -106 L-106 106" stroke={CONTORNO} strokeWidth={22} />
				<text x={-62} y={18} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={64} fill={CONTORNO}>R</text>
				<text x={62} y={18} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={64} fill={CONTORNO}>R</text>
			</g>
		)}
		{tipo === 'octogono' && <PlacaPare s={0.75} />}
		{tipo === 'losango' && <rect x={-110} y={-110} width={220} height={220} fill={cor} stroke={CONTORNO} strokeWidth={12} transform="rotate(45)" />}
		{tipo === 'retangulo' && <rect x={-120} y={-150} width={240} height={300} fill="#fff" stroke={CONTORNO} strokeWidth={12} />}
		{rotulo && (
			<text x={0} y={220} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#fff" stroke="#000" strokeWidth={9} paintOrder="stroke">
				{rotulo}
			</text>
		)}
	</g>
);

// ---------- cruzamento / estrada ----------
export const Cruzamento: React.FC<{antigo?: boolean; children?: React.ReactNode}> = ({antigo, children}) => (
	<g>
		<defs>
			<linearGradient id="ceuCruz" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={antigo ? '#d9c49a' : '#86c5f0'} />
				<stop offset="1" stopColor={antigo ? '#f1e6cf' : '#e6f4fc'} />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="url(#ceuCruz)" />
		{[[0, 420], [180, 560], [360, 380], [620, 500], [820, 640]].map(([x, h], i) => (
			<g key={i}>
				<rect x={x} y={1150 - h} width={200} height={h} fill={antigo ? ['#b8957a', '#a8826a', '#c4a184'][i % 3] : ['#c96a4a', '#9aa6b8', '#e0b04a'][i % 3]} stroke={CONTORNO} strokeWidth={7} />
				{Array.from({length: Math.floor(h / 120)}).map((_, r) => [0, 1].map((k) => <rect key={`${r}-${k}`} x={x + 40 + k * 80} y={1150 - h + 40 + r * 120} width={40} height={60} fill={antigo ? '#f1e6cf' : '#bfe3ff'} />))}
			</g>
		))}
		<rect y={1150} width={W} height={90} fill="#c9c9c9" stroke={CONTORNO} strokeWidth={6} />
		<rect y={1240} width={W} height={680} fill={antigo ? '#8a7a66' : '#4a4d55'} />
		{!antigo && Array.from({length: 7}).map((_, i) => <rect key={i} x={30 + i * 160} y={1560} width={100} height={16} fill="#fff" />)}
		{children}
	</g>
);

// carro antigo (anos 1910) e carro moderno, de lado para a direita
export const CarroVelho: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) translate(0, ${Math.sin(f * 1.1) * 4})`}>
			{[-150, 150].map((x) => (
				<g key={x} transform={`translate(${x}, -80) rotate(${f * 12})`}>
					<circle r={80} fill="#2a2a2a" stroke={CONTORNO} strokeWidth={8} />
					<circle r={64} fill="#e9d8a6" />
					{[0, 45, 90, 135].map((a) => <line key={a} x1={-64 * Math.cos((a * Math.PI) / 180)} y1={-64 * Math.sin((a * Math.PI) / 180)} x2={64 * Math.cos((a * Math.PI) / 180)} y2={64 * Math.sin((a * Math.PI) / 180)} stroke="#8a6a44" strokeWidth={5} />)}
				</g>
			))}
			<path d="M-230 -120 L-230 -220 L-40 -220 L-20 -150 L140 -150 L170 -200 L230 -200 L240 -120Z" fill="#1a1a1a" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<rect x={-220} y={-330} width={170} height={110} fill="none" stroke={CONTORNO} strokeWidth={8} />
			<circle cx={238} cy={-170} r={18} fill="#f2c14e" stroke={CONTORNO} strokeWidth={5} />
		</g>
	);
};

export const CarroNovo: React.FC<{s?: number; cor?: string}> = ({s = 1, cor = '#2f5bd3'}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<path d="M-260 -60 L-250 -140 Q-240 -170 -200 -170 L-120 -170 L-60 -250 L120 -250 L190 -170 L240 -160 Q270 -150 270 -110 L270 -60Z" fill={cor} stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<path d="M-40 -235 L110 -235 L160 -175 L-90 -175Z" fill="#bfe3ff" stroke={CONTORNO} strokeWidth={6} />
			{[-160, 170].map((x) => (
				<g key={x} transform={`translate(${x}, -50) rotate(${f * 14})`}>
					<circle r={56} fill="#222" stroke={CONTORNO} strokeWidth={8} />
					<circle r={22} fill="#9aa1ad" />
				</g>
			))}
		</g>
	);
};

export const Trem: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-300} y={-260} width={420} height={200} fill="#3a3f4a" stroke={CONTORNO} strokeWidth={9} />
		<rect x={120} y={-330} width={180} height={270} fill="#c8323f" stroke={CONTORNO} strokeWidth={9} />
		<rect x={160} y={-300} width={100} height={80} fill="#bfe3ff" stroke={CONTORNO} strokeWidth={6} />
		<rect x={-240} y={-330} width={60} height={70} fill="#3a3f4a" stroke={CONTORNO} strokeWidth={8} />
		{[-230, -90, 50, 200].map((x) => <circle key={x} cx={x} cy={-50} r={46} fill="#222" stroke={CONTORNO} strokeWidth={8} />)}
		<path d="M300 -60 L360 -20 L300 -20Z" fill="#9aa1ad" stroke={CONTORNO} strokeWidth={6} />
	</g>
);

export const Sol: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) rotate(${f})`}>
			{Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-130} x2={0} y2={-190} stroke="#ffb43a" strokeWidth={16} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
			<circle r={110} fill="#ffd23f" stroke={CONTORNO} strokeWidth={10} />
		</g>
	);
};
