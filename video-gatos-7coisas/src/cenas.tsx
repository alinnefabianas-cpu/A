import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Balao, Caixa, Casa, Check, Circulo, Copo, Coracao, Escrito, Fantasma, GatoLado, GatoRabisco, Passaro, Pessoa, PostIt, Rato, Seta, Som, Traco, Xis} from './componentes';
import {em, type Bloco} from './roteiro';
import {COR, FONTE, lerp, pisca, pop, prog} from './tema';

type Cena = React.FC<{b: Bloco}>;
const BASE = 840;
const tr = {stroke: COR.tinta, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'};

export const TITULOS = ['Making biscuits', 'The head bump', 'Box obsession', 'Knocking things off', 'The chattering', 'The gifts', 'The zoomies'];

/** Cabeçalho do item: "#3" circulado + título com marca-texto. `novo` = anima a entrada. */
const Numero: React.FC<{n: number; novo?: boolean}> = ({n, novo}) => {
	const t = novo ? 0 : -60;
	return (
		<g>
			<Escrito x={290} y={235} t={t} texto={`#${n}`} tam={120} ancora="middle" cor={COR.vermelho} vel={3} />
			<Circulo cx={290} cy={200} rx={95} ry={75} t={t + 4} />
			<Escrito x={420} y={225} t={t + 8} texto={TITULOS[n - 1]} tam={86} marca={COR.marca} vel={2} />
		</g>
	);
};

const Chao: React.FC<{y?: number; x0?: number; x1?: number}> = ({y = BASE, x0 = 220, x1 = 1820}) => <Traco d={`M ${x0} ${y} Q ${(x0 + x1) / 2} ${y + 6} ${x1} ${y}`} t={-60} w={5} cor={COR.grafite} />;

const Relogio: React.FC<{x: number; y: number; texto: string; t: number; tremor?: boolean}> = ({x, y, texto, t, tremor}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	if (s <= 0) return null;
	const dx = tremor && pisca(f, 2) ? 5 : 0;
	return (
		<g transform={`translate(${x + dx} ${y}) scale(${s})`}>
			<circle r={90} {...tr} fill="#fffdf6" />
			<circle cx={-66} cy={-72} r={24} {...tr} fill={COR.azulClaro} />
			<circle cx={66} cy={-72} r={24} {...tr} fill={COR.azulClaro} />
			<text y={22} textAnchor="middle" fontFamily={FONTE.mao} fontWeight={700} fontSize={66} fill={COR.vermelho}>
				{texto}
			</text>
		</g>
	);
};

const Mesa: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 520}) => (
	<g>
		<Traco d={`M ${x - w / 2} ${y} L ${x + w / 2} ${y}`} t={-60} w={9} />
		<Traco d={`M ${x - w / 2 + 40} ${y} L ${x - w / 2 + 40} ${BASE} M ${x + w / 2 - 40} ${y} L ${x + w / 2 - 40} ${BASE}`} t={-60} />
	</g>
);

const Linhas: React.FC<{x: number; y: number; t: number; dir?: 1 | -1}> = ({x, y, t, dir = 1}) => {
	const f = useCurrentFrame();
	if (f < t) return null;
	return (
		<g>
			{[0, 1, 2].map((i) => (
				<line key={i} x1={x} y1={y + i * 40} x2={x - dir * (120 + ((f + i * 7) % 20) * 4)} y2={y + i * 40} stroke={COR.tinta} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
			))}
		</g>
	);
};

