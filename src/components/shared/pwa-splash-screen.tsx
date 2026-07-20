"use client";

import { useEffect, useState } from "react";
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

/** Full-screen branded splash when the installed PWA launches, then open login. */
export function PwaSplashScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Show splash once per PWA session, then go to login.
  useEffect(() => {
    if (!isStandaloneMode()) return;
    if (sessionStorage.getItem(SPLASH_KEY) === "1") return;

    setVisible(true);

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
  }, [router]);

  // Existing installs / home deep-links: never keep the landing page in the PWA.
  useEffect(() => {
    if (!isStandaloneMode()) return;
    if (pathname !== "/") return;
    if (visible) return;
    router.replace(PWA_ENTRY);
  }, [pathname, router, visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-[#0B0618] transition-opacity duration-300",
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-hidden
    >
      <Image
        src="/pwa/splash.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
