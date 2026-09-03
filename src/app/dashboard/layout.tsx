import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getUnreadAdminMessageCount } from "@/lib/queries/messages";

/**
 * 未ログイン時はタブを出さない。各ページ側の認証チェック(redirect)はそのまま維持する。
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const [{ data: profile }, unreadMessageCount] = await Promise.all([
    supabase.from("profiles").select("is_creator").eq("id", user.id).single(),
    getUnreadAdminMessageCount(user.id),
  ]);

  return (
    <>
      <DashboardTabs
        isCreator={profile?.is_creator ?? false}
        unreadMessageCount={unreadMessageCount}
      />
      {children}
    </>
  );
}
