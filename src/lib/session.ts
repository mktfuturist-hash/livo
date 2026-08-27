import { redirect } from "next/navigation";
import { auth, authEnabled } from "@/auth";
import { getDevUserId } from "@/lib/user";

/** 현재 로그인 사용자의 내부 id. 미로그인 시 로그인 페이지로 보낸다. */
export async function requireUserId(): Promise<number> {
  if (!authEnabled) return getDevUserId();
  const session = await auth();
  const uid = (session as unknown as { uid?: number } | null)?.uid;
  if (!uid) redirect("/api/auth/signin");
  return uid;
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
