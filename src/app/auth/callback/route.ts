import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * メール確認リンクの着地点。SupabaseからPKCEの`code`を受け取り、
 * セッションに交換したうえで`next`(未指定時は/)へリダイレクトする。
 * 会員登録時にprofilesが未作成の場合(Confirm emailがON)、ここで作成する。
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          display_name:
            (data.user.user_metadata?.display_name as string | undefined) ||
            data.user.email ||
            "",
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
