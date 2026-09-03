"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardTabsProps {
  isCreator: boolean;
  /** 運営からの未読メッセージ件数。0件のときはバッジを表示しない */
  unreadMessageCount?: number;
}

/**
 * /dashboard配下の4ページ(マイページ/受け取った申込/申込状況/運営からのお知らせ)を行き来するためのタブ。
 * ヘッダーから個別リンクを外した代わりに、マイページ経由でここに辿り着ける。
 */
export function DashboardTabs({
  isCreator,
  unreadMessageCount = 0,
}: DashboardTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/profile", label: "マイページ" },
    ...(isCreator
      ? [{ href: "/dashboard/requests", label: "受け取った申込" }]
      : []),
    { href: "/dashboard/my-requests", label: "申込状況" },
    { href: "/dashboard/messages", label: "運営からのお知らせ" },
  ];

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-2xl gap-6 px-6">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 border-b-2 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.href === "/dashboard/messages" && unreadMessageCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadMessageCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
