import Link from "next/link";
import {
  FolderKanban,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  Wallet,
  Headphones,
  Shield,
  Send,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/commission";
import {
  OrderStatusBadge,
  TopServicesList,
  DashboardEmptyOrders,
  EarningsOverviewCard,
} from "@/components/partner/dashboard/ui";
import { QuickActionsGrid } from "@/components/partner/dashboard/quick-actions";
import {
  PartnerStatCard,
  PremiumPanelHeader,
  ProjectTokenChip,
  SupportActionCard,
} from "@/components/partner/dashboard/dashboard-premium";
import { rel, PartnerPageShell, PartnerPanel, PartnerPrimaryButton, PartnerSecondaryButton } from "@/components/partner/ui";
import { EarningsChart } from "@/components/partner/dashboard/earnings-chart";
import { ProjectStatusChart } from "@/components/partner/dashboard/project-status-chart";
import { Button } from "@/components/ui/button";
import { MobileDataCard, ResponsiveTableShell } from "@/components/shared/responsive-table";
import type { AccountManager } from "@/types/database";
import type { OrderStatus } from "@/types/database";

type RecentOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  services?: { name: string; estimated_tat?: string | null } | { name: string; estimated_tat?: string | null }[] | null;
  projects?: { project_name: string; token_symbol: string | null } | { project_name: string; token_symbol: string | null }[] | null;
};

