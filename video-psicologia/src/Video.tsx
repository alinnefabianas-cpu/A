import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {LINHA_DO_TEMPO, duracaoTotal, type Item, type Som, type Visual} from './roteiro';
import {Acabamento, Palco, CartaoTatica, Capitulo, Citacao, Final, Fundo, Lista, TextoCinetico, Titulo} from './componentes';
import {VisualCena} from './visuais/Visuais';
import {fadeIO} from './tema';

type ItemTexto = Extract<Item, {tipo: 'texto'}>;

type Plano = {visual: Visual; inicio: number; frames: number; textos: ItemTexto[]};
type Evento = {som: Som | 'whoosh'; frame: number; volume: number};
const VOL: Partial<Record<Som, number>> = {boom: 0.8, hit: 0.75, riser: 0.45, whoosh: 0.5, coracao: 0.9, relogio: 0.5, 'caca-niquel': 0.5, glitch: 0.35, sussurro: 0.55, porta: 0.5, passo: 0.6, tesoura: 0.7, 'acorde-final': 0.8};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

function montar(linha: Item[]) {
	const total = duracaoTotal(linha);
	// Junta textos seguidos com o mesmo visual num único plano (a animação continua entre frases)
	const planos: Plano[] = [];
	for (const it of linha) {
		if (it.tipo !== 'texto') continue;
		const ult = planos[planos.length - 1];
		if (ult && ult.visual === it.visual && ult.inicio + ult.frames === it.inicio) {
			ult.frames += it.frames;
			ult.textos.push(it);
		} else planos.push({visual: it.visual, inicio: it.inicio, frames: it.frames, textos: [it]});
	}

	// Efeitos sonoros posicionados na linha do tempo
	const eventos: Evento[] = [];
	for (const it of linha) {
		if (it.tipo === 'texto') {
			for (const s of it.sons ?? []) {
				// o riser termina exatamente no começo do próximo bloco
				const frame = s === 'riser' ? it.inicio + it.frames - 90 : it.inicio + 4;
				eventos.push({som: s, frame: Math.max(0, frame), volume: VOL[s] ?? 0.6});
			}
		} else if (it.tipo === 'tatica' || it.tipo === 'titulo') {
			eventos.push({som: 'hit', frame: it.inicio, volume: 0.8});
			eventos.push({som: 'whoosh', frame: Math.max(0, it.inicio - 12), volume: 0.45});
		} else if (it.tipo === 'lista') {
			for (let i = 0; i < 7; i++) eventos.push({som: 'boom', frame: it.inicio + i * 26, volume: 0.35});
		} else if (it.tipo === 'citacao') {
			eventos.push({som: 'whoosh', frame: it.inicio, volume: 0.4});
		} else if (it.tipo === 'final') {
			eventos.push({som: 'acorde-final', frame: it.inicio, volume: 0.8});
			eventos.push({som: 'boom', frame: it.inicio + 40, volume: 0.6});
		}
	}
	const impactos = eventos.filter((e) => e.som === 'boom' || e.som === 'hit').map((e) => ({frame: e.frame, forca: e.volume}));

	// Janelas sem trilha (silêncio dramático)
	const silencios = linha.filter((i) => i.tipo === 'silencio').map((i) => [i.inicio, i.inicio + i.frames] as const);
	const volumeTrilha = (f: number) => {
		let v = 0.32;
		for (const [a, b] of silencios) v *= 1 - Math.min(interpolate(f, [a - 6, a], [0, 1], cl), interpolate(f, [b - 4, b + 30], [1, 0], cl));
		return v * interpolate(f, [0, 45], [0, 1], cl) * interpolate(f, [total - 120, total], [1, 0], cl);
	};

	// Capítulos (indicador "TÁTICA 03 / 07") — só no vídeo longo
	const taticas = linha.filter((i): i is Extract<Item, {tipo: 'tatica'}> => i.tipo === 'tatica');
	const idxLista = linha.findIndex((i) => i.tipo === 'lista');
	const fimCapitulos = idxLista > 0 ? linha[idxLista - 1].inicio : -1;

	return {linha, planos, eventos, impactos, volumeTrilha, taticas, fimCapitulos};
}
type Montagem = ReturnType<typeof montar>;

