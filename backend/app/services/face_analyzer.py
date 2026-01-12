import mediapipe as mp
import numpy as np
from typing import Optional, Dict, List
import cv2


class FaceAnalyzer:
    """
    Uses MediaPipe Face Mesh to detect facial landmarks.
    These landmarks are used to identify regions for eye, skin, and hair color extraction.
    """

    # MediaPipe Face Mesh landmark indices for specific facial regions
    # Reference: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png

    # Left eye region (iris area)
    LEFT_EYE_IRIS = [468, 469, 470, 471, 472]

    # Right eye region (iris area)
    RIGHT_EYE_IRIS = [473, 474, 475, 476, 477]

    # Left eye outline for reference
    LEFT_EYE_OUTLINE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]

    # Right eye outline for reference
    RIGHT_EYE_OUTLINE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]

    # Cheek regions for skin tone (left and right cheeks)
    LEFT_CHEEK = [116, 123, 147, 187, 207, 216]
    RIGHT_CHEEK = [345, 352, 376, 411, 427, 436]

    # Forehead region for skin tone
    FOREHEAD = [10, 67, 69, 104, 108, 109, 151, 297, 299, 332, 333, 338]

    # Top of head region (for hair detection reference)
    # Note: Hair is typically above the face mesh, so we'll use top landmarks as reference
    TOP_HEAD = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
                397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
                172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]

    def __init__(self):
        """Initialize MediaPipe Face Mesh."""
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,  # Enables iris landmarks
            min_detection_confidence=0.5
        )

    def detect_landmarks(self, image: np.ndarray) -> Optional[Dict]:
        """
        Detect facial landmarks in the image.

        Args:
            image: RGB numpy array of the image

        Returns:
            Dictionary containing landmark coordinates for different facial regions,
            or None if no face detected
        """
        # Convert to RGB (MediaPipe expects RGB)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) if len(image.shape) == 3 else image

        # Process the image
        results = self.face_mesh.process(rgb_image)

        if not results.multi_face_landmarks:
            return None

        # Get the first face's landmarks
        face_landmarks = results.multi_face_landmarks[0]

        # Get image dimensions
        h, w = image.shape[:2]

        # Convert normalized landmarks to pixel coordinates
        def get_region_coords(indices: List[int]) -> List[tuple]:
            coords = []
            for idx in indices:
                if idx < len(face_landmarks.landmark):
                    landmark = face_landmarks.landmark[idx]
                    x = int(landmark.x * w)
                    y = int(landmark.y * h)
                    coords.append((x, y))
            return coords

        return {
            "left_eye_iris": get_region_coords(self.LEFT_EYE_IRIS),
            "right_eye_iris": get_region_coords(self.RIGHT_EYE_IRIS),
            "left_eye_outline": get_region_coords(self.LEFT_EYE_OUTLINE),
            "right_eye_outline": get_region_coords(self.RIGHT_EYE_OUTLINE),
            "left_cheek": get_region_coords(self.LEFT_CHEEK),
            "right_cheek": get_region_coords(self.RIGHT_CHEEK),
            "forehead": get_region_coords(self.FOREHEAD),
            "top_head": get_region_coords(self.TOP_HEAD),
            "image_dimensions": (w, h)
        }

    def __del__(self):
        """Clean up MediaPipe resources."""
        if hasattr(self, 'face_mesh'):
            self.face_mesh.close()
