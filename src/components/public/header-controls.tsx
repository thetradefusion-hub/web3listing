"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TELEGRAM_SUPPORT } from "@/lib/constants";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function PublicMobileNav() {
  const [open, setOpen] = useState(false);

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
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle className="text-muted-foreground hover:text-foreground" />
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <TelegramAnchor href={TELEGRAM_SUPPORT}>Telegram Support</TelegramAnchor>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button className="lh-btn-cta w-full" asChild>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    Get started
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
        className="hidden text-muted-foreground hover:text-foreground lg:inline-flex"
        asChild
      >
        <TelegramAnchor href={TELEGRAM_SUPPORT}>Telegram</TelegramAnchor>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden text-muted-foreground hover:text-foreground md:inline-flex"
        asChild
      >
        <Link href="/login">Log in</Link>
      </Button>
      <Button
        size="sm"
        className="lh-btn-cta h-9 rounded-lg px-3 text-xs font-semibold shadow-sm sm:h-9 sm:px-4 sm:text-sm"
        asChild
      >
        <Link href="/signup">
          <span className="sm:hidden">Start</span>
          <span className="hidden sm:inline">Get started</span>
        </Link>
      </Button>
    </div>
  );
}
