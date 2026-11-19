import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CONTORNO} from '../Personagem';
import {H, W} from '../Cenarios';

const aco = (id: string) => (
	<linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
		<stop offset="0" stopColor="#9aa1ad" />
		<stop offset="0.35" stopColor="#dfe3ea" />
		<stop offset="0.6" stopColor="#b8bec9" />
		<stop offset="1" stopColor="#8d94a1" />
	</linearGradient>
);

// corredor visto através das portas
const Corredor: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
	<g>
		<rect x={x} y={y} width={w} height={h} fill="#f2d7a6" />
		<rect x={x} y={y + h * 0.72} width={w} height={h * 0.28} fill="#b5733e" />
		<rect x={x + w * 0.58} y={y + h * 0.18} width={w * 0.3} height={h * 0.26} fill="#7fb7e8" stroke={CONTORNO} strokeWidth={8} />
		<g transform={`translate(${x + w * 0.2}, ${y + h * 0.72})`}>
			<path d="M-40 0 L-30 -90 H30 L40 0Z" fill="#c75b39" stroke={CONTORNO} strokeWidth={7} />
			{[-40, 0, 40].map((a) => (
				<ellipse key={a} cx={a * 0.8} cy={-150} rx={30} ry={70} fill="#4c9a52" stroke={CONTORNO} strokeWidth={6} transform={`rotate(${a / 2} ${a * 0.8} -110)`} />
			))}
		</g>
	</g>
);

// portas do elevador (abertura 0 = fechada, 1 = aberta)
export const Portas: React.FC<{x: number; y: number; w: number; h: number; abertura: number}> = ({x, y, w, h, abertura}) => {
	const meia = w / 2;
	const desl = meia * 0.96 * abertura;
	return (
		<g>
			<defs>{aco('portaAco')}</defs>
			<clipPath id="vaoPorta">
				<rect x={x} y={y} width={w} height={h} />
			</clipPath>
			<g clipPath="url(#vaoPorta)">
				<Corredor x={x} y={y} w={w} h={h} />
				<rect x={x - desl} y={y} width={meia} height={h} fill="url(#portaAco)" stroke={CONTORNO} strokeWidth={8} />
				<rect x={x + meia + desl} y={y} width={meia} height={h} fill="url(#portaAco)" stroke={CONTORNO} strokeWidth={8} />
				<line x1={x + meia * 0.5 - desl} y1={y + 20} x2={x + meia * 0.5 - desl} y2={y + h - 20} stroke="rgba(255,255,255,0.35)" strokeWidth={10} />
				<line x1={x + meia * 1.5 + desl} y1={y + 20} x2={x + meia * 1.5 + desl} y2={y + h - 20} stroke="rgba(255,255,255,0.35)" strokeWidth={10} />
			</g>
			<rect x={x - 14} y={y - 14} width={w + 28} height={h + 14} fill="none" stroke="#5b6170" strokeWidth={28} />
		</g>
	);
};

// interior do elevador visto de dentro, olhando para as portas
export const InteriorElevador: React.FC<{abertura: number; andar?: string; children?: React.ReactNode}> = ({abertura, andar = '7', children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				{aco('paredeAco')}
				<linearGradient id="pisoEl" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#6b4a36" />
					<stop offset="1" stopColor="#3e2a1f" />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#paredeAco)" />
			{/* teto com luz */}
			<rect width={W} height={200} fill="#e9ecf2" />
			{[200, 540, 880].map((x) => (
				<g key={x}>
					<ellipse cx={x} cy={120} rx={110} ry={34} fill="#fffbe6" stroke="#c7ccd6" strokeWidth={6} />
					<ellipse cx={x} cy={300} rx={260} ry={140} fill="rgba(255,250,220,0.18)" />
				</g>
			))}
			{/* paredes laterais em perspectiva */}
			<path d="M0 200 L150 300 L150 1560 L0 1720Z" fill="#a8afbb" />
			<path d="M1080 200 L930 300 L930 1560 L1080 1720Z" fill="#a8afbb" />
			<path d="M0 1720 L150 1560 H930 L1080 1720 V1920 H0Z" fill="url(#pisoEl)" />
			{/* corrimão */}
			<line x1={10} y1={1180} x2={150} y2={1110} stroke="#d9a03a" strokeWidth={16} strokeLinecap="round" />
			{/* parede do fundo com as portas */}
			<rect x={150} y={300} width={780} height={1260} fill="#c3c9d3" />
			{/* indicador de andar */}
			<rect x={440} y={330} width={200} height={110} rx={14} fill="#111" stroke="#5b6170" strokeWidth={8} />
			<text x={540} y={415} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill="#ff4d3a">
				{andar}
			</text>
			<Portas x={250} y={490} w={580} h={1070} abertura={abertura} />
			<rect width={W} height={H} fill={`rgba(255,240,200,${0.04 + 0.02 * Math.sin(f / 9)})`} />
			{children}
		</g>
	);
};

