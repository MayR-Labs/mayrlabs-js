import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white"
          >
            <div className="h-5 w-5 rounded bg-zinc-800" />
            MayR Registry
          </Link>
          <p className="text-sm text-zinc-500">
            Beautifully designed components for your applications.
          </p>
        </div>
        <p className="text-sm text-zinc-600">
          Built by{" "}
          <a
            href="https://twitter.com/mayrlabs"
            className="font-medium underline underline-offset-4 hover:text-zinc-300"
          >
            MayR Labs
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/MayR-Labs/mayrlabs-js"
            className="font-medium underline underline-offset-4 hover:text-zinc-300"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
