import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Rato} from './componentes';
import {COR, FONTE, lerp, pop, prog} from './tema';

const tr = {stroke: COR.tinta, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'};
const PELO = '#fffdf6';
type P = {x: number; y: number; t: number; s?: number};
const usePop = (t: number, s = 1) => pop(useCurrentFrame(), t) * s;

const Rotulo: React.FC<{x: number; y: number; txt: string; tam?: number; cor?: string; ancora?: 'start' | 'middle' | 'end'}> = ({x, y, txt, tam = 48, cor = COR.tinta, ancora = 'middle'}) => (
	<text x={x} y={y} textAnchor={ancora} fontFamily={FONTE.mao} fontWeight={700} fontSize={tam} fill={cor}>
		{txt}
	</text>
);

/** Olho grande de gato. `brilho` = frame em que o olho brilha (tapetum). */
export const Olho: React.FC<P & {brilho?: number; dilata?: boolean}> = ({x, y, t, s = 1, brilho, dilata}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	const b = brilho !== undefined ? prog(f, brilho, brilho + 12) : 0;
	const pr = dilata ? lerp(14, 70, (Math.sin(f * 0.06) + 1) / 2) : 26;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -200 0 C -120 -130 120 -130 200 0 C 120 130 -120 130 -200 0 Z" {...tr} fill="#d8f0a0" />
			<circle r={110} {...tr} fill="#b9e07a" />
			{b > 0 && <circle r={110} fill="#f5ff7a" opacity={0.85 * b} />}
			<ellipse rx={pr} ry={96} fill={COR.tinta} />
			<circle cx={-30} cy={-40} r={14} fill="#ffffff" />
			{b > 0 &&
				Array.from({length: 8}, (_, i) => {
					const a = (i / 8) * Math.PI * 2;
					return <line key={i} x1={Math.cos(a) * 140} y1={Math.sin(a) * 140} x2={Math.cos(a) * (140 + 50 * b)} y2={Math.sin(a) * (140 + 50 * b)} stroke={COR.marca} strokeWidth={8} strokeLinecap="round" />;
				})}
		</g>
	);
};

/** Faixas de cor: como você vê x como o gato (provavelmente) vê. */
export const Cores: React.FC<P> = ({x, y, t}) => {
	const f = useCurrentFrame();
	const voce = ['#e23b3b', '#f08a24', '#f5d33b', '#4cb84c', '#3d7be0', '#8a4fd1'];
	const gato = ['#8f8a7a', '#a8a07a', '#d6d27a', '#9fb7a0', '#3d7be0', '#6b6fb0'];
	return (
		<g transform={`translate(${x} ${y})`}>
			{[voce, gato].map((linha, r) => (
				<g key={r} opacity={prog(f, t + r * 14, t + r * 14 + 10)}>
					<Rotulo x={-30} y={r * 140 + 70} txt={r ? 'cat' : 'you'} ancora="end" tam={56} />
					{linha.map((c, i) => (
						<rect key={i} x={i * 110} y={r * 140} width={100} height={100} fill={c} stroke={COR.tinta} strokeWidth={5} />
					))}
				</g>
			))}
		</g>
	);
};

