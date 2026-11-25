import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Bloco} from './roteiro';
import {COR, FONTE, lerp, passo, pisca, pop, prog} from './tema';

type P = {x: number; y: number};
const traco = {stroke: COR.tinta, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'};

// ============================================================
// PAPEL: folha de caderno pautada com margem e espiral
// ============================================================
export const Papel: React.FC = () => (
	<AbsoluteFill style={{background: COR.papel}}>
		<svg width={1920} height={1080}>
			<filter id="grao">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
				<feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.09 0" />
			</filter>
			{Array.from({length: 15}, (_, i) => (
				<line key={i} x1={0} y1={150 + i * 64} x2={1920} y2={150 + i * 64} stroke={COR.pauta} strokeWidth={2.5} />
			))}
			<line x1={170} y1={0} x2={170} y2={1080} stroke={COR.margem} strokeWidth={3} />
			{Array.from({length: 12}, (_, i) => (
				<g key={i}>
					<circle cx={70} cy={60 + i * 88} r={16} fill="#e3dccb" />
					<circle cx={70} cy={60 + i * 88} r={9} fill="#cfc6b1" />
				</g>
			))}
			<rect width={1920} height={1080} filter="url(#grao)" />
		</svg>
	</AbsoluteFill>
);

/** Filtro que faz todos os traços "tremerem" (muda a semente a cada 4 frames). */
export const Tremido: React.FC<{children: React.ReactNode; forca?: number}> = ({children, forca = 3.5}) => {
	const f = useCurrentFrame();
	const seed = passo(f) % 4;
	return (
		<>
			<filter id={`tremido-${seed}`} x="-5%" y="-5%" width="110%" height="110%">
				<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed={seed + 1} result="n" />
				<feDisplacementMap in="SourceGraphic" in2="n" scale={forca} xChannelSelector="R" yChannelSelector="G" />
			</filter>
			<g filter={`url(#tremido-${seed})`}>{children}</g>
		</>
	);
};

// ============================================================
// TRAÇOS que se desenham sozinhos
// ============================================================
export const Traco: React.FC<{d: string; t: number; dur?: number; cor?: string; w?: number; fill?: string}> = ({d, t, dur = 14, cor = COR.tinta, w = 7, fill = 'none'}) => {
	const f = useCurrentFrame();
	if (f < t) return null;
	const k = prog(f, t, t + dur);
	return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} {...traco} stroke={cor} strokeWidth={w} fill={k >= 1 ? fill : 'none'} />;
};

/** Texto escrito à mão, letra por letra. */
export const Escrito: React.FC<{
	x: number;
	y: number;
	t: number;
	texto: string;
	tam?: number;
	cor?: string;
	ancora?: 'start' | 'middle' | 'end';
	vel?: number; // letras por frame
	marca?: string; // cor do marca-texto (opcional)
	riscado?: number; // frame em que é riscado
	rot?: number;
	sai?: number;
}> = ({x, y, t, texto, tam = 64, cor = COR.tinta, ancora = 'start', vel = 1.2, marca, riscado, rot = 0, sai}) => {
	const f = useCurrentFrame();
	if (f < t || (sai !== undefined && f >= sai)) return null;
	const n = Math.min(texto.length, Math.ceil((f - t + 1) * vel));
	const larg = texto.length * tam * 0.35;
	const x0 = ancora === 'middle' ? x - larg / 2 : ancora === 'end' ? x - larg : x;
	const km = marca ? prog(f, t, t + 10) : 0;
	const kr = riscado !== undefined ? prog(f, riscado, riscado + 8) : 0;
	return (
		<g transform={`rotate(${rot} ${x} ${y})`}>
			{marca && km > 0 && <rect x={x0 - 12} y={y - tam * 0.5} width={(larg + 24) * km} height={tam * 0.62} fill={marca} opacity={0.75} transform={`skewX(-8)`} style={{transformOrigin: `${x0}px ${y}px`}} />}
			<text x={x} y={y} textAnchor={ancora} fontFamily={FONTE.mao} fontWeight={700} fontSize={tam} fill={cor}>
				{texto.slice(0, n)}
			</text>
			{kr > 0 && <path d={`M ${x0 - 10} ${y - tam * 0.2} L ${x0 + (larg + 20) * kr} ${y - tam * 0.32}`} stroke={COR.vermelho} strokeWidth={8} strokeLinecap="round" />}
		</g>
	);
};

