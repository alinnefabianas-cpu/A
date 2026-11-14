import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {Estrelas, H, Nuvem, W} from '../../Cenarios';

// ---------- céu (dia ou tempestade) ----------
export const Ceu: React.FC<{tempestade?: boolean; children?: React.ReactNode}> = ({tempestade, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceuRW" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={tempestade ? '#1b1530' : '#3f8fdc'} />
					<stop offset="1" stopColor={tempestade ? '#6b2a3a' : '#bfe3ff'} />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuRW)" />
			{tempestade && <Estrelas n={30} h={900} />}
			{[0, 1, 2, 3].map((i) => (
				<Nuvem key={i} x={((i * 520 - f * (3 + i)) % 2000) + 1500} y={420 + i * 380} s={1.4 + (i % 2) * 0.6} cor={tempestade ? '#3a2a4a' : '#ffffff'} op={tempestade ? 0.8 : 0.9} />
			))}
			{tempestade && f % 50 < 3 && <rect width={W} height={H} fill="rgba(255,255,255,0.35)" />}
			{children}
		</g>
	);
};

// ---------- o primeiro jato comercial (design próprio, janelas quase quadradas) ----------
// partido: 0 = inteiro, 1 = partido em dois (afastado)
export const JatoAntigo: React.FC<{s?: number; partido?: number; destaque?: boolean}> = ({s = 1, partido = 0, destaque}) => {
	const f = useCurrentFrame();
	const janelas = (x0: number, n: number) =>
		Array.from({length: n}).map((_, i) => (
			<rect key={i} x={x0 + i * 46} y={44} width={30} height={30} rx={4} fill="#ffe58a" stroke={destaque ? '#e8262f' : CONTORNO} strokeWidth={destaque ? 7 : 4} />
		));
	const tras = (
		<g>
			<path d="M60 40 L-10 -110 L70 -110 L170 20Z" fill="#c9d3e8" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
			<path d="M40 60 C40 10 80 0 140 0 L380 0 L380 160 L120 160 C60 160 30 130 40 60Z" fill="#f4f6fb" stroke={CONTORNO} strokeWidth={9} />
			<path d="M50 104 L380 104" stroke="#b8322a" strokeWidth={14} />
			{janelas(160, 5)}
		</g>
	);
	const frente = (
		<g>
			<path d="M380 0 L640 0 C720 0 770 40 780 90 C770 140 720 160 640 160 L380 160Z" fill="#f4f6fb" stroke={CONTORNO} strokeWidth={9} />
			<path d="M380 104 L770 104" stroke="#b8322a" strokeWidth={14} />
			{janelas(400, 6)}
			<path d="M700 40 C735 40 758 58 767 78 L705 78 Z" fill="#1d2a66" stroke={CONTORNO} strokeWidth={6} />
			<path d="M330 120 L230 250 L330 250 L470 120Z" fill="#e2e8f5" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
		</g>
	);
	return (
		<g transform={`scale(${s}) translate(-390,-80)`}>
			<g transform={`translate(${-partido * 90}, ${partido * 60}) rotate(${-partido * 14} 380 80)`}>{tras}</g>
			<g transform={`translate(${partido * 90}, ${partido * 30}) rotate(${partido * 16} 380 80)`}>{frente}</g>
			{partido > 0 && partido < 0.9 && (
				<g transform="translate(380, 80)" fill="#ffd23f" stroke="#000" strokeWidth={5}>
					<path d="M0 -90 L22 -24 L90 -34 L34 10 L60 80 L0 34 L-60 80 L-34 10 L-90 -34 L-22 -24Z" opacity={1 - partido} />
				</g>
			)}
			{partido === 0 && f % 30 < 4 && <circle cx={250} cy={248} r={12} fill="#ff4d4d" />}
		</g>
	);
};

