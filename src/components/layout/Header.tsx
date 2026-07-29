import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ButtonLink } from "@/components/ui";

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          GameMatch
        </Link>

<nav className="hidden items-center gap-6 text-sm text-gray-600 sm:flex">
          <Link href="/how-it-works" className="hover:text-gray-900">
            ご利用の流れ
          </Link>
          <Link href="/faq" className="hover:text-gray-900">
            よくある質問
          </Link>
          <Link href="/safety" className="hover:text-gray-900">
            安心して利用するために
          </Link>
          <Link href="/creators" className="hover:text-gray-900">
            Creatorを探す
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard/profile"
                className="text-sm font-medium text-gray-700 hover:text-gray-900">
                マイページ
              </Link>
              <LogoutButton size="sm" />
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900">
                ログイン
              </Link>
              <ButtonLink href="/signup" size="sm">
                登録
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
