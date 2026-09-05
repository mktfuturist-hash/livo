import { redirect } from "next/navigation";
import { auth, authEnabled } from "@/auth";
import { getDevUserId } from "@/lib/user";

/** 현재 로그인 사용자의 내부 id. 미로그인 시 로그인 페이지로 보낸다. */
export async function requireUserId(): Promise<number> {
  if (!authEnabled) return getDevUserId();
  const session = await auth();
  const uid = (session as unknown as { uid?: number } | null)?.uid;
  if (!uid) redirect("/login");
  return uid;
}

/** 어드민 여부 — ADMIN_EMAIL 환경변수와 로그인 계정 이메일이 일치할 때만. 로컬(무인증)은 허용.
    세션의 user.email은 로그인 경로(GIS/리다이렉트)에 따라 비어 있을 수 있어 DB 이메일로 판별한다. */
export async function isAdmin(): Promise<boolean> {
  if (!authEnabled) return true;
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!admin) return false;
  const session = await auth();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  if (sessionEmail) return sessionEmail === admin;
  const uid = (session as unknown as { uid?: number } | null)?.uid;
  if (!uid) return false;
  const { db } = await import("@/db");
  const { users } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const [u] = await db.select({ email: users.email }).from(users).where(eq(users.id, uid));
  return !!u && u.email.trim().toLowerCase() === admin;
}

/** 사이드바 표시용 — 미로그인/로컬이면 null */
export async function currentUser(): Promise<{
  name: string | null;
  email: string | null;
  image: string | null;
} | null> {
  if (!authEnabled) return null;
  const session = await auth();
  if (!session?.user) return null;
  return {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  };
}
