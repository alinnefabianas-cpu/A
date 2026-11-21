// Episódio (EN): dedos enrugam na água por causa do sistema nervoso.
// Fontes: Scientific American, BBC Future, Changizi et al. (2011), Kareklas et al. (Biology Letters, 2013), NHS.
// Vasoconstrição comandada pelo sistema nervoso simpático; dedos com nervo lesionado não enrugam (observado desde os
// anos 1930); hipótese: melhora a pegada em objetos molhados (evidência mista — tratado como "scientists think").
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
	"Your fingers don't wrinkle in water because they soak it up.",
	"It's actually your nervous system doing it on purpose.",
	'When your hands stay wet, your nerves tell tiny blood vessels under the skin to shrink.',
	'The skin above them pulls in, and makes those wrinkles.',
	"Doctors noticed that if the nerve to a finger is damaged, that finger doesn't wrinkle at all.",
	'Scientists think the wrinkles might help us grip wet things. Like tire treads for your fingers!',
];

const PELE = '#f2c9a0', PELE_E = '#e0a880';

// mão aberta (palma para a frente); rugas 0..1 por dedo; liso = índice do dedo sem rugas
export const Mao: React.FC<{rugas?: number; liso?: number; s?: number}> = ({rugas = 0, liso = -1, s = 1}) => {
	const dedos = [[-150, -330, -14], [-55, -400, -4], [45, -410, 4], [140, -360, 12]];
	return (
		<g transform={`scale(${s})`}>
			<path d="M-200 -60 Q-260 -160 -300 -230 Q-320 -270 -280 -290 Q-240 -300 -210 -240 L-170 -170Z" fill={PELE} stroke={CONTORNO} strokeWidth={9} />
			{dedos.map(([x, y, a], i) => (
				<g key={i} transform={`rotate(${a} ${x} -100)`}>
					<rect x={x - 42} y={y} width={84} height={-y - 60} rx={42} fill={PELE} stroke={CONTORNO} strokeWidth={9} />
					{i === liso && <rect x={x - 44} y={y + 120} width={88} height={34} fill="#fff" stroke={CONTORNO} strokeWidth={5} />}
					{rugas > 0 && i !== liso && [0, 1, 2, 3].map((k) => <path key={k} d={`M${x - 26} ${y + 30 + k * 22} q 13 ${-8 * rugas} 26 0 q 13 ${8 * rugas} 26 0`} stroke={PELE_E} strokeWidth={5} fill="none" opacity={rugas} />)}
				</g>
			))}
			<path d="M-210 -120 Q-220 120 -120 200 L120 200 Q210 120 200 -120Z" fill={PELE} stroke={CONTORNO} strokeWidth={9} />
			<path d="M-120 200 L-110 360 H110 L120 200" fill={PELE} stroke={CONTORNO} strokeWidth={9} />
		</g>
	);
};

const Banheira: React.FC<{children?: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#cfe9f2" />
			{Array.from({length: 6}).map((_, i) => <rect key={i} x={0} y={i * 200} width={W} height={4} fill="#b8d8e3" />)}
			{children}
			<path d="M60 1350 H1020 Q1000 1800 800 1820 H280 Q80 1800 60 1350Z" fill="#fbfbf6" stroke={CONTORNO} strokeWidth={10} />
			<path d={`M80 1380 Q300 ${1360 + Math.sin(f / 8) * 10} 540 1380 T1000 1380`} stroke="#5ab8e8" strokeWidth={14} fill="none" />
			{Array.from({length: 8}).map((_, i) => <circle key={i} cx={150 + i * 110} cy={1340 - ((f * 2 + i * 40) % 120)} r={16 + (i % 3) * 8} fill="#fff" stroke="#b8d8e3" strokeWidth={3} opacity={0.9} />)}
		</g>
	);
};

