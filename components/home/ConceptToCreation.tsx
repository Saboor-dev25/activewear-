import Image from "next/image";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

const stages = [
  {
    title: "Design",
    description: "Shape your colors, artwork, and details with your designer.",
  },
  {
    title: "Production",
    description: "Once you approve the production art, manufacturing begins.",
  },
  {
    title: "Delivery",
    description: "Your finished order is shipped to your team.",
  },
];

export function ConceptToCreation() {
  return (
    <section aria-labelledby="concept-title" className="section-padding bg-background-subtle">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">A clear path from idea to kit</p>
            <MaskedHeading id="concept-title" className="heading-section">From Concept to Creation</MaskedHeading>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Follow your custom apparel from the first design details through production and delivery.
            </p>

            <ol className="mt-8 space-y-4">
              {stages.map((stage, index) => (
              <li key={stage.title} className="group flex gap-4 rounded-xl border border-border bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-heading text-lg font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-heading text-xl font-bold text-heading">{stage.title}</h3>
                      {index < stages.length - 1 && <span aria-hidden="true" className="font-semibold text-brand">→</span>}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-2/3 w-2/3 rounded-[2rem] bg-brand/10 sm:-bottom-6 sm:-left-6" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-slate-900 shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/football.jpg"
                alt="Football player wearing a team kit on the field"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 45vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
              <p className="absolute bottom-5 left-5 font-heading text-2xl font-bold text-white sm:bottom-7 sm:left-7 sm:text-3xl">Made for the next match</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
