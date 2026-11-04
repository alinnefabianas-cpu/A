// Reels "Intercâmbio linguístico em Vichy – 2027" (Aliança Francesa de João Pessoa)
// 1080x1920, 30fps. 120 BPM: 1 batida = 15 frames. Cortes caem no início de compasso.
import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// ---------- tema ----------
const C = {
	navy: '#1B2A5E',
	navyEsc: '#121C42',
	azul: '#0055A4',
	vermelho: '#E1323C',
	marfim: '#F6F0E4',
	branco: '#FFFFFF',
	agua1: '#0B3D7A',
	agua2: '#2A8FD0',
	dourado: '#F2C14E',
};
const SERIF = '"Playfair Display", serif';
const SANS = 'Montserrat, sans-serif';

// ---------- linha do tempo (frames) ----------
export const CENAS = {
	gancho: [0, 90],
	vichy: [90, 225],
	semanas: [225, 330],
	meses: [330, 465],
	agua: [465, 600],
	cta: [600, 735],
	logos: [735, 840],
} as const;
export const DURACAO = 840;

// ---------- utilitários ----------
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const lerp = (f: number, a: number, b: number, from = 0, to = 1, e = ease) =>
	interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

const usePop = (delay: number, damping = 12) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: f - delay, fps, config: {damping, mass: 0.6, stiffness: 140}});
};

// Texto que sobe por trás de uma máscara
const Sobe: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d, children, style}) => {
	const f = useCurrentFrame();
	const p = lerp(f, d, d + 14);
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
			<div style={{transform: `translateY(${(1 - p) * 110}%)`, opacity: p > 0 ? 1 : 0}}>{children}</div>
		</div>
	);
};

// Logo branco (PNG transparente) recolorido via máscara
const LogoAF: React.FC<{cor: string; largura: number}> = ({cor, largura}) => (
	<div
		style={{
			width: largura,
			height: (largura * 1019) / 1499,
			backgroundColor: cor,
			WebkitMaskImage: `url(${staticFile('logos/af-joao-pessoa.png')})`,
			WebkitMaskSize: 'contain',
			WebkitMaskRepeat: 'no-repeat',
			WebkitMaskPosition: 'center',
		}}
	/>
);

const Bandeira: React.FC<{w: number}> = ({w}) => (
	<div style={{display: 'inline-flex', width: w, height: w * 0.66, borderRadius: w * 0.08, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,.18)', verticalAlign: 'middle'}}>
		<div style={{flex: 1, background: C.azul}} />
		<div style={{flex: 1, background: C.branco}} />
		<div style={{flex: 1, background: C.vermelho}} />
	</div>
);

const Aviao: React.FC<{size: number; cor?: string}> = ({size, cor = C.vermelho}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		<path
			fill={cor}
			d="M21.5 15.5v-2l-8-5V3a1.5 1.5 0 0 0-3 0v5.5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-6l8 2.5z"
		/>
	</svg>
);

const Brilho: React.FC<{x: number; y: number; s: number; d: number; cor?: string}> = ({x, y, s, d, cor = C.dourado}) => {
	const f = useCurrentFrame();
	const t = (f - d) / 30;
	const k = t < 0 ? 0 : Math.max(0, Math.sin(t * 2.6)) ** 2;
	return (
		<svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${k}) rotate(${t * 40}deg)`}} width={s} height={s} viewBox="-10 -10 20 20">
			<path d="M0-10C1 -2 2-1 10 0 2 1 1 2 0 10-1 2-2 1-10 0-2-1-1-2 0-10z" fill={cor} />
		</svg>
	);
};

// Grão de papel / filme leve
const Grao: React.FC<{op?: number}> = ({op = 0.07}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url(${staticFile('grao.png')})`,
				backgroundPosition: `${(f * 137) % 512}px ${(f * 71) % 512}px`,
				opacity: op,
				mixBlendMode: 'multiply',
				pointerEvents: 'none',
			}}
		/>
	);
};

