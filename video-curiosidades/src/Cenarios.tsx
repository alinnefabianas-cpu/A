import React from 'react';
import {interpolate, useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {CONTORNO} from './Personagem';

export const W = 1080;
export const H = 1920;

// ---------- utilitários ----------
const rand = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

export const Estrelas: React.FC<{n?: number; h?: number}> = ({n = 70, h = H}) => {
	const f = useCurrentFrame();
	return (
		<g>
			{Array.from({length: n}).map((_, i) => (
				<circle key={i} cx={rand(i) * W} cy={rand(i + 99) * h} r={1.5 + rand(i + 7) * 3} fill="#fff" opacity={0.35 + 0.65 * Math.abs(Math.sin(f / 20 + i))} />
			))}
		</g>
	);
};

export const Nuvem: React.FC<{x: number; y: number; s?: number; cor?: string; op?: number}> = ({x, y, s = 1, cor = '#3d4f86', op = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
		<path d="M-180 40 C-200 -10 -140 -40 -100 -20 C-90 -80 0 -90 30 -40 C60 -80 150 -60 140 0 C200 0 210 40 180 50 Z" fill={cor} />
		<path d="M-160 36 C-120 20 120 20 170 40" stroke="rgba(255,255,255,0.12)" strokeWidth={10} fill="none" strokeLinecap="round" />
	</g>
);

// ---------- céu noturno com avião ----------
export const CeuNoturno: React.FC<{aviaoX?: number; aviaoY?: number; aviaoS?: number; balanco?: number; alarme?: boolean}> = ({aviaoX = W / 2, aviaoY = 900, aviaoS = 1, balanco = 0, alarme = false}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#0b1030" />
					<stop offset="0.6" stopColor="#1d2a66" />
					<stop offset="1" stopColor="#3b4c95" />
				</linearGradient>
				<radialGradient id="lua" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0.55" stopColor="#fff7d6" />
					<stop offset="1" stopColor="rgba(255,247,214,0)" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceu)" />
			<Estrelas />
			<circle cx={820} cy={330} r={220} fill="url(#lua)" opacity={0.5} />
			<circle cx={820} cy={330} r={110} fill="#fff4cc" />
			<circle cx={790} cy={300} r={18} fill="#efe1b0" />
			<circle cx={850} cy={360} r={12} fill="#efe1b0" />
			{/* nuvens em 3 camadas (parallax) */}
			{[0, 1, 2, 3].map((i) => (
				<Nuvem key={'a' + i} x={((i * 420 - f * 2) % 1700) + 1400 - 1700 + 300} y={560 + i * 90} s={0.8} cor="#26357a" op={0.8} />
			))}
			<g transform={`translate(${aviaoX}, ${aviaoY + Math.sin(f / 10) * 8}) rotate(${balanco}) scale(${aviaoS})`}>
				<Aviao alarme={alarme} />
			</g>
			{[0, 1, 2].map((i) => (
				<Nuvem key={'b' + i} x={((i * 620 - f * 7) % 1900) + 1900 - 1900 + 500} y={1250 + i * 160} s={1.6} cor="#4a5aa3" />
			))}
			<rect y={1500} width={W} height={420} fill="#5263ad" opacity={0.6} />
			<Nuvem x={((-f * 12) % 1600) + 1700} y={1650} s={2.4} cor="#6575bd" />
		</g>
	);
};

