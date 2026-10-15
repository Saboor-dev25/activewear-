"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  { src: "/images/legs.jpg", alt: "Runner training on an outdoor path", title: "Find your pace" },
  { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1400&q=85", alt: "Team sharing a moment on the field", title: "Stronger together" },
  { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=85", alt: "Customizable team training shirt", title: "Made for movement" },
  { src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=85", alt: "Athlete in a training session", title: "Ready for more" },
  { src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85", alt: "Athlete stretching before a workout", title: "Everyday effort" },
  { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1400&q=85", alt: "Athlete swimming in a pool", title: "Your next challenge" },
];

export function GalleryViewer() {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (active === null) return;
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((index) => index === null ? null : (index + 1) % images.length);
      if (event.key === "ArrowLeft") setActive((index) => index === null ? null : (index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  return <>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image, index) => <button key={image.src} type="button" className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-background-muted text-left" onClick={() => setActive(index)} aria-label={`Open image: ${image.alt}`}><Image src={image.src} alt={image.alt} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-5 pb-4 pt-12 font-heading text-xl font-bold text-white">{image.title}</span></button>)}</div>
    {active !== null && <div role="dialog" aria-modal="true" aria-label="Gallery image viewer" className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setActive(null); }}><button type="button" autoFocus onClick={() => setActive(null)} className="absolute right-5 top-5 rounded-full px-3 py-2 text-3xl text-white" aria-label="Close image viewer">×</button><button type="button" onClick={() => setActive((active + images.length - 1) % images.length)} className="absolute left-3 z-10 rounded-full bg-black/40 px-4 py-3 text-2xl text-white sm:left-8" aria-label="Previous image">‹</button><figure className="w-full max-w-5xl"><div className="relative aspect-[4/3] max-h-[75vh] overflow-hidden rounded-lg"><Image src={images[active].src} alt={images[active].alt} fill unoptimized sizes="90vw" className="object-contain" /></div><figcaption className="mt-3 text-center text-white">{images[active].title} · {active + 1} of {images.length}</figcaption></figure><button type="button" onClick={() => setActive((active + 1) % images.length)} className="absolute right-3 rounded-full bg-black/40 px-4 py-3 text-2xl text-white sm:right-8" aria-label="Next image">›</button></div>}
  </>;
}
