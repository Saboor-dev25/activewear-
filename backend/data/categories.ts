import PerformanceWearImage from "@/public/images/perform.png";
import { StaticImageData } from "next/image"; // Optional, but good for typing

export type Category = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  image: string | StaticImageData; // Allow either a URL string or a static import
  /** Optional focal point for images with an off-center subject (CSS object-position value). */
  imagePosition?: string;
  eyebrow: string;
  /** Nested collections use their parent's slug in Product.categorySlug for compatibility. */
  subcategories?: Category[];
};

export function getAllCategories(items: Category[] = categories): Category[] {
  return items.flatMap((category) => [category, ...getAllCategories(category.subcategories ?? [])]);
}

export function findCategoryBySlug(slug: string, items: Category[] = categories): Category | undefined {
  return getAllCategories(items).find((category) => category.slug === slug);
}

export function findCategoryParent(slug: string, items: Category[] = categories): Category | undefined {
  function findParent(items: Category[]): Category | undefined {
    for (const category of items) {
      if (category.subcategories?.some((subcategory) => subcategory.slug === slug)) return category;
      const nestedParent = findParent(category.subcategories ?? []);
      if (nestedParent) return nestedParent;
    }
    return undefined;
  }
  return findParent(items);
}

export const categories: Category[] = [
  { 
    slug: "performance-wear", 
    name: "Performance Wear", 
    description: "Custom training apparel made to move with your team.", 
    image: PerformanceWearImage, // Pass the imported variable directly (no quotes)
    eyebrow: "Move with purpose",
    subcategories: [
      { id: "subcategory-training-tops", slug: "training-tops", name: "Training Tops", description: "Lightweight custom tops for every training session.", image: PerformanceWearImage, eyebrow: "Ready for every rep" },
      { id: "subcategory-performance-leggings", slug: "performance-leggings", name: "Performance Leggings", description: "Flexible custom leggings built for movement.", image: "/images/legs.jpg", eyebrow: "Move without limits" },
    ],
  },

  { 
    slug: "teamwear", 
    name: "Teamwear", 
    description: "Custom kits for clubs, schools, and the people who show up.", 
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1100&q=85", 
    eyebrow: "Made as a team" 
  },
];
