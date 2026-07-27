"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";
import { toUserErrorMessage } from "@/lib/utils/errorMessage";

interface DeleteOfferingButtonProps {
  offeringId: string;
}

export function DeleteOfferingButton({ offeringId }: DeleteOfferingButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setIsLoading(true);

    try {
      const { error: deleteError } = await supabase
        .from("creator_games")
        .delete()
        .eq("id", offeringId);

      if (deleteError) {
        setError(toUserErrorMessage(deleteError, "DeleteOfferingButton: delete failed"));
        setIsLoading(false);
        setIsConfirming(false);
        return;
      }

      router.refresh();
    } catch (err) {
      setError(toUserErrorMessage(err, "DeleteOfferingButton: unexpected error"));
      setIsLoading(false);
      setIsConfirming(false);
    }
  }

  if (isConfirming) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">本当に削除しますか？</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isLoading}
            onClick={handleDelete}
          >
            削除する
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={() => setIsConfirming(false)}
          >
            キャンセル
          </Button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsConfirming(true)}
      >
        削除
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
