// Episódio (EN): Mauro Prosperi, 9 dias perdido no Saara (Marathon des Sables, 1994).
// Fontes: BBC ("The man who got lost in the Sahara"), The Guardian, Runner's World, entrevistas de Prosperi.
// Tempestade de areia apagou a trilha; bebeu a própria urina; achou um santuário (marabout) e comeu morcegos;
// nômades o acharam no 9º dia; tinha ido parar na Argélia, ~290 km fora da rota; anos depois voltou a correr a prova.
// Dicas aplicadas: estilo próprio (contador DAY n/9); 1º quadro = capa; CTA de 1 palavra no fim.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Sol, clamp} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'This man got lost in the Sahara desert for nine days. And survived.',
	'In 1994, Mauro Prosperi was running a famous ultramarathon across the Sahara.',
	'Then a huge sandstorm hit. When it stopped, the trail was gone.',
	'He kept walking, but he had almost no water left.',
	'So he drank his own urine to stay alive.',
	'He found an empty shrine, and survived by eating the bats living inside.',
	'After nine days, nomads found him. He had wandered all the way into another country: Algeria.',
	'Almost 300 kilometers off course. And years later, he went back and ran the race again.',
	'Would you go back? Comment one word: NOPE.',
];

const MAURO = {roupa: 'corredor' as const, cor: '#f4f4f4', cabelo: '#2d1f17', numero: '7'};

const Deserto: React.FC<{children?: React.ReactNode; ceu?: string; tempestade?: number}> = ({children, ceu = '#ffd9a0', tempestade = 0}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill={ceu} />
			<path d="M0 1100 Q250 950 520 1080 T1080 1040 V1920 H0Z" fill="#e8b46a" />
			<path d="M0 1350 Q300 1220 600 1330 T1080 1300 V1920 H0Z" fill="#d9a050" />
			<path d="M0 1600 Q260 1520 560 1590 T1080 1560 V1920 H0Z" fill="#c98e44" />
			{children}
			{tempestade > 0 && (
				<g opacity={tempestade}>
					<rect width={W} height={H} fill="#b07a3a" opacity={0.75} />
					{Array.from({length: 40}).map((_, i) => <path key={i} d={`M${((i * 97 + f * 30) % 1300) - 200} ${(i * 173) % 1920} q 60 -20 120 0 t 120 0`} stroke="#e8c88a" strokeWidth={8} fill="none" opacity={0.7} />)}
				</g>
			)}
		</g>
	);
};

const Contador: React.FC<{d: number; pulso?: number}> = ({d, pulso = 0}) => (
	<g transform={`translate(780, 640) scale(${1 + pulso * 0.2})`}>
		<rect x={-170} y={-66} width={340} height={132} rx={30} fill="#000" stroke="#ffd23f" strokeWidth={8} />
		<text x={0} y={26} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={76} fill="#fff">DAY {d}/9</text>
	</g>
);

const Cantil: React.FC<{nivel: number}> = ({nivel}) => (
	<g>
		<rect x={-30} y={-230} width={60} height={50} rx={10} fill="#6b4a2a" stroke={CONTORNO} strokeWidth={6} />
		<rect x={-110} y={-190} width={220} height={320} rx={60} fill="rgba(255,255,255,0.6)" stroke={CONTORNO} strokeWidth={9} />
		<rect x={-100} y={120 - 300 * nivel} width={200} height={300 * nivel} rx={40} fill="#5ab8e8" />
	</g>
);

const Santuario: React.FC = () => (
	<g>
		<rect x={-220} y={-260} width={440} height={260} fill="#f6f0e2" stroke={CONTORNO} strokeWidth={9} />
		<path d="M-180 -260 Q0 -480 180 -260Z" fill="#f6f0e2" stroke={CONTORNO} strokeWidth={9} />
		<path d="M-60 0 V-140 Q0 -200 60 -140 V0Z" fill="#3a2a1e" stroke={CONTORNO} strokeWidth={7} />
	</g>
);

const Morcego: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	const a = Math.sin(f / 2) * 25;
	return (
		<g transform={`scale(${s})`}>
			<path d={`M0 0 Q-50 ${-40 - a} -110 ${-10 - a} Q-80 10 -60 30 Q-30 10 0 20 Q30 10 60 30 Q80 10 110 ${-10 - a} Q50 ${-40 - a} 0 0Z`} fill="#3a2a3a" stroke={CONTORNO} strokeWidth={5} />
			<circle cx={-10} cy={6} r={4} fill="#ff6a6a" />
			<circle cx={10} cy={6} r={4} fill="#ff6a6a" />
		</g>
	);
};

