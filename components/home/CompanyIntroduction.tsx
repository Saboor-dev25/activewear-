import Image from "next/image";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

const benefits = [
  {
    title: "Custom Designs",
    description: "Bring your colors, logo, and team identity to every piece.",
  },
  {
    title: "Quality Materials",
    description: "Choose performance fabrics suited to your sport and style.",
  },
  {
    title: "Tailored Solutions",
    description: "Explore fit, size, and apparel options for your team.",
  },
];

export function CompanyIntroduction() {
  return (
    <section aria-labelledby="company-intro-title" className="section-padding overflow-hidden">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">Made for teams in motion</p>
          <MaskedHeading id="company-intro-title" className="heading-section">Your Vision. Our Craft.</MaskedHeading>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We help teams bring their identity to life with custom activewear for practice, competition, and everything in between.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {benefits.map((benefit, index) => (
              <li key={benefit.title} className="group flex gap-3 rounded-xl border border-border bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft font-heading text-lg font-bold text-brand transition group-hover:bg-brand group-hover:text-white">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-heading">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-muted">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
          <div aria-hidden="true" className="absolute -right-5 -top-5 h-2/3 w-2/3 rounded-[2rem] bg-brand-soft sm:-right-7 sm:-top-7" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-slate-900 shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/gymwear.jpg"
              alt="Athlete wearing performance training apparel"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-slate-950/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm sm:bottom-7 sm:left-7">
              Built around your team
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
