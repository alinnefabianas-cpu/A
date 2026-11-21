// Episódio (EN): flamingos não nascem rosa.
// Fontes: National Geographic, Smithsonian's National Zoo, San Diego Zoo, Audubon.
// Filhotes nascem cinza/brancos; o rosa vem de carotenoides de algas e pequenos crustáceos; sem eles, as penas
// desbotam; zoológicos adicionam pigmentos (ex.: cantaxantina) à ração.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Fundo, clamp, mix} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'Flamingos are not born pink.',
	'Baby flamingos are actually grey and fluffy.',
	'Their pink color comes from their food: algae and tiny shrimp packed with natural pigments.',
	'The more of those pigments they eat, the pinker they get.',
	'If a flamingo stops eating them, its feathers slowly fade.',
	"That's why zoos add special pigments to their food. To keep them pink!",
];

export const ROSA = '#f47a9a', CINZA = '#c9ccd2', PALIDO = '#f6dde3';

// flamingo em pé (origem nos pés), cor do corpo variável; come = 0..1 abaixa o pescoço
export const Flamingo: React.FC<{cor?: string; s?: number; come?: number; triste?: boolean}> = ({cor = ROSA, s = 1, come = 0, triste}) => {
	const f = useCurrentFrame();
	const escuro = mix(cor, '#7a2a3a', 0.25);
	const cab = come > 0 ? [interpolate(come, [0, 1], [120, 230]), interpolate(come, [0, 1], [-760, -80])] : [120, -760];
	return (
		<g transform={`scale(${s})`}>
			<line x1={-10} y1={0} x2={0} y2={-380} stroke={escuro} strokeWidth={14} />
			<path d="M0 -300 L60 -230 L0 -200" stroke={escuro} strokeWidth={12} fill="none" />
			<ellipse cx={0} cy={-470} rx={170} ry={100} fill={cor} stroke={CONTORNO} strokeWidth={9} transform={`rotate(-8 0 -470)`} />
			<path d="M-160 -460 Q-230 -430 -250 -380 Q-180 -400 -120 -420Z" fill={escuro} stroke={CONTORNO} strokeWidth={6} />
			<path d="M-20 -480 Q-60 -540 0 -560 Q60 -575 70 -520" fill="none" stroke={escuro} strokeWidth={8} />
			<path d={`M120 -500 Q${180 + Math.sin(f / 10) * 6} ${-620 + come * 300} ${cab[0]} ${cab[1] + 40}`} stroke={cor} strokeWidth={46} fill="none" strokeLinecap="round" />
			<path d={`M120 -500 Q${180 + Math.sin(f / 10) * 6} ${-620 + come * 300} ${cab[0]} ${cab[1] + 40}`} stroke={CONTORNO} strokeWidth={56} fill="none" strokeLinecap="round" opacity={0.15} />
			<g transform={`translate(${cab[0]}, ${cab[1]})`}>
				<circle r={58} fill={cor} stroke={CONTORNO} strokeWidth={8} />
				<path d="M40 -20 Q120 -10 120 50 Q100 30 70 30 Q50 30 40 20Z" fill="#f6f0e2" stroke={CONTORNO} strokeWidth={6} />
				<path d="M100 20 Q120 40 120 50 Q105 45 95 42Z" fill="#241820" />
				<circle cx={10} cy={-14} r={10} fill={CONTORNO} />
				{triste && <path d="M-10 -36 l30 8" stroke={CONTORNO} strokeWidth={5} />}
			</g>
		</g>
	);
};

