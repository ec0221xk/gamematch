export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonBaseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 disabled:cursor-not-allowed";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-200",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400",
  ghost: "text-gray-700 hover:bg-gray-100 disabled:text-gray-400",
};

export const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};
