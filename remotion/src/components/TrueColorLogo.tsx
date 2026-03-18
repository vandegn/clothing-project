import {COLORS, FONTS} from '../constants/theme';

export const TrueColorLogo: React.FC<{scale?: number}> = ({scale = 1}) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16 * scale,
				transform: `scale(${scale})`,
			}}
		>
			{/* Circular gradient icon */}
			<div
				style={{
					width: 56,
					height: 56,
					borderRadius: '50%',
					background: `linear-gradient(135deg, ${COLORS.terracotta}, ${COLORS.terracottaDark})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: `0 4px 20px ${COLORS.terracotta}40`,
				}}
			>
				<span
					style={{
						fontFamily: FONTS.display,
						fontSize: 28,
						color: 'white',
						fontWeight: 600,
					}}
				>
					C
				</span>
			</div>
			{/* Text */}
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<span
					style={{
						fontFamily: FONTS.display,
						fontSize: 24,
						color: COLORS.charcoal,
						fontWeight: 600,
						letterSpacing: 1,
					}}
				>
					TrueColor
				</span>
				<span
					style={{
						fontFamily: FONTS.body,
						fontSize: 11,
						color: COLORS.stone,
						letterSpacing: 2,
						textTransform: 'uppercase',
					}}
				>
					Color Analysis
				</span>
			</div>
		</div>
	);
};
