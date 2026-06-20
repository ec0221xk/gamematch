"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

/**
 * 申込フォームのメッセージ欄や、自己紹介の入力などで使う複数行テキスト入力。
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, name, rows = 4, ...props }, ref) => {
    const textareaId = id ?? name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          className={cn(
            "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
