"use client";

import { BrandLogo } from "@/components/shared/brand-logo";
import {
  PublicDesktopNav,
  PublicHeaderActions,
  PublicMobileNav,
  useHeaderScrolled,
} from "@/components/public/header-controls";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const scrolled = useHeaderScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-border/60 bg-background/85 shadow-lg shadow-black/10 backdrop-blur-2xl dark:border-white/10 dark:bg-black/70 dark:shadow-black/40"
          : "border-border/40 bg-background/60 backdrop-blur-xl dark:border-white/[0.06] dark:bg-black/40"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
        aria-hidden
      />
      <div className="landing-container relative flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2.5 md:flex-none">
          <PublicMobileNav />
          <BrandLogo
            href="/"
            size="md"
            priority
            className="max-w-[min(48vw,180px)] sm:max-w-[200px]"
          />
        </div>

        <PublicDesktopNav />

        <PublicHeaderActions />
      </div>
    </header>
  );
}
