import cv2
import numpy as np
from typing import Dict, List, Tuple
from sklearn.cluster import KMeans
from app.models.schemas import ExtractedColors


class ColorExtractor:
    """
    Extracts dominant colors from facial regions using OpenCV and K-means clustering.
    """

    def __init__(self, n_clusters: int = 3):
        """
        Initialize the color extractor.

        Args:
            n_clusters: Number of color clusters for K-means (default 3 to find dominant color)
        """
        self.n_clusters = n_clusters

    def extract_colors(self, image: np.ndarray, landmarks: Dict) -> ExtractedColors:
        """
        Extract eye, hair, and skin colors from the image using landmarks.

        Args:
            image: RGB numpy array of the image
            landmarks: Dictionary of landmark coordinates from FaceAnalyzer

        Returns:
            ExtractedColors with hex codes for eyes, hair, and skin
        """
        # Extract eye color (average of both irises)
        eye_color = self._extract_eye_color(image, landmarks)

        # Extract skin color (from cheeks and forehead)
        skin_color = self._extract_skin_color(image, landmarks)

        # Extract hair color (from region above forehead)
        hair_color = self._extract_hair_color(image, landmarks)

        return ExtractedColors(
            eyes=self._rgb_to_hex(eye_color),
            hair=self._rgb_to_hex(hair_color),
            skin=self._rgb_to_hex(skin_color)
        )

    def _extract_eye_color(self, image: np.ndarray, landmarks: Dict) -> Tuple[int, int, int]:
        """Extract dominant eye color from iris regions."""
        # Combine both iris regions
        left_iris = landmarks.get("left_eye_iris", [])
        right_iris = landmarks.get("right_eye_iris", [])

        # Get pixels from iris regions
        pixels = []
        for coords in [left_iris, right_iris]:
            if coords:
                region_pixels = self._get_region_pixels(image, coords, expand=2)
                pixels.extend(region_pixels)

        if not pixels:
            # Fallback: use eye outline if iris not detected
            left_outline = landmarks.get("left_eye_outline", [])
            right_outline = landmarks.get("right_eye_outline", [])
            for coords in [left_outline, right_outline]:
                if coords:
                    region_pixels = self._get_region_pixels(image, coords, expand=0)
                    pixels.extend(region_pixels)

        if not pixels:
            return (100, 80, 60)  # Default brown if no eye detected

        return self._get_dominant_color(np.array(pixels))

    def _extract_skin_color(self, image: np.ndarray, landmarks: Dict) -> Tuple[int, int, int]:
        """Extract dominant skin color from cheeks and forehead."""
        pixels = []

        # Get pixels from cheek and forehead regions
        for region in ["left_cheek", "right_cheek", "forehead"]:
            coords = landmarks.get(region, [])
            if coords:
                region_pixels = self._get_region_pixels(image, coords, expand=5)
                pixels.extend(region_pixels)

        if not pixels:
            return (200, 160, 140)  # Default skin tone

        return self._get_dominant_color(np.array(pixels))

    def _extract_hair_color(self, image: np.ndarray, landmarks: Dict) -> Tuple[int, int, int]:
        """
        Extract hair color from the region above the forehead.
        Hair detection is tricky - we sample from above the top of the face mesh.
        """
        top_head = landmarks.get("top_head", [])
        w, h = landmarks.get("image_dimensions", (image.shape[1], image.shape[0]))

        if not top_head:
            return (60, 40, 30)  # Default dark brown

        # Find the topmost points of the face
        top_y = min(coord[1] for coord in top_head)

        # Sample from above the face (hair region)
        # We'll sample a band above the forehead
        hair_band_top = max(0, top_y - 80)
        hair_band_bottom = max(0, top_y - 10)

        # Get the x-range from top_head landmarks
        x_coords = [coord[0] for coord in top_head]
        x_min = max(0, min(x_coords) + 20)
        x_max = min(w, max(x_coords) - 20)

        if hair_band_top >= hair_band_bottom or x_min >= x_max:
            return (60, 40, 30)  # Default

        # Sample pixels from the hair region
        hair_region = image[hair_band_top:hair_band_bottom, x_min:x_max]

        if hair_region.size == 0:
            return (60, 40, 30)  # Default

        pixels = hair_region.reshape(-1, 3)

        # Filter out very bright pixels (likely background/highlights)
        brightness = np.mean(pixels, axis=1)
        mask = brightness < 240
        pixels = pixels[mask]

        if len(pixels) < 10:
            return (60, 40, 30)  # Default

        return self._get_dominant_color(pixels)

    def _get_region_pixels(self, image: np.ndarray, coords: List[Tuple[int, int]],
                           expand: int = 0) -> List[np.ndarray]:
        """
        Get pixels from a region defined by coordinates.

        Args:
            image: The image array
            coords: List of (x, y) coordinate tuples
            expand: Number of pixels to expand around each coordinate

        Returns:
            List of RGB pixel values
        """
        h, w = image.shape[:2]
        pixels = []

        for x, y in coords:
            for dx in range(-expand, expand + 1):
                for dy in range(-expand, expand + 1):
                    px, py = x + dx, y + dy
                    if 0 <= px < w and 0 <= py < h:
                        pixels.append(image[py, px])

        return pixels

    def _get_dominant_color(self, pixels: np.ndarray) -> Tuple[int, int, int]:
        """
        Use K-means clustering to find the dominant color.

        Args:
            pixels: Array of RGB pixel values

        Returns:
            Dominant color as (R, G, B) tuple
        """
        if len(pixels) < self.n_clusters:
            # Not enough pixels, return average
            avg = np.mean(pixels, axis=0)
            return tuple(int(c) for c in avg)

        # Perform K-means clustering
        kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        kmeans.fit(pixels)

        # Find the most common cluster (dominant color)
        labels, counts = np.unique(kmeans.labels_, return_counts=True)
        dominant_idx = labels[np.argmax(counts)]
        dominant_color = kmeans.cluster_centers_[dominant_idx]

        return tuple(int(c) for c in dominant_color)

    def _rgb_to_hex(self, rgb: Tuple[int, int, int]) -> str:
        """Convert RGB tuple to hex color code."""
        return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2])
