"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Handshake,
  Loader2,
  Lock,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { applyToBecomePartner } from "@/lib/actions/partner-onboarding";
import { BrandLogo, SidebarBrandLogo } from "@/components/shared/brand-logo";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BRAND_ICON_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const inputClass =
  "h-11 w-full rounded-xl border-input bg-background pl-10 shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25";

const BENEFITS = [
  {
    icon: Handshake,
    title: "Partner with top exchanges",
    description: "Bring token projects to listings, marketing, and growth services.",
  },
  {
    icon: Wallet,
    title: "Earn on every order",
    description: "Commissions credited to your partner wallet as deals close.",
  },
  {
    icon: TrendingUp,
    title: "One portal for clients",
    description: "Manage projects, orders, and delivery status in a single workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Verified partner badge",
    description: "KYC-backed profile so clients and teams can verify you.",
  },
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
      <div className="group relative min-w-0">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-primary"
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
    <div className="auth-shell relative min-h-[100dvh] bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-30 dark:opacity-20" />
      <div className="login-glow pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-[100px] sm:h-96 sm:w-96" />
      <div className="login-glow pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-chart-2/15 blur-[100px] sm:h-96 sm:w-96" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition hover:border-primary/30 hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          <span className="hidden sm:inline">Back to website</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <ThemeToggle
          variant="outline"
          className="size-9 rounded-xl border-border/60 bg-card/70 text-muted-foreground backdrop-blur-sm hover:border-primary/30 hover:text-foreground"
        />
      </header>

      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <aside className="auth-brand-panel relative hidden overflow-hidden border-r lg:flex lg:w-[40%] lg:flex-col xl:w-[42%]">
          <div
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2"
            aria-hidden
          />

          <div className="pointer-events-none absolute -right-6 top-16 size-52 opacity-[0.14] sm:size-64 xl:size-72">
            <Image
              src={BRAND_ICON_PATH}
              alt=""
              width={288}
              height={288}
              className="login-float size-full object-contain"
              aria-hidden
              priority
            />
          </div>

          <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
            <div>
              <Link href="/" className="inline-flex transition-opacity hover:opacity-90">
                <SidebarBrandLogo priority className="h-10 max-w-[210px]" />
              </Link>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Become a partner
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl">
                Grow with{" "}
                <span className="lh-brand-gradient">Web3Listing</span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Apply once, complete KYC, and start earning commissions on marketplace orders.
              </p>
            </div>

            <ul className="mt-10 flex flex-col gap-3">
              {BENEFITS.map((feature) => (
                <li
                  key={feature.title}
                  className="auth-feature-card flex gap-3 rounded-xl border p-3.5 backdrop-blur-sm transition-colors"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                    <feature.icon className="size-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-chart-2" strokeWidth={2.5} />
                Free to apply
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-chart-2" strokeWidth={2.5} />
                Activation after review
              </span>
            </div>
          </div>
        </aside>

        <main className="relative flex flex-1 flex-col px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pb-12 lg:pt-24 xl:px-14">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
            <div className="mb-6 flex justify-center lg:hidden">
              <BrandLogo href="/" size="lg" priority />
            </div>

            <div className="auth-form-card relative overflow-hidden rounded-2xl border bg-card/90 backdrop-blur-xl">
              <div
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2"
                aria-hidden
              />
              <div className="p-5 sm:p-8 lg:p-10">
                <div className="mb-7 text-center lg:text-left">
                  <p className="lh-accent text-[11px] font-semibold uppercase tracking-wide">
                    Partner application
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Create your partner account
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tell us about yourself and your business. You&apos;ll finish profile and KYC
                    next.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field id="full_name" label="Full name" icon={User} required>
                      <Input id="full_name" name="full_name" className={inputClass} required />
                    </Field>
                    <Field id="company_name" label="Company name" icon={Building2}>
                      <Input id="company_name" name="company_name" className={inputClass} />
                    </Field>
                    <Field id="email" label="Email" icon={Mail} required>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={inputClass}
                        required
                      />
                    </Field>
                    <Field id="password" label="Password" icon={Lock} required>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={cn(inputClass, "pr-11")}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" strokeWidth={2} />
                        ) : (
                          <Eye className="size-4" strokeWidth={2} />
                        )}
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
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="years_of_experience" label="Years of experience" icon={User} required>
                      <Input
                        id="years_of_experience"
                        name="years_of_experience"
                        className={inputClass}
                        required
                      />
                    </Field>
                    <Field
                      id="monthly_client_volume"
                      label="Monthly client volume"
                      icon={Building2}
                      required
                    >
                      <Input
                        id="monthly_client_volume"
                        name="monthly_client_volume"
                        placeholder="e.g. 5–10 clients"
                        className={inputClass}
                        required
                      />
                    </Field>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="services_offered"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      Services you offer *
                    </Label>
                    <Textarea
                      id="services_offered"
                      name="services_offered"
                      rows={3}
                      className="rounded-xl border-input bg-background shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25"
                      placeholder="Exchange listings, marketing, market making…"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl font-semibold"
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

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login?redirect=/partner"
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