/** Nítido x embaçado (o mesmo ratinho). */
export const Nitidez: React.FC<P> = ({x, y, t}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x} ${y})`}>
			<filter id="embaca">
				<feGaussianBlur stdDeviation={7} />
			</filter>
			{[0, 1].map((i) => (
				<g key={i} opacity={prog(f, t + i * 14, t + i * 14 + 10)}>
					<rect x={i * 360} y={0} width={320} height={240} fill="#fffdf6" stroke={COR.tinta} strokeWidth={6} />
					<g filter={i ? 'url(#embaca)' : undefined}>
						<path d={`M ${i * 360 + 40} 200 Q ${i * 360 + 160} 160 ${i * 360 + 280} 200`} {...tr} stroke={COR.verde} />
						<Rato x={i * 360 + 170} y={190} t={-60} s={0.9} />
					</g>
					<Rotulo x={i * 360 + 160} y={300} txt={i ? 'cat' : 'you'} tam={52} />
				</g>
			))}
		</g>
	);
};

/** Campo de visão: você ~180° x gato ~200°. */
export const Campo: React.FC<P> = ({x, y, t}) => {
	const f = useCurrentFrame();
	const fatia = (cx: number, graus: number, cor: string) => {
		const a0 = -Math.PI / 2 - ((graus / 2) * Math.PI) / 180;
		const a1 = -Math.PI / 2 + ((graus / 2) * Math.PI) / 180;
		const r = 170;
		return <path d={`M ${cx} 0 L ${cx + Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 1 1 ${cx + Math.cos(a1) * r} ${Math.sin(a1) * r} Z`} fill={cor} opacity={0.45} stroke={COR.tinta} strokeWidth={5} />;
	};
	return (
		<g transform={`translate(${x} ${y})`}>
			<g opacity={prog(f, t, t + 10)}>
				{fatia(0, 180, COR.azulClaro)}
				<circle cx={0} cy={0} r={34} {...tr} fill={PELO} />
				<Rotulo x={0} y={90} txt="you: 180" tam={50} />
			</g>
			<g opacity={prog(f, t + 16, t + 26)}>
				{fatia(440, 200, COR.marca)}
				<circle cx={440} cy={0} r={34} {...tr} fill={PELO} />
				<path d="M 412 -20 L 416 -52 L 436 -32 M 468 -20 L 464 -52 L 444 -32" {...tr} strokeWidth={5} fill={PELO} />
				<Rotulo x={440} y={90} txt="cat: 200" tam={50} />
			</g>
		</g>
	);
};

/** Barras comparativas. */
export const Barras: React.FC<P & {w: number; itens: {rotulo: string; valor: number; txt?: string; cor?: string}[]}> = ({x, y, t, w, itens}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x} ${y})`}>
			{itens.map((it, i) => {
				const k = prog(f, t + i * 12, t + i * 12 + 18);
				return (
					<g key={i} opacity={f >= t + i * 12 ? 1 : 0}>
						<Rotulo x={0} y={i * 120 + 45} txt={it.rotulo} ancora="start" tam={52} />
						<rect x={190} y={i * 120} width={Math.max(4, (w - 190) * it.valor * k)} height={60} fill={it.cor ?? COR.azul} stroke={COR.tinta} strokeWidth={5} />
						{k >= 1 && it.txt && <Rotulo x={200 + (w - 190) * it.valor + 10} y={i * 120 + 45} txt={it.txt} ancora="start" tam={48} cor={COR.grafite} />}
					</g>
				);
			})}
		</g>
	);
};

/** Ondas sonoras (alta = ultrassom, bem apertadinhas). */
export const Onda: React.FC<P & {w: number; alta?: boolean; cor?: string}> = ({x, y, t, w, alta, cor = COR.tinta}) => {
	const f = useCurrentFrame();
	if (f < t) return null;
	const n = alta ? 60 : 14;
	const pts: string[] = [];
	for (let i = 0; i <= n * 4; i++) {
		const xx = (i / (n * 4)) * w;
		pts.push(`${x + xx} ${y + Math.sin((i / 4) * Math.PI * 2 - f * 0.3) * 30}`);
	}
	return <path d={`M ${pts.join(' L ')}`} {...tr} strokeWidth={5} stroke={cor} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog(f, t, t + 16)} />;
};

