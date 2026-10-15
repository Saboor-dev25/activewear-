import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/home/FAQ";
import { Hero } from "@/components/home/Hero";
import { Logos } from "@/components/home/Logos";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { categories } from "@/data/categories";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollReveal><section className="container-site section-padding" aria-labelledby="featured-title">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand">Built for your team</p><h2 id="featured-title" className="heading-section">Explore our categories</h2></div>
          <Link className="hidden font-semibold text-brand underline-offset-4 hover:underline sm:inline" href="/categories">View all categories →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">{categories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div>
        <Link className="mt-6 inline-flex font-semibold text-brand sm:hidden" href="/categories">View all categories →</Link>
      </section></ScrollReveal>
      <ScrollReveal><Process /></ScrollReveal>
      <ScrollReveal><Logos /></ScrollReveal>
      <ScrollReveal><Testimonials /></ScrollReveal>
      <ScrollReveal><FAQ /></ScrollReveal>
      <ScrollReveal><CTA /></ScrollReveal>
    </main>
  );
}
