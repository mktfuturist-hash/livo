// 1회성 마이그레이션: 단일 사용자 → 멀티유저.
// users 테이블 생성 + 모든 테이블에 user_id 추가 + 기존 데이터를 OWNER_EMAIL 계정으로 백필.
// 실행: node scripts/migrate-multiuser.mjs  (DATABASE_URL 필요)
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "mktfuturist@gmail.com";

const TABLES = [
  "areas", "goals", "milestones", "projects", "tasks", "kpis",
  "routines", "routine_logs", "notes", "reviews",
  "money_accounts", "money_snapshots", "money_txns",
];

const sql = postgres(url, { prepare: false });

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email text NOT NULL,
    name text,
    image text,
    created_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT users_email_unique UNIQUE(email)
  )
`;

const [owner] = await sql`
  INSERT INTO users (email) VALUES (${OWNER_EMAIL})
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id
`;
console.log(`owner: ${OWNER_EMAIL} -> id ${owner.id}`);

for (const t of TABLES) {
  await sql.unsafe(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS user_id integer`);
  const updated = await sql.unsafe(
    `UPDATE ${t} SET user_id = ${owner.id} WHERE user_id IS NULL`
  );
  await sql.unsafe(`ALTER TABLE ${t} ALTER COLUMN user_id SET NOT NULL`);
  await sql.unsafe(`
    DO $$ BEGIN
      ALTER TABLE ${t} ADD CONSTRAINT ${t}_user_id_users_id_fk
        FOREIGN KEY (user_id) REFERENCES users(id);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$
  `);
  console.log(`${t}: backfilled ${updated.count} rows`);
}

await sql.end();
console.log("migration done");