/** Círculo rabiscado em volta de algo (dá mais de uma volta, como à mão). */
export const Circulo: React.FC<{cx: number; cy: number; rx: number; ry: number; t: number; cor?: string; w?: number}> = ({cx, cy, rx, ry, t, cor = COR.vermelho, w = 6}) => {
	const pts: string[] = [];
	for (let i = 0; i <= 60; i++) {
		const a = -Math.PI / 2 + (i / 60) * Math.PI * 2.25;
		const r = 1 + 0.06 * Math.sin(i * 0.7);
		pts.push(`${cx + Math.cos(a) * rx * r} ${cy + Math.sin(a) * ry * r}`);
	}
	return <Traco d={`M ${pts.join(' L ')}`} t={t} dur={16} cor={cor} w={w} />;
};

/** Seta curva desenhada à mão. */
export const Seta: React.FC<{de: P; para: P; t: number; cor?: string; curva?: number; w?: number}> = ({de, para, t, cor = COR.tinta, curva = 60, w = 6}) => {
	const f = useCurrentFrame();
	const mx = (de.x + para.x) / 2;
	const my = (de.y + para.y) / 2 - curva;
	const ang = Math.atan2(para.y - my, para.x - mx);
	const k = prog(f, t, t + 14);
	return (
		<g>
			<Traco d={`M ${de.x} ${de.y} Q ${mx} ${my} ${para.x} ${para.y}`} t={t} dur={14} cor={cor} w={w} />
			{k >= 1 && (
				<path
					d={`M ${para.x - 28 * Math.cos(ang - 0.5)} ${para.y - 28 * Math.sin(ang - 0.5)} L ${para.x} ${para.y} L ${para.x - 28 * Math.cos(ang + 0.5)} ${para.y - 28 * Math.sin(ang + 0.5)}`}
					{...traco}
					stroke={cor}
					strokeWidth={w}
				/>
			)}
		</g>
	);
};

export const Xis: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => (
	<g>
		<Traco d={`M ${x - 30 * s} ${y - 30 * s} L ${x + 30 * s} ${y + 30 * s}`} t={t} dur={6} cor={COR.vermelho} w={9} />
		<Traco d={`M ${x + 30 * s} ${y - 30 * s} L ${x - 30 * s} ${y + 30 * s}`} t={t + 5} dur={6} cor={COR.vermelho} w={9} />
	</g>
);
export const Check: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => <Traco d={`M ${x - 30 * s} ${y} L ${x - 8 * s} ${y + 24 * s} L ${x + 34 * s} ${y - 28 * s}`} t={t} dur={10} cor={COR.verde} w={10} />;

/** Post-it amarelo. */
export const PostIt: React.FC<{x: number; y: number; t: number; linhas: string[]; rot?: number; w?: number; tam?: number}> = ({x, y, t, linhas, rot = -4, w = 340, tam = 54}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	if (s <= 0) return null;
	const h = 70 + linhas.length * tam * 1.05;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
			<rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} fill="#000" opacity={0.12} />
			<rect x={-w / 2} y={-h / 2} width={w} height={h} fill={COR.postit} />
			<rect x={-w / 2} y={-h / 2} width={w} height={22} fill="#f3e15a" />
			{linhas.map((l, i) => (
				<text key={i} x={0} y={-h / 2 + 50 + (i + 0.7) * tam} textAnchor="middle" fontFamily={FONTE.mao} fontWeight={700} fontSize={tam} fill={COR.tinta}>
					{l}
				</text>
			))}
		</g>
	);
};

