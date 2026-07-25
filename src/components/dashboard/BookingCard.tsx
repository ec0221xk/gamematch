"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge, Button, Card } from "@/components/ui";
import type { BookingSummary } from "@/lib/queries/bookings";

const STATUS_LABEL: Record<BookingSummary["status"], string> = {
  pending: "申込中",
  accepted: "承認済み",
  declined: "辞退済み",
  completed: "完了",
};

const STATUS_VARIANT: Record<
  BookingSummary["status"],
  "default" | "brand" | "outline" | "danger"
> = {
  pending: "outline",
  accepted: "brand",
  declined: "danger",
  completed: "default",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface BookingCardProps {
  booking: BookingSummary;
  otherPartyLabel: string;
  /** trueのとき、pending中の申込に承認/辞退ボタンを表示する(Creator画面のみ) */
  showActions?: boolean;
}

export function BookingCard({
  booking,
  otherPartyLabel,
  showActions = false,
}: BookingCardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [status, setStatus] = useState(booking.status);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "accepted" | "declined" | null
  >(null);

  async function updateStatus(next: "accepted" | "declined") {
    setError(null);
    setPendingAction(next);

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: next })
      .eq("id", booking.id);

    if (updateError) {
      setError(`更新に失敗しました: ${updateError.message}`);
      setPendingAction(null);
      return;
    }

    setStatus(next);
    setPendingAction(null);
    router.refresh();
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{otherPartyLabel}</p>
          <p className="text-sm font-medium text-gray-900">
            {booking.otherPartyName}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-700">
        <p>
          {booking.gameName} ・ {booking.categoryName}
        </p>
        <p className="text-gray-500">
          ¥{booking.price.toLocaleString()} / {booking.unit}
        </p>
        {booking.message && (
          <p className="whitespace-pre-wrap text-gray-600">{booking.message}</p>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        {formatDateTime(booking.createdAt)}
      </p>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {showActions && status === "pending" && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            isLoading={pendingAction === "accepted"}
            disabled={pendingAction !== null}
            onClick={() => updateStatus("accepted")}
          >
            承認する
          </Button>
          <Button
            size="sm"
            variant="outline"
            isLoading={pendingAction === "declined"}
            disabled={pendingAction !== null}
            onClick={() => updateStatus("declined")}
          >
            辞退する
          </Button>
        </div>
      )}
    </Card>
  );
}
