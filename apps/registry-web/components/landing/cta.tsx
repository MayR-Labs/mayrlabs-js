"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CTA() {
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <section className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to get started?
        </h2>
        <p className="text-zinc-400 text-lg">
          Add components to your project in seconds.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-zinc-400 px-1">
            <span>Initialize registry</span>
            <span className="text-xs text-zinc-600 font-mono">Terminal</span>
          </div>
          <div className="group relative bg-black rounded-xl border border-zinc-800 p-4 font-mono text-sm transition-colors hover:border-zinc-700">
            {/* Window controls */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>

            <div className="flex items-center justify-between overflow-x-auto">
              <span className="text-zinc-300 pr-12">
                <span className="text-green-400">$</span> npx shadcn@latest init
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard("npx shadcn@latest init", "init")
                }
                className="p-2 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all absolute right-2 top-2"
                title="Copy command"
              >
                {copied === "init" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-zinc-400 px-1">
            <span>Add a component</span>
          </div>
          <div className="group relative bg-black rounded-xl border border-zinc-800 p-4 font-mono text-sm transition-colors hover:border-zinc-700">
            {/* Window controls */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>

            <div className="flex items-center justify-between overflow-x-auto">
              <span className="text-zinc-300 pr-12">
                <span className="text-green-400">$</span> npx shadcn@latest add
                @mayrlabs/floating-header
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    "npx shadcn@latest add @mayrlabs/floating-header",
                    "add",
                  )
                }
                className="p-2 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all absolute right-2 top-2"
                title="Copy command"
              >
                {copied === "add" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
