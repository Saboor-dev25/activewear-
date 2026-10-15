import Image from "next/image";
import Link from "next/link";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import Banner from "@/public/images/banner.png";

export function Hero() {
  return (
    <section aria-labelledby="home-hero-title" className="relative isolate flex min-h-[min(78vh,760px)] items-center overflow-hidden bg-slate-900">
      
      <Image src={Banner} alt="Athlete training outdoors" fill priority unoptimized sizes="100vw" className="z-0 object-cover object-center" />
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,12,28,0.92)_0%,rgba(5,12,28,0.72)_52%,rgba(5,12,28,0.2)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-[#050C1C]/45 to-transparent" />
      <div className="container-site relative z-20 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p style={{ color: "#FFFFFF" }} className="mb-5 text-sm font-bold uppercase tracking-[0.2em] sm:text-base">Custom apparel for teams in motion</p>
          <h1 id="home-hero-title" style={{ color: "#FFFFFF" }} className="heading-display max-w-3xl">Gear that moves <span style={{ color: "#FFFFFF" }}>with you.</span></h1>
          <p style={{ color: "#E5E7EB" }} className="mt-6 max-w-xl text-lg sm:text-xl">Your Premier Custom Uniform Supplier in Dubai, Made Around The Way You Play.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuoteTrigger className="rounded-md bg-brand px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-brand-hover" />
            <Link href="/categories" style={{ color: "#FFFFFF" }} className="rounded-md border border-white/60 px-6 py-3.5 font-semibold transition hover:bg-white/10">Explore products</Link>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-gray-200"><span>Built for movement</span><span>Made for your team</span><span>Designed by you</span></div>
        </div>
      </div>
    </section>
  );
}
