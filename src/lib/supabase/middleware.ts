import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPortalPathForRole } from "@/lib/portal-config";

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
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
  } = await supabase.auth.getUser();

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

  if (isProtectedPortal && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  let profileRole: string | null = null;

  async function loadRole() {
    if (!user) return null;
    if (profileRole) return profileRole;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profileRole = profile?.role ?? null;
    return profileRole;
  }

  if (user && isAuthRoute) {
    const role = await loadRole();
    const url = request.nextUrl.clone();
    url.pathname = role ? getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]) : "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAdminRoute) {
    const role = await loadRole();
    const adminRoles = ["super_admin", "operations_manager", "service_team"];
    if (!role || !adminRoles.includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
      return NextResponse.redirect(url);
    }
  }

  if (user && isPartnerRoute) {
    const role = await loadRole();
    if (role !== "agent") {
      const url = request.nextUrl.clone();
      url.pathname = role === "user" ? "/user" : getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
      return NextResponse.redirect(url);
    }

    const orderRoutes = ["/partner/services", "/partner/orders/new"];
    const needsKyc = orderRoutes.some((r) => path.startsWith(r));

    if (needsKyc) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("kyc_status, role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "agent" && profile.kyc_status !== "approved") {
        const url = request.nextUrl.clone();
        url.pathname = "/partner/kyc";
        url.searchParams.set("required", "true");
        return NextResponse.redirect(url);
      }
    }
  }

  if (user && isUserRoute) {
    const role = await loadRole();
    if (role !== "user") {
      const url = request.nextUrl.clone();
      url.pathname = role === "agent" ? "/partner" : getPortalPathForRole(role as Parameters<typeof getPortalPathForRole>[0]);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