export const Nariz: React.FC<P> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -110 -60 L 110 -60 L 0 60 Z" {...tr} fill={COR.rosa} strokeLinejoin="round" />
			<path d="M -40 -20 q 10 10 0 22 M 40 -20 q -10 10 0 22" {...tr} strokeWidth={5} />
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M ${-180 - ((f + i * 10) % 30) * 3} ${-40 + i * 30} q 20 -10 40 0 q 20 10 40 0`} {...tr} strokeWidth={5} opacity={0.6} />
			))}
		</g>
	);
};

export const Pata: React.FC<P & {suor?: boolean}> = ({x, y, t, s = 1, suor}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -150 60 C -170 -120 170 -120 150 60 C 120 160 -120 160 -150 60 Z" {...tr} fill={PELO} />
			<path d="M -70 40 C -80 -10 80 -10 70 40 C 60 90 -60 90 -70 40 Z" {...tr} fill={COR.rosa} />
			{[-90, -32, 32, 90].map((px, i) => (
				<ellipse key={i} cx={px} cy={-50 - (i === 1 || i === 2 ? 20 : 0)} rx={26} ry={32} {...tr} fill={COR.rosa} />
			))}
			{suor &&
				[0, 1, 2].map((i) => {
					const c = ((f + i * 12) % 36) / 36;
					return <path key={i} transform={`translate(${-60 + i * 60} ${120 + c * 60})`} d="M 0 -18 C 10 0 10 12 0 12 C -10 12 -10 0 0 -18 Z" fill={COR.azulClaro} stroke={COR.tinta} strokeWidth={3} opacity={1 - c} />;
				})}
		</g>
	);
};

export const Cerca: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
	<g>
		<rect x={x} y={y} width={w} height={18} fill="#e8c89a" stroke={COR.tinta} strokeWidth={6} />
		{Array.from({length: Math.floor(w / 90) + 1}, (_, i) => (
			<rect key={i} x={x + i * 90} y={y + 18} width={40} height={120} fill="#e8c89a" stroke={COR.tinta} strokeWidth={6} />
		))}
	</g>
);

export const Tigela: React.FC<P & {tipo: 'funda' | 'rasa'}> = ({x, y, t, s = 1, tipo}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			{tipo === 'funda' ? (
				<>
					<path d="M -70 -150 L 70 -150 L 60 0 L -60 0 Z" {...tr} fill={COR.azulClaro} />
					<ellipse cx={0} cy={-150} rx={70} ry={14} {...tr} fill="#fffdf6" />
				</>
			) : (
				<>
					<path d="M -170 -50 L 170 -50 L 140 0 L -140 0 Z" {...tr} fill={COR.azulClaro} />
					<ellipse cx={0} cy={-50} rx={170} ry={20} {...tr} fill="#fffdf6" />
				</>
			)}
		</g>
	);
};

export const Fonte: React.FC<P> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -150 0 L -130 -90 L 130 -90 L 150 0 Z" {...tr} fill={COR.azulClaro} />
			<rect x={-20} y={-190} width={40} height={100} {...tr} fill="#fffdf6" />
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M 0 -190 Q ${-60 + i * 60} ${-250 - (f % 10)} ${-90 + i * 90} -100`} stroke={COR.azul} strokeWidth={6} fill="none" strokeLinecap="round" />
			))}
		</g>
	);
};

/** Fresta entre duas paredes, com o tracejado da largura dos bigodes. */
export const Fresta: React.FC<P & {passa?: boolean}> = ({x, y, t}) => {
	const f = useCurrentFrame();
	const k = prog(f, t, t + 12);
	return (
		<g opacity={k}>
			<rect x={x - 260} y={y - 330} width={150} height={330} fill="#e3dccb" stroke={COR.tinta} strokeWidth={6} />
			<rect x={x + 110} y={y - 330} width={150} height={330} fill="#e3dccb" stroke={COR.tinta} strokeWidth={6} />
			<line x1={x - 110} y1={y - 360} x2={x + 110} y2={y - 360} stroke={COR.vermelho} strokeWidth={5} strokeDasharray="14 10" />
			<Rotulo x={x} y={y - 380} txt="gap" tam={48} cor={COR.vermelho} />
		</g>
	);
};

export const Aspirador: React.FC<P> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	const tr2 = Math.floor(f / 2) % 2 ? 3 : -3;
	return (
		<g transform={`translate(${x + tr2} ${y}) scale(${k})`}>
			<rect x={-90} y={-120} width={180} height={120} rx={30} {...tr} fill={COR.rosa} />
			<circle cx={-50} cy={0} r={22} {...tr} fill="#fffdf6" />
			<circle cx={50} cy={0} r={22} {...tr} fill="#fffdf6" />
			<path d="M 60 -110 C 140 -200 200 -260 240 -380" {...tr} />
			<Rotulo x={0} y={-160} txt="VROOOM" tam={54} cor={COR.vermelho} />
		</g>
	);
};

