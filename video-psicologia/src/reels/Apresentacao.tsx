// Reels de apresentação — Gabi Lima, editora de vídeo (9:16, 30s).
// Identidade: off-white + azul-escuro, tipografia Inter pesada + Playfair itálico,
// muito motion graphics (máscaras, formas, mockups, ícones desenhados, letreiros).
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {prog} from '../tema';

export const GABI = {
	nome: 'GABI',
	sobrenome: 'LIMA',
	profissao: 'EDITORA DE VÍDEO',
	arroba: '', // ex.: '@gabilima.edit' — vazio = não aparece
	botao: 'ME CHAMA NO DIRECT',
};

const C = {
	off: '#F3EFE7',
	off2: '#E7E1D5',
	navy: '#0E1B36',
	navy2: '#1D3461',
	azul: '#9DB3D9',
};
const F = {
	forte: '"Inter", sans-serif',
	serif: '"Playfair Display", serif',
};

export const DURACAO_APRESENTACAO = 900;
const B = 15; // batida (120 BPM)
const CENAS = {intro: 0, quem: 90, reels: 180, youtube: 255, thumbs: 330, motion: 405, servicos: 480, letreiro: 660, cta: 720};
const SOBRE = 14; // frames de sobreposição para as transições

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, d = 0, damping = 13) => spring({frame: f - d, fps: 30, config: {damping, mass: 0.6, stiffness: 140}});

// ── Peças de motion ─────────────────────────────────────────

/** Fundo da cena com revelação circular a partir de um ponto. */
const Revela: React.FC<{cor: string; x?: string; y?: string; children: React.ReactNode; tipo?: 'circulo' | 'sobe' | 'lado'}> = ({cor, x = '50%', y = '50%', children, tipo = 'circulo'}) => {
	const f = useCurrentFrame();
	const p = prog(f, 0, SOBRE);
	const clip = tipo === 'circulo' ? `circle(${p * 150}% at ${x} ${y})` : tipo === 'sobe' ? `inset(${(1 - p) * 100}% 0 0 0)` : `inset(0 0 0 ${(1 - p) * 100}%)`;
	return <AbsoluteFill style={{background: cor, clipPath: clip, overflow: 'hidden'}}>{children}</AbsoluteFill>;
};

/** Texto que sobe de dentro de uma máscara, letra por letra. */
const Mascara: React.FC<{txt: string; f: number; d?: number; tam: number; cor: string; contorno?: boolean; passo?: number; peso?: number; espaco?: number}> = ({txt, f, d = 0, tam, cor, contorno, passo = 2, peso = 900, espaco = -2}) => (
	<div style={{display: 'flex', justifyContent: 'center', overflow: 'hidden', lineHeight: 1, paddingBottom: tam * 0.08}}>
		{txt.split('').map((ch, i) => {
			const s = sp(f, d + i * passo, 15);
			return (
				<span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - s) * 110}%) rotate(${(1 - s) * 12}deg)`, fontFamily: F.forte, fontWeight: peso, fontSize: tam, letterSpacing: espaco, color: contorno ? 'transparent' : cor, WebkitTextStroke: contorno ? `3px ${cor}` : undefined, whiteSpace: 'pre'}}>
					{ch}
				</span>
			);
		})}
	</div>
);

/** Selo circular girando com texto em volta. */
const Selo: React.FC<{f: number; raio: number; cor: string; texto: string; centro?: React.ReactNode}> = ({f, raio, cor, texto, centro}) => {
	const id = 'c' + raio + cor.replace('#', '');
	return (
		<svg width={raio * 2 + 40} height={raio * 2 + 40} viewBox={`${-raio - 20} ${-raio - 20} ${raio * 2 + 40} ${raio * 2 + 40}`}>
			<defs>
				<path id={id} d={`M ${-raio},0 a ${raio},${raio} 0 1,1 ${raio * 2},0 a ${raio},${raio} 0 1,1 ${-raio * 2},0`} />
			</defs>
			<g transform={`rotate(${f * 1.6})`}>
				<text fill={cor} style={{fontFamily: F.forte, fontWeight: 800, fontSize: raio * 0.2, letterSpacing: raio * 0.045}}>
					<textPath href={`#${id}`}>{texto}</textPath>
				</text>
			</g>
			{centro}
		</svg>
	);
};

