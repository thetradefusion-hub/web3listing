"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderKanban,
  Store,
  DollarSign,
  Shield,
  Headphones,
  BarChart3,
  UserCheck,
  FileText,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { signOut } from "@/lib/actions";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import {
  PortalSidebarBrand,
  PortalSidebarCard,
  PortalSidebarFooter,
  PortalSidebarIconAction,
  PortalSidebarLogout,
  PortalSidebarNav,
  PortalSidebarNavItem,
  PortalSidebarSection,
  PortalSidebarShell,
} from "@/components/shared/portal-sidebar-ui";

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "People & Orders",
    items: [
      { href: "/admin/agents", label: "Agents", icon: Users },
      { href: "/admin/kyc", label: "KYC Review", icon: UserCheck },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/orders", label: "Orders", icon: Package },
      { href: "/admin/services", label: "Services", icon: Store },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: DollarSign },
      { href: "/admin/withdrawals", label: "Withdrawals", icon: Shield },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/admin/leads", label: "CRM Leads", icon: FileText },
      { href: "/admin/tickets", label: "Support Tickets", icon: Headphones },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || (href !== "/admin" && pathname.startsWith(href));
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

export function AdminSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { collapsed: shellCollapsed } = usePortalShell();
  const collapsed = onNavigate ? false : shellCollapsed;

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <PortalSidebarShell className={className} collapsed={collapsed} collapsible={!onNavigate}>
      <PortalSidebarBrand href="/admin" badge="Admin Panel" collapsed={collapsed} />

      <PortalSidebarNav collapsed={collapsed}>
        {navSections.map((section) => (
          <PortalSidebarSection key={section.label} label={section.label} collapsed={collapsed}>
            {section.items.map((item) => (
              <PortalSidebarNavItem
                key={item.href + item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isItemActive(pathname, item.href, item.exact)}
                onClick={onNavigate}
                collapsed={collapsed}
              />
            ))}
          </PortalSidebarSection>
        ))}
      </PortalSidebarNav>

      <PortalSidebarFooter collapsed={collapsed}>
        {collapsed ? (
          <PortalSidebarIconAction
            href="/admin/reports"
            label="View Reports"
            icon={BarChart3}
            onClick={onNavigate}
          />
        ) : (
          <PortalSidebarCard>
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Operations</p>
                <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-200">
                  Agents, orders & finance
                </p>
              </div>
            </div>
            <Link
              href="/admin/reports"
              onClick={onNavigate}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-900/25 transition hover:opacity-90"
            >
              View Reports
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </PortalSidebarCard>
        )}
        <PortalSidebarLogout onLogout={handleLogout} collapsed={collapsed} />
      </PortalSidebarFooter>
    </PortalSidebarShell>
  );
}
