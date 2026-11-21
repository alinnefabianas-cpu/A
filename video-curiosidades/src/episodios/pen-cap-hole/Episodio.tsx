// Episódio (EN): o furo na tampa da caneta.
// Fontes: BIC (FAQ oficial), normas de segurança ISO 11540, Mental Floss, Snopes.
// O furo existe para reduzir o risco de asfixia se a tampa for engolida, deixando passar um pouco de ar.
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
	'That little hole in your pen cap could save a life.',
	'Lots of people chew on pen caps. Especially kids.',
	'And sometimes, a cap gets swallowed by accident.',
	'If it gets stuck in the throat, the hole can let a little air pass through.',
	"That's why many pen makers put a hole in the cap on purpose.",
	'So next time you see that hole, remember: it was put there for safety.',
];

const AZUL_T = '#2f5bd3';

// tampa de caneta vertical (ponta para cima), furo no topo
export const Tampa: React.FC<{s?: number; brilho?: number; cor?: string}> = ({s = 1, brilho = 0, cor = AZUL_T}) => (
	<g transform={`scale(${s})`}>
		<path d="M-60 0 V-300 Q-60 -360 0 -360 Q60 -360 60 -300 V0Z" fill={cor} stroke={CONTORNO} strokeWidth={10} />
		<rect x={50} y={-300} width={40} height={230} rx={14} fill={cor} stroke={CONTORNO} strokeWidth={8} />
		{brilho > 0 && <circle cy={-300} r={60 + brilho * 20} fill="none" stroke="#ffd23f" strokeWidth={14} opacity={brilho} />}
		<ellipse cy={-300} rx={18} ry={22} fill="#0d1440" stroke={CONTORNO} strokeWidth={5} />
		<rect x={-40} y={-260} width={14} height={220} rx={7} fill="rgba(255,255,255,0.35)" />
	</g>
);

export const Caneta: React.FC<{s?: number; comTampa?: boolean}> = ({s = 1, comTampa = true}) => (
	<g transform={`scale(${s})`}>
		<path d="M-40 0 H40 V600 L0 680 L-40 600Z" fill="#f2f6fa" stroke={CONTORNO} strokeWidth={8} />
		<path d="M-12 600 L0 680 L12 600Z" fill={CONTORNO} />
		{comTampa && <g transform="translate(0, 260) scale(0.8)"><Tampa /></g>}
	</g>
);

// garganta em corte: tubo de ar vertical
const Garganta: React.FC<{ar: number; tampaY: number}> = ({ar, tampaY}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<path d="M300 200 Q300 120 400 100 L700 100 Q780 120 780 220 L780 1700 L300 1700Z" fill="#f2b8a0" stroke={CONTORNO} strokeWidth={10} />
			<rect x={440} y={200} width={200} height={1500} rx={30} fill="#c8604a" stroke={CONTORNO} strokeWidth={8} />
			<g transform={`translate(540, ${tampaY}) rotate(180) scale(0.9)`}><Tampa /></g>
			{ar > 0 && [0, 1, 2, 3].map((i) => {
				const t = ((f + i * 10) % 40) / 40;
				return <path key={i} d={`M540 ${tampaY - 420 + t * 900} l-30 -40 m30 40 l30 -40`} stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" opacity={Math.sin(t * Math.PI) * ar} />;
			})}
		</g>
	);
};

// 0 — gancho: o furo pode salvar uma vida
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFuro = m('hole'), tVida = m('life');
	const b = f >= tFuro ? 0.6 + 0.4 * Math.sin(f / 4) : 0;
	const kV = usePop(tVida, 9);
	return (
		<>
			<Camera de={[540, 1000, 1.0]} para={[540, 700, 1.4]} dur={dur} soco={tVida}>
				<Fundo cor="#cfe3f2" />
				<g transform="translate(540, 1300) rotate(-8)"><Tampa s={2.2} brilho={b} /></g>
				{kV > 0 && <g transform={`translate(820, 420) scale(${kV})`}><path d="M0 60 C-140 -40 -80 -150 0 -80 C80 -150 140 -40 0 60Z" fill="#e8262f" stroke={CONTORNO} strokeWidth={8} /></g>}
				<Placa x={540} y={1650} k={usePop(tVida + 4, 9)} txt="IT COULD SAVE A LIFE" tam={70} />
			</Camera>
			<Sfx src="ding" em={tFuro} vol={0.35} />
			<Sfx src="boom" em={tVida} vol={0.4} />
		</>
	);
};

