import { AnalysisResult, Product, Gender } from "./types";

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

export async function searchProducts(color: string, category: string = "shirt", gender?: Gender): Promise<Product[]> {
  const genderPrefix = gender === "male" ? "mens" : gender === "female" ? "womens" : "";
  const response = await fetch(
    `/api/products?color=${encodeURIComponent(color)}&category=${encodeURIComponent(category)}&gender=${encodeURIComponent(genderPrefix)}`
  );

  if (!response.ok) {
    console.error("Product search failed:", response.status);
    return [];
  }

  return response.json();
}

export function getAmazonSearchUrl(color: string, category: string = "clothing", gender?: Gender): string {
  const genderPrefix = gender === "male" ? "mens " : gender === "female" ? "womens " : "";
  const query = encodeURIComponent(`${genderPrefix}${color} ${category}`);
  return `https://www.amazon.com/s?k=${query}`;
}
