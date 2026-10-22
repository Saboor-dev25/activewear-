"use client";

import { useEffect, useState, type FocusEvent } from "react";
import { useContent } from "@/components/providers/ContentProvider";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function Testimonials() {
  const { content } = useContent();
  const testimonials = content.testimonials;
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPaused = isHovered || isFocused;

  useEffect(() => {
    if (isPaused || testimonials.length < 2) return;

    const interval = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setActive((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isPaused, testimonials.length]);

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocused(false);
    }
  }

  function showPrevious() {
    setActive((current) => (current - 1 + testimonials.length) % testimonials.length);
  }

  function showNext() {
    setActive((current) => (current + 1) % testimonials.length);
  }

  if (testimonials.length === 0) {
    return <section aria-labelledby="testimonials-title" className="section-padding"><div className="container-site"><MaskedHeading id="testimonials-title" className="heading-section">Teams that feel the difference</MaskedHeading><p className="mt-3 text-muted">Customer stories will appear here.</p></div></section>;
  }
  const displayActive = active % testimonials.length;

  return (
    <section
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      className="section-padding relative isolate overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={handleBlur}
    >
      <div aria-hidden="true" className="testimonial-glow pointer-events-none absolute -left-20 top-10 z-0 size-72 rounded-full opacity-70 blur-3xl" />
      <div aria-hidden="true" className="testimonial-glow pointer-events-none absolute -right-16 bottom-0 z-0 size-80 rounded-full blur-3xl" />
      <div className="container-site relative z-10">
        <div className="mb-9 max-w-2xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">The word is out</p>
          <MaskedHeading id="testimonials-title" className="heading-section">Teams that feel the difference</MaskedHeading>
        </div>

        <div className="overflow-hidden rounded-2xl" aria-live={isPaused ? "polite" : "off"}>
          <div
            className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${displayActive * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <figure key={testimonial.id ?? testimonial.name} aria-roledescription="slide" className="surface-card w-full shrink-0 p-6 sm:p-8">
                <div aria-label="5 out of 5 stars" className="mb-4 tracking-widest text-brand">★★★★★</div>
                <blockquote className="text-lg font-medium leading-relaxed text-heading">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <span className="block font-semibold text-heading">{testimonial.name}</span>
                  <span className="text-sm text-muted">{testimonial.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm text-muted" aria-live="polite">{displayActive + 1} of {testimonials.length}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={showPrevious} aria-label="Previous testimonial" className="grid size-10 place-items-center rounded-full border border-border bg-surface text-heading transition hover:border-brand hover:bg-background-subtle hover:text-brand motion-reduce:transition-none">←</button>
            <button type="button" onClick={showNext} aria-label="Next testimonial" className="grid size-10 place-items-center rounded-full border border-border bg-surface text-heading transition hover:border-brand hover:bg-background-subtle hover:text-brand motion-reduce:transition-none">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
