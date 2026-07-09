"use client";

import { useEffect } from "react";
import { PwaInstallPrompt } from "@/components/shared/pwa-install-prompt";

export function PwaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Service worker registration can fail in unsupported contexts.
    });
  }, []);

  return (
    <>
      {children}
      <PwaInstallPrompt />
    </>
  );
}
