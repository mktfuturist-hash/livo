"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions";

export type SidebarUser = {
  name: string | null;
  email: string | null;
  image: string | null;
} | null;

type NavItem = { href: string; label: string; icon: string; group?: boolean };

const NAV: NavItem[] = [
  { href: "/", label: "홈", icon: "🏠" },
  // 계층: 영역 > 목표 > 프로젝트 > 할 일 / 루틴
  { href: "/areas", label: "영역", icon: "🗂️", group: true },
  { href: "/goals", label: "목표", icon: "🎯" },
  { href: "/projects", label: "프로젝트", icon: "📁" },
  { href: "/tasks", label: "할 일", icon: "✅" },
  { href: "/routines", label: "루틴", icon: "🔁" },
  // 기록·관리
  { href: "/notes", label: "노트", icon: "📝", group: true },
  { href: "/reviews", label: "계획·회고", icon: "🪞" },
  { href: "/money", label: "머니", icon: "💰" },
];

const MOBILE_TABS = ["/", "/tasks", "/routines", "/money"];
const mobileNav = MOBILE_TABS.map(
  (href) => NAV.find((item) => item.href === href)!,
);

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  // 랜딩·로그인은 풀페이지(full-bleed) 라우트 — 앱 셸 없이 그린다
  if (pathname === "/landing" || pathname === "/login") return null;
  return (
    <>
      {/* 데스크톱 사이드바 — 슬랙식 다크 네이비 */}
      <aside className="hidden w-52 shrink-0 bg-navy md:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <Link href="/" className="mb-6 block px-2">
            <span className="text-lg font-bold tracking-tight text-white">WID</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-navy-faint">
              What I Do makes me Wiser.
            </span>
          </Link>
          <nav className="space-y-0.5">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <div key={item.href}>
                  {item.group && (
                    <div className="my-2 border-t border-navy-soft" />
                  )}
                  <Link
                    href={item.href}
                    className={`relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-navy-soft font-medium text-white"
                        : "text-navy-text hover:bg-navy-soft/60 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-brand" />
                    )}
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-navy-soft pt-3">
            {user ? (
              <div className="flex items-center gap-2 px-1">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-7 w-7 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-soft text-xs text-white">
                    {(user.name ?? user.email ?? "?").slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-xs text-navy-text">
                  {user.name ?? user.email}
                </span>
                <form action={logout}>
                  <button className="text-xs text-navy-faint hover:text-white">
                    로그아웃
                  </button>
                </form>
              </div>
            ) : (
              <p className="px-1 text-xs text-navy-faint">로컬 모드</p>
            )}
          </div>
        </div>
      </aside>

      {/* 모바일 하단 탭바: 홈·할일·루틴·가계부 */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden">
        {mobileNav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "font-semibold text-brand-deep" : "text-neutral-400"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
