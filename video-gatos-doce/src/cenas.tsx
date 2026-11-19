import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Barra, Caixa, CartaoFase, Conquista, Sprite, TextoPixel} from './componentes';
import {em, type Bloco} from './roteiro';
import {
	ACUCAR,
	BALA,
	BIFE,
	BISCOITO,
	BOLO,
	GATO,
	GATO_ANDA,
	HUMANO,
	LATA,
	PALETA_ACUCAR,
	PALETA_BALA,
	PALETA_BIFE,
	PALETA_BISCOITO,
	PALETA_BOLO,
	PALETA_GATO,
	PALETA_GUEPARDO,
	PALETA_HUMANO,
	PALETA_LATA,
	PALETA_PEIXE,
	PALETA_SORVETE,
	PALETA_TENSO,
	PALETA_TIGRE,
	PALETA_VENENO,
	PEIXE,
	SORVETE,
	VENENO,
} from './sprites';
import {COR, FONTE, grade, lerp, pisca, pop, prog} from './tema';

type Cena = React.FC<{b: Bloco}>;

const anda = (f: number) => (Math.floor(f / 4) % 2 === 0 ? GATO : GATO_ANDA);
const flutua = (f: number, a = 10, v = 0.12) => grade(Math.sin(f * v) * a);

/** Chão simples. */
const Chao: React.FC<{y?: number}> = ({y = 780}) => <rect x={0} y={y} width={1920} height={12} fill={COR.linha} shapeRendering="crispEdges" />;

/** Fita de DNA em pixel (horizontal). `buraco` = trecho faltando (0..1 da largura). */
const DNA: React.FC<{x: number; y: number; w: number; buraco?: [number, number]; piscaBuraco?: boolean}> = ({x, y, w, buraco, piscaBuraco}) => {
	const f = useCurrentFrame();
	const passos = Math.floor(w / 24);
	return (
		<g shapeRendering="crispEdges">
			{Array.from({length: passos}, (_, i) => {
				const k = i / passos;
				if (buraco && k >= buraco[0] && k <= buraco[1]) return null;
				const fase = i * 0.45 + f * 0.08;
				const a = Math.sin(fase) * 70;
				const xx = x + i * 24;
				return (
					<g key={i}>
						{i % 2 === 0 && <rect x={xx + 6} y={grade(y - Math.abs(a)) + 12} width={6} height={grade(Math.abs(a) * 2) - 12} fill={COR.linha} />}
						<rect x={xx} y={grade(y + a)} width={18} height={18} fill={COR.azul} />
						<rect x={xx} y={grade(y - a)} width={18} height={18} fill={COR.ciano} />
					</g>
				);
			})}
			{buraco && (!piscaBuraco || pisca(f, 6)) && (
				<g>
					<rect x={x + buraco[0] * w} y={y - 110} width={(buraco[1] - buraco[0]) * w} height={220} fill="none" stroke={COR.vermelho} strokeWidth={6} strokeDasharray="18 12" />
				</g>
			)}
		</g>
	);
};

/** Bloco de gene (peça de quebra-cabeça) com mini DNA dentro. */
const Gene: React.FC<{x: number; y: number; nome: string; quebrado?: boolean; tremor?: number}> = ({x, y, nome, quebrado, tremor = 0}) => (
	<g transform={`translate(${grade(x + tremor)} ${grade(y)})`} shapeRendering="crispEdges">
		<rect x={-120} y={-110} width={240} height={220} fill={COR.painel} stroke={quebrado ? COR.vermelho : COR.ciano} strokeWidth={8} />
		{Array.from({length: 8}, (_, i) => (
			<g key={i}>
				<rect x={-84 + i * 22} y={grade(-20 + Math.sin(i * 0.8) * 40)} width={14} height={14} fill={quebrado ? COR.cinza : COR.azul} />
				<rect x={-84 + i * 22} y={grade(-20 - Math.sin(i * 0.8) * 40)} width={14} height={14} fill={quebrado ? COR.cinzaEscuro : COR.ciano} />
			</g>
		))}
		{quebrado && <path d="M -20 -110 L 10 -40 L -15 10 L 20 60 L 0 110" stroke={COR.vermelho} strokeWidth={10} fill="none" />}
		<text x={0} y={80} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={30} fill={quebrado ? COR.vermelho : COR.branco}>
			{nome}
		</text>
	</g>
);

