import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "brand" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  brand: "bg-brand-50 text-brand-700",
  outline: "border border-gray-300 text-gray-600",
};

/**
 * カテゴリ名・ランクなどの短いラベル表示に使う。
 */
export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
