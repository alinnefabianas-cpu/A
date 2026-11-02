import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRILHO, COR, FONTE, lerp, pop, prog} from './tema';
import type {Bloco} from './roteiro';

type P = {x: number; y: number};

// ============================================================
// GATO-PALITO: o personagem do canal. Montado em pedaços para
// mexer braço, perna, olho, orelha e rabo separadamente.
// ============================================================
export type Pose = 'em-pe' | 'andando' | 'correndo' | 'agachado' | 'deitado' | 'barriga';

type Esqueleto = {cabeca: P & {rot: number}; ombro: P; quadril: P; maoE: P; maoD: P; peE: P; peD: P; rabo: [P, P]};

const esqueleto = (pose: Pose, f: number, aceno: boolean, tremer: boolean): Esqueleto => {
	const k = Math.sin(f * 0.32);
	const tr = tremer ? Math.sin(f * 1.7) * 6 : 0;
	switch (pose) {
		case 'andando':
			return {
				cabeca: {x: 0, y: -178 - Math.abs(k) * 5, rot: 0},
				ombro: {x: 0, y: -118},
				quadril: {x: 0, y: -45},
				maoE: {x: 30 * k, y: -68},
				maoD: {x: -30 * k, y: -68},
				peE: {x: -30 * k, y: 0},
				peD: {x: 30 * k, y: 0},
				rabo: [{x: -55, y: -75 + k * 6}, {x: -75, y: -120 + k * 10}],
			};
		case 'correndo': {
			const c = Math.sin(f * 0.75);
			return {
				cabeca: {x: 34, y: -165 - Math.abs(c) * 8, rot: 8},
				ombro: {x: 20, y: -110},
				quadril: {x: -5, y: -48},
				maoE: {x: 20 + 50 * c, y: -80 + 10 * Math.abs(c)},
				maoD: {x: 20 - 50 * c, y: -80},
				peE: {x: -50 * c, y: -Math.max(0, c) * 25},
				peD: {x: 50 * c, y: -Math.max(0, -c) * 25},
				rabo: [{x: -70, y: -60}, {x: -120, y: -70 + c * 12}],
			};
		}
		case 'agachado':
			return {
				cabeca: {x: 70, y: -98, rot: 6},
				ombro: {x: 30, y: -72},
				quadril: {x: -50, y: -50},
				maoE: {x: 55, y: 0},
				maoD: {x: 80, y: 0},
				peE: {x: -75, y: 0},
				peD: {x: -40, y: 0},
				rabo: [{x: -110, y: -40 + k * 4}, {x: -140, y: -12 + Math.sin(f * 0.9) * 10}],
			};
		case 'deitado': {
			const r = Math.sin(f * 0.11) * 3.5; // respiração
			return {
				cabeca: {x: -100, y: -46 - r * 0.3, rot: -8},
				ombro: {x: -52, y: -36 - r},
				quadril: {x: 58, y: -32 - r * 0.6},
				maoE: {x: -78, y: -6 + tr * 0.3},
				maoD: {x: -40, y: -6 - tr * 0.5},
				peE: {x: 100, y: -6 + tr * 0.4},
				peD: {x: 78, y: -6 - tr * 0.4},
				rabo: [{x: 70, y: -10}, {x: 40, y: -70}],
			};
		}
		case 'barriga': {
			const w = Math.sin(f * 0.2) * 6;
			return {
				cabeca: {x: -105, y: -48, rot: -18},
				ombro: {x: -52, y: -32},
				quadril: {x: 52, y: -32},
				maoE: {x: -70, y: -92 + w},
				maoD: {x: -38, y: -98 - w},
				peE: {x: 40, y: -96 - w},
				peD: {x: 74, y: -90 + w},
				rabo: [{x: 110, y: -20}, {x: 130, y: -2 + w}],
			};
		}
		default:
			return {
				cabeca: {x: 0, y: -178, rot: 0},
				ombro: {x: 0, y: -118},
				quadril: {x: 0, y: -45},
				maoE: {x: -38, y: -66},
				maoD: aceno ? {x: 58 + Math.sin(f * 0.5) * 14, y: -175} : {x: 38, y: -66},
				peE: {x: -24, y: 0},
				peD: {x: 24, y: 0},
				rabo: [{x: 55, y: -80 + k * 6}, {x: 75, y: -125 + k * 12}],
			};
	}
};

