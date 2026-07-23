"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

/**
 * メールアドレス + パスワードのみの会員登録フォーム。
 * 登録成功後、profilesテーブルに初期データ(display_name)を作成する。
 * CreatorかUserかはここでは選択させない(creator_gamesを登録した時点で自動的にCreatorを兼任する設計のため)。
 */
export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
        data: { display_name: displayName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // SupabaseプロジェクトでEmail確認(Confirm email)がONになっている場合、
    // ここではまだセッションが発行されない。
    // その場合はメール内のリンク→/auth/callbackでセッション確立とprofiles作成を行う。
    if (!data.session || !data.user) {
      setNotice(
        "確認メールを送信しました。メール内のリンクをクリックしたうえでログインしてください。",
      );
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      display_name: displayName,
    });

    if (profileError) {
      setError(
        `アカウントは作成されましたが、プロフィールの作成に失敗しました: ${profileError.message}`,
      );
      setIsLoading(false);
      return;
    }

    router.push("/welcome");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="表示名"
        name="display_name"
        placeholder="例: あおい"
        required
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />
      <Input
        label="メールアドレス"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="パスワード"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={6}
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {notice && <p className="text-sm text-brand-700">{notice}</p>}
      <Button type="submit" isLoading={isLoading} className="mt-2">
        登録する
      </Button>
    </form>
  );
}