export const Laranja: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<circle r={70} {...tr} fill="#f5a23b" />
			<path d="M 0 -70 q 20 -40 50 -30" {...tr} stroke={COR.verde} />
			<circle cx={-20} cy={-20} r={6} fill="#e08a20" />
			<circle cx={20} cy={10} r={6} fill="#e08a20" />
		</g>
	);
};

export const Jornal: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(-6) scale(${k})`}>
			<rect x={-200} y={-140} width={400} height={280} {...tr} fill="#fffdf6" />
			<Rotulo x={0} y={-80} txt="THE SNIFF TIMES" tam={52} />
			<line x1={-170} y1={-55} x2={170} y2={-55} {...tr} strokeWidth={4} />
			{[0, 1, 2, 3].map((i) => (
				<line key={i} x1={-170} y1={-10 + i * 36} x2={i % 2 ? 60 : 170} y2={-10 + i * 36} {...tr} strokeWidth={4} stroke={COR.cinza} />
			))}
		</g>
	);
};

export const Sofa: React.FC<P & {arranhado?: number}> = ({x, y, t, s = 1, arranhado}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -260 0 L -260 -150 C -260 -230 260 -230 260 -150 L 260 0 Z" {...tr} fill={COR.azulClaro} />
			<rect x={-300} y={-140} width={80} height={140} rx={30} {...tr} fill={COR.azulClaro} />
			<rect x={220} y={-140} width={80} height={140} rx={30} {...tr} fill={COR.azulClaro} />
			{arranhado !== undefined &&
				f >= arranhado &&
				[0, 1, 2].map((i) => <line key={i} x1={-260 + i * 18} y1={-120} x2={-250 + i * 18} y2={lerp(-120, -30, prog(f, arranhado, arranhado + 10))} stroke={COR.vermelho} strokeWidth={5} strokeLinecap="round" />)}
		</g>
	);
};

export const Folhas: React.FC<P> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d={`M 90 -20 C 140 -40 150 ${-70 + Math.sin(f * 0.5) * 10} 180 -60`} {...tr} strokeWidth={5} />
			{Array.from({length: 9}, (_, i) => (
				<ellipse key={i} cx={-120 + (i % 5) * 60} cy={-20 - Math.floor(i / 5) * 40} rx={50} ry={24} transform={`rotate(${(i * 37) % 60 - 30} ${-120 + (i % 5) * 60} ${-20 - Math.floor(i / 5) * 40})`} {...tr} strokeWidth={5} fill={i % 2 ? '#f0b04a' : '#d9822b'} />
			))}
		</g>
	);
};

// ============================================================
// DESENHOS DO VÍDEO DE HISTÓRIA
// ============================================================
/** Linha do tempo com marcas que aparecem uma a uma. */
export const LinhaTempo: React.FC<{x: number; y: number; w: number; t: number; marcas: {pos: number; txt: string}[]; destaque?: number}> = ({x, y, w, t, marcas, destaque}) => {
	const f = useCurrentFrame();
	const k = prog(f, t, t + 16);
	return (
		<g>
			<path d={`M ${x} ${y} L ${x + w * k} ${y}`} {...tr} strokeWidth={8} />
			{k >= 1 && <path d={`M ${x + w - 30} ${y - 20} L ${x + w} ${y} L ${x + w - 30} ${y + 20}`} {...tr} strokeWidth={8} />}
			{marcas.map((m, i) => {
				const tm = t + 10 + i * 8;
				if (f < tm) return null;
				const mx = x + w * m.pos;
				const ativo = destaque === i;
				return (
					<g key={i} opacity={prog(f, tm, tm + 6)}>
						<circle cx={mx} cy={y} r={ativo ? 20 : 12} fill={ativo ? COR.vermelho : COR.tinta} />
						<Rotulo x={mx} y={i % 2 ? y + 70 : y - 40} txt={m.txt} tam={44} cor={ativo ? COR.vermelho : COR.tinta} />
					</g>
				);
			})}
		</g>
	);
};

/** Mapa rabiscado com rota tracejada. */
export const Mapa: React.FC<P & {lugares: {x: number; y: number; txt: string}[]; rota?: number}> = ({x, y, t, lugares, rota}) => {
	const f = useCurrentFrame();
	const k = prog(f, t, t + 12);
	const kr = rota !== undefined ? prog(f, rota, rota + 30) : 0;
	const pts = lugares.map((l) => `${x + l.x} ${y + l.y}`);
	return (
		<g opacity={k}>
			<path d={`M ${x - 40} ${y + 40} C ${x + 100} ${y - 120} ${x + 400} ${y - 140} ${x + 560} ${y - 40} C ${x + 760} ${y + 40} ${x + 820} ${y + 220} ${x + 640} ${y + 300} C ${x + 420} ${y + 380} ${x + 120} ${y + 330} ${x - 40} ${y + 220} Z`} {...tr} strokeWidth={5} fill="#eef3e0" />
			{lugares.map((l, i) => (
				<g key={i}>
					<circle cx={x + l.x} cy={y + l.y} r={10} fill={COR.vermelho} />
					<Rotulo x={x + l.x} y={y + l.y - 22} txt={l.txt} tam={40} />
				</g>
			))}
			{kr > 0 && <path d={`M ${pts.join(' L ')}`} stroke={COR.vermelho} strokeWidth={6} fill="none" strokeDasharray="16 12" pathLength={1} style={{strokeDasharray: `${kr} 1`}} />}
		</g>
	);
};

export const Piramide: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -220 0 L 0 -260 L 220 0 Z" {...tr} fill="#f0d08a" />
			<path d="M -150 -80 L 150 -80 M -90 -160 L 90 -160" {...tr} strokeWidth={4} />
			<circle cx={260} cy={-240} r={40} {...tr} fill={COR.marca} />
		</g>
	);
};

export const Mumia: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -60 0 C -80 -120 -60 -220 -40 -240 L -50 -300 L -20 -268 L 20 -268 L 50 -300 L 40 -240 C 60 -220 80 -120 60 0 Z" {...tr} fill="#e8dcc0" />
			{[-200, -160, -120, -80, -40].map((yy, i) => (
				<path key={i} d={`M -62 ${yy} L 62 ${yy - 14}`} {...tr} strokeWidth={4} />
			))}
			<circle cx={-18} cy={-238} r={7} fill={COR.tinta} />
			<circle cx={18} cy={-238} r={7} fill={COR.tinta} />
		</g>
	);
};

export const Bastet: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<rect x={-110} y={-30} width={220} height={30} {...tr} fill="#f0d08a" />
			<path d="M -60 -30 C -80 -150 -50 -260 -30 -290 L -40 -360 L -8 -320 L 8 -320 L 40 -360 L 30 -290 C 50 -260 80 -150 60 -30 Z" {...tr} fill="#2b2f4a" />
			<path d="M -40 -270 Q 0 -250 40 -270" stroke={COR.marca} strokeWidth={10} fill="none" />
			<circle cx={34} cy={-330} r={9} fill={COR.marca} />
			<circle cx={-14} cy={-305} r={5} fill={COR.marca} />
			<circle cx={14} cy={-305} r={5} fill={COR.marca} />
		</g>
	);
};

export const Trigo: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -120 0 C -150 -140 150 -140 120 0 Z" {...tr} fill="#e8c89a" />
			<path d="M -60 -100 Q 0 -80 60 -100" {...tr} strokeWidth={5} />
			{[-60, -20, 20, 60].map((dx, i) => (
				<g key={i}>
					<path d={`M ${dx} -110 L ${dx + (i - 1.5) * 20} -260`} {...tr} strokeWidth={5} stroke="#b88a2b" />
					{[0, 1, 2, 3].map((j) => (
						<ellipse key={j} cx={dx + (i - 1.5) * 20 * ((150 + j * 25) / 150) * 0.7} cy={-190 - j * 22} rx={9} ry={16} fill={COR.marca} stroke="#b88a2b" strokeWidth={3} />
					))}
				</g>
			))}
		</g>
	);
};

export const Barco: React.FC<P & {viking?: boolean}> = ({x, y, t, s = 1, viking}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	const b = Math.sin(f * 0.1) * 6;
	return (
		<g transform={`translate(${x} ${y + b}) rotate(${Math.sin(f * 0.08) * 2}) scale(${k})`}>
			<path d="M -260 -60 L 260 -60 L 200 20 L -200 20 Z" {...tr} fill={viking ? '#c99a5a' : '#e8c89a'} />
			{viking && (
				<>
					<path d="M 250 -60 C 300 -120 290 -180 250 -190 C 230 -170 250 -140 230 -120" {...tr} fill="#c99a5a" />
					<circle cx={258} cy={-172} r={5} fill={COR.tinta} />
					{[-180, -100, -20, 60, 140].map((cx) => (
						<circle key={cx} cx={cx} cy={-40} r={24} {...tr} strokeWidth={5} fill={COR.vermelho} />
					))}
				</>
			)}
			<path d="M 0 -60 L 0 -360" {...tr} />
			<path d="M 0 -340 L 170 -110 L 0 -110 Z" {...tr} fill={viking ? '#ffffff' : '#fffdf6'} />
			{viking && <path d="M 30 -300 L 50 -120 M 80 -230 L 100 -120 M 130 -160 L 140 -120" stroke={COR.vermelho} strokeWidth={14} />}
			<path d="M -320 40 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0 q 40 20 80 0" {...tr} strokeWidth={5} stroke={COR.azul} />
		</g>
	);
};

export const Maneki: React.FC<P> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	const aceno = Math.sin(f * 0.25) * 18;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -110 0 C -140 -130 -90 -190 0 -190 C 90 -190 140 -130 110 0 Z" {...tr} fill="#ffffff" />
			<g transform={`rotate(${aceno} 70 -150)`}>
				<path d="M 70 -150 C 90 -210 120 -260 110 -300 C 100 -330 70 -320 70 -290" {...tr} fill="#ffffff" />
			</g>
			<path d="M -70 -260 L -60 -330 L -20 -290 M 70 -260 L 60 -330 L 20 -290" {...tr} fill="#ffffff" />
			<circle cx={0} cy={-250} r={80} {...tr} fill="#ffffff" />
			<path d="M -42 -260 q 14 -12 28 0 M 14 -260 q 14 -12 28 0" {...tr} strokeWidth={5} />
			<path d="M -12 -228 q 12 10 24 0" {...tr} strokeWidth={5} />
			<path d="M -70 -180 Q 0 -150 70 -180" stroke={COR.vermelho} strokeWidth={14} fill="none" />
			<circle cx={0} cy={-158} r={14} fill={COR.marca} stroke={COR.tinta} strokeWidth={4} />
			<ellipse cx={-40} cy={-80} rx={44} ry={64} {...tr} fill={COR.marca} />
			<path d="M -60 -100 L -20 -100 M -60 -70 L -20 -70" {...tr} strokeWidth={4} />
		</g>
	);
};

export const Ilha: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -300 0 C -240 -140 240 -140 300 0 Z" {...tr} fill="#d9e8b0" />
			<path d="M -340 20 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0 q 40 20 80 0 q 40 -20 80 0" {...tr} strokeWidth={5} stroke={COR.azul} />
			{[-180, -90, 0, 90, 180, -40, 60].map((cx, i) => (
				<g key={i} transform={`translate(${cx} ${-40 - (i > 4 ? 40 : 0)})`}>
					<path d="M -14 0 C -18 -24 18 -24 14 0 Z M -12 -18 L -10 -32 L -2 -22 M 12 -18 L 10 -32 L 2 -22" stroke={COR.tinta} strokeWidth={4} fill="#fffdf6" />
				</g>
			))}
		</g>
	);
};

export const Foguete: React.FC<P> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = usePop(t, s);
	if (k <= 0) return null;
	const sobe = Math.max(0, f - t - 20) * 3;
	return (
		<g transform={`translate(${x} ${y - sobe}) scale(${k})`}>
			<path d="M 0 -320 C 70 -250 70 -120 50 -40 L -50 -40 C -70 -120 -70 -250 0 -320 Z" {...tr} fill="#fffdf6" />
			<circle cx={0} cy={-200} r={30} {...tr} fill={COR.azulClaro} />
			<path d="M -12 -210 L -8 -232 L 0 -216 L 8 -232 L 12 -210" stroke={COR.tinta} strokeWidth={3} fill="none" />
			<path d="M -50 -100 L -100 -20 L -50 -40 M 50 -100 L 100 -20 L 50 -40" {...tr} fill={COR.vermelho} />
			<path d={`M -30 -40 Q 0 ${40 + (f % 6) * 6} 30 -40 Z`} fill={COR.marca} stroke={COR.vermelho} strokeWidth={5} />
		</g>
	);
};

export const Porta10: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<rect x={-120} y={-380} width={240} height={380} {...tr} fill="#1f2333" />
			<path d="M -120 -380 C -120 -440 120 -440 120 -380" {...tr} fill="#fffdf6" />
			<text x={0} y={-250} textAnchor="middle" fontFamily={FONTE.mao} fontWeight={700} fontSize={90} fill="#ffffff">
				10
			</text>
			<circle cx={70} cy={-160} r={12} fill={COR.marca} />
		</g>
	);
};

export const Roseta: React.FC<P & {txt: string}> = ({x, y, t, s = 1, txt}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -30 40 L -60 170 L -20 140 L 0 180 L 0 40 Z M 30 40 L 60 170 L 20 140 L 0 180 L 0 40 Z" {...tr} strokeWidth={5} fill={COR.vermelho} />
			{Array.from({length: 12}, (_, i) => {
				const a = (i / 12) * Math.PI * 2;
				return <circle key={i} cx={Math.cos(a) * 70} cy={Math.sin(a) * 70} r={30} fill={COR.azul} stroke={COR.tinta} strokeWidth={4} />;
			})}
			<circle r={70} {...tr} fill={COR.marca} />
			<Rotulo x={0} y={14} txt={txt} tam={40} />
		</g>
	);
};

export const ChapeuBruxa: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(-8) scale(${k})`}>
			<ellipse cx={0} cy={0} rx={170} ry={36} {...tr} fill="#3a2f5a" />
			<path d="M -90 -10 C -60 -120 -20 -230 60 -270 C 30 -200 70 -100 90 -10 Z" {...tr} fill="#3a2f5a" />
			<path d="M -88 -30 Q 0 -10 88 -30" stroke={COR.marca} strokeWidth={16} fill="none" />
		</g>
	);
};

