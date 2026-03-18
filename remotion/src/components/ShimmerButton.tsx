import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';

export const ShimmerButton: React.FC<{
	text: string;
	appearFrame: number;
	clickFrame?: number;
	accentColor?: string;
}> = ({
	text,
	appearFrame,
	clickFrame,
	accentColor = COLORS.terracotta,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Slide up appearance
	const slideUp = spring({
		fps,
		frame: Math.max(0, frame - appearFrame),
		config: {damping: 200},
	});

	const opacity = interpolate(frame - appearFrame, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Click pulse
	let scale = 1;
	if (clickFrame !== undefined && frame >= clickFrame) {
		const clickProgress = frame - clickFrame;
		scale = interpolate(clickProgress, [0, 8, 16], [1, 0.95, 1.02], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	}

	// Shimmer position (loops)
	const shimmerX = interpolate(frame % 90, [0, 90], [-100, 300], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (frame < appearFrame) return null;

	return (
		<div
			style={{
				opacity,
				transform: `translateY(${(1 - slideUp) * 20}px) scale(${scale})`,
				position: 'relative',
				overflow: 'hidden',
				background: `linear-gradient(135deg, ${accentColor}, ${COLORS.terracottaDark})`,
				borderRadius: 16,
				padding: '16px 40px',
				display: 'inline-flex',
				alignItems: 'center',
				gap: 10,
				boxShadow: `0 8px 30px ${accentColor}40`,
			}}
		>
			<span
				style={{
					fontFamily: FONTS.body,
					fontSize: 18,
					color: 'white',
					fontWeight: 600,
					letterSpacing: 0.5,
					position: 'relative',
					zIndex: 1,
				}}
			>
				{text}
			</span>
			{/* Arrow */}
			<span
				style={{
					fontSize: 18,
					color: 'white',
					position: 'relative',
					zIndex: 1,
				}}
			>
				→
			</span>
			{/* Shimmer overlay */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)`,
					transform: `translateX(${shimmerX}%)`,
				}}
			/>
		</div>
	);
};
