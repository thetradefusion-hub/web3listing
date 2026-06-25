"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  IdCard,
  Phone,
  Send,
  User,
} from "lucide-react";
import { submitKyc } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { KycStatus } from "@/types/database";

const inputClass = "h-10 rounded-xl border-input bg-background pl-10 shadow-sm";

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
      <div className="relative">
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
    <div className="flex flex-col gap-4">
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
}: {
  defaultValues: Record<string, string>;
  kycStatus: KycStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (kycStatus === "approved") {
    return (
      <StatusBanner tone="success" title="KYC approved">
        Your identity has been verified. You can place orders and receive commissions across the marketplace.
      </StatusBanner>
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {kycStatus === "pending" ? (
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
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="full_name" label="Full Name" icon={User} required>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={defaultValues.full_name}
              className={inputClass}
              required
              disabled={kycStatus === "pending"}
            />
          </Field>
          <Field id="company_name" label="Company Name" icon={Building2}>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={defaultValues.company_name}
              className={inputClass}
              disabled={kycStatus === "pending"}
            />
          </Field>
        </div>
      </FormSection>

      <Separator />

      <FormSection title="Contact information" description="How we reach you for verification">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="mobile" label="Mobile" icon={Phone} required>
            <Input
              id="mobile"
              name="mobile"
              defaultValue={defaultValues.mobile}
              className={inputClass}
              required
              disabled={kycStatus === "pending"}
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
              disabled={kycStatus === "pending"}
            />
          </Field>
          <Field id="country" label="Country" icon={Globe} required>
            <Input
              id="country"
              name="country"
              defaultValue={defaultValues.country}
              className={inputClass}
              required
              disabled={kycStatus === "pending"}
            />
          </Field>
        </div>
      </FormSection>

      <Separator />

      <FormSection
        title="Identity documents"
        description="Upload files to storage and paste the public URLs below"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="passport_url" label="Passport / ID Document" icon={IdCard}>
            <Input
              id="passport_url"
              name="passport_url"
              defaultValue={defaultValues.passport_url}
              placeholder="https://..."
              className={inputClass}
              disabled={kycStatus === "pending"}
            />
          </Field>
          <Field id="selfie_url" label="Selfie Verification" icon={User}>
            <Input
              id="selfie_url"
              name="selfie_url"
              defaultValue={defaultValues.selfie_url}
              placeholder="https://..."
              className={inputClass}
              disabled={kycStatus === "pending"}
            />
          </Field>
          <Field id="company_registration_url" label="Company Registration" icon={Building2}>
            <Input
              id="company_registration_url"
              name="company_registration_url"
              defaultValue={defaultValues.company_registration_url}
              placeholder="Optional"
              className={inputClass}
              disabled={kycStatus === "pending"}
            />
          </Field>
          <Field id="tax_document_url" label="Tax Document" icon={FileText}>
            <Input
              id="tax_document_url"
              name="tax_document_url"
              defaultValue={defaultValues.tax_document_url}
              placeholder="https://..."
              className={inputClass}
              disabled={kycStatus === "pending"}
            />
          </Field>
        </div>
      </FormSection>

      <div className="flex flex-col gap-3 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          By submitting, you confirm all information is accurate and documents belong to you.
        </p>
        <Button
          type="submit"
          disabled={loading || kycStatus === "pending"}
          className="h-10 shrink-0 rounded-xl px-6 font-semibold sm:min-w-[160px]"
        >
          {kycStatus === "pending" ? "Under Review" : loading ? "Submitting..." : "Submit KYC"}
        </Button>
      </div>
    </form>
  );
}
