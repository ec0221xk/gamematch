/**
 * Tailwindのclassを結合するための小さなユーティリティ。
 * 条件付きでクラスを付けたい場合に `cn("base", isActive && "active")` のように使う。
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
