import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../Personagem';
import {H, Interrogacao, LinhasImpacto, Relogio, W} from '../Cenarios';
import {Legenda} from '../Legenda';
import {Camera, Sfx, Vinheta, usePop} from '../Video';
import {Palavra, VozJson, marcaEm, montarCenas} from '../roteiro';
import voz from '../voz-elevador.json';
import {CadeiraDeRodas, Chave, Cupula, Dedo, IconeFechar, InteriorElevador, Lei1990, Painel, Pilula, Rua, SimboloAcesso} from './cenarios';

// Episódio 2 (EN): o botão de fechar a porta do elevador. Voz "Brooks" (ElevenLabs) em public/voz-elevador/NN.mp3
export const FALAS_ELEVADOR = [
	"That close door button in the elevator? It probably doesn't do anything.",
	"You're late, the doors are open, and you press it. Again. And again.",
	'The doors finally close... right when they were going to close anyway.',
	"Here's why. In 1990, the U.S. passed a law to protect people with disabilities.",
	'Elevator doors have to stay open long enough for everyone to get in.',
	'So in a lot of elevators, the close button was simply switched off.',
	'But they kept the button. Because pressing it makes you feel in control.',
	"It's called a placebo button. And there are more of them than you think.",
	'Like a lot of crosswalk buttons in big cities.',
	'The only people it really works for? Firefighters. With a special key.',
];

const DESTAQUES = new Set(['close', 'button', 'late', 'again', 'anyway', '1990', 'law', 'disabilities', 'everyone', 'switched', 'off', 'control', 'placebo', 'crosswalk', 'firefighters', 'key', 'nothing', 'anything']);

export const CENAS_ELEVADOR = montarCenas(FALAS_ELEVADOR, voz as unknown as VozJson);

type P = {dur: number; m: (w: string, n?: number) => number};

const EXEC = {roupa: 'executivo' as const, cor: '#3b3f4a', cabelo: '#2d1f17'};

// painel pequeno na parede direita do elevador
const PainelParede: React.FC<{aceso?: boolean; chave?: boolean}> = ({aceso, chave}) => (
	<g transform="translate(990, 1120) skewY(-12)">
		<rect x={-46} y={-170} width={92} height={340} rx={14} fill="#d9dde6" stroke={CONTORNO} strokeWidth={7} />
		{Array.from({length: 6}).map((_, i) => (
			<circle key={i} cx={i % 2 ? 20 : -20} cy={-120 + Math.floor(i / 2) * 50} r={16} fill="#eef1f6" stroke={CONTORNO} strokeWidth={4} />
		))}
		<circle cx={20} cy={60} r={20} fill={aceso ? '#ffe9a8' : '#eef1f6'} stroke={CONTORNO} strokeWidth={5} />
		<g transform="translate(20,60) scale(0.3)"><IconeFechar /></g>
		<rect x={-30} y={110} width={60} height={34} rx={8} fill="#c9a227" stroke={CONTORNO} strokeWidth={4} />
		{chave && <g transform="translate(0, 127) scale(0.5) rotate(180)"><Chave /></g>}
	</g>
);

// 0 — gancho: close-up do botão sendo apertado… e o "não funciona"
const C0: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tX = m('doesnt');
	const x = usePop(tX, 9);
	const aperta = (f % 14) < 5 && f > 6;
	return (
		<>
			<Camera de={[640, 1250, 1.5]} para={[620, 1200, 1.25]} dur={dur} soco={tX}>
				<rect width={W} height={H} fill="#b8bec9" />
				<g transform="translate(540, 900)">
					<Painel apertado={aperta} destaque={f < tX} />
				</g>
				<g transform={`translate(${650 - (aperta ? 4 : 30)}, 1260)`}><Dedo s={1} /></g>
				{x > 0 && (
					<g transform={`translate(650, 1260) scale(${x})`}>
						<circle r={190} fill="none" stroke="#e8262f" strokeWidth={40} />
						<line x1={-134} y1={-134} x2={134} y2={134} stroke="#e8262f" strokeWidth={40} strokeLinecap="round" />
					</g>
				)}
			</Camera>
			{[8, 22, 36, 50, 64].map((t) => <Sfx key={t} src="pop" em={t} vol={0.3} />)}
			<Sfx src="buzz" em={tX} vol={0.35} />
		</>
	);
};

