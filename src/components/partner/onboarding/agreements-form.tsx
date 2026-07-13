"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { acceptPartnerAgreements } from "@/lib/actions/partner-onboarding";
import { PARTNER_AGREEMENT_POLICIES, PARTNER_AGREEMENT_VERSION } from "@/lib/constants";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
      <p className="text-sm text-muted-foreground">
        Review and accept the partner policies (version{" "}
        <span className="font-medium text-foreground">{PARTNER_AGREEMENT_VERSION}</span>). Acceptance
        is logged with timestamp, IP, and device.
      </p>

      <ul className="space-y-3">
        {PARTNER_AGREEMENT_POLICIES.map((policy) => {
          const optional = "optional" in policy && policy.optional;
          return (
            <li
              key={policy.id}
              className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/20 px-3 py-3"
            >
              <Checkbox
                id={policy.id}
                checked={Boolean(accepted[policy.id])}
                onCheckedChange={(v) =>
                  setAccepted((prev) => ({ ...prev, [policy.id]: v === true }))
                }
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <Label htmlFor={policy.id} className="cursor-pointer text-sm font-medium">
                  {policy.label}
                  {optional ? (
                    <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
                  ) : (
                    " *"
                  )}
                </Label>
                <Link
                  href={policy.href}
                  target="_blank"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
          "Accept & continue"
        )}
      </Button>
    </form>
  );
}
