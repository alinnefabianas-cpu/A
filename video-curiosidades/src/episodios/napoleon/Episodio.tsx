// Episódio 6 (EN): Napoleão não era baixo.
// Fontes: Today I Found Out, ScienceABC, Britannica/History.com (citados), English Plus.
// Altura convertida: ~1,67–1,69 m (5'6"–5'7"); média francesa da época ~5'5"–5'6".
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Cavalete, Faixa, Jornal, Pergaminho, Polegadas, ReguaAltura, Salao} from './arte';

export const FALAS = [
	"Napoleon wasn't short. The whole world got tricked by a measuring mistake.",
	'His height was written down as five feet two inches.',
	'But those were French inches, and a French inch was longer than an English one.',
	'In English units, he was about five foot seven.',
	'That was average, maybe even a little tall, for a Frenchman back then.',
	'So why does everyone think he was tiny?',
	'British cartoonists loved drawing him as a furious little man throwing tantrums.',
	'His own soldiers called him the little corporal. But that was a nickname of affection.',
	'And he was often surrounded by his guards, who were picked for being tall.',
	"So Napoleon wasn't short. He just had really bad PR.",
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const NAP = {roupa: 'napoleao' as const, cabelo: '#2d1f17'};

// 0 — "Napoleão não era baixo"
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBaixo = m('short'), tEngana = m('tricked'), tMedida = m('measuring');
	const x = usePop(tBaixo + 4, 8);
	return (
		<>
			<Camera de={[540, 1000, 1.25]} para={[540, 1000, 1.12]} dur={dur} soco={tBaixo + 4}>
				<Salao>
					<ReguaAltura x={790} marca={f >= tMedida ? "5'2\"?" : '???'} yMarca={850} />
					<Personagem x={300} y={1700} escala={1.05} {...NAP} expressao={f >= tEngana ? 'bravo' : 'serio'} olhar={1} bracoD={f >= tEngana ? 30 : 12} cotoveloD={f >= tEngana ? -100 : 10} />
				</Salao>
				<Placa x={420} y={430} k={usePop(tBaixo, 12)} txt="SHORT?" tam={130} cor="#fff" />
				{x > 0 && (
					<g transform={`translate(420, 430) scale(${x})`}>
						<line x1={-230} y1={-80} x2={230} y2={80} stroke="#e8262f" strokeWidth={30} strokeLinecap="round" />
						<line x1={-230} y1={80} x2={230} y2={-80} stroke="#e8262f" strokeWidth={30} strokeLinecap="round" />
					</g>
				)}
			</Camera>
			<Sfx src="pop" em={tBaixo} vol={0.4} />
			<Sfx src="buzz" em={tBaixo + 4} vol={0.4} />
			<Sfx src="whoosh" em={tMedida} vol={0.35} />
		</>
	);
};

// 1 — "anotaram 5 pés e 2 polegadas"
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCinco = m('five');
	const prog = interpolate(f, [tCinco - 2, dur - 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.15]} para={[540, 940, 1.3]} dur={dur}>
				<rect width={W} height={H} fill="#3e2a1d" />
				<rect y={1300} width={W} height={620} fill="#5b3f2c" />
				<g transform="translate(540, 920)"><Pergaminho texto={"5' 2\""} prog={prog} /></g>
			</Camera>
			<Sfx src="whoosh" em={tCinco} vol={0.25} />
			<Sfx src="pop" em={dur - 10} vol={0.35} />
		</>
	);
};

// 2 — polegada francesa > polegada inglesa
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFr = m('french'), tLonga = m('longer'), tIng = m('english');
	const prog = interpolate(f, [tFr - 4, tFr + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const dest = interpolate(f, [tLonga, tLonga + 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[600, 960, 1.25]} dur={dur} soco={tLonga}>
				<rect width={W} height={H} fill="#1d2a66" />
				<circle cx={540} cy={960} r={640} fill="#26357a" />
				<g transform="translate(540, 960)"><Polegadas prog={prog} destaque={dest} /></g>
				{f >= tIng && <text x={540} y={1520} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">ABOUT 7% BIGGER</text>}
			</Camera>
			<Sfx src="whoosh" em={tFr - 4} vol={0.35} />
			<Sfx src="pop" em={tLonga} vol={0.45} />
		</>
	);
};

// 3 — "em unidades inglesas: cerca de 5'7"" — ele "cresce"
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSete = m('seven');
	const t = interpolate(f, [tSete - 10, tSete + 6], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const pol = Math.round(2 + t * 5);
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1050, 1.15]} dur={dur} soco={tSete}>
				<Salao>
					<ReguaAltura x={790} marca={`5'${Math.min(7, pol)}"`} yMarca={interpolate(t, [0, 1], [850, 690])} />
					<Personagem x={300} y={1700} escala={interpolate(t, [0, 1], [0.95, 1.12])} {...NAP} expressao={t > 0.8 ? 'feliz' : 'serio'} olhar={1} />
				</Salao>
				{t >= 1 && f < tSete + 10 && <LinhasImpacto op={0.3} cor="#ffd23f" />}
			</Camera>
			<Sfx src="whoosh" em={tSete - 10} vol={0.4} />
			<Sfx src="ding" em={tSete} vol={0.45} />
		</>
	);
};

