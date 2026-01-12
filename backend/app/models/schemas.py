from pydantic import BaseModel
from typing import List, Optional


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
