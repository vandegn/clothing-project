from typing import List
from app.models.schemas import ColorPalette


class PaletteGenerator:
    """
    Generates a 16-color palette based on seasonal color analysis.
    Each season has carefully curated colors that complement that color type.
    """

    # Seasonal color palettes with hex codes and names
    # These are based on traditional color theory and fashion color analysis

    PALETTES = {
        "spring": [
            {"hex": "#FF6B6B", "name": "Coral"},
            {"hex": "#FFA07A", "name": "Light Salmon"},
            {"hex": "#FFD93D", "name": "Bright Yellow"},
            {"hex": "#98D8AA", "name": "Spring Green"},
            {"hex": "#6BCB77", "name": "Grass Green"},
            {"hex": "#4ECDC4", "name": "Turquoise"},
            {"hex": "#45B7D1", "name": "Sky Blue"},
            {"hex": "#96CEB4", "name": "Sage"},
            {"hex": "#FFEAA7", "name": "Cream Yellow"},
            {"hex": "#DDA0DD", "name": "Plum"},
            {"hex": "#F8B500", "name": "Golden Yellow"},
            {"hex": "#FF8C42", "name": "Tangerine"},
            {"hex": "#E8D5B7", "name": "Warm Beige"},
            {"hex": "#A8E6CF", "name": "Mint"},
            {"hex": "#FDCB82", "name": "Peach"},
            {"hex": "#F5F5DC", "name": "Ivory"}
        ],
        "summer": [
            {"hex": "#B8C5D6", "name": "Dusty Blue"},
            {"hex": "#D4A5A5", "name": "Dusty Rose"},
            {"hex": "#9DC8C8", "name": "Seafoam"},
            {"hex": "#C9B1FF", "name": "Lavender"},
            {"hex": "#A8D8EA", "name": "Powder Blue"},
            {"hex": "#E8D5E0", "name": "Mauve"},
            {"hex": "#B5EAD7", "name": "Soft Mint"},
            {"hex": "#C7CEEA", "name": "Periwinkle"},
            {"hex": "#E2D1F9", "name": "Soft Lilac"},
            {"hex": "#98AFC7", "name": "Steel Blue"},
            {"hex": "#D5C4A1", "name": "Soft Taupe"},
            {"hex": "#9CAFB7", "name": "Slate Gray"},
            {"hex": "#E6C4C0", "name": "Blush"},
            {"hex": "#B2BEB5", "name": "Sage Gray"},
            {"hex": "#C4C4C4", "name": "Silver"},
            {"hex": "#F5F0E6", "name": "Off White"}
        ],
        "autumn": [
            {"hex": "#8B4513", "name": "Saddle Brown"},
            {"hex": "#CD853F", "name": "Peru"},
            {"hex": "#D2691E", "name": "Chocolate"},
            {"hex": "#B8860B", "name": "Dark Goldenrod"},
            {"hex": "#808000", "name": "Olive"},
            {"hex": "#556B2F", "name": "Dark Olive Green"},
            {"hex": "#8FBC8F", "name": "Dark Sea Green"},
            {"hex": "#BC8F8F", "name": "Rosy Brown"},
            {"hex": "#CD5C5C", "name": "Indian Red"},
            {"hex": "#A0522D", "name": "Sienna"},
            {"hex": "#D2B48C", "name": "Tan"},
            {"hex": "#DAA520", "name": "Goldenrod"},
            {"hex": "#BDB76B", "name": "Dark Khaki"},
            {"hex": "#C19A6B", "name": "Camel"},
            {"hex": "#CC5500", "name": "Burnt Orange"},
            {"hex": "#F5DEB3", "name": "Wheat"}
        ],
        "winter": [
            {"hex": "#000080", "name": "Navy"},
            {"hex": "#800020", "name": "Burgundy"},
            {"hex": "#228B22", "name": "Forest Green"},
            {"hex": "#4B0082", "name": "Indigo"},
            {"hex": "#DC143C", "name": "Crimson"},
            {"hex": "#191970", "name": "Midnight Blue"},
            {"hex": "#8B008B", "name": "Dark Magenta"},
            {"hex": "#006400", "name": "Dark Green"},
            {"hex": "#2F4F4F", "name": "Dark Slate Gray"},
            {"hex": "#483D8B", "name": "Dark Slate Blue"},
            {"hex": "#FFFFFF", "name": "Pure White"},
            {"hex": "#000000", "name": "Black"},
            {"hex": "#708090", "name": "Slate Gray"},
            {"hex": "#C0C0C0", "name": "Silver"},
            {"hex": "#E0115F", "name": "Ruby"},
            {"hex": "#0047AB", "name": "Cobalt Blue"}
        ]
    }

    def generate(self, season: str) -> List[ColorPalette]:
        """
        Generate a 16-color palette for the given season.

        Args:
            season: One of 'spring', 'summer', 'autumn', 'winter'

        Returns:
            List of 16 ColorPalette objects
        """
        season = season.lower()
        if season not in self.PALETTES:
            season = "winter"  # Default fallback

        palette_data = self.PALETTES[season]

        return [
            ColorPalette(hex=color["hex"], name=color["name"])
            for color in palette_data
        ]

    def get_palette_categories(self, season: str) -> dict:
        """
        Get palette organized by clothing categories.
        Useful for organizing product searches.

        Returns colors grouped by:
        - tops (8 colors)
        - bottoms (4 colors)
        - accessories (4 colors)
        """
        palette = self.generate(season)

        return {
            "tops": palette[:8],
            "bottoms": palette[8:12],
            "accessories": palette[12:16]
        }
