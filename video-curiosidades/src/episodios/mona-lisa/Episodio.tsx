// Episódio 12 (EN): a Mona Lisa ficou famosa depois de ser roubada (1911).
// Fontes: History.com (furto descoberto em 22/08/1911; recuperada em Florença, dez/1913), Wikipedia (Vincenzo Peruggia),
// Italian Art Society, My Modern Met. Omitidos por falta de confirmação: Picasso interrogado e as "26 horas" exatas.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {Bau, CameraAntiga, Celular, Florenca, Galeria, Jornal, Mona, TorreParis} from './arte';

export const FALAS = [
	"The Mona Lisa wasn't the most famous painting in the world... until someone stole it.",
	'In 1911, it was just one painting among thousands in the Louvre.',
	'Then one Monday morning, a handyman who had worked at the museum walked out with it hidden under his smock.',
	'And nobody noticed until the next day.',
	'The staff assumed it had been taken away to be photographed.',
	'When the truth came out, it was front-page news around the world.',
	'People even lined up to stare at the empty spot on the wall.',
	'Two years later, the thief tried to sell it in Florence, and got caught.',
	'The painting was shown in Italy, then finally returned to Paris.',
	'By then, the Mona Lisa was the most famous painting on Earth.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const LADRAO = {roupa: 'passageiro' as const, cor: '#f1ead8', cabelo: '#1d1d1d'};
const GUARDA = {roupa: 'oficial' as const};

// 0 — gancho: não era famosa… até ser roubada
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tRoubo = m('stole');
	const sumiu = f >= tRoubo + 2;
	return (
		<>
			<Camera de={[540, 640, 2.0]} para={[540, 760, 1.15]} dur={dur} soco={tRoubo + 2}>
				<Galeria monaPresente={!sumiu} />
				{sumiu && f < tRoubo + 8 && <LinhasImpacto op={0.35} />}
				<Placa x={540} y={860} k={usePop(tRoubo + 2, 8)} txt="STOLEN!" tam={140} cor="#e8262f" corTxt="#fff" rot={-6} />
			</Camera>
			<Sfx src="whoosh" em={tRoubo} vol={0.45} />
			<Sfx src="boom" em={tRoubo + 2} vol={0.55} />
		</>
	);
};

// 1 — 1911: só mais um quadro entre milhares no Louvre
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1911'), tMil = m('thousands');
	return (
		<>
			<Camera de={[540, 760, 1.4]} para={[540, 900, 1.0]} dur={dur}>
				<Galeria>
					{[200, 880].map((x, i) => <Personagem key={x} x={x} y={1820} escala={0.7} roupa="treinador" cor={i ? '#5a3f6a' : '#3b3f4a'} cabelo={i ? '#c9a227' : '#4a3326'} expressao="neutro" olhar={i ? -1 : 1} fase={i} />)}
				</Galeria>
				<Placa x={540} y={380} k={usePop(tAno, 10)} txt="1911" tam={120} />
				{f >= tMil && <text x={540} y={1160} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">JUST ONE OF THOUSANDS</text>}
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
		</>
	);
};

// 2 — numa segunda de manhã, um faz-tudo saiu com ele escondido no avental
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSeg = m('monday'), tFaz = m('handyman'), tAvental = m('smock');
	const pega = f >= tAvental - 6;
	const anda = interpolate(f, [tAvental, dur], [540, 1180], clamp);
	const shh = usePop(tAvental, 10);
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[640, 1050, 1.15]} dur={dur}>
				<Galeria monaPresente={!pega}>
					{f >= tFaz - 4 && (
						<g transform={`translate(${pega ? anda : 540}, 0)`}>
							<Personagem x={0} y={1700} escala={1} {...LADRAO} expressao={pega ? 'feliz' : 'serio'} olhar={1} bracoD={pega ? 40 : 15} cotoveloD={pega ? 90 : 10} bracoE={pega ? 40 : 15} cotoveloE={pega ? 90 : 10} inclinar={pega ? Math.sin(f / 3) * 4 : 0} />
							{pega && <rect x={-70} y={1210} width={140} height={190} rx={10} fill="#e9e4d4" stroke="#241820" strokeWidth={6} />}
						</g>
					)}
				</Galeria>
				<Placa x={540} y={420} k={usePop(tSeg, 10)} txt="MONDAY, 7 AM" tam={80} cor="#fff" />
				{pega && <Placa x={300} y={1100} k={shh} txt="SHHH..." tam={70} cor="#ffd23f" rot={-8} />}
			</Camera>
			<Sfx src="pop" em={tSeg} vol={0.35} />
			<Sfx src="whoosh" em={tAvental - 6} vol={0.4} />
		</>
	);
};

