// Episódio 3 (EN): The Great Emu War (1932).
// Fontes: Britannica (Emu War), History Hit, Wikipedia. Voz "Brooks" em public/voz-emu-war/.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import voz from './voz.json';
import {BalaoPensamento, BandeiraBranca, Campo, Caminhao, Emu, MapaAustralia, Metralhadora, Mira, Placar, Telefone, Velocimetro} from './arte';

export const FALAS = [
	'In 1932, Australia went to war... against birds. And the birds won.',
	'After World War One, veterans were given farmland in Western Australia to grow wheat.',
	'Then around twenty thousand emus showed up, and ate everything.',
	'So the farmers called the army. And the army sent soldiers... with machine guns.',
	'Easy, right? Wrong.',
	'Emus can run about fifty kilometers per hour, and the moment you aim, they scatter.',
	'The soldiers even put a gun on a truck. The emus just outran it.',
	'Thousands of bullets later, the army pulled out.',
	'Their commander said that with soldiers as tough as emus, he could face any army in the world.',
	'History calls it the Great Emu War. And the emus won.',
];

const Placa: React.FC<{x: number; y: number; k: number; txt: string; cor?: string; corTxt?: string; rot?: number; tam?: number}> = ({x, y, k, txt, cor = '#ffd23f', corTxt = '#000', rot = -6, tam = 100}) =>
	k > 0 ? (
		<g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${k})`}>
			<rect x={-(txt.length * tam * 0.33 + 50)} y={-tam * 0.85} width={txt.length * tam * 0.66 + 100} height={tam * 1.5} rx={28} fill={cor} stroke="#000" strokeWidth={12} />
			<text x={0} y={tam * 0.33} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={tam} fill={corTxt}>
				{txt}
			</text>
		</g>
	) : null;

// 0 — "Em 1932 a Austrália foi à guerra… contra pássaros. E os pássaros venceram."
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1932'), tGuerra = m('war'), tAves = m('birds'), tVenceu = m('won');
	const ano = usePop(tAno), placar = usePop(tVenceu, 9);
	if (f < tAves - 2)
		return (
			<>
				<Camera de={[540, 1150, 1.25]} para={[540, 1100, 1.05]} dur={tAves} soco={tGuerra}>
					<Campo />
					<rect width={W} height={H} fill="rgba(200,80,20,0.25)" />
					{[300, 540, 780].map((x, i) => (
						<Personagem key={x} x={x} y={1650 + (i === 1 ? 60 : 0)} escala={i === 1 ? 0.95 : 0.8} roupa="soldado" expressao="serio" fase={i} bracoD={f >= tGuerra && i !== 1 ? 150 : 15} cotoveloD={f >= tGuerra && i !== 1 ? 60 : 10} />
					))}
					<g transform="translate(560, 1420)"><Metralhadora s={0.9} /></g>
					<Placa x={540} y={520} k={ano} txt="1932" tam={150} />
				</Camera>
				<Sfx src="pop" em={tAno} vol={0.45} />
				<Sfx src="boom" em={tGuerra} vol={0.55} />
			</>
		);
	return (
		<>
			<Camera de={[540, 1150, 1.5]} para={[540, 1000, 1.0]} dur={dur - tAves} soco={tVenceu - tAves + 2}>
				<Campo />
				<Personagem x={230} y={1700} escala={0.7} roupa="soldado" expressao={f >= tVenceu ? 'enjoado' : 'assustado'} olhar={1} fase={1} />
				<Emu x={560} y={1650} s={1.6} olho={f >= tVenceu ? 'feliz' : 'normal'} medalha={f >= tVenceu} />
				{f < tVenceu && <Interrogacao x={260} y={1050} inicio={tAves + 4} s={0.9} />}
				{placar > 0 && <g transform={`translate(540, 420) scale(${placar})`}><Placar emus={1} exercito={0} /></g>}
			</Camera>
			<Sfx src="whoosh" em={tAves - 3} vol={0.4} />
			<Sfx src="ding" em={tVenceu} vol={0.4} />
		</>
	);
};

// 1 — veteranos ganharam terras no Oeste da Austrália para plantar trigo
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVet = m('veterans'), tOeste = m('western'), tTrigo = m('wheat');
	const mapa = usePop(2, 12);
	const vet = usePop(tVet);
	const dest = interpolate(f, [tOeste, tOeste + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (f < tTrigo - 2)
		return (
			<>
				<Camera de={[540, 960, 1.1]} para={[440, 900, 1.25]} dur={tTrigo}>
					<rect width={W} height={H} fill="#2b4fa0" />
					<circle cx={540} cy={800} r={620} fill="#3b63bd" />
					<g transform={`translate(560, 760) scale(${mapa * 1.35})`}><MapaAustralia destaque={dest} /></g>
					{dest > 0 && <Placa x={330} y={420} k={dest} txt="WESTERN AUSTRALIA" tam={58} cor="#e8463f" corTxt="#fff" rot={-4} />}
					{vet > 0 && <Personagem x={540} y={1750} escala={0.75 * vet} roupa="soldado" expressao="feliz" bracoD={150} cotoveloD={20} />}
				</Camera>
				<Sfx src="pop" em={tVet} vol={0.4} />
				<Sfx src="pop" em={tOeste} vol={0.45} />
			</>
		);
	return (
		<>
			<Camera de={[540, 1200, 1.4]} para={[540, 1120, 1.2]} dur={dur - tTrigo}>
				<Campo />
				<Personagem x={540} y={1720} escala={0.95} roupa="fazendeiro" cabelo="#4a3326" expressao="feliz" bracoD={150} cotoveloD={10} itemD={<g transform="rotate(170)"><path d="M0 0 L0 -120" stroke="#b88a2a" strokeWidth={8} /><ellipse cx={0} cy={-140} rx={16} ry={34} fill="#f6cf5a" stroke={CONTORNO} strokeWidth={4} /></g>} />
			</Camera>
			<Sfx src="whoosh" em={tTrigo - 4} vol={0.35} />
		</>
	);
};

// 2 — 20 mil emus apareceram e comeram tudo
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVinte = m('twenty'), tEmus = m('emus'), tComeu = m('ate');
	const cont = usePop(tVinte, 12);
	const comido = interpolate(f, [tComeu, tComeu + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pos = [[180, 1350, 0.55], [820, 1330, 0.55], [480, 1400, 0.6], [330, 1560, 0.75], [700, 1580, 0.75], [120, 1750, 0.9], [560, 1800, 0.95], [920, 1760, 0.9]];
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1000, 1.0]} dur={dur} tremor={f >= tComeu ? 2 : 0}>
				<Campo comido={comido} />
				{pos.map(([x, y, s], i) => {
					const k = interpolate(f, [tEmus + i * 2 - 6, tEmus + i * 2 + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return k > 0 ? <Emu key={i} x={x} y={y} s={s * k} espelhar={i % 2 === 1} bicando={f >= tComeu} olho={f >= tComeu ? 'feliz' : 'normal'} fase={i} /> : null;
				})}
				<Personagem x={960} y={1150} escala={0.45} roupa="fazendeiro" cabelo="#4a3326" expressao={f >= tComeu ? 'bravo' : f >= tEmus ? 'assustado' : 'feliz'} olhar={-1} bracoE={f >= tComeu ? 150 : 15} />
				<Placa x={540} y={480} k={cont} txt="20,000" tam={150} />
			</Camera>
			<Sfx src="pop" em={tVinte} vol={0.45} />
			{[0, 4, 8, 12].map((d) => <Sfx key={d} src="pop" em={tEmus + d} vol={0.25} />)}
			<Sfx src="uhoh" em={tComeu} vol={0.45} />
		</>
	);
};

// 3 — ligaram para o exército, que mandou soldados com metralhadoras
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tLig = m('called'), tMandou = m('sent'), tMetra = m('machine');
	const metra = usePop(tMetra, 9);
	const socorro = usePop(tLig);
	if (f < tMandou - 2)
		return (
			<>
				<Camera de={[540, 1150, 1.6]} para={[540, 1150, 1.8]} dur={tMandou} tremor={f >= tLig ? 2 : 0}>
					<Campo comido={1} />
					<Personagem x={540} y={1760} escala={1} roupa="fazendeiro" cabelo="#4a3326" expressao="bravo" falando={f >= tLig} olhar={1} bracoD={60} cotoveloD={-40} itemD={<g transform="translate(-10,-60) scale(0.8)"><Telefone /></g>} />
					<Placa x={690} y={860} k={socorro} txt="HELP!" cor="#e8463f" corTxt="#fff" tam={90} rot={8} />
				</Camera>
				<Sfx src="ding" em={tLig - 6} vol={0.4} />
			</>
		);
	const entra = interpolate(f, [tMandou - 2, tMandou + 16], [700, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1150, 1.3]} dur={dur - tMandou} soco={tMetra - tMandou + 2}>
				<Campo comido={1} />
				<g transform={`translate(${entra}, 0)`}>
					{[300, 540, 780].map((x, i) => (
						<Personagem key={x} x={x} y={1640 + (i === 1 ? 40 : 0)} escala={0.82} roupa="soldado" expressao="serio" fase={i} inclinar={Math.sin(f / 3 + i) * 3} />
					))}
				</g>
				{metra > 0 && <g transform={`translate(520, 1580) scale(${metra * 1.25})`}><Metralhadora /></g>}
				{f >= tMetra && f < tMetra + 6 && <LinhasImpacto op={0.35} />}
			</Camera>
			<Sfx src="whoosh" em={tMandou - 4} vol={0.4} />
			<Sfx src="boom" em={tMetra} vol={0.6} />
		</>
	);
};

// 4 — "Fácil, né? Errado."
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tErr = m('wrong');
	const err = usePop(tErr, 8);
	const ex = interpolate(f, [tErr - 4, tErr + 8], [-400, 1500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1200, 1.5]} para={[540, 1150, 1.4]} dur={dur} soco={tErr} tremor={f >= tErr ? 6 : 0}>
				<Campo comido={1} />
				<Personagem x={540} y={1780} escala={1.05} roupa="soldado" expressao={f >= tErr ? 'assustado' : 'feliz'} bracoD={f >= tErr ? 15 : 150} cotoveloD={f >= tErr ? 10 : 30} inclinar={f >= tErr ? Math.sin(f) * 8 : 0} />
				{f >= tErr - 4 && f < tErr + 10 && <Emu x={ex} y={1880} s={1.2} corre={3} olho="bravo" />}
				<Placa x={540} y={720} k={err} txt="WRONG!" cor="#e8262f" corTxt="#fff" tam={130} />
			</Camera>
			<Sfx src="whoosh" em={tErr - 4} vol={0.55} />
			<Sfx src="buzz" em={tErr} vol={0.4} />
		</>
	);
};

// 5 — correm a 50 km/h e se espalham quando você mira
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCinq = m('fifty'), tMira = m('aim'), tEsp = m('scatter');
	const vel = interpolate(f, [tCinq, tCinq + 14], [0, 50], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const vk = usePop(tCinq, 12);
	if (f < tMira - 2)
		return (
			<>
				<Camera de={[540, 1250, 1.2]} para={[540, 1200, 1.3]} dur={tMira} tremor={3}>
					<Campo comido={1} poeira />
					<Emu x={500} y={1720} s={1.5} corre={2.5} olho="bravo" />
					{vk > 0 && <g transform={`translate(540, 620) scale(${vk})`}><Velocimetro v={vel} /></g>}
				</Camera>
				<Sfx src="pop" em={tCinq} vol={0.4} />
				<Sfx src="whoosh" em={4} vol={0.3} />
			</>
		);
	const sp = interpolate(f, [tEsp, tEsp + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
	const grupo = [[0, 0], [-200, 60], [200, 40], [-110, 210], [130, 230], [-300, 250], [300, 260]];
	return (
		<>
			<Camera de={[540, 1250, 1.25]} para={[540, 1200, 1.1]} dur={dur - tMira}>
				<Campo comido={1} />
				{grupo.map(([dx, dy], i) => {
					const ang = Math.atan2(dy + 60, dx || (i % 2 ? 1 : -1));
					const dist = sp * 1100;
					return <Emu key={i} x={540 + dx + Math.cos(ang) * dist} y={1500 + dy + Math.sin(ang) * dist * 0.3} s={0.7} espelhar={dx < 0} corre={f >= tEsp ? 3 : 0} olho={f >= tEsp ? 'assustado' : 'normal'} fase={i} />;
				})}
				{f < tEsp + 4 && <g transform={`translate(540, 1300) scale(${1 + Math.sin(f / 3) * 0.04})`}><Mira s={1.4} /></g>}
			</Camera>
			<Sfx src="pop" em={tMira} vol={0.4} />
			<Sfx src="whoosh" em={tEsp} vol={0.6} />
		</>
	);
};

// 6 — puseram a metralhadora num caminhão; os emus foram mais rápidos
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCam = m('truck'), tPassa = m('outran');
	const cam = usePop(0, 12);
	void tCam;
	const rapido = usePop(tPassa + 10);
	const passa = interpolate(f, [tPassa - 2, tPassa + 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1350, 1.3]} para={[600, 1300, 1.1]} dur={dur} tremor={3}>
				<Campo comido={1} poeira />
				{cam > 0 && (
					<g transform={`translate(${interpolate(f, [0, dur], [380, 520])}, 1800) scale(${cam})`}>
						<Personagem x={-160} y={-150} escala={0.5} roupa="soldado" expressao={f >= tPassa ? 'assustado' : 'serio'} olhar={1} />
						<Caminhao s={1.2} />
					</g>
				)}
				{passa > 0 &&
					[0, 1, 2, 3].map((i) => <Emu key={i} x={-300 + passa * 1900 - i * 220} y={1560 + (i % 2) * 120} s={0.75} corre={3} olho="feliz" fase={i} />)}
				<Placa x={540} y={650} k={rapido} txt="TOO FAST!" tam={100} />
			</Camera>
			<Sfx src="aviao" em={0} vol={0.25} />
			<Sfx src="whoosh" em={tPassa} vol={0.55} />
			<Sfx src="pop" em={tPassa + 10} vol={0.4} />
		</>
	);
};

// 7 — milhares de balas depois, o exército desistiu
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSai = m('pulled');
	const sai = interpolate(f, [tSai, tSai + 40], [0, -500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<>
			<Camera de={[540, 1250, 1.2]} para={[480, 1200, 1.1]} dur={dur}>
				<Campo comido={1} />
				<Emu x={760} y={1500} s={0.7} olho="feliz" espelhar bicando={f < tSai} />
				<Emu x={900} y={1650} s={0.8} olho="feliz" espelhar fase={3} />
				{f < tSai ? (
					<>
						<Personagem x={300} y={1800} escala={0.85} roupa="soldado" expressao="bravo" olhar={1} fase={2} />
						<g transform="translate(470, 1560)"><Metralhadora s={0.8} atira /></g>
						{[0, 1, 2].map((i) => f > 6 + i * 12 && <text key={i} x={620 + i * 130} y={1150 - i * 90} fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke" transform={`rotate(${-10 + i * 8} ${620 + i * 130} ${1150 - i * 90})`}>MISS!</text>)}
					</>
				) : (
					<g transform={`translate(${sai}, 0)`}>
						<Personagem x={350} y={1800} escala={0.85} roupa="soldado" expressao="enjoado" olhar={-1} bracoD={150} cotoveloD={10} itemD={<g transform="rotate(180)"><BandeiraBranca s={0.9} /></g>} />
					</g>
				)}
			</Camera>
			{[6, 18, 30].map((t) => <Sfx key={t} src="pop" em={t} vol={0.3} />)}
			<Sfx src="uhoh" em={tSai} vol={0.45} />
		</>
	);
};

// 8 — o comandante: "com soldados tão duros quanto emus, enfrentaria qualquer exército"
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEmus = m('emus'), tQualquer = m('any');
	const balao = usePop(tEmus - 4, 12);
	return (
		<>
			<Camera de={[540, 1250, 1.35]} para={[540, 1100, 1.1]} dur={dur} soco={tQualquer}>
				<rect width={W} height={H} fill="#6e6440" />
				<rect y={1300} width={W} height={620} fill="#4f4828" />
				<rect x={120} y={360} width={420} height={300} fill="#e9c27a" stroke={CONTORNO} strokeWidth={10} />
				<g transform="translate(330, 510) scale(0.55)"><MapaAustralia destaque={1} /></g>
				<Personagem x={600} y={1900} escala={1.15} roupa="oficial" expressao={f >= tQualquer ? 'bravo' : 'serio'} falando olhar={-0.4} bracoD={f >= tQualquer ? 150 : 40} cotoveloD={f >= tQualquer ? 10 : 80} />
				<BalaoPensamento x={560} y={560} k={balao}>
					<rect x={-450} y={-300} width={900} height={600} fill="#cfe3a4" />
					{[-240, 0, 240].map((x, i) => <Emu key={x} x={x} y={150 - (i % 2) * 20} s={0.55} capacete corre={1} olho="bravo" fase={i} />)}
				</BalaoPensamento>
			</Camera>
			<Sfx src="pop" em={tEmus - 4} vol={0.45} />
			<Sfx src="boom" em={tQualquer} vol={0.35} />
		</>
	);
};

// 9 — "A história chama de A Grande Guerra dos Emus. E os emus venceram."
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tGrande = m('great'), tVenceu = m('won');
	const titulo = usePop(tGrande, 10), venc = usePop(tVenceu, 9);
	return (
		<>
			<Camera de={[540, 1100, 1.2]} para={[540, 1000, 1.0]} dur={dur} soco={tVenceu}>
				<Campo comido={1} />
				{/* pódio */}
				<rect x={360} y={1500} width={360} height={260} fill="#f2c14e" stroke={CONTORNO} strokeWidth={10} />
				<text x={540} y={1690} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={170} fill={CONTORNO}>1</text>
				<Emu x={520} y={1500} s={1.1} olho="feliz" medalha={f >= tVenceu} />
				<Personagem x={170} y={1820} escala={0.6} roupa="soldado" expressao="enjoado" olhar={1} />
				<Personagem x={930} y={1820} escala={0.6} roupa="oficial" expressao="enjoado" olhar={-1} fase={2} />
				{titulo > 0 && (
					<g transform={`translate(540, 330) scale(${titulo}) rotate(-3)`}>
						<rect x={-470} y={-110} width={940} height={200} rx={30} fill="#e8463f" stroke="#000" strokeWidth={12} />
						<text x={0} y={30} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#fff">THE GREAT EMU WAR</text>
					</g>
				)}
				{venc > 0 && <g transform={`translate(540, 640) scale(${venc * 0.85})`}><Placar emus={1} exercito={0} /></g>}
				{f >= tVenceu &&
					Array.from({length: 40}).map((_, i) => {
						const t = f - tVenceu;
						const x = (i * 97) % 1080, y = -50 + t * (12 + (i % 5) * 3) + ((i * 53) % 300) - 300;
						return <rect key={i} x={x + Math.sin(t / 5 + i) * 30} y={y} width={18} height={28} fill={['#ffd23f', '#e8463f', '#2f5bd3', '#5aff7a'][i % 4]} transform={`rotate(${t * 9 + i * 20} ${x} ${y})`} />;
					})}
			</Camera>
			<Sfx src="pop" em={tGrande} vol={0.5} />
			<Sfx src="boom" em={tVenceu} vol={0.6} />
			<Sfx src="ding" em={tVenceu + 4} vol={0.35} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'EmuWar',
	pastaVoz: 'voz-emu-war',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['1932', 'birds', 'won', 'western', 'wheat', 'twenty', 'thousand', 'emus', 'ate', 'army', 'machine', 'guns', 'wrong', 'fifty', 'scatter', 'truck', 'outran', 'pulled', 'tough', 'great', 'emu', 'war']),
};
export default ep;