export const GatoPalito: React.FC<{
	x: number;
	y: number;
	escala?: number;
	pose?: Pose;
	olhos?: 'abertos' | 'fechados';
	orelha?: number; // giro da orelha direita (graus)
	aceno?: boolean;
	virado?: boolean;
	tremer?: boolean;
	opacidade?: number;
}> = ({x, y, escala = 1, pose = 'em-pe', olhos = 'abertos', orelha = 0, aceno = false, virado = false, tremer = false, opacidade = 1}) => {
	const f = useCurrentFrame();
	const e = esqueleto(pose, f, aceno, tremer);
	// piscada automática
	const pisca = olhos === 'abertos' && f % 110 > 104;
	const fechado = olhos === 'fechados' || pisca;
	const traco = {stroke: COR.branco, strokeWidth: 8, strokeLinecap: 'round' as const, fill: 'none'};
	const q = e.quadril;
	return (
		<g transform={`translate(${x} ${y}) scale(${virado ? -escala : escala} ${escala})`} opacity={opacidade}>
			{/* rabo */}
			<path d={`M ${q.x} ${q.y} Q ${q.x + e.rabo[0].x * 0.6} ${q.y + e.rabo[0].y * 0.2} ${q.x + e.rabo[0].x} ${q.y + e.rabo[0].y * 0.5} T ${q.x + e.rabo[1].x} ${q.y + e.rabo[1].y * 0.6}`} {...traco} stroke={COR.azulClaro} />
			{/* corpo */}
			<line x1={e.ombro.x} y1={e.ombro.y} x2={q.x} y2={q.y} {...traco} />
			<line x1={q.x} y1={q.y} x2={e.peE.x} y2={e.peE.y} {...traco} />
			<line x1={q.x} y1={q.y} x2={e.peD.x} y2={e.peD.y} {...traco} />
			<line x1={e.ombro.x} y1={e.ombro.y} x2={e.maoE.x} y2={e.maoE.y} {...traco} />
			<line x1={e.ombro.x} y1={e.ombro.y} x2={e.maoD.x} y2={e.maoD.y} {...traco} />
			{/* patinhas */}
			{[e.maoE, e.maoD, e.peE, e.peD].map((p, i) => (
				<circle key={i} cx={p.x} cy={p.y} r={7} fill={COR.branco} />
			))}
			<line x1={e.ombro.x} y1={e.ombro.y} x2={e.cabeca.x} y2={e.cabeca.y + 30} {...traco} />
			{/* cabeça */}
			<g transform={`translate(${e.cabeca.x} ${e.cabeca.y}) rotate(${e.cabeca.rot})`}>
				<path d="M -42 -16 L -32 -66 L -6 -42 Z" fill={COR.fundo2} stroke={COR.branco} strokeWidth={6} strokeLinejoin="round" />
				<g transform={`rotate(${orelha} 20 -40)`}>
					<path d="M 42 -16 L 32 -66 L 6 -42 Z" fill={COR.fundo2} stroke={COR.branco} strokeWidth={6} strokeLinejoin="round" />
				</g>
				<circle r={46} fill={COR.fundo2} stroke={COR.branco} strokeWidth={6} />
				{fechado ? (
					<>
						<path d="M -27 -2 Q -17 7 -7 -2" stroke={COR.azulClaro} strokeWidth={5} fill="none" strokeLinecap="round" />
						<path d="M 7 -2 Q 17 7 27 -2" stroke={COR.azulClaro} strokeWidth={5} fill="none" strokeLinecap="round" />
					</>
				) : (
					<>
						<circle cx={-17} cy={-4} r={9} fill={COR.azul} style={{filter: BRILHO}} />
						<circle cx={17} cy={-4} r={9} fill={COR.azul} style={{filter: BRILHO}} />
						<circle cx={-14} cy={-7} r={3} fill={COR.branco} />
						<circle cx={20} cy={-7} r={3} fill={COR.branco} />
					</>
				)}
				<path d="M -6 10 L 6 10 L 0 17 Z" fill={COR.azulClaro} />
				<path d="M -9 21 Q -4 26 0 21 Q 4 26 9 21" stroke={COR.branco} strokeWidth={3} fill="none" strokeLinecap="round" />
				{[-1, 1].map((s) => (
					<g key={s} stroke={COR.cinza} strokeWidth={2.5} strokeLinecap="round">
						<line x1={s * 22} y1={14} x2={s * 62} y2={6} />
						<line x1={s * 22} y1={19} x2={s * 62} y2={22} />
					</g>
				))}
			</g>
		</g>
	);
};

