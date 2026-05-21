import type { ChangeEventHandler } from "react";

export default function EnemyFileImportButton({
  onChange,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="mb-8">
      <label className="inline-block cursor-pointer rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium transition hover:bg-neutral-50">
        入力ファイル読込
        <input
          type="file"
          accept="application/json,.json,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
