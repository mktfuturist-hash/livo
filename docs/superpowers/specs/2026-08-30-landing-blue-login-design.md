# 랜딩 블루톤 리스타일 + 커스텀 구글 로그인 — 설계

2026-08-30 / 브랜치 `feature/landing-blue-login`
사용자 승인: 대화에서 방향 확정 후 "자러갈게" 위임 — 문서 리뷰 게이트 생략.

## 목표

1. **랜딩(/landing)**: 밝은 블루톤 배경 + 강조 타이포 강약. Airbridge 참고(눈썹 라벨 → 큰 제목 → 짧은 설명). 카피·섹션 구성은 유지.
2. **헤더**: 랜딩 우측 상단에 [로그인]([/login]) + [얼리버드 신청](카카오 오픈챗) 스티키 헤더.
3. **푸터**: 구글 스타일 로그인 버튼 → /login.
4. **사이드바**: 로그인 후 앱 사이드바를 슬랙식 다크 네이비로.
5. **/login**: 로고 + 키카피 + GIS(Google Identity Services) 버튼. 브라우저에 구글 세션 있으면 계정 개인화 표시.
6. **카톡 인앱브라우저 대응**: 아래 진단 참고.

## 카톡 인앱브라우저 진단

- 구글은 임베디드 웹뷰에서 OAuth를 차단한다(`403 disallowed_useragent`). 카톡 인앱브라우저는 웹뷰 → 구글 로그인 실패.
- WID 얼리버드 동선이 카카오 오픈챗 중심이라 **회원 대부분이 카톡 안에서 링크를 열 가능성이 높음** — 발생 확률 높은 실제 이슈.
- GIS 버튼도 웹뷰에서는 렌더되지 않으므로 같은 문제.

**대응 설계** (/login 클라이언트에서):
- UA에 `KAKAOTALK` 감지 → `kakaotalk://web/openExternal?url=<현재URL>` 스킴으로 기본 브라우저 강제 오픈(안드/iOS 모두 지원되는 카카오 공식 스킴).
- 자동 이동 실패 대비: "외부 브라우저로 열기" 버튼 + 링크 복사 버튼 + "우측 하단 메뉴 → 다른 브라우저로 열기" 안내.
- 기타 인앱(인스타그램·LINE·NAVER 앱 등) UA 감지 시: 강제 오픈 스킴이 없으므로 안내 + 링크 복사 UI만.
- 일반 브라우저: GIS 버튼 + 예비로 표준 OAuth 리다이렉트 버튼.

## 인증 구조

- `auth.config.ts`: `pages: { signIn: "/login" }` 추가 (edge 안전).
- `auth.ts`: Credentials 프로바이더 `google-gis` 추가 — GIS가 준 ID 토큰을 `jose`로 검증(구글 JWKS, iss=accounts.google.com, aud=AUTH_GOOGLE_ID) 후 `{email,name,image}` 반환 → 기존 jwt 콜백의 upsert 재사용.
- `middleware.ts`: PUBLIC_PATHS에 `/login` 추가, 리다이렉트 대상 `/api/auth/signin` → `/login`.
- 클라이언트 ID는 서버 컴포넌트에서 `process.env.AUTH_GOOGLE_ID`를 prop으로 전달(클라이언트 ID는 공개값).
- 로컬(authEnabled=false): GIS 숨기고 "로컬 모드 — 로그인 없이 / 로 이동" 안내.

## 운영 체크(사장님 할 일)

- Google Cloud Console → OAuth 클라이언트 → **승인된 JavaScript 원본**에 `http://localhost:3000`, `https://wid-planner.vercel.app` 추가해야 GIS 버튼이 뜬다. (리디렉션 URI는 기존 그대로.)

## 컬러·타이포

- 토큰은 기존 `--color-brand(#009EFA) / brand-deep(#3B6896) / brand-mist(#DAF3FF)` 재사용. 사이드바용 다크 네이비 `--color-navy(#0e2a54)` / `--color-navy-soft(#1b3d6e)` 추가(앱 아이콘 네이비 계열).
- 랜딩: 히어로 `brand-mist→white` 그라데이션 배경, 헤드라인 `text-5xl~6xl font-extrabold text-brand-deep`, 강조 단어만 `text-brand`. 섹션 = 파란 눈썹 라벨(11px, 대문자/자간) → `text-3xl` 제목 → 본문. CTA·진척바 = brand. 마감 배지는 빨강 유지(긴급성).
- 사이드바: navy 배경, 글자 `#c9d8ee`계열, 활성 = `navy-soft` 배경 + 흰 글자 + 좌측 brand 바, 호버 = navy-soft/60.

## 범위 밖

- 앱 내부 화면들 리스타일, 카피 변경, 다크 테마.
