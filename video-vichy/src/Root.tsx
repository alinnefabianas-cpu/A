import {Composition} from 'remotion';
import {Vichy, DURACAO} from './Vichy';

export const Root = () => (
	<>
		<Composition id="Vichy" component={Vichy} durationInFrames={DURACAO} fps={30} width={1080} height={1920} />
		{/* Prévia para o cliente, com marca d'água */}
		<Composition id="VichyPrevia" component={Vichy} durationInFrames={DURACAO} fps={30} width={1080} height={1920} defaultProps={{marca: 'Gabi'}} />
	</>
);
