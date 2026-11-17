// Vídeo longo (16:9): "13 Everyday Things With Secret Stories You Never Knew".
// Junta os 13 Shorts (public/longo/clipes/NN.mp4) numa contagem regressiva com abertura, chamadas e encerramento.
// Preparar os arquivos: bash scripts/preparar-longo.sh  (copia os MP4 de exportados/ e mede as durações)
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../Personagem';
import {Sfx} from '../Video';
import dur from './duracoes.json';
import {Painel} from '../elevador/cenarios';
import {JatoAntigo} from '../episodios/round-windows/arte';
import {PlacaPare} from '../episodios/stop-sign/arte';
import {Onibus} from '../episodios/yellow-bus/arte';
import {Estatua, Pedestal} from '../episodios/liberty-green/arte';
import {Frasco} from '../episodios/ketchup/arte';
import {Mona} from '../episodios/mona-lisa/arte';
import {Emu} from '../episodios/emu-war/arte';

export const FPS = 30;
const W = 1920, H = 1080;
const AZUL = '#1d2a66', AMARELO = '#ffd23f';
const f = (s: number) => Math.round(s * FPS);

type Cap = {num: number; titulo: [string, string]; icone: React.ReactNode; cor: string};

const ICONE = {
	elevador: <g transform="scale(0.32)"><Painel destaque /></g>,
	janela: <g transform="scale(0.42)"><JatoAntigo /></g>,
	pare: <g transform="scale(0.75)"><PlacaPare /></g>,
	onibus: <g transform="scale(0.36) translate(0, 200)"><Onibus anda={false} /></g>,
	piloto: <Personagem x={0} y={260} escala={0.42} roupa="comandante" expressao="feliz" />,
	viking: <Personagem x={0} y={260} escala={0.42} roupa="viking" cabelo="#c9762e" expressao="feliz" />,
	estatua: <g transform="translate(0, 200) scale(0.24)"><Pedestal /><Estatua idade={0} brilho={0.6} /></g>,
	ketchup: <g transform="scale(0.85) translate(0, 40)"><Frasco /></g>,
	napoleao: <Personagem x={0} y={260} escala={0.42} roupa="napoleao" cabelo="#2d1f17" expressao="serio" />,
	mona: <g transform="scale(0.55)"><Mona /></g>,
	danca: <Personagem x={0} y={260} escala={0.42} roupa="camponesa" cor="#b8577a" cabelo="#6b3a1f" expressao="enjoado" bracoD={150} bracoE={140} cotoveloD={20} cotoveloE={30} inclinar={10} />,
	maratona: <Personagem x={0} y={260} escala={0.42} roupa="corredor" cor="#f4f4f4" cabelo="#4a3326" numero="20" expressao="enjoado" enjoo={0.5} inclinar={10} />,
	emu: <g transform="translate(-30, 250) scale(0.62)"><Emu x={0} y={0} olho="feliz" medalha /></g>,
};

// ordem da contagem (o clipe NN.mp4 corresponde à posição na lista)
export const CAPITULOS: Cap[] = [
	{num: 13, titulo: ['The Elevator Button', 'That Lies'], icone: ICONE.elevador, cor: '#9aa1ad'},
	{num: 12, titulo: ['Why Plane Windows', 'Are Round'], icone: ICONE.janela, cor: '#3f8fdc'},
	{num: 11, titulo: ["The Stop Sign's", 'Hidden Rule'], icone: ICONE.pare, cor: '#d6262f'},
	{num: 10, titulo: ['Why School Buses', 'Are Yellow'], icone: ICONE.onibus, cor: '#f7b500'},
	{num: 9, titulo: ['The Pilot', 'Meal Rule'], icone: ICONE.piloto, cor: '#2b3d6b'},
	{num: 8, titulo: ['The Viking In', 'Your Phone'], icone: ICONE.viking, cor: '#1f6fd6'},
	{num: 7, titulo: ["Lady Liberty's", 'Real Color'], icone: ICONE.estatua, cor: '#76bca0'},
	{num: 6, titulo: ['Ketchup Was', 'Medicine'], icone: ICONE.ketchup, cor: '#e8392f'},
	{num: 5, titulo: ["Napoleon Wasn't", 'Short'], icone: ICONE.napoleao, cor: '#22397a'},
	{num: 4, titulo: ['The Theft Behind', 'The Mona Lisa'], icone: ICONE.mona, cor: '#8a3a3a'},
	{num: 3, titulo: ['The Dancing', 'Plague of 1518'], icone: ICONE.danca, cor: '#7a5a9a'},
	{num: 2, titulo: ['The Craziest', 'Olympic Race'], icone: ICONE.maratona, cor: '#c86a44'},
	{num: 1, titulo: ['The Great', 'Emu War'], icone: ICONE.emu, cor: '#d8a640'},
];

