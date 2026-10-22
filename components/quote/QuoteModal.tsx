"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { QuoteForm } from "@/components/quote/QuoteForm";

type QuoteContextValue = { openQuote: (productName?: string) => void };
const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote() {
  const value = useContext(QuoteContext);
  if (!value) throw new Error("useQuote must be used inside QuoteProvider");
  return value;
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [productName, setProductName] = useState<string>();
  const openQuote = useCallback((product?: string) => setProductName(product ?? ""), []);
  const closeQuote = useCallback(() => setProductName(undefined), []);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      {children}
      {productName !== undefined && <QuoteDialog productName={productName} onClose={closeQuote} />}
    </QuoteContext.Provider>
  );
}

function QuoteDialog({ productName, onClose }: { productName: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])');
        const first = focusable.item(0);
        const last = focusable.item(focusable.length - 1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previousFocus?.focus(); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="quote-title" className="relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-2xl sm:p-9">
        <button type="button" onClick={onClose} aria-label="Close quote request" className="absolute right-4 top-4 rounded-full p-2 text-2xl leading-none text-muted hover:bg-background-muted">×</button>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-brand">Let’s make it yours</p>
        <h2 id="quote-title" className="mb-2 pr-8 font-heading text-3xl font-bold">Request a quote</h2>
        <p className="mb-6 text-muted">Tell us a little about your project. We’ll be in touch with next steps.</p>
        <QuoteForm productName={productName} />
      </section>
    </div>
  );
}