// Transição: faixas azul/branco/vermelho cruzando a tela na diagonal, centradas no corte
const Swipe: React.FC<{em: number}> = ({em}) => {
	const f = useCurrentFrame();
	const r = f - em;
	if (r < -9 || r > 10) return null;
	const cores = [C.azul, C.branco, C.vermelho];
	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			{cores.map((c, i) => {
				const ini = -9 + i * 1.5;
				const x = interpolate(r, [ini, ini + 17], [-2600, 2600], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.6, 0, 0.3, 1),
				});
				return (
					<div
						key={c}
						style={{
							position: 'absolute',
							left: x - 700,
							top: -600,
							width: 1500,
							height: 3200,
							background: c,
							transform: 'rotate(18deg)',
							boxShadow: '0 0 40px rgba(0,0,0,.15)',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------- cena 1: gancho ----------
const Balao: React.FC<{txt: string; x: number; y: number; d: number; rot: number; cor: string; fundo: string}> = ({txt, x, y, d, rot, cor, fundo}) => {
	const f = useCurrentFrame();
	const p = usePop(d, 9);
	const bob = Math.sin((f + d * 7) / 14) * 10;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y + bob,
				transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`,
				background: fundo,
				color: cor,
				fontFamily: SERIF,
				fontStyle: 'italic',
				fontWeight: 700,
				fontSize: 50,
				padding: '16px 34px 22px',
				borderRadius: 40,
				boxShadow: '0 12px 30px rgba(0,0,0,.25)',
				whiteSpace: 'nowrap',
			}}
		>
			{txt}
			<div style={{position: 'absolute', bottom: -16, left: 44, width: 34, height: 34, background: fundo, transform: 'rotate(45deg)', borderRadius: 6}} />
		</div>
	);
};

const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	const sub = lerp(f, 38, 54);
	const zoom = 1 + f * 0.0012;
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, #2A3F86 0%, ${C.navy} 55%, ${C.navyEsc} 100%)`}}>
			<Balao txt="Bonjour !" x={290} y={430} d={4} rot={-6} cor={C.navy} fundo={C.branco} />
			<Balao txt="ça va ?" x={810} y={560} d={10} rot={5} cor={C.branco} fundo={C.vermelho} />
			<Balao txt="merci !" x={250} y={1470} d={16} rot={4} cor={C.branco} fundo={C.azul} />
			<Balao txt="à bientôt" x={790} y={1380} d={22} rot={-5} cor={C.navy} fundo={C.marfim} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${zoom})`}}>
				<div style={{textAlign: 'center', marginTop: 40}}>
					<Sobe d={6} style={{fontFamily: SANS, fontWeight: 800, fontSize: 86, color: C.branco, letterSpacing: -1}}>
						Quer estudar
					</Sobe>
					<Sobe d={12} style={{fontFamily: SANS, fontWeight: 800, fontSize: 86, color: C.branco, letterSpacing: -1}}>
						francês
					</Sobe>
					<Sobe d={22} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 160, color: C.branco, lineHeight: 1.05}}>
						na França?
					</Sobe>
					<div style={{height: 14, margin: '6px auto 0', width: 560 * sub, display: 'flex', borderRadius: 8, overflow: 'hidden'}}>
						<div style={{flex: 1, background: C.azul}} />
						<div style={{flex: 1, background: C.branco}} />
						<div style={{flex: 1, background: C.vermelho}} />
					</div>
				</div>
			</AbsoluteFill>
			<Grao op={0.05} />
		</AbsoluteFill>
	);
};

// ---------- cena 2: Vichy 2027 + rota ----------
const Carimbo: React.FC<{d: number}> = ({d}) => {
	const f = useCurrentFrame();
	const p = usePop(d, 8);
	const s = interpolate(p, [0, 1], [2.4, 1]);
	return (
		<div style={{position: 'absolute', right: 60, top: 640, transform: `scale(${s}) rotate(${-14 + (f - d) * 0.15}deg)`, opacity: Math.min(1, p * 1.5)}}>
			<svg width={260} height={260} viewBox="0 0 200 200">
				<defs>
					<path id="circ" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
				</defs>
				<circle cx={100} cy={100} r={94} fill="none" stroke={C.vermelho} strokeWidth={5} />
				<circle cx={100} cy={100} r={58} fill="none" stroke={C.vermelho} strokeWidth={3} />
				<text fill={C.vermelho} fontFamily={SANS} fontWeight={800} fontSize={19} letterSpacing={4}>
					<textPath href="#circ">VICHY • FRANCE • CAVILAM • 2027 •</textPath>
				</text>
				<g transform="translate(100,100) rotate(-35) translate(-24,-24)">
					<path transform="scale(2)" fill={C.vermelho} d="M21.5 15.5v-2l-8-5V3a1.5 1.5 0 0 0-3 0v5.5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-6l8 2.5z" />
				</g>
			</svg>
		</div>
	);
};

const Rota: React.FC<{d: number}> = ({d}) => {
	const f = useCurrentFrame();
	// curva quadrática de João Pessoa (P0) até Vichy (P2)
	const P0 = [150, 300], P1 = [520, -60], P2 = [900, 230];
	const t = lerp(f, d + 6, d + 70, 0, 1, Easing.bezier(0.45, 0, 0.25, 1));
	const pt = (u: number) => [
		(1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u ** 2 * P2[0],
		(1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u ** 2 * P2[1],
	];
	const [x, y] = pt(t);
	const [x2, y2] = pt(Math.min(1, t + 0.01));
	const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI + 90;
	const comp = 1150; // comprimento aproximado
	const pin = (d2: number) => usePop(d2, 9);
	const a = pin(d);
	const b = pin(d + 66);
	return (
		<div style={{position: 'absolute', left: 0, top: 1020, width: 1080, height: 420}}>
			<svg width={1080} height={420} style={{position: 'absolute', overflow: 'visible'}}>
				<path
					d={`M${P0} Q${P1} ${P2}`}
					fill="none"
					stroke={C.navy}
					strokeWidth={6}
					strokeDasharray="4 18"
					strokeLinecap="round"
					strokeDashoffset={0}
					style={{clipPath: 'none'}}
					opacity={0.35}
				/>
				<path d={`M${P0} Q${P1} ${P2}`} fill="none" stroke={C.vermelho} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${comp * t} ${comp}`} />
				<circle cx={P0[0]} cy={P0[1]} r={18 * a} fill={C.navy} />
				<circle cx={P2[0]} cy={P2[1]} r={18 * b} fill={C.vermelho} />
				<circle cx={P2[0]} cy={P2[1]} r={18 + (f - d - 66) * 1.2} fill="none" stroke={C.vermelho} strokeWidth={3} opacity={f > d + 66 ? Math.max(0, 1 - (f - d - 66) / 30) : 0} />
			</svg>
			<div style={{position: 'absolute', left: x - 50, top: y - 50, transform: `rotate(${ang}deg)`, opacity: t > 0 && t < 1 ? 1 : 0}}>
				<Aviao size={100} cor={C.navy} />
			</div>
			<div style={{position: 'absolute', left: P0[0] - 140, top: P0[1] + 34, width: 280, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.navy, opacity: a}}>
				João Pessoa
			</div>
			<div style={{position: 'absolute', left: P2[0] - 140, top: P2[1] + 34, width: 280, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.vermelho, opacity: b}}>
				Vichy
			</div>
		</div>
	);
};

