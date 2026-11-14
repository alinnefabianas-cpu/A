// Todos os episódios automáticos. Para adicionar um: crie src/episodios/<slug>/Episodio.tsx
// exportando `default` do tipo DefEpisodio e acrescente o import abaixo.
import type {DefEpisodio} from '../Episodio';
import emuWar from './emu-war/Episodio';

export const EPISODIOS: DefEpisodio[] = [
	emuWar,
	// AUTO-EPISODIOS (não apague esta linha)
];
