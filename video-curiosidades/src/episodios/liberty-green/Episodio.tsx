// Episódio 9 (EN): por que a Estátua da Liberdade é verde.
// Fontes: Snopes ("Was the Statue of Liberty originally a different color?"), copper.org, Mental Floss (via Straight Dope).
// Ficou quase toda verde por volta de 1906; plano de pintura em 1906. "Protesto popular" é pouco documentado → omitido.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Balde, CortePatina, Escudo, Espessura, Estatua, Moeda, Pedestal, PlacaCobre, Porto, corCobre} from './arte';

export const FALAS = [
	"The Statue of Liberty wasn't always green. It used to be shiny, like a brand-new penny.",
	'When it was unveiled in 1886, its copper skin was a bright reddish-brown.',
	'And that skin is only about as thick as two pennies.',
	'But it stands in the harbor, in rain and salty sea air.',
	'Slowly, the copper reacted with the air and the water.',
	'It went dark brown, then dull, then green. In about twenty years, it was almost completely green.',
	'In 1906, officials even planned to paint it.',
	"But it turned out the green wasn't damage at all.",
	'That layer, called patina, seals the copper and protects it from the weather.',
	"So Lady Liberty isn't rusting. She's wearing armor.",
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const EstatuaNoPorto: React.FC<{idade: number; brilho?: number; escudo?: number; x?: number; s?: number}> = ({idade, brilho, escudo, x = 540, s = 0.8}) => (
	<g transform={`translate(${x}, 1250) scale(${s})`}>
		<Pedestal />
		<Estatua idade={idade} brilho={brilho} escudo={escudo} />
	</g>
);

// 0 — gancho: nem sempre foi verde — era brilhante como moeda nova
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBrilho = m('shiny'), tMoeda = m('penny');
	const idade = interpolate(f, [tBrilho - 4, tBrilho + 8], [1, 0], clamp);
	const moeda = usePop(tMoeda, 9);
	const pergunta = usePop(4, 10);
	return (
		<>
			<Camera de={[540, 800, 1.35]} para={[540, 900, 1.05]} dur={dur} soco={tBrilho + 4}>
				<Porto>
					<EstatuaNoPorto idade={idade} brilho={f >= tBrilho ? 1 : 0} />
				</Porto>
				{moeda > 0 && <g transform={`translate(860, 1050) scale(${moeda}) rotate(${(1 - moeda) * 90})`}><Moeda /></g>}
				{f < tBrilho && <Placa x={540} y={430} k={pergunta} txt="ALWAYS GREEN?" tam={80} cor="#fff" />}
			</Camera>
			<Sfx src="pop" em={4} vol={0.35} />
			<Sfx src="ding" em={tBrilho + 4} vol={0.45} />
			<Sfx src="pop" em={tMoeda} vol={0.45} />
		</>
	);
};

// 1 — inaugurada em 1886, de cobre marrom-avermelhado brilhante
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1886'), tCobre = m('copper'), tCor = m('reddishbrown');
	const ano = usePop(tAno, 10), cor = usePop(tCor, 10), cobre = usePop(tCobre, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 760, 1.4]} dur={dur}>
				<Porto>
					<EstatuaNoPorto idade={0} brilho={0.6} />
					{f >= tAno && [0, 1, 2].map((i) => {
						const t = ((f - tAno + i * 12) % 36) / 36;
						return <g key={i} transform={`translate(${220 + i * 320}, ${500 - t * 100})`} opacity={1 - t}>{Array.from({length: 10}).map((_, k) => <line key={k} x1={0} y1={0} x2={Math.cos(k * 0.63) * 90 * t} y2={Math.sin(k * 0.63) * 90 * t} stroke={['#ffd23f', '#e8463f', '#9fd3ff'][i]} strokeWidth={8} strokeLinecap="round" />)}</g>;
					})}
				</Porto>
				<Placa x={540} y={480} k={ano} txt="1886" tam={150} />
				{f >= tCobre && <Placa x={700} y={800} k={cobre} txt="COPPER" tam={70} cor="#d6804a" corTxt="#fff" rot={6} />}
				{cor > 0 && <g transform={`translate(300, 820) scale(${cor})`}><rect x={-90} y={-90} width={180} height={180} rx={20} fill={corCobre(0)} stroke="#241820" strokeWidth={10} /></g>}
			</Camera>
			<Sfx src="boom" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tCobre} vol={0.4} />
			<Sfx src="pop" em={tCor} vol={0.4} />
		</>
	);
};