/** Balão de fala rabiscado. */
export const Balao: React.FC<{x: number; y: number; t: number; texto: string; w?: number; h?: number; cauda?: P; tam?: number; cor?: string; sai?: number}> = ({x, y, t, texto, w = 260, h = 120, cauda, tam = 60, cor = COR.tinta, sai}) => {
	const f = useCurrentFrame();
	if (sai !== undefined && f >= sai) return null;
	const s = pop(f, t, 30, 10);
	if (s <= 0) return null;
	const c = cauda ?? {x: x - w * 0.25, y: y + h * 0.9};
	return (
		<g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
			<path d={`M ${x - w * 0.12} ${y + h / 2 - 4} L ${c.x} ${c.y} L ${x + w * 0.08} ${y + h / 2 - 4}`} {...traco} fill={COR.papel} />
			<rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} {...traco} fill="#fffdf6" />
			<rect x={x - w * 0.14} y={y + h / 2 - 12} width={w * 0.24} height={14} fill="#fffdf6" />
			<text x={x} y={y + tam * 0.32} textAnchor="middle" fontFamily={FONTE.mao} fontWeight={700} fontSize={tam} fill={cor}>
				{texto}
			</text>
		</g>
	);
};

// ============================================================
// GATO RABISCADO (sentado, de frente)
// ============================================================
export const GatoRabisco: React.FC<{
	x: number;
	y: number;
	escala?: number;
	olhos?: number; // 0 aberto ... 1 fechado
	boca?: 'w' | 'aberta';
	rabo?: 'baixo' | 'alto';
	t?: number;
	cor?: string; // cor do pelo (preenchimento)
	manchas?: boolean;
	tremor?: number;
	amassar?: boolean;
	rot?: number;
}> = ({x, y, escala = 1, olhos = 0, boca = 'w', rabo = 'baixo', t = -999, cor = '#fffdf6', manchas, tremor = 0, amassar, rot = 0}) => {
	const f = useCurrentFrame();
	const s = pop(f, t) * escala;
	if (s <= 0) return null;
	const ry = 14 * (1 - olhos) + 1.5;
	const balanco = Math.sin(f * 0.12) * 6;
	const pe = (fase: number) => (amassar ? -Math.abs(Math.sin(f * 0.22 + fase)) * 26 : 0);
	return (
		<g transform={`translate(${x + tremor} ${y}) rotate(${rot}) scale(${s})`}>
			{rabo === 'alto' ? (
				<path d={`M 50 -40 C 95 -110 ${80 + balanco} -220 ${100 + balanco} -300 Q ${112 + balanco} -330 ${132 + balanco} -312`} {...traco} />
			) : (
				<path d={`M 55 -18 C 150 -10 ${170 + balanco} -90 ${120 + balanco} -150`} {...traco} />
			)}
			<path d="M -52 -150 C -112 -100 -104 0 -62 0 L 62 0 C 104 0 112 -100 52 -150 Z" {...traco} fill={cor} />
			{manchas && (
				<g fill={COR.grafite} opacity={0.5}>
					<circle cx={-40} cy={-60} r={14} />
					<circle cx={30} cy={-95} r={10} />
					<circle cx={45} cy={-30} r={12} />
				</g>
			)}
			<path d={`M -46 ${pe(0)} q 16 -26 32 0 M 14 ${pe(Math.PI / 2)} q 16 -26 32 0`} {...traco} fill={cor} />
			<path d="M -62 -232 L -58 -302 L -14 -266" {...traco} fill={cor} />
			<path d="M 62 -232 L 58 -302 L 14 -266" {...traco} fill={cor} />
			<path d="M -50 -270 L -48 -290 L -30 -276" fill={COR.rosa} opacity={0.6} />
			<path d="M 50 -270 L 48 -290 L 30 -276" fill={COR.rosa} opacity={0.6} />
			<circle cx={0} cy={-200} r={72} {...traco} fill={cor} />
			{manchas && <circle cx={-30} cy={-235} r={12} fill={COR.grafite} opacity={0.5} />}
			<ellipse cx={-26} cy={-212} rx={9} ry={ry} fill={COR.tinta} />
			<ellipse cx={26} cy={-212} rx={9} ry={ry} fill={COR.tinta} />
			<path d="M -8 -190 L 8 -190 L 0 -181 Z" fill={COR.rosa} stroke={COR.tinta} strokeWidth={3} />
			{boca === 'aberta' ? <ellipse cx={0} cy={-162} rx={14} ry={16} fill={COR.tinta} /> : <path d="M -16 -172 q 8 9 16 0 q 8 9 16 0" {...traco} strokeWidth={5} />}
			<g stroke={COR.tinta} strokeWidth={3.5} strokeLinecap="round">
				<line x1={-36} y1={-182} x2={-96} y2={-190} />
				<line x1={-36} y1={-174} x2={-96} y2={-168} />
				<line x1={36} y1={-182} x2={96} y2={-190} />
				<line x1={36} y1={-174} x2={96} y2={-168} />
			</g>
		</g>
	);
};

