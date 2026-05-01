import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const STUDENT_ROUTES = ["/dashboard", "/tutor", "/progress"];
const PARENT_ROUTES = ["/parent"];
const AUTH_ROUTES = ["/login", "/signup"];
const PUBLIC_ROUTES = ["/", "/pricing"];

export async function middleware(request: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Redirect logged-in users away from auth pages
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const profile = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const dest = profile.data?.role === "parent" ? "/parent" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Protect authenticated routes
  const isStudentRoute = STUDENT_ROUTES.some((r) => pathname.startsWith(r));
  const isParentRoute = PARENT_ROUTES.some((r) => pathname.startsWith(r));

  if ((isStudentRoute || isParentRoute) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (isStudentRoute || isParentRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // Students cannot access parent routes
    if (role === "student" && isParentRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Parents cannot access student routes
    if (role === "parent" && isStudentRoute) {
      return NextResponse.redirect(new URL("/parent", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
