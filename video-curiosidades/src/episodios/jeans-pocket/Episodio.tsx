// Episódio (EN): o bolsinho do jeans era para relógio de bolso.
// Fontes: Levi Strauss & Co. (blog oficial "Unzipped"), Smithsonian, Britannica.
// Bolso pequeno ("watch pocket") presente desde os primeiros jeans de trabalho do séc. XIX; hoje usado para moedas etc.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Fundo, Xis, clamp} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'That tiny pocket on your jeans has a secret job.',
	'It goes back to the 1800s, when workers wore jeans every day.',
	'Back then, many men carried pocket watches, not phones.',
	'And a watch could easily break or get lost in a big pocket.',
	'So jeans got a little pocket, just the right size for a watch.',
	"Today, people use it for coins, keys or guitar picks. But it's still called the watch pocket.",
];

const AZUL_J = '#3d64a8', COSTURA = '#e8a23a';

// frente do jeans (cintura + bolsos), origem no centro da cintura
export const Jeans: React.FC<{destaque?: number}> = ({destaque = 0}) => (
	<g>
		<path d="M-420 0 H420 L460 900 H60 L0 300 L-60 900 H-460Z" fill={AZUL_J} stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
		<rect x={-430} y={-10} width={860} height={90} fill="#355a98" stroke={CONTORNO} strokeWidth={9} />
		{[-330, -110, 110, 330].map((x) => <rect key={x} x={x - 18} y={-20} width={36} height={110} rx={6} fill="#355a98" stroke={CONTORNO} strokeWidth={6} />)}
		<circle cx={0} cy={35} r={22} fill="#c9a227" stroke={CONTORNO} strokeWidth={6} />
		<path d="M0 80 V300" stroke={COSTURA} strokeWidth={6} strokeDasharray="14 10" />
		{/* bolsos grandes */}
		<path d="M-420 80 Q-260 110 -200 300" stroke={CONTORNO} strokeWidth={8} fill="none" />
		<path d="M420 80 Q260 110 200 300" stroke={CONTORNO} strokeWidth={8} fill="none" />
		<path d="M-410 92 Q-262 120 -212 300" stroke={COSTURA} strokeWidth={5} strokeDasharray="12 9" fill="none" />
		<path d="M410 92 Q262 120 212 300" stroke={COSTURA} strokeWidth={5} strokeDasharray="12 9" fill="none" />
		{/* bolsinho do relógio */}
		{destaque > 0 && <rect x={190} y={95} width={180} height={150} rx={20} fill="#ffd23f" opacity={0.35 + 0.25 * destaque} />}
		<rect x={210} y={110} width={140} height={120} fill="#355a98" stroke={CONTORNO} strokeWidth={8} />
		<path d="M218 124 H342" stroke={COSTURA} strokeWidth={5} strokeDasharray="12 9" />
		{[218, 342].map((x) => <circle key={x} cx={x} cy={118} r={9} fill="#c9a227" stroke={CONTORNO} strokeWidth={4} />)}
	</g>
);

