import type { Product } from "@/backend/data/products";
import Image from "next/image";
import Link from "next/link";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";

export function ProductCard({ product }: { product: Product }) {
  return <article className="surface-card overflow-hidden transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none"><Link href={`/products/${product.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-background-muted"><Image src={product.image} alt={product.name} fill quality={90} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectPosition: product.imagePosition ?? "center" }} className="object-contain" /></Link><div className="p-5"><h2 className="font-heading text-2xl font-bold"><Link href={`/products/${product.slug}`} className="hover:text-brand">{product.name}</Link></h2><p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><Link href={`/products/${product.slug}`} className="font-semibold text-brand hover:underline">View details →</Link><QuoteTrigger productName={product.name} label="Request pricing" className="rounded-md border border-brand px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft" /></div></div></article>;
}