/** Bonequinho de palito (humano). */
export const Pessoa: React.FC<{x: number; y: number; escala?: number; t?: number; bracos?: 'baixo' | 'livro' | 'cima'; orelhasGato?: number}> = ({x, y, escala = 1, t = -999, bracos = 'baixo', orelhasGato}) => {
	const f = useCurrentFrame();
	const s = pop(f, t) * escala;
	if (s <= 0) return null;
	const br =
		bracos === 'livro'
			? 'M 0 -230 L -60 -170 L -10 -150 M 0 -230 L 60 -170 L 10 -150'
			: bracos === 'cima'
				? 'M 0 -230 L -70 -310 M 0 -230 L 70 -310'
				: 'M 0 -230 L -60 -140 M 0 -230 L 60 -140';
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path d="M 0 -250 L 0 -110 M 0 -110 L -50 0 M 0 -110 L 50 0" {...traco} />
			<path d={br} {...traco} />
			{bracos === 'livro' && <rect x={-50} y={-200} width={100} height={60} {...traco} fill={COR.azulClaro} transform="rotate(-6 0 -170)" />}
			<circle cx={0} cy={-310} r={60} {...traco} fill="#fffdf6" />
			<circle cx={-20} cy={-318} r={6} fill={COR.tinta} />
			<circle cx={20} cy={-318} r={6} fill={COR.tinta} />
			<path d="M -16 -288 q 16 10 32 0" {...traco} strokeWidth={5} />
			{orelhasGato !== undefined && (
				<>
					<Traco d="M -48 -350 L -55 -415 L -12 -368" t={orelhasGato} dur={10} />
					<Traco d="M 48 -350 L 55 -415 L 12 -368" t={orelhasGato + 6} dur={10} />
				</>
			)}
		</g>
	);
};

/** Ondinhas de som saindo de um ponto. */
export const Som: React.FC<{x: number; y: number; t: number; dir?: 1 | -1}> = ({x, y, t, dir = 1}) => {
	const f = useCurrentFrame();
	if (f < t) return null;
	return (
		<g>
			{[0, 1, 2].map((i) => {
				const c = ((f - t + i * 8) % 24) / 24;
				const r = 30 + c * 60;
				return <path key={i} d={`M ${x + dir * r * 0.5} ${y - r * 0.6} Q ${x + dir * r} ${y} ${x + dir * r * 0.5} ${y + r * 0.6}`} {...traco} strokeWidth={5} opacity={1 - c} />;
			})}
		</g>
	);
};

/** Coraçãozinho rabiscado. */
export const Coracao: React.FC<{x: number; y: number; t: number; s?: number; cor?: string}> = ({x, y, t, s = 1, cor = COR.vermelho}) => {
	const f = useCurrentFrame();
	const k = pop(f, t) * s;
	if (k <= 0) return null;
	return <path transform={`translate(${x} ${y}) scale(${k})`} d="M 0 28 C -55 -8 -38 -55 0 -26 C 38 -55 55 -8 0 28 Z" {...traco} stroke={cor} fill={COR.rosa} />;
};

