"use client";

import { UserSidebar } from "@/components/user/sidebar";
import { UserHeader } from "@/components/user/user-header";
import { MobileNavProvider, useMobileNav } from "@/components/shared/mobile-nav-context";
import { MobileNavRouteCloser } from "@/components/shared/mobile-nav-route-closer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Profile, AccountManager } from "@/types/database";
import type { ReactNode } from "react";

function UserMobileDrawer() {
  const { open, setOpen } = useMobileNav();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        showCloseButton
        className="user-sidebar w-[min(100vw,260px)] max-w-[260px] border-0 bg-[#0B1020] p-0 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]]:hover:bg-white/10"
      >
        <UserSidebar className="h-full w-full" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function UserPortalInner({
  profile,
  manager,
  children,
}: {
  profile: Profile;
  manager: AccountManager | null;
  children: ReactNode;
}) {
  return (
    <div className="user-portal relative flex h-screen overflow-hidden font-sans text-foreground">
      <UserSidebar className="hidden h-screen shrink-0 md:flex" />
      <UserMobileDrawer />
      <MobileNavRouteCloser />
      <div className="portal-main relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <UserHeader profile={profile} />
        <main className="client-dashboard-canvas min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function UserPortalShell({
  profile,
  manager,
  children,
}: {
  profile: Profile;
  manager: AccountManager | null;
  children: ReactNode;
}) {
  return (
    <MobileNavProvider>
      <UserPortalInner profile={profile} manager={manager}>
        {children}
      </UserPortalInner>
    </MobileNavProvider>
  );
}