// ============================================================
// FUNDO: azul-noite com grade de pontos e estrelinhas.
// ============================================================
export const Fundo: React.FC = () => {
	const f = useCurrentFrame();
	const pontos = [];
	for (let i = 0; i < 26; i++) {
		for (let j = 0; j < 15; j++) {
			pontos.push(<circle key={`${i}-${j}`} cx={i * 80 + ((f * 0.3) % 80)} cy={j * 80 + 20} r={1.6} fill={COR.linha} />);
		}
	}
	const estrelas = Array.from({length: 40}, (_, i) => {
		const sx = (i * 487) % 1920;
		const sy = (i * 263) % 1080;
		const a = 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(f * 0.05 + i));
		return <circle key={i} cx={sx} cy={sy} r={i % 5 === 0 ? 2.4 : 1.4} fill={COR.azulClaro} opacity={a} />;
	});
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${COR.fundo2} 0%, ${COR.fundo} 70%)`}}>
			<svg width={1920} height={1080}>
				{pontos}
				{estrelas}
			</svg>
		</AbsoluteFill>
	);
};

// ============================================================
// LEGENDA palavra por palavra, sincronizada com a fala.
// ============================================================
const MAX_PALAVRAS = 7;
export const Legenda: React.FC<{b: Bloco}> = ({b}) => {
	const f = useCurrentFrame();
	// quebra em grupos curtos (até 7 palavras ou fim de frase)
	const grupos: number[][] = [];
	let atual: number[] = [];
	b.palavras.forEach((p, i) => {
		atual.push(i);
		if (atual.length >= MAX_PALAVRAS || /[.?!:]$/.test(p.txt)) {
			grupos.push(atual);
			atual = [];
		}
	});
	if (atual.length) grupos.push(atual);
	const g = grupos.find((gr) => f < b.palavras[gr[gr.length - 1]].fim + 2) ?? grupos[grupos.length - 1];
	if (f > b.fala + 6) return null;
	const limpa = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
	const dest = new Set(b.destaque.map(limpa));
	return (
		<div style={{position: 'absolute', bottom: 64, width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 22, fontFamily: FONTE.titulo, fontWeight: 800, fontSize: 58, lineHeight: 1.1, padding: '0 160px', boxSizing: 'border-box'}}>
			{g.map((i) => {
				const p = b.palavras[i];
				const dita = f >= p.ini;
				const agora = dita && f < p.fim;
				const azul = dest.has(limpa(p.txt));
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							color: azul ? COR.azul : COR.branco,
							opacity: dita ? 1 : 0.28,
							transform: `scale(${agora ? 1.07 : 1})`,
							filter: azul && dita ? BRILHO : 'none',
							textShadow: '0 4px 0 rgba(0,0,0,0.5)',
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
// TEXTO GRANDE que pula na tela (e pode ser riscado).
// ============================================================
export const Palavra: React.FC<{
	x: number;
	y: number;
	t: number;
	texto: string;
	tam?: number;
	cor?: string;
	risco?: number;
	brilho?: boolean;
	ancora?: 'start' | 'middle' | 'end';
	sai?: number;
}> = ({x, y, t, texto, tam = 120, cor = COR.azul, risco, brilho = true, ancora = 'middle', sai}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	const o = sai !== undefined ? 1 - prog(f, sai, sai + 8) : 1;
	if (s <= 0 || o <= 0) return null;
	const larg = texto.length * tam * 0.52;
	const x0 = ancora === 'middle' ? x - larg / 2 : ancora === 'end' ? x - larg : x;
	const r = risco !== undefined ? prog(f, risco, risco + 10) : 0;
	return (
		<g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`} opacity={o}>
			<text x={x} y={y} textAnchor={ancora} fontFamily={FONTE.titulo} fontWeight={800} fontSize={tam} fill={cor} style={{filter: brilho ? BRILHO : 'none'}} dominantBaseline="middle">
				{texto}
			</text>
			{r > 0 && <line x1={x0 - 20} y1={y + 4} x2={lerp(x0 - 20, x0 + larg + 20, r)} y2={y - 6} stroke={COR.alerta} strokeWidth={14} strokeLinecap="round" />}
		</g>
	);
};