// ---------- janela da cabine em close (forma: 0 = redonda, 1 = quadrada) ----------
export const JanelaCabine: React.FC<{forma: number; rach?: number; brilhoCantos?: number; ceuNoite?: boolean}> = ({forma, rach = 0, brilhoCantos = 0, ceuNoite}) => {
	const f = useCurrentFrame();
	const r = 170 * (1 - forma) + 26 * forma; // raio dos cantos
	return (
		<g>
			<defs>
				<linearGradient id="paredeCab" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#d6dae3" />
					<stop offset="0.5" stopColor="#eef1f6" />
					<stop offset="1" stopColor="#c9ced9" />
				</linearGradient>
				<linearGradient id="vistaCeu" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={ceuNoite ? '#141e45' : '#4a9be6'} />
					<stop offset="1" stopColor={ceuNoite ? '#3b4c95' : '#d6efff'} />
				</linearGradient>
				<clipPath id="vidroCab"><rect x={370} y={620} width={340} height={480} rx={r} /></clipPath>
			</defs>
			<rect width={W} height={H} fill="url(#paredeCab)" />
			<path d="M0 1500 H1080 V1920 H0Z" fill="#b9bfcc" />
			<rect x={330} y={580} width={420} height={560} rx={r + 30} fill="#c3c8d4" stroke={CONTORNO} strokeWidth={10} />
			<rect x={370} y={620} width={340} height={480} rx={r} fill="url(#vistaCeu)" stroke={CONTORNO} strokeWidth={10} />
			<g clipPath="url(#vidroCab)">
				{[0, 1].map((i) => <Nuvem key={i} x={((i * 300 - f * 4) % 700) + 900} y={900 + i * 120} s={0.9} cor="#ffffff" op={0.9} />)}
				<path d="M380 640 L520 640 L400 900Z" fill="rgba(255,255,255,0.18)" />
			</g>
			{/* brilho de tensão nos cantos */}
			{brilhoCantos > 0 &&
				[[370 + r * 0.3, 620 + r * 0.3], [710 - r * 0.3, 620 + r * 0.3], [370 + r * 0.3, 1100 - r * 0.3], [710 - r * 0.3, 1100 - r * 0.3]].map(([cx, cy], i) => (
					<circle key={i} cx={cx} cy={cy} r={50 + 20 * Math.sin(f / 3 + i)} fill="#ff3b2f" opacity={brilhoCantos * 0.75} />
				))}
			{/* rachaduras saindo dos cantos */}
			{rach > 0 &&
				[[372, 622, -1, -1], [708, 622, 1, -1], [372, 1098, -1, 1], [708, 1098, 1, 1]].map(([x, y, dx, dy], i) => {
					const L = rach * 320;
					const pts = Array.from({length: 7}).map((_, k) => {
						const t = (k / 6) * L;
						return `${x + dx * t + (k % 2 ? 18 : -18) * dy},${y + dy * t * 0.8 + (k % 2 ? -14 : 14) * dx}`;
					});
					return <polyline key={i} points={`${x},${y} ${pts.join(' ')}`} fill="none" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />;
				})}
		</g>
	);
};

// ---------- tanque de água do teste ----------
export const Tanque: React.FC<{afunda: number; pressao: number}> = ({afunda, pressao}) => {
	const f = useCurrentFrame();
	const inc = 1 + pressao * 0.06 * Math.sin(f / 3);
	return (
		<g>
			<rect width={W} height={H} fill="#cfd5df" />
			<rect y={1500} width={W} height={420} fill="#9aa1ad" />
			{/* tanque */}
			<rect x={60} y={900} width={960} height={640} fill="#7fc4ef" opacity={0.85} stroke={CONTORNO} strokeWidth={12} />
			<path d={`M60 ${930 + Math.sin(f / 6) * 6} Q300 ${910 - Math.sin(f / 6) * 8} 540 ${930} T1020 ${930 + Math.sin(f / 6) * 6}`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.7} />
			{/* fuselagem descendo no tanque */}
			<g transform={`translate(540, ${600 + afunda * 620}) scale(1, ${inc})`}>
				<rect x={-380} y={-90} width={760} height={180} rx={90} fill="#f4f6fb" stroke={CONTORNO} strokeWidth={10} />
				{Array.from({length: 10}).map((_, i) => <rect key={i} x={-320 + i * 66} y={-36} width={34} height={34} rx={4} fill="#ffe58a" stroke={CONTORNO} strokeWidth={4} />)}
				<path d="M-380 40 H380" stroke="#b8322a" strokeWidth={12} />
			</g>
			{/* cabos */}
			<line x1={300} y1={0} x2={300} y2={510 + afunda * 620} stroke={CONTORNO} strokeWidth={8} />
			<line x1={780} y1={0} x2={780} y2={510 + afunda * 620} stroke={CONTORNO} strokeWidth={8} />
			<rect x={60} y={900} width={960} height={640} fill="rgba(80,170,230,0.25)" />
			<rect x={60} y={900} width={960} height={640} fill="none" stroke={CONTORNO} strokeWidth={12} />
			{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={200 + i * 170} cy={1500 - ((f * 5 + i * 70) % 500)} r={10 + (i % 3) * 4} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />)}
		</g>
	);
};

