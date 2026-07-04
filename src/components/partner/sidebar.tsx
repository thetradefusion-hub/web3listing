"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Store,
  Package,
  Wallet,
  Headphones,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import {
  PortalSidebarBrand,
  PortalSidebarNav,
  PortalSidebarNavItem,
  PortalSidebarSection,
  PortalSidebarShell,
} from "@/components/shared/portal-sidebar-ui";

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/partner", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Workspace",
    items: [
      { href: "/partner/projects", label: "My Projects", icon: FolderKanban },
      { href: "/partner/services", label: "Marketplace", icon: Store },
      { href: "/partner/orders", label: "My Orders", icon: Package },
    ],
  },
  {
    label: "Earnings",
    items: [{ href: "/partner/wallet", label: "Wallet", icon: Wallet }],
  },
  {
    label: "Account",
    items: [
      { href: "/partner/kyc", label: "KYC", icon: ShieldCheck },
      { href: "/partner/profile", label: "Profile", icon: UserCog },
      { href: "/partner/support", label: "Support", icon: Headphones },
    ],
  },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || (href !== "/partner" && pathname.startsWith(href));
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

export function PartnerSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { collapsed: shellCollapsed } = usePortalShell();
  const collapsed = onNavigate ? false : shellCollapsed;

  return (
    <PortalSidebarShell
      className={className}
      collapsed={collapsed}
      collapsible={!onNavigate}
      variant="partner"
    >
      <PortalSidebarBrand
        href="/partner"
        badge="Partner Portal"
        collapsed={collapsed}
        variant="partner"
      />

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
    </PortalSidebarShell>
  );
}
