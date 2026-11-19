// Episódio 13 (EN): o ketchup já foi vendido como remédio (anos 1830).
// Fontes: PopSci, Chowhound, Tasting Table, The Daily Meal, Cracked (referência: historiador Andrew F. Smith).
// Bennett: 1834/1835 → "in the 1830s"; parceria com Archibald Miles (1837); cópias, algumas só laxante; moda acabou ~1850.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Batatas, Boticario, CaixaPilulas, Cartaz, Cogumelo, Frasco, PeixeK, Pilula, Tomate} from './arte';

export const FALAS = [
	'Ketchup used to be sold as medicine. Seriously.',
	"Early ketchups weren't even made from tomatoes. Some were made from mushrooms, others from fish.",
	'Then, in the 1830s, an Ohio doctor named John Cook Bennett made a bold claim.',
	'He said tomatoes could treat things like diarrhea and indigestion.',
	'So he turned tomato ketchup into pills.',
	'He teamed up with a drug maker, and tomato pills became a huge craze.',
	'Copycats rushed in, promising to cure almost anything.',
	"But some of those pills didn't contain any tomato at all. They were just laxatives.",
	'By around 1850, the tomato pill craze had faded away.',
	'So next time you grab the ketchup, remember: it used to be sold as a cure.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const DOUTOR = {roupa: 'treinador' as const, cor: '#2a2a2a', cabelo: '#c9c9c9'};

const Fundo: React.FC<{cor?: string}> = ({cor = '#f2c88a'}) => (
	<g>
		<rect width={W} height={H} fill={cor} />
		<circle cx={540} cy={900} r={620} fill="rgba(255,255,255,0.25)" />
		{Array.from({length: 24}).map((_, i) => <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1920} r={14} fill="rgba(255,255,255,0.3)" />)}
	</g>
);

// 0 — gancho: ketchup era vendido como remédio
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRem = m('medicine'), tSerio = m('seriously');
	const cruz = usePop(tRem, 9);
	return (
		<>
			<Camera de={[540, 900, 1.4]} para={[540, 900, 1.1]} dur={dur} soco={tSerio}>
				<Fundo />
				<g transform={`translate(540, 960) rotate(${Math.sin(f / 6) * 4})`}><Frasco s={1.6} /></g>
				{f >= tRem && (
					<g transform={`translate(800, 600) scale(${cruz})`}>
						<rect x={-110} y={-110} width={220} height={220} rx={30} fill="#fff" stroke="#241820" strokeWidth={10} />
						<rect x={-24} y={-80} width={48} height={160} fill="#e8392f" />
						<rect x={-80} y={-24} width={160} height={48} fill="#e8392f" />
					</g>
				)}
				<Placa x={540} y={1560} k={usePop(tSerio, 9)} txt="SERIOUSLY!" tam={110} cor="#ffd23f" />
			</Camera>
			<Sfx src="pop" em={tRem} vol={0.45} />
			<Sfx src="boom" em={tSerio} vol={0.4} />
		</>
	);
};

// 1 — os primeiros ketchups nem eram de tomate: cogumelo, peixe
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCog = m('mushrooms'), tPeixe = m('fish');
	const cog = usePop(tCog, 10), peixe = usePop(tPeixe, 10);
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.0]} dur={dur}>
				<Fundo cor="#bfe3a0" />
				<g transform="translate(540, 620)">
					<Tomate s={1.1} feliz={false} />
					<path d="M-150 -150 L150 150 M150 -150 L-150 150" stroke="#e8262f" strokeWidth={30} strokeLinecap="round" opacity={f > 10 ? 1 : 0} />
				</g>
				{cog > 0 && <g transform={`translate(320, 1460) scale(${cog * 1.1})`}><Cogumelo /></g>}
				{peixe > 0 && <g transform={`translate(770, 1460) scale(${peixe * 1.1})`}><PeixeK /></g>}
				<Placa x={540} y={260} k={usePop(4, 10)} txt="NO TOMATOES?!" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="buzz" em={10} vol={0.3} />
			<Sfx src="pop" em={tCog} vol={0.4} />
			<Sfx src="pop" em={tPeixe} vol={0.4} />
		</>
	);
};

// 2 — anos 1830: o médico John Cook Bennett, de Ohio, faz uma afirmação ousada
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1830s'), tBen = m('bennett'), tOusada = m('bold');
	return (
		<>
			<Camera de={[540, 1200, 1.2]} para={[540, 1100, 1.05]} dur={dur} soco={tOusada}>
				<Boticario>
					<Personagem x={540} y={1840} escala={1.05} {...DOUTOR} expressao={f >= tOusada ? 'feliz' : 'serio'} falando={f >= tOusada} bracoD={f >= tOusada ? 160 : 40} cotoveloD={10} />
				</Boticario>
				<Placa x={540} y={540} k={usePop(tAno, 10)} txt="1830s" tam={120} />
				<Placa x={540} y={720} k={usePop(tBen, 10)} txt="DR. JOHN COOK BENNETT" tam={56} cor="#fff" rot={3} />
				{f >= tOusada && f < tOusada + 6 && <LinhasImpacto op={0.3} />}
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tBen} vol={0.35} />
			<Sfx src="boom" em={tOusada} vol={0.35} />
		</>
	);
};