export const Manometro: React.FC<{v: number; s?: number; rotulo?: string}> = ({v, s = 1, rotulo = 'PRESSURE'}) => {
	const a = -210 + v * 240;
	return (
		<g transform={`scale(${s})`}>
			<circle r={150} fill="#fff" stroke={CONTORNO} strokeWidth={14} />
			<path d="M60 -100 A120 120 0 0 1 120 30 L90 25 A90 90 0 0 0 45 -75Z" fill="#e8463f" />
			{Array.from({length: 9}).map((_, i) => {
				const r = ((-210 + i * 30) * Math.PI) / 180;
				return <line key={i} x1={Math.cos(r) * 110} y1={Math.sin(r) * 110} x2={Math.cos(r) * 135} y2={Math.sin(r) * 135} stroke={CONTORNO} strokeWidth={6} />;
			})}
			<line x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 115} y2={Math.sin((a * Math.PI) / 180) * 115} stroke={CONTORNO} strokeWidth={12} strokeLinecap="round" />
			<circle r={16} fill={CONTORNO} />
			<text x={0} y={80} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={CONTORNO}>{rotulo}</text>
		</g>
	);
};

// ---------- corte da fuselagem que "respira" + balão ----------
export const Respira: React.FC<{infla: number}> = ({infla}) => {
	const f = useCurrentFrame();
	const r = 260 + infla * 70;
	return (
		<g>
			<rect width={W} height={H} fill="#1d2a66" />
			<circle cx={540} cy={900} r={560} fill="#26357a" />
			<circle cx={540} cy={900} r={r} fill="#eef1f6" stroke={CONTORNO} strokeWidth={14} />
			<circle cx={540} cy={900} r={r - 40} fill="#dfe3ea" />
			{/* chão e poltronas no corte */}
			<rect x={540 - (r - 60)} y={960} width={(r - 60) * 2} height={20} fill="#9aa1ad" />
			{[-120, 0, 120].map((x) => <rect key={x} x={540 + x - 40} y={880} width={80} height={80} rx={14} fill="#2f5bd3" stroke={CONTORNO} strokeWidth={6} />)}
			{/* setas */}
			{Array.from({length: 8}).map((_, i) => {
				const a = (i / 8) * Math.PI * 2;
				const d = r + 40 + infla * 30 + Math.sin(f / 4) * 6;
				const dir = infla > 0.5 ? 1 : -1;
				return (
					<g key={i} transform={`translate(${540 + Math.cos(a) * d}, ${900 + Math.sin(a) * d}) rotate(${(a * 180) / Math.PI + (dir > 0 ? 0 : 180)})`}>
						<path d="M-30 -12 H10 V-26 L40 0 L10 26 V12 H-30Z" fill="#ffd23f" stroke={CONTORNO} strokeWidth={5} />
					</g>
				);
			})}
		</g>
	);
};

export const Balao: React.FC<{infla: number; s?: number}> = ({infla, s = 1}) => (
	<g transform={`scale(${s * (0.6 + infla * 0.5)})`}>
		<path d="M0 120 Q-10 180 10 240" stroke={CONTORNO} strokeWidth={6} fill="none" />
		<ellipse cx={0} cy={0} rx={100} ry={120} fill="#e8463f" stroke={CONTORNO} strokeWidth={9} />
		<path d="M-14 116 L14 116 L0 136Z" fill="#e8463f" stroke={CONTORNO} strokeWidth={6} />
		<path d="M-50 -60 Q-40 -90 -10 -96" stroke="rgba(255,255,255,0.6)" strokeWidth={14} fill="none" strokeLinecap="round" />
	</g>
);

