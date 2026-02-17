import os
import base64
from io import BytesIO
from openai import OpenAI


class TryOnService:
    def __init__(self):
        self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    def generate_tryon(self, body_image_b64: str, clothing_image_b64: str) -> str:
        """Generate a virtual try-on image using OpenAI gpt-image-1-mini.

        Returns base64-encoded PNG image data (no data URL prefix).
        """
        body_buf = self._b64_to_file(body_image_b64, "body.png")
        clothing_buf = self._b64_to_file(clothing_image_b64, "clothing.png")

        result = self.client.images.edit(
            model="gpt-image-1-mini",
            image=[body_buf, clothing_buf],
            prompt=(
                "Generate a realistic photo of the person from the first image "
                "wearing the clothing shown in the second image. "
                "Preserve the person's exact physical features including body shape, "
                "facial features, skin tone, and hair. Only change their outfit to "
                "match the clothing item in the second image. The result should look "
                "natural and photorealistic, as if the person is actually wearing "
                "the new clothing. Maintain the same pose and background."
            ),
            size="1024x1024",  # smallest square for gpt-image-1-mini
        )

        return result.data[0].b64_json

    @staticmethod
    def _b64_to_file(data_url: str, filename: str) -> BytesIO:
        """Convert a base64 data URL to a file-like object."""
        raw = data_url.split(",", 1)[1] if "," in data_url else data_url
        buf = BytesIO(base64.b64decode(raw))
        buf.name = filename
        return buf
