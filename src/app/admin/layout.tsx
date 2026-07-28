import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * /admin配下は運営(=ADMIN_USER_IDと一致するユーザー)のみアクセス可能。
 * 非管理者には存在自体を伏せるため、リダイレクトではなくnotFound()で404を返す。
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    notFound();
  }

  return <>{children}</>;
}
