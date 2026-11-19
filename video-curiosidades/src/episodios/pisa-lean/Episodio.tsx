// Episódio (EN): a Torre de Pisa começou a inclinar antes de ficar pronta.
// Fontes: Britannica, Smithsonian, Opera della Primaziale Pisana, Burland (Imperial College).
// Início 1173; inclinação começou no 3º andar (~1178) por solo mole; guerras pararam a obra ~1 século
// (o solo assentou e isso provavelmente a salvou); fechada em 1990 (~5,5°); escavação de solo sob o lado
// norte (o lado alto) até 2001 reduziu para ~4°.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, Interrogacao, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';

export const FALAS = [
	'The Leaning Tower of Pisa started leaning before it was even finished.',
	'Construction began in 1173, on soft, sandy ground.',
	'By the time builders reached the third floor, the tower was already tilting.',
	'Then wars stopped construction for about a century. And that pause probably saved it, because the soil had time to settle.',
	'By 1990, it was leaning so much that it was closed to visitors.',
	'Engineers carefully removed soil from under the high side, and straightened it just a little. But not too much.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CHAO_Y = 1500;

// torre de Pisa: andares 1..8, ang em graus (positivo = inclina para a direita); pivô na base
export const TorrePisa: React.FC<{andares?: number; ang?: number; s?: number}> = ({andares = 8, ang = 0, s = 1}) => {
	const hA = 110;
	return (
		<g transform={`rotate(${ang}) scale(${s})`}>
			{Array.from({length: Math.min(andares, 7)}).map((_, i) => (
				<g key={i} transform={`translate(0, ${-i * hA})`}>
					<rect x={-150} y={-hA} width={300} height={hA} fill={i === 0 ? '#efe7d6' : '#f6f0e2'} stroke={CONTORNO} strokeWidth={7} />
					{Array.from({length: 6}).map((_, j) => <path key={j} d={`M${-125 + j * 50} -10 v${-hA + 45} a 15 15 0 0 1 30 0 v${hA - 45}`} fill="#d9cdb5" stroke={CONTORNO} strokeWidth={4} />)}
					<rect x={-165} y={-hA - 8} width={330} height={16} fill="#e3d6c0" stroke={CONTORNO} strokeWidth={5} />
				</g>
			))}
			{andares >= 8 && (
				<g transform={`translate(0, ${-7 * hA})`}>
					<rect x={-100} y={-90} width={200} height={90} fill="#f6f0e2" stroke={CONTORNO} strokeWidth={7} />
					<path d="M-110 -90 L0 -130 L110 -90Z" fill="#c8623a" stroke={CONTORNO} strokeWidth={6} />
				</g>
			)}
		</g>
	);
};

const Praca: React.FC<{ceu?: string; afunda?: number; children?: React.ReactNode}> = ({ceu = '#bfe3ff', afunda = 0, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill={ceu} />
			<circle cx={180} cy={260} r={90} fill="#fff1a8" />
			<rect y={CHAO_Y} width={W} height={H - CHAO_Y} fill="#d9b77a" />
			{Array.from({length: 30}).map((_, i) => <circle key={i} cx={(i * 173) % 1080} cy={CHAO_Y + 40 + ((i * 97) % 380)} r={6} fill="#b8955a" />)}
			{afunda > 0 && <path d={`M300 ${CHAO_Y} Q540 ${CHAO_Y + 80 * afunda + Math.sin(f / 6) * 4} 780 ${CHAO_Y}`} fill="#b8955a" stroke={CONTORNO} strokeWidth={5} />}
			<rect y={CHAO_Y - 14} width={W} height={20} fill="#6fae4f" />
			{children}
		</g>
	);
};

// 0 — gancho: começou a inclinar antes de terminar
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tInc = m('leaning', 2), tTerm = m('finished');
	const ang = interpolate(f, [tInc - 4, tInc + 14], [0, 8], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1000, 1.05]} dur={dur} soco={tTerm}>
				<Praca>
					<g transform={`translate(540, ${CHAO_Y})`}><TorrePisa andares={5} ang={ang} s={1.15} /></g>
					{[[300, 1], [820, -1]].map(([x, o], i) => <Personagem key={i} x={x} y={2050} escala={0.8} roupa="campones" cor={i ? '#c9762e' : '#5a8f6a'} cabelo={i ? '#1d1d1d' : '#4a3326'} expressao={f >= tInc ? 'assustado' : 'neutro'} olhar={o} bracoD={f >= tInc ? 150 : 30} cotoveloD={-20} fase={i} />)}
				</Praca>
				<Placa x={540} y={280} k={usePop(tTerm, 9)} txt="NOT EVEN FINISHED!" tam={80} />
			</Camera>
			<Sfx src="uhoh" em={tInc} vol={0.4} />
			<Sfx src="boom" em={tTerm} vol={0.4} />
		</>
	);
};