// 4 — média para a época (talvez até um pouco alto)
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMedia = m('average'), tAlto = m('tall');
	const linha = usePop(tMedia, 12);
	const alturas = [1.0, 0.96, 1.04, 0.98, 1.02];
	return (
		<>
			<Camera de={[540, 1150, 1.2]} para={[540, 1120, 1.1]} dur={dur}>
				<Salao>
					{alturas.map((s, i) =>
						i === 2 ? (
							<Personagem key={i} x={540} y={1720 - (f >= tAlto ? 10 : 0)} escala={0.82} {...NAP} expressao={f >= tAlto ? 'feliz' : 'serio'} fase={i} />
						) : (
							<Personagem key={i} x={140 + i * 200} y={1720} escala={0.8 * s} roupa="passageiro" cor={['#5a8f6a', '#8a6a44', '', '#6b4a36', '#4f7cc9'][i]} cabelo={['#4a3326', '#1d1d1d', '', '#8a4b2a', '#c9a227'][i]} expressao="neutro" olhar={i < 2 ? 1 : -1} fase={i} />
						),
					)}
					{linha > 0 && (
						<g opacity={linha}>
							<line x1={60} y1={1150} x2={1020} y2={1150} stroke="#ffd23f" strokeWidth={10} strokeDasharray="30 18" />
							<text x={130} y={1120} fontFamily="Nunito" fontWeight={900} fontSize={64} fill="#ffd23f" stroke="#000" strokeWidth={10} paintOrder="stroke">AVERAGE</text>
						</g>
					)}
				</Salao>
			</Camera>
			<Sfx src="pop" em={tMedia} vol={0.4} />
			<Sfx src="pop" em={tAlto} vol={0.35} />
		</>
	);
};

// 5 — "então por que todo mundo acha que ele era minúsculo?"
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const tMinus = m('tiny');
	return (
		<>
			<Camera de={[540, 1200, 1.1]} para={[540, 1250, 1.4]} dur={dur}>
				<Salao>
					<Personagem x={540} y={1700} escala={0.38} {...NAP} expressao="confuso" />
				</Salao>
				<Interrogacao x={540} y={900} inicio={tMinus - 4} s={1.6} />
			</Camera>
			<Sfx src="pop" em={tMinus - 4} vol={0.4} />
		</>
	);
};

// 6 — cartunistas britânicos desenhando um homenzinho furioso
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCart = m('cartoonists'), tFuria = m('furious'), tBirra = m('tantrums');
	const desenho = usePop(tFuria - 6, 10);
	const pula = f >= tBirra ? Math.abs(Math.sin(f / 3)) * 40 : 0;
	return (
		<>
			<Camera de={[560, 1100, 1.15]} para={[580, 1000, 1.2]} dur={dur}>
				<rect width={W} height={H} fill="#d9c49a" />
				<rect y={1500} width={W} height={420} fill="#8a6a44" />
				<g transform="translate(640, 1080)">
					<Cavalete>
						{desenho > 0 && (
							<g transform={`scale(${desenho})`}>
								<Personagem x={0} y={160 - pula} escala={0.42} {...NAP} expressao="bravo" bracoD={f >= tBirra ? 160 : 40} bracoE={f >= tBirra ? 160 : 40} cotoveloD={-20} cotoveloE={-20} inclinar={Math.sin(f / 2) * 8} />
								{f >= tBirra && <text x={0} y={-300} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={90} fill="#e8262f" stroke="#000" strokeWidth={10} paintOrder="stroke">GRRR!</text>}
							</g>
						)}
					</Cavalete>
				</g>
				{f >= tCart - 4 && <Personagem x={240} y={1800} escala={0.8} roupa="treinador" cor="#3b3f4a" cabelo="#c9c9c9" expressao="feliz" olhar={1} bracoD={110} cotoveloD={-10} itemD={<line x1={0} y1={0} x2={60} y2={-60} stroke="#241820" strokeWidth={10} strokeLinecap="round" />} />}
			</Camera>
			<Sfx src="pop" em={tFuria - 6} vol={0.4} />
			<Sfx src="boom" em={tBirra} vol={0.3} />
		</>
	);
};

