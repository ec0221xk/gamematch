import { ButtonLink } from "@/components/ui";

export default function CreatorNotFound() {
  return (
    <main className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-lg font-medium text-gray-900">
        Creatorが見つかりません
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        URLが間違っているか、削除された可能性があります。
      </p>
      <div className="mt-6 flex justify-center">
        <ButtonLink href="/creators" variant="outline" size="sm">
          Creator一覧へ戻る
        </ButtonLink>
      </div>
    </main>
  );
}
