import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Personagem} from './Personagem';
import {
	Amendoim, Balao, Bandeja, CabinePassageiros, CeuNoturno, Cockpit, ConsoleFrente, Coxa, Cozinha, FileiraPoltronas,
	H, Interrogacao, LinhasImpacto, Peixe, Poltrona, Relogio, W, Zzz,
} from './Cenarios';
import {FPS, Lingua, MARCAS, Marca, TEXTOS, cenas, marcaEm, pastaVoz, Palavra} from './roteiro';
import {Legenda} from './Legenda';

export const s2f = (s: number) => Math.round(s * FPS);

// ---------- câmera: zoom/pan suave + tremor ----------
export const Camera: React.FC<{
	de?: [number, number, number]; // [x, y, zoom] — ponto focal e zoom
	para?: [number, number, number];
	dur: number;
	tremor?: number;
	soco?: number; // frame de um "zoom punch"
	children: React.ReactNode;
}> = ({de = [W / 2, H / 2, 1], para, dur, tremor = 0, soco, children}) => {
	const f = useCurrentFrame();
	const fim = para ?? de;
	const t = interpolate(f, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const x = de[0] + (fim[0] - de[0]) * t;
	const y = de[1] + (fim[1] - de[1]) * t;
	let z = de[2] + (fim[2] - de[2]) * t;
	if (soco !== undefined && f >= soco) z *= 1 + 0.12 * Math.exp(-(f - soco) / 4);
	// entrada da cena: leve zoom-in de corte
	z *= 1 + 0.05 * Math.exp(-f / 3);
	// nunca mostrar além da arte (evita faixa preta): mantém o quadro dentro de 0..W x 0..H
	const xc = z >= 1 ? Math.min(Math.max(x, W / 2 / z), W - W / 2 / z) : W / 2;
	const yc = z >= 1 ? Math.min(Math.max(y, H / 2 / z), H - H / 2 / z) : H / 2;
	const tx = Math.sin(f * 1.7) * tremor + Math.sin(f * 0.9) * tremor * 0.5;
	const ty = Math.cos(f * 1.3) * tremor;
	return (
		<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute'}}>
			<g transform={`translate(${W / 2 + tx}, ${H / 2 + ty}) scale(${z}) translate(${-xc}, ${-yc})`}>{children}</g>
		</svg>
	);
};

export const Vinheta: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
);

export const Sfx: React.FC<{src: string; em: number; vol?: number}> = ({src, em, vol = 0.6}) => (
	<Sequence from={Math.max(0, em)} layout="none">
		<Audio src={staticFile(`audio/${src}.wav`)} volume={vol} />
	</Sequence>
);

export const usePop = (inicio: number, damping = 10) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return f < inicio ? 0 : spring({frame: f - inicio, fps, config: {damping, stiffness: 190}});
};

// ---------- pilotos sentados no cockpit ----------
const PilotosNoCockpit: React.FC<{
	cmd?: Partial<React.ComponentProps<typeof Personagem>>;
	cop?: Partial<React.ComponentProps<typeof Personagem>>;
	alarme?: boolean;
	extraFrente?: React.ReactNode;
	extraMeio?: React.ReactNode;
}> = ({cmd, cop, alarme, extraFrente, extraMeio}) => (
	<g>
		<Cockpit alarme={alarme} />
		<Poltrona x={290} />
		<Poltrona x={790} />
		<Personagem x={290} y={1640} escala={1.02} roupa="comandante" olhar={0.6} fase={0} {...cmd} />
		<Personagem x={790} y={1640} escala={1.0} roupa="copiloto" olhar={-0.6} cabelo="#2d1f17" fase={3} {...cop} />
		{extraMeio}
		<ConsoleFrente />
		{extraFrente}
	</g>
);

// ======================= CENAS =======================

// 0 — gancho: os dois com o MESMO prato… e um "proibido"
type P = {dur: number; m: (k: Marca) => number; tx: Record<string, string>};

