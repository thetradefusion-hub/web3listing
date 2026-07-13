"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { savePartnerBusinessProfile } from "@/lib/actions/partner-onboarding";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Business profile saved");
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    window.location.href = result.redirectTo || "/partner/onboarding/kyc";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company_description">Company description *</Label>
        <Textarea
          id="company_description"
          name="company_description"
          rows={3}
          defaultValue={defaults.company_description || ""}
          className="rounded-xl"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="business_type">Business type *</Label>
          <Input
            id="business_type"
            name="business_type"
            defaultValue={defaults.business_type || ""}
            placeholder="Agency, consultancy, exchange…"
            className="h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_market">Target market *</Label>
          <Input
            id="target_market"
            name="target_market"
            defaultValue={defaults.target_market || ""}
            placeholder="Regions / segments"
            className="h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="existing_client_base">Existing client base *</Label>
          <Input
            id="existing_client_base"
            name="existing_client_base"
            defaultValue={defaults.existing_client_base || ""}
            className="h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_leads">Monthly leads *</Label>
          <Input
            id="monthly_leads"
            name="monthly_leads"
            defaultValue={defaults.monthly_leads || ""}
            className="h-11 rounded-xl"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferred_services">Preferred marketplace services *</Label>
        <Textarea
          id="preferred_services"
          name="preferred_services"
          rows={2}
          defaultValue={defaults.preferred_services || ""}
          className="rounded-xl"
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
          "Continue to KYC"
        )}
      </Button>
    </form>
  );
}
