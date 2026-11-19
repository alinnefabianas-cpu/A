// Episódio 4 (EN): a maratona olímpica de 1904 (St. Louis).
// Fontes: Smithsonian Magazine, Wikipedia (Athletics at the 1904 Summer Olympics – Men's marathon), AP.
// Deixado de fora por ser contestado: a história das maçãs do corredor cubano.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Cachorro, CarroAntigo, Chegada, Estrada, FrascoVeneno, Farmacia, GarrafaConhaque, Medalha, Termometro, Tesoura} from './arte';

export const FALAS = [
	'The 1904 Olympic marathon might be the craziest race ever run.',
	'It was scorching hot, the roads were dusty, and there was just one water stop.',
	"The first man across the finish line? He'd ridden in a car for eleven miles.",
	'He was disqualified.',
	'The real winner, Thomas Hicks, was kept going by his trainers... with rat poison and brandy.',
	'Back then, a tiny dose of that poison was used as a stimulant.',
	'A Cuban mail carrier ran it in his street clothes, with his pants cut short, and still finished fourth.',
	'Another runner was chased off course by wild dogs.',
	'Out of thirty-two starters, only fourteen finished.',
	'And Hicks? He crossed the line held up by his trainers. Gold medal.',
];

const CORES = ['#f4f4f4', '#e8c46a', '#9fd3ff', '#f6a5b4', '#cfe3a4'];
const corre = (f: number, i = 0) => ({inclinar: 8 + Math.sin(f * 0.8 + i) * 4, bracoD: 40 + Math.sin(f * 0.8 + i) * 30, bracoE: 40 - Math.sin(f * 0.8 + i) * 30, cotoveloD: 70, cotoveloE: 70});

// 0 — "talvez a corrida mais maluca da história"
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1904'), tMaluca = m('craziest');
	const ano = usePop(tAno), maluca = usePop(tMaluca, 9);
	const larg = f >= tMaluca;
	return (
		<>
			<Camera de={[540, 1250, 1.3]} para={[540, 1150, 1.1]} dur={dur} soco={tMaluca} tremor={larg ? 3 : 0}>
				<Estrada poeira={larg ? 0.5 : 0} />
				{[200, 400, 620, 840].map((x, i) => {
					const dy = larg ? -(f - tMaluca) * (6 + i * 2) : 0;
					return <Personagem key={x} x={x} y={1700 + dy} escala={0.75 - (larg ? Math.min(0.25, (f - tMaluca) * 0.006) : 0)} roupa="corredor" cor={CORES[i]} cabelo={['#4a3326', '#1d1d1d', '#c9a227', '#8a4b2a'][i]} numero={String(i * 7 + 3)} expressao={larg ? 'assustado' : 'serio'} fase={i} {...(larg ? corre(f, i) : {})} />;
				})}
				<Placa x={540} y={520} k={ano} txt="1904" tam={150} />
				<Placa x={540} y={860} k={maluca} txt="CRAZIEST RACE EVER?" tam={66} cor="#e8463f" corTxt="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.45} />
			<Sfx src="boom" em={tMaluca} vol={0.5} />
		</>
	);
};

