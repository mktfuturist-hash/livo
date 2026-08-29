import Link from "next/link";
import { dday, todayStr } from "@/lib/dates";
import { PILLARS, type Pillar } from "@/components/ui";

const KAKAO_URL = "https://open.kakao.com/o/goPP41Ki";
const DEADLINE = "2026-09-07";

function isClosed(): boolean {
  if (process.env.EARLYBIRD_CLOSED === "1") return true;
  return todayStr() > DEADLINE;
}

function Cta({ closed }: { closed: boolean }) {
  if (closed) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-100 px-6 py-4 text-center">
        <p className="font-semibold text-neutral-500">얼리버드 모집이 마감됐어요</p>
        <p className="mt-1 text-sm text-neutral-400">
          정식 오픈 소식은 준비되는 대로 알릴게요.
        </p>
      </div>
    );
  }
  return (
    <div className="text-center">
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-block w-full max-w-sm rounded-xl bg-neutral-900 px-8 py-4 text-lg font-bold text-white shadow-md transition hover:bg-neutral-700"
      >
        얼리버드 신청하기
      </a>
      <p className="mt-2 text-xs text-neutral-400">
        누르면 오픈채팅으로 입장합니다 · 별도 가입 절차 없음
      </p>
    </div>
  );
}

/** 목표→오늘의 할 일→진척바 미니 데모 (CSS 목업) */
function MiniDemo() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-bold">💰 비상금 3,000만원 모으기</span>
        <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-600">
          D-126
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full w-[42%] rounded-full bg-amber-500" />
        </div>
        <span className="text-xs tabular-nums text-neutral-500">42%</span>
      </div>
      <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3">
        <p className="text-xs font-semibold text-neutral-400">오늘의 할 일</p>
        {[
          { title: "월 저축 이체 확인하기", done: true },
          { title: "고정비 구독 1개 해지", done: false },
        ].map((t) => (
          <div key={t.title} className="flex items-center gap-2.5">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                t.done
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-transparent"
              }`}
            >
              ✓
            </span>
            <span className={`text-sm ${t.done ? "text-neutral-400 line-through" : ""}`}>
              {t.title}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
            ✓ 아침 30분 독서 <span className="opacity-80">🔥12</span>
          </span>
          <span className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs text-neutral-400">
            저녁 러닝
          </span>
        </div>
      </div>
    </div>
  );
}

const PILLAR_INTRO: { pillar: Pillar; title: string; desc: string }[] = [
  { pillar: "work", title: "Work", desc: "커리어 목표를 세우고, 바쁜 업무 속에서도 방향을 점검해요" },
  { pillar: "life", title: "Life", desc: "건강·가족·성장 — 미루던 삶의 목표를 루틴으로 굳혀요" },
  { pillar: "money", title: "Money", desc: "계좌 잔액만 갱신하면 순자산과 돈 목표 진척률이 자동 계산돼요" },
];

export function Landing() {
  const closed = isClosed();
  const d = dday(DEADLINE);

  return (
    <div className="mx-auto max-w-2xl space-y-14 pb-16 pt-4">
      {/* 1. 마감 배지 + 2. 타이틀 + 3. 히어로 카피 */}
      <section className="space-y-5 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600">
          얼리버드 30명 한정
          {!closed && d >= 0 && <span>· 9/7 마감 {d === 0 ? "D-day" : `D-${d}`}</span>}
        </div>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          멈추지 않는 올해
        </h1>
        <p className="text-lg font-semibold text-neutral-500">
          남은 4달, 90일 루틴 챌린지
        </p>
        <div className="mx-auto max-w-lg space-y-1.5 text-[15px] leading-relaxed text-neutral-600">
          <p>매일 강의만 듣고 목표만 세우다 한 해가 끝나지는 않으셨나요?</p>
          <p>문제는 목표를 루틴화하지 못했기 때문이에요.</p>
          <p>
            <b className="text-neutral-900">목표를 구조화하고, 할 일을 설정하고, 루틴화하세요.</b>
          </p>
          <p>Livo와 함께면 올해의 목표를 달성할 수 있어요.</p>
        </div>
        {/* 4. CTA ① */}
        <Cta closed={closed} />
      </section>

      {/* 5. 미니 데모 */}
      <section className="space-y-4">
        <h2 className="text-center text-2xl font-bold">
          목표를 <span className="text-blue-600">오늘</span>로
        </h2>
        <p className="text-center text-sm text-neutral-500">
          막연한 목표를 오늘의 할 일로 쪼개면, 진척률이 저절로 차오릅니다
        </p>
        <MiniDemo />
      </section>

      {/* 6. 3기둥 */}
      <section className="space-y-4">
        <h2 className="text-center text-2xl font-bold">작은 루틴, 큰 성공</h2>
        <p className="text-center text-sm text-neutral-500">
          인생의 세 기둥을 한 화면에서 — Livo는 일·삶·돈을 함께 관리하는 목표 실행 OS입니다
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PILLAR_INTRO.map(({ pillar, title, desc }) => (
            <div key={pillar} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className={`text-sm font-bold ${PILLARS[pillar].color}`}>
                {PILLARS[pillar].icon} {title}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 90일 계산 */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-xl font-bold">지금 시작하면, 올해 안에 결과를 봅니다</h2>
        <div className="mx-auto mt-4 flex max-w-md items-center justify-between text-sm">
          <div>
            <div className="text-lg font-bold">9월 초</div>
            <div className="text-xs text-neutral-400">목표 설정</div>
          </div>
          <div className="h-px flex-1 bg-neutral-200" />
          <div className="px-2">
            <div className="text-lg font-bold text-emerald-600">90일</div>
            <div className="text-xs text-neutral-400">루틴 실행</div>
          </div>
          <div className="h-px flex-1 bg-neutral-200" />
          <div>
            <div className="text-lg font-bold">12월 초</div>
            <div className="text-xs text-neutral-400">올해 목표 완주</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          내년 계획을 세우는 12월에, 당신은 이미 하나를 끝내 둔 사람이 됩니다.
        </p>
      </section>

      {/* 8. 명분 + 자격 */}
      <section className="space-y-3 text-center">
        <h2 className="text-xl font-bold">왜 30명에게만 드리냐면요</h2>
        <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-neutral-600">
          함께 목표를 향해 달렸던 동기님들께 가장 먼저 열어드려요.
          <br />
          <b className="text-neutral-900">첫 30명의 피드백이 Livo의 다음 버전을 만듭니다.</b>
        </p>
        <p className="text-sm text-neutral-400">
          자격은 하나 — <b className="text-neutral-600">올해 이루고 싶은 목표가 하나라도 있는 분</b>
        </p>
      </section>

      {/* 9. CTA ② */}
      <section>
        <Cta closed={closed} />
      </section>

      {/* 10. 푸터 */}
      <footer className="border-t border-neutral-200 pt-6 text-center text-sm text-neutral-400">
        <p>
          이미 얼리버드 멤버신가요?{" "}
          <a href="/api/auth/signin" className="font-medium text-neutral-600 underline">
            구글로 로그인
          </a>
        </p>
        <p className="mt-2">
          <Link href="/guide" className="underline hover:text-neutral-600">
            사용 설명서 미리 보기
          </Link>
        </p>
      </footer>
    </div>
  );
}