export const Aviao: React.FC<{alarme?: boolean}> = ({alarme}) => {
	const f = useCurrentFrame();
	const pisca = f % 30 < 4;
	return (
		<g transform="translate(-380,-90)">
			{/* asa de trás */}
			<path d="M330 70 L250 -60 L320 -60 L470 70Z" fill="#c9d3e8" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
			{/* fuselagem */}
			<path d="M40 60 C40 10 80 0 140 0 L640 0 C720 0 770 40 780 90 C770 140 720 160 640 160 L120 160 C60 160 30 130 40 60Z" fill="#f4f6fb" stroke={CONTORNO} strokeWidth={9} />
			<path d="M60 112 L770 112" stroke="#2f5bd3" strokeWidth={16} />
			<path d="M60 128 L760 128" stroke="#f2c14e" strokeWidth={6} />
			{/* janelas acesas */}
			{Array.from({length: 13}).map((_, i) => (
				<rect key={i} x={160 + i * 38} y={52} width={20} height={26} rx={9} fill={alarme && f % 16 < 8 ? '#ff5a5a' : '#ffe58a'} stroke={CONTORNO} strokeWidth={4} />
			))}
			{/* cabine */}
			<path d="M690 40 C730 40 755 60 765 80 L700 80 Z" fill="#1d2a66" stroke={CONTORNO} strokeWidth={6} />
			{/* cauda */}
			<path d="M60 40 L0 -110 L70 -110 L160 10Z" fill="#2f5bd3" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
			{/* asa da frente */}
			<path d="M340 110 L230 260 L320 260 L500 110Z" fill="#e2e8f5" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
			<rect x={330} y={170} width={70} height={36} rx={16} fill="#9aa7c4" stroke={CONTORNO} strokeWidth={6} />
			{pisca && <circle cx={240} cy={258} r={14} fill="#ff4d4d" />}
			{pisca && <circle cx={10} cy={-108} r={10} fill="#fff" />}
		</g>
	);
};

// ---------- cockpit (visto de frente) ----------
export const Cockpit: React.FC<{alarme?: boolean}> = ({alarme}) => {
	const f = useCurrentFrame();
	const vermelho = alarme && f % 16 < 8;
	return (
		<g>
			<defs>
				<linearGradient id="vidro" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#0a0f2c" />
					<stop offset="1" stopColor="#2a3a80" />
				</linearGradient>
				<linearGradient id="painel" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#3a3f4f" />
					<stop offset="1" stopColor="#1c1f29" />
				</linearGradient>
				<linearGradient id="parede" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#5b6172" />
					<stop offset="0.5" stopColor="#8a90a3" />
					<stop offset="1" stopColor="#5b6172" />
				</linearGradient>
				<radialGradient id="luzTela" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor="rgba(120,200,255,0.35)" />
					<stop offset="1" stopColor="rgba(120,200,255,0)" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#parede)" />
			{/* teto com botões */}
			<path d="M0 0 H1080 V220 Q540 300 0 220Z" fill="#474c5c" />
			{Array.from({length: 18}).map((_, i) => (
				<circle key={i} cx={120 + (i % 9) * 105} cy={80 + Math.floor(i / 9) * 70} r={13} fill={(i + Math.floor(f / 12)) % 7 === 0 ? '#7cf29a' : '#2b2f3a'} stroke="#15171e" strokeWidth={4} />
			))}
			{/* para-brisa */}
			<path d="M40 300 Q540 250 1040 300 L1000 820 Q540 790 80 820Z" fill="url(#vidro)" stroke="#262a35" strokeWidth={26} strokeLinejoin="round" />
			<g clipPath="url(#clipVidro)">
				<clipPath id="clipVidro">
					<path d="M40 300 Q540 250 1040 300 L1000 820 Q540 790 80 820Z" />
				</clipPath>
				<Estrelas n={40} h={820} />
				{[0, 1, 2].map((i) => (
					<Nuvem key={i} x={1300 - ((f * 6 + i * 500) % 1700)} y={650 + i * 50} s={0.9} cor="#33438c" />
				))}
				<path d="M60 330 L300 300 L180 800 L60 800Z" fill="rgba(255,255,255,0.05)" />
			</g>
			<path d="M540 268 L540 800" stroke="#262a35" strokeWidth={26} />
			{/* painel */}
			<path d="M0 800 Q540 760 1080 800 V1150 H0Z" fill="url(#painel)" />
			{[160, 400, 680, 920].map((x, i) => (
				<g key={x}>
					<circle cx={x} cy={930} r={140} fill="url(#luzTela)" />
					<rect x={x - 95} y={850} width={190} height={150} rx={14} fill={vermelho ? '#5a0d14' : '#06141f'} stroke="#0d0f14" strokeWidth={8} />
					{i % 2 === 0 ? (
						<>
							<rect x={x - 80} y={865} width={160} height={60} fill="#3b8be8" />
							<rect x={x - 80} y={925} width={160} height={60} fill="#8a5a2b" />
							<line x1={x - 80} y1={925 + Math.sin(f / 20 + i) * 8} x2={x + 80} y2={925 - Math.sin(f / 20 + i) * 8} stroke="#fff" strokeWidth={4} />
						</>
					) : (
						<>
							<circle cx={x} cy={925} r={55} fill="none" stroke="#7cf29a" strokeWidth={4} />
							<line x1={x} y1={925} x2={x + Math.cos(f / 15 + i) * 50} y2={925 + Math.sin(f / 15 + i) * 50} stroke="#7cf29a" strokeWidth={5} />
						</>
					)}
				</g>
			))}
			{Array.from({length: 14}).map((_, i) => (
				<rect key={i} x={90 + i * 66} y={1040} width={40} height={22} rx={5} fill={(i * 3 + Math.floor(f / 9)) % 11 === 0 ? '#ffcf4a' : '#2b2f3a'} />
			))}
			{vermelho && <rect width={W} height={H} fill="rgba(255,30,30,0.18)" />}
		</g>
	);
};

