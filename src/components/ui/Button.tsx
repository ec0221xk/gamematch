"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import {
  buttonBaseStyles,
  buttonSizeStyles,
  buttonVariantStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

/**
 * アプリ全体で使う共通ボタン。
 * variant: "primary"(申込・登録など主要操作) / "outline" / "ghost"
 * 画面遷移を伴うCTAには、このButtonではなくButtonLink(`@/components/ui`)を使うこと
 * (<a>の中に<button>を入れる構造を避けるため)。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonBaseStyles,
          buttonVariantStyles[variant],
          buttonSizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? "送信中..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
