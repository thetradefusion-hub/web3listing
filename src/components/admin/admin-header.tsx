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
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <MobileMenuButton className="mt-0.5 shrink-0 md:hidden" />
          <SidebarToggleButton className="mt-0.5" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-[#0F172A] sm:text-xl">Admin Dashboard</h1>
              <Badge
                variant="outline"
                className="h-6 border-[#C7D2FE] bg-[#EEF2FF] text-[#635BFF]"
              >
                {roleLabel}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-[#64748B]">
              Welcome back, {displayName} — here is your system overview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell userId={profile.id} variant="agent" />

          <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#635BFF] text-xs font-semibold text-white">
              {getInitials(displayName)}
            </div>
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-[#0F172A] sm:block">
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
