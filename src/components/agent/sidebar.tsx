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
    items: [{ href: "/agent", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Workspace",
    items: [
      { href: "/agent/projects", label: "My Projects", icon: FolderKanban },
      { href: "/agent/services", label: "Service Marketplace", icon: Store },
      { href: "/agent/orders", label: "My Orders", icon: Package },
    ],
  },
  {
    label: "Earnings",
    items: [{ href: "/agent/wallet", label: "Wallet & Withdrawals", icon: Wallet }],
  },
  {
    label: "Account",
    items: [
      { href: "/agent/kyc", label: "KYC Verification", icon: ShieldCheck },
      { href: "/agent/profile", label: "Profile Settings", icon: UserCog },
      { href: "/agent/support", label: "Support & Contact", icon: Headphones },
    ],
  },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || (href !== "/agent" && pathname.startsWith(href));
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

export function AgentSidebar({
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
      <PortalSidebarBrand href="/agent" badge="Agent Portal" collapsed={collapsed} />

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