const Cena0: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tP = m('proibido');
	const proibido = usePop(tP, 9);
	return (
		<>
			<Camera de={[540, 1080, 1.25]} para={[540, 1020, 1.1]} dur={dur} soco={tP}>
				<PilotosNoCockpit
					cmd={{expressao: f > tP ? 'assustado' : 'feliz', bracoD: 30, cotoveloD: -45, bracoE: 30, cotoveloE: -45}}
					cop={{expressao: f > tP ? 'assustado' : 'feliz', bracoD: 30, cotoveloD: -45, bracoE: 30, cotoveloE: -45}}
					extraFrente={
						<>
							<g transform="translate(290, 1250)"><Bandeja comida="frango" s={0.9} /></g>
							<g transform="translate(790, 1250)"><Bandeja comida="frango" s={0.9} /></g>
							{proibido > 0 && (
								<g transform={`translate(540, 1180) scale(${proibido}) rotate(${(1 - proibido) * -40})`}>
									<circle r={170} fill="none" stroke="#e8262f" strokeWidth={42} />
									<line x1={-120} y1={-120} x2={120} y2={120} stroke="#e8262f" strokeWidth={42} strokeLinecap="round" />
								</g>
							)}
						</>
					}
				/>
			</Camera>
			<Sfx src="buzz" em={tP} vol={0.35} />
			<Sfx src="pop" em={s2f(0.1)} vol={0.4} />
		</>
	);
};

// 1 — voo noturno (avião) → passageiros dormindo
const Cena1: React.FC<P> = ({dur, m, tx}) => {
	const f = useCurrentFrame();
	const corte = m('corte1') - 2;
	const tRel = m('relogio');
	const tCont = m('contador');
	const rel = usePop(tRel);
	const cont = usePop(tCont, 12);
	if (f < corte)
		return (
			<>
				<Camera de={[540, 960, 1.15]} para={[600, 920, 1.0]} dur={corte}>
					<CeuNoturno aviaoX={interpolate(f, [0, corte], [380, 640])} aviaoY={950} aviaoS={1.05} balanco={-3} />
					{rel > 0 && (
						<g transform={`translate(540, 430) scale(${rel})`}>
							<Relogio hora={10} s={1.6} />
							<text x={0} y={220} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#fff" stroke="#000" strokeWidth={16} paintOrder="stroke">{tx.horas}</text>
						</g>
					)}
				</Camera>
				<Sfx src="aviao" em={0} vol={0.35} />
				<Sfx src="pop" em={tRel} vol={0.4} />
			</>
		);
	const cores = ['#5a8f6a', '#b8577a', '#d9a03a', '#4f7cc9', '#8a63c2', '#c9603a', '#3a9c9c', '#6b6b6b'];
	const cabelos = ['#4a3326', '#e0b04a', '#1d1d1d', '#8a4b2a', '#c9c9c9', '#3d2a1e'];
	return (
		<>
			<Sequence from={corte} layout="none">
				<Camera de={[540, 1100, 1.45]} para={[540, 960, 1.0]} dur={dur - corte}>
					<CabinePassageiros>
						{[0, 1, 2].map((fila) => {
							const y = 900 + fila * 330;
							const s = 0.62 + fila * 0.2;
							return (
								<g key={fila}>
									<FileiraPoltronas y={y} s={s} cor={fila % 2 ? '#3355a8' : '#2c4a96'} />
									{[-360, -120, 120, 360].map((x, i) => {
										const px = 540 + x * s;
										const k = fila * 4 + i;
										return (
											<g key={x}>
												<Personagem x={px} y={y + 120 * s} escala={0.5 * s} roupa="passageiro" expressao="dormindo" cor={cores[k % cores.length]} cabelo={cabelos[k % cabelos.length]} semPernas inclinar={(k % 2 ? 1 : -1) * 9} fase={k} />
												{k % 3 === 0 && <Zzz x={px + 40 * s} y={y - 260 * s} fase={k} />}
											</g>
										);
									})}
								</g>
							);
						})}
						{cont > 0 && (
							<g transform={`translate(540, 520) scale(${cont})`}>
								<rect x={-260} y={-110} width={520} height={190} rx={40} fill="#ffd23f" stroke="#000" strokeWidth={12} />
								<text x={0} y={40} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={130} fill="#000">
									{Math.min(300, Math.round(interpolate(f - tCont, [0, 18], [0, 300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})))} zZz
								</text>
							</g>
						)}
					</CabinePassageiros>
				</Camera>
			</Sequence>
			<Sfx src="whoosh" em={corte - 4} vol={0.4} />
			<Sfx src="pop" em={tCont} vol={0.45} />
		</>
	);
};

