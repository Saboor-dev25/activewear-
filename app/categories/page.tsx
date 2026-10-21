"use client";

import { CategoryCard } from "@/components/categories/CategoryCard";
import { useContent } from "@/components/providers/ContentProvider";
import { useState } from "react";

export default function CategoriesPage() {
  const { content } = useContent();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const categories = content.categories.flatMap((category) => {
    if (!normalizedQuery || `${category.name} ${category.description} ${category.eyebrow}`.toLowerCase().includes(normalizedQuery)) return [category];
    const matches = category.subcategories?.filter((item) => `${item.name} ${item.description} ${item.eyebrow}`.toLowerCase().includes(normalizedQuery));
    return matches?.length ? [{ ...category, subcategories: matches }] : [];
  });

  return <main id="main-content" className="container-site section-padding">
    <header className="mb-10 max-w-2xl">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">Find your fit</p>
      <h1 className="heading-display">Made for the way you move.</h1>
      <p className="mt-4 text-lg text-muted">Explore custom sportswear collections for teams, clubs, and brands.</p>
    </header>
    <label className="mb-6 block max-w-lg"><span className="sr-only">Search categories and subcategories</span><input className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories and subcategories" /></label>
    <div className="grid gap-5 md:grid-cols-2">{categories.map((category) => <CategoryCard key={category.id ?? category.slug} category={category} />)}</div>
    {categories.length === 0 && <p className="rounded-xl border border-border bg-background-subtle p-8 text-center text-muted">No collections match that search.</p>}
  </main>;
}
