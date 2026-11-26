// Episódio 5 (EN): por que as janelas de avião são redondas.
// Fontes: Engineers Ireland ("What do the Comet aircraft failures teach us"), Aeroxplorer, New Atlas.
// Cuidado de precisão: a falha foi fadiga do metal com tensão concentrada em cantos de aberturas
// (a rachadura do acidente de Elba começou numa abertura do teto), não "só as janelas quadradas".
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Balao, Ceu, Check, Coracao, DiagramaTensao, JanelaCabine, JatoAntigo, Manometro, Respira, Tanque} from './arte';

export const FALAS = [
	'Why are airplane windows round? Because sharp corners can rip a plane apart.',
	"In 1952, the world's first jet airliner took off, with big, nearly square windows.",
	'Passengers loved the view.',
	'But in 1954, two of these jets broke apart in mid-air.',
	'Investigators sank an entire plane in a giant water tank, and pressurized it over and over.',
	'Every flight, the cabin swells like a balloon, then shrinks back.',
	'And that stress piles up at sharp corners, like the corners of windows and hatches.',
	'Tiny cracks grew there, until the metal gave way.',
	"A rounded window spreads the stress out, so there's no weak point.",
	"So that little round window? It's quietly keeping you alive.",
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 — gancho: janela redonda vira quadrada… e racha
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRed = m('round'), tQuina = m('sharp'), tRasga = m('rip');
	const forma = interpolate(f, [tQuina - 2, tQuina + 8], [0, 1], clamp);
	const rach = interpolate(f, [tRasga, tRasga + 10], [0, 1], clamp);
	const pulso = f >= tRed && f < tQuina ? 1 + 0.04 * Math.sin((f - tRed) / 2) : 1;
	return (
		<>
			<Camera de={[540, 860, 1.5 * pulso]} para={[540, 880, 1.3]} dur={dur} soco={tRasga} tremor={f >= tRasga ? 8 : 0}>
				<JanelaCabine forma={forma} brilhoCantos={interpolate(f, [tQuina + 4, tRasga], [0, 1], clamp)} rach={rach} />
				{f >= tRasga && f < tRasga + 8 && <LinhasImpacto op={0.4} cor="#ffd23f" />}
			</Camera>
			<Sfx src="pop" em={tRed} vol={0.35} />
			<Sfx src="whoosh" em={tQuina - 3} vol={0.4} />
			<Sfx src="boom" em={tRasga} vol={0.65} />
		</>
	);
};

// 1 — 1952: o primeiro jato comercial, com janelas quase quadradas
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1952'), tPrim = m('first'), tQuad = m('square');
	const ano = usePop(tAno), prim = usePop(tPrim, 12);
	const x = interpolate(f, [0, tQuad], [260, 560], {...clamp, easing: Easing.out(Easing.quad)});
	const y = interpolate(f, [0, tQuad], [1250, 980], clamp);
	const zoomJanela = f >= tQuad;
	return (
		<>
			<Camera de={[540, 1000, 1.05]} para={zoomJanela ? [560, 980, 1.0] : [540, 1000, 1.05]} dur={dur} soco={tQuad}>
				<Ceu>
					<g transform={`translate(${x}, ${y}) rotate(${interpolate(f, [0, tQuad], [-12, -3], clamp)}) scale(${zoomJanela ? interpolate(f, [tQuad, tQuad + 12], [1.1, 1.9], clamp) : 1.1})`}>
						<JatoAntigo destaque={zoomJanela} />
					</g>
				</Ceu>
				<Placa x={540} y={430} k={ano} txt="1952" tam={150} />
				<Placa x={540} y={640} k={prim} txt="FIRST JET AIRLINER" tam={66} cor="#fff" rot={3} />
				{zoomJanela && <text x={540} y={1450} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={100} fill="#ffd23f" stroke="#000" strokeWidth={14} paintOrder="stroke">SQUARE-ISH</text>}
			</Camera>
			<Sfx src="aviao" em={0} vol={0.3} />
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="pop" em={tQuad} vol={0.45} />
		</>
	);
};

