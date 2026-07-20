"use client";

import { PwaInstallPrompt } from "@/components/shared/pwa-install-prompt";
import { PwaSplashScreen } from "@/components/shared/pwa-splash-screen";

export default function PwaDeferredExtras() {
  return (
    <>
      <PwaSplashScreen />
      <PwaInstallPrompt />
    </>
  );
}
