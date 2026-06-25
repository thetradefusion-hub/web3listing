"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Banknote, Wallet } from "lucide-react";
import { requestWithdrawal } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/commission";
import { MIN_WITHDRAWAL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Available
          </span>
          <span className="text-lg font-bold tabular-nums text-foreground">{formatCurrency(balance)}</span>
        </div>
        <div className="flex flex-col gap-1 border-l border-border pl-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Minimum
          </span>
          <span className="text-lg font-bold tabular-nums text-foreground">{formatCurrency(MIN_WITHDRAWAL)}</span>
        </div>
      </div>

      {!canWithdraw && (
        <div className="flex items-start gap-2.5 rounded-xl border border-chart-3/30 bg-chart-3/10 px-3.5 py-3 text-sm text-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-chart-3" />
          <p>You need at least {formatCurrency(MIN_WITHDRAWAL)} available balance to request a withdrawal.</p>
        </div>
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
          placeholder={`Min ${MIN_WITHDRAWAL}`}
          className="h-10 rounded-xl bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select value={method} onValueChange={(v) => v && setMethod(v as typeof method)}>
          <SelectTrigger className="h-10 rounded-xl bg-background">
            <Banknote className="size-4 shrink-0 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
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
          <Input
            id="wallet_address"
            name="wallet_address"
            required
            disabled={!canWithdraw}
            placeholder="Enter wallet address"
            className="h-10 rounded-xl bg-background font-mono text-sm"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="bank_info">Bank Information</Label>
          <Input
            id="bank_info"
            name="bank_info"
            required
            disabled={!canWithdraw}
            placeholder="Account name, number, bank details"
            className="h-10 rounded-xl bg-background"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !canWithdraw}
        className={cn("h-10 w-full rounded-xl font-semibold")}
      >
        <Wallet data-icon="inline-start" />
        {loading ? "Submitting..." : "Request Withdrawal"}
      </Button>
    </form>
  );
}