// ============================================================
// INTRO
// ============================================================
export const Intro: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tKn = em(b, 'kneads');
	const tKo = em(b, 'knocks');
	const tCr = em(b, 'crazy');
	const queda = prog(f, tKo + 8, tKo + 22, (v) => v * v);
	return (
		<g>
			<Escrito x={260} y={210} t={0} texto="Weird cat habits..." tam={80} vel={1.4} />
			{/* 1: amassando */}
			<Traco d="M 230 330 L 700 330 L 700 760 L 230 760 Z" t={tKn - 6} dur={14} w={4} cor={COR.grafite} />
			<GatoRabisco x={465} y={720} escala={0.85} t={tKn} amassar olhos={0.6} />
			<Escrito x={465} y={810} t={tKn + 4} texto="kneading you" tam={52} ancora="middle" />
			{/* 2: derrubando */}
			<Traco d="M 760 330 L 1230 330 L 1230 760 L 760 760 Z" t={tKo - 6} dur={14} w={4} cor={COR.grafite} />
			{f >= tKo && (
				<g>
					<Traco d="M 790 600 L 1080 600" t={tKo} w={8} />
					<GatoRabisco x={900} y={600} escala={0.55} t={tKo} />
					<Copo x={lerp(1050, 1110, queda)} y={600 + queda * 150} rot={queda * 120} />
				</g>
			)}
			<Escrito x={995} y={810} t={tKo + 4} texto="knocking stuff off" tam={52} ancora="middle" />
			{/* 3: 3 da manhã */}
			<Traco d="M 1290 330 L 1760 330 L 1760 760 L 1290 760 Z" t={tCr - 6} dur={14} w={4} cor={COR.grafite} />
			{f >= tCr && (
				<g>
					<Relogio x={1525} y={460} texto="3:00" t={tCr} tremor />
					<GatoLado x={lerp(1350, 1690, ((f - tCr) % 30) / 30)} y={720} escala={0.4} correndo />
				</g>
			)}
			<Escrito x={1525} y={810} t={tCr + 4} texto="3 a.m. chaos" tam={52} ancora="middle" />
		</g>
	);
};

export const Intro2: Cena = ({b}) => {
	const tRe = em(b, 'reason');
	const tSe = em(b, 'seven');
	const tSc = em(b, 'science');
	return (
		<g>
			<Escrito x={260} y={240} t={tRe} texto="Every weird habit = a reason" tam={84} vel={1.6} />
			<Escrito x={300} y={420} t={tSe} texto="7" tam={260} ancora="middle" cor={COR.vermelho} vel={1} />
			<Circulo cx={300} cy={340} rx={130} ry={130} t={tSe + 6} />
			<Escrito x={500} y={400} t={tSe + 4} texto="strange things cats do" tam={80} />
			<Escrito x={500} y={520} t={tSc} texto="+ the science behind them" tam={80} marca={COR.marca} />
			{TITULOS.map((_, i) => (
				<g key={i}>
					<Traco d={`M ${560 + i * 160} 640 l 90 0 l 0 90 l -90 0 Z`} t={tSc + 8 + i * 3} dur={8} w={5} />
					<Escrito x={605 + i * 160} y={705} t={tSc + 10 + i * 3} texto="?" tam={70} ancora="middle" cor={COR.grafite} />
				</g>
			))}
		</g>
	);
};

// ============================================================
// #1 AMASSAR PÃOZINHO
// ============================================================
export const Amassa: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tBi = em(b, 'biscuits');
	const tPa = em(b, 'paws');
	const tKn = em(b, 'kneading');
	return (
		<g>
			<Numero n={1} novo />
			<path d={`M 380 ${BASE} C 500 ${BASE - 40} 900 ${BASE - 40} 1020 ${BASE}`} {...tr} fill={COR.azulClaro} />
			<GatoRabisco x={700} y={BASE - 20} escala={1} amassar={f >= tPa} olhos={f >= tPa ? 0.7 : 0} />
			{f >= tBi && (
				<g transform={`translate(1350 470) scale(${pop(f, tBi)})`}>
					<path d="M -110 30 C -120 -50 -60 -80 0 -80 C 60 -80 120 -50 110 30 C 100 60 -100 60 -110 30 Z" {...tr} fill="#e8c89a" />
					<path d="M -60 -20 q 20 -20 40 0 M 10 -30 q 20 -20 40 0" {...tr} strokeWidth={5} />
				</g>
			)}
			<Escrito x={1350} y={620} t={tBi + 4} texto="biscuits!" tam={64} ancora="middle" />
			<Seta de={{x: 860, y: 760}} para={{x: 760, y: 820}} t={tPa} curva={40} cor={COR.vermelho} />
			<Escrito x={880} y={700} t={tPa + 4} texto="in, out, in, out..." tam={52} cor={COR.vermelho} />
			<Escrito x={1180} y={760} t={tKn} texto="= kneading" tam={72} marca={COR.marca} />
		</g>
	);
};

