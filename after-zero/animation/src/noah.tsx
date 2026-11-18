// Noah — single vector design reused in every pose so he stays identical.
// Indoors (morning) he wears the grey t-shirt; the dark-green jacket and grey
// backpack hang on the bedroom chair (continuity with later scenes).
import React from 'react';
import {C} from './lib';

export const N = {
  skin: '#c88d69',
  skinShade: '#8f5b44',
  hair: '#2a1b13',
  hairHi: '#4a3122',
  shirt: '#62676b',
  shirtShade: '#43484c',
  pants: '#24272c',
  sock: '#1b1d21',
  jacket: C.forest,
  pack: '#5d6165',
  eye: '#3a2618',
};

const limb = (x1: number, y1: number, x2: number, y2: number, w: number, color: string, key?: string) => (
  <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
);

const pol = (x: number, y: number, len: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [x + Math.sin(a) * len, y + Math.cos(a) * len] as const;
};

/* ---------------------------------------------------------------- profile */
export const NoahProfile: React.FC<{blink?: number; rim?: string; rimOpacity?: number; look?: number}> = ({
  blink = 0, rim = C.amber, rimOpacity = 0.9, look = 0,
}) => {
  const face =
    'M 132 250 C 130 160 200 88 320 82 C 400 80 446 140 452 230 L 462 282 C 452 292 450 300 456 316 L 472 338 C 488 356 502 370 498 380 C 490 390 474 390 468 394 C 476 404 480 410 472 418 C 466 424 470 432 474 440 C 476 456 468 474 456 486 C 440 500 412 506 372 508 C 340 510 318 498 300 484 L 160 400 C 140 360 132 310 132 250 Z';
  const hair =
    'M 120 318 C 100 250 104 170 150 116 C 168 90 186 74 206 66 C 226 50 262 46 284 56 C 304 36 344 40 366 58 C 392 54 420 72 432 98 C 452 112 464 140 460 168 C 456 192 444 204 432 208 C 434 190 426 176 414 172 C 410 190 396 198 380 196 C 384 182 380 170 370 166 C 352 180 330 182 312 176 C 300 196 284 214 268 226 C 262 250 252 270 236 280 C 214 290 196 310 186 340 C 176 370 160 384 146 380 C 134 360 126 340 120 318 Z';
  const eyeOpen = 1 - blink;
  return (
    <g>
      {/* neck + shoulders */}
      <path d="M 250 470 L 350 486 L 362 640 L 236 640 Z" fill={N.skinShade} />
      <path d="M 20 760 C 40 660 140 610 236 604 L 362 606 C 470 616 560 660 600 760 Z" fill={N.shirt} />
      <path d="M 236 604 C 260 632 330 636 362 606 L 368 622 C 330 660 262 656 228 622 Z" fill={N.shirtShade} />
      {/* head */}
      <path d={face} fill={N.skin} />
      {/* jaw shade + stubble */}

      {/* back-of-head shade */}
      {/* ear */}
      <ellipse cx={268} cy={322} rx={24} ry={38} fill={N.skin} />
      <path d="M 262 300 C 280 304 284 336 266 346" stroke={N.skinShade} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* eye */}
      <g transform={`translate(424 306) scale(1 ${Math.max(0.08, eyeOpen)})`}>
        <path d="M -22 0 C -10 -14 12 -14 24 -2 C 12 10 -10 10 -22 0 Z" fill="#f1e7dc" />
        <circle cx={8 + look * 4} cy={0} r={9} fill={N.eye} />
        <circle cx={11 + look * 4} cy={-3} r={3} fill="#fff" opacity={0.9} />
      </g>
      <path d="M 398 296 C 410 288 432 286 448 294" stroke="#3a2418" strokeWidth={4} fill="none" opacity={0.6} />
      {/* brow */}
      <path d="M 392 270 C 410 258 436 256 456 262" stroke={N.hair} strokeWidth={11} fill="none" strokeLinecap="round" />
      {/* nostril + mouth */}
      <path d="M 468 384 C 474 380 480 380 484 384" stroke={N.skinShade} strokeWidth={4} fill="none" />
      <path d="M 458 424 C 464 426 468 426 472 424" stroke="#7a4636" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* hair */}
      <path d={hair} fill={N.hair} />
      <path d="M 210 90 C 260 70 320 70 370 92" stroke={N.hairHi} strokeWidth={8} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* rim light on the face edge */}
      <path d="M 452 230 L 462 282 C 452 292 450 300 456 316 L 472 338 C 488 356 502 370 498 380 C 490 390 474 390 468 394 C 476 404 480 410 472 418 C 466 424 470 432 474 440 C 476 456 468 474 456 486"
        stroke={rim} strokeWidth={5} fill="none" opacity={rimOpacity} strokeLinecap="round" />
      <path d="M 432 98 C 452 112 464 140 460 168" stroke={rim} strokeWidth={4} fill="none" opacity={rimOpacity * 0.8} strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------- back view */
