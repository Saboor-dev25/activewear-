import { CategoryCard } from "@/components/categories/CategoryCard";
import { categories } from "@/data/categories";

export default function CategoriesPage() {
  return <main id="main-content" className="container-site section-padding"><header className="mb-10 max-w-2xl"><p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">Find your fit</p><h1 className="heading-display">Made for the way you move.</h1><p className="mt-4 text-lg text-muted">Explore custom sportswear collections for teams, clubs, and brands.</p></header><div className="grid gap-5 md:grid-cols-2">{categories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div></main>;
}