// ============================================================
// LEGENDA escrita à mão, com marca-texto nas palavras-chave
// ============================================================
const MAX = 7;
const limpa = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export const Legenda: React.FC<{b: Bloco}> = ({b}) => {
	const f = useCurrentFrame();
	if (f > b.fala + 8) return null;
	const grupos: number[][] = [];
	let atual: number[] = [];
	b.palavras.forEach((p, i) => {
		atual.push(i);
		if (atual.length >= MAX || /[.?!:]$/.test(p.txt)) {
			grupos.push(atual);
			atual = [];
		}
	});
	if (atual.length) grupos.push(atual);
	const g = grupos.find((gr) => f < b.palavras[gr[gr.length - 1]].fim + 2) ?? grupos[grupos.length - 1];
	const dest = new Set(b.destaque.map(limpa));
	return (
		<div style={{position: 'absolute', left: 220, right: 80, bottom: 52, height: 110, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 20, fontFamily: FONTE.legenda, fontSize: 66, lineHeight: 1}}>
			{g.map((i) => {
				const p = b.palavras[i];
				const dita = f >= p.ini;
				const marca = dest.has(limpa(p.txt));
				return (
					<span
						key={i}
						style={{
							color: COR.tinta,
							opacity: dita ? 1 : 0,
							padding: '0 6px',
							background: marca && dita ? `linear-gradient(100deg, transparent 2%, ${COR.marca}cc 6%, ${COR.marca}cc 94%, transparent 98%)` : 'none',
							backgroundSize: `${marca ? Math.min(100, ((f - p.ini) / 6) * 100) : 0}% 62%`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: '0 70%',
						}}
					>
						{p.txt}
					</span>
				);
			})}
		</div>
	);
};


// ============================================================
// MAIS DESENHOS
// ============================================================
/** Gato de lado (correndo ou andando). Olha para a direita; use virado para a esquerda. */
export const GatoLado: React.FC<{x: number; y: number; escala?: number; correndo?: boolean; virado?: boolean; t?: number; cor?: string; manchas?: boolean}> = ({x, y, escala = 1, correndo, virado, t = -999, cor = '#fffdf6', manchas}) => {
	const f = useCurrentFrame();
	const s = pop(f, t) * escala;
	if (s <= 0) return null;
	const v = correndo ? 0.7 : 0.25;
	const a = Math.sin(f * v) * (correndo ? 40 : 18);
	const pulo = correndo ? Math.abs(Math.sin(f * v)) * 14 : 0;
	return (
		<g transform={`translate(${x} ${y - pulo}) scale(${virado ? -s : s} ${s})`}>
			<path d={`M -95 -95 C -160 -110 -170 ${-170 - a * 0.5} -140 ${-200 - a * 0.3}`} {...traco} />
			<path d={`M -80 -40 L ${-100 + a} 0 M -55 -40 L ${-40 - a} 0 M 55 -40 L ${70 + a} 0 M 80 -40 L ${95 - a} 0`} {...traco} />
			<ellipse cx={0} cy={-80} rx={105} ry={50} {...traco} fill={cor} />
			{manchas && (
				<g fill={COR.grafite} opacity={0.5}>
					<circle cx={-30} cy={-90} r={12} />
					<circle cx={30} cy={-70} r={10} />
				</g>
			)}
			<path d="M 92 -150 L 96 -205 L 128 -168" {...traco} fill={cor} />
			<path d="M 140 -160 L 160 -210 L 175 -158" {...traco} fill={cor} />
			<circle cx={135} cy={-125} r={50} {...traco} fill={cor} />
			<ellipse cx={150} cy={-132} rx={7} ry={11} fill={COR.tinta} />
			<path d="M 178 -118 L 186 -112 L 176 -108" fill={COR.rosa} stroke={COR.tinta} strokeWidth={3} />
			<g stroke={COR.tinta} strokeWidth={3} strokeLinecap="round">
				<line x1={170} y1={-112} x2={220} y2={-120} />
				<line x1={170} y1={-106} x2={220} y2={-100} />
			</g>
		</g>
	);
};

const pronto = (f: number, t: number, s = 1) => pop(f, t) * s;

