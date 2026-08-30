import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig, authEnabled } from "@/auth.config";

// edge-safe 인스턴스 (DB 콜백 없음 — JWT 존재 여부만 확인)
const { auth } = NextAuth(authConfig);

// 비로그인에게도 열리는 경로 (랜딩·사용 설명서·로그인)
const PUBLIC_PATHS = ["/", "/landing", "/guide", "/privacy", "/login"];

export async function middleware(req: NextRequest) {
  if (!authEnabled) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-icon.png|manifest.webmanifest|icons).*)"],
};