// 1 — atrasado, aperta, aperta de novo
const C1: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tLate = m('late'), tPress = m('press'), tA1 = m('again'), tA2 = m('again', 2);
	const toques = [tPress, tA1, tA2];
	const apertando = toques.some((t) => f >= t && f < t + 8);
	const n = toques.filter((t) => f >= t).length;
	const rel = usePop(tLate);
	return (
		<>
			<Camera de={[700, 1150, 1.35]} para={[760, 1150, 1.5]} dur={dur} tremor={n >= 3 ? 4 : 0}>
				<InteriorElevador abertura={1}>
					<PainelParede aceso={apertando} />
					<Personagem x={760} y={1800} escala={1.05} {...EXEC} olhar={1} expressao={n >= 2 ? 'bravo' : f >= tLate ? 'assustado' : 'serio'} bracoD={apertando ? 100 : 20} cotoveloD={apertando ? -15 : 10} bracoE={f >= tLate && f < tPress ? 80 : 12} cotoveloE={f >= tLate && f < tPress ? 70 : 10} />
					{rel > 0 && f < tPress + 10 && (
						<g transform={`translate(470, 980) scale(${rel})`}>
							<Relogio hora={9} s={1.1} />
							<text x={0} y={140} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#e8262f" stroke="#000" strokeWidth={10} paintOrder="stroke">LATE!</text>
						</g>
					)}
					{toques.map((t, i) =>
						f >= t ? (
							<text key={i} x={880 - i * 10} y={930 - i * 90} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70 + i * 16} fill="#ffd23f" stroke="#000" strokeWidth={12} paintOrder="stroke" transform={`rotate(${-8 + i * 6} 880 ${930 - i * 90})`}>
								x{i + 1}
							</text>
						) : null,
					)}
				</InteriorElevador>
			</Camera>
			<Sfx src="ding" em={0} vol={0.3} />
			<Sfx src="pop" em={tLate} vol={0.35} />
			{toques.map((t) => <Sfx key={t} src="pop" em={t} vol={0.5} />)}
		</>
	);
};

// 2 — a porta fecha… quando ia fechar de qualquer jeito
const C2: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFecha = m('close') + 6;
	const tAny = m('anyway');
	const ab = interpolate(f, [0, tFecha], [1, 0], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
	const prog = interpolate(f, [0, tFecha], [0.55, 1], {extrapolateRight: 'clamp'});
	const coinc = usePop(tAny, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.05]} para={[560, 1050, 1.18]} dur={dur}>
				<InteriorElevador abertura={ab}>
					<PainelParede aceso={f < 10} />
					<Personagem x={760} y={1800} escala={1.05} {...EXEC} olhar={-1} expressao={f >= tAny ? 'serio' : f >= tFecha ? 'feliz' : 'neutro'} bracoE={f >= tFecha && f < tAny ? 150 : 12} cotoveloE={10} />
					{/* "timer" automático da porta */}
					<g transform="translate(540, 250)">
						<rect x={-300} y={-55} width={600} height={110} rx={24} fill="#111" stroke="#000" strokeWidth={8} />
						<rect x={-280} y={-36} width={560 * prog} height={72} rx={16} fill={prog >= 1 ? '#5aff7a' : '#ffb43a'} />
						<text x={0} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#111">AUTO TIMER</text>
					</g>
					{coinc > 0 && (
						<g transform={`translate(540, 1000) rotate(-8) scale(${coinc})`}>
							<rect x={-340} y={-80} width={680} height={150} rx={30} fill="#ffd23f" stroke="#000" strokeWidth={12} />
							<text x={0} y={32} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={92} fill="#000">COINCIDENCE</text>
						</g>
					)}
				</InteriorElevador>
			</Camera>
			<Sfx src="whoosh" em={tFecha - 12} vol={0.35} />
			<Sfx src="ding" em={tFecha} vol={0.3} />
			<Sfx src="pop" em={tAny} vol={0.45} />
		</>
	);
};

