import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {COLORS} from '../constants/theme';

export const GradientOrbs: React.FC<{drift?: boolean}> = ({drift = false}) => {
	const frame = useCurrentFrame();

	const driftY1 = drift
		? interpolate(frame % 360, [0, 180, 360], [0, -10, 0])
		: 0;
	const driftY2 = drift
		? interpolate(frame % 420, [0, 210, 420], [0, 8, 0])
		: 0;

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{/* Terracotta blob top-right */}
			<div
				style={{
					position: 'absolute',
					top: -100 + driftY1,
					right: -80,
					width: 500,
					height: 500,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${COLORS.terracottaLight}40, ${COLORS.terracotta}15, transparent 70%)`,
					filter: 'blur(60px)',
				}}
			/>
			{/* Sage blob bottom-left */}
			<div
				style={{
					position: 'absolute',
					bottom: -120 + driftY2,
					left: -100,
					width: 450,
					height: 450,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${COLORS.sage}35, ${COLORS.sage}10, transparent 70%)`,
					filter: 'blur(60px)',
				}}
			/>
			{/* Blush blob center-right */}
			<div
				style={{
					position: 'absolute',
					top: '40%',
					right: '15%',
					width: 300,
					height: 300,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${COLORS.blush}20, transparent 70%)`,
					filter: 'blur(50px)',
				}}
			/>
		</AbsoluteFill>
	);
};
