"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { signOut } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
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

export function PortalProfileMenu({
  profile,
  profileHref,
  displayName: displayNameProp,
  className,
  showName = true,
  avatarClassName,
}: {
  profile: Profile;
  profileHref: string;
  displayName?: string;
  className?: string;
  showName?: boolean;
  avatarClassName?: string;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const displayName =
    displayNameProp || profile.company_name || profile.full_name || profile.email.split("@")[0];

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    window.location.href = "/login";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex items-center gap-2 rounded-xl border border-border/80 bg-card/80 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          showName ? "px-2 py-1.5" : "p-1.5",
          className
        )}
        aria-label="Open account menu"
      >
        <Avatar className={cn("size-8 ring-2 ring-border/50 transition group-hover:ring-primary/25", avatarClassName)}>
          {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
          <AvatarFallback className="bg-gradient-to-br from-primary to-chart-4 text-[11px] font-bold text-primary-foreground">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        {showName ? (
          <>
            <span className="hidden max-w-[88px] truncate text-sm font-semibold text-foreground sm:inline lg:max-w-[120px]">
              {displayName}
            </span>
            <ChevronDown className="hidden size-3.5 shrink-0 text-muted-foreground transition group-hover:text-foreground sm:block" />
          </>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[17.5rem] overflow-hidden rounded-2xl border border-border/80 p-0 shadow-xl shadow-black/10"
      >
        <div className="relative px-4 py-4">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-4/10"
            aria-hidden
          />
          <div className="relative flex items-center gap-3">
            <Avatar className="size-11 shadow-md ring-2 ring-primary/15">
              {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
              <AvatarFallback className="bg-gradient-to-br from-primary to-chart-4 text-sm font-bold text-primary-foreground">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold tracking-tight text-foreground">{displayName}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="space-y-0.5 p-1.5">
          <DropdownMenuItem
            className="cursor-pointer gap-3 rounded-xl px-2.5 py-2.5"
            onClick={() => router.push(profileHref)}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound className="size-4" strokeWidth={2.25} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">View profile</span>
              <span className="text-[11px] text-muted-foreground">Account & settings</span>
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-3 rounded-xl px-2.5 py-2.5"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <LogOut className="size-4" strokeWidth={2.25} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{loggingOut ? "Signing out..." : "Sign out"}</span>
              <span className="text-[11px] text-destructive/70">End your session</span>
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
