"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Select, Textarea } from "@/components/ui";
import type { GameOption } from "@/lib/queries/games";
import type { CategoryOption } from "@/lib/queries/categories";

const UNIT_OPTIONS = ["1時間", "90分", "3試合", "1回"];

interface OfferingFormProps {
  games: GameOption[];
  categories: CategoryOption[];
  mode: "create" | "edit";
  offeringId?: string;
  initialValues?: {
    gameId: string;
    categoryId: number;
    rank: string;
    price: number;
    unit: string;
    description: string;
  };
}

/**
 * 新規サービスの追加(mode="create")と、既存サービスの編集(mode="edit")の両方で使う。
 * 1人のCreatorが複数のゲーム/カテゴリを登録できるよう、creator_games単位で保存する。
 * 最初の1件をinsertした時点で、DB側のトリガーによりprofiles.is_creatorが自動でtrueになる。
 */
export function OfferingForm({
  games,
  categories,
  mode,
  offeringId,
  initialValues,
}: OfferingFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [gameId, setGameId] = useState(initialValues?.gameId ?? "");
  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId ? String(initialValues.categoryId) : "",
  );
  const [rank, setRank] = useState(initialValues?.rank ?? "");
  const [price, setPrice] = useState(
    initialValues?.price !== undefined ? String(initialValues.price) : "",
  );
  const [unit, setUnit] = useState(initialValues?.unit ?? UNIT_OPTIONS[0]);
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!gameId || !categoryId || !price) {
      setError("ゲーム・カテゴリ・料金は必須です。");
      return;
    }

    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("ログイン状態を確認できませんでした。再度ログインしてください。");
      setIsLoading(false);
      return;
    }

    const payload = {
      creator_id: user.id,
      game_id: gameId,
      category_id: Number(categoryId),
      rank: rank.trim() || null,
      price: Number(price),
      unit,
      description: description.trim() || null,
    };

    const { error: saveError } =
      mode === "edit" && offeringId
        ? await supabase.from("creator_games").update(payload).eq("id", offeringId)
        : await supabase.from("creator_games").insert(payload);

    if (saveError) {
      setError(`保存に失敗しました: ${saveError.message}`);
      setIsLoading(false);
      return;
    }

    if (mode === "create") {
      setGameId("");
      setCategoryId("");
      setRank("");
      setPrice("");
      setUnit(UNIT_OPTIONS[0]);
      setDescription("");
    }

    setIsLoading(false);
    router.refresh();
  }

  const gameOptions = games.map((game) => ({
    label: game.name,
    value: game.id,
  }));
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: String(category.id),
  }));
  const unitOptions = UNIT_OPTIONS.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="ゲーム"
          placeholder="選択してください"
          options={gameOptions}
          value={gameId}
          onChange={(event) => setGameId(event.target.value)}
        />
        <Select
          label="カテゴリ"
          placeholder="選択してください"
          options={categoryOptions}
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="ランク(任意)"
          placeholder="例: マスター"
          value={rank}
          onChange={(event) => setRank(event.target.value)}
        />
        <Input
          label="料金(円)"
          type="number"
          min={0}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>
      <Select
        label="料金の単位"
        options={unitOptions}
        value={unit}
        onChange={(event) => setUnit(event.target.value)}
      />
      <Textarea
        label="説明(任意)"
        placeholder="例: フレンドリーにランクマッチを一緒に回ります。"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" isLoading={isLoading} className="self-start">
        {mode === "edit" ? "更新する" : "追加する"}
      </Button>
    </form>
  );
}
