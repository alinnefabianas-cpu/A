import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Balao, Check, Circulo, Coracao, Escrito, GatoRabisco, Pessoa, PostIt, Seta, Som, Traco, Xis} from './componentes';
import {em, type Bloco} from './roteiro';
import {COR, FONTE, lerp, pisca, pop, prog} from './tema';

type Cena = React.FC<{b: Bloco}>;
const BASE = 840;
const tr = {stroke: COR.tinta, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'};

/** Sublinhado à mão. */
const Sublinha: React.FC<{x: number; y: number; w: number; t: number; cor?: string}> = ({x, y, w, t, cor = COR.tinta}) => (
	<Traco d={`M ${x} ${y} Q ${x + w / 2} ${y + 10} ${x + w} ${y - 4}`} t={t} dur={10} cor={cor} w={6} />
);

/** Vasilha de comida vazia. */
const Tigela: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	if (s <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path d="M -90 -50 L 90 -50 L 65 0 L -65 0 Z" {...tr} fill={COR.azulClaro} />
			<ellipse cx={0} cy={-50} rx={90} ry={16} {...tr} fill="#fffdf6" />
		</g>
	);
};

/** Floco de neve. */
const Floco: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
	<g>
		{[0, 60, 120].map((a, i) => (
			<Traco key={a} d={`M ${x - 40 * Math.cos((a * Math.PI) / 180)} ${y - 40 * Math.sin((a * Math.PI) / 180)} L ${x + 40 * Math.cos((a * Math.PI) / 180)} ${y + 40 * Math.sin((a * Math.PI) / 180)}`} t={t + i * 3} dur={6} cor={COR.azul} w={7} />
		))}
	</g>
);

