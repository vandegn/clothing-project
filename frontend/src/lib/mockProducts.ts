import { ColorPalette, Product, Gender } from "./types";

// Mock product templates by color
const productTemplates: Record<string, Partial<Product>[]> = {
  // Reds and Pinks
  red: [
    { title: "Classic Red Cotton T-Shirt", price: "$24.99", image: "https://placehold.co/300x300/dc2626/ffffff?text=Red+Shirt" },
    { title: "Burgundy Wool Sweater", price: "$59.99", image: "https://placehold.co/300x300/991b1b/ffffff?text=Sweater" },
  ],
  coral: [
    { title: "Coral Summer Blouse", price: "$34.99", image: "https://placehold.co/300x300/f97316/ffffff?text=Coral+Top" },
    { title: "Peach Linen Shirt", price: "$44.99", image: "https://placehold.co/300x300/fb923c/ffffff?text=Linen" },
  ],
  pink: [
    { title: "Blush Pink Cardigan", price: "$49.99", image: "https://placehold.co/300x300/f472b6/ffffff?text=Pink+Cardigan" },
    { title: "Rose Cotton Polo", price: "$29.99", image: "https://placehold.co/300x300/ec4899/ffffff?text=Polo" },
  ],
  burgundy: [
    { title: "Burgundy Dress Shirt", price: "$54.99", image: "https://placehold.co/300x300/7f1d1d/ffffff?text=Dress+Shirt" },
    { title: "Wine Red Pants", price: "$64.99", image: "https://placehold.co/300x300/831843/ffffff?text=Pants" },
  ],

  // Blues
  navy: [
    { title: "Navy Blue Blazer", price: "$89.99", image: "https://placehold.co/300x300/1e3a8a/ffffff?text=Navy+Blazer" },
    { title: "Navy Chinos", price: "$49.99", image: "https://placehold.co/300x300/1e40af/ffffff?text=Chinos" },
  ],
  blue: [
    { title: "Royal Blue Button-Down", price: "$39.99", image: "https://placehold.co/300x300/2563eb/ffffff?text=Button+Down" },
    { title: "Cobalt Silk Blouse", price: "$69.99", image: "https://placehold.co/300x300/1d4ed8/ffffff?text=Silk+Top" },
  ],
  "sky blue": [
    { title: "Light Blue Oxford Shirt", price: "$44.99", image: "https://placehold.co/300x300/38bdf8/000000?text=Oxford" },
    { title: "Powder Blue Sweater", price: "$54.99", image: "https://placehold.co/300x300/7dd3fc/000000?text=Sweater" },
  ],
  teal: [
    { title: "Teal Henley Shirt", price: "$34.99", image: "https://placehold.co/300x300/0d9488/ffffff?text=Henley" },
    { title: "Teal Wide-Leg Pants", price: "$59.99", image: "https://placehold.co/300x300/14b8a6/ffffff?text=Pants" },
  ],

  // Greens
  green: [
    { title: "Forest Green Jacket", price: "$79.99", image: "https://placehold.co/300x300/166534/ffffff?text=Jacket" },
    { title: "Emerald Knit Top", price: "$39.99", image: "https://placehold.co/300x300/059669/ffffff?text=Knit+Top" },
  ],
  olive: [
    { title: "Olive Cargo Pants", price: "$54.99", image: "https://placehold.co/300x300/4d7c0f/ffffff?text=Cargo+Pants" },
    { title: "Olive Field Jacket", price: "$89.99", image: "https://placehold.co/300x300/3f6212/ffffff?text=Field+Jacket" },
  ],
  sage: [
    { title: "Sage Linen Shirt", price: "$49.99", image: "https://placehold.co/300x300/84cc16/000000?text=Linen+Shirt" },
    { title: "Sage Midi Skirt", price: "$44.99", image: "https://placehold.co/300x300/a3e635/000000?text=Skirt" },
  ],
  mint: [
    { title: "Mint Cotton Tee", price: "$24.99", image: "https://placehold.co/300x300/a7f3d0/000000?text=Cotton+Tee" },
    { title: "Mint Shorts", price: "$34.99", image: "https://placehold.co/300x300/6ee7b7/000000?text=Shorts" },
  ],

  // Yellows and Oranges
  yellow: [
    { title: "Mustard Wrap Top", price: "$39.99", image: "https://placehold.co/300x300/eab308/000000?text=Wrap+Top" },
    { title: "Sunny Yellow Dress", price: "$59.99", image: "https://placehold.co/300x300/facc15/000000?text=Dress" },
  ],
  gold: [
    { title: "Golden Satin Blouse", price: "$54.99", image: "https://placehold.co/300x300/ca8a04/ffffff?text=Satin+Blouse" },
    { title: "Gold Accent Pants", price: "$64.99", image: "https://placehold.co/300x300/a16207/ffffff?text=Pants" },
  ],
  orange: [
    { title: "Burnt Orange Sweater", price: "$49.99", image: "https://placehold.co/300x300/ea580c/ffffff?text=Sweater" },
    { title: "Tangerine Tank Top", price: "$24.99", image: "https://placehold.co/300x300/f97316/ffffff?text=Tank+Top" },
  ],

  // Purples
  purple: [
    { title: "Plum Cashmere Sweater", price: "$79.99", image: "https://placehold.co/300x300/7c3aed/ffffff?text=Cashmere" },
    { title: "Violet Silk Scarf", price: "$34.99", image: "https://placehold.co/300x300/8b5cf6/ffffff?text=Scarf" },
  ],
  lavender: [
    { title: "Lavender Blouse", price: "$44.99", image: "https://placehold.co/300x300/c4b5fd/000000?text=Blouse" },
    { title: "Lilac Midi Dress", price: "$69.99", image: "https://placehold.co/300x300/ddd6fe/000000?text=Dress" },
  ],
  indigo: [
    { title: "Indigo Denim Jacket", price: "$74.99", image: "https://placehold.co/300x300/4338ca/ffffff?text=Denim" },
    { title: "Indigo Trousers", price: "$59.99", image: "https://placehold.co/300x300/3730a3/ffffff?text=Trousers" },
  ],

  // Browns and Neutrals
  brown: [
    { title: "Chocolate Brown Cardigan", price: "$54.99", image: "https://placehold.co/300x300/78350f/ffffff?text=Cardigan" },
    { title: "Mocha Corduroy Pants", price: "$59.99", image: "https://placehold.co/300x300/92400e/ffffff?text=Corduroy" },
  ],
  tan: [
    { title: "Camel Wool Coat", price: "$149.99", image: "https://placehold.co/300x300/d97706/ffffff?text=Coat" },
    { title: "Tan Chinos", price: "$49.99", image: "https://placehold.co/300x300/b45309/ffffff?text=Chinos" },
  ],
  beige: [
    { title: "Beige Linen Blazer", price: "$89.99", image: "https://placehold.co/300x300/d6d3d1/000000?text=Blazer" },
    { title: "Cream Silk Top", price: "$59.99", image: "https://placehold.co/300x300/fafaf9/000000?text=Silk+Top" },
  ],

  // Grays and Blacks
  gray: [
    { title: "Charcoal Wool Pants", price: "$69.99", image: "https://placehold.co/300x300/4b5563/ffffff?text=Wool+Pants" },
    { title: "Heather Gray Hoodie", price: "$44.99", image: "https://placehold.co/300x300/6b7280/ffffff?text=Hoodie" },
  ],
  black: [
    { title: "Black Tailored Blazer", price: "$99.99", image: "https://placehold.co/300x300/171717/ffffff?text=Blazer" },
    { title: "Black Slim Jeans", price: "$54.99", image: "https://placehold.co/300x300/0a0a0a/ffffff?text=Jeans" },
  ],
  white: [
    { title: "White Cotton Shirt", price: "$39.99", image: "https://placehold.co/300x300/fafafa/000000?text=Cotton+Shirt" },
    { title: "Ivory Silk Blouse", price: "$69.99", image: "https://placehold.co/300x300/f5f5f4/000000?text=Silk+Blouse" },
  ],
  silver: [
    { title: "Silver Metallic Top", price: "$49.99", image: "https://placehold.co/300x300/a8a29e/000000?text=Metallic+Top" },
    { title: "Gray Knit Sweater", price: "$54.99", image: "https://placehold.co/300x300/9ca3af/000000?text=Sweater" },
  ],
};