// ---------- diagrama de tensão: linhas de força contornando a janela ----------
// forma 1 = quadrada (aperta nos cantos, vermelho), 0 = redonda (suave, verde)
export const DiagramaTensao: React.FC<{forma: number; calor: number; rach?: number; quebra?: number}> = ({forma, calor, rach = 0, quebra = 0}) => {
	const f = useCurrentFrame();
	const quad = forma > 0.5;
	const cx = 540, cy = 900, a = 190;
	const linhas = Array.from({length: 13}).map((_, i) => {
		const y0 = 300 + i * 100;
		const d = y0 - cy;
		const pts: string[] = [];
		for (let x = 40; x <= 1040; x += 20) {
			const dx = x - cx;
			let y = y0;
			const perto = Math.abs(d) < a + 60;
			if (perto) {
				const infl = Math.exp(-(dx * dx) / (quad ? 2 * 160 * 160 : 2 * 230 * 230));
				const alvo = d >= 0 ? cy + a + 25 + (d - a) * 0.3 : cy - a - 25 + (d + a) * 0.3;
				y = y0 + (alvo - y0) * infl * (Math.abs(d) < a ? 1 : 0.6);
			}
			pts.push(`${x},${y + Math.sin(x / 40 + f / 4) * 2}`);
		}
		return pts.join(' ');
	});
	const corQuente = quad ? '#ff3b2f' : '#5aff7a';
	return (
		<g>
			<rect width={W} height={H} fill="#141e45" />
			<g transform={`translate(${quebra * -60}, 0) rotate(${quebra * -3} 540 900)`}>
				<rect x={40} y={260} width={1000} height={1300} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={10} />
				{linhas.map((p, i) => <polyline key={i} points={p} fill="none" stroke="#e9ecf2" strokeWidth={6} opacity={0.8} />)}
				{/* manchas de calor */}
				{quad
					? [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
							<circle key={i} cx={cx + sx * a} cy={cy + sy * a} r={70 + 30 * calor + 10 * Math.sin(f / 3 + i)} fill={corQuente} opacity={calor * 0.7} />
					  ))
					: <circle cx={cx} cy={cy} r={a + 60} fill="none" stroke={corQuente} strokeWidth={40 * calor} opacity={calor * 0.6} />}
				{quad ? (
					<rect x={cx - a} y={cy - a} width={a * 2} height={a * 2} rx={14} fill="#1d2a66" stroke={CONTORNO} strokeWidth={10} />
				) : (
					<circle cx={cx} cy={cy} r={a} fill="#1d2a66" stroke={CONTORNO} strokeWidth={10} />
				)}
				{rach > 0 && (
					<polyline
						points={Array.from({length: 9}).map((_, k) => `${cx + a + (k / 8) * rach * 460},${cy - a - (k / 8) * rach * 380 + (k % 2 ? 22 : -22)}`).join(' ')}
						fill="none"
						stroke={CONTORNO}
						strokeWidth={12}
						strokeLinejoin="round"
					/>
				)}
			</g>
			{quebra > 0 && (
				<g transform={`translate(${quebra * 80}, ${quebra * 40}) rotate(${quebra * 4} 900 500)`}>
					<path d="M730 710 L1040 260 L1040 900Z" fill="#9aa1ad" stroke={CONTORNO} strokeWidth={10} />
				</g>
			)}
		</g>
	);
};

export const Coracao: React.FC<{s?: number; cor?: string}> = ({s = 1, cor = '#e8463f'}) => (
	<g transform={`scale(${s})`}>
		<path d="M0 60 C-90 0 -100 -60 -60 -80 C-30 -95 -5 -75 0 -55 C5 -75 30 -95 60 -80 C100 -60 90 0 0 60Z" fill={cor} stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
		<path d="M-50 -55 Q-40 -70 -25 -70" stroke="rgba(255,255,255,0.6)" strokeWidth={10} fill="none" strokeLinecap="round" />
	</g>
);

export const Check: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<circle r={110} fill="#2fb35a" stroke={CONTORNO} strokeWidth={12} />
		<path d="M-50 0 L-12 40 L56 -40" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</g>
);
