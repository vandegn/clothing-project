import cv2
import numpy as np
from typing import Dict, Optional, Tuple
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import os


class ImageSegmenter:
    """
    Uses MediaPipe's multi-class selfie segmenter to identify hair and skin regions.

    Segmentation categories:
        0 - background
        1 - hair
        2 - body skin
        3 - face skin
        4 - clothes
        5 - accessories
    """

    CATEGORY_HAIR = 1
    CATEGORY_FACE_SKIN = 3
    MODEL_INPUT_SIZE = 256

    def __init__(self):
        """Initialize MediaPipe ImageSegmenter with multi-class selfie model."""
        # Get the model path relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, "..", "models", "selfie_multiclass_256x256.tflite")

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Segmentation model not found at {model_path}. "
                "Please download selfie_multiclass_256x256.tflite from Google Storage."
            )

        # Load model as buffer to avoid Windows path issues with MediaPipe
        with open(model_path, "rb") as f:
            model_data = f.read()

        base_options = python.BaseOptions(model_asset_buffer=model_data)
        options = vision.ImageSegmenterOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE,
            output_category_mask=True
        )
        self._segmenter = vision.ImageSegmenter.create_from_options(options)

    def segment(self, image: np.ndarray) -> Optional[Dict]:
        """
        Segment the image to identify hair and face skin regions.

        Args:
            image: RGB numpy array of the image (any size)

        Returns:
            Dictionary containing:
                - hair_mask: boolean array (original image size) where True = hair
                - face_skin_mask: boolean array (original image size) where True = face skin
                - original_size: (width, height) of original image
            Returns None if segmentation fails.
        """
        try:
            original_h, original_w = image.shape[:2]

            # Resize to model input size (256x256)
            resized = cv2.resize(image, (self.MODEL_INPUT_SIZE, self.MODEL_INPUT_SIZE))

            # Convert to MediaPipe Image format
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=resized)

            # Perform segmentation
            result = self._segmenter.segment(mp_image)

            if result.category_mask is None:
                return None

            # Get the category mask (256x256, uint8 values 0-5)
            category_mask = result.category_mask.numpy_view()

            # Create binary masks for hair and face skin
            hair_mask_small = (category_mask == self.CATEGORY_HAIR)
            face_skin_mask_small = (category_mask == self.CATEGORY_FACE_SKIN)

            # Scale masks back to original image size
            hair_mask = cv2.resize(
                hair_mask_small.astype(np.uint8),
                (original_w, original_h),
                interpolation=cv2.INTER_NEAREST
            ).astype(bool)

            face_skin_mask = cv2.resize(
                face_skin_mask_small.astype(np.uint8),
                (original_w, original_h),
                interpolation=cv2.INTER_NEAREST
            ).astype(bool)

            return {
                "hair_mask": hair_mask,
                "face_skin_mask": face_skin_mask,
                "original_size": (original_w, original_h)
            }

        except Exception as e:
            print(f"Segmentation failed: {e}")
            return None

    def get_mask_centroid(self, mask: np.ndarray) -> Optional[Tuple[int, int]]:
        """
        Calculate the centroid of a binary mask.

        Args:
            mask: Boolean numpy array

        Returns:
            (x, y) coordinates of the centroid, or None if mask is empty
        """
        if not np.any(mask):
            return None

        # Find all True positions
        y_coords, x_coords = np.where(mask)

        # Calculate centroid
        centroid_x = int(np.mean(x_coords))
        centroid_y = int(np.mean(y_coords))

        return (centroid_x, centroid_y)

    def __del__(self):
        """Clean up MediaPipe resources."""
        if hasattr(self, '_segmenter'):
            self._segmenter.close()
