# 사이트에 붙이기 — 동의 UI · 페이지 · DB

문서를 만들었으면 실제로 붙어야 끝난다. 처리방침은 **홈페이지에 지속적으로 게재**해야 하고, 약관은 **가입 화면에서 제대로 보여줘야** 효력이 있다.

---

## 1. DB 스키마 (Supabase / PostgreSQL)

```sql
-- 신청·가입 테이블에 동의 기록 컬럼을 추가한다
alter table public.signups
  add column if not exists terms_agreed_at            timestamptz,
  add column if not exists privacy_agreed_at          timestamptz,
  add column if not exists marketing_consent          boolean not null default false,
  add column if not exists marketing_consent_at       timestamptz,
  add column if not exists marketing_consent_channels text[] not null default '{}',
  add column if not exists marketing_consent_night    boolean not null default false,
  add column if not exists marketing_consent_version  text,
  add column if not exists marketing_revoked_at       timestamptz,
  add column if not exists consent_ip                 inet;
```

**각 컬럼이 왜 필요한지**

| 컬럼 | 없으면 생기는 일 |
|---|---|
| `marketing_consent_at` | **2년마다 재확인 의무를 이행할 수 없다.** 재확인 시 "동의한 날짜"를 고지해야 하는데 날짜가 없다 |
| `marketing_consent_channels` | SMS 동의로 카카오톡을 보내게 된다. 매체별 동의 위반 |
| `marketing_consent_night` | 21~08시 발송 가능 여부를 판단할 수 없다 |
| `marketing_consent_version` | 문구를 바꾼 뒤 "무엇에 동의받았는지" 증명할 수 없다 |
| `terms_agreed_at` / `consent_ip` | 분쟁 시 **"약관을 명시했다"의 증거**가 없다 |

### RLS

Supabase는 기본적으로 잠겨 있다. 신청 폼이 동작하려면 insert 정책이 필요하다.

```sql
alter table public.signups enable row level security;

-- 누구나 신청은 할 수 있게
create policy "anyone can insert signup"
  on public.signups for insert
  to anon, authenticated
  with check (true);

-- 조회는 관리자만 (service_role 키를 서버에서만 사용)
-- anon 에게는 select 정책을 주지 않는다
```

> **anon 에게 select 정책을 열어 두면 신청자 명단이 전부 공개된다.** 어드민은 서버 사이드에서 `service_role` 키로 조회한다. 브라우저 코드에 `service_role` 키를 절대 넣지 않는다.

### 마케팅 수신 대상 조회

```sql
-- 이메일 광고를 보낼 수 있는 사람
select email from public.signups
where marketing_consent = true
  and marketing_revoked_at is null
  and 'email' = any(marketing_consent_channels)
  and marketing_consent_at > now() - interval '2 years';   -- 재확인 안 한 사람 제외

-- 2년 재확인이 필요한 사람
select email, marketing_consent_at from public.signups
where marketing_consent = true
  and marketing_revoked_at is null
  and marketing_consent_at <= now() - interval '2 years';
```

---

## 2. 동의 UI

### React / Next.js

