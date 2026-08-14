import Link from "next/link";
import {
  Clock,
  Globe,
  Headphones,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ContactForm } from "@/components/public/contact/contact-form";
import { HomeSectionHeader } from "@/components/public/home/section-header";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { Button } from "@/components/ui/button";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { DEFAULT_MANAGER_TELEGRAM_USERNAME } from "@/lib/telegram";

const CONTACT_CHANNELS = [
  {
    icon: Send,
    label: "Telegram",
    title: "Fastest response",
    description: "Primary channel for listing inquiries, quotes, and live coordination.",
    action: (
      <TelegramAnchor
        href={TELEGRAM_SUPPORT}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        @{DEFAULT_MANAGER_TELEGRAM_USERNAME}
      </TelegramAnchor>
    ),
    highlight: true,
  },
  {
    icon: Clock,
    label: "Response time",
    title: "Within 24 hours",
    description: "Business-day replies for form submissions. Urgent cases via Telegram.",
  },
  {
    icon: Globe,
    label: "Coverage",
    title: "Global Web3 projects",
    description: "Asia, Europe, MENA, Americas — remote-first listing & growth support.",
  },
  {
    icon: Headphones,
    label: "Client support",
    title: "24/7 ticket desk",
    description: "Registered clients get dashboard tickets and order tracking around the clock.",
  },
] as const;

const QUICK_LINKS = [
  {
    href: "/become-a-partner",
    title: "Become a partner",
    description: "Earn 10–30% commission with referral tracking and withdrawals.",
    icon: Sparkles,
  },
  {
    href: "/services",
    title: "Explore services",
    description: "Exchange listing, market making, CMC/CG, audits, and growth packages.",
    icon: MessageCircle,
  },
  {
    href: "/verify",
    title: "Verify a partner",
    description: "Confirm official Web3Listing representatives before you engage.",
    icon: ShieldCheck,
  },
] as const;

const CONTACT_FAQS = [
  {
    q: "What should I include in my message?",
    a: "Token name, chain, current stage (pre-TGE, listed, etc.), target exchanges or services, and your preferred timeline.",
  },
  {
    q: "Is the consultation really free?",
    a: "Yes. Initial scoping and service recommendations are free. Paid work starts only after you approve a quote.",
  },
  {
    q: "Can I contact you before creating an account?",
    a: "Absolutely. Use this form or Telegram. Create an account when you're ready to place orders and track progress.",
  },
] as const;

export function ContactView() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="hero-mesh-bg pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 landing-grid opacity-[0.22] dark:opacity-15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-chart-2/15 blur-3xl"
          aria-hidden
        />

        <div className="landing-container relative pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="lh-label lh-accent">Get in touch</p>
            <h1 className="lh-hero-display mt-3 text-foreground">
              Let&apos;s plan your{" "}
              <span className="lh-brand-gradient">Web3 launch</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
              Exchange listings, liquidity, marketing, and ecosystem growth — tell us what you need
              and we&apos;ll map the fastest path forward.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="lh-btn-cta h-12 rounded-full px-8 text-sm font-semibold uppercase tracking-wide"
                asChild
              >
                <TelegramAnchor href={TELEGRAM_SUPPORT}>Talk on Telegram</TelegramAnchor>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border/80 bg-background/60 px-8 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm"
                asChild
              >
                <Link href="/signup">Create free account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10 xl:gap-14">
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Contact channels
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  Reach us your way
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Telegram is our primary line for quick answers. Use the form for detailed project
                  briefs — we&apos;ll follow up by email or Telegram.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {CONTACT_CHANNELS.map((channel) => (
                  <div
                    key={channel.label}
                    className={`rounded-2xl border p-5 transition-colors ${
                      channel.highlight
                        ? "border-primary/35 bg-gradient-to-br from-primary/10 via-card to-chart-2/5 shadow-[0_16px_48px_-24px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
                        : "border-border/70 bg-card/60 hover:border-primary/25"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                          channel.highlight
                            ? "bg-primary/15 text-primary"
                            : "bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <channel.icon className="size-4" strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {channel.label}
                        </p>
                        <p className="mt-0.5 font-semibold text-foreground">{channel.title}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {channel.description}
                        </p>
                        {"action" in channel && channel.action ? (
                          <div className="mt-3">{channel.action}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/20 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Business hours
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Monday – Saturday · Consultations by appointment
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Telegram & client tickets supported around the clock.
                </p>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="landing-section border-t border-border bg-muted/15">
        <div className="landing-container">
          <HomeSectionHeader
            label="Quick links"
            title={
              <>
                More ways to{" "}
                <span className="lh-brand-gradient">work with us</span>
              </>
            }
            description="Partners, service catalog, and official verification — all in one platform."
            className="mb-8 sm:mb-10"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-2xl border border-border/70 bg-card/70 p-5 transition hover:border-primary/30 hover:bg-card hover:shadow-lg"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                  <link.icon className="size-4" strokeWidth={2} />
                </span>
                <h3 className="mt-4 font-bold text-foreground">{link.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-primary group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section-tight border-t border-border">
        <div className="landing-container">
          <HomeSectionHeader
            label="Before you write"
            title="Common questions"
            align="left"
            className="mb-6 max-w-none"
          />

          <div className="grid gap-3 md:grid-cols-3">
            {CONTACT_FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border/70 bg-card/50 p-5"
              >
                <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
