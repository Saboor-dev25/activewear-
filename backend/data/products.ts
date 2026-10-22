import { StaticImageData } from "next/image";

export type Product = {
  id?: string;
  slug: string;
  categorySlug: string;
  /** Optional nested collection; categorySlug remains the top-level category. */
  subcategorySlug?: string;
  name: string;
  description: string;
  image: string | StaticImageData;
  /** Optional focal point for images with an off-center subject. */
  imagePosition?: string;
  sizeChart?: string;
  sizes: string[];
  materials: string;
  features: string[];
};

export const products: Product[] = [
  { slug: "custom-training-tee", 
    categorySlug: "performance-wear",
    subcategorySlug: "training-tops",
    name: "Custom Training Tee", 
    description: "A lightweight customizable training top designed for repeat sessions, team colors, and all-day comfort.", 
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85", 
    sizeChart: "/size-charts/apparel-size-chart.pdf", 
    sizes: ["XS", "S", "M", "L", "XL", "2XL"], 
    materials: "Breathable performance polyester blend.", 
    features: ["Full-color team artwork", "Lightweight moisture management", "Multiple fit options"]
   },
  { slug: "custom-performance-leggings", 
    categorySlug: "performance-wear",
    subcategorySlug: "performance-leggings",
    name: "Custom Performance Leggings", 
    description: "Supportive custom leggings made for training, movement, and a coordinated team look.", 
    image: "https://images.unsplash.com/photo-1506629905607-d9f8a3bde39b?auto=format&fit=crop&w=1000&q=85",
     sizeChart: "/size-charts/apparel-size-chart.pdf", 
     sizes: ["XS", "S", "M", "L", "XL", "2XL"], 
     materials: "Stretch performance fabric with a soft hand feel.", 
     features: ["All-over print options", "Flexible four-way stretch", "Team and individual sizing"] 
    },
];
