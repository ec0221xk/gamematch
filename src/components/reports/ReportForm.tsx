"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Select, Textarea } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import type { ReportReason } from "@/lib/types/database";

interface ReportFormProps {
  reportedUserId: string;
}

const REASON_OPTIONS: (SelectOption & { value: ReportReason })[] = [
  { label: "不適切な言動", value: "inappropriate_behavior" },
  { label: "出会い目的", value: "solicitation" },
  { label: "詐欺・金銭トラブル", value: "fraud" },
  { label: "その他", value: "other" },
];

/**
 * reportsへ通報内容を保存するフォーム。BookingFormと同じく
 * Client ComponentからSupabase SDKを直接呼び出す方式。
 * 自己通報の防止は/creators/[id]/report(サーバー側)と
 * reports_not_self check制約(DB側)でも行っているが、
 * ここでも念のため送信直前に弾く。
 */
export function ReportForm({ reportedUserId }: ReportFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [reason, setReason] = useState<ReportReason>(
    REASON_OPTIONS[0].value,
  );
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // middleware.tsで保護されているため通常は発生しないが、
      // セッション切れなどに備えたフォールバック。
      const redirectTo = `/creators/${reportedUserId}/report`;
      router.push(`/login?${new URLSearchParams({ redirectTo }).toString()}`);
      return;
    }

    if (user.id === reportedUserId) {
      setError("自分自身を通報することはできません。");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId,
      reason,
      detail: detail.trim() || null,
    });

    if (insertError) {
      setError(`送信に失敗しました: ${insertError.message}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsDone(true);
  }

  if (isDone) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-900">
          通報を受け付けました。運営が確認します。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="理由"
        name="reason"
        options={REASON_OPTIONS}
        value={reason}
        onChange={(event) => setReason(event.target.value as ReportReason)}
      />
      <Textarea
        label="詳細(任意)"
        name="detail"
        placeholder="具体的な状況があればご記入ください。"
        value={detail}
        onChange={(event) => setDetail(event.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" isLoading={isLoading}>
        通報する
      </Button>
    </form>
  );
}
