import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COR, pop} from './tema';

const traco = {stroke: COR.tinta, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'};
const PELO = '#fffdf6';

export type Rabo = 'alto' | 'gancho' | 'tremendo' | 'baixo' | 'entre' | 'chicote' | 'swish' | 'enrolado' | 'abraco';
export type Orelhas = 'frente' | 'gira' | 'lado' | 'tras';
export type Olhos = 'normal' | 'dilatado' | 'fenda' | 'lento' | 'meio' | 'fechados' | 'encarando';
export type Bigodes = 'normal' | 'frente' | 'tras';
export type Boca = 'w' | 'aberta' | 'chiado' | 'lingua';

export type GatoSpec = {
	rabo?: Rabo;
	orelhas?: Orelhas;
	olhos?: Olhos;
	bigodes?: Bigodes;
	boca?: Boca;
	erizado?: boolean;
	amassar?: boolean;
	pele?: boolean; // pele "ondulando" nas costas (superestimulado)
};

/** Fechamento das pálpebras para a piscada lenta (0 aberto, 1 fechado). */
const piscadaLenta = (f: number) => {
	const c = f % 80;
	return c < 34 ? Math.sin((c / 34) * Math.PI) ** 2 : 0;
};

const caminhoRabo = (r: Rabo, f: number): string => {
	switch (r) {
		case 'gancho':
			return `M 50 -40 C 95 -110 80 -220 100 -300 Q 112 -350 78 -352 Q 56 -346 66 -322`;
		case 'tremendo': {
			const j = Math.sin(f * 2.2) * 5;
			return `M 50 -40 C 95 -110 ${80 + j} -220 ${100 + j} -300 Q ${110 + j} -330 ${130 + j} -312`;
		}
		case 'baixo':
			return `M 55 -18 C 140 -10 170 -10 210 4`;
		case 'chicote': {
			const a = Math.sin(f * 0.45);
			return `M 50 -40 Q 130 -70 ${80 + 150 * a} ${-170 + 30 * Math.abs(a)}`;
		}
		case 'swish': {
			const a = Math.sin(f * 0.12) * 0.5;
			const tip = Math.sin(f * 0.6) * 14;
			return `M 55 -30 C 150 -30 ${170 + 40 * a} -100 ${130 + 40 * a} -150 L ${130 + 40 * a + tip} -175`;
		}
		case 'abraco':
			return `M 50 -40 C 160 -60 230 -150 200 -230 C 180 -270 150 -240 170 -215`;
		case 'alto':
		default: {
			const b = Math.sin(f * 0.12) * 6;
			return `M 50 -40 C 95 -110 ${80 + b} -220 ${100 + b} -300 Q ${112 + b} -330 ${132 + b} -312`;
		}
	}
};

/** Espinhos de pelo eriçado em volta de um círculo. */
const Espinhos: React.FC<{cx: number; cy: number; r: number; n: number}> = ({cx, cy, r, n}) => (
	<g>
		{Array.from({length: n}, (_, i) => {
			const a = (i / n) * Math.PI * 2;
			return <line key={i} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a) * (r + 22)} y2={cy + Math.sin(a) * (r + 22)} {...traco} strokeWidth={5} />;
		})}
	</g>
);