const CenaVichy: React.FC = () => {
	const f = useCurrentFrame();
	const pill = usePop(4);
	const ano = usePop(30, 10);
	return (
		<AbsoluteFill style={{background: C.marfim}}>
			<Carimbo d={40} />
			<div style={{position: 'absolute', top: 330, left: 80, right: 80}}>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 18,
						background: C.navy,
						color: C.branco,
						fontFamily: SANS,
						fontWeight: 800,
						fontSize: 34,
						letterSpacing: 3,
						padding: '16px 30px',
						borderRadius: 60,
						transform: `scale(${pill})`,
						transformOrigin: 'left center',
					}}
				>
					<Bandeira w={46} /> INTERCÂMBIO LINGUÍSTICO
				</div>
				<Sobe d={10} style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 300, color: C.navy, lineHeight: 1, marginTop: 30, marginLeft: -10}}>
					Vichy
				</Sobe>
				<div
					style={{
						fontFamily: SANS,
						fontWeight: 900,
						fontSize: 230,
						lineHeight: 0.9,
						color: 'transparent',
						WebkitTextStroke: `6px ${C.vermelho}`,
						transform: `translateX(${(1 - ano) * -300}px)`,
						opacity: Math.min(1, ano * 2),
						position: 'relative',
					}}
				>
					2027
					<div
						style={{
							position: 'absolute',
							inset: 0,
							color: C.vermelho,
							WebkitTextStroke: '0px',
							clipPath: `inset(${100 - lerp(f, 48, 80) * 100}% 0 0 0)`,
						}}
					>
						2027
					</div>
				</div>
			</div>
			<Rota d={36} />
			<Grao op={0.09} />
		</AbsoluteFill>
	);
};

