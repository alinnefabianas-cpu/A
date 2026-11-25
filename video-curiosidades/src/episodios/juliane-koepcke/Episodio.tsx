// Episódio (EN): Juliane Koepcke caiu ~3 km de um avião e sobreviveu 11 dias na Amazônia (1971).
// Fontes: BBC (entrevistas), "When I Fell From the Sky" (memórias, 2011), "Wings of Hope" (Herzog, 2000), Smithsonian.
// 24/dez/1971, LANSA 508, raio numa tempestade, avião se partiu no ar; caiu ~3.000 m presa à fileira de poltronas;
// única sobrevivente; clavícula quebrada, uma sandália; pais biólogos: seguir a água rio abaixo; ~11 dias até ser achada.
// Dicas aplicadas: estilo próprio (altímetro + contador de dias); 1º quadro = capa; CTA de 1 palavra no fim.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {Aviao, H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {clamp} from '../comum';
import {Raio} from '../roy-sullivan/Episodio';
import voz from './voz.json';

export const FALAS = [
	'This girl fell two miles out of the sky. And survived.',
	'On Christmas Eve, 1971, 17-year-old Juliane Koepcke was flying over the Amazon rainforest.',
	'Lightning hit the plane, and it broke apart in midair.',
	'She fell about three thousand meters, still strapped to her seat, and crashed into the jungle trees.',
	'She was the only survivor. Alone, with a broken collarbone and just one shoe.',
	"But her parents were biologists, and they taught her one trick: if you're lost, follow the water downstream.",
	'So she walked and waded through the jungle, day after day.',
	'After eleven days, she reached a hut, and workers found her there. She had made it.',
	"If she's a legend, comment one word: LEGEND.",
];

const JULIANE = {roupa: 'camponesa' as const, cor: '#f2efe2', cabelo: '#c9a227'};

// Juliane presa à poltrona (origem no centro do assento)
const NaPoltrona: React.FC<{expressao?: 'assustado' | 'feliz' | 'confuso'}> = ({expressao = 'assustado'}) => (
	<g>
		<rect x={-170} y={-430} width={340} height={470} rx={40} fill="#3b5bb5" stroke={CONTORNO} strokeWidth={10} />
		<rect x={-200} y={20} width={400} height={110} rx={30} fill="#2f4a96" stroke={CONTORNO} strokeWidth={10} />
		<Personagem x={0} y={330} escala={0.75} {...JULIANE} expressao={expressao} bracoD={150} bracoE={150} cotoveloD={-20} cotoveloE={-20} fase={1} />
		<rect x={-150} y={-20} width={300} height={26} rx={8} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={6} />
		<rect x={-24} y={-26} width={48} height={38} rx={6} fill="#c9cfd8" stroke={CONTORNO} strokeWidth={5} />
	</g>
);

const Ceu: React.FC<{escuro?: boolean; children?: React.ReactNode; vento?: boolean}> = ({escuro, children, vento}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceuJK" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={escuro ? '#1a1f33' : '#5aa8e8'} />
					<stop offset="1" stopColor={escuro ? '#3a4a6a' : '#cfeaff'} />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuJK)" />
			{[[160, 300], [820, 520], [380, 900], [900, 1300], [200, 1600]].map(([x, y], i) => {
				const yy = vento ? ((y - f * 40) % 2300 + 2300) % 2300 - 200 : y;
				return <g key={i} transform={`translate(${x}, ${yy})`} opacity={escuro ? 0.5 : 0.9}>{[[-80, 0, 70], [0, -30, 90], [80, 0, 70]].map(([cx, cy, r], k) => <circle key={k} cx={cx} cy={cy} r={r} fill={escuro ? '#4a5470' : '#fff'} />)}</g>;
			})}
			{vento && Array.from({length: 14}).map((_, i) => { const y = ((i * 173 - f * 60) % 1920 + 1920) % 1920; return <line key={i} x1={(i * 79) % 1080} y1={y} x2={(i * 79) % 1080} y2={y + 160} stroke="#fff" strokeWidth={6} opacity={0.6} />; })}
			{children}
		</g>
	);
};

