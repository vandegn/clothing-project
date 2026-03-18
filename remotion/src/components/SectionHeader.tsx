import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';

export const SectionHeader: React.FC<{
	eyebrow: string;
	title: string;
	startFrame?: number;
}> = ({eyebrow, title, startFrame = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const opacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const slideUp = spring({
		fps,
		frame: Math.max(0, frame - startFrame),
		config: {damping: 200},
	});

	return (
		<div
			style={{
				opacity,
				transform: `translateY(${(1 - slideUp) * 15}px)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
			}}
		>
			{/* Eyebrow with divider */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
				}}
			>
				<div
					style={{
						width: 40,
						height: 2,
						background: COLORS.terracotta,
						borderRadius: 1,
					}}
				/>
				<span
					style={{
						fontFamily: FONTS.body,
						fontSize: 12,
						color: COLORS.terracotta,
						letterSpacing: 3,
						textTransform: 'uppercase',
						fontWeight: 600,
					}}
				>
					{eyebrow}
				</span>
				<div
					style={{
						width: 40,
						height: 2,
						background: COLORS.terracotta,
						borderRadius: 1,
					}}
				/>
			</div>
			{/* Title */}
			<span
				style={{
					fontFamily: FONTS.display,
					fontSize: 36,
					color: COLORS.charcoal,
					fontWeight: 600,
				}}
			>
				{title}
			</span>
		</div>
	);
};
