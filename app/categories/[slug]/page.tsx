"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { ProductCard } from "@/components/products/ProductCard";
import { useContent } from "@/components/providers/ContentProvider";
import { findCategoryBySlug, findCategoryParent } from "@/backend/data/categories";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const [search, setSearch] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const category = findCategoryBySlug(slug, content.categories);

  if (!category) {
    return (
      <main id="main-content" className="container-site section-padding">
        <h1 className="heading-display">Category not found</h1>
        <Link className="mt-5 inline-flex text-brand underline" href="/categories">Browse categories</Link>
      </main>
    );
  }

  const parent = findCategoryParent(slug, content.categories);
  const categoryProducts = content.products.filter((product) => parent
    ? product.categorySlug === parent.slug && product.subcategorySlug === category.slug
    : product.categorySlug === category.slug);
  const filteredProducts = categoryProducts.filter((product) =>
    (!subcategoryFilter || product.subcategorySlug === subcategoryFilter)
    && `${product.name} ${product.description} ${product.materials} ${product.features.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  const relatedCategories = parent ? parent.subcategories ?? [] : category.subcategories ?? [];
  const otherCategories = content.categories.filter((item) => item.slug !== (parent?.slug ?? category.slug));

  return (
    <main id="main-content">
      <section className="container-site py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <Link href="/categories" className="hover:text-brand">Categories</Link>
          {parent && <>
            <span aria-hidden="true"> / </span>
            <Link href={`/categories/${parent.slug}`} className="hover:text-brand">{parent.name}</Link>
          </>}
          <span aria-hidden="true"> / </span>
          <span className="text-heading">{category.name}</span>
        </nav>
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">{category.eyebrow}</p>
          <h1 className="heading-display">{category.name}</h1>
          <p className="mt-4 text-lg text-muted">{category.description}</p>
        </div>
      </section>

      {relatedCategories.length > 0 && (
        <section className="container-site pb-16" aria-labelledby="subcategories-title">
          <h2 id="subcategories-title" className="mb-8 heading-section" style={{ marginBottom: "48px" }}>Shop by collection</h2>
          <div className="mx-1 grid gap-5 md:grid-cols-2 lg:grid-cols-3" style={{ columnGap: "40px", rowGap: "40px" }}>
            {relatedCategories.map((item) => (
              <CategoryCard key={item.id ?? item.slug} category={item} compact />
            ))}
          </div>
        </section>
      )}

      <section className="container-site pb-20" aria-labelledby="products-title">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 id="products-title" className="heading-section">Explore the collection</h2>
          <span className="text-sm text-muted">{filteredProducts.length} products</span>
        </div>
        {categoryProducts.length > 0 && <div className="mb-5 flex flex-wrap gap-3">
          <input className="min-w-64 flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-heading placeholder:text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" />
          {relatedCategories.length > 0 && <select className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-heading" value={subcategoryFilter} onChange={(event) => setSubcategoryFilter(event.target.value)} aria-label="Filter by subcategory"><option value="">All subcategories</option>{relatedCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>}
        </div>}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id ?? product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-background-subtle p-8 text-center">
            <h3 className="font-heading text-2xl font-bold">{categoryProducts.length === 0 ? "New products are on the way" : "No products match those filters"}</h3>
            <p className="mt-2 text-muted">{categoryProducts.length === 0 ? `Ask us about custom ${category.name.toLowerCase()} while we prepare this collection.` : "Try a different search or subcategory."}</p>
          </div>
        )}
      </section>

      {otherCategories.length > 0 && (
        <section className="container-site pb-20" aria-label="Other categories">
          <h2 className="mb-8 font-heading text-2xl font-bold" style={{ marginBottom: "48px" }}>Explore another category</h2>
          <div className="mx-1 grid gap-5 md:grid-cols-2 lg:grid-cols-3" style={{ columnGap: "40px", rowGap: "40px" }}>
            {otherCategories.map((item) => (
              <CategoryCard key={item.id ?? item.slug} category={item} compact />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
