"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Store,
  Package,
  Headphones,
  ShieldCheck,
  UserCog,
  CreditCard,
  ClipboardList,
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
    items: [{ href: "/user", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Workspace",
    items: [
      { href: "/user/projects", label: "My Projects", icon: FolderKanban },
      { href: "/user/services", label: "Marketplace", icon: Store },
      { href: "/user/orders", label: "My Orders", icon: Package },
      { href: "/user/custom-requirements", label: "Custom Requirements", icon: ClipboardList },
      { href: "/user/orders?status=waiting_payment", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/user/kyc", label: "KYC", icon: ShieldCheck },
      { href: "/user/profile", label: "Profile", icon: UserCog },
      { href: "/user/support", label: "Support", icon: Headphones },
    ],
  },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  const base = href.split("?")[0];
  return pathname === base || (base !== "/user" && pathname.startsWith(base));
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

export function UserSidebar({
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
      <PortalSidebarBrand href="/user" badge="Client Portal" collapsed={collapsed} variant="partner" />

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