const V = dur as unknown as {voz: Record<string, number>; clipes: Record<string, number>};
const pad2 = (n: number) => String(n).padStart(2, '0');

// linha do tempo
export const LINHA = (() => {
	let t = 0;
	const intro = {inicio: 0, dur: f(V.voz['00'] + 1.2)};
	t += intro.dur;
	const caps = CAPITULOS.map((c, i) => {
		const chamada = {inicio: t, dur: f(V.voz[pad2(i + 1)] + 0.9)};
		t += chamada.dur;
		const clipe = {inicio: t, dur: Math.floor(V.clipes[pad2(i + 1)] * FPS) - 2};
		t += clipe.dur;
		return {c, i, chamada, clipe};
	});
	const outro = {inicio: t, dur: f(V.voz['14'] + 14)}; // espaço para a tela final do YouTube
	t += outro.dur;
	return {intro, caps, outro, total: t};
})();

const usePop = (inicio: number, damping = 10) => {
	const fr = useCurrentFrame();
	const {fps} = useVideoConfig();
	return fr < inicio ? 0 : spring({frame: fr - inicio, fps, config: {damping, stiffness: 180}});
};

// ---------- fundo da marca ----------
const Fundo: React.FC<{cor?: string}> = ({cor}) => {
	const fr = useCurrentFrame();
	return (
		<g>
			<defs>
				<radialGradient id="fundoLongo" cx="0.5" cy="0.45" r="0.8">
					<stop offset="0" stopColor={cor ?? '#3048a3'} />
					<stop offset="0.6" stopColor={AZUL} />
					<stop offset="1" stopColor="#0d1440" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#fundoLongo)" />
			{Array.from({length: 18}).map((_, i) => {
				const x = (i * 263 + fr * (0.4 + (i % 3) * 0.2)) % (W + 200) - 100;
				const y = (i * 137) % H;
				return (
					<text key={i} x={x} y={y} fontFamily="Nunito" fontWeight={900} fontSize={40 + (i % 4) * 22} fill={AMARELO} opacity={0.08 + (i % 3) * 0.03} transform={`rotate(${(i % 5) * 9 - 18} ${x} ${y})`}>
						?
					</text>
				);
			})}
		</g>
	);
};

const Texto: React.FC<{x: number; y: number; t: string; tam: number; cor?: string; ancora?: 'start' | 'middle' | 'end'; contorno?: number}> = ({x, y, t, tam, cor = '#fff', ancora = 'middle', contorno}) => (
	<text x={x} y={y} textAnchor={ancora} fontFamily="Nunito" fontWeight={900} fontSize={tam} fill={cor} stroke="#000" strokeWidth={contorno ?? tam * 0.12} paintOrder="stroke">
		{t}
	</text>
);

const Huey: React.FC<{x: number; y: number; s: number; expressao?: 'feliz' | 'assustado' | 'confuso' | 'pidao'; aponta?: boolean; olhar?: number}> = ({x, y, s, expressao = 'feliz', aponta, olhar = -1}) => (
	<Personagem x={x} y={y} escala={s} roupa="passageiro" cor={AMARELO} cabelo="#3d2a1e" expressao={expressao} olhar={olhar} bracoE={aponta ? 100 : 15} cotoveloE={aponta ? -10 : 10} fase={1} />
);

