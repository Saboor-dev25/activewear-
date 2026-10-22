"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const fieldClass = "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-heading placeholder:text-muted focus:border-brand focus:outline-none";

export function QuoteForm({ productName = "" }: { productName?: string }) {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const quantity = Number(data.get("quantity"));
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid email address."); return; }
    if (!Number.isInteger(quantity) || quantity < 1) { setError("Enter an order quantity of at least 1."); return; }
    setStatus("success");
    form.reset();
  }

  return status === "success" ? (
    <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-5 text-green-900">
      <p className="font-semibold">Your request is ready.</p>
      <p className="mt-1 text-sm">Your request passed the form checks, but it has not been sent. Please contact us directly to follow up.</p>
      <button className="mt-4 font-semibold underline" type="button" onClick={() => setStatus("idle")}>Send another request</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="grid gap-4" aria-label="Request a quote">
      <label className="grid gap-1.5 text-sm font-semibold text-heading">Your name<input className={fieldClass} name="name" autoComplete="name" required minLength={2} /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-heading">Email address<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-heading">Product or category<input className={fieldClass} name="product" defaultValue={productName} placeholder="What are you interested in?" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-heading">Estimated quantity<input className={fieldClass} name="quantity" type="number" min="1" step="1" defaultValue="25" required /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-heading">Project details<textarea className={fieldClass} name="message" rows={3} placeholder="Tell us about your team, timing, or customization needs." required minLength={10} /></label>
      {error && <p role="alert" className="text-sm text-error">{error}</p>}
      <Button type="submit" className="rounded-md bg-brand px-5 py-3 font-semibold text-on-brand transition hover:bg-brand-hover">Send quote request</Button>
      <p className="text-xs text-muted">Requests are not sent or stored on this site yet.</p>
    </form>
  );
}
