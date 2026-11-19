// Episódio (EN): tubarões são mais antigos que as árvores.
// Fontes: Natural History Museum (Londres), Smithsonian Ocean, Florida Museum, National Geographic.
// Primeiros tubarões: ~450 milhões de anos (escamas do Ordoviciano). Primeiras árvores: ~385 milhões (Devoniano,
// Wattieza/Archaeopteris). Mais antigos que os dinossauros (~230 Ma); sobreviveram a várias extinções em massa.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';

export const FALAS = [
	'Sharks are older than trees.',
	'The first sharks swam the oceans around 450 million years ago.',
	'The first trees? They showed up about 385 million years ago.',
	'That means sharks were around for tens of millions of years before there was a single forest.',
	"They're older than dinosaurs too, and they survived several mass extinctions.",
	"So sharks were here before forests, before dinosaurs, and they're still here today.",
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Tubarao: React.FC<{s?: number; cor?: string; oculos?: boolean}> = ({s = 1, cor = '#7f97ab', oculos = false}) => {
	const f = useCurrentFrame();
	const cauda = Math.sin(f / 4) * 10;
	return (
		<g transform={`scale(${s})`}>
			<path d={`M260 0 L380 ${-90 + cauda} L350 0 L380 ${90 + cauda}Z`} fill={cor} stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<path d="M-60 -70 L20 -190 L60 -70Z" fill={cor} stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<path d="M-320 0 Q-260 -110 -40 -100 Q200 -90 290 0 Q200 90 -40 100 Q-260 110 -320 0Z" fill={cor} stroke={CONTORNO} strokeWidth={10} />
			<path d="M-300 20 Q-200 90 -20 90 Q160 80 270 10 Q160 60 -20 60 Q-200 60 -300 20Z" fill="#e9eef2" />
			<path d="M-20 60 L40 140 L80 60Z" fill={cor} stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
			{[-130, -105, -80].map((x) => <path key={x} d={`M${x} -30 q -8 30 0 60`} stroke={CONTORNO} strokeWidth={5} fill="none" />)}
			<circle cx={-220} cy={-30} r={14} fill={CONTORNO} />
			<path d="M-290 30 Q-250 50 -200 36" stroke={CONTORNO} strokeWidth={6} fill="none" strokeLinecap="round" />
			{[-280, -260, -240, -220].map((x) => <path key={x} d={`M${x} 34 l8 12 l8 -12`} fill="#fff" stroke={CONTORNO} strokeWidth={2} />)}
			{oculos && <path d="M-270 -50 h50 v28 h-50Z M-215 -40 h20 M-195 -50 h50 v28 h-50Z" fill="#111" stroke="#111" strokeWidth={6} />}
		</g>
	);
};

export const Arvore: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-30 0 L-20 -220 L20 -220 L30 0Z" fill="#7a5230" stroke={CONTORNO} strokeWidth={8} />
		<circle cx={0} cy={-300} r={130} fill="#3c8a4a" stroke={CONTORNO} strokeWidth={9} />
		<circle cx={-90} cy={-230} r={80} fill="#3c8a4a" stroke={CONTORNO} strokeWidth={9} />
		<circle cx={90} cy={-230} r={80} fill="#3c8a4a" stroke={CONTORNO} strokeWidth={9} />
		<circle cx={-40} cy={-330} r={30} fill="#5aaa5a" />
	</g>
);

