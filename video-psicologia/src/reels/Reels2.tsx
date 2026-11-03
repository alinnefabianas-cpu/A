// Reels 2 de divulgação (9:16, 29,5s): "Você grava. Eu cuido do resto."
// Mostra o passo a passo do serviço com uma linha do tempo de edição que vai
// ganhando faixas a cada passo. Mesmo estilo dark dos episódios.
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Acabamento, Fundo} from '../componentes';
import {COR, FONTE, prog} from '../tema';
import {PERFIL} from './Reels';

export const DURACAO_REELS2 = 885; // 29,5s
const B = 15; // 1 batida a 120 BPM
const T = {gancho: 0, passos: 135, para: 585, cta: 690};
const DP = 90; // duração de cada passo

const PASSOS = [
	{nome: 'CORTES', desc: 'tiro pausas, erros e enrolação', faixa: 'VÍDEO', clipe: 'p1', vertical: false},
	{nome: 'LEGENDAS', desc: 'palavra por palavra, no tempo da fala', faixa: 'LEGENDA', clipe: 'p2', vertical: true},
	{nome: 'MOTION', desc: 'animações que explicam e prendem', faixa: 'MOTION', clipe: 'p3', vertical: false},
	{nome: 'TRILHA E EFEITOS', desc: 'som que dá ritmo e emoção', faixa: 'ÁUDIO', clipe: 'p4', vertical: true},
	{nome: 'THUMBNAIL', desc: 'a capa que faz clicar', faixa: 'CAPA', clipe: '', vertical: false},
];
const PUBLICO = ['CRIADORES', 'MARCAS', 'INFOPRODUTORES', 'PODCASTS', 'YOUTUBERS', 'EMPRESAS', 'VOCÊ.'];

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Impacto: React.FC<{children: React.ReactNode; batidas: number[]}> = ({children, batidas}) => {
	const f = useCurrentFrame();
	let k = 0;
	for (const b of batidas) {
		const d = f - b;
		if (d >= 0 && d < 20) k = Math.max(k, Math.exp(-d / 4));
	}
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `translate(${(random('x' + f) - 0.5) * 30 * k}px, ${(random('y' + f) - 0.5) * 30 * k}px) scale(${1 + k * 0.035})`}}>{children}</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(255,220,200,0.55), rgba(208,31,42,0.25) 50%, rgba(0,0,0,0) 80%)', opacity: k * 0.28, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

