// Reels de divulgação (9:16, 28s) no mesmo estilo dark dos episódios:
// gancho → antes/depois → montagem de portfólio no beat → serviços → CTA.
// Os trechos de portfólio ficam em public/reels (cortados dos vídeos exportados).
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Acabamento, Fundo} from '../componentes';
import {COR, FONTE, prog} from '../tema';

// ── Personalize aqui ─────────────────────────────────────────
export const PERFIL = {
	profissao: 'EDITORA DE VÍDEO',
	arroba: '', // ex.: '@seuperfil' — vazio = não aparece
	botao: 'ME CHAMA NO DIRECT',
	servicos: ['REELS & TIKTOK', 'SHORTS', 'VÍDEOS PARA YOUTUBE', 'ANÚNCIOS'],
};

export const DURACAO_REELS = 855; // 28,5s
const B = 15; // 1 batida a 120 BPM
const T = {gancho: 0, antes: 75, depois: 165, montagem: 255, flashes: 465, servicos: 525, cta: 690};

const MONTAGEM: [string, string, string][] = [
	['m1', 'TEXTO', 'CINÉTICO'],
	['m2', 'MOTION', 'DESIGN'],
	['m3', 'LEGENDA', 'SINCRONIZADA'],
	['m4', 'SOUND', 'DESIGN'],
	['m5', 'RITMO QUE', 'PRENDE'],
	['m6', 'NARRAÇÃO', 'E MIXAGEM'],
	['m7', 'ROTEIRO PARA', 'RETENÇÃO'],
];
const FLASHES = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'];
const VERTICAIS = new Set(['m1', 'm3', 'm5', 'f5']);

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Clipe de portfólio: vertical ocupa a tela; horizontal fica num quadro com fundo desfocado. */
const Clipe: React.FC<{nome: string; som?: boolean}> = ({nome, som}) => {
	const src = staticFile(`reels/${nome}.mp4`);
	if (VERTICAIS.has(nome)) return <OffthreadVideo src={src} muted={!som} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
	return (
		<AbsoluteFill>
			<OffthreadVideo src={src} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(28px) brightness(0.45)', transform: 'scale(1.2)'}} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 1080, height: 608, boxShadow: '0 30px 90px rgba(0,0,0,0.9)', borderTop: `1px solid ${COR.escuro}`, borderBottom: `1px solid ${COR.escuro}`}}>
					<OffthreadVideo src={src} muted={!som} style={{width: '100%', height: '100%'}} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** Tremor + flash a cada batida forte. */
const Impacto: React.FC<{children: React.ReactNode; batidas: number[]}> = ({children, batidas}) => {
	const f = useCurrentFrame();
	let k = 0;
	for (const b of batidas) {
		const d = f - b;
		if (d >= 0 && d < 20) k = Math.max(k, Math.exp(-d / 4));
	}
	const sx = (random('x' + f) - 0.5) * 34 * k;
	const sy = (random('y' + f) - 0.5) * 34 * k;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${1 + k * 0.04})`}}>{children}</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(255,220,200,0.55), rgba(208,31,42,0.25) 50%, rgba(0,0,0,0) 80%)', opacity: k * 0.3, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

const Grande: React.FC<{linhas: [string, string?][]; f: number; tam?: number; atraso?: number}> = ({linhas, f, tam = 104, atraso = 6}) => (
	<div style={{textAlign: 'center', fontFamily: FONTE.titulo, fontWeight: 900, letterSpacing: 4, lineHeight: 1.08}}>
		{linhas.map(([txt, cor], i) => {
			const p = prog(f, i * atraso, i * atraso + 12);
			return (
				<div key={i} style={{fontSize: tam, color: cor ?? COR.creme, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${1.15 - p * 0.15})`, filter: `blur(${(1 - p) * 8}px)`, textShadow: cor === COR.vermelho ? `0 0 40px ${COR.vermelhoEscuro}` : '0 6px 30px #000'}}>
					{txt}
				</div>
			);
		})}
	</div>
);

const Etiqueta: React.FC<{texto: string; f: number; cor?: string}> = ({texto, f, cor = COR.vermelho}) => {
	const p = prog(f, 0, 10);
	return (
		<div style={{position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: p}}>
			<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 30, letterSpacing: 10, color: COR.creme, padding: '12px 26px', border: `2px solid ${cor}`, background: 'rgba(5,5,5,0.6)'}}>{texto}</div>
		</div>
	);
};

