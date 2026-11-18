import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Barra, Caixa, CartaoFase, Conquista, Predio, Sprite, TextoPixel, Vento} from './componentes';
import {em, type Bloco} from './roteiro';
import {CHEFAO, CORACAO, GATO, GATO_ANDA, GATO_PARA, GATO_X, HUMANO, PALETA_CHEFAO, PALETA_CORACAO, PALETA_CORACAO_VAZIO, PALETA_FANTASMA, PALETA_GATO, PALETA_HUMANO, PALETA_RAIOX, PALETA_TENSO} from './sprites';
import {COR, FONTE, grade, lerp, pisca, pop, prog} from './tema';

type Cena = React.FC<{b: Bloco}>;

/** Progresso em degraus (animação "8-bit"). */
const degrau = (v: number, n = 4) => Math.round(v * n) / n;
/** Quadro da caminhada. */
const anda = (f: number) => (Math.floor(f / 6) % 2 === 0 ? GATO : GATO_ANDA);

const Seta: React.FC<{x: number; y: number; dir: 'cima' | 'baixo' | 'esq' | 'dir'; cor?: string; s?: number}> = ({x, y, dir, cor = COR.ciano, s = 1}) => {
	const rot = {cima: 0, dir: 90, baixo: 180, esq: 270}[dir];
	return (
		<g transform={`translate(${grade(x)} ${grade(y)}) rotate(${rot}) scale(${s})`} shapeRendering="crispEdges" fill={cor}>
			<rect x={-6} y={-12} width={12} height={48} />
			<rect x={-18} y={-12} width={36} height={12} />
			<rect x={-12} y={-24} width={24} height={12} />
			<rect x={-6} y={-36} width={12} height={12} />
		</g>
	);
};

// ============================================================
// 0. GANCHO: 20º andar x 7º andar
// ============================================================
export const Gancho: Cena = ({b}) => {
	const f = useCurrentFrame();
	const t20 = em(b, 'vigésimo');
	const t7 = em(b, 'sétimo');
	const tM = em(b, 'menos');
	const tBug = em(b, 'bug');
	const tEx = em(b, 'explicação');
	const base = 860;
	const ah = 34;
	const yAndar = (n: number) => base - n * ah;
	const glitch = f >= tBug && f < tBug + 24;
	const gx = glitch ? (Math.floor(f / 2) % 2 ? 18 : -12) : 0;
	return (
		<g>
			<g transform={`translate(${gx} 0)`}>
				<rect x={560} y={yAndar(20) - 10} width={330} height={20 * ah + 10} fill={COR.predio} shapeRendering="crispEdges" />
				{Array.from({length: 20}, (_, i) =>
					[0, 1, 2, 3].map((c) => <rect key={`${i}-${c}`} x={584 + c * 78} y={yAndar(i + 1) + 8} width={48} height={18} fill={(i + c) % 6 === 0 ? COR.janelaAcesa : COR.janela} shapeRendering="crispEdges" />),
				)}
				<rect x={120} y={base} width={1680} height={12} fill={COR.linha} />
				{/* andar 20 */}
				{f >= t20 && (
					<>
						<rect x={560} y={yAndar(20)} width={330} height={ah} fill="none" stroke={COR.azul} strokeWidth={4} />
						<TextoPixel x={520} y={yAndar(20) + 18} texto="20º" tam={32} cor={COR.ciano} ancora="end" t={t20} />
						<Sprite mapa={GATO} paleta={PALETA_GATO} x={960} y={yAndar(20) - 4} px={5} />
					</>
				)}
				{f >= t7 && (
					<>
						<rect x={560} y={yAndar(7)} width={330} height={ah} fill="none" stroke={COR.amarelo} strokeWidth={4} />
						<TextoPixel x={520} y={yAndar(7) + 18} texto="7º" tam={32} cor={COR.amarelo} ancora="end" t={t7} />
						<Sprite mapa={GATO} paleta={PALETA_GATO} x={960} y={yAndar(7) - 4} px={5} />
					</>
				)}
				{f >= tM && (
					<>
						<Barra x={1050} y={yAndar(20) - 30} w={360} valor={0.8} rotulo="VIDA" />
						<Barra x={1050} y={yAndar(7) - 30} w={360} valor={0.3} cor={COR.vermelho} rotulo="VIDA" />
					</>
				)}
			</g>
			{glitch && (
				<g shapeRendering="crispEdges">
					{[0, 1, 2, 3, 4].map((i) => (
						<rect key={i} x={0} y={grade(((f * 37 + i * 211) % 800) + 100)} width={1920} height={18 + (i % 3) * 12} fill={i % 2 ? COR.vermelho : COR.ciano} opacity={0.5} />
					))}
				</g>
			)}
			<TextoPixel x={1560} y={300} texto="BUG?" tam={90} cor={COR.vermelho} t={tBug} />
			{f >= tEx && (
				<g transform={`translate(1560 ${grade(560 - Math.max(0, Math.sin(prog(f, tEx, tEx + 8) * Math.PI)) * 40)})`} shapeRendering="crispEdges">
					<rect x={-60} y={-60} width={120} height={120} fill={COR.amarelo} />
					<rect x={-60} y={-60} width={120} height={120} fill="none" stroke="#8a6a10" strokeWidth={8} />
					<text x={0} y={30} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={94} fill="#8a6a10">
						?
					</text>
				</g>
			)}
		</g>
	);
};