/** Mira de "míssil" girando. */
const Mira: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 110}) => {
	const f = useCurrentFrame();
	const s = r + (pisca(f, 4) ? 8 : 0);
	return (
		<g transform={`translate(${x} ${y})`} stroke={COR.vermelho} strokeWidth={8} fill="none" shapeRendering="crispEdges">
			<path d={`M ${-s} ${-s + 40} V ${-s} H ${-s + 40}`} />
			<path d={`M ${s - 40} ${-s} H ${s} V ${-s + 40}`} />
			<path d={`M ${-s} ${s - 40} V ${s} H ${-s + 40}`} />
			<path d={`M ${s - 40} ${s} H ${s} V ${s - 40}`} />
			<rect x={-6} y={-6} width={12} height={12} fill={COR.vermelho} />
		</g>
	);
};

/** Escudo pixelado em volta de algo. */
const Escudo: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 200}) => {
	const f = useCurrentFrame();
	const n = 28;
	return (
		<g shapeRendering="crispEdges">
			{Array.from({length: n}, (_, i) => {
				const a = (i / n) * Math.PI * 2 + f * 0.02;
				return <rect key={i} x={grade(x + Math.cos(a) * r) - 9} y={grade(y + Math.sin(a) * r * 0.8) - 9} width={18} height={18} fill={COR.ciano} opacity={0.5 + 0.5 * Math.sin(f * 0.2 + i)} />;
			})}
		</g>
	);
};

/** X vermelho (riscado) ou ✓ verde. */
const Marca: React.FC<{x: number; y: number; ok: boolean; s?: number}> = ({x, y, ok, s = 1}) =>
	ok ? (
		<path transform={`translate(${x} ${y}) scale(${s})`} d="M -22 0 L -6 16 L 24 -18" stroke={COR.verde} strokeWidth={12} fill="none" />
	) : (
		<g transform={`translate(${x} ${y}) scale(${s})`} stroke={COR.vermelho} strokeWidth={12}>
			<line x1={-20} y1={-20} x2={20} y2={20} />
			<line x1={20} y1={-20} x2={-20} y2={20} />
		</g>
	);

/** Balão de pensamento pixelado. */
const Pensamento: React.FC<{x: number; y: number; w?: number; h?: number; children?: React.ReactNode}> = ({x, y, w = 300, h = 170, children}) => (
	<g shapeRendering="crispEdges">
		<rect x={x - 70} y={y + h / 2 + 50} width={18} height={18} fill={COR.branco} />
		<rect x={x - 40} y={y + h / 2 + 18} width={30} height={30} fill={COR.branco} />
		<rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={COR.branco} />
		<rect x={x - w / 2 + 8} y={y - h / 2 + 8} width={w - 16} height={h - 16} fill="#fff" stroke={COR.linha} strokeWidth={4} />
		{children}
	</g>
);

