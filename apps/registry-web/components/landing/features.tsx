import { Terminal, Code2, Copy } from "lucide-react";

export function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
        <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-white">
          <Terminal className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          CLI Integration
        </h3>
        <p className="text-zinc-400">
          Install components directly from your terminal using the shadcn CLI or
          our wrapper.
        </p>
      </div>
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
        <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-white">
          <Code2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">Copy & Paste</h3>
        <p className="text-zinc-400">
          Just copy the code and paste it into your project. You own the code
          and can customize it as you see fit.
        </p>
      </div>
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm">
        <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 text-white">
          <Copy className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          Framework Agnostic
        </h3>
        <p className="text-zinc-400">
          Components available for React and Vue. Use what works for you and
          your team.
        </p>
      </div>
    </section>
  );
}
