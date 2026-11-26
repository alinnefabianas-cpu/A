// Episódio (EN): cenouras já foram roxas.
// Fontes: Smithsonian, World Carrot Museum, Wageningen University, Snopes, National Geographic.
// Primeiras cenouras cultivadas (Afeganistão/Pérsia, ~séc. X): roxas e amarelas. Laranja popularizada por
// produtores holandeses no séc. XVII. Homenagem a Guilherme de Orange: sem prova (tratado como mito).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';

export const FALAS = [
	'Carrots used to be purple.',
	'The first farmed carrots were mostly purple and yellow.',
	'Then, in the 1600s, Dutch farmers made orange carrots popular.',
	'People love to say it was a tribute to William of Orange, the Dutch hero.',
	"But there's no real proof of that. Orange carrots probably just grew well and tasted great.",
	'Still, the orange ones took over the world. And purple carrots? You can still find them today.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const LARANJA = '#f08a24', ROXO = '#7a2f8f', AMARELO_C = '#f2c230';

function mix(a: string, b: string, t: number) {
	const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

export const Cenoura: React.FC<{cor?: string; s?: number; feliz?: boolean; rot?: number}> = ({cor = LARANJA, s = 1, feliz = true, rot = 0}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) rotate(${rot})`}>
			{[-30, 0, 30].map((a, i) => <path key={a} d="M0 -170 Q-30 -260 0 -320 Q30 -260 0 -170" fill="#3c8a4a" stroke={CONTORNO} strokeWidth={6} transform={`rotate(${a + Math.sin(f / 8 + i) * 4} 0 -170)`} />)}
			<path d="M-70 -170 Q0 -200 70 -170 Q60 60 0 230 Q-60 60 -70 -170Z" fill={cor} stroke={CONTORNO} strokeWidth={9} />
			{[-100, -40, 20, 80].map((y, i) => <path key={y} d={`M${i % 2 ? 20 : -50} ${y} q 20 6 30 0`} stroke={mix(cor, '#000000', 0.3)} strokeWidth={6} fill="none" strokeLinecap="round" />)}
			{feliz && (
				<g>
					<circle cx={-24} cy={-110} r={9} fill={CONTORNO} />
					<circle cx={24} cy={-110} r={9} fill={CONTORNO} />
					<path d="M-22 -80 Q0 -60 22 -80" stroke={CONTORNO} strokeWidth={6} fill="none" strokeLinecap="round" />
				</g>
			)}
		</g>
	);
};

const Fundo: React.FC<{cor?: string}> = ({cor = '#ffe0b0'}) => (
	<g>
		<rect width={W} height={H} fill={cor} />
		<circle cx={540} cy={900} r={640} fill="rgba(255,255,255,0.28)" />
		{Array.from({length: 22}).map((_, i) => <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1920} r={14} fill="rgba(255,255,255,0.35)" />)}
	</g>
);

const Campo: React.FC<{children?: React.ReactNode; ceu?: string}> = ({children, ceu = '#bfe3ff'}) => (
	<g>
		<rect width={W} height={H} fill={ceu} />
		<circle cx={860} cy={260} r={100} fill="#fff1a8" />
		<rect y={1150} width={W} height={770} fill="#7a5230" />
		{Array.from({length: 5}).map((_, i) => <rect key={i} y={1190 + i * 150} width={W} height={36} fill="#694527" />)}
		<rect y={1100} width={W} height={70} fill="#6fae4f" />
		{children}
	</g>
);

const Moinho: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<path d="M-90 0 L-60 -380 L60 -380 L90 0Z" fill="#c9a27a" stroke={CONTORNO} strokeWidth={8} />
			<path d="M-70 -380 L0 -460 L70 -380Z" fill="#8a3a2a" stroke={CONTORNO} strokeWidth={8} />
			<rect x={-28} y={-90} width={56} height={90} rx={26} fill="#6b4a36" stroke={CONTORNO} strokeWidth={6} />
			<g transform={`translate(0, -360) rotate(${f * 3})`}>
				{[0, 90, 180, 270].map((a) => (
					<g key={a} transform={`rotate(${a})`}>
						<rect x={-8} y={-300} width={16} height={300} fill="#6b4a36" />
						<rect x={8} y={-290} width={70} height={230} fill="#f6ead0" stroke={CONTORNO} strokeWidth={6} />
					</g>
				))}
				<circle r={18} fill={CONTORNO} />
			</g>
		</g>
	);
};

const Globo: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<circle r={260} fill="#3f8fdc" stroke={CONTORNO} strokeWidth={10} />
			<g transform={`translate(${((f * 2) % 200) - 100}, 0)`}>
				<path d="M-160 -120 q60 -60 120 -10 q30 60 -40 90 q-70 10 -80 -80Z" fill="#6fae4f" />
				<path d="M40 -40 q80 -30 120 30 q-10 90 -80 110 q-60 -40 -40 -140Z" fill="#6fae4f" />
				<path d="M-120 80 q50 -10 70 40 q-20 50 -60 40Z" fill="#6fae4f" />
			</g>
			<circle r={260} fill="none" stroke={CONTORNO} strokeWidth={10} />
		</g>
	);
};

// 0 — gancho: cenouras eram roxas
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRoxo = m('purple');
	const t = interpolate(f, [tRoxo - 2, tRoxo + 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.35]} para={[540, 900, 1.1]} dur={dur} soco={tRoxo}>
				<Fundo />
				<g transform={`translate(540, 900) rotate(${Math.sin(f / 6) * 5})`}><Cenoura cor={mix(LARANJA, ROXO, t)} s={1.9} /></g>
				<Placa x={540} y={1600} k={usePop(tRoxo + 4, 9)} txt="PURPLE?!" tam={130} cor="#c98ae0" />
			</Camera>
			<Sfx src="whoosh" em={tRoxo - 2} vol={0.4} />
			<Sfx src="boom" em={tRoxo + 4} vol={0.4} />
		</>
	);
};

// 1 — as primeiras cenouras cultivadas: roxas e amarelas
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const tRoxo = m('purple'), tAm = m('yellow');
	const kR = usePop(tRoxo, 10), kA = usePop(tAm, 10);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1000, 1.0]} dur={dur}>
				<Campo>
					<g transform={`translate(300, 820) scale(${kR})`}><Cenoura cor={ROXO} s={1.2} rot={-10} /></g>
					<g transform={`translate(780, 820) scale(${kA})`}><Cenoura cor={AMARELO_C} s={1.2} rot={10} /></g>
					<Personagem x={540} y={2090} escala={0.95} roupa="fazendeiro" cor="#5a8f6a" cabelo="#4a3326" expressao="feliz" bracoD={140} bracoE={140} cotoveloD={-10} cotoveloE={-10} fase={1} />
				</Campo>
				<Placa x={540} y={300} k={usePop(4, 10)} txt="THE FIRST CARROTS" tam={80} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tRoxo} vol={0.4} />
			<Sfx src="pop" em={tAm} vol={0.4} />
		</>
	);
};

// 2 — anos 1600: holandeses popularizam a laranja
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1600s'), tHol = m('dutch'), tLar = m('orange');
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.0]} dur={dur} soco={tLar}>
				<Campo>
					<g transform={`translate(800, 1110) scale(${usePop(tHol - 4, 12)})`}><Moinho s={1.1} /></g>
					{[160, 330, 500].map((x, i) => {
						const k = usePop(tLar + i * 4, 10);
						return <g key={x} transform={`translate(${x}, 1060) scale(${k * 0.7})`}><Cenoura s={1} rot={(i - 1) * 8} /></g>;
					})}
					{f >= tHol && <Personagem x={330} y={2010} escala={0.9} roupa="campones" cor="#f08a24" cabelo="#c9a227" expressao="feliz" olhar={1} bracoD={150} cotoveloD={-10} fase={2} />}
				</Campo>
				<Placa x={540} y={260} k={usePop(tAno, 10)} txt="1600s" tam={130} />
				<Placa x={540} y={450} k={usePop(tHol, 10)} txt="THE NETHERLANDS" tam={70} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tHol} vol={0.35} />
			{[0, 4, 8].map((d) => <Sfx key={d} src="pop" em={tLar + d} vol={0.3} />)}
		</>
	);
};

// 3 — "homenagem a Guilherme de Orange"
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tHom = m('tribute'), tWil = m('william'), tHeroi = m('hero');
	const kQ = usePop(2, 11);
	return (
		<>
			<Camera de={[540, 900, 1.15]} para={[540, 900, 1.05]} dur={dur} soco={tHeroi}>
				<Fundo cor="#ffd3a0" />
				<g transform={`translate(540, 820) scale(${kQ})`}>
					<rect x={-280} y={-380} width={560} height={640} fill="#f6ead0" stroke="#c9a227" strokeWidth={30} />
					<rect x={-280} y={-380} width={560} height={640} fill="none" stroke={CONTORNO} strokeWidth={8} />
					<g transform="translate(0, 0)"><Personagem x={0} y={560} escala={0.95} roupa="oficial" cor="#e8742a" cabelo="#6b3a1f" expressao="serio" fase={1} /></g>
				</g>
				{f >= tHom && <g transform={`translate(880, 1520) rotate(${Math.sin(f / 4) * 8})`}><Cenoura s={0.9} /></g>}
				{f >= tHom && <g transform={`translate(200, 1520) rotate(${-Math.sin(f / 4) * 8})`}><Cenoura s={0.9} /></g>}
				<Placa x={540} y={1600} k={usePop(tWil + 6, 10)} txt="WILLIAM OF ORANGE" tam={70} />
			</Camera>
			<Sfx src="pop" em={2} vol={0.4} />
			<Sfx src="ding" em={tHeroi} vol={0.4} />
		</>
	);
};

// 4 — sem prova: provavelmente só cresciam bem e eram gostosas
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tProva = m('proof'), tCresce = m('grew'), tGosto = m('tasted');
	const kCarimbo = usePop(tProva, 8);
	const morde = f >= tGosto;
	const ksC = [0, 1, 2, 3, 4].map((i) => usePop(tCresce + i * 3, 10));
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur} soco={tProva}>
				<Fundo cor="#e9e2d0" />
				{f < tCresce ? (
					<g transform="translate(540, 800)">
						<rect x={-240} y={-300} width={480} height={560} fill="#f6ead0" stroke="#c9a227" strokeWidth={24} />
						<Personagem x={0} y={500} escala={0.85} roupa="oficial" cor="#e8742a" cabelo="#6b3a1f" expressao="confuso" fase={2} />
						{kCarimbo > 0 && (
							<g transform={`rotate(-14) scale(${2 - kCarimbo})`} opacity={Math.min(1, kCarimbo)}>
								<rect x={-260} y={-90} width={520} height={180} rx={20} fill="none" stroke="#e8262f" strokeWidth={22} />
								<text x={0} y={42} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={120} fill="#e8262f">MYTH?</text>
							</g>
						)}
					</g>
				) : (
					<g>
						{ksC.map((k, i) => <g key={i} transform={`translate(${160 + i * 190}, ${760 + (i % 2) * 40}) scale(${k * 0.7})`}><Cenoura s={1} /></g>)}
						<Personagem x={540} y={2000} escala={1} roupa="camponesa" cor="#5a8f6a" cabelo="#4a3326" expressao={morde ? 'feliz' : 'neutro'} falando={morde} bracoD={morde ? 120 : 30} cotoveloD={-60} itemD={morde ? <g transform="scale(0.35) rotate(140)"><Cenoura s={1} feliz={false} /></g> : undefined} fase={3} />
					</g>
				)}
				<Placa x={540} y={300} k={usePop(tGosto, 10)} txt="TASTY & EASY!" tam={90} />
			</Camera>
			<Sfx src="boom" em={tProva} vol={0.45} />
			<Sfx src="pop" em={tCresce} vol={0.35} />
			<Sfx src="ding" em={tGosto} vol={0.35} />
		</>
	);
};

// 5 — as laranjas dominaram o mundo; as roxas ainda existem
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMundo = m('world'), tRoxo = m('purple'), tHoje = m('today');
	const fase2 = f >= tRoxo - 4;
	const kG = usePop(tMundo - 6, 11), kOW = usePop(tMundo, 10);
	return (
		<>
			<Camera de={[540, 950, 1.15]} para={[540, 950, 1.05]} dur={dur} soco={tHoje}>
				<Fundo cor={fase2 ? '#e7d4f0' : '#ffe0b0'} />
				{!fase2 ? (
					<g transform="translate(540, 850)">
						<g transform={`scale(${kG})`}><Globo s={1.2} /></g>
						{Array.from({length: 8}).map((_, i) => {
							const a = (i / 8) * Math.PI * 2 + f / 30;
							return f >= tMundo ? <g key={i} transform={`translate(${Math.cos(a) * 420}, ${Math.sin(a) * 420}) rotate(${(a * 180) / Math.PI + 90}) scale(0.35)`}><Cenoura s={1} /></g> : null;
						})}
					</g>
				) : (
					<g>
						<rect x={140} y={900} width={800} height={60} fill="#a8794a" stroke={CONTORNO} strokeWidth={8} />
						<path d="M120 640 L540 520 L960 640Z" fill="#e8392f" stroke={CONTORNO} strokeWidth={8} />
						{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${240 + i * 150}, 830) rotate(${(i - 2) * 6}) scale(0.5)`}><Cenoura cor={i % 2 ? ROXO : '#9b3fb0'} s={1} /></g>)}
						<Personagem x={540} y={1980} escala={0.95} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao="feliz" olhar={-1} bracoD={150} cotoveloD={-20} fase={4} />
					</g>
				)}
				{!fase2 && <Placa x={540} y={1650} k={kOW} txt="ORANGE WON!" tam={110} />}
				<Placa x={540} y={300} k={usePop(tHoje, 9)} txt="STILL AROUND!" tam={110} cor="#c98ae0" />
			</Camera>
			<Sfx src="pop" em={tMundo} vol={0.4} />
			<Sfx src="whoosh" em={tRoxo - 4} vol={0.35} />
			<Sfx src="ding" em={tHoje} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'CarrotsOrange',
	pastaVoz: 'voz-carrots-orange',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['purple', 'yellow', '1600s', 'dutch', 'orange', 'tribute', 'william', 'hero', 'proof', 'grew', 'tasted', 'world', 'today']),
};
export default ep;
