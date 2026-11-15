// Episódio 8 (EN): a praga da dança de 1518 (Estrasburgo).
// Fontes: Wikipedia (Dancing plague of 1518), Medievalists.net, Mental Floss, Past Medical History.
// Números de dançarinos e mortes são disputados (os registros da cidade nem citam mortes) → "some accounts".
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, LinhasImpacto, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import voz from './voz.json';
import {CestaVazia, Chama, Doente, Flauta, Guildhall, Notas, Palco, Raio, Rolo, RuaMedieval, Tambor, danca} from './arte';

export const FALAS = [
	"In 1518, people in one city started dancing... and couldn't stop.",
	'It began in Strasbourg, when one woman stepped into the street and danced for days.',
	'Within a week, dozens had joined her. Some accounts say it grew to hundreds.',
	"The city's doctors had a diagnosis: hot blood.",
	'And the cure? More dancing.',
	'So the city cleared halls, built a stage, and even paid musicians to keep them going.',
	'It only made things worse.',
	'Dancers collapsed from exhaustion. Some later accounts claim people even died.',
	'Many historians now think it was a stress-driven mass hysteria, after years of famine and disease.',
	'A whole city was so stressed out... it literally danced itself sick.',
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CORES = ['#5a8f6a', '#8a6a44', '#b8577a', '#4f7cc9', '#c9762e', '#7a5a9a', '#3a9c9c'];
const CABELOS = ['#4a3326', '#1d1d1d', '#c9a227', '#8a4b2a', '#6b3a1f'];

// multidão dançando: n pessoas em fileiras
const Multidao: React.FC<{n: number; f: number; forca?: number; y0?: number; exaustos?: boolean}> = ({n, f, forca = 1, y0 = 1560, exaustos}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const fila = Math.floor(i / 5);
			const col = i % 5;
			const s = 0.5 + fila * 0.12;
			const x = 120 + col * 210 + (fila % 2) * 100 - 50;
			const y = y0 + fila * 110;
			const mulher = i % 2 === 0;
			const props = exaustos
				? {expressao: 'enjoado' as const, enjoo: 0.5, inclinar: (i % 2 ? 1 : -1) * 18, bracoD: 10, bracoE: 10}
				: {expressao: (i % 3 ? 'assustado' : 'enjoado') as 'assustado' | 'enjoado', ...danca(f, i, forca)};
			return <Personagem key={i} x={x} y={y - (exaustos ? 0 : Math.abs(Math.sin(f * 0.5 + i)) * 20)} escala={s} roupa={mulher ? 'camponesa' : 'campones'} cor={CORES[i % CORES.length]} cabelo={CABELOS[i % CABELOS.length]} fase={i} {...props} />;
		})}
	</g>
);

// 0 — gancho: uma cidade começou a dançar e não parou
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1518'), tPara = m('stop');
	const forca = f >= tPara ? 1.6 : 1;
	return (
		<>
			<Camera de={[540, 1250, 1.3]} para={[540, 1150, 1.1]} dur={dur} soco={tPara} tremor={f >= tPara ? 4 : 0}>
				<RuaMedieval>
					<Multidao n={10} f={f * (f >= tPara ? 1.5 : 1)} forca={forca} y0={1520} />
				</RuaMedieval>
				<Placa x={540} y={640} k={usePop(tAno, 10)} txt="1518" tam={150} />
				<Placa x={540} y={860} k={usePop(tPara, 9)} txt="CAN'T STOP!" tam={100} cor="#e8463f" corTxt="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="boom" em={tPara} vol={0.5} />
		</>
	);
};

// 1 — começou em Estrasburgo com uma mulher dançando por dias
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCidade = m('strasbourg'), tMulher = m('woman'), tDias = m('days');
	const noite = f >= tDias ? (Math.floor((f - tDias) / 8) % 2) : 0;
	const dia = f >= tDias ? Math.min(4, Math.floor((f - tDias) / 8) / 2 + 1) : 0;
	return (
		<>
			<Camera de={[540, 1200, 1.2]} para={[540, 1250, 1.35]} dur={dur}>
				<RuaMedieval noite={noite}>
					{f >= tMulher - 4 && <Personagem x={540} y={1760} escala={1} roupa="camponesa" cor="#b8577a" cabelo="#6b3a1f" expressao={f >= tDias ? 'enjoado' : 'feliz'} {...danca(f, 0)} />}
				</RuaMedieval>
				<Placa x={540} y={660} k={usePop(tCidade, 10)} txt="STRASBOURG" tam={100} cor="#fff" />
				{dia > 0 && <Placa x={540} y={850} k={1} txt={`DAY ${Math.floor(dia)}`} tam={90} cor="#ffd23f" rot={3} />}
			</Camera>
			<Sfx src="pop" em={tCidade} vol={0.4} />
			<Sfx src="whoosh" em={tDias} vol={0.3} />
		</>
	);
};

