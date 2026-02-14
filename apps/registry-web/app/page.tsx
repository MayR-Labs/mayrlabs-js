import Link from "next/link";
import { Code2, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <div className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v0.1.0 is now available
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent pb-4">
            MayR Labs Registry
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Beautifully designed components that you can copy and paste into
            your apps. Accessible. Customizble. Open Source.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/blocks">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200"
              >
                Browse Blocks
              </Button>
            </Link>
            <Link
              href="https://github.com/MayR-Labs/mayrlabs-js"
              target="_blank"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-zinc-800 hover:bg-zinc-900 hover:text-white"
              >
                GitHub
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-white">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CLI Integration</h3>
            <p className="text-zinc-400">
              Install components directly from your terminal using the shadcn
              CLI or our wrapper.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-white">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Copy & Paste</h3>
            <p className="text-zinc-400">
              Just copy the code and paste it into your project. You own the
              code.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-white">
              <Copy className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Framework Agnostic</h3>
            <p className="text-zinc-400">
              Components available for React and Vue. Use what works for you.
            </p>
          </div>
        </section>

        {/* Quick Start */}
        <section className="max-w-3xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Start</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">
                1. Initialize the registry in your project
              </p>
              <div className="bg-black rounded-lg p-4 font-mono text-sm border border-zinc-800 flex items-center justify-between group">
                <span className="text-zinc-300">
                  npx <span className="text-blue-400">shadcn@latest</span> init
                </span>
                <Copy className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 cursor-pointer" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">2. Add a component</p>
              <div className="bg-black rounded-lg p-4 font-mono text-sm border border-zinc-800 flex items-center justify-between group">
                <span className="text-zinc-300">
                  npx <span className="text-blue-400">shadcn@latest</span> add
                  @mayrlabs/floating-header
                </span>
                <Copy className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 cursor-pointer" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