```tsx
const CONSENT_VERSION = "2026-08-30";   // 문구를 바꾸면 이 값을 올린다

const CHANNELS = [
  { key: "email", label: "이메일" },
  { key: "sms",   label: "문자(SMS)" },
  { key: "kakao", label: "카카오톡" },
  { key: "push",  label: "앱 푸시" },
] as const;

function ConsentBlock({ value, onChange }) {
  const toggleChannel = (key: string) => {
    const next = value.channels.includes(key)
      ? value.channels.filter((c) => c !== key)
      : [...value.channels, key];
    onChange({ ...value, channels: next, marketing: next.length > 0 });
  };

  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">약관 동의</legend>

      {/* 필수 — 각각 분리한다. 하나로 묶으면 안 된다 */}
      <label className="flex items-start gap-2">
        <input type="checkbox" required
               checked={value.terms}
               onChange={(e) => onChange({ ...value, terms: e.target.checked })} />
        <span>
          <b>[필수]</b> 서비스 이용약관에 동의합니다{" "}
          <a href="/terms" target="_blank" className="underline">전문 보기</a>
        </span>
      </label>

      <label className="flex items-start gap-2">
        <input type="checkbox" required
               checked={value.privacy}
               onChange={(e) => onChange({ ...value, privacy: e.target.checked })} />
        <span>
          <b>[필수]</b> 개인정보 수집·이용에 동의합니다{" "}
          <a href="/privacy" target="_blank" className="underline">전문 보기</a>
        </span>
      </label>

      {/* 선택 — 기본값은 반드시 체크 해제 */}
      <label className="flex items-start gap-2">
        <input type="checkbox"
               checked={value.marketing}
               onChange={(e) => onChange({
                 ...value,
                 marketing: e.target.checked,
                 channels: e.target.checked ? value.channels : [],
                 night: e.target.checked ? value.night : false,
               })} />
        <span>
          <b>[선택]</b> <b>광고성 정보</b> 수신에 동의합니다
        </span>
      </label>

      {/* 매체를 반드시 명시한다 */}
      {value.marketing && (
        <div className="ml-6 space-y-2">
          <div className="flex flex-wrap gap-3">
            {CHANNELS.map((c) => (
              <label key={c.key} className="flex items-center gap-1.5">
                <input type="checkbox"
                       checked={value.channels.includes(c.key)}
                       onChange={() => toggleChannel(c.key)} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
          <label className="flex items-start gap-2">
            <input type="checkbox"
                   checked={value.night}
                   onChange={(e) => onChange({ ...value, night: e.target.checked })} />
            <span>야간(21시~익일 08시) 수신에 동의합니다</span>
          </label>
        </div>
      )}

      <p className="text-sm text-neutral-500">
        선택 항목에 동의하지 않으셔도 서비스 이용에는 제한이 없습니다.
      </p>
    </fieldset>
  );
}
```

**하지 말 것**
- 「전체 동의」 체크박스 하나로 전부 처리 — 마케팅 동의의 명시성이 깨진다
- 마케팅 체크박스의 `defaultChecked` — 기본값은 해제여야 한다
- "혜택 알림 받기" 같은 문구 — **"광고성 정보"라는 말이 들어가야 한다**
- 이용약관과 개인정보 처리방침을 한 체크박스로

### 저장 (서버 라우트)

```ts
// app/api/signup/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const now = new Date().toISOString();

  if (!body.terms || !body.privacy) {
    return Response.json({ error: "필수 항목에 동의가 필요합니다." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("signups").insert({
    email: body.email,
    name:  body.name ?? null,

    terms_agreed_at:   now,
    privacy_agreed_at: now,

    marketing_consent:          body.marketing === true,
    marketing_consent_at:       body.marketing ? now : null,
    marketing_consent_channels: body.marketing ? (body.channels ?? []) : [],
    marketing_consent_night:    body.marketing ? body.night === true : false,
    marketing_consent_version:  CONSENT_VERSION,

    consent_ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
  });

  if (error) return Response.json({ error: "저장에 실패했습니다." }, { status: 500 });
  return Response.json({ ok: true });
}
```

---

## 3. `/privacy` · `/terms` 페이지

### Next.js App Router — 마크다운을 그대로 렌더

```
app/
├── privacy/page.tsx
├── terms/page.tsx
└── legal/
    ├── privacy.md
    └── terms.md
```

```tsx
// app/privacy/page.tsx
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export const metadata = { title: "개인정보 처리방침" };

export default function PrivacyPage() {
  const md = fs.readFileSync(path.join(process.cwd(), "app/legal/privacy.md"), "utf-8");
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 prose prose-neutral">
      <div dangerouslySetInnerHTML={{ __html: marked.parse(md) as string }} />
    </main>
  );
}
```