export const Amassa2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tKi = em(b, 'kittens');
	const tMi = em(b, 'milk');
	const tAd = em(b, 'adult');
	const tSa = em(b, 'safe');
	return (
		<g>
			<Numero n={1} />
			{f < tAd ? (
				<g>
					<GatoLado x={600} y={BASE} escala={1.1} t={0} />
					<GatoRabisco x={850} y={BASE} escala={0.35} t={tKi} amassar olhos={1} />
					<Escrito x={850} y={650} t={tKi + 4} texto="kitten" tam={52} ancora="middle" />
					{f >= tMi &&
						[0, 1, 2].map((i) => (
							<path key={i} transform={`translate(${720 + i * 40} ${grade(560 - ((f - tMi + i * 8) % 24) * 3)})`} d="M 0 -20 C 12 0 12 14 0 14 C -12 14 -12 0 0 -20 Z" {...tr} strokeWidth={4} fill="#ffffff" />
						))}
					<Escrito x={1150} y={460} t={tMi} texto="kneading = milk flows" tam={64} />
				</g>
			) : (
				<g>
					<Pessoa x={1100} y={BASE} escala={1.05} t={tAd - 4} />
					<GatoRabisco x={880} y={BASE} escala={0.65} t={tAd} amassar olhos={0.8} />
					<Escrito x={360} y={460} t={tAd} texto="adult cat kneads you" tam={64} />
					<Escrito x={360} y={560} t={tSa} texto="= safe & happy," tam={70} cor={COR.verde} />
					<Escrito x={360} y={650} t={tSa + 24} texto="like a kitten again" tam={64} marca={COR.marca} />
					<Coracao x={990} y={480} t={tSa + 6} />
				</g>
			)}
		</g>
	);
};
const grade = (v: number) => Math.round(v / 4) * 4;

// ============================================================
// #2 CABEÇADA
// ============================================================
export const Cabeca: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tHe = em(b, 'head');
	const tCh = em(b, 'cheeks');
	const tCu = em(b, 'cute');
	const esfrega = f >= tCh ? Math.sin(f * 0.25) * 10 : 0;
	return (
		<g>
			<Numero n={2} novo />
			<Pessoa x={1050} y={BASE} escala={1.25} t={0} />
			<GatoRabisco x={880} y={BASE} escala={0.7} t={tHe} rot={18 + esfrega} olhos={f >= tCh ? 1 : 0} />
			{f >= tCh &&
				[0, 1].map((i) => <path key={i} d={`M ${940 + i * 20} ${560 - i * 30} q 30 -20 40 10`} {...tr} strokeWidth={5} opacity={pisca(f + i * 4, 6) ? 1 : 0.3} />)}
			<Escrito x={360} y={450} t={tCh} texto="cheeks + forehead" tam={64} />
			<Escrito x={360} y={550} t={tCu} texto="not just cute..." tam={64} cor={COR.vermelho} />
		</g>
	);
};

export const Cabeca2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tSc = em(b, 'scent');
	const tRu = em(b, 'rub');
	const tIn = em(b, 'invisible');
	const tFa = em(b, 'family');
	return (
		<g>
			<Numero n={2} />
			<GatoRabisco x={560} y={BASE + 40} escala={1.35} t={0} />
			{f >= tSc &&
				(
					[
						[-60, -230],
						[60, -230],
						[0, -300],
					] as [number, number][]
				).map(([dx, dy], i) => (
					<circle key={i} cx={560 + dx * 1.35} cy={BASE + 40 + dy * 1.35} r={14 + (pisca(f + i * 3, 6) ? 4 : 0)} fill={COR.marca} stroke={COR.vermelho} strokeWidth={4} />
				))}
			<Seta de={{x: 860, y: 380}} para={{x: 680, y: 470}} t={tSc + 4} curva={30} cor={COR.vermelho} />
			<Escrito x={880} y={390} t={tSc + 4} texto="scent glands" tam={66} cor={COR.vermelho} />
			{f >= tRu && (
				<g>
					<Pessoa x={1480} y={BASE} escala={0.95} t={tRu} />
					{f >= tIn &&
						Array.from({length: 8}, (_, i) => (
							<text key={i} x={1380 + ((i * 53) % 200)} y={560 + ((i * 71) % 260)} fontFamily={FONTE.mao} fontSize={40} fill={COR.azul} opacity={0.4 + 0.6 * (pisca(f + i * 3, 7) ? 1 : 0)}>
								✦
							</text>
						))}
				</g>
			)}
			<PostIt x={1220} y={560} t={tFa} linhas={['this human is', 'my FAMILY']} w={400} rot={-5} />
		</g>
	);
};

