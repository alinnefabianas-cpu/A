// Episódio 15 (EN): a Grande Enchente de Melaço de Boston (15/jan/1919).
// Fontes: Smithsonian Magazine, Wikipedia (Great Molasses Flood), Boston Globe, History.com.
// ~2,3 milhões de galões; onda de até 25 pés (7,6 m) a ~35 mph; 21 mortos, ~150 feridos; limpeza de semanas;
// o tanque vazava e foi pintado de marrom; moradores diziam sentir cheiro de melaço em dias quentes por décadas.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Calendario, Cheiro, MELACO, Onda, Pa, Pincel, Poca, Rua, Sol, Tanque, Trem} from './arte';

export const FALAS = [
	'In 1919, a giant wave of molasses flooded the streets of Boston.',
	'A huge tank holding over two million gallons of molasses suddenly burst open.',
	'A sticky wave up to 25 feet tall rushed through the streets at about 35 miles per hour.',
	'It crushed buildings and even bent the steel of an elevated railway.',
	'Sadly, 21 people died, and the cleanup took weeks.',
	'Later, it came out the tank had leaked for years. The fix? They painted it brown, so the leaks would blend in.',
	'And locals claimed that on hot summer days, the whole neighborhood smelled sweet for decades.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 — gancho: onda de melaço inundando Boston
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1919'), tMel = m('molasses'), tBos = m('boston');
	const frente = interpolate(f, [tMel - 6, tBos + 10], [-150, 1300], {...clamp, easing: Easing.out(Easing.quad)});
	const fugiu = frente > 300;
	return (
		<>
			<Camera de={[540, 1200, 1.25]} para={[540, 1100, 1.05]} dur={dur} tremor={f >= tMel ? 5 : 0} soco={tBos}>
				<Rua>
					<Personagem x={interpolate(f, [tMel, dur], [560, 1250], clamp)} y={1840} escala={0.95} roupa="carteiro" cor="#3a4a7a" cabelo="#4a3326" expressao={f >= tMel - 4 ? 'assustado' : 'neutro'} olhar={-1} bracoD={fugiu ? 150 : 30} bracoE={fugiu ? 150 : 30} cotoveloD={-20} cotoveloE={-20} inclinar={fugiu ? 10 : 0} fase={1} />
					<Onda frente={frente} alt={760} />
				</Rua>
				<Placa x={540} y={300} k={usePop(tAno, 10)} txt="1919" tam={130} />
				<Placa x={540} y={480} k={usePop(tBos, 10)} txt="BOSTON" tam={90} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="whoosh" em={tMel - 6} vol={0.5} />
			<Sfx src="boom" em={tBos} vol={0.4} />
		</>
	);
};

// 1 — tanque gigante com mais de 2 milhões de galões estoura
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTanque = m('tank'), tMilhoes = m('million'), tEstoura = m('burst');
	const racha = interpolate(f, [tEstoura - 14, tEstoura], [0, 1], clamp);
	const estourou = f >= tEstoura + 2;
	const jorro = interpolate(f, [tEstoura, tEstoura + 25], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1050, 1.0]} dur={dur} tremor={estourou ? 9 * (1 - jorro * 0.6) : f >= tEstoura - 14 ? 2 : 0} soco={tEstoura}>
				<Rua semTrilho ceu="#d6c9a8">
					<g transform={`translate(540, 1420) scale(${usePop(tTanque - 6, 12)})`}>
						{!estourou && <Tanque racha={racha} />}
						{estourou && (
							<g>
								<path d="M-260 0 L-260 -380 L-200 -460 L-150 -330 L-260 -300Z" fill="#9aa1ad" stroke="#241820" strokeWidth={10} transform={`translate(${-jorro * 160}, 0) rotate(${-jorro * 30})`} />
								<path d="M260 0 L260 -420 L190 -500 L150 -360 L260 -320Z" fill="#9aa1ad" stroke="#241820" strokeWidth={10} transform={`translate(${jorro * 160}, 0) rotate(${jorro * 30})`} />
								<ellipse cx={0} cy={-40 - jorro * 100} rx={260 + jorro * 500} ry={120 + jorro * 300} fill={MELACO} stroke="#241820" strokeWidth={10} />
							</g>
						)}
					</g>
				</Rua>
				<Placa x={540} y={320} k={usePop(tMilhoes, 10)} txt="2,300,000 GALLONS" tam={78} />
				{estourou && f < tEstoura + 6 && <LinhasImpacto op={0.45} />}
				<Placa x={540} y={1650} k={usePop(tEstoura + 3, 9)} txt="BOOM!" tam={130} cor="#e8262f" corTxt="#fff" rot={5} />
			</Camera>
			<Sfx src="pop" em={tTanque} vol={0.35} />
			<Sfx src="ding" em={tMilhoes} vol={0.35} />
			<Sfx src="boom" em={tEstoura} vol={0.65} />
		</>
	);
};

