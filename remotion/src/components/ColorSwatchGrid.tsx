import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {PALETTE_COLORS, COLORS, FONTS} from '../constants/theme';

export const ColorSwatchGrid: React.FC<{
	startFrame: number;
}> = ({startFrame}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(8, 1fr)',
				gap: 10,
				width: 720,
			}}
		>
			{PALETTE_COLORS.map((swatch, i) => {
				const swatchAppear = startFrame + i * 4;
				const scale = spring({
					fps,
					frame: Math.max(0, frame - swatchAppear),
					config: {damping: 200},
				});

				// Subtle scale-lift for swatches 2, 7, 11 to show interactivity
				const isHighlighted = [2, 7, 11].includes(i);
				const liftFrame = startFrame + 16 * 4 + 80; // after all appear + settle
				let lift = 1;
				if (isHighlighted && frame > liftFrame) {
					const liftProgress = frame - liftFrame;
					lift = interpolate(
						liftProgress,
						[0, 20, 40, 60],
						[1, 1.08, 1, 1],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}
					);
				}

				if (frame < swatchAppear) return <div key={i} />;

				return (
					<div
						key={i}
						style={{
							transform: `scale(${scale * lift})`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 6,
						}}
					>
						<div
							style={{
								width: '100%',
								aspectRatio: '1',
								borderRadius: 16,
								background: swatch.hex,
								boxShadow: `0 2px 12px rgba(0,0,0,0.08)`,
								border:
									swatch.hex === '#FFFDD0' || swatch.hex === '#FFE4B5'
										? `1px solid ${COLORS.stoneLight}30`
										: 'none',
							}}
						/>
						<span
							style={{
								fontFamily: FONTS.body,
								fontSize: 10,
								color: COLORS.stone,
								textAlign: 'center',
								whiteSpace: 'nowrap',
							}}
						>
							{swatch.name}
						</span>
					</div>
				);
			})}
		</div>
	);
};
