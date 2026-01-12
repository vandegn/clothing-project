"use client";

import { useState, useEffect } from "react";
import { ColorPalette, Product, Gender } from "@/lib/types";
import { getAmazonSearchUrl } from "@/lib/api";
import ClothingCard from "./ClothingCard";
import { getMockProducts } from "@/lib/mockProducts";

interface ClothingRecommendationsProps {
  palette: ColorPalette[];
  gender: Gender;
}

export default function ClothingRecommendations({ palette, gender }: ClothingRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "tops" | "bottoms">("all");

  useEffect(() => {
    // Use mock products for now
    // In production, this would call the Axesso API
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Get mock products based on palette colors and gender
        const mockProducts = getMockProducts(palette, gender);
        setProducts(mockProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [palette, gender]);

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => {
        if (selectedCategory === "tops") {
          return ["shirt", "blouse", "sweater", "top", "jacket"].some(t =>
            p.title.toLowerCase().includes(t)
          );
        }
        return ["pants", "jeans", "skirt", "shorts", "trousers"].some(t =>
          p.title.toLowerCase().includes(t)
        );
      });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Clothing Recommendations
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Clothing items that match your color palette
          </p>
        </div>

        <div className="flex gap-2">
          {(["all", "tops", "bottoms"] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-700 aspect-square rounded-lg mb-2" />
              <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4 mb-1" />
              <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.slice(0, 8).map((product) => (
              <ClothingCard key={product.id} product={product} />
            ))}
          </div>

          {/* Shop on Amazon Links */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Search for more items on Amazon:
            </p>
            <div className="flex flex-wrap gap-2">
              {palette.slice(0, 6).map((color, index) => (
                <a
                  key={index}
                  href={getAmazonSearchUrl(color.name, "clothing", gender)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-500"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-slate-700 dark:text-slate-300">{color.name}</span>
                  <svg
                    className="w-3 h-3 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
