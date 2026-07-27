/**
 * Supabase等から返るエラーを、ユーザー向けの日本語メッセージに変換する。
 * 生のエラー内容はconsole.errorにのみ残し、UIには漏らさない。
 */

const KNOWN_ERROR_MESSAGES: [pattern: string, message: string][] = [
  ["User already registered", "既に登録済みのメールアドレスです。"],
  ["Invalid login credentials", "メールアドレスまたはパスワードが正しくありません。"],
  ["Email not confirmed", "メールアドレスの確認が完了していません。確認メールをご確認ください。"],
  ["Password should be at least", "パスワードは6文字以上で入力してください。"],
  ["rate limit", "しばらく時間をおいてから再度お試しください。"],
];

const FALLBACK_MESSAGE = "処理に失敗しました。時間をおいて再度お試しください。";

function extractRawMessage(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }
  return undefined;
}

/**
 * @param error 発生した生のエラー(Supabaseのerror、catchした例外など)
 * @param context どこで発生したかを示すログ用の識別子(例: "SignupForm: signUp failed")
 */
export function toUserErrorMessage(error: unknown, context: string): string {
  console.error(context, error);

  const rawMessage = extractRawMessage(error);
  if (!rawMessage) {
    return FALLBACK_MESSAGE;
  }

  const matched = KNOWN_ERROR_MESSAGES.find(([pattern]) =>
    rawMessage.includes(pattern),
  );

  return matched ? matched[1] : FALLBACK_MESSAGE;
}