/** Formas flutuantes (anéis, cruzes, pontos) com parallax. */
const Formas: React.FC<{f: number; cor: string; n?: number; semente?: number}> = ({f, cor, n = 9, semente = 1}) => (
	<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
		{Array.from({length: n}).map((_, i) => {
			const r = (k: number) => {
				const v = Math.sin((i + 1) * 9301 * (k + semente) * 0.001) * 43758.5453;
				return v - Math.floor(v);
			};
			const x = r(1) * 1080;
			const y = (r(2) * 1920 - f * (0.6 + r(3) * 1.6) + 4000) % 1920;
			const s = sp(f, i * 3);
			const tipo = i % 3;
			const rot = f * (r(4) - 0.5) * 4;
			return (
				<g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={0.5}>
					{tipo === 0 && <circle r={14 + r(5) * 26} fill="none" stroke={cor} strokeWidth={4} />}
					{tipo === 1 && <path d="M-16 0 H16 M0 -16 V16" stroke={cor} strokeWidth={5} strokeLinecap="round" />}
					{tipo === 2 && <circle r={7} fill={cor} />}
				</g>
			);
		})}
	</svg>
);

/** Rótulo de seção "01 — REELS & SHORTS" com linha que desenha. */
const Rotulo: React.FC<{n: string; txt: string; f: number; cor: string; topo?: number}> = ({n, txt, f, cor, topo = 200}) => {
	const p = prog(f, 4, 18);
	return (
		<div style={{position: 'absolute', top: topo, left: 80, right: 80}}>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 20, overflow: 'hidden'}}>
				<span style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 64, color: cor, transform: `translateY(${(1 - sp(f, 2)) * 100}%)`, display: 'inline-block'}}>{n}</span>
				<span style={{fontFamily: F.forte, fontWeight: 800, fontSize: 44, letterSpacing: 2, color: cor, transform: `translateY(${(1 - sp(f, 6)) * 120}%)`, display: 'inline-block'}}>{txt}</span>
			</div>
			<div style={{height: 4, background: cor, width: `${p * 100}%`, marginTop: 14}} />
		</div>
	);
};

/** Elementos fixos de "interface": marca, timecode e cantos. */
const Interface: React.FC<{cor: string}> = ({cor}) => {
	const f = useCurrentFrame();
	const tc = `00:${String(Math.floor(f / 30)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`;
	const op = prog(f, 20, 34) * (1 - prog(f, CENAS.cta - 10, CENAS.cta));
	const txt: React.CSSProperties = {position: 'absolute', fontFamily: F.forte, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: cor, opacity: op, mixBlendMode: 'difference'};
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{...txt, top: 70, left: 80}}>GABI LIMA ©26</div>
			<div style={{...txt, top: 70, right: 80}}>PORTFÓLIO</div>
			<div style={{...txt, bottom: 80, left: 80}}>● REC {tc}</div>
			<div style={{...txt, bottom: 80, right: 80}}>9:16</div>
		</AbsoluteFill>
	);
};

// ── Cenas ───────────────────────────────────────────────────

