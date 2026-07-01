"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Store,
  Package,
  Headphones,
  UserCog,
  CreditCard,
  LifeBuoy,
  ClipboardList,
} from "lucide-react";
import { signOut } from "@/lib/actions";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import { Button } from "@/components/ui/button";
import {
  PortalSidebarBrand,
  PortalSidebarFooter,
  PortalSidebarLogout,
  PortalSidebarNav,
  PortalSidebarNavItem,
  PortalSidebarSection,
  PortalSidebarShell,
} from "@/components/shared/portal-sidebar-ui";

const navItems: NavItem[] = [
  { href: "/user", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/user/projects", label: "My Projects", icon: FolderKanban },
  { href: "/user/orders", label: "My Orders", icon: Package },
  { href: "/user/services", label: "Services", icon: Store },
  { href: "/user/custom-requirements", label: "Custom Requirement", icon: ClipboardList },
  { href: "/user/orders?status=waiting_payment", label: "Payments", icon: CreditCard },
  { href: "/user/support", label: "Support Tickets", icon: Headphones },
  { href: "/user/profile", label: "Settings", icon: UserCog },
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
      <PortalSidebarBrand href="/user" badge="Client Panel" collapsed={collapsed} variant="partner" />

      <PortalSidebarNav collapsed={collapsed}>
        <PortalSidebarSection label="Menu" collapsed={collapsed}>
          {navItems.map((item) => (
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
      </PortalSidebarNav>

      {!collapsed ? (
        <div className="mx-3 mb-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-chart-4/10 p-4">
          <div className="flex items-start gap-2">
            <LifeBuoy className="mt-0.5 size-4 shrink-0 text-primary-foreground/80" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Need Help?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Our team is here to assist you with orders and projects.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-3 h-8 w-full rounded-lg bg-primary text-xs font-semibold shadow-sm"
                onClick={onNavigate}
              >
                <Link href="/user/support">Create Ticket</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <PortalSidebarFooter collapsed={collapsed}>
        <PortalSidebarLogout onLogout={handleLogout} collapsed={collapsed} />
      </PortalSidebarFooter>
    </PortalSidebarShell>
  );
}
