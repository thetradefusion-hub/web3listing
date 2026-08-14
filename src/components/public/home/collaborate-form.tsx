"use client";

import { useState } from "react";
import { submitLead } from "@/lib/actions";
import { HOME_COLLAB_SERVICES } from "@/lib/home-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CollaborateFormProps = {
  className?: string;
  title?: string;
  compact?: boolean;
};

export function CollaborateForm({
  className,
  title = "Web3Listing",
  compact = false,
}: CollaborateFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const service = (form.get("service") as string) || "General inquiry";
    const result = await submitLead({
      name: form.get("name") as string,
      email: form.get("email") as string,
      company: (form.get("company") as string) || undefined,
      message: `Requested service: ${service}`,
    });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Request sent — we'll reply shortly.");
      setSubmitted(true);
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_80px_-32px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-chart-2/15 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Collaborate with
        </p>
        <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h3>

        {submitted ? (
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Thanks — your request is in. Our team will reach out soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="collab-name" className="text-xs font-semibold">
                Name *
              </Label>
              <Input
                id="collab-name"
                name="name"
                required
                autoComplete="name"
                className="h-11 rounded-xl border-border/80 bg-background/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collab-email" className="text-xs font-semibold">
                Email *
              </Label>
              <Input
                id="collab-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-11 rounded-xl border-border/80 bg-background/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collab-company" className="text-xs font-semibold">
                Company / Project *
              </Label>
              <Input
                id="collab-company"
                name="company"
                required
                className="h-11 rounded-xl border-border/80 bg-background/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collab-service" className="text-xs font-semibold">
                Requested Service (optional)
              </Label>
              <select
                id="collab-service"
                name="service"
                defaultValue=""
                className="flex h-11 w-full rounded-xl border border-border/80 bg-background/80 px-3 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  — Select a service —
                </option>
                {HOME_COLLAB_SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="lh-btn-cta mt-2 h-12 w-full rounded-xl text-sm font-bold uppercase tracking-wide"
            >
              {loading ? "Sending..." : "Get free consultation"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
