import { categories, type Category } from "@/data/categories";
import { faqs, type FAQ } from "@/data/faqs";
import { products, type Product } from "@/data/products";
import { testimonials, type Testimonial } from "@/data/testimonials";

export type Company = {
  id: string;
  name: string;
  label: string;
  monogram: string;
};

export type ContentData = {
  categories: Category[];
  products: Product[];
  companies: Company[];
  testimonials: Testimonial[];
  faqs: FAQ[];
};

function addCategoryIds(items: Category[]): Category[] {
  return items.map((category) => ({
    ...category,
    id: category.id ?? `category-${category.slug}`,
    subcategories: category.subcategories
      ? addCategoryIds(category.subcategories)
      : undefined,
  }));
}

export const demoContent: ContentData = {
  categories: addCategoryIds(categories),
  products: products.map((product) => ({
    ...product,
    id: product.id ?? `product-${product.slug}`,
  })),
  companies: [
    { id: "company-northside", name: "Northside", label: "Athletics", monogram: "N" },
    { id: "company-summit", name: "Summit", label: "Run Club", monogram: "S" },
  ],
  testimonials: testimonials.map((testimonial, index) => ({
    ...testimonial,
    id: testimonial.id ?? `testimonial-${index + 1}`,
  })),
  faqs: faqs.map((faq, index) => ({ ...faq, id: faq.id ?? `faq-${index + 1}` })),
};

export function makeStableId(prefix: string): string {
  const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${randomId}`;
}
