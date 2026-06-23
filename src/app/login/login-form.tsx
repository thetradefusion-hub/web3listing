"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
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

    const redirect = searchParams.get("redirect") || "/agent";
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#060a14] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <div className="login-glow pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px]" />
      <div className="login-glow pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[120px]" />

      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition hover:bg-white/5 hover:text-slate-300 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to website
      </Link>

      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <BrandLogo href="/" size="lg" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0b1120]/90 p-6 shadow-xl shadow-black/40 backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Sign in</h1>
            <p className="mt-2 text-sm text-slate-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email
              </Label>
              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-slate-600 focus-visible:border-cyan-500/40 focus-visible:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-slate-400 transition hover:text-cyan-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.04] pl-10 pr-11 text-white placeholder:text-slate-600 focus-visible:border-cyan-500/40 focus-visible:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{" "}
            <a
              href={TELEGRAM_SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Contact support
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          By signing in, you agree to our{" "}
          <Link href="/legal/terms" className="underline underline-offset-2 hover:text-slate-400">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-slate-400">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
