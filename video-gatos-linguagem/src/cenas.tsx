import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Balao, Check, Circulo, Coracao, Escrito, GatoLado, Passaro, Pessoa, PostIt, Rato, Seta, Som, Traco, Xis} from './componentes';
import {GatoAgachado, GatoArco, GatoBarriga, GatoDorme, GatoFrente, GatoPao, Mao} from './gato';
import {ROTEIRO, em, type Bloco} from './roteiro';
import {COR} from './tema';
import {CAPITULOS, VIS, type Extra, type GatoVis, type TextoVis} from './visuais';

type Cena = React.FC<{b: Bloco}>;
const BASE = 840;
const corDe = (c?: 'vermelho' | 'verde' | 'grafite') => (c ? COR[c] : COR.tinta);

/** Frame em que a palavra é dita (ou 0 se não houver palavra). */
const quando = (b: Bloco, w?: string) => (w ? em(b, w) : 0);

/** Cabeçalho do capítulo: "Chapter 3" + título com marca-texto. */
const Cabecalho: React.FC<{cap: number; novo: boolean}> = ({cap, novo}) => {
	if (!cap) return null;
	const t = novo ? 0 : -80;
	return (
		<g>
			<Escrito x={262} y={170} t={t} texto={`Chapter ${cap}`} tam={50} cor={COR.grafite} vel={3} />
			<Escrito x={260} y={250} t={t + 6} texto={CAPITULOS[cap]} tam={88} marca={COR.marca} vel={2} />
		</g>
	);
};

const Gato: React.FC<{b: Bloco; g: GatoVis}> = ({b, g}) => {
	const f = useCurrentFrame();
	const t = g.w ? em(b, g.w) : -60;
	let spec: GatoVis = {...g};
	for (const m of g.muda ?? []) if (f >= em(b, m.w)) spec = {...spec, ...m};
	const x = spec.x ?? 560;
	const y = spec.y ?? BASE;
	const esc = spec.escala ?? 1.05;
	switch (spec.pose) {
		case 'pao':
			return <GatoPao x={x} y={y} escala={esc} t={t} />;
		case 'barriga':
			return <GatoBarriga x={x} y={y} escala={esc} t={t} />;
		case 'arco':
			return <GatoArco x={x} y={y} escala={esc} t={t} />;
		case 'arcoAssustado':
			return <GatoArco x={x} y={y} escala={esc} t={t} assustado />;
		case 'agachado':
			return <GatoAgachado x={x} y={y} escala={esc} t={t} />;
		case 'rebola':
			return <GatoAgachado x={x} y={y} escala={esc} t={t} rebola />;
		case 'dorme':
			return <GatoDorme x={x} y={y} escala={esc} t={t} />;
		case 'lado':
			return <GatoLado x={x} y={y} escala={esc * 0.9} t={t} virado={spec.virado} />;
		default:
			return <GatoFrente {...spec} x={x} y={y} escala={esc} t={t} rot={spec.rot} />;
	}
};

const Textos: React.FC<{b: Bloco; itens: TextoVis[]; colX: number}> = ({b, itens, colX}) => (
	<g>
		{itens.map((it, i) => (
			<Escrito
				key={i}
				x={it.x ?? colX}
				y={it.y ?? 360 + i * 95}
				t={quando(b, it.w)}
				texto={it.txt}
				tam={it.tam ?? 64}
				cor={corDe(it.cor)}
				marca={it.marca ? COR.marca : undefined}
				vel={1.8}
			/>
		))}
	</g>
);

const Janela: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
	<g>
		<Traco d={`M ${x - 160} ${y - 130} L ${x + 160} ${y - 130} L ${x + 160} ${y + 130} L ${x - 160} ${y + 130} Z M ${x} ${y - 130} L ${x} ${y + 130} M ${x - 160} ${y} L ${x + 160} ${y}`} t={t} dur={14} />
		<Passaro x={x + 80} y={y - 60} t={t + 10} s={0.8} />
	</g>
);

const ExtraEl: React.FC<{b: Bloco; e: Extra}> = ({b, e}) => {
	const f = useCurrentFrame();
	const t = quando(b, e.w);
	if (f < t && e.w) return null;
	switch (e.tipo) {
		case 'pessoa':
			return <Pessoa x={e.x} y={BASE} escala={e.escala ?? 1} t={e.w ? t : -60} bracos={e.bracos} />;
		case 'coracao':
			return <Coracao x={e.x} y={e.y} t={t} s={e.s ?? 1} />;
		case 'balao':
			return <Balao x={e.x} y={e.y} t={t} texto={e.txt} w={e.largura ?? 260} h={110} cauda={e.cauda} />;
		case 'som':
			return <Som x={e.x} y={e.y} t={t} dir={e.dir} />;
		case 'passaro':
			return <Passaro x={e.x} y={e.y} t={t} />;
		case 'rato':
			return <Rato x={e.x} y={e.y} t={t} s={0.8} />;
		case 'mao':
			if (e.ate && f >= em(b, e.ate) + 6) return null;
			return <Mao x={e.x} y={e.y} t={e.w ? t : -60} rot={e.rot} acariciar={e.acariciar} />;
		case 'check':
			return <Check x={e.x} y={e.y} t={t} s={e.s ?? 1} />;
		case 'xis':
			return <Xis x={e.x} y={e.y} t={t} s={e.s ?? 1} />;
		case 'circulo':
			return <Circulo cx={e.x} cy={e.y} rx={e.rx} ry={e.ry} t={t} />;
		case 'seta':
			return <Seta de={e.de} para={e.para} t={t} curva={30} cor={e.cor ? COR[e.cor] : COR.tinta} />;
		case 'janela':
			return <Janela x={e.x} y={e.y} t={t} />;
		case 'texto':
			return <Escrito x={e.x} y={e.y} t={t} texto={e.txt} tam={e.tam ?? 60} cor={corDe(e.cor)} marca={e.marca ? COR.marca : undefined} vel={1.6} />;
		default:
			return null;
	}
};

/** Uma cena genérica, montada a partir de VIS[n]. */
const Generica: Cena = ({b}) => {
	const v = VIS[b.n] ?? {};
	const gatos = v.gatos ?? (v.gato ? [v.gato] : []);
	const temGato = gatos.length > 0;
	return (
		<g>
			<Cabecalho cap={b.cap} novo={!!v.abre} />
			{(v.extras ?? []).filter((e) => e.tipo === 'pessoa').map((e, i) => <ExtraEl key={`p${i}`} b={b} e={e} />)}
			{gatos.map((g, i) => (
				<Gato key={i} b={b} g={g} />
			))}
			{v.textos && <Textos b={b} itens={v.textos} colX={v.colX ?? (temGato ? 1000 : 300)} />}
			{v.postit && <PostIt x={v.postit.x ?? 1450} y={v.postit.y ?? 700} t={quando(b, v.postit.w)} linhas={v.postit.linhas} rot={v.postit.rot ?? -4} w={380} />}
			{(v.extras ?? []).filter((e) => e.tipo !== 'pessoa').map((e, i) => <ExtraEl key={i} b={b} e={e} />)}
		</g>
	);
};

export const CENAS: Record<string, Cena> = Object.fromEntries(ROTEIRO.map((r) => [r.cena, Generica]));
