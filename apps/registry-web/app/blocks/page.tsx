import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlocksPage() {
  const registryPath = path.join(process.cwd(), "public/registry.json");
  let items = [];
  try {
    if (fs.existsSync(registryPath)) {
      const data = JSON.parse(fs.readFileSync(registryPath, "utf8"));
      items = data.items || [];
    }
  } catch (e) {
    console.error("Failed to load registry", e);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blocks</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Browse our collection of high-quality, copy-paste components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Link
              href={`/blocks/${item.name}`}
              key={item.name}
              className="group flex flex-col justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {item.type}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  {item.name.includes("react") && (
                    <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                      React
                    </span>
                  )}
                  {item.name.includes("vue") && (
                    <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-0.5 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                      Vue
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-zinc-500 group-hover:text-zinc-300 mt-4">
                View Details{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
