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
    return NextResponse.json(
      { message: "Using mock data - no API key configured" },
      { status: 200 }
    );
  }

  try {
    const genderPrefix = gender ? `${gender} ` : "";
    const searchQuery = `${genderPrefix}${color} ${category}`;
    const url = `https://${RAPIDAPI_HOST}/v1/search?searchQuery=${encodeURIComponent(searchQuery)}&page=1&countryCode=US`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Axesso API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Axesso response to our Product format
    const products = (data.products || []).slice(0, 4).map((item: AxessoProduct, index: number) => ({
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
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
