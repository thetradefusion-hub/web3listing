import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PACKAGES } from "@/lib/home-content";

export function PricingPackages() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="lh-label text-cyan-400">Pricing</p>
          <h2 className="lh-display mt-3 text-white sm:mt-4">Choose your package</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PRICING_PACKAGES.map((pkg) => (
            <article
              key={pkg.name}
              className={`relative flex flex-col rounded-xl border p-5 sm:rounded-2xl sm:p-7 lg:p-8 ${
                pkg.featured
                  ? "border-cyan-500/40 bg-gradient-to-b from-cyan-500/10 via-[#0c1222] to-[#0c1222] shadow-lg shadow-cyan-500/10 md:col-span-2 lg:col-span-1"
                  : "border-white/[0.08] bg-[#0c1222]/60"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                  Most popular
                </span>
              )}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                  {pkg.name}
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-white sm:mt-2 sm:text-2xl">{pkg.subtitle}</h3>
                <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 sm:mt-3 sm:px-3 sm:py-1 sm:text-[11px]">
                  {pkg.badge}
                </span>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-6 sm:mt-8 sm:pt-8">
                <p className="text-2xl font-extrabold text-white sm:text-3xl">{pkg.price}</p>
                <p className="mt-1 text-xs text-slate-500">{pkg.priceNote}</p>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 sm:mt-8 sm:space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-6 h-11 w-full rounded-xl text-sm font-semibold sm:mt-8 sm:h-12 sm:rounded-full ${
                  pkg.featured
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
                variant={pkg.featured ? "default" : "outline"}
                asChild
              >
                <Link href={pkg.href}>{pkg.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