// ============================================================
// 0. GANCHO: seu gato nunca sentiu gosto de açúcar
// ============================================================
export const Gancho: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tSu = em(b, 'sugar');
	const tOn = em(b, 'once');
	const tDe = em(b, 'dessert');
	const tDt = em(b, 'detect');
	const scan = prog(f, tDt, tDt + 10);
	return (
		<g>
			<Chao />
			<Sprite mapa={GATO} paleta={PALETA_GATO} x={560} y={720} px={9} />
			{f >= tSu && <Sprite mapa={ACUCAR} paleta={PALETA_ACUCAR} x={1240} y={480 + flutua(f)} px={Math.min(14, Math.ceil(pop(f, tSu) * 4) * 3.5)} />}
			{f >= tDe && (
				<>
					<Sprite mapa={BALA} paleta={PALETA_BALA} x={1050} y={330 + flutua(f + 20)} px={8} />
					<Sprite mapa={BISCOITO} paleta={PALETA_BISCOITO} x={1450} y={330 + flutua(f + 40)} px={9} />
				</>
			)}
			<TextoPixel x={960} y={180} texto="SUGAR TASTED: 0" tam={56} cor={COR.amarelo} t={tOn} />
			{f >= tDt && (
				<g>
					<rect x={650} y={grade(640)} width={grade(520 * scan)} height={12} fill={COR.vermelho} opacity={pisca(f, 3) ? 0.9 : 0.5} shapeRendering="crispEdges" />
					<Caixa x={980} y={600} w={620} h={120} borda={COR.vermelho}>
						<text x={1290} y={672} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={36} fill={pisca(f, 8) ? COR.vermelho : COR.branco}>
							SWEET: NOT DETECTED
						</text>
					</Caixa>
				</g>
			)}
		</g>
	);
};

// ============================================================
// 1. RECEPTOR: dois genes, um quebrado
// ============================================================
export const Receptor: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tRe = em(b, 'receptor');
	const tTw = em(b, 'two');
	const tBo = em(b, 'both');
	const tBr = em(b, 'broken');
	const junta = prog(f, tTw, tTw + 16);
	const quebrou = f >= tBr;
	const separa = prog(f, tBr + 6, tBr + 20);
	const xA = lerp(300, 830, junta) - separa * 120;
	const xB = lerp(1620, 1090, junta);
	const tremor = quebrou && f < tBr + 14 ? (pisca(f, 2) ? 10 : -10) : 0;
	return (
		<g>
			<TextoPixel x={960} y={190} texto="SWEET RECEPTOR" tam={52} cor={COR.ciano} t={tRe} />
			{f >= tTw && (
				<>
					<Gene x={xA} y={470} nome="TAS1R2" quebrado={quebrou} tremor={tremor} />
					<Gene x={xB} y={470} nome="TAS1R3" />
				</>
			)}
			{f >= tBo && (
				<>
					<Marca x={xA} y={300} ok={!quebrou} />
					<Marca x={xB} y={300} ok />
				</>
			)}
			<TextoPixel x={xA} y={650} texto="BROKEN" tam={40} cor={COR.vermelho} t={tBr} />
			<TextoPixel x={1090} y={650} texto="WORKS" tam={40} cor={COR.verde} t={tBo} />
		</g>
	);
};

// ============================================================
// 2. O BUG: um pedaço do gene está faltando (2005)
// ============================================================
export const Bug: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tTw = em(b, 'two');
	const tMi = em(b, 'missing');
	const tNe = em(b, 'never');
	const tNo = em(b, 'nothing');
	const tLv = em(b, 'level');
	return (
		<g>
			<TextoPixel x={960} y={190} texto="2005" tam={190} cor={COR.ciano} t={tTw} sai={tNe} fonte="texto" />
			{f < tNe && <DNA x={180} y={470} w={1560} buraco={f >= tMi ? [0.44, 0.56] : undefined} piscaBuraco />}
			<TextoPixel x={960} y={660} texto="MISSING PIECE" tam={40} cor={COR.vermelho} t={tMi} sai={tNe} />
			{f >= tNe && f < tLv && (
				<g>
					<Caixa x={460} y={250} w={1000} h={260} borda={COR.vermelho} />
					<text x={960} y={340} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={44} fill={COR.vermelho}>
						ERROR 404
					</text>
					<text x={960} y={420} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={34} fill={COR.branco}>
						SWEET RECEPTOR NOT FOUND
					</text>
				</g>
			)}
			{f >= tNo && f < tLv && (
				<g>
					<Sprite mapa={ACUCAR} paleta={PALETA_ACUCAR} x={760} y={650} px={10} />
					<TextoPixel x={1120} y={650} texto="= NOTHING" tam={52} cor={COR.amarelo} t={tNo} />
				</g>
			)}
			{f >= tLv && (
				<g>
					<rect x={560} y={400} width={800} height={140} fill="#000" opacity={0.8} />
					<TextoPixel x={960} y={470} texto="PRESS START" tam={56} cor={COR.amarelo} t={tLv} piscando />
				</g>
			)}
		</g>
	);
};

