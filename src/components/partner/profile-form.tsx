"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Send,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { updateProfile, changePassword } from "@/lib/actions";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
        />
        {children}
      </div>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

function SecurityTip({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}

const inputClass = "h-10 rounded-xl border-input bg-background pl-10 shadow-sm";

export function ProfileForm({
  profile,
  kycRequired,
}: {
  profile: Profile;
  kycRequired: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  async function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await updateProfile(Object.fromEntries(form.entries()) as Record<string, string>);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Profile updated");
      router.refresh();
    }
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwLoading(true);
    const form = new FormData(e.currentTarget);
    const pw = form.get("password") as string;
    const confirm = form.get("confirm") as string;
    if (pw !== confirm) {
      setPwLoading(false);
      toast.error("Passwords don't match");
      return;
    }
    const result = await changePassword(pw);
    setPwLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Password changed");
      e.currentTarget.reset();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:items-start">
      <DashboardPanel
        className="xl:col-span-2"
        title="Profile Information"
        description="Update your contact and payout details"
        icon={User}
        iconColor="blue"
      >
        <form onSubmit={handleProfile} className="flex flex-col gap-6">
          <FormSection title="Personal details" description="How we display your partner identity">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="full_name" label="Full Name" icon={User}>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name || ""}
                  className={inputClass}
                  placeholder="Your name"
                />
              </Field>
              <Field id="company_name" label="Company" icon={Building2}>
                <Input
                  id="company_name"
                  name="company_name"
                  defaultValue={profile.company_name || ""}
                  className={inputClass}
                  placeholder="Company name"
                />
              </Field>
            </div>
          </FormSection>

          <Separator />

          <FormSection title="Contact" description="Reach you for orders and support">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="email" label="Email" icon={Mail}>
                <Input id="email" value={profile.email} disabled className={cn(inputClass, "opacity-70")} />
              </Field>
              <Field id="telegram_username" label="Telegram" icon={Send}>
                <Input
                  id="telegram_username"
                  name="telegram_username"
                  defaultValue={profile.telegram_username || ""}
                  className={inputClass}
                  placeholder="@username"
                />
              </Field>
              <Field id="mobile" label="Mobile" icon={Phone}>
                <Input
                  id="mobile"
                  name="mobile"
                  defaultValue={profile.mobile || ""}
                  className={inputClass}
                  placeholder="+1 234 567 8900"
                />
              </Field>
              <Field id="country" label="Country" icon={Globe}>
                <Input
                  id="country"
                  name="country"
                  defaultValue={profile.country || ""}
                  className={inputClass}
                  placeholder="Country"
                />
              </Field>
            </div>
          </FormSection>

          <Separator />

          <FormSection title="Payout wallet" description="Used for commission withdrawals">
            <Field id="wallet_address" label="Wallet Address" icon={Wallet}>
              <Input
                id="wallet_address"
                name="wallet_address"
                defaultValue={profile.wallet_address || ""}
                className={`${inputClass} font-mono text-sm`}
                placeholder="0x..."
              />
            </Field>
          </FormSection>

          <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl font-semibold sm:w-auto sm:px-8">
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </DashboardPanel>

      <div className="flex flex-col gap-4">
        <DashboardPanel
          title="Change Password"
          description="Use a strong password you don't use elsewhere"
          icon={KeyRound}
          iconColor="purple"
        >
          <form onSubmit={handlePassword} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                New Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  className={inputClass}
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-xs font-semibold text-muted-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  minLength={6}
                  required
                  className={inputClass}
                  placeholder="Repeat password"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={pwLoading}
              className="h-10 w-full rounded-xl font-semibold"
            >
              {pwLoading ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </DashboardPanel>

        <DashboardPanel title="Account Security" icon={Shield} iconColor="amber">
          <ul className="flex flex-col gap-2.5">
            <SecurityTip>Email sign-in is tied to your registered address and cannot be changed here.</SecurityTip>
            <SecurityTip>Keep your Telegram username updated so your account manager can reach you.</SecurityTip>
            <SecurityTip>Wallet address is used for commission payouts — double-check before saving.</SecurityTip>
          </ul>
          {kycRequired ? (
            <Button asChild className="mt-4 h-9 w-full rounded-xl font-semibold">
              <Link href="/partner/kyc">Complete KYC Verification</Link>
            </Button>
          ) : null}
        </DashboardPanel>
      </div>
    </div>
  );
}
