"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Globe, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PARTNER_PLATFORMS } from "@/lib/home-content";
import { getPartnerLocalLogo } from "@/lib/partner-logos";
import { cn } from "@/lib/utils";

function PartnerLogo({ name }: { name: string }) {
  const src = getPartnerLocalLogo(name);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="text-sm font-extrabold tracking-tight text-zinc-800">
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={176}
      height={40}
      className="h-full w-full object-contain object-center"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function PartnerPlatformCard({
  name,
  type,
}: {
  name: string;
  type: "exchange" | "launchpad";
}) {
  return (
    <div className="partner-grid-card group flex h-[84px] flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/75 px-2 py-1.5 transition hover:border-primary/35 hover:bg-zinc-900 sm:h-[90px]">
      <div className="flex h-9 w-full max-w-[148px] items-center justify-center rounded-md bg-white px-2.5 py-1.5 sm:h-10 sm:max-w-[158px]">
        <PartnerLogo name={name} />
      </div>
      <span
        className={cn(
          "rounded-full px-1.5 py-px text-[8px] font-semibold uppercase tracking-wide sm:text-[9px]",
          type === "launchpad"
            ? "bg-primary/20 text-primary"
            : "bg-white/5 text-white/50"
        )}
      >
        {type === "launchpad" ? "Launchpad" : "Exchange"}
      </span>
    </div>
  );
}

export function PartnerStrip() {
  return (
    <section className="partner-network-section relative overflow-hidden border-b border-border py-10 sm:py-12 lg:py-14">
      <div className="partner-network-glow-left pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36" aria-hidden />
      <div className="partner-network-glow-right pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36" aria-hidden />

      <div className="landing-container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="partner-network-badge mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-zinc-900/80 px-3 py-1">
            <span className="size-1.5 rounded-full bg-chart-2 shadow-[0_0_8px_var(--chart-2)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-chart-2">
              Our partners
            </span>
            <span className="size-1.5 rounded-full bg-chart-2 shadow-[0_0_8px_var(--chart-2)]" />
          </div>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-3xl lg:text-4xl">
            Partner Exchanges &{" "}
            <span className="lh-brand-gradient">Launchpads</span>
          </h2>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-2.5 md:grid-cols-5 lg:gap-3">
          {PARTNER_PLATFORMS.map((platform) => (
            <PartnerPlatformCard key={platform.name} name={platform.name} type={platform.type} />
          ))}
        </div>

        <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:mt-6 sm:text-xs">
          And 20+ more ecosystems
        </p>

        <div className="partner-network-cta mt-6 rounded-xl border border-primary/35 bg-zinc-900/80 p-4 backdrop-blur-sm sm:mt-8 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="partner-network-cta-icon relative mx-auto flex size-16 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 sm:mx-0 sm:size-[4.5rem]">
                <Globe className="absolute size-11 text-primary/70 sm:size-12" strokeWidth={1.25} />
                <Handshake className="relative size-6 text-white sm:size-7" strokeWidth={1.75} />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Ready to Launch on{" "}
                  <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    Top Platforms?
                  </span>
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/60">
                  We&apos;ll help you get listed on the best exchanges and launchpads with the right
                  strategy and support.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:flex-col lg:items-end xl:flex-row xl:items-center">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {["A", "B", "C"].map((initial, index) => (
                    <span
                      key={initial}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border-2 border-zinc-900 text-[10px] font-bold text-white",
                        index === 0 && "bg-violet-500",
                        index === 1 && "bg-fuchsia-500",
                        index === 2 && "bg-sky-500"
                      )}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-chart-2">500+ Projects</p>
                  <p className="text-[11px] text-white/55">Already launched with our support</p>
                </div>
              </div>

              <Button
                size="lg"
                className="partner-network-cta-btn h-10 w-full rounded-lg px-5 text-sm font-semibold sm:w-auto"
                asChild
              >
                <Link href="/contact">
                  Start your listing journey
                  <ArrowRight data-icon="inline-end" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
