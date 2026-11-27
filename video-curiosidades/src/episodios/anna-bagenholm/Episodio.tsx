// Episódio (EN): Anna Bågenholm sobreviveu com temperatura corporal de 13,7 °C (Noruega, 1999).
// Fontes: The Lancet (Gilbert et al., 2000), BBC, CNN, Hospital Universitário do Norte da Noruega (Tromsø).
// Caiu de cabeça num riacho congelado esquiando; amigos seguraram os esquis; bolsão de ar ~40 min; parada cardíaca;
// ~80 min presa; 13,7 °C ao ser resgatada; circulação extracorpórea reaqueceu o sangue por horas; acordou dias depois;
// depois trabalhou como médica (radiologista) no mesmo hospital.
// Dicas aplicadas: estilo próprio (termômetro + cronômetro); 1º quadro = capa; CTA de 1 palavra no fim.
import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {Personagem, CONTORNO} from '../../Personagem';
import {H, W} from '../../Cenarios';
import {Camera, Sfx, usePop} from '../../Video';
import {DefEpisodio, PropsCena} from '../../Episodio';
import {VozJson, montarCenas} from '../../roteiro';
import {Placa} from '../../Placa';
import {Fundo, clamp} from '../comum';
import voz from './voz.json';

export const FALAS = [
	'Her body temperature dropped to 13.7 degrees Celsius. And she survived.',
	'In 1999, Anna Bågenholm was skiing in Norway when she fell headfirst through the ice of a frozen stream.',
	'Her friends grabbed her skis, but the current was too strong to pull her out.',
	'She found an air pocket under the ice, and kept breathing for forty minutes.',
	'Then her heart stopped. She stayed trapped in the freezing water for eighty minutes.',
	'When rescuers got her out, her body temperature was just 13.7 degrees. Normal is 37.',
	'Doctors hooked her up to a machine that slowly warmed her blood, for hours. And her heart started beating again.',
	'She woke up days later. And she later worked as a doctor, at the same hospital that saved her.',
	'If this gave you goosebumps, comment one word: COLD.',
];

const ANNA = {roupa: 'passageiro' as const, cor: '#e8392f', cabelo: '#e8c45a'};

// termômetro grande: t em °C (0..40)
const Termometro: React.FC<{t: number; s?: number}> = ({t, s = 1}) => {
	const n = Math.max(0, Math.min(1, t / 40));
	const cor = t < 20 ? '#3f8fdc' : t < 33 ? '#e8a23a' : '#e8262f';
	return (
		<g transform={`scale(${s})`}>
			<rect x={-55} y={-520} width={110} height={560} rx={55} fill="#fff" stroke={CONTORNO} strokeWidth={10} />
			<circle cy={70} r={95} fill={cor} stroke={CONTORNO} strokeWidth={10} />
			<rect x={-28} y={40 - 520 * n} width={56} height={520 * n} fill={cor} />
			<line x1={55} y1={40 - 520 * (37 / 40)} x2={110} y2={40 - 520 * (37 / 40)} stroke="#e8262f" strokeWidth={8} />
			<text x={0} y={-570} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={84} fill="#fff" stroke={CONTORNO} strokeWidth={12} paintOrder="stroke">{t.toFixed(1)}°</text>
		</g>
	);
};

const Gelo: React.FC<{children?: React.ReactNode; buraco?: boolean}> = ({children, buraco}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#cfe9f7" />
			<path d="M0 900 L220 640 L420 860 L640 600 L860 820 L1080 680 V1300 H0Z" fill="#f2f8fc" stroke="#9fc3dc" strokeWidth={6} />
			{[120, 900].map((x) => <g key={x} transform={`translate(${x}, 1180)`}><path d="M-80 0 L0 -260 L80 0Z" fill="#2f5a4a" /><path d="M-60 -120 L0 -300 L60 -120Z" fill="#f2f8fc" /></g>)}
			<rect y={1300} width={W} height={620} fill="#e6f3fb" />
			{buraco && <ellipse cx={540} cy={1560} rx={260} ry={70} fill="#1f4a6a" stroke="#9fc3dc" strokeWidth={10} />}
			{buraco && <path d={`M300 1560 q 60 ${-10 + Math.sin(f / 5) * 6} 120 0 t 120 0 t 120 0 t 120 0`} stroke="#5ab8e8" strokeWidth={6} fill="none" />}
			{Array.from({length: 20}).map((_, i) => <circle key={i} cx={(i * 113 + Math.sin(f / 10 + i) * 20) % 1080} cy={((i * 197) + f * 3) % 1300} r={6 + (i % 3) * 3} fill="#fff" opacity={0.9} />)}
			{children}
		</g>
	);
};

