import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Creatorカード・フォームなど、白背景に枠線+影を付けた共通コンテナ。
 * Airbnbのようなクリーンで信頼感のあるトーンを意識し、装飾は最小限にしている。
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
