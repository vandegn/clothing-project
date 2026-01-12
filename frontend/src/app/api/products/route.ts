import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "axesso-amazon-data-service1.p.rapidapi.com";

interface AxessoProduct {
  asin: string;
  productTitle: string;
  price: string;
  imageUrl: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const color = searchParams.get("color") || "blue";
  const category = searchParams.get("category") || "shirt";
  const gender = searchParams.get("gender") || "";

  // If no API key, return mock data indicator
  if (!RAPIDAPI_KEY) {
    console.log("No RAPIDAPI_KEY configured");
    return NextResponse.json(
      { message: "Using mock data - no API key configured" },
      { status: 200 }
    );
  }

  try {
    // Build query: [Mens/Womens/Blank] [Color] color [Tops/Bottoms]
    const genderPrefix = gender === "mens" ? "Mens" : gender === "womens" ? "Womens" : "";
    const categoryName = category === "tops" ? "Tops" : category === "bottoms" ? "Bottoms" : "";
    const parts = [genderPrefix, color, "color", categoryName].filter(Boolean);
    const searchQuery = parts.join(" ");

    // Use the correct Axesso endpoint
    const url = `https://${RAPIDAPI_HOST}/amz/amazon-search-by-keyword-asin?domainCode=com&keyword=${encodeURIComponent(searchQuery)}&page=1`;

    console.log("Fetching from Axesso:", url);
    console.log("Search query:", searchQuery);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });

    const responseText = await response.text();
    console.log("Axesso response status:", response.status);
    console.log("Axesso response:", responseText.substring(0, 500));

    if (!response.ok) {
      throw new Error(`Axesso API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);

    // Transform Axesso response to our Product format
    // Axesso returns searchProductDetails array
    const productList = data.searchProductDetails || data.products || [];
    const products = productList.slice(0, 4).map((item: AxessoProduct, index: number) => ({
      id: item.asin || `product-${index}`,
      title: item.productTitle || "Product",
      price: item.price || "$0.00",
      image: item.imageUrl || "https://placehold.co/300x300/gray/white?text=No+Image",
      url: `https://www.amazon.com/dp/${item.asin}`,
      color: color,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: String(error) },
      { status: 500 }
    );
  }
}