// ---------- cena 3: duas ou três semanas ----------
const CenaSemanas: React.FC = () => {
	const f = useCurrentFrame();
	const n2 = usePop(4, 9);
	const ou = usePop(12, 9);
	const n3 = usePop(18, 9);
	const fundoX = f * 1.2;
	return (
		<AbsoluteFill style={{background: C.vermelho, overflow: 'hidden'}}>
			{/* listras diagonais suaves */}
			<AbsoluteFill
				style={{
					backgroundImage: 'repeating-linear-gradient(-30deg, rgba(255,255,255,.06) 0 40px, transparent 40px 120px)',
					backgroundPosition: `${fundoX}px 0`,
				}}
			/>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: C.branco}}>
				<Sobe d={0} style={{fontFamily: SANS, fontWeight: 700, fontSize: 52, letterSpacing: 2}}>
					POR
				</Sobe>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, fontFamily: SANS, fontWeight: 900, lineHeight: 1}}>
					<span style={{fontSize: 400, transform: `scale(${n2}) rotate(${(1 - n2) * -30}deg)`, display: 'inline-block'}}>2</span>
					<span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 120, transform: `scale(${ou})`, display: 'inline-block'}}>ou</span>
					<span style={{fontSize: 400, transform: `scale(${n3}) rotate(${(1 - n3) * 30}deg)`, display: 'inline-block'}}>3</span>
				</div>
				<Sobe d={26} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 170, lineHeight: 1, marginTop: -20}}>
					semanas
				</Sobe>
				<div style={{marginTop: 60, display: 'flex', alignItems: 'center', gap: 22, opacity: lerp(f, 42, 56), transform: `translateY(${(1 - lerp(f, 42, 56)) * 30}px)`}}>
					<span style={{fontFamily: SANS, fontWeight: 700, fontSize: 50}}>estudando francês na França</span>
					<Bandeira w={70} />
				</div>
			</AbsoluteFill>
			<Grao op={0.06} />
		</AbsoluteFill>
	);
};

// ---------- cena 4: meses ----------
const CartaoMes: React.FC<{mes: string; d: number; rot: number; y: number}> = ({mes, d, rot, y}) => {
	const f = useCurrentFrame();
	const p = usePop(d, 11);
	const flutua = Math.sin((f - d) / 18) * 6;
	return (
		<div
			style={{
				width: 820,
				height: 230,
				background: C.branco,
				borderRadius: 34,
				boxShadow: '0 22px 50px rgba(27,42,94,.22)',
				display: 'flex',
				overflow: 'hidden',
				transform: `translateY(${(1 - p) * 500 + flutua}px) rotate(${rot * p + (1 - p) * rot * 4}deg)`,
				opacity: p > 0.01 ? 1 : 0,
				marginTop: y,
			}}
		>
			<div style={{width: 200, background: C.navy, color: C.branco, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
				<div style={{position: 'absolute', top: 18, display: 'flex', gap: 60}}>
					<div style={{width: 22, height: 22, borderRadius: 11, background: C.marfim}} />
					<div style={{width: 22, height: 22, borderRadius: 11, background: C.marfim}} />
				</div>
				<div style={{fontFamily: SANS, fontWeight: 900, fontSize: 58, marginTop: 20}}>2027</div>
			</div>
			<div style={{flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 50, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 130, color: C.navy}}>
				{mes}
			</div>
			<div style={{width: 26, background: C.vermelho}} />
		</div>
	);
};

const CenaMeses: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.marfim}}>
			<div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center'}}>
				<Sobe d={2} style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: C.vermelho}}>
					GRUPOS PREVISTOS PARA
				</Sobe>
			</div>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 80}}>
				<CartaoMes mes="junho" d={14} rot={-3} y={0} />
				<CartaoMes mes="julho" d={26} rot={2} y={50} />
				<CartaoMes mes="setembro" d={38} rot={-2} y={50} />
			</AbsoluteFill>
			<div style={{position: 'absolute', bottom: 330, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 44, color: C.navy, opacity: lerp(f, 66, 80)}}>
				Escolha a sua turma ✈︎
			</div>
			<Grao op={0.09} />
		</AbsoluteFill>
	);
};