const PlanoVisual: React.FC<{plano: Plano; indice: number; m: Montagem}> = ({plano, indice, m}) => {
	const f = useCurrentFrame();
	const global = plano.inicio + f;
	const atual = m.linha.find((i) => global >= i.inicio && global < i.inicio + i.frames);
	const foco = atual?.tipo === 'texto' && (atual.estilo === 'grande' || atual.estilo === 'fala');
	const transF = atual ? global - atual.inicio : 99;
	const dim = foco ? interpolate(transF, [0, 12], [0.85, 0.28], {extrapolateRight: 'clamp'}) : 0.9;
	const zoom = 1.02 + (f / plano.frames) * 0.1;
	const dir = indice % 2 ? 1 : -1;
	const dx = dir * (f / plano.frames) * 40;
	return (
		<AbsoluteFill style={{opacity: fadeIO(f, plano.frames, 12, 12) * dim, filter: foco ? 'blur(3px)' : undefined}}>
			<AbsoluteFill style={{transform: `translate(${dx}px, -40px) scale(${zoom})`}}>
				<Palco>
					<VisualCena nome={plano.visual} f={f} dur={plano.frames} />
				</Palco>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Camera: React.FC<{children: React.ReactNode; m: Montagem}> = ({children, m}) => {
	const f = useCurrentFrame();
	let sx = 0;
	let sy = 0;
	let flash = 0;
	for (const imp of m.impactos) {
		const d = f - imp.frame;
		if (d < 0 || d > 30) continue;
		const k = Math.exp(-d / 5) * imp.forca;
		sx += (random('sx' + f) - 0.5) * 30 * k;
		sy += (random('sy' + f) - 0.5) * 30 * k;
		flash = Math.max(flash, Math.exp(-d / 3) * imp.forca * 0.35);
	}
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${1 + flash * 0.05})`}}>{children}</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(255,220,200,0.6), rgba(208,31,42,0.25) 50%, rgba(0,0,0,0) 80%)', opacity: flash, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

const IndicadorCapitulo: React.FC<{m: Montagem}> = ({m}) => {
	const f = useCurrentFrame();
	const TATICAS_T = m.taticas;
	const FIM_CAPITULOS = m.fimCapitulos;
	if (!TATICAS_T.length || f < TATICAS_T[0].inicio || f >= FIM_CAPITULOS) return null;
	let k = 0;
	while (k + 1 < TATICAS_T.length && f >= TATICAS_T[k + 1].inicio) k++;
	const t = TATICAS_T[k];
	const fim = k + 1 < TATICAS_T.length ? TATICAS_T[k + 1].inicio : FIM_CAPITULOS;
	const local = f - t.inicio;
	const op = Math.min(interpolate(local, [t.frames, t.frames + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), interpolate(f, [fim - 15, fim], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	return <Capitulo numero={t.numero} progresso={(f - t.inicio) / (fim - t.inicio)} op={op * 0.9} />;
};

const Bloco: React.FC<{it: Item}> = ({it}) => {
	const f = useCurrentFrame();
	switch (it.tipo) {
		case 'texto':
			return <TextoCinetico texto={it.texto} destaque={it.destaque} estilo={it.estilo} f={f} dur={it.frames} />;
		case 'titulo':
			return <Titulo f={f} dur={it.frames} />;
		case 'tatica':
			return <CartaoTatica numero={it.numero} nome={it.nome} visual={it.visual} f={f} dur={it.frames} />;
		case 'citacao':
			return <Citacao texto={it.texto} autor={it.autor} f={f} dur={it.frames} />;
		case 'lista':
			return <Lista f={f} dur={it.frames} />;
		case 'final':
			return <Final texto={it.texto} f={f} dur={it.frames} cta={it.cta} />;
		default:
			return null;
	}
};

export const Video: React.FC<{linha?: Item[]}> = ({linha = LINHA_DO_TEMPO}) => {
	const m = useMemo(() => montar(linha), [linha]);
	return (
		<AbsoluteFill style={{backgroundColor: '#050505'}}>
			<Fundo />
			<Camera m={m}>
				{m.planos.map((p, i) => (
					<Sequence key={'p' + i} from={p.inicio} durationInFrames={p.frames} layout="none">
						<PlanoVisual plano={p} indice={i} m={m} />
					</Sequence>
				))}
				{m.linha.map((it, i) => (
					<Sequence key={'b' + i} from={it.inicio} durationInFrames={it.frames} layout="none">
						<Bloco it={it} />
					</Sequence>
				))}
			</Camera>
			<IndicadorCapitulo m={m} />
			<Acabamento />

			<Audio src={staticFile('audio/trilha.wav')} volume={m.volumeTrilha} />
			{m.eventos.map((e, i) => (
				<Sequence key={'s' + i} from={e.frame} layout="none">
					<Audio src={staticFile(`audio/${e.som}.wav`)} volume={e.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
