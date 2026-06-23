import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { getServicePriceLabel } from "@/lib/pricing";
import { HomeHero } from "@/components/public/home/hero";
import { WhySection } from "@/components/public/home/why-section";
import { StatsBanner } from "@/components/public/home/stats-banner";
import { ServicePillars } from "@/components/public/home/service-pillars";
import { PricingPackages } from "@/components/public/home/pricing-packages";
import { PartnerStrip } from "@/components/public/home/partner-strip";
import { ConsultationCta } from "@/components/public/home/consultation-cta";
import { ServiceShowcase } from "@/components/public/home/service-showcase";
import { HomeFaqSection } from "@/components/public/home/faq-section";
import { HomeDisclaimer } from "@/components/public/home/disclaimer";
import {
  HOW_IT_WORKS,
  PARTNER_AUDIENCE,
  PARTNER_BENEFITS,
  WHY_CHOOSE,
} from "@/lib/home-content";
import { ArrowRight, CheckCircle2, Globe } from "lucide-react";
import type { PricingModel } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*, service_categories(name)")
    .eq("is_active", true)
    .order("sort_order")
    .limit(8);

  return (
    <>
      <HomeHero />
      <WhySection />
      <StatsBanner />
      <ServicePillars />
      <ConsultationCta />
      <PricingPackages />
      <PartnerStrip />
      <ServiceShowcase />

      <section className="border-y border-white/[0.06] bg-white/[0.02] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14">
            <p className="lh-label text-cyan-400">Process</p>
            <h2 className="lh-display mt-3 text-white sm:mt-4">How it works</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-white/[0.08] bg-[#0c1222]/60 p-4 backdrop-blur-sm sm:rounded-2xl sm:p-5"
              >
                <span className="text-2xl font-extrabold text-cyan-500/30 sm:text-3xl">{step.step}</span>
                <h3 className="mt-2 text-base font-bold text-white sm:mt-3">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 sm:mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="lh-label text-cyan-400">Catalog</p>
              <h2 className="lh-display mt-3 text-white sm:mt-4">Popular services</h2>
            </div>
            <Button
              variant="outline"
              className="h-10 w-full rounded-xl border-white/15 bg-white/5 text-xs font-semibold hover:bg-white/10 sm:h-11 sm:w-auto sm:rounded-full sm:px-6 sm:text-sm"
              asChild
            >
              <Link href="/services">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {services?.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="group">
                <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-300 hover:border-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/5 sm:rounded-2xl sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-cyan-300 sm:text-base">
                      {service.name}
                    </h3>
                    <PricingBadge model={service.pricing_model as PricingModel} variant="dark" />
                  </div>
                  <p className="mt-3 text-lg font-bold text-cyan-400 sm:mt-4 sm:text-xl">
                    {getServicePriceLabel(service)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{service.estimated_tat}</p>
                  <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-slate-500 transition group-hover:text-cyan-400 sm:pt-4">
                    View details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-white/[0.02] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14">
            <p className="lh-label text-cyan-400">Why us</p>
            <h2 className="lh-display mt-3 text-white sm:mt-4">Why choose TokenWeb3Listing?</h2>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {WHY_CHOOSE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.08] bg-[#0c1222]/50 p-4 backdrop-blur-sm sm:rounded-2xl sm:p-5"
              >
                <h3 className="text-sm font-bold text-white sm:text-base">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 sm:mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#0c1222] to-cyan-500/5 p-5 sm:rounded-2xl sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
              <p className="lh-label text-violet-400">Partner program</p>
              <h3 className="mt-3 text-xl font-bold text-white sm:mt-4 sm:text-2xl">Become a partner & earn</h3>
              <p className="mt-1.5 text-sm font-medium text-violet-300 sm:mt-2">Web3 Agent Program</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:mt-3">
                Earn recurring commissions by referring projects to our marketplace.
              </p>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:mt-5 sm:text-xs">
                Benefits
              </p>
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:mt-3 sm:grid-cols-2">
                {PARTNER_BENEFITS.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-sm font-semibold text-white hover:opacity-90 sm:mt-8 sm:w-auto sm:rounded-full sm:px-8"
                asChild
              >
                <Link href="/login">
                  Become an agent <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0c1222]/60 p-5 backdrop-blur-sm sm:rounded-2xl sm:p-8">
              <p className="lh-label text-cyan-400">Perfect for</p>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {PARTNER_AUDIENCE.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:mt-8 sm:p-4">
                <Globe className="h-7 w-7 shrink-0 text-cyan-400 sm:h-8 sm:w-8" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">Global Web3 coverage</p>
                  <p className="text-xs text-slate-500">Asia · Europe · MENA · Africa · Americas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeFaqSection />

      <ConsultationCta
        title="Ready to grow your project?"
        subtitle="Launch faster, build trust, and scale your Web3 ecosystem with professional support."
        primaryLabel="Book a free consultation"
        secondaryLabel="Start your project today"
      />

      <HomeDisclaimer />
    </>
  );
}
