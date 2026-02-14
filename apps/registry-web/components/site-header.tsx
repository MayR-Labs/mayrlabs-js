import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white"
          >
            <div className="h-6 w-6 rounded bg-gradient-to-br from-white to-zinc-500" />
            MayR Registry
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/blocks" className="hover:text-white transition-colors">
              Blocks
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Documentation
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/MayR-Labs/mayrlabs-js"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
