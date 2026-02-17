"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Github } from "lucide-react";

export function FloatingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Blocks", href: "/blocks" },
    { name: "Documentation", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full xxxflex xxxjustify-center xxxpt-4 xxxpx-4 xxxmin-h-20 max-w-[1200px] mx-auto print:hidden">
      <nav
        className={cn(
          "flex items-center justify-between px-6 py-3 transition-all duration-500 ease-in-out mx-auto",
          isScrolled
            ? "rounded-full  shadow-lg  backdrop-blur-xl w-[90%] mt-2"
            : "bg-transparent w-full max-w-[1200px] border-transparent"
        )}
      >
        {/* Logo / Left Side */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-white"
          >
            <div className="h-6 w-6 rounded bg-linear-to-br from-white to-zinc-500" />
            <span
              className={cn(
                "hidden md:block transition-opacity duration-300",
                isScrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              MayR Registry
            </span>
            <span className={cn("md:hidden", isScrolled && "hidden")}>MR</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  pathname === item.href ? "text-white" : "text-zinc-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
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
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-white block py-2",
                      pathname === item.href ? "text-white" : "text-zinc-400"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
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
      </nav>
    </header>
  );
}
