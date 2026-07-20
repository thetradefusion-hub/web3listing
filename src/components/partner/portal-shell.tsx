"use client";

import {
  FolderKanban,
  Headphones,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Store,
  UserCog,
  Wallet,
} from "lucide-react";
import { PartnerSidebar } from "@/components/partner/sidebar";
import { PartnerHeader } from "@/components/partner/partner-header";
import { PortalBottomNav } from "@/components/shared/portal-bottom-nav";
import { MobileNavProvider, useMobileNav } from "@/components/shared/mobile-nav-context";
import { MobileNavRouteCloser } from "@/components/shared/mobile-nav-route-closer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Profile, AccountManager } from "@/types/database";
import { Suspense, type ReactNode } from "react";

const partnerBottomItems = [
  { href: "/partner", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/partner/projects", label: "Projects", icon: FolderKanban },
  { href: "/partner/services", label: "Market", icon: Store },
  { href: "/partner/orders", label: "Orders", icon: Package },
];

const partnerMoreItems = [
  { href: "/partner/wallet", label: "Wallet", icon: Wallet },
  { href: "/partner/kyc", label: "KYC", icon: ShieldCheck },
  { href: "/partner/profile", label: "Profile", icon: UserCog },
  { href: "/partner/support", label: "Support", icon: Headphones },
];

function PartnerMobileDrawer() {
  const { open, setOpen } = useMobileNav();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        showCloseButton
        className="partner-sidebar w-[min(100vw,260px)] max-w-[260px] border-0 bg-black p-0 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]]:hover:bg-white/10"
      >
        <PartnerSidebar className="h-full w-full" onNavigate={() => setOpen(false)} />
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
    <div className="partner-portal relative flex h-dvh max-h-dvh overflow-hidden font-sans text-foreground">
      <PartnerSidebar className="hidden h-dvh shrink-0 md:flex" />
      <PartnerMobileDrawer />
      <MobileNavRouteCloser />
      <div className="portal-main relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <PartnerHeader profile={profile} manager={manager} />
        <main className="portal-main-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-4 sm:py-3.5 md:px-4 md:py-4">
          {children}
        </main>
        <Suspense fallback={null}>
          <PortalBottomNav items={partnerBottomItems} moreItems={partnerMoreItems} />
        </Suspense>
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