// ============================================================
// 3. LEVEL 1: carne quase não tem açúcar
// ============================================================
export const Carne: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCats = em(b, 'cats');
	const tCa = em(b, 'carnivores');
	const tMe = em(b, 'meat');
	const tSu = em(b, 'sugar');
	const tLo = em(b, 'lost');
	const linhas: [string, number, number, string][] = [
		['PROTEIN', 0.9, tMe, COR.vermelho],
		['FAT', 0.5, tMe + 6, COR.amarelo],
		['SUGAR', 0, tSu, COR.rosa],
	];
	return (
		<g>
			{f >= tCa && <Sprite mapa={BIFE} paleta={PALETA_BIFE} x={520} y={460 + flutua(f)} px={22} />}
			<TextoPixel x={520} y={700} texto="100% CARNIVORE" tam={36} cor={COR.ciano} t={tCa} />
			{f >= tMe && (
				<Caixa x={900} y={220} w={860} h={420} borda={COR.branco}>
					<text x={1330} y={300} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={40} fill={COR.amarelo}>
						ITEM: MEAT
					</text>
					{linhas.map(([nome, v, t, cor], i) =>
						f >= t ? (
							<g key={nome}>
								<text x={960} y={392 + i * 90} fontFamily={FONTE.pixel} fontSize={32} fill={COR.branco}>
									{nome}
								</text>
								<Barra x={1200} y={362 + i * 90} w={480} h={44} valor={v * prog(f, t, t + 12)} cor={cor} blocos={10} />
								{v === 0 && <text x={1700} y={394 + i * 90} fontFamily={FONTE.pixel} fontSize={32} fill={COR.rosa}>0</text>}
							</g>
						) : null,
					)}
				</Caixa>
			)}
			<TextoPixel x={1330} y={730} texto="LOST: NOTHING" tam={48} cor={COR.verde} t={tLo} />
			<CartaoFase numero="LEVEL 1" nome="WHY IT DOESN'T MATTER" ate={tCats - 4} />
		</g>
	);
};

// ============================================================
// 4. FAMÍLIA: tigres e guepardos também
// ============================================================
export const Familia: Cena = ({b}) => {
	const f = useCurrentFrame();
	const gatos: [string, Record<string, string>, number, string][] = [
		['HOUSE CAT', PALETA_GATO, em(b, 'cat'), 'cat'],
		['TIGER', PALETA_TIGRE, em(b, 'tigers'), 'tigers'],
		['CHEETAH', PALETA_GUEPARDO, em(b, 'cheetahs'), 'cheetahs'],
	];
	const tSa = em(b, 'same');
	const tTo = em(b, 'tooth');
	return (
		<g>
			<Chao y={700} />
			{gatos.map(([nome, pal, t], i) => {
				if (f < t) return null;
				const x = 480 + i * 480;
				const s = Math.min(1, Math.ceil(pop(f, t) * 4) / 4);
				return (
					<g key={nome}>
						<Sprite mapa={GATO} paleta={pal} x={x} y={640} px={grade(10 * s, 1)} />
						<TextoPixel x={x} y={760} texto={nome} tam={32} t={t} />
						{f >= tSa && (
							<g transform={`translate(${x} ${grade(420 + flutua(f + i * 10, 6))})`} shapeRendering="crispEdges">
								<rect x={-50} y={-40} width={100} height={80} fill={COR.painel} stroke={COR.vermelho} strokeWidth={6} />
								<path d="M -6 -40 L 8 -10 L -8 10 L 6 40" stroke={COR.vermelho} strokeWidth={6} fill="none" />
							</g>
						)}
					</g>
				);
			})}
			<TextoPixel x={960} y={300} texto="SAME BROKEN GENE" tam={44} cor={COR.vermelho} t={tSa} sai={tTo} />
			{f >= tTo && (
				<g>
					<Sprite mapa={BALA} paleta={PALETA_BALA} x={700} y={240} px={8} />
					<Marca x={700} y={240} ok={false} s={1.6} />
					<TextoPixel x={1080} y={240} texto="NO SWEET TOOTH" tam={44} cor={COR.amarelo} t={tTo} />
				</g>
			)}
		</g>
	);
};

