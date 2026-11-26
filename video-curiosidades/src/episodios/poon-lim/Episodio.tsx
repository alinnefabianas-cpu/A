// Episódio (EN): Poon Lim sobreviveu 133 dias sozinho numa jangada (1942–43).
// Fontes: Smithsonian, BBC, Guinness World Records, U.S. Naval History, entrevistas de Poon Lim.
// SS Benlomond torpedeado por U-boat (23/nov/1942); jangada com biscoitos e água; anzol do arame da lanterna; água
// da chuva; pegou aves marinhas; navios passaram; avião o avistou mas veio uma tempestade; resgatado por pescadores
// perto de Belém (Brasil) em 5/abr/1943, no 133º dia; saiu do barco andando.
// Dicas aplicadas: estilo próprio (contador DAY n/133); 1º quadro = capa; CTA de 1 palavra no fim.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {Aviao, H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Sol, clamp} from '../comum';
import {Navio} from '../violet-jessop/Episodio';
import voz from './voz.json';

export const FALAS = [
	'This man survived 133 days alone in the middle of the ocean, on a tiny wooden raft.',
	'In 1942, Poon Lim was working on a British cargo ship when a German submarine torpedoed it.',
	'The ship sank in minutes. He jumped into the ocean, and found an empty life raft.',
	'It had some biscuits and water. But they ran out.',
	'So he made a fishing hook from the wire in his flashlight, and caught fish.',
	'He drank rainwater, and even caught seabirds with his bare hands.',
	'Ships passed him by. A plane even spotted him, but then a storm hit.',
	'On day 133, fishermen off the coast of Brazil finally rescued him. He walked off the boat on his own.',
	'Could you last even one week out there? Comment one word: NEVER.',
];

const POON = {roupa: 'passageiro' as const, cor: '#f2efe2', cabelo: '#1d1d1d'};

const Oceano: React.FC<{y?: number; ceu?: string; escuro?: boolean; children?: React.ReactNode; frente?: React.ReactNode}> = ({y = 1150, ceu = '#9fd0f0', escuro, children, frente}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill={escuro ? '#2a3048' : ceu} />
			{children}
			<path d={`M0 ${y} Q270 ${y - 24 + Math.sin(f / 8) * 12} 540 ${y} T1080 ${y} V1920 H0Z`} fill={escuro ? '#1f3a5a' : '#2f7fc0'} />
			{Array.from({length: 9}).map((_, i) => <path key={i} d={`M${((i * 150 + f * 2) % 1240) - 100} ${y + 80 + (i % 4) * 160} q30 -16 60 0`} stroke="rgba(255,255,255,0.45)" strokeWidth={6} fill="none" />)}
			{frente}
		</g>
	);
};

