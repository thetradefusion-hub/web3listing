"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOME_FAQS } from "@/lib/home-content";

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-white/[0.06] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-10">
          <p className="lh-label text-cyan-400">FAQ</p>
          <h2 className="lh-display mt-3 text-white sm:mt-4">Frequently asked questions</h2>
        </div>

        <div className="space-y-2">
          {HOME_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left sm:items-center sm:gap-4 sm:px-5 sm:py-4"
                >
                  <span className="text-sm font-medium leading-snug text-slate-100 sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 sm:mt-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-white/[0.06] px-4 pb-3.5 pt-2.5 text-sm leading-relaxed text-slate-400 sm:px-5 sm:pb-4 sm:pt-3">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
