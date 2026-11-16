// Episódio 11 (EN): por que a placa de PARE tem 8 lados.
// Fontes: 99% Invisible, Jalopnik, SlashGear, Gizmodo. Datas variam entre fontes (1914/1915; 1922/1923) → "around"/"early 1920s".
// Vermelho oficial na revisão de 1954 do MUTCD (antes, amarelo por falta de pigmento vermelho durável).
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {CarroNovo, CarroVelho, Cruzamento, Forma, PlacaAntiga, PlacaPare, Poste, Sol, Trem} from './arte';

export const FALAS = [
	"Stop signs have eight sides for a reason, and it's not just to look cool.",
	'The first stop signs showed up in Detroit, around 1915. Plain white, with black letters.',
	'Then in the early 1920s, highway engineers came up with a rule: the more sides a sign has, the more danger it warns about.',
	'A circle has endless sides, so it went to railroad crossings, the most dangerous spot of all.',
	'The octagon came next, so it became the stop sign.',
	'Its shape is so unique, drivers can recognize it from far away, or even from behind.',
	"But here's the twist: early stop signs weren't red.",
	'They were yellow, because red paint faded too fast in the sun.',
	'Stop signs officially turned red in 1954.',
	"So that octagon isn't decoration. It's a warning built into the shape.",
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const AMARELO = '#f2c14e';

// 0 — gancho: 8 lados por um motivo
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tOito = m('eight'), tLegal = m('cool');
	const lados = Math.min(8, Math.max(0, Math.floor((f - tOito) / 2)));
	const legal = usePop(tLegal, 9);
	return (
		<>
			<Camera de={[540, 800, 1.5]} para={[540, 900, 1.1]} dur={dur} soco={tLegal}>
				<Cruzamento>
					<g transform="translate(540, 760)"><PlacaPare s={1.3} /></g>
					<g transform="translate(540, 1020)"><Poste altura={500} /></g>
				</Cruzamento>
				{f >= tOito && (
					<g transform="translate(540, 760) scale(1.3)">
						{Array.from({length: lados}).map((_, i) => {
							const a = (Math.PI / 8) * (2 * i + 1);
							return <text key={i} x={Math.cos(a + Math.PI / 8) * 240} y={Math.sin(a + Math.PI / 8) * 240 + 18} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#ffd23f" stroke="#000" strokeWidth={9} paintOrder="stroke">{i + 1}</text>;
						})}
					</g>
				)}
				{f >= tLegal && <Placa x={540} y={1560} k={legal} txt="NOT JUST COOL" tam={80} cor="#fff" rot={-3} />}
			</Camera>
			{[0, 2, 4, 6, 8, 10, 12, 14].map((d) => <Sfx key={d} src="pop" em={tOito + d} vol={0.25} />)}
		</>
	);
};

// 1 — Detroit, por volta de 1915: placa branca com letras pretas
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDet = m('detroit'), tAno = m('1915'), tBranca = m('white');
	const placa = usePop(tBranca - 4, 10);
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[600, 1000, 1.1]} dur={dur}>
				<Cruzamento antigo>
					{placa > 0 && (
						<g>
							<g transform={`translate(780, 900) scale(${placa})`}><PlacaAntiga /></g>
							<g transform="translate(780, 1070)"><Poste altura={420} /></g>
						</g>
					)}
					<g transform={`translate(${interpolate(f, [0, dur], [80, 420])}, 1640)`}><CarroVelho s={0.9} /></g>
				</Cruzamento>
				<rect width={W} height={H} fill="rgba(160,120,60,0.18)" />
				<Placa x={540} y={520} k={usePop(tDet, 10)} txt="DETROIT" tam={110} cor="#fff" />
				<Placa x={540} y={700} k={usePop(tAno, 10)} txt="~1915" tam={100} cor="#ffd23f" rot={3} />
			</Camera>
			<Sfx src="pop" em={tDet} vol={0.4} />
			<Sfx src="pop" em={tAno} vol={0.35} />
			<Sfx src="pop" em={tBranca} vol={0.4} />
		</>
	);
};

