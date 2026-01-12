export type Gender = "male" | "female" | "non-binary";

export interface ExtractedColors {
  eyes: string;
  hair: string;
  skin: string;
}

export interface ColorPalette {
  hex: string;
  name: string;
}

export interface SamplePoint {
  x: number;
  y: number;
  label: "eyes" | "hair" | "skin";
}

export interface DebugInfo {
  sample_points: SamplePoint[];
  image_width: number;
  image_height: number;
}

export interface AnalysisResult {
  colors: ExtractedColors;
  season: "spring" | "summer" | "autumn" | "winter";
  season_description: string;
  palette: ColorPalette[];
  undertone: "warm" | "cool";
  contrast: "low" | "medium" | "high";
  debug_info?: DebugInfo;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  url: string;
  color: string;
}