// ---------- cena 5: CAVILAM, rainha das cidades de água ----------
const Ondas: React.FC = () => {
	const f = useCurrentFrame();
	const onda = (amp: number, len: number, vel: number, base: number) => {
		let d = `M0 ${base}`;
		for (let x = 0; x <= 1080; x += 20) d += ` L${x} ${base + Math.sin(x / len + f * vel) * amp}`;
		return d + ' L1080 1920 L0 1920 Z';
	};
	return (
		<svg width={1080} height={1920} style={{position: 'absolute'}}>
			<path d={onda(26, 90, 0.08, 1530)} fill="rgba(255,255,255,.10)" />
			<path d={onda(20, 70, -0.1, 1590)} fill="rgba(255,255,255,.14)" />
			<path d={onda(16, 110, 0.06, 1660)} fill="rgba(255,255,255,.18)" />
		</svg>
	);
};

const Bolhas: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			{Array.from({length: 18}).map((_, i) => {
				const x = (i * 197) % 1080;
				const vel = 3 + (i % 5);
				const y = 1950 - ((f * vel + i * 211) % 2100);
				const r = 6 + (i % 4) * 5;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x + Math.sin((f + i * 20) / 15) * 14,
							top: y,
							width: r * 2,
							height: r * 2,
							borderRadius: r,
							border: '3px solid rgba(255,255,255,.45)',
						}}
					/>
				);
			})}
		</>
	);
};

const Gota: React.FC<{d: number}> = ({d}) => {
	const f = useCurrentFrame();
	const queda = lerp(f, d, d + 18, -200, 360, Easing.in(Easing.quad));
	const caiu = f >= d + 18;
	const r = f - d - 18;
	return (
		<div style={{position: 'absolute', left: 540, top: 0}}>
			{!caiu && (
				<svg width={90} height={120} viewBox="0 0 30 40" style={{position: 'absolute', left: -45, top: queda}}>
					<path d="M15 0C15 0 2 16 2 25a13 13 0 0 0 26 0C28 16 15 0 15 0z" fill={C.branco} />
					<ellipse cx={10} cy={26} rx={3} ry={5} fill={C.agua2} opacity={0.5} />
				</svg>
			)}
			{caiu &&
				[0, 8, 16].map((k) => {
					const rr = Math.max(0, r - k);
					return (
						<div
							key={k}
							style={{
								position: 'absolute',
								left: -rr * 9,
								top: 450 - rr * 2.4,
								width: rr * 18,
								height: rr * 4.8,
								borderRadius: '50%',
								border: `4px solid rgba(255,255,255,${Math.max(0, 0.7 - rr / 50)})`,
							}}
						/>
					);
				})}
		</div>
	);
};

const CenaAgua: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.agua1} 0%, #1764AE 55%, ${C.agua2} 100%)`, overflow: 'hidden'}}>
			<Bolhas />
			<Ondas />
			<Gota d={0} />
			<div style={{position: 'absolute', top: 620, width: '100%', textAlign: 'center', color: C.branco}}>
				<Sobe d={18} style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.3}}>
					A Aliança Francesa de João Pessoa
					<br />
					leva você para o
				</Sobe>
				<Sobe d={24} style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, lineHeight: 1, letterSpacing: 4}}>
					CAVILAM
				</Sobe>
				<Sobe d={30} style={{fontFamily: SANS, fontWeight: 700, fontSize: 52, marginTop: 8}}>
					Alliance Française · Vichy
				</Sobe>
				<div style={{width: lerp(f, 40, 56) * 220, height: 5, background: C.dourado, margin: '46px auto', borderRadius: 3}} />
				<Sobe d={46} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 84}}>
					a rainha das
				</Sobe>
				<Sobe d={54} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 128, lineHeight: 1.05}}>
					cidades de água
				</Sobe>
			</div>
			<Brilho x={140} y={1170} s={70} d={62} />
			<Brilho x={950} y={1080} s={54} d={70} />
			<Brilho x={880} y={1350} s={40} d={78} cor={C.branco} />
			<Brilho x={210} y={640} s={44} d={58} cor={C.branco} />
			<Grao op={0.04} />
		</AbsoluteFill>
	);
};

// ---------- cena 6: CTA ----------
const Telefone: React.FC<{size: number; cor: string}> = ({size, cor}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		<path
			fill={cor}
			d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"
		/>
	</svg>
);