// ============================================================
// GATO DE FRENTE (sentado) com todos os sinais configuráveis
// ============================================================
export const GatoFrente: React.FC<GatoSpec & {x: number; y: number; escala?: number; t?: number; rot?: number}> = ({
	x,
	y,
	escala = 1,
	t = -999,
	rot = 0,
	rabo = 'baixo',
	orelhas = 'frente',
	olhos = 'normal',
	bigodes = 'normal',
	boca = 'w',
	erizado,
	amassar,
	pele,
}) => {
	const f = useCurrentFrame();
	const s = pop(f, t) * escala;
	if (s <= 0) return null;
	const pe = (fase: number) => (amassar ? -Math.abs(Math.sin(f * 0.22 + fase)) * 26 : 0);
	const raboNaFrente = rabo === 'entre' || rabo === 'enrolado';
	const fecha = olhos === 'lento' ? piscadaLenta(f) : olhos === 'meio' ? 0.55 : olhos === 'fechados' ? 1 : 0;
	const pupila = olhos === 'dilatado' ? 14 : olhos === 'fenda' ? 2.5 : olhos === 'encarando' ? 4.5 : 7;
	// orelhas: rotação em volta da base
	const rotE = orelhas === 'lado' ? -55 : orelhas === 'gira' ? -10 + Math.sin(f * 0.15) * 30 : 0;
	const rotD = orelhas === 'lado' ? 55 : orelhas === 'gira' ? 10 + Math.sin(f * 0.15 + 1.6) * 30 : 0;
	const bg = (lado: 1 | -1) =>
		bigodes === 'frente'
			? `M ${lado * 36} -182 L ${lado * 104} -214 M ${lado * 36} -175 L ${lado * 106} -196`
			: bigodes === 'tras'
				? `M ${lado * 36} -180 L ${lado * 82} -162 M ${lado * 36} -174 L ${lado * 76} -150`
				: `M ${lado * 36} -182 L ${lado * 96} -190 M ${lado * 36} -174 L ${lado * 96} -168`;
	const ondula = pele ? Math.sin(f * 0.9) * 4 : 0;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
			{!raboNaFrente &&
				(erizado ? (
					<>
						<path d={caminhoRabo(rabo, f)} {...traco} strokeWidth={42} />
						<path d={caminhoRabo(rabo, f)} {...traco} strokeWidth={30} stroke={PELO} />
					</>
				) : (
					<path d={caminhoRabo(rabo, f)} {...traco} />
				))}
			{erizado && <Espinhos cx={0} cy={-80} r={95} n={22} />}
			<path d={`M -52 -150 C -112 ${-100 + ondula} -104 0 -62 0 L 62 0 C 104 0 112 ${-100 - ondula} 52 -150 Z`} {...traco} fill={PELO} />
			{pele && <path d={`M -40 ${-120 + ondula} q 20 -10 40 0 q 20 10 40 0`} {...traco} strokeWidth={4} stroke={COR.vermelho} />}
			<path d={`M -46 ${pe(0)} q 16 -26 32 0 M 14 ${pe(Math.PI / 2)} q 16 -26 32 0`} {...traco} fill={PELO} />
			{rabo === 'entre' && <path d="M 8 -4 C 30 -40 -10 -60 -6 -24" {...traco} />}
			{rabo === 'enrolado' && <path d="M 62 -8 C 120 6 60 30 -70 18" {...traco} />}
			{erizado && <Espinhos cx={0} cy={-200} r={74} n={18} />}
			{orelhas === 'tras' ? (
				<>
					<path d="M -60 -238 L -110 -262 L -36 -268" {...traco} fill={PELO} />
					<path d="M 60 -238 L 110 -262 L 36 -268" {...traco} fill={PELO} />
				</>
			) : (
				<>
					<g transform={`rotate(${rotE} -38 -255)`}>
						<path d="M -62 -232 L -58 -302 L -14 -266" {...traco} fill={PELO} />
						<path d="M -50 -270 L -48 -290 L -30 -276" fill={COR.rosa} opacity={0.6} />
					</g>
					<g transform={`rotate(${rotD} 38 -255)`}>
						<path d="M 62 -232 L 58 -302 L 14 -266" {...traco} fill={PELO} />
						<path d="M 50 -270 L 48 -290 L 30 -276" fill={COR.rosa} opacity={0.6} />
					</g>
				</>
			)}
			<circle cx={0} cy={-200} r={72} {...traco} fill={PELO} />
			{[-26, 26].map((ex) =>
				fecha > 0.85 ? (
					<path key={ex} d={`M ${ex - 15} -210 q 15 10 30 0`} {...traco} strokeWidth={5} />
				) : (
					<g key={ex} transform={`translate(${ex} -212) scale(1 ${1 - fecha})`}>
						<ellipse rx={17} ry={19} fill="#ffffff" stroke={COR.tinta} strokeWidth={4} />
						<ellipse rx={pupila} ry={15} fill={COR.tinta} />
						<circle cx={-4} cy={-7} r={3} fill="#ffffff" />
					</g>
				),
			)}
			{olhos === 'encarando' && <path d="M -48 -240 L -10 -228 M 48 -240 L 10 -228" {...traco} strokeWidth={5} />}
			<path d="M -8 -190 L 8 -190 L 0 -181 Z" fill={COR.rosa} stroke={COR.tinta} strokeWidth={3} />
			{boca === 'aberta' && <ellipse cx={0} cy={-162} rx={14} ry={16} fill={COR.tinta} />}
			{boca === 'chiado' && (
				<g>
					<ellipse cx={0} cy={-160} rx={24} ry={16} fill={COR.tinta} />
					<path d="M -14 -174 L -10 -160 L -6 -174 Z M 14 -174 L 10 -160 L 6 -174 Z" fill="#ffffff" />
				</g>
			)}
			{boca === 'lingua' && (
				<g>
					<path d="M -16 -172 q 8 9 16 0 q 8 9 16 0" {...traco} strokeWidth={5} />
					<path d="M -8 -168 q 8 26 16 0 Z" fill={COR.rosa} stroke={COR.tinta} strokeWidth={3} />
				</g>
			)}
			{boca === 'w' && <path d="M -16 -172 q 8 9 16 0 q 8 9 16 0" {...traco} strokeWidth={5} />}
			<path d={`${bg(-1)} ${bg(1)}`} stroke={COR.tinta} strokeWidth={3.5} strokeLinecap="round" fill="none" />
		</g>
	);
};