// ============================================================
// 1. ESTUDO: 1987, Nova York, 132 gatos, 90% sobreviveram
// ============================================================
export const Estudo: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tC = em(b, 'cento');
	const tP = em(b, 'prédios');
	const tN = em(b, 'noventa');
	const morto = (i: number) => i % 10 === 7;
	const vistos = Math.min(132, Math.max(0, Math.floor(((f - tC) / Math.max(1, tP - tC)) * 132)));
	return (
		<g>
			<TextoPixel x={420} y={250} texto="1987" tam={120} cor={COR.ciano} t={em(b, 'mil')} />
			<TextoPixel x={420} y={390} texto="NOVA YORK" tam={40} t={em(b, 'york')} />
			{f >= em(b, 'york') && (
				<g shapeRendering="crispEdges">
					{[60, 110, 80, 150, 70, 120, 95].map((h, i) => (
						<rect key={i} x={240 + i * 52} y={grade(500 - h * prog(f, em(b, 'york') + i, em(b, 'york') + i + 8))} width={44} height={grade(h * prog(f, em(b, 'york') + i, em(b, 'york') + i + 8))} fill={COR.predio} />
					))}
				</g>
			)}
			{f >= tC && <TextoPixel x={420} y={600} texto={`${vistos} GATOS`} tam={44} cor={COR.amarelo} t={tC} />}
			<TextoPixel x={420} y={730} texto="90% VIVOS" tam={48} cor={COR.verde} t={tN} />
			{Array.from({length: 132}, (_, i) => {
				if (i >= vistos) return null;
				const x = 860 + (i % 12) * 84;
				const y = 150 + Math.floor(i / 12) * 64;
				const x_ = f >= tN && morto(i);
				return <Sprite key={i} mapa={x_ ? GATO_X : GATO} paleta={x_ ? PALETA_FANTASMA : PALETA_GATO} x={x + 30} y={y + 20} px={3} opacidade={x_ ? 0.7 : 1} />;
			})}
		</g>
	);
};