// corte da pele: camada de cima + vasos sanguíneos; aperta 0..1 encolhe os vasos e ondula a pele
const Corte: React.FC<{aperta: number; onda: number}> = ({aperta, onda}) => {
	const pts = Array.from({length: 61}).map((_, i) => `${i * 18} ${560 + Math.sin(i * 0.55) * 55 * onda}`).join(' L');
	return (
		<g>
			<rect width={W} height={H} fill="#f6e0cc" />
			<path d={`M0 0 H1080 V560 L${pts.split(' L').reverse().join(' L')} Z`} fill="#cfe9f2" />
			<path d={`M0 560 L${pts} L1080 560 V900 H0Z`} fill={PELE} stroke={CONTORNO} strokeWidth={8} />
			<rect y={900} width={W} height={1020} fill="#f2b8a0" />
			{[1100, 1400, 1700].map((y, i) => <path key={y} d={`M-20 ${y} Q540 ${y - 60 + i * 30} 1100 ${y}`} stroke="#c8303a" strokeWidth={90 - aperta * 55} fill="none" strokeLinecap="round" />)}
		</g>
	);
};

const Cerebro: React.FC = () => (
	<g>
		<path d="M-180 0 Q-200 -140 -60 -160 Q0 -220 80 -160 Q210 -150 190 -10 Q200 90 80 100 Q0 140 -80 100 Q-200 100 -180 0Z" fill="#f4a0b8" stroke={CONTORNO} strokeWidth={9} />
		<path d="M-120 -60 q40 -40 80 0 q40 40 80 0 M-100 30 q40 -30 80 0 q40 30 80 0" stroke={CONTORNO} strokeWidth={6} fill="none" />
	</g>
);

// 0 — gancho: não é porque absorvem água
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEnr = m('wrinkle'), tAbs = m('soak');
	return (
		<>
			<Camera de={[540, 900, 1.3]} para={[540, 950, 1.05]} dur={dur} soco={tAbs}>
				<Banheira>
					<g transform={`translate(540, 1150) rotate(${Math.sin(f / 10) * 4})`}><Mao s={1.3} rugas={f >= tEnr ? 1 : 0} /></g>
				</Banheira>
				<Placa x={540} y={260} k={usePop(tAbs, 9)} txt="NOT SOAKING WATER!" tam={80} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tEnr} vol={0.3} />
			<Sfx src="buzz" em={tAbs} vol={0.35} />
		</>
	);
};

// 1 — é o sistema nervoso, de propósito
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNerv = m('nervous'), tProp = m('purpose');
	const raio = interpolate(f, [tNerv, tNerv + 16], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.1]} para={[540, 900, 1.0]} dur={dur} soco={tProp}>
				<Fundo cor="#e7d4f0" />
				<g transform={`translate(540, 420) scale(${usePop(tNerv - 6, 10)})`}><Cerebro /></g>
				<path d="M540 540 L500 760 L580 900 L520 1100 L560 1240" stroke="#ffd23f" strokeWidth={18} fill="none" strokeLinejoin="round" strokeDasharray={900} strokeDashoffset={900 * (1 - raio)} />
				<g transform="translate(540, 1700) scale(0.9)"><Mao rugas={raio >= 1 ? 1 : 0} /></g>
				<Placa x={540} y={1050} k={usePop(tProp, 9)} txt="ON PURPOSE!" tam={100} />
			</Camera>
			<Sfx src="whoosh" em={tNerv} vol={0.4} />
			<Sfx src="ding" em={tProp} vol={0.4} />
		</>
	);
};

// 2 — nervos mandam os vasinhos sob a pele encolherem
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVasos = m('vessels'), tEnc = m('shrink');
	const aperta = interpolate(f, [tEnc - 4, tEnc + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1100, 1.0]} dur={dur} soco={tEnc}>
				<Corte aperta={aperta} onda={0} />
				<Placa x={540} y={300} k={usePop(tVasos, 10)} txt="BLOOD VESSELS" tam={90} cor="#fff" />
				<Placa x={540} y={1650} k={usePop(tEnc, 9)} txt="SHRINK!" tam={130} />
			</Camera>
			<Sfx src="pop" em={tVasos} vol={0.35} />
			<Sfx src="whoosh" em={tEnc} vol={0.4} />
		</>
	);
};

