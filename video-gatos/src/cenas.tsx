import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Bateria, Barulho, Chao, Coracao, GatoPalito, Palavra, Passaro, Raio, Rato, Rotulo, Zzz} from './componentes';
import {em, type Bloco} from './roteiro';
import {BRILHO, COR, FONTE, lerp, pop, prog} from './tema';

type Cena = React.FC<{b: Bloco}>;

// ---------- auxiliares de desenho ----------
const ponto = (cx: number, cy: number, r: number, a: number) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
const arco = (cx: number, cy: number, r: number, a0: number, a1: number) =>
	a1 - a0 < 0.001 ? '' : `M ${ponto(cx, cy, r, a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${ponto(cx, cy, r, Math.min(a1, a0 + Math.PI * 2 - 0.001))}`;
const fatia = (cx: number, cy: number, r: number, a0: number, a1: number) =>
	a1 - a0 < 0.001 ? '' : `M ${cx} ${cy} L ${ponto(cx, cy, r, a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${ponto(cx, cy, r, a1)} Z`;
const TOPO = -Math.PI / 2;

/** Etiqueta "MOTIVO 1" no canto. */
const Etiqueta: React.FC<{texto: string; t?: number}> = ({texto, t = 0}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	if (s <= 0) return null;
	const w = texto.length * 26 + 60;
	return (
		<g transform={`translate(${90 - (1 - s) * 300} 70)`}>
			<rect width={w} height={70} rx={35} fill={COR.azul} style={{filter: BRILHO}} />
			<text x={w / 2} y={47} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={44} fill={COR.fundo}>
				{texto}
			</text>
		</g>
	);
};

/** Grade de 15 anos: os 10 primeiros acendem em azul ("dormindo"). */
const GradeAnos: React.FC<{x: number; y: number; tAparece: number; tAcende: number}> = ({x, y, tAparece, tAcende}) => {
	const f = useCurrentFrame();
	const L = 104;
	return (
		<g>
			{Array.from({length: 15}, (_, i) => {
				const s = pop(f, tAparece + i * 2);
				const azul = i < 10 && f >= tAcende + i * 3;
				const cx = x + (i % 5) * (L + 18) + L / 2;
				const cy = y + Math.floor(i / 5) * (L + 18) + L / 2;
				return (
					<g key={i} transform={`translate(${cx} ${cy}) scale(${s})`}>
						<rect x={-L / 2} y={-L / 2} width={L} height={L} rx={18} fill={azul ? COR.azul : COR.fundo2} stroke={azul ? COR.azulClaro : COR.linha} strokeWidth={4} style={{filter: azul ? BRILHO : 'none'}} />
						<text y={14} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={40} fill={azul ? COR.fundo : COR.cinza}>
							{i + 1}
						</text>
					</g>
				);
			})}
		</g>
	);
};