export const Dino: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-260 -60 Q-380 -100 -420 -40 Q-340 -60 -250 -10Z" fill="#7fb35a" stroke={CONTORNO} strokeWidth={8} />
		<ellipse cx={-80} cy={-80} rx={200} ry={110} fill="#7fb35a" stroke={CONTORNO} strokeWidth={9} />
		<path d="M40 -140 Q120 -320 160 -360 Q220 -380 230 -330 Q200 -300 170 -280 Q110 -200 90 -100Z" fill="#7fb35a" stroke={CONTORNO} strokeWidth={9} />
		<circle cx={195} cy={-345} r={8} fill={CONTORNO} />
		{[-180, -60].map((x) => <rect key={x} x={x - 25} y={0} width={50} height={90} rx={14} fill="#7fb35a" stroke={CONTORNO} strokeWidth={8} />)}
		{[-160, -110, -60, -10].map((x) => <path key={x} d={`M${x} -180 l20 -40 l20 40Z`} fill="#e8a23a" stroke={CONTORNO} strokeWidth={5} />)}
	</g>
);

const Oceano: React.FC<{escuro?: number; children?: React.ReactNode}> = ({escuro = 0, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill={escuro ? '#0f3a66' : '#1f6fb5'} />
			<rect width={W} height={H} fill="url(#ocGrad)" />
			<defs><linearGradient id="ocGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5ab8e8" stopOpacity="0.6" /><stop offset="1" stopColor="#0a2a4a" stopOpacity="0.6" /></linearGradient></defs>
			{Array.from({length: 14}).map((_, i) => <circle key={i} cx={(i * 157) % 1080} cy={1920 - ((f * (2 + (i % 3)) + i * 200) % 1920)} r={10 + (i % 4) * 5} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={4} />)}
			<path d="M0 1750 Q270 1700 540 1760 T1080 1740 V1920 H0Z" fill="#c9b27a" />
			{children}
		</g>
	);
};

const Terra: React.FC<{children?: React.ReactNode; ceu?: string}> = ({children, ceu = '#f2c88a'}) => (
	<g>
		<rect width={W} height={H} fill={ceu} />
		<path d="M0 900 L200 700 L380 880 L600 620 L820 860 L1080 700 V1300 H0Z" fill="#b5835a" opacity={0.6} />
		<rect y={1400} width={W} height={520} fill="#8a6a4a" />
		<path d="M0 1400 Q270 1370 540 1400 T1080 1390 V1440 H0Z" fill="#7fb35a" />
		{children}
	</g>
);

// linha do tempo (milhões de anos atrás): 450 à esquerda → hoje à direita
const xMa = (ma: number) => 140 + ((470 - ma) / 270) * 800;
const Linha: React.FC<{y: number; marcas: {ma: number; txt: string; k: number; cor: string}[]; faixa?: number}> = ({y, marcas, faixa = 0}) => (
	<g>
		{faixa > 0 && <rect x={xMa(450)} y={y - 40} width={(xMa(385) - xMa(450)) * faixa} height={80} fill="#ffd23f" opacity={0.7} rx={12} />}
		<rect x={90} y={y - 12} width={900} height={24} rx={12} fill="#fff" stroke={CONTORNO} strokeWidth={6} />
		{marcas.map((mk) => mk.k > 0 && (
			<g key={mk.txt} transform={`translate(${xMa(mk.ma)}, ${y}) scale(${mk.k})`}>
				<circle r={26} fill={mk.cor} stroke={CONTORNO} strokeWidth={6} />
				<text y={90} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={44} fill="#fff" stroke={CONTORNO} strokeWidth={8} paintOrder="stroke">{mk.txt}</text>
			</g>
		))}
	</g>
);

// 0 — gancho: tubarões são mais velhos que as árvores
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVelho = m('older'), tArv = m('trees');
	const kA = usePop(tArv - 4, 10);
	return (
		<>
			<Camera de={[540, 960, 1.3]} para={[540, 960, 1.05]} dur={dur} soco={tVelho}>
				<rect width={W} height={H} fill="#bfe3ff" />
				<rect y={960} width={W} height={960} fill="#1f6fb5" />
				<path d={`M0 960 Q270 ${930 + Math.sin(f / 6) * 10} 540 960 T1080 960`} fill="#bfe3ff" />
				<rect x={600} y={760} width={480} height={210} fill="#7fb35a" />
				<g transform={`translate(440, 1560) rotate(${Math.sin(f / 8) * 4})`}><Tubarao s={0.95} /></g>
				<g transform={`translate(840, 790) scale(${kA})`}><Arvore s={1.5} /></g>
				<Placa x={540} y={300} k={usePop(tVelho, 9)} txt="OLDER THAN TREES?!" tam={80} />
			</Camera>
			<Sfx src="boom" em={tVelho} vol={0.4} />
			<Sfx src="pop" em={tArv - 4} vol={0.35} />
		</>
	);
};

