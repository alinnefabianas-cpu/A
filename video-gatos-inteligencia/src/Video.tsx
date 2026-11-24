import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CENAS} from './cenas';
import {Legenda, Papel, Tremido} from './componentes';
import {BLOCOS, DURACAO_TOTAL, type Bloco} from './roteiro';
import {lerp, prog} from './tema';

const TEM_VOZ = BLOCOS.some((b) => b.temVoz);

/** Troca de página: a folha nova desliza da direita com uma sombra de papel. */
const Pagina: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const f = useCurrentFrame();
	const entra = prog(f, 0, 9);
	const sai = prog(f, dur - 6, dur);
	const x = lerp(240, 0, entra);
	return (
		<AbsoluteFill style={{opacity: Math.min(entra * 1.4, 1 - sai), transform: `translateX(${x}px) rotate(${lerp(1.2, 0, entra)}deg)`}}>
			<svg width={1920} height={1080} viewBox="0 0 1920 1080">
				<Tremido>{children}</Tremido>
			</svg>
		</AbsoluteFill>
	);
};

const limpa = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export const Video: React.FC = () => (
	<AbsoluteFill>
		<Papel />
		<Audio src={staticFile('audio/trilha.wav')} volume={TEM_VOZ ? 0.12 : 0.3} />
		{BLOCOS.map((b: Bloco, i) => {
			const dur = i === BLOCOS.length - 1 ? DURACAO_TOTAL - b.inicio : b.total;
			const Cena = CENAS[b.cena];
			const vistos = new Set<string>();
			const marcas = b.palavras.filter((p) => {
				const k = limpa(p.txt);
				if (!b.destaque.map(limpa).includes(k) || vistos.has(k)) return false;
				vistos.add(k);
				return true;
			});
			return (
				<Sequence key={i} from={b.inicio} durationInFrames={dur} name={`${String(i).padStart(2, '0')} ${b.cena}`}>
					<Pagina dur={dur}>
						<Cena b={b} />
					</Pagina>
					<Legenda b={b} />
					{b.temVoz && <Audio src={staticFile(b.arquivo)} />}
					<Sequence durationInFrames={20}>
						<Audio src={staticFile('audio/pagina.wav')} volume={0.35} />
					</Sequence>
					{marcas.map((p, j) => (
						<Sequence key={j} from={p.ini} durationInFrames={15}>
							<Audio src={staticFile('audio/rabisco.wav')} volume={0.18} />
						</Sequence>
					))}
				</Sequence>
			);
		})}
	</AbsoluteFill>
);
