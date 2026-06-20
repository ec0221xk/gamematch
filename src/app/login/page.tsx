import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui";

interface LoginPageProps {
  searchParams: { redirectTo?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900">ログイン</h1>
      <p className="mt-1 text-sm text-gray-500">
        登録したメールアドレスとパスワードを入力してください。
      </p>
      <Card className="mt-6">
        <LoginForm redirectTo={searchParams.redirectTo} />
      </Card>
      <p className="mt-6 text-center text-sm text-gray-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          会員登録
        </Link>
      </p>
    </main>
  );
}
