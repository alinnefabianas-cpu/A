// Episódio (EN): Roy Sullivan, atingido por raio 7 vezes (recorde mundial).
// Fontes: Guinness World Records ("most lightning strikes survived"), NOAA/NWS, Smithsonian.
// 1942 unha do dedão; 1969 sobrancelhas; 1970 ombro; 1972 e 1973 cabelo pegou fogo; 1976 tornozelo; 1977 pescando.
// Urso tentando roubar o peixe logo depois do 7º raio: amplamente relatado (tratado como "reportedly").
// Dicas aplicadas: estilo próprio do canal; 1º quadro já é a capa (tudo visível no frame 0); CTA de 1 palavra no fim.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {clamp} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'This man was struck by lightning seven times. And he survived every single one.',
	'His name was Roy Sullivan, a park ranger in Virginia.',
	'In 1942, the first strike burned off his big toenail.',
	'Then it burned off his eyebrows. Then it hit his shoulder. Then it set his hair on fire. Twice.',
	'Then it struck his ankle.',
	'And in 1977, he was hit for the seventh time, while fishing.',
	'And right after that, a bear reportedly tried to steal his fish. He fought it off with a tree branch.',
	'Today, he still holds the world record for the most lightning strikes survived.',
	'If this gave you chills, comment one word: ZAP.',
];

const ROY = {roupa: 'soldado' as const, cor: '#5a6b3a', cabelo: '#3a2a1e'};

export const Raio: React.FC<{s?: number; op?: number}> = ({s = 1, op = 1}) => (
	<g transform={`scale(${s})`} opacity={op}>
		<path d="M40 -900 L-90 -380 L30 -380 L-80 0 L170 -480 L50 -480 L160 -900Z" fill="#fff6a0" stroke="#ffd23f" strokeWidth={22} strokeLinejoin="round" />
		<path d="M40 -900 L-90 -380 L30 -380 L-80 0 L170 -480 L50 -480 L160 -900Z" fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round" />
	</g>
);

const Nuvem: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x}, ${y}) scale(${s})`}>
		{[[-120, 20, 90], [-40, -30, 110], [60, -10, 100], [140, 30, 80], [10, 40, 100]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#3a3f55" />)}
	</g>
);

const Tempestade: React.FC<{flash?: number; children?: React.ReactNode}> = ({flash = 0, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#1a1f33" />
			{[[180, 160, 1.3], [620, 120, 1.5], [980, 220, 1.2], [400, 330, 1.1]].map(([x, y, s], i) => <Nuvem key={i} x={x + Math.sin(f / 30 + i) * 20} y={y} s={s} />)}
			{Array.from({length: 30}).map((_, i) => <line key={i} x1={(i * 97 + f * 8) % 1180 - 50} y1={(i * 211 + f * 30) % 1920} x2={(i * 97 + f * 8) % 1180 - 70} y2={(i * 211 + f * 30) % 1920 + 60} stroke="#8fa8d8" strokeWidth={4} opacity={0.5} />)}
			<path d="M0 1450 Q270 1400 540 1440 T1080 1420 V1920 H0Z" fill="#2f4a2a" />
			{[80, 260, 860, 1010].map((x, i) => <g key={x} transform={`translate(${x}, 1460)`}><rect x={-14} y={-120} width={28} height={120} fill="#3a2a1e" /><path d="M-90 -100 L0 -380 L90 -100Z" fill="#1f3a22" stroke={CONTORNO} strokeWidth={6} /></g>)}
			{children}
			{flash > 0 && <rect width={W} height={H} fill="#fff" opacity={flash} />}
		</g>
	);
};

const Fogo: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}, ${s * (1 + Math.sin(f / 2) * 0.08)})`}>
			<path d="M-80 0 Q-100 -120 -30 -160 Q-40 -90 0 -80 Q-10 -180 60 -220 Q50 -120 90 -90 Q110 -40 80 0Z" fill="#ff7a1a" stroke={CONTORNO} strokeWidth={6} />
			<path d="M-40 0 Q-50 -70 0 -90 Q0 -40 30 -40 Q50 -20 40 0Z" fill="#ffd23f" />
		</g>
	);
};

// contador de raios (canto superior direito)
const Contador: React.FC<{n: number; pulso?: number}> = ({n, pulso = 0}) => (
	<g transform={`translate(880, 640) scale(${1 + pulso * 0.25})`}>
		<rect x={-150} y={-62} width={300} height={124} rx={30} fill="#000" stroke="#ffd23f" strokeWidth={8} />
		<path d="M-112 -38 L-140 6 L-118 6 L-132 42 L-92 -6 L-114 -6 L-96 -38Z" fill="#ffd23f" />
		<text x={30} y={26} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={76} fill="#fff">{n}/7</text>
	</g>
);

