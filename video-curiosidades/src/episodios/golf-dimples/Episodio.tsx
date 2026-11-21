// Episódio (EN): por que bolas de golfe têm covinhas.
// Fontes: Scientific American, NASA Glenn (aerodinâmica), USGA, Smithsonian.
// Bolas lisas (gutta-percha, séc. XIX); jogadores notaram que bolas gastas voavam mais longe; covinhas criam camada
// limite turbulenta que reduz o arrasto; bola com covinhas voa cerca de 2x mais longe que uma lisa.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Fundo, clamp} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'Golf balls have dimples for a surprising reason.',
	'Early golf balls were smooth.',
	'But players noticed something weird: old, beat-up balls flew farther than new ones.',
	"The dents changed the air around the ball, so there's less drag pulling it back.",
	'So ball makers started adding dimples on purpose.',
	'Today, a dimpled ball can fly about twice as far as a smooth one.',
];

// bola: covinhas 0..1 (quantas aparecem), amassada = poucas marcas irregulares
export const Bola: React.FC<{s?: number; covinhas?: number; amassada?: boolean; rot?: number}> = ({s = 1, covinhas = 1, amassada, rot = 0}) => {
	const pts: [number, number][] = [];
	for (let y = -120; y <= 120; y += 40) for (let x = -120; x <= 120; x += 40) if (x * x + y * y < 135 * 135) pts.push([x + ((y / 40) % 2 ? 20 : 0), y]);
	return (
		<g transform={`scale(${s}) rotate(${rot})`}>
			<circle r={160} fill="#fbfbf6" stroke={CONTORNO} strokeWidth={10} />
			{covinhas > 0 && pts.slice(0, Math.floor(pts.length * covinhas)).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={12} fill="#dcdcd2" />)}
			{amassada && [[-60, -40, 26], [50, 30, 20], [-10, 80, 18], [70, -70, 16]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} fill="#cfcfc4" transform={`rotate(${i * 40} ${x} ${y})`} />)}
			<ellipse cx={-60} cy={-70} rx={40} ry={22} fill="#fff" opacity={0.9} transform="rotate(-30 -60 -70)" />
		</g>
	);
};

const Taco: React.FC = () => (
	<g>
		<rect x={-6} y={0} width={12} height={300} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={4} />
		<path d="M-10 290 h60 q20 0 20 20 v20 h-80Z" fill="#5d6470" stroke={CONTORNO} strokeWidth={5} />
		<rect x={-12} y={-10} width={24} height={80} rx={8} fill="#2a2a2a" />
	</g>
);

const Campo: React.FC<{children?: React.ReactNode; sepia?: boolean}> = ({children, sepia}) => (
	<g>
		<rect width={W} height={H} fill={sepia ? '#e9d8b0' : '#bfe3ff'} />
		<path d="M0 1200 Q300 1100 600 1180 T1080 1150 V1920 H0Z" fill={sepia ? '#b8a77a' : '#7fb35a'} />
		<path d="M0 1400 Q300 1330 600 1390 T1080 1370 V1920 H0Z" fill={sepia ? '#a8976a' : '#6aa04a'} />
		{children}
	</g>
);

