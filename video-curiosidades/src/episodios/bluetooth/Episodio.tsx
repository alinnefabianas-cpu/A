// Episódio 7 (EN): por que o Bluetooth se chama Bluetooth.
// Fontes: Bluetooth SIG ("The story behind how Bluetooth technology got its name"), Mental Floss,
// Snopes, National Geographic, TechXplore/AFP. O "dente azul" é hipótese (dito como "historians think").
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Bar, BarcoViking, Caneca, Celular, Escritorio90, Fone, Lampada, Livro, MapaNordico, MarViking, Nota, Notebook, Ondas, Pedra, Quarto, RunaB, RunaH, SorrisoAzul} from './arte';

export const FALAS = [
	"Every time you use Bluetooth, you're saying the name of a Viking king.",
	'Over a thousand years ago, Harald Bluetooth ruled Denmark.',
	'He was famous for uniting Denmark and Norway.',
	'And his nickname? Historians think he may have had a dead tooth that looked dark blue.',
	'Fast forward to the 1990s. Rival tech companies were building a way for devices to talk without wires.',
	'Over drinks, two engineers got talking about a book on Vikings.',
	'And one of them suggested a code name: Bluetooth.',
	"Because, just like the king, it would unite things that didn't get along.",
	'It was only supposed to be temporary. But the name stuck.',
	"And the logo? It's the king's initials, written in Viking runes.",
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const REI = {roupa: 'viking' as const, cabelo: '#c9762e'};
const AZUL = '#1f6fd6';

// 0 — gancho: você usa o nome de um rei viking
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBt = m('bluetooth'), tVik = m('viking');
	const rei = usePop(tVik, 9);
	return (
		<>
			<Camera de={[540, 1100, 1.25]} para={[540, 1050, 1.1]} dur={dur} soco={tVik}>
				<Quarto>
					<Personagem x={rei > 0 ? 300 : 540} y={1780} escala={1} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao={f >= tVik ? 'assustado' : 'feliz'} olhar={f >= tVik ? 1 : 0} bracoD={70} cotoveloD={-40} itemD={<g transform="translate(0,-60) scale(0.5)"><Celular tela={f >= tBt ? 'PAIRING…' : ''} /></g>} />
					{f >= tBt && <Ondas x={rei > 0 ? 420 : 660} y={1150} s={0.9} />}
					{rei > 0 && <Personagem x={780} y={1800} escala={1.05 * rei} {...REI} expressao="feliz" olhar={-1} bracoD={160} cotoveloD={20} />}
				</Quarto>
				{f >= tVik && f < tVik + 6 && <LinhasImpacto op={0.35} />}
				<Placa x={540} y={480} k={usePop(tVik + 4, 10)} txt="VIKING KING?!" tam={90} cor="#f2c14e" />
			</Camera>
			<Sfx src="ding" em={tBt} vol={0.35} />
			<Sfx src="boom" em={tVik} vol={0.55} />
		</>
	);
};

// 1 — há mais de mil anos, Harald Bluetooth governava a Dinamarca
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMil = m('thousand'), tHar = m('harald'), tDin = m('denmark');
	const mil = usePop(tMil, 12), nome = usePop(tHar, 10), din = usePop(tDin, 10);
	return (
		<>
			<Camera de={[540, 1150, 1.2]} para={[540, 1050, 1.05]} dur={dur}>
				<MarViking>
					<g transform="translate(540, 1300)">
						<BarcoViking s={0.9} />
						<Personagem x={-60} y={-80} escala={0.8} {...REI} expressao="serio" bracoD={150} cotoveloD={30} />
					</g>
				</MarViking>
				<Placa x={540} y={520} k={mil} txt="1,000+ YEARS AGO" tam={70} cor="#fff" />
				<Placa x={540} y={700} k={nome} txt="HARALD BLUETOOTH" tam={74} cor={AZUL} corTxt="#fff" rot={3} />
				{din > 0 && (
					<g transform={`translate(880, 780) scale(${din})`}>
						<line x1={-110} y1={-80} x2={-110} y2={160} stroke="#6b4a36" strokeWidth={12} />
						<rect x={-110} y={-80} width={200} height={130} fill="#c8102e" stroke="#241820" strokeWidth={6} />
						<rect x={-110} y={-26} width={200} height={24} fill="#fff" />
						<rect x={-56} y={-80} width={24} height={130} fill="#fff" />
					</g>
				)}
			</Camera>
			<Sfx src="whoosh" em={tMil - 3} vol={0.35} />
			<Sfx src="pop" em={tHar} vol={0.45} />
			<Sfx src="pop" em={tDin} vol={0.35} />
		</>
	);
};