export const Rato: React.FC<{x: number; y: number; t: number; s?: number; laco?: boolean}> = ({x, y, t, s = 1, laco}) => {
	const f = useCurrentFrame();
	const k = pronto(f, t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -60 -15 C -110 -10 -120 -50 -150 -40" {...traco} strokeWidth={5} />
			<path d="M -60 0 C -70 -60 40 -70 70 -10 L 60 0 Z" {...traco} fill="#e6e1d3" />
			<circle cx={30} cy={-50} r={18} {...traco} fill="#e6e1d3" />
			<circle cx={58} cy={-22} r={4} fill={COR.tinta} />
			{laco && <path d="M -10 -50 l -24 -16 l 0 32 z M -10 -50 l 24 -16 l 0 32 z" {...traco} strokeWidth={4} fill={COR.vermelho} />}
		</g>
	);
};

export const Passaro: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = pronto(f, t, s);
	if (k <= 0) return null;
	const asa = Math.sin(f * 0.5) * 20;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<ellipse cx={0} cy={0} rx={50} ry={34} {...traco} fill={COR.azulClaro} />
			<path d={`M -10 -10 Q -40 ${-60 - asa} -60 -20`} {...traco} fill={COR.azul} />
			<circle cx={30} cy={-12} r={5} fill={COR.tinta} />
			<path d="M 48 -6 L 72 0 L 48 8" {...traco} strokeWidth={5} fill={COR.marca} />
			<path d="M -10 32 L -14 52 M 10 32 L 6 52" {...traco} strokeWidth={5} />
		</g>
	);
};

export const Caixa: React.FC<{x: number; y: number; t: number; s?: number; children?: React.ReactNode}> = ({x, y, t, s = 1, children}) => {
	const f = useCurrentFrame();
	const k = pronto(f, t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -150 -160 L 150 -160 L 150 0 L -150 0 Z" {...traco} fill="#e8c89a" />
			{children}
			<path d="M -150 -160 L -200 -230 M 150 -160 L 200 -230" {...traco} />
			<path d="M -150 -100 L 150 -100" {...traco} fill="#e8c89a" />
			<path d="M -150 -100 L 150 -100 L 150 0 L -150 0 Z" {...traco} fill="#e8c89a" />
			<path d="M -40 -60 L 40 -60" {...traco} strokeWidth={4} />
		</g>
	);
};

export const Copo: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot})`}>
		<path d="M -40 -110 L 40 -110 L 32 0 L -32 0 Z" {...traco} fill={COR.azulClaro} />
		<path d="M 40 -90 C 80 -90 80 -30 34 -30" {...traco} />
		<path d="M -10 -140 q 10 -15 0 -30 M 12 -140 q 10 -15 0 -30" {...traco} strokeWidth={4} />
	</g>
);

export const Fantasma: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
	const f = useCurrentFrame();
	const k = pronto(f, t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y + Math.sin(f * 0.2) * 10}) scale(${k})`}>
			<path d="M -70 60 L -70 -40 C -70 -130 70 -130 70 -40 L 70 60 L 45 40 L 23 60 L 0 40 L -23 60 L -45 40 Z" {...traco} fill="#ffffff" />
			<ellipse cx={-25} cy={-40} rx={10} ry={16} fill={COR.tinta} />
			<ellipse cx={25} cy={-40} rx={10} ry={16} fill={COR.tinta} />
			<ellipse cx={0} cy={5} rx={14} ry={18} fill={COR.tinta} />
		</g>
	);
};

export const Casa: React.FC<{x: number; y: number; t: number; s?: number; children?: React.ReactNode}> = ({x, y, t, s = 1, children}) => {
	const f = useCurrentFrame();
	const k = pronto(f, t, s);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${k})`}>
			<path d="M -200 0 L -200 -230 L 200 -230 L 200 0 Z" {...traco} fill="#fffdf6" />
			<path d="M -240 -220 L 0 -400 L 240 -220" {...traco} fill={COR.azulClaro} />
			<path d="M -40 0 L -40 -120 L 40 -120 L 40 0" {...traco} />
			{children}
		</g>
	);
};

export {lerp, pisca, prog};