const Selva: React.FC<{children?: React.ReactNode; rio?: boolean}> = ({children, rio}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#2f5a2a" />
			{Array.from({length: 14}).map((_, i) => <g key={i} transform={`translate(${(i * 157) % 1200 - 60}, ${700 + (i % 4) * 60})`}><rect x={-20} y={0} width={40} height={900} fill="#4a3320" /><circle cx={0} cy={0} r={150} fill={['#2a6a2f', '#3a7a35', '#24552a'][i % 3]} stroke={CONTORNO} strokeWidth={5} /></g>)}
			{Array.from({length: 10}).map((_, i) => <path key={i} d={`M${(i * 120) % 1080} 1300 q 40 -120 100 -160`} stroke="#5aaa4a" strokeWidth={14} fill="none" />)}
			{rio ? <path d={`M-40 1500 Q 300 ${1440 + Math.sin(f / 10) * 10} 540 1500 T 1120 1480 V1920 H-40Z`} fill="#6a8a9a" /> : <rect y={1500} width={W} height={420} fill="#3f2e1e" />}
			{rio && Array.from({length: 6}).map((_, i) => <path key={i} d={`M${((i * 190 + f * 4) % 1180) - 100} ${1600 + (i % 3) * 90} q30 -14 60 0`} stroke="rgba(255,255,255,0.5)" strokeWidth={6} fill="none" />)}
			{children}
		</g>
	);
};

const Altimetro: React.FC<{m: number}> = ({m}) => (
	<g transform="translate(900, 900)">
		<rect x={-140} y={-300} width={280} height={600} rx={30} fill="#000" stroke="#ffd23f" strokeWidth={8} opacity={0.85} />
		<rect x={-40} y={-240} width={80} height={420} rx={20} fill="#333" />
		<rect x={-40} y={180 - 420 * (m / 3000)} width={80} height={420 * (m / 3000)} rx={20} fill={m < 600 ? '#e8262f' : '#ffd23f'} />
		<text x={0} y={260} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#fff">{Math.round(m).toLocaleString('en-US')} m</text>
	</g>
);

const ContadorDia: React.FC<{d: number; pulso?: number}> = ({d, pulso = 0}) => (
	<g transform={`translate(760, 640) scale(${1 + pulso * 0.2})`}>
		<rect x={-180} y={-66} width={360} height={132} rx={30} fill="#000" stroke="#ffd23f" strokeWidth={8} />
		<text x={0} y={26} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={72} fill="#fff">DAY {d}/11</text>
	</g>
);

// 0 — CAPA no frame 0 + gancho
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSob = m('survived');
	const alt = interpolate(f, [0, dur], [3000, 1800], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 1000, 1.08]} dur={dur} soco={tSob}>
				<Ceu vento>
					<g transform={`translate(430, ${1380 + Math.sin(f / 4) * 14}) rotate(${-16 + Math.sin(f / 6) * 6}) scale(1.1)`}><NaPoltrona /></g>
					<Altimetro m={alt} />
				</Ceu>
				<Placa x={540} y={260} k={1} txt="SHE FELL" tam={110} rot={-4} />
				<g transform="translate(540, 470) rotate(4)">
					<rect x={-370} y={-105} width={740} height={200} rx={30} fill="#e8262f" stroke="#000" strokeWidth={12} />
					<text x={0} y={55} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={160} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">2 MILES</text>
				</g>
				<Placa x={540} y={1720} k={usePop(tSob, 9)} txt="...AND SURVIVED!" tam={100} cor="#5aff7a" />
			</Camera>
			<Sfx src="whoosh" em={0} vol={0.5} />
			<Sfx src="ding" em={tSob} vol={0.45} />
		</>
	);
};

// 1 — véspera de Natal de 1971, Juliane (17) sobrevoando a Amazônia
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNatal = m('christmas'), tJul = m('juliane'), tAmaz = m('amazon');
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1050, 1.0]} dur={dur} soco={tJul}>
				<Ceu>
					<rect y={1300} width={W} height={620} fill="#2f6a2f" />
					{Array.from({length: 16}).map((_, i) => <circle key={i} cx={(i * 83) % 1100} cy={1320 + (i % 3) * 50} r={90} fill={['#2a6a2f', '#3a7a35'][i % 2]} />)}
					<g transform={`translate(${interpolate(f, [0, dur], [200, 900])}, 900) scale(1.1)`}><Aviao /></g>
				</Ceu>
				<Placa x={540} y={260} k={usePop(tNatal, 10)} txt="DEC 24, 1971" tam={110} />
				<Placa x={540} y={450} k={usePop(tJul, 10)} txt="JULIANE, 17" tam={90} cor="#fff" rot={4} />
				<Placa x={540} y={1700} k={usePop(tAmaz, 10)} txt="AMAZON RAINFOREST" tam={76} cor="#7fe08a" />
			</Camera>
			<Sfx src="pop" em={tNatal} vol={0.4} />
			<Sfx src="ding" em={tJul} vol={0.4} />
			<Sfx src="pop" em={tAmaz} vol={0.35} />
		</>
	);
};

