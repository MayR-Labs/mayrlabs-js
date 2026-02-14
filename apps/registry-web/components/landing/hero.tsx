import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex flex-col items-center text-center space-y-8 py-24 md:py-32">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        v0.1.0 is now available
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent pb-4 max-w-4xl mx-auto">
        MayR Labs Registry
      </h1>

      <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Beautifully designed components that you can copy and paste into your
        apps. Accessible. Customizable. Open Source.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
        <Link href="/blocks">
          <Button
            size="lg"
            className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 w-full sm:w-auto"
          >
            Browse Blocks
          </Button>
        </Link>
        <Link
          href="https://github.com/MayR-Labs/mayrlabs-js"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base border-zinc-800 hover:bg-zinc-900 hover:text-white w-full sm:w-auto"
          >
            GitHub
          </Button>
        </Link>
      </div>
    </section>
  );
}
