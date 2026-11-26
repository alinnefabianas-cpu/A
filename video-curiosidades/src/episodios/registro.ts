// Todos os episódios automáticos. Para adicionar um: crie src/episodios/<slug>/Episodio.tsx
// exportando `default` do tipo DefEpisodio e acrescente o import abaixo.
import type {DefEpisodio} from '../Episodio';
import emuWar from './emu-war/Episodio';
import marathon1904 from './marathon-1904/Episodio';
import roundWindows from './round-windows/Episodio';
import napoleon from './napoleon/Episodio';
import bluetooth from './bluetooth/Episodio';
import dancingPlague from './dancing-plague/Episodio';
import libertyGreen from './liberty-green/Episodio';
import yellowBus from './yellow-bus/Episodio';
import stopSign from './stop-sign/Episodio';
import monaLisa from './mona-lisa/Episodio';
import ketchup from './ketchup/Episodio';
import bubbleWrap from './bubble-wrap/Episodio';
import molassesFlood from './molasses-flood/Episodio';
import carrotsOrange from './carrots-orange/Episodio';
import eiffelGrows from './eiffel-grows/Episodio';
import pisaLean from './pisa-lean/Episodio';
import sharksTrees from './sharks-trees/Episodio';
import jeansPocket from './jeans-pocket/Episodio';
import penCapHole from './pen-cap-hole/Episodio';
import golfDimples from './golf-dimples/Episodio';
import flamingosPink from './flamingos-pink/Episodio';
import fingersWrinkle from './fingers-wrinkle/Episodio';
import honeySpoils from './honey-spoils/Episodio';
import violetJessop from './violet-jessop/Episodio';
import roySullivan from './roy-sullivan/Episodio';
import julianeKoepcke from './juliane-koepcke/Episodio';
import poonLim from './poon-lim/Episodio';

export const EPISODIOS: DefEpisodio[] = [
	emuWar,
	marathon1904,
	roundWindows,
	napoleon,
	bluetooth,
	dancingPlague,
	libertyGreen,
	yellowBus,
	stopSign,
	monaLisa,
	ketchup,
	bubbleWrap,
	molassesFlood,
	carrotsOrange,
	eiffelGrows,
	pisaLean,
	sharksTrees,
	jeansPocket,
	penCapHole,
	golfDimples,
	flamingosPink,
	fingersWrinkle,
	honeySpoils,
	violetJessop,
	roySullivan,
	julianeKoepcke,
	poonLim,
	// AUTO-EPISODIOS (não apague esta linha)
];
