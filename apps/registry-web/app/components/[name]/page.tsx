import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Terminal, FileCode, Package } from "lucide-react";
import { getAllComponents, getBlock } from "@/lib/registry";
import { CodeBlock } from "@/components/code-block";
import { clientEnv } from "@/lib/env/client";

export async function generateStaticParams() {
  const items = await getAllComponents();
  return items.map((item) => ({
    name: item.name,
  }));
}

export const dynamicParams = false;

interface ComponentPageProps {
  params: {
    name: string;
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { name } = await params;
  const component = await getBlock(name);

  if (!component) {
    notFound();
  }

  const registryUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/r/${component.name}.json`;

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="mb-8">
        <Link
          href="/components"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Components
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {component.title || component.name}
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              {component.description || "No description available."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {component.name.includes("react") && (
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                React
              </span>
            )}
            {component.name.includes("vue") && (
              <span className="inline-flex items-center rounded-full bg-green-400/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                Vue
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300 border border-zinc-700">
              {component.type}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <div className="space-y-10">
          {/* Installation */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-zinc-400" /> Installation
            </h3>

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                  <span className="text-sm font-medium text-zinc-400">
                    Using URL
                  </span>
                </div>
                <div className="p-4">
                  <CodeBlock
                    code={`npx shadcn@latest add ${registryUrl}`}
                    language="bash"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                  <span className="text-sm font-medium text-zinc-400">
                    Using CLI alias
                  </span>
                </div>
                <div className="p-4">
                  <CodeBlock
                    code={`npx shadcn@latest add @mayrlabs/${component.name}`}
                    language="bash"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Source Code */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileCode className="h-5 w-5 text-zinc-400" /> Source Code
            </h3>
            <div className="space-y-8">
              {component.files.map((file) => (
                <div
                  key={file.path}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
                >
                  {file.content && (
                    <CodeBlock
                      code={file.content}
                      filename={file.path}
                      language={file.path.endsWith(".vue") ? "vue" : "tsx"}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h4 className="font-semibold mb-4 text-sm text-zinc-300 flex items-center gap-2">
              <Package className="h-4 w-4" /> Dependencies
            </h4>

            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Registry
                </h5>
                {component.registryDependencies &&
                component.registryDependencies.length > 0 ? (
                  <ul className="space-y-2">
                    {component.registryDependencies.map((dep) => (
                      <li
                        key={dep}
                        className="text-sm text-zinc-400 flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500/50" />
                        {dep}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-600 italic">
                    No registry dependencies
                  </p>
                )}
              </div>

              <div>
                <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  NPM
                </h5>
                {component.dependencies && component.dependencies.length > 0 ? (
                  <ul className="space-y-2">
                    {component.dependencies.map((dep) => (
                      <li
                        key={dep}
                        className="text-sm text-zinc-400 flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500/50" />
                        {dep}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-600 italic">
                    No NPM dependencies
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