// 0 — CAPA no frame 0 + gancho
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSob = m('survived');
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 1050, 1.1]} dur={dur} soco={tSob}>
				<Deserto ceu="#ffc070">
					<Sol x={760} y={900} s={1.6} />
					<Personagem x={540} y={2310} escala={1.3} {...MAURO} expressao="enjoado" enjoo={0.3} inclinar={-6 + Math.sin(f / 10) * 3} bracoD={20} bracoE={20} fase={1} />
				</Deserto>
				<Placa x={540} y={270} k={1} txt="LOST IN THE SAHARA" tam={84} rot={-4} />
				<g transform="translate(540, 480) rotate(4)">
					<rect x={-330} y={-105} width={660} height={200} rx={30} fill="#e8262f" stroke="#000" strokeWidth={12} />
					<text x={0} y={55} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={165} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">9 DAYS</text>
				</g>
				<Placa x={540} y={1180} k={usePop(tSob, 9)} txt="...AND SURVIVED!" tam={100} cor="#5aff7a" />
			</Camera>
			<Sfx src="boom" em={0} vol={0.45} />
			<Sfx src="ding" em={tSob} vol={0.45} />
		</>
	);
};

// 1 — 1994: ultramaratona no Saara
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1994'), tNome = m('mauro'), tUltra = m('ultramarathon');
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1150, 1.0]} dur={dur}>
				<Deserto>
					<Sol x={880} y={300} />
					{[0, 1, 2].map((i) => {
						const x = ((f * 4 + i * 360) % 1500) - 200;
						return <Personagem key={i} x={x} y={1700 + i * 60} escala={0.55} roupa="corredor" cor={['#4f7cc9', '#e8392f', '#3c8a4a'][i]} cabelo="#1d1d1d" numero={String(20 + i)} expressao="feliz" bracoD={60 + Math.sin(f / 3 + i) * 40} bracoE={60 - Math.sin(f / 3 + i) * 40} fase={i} />;
					})}
					<Personagem x={540} y={2230} escala={1.1} {...MAURO} expressao="feliz" bracoD={60 + Math.sin(f / 3) * 40} bracoE={60 - Math.sin(f / 3) * 40} fase={4} />
				</Deserto>
				<Placa x={540} y={260} k={usePop(tAno, 10)} txt="1994" tam={140} />
				<Placa x={540} y={450} k={usePop(tNome, 10)} txt="MAURO PROSPERI" tam={84} cor="#fff" rot={4} />
				<Placa x={540} y={640} k={usePop(tUltra, 10)} txt="SAHARA ULTRAMARATHON" tam={64} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="ding" em={tNome} vol={0.4} />
			<Sfx src="pop" em={tUltra} vol={0.35} />
		</>
	);
};

// 2 — tempestade de areia; a trilha sumiu
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTemp = m('sandstorm'), tParou = m('stopped'), tSumiu = m('gone');
	const temp = f < tParou ? interpolate(f, [tTemp - 6, tTemp + 6], [0, 1], clamp) : interpolate(f, [tParou, tParou + 12], [1, 0], clamp);
	const marcas = f < tSumiu;
	return (
		<>
			<Camera de={[540, 1150, 1.05]} para={[540, 1150, 1.0]} dur={dur} tremor={temp > 0.5 ? 6 : 0} soco={tSumiu}>
				<Deserto tempestade={temp}>
					{marcas && [200, 420, 640, 860].map((x, i) => <g key={x} transform={`translate(${x}, ${1400 + i * 40})`}><rect x={-6} y={-120} width={12} height={120} fill="#6b4a2a" /><path d="M6 -120 L70 -100 L6 -80Z" fill="#e8392f" /></g>)}
					<Personagem x={540} y={2230} escala={1.1} {...MAURO} expressao={f >= tSumiu ? 'confuso' : 'assustado'} olhar={f >= tSumiu ? -1 : 1} bracoD={f >= tTemp && f < tParou ? 150 : 30} bracoE={f >= tTemp && f < tParou ? 150 : 30} fase={2} />
				</Deserto>
				<Placa x={540} y={280} k={usePop(tTemp, 9)} txt="SANDSTORM!" tam={130} cor="#e8a23a" />
				<Placa x={540} y={1180} k={usePop(tSumiu, 9)} txt="THE TRAIL IS GONE" tam={90} cor="#fff" />
				<Contador d={1} />
			</Camera>
			<Sfx src="whoosh" em={tTemp - 6} vol={0.55} />
			<Sfx src="uhoh" em={tSumiu} vol={0.45} />
		</>
	);
};