// ============================================================
// 2. GRÁFICO: ferimentos sobem até o 7º e depois caem
// ============================================================
export const Grafico: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tP = em(b, 'pioravam');
	const t7 = em(b, 'sétimo');
	const tD = em(b, 'depois');
	const tDim = em(b, 'diminuir');
	const tF = em(b, 'fase');
	const altura = (n: number) => (n <= 7 ? n / 7 : Math.max(0.35, 1 - (n - 7) * 0.09));
	const x0 = 340;
	const base = 800;
	const H = 520;
	const apagado = f >= tF;
	return (
		<g opacity={apagado ? 0.35 : 1}>
			<rect x={x0 - 12} y={base} width={1320} height={8} fill={COR.branco} shapeRendering="crispEdges" />
			<rect x={x0 - 12} y={base - H - 40} width={8} height={H + 48} fill={COR.branco} shapeRendering="crispEdges" />
			<TextoPixel x={x0 + 20} y={base - H - 70} texto="FERIMENTOS" tam={24} ancora="start" t={0} />
			<TextoPixel x={x0 + 1300} y={base + 60} texto="ANDAR" tam={24} ancora="end" t={0} />
			{Array.from({length: 14}, (_, i) => {
				const n = i + 1;
				const t = n <= 7 ? lerp(tP, t7, (n - 1) / 6) : lerp(tD, tDim + 6, (n - 8) / 6);
				const k = degrau(prog(f, t, t + 8), 6);
				if (k <= 0) return null;
				const h = grade(altura(n) * H * k);
				const destaque = n === 7 && f >= t7;
				return (
					<g key={n} shapeRendering="crispEdges">
						<rect x={x0 + i * 92} y={base - h} width={66} height={h} fill={destaque ? (pisca(f, 6) ? COR.vermelho : COR.amarelo) : n > 7 ? COR.verde : COR.azul} />
						<text x={x0 + i * 92 + 33} y={base + 40} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={26} fill={destaque ? COR.amarelo : COR.cinza}>
							{n}
						</text>
					</g>
				);
			})}
			<TextoPixel x={x0 + 6 * 92 + 33} y={base - H - 10} texto="PICO" tam={26} cor={COR.vermelho} t={t7} />
			{apagado && null}
		</g>
	);
};

export const GraficoComStart: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tF = em(b, 'fase');
	return (
		<g>
			<Grafico b={b} />
			{f >= tF && (
				<g>
					<rect x={560} y={400} width={800} height={140} fill="#000" opacity={0.8} />
					<TextoPixel x={960} y={470} texto="PRESS START" tam={56} cor={COR.amarelo} t={tF} piscando />
				</g>
			)}
		</g>
	);
};

// ============================================================
// 3. FASE 1: O GIRO (frente vira, depois trás)
// ============================================================
export const Giro: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tMeio = em(b, 'meio');
	const tDobra = em(b, 'dobra');
	const tFr = em(b, 'frente');
	const tTr = em(b, 'trás');
	const tPr = em(b, 'pronto');
	const px = 14;
	const cx = 960;
	const cy = grade(470 + Math.sin(f * 0.3) * 8);
	const vira = (t: number) => (f < t ? -1 : degrau(lerp(-1, 1, prog(f, t, t + 10)), 4) || 0.25);
	const dobra = f >= tDobra && f < tPr ? 12 : 0;
	return (
		<g>
			<Predio x={100} w={420} topo={96} base={900} rolagem={f * 30} />
			<Predio x={1400} w={420} topo={96} base={900} rolagem={f * 30 + 40} />
			<Vento x={560} w={800} veloc={34} />
			<g transform={`rotate(${dobra} ${cx - 5 * px} ${cy})`}>
				<Sprite mapa={GATO} paleta={PALETA_GATO} x={cx - 5 * px} y={cy} px={px} colunas={[0, 9]} escalaY={vira(tTr)} />
			</g>
			<g transform={`rotate(${-dobra} ${cx + 5 * px} ${cy})`}>
				<Sprite mapa={GATO} paleta={PALETA_GATO} x={cx + 5 * px} y={cy} px={px} colunas={[10, 19]} escalaY={vira(tFr)} />
			</g>
			<TextoPixel x={cx - 5 * px} y={cy - 160} texto="DOBRA" tam={28} cor={COR.ciano} t={tDobra} sai={tFr} />
			<TextoPixel x={cx + 5 * px} y={cy - 160} texto="1. FRENTE" tam={28} cor={COR.amarelo} t={tFr} sai={tPr} />
			<TextoPixel x={cx - 5 * px} y={cy + 160} texto="2. TRÁS" tam={28} cor={COR.amarelo} t={tTr} sai={tPr} />
			<TextoPixel x={cx} y={250} texto="PERFEITO!" tam={64} cor={COR.verde} t={tPr} />
			<Conquista t={em(b, 'patas')} texto="PATAS PRA BAIXO" />
			<CartaoFase numero="FASE 1" nome="O GIRO" ate={tMeio - 4} />
		</g>
	);
};

