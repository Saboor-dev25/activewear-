import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/home/FAQ";
import { Hero } from "@/components/home/Hero";
import { Logos } from "@/components/home/Logos";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { CompanyIntroduction } from "@/components/home/CompanyIntroduction";
import { ConceptToCreation } from "@/components/home/ConceptToCreation";

export default function Home() {
  return (
    <main>
      <Hero />
      <CompanyIntroduction />
      <FeaturedCategories />
      <ConceptToCreation />
      <Process />
      <Logos />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