/** Rótulo com seta apontando para algo (estilo "← personagem"). */
export const Rotulo: React.FC<{de: P; para: P; t: number; texto: string; tam?: number; sai?: number}> = ({de, para, t, texto, tam = 40, sai}) => {
	const f = useCurrentFrame();
	const k = prog(f, t, t + 12);
	const o = (sai !== undefined ? 1 - prog(f, sai, sai + 8) : 1) * prog(f, t, t + 4);
	if (o <= 0) return null;
	const fim = {x: lerp(de.x, para.x, k), y: lerp(de.y, para.y, k)};
	const ang = Math.atan2(para.y - de.y, para.x - de.x);
	return (
		<g opacity={o}>
			<text x={de.x} y={de.y - 18} textAnchor="middle" fontFamily={FONTE.ui} fontWeight={600} fontSize={tam} fill={COR.azulClaro}>
				{texto}
			</text>
			<line x1={de.x} y1={de.y} x2={fim.x} y2={fim.y} stroke={COR.azulClaro} strokeWidth={4} strokeDasharray="10 8" />
			{k > 0.95 && (
				<path d={`M 0 0 L -18 -10 L -18 10 Z`} transform={`translate(${para.x} ${para.y}) rotate(${(ang * 180) / Math.PI})`} fill={COR.azulClaro} />
			)}
		</g>
	);
};

/** Número que conta de `de` até `ate`. */
export const Contador: React.FC<{x: number; y: number; t: number; dur: number; de: number; ate: number; sufixo?: string; tam?: number}> = ({x, y, t, dur, de, ate, sufixo = '', tam = 180}) => {
	const f = useCurrentFrame();
	if (f < t) return null;
	const v = Math.round(lerp(de, ate, prog(f, t, t + dur)));
	const s = pop(f, t);
	return (
		<text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={tam * s} fill={COR.branco} style={{filter: BRILHO}}>
			{v}
			<tspan fill={COR.azul} fontSize={tam * 0.45 * s}>
				{sufixo}
			</tspan>
		</text>
	);
};

// ============================================================
// ÍCONES
// ============================================================
export const Zzz: React.FC<{x: number; y: number; t?: number}> = ({x, y, t = 0}) => {
	const f = useCurrentFrame() - t;
	if (f < 0) return null;
	return (
		<g>
			{[0, 1, 2].map((i) => {
				const c = ((f + i * 22) % 66) / 66;
				return (
					<text key={i} x={x + c * 60 + i * 4} y={y - c * 110} fontFamily={FONTE.titulo} fontWeight={800} fontSize={34 + c * 30} fill={COR.azulClaro} opacity={Math.sin(c * Math.PI)}>
						z
					</text>
				);
			})}
		</g>
	);
};

