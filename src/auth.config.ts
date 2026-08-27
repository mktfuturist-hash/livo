import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Google OAuth 환경변수가 있을 때만 인증 활성화. 없으면(로컬 개발) 바이패스.
export const authEnabled = !!(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);

// Edge(미들웨어)에서도 안전한 설정만 — DB를 만지는 콜백은 auth.ts에서 추가한다.
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? "dev-only-secret",
  trustHost: true,
  session: { strategy: "jwt" },
  providers: authEnabled ? [Google] : [],
};
