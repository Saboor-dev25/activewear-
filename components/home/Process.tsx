"use client";

import { useEffect, useRef, useState } from "react";

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
          <h2 id="process-title" className="heading-section">
            Your team kit, in four steps
          </h2>
          <p className="mt-3 text-muted">
            A clear path from your first idea to apparel made for your crew.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              style={{ transitionDelay: isVisible ? `${index * 120}ms` : "0ms" }}
              className={`surface-card bg-white p-6 transition-[opacity,transform] duration-700 ease-out hover:-translate-y-1 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-brand-soft font-heading text-xl font-bold text-brand">
                0{index + 1}
              </span>
              <h3 className="font-heading text-xl font-bold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
