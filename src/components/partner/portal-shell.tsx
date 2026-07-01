"use client";

import { PartnerSidebar } from "@/components/partner/sidebar";
import { PartnerHeader } from "@/components/partner/partner-header";
import { MobileNavProvider, useMobileNav } from "@/components/shared/mobile-nav-context";
import { MobileNavRouteCloser } from "@/components/shared/mobile-nav-route-closer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Profile, AccountManager } from "@/types/database";
import type { ReactNode } from "react";

function PartnerMobileDrawer({ profile }: { profile: Profile }) {
  const { open, setOpen } = useMobileNav();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        showCloseButton
        className="partner-sidebar w-[min(100vw,260px)] max-w-[260px] border-0 bg-black p-0 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]]:hover:bg-white/10"
      >
        <PartnerSidebar profile={profile} className="h-full w-full" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function PartnerPortalInner({
  profile,
  manager,
  children,
}: {
  profile: Profile;
  manager: AccountManager | null;
  children: ReactNode;
}) {
  return (
    <div className="partner-portal relative flex h-screen overflow-hidden font-sans text-foreground">
      <PartnerSidebar profile={profile} className="hidden h-screen shrink-0 md:flex" />
      <PartnerMobileDrawer profile={profile} />
      <MobileNavRouteCloser />
      <div className="portal-main relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <PartnerHeader profile={profile} manager={manager} />
        <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-3.5 md:px-4 md:py-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PartnerPortalShell({
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
      <PartnerPortalInner profile={profile} manager={manager}>
        {children}
      </PartnerPortalInner>
    </MobileNavProvider>
  );
}
