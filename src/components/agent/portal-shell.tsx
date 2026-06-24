"use client";

import { AgentSidebar } from "@/components/agent/sidebar";
import { AgentHeader } from "@/components/agent/agent-header";
import { MobileNavProvider, useMobileNav } from "@/components/shared/mobile-nav-context";
import { MobileNavRouteCloser } from "@/components/shared/mobile-nav-route-closer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Profile, AccountManager } from "@/types/database";
import type { ReactNode } from "react";

function AgentMobileDrawer() {
  const { open, setOpen } = useMobileNav();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        showCloseButton
        className="w-[min(100vw,260px)] max-w-[260px] border-0 bg-[#0B1020] p-0 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]]:hover:bg-white/10"
      >
        <AgentSidebar className="h-full w-full" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function AgentPortalInner({
  profile,
  manager,
  children,
}: {
  profile: Profile;
  manager: AccountManager | null;
  children: ReactNode;
}) {
  return (
    <div className="agent-portal relative flex h-screen overflow-hidden font-sans text-[#0F172A]">
      <AgentSidebar className="hidden h-screen shrink-0 md:flex" />
      <AgentMobileDrawer />
      <MobileNavRouteCloser />
      <div className="portal-main relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AgentHeader profile={profile} manager={manager} />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AgentPortalShell({
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
      <AgentPortalInner profile={profile} manager={manager}>
        {children}
      </AgentPortalInner>
    </MobileNavProvider>
  );
}
