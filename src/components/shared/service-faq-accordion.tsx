"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceFaqItem = { question: string; answer: string };

export function ServiceFaqAccordion({ faqs }: { faqs: ServiceFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={`${index}-${faq.question}`}
            className={cn(
              "overflow-hidden rounded-xl border transition-all duration-200",
              isOpen
                ? "border-primary/40 bg-gradient-to-br from-primary/[0.06] via-card to-card shadow-sm shadow-primary/10"
                : "border-border bg-card/60 hover:border-primary/25"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-left sm:px-4 sm:py-3.5"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors sm:size-8 sm:text-sm",
                  isOpen
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-muted/60 text-muted-foreground"
                )}
              >
                ?
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 text-sm font-semibold leading-snug sm:text-[15px]",
                  isOpen ? "text-foreground" : "text-foreground/90"
                )}
              >
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
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
                <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
                  <p className="whitespace-pre-line rounded-lg border border-primary/15 bg-background/60 px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
