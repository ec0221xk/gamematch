#!/usr/bin/env node
/**
 * サイト内リンク切れチェッカー。
 *
 * トップページから<a href>で辿れる内部リンクを再帰的にクロールし、
 * 404等のエラーになるページを検出する。
 * 「Header/Footer/本文にリンクは貼られているが実体のページが無い」ケース
 * (過去の/faqの404)を検出するために作成した。
 *
 * 使い方:
 *   node scripts/check-links.mjs                       # http://localhost:3000 を起点にクロール
 *   node scripts/check-links.mjs http://localhost:3001  # 起点URLを指定
 *
 * 注意:
 * - ログインが必要なページ(/dashboard配下, /admin等)へのリンクは、
 *   未ログイン状態のHTMLには出現しないため、このスクリプトの対象外。
 * - 外部リンク(他ドメイン)・mailto:・tel:・javascript:・#アンカーのみのリンクは対象外。
 */

const baseUrlArg = process.argv[2] ?? process.env.CHECK_LINKS_BASE_URL ?? "http://localhost:3000";
const base = new URL(baseUrlArg);

const EXCLUDE_PREFIXES = ["mailto:", "tel:", "javascript:"];
const HREF_RE = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi;
const REQUEST_TIMEOUT_MS = 10000;
const MAX_PAGES = 500; // 無限クロール防止の安全弁

function normalizeUrl(href, fromUrl) {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (EXCLUDE_PREFIXES.some((p) => trimmed.startsWith(p))) return null;

  let url;
  try {
    url = new URL(trimmed, fromUrl);
  } catch {
    return null;
  }
  if (url.origin !== base.origin) return null; // 外部リンクは対象外
  url.hash = ""; // ページ内アンカー違いは同一ページとして扱う
  return url.toString();
}

function extractLinks(html, fromUrl) {
  const links = new Set();
  let match;
  HREF_RE.lastIndex = 0;
  while ((match = HREF_RE.exec(html)) !== null) {
    const normalized = normalizeUrl(match[1], fromUrl);
    if (normalized) links.add(normalized);
  }
  return links;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const referrers = new Map(); // url -> Set<referrerUrl>
  const results = new Map(); // url -> status(number) | string(エラーメッセージ)
  const queue = [];
  const queued = new Set();

  function enqueue(url, referrer) {
    if (!referrers.has(url)) referrers.set(url, new Set());
    if (referrer) referrers.get(url).add(referrer);
    if (!queued.has(url)) {
      queued.add(url);
      queue.push(url);
    }
  }

  enqueue(base.toString(), null);

  while (queue.length > 0 && results.size < MAX_PAGES) {
    const url = queue.shift();
    if (results.has(url)) continue;

    let status;
    let html = "";
    try {
      const res = await fetchWithTimeout(url);
      status = res.status;
      const contentType = res.headers.get("content-type") ?? "";
      if (status < 400 && contentType.includes("text/html")) {
        html = await res.text();
      }
    } catch (err) {
      status = `ERROR: ${err.message}`;
    }

    results.set(url, status);
    process.stdout.write(`[${status}] ${url}\n`);

    if (html) {
      for (const link of extractLinks(html, url)) {
        enqueue(link, url);
      }
    }
  }

  const broken = [];
  const ok = [];
  for (const [url, status] of results) {
    if (typeof status === "number" && status < 400) {
      ok.push(url);
    } else {
      broken.push({ url, status, referrers: [...(referrers.get(url) ?? [])] });
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`巡回したURL数: ${results.size}`);
  console.log(`正常: ${ok.length}`);
  console.log(`エラー: ${broken.length}`);
  console.log("=".repeat(60));

  if (broken.length === 0) {
    console.log("\nリンク切れは見つかりませんでした。");
  } else {
    console.log("\n=== リンク切れ一覧 ===");
    for (const b of broken) {
      console.log(`\n[${b.status}] ${b.url}`);
      console.log(`  リンク元: ${b.referrers.length > 0 ? b.referrers.join(", ") : "(起点URL)"}`);
    }
  }

  process.exitCode = broken.length > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error("check-links failed:", err);
  process.exitCode = 1;
});