// 3 — quase sem água
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAgua = m('water');
	const nivel = interpolate(f, [0, tAgua + 10], [0.5, 0.05], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1100, 1.05]} dur={dur} soco={tAgua}>
				<Deserto ceu="#ffc070">
					<Sol x={880} y={300} s={1.2} />
					<Personagem x={330} y={2230} escala={1.05} {...MAURO} expressao="enjoado" enjoo={0.4} inclinar={8} fase={3} />
					<g transform="translate(760, 1500)"><Cantil nivel={nivel} /></g>
				</Deserto>
				<Placa x={540} y={280} k={usePop(tAgua, 9)} txt="ALMOST NO WATER" tam={90} cor="#bfe3ff" />
				<Contador d={Math.round(interpolate(f, [0, dur], [2, 3], clamp))} />
			</Camera>
			<Sfx src="uhoh" em={tAgua} vol={0.4} />
		</>
	);
};

// 4 — bebeu a própria urina
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tUrina = m('urine');
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1100, 1.1]} dur={dur} soco={tUrina}>
				<Deserto ceu="#ffc070">
					<Personagem x={540} y={2230} escala={1.15} {...MAURO} expressao="enjoado" enjoo={0.8} bracoD={140} cotoveloD={-120} itemD={<g transform="rotate(180) scale(0.6)"><rect x={-40} y={-40} width={80} height={120} rx={14} fill="#f2d24a" stroke={CONTORNO} strokeWidth={6} opacity={0.9} /></g>} fase={4} />
				</Deserto>
				<Placa x={540} y={280} k={usePop(tUrina, 9)} txt="EWWW!" tam={140} cor="#f2d24a" />
				<Placa x={540} y={1180} k={usePop(tUrina + 8, 10)} txt="YES, REALLY" tam={90} cor="#fff" />
				<Contador d={4} />
			</Camera>
			<Sfx src="uhoh" em={tUrina} vol={0.45} />
		</>
	);
};