// ============================================================
// 5. LEVEL 2: detector de carne (umami)
// ============================================================
export const Umami: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tIn = em(b, 'instead');
	const tSw = em(b, 'sweet');
	const tUm = em(b, 'umami');
	const tSa = em(b, 'savory');
	const tTu = em(b, 'tuna');
	const tMo = em(b, 'molecules');
	return (
		<g>
			<TextoPixel x={760} y={190} texto="TASTE SCANNER" tam={40} cor={COR.ciano} t={tIn} />
			{f >= tSw && (
				<g>
					<text x={300} y={340} fontFamily={FONTE.pixel} fontSize={36} fill={COR.branco}>
						SWEET
					</text>
					<Barra x={560} y={306} w={600} h={50} valor={0} cor={COR.rosa} />
					<text x={1190} y={342} fontFamily={FONTE.pixel} fontSize={32} fill={COR.rosa}>
						0%
					</text>
				</g>
			)}
			{f >= tUm && (
				<g>
					<text x={300} y={460} fontFamily={FONTE.pixel} fontSize={36} fill={COR.branco}>
						UMAMI
					</text>
					<Barra x={560} y={426} w={600} h={50} valor={prog(f, tUm, tUm + 18)} cor={COR.amarelo} />
					{prog(f, tUm, tUm + 18) >= 1 && (
						<text x={1190} y={462} fontFamily={FONTE.pixel} fontSize={32} fill={pisca(f, 8) ? COR.amarelo : COR.branco}>
							MAX
						</text>
					)}
				</g>
			)}
			<TextoPixel x={730} y={590} texto="= THE TASTE OF MEAT" tam={36} cor={COR.amarelo} t={tSa} />
			{f >= tTu && <Sprite mapa={PEIXE} paleta={PALETA_PEIXE} x={1540} y={450 + flutua(f)} px={16} />}
			{f >= tMo &&
				Array.from({length: 10}, (_, i) => {
					const k = ((f - tMo) * 0.03 + i / 10) % 1;
					return <rect key={i} x={grade(lerp(1420, 1190, k))} y={grade(450 + Math.sin(i * 2 + k * 6) * 40)} width={14} height={14} fill={COR.amarelo} opacity={1 - k} shapeRendering="crispEdges" />;
				})}
			<TextoPixel x={1540} y={640} texto="TUNA" tam={40} t={tTu} />
			<CartaoFase numero="LEVEL 2" nome="THE MEAT DETECTOR" ate={tIn - 4} />
		</g>
	);
};

