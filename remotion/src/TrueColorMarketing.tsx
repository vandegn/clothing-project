import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES} from './constants/theme';
import {HeroIntro} from './scenes/HeroIntro';
import {UploadSelfie} from './scenes/UploadSelfie';
import {AnalysisLoading} from './scenes/AnalysisLoading';
import {ResultsReveal} from './scenes/ResultsReveal';
import {VirtualTryOn} from './scenes/VirtualTryOn';
import {OutroCTA} from './scenes/OutroCTA';

export const TrueColorMarketing: React.FC = () => {
	return (
		<AbsoluteFill>
			<Sequence from={SCENES.hero.from} durationInFrames={SCENES.hero.duration}>
				<HeroIntro />
			</Sequence>
			<Sequence from={SCENES.upload.from} durationInFrames={SCENES.upload.duration}>
				<UploadSelfie />
			</Sequence>
			<Sequence from={SCENES.loading.from} durationInFrames={SCENES.loading.duration}>
				<AnalysisLoading />
			</Sequence>
			<Sequence from={SCENES.results.from} durationInFrames={SCENES.results.duration}>
				<ResultsReveal />
			</Sequence>
			<Sequence from={SCENES.tryOn.from} durationInFrames={SCENES.tryOn.duration}>
				<VirtualTryOn />
			</Sequence>
			<Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration}>
				<OutroCTA />
			</Sequence>
		</AbsoluteFill>
	);
};