// 1 — muita gente morde tampas; principalmente crianças
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMorde = m('chew'), tCrian = m('kids');
	const morde = f >= tMorde ? Math.sin(f / 2) * 6 : 0;
	const kK = usePop(tCrian - 4, 11);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1100, 1.05]} dur={dur}>
				<Fundo cor="#f2e3c0" />
				<rect x={0} y={1500} width={W} height={420} fill="#a8794a" />
				<Personagem x={330} y={2060} escala={1.0} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao="confuso" falando={f >= tMorde} olhar={1} bracoD={150} cotoveloD={-120} itemD={<g transform={`rotate(${170 + morde}) scale(0.35)`}><Caneta /></g>} fase={1} />
				{f >= tCrian - 4 && <Personagem x={790} y={1960} escala={0.7 * kK} roupa="passageiro" cor="#e8392f" cabelo="#c9762e" expressao="feliz" falando olhar={-1} bracoE={150} cotoveloE={-120} itemE={<g transform={`rotate(${-170 - morde}) scale(0.35)`}><Caneta /></g>} fase={2} />}
				<Placa x={540} y={300} k={usePop(tMorde, 10)} txt="CHOMP CHOMP" tam={100} />
				<Placa x={760} y={1150} k={usePop(tCrian, 10)} txt="KIDS!" tam={90} cor="#fff" rot={5} />
			</Camera>
			<Sfx src="pop" em={tMorde} vol={0.35} />
			<Sfx src="pop" em={tCrian} vol={0.35} />
		</>
	);
};

// 2 — às vezes a tampa é engolida sem querer
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEng = m('swallowed'), tAcid = m('accident');
	const voa = interpolate(f, [tEng - 8, tEng + 2], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const engoliu = f >= tEng + 2;
	return (
		<>
			<Camera de={[540, 1000, 1.25]} para={[540, 1000, 1.1]} dur={dur} soco={tEng + 2} tremor={engoliu && f < tEng + 14 ? 5 : 0}>
				<Fundo cor="#f2d0c0" />
				<Personagem x={540} y={1800} escala={1.3} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao={engoliu ? 'assustado' : 'feliz'} falando={!engoliu} enjoo={engoliu ? 0.3 : 0} bracoD={engoliu ? 150 : 30} bracoE={engoliu ? 150 : 30} cotoveloD={-40} cotoveloE={-40} fase={3} />
				{!engoliu && <g transform={`translate(${800 - voa * 260}, ${600 + voa * 400}) rotate(${voa * 300}) scale(${0.6 - voa * 0.3})`}><Tampa /></g>}
				<Placa x={540} y={300} k={usePop(tEng + 2, 9)} txt="GULP!" tam={140} cor="#e8262f" corTxt="#fff" />
				<Placa x={540} y={1650} k={usePop(tAcid, 10)} txt="BY ACCIDENT" tam={90} />
			</Camera>
			<Sfx src="whoosh" em={tEng - 8} vol={0.35} />
			<Sfx src="uhoh" em={tEng + 2} vol={0.45} />
		</>
	);
};

