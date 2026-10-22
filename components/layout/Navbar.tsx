"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useQuote } from "@/components/quote/QuoteModal";
import Logo from "@/public/images/logo.png";

export function Navbar() {
  const pathname = usePathname();
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
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-site relative flex min-h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="Activewear Custom home" className="flex shrink-0 items-center">
          <Image src={Logo} alt="" width={138} height={40} className="site-logo-image block h-[50px] w-[120px] shrink-0 object-contain object-left sm:h-10 sm:w-[138px]" />
        </Link>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button type="button" className="rounded-md p-2 text-heading" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="primary-navigation" onClick={() => setMobileOpen((open) => !open)}>
            <span aria-hidden="true" className="text-2xl leading-none">{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
        <nav id="primary-navigation" aria-label="Primary navigation" className={`${mobileOpen ? "absolute left-0 right-0 top-full block border-b border-border bg-surface p-5 shadow-lg" : "hidden"} lg:order-2 lg:static lg:block lg:bg-transparent lg:p-0 lg:shadow-none`}>
          <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1">
            <li><Link aria-current={pathname === "/" ? "page" : undefined} className={`block rounded-md px-3 py-2 font-semibold ${pathname === "/" ? "bg-brand-soft text-brand" : "text-heading hover:bg-background-subtle"}`} href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
            <li className="relative" ref={menuRef} onMouseEnter={() => { if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) setCategoriesOpen(true); }}>
              <div className={`flex w-full items-center rounded-md lg:w-auto ${pathname.startsWith("/categories") ? "bg-brand-soft" : "hover:bg-background-subtle"}`}>
                <Link href="/categories" aria-current={pathname === "/categories" ? "page" : undefined} onClick={() => { setCategoriesOpen(false); setMobileOpen(false); }} className={`rounded-l-md px-3 py-2 font-semibold ${pathname.startsWith("/categories") ? "text-brand" : "text-heading"}`}>Categories</Link>
                <button type="button" aria-label={categoriesOpen ? "Close categories menu" : "Open categories menu"} aria-expanded={categoriesOpen} aria-controls="categories-menu" onClick={() => setCategoriesOpen((open) => !open)} className="grid size-9 shrink-0 place-items-center rounded-r-md text-heading hover:bg-brand-soft hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
                  <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <div id="categories-menu" aria-hidden={!categoriesOpen} inert={!categoriesOpen} className={`relative mt-1 w-full overflow-hidden transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:absolute lg:left-0 lg:top-full lg:mt-0 lg:w-[min(90vw,34rem)] lg:pt-3 ${categoriesOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0 hidden lg:block"}`} onMouseLeave={() => { if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) setCategoriesOpen(false); }}><div className="rounded-xl border border-border bg-surface p-2 shadow-dropdown lg:p-4"><MegaMenu onNavigate={() => { setCategoriesOpen(false); setMobileOpen(false); }} /></div></div>
            </li>
            <li><Link aria-current={pathname === "/about" ? "page" : undefined} className={`block rounded-md px-3 py-2 font-semibold ${pathname === "/about" ? "bg-brand-soft text-brand" : "text-heading hover:bg-background-subtle"}`} href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
            <li><Link aria-current={pathname === "/gallery" ? "page" : undefined} className={`block rounded-md px-3 py-2 font-semibold ${pathname === "/gallery" ? "bg-brand-soft text-brand" : "text-heading hover:bg-background-subtle"}`} href="/gallery" onClick={() => setMobileOpen(false)}>Gallery</Link></li>
            <li><Link aria-current={pathname === "/contact" ? "page" : undefined} className={`block rounded-md px-3 py-2 font-semibold ${pathname === "/contact" ? "bg-brand-soft text-brand" : "text-heading hover:bg-background-subtle"}`} href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
            <li className="pt-2 lg:hidden"><SocialLinks /><button type="button" onClick={() => { setMobileOpen(false); openQuote(); }} className="mt-2 w-full rounded-md bg-brand px-4 py-2.5 font-semibold text-on-brand transition hover:bg-brand-hover">Request a quote</button></li>
          </ul>
        </nav>
        <div className="hidden shrink-0 items-center gap-2 lg:order-3 lg:flex"><ThemeToggle /><SocialLinks /><button type="button" onClick={() => openQuote()} className="rounded-md bg-brand px-4 py-2.5 font-semibold text-on-brand transition hover:bg-brand-hover">Request a quote</button></div>
      </div>
    </header>
  );
}