// 2 — comandante pede frango; copiloto também
const Cena2: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCmd = m('cmd');
	const tCop = m('cop');
	const tCopFala = m('copFala');
	const focoX = interpolate(f, [tCop - 6, tCop + 8], [330, 750], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const z = interpolate(f, [0, tCmd], [1.05, 1.35], {extrapolateRight: 'clamp'});
	return (
		<>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute'}}>
				<g transform={`translate(${W / 2}, ${H / 2}) scale(${f < tCmd ? z : 1.35}) translate(${-(f < tCmd ? 540 : focoX)}, ${-1000})`}>
					<PilotosNoCockpit
						cmd={{falando: f >= tCmd && f < tCop - 4, expressao: 'feliz', bracoD: f >= tCmd && f < tCop ? 120 : 15, cotoveloD: f >= tCmd && f < tCop ? 30 : 10}}
						cop={{falando: f >= tCopFala && f < dur - 6, expressao: f >= tCopFala ? 'feliz' : 'neutro', olhar: -1, bracoE: f >= tCopFala ? 140 : 15, cotoveloE: 20}}
						extraFrente={
							<>
								<Balao x={430} y={720} inicio={tCmd + 10} lado={-1}><g transform="translate(-6,0)"><Coxa s={0.95} /></g></Balao>
								<Balao x={660} y={720} inicio={tCopFala + 6} lado={1}><g transform="translate(-6,0)"><Coxa s={0.95} /></g></Balao>
								{f >= tCopFala + 6 && <text x={830} y={640} fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#ffd23f" stroke="#000" strokeWidth={14} paintOrder="stroke" transform={`rotate(12 830 640)`}>+1</text>}
							</>
						}
					/>
				</g>
			</svg>
			<Sfx src="pop" em={tCmd + 10} vol={0.45} />
			<Sfx src="whoosh" em={tCop - 6} vol={0.3} />
			<Sfx src="pop" em={tCopFala + 6} vol={0.45} />
		</>
	);
};

// 3 — comissária: "NÃO. Um de vocês vai de peixe."
const Cena3: React.FC<P> = ({dur, m, tx}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tNao = m('nao');
	const tPeixe = m('peixe') + 4;
	const entra = spring({frame: f, fps, config: {damping: 14}});
	const peixe = usePop(tPeixe, 10);
	const nao = f >= tNao && f < tPeixe;
	const naoPop = usePop(tNao, 8);
	return (
		<>
			<Camera de={[600, 1040, 1.12]} para={[640, 1040, 1.18]} dur={dur} soco={tNao} tremor={nao ? 4 : 0}>
				<PilotosNoCockpit
					cmd={{expressao: nao ? 'assustado' : 'neutro', olhar: 1}}
					cop={{expressao: f >= tPeixe ? 'confuso' : nao ? 'assustado' : 'neutro', olhar: 1}}
					extraFrente={
						<>
							<g transform={`translate(${interpolate(entra, [0, 1], [1400, 860])}, 0)`}>
								<Personagem
									x={0}
									y={1990}
									escala={1.3}
									roupa="comissaria"
									cabelo="#6b3a1f"
									espelhar
									olhar={1}
									expressao={nao ? 'bravo' : 'serio'}
									falando={f >= 4 && f < dur - 6}
									bracoD={nao ? 150 : f >= tPeixe ? 75 : 15}
									cotoveloD={nao ? 0 : f >= tPeixe ? -10 : 10}
									itemD={nao ? <g transform="scale(1.3)"><rect x={-26} y={-60} width={52} height={70} rx={20} fill="#fff" stroke="#241820" strokeWidth={7} /></g> : undefined}
								/>
							</g>
							{peixe > 0 && (
								<g transform={`translate(620, 1240) scale(${peixe})`}>
									<Bandeja comida="peixe" s={1.1} />
								</g>
							)}
							{nao && (
								<g transform={`translate(330, 620) rotate(-10) scale(${naoPop})`}>
									<rect x={-210} y={-100} width={420} height={180} rx={30} fill="#e8262f" stroke="#000" strokeWidth={12} />
									<text x={0} y={45} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={130} fill="#fff">{tx.nao}</text>
								</g>
							)}
						</>
					}
				/>
			</Camera>
			<Sfx src="ding" em={0} vol={0.35} />
			<Sfx src="buzz" em={tNao} vol={0.4} />
			<Sfx src="pop" em={tPeixe} vol={0.45} />
		</>
	);
};

// 4 — "Parece frescura... até você entender o motivo."
const Cena4: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMotivo = m('motivo');
	const depois = f >= tMotivo;
	return (
		<>
			<Camera de={[790, 1080, 2.0]} para={[790, 1060, depois ? 2.6 : 2.2]} dur={dur} soco={tMotivo}>
				<PilotosNoCockpit
					cop={{expressao: depois ? 'serio' : 'confuso', olhar: depois ? 0 : -1, bracoD: depois ? 15 : 150, cotoveloD: depois ? 10 : 120}}
				/>
				{!depois && <Interrogacao x={950} y={760} inicio={4} s={0.8} />}
			</Camera>
			{depois && (
				<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute'}}>
					<LinhasImpacto op={0.35} />
				</svg>
			)}
			<Sfx src="pop" em={4} vol={0.4} />
			<Sfx src="whoosh" em={tMotivo - 3} vol={0.5} />
		</>
	);
};