export function PartnerDashboardView({
  kycRequired,
  stats,
  recentOrders,
  quoteMap,
  paymentMap,
  projectChartData,
  totalProjects,
  topServices,
  monthEarnings,
  earningsGrowth,
  monthLabel,
  earningsChartData,
  quickActions,
  manager,
}: {
  kycRequired: boolean;
  stats: {
    projectCount: number;
    orderCount: number;
    activeOrders: string | number;
    completedOrders: number;
    lifetimeEarnings: number;
    availableBalance: number;
    pendingBalance: number;
    activeOrderPct?: string;
    completionRate?: string;
  };
  recentOrders: RecentOrder[];
  quoteMap: Map<string, number>;
  paymentMap: Map<string, number>;
  projectChartData: { name: string; value: number; percent: number }[];
  totalProjects: number;
  topServices: { name: string; count: number }[];
  monthEarnings: string;
  earningsGrowth: string;
  monthLabel: string;
  earningsChartData: { label: string; amount: number }[];
  quickActions: { label: string; href: string; icon: LucideIcon; color: string }[];
  manager: AccountManager | null;
}) {
  const displayOrders = recentOrders.slice(0, 5);

  return (
    <PartnerPageShell compact className="space-y-3">
      {kycRequired && (
        <div className="premium-card relative overflow-hidden border-[#FDE68A] bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7]/30 p-2.5 sm:p-3">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#F59E0B]" />
          <div className="flex items-center gap-2.5 pl-2 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] ring-1 ring-[#FDE68A]">
              <AlertTriangle className="h-4 w-4 text-[#D97706]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#92400E]">KYC Verification Required</p>
              <p className="text-[10px] text-[#B45309]">Complete KYC to place orders and earn commissions.</p>
            </div>
            <Button asChild size="sm" className="h-8 shrink-0 rounded-lg bg-[#F59E0B] px-3 text-xs shadow-sm hover:bg-[#D97706]">
              <Link href="/partner/kyc">Complete KYC</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2.5">
        <PartnerStatCard title="Total Projects" value={stats.projectCount} icon={FolderKanban} color="blue" />
        <PartnerStatCard title="Total Orders" value={stats.orderCount} icon={ClipboardList} color="green" />
        <PartnerStatCard title="Active Orders" value={stats.activeOrders} icon={Clock} color="orange" trend={stats.activeOrderPct} trendDirection="neutral" />
        <PartnerStatCard title="Completed" value={stats.completedOrders} icon={CheckCircle2} color="purple" trend={stats.completionRate} />
        <PartnerStatCard title="Total Earnings" value={formatCurrency(stats.lifetimeEarnings)} icon={DollarSign} color="teal" />
        <PartnerStatCard
          title="Available Balance"
          value={formatCurrency(stats.availableBalance)}
          icon={Wallet}
          color="pink"
          trend={stats.pendingBalance > 0 ? `${formatCurrency(stats.pendingBalance)} pending` : undefined}
          trendDirection="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12 lg:items-stretch lg:gap-3">
        <PartnerPanel className="premium-card-interactive flex h-full flex-col overflow-hidden lg:col-span-8">
          <PremiumPanelHeader
            title="Recent Orders"
            description="Latest activity across your projects"
            accent="bg-[#635BFF]"
            action={
              <Link
                href="/partner/orders"
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#635BFF] hover:text-[#5248E6] lg:text-[11px]"
              >
                View All
                <ChevronRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <ResponsiveTableShell
              className="flex-1"
              table={
                <table className="portal-table portal-table-laptop w-full">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Project</th>
                      <th className="hidden md:table-cell">Service</th>
                      <th>Status</th>
                      <th className="hidden lg:table-cell text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.length > 0
                      ? displayOrders.map((order) => {
                          const amount = quoteMap.get(order.id) ?? paymentMap.get(order.id) ?? 0;
                          const project = rel(order.projects);
                          const service = rel(order.services);
                          return (
                            <tr key={order.id} className="transition-colors hover:bg-[#FAFBFF]">
                              <td className="whitespace-nowrap">
                                <Link
                                  href={`/partner/orders/${order.id}`}
                                  className="text-[11px] font-semibold text-[#635BFF] hover:underline"
                                >
                                  #{order.order_number}
                                </Link>
                              </td>
                              <td className="max-w-[140px]">
                                <ProjectTokenChip symbol={project?.token_symbol} name={project?.project_name} />
                              </td>
                              <td className="hidden max-w-[110px] truncate text-[#64748B] md:table-cell">
                                {service?.name || "—"}
                              </td>
                              <td>
                                <OrderStatusBadge status={order.status} mini />
                              </td>
                              <td className="hidden text-right text-[11px] font-bold tabular-nums text-[#0F172A] lg:table-cell">
                                {amount ? formatCurrency(amount) : "—"}
                              </td>
                            </tr>
                          );
                        })
                      : null}
                    {displayOrders.length > 0 &&
                      displayOrders.length < 5 &&
                      Array.from({ length: 5 - displayOrders.length }).map((_, i) => (
                        <tr key={`pad-${i}`} aria-hidden className="pointer-events-none">
                          <td colSpan={5} className="!border-b !border-[#f1f5f9] !py-[5px]" />
                        </tr>
                      ))}
                    {displayOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <DashboardEmptyOrders compact />
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              }
              mobile={
                displayOrders.length > 0 ? (
                  displayOrders.map((order) => {
                    const amount = quoteMap.get(order.id) ?? paymentMap.get(order.id) ?? 0;
                    const project = rel(order.projects);
                    const service = rel(order.services);
                    return (
                      <MobileDataCard key={order.id} href={`/partner/orders/${order.id}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[10px] font-bold text-[#635BFF]">
                              {(project?.token_symbol || project?.project_name || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#635BFF]">#{order.order_number}</p>
                              <p className="truncate text-xs font-medium text-[#0F172A]">{project?.project_name || "—"}</p>
                            </div>
                          </div>
                          <OrderStatusBadge status={order.status} compact />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-2 text-[11px]">
                          <span className="text-[#64748B]">{service?.name || "—"}</span>
                          <span className="font-bold text-[#0F172A]">{amount ? formatCurrency(amount) : "—"}</span>
                        </div>
                      </MobileDataCard>
                    );
                  })
                ) : (
                  <DashboardEmptyOrders compact />
                )
              }
            />
          </div>
        </PartnerPanel>

        <PartnerPanel className="premium-card-interactive flex h-full flex-col lg:col-span-4">
          <PremiumPanelHeader title="Quick Actions" description="Shortcuts to common tasks" accent="bg-[#10B981]" />
          <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#FAFBFF]/50 to-white p-2.5 lg:p-3">
            <QuickActionsGrid actions={quickActions} compact premium />
          </div>
        </PartnerPanel>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 lg:gap-3">
        <PartnerPanel className="premium-card-interactive overflow-hidden">
          <PremiumPanelHeader title="Project Status" description="Breakdown by approval stage" accent="bg-[#10B981]" />
          <div className="bg-gradient-to-b from-[#FAFBFF]/30 to-white p-2.5 lg:p-3">
            {totalProjects > 0 ? (
              <ProjectStatusChart data={projectChartData} total={totalProjects} compact />
            ) : (
              <p className="py-4 text-center text-xs text-[#94A3B8]">No projects yet</p>
            )}
          </div>
        </PartnerPanel>

        <PartnerPanel className="premium-card-interactive overflow-hidden">
          <PremiumPanelHeader title="Top Services" description="Most ordered services" accent="bg-[#8B5CF6]" />
          <div className="bg-gradient-to-b from-[#FAFBFF]/30 to-white p-2.5 lg:p-3">
            {topServices.length > 0 ? (
              <TopServicesList services={topServices.slice(0, 4)} compact premium />
            ) : (
              <p className="py-4 text-center text-xs text-[#94A3B8]">No service orders yet</p>
            )}
          </div>
        </PartnerPanel>

        <PartnerPanel className="premium-card-interactive overflow-hidden">
          <PremiumPanelHeader title="Earnings Overview" description="Monthly commission performance" accent="bg-[#14B8A6]" />
          <div className="bg-gradient-to-b from-[#FAFBFF]/30 to-white p-2.5 lg:p-3">
            <EarningsOverviewCard
              monthEarnings={monthEarnings}
              earningsGrowth={earningsGrowth}
              monthLabel={monthLabel}
              chart={<EarningsChart data={earningsChartData} compact />}
              compact
            />
          </div>
        </PartnerPanel>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 lg:gap-3">
        <SupportActionCard
          icon={Headphones}
          title="Need Help?"
          description="Our support team is available on Telegram for quick assistance with orders and projects."
          tone="from-[#EEF2FF]/40 to-white"
          accent="bg-[#635BFF]"
        >
          {manager?.telegram_link ? (
            <a
              href={manager.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#635BFF] py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              <Send className="h-3.5 w-3.5" />
              Contact on Telegram
            </a>
          ) : (
            <PartnerPrimaryButton href="/partner/support" className="mt-2.5 h-8 w-full text-xs">
              Open Support
            </PartnerPrimaryButton>
          )}
        </SupportActionCard>

        <SupportActionCard
          icon={Send}
          title="Account Manager"
          description="Your dedicated point of contact for project and order support."
          tone="from-[#ECFDF5]/40 to-white"
          accent="bg-[#10B981]"
        >
          {manager ? (
            <div className="mt-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white/80 p-2">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#635BFF] to-[#5248E6] text-xs font-bold text-white shadow-sm">
                  {manager.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#10B981]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#0F172A]">{manager.name}</p>
                  <p className="truncate text-[10px] text-[#64748B]">{manager.telegram_id}</p>
                </div>
              </div>
              <p className="mt-1.5 text-[10px] text-[#94A3B8]">
                {manager.support_hours || "Mon–Sat 10:00 AM – 7:00 PM IST"}
              </p>
              {manager.telegram_link && (
                <PartnerSecondaryButton href={manager.telegram_link} className="mt-2 h-8 w-full text-xs">
                  <Send className="h-3.5 w-3.5" />
                  Message on Telegram
                </PartnerSecondaryButton>
              )}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-[#64748B]">A dedicated manager will be assigned soon.</p>
          )}
        </SupportActionCard>

        <SupportActionCard
          icon={Shield}
          title="Important Note"
          description="All official communication happens only via Telegram. Never share payment details with unverified accounts."
          tone="from-[#FFFBEB]/40 to-white"
          accent="bg-[#F59E0B]"
        >
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#FFFBEB]/80 px-2 py-1.5 text-[10px] font-semibold text-[#B45309] ring-1 ring-[#FDE68A]/60">
            <TrendingUp className="h-3.5 w-3.5" />
            Stay safe — verify before you pay
          </div>
        </SupportActionCard>
      </div>
    </PartnerPageShell>
  );
}
