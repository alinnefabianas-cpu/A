import React from 'react';
import {useCurrentFrame} from 'remotion';

export const CONTORNO = '#241820';

export type Roupa = 'comandante' | 'copiloto' | 'comissaria' | 'passageiro';
export type Expressao = 'feliz' | 'neutro' | 'confuso' | 'enjoado' | 'bravo' | 'dormindo' | 'assustado' | 'serio' | 'pidao';

type Props = {
	x: number;
	y: number;
	escala?: number;
	roupa: Roupa;
	expressao?: Expressao;
	cor?: string; // cor da roupa do passageiro
	cabelo?: string;
	falando?: boolean;
	// ângulos dos braços em graus (0 = pendurado, 90 = para o lado, 160 = para cima)
	bracoE?: number;
	bracoD?: number;
	cotoveloE?: number;
	cotoveloD?: number;
	olhar?: number; // -1 esquerda, 1 direita
	inclinar?: number; // graus
	enjoo?: number; // 0..1 deixa o rosto verde
	semPernas?: boolean;
	espelhar?: boolean;
	itemD?: React.ReactNode; // desenhado na mão direita (coord. locais da mão)
	itemE?: React.ReactNode;
	fase?: number; // dessincroniza respiração/piscar
};

const W = 10; // espessura do contorno

