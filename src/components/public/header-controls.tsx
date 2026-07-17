"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Handshake, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const PUBLIC_NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/verify", label: "Verify" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicDesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-0.5 rounded-full border border-border/50 bg-muted/40 p-1 backdrop-blur-sm md:flex">
      {PUBLIC_NAV_LINKS.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
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
        className="size-9 shrink-0 text-muted-foreground hover:text-foreground md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        {open ? (
          <SheetContent side="left" className="w-[min(100vw,300px)] border-border bg-background p-0">
            <div className="flex h-full flex-col p-5">
              <Link href="/" onClick={() => setOpen(false)}>
                <BrandLogo size="lg" />
              </Link>
              <nav className="mt-6 flex flex-1 flex-col gap-1">
                {PUBLIC_NAV_LINKS.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle className="text-muted-foreground hover:text-foreground" />
                </div>
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <TelegramAnchor href={TELEGRAM_SUPPORT}>Telegram Support</TelegramAnchor>
                </Button>
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button className="lh-btn-cta w-full rounded-xl" asChild>
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
      <ThemeToggle className="hidden size-9 text-muted-foreground hover:text-foreground sm:inline-flex" />
      <Button
        variant="ghost"
        size="sm"
        className="hidden rounded-full text-muted-foreground hover:text-foreground lg:inline-flex"
        asChild
      >
        <TelegramAnchor href={TELEGRAM_SUPPORT}>Telegram</TelegramAnchor>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden rounded-full text-muted-foreground hover:text-foreground md:inline-flex"
        asChild
      >
        <Link href="/login">Log in</Link>
      </Button>
      <Button
        size="sm"
        className="lh-btn-cta h-9 rounded-full px-3 text-xs font-semibold shadow-sm sm:h-9 sm:gap-1.5 sm:px-4 sm:text-sm"
        asChild
      >
        <Link href="/become-a-partner">
          <Handshake className="hidden size-3.5 sm:block" />
          <span className="sm:hidden">Partner</span>
          <span className="hidden sm:inline">Become our partner</span>
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
