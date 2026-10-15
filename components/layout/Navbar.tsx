"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { useQuote } from "@/components/quote/QuoteModal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const { openQuote } = useQuote();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setMobileOpen(false); setCategoriesOpen(false); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="container-site flex min-h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Activewear Custom home" className="shrink-0 font-heading text-2xl font-extrabold uppercase tracking-tight text-heading">Activewear<span className="text-brand">Custom</span></Link>
      <button type="button" className="rounded-md p-2 text-heading lg:hidden" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="primary-navigation" onClick={() => setMobileOpen((open) => !open)}>
          <span aria-hidden="true" className="text-2xl leading-none">{mobileOpen ? "×" : "☰"}</span>
        </button>
        <nav id="primary-navigation" aria-label="Primary navigation" className={`${mobileOpen ? "absolute left-0 right-0 top-full block border-b border-border bg-white p-5 shadow-lg" : "hidden"} lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
          <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1">
            <li className="relative" ref={menuRef}>
              <button type="button" aria-expanded={categoriesOpen} aria-controls="categories-menu" onClick={() => setCategoriesOpen((open) => !open)} onMouseEnter={() => { if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) setCategoriesOpen(true); }} className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 font-semibold text-heading hover:bg-background-subtle lg:w-auto">Categories <span aria-hidden="true">⌄</span></button>
              {categoriesOpen && <div id="categories-menu" className="relative mt-1 w-full rounded-xl border border-border bg-white p-2 shadow-dropdown lg:absolute lg:left-0 lg:top-full lg:mt-3 lg:w-[min(90vw,34rem)] lg:p-4" onMouseLeave={() => { if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) setCategoriesOpen(false); }}><MegaMenu onNavigate={() => { setCategoriesOpen(false); setMobileOpen(false); }} /></div>}
            </li>
            <li><Link className="block rounded-md px-3 py-2 font-semibold text-heading hover:bg-background-subtle" href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
            <li><Link className="block rounded-md px-3 py-2 font-semibold text-heading hover:bg-background-subtle" href="/gallery" onClick={() => setMobileOpen(false)}>Gallery</Link></li>
            <li><Link className="block rounded-md px-3 py-2 font-semibold text-heading hover:bg-background-subtle" href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
            <li className="pt-2 lg:pt-0"><button type="button" onClick={() => { setMobileOpen(false); openQuote(); }} className="w-full rounded-md bg-brand px-4 py-2.5 font-semibold text-on-brand transition hover:bg-brand-hover lg:w-auto">Request a quote</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