const Esquis: React.FC<{s?: number}> = ({s = 1}) => (
	<g transform={`scale(${s})`}>
		{[-30, 30].map((x) => <rect key={x} x={x - 14} y={-320} width={28} height={340} rx={14} fill="#e8392f" stroke={CONTORNO} strokeWidth={6} />)}
	</g>
);

const ECG: React.FC<{plano: boolean; cor?: string}> = ({plano, cor = '#5aff7a'}) => {
	const f = useCurrentFrame();
	const pts = Array.from({length: 40}).map((_, i) => {
		const x = i * 22;
		const fase = (i + Math.floor(f / 2)) % 14;
		const y = plano ? 0 : fase === 6 ? -110 : fase === 7 ? 80 : fase === 8 ? -30 : 0;
		return `${x} ${y}`;
	}).join(' L');
	return (
		<g>
			<rect x={-40} y={-180} width={940} height={340} rx={30} fill="#0d1a14" stroke={CONTORNO} strokeWidth={10} />
			<path d={`M0 0 L${pts}`} stroke={plano ? '#e8262f' : cor} strokeWidth={10} fill="none" strokeLinejoin="round" />
		</g>
	);
};

const Relogio: React.FC<{min: number}> = ({min}) => (
	<g transform="translate(780, 640)">
		<rect x={-180} y={-66} width={360} height={132} rx={30} fill="#000" stroke="#5ab8e8" strokeWidth={8} />
		<text x={0} y={26} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={76} fill="#fff">{Math.round(min)} MIN</text>
	</g>
);

// 0 — CAPA no frame 0 + gancho
const C0: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tSob = m('survived');
	return (
		<>
			<Camera de={[540, 960, 1.0]} para={[540, 1050, 1.08]} dur={dur} soco={tSob}>
				<Gelo buraco>
					<Personagem x={400} y={2290} escala={1.25} {...ANNA} expressao="assustado" enjoo={0.5} bracoD={30} bracoE={150} cotoveloE={-20} fase={1} />
					<g transform="translate(860, 1500)"><Termometro t={13.7} s={1.1} /></g>
				</Gelo>
				<Placa x={540} y={270} k={1} txt="BODY TEMPERATURE" tam={84} rot={-4} />
				<g transform="translate(540, 480) rotate(4)">
					<rect x={-330} y={-105} width={660} height={200} rx={30} fill="#3f8fdc" stroke="#000" strokeWidth={12} />
					<text x={0} y={55} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={165} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke">13.7°C</text>
				</g>
				<Placa x={540} y={1180} k={usePop(tSob, 9)} txt="...AND SHE SURVIVED!" tam={90} cor="#5aff7a" />
			</Camera>
			<Sfx src="boom" em={0} vol={0.45} />
			<Sfx src="ding" em={tSob} vol={0.45} />
		</>
	);
};