export const NoahBack: React.FC<{armRaise?: number; lean?: number}> = ({armRaise = 1, lean = 0}) => {
  const [ex, ey] = [-300 - 20 * armRaise, -470 - 120 * armRaise];
  const [hx, hy] = [-310 - 10 * armRaise, -560 - 210 * armRaise];
  return (
    <g transform={`rotate(${lean} 0 -300)`}>
      {/* raised arm */}
      {armRaise > 0 && <>
        {limb(-230, -380, ex, ey, 74, N.skinShade)}
        {limb(ex, ey, hx, hy, 62, N.skinShade)}
        <ellipse cx={hx} cy={hy - 20} rx={36} ry={46} fill={N.skinShade} />
        <path d="M -270 -420 C -300 -380 -300 -330 -260 -300 L -190 -330 L -200 -420 Z" fill={N.shirt} />
      </>}
      {/* torso */}
      <path d="M -300 0 C -300 -200 -290 -360 -200 -410 C -120 -450 120 -450 200 -410 C 290 -360 300 -200 300 0 Z" fill={N.shirt} />
      <path d="M 40 -430 C 160 -420 260 -380 290 -260 C 300 -170 300 -80 300 0 L 120 0 C 160 -120 170 -300 40 -430 Z" fill={N.shirtShade} opacity={0.8} />
      <path d="M -120 -300 C -80 -240 -60 -160 -70 -60" stroke={N.shirtShade} strokeWidth={8} fill="none" opacity={0.7} />
      {/* neck */}
      <path d="M -62 -470 L 62 -470 L 70 -420 C 30 -404 -30 -404 -70 -420 Z" fill={N.skinShade} />
      {/* head + ears */}
      <ellipse cx={-118} cy={-560} rx={20} ry={34} fill={N.skinShade} />
      <ellipse cx={118} cy={-560} rx={20} ry={34} fill={N.skinShade} />
      <ellipse cx={0} cy={-580} rx={118} ry={136} fill={N.skinShade} />
      {/* hair (messy, from behind) */}
      <path d="M -126 -540 C -150 -640 -110 -730 -30 -748 C -10 -770 40 -768 60 -748 C 110 -750 150 -700 140 -640 C 150 -600 140 -560 120 -530 C 110 -500 80 -486 60 -500 C 40 -480 -10 -478 -40 -496 C -70 -480 -110 -500 -126 -540 Z" fill={N.hair} />
      <path d="M -60 -720 C -20 -738 40 -736 80 -716" stroke={N.hairHi} strokeWidth={9} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* rim light */}
      <path d="M -126 -540 C -150 -640 -110 -730 -30 -748" stroke={C.gold} strokeWidth={6} fill="none" opacity={0.75} />
      <path d="M 60 -748 C 110 -750 150 -700 140 -640" stroke={C.gold} strokeWidth={6} fill="none" opacity={0.75} />
      <path d="M -200 -410 C -120 -450 120 -450 200 -410" stroke={C.gold} strokeWidth={5} fill="none" opacity={0.5} />
    </g>
  );
};

