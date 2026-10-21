"use client";

import { useState } from "react";
import { useContent } from "@/components/providers/ContentProvider";

export function FAQ() {
  const { content } = useContent();
  const faqs = content.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
          <h2 id="faq-title" className="heading-section">Frequently asked questions</h2>
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
                  onClick={() => setOpenIndex((current) => current === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-heading"
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="text-xl text-brand">{openIndex === index ? "−" : "+"}</span>
                </button>
              </h3>
              {openIndex === index && (
                <div id={`faq-answer-${index}`} className="pb-5 pr-10 text-muted">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
