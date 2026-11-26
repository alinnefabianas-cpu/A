// Episódio (EN): Violet Jessop, a "Miss Unsinkable" — sobreviveu aos três navios irmãos da classe Olympic.
// Fontes: Smithsonian Magazine, History.com, Encyclopedia Titanica, memórias de Violet Jessop ("Titanic Survivor", 1997).
// Olympic x HMS Hawke (set/1911, sem mortes); Titanic (abr/1912, bote salva-vidas 16); Britannic (nov/1916, navio-hospital,
// mina): bote puxado em direção às hélices, ela pulou (relato dela). Apelido "Miss Unsinkable" usado pela imprensa.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Fundo, clamp} from '../comum';
import voz from './voz.json';

export const FALAS = [
	"This woman survived the Titanic. And that wasn't even the craziest part.",
	'Her name was Violet Jessop, and she worked on ships as a stewardess.',
	"In 1911, she was on the Olympic, Titanic's sister ship, when it collided with a warship.",
	'Everyone survived. A year later, she was on the Titanic when it hit the iceberg. She escaped on a lifeboat.',
	'Then, in 1916, she was on the Britannic, the third sister ship, when it hit a mine and sank.',
	'Her lifeboat got pulled toward the spinning propellers, so she jumped into the sea.',
	'She survived that too. People started calling her Miss Unsinkable.',
];

const VIOLET = {roupa: 'comissaria' as const, cor: '#2b3d6b', cabelo: '#3a2a1e'};

// transatlântico de 4 chaminés; origem no centro da linha d'água; hospital = branco com faixa verde e cruz
export const Navio: React.FC<{s?: number; hospital?: boolean; luzes?: boolean}> = ({s = 1, hospital, luzes}) => {
	const casco = hospital ? '#f4f4f0' : '#1d1d24';
	return (
		<g transform={`scale(${s})`}>
			<path d="M-520 -40 L-470 120 L470 120 L540 -60 Z" fill={casco} stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<rect x={-480} y={70} width={950} height={50} fill="#a8322a" />
			{hospital && <rect x={-500} y={0} width={1010} height={26} fill="#3c8a4a" />}
			<rect x={-430} y={-120} width={860} height={80} fill="#f4f4f0" stroke={CONTORNO} strokeWidth={8} />
			<rect x={-360} y={-170} width={700} height={50} fill="#f4f4f0" stroke={CONTORNO} strokeWidth={7} />
			{Array.from({length: 18}).map((_, i) => <circle key={i} cx={-400 + i * 46} cy={-80} r={9} fill={luzes ? '#ffd23f' : '#3a4a6a'} />)}
			{[-260, -90, 80, 250].map((x) => (
				<g key={x}>
					<path d={`M${x - 40} -170 L${x - 30} -360 L${x + 50} -360 L${x + 40} -170Z`} fill={hospital ? '#e8b04a' : '#e8a23a'} stroke={CONTORNO} strokeWidth={8} />
					<rect x={x - 32} y={-360} width={82} height={36} fill="#1d1d24" />
				</g>
			))}
			{hospital && <g transform="translate(-60, 60)"><rect x={-50} y={-14} width={100} height={28} fill="#e8262f" /><rect x={-14} y={-50} width={28} height={100} fill="#e8262f" /></g>}
		</g>
	);
};

const NavioGuerra: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-420 -20 L-380 90 L380 90 L460 -30Z" fill="#7a8290" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
		<rect x={-260} y={-90} width={380} height={70} fill="#8a92a0" stroke={CONTORNO} strokeWidth={7} />
		<rect x={-120} y={-170} width={70} height={80} fill="#6a7280" stroke={CONTORNO} strokeWidth={6} />
		<rect x={160} y={-60} width={140} height={40} fill="#6a7280" stroke={CONTORNO} strokeWidth={6} />
		<rect x={290} y={-50} width={120} height={14} fill="#4a5260" />
	</g>
);

const Mar: React.FC<{noite?: boolean; y?: number; children?: React.ReactNode; frente?: React.ReactNode}> = ({noite, y = 1250, children, frente}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill={noite ? '#0d1440' : '#9fd0f0'} />
			{noite && Array.from({length: 40}).map((_, i) => <circle key={i} cx={(i * 263) % 1080} cy={(i * 97) % 1100} r={3 + (i % 3)} fill="#fff" opacity={0.7} />)}
			{children}
			<path d={`M0 ${y} Q270 ${y - 20 + Math.sin(f / 8) * 10} 540 ${y} T1080 ${y} V1920 H0Z`} fill={noite ? '#16306a' : '#2f7fc0'} />
			{Array.from({length: 7}).map((_, i) => <path key={i} d={`M${(i * 170 + f * 2) % 1180 - 100} ${y + 80 + (i % 3) * 140} q30 -16 60 0`} stroke="rgba(255,255,255,0.4)" strokeWidth={6} fill="none" />)}
			{frente}
		</g>
	);
};

