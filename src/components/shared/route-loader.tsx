"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppPageLoader } from "@/components/shared/app-page-loader";

/** Wait before showing loader — fast pages never flash a spinner. */
export const ROUTE_LOADER_SHOW_DELAY_MS = 180;
/** Once visible, keep loader at least this long so it does not flicker. */
export const ROUTE_LOADER_MIN_VISIBLE_MS = 400;
export const NAVIGATION_START_EVENT = "app:navigation-start";

const SHOW_DELAY_MS = ROUTE_LOADER_SHOW_DELAY_MS;
const MIN_VISIBLE_MS = ROUTE_LOADER_MIN_VISIBLE_MS;

export function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const [visible, setVisible] = useState(false);

  const navigatingRef = useRef(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = useRef<number | null>(null);

  function startNavigation() {
    navigatingRef.current = true;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (showTimerRef.current) clearTimeout(showTimerRef.current);

    showTimerRef.current = setTimeout(() => {
      if (!navigatingRef.current) return;
      shownAtRef.current = Date.now();
      setVisible(true);
    }, SHOW_DELAY_MS);
  }

  function finishNavigation() {
    if (!navigatingRef.current) return;
    navigatingRef.current = false;

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    const complete = () => {
      setVisible(false);
      shownAtRef.current = null;
    };

    if (shownAtRef.current) {
      const elapsed = Date.now() - shownAtRef.current;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      hideTimerRef.current = setTimeout(complete, wait);
      return;
    }

    complete();
  }

  useEffect(() => {
    finishNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const nextRoute = `${url.pathname}${url.search}`;
      const currentRoute = `${window.location.pathname}${window.location.search}`;
      if (nextRoute === currentRoute) return;

      startNavigation();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, startNavigation);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, startNavigation);
    };
  }, []);

  useEffect(
    () => () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    []
  );

  if (!visible) return null;

  return <AppPageLoader variant="overlay" label="Loading page" />;
}
