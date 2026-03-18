import {Composition} from 'remotion';
import {TrueColorMarketing} from './TrueColorMarketing';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="TrueColorMarketing"
				component={TrueColorMarketing}
				durationInFrames={3000}
				width={1920}
				height={1080}
				fps={60}
				defaultProps={{}}
			/>
		</>
	);
};