// 7 — "o pequeno cabo": apelido carinhoso dos soldados
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPeq = m('little'), tCabo = m('corporal'), tCarinho = m('affection');
	const faixa = usePop(tCabo, 10);
	return (
		<>
			<Camera de={[540, 1200, 1.2]} para={[540, 1100, 1.1]} dur={dur}>
				<Salao>
					{[160, 920, 330, 750].map((x, i) => (
						<Personagem key={x} x={x} y={1760 + (i > 1 ? 60 : 0)} escala={0.8} roupa="granadeiro" expressao={f >= tCarinho ? 'feliz' : 'neutro'} olhar={x < 540 ? 1 : -1} fase={i} bracoD={f >= tPeq && (i % 2 === 0) ? 160 : 15} bracoE={f >= tPeq && i % 2 ? 160 : 15} cotoveloD={10} cotoveloE={10} />
					))}
					<Personagem x={540} y={1700} escala={0.95} {...NAP} expressao="feliz" fase={5} />
				</Salao>
				<g transform="translate(540, 520) rotate(-3)"><Faixa texto="Le Petit Caporal" k={faixa} /></g>
				{f >= tCarinho &&
					[0, 1, 2, 3].map((i) => (
						<g key={i} transform={`translate(${250 + i * 190}, ${900 - ((f - tCarinho) * 3 + i * 30) % 200}) scale(0.8)`}>
							<path d="M0 60 C-90 0 -100 -60 -60 -80 C-30 -95 -5 -75 0 -55 C5 -75 30 -95 60 -80 C100 -60 90 0 0 60Z" fill="#e8463f" stroke="#241820" strokeWidth={8} />
						</g>
					))}
			</Camera>
			<Sfx src="pop" em={tCabo} vol={0.45} />
			<Sfx src="ding" em={tCarinho} vol={0.4} />
		</>
	);
};

// 8 — cercado por guardas escolhidos por serem altos
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tGuardas = m('guards'), tAlto = m('tall');
	const entra = interpolate(f, [tGuardas - 6, tGuardas + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const alto = usePop(tAlto, 10);
	return (
		<>
			<Camera de={[540, 1150, 1.15]} para={[540, 1050, 1.0]} dur={dur} soco={tAlto}>
				<Salao>
					<Personagem x={interpolate(entra, [0, 1], [-250, 250])} y={1820} escala={1.25} roupa="granadeiro" expressao="serio" olhar={1} fase={1} />
					<Personagem x={interpolate(entra, [0, 1], [1330, 830])} y={1820} escala={1.25} roupa="granadeiro" expressao="serio" olhar={-1} fase={3} />
					<Personagem x={540} y={1780} escala={0.9} {...NAP} expressao={entra > 0.5 ? 'enjoado' : 'serio'} />
				</Salao>
				{alto > 0 && (
					<g transform={`translate(830, 0) scale(1, ${alto})`}>
						<line x1={170} y1={720} x2={170} y2={1820} stroke="#ffd23f" strokeWidth={12} />
						<path d="M150 740 L170 700 L190 740Z M150 1800 L170 1840 L190 1800Z" fill="#ffd23f" />
					</g>
				)}
				<Placa x={540} y={420} k={alto} txt="TALL GUARDS" tam={90} />
			</Camera>
			<Sfx src="whoosh" em={tGuardas - 6} vol={0.4} />
			<Sfx src="pop" em={tAlto} vol={0.45} />
		</>
	);
};

// 9 — "ele só tinha uma péssima assessoria de imprensa"
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPR = m('pr');
	const jornal = usePop(4, 10);
	const pr = interpolate(f, [tPR, tPR + 6], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1050, 1.05]} dur={dur} soco={tPR} tremor={f >= tPR && f < tPR + 8 ? 6 : 0}>
				<Salao>
					<Personagem x={330} y={1760} escala={1.05} {...NAP} expressao={f >= tPR ? 'bravo' : 'serio'} olhar={1} bracoD={f >= tPR ? 50 : 15} cotoveloD={f >= tPR ? -110 : 10} bracoE={f >= tPR ? 50 : 15} cotoveloE={f >= tPR ? -110 : 10} />
				</Salao>
				{jornal > 0 && <g transform={`translate(690, 880) rotate(8) scale(${jornal * 0.72})`}><Jornal titulo="TINY TYRANT!" /></g>}
				{pr > 0 && (
					<g transform={`translate(540, 520) rotate(-10) scale(${2 - pr})`} opacity={pr}>
						<rect x={-260} y={-90} width={520} height={180} rx={20} fill="rgba(255,255,255,0.2)" stroke="#e8262f" strokeWidth={16} />
						<text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={120} fill="#e8262f">BAD PR</text>
					</g>
				)}
			</Camera>
			<Sfx src="pop" em={4} vol={0.35} />
			<Sfx src="boom" em={tPR} vol={0.55} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'Napoleon',
	pastaVoz: 'voz-napoleon',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['short', 'tricked', 'mistake', 'two', 'french', 'longer', 'english', 'seven', 'average', 'tall', 'tiny', 'cartoonists', 'furious', 'tantrums', 'little', 'corporal', 'affection', 'guards', 'pr']),
};
export default ep;
