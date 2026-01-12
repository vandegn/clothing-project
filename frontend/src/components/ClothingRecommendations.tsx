"use client";

import { useState, useEffect } from "react";
import { ColorPalette, Gender } from "@/lib/types";
import { getAmazonSearchUrl } from "@/lib/api";

interface ClothingRecommendationsProps {
  palette: ColorPalette[];
  gender: Gender;
}

interface ColorProduct {
  colorName: string;
  image: string;
  url: string;
  title: string;
}

export default function ClothingRecommendations({ palette, gender }: ClothingRecommendationsProps) {
  const [colorProducts, setColorProducts] = useState<ColorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "tops" | "bottoms">("tops");

  useEffect(() => {
    const fetchColorProducts = async () => {
      setLoading(true);
      try {
        const genderParam = gender === "male" ? "mens" : gender === "female" ? "womens" : "";
        const categoryParam = selectedCategory === "all" ? "" : selectedCategory;

        // Fetch first product for each color in palette
        const results = await Promise.all(
          palette.slice(0, 6).map(async (color) => {
            try {
              const response = await fetch(
                `/api/products?color=${encodeURIComponent(color.name)}&category=${encodeURIComponent(categoryParam)}&gender=${encodeURIComponent(genderParam)}`
              );

              if (!response.ok) {
                throw new Error("Failed to fetch");
              }

              const products = await response.json();

              // Get the first product with an image
              if (Array.isArray(products) && products.length > 0) {
                const product = products[0];
                return {
                  colorName: color.name,
                  image: product.image,
                  url: product.url,
                  title: product.title,
                };
              }

              return {
                colorName: color.name,
                image: "",
                url: getAmazonSearchUrl(color.name, selectedCategory, gender),
                title: "",
              };
            } catch {
              return {
                colorName: color.name,
                image: "",
                url: getAmazonSearchUrl(color.name, selectedCategory, gender),
                title: "",
              };
            }
          })
        );

        setColorProducts(results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColorProducts();
  }, [palette, gender, selectedCategory]);

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
          {(["tops", "bottoms"] as const).map((category) => (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-700 aspect-square rounded-lg mb-2" />
              <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {colorProducts.map((product, index) => {
            const paletteColor = palette[index];
            return (
              <a
                key={index}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-2">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title || product.colorName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: paletteColor?.hex || "#ccc" }}
                    >
                      <span className="text-white text-xs text-center px-2">
                        No image
                      </span>
                    </div>
                  )}
                  <div
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: paletteColor?.hex || "#ccc" }}
                  />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {product.colorName}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
