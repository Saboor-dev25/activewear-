"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { useContent } from "@/components/providers/ContentProvider";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function FeaturedCategories() {
  const { content } = useContent();
  const categories = content.categories;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const skipAnimation = useRef(false);
  const autoDirection = useRef(1);
  const [position, setPosition] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    const targetCard = track.children[position] as HTMLElement | undefined;
    const x = targetCard ? -(targetCard.offsetLeft - track.offsetLeft) : 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!initialized.current || skipAnimation.current || reduceMotion) {
      gsap.set(track, { x });
      initialized.current = true;
      skipAnimation.current = false;
      return;
    }

    const tween = gsap.to(track, {
      x,
      duration: 0.62,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        if (position !== 0 && position !== categories.length + 1) return;
        skipAnimation.current = true;
        setPosition(position === 0 ? categories.length : 1);
      },
    });
    return () => tween.kill();
  }, { dependencies: [position, categories.length], scope: sectionRef });

  useEffect(() => {
    function alignActiveCard() {
      const track = trackRef.current;
      const activeCard = track?.children[position] as HTMLElement | undefined;
      if (track && activeCard) gsap.set(track, { x: -(activeCard.offsetLeft - track.offsetLeft) });
    }
    window.addEventListener("resize", alignActiveCard);
    return () => window.removeEventListener("resize", alignActiveCard);
  }, [position, categories.length]);

  useEffect(() => {
    if (categories.length < 2 || isHovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setPosition((current) => {
        if (current >= categories.length) autoDirection.current = -1;
        else if (current <= 1) autoDirection.current = 1;
        return current + autoDirection.current;
      });
    }, 2000);
    return () => window.clearInterval(timer);
  }, [categories.length, isHovered]);

  function showPrevious() {
    setPosition((current) => {
      const next = current - 1;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches && next === 0 ? categories.length : next;
    });
  }

  function showNext() {
    setPosition((current) => {
      const next = current + 1;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches && next === categories.length + 1 ? 1 : next;
    });
  }

  return <section ref={sectionRef} className="container-site section-padding" aria-labelledby="featured-title">
    <div className="mb-8 flex items-end justify-between gap-4">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand">Built for your team</p><MaskedHeading id="featured-title" className="heading-section">Explore our categories</MaskedHeading></div>
      <Link className="hidden font-semibold text-brand underline-offset-4 hover:underline sm:inline" href="/categories">View all categories →</Link>
    </div>
    {categories.length === 0 ? <p className="text-muted">Categories will appear here.</p> : categories.length < 2 ? <div className="grid gap-5 md:grid-cols-2">{categories.map((category) => <CategoryCard key={category.id ?? category.slug} category={category} />)}</div> : <>
      <div className="overflow-hidden" aria-roledescription="carousel" aria-label="Featured categories">
        <div ref={trackRef} className="flex gap-3 sm:gap-5" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {[categories[categories.length - 1], ...categories, categories[0]].map((category, index) => <div
            key={`${index === 0 ? "last-clone" : index === categories.length + 1 ? "first-clone" : "category"}-${category.id ?? category.slug}`}
            aria-hidden={index === 0 || index === categories.length + 1}
            inert={index === 0 || index === categories.length + 1}
            className="min-w-0 shrink-0 basis-full sm:basis-[calc((100%_-_1.25rem)/2)] lg:basis-[calc((100%_-_2.5rem)/3)]"
          ><CategoryCard category={category} /></div>)}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">{position === 0 ? categories.length : position > categories.length ? 1 : position} of {categories.length}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={showPrevious} aria-label="Previous categories" className="grid size-10 place-items-center rounded-full border border-border bg-surface text-heading transition hover:border-brand hover:bg-background-subtle hover:text-brand motion-reduce:transition-none">←</button>
          <button type="button" onClick={showNext} aria-label="Next categories" className="grid size-10 place-items-center rounded-full border border-border bg-surface text-heading transition hover:border-brand hover:bg-background-subtle hover:text-brand motion-reduce:transition-none">→</button>
        </div>
      </div>
    </>}
    <Link className="mt-6 inline-flex font-semibold text-brand sm:hidden" href="/categories">View all categories →</Link>
  </section>;
}