// flash e pulso a partir de um frame de raio
const useRaio = (t: number) => {
	const f = useCurrentFrame();
	const d = f - t;
	return {ativo: d >= 0 && d < 7, flash: d >= 0 && d < 4 ? 0.85 - d * 0.2 : 0, pulso: d >= 0 ? Math.exp(-d / 5) : 0, passou: d >= 0};
};

const Urso: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<ellipse cx={0} cy={-260} rx={170} ry={230} fill="#6b4a2a" stroke={CONTORNO} strokeWidth={10} />
		<ellipse cx={0} cy={-210} rx={100} ry={140} fill="#9a7048" />
		{[-120, 120].map((x) => <ellipse key={x} cx={x} cy={-330} rx={50} ry={110} fill="#6b4a2a" stroke={CONTORNO} strokeWidth={9} transform={`rotate(${x > 0 ? -30 : 30} ${x} -330)`} />)}
		<circle cx={0} cy={-520} r={120} fill="#6b4a2a" stroke={CONTORNO} strokeWidth={10} />
		{[-85, 85].map((x) => <circle key={x} cx={x} cy={-610} r={40} fill="#6b4a2a" stroke={CONTORNO} strokeWidth={8} />)}
		<ellipse cx={0} cy={-480} rx={55} ry={42} fill="#c9a07a" />
		<ellipse cx={0} cy={-500} rx={22} ry={16} fill={CONTORNO} />
		{[-40, 40].map((x) => <circle key={x} cx={x} cy={-555} r={12} fill={CONTORNO} />)}
	</g>
);

const Peixe: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-90 0 Q-20 -60 60 0 Q-20 60 -90 0Z" fill="#7fb3d8" stroke={CONTORNO} strokeWidth={6} />
		<path d="M60 0 L110 -40 L110 40Z" fill="#7fb3d8" stroke={CONTORNO} strokeWidth={6} />
		<circle cx={-55} cy={-8} r={7} fill={CONTORNO} />
	</g>
);

// 0 — CAPA no frame 0 + gancho: 7 raios, sobreviveu a todos
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSete = m('seven'), tSob = m('survived');
	const r = useRaio(tSete);
	const piscaRaio = f < 10 || r.ativo || (f % 40 < 3);
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 1000, 1.08]} dur={dur} soco={tSete} tremor={r.ativo ? 10 : 0}>
				<Tempestade flash={r.flash}>
					{piscaRaio && <g transform="translate(470, 1400)"><Raio s={1.25} /></g>}
					<Personagem x={540} y={2250} escala={1.35} {...ROY} expressao="assustado" bracoD={160} bracoE={160} cotoveloD={-10} cotoveloE={-10} fase={1} />
					<g transform="translate(560, 1400)"><Fogo s={1.0} /></g>
				</Tempestade>
				{/* título da capa: visível desde o frame 0 */}
				<Placa x={540} y={270} k={1} txt="STRUCK BY LIGHTNING" tam={74} rot={-4} />
				<g transform="translate(540, 470) rotate(4)">
					<rect x={-370} y={-105} width={740} height={200} rx={30} fill="#e8262f" stroke="#000" strokeWidth={12} />
					<text x={0} y={55} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={165} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">7 TIMES</text>
				</g>
				<Placa x={540} y={1690} k={usePop(tSob, 9)} txt="...AND SURVIVED!" tam={100} cor="#5aff7a" />
			</Camera>
			<Sfx src="boom" em={0} vol={0.5} />
			<Sfx src="boom" em={tSete} vol={0.5} />
			<Sfx src="ding" em={tSob} vol={0.4} />
		</>
	);
};

