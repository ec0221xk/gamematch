import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { Card } from "@/components/ui";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900">会員登録</h1>
      <p className="mt-1 text-sm text-gray-500">
        メールアドレスとパスワードだけで登録できます。
      </p>
      <Card className="mt-6">
        <SignupForm />
      </Card>
      <p className="mt-6 text-center text-sm text-gray-500">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          ログイン
        </Link>
      </p>
    </main>
  );
}