// 2 — famoso por unir Dinamarca e Noruega
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tUne = m('uniting');
	const une = interpolate(f, [tUne - 2, tUne + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
	const coroa = usePop(tUne + 14, 9);
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 960, 1.08]} dur={dur} soco={tUne + 14}>
				<rect width={W} height={H} fill="#2f5f8a" />
				<circle cx={540} cy={900} r={600} fill="#3b6f9e" />
				<g transform="translate(600, 880) scale(1.4)"><MapaNordico une={une} /></g>
				{coroa > 0 && (
					<g transform={`translate(540, 360) scale(${coroa * 1.4})`}>
						<path d="M-100 40 L-110 -60 L-55 -20 L0 -90 L55 -20 L110 -60 L100 40Z" fill="#f2c14e" stroke="#241820" strokeWidth={9} strokeLinejoin="round" />
					</g>
				)}
				<Placa x={540} y={1640} k={coroa} txt="UNITED" tam={110} cor="#f2c14e" />
			</Camera>
			<Sfx src="whoosh" em={tUne - 2} vol={0.4} />
			<Sfx src="ding" em={tUne + 14} vol={0.4} />
		</>
	);
};

// 3 — o apelido: talvez um dente morto azul-escuro
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tApel = m('nickname'), tDente = m('tooth'), tAzul = m('blue');
	const close = f >= tDente - 2;
	const brilho = interpolate(f, [tAzul, tAzul + 8], [0, 1], clamp);
	if (!close)
		return (
			<>
				<Camera de={[540, 1150, 1.4]} para={[540, 1100, 1.6]} dur={tDente}>
					<MarViking>
						<Personagem x={540} y={1850} escala={1.25} {...REI} expressao="confuso" />
					</MarViking>
					<Interrogacao x={820} y={760} inicio={tApel} s={1.2} />
				</Camera>
				<Sfx src="pop" em={tApel} vol={0.4} />
			</>
		);
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.25]} dur={dur - tDente} soco={tAzul - tDente}>
				<rect width={W} height={H} fill="#f6e2c8" />
				<g transform="translate(540, 900) scale(1.3)"><SorrisoAzul brilho={brilho} /></g>
				{brilho > 0 && (
					<g transform="translate(700, 620)">
						<path d="M0 0 L-60 -120" stroke="#241820" strokeWidth={8} />
						<Placa x={-60} y={-200} k={brilho} txt="BLUE TOOTH?" tam={70} cor={AZUL} corTxt="#fff" rot={6} />
					</g>
				)}
				<text x={540} y={1560} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">(HISTORIANS' BEST GUESS)</text>
			</Camera>
			<Sfx src="whoosh" em={0} vol={0.35} />
			<Sfx src="ding" em={tAzul - tDente} vol={0.4} />
		</>
	);
};

// 4 — anos 90: empresas rivais querendo aparelhos conversando sem fio
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const t90 = m('1990s'), tRival = m('rival'), tAparelhos = m('devices'), tFios = m('wires');
	const ano = usePop(t90, 10), apar = usePop(tAparelhos, 10);
	const corta = f >= tFios + 4;
	return (
		<>
			<Camera de={[540, 1150, 1.2]} para={[540, 1050, 1.05]} dur={dur} soco={tFios + 4}>
				<Escritorio90>
					{f >= tRival - 4 && (
						<>
							<Personagem x={180} y={1820} escala={0.8} roupa="executivo" cor="#3b3f4a" cabelo="#2d1f17" expressao="bravo" olhar={1} />
							<Personagem x={900} y={1820} escala={0.8} roupa="executivo" cor="#5a3f6a" cabelo="#c9a227" expressao="bravo" olhar={-1} fase={2} />
						</>
					)}
					{apar > 0 && (
						<g transform={`translate(540 1100) scale(${apar}) translate(-540 -1100)`}>
							<g transform="translate(330, 1130)"><Notebook s={0.6} /></g>
							<g transform="translate(560, 1100)"><Celular s={0.5} /></g>
							<g transform="translate(760, 1150)"><Fone s={0.55} /></g>
							{!corta && <path d="M400 1150 C460 1300 500 1000 540 1160 C600 1320 640 980 720 1170" stroke="#222" strokeWidth={10} fill="none" />}
						</g>
					)}
					{corta && <><Ondas x={430} y={1000} s={0.6} /><Ondas x={660} y={1000} s={0.6} /></>}
				</Escritorio90>
				<Placa x={540} y={600} k={ano} txt="1990s" tam={140} cor="#ff6ad5" corTxt="#fff" />
				{corta && <Placa x={540} y={820} k={1} txt="NO WIRES" tam={80} cor="#fff" rot={4} />}
			</Camera>
			<Sfx src="pop" em={t90} vol={0.45} />
			<Sfx src="pop" em={tAparelhos} vol={0.35} />
			<Sfx src="whoosh" em={tFios + 4} vol={0.45} />
		</>
	);
};