// encosto das poltronas (desenhado ATRÁS dos pilotos)
export const Poltrona: React.FC<{x: number}> = ({x}) => (
	<g transform={`translate(${x}, 0)`}>
		<path d="M-170 1080 C-180 960 -150 900 0 900 C150 900 180 960 170 1080 L180 1500 H-180Z" fill="#7b4f34" stroke={CONTORNO} strokeWidth={10} />
		<path d="M-120 960 C-60 930 60 930 120 960" stroke="rgba(255,255,255,0.18)" strokeWidth={14} fill="none" strokeLinecap="round" />
	</g>
);

// frente: console e manche (desenhado NA FRENTE dos pilotos, esconde as pernas)
export const ConsoleFrente: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<g>
			<path d="M0 1480 Q540 1430 1080 1480 V1920 H0Z" fill="#2a2e3a" stroke={CONTORNO} strokeWidth={10} />
			<path d="M0 1500 Q540 1452 1080 1500" stroke="rgba(255,255,255,0.12)" strokeWidth={10} fill="none" />
			{/* manetes no centro */}
			<rect x={470} y={1360} width={140} height={200} rx={20} fill="#3a3f4f" stroke={CONTORNO} strokeWidth={8} />
			{[505, 575].map((x) => (
				<g key={x}>
					<line x1={x} y1={1420} x2={x} y2={1330} stroke="#1b1e27" strokeWidth={14} strokeLinecap="round" />
					<rect x={x - 22} y={1310} width={44} height={30} rx={8} fill="#d9dde6" stroke={CONTORNO} strokeWidth={6} />
				</g>
			))}
			{Array.from({length: 8}).map((_, i) => (
				<circle key={i} cx={130 + i * 115} cy={1620} r={14} fill={(i + Math.floor(f / 10)) % 5 === 0 ? '#7cf29a' : '#1b1e27'} />
			))}
		</g>
	);
};

