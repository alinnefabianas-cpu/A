import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';

const rnd = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

// ---------- emu (design próprio, de perfil, virado para a direita; pés em 0,0) ----------
export const Emu: React.FC<{
	x: number; y: number; s?: number;
	corre?: number; // velocidade da corrida (0 = parado)
	olho?: 'normal' | 'feliz' | 'bravo' | 'assustado';
	espelhar?: boolean;
	bicando?: boolean;
	capacete?: boolean;
	medalha?: boolean;
	fase?: number;
}> = ({x, y, s = 1, corre = 0, olho = 'normal', espelhar, bicando, capacete, medalha, fase = 0}) => {
	const f = useCurrentFrame() + fase * 7;
	const ph = f * 0.55 * Math.max(corre, 0.0001);
	const passo = corre > 0 ? Math.sin(ph) : 0;
	const bob = corre > 0 ? Math.abs(Math.sin(ph)) * -14 : Math.sin(f / 12) * 3;
	const bica = bicando ? (Math.sin(f / 4) > 0.3 ? 1 : 0) : 0;
	const perna = (lado: number) => {
		const a = passo * lado * 0.6;
		const jx = Math.sin(a) * 120, jy = -Math.cos(a) * 120 * 0.2 - 110;
		const fx = Math.sin(a) * 200 + 10, fy = 0 - Math.max(0, -Math.cos(a + 0.6) * 30) * (corre > 0 ? 1 : 0);
		return `M${lado * 14} -250 L${jx} ${jy} L${fx} ${fy} M${fx} ${fy} l34 0 M${fx} ${fy} l22 -14 M${fx} ${fy} l-18 4`;
	};
	const pescoco = bica ? 'M90 -360 C150 -380 210 -330 230 -260' : 'M90 -370 C120 -440 130 -520 150 -600';
	const cab = bica ? {x: 236, y: -240} : {x: 160, y: -630};
	return (
		<g transform={`translate(${x}, ${y}) scale(${s * (espelhar ? -1 : 1)}, ${s})`}>
			<ellipse cx={20} cy={4} rx={150} ry={18} fill="rgba(0,0,0,0.22)" />
			<g stroke={CONTORNO} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round">
				<path d={perna(-1)} stroke="#55493a" />
				<path d={perna(1)} />
			</g>
			<g transform={`translate(0, ${bob})`}>
				{/* corpo fofo */}
				<g fill="#5b4a3c" stroke={CONTORNO} strokeWidth={10}>
					<path d="M-150 -330 C-170 -420 -60 -460 40 -440 C140 -420 170 -340 140 -280 C110 -230 20 -220 -60 -232 C-130 -240 -150 -280 -150 -330Z" />
				</g>
				{[-120, -80, -40, 0, 40, 80].map((cx, i) => (
					<path key={i} d={`M${cx} -250 q 10 26 22 0`} stroke={CONTORNO} strokeWidth={6} fill="#5b4a3c" />
				))}
				<path d="M-120 -380 C-80 -420 0 -430 60 -414" stroke="rgba(255,255,255,0.18)" strokeWidth={16} fill="none" strokeLinecap="round" />
				<path d="M-150 -330 C-190 -330 -200 -300 -176 -280" stroke={CONTORNO} strokeWidth={8} fill="#5b4a3c" />
				{/* pescoço azulado */}
				<path d={pescoco} stroke={CONTORNO} strokeWidth={44} fill="none" strokeLinecap="round" />
				<path d={pescoco} stroke="#7d93a8" strokeWidth={30} fill="none" strokeLinecap="round" />
				{medalha && (
					<g transform="translate(118, -470)">
						<path d="M-30 -40 L0 10 L30 -40" stroke="#2f5bd3" strokeWidth={14} fill="none" />
						<circle cx={0} cy={26} r={30} fill="#f2c14e" stroke={CONTORNO} strokeWidth={7} />
						<text x={0} y={38} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={34} fill={CONTORNO}>1</text>
					</g>
				)}
				{/* cabeça */}
				<g transform={`translate(${cab.x}, ${cab.y})`}>
					<path d="M-20 -46 q -6 -30 10 -36 M0 -48 q 4 -30 20 -30" stroke={CONTORNO} strokeWidth={6} fill="none" strokeLinecap="round" />
					<ellipse cx={0} cy={0} rx={52} ry={46} fill="#7d93a8" stroke={CONTORNO} strokeWidth={9} />
					<path d="M40 -8 L104 6 L40 22Z" fill="#3a3028" stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
					{olho === 'feliz' ? (
						<path d="M0 -10 q 14 -18 28 0" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />
					) : (
						<>
							<circle cx={14} cy={-8} r={olho === 'assustado' ? 22 : 18} fill="#fff" stroke={CONTORNO} strokeWidth={5} />
							<circle cx={20} cy={-8} r={olho === 'assustado' ? 7 : 9} fill={CONTORNO} />
							<circle cx={23} cy={-12} r={3} fill="#fff" />
						</>
					)}
					{olho === 'bravo' && <path d="M-8 -36 L38 -24" stroke={CONTORNO} strokeWidth={9} strokeLinecap="round" />}
					{capacete && (
						<g>
							<path d="M-60 -16 C-60 -84 60 -84 60 -16 Z" fill="#6b6a3a" stroke={CONTORNO} strokeWidth={8} />
							<path d="M-74 -14 H74" stroke={CONTORNO} strokeWidth={12} strokeLinecap="round" />
						</g>
					)}
				</g>
			</g>
			{corre > 1 && (
				<g stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.7}>
					<line x1={-200} y1={-380} x2={-330} y2={-380} />
					<line x1={-190} y1={-320} x2={-370} y2={-320} />
					<line x1={-200} y1={-260} x2={-300} y2={-260} />
				</g>
			)}
		</g>
	);
};

