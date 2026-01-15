
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabaseMiddleware";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  createSupabaseMiddlewareClient(req, res); // just sync cookies
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
