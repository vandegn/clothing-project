from typing import Dict, Tuple
from app.models.schemas import ExtractedColors


class ColorTheoryAnalyzer:
    """
    Analyzes extracted colors to determine seasonal color type based on color theory.

    The four seasons are determined by:
    - Undertone: Warm (Spring, Autumn) vs Cool (Summer, Winter)
    - Contrast: Low-Medium (Spring, Summer) vs Medium-High (Autumn, Winter)
    """

    SEASON_DESCRIPTIONS = {
        "spring": "Your coloring is warm and light with a clear, bright quality. You look best in warm, clear colors that have a fresh, vibrant feel.",
        "summer": "Your coloring is cool and soft with a muted quality. You look best in cool, soft colors that have a gentle, dusty feel.",
        "autumn": "Your coloring is warm and deep with a muted quality. You look best in warm, rich colors that have an earthy, golden feel.",
        "winter": "Your coloring is cool and deep with a clear, bold quality. You look best in cool, vivid colors that have a sharp, dramatic feel."
    }

    def analyze(self, colors: ExtractedColors) -> Dict:
        """
        Analyze colors to determine seasonal type.

        Args:
            colors: ExtractedColors containing eye, hair, and skin hex codes

        Returns:
            Dictionary with season, undertone, contrast, and description
        """
        # Convert hex to RGB
        skin_rgb = self._hex_to_rgb(colors.skin)
        hair_rgb = self._hex_to_rgb(colors.hair)
        eye_rgb = self._hex_to_rgb(colors.eyes)

        # Determine undertone (warm vs cool)
        undertone = self._determine_undertone(skin_rgb)

        # Calculate contrast level
        contrast = self._calculate_contrast(skin_rgb, hair_rgb, eye_rgb)

        # Determine season based on undertone and contrast
        season = self._determine_season(undertone, contrast)

        return {
            "season": season,
            "undertone": undertone,
            "contrast": contrast,
            "description": self.SEASON_DESCRIPTIONS[season]
        }

    def _hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB tuple."""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def _determine_undertone(self, skin_rgb: Tuple[int, int, int]) -> str:
        """
        Determine if skin has warm or cool undertone.

        Warm undertones have more yellow/golden hues (higher red, lower blue).
        Cool undertones have more pink/blue hues (higher blue relative to red).
        """
        r, g, b = skin_rgb

        # Calculate warmth score
        # Warm skin: R > B, with yellow undertone (R + G > 2*B)
        # Cool skin: B relatively higher, with pink/blue undertone

        # Method: Compare red-blue channel difference relative to skin brightness
        brightness = (r + g + b) / 3

        # Normalize to brightness
        if brightness > 0:
            warmth_ratio = (r - b) / brightness
        else:
            warmth_ratio = 0

        # Also consider the green channel (more green = warmer/olive)
        green_influence = (g - (r + b) / 2) / 255 * 0.3

        warmth_score = warmth_ratio + green_influence

        # Threshold for warm vs cool
        return "warm" if warmth_score > 0.15 else "cool"

    def _calculate_contrast(self, skin_rgb: Tuple[int, int, int],
                           hair_rgb: Tuple[int, int, int],
                           eye_rgb: Tuple[int, int, int]) -> str:
        """
        Calculate the contrast level between skin, hair, and eyes.

        High contrast: Large difference between lightest and darkest features
        Low contrast: Features are similar in value/brightness
        """
        # Calculate luminance for each
        def luminance(rgb):
            r, g, b = rgb
            return 0.299 * r + 0.587 * g + 0.114 * b

        skin_lum = luminance(skin_rgb)
        hair_lum = luminance(hair_rgb)
        eye_lum = luminance(eye_rgb)

        # Find the range
        lum_values = [skin_lum, hair_lum, eye_lum]
        lum_range = max(lum_values) - min(lum_values)

        # Normalize to 0-1 scale
        contrast_score = lum_range / 255

        # Categorize contrast level
        if contrast_score > 0.45:
            return "high"
        elif contrast_score > 0.25:
            return "medium"
        else:
            return "low"

    def _determine_season(self, undertone: str, contrast: str) -> str:
        """
        Determine season based on undertone and contrast.

        Spring: Warm + Low/Medium contrast
        Summer: Cool + Low/Medium contrast
        Autumn: Warm + Medium/High contrast
        Winter: Cool + Medium/High contrast
        """
        if undertone == "warm":
            if contrast == "high":
                return "autumn"
            elif contrast == "low":
                return "spring"
            else:  # medium
                # Medium contrast warm can go either way
                # Default to autumn for richer palette
                return "autumn"
        else:  # cool
            if contrast == "high":
                return "winter"
            elif contrast == "low":
                return "summer"
            else:  # medium
                # Medium contrast cool can go either way
                # Default to winter for bolder palette
                return "winter"
