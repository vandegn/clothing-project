import asyncio
import base64
import numpy as np
from fastapi import APIRouter, HTTPException
from PIL import Image
import io

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.face_analyzer import FaceAnalyzer
from app.services.color_extractor import ColorExtractor
from app.services.color_theory import ColorTheoryAnalyzer
from app.services.palette_generator import PaletteGenerator
from app.services.image_segmenter import ImageSegmenter

router = APIRouter()

# Initialize services
face_analyzer = FaceAnalyzer()
image_segmenter = ImageSegmenter()
color_extractor = ColorExtractor()
color_theory = ColorTheoryAnalyzer()
palette_generator = PaletteGenerator()


def _run_analysis(image_data: bytes):
    """Synchronous analysis pipeline — runs in a thread pool executor."""
    image = Image.open(io.BytesIO(image_data))

    if image.mode != 'RGB':
        image = image.convert('RGB')

    image_array = np.array(image)

    landmarks = face_analyzer.detect_landmarks(image_array)
    if landmarks is None:
        raise ValueError("NO_FACE")

    segmentation = image_segmenter.segment(image_array)
    colors, debug_info = color_extractor.extract_colors(image_array, landmarks, segmentation)
    analysis = color_theory.analyze(colors)
    palette = palette_generator.generate(analysis["season"])

    return colors, analysis, palette, debug_info


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest):
    """
    Analyze a selfie to extract colors and determine seasonal color palette.

    - Extracts eye, hair, and skin colors using MediaPipe and OpenCV
    - Determines seasonal color type based on color theory
    - Generates a 16-color palette suited to the user
    """
    try:
        image_data = base64.b64decode(request.image)

        loop = asyncio.get_event_loop()
        colors, analysis, palette, debug_info = await loop.run_in_executor(
            None, _run_analysis, image_data
        )

        return AnalyzeResponse(
            colors=colors,
            season=analysis["season"],
            season_description=analysis["description"],
            palette=palette,
            undertone=analysis["undertone"],
            contrast=analysis["contrast"],
            debug_info=debug_info
        )

    except ValueError as e:
        if str(e) == "NO_FACE":
            raise HTTPException(status_code=400, detail="No face detected in the image")
        raise HTTPException(status_code=400, detail="Invalid image data. Please provide a valid base64-encoded image.")
    except HTTPException:
        raise
    except (base64.binascii.Error,):
        raise HTTPException(status_code=400, detail="Invalid image data. Please provide a valid base64-encoded image.")
    except Exception:
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again with a different image.")
