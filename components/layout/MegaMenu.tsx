import Link from "next/link";
import { useContent } from "@/components/providers/ContentProvider";

export function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { content } = useContent();
  const categories = content.categories;
  return (
    <nav aria-label="Product categories" className="grid gap-2 sm:grid-cols-2">
      {categories.map((category) => (
        <div key={category.slug} className="rounded-xl p-4 transition hover:bg-background-subtle">
          <Link href={`/categories/${category.slug}`} onClick={onNavigate} className="group block focus-visible:outline-brand">
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-brand">{category.eyebrow}</span>
            <span className="block font-heading text-xl font-bold text-heading group-hover:text-brand">{category.name}</span>
            <span className="mt-1 block text-sm text-muted">{category.description}</span>
          </Link>
          {category.subcategories?.length ? <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3">{category.subcategories.map((subcategory) => <li key={subcategory.slug}><Link href={`/categories/${subcategory.slug}`} onClick={onNavigate} className="text-sm font-semibold text-heading hover:text-brand">{subcategory.name}</Link></li>)}</ul> : null}
        </div>
      ))}
      <Link href="/categories" onClick={onNavigate} className="rounded-xl p-4 text-sm font-semibold text-brand hover:bg-background-subtle">Browse all categories →</Link>
    </nav>
  );
}
