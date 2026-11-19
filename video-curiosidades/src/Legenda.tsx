import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {DESTAQUES, Lingua, Palavra} from './roteiro';

// Uma palavra por vez, grande, branca com contorno preto grosso (estilo Shorts).
export const Legenda: React.FC<{palavras: Palavra[]; lingua?: Lingua; destaques?: Set<string>; y?: number}> = ({palavras, lingua = 'pt', destaques, y = 1250}) => {
	const f = useCurrentFrame();
	let atual: Palavra | undefined;
	for (const p of palavras) if (f >= p.inicio) atual = p;
	if (!atual) return null;
	const ultima = palavras[palavras.length - 1];
	if (atual === ultima && f > ultima.fim + 10) return null;
	const limpa = atual.texto.replace(/[.,!?;:…]+$/g, '').replace(/^[.…]+/, '');
	const chave = limpa.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
	const destaque = (destaques ?? DESTAQUES[lingua]).has(chave);
	const t = f - atual.inicio;
	const s = interpolate(t, [0, 3, 6], [0.72, 1.12, 1], {extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y,
				display: 'flex',
				justifyContent: 'center',
				transform: `scale(${s})`,
				transformOrigin: '50% 50%',
			}}
		>
			<span
				style={{
					fontFamily: 'Nunito',
					fontWeight: 900,
					fontSize: limpa.length > 11 ? 104 : 124,
					color: destaque ? '#ffd23f' : '#ffffff',
					WebkitTextStroke: '22px #000',
					paintOrder: 'stroke fill',
					letterSpacing: -1,
					lineHeight: 1,
					textShadow: '0 8px 0 rgba(0,0,0,0.35)',
				}}
			>
				{limpa}
			</span>
		</div>
	);
};
