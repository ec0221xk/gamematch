/**
 * 一覧取得系クエリの戻り値。取得失敗(ok: false)と、正常取得したが0件(ok: true, data: [])を
 * 呼び出し側で区別できるようにするためのラッパー。
 */
export type QueryResult<T> = { ok: true; data: T } | { ok: false };