// 3 — ninguém percebeu até o dia seguinte
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tProx = m('next');
	return (
		<>
			<Camera de={[540, 900, 1.1]} para={[540, 900, 1.2]} dur={dur}>
				<Galeria monaPresente={false}>
					<Personagem x={300} y={1820} escala={0.85} {...GUARDA} expressao="feliz" olhar={1} fase={1} />
					<Personagem x={800} y={1820} escala={0.7} roupa="treinador" cor="#3b3f4a" cabelo="#4a3326" expressao="neutro" olhar={-1} fase={2} />
				</Galeria>
				<Placa x={540} y={240} k={usePop(tProx - 2, 10)} txt="NEXT DAY..." tam={100} cor="#fff" />
				<text x={540} y={1000} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={90} fill="#ffd23f" stroke="#000" strokeWidth={14} paintOrder="stroke">{f > 6 ? 'LA LA LA' : ''}</text>
			</Camera>
			<Sfx src="pop" em={tProx} vol={0.35} />
		</>
	);
};

// 4 — acharam que tinha ido ser fotografado
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFoto = m('photographed');
	return (
		<>
			<Camera de={[540, 1100, 1.25]} para={[540, 1050, 1.15]} dur={dur}>
				<Galeria monaPresente={false}>
					<Personagem x={300} y={1660} escala={0.9} {...GUARDA} expressao="feliz" olhar={1} bracoD={150} cotoveloD={20} />
					<BalaoPensamentoFoto k={usePop(tFoto - 8, 10)} flash={f >= tFoto && f % 20 < 4} />
				</Galeria>
			</Camera>
			<Sfx src="pop" em={tFoto - 8} vol={0.4} />
			<Sfx src="ding" em={tFoto} vol={0.3} />
		</>
	);
};

const BalaoPensamentoFoto: React.FC<{k: number; flash: boolean}> = ({k, flash}) =>
	k > 0 ? (
		<g transform={`translate(660, 980) scale(${k * 0.85})`}>
			<circle cx={-280} cy={260} r={20} fill="#fff" stroke="#241820" strokeWidth={6} />
			<circle cx={-230} cy={200} r={32} fill="#fff" stroke="#241820" strokeWidth={6} />
			<ellipse cx={0} cy={0} rx={300} ry={230} fill="#fff" stroke="#241820" strokeWidth={9} />
			<g transform="translate(-90, 10) scale(0.5)"><Mona /></g>
			<g transform="translate(120, 0) scale(0.55)"><CameraAntiga flash={flash} /></g>
		</g>
	) : null;

