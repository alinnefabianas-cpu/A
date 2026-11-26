// Episódio (EN): o mel praticamente nunca estraga.
// Fontes: Smithsonian Magazine ("The Science Behind Honey's Eternal Shelf Life"), National Honey Board, USDA.
// Pouca água (higroscópico), pH ácido (~3,9), glicose oxidase produz peróxido de hidrogênio. Potes em tumbas
// egípcias com mel "ainda comestível" são amplamente relatados (tratado como "reportedly"). Cristalização ≠ estragar.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Fundo, Xis, clamp, mix} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'Honey basically never goes bad.',
	"It has very little water, so germs can't grow in it.",
	"It's also naturally acidic, and bees add an enzyme that makes a tiny bit of hydrogen peroxide.",
	'Archaeologists have reportedly found pots of honey in ancient Egyptian tombs, thousands of years old.',
	'And it was still edible.',
	"So if your honey gets hard and cloudy, don't throw it away. It's just crystallized. Warm it up!",
];

export const MEL = '#f2a91f';

// pote de mel; turvo 0..1 deixa cristalizado
export const PoteMel: React.FC<{s?: number; turvo?: number; feliz?: boolean}> = ({s = 1, turvo = 0, feliz = true}) => {
	const f = useCurrentFrame();
	const cor = mix(MEL, '#f6dca0', turvo);
	return (
		<g transform={`scale(${s})`}>
			<path d="M-170 -260 Q-200 -100 -180 60 Q-170 160 0 170 Q170 160 180 60 Q200 -100 170 -260Z" fill="rgba(255,255,255,0.5)" stroke={CONTORNO} strokeWidth={10} />
			<path d="M-160 -170 Q-185 -60 -168 60 Q-160 150 0 158 Q160 150 168 60 Q185 -60 160 -170Z" fill={cor} />
			{turvo > 0.3 && Array.from({length: 18}).map((_, i) => <circle key={i} cx={-120 + (i * 53) % 240} cy={-120 + (i * 71) % 250} r={8} fill="#fff" opacity={turvo * 0.7} />)}
			<rect x={-190} y={-320} width={380} height={70} rx={14} fill="#c8623a" stroke={CONTORNO} strokeWidth={9} />
			<path d={`M60 -250 Q70 ${-200 + Math.sin(f / 8) * 10} 60 -160`} stroke={cor} strokeWidth={26} strokeLinecap="round" />
			<rect x={-110} y={-80} width={220} height={100} rx={14} fill="#fff6e0" stroke={CONTORNO} strokeWidth={6} />
			<text x={0} y={-12} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#7a4a10">HONEY</text>
			{feliz && (
				<g>
					<circle cx={-50} cy={70} r={11} fill={CONTORNO} />
					<circle cx={50} cy={70} r={11} fill={CONTORNO} />
					<path d="M-30 100 Q0 125 30 100" stroke={CONTORNO} strokeWidth={7} fill="none" strokeLinecap="round" />
				</g>
			)}
		</g>
	);
};

export const Abelha: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	const asa = Math.sin(f * 1.5) * 20;
	return (
		<g transform={`scale(${s})`}>
			<ellipse cx={-10} cy={-60} rx={40} ry={60} fill="rgba(255,255,255,0.8)" stroke={CONTORNO} strokeWidth={5} transform={`rotate(${-30 + asa} -10 -20)`} />
			<ellipse cx={30} cy={-60} rx={40} ry={60} fill="rgba(255,255,255,0.8)" stroke={CONTORNO} strokeWidth={5} transform={`rotate(${30 - asa} 30 -20)`} />
			<ellipse cx={0} cy={0} rx={90} ry={60} fill="#ffd23f" stroke={CONTORNO} strokeWidth={8} />
			{[-30, 10, 50].map((x) => <rect key={x} x={x - 10} y={-56} width={20} height={112} fill={CONTORNO} />)}
			<circle cx={-70} cy={-10} r={10} fill={CONTORNO} />
		</g>
	);
};

