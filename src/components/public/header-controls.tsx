"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Handshake, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { TelegramPlaneIcon } from "@/components/shared/telegram-plane-icon";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/services", label: "Services" },
  { href: "/verify", label: "Verify" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicDesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-muted/50 p-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:flex"
      aria-label="Primary"
    >
      {PUBLIC_NAV_LINKS.map((link) => {
        const exact = "exact" in link ? link.exact : false;
        const active = isActivePath(pathname, link.href, exact);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground dark:hover:bg-white/[0.06]"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PublicMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        {open ? (
          <SheetContent
            side="left"
            className="w-[min(100vw,320px)] border-border/60 bg-background/95 p-0 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col p-5">
              <Link href="/" onClick={() => setOpen(false)} className="inline-flex">
                <BrandLogo size="lg" />
              </Link>
              <nav className="mt-7 flex flex-1 flex-col gap-1" aria-label="Mobile">
                {PUBLIC_NAV_LINKS.map((link) => {
                  const exact = "exact" in link ? link.exact : false;
                  const active = isActivePath(pathname, link.href, exact);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "text-foreground/90 hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="space-y-2.5 border-t border-border pt-4">
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 px-3 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle className="text-muted-foreground hover:text-foreground" />
                </div>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-start gap-2.5 rounded-xl border-border/80"
                  asChild
                >
                  <TelegramAnchor href={TELEGRAM_SUPPORT} aria-label="Telegram support">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#229ED9]/15 text-[#229ED9]">
                      <TelegramPlaneIcon className="size-4" />
                    </span>
                    Telegram support
                  </TelegramAnchor>
                </Button>
                <Button variant="outline" className="h-11 w-full rounded-xl" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button className="lh-btn-cta h-11 w-full rounded-xl" asChild>
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Become our client
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-start gap-2.5 rounded-xl border-border/80"
                  asChild
                >
                  <Link href="/become-a-partner" onClick={() => setOpen(false)}>
                    <Handshake data-icon="inline-start" className="size-4" />
                    Become our partner
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </>
  );
}

export function PublicHeaderActions() {
  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2">
      <ThemeToggle className="hidden size-9 rounded-full border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] sm:inline-flex" />

      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-full border border-border/60 bg-muted/40 text-[#229ED9] hover:bg-[#229ED9]/15 hover:text-[#2AABEE] dark:border-white/10 dark:bg-white/[0.04]"
        asChild
      >
        <TelegramAnchor href={TELEGRAM_SUPPORT} aria-label="Chat on Telegram" title="Telegram">
          <TelegramPlaneIcon className="size-4" />
        </TelegramAnchor>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="hidden h-9 rounded-full border border-border/60 bg-muted/40 px-3.5 text-muted-foreground hover:bg-muted hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] md:inline-flex"
        asChild
      >
        <Link href="/login">Log in</Link>
      </Button>

      <Button
        size="sm"
        className="lh-btn-cta h-9 rounded-full px-3 text-xs font-semibold shadow-md shadow-primary/20 sm:h-9 sm:gap-1.5 sm:px-4 sm:text-sm"
        asChild
      >
        <Link href="/contact">
          <span className="sm:hidden">Consult</span>
          <span className="hidden sm:inline">Become our client</span>
        </Link>
      </Button>
    </div>
  );
}

export function useHeaderScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
