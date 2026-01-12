"use client";

import { Product } from "@/lib/types";

interface ClothingCardProps {
  product: Product;
}

export default function ClothingCard({ product }: ClothingCardProps) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-2">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Color indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-slate-800/90 rounded-full text-xs">
          <span
            className="w-3 h-3 rounded-full border border-slate-200 dark:border-slate-600"
            style={{ backgroundColor: product.color }}
          />
        </div>
      </div>
      <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {product.title}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
        {product.price}
      </p>
    </a>
  );
}