// 5 — tomando uma cerveja, dois engenheiros falando de um livro sobre vikings
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBeb = m('drinks'), tLivro = m('book');
	const livro = usePop(tLivro, 10);
	return (
		<>
			<Camera de={[540, 1200, 1.2]} para={[540, 1120, 1.1]} dur={dur}>
				<Bar>
					<Personagem x={260} y={1800} escala={0.95} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao="feliz" falando={f < tLivro} olhar={1} bracoD={80} cotoveloD={-30} itemD={f >= tBeb ? <Caneca s={0.8} /> : undefined} />
					<Personagem x={820} y={1800} escala={0.95} roupa="passageiro" cor="#5a8f6a" cabelo="#c9a227" expressao="feliz" falando={f >= tLivro} olhar={-1} bracoE={80} cotoveloE={-30} itemE={f >= tBeb ? <Caneca s={0.8} /> : undefined} fase={3} />
					{livro > 0 && <g transform={`translate(540, ${1000 + Math.sin(f / 6) * 10}) rotate(-6) scale(${livro * 0.9})`}><Livro /></g>}
				</Bar>
			</Camera>
			<Sfx src="pop" em={tBeb} vol={0.3} />
			<Sfx src="pop" em={tLivro} vol={0.45} />
		</>
	);
};

// 6 — "um deles sugeriu um codinome: Bluetooth"
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCod = m('code'), tBt = m('bluetooth');
	const luz = usePop(tCod - 6, 9), nota = usePop(tBt, 9);
	return (
		<>
			<Camera de={[440, 1150, 1.4]} para={[540, 1050, 1.15]} dur={dur} soco={tBt}>
				<Bar>
					<Personagem x={330} y={1800} escala={1.05} roupa="passageiro" cor="#4f7cc9" cabelo="#1d1d1d" expressao={f >= tCod - 6 ? 'feliz' : 'serio'} falando bracoD={f >= tCod - 6 ? 165 : 20} cotoveloD={0} />
					{luz > 0 && <g transform={`translate(330, 860) scale(${luz})`}><Lampada /></g>}
					{nota > 0 && <g transform={`translate(740, 1000) rotate(6) scale(${nota * 0.7})`}><Nota texto="BLUETOOTH" /></g>}
				</Bar>
			</Camera>
			<Sfx src="ding" em={tCod - 6} vol={0.4} />
			<Sfx src="pop" em={tBt} vol={0.5} />
		</>
	);
};

// 7 — como o rei, ia unir coisas que não se davam bem
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRei = m('king'), tUne = m('unite');
	const rei = usePop(tRei - 4, 10);
	const liga = interpolate(f, [tUne, tUne + 14], [0, 1], clamp);
	const ap = [[230, 820, 'cel'], [850, 820, 'note'], [230, 1450, 'fone'], [850, 1450, 'cel2']] as const;
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.05]} dur={dur}>
				<rect width={W} height={H} fill="#141e45" />
				<circle cx={540} cy={1100} r={500} fill={AZUL} opacity={0.2 + liga * 0.3} />
				{ap.map(([x, y], i) => (
					<line key={i} x1={540} y1={1100} x2={x + (540 - x) * (1 - liga)} y2={y + (1100 - y) * (1 - liga)} stroke="#5aa0ff" strokeWidth={14} strokeDasharray="30 18" opacity={liga} />
				))}
				{ap.map(([x, y, t], i) => (
					<g key={i} transform={`translate(${x}, ${y}) rotate(${liga < 1 ? Math.sin(f / 3 + i) * 10 : 0})`}>
						{t === 'note' ? <Notebook s={0.55} /> : t === 'fone' ? <Fone s={0.6} /> : <Celular s={0.5} tela={liga >= 1 ? 'CONNECTED' : ''} />}
						{liga < 0.5 && <text x={0} y={-150} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill="#ff6a6a" stroke="#000" strokeWidth={8} paintOrder="stroke">!?</text>}
					</g>
				))}
				{rei > 0 && <Personagem x={540} y={1500} escala={0.85 * rei} {...REI} expressao={liga >= 1 ? 'feliz' : 'serio'} bracoD={liga > 0 ? 160 : 20} bracoE={liga > 0 ? 160 : 20} cotoveloD={10} cotoveloE={10} />}
			</Camera>
			<Sfx src="pop" em={tRei - 4} vol={0.4} />
			<Sfx src="ding" em={tUne + 10} vol={0.45} />
		</>
	);
};