// 3 — a pele de cima é puxada e forma as rugas
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPuxa = m('pulls'), tRugas = m('wrinkles');
	const onda = interpolate(f, [tPuxa - 4, tRugas + 6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 800, 1.2]} para={[540, 900, 1.05]} dur={dur} soco={tRugas}>
				<Corte aperta={1} onda={onda} />
				<Placa x={540} y={300} k={usePop(tRugas, 9)} txt="WRINKLES!" tam={130} />
			</Camera>
			<Sfx src="whoosh" em={tPuxa} vol={0.35} />
			<Sfx src="ding" em={tRugas} vol={0.4} />
		</>
	);
};

// 4 — dedo com nervo lesionado não enruga
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMed = m('doctors'), tLes = m('damaged'), tNada = m('all');
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[580, 950, 1.12]} dur={dur} soco={tNada}>
				<Fundo cor="#e3eef6" />
				<g transform="translate(620, 1150)"><Mao s={1.2} rugas={1} liso={f >= tLes ? 2 : -1} /></g>
				<Personagem x={250} y={2010} escala={0.85} roupa="medico" cabelo="#4a3326" expressao={f >= tNada ? 'confuso' : 'serio'} olhar={1} bracoD={f >= tMed ? 120 : 30} cotoveloD={-10} fase={1} />
				<Placa x={540} y={300} k={usePop(tLes, 10)} txt="DAMAGED NERVE" tam={90} cor="#fff" />
				<Placa x={680} y={1650} k={usePop(tNada, 9)} txt="NO WRINKLES!" tam={90} />
			</Camera>
			<Sfx src="pop" em={tMed} vol={0.3} />
			<Sfx src="uhoh" em={tLes} vol={0.35} />
			<Sfx src="ding" em={tNada} vol={0.4} />
		</>
	);
};

// 5 — talvez ajudem a segurar coisas molhadas: como pneus
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSeg = m('grip'), tPneu = m('tire');
	const kP = usePop(tPneu, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.0]} dur={dur} soco={tPneu}>
				<Fundo cor="#d8f0d0" />
				<g transform="translate(400, 1250)"><Mao s={1.0} rugas={1} /></g>
				{f >= tSeg && <g transform={`translate(400, 760) rotate(${Math.sin(f / 5) * 5})`}><circle r={120} fill="#5ab8e8" stroke={CONTORNO} strokeWidth={8} opacity={0.9} /><ellipse cx={-40} cy={-50} rx={30} ry={16} fill="#fff" /></g>}
				{kP > 0 && (
					<g transform={`translate(830, 760) scale(${kP}) rotate(${f * 3})`}>
						<circle r={180} fill="#2a2a2a" stroke={CONTORNO} strokeWidth={8} />
						{Array.from({length: 16}).map((_, i) => <rect key={i} x={-14} y={-180} width={28} height={50} fill="#4a4f5a" transform={`rotate(${i * 22.5})`} />)}
						<circle r={80} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={8} />
					</g>
				)}
				<Placa x={540} y={300} k={usePop(tSeg, 10)} txt="BETTER GRIP?" tam={110} />
				<Placa x={540} y={1650} k={usePop(tPneu + 4, 9)} txt="FINGER TIRE TREADS!" tam={76} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tSeg} vol={0.35} />
			<Sfx src="ding" em={tPneu} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'FingersWrinkle',
	pastaVoz: 'voz-fingers-wrinkle',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['wrinkle', 'soak', 'nervous', 'purpose', 'vessels', 'shrink', 'pulls', 'wrinkles', 'doctors', 'damaged', 'grip', 'tire']),
};
export default ep;