const Germe: React.FC<{s?: number; morto?: boolean}> = ({s = 1, morto}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) rotate(${morto ? 180 : Math.sin(f / 4) * 10})`} opacity={morto ? 0.6 : 1}>
			{Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i) * 80} y2={Math.sin(i) * 80} stroke="#4a8a3a" strokeWidth={10} strokeLinecap="round" />)}
			<circle r={55} fill="#7fc05a" stroke={CONTORNO} strokeWidth={7} />
			{morto ? <path d="M-30 -20 l20 20 m0 -20 l-20 20 M10 -20 l20 20 m0 -20 l-20 20" stroke={CONTORNO} strokeWidth={5} /> : <><circle cx={-18} cy={-10} r={8} fill={CONTORNO} /><circle cx={18} cy={-10} r={8} fill={CONTORNO} /></>}
		</g>
	);
};

const Tumba: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#7a5a3a" />
		{Array.from({length: 40}).map((_, i) => <rect key={i} x={(i % 5) * 220 + (Math.floor(i / 5) % 2) * 110 - 60} y={Math.floor(i / 5) * 160} width={210} height={150} fill="#8a6a46" stroke="#5a3e26" strokeWidth={6} />)}
		<g transform="translate(540, 520)" opacity={0.7}>
			<rect x={-300} y={-160} width={600} height={240} fill="#c9a26a" stroke="#5a3e26" strokeWidth={6} />
			{[0, 1, 2, 3].map((i) => (
				<g key={i} transform={`translate(${-220 + i * 150}, -30)`} stroke="#5a3e26" strokeWidth={10} fill="none" strokeLinecap="round">
					{i % 2 === 0 ? <><ellipse cx={0} cy={-30} rx={24} ry={32} /><path d="M0 2 V90 M-40 30 H40" /></> : <><path d="M-50 0 Q0 -50 50 0 Q0 40 -50 0Z" /><circle cx={0} cy={-4} r={10} fill="#5a3e26" /><path d="M-10 26 L-24 70 M20 24 Q40 60 10 70" /></>}
				</g>
			))}
		</g>
		<rect y={1500} width={W} height={420} fill="#c9a26a" />
		{children}
	</g>
);

const Anfora: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-60 -300 h120 v40 q90 60 100 180 q10 140 -120 180 h-80 q-130 -40 -120 -180 q10 -120 100 -180Z" fill="#c8743a" stroke={CONTORNO} strokeWidth={9} />
		<path d="M-130 -80 h260" stroke="#7a3a1a" strokeWidth={10} />
		<path d="M-120 0 h240" stroke="#7a3a1a" strokeWidth={6} strokeDasharray="20 14" />
	</g>
);

// 0 — gancho: mel quase nunca estraga
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNunca = m('never'), tRuim = m('bad');
	const anos = f >= tNunca ? Math.min(3000, Math.floor((f - tNunca) * 120)) : 0;
	return (
		<>
			<Camera de={[540, 900, 1.3]} para={[540, 950, 1.05]} dur={dur} soco={tRuim}>
				<Fundo cor="#ffe8b0" />
				<g transform={`translate(540, 1000) rotate(${Math.sin(f / 8) * 4})`}><PoteMel s={1.5} /></g>
				{f >= tNunca && <text x={540} y={420} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#fff" stroke={CONTORNO} strokeWidth={14} paintOrder="stroke">{anos.toLocaleString('en-US')} YEARS</text>}
				<Placa x={540} y={1650} k={usePop(tRuim, 9)} txt="NEVER SPOILS?!" tam={110} />
			</Camera>
			<Sfx src="whoosh" em={tNunca} vol={0.35} />
			<Sfx src="boom" em={tRuim} vol={0.4} />
		</>
	);
};

// 1 — pouca água: germes não crescem
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAgua = m('water'), tGerm = m('germs'), tCresce = m('grow');
	const kA = usePop(tAgua, 10);
	const morre = f >= tCresce;
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur} soco={tCresce}>
				<Fundo cor="#ffe8b0" />
				<g transform="translate(540, 1100)"><PoteMel s={1.2} /></g>
				{kA > 0 && <g transform={`translate(830, 480) scale(${kA * 0.5})`}><path d="M0 -120 Q90 0 70 60 Q50 130 0 130 Q-50 130 -70 60 Q-90 0 0 -120Z" fill="#5ab8e8" stroke={CONTORNO} strokeWidth={8} /></g>}
				{f >= tGerm && [[230, 700], [850, 900], [260, 1500]].map(([x, y], i) => <g key={i} transform={`translate(${x + (morre ? 0 : Math.sin(f / 5 + i) * 30)}, ${y + (morre ? (f - tCresce) * 6 : 0)})`}><Germe s={0.8} morto={morre} /></g>)}
				<Placa x={540} y={300} k={usePop(tAgua, 10)} txt="LITTLE WATER" tam={100} cor="#bfe3ff" />
				<Placa x={540} y={1700} k={usePop(tCresce, 9)} txt="NO GERMS!" tam={110} />
			</Camera>
			<Sfx src="pop" em={tAgua} vol={0.35} />
			<Sfx src="buzz" em={tGerm} vol={0.3} />
			<Sfx src="ding" em={tCresce} vol={0.4} />
		</>
	);
};

// 2 — ácido + enzima das abelhas que produz peróxido de hidrogênio
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAcido = m('acidic'), tAbelha = m('bees'), tPerox = m('peroxide');
	const voo = interpolate(f, [tAbelha - 6, tAbelha + 30], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur} soco={tPerox}>
				<Fundo cor="#fff1c0" />
				<g transform="translate(540, 1150)"><PoteMel s={1.1} /></g>
				{f >= tAbelha - 6 && <g transform={`translate(${-100 + voo * 760}, ${700 + Math.sin(f / 4) * 40}) scale(-1, 1)`}><Abelha s={0.9} /></g>}
				<Placa x={540} y={300} k={usePop(tAcido, 10)} txt="ACIDIC" tam={120} cor="#c8f05a" />
				<Placa x={540} y={1700} k={usePop(tPerox, 9)} txt="+ HYDROGEN PEROXIDE" tam={68} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tAcido} vol={0.35} />
			<Sfx src="buzz" em={tAbelha} vol={0.35} />
			<Sfx src="ding" em={tPerox} vol={0.4} />
		</>
	);
};

// 3 — potes de mel em tumbas egípcias com milhares de anos (relatos)
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tArq = m('archaeologists'), tPotes = m('pots'), tEgito = m('egyptian'), tMil = m('thousands');
	const kP = usePop(tPotes, 10);
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1150, 1.0]} dur={dur} soco={tMil}>
				<Tumba>
					<g transform={`translate(720, 1520) scale(${kP})`}><Anfora s={1.1} /></g>
					{kP > 0 && <circle cx={720} cy={1300} r={260 + Math.sin(f / 5) * 20} fill="#ffd23f" opacity={0.15} />}
					<Personagem x={270} y={2040} escala={0.9} roupa="fazendeiro" cor="#c9a26a" cabelo="#4a3326" expressao={f >= tPotes ? 'assustado' : 'neutro'} olhar={1} bracoD={f >= tArq ? 120 : 30} cotoveloD={-10} fase={1} />
				</Tumba>
				<Placa x={540} y={300} k={usePop(tEgito, 10)} txt="ANCIENT EGYPT" tam={100} />
				<Placa x={540} y={520} k={usePop(tMil, 9)} txt="1000s OF YEARS OLD" tam={64} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tArq} vol={0.3} />
			<Sfx src="ding" em={tPotes} vol={0.4} />
			<Sfx src="boom" em={tMil} vol={0.35} />
		</>
	);
};

// 4 — e ainda era comestível
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCom = m('edible');
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 1000, 1.1]} dur={dur} soco={tCom}>
				<Tumba>
					<g transform="translate(780, 1520)"><Anfora s={0.9} /></g>
					<Personagem x={380} y={1980} escala={1.05} roupa="fazendeiro" cor="#c9a26a" cabelo="#4a3326" expressao={f >= tCom ? 'feliz' : 'confuso'} falando={f >= tCom} olhar={1} bracoD={130} cotoveloD={-90} itemD={<g transform="rotate(180) scale(0.5)"><rect x={-10} y={0} width={20} height={160} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={4} /><ellipse cx={0} cy={180} rx={40} ry={26} fill={MEL} stroke={CONTORNO} strokeWidth={5} /></g>} fase={2} />
				</Tumba>
				<Placa x={540} y={300} k={usePop(tCom, 9)} txt="STILL EDIBLE!" tam={120} cor="#5aff7a" />
			</Camera>
			<Sfx src="ding" em={tCom} vol={0.45} />
		</>
	);
};

// 5 — duro e turvo não é estragado: é cristalizado; esquente!
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDuro = m('hard'), tJoga = m('throw'), tCrist = m('crystallized'), tAq = m('warm');
	const turvo = f < tAq ? interpolate(f, [tDuro - 4, tDuro + 10], [0, 1], clamp) : interpolate(f, [tAq, tAq + 24], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const kJ = usePop(tJoga, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur} soco={tCrist}>
				<Fundo cor={f >= tAq ? '#ffd9a8' : '#e9e2d0'} />
				{f >= tAq && <rect x={260} y={1150} width={560} height={260} rx={30} fill="#5ab8e8" opacity={0.6} stroke={CONTORNO} strokeWidth={8} />}
				<g transform="translate(540, 1150)"><PoteMel s={1.2} turvo={turvo} feliz={f >= tAq + 10} /></g>
				{f >= tAq && [0, 1, 2].map((i) => { const t = ((f + i * 10) % 30) / 30; return <path key={i} d={`M${400 + i * 140} ${1100 - t * 200} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#e8262f" strokeWidth={10} fill="none" opacity={Math.sin(t * Math.PI)} strokeLinecap="round" />; })}
				{kJ > 0 && f < tCrist && <g transform={`translate(850, 600) scale(${kJ * 0.8})`}><path d="M-80 -60 h160 l-20 180 h-120Z" fill="#9aa1ad" stroke={CONTORNO} strokeWidth={8} /><Xis s={0.8} /></g>}
				<Placa x={540} y={300} k={usePop(tCrist, 9)} txt="JUST CRYSTALLIZED" tam={84} />
				<Placa x={540} y={1700} k={usePop(tAq, 9)} txt="WARM IT UP!" tam={110} cor="#ffb000" />
			</Camera>
			<Sfx src="uhoh" em={tDuro} vol={0.3} />
			<Sfx src="buzz" em={tJoga} vol={0.3} />
			<Sfx src="ding" em={tCrist} vol={0.4} />
			<Sfx src="whoosh" em={tAq} vol={0.35} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'HoneySpoils',
	pastaVoz: 'voz-honey-spoils',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['never', 'bad', 'water', 'germs', 'grow', 'acidic', 'bees', 'peroxide', 'archaeologists', 'pots', 'egyptian', 'thousands', 'edible', 'hard', 'throw', 'crystallized', 'warm']),
};
export default ep;