// ============================================================
// 4. RAIO-X: coluna flexível + clavícula solta + botão de girar
// ============================================================
export const Coluna: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCo = em(b, 'coluna');
	const tCl = em(b, 'clavícula');
	const tBo = em(b, 'botão');
	const tGi = em(b, 'girar');
	const px = 18;
	const cx = 860;
	const cy = 470;
	const w = 20 * px;
	const h = 13 * px;
	const flex = prog(f, tCo, tCo + 10);
	const giro = Math.floor(prog(f, tGi, tGi + 18, (x) => x) * 8) * 45;
	const apertado = f >= tGi && f < tGi + 8;
	return (
		<g>
			<TextoPixel x={960} y={160} texto="RAIO-X" tam={32} cor={COR.ciano} t={0} />
			<g transform={`rotate(${giro} ${cx} ${cy})`}>
				<Sprite mapa={GATO} paleta={PALETA_RAIOX} x={cx} y={cy} px={px} />
				{/* coluna: blocos de vértebra que ondulam */}
				{f >= tCo &&
					Array.from({length: 11}, (_, i) => {
						const vx = cx - w / 2 + (4 + i) * px + 3;
						const vy = cy - h / 2 + 6.5 * px + Math.sin(f * 0.3 + i * 0.8) * px * 0.7 * flex;
						return <rect key={i} x={grade(vx)} y={grade(vy)} width={px - 6} height={px - 6} fill={COR.ciano} shapeRendering="crispEdges" />;
					})}
				{/* clavícula solta */}
				{f >= tCl && <rect x={grade(cx - w / 2 + 14 * px)} y={grade(cy - h / 2 + 8 * px + Math.sin(f * 0.4) * 10)} width={px * 2} height={8} fill={pisca(f, 6) ? COR.amarelo : COR.ciano} shapeRendering="crispEdges" />}
			</g>
			<TextoPixel x={860} y={720} texto="COLUNA FLEXÍVEL" tam={34} cor={COR.ciano} t={em(b, 'flexível')} />
			{f >= tCl && (
				<g>
					<rect x={1110} y={grade(cy + 3 * px)} width={190} height={6} fill={COR.amarelo} shapeRendering="crispEdges" />
					<TextoPixel x={1320} y={grade(cy + 3 * px) + 4} texto="CLAVÍCULA SOLTA" tam={26} cor={COR.amarelo} ancora="start" t={tCl} />
				</g>
			)}
			{f >= tBo && (
				<g transform={`translate(1560 300) scale(${apertado ? 0.85 : Math.min(1, Math.ceil(pop(f, tBo) * 4) / 4)})`} shapeRendering="crispEdges">
					<rect x={-80} y={-60} width={160} height={120} fill="#5a0f1f" />
					<rect x={-60} y={-80} width={120} height={160} fill="#5a0f1f" />
					<rect x={-70} y={-70} width={140} height={140} fill={COR.vermelho} />
					<text x={0} y={30} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={104} fill={COR.branco}>
						A
					</text>
					<text x={0} y={140} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={29} fill={COR.branco}>
						GIRAR
					</text>
				</g>
			)}
		</g>
	);
};