// 2 — pele da espessura de duas moedas
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const tGrossa = m('thick');
	const k = usePop(Math.max(0, tGrossa - 12), 12);
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 940, 1.08]} dur={dur} soco={m('two')}>
				<rect width={W} height={H} fill="#1d2a66" />
				<circle cx={540} cy={960} r={600} fill="#26357a" />
				<g transform={`translate(560, 900) scale(${0.8 + k * 0.12})`}><Espessura k={Math.max(0.3, k)} /></g>
			</Camera>
			<Sfx src="pop" em={tGrossa - 6} vol={0.4} />
			<Sfx src="ding" em={m('two')} vol={0.35} />
		</>
	);
};

// 3 — no porto: chuva e maresia
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tChuva = m('rain'), tSal = m('salty');
	const chuva = interpolate(f, [tChuva - 4, tChuva + 6], [0, 1], clamp);
	const sal = interpolate(f, [tSal, tSal + 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.05]} para={[540, 900, 1.15]} dur={dur} tremor={chuva > 0 ? 2 : 0}>
				<Porto chuva={chuva} sal={sal} tempestade={chuva > 0.3}>
					<EstatuaNoPorto idade={0.1} />
				</Porto>
				{sal > 0 && <Placa x={760} y={560} k={sal} txt="SALT" tam={80} cor="#fff" rot={8} />}
			</Camera>
			<Sfx src="whoosh" em={tChuva - 4} vol={0.4} />
			<Sfx src="aviao" em={tChuva} vol={0.2} />
		</>
	);
};

// 4 — o cobre reage com o ar e a água
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tReage = m('reacted');
	const reage = interpolate(f, [tReage - 6, dur], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.3]} dur={dur}>
				<rect width={W} height={H} fill="#141e45" />
				<g transform="translate(540, 1060)"><PlacaCobre reage={reage} /></g>
				<Placa x={540} y={420} k={usePop(tReage, 10)} txt="CHEMISTRY!" tam={90} cor="#7cc24a" />
			</Camera>
			<Sfx src="pop" em={tReage} vol={0.4} />
		</>
	);
};

// 5 — marrom escuro, fosco, verde — 20 anos depois quase toda verde
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEscuro = m('dark'), tFosco = m('dull'), tVerde = m('green'), tVinte = m('twenty');
	const idade = f < tEscuro ? 0 : f < tFosco ? interpolate(f, [tEscuro, tEscuro + 10], [0, 0.33], clamp) : f < tVerde ? interpolate(f, [tFosco, tFosco + 10], [0.33, 0.66], clamp) : interpolate(f, [tVerde, tVerde + 12], [0.66, 1], clamp);
	const ano = Math.round(interpolate(f, [0, tVinte + 10], [1886, 1906], clamp));
	return (
		<>
			<Camera de={[540, 900, 1.1]} para={[540, 860, 1.2]} dur={dur} soco={tVerde}>
				<Porto>
					<EstatuaNoPorto idade={idade} />
				</Porto>
				<g transform="translate(540, 300)">
					<rect x={-220} y={-90} width={440} height={170} rx={30} fill="#111" stroke="#000" strokeWidth={10} />
					<text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill={ano >= 1906 ? '#5aff7a' : '#ffd23f'}>{ano}</text>
				</g>
				{/* tiras de cor */}
				{[0, 0.33, 0.66, 1].map((t, i) => (
					<g key={i} opacity={idade >= t - 0.01 ? 1 : 0.25}>
						<rect x={140 + i * 210} y={1480} width={170} height={90} rx={16} fill={corCobre(t)} stroke="#241820" strokeWidth={8} />
					</g>
				))}
			</Camera>
			<Sfx src="pop" em={tEscuro} vol={0.35} />
			<Sfx src="pop" em={tFosco} vol={0.35} />
			<Sfx src="ding" em={tVerde} vol={0.45} />
		</>
	);
};