// ============================================================
// 6. MÍSSIL: barulho da lata
// ============================================================
export const Missil: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCa = em(b, 'can');
	const tMi = em(b, 'missile');
	const tampa = prog(f, tCa, tCa + 8);
	const xg = f < tMi ? 260 : lerp(260, 1300, prog(f, tMi, tMi + 18, (v) => v * v));
	return (
		<g>
			<Chao />
			<g>
				<Sprite mapa={LATA} paleta={PALETA_LATA} x={1520} y={730} px={14} />
				<g transform={`rotate(${-70 * tampa} 1440 690)`} shapeRendering="crispEdges">
					<rect x={1436} y={680} width={168} height={14} fill="#c9d3e6" />
				</g>
				{f >= tCa && [0, 1, 2].map((i) => {
					const c = ((f - tCa + i * 8) % 24) / 24;
					return <rect key={i} x={grade(1520 - 60 - c * 120)} y={grade(560 - c * 80)} width={grade(120 + c * 240)} height={8} fill={COR.amarelo} opacity={1 - c} shapeRendering="crispEdges" />;
				})}
				<TextoPixel x={1520} y={480} texto="*CLICK*" tam={40} cor={COR.amarelo} t={tCa} />
			</g>
			{f >= tMi && (
				<>
					{[0, 1, 2].map((i) => (
						<rect key={i} x={grade(xg - 260 - i * 30)} y={680 + i * 24} width={160} height={8} fill={COR.ciano} opacity={0.7} shapeRendering="crispEdges" />
					))}
					<Mira x={1520} y={690} />
					<TextoPixel x={960} y={260} texto="LOCKED ON!" tam={64} cor={COR.vermelho} t={tMi} />
				</>
			)}
			<Sprite mapa={f >= tMi ? anda(f) : GATO} paleta={PALETA_GATO} x={xg} y={730} px={8} />
		</g>
	);
};

// ============================================================
// 7. LEVEL 3: escudo contra veneno (papilas + amargo)
// ============================================================
export const Papilas: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCats = em(b, 'cats');
	const tSe = em(b, 'seventy');
	const tTh = em(b, 'thousand');
	const tBi = em(b, 'bitter');
	const tPo = em(b, 'poisons');
	const barras = f < tBi;
	const xVen = lerp(1700, 1180, prog(f, tPo - 20, tPo));
	const ricochete = f >= tPo ? lerp(0, 600, prog(f, tPo, tPo + 20)) : 0;
	return (
		<g>
			{barras && (
				<g>
					<TextoPixel x={960} y={180} texto="TASTE BUDS" tam={44} cor={COR.ciano} t={tCats} />
					<Sprite mapa={GATO} paleta={PALETA_GATO} x={260} y={360} px={6} />
					<Barra x={380} y={330} w={1240} h={60} valor={prog(f, tSe - 10, tSe + 6) * (470 / 9000)} cor={COR.azul} blocos={40} />
					<TextoPixel x={1660} y={360} texto={`${Math.round(470 * prog(f, tSe - 10, tSe + 6))}`} tam={36} cor={COR.azul} ancora="start" t={tSe - 10} />
					{f >= tTh - 12 && (
						<>
							<Sprite mapa={HUMANO} paleta={PALETA_HUMANO} x={260} y={560} px={7} />
							<Barra x={380} y={530} w={1240} h={60} valor={prog(f, tTh - 12, tTh + 10)} cor={COR.vermelho} blocos={40} />
							<TextoPixel x={1660} y={560} texto={`${Math.round(9000 * prog(f, tTh - 12, tTh + 10))}`} tam={36} cor={COR.vermelho} ancora="start" t={tTh - 12} />
						</>
					)}
				</g>
			)}
			{!barras && (
				<g>
					<Chao />
					<Sprite mapa={GATO} paleta={PALETA_GATO} x={760} y={720} px={10} />
					<Escudo x={760} y={640} r={230} />
					<TextoPixel x={760} y={300} texto="BITTER SENSOR: ON" tam={44} cor={COR.ciano} t={tBi} />
					{f >= tPo - 20 && <Sprite mapa={VENENO} paleta={PALETA_VENENO} x={xVen + ricochete} y={grade(620 - ricochete * 0.6)} px={10} rot={ricochete * 0.5} />}
					<TextoPixel x={1400} y={420} texto="BLOCKED!" tam={48} cor={COR.verde} t={tPo + 4} />
				</g>
			)}
			<Conquista t={tBi + 10} texto="POISON SHIELD" />
			<CartaoFase numero="LEVEL 3" nome="THE POISON SHIELD" ate={tCats - 4} />
		</g>
	);
};

