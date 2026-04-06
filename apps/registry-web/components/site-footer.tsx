import { Github, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white"
          >
            <Image
              src="/icons/mayrlabs-mobius-strip.png"
              alt="MayR Labs"
              width={32}
              height={32}
              className="rounded-full"
            />
            MayR Registry
          </Link>

          <p className="text-sm text-zinc-500 text-center md:text-left">
            Beautifully designed components for your applications.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://twitter.com/mayrlabs"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://github.com/MayR-Labs/mayrlabs-js"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-zinc-900 text-center text-sm text-zinc-600">
        <p>&copy; {new Date().getFullYear()} MayR Labs. All rights reserved.</p>
      </div>
    </footer>
  );
}
