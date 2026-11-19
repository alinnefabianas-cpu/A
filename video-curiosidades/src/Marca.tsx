import React from 'react';
import {Personagem, CONTORNO} from './Personagem';

// Identidade do canal "Why Though?": foto de perfil (800x800) e banner (2560x1440).
const AZUL = '#1d2a66';
const AMARELO = '#ffd23f';

const Fundo: React.FC<{w: number; h: number; id: string}> = ({w, h, id}) => {
	const pontos = Array.from({length: Math.round((w * h) / 26000)}).map((_, i) => {
		const r = (k: number) => {
			const x = Math.sin(i * 91.7 + k * 13.3) * 43758.5;
			return x - Math.floor(x);
		};
		return {x: r(1) * w, y: r(2) * h, s: 2 + r(3) * 5, o: 0.15 + r(4) * 0.35};
	});
	return (
		<g>
			<defs>
				<radialGradient id={id} cx="0.5" cy="0.45" r="0.75">
					<stop offset="0" stopColor="#3048a3" />
					<stop offset="0.6" stopColor={AZUL} />
					<stop offset="1" stopColor="#0d1440" />
				</radialGradient>
			</defs>
			<rect width={w} height={h} fill={`url(#${id})`} />
			{pontos.map((p, i) => (
				<circle key={i} cx={p.x} cy={p.y} r={p.s} fill="#fff" opacity={p.o} />
			))}
		</g>
	);
};

const Interroga: React.FC<{x: number; y: number; s: number; rot?: number; op?: number}> = ({x, y, s, rot = 0, op = 1}) => (
	<text opacity={op} x={x} y={y} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={s} fill={AMARELO} stroke={CONTORNO} strokeWidth={s * 0.065} paintOrder="stroke" transform={`rotate(${rot} ${x} ${y})`}>
		?
	</text>
);

// mascote "Huey": boneco de camiseta amarela, curioso, olhando para o "?"
const Huey: React.FC<{x: number; y: number; s: number; olhar?: number}> = ({x, y, s, olhar = 1}) => (
	<Personagem x={x} y={y} escala={s} roupa="passageiro" cor={AMARELO} cabelo="#3d2a1e" expressao="feliz" olhar={olhar} bracoD={150} cotoveloD={20} />
);

export const FotoPerfil: React.FC = () => (
	<svg viewBox="0 0 800 800" width={800} height={800}>
		<Fundo w={800} h={800} id="fp" />
		<circle cx={400} cy={400} r={330} fill="rgba(255,210,63,0.12)" />
		{/* só a cabeça e o ombro do mascote, grande e centralizado no círculo */}
		<g transform="translate(-40, 0)">
			<Personagem x={400} y={1320} escala={1.45} roupa="passageiro" cor={AMARELO} cabelo="#3d2a1e" expressao="pidao" olhar={1} fase={1} />
		</g>
		<Interroga x={620} y={330} s={300} rot={14} />
	</svg>
);

export const Banner: React.FC = () => {
	const W = 2560, H = 1440;
	return (
		<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
			<Fundo w={W} h={H} id="bn" />
			{/* faixa clara atrás do título (área segura: 1546x423 no centro) */}
			<ellipse cx={W / 2} cy={H / 2} rx={800} ry={230} fill="rgba(255,210,63,0.10)" />
			{/* "?" decorativos */}
			<Interroga x={330} y={420} s={220} rot={-18} op={0.45} />
			<Interroga x={2250} y={1150} s={260} rot={16} op={0.45} />
			<Interroga x={2380} y={430} s={160} rot={-10} op={0.3} />
			<Interroga x={190} y={1130} s={180} rot={12} op={0.3} />
			{/* personagens nas laterais, dentro da faixa visível no computador (y 508–931) */}
			<Personagem x={420} y={925} escala={0.52} roupa="comandante" expressao="feliz" olhar={1} />
			<Personagem x={200} y={925} escala={0.46} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao="confuso" olhar={1} fase={2} />
			<Personagem x={2140} y={925} escala={0.52} roupa="bombeiro" expressao="feliz" olhar={-1} fase={3} />
			<Personagem x={2360} y={925} escala={0.46} roupa="comissaria" cabelo="#6b3a1f" expressao="feliz" olhar={-1} fase={4} />
			{/* título */}
			<text x={W / 2} y={725} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={175} letterSpacing={-3} fill={AMARELO} stroke="#000" strokeWidth={18} paintOrder="stroke">
				WHY THOUGH?
			</text>
			<text x={W / 2} y={830} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">
				Everyday things. Surprising reasons.
			</text>
		</svg>
	);
};

// usado só para conferir a área segura do banner (não suba esta versão)
export const BannerGuia: React.FC = () => (
	<div style={{position: 'relative', width: 2560, height: 1440}}>
		<Banner />
		<svg viewBox="0 0 2560 1440" width={2560} height={1440} style={{position: 'absolute', inset: 0}}>
			<rect x={0} y={508} width={2560} height={423} fill="none" stroke="#0f0" strokeWidth={6} strokeDasharray="20 12" />
			<rect x={507} y={508} width={1546} height={423} fill="none" stroke="#f0f" strokeWidth={8} />
		</svg>
	</div>
);
export {Huey};