// ============================================================
// #3 CAIXAS
// ============================================================
export const CaixaCena: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tEx = em(b, 'expensive');
	const tSi = em(b, 'sit');
	return (
		<g>
			<Numero n={3} novo />
			{f >= tEx && (
				<g transform={`translate(600 ${BASE}) scale(${pop(f, tEx)})`}>
					<path d="M -200 0 C -220 -80 -200 -120 -160 -120 L 160 -120 C 200 -120 220 -80 200 0 Z" {...tr} fill={COR.rosa} />
					<path d="M -150 -120 C -150 -60 150 -60 150 -120" {...tr} fill="#ffd6e6" />
				</g>
			)}
			<PostIt x={420} y={520} t={tEx + 6} linhas={['$89.99']} w={220} rot={-8} tam={56} />
			<Escrito x={600} y={640} t={tEx + 10} texto="fancy bed" tam={56} ancora="middle" />
			<Caixa x={1300} y={BASE} t={tEx + 14}>{f >= tSi && <GatoRabisco x={0} y={-60} escala={0.7} t={tSi} />}</Caixa>
			{f >= tSi && (
				<>
					<Xis x={600} y={720} t={tSi + 6} s={1.2} />
					<Check x={1300} y={300} t={tSi + 10} s={1.4} />
				</>
			)}
		</g>
	);
};

export const Caixa2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tPr = em(b, 'protected');
	const tSt = em(b, 'study');
	const tHi = em(b, 'hiding');
	const tFa = em(b, 'faster');
	return (
		<g>
			<Numero n={3} />
			<Caixa x={520} y={BASE} t={0} s={0.9}>
				<GatoRabisco x={0} y={-60} escala={0.65} olhos={0.6} />
			</Caixa>
			<Escrito x={520} y={460} t={tPr} texto="= protected" tam={66} ancora="middle" cor={COR.verde} />
			{f >= tSt && (
				<g>
					<Escrito x={980} y={360} t={tSt} texto="Shelter cat study:" tam={66} marca={COR.marca} />
					<Escrito x={980} y={470} t={tHi} texto="with a hiding box" tam={56} />
					<Escrito x={980} y={600} t={tHi + 14} texto="no box" tam={56} />
					<Escrito x={980} y={720} t={tFa} texto="time to calm down" tam={46} cor={COR.grafite} />
					<rect x={1420} y={432} width={lerp(0, 140, prog(f, tFa, tFa + 14))} height={50} fill={COR.verde} stroke={COR.tinta} strokeWidth={5} />
					<rect x={1420} y={562} width={lerp(0, 360, prog(f, tFa + 4, tFa + 22))} height={50} fill={COR.vermelho} stroke={COR.tinta} strokeWidth={5} />
					<Escrito x={1580} y={470} t={tFa + 14} texto="faster!" tam={56} cor={COR.verde} />
				</g>
			)}
		</g>
	);
};

// ============================================================
// #4 DERRUBAR COISAS DA MESA
// ============================================================
export const MesaCena: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tLo = em(b, 'looks');
	const tSl = em(b, 'slowly');
	const tEd = em(b, 'edge');
	const empurra = prog(f, tSl, tEd, (v) => v);
	const queda = prog(f, tEd + 2, tEd + 16, (v) => v * v);
	const xCopo = lerp(1060, 1200, empurra) + queda * 60;
	return (
		<g>
			<Numero n={4} novo />
			<Mesa x={980} y={560} w={560} />
			<GatoRabisco x={880} y={560} escala={0.75} t={0} olhos={f >= tLo ? 0.35 : 0} />
			<Copo x={xCopo} y={560 + queda * 270} rot={queda * 140} />
			{f >= tLo && <Escrito x={720} y={300} t={tLo} texto="*stares at you*" tam={56} cor={COR.vermelho} />}
			{f >= tSl && <path d={`M 950 450 Q ${lerp(1000, 1080, empurra)} 470 ${lerp(1020, 1150, empurra)} 470`} {...tr} />}
			{f >= tEd + 16 && <Escrito x={1260} y={BASE - 10} t={tEd + 16} texto="CRASH!" tam={80} cor={COR.vermelho} />}
		</g>
	);
};

