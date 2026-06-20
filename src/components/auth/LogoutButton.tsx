"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, type ButtonProps } from "@/components/ui";

type LogoutButtonProps = Omit<ButtonProps, "onClick" | "isLoading">;

/**
 * ヘッダーやマイページなど、どこからでも呼び出せる共通ログアウトボタン。
 */
export function LogoutButton(props: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      isLoading={isLoading}
      onClick={handleLogout}
      {...props}
    >
      ログアウト
    </Button>
  );
}
