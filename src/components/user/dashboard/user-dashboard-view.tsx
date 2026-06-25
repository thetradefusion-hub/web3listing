import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FolderKanban,
  Headphones,
  Layers,
  Package,
  PieChart,
  Plus,
  ShoppingBag,
  Store,
  Upload,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OrderDonutChart } from "@/components/admin/dashboard/dashboard-charts";
import { DashboardPanel, PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { OrderStatusBadge } from "@/components/partner/dashboard/ui";
import { CopyTextButton } from "@/components/partner/projects/copy-text-button";
import { rel } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  CATEGORY_ICONS,
  getServiceAccent,
  getServiceCardMeta,
  getServiceLogoColor,
} from "@/lib/service-catalog";
import { quickActionIconStyles, type AccentColor } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";
import type { OrderStatus, Profile, Project, Service } from "@/types/database";

const CLIENT_ORDER_GROUPS: Record<string, OrderStatus[]> = {
  "In Progress": ["payment_confirmed", "in_progress", "third_party_review"],
  Completed: ["completed", "delivered", "closed"],
  Pending: ["submitted", "under_review", "waiting_payment"],
};

const DONUT_COLORS: Record<string, string> = {
  "In Progress": "var(--chart-4)",
  Completed: "var(--chart-2)",
  Pending: "var(--chart-3)",
};

function buildClientOrderDonut(orders: { status: OrderStatus }[]) {
  const total = orders.length || 1;
  return Object.entries(CLIENT_ORDER_GROUPS)
    .map(([label, statuses]) => {
      const count = orders.filter((o) => statuses.includes(o.status)).length;
      return { label, count, percent: total ? Math.round((count / total) * 100) : 0, color: DONUT_COLORS[label] };
    })
    .filter((e) => e.count > 0);
}

type RecentOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  services?: { name: string } | { name: string }[] | null;
  projects?: { project_name: string; token_symbol: string | null; logo_url?: string | null } | { project_name: string; token_symbol: string | null; logo_url?: string | null }[] | null;
};

type RecommendedService = Service & {
  service_categories?: { name: string; slug: string } | null;
};

function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
      {children}
      <ChevronRight className="size-3.5" />
    </Link>
  );
}