// ============================================================
// 0. GANCHO: gatos adultos não miam entre si
// ============================================================
export const Gancho: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tNe = em(b, 'never');
	const tSp = em(b, 'species');
	const tUs = em(b, 'us');
	return (
		<g>
			<Escrito x={260} y={215} t={0} texto="Weird cat fact #1" tam={76} vel={1.5} />
			<Sublinha x={256} y={238} w={520} t={18} />
			<GatoRabisco x={450} y={BASE} escala={0.85} />
			<GatoRabisco x={820} y={BASE} escala={0.85} boca={f >= tUs ? 'aberta' : 'w'} />
			<Balao x={410} y={420} t={tNe} texto="..." w={170} h={100} cauda={{x: 440, y: 520}} sai={tUs} />
			<Balao x={860} y={420} t={tNe + 6} texto="..." w={170} h={100} cauda={{x: 830, y: 520}} sai={tUs} />
			<PostIt x={1500} y={330} t={tSp} linhas={['saved for', 'only 1 species']} w={400} />
			{f >= tUs && (
				<>
					<Pessoa x={1500} y={BASE} escala={0.9} t={tUs} />
					<Balao x={1120} y={420} t={tUs} texto="MEOW!" w={300} h={130} cauda={{x: 900, y: 560}} tam={72} />
					<Som x={900} y={680} t={tUs} />
					<Escrito x={1500} y={560} t={tUs + 8} texto="US!" tam={84} ancora="middle" cor={COR.vermelho} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 1. FILHOTE: miado é coisa de filhote com a mãe
// ============================================================
export const Filhote: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tKi = em(b, 'kittens');
	const tMo = em(b, 'mother');
	const tCo = em(b, 'cold');
	const tHu = em(b, 'hungry');
	const tGr = em(b, 'grow');
	const tSt = em(b, 'stop');
	const cresce = lerp(0.45, 0.85, prog(f, tGr, tGr + 24));
	const crescido = f >= tGr + 10;
	return (
		<g>
			<GatoRabisco x={430} y={BASE} escala={0.95} />
			<Escrito x={430} y={420} t={tMo} texto="mom" tam={60} ancora="middle" cor={COR.grafite} sai={tGr} />
			<GatoRabisco x={820} y={BASE} escala={cresce} t={tKi} boca={f < tGr ? 'aberta' : 'w'} />
			<Balao x={900} y={500} t={tKi} texto="mew!" w={210} h={100} cauda={{x: 840, y: 590}} sai={tGr} />
			{f < tGr && (
				<>
					<Floco x={1200} y={400} t={tCo} />
					<Escrito x={1260} y={420} t={tCo} texto="cold" tam={64} />
					<Tigela x={1250} y={BASE - 20} t={tHu} />
					<Escrito x={1380} y={BASE - 40} t={tHu} texto="hungry" tam={64} />
				</>
			)}
			{crescido && <Escrito x={820} y={BASE - 330} t={tGr + 10} texto="grown up" tam={56} ancora="middle" cor={COR.grafite} />}
			{f >= tSt && (
				<>
					<Balao x={630} y={330} t={tSt} texto="meow?" w={240} h={110} cauda={{x: 700, y: 420}} />
					<Xis x={630} y={330} t={tSt + 8} s={1.4} />
					<Escrito x={1150} y={330} t={tSt + 6} texto="no more meows" tam={64} />
					<Escrito x={1150} y={400} t={tSt + 20} texto="(between cats)" tam={54} cor={COR.grafite} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 2. IDIOMA DOS GATOS: cheiro, corpo, chiado, rosnado, rabo, piscada
// ============================================================
export const Idioma: Cena = ({b}) => {
	const f = useCurrentFrame();
	const itens: [string, string][] = [
		['scent', 'scent  ~ sniff ~'],
		['body', 'body language'],
		['hisses', 'hisses: HSSS!'],
		['growls', 'growls: GRRR'],
	];
	const tTa = em(b, 'tail');
	const tBl = em(b, 'blink');
	const piscada = f >= tBl ? Math.sin(Math.min(1, (f - tBl) / 30) * Math.PI) : 0;
	return (
		<g>
			<Escrito x={260} y={215} t={0} texto="Cat language" tam={80} vel={1.4} marca={COR.marca} />
			{itens.map(([p, txt], i) => {
				const t = em(b, p);
				return (
					<g key={p}>
						<Traco d={`M 270 ${330 + i * 100} m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0`} t={t} dur={6} />
						<Escrito x={310} y={348 + i * 100} t={t} texto={txt} tam={62} />
					</g>
				);
			})}
			<GatoRabisco x={1350} y={BASE} escala={1} rabo={f >= tTa ? 'alto' : 'baixo'} olhos={piscada} />
			{f >= tTa && f < tBl && (
				<>
					<Escrito x={1580} y={360} t={tTa + 4} texto="tail up" tam={60} />
					<Escrito x={1580} y={425} t={tTa + 14} texto="= hello!" tam={60} cor={COR.verde} />
				</>
			)}
			{f >= tBl && (
				<>
					<Escrito x={1480} y={330} t={tBl} texto="slow blink" tam={60} />
					<Escrito x={1480} y={395} t={tBl + 10} texto="= friendly" tam={60} cor={COR.verde} />
					<Coracao x={1180} y={480} t={tBl + 18} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 3. HUMANO: péssimos em ler gatos, mas sempre ouvimos barulho
// ============================================================
export const Humano: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tTe = em(b, 'terrible');
	const tTa = em(b, 'tail');
	const tEa = em(b, 'ears');
	const tNo = em(b, 'noise');
	return (
		<g>
			<Pessoa x={520} y={BASE} escala={1.05} bracos="livro" />
			<Escrito x={520} y={360} t={tTe} texto="???" tam={110} ancora="middle" cor={COR.vermelho} />
			<Escrito x={1000} y={260} t={tTe} texto="Human skills:" tam={70} marca={COR.marca} />
			{(
				[
					['tail?', tTa, false],
					['ears?', tEa, false],
					['noise?', tNo, true],
				] as [string, number, boolean][]
			).map(([txt, t, ok], i) => (
				<g key={txt}>
					<Escrito x={1060} y={380 + i * 100} t={t} texto={txt} tam={64} />
					{ok ? <Check x={1320} y={362 + i * 100} t={t + 6} /> : <Xis x={1320} y={362 + i * 100} t={t + 6} s={0.8} />}
				</g>
			))}
			{f >= tNo && (
				<>
					<GatoRabisco x={1640} y={BASE} escala={0.6} boca="aberta" t={tNo} />
					<Balao x={1540} y={540} t={tNo + 4} texto="MEOW!" w={240} h={110} cauda={{x: 1610, y: 620}} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 4. MÃE: o miado virou ferramenta; você é a mãe-gata desajeitada
// ============================================================
export const Mae: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tKi = em(b, 'kitten');
	const tTo = em(b, 'tool');
	const tCl = em(b, 'clueless');
	const tMo = em(b, 'mother');
	return (
		<g>
			{f >= tKi && (
				<g>
					<Traco d="M 230 270 L 640 270 L 640 420 L 230 420 Z" t={tKi} dur={14} />
					<Escrito x={435} y={365} t={tKi + 4} texto="kitten sound" tam={62} ancora="middle" />
				</g>
			)}
			<Seta de={{x: 660, y: 340}} para={{x: 840, y: 340}} t={tTo} curva={40} />
			{f >= tTo && (
				<g transform={`translate(960 340) rotate(-30) scale(${pop(f, tTo)})`}>
					<path d="M -90 -14 L 40 -14 L 40 14 L -90 14 Z" {...tr} fill={COR.azulClaro} />
					<path d="M 40 -40 a 40 40 0 1 1 0 80 l 0 -24 a 18 18 0 1 0 0 -32 Z" {...tr} fill={COR.azulClaro} />
				</g>
			)}
			<Escrito x={960} y={470} t={tTo + 6} texto="TOOL" tam={64} ancora="middle" cor={COR.vermelho} />
			<GatoRabisco x={760} y={BASE} escala={0.55} t={tCl - 10} boca="aberta" />
			<Pessoa x={1360} y={BASE} escala={1.1} t={tCl - 10} orelhasGato={tMo} />
			<PostIt x={1690} y={300} t={tMo + 10} linhas={['MOM??']} w={260} rot={6} tam={64} />
			<Escrito x={980} y={620} t={tCl} texto="big, clueless" tam={58} />
			<Escrito x={980} y={680} t={tMo} texto="mother cat" tam={58} marca={COR.marca} />
		</g>
	);
};

// ============================================================
// 5. RONRONAR DE PEDIDO: choro escondido no ronronar (2009)
// ============================================================
const onda = (x0: number, x1: number, y: number, amp: number, n: number, pico?: number) => {
	const pts: string[] = [];
	for (let i = 0; i <= n; i++) {
		const x = lerp(x0, x1, i / n);
		const centro = pico !== undefined && Math.abs(i - n / 2) < n * 0.06;
		const a = centro ? amp * 3.2 : amp;
		pts.push(`${x} ${y + (i % 2 ? -a : a)}`);
	}
	return `M ${pts.join(' L ')}`;
};
export const Ronrom: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tTw = em(b, 'two');
	const tSo = em(b, 'solicitation');
	const tPu = em(b, 'inside') - 30;
	const tHi = em(b, 'hidden');
	const tBa = em(b, 'baby');
	return (
		<g>
			<Escrito x={330} y={230} t={tTw} texto="2009" tam={110} ancora="middle" />
			<Circulo cx={330} cy={200} rx={130} ry={70} t={tTw + 8} />
			<Escrito x={620} y={230} t={tSo} texto="the solicitation purr" tam={80} marca={COR.marca} />
			<Traco d={onda(260, 1060, 520, 30, 40)} t={Math.max(tSo + 10, tPu - 20)} dur={24} w={6} />
			{f >= tHi && (
				<>
					<path d="M 600 520 L 660 420 L 690 620 L 720 520" stroke={COR.vermelho} strokeWidth={8} fill="none" strokeLinecap="round" opacity={prog(f, tHi, tHi + 8)} />
					<Circulo cx={660} cy={520} rx={110} ry={140} t={tHi + 4} />
					<Escrito x={660} y={730} t={tHi + 10} texto="hidden cry" tam={62} ancora="middle" cor={COR.vermelho} />
				</>
			)}
			{f >= tBa && (
				<g>
					<Escrito x={1170} y={540} t={tBa} texto="≈" tam={120} ancora="middle" />
					<g transform={`translate(1500 500) scale(${pop(f, tBa)})`}>
						<circle r={110} {...tr} fill="#fffdf6" />
						<path d="M -10 -110 q 20 -30 30 -5" {...tr} />
						<path d="M -55 -20 q 15 -14 30 0 M 25 -20 q 15 -14 30 0" {...tr} />
						<ellipse cx={0} cy={40} rx={30} ry={24} fill={COR.tinta} />
						<path d="M -60 0 q -6 18 0 30 M 60 0 q 6 18 0 30" stroke={COR.azul} strokeWidth={8} fill="none" strokeLinecap="round" />
					</g>
					<Escrito x={1500} y={710} t={tBa + 6} texto="human baby" tam={60} ancora="middle" />
				</g>
			)}
		</g>
	);
};

// ============================================================
// 6. COMIDA: funciona porque nosso cérebro não consegue ignorar
// ============================================================
export const Comida: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tFo = em(b, 'food');
	const tWo = em(b, 'works');
	const tBr = em(b, 'brains');
	const tIg = em(b, 'ignore');
	return (
		<g>
			<GatoRabisco x={420} y={BASE} escala={0.9} />
			<Balao x={520} y={420} t={0} texto="prrrr~" w={260} h={110} cauda={{x: 470, y: 510}} />
			<Tigela x={700} y={BASE} t={tFo} />
			<Escrito x={700} y={BASE - 80} t={tFo + 4} texto="empty!" tam={52} ancora="middle" cor={COR.vermelho} />
			{f >= tBr && (
				<g transform={`translate(1270 380) scale(${pop(f, tBr)})`}>
					<path d="M -150 20 C -190 -60 -120 -140 -40 -120 C 0 -170 100 -160 120 -100 C 190 -90 200 20 140 50 C 120 110 20 120 -20 90 C -90 120 -170 90 -150 20 Z" {...tr} fill={COR.rosa} />
					<path d="M -80 -40 q 30 30 0 60 M 0 -90 q 20 40 -10 80 M 70 -50 q -30 40 10 80" {...tr} strokeWidth={5} />
				</g>
			)}
			{f >= tIg && pisca(f, 5) && (
				<g stroke={COR.vermelho} strokeWidth={8} strokeLinecap="round">
					<line x1={1100} y1={210} x2={1060} y2={170} />
					<line x1={1270} y1={190} x2={1270} y2={140} />
					<line x1={1440} y1={210} x2={1480} y2={170} />
				</g>
			)}
			<Escrito x={1270} y={600} t={tIg} texto="can't ignore it!" tam={64} ancora="middle" cor={COR.vermelho} />
			{f >= tWo && (
				<>
					<Pessoa x={1650} y={BASE} escala={0.8} t={tWo} bracos="cima" />
					<Balao x={1600} y={330} t={tWo + 4} texto="OK OK! FOOD!" w={360} h={110} tam={54} cauda={{x: 1640, y: 420}} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 7. VOCABULÁRIO: cada gato cria o próprio dicionário com você
// ============================================================
export const Vocabulario: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tVo = em(b, 'vocabulary');
	const tOw = em(b, 'own');
	const tSt = em(b, 'stranger');
	const entradas = ['"mrrp?" = hi!', '"MEOOOW" = food. NOW.', '"mew..." = open the door'];
	return (
		<g>
			<Escrito x={260} y={215} t={tVo} texto="My cat's dictionary" tam={78} marca={COR.marca} />
			{entradas.map((e, i) => (
				<Escrito key={e} x={290} y={360 + i * 110} t={lerp(tVo + 12, tOw - 4, i / 2)} texto={e} tam={62} vel={1.6} />
			))}
			{f >= tOw && (
				<g>
					<Pessoa x={1240} y={BASE} escala={0.75} t={tOw} />
					<GatoRabisco x={1420} y={BASE} escala={0.5} t={tOw + 4} />
					<Check x={1330} y={500} t={tOw + 10} s={1.3} />
				</g>
			)}
			{f >= tSt && (
				<g>
					<GatoRabisco x={1700} y={BASE} escala={0.5} t={tSt} manchas />
					<Escrito x={1700} y={560} t={tSt + 4} texto="???" tam={80} ancora="middle" cor={COR.vermelho} />
					<Escrito x={1700} y={460} t={tSt + 10} texto="stranger's cat" tam={44} ancora="middle" cor={COR.grafite} />
				</g>
			)}
		</g>
	);
};

// ============================================================
// 8. FERAIS: sem humanos, quase não miam
// ============================================================
export const Ferais: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tFe = em(b, 'feral');
	const tLe = em(b, 'less');
	const tHu = em(b, 'human');
	return (
		<g>
			<path d="M 1680 210 a 70 70 0 1 0 50 120 a 55 55 0 1 1 -50 -120 Z" {...tr} fill={COR.marca} opacity={0.9} />
			{Array.from({length: 9}, (_, i) => (
				<Traco key={i} d={`M ${240 + i * 90} ${BASE} L ${240 + i * 90} ${BASE - 220} L ${270 + i * 90} ${BASE - 250} L ${300 + i * 90} ${BASE - 220} L ${300 + i * 90} ${BASE}`} t={i} dur={10} w={5} cor={COR.grafite} />
			))}
			<Traco d={`M 230 ${BASE - 160} L 1050 ${BASE - 160}`} t={8} dur={12} w={5} cor={COR.grafite} />
			<GatoRabisco x={480} y={BASE} escala={0.6} t={tFe} manchas />
			<GatoRabisco x={760} y={BASE} escala={0.6} t={tFe + 6} cor="#e8e2d0" />
			<Escrito x={620} y={300} t={tFe} texto="feral cats" tam={68} ancora="middle" marca={COR.marca} />
			{f >= tLe && (
				<g>
					<Escrito x={1200} y={430} t={tLe} texto="meows:" tam={60} />
					<rect x={1400} y={392} width={lerp(0, 90, prog(f, tLe, tLe + 12))} height={50} fill={COR.azul} stroke={COR.tinta} strokeWidth={5} />
					<Escrito x={1200} y={530} t={tLe + 8} texto="house cats:" tam={60} />
					<rect x={1490} y={492} width={lerp(0, 300, prog(f, tLe + 8, tLe + 24))} height={50} fill={COR.azul} stroke={COR.tinta} strokeWidth={5} />
				</g>
			)}
			<Escrito x={1200} y={680} t={tHu} texto="a meow needs" tam={62} />
			<Escrito x={1200} y={745} t={tHu + 10} texto="a human audience" tam={62} marca={COR.marca} />
		</g>
	);
};

// ============================================================
// 9. MADRUGADA: o miado das 5 da manhã é só pra você
// ============================================================
export const Madrugada: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tFi = em(b, 'five');
	const tMo = em(b, 'morning');
	const tYo = em(b, 'you');
	const tremor = f >= tFi && f < tFi + 30 ? (pisca(f, 2) ? 6 : -6) : 0;
	return (
		<g>
			<g transform={`translate(${470 + tremor} 290)`}>
				<circle r={110} {...tr} fill="#fffdf6" />
				<circle cx={-80} cy={-90} r={30} {...tr} fill={COR.azulClaro} />
				<circle cx={80} cy={-90} r={30} {...tr} fill={COR.azulClaro} />
				<text y={28} textAnchor="middle" fontFamily={FONTE.mao} fontWeight={700} fontSize={84} fill={f >= tFi ? COR.vermelho : COR.tinta}>
					5:00
				</text>
			</g>
			<Escrito x={470} y={470} t={tFi} texto="A.M." tam={56} ancora="middle" cor={COR.vermelho} />
			<g>
				<path d={`M 1050 ${BASE} L 1050 ${BASE - 120} L 1650 ${BASE - 120} L 1650 ${BASE}`} {...tr} />
				<rect x={1040} y={BASE - 200} width={30} height={200} {...tr} fill={COR.azulClaro} />
				<path d={`M 1150 ${BASE - 130} C 1300 ${BASE - 200} 1500 ${BASE - 190} 1640 ${BASE - 130}`} {...tr} fill={COR.azulClaro} />
				<circle cx={1120} cy={BASE - 175} r={48} {...tr} fill="#fffdf6" />
				<path d={`M 1100 ${BASE - 180} q 8 6 16 0 M 1128 ${BASE - 180} q 8 6 16 0`} {...tr} strokeWidth={4} />
				{f < tMo && <Escrito x={1180} y={BASE - 260} t={0} texto="zzz" tam={64} cor={COR.grafite} />}
				{f >= tMo && <Escrito x={1120} y={BASE - 260} t={tMo + 6} texto="!!" tam={80} ancora="middle" cor={COR.vermelho} />}
			</g>
			<GatoRabisco x={780} y={BASE} escala={0.75} boca={f >= tMo ? 'aberta' : 'w'} />
			<Balao x={880} y={450} t={tMo} texto="MEOOOW!" w={320} h={120} cauda={{x: 820, y: 540}} tam={66} />
			<PostIt x={1500} y={300} t={tYo} linhas={['made just', 'for YOU']} w={340} rot={5} />
			<Coracao x={1640} y={230} t={tYo + 10} s={0.8} />
		</g>
	);
};

// ============================================================
// 10. LINGUAGEM: não é barulho, é linguagem
// ============================================================
export const Linguagem: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tNo = em(b, 'noise');
	const tLa = em(b, 'language');
	const tUn = em(b, 'understand');
	return (
		<g>
			<Escrito x={520} y={300} t={tNo} texto="noise" tam={110} ancora="middle" riscado={tNo + 12} cor={COR.grafite} />
			<Seta de={{x: 720, y: 280}} para={{x: 960, y: 280}} t={tLa - 6} curva={40} />
			<Escrito x={1330} y={300} t={tLa} texto="language" tam={120} ancora="middle" marca={COR.marca} />
			<GatoRabisco x={640} y={BASE} escala={0.75} t={0} />
			<Pessoa x={1260} y={BASE} escala={0.85} t={0} />
			{f >= tUn && (
				<>
					<path d={`M 760 600 Q 960 ${520} 1180 600`} stroke={COR.tinta} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-f * 2} fill="none" />
					<Coracao x={960} y={520} t={tUn + 4} s={1.3} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 11. CTA: escreve o miado do seu gato nos comentários
// ============================================================
export const Cta: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tFo = em(b, 'food');
	const tCo = em(b, 'write');
	return (
		<g>
			<Escrito x={260} y={250} t={0} texto="My cat's 'I want food' meow:" tam={76} vel={1.6} />
			<Traco d="M 280 430 L 1200 430" t={tFo} dur={12} w={4} cor={COR.grafite} />
			<Escrito x={300} y={410} t={tFo + 10} texto="MEEEOOOW?!" tam={110} vel={0.5} cor={COR.vermelho} />
			<GatoRabisco x={1550} y={BASE} escala={0.85} boca="aberta" />
			{f >= tCo && (
				<>
					<Seta de={{x: 700, y: 560}} para={{x: 700, y: 780}} t={tCo} curva={-40} cor={COR.vermelho} w={8} />
					<Escrito x={760} y={720} t={tCo + 6} texto="write it in the comments!" tam={66} marca={COR.marca} />
				</>
			)}
		</g>
	);
};

export const CENAS: Record<string, Cena> = {
	gancho: Gancho,
	filhote: Filhote,
	idioma: Idioma,
	humano: Humano,
	mae: Mae,
	ronrom: Ronrom,
	comida: Comida,
	vocabulario: Vocabulario,
	ferais: Ferais,
	madrugada: Madrugada,
	linguagem: Linguagem,
	cta: Cta,
};