// 3 — a lei de 1990
const C3: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tLei = m('1990') - 3;
	const tPassed = m('passed');
	const tDis = m('disabilities');
	const lei = usePop(tLei, 12);
	const carimbo = interpolate(f, [tPassed, tPassed + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const acesso = usePop(tDis, 9);
	return (
		<>
			<Camera de={[540, 1000, 1.0]} para={[540, 960, 1.12]} dur={dur} soco={tPassed} tremor={f >= tPassed && f < tPassed + 8 ? 6 : 0}>
				<defs>
					<radialGradient id="fundoLei" cx="0.5" cy="0.4" r="0.8">
						<stop offset="0" stopColor="#3b5bb5" />
						<stop offset="1" stopColor="#141e45" />
					</radialGradient>
				</defs>
				<rect width={W} height={H} fill="url(#fundoLei)" />
				<g transform="translate(540, 1720) scale(1.1)" opacity={0.6}><Cupula /></g>
				{f < tLei && <Interrogacao x={540} y={820} inicio={2} s={1.6} />}
				{lei > 0 && (
					<g transform={`translate(540, 900) scale(${lei}) rotate(${(1 - lei) * 10})`}>
						<Lei1990 carimbo={carimbo} f={f} />
					</g>
				)}
				{acesso > 0 && <g transform={`translate(860, 380) scale(${acesso * 1.3}) rotate(8)`}><SimboloAcesso /></g>}
			</Camera>
			<Sfx src="whoosh" em={tLei - 3} vol={0.4} />
			<Sfx src="boom" em={tPassed} vol={0.6} />
			<Sfx src="pop" em={tDis} vol={0.45} />
		</>
	);
};

// 4 — a porta precisa esperar todo mundo entrar
const C4: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTodos = m('everyone');
	const t = interpolate(f, [0, dur - 10], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
	const s = 0.5 + 0.55 * t;
	const cx = 470, cy = 1380 + 420 * t;
	const outros = usePop(tTodos, 12);
	return (
		<>
			<Camera de={[540, 1080, 1.0]} para={[540, 1100, 1.1]} dur={dur}>
				<InteriorElevador abertura={1}>
					<PainelParede />
					{outros > 0 && (
						<>
							<Personagem x={330} y={1560} escala={0.55 * outros} roupa="passageiro" cor="#b8577a" cabelo="#c9c9c9" expressao="feliz" fase={2} />
							<Personagem x={720} y={1560} escala={0.55 * outros} roupa="passageiro" cor="#d9a03a" cabelo="#1d1d1d" expressao="feliz" fase={5} />
						</>
					)}
					<g transform={`translate(${cx}, ${cy}) scale(${s})`}>
						<Personagem x={0} y={126} roupa="passageiro" cor="#4f7cc9" cabelo="#8a4b2a" expressao="feliz" semPernas bracoD={40} cotoveloD={30} bracoE={30} cotoveloE={20} />
						<path d="M10 -70 H110 L120 -10" stroke={CONTORNO} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
						<CadeiraDeRodas giro={f * 6} />
					</g>
					<g transform="translate(540, 250)">
						<rect x={-330} y={-55} width={660} height={110} rx={24} fill="#111" stroke="#000" strokeWidth={8} />
						<text x={0} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#5aff7a">DOORS STAY OPEN</text>
					</g>
				</InteriorElevador>
			</Camera>
			<Sfx src="pop" em={tTodos} vol={0.4} />
		</>
	);
};

// 5 — botão desligado
const C5: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tOff = m('switched');
	const des = f >= tOff ? 1 : 0;
	const alav = interpolate(f, [tOff - 2, tOff + 3], [-35, 35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1000, 1.0]} para={[600, 1150, 1.25]} dur={dur} soco={tOff}>
				<rect width={W} height={H} fill="#b8bec9" />
				<g transform="translate(640, 900) scale(0.9)"><Painel desligado={des} /></g>
				{/* interruptor */}
				<g transform="translate(200, 1300)">
					<rect x={-120} y={-170} width={240} height={340} rx={24} fill="#2a2e38" stroke={CONTORNO} strokeWidth={10} />
					<text x={0} y={-110} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#5aff7a" opacity={des ? 0.25 : 1}>ON</text>
					<text x={0} y={150} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#ff4d3a" opacity={des ? 1 : 0.25}>OFF</text>
					<g transform={`rotate(${alav + 180})`}>
						<rect x={-22} y={-10} width={44} height={120} rx={20} fill="#d9dde6" stroke={CONTORNO} strokeWidth={8} />
					</g>
					<circle r={30} fill="#555a63" stroke={CONTORNO} strokeWidth={8} />
				</g>
				{/* fio da tomada até o botão */}
				<path d={`M320 1300 C 500 1300 560 1350 ${des ? 600 : 740} ${des ? 1400 : 1224}`} stroke="#222" strokeWidth={14} fill="none" />
				{f >= tOff && f < tOff + 6 && (
					<g transform="translate(740, 1224)" fill="#ffd23f" stroke="#000" strokeWidth={5}>
						<path d="M0 -70 L18 -18 L70 -26 L26 8 L46 60 L0 26 L-46 60 L-26 8 L-70 -26 L-18 -18Z" />
					</g>
				)}
			</Camera>
			<Sfx src="buzz" em={tOff} vol={0.45} />
			<Sfx src="boom" em={tOff + 2} vol={0.3} />
		</>
	);
};