// Fallback products for colors not in our database
const fallbackProducts: Partial<Product>[] = [
  { title: "Classic Cotton T-Shirt", price: "$29.99", image: "https://placehold.co/300x300/6366f1/ffffff?text=T-Shirt" },
  { title: "Casual Button-Down Shirt", price: "$44.99", image: "https://placehold.co/300x300/8b5cf6/ffffff?text=Shirt" },
];

export function getMockProducts(palette: ColorPalette[], gender: Gender = "female"): Product[] {
  const products: Product[] = [];
  let idCounter = 1;

  // Gender prefix for search queries
  const genderPrefix = gender === "male" ? "mens " : gender === "female" ? "womens " : "";
  const genderLabel = gender === "male" ? "Men's" : gender === "female" ? "Women's" : "";

  for (const color of palette) {
    const colorName = color.name.toLowerCase();

    // Try to find matching products
    let matchingProducts: Partial<Product>[] | undefined;

    // Check for exact match first
    if (productTemplates[colorName]) {
      matchingProducts = productTemplates[colorName];
    } else {
      // Try partial match
      for (const [key, value] of Object.entries(productTemplates)) {
        if (colorName.includes(key) || key.includes(colorName)) {
          matchingProducts = value;
          break;
        }
      }
    }

    // Use fallback if no match
    if (!matchingProducts) {
      matchingProducts = fallbackProducts;
    }

    // Add one product for this color
    const template = matchingProducts[products.length % matchingProducts.length];
    const baseTitle = template.title || `${color.name} Clothing Item`;
    const title = genderLabel ? `${genderLabel} ${baseTitle}` : baseTitle;

    products.push({
      id: `product-${idCounter++}`,
      title,
      price: template.price || "$39.99",
      image: template.image || `https://placehold.co/300x300/${color.hex.slice(1)}/ffffff?text=${encodeURIComponent(color.name)}`,
      url: `https://www.amazon.com/s?k=${encodeURIComponent(genderPrefix + color.name + " clothing")}`,
      color: color.hex,
    });

    // Limit to 16 products
    if (products.length >= 16) break;
  }

  return products;
}
