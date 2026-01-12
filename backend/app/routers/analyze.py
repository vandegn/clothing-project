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

router = APIRouter()

# Initialize services
face_analyzer = FaceAnalyzer()
color_extractor = ColorExtractor()
color_theory = ColorTheoryAnalyzer()
palette_generator = PaletteGenerator()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest):
    """
    Analyze a selfie to extract colors and determine seasonal color palette.

    - Extracts eye, hair, and skin colors using MediaPipe and OpenCV
    - Determines seasonal color type based on color theory
    - Generates a 16-color palette suited to the user
    """
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        image = Image.open(io.BytesIO(image_data))

        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Convert to numpy array for OpenCV
        image_array = np.array(image)

        # Step 1: Detect face landmarks
        landmarks = face_analyzer.detect_landmarks(image_array)
        if landmarks is None:
            raise HTTPException(status_code=400, detail="No face detected in the image")

        # Step 2: Extract colors from facial regions
        colors = color_extractor.extract_colors(image_array, landmarks)

        # Step 3: Analyze colors to determine season
        analysis = color_theory.analyze(colors)

        # Step 4: Generate palette based on season
        palette = palette_generator.generate(analysis["season"])

        return AnalyzeResponse(
            colors=colors,
            season=analysis["season"],
            season_description=analysis["description"],
            palette=palette,
            undertone=analysis["undertone"],
            contrast=analysis["contrast"]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