// 6 — "mas mantiveram o botão: te faz sentir no controle"
const C6: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tControl = m('control');
	const tPress = m('pressing');
	const coroa = usePop(tControl, 9);
	const aperta = f >= tPress && (f - tPress) % 12 < 5;
	return (
		<>
			<Camera de={[640, 1100, 1.6]} para={[620, 1050, 1.4]} dur={dur}>
				<InteriorElevador abertura={0.3}>
					<PainelParede aceso={aperta} />
					<Personagem x={760} y={1800} escala={1.05} {...EXEC} olhar={1} expressao={f >= tPress ? 'feliz' : 'serio'} bracoD={aperta ? 100 : 30} cotoveloD={aperta ? -15 : 40} />
					{coroa > 0 && (
						<g transform={`translate(760, ${1800 - 700 * 1.05 - 40}) scale(${coroa}) rotate(${Math.sin(f / 5) * 5})`}>
							<path d="M-110 40 L-120 -60 L-60 -10 L0 -90 L60 -10 L120 -60 L110 40Z" fill="#f2c14e" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
							<circle cx={0} cy={0} r={14} fill="#e8463f" stroke={CONTORNO} strokeWidth={5} />
						</g>
					)}
					{coroa > 0 && (
						<text x={500} y={900} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={90} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke" transform="rotate(-6 500 900)">
							IN CONTROL
						</text>
					)}
				</InteriorElevador>
			</Camera>
			<Sfx src="pop" em={tPress} vol={0.4} />
			<Sfx src="ding" em={tControl} vol={0.35} />
		</>
	);
};

// 7 — "botão placebo"… e existem muitos
const C7: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPlac = m('placebo');
	const tMais = m('more');
	const pil = usePop(tPlac, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.25]} para={[540, 960, 1.0]} dur={dur} soco={tPlac}>
				<rect width={W} height={H} fill="#7d5cc4" />
				<circle cx={540} cy={960} r={700} fill="#9a7be0" opacity={0.6} />
				{f >= tMais &&
					Array.from({length: 24}).map((_, i) => {
						const k = interpolate(f - tMais - (i % 8) * 2, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
						const x = 120 + (i % 6) * 168, y = 260 + Math.floor(i / 6) * 420 + (i % 2) * 60;
						return (
							<g key={i} transform={`translate(${x}, ${y}) scale(${k * 0.9}) rotate(${(i % 5) * 9 - 18})`}>
								<circle r={70} fill="#e9ecf2" stroke={CONTORNO} strokeWidth={8} />
								<IconeFechar s={0.8} />
							</g>
						);
					})}
				<g transform={`translate(540, 900) scale(${1 - pil * 0.0})`}>
					{pil < 0.5 ? (
						<g transform={`scale(${2.4 * (1 - pil * 2)})`}>
							<circle r={74} fill="#e9ecf2" stroke={CONTORNO} strokeWidth={9} />
							<IconeFechar s={0.9} />
						</g>
					) : (
						<g transform={`scale(${(pil - 0.5) * 2 * 1.6})`}><Pilula /></g>
					)}
				</g>
				{pil > 0.5 && (
					<text x={540} y={560} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={130} fill="#fff" stroke="#000" strokeWidth={16} paintOrder="stroke" transform="rotate(-5 540 560)">
						PLACEBO
					</text>
				)}
			</Camera>
			<Sfx src="whoosh" em={tPlac - 4} vol={0.4} />
			<Sfx src="pop" em={tPlac + 4} vol={0.5} />
			{[0, 4, 8, 12].map((d) => <Sfx key={d} src="pop" em={tMais + d} vol={0.3} />)}
		</>
	);
};

