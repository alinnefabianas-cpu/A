import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {COR, FONTE, fadeIO, prog} from './tema';
import {TATICAS, type Estilo} from './roteiro';
import {VisualCena} from './visuais/Visuais';

// ───────── Fundo cinematográfico (grão, vinheta, poeira, flicker, riscos) ─────────
export const Fundo: React.FC = () => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, #1a1414 0%, #0b0909 55%, ${COR.preto} 100%)`}} />
);

export const Acabamento: React.FC = () => {
	const f = useCurrentFrame();
	const passo = Math.floor(f / 2);
	const flicker = random('fl' + passo) * 0.07;
	const risco = random('rk' + passo) > 0.86;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{/* poeira */}
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{Array.from({length: 45}).map((_, i) => {
					const x = (random('dx' + i) * 1920 + f * (random('dv' + i) - 0.5) * 1.2) % 1920;
					const y = (random('dy' + i) * 1080 - f * (0.2 + random('du' + i) * 0.5) + 1080 * 10) % 1080;
					return <circle key={i} cx={x} cy={y} r={0.8 + random('dr' + i) * 2.2} fill="#f3e9d6" opacity={0.08 + 0.25 * random('do' + i)} />;
				})}
				{risco && (
					<line
						x1={random('rx' + passo) * 1920}
						y1={0}
						x2={random('rx' + passo) * 1920 + 4}
						y2={1080}
						stroke="#f3e9d6"
						strokeOpacity={0.12}
						strokeWidth={1 + random('rw' + passo) * 1.5}
					/>
				)}
			</svg>
			{/* grão de filme (Img oculta garante o carregamento antes do frame) */}
			<Img src={staticFile('grao.png')} style={{display: 'none'}} />
			<AbsoluteFill
				style={{
					backgroundImage: `url(${staticFile('grao.png')})`,
					backgroundRepeat: 'repeat',
					backgroundPosition: `${Math.floor(random('gx' + passo) * 768)}px ${Math.floor(random('gy' + passo) * 768)}px`,
					opacity: 0.07,
					mixBlendMode: 'screen',
				}}
			/>
			{/* vinheta */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)'}} />
			<AbsoluteFill style={{background: '#000', opacity: flicker}} />
		</AbsoluteFill>
	);
};