/* ------------------------------------------------------------ walking */
export const NoahWalk: React.FC<{phase: number; rim?: string}> = ({phase, rim = C.gold}) => {
  const s = Math.sin(phase);
  const hip = [0, -200] as const;
  const legA = 24 * s, legB = -24 * s;
  const kneeA = pol(hip[0], hip[1], 100, legA);
  const kneeB = pol(hip[0], hip[1], 100, legB);
  const footA = pol(kneeA[0], kneeA[1], 100, legA - Math.max(0, -s) * 30);
  const footB = pol(kneeB[0], kneeB[1], 100, legB - Math.max(0, s) * 30);
  const bob = Math.abs(Math.cos(phase)) * -6;
  const sh = [8, -384 + bob] as const;
  const elA = pol(sh[0], sh[1], 80, -20 * s), elB = pol(sh[0], sh[1], 80, 20 * s);
  const haA = pol(elA[0], elA[1], 78, -20 * s - 18), haB = pol(elB[0], elB[1], 78, 20 * s - 18);
  return (
    <g transform={`translate(0 ${bob})`}>
      {/* far limbs (darker) */}
      {limb(hip[0], hip[1], kneeB[0], kneeB[1], 40, '#1a1c20')}
      {limb(kneeB[0], kneeB[1], footB[0], footB[1], 34, '#1a1c20')}
      <ellipse cx={footB[0] + 12} cy={footB[1] + 4} rx={26} ry={11} fill="#111" />
      {limb(sh[0], sh[1], elB[0], elB[1], 28, N.skinShade)}
      {limb(elB[0], elB[1], haB[0], haB[1], 24, N.skinShade)}
      {/* torso */}
      <path d={`M -44 -190 L -40 ${-380 + bob} C -20 ${-404 + bob} 40 ${-404 + bob} 56 ${-376 + bob} L 50 -190 Z`} fill={N.shirt} />
      <path d={`M 20 ${-398 + bob} C 44 ${-396 + bob} 56 ${-386 + bob} 56 ${-376 + bob} L 50 -190 L 26 -190 Z`} fill={N.shirtShade} />
      {/* near limbs */}
      {limb(hip[0], hip[1], kneeA[0], kneeA[1], 42, N.pants)}
      {limb(kneeA[0], kneeA[1], footA[0], footA[1], 36, N.pants)}
      <ellipse cx={footA[0] + 12} cy={footA[1] + 4} rx={27} ry={12} fill={N.sock} />
      <rect x={-48} y={-210} width={100} height={36} rx={14} fill={N.pants} />
      {/* head */}
      <rect x={6} y={-424 + bob} width={30} height={34} fill={N.skinShade} />
      <ellipse cx={26} cy={-462 + bob} rx={44} ry={50} fill={N.skin} />
      <path d={`M 64 ${-470 + bob} L 76 ${-452 + bob} L 64 ${-446 + bob} Z`} fill={N.skin} />
      <circle cx={52} cy={-468 + bob} r={4} fill={N.eye} />
      <path d={`M -20 ${-450 + bob} C -30 ${-500 + bob} 0 ${-528 + bob} 36 ${-520 + bob} C 70 ${-520 + bob} 82 ${-494 + bob} 70 ${-476 + bob} C 56 ${-488 + bob} 40 ${-486 + bob} 28 ${-478 + bob} C 18 ${-462 + bob} 4 ${-444 + bob} -10 ${-430 + bob} Z`} fill={N.hair} />
      {limb(sh[0], sh[1], elA[0], elA[1], 30, N.shirt)}
      {limb(elA[0], elA[1], haA[0], haA[1], 25, N.skin)}
      <circle cx={haA[0]} cy={haA[1]} r={15} fill={N.skin} />
      {/* rim from the window (right side) */}
      <path d={`M 70 ${-476 + bob} C 82 ${-494 + bob} 70 ${-520 + bob} 36 ${-520 + bob}`} stroke={rim} strokeWidth={4} fill="none" opacity={0.8} />
      <path d={`M 56 ${-376 + bob} L 50 -190`} stroke={rim} strokeWidth={4} opacity={0.6} />
    </g>
  );
};

