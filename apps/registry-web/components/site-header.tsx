"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingHeader } from "@/components/layout/floating-header";
import Image from "next/image";

export function SiteHeader() {
  return (
    <FloatingHeader>
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-white"
        >
          <Image
            src="/icons/mayrlabs-mobius-strip.png"
            alt="MayR Labs"
            width={24}
            height={24}
            className="rounded-full"
          />

          <span className="transition-opacity duration-300">MayR Registry</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="https://github.com/MayR-Labs/mayrlabs-js"
          target="_blank"
          rel="noreferrer"
          className=""
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
    </FloatingHeader>
  );
}
