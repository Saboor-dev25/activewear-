"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HeadingTag = "h1" | "h2";

export function MaskedHeading({
  as: Tag = "h2",
  id,
  className,
  style,
  children,
}: {
  as?: HeadingTag;
  id?: string;
  className: string;
  style?: CSSProperties;
  children: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = children.trim().split(/\s+/);

  useGSAP(() => {
    const heading = ref.current;
    if (!heading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = heading.querySelectorAll<HTMLElement>("[data-mask-word]");
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
    });
    timeline.fromTo(targets, { yPercent: 108 }, {
      yPercent: 0,
      duration: 0.58,
      stagger: 0.045,
      ease: "power4.out",
    });
  }, { scope: ref });

  return (
    <Tag ref={ref} id={id} style={style} className={`relative w-fit ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap gap-x-[0.25em]">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.06em]">
            <span data-mask-word className="inline-block">{word}</span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