// 5 — santuário vazio; comeu os morcegos
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSant = m('shrine'), tMorc = m('bats');
	const kS = usePop(tSant - 6, 11);
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1100, 1.0]} dur={dur} soco={tMorc}>
				<Deserto ceu="#ffb070">
					<g transform={`translate(700, 1460) scale(${kS})`}><Santuario /></g>
					{f >= tMorc && [0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${700 + Math.sin(f / 8 + i * 2) * 250}, ${900 + Math.cos(f / 6 + i) * 120 + i * 40})`}><Morcego s={0.8} /></g>)}
					<Personagem x={260} y={2230} escala={1.0} {...MAURO} expressao={f >= tMorc + 10 ? 'enjoado' : 'confuso'} olhar={1} bracoD={f >= tMorc ? 120 : 30} cotoveloD={-60} fase={5} />
				</Deserto>
				<Placa x={540} y={280} k={usePop(tSant, 10)} txt="AN EMPTY SHRINE" tam={90} />
				<Placa x={540} y={460} k={usePop(tMorc, 9)} txt="HE ATE BATS!" tam={100} cor="#e8262f" corTxt="#fff" rot={4} />
				<Contador d={Math.round(interpolate(f, [0, dur], [5, 7], clamp))} />
			</Camera>
			<Sfx src="pop" em={tSant - 6} vol={0.35} />
			<Sfx src="uhoh" em={tMorc} vol={0.45} />
		</>
	);
};

// 6 — nômades o acharam no 9º dia; ele estava na Argélia
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNove = m('nine'), tNom = m('nomads'), tArg = m('algeria');
	const xn = interpolate(f, [tNom - 10, tNom + 10], [1300, 780], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1100, 1.0]} dur={dur} soco={tArg}>
				<Deserto>
					<Personagem x={300} y={2230} escala={1.0} {...MAURO} expressao={f >= tNom ? 'feliz' : 'enjoado'} enjoo={f >= tNom ? 0 : 0.4} bracoD={f >= tNom ? 160 : 30} bracoE={f >= tNom ? 160 : 30} fase={6} />
					{f >= tNom - 10 && [0, 1].map((i) => <Personagem key={i} x={xn + i * 170} y={2140} escala={0.95} roupa="campones" cor={i ? '#2b4a8a' : '#6b3a7a'} cabelo="#1d1d1d" expressao="assustado" olhar={-1} bracoE={130} cotoveloE={-10} fase={7 + i} />)}
				</Deserto>
				<Contador d={9} pulso={f >= tNove ? Math.exp(-(f - tNove) / 5) : 0} />
				<Placa x={540} y={280} k={usePop(tNom, 9)} txt="FOUND!" tam={140} cor="#5aff7a" />
				<Placa x={540} y={1180} k={usePop(tArg, 8)} txt="IN ALGERIA?!" tam={110} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="ding" em={tNove} vol={0.4} />
			<Sfx src="pop" em={tNom} vol={0.4} />
			<Sfx src="boom" em={tArg} vol={0.5} />
		</>
	);
};

// 7 — quase 300 km fora da rota; anos depois correu a prova de novo
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tKm = m('300'), tNovo = m('again');
	const traco = interpolate(f, [0, tKm + 10], [0, 1], clamp);
	const correndo = f >= tNovo - 10;
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tNovo}>
				{!correndo ? (
					<g>
						<rect width={W} height={H} fill="#e8d4a8" />
						<path d="M120 300 L960 300 L960 1600 L120 1600Z" fill="#f2dfb5" stroke={CONTORNO} strokeWidth={10} />
						<path d="M540 300 L520 1000 L560 1600" stroke="#a8854a" strokeWidth={8} strokeDasharray="20 14" fill="none" />
						<text x={300} y={420} fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#7a5a2a">MOROCCO</text>
						<text x={700} y={1500} fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#7a5a2a">ALGERIA</text>
						<circle cx={300} cy={600} r={24} fill="#3c8a4a" stroke={CONTORNO} strokeWidth={6} />
						<path d={`M300 600 Q 520 900 ${300 + 480 * traco} ${600 + 700 * traco}`} stroke="#e8262f" strokeWidth={16} fill="none" strokeLinecap="round" />
						{traco >= 1 && <circle cx={780} cy={1300} r={30} fill="#e8262f" stroke={CONTORNO} strokeWidth={6} />}
					</g>
				) : (
					<Deserto>
						<Sol x={880} y={300} />
						<Personagem x={interpolate(f, [tNovo - 10, dur], [200, 800], clamp)} y={2230} escala={1.05} {...MAURO} numero="94" expressao="feliz" bracoD={60 + Math.sin(f / 3) * 40} bracoE={60 - Math.sin(f / 3) * 40} fase={8} />
					</Deserto>
				)}
				<Placa x={540} y={260} k={usePop(tKm, 9)} txt="~300 KM OFF COURSE" tam={90} />
				<Placa x={540} y={1180} k={usePop(tNovo, 9)} txt="HE RAN IT AGAIN!" tam={100} cor="#5aff7a" />
			</Camera>
			<Sfx src="whoosh" em={4} vol={0.35} />
			<Sfx src="boom" em={tKm} vol={0.4} />
			<Sfx src="ding" em={tNovo} vol={0.45} />
		</>
	);
};

// 8 — CTA de uma palavra: comente NOPE
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCom = m('comment'), tNope = m('nope');
	const kB = usePop(tCom - 4, 10), kZ = usePop(tNope, 7);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tNope}>
				<Deserto><Sol x={880} y={300} /></Deserto>
				<g transform={`translate(540, 850) scale(${kB * 0.88})`}>
					<path d="M-420 -220 H420 Q460 -220 460 -180 V160 Q460 200 420 200 H-160 L-260 300 L-240 200 H-420 Q-460 200 -460 160 V-180 Q-460 -220 -420 -220Z" fill="#fff" stroke={CONTORNO} strokeWidth={12} />
					<text x={0} y={-100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#5a6070">COMMENT</text>
					<g transform={`scale(${kZ * (1 + 0.06 * Math.sin(f / 4))})`}>
						<text x={0} y={100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={200} fill="#ffd23f" stroke={CONTORNO} strokeWidth={16} paintOrder="stroke">NOPE</text>
					</g>
				</g>
				<Placa x={540} y={1550} k={usePop(tCom, 10)} txt="JUST ONE WORD" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tCom - 4} vol={0.4} />
			<Sfx src="boom" em={tNope} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'MauroProsperi',
	pastaVoz: 'voz-mauro-prosperi',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8],
	destaques: new Set(['sahara', 'nine', 'days', 'survived', '1994', 'mauro', 'prosperi', 'ultramarathon', 'sandstorm', 'gone', 'water', 'urine', 'shrine', 'bats', 'nomads', 'algeria', '300', 'again', 'comment', 'nope']),
};
export default ep;
