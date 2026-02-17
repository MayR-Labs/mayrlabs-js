"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function FloatingHeader({ className, children }: FloatingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full max-w-[1200px] mx-auto print:hidden">
      <nav
        className={cn(
          "flex items-center justify-between px-6 py-3 transition-all duration-500 ease-in-out mx-auto",
          isScrolled
            ? "rounded-full shadow-lg backdrop-blur-xl w-[90%] mt-2"
            : "bg-transparent w-full max-w-[1200px] border-transparent",
          className
        )}
      >
        {children}
      </nav>
    </header>
  );
}