// 1 — calor, poeira e uma única parada de água
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tQuente = m('scorching'), tPoeira = m('dusty'), tUma = m('one');
	const nivel = interpolate(f, [tQuente, tQuente + 20], [0.3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const carroX = interpolate(f, [tPoeira - 6, tPoeira + 30], [-500, 1500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const agua = usePop(tUma, 10);
	const poeira = interpolate(f, [tPoeira, tPoeira + 10, tUma - 4, tUma + 6], [0, 0.85, 0.85, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1250, 1.25]} para={[540, 1200, 1.15]} dur={dur} tremor={f >= tPoeira && f < tUma ? 3 : 0}>
				<Estrada calor={nivel} poeira={poeira}>
					{f >= tPoeira - 6 && f < tPoeira + 30 && <g transform={`translate(${carroX}, 1420)`}><CarroAntigo s={0.9} /></g>}
					<Personagem x={540} y={1780} escala={0.95} roupa="corredor" cor={CORES[0]} cabelo="#4a3326" numero="20" expressao="enjoado" enjoo={nivel * 0.4} {...corre(f)} />
				</Estrada>
				<g transform="translate(860, 900)"><Termometro nivel={nivel} s={1.1} /></g>
				{f >= tQuente && <text x={850} y={1140} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#e8262f" stroke="#000" strokeWidth={12} paintOrder="stroke">HOT!</text>}
				{agua > 0 && (
					<g transform={`translate(260, 860) scale(${agua})`}>
						<path d="M-80 -120 H80 L70 100 H-70Z" fill="#8a5a2b" stroke="#241820" strokeWidth={9} />
						<path d="M-84 -60 H84 M-80 40 H80" stroke="#3e2a1d" strokeWidth={10} />
						<rect x={-120} y={-300} width={240} height={140} rx={20} fill="#2f5bd3" stroke="#000" strokeWidth={10} />
						<text x={0} y={-250} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={46} fill="#fff">WATER</text>
						<text x={0} y={-180} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#ffd23f">x1</text>
					</g>
				)}
			</Camera>
			<Sfx src="whoosh" em={tPoeira - 4} vol={0.45} />
			<Sfx src="pop" em={tUma} vol={0.45} />
		</>
	);
};

// 2 — o primeiro a cruzar a linha tinha andado 11 milhas de carro
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tChegada = m('finish'), tCarro = m('ridden'), tOnze = m('eleven');
	const onze = usePop(tOnze, 9);
	if (f < tCarro - 2) {
		const x = interpolate(f, [0, tChegada + 6], [-200, 540], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
		return (
			<>
				<Camera de={[540, 1200, 1.2]} para={[540, 1150, 1.3]} dur={tCarro}>
					<Chegada fita={f < tChegada + 6}>
						<Personagem x={x} y={1700} escala={1} roupa="corredor" cor="#9fd3ff" cabelo="#1d1d1d" numero="31" expressao="feliz" {...(f >= tChegada + 6 ? {bracoD: 160, bracoE: 160, cotoveloD: 10, cotoveloE: 10} : corre(f))} />
					</Chegada>
					{f >= tChegada + 6 && <LinhasImpacto op={0.3} />}
				</Camera>
				<Sfx src="ding" em={tChegada + 6} vol={0.4} />
			</>
		);
	}
	return (
		<>
			<Camera de={[540, 1250, 1.3]} para={[600, 1250, 1.2]} dur={dur - tCarro}>
				<Estrada poeira={0.3}>
					<g transform={`translate(${interpolate(f, [tCarro, dur], [420, 620])}, 1700)`}>
						<Personagem x={-30} y={-210} escala={0.55} roupa="corredor" cor="#9fd3ff" cabelo="#1d1d1d" numero="31" expressao="feliz" semPernas bracoD={150} cotoveloD={20} />
						<CarroAntigo s={1.15} />
					</g>
				</Estrada>
				<Placa x={540} y={640} k={onze} txt="11 MILES" tam={120} cor="#ffd23f" />
				{f < tOnze && <Interrogacao x={840} y={980} inicio={tCarro + 2} s={1} />}
			</Camera>
			<Sfx src="whoosh" em={tCarro - 4} vol={0.4} />
			<Sfx src="pop" em={tOnze} vol={0.5} />
		</>
	);
};

// 3 — desclassificado
const C3: React.FC<PropsCena> = ({dur}) => {
	const f = useCurrentFrame();
	const k = interpolate(f, [2, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1150, 1.6]} para={[540, 1150, 1.5]} dur={dur} soco={6} tremor={f > 6 && f < 14 ? 7 : 0}>
				<Chegada fita={false} torcendo={false}>
					<Personagem x={540} y={1760} escala={1.1} roupa="corredor" cor="#9fd3ff" cabelo="#1d1d1d" numero="31" expressao="assustado" />
				</Chegada>
				{k > 0 && (
					<g transform={`translate(540, 1140) rotate(-12) scale(${2 - k})`} opacity={k}>
						<rect x={-420} y={-90} width={840} height={180} rx={20} fill="rgba(255,255,255,0.15)" stroke="#e8262f" strokeWidth={18} />
						<text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#e8262f">DISQUALIFIED</text>
					</g>
				)}
			</Camera>
			<Sfx src="buzz" em={6} vol={0.45} />
		</>
	);
};

// 4 — o vencedor de verdade, movido a veneno de rato e conhaque
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tHicks = m('hicks'), tTrein = m('trainers'), tRato = m('rat'), tConh = m('brandy');
	const nome = usePop(tHicks), rato = usePop(tRato, 9), conh = usePop(tConh, 9);
	const entra = interpolate(f, [tTrein - 4, tTrein + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1200, 1.1]} para={[540, 1180, 1.15]} dur={dur} tremor={f >= tConh ? 3 : 0}>
				<Estrada calor={0.6}>
					{entra > 0 && <Personagem x={interpolate(entra, [0, 1], [-200, 230])} y={1700} escala={0.8} roupa="treinador" cabelo="#2d1f17" expressao="serio" olhar={1} fase={2} bracoD={f >= tRato ? 100 : 20} cotoveloD={f >= tRato ? -20 : 10} />}
					{entra > 0 && <Personagem x={interpolate(entra, [0, 1], [1280, 850])} y={1700} escala={0.8} roupa="treinador" cor="#4a3a2e" cabelo="#4a3326" expressao="serio" olhar={-1} fase={4} bracoE={f >= tConh ? 100 : 20} cotoveloE={f >= tConh ? -20 : 10} />}
					<Personagem x={540} y={1780} escala={1} roupa="corredor" cor="#f4f4f4" cabelo="#4a3326" numero="20" expressao="enjoado" enjoo={0.5} inclinar={Math.sin(f / 5) * 10} {...{bracoD: 20, bracoE: 20}} />
				</Estrada>
				<Placa x={540} y={520} k={nome} txt="THOMAS HICKS" tam={80} cor="#fff" rot={-3} />
				{rato > 0 && <g transform={`translate(330, 1000) scale(${rato}) rotate(-10)`}><FrascoVeneno /></g>}
				{conh > 0 && <g transform={`translate(750, 1000) scale(${conh}) rotate(10)`}><GarrafaConhaque /></g>}
				{rato > 0 && <text x={330} y={1190} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">RAT POISON</text>}
				{conh > 0 && <text x={750} y={1190} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">BRANDY</text>}
			</Camera>
			<Sfx src="pop" em={tHicks} vol={0.4} />
			<Sfx src="whoosh" em={tTrein - 4} vol={0.35} />
			<Sfx src="uhoh" em={tRato} vol={0.45} />
			<Sfx src="pop" em={tConh} vol={0.45} />
		</>
	);
};

// 5 — na época, uma dose minúscula desse veneno era usada como estimulante
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tGota = m('tiny'), tEstim = m('stimulant');
	const gota = interpolate(f, [tGota, tGota + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const estim = usePop(tEstim, 9);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 900, 1.35]} dur={dur} soco={tEstim}>
				<Farmacia />
				<g transform="translate(540, 1050)"><FrascoVeneno s={2.4} /></g>
				{/* conta-gotas */}
				<g transform="translate(700, 480) rotate(30)">
					<rect x={-22} y={-140} width={44} height={60} rx={14} fill="#e8463f" stroke="#241820" strokeWidth={7} />
					<path d="M-14 -80 H14 L6 60 H-6Z" fill="#dff2ff" stroke="#241820" strokeWidth={6} />
				</g>
				{gota > 0 && <circle cx={720 - gota * 60} cy={560 + gota * 260} r={14} fill="#7cc24a" stroke="#241820" strokeWidth={4} />}
				{f >= tGota + 6 && <text x={300} y={600} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={72} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke" transform="rotate(-6 300 600)">TINY DOSE</text>}
				<Placa x={540} y={1500} k={estim} txt="1904 STIMULANT" tam={80} cor="#7cc24a" />
			</Camera>
			<Sfx src="pop" em={tGota + 14} vol={0.35} />
			<Sfx src="ding" em={tEstim} vol={0.35} />
		</>
	);
};

// 6 — carteiro cubano de roupa comum, calça cortada, e chegou em 4º
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCarta = m('mail'), tCalca = m('pants'), tQuarto = m('fourth');
	const cartas = usePop(tCarta, 10), quarto = usePop(tQuarto, 9);
	const tes = interpolate(f, [tCalca - 4, tCalca + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1250, 1.3]} para={[540, 1150, 1.15]} dur={dur} soco={tQuarto}>
				<Estrada calor={0.4}>
					<Personagem x={540} y={1760} escala={1.05} roupa="carteiro" cabelo="#1d1d1d" numero="3" expressao={f >= tQuarto ? 'feliz' : 'serio'} {...(f >= tQuarto ? {bracoD: 160, bracoE: 160, cotoveloD: 10, cotoveloE: 10} : corre(f))} />
				</Estrada>
				{cartas > 0 && f < tCalca &&
					[0, 1, 2].map((i) => (
						<g key={i} transform={`translate(${300 + i * 240}, ${780 - Math.sin(f / 6 + i) * 20}) rotate(${i * 12 - 12}) scale(${cartas})`}>
							<rect x={-80} y={-50} width={160} height={100} rx={8} fill="#fff" stroke="#241820" strokeWidth={7} />
							<path d="M-80 -50 L0 10 L80 -50" stroke="#241820" strokeWidth={6} fill="none" />
						</g>
					))}
				{tes > 0 && tes < 1 && <g transform={`translate(${380 + tes * 120}, 1560)`}><Tesoura s={1.1} abre={Math.abs(Math.sin(f / 2))} /></g>}
				{quarto > 0 && <g transform={`translate(820, 760) scale(${quarto}) rotate(10)`}><Medalha texto="4th" cor="#9fd3ff" /></g>}
			</Camera>
			<Sfx src="pop" em={tCarta} vol={0.4} />
			<Sfx src="whoosh" em={tCalca} vol={0.4} />
			<Sfx src="ding" em={tQuarto} vol={0.4} />
		</>
	);
};