// 1 — 1999, Noruega: esquiando, caiu de cabeça no gelo
const C1: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAno = m('1999'), tNorue = m('norway'), tGelo = m('ice');
	const caiu = f >= tGelo;
	const x = interpolate(f, [0, tGelo], [100, 540], clamp);
	return (
		<>
			<Camera de={[540, 1150, 1.1]} para={[540, 1200, 1.05]} dur={dur} soco={tGelo} tremor={caiu && f < tGelo + 10 ? 8 : 0}>
				<Gelo buraco={caiu}>
					{!caiu ? <Personagem x={x} y={2080} escala={1.0} {...ANNA} expressao="feliz" inclinar={10} bracoD={60} bracoE={60} fase={2} /> : <g transform="translate(540, 1560)"><Esquis s={1.1} /></g>}
					{caiu && f < tGelo + 16 && Array.from({length: 10}).map((_, i) => { const t = (f - tGelo) / 16; const a = (i / 10) * Math.PI; return <circle key={i} cx={540 + Math.cos(a) * 300 * t} cy={1560 - Math.sin(a) * 300 * t} r={18} fill="#9fd8f5" opacity={1 - t} />; })}
				</Gelo>
				<Placa x={540} y={260} k={usePop(tAno, 10)} txt="1999 · NORWAY" tam={100} />
				<Placa x={540} y={450} k={usePop(tNorue + 6, 10)} txt="ANNA BÅGENHOLM" tam={80} cor="#fff" rot={4} />
				<Placa x={540} y={1180} k={usePop(tGelo, 9)} txt="THROUGH THE ICE!" tam={82} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tAno} vol={0.4} />
			<Sfx src="boom" em={tGelo} vol={0.55} />
		</>
	);
};

// 2 — amigos seguraram os esquis, mas a correnteza era forte demais
const C2: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAmigos = m('friends'), tForte = m('strong');
	const puxa = Math.sin(f / 3) * 10;
	return (
		<>
			<Camera de={[540, 1250, 1.1]} para={[540, 1250, 1.05]} dur={dur} soco={tForte}>
				<Gelo buraco>
					<g transform={`translate(540, ${1560 - puxa})`}><Esquis s={1.1} /></g>
					{f >= tAmigos && [300, 780].map((x, i) => <Personagem key={x} x={x} y={2120} escala={0.95} roupa="passageiro" cor={i ? '#3c8a4a' : '#2b4a8a'} cabelo={i ? '#6b3a1f' : '#1d1d1d'} expressao="assustado" olhar={i ? -1 : 1} inclinar={i ? 14 : -14} bracoD={i ? 30 : 120} bracoE={i ? 120 : 30} cotoveloD={-10} cotoveloE={-10} fase={3 + i} />)}
					{f >= tForte && [0, 1, 2].map((i) => <path key={i} d={`M${200 + ((f * 8 + i * 120) % 600)} ${1560 + (i - 1) * 24} l60 0 m-20 -16 l20 16 l-20 16`} stroke="#fff" strokeWidth={8} fill="none" />)}
				</Gelo>
				<Placa x={540} y={280} k={usePop(tAmigos, 10)} txt="PULL!" tam={130} />
				<Placa x={540} y={1180} k={usePop(tForte, 9)} txt="TOO STRONG!" tam={96} cor="#e8262f" corTxt="#fff" />
			</Camera>
			<Sfx src="pop" em={tAmigos} vol={0.35} />
			<Sfx src="uhoh" em={tForte} vol={0.45} />
		</>
	);
};

// embaixo do gelo
const SobGelo: React.FC<{bolsao?: boolean; children?: React.ReactNode}> = ({bolsao, children}) => {
	const f = useCurrentFrame();
	return (
		<g>
			<rect width={W} height={H} fill="#1f4a6a" />
			<rect width={W} height={520} fill="#e6f3fb" />
			<path d="M0 520 Q270 560 540 520 T1080 530 V560 H0Z" fill="#b8dcf0" />
			{bolsao && <ellipse cx={540} cy={575} rx={220} ry={50} fill="#cfe9f7" stroke="#9fc3dc" strokeWidth={6} />}
			{Array.from({length: 12}).map((_, i) => <circle key={i} cx={(i * 97) % 1080} cy={1900 - ((f * 4 + i * 160) % 1300)} r={8 + (i % 3) * 5} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={3} />)}
			{children}
		</g>
	);
};

// 3 — bolsão de ar sob o gelo; respirou por 40 minutos
const C3: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tBols = m('pocket'), tMin = m('forty');
	const min = interpolate(f, [0, tMin + 6], [0, 40], clamp);
	return (
		<>
			<Camera de={[540, 900, 1.15]} para={[540, 950, 1.05]} dur={dur} soco={tMin}>
				<SobGelo bolsao={f >= tBols - 4}>
					<g transform={`translate(540, ${880 + Math.sin(f / 8) * 10}) rotate(180)`}><Personagem x={0} y={0} escala={1.0} {...ANNA} expressao="assustado" enjoo={0.3} bracoD={160} bracoE={160} fase={4} /></g>
				</SobGelo>
				<Placa x={540} y={260} k={usePop(tBols, 10)} txt="AN AIR POCKET" tam={100} />
				<Relogio min={min} />
			</Camera>
			<Sfx src="pop" em={tBols} vol={0.35} />
			<Sfx src="ding" em={tMin} vol={0.35} />
		</>
	);
};

