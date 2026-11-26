// Peças visuais compartilhadas pelos episódios feitos à mão.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {H, W} from '../Cenarios';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Fundo: React.FC<{cor?: string}> = ({cor = '#ffe0b0'}) => (
	<g>
		<rect width={W} height={H} fill={cor} />
		<circle cx={540} cy={900} r={640} fill="rgba(255,255,255,0.28)" />
		{Array.from({length: 22}).map((_, i) => <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1920} r={14} fill="rgba(255,255,255,0.35)" />)}
	</g>
);

export const Sol: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`translate(${x}, ${y}) scale(${s}) rotate(${f})`}>
			{Array.from({length: 12}).map((_, i) => <rect key={i} x={-10} y={-190} width={20} height={60} rx={10} fill="#ffb000" transform={`rotate(${i * 30})`} />)}
			<circle r={110} fill="#ffd23f" stroke="#e89b00" strokeWidth={10} />
		</g>
	);
};

export function mix(a: string, b: string, t: number) {
	const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	const k = Math.max(0, Math.min(1, t));
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('');
}

// X vermelho grande (negação)
export const Xis: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-120 -120 L120 120 M120 -120 L-120 120" stroke="#e8262f" strokeWidth={34} strokeLinecap="round" />
	</g>
);
