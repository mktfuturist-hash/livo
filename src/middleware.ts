import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig, authEnabled } from "@/auth.config";

// edge-safe 인스턴스 (DB 콜백 없음 — JWT 존재 여부만 확인)
const { auth } = NextAuth(authConfig);

export async function middleware(req: NextRequest) {
  if (!authEnabled) return NextResponse.next();
  const session = await auth();
  if (!session && !req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons).*)"],
};