// ============================================================
// 5. FASE 2: VELOCIDADE MÁXIMA (gato 100 x pessoa ~200 km/h)
// ============================================================
export const Velocidade: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tPor = em(b, 'por');
	const tAc = em(b, 'acelerar');
	const tCem = em(b, 'cem');
	const tPe = em(b, 'pessoa');
	const tDo = em(b, 'dobro');
	const gato = prog(f, tAc, tCem + 10) * (100 / 200);
	const pessoa = prog(f, tPe, tDo + 15) * (195 / 200);
	return (
		<g>
			<TextoPixel x={960} y={170} texto="VELOCIDADE MÁXIMA DA QUEDA" tam={30} cor={COR.ciano} t={tPor} />
			<Caixa x={420} y={250} w={330} h={70} borda={COR.ciano} />
			<TextoPixel x={585} y={287} texto="LEVE" tam={28} t={em(b, 'leve')} />
			<Caixa x={780} y={250} w={380} h={70} borda={COR.ciano} />
			<TextoPixel x={970} y={287} texto="PELUDO" tam={28} t={em(b, 'peludo')} />
			<Sprite mapa={GATO} paleta={PALETA_GATO} x={290} y={420} px={6} />
			<Barra x={420} y={392} w={1080} h={56} valor={gato} cor={COR.azul} blocos={20} />
			<TextoPixel x={1540} y={420} texto="100 KM/H" tam={32} cor={COR.azul} ancora="start" t={tCem} />
			{f >= tPe && (
				<>
					<Sprite mapa={HUMANO} paleta={PALETA_HUMANO} x={290} y={640} px={7} />
					<Barra x={420} y={612} w={1080} h={56} valor={pessoa} cor={COR.vermelho} blocos={20} />
				</>
			)}
			<TextoPixel x={1540} y={640} texto="~200 KM/H" tam={32} cor={COR.vermelho} ancora="start" t={tDo} />
			<CartaoFase numero="FASE 2" nome="VELOCIDADE MÁXIMA" ate={tPor - 4} />
		</g>
	);
};

// ============================================================
// 6. 5 ANDARES até a velocidade máxima
// ============================================================
export const Andares: Cena = ({b}) => {
	const f = useCurrentFrame();
	const t5 = Math.max(20, em(b, 'cinco') + 8);
	const tDa = em(b, 'daqui');
	const vmax = 10 / t5; // andares por frame
	const caiu = f < t5 ? (vmax * f * f) / (2 * t5) : 5 + vmax * (f - t5);
	const andar = Math.max(1, Math.round(25 - caiu));
	const veloc = Math.min(1, f / t5);
	return (
		<g>
			<Predio x={240} w={480} topo={96} base={900} rolagem={caiu * 96} />
			<Vento x={760} w={420} veloc={12 + 30 * veloc} densidade={10} />
			<Sprite mapa={GATO_PARA} paleta={PALETA_GATO} x={960} y={grade(450 + Math.sin(f * 0.25) * 6)} px={9} />
			<TextoPixel x={1560} y={250} texto={`ANDAR ${andar}`} tam={48} t={0} />
			<Barra x={1300} y={420} w={520} h={56} valor={veloc} cor={veloc >= 1 ? COR.amarelo : COR.azul} blocos={10} rotulo="VELOCIDADE" />
			{veloc >= 1 && <TextoPixel x={1560} y={540} texto="MÁX" tam={44} cor={COR.amarelo} t={t5} piscando />}
			<TextoPixel x={1560} y={660} texto="TRAVADA" tam={36} cor={COR.ciano} t={tDa} />
			<TextoPixel x={960} y={250} texto="5 ANDARES" tam={40} cor={COR.amarelo} t={em(b, 'cinco')} />
		</g>
	);
};

