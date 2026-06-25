import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SITE_NAME } from "@/lib/constants";

const legalLinks = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refund", label: "Refund" },
  { href: "/legal/aml-kyc", label: "AML/KYC" },
  { href: "/legal/sla", label: "SLA" },
  { href: "/legal/partner-policy", label: "Partner Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="landing-container py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="mb-4">
              <BrandLogo href="/" size="lg" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Your Web3 Growth Marketplace. Independent consulting and service marketplace.
              We are not affiliated with or endorsed by any exchange, wallet, media company,
              audit provider, or third-party platform unless explicitly stated.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="transition hover:text-primary">Services</Link></li>
              <li><Link href="/about" className="transition hover:text-primary">About Us</Link></li>
              <li><Link href="/blog" className="transition hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="transition hover:text-primary">Contact</Link></li>
              <li><Link href="/signup" className="transition hover:text-primary">Create account</Link></li>
              <li><Link href="/login" className="transition hover:text-primary">Partner login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-1 sm:space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-primary">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}.com — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
