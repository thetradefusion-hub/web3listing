"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import {
  getPartnerEmailOtpDevHint,
  resendPartnerEmailOtp,
  verifyPartnerEmailOtp,
} from "@/lib/actions/partner-onboarding";
import { NAVIGATION_START_EVENT } from "@/components/shared/route-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function VerifyEmailForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [emailStub, setEmailStub] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hint = await getPartnerEmailOtpDevHint();
      if (cancelled) return;
      if (hint.stub) {
        setEmailStub(true);
        if ("code" in hint && hint.code) setDevCode(hint.code);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const code = String(new FormData(e.currentTarget).get("code") || "");
    const result = await verifyPartnerEmailOtp(code);
    setLoading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Email verified");
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
    window.location.href = result.redirectTo || "/partner/onboarding/business-profile";
  }

  async function handleResend() {
    setResending(true);
    const result = await resendPartnerEmailOtp();
    setResending(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    if (result.stub) {
      setEmailStub(true);
      if (result.devCode) {
        setDevCode(result.devCode);
        toast.success(`Dev mode: use code ${result.devCode}`);
        return;
      }
      toast.message("Email provider not configured — check server logs for OTP");
      return;
    }
    toast.success("New code sent to your email");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Mail className="size-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Check your inbox</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>

      {emailStub ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <p className="font-semibold text-foreground">Email delivery not configured</p>
          <p className="mt-1 text-muted-foreground">
            Set a real <code className="text-xs">RESEND_API_KEY</code> in{" "}
            <code className="text-xs">.env.local</code> to send OTP emails. Until then, use the
            code below (also printed in the server terminal).
          </p>
          {devCode ? (
            <p className="mt-2 font-mono text-2xl font-bold tracking-[0.35em] text-foreground">
              {devCode}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="code" className="text-xs font-semibold text-muted-foreground">
          Verification code
        </Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="000000"
          className="h-14 rounded-xl text-center text-2xl font-semibold tracking-[0.4em] shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/25"
          defaultValue={devCode || undefined}
          key={devCode || "otp-input"}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Verifying…
          </>
        ) : (
          <>
            Verify email
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="w-full text-center text-sm font-medium text-primary hover:underline disabled:opacity-50"
      >
        {resending ? "Sending…" : "Resend code"}
      </button>
    </form>
  );
}