// ============================================================
// POSTURAS
// ============================================================
type Pos = {x: number; y: number; escala?: number; t?: number};
const usePop = (t: number, escala: number) => pop(useCurrentFrame(), t) * escala;

/** Gato "pão": patas escondidas, rabo enrolado na frente. */
export const GatoPao: React.FC<Pos> = ({x, y, escala = 1, t = -999}) => {
	const s = usePop(t, escala);
	if (s <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path d="M -130 0 C -140 -100 -80 -140 0 -140 C 80 -140 140 -100 130 0 Z" {...traco} fill={PELO} />
			<path d="M 120 -12 C 80 18 -60 18 -120 -6" {...traco} />
			<path d="M -62 -202 L -58 -272 L -14 -236 M 62 -202 L 58 -272 L 14 -236" {...traco} fill={PELO} />
			<circle cx={0} cy={-170} r={70} {...traco} fill={PELO} />
			<path d="M -42 -180 q 15 10 30 0 M 12 -180 q 15 10 30 0" {...traco} strokeWidth={5} />
			<path d="M -8 -160 L 8 -160 L 0 -151 Z" fill={COR.rosa} stroke={COR.tinta} strokeWidth={3} />
			<path d="M -16 -142 q 8 9 16 0 q 8 9 16 0" {...traco} strokeWidth={5} />
		</g>
	);
};

