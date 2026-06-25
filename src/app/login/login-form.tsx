"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Layers,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { signIn } from "@/lib/actions";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PARTNER_FEATURES = [
  {
    icon: Layers,
    title: "Manage token projects",
    description: "Organize listings, contracts, and networks in one place.",
  },
  {
    icon: TrendingUp,
    title: "Order growth services",
    description: "Access listings, PR, security, and marketing from one catalog.",
  },
  {
    icon: ShieldCheck,
    title: "Track orders & payouts",
    description: "Monitor delivery status, commissions, and wallet balance.",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    description: "Get help from your account manager on Telegram.",
  },
] as const;

const inputClass = "h-11 rounded-xl border-input bg-background pl-10 shadow-sm";

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <li className="flex gap-3 rounded-xl border border-border/60 bg-card/50 p-3.5 backdrop-blur-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await signIn(form.get("email") as string, form.get("password") as string);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    const redirectParam = searchParams.get("redirect");
    const destination = redirectParam || result.redirectTo || "/";
    window.location.href = destination;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <div className="login-glow pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/15 blur-[100px] sm:h-96 sm:w-96" />
      <div className="login-glow pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-chart-4/15 blur-[100px] sm:h-96 sm:w-96" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition hover:border-primary/25 hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          <span className="hidden sm:inline">Back to website</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <ThemeToggle
          variant="outline"
          className="size-9 rounded-xl border-border/60 bg-card/70 text-muted-foreground backdrop-blur-sm hover:text-foreground"
        />
      </header>

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Brand panel — desktop */}
        <aside className="relative hidden overflow-hidden border-r border-border lg:flex lg:w-[44%] lg:flex-col xl:w-[48%]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-card to-chart-4/8" />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2" aria-hidden />

          <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
            <div>
              <BrandLogo href="/" size="lg" />
              <h1 className="mt-8 text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl">
                Grow your Web3 projects with confidence
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Sign in to manage projects, order listing services, and track commissions from a single
                partner dashboard.
              </p>
            </div>

            <ul className="mt-10 flex flex-col gap-3">
              {PARTNER_FEATURES.map((feature) => (
                <FeatureItem key={feature.title} {...feature} />
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-chart-2" strokeWidth={2.5} />
                Secure partner access
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-chart-2" strokeWidth={2.5} />
                24/7 Telegram support
              </span>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:py-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-6 flex justify-center lg:hidden">
              <BrandLogo href="/" size="lg" />
            </div>

            <Card size="sm" className="relative overflow-hidden border-border/80 bg-card/90 py-0 shadow-xl backdrop-blur-xl">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2" aria-hidden />
              <CardContent className="p-6 sm:p-8">
                <div className="mb-7 text-center lg:text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Welcome back</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Sign in</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to your partner or user account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                      Email address
                    </Label>
                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-primary" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="shrink-0 text-xs font-semibold text-primary transition hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-primary" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        className={cn(inputClass, "pr-11")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-semibold shadow-sm">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Continue to dashboard
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                      Create account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/legal/terms" className="font-medium underline underline-offset-2 hover:text-foreground">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="font-medium underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
