"use client";

import { useQuote } from "@/components/quote/QuoteModal";

export function QuoteTrigger({ label = "Request a quote", productName, className = "" }: { label?: string; productName?: string; className?: string }) {
  const { openQuote } = useQuote();
  return <button type="button" onClick={() => openQuote(productName)} className={className}>{label}</button>;
}
