import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {Legenda} from './Legenda';
import {Vinheta} from './Video';
import {Cena, FIM_EXTRA, Palavra, marcaEm} from './roteiro';

// Props que toda cena de episódio recebe.
// m('palavra', n) = frame (relativo à cena) em que a n-ésima ocorrência da palavra começa a ser falada.
export type PropsCena = {dur: number; m: (palavra: string, n?: number) => number};

export type DefEpisodio = {
	id: string; // id da composição no Remotion (só letras e números)
	pastaVoz: string; // pasta em public/ com 00.mp3, 01.mp3…
	cenas: Cena[]; // montarCenas(FALAS, voz)
	componentes: React.FC<PropsCena>[]; // uma por fala, na mesma ordem
	destaques: Set<string>; // palavras em amarelo (só letras/números, minúsculas)
	volumeTrilha?: number;
};

// Player genérico: cena + vinheta + legenda palavra por palavra + voz + trilha.
export const PlayerEpisodio: React.FC<{ep: DefEpisodio}> = ({ep}) => {
	const mk = (palavras: Palavra[]) => (w: string, n?: number) => marcaEm(palavras, w, n ?? 1);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{ep.cenas.map((c) => {
				const C = ep.componentes[c.indice];
				const ultima = c.indice === ep.cenas.length - 1;
				return (
					<Sequence key={c.indice} from={c.inicio} durationInFrames={c.duracao + (ultima ? FIM_EXTRA : 0)}>
						<C dur={c.duracao} m={mk(c.palavras)} />
						<Vinheta />
						<Legenda palavras={c.palavras} destaques={ep.destaques} />
						<Audio src={staticFile(`${ep.pastaVoz}/${String(c.indice).padStart(2, '0')}.mp3`)} />
					</Sequence>
				);
			})}
			<Audio src={staticFile('audio/trilha.wav')} volume={(fr) => interpolate(fr, [0, 10], [0, ep.volumeTrilha ?? 0.12], {extrapolateRight: 'clamp'})} />
		</AbsoluteFill>
	);
};
