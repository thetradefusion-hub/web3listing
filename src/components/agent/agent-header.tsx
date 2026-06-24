"use client";

import Link from "next/link";
import { Plus, HelpCircle, Send } from "lucide-react";

import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileMenuButton } from "@/components/shared/mobile-menu-button";
import { SidebarToggleButton } from "@/components/shared/sidebar-toggle-button";
import { Badge } from "@/components/ui/badge";
import type { Profile, AccountManager } from "@/types/database";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AgentHeader({
  profile,
  manager,
}: {
  profile: Profile;
  manager: AccountManager | null;
}) {
  const displayName = profile.company_name || profile.full_name || profile.email;
  const isVerified = profile.kyc_status === "approved";

  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0]/80 bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-5 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <MobileMenuButton className="shrink-0 md:hidden" />
          <SidebarToggleButton />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-[#0F172A]">
                {displayName}
              </p>
              {isVerified && (
                <Badge
                  variant="outline"
                  className="h-5 border-[#A7F3D0] bg-[#ECFDF5] px-1.5 text-[10px] text-[#059669]"
                >
                  Verified
                </Badge>
              )}
            </div>
            <p className="hidden text-[11px] text-[#94A3B8] xl:block">
              Agent workspace
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:gap-2">
          {manager && (
            <div className="hidden items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1.5 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-semibold text-white">
                {getInitials(manager.name)}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-medium text-[#0F172A]">{manager.name}</p>
                <p className="text-[10px] text-[#94A3B8]">{manager.telegram_id}</p>
              </div>
            </div>
          )}

          {manager?.telegram_link && (
            <a
              href={manager.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              <Send className="h-3.5 w-3.5" />
            </a>
          )}

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>

          <NotificationBell userId={profile.id} variant="agent" />

          <div className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-semibold text-white">
              {getInitials(displayName)}
            </div>
            <span className="hidden max-w-[100px] truncate text-xs font-medium text-[#0F172A] sm:block">
              {displayName}
            </span>
          </div>

          <Link
            href="/agent/projects/new"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#635BFF] px-3 text-xs font-medium text-white transition hover:brightness-105 sm:h-9 sm:px-3.5 sm:text-sm"
            aria-label="Create New Project"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
