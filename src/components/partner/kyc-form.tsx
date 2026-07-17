"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Globe,
  IdCard,
  Phone,
  Send,
  User,
} from "lucide-react";
import { submitKyc } from "@/lib/actions";
import { KycFileUpload } from "@/components/partner/kyc-file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { KycStatus } from "@/types/database";

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border-input bg-background pl-10 shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25";
const selectClass =
  "h-11 w-full min-w-0 rounded-xl border-input bg-background pl-10 shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25";
const SUPPORTED_ID_DOCUMENTS = [
  "Passport",
  "Aadhaar Card",
  "Voter ID",
  "Driving License",
  "National ID",
  "Other",
] as const;

function Field({
  id,
  label,
  icon: Icon,
  required,
  children,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </Label>
      <div className="relative min-w-0">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
        />
        {children}
      </div>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/15 p-4 sm:p-5">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

function StatusBanner({
  tone,
  title,
  children,
}: {
  tone: "success" | "warning" | "danger";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    success: "border-chart-2/30 bg-chart-2/10 text-chart-2",
    warning: "border-chart-4/30 bg-chart-4/10 text-chart-4",
    danger: "border-destructive/30 bg-destructive/10 text-destructive",
  };

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3", styles[tone])}>
      <CheckCircle2 className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

export function KycForm({
  defaultValues,
  kycStatus,
  underReview = false,
  partnerOnboarding = false,
}: {
  defaultValues: Record<string, string>;
  kycStatus: KycStatus;
  underReview?: boolean;
  partnerOnboarding?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [identityDocType, setIdentityDocType] = useState(
    defaultValues.identity_document_type || "Passport"
  );

  if (kycStatus === "approved") {
    return (
      <StatusBanner tone="success" title="KYC approved">
        Your identity has been verified. You can place orders and receive commissions across the marketplace.
      </StatusBanner>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;

    if (!data.passport_url?.trim()) {
      toast.error("Please upload your identity document");
      return;
    }
    if (!data.selfie_url?.trim()) {
      toast.error("Please upload your selfie verification photo");
      return;
    }
    if (partnerOnboarding && !data.address_proof_url?.trim()) {
      toast.error("Please upload address proof");
      return;
    }
    if (partnerOnboarding && !data.authorized_rep_id_url?.trim()) {
      toast.error("Please upload authorized representative ID");
      return;
    }

    setLoading(true);
    const result = await submitKyc(data);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("KYC submitted for review");
    if ("redirectTo" in result && result.redirectTo) {
      window.location.href = result.redirectTo;
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {underReview ? (
        <StatusBanner tone="warning" title="Under review">
          Your submission is being reviewed. You cannot edit details until the review is complete.
        </StatusBanner>
      ) : null}

      {kycStatus === "rejected" ? (
        <StatusBanner tone="danger" title="Submission rejected">
          Please correct the issues noted above and resubmit your documents.
        </StatusBanner>
      ) : null}

      <FormSection title="Personal details" description="Legal name and company information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="full_name" label="Full Name" icon={User} required>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={defaultValues.full_name}
              className={inputClass}
              required
              disabled={underReview}
            />
          </Field>
          <Field id="company_name" label="Company Name" icon={Building2}>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={defaultValues.company_name}
              className={inputClass}
              disabled={underReview}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Contact information" description="How we reach you for verification">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="mobile" label="Mobile" icon={Phone} required>
            <Input
              id="mobile"
              name="mobile"
              defaultValue={defaultValues.mobile}
              className={inputClass}
              required
              disabled={underReview}
            />
          </Field>
          <Field id="telegram_username" label="Telegram Username" icon={Send} required>
            <Input
              id="telegram_username"
              name="telegram_username"
              defaultValue={defaultValues.telegram_username}
              placeholder="@username"
              className={inputClass}
              required
              disabled={underReview}
            />
          </Field>
          <Field id="country" label="Country" icon={Globe} required>
            <Input
              id="country"
              name="country"
              defaultValue={defaultValues.country}
              className={inputClass}
              required
              disabled={underReview}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Identity documents"
        description="Upload Passport, Aadhaar Card, Voter ID, Driving License, National ID, or other supported government ID"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="identity_document_type" label="ID Document Type" icon={IdCard} required>
            <Select
              value={identityDocType}
              onValueChange={(value) => setIdentityDocType(value ?? "Passport")}
              disabled={underReview}
            >
              <SelectTrigger className={cn(selectClass, "w-full")}>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_ID_DOCUMENTS.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="identity_document_type" value={identityDocType} />
          </Field>
          <KycFileUpload
            name="passport_url"
            field="identity"
            label="ID Document"
            defaultPath={defaultValues.passport_url}
            disabled={underReview}
            required
          />
          <KycFileUpload
            name="selfie_url"
            field="selfie"
            label="Selfie with ID"
            defaultPath={defaultValues.selfie_url}
            disabled={underReview}
            required
          />
          <KycFileUpload
            name="company_registration_url"
            field="company"
            label="Company Registration"
            defaultPath={defaultValues.company_registration_url}
            disabled={underReview}
          />
          <KycFileUpload
            name="tax_document_url"
            field="tax"
            label="Tax Document"
            defaultPath={defaultValues.tax_document_url}
            disabled={underReview}
          />
          {partnerOnboarding ? (
            <>
              <KycFileUpload
                name="address_proof_url"
                field="address"
                label="Address Proof"
                defaultPath={defaultValues.address_proof_url}
                disabled={underReview}
                required
              />
              <KycFileUpload
                name="authorized_rep_id_url"
                field="rep_id"
                label="Authorized Rep ID"
                defaultPath={defaultValues.authorized_rep_id_url}
                disabled={underReview}
                required
              />
            </>
          ) : null}
        </div>
      </FormSection>

      <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-xs text-muted-foreground sm:text-left">
          By submitting, you confirm all information is accurate and documents belong to you.
        </p>
        <Button
          type="submit"
          disabled={loading || underReview}
          className="h-11 w-full shrink-0 rounded-xl px-6 font-semibold sm:w-auto sm:min-w-[160px]"
        >
          {underReview ? "Under Review" : loading ? "Submitting..." : "Submit KYC"}
        </Button>
      </div>
    </form>
  );
}
