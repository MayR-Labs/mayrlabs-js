import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <main className="container mx-auto px-4 pb-24">
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}