/* ------------------------------------------------------- sitting w/ phone */
export const NoahSitting: React.FC<{breath?: number; head?: number}> = ({breath = 0, head = 0}) => {
  const b = breath * 4;
  return (
    <g>
      {/* far leg */}
      {limb(20, 0, 150, 6, 44, '#1a1c20')}
      {limb(150, 6, 166, 176, 38, '#1a1c20')}
      {/* torso leaning forward */}
      <path d={`M -40 10 C -50 -80 -30 ${-170 - b} 20 ${-214 - b} C 60 ${-236 - b} 96 ${-222 - b} 104 ${-196 - b} L 70 10 Z`} fill={N.shirt} />
      <path d={`M 60 ${-226 - b} C 90 ${-224 - b} 104 ${-212 - b} 104 ${-196 - b} L 70 10 L 40 10 C 70 -60 80 ${-150 - b} 60 ${-226 - b} Z`} fill={N.shirtShade} />
      {/* near leg */}
      {limb(10, 0, 150, 0, 48, N.pants)}
      {limb(150, 0, 160, 172, 40, N.pants)}
      <ellipse cx={176} cy={178} rx={30} ry={12} fill={N.sock} />
      {/* head (bowed toward phone) */}
      <g transform={`rotate(${18 - head * 14} 80 ${-232 - b})`}>
        <rect x={64} y={-262 - b} width={30} height={30} fill={N.skinShade} />
        <ellipse cx={92} cy={-300 - b} rx={46} ry={52} fill={N.skin} />
        <path d={`M 132 ${-306 - b} L 146 ${-290 - b} L 132 ${-284 - b} Z`} fill={N.skin} />
        <circle cx={120} cy={-306 - b} r={4.5} fill={N.eye} />
        <path d={`M 104 ${-322 - b} C 114 ${-330 - b} 128 ${-330 - b} 136 ${-322 - b}`} stroke={N.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M 44 ${-290 - b} C 34 ${-344 - b} 64 ${-370 - b} 100 ${-362 - b} C 136 ${-362 - b} 150 ${-336 - b} 138 ${-318 - b} C 124 ${-330 - b} 106 ${-328 - b} 94 ${-320 - b} C 82 ${-302 - b} 68 ${-284 - b} 54 ${-270 - b} Z`} fill={N.hair} />
      </g>
      {/* arms holding the phone */}
      {limb(60, -196 - b, 96, -96, 30, N.shirt)}
      {limb(96, -96, 160, -120, 26, N.skin)}
      <rect x={150} y={-150} width={26} height={44} rx={5} fill="#0b0f12" transform="rotate(-25 163 -128)" />
      <rect x={153} y={-147} width={20} height={36} rx={3} fill="#cfe6ff" opacity={0.9} transform="rotate(-25 163 -128)" />
      <circle cx={162} cy={-118} r={14} fill={N.skin} />
    </g>
  );
};

/* ------------------------------------------------------------ lying in bed */
export const NoahLying: React.FC<{breath?: number; lift?: number; eye?: number}> = ({breath = 0, lift = 0, eye = 0}) => {
  const b = breath * 10;
  return (
    <g>
      {/* head on pillow, facing camera-right/up */}
      <g transform={`translate(0 ${-lift * 26}) rotate(${-lift * 12} 0 0)`}>
        <ellipse cx={0} cy={0} rx={56} ry={50} fill={N.skin} />
        <path d="M 46 -8 L 62 4 L 48 12 Z" fill={N.skin} />
        <path d="M -54 18 C -70 -30 -40 -66 4 -60 C 40 -58 60 -40 56 -24 C 40 -34 20 -34 6 -26 C -6 -8 -24 8 -40 30 Z" fill={N.hair} />
        <ellipse cx={-4} cy={6} rx={14} ry={22} fill={N.skinShade} opacity={0.6} />
        {/* eye: closed line → open */}
        {eye < 0.5
          ? <path d="M 22 -6 C 28 -2 34 -2 40 -6" stroke="#3a2418" strokeWidth={4} fill="none" strokeLinecap="round" />
          : <g><ellipse cx={31} cy={-6} rx={9} ry={6} fill="#f1e7dc" /><circle cx={34} cy={-6} r={4.5} fill={N.eye} /></g>}
        <path d="M 20 -22 C 28 -28 38 -28 46 -22" stroke={N.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
      {/* shoulder in t-shirt */}
      <path d={`M 30 40 C 60 ${10 - b * 0.3} 130 ${0 - b * 0.4} 170 30 L 170 80 L 30 80 Z`} fill={N.shirt} />
      {/* blanket */}
      <path d={`M 60 70 C 120 ${10 - b} 260 ${-10 - b} 380 ${10 - b * 0.6} C 520 30 640 10 760 40 L 800 140 L 40 140 Z`} fill="#3b4a52" />
      <path d={`M 120 50 C 220 ${0 - b} 330 ${0 - b} 420 30`} stroke="#536871" strokeWidth={6} fill="none" opacity={0.7} />
      {/* arm over the blanket */}
      {limb(150, 40 - b * 0.4, 300, 52 - b * 0.6, 30, N.skin)}
    </g>
  );
};

/* -------------------------------------------- jacket + backpack on chair */
export const ChairWithGear: React.FC = () => (
  <g>
    <rect x={-70} y={-10} width={150} height={16} rx={4} fill="#2b2420" />
    <rect x={-66} y={6} width={10} height={150} fill="#221c18" />
    <rect x={64} y={6} width={10} height={150} fill="#221c18" />
    <rect x={64} y={-200} width={12} height={200} fill="#221c18" />
    {/* jacket hanging on chair back */}
    <path d="M 40 -210 C 80 -224 110 -210 112 -180 L 120 -30 C 100 -20 70 -20 54 -28 L 40 -120 Z" fill={N.jacket} />
    <path d="M 60 -200 L 70 -40" stroke="#1a2a2d" strokeWidth={4} />
    {/* backpack leaning on the leg */}
    <path d="M -50 150 C -60 60 -40 20 10 18 C 60 20 74 60 66 150 Z" fill={N.pack} />
    <rect x={-30} y={80} width={70} height={46} rx={10} fill="#4b4f53" />
    <path d="M -10 22 C -10 -6 30 -6 30 22" stroke="#4b4f53" strokeWidth={8} fill="none" />
  </g>
);
