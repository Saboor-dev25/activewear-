import { notFound } from "next/navigation";
import Link from "next/link";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { ProductCard } from "@/components/products/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { Suspense } from "react";

export default function CategoryPage({ params }: {
  params: Promise<{ slug: string }>;
}) {
  return <Suspense fallback={<main id="main-content" className="container-site section-padding" aria-live="polite">Loading category…</main>}><CategoryContent params={params} /></Suspense>;
}

async function CategoryContent({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryProducts = products.filter((product) => product.categorySlug === category.slug);

  return <main id="main-content"><section className="container-site py-14 sm:py-20"><nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted"><Link href="/categories" className="hover:text-brand">Categories</Link><span aria-hidden="true"> / </span><span className="text-heading">{category.name}</span></nav><div className="max-w-3xl"><p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">{category.eyebrow}</p><h1 className="heading-display">{category.name}</h1><p className="mt-4 text-lg text-muted">{category.description}</p></div></section><section className="container-site pb-20" aria-labelledby="products-title"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><h2 id="products-title" className="heading-section">Explore the collection</h2><span className="text-sm text-muted">{categoryProducts.length} products</span></div>{categoryProducts.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categoryProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="rounded-xl border border-border bg-background-subtle p-8 text-center"><h3 className="font-heading text-2xl font-bold">New products are on the way</h3><p className="mt-2 text-muted">Ask us about custom {category.name.toLowerCase()} while we prepare this collection.</p></div>}</section><section className="container-site pb-20" aria-label="Other categories"><h2 className="mb-6 font-heading text-2xl font-bold">Explore another category</h2><div className="grid gap-5 md:grid-cols-2">{categories.filter((item) => item.slug !== category.slug).map((item) => <CategoryCard key={item.slug} category={item} />)}</div></section></main>;
}
