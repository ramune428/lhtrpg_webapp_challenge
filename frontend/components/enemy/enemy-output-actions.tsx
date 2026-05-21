import { buttonClassName } from "@/components/ui/form-control";

type EnemyOutputActionsProps = {
  result: string;
  onGenerate: () => void;
  onCopy: () => void;
  onDownloadXlsx: () => void;
  onDownloadJson: () => void;
};

export default function EnemyOutputActions({
  result,
  onGenerate,
  onCopy,
  onDownloadXlsx,
  onDownloadJson,
}: EnemyOutputActionsProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onGenerate} className={buttonClassName}>
          コマンドを生成する
        </button>

        <button type="button" onClick={onCopy} className={buttonClassName}>
          コピー
        </button>
      </div>

      <textarea
        value={result}
        readOnly
        className="min-h-[180px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
      />

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onDownloadXlsx}
          className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
        >
          Download XLSX
        </button>

        <button
          type="button"
          onClick={onDownloadJson}
          className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
        >
          Download JSON
        </button>
      </div>
    </>
  );
}
