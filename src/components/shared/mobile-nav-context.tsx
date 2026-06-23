"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "portal-sidebar-collapsed";

type PortalShellContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
};

const PortalShellContext = createContext<PortalShellContextValue | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") {
        setCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function persistCollapsed(value: boolean | ((prev: boolean) => boolean)) {
    setCollapsed((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <PortalShellContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        toggleMobile: () => setMobileOpen((v) => !v),
        collapsed,
        setCollapsed: (value) => persistCollapsed(value),
        toggleCollapsed: () => persistCollapsed((prev) => !prev),
      }}
    >
      {children}
    </PortalShellContext.Provider>
  );
}

export function usePortalShell() {
  const ctx = useContext(PortalShellContext);
  if (!ctx) {
    throw new Error("usePortalShell must be used within MobileNavProvider");
  }
  return ctx;
}

export function useMobileNav() {
  const { mobileOpen, setMobileOpen, toggleMobile } = usePortalShell();
  return {
    open: mobileOpen,
    setOpen: setMobileOpen,
    toggle: toggleMobile,
  };
}