// 5 — quando a verdade veio à tona: manchete no mundo todo
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tVerdade = m('truth'), tCapa = m('frontpage');
	const gira = interpolate(f, [tCapa - 10, tCapa + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<>
			<Camera de={[540, 960, 1.1]} para={[540, 960, 1.15]} dur={dur} soco={tCapa + 6} tremor={f >= tVerdade && f < tCapa ? 4 : 0}>
				<rect width={W} height={H} fill="#1d2a66" />
				{f < tCapa - 10 && (
					<g>
						<Galeria monaPresente={false}>
							<Personagem x={540} y={1820} escala={1} {...GUARDA} expressao="assustado" />
						</Galeria>
					</g>
				)}
				{gira > 0 && <g transform={`translate(540, 900) rotate(${(1 - gira) * 720}) scale(${gira * 1.1})`}><Jornal titulo="STOLEN!" /></g>}
				{f >= tCapa + 8 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${200 + i * 340}, ${1600 + Math.sin(f / 4 + i) * 10}) rotate(${i * 8 - 8}) scale(0.32)`}><Jornal titulo="STOLEN!" /></g>)}
			</Camera>
			<Sfx src="buzz" em={tVerdade} vol={0.3} />
			<Sfx src="whoosh" em={tCapa - 10} vol={0.45} />
			<Sfx src="boom" em={tCapa + 6} vol={0.45} />
		</>
	);
};

// 6 — gente fazendo fila para olhar a parede vazia
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tFila = m('lined'), tVazio = m('empty');
	const n = Math.min(7, Math.max(0, Math.floor((f - tFila + 4) / 3)));
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 900, 1.05]} dur={dur}>
				<Galeria monaPresente={false} ganchos>
					{Array.from({length: n}).map((_, i) => (
						<Personagem key={i} x={120 + i * 140} y={1850 + (i % 2) * 30} escala={0.62} roupa={i % 2 ? 'treinador' : 'camponesa'} cor={['#5a8f6a', '#3b3f4a', '#b8577a', '#5a3f6a', '#4f7cc9', '#6b4a36', '#c9762e'][i]} cabelo={['#4a3326', '#1d1d1d', '#c9a227', '#8a4b2a'][i % 4]} expressao={f >= tVazio ? 'assustado' : 'neutro'} olhar={i < 3 ? 1 : -1} fase={i} />
					))}
				</Galeria>
				{f >= tVazio && <Interrogacao x={540} y={640} inicio={tVazio} s={1.4} />}
			</Camera>
			{[0, 3, 6, 9].map((d) => <Sfx key={d} src="pop" em={tFila + d} vol={0.25} />)}
		</>
	);
};

// 7 — dois anos depois, tentou vender em Florença e foi pego
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDois = m('two'), tFlor = m('florence'), tPego = m('caught');
	const bau = interpolate(f, [tFlor + 4, tFlor + 14], [0, 1], clamp);
	const pego = f >= tPego;
	return (
		<>
			<Camera de={[540, 1100, 1.15]} para={[540, 1100, 1.22]} dur={dur} soco={tPego} tremor={pego && f < tPego + 8 ? 6 : 0}>
				<Florenca>
					<g transform="translate(560, 1720)"><Bau aberto={bau} s={0.9} /></g>
					{bau > 0.5 && <g transform={`translate(560, ${1620 - bau * 120}) scale(0.4)`}><Mona /></g>}
					<Personagem x={240} y={1860} escala={0.85} {...LADRAO} expressao={pego ? 'assustado' : 'feliz'} olhar={1} bracoD={pego ? 160 : 60} bracoE={pego ? 160 : 15} cotoveloD={10} cotoveloE={10} />
					{pego && <Personagem x={860} y={1860} escala={0.95} {...GUARDA} expressao="bravo" olhar={-1} bracoE={100} cotoveloE={-10} />}
				</Florenca>
				<Placa x={540} y={420} k={usePop(tDois, 10)} txt="1913" tam={120} />
				<Placa x={540} y={600} k={usePop(tFlor, 10)} txt="FLORENCE" tam={90} cor="#fff" rot={3} />
				<Placa x={540} y={1060} k={usePop(tPego, 8)} txt="CAUGHT!" tam={130} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tDois} vol={0.35} />
			<Sfx src="pop" em={tFlor} vol={0.35} />
			<Sfx src="boom" em={tPego} vol={0.55} />
		</>
	);
};

// 8 — exposta na Itália, depois de volta a Paris
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tIt = m('italy'), tParis = m('paris');
	const voltou = f >= tParis - 4;
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 960, 1.05]} dur={dur}>
				<rect width={W} height={H} fill={voltou ? '#9fc3e0' : '#f2c88a'} />
				{voltou ? <g transform="translate(830, 1300)"><TorreParis s={1.3} /></g> : <g transform="translate(280, 1000)"><rect x={-60} y={-500} width={120} height={500} fill="#e9d8a6" stroke="#241820" strokeWidth={8} transform="rotate(4)" /></g>}
				<g transform={`translate(${voltou ? 420 : 640}, 760) scale(0.85)`}><Mona brilho={1} /></g>
				{[0, 1, 2, 3, 4].map((i) => <Personagem key={i} x={140 + i * 200} y={1880} escala={0.55} roupa={i % 2 ? 'treinador' : 'camponesa'} cor={['#5a8f6a', '#3b3f4a', '#b8577a', '#5a3f6a', '#4f7cc9'][i]} cabelo={['#4a3326', '#1d1d1d', '#c9a227'][i % 3]} expressao="feliz" fase={i} bracoD={140} cotoveloD={20} />)}
				<Placa x={540} y={240} k={usePop(voltou ? tParis : tIt, 10)} txt={voltou ? 'BACK IN PARIS' : 'ITALY'} tam={96} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tIt} vol={0.35} />
			<Sfx src="whoosh" em={tParis - 4} vol={0.4} />
			<Sfx src="ding" em={tParis} vol={0.4} />
		</>
	);
};

// 9 — o quadro mais famoso da Terra (hoje: multidão com celulares)
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tTerra = m('earth');
	return (
		<>
			<Camera de={[540, 640, 1.6]} para={[540, 900, 1.0]} dur={dur} soco={tTerra}>
				<Galeria>
					<rect x={0} y={1180} width={W} height={20} fill="#c9a227" />
					{Array.from({length: 10}).map((_, i) => {
						const x = 70 + i * 105, y = 1860 + (i % 2) * 40;
						return (
							<g key={i}>
								<Personagem x={x} y={y} escala={0.55} roupa="passageiro" cor={['#5a8f6a', '#b8577a', '#4f7cc9', '#d9a03a', '#7a5a9a'][i % 5]} cabelo={['#4a3326', '#1d1d1d', '#c9a227', '#8a4b2a'][i % 4]} expressao="feliz" bracoD={160} cotoveloD={10} fase={i} />
								<g transform={`translate(${x + 40}, ${y - 470})`}><Celular s={0.7} /></g>
								{(f + i * 7) % 30 < 3 && <circle cx={x + 40} cy={y - 480} r={40} fill="#fff" opacity={0.8} />}
							</g>
						);
					})}
				</Galeria>
				<Placa x={540} y={240} k={usePop(tTerra, 9)} txt="#1 PAINTING ON EARTH" tam={66} cor="#ffd23f" />
			</Camera>
			<Sfx src="boom" em={tTerra} vol={0.5} />
			<Sfx src="ding" em={tTerra + 4} vol={0.4} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'MonaLisa',
	pastaVoz: 'voz-mona-lisa',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['famous', 'stole', '1911', 'thousands', 'louvre', 'monday', 'handyman', 'smock', 'nobody', 'photographed', 'truth', 'frontpage', 'empty', 'florence', 'caught', 'italy', 'paris', 'earth']),
};
export default ep;
