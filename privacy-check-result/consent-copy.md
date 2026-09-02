# 동의 화면 문구 (로그인 페이지용)

## 왜 필요한가

개인정보 보호법 제15조 제2항: 수집·이용 동의를 받을 때 ① 목적 ② 항목 ③ 보유 기간 ④ 거부권과 불이익, 4가지를 **동의 화면에서** 알려야 한다. 처리방침 링크로 갈음할 수 없다.

## 교체할 곳

[src/app/login/login-card.tsx:210-216](../src/app/login/login-card.tsx) — 현행 "로그인하면 개인정보처리방침에 동의한 것으로 봐요."

## 권장 문구 (JSX)

```tsx
<div className="space-y-1.5 text-xs leading-relaxed text-neutral-400">
  <p>
    구글로 로그인하면 아래 개인정보 수집·이용에 동의한 것으로 봅니다.
  </p>
  <ul className="list-disc pl-4">
    <li>항목: 이메일 주소, 이름, 프로필 사진 (구글 계정에서 제공)</li>
    <li>목적: 회원 식별 및 로그인, 사용자별 데이터 분리</li>
    <li>보유 기간: 회원 탈퇴(삭제 요청) 시까지</li>
  </ul>
  <p>
    동의를 거부할 수 있으며, 거부 시 로그인이 필요한 기능을 이용할 수 없습니다.{" "}
    <Link href="/privacy" className="underline hover:text-neutral-600">
      개인정보처리방침 전문 보기
    </Link>
  </p>
</div>
```

## 동의 기록 (권장 스키마)

`src/db/schema.ts`의 `users` 테이블에 추가:

```ts
privacyAgreedAt: timestamp("privacy_agreed_at", { withTimezone: true }),
privacyPolicyVersion: text("privacy_policy_version"), // 예: "2026-09-02"
```

가입 upsert(`src/auth.ts` jwt 콜백)에서 최초 생성 시 기록한다.

## 마케팅 수신동의

현재 광고성 발송 수단이 없어 **해당 없음**. 뉴스레터·알림톡을 붙이는 시점에:
- 필수 동의와 분리된 별도 체크박스 (기본 해제)
- 매체를 열거해 동의 (이메일/SMS/카카오는 각각 별개 매체)
- 동의일 저장 + 2년마다 재확인
