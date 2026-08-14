"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { TERMS_AND_CONDITIONS } from "@/lib/legal-content";
import { LEGAL_AGREEMENT_VERSION } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignupTermsStepProps = {
  loading: boolean;
  onBack: () => void;
  onAgree: () => void;
};

export function SignupTermsStep({ loading, onBack, onAgree }: SignupTermsStepProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atBottom) setScrolledToEnd(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/70 bg-muted/25 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Terms & Conditions</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Scroll through the full agreement below. The agree button unlocks after you reach
              the end (version {LEGAL_AGREEMENT_VERSION}).
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-[min(52vh,420px)] overflow-y-auto rounded-xl border border-border/80 bg-muted/15 px-4 py-4 sm:px-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {TERMS_AND_CONDITIONS.site}
        </p>
        <h3 className="mt-1 text-lg font-bold text-foreground">{TERMS_AND_CONDITIONS.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {TERMS_AND_CONDITIONS.lastUpdated}
        </p>

        <div className="mt-5 space-y-6">
          {TERMS_AND_CONDITIONS.sections.map((section) => (
            <section key={section.number}>
              <h4 className="text-sm font-bold text-foreground">
                <span className="text-primary">{section.number}.</span> {section.title}
              </h4>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-2 space-y-1.5">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.closing ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {section.closing}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      {!scrolledToEnd ? (
        <p className="text-center text-xs text-muted-foreground">
          Scroll to the bottom to enable &quot;I Agree&quot;
        </p>
      ) : null}

      <p className="text-center text-xs text-muted-foreground">
        Full policy:{" "}
        <Link href="/legal/terms" target="_blank" className="font-semibold text-primary hover:underline">
          Terms & Conditions
        </Link>
      </p>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-xl"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft data-icon="inline-start" className="size-4" />
          Back
        </Button>
        <Button
          type="button"
          className={cn("h-11 flex-1 rounded-xl font-semibold", !scrolledToEnd && "opacity-60")}
          disabled={!scrolledToEnd || loading}
          onClick={onAgree}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "I Agree & Create Account"
          )}
        </Button>
      </div>
    </div>
  );
}
