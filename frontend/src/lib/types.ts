export interface ExtractedColors {
  eyes: string;
  hair: string;
  skin: string;
}

export interface ColorPalette {
  hex: string;
  name: string;
}

export interface AnalysisResult {
  colors: ExtractedColors;
  season: "spring" | "summer" | "autumn" | "winter";
  season_description: string;
  palette: ColorPalette[];
  undertone: "warm" | "cool";
  contrast: "low" | "medium" | "high";
}

export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  url: string;
  color: string;
}
