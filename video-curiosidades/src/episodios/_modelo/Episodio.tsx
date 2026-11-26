// MODELO de episódio. Copie esta pasta para src/episodios/<slug>/ e edite.
// Referências completas de cenas prontas: src/Video.tsx (pilotos) e src/elevador/Elevador.tsx (elevador).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Personagem} from '../../Personagem';
import {H, Interrogacao, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import voz from './voz.json'; // gerado por: python3 scripts/medir-voz.py <slug>  (lê public/voz-<slug>/)

export const FALAS = [
	'Hook question here?',
	'Second line.',
	// … uma fala por cena (8 a 11 falas, ~45–55 s no total)
];

const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const t = m('question');
	const pop = usePop(t);
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 960, 1.05]} dur={dur} soco={t}>
				<rect width={W} height={H} fill="#3b5bb5" />
				<Personagem x={540} y={1700} roupa="passageiro" cor="#d9a03a" expressao={f >= t ? 'assustado' : 'neutro'} />
				{pop > 0 && <Interrogacao x={540} y={700} inicio={t} s={1.4} />}
			</Camera>
			<Sfx src="pop" em={t} vol={0.45} />
		</>
	);
};

const C1: React.FC<PropsCena> = ({dur}) => {
	const f = useCurrentFrame();
	return (
		<Camera de={[540, 960, 1.0]} para={[540, 960, 1.1]} dur={dur}>
			<rect width={W} height={H} fill="#5a8f6a" opacity={interpolate(f, [0, 10], [0.5, 1], {extrapolateRight: 'clamp'})} />
		</Camera>
	);
};

const ep: DefEpisodio = {
	id: 'Modelo',
	pastaVoz: 'voz-modelo',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1],
	destaques: new Set(['question']),
};
export default ep;