export const Mesa2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tIn = em(b, 'instinct');
	const tTa = em(b, 'tapping');
	const tSt = em(b, 'strategy');
	const tFa = em(b, 'falls');
	const toque = f >= tTa ? Math.abs(Math.sin((f - tTa) * 0.3)) * 20 : 0;
	return (
		<g>
			<Numero n={4} />
			<Escrito x={300} y={380} t={tIn} texto="1. hunting instinct" tam={64} marca={COR.marca} />
			<GatoRabisco x={430} y={BASE} escala={0.6} t={tIn} />
			<path d={`M 520 ${BASE - 70 + toque} q 30 -10 50 0`} {...tr} />
			<Rato x={690} y={BASE} t={tTa} s={0.8} />
			<Escrito x={560} y={520} t={tTa + 4} texto="does it move?" tam={56} cor={COR.vermelho} />
			<Escrito x={1060} y={380} t={tSt} texto="2. pure strategy" tam={64} marca={COR.marca} />
			{f >= tFa && (
				<g>
					<Pessoa x={1400} y={BASE} escala={0.9} t={tFa} />
					<g fill="#fffdf6" stroke={COR.tinta} strokeWidth={5}>
						<circle cx={1380} cy={BASE * 0 + 551} r={20} />
						<circle cx={1420} cy={551} r={20} />
					</g>
					<circle cx={1374} cy={553} r={8} fill={COR.tinta} />
					<circle cx={1414} cy={553} r={8} fill={COR.tinta} />
					<Seta de={{x: 1300, y: 480}} para={{x: 1150, y: 600}} t={tFa + 4} curva={30} cor={COR.vermelho} />
					<Escrito x={1180} y={520} t={tFa + 6} texto="you look!" tam={58} cor={COR.vermelho} ancora="end" />
					<Check x={1600} y={480} t={tFa + 12} s={1.2} />
				</g>
			)}
		</g>
	);
};

// ============================================================
// #5 TAGARELAR PARA PASSARINHO
// ============================================================
export const Tagarela: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tBi = em(b, 'bird');
	const tCl = em(b, 'clicking');
	return (
		<g>
			<Numero n={5} novo />
			<Traco d="M 1000 320 L 1600 320 L 1600 760 L 1000 760 Z M 1300 320 L 1300 760 M 1000 540 L 1600 540" t={-60} />
			<Passaro x={1440} y={460} t={tBi} />
			<GatoRabisco x={720} y={BASE} escala={0.9} t={0} boca={f >= tCl && pisca(f, 3) ? 'aberta' : 'w'} />
			{f >= tCl &&
				['k', 'k', 'k', 'k'].map((k, i) => (
					<text key={i} x={820 + i * 45} y={500 - i * 30 + (pisca(f + i, 3) ? 6 : 0)} fontFamily={FONTE.mao} fontWeight={700} fontSize={64} fill={COR.vermelho}>
						{k}
					</text>
				))}
			<Escrito x={360} y={420} t={tCl + 6} texto="*chatter chatter*" tam={58} />
		</g>
	);
};

