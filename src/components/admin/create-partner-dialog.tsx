"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAgentAccount } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export function CreatePartnerDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await createAgentAccount({
      email: form.get("email") as string,
      full_name: form.get("full_name") as string,
      company_name: form.get("company_name") as string,
      telegram_username: form.get("telegram_username") as string,
      country: form.get("country") as string,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setCredentials({ email: result.email!, password: result.password! });
    toast.success("Partner created successfully!");
    router.refresh();
  }

  function handleClose() {
    setOpen(false);
    setCredentials(null);
    setCopied(false);
  }

  async function copyCredentials() {
    if (!credentials) return;
    await navigator.clipboard.writeText(
      `Email: ${credentials.email}\nPassword: ${credentials.password}\nLogin: ${window.location.origin}/login`
    );
    setCopied(true);
    toast.success("Credentials copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Button
        onClick={() => { setCredentials(null); setOpen(true); }}
        className="h-11 rounded-xl shadow-sm"
      >
        Create Partner
      </Button>
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
        {open ? (
        <DialogContent className="max-w-md">
          {credentials ? (
            <>
              <DialogHeader>
                <DialogTitle>Partner Created — Save Credentials</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Password email se bhi bheja gaya (agar Resend configured ho). Neeche credentials save kar lein:
                </p>
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-2 font-mono text-sm">
                  <div><span className="text-slate-500">Email: </span>{credentials.email}</div>
                  <div><span className="text-slate-500">Password: </span><strong className="text-violet-700">{credentials.password}</strong></div>
                  <div className="text-xs text-slate-500 pt-1">KYC: Auto-approved</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyCredentials} className="flex-1 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy Credentials
                  </Button>
                  <Button variant="outline" onClick={handleClose}>Done</Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader><DialogTitle>Create Partner Account</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required /></div>
                <div className="space-y-2"><Label>Full Name *</Label><Input name="full_name" required /></div>
                <div className="space-y-2"><Label>Company</Label><Input name="company_name" /></div>
                <div className="space-y-2"><Label>Telegram</Label><Input name="telegram_username" /></div>
                <div className="space-y-2"><Label>Country</Label><Input name="country" /></div>
                <Button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90">
                  {loading ? "Creating..." : "Create Partner"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
