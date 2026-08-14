"use client";

import {
  ClipboardList,
  CreditCard,
  FolderKanban,
  Headphones,
  LayoutDashboard,
  Package,
  Store,
  UserCog,
} from "lucide-react";
import { UserSidebar } from "@/components/user/sidebar";
import { UserHeader } from "@/components/user/user-header";
import { PortalBottomNav } from "@/components/shared/portal-bottom-nav";
import { MobileNavProvider, useMobileNav } from "@/components/shared/mobile-nav-context";
import { MobileNavRouteCloser } from "@/components/shared/mobile-nav-route-closer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Profile, AccountManager } from "@/types/database";
import { Suspense, type ReactNode } from "react";

const userBottomItems = [
  { href: "/user", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/user/projects", label: "Projects", icon: FolderKanban },
  { href: "/user/services", label: "Market", icon: Store },
  { href: "/user/orders", label: "Orders", icon: Package },
];

const userMoreItems = [
  { href: "/user/custom-requirements", label: "Custom Requirements", icon: ClipboardList },
  { href: "/user/orders?status=waiting_payment", label: "Payments", icon: CreditCard, exact: true },
  { href: "/user/profile", label: "Profile", icon: UserCog },
  { href: "/user/support", label: "Support", icon: Headphones },
];

function UserMobileDrawer() {
  const { open, setOpen } = useMobileNav();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        showCloseButton
        className="partner-sidebar w-[min(100vw,260px)] max-w-[260px] border-0 bg-black p-0 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]]:hover:bg-white/10"
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
    <div className="partner-portal relative flex h-dvh max-h-dvh overflow-hidden font-sans text-foreground">
      <UserSidebar className="hidden h-dvh shrink-0 md:flex" />
      <UserMobileDrawer />
      <MobileNavRouteCloser />
      <div className="portal-main relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <UserHeader profile={profile} manager={manager} />
        <main className="portal-main-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-4 sm:py-3.5 md:px-4 md:py-4">
          {children}
        </main>
        <Suspense fallback={null}>
          <PortalBottomNav items={userBottomItems} moreItems={userMoreItems} />
        </Suspense>
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
