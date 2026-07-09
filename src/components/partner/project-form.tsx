"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Coins,
  FileCode,
  FileText,
  FolderKanban,
  Globe,
  Hash,
  ImageIcon,
  Layers,
  Link2,
  Lock,
  Mail,
  MessageCircle,
  PieChart,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { createProject, updateProject } from "@/lib/actions";
import { BLOCKCHAIN_NETWORKS, LEGAL_AGREEMENT_VERSION, PROJECT_LEGAL_POLICIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Project } from "@/types/database";
import type { LucideIcon } from "lucide-react";

const inputClass = "h-10 rounded-xl border-input bg-background pl-10 shadow-sm transition-colors focus-visible:ring-primary/30";
const selectTriggerClass = "h-10 w-full rounded-xl border-input bg-background pl-10 shadow-sm";

function Field({
  id,
  label,
  icon: Icon,
  required,
  children,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
        />
        {children}
      </div>
    </div>
  );
}

function FormSectionCard({
  title,
  icon: Icon,
  iconColor,
  description,
  children,
}: {
  title: string;
  icon: LucideIcon;
  iconColor: "blue" | "green" | "purple" | "orange";
  description?: string;
  children: React.ReactNode;
}) {
  const iconStyles = {
    blue: "bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400",
    green: "bg-chart-2/10 text-chart-2 ring-chart-2/20",
    purple: "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400",
    orange: "bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400",
  };

  return (
    <section className="rounded-2xl border border-border/80 bg-muted/15 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1",
            iconStyles[iconColor]
          )}
        >
          <Icon className="size-4" strokeWidth={2.25} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function FormProgress() {
  const steps = [
    { label: "Token", icon: Coins },
    { label: "Links", icon: Globe },
    { label: "Verification", icon: ShieldCheck },
  ];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            <step.icon className="size-3.5 text-primary" strokeWidth={2.25} />
            {step.label}
          </span>
          {i < steps.length - 1 ? (
            <span className="h-px w-4 bg-border sm:w-6" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function LegalConsentSection({
  legalConsent,
  onConsentChange,
}: {
  legalConsent: boolean;
  onConsentChange: (checked: boolean) => void;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-muted/15 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <ShieldCheck className="size-5" strokeWidth={2.25} />
        </span>
        <div>
          <h3 className="text-base font-bold text-foreground">Verification &amp; Legal Consent</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Review our policies before submitting your project for platform services.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-chart-2/25 bg-chart-2/10 px-3.5 py-3">
        <Lock className="mt-0.5 size-4 shrink-0 text-chart-2" strokeWidth={2.25} />
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">Security Notice:</span> Your documents are protected with encrypted storage
          and accessed only by authorized personnel.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/80 p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Required agreements</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECT_LEGAL_POLICIES.map((policy) => (
            <li key={policy.href}>
              <Link
                href={policy.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-chart-2" />
                <span>{policy.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <label
        htmlFor="legal-consent"
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3.5 transition-all",
          legalConsent ? "border-primary/35 bg-primary/5 shadow-sm" : "border-border bg-muted/10"
        )}
      >
        <Checkbox
          id="legal-consent"
          checked={legalConsent}
          onCheckedChange={(checked) => onConsentChange(checked === true)}
          className="mt-0.5"
        />
        <span className="text-sm leading-relaxed text-foreground">
          I have read and agree to all policies and understand that some services depend on third-party approvals.
        </span>
      </label>

      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
        <Globe className="mt-0.5 size-3.5 shrink-0" />
        By clicking Submit, your consent timestamp, IP address, and agreement version ({LEGAL_AGREEMENT_VERSION}) will
        be securely recorded for compliance.
      </p>
    </section>
  );
}

export function ProjectForm({
  project,
  basePath = "/partner",
  compact = false,
  fullPage = false,
}: {
  project?: Project;
  basePath?: string;
  compact?: boolean;
  fullPage?: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(project?.blockchain_network || "");
  const [legalConsent, setLegalConsent] = useState(Boolean(project?.legal_consent_accepted));
  const [moreLinksOpen, setMoreLinksOpen] = useState(false);
  const isEditing = Boolean(project && project.status !== "draft");
  const networkOptions = useMemo(() => {
    const options: string[] = [...BLOCKCHAIN_NETWORKS];
    if (project?.blockchain_network && !options.includes(project.blockchain_network)) {
      options.unshift(project.blockchain_network);
    }
    return options;
  }, [project?.blockchain_network]);

  async function handleSubmit(status: string) {
    const formEl = formRef.current;
    if (!formEl) return;

    if (!network) {
      toast.error("Please select a blockchain network");
      return;
    }

    if (status === "submitted" && !legalConsent) {
      toast.error("Please confirm that you have read and agree to all policies");
      return;
    }

    if (!formEl.reportValidity()) return;

    setLoading(true);
    const form = new FormData(formEl);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;
    data.blockchain_network = network;
    data.status = status;
    if (status === "submitted") {
      data.legal_consent = legalConsent ? "true" : "false";
    }

    const result = project ? await updateProject(project.id, data) : await createProject(data);

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (status === "draft") {
      toast.success("Draft saved");
    } else if (status === "submitted") {
      toast.success(project?.status === "rejected" ? "Project resubmitted" : "Project submitted");
    } else {
      toast.success("Project updated");
    }

    router.push(`${basePath}/projects`);
    router.refresh();
  }

  function renderActionButtons() {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Save your changes or resubmit if your project was rejected.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="h-10 rounded-xl px-5"
              onClick={() => handleSubmit(project!.status)}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
            {project?.status === "rejected" ? (
              <Button
                type="button"
                disabled={loading || !legalConsent}
                className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 font-semibold text-white shadow-md hover:opacity-90"
                onClick={() => handleSubmit("submitted")}
              >
                {loading ? "Saving..." : "Resubmit for review"}
              </Button>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Save a draft anytime, or submit when ready.</p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="h-10 rounded-xl px-5"
            onClick={() => handleSubmit("draft")}
          >
            Save draft
          </Button>
          <Button
            type="button"
            disabled={loading || !legalConsent}
            className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 font-semibold text-white shadow-md hover:opacity-90"
            onClick={() => handleSubmit("submitted")}
          >
            {loading ? "Saving..." : "Submit project"}
          </Button>
        </div>
      </div>
    );
  }

  const tokenFields = (
    <div className="grid gap-3 md:grid-cols-2">
      <Field id="project_name" label="Project name" icon={FolderKanban} required>
        <Input
          id="project_name"
          name="project_name"
          defaultValue={project?.project_name}
          className={inputClass}
          required
        />
      </Field>
      <Field id="token_name" label="Token name" icon={Coins} required>
        <Input id="token_name" name="token_name" defaultValue={project?.token_name} className={inputClass} required />
      </Field>
      <Field id="token_symbol" label="Symbol" icon={Hash} required>
        <Input
          id="token_symbol"
          name="token_symbol"
          defaultValue={project?.token_symbol}
          className={inputClass}
          required
          maxLength={10}
        />
      </Field>
      <Field id="blockchain_network" label="Network" icon={Layers} required>
        <Select value={network} onValueChange={(v) => setNetwork(v || "")} required>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            {networkOptions.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );

  const coreLinkFields = (
    <div className="grid gap-3 md:grid-cols-2">
      <Field id="website_url" label="Website" icon={Globe}>
        <Input
          id="website_url"
          name="website_url"
          type="url"
          defaultValue={project?.website_url || ""}
          placeholder="https://"
          className={inputClass}
        />
      </Field>
      <Field id="contract_address" label="Contract Address" icon={FileCode}>
        <Input
          id="contract_address"
          name="contract_address"
          defaultValue={project?.contract_address || ""}
          className={inputClass}
        />
      </Field>
      <Field id="official_email" label="Email" icon={Mail}>
        <Input
          id="official_email"
          name="official_email"
          type="email"
          defaultValue={project?.official_email || ""}
          className={inputClass}
        />
      </Field>
      <Field id="logo_url" label="Logo URL" icon={ImageIcon}>
        <Input
          id="logo_url"
          name="logo_url"
          defaultValue={project?.logo_url || ""}
          placeholder="https://"
          className={inputClass}
        />
      </Field>
    </div>
  );

  const extraLinkFields = (
    <div className="grid gap-3 md:grid-cols-2">
      <Field id="social_telegram" label="Telegram" icon={Send}>
        <Input id="social_telegram" name="social_telegram" defaultValue={project?.social_telegram || ""} className={inputClass} />
      </Field>
      <Field id="social_twitter" label="Twitter / X" icon={AtSign}>
        <Input id="social_twitter" name="social_twitter" defaultValue={project?.social_twitter || ""} className={inputClass} />
      </Field>
      <Field id="social_discord" label="Discord" icon={MessageCircle}>
        <Input id="social_discord" name="social_discord" defaultValue={project?.social_discord || ""} className={inputClass} />
      </Field>
      <Field id="social_medium" label="Medium" icon={BookOpen}>
        <Input id="social_medium" name="social_medium" defaultValue={project?.social_medium || ""} className={inputClass} />
      </Field>
      <Field id="whitepaper_url" label="Whitepaper" icon={FileText}>
        <Input
          id="whitepaper_url"
          name="whitepaper_url"
          defaultValue={project?.whitepaper_url || ""}
          placeholder="https://"
          className={inputClass}
        />
      </Field>
      <Field id="tokenomics_url" label="Tokenomics" icon={PieChart}>
        <Input
          id="tokenomics_url"
          name="tokenomics_url"
          defaultValue={project?.tokenomics_url || ""}
          placeholder="https://"
          className={inputClass}
        />
      </Field>
    </div>
  );

  const consentSection = (
    <LegalConsentSection legalConsent={legalConsent} onConsentChange={setLegalConsent} />
  );

  if (compact) {
    return (
      <form ref={formRef} className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <FormProgress />

        <div className={cn("grid gap-5", fullPage && "xl:grid-cols-2")}>
          <FormSectionCard title="Token" icon={Coins} iconColor="blue">
            {tokenFields}
          </FormSectionCard>

          <FormSectionCard title="Links" icon={Link2} iconColor="green">
            {coreLinkFields}
            <button
              type="button"
              onClick={() => setMoreLinksOpen((open) => !open)}
              className="mt-3 flex w-full items-center justify-between rounded-xl border border-dashed border-border/80 px-3 py-2.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <span>Social &amp; docs (optional)</span>
              <ChevronDown className={cn("size-4 transition-transform", moreLinksOpen && "rotate-180")} />
            </button>
            {moreLinksOpen ? <div className="mt-3">{extraLinkFields}</div> : null}
          </FormSectionCard>
        </div>

        <div className={cn(fullPage && "xl:max-w-xl")}>
          <FormSectionCard title="Other Information" icon={Users} iconColor="purple">
            <Textarea
              id="team_info"
              name="team_info"
              defaultValue={project?.team_info || ""}
              rows={3}
              className="min-h-[80px] resize-y rounded-xl border-input bg-background shadow-sm"
              placeholder="Optional"
            />
          </FormSectionCard>
        </div>

        {consentSection}

        {renderActionButtons()}
      </form>
    );
  }

  return (
    <form ref={formRef} className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
      <FormSectionCard title="Token" icon={Coins} iconColor="blue" description="Basic project and token details">
        {tokenFields}
      </FormSectionCard>

      <FormSectionCard title="Links" icon={Globe} iconColor="green" description="Website, contract, and social profiles">
        {coreLinkFields}
        <div className="mt-3">{extraLinkFields}</div>
      </FormSectionCard>

      <FormSectionCard title="Other Information" icon={Users} iconColor="purple" description="Optional background for reviewers">
        <Textarea
          id="team_info"
          name="team_info"
          defaultValue={project?.team_info || ""}
          rows={3}
          className="min-h-[80px] resize-y rounded-xl border-input bg-background shadow-sm"
          placeholder="Team overview (optional)"
        />
      </FormSectionCard>

      {consentSection}

      {renderActionButtons()}
    </form>
  );
}
