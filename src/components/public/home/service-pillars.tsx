import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICE_PILLARS } from "@/lib/home-content";

export function ServicePillars() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="lh-label text-cyan-400">Our services</p>
          <h2 className="lh-display mt-3 text-white sm:mt-4">What we do</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:mt-5 sm:text-base lg:text-lg">
            From exchange listing to market making, PR, data platforms, and advisory — access
            professional Web3 services through one marketplace.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SERVICE_PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group flex flex-col rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/5 sm:rounded-2xl sm:p-6 lg:p-7"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 sm:text-xl">
                {pillar.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400 sm:mt-3">{pillar.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition group-hover:gap-2 sm:mt-6">
                Get in touch
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