const Intro: React.FC = () => {
	const f = useCurrentFrame();
	// ponto → barra → revela texto
	const ponto = sp(f, 0, 10);
	const barra = prog(f, 10, 24);
	const sobe = prog(f, 24, 36);
	const linha = prog(f, 50, 66);
	return (
		<AbsoluteFill style={{background: C.off}}>
			<Formas f={f} cor={C.navy2} n={7} semente={2} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				{/* ponto que vira barra */}
				<div style={{position: 'absolute', top: 960 - 40 - sobe * 380, width: 80 + barra * 760, height: 80 - barra * 64, borderRadius: 40, background: C.navy, transform: `scale(${ponto})`, opacity: 1 - prog(f, 30, 40)}} />
				<div style={{marginTop: -140}}>
					<div style={{opacity: sobe, transform: `translateY(${(1 - sobe) * 30}px)`, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 64, color: C.navy2, marginBottom: 10}}>oi, eu sou a</div>
					<Mascara txt={GABI.nome} f={f} d={30} tam={300} cor={C.navy} passo={3} />
					<Mascara txt={GABI.sobrenome} f={f} d={40} tam={300} cor={C.navy} contorno passo={3} />
					<div style={{height: 6, background: C.navy, width: 640 * linha, margin: '20px auto 0'}} />
					<div style={{textAlign: 'center', marginTop: 24, fontFamily: F.forte, fontWeight: 600, fontSize: 34, letterSpacing: 12, color: C.navy2, opacity: prog(f, 58, 70)}}>{GABI.profissao}</div>
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', right: 40, bottom: 230, transform: `scale(${sp(f, 55)})`}}>
				<Selo f={f} raio={95} cor={C.navy} texto="EDIÇÃO • MOTION • STORYTELLING • " centro={<text textAnchor="middle" dy={22} style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 64}} fill={C.navy}>✳</text>} />
			</div>
		</AbsoluteFill>
	);
};

const Quem: React.FC = () => {
	const f = useCurrentFrame();
	const destaque = prog(f, 52, 64);
	return (
		<Revela cor={C.navy} x="85%" y="85%">
			<Formas f={f} cor={C.azul} n={10} semente={5} />
			<AbsoluteFill style={{justifyContent: 'center', padding: '0 80px'}}>
				<Mascara txt="EU TRANSFORMO" f={f} d={8} tam={96} cor={C.off} passo={1} />
				<Mascara txt="GRAVAÇÕES" f={f} d={18} tam={130} cor={C.off} contorno passo={1} />
				<div style={{textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 120, color: C.azul, lineHeight: 1.1, opacity: prog(f, 30, 40), transform: `translateY(${(1 - sp(f, 30)) * 60}px)`}}>em histórias</div>
				<div style={{display: 'flex', justifyContent: 'center', gap: 26, marginTop: 10, alignItems: 'center'}}>
					<Mascara txt="QUE" f={f} d={42} tam={110} cor={C.off} passo={1} />
					<div style={{position: 'relative', padding: '0 18px'}}>
						<div style={{position: 'absolute', inset: '8px 0', background: C.off, transformOrigin: 'left', transform: `scaleX(${destaque})`}} />
						<div style={{position: 'relative', fontFamily: F.forte, fontWeight: 900, fontSize: 110, letterSpacing: -2, color: destaque > 0.5 ? C.navy : C.off, opacity: prog(f, 46, 54)}}>PRENDEM.</div>
					</div>
				</div>
			</AbsoluteFill>
		</Revela>
	);
};

const Reels: React.FC = () => {
	const f = useCurrentFrame();
	const s = sp(f, 4, 14);
	const coracao = sp(f, 34, 8);
	return (
		<Revela cor={C.off} tipo="sobe">
			<Formas f={f} cor={C.navy2} n={6} semente={8} />
			<Rotulo n="01" txt="REELS & SHORTS" f={f} cor={C.navy} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 140}}>
				<div style={{width: 500, height: 1000, borderRadius: 64, background: C.navy, padding: 18, transform: `translateY(${(1 - s) * 1200}px) rotate(${(1 - s) * -14 + Math.sin(f / 18) * 1.5}deg)`, boxShadow: '0 40px 80px rgba(14,27,54,0.35)'}}>
					<div style={{width: '100%', height: '100%', borderRadius: 48, overflow: 'hidden', position: 'relative', background: '#000'}}>
						<OffthreadVideo src={staticFile('gabi/reels.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
						<div style={{position: 'absolute', top: 18, left: '50%', width: 120, height: 30, marginLeft: -60, borderRadius: 15, background: C.navy}} />
						<div style={{position: 'absolute', bottom: 20, left: 20, right: 20, height: 6, borderRadius: 3, background: 'rgba(243,239,231,0.3)'}}>
							<div style={{height: '100%', width: `${prog(f, 0, 75, (t) => t) * 100}%`, background: C.off, borderRadius: 3}} />
						</div>
					</div>
				</div>
			</AbsoluteFill>
			{/* chips flutuantes */}
			<div style={{position: 'absolute', left: 70, top: 1180, transform: `scale(${coracao}) rotate(-8deg)`, background: C.navy, color: C.off, borderRadius: 50, padding: '22px 30px', fontFamily: F.forte, fontWeight: 800, fontSize: 40}}>♥ 9:16</div>
			<div style={{position: 'absolute', right: 70, top: 640, transform: `scale(${sp(f, 26, 8)}) rotate(6deg)`, background: C.azul, color: C.navy, borderRadius: 50, padding: '18px 28px', fontFamily: F.forte, fontWeight: 800, fontSize: 34}}>LEGENDA ✓</div>
		</Revela>
	);
};

