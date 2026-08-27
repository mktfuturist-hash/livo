import { db, users } from "@/db";

/** 이메일 기준 upsert — 구글 로그인 = 회원가입. 내부 user id를 반환한다. */
export async function upsertUser(
  email: string,
  name: string | null,
  image: string | null
): Promise<number> {
  const [u] = await db
    .insert(users)
    .values({ email: email.toLowerCase(), name, image })
    .onConflictDoUpdate({
      target: users.email,
      set: { name: name ?? undefined, image: image ?? undefined },
    })
    .returning({ id: users.id });
  return u.id;
}

// 로컬 개발(인증 미설정) 전용 가짜 사용자
const globalDev = globalThis as unknown as { __devUid?: number };

export async function getDevUserId(): Promise<number> {
  if (globalDev.__devUid) return globalDev.__devUid;
  const id = await upsertUser("dev@localhost", "로컬 개발", null);
  globalDev.__devUid = id;
  return id;
}
