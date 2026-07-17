"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { savePartnerBusinessProfile } from "@/lib/actions/partner-onboarding";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const inputClass =
  "h-11 rounded-xl border-input bg-background shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25";
const labelClass = "text-xs font-semibold text-muted-foreground";

export function BusinessProfileForm({
  defaults,
}: {
  defaults: {
    company_description?: string | null;
    business_type?: string | null;
    target_market?: string | null;
    existing_client_base?: string | null;
    monthly_leads?: string | null;
    preferred_services?: string | null;
  };
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await savePartnerBusinessProfile({
      company_description: String(form.get("company_description") || ""),
      business_type: String(form.get("business_type") || ""),
      target_market: String(form.get("target_market") || ""),
      existing_client_base: String(form.get("existing_client_base") || ""),
      monthly_leads: String(form.get("monthly_leads") || ""),
      preferred_services: String(form.get("preferred_services") || ""),
    });
    setLoading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Business profile saved");
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    window.location.href = result.redirectTo || "/partner/onboarding/kyc";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="company_description" className={labelClass}>
          Company description *
        </Label>
        <Textarea
          id="company_description"
          name="company_description"
          rows={4}
          defaultValue={defaults.company_description || ""}
          className="rounded-xl border-input bg-background shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25"
          placeholder="What does your company do in Web3?"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="business_type" className={labelClass}>
            Business type *
          </Label>
          <Input
            id="business_type"
            name="business_type"
            defaultValue={defaults.business_type || ""}
            placeholder="Agency, consultancy, exchange…"
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_market" className={labelClass}>
            Target market *
          </Label>
          <Input
            id="target_market"
            name="target_market"
            defaultValue={defaults.target_market || ""}
            placeholder="Regions / segments"
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="existing_client_base" className={labelClass}>
            Existing client base *
          </Label>
          <Input
            id="existing_client_base"
            name="existing_client_base"
            defaultValue={defaults.existing_client_base || ""}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_leads" className={labelClass}>
            Monthly leads *
          </Label>
          <Input
            id="monthly_leads"
            name="monthly_leads"
            defaultValue={defaults.monthly_leads || ""}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_services" className={labelClass}>
          Preferred marketplace services *
        </Label>
        <Textarea
          id="preferred_services"
          name="preferred_services"
          rows={3}
          defaultValue={defaults.preferred_services || ""}
          className="rounded-xl border-input bg-background shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25"
          placeholder="Listings, PR, market making, audits…"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            Continue to KYC
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