// 8 — botões de faixa de pedestre
const C8: React.FC<P> = ({dur}) => {
	const f = useCurrentFrame();
	const aperta = f > 8 && f % 10 < 4;
	return (
		<>
			<Camera de={[620, 1050, 1.45]} para={[700, 1000, 1.3]} dur={dur} tremor={2}>
				<Rua sinal="pare" />
				<Personagem x={600} y={1520} escala={0.95} {...EXEC} olhar={1} expressao="bravo" bracoD={aperta ? 128 : 110} cotoveloD={aperta ? -24 : -10} />
				<text x={420} y={760} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke" transform="rotate(-8 420 760)">
					{f > 20 ? 'x' + Math.floor((f - 8) / 10) : ''}
				</text>
			</Camera>
			{[10, 20, 30, 40, 50, 60, 70].filter((t) => t < dur).map((t) => <Sfx key={t} src="pop" em={t} vol={0.3} />)}
		</>
	);
};

// 9 — bombeiros, com uma chave especial
const C9: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBomb = m('firefighters');
	const tChave = m('key');
	const ent = interpolate(f, [tBomb - 4, tBomb + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const ab = interpolate(f, [tChave + 4, tChave + 9], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pergunta = f < tBomb;
	return (
		<>
			<Camera de={[540, 1050, 1.0]} para={[640, 1100, 1.2]} dur={dur} soco={tChave + 8} tremor={f >= tChave + 8 && f < tChave + 16 ? 8 : 0}>
				<InteriorElevador abertura={ab}>
					<PainelParede chave={f >= tChave} />
					{pergunta && <Interrogacao x={540} y={900} inicio={3} s={1.4} />}
					{pergunta && <Personagem x={760} y={1800} escala={1.05} {...EXEC} expressao="confuso" olhar={-1} />}
					{ent > 0 && (
						<Personagem x={interpolate(ent, [0, 1], [540, 780])} y={interpolate(ent, [0, 1], [1450, 1820])} escala={interpolate(ent, [0, 1], [0.55, 1.1])} roupa="bombeiro" expressao={f >= tChave ? 'feliz' : 'serio'} olhar={1} bracoD={f >= tChave ? 100 : 20} cotoveloD={f >= tChave ? -15 : 10} bracoE={f >= tChave + 10 ? 150 : 15} cotoveloE={10} />
					)}
				</InteriorElevador>
				{f >= tChave + 8 && f < tChave + 14 && <LinhasImpacto op={0.4} />}
			</Camera>
			<Sfx src="whoosh" em={tBomb - 4} vol={0.4} />
			<Sfx src="pop" em={tChave} vol={0.5} />
			<Sfx src="whoosh" em={tChave + 3} vol={0.5} />
			<Sfx src="boom" em={tChave + 8} vol={0.7} />
		</>
	);
};

const COMP: React.FC<P>[] = [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9];

export const Elevador: React.FC = () => {
	const mk = (palavras: Palavra[]) => (w: string, n?: number) => marcaEm(palavras, w, n ?? 1);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{CENAS_ELEVADOR.map((c) => {
				const C = COMP[c.indice];
				const ultima = c.indice === CENAS_ELEVADOR.length - 1;
				return (
					<Sequence key={c.indice} from={c.inicio} durationInFrames={c.duracao + (ultima ? 18 : 0)}>
						<C dur={c.duracao} m={mk(c.palavras)} />
						<Vinheta />
						<Legenda palavras={c.palavras} destaques={DESTAQUES} />
						<Audio src={staticFile(`voz-elevador/${String(c.indice).padStart(2, '0')}.mp3`)} />
					</Sequence>
				);
			})}
			<Audio src={staticFile('audio/trilha.wav')} volume={(fr) => interpolate(fr, [0, 10], [0, 0.12], {extrapolateRight: 'clamp'})} />
		</AbsoluteFill>
	);
};