const Bote: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<clipPath id="boteClip"><rect x={-400} y={-900} width={800} height={880} /></clipPath>
		<g clipPath="url(#boteClip)">{children}</g>
		<path d="M-220 -40 L220 -40 L170 60 L-170 60Z" fill="#f4f4f0" stroke={CONTORNO} strokeWidth={8} />
		<rect x={-220} y={-50} width={440} height={20} fill="#c8623a" stroke={CONTORNO} strokeWidth={5} />
	</g>
);

const Iceberg: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-220 60 L-160 -120 L-80 -60 L0 -260 L90 -90 L150 -150 L230 60Z" fill="#eaf6ff" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
		<path d="M0 -260 L20 -60 L90 -90" fill="#bfe0f2" />
	</g>
);

const Mina: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		{Array.from({length: 8}).map((_, i) => <rect key={i} x={-10} y={-100} width={20} height={40} fill="#3a3f4a" transform={`rotate(${i * 45})`} />)}
		<circle r={70} fill="#2a2e38" stroke={CONTORNO} strokeWidth={8} />
		<line x1={0} y1={70} x2={0} y2={260} stroke="#3a3f4a" strokeWidth={6} />
	</g>
);

const Helice: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) rotate(${f * 18})`}>
			{[0, 120, 240].map((a) => <path key={a} d="M0 0 Q60 -120 0 -220 Q-60 -120 0 0Z" fill="#c9a227" stroke={CONTORNO} strokeWidth={8} transform={`rotate(${a})`} />)}
			<circle r={40} fill="#8a6a2a" stroke={CONTORNO} strokeWidth={8} />
		</g>
	);
};

const Explosao: React.FC<{k: number}> = ({k}) => (
	<g transform={`scale(${k})`}>
		{Array.from({length: 12}).map((_, i) => <path key={i} d="M0 0 L40 -260 L-40 -260Z" fill={i % 2 ? '#ffb000' : '#e8392f'} transform={`rotate(${i * 30})`} />)}
		<circle r={130} fill="#fff1a8" />
	</g>
);

// 0 — gancho: sobreviveu ao Titanic... e isso nem foi o mais louco
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTit = m('titanic'), tLouco = m('craziest');
	const ang = interpolate(f, [0, dur], [8, 18], clamp);
	const congela = f >= tLouco;
	return (
		<>
			<Camera de={[540, 1100, 1.25]} para={[540, 1100, 1.05]} dur={dur} soco={tLouco} tremor={congela ? 0 : 2}>
				<Mar noite frente={<g transform={`translate(540, ${1660 + Math.sin(f / 8) * 8})`}><Bote><Personagem x={0} y={200} escala={0.75} {...VIOLET} expressao={congela ? 'confuso' : 'assustado'} olhar={-1} bracoD={congela ? 150 : 30} cotoveloD={-20} fase={1} /></Bote></g>}>
					<g transform={`translate(560, ${1240 + ang * 6}) rotate(${ang})`}><Navio s={0.95} luzes /></g>
				</Mar>
				{congela && <rect width={W} height={H} fill="#000" opacity={0.35} />}
				<Placa x={540} y={300} k={usePop(tTit, 10)} txt="TITANIC SURVIVOR" tam={90} />
				<Placa x={540} y={520} k={usePop(tLouco, 8)} txt="NOT EVEN THE CRAZIEST PART!" tam={60} cor="#e8262f" corTxt="#fff" rot={4} />
				{congela && f < tLouco + 6 && <LinhasImpacto op={0.4} />}
			</Camera>
			<Sfx src="boom" em={tTit} vol={0.4} />
			<Sfx src="uhoh" em={tLouco} vol={0.5} />
		</>
	);
};

// 1 — Violet Jessop, comissária de bordo
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNome = m('violet'), tComis = m('stewardess');
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 1000, 1.05]} dur={dur} soco={tNome}>
				<Fundo cor="#cfe3f2" />
				<g transform="translate(540, 560) scale(0.55)" opacity={0.5}><Navio /></g>
				<Personagem x={540} y={2200} escala={1.25} {...VIOLET} expressao="feliz" falando={f >= tNome && f < tNome + 20} bracoD={f >= tNome ? 150 : 30} cotoveloD={-20} fase={2} />
				<Placa x={540} y={260} k={usePop(tNome, 9)} txt="VIOLET JESSOP" tam={110} />
				<Placa x={540} y={1650} k={usePop(tComis, 10)} txt="STEWARDESS" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="ding" em={tNome} vol={0.4} />
			<Sfx src="pop" em={tComis} vol={0.35} />
		</>
	);
};

// 2 — 1911: Olympic colide com um navio de guerra
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1911'), tOly = m('olympic'), tBate = m('collided');
	const xg = interpolate(f, [tBate - 20, tBate], [1500, 900], {...clamp, easing: Easing.in(Easing.quad)});
	const bateu = f >= tBate;
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[600, 1150, 1.0]} dur={dur} soco={tBate} tremor={bateu && f < tBate + 14 ? 9 : 0}>
				<Mar>
					<g transform={`translate(380, ${1240 + (bateu ? Math.sin(f) * 4 : 0)}) rotate(${bateu ? 3 : 0})`}><Navio s={0.7} /></g>
					<g transform={`translate(${xg}, 1270)`}><NavioGuerra s={0.6} /></g>
					{bateu && f < tBate + 16 && <g transform="translate(720, 1240)"><Explosao k={interpolate(f, [tBate, tBate + 8], [0.3, 0.9], clamp)} /></g>}
				</Mar>
				<Placa x={540} y={280} k={usePop(tAno, 10)} txt="1911" tam={140} />
				<Placa x={540} y={480} k={usePop(tOly, 10)} txt="OLYMPIC" tam={100} cor="#fff" rot={4} />
				<Placa x={540} y={1650} k={usePop(tBate + 2, 9)} txt="CRASH!" tam={130} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tOly} vol={0.35} />
			<Sfx src="boom" em={tBate} vol={0.6} />
		</>
	);
};

// 3 — todos sobreviveram; um ano depois, o Titanic e o iceberg; escapou num bote
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTodos = m('survived'), tTit = m('titanic'), tIce = m('iceberg'), tBote = m('lifeboat');
	const fase2 = f >= tTit - 6;
	const xn = interpolate(f, [tTit - 6, tIce], [-100, 330], clamp);
	const bateu = f >= tIce;
	const ang = bateu ? interpolate(f, [tIce, dur], [0, 14], clamp) : 0;
	const kB = usePop(tBote, 10), kTodos = usePop(tTodos, 9), kTit = usePop(tTit, 10);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1150, 1.0]} dur={dur} soco={tIce} tremor={bateu && f < tIce + 12 ? 8 : 0}>
				{!fase2 ? (
					<g>
						<Fundo cor="#d8f0d0" />
						<g transform="translate(540, 900) scale(0.8)"><Navio /></g>
					</g>
				) : (
					<Mar noite frente={kB > 0 ? <g transform={`translate(760, ${1660 + Math.sin(f / 8) * 8}) scale(${kB * 0.9})`}><Bote><Personagem x={0} y={200} escala={0.7} {...VIOLET} expressao="assustado" olhar={-1} fase={3} /></Bote></g> : null}>
						<g transform={`translate(860, 1250)`}><Iceberg s={1.1} /></g>
						<g transform={`translate(${xn}, ${1240 + ang * 5}) rotate(${ang})`}><Navio s={0.75} luzes /></g>
					</Mar>
				)}
				{!fase2 && <Placa x={540} y={1450} k={kTodos} txt="EVERYONE SURVIVED ✓" tam={80} cor="#5aff7a" />}
				{fase2 && <Placa x={540} y={280} k={kTit} txt="1912: TITANIC" tam={110} />}
			</Camera>
			<Sfx src="ding" em={tTodos} vol={0.35} />
			<Sfx src="whoosh" em={tTit - 6} vol={0.35} />
			<Sfx src="boom" em={tIce} vol={0.55} />
			<Sfx src="pop" em={tBote} vol={0.35} />
		</>
	);
};

// 4 — 1916: Britannic, o terceiro irmão, bate numa mina e afunda
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1916'), tBrit = m('britannic'), tMina = m('mine'), tAfunda = m('sank');
	const bum = f >= tMina;
	const afunda = interpolate(f, [tAfunda - 6, dur], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1200, 1.0]} dur={dur} soco={tMina} tremor={bum && f < tMina + 16 ? 10 : 0}>
				<Mar frente={!bum ? <g transform={`translate(560, ${1500 + Math.sin(f / 6) * 10})`}><Mina s={0.8} /></g> : null}>
					<g transform={`translate(540, ${1240 + afunda * 260}) rotate(${-afunda * 16})`}><Navio s={0.75} hospital /></g>
				</Mar>
				{bum && f < tMina + 18 && <g transform="translate(560, 1300)"><Explosao k={interpolate(f, [tMina, tMina + 8], [0.3, 1.1], clamp)} /></g>}
				<Placa x={540} y={280} k={usePop(tAno, 10)} txt="1916" tam={140} />
				<Placa x={540} y={480} k={usePop(tBrit, 10)} txt="BRITANNIC" tam={100} cor="#fff" rot={4} />
				<Placa x={540} y={1700} k={usePop(tAfunda, 9)} txt="SINKING!" tam={120} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tBrit} vol={0.35} />
			<Sfx src="boom" em={tMina} vol={0.65} />
			<Sfx src="whoosh" em={tAfunda} vol={0.35} />
		</>
	);
};

// 5 — o bote foi puxado para as hélices; ela pulou no mar
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tHel = m('propellers'), tPula = m('jumped');
	const xb = interpolate(f, [0, tPula], [200, 560], {...clamp, easing: Easing.in(Easing.quad)});
	const pulo = interpolate(f, [tPula, tPula + 16], [0, 1], clamp);
	const vx = xb - pulo * 260, vy = 1440 - Math.sin(pulo * Math.PI) * 300 + pulo * 260;
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1250, 1.05]} dur={dur} soco={tPula} tremor={f >= tHel ? 4 : 0}>
				<Mar y={1300} frente={
					<g>
						<g transform={`translate(${xb}, ${1640 + Math.sin(f / 5) * 8}) rotate(${Math.sin(f / 3) * 4})`}><Bote>{pulo === 0 && <Personagem x={0} y={200} escala={0.7} {...VIOLET} expressao="assustado" olhar={1} bracoD={150} bracoE={150} cotoveloD={-20} cotoveloE={-20} fase={4} />}</Bote></g>
						{pulo > 0 && pulo < 1 && <g transform={`translate(${vx}, ${vy}) rotate(${-pulo * 120})`}><Personagem x={0} y={300} escala={0.7} {...VIOLET} expressao="assustado" bracoD={170} bracoE={170} fase={4} /></g>}
						{pulo >= 1 && <g>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${vx - 60 + i * 30} 1700 l${(i - 2) * 14} ${-60 - (f - tPula - 16) * 3}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={Math.max(0, 1 - (f - tPula - 16) / 20)} />)}</g>}
					</g>
				}>
					<rect x={760} y={500} width={400} height={900} fill="#f4f4f0" stroke={CONTORNO} strokeWidth={9} />
					<rect x={760} y={1150} width={400} height={30} fill="#3c8a4a" />
				</Mar>
				<g transform={`translate(880, 1600) scale(${usePop(tHel - 6, 12)})`}><Helice s={1.2} /></g>
				<Placa x={540} y={300} k={usePop(tHel, 9)} txt="PROPELLERS!" tam={110} cor="#e8262f" corTxt="#fff" />
				<Placa x={400} y={480} k={usePop(tPula, 9)} txt="JUMP!" tam={110} rot={-6} />
			</Camera>
			<Sfx src="uhoh" em={tHel} vol={0.45} />
			<Sfx src="whoosh" em={tPula} vol={0.45} />
			<Sfx src="boom" em={tPula + 16} vol={0.35} />
		</>
	);
};

// 6 — sobreviveu de novo: "Miss Unsinkable"
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSob = m('survived'), tMiss = m('unsinkable');
	const nomes = ['OLYMPIC', 'TITANIC', 'BRITANNIC'];
	const ks = nomes.map((_, i) => usePop(tSob + i * 6, 10));
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.0]} dur={dur} soco={tMiss}>
				<Fundo cor="#ffe8b0" />
				{nomes.map((n, i) => ks[i] > 0 && (
					<g key={n} transform={`translate(540, ${360 + i * 150}) scale(${ks[i]})`}>
						<rect x={-330} y={-56} width={660} height={112} rx={24} fill="#fff" stroke={CONTORNO} strokeWidth={8} />
						<circle cx={-260} cy={0} r={38} fill="#3fbf5a" stroke={CONTORNO} strokeWidth={6} />
						<path d="M-280 0 l14 16 l28 -32" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
						<text x={40} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={62} fill={CONTORNO}>{n}</text>
					</g>
				))}
				<Personagem x={540} y={2180} escala={1.1} {...VIOLET} expressao="feliz" bracoD={f >= tMiss ? 160 : 40} bracoE={f >= tMiss ? 160 : 40} cotoveloD={-10} cotoveloE={-10} fase={5} />
				<Placa x={540} y={980} k={usePop(tMiss, 8)} txt="MISS UNSINKABLE" tam={100} />
			</Camera>
			{nomes.map((_, i) => <Sfx key={i} src="ding" em={tSob + i * 6} vol={0.3} />)}
			<Sfx src="boom" em={tMiss} vol={0.45} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'VioletJessop',
	pastaVoz: 'voz-violet-jessop',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6],
	destaques: new Set(['titanic', 'craziest', 'violet', 'jessop', 'stewardess', '1911', 'olympic', 'collided', 'warship', 'survived', 'iceberg', 'lifeboat', '1916', 'britannic', 'mine', 'sank', 'propellers', 'jumped', 'unsinkable']),
};
export default ep;
