"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { useContent } from "@/components/providers/ContentProvider";
import { findCategoryBySlug, findCategoryParent } from "@/data/categories";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useContent();
  const product = content.products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main id="main-content" className="container-site section-padding">
        <h1 className="heading-display">Product not found</h1>
        <Link className="mt-5 inline-flex text-brand underline" href="/categories">Browse categories</Link>
      </main>
    );
  }

  const category = findCategoryBySlug(product.subcategorySlug ?? product.categorySlug, content.categories);
  const parent = product.subcategorySlug
    ? findCategoryParent(product.subcategorySlug, content.categories)
    : undefined;

  return (
    <main id="main-content" className="container-site py-10 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/categories" className="hover:text-brand">Categories</Link>
        {parent && <>
          <span aria-hidden="true"> / </span>
          <Link href={`/categories/${parent.slug}`} className="hover:text-brand">{parent.name}</Link>
        </>}
        {category && <>
          <span aria-hidden="true"> / </span>
          <Link href={`/categories/${category.slug}`} className="hover:text-brand">{category.name}</Link>
        </>}
        <span aria-hidden="true"> / </span>
        <span className="text-heading">{product.name}</span>
      </nav>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-background-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">{category?.name ?? "Custom activewear"}</p>
          <h1 className="heading-display">{product.name}</h1>
          <p className="mt-5 text-lg text-muted">{product.description}</p>

          <div className="mt-8">
            <h2 className="font-heading text-2xl font-bold">Made for your team</h2>
            <p className="mt-2 text-muted">{product.materials}</p>
            <ul className="mt-4 grid gap-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-heading">
                  <span className="font-bold text-brand" aria-hidden="true">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7">
            <h3 className="font-heading text-lg font-bold">Available sizes</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <li key={size} className="rounded border border-border px-3 py-1.5 text-sm">{size}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuoteTrigger
              productName={product.name}
              label="Request a quote"
              className="rounded-md bg-brand px-6 py-3.5 font-semibold text-white transition hover:bg-brand-hover"
            />
            {product.sizeChart && (
              <a href={product.sizeChart} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline-offset-4 hover:underline">
                View size chart (PDF) ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
