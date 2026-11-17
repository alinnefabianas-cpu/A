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
	// AUTO-EPISODIOS (não apague esta linha)
];
