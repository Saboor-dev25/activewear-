"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/providers/ContentProvider";
import { MaskedHeading } from "@/components/ui/MaskedHeading";

export function FAQ() {
  const { content } = useContent();
  const faqs = content.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [closingIndices, setClosingIndices] = useState<number[]>([]);
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null);
  const closeTimers = useRef(new Map<number, number>());
  const enterFrame = useRef<number | null>(null);

  useEffect(() => () => {
    closeTimers.current.forEach((timer) => window.clearTimeout(timer));
    if (enterFrame.current !== null) window.cancelAnimationFrame(enterFrame.current);
  }, []);

  function scheduleClose(index: number) {
    const existingTimer = closeTimers.current.get(index);
    if (existingTimer) window.clearTimeout(existingTimer);
    setClosingIndices((current) => current.includes(index) ? current : [...current, index]);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    const timer = window.setTimeout(() => {
      setClosingIndices((current) => current.filter((closingIndex) => closingIndex !== index));
      closeTimers.current.delete(index);
    }, delay);
    closeTimers.current.set(index, timer);
  }

  function cancelClose(index: number) {
    const timer = closeTimers.current.get(index);
    if (timer) window.clearTimeout(timer);
    closeTimers.current.delete(index);
    setClosingIndices((current) => current.filter((closingIndex) => closingIndex !== index));
  }

  return (
    <section aria-labelledby="faq-title" className="section-padding bg-background-subtle">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }).replace(/</g, "\\u003c") }} />
      <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-brand">Good to know</p>
          <MaskedHeading id="faq-title" className="heading-section">Frequently asked questions</MaskedHeading>
          <p className="mt-3 text-muted">A few quick answers before you start a project.</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq, index) => (
            <div key={faq.id ?? faq.question}>
              <h3>
                <button
                  type="button"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => {
                    if (openIndex === index) {
                      setOpenIndex(null);
                      scheduleClose(index);
                      return;
                    }
                    if (openIndex !== null) scheduleClose(openIndex);
                    cancelClose(index);
                    setEnteringIndex(index);
                    setOpenIndex(index);
                    if (enterFrame.current !== null) window.cancelAnimationFrame(enterFrame.current);
                    enterFrame.current = window.requestAnimationFrame(() => setEnteringIndex((current) => current === index ? null : current));
                  }}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-heading"
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="text-xl text-brand">{openIndex === index ? "−" : "+"}</span>
                </button>
              </h3>
              {(openIndex === index || closingIndices.includes(index)) && (
                <div id={`faq-answer-${index}`} aria-hidden={openIndex !== index} inert={openIndex !== index} className={`overflow-hidden pb-5 pr-10 text-muted transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${openIndex === index && enteringIndex !== index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`}>{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
