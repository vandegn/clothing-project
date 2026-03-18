import {COLORS, FONTS} from '../constants/theme';

export const UploadZone: React.FC<{
	showPreview: boolean;
	borderColor?: string;
}> = ({showPreview, borderColor = COLORS.stoneLight}) => {
	if (showPreview) return null;

	return (
		<div
			style={{
				width: 600,
				height: 400,
				borderRadius: 24,
				border: `2px dashed ${borderColor}`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 20,
				position: 'relative',
				background: 'rgba(255,255,255,0.4)',
			}}
		>
			{/* Corner accents */}
			{[
				{top: 12, left: 12},
				{top: 12, right: 12},
				{bottom: 12, left: 12},
				{bottom: 12, right: 12},
			].map((pos, i) => (
				<div key={i} style={{position: 'absolute', ...pos}}>
					<div
						style={{
							width: 24,
							height: 24,
							borderColor: COLORS.terracotta,
							borderStyle: 'solid',
							borderWidth: 0,
							...(i === 0
								? {borderTopWidth: 2, borderLeftWidth: 2}
								: i === 1
									? {borderTopWidth: 2, borderRightWidth: 2}
									: i === 2
										? {borderBottomWidth: 2, borderLeftWidth: 2}
										: {borderBottomWidth: 2, borderRightWidth: 2}),
						}}
					/>
				</div>
			))}

			{/* Icon circle */}
			<div
				style={{
					width: 80,
					height: 80,
					borderRadius: '50%',
					background: `linear-gradient(135deg, ${COLORS.terracottaLight}60, ${COLORS.terracotta}40)`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
					<rect
						x="3"
						y="5"
						width="18"
						height="14"
						rx="2"
						stroke={COLORS.terracotta}
						strokeWidth="1.5"
					/>
					<circle cx="8.5" cy="10.5" r="1.5" fill={COLORS.terracotta} />
					<path
						d="M5 17l4-4 3 3 4-5 4 6"
						stroke={COLORS.terracotta}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>

			{/* Text */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 6,
				}}
			>
				<span
					style={{
						fontFamily: FONTS.display,
						fontSize: 24,
						color: COLORS.charcoal,
					}}
				>
					Drop your selfie here
				</span>
				<span style={{fontFamily: FONTS.body, fontSize: 14, color: COLORS.stone}}>
					or <span style={{color: COLORS.terracotta, fontWeight: 600}}>browse</span>{' '}
					to choose
				</span>
			</div>

			{/* Format badges */}
			<div style={{display: 'flex', gap: 8}}>
				{['PNG', 'JPG', 'WEBP'].map((fmt) => (
					<span
						key={fmt}
						style={{
							fontFamily: FONTS.body,
							fontSize: 11,
							color: COLORS.stone,
							background: COLORS.creamDark,
							padding: '4px 12px',
							borderRadius: 20,
							letterSpacing: 1,
						}}
					>
						{fmt}
					</span>
				))}
			</div>
		</div>
	);
};
