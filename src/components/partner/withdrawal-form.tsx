"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestWithdrawal } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MIN_WITHDRAWAL } from "@/lib/constants";

export function WithdrawalForm({ availableBalance }: { availableBalance: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"usdt" | "bank_transfer" | "crypto_wallet">("usdt");
  const balance = Number(availableBalance) || 0;
  const canWithdraw = balance >= MIN_WITHDRAWAL;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canWithdraw) {
      toast.error(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL) {
      setLoading(false);
      toast.error(`Minimum withdrawal is $${MIN_WITHDRAWAL}`);
      return;
    }
    if (amount > balance) {
      setLoading(false);
      toast.error("Amount exceeds available balance");
      return;
    }

    const result = await requestWithdrawal({
      amount,
      method,
      wallet_address: form.get("wallet_address") as string,
      bank_info: form.get("bank_info") as string,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Withdrawal request submitted");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500">
        Available: ${balance.toFixed(2)} · Minimum: ${MIN_WITHDRAWAL}
      </p>
      {!canWithdraw && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          You need at least ${MIN_WITHDRAWAL} available balance to request a withdrawal.
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (USD)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min={MIN_WITHDRAWAL}
          max={balance}
          step="0.01"
          required
          disabled={!canWithdraw}
        />
      </div>
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select value={method} onValueChange={(v) => v && setMethod(v as typeof method)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="crypto_wallet">Crypto Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {method !== "bank_transfer" ? (
        <div className="space-y-2">
          <Label htmlFor="wallet_address">Wallet Address</Label>
          <Input id="wallet_address" name="wallet_address" required />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="bank_info">Bank Information</Label>
          <Input id="bank_info" name="bank_info" required />
        </div>
      )}
      <Button
        type="submit"
        disabled={loading || !canWithdraw}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:opacity-90"
      >
        {loading ? "Submitting..." : "Request Withdrawal"}
      </Button>
    </form>
  );
}
