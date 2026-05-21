import type { ReactNode } from "react";

type FormControlProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function FormControl({ label, children, className = "" }: FormControlProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-neutral-900">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-500";

export const readOnlyInputClassName =
  "w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-700 outline-none";

export const textareaClassName =
  "min-h-[120px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-500";

export const smallButtonClassName =
  "rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50";

export const buttonClassName =
  "rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60";