export const Rato: React.FC<{x: number; y: number; s?: number; virado?: boolean}> = ({x, y, s = 1, virado}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x} ${y}) scale(${virado ? -s : s} ${s})`}>
			<path d={`M -40 -8 Q -80 ${-20 + Math.sin(f * 0.4) * 8} -100 -4`} stroke={COR.cinza} strokeWidth={4} fill="none" strokeLinecap="round" />
			<ellipse cx={0} cy={-22} rx={42} ry={24} fill={COR.cinza} />
			<circle cx={28} cy={-44} r={14} fill={COR.cinza} stroke={COR.fundo} strokeWidth={3} />
			<circle cx={36} cy={-26} r={4} fill={COR.fundo} />
			<circle cx={44} cy={-18} r={4} fill={COR.alerta} />
		</g>
	);
};

export const Passaro: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
	const f = useCurrentFrame();
	const a = Math.sin(f * 0.6) * 18;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<ellipse cx={0} cy={0} rx={30} ry={20} fill={COR.azulClaro} />
			<path d={`M -6 -6 L -40 ${-20 - a} L 10 -4 Z`} fill={COR.azul} />
			<circle cx={22} cy={-10} r={4} fill={COR.fundo} />
			<path d="M 30 -4 L 44 0 L 30 4 Z" fill={COR.branco} />
		</g>
	);
};

export const Coracao: React.FC<{x: number; y: number; s?: number; cor?: string}> = ({x, y, s = 1, cor = COR.azul}) => (
	<path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill={cor} style={{filter: BRILHO}} />
);

export const Bateria: React.FC<{x: number; y: number; nivel: number; s?: number; raio?: boolean}> = ({x, y, nivel, s = 1, raio}) => {
	const n = Math.max(0, Math.min(1, nivel));
	const cor = n < 0.25 ? COR.alerta : COR.azul;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<rect x={-90} y={-170} width={180} height={340} rx={26} fill="none" stroke={COR.branco} strokeWidth={10} />
			<rect x={-40} y={-198} width={80} height={28} rx={8} fill={COR.branco} />
			<rect x={-68} y={148 - 296 * n} width={136} height={296 * n} rx={14} fill={cor} style={{filter: BRILHO}} />
			{raio && <path d="M 14 -90 L -36 10 L 0 10 L -14 90 L 40 -14 L 4 -14 Z" fill={COR.branco} />}
			<text x={0} y={235} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={56} fill={COR.branco}>
				{Math.round(n * 100)}%
			</text>
		</g>
	);
};

export const Raio: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<path transform={`translate(${x} ${y}) scale(${s})`} d="M 14 -90 L -36 10 L 0 10 L -14 90 L 40 -14 L 4 -14 Z" fill={COR.azul} style={{filter: BRILHO}} />
);

/** Ondas de som saindo de um ponto. */
export const Barulho: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
	const f = useCurrentFrame() - t;
	if (f < 0) return null;
	return (
		<g>
			{[0, 1, 2].map((i) => {
				const c = ((f + i * 10) % 30) / 30;
				return <circle key={i} cx={x} cy={y} r={20 + c * 70} fill="none" stroke={COR.azulClaro} strokeWidth={5} opacity={(1 - c) * prog(f, 0, 6)} />;
			})}
			<text x={x} y={y + 14} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={40} fill={COR.branco}>
				!
			</text>
		</g>
	);
};

/** Chão: linha simples com brilho. */
export const Chao: React.FC<{y?: number}> = ({y = 800}) => <line x1={120} y1={y} x2={1800} y2={y} stroke={COR.azulEscuro} strokeWidth={5} strokeLinecap="round" />;
