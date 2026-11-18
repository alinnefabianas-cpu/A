import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BLOCOS, FASES, type Bloco} from './roteiro';
import {CORACAO, MOEDA, PALETA_CORACAO, PALETA_CORACAO_VAZIO, PALETA_MOEDA, PALETA_TROFEU, TROFEU, type Paleta} from './sprites';
import {COR, FONTE, grade, lerp, pisca, pop, prog} from './tema';

// ============================================================
// SPRITE: desenha um mapa de pixels (junta pixels vizinhos iguais).
// ============================================================
export const Sprite: React.FC<{
	mapa: string[];
	paleta: Paleta;
	x: number;
	y: number;
	px?: number;
	rot?: number;
	virado?: boolean;
	ponta?: boolean; // de cabeça pra baixo (espelha na vertical)
	escalaY?: number; // -1..1, usado para "virar" pela metade
	colunas?: [number, number];
	opacidade?: number;
}> = ({mapa, paleta, x, y, px = 8, rot = 0, virado, ponta, escalaY, colunas, opacidade = 1}) => {
	const largTotal = Math.max(...mapa.map((l) => l.length));
	const [c0, c1] = colunas ?? [0, largTotal - 1];
	const w = (c1 - c0 + 1) * px;
	const h = mapa.length * px;
	const rects: React.ReactNode[] = [];
	mapa.forEach((linha, r) => {
		let c = c0;
		while (c <= c1) {
			const ch = linha[c];
			if (!ch || ch === '.' || !paleta[ch]) {
				c++;
				continue;
			}
			let fim = c;
			while (fim + 1 <= c1 && linha[fim + 1] === ch) fim++;
			rects.push(<rect key={`${r}-${c}`} x={(c - c0) * px - w / 2} y={r * px - h / 2} width={(fim - c + 1) * px + 0.5} height={px + 0.5} fill={paleta[ch]} />);
			c = fim + 1;
		}
	});
	const sy = escalaY ?? (ponta ? -1 : 1);
	return (
		<g transform={`translate(${grade(x)} ${grade(y)}) rotate(${rot}) scale(${virado ? -1 : 1} ${sy})`} opacity={opacidade} shapeRendering="crispEdges">
			{rects}
		</g>
	);
};

// ============================================================
// TEXTO PIXEL com sombra dura
// ============================================================
export const TextoPixel: React.FC<{
	x: number;
	y: number;
	texto: string;
	tam?: number;
	cor?: string;
	ancora?: 'start' | 'middle' | 'end';
	t?: number;
	sai?: number;
	piscando?: boolean;
	fonte?: 'pixel' | 'texto';
}> = ({x, y, texto, tam = 40, cor = COR.branco, ancora = 'middle', t = -999, sai, piscando, fonte = 'pixel'}) => {
	const f = useCurrentFrame();
	if (f < t) return null;
	if (sai !== undefined && f >= sai) return null;
	if (piscando && !pisca(f - t, 12)) return null;
	// entrada "8-bit": escala em degraus
	const s = Math.min(1, Math.ceil(pop(f, t) * 4) / 4);
	const sombra = Math.max(3, Math.round(tam / 8));
	const ff = fonte === 'pixel' ? FONTE.pixel : FONTE.texto;
	const tamReal = fonte === 'pixel' ? tam * 1.3 : tam;
	return (
		<g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
			<text x={x + sombra} y={y + sombra} textAnchor={ancora} dominantBaseline="middle" fontFamily={ff} fontSize={tamReal} fill="#000" opacity={0.55}>
				{texto}
			</text>
			<text x={x} y={y} textAnchor={ancora} dominantBaseline="middle" fontFamily={ff} fontSize={tamReal} fill={cor}>
				{texto}
			</text>
		</g>
	);
};

