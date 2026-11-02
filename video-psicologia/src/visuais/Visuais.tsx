import React from 'react';
import {interpolate, random} from 'remotion';
import {COR, FONTE, prog} from '../tema';
import type {Visual} from '../roteiro';

type P = {f: number; dur: number};

const W = 1920;
const H = 1080;
const CX = W / 2;
const CY = H / 2 - 60;

// Traço que se desenha: pathLength=1 + dashoffset
const desenho = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});

const Defs: React.FC = () => (
	<defs>
		<filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="6" result="b" />
			<feMerge>
				<feMergeNode in="b" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="brilhoForte" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="18" result="b" />
			<feMerge>
				<feMergeNode in="b" />
				<feMergeNode in="b" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="halo">
			<stop offset="0%" stopColor={COR.vermelho} stopOpacity="0.55" />
			<stop offset="100%" stopColor={COR.vermelho} stopOpacity="0" />
		</radialGradient>
		<radialGradient id="haloCreme">
			<stop offset="0%" stopColor="#fff1d6" stopOpacity="0.5" />
			<stop offset="100%" stopColor="#fff1d6" stopOpacity="0" />
		</radialGradient>
		<linearGradient id="feixe" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stopColor="#fff1d6" stopOpacity="0.45" />
			<stop offset="100%" stopColor="#fff1d6" stopOpacity="0" />
		</linearGradient>
	</defs>
);

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
		<Defs />
		{children}
	</svg>
);

// Busto de frente (caixa 200x260)
export const BUSTO =
	'M100 20 C70 20 55 45 55 75 C55 105 70 128 85 135 L85 150 C40 158 10 185 5 260 L195 260 C190 185 160 158 115 150 L115 135 C130 128 145 105 145 75 C145 45 130 20 100 20 Z';

const Busto: React.FC<{x: number; y: number; s?: number; cor?: string; contorno?: string; op?: number; espelhar?: boolean}> = ({
	x,
	y,
	s = 1,
	cor = '#000',
	contorno = COR.cinza,
	op = 1,
	espelhar,
}) => (
	<g transform={`translate(${x} ${y}) scale(${espelhar ? -s : s} ${s}) translate(-100 -140)`} opacity={op}>
		<path d={BUSTO} fill={cor} stroke={contorno} strokeWidth={2 / s} />
	</g>
);

// Linhas guia estilo "planta técnica"
const Grade: React.FC<{f: number; op?: number}> = ({f, op = 0.08}) => (
	<g opacity={op} stroke={COR.creme} strokeWidth={1}>
		{Array.from({length: 13}).map((_, i) => (
			<line key={'v' + i} x1={i * 160} y1={0} x2={i * 160} y2={H} {...desenho(prog(f, i * 2, 30 + i * 2))} />
		))}
		{Array.from({length: 8}).map((_, i) => (
			<line key={'h' + i} x1={0} y1={i * 160} x2={W} y2={i * 160} {...desenho(prog(f, i * 3, 30 + i * 3))} />
		))}
	</g>
);