// 1 — 1173, solo mole e arenoso
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1173'), tMole = m('soft'), tAreia = m('sandy');
	return (
		<>
			<Camera de={[540, 1300, 1.15]} para={[540, 1250, 1.0]} dur={dur} soco={tAreia}>
				<Praca afunda={f >= tMole ? 1 : 0}>
					<g transform={`translate(540, ${CHAO_Y + (f >= tMole ? Math.sin(f / 5) * 6 : 0)})`}><TorrePisa andares={1} s={1.2} /></g>
					{f >= tAreia && Array.from({length: 8}).map((_, i) => <path key={i} d={`M${100 + i * 120} ${CHAO_Y + 120 + (i % 2) * 90} q 30 -20 60 0 q 30 20 60 0`} stroke="#8a6a3a" strokeWidth={8} fill="none" />)}
					<Personagem x={230} y={1500} escala={0.6} roupa="campones" cor="#5a8f6a" cabelo="#4a3326" expressao="feliz" olhar={1} fase={1} />
				</Praca>
				<Placa x={540} y={300} k={usePop(tAno, 10)} txt="1173" tam={140} />
				<Placa x={540} y={1760} k={usePop(tAreia, 10)} txt="SOFT SAND" tam={100} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="uhoh" em={tAreia} vol={0.35} />
		</>
	);
};

// 2 — no 3º andar já estava inclinando
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTerc = m('third'), tInc = m('tilting');
	const andares = f < tTerc ? 1 + Math.min(1, Math.floor(f / 10)) : 3;
	const ang = interpolate(f, [tInc - 4, tInc + 10], [0, 3], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1150, 1.05]} dur={dur} soco={tInc}>
				<Praca>
					<g transform={`translate(540, ${CHAO_Y})`}><TorrePisa andares={andares} ang={ang} s={1.2} /></g>
					<Personagem x={860} y={2040} escala={0.85} roupa="campones" cor="#c9762e" cabelo="#1d1d1d" expressao={f >= tInc ? 'confuso' : 'feliz'} olhar={-1} fase={2} />
					{f >= tInc + 6 && <Interrogacao x={900} y={1060} inicio={tInc + 6} s={0.8} />}
				</Praca>
				<Placa x={540} y={300} k={usePop(tTerc, 10)} txt="3RD FLOOR" tam={110} />
				<Placa x={540} y={480} k={usePop(tInc + 2, 10)} txt="ALREADY TILTING" tam={80} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tTerc} vol={0.4} />
			<Sfx src="uhoh" em={tInc} vol={0.4} />
		</>
	);
};