// 7 — perseguido por cachorros selvagens
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCaes = m('dogs');
	const x = interpolate(f, [0, dur], [520, 760]);
	return (
		<>
			<Camera de={[480, 1300, 1.2]} para={[560, 1300, 1.2]} dur={dur} tremor={3}>
				<Estrada poeira={0.25}>
					<Personagem x={x} y={1700} escala={0.95} roupa="corredor" cor="#f6a5b4" cabelo="#1d1d1d" numero="35" expressao="assustado" olhar={-1} {...corre(f * 1.6)} />
					{f >= tCaes - 10 && [0, 1, 2].map((i) => <Cachorro key={i} x={x - 520 + i * 150 + Math.min(0, (f - tCaes) * 2)} y={1820 - i * 60} s={0.8} cor={['#8a5a2b', '#4a3a2e', '#c8935a'][i]} fase={i} />)}
				</Estrada>
				{f >= tCaes && <text x={300} y={1150} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={100} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke" transform="rotate(-10 300 1150)">WOOF!</text>}
			</Camera>
			<Sfx src="whoosh" em={tCaes - 6} vol={0.4} />
			<Sfx src="buzz" em={tCaes} vol={0.25} />
		</>
	);
};

// 8 — 32 largaram, só 14 terminaram
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const t32 = m('thirtytwo'), t14 = m('fourteen');
	const n = f < t14 ? 32 : 32 - Math.min(18, Math.floor((f - t14) / 0.9) + 1);
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.0]} dur={dur}>
				<rect width={W} height={H} fill="#1d2a66" />
				{Array.from({length: 32}).map((_, i) => {
					const c = i % 8, r = Math.floor(i / 8);
					const k = interpolate(f, [t32 + i * 0.6 - 4, t32 + i * 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					// exatamente 18 dos 32 saem (7 é primo com 32, então (i*7)%32 percorre 0..31 uma vez cada)
					const ordem = (i * 7) % 32;
					const fora = f >= t14 && ordem < 18 && (f - t14) > ordem * 0.9;
					return k > 0 ? (
						<g key={i} opacity={fora ? 0.25 : 1}>
							<Personagem x={135 + c * 116} y={760 + r * 300} escala={0.32 * k} roupa="corredor" cor={CORES[i % 5]} cabelo={['#4a3326', '#1d1d1d', '#c9a227'][i % 3]} expressao={fora ? 'enjoado' : 'serio'} fase={i} />
							{fora && <path d={`M${105 + c * 116} ${600 + r * 300} l60 60 M${165 + c * 116} ${600 + r * 300} l-60 60`} stroke="#e8262f" strokeWidth={12} strokeLinecap="round" />}
						</g>
					) : null;
				})}
				<g transform="translate(540, 320)">
					<rect x={-240} y={-110} width={480} height={200} rx={36} fill={n === 14 ? '#ffd23f' : '#fff'} stroke="#000" strokeWidth={12} />
					<text x={0} y={45} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={150} fill="#000">{n}</text>
				</g>
			</Camera>
			<Sfx src="pop" em={t32} vol={0.4} />
			<Sfx src="uhoh" em={t14} vol={0.45} />
		</>
	);
};