export const RelogioBolso: React.FC<{s?: number; quebrado?: boolean}> = ({s = 1, quebrado}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<rect x={-20} y={-150} width={40} height={36} rx={8} fill="#c9a227" stroke={CONTORNO} strokeWidth={6} />
			<circle cy={-160} r={20} fill="none" stroke="#c9a227" strokeWidth={9} />
			<circle r={120} fill="#e3b93a" stroke={CONTORNO} strokeWidth={10} />
			<circle r={95} fill="#fffbe9" stroke={CONTORNO} strokeWidth={5} />
			{Array.from({length: 12}).map((_, i) => <rect key={i} x={-3} y={-88} width={6} height={14} fill={CONTORNO} transform={`rotate(${i * 30})`} />)}
			<line x1={0} y1={0} x2={0} y2={-60} stroke={CONTORNO} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 6})`} />
			<line x1={0} y1={0} x2={42} y2={0} stroke={CONTORNO} strokeWidth={8} strokeLinecap="round" />
			{quebrado && <path d="M-60 -70 L-10 -10 L-40 30 L20 80 M-10 -10 L50 -40" stroke={CONTORNO} strokeWidth={7} fill="none" />}
		</g>
	);
};

const Celular: React.FC = () => (
	<g>
		<rect x={-80} y={-150} width={160} height={300} rx={26} fill="#2a2e38" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-64} y={-120} width={128} height={230} rx={10} fill="#5ab8e8" />
	</g>
);

const Oeste: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#f2c88a" />
		<path d="M0 1000 L220 760 L420 960 L640 700 L860 940 L1080 780 V1300 H0Z" fill="#c98a5a" />
		<rect y={1300} width={W} height={620} fill="#d9a46a" />
		{children}
	</g>
);

// 0 — gancho: o bolsinho tem uma função secreta
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPeq = m('tiny'), tSec = m('secret');
	const d = f >= tPeq ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
	return (
		<>
			<Camera de={[540, 900, 1.0]} para={[820, 700, 1.9]} dur={dur} soco={tSec}>
				<Fundo cor="#cfe3f2" />
				<g transform="translate(540, 560)"><Jeans destaque={d} /></g>
				<Placa x={790} y={470} k={usePop(tSec, 9)} txt="SECRET JOB?!" tam={78} />
			</Camera>
			<Sfx src="ding" em={tPeq} vol={0.35} />
			<Sfx src="boom" em={tSec} vol={0.4} />
		</>
	);
};

// 1 — anos 1800: trabalhadores usavam jeans todo dia
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1800s'), tTrab = m('workers');
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1150, 1.0]} dur={dur}>
				<Oeste>
					{[200, 540, 880].map((x, i) => {
						const k = usePop(tTrab + i * 4, 11);
						return k > 0 ? <Personagem key={x} x={x} y={2060} escala={0.85 * k} roupa="fazendeiro" cor={['#5a8f6a', '#b8577a', '#c9762e'][i]} cabelo={['#4a3326', '#1d1d1d', '#c9a227'][i]} expressao="feliz" bracoD={60 + Math.sin(f / 5 + i) * 30} cotoveloD={-30} fase={i} /> : null;
					})}
				</Oeste>
				<Placa x={540} y={300} k={usePop(tAno, 10)} txt="1800s" tam={140} />
				<Placa x={540} y={490} k={usePop(tTrab + 6, 10)} txt="WORK JEANS" tam={80} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			{[0, 4, 8].map((d) => <Sfx key={d} src="pop" em={tTrab + d} vol={0.3} />)}
		</>
	);
};

// 2 — relógios de bolso, não celulares
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRel = m('watches'), tCel = m('phones');
	const kR = usePop(tRel - 4, 10), kC = usePop(tCel, 10);
	return (
		<>
			<Camera de={[540, 900, 1.15]} para={[540, 900, 1.05]} dur={dur} soco={tCel}>
				<Fundo cor="#f2d9a8" />
				<path d={`M540 100 L${540 + Math.sin(f / 10) * 160} ${600}`} stroke="#c9a227" strokeWidth={10} strokeDasharray="20 10" opacity={kR > 0 ? 1 : 0} />
				<g transform={`translate(${540 + Math.sin(f / 10) * 160}, 760) rotate(${-Math.sin(f / 10) * 14}) scale(${kR * 1.4})`}><RelogioBolso /></g>
				{kC > 0 && <g transform={`translate(830, 1580) scale(${kC})`}><Celular /><Xis s={0.9} /></g>}
				<Placa x={400} y={1600} k={usePop(tRel, 10)} txt="POCKET WATCH" tam={70} />
			</Camera>
			<Sfx src="ding" em={tRel} vol={0.35} />
			<Sfx src="buzz" em={tCel} vol={0.3} />
		</>
	);
};

// 3 — o relógio quebrava ou se perdia no bolso grande
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tQuebra = m('break'), tPerde = m('lost');
	const cai = interpolate(f, [tPerde - 4, tPerde + 12], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 1100, 1.05]} dur={dur} soco={tQuebra} tremor={f >= tQuebra && f < tQuebra + 8 ? 6 : 0}>
				<Fundo cor="#cfe3f2" />
				<g transform="translate(540, 700) scale(1.15)"><Jeans /></g>
				<g transform={`translate(${300 - cai * 40}, ${600 + cai * 420}) scale(${0.8 - cai * 0.4})`} opacity={1 - cai * 0.9}><RelogioBolso quebrado={f >= tQuebra} /></g>
				<Placa x={540} y={300} k={usePop(tQuebra, 9)} txt="CRACK!" tam={120} cor="#e8262f" corTxt="#fff" />
				<Placa x={540} y={1650} k={usePop(tPerde + 8, 10)} txt="LOST!" tam={120} />
			</Camera>
			<Sfx src="boom" em={tQuebra} vol={0.4} />
			<Sfx src="whoosh" em={tPerde - 4} vol={0.35} />
		</>
	);
};

// 4 — um bolsinho do tamanho certo para o relógio
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPeq = m('little'), tRel = m('watch');
	const entra = interpolate(f, [tRel - 10, tRel + 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 800, 1.2]} para={[820, 700, 2.0]} dur={dur} soco={tRel + 4}>
				<Fundo cor="#d8f0d0" />
				<g transform="translate(540, 560)"><Jeans destaque={f >= tPeq ? 1 : 0} /></g>
				<g transform={`translate(${820}, ${380 + entra * 270}) scale(0.5)`}><RelogioBolso /></g>
				<g transform="translate(540, 560)"><rect x={210} y={130} width={140} height={100} fill="#355a98" stroke={CONTORNO} strokeWidth={8} /></g>
				<Placa x={820} y={900} k={usePop(tRel + 6, 9)} txt="PERFECT FIT!" tam={50} cor="#5aff7a" />
			</Camera>
			<Sfx src="pop" em={tPeq} vol={0.35} />
			<Sfx src="ding" em={tRel + 4} vol={0.45} />
		</>
	);
};

// 5 — hoje: moedas, chaves, palhetas; mas ainda se chama "watch pocket"
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMoe = m('coins'), tCha = m('keys'), tPal = m('picks'), tRel = m('watch');
	const kM = usePop(tMoe, 10), kC = usePop(tCha, 10), kP = usePop(tPal, 10);
	return (
		<>
			<Camera de={[540, 900, 1.1]} para={[540, 900, 1.0]} dur={dur} soco={tRel}>
				<Fundo cor="#cfe3f2" />
				<g transform="translate(540, 820) scale(0.9)"><Jeans destaque={0.6} /></g>
				{kM > 0 && <g transform={`translate(220, 520) scale(${kM})`}>{[0, 1, 2].map((i) => <circle key={i} cx={i * 30} cy={-i * 20} r={50} fill="#d9b23a" stroke={CONTORNO} strokeWidth={6} />)}</g>}
				{kC > 0 && <g transform={`translate(540, 480) scale(${kC}) rotate(${Math.sin(f / 6) * 10})`}><circle cx={0} cy={-60} r={40} fill="none" stroke="#9aa1ad" strokeWidth={16} /><rect x={-10} y={-24} width={20} height={130} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={4} /><rect x={10} y={60} width={30} height={14} fill="#9aa1ad" /><rect x={10} y={86} width={22} height={14} fill="#9aa1ad" /></g>}
				{kP > 0 && <g transform={`translate(860, 520) scale(${kP}) rotate(12)`}><path d="M-60 -50 Q0 -80 60 -50 Q50 30 0 80 Q-50 30 -60 -50Z" fill="#e8392f" stroke={CONTORNO} strokeWidth={7} /></g>}
				<Placa x={540} y={1650} k={usePop(tRel, 9)} txt="THE WATCH POCKET" tam={80} />
			</Camera>
			<Sfx src="pop" em={tMoe} vol={0.35} />
			<Sfx src="pop" em={tCha} vol={0.35} />
			<Sfx src="pop" em={tPal} vol={0.35} />
			<Sfx src="ding" em={tRel} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'JeansPocket',
	pastaVoz: 'voz-jeans-pocket',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['tiny', 'secret', '1800s', 'workers', 'watches', 'phones', 'break', 'lost', 'little', 'watch', 'coins', 'keys', 'picks']),
};
export default ep;
