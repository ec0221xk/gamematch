import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="読み込み中"
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600",
        className,
      )}
    />
  );
}