// ---------- abertura ----------
const Intro: React.FC<{d: number}> = ({d}) => {
	const fr = useCurrentFrame();
	const titulo = usePop(4, 12);
	const pos = [[230, 330], [1690, 330], [230, 800], [1690, 820], [560, 240], [1360, 250], [560, 860], [1360, 880]];
	const icones = [ICONE.pare, ICONE.emu, ICONE.mona, ICONE.ketchup, ICONE.elevador, ICONE.estatua, ICONE.viking, ICONE.onibus];
	const z = interpolate(fr, [0, d], [1.08, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
				<g transform={`translate(${W / 2} ${H / 2}) scale(${z}) translate(${-W / 2} ${-H / 2})`}>
					<Fundo />
					{icones.map((ic, i) => {
						const k = usePop(10 + i * 8, 9);
						const [x, y] = pos[i];
						return k > 0 ? <g key={i} transform={`translate(${x}, ${y + Math.sin(fr / 12 + i) * 10}) scale(${k * 0.85}) rotate(${Math.sin(fr / 20 + i) * 6})`}>{ic}</g> : null;
					})}
					{titulo > 0 && (
						<g transform={`translate(${W / 2}, ${H / 2 - 20}) scale(${titulo})`}>
							<rect x={-560} y={-210} width={1120} height={380} rx={40} fill="rgba(13,20,64,0.85)" stroke={AMARELO} strokeWidth={10} />
							<Texto x={0} y={-90} t="13 EVERYDAY THINGS" tam={110} cor={AMARELO} />
							<Texto x={0} y={30} t="WITH SECRET STORIES" tam={92} />
							<Texto x={0} y={120} t="you never knew" tam={54} cor="#9fd3ff" contorno={6} />
						</g>
					)}
				</g>
			</svg>
			<Audio src={staticFile('longo/voz/00.mp3')} />
			<Sfx src="boom" em={4} vol={0.5} />
			{[10, 18, 26, 34, 42, 50, 58, 66].map((t) => <Sfx key={t} src="pop" em={t} vol={0.25} />)}
		</AbsoluteFill>
	);
};

// ---------- chamada do capítulo ("#13 …") ----------
const Chamada: React.FC<{cap: Cap; i: number; d: number}> = ({cap, i, d}) => {
	const fr = useCurrentFrame();
	const num = usePop(0, 8);
	const tit = usePop(6, 11);
	const ic = usePop(10, 10);
	const sai = interpolate(fr, [d - 6, d], [1, 0], {extrapolateLeft: 'clamp'});
	return (
		<AbsoluteFill>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
				<Fundo cor={cap.cor} />
				<g opacity={sai}>
					<g transform={`translate(560, 520) scale(${num * (1 + 0.15 * Math.exp(-fr / 4))}) rotate(${(1 - num) * -30})`}>
						<Texto x={0} y={150} t={`#${cap.num}`} tam={cap.num >= 10 ? 400 : 460} cor={AMARELO} contorno={40} />
					</g>
					{tit > 0 && (
						<g transform={`translate(560, 880) scale(${tit})`}>
							<Texto x={0} y={0} t={cap.titulo[0].toUpperCase()} tam={70} />
							<Texto x={0} y={84} t={cap.titulo[1].toUpperCase()} tam={70} cor={AMARELO} />
						</g>
					)}
					{ic > 0 && (
						<g transform={`translate(1380, 520) scale(${ic * 1.25}) rotate(${Math.sin(fr / 8) * 4})`}>
							<circle r={330} fill="rgba(255,255,255,0.12)" stroke={AMARELO} strokeWidth={8} strokeDasharray="30 18" />
							{cap.icone}
						</g>
					)}
				</g>
			</svg>
			<Audio src={staticFile(`longo/voz/${pad2(i + 1)}.mp3`)} />
			<Audio src={staticFile('audio/trilha.wav')} volume={0.1} />
			<Sfx src="whoosh" em={0} vol={0.5} />
			<Sfx src="boom" em={2} vol={0.45} />
		</AbsoluteFill>
	);
};

// ---------- clipe com painéis laterais ----------
const VW = 608; // largura do vídeo vertical (1080 × 9/16)
const Clipe: React.FC<{cap: Cap; i: number; d: number}> = ({cap, i, d}) => {
	const fr = useCurrentFrame();
	const lateral = usePop(0, 14);
	const exp: Array<'feliz' | 'assustado' | 'confuso' | 'pidao'> = ['feliz', 'confuso', 'assustado', 'pidao'];
	const e = exp[Math.floor(fr / (FPS * 6)) % exp.length];
	const cta = cap.num === 7 && fr > f(20) && fr < f(28);
	return (
		<AbsoluteFill>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute'}}>
				<Fundo cor={cap.cor} />
				{/* painel esquerdo: número e título */}
				<g transform={`translate(${-400 * (1 - lateral)}, 0)`}>
					<Texto x={330} y={430} t={`#${cap.num}`} tam={260} cor={AMARELO} contorno={26} />
					<Texto x={330} y={560} t={cap.titulo[0]} tam={50} />
					<Texto x={330} y={625} t={cap.titulo[1]} tam={50} cor={AMARELO} />
					<g transform="translate(330, 830) scale(0.62)">{cap.icone}</g>
				</g>
				{/* painel direito: Huey + contagem */}
				<g transform={`translate(${400 * (1 - lateral)}, 0)`}>
					<Huey x={1590} y={760} s={0.62} expressao={e} olhar={-1} />
					<g transform="translate(1590, 860)">
						{CAPITULOS.map((c, k) => {
							const col = k % 7, lin = Math.floor(k / 7);
							const atual = k === i, feito = k < i;
							return (
								<g key={k} transform={`translate(${(col - 3) * 66}, ${lin * 70})`}>
									<circle r={28} fill={atual ? AMARELO : feito ? '#5a6aa8' : 'rgba(255,255,255,0.12)'} stroke={atual ? '#000' : 'rgba(255,255,255,0.4)'} strokeWidth={atual ? 5 : 3} />
									<text x={0} y={10} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={26} fill={atual ? '#000' : '#fff'}>{c.num}</text>
								</g>
							);
						})}
					</g>
					<g transform="translate(1590, 210)">
						<rect x={-200} y={-50} width={400} height={90} rx={45} fill="rgba(0,0,0,0.35)" stroke={AMARELO} strokeWidth={5} />
						<path d="M-160 -4 L-142 14 L-110 -20" stroke="#5aff7a" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
						<text x={20} y={10} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill="#fff">FACT-CHECKED</text>
					</g>
				</g>
				{/* moldura do vídeo */}
				<rect x={W / 2 - VW / 2 - 10} y={-10} width={VW + 20} height={H + 20} fill="#000" stroke={AMARELO} strokeWidth={8} />
				{/* barra de progresso do vídeo inteiro */}
				<rect x={0} y={H - 10} width={W} height={10} fill="rgba(255,255,255,0.15)" />
			</svg>
			<div style={{position: 'absolute', left: W / 2 - VW / 2, top: 0, width: VW, height: H, overflow: 'hidden'}}>
				<OffthreadVideo src={staticFile(`longo/clipes/${pad2(i + 1)}.mp4`)} style={{width: VW, height: H}} />
			</div>
			{cta && (
				<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute'}}>
					<g transform={`translate(330, 980) scale(${Math.min(1, (fr - f(20)) / 8)})`}>
						<rect x={-230} y={-48} width={460} height={96} rx={48} fill="#e8262f" stroke="#000" strokeWidth={6} />
						<text x={0} y={14} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={40} fill="#fff">SUBSCRIBE</text>
					</g>
				</svg>
			)}
		</AbsoluteFill>
	);
};

// ---------- encerramento ----------
const Outro: React.FC<{d: number}> = ({d}) => {
	const fr = useCurrentFrame();
	const sub = usePop(f(V.voz['14']) - 20, 9);
	return (
		<AbsoluteFill>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
				<Fundo />
				<Huey x={300} y={1060} s={1.05} expressao="feliz" aponta olhar={1} />
				<Texto x={1150} y={190} t="WHICH ONE SURPRISED YOU?" tam={74} cor={AMARELO} />
				<Texto x={1150} y={270} t="tell me in the comments" tam={44} cor="#9fd3ff" contorno={5} />
				{/* espaço para os elementos da tela final do YouTube */}
				{[[860, 560], [1440, 560]].map(([x, y], k) => (
					<g key={k}>
						<rect x={x - 260} y={y - 150} width={520} height={300} rx={20} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth={4} strokeDasharray="18 12" />
						<text x={x} y={y + 14} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={36} fill="rgba(255,255,255,0.5)">WATCH NEXT</text>
					</g>
				))}
				{sub > 0 && (
					<g transform={`translate(1150, 900) scale(${sub * (1 + 0.04 * Math.sin(fr / 5))})`}>
						<rect x={-260} y={-64} width={520} height={128} rx={64} fill="#e8262f" stroke="#000" strokeWidth={8} />
						<text x={0} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={62} fill="#fff">SUBSCRIBE</text>
					</g>
				)}
			</svg>
			<Audio src={staticFile('longo/voz/14.mp3')} />
			<Audio src={staticFile('audio/trilha.wav')} volume={(t) => interpolate(t, [0, 20, d - 40, d], [0, 0.14, 0.14, 0], {extrapolateRight: 'clamp'})} />
			<Sfx src="ding" em={f(V.voz['14']) - 20} vol={0.4} />
		</AbsoluteFill>
	);
};

export const Longo: React.FC = () => {
	const fr = useCurrentFrame();
	const L = LINHA;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence from={L.intro.inicio} durationInFrames={L.intro.dur}><Intro d={L.intro.dur} /></Sequence>
			{L.caps.map(({c, i, chamada, clipe}) => (
				<React.Fragment key={i}>
					<Sequence from={chamada.inicio} durationInFrames={chamada.dur}><Chamada cap={c} i={i} d={chamada.dur} /></Sequence>
					<Sequence from={clipe.inicio} durationInFrames={clipe.dur}><Clipe cap={c} i={i} d={clipe.dur} /></Sequence>
				</React.Fragment>
			))}
			<Sequence from={L.outro.inicio} durationInFrames={L.outro.dur}><Outro d={L.outro.dur} /></Sequence>
			{/* barra de progresso global */}
			<div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${(fr / L.total) * 100}%`, background: AMARELO}} />
		</AbsoluteFill>
	);
};

// ---------- thumbnail 1280x720 ----------
export const ThumbLongo: React.FC = () => (
	<svg viewBox="0 0 1280 720" width={1280} height={720}>
		<defs>
			<radialGradient id="thumbL" cx="0.35" cy="0.5" r="0.8">
				<stop offset="0" stopColor="#3048a3" />
				<stop offset="1" stopColor="#0d1440" />
			</radialGradient>
		</defs>
		<rect width={1280} height={720} fill="url(#thumbL)" />
		<circle cx={300} cy={420} r={300} fill="rgba(255,210,63,0.18)" />
		<g transform="translate(250, 700) scale(0.85)"><Emu x={0} y={0} olho="feliz" medalha /></g>
		<Personagem x={560} y={760} escala={0.62} roupa="soldado" expressao="assustado" olhar={-1} fase={1} />
		<g transform="translate(1150, 590) scale(0.42)"><PlacaPare /></g>
		<g transform="translate(940, 470) scale(0.36) rotate(8)"><Mona /></g>
		<text x={1240} y={130} textAnchor="end" fontFamily="Nunito" fontWeight={900} fontSize={104} fill="#ffd23f" stroke="#000" strokeWidth={14} paintOrder="stroke">LOST TO</text>
		<text x={1240} y={240} textAnchor="end" fontFamily="Nunito" fontWeight={900} fontSize={104} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">BIRDS?!</text>
		<g transform="translate(40, 580)">
			<rect x={0} y={0} width={440} height={110} rx={24} fill="#e8262f" stroke="#000" strokeWidth={8} />
			<text x={220} y={74} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={56} fill="#fff">13 SECRETS</text>
		</g>
	</svg>
);