// ============================================================
// 7. FASE 3: PARAQUEDAS (modo esquilo voador)
// ============================================================
export const Paraquedas: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tQ = em(b, 'quando');
	const tAb = em(b, 'abre');
	const tFr = em(b, 'freia');
	const tIm = em(b, 'impacto');
	const rol = f < tFr ? f * 30 : tFr * 30 + (f - tFr) * 14;
	const chao = grade(lerp(1100, 760, prog(f, tIm - 12, tIm)));
	const pousou = f >= tIm;
	const aberto = f >= tAb;
	const yGato = pousou ? chao - 60 : grade(440 + Math.sin(f * 0.25) * 8);
	return (
		<g>
			<Predio x={100} w={420} topo={96} base={900} rolagem={rol} />
			<Predio x={1400} w={420} topo={96} base={900} rolagem={rol + 40} />
			{!pousou && <Vento x={560} w={800} veloc={f < tFr ? 34 : 16} />}
			{f >= tFr && !pousou && [880, 960, 1040].map((x, i) => <Seta key={i} x={x} y={grade(640 + ((f * 3 + i * 10) % 30))} dir="cima" cor={COR.ciano} />)}
			{f >= tIm - 12 && <rect x={0} y={chao} width={1920} height={1080 - chao} fill={COR.linha} shapeRendering="crispEdges" />}
			<Sprite mapa={aberto ? GATO_PARA : GATO} paleta={PALETA_GATO} x={960} y={yGato} px={12} />
			{pousou && (
				<>
					<Seta x={grade(960 - 200 - ((f - tIm) % 20) * 3)} y={chao - 30} dir="esq" cor={COR.amarelo} />
					<Seta x={grade(960 + 200 + ((f - tIm) % 20) * 3)} y={chao - 30} dir="dir" cor={COR.amarelo} />
					<TextoPixel x={960} y={250} texto="IMPACTO ESPALHADO" tam={44} cor={COR.amarelo} t={tIm} />
				</>
			)}
			<TextoPixel x={960} y={250} texto="RELAXA..." tam={44} cor={COR.ciano} t={em(b, 'relaxa')} sai={tFr} />
			<Conquista t={em(b, 'esquilo')} texto="MODO ESQUILO VOADOR" dur={70} />
			<CartaoFase numero="FASE 3" nome="PARAQUEDAS" ate={tQ - 4} />
		</g>
	);
};

// ============================================================
// 8. QUEDA CURTA x QUEDA LONGA
// ============================================================
export const Comparacao: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tC = em(b, 'curta');
	const tL = em(b, 'longa');
	const itens: [string, string][] = [
		['VIRAR', 'virar'],
		['RELAXAR', 'relaxar'],
		['PLANAR', 'planar'],
	];
	return (
		<g>
			{f >= tC && (
				<Caixa x={120} y={140} w={820} h={700} borda={COR.vermelho}>
					<TextoPixel x={530} y={230} texto="QUEDA CURTA" tam={40} cor={COR.vermelho} t={tC} />
					<rect x={200} y={720} width={660} height={10} fill={COR.linha} shapeRendering="crispEdges" />
					<Sprite mapa={GATO} paleta={PALETA_TENSO} x={530 + (f >= em(b, 'tenso') && pisca(f, 2) ? 6 : 0)} y={650} px={9} />
					<TextoPixel x={530} y={480} texto="!!" tam={60} cor={COR.vermelho} t={em(b, 'tenso')} piscando />
					<TextoPixel x={530} y={790} texto="TENSO" tam={32} cor={COR.vermelho} t={em(b, 'tenso')} />
				</Caixa>
			)}
			{f >= tL && (
				<Caixa x={980} y={140} w={820} h={700} borda={COR.verde}>
					<TextoPixel x={1390} y={230} texto="QUEDA LONGA" tam={40} cor={COR.verde} t={tL} />
					<Sprite mapa={GATO_PARA} paleta={PALETA_GATO} x={1390} y={grade(380 + Math.sin(f * 0.2) * 10)} px={8} />
					{itens.map(([txt, p], i) => {
						const t = em(b, p);
						const ok = f >= t;
						return (
							<g key={txt} shapeRendering="crispEdges">
								<rect x={1150} y={540 + i * 90} width={48} height={48} fill="none" stroke={COR.branco} strokeWidth={6} />
								{ok && <path d={`M 1158 ${566 + i * 90} l 12 12 l 22 -26`} stroke={COR.verde} strokeWidth={10} fill="none" />}
								<text x={1230} y={580 + i * 90} fontFamily={FONTE.pixel} fontSize={42} fill={ok ? COR.verde : COR.cinza}>
									{txt}
								</text>
							</g>
						);
					})}
				</Caixa>
			)}
		</g>
	);
};

