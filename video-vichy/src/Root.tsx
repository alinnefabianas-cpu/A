import {Composition} from 'remotion';
import {Vichy, DURACAO} from './Vichy';

export const Root = () => (
	<Composition id="Vichy" component={Vichy} durationInFrames={DURACAO} fps={30} width={1080} height={1920} />
);
