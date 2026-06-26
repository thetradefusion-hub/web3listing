"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetAgentPassword, approveAgentKyc } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { KeyRound, UserCheck } from "lucide-react";
import type { KycStatus } from "@/types/database";

export function PartnerActions({
  partnerId,
  email,
  kycStatus,
}: {
  partnerId: string;
  email: string;
  kycStatus: KycStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);

  async function handleResetPassword() {
    setLoading(true);
    const result = await resetAgentPassword(partnerId);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setNewPassword(result.password!);
    toast.success("Password reset!");
    router.refresh();
  }

  async function handleApproveKyc() {
    setLoading(true);
    await approveAgentKyc(partnerId);
    setLoading(false);
    toast.success("KYC approved!");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        {kycStatus === "pending" && (
          <Button size="sm" variant="outline" onClick={handleApproveKyc} disabled={loading} className="rounded-xl">
            <UserCheck data-icon="inline-start" />
            Approve KYC
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={handleResetPassword} disabled={loading} className="rounded-xl">
          <KeyRound data-icon="inline-start" />
          Reset Password
        </Button>
      </div>

      {newPassword ? (
      <Dialog open onOpenChange={() => setNewPassword(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Password — {email}</DialogTitle></DialogHeader>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-sm text-slate-500 mb-2">Partner ko ye credentials dein:</p>
            <p className="font-mono text-lg font-bold text-violet-700">{newPassword}</p>
          </div>
          <Button onClick={() => { navigator.clipboard.writeText(newPassword!); toast.success("Copied!"); }} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90">
            Copy Password
          </Button>
        </DialogContent>
      </Dialog>
      ) : null}
    </>
  );
}
