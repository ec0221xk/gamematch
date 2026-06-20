"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Textarea } from "@/components/ui";
import type { OfferingDetail } from "@/lib/queries/offerings";

interface BookingFormProps {
  offering: OfferingDetail;
}

/**
 * 申込内容をbookingsへ保存するフォーム。
 * category_id・priceは申込時点のcreator_gamesの値をスナップショットとして保存する
 * (後でCreatorが料金を変更しても、過去の申込内容は変わらない)。
 */
export function BookingForm({ offering }: BookingFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const redirectTo = `/creators/${offering.creatorId}/request?offering=${offering.id}`;
      router.push(`/login?${new URLSearchParams({ redirectTo }).toString()}`);
      return;
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      user_id: user.id,
      creator_id: offering.creatorId,
      creator_game_id: offering.id,
      category_id: offering.categoryId,
      price: offering.price,
      message: message.trim() || null,
    });

    if (insertError) {
      setError(`送信に失敗しました: ${insertError.message}`);
      setIsLoading(false);
      return;
    }

    const params = new URLSearchParams({ creator: offering.creatorName });
    router.push(`/booking/complete?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        label="メッセージ(任意)"
        name="message"
        placeholder="希望する時間帯や、伝えたいことがあればご記入ください。"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" isLoading={isLoading}>
        申込む
      </Button>
    </form>
  );
}
