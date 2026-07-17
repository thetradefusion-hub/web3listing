"use client";

import { useState, useTransition } from "react";
import {
  BadgeCheck,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  verifyPartnerContact,
  type PartnerVerifyResult,
} from "@/lib/actions/verify-partner";
import { cn } from "@/lib/utils";

const MATCH_LABELS = {
  email: "Email",
  mobile: "Mobile",
  telegram: "Telegram",
  id: "Partner ID",
} as const;

export function PartnerVerifyForm() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PartnerVerifyResult | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await verifyPartnerContact(query);
      setResult(res);
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (result) setResult(null);
            }}
            placeholder="Email, mobile, @telegram, or partner ID"
            className="h-14 w-full rounded-2xl border border-border/80 bg-card/90 py-3.5 pr-4 pl-11 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            required
            minLength={3}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button
          type="submit"
          disabled={pending || query.trim().length < 3}
          className="lh-btn-cta h-14 rounded-2xl px-8 text-sm font-bold"
        >
          {pending ? (
            <>
              <Loader2 data-icon="inline-start" className="animate-spin" />
              Checking…
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Checks only <span className="font-semibold text-foreground">active verified partners</span> in
        our database.
      </p>

      {result ? (
        <div
          className={cn(
            "mt-8 overflow-hidden rounded-2xl border p-5 sm:p-6",
            result.status === "verified" &&
              "border-chart-2/30 bg-chart-2/10 shadow-[0_0_40px_color-mix(in_srgb,var(--chart-2)_12%,transparent)]",
            result.status === "unverified" &&
              "border-destructive/25 bg-destructive/10 shadow-[0_0_40px_color-mix(in_srgb,var(--destructive)_10%,transparent)]",
            result.status === "error" && "border-border bg-muted/30"
          )}
        >
          {result.status === "verified" ? (
            <div className="flex flex-col items-center text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-chart-2/20 text-chart-2 ring-1 ring-chart-2/30">
                <ShieldCheck className="size-7" strokeWidth={2} />
              </span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-chart-2">
                Verified partner
              </p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {result.displayName}
              </h2>
              {result.companyName && result.companyName !== result.displayName ? (
                <p className="mt-1 text-sm text-muted-foreground">{result.companyName}</p>
              ) : null}
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-chart-2/25 bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground">
                <BadgeCheck className="size-3.5 text-chart-2" />
                Matched by {MATCH_LABELS[result.matchedBy]}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                This contact belongs to an official active partner on our platform. You can proceed
                with confidence.
              </p>
            </div>
          ) : null}

          {result.status === "unverified" ? (
            <div className="flex flex-col items-center text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive ring-1 ring-destructive/25">
                <ShieldAlert className="size-7" strokeWidth={2} />
              </span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-destructive">
                Unverified source
              </p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Not in our partner network
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                We could not find an active partner matching{" "}
                <span className="font-semibold text-foreground">“{result.query}”</span>. Do not share
                funds or sensitive details with unverified contacts claiming to represent us.
              </p>
            </div>
          ) : null}

          {result.status === "error" ? (
            <p className="text-center text-sm text-muted-foreground">{result.error}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
