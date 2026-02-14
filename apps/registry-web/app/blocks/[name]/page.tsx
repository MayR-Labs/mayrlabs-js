import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Terminal, Copy, Check } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export async function generateStaticParams() {
  const registryPath = path.join(process.cwd(), "public/registry.json");
  if (!fs.existsSync(registryPath)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    return (data.items || []).map((item: any) => ({
      name: item.name,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default function BlockPage({ params }: { params: { name: string } }) {
  const blockPath = path.join(process.cwd(), `public/r/${params.name}.json`);

  if (!fs.existsSync(blockPath)) {
    notFound();
  }

  const block = JSON.parse(fs.readFileSync(blockPath, "utf8"));
  const registryUrl = `https://registry.mayrlabs.com/r/${params.name}.json`;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <Link
            href="/blocks"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blocks
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {block.title || block.name}
              </h1>
              <p className="text-lg text-zinc-400">
                {block.description || "No description available."}
              </p>
            </div>
            <div className="flex gap-2">
              {block.name.includes("react") && (
                <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                  React
                </span>
              )}
              {block.name.includes("vue") && (
                <span className="inline-flex items-center rounded-full bg-green-400/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                  Vue
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div className="space-y-10">
            {/* Installation */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5" /> Installation
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Using URL:</p>
                  <CodeBlock
                    code={`npx shadcn@latest add ${registryUrl}`}
                    language="bash"
                  />
                </div>
                <div>
                  <p className="text-sm text-zinc-400 mb-2">
                    Using CLI alias (if configured):
                  </p>
                  <CodeBlock
                    code={`npx shadcn@latest add @mayrlabs/${block.name}`}
                    language="bash"
                  />
                </div>
              </div>
            </section>

            {/* Source Code */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Source Code</h3>
              <div className="space-y-8">
                {block.files.map((file: any) => (
                  <div key={file.path} className="space-y-2">
                    <CodeBlock
                      code={file.content}
                      filename={file.path}
                      language={file.path.endsWith(".vue") ? "vue" : "tsx"}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Sidebar metadata could go here */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
              <h4 className="font-semibold mb-4 text-sm text-zinc-300">
                Dependencies
              </h4>
              {block.registryDependencies &&
              block.registryDependencies.length > 0 ? (
                <ul className="space-y-2">
                  {block.registryDependencies.map((dep: string) => (
                    <li
                      key={dep}
                      className="text-sm text-zinc-400 flex items-center gap-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      {dep}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">
                  No registry dependencies.
                </p>
              )}

              <h4 className="font-semibold mt-6 mb-4 text-sm text-zinc-300">
                NPM Packages
              </h4>
              {block.dependencies && block.dependencies.length > 0 ? (
                <ul className="space-y-2">
                  {block.dependencies.map((dep: string) => (
                    <li
                      key={dep}
                      className="text-sm text-zinc-400 flex items-center gap-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      {dep}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No extra packages.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
