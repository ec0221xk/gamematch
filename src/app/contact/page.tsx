import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-semibold text-gray-900"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}>
        お問い合わせ
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        ご質問・ご意見・ご要望はX(旧Twitter)のDMからお気軽にどうぞ。
        できる限り迅速に対応いたします。
      </p>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 text-center"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p className="text-4xl mb-4">𝕏</p>
        <p className="font-semibold text-gray-900">@ec0221xk</p>
        <p className="mt-1 text-sm text-gray-500">DMでのご連絡を歓迎します</p>
        <a
          href="https://x.com/ec0221xk"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
        >
          X でDMを送る
        </a>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          お問い合わせ前に確認
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/faq" className="text-sm font-medium text-indigo-600 hover:underline">
            よくある質問 →
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-indigo-600 hover:underline">
            ご利用の流れ →
          </Link>
          <Link href="/safety" className="text-sm font-medium text-indigo-600 hover:underline">
            安心して利用するために →
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center">
        <ButtonLink href="/" variant="outline" size="sm">
          トップへ戻る
        </ButtonLink>
      </div>
    </main>
  );
}
