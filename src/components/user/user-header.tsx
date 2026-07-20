"use client";

import Link from "next/link";
import { HelpCircle, LayoutDashboard, Plus, Send } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { MobileMenuButton } from "@/components/shared/mobile-menu-button";
import { SidebarToggleButton } from "@/components/shared/sidebar-toggle-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PortalProfileMenu } from "@/components/shared/portal-profile-menu";
import { PartnerBadge, kycStatusVariant } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { buildTelegramLink } from "@/lib/telegram";
import type { Profile, AccountManager } from "@/types/database";

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

export function UserHeader({
  profile,
  manager,
}: {
  profile: Profile;
  manager: AccountManager | null;
}) {
  const displayName = profile.company_name || profile.full_name || profile.email.split("@")[0];
  const isVerified = profile.kyc_status === "approved";

  return (
    <header className="portal-app-header sticky top-0 z-20 border-b border-border/70 bg-card/90 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-12 items-center justify-between gap-2 px-3 sm:h-14 sm:gap-3 sm:px-4 lg:px-5">
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
                <p className="truncate text-sm font-bold tracking-tight text-foreground sm:text-[15px]">
                  {displayName}
                </p>
                <span className="hidden shrink-0 sm:inline-flex">
                  <PartnerBadge variant={kycStatusVariant(profile.kyc_status)}>
                    {kycLabel(profile.kyc_status)}
                  </PartnerBadge>
                </span>
              </div>
              <p className="hidden truncate text-[11px] text-muted-foreground sm:block sm:text-xs">
                {isVerified ? "Client workspace" : "Complete KYC to unlock full access"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border border-border/80 bg-muted/25 p-0.5 sm:gap-1 sm:p-1">
            {manager?.telegram_link ? (
              <HeaderToolButton
                href={buildTelegramLink(manager.telegram_link)}
                label="Message on Telegram"
                className="hidden sm:flex"
              >
                <Send className="size-4" strokeWidth={2} />
              </HeaderToolButton>
            ) : null}

            <HeaderToolButton href="/user/support" label="Help & support" className="hidden sm:flex">
              <HelpCircle className="size-4" strokeWidth={2} />
            </HeaderToolButton>

            <ThemeToggle
              variant="ghost"
              className="size-9 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
            />

            <NotificationBell userId={profile.id} variant="partner" />
          </div>

          <PortalProfileMenu
            profile={profile}
            profileHref="/user/profile"
            displayName={displayName}
            className="hidden sm:flex"
          />

          <PortalProfileMenu
            profile={profile}
            profileHref="/user/profile"
            displayName={displayName}
            showName={false}
            className="sm:hidden"
          />

          <Button
            asChild
            size="sm"
            className="hidden h-9 rounded-xl px-3 font-semibold shadow-sm shadow-primary/15 sm:inline-flex sm:px-3.5"
          >
            <Link href="/user/services" aria-label="Place new order">
              <Plus data-icon="inline-start" />
              <span className="hidden sm:inline">New Order</span>
            </Link>
          </Button>

          <Button
            asChild
            size="icon"
            className="size-9 rounded-xl shadow-sm shadow-primary/15 sm:hidden"
          >
            <Link href="/user/services" aria-label="Place new order">
              <Plus className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