const Youtube: React.FC = () => {
	const f = useCurrentFrame();
	const s = sp(f, 4, 15);
	const cursorX = interpolate(f, [30, 50], [900, 560], {...cl});
	const cursorY = interpolate(f, [30, 50], [1500, 1140], {...cl});
	const clique = f > 52 && f < 60 ? 0.85 : 1;
	return (
		<Revela cor={C.navy} tipo="lado">
			<Formas f={f} cor={C.azul} n={6} semente={11} />
			<Rotulo n="02" txt="VÍDEOS PARA YOUTUBE" f={f} cor={C.off} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 960, borderRadius: 26, overflow: 'hidden', background: C.off, transform: `translateX(${(1 - s) * 1100}px) rotate(${(1 - s) * 6}deg)`, boxShadow: '0 40px 90px rgba(0,0,0,0.5)'}}>
					<div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px'}}>
						{[0, 1, 2].map((i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: i === 0 ? C.navy : C.off2, border: `2px solid ${C.navy}`}} />)}
						<div style={{flex: 1, height: 30, marginLeft: 20, borderRadius: 15, background: C.off2}} />
					</div>
					<div style={{width: 960, height: 540, background: '#000'}}>
						<OffthreadVideo src={staticFile('gabi/youtube.mp4')} muted style={{width: '100%', height: '100%'}} />
					</div>
					<div style={{padding: '22px 28px 30px'}}>
						<div style={{height: 8, borderRadius: 4, background: C.off2}}>
							<div style={{height: '100%', borderRadius: 4, background: C.navy2, width: `${prog(f, 6, 75, (t) => t) * 100}%`}} />
						</div>
						<div style={{marginTop: 22, height: 26, width: '70%', borderRadius: 6, background: C.navy, opacity: prog(f, 16, 24)}} />
						<div style={{marginTop: 14, height: 20, width: '45%', borderRadius: 6, background: C.azul, opacity: prog(f, 20, 28)}} />
					</div>
				</div>
			</AbsoluteFill>
			{/* cursor */}
			<svg width={70} height={90} viewBox="0 0 24 30" style={{position: 'absolute', left: cursorX, top: cursorY, opacity: prog(f, 26, 32), transform: `scale(${clique})`}}>
				<path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill={C.off} stroke={C.navy} strokeWidth={1.6} strokeLinejoin="round" />
			</svg>
		</Revela>
	);
};