// 2 — onda de até 25 pés a ~35 milhas por hora
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const t25 = m('25'), t35 = m('35');
	const alt = interpolate(f, [t25 - 10, t25 + 8], [300, 1100], {...clamp, easing: Easing.out(Easing.back(1.4))});
	const frente = interpolate(f, [0, t35, dur], [380, 520, 1400], clamp);
	const rapido = f >= t35;
	return (
		<>
			<Camera de={[540, 1100, 1.05]} para={[600, 1050, 1.0]} dur={dur} tremor={rapido ? 6 : 3}>
				<Rua semTrilho>
					<Personagem x={rapido ? interpolate(f, [t35, dur], [820, 1300], clamp) : 820} y={1990} escala={0.9} roupa="campones" cor="#5a8f6a" cabelo="#1d1d1d" expressao="assustado" olhar={-1} bracoD={150} bracoE={150} cotoveloD={-20} cotoveloE={-20} fase={2} />
					<Onda frente={frente} alt={alt} />
					{f >= t25 && !rapido && (
						<g transform={`translate(${frente + 230}, 0)`}>
							<line x1={0} y1={1880} x2={0} y2={1920 - alt} stroke="#fff" strokeWidth={12} />
							<path d={`M-30 ${1920 - alt + 40} L0 ${1920 - alt} L30 ${1920 - alt + 40}`} stroke="#fff" strokeWidth={12} fill="none" />
						</g>
					)}
					{rapido && Array.from({length: 7}).map((_, i) => <line key={i} x1={frente - 400 - (f * 30 + i * 90) % 300} y1={900 + i * 110} x2={frente - 200 - (f * 30 + i * 90) % 300} y2={900 + i * 110} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.7} />)}
				</Rua>
				<Placa x={540} y={300} k={usePop(t25, 10)} txt="25 FEET TALL" tam={100} />
				<Placa x={540} y={480} k={usePop(t35, 10)} txt="35 MPH" tam={110} cor="#e8262f" corTxt="#fff" rot={5} />
			</Camera>
			<Sfx src="whoosh" em={t25 - 10} vol={0.5} />
			<Sfx src="pop" em={t25} vol={0.4} />
			<Sfx src="whoosh" em={t35} vol={0.55} />
		</>
	);
};

// 3 — esmagou prédios e entortou o aço do trilho elevado
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEsm = m('crushed'), tEnt = m('bent');
	const amassa = interpolate(f, [tEsm, tEsm + 8], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	const estrago = interpolate(f, [tEnt, tEnt + 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 900, 1.05]} dur={dur} tremor={f >= tEsm ? 5 : 0} soco={tEnt}>
				<Rua amassa={amassa} estrago={estrago}>
					<g transform={`translate(${interpolate(f, [0, tEnt], [-300, 540], clamp)}, ${700 + estrago * 160}) rotate(${estrago * 6})`}><Trem s={0.8} /></g>
					<Poca y={1360} alt={600} />
				</Rua>
				<Placa x={540} y={260} k={usePop(tEsm, 10)} txt="CRUSHED!" tam={110} cor="#fff" />
				<Placa x={540} y={1620} k={usePop(tEnt + 4, 10)} txt="BENT STEEL!" tam={100} rot={4} />
			</Camera>
			<Sfx src="boom" em={tEsm} vol={0.5} />
			<Sfx src="boom" em={tEnt} vol={0.5} />
		</>
	);
};

