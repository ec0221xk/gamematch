"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

interface DeleteOfferingButtonProps {
  offeringId: string;
}

export function DeleteOfferingButton({ offeringId }: DeleteOfferingButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    await supabase.from("creator_games").delete().eq("id", offeringId);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      isLoading={isLoading}
      onClick={handleDelete}
    >
      削除
    </Button>
  );
}
