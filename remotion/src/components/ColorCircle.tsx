import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';

export const ColorCircle: React.FC<{
	color: string;
	label: string;
	hex: string;
	appearFrame: number;
	size?: number;
}> = ({color, label, hex, appearFrame, size = 96}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scaleSpring = spring({
		fps,
		frame: Math.max(0, frame - appearFrame),
		config: {damping: 100},
	});

	const labelOpacity = interpolate(frame - appearFrame, [10, 25], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (frame < appearFrame) return null;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 14,
				transform: `scale(${scaleSpring})`,
			}}
		>
			{/* Glow */}
			<div style={{position: 'relative'}}>
				<div
					style={{
						position: 'absolute',
						inset: -12,
						borderRadius: '50%',
						background: `${color}4D`,
						filter: 'blur(20px)',
					}}
				/>
				{/* Outer ring */}
				<div
					style={{
						position: 'absolute',
						inset: -6,
						borderRadius: '50%',
						border: `1px solid ${COLORS.stoneLight}40`,
					}}
				/>
				{/* Circle */}
				<div
					style={{
						width: size,
						height: size,
						borderRadius: '50%',
						background: color,
						boxShadow: `0 4px 20px rgba(0,0,0,0.15)`,
						border: '4px solid white',
						position: 'relative',
					}}
				/>
			</div>
			{/* Label */}
			<div
				style={{
					opacity: labelOpacity,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 4,
				}}
			>
				<span
					style={{
						fontFamily: FONTS.display,
						fontSize: 18,
						color: COLORS.charcoal,
						fontWeight: 500,
					}}
				>
					{label}
				</span>
				<span
					style={{
						fontFamily: FONTS.mono,
						fontSize: 13,
						color: COLORS.stone,
					}}
				>
					{hex}
				</span>
			</div>
		</div>
	);
};
