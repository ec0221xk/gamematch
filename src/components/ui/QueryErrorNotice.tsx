import { cn } from "@/lib/utils/cn";

interface QueryErrorNoticeProps {
  className?: string;
  message?: string;
}

/**
 * 一覧取得に失敗したときの共通表示。
 * 「データが0件」の空状態カード(グレーの破線)とは区別できるよう、
 * 赤系の配色にしている。
 */
export function QueryErrorNotice({
  className,
  message = "読み込みに失敗しました。時間をおいて再度お試しください。",
}: QueryErrorNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-red-200 bg-red-50 px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}
