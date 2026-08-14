import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Send } from "lucide-react";
import { FooterSubscribe } from "@/components/public/footer-subscribe";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { BRAND_LOGO_DARK_PATH, SITE_NAME, TELEGRAM_SUPPORT } from "@/lib/constants";
import { DEFAULT_MANAGER_TELEGRAM_USERNAME } from "@/lib/telegram";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Our Blog" },
  { href: "/become-a-partner", label: "Whitelabel Partnership" },
  { href: "/verify", label: "Verify Partner" },
  { href: "/contact", label: "Become Our Client" },
  { href: "/signup", label: "Create Account" },
  { href: "/login", label: "Partner Login" },
];

const serviceLinks = [
  { href: "/services?category=exchange-listing", label: "Exchange Listing" },
  { href: "/services?category=market-making", label: "Market Making" },
  { href: "/services?category=marketing", label: "Crypto Marketing" },
  { href: "/services?category=development", label: "Blockchain Development" },
  { href: "/services?category=security", label: "Smart Contract Audits" },
  { href: "/services?category=listing-services", label: "CMC & CoinGecko" },
  { href: "/services?category=growth", label: "Launch & Growth" },
];

const moreServiceLinks = [
  { href: "/services?category=marketing", label: "PR Marketing" },
  { href: "/services?category=marketing", label: "Influencer Marketing" },
  { href: "/services?category=marketing", label: "Community Building" },
  { href: "/services?category=listing-services", label: "Wallet Integration" },
  { href: "/services?category=listing-services", label: "Explorer Updates" },
  { href: "/services?category=market-making", label: "Liquidity Lock" },
  { href: "/services?category=security", label: "Token Security" },
  { href: "/services", label: "All Services" },
];

const legalLinks = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refund", label: "Refund" },
  { href: "/legal/aml-kyc", label: "AML/KYC" },
  { href: "/legal/sla", label: "SLA" },
  { href: "/legal/partner-policy", label: "Partner Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-extrabold uppercase tracking-[0.16em] text-white">
      {children}
    </h4>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/60 transition-colors hover:text-chart-2"
      >
        {label}
      </Link>
    </li>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-zinc-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,color-mix(in_srgb,#8b2cf5_22%,transparent),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,color-mix(in_srgb,#a3e635_10%,transparent),transparent_50%)]"
        aria-hidden
      />

      <div className="landing-container relative py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex shrink-0 items-center">
              <Image
                src={BRAND_LOGO_DARK_PATH}
                alt={SITE_NAME}
                width={210}
                height={42}
                className="h-10 w-auto max-w-[210px] object-contain object-left"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Web3 listing & growth marketplace for token launches — exchange onboarding, liquidity,
              PR, and community from one professional dashboard.
            </p>

            <FooterHeading>
              <span className="mt-8 block">Contact Us</span>
            </FooterHeading>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <Send className="mt-0.5 size-4 shrink-0 text-chart-2" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Telegram</p>
                  <TelegramAnchor href={TELEGRAM_SUPPORT} className="font-medium text-white hover:text-chart-2">
                    @{DEFAULT_MANAGER_TELEGRAM_USERNAME}
                  </TelegramAnchor>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-chart-2" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Inquiries</p>
                  <Link href="/contact" className="font-medium text-white hover:text-chart-2">
                    Schedule a consultation
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-chart-2" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Coverage</p>
                  <p className="font-medium text-white">Global · Asia · Europe · MENA · Americas</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-full bg-chart-2 px-4 text-xs font-bold uppercase tracking-wide text-[#0a0a0a] transition hover:bg-chart-3"
              >
                Schedule a Call
              </Link>
              <TelegramAnchor
                href={TELEGRAM_SUPPORT}
                className="inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:border-chart-2/50 hover:bg-white/10"
              >
                Talk on Telegram
              </TelegramAnchor>
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-5 space-y-2.5">
              {companyLinks.map((link) => (
                <FooterLink key={link.href + link.label} {...link} />
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Service</FooterHeading>
            <ul className="mt-5 space-y-2.5">
              {serviceLinks.map((link) => (
                <FooterLink key={link.href + link.label} {...link} />
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>More Services</FooterHeading>
            <ul className="mt-5 space-y-2.5">
              {moreServiceLinks.map((link) => (
                <FooterLink key={link.href + link.label} {...link} />
              ))}
            </ul>

            <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
              Get Web3 listing updates
            </p>
            <p className="mt-2 text-sm text-white/50">
              Launch tips, exchange news, and growth playbooks.
            </p>
            <FooterSubscribe />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {SITE_NAME}.com — All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/45">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-chart-2">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