// 1 — primeiros tubarões: ~450 milhões de anos
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTub = m('sharks'), t450 = m('450');
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.0]} dur={dur} soco={t450}>
				<Oceano escuro={1}>
					<g transform={`translate(${interpolate(f, [tTub - 6, dur], [-400, 1300], clamp)}, ${1000 + Math.sin(f / 10) * 30}) scale(-1, 1)`}><Tubarao s={1} cor="#6f8a7a" /></g>
				</Oceano>
				<Placa x={540} y={300} k={usePop(t450, 10)} txt="450 MILLION" tam={120} />
				<Placa x={540} y={480} k={usePop(t450 + 6, 10)} txt="YEARS AGO" tam={80} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="whoosh" em={tTub - 6} vol={0.4} />
			<Sfx src="pop" em={t450} vol={0.45} />
		</>
	);
};

// 2 — primeiras árvores: ~385 milhões
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tArv = m('trees'), t385 = m('385');
	const cresce = interpolate(f, [tArv, tArv + 20], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1050, 1.0]} dur={dur} soco={t385}>
				<Terra>
					<g transform={`translate(540, 1420) scale(${cresce * 1.4})`}><Arvore /></g>
				</Terra>
				<Placa x={540} y={300} k={usePop(t385, 10)} txt="385 MILLION" tam={120} />
				<Placa x={540} y={1700} k={usePop(tArv + 6, 10)} txt="FIRST TREES" tam={100} cor="#7fe08a" />
			</Camera>
			<Sfx src="pop" em={tArv} vol={0.4} />
			<Sfx src="pop" em={t385} vol={0.45} />
		</>
	);
};

// 3 — dezenas de milhões de anos antes de qualquer floresta (linha do tempo)
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDez = m('tens'), tFlor = m('forest');
	const kT = usePop(4, 10), kA = usePop(10, 10), kDn = usePop(16, 10);
	const faixa = interpolate(f, [tDez, tDez + 20], [0, 1], clamp);
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.0]} dur={dur} soco={tFlor}>
				<rect width={W} height={H} fill="#1d2a66" />
				<circle cx={540} cy={960} r={700} fill="rgba(255,255,255,0.06)" />
				<g transform={`translate(${xMa(450) + 60}, 760) scale(${kT * 0.45}) scale(-1,1)`}><Tubarao /></g>
				<g transform={`translate(${xMa(385)}, 1740) scale(${kA * 0.6})`}><Arvore /></g>
				<g transform={`translate(${xMa(230) - 20}, 820) scale(${kDn * 0.45})`}><Dino /></g>
				<Linha y={960} faixa={faixa} marcas={[{ma: 450, txt: '450M', k: kT, cor: '#7f97ab'}, {ma: 385, txt: '385M', k: kA, cor: '#3c8a4a'}, {ma: 230, txt: '230M', k: kDn, cor: '#7fb35a'}]} />
				<Placa x={540} y={300} k={usePop(tDez + 6, 10)} txt="65 MILLION YEARS" tam={90} />
				<Placa x={540} y={1650} k={usePop(tFlor, 10)} txt="NO FORESTS YET!" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={4} vol={0.35} />
			<Sfx src="pop" em={10} vol={0.35} />
			<Sfx src="whoosh" em={tDez} vol={0.35} />
			<Sfx src="boom" em={tFlor} vol={0.35} />
		</>
	);
};