const Sol: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x} ${y}) scale(${s}) rotate(${f * 1.2})`}>
			{Array.from({length: 8}, (_, i) => (
				<line key={i} x1={0} y1={-58} x2={0} y2={-80} transform={`rotate(${i * 45})`} stroke={COR.azulClaro} strokeWidth={8} strokeLinecap="round" />
			))}
			<circle r={44} fill={COR.azulClaro} style={{filter: BRILHO}} />
		</g>
	);
};

const Lua: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M 20 -48 A 50 50 0 1 0 20 48 A 38 38 0 1 1 20 -48 Z" fill={COR.azulClaro} style={{filter: BRILHO}} />
	</g>
);

// ============================================================
// 0. GANCHO — 15 anos de vida, 10 dormindo
// ============================================================
export const Gancho: Cena = ({b}) => {
	const tq = em(b, 'quinze');
	const td = em(b, 'dez');
	return (
		<>
			<Chao y={780} />
			<GatoPalito x={500} y={780} escala={1.5} pose="deitado" olhos="fechados" />
			<Zzz x={330} y={600} />
			<Palavra x={1340} y={190} t={tq} texto="15 ANOS" tam={100} cor={COR.branco} />
			<GradeAnos x={1040} y={270} tAparece={tq} tAcende={td} />
			<Rotulo de={{x: 1340, y: 720}} para={{x: 1340, y: 640}} t={em(b, 'dormindo')} texto="10 anos dormindo" tam={46} />
		</>
	);
};

// ============================================================
// 1. RELÓGIO — 12 a 16 horas, filhotes 20
// ============================================================
export const Relogio: Cena = ({b}) => {
	const f = useCurrentFrame();
	const t12 = em(b, 'doze');
	const t16 = em(b, 'dezesseis');
	const t20 = em(b, 'vinte');
	const tFil = em(b, 'filhotes');
	const horas = f < t12 ? 0 : f < t16 ? lerp(0, 12, prog(f, t12, t12 + 18)) : lerp(12, 16, prog(f, t16, t16 + 15));
	const extra = lerp(16, 20, prog(f, t20, t20 + 15));
	const cx = 640;
	const cy = 440;
	const r = 270;
	return (
		<>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke={COR.linha} strokeWidth={52} />
			{Array.from({length: 24}, (_, i) => (
				<line key={i} x1={cx} y1={cy - r - 40} x2={cx} y2={cy - r - (i % 6 === 0 ? 60 : 48)} transform={`rotate(${i * 15} ${cx} ${cy})`} stroke={COR.cinza} strokeWidth={4} />
			))}
			{f >= t20 && <path d={arco(cx, cy, r, TOPO + (16 / 24) * Math.PI * 2, TOPO + (extra / 24) * Math.PI * 2)} stroke={COR.azulClaro} strokeWidth={52} fill="none" opacity={0.55} />}
			<path d={arco(cx, cy, r, TOPO, TOPO + (horas / 24) * Math.PI * 2)} stroke={COR.azul} strokeWidth={52} fill="none" style={{filter: BRILHO}} />
			<text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={190} fill={COR.branco} style={{filter: BRILHO}}>
				{Math.round(f >= t20 ? extra : horas)}
				<tspan fontSize={80} fill={COR.azul}>
					h
				</tspan>
			</text>
			<text x={cx} y={cy + 120} textAnchor="middle" fontFamily={FONTE.ui} fontWeight={600} fontSize={36} fill={COR.cinza}>
				de 24h por dia
			</text>
			<Palavra x={1420} y={260} t={t12} texto="12 a 16h" tam={110} />
			<g opacity={prog(f, tFil, tFil + 8)}>
				<GatoPalito x={1200} y={720} escala={0.75} pose="deitado" olhos="fechados" />
				<GatoPalito x={1600} y={720} escala={1.05} pose="deitado" olhos="fechados" />
				<Zzz x={1110} y={640} />
				<Zzz x={1480} y={620} t={10} />
				<text x={1200} y={780} textAnchor="middle" fontFamily={FONTE.ui} fontWeight={600} fontSize={38} fill={COR.azulClaro}>
					filhote
				</text>
				<text x={1600} y={780} textAnchor="middle" fontFamily={FONTE.ui} fontWeight={600} fontSize={38} fill={COR.azulClaro}>
					idoso
				</text>
			</g>
			<Palavra x={1420} y={450} t={t20} texto="até 20h" tam={90} cor={COR.azulClaro} />
		</>
	);
};

// ============================================================
// 2. PREGUIÇA ✗ → ESTRATÉGIA → trilha com 3 placas
// ============================================================
const Placa: React.FC<{x: number; y: number; n: number; t: number}> = ({x, y, n, t}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	if (s <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<rect x={-8} y={-200} width={16} height={200} fill={COR.azulEscuro} />
			<rect x={-80} y={-290} width={160} height={110} rx={18} fill={COR.fundo2} stroke={COR.azul} strokeWidth={6} style={{filter: BRILHO}} />
			<text y={-212} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={80} fill={COR.branco}>
				{n}
			</text>
		</g>
	);
};

export const Estrategia: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tP = em(b, 'preguiça');
	const tE = em(b, 'estratégia');
	const tH = em(b, 'hoje');
	const t3 = em(b, 'três');
	const xGato = lerp(160, 480, prog(f, tH, b.total));
	return (
		<>
			<Palavra x={960} y={300} t={tP} texto="PREGUIÇA" tam={150} cor={COR.cinza} brilho={false} risco={tE - 6} sai={tH} />
			<Palavra x={960} y={520} t={tE} texto="ESTRATÉGIA" tam={170} sai={tH} />
			<g opacity={prog(f, tH, tH + 8)}>
				<Chao y={780} />
				<GatoPalito x={xGato} y={780} escala={1.1} pose="andando" />
				<Placa x={760} y={780} n={1} t={t3} />
				<Placa x={1180} y={780} n={2} t={t3 + 5} />
				<Placa x={1600} y={780} n={3} t={t3 + 10} />
				<Palavra x={1180} y={290} t={t3} texto="3 MOTIVOS" tam={110} />
			</g>
		</>
	);
};

// ============================================================
// 3. CAÇADOR — espreitar, correr, saltar
// ============================================================
const Cartao: React.FC<{x: number; y: number; t: number; n: number; texto: string}> = ({x, y, t, n, texto}) => {
	const f = useCurrentFrame();
	const s = pop(f, t);
	if (s <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<rect x={-210} y={-80} width={420} height={160} rx={26} fill={COR.fundo2} stroke={COR.azul} strokeWidth={5} style={{filter: BRILHO}} />
			<circle cx={-150} cy={0} r={38} fill={COR.azul} />
			<text x={-150} y={16} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={46} fill={COR.fundo}>
				{n}
			</text>
			<text x={40} y={18} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={58} fill={COR.branco}>
				{texto}
			</text>
		</g>
	);
};

export const Cacador: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tEs = em(b, 'espreitar');
	const tC = em(b, 'correr');
	const tS = em(b, 'saltar');
	const tT = em(b, 'tudo');
	const salto = prog(f, tS, tS + 16);
	const x = f < tC ? 380 : f < tS ? lerp(380, 1150, prog(f, tC, tS)) : lerp(1150, 1420, salto);
	const y = 780 - (f >= tS ? Math.sin(salto * Math.PI) * 230 : 0);
	const pose = f < tC ? 'agachado' : f < tS + 16 ? 'correndo' : 'em-pe';
	const fuga = prog(f, tS + 8, tS + 30);
	return (
		<>
			<Etiqueta texto="MOTIVO 1" />
			<Chao y={780} />
			<Palavra x={960} y={250} t={em(b, 'caçador')} texto="CAÇADOR" tam={150} sai={tEs - 8} />
			<g opacity={1 - prog(f, tEs - 8, tEs)}>
				<Raio x={960} y={470} s={pop(f, em(b, 'explosão')) * 1.1} />
				<Palavra x={960} y={610} t={em(b, 'explosão')} texto="EXPLOSÃO" tam={80} cor={COR.branco} />
			</g>
			<Cartao x={440} y={240} t={tEs} n={1} texto="ESPREITAR" />
			<Cartao x={960} y={240} t={tC} n={2} texto="CORRER" />
			<Cartao x={1480} y={240} t={tS} n={3} texto="SALTAR" />
			<Palavra x={960} y={440} t={tT} texto="em poucos segundos" tam={64} cor={COR.azulClaro} />
			<Rato x={lerp(1560, 2200, fuga)} y={780} s={1.1} virado={fuga === 0} />
			<GatoPalito x={x} y={y} escala={1.25} pose={pose} />
		</>
	);
};

// ============================================================
// 4. BATERIA — dorme, carrega, gasta
// ============================================================
export const BateriaCena: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tG = em(b, 'gasta');
	const tB = em(b, 'bateria');
	const tD = em(b, 'dorme');
	const tC = em(b, 'carrega');
	const tG2 = em(b, 'gasta', 1);
	let nivel = lerp(1, 0.12, prog(f, tG, tG + 25));
	if (f >= tC) nivel = lerp(0.12, 1, prog(f, tC, tG2));
	if (f >= tG2) nivel = lerp(1, 0.05, prog(f, tG2 + 4, tG2 + 30));
	const dormindo = f >= tD && f < tG2;
	const correndo = f >= tG2;
	const xg = correndo ? lerp(560, 960, Math.sin(prog(f, tG2, b.total) * Math.PI * 1.5) * 0.5 + 0.5) : 560;
	return (
		<>
			<Chao y={800} />
			<GatoPalito x={xg} y={800} escala={1.35} pose={correndo ? 'correndo' : dormindo ? 'deitado' : 'em-pe'} olhos={dormindo ? 'fechados' : 'abertos'} />
			{dormindo && <Zzz x={380} y={640} />}
			<Bateria x={1440} y={430} nivel={nivel} s={1.05} raio={f >= tC && f < tG2} />
			<Palavra x={1440} y={110} t={tG} texto="ENERGIA" tam={70} cor={COR.branco} />
			<Rotulo de={{x: 900, y: 420}} para={{x: 1300, y: 430}} t={tB} texto="corpo = bateria" tam={44} sai={tD} />
			<Palavra x={260} y={190} t={tD} texto="DORME" tam={76} ancora="start" />
			<Palavra x={260} y={290} t={tC} texto="CARREGA" tam={76} ancora="start" />
			<Palavra x={260} y={390} t={tG2} texto="GASTA TUDO" tam={76} ancora="start" cor={COR.alerta} />
		</>
	);
};

// ============================================================
// 5. HORÁRIO — crepusculares: picos ao amanhecer e anoitecer
// ============================================================
const hx = (h: number) => 260 + (h / 24) * 1400;
const hy = (h: number) => 700 - 340 * (Math.exp(-(((h - 6) / 1.7) ** 2)) + Math.exp(-(((h - 18.5) / 1.7) ** 2))) - 20;

export const Horario: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCr = em(b, 'crepusculares');
	const tAt = em(b, 'ativos');
	const tAm = em(b, 'amanhecer');
	const tAn = em(b, 'anoitecer');
	const tR = em(b, 'ratos');
	const tPa = em(b, 'passarinhos');
	const k = prog(f, tAt, tAt + 45);
	const pts = Array.from({length: 97}, (_, i) => i / 4).map((h) => `${hx(h)},${hy(h)}`);
	const comprimento = 2600;
	return (
		<>
			<Etiqueta texto="MOTIVO 2" />
			<Palavra x={960} y={170} t={tCr} texto="CREPUSCULARES" tam={110} sai={tAm - 6} />
			<line x1={hx(0)} y1={700} x2={hx(24)} y2={700} stroke={COR.linha} strokeWidth={4} />
			{[0, 6, 12, 18, 24].map((h) => (
				<text key={h} x={hx(h)} y={750} textAnchor="middle" fontFamily={FONTE.ui} fontWeight={600} fontSize={32} fill={COR.cinza}>
					{h}h
				</text>
			))}
			<polyline points={pts.join(' ')} fill="none" stroke={COR.azul} strokeWidth={9} strokeLinejoin="round" strokeDasharray={comprimento} strokeDashoffset={comprimento * (1 - k)} style={{filter: BRILHO}} />
			<text x={hx(12)} y={640} textAnchor="middle" fontFamily={FONTE.ui} fontWeight={600} fontSize={34} fill={COR.cinza} opacity={k}>
				atividade do gato
			</text>
			<Sol x={hx(6)} y={hy(6) - 90} s={pop(f, tAm) * 0.9} />
			<Palavra x={hx(6)} y={hy(6) - 200} t={tAm} texto="AMANHECER" tam={52} cor={COR.branco} brilho={false} />
			<Lua x={hx(18.5)} y={hy(18.5) - 90} s={pop(f, tAn) * 0.9} />
			<Palavra x={hx(18.5)} y={hy(18.5) - 200} t={tAn} texto="ANOITECER" tam={52} cor={COR.branco} brilho={false} />
			{f >= tR && <Rato x={lerp(hx(3), hx(8), prog(f, tR, tR + 40))} y={700} s={0.9} />}
			{f >= tPa && <Passaro x={lerp(hx(16), hx(21), prog(f, tPa, tPa + 40))} y={560} s={1.3} />}
		</>
	);
};

// ============================================================
// 6. MADRUGADA — dorme o dia todo, 5h da manhã corre pela casa
// ============================================================
export const Madrugada: Cena = ({b}) => {
	const f = useCurrentFrame();
	const t5 = em(b, 'cinco');
	const tCo = em(b, 'correr');
	const h = f < t5 ? (8 + (f / t5) * 21) % 24 : 5;
	const hh = String(Math.floor(h)).padStart(2, '0');
	const mm = f < t5 ? String(Math.floor((h % 1) * 60)).padStart(2, '0') : '00';
	const alarme = f >= t5;
	const tremor = alarme ? Math.sin(f * 2.2) * 6 : 0;
	const volta = (f - tCo) % 40;
	const ida = Math.floor((f - tCo) / 40) % 2 === 0;
	const xc = ida ? lerp(-200, 2100, volta / 40) : lerp(2100, -200, volta / 40);
	return (
		<>
			<Chao y={800} />
			<g transform={`translate(${960 + tremor} 240) rotate(${tremor * 0.6})`}>
				<rect x={-250} y={-100} width={500} height={200} rx={34} fill={COR.fundo2} stroke={alarme ? COR.alerta : COR.azul} strokeWidth={8} style={{filter: BRILHO}} />
				<text y={52} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={150} fill={alarme ? COR.alerta : COR.branco}>
					{hh}:{mm}
				</text>
			</g>
			{/* pessoa dormindo na cama */}
			<g transform="translate(1500 800)">
				<rect x={-200} y={-90} width={400} height={70} rx={14} fill={COR.azulEscuro} />
				<rect x={-200} y={-20} width={20} height={20} fill={COR.azulEscuro} />
				<rect x={180} y={-20} width={20} height={20} fill={COR.azulEscuro} />
				<rect x={-60} y={-112} width={240} height={44} rx={20} fill={COR.cinza} />
				<circle cx={-120} cy={-130} r={42} fill={COR.fundo2} stroke={COR.branco} strokeWidth={6} />
				{alarme && (
					<text x={-120} y={-200} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={90} fill={COR.alerta} transform={`scale(${pop(f, t5)})`} style={{transformOrigin: '-120px -200px'}}>
						?!
					</text>
				)}
				{!alarme && <Zzz x={-110} y={-190} />}
			</g>
			{f < tCo ? (
				<>
					<GatoPalito x={600} y={800} escala={1.3} pose="deitado" olhos={alarme ? 'abertos' : 'fechados'} />
					{!alarme && <Zzz x={440} y={650} t={8} />}
				</>
			) : (
				<g>
					{[0, 1, 2].map((i) => (
						<line key={i} x1={xc + (ida ? -260 : 260)} y1={640 + i * 50} x2={xc + (ida ? -120 : 120)} y2={640 + i * 50} stroke={COR.azulClaro} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
					))}
					<GatoPalito x={xc} y={800} escala={1.3} pose="correndo" virado={!ida} />
				</g>
			)}
		</>
	);
};

// ============================================================
// 7 e 8. COCHILO x SONO PROFUNDO — gráfico de pizza 3/4 + 1/4
// ============================================================
const Pizza: React.FC<{tLeve: number; tProf?: number}> = ({tLeve, tProf}) => {
	const f = useCurrentFrame();
	const cx = 1420;
	const cy = 470;
	const r = 210;
	const k = prog(f, tLeve, tLeve + 22);
	const kp = tProf === undefined ? 0 : prog(f, tProf, tProf + 16);
	const destaque = tProf !== undefined && f >= tProf;
	const saida = destaque ? 30 * pop(f, tProf) : 0;
	const meio = TOPO + Math.PI * 2 * 0.875;
	return (
		<g>
			<circle cx={cx} cy={cy} r={r} fill={COR.fundo2} stroke={COR.linha} strokeWidth={4} />
			<path d={fatia(cx, cy, r, TOPO, TOPO + Math.PI * 1.5 * k)} fill={destaque ? COR.azulEscuro : COR.azul} style={{filter: destaque ? 'none' : BRILHO}} />
			{kp > 0 && <path transform={`translate(${Math.cos(meio) * saida} ${Math.sin(meio) * saida})`} d={fatia(cx, cy, r, TOPO + Math.PI * 1.5, TOPO + Math.PI * 1.5 + Math.PI * 0.5 * kp)} fill={COR.azulClaro} style={{filter: BRILHO}} />}
			{k > 0.9 && (
				<text x={cx + 30} y={cy + 70} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={80} fill={destaque ? COR.cinza : COR.fundo}>
					75%
				</text>
			)}
			{kp > 0.9 && (
				<text x={cx - 100 + Math.cos(meio) * saida} y={cy - 90 + Math.sin(meio) * saida} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={800} fontSize={58} fill={COR.fundo}>
					25%
				</text>
			)}
		</g>
	);
};

export const Cochilo: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tO = em(b, 'orelha');
	const tBa = em(b, 'barulho');
	const giro = f >= tO ? 32 * Math.sin((f - tO) * 0.14) : 0;
	return (
		<>
			<Etiqueta texto="MOTIVO 3" />
			<Chao y={780} />
			<Palavra x={700} y={190} t={em(b, 'mentira')} texto="SONO DE MENTIRA" tam={96} />
			<GatoPalito x={560} y={780} escala={1.6} pose="deitado" olhos="fechados" orelha={giro} />
			<Pizza tLeve={em(b, 'três')} />
			<Palavra x={1420} y={760} t={em(b, 'cochilo')} texto="cochilo leve" tam={70} cor={COR.branco} />
			<Rotulo de={{x: 210, y: 470}} para={{x: 380, y: 630}} t={em(b, 'olho')} texto="olho fechado" tam={40} />
			<Rotulo de={{x: 700, y: 400}} para={{x: 470, y: 540}} t={tO} texto="orelha ligada" tam={40} />
			<Barulho x={880} y={560} t={tBa - 20} />
			<Barulho x={150} y={650} t={tBa} />
		</>
	);
};

export const Profundo: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tSo = em(b, 'sonha');
	const tPa = em(b, 'patinhas');
	const tCa = em(b, 'caçando');
	const bolha = pop(f, tSo, 30, 14);
	return (
		<>
			<Etiqueta texto="MOTIVO 3" />
			<Chao y={780} />
			<GatoPalito x={560} y={780} escala={1.6} pose="deitado" olhos="fechados" tremer={f >= tPa} />
			<Pizza tLeve={-30} tProf={em(b, 'quarto')} />
			<Palavra x={1420} y={760} t={em(b, 'profundo')} texto="sono profundo" tam={70} cor={COR.azulClaro} />
			{/* balão de sonho */}
			{bolha > 0 && (
				<g transform={`translate(560 300) scale(${bolha})`}>
					<circle cx={-140} cy={260} r={14} fill={COR.fundo2} stroke={COR.azulClaro} strokeWidth={4} />
					<circle cx={-110} cy={200} r={24} fill={COR.fundo2} stroke={COR.azulClaro} strokeWidth={4} />
					<ellipse cx={20} cy={20} rx={300} ry={150} fill={COR.fundo2} stroke={COR.azulClaro} strokeWidth={6} style={{filter: BRILHO}} />
					<line x1={-240} y1={110} x2={280} y2={110} stroke={COR.linha} strokeWidth={4} />
					{f >= tCa ? (
						<>
							<Rato x={160 + Math.sin(f * 0.2) * 20} y={110} s={0.7} />
							<GatoPalito x={-90 + Math.sin(f * 0.2) * 20} y={110} escala={0.55} pose="correndo" />
						</>
					) : (
						<Rato x={60} y={110} s={0.8} />
					)}
				</g>
			)}
			<Rotulo de={{x: 190, y: 600}} para={{x: 420, y: 760}} t={tPa} texto="patinhas tremendo" tam={40} />
		</>
	);
};

// ============================================================
// 9. BÔNUS — barriga pra cima = confiança
// ============================================================
export const Barriga: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tPe = em(b, 'perto');
	const tCo = em(b, 'confiança');
	return (
		<>
			<Etiqueta texto="BÔNUS" t={em(b, 'bônus')} />
			<Chao y={800} />
			<GatoPalito x={700} y={800} escala={1.6} pose="barriga" olhos="fechados" />
			{/* pessoa */}
			<g opacity={prog(f, tPe, tPe + 10)} transform="translate(1320 800)" stroke={COR.branco} strokeWidth={8} strokeLinecap="round" fill="none">
				<line x1={0} y1={-110} x2={0} y2={-300} />
				<line x1={0} y1={-110} x2={-40} y2={0} />
				<line x1={0} y1={-110} x2={40} y2={0} />
				<line x1={0} y1={-260} x2={-80} y2={-170 + Math.sin(f * 0.15) * 10} />
				<line x1={0} y1={-260} x2={50} y2={-180} />
				<circle cx={0} cy={-350} r={50} fill={COR.fundo2} />
			</g>
			{[0, 1, 2, 3].map((i) => {
				const c = ((f - tCo + i * 15) % 60) / 60;
				return f >= tCo ? <Coracao key={i} x={lerp(860, 1180, (i % 2) * 0.6 + 0.2) + Math.sin(c * 6 + i) * 20} y={620 - c * 260} s={0.8 * Math.sin(c * Math.PI)} /> : null;
			})}
			<Palavra x={1000} y={200} t={tCo} texto="CONFIANÇA" tam={140} />
			<Rotulo de={{x: 400, y: 520}} para={{x: 690, y: 730}} t={em(b, 'frágil')} texto="parte mais frágil" tam={42} />
		</>
	);
};

// ============================================================
// 10. RETORNO — o gancho volta: não é preguiça, é recarga
// ============================================================
export const Retorno: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCa = em(b, 'caçador');
	const tR = em(b, 'recarregando');
	const saiGrade = 1 - prog(f, tCa - 6, tCa + 4);
	return (
		<>
			<g opacity={saiGrade}>
				<GradeAnos x={340} y={250} tAparece={-40} tAcende={em(b, 'dez') - 30} />
				<Palavra x={1380} y={430} t={em(b, 'preguiça')} texto="PREGUIÇA" tam={130} cor={COR.cinza} brilho={false} risco={em(b, 'preguiça') + 12} />
			</g>
			{f >= tCa - 4 && (
				<g opacity={prog(f, tCa - 4, tCa + 6)}>
					<Chao y={800} />
					<GatoPalito x={620} y={800} escala={1.5} pose="deitado" olhos="fechados" />
					<Zzz x={440} y={640} />
					<Bateria x={1320} y={440} nivel={lerp(0.2, 1, prog(f, tR, b.total))} raio s={0.95} />
					<Palavra x={960} y={130} t={tCa} texto="CAÇADOR RECARREGANDO" tam={92} />
				</g>
			)}
		</>
	);
};

// ============================================================
// 11. CTA — quantas horas o seu gato dorme?
// ============================================================
export const Cta: Cena = ({b}) => {
	const f = useCurrentFrame();
	const tCo = em(b, 'comentários');
	const tQ = em(b, 'quantas');
	const frase = 'Meu gato dorme ___ horas!';
	const letras = Math.floor(Math.max(0, f - tCo) * 0.9);
	const s = pop(f, tCo);
	return (
		<>
			<Chao y={800} />
			<GatoPalito x={460} y={800} escala={1.45} pose="em-pe" aceno />
			<g transform={`translate(1200 400) scale(${s})`}>
				<rect x={-430} y={-150} width={860} height={300} rx={36} fill={COR.fundo2} stroke={COR.azul} strokeWidth={6} style={{filter: BRILHO}} />
				<path d="M -300 150 L -340 230 L -220 150 Z" fill={COR.fundo2} stroke={COR.azul} strokeWidth={6} strokeLinejoin="round" />
				<circle cx={-330} cy={-60} r={44} fill={COR.azulEscuro} />
				<text x={-260} y={-48} fontFamily={FONTE.ui} fontWeight={600} fontSize={36} fill={COR.cinza}>
					@voce
				</text>
				<text x={-370} y={60} fontFamily={FONTE.titulo} fontWeight={800} fontSize={56} fill={COR.branco}>
					{frase.slice(0, letras)}
					<tspan fill={COR.azul} opacity={f % 20 < 10 ? 1 : 0}>
						|
					</tspan>
				</text>
			</g>
			<Coracao x={1560} y={730} s={pop(f, tQ + 15) * 1.1} />
			<Palavra x={1200} y={140} t={tQ} texto="QUANTAS HORAS?" tam={120} />
		</>
	);
};

export const CENAS: Record<string, Cena> = {
	gancho: Gancho,
	relogio: Relogio,
	estrategia: Estrategia,
	cacador: Cacador,
	bateria: BateriaCena,
	horario: Horario,
	madrugada: Madrugada,
	cochilo: Cochilo,
	profundo: Profundo,
	barriga: Barriga,
	retorno: Retorno,
	cta: Cta,
};