// 2 — dezenas se juntaram; alguns relatos falam em centenas
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tDuzias = m('dozens'), tCentenas = m('hundreds');
	const n = f < tDuzias ? 1 : f < tCentenas ? Math.min(10, 1 + Math.floor((f - tDuzias) / 2)) : Math.min(20, 10 + Math.floor((f - tCentenas) / 2));
	const cont = f < tDuzias ? '' : f < tCentenas ? '34' : '400?';
	return (
		<>
			<Camera de={[540, 1250, 1.25]} para={[540, 1150, 1.0]} dur={dur} soco={tCentenas}>
				<RuaMedieval>
					<Multidao n={n} f={f} y0={1440} />
				</RuaMedieval>
				{cont && (
					<g transform="translate(540, 660)">
						<rect x={-230} y={-100} width={460} height={180} rx={36} fill={cont === '34' ? '#fff' : '#e8463f'} stroke="#000" strokeWidth={12} />
						<text x={0} y={45} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={130} fill={cont === '34' ? '#000' : '#fff'}>{cont}</text>
					</g>
				)}
			</Camera>
			<Sfx src="pop" em={tDuzias} vol={0.4} />
			<Sfx src="pop" em={tCentenas} vol={0.5} />
		</>
	);
};

// 3 — diagnóstico dos médicos: "sangue quente"
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMed = m('doctors'), tQuente = m('hot');
	const rolo = usePop(tQuente - 2, 9);
	return (
		<>
			<Camera de={[540, 1200, 1.3]} para={[540, 1100, 1.15]} dur={dur} soco={tQuente}>
				<RuaMedieval>
					<Personagem x={300} y={1780} escala={1.05} roupa="medico" cabelo="#c9c9c9" expressao="serio" olhar={1} bracoD={90} cotoveloD={-30} />
					<Personagem x={800} y={1760} escala={0.85} roupa="campones" cor="#8a6a44" cabelo="#1d1d1d" expressao="enjoado" fase={2} {...danca(f, 2)} />
				</RuaMedieval>
				{rolo > 0 && (
					<g transform={`translate(540, 700) scale(${rolo})`}>
						<Rolo texto="HOT BLOOD" />
						<g transform="translate(250, -120)"><Chama s={0.8} /></g>
					</g>
				)}
				{f < tQuente && f >= tMed && <Interrogacao x={540} y={760} inicio={tMed} s={1} />}
			</Camera>
			<Sfx src="pop" em={tMed} vol={0.35} />
			<Sfx src="ding" em={tQuente} vol={0.45} />
		</>
	);
};

// 4 — "e a cura? Mais dança."
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMais = m('more');
	return (
		<>
			<Camera de={[480, 1150, 1.5]} para={[480, 1100, 1.3]} dur={dur} soco={tMais}>
				<RuaMedieval>
					<Personagem x={400} y={1780} escala={1.1} roupa="medico" cabelo="#c9c9c9" expressao={f >= tMais ? 'feliz' : 'serio'} bracoD={f >= tMais ? 165 : 20} cotoveloD={0} />
				</RuaMedieval>
				<Placa x={540} y={700} k={usePop(tMais, 8)} txt="MORE DANCING!" tam={100} cor="#ffd23f" rot={-4} />
				{f >= tMais && f < tMais + 6 && <LinhasImpacto op={0.3} />}
			</Camera>
			<Sfx src="boom" em={tMais} vol={0.4} />
		</>
	);
};

// 5 — salões, palco e músicos pagos para manter a dança
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSaloes = m('halls'), tPalco = m('stage'), tMusicos = m('musicians');
	const hallPop = usePop(tSaloes, 10);
	const hall = f < tPalco ? hallPop : 0;
	const palco = interpolate(f, [tPalco, tPalco + 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
	const mus = usePop(tMusicos, 10);
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1150, 1.05]} dur={dur}>
				<RuaMedieval>
					<Guildhall k={hall} />
					<Palco k={palco} />
					{palco > 0.5 && [260, 540, 820].map((x, i) => <Personagem key={x} x={x} y={1380} escala={0.65} roupa={i === 1 ? 'camponesa' : 'campones'} cor={CORES[i + 2]} cabelo={CABELOS[i]} expressao="enjoado" fase={i} {...danca(f, i)} />)}
					{mus > 0 && (
						<>
							<Personagem x={120} y={1820} escala={0.75 * mus} roupa="campones" cor="#7a5a9a" cabelo="#1d1d1d" expressao="feliz" olhar={1} bracoD={60} cotoveloD={-60} itemD={<Tambor s={0.6} />} />
							<Personagem x={960} y={1820} escala={0.75 * mus} roupa="campones" cor="#3a9c9c" cabelo="#c9a227" expressao="feliz" olhar={-1} bracoE={80} cotoveloE={-60} itemE={<Flauta s={0.8} />} fase={3} />
							<Notas x={140} y={1200} />
							<Notas x={900} y={1200} />
						</>
					)}
				</RuaMedieval>
			</Camera>
			<Sfx src="pop" em={tSaloes} vol={0.35} />
			<Sfx src="boom" em={tPalco} vol={0.35} />
			<Sfx src="ding" em={tMusicos} vol={0.4} />
		</>
	);
};

