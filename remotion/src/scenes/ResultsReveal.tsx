import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	Sequence,
} from 'remotion';
import {
	COLORS,
	FONTS,
	SPRING_ACCENT,
	SPRING_GRADIENT,
	EXTRACTED_COLORS,
} from '../constants/theme';
import {SectionHeader} from '../components/SectionHeader';
import {ColorCircle} from '../components/ColorCircle';
import {ColorSwatchGrid} from '../components/ColorSwatchGrid';

// Part A: Season Card (frames 0-300 within this scene)
const SeasonCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Card slide up
	const cardSpring = spring({
		fps,
		frame,
		config: {damping: 100},
	});

	// Badge fade (frame 60)
	const badgeOpacity = interpolate(frame - 60, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// "Spring" text spring (frame 90)
	const titleSpring = spring({
		fps,
		frame: Math.max(0, frame - 90),
		config: {damping: 100},
	});
	const titleOpacity = interpolate(frame - 90, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Color bar wipe (frame 150)
	const barWidth = interpolate(frame - 150, [0, 30], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Trait badges (frame 190)
	const trait1Opacity = interpolate(frame - 190, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const trait1Spring = spring({
		fps,
		frame: Math.max(0, frame - 190),
		config: {damping: 200},
	});
	const trait2Opacity = interpolate(frame - 210, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const trait2Spring = spring({
		fps,
		frame: Math.max(0, frame - 210),
		config: {damping: 200},
	});

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					width: 1600,
					height: 400,
					borderRadius: 24,
					background: `linear-gradient(135deg, ${SPRING_GRADIENT[0]}, ${SPRING_GRADIENT[1]}, ${SPRING_GRADIENT[2]}, ${SPRING_GRADIENT[3]})`,
					transform: `translateY(${(1 - cardSpring) * 200}px)`,
					opacity: cardSpring,
					display: 'flex',
					padding: '50px 80px',
					position: 'relative',
					overflow: 'hidden',
					boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
				}}
			>
				{/* Decorative circles */}
				<div
					style={{
						position: 'absolute',
						top: -60,
						right: -40,
						width: 200,
						height: 200,
						borderRadius: '50%',
						background: `${SPRING_GRADIENT[2]}50`,
						filter: 'blur(30px)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						bottom: -80,
						left: '30%',
						width: 250,
						height: 250,
						borderRadius: '50%',
						background: `${SPRING_GRADIENT[3]}40`,
						filter: 'blur(40px)',
					}}
				/>

				{/* Left side */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						gap: 16,
						zIndex: 1,
					}}
				>
					{/* Badge */}
					<div
						style={{
							opacity: badgeOpacity,
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							background: 'rgba(255,255,255,0.6)',
							borderRadius: 20,
							padding: '6px 16px',
							alignSelf: 'flex-start',
						}}
					>
						<div
							style={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								background: SPRING_ACCENT,
							}}
						/>
						<span
							style={{
								fontFamily: FONTS.body,
								fontSize: 13,
								color: COLORS.charcoal,
								fontWeight: 600,
								letterSpacing: 1,
								textTransform: 'uppercase',
							}}
						>
							Your Season
						</span>
					</div>

					{/* Season name */}
					<span
						style={{
							fontFamily: FONTS.display,
							fontSize: 80,
							color: SPRING_ACCENT,
							fontWeight: 700,
							opacity: titleOpacity,
							transform: `translateY(${(1 - titleSpring) * 20}px)`,
							lineHeight: 1,
						}}
					>
						Spring
					</span>

					{/* Color bar */}
					<div
						style={{
							display: 'flex',
							gap: 4,
							overflow: 'hidden',
							width: `${barWidth}%`,
							maxWidth: 200,
						}}
					>
						{SPRING_GRADIENT.map((color, i) => (
							<div
								key={i}
								style={{
									flex: 1,
									height: 8,
									borderRadius: 4,
									background: color,
								}}
							/>
						))}
					</div>
				</div>

				{/* Right side */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						gap: 20,
						zIndex: 1,
					}}
				>
					<p
						style={{
							fontFamily: FONTS.body,
							fontSize: 17,
							color: COLORS.charcoalSoft,
							lineHeight: 1.6,
							opacity: badgeOpacity,
							margin: 0,
						}}
					>
						Your warm undertones and medium contrast create a natural
						harmony with golden, coral, and fresh green hues. These colors
						will make your complexion glow.
					</p>

					{/* Trait badges */}
					<div style={{display: 'flex', gap: 12}}>
						<div
							style={{
								opacity: trait1Opacity,
								transform: `scale(${trait1Spring})`,
								background: 'rgba(255,255,255,0.7)',
								borderRadius: 12,
								padding: '10px 18px',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span style={{fontSize: 18}}>☀</span>
							<span
								style={{
									fontFamily: FONTS.body,
									fontSize: 14,
									color: COLORS.charcoal,
									fontWeight: 600,
								}}
							>
								Warm Undertone
							</span>
						</div>
						<div
							style={{
								opacity: trait2Opacity,
								transform: `scale(${trait2Spring})`,
								background: 'rgba(255,255,255,0.7)',
								borderRadius: 12,
								padding: '10px 18px',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span style={{fontSize: 18}}>◐</span>
							<span
								style={{
									fontFamily: FONTS.body,
									fontSize: 14,
									color: COLORS.charcoal,
									fontWeight: 600,
								}}
							>
								Medium Contrast
							</span>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Part B: Extracted Colors (frames 300-540)
const ExtractedColors: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 50,
			}}
		>
			<SectionHeader
				eyebrow="COLOR ANALYSIS"
				title="Your Natural Colors"
				startFrame={0}
			/>

			<div
				style={{
					display: 'flex',
					gap: 120,
					alignItems: 'center',
				}}
			>
				{EXTRACTED_COLORS.map((item, i) => (
					<ColorCircle
						key={i}
						color={item.color}
						label={item.label}
						hex={item.color}
						appearFrame={30 + i * 15}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};

// Part C: Palette Grid (frames 540-900)
const PaletteGrid: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	// Fade out last 30 frames of entire results scene
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 30, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 40,
				opacity: fadeOut,
			}}
		>
			<SectionHeader eyebrow="YOUR PALETTE" title="Spring Colors" startFrame={0} />
			<ColorSwatchGrid startFrame={30} />
		</AbsoluteFill>
	);
};

// Main Results scene
export const ResultsReveal: React.FC = () => {
	return (
		<AbsoluteFill style={{background: COLORS.cream}}>
			{/* Part A: Season Card — frames 0-300 */}
			<Sequence from={0} durationInFrames={300}>
				<SeasonCard />
			</Sequence>

			{/* Part B: Extracted Colors — frames 300-540 */}
			<Sequence from={300} durationInFrames={240}>
				<ExtractedColors />
			</Sequence>

			{/* Part C: Palette Grid — frames 540-900 */}
			<Sequence from={540} durationInFrames={360}>
				<PaletteGrid />
			</Sequence>
		</AbsoluteFill>
	);
};
