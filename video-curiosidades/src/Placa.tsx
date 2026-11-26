import React from 'react';

// placa curta em caixa alta (ex.: "NO!", "WRONG!"), entra com escala k (0..1)
export const Placa: React.FC<{x: number; y: number; k: number; txt: string; cor?: string; corTxt?: string; rot?: number; tam?: number}> = ({x, y, k, txt, cor = '#ffd23f', corTxt = '#000', rot = -6, tam = 100}) =>
	k > 0 ? (
		<g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${k})`}>
			<rect x={-(txt.length * tam * 0.33 + 50)} y={-tam * 0.85} width={txt.length * tam * 0.66 + 100} height={tam * 1.5} rx={28} fill={cor} stroke="#000" strokeWidth={12} />
			<text x={0} y={tam * 0.33} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={tam} fill={corTxt}>
				{txt}
			</text>
		</g>
	) : null;
