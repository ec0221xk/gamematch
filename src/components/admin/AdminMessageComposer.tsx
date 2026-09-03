"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@/components/ui";
import { toUserErrorMessage } from "@/lib/utils/errorMessage";
import type { UserOption } from "@/lib/queries/adminMessages";

interface AdminMessageComposerProps {
  /** picker: 送信先をチェックボックスで複数選択(一斉送信対応)。single: fixedUserId宛て固定 */
  mode: "picker" | "single";
  users?: UserOption[];
  fixedUserId?: string;
}

/**
 * 運営(管理画面)からユーザーへメッセージを送るフォーム。
 * /admin/messages(新規メッセージ、複数選択可)と/admin/messages/[userId](返信、宛先固定)で共用する。
 */
export function AdminMessageComposer({
  mode,
  users = [],
  fixedUserId,
}: AdminMessageComposerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const filteredUsers = users.filter((u) =>
    u.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleUser(id: string) {
    setSentCount(null);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSend() {
    const userIds = mode === "single" && fixedUserId ? [fixedUserId] : selectedIds;

    if (userIds.length === 0) {
      setError("送信先を選択してください。");
      return;
    }
    if (body.trim().length === 0) {
      setError("本文を入力してください。");
      return;
    }

    setError(null);
    setSentCount(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/admin/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, body: body.trim() }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.error ?? "送信に失敗しました。");
      }

      setBody("");
      setSelectedIds([]);
      setSentCount(payload?.sent ?? userIds.length);
      router.refresh();
    } catch (err) {
      setError(toUserErrorMessage(err, "AdminMessageComposer: send failed"));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {mode === "picker" && (
        <div>
          <input
            type="text"
            placeholder="ユーザーを検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-gray-200">
            {filteredUsers.length === 0 ? (
              <p className="p-3 text-sm text-gray-400">該当するユーザーがいません。</p>
            ) : (
              filteredUsers.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm last:border-b-0 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                  />
                  <span className="text-gray-900">{u.displayName}</span>
                  {u.isCreator && (
                    <span className="text-xs text-brand-600">Creator</span>
                  )}
                </label>
              ))
            )}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {selectedIds.length}件選択中(複数選択で一斉送信できます)
          </p>
        </div>
      )}

      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="メッセージを入力"
        rows={4}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {sentCount !== null && (
        <p className="text-sm text-brand-600">{sentCount}件のメッセージを送信しました。</p>
      )}

      <div>
        <Button size="sm" isLoading={isSending} disabled={isSending} onClick={handleSend}>
          送信する
        </Button>
      </div>
    </div>
  );
}
