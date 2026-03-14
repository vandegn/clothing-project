from pydantic import BaseModel, field_validator
from typing import List, Optional, Tuple

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # ~10MB base64


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

    @field_validator("image")
    @classmethod
    def check_image_size(cls, v):
        if len(v) > MAX_IMAGE_SIZE:
            raise ValueError("Image too large (max 10MB)")
        return v


class AnalyzeResponse(BaseModel):
    """Response from image analysis"""
    colors: ExtractedColors
    season: str  # spring, summer, autumn, winter
    season_description: str
    palette: List[ColorPalette]  # 16 colors
    undertone: str  # warm or cool
    contrast: str  # low, medium, or high
    debug_info: Optional[DebugInfo] = None  # Debug sample points


class CheckoutRequest(BaseModel):
    package_id: str
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str


class CreditsResponse(BaseModel):
    credits: int


class TryOnSubmitRequest(BaseModel):
    body_image: str  # base64
    clothing_image: str  # base64

    @field_validator("body_image", "clothing_image")
    @classmethod
    def check_image_size(cls, v):
        if len(v) > MAX_IMAGE_SIZE:
            raise ValueError("Image too large (max 10MB)")
        return v


class TryOnSubmitResponse(BaseModel):
    success: bool
    message: str
    credits_remaining: int
    result_image: Optional[str] = None  # base64 PNG from OpenAI