// 3 — tomate contra diarreia e indigestão
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTom = m('tomatoes'), tDiar = m('diarrhea'), tIndig = m('indigestion');
	const melhora = f >= tIndig + 12;
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.05]} dur={dur}>
				<Fundo cor="#cfe3f2" />
				<Personagem x={330} y={1820} escala={1.05} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao={melhora ? 'feliz' : 'enjoado'} enjoo={melhora ? 0 : 0.8} bracoD={melhora ? 160 : 28} cotoveloD={melhora ? 10 : -100} bracoE={28} cotoveloE={-100} />
				<g transform={`translate(800, 1000) scale(${usePop(tTom, 10)})`}><Tomate s={0.9} /></g>
				<Placa x={540} y={420} k={usePop(tDiar, 10)} txt="TUMMY TROUBLE?" tam={80} cor="#fff" />
				{melhora && <Placa x={760} y={1500} k={1} txt="CURED?!" tam={90} cor="#5aff7a" rot={6} />}
			</Camera>
			<Sfx src="pop" em={tTom} vol={0.4} />
			<Sfx src="barriga" em={tDiar} vol={0.6} />
			<Sfx src="ding" em={tIndig + 12} vol={0.35} />
		</>
	);
};

// 4 — transformou ketchup em pílulas
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPil = m('pills');
	const vira = interpolate(f, [tPil - 8, tPil + 6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 960, 1.15]} para={[540, 960, 1.3]} dur={dur} soco={tPil + 6}>
				<Fundo />
				{vira < 0.5 ? (
					<g transform={`translate(540, 980) scale(${1.4 * (1 - vira * 2)}) rotate(${vira * 360})`}><Frasco /></g>
				) : (
					<g transform={`translate(540, 940) scale(${1.6 * (vira - 0.5) * 2})`}><Pilula /></g>
				)}
				{vira >= 1 && [0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${200 + (i % 3) * 340}, ${560 + Math.floor(i / 3) * 820}) rotate(${i * 30}) scale(0.5)`}><Pilula /></g>)}
			</Camera>
			<Sfx src="whoosh" em={tPil - 8} vol={0.45} />
			<Sfx src="pop" em={tPil + 6} vol={0.5} />
		</>
	);
};

// 5 — parceria com um fabricante: virou mania
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFab = m('drug'), tMania = m('craze');
	const n = f < tMania ? 0 : Math.min(8, Math.floor((f - tMania) / 2));
	return (
		<>
			<Camera de={[540, 1150, 1.15]} para={[540, 1050, 1.05]} dur={dur}>
				<Boticario>
					<g transform="translate(540, 1110)"><CaixaPilulas s={1.1} /></g>
					<Personagem x={180} y={1860} escala={0.85} {...DOUTOR} expressao="feliz" olhar={1} />
					{f >= tFab - 4 && <Personagem x={900} y={1860} escala={0.85} roupa="executivo" cor="#5a3f6a" cabelo="#2d1f17" expressao="feliz" olhar={-1} fase={2} bracoE={100} cotoveloE={-20} />}
					{Array.from({length: n}).map((_, i) => <Personagem key={i} x={300 + (i % 4) * 160} y={1960 + Math.floor(i / 4) * 40} escala={0.5} roupa={i % 2 ? 'camponesa' : 'campones'} cor={['#5a8f6a', '#b8577a', '#4f7cc9', '#c9762e'][i % 4]} cabelo={['#4a3326', '#1d1d1d', '#c9a227'][i % 3]} expressao="feliz" bracoD={150} cotoveloD={20} fase={i} />)}
				</Boticario>
				<Placa x={540} y={300} k={usePop(tMania, 9)} txt="HUGE CRAZE" tam={110} cor="#ffd23f" />
			</Camera>
			<Sfx src="pop" em={tFab} vol={0.35} />
			{[0, 4, 8, 12].map((d) => <Sfx key={d} src="pop" em={tMania + d} vol={0.25} />)}
		</>
	);
};

// 6 — imitadores prometendo curar quase tudo
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCop = m('copycats'), tTudo = m('anything');
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1000, 1.0]} dur={dur} tremor={f >= tTudo ? 3 : 0}>
				<Fundo cor="#f2a65a" />
				{[[180, 'CURES ALL!'], [540, 'BEST PILLS!'], [900, 'MIRACLE!']].map(([x, txt], i) => {
					const k = usePop(tCop + i * 5, 10);
					return k > 0 ? (
						<g key={i}>
							<g transform={`translate(${x}, ${820 + (i % 2) * 80}) scale(${k * 0.8})`}><Cartaz txt={txt as string} /></g>
							<Personagem x={x as number} y={1860} escala={0.8 * k} roupa="executivo" cor={['#3b3f4a', '#6b4a36', '#22397a'][i]} cabelo={['#2d1f17', '#c9a227', '#1d1d1d'][i]} expressao="feliz" falando bracoD={120} cotoveloD={-20} itemD={<g transform="scale(0.35)"><CaixaPilulas rotulo="PILLS" cor={['#2f5bd3', '#3c8a4a', '#7a5a9a'][i]} /></g>} fase={i} />
						</g>
					) : null;
				})}
				<Placa x={540} y={300} k={usePop(tTudo, 9)} txt="CURES EVERYTHING!" tam={80} cor="#fff" />
			</Camera>
			{[0, 5, 10].map((d) => <Sfx key={d} src="pop" em={tCop + d} vol={0.35} />)}
		</>
	);
};

// 7 — algumas nem tinham tomate: eram só laxante
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTom = m('tomato'), tLax = m('laxatives');
	const abre = interpolate(f, [tTom - 4, tTom + 8], [0, 1], clamp);
	const lax = usePop(tLax, 9);
	return (
		<>
			<Camera de={[540, 960, 1.2]} para={[540, 960, 1.05]} dur={dur} soco={tLax}>
				<Fundo cor="#cfd5df" />
				<g transform="translate(540, 860) scale(2)"><Pilula aberta={abre} vazia /></g>
				{abre >= 1 && <Placa x={540} y={480} k={1} txt="NO TOMATO!" tam={100} cor="#e8262f" corTxt="#fff" rot={-4} />}
				{f >= tLax && (
					<g>
						<Placa x={540} y={1500} k={lax} txt="JUST LAXATIVES" tam={80} cor="#ffd23f" />
						<Personagem x={interpolate(f, [tLax, dur], [-100, 1200])} y={1880} escala={0.6} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao="assustado" bracoD={60 + Math.sin(f) * 40} bracoE={60 - Math.sin(f) * 40} inclinar={12} />
					</g>
				)}
			</Camera>
			<Sfx src="pop" em={tTom} vol={0.4} />
			<Sfx src="uhoh" em={tLax} vol={0.4} />
			<Sfx src="whoosh" em={tLax + 6} vol={0.35} />
		</>
	);
};

// 8 — por volta de 1850, a moda acabou
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1850'), tSumiu = m('faded');
	const some = interpolate(f, [tSumiu, tSumiu + 20], [1, 0], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1100, 1.1]} dur={dur}>
				<Boticario>
					<g transform="translate(540, 1110)" opacity={some}><CaixaPilulas s={1.1} /></g>
					<Personagem x={540} y={1700} escala={0.9} {...DOUTOR} expressao={some < 0.5 ? 'enjoado' : 'serio'} />
				</Boticario>
				<Placa x={540} y={300} k={usePop(tAno, 10)} txt="~1850" tam={130} />
				{some < 0.3 && <Interrogacao x={760} y={900} inicio={tSumiu + 14} s={0.9} />}
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="whoosh" em={tSumiu} vol={0.3} />
		</>
	);
};

// 9 — da próxima vez que pegar o ketchup: já foi vendido como cura
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tKet = m('ketchup'), tCura = m('cure');
	const cruz = usePop(tCura, 9);
	return (
		<>
			<Camera de={[540, 1100, 1.3]} para={[540, 960, 1.05]} dur={dur} soco={tCura}>
				<Fundo cor="#ffd9a8" />
				<g transform="translate(330, 1160)"><Batatas s={1.2} /></g>
				<g transform={`translate(760, 1060) rotate(${f >= tKet ? -25 : 0})`}><Frasco s={1.1} /></g>
				{f >= tCura && (
					<g transform={`translate(760, 520) scale(${cruz})`}>
						<rect x={-90} y={-90} width={180} height={180} rx={26} fill="#fff" stroke="#241820" strokeWidth={10} />
						<rect x={-20} y={-66} width={40} height={132} fill="#e8392f" />
						<rect x={-66} y={-20} width={132} height={40} fill="#e8392f" />
					</g>
				)}
				<Placa x={540} y={1600} k={usePop(tCura + 4, 9)} txt="ONCE A CURE!" tam={100} cor="#ffd23f" />
			</Camera>
			<Sfx src="pop" em={tKet} vol={0.35} />
			<Sfx src="ding" em={tCura} vol={0.45} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'Ketchup',
	pastaVoz: 'voz-ketchup',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['medicine', 'seriously', 'tomatoes', 'mushrooms', 'fish', '1830s', 'bennett', 'bold', 'diarrhea', 'indigestion', 'pills', 'craze', 'copycats', 'anything', 'tomato', 'laxatives', '1850', 'faded', 'ketchup', 'cure']),
};
export default ep;
