import Link from "next/link";
import { categories } from "@/data/categories";

export function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Product categories" className="grid gap-2 sm:grid-cols-2">
      {categories.map((category) => (
        <Link key={category.slug} href={`/categories/${category.slug}`} onClick={onNavigate} className="group rounded-xl p-4 transition hover:bg-background-subtle focus-visible:bg-background-subtle">
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-brand">{category.eyebrow}</span>
          <span className="block font-heading text-xl font-bold text-heading group-hover:text-brand">{category.name}</span>
          <span className="mt-1 block text-sm text-muted">{category.description}</span>
        </Link>
      ))}
      <Link href="/categories" onClick={onNavigate} className="rounded-xl p-4 text-sm font-semibold text-brand hover:bg-background-subtle">Browse all categories →</Link>
    </nav>
  );
}