// jangada vista de lado com Poon Lim sentado; origem na linha d'água
const Jangada: React.FC<{s?: number; expressao?: 'feliz' | 'serio' | 'assustado' | 'confuso' | 'enjoado'; bracoD?: number; itemD?: React.ReactNode; bracoE?: number}> = ({s = 1, expressao = 'serio', bracoD = 30, itemD, bracoE = 30}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) rotate(${Math.sin(f / 10) * 4}) translate(0, ${Math.sin(f / 7) * 8})`}>
			<clipPath id="jangadaClip"><rect x={-500} y={-900} width={1000} height={895} /></clipPath>
			<g clipPath="url(#jangadaClip)"><Personagem x={0} y={230} escala={0.75} {...POON} expressao={expressao} bracoD={bracoD} bracoE={bracoE} cotoveloD={-20} itemD={itemD} fase={1} /></g>
			<rect x={-230} y={-10} width={460} height={50} rx={8} fill="#a8794a" stroke={CONTORNO} strokeWidth={8} />
			{[-170, -60, 50, 160].map((x) => <line key={x} x1={x} y1={-10} x2={x} y2={40} stroke="#7a5230" strokeWidth={6} />)}
			<rect x={-250} y={30} width={500} height={30} rx={10} fill="#e8a23a" stroke={CONTORNO} strokeWidth={6} />
		</g>
	);
};

const Contador: React.FC<{d: number; pulso?: number}> = ({d, pulso = 0}) => (
	<g transform={`translate(760, 640) scale(${1 + pulso * 0.2})`}>
		<rect x={-200} y={-66} width={400} height={132} rx={30} fill="#000" stroke="#ffd23f" strokeWidth={8} />
		<text x={0} y={26} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#fff">DAY {d}/133</text>
	</g>
);

const Submarino: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<ellipse cx={0} cy={0} rx={300} ry={70} fill="#4a5260" stroke={CONTORNO} strokeWidth={9} />
		<rect x={-60} y={-130} width={120} height={80} rx={14} fill="#5a6270" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-10} y={-200} width={16} height={80} fill="#3a3f4a" />
	</g>
);

const Peixe: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-90 0 Q-20 -60 60 0 Q-20 60 -90 0Z" fill="#7fb3d8" stroke={CONTORNO} strokeWidth={6} />
		<path d="M60 0 L110 -40 L110 40Z" fill="#7fb3d8" stroke={CONTORNO} strokeWidth={6} />
		<circle cx={-55} cy={-8} r={7} fill={CONTORNO} />
	</g>
);

const Gaivota: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	const a = Math.sin(f / 3) * 20;
	return (
		<g transform={`scale(${s})`}>
			<path d={`M0 0 Q-60 ${-40 - a} -130 ${-10 - a}`} stroke={CONTORNO} strokeWidth={10} fill="none" strokeLinecap="round" />
			<path d={`M0 0 Q60 ${-40 - a} 130 ${-10 - a}`} stroke={CONTORNO} strokeWidth={10} fill="none" strokeLinecap="round" />
			<ellipse cx={0} cy={10} rx={40} ry={22} fill="#fff" stroke={CONTORNO} strokeWidth={6} />
		</g>
	);
};

const BarcoPesca: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-260 -30 L260 -30 L200 70 L-200 70Z" fill="#e8392f" stroke={CONTORNO} strokeWidth={9} />
		<rect x={-12} y={-330} width={24} height={300} fill="#6b4a2a" />
		<path d="M12 -320 L200 -60 L12 -60Z" fill="#f6ead0" stroke={CONTORNO} strokeWidth={7} />
	</g>
);

// 0 — CAPA no frame 0 + gancho
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tJang = m('raft');
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 1100, 1.15]} dur={dur} soco={tJang}>
				<Oceano y={1150}>
					<Sol x={850} y={800} s={0.9} />
				</Oceano>
				<g transform="translate(540, 1620)"><Jangada s={1.05} expressao="enjoado" /></g>
				<Placa x={540} y={270} k={1} txt="ALONE AT SEA" tam={100} rot={-4} />
				<g transform="translate(540, 480) rotate(4)">
					<rect x={-370} y={-105} width={740} height={200} rx={30} fill="#e8262f" stroke="#000" strokeWidth={12} />
					<text x={0} y={55} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={160} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">133 DAYS</text>
				</g>
				<Placa x={540} y={1080} k={usePop(tJang, 9)} txt="ON A TINY RAFT" tam={100} />
			</Camera>
			<Sfx src="boom" em={0} vol={0.45} />
			<Sfx src="pop" em={tJang} vol={0.4} />
		</>
	);
};

// 1 — 1942: navio de carga britânico torpedeado por um submarino alemão
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1942'), tNome = m('poon'), tSub = m('submarine'), tTorp = m('torpedoed');
	const xt = interpolate(f, [tSub, tTorp], [880, 560], {...clamp, easing: Easing.in(Easing.quad)});
	const bum = f >= tTorp;
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1150, 1.0]} dur={dur} soco={tTorp} tremor={bum && f < tTorp + 14 ? 10 : 0}>
				<Oceano y={1200} frente={
					<g>
						{f >= tSub - 6 && <g transform="translate(860, 1520)" opacity={0.9}><Submarino s={0.7} /></g>}
						{f >= tSub && !bum && <g transform={`translate(${xt}, 1320)`}><ellipse rx={50} ry={14} fill="#3a3f4a" /><path d={`M50 0 L${Math.min(320, 880 - xt)} 0`} stroke="#fff" strokeWidth={6} strokeDasharray="20 14" opacity={0.7} /></g>}
					</g>
				}>
					<g transform={`translate(420, 1200) rotate(${bum ? 4 : 0})`}><Navio s={0.6} /></g>
					{bum && f < tTorp + 18 && <g transform="translate(560, 1230)">{Array.from({length: 12}).map((_, i) => <path key={i} d="M0 0 L40 -240 L-40 -240Z" fill={i % 2 ? '#ffb000' : '#e8392f'} transform={`rotate(${i * 30}) scale(${interpolate(f, [tTorp, tTorp + 8], [0.3, 1.1], clamp)})`} />)}</g>}
				</Oceano>
				<Placa x={540} y={280} k={usePop(tAno, 10)} txt="1942" tam={140} />
				<Placa x={540} y={480} k={usePop(tNome, 10)} txt="POON LIM" tam={100} cor="#fff" rot={4} />
				<Placa x={540} y={1760} k={usePop(tTorp + 2, 9)} txt="TORPEDO!" tam={120} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="ding" em={tNome} vol={0.4} />
			<Sfx src="whoosh" em={tSub} vol={0.4} />
			<Sfx src="boom" em={tTorp} vol={0.65} />
		</>
	);
};

// 2 — afundou em minutos; pulou no mar e achou uma jangada vazia
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAfunda = m('sank'), tPula = m('jumped'), tJang = m('raft');
	const afunda = interpolate(f, [0, tPula], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const naJangada = f >= tJang;
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1200, 1.05]} dur={dur} soco={tJang}>
				<Oceano y={1200}>
					{afunda < 1 && <g transform={`translate(560, ${1200 + afunda * 420}) rotate(${-afunda * 30})`}><Navio s={0.6} /></g>}
				</Oceano>
				{naJangada ? <g transform="translate(540, 1640)"><Jangada s={1.0} expressao="assustado" /></g> : (
					f >= tPula && <g transform={`translate(${540 + Math.sin(f / 4) * 20}, 1680)`}><Personagem x={0} y={300} escala={0.75} {...POON} expressao="assustado" bracoD={170} bracoE={170} semPernas fase={2} /></g>
				)}
				<Placa x={540} y={280} k={usePop(tAfunda, 10)} txt="SUNK IN MINUTES" tam={90} />
				<Placa x={540} y={1080} k={usePop(tJang, 9)} txt="A LIFE RAFT!" tam={110} cor="#5aff7a" />
				<Contador d={1} />
			</Camera>
			<Sfx src="whoosh" em={tAfunda} vol={0.4} />
			<Sfx src="pop" em={tPula} vol={0.35} />
			<Sfx src="ding" em={tJang} vol={0.4} />
		</>
	);
};

// 3 — biscoitos e água... acabaram (dias passam)
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBisc = m('biscuits'), tAcab = m('ran');
	const dia = Math.round(interpolate(f, [0, dur], [2, 20], clamp));
	const kB = usePop(tBisc, 10);
	const vazio = f >= tAcab;
	return (
		<>
			<Camera de={[540, 1150, 1.15]} para={[540, 1150, 1.05]} dur={dur} soco={tAcab}>
				<Oceano y={1200} />
				<g transform="translate(540, 1640)"><Jangada s={1.0} expressao={vazio ? 'enjoado' : 'feliz'} /></g>
				{kB > 0 && (
					<g transform={`translate(540, 900) scale(${kB})`} opacity={vazio ? 0.35 : 1}>
						<rect x={-260} y={-90} width={220} height={180} rx={14} fill="#c9a227" stroke={CONTORNO} strokeWidth={8} />
						<text x={-150} y={14} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill={CONTORNO}>BISCUITS</text>
						<rect x={60} y={-120} width={180} height={220} rx={20} fill="#5ab8e8" stroke={CONTORNO} strokeWidth={8} />
						<text x={150} y={6} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill={CONTORNO}>WATER</text>
						{vazio && <path d="M-300 -150 L300 150 M300 -150 L-300 150" stroke="#e8262f" strokeWidth={28} strokeLinecap="round" />}
					</g>
				)}
				<Placa x={540} y={1080} k={usePop(tAcab, 9)} txt="ALL GONE!" tam={120} cor="#e8262f" corTxt="#fff" />
				<Contador d={dia} />
			</Camera>
			<Sfx src="pop" em={tBisc} vol={0.35} />
			<Sfx src="uhoh" em={tAcab} vol={0.45} />
		</>
	);
};

// 4 — anzol feito do arame da lanterna; pescou
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAnzol = m('hook'), tLant = m('flashlight'), tPeixe = m('fish');
	const dia = Math.round(interpolate(f, [0, dur], [21, 45], clamp));
	const puxa = interpolate(f, [tPeixe, tPeixe + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1150, 1.05]} dur={dur} soco={tPeixe}>
				<Oceano y={1200} />
				<g transform="translate(400, 1640)"><Jangada s={1.0} expressao={f >= tPeixe ? 'feliz' : 'serio'} bracoD={120} itemD={<g transform="rotate(200)"><line x1={0} y1={0} x2={0} y2={300} stroke="#6b4a2a" strokeWidth={8} /></g>} /></g>
				<path d={`M680 1360 Q 720 ${1560 - puxa * 200} 740 ${1760 - puxa * 500}`} stroke="#ddd" strokeWidth={4} fill="none" opacity={f >= tAnzol ? 1 : 0} />
				{f >= tPeixe && <g transform={`translate(740, ${1800 - puxa * 520}) rotate(${-60 + Math.sin(f) * 20})`}><Peixe s={1.1} /></g>}
				{f >= tLant && f < tPeixe && <g transform="translate(780, 860)">
					<rect x={-40} y={-140} width={80} height={200} rx={16} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={8} />
					<path d="M60 -60 q40 20 0 40 q-40 20 0 40 q40 20 0 40 M60 60 q30 40 0 60 q-20 10 -30 -10" stroke="#c9a227" strokeWidth={8} fill="none" />
				</g>}
				<Placa x={540} y={280} k={usePop(tAnzol, 10)} txt="DIY FISH HOOK" tam={100} />
				<Placa x={540} y={1080} k={usePop(tPeixe + 6, 9)} txt="CAUGHT ONE!" tam={110} cor="#5aff7a" />
				<Contador d={dia} />
			</Camera>
			<Sfx src="pop" em={tAnzol} vol={0.35} />
			<Sfx src="ding" em={tLant} vol={0.3} />
			<Sfx src="whoosh" em={tPeixe} vol={0.45} />
		</>
	);
};

// 5 — água da chuva e aves marinhas com as mãos
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tChuva = m('rainwater'), tAves = m('seabirds'), tMaos = m('hands');
	const dia = Math.round(interpolate(f, [0, dur], [46, 80], clamp));
	const chove = f >= tChuva - 4 && f < tAves;
	const pega = f >= tMaos;
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1150, 1.05]} dur={dur} soco={tMaos}>
				<Oceano y={1200} ceu={chove ? '#8a9ab0' : '#9fd0f0'}>
					{chove && [[260, 380], [700, 320]].map(([x, y], i) => <g key={i} transform={`translate(${x}, ${y})`}>{[[-90, 0, 80], [0, -30, 100], [90, 0, 80]].map(([cx, cy, r], k) => <circle key={k} cx={cx} cy={cy} r={r} fill="#5a6278" />)}</g>)}
					{chove && Array.from({length: 40}).map((_, i) => <line key={i} x1={(i * 61) % 1080} y1={((i * 113 + f * 40) % 1100) + 400} x2={(i * 61) % 1080 - 10} y2={((i * 113 + f * 40) % 1100) + 450} stroke="#cfe3ff" strokeWidth={5} />)}
				</Oceano>
				<g transform="translate(540, 1640)"><Jangada s={1.0} expressao={chove ? 'feliz' : pega ? 'feliz' : 'serio'} bracoD={chove || pega ? 160 : 30} bracoE={chove || pega ? 160 : 30} /></g>
				{f >= tAves && !pega && <g transform={`translate(${540 + Math.sin(f / 10) * 200}, ${800 + Math.cos(f / 8) * 60})`}><Gaivota /></g>}
				{pega && <g transform="translate(540, 1050)"><Gaivota s={0.9} /></g>}
				<Placa x={540} y={280} k={usePop(tChuva, 10)} txt="RAINWATER" tam={110} cor="#bfe3ff" />
				<Placa x={540} y={1080} k={usePop(tMaos, 9)} txt="BARE HANDS!" tam={110} />
				<Contador d={dia} />
			</Camera>
			<Sfx src="whoosh" em={tChuva} vol={0.35} />
			<Sfx src="pop" em={tAves} vol={0.35} />
			<Sfx src="boom" em={tMaos} vol={0.4} />
		</>
	);
};

// 6 — navios passaram; um avião o viu, mas veio a tempestade
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNavios = m('ships'), tAviao = m('plane'), tTemp = m('storm');
	const dia = Math.round(interpolate(f, [0, dur], [81, 130], clamp));
	const tempestade = f >= tTemp;
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1150, 1.0]} dur={dur} soco={tTemp} tremor={tempestade ? 6 : 0}>
				<Oceano y={1200} escuro={tempestade}>
					{f < tAviao && <g transform={`translate(${interpolate(f, [tNavios, tAviao], [-300, 1400], clamp)}, 1190)`}><Navio s={0.35} /></g>}
					{f >= tAviao && !tempestade && <g transform={`translate(${interpolate(f, [tAviao, tTemp], [1300, 300], clamp)}, 430) scale(-0.8, 0.8)`}><Aviao /></g>}
					{tempestade && Array.from({length: 50}).map((_, i) => <line key={i} x1={(i * 53 + f * 10) % 1180 - 50} y1={(i * 131 + f * 50) % 1920} x2={(i * 53 + f * 10) % 1180 - 80} y2={(i * 131 + f * 50) % 1920 + 80} stroke="#8fa8d8" strokeWidth={5} />)}
				</Oceano>
				<g transform="translate(540, 1640)"><Jangada s={1.0} expressao={tempestade ? 'assustado' : 'feliz'} bracoD={f >= tNavios && !tempestade ? 165 : 30} bracoE={f >= tNavios && !tempestade ? 165 : 30} /></g>
				<Placa x={540} y={280} k={usePop(tNavios, 10)} txt="HEY! OVER HERE!" tam={90} />
				<Placa x={540} y={1080} k={usePop(tTemp, 9)} txt="STORM!" tam={130} cor="#e8262f" corTxt="#fff" />
				<Contador d={dia} />
			</Camera>
			<Sfx src="pop" em={tNavios} vol={0.35} />
			<Sfx src="aviao" em={tAviao} vol={0.35} />
			<Sfx src="boom" em={tTemp} vol={0.5} />
		</>
	);
};

// 7 — dia 133: pescadores no Brasil o resgatam; saiu andando
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDia = m('133'), tBrasil = m('brazil'), tResg = m('rescued'), tAnda = m('walked');
	const xb = interpolate(f, [tBrasil - 10, tResg], [1400, 820], {...clamp, easing: Easing.out(Easing.cubic)});
	const andando = f >= tAnda;
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1100, 1.0]} dur={dur} soco={tResg}>
				<Oceano y={1200}>
					<Sol x={200} y={500} s={0.8} />
				</Oceano>
				<g transform={`translate(${xb}, 1400)`}><BarcoPesca s={0.9} /></g>
				{f >= tResg && [0, 1].map((i) => <Personagem key={i} x={xb - 80 + i * 150} y={1700} escala={0.6} roupa="fazendeiro" cor={i ? '#c9762e' : '#3c8a4a'} cabelo="#1d1d1d" expressao="feliz" bracoD={150} cotoveloD={-10} semPernas fase={i + 3} />)}
				{!andando ? <g transform="translate(380, 1640)"><Jangada s={0.95} expressao={f >= tResg ? 'feliz' : 'serio'} bracoD={f >= tBrasil ? 160 : 30} /></g> : (
					<Personagem x={interpolate(f, [tAnda, dur], [380, 520], clamp)} y={2050} escala={1.0} {...POON} expressao="feliz" bracoD={150} bracoE={150} cotoveloD={-10} cotoveloE={-10} fase={5} />
				)}
				<Contador d={133} pulso={f >= tDia ? Math.exp(-(f - tDia) / 5) : 0} />
				<Placa x={540} y={280} k={usePop(tResg, 9)} txt="RESCUED!" tam={130} cor="#5aff7a" />
				<Placa x={540} y={460} k={usePop(tAnda, 10)} txt="AND HE WALKED!" tam={90} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="ding" em={tDia} vol={0.4} />
			<Sfx src="whoosh" em={tBrasil} vol={0.35} />
			<Sfx src="boom" em={tResg} vol={0.45} />
			<Sfx src="pop" em={tAnda} vol={0.35} />
		</>
	);
};

// 8 — CTA de uma palavra: comente NEVER
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCom = m('comment'), tNunca = m('never');
	const kB = usePop(tCom - 4, 10), kZ = usePop(tNunca, 7);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tNunca}>
				<Oceano y={1300} />
				<g transform="translate(540, 1720)"><Jangada s={0.8} expressao="enjoado" /></g>
				<g transform={`translate(540, 800) scale(${kB * 0.88})`}>
					<path d="M-420 -220 H420 Q460 -220 460 -180 V160 Q460 200 420 200 H-160 L-260 300 L-240 200 H-420 Q-460 200 -460 160 V-180 Q-460 -220 -420 -220Z" fill="#fff" stroke={CONTORNO} strokeWidth={12} />
					<text x={0} y={-100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#5a6070">COMMENT</text>
					<g transform={`scale(${kZ * (1 + 0.06 * Math.sin(f / 4))})`}>
						<text x={0} y={100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={190} fill="#ffd23f" stroke={CONTORNO} strokeWidth={16} paintOrder="stroke">NEVER</text>
					</g>
				</g>
				<Placa x={540} y={1180} k={usePop(tCom, 10)} txt="JUST ONE WORD" tam={80} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tCom - 4} vol={0.4} />
			<Sfx src="boom" em={tNunca} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'PoonLim',
	pastaVoz: 'voz-poon-lim',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8],
	destaques: new Set(['133', 'days', 'alone', 'raft', '1942', 'poon', 'lim', 'submarine', 'torpedoed', 'sank', 'minutes', 'jumped', 'biscuits', 'ran', 'hook', 'flashlight', 'fish', 'rainwater', 'seabirds', 'hands', 'ships', 'plane', 'storm', 'brazil', 'rescued', 'walked', 'comment', 'never']),
};
export default ep;
