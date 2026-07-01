"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  Tag,
} from "lucide-react";
import { submitCustomRequirement } from "@/lib/actions";
import {
  CUSTOM_REQUIREMENT_BUDGET_RANGES,
  CUSTOM_REQUIREMENT_SERVICE_TYPES,
} from "@/lib/constants";
import { customRequirementSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Project } from "@/types/database";

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/80 bg-muted/15 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <Icon className="size-4" strokeWidth={2} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const fieldClass = "h-11 rounded-xl border-input bg-background shadow-sm focus-visible:border-primary/50";

export function CustomRequirementForm({ projects }: { projects: Pick<Project, "id" | "project_name" | "token_symbol">[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string>("none");
  const [serviceType, setServiceType] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title") as string,
      project_id: projectId === "none" ? undefined : projectId,
      service_type: serviceType,
      description: form.get("description") as string,
      budget_range: budgetRange || undefined,
      timeline: (form.get("timeline") as string) || undefined,
      telegram: (form.get("telegram") as string) || undefined,
    };

    const parsed = customRequirementSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }

    setLoading(true);
    const result = await submitCustomRequirement(parsed.data);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Requirement submitted successfully");
    router.push(`/user/custom-requirements/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Request overview" description="Give your request a clear title and category" icon={Tag}>
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground">
            Request title *
          </Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g. Binance listing support for my DeFi token"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">Service type *</Label>
          <Select value={serviceType} onValueChange={(v) => setServiceType(v ?? "")}>
            <SelectTrigger className={cn(fieldClass, "w-full")}>
              <SelectValue placeholder="What do you need?" />
            </SelectTrigger>
            <SelectContent>
              {CUSTOM_REQUIREMENT_SERVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Related project (optional)</Label>
            <Select value={projectId} onValueChange={(v) => setProjectId(v ?? "none")}>
              <SelectTrigger className={cn(fieldClass, "w-full")}>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.project_name} ({p.token_symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </FormSection>

      <FormSection
        title="Requirements detail"
        description="The more context you share, the faster we can quote"
        icon={FileText}
      >
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground">
            Describe your requirements *
          </Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={6}
            placeholder="Goals, target platforms, deadlines, links, token stage, and any specifics our team should know..."
            className="min-h-[160px] resize-y rounded-xl border-input bg-background shadow-sm focus-visible:border-primary/50"
          />
          <p className="text-xs text-muted-foreground">Minimum 30 characters recommended for accurate quoting.</p>
        </div>
      </FormSection>

      <FormSection title="Budget & timeline" description="Optional — helps us scope the right package" icon={Calendar}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Budget range</Label>
            <Select value={budgetRange} onValueChange={(v) => setBudgetRange(v ?? "")}>
              <SelectTrigger className={cn(fieldClass, "w-full")}>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOM_REQUIREMENT_BUDGET_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeline" className="text-xs font-semibold text-muted-foreground">
              Timeline
            </Label>
            <Input id="timeline" name="timeline" placeholder="e.g. 2–4 weeks" className={fieldClass} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Contact" description="So we can reach you with questions or your quote" icon={MessageSquare}>
        <div className="space-y-2">
          <Label htmlFor="telegram" className="text-xs font-semibold text-muted-foreground">
            Telegram (optional)
          </Label>
          <Input id="telegram" name="telegram" placeholder="@username" className={fieldClass} />
        </div>
      </FormSection>

      <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-chart-2/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-chart-2" />
          <span>Our team typically responds within 1–2 business days with a custom quotation.</span>
        </div>
        <Button
          type="submit"
          disabled={loading || !serviceType}
          className="h-11 shrink-0 rounded-xl px-6 font-semibold shadow-md sm:min-w-[180px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              Submit request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function CustomRequirementFormStepper() {
  const steps = ["Overview", "Details", "Submit"] as const;
  return (
    <ol className="grid grid-cols-3 gap-2">
      {steps.map((step, index) => (
        <li
          key={step}
          className={cn(
            "rounded-xl border px-2 py-2.5 text-center text-[11px] font-semibold sm:text-xs",
            index === 0
              ? "border-primary/35 bg-primary/10 text-primary"
              : "border-border bg-muted/20 text-muted-foreground"
          )}
        >
          {index + 1}. {step}
        </li>
      ))}
    </ol>
  );
}

export function CustomRequirementNewHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-chart-2/5 p-5 sm:p-6">
      <div className="pointer-events-none absolute -left-8 top-0 size-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit rounded-lg px-2 text-muted-foreground hover:text-foreground">
          <Link href="/user/custom-requirements">
            <ArrowLeft className="mr-2 size-4" />
            Back to requirements
          </Link>
        </Button>
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <ClipboardList className="size-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Custom quote request</p>
            <h1 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">Submit your requirement</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Tell us exactly what you need. Our specialists will review and send a tailored quotation.
            </p>
          </div>
        </div>
        <CustomRequirementFormStepper />
      </div>
    </div>
  );
}
