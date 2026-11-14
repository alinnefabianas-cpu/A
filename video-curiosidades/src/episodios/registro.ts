// Todos os episódios automáticos. Para adicionar um: crie src/episodios/<slug>/Episodio.tsx
// exportando `default` do tipo DefEpisodio e acrescente o import abaixo.
import type {DefEpisodio} from '../Episodio';
import emuWar from './emu-war/Episodio';
import marathon1904 from './marathon-1904/Episodio';

export const EPISODIOS: DefEpisodio[] = [
	emuWar,
	marathon1904,
	// AUTO-EPISODIOS (não apague esta linha)
];
