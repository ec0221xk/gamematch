import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
import {
  buttonBaseStyles,
  buttonSizeStyles,
  buttonVariantStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * ボタンの見た目をしたリンク。Hero/HeaderのCTAなど、画面遷移を伴う箇所で使う。
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonBaseStyles,
        buttonVariantStyles[variant],
        buttonSizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
