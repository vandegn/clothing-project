import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';
import {GradientOrbs} from '../components/GradientOrbs';
import {TrueColorLogo} from '../components/TrueColorLogo';

export const HeroIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Logo fade in
	const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const logoSlide = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	// Headline spring (starts at frame 30)
	const headlineSpring = spring({
		fps,
		frame: Math.max(0, frame - 30),
		config: {damping: 200},
	});
	const headlineOpacity = interpolate(frame - 30, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Subtitle (12 frames after headline = frame 42)
	const subtitleOpacity = interpolate(frame - 42, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const subtitleSlide = spring({
		fps,
		frame: Math.max(0, frame - 42),
		config: {damping: 200},
	});

	// Fade out (last 30 frames)
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill style={{background: COLORS.cream, opacity: fadeOut}}>
			<GradientOrbs />

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 40,
				}}
			>
				{/* Logo */}
				<div
					style={{
						opacity: logoOpacity,
						transform: `translateY(${(1 - logoSlide) * 20}px)`,
					}}
				>
					<TrueColorLogo scale={1.2} />
				</div>

				{/* Headline */}
				<div
					style={{
						opacity: headlineOpacity,
						transform: `translateY(${(1 - headlineSpring) * 30}px)`,
						textAlign: 'center',
					}}
				>
					<span
						style={{
							fontFamily: FONTS.display,
							fontSize: 80,
							color: COLORS.charcoal,
							fontWeight: 600,
							lineHeight: 1.1,
						}}
					>
						Discover Your{' '}
					</span>
					<span
						style={{
							fontFamily: FONTS.display,
							fontSize: 80,
							color: COLORS.terracotta,
							fontWeight: 600,
							fontStyle: 'italic',
							lineHeight: 1.1,
						}}
					>
						Color Season
					</span>
				</div>

				{/* Subtitle */}
				<div
					style={{
						opacity: subtitleOpacity,
						transform: `translateY(${(1 - subtitleSlide) * 15}px)`,
					}}
				>
					<span
						style={{
							fontFamily: FONTS.body,
							fontSize: 24,
							color: COLORS.stone,
							letterSpacing: 0.5,
						}}
					>
						AI-powered seasonal color analysis
					</span>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
