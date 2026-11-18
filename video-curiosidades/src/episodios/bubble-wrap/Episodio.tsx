// Episódio 14 (EN): o plástico-bolha era para ser papel de parede.
// Fontes: Smithsonian, Wikipedia (Bubble Wrap brand), Mental Floss, U.S. Embassy Japan (American View).
// 1957, Hawthorne (NJ), Alfred Fielding e Marc Chavannes; estufa; embalagem de computador em 1961 (sem citar a marca).
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Caixa, Computador, Cortina, Dedo, Estufa, FolhaBolhas, Oficina, SalaBolhas} from './arte';

export const FALAS = [
	'Bubble wrap was supposed to be wallpaper.',
	'In 1957, two engineers in New Jersey sealed two plastic shower curtains together, trapping air bubbles inside.',
	'Their big idea? Fancy, textured wallpaper.',
	'Nobody wanted it.',
	'So they tried selling it as greenhouse insulation.',
	'That flopped too.',
	'Then a computer company needed a way to ship its fragile new machines.',
	'And those little air bubbles were perfect.',
	'And honestly? Nobody can resist popping it.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ENG1 = {roupa: 'treinador' as const, cor: '#3b3f4a', cabelo: '#2d1f17'};
const ENG2 = {roupa: 'executivo' as const, cor: '#6b4a36', cabelo: '#c9a227'};

// 0 — gancho: era para ser papel de parede
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPP = m('wallpaper');
	return (
		<>
			<Camera de={[540, 900, 1.8]} para={[540, 960, 1.05]} dur={dur} soco={tPP}>
				{f < tPP ? (
					<g>
						<rect width={W} height={H} fill="#cfe8ff" />
						<g transform="translate(150, 300)"><FolhaBolhas cols={8} lins={14} r={38} estouradas={f > 10 ? [17, 26] : []} /></g>
					</g>
				) : (
					<SalaBolhas />
				)}
				<Placa x={540} y={1560} k={usePop(tPP, 9)} txt="WALLPAPER?!" tam={110} cor="#ffd23f" />
			</Camera>
			<Sfx src="pop" em={10} vol={0.5} />
			<Sfx src="whoosh" em={tPP - 3} vol={0.4} />
			<Sfx src="boom" em={tPP} vol={0.4} />
		</>
	);
};

// 1 — 1957: dois engenheiros selam duas cortinas de chuveiro
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1957'), tEng = m('engineers'), tCort = m('curtains'), tBolhas = m('bubbles');
	const junta = interpolate(f, [tCort, tCort + 20], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const bolhas = usePop(tBolhas, 10);
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1000, 1.05]} dur={dur}>
				<Oficina>
					{f >= tEng - 4 && (
						<>
							<Personagem x={170} y={1860} escala={0.85} {...ENG1} expressao="feliz" olhar={1} bracoD={90} cotoveloD={-20} />
							<Personagem x={910} y={1860} escala={0.85} {...ENG2} expressao="feliz" olhar={-1} bracoE={90} cotoveloE={-20} fase={2} />
						</>
					)}
					{f >= tCort - 6 && (
						<g transform="translate(0, 560)">
							<Cortina x={540 - 200 * (1 - junta)} cor="#f6a5b4" ang={-4 * (1 - junta)} />
							<Cortina x={540 + 200 * (1 - junta)} cor="#9fd3ff" ang={4 * (1 - junta)} />
						</g>
					)}
					{bolhas > 0 && <g transform={`translate(400, 700) scale(${bolhas})`} opacity={0.95}><FolhaBolhas cols={5} lins={6} r={26} /></g>}
				</Oficina>
				<Placa x={540} y={520} k={usePop(tAno, 10)} txt="1957" tam={130} />
				{bolhas > 0 && <Placa x={540} y={1560} k={bolhas} txt="AIR BUBBLES!" tam={90} cor="#fff" rot={4} />}
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.35} />
			<Sfx src="whoosh" em={tCort} vol={0.4} />
			{[0, 3, 6, 9].map((d) => <Sfx key={d} src="pop" em={tBolhas + d} vol={0.3} />)}
		</>
	);
};