// 4 — o coração parou; 80 minutos presa
const C4: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tParou = m('stopped'), tOit = m('eighty');
	const min = interpolate(f, [tParou, tOit + 6], [40, 80], clamp);
	const parou = f >= tParou;
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tParou}>
				<SobGelo>
					<g transform="translate(90, 1350)"><ECG plano={parou} /></g>
				</SobGelo>
				<Placa x={540} y={260} k={usePop(tParou, 8)} txt="HEART STOPPED" tam={100} cor="#e8262f" corTxt="#fff" />
				<Relogio min={parou ? min : 40} />
			</Camera>
			<Sfx src="uhoh" em={tParou} vol={0.5} />
			<Sfx src="ding" em={tOit} vol={0.3} />
		</>
	);
};

// 5 — resgatada com 13,7 °C (normal: 37)
const C5: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tResg = m('rescuers'), tTemp = m('137'), tNormal = m('normal');
	const t = interpolate(f, [tResg, tTemp + 10], [30, 13.7], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tTemp}>
				<Gelo>
					{f >= tResg && [260, 820].map((x, i) => <Personagem key={x} x={x} y={2120} escala={0.95} roupa="bombeiro" expressao="serio" olhar={i ? -1 : 1} fase={5 + i} />)}
					<g transform="translate(560, 1600)"><Termometro t={t} s={1.2} /></g>
				</Gelo>
				<Placa x={540} y={260} k={usePop(tTemp, 9)} txt="13.7°C" tam={150} cor="#bfe3ff" />
				<Placa x={540} y={460} k={usePop(tNormal, 10)} txt="NORMAL: 37°C" tam={84} cor="#fff" rot={4} />
			</Camera>
			<Sfx src="pop" em={tResg} vol={0.35} />
			<Sfx src="boom" em={tTemp} vol={0.5} />
			<Sfx src="ding" em={tNormal} vol={0.35} />
		</>
	);
};

// 6 — máquina reaqueceu o sangue por horas; o coração voltou a bater
const C6: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tMaq = m('machine'), tHoras = m('hours'), tBate = m('beating');
	const voltou = f >= tBate;
	const t = interpolate(f, [tMaq, tBate], [13.7, 30], clamp);
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1050, 1.0]} dur={dur} soco={tBate}>
				<Fundo cor="#e3eef6" />
				<rect x={120} y={1500} width={840} height={80} rx={20} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={8} />
				<g transform="translate(720, 1470) rotate(-90)"><Personagem x={0} y={0} escala={0.8} {...ANNA} expressao="dormindo" fase={6} /></g>
				{f >= tMaq - 4 && (
					<g transform="translate(860, 1080)">
						<rect x={-150} y={-260} width={300} height={360} rx={24} fill="#c9cfd8" stroke={CONTORNO} strokeWidth={9} />
						<circle cx={0} cy={-120} r={70} fill="#2a2e38" stroke={CONTORNO} strokeWidth={6} />
						<line x1={0} y1={-120} x2={0} y2={-180} stroke="#e8262f" strokeWidth={10} transform={`rotate(${f * 8} 0 -120)`} />
						<path d={`M-150 40 Q -350 ${120 + Math.sin(f / 4) * 10} -480 260`} stroke="#c8303a" strokeWidth={22} fill="none" strokeDasharray="30 20" strokeDashoffset={-f * 6} />
					</g>
				)}
				<g transform="translate(140, 640) scale(0.85)"><ECG plano={!voltou} /></g>
				<g transform="translate(920, 1900) scale(0.55)"><Termometro t={t} /></g>
				<Placa x={540} y={260} k={usePop(tHoras, 10)} txt="WARMING FOR HOURS" tam={84} />
				<Placa x={540} y={1180} k={usePop(tBate, 8)} txt="BEEP... BEEP!" tam={110} cor="#5aff7a" />
			</Camera>
			<Sfx src="pop" em={tMaq} vol={0.35} />
			<Sfx src="ding" em={tBate} vol={0.5} />
		</>
	);
};

