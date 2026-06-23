import { DISCLAIMER } from "@/lib/home-content";

export function HomeDisclaimer() {
  return (
    <section className="border-t border-white/[0.06] bg-[#060a14] py-10 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Disclaimer</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">{DISCLAIMER}</p>
        <p className="mt-6 text-sm font-semibold text-slate-400">
          TokenWeb3Listing.com — Your Web3 Growth Marketplace
        </p>
      </div>
    </section>
  );
}
