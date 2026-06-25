"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { signUp } from "@/lib/actions";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const inputClass = "h-11 rounded-xl border-input bg-background pl-10 shadow-sm";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await signUp({
      email: form.get("email") as string,
      password: form.get("password") as string,
      full_name: form.get("full_name") as string,
      company_name: (form.get("company_name") as string) || undefined,
      country: form.get("country") as string,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setEmailSent(true);
      toast.success("Check your email to confirm your account");
      return;
    }

    toast.success("Account created successfully");
    router.push("/user");
    router.refresh();
  }

  if (emailSent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md border-border/80 bg-card/90 shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-chart-2" />
            <h2 className="mt-4 text-xl font-bold">Check your email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a confirmation link. After verifying, sign in to access your user dashboard.
            </p>
            <Button asChild className="mt-6 w-full rounded-xl">
              <Link href="/login">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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

      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6">
        <div className="mb-6">
          <BrandLogo href="/" size="lg" />
        </div>

        <Card size="sm" className="relative w-full max-w-[420px] overflow-hidden border-border/80 bg-card/90 py-0 shadow-xl backdrop-blur-xl">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2" aria-hidden />
          <CardContent className="p-6 sm:p-8">
            <div className="mb-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Get started</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Create account</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign up to manage projects and order listing services
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-xs font-semibold text-muted-foreground">
                  Full name
                </Label>
                <div className="group relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="full_name" name="full_name" required placeholder="Your name" className={inputClass} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                  Email address
                </Label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={inputClass} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                  Password
                </Label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
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

              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-xs font-semibold text-muted-foreground">
                  Company <span className="font-normal">(optional)</span>
                </Label>
                <Input id="company_name" name="company_name" placeholder="Company name" className="h-11 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-xs font-semibold text-muted-foreground">
                  Country
                </Label>
                <div className="group relative">
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="country" name="country" required placeholder="United States" className={inputClass} />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-semibold shadow-sm">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