// ── Cenas ───────────────────────────────────────────────────
const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - prog(f, 66, 75)}}>
			<Grande f={f} linhas={[['SEU VÍDEO TEM'], ['3 SEGUNDOS', COR.vermelho]]} />
			<div style={{marginTop: 40, fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 50, color: COR.cinza, opacity: prog(f, 26, 40)}}>
				pra não ser <span style={{color: COR.vermelho}}>pulado.</span>
			</div>
		</AbsoluteFill>
	);
};

const Antes: React.FC = () => {
	const f = useCurrentFrame();
	const seg = Math.floor(f / 30);
	// Vídeo cru: sem trilha, sem motion, legenda genérica, enquadramento parado
	const g = f > 80 ? random('g' + f) : 0;
	return (
		<AbsoluteFill style={{background: '#2b2b2b', filter: `grayscale(1) contrast(0.85)`, transform: g ? `translateX(${(g - 0.5) * 60}px)` : undefined}}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 1080, height: 608, background: '#3a3a3a', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 40}}>
					<div style={{fontFamily: 'Arial, sans-serif', fontSize: 34, color: '#fff', background: '#000', padding: '4px 10px'}}>Na mitologia grega, Narciso viu o próprio reflexo</div>
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', bottom: 520, left: 0, right: 0, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: 28, color: '#bbb'}}>▶ 0:0{seg} / 4:54</div>
			<Etiqueta texto="ANTES · VÍDEO CRU" f={f} cor="#777" />
			<div style={{position: 'absolute', bottom: 330, left: 0, right: 0, textAlign: 'center', fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 46, color: '#ddd', opacity: prog(f, 20, 32)}}>
				…e o público some.
			</div>
		</AbsoluteFill>
	);
};

const Depois: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Clipe nome="depois" som />
			<Etiqueta texto="DEPOIS · EDITADO" f={f} />
			<AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 6], [0.7, 0], cl)}} />
		</AbsoluteFill>
	);
};