// 2 — a grande ideia: papel de parede texturizado
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPP = m('wallpaper');
	return (
		<>
			<Camera de={[540, 900, 1.2]} para={[540, 960, 1.05]} dur={dur}>
				<SalaBolhas>
					<Personagem x={300} y={1820} escala={0.9} {...ENG1} expressao="feliz" olhar={1} bracoD={160} cotoveloD={10} />
					<Personagem x={780} y={1820} escala={0.9} {...ENG2} expressao="feliz" olhar={-1} bracoE={160} cotoveloE={10} fase={2} />
				</SalaBolhas>
				<Placa x={540} y={300} k={usePop(tPP - 4, 10)} txt="SO FANCY!" tam={110} cor="#ffd23f" rot={-4} />
			</Camera>
			<Sfx src="ding" em={tPP - 4} vol={0.4} />
		</>
	);
};

// 3 — ninguém quis
const C3: React.FC<PropsCena> = ({dur}) => {
	const f = useCurrentFrame();
	return (
		<>
			<Camera de={[540, 960, 1.15]} para={[540, 960, 1.25]} dur={dur} soco={2}>
				<SalaBolhas>
					<Personagem x={540} y={1820} escala={1} {...ENG1} expressao="enjoado" />
				</SalaBolhas>
				<rect width={W} height={H} fill="rgba(30,40,80,0.35)" />
				<Placa x={540} y={600} k={Math.min(1, f / 4)} txt="SOLD: 0" tam={130} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="buzz" em={1} vol={0.4} />
		</>
	);
};

// 4 — tentaram como isolante de estufa
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEst = m('greenhouse');
	const embr = interpolate(f, [tEst, tEst + 16], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 960, 1.05]} dur={dur}>
				<Estufa embrulhada={embr}>
					<Personagem x={940} y={1860} escala={0.75} {...ENG2} expressao="feliz" olhar={-1} bracoE={100} cotoveloE={-20} fase={2} />
				</Estufa>
				<Placa x={540} y={330} k={usePop(tEst, 10)} txt="GREENHOUSE?" tam={100} cor="#fff" />
			</Camera>
			<Sfx src="whoosh" em={tEst} vol={0.4} />
		</>
	);
};

// 5 — também fracassou
const C5: React.FC<PropsCena> = ({dur}) => {
	const f = useCurrentFrame();
	const k = interpolate(f, [2, 8], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.2]} para={[540, 960, 1.1]} dur={dur} soco={6} tremor={f > 6 && f < 14 ? 7 : 0}>
				<Estufa embrulhada={1} />
				{k > 0 && (
					<g transform={`translate(540, 820) rotate(-12) scale(${2 - k})`} opacity={k}>
						<rect x={-260} y={-100} width={520} height={200} rx={20} fill="rgba(255,255,255,0.2)" stroke="#e8262f" strokeWidth={18} />
						<text x={0} y={44} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={140} fill="#e8262f">FLOP</text>
					</g>
				)}
			</Camera>
			<Sfx src="boom" em={6} vol={0.4} />
		</>
	);
};

