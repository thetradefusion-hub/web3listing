"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TELEGRAM_SUPPORT } from "@/lib/constants";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080d18]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <BrandLogo href="/" size="md" className="sm:text-2xl" />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-slate-400 hover:text-white sm:inline-flex"
            asChild
          >
            <a href={TELEGRAM_SUPPORT} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </Button>
          <Button
            size="sm"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-xs font-semibold text-slate-950 hover:from-cyan-400 sm:text-sm"
            asChild
          >
            <Link href="/login">Agent Login</Link>
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        {open ? (
          <SheetContent side="left" className="w-[min(100vw,300px)] p-0">
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
              <div className="space-y-2 border-t pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href={TELEGRAM_SUPPORT} target="_blank" rel="noopener noreferrer">
                    Telegram Support
                  </a>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Agent Login
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </header>
  );
}
