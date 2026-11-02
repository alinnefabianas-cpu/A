import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CENAS} from './cenas';
import {Fundo, Legenda} from './componentes';
import {BLOCOS, DURACAO_TOTAL, type Bloco} from './roteiro';
import {prog} from './tema';

const TEM_VOZ = BLOCOS.some((b) => b.temVoz);

/** Cada cena entra com zoom leve e sai com fade. */
const Moldura: React.FC<{b: Bloco; dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const f = useCurrentFrame();
	const o = Math.min(prog(f, 0, 8), 1 - prog(f, dur - 8, dur));
	const z = interpolate(f, [0, dur], [1.0, 1.04]);
	return (
		<AbsoluteFill style={{opacity: o, transform: `scale(${z})`}}>
			<svg width={1920} height={1080} viewBox="0 0 1920 1080">
				{children}
			</svg>
		</AbsoluteFill>
	);
};

const limpa = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

export const Video: React.FC = () => (
	<AbsoluteFill>
		<Fundo />
		<Audio src={staticFile('audio/trilha.wav')} volume={TEM_VOZ ? 0.13 : 0.3} />
		{BLOCOS.map((b, i) => {
			const ultimo = i === BLOCOS.length - 1;
			const dur = ultimo ? DURACAO_TOTAL - b.inicio : b.total;
			const Cena = CENAS[b.cena];
			// "pop" sonoro na primeira vez que cada palavra de destaque é dita
			const vistos = new Set<string>();
			const pops = b.palavras.filter((p) => {
				const k = limpa(p.txt);
				if (!b.destaque.map(limpa).includes(k) || vistos.has(k)) return false;
				vistos.add(k);
				return true;
			});
			return (
				<Sequence key={i} from={b.inicio} durationInFrames={dur} name={`${String(i).padStart(2, '0')} ${b.cena}`}>
					<Moldura b={b} dur={dur}>
						<Cena b={b} />
					</Moldura>
					<Legenda b={b} />
					{b.temVoz && <Audio src={staticFile(b.arquivo)} />}
					<Sequence durationInFrames={30}>
						<Audio src={staticFile('audio/whoosh.wav')} volume={0.35} />
					</Sequence>
					{pops.map((p, j) => (
						<Sequence key={j} from={p.ini} durationInFrames={15}>
							<Audio src={staticFile('audio/pop.wav')} volume={0.3} />
						</Sequence>
					))}
				</Sequence>
			);
		})}
	</AbsoluteFill>
);