// ============================================================
// 9. CHEFÃO: viés de sobrevivência
// ============================================================
export const Chefao: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCh = em(b, 'chefão');
	const tMo = em(b, 'morriam');
	const tVe = em(b, 'veterinário');
	const tEs = em(b, 'estudo');
	const alerta = f >= tCh && f < tCh + 36;
	const chao = 800;
	return (
		<g>
			{alerta && pisca(f, 6) && (
				<g>
					<rect x={0} y={96} width={1920} height={800} fill={COR.vermelho} opacity={0.18} />
					<TextoPixel x={960} y={480} texto="! WARNING !" tam={90} cor={COR.vermelho} t={tCh} />
				</g>
			)}
			{f >= tCh + 24 && (
				<g>
					<Sprite mapa={CHEFAO} paleta={PALETA_CHEFAO} x={330} y={grade(420 + Math.sin(f * 0.15) * 14)} px={14} />
					<Barra x={150} y={620} w={360} valor={1} cor={COR.vermelho} rotulo="CHEFÃO" />
					<TextoPixel x={330} y={720} texto="VIÉS DE" tam={24} cor={COR.vermelho} t={tCh + 24} />
					<TextoPixel x={330} y={760} texto="SOBREVIVÊNCIA" tam={24} cor={COR.vermelho} t={tCh + 24} />
				</g>
			)}
			<rect x={620} y={chao} width={1240} height={10} fill={COR.linha} shapeRendering="crispEdges" />
			{/* clínica */}
			{f >= tVe && (
				<g shapeRendering="crispEdges">
					<rect x={1500} y={chao - 300} width={320} height={300} fill={COR.predio} />
					<rect x={1480} y={chao - 320} width={360} height={30} fill={COR.janela} />
					<rect x={1620} y={chao - 120} width={80} height={120} fill={COR.ceu} />
					<rect x={1640} y={chao - 260} width={40} height={110} fill={COR.branco} />
					<rect x={1605} y={chao - 225} width={110} height={40} fill={COR.branco} />
					<rect x={1648} y={chao - 252} width={24} height={94} fill={COR.vermelho} />
					<rect x={1613} y={chao - 217} width={94} height={24} fill={COR.vermelho} />
					<text x={1660} y={chao - 330} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={36} fill={COR.branco}>
						VET
					</text>
				</g>
			)}
			{/* gatos vivos andando para a clínica */}
			{f >= tVe &&
				[0, 1, 2].map((i) => {
					const x = lerp(700 - i * 130, 1560 - i * 110, prog(f, tVe + i * 6, tVe + 70 + i * 6, (v) => v));
					return <Sprite key={i} mapa={anda(f + i * 3)} paleta={PALETA_GATO} x={x} y={chao - 34} px={5} />;
				})}
			{/* fantasmas dos que não chegaram */}
			{f >= tMo &&
				[0, 1].map((i) => {
					const y = grade(lerp(chao - 40, 300, prog(f, tMo + i * 10, tMo + 90 + i * 10)));
					return <Sprite key={i} mapa={GATO_X} paleta={PALETA_FANTASMA} x={820 + i * 180} y={y} px={5} opacidade={0.6} />;
				})}
			{f >= tEs && (
				<g>
					<TextoPixel x={1300} y={300} texto="NÃO CONTADOS" tam={26} cor={COR.cinza} t={tEs} />
					<TextoPixel x={1660} y={chao - 400} texto="O ESTUDO SÓ VIA ESTES" tam={22} cor={COR.amarelo} t={tEs + 6} ancora="end" />
				</g>
			)}
		</g>
	);
};