// ============================================================
// 8. CHEFÃO: "mas meu gato ama sorvete!"
// ============================================================
export const Chefao: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tBo = em(b, 'boss');
	const tLo = em(b, 'loves');
	const tTw = em(b, 'twist');
	const tSu = em(b, 'sugar');
	const tFa = em(b, 'fat');
	const tPr = em(b, 'proteins');
	const alerta = f >= tBo && f < tBo + 30;
	const hp = f >= tPr ? 0.15 : f >= tFa ? 0.45 : f >= tSu ? 0.75 : 1;
	const itens: [string, boolean, number][] = [
		['SUGAR', false, tSu],
		['FAT', true, tFa],
		['MILK PROTEIN', true, tPr],
	];
	return (
		<g>
			{alerta && pisca(f, 6) && (
				<g>
					<rect x={0} y={96} width={1920} height={800} fill={COR.vermelho} opacity={0.18} />
					<TextoPixel x={960} y={480} texto="! WARNING !" tam={90} cor={COR.vermelho} t={tBo} />
				</g>
			)}
			{f >= tBo + 20 && (
				<g>
					<Sprite mapa={SORVETE} paleta={PALETA_SORVETE} x={430} y={grade(430 + Math.sin(f * 0.15) * 14)} px={16} />
					<Barra x={250} y={700} w={360} valor={hp} cor={COR.vermelho} rotulo="BOSS: ICE CREAM" />
				</g>
			)}
			{f >= tLo && f < tTw && (
				<Caixa x={800} y={300} w={980} h={200} borda={COR.rosa}>
					<text x={1290} y={385} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={40} fill={COR.branco}>
						"BUT MY CAT
					</text>
					<text x={1290} y={445} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={40} fill={COR.rosa}>
						LOVES ICE CREAM!"
					</text>
				</Caixa>
			)}
			{f >= tTw && (
				<Caixa x={860} y={220} w={860} h={460} borda={COR.amarelo}>
					<text x={1290} y={300} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={36} fill={COR.amarelo}>
						WHAT CATS REALLY WANT
					</text>
					{itens.map(([nome, ok, t], i) =>
						f >= t ? (
							<g key={nome}>
								<Marca x={960} y={392 + i * 95} ok={ok} />
								<text x={1020} y={406 + i * 95} fontFamily={FONTE.pixel} fontSize={40} fill={ok ? COR.verde : COR.vermelho}>
									{nome}
								</text>
							</g>
						) : null,
					)}
				</Caixa>
			)}
		</g>
	);
};

