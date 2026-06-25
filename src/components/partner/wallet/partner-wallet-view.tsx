import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Clock,
  History,
  ScrollText,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { WithdrawalForm } from "@/components/partner/withdrawal-form";
import { PartnerStatCard, DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerBadge, PartnerPageShell } from "@/components/partner/ui";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/commission";
import { cn } from "@/lib/utils";
import type { CommissionLedger, PaymentMethod, Wallet as WalletRow, Withdrawal } from "@/types/database";

function withdrawalVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  if (status === "paid" || status === "approved") return "success";
  if (status === "rejected") return "danger";
  if (status === "pending") return "warning";
  return "muted";
}

function formatPaymentMethod(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    usdt: "USDT",
    bank_transfer: "Bank Transfer",
    crypto_wallet: "Crypto Wallet",
  };
  return labels[method] || method;
}

export function PartnerWalletView({
  wallet,
  ledger,
  withdrawals,
}: {
  wallet: WalletRow | null;
  ledger: CommissionLedger[];
  withdrawals: Withdrawal[];
}) {
  const available = wallet?.available_balance || 0;
  const pending = wallet?.pending_balance || 0;
  const lifetime = wallet?.lifetime_earnings || 0;

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/partner" className="transition hover:text-primary">
          Dashboard
        </Link>
        <span aria-hidden>›</span>
        <span className="font-medium text-foreground">Wallet</span>
      </nav>

      <section aria-label="Wallet balance" className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <PartnerStatCard
          title="Available Balance"
          value={formatCurrency(available)}
          subtitle="Ready to withdraw"
          icon={Wallet}
          color="blue"
        />
        <PartnerStatCard
          title="Pending Balance"
          value={formatCurrency(pending)}
          subtitle="Processing"
          icon={Clock}
          color="orange"
        />
        <PartnerStatCard
          title="Lifetime Earnings"
          value={formatCurrency(lifetime)}
          subtitle="All time"
          icon={TrendingUp}
          color="purple"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-stretch">
        <DashboardPanel
          title="Request Withdrawal"
          description="Withdraw your available commission balance"
          icon={Banknote}
          iconColor="green"
        >
          <WithdrawalForm availableBalance={available} />
        </DashboardPanel>

        <DashboardPanel title="Withdrawal History" icon={History} iconColor="purple" contentClassName="p-0">
          {withdrawals.length > 0 ? (
            <ResponsiveTableShell
              className="flex-1"
              table={
                <Table className="portal-table">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(w.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">{formatPaymentMethod(w.method)}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          {formatCurrency(w.amount)}
                        </TableCell>
                        <TableCell>
                          <PartnerBadge variant={withdrawalVariant(w.status)}>{w.status}</PartnerBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              mobile={withdrawals.map((w) => (
                <MobileDataCard key={w.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold tabular-nums text-foreground">{formatCurrency(w.amount)}</p>
                      <p className="text-sm text-muted-foreground">{formatPaymentMethod(w.method)}</p>
                    </div>
                    <PartnerBadge variant={withdrawalVariant(w.status)}>{w.status}</PartnerBadge>
                  </div>
                  <div className="mt-3 border-t pt-3">
                    <MobileDataRow label="Date">
                      {format(new Date(w.created_at), "MMM d, yyyy")}
                    </MobileDataRow>
                  </div>
                </MobileDataCard>
              ))}
            />
          ) : (
            <Empty className="border-0 py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-11 bg-primary/10 text-primary">
                  <History />
                </EmptyMedia>
                <EmptyTitle>No withdrawals yet</EmptyTitle>
                <EmptyDescription>Your withdrawal requests will appear here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </DashboardPanel>
      </div>

      <DashboardPanel
        title="Commission Ledger"
        description="Recent credits and debits"
        icon={ScrollText}
        iconColor="teal"
        contentClassName="p-0"
      >
        {ledger.length > 0 ? (
          <ResponsiveTableShell
            className="flex-1"
            table={
              <Table className="portal-table">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((entry) => {
                    const isCredit = entry.type === "credit";
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              isCredit
                                ? "bg-chart-2/10 text-chart-2"
                                : "bg-destructive/10 text-destructive"
                            )}
                          >
                            {isCredit ? (
                              <ArrowUpRight className="size-3" />
                            ) : (
                              <ArrowDownLeft className="size-3" />
                            )}
                            {isCredit ? "Credit" : "Debit"}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate text-muted-foreground">
                          {entry.description || "—"}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-semibold tabular-nums",
                            isCredit ? "text-chart-2" : "text-destructive"
                          )}
                        >
                          {isCredit ? "+" : "-"}
                          {formatCurrency(entry.amount)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {format(new Date(entry.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            }
            mobile={ledger.map((entry) => {
              const isCredit = entry.type === "credit";
              return (
                <MobileDataCard key={entry.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-lg font-bold tabular-nums",
                          isCredit ? "text-chart-2" : "text-destructive"
                        )}
                      >
                        {isCredit ? "+" : "-"}
                        {formatCurrency(entry.amount)}
                      </p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {entry.description || "—"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        isCredit
                          ? "bg-chart-2/10 text-chart-2"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {isCredit ? "Credit" : "Debit"}
                    </span>
                  </div>
                  <div className="mt-3 border-t pt-3">
                    <MobileDataRow label="Date">
                      {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </MobileDataRow>
                  </div>
                </MobileDataCard>
              );
            })}
          />
        ) : (
          <Empty className="border-0 py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-11 bg-primary/10 text-primary">
                <ScrollText />
              </EmptyMedia>
              <EmptyTitle>No ledger entries yet</EmptyTitle>
              <EmptyDescription>Commissions will appear here after completed orders.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </DashboardPanel>
    </PartnerPageShell>
  );
}