// 6 — só piorou
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tPior = m('worse');
	return (
		<>
			<Camera de={[540, 1200, 1.15]} para={[540, 1200, 1.3]} dur={dur} soco={tPior} tremor={5}>
				<RuaMedieval tinta="rgba(200,30,30,0.18)">
					<Multidao n={15} f={f * 1.8} forca={1.8} y0={1440} />
				</RuaMedieval>
				<Placa x={540} y={640} k={usePop(tPior, 8)} txt="WORSE" tam={140} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="buzz" em={tPior} vol={0.4} />
		</>
	);
};

// 7 — desmaiando de exaustão (relatos de mortes são incertos)
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCai = m('collapsed'), tMorte = m('died');
	const exaustos = f >= tCai;
	return (
		<>
			<Camera de={[540, 1250, 1.2]} para={[540, 1250, 1.1]} dur={dur}>
				<RuaMedieval noite={1}>
					<Multidao n={10} f={f} y0={1520} exaustos={exaustos} forca={0.6} />
				</RuaMedieval>
				{f >= tMorte && (
					<g transform="translate(540, 650)">
						<rect x={-370} y={-90} width={740} height={170} rx={30} fill="rgba(0,0,0,0.55)" stroke="#fff" strokeWidth={6} />
						<text x={0} y={-10} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={58} fill="#fff">DEATHS?</text>
						<text x={0} y={55} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={44} fill="#ffd23f">RECORDS ARE UNCLEAR</text>
					</g>
				)}
			</Camera>
			<Sfx src="uhoh" em={tCai} vol={0.4} />
		</>
	);
};

// 8 — historiadores: histeria coletiva por estresse, fome e doença
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tHist = m('historians'), tFome = m('famine'), tDoenca = m('disease');
	const fome = usePop(tFome, 10), doenca = usePop(tDoenca, 10), raio = usePop(tHist + 30, 10);
	return (
		<>
			<Camera de={[540, 1150, 1.2]} para={[540, 1050, 1.05]} dur={dur}>
				<rect width={W} height={H} fill="#e9dcc0" />
				{[300, 640, 980].map((y) => (
					<g key={y}>
						<rect x={0} y={y} width={W} height={26} fill="#7a5230" />
						{Array.from({length: 9}).map((_, i) => <rect key={i} x={40 + i * 115} y={y - 140 + (i % 3) * 10} width={70} height={140 - (i % 3) * 10} fill={['#7a2f3a', '#22397a', '#3c6a3a', '#8a6a44'][i % 4]} stroke="#241820" strokeWidth={4} />)}
					</g>
				))}
				<rect y={1450} width={W} height={470} fill="#8a6a44" />
				<Personagem x={540} y={1820} escala={1} roupa="treinador" cor="#5b4a3c" cabelo="#c9c9c9" expressao="serio" bracoD={70} cotoveloD={-40} />
				{raio > 0 && <g transform={`translate(540, 820) scale(${raio})`}><Raio /></g>}
				{fome > 0 && <g transform={`translate(230, 860) scale(${fome})`}><CestaVazia /><text x={0} y={190} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">FAMINE</text></g>}
				{doenca > 0 && <g transform={`translate(850, 860) scale(${doenca})`}><Doente /><text x={0} y={190} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">DISEASE</text></g>}
				<Placa x={540} y={430} k={usePop(tHist + 12, 10)} txt="MASS HYSTERIA" tam={80} cor="#7a5a9a" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tHist + 12} vol={0.4} />
			<Sfx src="pop" em={tFome} vol={0.4} />
			<Sfx src="pop" em={tDoenca} vol={0.4} />
		</>
	);
};

// 9 — "tão estressada que dançou até adoecer"
const C9: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tEstresse = m('stressed'), tDoente = m('sick');
	return (
		<>
			<Camera de={[540, 1300, 1.4]} para={[540, 1000, 1.0]} dur={dur} soco={tDoente}>
				<RuaMedieval>
					<Multidao n={15} f={f} y0={1440} forca={f >= tEstresse ? 1.4 : 1} />
				</RuaMedieval>
				<Placa x={540} y={560} k={usePop(tDoente, 9)} txt="DANCED ITSELF SICK" tam={74} cor="#e8463f" corTxt="#fff" rot={-3} />
			</Camera>
			<Sfx src="whoosh" em={tEstresse} vol={0.35} />
			<Sfx src="boom" em={tDoente} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'DancingPlague',
	pastaVoz: 'voz-dancing-plague',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8, C9],
	destaques: new Set(['1518', 'dancing', 'stop', 'strasbourg', 'days', 'dozens', 'hundreds', 'hot', 'blood', 'cure', 'more', 'stage', 'musicians', 'worse', 'collapsed', 'exhaustion', 'hysteria', 'famine', 'disease', 'sick']),
};
export default ep;
