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
    <footer className="border-t border-white/[0.06] bg-[#060a14]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandLogo href="/" size="lg" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Your Web3 Growth Marketplace. Independent consulting and service marketplace.
              We are not affiliated with or endorsed by any exchange, wallet, media company,
              audit provider, or third-party platform unless explicitly stated.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/services" className="transition hover:text-cyan-400">Services</Link></li>
              <li><Link href="/about" className="transition hover:text-cyan-400">About Us</Link></li>
              <li><Link href="/blog" className="transition hover:text-cyan-400">Blog</Link></li>
              <li><Link href="/contact" className="transition hover:text-cyan-400">Contact</Link></li>
              <li><Link href="/login" className="transition hover:text-cyan-400">Partner Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-cyan-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/[0.06] pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {SITE_NAME}.com — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