const Filhote: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s}) translate(0, ${Math.abs(Math.sin(f / 6)) * -10})`}>
			{[-40, 40].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={-90} stroke="#e07a5a" strokeWidth={12} />)}
			{Array.from({length: 10}).map((_, i) => <circle key={i} cx={Math.cos(i) * 70} cy={-190 + Math.sin(i * 1.7) * 50} r={70} fill={CINZA} />)}
			<circle cx={0} cy={-190} r={110} fill={CINZA} stroke={CONTORNO} strokeWidth={8} />
			<circle cx={60} cy={-310} r={60} fill={CINZA} stroke={CONTORNO} strokeWidth={8} />
			<path d="M100 -320 l50 20 l-50 14Z" fill="#2a2a2a" />
			<circle cx={70} cy={-325} r={10} fill={CONTORNO} />
		</g>
	);
};

const Lago: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<rect width={W} height={H} fill="#ffd9a8" />
		<rect y={1250} width={W} height={670} fill="#5ab8c8" />
		<path d="M0 1250 Q270 1230 540 1250 T1080 1250" stroke="#fff" strokeWidth={8} fill="none" opacity={0.6} />
		{children}
	</g>
);

const Camarao: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-60 0 Q-60 -60 0 -60 Q60 -60 60 0 Q40 -30 0 -30 Q-30 -30 -40 10Z" fill="#f2725a" stroke={CONTORNO} strokeWidth={5} />
		<path d="M-60 0 l-20 20 l24 -4Z" fill="#f2725a" stroke={CONTORNO} strokeWidth={4} />
		<circle cx={40} cy={-40} r={6} fill={CONTORNO} />
	</g>
);

// 0 — gancho: flamingos não nascem rosa
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const tNao = m('not');
	return (
		<>
			<Camera de={[540, 1000, 1.25]} para={[540, 1000, 1.05]} dur={dur} soco={tNao}>
				<Fundo cor="#ffd3e0" />
				<g transform="translate(470, 1700)"><Flamingo s={1.5} /></g>
				<Placa x={540} y={300} k={usePop(tNao, 9)} txt="NOT BORN PINK?!" tam={100} />
			</Camera>
			<Sfx src="boom" em={tNao} vol={0.4} />
		</>
	);
};

// 1 — filhotes são cinza e fofinhos
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBebe = m('baby'), tCinza = m('grey');
	const abre = f >= tCinza - 6;
	const kF = usePop(tCinza - 6, 10);
	return (
		<>
			<Camera de={[540, 1100, 1.3]} para={[540, 1100, 1.1]} dur={dur} soco={tCinza}>
				<Fundo cor="#e9e2d0" />
				{!abre ? (
					<g transform={`translate(540, 1100) rotate(${f >= tBebe ? Math.sin(f) * 6 : 0})`}>
						<ellipse cx={0} cy={0} rx={200} ry={260} fill="#fbfbf6" stroke={CONTORNO} strokeWidth={10} />
						{f >= tBebe && <path d="M-120 -40 l40 30 l30 -40 l40 40 l30 -30" stroke={CONTORNO} strokeWidth={8} fill="none" />}
					</g>
				) : (
					<g>
						<g transform={`translate(540, 1400) scale(${kF * 1.6})`}><Filhote /></g>
						<path d="M260 1440 Q300 1360 380 1400 L420 1440Z" fill="#fbfbf6" stroke={CONTORNO} strokeWidth={8} />
						<path d="M820 1440 Q780 1360 700 1400 L660 1440Z" fill="#fbfbf6" stroke={CONTORNO} strokeWidth={8} />
					</g>
				)}
				<Placa x={540} y={300} k={usePop(tCinza, 9)} txt="GREY & FLUFFY!" tam={100} cor="#d0d4dc" />
			</Camera>
			<Sfx src="pop" em={tBebe} vol={0.35} />
			<Sfx src="boom" em={tCinza - 6} vol={0.4} />
		</>
	);
};

// 2 — o rosa vem da comida: algas e camarõezinhos com pigmentos
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tComida = m('food'), tAlga = m('algae'), tCam = m('shrimp'), tPig = m('pigments');
	const kA = usePop(tAlga, 10), kC = usePop(tCam, 10);
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1250, 1.0]} dur={dur} soco={tPig}>
				<Lago>
					<g transform="translate(300, 1500)"><Flamingo s={0.9} cor={ROSA} come={f >= tComida ? 0.7 : 0} /></g>
					{kA > 0 && Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={560 + (i % 3) * 140} cy={1450 + Math.floor(i / 3) * 120 + Math.sin(f / 8 + i) * 8} rx={50 * kA} ry={26 * kA} fill="#5aaa5a" stroke={CONTORNO} strokeWidth={4} />)}
					{kC > 0 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${600 + i * 160 + Math.sin(f / 6 + i) * 20}, ${1720 + (i % 2) * 60}) scale(${kC})`}><Camarao /></g>)}
				</Lago>
				<Placa x={540} y={280} k={usePop(tAlga, 10)} txt="ALGAE" tam={100} cor="#7fe08a" />
				<Placa x={540} y={450} k={usePop(tCam, 10)} txt="TINY SHRIMP" tam={90} cor="#ffb3a0" rot={4} />
				<Placa x={540} y={620} k={usePop(tPig, 9)} txt="NATURAL PIGMENTS" tam={70} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tAlga} vol={0.35} />
			<Sfx src="pop" em={tCam} vol={0.35} />
			<Sfx src="ding" em={tPig} vol={0.4} />
		</>
	);
};

