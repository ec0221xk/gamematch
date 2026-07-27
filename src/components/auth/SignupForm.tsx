"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";
import { toUserErrorMessage } from "@/lib/utils/errorMessage";

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
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!agreed) {
      setError("利用規約・プライバシーポリシーへの同意と、18歳以上であることの確認が必要です。");
      return;
    }

    setIsLoading(true);

    try {
      // 同意したことのDB保存は行わない(現状agreedカラムが無く、今回はスキーマ変更なしで
      // フロント側の登録阻止のみで対応する方針。証跡を残す必要が出た場合は
      // profilesにterms_agreed_at等のカラムを追加して保存する想定)。
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
          data: { display_name: displayName },
        },
      });

      if (signUpError) {
        setError(toUserErrorMessage(signUpError, "SignupForm: signUp failed"));
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
        console.error("SignupForm: profile insert failed", profileError);
        setError(
          "アカウントは作成されましたが、プロフィールの作成に失敗しました。時間をおいて再度お試しください。",
        );
        setIsLoading(false);
        return;
      }

      router.push("/welcome");
      router.refresh();
    } catch (err) {
      setError(toUserErrorMessage(err, "SignupForm: unexpected error"));
      setIsLoading(false);
    }
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
      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span>
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            利用規約
          </Link>
          ・
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            プライバシーポリシー
          </Link>
          に同意し、18歳以上であることを確認しました
        </span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {notice && <p className="text-sm text-brand-700">{notice}</p>}
      <Button type="submit" isLoading={isLoading} disabled={!agreed} className="mt-2">
        登録する
      </Button>
    </form>
  );
}