/** Caixa com borda dupla (janela de RPG). */
export const Caixa: React.FC<{x: number; y: number; w: number; h: number; borda?: string; fundo?: string; children?: React.ReactNode}> = ({x, y, w, h, borda = COR.branco, fundo = COR.painel, children}) => (
	<g shapeRendering="crispEdges">
		<rect x={x} y={y} width={w} height={h} fill={fundo} />
		<rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill="none" stroke={borda} strokeWidth={6} />
		<rect x={x + 18} y={y + 18} width={w - 36} height={h - 36} fill="none" stroke={COR.linha} strokeWidth={3} />
		{children}
	</g>
);

/** Barra de vida/progresso em blocos. */
export const Barra: React.FC<{x: number; y: number; w: number; h?: number; valor: number; cor?: string; blocos?: number; rotulo?: string}> = ({x, y, w, h = 36, valor, cor = COR.verde, blocos = 10, rotulo}) => {
	const cheios = Math.round(Math.max(0, Math.min(1, valor)) * blocos);
	const bw = (w - 12) / blocos;
	return (
		<g shapeRendering="crispEdges">
			<rect x={x} y={y} width={w} height={h} fill="#000" stroke={COR.branco} strokeWidth={4} />
			{Array.from({length: cheios}, (_, i) => (
				<rect key={i} x={x + 6 + i * bw} y={y + 6} width={bw - 4} height={h - 12} fill={cor} />
			))}
			{rotulo && (
				<text x={x} y={y - 18} fontFamily={FONTE.pixel} fontSize={26} fill={COR.branco}>
					{rotulo}
				</text>
			)}
		</g>
	);
};