const Thumbs: React.FC = () => {
	const f = useCurrentFrame();
	const cartas = [
		{src: 'gabi/thumb1.png', d: 6, rot: -9, y: -230},
		{src: 'gabi/thumb2.png', d: 14, rot: 7, y: 230},
	];
	return (
		<Revela cor={C.off} x="15%" y="20%">
			<Formas f={f} cor={C.navy2} n={6} semente={14} />
			<Rotulo n="03" txt="THUMBNAILS" f={f} cor={C.navy} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 120}}>
				{cartas.map((c, i) => {
					const s = sp(f, c.d, 12);
					const flutua = Math.sin((f + i * 20) / 14) * 10;
					return (
						<div key={c.src} style={{position: 'absolute', width: 880, height: 495, borderRadius: 22, overflow: 'hidden', border: `10px solid ${C.navy}`, boxShadow: '0 30px 70px rgba(14,27,54,0.35)', transform: `translateY(${c.y * s + flutua + (1 - s) * 900}px) rotate(${c.rot * s}deg) scale(${0.6 + s * 0.4})`}}>
							<Img src={staticFile(c.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
						</div>
					);
				})}
			</AbsoluteFill>
			<div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 56, color: C.navy, opacity: prog(f, 30, 42)}}>a capa que faz clicar</div>
		</Revela>
	);
};

const Motion: React.FC = () => {
	const f = useCurrentFrame();
	// curva do "graph editor" se desenhando
	const curva = 'M 120 1380 C 380 1380, 420 1080, 540 1080 S 700 780, 960 780';
	const comp = 1100;
	const desenho = prog(f, 6, 40);
	const formas = [
		{d: 10, x: 230, cor: C.off},
		{d: 18, x: 540, cor: C.azul},
		{d: 26, x: 850, cor: C.off},
	];
	return (
		<Revela cor={C.navy} x="50%" y="100%">
			<Rotulo n="04" txt="MOTION GRAPHICS" f={f} cor={C.off} />
			{/* grade */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.15}}>
				{Array.from({length: 10}).map((_, i) => <line key={'v' + i} x1={i * 120 + 0} y1={0} x2={i * 120} y2={1920} stroke={C.azul} strokeWidth={2} />)}
				{Array.from({length: 17}).map((_, i) => <line key={'h' + i} x1={0} y1={i * 120} x2={1080} y2={i * 120} stroke={C.azul} strokeWidth={2} />)}
			</svg>
			{/* formas quicando no beat e trocando */}
			{formas.map((fo, i) => {
				const s = sp(f, fo.d, 9);
				const pulo = Math.abs(Math.sin(((f - fo.d) / B) * Math.PI)) * 60 * (f > fo.d ? 1 : 0);
				const morf = prog(f, 44 + i * 4, 54 + i * 4);
				const raio = interpolate(morf, [0, 1], [i === 1 ? 0 : 80, i === 1 ? 80 : 0]);
				return (
					<div key={i} style={{position: 'absolute', left: fo.x - 80, top: 560 - pulo, width: 160, height: 160, borderRadius: raio, background: fo.cor, transform: `scale(${s}) rotate(${(f - fo.d) * (i - 1) * 3}deg)`}} />
				);
			})}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d={curva} fill="none" stroke={C.off} strokeWidth={8} strokeLinecap="round" strokeDasharray={comp} strokeDashoffset={comp * (1 - desenho)} />
				{[
					[120, 1380, 8],
					[540, 1080, 22],
					[960, 780, 36],
				].map(([x, y, d], i) => (
					<rect key={i} x={x - 22} y={y - 22} width={44} height={44} fill={C.azul} stroke={C.off} strokeWidth={4} transform={`rotate(45 ${x} ${y}) scale(1)`} opacity={prog(f, d, d + 6)} />
				))}
			</svg>
			<div style={{position: 'absolute', top: 1500, left: 0, right: 0}}>
				<Mascara txt="EASE-IN-OUT" f={f} d={36} tam={92} cor={C.off} contorno passo={1} />
			</div>
		</Revela>
	);
};