export const Tagarela2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tEx = em(b, 'excitement');
	const tFr = em(b, 'frustration');
	const tAm = em(b, 'amazon');
	const tIm = em(b, 'imitating');
	const tMo = em(b, 'monkeys');
	return (
		<g>
			<Numero n={5} />
			<Escrito x={300} y={380} t={0} texto="Why? Theories:" tam={66} />
			<Escrito x={320} y={480} t={tEx} texto="excitement?" tam={62} />
			<Escrito x={320} y={570} t={tFr} texto="frustration?" tam={62} />
			{f >= tAm && (
				<g>
					{[0, 1, 2, 3].map((i) => (
						<path key={i} d={`M ${1040 + i * 180} ${BASE} C ${1000 + i * 180} ${BASE - 200} ${1100 + i * 180} ${BASE - 300} ${1060 + i * 180} ${BASE - 420}`} stroke={COR.verde} strokeWidth={8} fill="none" opacity={prog(f, tAm, tAm + 10)} />
					))}
					<Escrito x={1300} y={340} t={tAm} texto="Amazon rainforest" tam={62} ancora="middle" cor={COR.verde} />
					<GatoLado x={1150} y={BASE} escala={0.6} t={tAm + 4} manchas />
				</g>
			)}
			<Balao x={1150} y={520} t={tIm} texto="ooh-ooh?" w={260} h={110} cauda={{x: 1230, y: 640}} />
			{f >= tMo && (
				<g transform={`translate(1580 ${470 + Math.sin(f * 0.2) * 8}) scale(${pop(f, tMo)})`}>
					<circle r={55} {...tr} fill="#e8c89a" />
					<circle cx={-55} cy={0} r={22} {...tr} fill="#e8c89a" />
					<circle cx={55} cy={0} r={22} {...tr} fill="#e8c89a" />
					<circle cx={-18} cy={-8} r={7} fill={COR.tinta} />
					<circle cx={18} cy={-8} r={7} fill={COR.tinta} />
					<ellipse cx={0} cy={22} rx={16} ry={10} fill={COR.tinta} />
					<Escrito x={0} y={110} t={tMo} texto="monkey" tam={48} ancora="middle" />
				</g>
			)}
		</g>
	);
};

// ============================================================
// #6 PRESENTES
// ============================================================
export const Presente: Cena = ({b}) => {
	const tMo = em(b, 'mouse');
	const tBu = em(b, 'bug');
	const tLi = em(b, 'lizard');
	const tFe = em(b, 'feet');
	return (
		<g>
			<Numero n={6} novo />
			<Pessoa x={1380} y={BASE} escala={1.1} t={0} />
			<GatoRabisco x={760} y={BASE} escala={0.8} t={0} />
			<Escrito x={700} y={440} t={tMo - 10} texto="*proud*" tam={60} cor={COR.verde} ancora="middle" />
			<Rato x={1080} y={BASE} t={tMo} s={0.9} laco />
			<g>
				<Escrito x={1000} y={400} t={tBu} texto="bug?" tam={56} />
				<Escrito x={1000} y={480} t={tLi} texto="lizard?!" tam={56} />
			</g>
			<Escrito x={1380} y={380} t={tFe} texto="!!!" tam={90} ancora="middle" cor={COR.vermelho} />
		</g>
	);
};

export const Presente2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tHu = em(b, 'hunters');
	const tSa = em(b, 'safe');
	const tHo = em(b, 'home');
	const tSh = em(b, 'share');
	const tTe = em(b, 'teach');
	const x = lerp(260, 780, prog(f, tSa, tHo + 10, (v) => v));
	return (
		<g>
			<Numero n={6} />
			<Escrito x={300} y={380} t={tHu} texto="natural hunters" tam={62} marca={COR.marca} />
			<Casa x={1000} y={BASE} t={tSa - 6} s={0.9} />
			<Escrito x={1000} y={BASE - 140} t={tHo} texto="SAFE" tam={56} ancora="middle" cor={COR.verde} />
			<g transform={`translate(${x} ${BASE})`}>
				<GatoLado x={0} y={0} escala={0.5} t={tHu} />
				<Rato x={115} y={-50} t={tHu} s={0.35} />
			</g>
			{f >= tSh && (
				<g>
					<Escrito x={1360} y={420} t={tSh} texto="theory:" tam={56} cor={COR.grafite} />
					<Escrito x={1360} y={510} t={tSh + 4} texto="sharing?" tam={62} />
					<Escrito x={1360} y={600} t={tTe} texto="teaching you" tam={62} />
					<Escrito x={1360} y={680} t={tTe + 10} texto="to hunt?!" tam={62} marca={COR.marca} />
				</g>
			)}
		</g>
	);
};

