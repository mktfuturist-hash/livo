import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { currentUser } from "@/lib/session";
import { authEnabled } from "@/auth.config";

export const metadata: Metadata = {
  title: "Livo",
  description: "Work·Life·Money 세 기둥으로 목표와 진척을 한눈에 관리하는 개인 OS",
  appleWebApp: { capable: true, title: "Livo", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await currentUser();
  // 프로덕션에서 비로그인 방문자(랜딩·설명서)에게는 앱 셸(사이드바) 없이 보여준다
  const showSidebar = !authEnabled || !!user;
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-neutral-50 text-neutral-900">
        <div className="flex min-h-screen">
          {showSidebar && <Sidebar user={user} />}
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