// 9 — Hicks cruzou a linha carregado pelos treinadores. Medalha de ouro.
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSeg = m('held'), tOuro = m('gold');
	const ouro = usePop(tOuro, 9);
	const x = interpolate(f, [0, tOuro], [200, 540], {extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1250, 1.25]} para={[540, 1100, 1.1]} dur={dur} soco={tOuro}>
				<Chegada fita={f < tOuro - 6}>
					<Personagem x={x - 190} y={1720} escala={0.85} roupa="treinador" cabelo="#2d1f17" expressao="serio" olhar={1} bracoD={70} cotoveloD={-30} fase={2} />
					<Personagem x={x + 190} y={1720} escala={0.85} roupa="treinador" cor="#4a3a2e" cabelo="#4a3326" expressao="serio" olhar={-1} bracoE={70} cotoveloE={-30} fase={4} />
					<Personagem x={x} y={1760} escala={0.95} roupa="corredor" cor="#f4f4f4" cabelo="#4a3326" numero="20" expressao={f >= tOuro ? 'feliz' : 'enjoado'} enjoo={f >= tOuro ? 0.2 : 0.6} inclinar={Math.sin(f / 4) * 8} bracoD={f >= tSeg ? 85 : 20} bracoE={f >= tSeg ? 85 : 20} cotoveloD={0} cotoveloE={0} />
				</Chegada>
				{ouro > 0 && <g transform={`translate(540, 960) scale(${ouro})`}><Medalha texto="1" /></g>}
				{f >= tOuro &&
					Array.from({length: 40}).map((_, i) => {
						const t = f - tOuro;
						const cx = (i * 97) % 1080, cy = -50 + t * (12 + (i % 5) * 3) + ((i * 53) % 300) - 300;
						return <rect key={i} x={cx + Math.sin(t / 5 + i) * 30} y={cy} width={18} height={28} fill={['#ffd23f', '#e8463f', '#2f5bd3', '#5aff7a'][i % 4]} transform={`rotate(${t * 9 + i * 20} ${cx} ${cy})`} />;
					})}
			</Camera>
			<Sfx src="boom" em={tOuro} vol={0.55} />
			<Sfx src="ding" em={tOuro + 4} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'Marathon1904',
	pastaVoz: 'voz-marathon-1904',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['1904', 'craziest', 'scorching', 'dusty', 'one', 'car', 'eleven', 'disqualified', 'rat', 'poison', 'brandy', 'tiny', 'stimulant', 'street', 'pants', 'fourth', 'dogs', 'thirtytwo', 'fourteen', 'gold', 'medal']),
};
export default ep;