// ---------- campo de trigo (comido: 0 = trigo alto, 1 = tudo comido) ----------
export const Campo: React.FC<{comido?: number; poeira?: boolean; children?: React.ReactNode}> = ({comido = 0, poeira, children}) => {
	const f = useCurrentFrame();
	const alt = 1 - comido;
	return (
		<g>
			<defs>
				<linearGradient id="ceuAus" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#4fa3e0" />
					<stop offset="1" stopColor="#f7d9a0" />
				</linearGradient>
				<linearGradient id="trigo" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#f6cf5a" />
					<stop offset="1" stopColor="#c99a2e" />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuAus)" />
			<circle cx={850} cy={300} r={120} fill="#fff3b0" />
			<circle cx={850} cy={300} r={190} fill="rgba(255,243,176,0.35)" />
			<path d="M0 860 Q260 720 540 820 T1080 780 V1000 H0Z" fill="#c98a52" />
			{/* casa da fazenda */}
			<g transform="translate(210, 900)">
				<rect x={-110} y={-130} width={220} height={130} fill="#f1e3c6" stroke={CONTORNO} strokeWidth={8} />
				<path d="M-140 -126 L0 -230 L140 -126Z" fill="#b83a2e" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
				<rect x={-26} y={-80} width={52} height={80} fill="#7a4a2a" stroke={CONTORNO} strokeWidth={6} />
				<rect x={50} y={-100} width={40} height={40} fill="#9fd3ff" stroke={CONTORNO} strokeWidth={5} />
			</g>
			{/* moinho */}
			<g transform="translate(900, 930)">
				<path d="M-16 0 L-6 -260 H6 L16 0Z" fill="#9aa1ad" stroke={CONTORNO} strokeWidth={6} />
				<g transform={`translate(0,-260) rotate(${f * 3})`}>
					{[0, 90, 180, 270].map((a) => (
						<rect key={a} x={-8} y={-110} width={16} height={110} fill="#d9dde6" stroke={CONTORNO} strokeWidth={4} transform={`rotate(${a})`} />
					))}
				</g>
			</g>
			<rect y={920} width={W} height={1000} fill={comido > 0.5 ? '#9b6a3e' : '#d8a640'} />
			{/* fileiras de trigo */}
			{Array.from({length: 7}).map((_, r) => {
				const y = 960 + r * 150;
				const esc = 0.6 + r * 0.12;
				return (
					<g key={r}>
						{Array.from({length: 13}).map((__, c) => {
							const x = c * 90 + (r % 2) * 45 - 20 + Math.sin(f / 15 + c + r) * 3;
							const h = (90 + rnd(r * 20 + c) * 40) * esc * alt;
							if (h < 4) return <circle key={c} cx={x} cy={y} r={6 * esc} fill="#7a5230" />;
							return (
								<g key={c}>
									<path d={`M${x} ${y} L${x + 4} ${y - h}`} stroke="#b88a2a" strokeWidth={5 * esc} />
									<ellipse cx={x + 5} cy={y - h - 14 * esc} rx={10 * esc} ry={24 * esc} fill="url(#trigo)" stroke={CONTORNO} strokeWidth={3} />
								</g>
							);
						})}
					</g>
				);
			})}
			{/* cerca */}
			<g stroke={CONTORNO} strokeWidth={6} fill="#a8794a">
				{Array.from({length: 9}).map((_, i) => (
					<rect key={i} x={20 + i * 130} y={880} width={20} height={70} />
				))}
				<rect x={0} y={895} width={W} height={12} />
				<rect x={0} y={925} width={W} height={12} />
			</g>
			{poeira && (
				<g opacity={0.6}>
					{Array.from({length: 10}).map((_, i) => (
						<circle key={i} cx={(i * 140 + f * 6) % 1200} cy={1500 + Math.sin(i + f / 8) * 60} r={50 + (i % 3) * 20} fill="#e6c79a" />
					))}
				</g>
			)}
			{children}
		</g>
	);
};