// 5 — frango estragado → os dois passam mal
const Cena5: React.FC<P> = ({dur, m, tx}) => {
	const f = useCurrentFrame();
	const corte = m('corte5') - 2;
	if (f < corte) {
		const podre = interpolate(f, [s2f(0.5), s2f(1.4)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		return (
			<>
				<Camera de={[540, 960, 1.0]} para={[540, 960, 1.25]} dur={corte}>
					<rect width={W} height={H} fill="#2b3a1f" />
					<circle cx={540} cy={960} r={720} fill="#4d6b2c" opacity={0.6 + 0.2 * Math.sin(f / 4)} />
					<g transform={`translate(540, 1000) rotate(${Math.sin(f / 3) * podre * 4})`}>
						<Bandeja comida="frango" s={2.4} podre={podre} />
					</g>
					{podre > 0.6 && (
						<text x={540} y={560} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={120} fill="#b6ff6b" stroke="#000" strokeWidth={16} paintOrder="stroke" transform={`rotate(-6 540 560)`}>
							{tx.eca}
						</text>
					)}
				</Camera>
				<Sfx src="uhoh" em={s2f(0.5)} vol={0.5} />
			</>
		);
	}
	const enjoo = interpolate(f - corte, [0, 10], [0.3, 1], {extrapolateRight: 'clamp'});
	return (
		<Sequence from={corte} layout="none">
			<Camera de={[540, 1080, 1.35]} para={[540, 1060, 1.15]} dur={dur - corte} tremor={6}>
				<PilotosNoCockpit
					cmd={{expressao: 'enjoado', enjoo, bracoD: 28, cotoveloD: -100, bracoE: 28, cotoveloE: -100, inclinar: Math.sin(f / 5) * 4}}
					cop={{expressao: 'enjoado', enjoo, bracoD: 28, cotoveloD: -100, bracoE: 28, cotoveloE: -100, inclinar: Math.sin(f / 5 + 2) * 4}}
				/>
			</Camera>
			<Sfx src="barriga" em={0} vol={0.8} />
		</Sequence>
	);
};

// 6 — "E aí... quem pilota o avião?"
const Cena6: React.FC<P> = ({dur}) => {
	const f = useCurrentFrame();
	return (
		<>
			<Camera de={[540, 960, 1.2]} para={[540, 960, 1.4]} dur={dur} tremor={5}>
				<CeuNoturno aviaoX={540} aviaoY={980} aviaoS={1.15} balanco={Math.sin(f / 4) * 14} alarme />
				<Interrogacao x={540} y={500} inicio={s2f(0.9)} s={1.4} cor="#ff5a5a" />
				{f % 16 < 8 && <rect width={W} height={H} fill="rgba(255,0,0,0.13)" />}
			</Camera>
			<Sfx src="alarme" em={0} vol={0.3} />
			<Sfx src="alarme" em={s2f(1.5)} vol={0.3} />
		</>
	);
};

// 7 — refeições diferentes, cozinhas diferentes, horários diferentes
const Cena7: React.FC<P> = ({dur, m, tx}) => {
	const tA = m('refeicoes'), tB = tA + 16;
	const tC1 = m('cozinhas') + 3, tC2 = tC1 + 15;
	const tH1 = m('horarios') + 3, tH2 = tH1 + 16;
	const a = usePop(tA), b = usePop(tB), c1 = usePop(tC1), c2 = usePop(tC2), h1 = usePop(tH1), h2 = usePop(tH2);
	const Placa: React.FC<{k: number; x: number; txt: string; cor: string}> = ({k, x, txt, cor}) =>
		k > 0 ? (
			<g transform={`translate(${x}, 560) scale(${k})`}>
				<rect x={-200} y={-70} width={400} height={120} rx={24} fill={cor} stroke="#000" strokeWidth={10} />
				<path d="M-150 -70 C-170 -150 -90 -160 -80 -120 C-70 -175 30 -175 30 -120 C40 -160 120 -150 110 -70Z" fill="#fff" stroke="#000" strokeWidth={8} transform="translate(-60, 0) scale(0.55)" />
				<text x={30} y={12} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={58} fill="#fff">{txt}</text>
			</g>
		) : null;
	return (
		<>
			<Camera de={[540, 1000, 1.2]} para={[540, 960, 1.0]} dur={dur}>
				<Cozinha />
				<Personagem x={540} y={1060} escala={0.85} roupa="comissaria" cabelo="#6b3a1f" expressao="feliz" bracoD={95} cotoveloD={-20} bracoE={95} cotoveloE={-20} />
				<Placa k={c1} x={290} txt={tx.cozinha1} cor="#2f5bd3" />
				<Placa k={c2} x={790} txt={tx.cozinha2} cor="#e8833a" />
				{a > 0 && <g transform={`translate(${interpolate(a, [0, 1], [-200, 290])}, 1000)`}><Bandeja comida="frango" s={1.25} rotulo="A" /></g>}
				{b > 0 && <g transform={`translate(${interpolate(b, [0, 1], [1280, 790])}, 1000)`}><Bandeja comida="peixe" s={1.25} rotulo="B" /></g>}
				{h1 > 0 && <g transform={`translate(290, 1480) scale(${h1})`}><Relogio hora={1} s={1.5} /></g>}
				{h2 > 0 && <g transform={`translate(790, 1480) scale(${h2})`}><Relogio hora={3} s={1.5} /></g>}
				{h1 > 0 && <text x={290} y={1680} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">01:00</text>}
				{h2 > 0 && <text x={790} y={1680} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#fff" stroke="#000" strokeWidth={12} paintOrder="stroke">03:00</text>}
			</Camera>
			{[tA, tB, tC1, tC2, tH1, tH2].map((t, i) => <Sfx key={i} src={i < 2 ? 'whoosh' : 'pop'} em={t} vol={0.4} />)}
		</>
	);
};

// 8 — comandante não divide nem o amendoim
const Cena8: React.FC<P> = ({dur, m, tx}) => {
	const f = useCurrentFrame();
	const tNega = m('nega');
	const nega = f > tNega;
	return (
		<>
			<Camera de={[540, 1080, 1.3]} para={[480, 1060, 1.45]} dur={dur} soco={tNega}>
				<PilotosNoCockpit
					cmd={{expressao: nega ? 'bravo' : 'serio', olhar: 1, inclinar: nega ? Math.sin(f / 2.2) * 6 : 0, bracoD: 40, cotoveloD: 110, bracoE: 40, cotoveloE: 110}}
					cop={{expressao: 'pidao', olhar: -1, bracoE: 85, cotoveloE: -5, inclinar: -6}}
					extraFrente={<g transform={`translate(300, 1270) rotate(${nega ? Math.sin(f / 2.2) * 6 : 0})`}><Amendoim s={1.1} /></g>}
				/>
				{nega && (
					<text x={170} y={700} fontFamily="Nunito" fontWeight={900} fontSize={110} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke" transform="rotate(-8 170 700)">
						{tx.meu}
					</text>
				)}
			</Camera>
			<Sfx src="pop" em={tNega} vol={0.5} />
		</>
	);
};

// 9 — "…não é só uma dor de barriga. É um problema de trezentas pessoas."
const Cena9: React.FC<P> = ({dur, m}) => {
	const f = useCurrentFrame();
	const c1 = m('barriga') - 2;
	const c2 = m('problema') - 2;
	const placar = usePop(c2, 9);
	if (f < c1)
		return (
			<Camera de={[540, 960, 1.0]} para={[540, 900, 1.15]} dur={c1}>
				<CeuNoturno aviaoX={540} aviaoY={980} aviaoS={0.9} balanco={-2} />
			</Camera>
		);
	if (f < c2)
		return (
			<Sequence from={c1} layout="none">
				<Camera de={[790, 1060, 1.9]} para={[790, 1060, 2.2]} dur={c2 - c1} tremor={3}>
					<PilotosNoCockpit cop={{expressao: 'enjoado', enjoo: 1, bracoD: 28, cotoveloD: -100, bracoE: 28, cotoveloE: -100}} cmd={{expressao: 'enjoado', enjoo: 1}} />
				</Camera>
				<Sfx src="barriga" em={6} vol={0.7} />
				<Sfx src="whoosh" em={0} vol={0.3} />
			</Sequence>
		);
	const n = Math.round(interpolate(f - c2, [0, 30], [0, 300], {extrapolateRight: 'clamp'}));
	const cores = ['#5a8f6a', '#b8577a', '#d9a03a', '#4f7cc9', '#8a63c2', '#c9603a', '#3a9c9c'];
	const cabelos = ['#4a3326', '#e0b04a', '#1d1d1d', '#8a4b2a', '#c9c9c9'];
	return (
		<Sequence from={c2} layout="none">
			<Camera de={[540, 1100, 1.5]} para={[540, 960, 1.0]} dur={dur - c2}>
				<CabinePassageiros>
					{Array.from({length: 7}).map((_, fila) =>
						Array.from({length: 7}).map((__, col) => {
							const s = 0.16 + fila * 0.035;
							const y = 760 + fila * (110 + fila * 14);
							const x = 540 + (col - 3) * (130 + fila * 18);
							const k = fila * 7 + col;
							return <Personagem key={k} x={x} y={y + 200 * s} escala={s * 1.2} roupa="passageiro" semPernas expressao={k % 3 ? 'assustado' : 'enjoado'} enjoo={k % 3 ? 0 : 0.7} cor={cores[k % cores.length]} cabelo={cabelos[k % cabelos.length]} fase={k} />;
						}),
					)}
					<g transform={`translate(540, 470) scale(${placar})`}>
						<rect x={-300} y={-120} width={600} height={210} rx={40} fill="#e8262f" stroke="#000" strokeWidth={12} />
						<text x={0} y={45} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={150} fill="#fff">{n}</text>
					</g>
				</CabinePassageiros>
			</Camera>
			<Sfx src="boom" em={0} vol={0.7} />
		</Sequence>
	);
};

const CENA_COMP: React.FC<P>[] = [Cena0, Cena1, Cena2, Cena3, Cena4, Cena5, Cena6, Cena7, Cena8, Cena9];

export const Pilotos: React.FC<{lingua: Lingua}> = ({lingua}) => {
	const lista = cenas(lingua);
	const mk = (palavras: Palavra[]) => (k: Marca) => {
		const [w, n] = MARCAS[lingua][k]!;
		return marcaEm(palavras, w, n ?? 1);
	};
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{lista.map((c) => {
				const C = CENA_COMP[c.indice];
				const ultima = c.indice === lista.length - 1;
				return (
					<Sequence key={c.indice} from={c.inicio} durationInFrames={c.duracao + (ultima ? 18 : 0)}>
						<C dur={c.duracao} m={mk(c.palavras)} tx={TEXTOS[lingua]} />
						<Vinheta />
						<Legenda palavras={c.palavras} lingua={lingua} />
						<Audio src={staticFile(`${pastaVoz(lingua)}/${String(c.indice).padStart(2, '0')}.mp3`)} volume={1} />
					</Sequence>
				);
			})}
			<Audio src={staticFile('audio/trilha.wav')} volume={(fr) => interpolate(fr, [0, 10], [0, 0.13], {extrapolateRight: 'clamp'})} />
		</AbsoluteFill>
	);
};