// ---------- cabine de passageiros ----------
export const CabinePassageiros: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<g>
		<defs>
			<linearGradient id="cab" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#2d3554" />
				<stop offset="1" stopColor="#151a2e" />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="url(#cab)" />
		{/* teto curvo e bagageiros */}
		<path d="M0 0 H1080 V360 Q540 470 0 360Z" fill="#3b4366" />
		<path d="M0 300 Q540 410 1080 300 L1080 380 Q540 490 0 380Z" fill="#4c557d" stroke={CONTORNO} strokeWidth={6} />
		{[150, 400, 680, 930].map((x) => (
			<circle key={x} cx={x} cy={430} r={10} fill="#ffe58a" opacity={0.8} />
		))}
		{/* janelas */}
		{[120, 960].map((x) => (
			<g key={x}>
				<rect x={x - 55} y={560} width={110} height={160} rx={50} fill="#0b1030" stroke="#8d95b5" strokeWidth={14} />
				<circle cx={x + 15} cy={610} r={10} fill="#fff4cc" />
			</g>
		))}
		<rect y={1250} width={W} height={670} fill="#1a1f35" />
		{/* luz azul de "voo noturno" */}
		<rect width={W} height={H} fill="rgba(70,90,200,0.12)" />
		{children}
	</g>
);

export const FileiraPoltronas: React.FC<{y: number; s?: number; cor?: string}> = ({y, s = 1, cor = '#3b5bb5'}) => (
	<g transform={`translate(${W / 2}, ${y}) scale(${s})`}>
		{[-360, -120, 120, 360].map((x) => (
			<g key={x}>
				<path d={`M${x - 105} 0 C${x - 110} -150 ${x - 90} -200 ${x} -200 C${x + 90} -200 ${x + 110} -150 ${x + 105} 0 L${x + 110} 260 H${x - 110}Z`} fill={cor} stroke={CONTORNO} strokeWidth={9} />
				<rect x={x - 70} y={-205} width={140} height={46} rx={12} fill="#e9edf7" stroke={CONTORNO} strokeWidth={6} />
			</g>
		))}
	</g>
);

// ---------- cozinha (galley) ----------
export const Cozinha: React.FC = () => (
	<g>
		<defs>
			<linearGradient id="inox" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stopColor="#c7ccd6" />
				<stop offset="0.5" stopColor="#eef1f6" />
				<stop offset="1" stopColor="#a9afbd" />
			</linearGradient>
		</defs>
		<rect width={W} height={H} fill="#d9dee8" />
		{/* armários de inox */}
		{Array.from({length: 4}).map((_, r) =>
			Array.from({length: 3}).map((__, c) => (
				<g key={`${r}-${c}`}>
					<rect x={70 + c * 320} y={180 + r * 210} width={300} height={190} rx={10} fill="url(#inox)" stroke="#6f7686" strokeWidth={6} />
					<rect x={190 + c * 320} y={260 + r * 210} width={60} height={16} rx={8} fill="#6f7686" />
				</g>
			)),
		)}
		<rect y={1050} width={W} height={60} fill="#8b93a6" stroke={CONTORNO} strokeWidth={8} />
		<rect y={1110} width={W} height={810} fill="#b9c0cf" />
		<path d="M0 1110 H1080" stroke="rgba(255,255,255,0.5)" strokeWidth={6} />
	</g>
);

// ---------- objetos ----------
export const Coxa: React.FC<{s?: number; podre?: number}> = ({s = 1, podre = 0}) => {
	const f = useCurrentFrame();
	return (
		<g transform={`scale(${s})`}>
			<path d="M20 -6 L70 -20 M20 6 L70 20" stroke={CONTORNO} strokeWidth={0} />
			<rect x={30} y={-12} width={60} height={24} rx={10} fill="#f8f1e0" stroke={CONTORNO} strokeWidth={6} />
			<circle cx={92} cy={-14} r={14} fill="#f8f1e0" stroke={CONTORNO} strokeWidth={6} />
			<circle cx={92} cy={14} r={14} fill="#f8f1e0" stroke={CONTORNO} strokeWidth={6} />
			<path d="M40 0 C40 -70 -90 -80 -100 0 C-90 80 40 70 40 0Z" fill={podre > 0.5 ? '#8a9a3b' : '#c9772f'} stroke={CONTORNO} strokeWidth={7} />
			<path d="M-70 -30 C-50 -50 -10 -50 10 -36" stroke="rgba(255,240,200,0.6)" strokeWidth={10} fill="none" strokeLinecap="round" />
			{podre > 0 && (
				<g opacity={podre} stroke="#7cc24a" strokeWidth={8} fill="none" strokeLinecap="round">
					{[-60, -20, 20].map((x, i) => (
						<path key={x} d={`M${x} -80 q -14 -20 0 -40 q 14 -20 0 -40`} transform={`translate(${Math.sin(f / 5 + i) * 6}, ${-((f * 2 + i * 20) % 30)})`} />
					))}
					<circle cx={-30} cy={10} r={9} fill="#5d7a2a" stroke="none" />
					<circle cx={-60} cy={-20} r={6} fill="#5d7a2a" stroke="none" />
				</g>
			)}
		</g>
	);
};