// 4 — mais velhos que os dinossauros; sobreviveram a várias extinções em massa
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDino = m('dinosaurs'), tExt = m('extinctions');
	const kD = usePop(tDino - 4, 10);
	const meteoro = interpolate(f, [tExt - 10, tExt + 4], [0, 1], clamp);
	const bum = f >= tExt + 4;
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} tremor={bum ? 8 * Math.exp(-(f - tExt - 4) / 12) : 0}>
				<Terra ceu={bum ? '#f2885a' : '#f2c88a'}>
					<g transform={`translate(640, 1420) scale(${kD})`}><Dino s={1.2} /></g>
					{meteoro > 0 && !bum && <g transform={`translate(${1100 - meteoro * 500}, ${-100 + meteoro * 1300})`}><circle r={70} fill="#5a3a2a" stroke={CONTORNO} strokeWidth={8} /><path d="M40 -60 L260 -330 L60 -20Z" fill="#ffb000" opacity={0.8} /></g>}
					{bum && <circle cx={600} cy={1300} r={interpolate(f, [tExt + 4, tExt + 20], [50, 900], clamp)} fill="#fff6c0" opacity={interpolate(f, [tExt + 4, tExt + 24], [0.9, 0], clamp)} />}
				</Terra>
				<g transform="translate(0, 0)">
					<rect x={0} y={1500} width={W} height={420} fill="#1f6fb5" />
					<g transform={`translate(${interpolate(f, [0, dur], [200, 600])}, 1700)`}><Tubarao s={0.6} oculos={bum} /></g>
				</g>
				<Placa x={540} y={260} k={usePop(tDino, 10)} txt="OLDER THAN DINOS" tam={90} />
				<Placa x={540} y={440} k={usePop(tExt + 6, 9)} txt="SURVIVED IT ALL" tam={80} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tDino - 4} vol={0.4} />
			<Sfx src="whoosh" em={tExt - 10} vol={0.4} />
			<Sfx src="boom" em={tExt + 4} vol={0.6} />
		</>
	);
};

// 5 — antes das florestas, antes dos dinossauros, e ainda aqui hoje
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tF = m('forests'), tD = m('dinosaurs'), tH = m('today');
	const itens: [string, number][] = [['BEFORE FORESTS', tF], ['BEFORE DINOSAURS', tD], ['STILL HERE TODAY', tH]];
	const ks = itens.map(([, t]) => usePop(t, 10));
	return (
		<>
			<Camera de={[540, 1000, 1.15]} para={[540, 1000, 1.0]} dur={dur} soco={tH}>
				<Oceano>
					<g transform={`translate(${540 + Math.sin(f / 20) * 160}, ${1450 + Math.sin(f / 10) * 20}) scale(${Math.cos(f / 20) > 0 ? -1 : 1}, 1)`}><Tubarao s={0.9} oculos /></g>
					{itens.map(([txt], i) => ks[i] > 0 && (
						<g key={txt} transform={`translate(540, ${360 + i * 170}) scale(${ks[i]})`}>
							<rect x={-420} y={-62} width={840} height={124} rx={24} fill="#fff" stroke={CONTORNO} strokeWidth={8} />
							<circle cx={-340} cy={0} r={40} fill="#3fbf5a" stroke={CONTORNO} strokeWidth={6} />
							<path d="M-360 0 l14 16 l28 -32" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
							<text x={30} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={62} fill={CONTORNO}>{txt}</text>
						</g>
					))}
				</Oceano>
			</Camera>
			{itens.map(([, t], i) => <Sfx key={i} src="ding" em={t} vol={0.35} />)}
		</>
	);
};

const ep: DefEpisodio = {
	id: 'SharksTrees',
	pastaVoz: 'voz-sharks-trees',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5],
	destaques: new Set(['older', 'trees', 'sharks', '450', '385', 'tens', 'forest', 'dinosaurs', 'extinctions', 'forests', 'today']),
};
export default ep;