// 3 — presa na garganta, o furo deixa passar um pouco de ar
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPresa = m('stuck'), tAr = m('air');
	const desce = interpolate(f, [0, tPresa], [500, 900], {...clamp, easing: Easing.out(Easing.cubic)});
	const ar = interpolate(f, [tAr - 4, tAr + 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.1]} para={[540, 900, 1.0]} dur={dur} soco={tAr}>
				<Fundo cor="#e9e2d0" />
				<Garganta ar={ar} tampaY={desce} />
				<Placa x={540} y={260} k={usePop(tPresa, 10)} txt="STUCK!" tam={110} cor="#e8262f" corTxt="#fff" />
				<Placa x={540} y={1650} k={usePop(tAr, 9)} txt="AIR GETS THROUGH" tam={80} cor="#5aff7a" />
			</Camera>
			<Sfx src="uhoh" em={tPresa} vol={0.35} />
			<Sfx src="whoosh" em={tAr} vol={0.4} />
		</>
	);
};

// 4 — fabricantes fazem o furo de propósito
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFab = m('makers'), tFuro = m('hole'), tProp = m('purpose');
	const desl = (f * 6) % 220;
	const fura = f >= tFuro && (f % 14) < 5;
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur} soco={tProp}>
				<Fundo cor="#cfd5df" />
				<rect x={0} y={1180} width={W} height={60} fill="#3a3f4a" stroke={CONTORNO} strokeWidth={8} />
				{Array.from({length: 7}).map((_, i) => <g key={i} transform={`translate(${-100 + i * 220 + desl}, 1180)`}><Tampa s={0.55} cor={['#2f5bd3', '#e8392f', '#3c8a4a', '#2a2a2a'][i % 4]} /></g>)}
				<g transform={`translate(540, ${fura ? 780 : 680})`}>
					<rect x={-120} y={-500} width={240} height={420} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={9} />
					<rect x={-20} y={-80} width={40} height={90} fill="#5d6470" stroke={CONTORNO} strokeWidth={6} />
				</g>
				{fura && <circle cx={540} cy={1000} r={60} fill="#fff6c0" opacity={0.7} />}
				<Personagem x={180} y={2000} escala={0.8} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao="feliz" olhar={1} bracoD={f >= tFab ? 150 : 30} cotoveloD={-20} fase={4} />
				<Placa x={720} y={1650} k={usePop(tProp, 9)} txt="ON PURPOSE!" tam={100} />
			</Camera>
			<Sfx src="pop" em={tFab} vol={0.3} />
			{[0, 14, 28].map((d) => <Sfx key={d} src="pop" em={tFuro + d} vol={0.25} />)}
			<Sfx src="ding" em={tProp} vol={0.4} />
		</>
	);
};

// 5 — da próxima vez que vir o furo: segurança
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFuro = m('hole'), tSeg = m('safety');
	const kS = usePop(tSeg, 9);
	return (
		<>
			<Camera de={[540, 1000, 1.25]} para={[540, 950, 1.05]} dur={dur} soco={tSeg}>
				<Fundo cor="#d8f0d0" />
				<g transform="translate(540, 1250)"><Tampa s={1.8} brilho={f >= tFuro ? 0.7 + 0.3 * Math.sin(f / 4) : 0} /></g>
				{kS > 0 && (
					<g transform={`translate(830, 520) scale(${kS})`}>
						<path d="M0 -130 L110 -90 V10 Q110 100 0 150 Q-110 100 -110 10 V-90Z" fill="#3fbf5a" stroke={CONTORNO} strokeWidth={9} />
						<path d="M-45 10 l30 34 l60 -70" stroke="#fff" strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					</g>
				)}
				<Placa x={540} y={1650} k={usePop(tSeg + 4, 9)} txt="A SAFETY HOLE" tam={100} />
			</Camera>
			<Sfx src="ding" em={tFuro} vol={0.3} />
			<Sfx src="ding" em={tSeg} vol={0.45} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'PenCapHole',
	pastaVoz: 'voz-pen-cap-hole',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['hole', 'life', 'chew', 'kids', 'swallowed', 'accident', 'stuck', 'air', 'makers', 'purpose', 'safety']),
};
export default ep;
