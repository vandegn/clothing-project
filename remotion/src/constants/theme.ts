// Brand colors
export const COLORS = {
	cream: '#FAF7F2',
	creamDark: '#F0EBE3',
	charcoal: '#1A1A1A',
	charcoalSoft: '#2D2D2D',
	stone: '#8B8178',
	stoneLight: '#B5ADA3',
	terracotta: '#C4775A',
	terracottaDark: '#A85D42',
	terracottaLight: '#E8A88C',
	sage: '#8B9A7E',
	blush: '#D4A5A5',
} as const;

// Spring season accent
export const SPRING_ACCENT = '#D97706';

// Spring season gradient colors
export const SPRING_GRADIENT = ['#FFFBEB', '#FEF3C7', '#FDE68A', '#A7F3D0'] as const;

// Extracted color data for results scene
export const EXTRACTED_COLORS = [
	{label: 'Eyes', color: '#8B6914'},
	{label: 'Hair', color: '#3D2B1F'},
	{label: 'Skin', color: '#D4A574'},
] as const;

// 16-color Spring palette
export const PALETTE_COLORS = [
	{name: 'Soft Sand', hex: '#F5E6CC'},
	{name: 'Warm Honey', hex: '#E8C89C'},
	{name: 'Golden Tan', hex: '#D4A574'},
	{name: 'Terracotta', hex: '#C4775A'},
	{name: 'Amber', hex: '#D97706'},
	{name: 'Dark Gold', hex: '#B8860B'},
	{name: 'Goldenrod', hex: '#DAA520'},
	{name: 'Sunshine', hex: '#F0C040'},
	{name: 'Soft Sage', hex: '#A7C796'},
	{name: 'Sage', hex: '#8B9A7E'},
	{name: 'Forest', hex: '#6B8E5A'},
	{name: 'Sky Blue', hex: '#87CEEB'},
	{name: 'Peach', hex: '#E8A88C'},
	{name: 'Blush', hex: '#F4C2C2'},
	{name: 'Bisque', hex: '#FFE4B5'},
	{name: 'Cream', hex: '#FFFDD0'},
] as const;

// Analysis loading steps
export const ANALYSIS_STEPS = [
	'Detecting facial features',
	'Extracting eye color',
	'Analyzing skin tone',
	'Determining your season',
] as const;

// Typography
export const FONTS = {
	display: 'Georgia, serif',
	body: 'system-ui, -apple-system, sans-serif',
	mono: '"Courier New", monospace',
} as const;

// Scene frame ranges (at 60fps)
export const SCENES = {
	hero: {from: 0, duration: 240},
	upload: {from: 240, duration: 480},
	loading: {from: 720, duration: 300},
	results: {from: 1020, duration: 900},
	tryOn: {from: 1920, duration: 720},
	outro: {from: 2640, duration: 360},
} as const;

// Common spring configs
export const SPRING_CONFIG = {
	smooth: {damping: 200},
	lively: {damping: 100},
} as const;
