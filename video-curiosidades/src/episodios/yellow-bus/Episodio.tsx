// Episódio 10 (EN): por que os ônibus escolares são amarelos.
// Fontes: Columbia/Teachers College (obituário de Frank Cyr), Mental Floss, HowStuffWorks, College Board.
// Cor recomendada (NHTSA Guideline 17), não obrigatória por lei federal. "50 tons" vem da lembrança do próprio Cyr → "about".
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {AMARELO_BUS, CORAMOSTRA, LivroLei, Lupa, Onibus, OnibusAntigo, ParedeTintas, RuaEscola, VisaoMotorista} from './arte';

export const FALAS = [
	'School buses are yellow because of one professor and a wall full of paint.',
	'In the 1930s, school buses in America came in all kinds of colors and shapes.',
	'Every district did its own thing.',
	'So in 1939, a professor named Frank Cyr brought experts together to set one standard.',
	'He hung strips of paint on a wall: about fifty shades, from lemon yellow to deep orange-red.',
	'And the experts picked one special yellow.',
	'Why? Black letters on that yellow are easy to read, even at dawn and dusk.',
	"And it's hard for drivers to miss, even out of the corner of their eye.",
	"Funny thing: there's no federal law that says buses must be yellow.",
	'That one wall of paint just stuck... for more than eighty years.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PROF = {roupa: 'treinador' as const, cor: '#5b4a3c', cabelo: '#c9c9c9'};
const ESCOLHIDA = 12; // amostra destacada (um amarelo-alaranjado)

// 0 — gancho: um professor e uma parede de tinta
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tProf = m('professor'), tTinta = m('paint');
	const parede = f >= tTinta - 2;
	return (
		<>
			<Camera de={[540, 1250, 1.3]} para={[540, 1150, 1.1]} dur={dur} soco={tTinta}>
				{parede ? (
					<ParedeTintas n={50} destaque={ESCOLHIDA} />
				) : (
					<RuaEscola>
						<g transform="translate(560, 1560)"><Onibus s={1} /></g>
					</RuaEscola>
				)}
				{f >= tProf && <Personagem x={parede ? 200 : 900} y={1820} escala={0.85} {...PROF} expressao="feliz" olhar={parede ? 1 : -1} bracoD={parede ? 120 : 20} cotoveloD={-10} />}
				<Placa x={540} y={760} k={usePop(4, 10)} txt="WHY YELLOW?" tam={100} cor={AMARELO_BUS} />
			</Camera>
			<Sfx src="pop" em={4} vol={0.4} />
			<Sfx src="whoosh" em={tTinta - 3} vol={0.4} />
		</>
	);
};

// 1 — anos 1930: ônibus de todas as cores e formatos
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const t30 = m('1930s'), tCores = m('colors');
	const ano = usePop(t30, 10);
	const desfile = interpolate(f, [0, dur], [0.25, 1], clamp);
	const lista = [['#c8323f', 0], ['#2f5bd3', 1], ['#3c8a4a', 2], ['#8a5a2b', 0], ['#7a5a9a', 2]] as const;
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1150, 1.05]} dur={dur}>
				<RuaEscola>
					{lista.map(([cor, tipo], i) => (
						<g key={i} transform={`translate(${1500 - desfile * 2600 + i * 560}, ${1560 + (i % 2) * 120})`}><OnibusAntigo cor={cor} tipo={tipo} s={0.95} /></g>
					))}
				</RuaEscola>
				<Placa x={540} y={760} k={ano} txt="1930s" tam={140} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={t30} vol={0.4} />
			<Sfx src="aviao" em={tCores - 10} vol={0.25} />
		</>
	);
};

// 2 — cada distrito fazia do seu jeito
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDist = m('district');
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1150, 1.2]} dur={dur} tremor={2}>
				<RuaEscola>
					{[[220, '#c8323f', 1], [540, '#2f5bd3', 2], [860, '#3c8a4a', 0]].map(([x, cor, tipo], i) => (
						<g key={i} transform={`translate(${x}, ${1620}) rotate(${Math.sin(f / 4 + i) * 3})`}><OnibusAntigo cor={cor as string} tipo={tipo as number} s={0.55} /></g>
					))}
				</RuaEscola>
				<Placa x={540} y={760} k={usePop(tDist, 9)} txt="NO RULES" tam={110} cor="#e8463f" corTxt="#fff" rot={-4} />
			</Camera>
			<Sfx src="buzz" em={tDist} vol={0.3} />
		</>
	);
};