export const Peixe: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M60 0 L110 -40 L110 40Z" fill="#4aa3d8" stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
		<ellipse cx={0} cy={0} rx={80} ry={46} fill="#7cc7ef" stroke={CONTORNO} strokeWidth={7} />
		<path d="M-10 -40 Q10 -64 30 -40" fill="#4aa3d8" stroke={CONTORNO} strokeWidth={6} />
		<circle cx={-44} cy={-8} r={9} fill={CONTORNO} />
		<path d="M-20 -30 Q-10 0 -20 30" stroke={CONTORNO} strokeWidth={5} fill="none" />
		<path d="M-60 -24 Q-30 -40 10 -32" stroke="rgba(255,255,255,0.6)" strokeWidth={8} fill="none" strokeLinecap="round" />
	</g>
);

export const Bandeja: React.FC<{comida: 'frango' | 'peixe'; s?: number; podre?: number; rotulo?: string}> = ({comida, s = 1, podre = 0, rotulo}) => (
	<g transform={`scale(${s})`}>
		<ellipse cx={0} cy={36} rx={170} ry={20} fill="rgba(0,0,0,0.25)" />
		<rect x={-160} y={-40} width={320} height={80} rx={18} fill="#e9e2d0" stroke={CONTORNO} strokeWidth={8} />
		<ellipse cx={-20} cy={-30} rx={110} ry={46} fill="#fff" stroke={CONTORNO} strokeWidth={7} />
		<g transform="translate(-20,-40)">{comida === 'frango' ? <Coxa s={0.7} podre={podre} /> : <Peixe s={0.75} />}</g>
		<rect x={100} y={-62} width={44} height={56} rx={8} fill="#d63b3b" stroke={CONTORNO} strokeWidth={6} />
		{rotulo && (
			<g transform="translate(0, 110)">
				<rect x={-60} y={-40} width={120} height={80} rx={16} fill={rotulo === 'A' ? '#2f5bd3' : '#e8833a'} stroke={CONTORNO} strokeWidth={8} />
				<text x={0} y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={64} fill="#fff">
					{rotulo}
				</text>
			</g>
		)}
	</g>
);

export const Amendoim: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<path d="M-60 -80 L60 -80 L70 80 L-70 80Z" fill="#f2c14e" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
		<path d="M-60 -80 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14" fill="#f2c14e" stroke={CONTORNO} strokeWidth={6} strokeLinejoin="round" />
		<ellipse cx={0} cy={10} rx={34} ry={20} fill="#c7884a" stroke={CONTORNO} strokeWidth={5} />
		<ellipse cx={-14} cy={10} rx={4} ry={4} fill="#8a5a2b" />
		<ellipse cx={14} cy={10} rx={4} ry={4} fill="#8a5a2b" />
		<rect x={-50} y={44} width={100} height={18} rx={6} fill="#c8323f" />
	</g>
);

