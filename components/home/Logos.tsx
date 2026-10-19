"use client";

import { useContent } from "@/components/providers/ContentProvider";

export function Logos() {
  const { content } = useContent();

  return <section aria-labelledby="trusted-title" className="border-y border-border bg-background-subtle py-14">
    <div className="container-site">
      <div className="mx-auto mb-8 max-w-2xl text-center"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">Trusted by teams</p><h2 id="trusted-title" className="font-heading text-3xl font-bold text-heading sm:text-4xl">Gear up. Show up. Stand out.</h2><p className="mt-3 text-muted">We’re proud to outfit clubs and communities built around showing up for one another.</p></div>
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-5 sm:gap-8">{content.companies.map((company, index) => <div key={company.id} className="flex min-w-56 items-center justify-center gap-3 rounded-xl border border-border bg-white px-7 py-5 shadow-sm"><span className={`${index % 2 === 0 ? "rounded-lg bg-brand text-white" : "rounded-full border-2 border-brand text-brand"} grid size-10 place-items-center font-heading text-xl font-extrabold`}>{company.monogram}</span><span className="font-heading text-xl font-extrabold uppercase tracking-wide text-heading">{company.name}<br /><small className="text-xs font-semibold tracking-[0.18em] text-muted">{company.label}</small></span></div>)}</div>
    </div>
  </section>;
}
