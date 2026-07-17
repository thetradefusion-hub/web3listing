"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, Loader2 } from "lucide-react";
import { acceptPartnerAgreements } from "@/lib/actions/partner-onboarding";
import { PARTNER_AGREEMENT_POLICIES, PARTNER_AGREEMENT_VERSION } from "@/lib/constants";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AgreementsForm() {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ids = PARTNER_AGREEMENT_POLICIES.filter((p) => accepted[p.id]).map((p) => p.id);
    setLoading(true);
    const result = await acceptPartnerAgreements(ids);
    setLoading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message || "Agreements accepted");
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    window.location.href = result.redirectTo || "/partner/onboarding/pending";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-border/70 bg-muted/25 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Review and accept the partner policies (version{" "}
          <span className="font-semibold text-foreground">{PARTNER_AGREEMENT_VERSION}</span>).
          Acceptance is logged with timestamp, IP, and device.
        </p>
      </div>

      <ul className="space-y-3">
        {PARTNER_AGREEMENT_POLICIES.map((policy) => {
          const optional = "optional" in policy && policy.optional;
          const checked = Boolean(accepted[policy.id]);
          return (
            <li
              key={policy.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors",
                checked
                  ? "border-primary/35 bg-primary/5"
                  : "border-border/80 bg-muted/20 hover:border-border"
              )}
            >
              <Checkbox
                id={policy.id}
                checked={checked}
                onCheckedChange={(v) =>
                  setAccepted((prev) => ({ ...prev, [policy.id]: v === true }))
                }
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <Label htmlFor={policy.id} className="cursor-pointer text-sm font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    {policy.label}
                  </span>
                  {optional ? (
                    <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                  ) : (
                    <span className="text-destructive"> *</span>
                  )}
                </Label>
                <Link
                  href={policy.href}
                  target="_blank"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View document
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            Accept & continue
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
