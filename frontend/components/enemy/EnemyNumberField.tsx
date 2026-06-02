import type { InputHTMLAttributes } from "react";

type EnemyNumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  label: string;
  description?: string;
  value: number;
  onValueChange: (value: number) => void;
};

const FIELD_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm leading-6";

export default function EnemyNumberField({
  label,
  description,
  value,
  onValueChange,
  className,
  ...props
}: EnemyNumberFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-neutral-800">
        {label}
        {description ? (
          <span className="mt-1 block text-xs font-normal leading-5 text-neutral-500">
            {description}
          </span>
        ) : null}
      </span>
      <input
        {...props}
        type="number"
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className={[FIELD_CLASS, className].filter(Boolean).join(" ")}
      />
    </label>
  );
}