function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function UserDashboardView({
  profile,
  stats,
  recentOrders,
  orderStatusData,
  featuredProject,
  projectOrderCount,
  recommendedServices,
}: {
  profile: Profile;
  stats: {
    orderCount: number;
    activeOrders: number;
    completedOrders: number;
    pendingOrders: number;
  };
  recentOrders: RecentOrder[];
  orderStatusData: { status: OrderStatus }[];
  featuredProject: Project | null;
  projectOrderCount: number;
  recommendedServices: RecommendedService[];
}) {
  const displayName = profile.company_name || profile.full_name || profile.email.split("@")[0];
  const donutSegments = buildClientOrderDonut(orderStatusData);
  const displayOrders = recentOrders.slice(0, 4);

  const quickActions: { label: string; href: string; icon: LucideIcon; color: AccentColor }[] = [
    { label: "Place New Order", href: "/user/services", icon: ShoppingBag, color: "purple" },
    { label: "View All Services", href: "/user/services", icon: Store, color: "green" },
    { label: "Upload Documents", href: "/user/kyc", icon: Upload, color: "orange" },
    { label: "Create Support Ticket", href: "/user/support", icon: Headphones, color: "blue" },
  ];

  return (
    <div className="client-dashboard mx-auto flex w-full max-w-[1440px] flex-col gap-5 pb-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 size-40 rounded-full bg-chart-4/10 blur-3xl" />
        <div className="relative min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Client dashboard</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[26px]">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today —{" "}
            {stats.activeOrders > 0
              ? `${stats.activeOrders} order${stats.activeOrders === 1 ? "" : "s"} in progress`
              : "ready when you are"}
            {stats.pendingOrders > 0 ? `, ${stats.pendingOrders} awaiting action` : ""}.
          </p>
        </div>
        <Button asChild size="lg" className="relative mt-4 h-11 shrink-0 rounded-xl sm:mt-0">
          <Link href="/user/services">
            <Plus data-icon="inline-start" className="size-4" />
            New Order
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <PartnerStatCard title="Total Orders" value={stats.orderCount} icon={ClipboardList} color="purple" />
        <PartnerStatCard title="In Progress" value={stats.activeOrders} icon={Clock} color="blue" />
        <PartnerStatCard title="Completed" value={stats.completedOrders} icon={CheckCircle2} color="green" />
        <PartnerStatCard title="Pending" value={stats.pendingOrders} icon={Package} color="orange" />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
        <DashboardPanel
          className="xl:col-span-4"
          title="Order Status Overview"
          icon={PieChart}
          iconColor="purple"
          contentClassName="items-center py-2"
        >
          {orderStatusData.length > 0 ? (
            <>
              <OrderDonutChart segments={donutSegments} total={orderStatusData.length} />
              <Button asChild variant="outline" className="mt-2 w-full rounded-xl">
                <Link href="/user/orders">View All Orders</Link>
              </Button>
            </>
          ) : (
            <Empty className="border-0 bg-transparent py-6">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
                  <BarChart3 />
                </EmptyMedia>
                <EmptyTitle className="text-base">No order data yet</EmptyTitle>
                <EmptyDescription>Browse services to place your first order.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild size="sm" className="rounded-xl">
                  <Link href="/user/services">Explore Services</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </DashboardPanel>

        <DashboardPanel
          className="xl:col-span-5"
          title="Recent Orders"
          icon={Package}
          iconColor="blue"
          action={<PanelLink href="/user/orders">View all</PanelLink>}
          contentClassName="p-0"
        >
          {displayOrders.length > 0 ? (
            <ul className="divide-y divide-border">
              {displayOrders.map((order) => {
                const service = rel(order.services);
                const project = rel(order.projects);
                const initials = (project?.token_symbol || service?.name || "?").slice(0, 2).toUpperCase();
                const logoColor = getServiceLogoColor(service?.name || "Service");
                return (
                  <li key={order.id}>
                    <Link
                      href={`/user/orders/${order.id}`}
                      className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-muted/40"
                    >
                      <div
                        className={cn(
                          "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold shadow-sm ring-1 ring-border/60",
                          logoColor
                        )}
                      >
                        {project?.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.logo_url} alt="" className="size-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">#{order.order_number}</p>
                        <p className="truncate text-xs text-muted-foreground">{service?.name || "Service"}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <OrderStatusBadge status={order.status} compact />
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {format(new Date(order.created_at), "dd MMM yyyy")}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-8">
              <Empty className="border-0 bg-transparent py-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Package />
                  </EmptyMedia>
                  <EmptyTitle>No orders yet</EmptyTitle>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild size="sm" className="rounded-xl">
                    <Link href="/user/services">Place first order</Link>
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel
          className="xl:col-span-3"
          title="My Projects"
          icon={FolderKanban}
          iconColor="green"
          action={<PanelLink href="/user/projects">View all</PanelLink>}
        >
          {featuredProject ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-bold text-primary-foreground shadow-md ring-2 ring-card",
                    getServiceLogoColor(featuredProject.project_name)
                  )}
                >
                  {featuredProject.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featuredProject.logo_url} alt="" className="size-full object-cover" />
                  ) : (
                    (featuredProject.token_symbol || featuredProject.project_name).slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-snug text-foreground">
                    {featuredProject.project_name}
                    <span className="font-semibold text-muted-foreground"> ({featuredProject.token_symbol})</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Layers className="size-3.5 shrink-0" />
                    {featuredProject.blockchain_network}
                  </p>
                  <span className="mt-2 inline-flex items-center rounded-full bg-chart-2/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-chart-2 ring-1 ring-chart-2/20">
                    {featuredProject.status === "approved" ? "Active" : featuredProject.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {featuredProject.contract_address ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                  <code className="min-w-0 flex-1 truncate text-[11px] font-medium text-muted-foreground">
                    {truncateAddress(featuredProject.contract_address)}
                  </code>
                  <CopyTextButton text={featuredProject.contract_address} />
                </div>
              ) : null}

              <p className="text-[11px] font-medium text-muted-foreground">
                Created {format(new Date(featuredProject.created_at), "dd MMM yyyy")}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Orders", value: projectOrderCount },
                  { label: "Network", value: featuredProject.blockchain_network },
                  { label: "Token", value: featuredProject.token_symbol },
                  { label: "Status", value: featuredProject.status === "approved" ? "Active" : featuredProject.status },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="h-10 w-full rounded-xl">
                <Link href={`/user/projects/${featuredProject.id}`}>Open project</Link>
              </Button>
            </div>
          ) : (
            <Empty className="border-0 bg-transparent py-4">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-chart-2/10 text-chart-2">
                  <FolderKanban />
                </EmptyMedia>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>Add a token project before ordering services.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild className="rounded-xl">
                  <Link href="/user/projects/new">Create project</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </DashboardPanel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <DashboardPanel
          className="lg:col-span-8"
          title="Recommended Services For You"
          description="Hand-picked listings and growth services"
          icon={Store}
          iconColor="amber"
          action={<PanelLink href="/user/services">View all</PanelLink>}
        >
          {recommendedServices.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              {recommendedServices.map((service) => {
                const meta = getServiceCardMeta(service);
                const logoColor = getServiceLogoColor(service.name);
                const accent = getServiceAccent(service.name);
                const catSlug = service.service_categories?.slug || "listing-services";
                const CatIcon = CATEGORY_ICONS[catSlug] || Store;
                return (
                  <div
                    key={service.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/30 hover:shadow-md"
                  >
                    <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b opacity-80", accent)} />
                    <div className="flex flex-1 flex-col p-4 pl-5">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ring-1 ring-border/60",
                            logoColor
                          )}
                        >
                          <CatIcon className="size-4" strokeWidth={2.25} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-foreground">{service.name}</p>
                            {service.badge ? (
                              <span className="rounded-full bg-chart-3/10 px-2 py-0.5 text-[10px] font-bold capitalize text-chart-3 ring-1 ring-chart-3/20">
                                {service.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {service.overview || service.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Starting from
                          </p>
                          <p className="text-base font-bold text-foreground">{meta.priceLabel}</p>
                        </div>
                        <Button asChild size="sm" className="h-8 rounded-lg px-3 text-xs font-semibold">
                          <Link href={`/user/services/${service.slug}`}>
                            Order Now
                            <ArrowUpRight className="ml-0.5 size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Services will appear here once the catalog is loaded.
            </p>
          )}
        </DashboardPanel>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <DashboardPanel title="Quick Actions" icon={Zap} iconColor="amber" contentClassName="py-2">
            <ul className="space-y-0.5">
              {quickActions.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/40"
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl ring-1",
                        quickActionIconStyles[action.color]
                      )}
                    >
                      <action.icon className="size-4" strokeWidth={2} />
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground">{action.label}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </DashboardPanel>

          <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-600 to-indigo-900 p-5 text-white shadow-lg dark:from-violet-950 dark:to-indigo-950">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_55%)]" />
            <div className="pointer-events-none absolute -bottom-8 -right-6 size-32 rounded-full bg-primary/30 blur-2xl" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">Growth</p>
              <p className="mt-2 text-lg font-bold leading-snug">Grow your project with our services</p>
              <p className="mt-2 text-xs leading-relaxed text-violet-100/90">
                Listings, PR, audits, and market-making — curated for Web3 teams.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-5 rounded-lg bg-white font-semibold text-violet-700 hover:bg-white/95"
              >
                <Link href="/user/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
