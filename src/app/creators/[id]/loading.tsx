import { Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-24 text-sm text-gray-400">
      <Spinner />
      読み込み中...
    </main>
  );
}