const Bandeira: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x}, ${y})`}>
		<ellipse cx={0} cy={0} rx={50} ry={14} fill="#2a2a2a" />
		<rect x={-5} y={-260} width={10} height={260} fill="#f2f6fa" stroke={CONTORNO} strokeWidth={3} />
		<path d="M5 -260 L120 -225 L5 -190Z" fill="#e8262f" stroke={CONTORNO} strokeWidth={5} />
	</g>
);

// trajetória: posição da bola ao longo de um arco até xFim
const arco = (t: number, x0: number, xFim: number, alt: number, y0: number) => [x0 + (xFim - x0) * t, y0 - Math.sin(t * Math.PI) * alt] as const;

// 0 — gancho: covinhas por um motivo surpreendente
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCov = m('dimples'), tSurp = m('surprising');
	const cov = interpolate(f, [tCov - 4, tCov + 12], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.3]} para={[540, 900, 1.05]} dur={dur} soco={tSurp}>
				<Fundo cor="#d8f0d0" />
				<g transform="translate(540, 900)"><Bola s={2.4} covinhas={cov} rot={f * 2} /></g>
				<Placa x={540} y={1650} k={usePop(tSurp, 9)} txt="BUT WHY?!" tam={130} />
			</Camera>
			<Sfx src="pop" em={tCov} vol={0.35} />
			<Sfx src="boom" em={tSurp} vol={0.4} />
		</>
	);
};

// 1 — as primeiras bolas eram lisas
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const tLisa = m('smooth');
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 950, 1.05]} dur={dur} soco={tLisa}>
				<Campo sepia>
					<g transform="translate(540, 900)"><Bola s={1.8} covinhas={0} /></g>
				</Campo>
				<Placa x={540} y={300} k={usePop(4, 10)} txt="1800s" tam={120} />
				<Placa x={540} y={1650} k={usePop(tLisa, 9)} txt="SMOOTH" tam={130} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={4} vol={0.35} />
			<Sfx src="ding" em={tLisa} vol={0.35} />
		</>
	);
};

// 2 — bolas velhas e amassadas voavam mais longe que as novas
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEstranho = m('weird'), tLonge = m('farther');
	const t = interpolate(f, [tLonge - 14, tLonge + 14], [0, 1], clamp);
	const [xn, yn] = arco(Math.min(1, t * 1.6), 160, 560, 360, 1350);
	const [xv, yv] = arco(t, 160, 960, 620, 1350);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tLonge + 14}>
				<Campo sepia>
					<Personagem x={160} y={1900} escala={0.75} roupa="executivo" cor="#6b4a36" cabelo="#2d1f17" expressao={f >= tLonge + 14 ? 'assustado' : 'neutro'} olhar={1} fase={1} />
					<g transform={`translate(${xn}, ${yn})`}><Bola s={0.32} covinhas={0} /></g>
					<g transform={`translate(${xv}, ${yv})`}><Bola s={0.32} covinhas={0} amassada /></g>
					{t >= 1 && <g><text x={560} y={1450} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#fff" stroke={CONTORNO} strokeWidth={8} paintOrder="stroke">NEW</text><text x={960} y={1450} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#ffd23f" stroke={CONTORNO} strokeWidth={8} paintOrder="stroke">OLD</text></g>}
				</Campo>
				<Placa x={540} y={300} k={usePop(tEstranho, 10)} txt="WEIRD..." tam={110} />
				<Placa x={540} y={480} k={usePop(tLonge + 14, 9)} txt="OLD BALLS WIN?!" tam={80} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="uhoh" em={tEstranho} vol={0.3} />
			<Sfx src="whoosh" em={tLonge - 14} vol={0.4} />
			<Sfx src="ding" em={tLonge + 14} vol={0.4} />
		</>
	);
};

// 3 — as marcas mudam o ar em volta: menos arrasto
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAr = m('air'), tArr = m('drag');
	const lisa = f < tArr - 4;
	const esteira = lisa ? 1 : interpolate(f, [tArr - 4, tArr + 8], [1, 0.35], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.1]} para={[540, 900, 1.0]} dur={dur} soco={tArr}>
				<Fundo cor="#cfe3f2" />
				{Array.from({length: 9}).map((_, i) => {
					const y = 600 + i * 75;
					const desvio = Math.max(0, 1 - Math.abs(y - 900) / 320);
					const x0 = ((f * 14 + i * 60) % 300) - 300;
					return <path key={i} d={`M${x0} ${y} L300 ${y} Q540 ${y + (y < 900 ? -1 : 1) * desvio * 220} 780 ${y + (y < 900 ? -1 : 1) * desvio * 220 * esteira * 0.5} L1300 ${y + (y < 900 ? -1 : 1) * desvio * 200 * esteira}`} stroke="#fff" strokeWidth={9} fill="none" opacity={0.85} strokeDasharray="60 30" strokeDashoffset={-f * 10} />;
				})}
				{f >= tAr && <ellipse cx={800 + 260 * esteira} cy={900} rx={300 * esteira + 40} ry={220 * esteira + 20} fill="#9aa1ad" opacity={0.35} />}
				<g transform="translate(540, 900)"><Bola s={1.3} covinhas={lisa ? 0 : 1} /></g>
				<Placa x={540} y={300} k={usePop(tAr, 10)} txt="AIR" tam={120} cor="#fff" />
				<Placa x={540} y={1650} k={usePop(tArr, 9)} txt="LESS DRAG!" tam={120} />
			</Camera>
			<Sfx src="whoosh" em={tAr} vol={0.35} />
			<Sfx src="ding" em={tArr} vol={0.4} />
		</>
	);
};

// 4 — fabricantes passaram a fazer covinhas de propósito
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCov = m('dimples'), tProp = m('purpose');
	const prensa = f >= tCov && (f % 16) < 6;
	const cov = interpolate(f, [tCov, tCov + 30], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur} soco={tProp}>
				<Fundo cor="#cfd5df" />
				<g transform={`translate(540, ${prensa ? 600 : 480})`}>
					<rect x={-200} y={-500} width={400} height={320} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={9} />
					<path d="M-160 -180 h320 v60 q-160 80 -320 0Z" fill="#5d6470" stroke={CONTORNO} strokeWidth={8} />
				</g>
				<g transform="translate(540, 1000)"><Bola s={1.3} covinhas={cov} /></g>
				{prensa && <circle cx={540} cy={820} r={90} fill="#fff6c0" opacity={0.5} />}
				<Placa x={540} y={1650} k={usePop(tProp, 9)} txt="ON PURPOSE" tam={110} />
			</Camera>
			{[0, 16, 32].map((d) => <Sfx key={d} src="boom" em={tCov + d} vol={0.25} />)}
			<Sfx src="ding" em={tProp} vol={0.4} />
		</>
	);
};

// 5 — hoje: cerca de 2x mais longe que uma bola lisa
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDobro = m('twice');
	const t = interpolate(f, [8, tDobro + 6], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const [xl, yl] = arco(Math.min(1, t * 2), 120, 520, 260, 1420);
	const [xc, yc] = arco(t, 120, 940, 560, 1420);
	return (
		<>
			<Camera de={[540, 1100, 1.05]} para={[540, 1050, 1.0]} dur={dur} soco={tDobro + 6}>
				<Campo>
					<Bandeira x={940} y={1440} />
					<g transform={`translate(${xl}, ${yl})`}><Bola s={0.3} covinhas={0} /></g>
					<g transform={`translate(${xc}, ${yc})`}><Bola s={0.3} covinhas={1} /></g>
					<Personagem x={140} y={1960} escala={0.7} roupa="executivo" cor="#3c8a4a" cabelo="#c9a227" expressao="feliz" olhar={1} bracoD={150} cotoveloD={-20} itemD={<g transform="rotate(160) scale(0.6)"><Taco /></g>} fase={2} />
					{t >= 0.5 && <text x={520} y={1520} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={48} fill="#fff" stroke={CONTORNO} strokeWidth={8} paintOrder="stroke">SMOOTH</text>}
					{t >= 1 && <text x={900} y={1540} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={48} fill="#ffd23f" stroke={CONTORNO} strokeWidth={8} paintOrder="stroke">DIMPLED</text>}
				</Campo>
				<Placa x={540} y={300} k={usePop(tDobro, 9)} txt="ABOUT 2X FARTHER" tam={74} />
			</Camera>
			<Sfx src="whoosh" em={8} vol={0.4} />
			<Sfx src="boom" em={tDobro + 6} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'GolfDimples',
	pastaVoz: 'voz-golf-dimples',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['dimples', 'surprising', 'smooth', 'weird', 'farther', 'air', 'drag', 'purpose', 'twice']),
};
export default ep;