// 6 — 1906: planejaram pintar a estátua
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1906'), tPintar = m('paint');
	const balde = usePop(tPintar, 9);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.05]} dur={dur} soco={tPintar}>
				<Porto>
					<EstatuaNoPorto idade={1} x={760} s={0.62} />
					<Personagem x={220} y={1800} escala={0.85} roupa="treinador" cabelo="#2d1f17" expressao="serio" olhar={1} bracoD={f >= tPintar ? 110 : 20} cotoveloD={-10} />
					<Personagem x={430} y={1820} escala={0.8} roupa="treinador" cor="#3b3f4a" cabelo="#c9c9c9" expressao="bravo" olhar={1} fase={2} />
					{balde > 0 && <g transform={`translate(330, 1560) scale(${balde})`}><Balde /></g>}
				</Porto>
				<Placa x={540} y={430} k={usePop(tAno, 10)} txt="1906" tam={140} />
				<Placa x={540} y={640} k={balde} txt="PAINT IT?" tam={90} cor="#e8463f" corTxt="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tPintar} vol={0.45} />
		</>
	);
};

// 7 — mas o verde não era dano nenhum
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDano = m('damage');
	const risca = interpolate(f, [tDano + 4, tDano + 10], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.2]} para={[540, 960, 1.1]} dur={dur} soco={tDano + 6}>
				<Porto>
					<EstatuaNoPorto idade={1} />
				</Porto>
				<g transform="translate(540, 700) rotate(-8)">
					<rect x={-300} y={-90} width={600} height={180} rx={20} fill="rgba(255,255,255,0.85)" stroke="#e8262f" strokeWidth={16} />
					<text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={120} fill="#e8262f">DAMAGE</text>
					{risca > 0 && <line x1={-320} y1={0} x2={-320 + 640 * risca} y2={0} stroke="#241820" strokeWidth={22} strokeLinecap="round" />}
				</g>
				{f >= tDano + 10 && <Interrogacao x={860} y={1000} inicio={tDano + 10} s={0.9} cor="#5aff7a" />}
			</Camera>
			<Sfx src="buzz" em={tDano + 6} vol={0.35} />
		</>
	);
};

// 8 — a pátina sela e protege o cobre
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPat = m('patina'), tProt = m('protects');
	const patina = interpolate(f, [tPat - 4, tPat + 10], [0, 1], clamp);
	const protege = interpolate(f, [tProt - 2, tProt + 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.05]} dur={dur}>
				<rect width={W} height={H} fill="#4a5568" />
				<g transform="translate(540, 880)"><CortePatina patina={patina} protege={protege} /></g>
				{protege > 0 && <g transform={`translate(860, 560) scale(${protege})`}><Escudo s={0.9} /></g>}
			</Camera>
			<Sfx src="pop" em={tPat} vol={0.4} />
			<Sfx src="ding" em={tProt} vol={0.4} />
		</>
	);
};

// 9 — não está enferrujando: está de armadura
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFerr = m('rusting'), tArm = m('armor');
	const escudo = interpolate(f, [tArm, tArm + 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
	return (
		<>
			<Camera de={[540, 760, 1.4]} para={[540, 880, 1.05]} dur={dur} soco={tArm}>
				<Porto>
					<EstatuaNoPorto idade={1} escudo={escudo} />
				</Porto>
				{f >= tFerr && f < tArm && <Placa x={540} y={600} k={1} txt="RUST?" tam={110} cor="#b5651d" corTxt="#fff" />}
				<Placa x={540} y={430} k={usePop(tArm + 4, 9)} txt="ARMOR" tam={140} cor="#5aff7a" />
				{f >= tArm && f < tArm + 6 && <LinhasImpacto op={0.3} cor="#9fe6ff" />}
			</Camera>
			<Sfx src="boom" em={tArm} vol={0.5} />
			<Sfx src="ding" em={tArm + 4} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'LibertyGreen',
	pastaVoz: 'voz-liberty-green',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['green', 'shiny', 'penny', '1886', 'copper', 'reddishbrown', 'thick', 'two', 'pennies', 'rain', 'salty', 'reacted', 'dark', 'dull', 'twenty', '1906', 'paint', 'damage', 'patina', 'protects', 'rusting', 'armor']),
};
export default ep;
