"use client";

import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileMenuButton } from "@/components/shared/mobile-menu-button";
import { SidebarToggleButton } from "@/components/shared/sidebar-toggle-button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/database";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  operations_manager: "Operations Manager",
};

export function AdminHeader({ profile }: { profile: Profile }) {
  const displayName = profile.full_name || profile.email;
  const roleLabel = roleLabels[profile.role] || profile.role.replace(/_/g, " ");

  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/80 px-4 py-2.5 backdrop-blur-md sm:px-5 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <MobileMenuButton className="shrink-0 md:hidden" />
          <SidebarToggleButton />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-semibold text-[#0F172A] lg:text-lg">Admin Dashboard</h1>
              <Badge
                variant="outline"
                className="h-5 border-[#C7D2FE] bg-[#EEF2FF] px-1.5 text-[10px] text-[#635BFF]"
              >
                {roleLabel}
              </Badge>
            </div>
            <p className="mt-0.5 hidden text-xs text-[#64748B] xl:block">
              Welcome back, {displayName} — here is your system overview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell userId={profile.id} variant="agent" />

          <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-semibold text-white">
              {getInitials(displayName)}
            </div>
            <span className="hidden max-w-[120px] truncate text-xs font-medium text-[#0F172A] sm:block">
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
