import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Balao, Check, Circulo, Coracao, Escrito, GatoLado, Passaro, Pessoa, PostIt, Rato, Seta, Som, Traco, Xis} from './componentes';
import {AltoFalante, Capelo, Cerebro, Chaves, Clicker, Lampada, PortaMacaneta, Pote, Pontos, Prova, Sino, Tela, Transportadora, Travesseiro} from './desenhos';
import {Arranhador, Balanca, Banheira, CaixaAreia, Carimbo, Leite, Lata, Lirio, Torneira, Varinha, Verdade} from './desenhos';
import {Bastet, Barco, ChapeuBruxa, Foguete, Ilha, LinhaTempo, Maneki, Mapa, Mumia, Pergaminho, Piramide, Porta10, Roseta, Trigo, Tumulo} from './desenhos';
import {Aspirador, Barras, Campo, Cerca, Cores, Folhas, Fonte, Fresta, Jornal, Laranja, Nariz, Nitidez, Olho, Onda, Pata, Sofa, Tigela} from './desenhos';
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
		case 'correndo':
			return <GatoLado x={x} y={y} escala={esc * 0.9} t={t} virado={spec.virado} correndo />;
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
		case 'geladeira':
			return (
				<g>
					<rect x={e.x - 150} y={e.topo} width={300} height={BASE - e.topo} rx={14} fill="#fffdf6" stroke={COR.tinta} strokeWidth={7} />
					<line x1={e.x - 150} y1={e.topo + 140} x2={e.x + 150} y2={e.topo + 140} stroke={COR.tinta} strokeWidth={7} />
					<line x1={e.x + 110} y1={e.topo + 40} x2={e.x + 110} y2={e.topo + 100} stroke={COR.tinta} strokeWidth={9} strokeLinecap="round" />
					<line x1={e.x + 110} y1={e.topo + 180} x2={e.x + 110} y2={e.topo + 260} stroke={COR.tinta} strokeWidth={9} strokeLinecap="round" />
				</g>
			);
		case 'texto':
			return <Escrito x={e.x} y={e.y} t={t} texto={e.txt} tam={e.tam ?? 60} cor={corDe(e.cor)} marca={e.marca ? COR.marca : undefined} vel={1.6} />;
		case 'olho':
			return <Olho x={e.x} y={e.y} t={t} s={e.s} brilho={e.brilho ? em(b, e.brilho) : undefined} dilata={e.dilata} />;
		case 'cores':
			return <Cores x={e.x} y={e.y} t={t} />;
		case 'nitidez':
			return <Nitidez x={e.x} y={e.y} t={t} />;
		case 'campo':
			return <Campo x={e.x} y={e.y} t={t} />;
		case 'barras':
			return <Barras x={e.x} y={e.y} t={t} w={e.largura} itens={e.itens} />;
		case 'onda':
			return <Onda x={e.x} y={e.y} t={t} w={e.largura} alta={e.alta} cor={e.cor ? COR[e.cor] : COR.tinta} />;
		case 'nariz':
			return <Nariz x={e.x} y={e.y} t={t} s={e.s} />;
		case 'fonte':
			return <Fonte x={e.x} y={e.y} t={t} s={e.s} />;
		case 'aspirador':
			return <Aspirador x={e.x} y={e.y} t={t} s={e.s} />;
		case 'laranja':
			return <Laranja x={e.x} y={e.y} t={t} s={e.s} />;
		case 'jornal':
			return <Jornal x={e.x} y={e.y} t={t} s={e.s} />;
		case 'folhas':
			return <Folhas x={e.x} y={e.y} t={t} s={e.s} />;
		case 'lua':
			return <path transform={`translate(${e.x} ${e.y}) scale(${e.s ?? 1})`} d="M 0 -60 a 60 60 0 1 0 44 104 a 46 46 0 1 1 -44 -104 Z" stroke={COR.tinta} strokeWidth={7} fill={COR.marca} />;
		case 'pata':
			return <Pata x={e.x} y={e.y} t={t} s={e.s} suor={e.suor ? f >= em(b, e.suor) : false} />;
		case 'cerca':
			return <Cerca x={e.x} y={e.y} w={e.largura} />;
		case 'tigela':
			return <Tigela x={e.x} y={e.y} t={t} s={e.s} tipo={e.funda ? 'funda' : 'rasa'} />;
		case 'fresta':
			return <Fresta x={e.x} y={e.y} t={t} />;
		case 'sofa':
			return <Sofa x={e.x} y={e.y} t={t} s={e.s} arranhado={e.arranha ? em(b, e.arranha) : undefined} />;
		case 'relogio':
			return (
				<g transform={`translate(${e.x} ${e.y})`}>
					<circle r={90} stroke={COR.tinta} strokeWidth={7} fill="#fffdf6" />
					<circle cx={-66} cy={-72} r={24} stroke={COR.tinta} strokeWidth={7} fill={COR.azulClaro} />
					<circle cx={66} cy={-72} r={24} stroke={COR.tinta} strokeWidth={7} fill={COR.azulClaro} />
					<text y={22} textAnchor="middle" fontFamily={'"Caveat", cursive'} fontWeight={700} fontSize={64} fill={COR.vermelho}>
						{e.txt}
					</text>
				</g>
			);
		case 'linhaTempo':
			return <LinhaTempo x={e.x} y={e.y} w={e.largura} t={t} marcas={e.marcas} destaque={e.destaque} />;
		case 'mapa':
			return <Mapa x={e.x} y={e.y} t={t} lugares={e.lugares} rota={e.rota ? em(b, e.rota) : undefined} />;
		case 'piramide':
			return <Piramide x={e.x} y={e.y} t={t} s={e.s} />;
		case 'mumia':
			return <Mumia x={e.x} y={e.y} t={t} s={e.s} />;
		case 'bastet':
			return <Bastet x={e.x} y={e.y} t={t} s={e.s} />;
		case 'trigo':
			return <Trigo x={e.x} y={e.y} t={t} s={e.s} />;
		case 'maneki':
			return <Maneki x={e.x} y={e.y} t={t} s={e.s} />;
		case 'ilha':
			return <Ilha x={e.x} y={e.y} t={t} s={e.s} />;
		case 'foguete':
			return <Foguete x={e.x} y={e.y} t={t} s={e.s} />;
		case 'porta10':
			return <Porta10 x={e.x} y={e.y} t={t} s={e.s} />;
		case 'chapeu':
			return <ChapeuBruxa x={e.x} y={e.y} t={t} s={e.s} />;
		case 'tumulo':
			return <Tumulo x={e.x} y={e.y} t={t} s={e.s} />;
		case 'barco':
			return <Barco x={e.x} y={e.y} t={t} s={e.s} viking={e.viking} />;
		case 'roseta':
			return <Roseta x={e.x} y={e.y} t={t} s={e.s} txt={e.txt ?? ''} />;
		case 'pergaminho':
			return <Pergaminho x={e.x} y={e.y} t={t} s={e.s} txt={e.txt} />;
		case 'carimbo':
			return <Carimbo x={e.x} y={e.y} t={t} s={e.s} txt={e.txt} />;
		case 'verdade':
			return <Verdade x={e.x} y={e.y} t={t} s={e.s} />;
		case 'leite':
			return <Leite x={e.x} y={e.y} t={t} s={e.s} />;
		case 'lata':
			return <Lata x={e.x} y={e.y} t={t} s={e.s} />;
		case 'banheira':
			return <Banheira x={e.x} y={e.y} t={t} s={e.s} />;
		case 'torneira':
			return <Torneira x={e.x} y={e.y} t={t} s={e.s} />;
		case 'varinha':
			return <Varinha x={e.x} y={e.y} t={t} s={e.s} />;
		case 'arranhador':
			return <Arranhador x={e.x} y={e.y} t={t} s={e.s} />;
		case 'lirio':
			return <Lirio x={e.x} y={e.y} t={t} s={e.s} />;
		case 'balanca':
			return <Balanca x={e.x} y={e.y} t={t} s={e.s} peso={e.peso} />;
		case 'caixaAreia':
			return <CaixaAreia x={e.x} y={e.y} t={t} s={e.s} luvas={e.luvas} />;
		case 'cerebro':
			return <Cerebro x={e.x} y={e.y} t={t} s={e.s} brilha={e.brilha} />;
		case 'lampada':
			return <Lampada x={e.x} y={e.y} t={t} s={e.s} />;
		case 'capelo':
			return <Capelo x={e.x} y={e.y} t={t} s={e.s} />;
		case 'chaves':
			return <Chaves x={e.x} y={e.y} t={t} s={e.s} />;
		case 'transportadora':
			return <Transportadora x={e.x} y={e.y} t={t} s={e.s} />;
		case 'portaMacaneta':
			return <PortaMacaneta x={e.x} y={e.y} t={t} s={e.s} />;
		case 'sino':
			return <Sino x={e.x} y={e.y} t={t} s={e.s} />;
		case 'clicker':
			return <Clicker x={e.x} y={e.y} t={t} s={e.s} />;
		case 'travesseiro':
			return <Travesseiro x={e.x} y={e.y} t={t} s={e.s} revela={e.revela ? em(b, e.revela) : undefined} />;
		case 'pote':
			return <Pote x={e.x} y={e.y} t={t} s={e.s} vira={e.vira ? em(b, e.vira) : undefined} />;
		case 'pontos':
			return <Pontos x={e.x} y={e.y} t={t} s={e.s} n={e.n} grande={e.grande} />;
		case 'tela':
			return <Tela x={e.x} y={e.y} t={t} s={e.s} preto={e.preto} />;
		case 'altoFalante':
			return <AltoFalante x={e.x} y={e.y} t={t} s={e.s} fala={e.fala ? f >= em(b, e.fala) : false} />;
		case 'prova':
			return <Prova x={e.x} y={e.y} t={t} s={e.s} nota={e.nota} />;
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
			{(v.extras ?? []).filter((e) => ['pessoa', 'geladeira', 'cerca', 'sofa', 'fresta', 'piramide', 'ilha', 'barco', 'mapa', 'porta10', 'banheira', 'arranhador', 'portaMacaneta'].includes(e.tipo)).map((e, i) => <ExtraEl key={`p${i}`} b={b} e={e} />)}
			{gatos.map((g, i) => (
				<Gato key={i} b={b} g={g} />
			))}
			{v.textos && <Textos b={b} itens={v.textos} colX={v.colX ?? (temGato ? 1000 : 300)} />}
			{v.postit && <PostIt x={v.postit.x ?? 1450} y={v.postit.y ?? 700} t={quando(b, v.postit.w)} linhas={v.postit.linhas} rot={v.postit.rot ?? -4} w={380} />}
			{(v.extras ?? []).filter((e) => !['pessoa', 'geladeira', 'cerca', 'sofa', 'fresta', 'piramide', 'ilha', 'barco', 'mapa', 'porta10', 'banheira', 'arranhador', 'portaMacaneta'].includes(e.tipo)).map((e, i) => <ExtraEl key={i} b={b} e={e} />)}
		</g>
	);
};

export const CENAS: Record<string, Cena> = Object.fromEntries(ROTEIRO.map((r) => [r.cena, Generica]));
