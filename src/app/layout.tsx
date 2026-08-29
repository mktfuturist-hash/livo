import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { currentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "WID",
  description:
    "What I Do makes me Wiser. — 오늘 입력한 행동이 모여 내일의 나를 더 현명하게. Work·Life·Money 세 기둥 목표관리",
  appleWebApp: { capable: true, title: "WID", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#3B6896",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await currentUser();
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-neutral-50 text-neutral-900">
        <div className="flex min-h-screen">
          <Sidebar user={user} />
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