// 2 — anos 1920: mais lados = mais perigo
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRegra = m('rule'), tLados = m('sides'), tPerigo = m('danger');
	const formas = [['retangulo', '4 SIDES'], ['losango', '4 SIDES'], ['octogono', '8 SIDES'], ['circulo', '∞ SIDES']] as const;
	const seta = interpolate(f, [tPerigo, tPerigo + 16], [0, 1], clamp);
	const popAno = usePop(2, 10), popRegra = usePop(tRegra, 10);
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.0]} dur={dur}>
				<rect width={W} height={H} fill="#1d2a66" />
				<Placa x={540} y={330} k={f < tRegra ? popAno : popRegra} txt={f < tRegra ? 'EARLY 1920s' : 'THE RULE'} tam={110} cor="#fff" />
				{f < tLados && [300, 780].map((x, i) => (
					<Personagem key={x} x={x} y={1700} escala={0.95} roupa="executivo" cor={i ? '#5a3f6a' : '#3b3f4a'} cabelo={i ? '#c9a227' : '#2d1f17'} expressao={f >= tRegra ? 'feliz' : 'serio'} olhar={i ? -1 : 1} falando={f >= tRegra} bracoD={f >= tRegra && !i ? 160 : 15} cotoveloD={10} fase={i} />
				))}
				{formas.map(([tipo, rot], i) => {
					const k = usePop(tLados + i * 6, 10);
					return k > 0 ? <g key={tipo} transform={`translate(${220 + (i % 2) * 620}, ${720 + Math.floor(i / 2) * 560}) scale(${k * 0.95})`}><Forma tipo={tipo} rotulo={rot} /></g> : null;
				})}
				{seta > 0 && (
					<g opacity={seta}>
						<path d="M540 640 L540 1500" stroke="#e8463f" strokeWidth={30} strokeLinecap="round" />
						<path d="M490 1460 L540 1560 L590 1460Z" fill="#e8463f" />
						<text x={540} y={620} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#fff" stroke="#000" strokeWidth={9} paintOrder="stroke">MORE DANGER</text>
					</g>
				)}
			</Camera>
			<Sfx src="pop" em={tRegra} vol={0.4} />
			{[0, 6, 12, 18].map((d) => <Sfx key={d} src="pop" em={tLados + d} vol={0.3} />)}
			<Sfx src="uhoh" em={tPerigo} vol={0.35} />
		</>
	);
};

// 3 — o círculo (lados infinitos) foi para as passagens de trem
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCirc = m('circle'), tTrem = m('railroad');
	const trem = interpolate(f, [tTrem, dur], [1400, -700], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.15]} para={[540, 1000, 1.05]} dur={dur} tremor={f >= tTrem ? 4 : 0}>
				<Cruzamento>
					<g transform="translate(260, 820)"><Forma tipo="circulo" s={1.2 * usePop(tCirc - 4, 10)} /></g>
					<g transform="translate(260, 1000)"><Poste altura={560} /></g>
					<rect y={1660} width={W} height={60} fill="#6b4a36" />
					{Array.from({length: 12}).map((_, i) => <rect key={i} x={i * 92} y={1640} width={30} height={100} fill="#8a6a44" />)}
					{f >= tTrem && <g transform={`translate(${trem}, 1660)`}><Trem s={1.1} /></g>}
				</Cruzamento>
				<Placa x={540} y={480} k={usePop(tTrem + 10, 9)} txt="MOST DANGEROUS" tam={80} cor="#e8463f" corTxt="#fff" rot={-3} />
			</Camera>
			<Sfx src="pop" em={tCirc - 4} vol={0.4} />
			<Sfx src="aviao" em={tTrem} vol={0.4} />
			<Sfx src="alarme" em={tTrem + 4} vol={0.2} />
		</>
	);
};