/** Gato de barriga pra cima. */
export const GatoBarriga: React.FC<Pos> = ({x, y, escala = 1, t = -999}) => {
	const f = useCurrentFrame();
	const s = usePop(t, escala);
	if (s <= 0) return null;
	const w = Math.sin(f * 0.15) * 8;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path d={`M 120 -40 C 200 -30 210 ${20 + w} 160 10`} {...traco} />
			<path d={`M -70 -90 L -90 ${-170 + w} M -20 -100 L -10 ${-180 - w} M 50 -100 L 60 ${-180 + w} M 100 -90 L 120 ${-170 - w}`} {...traco} />
			{[-90, -10, 60, 120].map((px, i) => (
				<circle key={i} cx={px} cy={-175 + (i % 2 ? -w : w)} r={14} {...traco} fill={PELO} />
			))}
			<ellipse cx={20} cy={-55} rx={130} ry={60} {...traco} fill={PELO} />
			<ellipse cx={20} cy={-70} rx={70} ry={30} fill={COR.rosa} opacity={0.35} />
			<g transform="translate(-150 -40) rotate(160)">
				<path d="M -55 -30 L -50 -95 L -12 -62 M 55 -30 L 50 -95 L 12 -62" {...traco} fill={PELO} />
				<circle r={60} {...traco} fill={PELO} />
				<path d="M -34 -6 q 12 8 24 0 M 10 -6 q 12 8 24 0" {...traco} strokeWidth={5} />
				<path d="M -14 22 q 7 8 14 0 q 7 8 14 0" {...traco} strokeWidth={4} />
			</g>
		</g>
	);
};

/** Gato de lado arqueado: `assustado` = gato de Halloween (pelo eriçado, chiando); senão, espreguiçando. */
export const GatoArco: React.FC<Pos & {assustado?: boolean}> = ({x, y, escala = 1, t = -999, assustado}) => {
	const f = useCurrentFrame();
	const s = usePop(t, escala);
	if (s <= 0) return null;
	const tremor = assustado && Math.floor(f / 2) % 2 ? 3 : 0;
	return (
		<g transform={`translate(${x + tremor} ${y}) scale(${s})`}>
			{assustado ? (
				<>
					<path d="M -120 -110 C -130 -200 -110 -260 -125 -320" {...traco} strokeWidth={46} />
					<path d="M -120 -110 C -130 -200 -110 -260 -125 -320" {...traco} strokeWidth={34} stroke={PELO} />
				</>
			) : (
				<path d="M -120 -110 C -170 -160 -160 -240 -120 -260" {...traco} />
			)}
			<path d="M -100 0 L -110 -100 M -70 0 L -80 -110 M 80 0 L 90 -110 M 110 0 L 115 -100" {...traco} />
			<path d="M -120 -100 C -110 -260 110 -260 120 -100 C 60 -130 -60 -130 -120 -100 Z" {...traco} fill={PELO} />
			{assustado &&
				Array.from({length: 13}, (_, i) => {
					const a = Math.PI + (i / 12) * Math.PI;
					return <line key={i} x1={Math.cos(a) * 110} y1={-120 + Math.sin(a) * 105} x2={Math.cos(a) * 138} y2={-120 + Math.sin(a) * 132} {...traco} strokeWidth={5} />;
				})}
			<g transform="translate(160 -120)">
				{assustado ? (
					<path d="M -20 -40 L -70 -60 L -30 -20 M 30 -40 L 70 -60 L 30 -20" {...traco} fill={PELO} />
				) : (
					<path d="M -40 -30 L -40 -90 L -5 -50 M 40 -30 L 40 -90 L 5 -50" {...traco} fill={PELO} />
				)}
				<circle r={55} {...traco} fill={PELO} />
				{assustado ? (
					<>
						<circle cx={-18} cy={-6} r={14} fill="#fff" stroke={COR.tinta} strokeWidth={4} />
						<circle cx={20} cy={-6} r={14} fill="#fff" stroke={COR.tinta} strokeWidth={4} />
						<circle cx={-18} cy={-6} r={10} fill={COR.tinta} />
						<circle cx={20} cy={-6} r={10} fill={COR.tinta} />
						<ellipse cx={0} cy={28} rx={18} ry={12} fill={COR.tinta} />
						<path d="M -10 18 L -6 30 L -2 18 Z M 10 18 L 6 30 L 2 18 Z" fill="#fff" />
					</>
				) : (
					<>
						<path d="M -30 -6 q 12 8 24 0 M 8 -6 q 12 8 24 0" {...traco} strokeWidth={5} />
						<path d="M -12 22 q 6 8 12 0 q 6 8 12 0" {...traco} strokeWidth={4} />
					</>
				)}
			</g>
		</g>
	);
};