// 2 — os passageiros amavam a vista
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAmou = m('loved');
	const cor = usePop(tAmou, 9);
	return (
		<>
			<Camera de={[500, 1000, 1.25]} para={[520, 980, 1.15]} dur={dur}>
				<JanelaCabine forma={1} />
				<Personagem x={260} y={1820} escala={1.1} roupa="passageiro" cor="#d9a03a" cabelo="#4a3326" expressao="feliz" olhar={1} semPernas />
				{cor > 0 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${300 + i * 90}, ${880 - i * 80 - (f - tAmou) * 2}) scale(${cor * (0.7 + i * 0.15)})`}><Coracao /></g>)}
			</Camera>
			<Sfx src="ding" em={tAmou} vol={0.35} />
		</>
	);
};

// 3 — 1954: dois desses jatos se partiram no ar
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1954'), tDois = m('two'), tPartiu = m('broke');
	const ano = usePop(tAno), dois = usePop(tDois, 10);
	const partido = interpolate(f, [tPartiu, tPartiu + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.2]} dur={dur} soco={tPartiu} tremor={f >= tPartiu && f < tPartiu + 14 ? 8 : 0}>
				<Ceu tempestade>
					<g transform={`translate(540, ${1050 + partido * 120})`}><JatoAntigo s={1.15} partido={partido} /></g>
					{dois > 0 && f < tPartiu && <g transform={`translate(720, 1480) scale(${dois * 0.45})`}><JatoAntigo /></g>}
				</Ceu>
				<Placa x={540} y={430} k={ano} txt="1954" tam={150} cor="#e8463f" corTxt="#fff" />
				{dois > 0 && <text x={720} y={1700} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">x2</text>}
			</Camera>
			<Sfx src="alarme" em={tAno} vol={0.2} />
			<Sfx src="boom" em={tPartiu} vol={0.7} />
		</>
	);
};

// 4 — investigadores afundaram um avião inteiro num tanque e pressurizaram sem parar
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tInv = m('investigators'), tTanque = m('tank'), tPress = m('pressurized');
	const inv = usePop(tInv, 12);
	const afunda = interpolate(f, [tTanque - 10, tTanque + 20], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const ligado = f >= tPress;
	const ciclos = ligado ? Math.floor((f - tPress) / 3) * 37 + 1 : 0;
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1000, 1.05]} dur={dur}>
				<Tanque afunda={afunda} pressao={ligado ? 1 : 0} />
				{inv > 0 && <Personagem x={170} y={1880} escala={0.75 * inv} roupa="executivo" cor="#6b6f7a" cabelo="#2d1f17" expressao="serio" olhar={1} bracoD={70} cotoveloD={-30} itemD={<rect x={-40} y={-80} width={80} height={110} rx={8} fill="#f6ead0" stroke="#241820" strokeWidth={6} />} />}
				{ligado && <g transform="translate(860, 1730) scale(0.75)"><Manometro v={0.5 + 0.45 * Math.sin((f - tPress) / 2.5)} /></g>}
				{ligado && (
					<g transform="translate(540, 330)">
						<rect x={-330} y={-80} width={660} height={150} rx={30} fill="#111" stroke="#000" strokeWidth={10} />
						<text x={0} y={30} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#5aff7a">CYCLES: {ciclos.toLocaleString('en-US')}</text>
					</g>
				)}
			</Camera>
			<Sfx src="pop" em={tInv} vol={0.35} />
			<Sfx src="whoosh" em={tTanque - 8} vol={0.4} />
			<Sfx src="buzz" em={tPress} vol={0.2} />
		</>
	);
};

// 5 — a cabine incha como um balão e encolhe de novo
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tIncha = m('swells'), tBalao = m('balloon'), tEncolhe = m('shrinks');
	const infla = f < tIncha ? 0 : f < tEncolhe ? interpolate(f, [tIncha, tIncha + 12], [0, 1], clamp) : interpolate(f, [tEncolhe, tEncolhe + 12], [1, 0], clamp);
	const balao = usePop(tBalao, 10);
	return (
		<>
			<Camera de={[540, 960, 1.05]} para={[540, 960, 1.0]} dur={dur}>
				<Respira infla={infla} />
				{balao > 0 && <g transform={`translate(860, 380) scale(${balao})`}><Balao infla={infla} s={0.9} /></g>}
				<text x={540} y={1560} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={90} fill={infla > 0.5 ? '#ffd23f' : '#9fd3ff'} stroke="#000" strokeWidth={14} paintOrder="stroke">{infla > 0.5 ? 'SWELL' : f >= tEncolhe ? 'SHRINK' : ''}</text>
			</Camera>
			<Sfx src="whoosh" em={tIncha} vol={0.35} />
			<Sfx src="pop" em={tBalao} vol={0.4} />
			<Sfx src="whoosh" em={tEncolhe} vol={0.3} />
		</>
	);
};

// 6 — a tensão se acumula nos cantos (diagrama, janela quadrada)
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTensao = m('stress'), tCantos = m('corners');
	const calor = interpolate(f, [tTensao, tCantos + 10], [0.1, 1], clamp);
	const placa = usePop(tCantos, 10);
	return (
		<>
			<Camera de={[540, 900, 1.05]} para={[700, 760, 1.35]} dur={dur}>
				<DiagramaTensao forma={1} calor={calor} />
				<Placa x={540} y={330} k={usePop(tTensao, 12)} txt="STRESS" tam={110} cor="#e8463f" corTxt="#fff" rot={-3} />
				{placa > 0 && (
					<g>
						{[[350, 710], [730, 710], [350, 1090], [730, 1090]].map(([x, y], i) => (
							<g key={i} transform={`translate(${x}, ${y}) scale(${placa})`}>
								<circle r={70} fill="none" stroke="#ffd23f" strokeWidth={12} strokeDasharray="20 12" />
							</g>
						))}
					</g>
				)}
			</Camera>
			<Sfx src="buzz" em={tTensao} vol={0.2} />
			<Sfx src="pop" em={tCantos} vol={0.45} />
		</>
	);
};

// 7 — rachaduras crescem até o metal ceder
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRach = m('cracks'), tCede = m('gave');
	const rach = interpolate(f, [tRach, tCede], [0, 1], clamp);
	const quebra = interpolate(f, [tCede, tCede + 10], [0, 1], clamp);
	return (
		<>
			<Camera de={[760, 680, 1.6]} para={[700, 760, 1.3]} dur={dur} soco={tCede} tremor={f >= tCede ? 8 : 0}>
				<DiagramaTensao forma={1} calor={1} rach={rach} quebra={quebra} />
				{f >= tCede && f < tCede + 6 && <LinhasImpacto op={0.4} />}
			</Camera>
			<Sfx src="uhoh" em={tRach} vol={0.4} />
			<Sfx src="boom" em={tCede} vol={0.65} />
		</>
	);
};

// 8 — a janela redonda espalha a tensão: sem ponto fraco
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRed = m('rounded'), tEsp = m('spreads'), tNenhum = m('no');
	const calor = interpolate(f, [tEsp, tEsp + 15], [0, 0.9], clamp);
	const ok = usePop(tNenhum, 9);
	return (
		<>
			<Camera de={[540, 900, 1.25]} para={[540, 900, 1.05]} dur={dur}>
				<DiagramaTensao forma={0} calor={calor} />
				<Placa x={540} y={330} k={usePop(tRed, 12)} txt="ROUND" tam={120} cor="#2fb35a" corTxt="#fff" rot={-3} />
				{ok > 0 && <g transform={`translate(540, 900) scale(${ok})`}><Check s={1.2} /></g>}
				{ok > 0 && <text x={540} y={1450} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={90} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">NO WEAK POINT</text>}
			</Camera>
			<Sfx src="whoosh" em={tRed - 3} vol={0.35} />
			<Sfx src="ding" em={tNenhum} vol={0.4} />
		</>
	);
};

// 9 — "essa janelinha redonda está te mantendo vivo"
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRed = m('round'), tVivo = m('alive');
	const cor = usePop(tVivo, 9);
	return (
		<>
			<Camera de={[540, 900, 1.6]} para={[520, 1000, 1.15]} dur={dur} soco={tVivo}>
				<JanelaCabine forma={0} />
				<Personagem x={270} y={1820} escala={1.1} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao={f >= tVivo ? 'feliz' : 'neutro'} olhar={1} semPernas fase={2} />
				{f >= tRed && <circle cx={540} cy={860} r={290 + 10 * Math.sin(f / 4)} fill="none" stroke="#ffd23f" strokeWidth={14} opacity={0.7} />}
				{cor > 0 && <g transform={`translate(800, 520) scale(${cor * 1.1})`}><Coracao /></g>}
			</Camera>
			<Sfx src="pop" em={tRed} vol={0.35} />
			<Sfx src="ding" em={tVivo} vol={0.45} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'RoundWindows',
	pastaVoz: 'voz-round-windows',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['round', 'sharp', 'corners', 'rip', 'apart', '1952', 'first', 'square', 'loved', '1954', 'broke', 'tank', 'pressurized', 'balloon', 'stress', 'cracks', 'gave', 'rounded', 'spreads', 'no', 'alive']),
};
export default ep;