// 1 — Roy Sullivan, guarda-florestal na Virgínia
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNome = m('roy'), tGuarda = m('ranger');
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1100, 1.05]} dur={dur} soco={tNome}>
				<rect width={W} height={H} fill="#bfe3ff" />
				<path d="M0 1000 L250 700 L480 950 L720 650 L1080 1000 V1500 H0Z" fill="#6f9a5a" />
				<rect y={1450} width={W} height={470} fill="#5a8a3a" />
				{[100, 950].map((x) => <g key={x} transform={`translate(${x}, 1480)`}><rect x={-16} y={-140} width={32} height={140} fill="#6b4a2a" /><path d="M-110 -110 L0 -460 L110 -110Z" fill="#2f6a3a" stroke={CONTORNO} strokeWidth={6} /></g>)}
				<Personagem x={540} y={2150} escala={1.2} {...ROY} expressao="feliz" falando={f >= tNome && f < tNome + 18} bracoD={f >= tNome ? 150 : 30} cotoveloD={-20} fase={2} />
				<Placa x={540} y={260} k={usePop(tNome, 9)} txt="ROY SULLIVAN" tam={120} />
				<Placa x={540} y={450} k={usePop(tGuarda, 10)} txt="PARK RANGER" tam={84} cor="#fff" rot={4} />
				<Contador n={0} />
			</Camera>
			<Sfx src="ding" em={tNome} vol={0.4} />
			<Sfx src="pop" em={tGuarda} vol={0.35} />
		</>
	);
};

// 2 — 1942: o 1º raio queimou a unha do dedão
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1942'), tRaio = m('strike'), tUnha = m('toenail');
	const r = useRaio(tRaio);
	const voa = interpolate(f, [tUnha, tUnha + 16], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1050, 1.2]} dur={dur} soco={tRaio} tremor={r.ativo ? 9 : 0}>
				<Tempestade flash={r.flash}>
					{r.ativo && <g transform="translate(470, 1350)"><Raio s={1.2} /></g>}
					{/* pé em close */}
					<g transform="translate(540, 1500)">
						<path d="M-260 60 Q-280 -120 -120 -160 L200 -160 Q300 -150 300 -60 Q300 60 200 80 L-200 80Z" fill="#f2c9a0" stroke={CONTORNO} strokeWidth={10} />
						{[150, 210, 250, 280].map((x, i) => <circle key={x} cx={x - 40} cy={-150 + i * 8} r={30 - i * 4} fill="#f2c9a0" stroke={CONTORNO} strokeWidth={7} />)}
						<circle cx={60} cy={-170} r={48} fill="#f2c9a0" stroke={CONTORNO} strokeWidth={8} />
						<g transform={`translate(${60 + voa * 260}, ${-200 - Math.sin(voa * Math.PI) * 320 + voa * 100}) rotate(${voa * 540})`}><ellipse rx={30} ry={22} fill="#fbe8d8" stroke={CONTORNO} strokeWidth={6} /></g>
						{r.passou && [0, 1, 2].map((i) => { const t = ((f + i * 9) % 27) / 27; return <circle key={i} cx={60 + Math.sin(t * 6) * 20} cy={-220 - t * 200} r={20 + t * 30} fill="#9aa1ad" opacity={(1 - t) * 0.7} />; })}
					</g>
				</Tempestade>
				<Placa x={540} y={360} k={usePop(tAno, 10)} txt="1942" tam={130} />
				<Placa x={540} y={1060} k={usePop(tUnha, 9)} txt="BYE, TOENAIL!" tam={90} cor="#fff" />
				<Contador n={r.passou ? 1 : 0} pulso={r.pulso} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="boom" em={tRaio} vol={0.6} />
			<Sfx src="whoosh" em={tUnha} vol={0.35} />
		</>
	);
};

// 3 — sobrancelhas, ombro, cabelo pegando fogo... duas vezes
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSob = m('eyebrows'), tOmbro = m('shoulder'), tFogo = m('fire'), tDuas = m('twice');
	const rs = [useRaio(tSob), useRaio(tOmbro), useRaio(tFogo), useRaio(tDuas)];
	const n = 1 + rs.filter((r) => r.passou).length;
	const ativo = rs.find((r) => r.ativo);
	const flash = Math.max(...rs.map((r) => r.flash));
	const pulso = Math.max(...rs.map((r) => r.pulso));
	const rotulos: [number, string, string][] = [[tSob, 'EYEBROWS', '#fff'], [tOmbro, 'SHOULDER', '#fff'], [tFogo, 'HAIR ON FIRE!', '#ff9a3a'], [tDuas, 'TWICE!!', '#e8262f']];
	const atual = [...rotulos].reverse().find(([t]) => f >= t);
	const kR = usePop(atual ? atual[0] : 99999, 8);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1100, 1.05]} dur={dur} tremor={ativo ? 9 : 0} soco={tDuas}>
				<Tempestade flash={flash}>
					{ativo && <g transform="translate(470, 1380)"><Raio s={1.2} /></g>}
					<Personagem x={540} y={2240} escala={1.2} {...ROY} expressao={f >= tFogo ? 'assustado' : 'confuso'} bracoD={f >= tOmbro ? 150 : 30} bracoE={f >= tFogo ? 150 : 30} cotoveloD={-20} cotoveloE={-20} enjoo={f >= tSob ? 0.15 : 0} fase={3} />
					{f >= tFogo && <g transform="translate(560, 1490)"><Fogo s={f >= tDuas ? 1.3 : 1} /></g>}
				</Tempestade>
				{atual && <Placa x={540} y={300} k={kR} txt={atual[1]} tam={110} cor={atual[2]} corTxt={atual[2] === '#e8262f' ? '#fff' : '#000'} />}
				<Contador n={n} pulso={pulso} />
			</Camera>
			{rotulos.map(([t], i) => <Sfx key={i} src="boom" em={t} vol={0.45} />)}
		</>
	);
};

