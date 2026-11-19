// Thumbnails chamativas (1280x720) para o vídeo longo — duas versões para teste A/B no YouTube.
import React from 'react';
import {Personagem, CONTORNO} from '../Personagem';
import {Emu} from '../episodios/emu-war/arte';
import {Painel} from '../elevador/cenarios';
import {MELACO, MELACO_CLARO} from '../episodios/molasses-flood/arte';
import {Tubarao} from '../episodios/sharks-trees/Episodio';

const TW = 1280, TH = 720;

const Explosao: React.FC<{c1: string; c2: string; cx: number; cy: number}> = ({c1, c2, cx, cy}) => (
	<g>
		<defs>
			<radialGradient id={`exp${c1}`} cx={cx / TW} cy={cy / TH} r="0.9">
				<stop offset="0" stopColor="#fff6c0" />
				<stop offset="0.25" stopColor={c1} />
				<stop offset="1" stopColor={c2} />
			</radialGradient>
		</defs>
		<rect width={TW} height={TH} fill={`url(#exp${c1})`} />
		{Array.from({length: 24}).map((_, i) => {
			const a1 = (i / 24) * Math.PI * 2, a2 = a1 + Math.PI / 48;
			return <path key={i} d={`M${cx} ${cy} L${cx + Math.cos(a1) * 1600} ${cy + Math.sin(a1) * 1600} L${cx + Math.cos(a2) * 1600} ${cy + Math.sin(a2) * 1600}Z`} fill="rgba(255,255,255,0.16)" />;
		})}
	</g>
);

const Titulo: React.FC<{x: number; y: number; t: string; tam: number; cor?: string; rot?: number; ancora?: 'start' | 'middle' | 'end'}> = ({x, y, t, tam, cor = '#fff', rot = 0, ancora = 'middle'}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<text x={x + 8} y={y + 10} textAnchor={ancora} fontFamily="Nunito" fontWeight={900} fontSize={tam} fill="#000" opacity={0.45}>{t}</text>
		<text x={x} y={y} textAnchor={ancora} fontFamily="Nunito" fontWeight={900} fontSize={tam} fill={cor} stroke="#000" strokeWidth={tam * 0.16} paintOrder="stroke" letterSpacing={-2}>{t}</text>
	</g>
);

const Seta: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
		<path d="M0 -26 L150 -26 L150 -70 L250 0 L150 70 L150 26 L0 26Z" fill="#ff1f1f" stroke="#fff" strokeWidth={10} strokeLinejoin="round" />
		<path d="M0 -26 L150 -26 L150 -70 L250 0 L150 70 L150 26 L0 26Z" fill="none" stroke="#000" strokeWidth={4} strokeLinejoin="round" />
	</g>
);

// contorno branco grosso em volta dos personagens (efeito "recorte")
const Recorte: React.FC<{children: React.ReactNode}> = ({children}) => (
	<g>
		<g style={{filter: 'drop-shadow(0 0 0 #fff) drop-shadow(8px 0 0 #fff) drop-shadow(-8px 0 0 #fff) drop-shadow(0 8px 0 #fff) drop-shadow(0 -8px 0 #fff) drop-shadow(10px 14px 0 rgba(0,0,0,0.35))'}}>{children}</g>
	</g>
);

// A — "LOST TO BIRDS?!": soldado em choque gigante + emu campeão
export const ThumbA: React.FC = () => (
	<svg viewBox={`0 0 ${TW} ${TH}`} width={TW} height={TH}>
		<Explosao c1="#ffb000" c2="#e8460f" cx={960} cy={360} />
		<Recorte>
			<g transform="translate(900, 760) scale(0.92)"><Emu x={0} y={0} olho="feliz" medalha /></g>
		</Recorte>
		<Recorte>
			<Personagem x={250} y={1560} escala={1.75} roupa="soldado" expressao="assustado" olhar={1} fase={1} bracoD={150} bracoE={150} cotoveloD={-30} cotoveloE={-30} />
		</Recorte>
		<Seta x={500} y={520} rot={-12} s={0.85} />
		<Titulo x={40} y={140} t="LOST TO" tam={124} cor="#fff" rot={-4} ancora="start" />
		<g transform="rotate(-4 330 270)"><rect x={30} y={190} width={590} height={150} rx={18} fill="#ff1f1f" stroke="#000" strokeWidth={10} /></g>
		<Titulo x={56} y={312} t="BIRDS?!" tam={140} cor="#ffe600" rot={-4} ancora="start" />
		<g transform="translate(1110, 650) rotate(6)">
			<rect x={-140} y={-50} width={280} height={100} rx={20} fill="#000" />
			<text x={0} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={62} fill="#ffe600">1932</text>
		</g>
	</svg>
);

