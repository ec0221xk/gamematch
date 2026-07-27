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

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("LogoutButton: signOut failed", error);
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("LogoutButton: unexpected error", err);
      setIsLoading(false);
    }
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
