"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import Banner from "@/public/images/mainbanner.webp";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(section.querySelectorAll<HTMLElement>("[data-hero-copy], [data-hero-action]"), { clearProps: "all" });
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .fromTo("[data-hero-copy]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.08, ease: "power2.out" })
      .fromTo("[data-hero-action]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.1, ease: "power2.out" }, "-=0.12");
    return () => timeline.kill();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} aria-labelledby="home-hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-heading">
      <Image src={Banner} alt="Athlete training outdoors" fill priority sizes="100vw" className="z-0 object-cover object-[40%_center] sm:object-center" />
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,12,28,0.92)_0%,rgba(5,12,28,0.72)_52%,rgba(5,12,28,0.2)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-[#050C1C]/45 to-transparent" />
      <div className="container-site relative z-20 py-16 sm:py-28">
        <div className="max-w-3xl">
          <p data-hero-copy style={{ color: "#FFFFFF" }} className="mb-5 text-sm font-bold uppercase tracking-[0.2em] sm:text-base">Custom apparel for teams in motion</p>
          <MaskedHeading as="h1" id="home-hero-title" style={{ color: "#FFFFFF" }} className="heading-display max-w-3xl">Gear that moves with you.</MaskedHeading>
          <p data-hero-copy style={{ color: "#E5E7EB" }} className="mt-6 max-w-xl text-lg sm:text-xl">Your Premier Custom Uniform Supplier in Dubai, Made Around The Way You Play.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span data-hero-action><QuoteTrigger className="rounded-md bg-brand px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-brand-hover" /></span>
            <span data-hero-action><Link href="/categories" style={{ color: "#FFFFFF" }} className="rounded-md border border-white/60 px-6 py-3.5 font-semibold transition hover:bg-white/10">Explore products</Link></span>
          </div>
          <div data-hero-copy className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-gray-200"><span>Built for movement</span><span>Made for your team</span><span>Designed by you</span></div>
        </div>
      </div>
    </section>
  );
}
