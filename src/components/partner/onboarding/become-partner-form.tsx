"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe,
  Loader2,
  Lock,
  Mail,
  Phone,
  Send,
  User,
} from "lucide-react";
import { applyToBecomePartner } from "@/lib/actions/partner-onboarding";
import { BrandLogo } from "@/components/shared/brand-logo";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const inputClass = "h-11 rounded-xl border-input bg-background pl-10 shadow-sm";

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

export function BecomePartnerForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await applyToBecomePartner({
      full_name: String(form.get("full_name") || ""),
      company_name: String(form.get("company_name") || "") || undefined,
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      mobile: String(form.get("mobile") || ""),
      telegram_username: String(form.get("telegram_username") || ""),
      country: String(form.get("country") || ""),
      website: String(form.get("website") || "") || undefined,
      years_of_experience: String(form.get("years_of_experience") || ""),
      monthly_client_volume: String(form.get("monthly_client_volume") || ""),
      services_offered: String(form.get("services_offered") || ""),
    });

    if ("error" in result) {
      setLoading(false);
      toast.error(result.error);
      return;
    }

    toast.success("Application started");
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    window.location.href = result.redirectTo || "/partner/onboarding/business-profile";
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition hover:border-primary/25 hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Back to website
        </Link>
        <ThemeToggle
          variant="outline"
          className="size-9 rounded-xl border-border/60 bg-card/70 text-muted-foreground backdrop-blur-sm hover:text-foreground"
        />
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-24 sm:px-6">
        <div className="mb-8 text-center">
          <BrandLogo href="/" className="mx-auto h-10" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Become a Partner</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Apply to list projects and earn commissions. Complete your profile and KYC to get
            activated.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="full_name" label="Full name" icon={User} required>
              <Input id="full_name" name="full_name" className={inputClass} required />
            </Field>
            <Field id="company_name" label="Company name" icon={Building2}>
              <Input id="company_name" name="company_name" className={inputClass} />
            </Field>
            <Field id="email" label="Email" icon={Mail} required>
              <Input id="email" name="email" type="email" className={inputClass} required />
            </Field>
            <Field id="password" label="Password" icon={Lock} required>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={cn(inputClass, "pr-10")}
                minLength={8}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </Field>
            <Field id="mobile" label="Mobile" icon={Phone} required>
              <Input id="mobile" name="mobile" className={inputClass} required />
            </Field>
            <Field id="telegram_username" label="Telegram" icon={Send} required>
              <Input
                id="telegram_username"
                name="telegram_username"
                placeholder="@username"
                className={inputClass}
                required
              />
            </Field>
            <Field id="country" label="Country" icon={Globe} required>
              <Input id="country" name="country" className={inputClass} required />
            </Field>
            <Field id="website" label="Website" icon={Globe}>
              <Input id="website" name="website" type="url" placeholder="https://" className={inputClass} />
            </Field>
            <Field id="years_of_experience" label="Years of experience" icon={User} required>
              <Input id="years_of_experience" name="years_of_experience" className={inputClass} required />
            </Field>
            <Field id="monthly_client_volume" label="Monthly client volume" icon={Building2} required>
              <Input
                id="monthly_client_volume"
                name="monthly_client_volume"
                placeholder="e.g. 5–10 clients"
                className={inputClass}
                required
              />
            </Field>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="services_offered" className="text-xs font-semibold text-muted-foreground">
              Services you offer *
            </Label>
            <Textarea
              id="services_offered"
              name="services_offered"
              rows={3}
              className="rounded-xl border-input bg-background shadow-sm"
              placeholder="Exchange listings, marketing, market making…"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-6 h-11 w-full rounded-xl font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Continue to business profile
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login?redirect=/partner" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
