import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-lg",
};

/**
 * Creator/Userのプロフィール画像。
 * 画像が無い場合は名前の頭文字を表示する(信頼感を損なわないフォールバック)。
 */
export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const initial = alt.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-medium text-brand-700",
        sizeStyles[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
