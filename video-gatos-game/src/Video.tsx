import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CENAS} from './cenas';
import {CRT, Dialogo, Fundo, HUD, MOMENTOS_DESTAQUE, Pontinhos} from './componentes';
import {BLOCOS, DURACAO_TOTAL, em, type Bloco} from './roteiro';
import {prog} from './tema';

const TEM_VOZ = BLOCOS.some((b) => b.temVoz);

/** Troca de cena "8-bit": cortina de blocos. */
const Moldura: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const f = useCurrentFrame();
	const o = Math.round(Math.min(prog(f, 0, 6), 1 - prog(f, dur - 6, dur)) * 4) / 4;
	return (
		<AbsoluteFill style={{opacity: o}}>
			<svg width={1920} height={1080} viewBox="0 0 1920 1080">
				{children}
			</svg>
		</AbsoluteFill>
	);
};

type Som = {frame: number; arquivo: string; volume: number};
const g = (b: Bloco, p: string) => b.inicio + em(b, p);
const SONS: Som[] = [
	...MOMENTOS_DESTAQUE.map((m) => ({frame: m.frame, arquivo: 'moeda', volume: 0.22})),
	...BLOCOS.map((b) => ({frame: b.inicio, arquivo: 'blip', volume: 0.25})),
	...[3, 5, 7].map((n) => ({frame: BLOCOS[n].inicio + 2, arquivo: 'fase', volume: 0.35})),
	{frame: g(BLOCOS[0], 'bug'), arquivo: 'glitch', volume: 0.35},
	{frame: g(BLOCOS[3], 'pronto'), arquivo: 'powerup', volume: 0.3},
	{frame: g(BLOCOS[4], 'girar'), arquivo: 'pulo', volume: 0.35},
	{frame: BLOCOS[6].inicio, arquivo: 'queda', volume: 0.25},
	{frame: g(BLOCOS[7], 'esquilo'), arquivo: 'powerup', volume: 0.3},
	{frame: g(BLOCOS[7], 'impacto'), arquivo: 'pancada', volume: 0.35},
	{frame: g(BLOCOS[9], 'chefão'), arquivo: 'alarme', volume: 0.3},
	{frame: g(BLOCOS[10], 'vidas'), arquivo: 'dano', volume: 0.35},
	{frame: g(BLOCOS[10], 'tela'), arquivo: 'powerup', volume: 0.3},
];

export const Video: React.FC = () => (
	<AbsoluteFill>
		<Fundo />
		<Audio src={staticFile('audio/trilha.wav')} volume={TEM_VOZ ? 0.1 : 0.28} />
		{BLOCOS.map((b, i) => {
			const dur = i === BLOCOS.length - 1 ? DURACAO_TOTAL - b.inicio : b.total;
			const Cena = CENAS[b.cena];
			return (
				<Sequence key={i} from={b.inicio} durationInFrames={dur} name={`${String(i).padStart(2, '0')} ${b.cena}`}>
					<Moldura dur={dur}>
						<Cena b={b} />
					</Moldura>
					<Dialogo b={b} />
					{b.temVoz && <Audio src={staticFile(b.arquivo)} />}
				</Sequence>
			);
		})}
		<HUD />
		<Pontinhos />
		{SONS.map((s, i) => (
			<Sequence key={i} from={s.frame} durationInFrames={60}>
				<Audio src={staticFile(`audio/${s.arquivo}.wav`)} volume={s.volume} />
			</Sequence>
		))}
		<CRT />
	</AbsoluteFill>
);
