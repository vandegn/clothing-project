import cv2
import numpy as np
from typing import Dict, List, Tuple, Optional
from sklearn.cluster import KMeans
from app.models.schemas import ExtractedColors, SamplePoint, DebugInfo


class ColorExtractor:
    """
    Extracts dominant colors from facial regions using OpenCV and K-means clustering.

    Uses segmentation masks for hair and skin when available, falls back to
    landmark-based extraction otherwise. Eye color always uses Face Mesh landmarks.
    """

    def __init__(self, n_clusters: int = 3):
        """
        Initialize the color extractor.

        Args:
            n_clusters: Number of color clusters for K-means (default 3 to find dominant color)
        """
        self.n_clusters = n_clusters
        self._sample_points: List[SamplePoint] = []

    def extract_colors(
        self,
        image: np.ndarray,
        landmarks: Dict,
        segmentation: Optional[Dict] = None
    ) -> Tuple[ExtractedColors, DebugInfo]:
        """
        Extract eye, hair, and skin colors from the image.

        Args:
            image: RGB numpy array of the image
            landmarks: Dictionary of landmark coordinates from FaceAnalyzer
            segmentation: Optional dictionary with hair_mask and face_skin_mask from ImageSegmenter

        Returns:
            Tuple of (ExtractedColors with hex codes, DebugInfo with sample points)
        """
        self._sample_points = []
        h, w = image.shape[:2]

        # Extract eye color (always uses Face Mesh landmarks - most accurate for irises)
        eye_color, eye_point = self._extract_eye_color(image, landmarks)
        if eye_point:
            self._sample_points.append(SamplePoint(x=eye_point[0], y=eye_point[1], label="eyes"))

        # Extract skin color (prefer segmentation mask over landmarks)
        if segmentation and segmentation.get("face_skin_mask") is not None:
            skin_color, skin_point = self._extract_skin_color_from_mask(
                image, segmentation["face_skin_mask"]
            )
            # Fall back to landmarks if mask extraction failed
            if skin_color is None:
                skin_color, skin_point = self._extract_skin_color_from_landmarks(image, landmarks)
        else:
            skin_color, skin_point = self._extract_skin_color_from_landmarks(image, landmarks)

        if skin_point:
            self._sample_points.append(SamplePoint(x=skin_point[0], y=skin_point[1], label="skin"))

        # Extract hair color (prefer segmentation mask over heuristic)
        if segmentation and segmentation.get("hair_mask") is not None:
            hair_color, hair_point = self._extract_hair_color_from_mask(
                image, segmentation["hair_mask"]
            )
            # Fall back to heuristic if mask extraction failed (e.g., bald)
            if hair_color is None:
                hair_color, hair_point = self._extract_hair_color_from_landmarks(image, landmarks)
        else:
            hair_color, hair_point = self._extract_hair_color_from_landmarks(image, landmarks)

        if hair_point:
            self._sample_points.append(SamplePoint(x=hair_point[0], y=hair_point[1], label="hair"))

        colors = ExtractedColors(
            eyes=self._rgb_to_hex(eye_color),
            hair=self._rgb_to_hex(hair_color),
            skin=self._rgb_to_hex(skin_color)
        )

        debug_info = DebugInfo(
            sample_points=self._sample_points,
            image_width=w,
            image_height=h
        )

        return colors, debug_info

    def _extract_eye_color(self, image: np.ndarray, landmarks: Dict) -> Tuple[Tuple[int, int, int], Tuple[int, int]]:
        """Extract dominant eye color from iris regions using Face Mesh landmarks."""
        # Get iris regions for both eyes
        left_iris = landmarks.get("left_eye_iris", [])
        right_iris = landmarks.get("right_eye_iris", [])

        # Calculate sample point from RIGHT eye only (not average of both, which lands on nose bridge)
        sample_point = None
        sample_coords = right_iris if right_iris else left_iris

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
            sample_coords = right_outline if right_outline else left_outline
            for coords in [left_outline, right_outline]:
                if coords:
                    region_pixels = self._get_region_pixels(image, coords, expand=0)
                    pixels.extend(region_pixels)

        # Calculate center point from ONE eye's coordinates (not both)
        if sample_coords:
            avg_x = sum(c[0] for c in sample_coords) // len(sample_coords)
            avg_y = sum(c[1] for c in sample_coords) // len(sample_coords)
            sample_point = (avg_x, avg_y)

        if not pixels:
            return (100, 80, 60), sample_point  # Default brown if no eye detected

        return self._get_dominant_color(np.array(pixels)), sample_point

    def _extract_skin_color_from_mask(
        self, image: np.ndarray, face_skin_mask: np.ndarray
    ) -> Tuple[Optional[Tuple[int, int, int]], Optional[Tuple[int, int]]]:
        """
        Extract skin color from face_skin segmentation mask.

        Args:
            image: RGB numpy array
            face_skin_mask: Boolean mask where True = face skin pixel

        Returns:
            Tuple of (RGB color, centroid point) or (None, None) if extraction fails
        """
        if not np.any(face_skin_mask):
            return None, None

        # Get all pixels within the face skin mask
        pixels = image[face_skin_mask]

        if len(pixels) < 10:
            return None, None

        # Calculate centroid for debug point
        y_coords, x_coords = np.where(face_skin_mask)
        centroid = (int(np.mean(x_coords)), int(np.mean(y_coords)))

        return self._get_dominant_color(pixels), centroid

    def _extract_skin_color_from_landmarks(
        self, image: np.ndarray, landmarks: Dict
    ) -> Tuple[Tuple[int, int, int], Optional[Tuple[int, int]]]:
        """Extract skin color using Face Mesh cheek and forehead landmarks (fallback method)."""
        pixels = []
        all_coords = []

        # Get pixels from cheek and forehead regions
        for region in ["left_cheek", "right_cheek", "forehead"]:
            coords = landmarks.get(region, [])
            if coords:
                all_coords.extend(coords)
                region_pixels = self._get_region_pixels(image, coords, expand=5)
                pixels.extend(region_pixels)

        # Calculate center point (use right cheek as primary sample point)
        sample_point = None
        right_cheek = landmarks.get("right_cheek", [])
        if right_cheek:
            avg_x = sum(c[0] for c in right_cheek) // len(right_cheek)
            avg_y = sum(c[1] for c in right_cheek) // len(right_cheek)
            sample_point = (avg_x, avg_y)

        if not pixels:
            return (200, 160, 140), sample_point  # Default skin tone

        return self._get_dominant_color(np.array(pixels)), sample_point

    def _extract_hair_color_from_mask(
        self, image: np.ndarray, hair_mask: np.ndarray
    ) -> Tuple[Optional[Tuple[int, int, int]], Optional[Tuple[int, int]]]:
        """
        Extract hair color from hair segmentation mask.

        Args:
            image: RGB numpy array
            hair_mask: Boolean mask where True = hair pixel

        Returns:
            Tuple of (RGB color, centroid point) or (None, None) if no hair detected
        """
        if not np.any(hair_mask):
            # No hair detected (possibly bald or wearing hat)
            return None, None

        # Get all pixels within the hair mask
        pixels = image[hair_mask]

        if len(pixels) < 10:
            return None, None

        # Filter out very bright pixels (likely highlights or reflections)
        brightness = np.mean(pixels, axis=1)
        mask = brightness < 240
        filtered_pixels = pixels[mask]

        if len(filtered_pixels) < 10:
            filtered_pixels = pixels  # Use unfiltered if too few remain

        # Calculate centroid for debug point
        y_coords, x_coords = np.where(hair_mask)
        centroid = (int(np.mean(x_coords)), int(np.mean(y_coords)))

        return self._get_dominant_color(filtered_pixels), centroid

    def _extract_hair_color_from_landmarks(
        self, image: np.ndarray, landmarks: Dict
    ) -> Tuple[Tuple[int, int, int], Optional[Tuple[int, int]]]:
        """
        Extract hair color from region above forehead (fallback heuristic method).
        """
        top_head = landmarks.get("top_head", [])
        w, h = landmarks.get("image_dimensions", (image.shape[1], image.shape[0]))

        if not top_head:
            return (60, 40, 30), None  # Default dark brown

        # Find the topmost points of the face
        top_y = min(coord[1] for coord in top_head)

        # Sample from above the face (hair region)
        hair_band_top = max(0, top_y - 80)
        hair_band_bottom = max(0, top_y - 10)

        # Get the x-range from top_head landmarks
        x_coords = [coord[0] for coord in top_head]
        x_min = max(0, min(x_coords) + 20)
        x_max = min(w, max(x_coords) - 20)

        # Calculate sample point (center of hair region)
        sample_point = ((x_min + x_max) // 2, (hair_band_top + hair_band_bottom) // 2)

        if hair_band_top >= hair_band_bottom or x_min >= x_max:
            return (60, 40, 30), sample_point  # Default

        # Sample pixels from the hair region
        hair_region = image[hair_band_top:hair_band_bottom, x_min:x_max]

        if hair_region.size == 0:
            return (60, 40, 30), sample_point  # Default

        pixels = hair_region.reshape(-1, 3)

        # Filter out very bright pixels (likely background/highlights)
        brightness = np.mean(pixels, axis=1)
        mask = brightness < 240
        pixels = pixels[mask]

        if len(pixels) < 10:
            return (60, 40, 30), sample_point  # Default

        return self._get_dominant_color(pixels), sample_point

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