// 2 — raio atinge o avião, que se parte no ar
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRaio = m('lightning'), tParte = m('broke');
	const d = f - tRaio;
	const flash = d >= 0 && d < 4 ? 0.85 - d * 0.2 : 0;
	const sep = interpolate(f, [tParte, tParte + 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tRaio} tremor={d >= 0 && d < 10 ? 10 : f >= tParte ? 5 : 0}>
				<Ceu escuro>
					{d >= 0 && d < 8 && <g transform="translate(500, 900)"><Raio s={1.0} /></g>}
					{sep === 0 ? (
						<g transform="translate(540, 1000) scale(1.1)"><Aviao alarme={d >= 0} /></g>
					) : (
						<g>
							<clipPath id="metadeA"><rect x={-1000} y={-1000} width={1000} height={2000} /></clipPath>
							<clipPath id="metadeB"><rect x={0} y={-1000} width={1000} height={2000} /></clipPath>
							<g transform={`translate(${540 - sep * 140}, ${1000 + sep * 200}) rotate(${-sep * 25})`}><g clipPath="url(#metadeA)"><g transform="scale(1.1)"><Aviao alarme /></g></g></g>
							<g transform={`translate(${540 + sep * 160}, ${1000 + sep * 260}) rotate(${sep * 30})`}><g clipPath="url(#metadeB)"><g transform="scale(1.1)"><Aviao alarme /></g></g></g>
						</g>
					)}
					{flash > 0 && <rect width={W} height={H} fill="#fff" opacity={flash} />}
				</Ceu>
				<Placa x={540} y={280} k={usePop(tRaio, 9)} txt="LIGHTNING!" tam={120} />
				<Placa x={540} y={1650} k={usePop(tParte, 9)} txt="BROKE APART!" tam={110} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="boom" em={tRaio} vol={0.6} />
			<Sfx src="boom" em={tParte} vol={0.5} />
		</>
	);
};

// 3 — caiu ~3.000 m presa à poltrona e bateu nas árvores
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tArv = m('trees'), tPolt = m('seat');
	const alt = interpolate(f, [0, tArv], [3000, 0], clamp);
	const bateu = f >= tArv;
	return (
		<>
			<Camera de={[540, 960, 1.05]} para={[540, 1000, 1.1]} dur={dur} soco={tArv} tremor={bateu && f < tArv + 14 ? 10 : 3}>
				{!bateu ? (
					<Ceu vento>
						<g transform={`translate(430, ${1300 + Math.sin(f / 4) * 14}) rotate(${f * 4}) scale(1.0)`}><NaPoltrona /></g>
						<Altimetro m={alt} />
					</Ceu>
				) : (
					<Selva>
						{Array.from({length: 12}).map((_, i) => { const t = Math.min(1, (f - tArv) / 14); const a = (i / 12) * Math.PI * 2; return <ellipse key={i} cx={540 + Math.cos(a) * t * 360} cy={1000 + Math.sin(a) * t * 300} rx={40} ry={20} fill="#5aaa4a" opacity={1 - t * 0.6} transform={`rotate(${i * 30} ${540 + Math.cos(a) * t * 360} ${1000 + Math.sin(a) * t * 300})`} />; })}
						<g transform="translate(540, 1120) rotate(-20) scale(0.9)"><NaPoltrona expressao="confuso" /></g>
						<Altimetro m={0} />
					</Selva>
				)}
				<Placa x={540} y={260} k={usePop(4, 10)} txt="3,000 METERS" tam={110} />
				<Placa x={540} y={450} k={usePop(tPolt, 10)} txt="STILL IN HER SEAT" tam={76} cor="#fff" rot={4} />
				<Placa x={540} y={1700} k={usePop(tArv + 2, 9)} txt="CRASH!" tam={130} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="whoosh" em={4} vol={0.5} />
			<Sfx src="boom" em={tArv} vol={0.65} />
		</>
	);
};

