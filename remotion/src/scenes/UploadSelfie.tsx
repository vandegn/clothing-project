import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	Img,
	staticFile,
	Sequence,
} from 'remotion';
import {COLORS, FONTS} from '../constants/theme';
import {GradientOrbs} from '../components/GradientOrbs';
import {UploadZone} from '../components/UploadZone';
import {ShimmerButton} from '../components/ShimmerButton';

export const UploadSelfie: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Phase thresholds (relative to scene start, so frame 0 = scene start)
	const ZONE_APPEAR = 0; // frames 0-40
	const IMAGE_DROP = 120; // frames 120-180
	const TRANSFORM = 180; // frames 180-210
	const BUTTON_APPEAR = 210; // frames 210-270
	const BUTTON_CLICK = 330; // frames 330-360
	const POST_CLICK = 360; // frames 360-450
	const FADE_OUT = 450; // frames 450-480

	// Upload zone scale-in
	const zoneScale = spring({
		fps,
		frame: Math.max(0, frame - ZONE_APPEAR),
		config: {damping: 200},
	});
	const zoneOpacity = interpolate(frame, [0, 25], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Image drop
	const imageVisible = frame >= IMAGE_DROP;
	const imageSpring = spring({
		fps,
		frame: Math.max(0, frame - IMAGE_DROP),
		config: {damping: 100},
	});

	// Transform: dashed -> solid
	const transformed = frame >= TRANSFORM;
	const borderProgress = interpolate(frame - TRANSFORM, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Post-click overlay
	const postClickOpacity =
		frame >= POST_CLICK
			? interpolate(frame - POST_CLICK, [0, 20], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			: 0;

	// Post-click border pulse
	const borderPulse =
		frame >= POST_CLICK
			? interpolate(
					(frame - POST_CLICK) % 40,
					[0, 20, 40],
					[0.4, 1, 0.4],
					{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
				)
			: 0;

	// Fade out
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	const showUploadZone = !transformed;

	return (
		<AbsoluteFill style={{background: COLORS.cream, opacity: fadeOut}}>
			<GradientOrbs />

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 24,
				}}
			>
				<div
					style={{
						transform: `scale(${zoneScale})`,
						opacity: zoneOpacity,
						position: 'relative',
					}}
				>
					{/* Empty upload zone (before transform) */}
					{showUploadZone && <UploadZone showPreview={false} />}

					{/* Preview state (after transform) */}
					{transformed && (
						<div
							style={{
								width: 600,
								height: 400,
								borderRadius: 24,
								border: `2px solid ${COLORS.terracotta}${Math.round(
									(transformed ? borderProgress : 0) * 255
								)
									.toString(16)
									.padStart(2, '0')}`,
								overflow: 'hidden',
								position: 'relative',
								boxShadow:
									frame >= POST_CLICK
										? `0 0 ${20 + borderPulse * 20}px ${COLORS.terracotta}${Math.round(
												borderPulse * 80
											)
												.toString(16)
												.padStart(2, '0')}`
										: '0 8px 30px rgba(0,0,0,0.1)',
							}}
						>
							<Img
								src={staticFile('jokeselfie.png')}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>

							{/* Preview badge */}
							<div
								style={{
									position: 'absolute',
									top: 16,
									left: 16,
									background: 'rgba(255,255,255,0.9)',
									borderRadius: 20,
									padding: '6px 14px',
									fontFamily: FONTS.body,
									fontSize: 12,
									color: COLORS.charcoal,
									fontWeight: 600,
									letterSpacing: 1,
								}}
							>
								Preview
							</div>

							{/* Post-click "Analyzing..." overlay */}
							{frame >= POST_CLICK && (
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: `rgba(26,26,26,${postClickOpacity * 0.5})`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span
										style={{
											fontFamily: FONTS.display,
											fontSize: 28,
											color: 'white',
											opacity: postClickOpacity,
											letterSpacing: 2,
										}}
									>
										Analyzing...
									</span>
								</div>
							)}
						</div>
					)}

					{/* Selfie dropping in (before transform completes) */}
					{imageVisible && !transformed && (
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: `translate(-50%, ${-50 + (1 - imageSpring) * -200}%) scale(${imageSpring})`,
								width: 200,
								height: 200,
								borderRadius: 16,
								overflow: 'hidden',
								boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
							}}
						>
							<Img
								src={staticFile('jokeselfie.png')}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
						</div>
					)}
				</div>

				{/* Button */}
				{frame >= BUTTON_APPEAR && frame < POST_CLICK && (
					<ShimmerButton
						text="Analyze My Colors"
						appearFrame={BUTTON_APPEAR}
						clickFrame={BUTTON_CLICK}
					/>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