// 8 — era pra ser temporário… mas pegou
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTemp = m('temporary'), tPegou = m('stuck');
	const temp = interpolate(f, [tTemp, tTemp + 6], [0, 1], clamp);
	const pegou = usePop(tPegou, 8);
	return (
		<>
			<Camera de={[540, 960, 1.2]} para={[540, 960, 1.05]} dur={dur} soco={tPegou} tremor={f >= tPegou && f < tPegou + 6 ? 6 : 0}>
				<rect width={W} height={H} fill="#c8d1c2" />
				<g transform={`translate(540, 900) rotate(${f >= tPegou ? -4 : 3})`}><Nota texto="BLUETOOTH" s={1.4} /></g>
				{temp > 0 && (
					<g transform={`translate(540, 1150) rotate(-12) scale(${2 - temp})`} opacity={temp}>
						<rect x={-300} y={-70} width={600} height={140} rx={16} fill="none" stroke="#e8262f" strokeWidth={14} />
						<text x={0} y={34} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={96} fill="#e8262f">TEMPORARY</text>
						{f >= tPegou && <line x1={-300} y1={0} x2={300} y2={0} stroke="#241820" strokeWidth={16} />}
					</g>
				)}
				<Placa x={540} y={480} k={pegou} txt="IT STUCK!" tam={120} cor="#5aff7a" />
			</Camera>
			<Sfx src="pop" em={tTemp} vol={0.4} />
			<Sfx src="boom" em={tPegou} vol={0.5} />
		</>
	);
};

// 9 — o logo: as iniciais do rei em runas vikings
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tLogo = m('logo'), tIni = m('initials'), tRunas = m('runes');
	const runas = usePop(tIni - 4, 10);
	const junta = interpolate(f, [tRunas, tRunas + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const oval = usePop(tRunas + 14, 9);
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 960, 1.05]} dur={dur} soco={tRunas + 14}>
				<MarViking>
					<g transform="translate(540, 1050)">
						<Pedra>
							{oval > 0 && <ellipse cx={0} cy={0} rx={190 * oval} ry={260 * oval} fill={AZUL} stroke="#241820" strokeWidth={10} />}
							{runas > 0 && (
								<g transform={`scale(${runas})`}>
									<g transform={`translate(${-150 * (1 - junta)}, 0)`}><RunaH cor={oval > 0 ? '#fff' : '#241820'} /></g>
									<g transform={`translate(${150 * (1 - junta)}, 0)`}><RunaB cor={oval > 0 ? '#fff' : '#241820'} /></g>
									{junta < 0.3 && (
										<>
											<text x={-150} y={250} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">H</text>
											<text x={150} y={250} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">B</text>
										</>
									)}
								</g>
							)}
						</Pedra>
					</g>
				</MarViking>
				<Placa x={540} y={420} k={usePop(tLogo, 10)} txt="THE LOGO?" tam={100} cor="#fff" />
				{oval > 0 && <text x={540} y={1560} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={76} fill="#ffd23f" stroke="#000" strokeWidth={12} paintOrder="stroke">HARALD BLUETOOTH</text>}
			</Camera>
			<Sfx src="pop" em={tLogo} vol={0.4} />
			<Sfx src="whoosh" em={tRunas} vol={0.4} />
			<Sfx src="boom" em={tRunas + 14} vol={0.5} />
			<Sfx src="ding" em={tRunas + 18} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'Bluetooth',
	pastaVoz: 'voz-bluetooth',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['bluetooth', 'viking', 'king', 'harald', 'denmark', 'norway', 'uniting', 'tooth', 'blue', '1990s', 'wires', 'vikings', 'code', 'unite', 'temporary', 'stuck', 'logo', 'initials', 'runes']),
};
export default ep;