// Ícones desenhados (traço animado)
const Icone: React.FC<{tipo: number; p: number; cor: string}> = ({tipo, p, cor}) => {
	const traco = {fill: 'none', stroke: cor, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p};
	const caminhos = [
		['M30 30 L90 90', 'M90 30 L30 90', 'M30 30 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0'], // cortes (tesoura simplificada)
		['M20 40 H100', 'M20 60 H80', 'M20 80 H95'], // legendas
		['M20 90 L45 40 L70 90 Z', 'M75 35 h25 v25 h-25 Z', 'M85 85 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0'], // motion
		['M15 60 L30 60 L38 35 L48 85 L58 25 L68 95 L78 45 L86 60 L105 60'], // som
		['M18 28 H102 V92 H18 Z', 'M18 80 L45 55 L65 72 L80 60 L102 80', 'M78 42 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0'], // thumbnail
		['M30 18 H78 L95 35 V102 H30 Z', 'M45 50 H80', 'M45 68 H80', 'M45 86 H66'], // roteiro
	];
	return (
		<svg width={120} height={120} viewBox="0 0 120 120">
			{caminhos[tipo].map((d, i) => <path key={i} d={d} {...traco} />)}
		</svg>
	);
};

const SERVICOS = ['CORTES', 'LEGENDAS', 'MOTION', 'TRILHA & SFX', 'THUMBNAILS', 'ROTEIRO'];
const Servicos: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Revela cor={C.off} tipo="sobe">
			<Formas f={f} cor={C.navy2} n={7} semente={20} />
			<div style={{position: 'absolute', top: 230, left: 0, right: 0}}>
				<div style={{textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 60, color: C.navy2, opacity: prog(f, 2, 12)}}>o que eu</div>
				<Mascara txt="FAÇO" f={f} d={6} tam={180} cor={C.navy} passo={2} />
			</div>
			<div style={{position: 'absolute', top: 640, left: 80, right: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
				{SERVICOS.map((s, i) => {
					const d = 20 + i * B;
					const e = sp(f, d, 11);
					const ativo = f >= d && f < d + B * 2;
					return (
						<div key={s} style={{height: 300, borderRadius: 34, background: ativo ? C.navy2 : C.navy, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 34, transform: `scale(${e}) rotate(${(1 - e) * (i % 2 ? 10 : -10)}deg)`}}>
							<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
								<Icone tipo={i} p={prog(f, d + 4, d + 22)} cor={C.off} />
								<span style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 40, color: C.azul}}>0{i + 1}</span>
							</div>
							<div style={{fontFamily: F.forte, fontWeight: 800, fontSize: 44, color: C.off, letterSpacing: 1}}>{s}</div>
						</div>
					);
				})}
			</div>
		</Revela>
	);
};

const Letreiro: React.FC = () => {
	const f = useCurrentFrame();
	const linhas = ['EDIÇÃO ✳ MOTION ✳ RITMO ✳ ', 'STORYTELLING ✳ LEGENDAS ✳ ', 'REELS ✳ YOUTUBE ✳ ANÚNCIOS ✳ '];
	return (
		<Revela cor={C.navy} x="50%" y="50%">
			<AbsoluteFill style={{justifyContent: 'center', transform: 'rotate(-8deg) scale(1.2)'}}>
				{linhas.map((l, i) => {
					const dir = i % 2 ? 1 : -1;
					const x = dir * f * 22 - 1500;
					return (
						<div key={i} style={{whiteSpace: 'nowrap', transform: `translateX(${x}px)`, fontFamily: F.forte, fontWeight: 900, fontSize: 200, lineHeight: 1.05, color: i === 1 ? 'transparent' : i === 0 ? C.off : C.azul, WebkitTextStroke: i === 1 ? `3px ${C.off}` : undefined}}>
							{l.repeat(5)}
						</div>
					);
				})}
			</AbsoluteFill>
		</Revela>
	);
};