const CenaCTA: React.FC = () => {
	const f = useCurrentFrame();
	const logo = usePop(2, 12);
	const tel = usePop(40, 10);
	const pulso = 1 + Math.max(0, Math.sin((f - 50) / 6)) * 0.03 * (f > 50 ? 1 : 0);
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 35%, #2A3F86 0%, ${C.navy} 60%, ${C.navyEsc} 100%)`}}>
			<div style={{position: 'absolute', top: 270, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${logo})`}}>
				<LogoAF cor={C.branco} largura={470} />
			</div>
			<div style={{position: 'absolute', top: 700, width: '100%', textAlign: 'center', color: C.branco}}>
				<Sobe d={14} style={{fontFamily: SANS, fontWeight: 800, fontSize: 70}}>
					Todas as informações
				</Sobe>
				<Sobe d={20} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 70, marginTop: 6}}>
					na recepção da
				</Sobe>
				<Sobe d={26} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 92}}>
					Aliança Francesa
				</Sobe>
			</div>
			<div style={{position: 'absolute', top: 1170, width: '100%', display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 26,
						background: C.branco,
						color: C.navy,
						padding: '30px 54px',
						borderRadius: 100,
						fontFamily: SANS,
						fontWeight: 900,
						fontSize: 70,
						transform: `scale(${tel * pulso})`,
						boxShadow: `0 0 0 ${10 + Math.sin(f / 6) * 4}px rgba(225,50,60,.55), 0 20px 50px rgba(0,0,0,.35)`,
					}}
				>
					<div style={{width: 92, height: 92, borderRadius: 46, background: C.vermelho, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Telefone size={54} cor={C.branco} />
					</div>
					(83) 98750-3895
				</div>
			</div>
			<div style={{position: 'absolute', top: 1380, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.dourado, opacity: lerp(f, 62, 76)}}>
				À bientôt en France ! ✨
			</div>
			<Grao op={0.05} />
		</AbsoluteFill>
	);
};

// ---------- cena 7: parceiros ----------
const CenaLogos: React.FC = () => {
	const f = useCurrentFrame();
	const item = (d: number) => {
		const p = usePop(d, 12);
		return {transform: `translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.4)};
	};
	return (
		<AbsoluteFill style={{background: C.branco}}>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 16, display: 'flex'}}>
				<div style={{flex: 1, background: C.azul}} />
				<div style={{flex: 1, background: C.branco}} />
				<div style={{flex: 1, background: C.vermelho}} />
			</div>
			<div style={{position: 'absolute', top: 290, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={item(2)}>
					<LogoAF cor={C.navy} largura={500} />
				</div>
				<div style={{...item(10), marginTop: 40, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.navy, textAlign: 'center', lineHeight: 1.35}}>
					Intercâmbio em Vichy · 2027
					<br />
					<span style={{color: C.vermelho, fontSize: 52, fontWeight: 900}}>(83) 98750-3895</span>
				</div>
				<div style={{...item(18), width: 820, height: 3, background: '#E4E0D8', margin: '70px 0 60px'}} />
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60}}>
					<div style={item(22)}>
						<Img src={staticFile('logos/delf-dalf.png')} style={{width: 330}} />
					</div>
					<div style={item(28)}>
						<Img src={staticFile('logos/francophonie.png')} style={{width: 240}} />
					</div>
				</div>
				<div style={{...item(34), marginTop: 50}}>
					<Img src={staticFile('logos/campus-france.png')} style={{width: 640}} />
				</div>
			</div>
			<AbsoluteFill style={{background: C.branco, opacity: lerp(f, 92, 105)}} />
		</AbsoluteFill>
	);
};

// ---------- montagem ----------
const ORDEM: [keyof typeof CENAS, React.FC][] = [
	['gancho', Gancho],
	['vichy', CenaVichy],
	['semanas', CenaSemanas],
	['meses', CenaMeses],
	['agua', CenaAgua],
	['cta', CenaCTA],
	['logos', CenaLogos],
];

export const Vichy: React.FC = () => {
	return (
		<AbsoluteFill style={{background: C.navy}}>
			{ORDEM.map(([k, Cena]) => (
				<Sequence key={k} from={CENAS[k][0]} durationInFrames={CENAS[k][1] - CENAS[k][0]} name={k}>
					<Cena />
				</Sequence>
			))}
			{ORDEM.slice(1).map(([k]) => (
				<Swipe key={k} em={CENAS[k][0]} />
			))}
			<Audio src={staticFile('audio/trilha.wav')} />
		</AbsoluteFill>
	);
};
