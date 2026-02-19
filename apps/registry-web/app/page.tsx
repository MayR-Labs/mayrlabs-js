import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <main className="container mx-auto px-4 pb-24">
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}
