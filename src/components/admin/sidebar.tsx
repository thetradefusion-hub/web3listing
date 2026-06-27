"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderKanban,
  Store,
  Tags,
  DollarSign,
  Shield,
  Headphones,
  BarChart3,
  UserCheck,
  FileText,
} from "lucide-react";
import { signOut } from "@/lib/actions";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import {
  PortalSidebarBrand,
  PortalSidebarFooter,
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
      { href: "/admin/partners", label: "Partners", icon: Users },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/kyc", label: "KYC Review", icon: UserCheck },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/orders", label: "Orders", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tags },
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
        <PortalSidebarLogout onLogout={handleLogout} collapsed={collapsed} />
      </PortalSidebarFooter>
    </PortalSidebarShell>
  );
}