// ---------- mapa simplificado da Austrália (Oeste em destaque) ----------
export const MapaAustralia: React.FC<{destaque: number}> = ({destaque}) => {
	const d = 'M40 250 L60 170 L130 120 L200 95 L250 60 L300 40 L330 80 L370 60 L400 15 L430 70 L460 110 L500 140 L540 200 L570 260 L560 320 L520 380 L470 420 L420 440 L380 420 L340 380 L300 368 L240 380 L180 400 L120 410 L70 380 L40 320Z';
	return (
		<g transform="translate(-300,-240)">
			<clipPath id="oeste"><rect x={0} y={0} width={262} height={500} /></clipPath>
			<path d={d} fill="#e9c27a" stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
			<path d={d} fill="#e8463f" clipPath="url(#oeste)" opacity={destaque} />
			<line x1={262} y1={60} x2={262} y2={378} stroke={CONTORNO} strokeWidth={5} strokeDasharray="14 10" opacity={destaque} />
			<ellipse cx={455} cy={485} rx={30} ry={22} fill="#e9c27a" stroke={CONTORNO} strokeWidth={8} />
		</g>
	);
};

export const Metralhadora: React.FC<{s?: number; atira?: boolean}> = ({s = 1, atira}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<path d="M0 0 L-90 150 M0 0 L90 150 M0 0 L0 160" stroke={CONTORNO} strokeWidth={14} strokeLinecap="round" />
			<rect x={-60} y={-40} width={240} height={50} rx={22} fill="#6b6a3a" stroke={CONTORNO} strokeWidth={8} />
			<rect x={170} y={-26} width={90} height={22} rx={8} fill="#3a3a2a" stroke={CONTORNO} strokeWidth={6} />
			<ellipse cx={40} cy={-62} rx={70} ry={18} fill="#4a4a32" stroke={CONTORNO} strokeWidth={7} />
			<path d="M-60 -10 L-140 30 L-130 50 L-50 20Z" fill="#7a4a2a" stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
			{atira && f % 4 < 2 && <path d="M262 -16 l60 -20 l-16 20 l56 0 l-56 16 l16 20 z" fill="#ffd23f" stroke="#e8833a" strokeWidth={4} />}
		</g>
	);
};

export const Caminhao: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	const sac = Math.sin(f * 1.3) * 10;
	return (
		<g transform={`scale(${s}) translate(0, ${sac}) rotate(${Math.sin(f * 0.9) * 2})`}>
			<rect x={-300} y={-150} width={380} height={100} fill="#6b6a3a" stroke={CONTORNO} strokeWidth={9} />
			<path d="M80 -50 L80 -230 L200 -230 L270 -130 L290 -50Z" fill="#7d7c46" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<path d="M110 -210 H190 L240 -140 H110Z" fill="#9fd3ff" stroke={CONTORNO} strokeWidth={7} />
			<circle cx={282} cy={-90} r={18} fill="#ffe58a" stroke={CONTORNO} strokeWidth={6} />
			{[-200, 190].map((x) => (
				<g key={x} transform={`translate(${x}, -40) rotate(${f * 20})`}>
					<circle r={60} fill="#222" stroke={CONTORNO} strokeWidth={9} />
					<circle r={22} fill="#9aa1ad" />
					<line x1={-22} y1={0} x2={22} y2={0} stroke={CONTORNO} strokeWidth={6} />
				</g>
			))}
			<g transform="translate(-120, -210)"><Metralhadora s={0.55} /></g>
		</g>
	);
};

