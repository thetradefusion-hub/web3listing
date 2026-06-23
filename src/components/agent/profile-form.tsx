"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, changePassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import { AgentPanel, AgentPanelHeader, AgentPanelBody } from "@/components/agent/ui";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    const form = new FormData(e.currentTarget);
    const pw = form.get("password") as string;
    const confirm = form.get("confirm") as string;
    if (pw !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    const result = await changePassword(pw);
    if (result.error) toast.error(result.error);
    else toast.success("Password changed");
  }

  return (
    <div className="space-y-6">
      <AgentPanel>
        <AgentPanelHeader title="Profile Information" />
        <AgentPanelBody>
          <form onSubmit={handleProfile} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Full Name</Label><Input name="full_name" defaultValue={profile.full_name || ""} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Company</Label><Input name="company_name" defaultValue={profile.company_name || ""} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={profile.email} disabled className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Telegram</Label><Input name="telegram_username" defaultValue={profile.telegram_username || ""} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Mobile</Label><Input name="mobile" defaultValue={profile.mobile || ""} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Country</Label><Input name="country" defaultValue={profile.country || ""} className="rounded-xl" /></div>
              <div className="space-y-2 md:col-span-2"><Label>Wallet Address</Label><Input name="wallet_address" defaultValue={profile.wallet_address || ""} className="rounded-xl" /></div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </AgentPanelBody>
      </AgentPanel>

      <AgentPanel>
        <AgentPanelHeader title="Change Password" />
        <AgentPanelBody>
          <form onSubmit={handlePassword} className="space-y-4">
            <div className="space-y-2"><Label>New Password</Label><Input name="password" type="password" minLength={6} required className="rounded-xl" /></div>
            <div className="space-y-2"><Label>Confirm Password</Label><Input name="confirm" type="password" minLength={6} required className="rounded-xl" /></div>
            <Button type="submit" variant="outline" className="rounded-xl border-slate-200">
              Change Password
            </Button>
          </form>
        </AgentPanelBody>
      </AgentPanel>
    </div>
  );
}
