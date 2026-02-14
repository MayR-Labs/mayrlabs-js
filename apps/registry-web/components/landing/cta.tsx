import { Copy } from "lucide-react";

export function CTA() {
  return (
    <section className="max-w-3xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
      <h2 className="text-2xl font-semibold mb-6 text-white">Quick Start</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            1. Initialize the registry in your project
          </p>
          <div className="bg-black rounded-lg p-4 font-mono text-sm border border-zinc-800 flex items-center justify-between group overflow-x-auto">
            <span className="text-zinc-300 whitespace-nowrap">
              npx <span className="text-blue-400">shadcn@latest</span> init
            </span>
            <Copy className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 cursor-pointer ml-4" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">2. Add a component</p>
          <div className="bg-black rounded-lg p-4 font-mono text-sm border border-zinc-800 flex items-center justify-between group overflow-x-auto">
            <span className="text-zinc-300 whitespace-nowrap">
              npx <span className="text-blue-400">shadcn@latest</span> add
              @mayrlabs/floating-header
            </span>
            <Copy className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 cursor-pointer ml-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