// 4 — única sobrevivente, clavícula quebrada, um sapato só
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tUnica = m('only'), tClav = m('collarbone'), tSap = m('shoe');
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1100, 1.05]} dur={dur}>
				<Selva>
					<Personagem x={540} y={2120} escala={1.15} {...JULIANE} expressao={f >= tClav ? 'enjoado' : 'confuso'} bracoD={30} bracoE={f >= tClav ? 70 : 30} cotoveloE={-100} fase={2} />
					{f >= tClav && <rect x={560} y={1690} width={130} height={40} rx={10} fill="#fff" stroke={CONTORNO} strokeWidth={5} transform="rotate(-25 625 1710)" />}
					{f >= tSap && <circle cx={470} cy={1900} r={90} fill="none" stroke="#ffd23f" strokeWidth={12} />}
				</Selva>
				<Placa x={540} y={280} k={usePop(tUnica, 9)} txt="ONLY SURVIVOR" tam={110} />
				<Placa x={540} y={460} k={usePop(tClav, 10)} txt="BROKEN COLLARBONE" tam={70} cor="#fff" rot={4} />
				<Placa x={540} y={640} k={usePop(tSap, 10)} txt="JUST ONE SHOE" tam={80} cor="#ffd23f" rot={-4} />
			</Camera>
			<Sfx src="uhoh" em={tUnica} vol={0.4} />
			<Sfx src="pop" em={tClav} vol={0.35} />
			<Sfx src="pop" em={tSap} vol={0.35} />
		</>
	);
};

// 5 — pais biólogos: "siga a água rio abaixo"
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBio = m('biologists'), tTruque = m('trick'), tAgua = m('water');
	const kB = usePop(tBio - 4, 10);
	const kS = usePop(tAgua, 9);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tAgua}>
				<Selva rio>
					<Personagem x={300} y={2100} escala={1.05} {...JULIANE} expressao={f >= tAgua ? 'feliz' : 'confuso'} olhar={1} fase={3} />
					{kB > 0 && (
						<g transform={`translate(640, 820) scale(${kB})`}>
							<ellipse cx={0} cy={0} rx={380} ry={260} fill="#fff" stroke={CONTORNO} strokeWidth={10} />
							{[[-150, -40], [-260, 60]].map(([x, y], i) => <circle key={i} cx={x - 120} cy={y + 260 + i * 40} r={20 - i * 6} fill="#fff" stroke={CONTORNO} strokeWidth={6} />)}
							<Personagem x={-110} y={250} escala={0.45} roupa="medico" cabelo="#6b3a1f" expressao="feliz" fase={1} />
							<Personagem x={110} y={250} escala={0.45} roupa="medico" cabelo="#c9a227" expressao="feliz" fase={2} />
						</g>
					)}
					{kS > 0 && <g transform={`translate(760, 1620) scale(${kS})`}><path d="M-160 -30 H60 V-80 L170 0 L60 80 V30 H-160Z" fill="#5ab8e8" stroke={CONTORNO} strokeWidth={8} /></g>}
				</Selva>
				<Placa x={540} y={260} k={usePop(tBio, 10)} txt="BIOLOGIST PARENTS" tam={84} />
				<Placa x={540} y={1250} k={usePop(tAgua + 4, 9)} txt="FOLLOW THE WATER" tam={90} cor="#bfe3ff" />
			</Camera>
			<Sfx src="pop" em={tBio - 4} vol={0.35} />
			<Sfx src="ding" em={tTruque} vol={0.35} />
			<Sfx src="whoosh" em={tAgua} vol={0.4} />
		</>
	);
};

// 6 — andou e atravessou a selva, dia após dia (contador sobe)
const C6: React.FC<PropsCena> = ({dur}) => {
	const f = useCurrentFrame();
	const dia = Math.min(10, 1 + Math.floor((f / dur) * 10));
	const passo = (f % 20) / 20;
	const pulso = Math.exp(-((f % Math.max(1, Math.floor(dur / 10))) / 4));
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1150, 1.05]} dur={dur}>
				<Selva rio>
					<g transform={`translate(${-((f * 6) % 400)}, 0)`}>{[0, 400, 800, 1200].map((x) => <path key={x} d={`M${x} 1450 q 60 -200 160 -240`} stroke="#5aaa4a" strokeWidth={18} fill="none" />)}</g>
					<Personagem x={540} y={2110 + Math.abs(Math.sin(passo * Math.PI)) * -20} escala={1.05} {...JULIANE} expressao="serio" bracoD={40 + Math.sin(passo * Math.PI * 2) * 30} bracoE={40 - Math.sin(passo * Math.PI * 2) * 30} inclinar={6} fase={4} />
				</Selva>
				<ContadorDia d={dia} pulso={pulso} />
			</Camera>
			{Array.from({length: 9}).map((_, i) => <Sfx key={i} src="pop" em={Math.floor(((i + 1) / 10) * dur)} vol={0.2} />)}
		</>
	);
};