// ============================================================
// 10. GATO NÃO TEM 7 VIDAS + item lendário: tela na janela
// ============================================================
export const Vidas: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tVi = em(b, 'vidas');
	const tTe = em(b, 'tela');
	const tIt = em(b, 'item');
	const card = f >= tTe;
	return (
		<g>
			{!card && (
				<g>
					{Array.from({length: 7}, (_, i) => {
						const perdeu = f >= tVi + i * 2 && i > 0;
						const tremor = perdeu && f < tVi + i * 2 + 10 ? (pisca(f, 2) ? 8 : -8) : 0;
						return <Sprite key={i} mapa={CORACAO} paleta={perdeu ? PALETA_CORACAO_VAZIO : PALETA_CORACAO} x={570 + i * 130 + tremor} y={340} px={14} />;
					})}
					<TextoPixel x={960} y={200} texto="7 VIDAS?" tam={48} t={0} />
					<TextoPixel x={960} y={540} texto="GAME OVER?" tam={70} cor={COR.vermelho} t={tVi + 10} />
				</g>
			)}
			{card && (
				<g>
					<Caixa x={560} y={130} w={800} h={720} borda={COR.amarelo} />
					<TextoPixel x={960} y={210} texto="ITEM LENDÁRIO" tam={30} cor={COR.amarelo} t={tTe} />
					{/* janela com tela */}
					<g shapeRendering="crispEdges">
						<rect x={760} y={260} width={400} height={330} fill={COR.ceu2} stroke={COR.branco} strokeWidth={12} />
						{Array.from({length: 9}, (_, i) => (
							<rect key={`v${i}`} x={760 + (i + 1) * 40} y={266} width={3} height={318} fill={COR.ciano} opacity={0.7} />
						))}
						{Array.from({length: 7}, (_, i) => (
							<rect key={`h${i}`} x={766} y={260 + (i + 1) * 41} width={388} height={3} fill={COR.ciano} opacity={0.7} />
						))}
					</g>
					<Sprite mapa={GATO} paleta={PALETA_GATO} x={960} y={540} px={5} />
					<TextoPixel x={960} y={660} texto="TELA NA JANELA" tam={38} t={tTe + 4} />
					<TextoPixel x={960} y={760} texto="+6 VIDAS" tam={34} cor={COR.verde} t={tIt} />
					{[0, 1, 2, 3].map((i) =>
						pisca(f + i * 5, 7) ? <rect key={i} x={[620, 1280, 640, 1260][i]} y={[200, 260, 700, 640][i]} width={18} height={18} fill={COR.amarelo} shapeRendering="crispEdges" /> : null,
					)}
				</g>
			)}
		</g>
	);
};

// ============================================================
// 11. CTA: CONTINUE? + comentário
// ============================================================
export const Cta: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tNa = em(b, 'nada');
	const tCo = em(b, 'conta');
	const x = f < tNa ? lerp(-100, 620, prog(f, 0, tNa, (v) => v)) : 620;
	const frase = '> COMENTE AQUI';
	const letras = Math.floor(Math.max(0, f - tCo) / 2);
	const cont = Math.max(0, 9 - Math.floor(Math.max(0, f - tCo) / 15));
	return (
		<g>
			<rect x={0} y={790} width={1920} height={12} fill={COR.linha} shapeRendering="crispEdges" />
			<Sprite mapa={f < tNa ? anda(f) : GATO} paleta={PALETA_GATO} x={x} y={738} px={8} />
			<TextoPixel x={620} y={560} texto="COMO SE NADA..." tam={30} cor={COR.ciano} t={tNa} />
			{f >= tCo && (
				<g>
					<TextoPixel x={1360} y={200} texto={`CONTINUE? ${cont}`} tam={44} cor={COR.amarelo} t={tCo} />
					<Caixa x={980} y={290} w={760} h={240} borda={COR.azul} />
					<text x={1040} y={430} fontFamily={FONTE.pixel} fontSize={52} fill={COR.branco}>
						{frase.slice(0, letras)}
						{pisca(f, 8) ? '_' : ''}
					</text>
				</g>
			)}
		</g>
	);
};

export const CENAS: Record<string, Cena> = {
	gancho: Gancho,
	estudo: Estudo,
	grafico: GraficoComStart,
	giro: Giro,
	coluna: Coluna,
	velocidade: Velocidade,
	andares: Andares,
	paraquedas: Paraquedas,
	comparacao: Comparacao,
	chefao: Chefao,
	vidas: Vidas,
	cta: Cta,
};