// 4 — o octógono veio em seguida: virou o PARE
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tOct = m('octagon'), tPare = m('stop');
	const k = usePop(tOct - 2, 9);
	return (
		<>
			<Camera de={[540, 900, 1.2]} para={[540, 900, 1.35]} dur={dur} soco={tPare}>
				<rect width={W} height={H} fill="#1d2a66" />
				<circle cx={540} cy={900} r={560} fill="#26357a" />
				{k > 0 && <g transform={`translate(540, 900) scale(${k * 1.4}) rotate(${(1 - k) * 90})`}><PlacaPare texto={f >= tPare ? 'STOP' : ''} /></g>}
				{f >= tPare && f < tPare + 6 && <LinhasImpacto op={0.35} cor="#e8463f" />}
			</Camera>
			<Sfx src="whoosh" em={tOct - 2} vol={0.4} />
			<Sfx src="boom" em={tPare} vol={0.5} />
		</>
	);
};

// 5 — forma única: dá para reconhecer de longe, e até por trás
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tLonge = m('far'), tTras = m('behind');
	const costas = f >= tTras - 2;
	const escala = f < tLonge ? 1.2 : interpolate(f, [tLonge, tLonge + 10], [1.2, 0.45], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.05]} para={[540, 960, 1.1]} dur={dur}>
				<Cruzamento>
					<g transform={`translate(${costas ? 420 : 540}, 850) scale(${costas ? 1.1 : escala})`}>
						<PlacaPare costas={costas} />
					</g>
					<g transform={`translate(${costas ? 420 : 540}, ${costas ? 1070 : 850 + 220 * escala})`}><Poste altura={600} /></g>
					{costas && <g transform="translate(820, 1680)"><CarroNovo s={0.7} cor="#e8463f" /></g>}
				</Cruzamento>
				{costas && <Personagem x={820} y={1520} escala={0.4} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao="feliz" olhar={-1} semPernas />}
				<Placa x={540} y={420} k={usePop(tTras + 4, 10)} txt="STILL A STOP SIGN!" tam={70} cor="#fff" />
				{f >= tLonge && f < tTras && <text x={540} y={1550} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">FAR AWAY? STILL CLEAR</text>}
			</Camera>
			<Sfx src="whoosh" em={tLonge} vol={0.35} />
			<Sfx src="ding" em={tTras + 4} vol={0.4} />
		</>
	);
};

// 6 — a virada: as primeiras placas de PARE não eram vermelhas
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVirada = m('twist'), tVerm = m('red');
	return (
		<>
			<Camera de={[540, 900, 1.3]} para={[540, 900, 1.15]} dur={dur} soco={tVerm} tremor={f >= tVerm ? 4 : 0}>
				<rect width={W} height={H} fill="#1d2a66" />
				<g transform="translate(540, 900) scale(1.3)"><PlacaPare /></g>
				{f >= tVerm && (
					<g transform="translate(540, 900)">
						<circle r={330} fill="none" stroke="#fff" strokeWidth={40} />
						<line x1={-230} y1={-230} x2={230} y2={230} stroke="#fff" strokeWidth={40} strokeLinecap="round" />
					</g>
				)}
				<Placa x={540} y={380} k={usePop(tVirada, 10)} txt="PLOT TWIST" tam={100} cor="#ffd23f" />
			</Camera>
			<Sfx src="uhoh" em={tVirada} vol={0.4} />
			<Sfx src="buzz" em={tVerm} vol={0.35} />
		</>
	);
};

