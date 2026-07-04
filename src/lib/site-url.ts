import { headers } from "next/headers";

export function getSiteUrlFromEnv(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Prefer env in production; fall back to request host when env still points at localhost. */
export async function getServerSiteUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl;
  }

  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    if (host) {
      return `${proto}://${host}`;
    }
  } catch {
    // Outside a request context (e.g. build)
  }

  return getSiteUrlFromEnv();
}

export function authCallbackUrl(siteUrl: string, next = "/login") {
  const params = new URLSearchParams({ next });
  return `${siteUrl}/auth/callback?${params.toString()}`;
}
