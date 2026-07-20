"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SPLASH_KEY = "pwa-splash-seen-session";
const SPLASH_MS = 1800;
const PWA_ENTRY = "/login";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function shouldShowSplash() {
  if (typeof window === "undefined") return false;
  if (!isStandaloneMode()) return false;
  return sessionStorage.getItem(SPLASH_KEY) !== "1";
}

function hideBootSplash() {
  const boot = document.getElementById("pwa-boot-splash");
  if (boot) boot.hidden = true;
}

/** Full-screen branded splash when the installed PWA launches, then open login. */
export function PwaSplashScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    if (!shouldShowSplash()) {
      hideBootSplash();
      return;
    }
    setVisible(true);
    hideBootSplash();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const exitTimer = window.setTimeout(() => setExiting(true), SPLASH_MS);
    const doneTimer = window.setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setVisible(false);
      router.replace(PWA_ENTRY);
    }, SPLASH_MS + 420);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [router, visible]);

  useEffect(() => {
    if (!isStandaloneMode()) return;
    if (pathname !== "/") return;
    if (visible) return;
    router.replace(PWA_ENTRY);
  }, [pathname, router, visible]);

  if (!visible) return null;

  return (
    <div
      className={cn("pwa-splash", exiting && "pwa-splash--exit")}
      aria-hidden
      suppressHydrationWarning
    >
      <div className="pwa-splash__bg" />
      <div className="pwa-splash__grid" aria-hidden />
      <div className="pwa-splash__glow pwa-splash__glow--purple" aria-hidden />
      <div className="pwa-splash__glow pwa-splash__glow--lime" aria-hidden />

      <div className="pwa-splash__content">
        <div className="pwa-splash__logo-stack">
          <span className="pwa-splash__ring pwa-splash__ring--outer" aria-hidden />
          <span className="pwa-splash__ring pwa-splash__ring--inner" aria-hidden />
          <div className="pwa-splash__logo-wrap">
            <Image
              src="/web3_exact_colors.svg"
              alt=""
              width={96}
              height={64}
              priority
              className="pwa-splash__logo"
            />
          </div>
        </div>

        <p className="pwa-splash__brand">Web3Listing</p>
        <p className="pwa-splash__tagline">List · Market · Grow</p>

        <div className="pwa-splash__progress" aria-hidden>
          <span className="pwa-splash__progress-bar" />
        </div>
      </div>
    </div>
  );
}
