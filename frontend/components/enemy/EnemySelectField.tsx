import type { ChangeEventHandler, SelectHTMLAttributes } from "react";

type EnemySelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label: string;
  description?: string;
  options: readonly string[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

const FIELD_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm leading-6";

export default function EnemySelectField({
  label,
  description,
  options,
  className,
  ...props
}: EnemySelectFieldProps) {
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
      <select {...props} className={[FIELD_CLASS, className].filter(Boolean).join(" ")}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
