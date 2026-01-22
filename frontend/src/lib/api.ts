import { AnalysisResult, Gender } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function analyzeImage(base64Image: string): Promise<AnalysisResult> {
  // Remove data URL prefix if present
  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const response = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageData }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Analysis failed: ${response.status}`);
  }

  return response.json();
}

export function getAmazonSearchUrl(color: string, category: "all" | "tops" | "bottoms" = "all", gender?: Gender): string {
  const genderPrefix = gender === "male" ? "Mens" : gender === "female" ? "Womens" : "";
  const categoryName = category === "tops" ? "Tops" : category === "bottoms" ? "Bottoms" : "";

  // Build query: [Mens/Womens/Blank] [Color] color [Tops/Bottoms]
  const parts = [genderPrefix, color, "color", categoryName].filter(Boolean);
  const query = encodeURIComponent(parts.join(" "));
  return `https://www.amazon.com/s?k=${query}`;
}