// 7 — no 11º dia, uma cabana e trabalhadores a encontraram
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tOnze = m('eleven'), tCabana = m('hut'), tTrab = m('workers'), tConseguiu = m('made');
	const kC = usePop(tCabana - 4, 11);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tConseguiu}>
				<Selva rio>
					{kC > 0 && (
						<g transform={`translate(700, 1420) scale(${kC})`}>
							<rect x={-220} y={-240} width={440} height={240} fill="#8a6a3a" stroke={CONTORNO} strokeWidth={9} />
							<path d="M-280 -230 L0 -420 L280 -230Z" fill="#c9a24a" stroke={CONTORNO} strokeWidth={9} />
							<rect x={-50} y={-150} width={100} height={150} fill="#4a3320" stroke={CONTORNO} strokeWidth={6} />
						</g>
					)}
					<Personagem x={300} y={2110} escala={1.0} {...JULIANE} expressao={f >= tConseguiu ? 'feliz' : 'serio'} olhar={1} bracoD={f >= tConseguiu ? 160 : 30} bracoE={f >= tConseguiu ? 160 : 30} fase={5} />
					{f >= tTrab && [780, 940].map((x, i) => <Personagem key={x} x={x} y={2110} escala={0.9} roupa="fazendeiro" cor={i ? '#c9762e' : '#5a8f6a'} cabelo="#1d1d1d" expressao="assustado" olhar={-1} bracoE={140} cotoveloE={-10} fase={6 + i} />)}
				</Selva>
				<ContadorDia d={f >= tOnze ? 11 : 10} pulso={f >= tOnze ? Math.exp(-(f - tOnze) / 5) : 0} />
				<Placa x={540} y={280} k={usePop(tConseguiu, 8)} txt="SHE MADE IT!" tam={120} cor="#5aff7a" />
			</Camera>
			<Sfx src="ding" em={tOnze} vol={0.4} />
			<Sfx src="pop" em={tCabana - 4} vol={0.35} />
			<Sfx src="boom" em={tConseguiu} vol={0.45} />
		</>
	);
};

// 8 — CTA de uma palavra: comente LEGEND
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCom = m('comment'), tLeg = m('legend', 2);
	const kB = usePop(tCom - 4, 10), kZ = usePop(tLeg, 7);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tLeg}>
				<Selva />
				<g transform={`translate(540, 900) scale(${kB * 0.88})`}>
					<path d="M-420 -220 H420 Q460 -220 460 -180 V160 Q460 200 420 200 H-160 L-260 300 L-240 200 H-420 Q-460 200 -460 160 V-180 Q-460 -220 -420 -220Z" fill="#fff" stroke={CONTORNO} strokeWidth={12} />
					<text x={0} y={-100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#5a6070">COMMENT</text>
					<g transform={`scale(${kZ * (1 + 0.06 * Math.sin(f / 4))})`}>
						<text x={0} y={100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={180} fill="#ffd23f" stroke={CONTORNO} strokeWidth={16} paintOrder="stroke">LEGEND</text>
					</g>
				</g>
				<Placa x={540} y={1620} k={usePop(tCom, 10)} txt="JUST ONE WORD" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tCom - 4} vol={0.4} />
			<Sfx src="boom" em={tLeg} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'JulianeKoepcke',
	pastaVoz: 'voz-juliane-koepcke',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8],
	destaques: new Set(['two', 'miles', 'survived', 'christmas', '1971', 'juliane', 'koepcke', 'amazon', 'lightning', 'broke', 'thousand', 'seat', 'trees', 'only', 'collarbone', 'shoe', 'biologists', 'trick', 'water', 'downstream', 'day', 'eleven', 'hut', 'workers', 'made', 'comment', 'legend']),
};
export default ep;