// B — "THIS BUTTON IS FAKE?!": botão de fechar a porta em close + pessoa chocada
export const ThumbB: React.FC = () => (
	<svg viewBox={`0 0 ${TW} ${TH}`} width={TW} height={TH}>
		<Explosao c1="#3fd0ff" c2="#1d2a66" cx={360} cy={420} />
		{/* painel em close no botão de fechar (coordenadas do botão no painel: 110, 360) */}
		<Recorte>
			<g transform="translate(360, 430) scale(1.15) translate(-110, -360)"><Painel destaque /></g>
		</Recorte>
		<g transform="translate(360, 430)">
			<circle r={150} fill="none" stroke="#ff1f1f" strokeWidth={30} />
			<line x1={-106} y1={-106} x2={106} y2={106} stroke="#ff1f1f" strokeWidth={30} strokeLinecap="round" />
		</g>
		<Recorte>
			<Personagem x={1010} y={1390} escala={1.5} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao="assustado" olhar={-1} fase={1} bracoD={160} bracoE={160} cotoveloD={-20} cotoveloE={-20} />
		</Recorte>
		<Titulo x={1250} y={130} t="THIS BUTTON" tam={96} cor="#fff" rot={-3} ancora="end" />
		<g transform="rotate(-3 1000 260)"><rect x={760} y={186} width={490} height={138} rx={18} fill="#ff1f1f" stroke="#000" strokeWidth={10} /></g>
		<Titulo x={1236} y={300} t="IS FAKE?!" tam={118} cor="#ffe600" rot={-3} ancora="end" />
		<g transform="translate(200, 660) rotate(-5)">
			<rect x={-160} y={-46} width={320} height={92} rx={20} fill="#000" />
			<text x={0} y={20} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={52} fill="#ffe600">+12 MORE</text>
		</g>
	</svg>
);

// Vídeo longo 2 — "A WAVE OF MOLASSES?!": rua de tijolos, onda marrom gigante, pessoa fugindo + tubarão de óculos
export const ThumbFake: React.FC = () => (
	<svg viewBox={`0 0 ${TW} ${TH}`} width={TW} height={TH}>
		<Explosao c1="#ff9a2e" c2="#7a2a0a" cx={420} cy={360} />
		{/* prédios */}
		{[[-20, 300, '#b0563a'], [250, 250, '#9a4a34'], [480, 330, '#c0683f']].map(([x, h, c], i) => (
			<g key={i}>
				<rect x={x as number} y={720 - (h as number)} width={230} height={h as number} fill={c as string} stroke={CONTORNO} strokeWidth={6} />
				{[0, 1].map((r) => [0, 1].map((k) => <rect key={`${r}${k}`} x={(x as number) + 40 + k * 100} y={720 - (h as number) + 40 + r * 110} width={50} height={70} fill="#f6e3a8" stroke={CONTORNO} strokeWidth={4} />))}
			</g>
		))}
		{/* onda de melaço */}
		<g transform="translate(0, -40)">
			<path d="M-40 800 L-40 300 Q80 240 200 280 Q320 220 420 200 Q560 160 620 260 Q560 250 540 330 L540 800Z" fill={MELACO} stroke={CONTORNO} strokeWidth={10} />
			<path d="M440 210 Q560 170 600 250" stroke={MELACO_CLARO} strokeWidth={18} fill="none" strokeLinecap="round" />
			{[[120, 420], [300, 520], [180, 640], [420, 420]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={60} ry={16} fill={MELACO_CLARO} opacity={0.7} />)}
		</g>
		<Recorte>
			<Personagem x={760} y={1110} escala={1.1} roupa="carteiro" cor="#3a4a7a" cabelo="#4a3326" expressao="assustado" olhar={-1} fase={1} bracoD={150} bracoE={150} cotoveloD={-30} cotoveloE={-30} inclinar={10} />
		</Recorte>
		<Recorte>
			<g transform="translate(1120, 610) scale(0.36) rotate(-8)"><Tubarao oculos /></g>
		</Recorte>
		<Titulo x={1250} y={120} t="A WAVE OF" tam={100} cor="#fff" rot={-3} ancora="end" />
		<g transform="rotate(-3 1030 250)"><rect x={760} y={170} width={500} height={150} rx={18} fill="#ff1f1f" stroke="#000" strokeWidth={10} /></g>
		<Titulo x={1236} y={292} t="MOLASSES?!" tam={112} cor="#ffe600" rot={-3} ancora="end" />
		<g transform="translate(260, 630) rotate(-5)">
			<rect x={-170} y={-50} width={340} height={100} rx={20} fill="#000" />
			<text x={0} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={58} fill="#5aff7a">100% TRUE</text>
		</g>
	</svg>
);
