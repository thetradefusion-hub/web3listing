"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileMenuButton } from "@/components/shared/mobile-menu-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PartnerBadge, kycStatusVariant } from "@/components/partner/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types/database";

function getInitials(name: string) {
  return name
    .split(/[\s@]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function clientBadgeLabel(status: Profile["kyc_status"]) {
  if (status === "approved") return "Verified Client";
  if (status === "pending") return "KYC Pending";
  return "Client";
}

export function UserHeader({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const displayName = profile.company_name || profile.full_name || profile.email.split("@")[0];

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/user/services?q=${encodeURIComponent(q)}` : "/user/services");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-card/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/75">
      <div className="flex h-[4.25rem] items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6">
        <MobileMenuButton className="size-10 shrink-0 rounded-xl border border-border md:hidden" />

        <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 md:block">
          <div className="relative mx-auto max-w-xl lg:max-w-2xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for services, orders, invoices..."
              className="h-11 rounded-xl border-border bg-muted/40 pl-10 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </div>
        </form>

        <form onSubmit={handleSearch} className="min-w-0 flex-1 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-10 rounded-xl border-border bg-muted/40 pl-9 text-sm"
            />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border border-border/80 bg-muted/25 p-0.5 sm:gap-1 sm:p-1">
            <ThemeToggle
              variant="ghost"
              className="size-9 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
            />
            <div className="flex size-9 items-center justify-center">
              <NotificationBell userId={profile.id} variant="partner" />
            </div>
          </div>

          <Link
            href="/user/profile"
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3 transition hover:border-primary/25 hover:bg-muted/30"
          >
            <Avatar className="size-9 ring-2 ring-border/60">
              {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
              <AvatarFallback className="bg-gradient-to-br from-primary to-chart-4 text-xs font-bold text-primary-foreground">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[120px] truncate text-sm font-semibold text-foreground lg:max-w-[140px]">
                {displayName}
              </p>
              <PartnerBadge variant={kycStatusVariant(profile.kyc_status)}>
                {clientBadgeLabel(profile.kyc_status)}
              </PartnerBadge>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