// 3 — 1939: Frank Cyr reúne especialistas para criar um padrão
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1939'), tFrank = m('frank'), tPadrao = m('standard');
	const nome = usePop(tFrank, 10), padrao = usePop(tPadrao, 9);
	return (
		<>
			<Camera de={[540, 1200, 1.2]} para={[540, 1100, 1.05]} dur={dur}>
				<rect width={W} height={H} fill="#d9cbb0" />
				<rect x={140} y={300} width={800} height={420} fill="#2f4a3a" stroke="#7a5230" strokeWidth={20} />
				<text x={540} y={460} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={70} fill="#f1ead8">School Bus</text>
				<text x={540} y={560} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={70} fill="#f1ead8">Standards</text>
				<rect y={1500} width={W} height={420} fill="#8a6a44" />
				<Personagem x={540} y={2060} escala={1.0} {...PROF} expressao="feliz" falando bracoD={130} cotoveloD={10} />
				{f >= tFrank + 6 && [160, 920, 330, 750].map((x, i) => (
					<Personagem key={x} x={x} y={1860 + (i > 1 ? -40 : 0)} escala={0.7} roupa="executivo" cor={['#3b3f4a', '#5a3f6a', '#6b4a36', '#22397a'][i]} cabelo={['#2d1f17', '#c9a227', '#1d1d1d', '#8a4b2a'][i]} expressao={f >= tPadrao ? 'feliz' : 'serio'} olhar={x < 540 ? 1 : -1} fase={i} />
				))}
				<Placa x={540} y={850} k={usePop(tAno, 10)} txt="1939" tam={120} />
				<Placa x={540} y={1030} k={nome} txt="PROF. FRANK CYR" tam={64} cor="#fff" rot={3} />
				{padrao > 0 && <Placa x={540} y={760} k={padrao} txt="ONE STANDARD" tam={80} cor={AMARELO_BUS} rot={-3} />}
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tFrank} vol={0.35} />
			<Sfx src="ding" em={tPadrao} vol={0.4} />
		</>
	);
};

// 4 — 50 faixas de tinta, do amarelo-limão ao laranja-avermelhado
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFaixas = m('strips'), tCinq = m('fifty'), tLimao = m('lemon'), tLaranja = m('orangered');
	const n = Math.round(interpolate(f, [tFaixas, tCinq + 10], [0, 50], clamp));
	const foco = f < tLimao ? [540, 900, 1.05] : f < tLaranja ? [200, 600, 1.7] : [880, 1250, 1.7];
	return (
		<>
			<Camera de={[540, 900, 1.05]} para={foco as [number, number, number]} dur={f < tLimao ? dur : 14}>
				<ParedeTintas n={n} />
				{f >= tCinq && f < tLimao && <Placa x={540} y={1600} k={1} txt={`${n} SHADES`} tam={100} cor="#fff" />}
			</Camera>
			<Sfx src="whoosh" em={tFaixas} vol={0.35} />
			<Sfx src="pop" em={tCinq} vol={0.4} />
			<Sfx src="whoosh" em={tLimao - 4} vol={0.3} />
			<Sfx src="whoosh" em={tLaranja - 4} vol={0.3} />
		</>
	);
};

// 5 — escolheram um amarelo especial
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEscolheu = m('picked');
	const zoom = interpolate(f, [tEscolheu, tEscolheu + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const col = ESCOLHIDA % 10, row = Math.floor(ESCOLHIDA / 10);
	const sx = 70 + col * 96 + 40, sy = 380 + row * 200 + 85;
	return (
		<>
			<Camera de={[540, 900, 1.05]} para={[sx, sy, 3.2]} dur={dur} soco={tEscolheu + 14}>
				<ParedeTintas n={50} destaque={ESCOLHIDA} />
				{zoom >= 1 && <circle cx={sx} cy={sy} r={110} fill="none" stroke="#000" strokeWidth={8} strokeDasharray="16 10" />}
				{zoom >= 1 && <text x={sx} y={sy + 170} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill="#fff" stroke="#000" strokeWidth={6} paintOrder="stroke">THIS ONE!</text>}
			</Camera>
			<Sfx src="ding" em={tEscolheu + 14} vol={0.45} />
		</>
	);
};

// 6 — letras pretas no amarelo: fácil de ler ao amanhecer e ao entardecer
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPreto = m('black'), tAmanhecer = m('dawn');
	const amanhecer = f >= tAmanhecer ? 1 : 0;
	return (
		<>
			<Camera de={[600, 1450, 1.6]} para={[540, 1300, 1.15]} dur={dur} soco={tPreto}>
				<RuaEscola amanhecer={amanhecer}>
					<g transform={`translate(${interpolate(f, [0, dur], [520, 600])}, 1620)`}><Onibus s={1.05} cor={CORAMOSTRA(ESCOLHIDA)} /></g>
				</RuaEscola>
				{f >= tPreto && f < tAmanhecer && <circle cx={480} cy={1470} r={190} fill="none" stroke="#ffd23f" strokeWidth={10} strokeDasharray="20 12" />}
				<Placa x={540} y={800} k={usePop(tAmanhecer, 10)} txt="EASY TO READ" tam={80} cor="#fff" rot={-3} />
			</Camera>
			<Sfx src="pop" em={tPreto} vol={0.4} />
			<Sfx src="ding" em={tAmanhecer} vol={0.35} />
		</>
	);
};

