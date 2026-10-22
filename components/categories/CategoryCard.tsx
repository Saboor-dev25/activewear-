import type { Category } from "@/backend/data/categories";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category, compact = false }: { category: Category; compact?: boolean }) {
  return <article 
  className={`group relative isolate overflow-hidden rounded-2xl bg-background-muted transition-transform duration-300 hover:-translate-y-1 active:scale-[1.01] motion-reduce:transition-none ${compact ? "h-[300px] min-h-0 w-full min-w-0" : "aspect-[4/5] min-h-80"}`}>
    <Image src={category.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    style={{ objectPosition: category.imagePosition ?? "center" }}
    className="z-0 object-cover transition duration-500 group-hover:scale-105 group-active:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
    <div className="absolute inset-0 z-10 bg-[linear-gradient(0deg,rgba(5,12,28,0.95)_0%,rgba(5,12,28,0.72)_45%,rgba(5,12,28,0.08)_100%)]" />
    <div className={`relative z-20 flex h-full flex-col justify-end text-white ${compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}>
      <p style={{ color: "#FFFFFF" }} className={`text-xs font-bold uppercase tracking-[0.16em] drop-shadow-sm ${compact ? "mb-1" : "mb-2"}`}>{category.eyebrow}</p>
      <h3 style={{ color: "#FFFFFF" }} className={`font-heading font-bold drop-shadow-sm transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none ${compact ? "text-2xl" : "text-3xl"}`}>{category.name}</h3>
      <p style={{ color: "#E5E7EB" }} className={`max-w-lg drop-shadow-sm ${compact ? "mt-1.5" : "mt-2"}`}>{category.description}</p>
      {category.subcategories?.length ? <ul className={`flex flex-wrap gap-2 ${compact ? "mt-3" : "mt-4"}`} aria-label={`${category.name} subcategories`}>{category.subcategories.map((subcategory) => <li key={subcategory.slug}><Link href={`/categories/${subcategory.slug}`} className={`inline-flex rounded-full border border-white/50 bg-white/10 font-semibold text-white backdrop-blur-sm hover:bg-white/20 ${compact ? "px-2.5 py-1 text-xs" : "px-3 py-1 text-sm"}`}>{subcategory.name}</Link></li>)}</ul> : null}
      <Link style={{ color: "#FFFFFF" }} className={`inline-flex w-fit items-center gap-2 font-bold underline decoration-white/80 underline-offset-4 drop-shadow-sm transition-colors hover:decoration-white ${compact ? "mt-3" : "mt-5"}`} href={`/categories/${category.slug}`} aria-label={`Explore ${category.name}`}>Explore category <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">→</span></Link>
    </div>
  </article>;
}