export const Relogio: React.FC<{hora: number; s?: number}> = ({hora, s = 1}) => {
	const f = useCurrentFrame();
	const a = (hora / 12) * Math.PI * 2;
	const m = f / 6;
	return (
		<g transform={`scale(${s})`}>
			<circle r={70} fill="#fff" stroke={CONTORNO} strokeWidth={9} />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1={Math.sin((i / 12) * Math.PI * 2) * 52} y1={-Math.cos((i / 12) * Math.PI * 2) * 52} x2={Math.sin((i / 12) * Math.PI * 2) * 60} y2={-Math.cos((i / 12) * Math.PI * 2) * 60} stroke={CONTORNO} strokeWidth={5} />
			))}
			<line x1={0} y1={0} x2={Math.sin(a) * 34} y2={-Math.cos(a) * 34} stroke={CONTORNO} strokeWidth={9} strokeLinecap="round" />
			<line x1={0} y1={0} x2={Math.sin(m) * 50} y2={-Math.cos(m) * 50} stroke="#d63b3b" strokeWidth={6} strokeLinecap="round" />
			<circle r={8} fill={CONTORNO} />
		</g>
	);
};

export const Balao: React.FC<{x: number; y: number; inicio: number; lado?: 1 | -1; children: React.ReactNode; s?: number}> = ({x, y, inicio, lado = 1, children, s = 1}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const k = spring({frame: f - inicio, fps, config: {damping: 11, stiffness: 180}});
	if (f < inicio) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${k * s})`}>
			<path d={`M${-30 * lado} 90 L${-70 * lado} 170 L${30 * lado} 100Z`} fill="#fff" stroke={CONTORNO} strokeWidth={9} strokeLinejoin="round" />
			<ellipse cx={0} cy={0} rx={150} ry={115} fill="#fff" stroke={CONTORNO} strokeWidth={9} />
			<path d={`M${-26 * lado} 92 L${32 * lado} 98`} stroke="#fff" strokeWidth={14} />
			{children}
		</g>
	);
};

export const Interrogacao: React.FC<{x: number; y: number; inicio: number; s?: number; cor?: string}> = ({x, y, inicio, s = 1, cor = '#ffd23f'}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (f < inicio) return null;
	const k = spring({frame: f - inicio, fps, config: {damping: 8, stiffness: 200}});
	return (
		<g transform={`translate(${x},${y + Math.sin(f / 6) * 8}) scale(${k * s}) rotate(${Math.sin(f / 9) * 8})`}>
			<text x={0} y={60} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={220} fill={cor} stroke={CONTORNO} strokeWidth={14} paintOrder="stroke">
				?
			</text>
		</g>
	);
};

export const Zzz: React.FC<{x: number; y: number; fase?: number}> = ({x, y, fase = 0}) => {
	const f = useCurrentFrame() + fase * 20;
	return (
		<g>
			{[0, 1, 2].map((i) => {
				const t = ((f + i * 20) % 60) / 60;
				return (
					<text key={i} x={x + t * 60 + i * 10} y={y - t * 140} fontFamily="Nunito" fontWeight={900} fontSize={40 + i * 14} fill="#bcd0ff" opacity={interpolate(t, [0, 0.2, 0.8, 1], [0, 1, 1, 0])} stroke={CONTORNO} strokeWidth={6} paintOrder="stroke">
						z
					</text>
				);
			})}
		</g>
	);
};

export const LinhasImpacto: React.FC<{cor?: string; op?: number}> = ({cor = '#fff', op = 0.5}) => {
	const f = useCurrentFrame();
	return (
		<g opacity={op}>
			{Array.from({length: 28}).map((_, i) => {
				const a = (i / 28) * Math.PI * 2 + rand(i) * 0.1;
				const r1 = 620 + rand(i + Math.floor(f / 2)) * 140;
				return <path key={i} d={`M${W / 2 + Math.cos(a) * r1} ${H / 2 + Math.sin(a) * r1} L${W / 2 + Math.cos(a - 0.02) * 1400} ${H / 2 + Math.sin(a - 0.02) * 1400} L${W / 2 + Math.cos(a + 0.02) * 1400} ${H / 2 + Math.sin(a + 0.02) * 1400}Z`} fill={cor} />;
			})}
		</g>
	);
};
