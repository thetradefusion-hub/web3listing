"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitKyc } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { KycStatus } from "@/types/database";

export function KycForm({
  defaultValues,
  kycStatus,
}: {
  defaultValues: Record<string, string>;
  kycStatus: KycStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (kycStatus === "approved") {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        Your KYC has been approved. You can now place orders.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;
    const result = await submitKyc(data);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("KYC submitted for review");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" name="full_name" defaultValue={defaultValues.full_name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input id="company_name" name="company_name" defaultValue={defaultValues.company_name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile *</Label>
          <Input id="mobile" name="mobile" defaultValue={defaultValues.mobile} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telegram_username">Telegram Username *</Label>
          <Input id="telegram_username" name="telegram_username" defaultValue={defaultValues.telegram_username} placeholder="@username" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input id="country" name="country" defaultValue={defaultValues.country} required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="passport_url">Passport / ID Document URL</Label>
          <Input id="passport_url" name="passport_url" defaultValue={defaultValues.passport_url} placeholder="Upload to storage and paste URL" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="selfie_url">Selfie Verification URL</Label>
          <Input id="selfie_url" name="selfie_url" defaultValue={defaultValues.selfie_url} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_registration_url">Company Registration (Optional)</Label>
          <Input id="company_registration_url" name="company_registration_url" defaultValue={defaultValues.company_registration_url} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax_document_url">Tax Document URL</Label>
          <Input id="tax_document_url" name="tax_document_url" defaultValue={defaultValues.tax_document_url} />
        </div>
      </div>
      {kycStatus === "rejected" && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Your previous KYC was rejected. Please resubmit with correct documents.
        </p>
      )}
      <Button
        type="submit"
        disabled={loading || kycStatus === "pending"}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-50"
      >
        {kycStatus === "pending" ? "Under Review" : loading ? "Submitting..." : "Submit KYC"}
      </Button>
    </form>
  );
}
