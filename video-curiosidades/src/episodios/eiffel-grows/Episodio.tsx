// Episódio (EN): a Torre Eiffel cresce no verão.
// Fontes: site oficial toureiffel.paris, Britannica, Smithsonian.
// Ferro pudlado dilata com o calor: a altura pode variar até ~15 cm. Concessão original de 20 anos (1889);
// salva em parte pelo uso científico/militar como antena de rádio (TSF).
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';

export const FALAS = [
	'The Eiffel Tower gets taller in the summer.',
	"It's made of iron, and when iron heats up, it expands.",
	"On hot days, the tower can grow by up to 15 centimeters. That's about six inches.",
	'In winter, when it gets cold, it shrinks back down.',
	"And here's the crazy part: it was only supposed to stand for 20 years.",
	'It was saved partly because it made a perfect giant radio antenna.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BRONZE = '#8a5a3a';

// torre estilizada: base no (0,0), altura ~1000 * esticar
export const Torre: React.FC<{esticar?: number; cor?: string}> = ({esticar = 1, cor = BRONZE}) => (
	<g transform={`scale(1, ${esticar})`}>
		<path d="M-330 0 Q-200 -180 -150 -330 L-90 -620 L-40 -930 L0 -1000 L40 -930 L90 -620 L150 -330 Q200 -180 330 0 L230 0 Q120 -160 0 -170 Q-120 -160 -230 0Z" fill={cor} stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
		<rect x={-200} y={-350} width={400} height={36} fill={cor} stroke={CONTORNO} strokeWidth={8} />
		<rect x={-120} y={-640} width={240} height={30} fill={cor} stroke={CONTORNO} strokeWidth={8} />
		{Array.from({length: 9}).map((_, i) => <path key={i} d={`M${-130 + i * 8} ${-360 - i * 30} L${130 - i * 8} ${-390 - i * 30}`} stroke={CONTORNO} strokeWidth={4} opacity={0.5} />)}
		{Array.from({length: 9}).map((_, i) => <path key={'b' + i} d={`M${130 - i * 8} ${-360 - i * 30} L${-130 + i * 8} ${-390 - i * 30}`} stroke={CONTORNO} strokeWidth={4} opacity={0.5} />)}
		<rect x={-8} y={-1060} width={16} height={70} fill={CONTORNO} />
	</g>
);

const Paris: React.FC<{ceu?: string; chao?: string; children?: React.ReactNode}> = ({ceu = '#bfe3ff', chao = '#6fae4f', children}) => (
	<g>
		<rect width={W} height={H} fill={ceu} />
		{[[60, 260], [220, 200], [760, 240], [920, 180]].map(([x, h], i) => <rect key={i} x={x} y={1500 - h} width={150} height={h} fill="#e3d6c0" stroke={CONTORNO} strokeWidth={6} />)}
		<rect y={1500} width={W} height={420} fill={chao} />
		{children}
	</g>
);

const Sol: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x}, ${y}) scale(${s}) rotate(${f})`}>
			{Array.from({length: 12}).map((_, i) => <rect key={i} x={-10} y={-190} width={20} height={60} rx={10} fill="#ffb000" transform={`rotate(${i * 30})`} />)}
			<circle r={110} fill="#ffd23f" stroke="#e89b00" strokeWidth={10} />
		</g>
	);
};

const Termometro: React.FC<{nivel: number}> = ({nivel}) => (
	<g>
		<rect x={-40} y={-380} width={80} height={400} rx={40} fill="#fff" stroke={CONTORNO} strokeWidth={9} />
		<circle cy={40} r={70} fill={nivel > 0.5 ? '#e8262f' : '#3f8fdc'} stroke={CONTORNO} strokeWidth={9} />
		<rect x={-20} y={20 - 380 * nivel} width={40} height={380 * nivel} fill={nivel > 0.5 ? '#e8262f' : '#3f8fdc'} />
	</g>
);

const Neve: React.FC = () => {
	const f = useCurrentFrame();
	return <g>{Array.from({length: 40}).map((_, i) => <circle key={i} cx={(i * 137 + Math.sin(f / 10 + i) * 30) % 1080} cy={((i * 211) + f * (4 + (i % 3))) % 1920} r={8 + (i % 3) * 4} fill="#fff" opacity={0.9} />)}</g>;
};

// 0 — gancho: a torre fica mais alta no verão
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAlta = m('taller'), tVerao = m('summer');
	const kSol = usePop(tVerao - 4, 10);
	const est = interpolate(f, [tAlta - 2, tAlta + 10], [1, 1.12], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 950, 1.0]} dur={dur} soco={tAlta + 4}>
				<Paris ceu={f >= tVerao ? '#ffe2a0' : '#bfe3ff'}>
					<g transform="translate(540, 1560)"><Torre esticar={est} /></g>
					{f >= tVerao - 4 && <Sol x={880} y={300} s={kSol || 0.01} />}
				</Paris>
				<Placa x={300} y={300} k={usePop(tAlta + 2, 9)} txt="TALLER?!" tam={110} />
			</Camera>
			<Sfx src="whoosh" em={tAlta - 2} vol={0.45} />
			<Sfx src="ding" em={tVerao} vol={0.35} />
		</>
	);
};

// 1 — ferro: com calor, dilata
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFerro = m('iron'), tAquece = m('heats'), tDilata = m('expands');
	const calor = interpolate(f, [tAquece, tAquece + 15], [0, 1], clamp);
	const larg = interpolate(f, [tDilata, tDilata + 10], [1, 1.25], {...clamp, easing: Easing.out(Easing.back(2))});
	const r = Math.round(90 + calor * 140), g = Math.round(95 - calor * 30), b = Math.round(105 - calor * 60);
	return (
		<>
			<Camera de={[540, 900, 1.2]} para={[540, 900, 1.05]} dur={dur} soco={tDilata}>
				<rect width={W} height={H} fill="#2a2e38" />
				<circle cx={540} cy={900} r={600} fill={`rgba(255,${160 - calor * 60},60,${0.15 + calor * 0.25})`} />
				<g transform={`translate(540, 900) scale(${larg}, 1) scale(${usePop(tFerro - 6, 12)})`}>
					<rect x={-360} y={-90} width={720} height={180} rx={10} fill={`rgb(${r},${g},${b})`} stroke={CONTORNO} strokeWidth={10} />
					{[-280, -140, 0, 140, 280].map((x) => <circle key={x} cx={x} cy={0} r={18} fill={CONTORNO} opacity={0.5} />)}
				</g>
				{f >= tDilata && [-1, 1].map((d) => (
					<path key={d} d={`M${540 + d * 470} 900 l${d * 120} 0 m${-d * 40} -40 l${d * 40} 40 l${-d * 40} 40`} stroke="#ffd23f" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				))}
				{calor > 0 && <g transform="translate(540, 1600)"><Termometro nivel={0.3 + calor * 0.6} /></g>}
				<Placa x={540} y={420} k={usePop(tFerro, 10)} txt="IRON" tam={120} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tFerro} vol={0.35} />
			<Sfx src="whoosh" em={tAquece} vol={0.3} />
			<Sfx src="boom" em={tDilata} vol={0.35} />
		</>
	);
};

// 2 — até 15 cm (cerca de 6 polegadas)
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tQuente = m('hot'), t15 = m('15'), tSeis = m('six');
	const est = interpolate(f, [t15 - 6, t15 + 8], [1, 1.08], clamp);
	return (
		<>
			<Camera de={[540, 700, 1.4]} para={[540, 800, 1.1]} dur={dur} soco={t15}>
				<Paris ceu="#ffe2a0">
					<Sol x={880} y={260} />
					<g transform="translate(540, 1560)"><Torre esticar={est} /></g>
					{f >= t15 - 6 && (
						<g transform={`translate(700, ${1560 - 1060 * est})`}>
							<rect x={0} y={0} width={60} height={(1060 * est - 1060) + 10} fill="#ffd23f" stroke={CONTORNO} strokeWidth={6} />
						</g>
					)}
					<g transform="translate(180, 1500)" opacity={f >= tQuente ? 1 : 0}><Termometro nivel={0.9} /></g>
				</Paris>
				<Placa x={540} y={260} k={usePop(t15, 9)} txt="UP TO +15 CM" tam={100} />
				<Placa x={540} y={420} k={usePop(tSeis, 9)} txt="≈ 6 INCHES" tam={90} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="ding" em={tQuente} vol={0.3} />
			<Sfx src="pop" em={t15} vol={0.45} />
			<Sfx src="pop" em={tSeis} vol={0.4} />
		</>
	);
};

// 3 — no inverno encolhe de volta
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tInv = m('winter'), tEnc = m('shrinks');
	const est = interpolate(f, [tEnc, tEnc + 12], [1.08, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tEnc + 4}>
				<Paris ceu="#9fb8d6" chao="#f2f6fa">
					<g transform="translate(540, 1560)"><Torre esticar={est} cor="#7a5a4a" /></g>
					<g transform="translate(900, 1450)"><Termometro nivel={interpolate(f, [0, tEnc], [0.6, 0.15], clamp)} /></g>
					{f >= tInv && <Neve />}
				</Paris>
				<Placa x={300} y={300} k={usePop(tInv, 10)} txt="WINTER" tam={110} cor="#bfe3ff" />
				<Placa x={540} y={1700} k={usePop(tEnc + 4, 10)} txt="SHRINKS!" tam={110} />
			</Camera>
			<Sfx src="whoosh" em={tInv} vol={0.3} />
			<Sfx src="pop" em={tEnc + 4} vol={0.4} />
		</>
	);
};

// 4 — era para durar só 20 anos
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tLouco = m('crazy'), t20 = m('20');
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1050, 1.05]} dur={dur} soco={t20}>
				<Paris ceu="#e8d9b8">
					<g transform="translate(540, 1560)"><Torre /></g>
					<Personagem x={230} y={2020} escala={0.9} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao={f >= t20 ? 'assustado' : 'neutro'} olhar={1} bracoD={f >= t20 ? 150 : 30} bracoE={f >= t20 ? 150 : 30} cotoveloD={-20} cotoveloE={-20} fase={1} />
				</Paris>
				<Placa x={540} y={260} k={usePop(4, 10)} txt="1889" tam={120} />
				<Placa x={760} y={1700} k={usePop(t20, 9)} txt="ONLY 20 YEARS!" tam={80} cor="#e8262f" corTxt="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={4} vol={0.35} />
			<Sfx src="uhoh" em={tLouco} vol={0.35} />
			<Sfx src="boom" em={t20} vol={0.45} />
		</>
	);
};

// 5 — salva em parte por ser uma antena de rádio gigante
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSalva = m('saved'), tRadio = m('radio'), tAntena = m('antenna');
	return (
		<>
			<Camera de={[540, 900, 1.2]} para={[540, 950, 1.0]} dur={dur} soco={tAntena}>
				<Paris ceu="#bfe3ff">
					<g transform="translate(540, 1560)"><Torre /></g>
					{f >= tRadio && [0, 1, 2, 3].map((i) => {
						const t = ((f - tRadio + i * 8) % 32) / 32;
						return <circle key={i} cx={540} cy={500} r={40 + t * 420} fill="none" stroke="#3f8fdc" strokeWidth={14} opacity={1 - t} />;
					})}
					<Personagem x={180} y={2020} escala={0.85} roupa="soldado" cabelo="#2d1f17" expressao="feliz" olhar={1} bracoD={f >= tSalva ? 150 : 30} cotoveloD={-20} fase={2} />
				</Paris>
				<Placa x={540} y={240} k={usePop(tSalva, 10)} txt="SAVED!" tam={110} cor="#5aff7a" />
				<Placa x={600} y={1700} k={usePop(tAntena, 9)} txt="RADIO ANTENNA" tam={90} />
			</Camera>
			<Sfx src="ding" em={tSalva} vol={0.4} />
			<Sfx src="whoosh" em={tRadio} vol={0.3} />
			<Sfx src="pop" em={tAntena} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'EiffelGrows',
	pastaVoz: 'voz-eiffel-grows',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['taller', 'summer', 'iron', 'heats', 'expands', 'hot', '15', 'six', 'winter', 'shrinks', 'crazy', '20', 'saved', 'radio', 'antenna']),
};
export default ep;
