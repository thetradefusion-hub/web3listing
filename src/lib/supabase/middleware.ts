import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPortalPathForRole, pathRequiresKyc } from "@/lib/portal-config";
import {
  CATALOG_CACHE_VERSION,
  catalogVersionCookieName,
  PERF_COOKIE_MAX_AGE,
  PERF_COOKIES,
} from "@/lib/perf-cookies";
import type { PartnerOnboardingStatus } from "@/types/database";

function attachPerfCookies(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get(PERF_COOKIES.returning)) {
    response.cookies.set(PERF_COOKIES.returning, "1", {
      path: "/",
      maxAge: PERF_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  if (
    request.nextUrl.pathname.startsWith("/services") &&
    request.cookies.get(catalogVersionCookieName)?.value !== CATALOG_CACHE_VERSION
  ) {
    response.cookies.set(catalogVersionCookieName, CATALOG_CACHE_VERSION, {
      path: "/",
      maxAge: PERF_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith("sb-") && cookie.name.includes("auth")) {
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
      });
      request.cookies.delete(cookie.name);
    }
  }
}

function isStaleRefreshTokenError(error: { code?: string; message?: string; status?: number } | null) {
  if (!error) return false;
  const message = error.message?.toLowerCase() || "";
  return (
    error.code === "refresh_token_not_found" ||
    error.code === "session_not_found" ||
    message.includes("refresh token not found") ||
    message.includes("invalid refresh token")
  );
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));
}

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/agent")) {
    const url = request.nextUrl.clone();
    url.pathname = path.replace(/^\/agent/, "/partner");
    return NextResponse.redirect(url);
  }

  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  const isPartnerRoute = path.startsWith("/partner");
  const isUserRoute = path.startsWith("/user");
  const isAdminRoute = path.startsWith("/admin");
  const isProtectedPortal = isPartnerRoute || isUserRoute || isAdminRoute;
  const hasAuthCookie = hasSupabaseAuthCookie(request);

  // Anonymous public traffic: skip Supabase round-trip (biggest TTFB win for marketing pages).
  if (!hasAuthCookie) {
    if (isProtectedPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
    return attachPerfCookies(request, NextResponse.next({ request }));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const staleSession = isStaleRefreshTokenError(authError);
  if (staleSession) {
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // ignore
    }
    clearSupabaseAuthCookies(request, supabaseResponse);
  }

  const sessionUser = staleSession ? null : user;

  if (isProtectedPortal && !sessionUser) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  let profileCache: {
    role: string | null;
    kyc_status?: string | null;
    partner_onboarding_status?: string | null;
    partner_agreements_accepted_at?: string | null;
  } | null = null;

  async function loadProfile() {
    if (!sessionUser) return null;
    if (profileCache) return profileCache;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, kyc_status, partner_onboarding_status, partner_agreements_accepted_at")
      .eq("id", sessionUser.id)
      .single();
    profileCache = profile ?? { role: null };
    return profileCache;
  }

  if (sessionUser && isAuthRoute) {
    const profile = await loadProfile();
    const role = profile?.role ?? null;
    if (!role) {
      return supabaseResponse;
    }

    const url = request.nextUrl.clone();
    if (role === "agent") {
      const { getPartnerOnboardingPath, isPartnerOnboardingComplete } = await import(
        "@/lib/partner-onboarding"
      );
      if (profile && !isPartnerOnboardingComplete(profile as Parameters<typeof isPartnerOnboardingComplete>[0])) {
        url.pathname = getPartnerOnboardingPath(
          profile.partner_onboarding_status as PartnerOnboardingStatus | null | undefined,
          {
          agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
        });
        if (url.pathname !== path) {
          return NextResponse.redirect(url);
        }
        return supabaseResponse;
      }
    }

    url.pathname = getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
    if (url.pathname !== path) {
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (sessionUser && isAdminRoute) {
    const profile = await loadProfile();
    const role = profile?.role ?? null;
    const adminRoles = ["super_admin", "operations_manager", "service_team"];
    if (!role || !adminRoles.includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
      return NextResponse.redirect(url);
    }
  }

  if (sessionUser && isPartnerRoute) {
    const profile = await loadProfile();
    const role = profile?.role ?? null;
    if (role !== "agent") {
      const url = request.nextUrl.clone();
      url.pathname = role === "user" ? "/user" : getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
      return NextResponse.redirect(url);
    }

    if (profile?.role === "agent") {
      const { getPartnerOnboardingPath, isPartnerOnboardingComplete, isPartnerOnboardingPath } =
        await import("@/lib/partner-onboarding");
      const onboardingDone = isPartnerOnboardingComplete(
        profile as Parameters<typeof isPartnerOnboardingComplete>[0]
      );
      const onOnboarding = isPartnerOnboardingPath(path);

      if (!onboardingDone && !onOnboarding) {
        const url = request.nextUrl.clone();
        url.pathname = getPartnerOnboardingPath(
          profile.partner_onboarding_status as PartnerOnboardingStatus | null | undefined,
          {
          agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
        });
        return NextResponse.redirect(url);
      }

      if (onboardingDone && onOnboarding) {
        const url = request.nextUrl.clone();
        url.pathname = "/partner";
        return NextResponse.redirect(url);
      }

      if (
        onboardingDone &&
        pathRequiresKyc(path, "partner") &&
        profile.kyc_status !== "approved"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/partner/kyc";
        url.searchParams.set("required", "true");
        return NextResponse.redirect(url);
      }
    }
  }

  if (sessionUser && isUserRoute) {
    const profile = await loadProfile();
    const role = profile?.role ?? null;
    if (role !== "user") {
      const url = request.nextUrl.clone();
      url.pathname = role === "agent" ? "/partner" : getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
      return NextResponse.redirect(url);
    }

    if (pathRequiresKyc(path, "user") && profile?.kyc_status !== "approved") {
      const url = request.nextUrl.clone();
      url.pathname = "/user/kyc";
      url.searchParams.set("required", "true");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