const Rotulo: React.FC<{x: number; y: number; t: string; f: number; atraso?: number; cor?: string; anchor?: 'start' | 'middle' | 'end'}> = ({
	x,
	y,
	t,
	f,
	atraso = 0,
	cor = COR.cinza,
	anchor = 'start',
}) => {
	const n = Math.floor(interpolate(f - atraso, [0, t.length * 1.5], [0, t.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	return (
		<text x={x} y={y} fill={cor} fontFamily={FONTE.ui} fontSize={20} letterSpacing={4} textAnchor={anchor}>
			{t.slice(0, n)}
		</text>
	);
};

// ───────────────────────── visuais ─────────────────────────

const Olho: React.FC<P> = ({f, dur}) => {
	const abre = prog(f, 0, 30);
	const piscar = f > dur - 40 && f < dur - 30 ? 0.1 : 1;
	const h = 170 * abre * piscar;
	const pupila = interpolate(f, [0, dur], [38, 70], {extrapolateRight: 'clamp'});
	const olhoPath = `M${CX - 420} ${CY} Q${CX} ${CY - h * 2} ${CX + 420} ${CY} Q${CX} ${CY + h * 2} ${CX - 420} ${CY} Z`;
	return (
		<Svg>
			<circle cx={CX} cy={CY} r={520} fill="url(#halo)" opacity={0.5 + 0.2 * Math.sin(f / 12)} />
			{Array.from({length: 36}).map((_, i) => {
				const a = (i / 36) * Math.PI * 2 + f / 400;
				const r1 = 470;
				const r2 = 470 + 40 + 40 * random('raio' + i);
				const p = prog(f, 10 + i, 40 + i);
				return (
					<line
						key={i}
						x1={CX + Math.cos(a) * r1}
						y1={CY + Math.sin(a) * r1}
						x2={CX + Math.cos(a) * (r1 + (r2 - r1) * p)}
						y2={CY + Math.sin(a) * (r1 + (r2 - r1) * p)}
						stroke={COR.creme}
						strokeOpacity={0.25}
						strokeWidth={2}
					/>
				);
			})}
			<clipPath id="olhoClip">
				<path d={olhoPath} />
			</clipPath>
			<path d={olhoPath} fill="#0d0b0b" stroke={COR.creme} strokeWidth={3} {...desenho(prog(f, 0, 35))} />
			<g clipPath="url(#olhoClip)">
				<circle cx={CX} cy={CY} r={150} fill="#1a0507" stroke={COR.vermelho} strokeWidth={3} filter="url(#brilho)" />
				{[140, 120, 100].map((r, i) => (
					<circle
						key={r}
						cx={CX}
						cy={CY}
						r={r}
						fill="none"
						stroke={COR.vermelho}
						strokeOpacity={0.5}
						strokeWidth={2}
						strokeDasharray={`${4 + i * 3} ${8 + i * 2}`}
						transform={`rotate(${(i % 2 ? -1 : 1) * f * (0.6 + i * 0.2)} ${CX} ${CY})`}
					/>
				))}
				<circle cx={CX} cy={CY} r={pupila} fill="#000" />
				<circle cx={CX - 30} cy={CY - 35} r={14} fill={COR.creme} opacity={0.8} />
			</g>
		</Svg>
	);
};

const Marionete: React.FC<P> = ({f}) => {
	const bal = Math.sin(f / 18) * 10;
	const top = 150;
	const cx = CX;
	const rad = (bal * Math.PI) / 180;
	const pts = [-260, -130, 0, 130, 260].map((dx) => ({x: cx + dx * Math.cos(rad), y: top + dx * Math.sin(rad)}));
	const corpoY = 560 + Math.sin(f / 18 + 1) * 10;
	const alvo = [
		{x: cx - 170, y: corpoY + 60 + Math.sin(f / 18) * 40},
		{x: cx - 60, y: corpoY + 330},
		{x: cx, y: corpoY - 120},
		{x: cx + 60, y: corpoY + 330},
		{x: cx + 170, y: corpoY + 60 - Math.sin(f / 18) * 40},
	];
	const linha = prog(f, 0, 40);
	return (
		<Svg>
			<circle cx={cx} cy={top} r={300} fill="url(#halo)" opacity={0.35} />
			{/* mãos gigantes (barra de controle) */}
			<g transform={`rotate(${bal} ${cx} ${top})`}>
				<rect x={cx - 300} y={top - 14} width={600} height={28} rx={6} fill="#151212" stroke={COR.creme} strokeWidth={2} />
				<rect x={cx - 14} y={top - 120} width={28} height={240} rx={6} fill="#151212" stroke={COR.creme} strokeWidth={2} />
			</g>
			{pts.map((p, i) => (
				<line
					key={i}
					x1={p.x}
					y1={p.y}
					x2={p.x + (alvo[i].x - p.x) * linha}
					y2={p.y + (alvo[i].y - p.y) * linha}
					stroke={COR.vermelho}
					strokeWidth={1.6}
					opacity={0.85}
					filter="url(#brilho)"
				/>
			))}
			{/* boneco */}
			<g stroke={COR.creme} strokeWidth={8} strokeLinecap="round" fill="none" opacity={prog(f, 10, 30)}>
				<circle cx={cx} cy={corpoY - 80} r={42} fill="#0b0a0a" />
				<line x1={cx} y1={corpoY - 38} x2={cx} y2={corpoY + 160} />
				<line x1={cx} y1={corpoY} x2={alvo[0].x} y2={alvo[0].y} />
				<line x1={cx} y1={corpoY} x2={alvo[4].x} y2={alvo[4].y} />
				<line x1={cx} y1={corpoY + 160} x2={alvo[1].x} y2={alvo[1].y} />
				<line x1={cx} y1={corpoY + 160} x2={alvo[3].x} y2={alvo[3].y} />
			</g>
		</Svg>
	);
};

const Casal: React.FC<P> = ({f}) => {
	const vira = prog(f, 20, 70);
	return (
		<Svg>
			<rect x={0} y={CY + 140} width={W} height={2} fill={COR.creme} opacity={0.15} />
			<circle cx={CX + 240} cy={CY} r={380} fill="url(#halo)" opacity={0.25 * vira} />
			<Busto x={CX - 240} y={CY} s={1.6} contorno={COR.cinza} op={prog(f, 0, 20)} />
			<Busto x={CX + 240} y={CY} s={1.6} contorno={COR.vermelho} op={prog(f, 5, 25)} espelhar />
			{/* olhos vermelhos que surgem */}
			<g opacity={vira} filter="url(#brilho)">
				<circle cx={CX + 210} cy={CY - 110} r={5} fill={COR.vermelho} />
				<circle cx={CX + 262} cy={CY - 110} r={5} fill={COR.vermelho} />
			</g>
		</Svg>
	);
};

const Vazio: React.FC<P> = ({f}) => (
	<Svg>
		<line x1={CX} y1={CY + 60} x2={CX} y2={CY + 60} stroke={COR.vermelho} strokeWidth={2} />
		<line
			x1={CX - 500 * prog(f, 0, 60)}
			y1={CY + 160}
			x2={CX + 500 * prog(f, 0, 60)}
			y2={CY + 160}
			stroke={COR.vermelho}
			strokeWidth={2}
			filter="url(#brilho)"
			opacity={0.7}
		/>
	</Svg>
);

const Laboratorio: React.FC<P> = ({f}) => {
	const bx = CX - 330;
	const by = CY - 230;
	return (
		<Svg>
			<Grade f={f} op={0.07} />
			<g stroke={COR.creme} strokeWidth={2.5} fill="none">
				<rect x={bx} y={by} width={660} height={420} {...desenho(prog(f, 0, 40))} />
				<path d={`M${bx} ${by} L${bx + 120} ${by - 90} L${bx + 780} ${by - 90} L${bx + 660} ${by}`} {...desenho(prog(f, 15, 55))} />
				<path d={`M${bx + 660} ${by + 420} L${bx + 780} ${by + 330} L${bx + 780} ${by - 90}`} {...desenho(prog(f, 25, 60))} />
				<rect x={bx + 470} y={by + 220} width={110} height={80} {...desenho(prog(f, 40, 70))} />
				<circle cx={bx + 200} cy={by + 330} r={40} {...desenho(prog(f, 50, 80))} />
			</g>
			<line x1={bx + 580} y1={by + 260} x2={bx + 820} y2={by + 160} stroke={COR.vermelho} strokeWidth={1.5} {...desenho(prog(f, 60, 80))} />
			<Rotulo x={bx + 830} y={by + 160} t="ALAVANCA" f={f} atraso={70} cor={COR.vermelho} />
			<line x1={bx + 160} y1={by + 330} x2={bx - 80} y2={by + 470} stroke={COR.cinza} strokeWidth={1.5} {...desenho(prog(f, 70, 90))} />
			<Rotulo x={bx - 90} y={by + 500} t="SUJEITO" f={f} atraso={80} anchor="end" />
			<Rotulo x={bx} y={by - 120} t="FIG. 01 — CAIXA DE SKINNER, 1950" f={f} atraso={20} cor={COR.creme} />
		</Svg>
	);
};

const Alavanca: React.FC<P> = ({f}) => {
	const ciclo = 26;
	const k = Math.floor(f / ciclo);
	const c = (f % ciclo) / ciclo;
	const press = c < 0.3 ? Math.sin((c / 0.3) * Math.PI) : 0;
	const recompensa = random('rec' + k) > 0.55;
	const cont = Array.from({length: k + 1}).filter((_, i) => random('rec' + i) > 0.55).length;
	return (
		<Svg>
			<Grade f={f} op={0.05} />
			<rect x={CX - 400} y={CY + 220} width={800} height={6} fill={COR.creme} opacity={0.6} />
			{/* alavanca */}
			<g transform={`rotate(${-25 + press * 30} ${CX - 120} ${CY + 220})`}>
				<rect x={CX - 130} y={CY - 40} width={20} height={260} rx={8} fill={COR.creme} />
				<circle cx={CX - 120} cy={CY - 40} r={34} fill={COR.vermelho} filter="url(#brilho)" />
			</g>
			{/* dispensador */}
			<rect x={CX + 140} y={CY - 260} width={160} height={120} fill="none" stroke={COR.creme} strokeWidth={3} />
			<path d={`M${CX + 190} ${CY - 140} L${CX + 190} ${CY - 90} M${CX + 250} ${CY - 140} L${CX + 250} ${CY - 90}`} stroke={COR.creme} strokeWidth={3} />
			{recompensa && c > 0.25 && (
				<circle cx={CX + 220} cy={interpolate(c, [0.25, 0.7], [CY - 110, CY + 205], {extrapolateRight: 'clamp'})} r={14} fill={COR.ouro} filter="url(#brilho)" />
			)}
			{!recompensa && c > 0.3 && c < 0.8 && (
				<text x={CX + 220} y={CY - 10} fill={COR.cinza} fontFamily={FONTE.ui} fontSize={60} textAnchor="middle" opacity={1 - c}>
					✕
				</text>
			)}
			<text x={CX + 520} y={CY + 30} fill={COR.creme} fontFamily={FONTE.titulo} fontSize={130} textAnchor="middle">
				{String(cont).padStart(2, '0')}
			</text>
			<Rotulo x={CX + 520} y={CY + 80} t="RECOMPENSAS" f={f} anchor="middle" />
		</Svg>
	);
};

const SIMBOLOS = ['♥', '✦', '☾', '✕', '♥', '◆', '☾', '✦'];
const CacaNiquel: React.FC<P> = ({f}) => {
	const larg = 220;
	const alt = 260;
	const x0 = CX - (larg * 3 + 40) / 2;
	return (
		<Svg>
			<rect x={x0 - 40} y={CY - alt / 2 - 60} width={larg * 3 + 120} height={alt + 120} rx={30} fill="#0f0c0c" stroke={COR.vermelho} strokeWidth={4} filter="url(#brilho)" />
			{Array.from({length: 18}).map((_, i) => {
				const ang = (i / 18) * Math.PI * 2;
				const on = Math.floor(f / 4 + i) % 3 === 0;
				return (
					<circle
						key={i}
						cx={CX + Math.cos(ang) * 470}
						cy={CY + Math.sin(ang) * 260}
						r={7}
						fill={on ? COR.vermelho : COR.escuro}
						filter={on ? 'url(#brilho)' : undefined}
					/>
				);
			})}
			{[0, 1, 2].map((r) => {
				const para = 40 + r * 18;
				const vel = interpolate(f, [0, para], [1, 0], {extrapolateRight: 'clamp'});
				const pos = f < para ? f * 38 : para * 38;
				const desl = pos % alt;
				const x = x0 + r * (larg + 20);
				return (
					<g key={r}>
						<clipPath id={'reel' + r}>
							<rect x={x} y={CY - alt / 2} width={larg} height={alt} rx={10} />
						</clipPath>
						<rect x={x} y={CY - alt / 2} width={larg} height={alt} rx={10} fill="#e9e2d4" opacity={0.06} />
						<g clipPath={`url(#reel${r})`} style={{filter: `blur(${vel * 6}px)`}}>
							{[-1, 0, 1].map((k) => {
								const idx = Math.floor(pos / alt) + k + r * 3;
								const s = f >= para ? (r === 2 ? '✕' : '♥') : SIMBOLOS[((idx % 8) + 8) % 8];
								return (
									<text
										key={k}
										x={x + larg / 2}
										y={CY + 50 + k * alt + (f >= para ? 0 : desl)}
										textAnchor="middle"
										fontSize={150}
										fill={s === '♥' || s === '✕' ? COR.vermelho : COR.creme}
									>
										{s}
									</text>
								);
							})}
						</g>
					</g>
				);
			})}
		</Svg>
	);
};

const Celular: React.FC<P> = ({f, dur}) => {
	const px = CX - 200;
	const py = CY - 380;
	const msgs = [
		{t: 'bom dia, linda ♥', lado: 0},
		{t: 'não paro de pensar em você', lado: 0},
		{t: 'te amo?', lado: 1},
	];
	const visto = f > dur * 0.55;
	return (
		<Svg>
			<circle cx={CX} cy={CY} r={500} fill="url(#halo)" opacity={0.2} />
			<rect x={px} y={py} width={400} height={760} rx={48} fill="#0e0c0c" stroke={COR.creme} strokeWidth={3} {...desenho(prog(f, 0, 30))} />
			<rect x={px + 150} y={py + 22} width={100} height={12} rx={6} fill={COR.escuro} />
			{msgs.map((m, i) => {
				const a = prog(f, 15 + i * 18, 25 + i * 18);
				const y = py + 120 + i * 110;
				const w = m.t.length * 13 + 40;
				const x = m.lado ? px + 380 - w : px + 20;
				return (
					<g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 20})`}>
						<rect x={x} y={y} width={w} height={70} rx={22} fill={m.lado ? COR.vermelhoEscuro : '#2a2623'} />
						<text x={x + 20} y={y + 44} fill={COR.creme} fontFamily={FONTE.ui} fontSize={22}>
							{m.t}
						</text>
					</g>
				);
			})}
			{/* digitando... que some */}
			{f > 80 && !visto && (
				<g>
					{[0, 1, 2].map((i) => (
						<circle key={i} cx={px + 50 + i * 26} cy={py + 500} r={8} fill={COR.cinza} opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 6 - i))} />
					))}
				</g>
			)}
			{visto && (
				<text x={px + 380} y={py + 470} textAnchor="end" fill={COR.cinza} fontFamily={FONTE.ui} fontSize={20} opacity={prog(f, dur * 0.55, dur * 0.55 + 10)}>
					visto às 23:47
				</text>
			)}
			<Rotulo x={px + 470} y={py + 520} t="SEM RESPOSTA" f={f} atraso={dur * 0.6} cor={COR.vermelho} />
		</Svg>
	);
};

const Grafico: React.FC<P> = ({f}) => {
	const x0 = 360;
	const y0 = 800;
	const larg = 1200;
	const n = 60;
	const pontos = Array.from({length: n}).map((_, i) => {
		const pico = random('pico' + i) > 0.82;
		const v = pico ? 0.6 + random('alt' + i) * 0.4 : 0.05 + random('base' + i) * 0.12;
		return {x: x0 + (i / (n - 1)) * larg, y: y0 - v * 480, pico};
	});
	const p = prog(f, 5, 90);
	const d = pontos.map((q, i) => `${i ? 'L' : 'M'}${q.x} ${q.y}`).join(' ');
	return (
		<Svg>
			<Grade f={f} op={0.05} />
			<g stroke={COR.creme} strokeWidth={2} opacity={0.6}>
				<line x1={x0} y1={y0} x2={x0 + larg + 40} y2={y0} {...desenho(prog(f, 0, 20))} />
				<line x1={x0} y1={y0} x2={x0} y2={y0 - 560} {...desenho(prog(f, 0, 20))} />
			</g>
			<Rotulo x={x0} y={y0 - 580} t="RECOMPENSA EMOCIONAL" f={f} atraso={10} />
			<Rotulo x={x0 + larg + 40} y={y0 + 50} t="TEMPO" f={f} atraso={15} anchor="end" />
			<path d={d} fill="none" stroke={COR.vermelho} strokeWidth={4} filter="url(#brilho)" {...desenho(p)} strokeLinejoin="round" />
			{pontos.map((q, i) =>
				q.pico && i / (n - 1) <= p ? (
					<circle key={i} cx={q.x} cy={q.y} r={10 + 4 * Math.sin(f / 5 + i)} fill={COR.vermelho} filter="url(#brilhoForte)" />
				) : null,
			)}
		</Svg>
	);
};

const Lampiao: React.FC<P> = ({f, dur}) => {
	const forca = interpolate(f, [0, dur], [1, 0.25], {extrapolateRight: 'clamp'}) * (0.85 + 0.15 * Math.sin(f * 1.7) * Math.sin(f * 0.6));
	const fy = CY + 40;
	const ch = 110 * forca;
	const t = f / 4;
	const chama = `M${CX} ${fy - ch} C${CX + 30 + Math.sin(t) * 8} ${fy - ch * 0.5} ${CX + 34} ${fy - 10} ${CX} ${fy} C${CX - 34} ${fy - 10} ${CX - 30 + Math.cos(t) * 8} ${fy - ch * 0.5} ${CX} ${fy - ch} Z`;
	return (
		<Svg>
			<circle cx={CX} cy={fy - 40} r={700 * forca} fill="url(#haloCreme)" opacity={0.7 * forca} />
			<g stroke={COR.creme} strokeWidth={3} fill="none" opacity={0.85}>
				<path d={`M${CX - 140} ${CY - 180} L${CX + 140} ${CY - 180} L${CX + 110} ${CY + 160} L${CX - 110} ${CY + 160} Z`} {...desenho(prog(f, 0, 35))} />
				<path d={`M${CX - 160} ${CY - 180} L${CX} ${CY - 280} L${CX + 160} ${CY - 180}`} {...desenho(prog(f, 10, 40))} />
				<circle cx={CX} cy={CY - 310} r={30} {...desenho(prog(f, 20, 45))} />
				<rect x={CX - 150} y={CY + 160} width={300} height={50} {...desenho(prog(f, 15, 45))} />
			</g>
			<path d={chama} fill="#ffcf8a" filter="url(#brilhoForte)" opacity={forca} />
			<path d={chama} fill="#fff6e0" transform={`translate(${CX} ${fy}) scale(0.5) translate(${-CX} ${-fy})`} opacity={forca} />
			<rect x={CX + 230} y={CY + 60} width={14} height={140} rx={7} fill="none" stroke={COR.cinza} strokeWidth={2} />
			<rect x={CX + 232} y={CY + 60 + 140 * (1 - forca)} width={10} height={140 * forca} rx={5} fill={COR.vermelho} />
			<Rotulo x={CX + 270} y={CY + 140} t="INTENSIDADE" f={f} atraso={20} />
		</Svg>
	);
};

const FRASES = ['você está louca', 'isso nunca aconteceu', 'você exagera', 'ninguém vai acreditar', 'foi culpa sua', 'você é sensível demais', 'eu nunca disse isso', 'você imaginou'];
const Sussurros: React.FC<P> = ({f}) => (
	<Svg>
		{FRASES.map((t, i) => {
			const x = 200 + random('sx' + i) * 1500;
			const y = 140 + random('sy' + i) * 800;
			const deriva = (f + i * 30) * (0.4 + random('sv' + i) * 0.6);
			const op = 0.08 + 0.12 * Math.abs(Math.sin(f / 30 + i));
			return (
				<text
					key={i}
					x={x + deriva * (i % 2 ? 1 : -1)}
					y={y}
					fill={i % 3 === 0 ? COR.vermelho : COR.creme}
					opacity={op}
					fontFamily={FONTE.texto}
					fontStyle="italic"
					fontSize={34 + random('ss' + i) * 30}
					textAnchor="middle"
					style={{filter: `blur(${1 + random('sb' + i) * 3}px)`}}
				>
					{t}
				</text>
			);
		})}
	</Svg>
);

const EspelhoQuebrado: React.FC<P> = ({f}) => {
	const impacto = {x: CX + 60, y: CY - 60};
	const rachas = Array.from({length: 11}).map((_, i) => {
		const a = (i / 11) * Math.PI * 2 + random('ra' + i) * 0.4;
		let d = `M${impacto.x} ${impacto.y}`;
		let px = impacto.x;
		let py = impacto.y;
		for (let s = 1; s <= 4; s++) {
			const r = 90 * s;
			px = impacto.x + Math.cos(a + (random(`rj${i}${s}`) - 0.5) * 0.3) * r;
			py = impacto.y + Math.sin(a + (random(`rj${i}${s}`) - 0.5) * 0.3) * r;
			d += ` L${px} ${py}`;
		}
		return d;
	});
	const quebra = prog(f, 18, 30);
	const tremor = f > 18 && f < 26 ? (random('tr' + f) - 0.5) * 16 : 0;
	return (
		<Svg>
			<g transform={`translate(${tremor} 0)`}>
				<clipPath id="ovalEsp">
					<ellipse cx={CX} cy={CY} rx={280} ry={380} />
				</clipPath>
				<ellipse cx={CX} cy={CY} rx={280} ry={380} fill="#0f0d0d" />
				<g clipPath="url(#ovalEsp)">
					<Busto x={CX} y={CY + 120} s={2} contorno={COR.cinza} />
					<Busto x={CX + 14 * quebra} y={CY + 120 - 8 * quebra} s={2} contorno={COR.vermelho} op={0.35 * quebra} cor="transparent" />
					{rachas.map((d, i) => (
						<path key={i} d={d} fill="none" stroke={COR.creme} strokeWidth={2.5} {...desenho(quebra)} />
					))}
				</g>
				<ellipse cx={CX} cy={CY} rx={300} ry={400} fill="none" stroke={COR.creme} strokeWidth={6} {...desenho(prog(f, 0, 20))} />
				<circle cx={impacto.x} cy={impacto.y} r={20 * quebra} fill="#fff" opacity={1 - prog(f, 22, 40)} filter="url(#brilhoForte)" />
			</g>
		</Svg>
	);
};

const Caderno: React.FC<P> = ({f}) => {
	const x0 = CX - 420;
	const y0 = CY - 320;
	const linhas = ['12/03 — disse que eu "inventei" a conversa', '15/03 — negou a mensagem (print salvo)', '19/03 — "você é sensível demais"', '22/03 — mudou a versão da história'];
	return (
		<Svg>
			<rect x={x0} y={y0} width={840} height={640} rx={8} fill="#141110" stroke={COR.creme} strokeWidth={2} opacity={0.95} />
			<line x1={x0 + 90} y1={y0} x2={x0 + 90} y2={y0 + 640} stroke={COR.vermelho} strokeWidth={2} opacity={0.7} />
			{Array.from({length: 9}).map((_, i) => (
				<line key={i} x1={x0 + 20} y1={y0 + 100 + i * 60} x2={x0 + 820} y2={y0 + 100 + i * 60} stroke={COR.cinza} strokeOpacity={0.25} />
			))}
			{linhas.map((t, i) => {
				const ini = 10 + i * 25;
				const n = Math.floor(interpolate(f - ini, [0, 22], [0, t.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
				return (
					<text key={i} x={x0 + 110} y={y0 + 150 + i * 120} fill={i === 2 ? COR.vermelho : COR.creme} fontFamily={FONTE.texto} fontStyle="italic" fontSize={34}>
						{t.slice(0, n)}
					</text>
				);
			})}
		</Svg>
	);
};

const Petalas: React.FC<P> = ({f}) => (
	<Svg>
		<circle cx={CX} cy={CY} r={600} fill="url(#halo)" opacity={0.25} />
		{Array.from({length: 70}).map((_, i) => {
			const x = random('px' + i) * W + Math.sin(f / 25 + i) * 40;
			const vel = 2 + random('pv' + i) * 4;
			const y = ((random('py' + i) * (H + 200) + f * vel) % (H + 200)) - 100;
			const s = 0.6 + random('ps' + i) * 1.2;
			const rot = f * (2 + random('pr' + i) * 4) + i * 40;
			return (
				<ellipse
					key={i}
					cx={0}
					cy={0}
					rx={18 * s}
					ry={9 * s}
					fill={random('pc' + i) > 0.3 ? COR.vermelho : '#8f1119'}
					opacity={0.35 + random('po' + i) * 0.6}
					transform={`translate(${x} ${y}) rotate(${rot})`}
					style={{filter: s < 0.9 ? 'blur(2px)' : undefined}}
				/>
			);
		})}
	</Svg>
);

const Correntes: React.FC<P> = ({f}) => {
	const entra = prog(f, 0, 45);
	const elos = 16;
	return (
		<Svg>
			{[-1, 1].map((lado) => (
				<g key={lado} transform={`translate(${lado * (1 - entra) * 900} ${lado * 140}) rotate(${lado * -8} ${CX} ${CY})`}>
					{Array.from({length: elos}).map((_, i) => {
						const x = 40 + i * 120;
						const vert = i % 2 === 1;
						return vert ? (
							<rect key={i} x={x - 18} y={CY - 45} width={36} height={90} rx={18} fill="none" stroke={COR.cinza} strokeWidth={14} />
						) : (
							<rect key={i} x={x - 70} y={CY - 32} width={140} height={64} rx={32} fill="none" stroke={COR.creme} strokeWidth={14} opacity={0.9} />
						);
					})}
				</g>
			))}
			{Array.from({length: 20}).map((_, i) => {
				const p = prog(f, 40 + i, 70 + i);
				return (
					<ellipse
						key={i}
						cx={random('cx' + i) * W}
						cy={CY + (p - 0.5) * 900 * (random('cd' + i) - 0.5)}
						rx={14}
						ry={7}
						fill={COR.vermelho}
						opacity={(1 - p) * 0.8}
						transform={`rotate(${i * 30 + f * 3} ${random('cx' + i) * W} ${CY})`}
					/>
				);
			})}
		</Svg>
	);
};

const CORACAO = 'M0 -60 C -40 -130 -160 -110 -160 -20 C -160 60 -60 120 0 180 C 60 120 160 60 160 -20 C 160 -110 40 -130 0 -60 Z';
const Coracao: React.FC<P> = ({f, dur}) => {
	const pulso = 1 + 0.06 * Math.max(0, Math.sin(f / 4.5)) ** 8;
	const racha = prog(f, dur * 0.55, dur * 0.55 + 15);
	const sep = racha * 30;
	return (
		<Svg>
			<circle cx={CX} cy={CY} r={500} fill="url(#halo)" opacity={0.45 * pulso} />
			<g transform={`translate(${CX} ${CY}) scale(${2 * pulso})`}>
				<clipPath id="metadeE">
					<rect x={-200} y={-200} width={200} height={400} />
				</clipPath>
				<clipPath id="metadeD">
					<rect x={0} y={-200} width={200} height={400} />
				</clipPath>
				{[
					['metadeE', -1],
					['metadeD', 1],
				].map(([id, s]) => (
					<g key={id as string} clipPath={`url(#${id})`} transform={`translate(${(s as number) * sep} ${sep * 0.3}) rotate(${(s as number) * racha * 6})`}>
						<path d={CORACAO} fill="#1a0507" stroke={COR.vermelho} strokeWidth={3} {...desenho(prog(f, 0, 40))} filter="url(#brilho)" />
					</g>
				))}
				<path d="M0 -60 L -14 -10 L 12 30 L -10 80 L 6 120 L 0 180" fill="none" stroke={COR.creme} strokeWidth={2.5} {...desenho(racha)} />
			</g>
		</Svg>
	);
};

const Triangulo: React.FC<P> = ({f}) => {
	const rot = f * 0.15;
	const R = 330;
	const nos = [0, 1, 2].map((i) => {
		const a = ((i / 3) * 360 - 90 + rot) * (Math.PI / 180);
		return {x: CX + Math.cos(a) * R, y: CY + 40 + Math.sin(a) * R};
	});
	return (
		<Svg>
			<circle cx={nos[0].x} cy={nos[0].y} r={260} fill="url(#halo)" opacity={0.6} />
			{[0, 1, 2].map((i) => {
				const a = nos[i];
				const b = nos[(i + 1) % 3];
				const t = ((f / 40 + i / 3) % 1);
				return (
					<g key={i}>
						<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i === 2 ? COR.cinza : COR.vermelho} strokeWidth={3} {...desenho(prog(f, i * 10, 30 + i * 10))} filter="url(#brilho)" />
						<circle cx={a.x + (b.x - a.x) * t} cy={a.y + (b.y - a.y) * t} r={6} fill={COR.creme} filter="url(#brilho)" opacity={prog(f, 30, 40)} />
					</g>
				);
			})}
			{nos.map((n, i) => (
				<g key={i} opacity={prog(f, i * 8, 20 + i * 8)}>
					<circle cx={n.x} cy={n.y} r={95} fill="#0d0b0b" stroke={i === 0 ? COR.vermelho : COR.creme} strokeWidth={3} />
					<g transform={`translate(${n.x} ${n.y + 10}) scale(0.55) translate(-100 -140)`}>
						<path d={BUSTO} fill={i === 0 ? COR.vermelhoEscuro : '#2a2623'} />
					</g>
				</g>
			))}
			<Rotulo x={nos[0].x} y={nos[0].y - 120} t="O TERCEIRO" f={f} atraso={30} cor={COR.vermelho} anchor="middle" />
		</Svg>
	);
};

const Peca: React.FC<{x: number; y: number; s: number; rei?: boolean; cor: string; contorno: string}> = ({x, y, s, rei, cor, contorno}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path
			d={
				rei
					? 'M-40 0 L40 0 L32 -20 L22 -20 L28 -120 L40 -140 L-40 -140 L-28 -120 L-22 -20 L-32 -20 Z M-6 -140 L-6 -170 L-20 -170 L-20 -182 L-6 -182 L-6 -196 L6 -196 L6 -182 L20 -182 L20 -170 L6 -170 L6 -140 Z'
					: 'M-36 0 L36 0 L28 -18 L18 -18 L22 -70 L-22 -70 L-18 -18 L-28 -18 Z M0 -70 m-26 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0'
			}
			fill={cor}
			stroke={contorno}
			strokeWidth={2 / s}
		/>
	</g>
);

const Xadrez: React.FC<P> = ({f}) => {
	const hz = CY - 120;
	const linhas = 8;
	const proj = (u: number, v: number) => {
		// u: -1..1 horizontal, v: 0 (fundo) ..1 (frente)
		const z = 0.25 + v * 0.75;
		return {x: CX + u * 900 * z, y: hz + v * 560};
	};
	const quads = [];
	for (let i = 0; i < linhas; i++)
		for (let j = 0; j < linhas; j++) {
			if ((i + j) % 2) continue;
			const a = proj(-1 + (j / linhas) * 2, i / linhas);
			const b = proj(-1 + ((j + 1) / linhas) * 2, i / linhas);
			const c = proj(-1 + ((j + 1) / linhas) * 2, (i + 1) / linhas);
			const d = proj(-1 + (j / linhas) * 2, (i + 1) / linhas);
			quads.push(<path key={`${i}-${j}`} d={`M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y} Z`} fill={COR.creme} opacity={0.07 * prog(f, i * 3, i * 3 + 20)} />);
		}
	const mov = prog(f, 25, 60);
	const rei = proj(0, 0.45);
	const p1 = proj(-0.5 + mov * 0.25, 0.75);
	const p2 = proj(0.5 - mov * 0.25, 0.75);
	return (
		<Svg>
			{quads}
			<circle cx={rei.x} cy={rei.y - 120} r={260} fill="url(#halo)" opacity={0.4} />
			<Peca x={rei.x} y={rei.y} s={1.4} rei cor="#120606" contorno={COR.vermelho} />
			<Peca x={p1.x} y={p1.y} s={1.6} cor="#0c0b0b" contorno={COR.creme} />
			<Peca x={p2.x} y={p2.y} s={1.6} cor="#0c0b0b" contorno={COR.creme} />
		</Svg>
	);
};

const Porta: React.FC<P> = ({f}) => {
	const abre = prog(f, 10, 70);
	const px = CX - 160;
	const py = CY - 330;
	const pw = 320;
	const ph = 620;
	const larguraFolha = pw * (1 - abre * 0.75);
	return (
		<Svg>
			<rect x={0} y={py + ph} width={W} height={2} fill={COR.creme} opacity={0.12} />
			{/* luz no chão */}
			<path d={`M${px} ${py + ph} L${px + pw} ${py + ph} L${px + pw + 500 * abre} ${H} L${px - 260 * abre} ${H} Z`} fill="url(#feixe)" opacity={abre} />
			<rect x={px} y={py} width={pw} height={ph} fill="#fff1d6" opacity={0.85 * abre} filter="url(#brilhoForte)" />
			<rect x={px} y={py} width={pw} height={ph} fill="none" stroke={COR.creme} strokeWidth={4} />
			{/* folha da porta */}
			<path d={`M${px} ${py} L${px + larguraFolha} ${py + 30 * abre} L${px + larguraFolha} ${py + ph - 30 * abre} L${px} ${py + ph} Z`} fill="#0d0b0b" stroke={COR.cinza} strokeWidth={2} />
			{/* pé na porta */}
			<path d={`M${px + larguraFolha - 10} ${py + ph - 10} l70 -30 l30 0 l0 40 l-100 0 Z`} fill="#000" stroke={COR.vermelho} strokeWidth={2} opacity={prog(f, 40, 55)} />
		</Svg>
	);
};

const Escada: React.FC<P> = ({f}) => {
	const degraus = 9;
	const ativo = Math.min(degraus - 1, Math.floor(f / 18));
	return (
		<Svg>
			{Array.from({length: degraus}).map((_, i) => {
				const y = 260 + i * 80;
				const x = 300 + i * 150;
				const aceso = i <= ativo;
				return (
					<g key={i} opacity={1 - i * 0.07}>
						<path d={`M${x} ${y} L${x + 200} ${y} L${x + 200} ${y + 80}`} fill="none" stroke={aceso ? COR.creme : COR.escuro} strokeWidth={4} />
						{i === ativo && <circle cx={x + 100} cy={y - 30} r={20} fill={COR.vermelho} filter="url(#brilhoForte)" />}
						{aceso && (
							<text x={x + 100} y={y + 50} textAnchor="middle" fill={i === ativo ? COR.vermelho : COR.cinza} fontFamily={FONTE.ui} fontSize={22} letterSpacing={3}>
								SIM
							</text>
						)}
					</g>
				);
			})}
		</Svg>
	);
};

const Mesa: React.FC<P> = ({f}) => {
	const afasta = prog(f, 0, 80);
	const d = 280 + afasta * 300;
	return (
		<Svg>
			<path d={`M${CX - 700} ${CY + 260} L${CX + 700} ${CY + 260} L${CX + 520} ${CY + 120} L${CX - 520} ${CY + 120} Z`} fill="#141110" stroke={COR.cinza} strokeWidth={2} />
			<Busto x={CX - d} y={CY - 10} s={1.3} contorno={COR.cinza} />
			<Busto x={CX + d} y={CY - 10} s={1.3} contorno={COR.vermelho} espelhar />
			<line x1={CX - d + 150} y1={CY - 230} x2={CX + d - 150} y2={CY - 230} stroke={COR.vermelho} strokeWidth={1.5} strokeDasharray="8 10" />
			<text x={CX} y={CY - 250} textAnchor="middle" fill={COR.vermelho} fontFamily={FONTE.ui} fontSize={22} letterSpacing={6}>
				{Math.round(3 + afasta * 4)} DIAS SEM FALAR
			</text>
		</Svg>
	);
};

const Cerebro: React.FC<P> = ({f}) => {
	const lobos = [
		{cx: -120, cy: -60, r: 150},
		{cx: 90, cy: -90, r: 160},
		{cx: 200, cy: 40, r: 120},
		{cx: -10, cy: 50, r: 150},
		{cx: -200, cy: 60, r: 110},
	];
	const pulso = 0.5 + 0.5 * Math.sin(f / 6);
	return (
		<Svg>
			<g transform={`translate(${CX} ${CY})`}>
				<clipPath id="cerebroClip">
					{lobos.map((l, i) => (
						<circle key={i} cx={l.cx} cy={l.cy} r={l.r} />
					))}
				</clipPath>
				{lobos.map((l, i) => (
					<circle key={i} cx={l.cx} cy={l.cy} r={l.r} fill="#0f0d0d" stroke={COR.creme} strokeOpacity={0.5} strokeWidth={2} {...desenho(prog(f, i * 5, 30 + i * 5))} />
				))}
				<g clipPath="url(#cerebroClip)">
					{Array.from({length: 22}).map((_, i) => {
						const y = -260 + i * 24;
						let d = `M-340 ${y}`;
						for (let x = -340; x < 340; x += 40) d += ` Q${x + 20} ${y + (random(`cv${i}${x}`) - 0.5) * 50} ${x + 40} ${y}`;
						return <path key={i} d={d} fill="none" stroke={COR.creme} strokeOpacity={0.12} strokeWidth={2} />;
					})}
					<circle cx={-60} cy={-40} r={90 + pulso * 30} fill={COR.vermelho} opacity={(0.3 + 0.4 * pulso) * prog(f, 25, 40)} filter="url(#brilhoForte)" />
					<circle cx={120} cy={10} r={50 + pulso * 20} fill={COR.vermelho} opacity={(0.25 + 0.35 * pulso) * prog(f, 35, 50)} filter="url(#brilhoForte)" />
				</g>
			</g>
			<line x1={CX - 60} y1={CY - 40} x2={CX - 520} y2={CY - 300} stroke={COR.vermelho} strokeWidth={1.5} {...desenho(prog(f, 45, 65))} />
			<Rotulo x={CX - 530} y={CY - 315} t="CÓRTEX CINGULADO ANTERIOR" f={f} atraso={60} anchor="end" cor={COR.vermelho} />
			<Rotulo x={CX - 530} y={CY - 285} t="(DOR SOCIAL = DOR FÍSICA)" f={f} atraso={75} anchor="end" />
		</Svg>
	);
};

const Onda: React.FC<P> = ({f, dur}) => {
	const morre = interpolate(f, [dur * 0.25, dur * 0.85], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const n = 90;
	return (
		<Svg>
			{Array.from({length: n}).map((_, i) => {
				const x = 260 + i * 16;
				const env = Math.sin((i / n) * Math.PI);
				const a = (20 + 220 * Math.abs(Math.sin(i * 0.7 + f / 3) * Math.sin(i * 0.23 - f / 7))) * env * morre + 2;
				return <rect key={i} x={x} y={CY - a / 2} width={8} height={a} rx={4} fill={i % 7 === 0 ? COR.vermelho : COR.creme} opacity={0.85} />;
			})}
			<text x={CX} y={CY + 230} textAnchor="middle" fill={COR.cinza} fontFamily={FONTE.ui} fontSize={22} letterSpacing={8} opacity={1 - morre}>
				— 00:00 —
			</text>
		</Svg>
	);
};

const Espelho: React.FC<P> = ({f}) => {
	const atraso = 6;
	const mov = (t: number) => Math.sin(t / 22) * 40;
	return (
		<Svg>
			<line x1={CX} y1={120} x2={CX} y2={H - 120} stroke={COR.creme} strokeWidth={2} opacity={0.6} {...desenho(prog(f, 0, 30))} filter="url(#brilho)" />
			<rect x={CX} y={120} width={W / 2} height={H - 240} fill={COR.vermelho} opacity={0.04} />
			<Busto x={CX - 330 + mov(f)} y={CY + 60} s={1.7} contorno={COR.creme} />
			<Busto x={CX + 330 - mov(f - atraso)} y={CY + 60} s={1.7} contorno={COR.vermelho} espelhar op={0.95} />
			{/* sorriso que só o reflexo dá */}
			<path
				d={`M${CX + 330 - mov(f - atraso) - 30} ${CY - 30} Q${CX + 330 - mov(f - atraso)} ${CY - 30 + 25 * prog(f, 50, 70)} ${CX + 330 - mov(f - atraso) + 30} ${CY - 30}`}
				fill="none"
				stroke={COR.vermelho}
				strokeWidth={3}
				opacity={prog(f, 50, 70)}
				filter="url(#brilho)"
			/>
		</Svg>
	);
};

const Mascara: React.FC<P> = ({f}) => {
	const rot = Math.sin(f / 40) * 8;
	return (
		<Svg>
			<circle cx={CX} cy={CY} r={480} fill="url(#halo)" opacity={0.3} />
			<g transform={`rotate(${rot} ${CX} ${CY}) translate(${CX} ${CY})`}>
				<path
					d="M0 -330 C 190 -330 250 -170 240 -20 C 230 150 130 320 0 340 C -130 320 -230 150 -240 -20 C -250 -170 -190 -330 0 -330 Z"
					fill="#d8d1c3"
					stroke={COR.creme}
					strokeWidth={3}
				/>
				<path d="M0 -330 C 190 -330 250 -170 240 -20 C 230 150 130 320 0 340 Z" fill="#000" opacity={0.35} />
				<ellipse cx={-90} cy={-40} rx={52} ry={26} fill="#050505" />
				<ellipse cx={90} cy={-40} rx={52} ry={26} fill="#050505" />
				<circle cx={-90} cy={-40} r={6} fill={COR.vermelho} opacity={prog(f, 30, 45)} filter="url(#brilho)" />
				<circle cx={90} cy={-40} r={6} fill={COR.vermelho} opacity={prog(f, 30, 45)} filter="url(#brilho)" />
				<path d="M60 -320 L40 -220 L80 -150 L50 -60" fill="none" stroke="#3a3430" strokeWidth={3} {...desenho(prog(f, 20, 60))} />
			</g>
		</Svg>
	);
};

const Tesoura: React.FC<P> = ({f}) => {
	const corte = 45;
	const cortou = f > corte;
	const queda = Math.max(0, f - corte);
	const xs = [CX - 300, CX - 150, CX, CX + 150, CX + 300];
	const lamina = prog(f, 20, corte);
	return (
		<Svg>
			{xs.map((x, i) => (
				<g key={i}>
					<line x1={x} y1={0} x2={x} y2={CY} stroke={COR.vermelho} strokeWidth={2} filter="url(#brilho)" />
					<line
						x1={x}
						y1={CY + (cortou ? queda * queda * 0.4 : 0)}
						x2={x + (cortou ? (random('q' + i) - 0.5) * queda * 2 : 0)}
						y2={H + (cortou ? queda * queda * 0.4 : 0)}
						stroke={COR.vermelho}
						strokeWidth={2}
						opacity={cortou ? Math.max(0, 1 - queda / 40) : 1}
					/>
				</g>
			))}
			<line x1={CX - 500} y1={CY} x2={CX - 500 + 1000 * lamina} y2={CY} stroke="#fff" strokeWidth={3} opacity={cortou ? Math.max(0, 1 - queda / 10) : 0.9} filter="url(#brilhoForte)" />
			<g transform={`translate(${CX - 500 + 1000 * lamina} ${CY})`} opacity={1 - prog(f, corte + 5, corte + 20)}>
				<path d="M0 0 L-160 -22 L-150 0 Z" fill={COR.creme} />
				<path d="M0 0 L-160 22 L-150 0 Z" fill={COR.cinza} />
				<circle cx={-190} cy={-30} r={26} fill="none" stroke={COR.creme} strokeWidth={6} />
				<circle cx={-190} cy={30} r={26} fill="none" stroke={COR.cinza} strokeWidth={6} />
			</g>
		</Svg>
	);
};

const Luz: React.FC<P> = ({f}) => {
	const a = prog(f, 0, 60);
	return (
		<Svg>
			<path d={`M${CX - 80} 0 L${CX + 80} 0 L${CX + 420} ${H} L${CX - 420} ${H} Z`} fill="url(#feixe)" opacity={a} />
			{Array.from({length: 40}).map((_, i) => {
				const x = CX + (random('lx' + i) - 0.5) * 600;
				const y = ((random('ly' + i) * H + f * (0.3 + random('lv' + i))) % H);
				return <circle key={i} cx={x} cy={y} r={1 + random('lr' + i) * 2.5} fill="#fff1d6" opacity={0.5 * a} />;
			})}
			<g transform={`translate(${CX} ${CY + 140})`} opacity={prog(f, 10, 40)}>
				<circle cx={0} cy={-260} r={48} fill="#060505" stroke="#fff1d6" strokeOpacity={0.7} strokeWidth={2} />
				<path d="M-70 -200 L70 -200 L95 60 L55 60 L40 300 L-40 300 L-55 60 L-95 60 Z" fill="#060505" stroke="#fff1d6" strokeOpacity={0.7} strokeWidth={2} />
			</g>
			<ellipse cx={CX} cy={CY + 450} rx={260} ry={30} fill="#fff1d6" opacity={0.18 * a} />
		</Svg>
	);
};


// ───────── episódio 2: narcisismo ─────────

// Narciso olhando o próprio reflexo na água
const Lago: React.FC<P> = ({f}) => {
	const agua = CY - 10;
	return (
		<Svg>
			<clipPath id="acimaAgua">
				<rect x={0} y={0} width={W} height={agua} />
			</clipPath>
			<clipPath id="abaixoAgua">
				<rect x={0} y={agua} width={W} height={H} />
			</clipPath>
			<rect x={0} y={agua} width={W} height={H - agua} fill="#0b0a0d" />
			{/* figura de pé na margem */}
			<g clipPath="url(#acimaAgua)" opacity={prog(f, 0, 25)}>
				<g transform={`translate(${CX} ${agua - 168}) scale(1.4)`}>
					<path d={BUSTO} transform="translate(-100 -140)" fill="#050404" stroke={COR.cinza} strokeWidth={1.5} />
				</g>
			</g>
			{/* reflexo invertido e ondulado */}
			<g clipPath="url(#abaixoAgua)" opacity={0.85 * prog(f, 10, 40)}>
				<g transform={`translate(${CX + Math.sin(f / 10) * 6} ${agua + 168}) scale(1.4 -1.4)`} style={{filter: 'blur(1.5px)'}}>
					<path d={BUSTO} transform="translate(-100 -140)" fill={COR.vermelhoEscuro} stroke={COR.vermelho} strokeWidth={2} />
				</g>
				<g filter="url(#brilho)" opacity={prog(f, 30, 50)}>
					<ellipse cx={CX - 28} cy={agua + 168 + 92} rx={11} ry={4} fill="#ff3b3b" />
					<ellipse cx={CX + 28} cy={agua + 168 + 92} rx={11} ry={4} fill="#ff3b3b" />
				</g>
				{Array.from({length: 14}).map((_, i) => (
					<rect key={i} x={0} y={agua + 12 + i * 28 + Math.sin(f / 8 + i) * 4} width={W} height={3} fill="#0b0a0d" opacity={0.8} />
				))}
			</g>
			{/* ondulações concêntricas */}
			{[0, 1, 2, 3].map((k) => {
				const t = ((f + k * 22) % 88) / 88;
				return <ellipse key={k} cx={CX + 60} cy={agua + 40} rx={60 + t * 520} ry={(60 + t * 520) * 0.12} fill="none" stroke={COR.creme} strokeWidth={2} opacity={(1 - t) * 0.5} />;
			})}
			<line x1={0} y1={agua} x2={W} y2={agua} stroke={COR.creme} strokeOpacity={0.3} strokeWidth={1.5} {...desenho(prog(f, 0, 30))} />
			<Rotulo x={CX + 240} y={agua - 300} t="NARKISSOS — MITO GREGO" f={f} atraso={30} />
		</Svg>
	);
};

const COROA = 'M-170 60 L-200 -90 L-100 -10 L0 -130 L100 -10 L200 -90 L170 60 Z';
const Coroa: React.FC<P> = ({f}) => {
	const sobe = prog(f, 0, 40);
	const flut = Math.sin(f / 20) * 12;
	return (
		<Svg>
			<circle cx={CX} cy={CY - 40} r={520} fill="url(#halo)" opacity={0.5} />
			{Array.from({length: 24}).map((_, i) => {
				const a = (i / 24) * Math.PI * 2 + f / 300;
				return (
					<line
						key={i}
						x1={CX + Math.cos(a) * 280}
						y1={CY - 40 + Math.sin(a) * 280}
						x2={CX + Math.cos(a) * (280 + 160 * sobe)}
						y2={CY - 40 + Math.sin(a) * (280 + 160 * sobe)}
						stroke={COR.ouro}
						strokeOpacity={0.25}
						strokeWidth={2}
					/>
				);
			})}
			<g transform={`translate(${CX} ${CY - 40 + (1 - sobe) * 120 + flut}) scale(1.5)`}>
				<path d={COROA} fill="#120c04" stroke={COR.ouro} strokeWidth={3} filter="url(#brilho)" {...desenho(prog(f, 0, 45))} />
				<rect x={-170} y={60} width={340} height={36} fill="#120c04" stroke={COR.ouro} strokeWidth={3} />
				{[-200, 0, 200].map((x, i) => (
					<circle key={x} cx={x} cy={i === 1 ? -140 : -100} r={14} fill={COR.vermelho} filter="url(#brilho)" opacity={prog(f, 30 + i * 6, 45 + i * 6)} />
				))}
			</g>
			{/* pedestal / plateia pequena embaixo */}
			{Array.from({length: 9}).map((_, i) => (
				<g key={i} transform={`translate(${CX - 640 + i * 160} ${CY + 380}) scale(0.45) translate(-100 -140)`} opacity={0.5 * prog(f, 20 + i * 3, 40 + i * 3)}>
					<path d={BUSTO} fill="#070606" stroke={COR.cinza} strokeWidth={3} />
				</g>
			))}
		</Svg>
	);
};

const Cronometro: React.FC<P> = ({f, dur}) => {
	const total = 300;
	const restante = Math.max(0, Math.round(total - (f / Math.max(dur, 1)) * 40));
	const mm = Math.floor(restante / 60);
	const ss = String(restante % 60).padStart(2, '0');
	const R = 300;
	const frac = restante / total;
	const circ = 2 * Math.PI * R;
	return (
		<Svg>
			<circle cx={CX} cy={CY} r={R + 80} fill="url(#halo)" opacity={0.3} />
			{Array.from({length: 60}).map((_, i) => {
				const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
				const r1 = R + 30;
				const r2 = R + (i % 5 === 0 ? 70 : 48);
				return <line key={i} x1={CX + Math.cos(a) * r1} y1={CY + Math.sin(a) * r1} x2={CX + Math.cos(a) * r2} y2={CY + Math.sin(a) * r2} stroke={COR.creme} strokeOpacity={i % 5 === 0 ? 0.6 : 0.2} strokeWidth={i % 5 === 0 ? 3 : 1.5} />;
			})}
			<circle cx={CX} cy={CY} r={R} fill="none" stroke={COR.escuro} strokeWidth={14} />
			<circle
				cx={CX}
				cy={CY}
				r={R}
				fill="none"
				stroke={COR.vermelho}
				strokeWidth={14}
				strokeLinecap="round"
				strokeDasharray={`${circ * frac * prog(f, 0, 30)} ${circ}`}
				transform={`rotate(-90 ${CX} ${CY})`}
				filter="url(#brilho)"
			/>
			<text x={CX} y={CY + 50} textAnchor="middle" fill={COR.creme} fontFamily={FONTE.titulo} fontWeight={700} fontSize={170} opacity={prog(f, 5, 20)}>
				{mm}:{ss}
			</text>
			<Rotulo x={CX} y={CY + 130} t="PRIMEIRA IMPRESSÃO" f={f} atraso={15} anchor="middle" />
		</Svg>
	);
};

// Balança da conversa: "eu" pesa muito mais que "você"
const Balanca: React.FC<P> = ({f}) => {
	const inclina = interpolate(prog(f, 15, 70), [0, 1], [0, 16]) + Math.sin(f / 15) * 0.8;
	const a = (inclina * Math.PI) / 180;
	const L = 420;
	const py = CY - 150;
	const esq = {x: CX - Math.cos(a) * L, y: py + Math.sin(a) * L};
	const dir = {x: CX + Math.cos(a) * L, y: py - Math.sin(a) * L};
	const prato = (p: {x: number; y: number}, txt: string, n: number, cor: string) => (
		<g>
			<line x1={p.x} y1={p.y} x2={p.x - 110} y2={p.y + 200} stroke={COR.cinza} strokeWidth={2} />
			<line x1={p.x} y1={p.y} x2={p.x + 110} y2={p.y + 200} stroke={COR.cinza} strokeWidth={2} />
			<path d={`M${p.x - 140} ${p.y + 200} Q${p.x} ${p.y + 270} ${p.x + 140} ${p.y + 200} Z`} fill="#141110" stroke={COR.creme} strokeWidth={2.5} />
			{Array.from({length: n}).map((_, i) => (
				<text key={i} x={p.x - 70 + (i % 3) * 70} y={p.y + 190 - Math.floor(i / 3) * 52} textAnchor="middle" fontFamily={FONTE.titulo} fontWeight={700} fontSize={40} fill={cor} opacity={prog(f, 10 + i * 4, 20 + i * 4)}>
					{txt}
				</text>
			))}
		</g>
	);
	return (
		<Svg>
			<path d={`M${CX - 160} ${CY + 330} L${CX + 160} ${CY + 330} L${CX + 20} ${py} L${CX - 20} ${py} Z`} fill="#0f0d0c" stroke={COR.creme} strokeWidth={2} />
			<line x1={esq.x} y1={esq.y} x2={dir.x} y2={dir.y} stroke={COR.creme} strokeWidth={8} strokeLinecap="round" />
			<circle cx={CX} cy={py} r={18} fill={COR.vermelho} filter="url(#brilho)" />
			{prato(esq, 'EU', 9, COR.vermelho)}
			{prato(dir, 'você', 1, COR.cinza)}
		</Svg>
	);
};

const MAPA: Record<Visual, React.FC<P>> = {
	lago: Lago,
	coroa: Coroa,
	cronometro: Cronometro,
	balanca: Balanca,
	olho: Olho,
	marionete: Marionete,
	casal: Casal,
	vazio: Vazio,
	laboratorio: Laboratorio,
	alavanca: Alavanca,
	'caca-niquel': CacaNiquel,
	celular: Celular,
	grafico: Grafico,
	lampiao: Lampiao,
	sussurros: Sussurros,
	'espelho-quebrado': EspelhoQuebrado,
	caderno: Caderno,
	petalas: Petalas,
	correntes: Correntes,
	coracao: Coracao,
	triangulo: Triangulo,
	xadrez: Xadrez,
	porta: Porta,
	escada: Escada,
	mesa: Mesa,
	cerebro: Cerebro,
	onda: Onda,
	espelho: Espelho,
	mascara: Mascara,
	tesoura: Tesoura,
	luz: Luz,
};

export const VisualCena: React.FC<{nome: Visual} & P> = ({nome, f, dur}) => {
	const C = MAPA[nome];
	return <C f={f} dur={dur} />;
};
