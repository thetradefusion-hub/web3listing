"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOME_FAQS } from "@/lib/home-content";
import { HomeSectionHeader } from "@/components/public/home/section-header";

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="landing-section border-t border-border">
      <div className="landing-container">
        <div className="mx-auto max-w-3xl">
          <HomeSectionHeader label="FAQ" title="Frequently asked questions" className="mb-6 sm:mb-10" />

          <div className="space-y-2">
            {HOME_FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-xl border border-border bg-card/50 transition-colors hover:border-primary/30"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left sm:items-center sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <span className="min-w-0 text-sm font-medium leading-snug text-foreground sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 sm:mt-0",
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
                      <p className="border-t border-border px-4 pb-3.5 pt-2.5 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-4 sm:pt-3">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
