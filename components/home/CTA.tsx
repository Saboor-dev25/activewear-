import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function CTA() {
  return <section aria-labelledby="quote-cta-title" className="bg-brand py-16 text-white sm:py-20"><div className="container-site flex flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div className="max-w-2xl"><p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-white/85">Your team starts here</p><MaskedHeading id="quote-cta-title" className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">Ready to make something yours?</MaskedHeading><p className="mt-3 text-white/85">Tell us what you’re looking for and let’s get your project moving.</p></div><QuoteTrigger label="Get a custom quote →" className="shrink-0 rounded-md bg-white px-6 py-3.5 font-semibold text-brand transition hover:bg-brand-soft" /></div></section>;
}
