"use client";

import { useEffect } from "react";
import { PwaInstallPrompt } from "@/components/shared/pwa-install-prompt";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
    // Service worker registration can fail in unsupported contexts.
  });
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(registerServiceWorker, { timeout: 4000 })
        : window.setTimeout(registerServiceWorker, 2000);

    return () => {
      if ("cancelIdleCallback" in window && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, []);

  return (
    <>
      {children}
      <PwaInstallPrompt />
    </>
  );
}
