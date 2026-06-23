"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMobileNav } from "@/components/shared/mobile-nav-context";

/** Closes the mobile drawer when the route changes. */
export function MobileNavRouteCloser() {
  const pathname = usePathname();
  const { setOpen } = useMobileNav();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return null;
}