// 7 — eram amarelas: o vermelho desbotava rápido no sol
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAm = m('yellow'), tDesb = m('faded');
	const amarela = f >= tAm - 2;
	const popAm = usePop(tAm, 10);
	const desbota = interpolate(f, [tDesb - 4, tDesb + 24], [0, 1], clamp);
	const corDesb = `rgb(${Math.round(214 + (240 - 214) * desbota)}, ${Math.round(38 + (190 - 38) * desbota)}, ${Math.round(47 + (190 - 47) * desbota)})`;
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.2]} dur={dur}>
				<Cruzamento antigo>
					<g transform="translate(300, 900)"><PlacaPare cor={AMARELO} corTexto="#1a1a1a" borda="#1a1a1a" s={0.9} /></g>
					<g transform="translate(300, 1080)"><Poste altura={500} /></g>
					{f >= tDesb - 4 && (
						<>
							<g transform="translate(800, 900)"><PlacaPare cor={corDesb} s={0.9} /></g>
							<g transform="translate(800, 1080)"><Poste altura={500} /></g>
							<g transform="translate(860, 420)"><Sol s={0.9} /></g>
						</>
					)}
				</Cruzamento>
				{amarela && <Placa x={300} y={560} k={popAm} txt="1920s" tam={80} cor="#fff" />}
				{desbota > 0.5 && <Placa x={760} y={1500} k={1} txt="FADED!" tam={90} cor="#e8463f" corTxt="#fff" rot={5} />}
			</Camera>
			<Sfx src="pop" em={tAm} vol={0.4} />
			<Sfx src="uhoh" em={tDesb + 10} vol={0.35} />
		</>
	);
};

// 8 — viraram vermelhas oficialmente em 1954
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVerm = m('red'), tAno = m('1954');
	const vira = interpolate(f, [tVerm - 4, tVerm + 8], [0, 1], clamp);
	const cor = `rgb(${Math.round(242 + (214 - 242) * vira)}, ${Math.round(193 + (38 - 193) * vira)}, ${Math.round(78 + (47 - 78) * vira)})`;
	return (
		<>
			<Camera de={[540, 900, 1.15]} para={[540, 900, 1.3]} dur={dur} soco={tAno}>
				<Cruzamento>
					<g transform={`translate(540, 820) scale(${1.3 - Math.abs(Math.sin(vira * Math.PI)) * 0.2}, 1.3)`}><PlacaPare cor={cor} corTexto={vira > 0.5 ? '#fff' : '#1a1a1a'} borda={vira > 0.5 ? '#fff' : '#1a1a1a'} /></g>
					<g transform="translate(540, 1080)"><Poste altura={500} /></g>
				</Cruzamento>
				<Placa x={540} y={400} k={usePop(tAno, 9)} txt="1954" tam={150} cor="#e8463f" corTxt="#fff" />
			</Camera>
			<Sfx src="whoosh" em={tVerm - 4} vol={0.4} />
			<Sfx src="ding" em={tAno} vol={0.45} />
		</>
	);
};

// 9 — não é decoração: é um aviso embutido na forma
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDecor = m('decoration'), tAviso = m('warning');
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 900, 1.05]} dur={dur} soco={tAviso}>
				<Cruzamento>
					<g transform="translate(540, 800)"><PlacaPare s={1.25} /></g>
					<g transform="translate(540, 1050)"><Poste altura={500} /></g>
					<g transform={`translate(${interpolate(f, [0, dur], [-300, 330])}, 1700)`}><CarroNovo s={0.8} /></g>
				</Cruzamento>
				{f >= tDecor && f < tAviso && <Interrogacao x={860} y={520} inicio={tDecor} s={1} />}
				{f >= tAviso && (
					<g transform="translate(540, 800) scale(1.25)">
						<polygon points={Array.from({length: 8}).map((_, i) => { const a = (Math.PI / 8) * (2 * i + 1); return `${Math.cos(a) * (230 + 10 * Math.sin(f / 3))},${Math.sin(a) * (230 + 10 * Math.sin(f / 3))}`; }).join(' ')} fill="none" stroke="#ffd23f" strokeWidth={14} strokeDasharray="30 16" />
					</g>
				)}
				<Placa x={540} y={1520} k={usePop(tAviso, 9)} txt="SHAPE = WARNING" tam={80} cor="#ffd23f" />
			</Camera>
			<Sfx src="pop" em={tDecor} vol={0.35} />
			<Sfx src="boom" em={tAviso} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'StopSign',
	pastaVoz: 'voz-stop-sign',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['eight', 'sides', 'cool', 'detroit', '1915', 'white', 'rule', 'danger', 'circle', 'railroad', 'octagon', 'stop', 'unique', 'behind', 'twist', 'red', 'yellow', 'faded', '1954', 'decoration', 'warning']),
};
export default ep;
