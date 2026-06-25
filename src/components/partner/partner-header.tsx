"use client";

import Link from "next/link";
import { HelpCircle, Plus, Send, Sparkles } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileMenuButton } from "@/components/shared/mobile-menu-button";
import { SidebarToggleButton } from "@/components/shared/sidebar-toggle-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PartnerBadge, kycStatusVariant } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Profile, AccountManager } from "@/types/database";

function getInitials(name: string) {
  return name
    .split(/[\s@]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function kycLabel(status: Profile["kyc_status"]) {
  if (status === "approved") return "Verified";
  if (status === "pending") return "KYC Pending";
  return "KYC Required";
}

function HeaderToolButton({
  children,
  className,
  href,
  onClick,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  label: string;
}) {
  const classes = cn(
    "flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
    className
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={label}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={label}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {children}
    </button>
  );
}

export function PartnerHeader({
  profile,
  manager,
}: {
  profile: Profile;
  manager: AccountManager | null;
}) {
  const displayName = profile.company_name || profile.full_name || profile.email.split("@")[0];
  const isVerified = profile.kyc_status === "approved";

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-card/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/75">
      <div className="flex h-[3.75rem] items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
        {/* Left — workspace */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <MobileMenuButton className="size-9 shrink-0 rounded-xl border border-border md:hidden" />
          <SidebarToggleButton />

          <Separator orientation="vertical" className="hidden h-7 md:block" />

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <Sparkles className="size-4" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-sm font-bold tracking-tight text-foreground sm:text-[15px]">
                  {displayName}
                </p>
                <span className="hidden shrink-0 sm:inline-flex">
                  <PartnerBadge variant={kycStatusVariant(profile.kyc_status)}>
                    {kycLabel(profile.kyc_status)}
                  </PartnerBadge>
                </span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {isVerified ? "Partner workspace" : "Complete KYC to unlock full access"}
              </p>
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border border-border/80 bg-muted/25 p-0.5 sm:gap-1 sm:p-1">
            {manager?.telegram_link ? (
              <HeaderToolButton href={manager.telegram_link} label="Message on Telegram">
                <Send className="size-4" strokeWidth={2} />
              </HeaderToolButton>
            ) : null}

            <HeaderToolButton href="/partner/support" label="Help & support">
              <HelpCircle className="size-4" strokeWidth={2} />
            </HeaderToolButton>

            <ThemeToggle
              variant="ghost"
              className="size-9 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
            />

            <NotificationBell userId={profile.id} variant="partner" />
          </div>

          <Link
            href="/partner/profile"
            className="hidden items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 transition-colors hover:border-primary/25 hover:bg-muted/30 sm:flex"
          >
            <Avatar className="size-8 ring-2 ring-border/60">
              {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
              <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[88px] truncate text-sm font-semibold text-foreground lg:max-w-[120px]">
              {displayName}
            </span>
          </Link>

          <Button asChild size="sm" className="h-9 rounded-xl px-3 font-semibold shadow-sm shadow-primary/15 sm:px-3.5">
            <Link href="/partner/projects/new" aria-label="Create new project">
              <Plus data-icon="inline-start" />
              <span className="hidden sm:inline">New Project</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
