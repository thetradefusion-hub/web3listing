import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { PublicHeaderActions, PublicMobileNav } from "@/components/public/header-controls";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
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

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <PublicHeaderActions />
      </div>
    </header>
  );
}
