import React, {useContext, useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {ATRASO_VOZ, FPS, LINHA_DO_TEMPO, duracaoTotal, type Item, type Som, type Visual, type Voz} from './roteiro';
import {Acabamento, CONFIG_TATICAS, EpisodioCtx, type ConfigEpisodio, Palco, CartaoTatica, Capitulo, Citacao, Final, Fundo, Lista, TextoCinetico, Titulo} from './componentes';
import {VisualCena} from './visuais/Visuais';
import {fadeIO} from './tema';

type ItemTexto = Extract<Item, {tipo: 'texto'}>;

type Plano = {visual: Visual; inicio: number; frames: number; textos: ItemTexto[]};
type Evento = {som: Som | 'whoosh'; frame: number; volume: number};
const VOL: Partial<Record<Som, number>> = {boom: 0.8, hit: 0.75, riser: 0.45, whoosh: 0.5, coracao: 0.9, relogio: 0.5, 'caca-niquel': 0.5, glitch: 0.35, sussurro: 0.55, porta: 0.5, passo: 0.6, tesoura: 0.7, 'acorde-final': 0.8};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Frame (relativo ao bloco) em que cada palavra é dita: posição proporcional aos
 * caracteres, distribuída só pelos trechos com voz (as pausas não contam). */
export function temposPalavras(texto: string, voz: Voz): number[] {
	const palavras = texto.split(/\s+/);
	const regioes = voz.regioes.length ? voz.regioes : [[voz.inicio, voz.fim]];
	const fr = (t: number) => Math.max(0, ATRASO_VOZ + Math.round(t * FPS) - 3);
	const limpa = (w: string) => w.replace(/[“”"]/g, '');

	// Tenta casar cada trecho de voz com um trecho de texto entre pontuações
	const segmentar = (re: RegExp) => {
		const segs: number[][] = [];
		let atual: number[] = [];
		palavras.forEach((w, i) => {
			atual.push(i);
			if (re.test(limpa(w))) {
				segs.push(atual);
				atual = [];
			}
		});
		if (atual.length) segs.push(atual);
		return segs;
	};
	// Agrupa os trechos de voz em k blocos consecutivos (um por frase), escolhendo os
	// cortes que melhor casam a duração de cada bloco com o tamanho do texto da frase.
	const agrupar = (pesos: number[]): number[][] | null => {
		const k = pesos.length;
		const n = regioes.length;
		if (k > n) return null;
		const totalP = pesos.reduce((x, y) => x + y, 0);
		const totalD = regioes.reduce((x, [a, b]) => x + (b - a), 0);
		const durAte = [0];
		regioes.forEach(([a, b], i) => durAte.push(durAte[i] + (b - a)));
		const custo = (i: number, j: number, seg: number) => ((durAte[j] - durAte[i]) / totalD - pesos[seg] / totalP) ** 2;
		// melhor[seg][j] = menor custo usando as j primeiras regiões para os seg primeiros blocos
		const melhor = Array.from({length: k + 1}, () => Array(n + 1).fill(Infinity));
		const volta = Array.from({length: k + 1}, () => Array(n + 1).fill(0));
		melhor[0][0] = 0;
		for (let seg = 1; seg <= k; seg++)
			for (let j = seg; j <= n; j++)
				for (let i = seg - 1; i < j; i++) {
					const c = melhor[seg - 1][i] + custo(i, j, seg - 1);
					if (c < melhor[seg][j]) {
						melhor[seg][j] = c;
						volta[seg][j] = i;
					}
				}
		const out: number[][] = [];
		let j = n;
		for (let seg = k; seg >= 1; seg--) {
			const i = volta[seg][j];
			out.unshift([regioes[i][0], regioes[j - 1][1]]);
			j = i;
		}
		return out;
	};
	for (const re of [/[.,:;?!…]$/, /[.:;?!…]$/]) {
		const segs = segmentar(re);
		const grupos = agrupar(segs.map((seg) => seg.reduce((x, i) => x + palavras[i].length + 1, 0)));
		if (!grupos || grupos.length !== segs.length) continue;
		const regs = grupos;
		const out: number[] = [];
		segs.forEach((seg, k) => {
			const [a, b] = regs[k];
			const total = seg.reduce((s, i) => s + palavras[i].length + 1, 0);
			let acum = 0;
			for (const i of seg) {
				out[i] = fr(a + (acum / total) * (b - a));
				acum += palavras[i].length + 1;
			}
		});
		return out;
	}

	// Sem casamento: proporcional aos caracteres, só nos trechos com voz
	const total = palavras.reduce((s, w) => s + w.length + 1, 0);
	const fala = regioes.reduce((s, [a, b]) => s + (b - a), 0);
	let acum = 0;
	return palavras.map((w) => {
		let alvo = (acum / total) * fala;
		acum += w.length + 1;
		for (const [a, b] of regioes) {
			if (alvo <= b - a) return fr(a + alvo);
			alvo -= b - a;
		}
		return fr(voz.fim);
	});
}

/** Momento em que cada item da recapitulação é dito (primeira palavra de cada item). */
export function marcasLista(nomes: string[], it: Item): number[] {
	if (!it.voz) return nomes.map((_, i) => i * 26);
	const tempos = temposPalavras(nomes.join('. ') + '.', it.voz);
	let w = 0;
	return nomes.map((n) => {
		const t = tempos[w];
		w += n.split(/\s+/).length;
		return t;
	});
}

function montar(linha: Item[], nomes: string[]) {
	const narrado = linha.some((i) => i.voz);
	const somK = narrado ? 0.65 : 1;
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
				eventos.push({som: s, frame: Math.max(0, frame), volume: (VOL[s] ?? 0.6) * somK});
			}
		} else if (it.tipo === 'tatica' || it.tipo === 'titulo') {
			eventos.push({som: 'hit', frame: it.inicio, volume: 0.8});
			eventos.push({som: 'whoosh', frame: Math.max(0, it.inicio - 12), volume: 0.45});
		} else if (it.tipo === 'lista') {
			for (const mk of marcasLista(nomes, it)) eventos.push({som: 'boom', frame: it.inicio + mk, volume: 0.35 * somK});
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
		let v = narrado ? 0.13 : 0.32;
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
	const nomes = useContext(EpisodioCtx).nomes;
	switch (it.tipo) {
		case 'texto':
			return <TextoCinetico texto={it.texto} destaque={it.destaque} estilo={it.estilo} f={f} dur={it.frames} tempos={it.voz ? temposPalavras(it.texto, it.voz) : undefined} />;
		case 'titulo':
			return <Titulo f={f} dur={it.frames} />;
		case 'tatica':
			return <CartaoTatica numero={it.numero} nome={it.nome} visual={it.visual} f={f} dur={it.frames} />;
		case 'citacao':
			return <Citacao texto={it.texto} autor={it.autor} f={f} dur={it.frames} />;
		case 'lista':
			return <Lista f={f} dur={it.frames} marcas={it.voz ? marcasLista(nomes, it) : undefined} />;
		case 'final':
			return <Final texto={it.texto} f={f} dur={it.frames} cta={it.cta} />;
		default:
			return null;
	}
};

export const Video: React.FC<{linha?: Item[]; episodio?: ConfigEpisodio}> = ({linha = LINHA_DO_TEMPO, episodio = CONFIG_TATICAS}) => {
	const m = useMemo(() => montar(linha, episodio.nomes), [linha, episodio]);
	return (
		<EpisodioCtx.Provider value={episodio}>
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
			{m.linha.map((it, i) =>
				it.voz ? (
					<Sequence key={'v' + i} from={it.inicio + ATRASO_VOZ} layout="none">
						<Audio src={staticFile(it.voz.arquivo)} volume={1} />
					</Sequence>
				) : null,
			)}
			{m.eventos.map((e, i) => (
				<Sequence key={'s' + i} from={e.frame} layout="none">
					<Audio src={staticFile(`audio/${e.som}.wav`)} volume={e.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
		</EpisodioCtx.Provider>
	);
};
