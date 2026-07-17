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
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border/70 bg-background/90 shadow-sm shadow-black/5 backdrop-blur-xl dark:shadow-black/20"
          : "border-border/40 bg-background/70 backdrop-blur-xl"
      )}
    >
      <div className="landing-container flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 md:flex-none">
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
