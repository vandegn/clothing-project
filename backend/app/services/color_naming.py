from typing import Tuple
import math


class ColorNamer:
    """
    Maps hex color codes to human-readable color names.
    Used for searching products by color keywords.
    """

    # Extended color dictionary for fashion/clothing searches
    COLOR_DATABASE = {
        # Reds
        (255, 0, 0): "Red",
        (220, 20, 60): "Crimson",
        (178, 34, 34): "Firebrick",
        (139, 0, 0): "Dark Red",
        (205, 92, 92): "Indian Red",
        (240, 128, 128): "Light Coral",
        (250, 128, 114): "Salmon",
        (233, 150, 122): "Dark Salmon",
        (255, 99, 71): "Tomato",
        (255, 127, 80): "Coral",
        (128, 0, 32): "Burgundy",
        (225, 17, 95): "Ruby",

        # Oranges
        (255, 165, 0): "Orange",
        (255, 140, 0): "Dark Orange",
        (255, 69, 0): "Red Orange",
        (204, 85, 0): "Burnt Orange",
        (255, 140, 66): "Tangerine",

        # Yellows
        (255, 255, 0): "Yellow",
        (255, 215, 0): "Gold",
        (255, 223, 0): "Golden Yellow",
        (218, 165, 32): "Goldenrod",
        (184, 134, 11): "Dark Goldenrod",
        (240, 230, 140): "Khaki",
        (189, 183, 107): "Dark Khaki",
        (238, 232, 170): "Pale Goldenrod",
        (255, 250, 205): "Lemon Chiffon",
        (250, 250, 210): "Light Yellow",

        # Greens
        (0, 128, 0): "Green",
        (0, 100, 0): "Dark Green",
        (34, 139, 34): "Forest Green",
        (50, 205, 50): "Lime Green",
        (144, 238, 144): "Light Green",
        (152, 251, 152): "Pale Green",
        (0, 255, 127): "Spring Green",
        (60, 179, 113): "Medium Sea Green",
        (46, 139, 87): "Sea Green",
        (128, 128, 0): "Olive",
        (85, 107, 47): "Dark Olive",
        (107, 142, 35): "Olive Drab",
        (143, 188, 143): "Dark Sea Green",
        (102, 205, 170): "Medium Aquamarine",
        (32, 178, 170): "Light Sea Green",
        (0, 139, 139): "Teal",
        (152, 216, 170): "Sage",
        (168, 230, 207): "Mint",

        # Blues
        (0, 0, 255): "Blue",
        (0, 0, 139): "Dark Blue",
        (0, 0, 128): "Navy",
        (25, 25, 112): "Midnight Blue",
        (65, 105, 225): "Royal Blue",
        (100, 149, 237): "Cornflower Blue",
        (70, 130, 180): "Steel Blue",
        (30, 144, 255): "Dodger Blue",
        (0, 191, 255): "Deep Sky Blue",
        (135, 206, 235): "Sky Blue",
        (135, 206, 250): "Light Sky Blue",
        (173, 216, 230): "Light Blue",
        (176, 224, 230): "Powder Blue",
        (175, 238, 238): "Pale Turquoise",
        (0, 206, 209): "Turquoise",
        (64, 224, 208): "Medium Turquoise",
        (127, 255, 212): "Aquamarine",
        (0, 71, 171): "Cobalt",
        (72, 61, 139): "Dark Slate Blue",
        (106, 90, 205): "Slate Blue",

        # Purples
        (128, 0, 128): "Purple",
        (75, 0, 130): "Indigo",
        (139, 0, 139): "Dark Magenta",
        (148, 0, 211): "Dark Violet",
        (138, 43, 226): "Blue Violet",
        (153, 50, 204): "Dark Orchid",
        (186, 85, 211): "Medium Orchid",
        (218, 112, 214): "Orchid",
        (238, 130, 238): "Violet",
        (221, 160, 221): "Plum",
        (216, 191, 216): "Thistle",
        (230, 230, 250): "Lavender",
        (199, 21, 133): "Medium Violet Red",
        (219, 112, 147): "Pale Violet Red",
        (255, 20, 147): "Deep Pink",
        (255, 105, 180): "Hot Pink",
        (255, 182, 193): "Light Pink",
        (255, 192, 203): "Pink",
        (201, 177, 255): "Soft Lavender",

        # Browns
        (139, 69, 19): "Saddle Brown",
        (160, 82, 45): "Sienna",
        (210, 105, 30): "Chocolate",
        (205, 133, 63): "Peru",
        (244, 164, 96): "Sandy Brown",
        (222, 184, 135): "Burlywood",
        (210, 180, 140): "Tan",
        (188, 143, 143): "Rosy Brown",
        (193, 154, 107): "Camel",
        (245, 222, 179): "Wheat",
        (255, 228, 196): "Bisque",
        (255, 235, 205): "Blanched Almond",
        (250, 235, 215): "Antique White",
        (139, 90, 43): "Brown",

        # Grays
        (128, 128, 128): "Gray",
        (169, 169, 169): "Dark Gray",
        (192, 192, 192): "Silver",
        (211, 211, 211): "Light Gray",
        (220, 220, 220): "Gainsboro",
        (245, 245, 245): "White Smoke",
        (112, 128, 144): "Slate Gray",
        (119, 136, 153): "Light Slate Gray",
        (47, 79, 79): "Dark Slate Gray",
        (105, 105, 105): "Dim Gray",
        (54, 69, 79): "Charcoal",

        # Black and White
        (0, 0, 0): "Black",
        (255, 255, 255): "White",
        (255, 250, 250): "Snow",
        (245, 245, 220): "Beige",
        (255, 255, 240): "Ivory",
        (250, 240, 230): "Linen",
        (253, 245, 230): "Old Lace",
        (245, 240, 230): "Off White",
        (255, 248, 220): "Cornsilk",
        (255, 245, 238): "Seashell",
    }

    def hex_to_name(self, hex_color: str) -> str:
        """
        Convert a hex color to the closest named color.

        Args:
            hex_color: Hex color code (e.g., "#FF5733")

        Returns:
            Human-readable color name
        """
        rgb = self._hex_to_rgb(hex_color)
        return self._find_closest_color(rgb)

    def _hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex to RGB tuple."""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def _find_closest_color(self, rgb: Tuple[int, int, int]) -> str:
        """Find the closest named color using Euclidean distance."""
        min_distance = float('inf')
        closest_name = "Unknown"

        for color_rgb, name in self.COLOR_DATABASE.items():
            distance = self._color_distance(rgb, color_rgb)
            if distance < min_distance:
                min_distance = distance
                closest_name = name

        return closest_name

    def _color_distance(self, c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> float:
        """
        Calculate perceptual color distance using weighted Euclidean distance.
        Human eyes are more sensitive to green, so we weight accordingly.
        """
        r1, g1, b1 = c1
        r2, g2, b2 = c2

        # Weighted distance (approximation of perceptual difference)
        r_mean = (r1 + r2) / 2
        dr = r1 - r2
        dg = g1 - g2
        db = b1 - b2

        # Weighted formula for better perceptual matching
        return math.sqrt(
            (2 + r_mean / 256) * dr ** 2 +
            4 * dg ** 2 +
            (2 + (255 - r_mean) / 256) * db ** 2
        )
