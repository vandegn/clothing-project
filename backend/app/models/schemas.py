from pydantic import BaseModel
from typing import List, Optional, Tuple


class SamplePoint(BaseModel):
    """A point where color was sampled"""
    x: int
    y: int
    label: str  # "eyes", "hair", or "skin"


class DebugInfo(BaseModel):
    """Debug information about the color extraction"""
    sample_points: List[SamplePoint]
    image_width: int
    image_height: int


class ExtractedColors(BaseModel):
    """Colors extracted from the selfie"""
    eyes: str  # Hex color code
    hair: str  # Hex color code
    skin: str  # Hex color code


class ColorPalette(BaseModel):
    """A single color in the palette"""
    hex: str  # Hex color code
    name: str  # Human-readable color name


class AnalyzeRequest(BaseModel):
    """Request body for image analysis"""
    image: str  # Base64 encoded image


class AnalyzeResponse(BaseModel):
    """Response from image analysis"""
    colors: ExtractedColors
    season: str  # spring, summer, autumn, winter
    season_description: str
    palette: List[ColorPalette]  # 16 colors
    undertone: str  # warm or cool
    contrast: str  # low, medium, or high
    debug_info: Optional[DebugInfo] = None  # Debug sample points