// 7 — difícil de não ver, até no canto do olho
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCanto = m('corner');
	const dest = interpolate(f, [tCanto, tCanto + 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.05]} para={[420, 1050, 1.15]} dur={dur}>
				<VisaoMotorista destaque={dest} />
				<g transform={`translate(${interpolate(f, [0, dur], [-200, 160])}, 1130) scale(0.42)`}><Onibus cor={CORAMOSTRA(ESCOLHIDA)} /></g>
				{dest > 0 && (
					<g transform="translate(720, 620)">
						<ellipse cx={0} cy={0} rx={130} ry={80} fill="#fff" stroke="#241820" strokeWidth={10} />
						<circle cx={-50 * dest} cy={0} r={46} fill="#2f5bd3" stroke="#241820" strokeWidth={8} />
						<circle cx={-50 * dest} cy={0} r={20} fill="#241820" />
					</g>
				)}
				<Placa x={540} y={420} k={usePop(tCanto + 4, 10)} txt="CAN'T MISS IT" tam={90} cor={AMARELO_BUS} />
			</Camera>
			<Sfx src="pop" em={tCanto} vol={0.4} />
		</>
	);
};

// 8 — não existe lei federal que obrigue
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tNao = m('no'), tLei = m('law');
	const livro = usePop(tNao - 6, 10);
	const busca = f >= tLei ? Math.sin((f - tLei) / 4) * 120 : 0;
	return (
		<>
			<Camera de={[540, 960, 1.15]} para={[540, 960, 1.05]} dur={dur}>
				<rect width={W} height={H} fill="#e9dcc0" />
				{livro > 0 && <g transform={`translate(540, 900) scale(${livro})`}><LivroLei /></g>}
				{f >= tLei && <g transform={`translate(${600 + busca}, ${760 + Math.cos((f - tLei) / 5) * 60})`}><Lupa /></g>}
				{f >= tLei + 12 && <Interrogacao x={860} y={520} inicio={tLei + 12} s={1.1} />}
				<Placa x={540} y={1500} k={usePop(tLei + 14, 10)} txt="NOT REQUIRED!" tam={90} cor="#e8463f" corTxt="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tNao - 6} vol={0.35} />
			<Sfx src="whoosh" em={tLei} vol={0.3} />
			<Sfx src="ding" em={tLei + 14} vol={0.35} />
		</>
	);
};

// 9 — aquela parede de tinta pegou… por mais de 80 anos
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPegou = m('stuck'), tOitenta = m('eighty');
	const ano = Math.round(interpolate(f, [tPegou, tOitenta + 10], [1939, 2026], clamp));
	return (
		<>
			<Camera de={[540, 1300, 1.3]} para={[540, 1100, 1.0]} dur={dur} soco={tOitenta}>
				<RuaEscola>
					{[0, 1, 2].map((i) => <g key={i} transform={`translate(${1400 - ((f * 9 + i * 700) % 2400)}, ${1560 + i * 110})`}><Onibus s={0.8} cor={CORAMOSTRA(ESCOLHIDA)} /></g>)}
				</RuaEscola>
				{f >= tPegou && (
					<g transform="translate(540, 640)">
						<rect x={-260} y={-100} width={520} height={190} rx={36} fill="#111" stroke="#000" strokeWidth={10} />
						<text x={0} y={45} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={130} fill={ano >= 2026 ? '#5aff7a' : AMARELO_BUS}>{ano}</text>
					</g>
				)}
				<Placa x={540} y={900} k={usePop(tOitenta + 6, 9)} txt="80+ YEARS" tam={110} cor={AMARELO_BUS} />
				{f >= tOitenta + 6 && f < tOitenta + 12 && <LinhasImpacto op={0.3} cor={AMARELO_BUS} />}
			</Camera>
			<Sfx src="whoosh" em={tPegou} vol={0.35} />
			<Sfx src="boom" em={tOitenta + 6} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'YellowBus',
	pastaVoz: 'voz-yellow-bus',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['yellow', 'professor', 'paint', '1930s', 'colors', 'district', '1939', 'frank', 'cyr', 'standard', 'fifty', 'lemon', 'orangered', 'picked', 'black', 'dawn', 'dusk', 'miss', 'corner', 'no', 'law', 'stuck', 'eighty']),
};
export default ep;