/** Gato agachado (de lado), opcionalmente rebolando antes do bote. */
export const GatoAgachado: React.FC<Pos & {rebola?: boolean}> = ({x, y, escala = 1, t = -999, rebola}) => {
	const f = useCurrentFrame();
	const s = usePop(t, escala);
	if (s <= 0) return null;
	const r = rebola ? Math.sin(f * 0.8) * 6 : 0;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<g transform={`rotate(${r} 60 -40)`}>
				<path d="M -120 -40 C -200 -30 -240 -10 -280 -20" {...traco} />
				<path d="M -110 0 q -10 -30 20 -30 M -70 0 q -10 -30 20 -30" {...traco} />
				<ellipse cx={-20} cy={-45} rx={120} ry={42} {...traco} fill={PELO} />
			</g>
			<path d="M 60 0 L 80 -30 M 100 0 L 110 -30" {...traco} />
			<g transform="translate(130 -55)">
				<path d="M -30 -30 L -28 -85 L 2 -50 M 30 -30 L 34 -85 L 6 -50" {...traco} fill={PELO} />
				<circle r={50} {...traco} fill={PELO} />
				<circle cx={-14} cy={-6} r={13} fill="#fff" stroke={COR.tinta} strokeWidth={4} />
				<circle cx={20} cy={-6} r={13} fill="#fff" stroke={COR.tinta} strokeWidth={4} />
				<circle cx={-12} cy={-6} r={9} fill={COR.tinta} />
				<circle cx={22} cy={-6} r={9} fill={COR.tinta} />
				<path d="M 30 14 L 92 -6 M 30 20 L 92 18" stroke={COR.tinta} strokeWidth={3} />
			</g>
		</g>
	);
};

/** Gato dormindo enroladinho (rosquinha). */
export const GatoDorme: React.FC<Pos> = ({x, y, escala = 1, t = -999}) => {
	const f = useCurrentFrame();
	const s = usePop(t, escala);
	if (s <= 0) return null;
	const resp = 1 + Math.sin(f * 0.1) * 0.02;
	return (
		<g transform={`translate(${x} ${y}) scale(${s * resp} ${s})`}>
			<ellipse cx={0} cy={-60} rx={150} ry={70} {...traco} fill={PELO} />
			<path d="M 140 -40 C 120 20 -100 30 -150 -20" {...traco} strokeWidth={9} />
			<path d="M -110 -105 L -105 -150 L -75 -118 M -40 -112 L -30 -155 L -10 -118" {...traco} fill={PELO} />
			<circle cx={-70} cy={-75} r={52} {...traco} fill={PELO} />
			<path d="M -100 -78 q 10 8 20 0 M -66 -78 q 10 8 20 0" {...traco} strokeWidth={5} />
		</g>
	);
};

/** Mão (para carinho). `acariciar` faz a mão ir e voltar. */
export const Mao: React.FC<{x: number; y: number; t?: number; acariciar?: boolean; rot?: number; escala?: number}> = ({x, y, t = -999, acariciar, rot = 0, escala = 1}) => {
	const f = useCurrentFrame();
	const s = pop(f, t) * escala;
	if (s <= 0) return null;
	const dx = acariciar ? Math.sin(f * 0.18) * 50 : 0;
	return (
		<g transform={`translate(${x + dx} ${y}) rotate(${rot}) scale(${s})`}>
			<path d="M 0 0 C -10 -40 30 -60 70 -50 L 160 -40 C 175 -38 175 -18 160 -16 L 100 -14 L 150 -6 C 165 -4 165 16 150 16 L 95 14 L 140 24 C 152 27 150 45 136 44 L 90 38 L 120 50 C 130 55 124 70 110 66 L 40 48 C 10 42 4 20 0 0 Z" {...traco} strokeWidth={6} fill="#ffe2c4" />
			<path d="M -10 -20 L -160 -40 M 0 30 L -150 20" {...traco} strokeWidth={6} />
		</g>
	);
};