// ícones dos botões
export const IconeFechar: React.FC<{s?: number; cor?: string}> = ({s = 1, cor = CONTORNO}) => (
	<g transform={`scale(${s})`} fill={cor}>
		<path d="M-44 -26 L-8 0 L-44 26Z" />
		<path d="M44 -26 L8 0 L44 26Z" />
		<rect x={-3} y={-30} width={6} height={60} />
	</g>
);
export const IconeAbrir: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`} fill={CONTORNO}>
		<path d="M-10 -26 L-46 0 L-10 26Z" />
		<path d="M10 -26 L46 0 L10 26Z" />
		<rect x={-3} y={-30} width={6} height={60} />
	</g>
);

// painel de botões em close (centro em 0,0)
export const Painel: React.FC<{aceso?: boolean; apertado?: boolean; destaque?: boolean; desligado?: number}> = ({aceso = true, apertado = false, destaque = false, desligado = 0}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>{aco('painelAco')}</defs>
			<rect x={-300} y={-620} width={600} height={1240} rx={40} fill="url(#painelAco)" stroke={CONTORNO} strokeWidth={12} />
			<rect x={-250} y={-570} width={500} height={110} rx={16} fill="#111" />
			<text x={0} y={-485} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#ff4d3a">7</text>
			{Array.from({length: 8}).map((_, i) => {
				const col = i % 2, lin = Math.floor(i / 2);
				return (
					<g key={i} transform={`translate(${col ? 110 : -110}, ${-330 + lin * 150})`}>
						<circle r={56} fill="#e9ecf2" stroke={CONTORNO} strokeWidth={8} />
						<circle r={46} fill="none" stroke={i === 2 ? '#ffb43a' : '#a8afbb'} strokeWidth={6} />
						<text y={22} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={60} fill={CONTORNO}>
							{8 - i}
						</text>
					</g>
				);
			})}
			{/* abrir */}
			<g transform="translate(-110, 360)">
				<circle r={74} fill="#e9ecf2" stroke={CONTORNO} strokeWidth={9} />
				<IconeAbrir s={0.9} />
			</g>
			{/* fechar — o botão da história */}
			<g transform={`translate(110, 360) scale(${apertado ? 0.92 : 1})`}>
				{destaque && <circle r={110} fill="none" stroke="#ffd23f" strokeWidth={14} opacity={0.5 + 0.5 * Math.sin(f / 3)} />}
				<circle r={74} fill={aceso && desligado < 0.5 ? (apertado ? '#ffe9a8' : '#e9ecf2') : '#8b919c'} stroke={CONTORNO} strokeWidth={9} />
				{aceso && desligado < 0.5 && <circle r={64} fill="none" stroke={apertado ? '#ffb43a' : '#a8afbb'} strokeWidth={7} />}
				<IconeFechar s={0.9} cor={desligado >= 0.5 ? '#555a63' : CONTORNO} />
			</g>
			{/* alarme */}
			<g transform="translate(0, 520)">
				<rect x={-90} y={-40} width={180} height={80} rx={18} fill="#d6262f" stroke={CONTORNO} strokeWidth={8} />
				<path d="M-20 14 Q-20 -24 0 -24 Q20 -24 20 14Z M-28 14 H28" fill="#ffd23f" stroke={CONTORNO} strokeWidth={5} />
			</g>
		</g>
	);
};

// mão com o indicador esticado (ponta do dedo em 0,0, apontando para a direita)
export const Dedo: React.FC<{s?: number; rot?: number; manga?: string}> = ({s = 1, rot = 0, manga = '#3b3f4a'}) => (
	<g transform={`rotate(${rot}) scale(${s})`}>
		<rect x={-560} y={-70} width={330} height={150} rx={40} fill={manga} stroke={CONTORNO} strokeWidth={10} />
		<rect x={-260} y={-80} width={40} height={170} rx={14} fill="#fff" stroke={CONTORNO} strokeWidth={8} />
		<path d="M-235 -60 C-180 -86 -120 -80 -90 -54 L-20 -50 C10 -50 10 -10 -20 -10 L-90 -10 C-80 20 -90 60 -130 74 C-170 90 -230 80 -240 40Z" fill="#fff" stroke={CONTORNO} strokeWidth={10} strokeLinejoin="round" />
		<path d="M-110 30 h-60 M-110 56 h-50" stroke={CONTORNO} strokeWidth={6} strokeLinecap="round" />
	</g>
);

export const CadeiraDeRodas: React.FC<{giro?: number}> = ({giro = 0}) => (
	<g>
		<path d="M-90 -230 L-70 -60 L90 -60" stroke="#3a3f4a" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M-90 -230 L-100 -380" stroke="#3a3f4a" strokeWidth={16} strokeLinecap="round" />
		<path d="M-110 -380 h-50" stroke={CONTORNO} strokeWidth={16} strokeLinecap="round" />
		<g transform={`translate(-40, -150) rotate(${giro})`}>
			<circle r={150} fill="none" stroke={CONTORNO} strokeWidth={18} />
			<circle r={125} fill="none" stroke="#9aa1ad" strokeWidth={8} />
			{[0, 45, 90, 135].map((a) => (
				<line key={a} x1={Math.cos((a * Math.PI) / 180) * -125} y1={Math.sin((a * Math.PI) / 180) * -125} x2={Math.cos((a * Math.PI) / 180) * 125} y2={Math.sin((a * Math.PI) / 180) * 125} stroke="#9aa1ad" strokeWidth={5} />
			))}
			<circle r={16} fill={CONTORNO} />
		</g>
		<circle cx={120} cy={-35} r={35} fill="#2a2e38" stroke={CONTORNO} strokeWidth={8} />
	</g>
);

export const Lei1990: React.FC<{carimbo: number; f: number}> = ({carimbo}) => (
	<g>
		<path d="M-330 -480 H330 V480 H-330Z" fill="#f6ead0" stroke={CONTORNO} strokeWidth={12} />
		<rect x={-370} y={-520} width={740} height={70} rx={35} fill="#d9c49a" stroke={CONTORNO} strokeWidth={10} />
		<rect x={-370} y={450} width={740} height={70} rx={35} fill="#d9c49a" stroke={CONTORNO} strokeWidth={10} />
		<text x={0} y={-320} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill={CONTORNO}>
			LAW
		</text>
		<text x={0} y={-180} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={150} fill="#2f5bd3">
			1990
		</text>
		{Array.from({length: 6}).map((_, i) => (
			<rect key={i} x={-250} y={-90 + i * 70} width={i % 2 ? 420 : 500} height={22} rx={11} fill="#cbb98f" />
		))}
		{carimbo > 0 && (
			<g transform={`translate(120, 300) rotate(-14) scale(${1.6 - 0.6 * carimbo})`} opacity={Math.min(1, carimbo * 1.5)}>
				<rect x={-230} y={-80} width={460} height={160} rx={20} fill="none" stroke="#d6262f" strokeWidth={16} />
				<text x={0} y={34} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={96} fill="#d6262f">
					PASSED
				</text>
			</g>
		)}
	</g>
);

export const Cupula: React.FC = () => (
	<g fill="#c7cde0" stroke={CONTORNO} strokeWidth={8}>
		<rect x={-420} y={-60} width={840} height={260} />
		{Array.from({length: 9}).map((_, i) => (
			<rect key={i} x={-380 + i * 92} y={-30} width={30} height={220} fill="#e2e6f1" />
		))}
		<rect x={-460} y={-100} width={920} height={50} />
		<path d="M-240 -100 Q-240 -380 0 -400 Q240 -380 240 -100Z" />
		<rect x={-30} y={-470} width={60} height={80} />
		<circle cx={0} cy={-490} r={26} />
	</g>
);

export const SimboloAcesso: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<rect x={-110} y={-110} width={220} height={220} rx={26} fill="#2f5bd3" stroke={CONTORNO} strokeWidth={10} />
		<g stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round">
			<circle cx={-6} cy={-66} r={12} fill="#fff" />
			<path d="M-10 -42 L-4 16 H44 L60 60" />
			<path d="M-6 -12 H36" />
			<path d="M-28 -10 A54 54 0 1 0 34 54" />
		</g>
	</g>
);

export const Chave: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		<circle cx={-90} cy={0} r={46} fill="#f2c14e" stroke={CONTORNO} strokeWidth={9} />
		<circle cx={-90} cy={0} r={16} fill="#fff" stroke={CONTORNO} strokeWidth={6} />
		<path d="M-46 -12 H90 V12 H70 V34 H50 V12 H30 V28 H10 V12 H-46Z" fill="#f2c14e" stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />
	</g>
);

export const Pilula: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s}) rotate(-30)`}>
		<path d="M0 -70 H-90 A70 70 0 0 0 -90 70 H0Z" fill="#e8463f" stroke={CONTORNO} strokeWidth={10} />
		<path d="M0 -70 H90 A70 70 0 0 1 90 70 H0Z" fill="#fff" stroke={CONTORNO} strokeWidth={10} />
		<path d="M-120 -36 Q-90 -54 -50 -50" stroke="rgba(255,255,255,0.7)" strokeWidth={12} fill="none" strokeLinecap="round" />
	</g>
);