const Linha: React.FC<{txt: string; f: number; t: number; cor?: string; tam?: number}> = ({txt, f, t, cor = COR.creme, tam = 110}) => {
	const p = prog(f, t, t + 12);
	return (
		<div style={{fontFamily: FONTE.titulo, fontWeight: 900, fontSize: tam, letterSpacing: 4, lineHeight: 1.08, textAlign: 'center', color: cor, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${1.15 - p * 0.15})`, filter: `blur(${(1 - p) * 8}px)`, textShadow: cor === COR.vermelho ? `0 0 40px ${COR.vermelhoEscuro}` : '0 6px 30px #000'}}>
			{txt}
		</div>
	);
};

// ── Gancho ──────────────────────────────────────────────────
const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	const rec = Math.floor(f / 12) % 2 === 0 && f < 70;
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - prog(f, 126, 135)}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 50, opacity: prog(f, 0, 8) * (f < 70 ? 1 : 0.3), fontFamily: FONTE.ui, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: COR.creme}}>
				<div style={{width: 26, height: 26, borderRadius: 13, background: COR.vermelho, opacity: rec ? 1 : 0.25, boxShadow: `0 0 20px ${COR.vermelho}`}} /> REC
			</div>
			<Linha txt="VOCÊ GRAVA." f={f} t={4} />
			<div style={{height: 40}} />
			<Linha txt="EU CUIDO" f={f} t={60} />
			<Linha txt="DO RESTO." f={f} t={75} cor={COR.vermelho} />
		</AbsoluteFill>
	);
};

// ── Passos ──────────────────────────────────────────────────
const Monitor: React.FC<{i: number; f: number}> = ({i, f}) => {
	const p = PASSOS[i];
	const z = 1.06 - prog(f, 0, DP) * 0.06;
	const caixa: React.CSSProperties = p.vertical ? {width: 520, height: 924} : {width: 1000, height: 562};
	let conteudo: React.ReactNode;
	if (p.clipe) conteudo = <OffthreadVideo src={staticFile(`reels2/${p.clipe}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />;
	else {
		const troca = prog(f, 40, 52);
		conteudo = (
			<>
				<Img src={staticFile('reels2/thumb1.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 - prog(f, 0, 50) * 0.1})`}} />
				<Img src={staticFile('reels2/thumb2.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: troca, transform: `scale(${1.1 - prog(f, 40, DP) * 0.1})`}} />
			</>
		);
	}
	return (
		<div style={{position: 'absolute', top: 150, left: 0, right: 0, height: 960, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<div style={{...caixa, position: 'relative', overflow: 'hidden', border: `2px solid ${COR.escuro}`, boxShadow: '0 30px 90px rgba(0,0,0,0.9)', opacity: prog(f, 0, 8)}}>
				{conteudo}
				{/* cantos de enquadramento */}
				{[0, 1, 2, 3].map((c) => (
					<div key={c} style={{position: 'absolute', width: 40, height: 40, [c < 2 ? 'top' : 'bottom']: 14, [c % 2 ? 'right' : 'left']: 14, borderColor: COR.vermelho, borderStyle: 'solid', borderWidth: `${c < 2 ? 3 : 0}px ${c % 2 ? 3 : 0}px ${c < 2 ? 0 : 3}px ${c % 2 ? 0 : 3}px`}} />
				))}
			</div>
		</div>
	);
};

const Passo: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const p = PASSOS[i];
	const sai = 1 - prog(f, DP - 6, DP);
	return (
		<AbsoluteFill style={{opacity: sai}}>
			<Monitor i={i} f={f} />
			<div style={{position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 28, letterSpacing: 10, color: COR.vermelho, opacity: prog(f, 2, 10)}}>PASSO {String(i + 1).padStart(2, '0')}</div>
				<Linha txt={p.nome} f={f} t={4} tam={p.nome.length > 10 ? 76 : 96} />
				<div style={{marginTop: 14, fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 44, color: COR.cinza, opacity: prog(f, 16, 28)}}>{p.desc}</div>
			</div>
		</AbsoluteFill>
	);
};

/** Linha do tempo de editor: cada passo acrescenta uma faixa com blocos. */
const LinhaDoTempo: React.FC = () => {
	const f = useCurrentFrame(); // relativo a T.passos
	const W = 860;
	const x0 = 110;
	const cabeca = interpolate(f, [0, PASSOS.length * DP], [0, W], cl);
	const op = prog(f, 0, 12) * (1 - prog(f, PASSOS.length * DP - 8, PASSOS.length * DP));
	return (
		<div style={{position: 'absolute', top: 1450, left: 0, right: 0, height: 320, opacity: op}}>
			{PASSOS.map((p, i) => {
				const ent = prog(f, i * DP, i * DP + 14);
				const ativo = f >= i * DP && f < (i + 1) * DP;
				const y = i * 52;
				return (
					<div key={p.faixa} style={{position: 'absolute', top: y, left: 0, right: 0, height: 44, opacity: 0.15 + ent * 0.85}}>
						<div style={{position: 'absolute', left: x0 - 100, width: 90, top: 12, textAlign: 'right', fontFamily: FONTE.ui, fontSize: 16, letterSpacing: 2, color: ativo ? COR.creme : COR.cinza}}>{p.faixa}</div>
						{Array.from({length: 4 + i}).map((_, k) => {
							const a = random(`a${i}${k}`);
							const w0 = (W / (4 + i)) * (0.55 + a * 0.4);
							const xs = (W / (4 + i)) * k;
							return <div key={k} style={{position: 'absolute', left: x0 + xs, top: 4, height: 36, width: w0 * ent, background: ativo ? COR.vermelho : i % 2 ? '#3a2a28' : '#2e2523', borderRadius: 4, opacity: ativo ? 0.95 : 0.8, boxShadow: ativo ? `0 0 16px ${COR.vermelhoEscuro}` : 'none'}} />;
						})}
					</div>
				);
			})}
			<div style={{position: 'absolute', left: x0 + cabeca, top: -14, width: 3, height: PASSOS.length * 52 + 10, background: COR.creme, boxShadow: `0 0 12px ${COR.creme}`}} />
			<div style={{position: 'absolute', left: x0 + cabeca - 9, top: -24, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `14px solid ${COR.creme}`}} />
		</div>
	);
};

// ── Para quem ───────────────────────────────────────────────
const ParaQuem: React.FC = () => {
	const f = useCurrentFrame();
	const k = Math.min(PUBLICO.length - 1, Math.floor(f / B));
	const local = f - k * B;
	const ult = k === PUBLICO.length - 1;
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - prog(f, 98, 105)}}>
			<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 30, letterSpacing: 14, color: COR.cinza, marginBottom: 30, opacity: prog(f, 0, 8)}}>EDIÇÃO PARA</div>
			<div style={{fontFamily: FONTE.titulo, fontWeight: 900, fontSize: ult ? 150 : 104, letterSpacing: 4, color: ult ? COR.vermelho : COR.creme, transform: `scale(${1.25 - prog(local, 0, 6) * 0.25})`, textShadow: ult ? `0 0 50px ${COR.vermelhoEscuro}` : '0 6px 30px #000'}}>
				{PUBLICO[k]}
			</div>
		</AbsoluteFill>
	);
};

// ── CTA ─────────────────────────────────────────────────────
const Cta: React.FC = () => {
	const f = useCurrentFrame();
	const pulso = 1 + Math.sin(f / 6) * 0.02 * prog(f, 80, 90);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{opacity: 0.3 * prog(f, 0, 30)}}>
				<OffthreadVideo src={staticFile('reels2/fundo.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)', transform: 'scale(1.15)'}} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, #050505 85%)'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 30, letterSpacing: 10, color: COR.creme, padding: '12px 28px', border: `2px solid ${COR.vermelho}`, opacity: prog(f, 0, 10), marginBottom: 60}}>
					● AGENDA ABERTA
				</div>
				<Linha txt="VOCÊ CRIA." f={f} t={8} tam={100} />
				<Linha txt="EU FAÇO" f={f} t={30} tam={100} />
				<Linha txt="PRENDER." f={f} t={42} tam={100} cor={COR.vermelho} />
				<div style={{marginTop: 70, fontFamily: FONTE.texto, fontStyle: 'italic', fontSize: 46, color: COR.cinza, opacity: prog(f, 70, 82)}}>
					manda <span style={{color: COR.creme, fontStyle: 'normal', fontFamily: FONTE.ui, fontWeight: 600}}>“EDITAR”</span> no direct
				</div>
				<div style={{marginTop: 40, opacity: prog(f, 80, 92), transform: `scale(${pulso})`}}>
					<div style={{fontFamily: FONTE.ui, fontWeight: 600, fontSize: 36, letterSpacing: 6, color: COR.creme, background: COR.vermelho, padding: '22px 44px', boxShadow: `0 0 50px ${COR.vermelhoEscuro}`}}>{PERFIL.botao} ✉</div>
				</div>
				<div style={{marginTop: 34, fontFamily: FONTE.ui, fontSize: 28, letterSpacing: 10, color: COR.cinza, opacity: prog(f, 92, 104)}}>{PERFIL.arroba || PERFIL.profissao}</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Sfx: React.FC<{som: string; em: number; vol?: number}> = ({som, em, vol = 0.6}) => (
	<Sequence from={Math.max(0, em)} layout="none">
		<Audio src={staticFile(`audio/${som}.wav`)} volume={vol} />
	</Sequence>
);

export const Reels2: React.FC = () => {
	const passos = PASSOS.map((_, i) => T.passos + i * DP);
	const publico = PUBLICO.map((_, i) => T.para + i * B);
	const batidas = [60, 75, ...passos, T.para + 6 * B, T.cta, T.cta + 42];
	return (
		<AbsoluteFill style={{backgroundColor: COR.preto}}>
			<Fundo />
			<Impacto batidas={batidas}>
				<Sequence durationInFrames={T.passos}><Gancho /></Sequence>
				{PASSOS.map((p, i) => (
					<Sequence key={p.nome} from={passos[i]} durationInFrames={DP}><Passo i={i} /></Sequence>
				))}
				<Sequence from={T.passos} durationInFrames={T.para - T.passos}><LinhaDoTempo /></Sequence>
				<Sequence from={T.para} durationInFrames={T.cta - T.para}><ParaQuem /></Sequence>
				<Sequence from={T.cta}><Cta /></Sequence>
			</Impacto>
			<Acabamento />

			<Audio src={staticFile('audio/trilha-reels2.wav')} volume={0.9} />
			<Sfx som="tecla" em={4} vol={0.6} />
			<Sfx som="tecla" em={16} vol={0.4} />
			<Sfx som="hit" em={60} vol={0.5} />
			<Sfx som="riser" em={T.passos - 90} vol={0.4} />
			{passos.map((s, i) => <Sfx key={'p' + i} som={i === 0 ? 'boom' : 'hit'} em={s} vol={i === 0 ? 0.8 : 0.45} />)}
			{passos.map((s, i) => <Sfx key={'w' + i} som="whoosh" em={s - 8} vol={0.3} />)}
			<Sfx som="tesoura" em={T.passos + 20} vol={0.5} />
			{publico.map((s, i) => <Sfx key={'q' + i} som={i === PUBLICO.length - 1 ? 'boom' : 'tecla'} em={s} vol={i === PUBLICO.length - 1 ? 0.7 : 0.5} />)}
			<Sfx som="acorde-final" em={T.cta} vol={0.8} />
			<Sfx som="boom" em={T.cta + 42} vol={0.6} />
		</AbsoluteFill>
	);
};