// 3 — quanto mais comem, mais rosa ficam
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tComem = m('eat'), tRosa = m('pinker');
	const t = interpolate(f, [tComem - 6, tRosa + 6], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.05]} dur={dur} soco={tRosa}>
				<Lago>
					{[260, 560, 860].map((x, i) => <g key={x} transform={`translate(${x}, 1560)`}><Flamingo s={0.65} cor={mix(PALIDO, ['#f6a0b8', '#f47a9a', '#e8456a'][i], t)} come={i === 1 ? (Math.sin(f / 6) + 1) / 3 : 0} /></g>)}
				</Lago>
				<Placa x={540} y={300} k={usePop(tRosa, 9)} txt="PINKER & PINKER" tam={90} cor="#ff9ab8" />
			</Camera>
			<Sfx src="pop" em={tComem} vol={0.3} />
			<Sfx src="ding" em={tRosa} vol={0.4} />
		</>
	);
};

// 4 — se param de comer, as penas desbotam
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPara = m('stops'), tDesb = m('fade');
	const t = interpolate(f, [tDesb - 6, tDesb + 24], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1100, 1.05]} dur={dur}>
				<Fundo cor="#e9e2d0" />
				<g transform="translate(470, 1720)"><Flamingo s={1.3} cor={mix(ROSA, PALIDO, t)} triste={t > 0.5} /></g>
				{f >= tPara && <g transform="translate(860, 560)"><circle r={90} fill="#fff" stroke={CONTORNO} strokeWidth={8} /><g transform="scale(0.8)"><Camarao /></g><path d="M-60 -60 L60 60" stroke="#e8262f" strokeWidth={18} strokeLinecap="round" /></g>}
				<Placa x={540} y={300} k={usePop(tDesb, 10)} txt="FADING..." tam={110} cor="#fff" />
			</Camera>
			<Sfx src="uhoh" em={tPara} vol={0.35} />
			<Sfx src="whoosh" em={tDesb} vol={0.3} />
		</>
	);
};

// 5 — zoológicos põem pigmentos na comida para mantê-los rosa
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tZoo = m('zoos'), tPig = m('pigments'), tRosa = m('pink');
	const t = interpolate(f, [tPig, tRosa + 4], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.0]} dur={dur} soco={tRosa}>
				<Lago>
					<g transform="translate(700, 1600)"><Flamingo s={0.95} cor={mix(PALIDO, ROSA, t)} come={f >= tPig ? 0.5 : 0} /></g>
					<Personagem x={230} y={2020} escala={0.85} roupa="fazendeiro" cor="#6b8a5a" cabelo="#4a3326" expressao="feliz" olhar={1} bracoD={110} cotoveloD={-20} itemD={<g transform="rotate(180) scale(0.6)"><rect x={-60} y={-80} width={120} height={120} rx={10} fill="#e8a23a" stroke={CONTORNO} strokeWidth={6} /><text y={-6} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={CONTORNO}>FOOD</text></g>} fase={1} />
				</Lago>
				<Placa x={540} y={280} k={usePop(tZoo, 10)} txt="ZOOS" tam={110} />
				<Placa x={540} y={460} k={usePop(tRosa, 9)} txt="STAY PINK!" tam={100} cor="#ff9ab8" rot={4} />
			</Camera>
			<Sfx src="pop" em={tZoo} vol={0.35} />
			<Sfx src="ding" em={tRosa} vol={0.45} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'FlamingosPink',
	pastaVoz: 'voz-flamingos-pink',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['not', 'pink', 'baby', 'grey', 'fluffy', 'food', 'algae', 'shrimp', 'pigments', 'pinker', 'stops', 'fade', 'zoos']),
};
export default ep;