export const Rua: React.FC<{sinal: 'pare' | 'siga'}> = ({sinal}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<defs>
				<linearGradient id="ceuDia" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#7fc4f5" />
					<stop offset="1" stopColor="#d4ecfb" />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ceuDia)" />
			{[[-20, 700, 260, '#8a93a8'], [230, 500, 220, '#a7aec0'], [440, 820, 240, '#7c859b'], [680, 420, 200, '#9ba3b7'], [870, 650, 260, '#878fa4']].map(([x, h, w, c], i) => (
				<g key={i}>
					<rect x={x as number} y={1150 - (h as number)} width={w as number} height={h as number} fill={c as string} stroke={CONTORNO} strokeWidth={7} />
					{Array.from({length: Math.floor((h as number) / 90)}).map((_, r) =>
						[0, 1, 2].map((k) => (
							<rect key={`${r}-${k}`} x={(x as number) + 30 + k * (((w as number) - 60) / 3)} y={1150 - (h as number) + 30 + r * 90} width={36} height={50} fill={(r + k + i) % 4 ? '#d9ecff' : '#ffe58a'} />
						)),
					)}
				</g>
			))}
			<rect y={1150} width={W} height={120} fill="#c9c9c9" stroke={CONTORNO} strokeWidth={6} />
			<rect y={1270} width={W} height={650} fill="#4a4d55" />
			{Array.from({length: 7}).map((_, i) => (
				<rect key={i} x={40 + i * 150} y={1360} width={90} height={500} fill="#f4f4f4" opacity={0.92} />
			))}
			{/* carro passando */}
			<g transform={`translate(${((f * 18) % 2200) - 600}, 1640)`}>
				<rect x={-180} y={-90} width={360} height={110} rx={30} fill="#e8463f" stroke={CONTORNO} strokeWidth={9} />
				<path d="M-100 -90 L-60 -160 H70 L110 -90Z" fill="#9fd3ff" stroke={CONTORNO} strokeWidth={9} />
				<circle cx={-100} cy={24} r={36} fill="#222" stroke={CONTORNO} strokeWidth={8} />
				<circle cx={100} cy={24} r={36} fill="#222" stroke={CONTORNO} strokeWidth={8} />
			</g>
			{/* poste com o botão e o semáforo de pedestre */}
			<g transform="translate(860, 0)">
				<rect x={-18} y={520} width={36} height={760} fill="#3a3f4a" stroke={CONTORNO} strokeWidth={6} />
				<rect x={-90} y={420} width={180} height={220} rx={20} fill="#2a2e38" stroke={CONTORNO} strokeWidth={8} />
				<circle cx={0} cy={480} r={40} fill={sinal === 'pare' ? '#ff4d3a' : '#3a2020'} />
				<circle cx={0} cy={580} r={40} fill={sinal === 'siga' ? '#5aff7a' : '#203a24'} />
				<rect x={-70} y={860} width={140} height={190} rx={18} fill="#f2c14e" stroke={CONTORNO} strokeWidth={8} />
				<text x={0} y={915} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={40} fill={CONTORNO}>
					PUSH
				</text>
				<circle cx={0} cy={985} r={40} fill="#c7ccd6" stroke={CONTORNO} strokeWidth={8} />
			</g>
		</g>
	);
};
