"use client";

import * as React from "react";
import Link from "next/link";

import { Menu, Github } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FloatingHeader } from "@/components/layout/floating-header";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <FloatingHeader>
      {/* Logo / Left Side */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-white"
        >
          <div className="h-6 w-6 rounded bg-linear-to-br from-white to-zinc-500" />
          <span
            className={cn("hidden md:block transition-opacity duration-300")}
          >
            MayR Registry
          </span>
        </Link>
      </div>

      {/* Right Side / Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="https://github.com/MayR-Labs/mayrlabs-js"
          target="_blank"
          rel="noreferrer"
          className="hidden md:block"
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

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-zinc-950 border-zinc-800 p-0"
          >
            <SheetHeader className="p-6 text-left border-b border-zinc-800">
              <SheetTitle className="text-white flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-linear-to-br from-white to-zinc-500" />
                MayR Registry
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col p-6 space-y-4">
              <div className="pt-4 border-t border-zinc-800">
                <Link
                  href="https://github.com/MayR-Labs/mayrlabs-js"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </FloatingHeader>
  );
}
