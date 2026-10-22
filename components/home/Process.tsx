"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const steps = [
    {
      title: "Submit Your Vision",
      description:
        "Submit a design request via the form at the bottom of any jersey/apparel page.",
    },
    {
      title: "Meet Your Designer",
      description:
        "Your personal designer will create your customs on your own private webpage.",
    },
    {
      title: "Select & Order",
      description:
        "Pick your designs and submit your order via our online form. We’ll send an online invoice for easy payment.",
    },
    {
      title: "Approve & Ship",
      description:
        "Approve your production art and manufacturing begins. Your order will be shipped via free UPS Ground.",
    },
  ];
  const cardShades = ["bg-brand/25", "bg-brand/50", "bg-brand/75", "bg-brand"];

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const badges = section.querySelectorAll<HTMLElement>("[data-process-badge]");
    const icons = section.querySelectorAll<HTMLElement>("[data-process-icon]");
    const connectors = section.querySelectorAll<HTMLElement>("[data-process-connector]");
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 78%", once: true },
    });
    timeline.fromTo(connectors, { scaleX: 0 }, {
      scaleX: 1,
      duration: 0.34,
      stagger: 0.14,
      transformOrigin: "left center",
      ease: "power2.out",
    });
    timeline.fromTo([...badges, ...icons], { y: 12, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.38,
      stagger: 0.12,
      ease: "power3.out",
    }, "-=0.3");
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-title"
      className="section-padding bg-background-subtle"
    >
      <div className="container-site">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">
            Simple from start to finish
          </p>
          <MaskedHeading id="process-title" className="mx-auto heading-section">Your team kit, in four steps</MaskedHeading>
          <p className="mt-3 text-muted">
            A clear path from your first idea to apparel made for your crew.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={`relative rounded-xl border border-brand/20 p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 motion-reduce:translate-y-0 motion-reduce:transition-none ${cardShades[index]} ${index === 3 ? "text-white" : "text-heading"}`}
            >
              <span data-process-badge className={`mb-5 inline-flex size-11 items-center justify-center rounded-full font-heading text-xl font-bold ${index === 3 ? "bg-white/20 text-white" : "bg-white/75 text-brand"}`}>
                0{index + 1}
              </span>
              <span aria-hidden="true" data-process-icon className={`ml-3 inline-flex size-11 -translate-y-5 items-center justify-center rounded-full ${index === 3 ? "bg-white/20 text-white" : "bg-white/75 text-brand"}`}>
                {index === 0 ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M4 17.5 15.5 6l2.5 2.5L6.5 20H4v-2.5Z"/><path d="m13.5 8 2.5 2.5M4 4h5M4 8h3"/></svg>
                ) : index === 1 ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2M8 13h8"/></svg>
                ) : index === 2 ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="9"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/></svg>
                )}
              </span>
              {index < steps.length - 1 && <span aria-hidden="true" data-process-connector className="absolute right-0 top-8 hidden h-0.5 w-5 origin-left translate-x-full bg-brand/50 lg:block" />}
              <h3 className={`font-heading text-xl font-bold ${index === 3 ? "text-white" : "text-heading"}`}>
                {step.title}
              </h3>
              <p className={`mt-2 text-sm ${index === 3 ? "text-white/90" : "text-heading/85"}`}>
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
