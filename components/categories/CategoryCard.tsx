import type { Category } from "@/data/categories";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category }: { category: Category }) {
  return <article 
  className="group relative isolate min-h-72 overflow-hidden rounded-2xl bg-slate-800 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none">
    <Image src={category.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" 
    className="z-0 object-cover transition duration-500 group-hover:scale-105" />
    <div className="absolute inset-0 z-10 bg-[linear-gradient(0deg,rgba(5,12,28,0.95)_0%,rgba(5,12,28,0.72)_45%,rgba(5,12,28,0.08)_100%)]" />
    <div className="relative z-20 flex min-h-72 flex-col justify-end p-6 text-white sm:p-8">
      <p style={{ color: "#FFFFFF" }} className="mb-2 text-xs font-bold uppercase tracking-[0.16em] drop-shadow-sm">{category.eyebrow}</p>
      <h3 style={{ color: "#FFFFFF" }} className="font-heading text-3xl font-bold drop-shadow-sm">{category.name}</h3>
      <p style={{ color: "#E5E7EB" }} className="mt-2 max-w-lg drop-shadow-sm">{category.description}</p>
      <Link style={{ color: "#FFFFFF" }} className="mt-5 inline-flex w-fit items-center gap-2 font-bold underline decoration-white/80 underline-offset-4 drop-shadow-sm hover:decoration-white" href={`/categories/${category.slug}`} aria-label={`Explore ${category.name}`}>Explore category <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
