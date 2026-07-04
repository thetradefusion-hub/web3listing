"use client";

import { LayoutDashboard } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileMenuButton } from "@/components/shared/mobile-menu-button";
import { SidebarToggleButton } from "@/components/shared/sidebar-toggle-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PortalProfileMenu } from "@/components/shared/portal-profile-menu";
import { AdminBadge } from "@/components/admin/ui";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types/database";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  operations_manager: "Operations",
  service_team: "Service Team",
};

function roleBadgeVariant(role: string): "info" | "success" | "warning" {
  if (role === "super_admin") return "success";
  if (role === "operations_manager") return "info";
  return "warning";
}

export function AdminHeader({ profile }: { profile: Profile }) {
  const displayName = profile.full_name || profile.email.split("@")[0];
  const roleLabel = roleLabels[profile.role] || profile.role.replace(/_/g, " ");

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-card/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/75">
      <div className="flex h-[3.75rem] items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <MobileMenuButton className="size-9 shrink-0 rounded-xl border border-border md:hidden" />
          <SidebarToggleButton />

          <Separator orientation="vertical" className="hidden h-7 md:block" />

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <LayoutDashboard className="size-4" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-bold tracking-tight text-foreground sm:text-[15px]">
                  Admin Console
                </h1>
                <span className="hidden shrink-0 sm:inline-flex">
                  <AdminBadge variant={roleBadgeVariant(profile.role)}>{roleLabel}</AdminBadge>
                </span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {displayName} · System management
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border border-border/80 bg-muted/25 p-0.5 sm:gap-1 sm:p-1">
            <ThemeToggle
              variant="ghost"
              className="size-9 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
            />
            <NotificationBell userId={profile.id} variant="partner" />
          </div>

          <PortalProfileMenu
            profile={profile}
            profileHref="/admin"
            displayName={displayName}
            className="hidden sm:flex"
          />

          <PortalProfileMenu
            profile={profile}
            profileHref="/admin"
            displayName={displayName}
            showName={false}
            className="sm:hidden"
          />
        </div>
      </div>
    </header>
  );
}