// ───────── Light leak / flash ─────────
export const Vazamento: React.FC<{f: number}> = ({f}) => {
	const a = interpolate(f, [0, 6, 30], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const x = interpolate(f, [0, 30], [10, 80]);
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse at ${x}% 30%, rgba(255,140,60,0.9) 0%, rgba(208,31,42,0.5) 25%, rgba(0,0,0,0) 60%)`,
				mixBlendMode: 'screen',
				opacity: a,
			}}
		/>
	);
};

// ───────── Texto cinético ─────────
const limpa = (w: string) => w.toLowerCase().replace(/[“”"]/g, '');

export const TextoCinetico: React.FC<{texto: string; destaque?: string[]; estilo?: Estilo; f: number; dur: number}> = ({
	texto,
	destaque = [],
	estilo = 'normal',
	f,
	dur,
}) => {
	const palavras = texto.split(/\s+/);
	const set = new Set(destaque.map(limpa));
	const ritmo = estilo === 'grande' ? 5 : estilo === 'fala' ? 4 : 2.6;
	const saida = 1 - prog(f, dur - 12, dur);
	const blurSaida = (1 - saida) * 12;

	const base: React.CSSProperties = {
		position: 'absolute',
		left: 160,
		right: 160,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignContent: 'center',
		textAlign: 'center',
		opacity: saida,
		filter: `blur(${blurSaida}px)`,
	};

	let pos: React.CSSProperties;
	let fonte: React.CSSProperties;
	if (estilo === 'grande') {
		pos = {top: 0, bottom: 0};
		fonte = {fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 104, letterSpacing: 6, textTransform: 'uppercase', lineHeight: 1.15, gap: '0 34px'};
	} else if (estilo === 'fala') {
		pos = {top: 0, bottom: 0};
		fonte = {fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 96, lineHeight: 1.2, gap: '0 26px'};
	} else {
		pos = {bottom: estilo === 'defesa' ? 110 : 120, minHeight: 200};
		fonte = {fontFamily: FONTE.texto, fontSize: 60, lineHeight: 1.3, gap: '0 18px'};
	}

	const zoomLento = estilo === 'grande' ? 1 + f * 0.0012 : 1;
	// tremor RGB para falas ("vozes")
	const glitch = estilo === 'fala' && random('gl' + Math.floor(f / 3)) > 0.75;
	const gx = glitch ? (random('gx' + f) - 0.5) * 14 : 0;

	return (
		<AbsoluteFill>
			{estilo !== 'grande' && estilo !== 'fala' && (
				<AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0) 48%)', opacity: saida}} />
			)}
			{estilo === 'defesa' && (
				<div
					style={{
						position: 'absolute',
						bottom: 330,
						left: 0,
						right: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 24,
						opacity: prog(f, 0, 12) * saida,
					}}
				>
					<div style={{height: 2, width: 140 * prog(f, 0, 20), background: COR.vermelho}} />
					<span style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 24, letterSpacing: 10, color: COR.vermelho}}>🛡 COMO SE DEFENDER</span>
					<div style={{height: 2, width: 140 * prog(f, 0, 20), background: COR.vermelho}} />
				</div>
			)}
			<div style={{...base, ...pos, ...fonte, transform: `scale(${zoomLento}) translateX(${gx}px)`}}>
				{palavras.map((w, i) => {
					const ini = 4 + i * ritmo;
					const p = prog(f, ini, ini + 14);
					const hl = set.has(limpa(w));
					const pop = hl ? interpolate(f, [ini, ini + 8, ini + 18], [1.25, 1.08, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
					const cor = hl ? COR.vermelho : estilo === 'fala' ? COR.creme : COR.creme;
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								color: cor,
								opacity: p,
								transform: `translateY(${(1 - p) * 26}px) scale(${pop})`,
								filter: `blur(${(1 - p) * 10}px)`,
								fontWeight: hl && estilo !== 'grande' ? 700 : undefined,
								fontStyle: hl && estilo === 'normal' ? 'italic' : undefined,
								textShadow: hl
									? `0 0 24px rgba(208,31,42,0.65), 0 0 2px rgba(208,31,42,0.9)`
									: glitch
										? `${-gx * 0.6}px 0 rgba(208,31,42,0.8), ${gx * 0.6}px 0 rgba(80,200,255,0.5)`
										: '0 2px 18px rgba(0,0,0,0.9)',
							}}
						>
							{w}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ───────── Cartão de capítulo: "TÁTICA Nº X" ─────────
export const CartaoTatica: React.FC<{numero: number; nome: string; visual: Parameters<typeof VisualCena>[0]['nome']; f: number; dur: number}> = ({
	numero,
	nome,
	visual,
	f,
	dur,
}) => {
	const vis = fadeIO(f, dur, 6, 14);
	const num = prog(f, 0, 22);
	const preench = prog(f, 14, 40);
	const nomeP = prog(f, 18, 40);
	const esp = interpolate(nomeP, [0, 1], [60, 14]);
	return (
		<AbsoluteFill style={{opacity: vis}}>
			<AbsoluteFill style={{opacity: 0.22, filter: 'blur(3px)', transform: `scale(${1.15 + f * 0.001})`}}>
				<VisualCena nome={visual} f={f + 60} dur={dur + 60} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: prog(f, 4, 18)}}>
					<div style={{width: 220 * prog(f, 4, 26), height: 2, background: COR.creme, opacity: 0.6}} />
					<span style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 26, letterSpacing: 14, color: COR.cinza}}>TÁTICA</span>
					<div style={{width: 220 * prog(f, 4, 26), height: 2, background: COR.creme, opacity: 0.6}} />
				</div>
				<div
					style={{
						position: 'relative',
						fontFamily: FONTE.titulo,
						fontWeight: 900,
						fontSize: 340,
						lineHeight: 1,
						transform: `scale(${interpolate(num, [0, 1], [1.6, 1])})`,
						opacity: num,
						filter: `blur(${(1 - num) * 16}px)`,
					}}
				>
					<span style={{color: 'transparent', WebkitTextStroke: `3px ${COR.creme}`}}>{String(numero).padStart(2, '0')}</span>
					<span
						style={{
							position: 'absolute',
							inset: 0,
							color: COR.vermelho,
							clipPath: `inset(${(1 - preench) * 100}% 0 0 0)`,
							textShadow: '0 0 60px rgba(208,31,42,0.6)',
						}}
					>
						{String(numero).padStart(2, '0')}
					</span>
				</div>
				<div
					style={{
						fontFamily: FONTE.titulo,
						fontWeight: 700,
						fontSize: 78,
						letterSpacing: esp,
						color: COR.creme,
						textTransform: 'uppercase',
						opacity: nomeP,
						marginTop: 10,
					}}
				>
					{nome}
				</div>
			</AbsoluteFill>
			<Vazamento f={f} />
		</AbsoluteFill>
	);
};

// ───────── Título principal ─────────
export const Titulo: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const vis = fadeIO(f, dur, 4, 20);
	const s = prog(f, 0, 30);
	return (
		<AbsoluteFill style={{opacity: vis, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
			<AbsoluteFill style={{opacity: 0.35}}>
				<VisualCena nome="marionete" f={f + 40} dur={dur} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 60%)'}} />
			<div
				style={{
					fontFamily: FONTE.titulo,
					fontWeight: 900,
					fontSize: 200,
					color: COR.vermelho,
					lineHeight: 1,
					textShadow: '0 0 80px rgba(208,31,42,0.7)',
					transform: `scale(${interpolate(s, [0, 1], [1.4, 1]) + f * 0.0008})`,
					opacity: s,
					filter: `blur(${(1 - s) * 20}px)`,
				}}
			>
				7 TÁTICAS
			</div>
			<div style={{fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 84, color: COR.creme, letterSpacing: interpolate(prog(f, 10, 45), [0, 1], [50, 18]), opacity: prog(f, 10, 35)}}>
				DE MANIPULAÇÃO
			</div>
			<div style={{fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 46, color: COR.cinza, marginTop: 24, opacity: prog(f, 30, 55)}}>
				que você nem percebe
			</div>
			<Vazamento f={f} />
		</AbsoluteFill>
	);
};

// ───────── Citação em tela cheia ─────────
export const Citacao: React.FC<{texto: string; autor: string; f: number; dur: number}> = ({texto, autor, f, dur}) => {
	const vis = fadeIO(f, dur, 15, 15);
	const palavras = texto.split(' ');
	return (
		<AbsoluteFill style={{opacity: vis, background: '#030303', alignItems: 'center', justifyContent: 'center', padding: '0 260px'}}>
			<div style={{position: 'absolute', top: 150, left: 230, fontFamily: FONTE.texto, fontSize: 380, color: COR.vermelho, opacity: 0.35 * prog(f, 0, 20), lineHeight: 1}}>“</div>
			<div style={{fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 70, lineHeight: 1.35, color: COR.creme, textAlign: 'center', transform: `scale(${1 + f * 0.0006})`}}>
				{palavras.map((w, i) => {
					const p = prog(f, 10 + i * 5, 26 + i * 5);
					return (
						<span key={i} style={{opacity: p, filter: `blur(${(1 - p) * 8}px)`, marginRight: 18, display: 'inline-block'}}>
							{w}
						</span>
					);
				})}
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 60, opacity: prog(f, 20 + palavras.length * 5, 40 + palavras.length * 5)}}>
				<div style={{width: 80, height: 2, background: COR.vermelho}} />
				<span style={{fontFamily: FONTE.titulo, fontSize: 40, letterSpacing: 12, color: COR.vermelho}}>{autor.toUpperCase()}</span>
				<div style={{width: 80, height: 2, background: COR.vermelho}} />
			</div>
		</AbsoluteFill>
	);
};

// ───────── Recapitulação das 7 táticas ─────────
export const Lista: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const vis = fadeIO(f, dur, 6, 14);
	return (
		<AbsoluteFill style={{opacity: vis, alignItems: 'center', justifyContent: 'center'}}>
			<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
				{TATICAS.map((t, i) => {
					const ini = i * 26;
					const p = prog(f, ini, ini + 10);
					const atual = f >= ini && f < ini + 26;
					return (
						<div key={t} style={{display: 'flex', alignItems: 'baseline', gap: 36, opacity: p * (atual ? 1 : 0.45), transform: `translateX(${(1 - p) * -80}px)`}}>
							<span style={{fontFamily: FONTE.titulo, fontWeight: 900, fontSize: 64, color: COR.vermelho, width: 110, textAlign: 'right'}}>{String(i + 1).padStart(2, '0')}</span>
							<span
								style={{
									fontFamily: FONTE.titulo,
									fontWeight: 700,
									fontSize: 64,
									letterSpacing: 8,
									color: COR.creme,
									textTransform: 'uppercase',
									textShadow: atual ? '0 0 30px rgba(208,31,42,0.7)' : 'none',
								}}
							>
								{t}
							</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ───────── Final + CTA ─────────
export const Final: React.FC<{texto: string; f: number; dur: number}> = ({texto, f, dur}) => {
	const a = prog(f, 0, 30) * (1 - prog(f, 150, 175));
	const cta = prog(f, 180, 205) * (1 - prog(f, dur - 20, dur));
	return (
		<AbsoluteFill style={{background: '#020202'}}>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: a}}>
				<div
					style={{
						fontFamily: FONTE.titulo,
						fontWeight: 700,
						fontSize: 96,
						letterSpacing: interpolate(prog(f, 0, 90), [0, 1], [30, 10]),
						color: COR.creme,
						textTransform: 'uppercase',
					}}
				>
					{texto.split('…')[0]}…
				</div>
				<div style={{fontFamily: FONTE.titulo, fontWeight: 900, fontSize: 120, color: COR.vermelho, textTransform: 'uppercase', opacity: prog(f, 40, 70), textShadow: '0 0 70px rgba(208,31,42,0.7)'}}>
					{texto.split('…')[1]}
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: cta, gap: 30}}>
				<div style={{fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 44, color: COR.cinza}}>Próximo vídeo</div>
				<div style={{fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 70, color: COR.creme, letterSpacing: 6, textAlign: 'center', lineHeight: 1.2}}>
					COMO RECONHECER UM NARCISISTA
					<br />
					<span style={{color: COR.vermelho}}>EM 5 MINUTOS</span>
				</div>
				<div
					style={{
						marginTop: 30,
						padding: '18px 54px',
						border: `2px solid ${COR.vermelho}`,
						fontFamily: FONTE.ui,
						fontWeight: 600,
						fontSize: 30,
						letterSpacing: 10,
						color: COR.creme,
						background: f % 40 < 20 ? 'rgba(208,31,42,0.25)' : 'rgba(208,31,42,0.1)',
					}}
				>
					INSCREVA-SE
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ───────── Indicador de capítulo ─────────
export const Capitulo: React.FC<{numero: number; progresso: number; op: number}> = ({numero, progresso, op}) => (
	<div style={{position: 'absolute', top: 60, left: 80, opacity: op, display: 'flex', flexDirection: 'column', gap: 12}}>
		<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 20, letterSpacing: 6, color: COR.cinza}}>
			TÁTICA <span style={{color: COR.vermelho}}>{String(numero).padStart(2, '0')}</span> / 07
		</div>
		<div style={{display: 'flex', gap: 6}}>
			{TATICAS.map((_, i) => (
				<div key={i} style={{width: 34, height: 3, background: i + 1 < numero ? COR.creme : i + 1 === numero ? COR.escuro : COR.escuro, position: 'relative', overflow: 'hidden', opacity: 0.8}}>
					{i + 1 === numero && <div style={{position: 'absolute', inset: 0, width: `${progresso * 100}%`, background: COR.vermelho}} />}
				</div>
			))}
		</div>
	</div>
);