// ============================================================
// 9. LACTOSE: estômago infeliz
// ============================================================
export const Lactose: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tLa = em(b, 'lactose');
	const tSc = em(b, 'scoop');
	const tUn = em(b, 'unhappy');
	const mal = f >= tUn;
	const tremor = mal ? (pisca(f, 2) ? 6 : -6) : 0;
	return (
		<g>
			<Chao />
			<Sprite mapa={GATO} paleta={mal && pisca(f, 5) ? PALETA_TENSO : PALETA_GATO} x={760 + tremor} y={720} px={11} />
			{f >= tLa && (
				<Caixa x={1100} y={220} w={700} h={170} borda={COR.vermelho}>
					<text x={1450} y={290} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={28} fill={COR.cinza}>
						STATUS EFFECT
					</text>
					<text x={1450} y={348} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={38} fill={COR.vermelho}>
						LACTOSE INTOLERANT
					</text>
				</Caixa>
			)}
			{f >= tSc && !mal && <Sprite mapa={SORVETE} paleta={PALETA_SORVETE} x={1100} y={grade(lerp(500, 660, prog(f, tSc, tSc + 20)))} px={6} />}
			{mal && (
				<>
					{[0, 1, 2].map((i) => (
						<rect key={i} x={grade(700 + i * 50)} y={grade(560 - ((f * 2 + i * 20) % 60))} width={24} height={8} fill={COR.verde} opacity={0.8} shapeRendering="crispEdges" />
					))}
					<TextoPixel x={1300} y={560} texto="-2 HP" tam={64} cor={COR.vermelho} t={tUn} />
					<TextoPixel x={760} y={420} texto="*GRUMBLE*" tam={36} cor={COR.verde} t={tUn + 4} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 10. BISCOITO: ele só quer saber se tem carne
// ============================================================
export const Biscoito: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCo = em(b, 'cookie');
	const tCr = em(b, 'craving');
	const tMe = em(b, 'meat');
	const scan = prog(f, tMe, tMe + 14);
	return (
		<g>
			<Chao />
			<Sprite mapa={HUMANO} paleta={PALETA_HUMANO} x={1400} y={680} px={14} />
			<Sprite mapa={BISCOITO} paleta={PALETA_BISCOITO} x={1250} y={650} px={8} />
			<Sprite mapa={GATO} paleta={PALETA_GATO} x={500} y={730} px={9} />
			{f >= tCo && (
				<line x1={560} y1={650} x2={1210} y2={650} stroke={COR.ciano} strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-f * 2} />
			)}
			{f >= tCr && f < tMe && (
				<Pensamento x={420} y={400}>
					<Sprite mapa={ACUCAR} paleta={PALETA_ACUCAR} x={420} y={400} px={9} />
					<Marca x={420} y={400} ok={false} s={1.6} />
				</Pensamento>
			)}
			{f >= tMe && (
				<>
					<Pensamento x={420} y={400}>
						<text x={420} y={415} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={48} fill={COR.vermelho}>
							MEAT?
						</text>
					</Pensamento>
					<rect x={1190} y={grade(lerp(590, 710, Math.abs(Math.sin(scan * Math.PI * 2))))} width={120} height={8} fill={COR.vermelho} shapeRendering="crispEdges" />
					<TextoPixel x={1250} y={500} texto="MEAT: 0%" tam={44} cor={COR.vermelho} t={tMe + 14} />
				</>
			)}
		</g>
	);
};

// ============================================================
// 11. CTA: bolo ou atum?
// ============================================================
export const Cta: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCa = em(b, 'cake');
	const tTu = em(b, 'tuna');
	const tTe = em(b, 'tell');
	const frase = '> COMMENT BELOW';
	const letras = Math.floor(Math.max(0, f - tTe) / 2);
	return (
		<g>
			<Chao />
			<Sprite mapa={GATO} paleta={PALETA_GATO} x={330} y={730} px={8} />
			{f >= tCa && (
				<Caixa x={600} y={170} w={720} h={430} borda={COR.branco}>
					<text x={960} y={250} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={40} fill={COR.amarelo}>
						TRADE?
					</text>
					<Sprite mapa={BOLO} paleta={PALETA_BOLO} x={760} y={360} px={7} />
					<text x={860} y={378} fontFamily={FONTE.pixel} fontSize={40} fill={COR.cinza}>
						CAKE
					</text>
					{f >= tTu && (
						<>
							<Sprite mapa={LATA} paleta={PALETA_LATA} x={760} y={490} px={7} />
							<text x={860} y={508} fontFamily={FONTE.pixel} fontSize={40} fill={COR.branco}>
								CAN OF TUNA
							</text>
							{pisca(f, 8) && <path d="M 650 476 L 676 492 L 650 508 Z" fill={COR.amarelo} />}
						</>
					)}
				</Caixa>
			)}
			{f >= tTe && (
				<g>
					<Caixa x={1380} y={250} w={480} h={200} borda={COR.azul} />
					<text x={1420} y={365} fontFamily={FONTE.pixel} fontSize={32} fill={COR.branco}>
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
	receptor: Receptor,
	bug: Bug,
	carne: Carne,
	familia: Familia,
	umami: Umami,
	missil: Missil,
	papilas: Papilas,
	chefao: Chefao,
	lactose: Lactose,
	biscoito: Biscoito,
	cta: Cta,
};
