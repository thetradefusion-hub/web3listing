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
  Plus,
} from "lucide-react";
import { signOut } from "@/lib/actions";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import { PartnerBadge, kycStatusVariant } from "@/components/partner/ui";
import {
  PortalSidebarBrand,
  PortalSidebarFooter,
  PortalSidebarLogout,
  PortalSidebarNav,
  PortalSidebarNavItem,
  PortalSidebarQuickAction,
  PortalSidebarSection,
  PortalSidebarShell,
  PortalSidebarUserCard,
} from "@/components/shared/portal-sidebar-ui";
import type { Profile } from "@/types/database";

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

function kycLabel(status: Profile["kyc_status"]) {
  if (status === "approved") return "Verified";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export function PartnerSidebar({
  profile,
  className,
  onNavigate,
}: {
  profile?: Profile;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { collapsed: shellCollapsed } = usePortalShell();
  const collapsed = onNavigate ? false : shellCollapsed;

  const displayName = profile?.company_name || profile?.full_name || profile?.email || "Partner";
  const initials = (profile?.full_name || profile?.email || "P")
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

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

      <PortalSidebarFooter collapsed={collapsed}>
        {profile ? (
          <PortalSidebarUserCard
            name={displayName}
            subtitle={profile.email}
            initials={initials}
            collapsed={collapsed}
            badge={
              <PartnerBadge variant={kycStatusVariant(profile.kyc_status)}>
                {kycLabel(profile.kyc_status)}
              </PartnerBadge>
            }
          />
        ) : null}

        <PortalSidebarQuickAction
          href="/partner/projects/new"
          label="New Project"
          icon={Plus}
          onClick={onNavigate}
          collapsed={collapsed}
        />

        <PortalSidebarLogout onLogout={handleLogout} collapsed={collapsed} />
      </PortalSidebarFooter>
    </PortalSidebarShell>
  );
}
