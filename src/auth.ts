import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export { authEnabled } from "./auth.config";

// 구글 로그인 = 회원가입. 첫 로그인 시 users에 upsert하고 내부 id를 JWT에 심는다.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email ?? (token.email as string | undefined);
      if (!token.uid && email) {
        // 동적 import: 이 콜백은 Node 라우트에서만 실행되므로 edge 번들에 db가 딸려가지 않는다
        const { upsertUser } = await import("@/lib/user");
        token.uid = await upsertUser(
          email,
          (user?.name ?? token.name ?? null) as string | null,
          (user?.image ?? token.picture ?? null) as string | null
        );
      }
      return token;
    },
    session({ session, token }) {
      (session as unknown as { uid?: number }).uid = token.uid as number | undefined;
      return session;
    },
  },
});
