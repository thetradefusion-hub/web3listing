"use client";

import { useEffect } from "react";
import { DeferredPwaExtras } from "@/components/shared/deferred-ui";
import { PwaSplashScreen } from "@/components/shared/pwa-splash-screen";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
    // Service worker registration can fail in unsupported contexts.
  });
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let idleCallbackId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : null;

    if (schedule) {
      idleCallbackId = schedule(registerServiceWorker, { timeout: 4000 });
    } else {
      timeoutId = setTimeout(registerServiceWorker, 2000);
    }

    return () => {
      if (idleCallbackId != null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      <PwaSplashScreen />
      {children}
      <DeferredPwaExtras />
    </>
  );
}