const Braco: React.FC<{lado: 1 | -1; ang: number; cot: number; manga: string; item?: React.ReactNode}> = ({lado, ang, cot, manga, item}) => {
	// ombro em (lado*62, -405); braço de duas partes
	const a1 = (ang * Math.PI) / 180;
	const s1 = 105, s2 = 100;
	const ex = Math.sin(a1) * s1 * lado, ey = Math.cos(a1) * s1;
	const a2 = a1 + (cot * Math.PI) / 180;
	const hx = ex + Math.sin(a2) * s2 * lado, hy = ey + Math.cos(a2) * s2;
	return (
		<g transform={`translate(${lado * 62}, -405)`}>
			<path d={`M0 0 L${ex} ${ey} L${hx} ${hy}`} stroke={CONTORNO} strokeWidth={W + 8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={`M0 0 L${ex * 0.55} ${ey * 0.55}`} stroke={manga} strokeWidth={10} fill="none" strokeLinecap="round" />
			<g transform={`translate(${hx}, ${hy})`}>
				{item}
				<circle r={15} fill="#fff" stroke={CONTORNO} strokeWidth={W - 2} />
			</g>
		</g>
	);
};

const Olhos: React.FC<{exp: Expressao; piscando: boolean; olhar: number}> = ({exp, piscando, olhar}) => {
	const ox = olhar * 10;
	const fechados = piscando || exp === 'dormindo' || exp === 'feliz';
	const sobrancelha = (() => {
		switch (exp) {
			case 'bravo':
			case 'serio':
				return ['M-78 -612 L-22 -596', 'M78 -612 L22 -596'];
			case 'confuso':
				return ['M-78 -606 L-24 -612', 'M24 -626 L78 -606'];
			case 'enjoado':
			case 'pidao':
				return ['M-74 -598 L-24 -616', 'M74 -598 L24 -616'];
			case 'assustado':
				return ['M-76 -628 Q-50 -644 -24 -630', 'M76 -628 Q50 -644 24 -630'];
			default:
				return ['M-74 -614 Q-50 -626 -26 -614', 'M74 -614 Q50 -626 26 -614'];
		}
	})();
	return (
		<g>
			{sobrancelha.map((d, i) => (
				<path key={i} d={d} stroke={CONTORNO} strokeWidth={9} fill="none" strokeLinecap="round" />
			))}
			{fechados ? (
				exp === 'feliz' && !piscando ? (
					<>
						<path d="M-66 -572 Q-50 -590 -34 -572" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />
						<path d="M34 -572 Q50 -590 66 -572" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />
					</>
				) : (
					<>
						<path d="M-66 -578 Q-50 -566 -34 -578" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />
						<path d="M34 -578 Q50 -566 66 -578" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />
					</>
				)
			) : exp === 'assustado' ? (
				<>
					<circle cx={-50} cy={-578} r={22} fill="#fff" stroke={CONTORNO} strokeWidth={6} />
					<circle cx={50} cy={-578} r={22} fill="#fff" stroke={CONTORNO} strokeWidth={6} />
					<circle cx={-50 + ox * 0.6} cy={-578} r={8} fill={CONTORNO} />
					<circle cx={50 + ox * 0.6} cy={-578} r={8} fill={CONTORNO} />
				</>
			) : exp === 'enjoado' ? (
				<>
					<path d="M-64 -584 L-36 -572 L-64 -562" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M64 -584 L36 -572 L64 -562" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</>
			) : (
				<>
					<ellipse cx={-50 + ox} cy={-576} rx={exp === 'pidao' ? 16 : 13} ry={exp === 'pidao' ? 19 : 16} fill={CONTORNO} />
					<ellipse cx={50 + ox} cy={-576} rx={exp === 'pidao' ? 16 : 13} ry={exp === 'pidao' ? 19 : 16} fill={CONTORNO} />
					<circle cx={-46 + ox} cy={-582} r={exp === 'pidao' ? 6 : 4} fill="#fff" />
					<circle cx={54 + ox} cy={-582} r={exp === 'pidao' ? 6 : 4} fill="#fff" />
				</>
			)}
		</g>
	);
};

const Boca: React.FC<{exp: Expressao; abre: number}> = ({exp, abre}) => {
	if (abre > 0.05 && exp !== 'dormindo') {
		const h = 8 + abre * 34;
		return (
			<g>
				<ellipse cx={0} cy={-512 + h / 2} rx={26} ry={h / 2 + 6} fill="#7a2331" stroke={CONTORNO} strokeWidth={7} />
				<ellipse cx={0} cy={-505 + h} rx={14} ry={Math.min(8, h / 3)} fill="#e86f86" />
			</g>
		);
	}
	switch (exp) {
		case 'feliz':
			return (
				<g>
					<path d="M-40 -526 Q0 -466 40 -526 Z" fill="#7a2331" stroke={CONTORNO} strokeWidth={7} strokeLinejoin="round" />
					<path d="M-20 -500 Q0 -484 20 -500" fill="#e86f86" />
				</g>
			);
		case 'bravo':
		case 'serio':
			return <path d="M-26 -508 L26 -508" stroke={CONTORNO} strokeWidth={8} strokeLinecap="round" />;
		case 'confuso':
			return <path d="M-28 -506 Q-10 -518 6 -506 Q18 -496 30 -510" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />;
		case 'enjoado':
			return <path d="M-32 -500 Q-16 -516 0 -500 Q16 -484 32 -500" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />;
		case 'dormindo':
			return <ellipse cx={0} cy={-506} rx={9} ry={11} fill="#7a2331" stroke={CONTORNO} strokeWidth={6} />;
		case 'assustado':
			return <ellipse cx={0} cy={-500} rx={20} ry={26} fill="#7a2331" stroke={CONTORNO} strokeWidth={7} />;
		case 'pidao':
			return <path d="M-16 -506 Q0 -516 16 -506" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />;
		default:
			return <path d="M-24 -514 Q0 -496 24 -514" stroke={CONTORNO} strokeWidth={8} fill="none" strokeLinecap="round" />;
	}
};

const ROUPAS: Record<Roupa, {tronco: string; detalhe: string}> = {
	comandante: {tronco: '#1f2f57', detalhe: '#f2c14e'},
	copiloto: {tronco: '#2b3d6b', detalhe: '#f2c14e'},
	comissaria: {tronco: '#c8323f', detalhe: '#f6e7c8'},
	passageiro: {tronco: '#5a8f6a', detalhe: '#fff'},
};

export const Personagem: React.FC<Props> = (p) => {
	const f = useCurrentFrame() + (p.fase ?? 0) * 37;
	const exp = p.expressao ?? 'neutro';
	const respira = Math.sin(f / 14) * 4;
	const piscando = f % 97 < 4 && exp !== 'dormindo';
	const abre = p.falando ? Math.max(0, Math.sin(f * 0.9) * 0.6 + Math.sin(f * 0.43) * 0.4) : 0;
	const roupa = ROUPAS[p.roupa];
	const tronco = p.roupa === 'passageiro' && p.cor ? p.cor : roupa.tronco;
	const enjoo = p.enjoo ?? 0;
	const pele = enjoo > 0 ? mix('#ffffff', '#bfe3a0', enjoo) : '#ffffff';
	const cabelo = p.cabelo ?? '#4a3326';

	return (
		<g transform={`translate(${p.x}, ${p.y}) scale(${(p.escala ?? 1) * (p.espelhar ? -1 : 1)}, ${p.escala ?? 1}) rotate(${p.inclinar ?? 0})`}>
			{/* sombra */}
			{!p.semPernas && <ellipse cx={0} cy={6} rx={120} ry={20} fill="rgba(0,0,0,0.22)" />}
			{/* pernas */}
			{!p.semPernas && (
				<g stroke={CONTORNO} strokeLinecap="round" fill="none">
					<path d="M-30 -210 L-38 -6 L-74 0" strokeWidth={W + 6} strokeLinejoin="round" />
					<path d="M30 -210 L38 -6 L74 0" strokeWidth={W + 6} strokeLinejoin="round" />
				</g>
			)}
			<g transform={`translate(0, ${respira * 0.5})`}>
				{/* braço de trás */}
				<Braco lado={-1} ang={p.bracoE ?? 12} cot={p.cotoveloE ?? 10} manga={tronco} item={p.itemE} />
				{/* tronco (feijão) */}
				<path
					d="M-78 -380 C-82 -440 -40 -452 0 -452 C40 -452 82 -440 78 -380 L74 -250 C72 -205 40 -196 0 -196 C-40 -196 -72 -205 -74 -250 Z"
					fill={tronco}
					stroke={CONTORNO}
					strokeWidth={W}
				/>
				{/* luz lateral (dá volume) */}
				<path d="M-58 -400 C-62 -330 -60 -280 -50 -232" stroke="rgba(255,255,255,0.18)" strokeWidth={14} fill="none" strokeLinecap="round" />
				<DetalheRoupa roupa={p.roupa} cor={roupa.detalhe} />
				{/* pescoço + cabeça */}
				<g transform={`translate(0, ${respira * 0.3})`}>
					{p.roupa === 'comissaria' && <circle cx={0} cy={-680} r={46} fill={cabelo} stroke={CONTORNO} strokeWidth={W} />}
					<ellipse cx={0} cy={-560} rx={124} ry={118} fill={pele} stroke={CONTORNO} strokeWidth={W} />
					<path d="M-96 -520 C-80 -470 -30 -452 20 -454" stroke="rgba(160,170,200,0.25)" strokeWidth={16} fill="none" strokeLinecap="round" />
					<Cabelo roupa={p.roupa} cor={cabelo} />
					<Olhos exp={exp} piscando={piscando} olhar={p.olhar ?? 0} />
					{(exp === 'feliz' || exp === 'pidao') && (
						<>
							<ellipse cx={-80} cy={-530} rx={18} ry={10} fill="#f6a5b4" opacity={0.7} />
							<ellipse cx={80} cy={-530} rx={18} ry={10} fill="#f6a5b4" opacity={0.7} />
						</>
					)}
					{p.roupa === 'comandante' && <path d="M-44 -532 Q-22 -548 0 -536 Q22 -548 44 -532 Q22 -524 0 -530 Q-22 -524 -44 -532Z" fill="#4a3326" stroke={CONTORNO} strokeWidth={4} />}
					<Boca exp={exp} abre={abre} />
					{exp === 'enjoado' && (
						<path d="M96 -610 Q110 -580 100 -566 Q86 -574 96 -610Z" fill="#8fd3ff" stroke={CONTORNO} strokeWidth={4} />
					)}
					<Chapeu roupa={p.roupa} cor={roupa.detalhe} tronco={tronco} />
				</g>
				{/* braço da frente */}
				<Braco lado={1} ang={p.bracoD ?? 12} cot={p.cotoveloD ?? 10} manga={tronco} item={p.itemD} />
			</g>
		</g>
	);
};

const DetalheRoupa: React.FC<{roupa: Roupa; cor: string}> = ({roupa, cor}) => {
	if (roupa === 'comandante' || roupa === 'copiloto') {
		const faixas = roupa === 'comandante' ? 4 : 3;
		return (
			<g>
				{/* camisa e gravata */}
				<path d="M-30 -448 L0 -380 L30 -448 Z" fill="#fff" stroke={CONTORNO} strokeWidth={5} />
				<path d="M0 -430 L-10 -400 L0 -330 L10 -400 Z" fill="#11182e" />
				{/* lapelas */}
				<path d="M-30 -448 L-4 -330 M30 -448 L4 -330" stroke={CONTORNO} strokeWidth={5} />
				{/* botões dourados */}
				{[-300, -260].map((y) => (
					<g key={y}>
						<circle cx={-22} cy={y} r={7} fill={cor} stroke={CONTORNO} strokeWidth={3} />
						<circle cx={22} cy={y} r={7} fill={cor} stroke={CONTORNO} strokeWidth={3} />
					</g>
				))}
				{/* asas no peito */}
				<path d="M34 -378 l14 -6 l14 6 l-14 4z M20 -380 h56" stroke={cor} strokeWidth={5} fill={cor} />
				{/* galões no ombro */}
				{Array.from({length: faixas}).map((_, i) => (
					<g key={i}>
						<line x1={-74} y1={-430 + i * 9} x2={-50} y2={-436 + i * 9} stroke={cor} strokeWidth={5} />
						<line x1={74} y1={-430 + i * 9} x2={50} y2={-436 + i * 9} stroke={cor} strokeWidth={5} />
					</g>
				))}
			</g>
		);
	}
	if (roupa === 'comissaria') {
		return (
			<g>
				<path d="M-34 -448 L0 -400 L34 -448" fill={cor} stroke={CONTORNO} strokeWidth={5} />
				<path d="M-40 -438 Q0 -400 40 -438 L20 -420 L0 -428 L-20 -420Z" fill="#f2c14e" stroke={CONTORNO} strokeWidth={3} />
				<rect x={-74} y={-280} width={148} height={12} fill={CONTORNO} />
				<rect x={30} y={-390} width={34} height={14} rx={3} fill="#f6e7c8" stroke={CONTORNO} strokeWidth={3} />
			</g>
		);
	}
	return <path d="M-26 -446 Q0 -420 26 -446" stroke={CONTORNO} strokeWidth={6} fill="none" />;
};

const Cabelo: React.FC<{roupa: Roupa; cor: string}> = ({roupa, cor}) => {
	if (roupa === 'comissaria')
		return <path d="M-120 -590 C-110 -690 110 -690 120 -590 C80 -640 30 -650 -10 -626 C-50 -650 -100 -630 -120 -590Z" fill={cor} stroke={CONTORNO} strokeWidth={8} />;
	if (roupa === 'copiloto')
		return <path d="M-116 -600 C-100 -690 100 -690 116 -600 L96 -626 L70 -606 L40 -632 L10 -606 L-20 -634 L-50 -606 L-80 -630Z" fill={cor} stroke={CONTORNO} strokeWidth={8} strokeLinejoin="round" />;
	if (roupa === 'passageiro')
		return <path d="M-112 -610 C-96 -690 96 -690 112 -610 C70 -650 -40 -660 -112 -610Z" fill={cor} stroke={CONTORNO} strokeWidth={8} />;
	return null;
};

const Chapeu: React.FC<{roupa: Roupa; cor: string; tronco: string}> = ({roupa, cor, tronco}) => {
	if (roupa === 'comandante')
		return (
			<g>
				<path d="M-150 -640 C-150 -720 150 -720 150 -640 Z" fill="#fdfdfd" stroke={CONTORNO} strokeWidth={W} />
				<rect x={-118} y={-646} width={236} height={34} fill="#141b33" stroke={CONTORNO} strokeWidth={W - 2} />
				<path d="M-118 -612 Q0 -568 118 -612 L104 -600 Q0 -566 -104 -600Z" fill="#0d1224" stroke={CONTORNO} strokeWidth={6} />
				<path d="M-60 -640 Q0 -652 60 -640" stroke={cor} strokeWidth={6} fill="none" />
				<circle cx={0} cy={-668} r={18} fill={cor} stroke={CONTORNO} strokeWidth={5} />
				<path d="M-40 -668 h-20 M40 -668 h20" stroke={cor} strokeWidth={8} strokeLinecap="round" />
			</g>
		);
	if (roupa === 'comissaria')
		return (
			<g transform="rotate(-12 40 -680)">
				<rect x={0} y={-700} width={84} height={40} rx={10} fill={tronco} stroke={CONTORNO} strokeWidth={8} />
				<rect x={0} y={-676} width={84} height={8} fill="#f2c14e" />
			</g>
		);
	return null;
};

function mix(a: string, b: string, t: number) {
	const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
	const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
	return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
}
