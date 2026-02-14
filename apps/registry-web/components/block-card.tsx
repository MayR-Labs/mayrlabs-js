import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RegistryItem } from "@/lib/registry";

interface BlockCardProps {
  block: RegistryItem;
}

export function BlockCard({ block }: BlockCardProps) {
  return (
    <Link
      href={`/blocks/${block.name}`}
      className="group flex flex-col justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            {block.type}
          </span>
          <div className="flex gap-2">
            {block.name.includes("react") && (
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                React
              </span>
            )}
            {block.name.includes("vue") && (
              <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-0.5 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                Vue
              </span>
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
          {block.title || block.name}
        </h2>
        <p className="text-sm text-zinc-400 line-clamp-2">
          {block.description || "No description available."}
        </p>
      </div>

      <div className="flex items-center text-sm text-zinc-500 group-hover:text-zinc-300 mt-6 pt-4 border-t border-zinc-800/50">
        View Details{" "}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