// 4 — depois atingiu o tornozelo
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const tTorn = m('ankle');
	const r = useRaio(tTorn - 4);
	return (
		<>
			<Camera de={[540, 1300, 1.2]} para={[540, 1350, 1.3]} dur={dur} tremor={r.ativo ? 9 : 0} soco={tTorn - 4}>
				<Tempestade flash={r.flash}>
					{r.ativo && <g transform="translate(560, 1700)"><Raio s={1.3} /></g>}
					<Personagem x={540} y={1980} escala={1.0} {...ROY} expressao="assustado" bracoD={150} bracoE={150} cotoveloD={-20} cotoveloE={-20} fase={4} />
				</Tempestade>
				<Placa x={540} y={760} k={usePop(tTorn, 8)} txt="ANKLE!" tam={110} />
				<Contador n={r.passou ? 6 : 5} pulso={r.pulso} />
			</Camera>
			<Sfx src="boom" em={tTorn - 4} vol={0.55} />
		</>
	);
};

// 5 — 1977: o 7º raio, pescando
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1977'), tSet = m('seventh'), tPesca = m('fishing');
	const r = useRaio(tSet);
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1150, 1.0]} dur={dur} tremor={r.ativo ? 11 : 0} soco={tSet}>
				<Tempestade flash={r.flash}>
					<path d={`M0 1560 Q270 ${1540 + Math.sin(f / 8) * 8} 540 1560 T1080 1560 V1920 H0Z`} fill="#2f5f8a" />
					{r.ativo && <g transform="translate(320, 1300)"><Raio s={1.2} /></g>}
					<Personagem x={330} y={2020} escala={1.0} {...ROY} expressao={r.passou ? 'assustado' : 'feliz'} bracoD={120} cotoveloD={-30} itemD={<g transform="rotate(200)"><line x1={0} y1={0} x2={0} y2={420} stroke="#6b4a2a" strokeWidth={10} /></g>} fase={5} />
					<path d={`M560 900 Q620 1200 700 ${1560}`} stroke="#ddd" strokeWidth={3} fill="none" opacity={f >= tPesca ? 1 : 0} />
				</Tempestade>
				<Placa x={540} y={260} k={usePop(tAno, 10)} txt="1977" tam={140} />
				<Placa x={600} y={440} k={usePop(tSet + 2, 9)} txt="NUMBER 7!" tam={90} cor="#e8262f" corTxt="#fff" rot={4} />
				<Contador n={r.passou ? 7 : 6} pulso={r.pulso} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="boom" em={tSet} vol={0.65} />
		</>
	);
};

// 6 — logo depois, um urso tentou roubar o peixe; ele espantou com um galho
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tUrso = m('bear'), tPeixe = m('fish'), tGalho = m('branch');
	const xu = interpolate(f, [tUrso - 6, tPeixe], [1300, 820], {...clamp, easing: Easing.out(Easing.cubic)});
	const foge = interpolate(f, [tGalho + 4, tGalho + 24], [0, 1], clamp);
	const bate = f >= tGalho - 4 && f < tGalho + 8;
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1150, 1.0]} dur={dur} soco={tGalho} tremor={bate ? 6 : 0}>
				<rect width={W} height={H} fill="#8fa8c8" />
				<path d="M0 1450 Q270 1400 540 1440 T1080 1420 V1920 H0Z" fill="#3f6a3a" />
				<g transform={`translate(${xu + foge * 600}, 1600) scale(${foge > 0 ? -1 : 1}, 1)`}><Urso s={0.9} /></g>
				<Personagem x={330} y={2040} escala={1.0} {...ROY} expressao={f >= tGalho ? 'bravo' : 'assustado'} bracoD={bate ? 170 : 120} cotoveloD={bate ? 10 : -30} itemD={f >= tGalho - 6 ? <g transform={`rotate(${bate ? 140 : 180})`}><rect x={-12} y={0} width={24} height={300} rx={10} fill="#6b4a2a" stroke={CONTORNO} strokeWidth={5} /></g> : <g transform="rotate(180) translate(0, -40)"><Peixe s={0.8} /></g>} bracoE={40} fase={6} />
				<Placa x={540} y={260} k={usePop(tUrso, 9)} txt="A BEAR?!" tam={130} />
				<Placa x={540} y={450} k={usePop(tGalho, 9)} txt="BONK!" tam={110} cor="#fff" rot={4} />
				<Contador n={7} />
			</Camera>
			<Sfx src="uhoh" em={tUrso} vol={0.45} />
			<Sfx src="boom" em={tGalho} vol={0.4} />
			<Sfx src="whoosh" em={tGalho + 4} vol={0.35} />
		</>
	);
};

