import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-lg font-medium text-gray-900">
        お探しのページは見つかりませんでした
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        URLが間違っているか、ページが削除された可能性があります。
      </p>
      <div className="mt-6 flex justify-center">
        <ButtonLink href="/" variant="outline" size="sm">
          トップページへ戻る
        </ButtonLink>
      </div>
    </main>
  );
}
