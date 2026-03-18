import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';
import {GradientOrbs} from '../components/GradientOrbs';

export const OutroCTA: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Fade in (first 30 frames)
	const fadeIn = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// URL spring in (frame 30)
	const urlSpring = spring({
		fps,
		frame: Math.max(0, frame - 30),
		config: {damping: 100},
	});
	const urlOpacity = interpolate(frame - 30, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Tagline fade (frame 110)
	const taglineOpacity = interpolate(frame - 110, [0, 25], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineSlide = spring({
		fps,
		frame: Math.max(0, frame - 110),
		config: {damping: 200},
	});

	return (
		<AbsoluteFill style={{background: COLORS.cream, opacity: fadeIn}}>
			<GradientOrbs drift />

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 24,
				}}
			>
				{/* URL */}
				<span
					style={{
						fontFamily: FONTS.display,
						fontSize: 64,
						color: COLORS.charcoal,
						fontWeight: 600,
						opacity: urlOpacity,
						transform: `scale(${0.9 + urlSpring * 0.1})`,
						letterSpacing: 1,
					}}
				>
					truecolor.beauty
				</span>

				{/* Tagline */}
				<span
					style={{
						fontFamily: FONTS.body,
						fontSize: 20,
						color: COLORS.terracotta,
						opacity: taglineOpacity,
						transform: `translateY(${(1 - taglineSlide) * 15}px)`,
						letterSpacing: 0.5,
					}}
				>
					Unlock your perfect color palette
				</span>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
