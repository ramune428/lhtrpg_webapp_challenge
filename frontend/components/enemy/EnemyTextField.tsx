import type { ChangeEventHandler, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  description?: string;
};

type EnemyTextInputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    onChange: ChangeEventHandler<HTMLInputElement>;
  };

type EnemyTextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
  };

const FIELD_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm leading-6";

function FieldLabel({ label, description }: BaseProps) {
  return (
    <span className="block text-sm font-medium text-neutral-800">
      {label}
      {description ? (
        <span className="mt-1 block text-xs font-normal leading-5 text-neutral-500">
          {description}
        </span>
      ) : null}
    </span>
  );
}

export function EnemyTextInput({
  label,
  description,
  className,
  ...props
}: EnemyTextInputProps) {
  return (
    <label className="block space-y-2">
      <FieldLabel label={label} description={description} />
      <input {...props} className={[FIELD_CLASS, className].filter(Boolean).join(" ")} />
    </label>
  );
}

export function EnemyTextarea({
  label,
  description,
  className,
  ...props
}: EnemyTextareaProps) {
  return (
    <label className="block space-y-2">
      <FieldLabel label={label} description={description} />
      <textarea
        {...props}
        className={[FIELD_CLASS, "min-h-28", className].filter(Boolean).join(" ")}
      />
    </label>
  );
}
