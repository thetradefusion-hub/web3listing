"use client";

import dynamic from "next/dynamic";

/** Defer non-critical UI until after first paint — smaller initial JS bundle. */
export const DeferredRouteLoader = dynamic(
  () => import("@/components/shared/route-loader").then((m) => ({ default: m.RouteLoader })),
  { ssr: false }
);

export const DeferredToaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);

export const DeferredPwaExtras = dynamic(
  () => import("@/components/shared/pwa-deferred-extras"),
  { ssr: false }
);
