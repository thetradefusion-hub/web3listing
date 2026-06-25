import Link from "next/link";
import { format } from "date-fns";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { KycForm } from "@/components/partner/kyc-form";
import { DashboardPanel, PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerBadge, PartnerPageShell, kycStatusVariant } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KycStatus, KycSubmission, Profile } from "@/types/database";

function kycLabel(status: KycStatus) {
  const labels: Record<KycStatus, string> = {
    approved: "Verified",
    pending: "Under Review",
    rejected: "Rejected",
  };
  return labels[status];
}

function kycDescription(status: KycStatus) {
  if (status === "approved") {
    return "Your identity is verified. You have full access to place orders and earn commissions.";
  }
  if (status === "pending") {
    return "Your documents are being reviewed. We typically respond within 1–2 business days.";
  }
  if (status === "rejected") {
    return "Your submission needs corrections. Update your details and resubmit below.";
  }
  return "Complete identity verification to unlock ordering, payouts, and full marketplace access.";
}

const VERIFICATION_STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "contact", label: "Contact" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
] as const;

function VerificationStepper({
  status,
  personalDone,
  contactDone,
  documentsDone,
}: {
  status: KycStatus;
  personalDone: boolean;
  contactDone: boolean;
  documentsDone: boolean;
}) {
  const stepState = (index: number): "completed" | "active" | "pending" => {
    if (status === "approved") return "completed";
    if (status === "pending" && index < 3) return "completed";
    if (status === "pending" && index === 3) return "active";

    const done = [personalDone, contactDone, documentsDone, false][index];
    if (status === "rejected") {
      if (index === 3) return "pending";
      return done ? "completed" : index === 0 || (index === 1 && personalDone) || (index === 2 && contactDone) ? "active" : "pending";
    }

    if (!personalDone) return index === 0 ? "active" : "pending";
    if (!contactDone) return index <= 0 ? "completed" : index === 1 ? "active" : "pending";
    if (!documentsDone) return index <= 1 ? "completed" : index === 2 ? "active" : "pending";
    return index < 3 ? "completed" : "active";
  };

  return (
    <div className="flex min-w-0 items-start justify-between gap-1 overflow-x-auto pb-1 sm:gap-2">
      {VERIFICATION_STEPS.map((step, index) => {
        const state = stepState(index);
        return (
          <div key={step.id} className="flex min-w-[72px] flex-1 flex-col items-center text-center sm:min-w-0">
            <div className="flex w-full items-center">
              {index > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    state !== "pending" || stepState(index - 1) === "completed" ? "bg-chart-2" : "bg-border"
                  )}
                />
              )}
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                  state === "completed"
                    ? "border-chart-2 bg-chart-2/10 text-chart-2"
                    : state === "active"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/40 text-muted-foreground"
                )}
              >
                {state === "completed" ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : (
                  <span className="text-[10px] font-bold">{index + 1}</span>
                )}
              </span>
              {index < VERIFICATION_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    stepState(index + 1) !== "pending" ? "bg-chart-2" : "bg-border"
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "mt-2 text-[10px] font-semibold leading-tight sm:text-[11px]",
                state === "pending" ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function RequirementItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}

export function PartnerKycView({
  profile,
  kyc,
  required,
  managerTelegramLink,
}: {
  profile: Profile;
  kyc: KycSubmission | null;
  required?: boolean;
  managerTelegramLink?: string | null;
}) {
  const status = profile.kyc_status;
  const displayName = profile.full_name || profile.company_name || profile.email;
  const personalDone = Boolean(profile.full_name?.trim());
  const contactDone = Boolean(
    profile.mobile?.trim() && profile.telegram_username?.trim() && profile.country?.trim()
  );
  const docFields = [
    kyc?.passport_url,
    kyc?.selfie_url,
    kyc?.company_registration_url,
    kyc?.tax_document_url,
  ];
  const documentsUploaded = docFields.filter(Boolean).length;
  const documentsDone = documentsUploaded >= 2;

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/partner" className="transition hover:text-primary">
          Dashboard
        </Link>
        <span aria-hidden>›</span>
        <span className="font-medium text-foreground">KYC Verification</span>
      </nav>

      {required && status !== "approved" ? (
        <Card size="sm" className="border-chart-4/30 bg-chart-4/10 py-0">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-chart-4" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-foreground">KYC required to place orders</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Complete verification below to unlock the marketplace and start ordering services.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card size="sm" className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 py-0">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-2 to-chart-4" aria-hidden />
        <CardContent className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-start sm:justify-between sm:p-5 sm:pl-6">
          <div className="flex min-w-0 gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-2 ring-border/50 sm:size-16">
              <ShieldCheck className="size-7 sm:size-8" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-foreground sm:text-xl">Identity Verification</h1>
                <PartnerBadge variant={kycStatusVariant(status)}>{kycLabel(status)}</PartnerBadge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{kycDescription(status)}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3.5 shrink-0" />
                {displayName}
                {kyc?.created_at ? (
                  <>
                    <span aria-hidden>·</span>
                    Submitted {format(new Date(kyc.created_at), "MMM d, yyyy")}
                  </>
                ) : null}
              </p>
            </div>
          </div>

          {status === "approved" ? (
            <Button asChild variant="outline" className="h-9 shrink-0 rounded-xl font-semibold">
              <Link href="/partner/services">Browse Services</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="h-9 shrink-0 rounded-xl font-semibold">
              <Link href="/partner/support">
                <Headphones data-icon="inline-start" />
                Get Help
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <section aria-label="Verification overview" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <PartnerStatCard
          title="Status"
          value={kycLabel(status)}
          subtitle={status === "approved" ? "Fully verified" : "Verification progress"}
          icon={ShieldCheck}
          color={status === "approved" ? "green" : status === "rejected" ? "purple" : "orange"}
        />
        <PartnerStatCard
          title="Documents"
          value={`${documentsUploaded}/4`}
          subtitle="Uploaded files"
          icon={FileText}
          color="blue"
        />
        <PartnerStatCard
          title="Review Time"
          value="1–2 days"
          subtitle="Typical turnaround"
          icon={Clock}
          color="purple"
        />
        <PartnerStatCard
          title="Access"
          value={status === "approved" ? "Full" : "Limited"}
          subtitle={status === "approved" ? "Orders enabled" : "Complete KYC to order"}
          icon={CheckCircle2}
          color={status === "approved" ? "green" : "orange"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-5">
        <div className="flex flex-col gap-4">
          <DashboardPanel
            title="Verification Progress"
            description="Complete each step to submit for review"
            icon={ShieldCheck}
            iconColor="green"
          >
            <VerificationStepper
              status={status}
              personalDone={personalDone}
              contactDone={contactDone}
              documentsDone={documentsDone}
            />
          </DashboardPanel>

          <DashboardPanel
            title="KYC Application"
            description="Passport/ID, company registration, and selfie verification"
            icon={FileText}
            iconColor="blue"
          >
            {kyc?.review_notes && status !== "approved" ? (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                <p className="text-xs font-semibold text-destructive">Review notes</p>
                <p className="mt-1 text-sm text-muted-foreground">{kyc.review_notes}</p>
              </div>
            ) : null}

            <KycForm
              kycStatus={status}
              defaultValues={{
                full_name: profile.full_name || "",
                company_name: profile.company_name || "",
                mobile: profile.mobile || "",
                telegram_username: profile.telegram_username || "",
                country: profile.country || "",
                passport_url: kyc?.passport_url || "",
                selfie_url: kyc?.selfie_url || "",
                company_registration_url: kyc?.company_registration_url || "",
                tax_document_url: kyc?.tax_document_url || "",
              }}
            />
          </DashboardPanel>
        </div>

        <aside className="flex flex-col gap-4">
          <DashboardPanel title="What you'll need" icon={FileText} iconColor="purple">
            <ul className="flex flex-col gap-2.5">
              <RequirementItem>Government-issued passport or national ID</RequirementItem>
              <RequirementItem>Clear selfie holding your ID document</RequirementItem>
              <RequirementItem>Company registration (if applying as a business)</RequirementItem>
              <RequirementItem>Valid Telegram username for verification contact</RequirementItem>
            </ul>
          </DashboardPanel>

          <DashboardPanel title="Tips for faster approval" icon={CheckCircle2} iconColor="green">
            <ul className="flex flex-col gap-2.5">
              <RequirementItem>Upload high-resolution, uncropped document images</RequirementItem>
              <RequirementItem>Ensure all text on ID is readable</RequirementItem>
              <RequirementItem>Match the name on your ID with the form</RequirementItem>
              <RequirementItem>Use a well-lit photo for your selfie verification</RequirementItem>
            </ul>
          </DashboardPanel>

          <Card size="sm" className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-chart-4/5 py-0">
            <CardContent className="flex flex-col gap-3 p-4">
              <p className="text-sm font-semibold text-foreground">Questions about KYC?</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your account manager can walk you through document requirements and review status.
              </p>
              {managerTelegramLink ? (
                <Button size="sm" className="h-9 w-full rounded-xl text-xs font-semibold" asChild>
                  <a href={managerTelegramLink} target="_blank" rel="noopener noreferrer">
                    <Send data-icon="inline-start" />
                    Message on Telegram
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-9 w-full rounded-xl text-xs font-semibold" asChild>
                  <Link href="/partner/support">Contact Support</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </PartnerPageShell>
  );
}
