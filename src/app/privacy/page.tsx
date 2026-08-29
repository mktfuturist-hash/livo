import Link from "next/link";

export const metadata = { title: "개인정보처리방침 — WID" };

const EFFECTIVE = "2026년 8월 29일";
const CONTACT = "mktfuturist@gmail.com";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16 pt-4">
      <header className="space-y-2">
        <p className="text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-600">← WID 홈으로</Link>
        </p>
        <h1 className="text-3xl font-bold">개인정보처리방침</h1>
        <p className="text-sm text-neutral-500">시행일: {EFFECTIVE}</p>
      </header>

      <section className="space-y-6 text-[15px] leading-relaxed text-neutral-700">
        <div>
          <h2 className="mb-2 text-lg font-bold">1. 수집하는 개인정보</h2>
          <p>
            WID는 구글 계정으로 로그인할 때 다음 정보를 구글로부터 제공받습니다:
            <b> 이메일 주소, 이름, 프로필 사진</b>. 이 외의 개인정보(비밀번호 등)는 수집하지
            않습니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold">2. 이용 목적</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>회원 식별 및 로그인 (구글 OAuth)</li>
            <li>사용자별 데이터 분리 — 각 사용자가 입력한 내용은 본인 계정에만 연결됩니다</li>
            <li>서비스 관련 공지 (필요한 경우에 한함)</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold">3. 서비스 이용 중 저장되는 정보</h2>
          <p>
            사용자가 직접 입력하는 목표·할 일·루틴·노트·가계부 등의 데이터는 서비스 제공을
            위해 클라우드 데이터베이스에 암호화된 연결로 저장되며, <b>본인 계정으로만 접근할
            수 있습니다.</b> 운영자는 서비스 운영·장애 대응에 필요한 최소한의 범위에서만
            데이터에 접근합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold">4. 제3자 제공 및 광고</h2>
          <p>
            수집한 개인정보를 제3자에게 판매하거나 제공하지 않으며, 광고 목적으로 사용하지
            않습니다. 서비스 인프라 제공을 위해 Vercel(호스팅)과 Neon(데이터베이스)을
            이용합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold">5. 보유 기간 및 삭제</h2>
          <p>
            개인정보와 입력 데이터는 회원 탈퇴(삭제 요청) 시까지 보관됩니다. 계정 및 데이터
            삭제를 원하시면 아래 연락처로 요청해 주세요. 확인 후 지체 없이 삭제합니다.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-bold">6. 문의</h2>
          <p>
            개인정보 관련 문의·삭제 요청: <b>{CONTACT}</b>
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-200 pt-4 text-sm text-neutral-400">
        본 방침은 서비스 변경에 따라 갱신될 수 있으며, 변경 시 이 페이지에 반영됩니다.
      </footer>
    </div>
  );
}