export const Telefone: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-60 140 H60 L40 110 H-40Z" fill="#2a2a2a" stroke={CONTORNO} strokeWidth={7} />
		<rect x={-10} y={-60} width={20} height={175} fill="#2a2a2a" stroke={CONTORNO} strokeWidth={6} />
		<path d="M-40 -60 Q0 -110 40 -60Z" fill="#2a2a2a" stroke={CONTORNO} strokeWidth={6} />
		<path d="M10 40 Q120 60 110 -40" stroke="#2a2a2a" strokeWidth={8} fill="none" />
		<rect x={90} y={-90} width={40} height={70} rx={14} fill="#2a2a2a" stroke={CONTORNO} strokeWidth={6} />
	</g>
);

export const Mira: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`} stroke="#e8262f" strokeWidth={10} fill="none">
		<circle r={110} />
		<circle r={8} fill="#e8262f" />
		<line x1={-160} y1={0} x2={-40} y2={0} />
		<line x1={40} y1={0} x2={160} y2={0} />
		<line x1={0} y1={-160} x2={0} y2={-40} />
		<line x1={0} y1={40} x2={0} y2={160} />
	</g>
);

export const Velocimetro: React.FC<{v: number; s?: number}> = ({v, s = 1}) => {
	const a = -180 + (v / 70) * 180;
	return (
		<g transform={`scale(${s})`}>
			<path d="M-180 0 A180 180 0 0 1 180 0Z" fill="#fff" stroke={CONTORNO} strokeWidth={10} />
			<path d="M60 -170 A180 180 0 0 1 180 0 L120 0 A120 120 0 0 0 40 -113Z" fill="#e8463f" opacity={0.8} />
			{Array.from({length: 8}).map((_, i) => {
				const r = (-180 + i * (180 / 7)) * (Math.PI / 180);
				return <line key={i} x1={Math.cos(r) * 150} y1={Math.sin(r) * 150} x2={Math.cos(r) * 175} y2={Math.sin(r) * 175} stroke={CONTORNO} strokeWidth={6} />;
			})}
			<line x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 150} y2={Math.sin((a * Math.PI) / 180) * 150} stroke={CONTORNO} strokeWidth={12} strokeLinecap="round" />
			<circle r={18} fill={CONTORNO} />
			<text x={0} y={90} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">
				{Math.round(v)} km/h
			</text>
		</g>
	);
};

export const Placar: React.FC<{emus: number; exercito: number; s?: number}> = ({emus, exercito, s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-380} y={-130} width={760} height={260} rx={30} fill="#1d1d1d" stroke="#000" strokeWidth={12} />
		<text x={-190} y={-60} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#ffd23f">EMUS</text>
		<text x={190} y={-60} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={54} fill="#9fd3ff">ARMY</text>
		<text x={-190} y={90} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={150} fill="#ffd23f">{emus}</text>
		<text x={190} y={90} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={150} fill="#9fd3ff">{exercito}</text>
		<text x={0} y={70} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#fff">:</text>
	</g>
);

export const BandeiraBranca: React.FC<{s?: number}> = ({s = 1}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<line x1={0} y1={0} x2={0} y2={-260} stroke="#7a4a2a" strokeWidth={12} strokeLinecap="round" />
			<path d={`M0 -260 Q60 ${-280 + Math.sin(f / 4) * 14} 130 -255 Q120 -210 130 -170 Q60 ${-195 + Math.sin(f / 4 + 1) * 14} 0 -175Z`} fill="#fff" stroke={CONTORNO} strokeWidth={7} />
		</g>
	);
};

export const BalaoPensamento: React.FC<{x: number; y: number; k: number; children: React.ReactNode}> = ({x, y, k, children}) =>
	k > 0 ? (
		<g transform={`translate(${x}, ${y}) scale(${k})`}>
			<circle cx={-250} cy={330} r={22} fill="#fff" stroke={CONTORNO} strokeWidth={7} />
			<circle cx={-200} cy={260} r={34} fill="#fff" stroke={CONTORNO} strokeWidth={7} />
			<path d="M-380 0 C-420 -120 -300 -200 -200 -170 C-160 -260 0 -270 60 -190 C140 -260 330 -200 320 -80 C420 -40 400 120 300 140 C280 230 120 240 60 190 C0 250 -180 250 -230 180 C-360 200 -440 100 -380 0Z" fill="#fff" stroke={CONTORNO} strokeWidth={9} />
			<clipPath id="pensa"><path d="M-370 0 C-410 -110 -300 -190 -200 -160 C-160 -250 0 -260 60 -180 C140 -250 320 -190 310 -80 C410 -40 390 110 290 130 C270 220 120 230 60 180 C0 240 -180 240 -230 170 C-350 190 -430 100 -370 0Z" /></clipPath>
			<g clipPath="url(#pensa)">{children}</g>
		</g>
	) : null;
