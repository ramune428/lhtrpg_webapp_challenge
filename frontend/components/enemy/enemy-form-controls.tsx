import type { ChangeEventHandler, ReactNode } from "react";
import {
  FormControl,
  inputClassName,
  readOnlyInputClassName,
  textareaClassName,
} from "@/components/ui/form-control";

type TextFieldProps = {
  label: string;
  value: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: "text" | "number";
  readOnly?: boolean;
  min?: number;
  max?: number;
  className?: string;
};

export function EnemyTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
  min,
  max,
  className = "",
}: TextFieldProps) {
  return (
    <FormControl label={label} className={className}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        max={max}
        className={readOnly ? readOnlyInputClassName : inputClassName}
      />
    </FormControl>
  );
}

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
};

export function EnemySelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "",
}: SelectFieldProps<T>) {
  return (
    <FormControl label={label} className={className}>
      <select value={value} onChange={onChange} className={inputClassName}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormControl>
  );
}

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  minHeightClassName?: string;
  className?: string;
};

export function EnemyTextareaField({
  label,
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-[120px]",
  className = "",
}: TextareaFieldProps) {
  return (
    <FormControl label={label} className={className}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${textareaClassName} ${minHeightClassName}`}
      />
    </FormControl>
  );
}

export function EnemyFormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function EnemySectionDivider() {
  return <hr className="my-8 border-neutral-300" />;
}
