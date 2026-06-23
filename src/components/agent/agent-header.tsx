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
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0]/80 bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MobileMenuButton className="shrink-0 md:hidden" />
          <SidebarToggleButton />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-[#0F172A] sm:text-base">
                {displayName}
              </p>
              {isVerified && (
                <Badge
                  variant="outline"
                  className="h-5 border-[#A7F3D0] bg-[#ECFDF5] px-2 text-[10px] text-[#059669]"
                >
                  Verified
                </Badge>
              )}
            </div>
            <p className="hidden text-xs text-[#94A3B8] sm:block">
              Agent workspace
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
          {manager && (
            <div className="hidden items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#635BFF] text-xs font-semibold text-white">
                {getInitials(manager.name)}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-[#0F172A]">{manager.name}</p>
                <p className="text-[11px] text-[#94A3B8]">{manager.telegram_id}</p>
              </div>
            </div>
          )}

          {manager?.telegram_link && (
            <a
              href={manager.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              <Send className="h-4 w-4" />
            </a>
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <NotificationBell userId={profile.id} variant="agent" />

          <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#635BFF] text-xs font-semibold text-white">
              {getInitials(displayName)}
            </div>
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-[#0F172A] sm:block">
              {displayName}
            </span>
          </div>

          <Link
            href="/agent/projects/new"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#635BFF] px-4 text-sm font-medium text-white transition hover:brightness-105"
            aria-label="Create New Project"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New Project</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