`terms/page.tsx`도 같은 형태로 만든다. 문서를 고칠 때 `.md`만 바꾸면 되므로 관리가 쉽다.

### 순수 HTML

`privacy.html`, `terms.html`을 만들고 푸터에서 링크한다. 마크다운을 HTML로 변환해 붙인다.

---

## 4. 푸터

```tsx
<footer className="border-t mt-24 py-10 text-sm text-neutral-500">
  <div className="mx-auto max-w-3xl px-5 space-y-3">
    <nav className="flex gap-5">
      <a href="/terms" className="hover:underline">이용약관</a>
      {/* 처리방침은 굵게 — 관행이자 가독성 요구 */}
      <a href="/privacy" className="font-semibold text-neutral-800 hover:underline">
        개인정보 처리방침
      </a>
    </nav>
    <address className="not-italic leading-relaxed">
      [[상호 또는 운영자명]] · 대표 [[성명]]<br />
      [[주소]]<br />
      문의 [[이메일]]
      {/* 사업자가 있으면 ↓ */}
      <br />사업자등록번호 [[000-00-00000]]
      {/* 유료 결제가 있으면 ↓ */}
      <br />통신판매업 신고번호 [[제0000-00000-0000호]]
    </address>
  </div>
</footer>
```

> **처리방침은 「홈페이지에 지속적으로 게재」해야 한다.** 모든 페이지 푸터에 넣는 게 가장 안전하다.
> 사업자등록이 없으면 사업자등록번호 줄을 지운다. 무료 서비스면 통신판매업 신고번호 줄을 지운다.

---

## 5. 마케팅 발송 시 지켜야 할 코드

### 야간 발송 차단

```ts
// 야간 별도 동의를 안 받았다면 코드로 막는 게 안전하다
function canSendNow(consentNight: boolean, channel: string) {
  if (channel === "email") return true;          // 이메일은 야간 별도 동의 예외
  const hour = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul", hour: "2-digit", hour12: false,
  });
  const h = Number(hour);
  const isNight = h >= 21 || h < 8;
  return !isNight || consentNight;
}
```

### 발송 템플릿

```ts
// 문자
const sms = [
  `(광고) ${SERVICE_NAME}`,          // "(광고)"는 맨 앞. 공백·기호 삽입 금지
  body,
  ``,
  `무료수신거부 ${OPT_OUT_NUMBER}`,   // "무료"가 반드시 들어간다. 맨 끝
].join("\n");

// 이메일 제목
const subject = `(광고) ${SERVICE_NAME} ${title}`;   // "(광고)"는 제목 시작 부분
```

### 수신거부 링크 — 로그인을 요구하지 않는다

```ts
// 서명된 토큰 하나로 원클릭 해지. 본인인증·로그인 요구는 형사처벌 대상이다
// GET /api/unsubscribe?t=<signed-token>
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t");
  const id = verifyUnsubToken(token);            // 실패 시 null
  if (!id) return new Response("유효하지 않은 링크입니다.", { status: 400 });

  await supabaseAdmin.from("signups")
    .update({ marketing_consent: false, marketing_revoked_at: new Date().toISOString() })
    .eq("id", id);

  // 처리 결과를 알려야 한다 (정보통신망법 제50조 제7항)
  return new Response("수신거부가 완료되었습니다. 앞으로 광고성 정보를 보내지 않습니다.", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
```

---

## 6. 붙인 뒤 확인

```
□ /privacy 와 /terms 가 실제로 열린다 (다른 기기에서도)
□ 푸터 링크가 모든 페이지에 있다
□ 가입 폼에서 필수 두 개를 체크하지 않으면 제출이 막힌다
□ 마케팅 체크박스 기본값이 해제다
□ 신청 후 DB에 marketing_consent_at 이 실제로 들어갔다
□ anon 키로 신청자 명단이 조회되지 않는다 (RLS select 정책 확인)
□ 브라우저 코드에 service_role 키가 없다
□ 수신거부 링크가 로그인 없이 한 번에 동작한다
```
