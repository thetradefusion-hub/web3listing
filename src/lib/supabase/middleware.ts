import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  const isAgentRoute = path.startsWith("/agent");
  const isAdminRoute = path.startsWith("/admin");

  if ((isAgentRoute || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (profile?.role === "super_admin" || profile?.role === "operations_manager") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/agent";
    }
    return NextResponse.redirect(url);
  }

  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const adminRoles = ["super_admin", "operations_manager", "service_team"];
    if (!profile || !adminRoles.includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/agent";
      return NextResponse.redirect(url);
    }
  }

  if (user && isAgentRoute) {
    const orderRoutes = ["/agent/services", "/agent/orders/new"];
    const needsKyc = orderRoutes.some((r) => path.startsWith(r));

    if (needsKyc) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("kyc_status, role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "agent" && profile.kyc_status !== "approved") {
        const url = request.nextUrl.clone();
        url.pathname = "/agent/kyc";
        url.searchParams.set("required", "true");
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