// 7 — acordou dias depois; virou médica no mesmo hospital
const C7: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tAcorda = m('woke'), tMedica = m('doctor');
	const medica = f >= tMedica - 6;
	return (
		<>
			<Camera de={[540, 1100, 1.1]} para={[540, 1100, 1.0]} dur={dur} soco={tMedica}>
				<Fundo cor={medica ? '#d8f0d0' : '#e3eef6'} />
				{!medica ? (
					<g>
						<rect x={120} y={1500} width={840} height={80} rx={20} fill="#9aa1ad" stroke={CONTORNO} strokeWidth={8} />
						<g transform="translate(720, 1470) rotate(-90)"><Personagem x={0} y={0} escala={0.8} {...ANNA} expressao={f >= tAcorda ? 'feliz' : 'dormindo'} fase={7} /></g>
					</g>
				) : (
					<g>
						<rect x={140} y={700} width={800} height={260} rx={20} fill="#fff" stroke={CONTORNO} strokeWidth={8} />
						<text x={540} y={860} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={80} fill="#3f8fdc">HOSPITAL</text>
						<Personagem x={540} y={2150} escala={1.25} roupa="medico" cabelo={ANNA.cabelo} expressao="feliz" bracoD={150} cotoveloD={-20} fase={8} />
					</g>
				)}
				<Placa x={540} y={260} k={usePop(tAcorda, 10)} txt="SHE WOKE UP!" tam={110} cor="#5aff7a" />
				<Placa x={540} y={1180} k={usePop(tMedica, 9)} txt="DR. BÅGENHOLM" tam={100} />
			</Camera>
			<Sfx src="ding" em={tAcorda} vol={0.4} />
			<Sfx src="boom" em={tMedica} vol={0.45} />
		</>
	);
};

// 8 — CTA de uma palavra: comente COLD
const C8: React.FC<PropsCena> = ({dur, m}) => {
	const f = useCurrentFrame();
	const tCom = m('comment'), tFrio = m('cold');
	const kB = usePop(tCom - 4, 10), kZ = usePop(tFrio, 7);
	return (
		<>
			<Camera de={[540, 1000, 1.1]} para={[540, 1000, 1.0]} dur={dur} soco={tFrio}>
				<Gelo />
				<g transform={`translate(540, 850) scale(${kB * 0.88})`}>
					<path d="M-420 -220 H420 Q460 -220 460 -180 V160 Q460 200 420 200 H-160 L-260 300 L-240 200 H-420 Q-460 200 -460 160 V-180 Q-460 -220 -420 -220Z" fill="#fff" stroke={CONTORNO} strokeWidth={12} />
					<text x={0} y={-100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={70} fill="#5a6070">COMMENT</text>
					<g transform={`scale(${kZ * (1 + 0.06 * Math.sin(f / 4))})`}>
						<text x={0} y={100} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={210} fill="#5ab8e8" stroke={CONTORNO} strokeWidth={16} paintOrder="stroke">COLD</text>
					</g>
				</g>
				<Placa x={540} y={1550} k={usePop(tCom, 10)} txt="JUST ONE WORD" tam={90} cor="#fff" />
			</Camera>
			<Sfx src="pop" em={tCom - 4} vol={0.4} />
			<Sfx src="boom" em={tFrio} vol={0.5} />
		</>
	);
};

const ep: DefEpisodio = {
	id: 'AnnaBagenholm',
	pastaVoz: 'voz-anna-bagenholm',
	cenas: montarCenas(FALAS, voz as unknown as VozJson),
	componentes: [C0, C1, C2, C3, C4, C5, C6, C7, C8],
	destaques: new Set(['137', 'celsius', 'survived', '1999', 'anna', 'norway', 'ice', 'friends', 'strong', 'pocket', 'forty', 'stopped', 'eighty', 'rescuers', '37', 'machine', 'hours', 'beating', 'woke', 'doctor', 'comment', 'cold']),
};
export default ep;