// 4 — 21 mortos; a limpeza levou semanas (tom respeitoso)
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const t21 = m('21'), tSem = m('weeks');
	const kSem = usePop(tSem, 10);
	const paginas = f >= tSem ? Math.min(3, Math.floor((f - tSem) / 6)) : 0;
	return (
		<>
			<Camera de={[540, 1200, 1.1]} para={[540, 1150, 1.05]} dur={dur}>
				<Rua semTrilho ceu="#9aa7b4">
					<Poca y={1420} alt={600} />
					{[220, 540, 860].map((x, i) => (
						<Personagem key={x} x={x} y={2010} escala={0.75} roupa="bombeiro" expressao="serio" olhar={i === 2 ? -1 : 1} bracoD={70 + Math.sin(f / 5 + i) * 20} cotoveloD={-40} itemD={<g transform="scale(0.8)"><Pa /></g>} fase={i} />
					))}
				</Rua>
				<Placa x={540} y={320} k={usePop(t21, 14)} txt="21 LIVES LOST" tam={90} cor="#2a2e38" corTxt="#fff" rot={0} />
				{f >= tSem && <g transform={`translate(540, 820) scale(${kSem})`}><Calendario txt={['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEKS!'][paginas]} /></g>}
			</Camera>
			<Sfx src="pop" em={tSem} vol={0.35} />
		</>
	);
};

// 5 — o tanque vazava há anos; a "solução": pintar de marrom
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVaz = m('leaked'), tFix = m('fix'), tPint = m('painted'), tMarrom = m('brown'), tDisf = m('blend');
	const tinta = interpolate(f, [tPint, tDisf], [0, 1], clamp);
	const pincelY = 760 - 700 * (1 - tinta) + 20;
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.05]} dur={dur} soco={tMarrom}>
				<Rua semTrilho ceu="#d6c9a8">
					<g transform="translate(540, 1460)"><Tanque vaza={f >= tVaz} tinta={tinta} /></g>
					{f >= tPint && f < tDisf + 10 && <g transform={`translate(${540 + Math.sin(f / 2) * 200}, ${1460 - 700 + pincelY}) rotate(${Math.sin(f / 2) * 20})`}><Pincel s={1.3} /></g>}
					<Personagem x={170} y={1880} escala={0.8} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao={f >= tPint ? 'feliz' : 'serio'} olhar={1} bracoD={f >= tFix && f < tPint ? 150 : 30} cotoveloD={-20} fase={3} />
				</Rua>
				<Placa x={540} y={260} k={usePop(tVaz, 10)} txt="LEAKING FOR YEARS" tam={78} cor="#fff" />
				{f >= tFix && f < tPint && <Interrogacao x={330} y={1100} inicio={tFix} s={0.9} />}
				<Placa x={600} y={1650} k={usePop(tMarrom, 9)} txt="PAINT IT BROWN?!" tam={90} rot={4} />
			</Camera>
			<Sfx src="pop" em={tVaz} vol={0.35} />
			<Sfx src="uhoh" em={tFix} vol={0.4} />
			<Sfx src="whoosh" em={tPint} vol={0.35} />
			<Sfx src="ding" em={tMarrom} vol={0.4} />
		</>
	);
};

// 6 — em dias quentes, o bairro cheirava doce por décadas
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tQuente = m('hot'), tDoce = m('sweet'), tDec = m('decades');
	const kSol = usePop(tQuente - 4, 10);
	return (
		<>
			<Camera de={[540, 1200, 1.2]} para={[540, 1050, 1.05]} dur={dur} soco={tDec}>
				<Rua semTrilho ceu="#ffe2a0">
					{f >= tQuente - 4 && <g transform={`translate(860, 300) scale(${kSol}) translate(-860, -300)`}><Sol x={860} y={300} /></g>}
					{f >= tDoce - 6 && <><Cheiro x={300} y={1350} /><Cheiro x={780} y={1300} /></>}
					<Personagem x={540} y={2080} escala={1.0} roupa="camponesa" cor="#b8577a" cabelo="#4a3326" expressao={f >= tDoce ? 'feliz' : 'confuso'} olhar={-1} inclinar={f >= tDoce ? -6 : 0} fase={4} />
				</Rua>
				<Placa x={540} y={600} k={usePop(tDoce, 10)} txt="SMELLS SWEET..." tam={90} cor="#fff" />
				<Placa x={540} y={780} k={usePop(tDec, 9)} txt="FOR DECADES!" tam={110} rot={4} />
			</Camera>
			<Sfx src="ding" em={tQuente} vol={0.3} />
			<Sfx src="pop" em={tDoce} vol={0.35} />
			<Sfx src="boom" em={tDec} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'MolassesFlood',
	pastaVoz: 'voz-molasses-flood',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6],
	destaques: new Set(['1919', 'molasses', 'boston', 'tank', 'million', 'burst', '25', '35', 'crushed', 'bent', 'steel', '21', 'weeks', 'leaked', 'fix', 'painted', 'brown', 'blend', 'hot', 'sweet', 'decades']),
};
export default ep;