export const Pergaminho: React.FC<P & {txt?: string}> = ({x, y, t, s = 1, txt}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<rect x={-160} y={-110} width={320} height={220} {...tr} fill="#f3e3b8" />
			<rect x={-190} y={-130} width={40} height={260} rx={20} {...tr} fill="#e3cf98" />
			<rect x={150} y={-130} width={40} height={260} rx={20} {...tr} fill="#e3cf98" />
			{txt ? <Rotulo x={0} y={14} txt={txt} tam={52} /> : [0, 1, 2, 3].map((i) => <line key={i} x1={-120} y1={-60 + i * 40} x2={i % 2 ? 60 : 120} y2={-60 + i * 40} stroke={COR.grafite} strokeWidth={4} />)}
		</g>
	);
};

export const Tumulo: React.FC<P> = ({x, y, t, s = 1}) => {
	const k = usePop(t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -120 0 L -120 -200 C -120 -290 120 -290 120 -200 L 120 0 Z" {...tr} fill="#d9d4c6" />
			<Rotulo x={0} y={-160} txt="9,500" tam={52} />
			<Rotulo x={0} y={-110} txt="years ago" tam={40} />
			<path d="M -60 -60 C -66 -80 -30 -80 -36 -60 Z M -58 -76 L -56 -88 L -48 -80 M -38 -76 L -40 -88 L -48 -80" stroke={COR.tinta} strokeWidth={4} fill="#fffdf6" />
			<path d="M 30 -50 L 30 -95 M 30 -95 m -12 12 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0" stroke={COR.tinta} strokeWidth={4} fill="#fffdf6" />
		</g>
	);
};