export const Presente3: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tGr = em(b, 'gross');
	const tSc = em(b, 'scold');
	const tGt = em(b, 'great');
	return (
		<g>
			<Numero n={6} />
			<Escrito x={360} y={400} t={tGr} texto="gross? yes." tam={66} />
			<Balao x={560} y={560} t={tSc} texto="BAD CAT!" w={300} h={110} cauda={{x: 500, y: 640}} />
			<Xis x={560} y={560} t={tSc + 8} s={1.6} />
			<GatoRabisco x={1200} y={BASE} escala={0.9} t={0} />
			{f >= tGt && (
				<g>
					<Traco d="M 1120 520 L 1140 460 L 1170 500 L 1200 440 L 1230 500 L 1260 460 L 1280 520 Z" t={tGt} dur={10} fill={COR.marca} />
					<Balao x={1500} y={420} t={tGt + 4} texto="nailed it." w={290} h={110} cauda={{x: 1320, y: 520}} />
				</g>
			)}
		</g>
	);
};

// ============================================================
// #7 ZOOMIES
// ============================================================
export const Zoomies: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tSp = em(b, 'sprints');
	const tGh = em(b, 'ghost');
	const ciclo = ((f - tSp) % 40) / 40;
	const x = lerp(-200, 2100, ciclo);
	return (
		<g>
			<Numero n={7} novo />
			<Chao />
			{f < tSp && <GatoRabisco x={960} y={BASE} escala={0.8} t={0} />}
			{f >= tSp && (
				<g>
					<GatoLado x={x} y={BASE} escala={0.8} correndo />
					<Linhas x={x - 140} y={BASE - 150} t={tSp} />
					{f >= tGh && <Fantasma x={x - 380} y={BASE - 220} t={tGh} s={0.9} />}
				</g>
			)}
			<Escrito x={360} y={420} t={tSp} texto="out of nowhere: ZOOM" tam={66} cor={COR.vermelho} />
		</g>
	);
};

export const Zoomies2: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tFr = em(b, 'frenetic');
	const tEn = em(b, 'energy');
	const tDu = em(b, 'dusk');
	const tNi = em(b, 'night');
	const letras: [string, string][] = [
		['F', 'renetic'],
		['R', 'andom'],
		['A', 'ctivity'],
		['P', 'eriods'],
	];
	return (
		<g>
			<Numero n={7} />
			{letras.map(([l, r], i) => (
				<g key={l}>
					<Escrito x={320} y={390 + i * 95} t={tFr + i * 8} texto={l} tam={84} cor={COR.vermelho} />
					<Escrito x={372} y={390 + i * 95} t={tFr + i * 8 + 2} texto={r} tam={70} />
				</g>
			))}
			<Escrito x={320} y={790} t={tFr + 40} texto="= FRAPs" tam={66} marca={COR.marca} />
			{f >= tEn && (
				<g>
					<rect x={1080} y={360} width={120} height={300} {...tr} fill="#fffdf6" />
					<rect x={1110} y={340} width={60} height={20} {...tr} fill="#fffdf6" />
					<rect x={1092} y={lerp(648, 372, prog(f, tEn, tEn + 12))} width={96} height={lerp(0, 276, prog(f, tEn, tEn + 12))} fill={COR.verde} />
					{pisca(f, 4) && <path d="M 1150 400 L 1120 500 L 1160 500 L 1130 600" stroke={COR.marca} strokeWidth={10} fill="none" />}
					<Escrito x={1140} y={720} t={tEn} texto="stored energy" tam={52} ancora="middle" />
				</g>
			)}
			{f >= tDu && (
				<g>
					<path d="M 1480 520 a 60 60 0 1 1 120 0 Z" {...tr} fill={COR.marca} />
					<Traco d="M 1440 520 L 1640 520" t={tDu} w={5} />
					<Escrito x={1540} y={600} t={tDu} texto="dusk & dawn" tam={52} ancora="middle" />
				</g>
			)}
			{f >= tNi && <path d="M 1700 300 a 50 50 0 1 0 36 86 a 40 40 0 1 1 -36 -86 Z" {...tr} fill={COR.marca} />}
		</g>
	);
};

