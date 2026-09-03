"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Textarea } from "@/components/ui";
import { toUserErrorMessage } from "@/lib/utils/errorMessage";
import type { AdminMessageRow } from "@/lib/queries/messages";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface MessageThreadProps {
  userId: string;
  messages: AdminMessageRow[];
}

/**
 * 「運営からのお知らせ」(/dashboard/messages)の会話表示+返信フォーム。
 * 返信の保存はRLS(admin_messages_insert_own_reply)で許可された範囲(自分の返信のみ)で行う。
 */
export function MessageThread({ userId, messages }: MessageThreadProps) {
  const router = useRouter();
  const supabase = createClient();

  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (body.trim().length === 0) {
      setError("本文を入力してください。");
      return;
    }

    setError(null);
    setIsSending(true);

    try {
      const { data, error: insertError } = await supabase
        .from("admin_messages")
        .insert({ user_id: userId, sender_is_admin: false, body: body.trim() })
        .select("id")
        .single();

      if (insertError || !data) {
        setError(toUserErrorMessage(insertError, "MessageThread: insert failed"));
        setIsSending(false);
        return;
      }

      setBody("");
      router.refresh();

      // 運営への通知メール送信に失敗しても、返信自体は既に保存済みなので画面上は成功扱いにする
      fetch("/api/messages/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: data.id }),
      }).catch((err) => {
        console.error("MessageThread: notify-admin failed", err);
      });
    } catch (err) {
      setError(toUserErrorMessage(err, "MessageThread: unexpected error"));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.length === 0 ? (
        <p className="text-sm text-gray-500">まだ運営からのメッセージはありません。</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.senderIsAdmin
                  ? "self-start bg-gray-100 text-gray-900"
                  : "self-end bg-brand-50 text-brand-900"
              }`}
            >
              <p className="text-xs text-gray-400">
                {message.senderIsAdmin ? "運営" : "あなた"}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap">{message.body}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatDateTime(message.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="運営への返信を入力"
          rows={3}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <Button size="sm" isLoading={isSending} disabled={isSending} onClick={handleSend}>
            返信する
          </Button>
        </div>
      </div>
    </div>
  );
}
