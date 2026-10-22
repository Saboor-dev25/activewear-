"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const fieldClass = "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-heading placeholder:text-muted focus:border-brand focus:outline-none";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const email = new FormData(form).get("email");
    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    setSubmitted(true);
    form.reset();
  }

  if (submitted) return <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-5 text-green-900"><h2 className="font-heading text-2xl font-bold">Thanks for reaching out.</h2><p className="mt-2 text-sm">Your message passed the form checks, but it has not been sent. Please contact us directly to follow up.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-4 font-semibold underline">Send another message</button></div>;

  return <form onSubmit={handleSubmit} className="grid gap-4" aria-label="Contact form"><h2 className="mb-1 font-heading text-2xl font-bold">Send us a message</h2><label className="grid gap-1.5 text-sm font-semibold text-heading">Your name<input className={fieldClass} name="name" autoComplete="name" required minLength={2} /></label><label className="grid gap-1.5 text-sm font-semibold text-heading">Email address<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label><label className="grid gap-1.5 text-sm font-semibold text-heading">Subject<select className={fieldClass} name="subject" defaultValue="quote"><option value="quote">Custom quote</option><option value="products">Product question</option><option value="other">Something else</option></select></label><label className="grid gap-1.5 text-sm font-semibold text-heading">Message<textarea className={fieldClass} name="message" rows={5} required minLength={10} placeholder="How can we help?" /></label>{error && <p role="alert" className="text-sm text-error">{error}</p>}<Button type="submit" className="w-fit rounded-md bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-hover">Send message</Button><p className="text-xs text-muted">Messages are not sent or stored on this site yet.</p></form>;
}
