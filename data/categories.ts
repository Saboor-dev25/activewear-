import PerformanceWearImage from "@/public/images/perform.png";
import Banner from "@/public/images/banner.png";
import { StaticImageData } from "next/image"; // Optional, but good for typing

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string | StaticImageData; // Allow either a URL string or a static import
  eyebrow: string;
};

export const categories: Category[] = [
  { 
    slug: "performance-wear", 
    name: "Performance Wear", 
    description: "Custom training apparel made to move with your team.", 
    image: PerformanceWearImage, // Pass the imported variable directly (no quotes)
    eyebrow: "Move with purpose" 
  },

  { 
    slug: "teamwear", 
    name: "Teamwear", 
    description: "Custom kits for clubs, schools, and the people who show up.", 
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1100&q=85", 
    eyebrow: "Made as a team" 
  },
  
  { 
    slug: "demo", 
    name: "Demo Category added", 
    description: " This is a demo category for testing purposes. And products in these categories are demo products.", 
    image: Banner, 
    eyebrow: "Hope the site works" 
  },
];