import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';
import {GradientOrbs} from '../components/GradientOrbs';
import {ShimmerButton} from '../components/ShimmerButton';

// Placeholder pane for upload areas
const UploadPane: React.FC<{
	label: string;
	hint: string;
	filled: boolean;
	fillFrame: number;
	isClothing?: boolean;
}> = ({label, hint, filled, fillFrame, isClothing = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const fillSpring = spring({
		fps,
		frame: Math.max(0, frame - fillFrame),
		config: {damping: 200},
	});
	const isFilled = frame >= fillFrame;

	return (
		<div
			style={{
				width: 350,
				height: 467,
				borderRadius: 24,
				border: `2px ${isFilled ? 'solid' : 'dashed'} ${COLORS.stoneLight}60`,
				overflow: 'hidden',
				position: 'relative',
				background: isFilled ? undefined : 'rgba(255,255,255,0.3)',
			}}
		>
			{/* Empty state */}
			{!isFilled && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						gap: 16,
					}}
				>
					<div
						style={{
							width: 56,
							height: 56,
							borderRadius: '50%',
							background: `linear-gradient(135deg, ${COLORS.terracottaLight}60, ${COLORS.terracotta}40)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							{isClothing ? (
								<>
									<path
										d="M8 2l-5 5v3h4v12h10V10h4V7l-5-5h-3l-2 3-2-3H8z"
										stroke={COLORS.terracotta}
										strokeWidth="1.5"
										fill="none"
									/>
								</>
							) : (
								<>
									<rect x="3" y="5" width="18" height="14" rx="2" stroke={COLORS.terracotta} strokeWidth="1.5" />
									<circle cx="8.5" cy="10.5" r="1.5" fill={COLORS.terracotta} />
									<path d="M5 17l4-4 3 3 4-5 4 6" stroke={COLORS.terracotta} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</>
							)}
						</svg>
					</div>
					<span
						style={{
							fontFamily: FONTS.display,
							fontSize: 18,
							color: COLORS.charcoal,
						}}
					>
						{label}
					</span>
					<span
						style={{
							fontFamily: FONTS.body,
							fontSize: 12,
							color: COLORS.stone,
						}}
					>
						{hint}
					</span>
				</div>
			)}

			{/* Filled state — gradient placeholder */}
			{isFilled && (
				<div
					style={{
						width: '100%',
						height: '100%',
						background: isClothing
							? `linear-gradient(180deg, ${COLORS.sage}30, ${COLORS.sage}60, ${COLORS.sage}40)`
							: `linear-gradient(180deg, ${COLORS.terracottaLight}40, ${COLORS.blush}50, ${COLORS.creamDark})`,
						opacity: fillSpring,
						position: 'relative',
					}}
				>
					{/* Silhouette / placeholder visual */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{isClothing ? (
							<svg width="120" height="150" viewBox="0 0 120 150" fill="none">
								<path
									d="M40 10L20 30V50H35V140H85V50H100V30L80 10H70L60 25L50 10H40Z"
									fill={`${COLORS.sage}80`}
									stroke={`${COLORS.sage}`}
									strokeWidth="2"
								/>
							</svg>
						) : (
							<svg width="100" height="180" viewBox="0 0 100 180" fill="none">
								<circle cx="50" cy="30" r="22" fill={`${COLORS.terracotta}40`} />
								<path
									d="M25 65 C25 50, 75 50, 75 65 L80 160 H20 Z"
									fill={`${COLORS.terracotta}30`}
								/>
							</svg>
						)}
					</div>

					{/* Bottom label */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
							padding: '30px 16px 16px',
						}}
					>
						<span
							style={{
								fontFamily: FONTS.body,
								fontSize: 10,
								color: 'white',
								textTransform: 'uppercase',
								letterSpacing: 2,
								fontWeight: 600,
							}}
						>
							{isClothing ? 'Outfit' : 'Your Photo'}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export const VirtualTryOn: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Title fade in (frames 0-60)
	const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const titleSpring = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	// Panes slide in (frames 60-140)
	const leftSlide = spring({
		fps,
		frame: Math.max(0, frame - 60),
		config: {damping: 200},
	});
	const rightSlide = spring({
		fps,
		frame: Math.max(0, frame - 60),
		config: {damping: 200},
	});

	// Arrow (frames 260-300)
	const arrowOpacity = interpolate(frame - 260, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const arrowPulse = interpolate(
		(frame - 260) % 60,
		[0, 30, 60],
		[1, 1.15, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Button (frames 300-360)
	const BUTTON_APPEAR = 300;
	const BUTTON_CLICK = 360;

	// Loading state (frames 360-450)
	const isLoading = frame >= BUTTON_CLICK && frame < 450;
	const loadingOpacity = isLoading
		? interpolate(frame - BUTTON_CLICK, [0, 15], [0, 1], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	// Result reveal (frames 450-570)
	const showResult = frame >= 450;
	const resultSpring = spring({
		fps,
		frame: Math.max(0, frame - 450),
		config: {damping: 100},
	});

	// Action buttons (frames 570-630)
	const actionsOpacity = interpolate(frame - 570, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const actionsSpring = spring({
		fps,
		frame: Math.max(0, frame - 570),
		config: {damping: 200},
	});

	// Fade out
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	// Layout shift for result
	const layoutShift = showResult
		? interpolate(frame - 450, [0, 40], [0, -200], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	// Spinner rotation
	const spinnerRotation = frame * 6;

	return (
		<AbsoluteFill style={{background: COLORS.cream, opacity: fadeOut}}>
			<GradientOrbs />

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 30,
				}}
			>
				{/* Title */}
				<div
					style={{
						opacity: titleOpacity,
						transform: `translateY(${(1 - titleSpring) * 20}px)`,
					}}
				>
					<span
						style={{
							fontFamily: FONTS.display,
							fontSize: 48,
							color: COLORS.charcoal,
							fontWeight: 600,
						}}
					>
						Virtual{' '}
					</span>
					<span
						style={{
							fontFamily: FONTS.display,
							fontSize: 48,
							color: COLORS.sage,
							fontWeight: 600,
							fontStyle: 'italic',
						}}
					>
						Try-On
					</span>
				</div>

				{/* Main content area */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 40,
						transform: `translateX(${layoutShift}px)`,
					}}
				>
					{/* Left pane */}
					<div
						style={{
							transform: `translateX(${(1 - leftSlide) * -300}px)`,
							opacity: leftSlide,
						}}
					>
						<UploadPane
							label="Your Photo"
							hint="Full-body photo works best"
							filled={frame >= 140}
							fillFrame={140}
						/>
					</div>

					{/* Arrow */}
					{frame >= 260 && !showResult && (
						<div
							style={{
								opacity: arrowOpacity,
								transform: `scale(${arrowPulse})`,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<div
								style={{
									width: 48,
									height: 48,
									borderRadius: '50%',
									background: `${COLORS.terracotta}20`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<span
									style={{
										fontSize: 24,
										color: COLORS.terracotta,
									}}
								>
									→
								</span>
							</div>
						</div>
					)}

					{/* Right pane */}
					<div
						style={{
							transform: `translateX(${(1 - rightSlide) * 300}px)`,
							opacity: rightSlide,
						}}
					>
						<UploadPane
							label="Clothing Item"
							hint="Flat-lay or product image"
							filled={frame >= 200}
							fillFrame={200}
							isClothing
						/>
					</div>

					{/* Result image */}
					{showResult && (
						<div
							style={{
								position: 'relative',
								opacity: resultSpring,
								transform: `scale(${resultSpring})`,
							}}
						>
							{/* Arrow between panes and result */}
							<div
								style={{
									position: 'absolute',
									left: -60,
									top: '50%',
									transform: 'translateY(-50%)',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<div
									style={{
										width: 40,
										height: 40,
										borderRadius: '50%',
										background: `${COLORS.terracotta}20`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span
										style={{
											fontSize: 20,
											color: COLORS.terracotta,
										}}
									>
										→
									</span>
								</div>
								<span
									style={{
										fontFamily: FONTS.body,
										fontSize: 10,
										color: COLORS.stone,
										textTransform: 'uppercase',
										letterSpacing: 2,
									}}
								>
									Result
								</span>
							</div>

							{/* Result image placeholder */}
							<div
								style={{
									width: 400,
									height: 533,
									borderRadius: 24,
									background: `linear-gradient(180deg, ${COLORS.terracottaLight}30, ${COLORS.sage}30, ${COLORS.blush}30)`,
									boxShadow: `0 20px 60px rgba(0,0,0,0.1)`,
									border: `2px solid ${COLORS.sage}50`,
									position: 'relative',
									overflow: 'hidden',
								}}
							>
								{/* Combined silhouette with clothing */}
								<div
									style={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<svg
										width="140"
										height="250"
										viewBox="0 0 140 250"
										fill="none"
									>
										<circle
											cx="70"
											cy="35"
											r="28"
											fill={`${COLORS.terracotta}35`}
										/>
										<path
											d="M30 85 C30 65, 110 65, 110 85 L115 220 H25 Z"
											fill={`${COLORS.sage}40`}
										/>
									</svg>
								</div>

								{/* AI Generated badge */}
								<div
									style={{
										position: 'absolute',
										top: 16,
										right: 16,
										background: `${COLORS.sage}CC`,
										borderRadius: 20,
										padding: '6px 14px',
									}}
								>
									<span
										style={{
											fontFamily: FONTS.body,
											fontSize: 10,
											color: 'white',
											fontWeight: 600,
											letterSpacing: 1.5,
											textTransform: 'uppercase',
										}}
									>
										AI Generated
									</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Loading state */}
				{isLoading && (
					<div
						style={{
							opacity: loadingOpacity,
							display: 'flex',
							alignItems: 'center',
							gap: 12,
						}}
					>
						<div
							style={{
								width: 20,
								height: 20,
								borderRadius: '50%',
								border: `3px solid ${COLORS.stoneLight}40`,
								borderTopColor: COLORS.terracotta,
								transform: `rotate(${spinnerRotation}deg)`,
							}}
						/>
						<span
							style={{
								fontFamily: FONTS.body,
								fontSize: 15,
								color: COLORS.stone,
							}}
						>
							Generating your look...
						</span>
					</div>
				)}

				{/* Button (before loading) */}
				{frame >= BUTTON_APPEAR && frame < BUTTON_CLICK && (
					<ShimmerButton
						text="Try It On"
						appearFrame={BUTTON_APPEAR}
						clickFrame={BUTTON_CLICK}
						accentColor={COLORS.terracotta}
					/>
				)}

				{/* Action buttons */}
				{showResult && frame >= 570 && (
					<div
						style={{
							opacity: actionsOpacity,
							transform: `translateY(${(1 - actionsSpring) * 15}px)`,
							display: 'flex',
							gap: 16,
						}}
					>
						<div
							style={{
								background: 'rgba(255,255,255,0.6)',
								border: `1px solid ${COLORS.stoneLight}40`,
								borderRadius: 12,
								padding: '12px 24px',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span style={{fontSize: 16}}>↓</span>
							<span
								style={{
									fontFamily: FONTS.body,
									fontSize: 14,
									color: COLORS.charcoal,
									fontWeight: 500,
								}}
							>
								Download
							</span>
						</div>
						<div
							style={{
								background: `linear-gradient(135deg, ${COLORS.terracotta}, ${COLORS.terracottaDark})`,
								borderRadius: 12,
								padding: '12px 24px',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span style={{fontSize: 16, color: 'white'}}>↻</span>
							<span
								style={{
									fontFamily: FONTS.body,
									fontSize: 14,
									color: 'white',
									fontWeight: 500,
								}}
							>
								Try Another
							</span>
						</div>
					</div>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