// 7 — recorde mundial
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRec = m('record');
	const kT = usePop(tRec - 6, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.0]} dur={dur} soco={tRec}>
				<rect width={W} height={H} fill="#ffe8b0" />
				<circle cx={540} cy={800} r={520} fill="#fff6c0" />
				{Array.from({length: 16}).map((_, i) => <path key={i} d="M540 800 L560 260 L520 260Z" fill="#ffd23f" opacity={0.5} transform={`rotate(${i * 22.5 + f} 540 800)`} />)}
				<g transform={`translate(540, 900) scale(${kT})`}>
					<path d="M-150 -300 H150 V-200 Q150 0 0 40 Q-150 0 -150 -200Z" fill="#e8b830" stroke={CONTORNO} strokeWidth={10} />
					<path d="M-150 -260 Q-260 -260 -240 -160 Q-220 -80 -140 -90 M150 -260 Q260 -260 240 -160 Q220 -80 140 -90" stroke={CONTORNO} strokeWidth={14} fill="none" />
					<rect x={-30} y={40} width={60} height={110} fill="#e8b830" stroke={CONTORNO} strokeWidth={8} />
					<rect x={-130} y={150} width={260} height={70} rx={10} fill="#8a5a2a" stroke={CONTORNO} strokeWidth={8} />
					<text x={0} y={-130} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={120} fill="#fff" stroke={CONTORNO} strokeWidth={10} paintOrder="stroke">7</text>
				</g>
				<Placa x={540} y={260} k={usePop(tRec, 9)} txt="WORLD RECORD" tam={120} />
				<Placa x={540} y={1650} k={usePop(tRec + 8, 10)} txt="MOST STRIKES SURVIVED" tam={70} cor="#fff" />
			</Camera>
			<Sfx src="ding" em={tRec} vol={0.45} />
		</>
	);
};

// 8 — CTA de uma palavra: comente ZAP
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCom = m('comment'), tZap = m('zap');
	const kB = usePop(tCom - 4, 10), kZ = usePop(tZap, 7);
	const r = useRaio(tZap);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tZap} tremor={r.ativo ? 8 : 0}>
				<Tempestade flash={r.flash}>
					{r.ativo && <g transform="translate(470, 1100)"><Raio s={1.0} /></g>}
				</Tempestade>
				<g transform={`translate(540, 900) scale(${kB})`}>
					<path d="M-400 -220 H400 Q440 -220 440 -180 V160 Q440 200 400 200 H-160 L-260 300 L-240 200 H-400 Q-440 200 -440 160 V-180 Q-440 -220 -400 -220Z" fill="#fff" stroke={CONTORNO} strokeWidth={12} />
					<text x={0} y={-100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#5a6070">COMMENT</text>
					<g transform={`scale(${kZ * (1 + 0.06 * Math.sin(f / 4))})`}>
						<text x={0} y={110} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={230} fill="#ffd23f" stroke={CONTORNO} strokeWidth={16} paintOrder="stroke">ZAP!</text>
					</g>
				</g>
				<Placa x={540} y={1620} k={usePop(tCom, 10)} txt="JUST ONE WORD" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tCom - 4} vol={0.4} />
			<Sfx src="boom" em={tZap} vol={0.55} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'RoySullivan',
	pastaVoz: 'voz-roy-sullivan',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8],
	destaques: new Set(['lightning', 'seven', 'survived', 'roy', 'sullivan', 'ranger', '1942', 'toenail', 'eyebrows', 'shoulder', 'fire', 'twice', 'ankle', '1977', 'seventh', 'fishing', 'bear', 'fish', 'branch', 'record', 'comment', 'zap']),
};
export default ep;
