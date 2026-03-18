import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
} from 'remotion';
import {COLORS, FONTS, ANALYSIS_STEPS} from '../constants/theme';

export const AnalysisLoading: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// Rotating gradient ring (3s = 180 frames at 60fps)
	const ringRotation = (frame / 180) * 360;

	// Orbiting dots (2s = 120 frames at 60fps)
	const dotRotation = (frame / 120) * 360;

	// Step text: cycle every 60 frames, 4 steps
	const stepIndex = Math.min(
		Math.floor(frame / 60),
		ANALYSIS_STEPS.length - 1
	);

	// Per-step fade (10-frame crossfade)
	const stepLocalFrame = frame % 60;
	const stepOpacity = interpolate(stepLocalFrame, [0, 10, 50, 60], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Last step holds (no fade out)
	const finalStepOpacity =
		stepIndex === ANALYSIS_STEPS.length - 1
			? interpolate(stepLocalFrame, [0, 10], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			: stepOpacity;

	// Progress dots
	const progressDots = ANALYSIS_STEPS.map((_, i) => i <= stepIndex);

	// Exit transition: scale-out over last 30 frames
	const exitScale = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0.95],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);
	const exitOpacity = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Pulsing outer glow
	const glowPulse = interpolate(
		frame % 120,
		[0, 60, 120],
		[0.3, 0.7, 0.3],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	const orbitColors = [
		COLORS.terracotta,
		COLORS.sage,
		COLORS.blush,
		COLORS.stone,
	];

	return (
		<AbsoluteFill
			style={{
				background: COLORS.cream,
				opacity: exitOpacity,
				transform: `scale(${exitScale})`,
			}}
		>
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 40,
				}}
			>
				{/* Spinning widget */}
				<div
					style={{
						position: 'relative',
						width: 200,
						height: 200,
					}}
				>
					{/* Outer glow */}
					<div
						style={{
							position: 'absolute',
							inset: -20,
							borderRadius: '50%',
							background: `radial-gradient(circle, ${COLORS.terracottaLight}${Math.round(glowPulse * 40)
								.toString(16)
								.padStart(2, '0')}, transparent 70%)`,
						}}
					/>

					{/* Outer ring */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							border: `2px solid ${COLORS.stoneLight}40`,
						}}
					/>

					{/* Rotating gradient ring */}
					<div
						style={{
							position: 'absolute',
							inset: 10,
							borderRadius: '50%',
							border: '3px solid transparent',
							borderTopColor: COLORS.terracotta,
							borderRightColor: COLORS.sage,
							borderBottomColor: COLORS.blush,
							transform: `rotate(${ringRotation}deg)`,
						}}
					/>

					{/* Orbiting dots */}
					{orbitColors.map((color, i) => {
						const angle =
							((dotRotation + i * 90) * Math.PI) / 180;
						const radius = 70;
						const x = Math.cos(angle) * radius + 100 - 6;
						const y = Math.sin(angle) * radius + 100 - 6;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: x,
									top: y,
									width: 12,
									height: 12,
									borderRadius: '50%',
									background: color,
									boxShadow: `0 2px 8px ${color}60`,
								}}
							/>
						);
					})}

					{/* Center circle */}
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 80,
							height: 80,
							borderRadius: '50%',
							background: `linear-gradient(135deg, ${COLORS.terracottaLight}, ${COLORS.blush})`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
							<rect
								x="3"
								y="5"
								width="18"
								height="14"
								rx="2"
								stroke="white"
								strokeWidth="1.5"
							/>
							<circle cx="8.5" cy="10.5" r="1.5" fill="white" />
							<path
								d="M5 17l4-4 3 3 4-5 4 6"
								stroke="white"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
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
					Analyzing Your Colors
				</span>

				{/* Step text */}
				<div style={{height: 30, position: 'relative'}}>
					<span
						style={{
							fontFamily: FONTS.body,
							fontSize: 16,
							color: COLORS.stone,
							opacity: finalStepOpacity,
						}}
					>
						{ANALYSIS_STEPS[stepIndex]}...
					</span>
				</div>

				{/* Progress dots */}
				<div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
					{progressDots.map((filled, i) => (
						<div
							key={i}
							style={{
								width: filled && i === stepIndex ? 10 : 8,
								height: filled && i === stepIndex ? 10 : 8,
								borderRadius: '50%',
								background: filled
									? COLORS.terracotta
									: COLORS.stoneLight,
								transition: 'all 0.2s',
								transform:
									filled && i === stepIndex
										? 'scale(1.2)'
										: 'scale(1)',
							}}
						/>
					))}
					{/* Connecting line */}
					<div
						style={{
							position: 'absolute',
							width: (progressDots.length - 1) * 20,
							height: 2,
							background: COLORS.stoneLight,
							left: '50%',
							transform: 'translateX(-50%)',
							zIndex: -1,
						}}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
