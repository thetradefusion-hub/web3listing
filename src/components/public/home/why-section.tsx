import { CheckCircle2 } from "lucide-react";
import { WHY_NEED_US } from "@/lib/home-content";

export function WhySection() {
  return (
    <section className="border-b border-white/[0.06] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14 xl:gap-16">
          <div className="text-center lg:sticky lg:top-24 lg:text-left">
            <p className="lh-label text-cyan-400">Why TokenWeb3Listing</p>
            <h2 className="lh-display mt-3 text-white sm:mt-4">
              Why do I need{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                TokenWeb3Listing?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base lg:mx-0">
              We know the shortest path to listings, data platforms, and growth — with transparent
              pricing and a single dashboard for your entire Web3 launch stack.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {WHY_NEED_US.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-cyan-500/15 hover:bg-white/[0.04] sm:rounded-2xl sm:p-5"
              >
                <div className="flex gap-3 sm:gap-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white sm:text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