// ============================================================
// FUNDO: céu de noite com estrelas em pixel + scanlines de CRT
// ============================================================
export const Fundo: React.FC = () => {
	const f = useCurrentFrame();
	const estrelas = Array.from({length: 60}, (_, i) => {
		const x = grade((i * 389) % 1920);
		const y = grade((i * 211) % 1080);
		const liga = Math.floor((f + i * 7) / 20) % 4 !== 0;
		return liga ? <rect key={i} x={x} y={y} width={i % 6 === 0 ? 12 : 6} height={i % 6 === 0 ? 12 : 6} fill={i % 3 ? COR.linha : COR.ciano} opacity={i % 3 ? 1 : 0.6} /> : null;
	});
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${COR.ceu} 0%, ${COR.ceu2} 100%)`}}>
			<svg width={1920} height={1080} shapeRendering="crispEdges">
				{estrelas}
			</svg>
		</AbsoluteFill>
	);
};

export const CRT: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 5px)', boxShadow: 'inset 0 0 220px rgba(0,0,0,0.65)'}} />
);

// ============================================================
// HUD: vidas, fase e pontos (o vídeo inteiro é uma partida)
// ============================================================
const limpa = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** Frames globais em que cada palavra de destaque é dita pela primeira vez no trecho. */
export const MOMENTOS_DESTAQUE: {frame: number; bloco: number}[] = BLOCOS.flatMap((b) => {
	const vistos = new Set<string>();
	const dest = b.destaque.map(limpa);
	return b.palavras
		.filter((p) => {
			const k = limpa(p.txt);
			if (!dest.includes(k) || vistos.has(k)) return false;
			vistos.add(k);
			return true;
		})
		.map((p) => ({frame: b.inicio + p.ini, bloco: b.n}));
});

const quandoDisse = (bloco: number, palavra: string) => {
	const b = BLOCOS[bloco];
	const p = b.palavras.find((x) => limpa(x.txt).startsWith(limpa(palavra)));
	return b.inicio + (p?.ini ?? 0);
};

export const HUD: React.FC = () => {
	const f = useCurrentFrame();
	const pontos = MOMENTOS_DESTAQUE.filter((m) => m.frame <= f).length * 100;
	const b = [...BLOCOS].reverse().find((x) => x.inicio <= f) ?? BLOCOS[0];
	const tPerde = quandoDisse(10, 'lives');
	const tGanha = quandoDisse(10, 'screens');
	const vidas = f >= tGanha ? 9 : f >= tPerde ? 1 : 9;
	const dano = f >= tPerde && f < tPerde + 20 && pisca(f, 3);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}} shapeRendering="crispEdges">
			<rect x={0} y={0} width={1920} height={96} fill="#000" opacity={0.55} />
			<rect x={0} y={93} width={1920} height={3} fill={COR.linha} />
			<text x={48} y={60} fontFamily={FONTE.pixel} fontSize={31} fill={COR.branco}>
				LIVES
			</text>
			{Array.from({length: 9}, (_, i) => (
				<Sprite key={i} mapa={CORACAO} paleta={i < vidas && !dano ? PALETA_CORACAO : PALETA_CORACAO_VAZIO} x={230 + i * 54} y={50} px={6} />
			))}
			<text x={960} y={60} textAnchor="middle" fontFamily={FONTE.pixel} fontSize={39} fill={b.n === 9 ? COR.vermelho : COR.ciano}>
				{FASES[b.n]}
			</text>
			<Sprite mapa={MOEDA} paleta={PALETA_MOEDA} x={1500} y={48} px={6} />
			<text x={1872} y={60} textAnchor="end" fontFamily={FONTE.pixel} fontSize={36} fill={COR.amarelo}>
				{String(pontos).padStart(6, '0')}
			</text>
		</svg>
	);
};

/** "+100" subindo quando uma palavra-chave é dita. */
export const Pontinhos: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			{MOMENTOS_DESTAQUE.filter((m) => f >= m.frame && f < m.frame + 24).map((m, i) => {
				const k = (f - m.frame) / 24;
				return (
					<text key={i} x={1780} y={grade(150 - k * 40)} textAnchor="end" fontFamily={FONTE.pixel} fontSize={31} fill={COR.amarelo} opacity={1 - k}>
						+100
					</text>
				);
			})}
		</svg>
	);
};

// ============================================================
// LEGENDA em caixa de diálogo de RPG, com letra de pixel
// ============================================================
const MAX = 8;
export const Dialogo: React.FC<{b: Bloco}> = ({b}) => {
	const f = useCurrentFrame();
	if (f > b.fala + 8) return null;
	const grupos: number[][] = [];
	let atual: number[] = [];
	b.palavras.forEach((p, i) => {
		atual.push(i);
		if (atual.length >= MAX || /[.?!:]$/.test(p.txt)) {
			grupos.push(atual);
			atual = [];
		}
	});
	if (atual.length) grupos.push(atual);
	const g = grupos.find((gr) => f < b.palavras[gr[gr.length - 1]].fim + 2) ?? grupos[grupos.length - 1];
	const dest = new Set(b.destaque.map(limpa));
	const ultimo = b.palavras[g[g.length - 1]];
	const terminou = f >= ultimo.fim;
	return (
		<div style={{position: 'absolute', left: 140, right: 140, bottom: 36, height: 150}}>
			<svg width={1640} height={150} style={{position: 'absolute', inset: 0}}>
				<Caixa x={0} y={0} w={1640} h={150} />
				{terminou && pisca(f, 8) && <path d="M 1590 112 L 1614 112 L 1602 126 Z" fill={COR.branco} />}
			</svg>
			<div style={{position: 'absolute', inset: '0 60px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center', justifyContent: 'center', columnGap: 22, fontFamily: FONTE.texto, fontSize: 64, lineHeight: 1}}>
				{g.map((i) => {
					const p = b.palavras[i];
					if (f < p.ini) return <span key={i} style={{visibility: 'hidden'}}>{p.txt}</span>;
					const azul = dest.has(limpa(p.txt));
					return (
						<span key={i} style={{color: azul ? COR.amarelo : COR.branco, textShadow: '4px 4px 0 #000'}}>
							{p.txt}
						</span>
					);
				})}
			</div>
		</div>
	);
};

// ============================================================
// CARTÃO DE FASE: "FASE 1 / O GIRO / READY?"
// ============================================================
export const CartaoFase: React.FC<{numero: string; nome: string; ate: number}> = ({numero, nome, ate}) => {
	const f = useCurrentFrame();
	if (f >= ate) return null;
	const entra = Math.ceil(prog(f, 0, 10) * 6) / 6;
	return (
		<g>
			<rect x={0} y={grade(540 - 220 * entra)} width={1920} height={grade(440 * entra)} fill="#000" opacity={0.85} />
			{entra >= 1 && (
				<>
					<TextoPixel x={960} y={410} texto={numero} tam={110} cor={COR.ciano} t={4} />
					<TextoPixel x={960} y={560} texto={nome} tam={60} t={10} />
					<TextoPixel x={960} y={680} texto="READY?" tam={30} cor={COR.amarelo} t={16} piscando />
				</>
			)}
		</g>
	);
};

/** Aviso "ACHIEVEMENT UNLOCKED" que desce do canto. */
export const Conquista: React.FC<{t: number; texto: string; dur?: number}> = ({t, texto, dur = 75}) => {
	const f = useCurrentFrame();
	if (f < t || f > t + dur) return null;
	const k = Math.min(prog(f, t, t + 8), 1 - prog(f, t + dur - 8, t + dur));
	const w = Math.max(620, texto.length * 26 + 220);
	return (
		<g transform={`translate(${1920 - w - 40} ${grade(lerp(-200, 130, k))})`}>
			<Caixa x={0} y={0} w={w} h={130} borda={COR.amarelo} />
			<Sprite mapa={TROFEU} paleta={PALETA_TROFEU} x={80} y={65} px={8} />
			<text x={150} y={52} fontFamily={FONTE.pixel} fontSize={23} fill={COR.amarelo}>
				ACHIEVEMENT UNLOCKED
			</text>
			<text x={150} y={96} fontFamily={FONTE.pixel} fontSize={31} fill={COR.branco}>
				{texto}
			</text>
		</g>
	);
};

/** Linhas de vento (passando para cima durante a queda). */
export const Vento: React.FC<{x: number; w: number; veloc?: number; densidade?: number}> = ({x, w, veloc = 40, densidade = 14}) => {
	const f = useCurrentFrame();
	return (
		<g shapeRendering="crispEdges">
			{Array.from({length: densidade}, (_, i) => {
				const lx = grade(x + ((i * 137) % w));
				const ly = grade(1100 - ((f * veloc + i * 173) % 1250));
				return <rect key={i} x={lx} y={ly} width={6} height={60 + (i % 3) * 30} fill={COR.ciano} opacity={0.35} />;
			})}
		</g>
	);
};

/** Fachada de prédio com janelas; `rolagem` move as janelas (queda). */
export const Predio: React.FC<{x: number; w: number; topo: number; base: number; rolagem?: number; andarH?: number}> = ({x, w, topo, base, rolagem = 0, andarH = 96}) => {
	const cols = Math.floor((w - 24) / 60);
	const linhas = Math.ceil((base - topo) / andarH) + 2;
	const off = ((rolagem % andarH) + andarH) % andarH;
	return (
		<g shapeRendering="crispEdges">
			<rect x={x} y={topo} width={w} height={base - topo} fill={COR.predio} />
			<clipPath id={`clip-${x}`}>
				<rect x={x} y={topo} width={w} height={base - topo} />
			</clipPath>
			<g clipPath={`url(#clip-${x})`}>
				{Array.from({length: linhas}, (_, r) =>
					Array.from({length: cols}, (_, c) => {
						const acesa = (r * 7 + c * 3 + Math.floor(rolagem / andarH)) % 5 === 0;
						return <rect key={`${r}-${c}`} x={x + 24 + c * 60} y={grade(topo + r * andarH - off - andarH + 24)} width={36} height={48} fill={acesa ? COR.janelaAcesa : COR.janela} opacity={acesa ? 0.8 : 1} />;
					}),
				)}
			</g>
		</g>
	);
};