// 6 — uma empresa de computadores precisava enviar máquinas frágeis
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tComp = m('computer'), tFragil = m('fragile');
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 1050, 1.05]} dur={dur} tremor={f >= tFragil ? 3 : 0}>
				<rect width={W} height={H} fill="#d9dee8" />
				<rect y={1350} width={W} height={570} fill="#9aa6b8" />
				<g transform={`translate(540, 1360) rotate(${f >= tFragil ? Math.sin(f / 2) * 3 : 0})`}><Computador s={1.3} /></g>
				<Personagem x={160} y={1880} escala={0.75} roupa="executivo" cor="#22397a" cabelo="#1d1d1d" expressao={f >= tFragil ? 'assustado' : 'serio'} olhar={1} />
				<Placa x={540} y={330} k={usePop(tComp, 10)} txt="1961" tam={120} />
				<Placa x={540} y={1560} k={usePop(tFragil, 9)} txt="FRAGILE!" tam={110} cor="#e8262f" corTxt="#fff" rot={5} />
			</Camera>
			<Sfx src="pop" em={tComp} vol={0.35} />
			<Sfx src="uhoh" em={tFragil} vol={0.4} />
		</>
	);
};

// 7 — as bolhinhas eram perfeitas
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPerf = m('perfect');
	const desce = interpolate(f, [0, 16], [-500, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.25]} dur={dur} soco={tPerf}>
				<rect width={W} height={H} fill="#d9dee8" />
				<rect y={1350} width={W} height={570} fill="#9aa6b8" />
				<g transform="translate(540, 1500)">
					<Caixa>
						<g transform={`translate(0, ${desce - 120})`}>
							<g transform="translate(-260, -340)"><FolhaBolhas cols={8} lins={3} r={30} /></g>
							<g transform="translate(0, -30) scale(0.85)"><Computador s={0.75} /></g>
						</g>
					</Caixa>
				</g>
				{f >= tPerf && (
					<g transform="translate(540, 560)">
						<circle r={110 * usePopSafe(f, tPerf)} fill="#2fb35a" stroke="#241820" strokeWidth={10} />
						<path d="M-50 0 L-12 40 L56 -40" stroke="#fff" strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					</g>
				)}
				<Placa x={540} y={330} k={usePop(tPerf + 4, 9)} txt="PERFECT!" tam={110} cor="#5aff7a" />
			</Camera>
			<Sfx src="whoosh" em={0} vol={0.35} />
			<Sfx src="ding" em={tPerf} vol={0.45} />
		</>
	);
};
const usePopSafe = (f: number, t: number) => Math.min(1, (f - t) / 6);

// 8 — ninguém resiste a estourar
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPop = m('popping');
	const estouradas = Array.from({length: Math.max(0, Math.floor((f - 6) / 3))}).map((_, i) => (i * 5) % 42);
	const toca = (f % 6) < 3;
	return (
		<>
			<Camera de={[540, 900, 1.3]} para={[540, 960, 1.05]} dur={dur} soco={tPop}>
				<rect width={W} height={H} fill="#ffd9e6" />
				<g transform="translate(150, 330)"><FolhaBolhas cols={7} lins={6} r={50} estouradas={estouradas} /></g>
				<g transform={`translate(${150 + ((Math.floor(f / 3) * 5) % 42 % 7) * 115}, ${330 - 225 + Math.floor(((Math.floor(f / 3) * 5) % 42) / 7) * 115 + (toca ? 0 : -40)}) rotate(180)`}><Dedo s={0.75} /></g>
				<Personagem x={540} y={2020} escala={1} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao="feliz" />
				{f >= 6 && <text x={800} y={1100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke" transform={`rotate(${toca ? -8 : 6} 800 1100)`}>POP!</text>}
				<Placa x={540} y={1560} k={usePop(tPop, 9)} txt="CAN'T STOP!" tam={100} cor="#ffd23f" />
			</Camera>
			{Array.from({length: Math.floor(dur / 6)}).map((_, i) => <Sfx key={i} src="pop" em={6 + i * 6} vol={0.35} />)}
		</>
	);
};

const ep: DefEpisodio = {
	id: 'BubbleWrap',
	pastaVoz: 'voz-bubble-wrap',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8],
	destaques: new Set(['wallpaper', '1957', 'curtains', 'bubbles', 'nobody', 'greenhouse', 'flopped', 'computer', 'fragile', 'perfect', 'popping']),
};
export default ep;