// 3 — guerras pararam a obra ~1 século; a pausa provavelmente a salvou (o solo assentou)
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tGuerra = m('wars'), tSec = m('century'), tSalvou = m('saved'), tSolo = m('soil');
	const assenta = interpolate(f, [tSolo, tSolo + 20], [0, 1], clamp);
	const guerra = f >= tGuerra && f < tSalvou - 4;
	return (
		<>
			<Camera de={[540, 1200, 1.1]} para={[540, 1150, 1.05]} dur={dur} soco={tSalvou}>
				<Praca ceu={guerra ? '#d9a68a' : '#bfe3ff'}>
					<g transform={`translate(540, ${CHAO_Y})`}><TorrePisa andares={3} ang={3} s={1.2} /></g>
					{guerra && [200, 880].map((x, i) => <Personagem key={x} x={x} y={2050} escala={0.85} roupa="granadeiro" cor={i ? '#2b4a8a' : '#a83232'} expressao="bravo" olhar={i ? -1 : 1} bracoD={130 + Math.sin(f / 3 + i) * 20} cotoveloD={-30} fase={i} />)}
					{assenta > 0 && Array.from({length: 6}).map((_, i) => <rect key={i} x={120 + i * 150} y={CHAO_Y + 60 + i % 2 * 40} width={110} height={24} rx={12} fill="#a8854a" opacity={assenta} />)}
				</Praca>
				<Placa x={540} y={280} k={usePop(tSec, 10)} txt="~100 YEAR PAUSE" tam={90} />
				<Placa x={540} y={460} k={usePop(tSalvou, 9)} txt="IT SAVED IT!" tam={90} cor="#5aff7a" rot={4} />
			</Camera>
			<Sfx src="boom" em={tGuerra} vol={0.4} />
			<Sfx src="pop" em={tSec} vol={0.4} />
			<Sfx src="ding" em={tSalvou} vol={0.4} />
		</>
	);
};

// 4 — em 1990, fechada ao público
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1990'), tFech = m('closed');
	const ang = interpolate(f, [0, tFech], [4, 5.5], clamp);
	const kF = usePop(tFech, 9);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tFech} tremor={f >= tFech ? 2 : 0}>
				<Praca>
					<g transform={`translate(540, ${CHAO_Y})`}><TorrePisa ang={ang} /></g>
					{f >= tFech && (
						<g transform={`translate(540, ${CHAO_Y + 150}) scale(${kF})`}>
							{[-300, 300].map((x) => <rect key={x} x={x - 14} y={-140} width={28} height={180} fill="#6b4a36" />)}
							<rect x={-360} y={-140} width={720} height={80} fill="#fff" stroke={CONTORNO} strokeWidth={8} />
							{Array.from({length: 8}).map((_, i) => <path key={i} d={`M${-360 + i * 90} -60 l40 -80 h40 l-40 80Z`} fill="#e8262f" />)}
						</g>
					)}
				</Praca>
				<Placa x={540} y={280} k={usePop(tAno, 10)} txt="1990" tam={140} />
				<Placa x={540} y={1760} k={kF} txt="CLOSED!" tam={130} cor="#e8262f" corTxt="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="boom" em={tFech} vol={0.45} />
		</>
	);
};

// 5 — engenheiros tiraram solo do lado alto e endireitaram só um pouco
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSolo = m('soil'), tEnd = m('straightened'), tMuito = m('much');
	const ang = interpolate(f, [tEnd - 6, tEnd + 18], [5.5, 4], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const cava = f >= tSolo && f < tEnd + 18;
	return (
		<>
			<Camera de={[540, 1200, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tMuito}>
				<Praca>
					<g transform={`translate(540, ${CHAO_Y})`}><TorrePisa ang={ang} /></g>
					{cava && [0, 1, 2].map((i) => {
						const t = ((f + i * 9) % 27) / 27;
						return <circle key={i} cx={300 - t * 200} cy={CHAO_Y + 40 - Math.sin(t * Math.PI) * 140} r={22} fill="#a8854a" stroke={CONTORNO} strokeWidth={4} />;
					})}
					<Personagem x={200} y={2060} escala={0.85} roupa="bombeiro" expressao={f >= tMuito ? 'feliz' : 'serio'} olhar={1} bracoD={cava ? 90 + Math.sin(f / 3) * 30 : 40} cotoveloD={-30} fase={3} />
				</Praca>
				<Placa x={540} y={280} k={usePop(tEnd, 10)} txt="5.5° → 4°" tam={110} />
				<Placa x={600} y={1760} k={usePop(tMuito, 9)} txt="STILL LEANING ;)" tam={90} />
			</Camera>
			<Sfx src="whoosh" em={tSolo} vol={0.3} />
			<Sfx src="pop" em={tEnd} vol={0.4} />
			<Sfx src="ding" em={tMuito} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'PisaLean',
	pastaVoz: 'voz-pisa-lean',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['leaning', 'finished', '1173', 'soft', 'sandy', 'third', 'tilting', 'wars', 'century', 'saved', 'soil', '1990', 'closed', 'straightened', 'much']),
};
export default ep;
