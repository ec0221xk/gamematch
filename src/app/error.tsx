"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Server Component等で例外が発生した際のフォールバック画面。
 * 生のエラー内容はconsole.errorにのみ残し、UIには汎用文言のみ表示する。
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("GlobalError:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-lg font-medium text-gray-900">
        エラーが発生しました
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        時間をおいて再度お試しください。
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => reset()}>
          再読み込み
        </Button>
        <ButtonLink href="/" variant="ghost" size="sm">
          トップへ戻る
        </ButtonLink>
      </div>
    </main>
  );
}