const CorteMontagem: React.FC<{nome: string; l1: string; l2: string; i: number}> = ({nome, l1, l2, i}) => {
	const f = useCurrentFrame();
	const z = 1.08 - prog(f, 0, 30) * 0.08;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${z})`}}>
				<Clipe nome={nome} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.85) 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, ...(VERTICAIS.has(nome) ? {top: 300} : {bottom: 300})}}>
				<div style={{textAlign: 'center', fontFamily: FONTE.ui, fontSize: 24, letterSpacing: 8, color: COR.cinza, marginBottom: 10, opacity: prog(f, 0, 6)}}>{String(i + 1).padStart(2, '0')} / 07</div>
				<Grande f={f} tam={86} atraso={3} linhas={[[l1], [l2, COR.vermelho]]} />
			</div>
		</AbsoluteFill>
	);
};

const Servicos: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - prog(f, 155, 165)}}>
			<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 30, letterSpacing: 14, color: COR.vermelho, opacity: prog(f, 0, 10), marginBottom: 50}}>EU EDITO</div>
			{PERFIL.servicos.map((s, i) => {
				const t = 15 + i * 2 * B;
				const p = prog(f, t, t + 10);
				const aceso = f >= t && f < t + 2 * B + 4;
				return (
					<div key={s} style={{display: 'flex', alignItems: 'center', gap: 26, margin: '18px 0', opacity: 0.25 + p * 0.75, transform: `translateX(${(1 - p) * -40}px)`}}>
						<span style={{fontFamily: FONTE.ui, fontSize: 30, color: COR.vermelho, width: 50}}>{String(i + 1).padStart(2, '0')}</span>
						<span style={{fontFamily: FONTE.titulo, fontWeight: 700, fontSize: 64, letterSpacing: 3, color: aceso ? COR.creme : COR.cinza, textShadow: aceso ? `0 0 30px ${COR.vermelhoEscuro}` : 'none'}}>{s}</span>
					</div>
				);
			})}
			<div style={{marginTop: 60, fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 42, color: COR.cinza, opacity: prog(f, 110, 125)}}>
				do roteiro à <span style={{color: COR.vermelho}}>thumbnail</span>.
			</div>
		</AbsoluteFill>
	);
};

const Cta: React.FC = () => {
	const f = useCurrentFrame();
	const pulso = 1 + Math.sin(f / 6) * 0.02 * prog(f, 70, 80);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: 0.35 * prog(f, 0, 30)}}>
				<OffthreadVideo src={staticFile('reels/fundo-cta.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px)', transform: 'scale(1.25) translateY(6%)'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,5,5,0) 40%, #050505 80%)'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{fontFamily: FONTE.ui, fontSize: 28, letterSpacing: 12, color: COR.cinza, opacity: prog(f, 0, 12), marginBottom: 30}}>{PERFIL.profissao}</div>
				<Grande f={f} tam={92} linhas={[['SEU PRÓXIMO'], ['VÍDEO'], ['MERECE'], ['PRENDER.', COR.vermelho]]} />
				<div style={{marginTop: 70, opacity: prog(f, 60, 72), transform: `scale(${pulso})`}}>
					<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 36, letterSpacing: 6, color: COR.creme, background: COR.vermelho, padding: '22px 44px', boxShadow: `0 0 50px ${COR.vermelhoEscuro}`}}>{PERFIL.botao} ✉</div>
				</div>
				{PERFIL.arroba && <div style={{marginTop: 34, fontFamily: FONTE.ui, fontSize: 34, color: COR.creme, opacity: prog(f, 72, 84)}}>{PERFIL.arroba}</div>}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Sfx: React.FC<{som: string; em: number; vol?: number}> = ({som, em, vol = 0.6}) => (
	<Sequence from={Math.max(0, em)} layout="none">
		<Audio src={staticFile(`audio/${som}.wav`)} volume={vol} />
	</Sequence>
);

export const Reels: React.FC = () => {
	const cortes = MONTAGEM.map((_, i) => T.montagem + i * 2 * B);
	const servicos = PERFIL.servicos.map((_, i) => T.servicos + 15 + i * 2 * B);
	const batidas = [T.depois, ...cortes, T.servicos, T.cta, T.cta + 60];
	const volTrilha = (f: number) => (f >= T.depois && f < T.montagem ? 0.15 : 0.9);
	return (
		<AbsoluteFill style={{backgroundColor: COR.preto}}>
			<Fundo />
			<Impacto batidas={batidas}>
				<Sequence durationInFrames={T.antes}><Gancho /></Sequence>
				<Sequence from={T.antes} durationInFrames={T.depois - T.antes}><Antes /></Sequence>
				<Sequence from={T.depois} durationInFrames={T.montagem - T.depois}><Depois /></Sequence>
				{MONTAGEM.map(([n, l1, l2], i) => (
					<Sequence key={n} from={cortes[i]} durationInFrames={2 * B}><CorteMontagem nome={n} l1={l1} l2={l2} i={i} /></Sequence>
				))}
				{FLASHES.map((n, i) => (
					<Sequence key={n} from={T.flashes + i * 10} durationInFrames={10}>
						<Clipe nome={n} />
					</Sequence>
				))}
				<Sequence from={T.servicos} durationInFrames={T.cta - T.servicos}><Servicos /></Sequence>
				<Sequence from={T.cta}><Cta /></Sequence>
			</Impacto>
			<Acabamento />

			<Audio src={staticFile('audio/trilha-reels.wav')} volume={volTrilha} />
			<Sfx som="coracao" em={4} vol={0.8} />
			<Sfx som="hit" em={20} vol={0.5} />
			<Sfx som="glitch" em={T.depois - 12} vol={0.5} />
			<Sfx som="whoosh" em={T.depois - 6} vol={0.5} />
			<Sfx som="riser" em={T.montagem - 90} vol={0.4} />
			{cortes.map((c, i) => <Sfx key={'c' + i} som={i === 0 ? 'boom' : 'hit'} em={c} vol={i === 0 ? 0.8 : 0.45} />)}
			{FLASHES.map((_, i) => <Sfx key={'f' + i} som="tecla" em={T.flashes + i * 10} vol={0.5} />)}
			<Sfx som="whoosh" em={T.servicos - 8} vol={0.5} />
			{servicos.map((s, i) => <Sfx key={'s' + i} som="boom" em={s} vol={0.3} />)}
			<Sfx som="acorde-final" em={T.cta} vol={0.8} />
			<Sfx som="boom" em={T.cta + 60} vol={0.6} />
		</AbsoluteFill>
	);
};
