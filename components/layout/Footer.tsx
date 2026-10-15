import Link from "next/link";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-subtle">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2"><Link href="/" className="font-heading text-2xl font-extrabold uppercase text-heading">Activewear<span className="text-brand">Custom</span></Link><p className="mt-3 max-w-sm text-sm text-muted">Custom activewear made for teams, clubs, and people who move together.</p><QuoteTrigger label="Start a quote →" className="mt-4 inline-flex font-semibold text-brand underline-offset-4 hover:underline" /></div>
        <div><h2 className="mb-3 font-heading text-lg font-bold">Explore</h2><ul className="grid gap-2 text-sm text-muted"><li><Link href="/categories">Categories</Link></li><li><Link href="/about">About</Link></li><li><Link href="/gallery">Gallery</Link></li></ul></div>
        <div><h2 className="mb-3 font-heading text-lg font-bold">Get in touch</h2><ul className="grid gap-2 text-sm text-muted"><li><Link href="/contact">Contact us</Link></li><li><a href="mailto:hello@example.com">hello@example.com</a></li><li><a href="tel:+15550102020">+1 (555) 010-2020</a></li></ul></div>
      </div>
      <div className="border-t border-border"><div className="container-site py-4 text-xs text-muted">© 2026 Activewear Custom. Demo content for preview purposes.</div></div>
    </footer>
  );
}
