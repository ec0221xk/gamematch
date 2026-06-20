"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * 検索フィルター(ゲーム名・カテゴリ)やプロフィール編集のプルダウンで使う。
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, options, placeholder, id, name, value, defaultValue, ...props },
    ref,
  ) => {
    const selectId = id ?? name;
    const isControlled = value !== undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={
            isControlled ? undefined : defaultValue ?? (placeholder ? "" : undefined)
          }
          className={cn(
            "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";
