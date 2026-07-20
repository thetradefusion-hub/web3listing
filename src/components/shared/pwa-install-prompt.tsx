"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PERF_COOKIES } from "@/lib/perf-cookies";

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 7;

function isReturningVisitor() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(`${PERF_COOKIES.returning}=1`);
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
}

function wasDismissedRecently() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function PwaInstallPrompt() {
  const [open, setOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosGuide, setIosGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (!isMobileDevice() || isStandaloneMode() || wasDismissedRecently()) return;

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIosGuide(false);
      setOpen(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIosSafari()) {
      const delay = isReturningVisitor() ? 8000 : 2500;
      iosTimer = setTimeout(() => {
        setIosGuide(true);
        setOpen(true);
      }, delay);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  }

  async function handleInstall() {
    if (!installEvent) return;
    setInstalling(true);
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") {
        setOpen(false);
      } else {
        dismiss();
      }
    } finally {
      setInstalling(false);
      setInstallEvent(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "animate-in slide-in-from-bottom-4 duration-300"
      )}
      role="region"
      aria-label="Install app"
    >
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-2xl shadow-primary/10 ring-1 ring-border/60">
        <div className="flex items-start gap-3 p-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <Image src="/pwa/icon-192.png" alt="" width={48} height={48} className="size-10 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-foreground">Install Web3Listing App</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {iosGuide
                    ? "Add this app to your home screen for faster access to orders, KYC, and marketplace."
                    : "Install on your phone for quick access to projects, services, and orders."}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-lg text-muted-foreground"
                onClick={dismiss}
                aria-label="Dismiss install prompt"
              >
                <X />
              </Button>
            </div>

            {iosGuide ? (
              <div className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Share className="size-3.5 text-primary" />
                  Tap Share, then &quot;Add to Home Screen&quot;
                </p>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              {!iosGuide ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 rounded-xl px-4 text-xs font-semibold"
                  onClick={handleInstall}
                  disabled={!installEvent || installing}
                >
                  <Download data-icon="inline-start" />
                  {installing ? "Installing..." : "Install App"}
                </Button>
              ) : (
                <Button type="button" size="sm" className="h-9 rounded-xl px-4 text-xs font-semibold" onClick={dismiss}>
                  <Smartphone data-icon="inline-start" />
                  Got it
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" className="h-9 rounded-xl px-4 text-xs" onClick={dismiss}>
                Not now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
