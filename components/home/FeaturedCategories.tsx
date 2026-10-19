"use client";

import Link from "next/link";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { useContent } from "@/components/providers/ContentProvider";

export function FeaturedCategories() {
  const { content } = useContent();

  return <section className="container-site section-padding" aria-labelledby="featured-title">
    <div className="mb-8 flex items-end justify-between gap-4">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand">Built for your team</p><h2 id="featured-title" className="heading-section">Explore our categories</h2></div>
      <Link className="hidden font-semibold text-brand underline-offset-4 hover:underline sm:inline" href="/categories">View all categories →</Link>
    </div>
    <div className="grid gap-5 md:grid-cols-2">{content.categories.map((category) => <CategoryCard key={category.id ?? category.slug} category={category} />)}</div>
    <Link className="mt-6 inline-flex font-semibold text-brand sm:hidden" href="/categories">View all categories →</Link>
  </section>;
}