export const Zoomies3: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tIn = em(b, 'indoor');
	const tHu = em(b, 'hunting');
	const tPl = em(b, 'play');
	const tSl = em(b, 'sleep');
	const pulo = f >= tPl && f < tSl ? Math.abs(Math.sin((f - tPl) * 0.2)) * 120 : 0;
	return (
		<g>
			<Numero n={7} />
			{f < tPl ? (
				<g>
					<Casa x={620} y={BASE} t={tIn} s={0.85}>
						<GatoRabisco x={0} y={0} escala={0.4} t={tIn} />
					</Casa>
					<Escrito x={1050} y={460} t={tIn + 4} texto="indoor cat:" tam={62} />
					<Escrito x={1050} y={560} t={tHu} texto="no hunting = extra energy" tam={58} cor={COR.vermelho} />
				</g>
			) : (
				<g>
					<Pessoa x={1200} y={BASE} escala={1} t={tPl} bracos="cima" />
					<Traco d="M 1130 520 Q 1000 380 860 430" t={tPl} dur={10} w={5} />
					<path d="M 860 430 q -30 20 -20 50 q 20 -10 20 -50 Z" {...tr} fill={COR.rosa} />
					<GatoRabisco x={760} y={BASE - pulo} escala={0.65} t={tPl} />
					<Escrito x={380} y={420} t={tPl} texto="play before bed" tam={64} marca={COR.marca} />
					{f >= tSl && <Escrito x={760} y={420} t={tSl} texto="zzz..." tam={70} cor={COR.grafite} />}
					{f >= tSl && <Escrito x={1260} y={360} t={tSl + 6} texto="zzz" tam={60} cor={COR.grafite} />}
				</g>
			)}
		</g>
	);
};

// ============================================================
// FIM + CTA
// ============================================================
export const Fim: Cena = ({b}) => {
	const tWe = em(b, 'weird');
	const tRe = em(b, 'reason');
	return (
		<g>
			<Escrito x={260} y={220} t={0} texto="Recap" tam={86} marca={COR.marca} />
			{TITULOS.map((tt, i) => (
				<g key={tt}>
					<Escrito x={300 + (i > 3 ? 760 : 0)} y={360 + (i % 4) * 100} t={i * 5} texto={`${i + 1}. ${tt}`} tam={58} vel={2.5} />
					<Check x={260 + (i > 3 ? 760 : 0)} y={345 + (i % 4) * 100} t={i * 5 + 6} s={0.6} />
				</g>
			))}
			<Escrito x={1060} y={760} t={tWe} texto="weird = there's a reason" tam={60} />
			<GatoRabisco x={1700} y={BASE} escala={0.6} t={tRe} olhos={0.5} />
		</g>
	);
};

export const Cta: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tNu = em(b, 'number');
	const tTe = em(b, 'tell');
	return (
		<g>
			<Escrito x={260} y={230} t={0} texto="Which one does YOUR cat do most?" tam={78} vel={1.8} />
			{TITULOS.map((_, i) => (
				<g key={i}>
					<Traco d={`M ${300 + i * 170} 360 l 120 0 l 0 120 l -120 0 Z`} t={i * 2} dur={8} w={5} />
					<Escrito x={360 + i * 170} y={445} t={i * 2 + 4} texto={`${i + 1}`} tam={80} ancora="middle" />
				</g>
			))}
			{f >= tNu && <Circulo cx={360 + 6 * 170} cy={420} rx={90} ry={85} t={tNu} />}
			<Seta de={{x: 700, y: 560}} para={{x: 700, y: 760}} t={tTe} curva={-40} cor={COR.vermelho} w={8} />
			<Escrito x={760} y={700} t={tTe + 4} texto="comment the number!" tam={68} marca={COR.marca} />
			<GatoRabisco x={1600} y={BASE} escala={0.75} t={0} boca="aberta" />
			<Som x={1680} y={600} t={tTe} />
		</g>
	);
};

export const CENAS: Record<string, Cena> = {
	intro: Intro,
	intro2: Intro2,
	amassa: Amassa,
	amassa2: Amassa2,
	cabeca: Cabeca,
	cabeca2: Cabeca2,
	caixa: CaixaCena,
	caixa2: Caixa2,
	mesa: MesaCena,
	mesa2: Mesa2,
	tagarela: Tagarela,
	tagarela2: Tagarela2,
	presente: Presente,
	presente2: Presente2,
	presente3: Presente3,
	zoomies: Zoomies,
	zoomies2: Zoomies2,
	zoomies3: Zoomies3,
	fim: Fim,
	cta: Cta,
};