const Cta: React.FC = () => {
	const f = useCurrentFrame();
	const selo = sp(f, 6, 12);
	const pulso = 1 + Math.sin(f / 7) * 0.025 * prog(f, 70, 80);
	return (
		<Revela cor={C.off} x="50%" y="40%">
			<Formas f={f} cor={C.navy2} n={9} semente={30} />
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 380}}>
				<div style={{transform: `scale(${selo}) rotate(${(1 - selo) * -90}deg)`}}>
					<Selo
						f={f}
						raio={170}
						cor={C.navy}
						texto={`${GABI.nome} ${GABI.sobrenome} • ${GABI.profissao} • `}
						centro={
							<g>
								<circle r={118} fill={C.navy} />
								<text textAnchor="middle" dy={34} fill={C.off} style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 104}}>GL</text>
							</g>
						}
					/>
				</div>
				<div style={{marginTop: 60}}>
					<Mascara txt="BORA CRIAR" f={f} d={24} tam={124} cor={C.navy} passo={1} />
				</div>
				<div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 150, color: C.navy2, lineHeight: 1, opacity: prog(f, 36, 46), transform: `translateY(${(1 - sp(f, 36)) * 60}px)`}}>juntos?</div>
				<div style={{marginTop: 80, transform: `scale(${sp(f, 60, 10) * pulso})`}}>
					<div style={{fontFamily: F.forte, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: C.off, background: C.navy, padding: '30px 54px', borderRadius: 60}}>{GABI.botao} →</div>
				</div>
				<div style={{marginTop: 40, fontFamily: F.forte, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: C.navy2, opacity: prog(f, 76, 88)}}>{GABI.arroba || 'AGENDA ABERTA'}</div>
			</AbsoluteFill>
		</Revela>
	);
};

const Sfx: React.FC<{som: string; em: number; vol?: number}> = ({som, em, vol = 0.5}) => (
	<Sequence from={Math.max(0, em)} layout="none">
		<Audio src={staticFile(`audio/${som}.wav`)} volume={vol} />
	</Sequence>
);

export const Apresentacao: React.FC = () => {
	const ordem: [number, number, React.FC][] = [
		[CENAS.intro, CENAS.quem, Intro],
		[CENAS.quem, CENAS.reels, Quem],
		[CENAS.reels, CENAS.youtube, Reels],
		[CENAS.youtube, CENAS.thumbs, Youtube],
		[CENAS.thumbs, CENAS.motion, Thumbs],
		[CENAS.motion, CENAS.servicos, Motion],
		[CENAS.servicos, CENAS.letreiro, Servicos],
		[CENAS.letreiro, CENAS.cta, Letreiro],
		[CENAS.cta, DURACAO_APRESENTACAO, Cta],
	];
	const transicoes = ordem.slice(1).map(([a]) => a);
	return (
		<AbsoluteFill style={{background: C.off}}>
			{ordem.map(([a, b, Cena], i) => (
				<Sequence key={i} from={a} durationInFrames={b - a + SOBRE}>
					<Cena />
				</Sequence>
			))}
			<Interface cor={C.off} />

			<Audio src={staticFile('audio/trilha-gabi.wav')} volume={0.85} />
			<Sfx som="pop" em={0} vol={0.6} />
			<Sfx som="swoosh" em={10} vol={0.4} />
			{[30, 33, 36, 39, 40, 43, 46, 49].map((t) => <Sfx key={t} som="tecla" em={t} vol={0.25} />)}
			<Sfx som="pop" em={55} vol={0.4} />
			{transicoes.map((t) => <Sfx key={'t' + t} som="swoosh" em={t - 6} vol={0.55} />)}
			<Sfx som="pop" em={CENAS.reels + 34} vol={0.5} />
			<Sfx som="pop" em={CENAS.reels + 26} vol={0.4} />
			<Sfx som="tecla" em={CENAS.youtube + 53} vol={0.6} />
			<Sfx som="pop" em={CENAS.thumbs + 6} vol={0.5} />
			<Sfx som="pop" em={CENAS.thumbs + 14} vol={0.5} />
			{[10, 18, 26].map((d) => <Sfx key={'m' + d} som="pop" em={CENAS.motion + d} vol={0.45} />)}
			{SERVICOS.map((_, i) => <Sfx key={'s' + i} som="pop" em={CENAS.servicos + 20 + i * B} vol={0.5} />)}
			<Sfx som="pop" em={CENAS.cta + 6} vol={0.6} />
			<Sfx som="pop" em={CENAS.cta + 60} vol={0.6} />
		</AbsoluteFill>
	);
};
