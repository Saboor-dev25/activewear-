"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = element.getBoundingClientRect();
    if (bounds.top <= window.innerHeight) return;

    element.classList.remove("opacity-100", "translate-y-0");
    element.classList.add("opacity-0", "translate-y-4");

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.remove("opacity-0", "translate-y-4");
      element.classList.add("opacity-100", "translate-y-0");
      observer.disconnect();
    }, { threshold: 0.08 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="translate-y-0 opacity-100 transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">{children}</div>;
}
